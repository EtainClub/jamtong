import type { PolicyInput } from "./schema";

/**
 * 대통령 해외 순방 횟수·영부인 동행 논란 (2026년 10~11월).
 *
 * 2026년 10월 31일 대통령이 순방 비판에 X로 반박한 뒤, 답글에 세 갈래 주장이 달렸다(잼통 Voice).
 *   ① "야당 시절 전임 대통령 순방을 놀러 간다고 비판해 놓고 같은 비판을 탓하는 것은 내로남불이다"(#210)
 *   ② "순방에서 보인 식사 태도와 '우리는 식구', '마이 와이프' 같은 말투가 품위 없다"(#211)
 *   ③ "영부인 순방 일정은 봉사·사회공헌처럼 공공성이 분명한 일정 위주로 짜야 한다"(#213)
 * 논란의 경과와 각 발언이 실제로 나온 자리, 정부·여야의 주장을 적는다.
 *
 * ★ 품위·내로남불은 가치 판단이라 가리지 않는다. 누가 언제 무슨 말을 했는지만 적는다.
 * ★ 순방 일정과 성과는 policy:overseas-trips-2026, 대통령실 예산은 policy:presidential-office-budget에 있다.
 * ★ 2026-11-05 처음 등록 — 잼통 Voice 이슈 #210, #211, #213.
 */
