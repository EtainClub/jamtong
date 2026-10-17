import type { PolicyInput } from "./schema";

/**
 * 하이브 상장 관련 부정거래 수사 경과.
 *
 * "주가조작 엄벌을 약속했지만 수사 중인 하이브 의장은 그대로이고 정부 인사가
 * 하이브를 찾아가 봐주기가 의심된다"는 답글이 돈다(2026년 10월). 수사는
 * 증선위 고발 → 경찰 구속영장 신청(검찰 반려) → 불구속 송치까지 왔고, 기소
 * 여부는 아직 검찰에 있다. 정부 인사가 하이브를 찾아갔다는 보도는 찾지 못했다.
 * 미국 대사관의 출국금지 해제 요청과 하이브 대표의 총리 참석 만찬 인사는
 * 보도로 확인된다.
 *
 * ★ 방시혁 의장은 피의자다. 기소 전이므로 혐의는 경찰·증선위의 판단으로 적고,
 *   방 의장 측 반론을 나란히 둔다.
 * ★ 부당이득 추정액은 시점마다 다르다 — 수사 중 보도 1,900억원대, 송치 때
 *   경찰 계산 2,631억원. 송치 때 숫자를 쓴다.
 * ★ 2026-10-17 처음 등록 — 잼통 Voice voice-gap 이슈 #40.
 */
