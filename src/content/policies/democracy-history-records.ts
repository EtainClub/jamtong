import type { PolicyInput } from "./schema";

/**
 * 민주화운동기념관과 국정원 과거사 진상규명.
 *
 * 「어렵게 만든 민주주의를 꼭 지켜냅시다」 등 답글에 "독립기념관처럼 국가 차원의 민주주의 전당을 세우자",
 * "국정원이 국가폭력의 도구로 쓰였으니 고문 피해를 밝혀 달라", "해외에 남은 비공개 기록을 들여와
 * 근현대사를 사실로 바로잡자"는 요청이 달렸다(잼통 Voice). 확인되는 시설과 기록 사업을 적는다.
 *
 * ★ 대통령 글은 words:keep-democracy에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #150, #164, #189.
 */
export const DEMOCRACY_HISTORY_RECORDS: PolicyInput = {
  slug: "democracy-history-records",
  title: "민주화운동기념관·국정원 과거사·해외 기밀문서 공개",
  scope:
    "2025년 6월 옛 남영동 대공분실에 문을 연 민주화운동기념관의 경위·운영·전시, 국정원 과거사 진상규명의 이전 활동, 국사편찬위원회의 해외 기밀문서 확보·공개",
  ministries: ["행정안전부", "국가정보원", "국사편찬위원회"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-hall",
      text: "독립기념관·전쟁기념관처럼 민주주의의 과거와 현재를 담는 국가 차원의 민주주의 전당을 세우자",
      claimIds: ["claim-hall", "claim-hall-exhibit"],
    },
    {
      id: "rumor-nis",
      text: "국정원이 국가폭력의 도구로 쓰여 왔고 개인에 대한 고문 피해가 지금도 이어지고 있으니 밝혀 달라",
      claimIds: ["claim-nis-past"],
    },
    {
      id: "rumor-archives",
      text: "해외에 남은 비공개 기록을 들여와 근현대사를 정치 쟁점이 아닌 사실로 바로잡자",
      claimIds: ["claim-nara"],
    },
  ],
  claims: [
    {
      id: "claim-hall",
      text:
        "옛 남영동 대공분실은 2025년 6월 10일 6·10민주항쟁 기념식과 함께 민주화운동기념관으로 문을 열었다. 2001년 여야 합의로 제정된 " +
        "민주화운동기념사업회법에 따라 추진됐고, 행정안전부 산하 민주화운동기념사업회가 운영한다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20250520"],
      verified: true,
    },
    {
      id: "claim-hall-exhibit",
      text:
        "구관에는 박종철 열사가 고문받은 조사실 등 옛 대공분실 공간이 보존돼 있고, 신관은 4월 혁명부터 6월 항쟁까지 법이 인정하는 11개 " +
        "민주화운동을 다룬다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20250520"],
      verified: true,
    },
    {
      id: "claim-nis-past",
      text:
        "국정원은 노무현 정부 때 시민사회 인사가 참여한 과거사 진실규명위원회를 꾸려 2005년부터 동백림 사건, 김대중 납치사건, 김형욱 실종사건, " +
        "KAL858기 폭파사건, 경향신문 강탈사건 등을 조사했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20050204"],
      verified: true,
    },
    {
      id: "claim-nara",
      text:
        "국사편찬위원회는 2025년 8월 18일 미국 국립문서기록관리청(NARA)이 기밀 해제한 김대중 내란음모 사건 관련 문서 3,150장을 확보해 공개했다. " +
        "카터 대통령이 김대중 사형 집행이 한미 관계를 위협한다고 경고한 친서 초안, 재판이 불공정했다고 본 미 국무부 보고서 등이 들어 있으며 " +
        "국편 전자사료관에서 볼 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-nocut-6386533"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-hall",
      date: "2025-06-10",
      datePrecision: "day",
      title: "민주화운동기념관 개관",
      summary: "옛 남영동 대공분실.",
      claimIds: ["claim-hall"],
    },
  ],
  gaps: [
    "국정원의 2026년 과거사 기록 공개나 새 진상규명 기구 설치 계획은 찾지 못했다.",
    "진실·화해를위한과거사정리위원회의 국정원 관련 2026년 조사 현황은 확인하지 못했다.",
    "국사편찬위원회의 2026년 국외 사료 수집 규모와 새로 공개할 기록 목록은 공식 자료로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newsis-20250520",
      title: "남영동 대공분실, 민주화운동기념관 변모…\"민주주의 산 교육장\"[현장]",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20250520_0003183361",
      publishedAt: "2025-05-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20050204",
      title: "'국정원 과거사' 조사 어떻게",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/200502041822251",
      publishedAt: "2005-02-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nocut-6386533",
      title: "\"김대중 사형 집행, 한미 관계 위협\"…美 기밀문서 공개",
      publisher: "노컷뉴스",
      url: "https://www.nocutnews.co.kr/news/6386533",
      publishedAt: "2025-08-18",
      type: "press",
      license: "link-only",
    },
  ],
};
