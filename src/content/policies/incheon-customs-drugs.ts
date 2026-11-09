import type { PolicyInput } from "./schema";

/**
 * 인천세관 마약 밀수 '수사 외압' 의혹과 합동수사단 결론 (2025~2026).
 *
 * 대통령 유튜브 영상 답글에 "인천세관 마약 수사 무마 의혹 사건을 다시 수사해 달라"는 요청이 달렸다(잼통 Voice).
 * 이 의혹은 이미 검·경 합동수사단이 8개월 수사해 2026년 2월 종결했다. 그 결론과 남은 쟁점을 적는다.
 *
 * ★ 합수단 결론은 수사기관의 판단이다. 백해룡 경정은 반발하고 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #262.
 */
export const INCHEON_CUSTOMS_DRUGS: PolicyInput = {
  slug: "incheon-customs-drugs",
  title: "인천세관 마약 밀수 '수사 외압' 의혹과 합동수사단 결론",
  scope:
    "백해룡 경정이 제기한 인천세관 직원 마약 밀수 연루·수사 외압 의혹, 서울동부지검 합동수사단의 중간(2025년 12월)·최종(2026년 2월) 발표, 공수처 이첩",
  ministries: ["검찰", "경찰청", "관세청", "고위공직자범죄수사처"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-reinvestigate",
      text: "인천세관 마약 수사 무마 의혹 사건을 다시 수사해 달라",
      claimIds: ["claim-final", "claim-customs", "claim-prosecutors", "claim-dispute"],
    },
  ],
  claims: [
    {
      id: "claim-final",
      text:
        "임은정 서울동부지검장이 지휘한 합동수사단은 2026년 2월 26일 \"백 경정이 제기한 각종 의혹들의 실체가 없음을 확인했다\"며 모든 수사 절차를 종결했다. " +
        "압수수색 30곳, 휴대전화 46대 포렌식에도 경찰 고위직과 대통령실 관계자가 연락한 내역은 나오지 않았다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "서울동부지검 합동수사단",
      sourceIds: ["src-khan-20260226", "src-segye-20260226", "src-khan-20251209"],
      verified: true,
    },
    {
      id: "claim-customs",
      text: "인천세관 직원 11명은 전원 혐의없음 처분을 받았고, 밀수 조직원과 유통책 8명만 기소됐다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20260226", "src-asiae-20260226"],
      verified: true,
    },
    {
      id: "claim-prosecutors",
      text:
        "당시 사건을 담당한 검사 4명의 직무유기 의혹은 공수처로 이첩됐다. 한동훈 전 법무부 장관과 이원석 전 검찰총장 등 7명은 2월 19일 불송치됐다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20260226"],
      verified: true,
    },
    {
      id: "claim-dispute",
      text:
        "합수단은 백 경정이 확증편향에 빠져 밀수범들의 허위 진술에 의존한 무리한 수사를 했고, 불리한 수사자료를 빼고 허위 수사서류를 작성했다며 경찰청에 징계 등을 통보했다. " +
        "백 경정은 무혐의 결론에 강하게 반발했다.",
      assertionType: "CLAIM",
      assertedBy: "서울동부지검 합동수사단",
      sourceIds: ["src-khan-20260226", "src-asiae-20260226"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-dispute"],
  timeline: [
    {
      id: "t-interim",
      date: "2025-12-09",
      datePrecision: "day",
      title: "합수단 중간 발표 \"외압 실체 없어\"",
      summary: "대통령실·검찰 관련 의혹은 계속 수사.",
      claimIds: ["claim-final"],
    },
    {
      id: "t-final",
      date: "2026-02-26",
      datePrecision: "day",
      title: "합수단 수사 종결",
      summary: "세관 직원 11명 무혐의, 검사 4명 공수처 이첩.",
      claimIds: ["claim-final", "claim-customs", "claim-prosecutors"],
    },
  ],
  gaps: [
    "공수처로 넘어간 검사 4명 사건의 처리 결과는 11월 9일까지 확인되지 않았다.",
  ],
  sources: [
    {
      id: "src-khan-20251209",
      title: "[속보]백해룡 '마약 수사외압' 주장 실체 없었다···'임은정 지휘' 합수단 발표",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202512091439011",
      publishedAt: "2025-12-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260226",
      title: "\"백해룡, 확증편향 빠져 무리한 수사\"···동부지검 '마약수사 외압' 수사결과 발표",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202602261100001",
      publishedAt: "2026-02-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20260226",
      title: "백해룡 '마약 수사 외압' 실체는 없었다",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20260226517599",
      publishedAt: "2026-02-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20260226",
      title: "합수단, '마약밀수 외압' 수사 종결…\"백해룡의 확증편향\"",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026022609105359532",
      publishedAt: "2026-02-26",
      type: "press",
      license: "link-only",
    },
  ],
};