export const HYBE_INVESTIGATION: PolicyInput = {
  slug: "hybe-investigation",
  title: "하이브 상장 관련 부정거래 수사 경과",
  scope:
    "방시혁 하이브 의장의 2019년 상장 전 지분 매각 관련 자본시장법 위반 혐의 수사 — 증선위 고발, " +
    "경찰 구속영장 신청·반려, 송치, 미국 대사관 요청·만찬 논란",
  ministries: ["금융위원회", "경찰청", "검찰"],
  categories: ["economy", "institution"],
  asOf: "2026-10-17",
  rumors: [
    {
      id: "rumor-leniency",
      text: "주가조작 엄벌을 약속했지만 수사 중인 하이브 의장은 그대로이고 정부 인사가 하이브를 찾아가 봐주기가 의심된다",
      claimIds: ["claim-referral", "claim-warrant", "claim-sent", "claim-visit-gap", "claim-dinner"],
    },
  ],
  claims: [
    {
      id: "claim-pledge",
      text:
        "이재명 대통령은 2025년 6월 11일 한국거래소 시장감시본부를 찾아 \"대한민국 주식시장에서 장난치다가는 " +
        "패가망신한다는 걸 확실하게 보여주겠다\"고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-sportskhan-20250717"],
      verified: true,
    },
    {
      id: "claim-referral",
      text:
        "금융위원회 증권선물위원회는 2025년 7월 16일 방시혁 하이브 의장과 전 임원 등을 자본시장법상 부정거래 " +
        "금지 위반 혐의로 검찰에 고발·통보했다. 2019년 상장 전 기존 투자자에게 상장 계획이 없다고 속여 " +
        "지인이 세운 사모펀드에 지분을 팔게 하고, 매각 차익 일부를 나누기로 한 계약을 증권신고서에서 " +
        "빠뜨렸다는 혐의다.",
      assertionType: "FACT",
      sourceIds: ["src-sportskhan-20250717"],
      verified: true,
    },
    {
      id: "claim-embassy",
      text:
        "주한 미국대사관은 2026년 4월 출국금지 상태인 방 의장과 이재상 대표 등 하이브 경영진이 7월 4일 " +
        "미국 독립기념일 행사와 BTS 투어를 위해 미국에 갈 수 있게 해 달라는 협조 서한을 경찰청장 " +
        "직무대행에게 전달한 것으로 보도됐다. 경찰 내부에서는 받아들이기 어렵다는 기류였고, 방 의장 측은 " +
        "출국금지 해제를 요청한 적이 없다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20260419", "src-khan-20260421"],
      verified: true,
    },
    {
      id: "claim-warrant",
      text:
        "서울경찰청 금융범죄수사대는 2026년 4월 방 의장에 대해 사기적 부정거래 혐의로 구속영장을 " +
        "신청했다. 서울남부지검은 \"사회적 법익이 침해됐다는 부분을 더 소명하라\"며 이를 반려했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260421", "src-seoul-20260904"],
      verified: true,
    },
    {
      id: "claim-sent",
      text:
        "경찰은 2026년 9월 3일 방 의장 등 하이브 경영진과 사모펀드 관계자 5명을 불구속 상태로 서울남부지검에 " +
        "송치했다. 2024년 12월 내사에 착수한 지 1년 9개월 만이다. 경찰이 계산한 부당이득 2,631억원에 대해 " +
        "기소 전 추징보전을 신청해 법원에서 전액 결정을 받았다. 해외에 있는 김중동 전 CIO는 체포영장을 " +
        "받아 인터폴 적색수배를 요청했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20260903", "src-etoday-20260903", "src-seoul-20260904"],
      verified: true,
    },
    {
      id: "claim-defense",
      text:
        "방 의장 변호인단은 송치 뒤 \"객관적인 자료와 근거를 바탕으로 일관되게 소명해 왔다\"며 \"향후 절차를 " +
        "통해 의혹이 투명하게 해소될 수 있을 것으로 기대한다\"고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "방시혁 의장 변호인단",
      sourceIds: ["src-etoday-20260903"],
      verified: true,
    },
    {
      id: "claim-dinner",
      text:
        "2026년 9월 17일 한국경제인협회가 연 미국 건국 250주년 감사 만찬에 한성숙 국무총리가 참석했고, " +
        "피의자인 이재상 하이브 대표도 초대 명단에 있었다. 하이브는 이 대표가 본행사와 만찬 전 인사만 하고 " +
        "나왔다고 밝혔다. 정부가 하이브를 위해 마련한 자리는 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-topstar-20260918"],
      verified: true,
    },
    {
      id: "claim-visit-gap",
      text:
        "2026년 10월 17일까지 정부 인사가 하이브를 찾아갔다는 보도는 찾지 못했다. 방 의장은 송치 때도 " +
        "'하이브 의장'으로 보도됐고, 기소 전이라 의장직을 법적으로 막을 근거는 없다. 기소 여부는 검찰이 " +
        "정한다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-hankook-20260903", "src-seoul-20260904"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-embassy", "claim-dinner"],
  timeline: [
    {
      id: "t-pledge",
      date: "2025-06-11",
      datePrecision: "day",
      title: "대통령 '주가조작 패가망신' 발언",
      summary: "한국거래소 시장감시본부 방문.",
      claimIds: ["claim-pledge"],
    },
    {
      id: "t-referral",
      date: "2025-07-16",
      datePrecision: "day",
      title: "증선위 고발·통보",
      summary: "자본시장법상 부정거래 혐의.",
      claimIds: ["claim-referral"],
    },
    {
      id: "t-embassy",
      date: "2026-04-19",
      datePrecision: "day",
      title: "미 대사관 협조 서한 보도",
      summary: "출국금지 중인 경영진의 미국행 요청.",
      claimIds: ["claim-embassy"],
    },
    {
      id: "t-warrant",
      date: "2026-04",
      datePrecision: "month",
      title: "구속영장 신청, 검찰 반려",
      summary: "보완 소명 요구.",
      claimIds: ["claim-warrant"],
    },
    {
      id: "t-sent",
      date: "2026-09-03",
      datePrecision: "day",
      title: "불구속 송치",
      summary: "부당이득 2,631억원 추징보전.",
      claimIds: ["claim-sent"],
    },
    {
      id: "t-dinner",
      date: "2026-09-17",
      datePrecision: "day",
      title: "한경협 만찬 논란",
      summary: "총리 참석 만찬에 하이브 대표 초대, 인사만 하고 퇴장.",
      claimIds: ["claim-dinner"],
    },
  ],
  gaps: [
    "검찰의 기소 여부와 보완수사 요구 여부는 2026년 10월 17일 현재 확인하지 못했다.",
    "미국 대사관 서한 원문과 외교부의 공식 대응은 확인하지 못했다.",
    "하이브 이사회가 방 의장의 직무에 대해 어떤 결정을 했는지는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-sportskhan-20250717",
      title: "방시혁·하이브, 이재명 정부 \"패가망신\" 본보기 되나",
      publisher: "스포츠경향",
      url: "https://sports.khan.co.kr/article/202507171127003",
      publishedAt: "2025-07-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankook-20260419",
      title: "[단독] 공식 루트 무시한 美 \"방시혁 미국행 협조해달라\" 경찰에 이례적 요청",
      publisher: "한국일보",
      url: "https://v.daum.net/v/20260419210834257",
      publishedAt: "2026-04-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260421",
      title: "방시혁 의장, 하이브 상장 문제로 결국 구속 기로···미 대사관 측 출금해제 요청이 영향 줬나",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202604211647001",
      publishedAt: "2026-04-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankook-20260903",
      title: "하이브 방시혁 송치 '사기적 부정거래 혐의'… 내사 착수 1년 9개월 만",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026090310390000270",
      publishedAt: "2026-09-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-20260903",
      title: "방시혁 측, '사기적 부정거래' 혐의 검찰 송치에 \"투명한 의혹 해소 기대\"",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2621607",
      publishedAt: "2026-09-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20260904",
      title: "'사기적 부정거래' 혐의 방시혁, 내사 착수 21개월 만에 檢송치",
      publisher: "서울신문",
      url: "https://www.seoul.co.kr/news/society/2026/09/04/20260904008012",
      publishedAt: "2026-09-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-topstar-20260918",
      title: "방시혁과 '부정거래 혐의' 받는 하이브 이재상 대표, 국무총리과 만찬 참석? \"행사 전 인사만 하고 나와\"",
      publisher: "톱스타뉴스",
      url: "https://www.topstarnews.net/news/articleView.html?idxno=16197804",
      publishedAt: "2026-09-18",
      type: "press",
      license: "link-only",
    },
  ],
};
