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
 * ★ 2026-11-09 보충 — 이슈 #249(드론 관련 예산): 2026년 국회 증액, 2027년 정부안의 드론·대드론 예산.
 */
export const NK_DRONES: PolicyInput = {
  slug: "nk-drones",
  title: "북한 드론 전력 증강과 국방부 대응",
  scope:
    "북한의 국방발전 5개년 계획(2026~2030)의 무인공격체계, 러시아 기술 이전 의혹, 2026년 6월 국방부의 드론작전사령부 개편과 드론·대드론 정책, 2026·2027년 드론 예산",
  ministries: ["국방부"],
  categories: ["diplomacy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-hands-off",
      text: "북한이 드론 기술까지 들여오는데 정부는 북한 문제와 안보에 손을 놓고 있다",
      claimIds: ["claim-nk-plan", "claim-russia", "claim-mnd", "claim-budget-critique"],
    },
    {
      id: "rumor-budget",
      text: "드론 관련 예산은 어떻게 됐나",
      claimIds: ["claim-budget-2026", "claim-budget-2027", "claim-budget-critique"],
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
    {
      id: "claim-budget-2026",
      text:
        "2026년 예산의 '50만 드론전사 양성' 사업은 국회 심의에서 205억 원에서 330억 원으로 늘었다. 교육용 드론 단가를 대당 260만 원으로 올려 GPS·모터·배터리 등 핵심부품을 국산화하기 위해서라는 설명이었다.",
      assertionType: "FACT",
      sourceIds: ["src-gonggam-drone", "src-munhwa-11551577"],
      verified: true,
    },
    {
      id: "claim-budget-2027",
      text:
        "정부가 국회에 낸 2027년 국방예산안(73조 2,777억 원, 8.2% 증가)에서 드론·대드론 예산은 8,061억 원으로 2026년(6,788억 원)보다 18.8% 늘었다. " +
        "'50만 드론전사' 교육훈련 예산은 296억 원에서 771억 원으로 커졌다. 최종 규모는 국회 의결로 정해진다.",
      assertionType: "FACT",
      sourceIds: ["src-aitimes-41743", "src-newswhoplus-68723"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-budget-critique"],
  timeline: [
    {
      id: "t-budget-2027",
      date: "2026-09",
      datePrecision: "month",
      title: "2027년 국방예산안 드론·대드론 8,061억 원",
      summary: "국회 심의 중.",
      claimIds: ["claim-budget-2027"],
    },
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
    "국방 드론·대드론 발전 정책의 전력 규모는 국방부 자료로 확인하지 못했다.",
    "북한 군사 동향에 대한 합동참모본부의 2026년 공식 평가는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-aitimes-41743",
      title: "2027년 국방예산 73조원 돌파, 역대 최대… AI·유무인체계에 7,727억원 투입",
      publisher: "인공지능신문",
      url: "https://www.aitimes.kr/news/articleView.html?idxno=41743",
      publishedAt: "2026-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newswhoplus-68723",
      title: "국방예산 73조2777억원…전작권·AI·드론 집중투자",
      publisher: "뉴스후플러스",
      url: "https://www.newswhoplus.com/news/articleView.html?idxno=68723",
      publishedAt: "2026-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-gonggam-drone",
      title: "장거리 자폭무인기 전력화 50만 드론 전사 양성",
      publisher: "K-공감(대한민국 정부 정책주간지)",
      url: "https://gonggam.korea.kr/newsContentView.es?mid=a12503000000&section_id=NCCD_POLICY&news_id=8cebd409-8722-465a-992a-9762b49993a7",
      type: "official",
      license: "public",
    },
    {
      id: "src-munhwa-11551577",
      title: "[속보]국방부 \"90% 이상 중국산인 드론 핵심부품 국산화…1만1200여대 대량구매해 50만 드론전사 육성\"",
      publisher: "문화일보",
      url: "https://www.munhwa.com/article/11551577",
      type: "press",
      license: "link-only",
    },
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
