import type { PolicyInput } from "./schema";

/**
 * 외국인 범죄·마약 통계와 불법체류 단속.
 *
 * 10월 말 X 게시물 답글에 "인권단체가 외국인 피해만 부풀려 자국민을 가해자로 몬다",
 * "불법체류 외국인을 단속해 달라, 마약 문제의 근원지다", "외국인 마약 범죄에 대처해 달라",
 * "중국인 관광객을 무분별하게 받아 범죄가 는다"는 말이 달렸다(잼통 Voice). 확인되는 통계와
 * 단속 실적을 적는다.
 *
 * ★ 외국인 범죄율을 내국인과 견주는 최신 공식 수치는 찾지 못했다. 옛 연구 수치는 연도를 밝혀 적는다.
 * ★ 중국 단체관광객 무비자 제도는 policy:china-group-visa-free에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #117, #145, #176, #181.
 */
export const FOREIGN_CRIME_DRUGS: PolicyInput = {
  slug: "foreign-crime-drugs",
  title: "외국인 범죄·마약 통계와 불법체류 단속",
  scope:
    "외국인 강력범죄 검거 추이, 2026년 상반기 외국인 마약사범 검거와 하반기 집중단속, 법무부 불법체류 감축 계획과 단속 실적, 외국인·내국인 범죄율 비교의 한계",
  ministries: ["경찰청", "법무부"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-inflate",
      text: "인권단체가 외국인 피해 사건만 부풀려 자국민을 가해자로 몰아간다",
      claimIds: ["claim-violent", "claim-rate-old"],
    },
    {
      id: "rumor-overstay-drugs",
      text: "불법체류 외국인을 단속해 달라, 마약 문제의 근원지이기도 하다",
      claimIds: ["claim-overstay-plan", "claim-overstay-2025", "claim-drug-h1", "claim-drug-h2"],
    },
    {
      id: "rumor-tourist",
      text: "중국인 관광객을 무분별하게 받아들여 범죄가 늘고 질서가 흔들린다",
      claimIds: ["claim-violent", "claim-drug-h1"],
    },
  ],
  claims: [
    {
      id: "claim-violent",
      text:
        "경찰청 자료를 인용한 보도에 따르면 살인·강도 등 강력범죄로 검거된 외국인은 2021년 689명에서 2025년 771명으로 " +
        "약 12% 늘었다. 같은 기간 체류 외국인도 늘었기 때문에 검거 인원만으로 범죄율 변화를 말할 수는 없다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-10898424"],
      verified: false,
    },
    {
      id: "claim-rate-old",
      text:
        "한국형사정책연구원 연구를 인용한 2013년 보도에 따르면 인구 10만 명당 5대 범죄 검거 인원은 2011년 외국인 918명, 내국인 1,033명으로 " +
        "내국인이 높았지만, 외국인은 2007년 636명에서 가파르게 늘었다. 살인·강도·마약은 외국인 쪽이 높았다. 최신 연도의 같은 비교는 찾지 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20130220"],
      verified: true,
    },
    {
      id: "claim-drug-h1",
      text:
        "경찰청 국가수사본부는 2026년 3~6월 집중단속에서 마약사범 5,203명을 검거해 1,039명을 구속했다. 외국인은 848명으로 " +
        "1년 전(734명)보다 15.5% 늘었고, 국적은 태국 275명·중국 233명·베트남 147명 순이었다. 외국인 사범의 47.2%(400명)가 유통사범이었다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1673536", "src-newsis-20260731"],
      verified: false,
    },
    {
      id: "claim-drug-h2",
      text: "경찰은 8월 3일부터 12월 31일까지 하반기 단속 대상을 온라인 거래와 외국인 마약범죄까지 넓혔다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260731"],
      verified: false,
    },
    {
      id: "claim-overstay-plan",
      text:
        "법무부는 2023년 세 차례 범정부 합동단속으로 불법체류 외국인 약 3만 8천 명을 단속했다. 불법체류자는 2023년 9월 " +
        "약 42만 9천 명에서 11월 약 42만 6천 명으로 줄기 시작했다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "법무부",
      sourceIds: ["src-moj-578564"],
      verified: true,
    },
    {
      id: "claim-overstay-2025",
      text:
        "법무부는 '불법체류 감축 5개년 계획(2023~2027)' 3년 차인 2025년에도 관계부처와 정부합동단속을 벌였다.",
      assertionType: "FACT",
      sourceIds: ["src-newsseoul-2025-crackdown"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-drug-h1",
      date: "2026-08-02",
      datePrecision: "day",
      title: "상반기 마약 집중단속 결과 발표",
      summary: "5,203명 검거, 외국인 848명.",
      claimIds: ["claim-drug-h1", "claim-drug-h2"],
    },
  ],
  gaps: [
    "외국인과 내국인의 인구 대비 범죄율을 2024~2025년 기준으로 비교한 경찰청 공식 수치는 찾지 못했다.",
    "중국 단체관광객 무비자 입국 뒤 관광객이 저지른 범죄 통계는 찾지 못했다.",
    "2025~2026년 법무부 정부합동단속 실적과 현재 불법체류자 수는 공식 자료로 확인하지 못했다.",
    "인권단체가 외국인 피해 사건을 부풀렸다는 주장의 구체적 사례는 답글에 나오지 않아 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-herald-10898424",
      title: "Foreign violent crime up 12% over past 5 years",
      publisher: "The Korea Herald",
      url: "https://biz.heraldcorp.com/article/10898424",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20130220",
      title: "외국인 5대 범죄율 급증세",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20130220024919",
      publishedAt: "2013-02-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1673536",
      title: "상반기 마약사범 5203명 검거…온라인·외국인 범죄 집중단속",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1673536/",
      publishedAt: "2026-08-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260731",
      title: "경찰, 하반기 마약류 집중단속…온라인·외국인까지 확대",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260731_0003732218",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-moj-578564",
      title: "법무부, 역대 가장 많은 불법체류 외국인 3만8천여 명 단속, 불법체류 감소 추세로 전환",
      publisher: "법무부 출입국·외국인정책본부",
      url: "https://immigration.go.kr/bbs/immigration/220/578564/artclView.do",
      publishedAt: "2024-01-02",
      type: "official",
      license: "public",
    },
    {
      id: "src-newsseoul-2025-crackdown",
      title: "법무부, 2025년 1차 불법체류 외국인 정부합동단속 실시",
      publisher: "뉴스서울",
      url: "https://newsseoul.co.kr/news/view/1065579618768856",
      type: "press",
      license: "link-only",
    },
  ],
};
