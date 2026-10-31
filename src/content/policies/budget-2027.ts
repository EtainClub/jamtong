import type { PolicyInput } from "./schema";

/**
 * 2027년 예산안: 총지출, 미래대응기금, 청년 주거·자산형성, R&D.
 *
 * 「극단적 진영주의는 경계해야」 등 답글에 "2027년 예산안을 세대별 항목(일자리·주거·자산형성)과
 * 수치로 정리해 달라", "기술·과학 분야 투자를 늘려 달라", "대학 기숙사를 늘려 청년 월세 부담을
 * 낮춰 달라"는 요청이 달렸다(잼통 Voice). 9월 1일 정부 예산안의 큰 숫자를 적는다.
 *
 * ★ 예산안은 국회 심의로 바뀐다. 정부안 기준이다.
 * ★ 출산·아동 지원액은 policy:child-benefits-total에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #132, #145, #163.
 */
export const BUDGET_2027: PolicyInput = {
  slug: "budget-2027",
  title: "2027년 예산안: 총지출·미래대응기금·청년·R&D",
  scope:
    "2026년 9월 1일 정부가 낸 2027년 예산안의 총지출·세입, 미래대응기금, 청년 공공임대·청년미래적금·우리아이자립펀드, 정부 R&D 예산",
  ministries: ["기획예산처", "과학기술정보통신부"],
  categories: ["economy", "welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-generations",
      text: "2027년 예산안을 세대별 항목(일자리·주거·자산형성)과 수치로 정리해 알려 달라",
      claimIds: ["claim-total", "claim-fund", "claim-youth"],
    },
    {
      id: "rumor-science",
      text: "기술·과학 분야 투자를 늘려 달라",
      claimIds: ["claim-rnd"],
    },
    {
      id: "rumor-dorm",
      text: "대학 기숙사를 재건축해 1인실을 크게 늘려 청년 월세 부담을 낮춰 달라",
      claimIds: ["claim-dorm", "claim-youth"],
    },
  ],
  claims: [
    {
      id: "claim-total",
      text:
        "정부는 2027년 총지출을 약 820조 9천억 원으로 편성했다. 2026년 본예산(727조 9천억 원)보다 약 93조 원(12.8%) 많다. " +
        "총수입은 880조 8천억 원(국세 584조 4천억 원)으로 잡았다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20260901"],
      verified: true,
    },
    {
      id: "claim-fund",
      text:
        "반도체 호황에 따른 세수로 162조 3천억 원 규모의 미래대응기금을 만들어 청년·성장동력·지역·교육 4개 분야에 45조 4천억 원을 " +
        "쓰고, 약 104조 4천억 원은 세입 변동과 위기에 대비해 남겨 둔다. 이 때문에 2027년 국채 신규 발행은 12조 5천억 원 줄어든다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20260901"],
      verified: true,
    },
    {
      id: "claim-youth",
      text:
        "청년 분야에는 청년 공공임대 10만 6천 호, 역세권 중대형 공공임대 2만 호 신규 공급, 청년미래적금 소득요건 폐지(정부 매칭 " +
        "일반 6%·우대 15%·비수도권 중소기업 저소득 청년 최대 25%), 일경험·직업훈련 72만 명이 담겼다. 출생부터 18세까지 연 최대 " +
        "120만 원을 넣는 우리아이자립펀드도 새로 편성됐다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20260901"],
      verified: true,
    },
    {
      id: "claim-rnd",
      text:
        "정부 R&D 예산은 39조 5천억 원으로 2026년보다 약 4조 원(11.2%) 늘어 역대 최대다. 신규 사업 3조 3천억 원, 반도체·피지컬 AI·AI " +
        "데이터센터 3대 메가 프로젝트 5조 8천억 원, 첨단바이오 2조 2천억 원, 양자 3,700억 원 등이다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000332006"],
      verified: true,
    },
    {
      id: "claim-dorm",
      text:
        "대학 기숙사는 한국사학진흥재단의 사학진흥기금으로 짓는 '행복기숙사'가 있다. 학교 부지에 짓는 사립형과, 국·공유지에 특수목적법인이 지어 " +
        "여러 대학 학생이 함께 쓰는 연합형이 있으며, 사회적 배려 대상자를 우선 선발한다.",
      assertionType: "FACT",
      sourceIds: ["src-kasfo-happy-dorm"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-budget",
      date: "2026-09-01",
      datePrecision: "day",
      title: "2027년 예산안 국무회의 의결",
      summary: "총지출 820조 9천억 원.",
      claimIds: ["claim-total", "claim-fund", "claim-youth", "claim-rnd"],
    },
  ],
  gaps: [
    "연령·세대별 예산 배분을 집계한 정부 자료는 찾지 못했다.",
    "2027년 예산안의 행복기숙사 지원 규모와 1인실 비중은 교육부 예산안 원문에서 확인하지 못했다.",
    "국회 심의 과정의 증감은 12월 확정 뒤 반영해야 한다.",
  ],
  sources: [
    {
      id: "src-mtn-20260901",
      title: "정부, 내년 821조 슈퍼예산 편성…반도체 세수로 162조 '미래대응기금'",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026090110252964642",
      publishedAt: "2026-09-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20000332006",
      title: "내년 정부 R&D 예산 39조5천억원 '역대 최대' [2027 예산안]",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000332006",
      publishedAt: "2026-09-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kasfo-happy-dorm",
      title: "행복기숙사 지원사업",
      publisher: "한국사학진흥재단",
      url: "https://www.kasfo.or.kr/kasfo/945/subview.do",
      type: "official",
      license: "public",
    },
  ],
};
