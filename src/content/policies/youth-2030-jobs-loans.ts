import type { PolicyInput } from "./schema";

/**
 * 2030 청년의 일자리와 주택 대출 — "다 막아놨다"·"14만 명이 줄었다".
 *
 * 2026년 10월 29일 한 서울시의원(국민의힘)이 인스타그램 릴스에서 "2030이 왜 보수가
 * 됐냐"고 묻고 주거·일자리를 들며 "다 막아놨잖아요", "14만 명이 줄었어요"라고 말했다
 * (신고 센터 factbot-gap #218·#219). 캡션이 주거와 일자리를 꼽으므로, '막았다'는
 * 주택 대출 규제로, '14만 명'은 게시 시점의 최신 통계인 9월 고용동향의 청년 취업자
 * 감소로 보고 두 가지를 함께 적는다.
 *
 * ★ 영상 음성 원문은 확인하지 못했다. 대상을 단정하지 않고 gaps에 적는다.
 * ★ 청년 고용 전체 그림은 policy:jobs-wages-2026, 정책대출 예산은
 *   policy:housing-loan-budget, 대출 규제 전반은 policy:housing-measures에 있다.
 * ★ 2026-11-05 처음 등록 — factbot-gap #218·#219.
 */
export const YOUTH_2030_JOBS_LOANS: PolicyInput = {
  slug: "youth-2030-jobs-loans",
  title: "2030 청년 일자리 감소와 주택 대출 규제",
  scope:
    "2026년 9월 청년 취업자 감소(15~29세·15~34세 기준), 2025년 6·27·10·15 주택 대출 규제가 청년에게 미친 영향, 2026년 8·13 대책의 청년·신혼부부 대출 완화",
  ministries: ["국가데이터처", "금융위원회", "국토교통부"],
  categories: ["economy", "welfare"],
  asOf: "2026-11-05",
  rumors: [
    {
      id: "rumor-blocked",
      text: "정부가 2030 청년층이 이용하던 것을 다 막아놨다",
      claimIds: [
        "claim-627",
        "claim-1015-caps",
        "claim-fsc-chair",
        "claim-2030-purchases",
        "claim-813-youth",
      ],
    },
    {
      id: "rumor-140k",
      text: "(청년 일자리가) 14만 명이 줄었다",
      claimIds: ["claim-youth-sep", "claim-youth-34", "claim-streak-start"],
    },
  ],
  claims: [
    {
      id: "claim-youth-sep",
      text:
        "국가데이터처가 2026년 10월 16일 발표한 9월 고용동향에서 15~29세 청년 취업자는 1년 전보다 " +
        "14만 7천 명 줄어 47개월째 감소했다. 청년 고용률은 44.0%로 1.1%포인트 떨어져 29개월 연속 " +
        "내려갔다. 같은 달 전체 취업자는 11만 3천 명 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20261016", "src-mtn-20261016"],
      verified: true,
    },
    {
      id: "claim-youth-34",
      text:
        "청년고용촉진특별법 개정으로 청년이 15~34세로 새로 정의되면서 9월부터 이 연령대 통계가 따로 " +
        "공표됐다. 9월 15~34세 취업자는 1년 전보다 9만 8천 명 줄었다. 같은 '청년 취업자 감소'라도 " +
        "어느 기준을 쓰느냐에 따라 숫자가 다르다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20261016"],
      verified: true,
    },
    {
      id: "claim-streak-start",
      text:
        "'47개월째 감소'를 거꾸로 세면 15~29세 취업자 감소는 2022년 11월부터 이어졌다. 기사는 시작 " +
        "달을 따로 적지 않았고, 이 날짜는 발표된 개월 수로 계산한 것이다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-hankyung-20261016"],
      verified: false,
    },
    {
      id: "claim-627",
      text:
        "2025년 6월 27일 금융위원회는 6월 28일부터 수도권·규제지역의 주택 구입 목적 주택담보대출을 " +
        "최대 6억 원으로 제한하고, 생애최초 구입 LTV를 80%에서 70%로 낮추며 6개월 안에 전입하도록 했다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-20250627"],
      verified: true,
    },
    {
      id: "claim-1015-caps",
      text:
        "2025년 10·15 대책 뒤 2026년 7월 기준으로 규제지역 1주택자의 주택담보대출 LTV는 40%, " +
        "다주택자는 0%다. 대출 한도는 15억 원 이하 주택 최대 6억 원, 15억~25억 원 4억 원, 25억 원 " +
        "초과 2억 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260716"],
      verified: true,
    },
    {
      id: "claim-fsc-chair",
      text:
        "이억원 금융위원장은 2025년 10월 20일 국정감사에서 생애최초 주택 구입자금은 LTV 70%를 그대로 " +
        "두었고, 청년·신혼부부가 쓰는 보금자리론·디딤돌 같은 정책대출의 한도나 대출 비율은 건드리지 " +
        "않았다고 답했다.",
      assertionType: "CLAIM",
      assertedBy: "금융위원회",
      sourceIds: ["src-dailian-20251020"],
      verified: true,
    },
    {
      id: "claim-2030-purchases",
      text:
        "엄태영 의원(국민의힘)이 국토교통부 서울 자금조달계획서 4만 8,829건을 분석한 결과, 대출 규제 " +
        "한도와 무관한 3억 원 이하 주택담보대출로 집을 산 거래가 1년 전보다 20대는 69.2%, 30대는 " +
        "71.8% 줄어 40대(-66.7%)·50대(-62.7%)·60대 이상(-42.5%)보다 감소 폭이 컸다. 6·27 대책 직후인 " +
        "2025년 7~8월 20·30대가 주택담보대출로 서울에 집을 산 거래는 1,356건이었다.",
      assertionType: "CLAIM",
      assertedBy: "엄태영 국민의힘 의원",
      sourceIds: ["src-herald-20251016"],
      verified: false,
    },
    {
      id: "claim-policy-chief",
      text:
        "김용범 대통령실 정책실장은 2026년 7월 10일 신혼부부가 6억 원 대출 한도에 막히면 어떻게 해야 " +
        "하느냐며 청년 실수요자 개선책 논의가 필요하다고 말했다. 정부 안에서는 규제 완화의 부작용을 " +
        "걱정하는 반대 기류가 강하다고 보도됐다.",
      assertionType: "CLAIM",
      assertedBy: "대통령실 정책실장",
      sourceIds: ["src-newsis-20260716"],
      verified: true,
    },
    {
      id: "claim-813-youth",
      text:
        "금융위원회는 2026년 8월 13일 대책에서 만 39세 이하 생애최초 구입 청년이 4억 원 이하·85㎡ 이하 " +
        "비아파트를 살 때 LTV 최대 80%, 3%대 금리로 빌려주는 '청년미래보금자리론'(연 3조 원, 2년 한시)을 " +
        "2027년 1월부터 순차 출시한다고 발표했다. 청년특례 전세대출보증 대상은 만 34세 이하에서 39세 " +
        "이하로, 신혼·유자녀 가구 전세대출 한도는 2억 원에서 3억 원으로 넓혔다. 수도권·규제지역 6억 원 " +
        "상한은 이 대책에서 바뀌지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260814", "src-newstomato-20260813"],
      verified: true,
    },
    {
      id: "claim-813-total",
      text:
        "같은 대책에서 정부는 2026년 가계대출 총량 증가율 관리 목표를 1.5%에서 3% 수준으로 올렸고, " +
        "보금자리론은 신혼부부도 한 사람 연소득이 7천만 원 이하면 쓸 수 있게 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-20260813"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-youth-sep", "claim-2030-purchases"],
  timeline: [
    {
      id: "t-627",
      date: "2025-06-27",
      datePrecision: "day",
      title: "주택담보대출 6억 원 상한",
      summary: "생애최초 LTV 80% → 70%.",
      claimIds: ["claim-627"],
    },
    {
      id: "t-audit",
      date: "2025-10-20",
      datePrecision: "day",
      title: "금융위원장 국감 답변",
      summary: "생애최초 LTV 70%·정책대출 한도는 유지했다고 답했다.",
      claimIds: ["claim-fsc-chair"],
    },
    {
      id: "t-policy-chief",
      date: "2026-07-10",
      datePrecision: "day",
      title: "정책실장, 신혼부부 6억 한도 언급",
      summary: "청년 실수요자 개선책 논의 필요성을 꺼냈다.",
      claimIds: ["claim-policy-chief"],
    },
    {
      id: "t-813",
      date: "2026-08-13",
      datePrecision: "day",
      title: "8·13 대책 — 청년미래보금자리론 신설",
      summary: "청년·신혼부부 대출 일부 완화, 6억 상한은 유지.",
      claimIds: ["claim-813-youth", "claim-813-total"],
    },
    {
      id: "t-sep-jobs",
      date: "2026-10-16",
      datePrecision: "day",
      title: "9월 고용동향",
      summary: "15~29세 취업자 14만 7천 명 감소, 47개월째.",
      claimIds: ["claim-youth-sep", "claim-youth-34"],
    },
  ],
  gaps: [
    "릴스 영상의 음성 원문을 확인하지 못했다. '다 막아놨다'가 주택 대출 규제를, '14만 명'이 9월 15~29세 취업자 감소를 가리킨다는 것은 캡션(주거·일자리)과 게시 시점 최신 통계에 맞춘 추정이다.",
    "엄태영 의원 분석의 원자료(자금조달계획서 집계)는 대조하지 못했다.",
    "청년특례 전세대출보증 연령 확대의 시행일은 보도마다 다르다.",
  ],
  sources: [
    {
      id: "src-hankyung-20261016",
      title: "11.3만명↑…제조업 27개월만 반등·음식숙박 67개월 만에 최대폭 감소",
      publisher: "한국경제(연합뉴스)",
      url: "https://www.hankyung.com/article/202610166046Y",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20261016",
      title: "9월 고용동향 — 청년층 취업자 47개월째 감소",
      publisher: "머니투데이방송",
      url: "https://news.mtn.co.kr/article/2026101616373140958",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fsc-20250627",
      title: "가계부채 관리 방안 (보도자료)",
      publisher: "금융위원회",
      url: encodeURI("https://files-scs.pstatic.net/2025/06/27/6yDjjGw0Ji/250627(보도자료)가계부채 관리 방안.pdf"),
      publishedAt: "2025-06-27",
      type: "official",
      license: "public",
    },
    {
      id: "src-newsis-20260716",
      title: "\"대출 숨통 틔워달라\" 분출…난제 직면한 정부[부동산 새판 짜기③]",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260716_0003712670",
      publishedAt: "2026-07-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-20251020",
      title: "'내 집 마련 막았다'… 10·15 대출규제 정조준한 정무위 [2025국감]",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1561708",
      publishedAt: "2025-10-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-20251016",
      title: "현금부자만 웃는 대출 규제…주거사다리 끊긴 2030 '분통'",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2025101618312027988",
      publishedAt: "2025-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20260814",
      title: "\"월세 80만원 내느니 내 집 마련\"…청년 주거 지원 3종 세트 나온다",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/estate/2026/08/14/2026081322190771324",
      publishedAt: "2026-08-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-20260813",
      title: "(8·13 부동산 대책)성난 여론에 백기…대출공급 늘리고 청년·신혼부부 지원 강화",
      publisher: "뉴스토마토",
      url: "https://www.newstomato.com/readnews.aspx?no=1310171",
      publishedAt: "2026-08-13",
      type: "press",
      license: "link-only",
    },
  ],
};
