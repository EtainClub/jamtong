import type { Story } from "@/content/schema";
import type { ActionInventory } from "./actions";

/**
 * AI가 쓸 수 있는 맥락을 만든다 (설계서 39장).
 *
 * 모델에게 주는 것은 이 스토리에 **실제로 존재하는 것들의 목록**뿐이다.
 * 바깥 지식으로 답하지 못하게 하고, id를 지어내지 못하게 한다.
 *
 * 특히 중요한 원칙: 모델이 id를 생성하지 않는다. 후보 목록에서 고를 뿐이다.
 * 그래서 환각 id가 구조적으로 나올 수 없다. (설계 검토 문서 5.4)
 */

export interface Grounding {
  prompt: string;
  inventory: ActionInventory;
}

const SCENE_LABEL: Record<string, string> = {
  hero: "개요",
  route: "항로 지도 (배를 끌어 이동)",
  compare: "항로 비교",
  land: "토지이용",
  flow: "자금 흐름",
  relations: "관계도",
  timeline: "연표",
  counterpoint: "쟁점",
  share: "공유",
};

export function buildGrounding(story: Story, availableScenes: string[]): Grounding {
  const lines: string[] = [];

  lines.push(`# 스토리: ${story.title} — ${story.subtitle}`);
  lines.push(story.summary);
  lines.push("");

  lines.push("## 화면(씬) — GO_TO_SCENE의 targetId");
  for (const id of availableScenes) {
    lines.push(`- ${id}: ${SCENE_LABEL[id] ?? id}`);
  }
  lines.push("");

  if (story.timeline.length > 0) {
    lines.push("## 연표 시점 — SEEK_TIMELINE의 targetId");
    lines.push("(시점을 옮기면 관계도도 그 시점 상태로 바뀐다)");
    for (const event of story.timeline) {
      lines.push(`- ${event.id} [${event.displayDate ?? event.date}] ${event.title}`);
    }
    lines.push("");
  }

  if (story.graph) {
    lines.push("## 기관·사업 — FOCUS_ENTITY의 targetId");
    for (const entity of story.graph.entities) {
      lines.push(`- ${entity.id}: ${entity.name}`);
    }
    lines.push("");
    lines.push("## 관계 (참고용, 액션 대상 아님)");
    for (const relation of story.graph.relations) {
      const from = story.graph.entities.find((e) => e.id === relation.fromId)?.name;
      const to = story.graph.entities.find((e) => e.id === relation.toId)?.name;
      lines.push(`- [${relation.startDate}] ${from} → ${to}: ${relation.label}`);
    }
    lines.push("");
  }

  if (story.routes.length > 0) {
    lines.push("## 항로 — SET_ROUTE의 targetId");
    for (const route of story.routes) {
      lines.push(
        `- ${route.id}: ${route.name}, ${route.totalKm.toLocaleString("ko-KR")}km, ${route.totalDaysMin}~${route.totalDaysMax}일`,
      );
    }
    lines.push("");
  }

  if (story.moneyFlow) {
    lines.push("## 자금 흐름 시나리오 — SET_SCENARIO의 targetId");
    for (const scenario of story.moneyFlow.scenarios) {
      const total = scenario.allocations.reduce((sum, a) => sum + a.amountEok, 0);
      lines.push(
        `- ${scenario.id}: ${scenario.name} (공공 몫 ${total.toLocaleString("ko-KR")}억 원)`,
      );
    }
    lines.push("");
  }

  lines.push("## 확인된 사실 — OPEN_EVIDENCE의 targetId이자 답변의 근거");
  for (const claim of story.claims) {
    const mark = claim.verified ? "" : " [검증 전]";
    const kind = claim.assertionType === "FACT" ? "" : ` [${claim.assertionType}]`;
    lines.push(`- ${claim.id}${mark}${kind}: ${claim.text}`);
  }

  return {
    prompt: lines.join("\n"),
    inventory: {
      sceneIds: new Set(availableScenes),
      eventIds: new Set(story.timeline.map((e) => e.id)),
      entityIds: new Set(story.graph?.entities.map((e) => e.id) ?? []),
      routeIds: new Set(story.routes.map((r) => r.id)),
      scenarioIds: new Set(story.moneyFlow?.scenarios.map((s) => s.id) ?? []),
      claimIds: new Set(story.claims.map((c) => c.id)),
    },
  };
}

export const SYSTEM_PROMPT = `너는 '이재명 업적 위키'의 화면 안내자다. 챗봇이 아니다.

가장 중요한 원칙: **길게 설명하지 말고 화면을 움직여라.**
사용자가 질문하면 관련 화면으로 데려가고, 근거를 열어주고, 두세 문장으로만 말한다.
설명이 길면 사용자가 화면을 보지 않는다.

답변 규칙
1. 아래 맥락에 있는 내용만 쓴다. 바깥 지식으로 답하지 않는다.
2. 맥락으로 답할 수 없으면 grounded를 false로 두고, 화면을 움직이지 말고,
   "지금 위키 자료만으로는 확인하기 어렵다"는 뜻을 말한다. 추측해서 채우지 않는다.
3. actions의 targetId는 **반드시 맥락에 적힌 id를 그대로** 쓴다. 새로 만들지 않는다.
4. 시점을 묻는 질문이면 SEEK_TIMELINE을 먼저 쓴다. 연표 커서가 관계도까지 바꾼다.
5. 수치를 말했으면 그 근거를 OPEN_EVIDENCE로 열거나 claimIds에 담는다.
6. [검증 전] 표시가 있는 내용을 쓸 때는 아직 출처가 확정되지 않았다고 밝힌다.
7. 액션은 많아야 3개. 화면이 한 번에 여러 곳으로 튀면 따라갈 수 없다.
8. 한국어로, 존댓말로 답한다.`;
