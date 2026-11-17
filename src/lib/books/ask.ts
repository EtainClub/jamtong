import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import type { BookPack } from "@/lib/firebase/library";

/**
 * 책에게 묻기의 모델 부분 — api/book-ask가 부른다. 서버에서만.
 * 한 권의 장별 요약을 시스템 프롬프트에 싣고(책마다 같은 글이라 캐시한다), 답은 그 요약 안에서만 〔N장〕을 달아 하게 한다.
 */
export const MODEL = process.env.BOOK_ASK_MODEL ?? process.env.WIKI_ASK_MODEL ?? process.env.ASK_MODEL ?? "claude-haiku-4-5";

export const answerSchema = z.object({
  grounded: z.boolean().describe("펴 준 장의 요약만으로 답했는지. 요약에 없는 것을 물었으면 false"),
  message: z.string().describe("한국어 답. 요약에서 옮긴 문장마다 끝에 〔N장〕을 단다"),
  chapters: z.array(z.number().int()).describe("근거로 삼은 장 번호"),
});

const SYSTEM = `당신은 잼통(이재명 업적 위키)의 '책에게 묻기'입니다. 아래에 한 권의 책에 대해 잼통이 장마다 다시 쓴 요약이 있습니다.

규칙:
1. 아래 요약에 있는 내용만으로 답합니다. 요약에 없는 사실·숫자·인용·평가를 더하지 않습니다. 당신이 아는 다른 지식도 쓰지 않습니다.
2. 요약에서 옮긴 문장마다 끝에 〔N장〕을 답니다(N은 장 번호). 여러 장이면 〔3장·5장〕.
3. 요약에 없는 것을 물으면 grounded를 false로 두고 "이 책의 요약에는 그 이야기가 없어요"라고 짧게 답한 뒤, 가까운 장이 있으면 알려 줍니다.
4. 이것은 저자의 회고를 잼통이 줄인 요약입니다. 저자의 주장이나 평가는 "저자는 …라고 적었어요"처럼 누구의 말인지 밝힙니다. 사실로 단정하지 않습니다.
5. 특정 정당·인물을 비난하거나 투표를 권하지 않습니다. 책 바깥의 정치 질문에는 답하지 않고 책 이야기로 돌아갑니다.
6. 존댓말(해요체)로, 400자 안팎으로 답합니다. 마크다운 제목·표는 쓰지 않습니다.`;

export type BookModelAnswer = z.infer<typeof answerSchema>;

export async function answerFromBook(pack: BookPack, question: string): Promise<BookModelAnswer | null> {
  const context = pack.chapters
    .map((c) => `〔${c.order}장〕 ${c.title}\n한 줄: ${c.summary}\n${c.body ?? c.points.map((p) => `${p.title} — ${p.say}`).join("\n")}`)
    .join("\n\n---\n\n");
  const client = new Anthropic();
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 1200,
    system: [
      { type: "text", text: SYSTEM },
      // 책마다 같은 글이라 캐시한다 — 같은 책에 이어 묻는 사람끼리 나눠 쓴다.
      { type: "text", text: `『${pack.title}』(${pack.year}) — 잼통이 장마다 다시 쓴 요약\n\n${context}`, cache_control: { type: "ephemeral" } },
    ],
    output_config: { format: zodOutputFormat(answerSchema) },
    messages: [{ role: "user", content: question }],
  });
  return response.parsed_output ?? null;
}

/** 근거로 든 장 — 모델이 고른 번호와 본문에 단 〔N장〕을 모아, 그 책에 있는 장만 남긴다. */
export function citedChapters(pack: BookPack, answer: BookModelAnswer): Array<{ order: number; slug: string; title: string }> {
  const cited = new Set(answer.chapters);
  for (const m of answer.message.matchAll(/〔([^〕]+)〕/g)) for (const n of m[1].matchAll(/(\d+)장/g)) cited.add(Number(n[1]));
  return pack.chapters.filter((c) => cited.has(c.order)).map((c) => ({ order: c.order, slug: c.slug, title: c.title }));
}
