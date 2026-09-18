/**
 * AI 안내의 비-LLM 계층 점검.
 *
 * 모델을 부르지 않고 확인할 수 있는 것만 본다. 맥락에 실제로 존재하는 id가
 * 실려 있는지, 그리고 존재하지 않는 id를 가리키는 액션이 걸러지는지.
 *
 * 이 두 가지가 AI 안내의 안전장치 전부다. 모델이 무엇을 반환하든 여기를
 * 통과하지 못하면 화면에 닿지 않는다.
 */
import { STORIES } from "../src/content/stories";
import { SCENES_BY_STORY } from "../src/features/story/scenes";
import { buildGrounding } from "../src/lib/agent/grounding";
import { sanitizeActions, type AgentAction } from "../src/lib/agent/actions";
import { buildTopicIndex, isOnTopic } from "../src/lib/agent/guard";

let failed = false;

for (const story of STORIES) {
  const scenes = SCENES_BY_STORY[story.slug];
  if (!scenes) {
    failed = true;
    console.error(`✗ ${story.slug} → 씬 목록이 등록되지 않았다`);
    continue;
  }

  const { prompt, inventory } = buildGrounding(
    story,
    scenes.map((s) => s.id),
  );

  const counts = {
    씬: inventory.sceneIds.size,
    시점: inventory.eventIds.size,
    기관: inventory.entityIds.size,
    항로: inventory.routeIds.size,
    시나리오: inventory.scenarioIds.size,
    근거: inventory.claimIds.size,
  };

  // 맥락에 없는 것을 액션 대상으로 삼을 수 없어야 한다.
  const probes: AgentAction[] = [
    { type: "GO_TO_SCENE", targetId: [...inventory.sceneIds][0], progress: null, view: null },
    { type: "GO_TO_SCENE", targetId: "없는-씬", progress: null, view: null },
    { type: "FOCUS_ENTITY", targetId: "person-999", progress: null, view: null },
    { type: "OPEN_EVIDENCE", targetId: [...inventory.claimIds][0], progress: null, view: null },
    { type: "SET_MOTION", targetId: null, progress: null, view: null },
    { type: "RESET_VIEW", targetId: null, progress: null, view: null },
  ];

  const { valid, dropped } = sanitizeActions(probes, inventory);

  if (valid.length !== 3 || dropped.length !== 3) {
    failed = true;
    console.error(
      `✗ ${story.slug} → 액션 검증이 기대와 다르다 (통과 ${valid.length}, 버림 ${dropped.length})`,
    );
  }

  const tokens = Math.round(prompt.length / 2.2);
  console.log(
    `✓ ${story.slug} — ` +
      Object.entries(counts)
        .map(([k, v]) => `${k} ${v}`)
        .join(", ") +
      ` · 맥락 약 ${tokens.toLocaleString("ko-KR")}자`,
  );
  console.log(`    버려진 액션: ${dropped.join(", ")}`);
}

/*
 * 주제 선별 점검.
 *
 * 잘못 막는 쪽이 잘못 통과시키는 쪽보다 사용자에게 나쁘다. 통과해야 할
 * 질문이 막히는지를 먼저 본다.
 */
const arctic = STORIES.find((s) => s.slug === "arctic-route")!;
const index = buildTopicIndex(
  arctic,
  (SCENES_BY_STORY["arctic-route"] ?? []).map((s) => s.label),
);

const shouldPass = [
  "얼마나 짧아지나요?",
  "2026년에 무슨 일이 있나요?",
  "러시아 제재가 왜 변수인가요?",
  "이거 설명해줘",
  "요약해줘",
  "북극항로가 뭔가요?",
  "쇄빙선 지원이 얼마인가요?",
  "부산에서 얼마나 걸려요?",
];

const shouldBlock = [
  "이재명 대통령의 고향이 어디인가요?",
  "오늘 서울 날씨 알려줘",
  "파이썬으로 퀵소트 짜줘",
];

console.log("\n주제 선별 (arctic-route)");
for (const q of shouldPass) {
  const ok = isOnTopic(q, index);
  if (!ok) {
    failed = true;
    console.error(`  \u2717 통과해야 하는데 막혔다: "${q}"`);
  } else {
    console.log(`  \u2713 통과: "${q}"`);
  }
}
for (const q of shouldBlock) {
  const ok = isOnTopic(q, index);
  if (ok) {
    console.warn(`  \u26a0 막히지 않았다(모델이 판단하게 된다): "${q}"`);
  } else {
    console.log(`  \u2713 차단(비용 0): "${q}"`);
  }
}

if (failed) {
  console.error("\nAI 안내 점검 실패.");
  process.exit(1);
}
console.log("\nAI 안내 점검 통과. (모델 호출은 자격 증명이 있는 환경에서 확인이 필요하다)");
