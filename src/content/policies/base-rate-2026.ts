import type { PolicyInput } from "./schema";

/**
 * 2026년 기준금리 결정과 집값.
 *
 * 10월 X 게시물 답글에 "반도체 의존 위험과 집값 상승에 대응해 기준금리를 미국 수준으로 올려야
 * 한다"는 말이 달렸다(잼통 Voice). 기준금리는 정부가 아니라 한국은행 금융통화위원회가 정한다.
 * 2026년 결정 경과를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #119.
 * ★ 2026-11-28 보충 — 잼통 Voice 이슈 #316(11월 인상과 가계 부담).
 */
export const BASE_RATE_2026: PolicyInput = {
  slug: "base-rate-2026",
  title: "2026년 기준금리 결정: 세 차례 인상과 10월 동결",
  scope: "한국은행 금융통화위원회의 2026년 7·8월 기준금리 인상, 10월 22일 동결, 11월 26일 인상(연 3.25%)과 그 이유, 결정 주체",
  ministries: ["한국은행"],
  categories: ["economy"],
  asOf: "2026-11-28",
  rumors: [
    {
      id: "rumor-raise",
      text: "반도체 의존 위험과 집값 상승에 대응해 기준금리를 미국 수준으로 올려야 한다",
      claimIds: ["claim-who", "claim-hikes", "claim-october"],
    },
    {
      id: "rumor-burden",
      text: "빚내서 집 사고 사업하는 서민이 많은데 금리를 또 올려 부담만 키운다",
      claimIds: ["claim-who", "claim-november", "claim-november-why", "claim-november-dissent"],
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
    {
      id: "claim-november",
      text:
        "금융통화위원회는 11월 26일 기준금리를 연 3.00%에서 3.25%로 0.25%포인트 올렸다. 7·8월에 이은 올해 세 번째 인상이다.",
      assertionType: "FACT",
      sourceIds: ["src-fntimes-20261126", "src-seoul-20261126"],
      verified: true,
    },
    {
      id: "claim-november-why",
      text:
        "결정문은 반도체 수출을 중심으로 성장세가 강하고 물가가 상당 기간 목표를 웃돌 것으로 보여 인상이 적절하다고 판단했다. " +
        "한은은 올해 성장률 전망을 3.3%에서 3.9%로, 내년을 2.9%에서 4.1%로 올렸다. 결정문은 \"수도권 주택시장 및 가계부채와 관련한 금융불균형 위험에 " +
        "계속 유의할 필요가 있다\"고 적고, 앞으로 \"추가 인상의 시기 등을 결정해 나갈 것\"이라고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "한국은행 금융통화위원회",
      sourceIds: ["src-fntimes-20261126"],
      verified: true,
    },
    {
      id: "claim-november-dissent",
      text:
        "인상에는 위원 7명 가운데 5명이 찬성했고, 황건일·이수형 위원은 동결 의견을 냈다. 만장일치였던 10월 동결과 달리 위원회 안에서 의견이 갈렸다.",
      assertionType: "FACT",
      sourceIds: ["src-fntimes-20261126"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-november-dissent"],
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
    {
      id: "t-november",
      date: "2026-11-26",
      datePrecision: "day",
      title: "기준금리 인상",
      summary: "3.00% → 3.25%, 5 대 2.",
      claimIds: ["claim-november", "claim-november-dissent"],
    },
  ],
  gaps: [
    "10월 통화정책방향 결정문이 집값과 가계대출을 어떻게 평가했는지는 원문으로 대조하지 못했다.",
    "같은 시점 미국 연방준비제도의 정책금리와의 차이는 이 페이지에서 정리하지 못했다.",
    "11월 인상 뒤 정부(재정경제부·금융위원회)가 가계·자영업자 이자 부담을 덜 대책을 따로 냈는지는 확인하지 못했다(11월 28일 기준).",
    "11월 26일 총재 기자간담회의 가계부채·이자 부담 관련 발언은 원문으로 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-fntimes-20261126",
      title: "올해 마지막 한은 금통위, 기준금리 3.25%로 인상…반도체 중심 성장·물가 압력 반영(종합)",
      publisher: "한국금융신문",
      url: "https://www.fntimes.com/html/view.php?ud=202611261110132637179ad43907_18",
      publishedAt: "2026-11-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20261126",
      title: "[속보] 금통위, 기준금리 연 3.25%로 인상 결정",
      publisher: "서울신문",
      url: "https://www.seoul.co.kr/news/economy/finance/2026/11/26/20261126500036",
      publishedAt: "2026-11-26",
      type: "press",
      license: "link-only",
    },
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
