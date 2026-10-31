import type { PolicyInput } from "./schema";

/**
 * 2026년 기준금리 결정과 집값.
 *
 * 10월 X 게시물 답글에 "반도체 의존 위험과 집값 상승에 대응해 기준금리를 미국 수준으로 올려야
 * 한다"는 말이 달렸다(잼통 Voice). 기준금리는 정부가 아니라 한국은행 금융통화위원회가 정한다.
 * 2026년 결정 경과를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #119.
 */
export const BASE_RATE_2026: PolicyInput = {
  slug: "base-rate-2026",
  title: "2026년 기준금리 결정: 두 차례 인상과 10월 동결",
  scope: "한국은행 금융통화위원회의 2026년 7·8월 기준금리 인상과 10월 22일 동결, 결정 주체와 다음 회의 일정",
  ministries: ["한국은행"],
  categories: ["economy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-raise",
      text: "반도체 의존 위험과 집값 상승에 대응해 기준금리를 미국 수준으로 올려야 한다",
      claimIds: ["claim-who", "claim-hikes", "claim-october"],
    },
  ],
  claims: [
    {
      id: "claim-who",
      text: "기준금리는 정부가 아니라 한국은행 금융통화위원회(7명)가 정한다.",
      assertionType: "FACT",
      sourceIds: ["src-fntimes-20261022"],
      verified: false,
    },
    {
      id: "claim-hikes",
      text: "금융통화위원회는 2026년 7월 16일과 8월 27일 기준금리를 0.25%포인트씩 올려 연 2.50%에서 3.00%로 높였다.",
      assertionType: "FACT",
      sourceIds: ["src-fntimes-20261022"],
      verified: false,
    },
    {
      id: "claim-october",
      text:
        "10월 22일에는 위원 전원 일치로 연 3.00% 동결을 결정하고 \"물가 등을 점검하면서 추가 인상 시기와 속도를 결정하겠다\"고 " +
        "밝혔다. 올해 마지막 회의는 11월 26일이다.",
      assertionType: "FACT",
      sourceIds: ["src-fntimes-20261022", "src-news1-6328320"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-july",
      date: "2026-07-16",
      datePrecision: "day",
      title: "기준금리 인상",
      summary: "2.50% → 2.75%.",
      claimIds: ["claim-hikes"],
    },
    {
      id: "t-august",
      date: "2026-08-27",
      datePrecision: "day",
      title: "기준금리 인상",
      summary: "2.75% → 3.00%.",
      claimIds: ["claim-hikes"],
    },
    {
      id: "t-october",
      date: "2026-10-22",
      datePrecision: "day",
      title: "기준금리 동결",
      summary: "3.00% 유지, 만장일치.",
      claimIds: ["claim-october"],
    },
  ],
  gaps: [
    "10월 통화정책방향 결정문이 집값과 가계대출을 어떻게 평가했는지는 원문으로 대조하지 못했다.",
    "같은 시점 미국 연방준비제도의 정책금리와의 차이는 이 페이지에서 정리하지 못했다.",
  ],
  sources: [
    {
      id: "src-fntimes-20261022",
      title: "10월 한은 금통위, 기준금리 연 3% 동결 '숨 고르기'…\"물가 등 점검하면서 추가 인상 시기·속도 결정\"(종합)",
      publisher: "한국금융신문",
      url: "https://www.fntimes.com/html/view.php?ud=202610221201381124179ad43907_18",
      publishedAt: "2026-10-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-6328320",
      title: "[전문] 한국은행 금융통화위원회 10월 통화정책방향 결정문",
      publisher: "뉴스1",
      url: "https://www.news1.kr/economy/trend/6328320",
      publishedAt: "2026-10-22",
      type: "press",
      license: "link-only",
    },
  ],
};
