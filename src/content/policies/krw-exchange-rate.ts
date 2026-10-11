import type { PolicyInput } from "./schema";

/**
 * 원·달러 환율 흐름과 재정정책.
 *
 * "정부의 확장재정으로 원화 가치가 폭락했다"는 글이 돈다. 원화가 2026년 상반기에 크게
 * 약해진 것은 사실이다(6월 장중 1,561.5원, 금융위기 이후 최고). 그러나 당시 보도와
 * 연구기관 분석이 꼽은 원인은 중동 전쟁, 외국인 주식 매도, 달러 강세, 국민연금·개인의
 * 해외투자였고, 확장재정을 원인으로 든 공식 분석은 찾지 못했다. 환율은 10월 초
 * 1,330원대로 내려왔다.
 *
 * ★ 확장재정이 환율에 아무 영향이 없다고 쓰지 않는다. 영향을 따로 떼어 잰 자료가 없다고 쓴다.
 * ★ 환율은 매일 바뀐다. 숫자마다 날짜를 붙인다.
 * ★ 2026-10-11 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #11.
 */
export const KRW_EXCHANGE_RATE: PolicyInput = {
  slug: "krw-exchange-rate",
  title: "원·달러 환율 흐름과 재정정책",
  scope: "2026년 원·달러 환율의 고점과 이후 흐름, 보도·연구기관이 든 원인, 재정정책과의 관계에 대한 확인 범위",
  ministries: ["재정경제부", "한국은행"],
  categories: ["economy"],
  asOf: "2026-10-11",
  rumors: [
    {
      id: "rumor-fiscal-crash",
      text: "정부의 확장재정정책으로 원화 가치가 폭락했다",
      claimIds: ["claim-june-high", "claim-june-causes", "claim-kif-analysis", "claim-october-level", "claim-no-fiscal-analysis"],
    },
  ],
  claims: [
    {
      id: "claim-june-high",
      text:
        "원·달러 환율은 2026년 6월 6일 야간거래에서 장중 1,561.5원까지 올랐다. 2009년 3월 " +
        "금융위기 이후 17년 3개월 만의 최고 수준이었다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20260606"],
      verified: true,
    },
    {
      id: "claim-june-causes",
      text:
        "당시 보도는 외국인 주식 매도와 중동 전쟁 장기화로 원화 약세 압력이 커진 데다, 미국 " +
        "고용지표 호조로 달러 강세(달러인덱스 100 돌파)가 겹친 것을 원인으로 들었다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-fnnews-20260606"],
      verified: true,
    },
    {
      id: "claim-kif-analysis",
      text:
        "한국금융연구원은 2026년 2월 분석에서 국민연금과 개인 등 거주자의 해외투자 확대가 외환시장 " +
        "수급 불균형을 일으켜 환율 급등에 기여했다고 판단했다. 금리차보다 추가 절하 기대가 해외투자를 " +
        "키웠다고 봤다. 이 분석은 재정정책을 원인으로 다루지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "한국금융연구원",
      sourceIds: ["src-kif-20260206"],
      verified: true,
    },
    {
      id: "claim-october-level",
      text:
        "환율은 하반기에 내려와 2026년 10월 8일 서울 외환시장 주간거래에서 1,338.5원에 마감했다. " +
        "6월 고점보다 200원 넘게 낮다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20261008", "src-fnnews-20260606"],
      verified: true,
    },
    {
      id: "claim-no-fiscal-analysis",
      text:
        "확장재정이 2026년 원화 약세에 얼마나 기여했는지 따로 떼어 잰 정부·한국은행·연구기관의 " +
        "분석은 찾지 못했다. 같은 시기 정부는 큰 폭의 적자 재정을 편성했지만(2026년 관리재정수지 " +
        "적자 GDP 대비 약 4%), 그것이 환율 급등의 원인이라는 근거는 확인되지 않는다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-kif-20260206", "src-fnnews-20260606", "src-korea-budget-2026-fx"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-no-fiscal-analysis"],
  timeline: [
    {
      id: "t-kif",
      date: "2026-02-06",
      datePrecision: "day",
      title: "금융연구원 환율 분석",
      summary: "거주자 해외투자를 주요인으로.",
      claimIds: ["claim-kif-analysis"],
    },
    {
      id: "t-high",
      date: "2026-06-06",
      datePrecision: "day",
      title: "장중 1,561.5원",
      summary: "금융위기 이후 최고.",
      claimIds: ["claim-june-high", "claim-june-causes"],
    },
    {
      id: "t-october",
      date: "2026-10-08",
      datePrecision: "day",
      title: "1,338.5원 마감",
      summary: "고점 대비 200원 넘게 하락.",
      claimIds: ["claim-october-level"],
    },
  ],
  gaps: [
    "한국은행 경제통계시스템(ECOS)의 공식 일별 환율로 대조하지 못했다. 수치는 보도로 확인했다.",
    "확장재정·금리 인하에 따른 유동성 증가가 원화 약세에 영향을 줬다는 분석이 일부 정리 글에 있으나, 출처가 확인되는 연구를 찾지 못해 싣지 않았다.",
    "같은 기간 다른 나라 통화와 비교한 원화의 상대적 약세 정도는 확인하지 못했다.",
    "게시물이 '폭락'이라 한 시점이 언제인지 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-fnnews-20260606",
      title: "환율, 강달러에 한때 1,560원도 넘었다…금융위기 이후 최고(종합)",
      publisher: "파이낸셜뉴스(연합뉴스)",
      url: "https://www.fnnews.com/news/202606060228502526",
      publishedAt: "2026-06-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kif-20260206",
      title: "최근 원/달러 환율 상승의 배경과 시사점",
      publisher: "한국금융연구원 · KDI 경제정보센터",
      url: "https://eiec.kdi.re.kr/policy/domesticView.do?ac=0000202640",
      publishedAt: "2026-02-06",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-mt-20261008",
      title: "원/달러 환율, 1.9원 내린 1338.5원 마감",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/economy/2026/10/08/2026100815360412966",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-budget-2026-fx",
      title: "2026년 예산안, 혁신과 포용의 재정",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148949045",
      publishedAt: "2025-09-12",
      type: "official",
      license: "public",
    },
  ],
};
