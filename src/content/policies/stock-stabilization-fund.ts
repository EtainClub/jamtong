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
 * ★ 2026-10-31 보충 — 잼통 Voice 이슈 #196(코스닥 대책).
 * ★ 2026-11-28 보충 — 잼통 Voice 이슈 #313(11월 재급락과 정부 대응).
 */
export const STOCK_STABILIZATION_FUND: PolicyInput = {
  slug: "stock-stabilization-fund",
  title: "2026년 10~11월 증시 급락과 증권시장안정펀드",
  scope:
    "2026년 10월 코스피 급락과 서킷브레이커, 금융당국 긴급 점검, 증안펀드의 구조·과거 가동 사례·2026년 검토 상황과 비판, 11월 재급락 뒤 긴급 시장상황점검회의·자사주 매수 한도 완화·대통령 지시",
  ministries: ["금융위원회", "재정경제부"],
  categories: ["economy"],
  asOf: "2026-11-28",
  rumors: [
    {
      id: "rumor-fund",
      text: "증시가 이렇게 흔들릴 때 증권시장안정기금을 투입해야 한다",
      claimIds: ["claim-drop", "claim-fsc", "claim-ready", "claim-president", "claim-structure", "claim-history", "claim-not-yet"],
    },
    {
      id: "rumor-kosdaq",
      text: "코스닥 지수 흐름은 어떤가, 정부의 코스닥 대책은 무엇인가",
      claimIds: ["claim-kosdaq-benchmark"],
    },
    {
      id: "rumor-no-action",
      text: "주가 폭락으로 가계 자산이 무너지는데 대통령은 증시 대책 없이 부동산 홍보와 시장 방문만 한다",
      claimIds: ["claim-nov-drop", "claim-nov-f4", "claim-nov-buyback", "claim-nov-president", "claim-nov-not-yet"],
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
    {
      id: "claim-kosdaq-benchmark",
      text:
        "정부는 2026년 1월 연기금 운용평가의 국내주식 기준수익률에 코스피만 쓰던 것을 바꿔 코스닥 지수를 5% 반영하고, 벤처 등 혁신성장 투자 " +
        "가점을 1점에서 2점으로 올렸다. 당시 연기금의 코스닥 보유액은 약 5조 8천억 원(국내주식의 3.7%)이었다. 정부는 수익률에 도움이 안 되는 " +
        "투자를 강제할 수는 없다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20260129-kosdaq"],
      verified: true,
    },
    {
      id: "claim-nov-drop",
      text:
        "11월에도 급락이 이어졌다. 11월 6일 코스피는 8.52% 내린 4,924.61까지 밀려 서킷브레이커가 발동됐고, 정부는 같은 날 긴급 시장상황점검회의를 열었다. " +
        "11월 23일에는 4,708.54로 마감해 1월 13일 이후 가장 낮은 종가를 기록했다. 24일 6.32% 올라 5,006.03으로 5,000선을 되찾았지만, " +
        "25일 장 초반 다시 5% 넘게 떨어져 매도 사이드카가 발동됐다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-20261106", "src-fnnews-20261125", "src-hankooki-20261125"],
      verified: true,
    },
    {
      id: "claim-nov-f4",
      text:
        "이형일 부총리 겸 재정경제부 장관은 11월 22일 한국은행 총재, 금융위원장, 금융감독원장과 긴급 시장상황점검회의를 열고, " +
        "필요하면 증권시장안정펀드를 바로 가동할 수 있도록 준비에 들어가기로 했다. 기존 출자 약정 규모는 10조 7,600억 원이며, " +
        "가동 시점과 매입 규모는 정하지 않았다. 증안펀드는 캐피털콜(출자 요청) 방식이라 완전히 준비되기까지 길게는 한 달이 걸릴 수 있다고 정부 관계자는 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261125", "src-hankooki-20261125"],
      verified: true,
    },
    {
      id: "claim-nov-buyback",
      text:
        "금융위원회는 11월 24일부터 3개월 동안 상장사의 하루 자사주 매수 주문 수량 한도를 완화했다. " +
        "금융감독원과 한국거래소는 불법 공매도 특별 집중감시에 들어갔다.",
      assertionType: "FACT",
      sourceIds: ["src-hankooki-20261125"],
      verified: true,
    },
    {
      id: "claim-nov-president",
      text:
        "이재명 대통령은 11월 24일 국무회의에서 \"주가가 어제 떨어졌다 오늘 폭등하고 널뛰기하는데, 대응 대책이 좀 필요하기는 하다\"며 " +
        "이억원 금융위원장에게 대책 마련을 지시했다. 이 위원장은 \"단기·중기·장기로 나눠 준비하고 있다\"며 비상대응계획이 마련돼 있다고 답했다. " +
        "보도는 대통령이 그동안 주가 언급을 자제해 온 데서 대응 쪽으로 기조를 바꾼 것으로 해석했다. 청와대 대변인은 11월 23일 최근 불안이 " +
        "\"미국 증시와 같이 연동된 측면이 있다\"고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령·이억원 금융위원장·청와대",
      sourceIds: ["src-fnnews-20261125", "src-hankooki-20261125"],
      verified: true,
    },
    {
      id: "claim-nov-not-yet",
      text:
        "11월 25일 보도 기준으로 증안펀드의 실제 주식 매입은 시작되지 않았다. 정부 대응은 가동 준비, 자사주 매수 한도 완화, 공매도 감시까지다.",
      assertionType: "FACT",
      sourceIds: ["src-hankooki-20261125", "src-fnnews-20261125"],
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
    {
      id: "t-nov6",
      date: "2026-11-06",
      datePrecision: "day",
      title: "코스피 8.52% 급락, 긴급 점검회의",
      summary: "서킷브레이커 발동.",
      claimIds: ["claim-nov-drop"],
    },
    {
      id: "t-nov22",
      date: "2026-11-22",
      datePrecision: "day",
      title: "긴급 시장상황점검회의, 증안펀드 가동 준비",
      summary: "기존 약정 10조 7,600억 원.",
      claimIds: ["claim-nov-f4"],
    },
    {
      id: "t-nov24",
      date: "2026-11-24",
      datePrecision: "day",
      title: "자사주 매수 한도 완화, 대통령 대책 지시",
      summary: "국무회의에서 금융위원장에게 지시.",
      claimIds: ["claim-nov-buyback", "claim-nov-president"],
    },
  ],
  gaps: [
    "11월 22일 가동 준비 결정 뒤에도 증안펀드의 실제 매입 시점·규모·가동 조건은 발표되지 않았다(11월 25일 보도 기준).",
    "11월 22일 회의와 11월 23일 자사주 매수 한도 완화의 정부 보도자료 원문은 대조하지 못했다. 보도로 확인했다.",
    "11월 증시 하락이 가계 금융자산에 준 영향을 정부가 집계해 발표한 자료는 찾지 못했다.",
    "금융위원회 공식 보도자료 원문은 대조하지 못했다. 발언은 보도로 확인했다.",
    "2026년 10월 코스닥 지수의 월간 흐름과 코스닥 대책의 효과는 공식 자료로 정리하지 못했다.",
  ],
  sources: [
    {
      id: "src-news1-20261106",
      title: "정부, 증시 급락에 긴급시장상황점검회의…금융·통화당국 소집",
      publisher: "뉴스1",
      url: "https://www.news1.kr/economy/trend/6345258",
      publishedAt: "2026-11-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261125",
      title: "롤러코스터 장세에 靑·정부 움직인다…관망서 '적극 대응' 기조 전환",
      publisher: "파이낸셜뉴스(뉴스1)",
      url: "https://www.fnnews.com/news/202611250505559744",
      publishedAt: "2026-11-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankooki-20261125",
      title: "李 \"주가 널뛰기\" 직접 점검…코스피 또 급락에 靑·정부 대응 시험대",
      publisher: "데일리한국",
      url: "https://daily.hankooki.com/news/articleView.html?idxno=1428776",
      publishedAt: "2026-11-25",
      type: "press",
      license: "link-only",
    },
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
    {
      id: "src-mtn-20260129-kosdaq",
      title: "기금 여유자금도 벤처·코스닥에…3000스닥 도달 사활",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026012812510777139",
      publishedAt: "2026-01-29",
      type: "press",
      license: "link-only",
    },
  ],
};
