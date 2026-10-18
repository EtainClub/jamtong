import type { PolicyInput } from "./schema";

/**
 * 검찰개혁에 대한 대통령 발언과 국정과제 비교.
 *
 * "검찰개혁에 대한 대통령의 발언이 후보 때·국무회의·기자회견마다 달라
 * 국정과제(중수청의 행안부 이관)와 어긋나는 것 아닌가"라는 답글이 돈다
 * (2026년 10월). 주장 안에 두 질문이 섞여 있다.
 *   1. 중수청 소속 — 국정과제 원문과 대통령 발언을 날짜순으로 대조하면 된다.
 *   2. 보완수사권 — 발언의 결이 실제로 시기마다 달랐다. 그대로 적는다.
 * 발언이 바뀌었는지는 평가라서 적지 않는다. 날짜와 원문만 나란히 둔다.
 *
 * ★ 출범 이후 상황은 `prosecution-launch`, 법이 정해진 경과는 업적
 *   `prosecution-reform`에 있다. 여기는 말과 문서의 대조만 맡는다.
 * ★ 2026-10-18 처음 등록 — 잼통 Voice voice-gap 이슈 #45.
 */
export const PROSECUTION_REFORM_STATEMENTS: PolicyInput = {
  slug: "prosecution-reform-statements",
  title: "검찰개혁: 대통령 발언과 국정과제 비교",
  scope:
    "중대범죄수사청 소속과 보완수사권에 대한 대통령 발언(2025년 4월~2026년 10월)과 123대 국정과제 문구의 대조",
  ministries: ["청와대", "행정안전부", "법무부"],
  categories: ["institution"],
  asOf: "2026-10-18",
  rumors: [
    {
      id: "rumor-inconsistent",
      text: "검찰개혁 발언이 때마다 달라 국정과제(중수청의 행안부 이관)와 어긋난다",
      claimIds: ["claim-task", "claim-100day", "claim-1005", "claim-supplementary"],
    },
  ],
  claims: [
    {
      id: "claim-task",
      text:
        "2025년 9월 확정된 123대 국정과제 3번 '수사와 기소 분리를 통한 검찰개혁 완성'은 '검찰청을 폐지하고 " +
        "공소청·중수청 신설'을 세부 내용으로 두고, '법무부에 공소제기·유지 업무를 전담하는 공소청을 신설하고, " +
        "종전 검찰청의 중대범죄 수사는 행안부 소속으로 신설하는 중수청이 전담'한다고 적었다.",
      assertionType: "FACT",
      sourceIds: ["src-tasks-123-prosecution", "src-dailian-tasks-20250916"],
      verified: true,
    },
    {
      id: "claim-alileo",
      text:
        "대통령은 2025년 4월 유튜브 '알릴레오'에서 \"법무부 안에 있든 어디에 있든, 수사와 기소 담당 기관을 " +
        "분리해야 한다\"고 말했다. 2026년 10월 이 영상을 다시 공유했다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20261005"],
      verified: true,
    },
    {
      id: "claim-100day",
      text:
        "2025년 9월 11일 취임 100일 기자회견에서 대통령은 중수청을 행안부에 두는 것을 '정치적 결정'이라 하고, " +
        "\"수사·기소를 분리해 법무부에 맡기면 다시 합체될 가능성이 있기 때문에 행안부로 보낸 것\"이라고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-100day-20250912"],
      verified: true,
    },
    {
      id: "claim-1005",
      text:
        "2026년 10월 5일 대통령은 X에 \"이 정부는 수사·기소를 중수청과 공소청으로 분리하되, 법무부와 행안부에 " +
        "따로 배속시키는 것으로 한걸음 더 나갔다\"고 썼다. 10월 6일 국무회의에서도 중수청 소속이 법무부가 " +
        "아니라 행안부로 바뀌었다고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20261005", "src-fnnews-20261006"],
      verified: true,
    },
    {
      id: "claim-supplementary",
      text:
        "보완수사권에 대한 발언은 시기마다 달랐다. 2025년 9월 11일에는 보완수사 문제를 \"최적의 방안을 찾아내고 " +
        "제도와 장치는 거기에 맞게 배치하면 된다\"고 했고, 2026년 1월 21일 신년 기자회견에서는 \"보완수사를 안 " +
        "하는 게 맞다고 생각한다\"면서도 남용 여지를 없앤 예외적 허용을 말했다. 2026년 10월 5일에는 \"수사·기소 " +
        "분리는 보완수사까지 금지될만큼 이제 완성됐다\"고 썼다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-100day-20250912", "src-newstomato-20260121", "src-newsis-20261005"],
      verified: true,
    },
    {
      id: "claim-1016",
      text:
        "2026년 10월 16일 대통령은 중수청에 \"국가적 진통 끝에 출범한 만큼 … 실적과 성과로 존재 의의와 " +
        "필요성을 반드시 증명해 주길 바란다\"고 썼다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20261016"],
      verified: true,
    },
    {
      id: "claim-yoo",
      text:
        "유시민 작가는 2026년 9월 유튜브 방송에서 대통령이 말해 온 검찰개혁 구상을 \"한 번도 들어본 적이 " +
        "없다\"며 \"대통령이 지금까지 국민을 속인 것\"이라고 비판했다. 대통령은 10월 5일 과거 발언 영상과 " +
        "조국 혁신정책연구원장 등의 2024년 발언을 공유하며 반박했다.",
      assertionType: "CLAIM",
      assertedBy: "유시민 작가",
      sourceIds: ["src-weeklykhan-20261005", "src-newsis-20261005"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-alileo",
      date: "2025-04",
      datePrecision: "month",
      title: "후보 시절 '알릴레오' 출연",
      summary: "어디에 두든 수사·기소 기관을 분리해야 한다고 말했다.",
      claimIds: ["claim-alileo"],
    },
    {
      id: "t-100day",
      date: "2025-09-11",
      datePrecision: "day",
      title: "취임 100일 기자회견",
      summary: "중수청 행안부 배치 이유를 설명하고 보완수사는 최적안을 찾자고 했다.",
      claimIds: ["claim-100day", "claim-supplementary"],
    },
    {
      id: "t-task",
      date: "2025-09-16",
      datePrecision: "day",
      title: "123대 국정과제 확정",
      summary: "중수청은 행안부, 공소청은 법무부 소속으로 적었다.",
      claimIds: ["claim-task"],
    },
    {
      id: "t-newyear",
      date: "2026-01-21",
      datePrecision: "day",
      title: "신년 기자회견",
      summary: "보완수사는 원칙적으로 안 하되 예외적 허용을 말했다.",
      claimIds: ["claim-supplementary"],
    },
    {
      id: "t-1005",
      date: "2026-10-05",
      datePrecision: "day",
      title: "X 게시물로 유시민 비판에 반박",
      summary: "중수청·공소청을 행안부·법무부에 따로 둔 것이 한 걸음 더 나간 것이라고 썼다.",
      claimIds: ["claim-1005", "claim-yoo"],
    },
  ],
  critiqueIds: ["claim-yoo", "claim-supplementary"],
  gaps: [
    "2025년 대선 공약집에 중수청 소속을 어떻게 적었는지는 확인하지 못했다. 공약 확인 페이지의 해당 항목은 '수사·기소 분리'까지만 적혀 있다.",
    "추석 기자회견(2026년 9월 18일) 질의응답에서 보완수사권을 어떻게 말했는지는 확인하지 못했다. 모두발언은 '수사 기소 분리가 종착점에 다다르고 있다'는 데까지다.",
    "시행된 법에서 보완수사가 실제로 어디까지 금지됐는지는 법 조문으로 확인하지 못했다. '보완수사까지 금지'는 대통령의 설명이다.",
  ],
  sources: [
    {
      id: "src-tasks-123-prosecution",
      title: "이재명정부 123대 국정과제 — 3. 수사와 기소 분리를 통한 검찰개혁 완성",
      publisher: "대한민국 정부",
      url: "https://www.korea.kr/common/download.do?fileId=145737019",
      publishedAt: "2025-09-16",
      type: "official",
      license: "public",
    },
    {
      id: "src-dailian-tasks-20250916",
      title: "4년 연임제 개헌부터 권력기관 개혁까지…李정부 '123대 국정과제' 확정",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1549698/",
      publishedAt: "2025-09-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-100day-20250912",
      title: "\"구더기 싫다고 장독 없애나\"…'검찰개혁'에 직접 밝힌 입장은 [李대통령 100일 기자회견]",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1547802/",
      publishedAt: "2025-09-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-20260121",
      title: "(신년 회견)\"검찰개혁, 마녀 된 '업보'…보완수사는 예외적 필요\"",
      publisher: "뉴스토마토",
      url: "https://newstomato.com/ReadNews.aspx?no=1288589",
      publishedAt: "2026-01-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20261005",
      title: "이 대통령, 유시민 영상 공유하며 \"檢개혁 이 정부서 한걸음 더 나가\"(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20261005_0003814442",
      publishedAt: "2026-10-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-weeklykhan-20261005",
      title: "이 대통령, 유시민과 찍은 검찰개혁 영상 공유···\"국민 속였다\" 주장 반박",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202610052133001",
      publishedAt: "2026-10-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261006",
      title: "李대통령 \"검찰청 역사속으로…중수청, 여야 없이 범죄 철저 수사\"",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610061029362312",
      publishedAt: "2026-10-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20261016",
      title: "李대통령 \"국가적 진통 끝에 중수청 출범…실적·성과로 필요성 반드시 증명해달라\"",
      publisher: "머니투데이",
      url: "https://mt.co.kr/politics/2026/10/16/2026101615113545239",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
  ],
};
