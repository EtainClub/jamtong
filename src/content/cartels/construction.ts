import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 건설 — 경기도 시절의 단속이 받친다.
 *
 * `gyeonggi-construction`이 건설원가 공개와 페이퍼컴퍼니 적발, 낙찰률까지
 * 근거를 갖춰 들고 있다. 그것이 이 표적에서 이 위키가 가진 전부다.
 *
 * ★ 지방정부에서 한 일이다.
 *   중앙정부 차원에서 건설 입찰담합을 어떻게 다뤘는지는 별도 자료가 필요하다.
 *   공정위의 공공입찰 제한 강화는 `collusion`(담합 일반) 쪽에 걸리는 이야기이고,
 *   그것이 건설에 실제로 몇 건 적용됐는지는 확인하지 못했다.
 */

const raw: CartelInput = {
  id: "construction",
  slug: "construction",
  name: "건설",
  summary:
    "건설원가를 공개하고 입찰에 들어온 페이퍼컴퍼니를 걸러 낸 일을 모았습니다. 경기도에서 한 일입니다.",
  achievementSlugs: ["gyeonggi-construction"],
  openQuestions: [
    "중앙정부가 건설 입찰담합을 제재한 사례를 확인하지 못했습니다.",
    "공정위의 ‘담합 재적발 시 공공입찰 제한’이 건설 분야에 실제로 적용된 건수를 확인하지 못했습니다.",
  ],
  sourceNote:
    "여기 모인 업적은 제 근거를 들고 있습니다. 이 페이지가 따로 더하는 주장은 " +
    "없습니다. 2026년 9월 21일 기준입니다.",
};

export const construction: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
};
