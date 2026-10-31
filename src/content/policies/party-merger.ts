import type { PolicyInput } from "./schema";

/**
 * 더불어민주당·조국혁신당 합당 논의 경과.
 *
 * 10월 말 X 게시물 답글에 "합당 논란에 대해 대통령이 당원이 판단할 일이라고 선을 그어야 지지자
 * 혼란이 멈춘다"는 말이 달렸다(잼통 Voice). 합당 논의의 경과와 절차를 적는다.
 *
 * ★ 합당은 정당의 일이다. 정부 정책이 아니지만 답글이 묻는 사실관계를 정리한다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #128.
 */
export const PARTY_MERGER: PolicyInput = {
  slug: "party-merger",
  title: "더불어민주당·조국혁신당 합당 논의 경과",
  scope: "2026년 1월 정청래 당시 대표의 합당 제안, 2월 지방선거 전 논의 중단, 양당의 합당 절차(당원 투표), 10월 말 합당론 재부상",
  ministries: [],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-president-line",
      text: "민주당 합당 논란에 대해 대통령이 당원이 판단할 일이라고 분명히 선을 그어야 지지자 혼란이 멈춘다",
      claimIds: ["claim-proposal", "claim-halt", "claim-procedure", "claim-october"],
    },
  ],
  claims: [
    {
      id: "claim-proposal",
      text:
        "정청래 당시 민주당 대표는 2026년 1월 22일 6·3 지방선거를 함께 치르자며 조국혁신당에 합당을 제안했다. 조국 대표는 국민과 " +
        "당원의 목소리를 듣고 결정하겠다고 답했다. 민주당 안에서는 최고위원들에게 미리 알리지 않은 채 제안이 나왔다는 비판이 컸다.",
      assertionType: "FACT",
      sourceIds: ["src-imbc-20260122", "src-khan-20260122"],
      verified: true,
    },
    {
      id: "claim-halt",
      text:
        "정청래 대표는 2월 10일 의원총회 결과를 반영해 지방선거 전 합당 논의를 중단한다고 발표했다. 제안 19일 만이다. 대신 선거 뒤 " +
        "통합을 추진할 통합추진준비위원회를 꾸리고 혁신당에도 구성을 제안했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260210"],
      verified: true,
    },
    {
      id: "claim-procedure",
      text:
        "민주당 당헌·당규상 합당에는 전당대회나 중앙위원회 결의가 필요하고, 혁신당 당규에는 전 당원 투표 규정이 있다. 어느 한쪽 " +
        "당원 투표에서 부결되면 합당할 수 없다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260122"],
      verified: true,
    },
    {
      id: "claim-october",
      text:
        "대통령은 10월 28일 민주당 5선 이상 중진 의원들과의 만찬에서 조국혁신당과 합당하자는 의견에 긍정적으로 반응하고 개혁·민생·통합에 힘을 " +
        "보태 달라고 당부했다고 보도됐다. 신장식 혁신당 대표는 30일 합당의 '구명함'이 될 용의가 있다면서도 김민석 체제의 국면 전환 소재가 되는 " +
        "것은 거부하고, 민주당 일부 의원의 사과가 먼저라고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-6336993", "src-news1-6337908"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-proposal",
      date: "2026-01-22",
      datePrecision: "day",
      title: "합당 제안",
      summary: "정청래 대표.",
      claimIds: ["claim-proposal"],
    },
    {
      id: "t-halt",
      date: "2026-02-10",
      datePrecision: "day",
      title: "지방선거 전 논의 중단",
      summary: "통합추진준비위 제안.",
      claimIds: ["claim-halt"],
    },
    {
      id: "t-dinner",
      date: "2026-10-28",
      datePrecision: "day",
      title: "대통령·중진 만찬",
      summary: "합당 의견에 긍정 반응 보도.",
      claimIds: ["claim-october"],
    },
  ],
  gaps: [
    "2월에 합의한 통합추진준비위원회가 지방선거 뒤 실제로 가동됐는지, 합당 일정과 개헌 연계 논의가 있는지는 공식 발표로 확인하지 못했다.",
    "대통령의 만찬 발언은 참석자 전언 보도이며 청와대의 공식 설명은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-imbc-20260122",
      title: "민주당, 조국혁신당에 '합당' 제안‥\"6·3 지선 같이 치르면 좋겠다\"",
      publisher: "MBC",
      url: "https://imnews.imbc.com/news/2026/politics/article/6795427_36911.html",
      publishedAt: "2026-01-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260122",
      title: "지방선거 전 조국혁신당과 합당…전략적 승부수 띄웠지만 민주당 내 이견·당원 반응 변수",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202601221835001",
      publishedAt: "2026-01-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260210",
      title: "민주당, '지방선거 전 합당 논의 중단…혁신당에 통합추진위 구성 제안'",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202602101806001/",
      publishedAt: "2026-02-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-6336993",
      title: "李대통령, 與 중진 의원 만찬서 '조국혁신당과 합당' 의견에 긍정 반응",
      publisher: "뉴스1",
      url: "https://www.news1.kr/politics/assembly/6336993",
      publishedAt: "2026-10-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-6337908",
      title: "신장식, 민주-혁신 합당론에 \"구명함 될 용의\"…與 국면 전환용엔 선 긋기",
      publisher: "뉴스1",
      url: "https://news1.kr/politics/assembly/6337908",
      publishedAt: "2026-10-30",
      type: "press",
      license: "link-only",
    },
  ],
};
