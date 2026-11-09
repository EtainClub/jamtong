import type { PolicyInput } from "./schema";

/**
 * 기본주택 공약에서 '보편형 공공임대'로: 2026년 8·13 대책과 2027년 예산안.
 *
 * 대통령 X 게시물 답글에 "집값 논쟁보다 공약했던 기본주택부터 빨리 추진하라"(이슈 #242), 유튜브 영상 답글에
 * "서울·세종에 평범한 직장인도 살 수 있는 임대주택을 수만 가구 공급하자"(이슈 #229)는 제안이 달렸다(잼통 Voice).
 * 기본주택이 이 정부에서 어떤 이름과 규모로 추진되는지, 무엇이 아직 안 됐는지 적는다.
 *
 * ★ 행정기관 세종 이전은 policy:administrative-capital, 대선 공약과 현재 정책 비교는 policy:housing-pledge-vs-policy에 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #242, #229.
 */
export const UNIVERSAL_PUBLIC_RENTAL: PolicyInput = {
  slug: "universal-public-rental",
  title: "기본주택에서 '보편형 공공임대'로 (2026~2027)",
  scope:
    "경기지사 시절 기본주택의 실적, 2026년 8·13 주택공급대책의 보편형 공공임대 신설, 2027년 예산안의 물량·예산, 공공주택특별법 개정 지연",
  ministries: ["국토교통부", "한국토지주택공사"],
  categories: ["welfare", "region"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-basic-housing",
      text: "집값 논쟁보다 공약했던 기본주택부터 빨리 추진하라",
      claimIds: ["claim-gyeonggi", "claim-universal", "claim-budget", "claim-law"],
    },
    {
      id: "rumor-rental-scale",
      text: "국가기관을 세종으로 옮기고 서울·세종에 평범한 직장인도 살 수 있는 임대주택을 수만 가구 공급하자",
      claimIds: ["claim-universal", "claim-budget"],
    },
  ],
  claims: [
    {
      id: "claim-gyeonggi",
      text:
        "기본주택은 경기지사 시절 무주택자 누구나 입주하는 장기 공공임대로 내세운 정책이지만 한 가구도 공급되지 못했다. 경기도는 2021년 구리시 교문동 1,280가구 1호 사업을 추진했으나 착공에 이르지 못했고, " +
        "2023년 경기주택도시공사(GH)는 현행법상 기본주택을 계속 추진하기 어렵다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2621049"],
      verified: true,
    },
    {
      id: "claim-universal",
      text:
        "정부는 2026년 8·13 주택공급대책에서 소득·자산 기준을 완화해 일반 무주택자와 중산층도 입주할 수 있는 '보편형 공공임대'를 신설한다고 밝혔다. 기본 거주 기간은 6년이고, 출산할 때마다 늘어나 미성년 자녀가 셋 이상이면 최대 20년까지 살 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2621049", "src-dailian-1678164"],
      verified: true,
    },
    {
      id: "claim-budget",
      text:
        "2027년 예산안에는 보편형 공공임대에 약 6조 2,000억 원(건설형 출·융자 4조 7,719억 원, 다가구 매입임대 5,440억 원, 전세임대 9,000억 원)이 담겼다. 공급 물량은 3만 6,000가구로, " +
        "LH 택지에 짓는 건설형 2만 6,000가구, 매입형·전세형 각 5,000가구다. 약 2만 가구는 신혼부부 등 무주택 청년에게 우선 배정한다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2621049"],
      verified: true,
    },
    {
      id: "claim-law",
      text:
        "무주택자 누구나 입주하는 새 공공임대 유형을 만들기 위한 공공주택특별법 개정안은 9월 초까지 국회를 통과하지 못했고, 재원 조달 방안도 확정되지 않았다. 임대료를 시세보다 얼마나 낮출지가 관건이라는 지적이 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2621049"],
      verified: true,
    },
    {
      id: "claim-minister",
      text: "경기도 기본주택 실무를 총괄했던 홍지선 국토교통부 차관이 2026년 8월 말 국토부 장관 후보자로 지명돼, 보편형 임대의 추진 속도가 빨라질 것이라는 전망이 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20260830", "src-newspim-20260923"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-gyeonggi", "claim-law"],
  timeline: [
    {
      id: "t-813",
      date: "2026-08-13",
      datePrecision: "day",
      title: "8·13 대책, 보편형 공공임대 신설",
      summary: "기본 거주 6년.",
      claimIds: ["claim-universal"],
    },
    {
      id: "t-budget",
      date: "2026-09-02",
      datePrecision: "day",
      title: "2027년 예산안 6.2조 원·3만 6천 가구",
      summary: "건설형 2만 6천.",
      claimIds: ["claim-budget"],
    },
  ],
  gaps: [
    "보편형 공공임대의 임대료 수준(시세 대비 비율)은 아직 발표되지 않았다.",
    "공공주택특별법 개정안의 11월 현재 국회 처리 상황과 서울·세종에 배정될 물량은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-etoday-2621049",
      title: "이름 바꿔 돌아온 '기본주택'⋯6.2조 보편임대로 부활",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2621049",
      publishedAt: "2026-09-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1678164",
      title: "\"'이재명 정부 집 못지어 미쳤나' 생각 들게 영끌\"…수도권에 150만가구 [8·13 부동산대책-Q&A]",
      publisher: "데일리안",
      url: "https://m.dailian.co.kr/news/view/1678164/",
      publishedAt: "2026-08-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20260830",
      title: "경기도 기본주택 참여 '현장형 관료'... 주택공급 '빠른 실행'에 무게 실릴듯[李정부 중폭 개각]",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202608301826243413",
      publishedAt: "2026-08-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20260923",
      title: "보편형 임대주택으로 돌아온 '기본주택'…홍지선號서 속도 내나",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260923001032",
      publishedAt: "2026-09-23",
      type: "press",
      license: "link-only",
    },
  ],
};
