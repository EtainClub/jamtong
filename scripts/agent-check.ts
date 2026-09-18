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

if (failed) {
  console.error("\nAI 안내 점검 실패.");
  process.exit(1);
}
console.log("\nAI 안내 점검 통과. (모델 호출은 자격 증명이 있는 환경에서 확인이 필요하다)");