export const OVERSEAS_TRIPS_DISPUTE: PolicyInput = {
  slug: "overseas-trips-dispute",
  title: "대통령 해외 순방 횟수·영부인 동행 논란 (2026년 10~11월)",
  scope:
    "2026년 10월 29일 국정감사의 순방 횟수·김혜경 여사 동행 지적, 국가안보실장·대통령·외교부의 반박, 여야 공방, 야당 대표 시절 이재명 대통령의 순방 비판 발언, '마이 와이프'·'우리는 식구' 발언이 나온 자리",
  ministries: ["외교부", "청와대 국가안보실"],
  categories: ["diplomacy"],
  asOf: "2026-11-05",
  rumors: [
    {
      id: "rumor-double-standard",
      text: "야당 시절 전임 대통령의 순방을 놀러 간다고 비판해 놓고, 이제 같은 비판을 탓하는 것은 내로남불이다",
      claimIds: ["claim-2022-criticism", "claim-ppp-double-standard", "claim-dp-rebuttal"],
    },
    {
      id: "rumor-manners",
      text: "순방에서 보인 식사 태도와 '우리는 식구', '마이 와이프' 같은 말투가 품위 없어 부끄럽다",
      claimIds: ["claim-my-wife", "claim-sikgu", "claim-mofa"],
    },
    {
      id: "rumor-first-lady-schedule",
      text: "영부인의 순방 일정은 개인 취향보다 봉사·사회공헌처럼 공공성이 분명한 일정 위주로 짜야 한다",
      claimIds: ["claim-wi-first-lady", "claim-first-lady-europe"],
    },
  ],
  claims: [
    {
      id: "claim-audit",
      text:
        "2026년 10월 29일 국회 운영위원회의 대통령비서실·국가안보실 국정감사에서 국민의힘 김승수 의원은 이 대통령이 14차례에 걸쳐 23개국을 방문했다며 순방이 과도하고, " +
        "김혜경 여사의 동행이 너무 많다고 지적했다.",
      assertionType: "CLAIM",
      assertedBy: "김승수 국민의힘 의원",
      sourceIds: ["src-sedaily-20261031", "src-nocut-20261031"],
      verified: true,
    },
    {
      id: "claim-wi-first-lady",
      text:
        "위성락 국가안보실장은 10월 30일 \"우리나라의 국제적인 위상이 많이 올라갔기 때문에 정상이 연중에 가야만 하는 다자적인 계기가 여러 개 있다\"며, " +
        "\"그런 정상외교는 관행적으로 다 영부인을 수반한다\", \"영부인이 왜 가냐거나 하는 문제 제기는 공정하지 않다\"고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "위성락 국가안보실장",
      sourceIds: ["src-nocut-20261031", "src-sedaily-20261031"],
      verified: true,
    },
    {
      id: "claim-president-post",
      text:
        "이 대통령은 10월 31일 X에 누리꾼 글을 재게시하며 \"높은 강도의 사전 준비, 장시간 비행과 한나절도 빼지 않는 빽빽한 공식 업무 일정, 높은 업무 강도로 수시로 링거 주사를 맞으며 " +
        "코피가 터지는 해외 순방조차도 놀러 가는 것처럼 보일 수 있다\"고 썼고, \"부처 눈에는 부처만 보이고 돼지 눈에는 돼지만 보인다\"고 덧붙였다.",
      assertionType: "FACT",
      sourceIds: ["src-sedaily-20261031", "src-asiae-20261031"],
      verified: true,
    },
    {
      id: "claim-mofa",
      text:
        "외교부는 10월 31일 밤 언론 공지에서 \"정상외교의 전체 일정과 실질적인 성과를 고려하지 않은 채 일부 친교·문화교류 장면만을 부각하여 순방의 의미를 평가절하하는 것은 적절하지 않다\"고 밝혔다. " +
        "야권이 문제 삼은 한일 정상의 드럼 연주는 일본 측이 주최국으로 준비한 친교 일정이고, 프랑스 뤼미에르 서밋은 마크롱 대통령 초청으로 공동의장을 맡은 국제회의이며, " +
        "멕시코 K팝 일정은 공공외교 활동이라고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "외교부",
      sourceIds: ["src-nocut-20261031"],
      verified: true,
    },
    {
      id: "claim-ppp-response",
      text:
        "장동혁 국민의힘 대표는 같은 날 페이스북에 \"장병 발목이 날아갔는데도 뉴욕 맨해튼 시내 관광 다닌 사람은 누구? 그 와중에 멕시코까지 가서 부부 동반 야광봉 흔들며 K-POP 구경한 건 또 누구?\"라고 썼다. " +
        "정점식 원내대표는 11월 1일 \"외교가 제대로 풀리고 있다면 국민들은 대통령 부부 해외 순방에 의심의 눈초리를 보내지 않았을 것\"이라고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-nocut-20261031", "src-hani-20261101"],
      verified: true,
    },
    {
      id: "claim-2022-criticism",
      text:
        "이 대통령은 민주당 대표이던 2022년 11월 18일 윤석열 대통령의 동남아 순방을 두고 \"빈손 외교를 넘어 아무런 실익이 없었다\"며 " +
        "\"외교의 기본은 우리나라의 국익을 중심으로 한 실용외교여야 한다\"고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-mbc-20221118"],
      verified: true,
    },
    {
      id: "claim-ppp-double-standard",
      text:
        "국민의힘 최보윤 수석대변인은 \"야당 때는 '혈세 낭비'였던 순방이, 집권하니 '링거 투혼'이라 한다\"고 논평했다. " +
        "전 정부가 정상외교 본예산 약 249억 원과 예비비 약 329억 원을 썼을 때 민주당이 '국회 예산심의권 침해·혈세 낭비'라고 비판했는데, 집권 뒤에는 예비비와 이듬해 본예산을 더 늘렸다는 주장이다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘 최보윤 수석대변인",
      sourceIds: ["src-otd-fnnews-20261101"],
      verified: true,
    },
    {
      id: "claim-dp-rebuttal",
      text:
        "민주당 이용우 대변인은 11월 1일 윤석열 전 대통령의 순방 중 비속어 논란, 김건희 여사의 명품 매장 방문, 엑스포 유치 실패를 들어 당시 예산 비판이 정당했다고 주장했다. " +
        "이재명 정부의 순방 성과로는 한미 상호관세 협상 타결, 핵추진잠수함 건조에 대한 동맹 지지, 전시작전권 전환 협의 진전을 들었다.",
      assertionType: "CLAIM",
      assertedBy: "더불어민주당 이용우 대변인",
      sourceIds: ["src-hani-20261101", "src-otd-fnnews-20261101"],
      verified: true,
    },
    {
      id: "claim-my-wife",
      text:
        "'마이 와이프'는 2026년 6월 16일 프랑스 에비앙에서 열린 G7 정상회의 공식 만찬에서 이 대통령이 트럼프 미국 대통령에게 김혜경 여사를 \"제 아내(My wife)\"라고 소개한 장면이다.",
      assertionType: "FACT",
      sourceIds: ["src-munhwa-20260617"],
      verified: true,
    },
    {
      id: "claim-sikgu",
      text:
        "'우리는 식구다'는 2026년 7월 24일(현지시간) 샌프란시스코에서 젠슨 황 엔비디아 CEO 등 글로벌 IT 경영진·국내 기업 총수들과의 만찬에서 이 대통령이 제안한 건배사다. " +
        "이 대통령은 \"우리나라에서는 가족을 '밥을 같이 먹는 사이'인 식구라고도 한다\"고 설명했고, 황 CEO는 \"위 아 패밀리\"라고 화답했다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20260725"],
      verified: true,
    },
    {
      id: "claim-first-lady-europe",
      text:
        "2026년 6월 유럽 순방에서 김 여사는 이탈리아 국립로마미술대 한복 패션쇼에 참석해 교수·학생을 격려하고, 벨기에에서 유학 중인 음악인과 문화예술계 인사를 만났다고 보도됐다.",
      assertionType: "FACT",
      sourceIds: ["src-munhwa-20260617"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-audit", "claim-ppp-response", "claim-ppp-double-standard"],
  timeline: [
    {
      id: "t-2022",
      date: "2022-11-18",
      datePrecision: "day",
      title: "이재명 대표, 윤석열 대통령 동남아 순방 비판",
      summary: "\"빈손 외교를 넘어 아무런 실익이 없었다\".",
      claimIds: ["claim-2022-criticism"],
    },
    {
      id: "t-audit",
      date: "2026-10-29",
      datePrecision: "day",
      title: "운영위 국정감사에서 순방 횟수·영부인 동행 지적",
      summary: "14차례 23개국.",
      claimIds: ["claim-audit"],
    },
    {
      id: "t-wi",
      date: "2026-10-30",
      datePrecision: "day",
      title: "위성락 안보실장 \"영부인 동행은 관행\"",
      summary: "다자회의 계기가 늘었다고 설명.",
      claimIds: ["claim-wi-first-lady"],
    },
    {
      id: "t-post",
      date: "2026-10-31",
      datePrecision: "day",
      title: "대통령 X 반박, 외교부 언론 공지",
      summary: "'돼지 눈' 발언과 외교부의 일정별 해명.",
      claimIds: ["claim-president-post", "claim-mofa"],
    },
  ],
  gaps: [
    "이 대통령이 야당 대표 시절 전임 대통령 순방을 '놀러 간다'고 표현한 발언은 찾지 못했다. 확인된 것은 2022년 11월 '빈손 외교' 발언이다.",
    "답글이 말한 '식사 태도'가 어느 순방의 어떤 장면인지 특정하지 못했다.",
    "영부인 순방 일정을 누가 어떤 기준으로 짜는지, 순방별 김 여사 단독 일정 전체는 공개 자료로 정리하지 못했다.",
    "국민의힘이 든 전 정부 정상외교 예산(본예산 249억·예비비 329억)과 현 정부 예비비 규모는 예산 원문과 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-sedaily-20261031",
      title: "이재명, 野 순방 비판에 \"돼지 눈에는 돼지만…링거 맞으며 코피 터져\"",
      publisher: "서울경제",
      url: "https://m.news.nate.com/view/20261031n06352",
      publishedAt: "2026-10-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nocut-20261031",
      title: "李대통령 순방 논쟁에…외교부 \"일부 장면만 부각한 평가절하 적절찮다\"",
      publisher: "CBS노컷뉴스",
      url: "https://m.news.nate.com/view/20261031n11568",
      publishedAt: "2026-10-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20261031",
      title: "국민의힘 '잦은 순방' 지적에…李 \"링거 맞고 코피 터지는 해외순방이 놀러?\"",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026103112184744461",
      publishedAt: "2026-10-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hani-20261101",
      title: "민주 \"이 대통령 순방 비판? 전용기에 소주 챙겨간 윤석열은…\"",
      publisher: "한겨레",
      url: "https://m.news.nate.com/view/20261101n11214",
      publishedAt: "2026-11-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-otd-fnnews-20261101",
      title: "李 순방외교 두고 여야 충돌…野 이중 잣대 비판에 與 \"자해 정치\"",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202611011548575541",
      publishedAt: "2026-11-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mbc-20221118",
      title: "이재명 \"대통령 동남아 순방, 빈손 외교 넘어 아무 실익 없어\"",
      publisher: "MBC",
      url: "https://imnews.imbc.com/news/2022/politics/article/6428235_35666.html",
      publishedAt: "2022-11-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-munhwa-20260617",
      title: "이 대통령, 트럼프에 \"마이 와이프\" 김 여사 소개",
      publisher: "문화일보",
      url: "https://www.munhwa.com/article/11596212",
      publishedAt: "2026-06-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-20260725",
      title: "美 샌프란서 열린 '깐부 회동'…李 대통령 \"우리는 식구\"",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10820097",
      publishedAt: "2026-07-25",
      type: "press",
      license: "link-only",
    },
  ],
};
