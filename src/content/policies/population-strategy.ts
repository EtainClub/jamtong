import type { PolicyInput } from "./schema";

/**
 * 출생아 반등과 제1차 국가인구전략 기본계획.
 *
 * 대통령 X 게시물 답글에 "출생률을 높이려면 안정적인 일자리와 주거부터 해결해야 한다"는
 * 말이 달렸다(잼통 Voice). 출생 통계의 흐름과, 2026년 10월 발표된 인구전략 기본계획의
 * 주거·일자리 과제를 적는다.
 *
 * ★ 출생아 증가의 원인은 통계 발표에 나오지 않는다. 정책 효과로 단정하지 않는다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #75.
 */
export const POPULATION_STRATEGY: PolicyInput = {
  slug: "population-strategy",
  title: "출생아 반등과 국가인구전략 기본계획(2026~2030)",
  scope:
    "2025년·2026년 상반기 출생 통계, 제1차 국가인구전략 기본계획(2026~2030)의 목표와 주거·일자리·돌봄 과제, 그에 대한 평가",
  ministries: ["인구전략위원회", "국가데이터처", "국토교통부", "고용노동부"],
  categories: ["welfare"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-jobs-housing",
      text: "출생률을 높이려면 안정적인 일자리와 주거 환경부터 빨리 해결해야 한다",
      claimIds: ["claim-births-2025", "claim-births-2026", "claim-plan", "claim-plan-housing-jobs", "claim-plan-critique"],
    },
  ],
  claims: [
    {
      id: "claim-births-2025",
      text:
        "2025년 출생아는 25만 4,341명으로 전년보다 6.7% 늘어 2년 연속 증가했고, 합계출산율은 0.80명으로 0.05명 " +
        "올랐다. 2021년 이후 처음 0.8명대로 돌아왔다. 국가데이터처 발표는 증가 원인을 따로 밝히지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-births-20260826"],
      verified: true,
    },
    {
      id: "claim-births-2026",
      text:
        "2026년 상반기 출생아는 14만 5,804명으로 1년 전보다 15.4% 늘었고, 2분기 합계출산율은 0.88명이었다. 연간 " +
        "합계출산율이 0.9명을 넘을 수 있다는 기대가 있지만 전망일 뿐이다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-births-20260729", "src-daum-births-2026"],
      verified: false,
    },
    {
      id: "claim-plan",
      text:
        "정부는 2026년 10월 14일 인구전략 비전 선포식에서 제1차 국가인구전략 기본계획(2026~2030)을 발표했다. 합계" +
        "출산율 대신 삶의 만족도(2025년 6.6점→2030년 7.0점)와 경제활동참가율(71.8%→74.0%)을 핵심 성과지표로 삼았다. " +
        "앞서 2026년 6월 저출산·고령사회기본법이 인구전략기본법으로 전부개정됐다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261014", "src-ajunews-20261014"],
      verified: true,
    },
    {
      id: "claim-plan-housing-jobs",
      text:
        "계획에는 청년·신혼·양육가구 대상 공공주택 57만 1천 호 공급, 맞춤형 육아휴직과 유연근무, 인구감소지역의 청년 " +
        "돌봄 일자리 모델(돌봄 전문인력 10만 명 양성), 초·중·고·대학 AI 교육 확대가 들어 있다. 상당수는 부처가 이미 " +
        "시행하거나 발표한 정책이다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261014", "src-ajunews-20261014"],
      verified: false,
    },
    {
      id: "claim-plan-critique",
      text:
        "인구학자 조영태 서울대 교수는 10년 뒤 연령·계층별 인구 규모와 세대 특성이 달라지는데 이에 맞춘 개별 정책이 " +
        "보이지 않는다고 지적했다. 이미 지방을 떠난 청년을 지역 노인 돌봄 일자리로 유도하는 방식은 실효성이 낮다는 " +
        "비판도 나왔다.",
      assertionType: "OPINION",
      sourceIds: ["src-khan-20261014"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-plan-critique"],
  timeline: [
    {
      id: "t-law",
      date: "2026-06",
      datePrecision: "month",
      title: "인구전략기본법 전부개정",
      summary: "저출산·고령사회기본법을 바꿨다.",
      claimIds: ["claim-plan"],
    },
    {
      id: "t-births",
      date: "2026-08-26",
      datePrecision: "day",
      title: "2025년 출생 통계 확정",
      summary: "25만 4,341명, 합계출산율 0.80명.",
      claimIds: ["claim-births-2025"],
    },
    {
      id: "t-plan",
      date: "2026-10-14",
      datePrecision: "day",
      title: "제1차 국가인구전략 기본계획 발표",
      summary: "출산율 대신 삶의 만족도·경제활동참가율.",
      claimIds: ["claim-plan", "claim-plan-housing-jobs"],
    },
  ],
  gaps: [
    "공공주택 57만 1천 호의 연도별 공급 계획과 예산은 원문으로 확인하지 못했다.",
    "출생아 증가가 어느 정책 때문인지 정부 분석 자료는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-korea-births-20260826",
      title: "지난해 출생아 25만 4300명, 6.7% ↑…합계출산율 0.8명대 회복",
      publisher: "대한민국 정책브리핑(국가데이터처)",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148970652",
      publishedAt: "2026-08-26",
      type: "statistics",
      license: "public",
    },
    {
      id: "src-mt-births-20260729",
      title: "올해 처음 0.8명대로 떨어진 합계출산율…출생아는 23개월 연속↑",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/economy/2026/07/29/2026072908334013382",
      publishedAt: "2026-07-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-daum-births-2026",
      title: "2026년 합계출산율 0.9명 넘어설 수 있을까…5월까지 15.2% 증가",
      publisher: "다음 뉴스",
      url: "https://v.daum.net/v/4BHpQ48Bj0?f=p",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20261014",
      title: "출산율 대신 '삶의 질' 내건 정부 인구전략···\"미래 세대 대응 전략은 부족\"",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202610141524021/",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-20261014",
      title: "李대통령, 첫 인구전략위 주재…저출생 넘어 '인구의 판' 바꾼다",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20261014151658792",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
  ],
};
