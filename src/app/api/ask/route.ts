import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import { getStory } from "@/content/stories";
import { SCENES_BY_STORY } from "@/features/story/scenes";
import { buildGrounding, SYSTEM_PROMPT } from "@/lib/agent/grounding";
import { agentAnswerSchema, sanitizeActions } from "@/lib/agent/actions";

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
  storySlug: z.string(),
  question: z.string().min(2).max(400),
});

/**
 * 설계서 14장은 의도별 모델 라우터를 요구한다. 지금은 한 단계만 두고,
 * 환경변수로 갈아끼울 수 있게 해 둔다 (예: 단순 화면 이동은 claude-haiku-4-5).
 */
const MODEL = process.env.ASK_MODEL ?? "claude-opus-5";

export async function POST(request: Request) {
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

  const story = getStory(parsed.data.storySlug);
  const scenes = SCENES_BY_STORY[parsed.data.storySlug];
  if (!story || !scenes) {
    return Response.json({ error: "알 수 없는 스토리입니다." }, { status: 404 });
  }

  const grounding = buildGrounding(story, scenes.map((s) => s.id));

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
      // 화면을 움직이는 일이라 깊게 생각할수록 느려지기만 한다.
      output_config: {
        effort: "low",
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

  return Response.json({
    grounded: answer.grounded,
    message: answer.message,
    // 근거가 없다고 답했으면 화면도 움직이지 않는다 (설계서 40장).
    actions: answer.grounded ? valid : [],
    claimIds: answer.grounded ? claimIds : [],
  });
}
