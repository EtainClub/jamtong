import type { PolicyInput } from "./schema";

/**
 * 수도권 공공택지 후보지와 용산공원·서울 그린벨트 논쟁.
 *
 * 2026년 11월 3일 대통령 X 게시물에 "용산공원과 강남 그린벨트에도 주택을 공급해 달라"는 답글이
 * 달렸다(잼통 Voice). 정부가 지금까지 발표한 수도권 공급 부지(1·29 도심 대책, 8·13 대책,
 * 10·29 신규 택지)와 서초 서리풀지구, 용산공원 본체를 둘러싼 국토교통부·서울시 이견을 적는다.
 *
 * ★ 용산공원 본체 주택은 정부 검토 단계였고 법 개정이 필요하다. 확정된 계획으로 쓰지 않는다.
 * ★ 법안 처리 현황은 policy:housing-supply-bills에 있다.
 * ★ 2026-11-04 처음 등록 — 잼통 Voice 이슈 #209.
 */
export const CAPITAL_AREA_HOUSING_SITES: PolicyInput = {
  slug: "capital-area-housing-sites",
  title: "수도권 공공택지 후보지와 용산공원·그린벨트",
  scope:
    "2026년 1·29 도심 주택공급 방안(용산국제업무지구·캠프킴·태릉CC·과천 경마장 등), 서초 서리풀1지구 지정, 8·13 대책 신규 택지, 10월 29일 서울 인접 그린벨트 신규 택지 6곳, 용산공원 본체 주택 공급을 둘러싼 국토교통부·서울시 이견",
  ministries: ["국토교통부", "서울특별시"],
  categories: ["region", "economy"],
  asOf: "2026-11-04",
  rumors: [
    {
      id: "rumor-yongsan-gangnam",
      text: "용산공원과 강남 그린벨트에도 주택을 공급해 달라",
      claimIds: ["claim-129", "claim-seoripul", "claim-yongsan-park", "claim-yongsan-law", "claim-1029", "claim-seoul-gb-excluded"],
    },
  ],
  claims: [
    {
      id: "claim-129",
      text:
        "정부는 2026년 1월 29일 '도심 주택공급 확대 및 신속화 방안'에서 수도권 도심 공공부지 등에 약 6만 가구(서울 3만 2,000가구)를 2027~2030년 순차 착공하겠다고 발표했다. " +
        "용산국제업무지구 1만 가구(기존 6,000가구에서 확대, 2028년 착공 목표), 용산 캠프킴 2,500가구(기존 1,400가구), 과천 경마장·방첩사 부지 9,800가구, 노원 태릉CC 6,800가구 등이다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20260129"],
      verified: true,
    },
    {
      id: "claim-seoripul",
      text:
        "국토교통부는 2026년 2월 2일 서울 서초구 원지·신원·염곡·내곡동 일대 201만 8,074㎡를 서리풀1지구 공공주택지구로 지정·고시했다. 강남 생활권에 1만 8,000호를 짓는다. " +
        "LH는 2026년 7월 착공을 2028년, 분양을 2029년으로 1년가량 앞당기겠다고 했다. 2지구 일부 주민은 지구 지정 취소 행정소송을 냈다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260201", "src-hankyung-20260708"],
      verified: true,
    },
    {
      id: "claim-yongsan-ibd-dispute",
      text:
        "2026년 7월 보도 기준 용산국제업무지구 주택 물량을 두고 국토교통부는 1만 가구가 필요하다는 입장이고, 서울시는 최대 8,000가구가 적정하다는 입장이다. " +
        "과천 경마장 부지는 한국마사회가 약 2조 원의 이전 비용을 요구하며 정부와 맞서고 있다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부·서울특별시·한국마사회",
      sourceIds: ["src-hankyung-20260708"],
      verified: true,
    },
    {
      id: "claim-yongsan-park",
      text:
        "김윤덕 당시 국토교통부 장관은 2026년 8월 14일 \"용산공원 전체에 주택을 공급하는 것을 고민하고 있다\"고 말했다. 서울시는 용산공원을 훼손해 주택을 공급하는 것은 \"매우 신중해야 한다\"는 입장에 변함이 없다고 밝혔고, " +
        "오세훈 시장은 어린이정원 부지를 일부라도 주택에 쓰는 데 동의할 수 없다고 했다. 8·13 대책에서 용산 어린이정원은 신규 택지에서 빠졌다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부·서울특별시",
      sourceIds: ["src-cah-newsis-20260814"],
      verified: true,
    },
    {
      id: "claim-yongsan-law",
      text:
        "2007년 제정된 용산공원 조성 특별법은 미군기지 본체 부지 전체를 공원으로 만드는 것을 원칙으로 한다. 김윤덕 장관은 8월 20일 오세훈 시장과 만난 뒤 공원 전체가 아니라 장교 숙소처럼 이미 건물이 있던 일부 부지만 청년·신혼부부 주택으로 쓰겠다고 했고, " +
        "오 시장은 공원 부지를 아파트 부지로 바꾸는 데는 어떤 경우에도 동의할 수 없다며 공원 인근 부지는 융통성 있게 논의하자고 했다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부·서울특별시",
      sourceIds: ["src-newspim-20260820"],
      verified: true,
    },
    {
      id: "claim-petition",
      text: "용산공원 주택 공급에 반대하는 국회 국민동의청원은 2026년 9월 1일 보도 기준 5만 명 넘게 동의를 얻어 상임위원회 회부 요건을 채웠다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260901"],
      verified: false,
    },
    {
      id: "claim-813",
      text:
        "국토교통부는 2026년 8월 13일 대책에서 서울 강서 염창 1,000가구, 남양주 와부 2만 1,700가구, 경기광주역 2지구 4,500가구 등 신규 택지 약 2만 7,000가구를 발표하고, 연내 7만 3,000가구 이상을 더 찾겠다고 했다. " +
        "투기를 막으려고 서울 그린벨트 전역과 서울 인접 수도권 그린벨트를 5년간 토지거래허가구역으로 지정했다.",
      assertionType: "FACT",
      sourceIds: ["src-supple-20260813"],
      verified: true,
    },
    {
      id: "claim-1029",
      text:
        "국토교통부는 2026년 10월 29일 서울 경계 약 5km 안의 그린벨트를 중심으로 김포 아라 3만 7,000가구, 구리 건원 1만 4,600가구, 하남미사 1만 2,000가구, 하남 감일2 6,500가구, " +
        "고양 대곡 확장 4,000가구, 의정부 다락원 2,600가구 등 신규 공공택지 6곳 7만 6,700가구를 발표했다. 8·13 대책 물량을 합치면 약 10만 4,000가구이고, 발표부터 착공까지를 68개월에서 37개월로 줄여 2030년까지 착공한다는 목표다.",
      assertionType: "FACT",
      sourceIds: ["src-sisajournal-20261029", "src-ytn-20261029"],
      verified: true,
    },
    {
      id: "claim-seoul-gb-excluded",
      text:
        "10월 29일 신규 택지에 서울 시내 그린벨트와 용산공원은 들어가지 않았다. 국토교통부는 8월에 이미 두 곳은 후보지에 포함되지 않는다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20261029"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-yongsan-ibd-dispute"],
  timeline: [
    {
      id: "t-129",
      date: "2026-01-29",
      datePrecision: "day",
      title: "도심 주택공급 확대 방안",
      summary: "용산·태릉CC·과천 등 약 6만 가구.",
      claimIds: ["claim-129"],
    },
    {
      id: "t-seoripul",
      date: "2026-02-02",
      datePrecision: "day",
      title: "서리풀1지구 지정",
      summary: "서초 1만 8,000호.",
      claimIds: ["claim-seoripul"],
    },
    {
      id: "t-813",
      date: "2026-08-13",
      datePrecision: "day",
      title: "8·13 대책 신규 택지",
      summary: "약 2만 7,000가구, 그린벨트 토지거래허가구역.",
      claimIds: ["claim-813"],
    },
    {
      id: "t-yongsan-park",
      date: "2026-08-14",
      datePrecision: "day",
      title: "용산공원 주택 검토 발언",
      summary: "국토부 장관 발언, 서울시 반대.",
      claimIds: ["claim-yongsan-park", "claim-yongsan-law"],
    },
    {
      id: "t-1029",
      date: "2026-10-29",
      datePrecision: "day",
      title: "서울 인접 그린벨트 신규 택지 6곳",
      summary: "7만 6,700가구, 서울 그린벨트·용산공원 제외.",
      claimIds: ["claim-1029", "claim-seoul-gb-excluded"],
    },
  ],
  gaps: [
    "서울 시내 그린벨트(강남권 포함)를 앞으로 추가 해제할지 정부가 밝힌 계획은 찾지 못했다.",
    "용산공원 본체 주택 공급 논의가 8월 26일 국토부 장관·서울시장 2차 회동 뒤 어떻게 됐는지는 확인하지 못했다.",
    "국민동의청원 동의 수는 깨진 인코딩의 보도로만 확인해 미검증으로 둔다. 8월 20일 보도 시점에는 2만 4,584명이었다.",
    "1·29 대책 부지들의 착공 준비 진척(과천 경마장 이전 비용 이견 등)은 2026년 7월 보도 이후를 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newspim-20260129",
      title: "[1·29 공급대책] 용산·태릉CC·경마장 등 도심 6만가구 조성…내년 착공",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260129000262",
      publishedAt: "2026-01-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260201",
      title: "국토부, 서리풀지구 공공주택지구 지정·고시…2029년 첫 분양 목표",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260201_0003497792",
      publishedAt: "2026-02-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-20260708",
      title: "LH 서리풀 1년 당겨 2028년 착공…주민 반대는 숙제",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026070835081",
      publishedAt: "2026-07-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-cah-newsis-20260814",
      title: "용산공원 놓고 국토부·서울시 대립각…\"집 짓겠다\" vs \"훼손 신중\"(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260814_0003750257",
      publishedAt: "2026-08-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20260820",
      title: "[르포] 용산 한복판서 불붙은 공급 논쟁…\"공원 지켜야\" vs \"주택 조성해야\"",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260820000902",
      publishedAt: "2026-08-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260901",
      title: "'용산공원 주택공급 말라' 국회로…청원 5만명 동의",
      publisher: "네이트 뉴스",
      url: "https://m.news.nate.com/view/20260901n30872",
      publishedAt: "2026-09-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-supple-20260813",
      title: "서울 염창·남양주·경기광주 등 신규 택지…연내 7.3만호+α 더 찾는다 [8·13 대책]",
      publisher: "서플",
      url: "https://supple.kr/news/cmsqxpsu6003zjxqevqwfptb8",
      publishedAt: "2026-08-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sisajournal-20261029",
      title: "서울 인접 그린벨트 해제…김포·하남 등 7.7만 가구 공급",
      publisher: "시사저널",
      url: "https://www.sisajournal.com/news/articleView.html?idxno=392130",
      publishedAt: "2026-10-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20261029",
      title: "수도권 신규택지 발표...서울 인접 그린벨트 해제",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0102_202610291338322008",
      publishedAt: "2026-10-29",
      type: "press",
      license: "link-only",
    },
  ],
};
