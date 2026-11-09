import type { PolicyInput } from "./schema";

/**
 * 테슬라 '감독형 FSD'의 국내 허용 범위와 국토교통부 입장 (2025~2026).
 *
 * 대통령 유튜브 영상 답글에 "이미 돈을 내고 산 테슬라 완전자율주행(FSD) 기능을 국내에서도 쓸 수 있게 법을 고쳐 달라"는
 * 요청이 달렸다(잼통 Voice). 지금 누가 쓸 수 있고 누가 못 쓰는지, 그 이유가 무엇인지 적는다.
 *
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #264.
 */
export const TESLA_FSD: PolicyInput = {
  slug: "tesla-fsd",
  title: "테슬라 감독형 FSD의 국내 허용 범위와 정부 입장",
  scope:
    "2025년 11월 국내 출시된 테슬라 감독형 FSD의 적용 차량(미국산 HW4), 중국산 차량이 제외되는 이유, 국토교통부의 자기인증·책임 설명, 2026년 국정감사 지적",
  ministries: ["국토교통부"],
  categories: ["economy", "institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-fsd",
      text: "이미 돈을 내고 산 테슬라 완전자율주행(FSD) 기능을 국내에서도 쓸 수 있게 법을 고쳐 달라",
      claimIds: ["claim-launch", "claim-china-made", "claim-molit", "claim-audit"],
    },
  ],
  claims: [
    {
      id: "claim-launch",
      text:
        "테슬라코리아는 2025년 11월 '감독형 FSD'의 국내 출시를 알렸다. 테슬라는 이 기능이 완전한 자율주행이 아니며 운전자가 항상 주의를 유지해야 한다고 안내했다. " +
        "적용 대상은 미국에서 생산된 HW4 탑재 차량이다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20251112", "src-economist-20251119"],
      verified: true,
    },
    {
      id: "claim-china-made",
      text:
        "미국산 차량은 한미 FTA에 따라 미국 안전기준 인증으로 국내 판매가 가능하지만, 국내 판매의 대부분을 차지하는 중국산 테슬라는 이 경로에 해당하지 않아 FSD를 쓸 수 없다. " +
        "기존 HW3 차량 소유자들은 차별이라며 소송을 냈다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1572970", "src-economist-20251118"],
      verified: true,
    },
    {
      id: "claim-molit",
      text:
        "국토교통부는 감독형 FSD를 운전자 보조장치에 해당하는 레벨 2로 테슬라가 자기인증한 것이라고 설명했고, 사고 책임은 운전자에게 있다. " +
        "2026년 1월에는 중국산 테슬라를 염두에 두고 제도를 설계할 수는 없다며 규제를 풀 계획이 없다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부",
      sourceIds: ["src-segye-20260115", "src-hankyung-mag-202512"],
      verified: true,
    },
    {
      id: "claim-audit",
      text:
        "2026년 10월 국정감사에서 테슬라코리아는 정부에 FSD 안전성 검증을 신청한 적이 없다고 밝혔고, 국토부도 국내에서 운행 중인 FSD의 안전성을 별도로 시험하지 않은 것으로 나타났다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20261008"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-audit"],
  timeline: [
    {
      id: "t-launch",
      date: "2025-11",
      datePrecision: "month",
      title: "감독형 FSD 국내 출시",
      summary: "미국산 HW4 차량만.",
      claimIds: ["claim-launch", "claim-china-made"],
    },
    {
      id: "t-molit",
      date: "2026-01-15",
      datePrecision: "day",
      title: "국토부 \"규제 완화 계획 없다\"",
      summary: "중국산 차량 관련.",
      claimIds: ["claim-molit"],
    },
    {
      id: "t-audit",
      date: "2026-10-08",
      datePrecision: "day",
      title: "국감 \"검증 신청도 안 해\"",
      summary: "국토부 별도 시험 없음.",
      claimIds: ["claim-audit"],
    },
  ],
  gaps: [
    "유엔 자동차기준(WP.29) 개정에 따라 2027년 전면 도입된다는 전망 기사가 있으나 정부 발표로 확인되지 않아 싣지 않았다.",
    "HW3 소유자 소송의 진행 결과는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-hankyung-20251112",
      title: "테슬라 감독형 FSD 국내 출시(한국경제 보도)",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/202511129974g",
      publishedAt: "2025-11-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-economist-20251118",
      title: "테슬라 FSD 국내 도입과 HW3 차량 소유자 반발(이코노미스트 보도)",
      publisher: "이코노미스트",
      url: "https://economist.co.kr/article/view/ecn202511180046",
      publishedAt: "2025-11-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-economist-20251119",
      title: "테슬라 감독형 FSD 적용 범위(이코노미스트 보도)",
      publisher: "이코노미스트",
      url: "https://economist.co.kr/article/view/ecn202511190028",
      publishedAt: "2025-11-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1572970",
      title: "한미 FTA 틈새 타고 테슬라 'FSD' 온다… 속타는 현대차",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1572970/",
      publishedAt: "2025-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-mag-202512",
      title: "국내 작동 중인 테슬라 FSD(한경비즈니스 보도)",
      publisher: "한경비즈니스",
      url: "https://magazine.hankyung.com/business/article/202512031549b",
      publishedAt: "2025-12-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20260115",
      title: "국토부의 중국산 테슬라 FSD 규제 입장(세계일보 보도)",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20260115506844",
      publishedAt: "2026-01-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20261008",
      title: "테슬라, FSD 검증 신청도 안 했다…국감서 \"정부와 협조\"",
      publisher: "머니투데이방송",
      url: "https://news.mtn.co.kr/news-detail/2026100822383045851",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
  ],
};
