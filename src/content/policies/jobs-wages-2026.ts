import type { PolicyInput } from "./schema";

/**
 * 2026년 9월 고용동향과 청년 고용.
 *
 * 10월 X 게시물 답글에 "전 정부보다 일자리와 임금이 줄었는데 자화자찬보다 AI로 줄어드는 일자리
 * 대책을 내놓아야 한다"는 말이 달렸다(잼통 Voice). 가장 최근 고용 통계를 적는다.
 *
 * ★ 실질임금 추이는 policy:livelihood-indicators-2026에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #138.
 */
export const JOBS_WAGES_2026: PolicyInput = {
  slug: "jobs-wages-2026",
  title: "2026년 9월 고용동향과 AI 일자리 대응 계획",
  scope: "국가데이터처 2026년 9월 고용동향의 취업자·고용률·실업률, 청년층 취업자 감소, 산업별 증감, 2026년 7월 산업전환 고용안정 기본계획(AI 대응)",
  ministries: ["국가데이터처", "고용노동부"],
  categories: ["economy", "welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-jobs",
      text: "전 정부보다 일자리와 임금이 줄었는데 자화자찬보다 AI로 줄어드는 일자리 대책을 내놓아야 한다",
      claimIds: ["claim-total", "claim-youth", "claim-industry", "claim-ai-plan"],
    },
  ],
  claims: [
    {
      id: "claim-total",
      text:
        "2026년 9월 취업자는 1년 전보다 11만 3천 명 늘었다(8월 18만 4천 명 증가에서 둔화). 15~64세 고용률은 70.6%로 0.2%포인트 " +
        "올랐고, 실업률은 2.0%였다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2015634"],
      verified: true,
    },
    {
      id: "claim-youth",
      text:
        "15~29세 청년 취업자는 14만 7천 명 줄어 47개월 연속 감소했다. 청년 고용률은 44.0%로 1.1%포인트 떨어졌고, 실업률은 5.4%, " +
        "확장실업률은 15.6%였다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2015634"],
      verified: true,
    },
    {
      id: "claim-industry",
      text:
        "산업별로 보건·사회복지서비스업(20만 7천 명)과 운수·창고업이 늘었고, 숙박·음식점업(-9만 7천 명), 농림어업(-9만 4천 명), " +
        "교육서비스업, 건설업은 줄었다. 제조업은 8월 감소에서 1만 6천 명 증가로 돌아섰다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2015634"],
      verified: true,
    },
    {
      id: "claim-ai-plan",
      text:
        "정부는 7월 9일 산업전환 고용안정법에 따른 첫 '산업전환 고용안정 기본계획'을 발표했다. AI 노출도가 높은 직무의 고용 변화를 보여주는 " +
        "한국형 AI 노출지수와 조기경보 대시보드를 만들고, 2030년까지 100만 명 이상에게 AI 직업훈련을 지원하며, 중장년 재취업지원 의무 사업장을 " +
        "1천 인 이상에서 2027년 500인, 2029년 300인 이상으로 넓힌다. 예산 규모와 전환 대상 노동자 수는 제시되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260709"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-youth"],
  timeline: [
    {
      id: "t-sep",
      date: "2026-10-16",
      datePrecision: "day",
      title: "9월 고용동향 발표",
      summary: "취업자 11만 3천 명 증가, 청년 47개월째 감소.",
      claimIds: ["claim-total", "claim-youth", "claim-industry"],
    },
  ],
  gaps: [
    "윤석열 정부 같은 시기와의 취업자·임금 비교는 이 페이지에서 정리하지 못했다.",
    "AI 기본계획의 예산 규모와 실제 집행 실적은 아직 공개되지 않았다.",
  ],
  sources: [
    {
      id: "src-inews24-2015634",
      title: "9월 취업자 11만3천명↑ 8월보다 둔화…청년 취업자 47개월째 감소",
      publisher: "아이뉴스24",
      url: "https://www.inews24.com/view/2015634",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260709",
      title: "'AI 노출지수'로 일자리 변화 감지…100만명에 AI 직업훈련",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260709_0003701773",
      publishedAt: "2026-07-09",
      type: "press",
      license: "link-only",
    },
  ],
};
