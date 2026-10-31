import type { PolicyInput } from "./schema";

/**
 * 북한의 드론 전력 증강과 국방부의 대응.
 *
 * 「어렵게 만든 민주주의를 꼭 지켜냅시다」 답글에 "북한이 드론 기술까지 들여오는데 정부는 안보에
 * 손을 놓고 있다"는 말이 달렸다(잼통 Voice). 북한 드론 개발에 대해 확인되는 것과 국방부의 대응을
 * 적는다.
 *
 * ★ 러시아의 대북 드론 기술 이전은 우크라이나 측 주장·전문가 추정 수준이다. 확인된 사실로 쓰지 않는다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #125.
 */
export const NK_DRONES: PolicyInput = {
  slug: "nk-drones",
  title: "북한 드론 전력 증강과 국방부 대응",
  scope:
    "북한의 국방발전 5개년 계획(2026~2030)의 무인공격체계, 러시아 기술 이전 의혹, 2026년 6월 국방부의 드론작전사령부 개편과 드론·대드론 정책",
  ministries: ["국방부"],
  categories: ["diplomacy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-hands-off",
      text: "북한이 드론 기술까지 들여오는데 정부는 북한 문제와 안보에 손을 놓고 있다",
      claimIds: ["claim-nk-plan", "claim-russia", "claim-mnd", "claim-budget-critique"],
    },
  ],
  claims: [
    {
      id: "claim-nk-plan",
      text:
        "김정은 국무위원장은 노동당 9차 대회에서 내놓은 국방발전 5개년 계획(2026~2030)의 주요 과제로 AI 기반 무인공격체계를 꼽았다. " +
        "평안북도 구성 일대 생산시설이 늘고 있다는 분석이 있다.",
      assertionType: "FACT",
      sourceIds: ["src-rfa-20260723"],
      verified: false,
    },
    {
      id: "claim-russia",
      text:
        "키릴로 부다노프 우크라이나 국방부 정보국장은 2025년 7월 러시아가 자폭 드론 '샤헤드' 생산 기술과 인프라를 북한에 제공하고 " +
        "있다고 주장했다. 어떤 기술이 실제로 이전됐는지는 공개적으로 확인되지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "키릴로 부다노프 우크라이나 국방부 정보국장",
      sourceIds: ["src-fnnews-20250904", "src-rfa-20260723"],
      verified: true,
    },
    {
      id: "claim-mnd",
      text:
        "국방부는 2026년 6월 드론작전사령부 개편과 '국방 드론·대드론 발전 정책'을 발표했다. 2022년 12월 북한 무인기 침투 뒤 " +
        "창설된 드론작전사령부는 11월부터 국방부 직할 본부로 바뀐다. 안규백 장관은 예산이 줄지 않을 것이라며 장거리 자폭드론 " +
        "개발을 2030년 이전으로 앞당기겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-sidae-20260730"],
      verified: true,
    },
    {
      id: "claim-budget-critique",
      text:
        "유용원 국민의힘 의원실 자료에 따르면 드론작전사령부는 최근 2년 자폭드론 등 구매 예산 약 114억 원을 쓰지 못하고 반납했고, " +
        "부대 예산은 152억 원에서 123억 원으로, 연간 훈련은 2024년 265회에서 2026년 177회로 줄었다.",
      assertionType: "CLAIM",
      assertedBy: "유용원 국민의힘 의원실",
      sourceIds: ["src-sidae-20260730"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-budget-critique"],
  timeline: [
    {
      id: "t-mnd",
      date: "2026-06-26",
      datePrecision: "day",
      title: "국방 드론·대드론 발전 정책 발표",
      summary: "드론작전사령부 개편.",
      claimIds: ["claim-mnd"],
    },
  ],
  gaps: [
    "국방 드론·대드론 발전 정책의 세부 내용(전력 규모·예산)은 국방부 자료로 확인하지 못했다.",
    "북한 군사 동향에 대한 합동참모본부의 2026년 공식 평가는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-rfa-20260723",
      title: "북한 '드론' 개발 박차… \"한미 안보 위협\"",
      publisher: "자유아시아방송(RFA)",
      url: "https://rfa.org/korean/in-focus/2026/07/23/north-korea-drone-power-military-security-impact/",
      publishedAt: "2026-07-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sidae-20260730",
      title: "[시대포커스] 자폭드론 예산 114억 줬는데…2년간 한 푼도 못 쓰고 반납",
      publisher: "시대일보",
      url: "https://www.sidae.com/article/2026073019295078248",
      publishedAt: "2026-07-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20250904",
      title: "북·러, 군사 드론 협력 본격화…韓日 전역 사정권",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202509040909344995",
      publishedAt: "2025-09-04",
      type: "press",
      license: "link-only",
    },
  ],
};
