import type { PolicyInput } from "./schema";

/**
 * 노조 회계공시와 노란봉투법(노동조합법 2·3조 개정).
 *
 * "윤석열 정부가 노조 회계공시를 도입하고 공시하지 않으면 세액공제를 끊어 양대 노총이
 * 결국 응했다", "민주당이 노란봉투법을 통과시켰고 불법 폭력 파업을 국가가 아무것도
 * 제지하지 않는다"는 글이 돈다(2026년 4월 게시물). 앞의 것은 대체로 사실이다. 뒤의 것
 * 가운데 노란봉투법 통과·시행은 사실이지만, 폭력·파괴 파업은 개정 뒤에도 법으로
 * 금지되고 형사처벌 대상이다.
 *
 * ★ 이재명 정부는 회계공시 제도는 두고 상급단체 연동만 없애는 방향을 밝혔다.
 *   2026년 10월 1일 시행 시행령에는 아직 연동 요건이 남아 있다.
 * ★ 실제 불법 파업 단속·처벌 실적은 확인하지 못했다. 법 조문으로 확인한 것만 적는다.
 * ★ 2026-10-13 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #30·#32·#34.
 * ★ 2026-10-31 보충 — 잼통 Voice 이슈 #154(시행령).
 */
export const LABOR_UNION_POLICY: PolicyInput = {
  slug: "labor-union-policy",
  title: "노조 회계공시와 노란봉투법",
  scope:
    "노동조합 회계공시와 조합비 세액공제 연계(2023년 도입, 2026년 개편 추진), " +
    "노동조합법 2·3조 개정(노란봉투법)의 손해배상 제한과 폭력 쟁의 금지 조항",
  ministries: ["고용노동부", "재정경제부"],
  categories: ["institution", "welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-disclosure-what",
      text: "노조 회계공시는 노동조합(및 산하조직)이 전년도 회계연도 결산(자산·부채, 수입·지출 등)을 공시포털에 공개하는 제도다",
      claimIds: ["claim-disclosure-rule"],
    },
    {
      id: "rumor-tax-credit",
      text: "노조 회계공시를 이행하지 않으면 세액공제를 중단했고, 그 결과 민노총과 한국노총 모두 공시에 응했다",
      claimIds: ["claim-disclosure-rule", "claim-unions-complied", "claim-2026-change"],
    },
    {
      id: "rumor-no-sanction",
      text: "민주당 집권 정부가 노란봉투법을 통과시켰고, 불법 폭력 파업에 대해 국가가 아무런 제지도 하지 않는다",
      claimIds: ["claim-yellow-enacted", "claim-art3", "claim-art42", "claim-yellow-reading"],
    },
    {
      id: "rumor-decree",
      text: "노란봉투법을 시행령으로 누더기로 만들었다",
      claimIds: ["claim-decree", "claim-decree-critique"],
    },
  ],
  claims: [
    {
      id: "claim-disclosure-rule",
      text:
        "2023년 윤석열 정부는 노동조합법 시행령과 소득세법 시행령을 고쳐, 조합원 1,000명 이상 노조가 " +
        "직전 회계연도 결산결과를 정부 공시시스템에 공표해야 조합원이 낸 조합비를 세액공제 받을 수 " +
        "있게 했다. 공표 자체는 의무가 아니지만 하지 않으면 조합원이 공제를 못 받는다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20230615", "src-law-itax-decree"],
      verified: true,
    },
    {
      id: "claim-linkage",
      text:
        "소득세법 시행령 제80조 제1항 제2호 가목은 단위노조뿐 아니라 그 조합비를 나눠 받는 상급단체" +
        "(연합단체 등)의 결산결과도 공표돼야 공제를 인정한다. 그래서 민주노총·한국노총이 공시하지 않으면 " +
        "산하 노조 조합원도 공제를 받지 못한다. 2026년 10월 1일 시행 시행령에도 이 요건이 남아 있다.",
      assertionType: "FACT",
      sourceIds: ["src-law-itax-decree"],
      verified: true,
    },
    {
      id: "claim-unions-complied",
      text:
        "한국노총은 2023년 10월 23일, 민주노총은 10월 24일 회계공시에 응하기로 했다. 민주노총은 조합원에게 " +
        "불이익을 주지 않기 위해서라고 밝혔다. 한국노총은 상급단체 미공시 때 산하 조직까지 공제에서 빼는 " +
        "방식을 '연좌제'라고 비판하며 헌법소원을 내겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20231024"],
      verified: true,
    },
    {
      id: "claim-2026-change",
      text:
        "고용노동부는 2026년 7월 회계공시 제도는 유지하되, 상급단체 공시 여부에 따라 산하 노조 조합원의 " +
        "세액공제를 막는 연동 규정은 없애는 소득세법 시행령 개정안을 입법예고할 계획이라고 밝혔다. " +
        "2025년 기준 회계공시 참여율은 89.1%였다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20260727"],
      verified: true,
    },
    {
      id: "claim-yellow-enacted",
      text:
        "노동조합법 2·3조 개정(이른바 노란봉투법)은 2025년 9월 9일 공포돼 2026년 3월 10일부터 시행됐다. " +
        "사용자 범위를 넓히고 노조 활동에 대한 손해배상 청구를 제한하는 내용이다.",
      assertionType: "FACT",
      sourceIds: ["src-law-tula"],
      verified: true,
    },
    {
      id: "claim-art3",
      text:
        "개정 제3조는 이 법에 따른 단체교섭·쟁의행위 등 노조 활동으로 손해를 입은 사용자가 배상을 청구할 " +
        "수 없게 하고, 사용자의 불법행위에 맞서 부득이 손해를 가한 경우도 면책한다. 배상책임을 인정할 " +
        "때는 법원이 근로자마다 지위·관여 정도 등을 따져 책임비율을 정하게 했다. 배상책임 자체를 없앤 " +
        "것은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-law-tula"],
      verified: true,
    },
    {
      id: "claim-art42",
      text:
        "같은 법 제42조는 폭력·파괴행위나 주요 시설을 점거하는 방식의 쟁의행위를 금지하고, 제89조는 이를 " +
        "어기면 3년 이하 징역 또는 3천만 원 이하 벌금에 처한다. 노란봉투법은 이 조항들을 바꾸지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-law-tula"],
      verified: true,
    },
    {
      id: "claim-yellow-reading",
      text:
        "따라서 노란봉투법 뒤에도 폭력·파괴 파업은 금지되고 처벌 대상이며, 손해배상 제한도 이 법에 따른 " +
        "쟁의행위 등에 대한 것이다. '국가가 아무런 제지도 하지 않는다'는 법 내용과 맞지 않는다. 다만 " +
        "시행 뒤 실제 단속·처벌 실적은 확인하지 못했다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-law-tula"],
      verified: true,
    },
    {
      id: "claim-business-concern",
      text:
        "경영계와 일부 법조계는 손해배상 청구가 불법 파업에 대응할 거의 유일한 수단인데 개정법으로 그 " +
        "통제 기능이 사실상 사라질 수 있다고 우려했다.",
      assertionType: "CLAIM",
      assertedBy: "경영계·일부 노동 전문 변호사",
      sourceIds: ["src-newdaily-20250611"],
      verified: false,
    },
    {
      id: "claim-decree",
      text:
        "노동조합법 시행령 개정안은 2026년 2월 24일 국무회의에서 의결돼 3월 10일 법과 함께 시행됐다. 교섭창구 단일화 틀은 유지하되 그 안에서 " +
        "원·하청 교섭단위를 현장 여건에 맞게 분리할 수 있게 했고, 원청이 하청 노동자의 근로시간·작업 방식을 구조적으로 지배하면 교섭 의무를 지는 " +
        "해석지침도 확정했다. 사용자성 판단을 돕는 '단체교섭 판단지원 위원회'도 둔다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20260224"],
      verified: true,
    },
    {
      id: "claim-decree-critique",
      text:
        "노동계는 시행령이 교섭창구 단일화를 그대로 둬 원청의 사용자 책임을 좁히고 하청 노동자의 교섭권을 제약할 수 있다고 반발했다. 김영훈 " +
        "노동부 장관은 법이 현장에서 원활하게 작동하고 분쟁을 막기 위한 장치라고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "한국노총 등 노동계 / 고용노동부",
      sourceIds: ["src-seoul-20260224"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-business-concern", "claim-linkage", "claim-decree-critique"],
  timeline: [
    {
      id: "t-disclosure-notice",
      date: "2023-06-15",
      datePrecision: "day",
      title: "회계공시·세액공제 연계 시행령 입법예고",
      summary: "조합원 1,000명 이상 노조 대상.",
      claimIds: ["claim-disclosure-rule"],
    },
    {
      id: "t-unions-comply",
      date: "2023-10-24",
      datePrecision: "day",
      title: "양대 노총 회계공시 수용",
      summary: "한국노총 10월 23일, 민주노총 10월 24일.",
      claimIds: ["claim-unions-complied"],
    },
    {
      id: "t-yellow-promulgated",
      date: "2025-09-09",
      datePrecision: "day",
      title: "노동조합법 2·3조 개정 공포",
      summary: "시행은 2026년 3월 10일.",
      claimIds: ["claim-yellow-enacted"],
    },
    {
      id: "t-yellow-effective",
      date: "2026-03-10",
      datePrecision: "day",
      title: "노란봉투법 시행",
      summary: "손해배상 제한·책임비율 조항 시행. 폭력 쟁의 금지(제42조)는 그대로.",
      claimIds: ["claim-yellow-enacted", "claim-art3", "claim-art42"],
    },
    {
      id: "t-linkage-change",
      date: "2026-07-27",
      datePrecision: "day",
      title: "회계공시 연동 규정 폐지 추진",
      summary: "제도는 유지, 상급단체 연동만 폐지. 시행령 개정 전.",
      claimIds: ["claim-2026-change"],
    },
  ],
  gaps: [
    "노란봉투법 시행 뒤 불법 파업에 대한 고발·입건·손해배상 청구 건수는 확인하지 못했다.",
    "회계공시 연동 폐지 시행령 개정안의 입법예고·시행 여부는 2026년 10월 13일 현재 확인하지 못했다.",
    "한국노총이 예고한 헌법소원의 결과는 확인하지 못했다.",
    "공시 항목이 자산·부채·수입·지출을 모두 포함하는지는 공시시스템 서식으로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newsis-20230615",
      title: "\"조합원 1천명 이상 노조, 회계 공시 안하면 세액공제 제외\"",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20230615_0002339497",
      publishedAt: "2023-06-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-law-itax-decree",
      title: "소득세법 시행령 제80조(공익성을 고려하여 정하는 기부금의 범위) — 2026. 10. 1. 시행",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%86%8C%EB%93%9D%EC%84%B8%EB%B2%95%EC%8B%9C%ED%96%89%EB%A0%B9",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-newsis-20231024",
      title: "민주노총, 한국노총 이어 노조 회계 공시 수용키로",
      publisher: "뉴시스",
      url: "https://mobile.newsis.com/view/NISX20231024_0002494695",
      publishedAt: "2023-10-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20260727",
      title: "상급단체 미공시해도 조합비 공제…노조 회계공시 연동 폐지",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000324855",
      publishedAt: "2026-07-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-law-tula",
      title: "노동조합 및 노동관계조정법 제3조·제42조·제89조 — 2026. 3. 10. 시행",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EB%85%B8%EB%8F%99%EC%A1%B0%ED%95%A9%EB%B0%8F%EB%85%B8%EB%8F%99%EA%B4%80%EA%B3%84%EC%A1%B0%EC%A0%95%EB%B2%95",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-newdaily-20250611",
      title: "사용자 범위 확대…법보다 먼저 움직이는 기업들",
      publisher: "뉴데일리",
      url: "https://www.newdaily.co.kr/site/data/html/2025/06/11/2025061100367.html",
      publishedAt: "2025-06-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20260224",
      title: "노란봉투법 시행령 확정…노동계 반발 '교섭창구 단일화' 그대로",
      publisher: "서울신문",
      url: "https://m.seoul.co.kr/news/2026/02/24/20260224500083",
      publishedAt: "2026-02-24",
      type: "press",
      license: "link-only",
    },
  ],
};
