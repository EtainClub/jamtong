import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 전관예우 — 이 위키에 이미 있는 업적 둘이 받친다.
 *
 * 새 근거를 만들지 않는다. 법왜곡죄·재판소원·대법관 증원은 `judicial-reform`이,
 * 수사와 기소를 나눈 일은 `prosecution-reform`이 근거까지 갖춰 들고 있다.
 * 여기서 할 일은 그 둘을 한 표적 아래 모아 보이는 것뿐이다.
 *
 * ★ "무엇이 문제인가"는 아직 비어 있다.
 *   유전무죄 무전유죄가 실제로 어느 정도인지를 말하려면 통계가 필요한데
 *   찾지 못했다. 근거 없는 진단을 우리 말로 적느니 비워 둔다.
 */

const raw: CartelInput = {
  id: "revolving-door",
  slug: "revolving-door",
  name: "전관예우",
  summary:
    "판결을 다시 볼 길을 늘리고, 수사와 기소를 한 기관이 함께 쥐던 구조를 나눈 일을 모았습니다.",
  achievementSlugs: ["judicial-reform", "prosecution-reform"],
  openQuestions: [
    "전관 변호사의 수임과 선고 결과를 잇는 통계를 찾지 못했습니다. ‘유전무죄 무전유죄’가 어느 정도인지를 수치로 적을 수 없습니다.",
    "전관예우 자체를 겨냥한 별도 제도(수임 제한 강화 등)가 이 정부에서 있었는지 확인하지 못했습니다.",
  ],
  sourceNote:
    "여기 모인 두 업적은 각자의 근거를 들고 있습니다. 이 페이지가 따로 더하는 " +
    "주장은 없습니다. 2026년 9월 21일 기준입니다.",
};

export const revolvingDoor: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
};
