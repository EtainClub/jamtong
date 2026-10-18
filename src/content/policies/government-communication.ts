import type { PolicyInput } from "./schema";

/**
 * 정부 국정홍보 체계 — 누가 정부 정책을 알리는가.
 *
 * "정부 성과 홍보를 지지자의 댓글·SNS에 기대지 말고, 허위 선동에 대응할 국가
 * 차원의 홍보 체계를 갖춰야 한다"는 답글이 돈다(2026년 10월). 사실 주장이라기보다
 * 제안이다. 여기에는 지금 국정홍보를 어느 조직이 맡는지, 국회에서 어떤 말이
 * 나왔는지, 정부가 실제로 바꾼 것(KTV 영상 개방·정부광고 공개)을 모은다.
 *
 * ★ 국정홍보 전담 조직을 다시 만들자는 말은 국회 질의와 기관장 답변이다.
 *   정부가 추진한다고 밝힌 자료는 찾지 못했다 — FACT로 쓰지 않는다.
 * ★ 2026-10-18 처음 등록 — 잼통 Voice voice-gap 이슈 #46.
 */
export const GOVERNMENT_COMMUNICATION: PolicyInput = {
  slug: "government-communication",
  title: "정부 국정홍보 체계: 누가 정책을 알리는가",
  scope:
    "국정홍보 기능의 소관(문화체육관광부·KTV·청와대 홍보소통수석), 2026년 국정감사의 국정홍보 컨트롤타워 " +
    "논의, 이재명 정부가 바꾼 홍보 관련 제도",
  ministries: ["문화체육관광부", "청와대"],
  categories: ["institution"],
  asOf: "2026-10-18",
  rumors: [
    {
      id: "rumor-no-system",
      text: "정부가 성과 홍보를 지지자의 댓글·SNS에 기대고 있으니 국가 차원의 홍보 체계를 갖춰야 한다",
      claimIds: ["claim-structure", "claim-audit", "claim-ktv-open", "claim-ad-disclosure"],
    },
  ],
  claims: [
    {
      id: "claim-structure",
      text:
        "국정홍보처는 2008년 이명박 정부 때 폐지됐고, 그 기능은 문화체육관광부로 넘어갔다. 지금 국정홍보는 " +
        "문화체육관광부가 맡고, 그 아래에 국민방송 KTV와 아리랑TV가 있다.",
      assertionType: "FACT",
      sourceIds: ["src-mediatoday-control-tower-20261014"],
      verified: true,
    },
    {
      id: "claim-audit",
      text:
        "2026년 10월 14일 문화체육관광위원회 국정감사에서 최민희 의원은 \"국정홍보 기능의 컨트롤타워가 필요하지 " +
        "않겠나\"고 물었다. 이창태 KTV 원장은 지금 체계에 한계가 있다며, 국정홍보가 \"KTV 같은 독립된 단위로 " +
        "있을 게 아니라 전 부처의 정보가 들어오고 이것이 해외까지 나가야 한다\"고 답했다.",
      assertionType: "CLAIM",
      assertedBy: "최민희 국회의원·이창태 KTV 원장",
      sourceIds: ["src-mediatoday-control-tower-20261014"],
      verified: true,
    },
    {
      id: "claim-audit-counter",
      text:
        "같은 자리에서 김효재 한국언론진흥재단 이사장(이명박 정부 청와대 정무수석 출신)은 국정홍보처가 군사정권 " +
        "시절부터 이어진 기능이라 낡았다는 인식이 있었다며, 다시 필요하다면 여야가 합의해 법으로 만들어야 한다고 " +
        "말했다.",
      assertionType: "CLAIM",
      assertedBy: "김효재 한국언론진흥재단 이사장",
      sourceIds: ["src-mediatoday-control-tower-20261014"],
      verified: true,
    },
    {
      id: "claim-ktv-open",
      text:
        "대통령실은 2025년 7월 9일 KTV 영상이 저작권법 제24조의2에 따라 누구나 쓸 수 있는 공공저작물이라며 " +
        "모든 언론과 시민에게 차별 없이 개방한다고 밝혔다. KTV는 9월 8일 '나누리 포털'을 열어 공공누리 " +
        "제1유형(출처 표시, 상업적 이용·2차 저작물 작성 가능)으로 영상 클립을 내놓기 시작했다.",
      assertionType: "FACT",
      sourceIds: ["src-tongilnews-ktv-20250709", "src-ktv-nanuri-20250908"],
      verified: true,
    },
    {
      id: "claim-ad-disclosure",
      text:
        "문화체육관광부는 2026년 1월 30일부터 정부광고 통합지원시스템(GOAD)에 기관별·월별 정부광고 집행 내역을 " +
        "매달 공개한다. 그전에는 매년 6월에 직전 해 내역을 공개했다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-goad-20260127"],
      verified: true,
    },
    {
      id: "claim-sunim",
      text:
        "이규연 청와대 홍보소통수석은 2026년 1월 인터뷰에서 정부부처 광고의 디지털 비중이 출범 당시 30% 수준에서 " +
        "2025년 12월 52%로 올랐다고 했다. 광고 집행 가이드라인은 청와대가 아니라 각 부처가 만들어야 한다고도 했다.",
      assertionType: "CLAIM",
      assertedBy: "이규연 청와대 홍보소통수석",
      sourceIds: ["src-mediatoday-lee-20260123"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-ktv-open",
      date: "2025-07-09",
      datePrecision: "day",
      title: "KTV 영상 저작물 전면 개방 발표",
      summary: "대통령실이 KTV 영상을 누구나 쓸 수 있는 공공저작물이라고 밝혔다.",
      claimIds: ["claim-ktv-open"],
    },
    {
      id: "t-nanuri",
      date: "2025-09-08",
      datePrecision: "day",
      title: "KTV 나누리 포털 개방",
      summary: "공공누리 제1유형으로 영상 클립을 내놓기 시작했다.",
      claimIds: ["claim-ktv-open"],
    },
    {
      id: "t-goad",
      date: "2026-01-30",
      datePrecision: "day",
      title: "정부광고 집행 내역 월별 공개 시작",
      summary: "GOAD 누리집에서 로그인 없이 볼 수 있다.",
      claimIds: ["claim-ad-disclosure"],
    },
    {
      id: "t-audit",
      date: "2026-10-14",
      datePrecision: "day",
      title: "국정감사에서 국정홍보 컨트롤타워 논의",
      summary: "여당 의원 질의와 KTV 원장 답변이 있었다. 정부 추진 계획은 아니다.",
      claimIds: ["claim-audit", "claim-audit-counter"],
    },
  ],
  critiqueIds: ["claim-audit", "claim-audit-counter"],
  gaps: [
    "대통령이나 정부가 국정홍보 전담 조직 신설을 추진한다고 밝힌 자료는 찾지 못했다.",
    "정부가 허위 정보에 어떻게 대응하는지(부처별 사실 확인·해명 체계)는 이 페이지에서 확인하지 못했다.",
    "현행 정부조직법·직제의 국정홍보 조문 원문은 확인하지 못했다. 소관은 언론 보도 기준이다.",
  ],
  sources: [
    {
      id: "src-mediatoday-control-tower-20261014",
      title: "최민희 \"이명박 정부 국정홍보처 없앴는데, 국정홍보 컨트롤타워 필요\"",
      publisher: "미디어오늘",
      url: "https://www.mediatoday.co.kr/news/articleView.html?idxno=337743",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-tongilnews-ktv-20250709",
      title: "대통령실 \"KTV 영상, 모든 국민·매체가 활용 보장\"",
      publisher: "통일뉴스",
      url: "https://www.tongilnews.com/news/articleView.html?idxno=213940",
      publishedAt: "2025-07-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ktv-nanuri-20250908",
      title: "KTV 공공저작물 <나누리 포털> 본격 개방",
      publisher: "KTV 국민방송",
      url: "https://www.ktv.go.kr/ktvnews/press/view?board_num=201414",
      publishedAt: "2025-09-08",
      type: "official",
      license: "public",
    },
    {
      id: "src-heraldk-goad-20260127",
      title: "정부 광고 집행 내역 매달 공개…투명성 강화",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026012715000011813",
      publishedAt: "2026-01-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mediatoday-lee-20260123",
      title: "[단독 인터뷰] 이규연 홍보소통수석 \"언론재단, 정부광고 현황 매달 공개해야\"",
      publisher: "미디어오늘",
      url: "https://www.mediatoday.co.kr/news/articleView.html?idxno=331758",
      publishedAt: "2026-01-23",
      type: "interview",
      license: "link-only",
    },
  ],
};
