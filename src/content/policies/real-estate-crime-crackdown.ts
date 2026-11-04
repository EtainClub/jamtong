import type { PolicyInput } from "./schema";

/**
 * 부동산 시장 교란 행위 단속과 부동산감독원 법안.
 *
 * 2026년 11월 3일 대통령 X 게시물에 "분당의 호가 담합과 재건축 유착 의혹을 조사해 엄하게 처벌해
 * 달라"는 답글이 달렸다(잼통 Voice). 정부가 이미 하고 있는 단속(국무조정실 부동산감독추진단·
 * 국토교통부 특사경·특별단속)과, 국회에 묶여 있는 부동산감독원 설치법을 적는다.
 *
 * ★ 단속 실적은 정부 발표를 보도로 옮긴 것이므로 발표 주체를 밝힌다.
 * ★ 분당 특정 단지의 담합·유착 의혹은 확인하지 못했다(gaps).
 * ★ 2026-11-04 처음 등록 — 잼통 Voice 이슈 #204.
 */
export const REAL_ESTATE_CRIME_CRACKDOWN: PolicyInput = {
  slug: "real-estate-crime-crackdown",
  title: "부동산 시장 교란 행위 단속과 부동산감독원",
  scope:
    "국무조정실 부동산감독추진단(2025년 11월 출범)과 1차 특별단속 결과, 국토교통부 특별사법경찰, 공인중개사 담합 행정처분 방침, 2차 특별단속, 국회에 계류된 부동산감독원 설치법",
  ministries: ["국무조정실", "국토교통부", "경찰청", "국세청", "금융위원회"],
  categories: ["institution", "economy"],
  asOf: "2026-11-04",
  rumors: [
    {
      id: "rumor-bundang-collusion",
      text: "분당의 호가 담합과 재건축 유착 의혹을 조사해 엄하게 처벌해야 한다",
      claimIds: ["claim-task-force", "claim-first-crackdown", "claim-broker-collusion", "claim-special-police"],
    },
  ],
  claims: [
    {
      id: "claim-task-force",
      text:
        "국무조정실 부동산감독추진단은 2025년 11월 3일 출범했다. 국토교통부·행정안전부·금융위원회·국세청·경찰청 등이 참여하는 '부동산 불법행위 대응 협의회'를 주관한다.",
      assertionType: "FACT",
      sourceIds: ["src-rec-newsis-20260325", "src-rec-newsis-20260226"],
      verified: true,
    },
    {
      id: "claim-first-crackdown",
      text:
        "정부 발표에 따르면 1차 특별단속(2025년 10월 17일~2026년 3월 15일)에서 1,493명을 단속해 640명을 송치하고 7명을 구속했다. " +
        "가격 왜곡·공급질서 교란이 448명으로 가장 많았고, 공인중개사가 132명이었다. 35명의 공인중개사가 단체를 꾸려 비회원과의 공동중개를 거부한 담합 사례도 적발됐다. " +
        "이 대통령은 2026년 3월 24일 X에 단속 결과 문건을 올렸다.",
      assertionType: "CLAIM",
      assertedBy: "국무조정실 부동산감독추진단",
      sourceIds: ["src-rec-newsis-20260325"],
      verified: true,
    },
    {
      id: "claim-second-crackdown",
      text: "정부는 2차 특별단속을 2026년 10월 31일까지 7개월간 이어 가기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-rec-newsis-20260325"],
      verified: true,
    },
    {
      id: "claim-special-police",
      text:
        "국토교통부는 2026년 1월부터 특별사법경찰 4명을 투입해 부동산거래신고법·주택법·공인중개사법 위반, 곧 집값 담합, 업·다운 계약, 실거래가 허위 신고, 부정 청약 등을 직접 수사하고 있다. 당초 7명을 추진했으나 부처 협의에서 줄었다.",
      assertionType: "FACT",
      sourceIds: ["src-daum-20260212"],
      verified: true,
    },
    {
      id: "claim-broker-collusion",
      text:
        "국토교통부는 2026년 3월 31일 강남·서초구청 등과 중개사무소 40여 곳을 합동 점검해, 고액 가입비를 받는 친목단체가 회원끼리만 인기 매물을 공동중개하고 비회원과 거래하면 자체 징계한 정황을 경찰청에 통보했다. " +
        "부동산감독추진단은 4월 9일 위법이 확인되면 업무정지·등록취소 등 행정처분을 내리고, 등록이 취소되면 3년간 중개사무소를 열 수 없다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20260409"],
      verified: true,
    },
    {
      id: "claim-agency-bill",
      text:
        "더불어민주당 김현정 의원 등은 2026년 2월 10일 국무조정실 소속 독립기구인 부동산감독원 설치법을 발의했다. 특별사법경찰을 두어 시세 조작·부정 청약·불법 증여 등 26개 법률 위반을 조사·수사하게 하는 내용이며, 당시 목표는 상반기 입법·하반기 출범이었다. " +
        "2026년 10월 12일 기준 발의된 설치법 4건은 모두 소관 상임위원회 심사 단계에 있고, 법은 공포 후 6개월 뒤 시행돼 연내 출범은 무산됐다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260210", "src-mt-20261012"],
      verified: true,
    },
    {
      id: "claim-agency-concerns",
      text:
        "국회예산정책처는 부동산감독원 운영에 2027~2031년 904억 5,100만 원(연평균 약 181억 원)이 든다고 추계했다. 정무위원회 검토보고서는 행정조사 단계에서 영장 없이 금융거래정보를 요청하게 한 조항이 피조사자의 방어권을 제약할 수 있고, " +
        "조사대상이 아닌 일반 국민의 거래·납세 정보까지 확보될 여지가 있으며, 국토교통부·금융위원회·국세청·경찰과의 권한 조정이 구체적이지 않다고 지적했다. 21대 국회의 비슷한 법안 4건은 임기 만료로 폐기됐다.",
      assertionType: "CLAIM",
      assertedBy: "국회예산정책처·국회 정무위원회 수석전문위원",
      sourceIds: ["src-etoday-agency"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-agency-concerns"],
  timeline: [
    {
      id: "t-first-start",
      date: "2025-10-17",
      datePrecision: "day",
      title: "1차 부동산 특별단속 시작",
      summary: "2026년 3월 15일까지.",
      claimIds: ["claim-first-crackdown"],
    },
    {
      id: "t-task-force",
      date: "2025-11-03",
      datePrecision: "day",
      title: "부동산감독추진단 출범",
      summary: "국무조정실 소속, 관계기관 협의회 주관.",
      claimIds: ["claim-task-force"],
    },
    {
      id: "t-bill",
      date: "2026-02-10",
      datePrecision: "day",
      title: "부동산감독원 설치법 발의",
      summary: "국무총리 소속, 특사경 수사권.",
      claimIds: ["claim-agency-bill"],
    },
    {
      id: "t-result",
      date: "2026-03-24",
      datePrecision: "day",
      title: "1차 단속 결과 공개",
      summary: "1,493명 단속, 640명 송치, 7명 구속.",
      claimIds: ["claim-first-crackdown", "claim-second-crackdown"],
    },
    {
      id: "t-broker",
      date: "2026-04-09",
      datePrecision: "day",
      title: "중개 담합 행정처분 방침",
      summary: "등록 취소 시 3년간 개설 금지.",
      claimIds: ["claim-broker-collusion"],
    },
    {
      id: "t-agency-delay",
      date: "2026-10-12",
      datePrecision: "day",
      title: "부동산감독원 연내 출범 무산",
      summary: "설치법 4건 상임위 계류.",
      claimIds: ["claim-agency-bill"],
    },
  ],
  gaps: [
    "답글이 말한 분당 특정 단지의 호가 담합·재건축 유착 의혹은 조사 여부를 확인하지 못했다. 강남·서초 중개사무소 합동 점검은 확인했다.",
    "2차 특별단속(2026년 10월 31일 종료)의 결과는 아직 발표를 확인하지 못했다.",
    "3월 31일 합동 점검 건의 경찰 수사 결과는 확인하지 못했다.",
    "부동산감독원 설치에 대한 국민의힘의 공식 반대 논거는 원문으로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-rec-newsis-20260325",
      title: "신고가 거래 후 계약 해지·중개사 담합…편법·불법 천태만상",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260325_0003562643",
      publishedAt: "2026-03-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-rec-newsis-20260226",
      title: "국조실 부동산감독추진단, 불법 대응협의회 개최",
      publisher: "뉴시스",
      url: "https://mobile.newsis.com/view/NISX20260226_0003528054",
      publishedAt: "2026-02-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-daum-20260212",
      title: "[단독]국토부, 지난달부터 특사경 가동…집값 담합 등에 수사권 확보",
      publisher: "아시아경제",
      url: "https://v.daum.net/v/20260212071214562",
      publishedAt: "2026-02-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20260409",
      title: "부동산 중개 담합에 칼 뽑았다…정부 \"적발 시 등록 취소·3년 개설 금지\"",
      publisher: "서울신문",
      url: "https://www.seoul.co.kr/news/economy/2026/04/09/20260409500210",
      publishedAt: "2026-04-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20260210",
      title: "與, 부동산감독원 설치법 발의...\"투기 공화국 오명 종지부 찍겠다\"",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/politics/2026/02/10/2026021014031815013",
      publishedAt: "2026-02-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20261012",
      title: "연내 출범 무산 부동산감독원…출범 후 정비까지 7년 넘게 걸린다",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/estate/2026/10/12/2026101215073838417",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-agency",
      title: "부동산감독원 입법 속도⋯연 181억·광범위 조사권 쟁점",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2618893",
      publishedAt: "2026-08-28",
      type: "press",
      license: "link-only",
    },
  ],
};
