import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import { getAchievement } from "@/content/achievements";
import { scenesFor } from "@/features/achievement/scenes";
import { buildGrounding, SYSTEM_PROMPT } from "@/lib/agent/grounding";
import { agentAnswerSchema, sanitizeActions } from "@/lib/agent/actions";
import {
  buildTopicIndex,
  checkDailyBudget,
  checkOrigin,
  checkRate,
  clientKey,
  isOnTopic,
  type GuardVerdict,
} from "@/lib/agent/guard";

/**
 * AI 안내 API (설계서 12~14·39·40장).
 *
 * 기본 탐색에는 AI가 전혀 관여하지 않는다. 지도를 끌고 연표를 옮기고 관계도를
 * 누르는 동안 이 경로는 호출되지 않는다. 사용자가 물었을 때만 한 번 부른다.
 *
 * 모델은 '무엇을 말할지'보다 '어디를 보여줄지'를 고르는 일을 한다.
 */

export const runtime = "nodejs";

const requestSchema = z.object({
  achievementSlug: z.string(),
  question: z.string().min(2).max(400),
});

/**
 * 이 경로가 하는 일은 대부분 '어느 화면을 보여줄지' 고르는 것이라
 * 저비용 모델로 충분하다 (설계서 14장 모델 라우터의 첫 단계).
 * 더 무거운 판단이 필요해지면 ASK_MODEL로 올린다.
 */
const MODEL = process.env.ASK_MODEL ?? "claude-haiku-4-5";

/**
 * effort는 Haiku 4.5에서 400을 낸다. 모델을 갈아끼울 수 있게 해 뒀으므로
 * 보낼 수 있을 때만 보낸다.
 */
const SUPPORTS_EFFORT = !MODEL.startsWith("claude-haiku");

/** 막힌 이유는 서버 로그에만 남긴다. 밖으로는 짧게만 알린다. */
function refuse(verdict: Extract<GuardVerdict, { ok: false }>): Response {
  console.warn(`[ask] 차단: ${verdict.reason}`);
  return Response.json({ error: verdict.error }, { status: verdict.status });
}

export async function POST(request: Request) {
  const origin = checkOrigin(request);
  if (!origin.ok) return refuse(origin);

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

  const achievement = getAchievement(parsed.data.achievementSlug);
  const scenes = achievement ? scenesFor(achievement) : [];
  if (!achievement || scenes.length === 0) {
    return Response.json({ error: "알 수 없는 스토리입니다." }, { status: 404 });
  }

  /*
   * 주제 선별을 모델 호출 앞에 둔다.
   *
   * 스토리에 없는 말로만 된 질문은 어차피 답할 수 없다. 모델에게 물어
   * "모릅니다"를 받아오는 대신 여기서 끝내면 비용이 0이고, 저비용 모델이
   * 엉뚱하게 지어낼 여지도 함께 사라진다.
   */
  const topicIndex = buildTopicIndex(
    achievement,
    scenes.map((s) => s.label),
  );
  if (!isOnTopic(parsed.data.question, topicIndex)) {
    console.info("[ask] 주제 밖 질문 — 모델을 부르지 않았습니다");
    return Response.json({
      grounded: false,
      message:
        "이 화면의 자료에서 다루는 내용이 아닙니다. 이 스토리에 대해 물어봐 주세요.",
      actions: [],
      claimIds: [],
    });
  }

  // 여기부터는 실제로 돈이 든다. 한도를 먼저 본다.
  const rate = checkRate(clientKey(request));
  if (!rate.ok) return refuse(rate);

  const budget = checkDailyBudget();
  if (!budget.ok) return refuse(budget);

  const grounding = buildGrounding(achievement, scenes.map((s) => s.id));

  let answer;
  try {
    const client = new Anthropic();
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 2000,
      system: [
        {
          type: "text",
          text: `${SYSTEM_PROMPT}\n\n---\n\n${grounding.prompt}`,
          // 맥락은 스토리마다 고정이라 캐시가 잘 듣는다. 질문만 매번 바뀐다.
          cache_control: { type: "ephemeral" },
        },
      ],
      output_config: {
        // 화면을 움직이는 일이라 깊게 생각할수록 느려지기만 한다.
        ...(SUPPORTS_EFFORT ? { effort: "low" as const } : {}),
        format: zodOutputFormat(agentAnswerSchema),
      },
      messages: [{ role: "user", content: parsed.data.question }],
    });

    answer = response.parsed_output;
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: "AI 안내의 자격 증명이 유효하지 않습니다." },
        { status: 503 },
      );
    }
    /*
     * 자격 증명을 찾지 못하면 SDK는 요청을 보내기도 전에 던진다. HTTP 단계에서
     * 생긴 실패는 모두 APIError이므로, 그게 아니면 서버 설정 문제로 본다.
     */
    if (!(error instanceof Anthropic.APIError)) {
      return Response.json(
        {
          error:
            "AI 안내가 아직 연결되지 않았습니다. 서버에 ANTHROPIC_API_KEY를 설정하거나 ant auth login으로 로그인해 주세요.",
        },
        { status: 503 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "요청이 몰리고 있습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 },
      );
    }
    console.error("[ask] 모델 호출 실패", error);
    return Response.json({ error: "안내를 불러오지 못했습니다." }, { status: 502 });
  }

  if (!answer) {
    return Response.json({ error: "안내를 이해하지 못했습니다." }, { status: 502 });
  }

  // 존재하지 않는 id를 가리키는 액션은 버린다. 화면이 깨지는 것보다 낫다.
  const { valid, dropped } = sanitizeActions(answer.actions, grounding.inventory);
  if (dropped.length > 0) {
    console.warn("[ask] 실행할 수 없는 액션을 버렸습니다:", dropped.join(", "));
  }

  const claimIds = answer.claimIds.filter((id) => grounding.inventory.claimIds.has(id));

  /*
   * 화면도 움직이지 않고 근거도 대지 않는 답은 그냥 챗봇이 말한 것이다.
   * 이 제품이 피하려는 바로 그 동작이므로, 자료에 근거했다는 주장을 거둔다.
   *
   * 모델을 저비용으로 내릴수록 이 실패가 잦아진다. 프롬프트로 부탁하는 대신
   * 서버에서 판정한다.
   */
  const grounded = answer.grounded && (valid.length > 0 || claimIds.length > 0);

  return Response.json({
    grounded,
    message: answer.message,
    // 근거가 없다고 답했으면 화면도 움직이지 않는다 (설계서 40장).
    actions: grounded ? valid : [],
    claimIds: grounded ? claimIds : [],
  });
}
