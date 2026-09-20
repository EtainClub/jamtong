import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import {
  checkDailyBudget,
  checkOrigin,
  checkRate,
  type GuardVerdict,
} from "@/lib/agent/guard";
import { resolveAnchor } from "@/lib/wiki/anchors";
import { buildWikiContext, WIKI_SYSTEM_PROMPT } from "@/lib/wiki/ask";
import { allPages } from "@/lib/wiki/load";

/**
 * 위키에 묻기 (docs/llm-wiki.md §7 Query).
 *
 * ★ 설계 §8과의 관계를 먼저 밝힌다. 거기서 금지한 것은 **파이프라인
 *   스크립트**가 모델을 부르는 것이다 — ingest·lint의 판단은 저장소를 연
 *   에이전트가 직접 해야 하고, `scripts/wiki-*.ts`는 lint 검사 ⑤가 막는다.
 *   이 경로는 그 파이프라인이 아니라 사용자용 런타임 기능이고, `/api/ask`와
 *   같은 층에 있다.
 *
 * 로그인을 요구한다. `/api/ask`는 누구나 부를 수 있지만 이쪽은 위키 전체를
 * 맥락으로 실어 보내므로 한 번이 더 비싸다. 계정을 요구하면 남용의 비용이
 * 올라가고, 막아야 할 때 누구를 막을지도 분명해진다.
 */

export const runtime = "nodejs";

const requestSchema = z.object({
  question: z.string().min(2).max(300),
});

const answerSchema = z.object({
  grounded: z.boolean().describe("펴 준 위키 페이지만으로 답했는지"),
  message: z.string().describe("한국어 답변. 옮긴 사실에는 위키에 있던 앵커를 그대로 단다"),
  pages: z.array(z.string()).describe("근거로 삼은 위키 페이지 이름"),
});

const MODEL = process.env.WIKI_ASK_MODEL ?? process.env.ASK_MODEL ?? "claude-haiku-4-5";

function refuse(verdict: Extract<GuardVerdict, { ok: false }>): Response {
  console.warn(`[wiki-ask] 차단: ${verdict.reason}`);
  return Response.json({ error: verdict.error }, { status: verdict.status });
}

/**
 * 파이어베이스 ID 토큰을 확인한다.
 *
 * firebase-admin은 이 저장소에서 스크립트용(devDependency)이라 런타임에
 * 있다고 보장할 수 없다. 대신 Identity Toolkit에 토큰을 되물어 본다 —
 * 의존성을 늘리지 않고 서버에서 실제로 검증하는 방법이다.
 *
 * 익명 계정은 거른다. 익명은 누구나 즉시 만들 수 있어 문지기 노릇을 못 한다.
 */
async function verifyAccount(request: Request): Promise<
  { ok: true; uid: string } | { ok: false; status: number; error: string }
> {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key) {
    return { ok: false, status: 503, error: "이 환경에는 로그인이 설정되어 있지 않습니다." };
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return { ok: false, status: 401, error: "로그인이 필요합니다." };
  }

  let payload: { users?: Array<{ localId?: string; providerUserInfo?: unknown[] }> };
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${key}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      },
    );
    if (!res.ok) return { ok: false, status: 401, error: "로그인이 만료되었습니다. 다시 로그인해 주세요." };
    payload = await res.json();
  } catch {
    return { ok: false, status: 503, error: "로그인을 확인하지 못했습니다." };
  }

  const account = payload.users?.[0];
  if (!account?.localId) {
    return { ok: false, status: 401, error: "로그인이 필요합니다." };
  }
  if ((account.providerUserInfo?.length ?? 0) === 0) {
    return { ok: false, status: 403, error: "구글 로그인이 필요합니다." };
  }

  return { ok: true, uid: account.localId };
}

export async function POST(request: Request) {
  const origin = checkOrigin(request);
  if (!origin.ok) return refuse(origin);

  const account = await verifyAccount(request);
  if (!account.ok) {
    return Response.json({ error: account.error }, { status: account.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "질문을 확인해 주세요." }, { status: 400 });
  }

  /*
   * 겹치는 낱말이 하나도 없으면 모델을 부르지 않는다. 비용이 0이고, 저비용
   * 모델이 위키 밖에서 지어낼 여지도 함께 사라진다. (`/api/ask`의 주제 선별과
   * 같은 자리다.)
   */
  const context = buildWikiContext(parsed.data.question);
  if (context.used.length === 0) {
    return Response.json({
      grounded: false,
      message:
        "이 물음과 겹치는 위키 페이지를 찾지 못했습니다. 위키는 업적과 대통령 언행만 다룹니다.",
      pages: [],
    });
  }

  // 여기부터 돈이 든다. 계정을 한도의 열쇠로 쓴다.
  const rate = checkRate(`wiki:${account.uid}`);
  if (!rate.ok) return refuse(rate);

  const budget = checkDailyBudget();
  if (!budget.ok) return refuse(budget);

  let answer;
  try {
    const client = new Anthropic();
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 2000,
      system: [
        {
          type: "text",
          text: `${WIKI_SYSTEM_PROMPT}\n\n---\n\n${context.prompt}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      output_config: { format: zodOutputFormat(answerSchema) },
      messages: [{ role: "user", content: parsed.data.question }],
    });
    answer = response.parsed_output;
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "AI 자격 증명이 유효하지 않습니다." }, { status: 503 });
    }
    if (!(error instanceof Anthropic.APIError)) {
      return Response.json(
        { error: "위키 질의가 아직 연결되지 않았습니다. 서버에 ANTHROPIC_API_KEY가 필요합니다." },
        { status: 503 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "요청이 몰리고 있습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 },
      );
    }
    console.error("[wiki-ask] 모델 호출 실패", error);
    return Response.json({ error: "답을 불러오지 못했습니다." }, { status: 502 });
  }

  if (!answer) {
    return Response.json({ error: "답을 이해하지 못했습니다." }, { status: 502 });
  }

  /*
   * 없는 페이지를 가리키는 인용은 버린다. 그리고 앵커가 하나도 없는 답은
   * 위키에서 온 것이 아니다 — 근거를 댔다는 주장을 서버가 거둔다.
   * 프롬프트로 부탁하는 대신 여기서 판정하는 이유는 `/api/ask`와 같다.
   */
  /*
   * 펴 주지 않은 페이지를 근거로 댈 수는 없다. 위키에 있는 이름이라도
   * 이번에 읽지 않았으면 버린다 — 모델이 제목만 보고 짐작한 것이다.
   */
  const titles = new Map(allPages().map((page) => [page.name, page.title]));
  const opened = new Set(context.used);
  const pages = answer.pages
    .filter((name) => opened.has(name) && titles.has(name))
    .map((name) => ({ name, title: titles.get(name) as string }));

  /*
   * 답에 남은 앵커를 화면이 쓸 수 있는 형태로 풀어 준다. 이 해석은 업적·언행
   * 콘텐츠 전체를 봐야 하므로 서버에서 한다 — 브라우저로 내려보낼 것은 결과뿐이다.
   */
  const seen = new Map<string, number>();
  const notes: ReturnType<typeof resolveAnchor>[] = [];
  for (const match of answer.message.matchAll(/\^\[([^\]]+)\]/g)) {
    const raw = match[1].trim();
    if (seen.has(raw)) continue;
    seen.set(raw, notes.length + 1);
    notes.push(resolveAnchor(raw));
  }

  const grounded = answer.grounded && pages.length > 0 && notes.length > 0;

  return Response.json({
    grounded,
    message: answer.message,
    pages,
    notes,
  });
}
