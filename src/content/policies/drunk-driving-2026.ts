import type { PolicyInput } from "./schema";

/**
 * 음주·약물운전 처벌 강화 (2026년 시행).
 *
 * 대통령 유튜브 영상 답글에 "음주운전 처벌을 훨씬 강하게 해 달라"는 요청이 달렸다(잼통 Voice).
 * 2026년에 실제로 시행된 강화 조치(약물운전 처벌 상향, 상습 음주운전자 방지장치 의무화)를 적는다.
 *
 * ★ 시행일과 처벌 수위는 경찰청 발표를 전한 보도로 확인했다. 법령 원문 대조는 gaps에 적는다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #258.
 */
export const DRUNK_DRIVING_2026: PolicyInput = {
  slug: "drunk-driving-2026",
  title: "음주·약물운전 처벌 강화 (2026년 시행)",
  scope: "2026년 4월 약물운전 처벌 상향·측정 불응죄 신설, 10월 상습 음주운전자 '음주운전 방지장치' 조건부 면허 시행",
  ministries: ["경찰청"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-dui",
      text: "음주운전 처벌을 훨씬 강하게 해 달라",
      claimIds: ["claim-interlock", "claim-drug"],
    },
  ],
  claims: [
    {
      id: "claim-interlock",
      text:
        "2026년 10월부터 최근 5년 안에 음주운전으로 2회 이상 적발된 운전자는 결격 기간이 끝나 면허를 다시 딸 때 차량에 '음주운전 방지장치'를 달아야만 운전할 수 있는 조건부 면허를 받는다. " +
        "장치 설치비는 약 300만 원이며, 경찰청은 대여 방식도 도로교통공단과 협의 중이라고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20251228", "src-nate-20251228"],
      verified: true,
    },
    {
      id: "claim-interlock-penalty",
      text: "방지장치 없이 운전하면 1년 이하의 징역 또는 300만 원 이하의 벌금에 처할 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-sedaily-14163405"],
      verified: false,
    },
    {
      id: "claim-drug",
      text:
        "2026년 4월 2일부터 약물운전 측정에 응하지 않으면 처벌하는 '약물 측정 불응죄'가 생겼고, 약물운전 처벌 상한은 3년 이하 징역·1,000만 원 이하 벌금에서 5년 이하 징역·2,000만 원 이하 벌금으로 올랐다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20251228", "src-sedaily-14163405"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-drug",
      date: "2026-04-02",
      datePrecision: "day",
      title: "약물운전 처벌 상향",
      summary: "측정 불응죄 신설.",
      claimIds: ["claim-drug"],
    },
    {
      id: "t-interlock",
      date: "2026-10",
      datePrecision: "month",
      title: "음주운전 방지장치 조건부 면허",
      summary: "5년 내 2회 이상 적발자.",
      claimIds: ["claim-interlock"],
    },
  ],
  gaps: [
    "방지장치 회피(대리 측정) 처벌 수위는 보도마다 달라(1년·300만 원 / 3년·3,000만 원) 법령 원문으로 확인하지 못했다.",
    "10월 시행 이후 조건부 면허 발급 건수는 아직 공개되지 않았다.",
    "혈중알코올농도 기준이나 음주운전 자체의 법정형을 더 올리는 개정안의 국회 경과는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-asiae-20251228",
      title: "'2026년 도로교통법령' 이렇게 달라집니다…음주운전 방지장치 의무화",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2025122810453702812",
      publishedAt: "2025-12-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20251228",
      title: "내년 10월부터 상습 음주운전자 '시동 방지 장치' 의무화",
      publisher: "네이트 뉴스",
      url: "https://m.news.nate.com/view/20251228n11130",
      publishedAt: "2025-12-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sedaily-14163405",
      title: "약물 측정 거부도 처벌…음주운전 방지장치 의무화로 단속 강화",
      publisher: "서울경제",
      url: "https://www.sedaily.com/article/14163405",
      type: "press",
      license: "link-only",
    },
  ],
};
