import type { PolicyInput } from "./schema";

/**
 * 잠재성장률 반등 전망(2026년 10월)의 근거와 의미.
 *
 * 대통령이 10월 20일 「한국 경제 기초체력의 극적인 반전, 40여년 만의 일입니다」라는 X 글을
 * 올리자 "반도체 호황 덕을 자기 성과로 내세운다", "IMF가 직접 낸 수치도 아니고 OECD는
 * 반대다"는 답글이 달렸다(잼통 Voice). 수치가 어디서 나왔는지, 다른 기관의 추정은 어떤지,
 * 전문가들이 무엇을 조심하라고 했는지 적는다.
 *
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #82.
 */
export const POTENTIAL_GROWTH_2026: PolicyInput = {
  slug: "potential-growth-2026",
  title: "잠재성장률 반등 전망(2026년 10월)의 근거와 의미",
  scope:
    "IMF 10월 세계경제전망에서 역산한 한국 잠재성장률 1.94→2.14→2.20%의 산출 방식, OECD·국회예산정책처 추정과의 차이, 반등 요인과 전문가 신중론, 대통령 글이 인용한 범위",
  ministries: ["재정경제부"],
  categories: ["economy"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-credit",
      text: "반등은 반도체 호황과 기업들이 만든 것인데 대통령이 자기 성과처럼 내세운다",
      claimIds: ["claim-drivers", "claim-post", "claim-caution"],
    },
    {
      id: "rumor-exaggerated",
      text: "'40년 만의 반전'은 과장이다: 전망치일 뿐이고 IMF가 직접 낸 수치도 아니며 OECD 전망은 반대다",
      claimIds: ["claim-numbers", "claim-method", "claim-oecd", "claim-nabo"],
    },
    {
      id: "rumor-cherry",
      text: "입맛에 맞는 언론 보도와 전망만 골라 인용해 정부 성과로 내세운다",
      claimIds: ["claim-post", "claim-oecd"],
    },
    {
      id: "rumor-macro",
      text: "고유가·고금리·고달러가 예상되는데 잠재성장률이 반등한다는 전망은 믿기 어렵다",
      claimIds: ["claim-method", "claim-caution"],
    },
  ],
  claims: [
    {
      id: "claim-numbers",
      text:
        "연합뉴스와 SBS Biz는 IMF의 2026년 10월 세계경제전망을 분석해 한국 잠재성장률이 2025년 1.94%에서 2026년 " +
        "2.14%, 2027년 2.20%로 2년 연속 오를 것으로 추산했다. 2년 연속 상승은 '3저 호황' 때인 1986~1987년 이후 " +
        "약 40년 만이라고 보도했다. 모두 전망치다.",
      assertionType: "FACT",
      sourceIds: ["src-yonhap-20261018", "src-sbsbiz-20261018"],
      verified: true,
    },
    {
      id: "claim-method",
      text:
        "IMF가 잠재성장률을 직접 발표한 것은 아니다. IMF가 제시한 한국의 실질 GDP 성장률 전망(2026년 3.33%, 2027년 " +
        "2.83%)과 GDP갭률 전망(2026년 0.548%, 2027년 1.168%)으로 언론이 역산한 값이다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20261018"],
      verified: true,
    },
    {
      id: "claim-oecd",
      text:
        "OECD는 2026년 6월 한국 잠재성장률을 2025년 1.85%, 2026년 1.66%, 2027년 1.52%로 추정해 계속 낮아지는 쪽으로 " +
        "보았다. 2027년 값은 역대 최저 수준이다. IMF 수치보다 4개월 앞선 추정이다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260606", "src-sbsbiz-20261018"],
      verified: true,
    },
    {
      id: "claim-nabo",
      text:
        "국회예산정책처는 2027년 경제전망에서 잠재성장률을 2025년 2.14%, 2026년 2.22%, 2027년 2.28%로 전망해 " +
        "오르는 쪽으로 보았다. 기관마다 추정 방법과 시점이 달라 수치를 그대로 견주기는 어렵다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20261018"],
      verified: true,
    },
    {
      id: "claim-drivers",
      text:
        "연합뉴스는 반등 요인으로 반도체 호황에 따른 투자 증가, AI 투자 확대와 AI 확산에 따른 생산성 개선을 꼽았다. " +
        "고령화로 노동 공급을 늘리기 어려워 자본과 총요소생산성이 반등을 이끈다는 분석이다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-yonhap-20261018"],
      verified: true,
    },
    {
      id: "claim-post",
      text:
        "대통령은 10월 20일 X 글에서 \"주요 언론들에 따르면, 국제통화기금(IMF)은 우리나라 잠재성장률이 올해에 이어 " +
        "내년까지 2년 연속 반등할 것이라고 전망했습니다\"라고 썼다. 반등 요인이 정부 정책이라고 적지는 않았고, " +
        "결실이 골고루 나눠지도록 '3대 메가프로젝트' 등에 역량을 집중하겠다고 했다. OECD 추정은 언급하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-x-20261020"],
      verified: true,
    },
    {
      id: "claim-caution",
      text:
        "전문가들은 신중론을 냈다. 김광석 한국경제산업연구원 실장은 호황 혜택이 일부 기업에 몰려 체감경기와 격차가 " +
        "커질 수 있다며 반도체·AI를 뺀 지표도 함께 내야 한다고 했다. 허준영 서강대 교수는 반도체 호황에 맞춘 기계적 " +
        "조정에 가깝다고 했고, 강성진 고려대 교수는 수출 호조가 국내 경제 호조로 보이는 '착시'라고 경고했다.",
      assertionType: "OPINION",
      sourceIds: ["src-yonhap-20261018"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-oecd", "claim-caution"],
  timeline: [
    {
      id: "t-oecd",
      date: "2026-06",
      datePrecision: "month",
      title: "OECD, 한국 잠재성장률 1.66%(2026) 추정",
      summary: "하락 전망.",
      claimIds: ["claim-oecd"],
    },
    {
      id: "t-imf",
      date: "2026-10-18",
      datePrecision: "day",
      title: "IMF 전망 역산, 2.14%(2026)·2.20%(2027) 보도",
      summary: "40년 만의 2년 연속 상승.",
      claimIds: ["claim-numbers", "claim-method"],
    },
    {
      id: "t-post",
      date: "2026-10-20",
      datePrecision: "day",
      title: "대통령 X 글",
      summary: "보도를 인용해 반등 전망을 알렸다.",
      claimIds: ["claim-post"],
    },
  ],
  gaps: [
    "IMF 세계경제전망 데이터베이스의 GDP갭 수치를 직접 내려받아 역산을 재현하지는 않았다.",
    "한국은행의 최신 잠재성장률 추정치는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-yonhap-20261018",
      title: "한국 잠재성장률 '대반전'…40년 만에 연속 반등 전망",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1426023",
      publishedAt: "2026-10-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20261018",
      title: "내리막 걷던 한국 성장잠재력…40년 만에 반전 신호",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000340571",
      publishedAt: "2026-10-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20260606",
      title: "한국, '기초체력' 잠재성장률 하위권 추락…28→31→32위",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026060614275171616",
      publishedAt: "2026-06-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-x-20261020",
      title: "한국 경제 기초체력의 극적인 반전, 40여년 만의 일입니다",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2112342735281914343",
      publishedAt: "2026-10-20",
      type: "interview",
      license: "quotable",
    },
  ],
};
