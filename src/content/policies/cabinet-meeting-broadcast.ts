import type { PolicyInput } from "./schema";

/**
 * 국무회의 생중계: 시작 경위, 운영 방식, 2026년 10월 공개 논란.
 *
 * 대통령의 「국무회의 공개 논란에 대해」(10월 16일) 등에 "생중계에서는 장관이 반대 의견을
 * 내기 어렵다", "대통령의 보여주기 자리다", "다음 정부도 못 되돌리게 제도화하라",
 * "'좋은 친구의 쓴소리' 비유가 지지층을 서운하게 한다"는 답글이 달렸다(잼통 Voice).
 * 생중계가 어떻게 시작됐고 공개·비공개가 어떻게 나뉘는지, 논란이 무엇에서 비롯됐는지,
 * '쓴소리' 대목이 어떤 맥락이었는지 적는다.
 *
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #87, #88.
 */
export const CABINET_MEETING_BROADCAST: PolicyInput = {
  slug: "cabinet-meeting-broadcast",
  title: "국무회의 생중계: 시작 경위, 운영 방식, 2026년 10월 공개 논란",
  scope:
    "2025년 국무회의 생중계의 시작, 공개회의와 비공개회의의 구분, 2026년 7월 국무회의 규정 개정(배석 확대·발언 근거), 2026년 10월 장관 건의 보도와 대통령의 반박, '좋은 친구는 쓴소리' 대목의 맥락",
  ministries: ["청와대", "행정안전부"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-chilling",
      text: "생중계 자리에서는 국무위원이 대통령과 다른 의견을 내기 어려워 자유로운 논의가 막힌다",
      claimIds: ["claim-report", "claim-closed-session", "claim-president-rebuttal"],
    },
    {
      id: "rumor-show",
      text: "국무회의 생중계가 국정 논의보다 대통령의 지식과 관심을 홍보하는 보여주기 자리가 되고 있다",
      claimIds: ["claim-start", "claim-report", "claim-critique"],
    },
    {
      id: "rumor-dictator",
      text: "국무위원 모두에게 자신과 같은 생각과 공개 방식을 요구하는 것은 독재자의 모습이다",
      claimIds: ["claim-closed-session", "claim-rule-2026"],
    },
    {
      id: "rumor-more-voices",
      text: "국무회의에서 늘 발언하는 장관만이 아니라 다른 기관장들도 적극적으로 의견을 내게 해 달라",
      claimIds: ["claim-rule-2026"],
    },
    {
      id: "rumor-institutionalize",
      text: "국무회의 공개를 다음 정부도 되돌리지 못하도록 제도로 못 박아 달라",
      claimIds: ["claim-start", "claim-minutes"],
    },
    {
      id: "rumor-friend",
      text: "'좋은 친구의 쓴소리' 비유와 지지자와 맞서는 모습이 오랜 지지층에게 서운함을 준다",
      claimIds: ["claim-friend"],
    },
  ],
  claims: [
    {
      id: "claim-start",
      text:
        "이재명 대통령의 지시로 2025년 7월 28일 중대재해 근절 대책을 두고 부처 보고와 토론 전 과정이 약 1시간 30분 " +
        "동안 KTV로 생중계됐다. 특정 주제의 토의 전 과정이 생중계된 것은 처음이었다. 대통령실은 일회성이라고 하면서도 " +
        "공개 횟수와 범위를 넓혀 가겠다고 했고, 이후 공개가 이어졌다. 생중계 자체를 정한 법령 조항은 확인되지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20250729"],
      verified: true,
    },
    {
      id: "claim-closed-session",
      text:
        "대통령에 따르면 국무회의는 공개회의에 이어 비공개회의가 따로 열리고, 보안이 필요하거나 국무위원 입장이 " +
        "난처할 수 있는 사안은 비공개회의에서 다룬다. 비공개회의에서도 하기 어려운 말은 전화·메시지나 개별 오찬·" +
        "면담으로 하라고 독려한다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-x-20261016"],
      verified: true,
    },
    {
      id: "claim-report",
      text:
        "한국일보는 10월 15일, 장관 10여 명이 10월 2일 총리공관 만찬에서 한성숙 국무총리에게 생중계 범위를 줄여 달라는 " +
        "의견을 대통령에게 전해 달라고 건의했다고 보도했다. 생중계 중에는 대통령에게 반박하기 어렵고 설익은 정책이 " +
        "추진되기도 한다는 우려, 대통령의 잦은 SNS 활동에 대한 우려가 나왔다고 전했다.",
      assertionType: "CLAIM",
      assertedBy: "한국일보",
      sourceIds: ["src-weeklykhan-20261016"],
      verified: true,
    },
    {
      id: "claim-president-rebuttal",
      text:
        "대통령은 10월 16일 X 글에서, 만찬에서 한 장관이 \"국무회의 공개로 힘들다\"고 한 것 외에 비공개를 건의했다는 " +
        "보도는 사실이 아닌 것으로 보인다고 했다. \"최소한 이 정부에서 대통령에게 해야 할 말을 못하는 국무위원은 " +
        "없다고 확신합니다\"라고 했고, 국무회의를 전부 비공개로 하자는 주장에는 동의할 수 없다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-x-20261016", "src-weeklykhan-20261016"],
      verified: true,
    },
    {
      id: "claim-minutes",
      text: "대통령은 같은 글에서 국무회의 회의록은 이전부터 공개되어 왔다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-x-20261016"],
      verified: true,
    },
    {
      id: "claim-rule-2026",
      text:
        "정부는 2026년 7월 7일 국무회의 규정을 고쳐 전남광주통합특별시장, 시·도지사협의회장, 시장·군수·구청장" +
        "협의회장을 상시 배석 대상에 더했다. 그 전에는 지방자치단체장 중 서울시장만 상시 배석했다. 의장이 필요하다고 " +
        "인정하면 배석자가 국무에 관해 발언할 수 있는 근거도 새로 넣었다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20260708"],
      verified: true,
    },
    {
      id: "claim-friend",
      text:
        "'좋은 친구는 쓴소리를 해주는 친구입니다'는 같은 국무회의 공개 논란 글의 끝 대목이다. 바로 뒤에 \"국민으로부터 " +
        "위임받은 일을 하는 공직자가 다른 공직자에게 시정해야 할 문제가 있다고 생각하면서도 이를 지적하지 않는다면 " +
        "이는 이기심에 기인한 책임회피\"라고 이어져, 공개회의에서 대통령이 장관에게 문제를 지적하는 이유를 설명하는 " +
        "맥락이다. 지지자를 겨냥한 표현은 그 글에 없다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-x-20261016"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "생중계가 대통령과 장관 사이의 공개적 긴장을 키워 불화의 불씨가 될 수 있으니 안전장치를 마련해야 한다는 " +
        "지적과, 장관이 수치를 답하지 못하는 장면이 공개적 질책처럼 보인다는 비판이 언론에서 나왔다.",
      assertionType: "OPINION",
      sourceIds: ["src-heraldk-20251112"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-report", "claim-critique"],
  timeline: [
    {
      id: "t-first",
      date: "2025-07-28",
      datePrecision: "day",
      title: "국무회의 토의 전 과정 첫 생중계",
      summary: "중대재해 근절 대책.",
      claimIds: ["claim-start"],
    },
    {
      id: "t-rule",
      date: "2026-07-07",
      datePrecision: "day",
      title: "국무회의 규정 개정",
      summary: "지방정부 대표 배석 확대, 배석자 발언 근거.",
      claimIds: ["claim-rule-2026"],
    },
    {
      id: "t-report",
      date: "2026-10-15",
      datePrecision: "day",
      title: "\"장관들 생중계 축소 건의\" 보도",
      summary: "한국일보.",
      claimIds: ["claim-report"],
    },
    {
      id: "t-rebuttal",
      date: "2026-10-16",
      datePrecision: "day",
      title: "대통령 「국무회의 공개 논란에 대해」",
      summary: "건의 보도 반박, 전부 비공개에 반대.",
      claimIds: ["claim-president-rebuttal", "claim-friend"],
    },
  ],
  gaps: [
    "국무회의 공개를 법령으로 정하는 개정 논의가 있는지는 찾지 못했다.",
    "국무회의 영상에 외국어 자막을 다는 계획은 확인하지 못했다.",
    "한국일보 원 보도는 직접 보지 못했고 주간경향의 인용으로 확인했다.",
  ],
  sources: [
    {
      id: "src-segye-20250729",
      title: "[사설] 국무회의 생중계, 긍정적 측면만 있는 건 아니다",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20250729514828",
      publishedAt: "2025-07-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-x-20261016",
      title: "국무회의 공개 논란에 대해",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2110887367175483763",
      publishedAt: "2026-10-16",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-weeklykhan-20261016",
      title: "이 대통령 \"최소한 이 정부에서 대통령에게 할 말 못하는 장관 없다\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202610161011001",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20260708",
      title: "전남광주특별시장도 국무회의 간다…민형배 14일 첫 배석",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026070723230429043",
      publishedAt: "2026-07-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20251112",
      title: "李대통령의 각별한 '공개 토론' 사랑…관료들 '긴장' 속 솔직토크 [이런정치]",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2025111217162641021",
      publishedAt: "2025-11-12",
      type: "press",
      license: "link-only",
    },
  ],
};
