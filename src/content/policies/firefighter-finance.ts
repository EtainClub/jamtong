import type { PolicyInput } from "./schema";

/**
 * 소방 재정 논란 (2026년 10월): 국가직 전환 뒤 재정 분담, 소방안전교부세, 정치권 발언.
 *
 * 부천 화재로 소방관이 순직한 뒤 대통령의 추모 글(10월 17일) 등에 "경기도지사가 소방을
 * '재정 빨대'라 하고 추모 예산까지 깎았다", "정부가 소방 교부세를 줄였다", "국가직이 됐는데
 * 중앙정부가 왜 부담하지 않나", "소방 예산 2,897억 원을 삭감했다", "여당 의원 '쭉쭉' 발언을
 * 징계하라"는 답글이 많이 달렸다(잼통 Voice). 누가 무엇을 말했고, 돈은 실제로 누가 내는지,
 * 2027년 예산안에서 무엇이 줄었는지 적는다.
 *
 * ★ 2,897억 원은 소방 예산 전체가 아니라 소방안전교부세의 감소분이다. 이 구분을 놓치면
 *   "정부가 소방 예산을 깎았다"와 "소방청 예산은 늘었다"가 서로 거짓말처럼 보인다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #85, #102, #103, #104.
 */
export const FIREFIGHTER_FINANCE: PolicyInput = {
  slug: "firefighter-finance",
  title: "소방 재정 논란 (2026년 10월): 국가직 전환 뒤 재정 분담과 소방안전교부세",
  scope:
    "2020년 소방공무원 국가직 전환 뒤의 재정 분담 구조, 2027년 예산안의 소방안전교부세 감소, 추미애 경기도지사 '재정 빨대'·부승찬 의원 '쭉쭉' 발언과 대응, 부천 화재 뒤 소방청의 조사·안전 대책",
  ministries: ["소방청", "행정안전부", "기획예산처"],
  categories: ["disaster", "economy"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-choo",
      text: "소방을 재정 빨대라고 한 경기도지사가 소방 추모 예산까지 깎았으니 대통령이 문책하거나 바로잡아야 한다",
      claimIds: ["claim-choo", "claim-choo-budget", "claim-structure"],
    },
    {
      id: "rumor-grant-cut",
      text: "정부가 소방 교부세를 줄인 탓이 큰데 경기도지사만 몰아세운다",
      claimIds: ["claim-grant-2027", "claim-structure"],
    },
    {
      id: "rumor-national",
      text: "소방관이 국가직이 됐는데도 인건비·장비 부담을 지자체에 미루고 있으니 중앙정부가 책임지고 집행하라",
      claimIds: ["claim-structure", "claim-share", "claim-gov-response", "claim-bills"],
    },
    {
      id: "rumor-2897",
      text: "대통령이 소방관을 아낀다면서 뒤로는 소방 예산 2,897억 원을 삭감했다",
      claimIds: ["claim-grant-2027", "claim-nfa-budget"],
    },
    {
      id: "rumor-safety",
      text: "소방관의 예산·처우·안전장비와 트라우마 치료를 아끼지 말고, 위험한 현장에는 로봇 투입 같은 대책을 세워 달라",
      claimIds: ["claim-president", "claim-investigation"],
    },
    {
      id: "rumor-audit",
      text: "올해만 여러 명이 순직했으니 장비와 출동·지휘 체계를 감사하고 책임자를 가려 달라",
      claimIds: ["claim-investigation"],
    },
    {
      id: "rumor-boo",
      text: "여당 의원들이 국정감사에서 소방 재정을 깎아내리는 발언을 했는데 당 차원의 징계와 사과가 필요하다",
      claimIds: ["claim-boo", "claim-boo-response"],
    },
  ],
  claims: [
    {
      id: "claim-structure",
      text:
        "소방공무원은 2020년 4월 1일 국가직으로 바뀌었지만, 지방자치법과 지방재정법상 소방 업무는 여전히 시·도 " +
        "사무이고 경비도 시·도가 부담한다. 국가가 인건비를 직접 부담하는 장치는 없고, 담배 개별소비세에서 떼는 " +
        "소방안전교부세로 일부를 지원한다. 소방 예산의 약 90%를 지방이 낸다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-20261020"],
      verified: true,
    },
    {
      id: "claim-share",
      text:
        "국회입법조사처(2026년 1월 보고서)에 따르면 소방 예산 중 국비 비중은 2019년 7%에서 2021년 14.9%로 올랐다가 " +
        "2025년 10.7%로 떨어졌다. 2025년 소방공무원 인건비 6조 3,632억 원 가운데 소방안전교부세로 지원된 것은 " +
        "5,476억 원(8.6%)이다. 경기도 소방 인건비는 2021년 8,041억 원에서 2026년 1조 1,973억 원으로 늘었는데, 국비 " +
        "증가는 19억 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-20261020"],
      verified: true,
    },
    {
      id: "claim-grant-2027",
      text:
        "정부 2027년도 예산안에서 소방안전교부세는 7,605억 원으로 2026년(1조 502억 원)보다 2,897억 원(27.6%) 줄었다. " +
        "교부세는 담배 개별소비세 수입의 45%로 정해져 있어 담배 판매가 줄면 함께 줄고, 2026년에 들어 있던 추가 " +
        "정산분 1,100억 원이 빠진 영향도 있다고 기획예산처는 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-nocut-6594492", "src-newstomato-20261020"],
      verified: true,
    },
    {
      id: "claim-nfa-budget",
      text:
        "같은 예산안에서 중앙 소방청 예산은 3,713억 원으로 2026년보다 10.3% 늘었다. '2,897억 원 삭감'은 소방청 " +
        "예산이 아니라 시·도에 내려보내는 소방안전교부세의 감소분이다.",
      assertionType: "FACT",
      sourceIds: ["src-nocut-6594492"],
      verified: true,
    },
    {
      id: "claim-gov-response",
      text:
        "박홍근 기획예산처 장관은 10월 21일 소방 재정 보완 필요성에 공감한다며 국회 예산 심의에서 논의하겠다고 " +
        "했다. 국회는 12월 2일까지 2027년 예산안을 의결해야 한다.",
      assertionType: "CLAIM",
      assertedBy: "기획예산처",
      sourceIds: ["src-mtn-20261021"],
      verified: true,
    },
    {
      id: "claim-bills",
      text:
        "국민의힘 김재섭 의원은 소방공무원 인건비 일부를 국가 일반회계에서 지원하도록 소방재정지원 및 시·도 소방 " +
        "특별회계 설치법 개정안을 냈다. 민주당 조계원 대변인은 국비 비율이 10%에 그치는 부분에 대해 법 개정을 " +
        "검토하겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-20261020", "src-yonhap-20261020"],
      verified: true,
    },
    {
      id: "claim-choo",
      text:
        "추미애 경기도지사는 10월 13일 국회 행정안전위원회의 경기도 국정감사에서 \"소방이 가장 큰 골치 아픈 재정 " +
        "빨대 같다\"고 말했다. 경기도는 국가직 전환에도 재정 대부분을 지자체가 부담하고 국고 지원 비율이 줄어드는 " +
        "점을 강조하려던 취지라고 해명했고, 추 지사와 민주당은 이후 사과했다.",
      assertionType: "FACT",
      sourceIds: ["src-imaeil-20261016", "src-newstomato-20261020"],
      verified: true,
    },
    {
      id: "claim-choo-budget",
      text:
        "국민의힘 경기도당은 경기도가 추가경정예산에서 순직 소방공무원 추모행사 예산 1억 원을 전액 깎고, 소방차량 " +
        "보강 예산 26억 5천만 원을 줄여 구매 계획을 103대에서 78대로 축소했다고 주장했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘 경기도당",
      sourceIds: ["src-imaeil-20261016"],
      verified: true,
    },
    {
      id: "claim-boo",
      text:
        "더불어민주당 부승찬 의원은 10월 19일 경기도 국정감사에서 추 지사의 발언을 옹호하는 취지로 소방 예산이 " +
        "재정을 \"쭉쭉 빨아먹는다\"고 말했다. 순직 소방관의 영결식이 열린 날이었다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20261020", "src-weeklykhan-20261019"],
      verified: true,
    },
    {
      id: "claim-boo-response",
      text:
        "부 의원은 10월 20일 SNS에서 \"마음의 상처를 입은 소방공무원과 국민께 진심으로 사과드린다\"고 했다. 김민석 " +
        "민주당 대표는 직권으로 경고하고 적정한 기구에서 조사하기로 했다고 밝혔다. 국민의힘은 두 사람에게 당 차원의 " +
        "최고 수위 징계를 요구하고 '소방관 헌신 예우 TF'를 꾸리기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20261020", "src-yonhap-20261020"],
      verified: true,
    },
    {
      id: "claim-president",
      text:
        "이재명 대통령은 10월 17일 순직 소방관을 추모하며 현장 대원들이 안전하게 임무를 수행하도록 안전대책을 " +
        "철저히 점검하고 부족한 부분을 보완하겠다고 했고, 예우와 처우를 세심히 살피겠다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-ytn-20261017"],
      verified: true,
    },
    {
      id: "claim-investigation",
      text:
        "소방청은 10월 20일부터 30일간 소방합동조사단을 운영해 최초 상황 접수부터 현장 지휘·화재진압·인명구조까지 " +
        "대응 전반을 조사하고, 현장 진입·진압 판단의 적절성, 위험정보 공유, 지휘체계 작동을 살핀다고 밝혔다. 지휘관 " +
        "교육은 소방준감·소방정·소방령 1,760명이 2027년 1분기까지, 소방경 6,000명이 2028년까지 이수하는 것을 " +
        "목표로 한다.",
      assertionType: "CLAIM",
      assertedBy: "소방청",
      sourceIds: ["src-nfa-20261020"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "국비 비중이 10%대에 머물고 교부세가 담배 판매에 묶여 있는 한, 국가직 전환은 신분만 바꾼 '불완전한 국가직화'라는 " +
        "지적이 이어진다. 반대로 기획예산처는 소방이 지방 사무이므로 지방정부가 재정을 부담해야 한다는 입장을 " +
        "국회입법조사처 보고서에서 밝힌 바 있다.",
      assertionType: "OPINION",
      sourceIds: ["src-newstomato-20261020"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-share", "claim-critique"],
  timeline: [
    {
      id: "t-national",
      date: "2020-04-01",
      datePrecision: "day",
      title: "소방공무원 국가직 전환",
      summary: "사무와 경비는 여전히 시·도.",
      claimIds: ["claim-structure"],
    },
    {
      id: "t-choo",
      date: "2026-10-13",
      datePrecision: "day",
      title: "추미애 지사 '재정 빨대' 발언",
      summary: "경기도 국정감사.",
      claimIds: ["claim-choo"],
    },
    {
      id: "t-fire",
      date: "2026-10-16",
      datePrecision: "day",
      title: "부천 공장 화재, 소방관 순직",
      summary: "대통령 다음 날 추모 글.",
      claimIds: ["claim-president"],
    },
    {
      id: "t-boo",
      date: "2026-10-19",
      datePrecision: "day",
      title: "부승찬 의원 '쭉쭉' 발언, 다음 날 사과",
      summary: "민주당 대표 직권 경고.",
      claimIds: ["claim-boo", "claim-boo-response"],
    },
    {
      id: "t-investigation",
      date: "2026-10-20",
      datePrecision: "day",
      title: "소방합동조사단 30일 운영",
      summary: "대응 과정 전반 조사.",
      claimIds: ["claim-investigation"],
    },
    {
      id: "t-pbo",
      date: "2026-10-21",
      datePrecision: "day",
      title: "기획예산처 \"소방 재정 보완 공감\"",
      summary: "국회 심의에서 논의.",
      claimIds: ["claim-gov-response"],
    },
  ],
  gaps: [
    "경기도의 추모행사 예산 전액 삭감과 소방차 구매 축소는 국민의힘 경기도당의 주장으로만 확인했다. 경기도 추경안 원문과 경기도의 예산 설명은 대조하지 못했다.",
    "소방합동조사단의 조사 결과는 아직 나오지 않았다.",
    "소방관 트라우마 치료, 진압 로봇 등 장비 도입에 관한 새 정부 대책은 찾지 못했다.",
    "민주당 윤리심판원 조사 결과는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newstomato-20261020",
      title: "'소방 빨대' 논란 뒤엔…국가직 6년, 돈은 여전히 지방",
      publisher: "뉴스토마토",
      url: "https://newstomato.com/ReadNews.aspx?no=1317382",
      publishedAt: "2026-10-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nocut-6594492",
      title: "무늬만 국가직, 월급은 지방 몫…갈수록 태산인 소방 재정",
      publisher: "노컷뉴스",
      url: "https://nocutnews.co.kr/news/6594492",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20261021",
      title: "박홍근 \"소방 재정 보완 필요성 공감…국회에서 논의\"",
      publisher: "머니투데이방송",
      url: "https://news.mtn.co.kr/article/2026102115535458734",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-yonhap-20261020",
      title: "국힘 \"與, 추미애 '빨대' 부승찬 '쭉쭉' 망언 최고징계해야\"(종합)",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1427122",
      publishedAt: "2026-10-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-imaeil-20261016",
      title: "'빨대'라더니…국힘 \"추미애의 경기도, 소방차 구매 축소·추모 예산 삭감\"",
      publisher: "매일신문",
      url: "https://www.imaeil.com/page/view/2026101622002394456",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20261020",
      title: "부승찬, '소방 쭉쭉 발언' 사과...지도부도 고개 숙여",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202610201611156982",
      publishedAt: "2026-10-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-weeklykhan-20261019",
      title: "이번엔 부승찬 \"소방 예산, 재정을 진짜 쭉쭉 빨아먹어\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202610191828001",
      publishedAt: "2026-10-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20261017",
      title: "이 대통령, '부천 화재' 순직 소방관 명복 빌어...정치권도 애도",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202610171607179639",
      publishedAt: "2026-10-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nfa-20261020",
      title: "(설명자료) 소방청은 철저한 사고 원인 조사와 현장 지휘역량 강화를 통해 소방대원의 안전 확보에 최선을 다하겠습니다.",
      publisher: "소방청",
      url: "https://m.korea.kr/briefing/actuallyView.do?newsId=148973976",
      publishedAt: "2026-10-20",
      type: "official",
      license: "public",
    },
  ],
};
