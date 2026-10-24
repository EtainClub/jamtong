import type { PolicyInput } from "./schema";

/**
 * 2026년 10월 증시 급락과 증권시장안정펀드.
 *
 * 대통령 X 게시물 답글에 "증시가 이렇게 흔들릴 때 증권시장안정기금을 투입해야 한다"는
 * 요청이 달렸다(잼통 Voice). 2026년 10월 증시 급락에 대한 정부 대응과 증안펀드의 성격,
 * 가동 여부, 그에 대한 엇갈린 시각을 적는다.
 *
 * ★ 2026년 10월 24일 현재 증안펀드는 가동되지 않았다. 정부는 "필요하면 할 수 있도록
 *   준비하고 있다"는 데까지만 밝혔다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #76.
 */
export const STOCK_STABILIZATION_FUND: PolicyInput = {
  slug: "stock-stabilization-fund",
  title: "2026년 10월 증시 급락과 증권시장안정펀드",
  scope:
    "2026년 10월 코스피 급락과 서킷브레이커, 금융당국 긴급 점검, 증안펀드의 구조·과거 가동 사례·2026년 검토 상황과 비판",
  ministries: ["금융위원회", "재정경제부"],
  categories: ["economy"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-fund",
      text: "증시가 이렇게 흔들릴 때 증권시장안정기금을 투입해야 한다",
      claimIds: ["claim-drop", "claim-fsc", "claim-ready", "claim-president", "claim-structure", "claim-history", "claim-not-yet"],
    },
  ],
  claims: [
    {
      id: "claim-drop",
      text:
        "코스피는 2026년 6월 22일 종가 9,114.55로 사상 최고치를 찍은 뒤, 10월 15일 5,554.22까지 내려 고점 대비 39.06% " +
        "떨어졌다. 이날 코스피와 코스닥 모두 서킷브레이커가 발동됐다. 글로벌 금리 상승 우려, AI·반도체 투자 수익성 " +
        "논란, 국제유가 상승, 외국인 매도가 배경으로 꼽혔다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261020", "src-hankook-20261015"],
      verified: true,
    },
    {
      id: "claim-fsc",
      text:
        "이억원 금융위원장은 10월 15일 긴급 증시 점검회의를 열고, 하락 속도와 수급 면에서 과도한 반응이며 반도체·방산·" +
        "조선 실적과 외환보유액·경상수지 등 기초여건은 견조하다고 진단했다. \"과도한 부채와 신용에 의존한 투자는 " +
        "위험하다\"며 빚투 자제를 당부하고, 필요하면 바로 시행할 비상 계획을 준비하겠다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "금융위원회",
      sourceIds: ["src-hankook-20261015"],
      verified: true,
    },
    {
      id: "claim-ready",
      text:
        "이형일 부총리 겸 재정경제부 장관은 10월 16일 \"필요하면 우리가 갖고 있는 시장 안정 조치를 할 수 있도록 " +
        "준비하고 있다\"고 말했다. 가동을 확정한 발언은 아니다.",
      assertionType: "CLAIM",
      assertedBy: "이형일 부총리",
      sourceIds: ["src-newspim-20261020", "src-etoday-20261022"],
      verified: true,
    },
    {
      id: "claim-president",
      text:
        "이재명 대통령은 10월 19일 주식시장 정상화를 위해 정책적으로 해야 할 일을 점검하고 있다며 종합 보고를 받고 " +
        "필요한 조치를 하겠다고 했다. 개별 종목 주가를 정부가 직접 떠받치는 방식에는 선을 긋고, 공정하고 투명한 시장을 " +
        "만드는 정책이 중요하다고 했다. 증안펀드를 직접 거론하지는 않았다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-newspim-20261020", "src-investchosun-20261021"],
      verified: true,
    },
    {
      id: "claim-structure",
      text:
        "증권시장안정펀드는 증시가 급락할 때 금융회사와 증권 유관기관이 돈을 모아 주식을 사들이는 장치로, 정부가 재정을 " +
        "직접 넣는 기금이 아니다. 2020년의 '다함께코리아펀드'는 약 10조 7,600억 원으로 당시 시가총액의 0.7% 수준이었다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-20261022"],
      verified: true,
    },
    {
      id: "claim-history",
      text:
        "실제 돈이 들어간 것은 2008년 글로벌 금융위기 때가 마지막이다. 2020년(코로나19)과 2022년(긴축)에는 준비만 하고 " +
        "주식 매입으로 이어지지 않았다. 한국금융연구원 보고서는 1990·2003·2008년 사례에서 일시적 심리 안정에는 " +
        "도움이 됐지만 주가 반등과 유동성 증가로는 이어지지 못했다고 평가했다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-20261022", "src-newspim-20261020"],
      verified: true,
    },
    {
      id: "claim-not-yet",
      text: "2026년 10월 24일 현재 증안펀드는 가동되지 않았고, 정부는 가동 가능성만 열어 둔 상태다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-20261022", "src-investchosun-20261021"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "인베스트조선은 금리·반도체 업황 등 하락 원인이 풀리지 않았다면 금융회사 출자금이 외국인 매도 물량을 받아내는 " +
        "데 쓰일 수 있다며, 금융위기도 아닌데 증안펀드를 꺼내는 것이 '증시의 정치화'라는 우려를 전했다. 다만 정부의 " +
        "모든 시장 안정 조치를 정치적 의도와 연결하는 것은 무리라고 덧붙였다. 하나증권 연구원은 증안펀드가 언급될 때 " +
        "지수가 저점인 경우가 많았다며 정책 신호로서의 효과에 주목했다.",
      assertionType: "OPINION",
      sourceIds: ["src-investchosun-20261021", "src-etoday-20261022"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-peak",
      date: "2026-06-22",
      datePrecision: "day",
      title: "코스피 사상 최고치 9,114.55",
      summary: "종가 기준.",
      claimIds: ["claim-drop"],
    },
    {
      id: "t-crash",
      date: "2026-10-15",
      datePrecision: "day",
      title: "코스피·코스닥 서킷브레이커, 금융위 긴급 점검",
      summary: "고점 대비 39% 하락.",
      claimIds: ["claim-drop", "claim-fsc"],
    },
    {
      id: "t-ready",
      date: "2026-10-16",
      datePrecision: "day",
      title: "부총리 \"시장 안정 조치 준비\"",
      summary: "가동 확정은 아니다.",
      claimIds: ["claim-ready"],
    },
    {
      id: "t-president",
      date: "2026-10-19",
      datePrecision: "day",
      title: "대통령 \"증시 정상화 조치 점검\"",
      summary: "개별 종목 부양에는 선을 그었다.",
      claimIds: ["claim-president"],
    },
  ],
  gaps: [
    "2026년에 증안펀드를 다시 조성한다면 규모·출자기관·가동 조건을 정부가 밝힌 적은 없다.",
    "금융위원회 공식 보도자료 원문은 대조하지 못했다. 발언은 보도로 확인했다.",
  ],
  sources: [
    {
      id: "src-hankook-20261015",
      title: "코스피 폭락에… 금융당국, 긴급 증시 점검회의 개최",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026101516110000918",
      publishedAt: "2026-10-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20261020",
      title: "이재명 대통령 '증시 정상화' 언급…정부, '증안 펀드' 카드 검토",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261020000231",
      publishedAt: "2026-10-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-investchosun-20261021",
      title: "금융위기도 아닌데 증안펀드 꺼내는 정부…'증시의 정치화' 우려",
      publisher: "인베스트조선",
      url: "https://www.investchosun.com/site/data/html_dir/2026/10/21/2026102180125.html",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-20261022",
      title: "코스피 급락에 '증시안정펀드' 논의 수면 위로⋯\"실제 가동보다 정책 신호\"",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2638981",
      publishedAt: "2026-10-22",
      type: "press",
      license: "link-only",
    },
  ],
};
