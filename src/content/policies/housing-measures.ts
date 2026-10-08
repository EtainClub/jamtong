import type { PolicyInput } from "./schema";

/**
 * 부동산 대책과 그를 둘러싼 소문.
 *
 * 이재명 정부의 주택 대책은 2025년 6월 대출 규제, 10월 규제지역·토지거래허가구역
 * 확대로 이어졌다. 그 사이 "곧 나올 종합대책" 지라시와 "토허제로 세입자 갱신권이
 * 사라진다"는 보도가 돌았다.
 *
 * ★ 대책의 내용은 FACT, 소문에 대한 정부·대통령 해명은 CLAIM이다.
 * ★ 2025년 대책은 그 뒤 바뀌었을 수 있다. 현재 적용 여부는 gaps에 적는다.
 * ★ 대통령의 주택 공급 글은 언행 `housing-supply`가 따로 다룬다.
 */
export const HOUSING_MEASURES: PolicyInput = {
  slug: "housing-measures",
  title: "부동산 대책",
  scope: "2025~2026년 주택 대출 규제·규제지역 지정과 관련 소문에 대한 정부 해명",
  ministries: ["국토교통부", "금융위원회", "재정경제부"],
  categories: ["economy", "region"],
  asOf: "2026-10-08",
  rumors: [
    {
      id: "rumor-secret-plan",
      text: "다주택자 양도세 82.5%·전세대출 전면 금지 같은 부동산 종합대책이 곧 시행된다",
      claimIds: ["claim-fake-plan"],
    },
    {
      id: "rumor-renewal",
      text: "토지거래허가구역 실거주 유예 때문에 세입자의 계약갱신청구권이 사라진다",
      claimIds: ["claim-renewal-president", "claim-renewal-molit"],
    },
  ],
  claims: [
    {
      id: "claim-627",
      text:
        "2025년 6월 27일 금융당국은 6월 28일부터 수도권·규제지역의 주택 구입 목적 " +
        "주택담보대출을 최대 6억 원으로 제한한다고 발표했다. 생애최초 구입 LTV는 " +
        "80%에서 70%로 낮추고 6개월 안에 전입하도록 했다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-627"],
      verified: true,
    },
    {
      id: "claim-1015",
      text:
        "2025년 10월 15일 정부는 서울 전역과 경기 12곳을 조정대상지역·투기과열지구와 " +
        "토지거래허가구역으로 지정하고, 이 지역 무주택자의 주택담보대출 LTV를 70%에서 " +
        "40%로 낮췄다. 토지거래허가구역에서는 취득 후 2년 실거주 의무가 붙었다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-1015", "src-dailian-1015"],
      verified: true,
    },
    {
      id: "claim-foreign-permit",
      text:
        "2025년 8월 21일 국토교통부는 8월 26일부터 1년간 서울 전역·인천 7개 구·경기 " +
        "23개 시군을 외국인 토지거래허가구역으로 지정했다. 허가를 받은 외국인은 4개월 " +
        "안에 입주하고 2년간 실거주해야 한다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-foreign-permit"],
      verified: true,
    },
    {
      id: "claim-fake-plan",
      text:
        "국토교통부·재정경제부·금융위원회는 2026년 6월 10일 공동 보도참고자료에서 " +
        "인터넷에 도는 부동산 종합대책 내용이 사실무근이라고 밝혔다. 비슷한 글은 2월에 " +
        "이미 수사를 의뢰했고 추가 수사 의뢰를 하겠다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부·재정경제부·금융위원회",
      sourceIds: ["src-newsis-fake-plan", "src-newspim-fake-plan"],
      verified: true,
    },
    {
      id: "claim-renewal-president",
      text:
        "이 대통령은 2026년 5월 20일 국무회의에서 계약갱신청구권은 세입자의 권리이고 " +
        "세입자가 동의해야 줄일 수 있다며, 세입자의 갱신청구권은 그대로 유지된다고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-asiae-renewal", "src-ajunews-renewal"],
      verified: true,
    },
    {
      id: "claim-renewal-molit",
      text:
        "같은 날 국토교통부 제1차관은 해당 보도가 전혀 사실이 아니며 세입자는 " +
        "주택임대차보호법으로 보호된다고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부",
      sourceIds: ["src-asiae-renewal"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-627",
      date: "2025-06-27",
      datePrecision: "day",
      title: "주택담보대출 6억 원 상한",
      summary: "수도권·규제지역 주택 구입 대출을 최대 6억 원으로 묶었다.",
      claimIds: ["claim-627"],
    },
    {
      id: "t-foreign",
      date: "2025-08-21",
      datePrecision: "day",
      title: "외국인 토지거래허가구역 지정",
      summary: "수도권 대부분에서 외국인은 실거주 목적으로만 주택을 살 수 있게 했다.",
      claimIds: ["claim-foreign-permit"],
    },
    {
      id: "t-1015",
      date: "2025-10-15",
      datePrecision: "day",
      title: "서울 전역 규제지역·토지거래허가구역",
      summary: "서울 전역과 경기 12곳으로 넓히고 LTV를 40%로 낮췄다.",
      claimIds: ["claim-1015"],
    },
    {
      id: "t-renewal",
      date: "2026-05-20",
      datePrecision: "day",
      title: "갱신청구권 보도 반박",
      summary: "대통령과 국토교통부가 세입자 갱신권이 유지된다고 밝혔다.",
      claimIds: ["claim-renewal-president", "claim-renewal-molit"],
    },
    {
      id: "t-fake-plan",
      date: "2026-06-10",
      datePrecision: "day",
      title: "종합대책 유포글 사실무근",
      summary: "3개 부처가 공동으로 부인하고 수사 의뢰를 예고했다.",
      claimIds: ["claim-fake-plan"],
    },
  ],
  gaps: [
    "2025년 대책들이 지금도 같은 내용으로 적용되는지는 확인하지 못했다. 외국인 토지거래허가구역은 일부 지자체가 2027년 8월까지 연장을 공고했다.",
    "6월 10일 수사 의뢰의 결과는 확인하지 못했다.",
    "대책의 효과(집값·거래량 변화)는 이 페이지에서 다루지 않는다.",
  ],
  sources: [
    {
      id: "src-fsc-627",
      title: "가계부채 관리 방안 (보도자료)",
      publisher: "금융위원회",
      url: encodeURI("https://files-scs.pstatic.net/2025/06/27/6yDjjGw0Ji/250627(보도자료)가계부채 관리 방안.pdf"),
      publishedAt: "2025-06-27",
      type: "official",
      license: "public",
    },
    {
      id: "src-newsis-1015",
      title: "서울, 경기 12곳 LTV 70%→40% 축소",
      publisher: "뉴시스",
      url: "https://mobile.newsis.com/view/NISX20251016_0003365057",
      publishedAt: "2025-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1015",
      title: "서울 전역·경기 12곳, LTV 40%·실거주 의무 적용 [10.15 부동산 대책]",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1559740",
      publishedAt: "2025-10-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-foreign-permit",
      title: "외국인, 실거주 안 하면 서울 집 못 산다…'외국인 토허제' 시행",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20250821_0003298616",
      publishedAt: "2025-08-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-fake-plan",
      title: "정부 \"인터넷 떠도는 부동산 종합대책 사실무근…수사 의뢰\"",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260610_0003664554",
      publishedAt: "2026-06-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-fake-plan",
      title: "국토부 \"부동산 종합대책 유포글 사실 아냐\"…수사의뢰 예고",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260611001114",
      publishedAt: "2026-06-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-renewal",
      title: "李대통령 \"세입자 갱신권 침해·중국인 아파트 싹쓸이 보도는 왜곡 조작\"",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026052016392851333",
      publishedAt: "2026-05-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-renewal",
      title: "李대통령, '계약갱신권 침해 보도'에 \"국정 폄훼…못된 사람들\"",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20260520172625978",
      publishedAt: "2026-05-20",
      type: "press",
      license: "link-only",
    },
  ],
};
