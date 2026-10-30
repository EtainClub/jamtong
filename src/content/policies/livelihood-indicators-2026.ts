import type { PolicyInput } from "./schema";

/**
 * 서민 체감 경기 지표와 2026년 초과세수 (2026년 10월 기준).
 *
 * 대통령 X 글 여럿에 "성장률이 좋아졌다지만 서민 삶은 나아진 게 없다", "월급보다 물가가 더
 * 올랐다", "상가 공실이 늘었다", "세수 증가의 혜택이 서민에게 돌아오지 않는다"는 답글이
 * 달렸다(잼통 Voice). 물가·실질임금·상가 공실 같은 체감 지표와, 2026년 늘어난 세수의 규모와
 * 쓰임을 공식 통계와 보도로 적는다.
 *
 * ★ 체감 경기는 하나의 숫자로 판정할 수 없다. 이 페이지는 지표를 나열하고 '나아졌다·
 *   나빠졌다'를 단정하지 않는다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #100.
 */
export const LIVELIHOOD_INDICATORS_2026: PolicyInput = {
  slug: "livelihood-indicators-2026",
  title: "서민 체감 경기 지표와 2026년 초과세수",
  scope:
    "2026년 9월 소비자물가, 2분기 명목·실질임금, 서울 상가 공실률, 2026년 국세수입 재추계(478조 6천억 원)와 초과세수의 배분",
  ministries: ["국가데이터처", "고용노동부", "재정경제부"],
  categories: ["economy", "welfare"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-no-better",
      text: "성장률 지표가 좋아졌다지만 상가 공실과 투자 손실로 서민 삶은 나아진 게 없다",
      claimIds: ["claim-cpi", "claim-real-wage", "claim-vacancy"],
    },
    {
      id: "rumor-wage-price",
      text: "월급보다 물가가 더 올라 먹고살기 바쁜데, SNS에서 칭찬만 오가는 모습은 현실과 동떨어졌다",
      claimIds: ["claim-real-wage", "claim-cpi"],
    },
    {
      id: "rumor-tax",
      text: "성과를 늘어놓지만 서민 살림은 더 어려워졌고, 세수 증가의 혜택도 서민에게 돌아오지 않는다",
      claimIds: ["claim-tax", "claim-tax-split", "claim-tax-use"],
    },
  ],
  claims: [
    {
      id: "claim-cpi",
      text:
        "국가데이터처에 따르면 2026년 9월 소비자물가는 1년 전보다 2.9% 올랐다(8월 3.1%). 자주 사는 품목으로 만든 " +
        "생활물가지수는 2.5%, 식료품·에너지 제외지수는 2.8% 올랐다.",
      assertionType: "FACT",
      sourceIds: ["src-kostat-202609"],
      verified: true,
    },
    {
      id: "claim-real-wage",
      text:
        "고용노동부 사업체노동력조사로 2026년 2분기 상용근로자 1인 이상 사업체의 1인당 월평균 명목임금은 403만 6천 원으로 " +
        "2.1% 늘었지만, 물가(3.0%)를 반영한 실질임금은 337만 원으로 0.8% 줄었다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1683089"],
      verified: true,
    },
    {
      id: "claim-vacancy",
      text:
        "한국부동산원의 2026년 2분기 조사에서 서울 일반 상가 공실률은 13.4%로 전 분기보다 0.3%p 올랐고, 임대가격지수는 " +
        "0.46% 올랐다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20260730"],
      verified: false,
    },
    {
      id: "claim-tax",
      text:
        "재정경제부는 2026년 국세수입을 478조 6천억 원으로 다시 추계했다. 추경 예산(415조 4천억 원)보다 63조 2천억 원 " +
        "많은 역대 최대이고, 반도체 기업 실적 상향으로 법인세가 추경보다 35조 원 많은 136조 4천억 원 걷힐 전망이다.",
      assertionType: "CLAIM",
      assertedBy: "재정경제부",
      sourceIds: ["src-inews24-2010236"],
      verified: true,
    },
    {
      id: "claim-tax-split",
      text:
        "내국세의 약 40%는 지방교부세와 지방교육재정교부금으로 지방에 배분된다. 2026년 내국세가 추경보다 56조 2천억 원 " +
        "많아 단순 계산으로 22조 원 안팎이 교부금으로 정산될 것으로 추산된다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-inews24-2010236"],
      verified: true,
    },
    {
      id: "claim-tax-use",
      text:
        "나머지 초과세수를 국채 상환과 미래대응기금에 어떻게 나눌지가 쟁점이 됐다. 미래대응기금 재원으로 쓸 수 있는 " +
        "초과세수는 약 56조 원으로 추산됐다. 초과세수를 서민 지원에 직접 쓰는 추가경정예산 편성 계획은 10월 30일까지 " +
        "발표되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-1315230", "src-newsis-20260927"],
      verified: false,
    },
    {
      id: "claim-critique",
      text:
        "추경 대비 세수 전망 오차가 15.2%(본예산 대비 22.7%)에 이르러 세수추계의 정확성 문제가 다시 불거졌다.",
      assertionType: "OPINION",
      sourceIds: ["src-inews24-2010236"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-real-wage", "claim-critique"],
  timeline: [
    {
      id: "t-wage",
      date: "2026-08-27",
      datePrecision: "day",
      title: "2분기 실질임금 0.8% 감소 발표",
      summary: "명목 2.1% 증가, 물가 3.0%.",
      claimIds: ["claim-real-wage"],
    },
    {
      id: "t-tax",
      date: "2026-09-30",
      datePrecision: "day",
      title: "국세수입 478조 6천억 원으로 재추계",
      summary: "추경보다 63조 2천억 원 많다.",
      claimIds: ["claim-tax"],
    },
    {
      id: "t-cpi",
      date: "2026-10-02",
      datePrecision: "day",
      title: "9월 소비자물가 2.9%",
      summary: "8월 3.1%에서 둔화.",
      claimIds: ["claim-cpi"],
    },
  ],
  gaps: [
    "3분기 실질임금과 상가 공실률은 아직 발표되지 않았거나 찾지 못했다.",
    "소득 분위별 가처분소득 등 계층별 체감 지표는 이 페이지에서 정리하지 못했다.",
    "초과세수 배분에 대한 정부의 최종 계획은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-kostat-202609",
      title: "2026년 9월 소비자물가동향",
      publisher: "국가데이터처(대한민국 정책브리핑)",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=156784092",
      publishedAt: "2026-10-02",
      type: "statistics",
      license: "public",
    },
    {
      id: "src-dailian-1683089",
      title: "2분기 실질임금 0.8%↓…물가 부담에 근로자 구매력 후퇴",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1683089",
      publishedAt: "2026-08-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20260730",
      title: "임대료 오르고 공실도 증가…전문가들 \"상가 침체 장기화\"",
      publisher: "머니투데이방송",
      url: "https://news.mtn.co.kr/news-detail/2026073016150554199",
      publishedAt: "2026-07-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-inews24-2010236",
      title: "올해 국세 478.6조 '역대 최대'…추경 반년 만에 63조 빗나가",
      publisher: "아이뉴스24",
      url: "https://www.inews24.com/view/2010236",
      publishedAt: "2026-09-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-1315230",
      title: "초과세수 63.2조원 더 걷혔다…내년 미래대응기금 200조원대",
      publisher: "뉴스토마토",
      url: "https://newstomato.com/ReadNews.aspx?no=1315230",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260927",
      title: "올해 초과세수 50조+α 가능성…미래대응기금 200조 넘길수도",
      publisher: "뉴시스",
      url: "https://newsis.com/view/NISX20260927_0003804051",
      publishedAt: "2026-09-27",
      type: "press",
      license: "link-only",
    },
  ],
};
