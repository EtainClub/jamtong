import type { PolicyInput } from "./schema";

/**
 * 자동차보험 대차료(렌트비) 지급 기준과 2026년 국정감사 지적.
 *
 * 대통령 유튜브 영상 답글에 "국정감사에서 지적된 자동차보험 대차료 지급 기준과 보험사 관행 문제에 관심을 가져 달라"는
 * 요청이 달렸다(잼통 Voice). 국감에서 무엇이 지적됐고 공정위·금감원이 무엇을 하겠다고 했는지 적는다.
 *
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #263.
 */
export const CAR_INSURANCE_RENTAL: PolicyInput = {
  slug: "car-insurance-rental",
  title: "자동차보험 대차료 지급 기준과 2026년 국정감사",
  scope:
    "사고 피해 차량의 렌트비(대차료) 지급 관행, 2026년 8월 대법원 판결, 10월 정무위 종합감사에서 나온 지적과 공정거래위원장 답변, 금감원의 렌트비 유의사항 안내",
  ministries: ["공정거래위원회", "금융감독원", "금융위원회"],
  categories: ["economy", "welfare"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-rental",
      text: "국정감사에서 지적된 자동차보험 대차료 지급 기준과 보험사 관행 문제에 관심을 가져 달라",
      claimIds: ["claim-audit", "claim-ftc", "claim-court"],
    },
  ],
  claims: [
    {
      id: "claim-audit",
      text:
        "2026년 10월 21일 국회 정무위원회 종합국정감사에서 민주당 박홍배 의원은 대차료 1,406만 원을 청구했는데 455만 원만 지급된 사례, 255만 원 청구에 89만 원이 지급된 사례를 들며 " +
        "피해자가 소송을 해야 정당한 보상을 받는 관행을 지적했다. 삼성화재 대차료 인정기준에 대해서는 공정위에 불공정약관 심사청구가 제기된 상태다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261022", "src-pinpoint-497388"],
      verified: true,
    },
    {
      id: "claim-ftc",
      text: "주병기 공정거래위원장은 대법원 판결의 취지를 살리겠다며 대차료 관련 약관 변경도 추진해 보겠다고 답했다.",
      assertionType: "CLAIM",
      assertedBy: "공정거래위원장",
      sourceIds: ["src-newspim-20261022", "src-sportskhan-20261022"],
      verified: true,
    },
    {
      id: "claim-court",
      text:
        "대법원은 2026년 8월 손해배상액을 정할 때 법원이 보험 약관의 지급기준에 구속되지 않는다고 판단했다. 다만 사건을 원심으로 돌려보내면서, 대차의 필요성과 비용의 상당성은 피해자가 입증해야 한다고 봤다.",
      assertionType: "FACT",
      sourceIds: ["src-sportskhan-20261022"],
      verified: true,
    },
    {
      id: "claim-fss-guide",
      text:
        "금융감독원은 2026년 2월 렌트비 보상 유의사항을 안내했다. 쌍방과실이면 본인 과실 비율만큼 렌트비를 직접 내야 하고, 자차 단독사고는 렌트비가 나오지 않으며, 렌트 대신 렌트비의 35%를 교통비로 받을 수 있다. " +
        "보험사가 사고 접수 때 피해자에게 바로 안내할 표준안내문도 마련했다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-20260203"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-audit"],
  timeline: [
    {
      id: "t-fss",
      date: "2026-02-02",
      datePrecision: "day",
      title: "금감원 렌트비 유의사항 안내",
      summary: "표준안내문 마련.",
      claimIds: ["claim-fss-guide"],
    },
    {
      id: "t-court",
      date: "2026-08",
      datePrecision: "month",
      title: "대법원 \"약관 기준에 법원 구속 안 돼\"",
      summary: "파기환송.",
      claimIds: ["claim-court"],
    },
    {
      id: "t-audit",
      date: "2026-10-21",
      datePrecision: "day",
      title: "정무위 종합감사 지적",
      summary: "공정위원장 \"약관 변경 추진\".",
      claimIds: ["claim-audit", "claim-ftc"],
    },
  ],
  gaps: [
    "공정위의 삼성화재 약관 심사 결과와 표준약관 개정 일정은 아직 나오지 않았다.",
  ],
  sources: [
    {
      id: "src-newspim-20261022",
      title: "[2026 국감] 렌터카비 1406만원 청구에 455만원 지급…공정위, 대차료 약관 개정 추진",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261022000326",
      publishedAt: "2026-10-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-pinpoint-497388",
      title: "[국감] 박홍배 의원 \"자동차보험 대차료, 소송해야 정당한 보상받는 건 문제\"",
      publisher: "핀포인트뉴스",
      url: "https://www.pinpointnews.co.kr/news/articleView.html?idxno=497388",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sportskhan-20261022",
      title: "대법원 판결에도 달라지지 않는 자동차보험 대차료…국감서 불공정 지급 관행 도마 위",
      publisher: "스포츠경향",
      url: "https://sports.khan.co.kr/article/202610221104013/",
      publishedAt: "2026-10-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-20260203",
      title: "사고 직후 렌터카 이용했다가 '본인 부담'…금감원, 자동차보험 유의사항 안내",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2552218",
      publishedAt: "2026-02-03",
      type: "press",
      license: "link-only",
    },
  ],
};
