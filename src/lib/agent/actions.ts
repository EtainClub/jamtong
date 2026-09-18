import { z } from "zod";

/**
 * Agent UI Action API (설계서 13장).
 *
 * 모델은 React를 쓰지 않는다. 이 목록 중 하나를 고를 뿐이다.
 * 그래서 모델이 무엇을 반환하든 앱이 할 수 있는 일의 범위를 넘지 못한다.
 *
 * 구조를 평평하게 둔 이유: 판별 유니온을 JSON Schema로 내보내면 oneOf가 되고,
 * 엄격 모드에서 다루기 까다롭다. 평평한 형태로 받아 서버에서 검증한다.
 */

export const ActionType = z.enum([
  "GO_TO_SCENE", // 특정 씬으로 이동
  "SET_VIEW", // 쉽게 보기 / 원문 보기 전환
  "SEEK_TIMELINE", // 연표 시점 이동 (관계도도 함께 바뀐다)
  "FOCUS_ENTITY", // 관계도에서 한 기관에 집중
  "SET_ROUTE", // 지도에서 볼 항로 전환
  "SET_MOTION", // 항로 위 배의 위치
  "SET_SCENARIO", // 자금 흐름 시나리오 전환
  "OPEN_EVIDENCE", // 근거 패널 열기
  "RESET_VIEW", // 처음 상태로
]);
export type ActionType = z.infer<typeof ActionType>;

export const agentActionSchema = z.object({
  type: ActionType,
  /** 씬·이벤트·기관·항로·시나리오·주장 id. 대상이 필요한 액션에서만 쓴다. */
  targetId: z.string().nullable(),
  /** SET_MOTION 전용. 0이 출발, 1이 도착. */
  progress: z.number().min(0).max(1).nullable(),
  /** SET_VIEW 전용. */
  view: z.enum(["easy", "full"]).nullable(),
});
export type AgentAction = z.infer<typeof agentActionSchema>;

export const agentAnswerSchema = z.object({
  /**
   * 위키 자료만으로 답할 수 있었는지.
   *
   * 설계서 40장: 근거가 없으면 추론해서 채우지 않는다. false면 화면을 움직이지
   * 않고 "지금 자료로는 확인하기 어렵다"고 말한다.
   */
  grounded: z.boolean(),
  /** 두세 문장. 길게 설명하면 화면을 보지 않게 된다. */
  message: z.string(),
  actions: z.array(agentActionSchema).max(4),
  /** 답변이 기댄 근거. 화면에 칩으로 붙는다. */
  claimIds: z.array(z.string()).max(4),
});
export type AgentAnswer = z.infer<typeof agentAnswerSchema>;

/** 이 스토리에서 실제로 존재하는 id 목록. 모델 출력을 여기에 대조한다. */
export interface ActionInventory {
  sceneIds: Set<string>;
  eventIds: Set<string>;
  entityIds: Set<string>;
  routeIds: Set<string>;
  scenarioIds: Set<string>;
  claimIds: Set<string>;
}

const TARGET_FIELD: Record<ActionType, keyof ActionInventory | null> = {
  GO_TO_SCENE: "sceneIds",
  SEEK_TIMELINE: "eventIds",
  FOCUS_ENTITY: "entityIds",
  SET_ROUTE: "routeIds",
  SET_SCENARIO: "scenarioIds",
  OPEN_EVIDENCE: "claimIds",
  SET_VIEW: null,
  SET_MOTION: null,
  RESET_VIEW: null,
};

/**
 * 실행 가능한 액션만 남긴다.
 *
 * 존재하지 않는 id를 가리키는 액션은 조용히 버린다. 화면이 깨지는 것보다
 * 하나 덜 움직이는 편이 낫다. (설계 검토 문서 5.4)
 */
export function sanitizeActions(
  actions: AgentAction[],
  inventory: ActionInventory,
): { valid: AgentAction[]; dropped: string[] } {
  const valid: AgentAction[] = [];
  const dropped: string[] = [];

  for (const action of actions) {
    const field = TARGET_FIELD[action.type];

    if (field) {
      if (!action.targetId || !inventory[field].has(action.targetId)) {
        dropped.push(`${action.type}(${action.targetId ?? "없음"})`);
        continue;
      }
    }

    if (action.type === "SET_MOTION" && action.progress === null) {
      dropped.push("SET_MOTION(진행도 없음)");
      continue;
    }
    if (action.type === "SET_VIEW" && action.view === null) {
      dropped.push("SET_VIEW(대상 없음)");
      continue;
    }

    valid.push(action);
  }

  return { valid, dropped };
}
