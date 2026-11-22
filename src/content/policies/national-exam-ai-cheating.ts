import type { PolicyInput } from "./schema";

/**
 * 세무사·국가자격·공공기관·공무원 시험의 부정행위 조사와 대응 (2026년 11월).
 *
 * 대통령 X 게시물 답글에 "제58회 세무사 2차 시험의 출제·채점 부정 의혹도 축소하지 말고 조사해야 한다"(#311),
 * "수능 뒤에는 공기업·공공기관 채용시험의 부정행위 의혹도 살펴 달라"(#309)는 요청이 달렸다(잼통 Voice).
 *
 * ★ 제58회(2021) 세무사 시험 논란과 2026년 제63회 AI 부정행위는 다른 사건이다. 둘 다 적는다.
 * ★ 2026년 전수조사는 올해 시행된 국가자격시험 528개 종목이 대상이다. 공무원·공공기관 채용시험은 대상이 아니다.
 * ★ 수능 대책은 policy:csat-ai-cheating-2027.
 * ★ 2026-11-22 처음 등록 — 잼통 Voice 이슈 #309·#311.
 */
export const NATIONAL_EXAM_AI_CHEATING: PolicyInput = {
  slug: "national-exam-ai-cheating",
  title: "세무사·국가자격·공공기관 시험 부정행위 조사 (2026년)",
  scope:
    "제63회 세무사 시험 AI 부정행위 자백과 국가자격시험 528개 종목 전수조사, 2021년 제58회 세무사 시험 감사 결과, " +
    "공공기관 채용과 공무원 시험의 대응",
  ministries: ["고용노동부", "한국산업인력공단", "인사혁신처", "행정안전부"],
  categories: ["institution"],
  asOf: "2026-11-22",
  rumors: [
    {
      id: "rumor-tax-58",
      text: "제58회 세무사 2차 시험의 출제·채점 부정 의혹도 축소하지 말고 모든 관련 문제를 조사해야 한다",
      claimIds: ["claim-58-audit", "claim-58-regrade", "claim-63-confession", "claim-survey"],
    },
    {
      id: "rumor-public-hiring",
      text: "수능 뒤에는 공기업·공공기관 채용시험의 부정행위 의혹도 살펴 달라",
      claimIds: ["claim-public-bodies", "claim-public-critique", "claim-civil-service"],
    },
  ],
  claims: [
    {
      id: "claim-58-audit",
      text:
        "고용노동부는 2022년 4월 4일 2021년 제58회 세무사 시험 특정감사 결과에서 " +
        "세법학 1부 4번 문제 물음 3에서 같은 답에 다른 점수를 준 채점 문제를 확인했다. 출제 개입·채점 조작 의혹에 대해서는 " +
        "\"위법·부당한 사실은 발견되지 않았다\"고 했다. 산업인력공단에 경고하고 6명 징계를 요구했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-202204041753011"],
      verified: true,
    },
    {
      id: "claim-58-regrade",
      text: "감사 결과에 따라 해당 문항을 다시 채점해 2022년 75명이 추가 합격했다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1715696"],
      verified: true,
    },
    {
      id: "claim-63-confession",
      text:
        "2026년 제63회 세무사 시험 수석 합격자는 11월 15일 초소형 카메라로 문제를 찍어 AI로 보내고 스마트폰으로 답을 확인했다고 " +
        "자백했다. 공인회계사 1차 시험에서도 같은 방법을 썼다고 했다. 산업인력공단은 사과하고 업무방해 고소와 합격 취소를 추진했다.",
      assertionType: "FACT",
      sourceIds: ["src-aitimes-217426-exam"],
      verified: true,
    },
    {
      id: "claim-bluehouse",
      text:
        "청와대는 같은 날 하준경 정책실장 주재로 긴급대책회의를 열어 올해 국가자격시험 전체의 AI 부정행위 의심 사례를 조사하기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-zdnet-20261115205153"],
      verified: true,
    },
    {
      id: "claim-survey",
      text:
        "고용노동부와 산업인력공단은 11월 16일 올해 시행된 국가기술자격 491개, 국가전문자격 37개 등 528개 종목을 전수조사한다고 " +
        "밝혔다. 3년 평균보다 크게 높은 점수, 과목 간 점수 격차, 제보를 기준으로 의심 사례를 골라 전문가가 답안지를 검토하고, " +
        "뚜렷한 사례는 수사를 의뢰한다. 2021년 제58회 시험은 조사 대상이 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-2026111615044427411"],
      verified: true,
    },
    {
      id: "claim-victims",
      text:
        "국가기술자격법·세무사법은 부정행위자 제재만 정하고 피해 수험생 구제는 정하지 않는다. 부정 합격자를 취소해도 차순위 수험생의 " +
        "추가 합격이 보장되지 않는다. 산업인력공단은 피해 수험생 구제 절차를 부처 협의로 논의하고 있다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1715696"],
      verified: true,
    },
    {
      id: "claim-public-bodies",
      text:
        "한국전력 등 주요 공공기관은 올해 초부터 AI 안경 부정행위 가능성을 알고 필기시험에서 전자기기를 금지하고, 적발되면 " +
        "5년간 응시를 제한하는 원칙을 세웠다. 한전은 금속탐지기와 감독관 육안으로 안경을 확인하고, 서부발전은 모든 고사장에 " +
        "전파탐지기를 설치했다. 올해 공공기관 148곳이 약 5만 2천 명을 채용할 계획이다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldcorp-10942454", "src-newspim-20261119000166"],
      verified: true,
    },
    {
      id: "claim-public-critique",
      text:
        "공공기관 관계자들은 \"아직까지 적발된 사례는 없다\"고 했지만, \"초소형 카메라의 경우 육안으로 찾아내기가 힘든\" 만큼 " +
        "적발하지 못했을 가능성이 있고 대응이 \"한 박자 늦은 게 사실\"이라는 지적이 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261119000166"],
      verified: true,
    },
    {
      id: "claim-civil-service",
      text:
        "인사혁신처와 행정안전부는 올해 공무원 시험을 전수조사하지는 않고, 의심 사례가 확인되면 개별적으로 살펴보며 내년 시험에 " +
        "대비한 종합 대책을 만들겠다고 했다. 10월 31일 지방직 7급 필기에서는 전자기기 부정행위 2건(AI 무관)이 적발돼 무효 처리됐다.",
      assertionType: "CLAIM",
      assertedBy: "인사혁신처·행정안전부",
      sourceIds: ["src-insight-582462"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-public-critique", "claim-victims"],
  timeline: [
    {
      id: "t-58-audit",
      date: "2022-04-04",
      datePrecision: "day",
      title: "제58회 세무사 시험 특정감사 결과",
      summary: "채점 문제 확인, 조작은 없었다.",
      claimIds: ["claim-58-audit"],
    },
    {
      id: "t-63-confession",
      date: "2026-11-15",
      datePrecision: "day",
      title: "제63회 세무사 수석 합격자 자백, 청와대 긴급대책회의",
      summary: "국가자격시험 전체 조사 결정.",
      claimIds: ["claim-63-confession", "claim-bluehouse"],
    },
    {
      id: "t-survey",
      date: "2026-11-16",
      datePrecision: "day",
      title: "국가자격 528개 종목 전수조사 착수",
      summary: "의심 답안 검토 후 수사 의뢰.",
      claimIds: ["claim-survey"],
    },
  ],
  gaps: [
    "제58회 세무사 시험 국가배상 소송의 최종 결과는 확인하지 못했다.",
    "전수조사 결과와 수사 의뢰 건수는 아직 나오지 않았다.",
    "기획재정부(공공기관 운영 소관)가 공공기관 채용시험 전반의 부정행위 점검을 지시했다는 자료는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-khan-202204041753011",
      title: "노동부 \"지난해 세무사 자격시험 채점에 일부 문제…조작은 없었다\"",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202204041753011",
      publishedAt: "2022-04-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1715696",
      title: "부정 합격자 취소하면 끝?…기회 잃은 수험생 구제 기준 마련 과제로",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1715696",
      publishedAt: "2026-11-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-aitimes-217426-exam",
      title: "세무사 시험 수석 합격자 \"생성 AI로 부정행위\" 자백",
      publisher: "AI타임스",
      url: "https://www.aitimes.com/news/articleView.html?idxno=217426",
      publishedAt: "2026-11-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-zdnet-20261115205153",
      title: "수능 코앞인데 AI 부정행위 파문…청와대, 국가자격시험 전수조사",
      publisher: "ZDNet Korea",
      url: "https://zdnet.co.kr/view/?no=20261115205153",
      publishedAt: "2026-11-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-2026111615044427411",
      title: "세무사 이어 국가자격 528개 종목 전수조사…AI 부정 의심 답안지 검증 후 수사 의뢰",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026111615044427411",
      publishedAt: "2026-11-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldcorp-10942454",
      title: "주요 공공기관, 올해초부터 AI 안경 부정행위 인지...적발시 5년간 응시제한",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10942454",
      publishedAt: "2026-11-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20261119000166",
      title: "\"AI 안경 막아라\"…공공기관 공채시험 대책 '비상'",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261119000166",
      publishedAt: "2026-11-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-insight-582462",
      title: "\"AI로 9급 합격했다\" 공무원시험 부정 합격 자백글까지... 정부 입장은?",
      publisher: "인사이트",
      url: "https://www.insight.co.kr/news/582462",
      publishedAt: "2026-11-17",
      type: "press",
      license: "link-only",
    },
  ],
};
