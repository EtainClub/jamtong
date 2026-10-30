import type { PolicyInput } from "./schema";

/**
 * 봉화 'K-베트남 밸리' 특구(3,476억 원): 해외 원조가 아닌 국내 지역특구 사업.
 *
 * 대통령 X 글(10월 28·29일) 답글에 "한국 국민 세금으로 베트남에 마을을 만들어 주는 게
 * 정상인가", "세금 3,476억 원을 들여 베트남에 단지를 짓는 사업은 막아야 한다"는 말이 달렸다
 * (잼통 Voice). 잼통 Voice는 이를 '해외 개발협력 사업'으로 분류했지만, 3,476억 원은 경북
 * 봉화군 안에 짓는 지역특화발전특구 사업의 총사업비다. 사업이 무엇이고 누가 돈을 내는지 적는다.
 *
 * ★ 이 사업은 베트남 땅에 짓는 것이 아니다. 베트남과 관련된 역사(고려 때 이주한 리 왕조
 *   왕자 이용상)를 소재로 한 국내 관광·교류 단지다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #112.
 */
export const BONGHWA_VIETNAM_VALLEY: PolicyInput = {
  slug: "bonghwa-vietnam-valley",
  title: "봉화 'K-베트남 밸리' 특구(3,476억 원): 국내 지역특구 사업",
  scope:
    "경북 봉화군 'K-베트남 밸리' 지역특화발전특구의 지정 경위, 총사업비 3,476억 원의 재원 구성, 사업 내용과 규제특례, 폐지 국민동의청원, 한국의 대베트남 개발협력 차관과의 구분",
  ministries: ["중소벤처기업부", "경상북도", "봉화군"],
  categories: ["region"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-village",
      text: "베트남에 한국 국민 세금으로 마을을 만들어 주는 게 정상인가",
      claimIds: ["claim-location", "claim-content"],
    },
    {
      id: "rumor-3476",
      text: "세금 3,476억 원을 들여 베트남에 단지를 짓는 사업은 한국에 필요 없으니 막아야 한다",
      claimIds: ["claim-location", "claim-budget", "claim-petition", "claim-oda"],
    },
  ],
  claims: [
    {
      id: "claim-location",
      text:
        "3,476억 원은 경북 봉화군 봉성면 창평리 일원(87만 7,372㎡)에 2026~2030년 조성하는 'K-베트남 밸리' 지역특화발전" +
        "특구의 총사업비다. 베트남 땅에 짓는 사업이 아니다. 중소벤처기업부가 2026년 8월 6일 제60차 지역특화발전특구위원회에서 " +
        "신규 특구로 지정했다.",
      assertionType: "FACT",
      sourceIds: ["src-genews-20261030", "src-shinailbo-5049463"],
      verified: true,
    },
    {
      id: "claim-content",
      text:
        "고려시대 베트남 리 왕조 왕자 이용상의 한반도 이주 역사와 화산 이씨 집성촌을 관광·국제교류 자원으로 삼는다. 베트남" +
        "문화원, 한·베 역사문화체험관, 문화거리, 숙박·체험시설, 이주단지가 핵심이고, 창평저수지 관광개발·임대형 스마트팜 등 " +
        "7개 사업이 연계된다. 출입국관리·토지이용·국공유재산·주택공급 분야 규제특례 10건이 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-genews-20261030"],
      verified: true,
    },
    {
      id: "claim-budget",
      text:
        "총사업비 3,476억 원에는 이미 투자된 1,127억 원이 포함돼 있다. 재원은 봉화군비 1,701억 원(48.9%), 국비 1,051억 원, " +
        "경북도비 277억 원, 민간투자 447억 원이다. 봉화군은 신규 사업과 기존 조성사업·연계사업을 특구로 묶어 전체 투자계획을 " +
        "구성했다고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-genews-20261030"],
      verified: true,
    },
    {
      id: "claim-petition",
      text:
        "특구 지정과 사업 폐지를 요구하는 국회 국민동의청원이 10월 1일 공개돼 29일 기준 약 3만 2천 명이 동의했다(동의 기간 " +
        "31일까지). 청원인은 경제성과 재정 부담을 엄격히 검증하고 청년 일자리·주거·의료·교통 등과 예산 우선순위를 다시 " +
        "따지라고 요구했다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-6336291", "src-genews-20261030"],
      verified: true,
    },
    {
      id: "claim-oda",
      text:
        "이와 별개로 한국은 수출입은행의 대외경제협력기금(EDCF)과 경제발전촉진기금(EDPF)으로 베트남에 개발협력 차관을 " +
        "제공해 왔고, 2024~2030년 두 기금의 대출 협정 규모는 40억 달러다. 차관은 갚아야 하는 돈으로, 봉화 특구 사업비와는 " +
        "관련이 없다.",
      assertionType: "FACT",
      sourceIds: ["src-vir-oda"],
      verified: false,
    },
    {
      id: "claim-critique",
      text:
        "군비가 국비와 도비를 합친 1,328억 원보다 373억 원 많아 인구가 적은 군의 재정 부담이 크다는 지적이 나왔다. 외국인 " +
        "체류와 주택 공급 관련 규제특례도 쟁점이다.",
      assertionType: "OPINION",
      sourceIds: ["src-genews-20261030", "src-asiae-20261029"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-designate",
      date: "2026-08-06",
      datePrecision: "day",
      title: "중기부, K-베트남 밸리 특구 지정",
      summary: "제60차 지역특화발전특구위원회.",
      claimIds: ["claim-location"],
    },
    {
      id: "t-petition",
      date: "2026-10-01",
      datePrecision: "day",
      title: "사업 폐지 국민동의청원 공개",
      summary: "29일 기준 약 3만 2천 명 동의.",
      claimIds: ["claim-petition"],
    },
  ],
  gaps: [
    "봉화군의 공식 해명(경제성 분석, 기대 효과)은 찾지 못했다.",
    "국비 1,051억 원이 어느 부처 사업에서 나오는지는 확인하지 못했다.",
    "청원 동의 기간이 끝난 뒤 국회 심사 여부는 아직 알 수 없다.",
  ],
  sources: [
    {
      id: "src-genews-20261030",
      title: "[기획취재 ①] 봉화 'K-베트남 밸리' 예산 3476억…군비 1701억 부담 논란",
      publisher: "글로벌이코노믹",
      url: "https://www.g-enews.com/article/General-News/2026/10/202610300840033627d9ce08d08_1",
      publishedAt: "2026-10-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-shinailbo-5049463",
      title: "봉화 'K-베트남 밸리' 지역특화발전특구 지정…3476억 규모 사업 추진",
      publisher: "신아일보",
      url: "https://www.shinailbo.co.kr/news/articleView.html?idxno=5049463",
      publishedAt: "2026-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-6336291",
      title: "봉화 'K-베트남 밸리 특구' 사업 폐지 국민 청원…3만2000명 동의",
      publisher: "뉴스1",
      url: "https://www.news1.kr/local/daegu-gyeongbuk/6336291",
      publishedAt: "2026-10-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20261029",
      title: "\"세금 3천억으로 베트남 마을?\"…봉화 'K-베트남 밸리' 폐지 청원에 3만명 몰렸다",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026102908130104798",
      publishedAt: "2026-10-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-vir-oda",
      title: "Vietnam and South Korea discuss ODA loans for priority infrastructure projects",
      publisher: "Vietnam Investment Review",
      url: "https://vir.com.vn/vietnam-and-south-korea-discuss-oda-loans-for-priority-infrastructure-projects-160541.html",
      publishedAt: "2026-09",
      type: "press",
      license: "link-only",
    },
  ],
};
