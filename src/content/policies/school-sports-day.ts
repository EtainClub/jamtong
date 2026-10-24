import type { PolicyInput } from "./schema";

/**
 * 학교 운동회 소음 민원과 학교 체육활동.
 *
 * 대통령이 2026년 10월 22일 초등학교 운동회를 찾고 "아이들의 웃음소리가 마을의
 * 미래"라는 글을 올리자, 답글에 "아파트 소음 민원 눈치 보지 않고 운동회를 열게 해 달라"는
 * 요청이 많이 달렸다(잼통 Voice). 소음 민원 실태와 교육부·국회의 대응을 적는다.
 *
 * ★ 교육부 대책은 방향을 밝힌 단계이고, 소음 규제에서 아동 소리를 빼는 법안은 발의
 *   단계다. 시행된 제도처럼 쓰지 않는다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #66.
 */
export const SCHOOL_SPORTS_DAY: PolicyInput = {
  slug: "school-sports-day",
  title: "학교 운동회 소음 민원과 체육활동 보장",
  scope:
    "학교 운동회·체육활동에 대한 소음 민원 실태, 교육부 장관의 호소와 대응 방향, 아동 활동 소리를 소음 규제에서 " +
    "빼자는 법안, 대통령의 운동회 방문",
  ministries: ["교육부", "기후에너지환경부", "경찰청"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-noise",
      text: "아파트 소음 민원 때문에 눈치 보지 않고 학교 운동장에서 운동회를 마음껏 열 수 있게 해 달라",
      claimIds: ["claim-complaints", "claim-restricted-schools", "claim-minister", "claim-moe-plan", "claim-bill"],
    },
  ],
  claims: [
    {
      id: "claim-complaints",
      text:
        "일부 학교는 운동회 전에 인근 주민에게 미리 사과하고, 한 초등학교에서는 학생들이 운동회 시작 전 " +
        "\"죄송합니다. 저희들 조금만 놀게요\"라고 외치는 영상이 퍼졌다. 개혁신당 천하람 의원실 자료로는 학교 운동회 " +
        "관련 112 신고가 한 해 350건이었고, 이 가운데 345건에 경찰이 현장 출동했다.",
      assertionType: "FACT",
      sourceIds: ["src-sisajournal-20260423", "src-mk-20260504"],
      verified: true,
    },
    {
      id: "claim-restricted-schools",
      text:
        "교육부에 따르면 2026년 3월 기준 방과 후 운동장 축구·야구 등을 제한하는 초등학교는 287곳으로 전체의 " +
        "4.6%다.",
      assertionType: "FACT",
      sourceIds: ["src-sisajournal-20260423"],
      verified: true,
    },
    {
      id: "claim-minister",
      text:
        "최교진 교육부 장관은 2026년 4월 23일 X에 \"아이들의 활기찬 함성이 멈춘 사회엔 미래가 없다\"며 운동회 " +
        "소음에 대한 주민들의 너그러운 이해를 부탁했다.",
      assertionType: "FACT",
      sourceIds: ["src-sisajournal-20260423"],
      verified: true,
    },
    {
      id: "claim-moe-plan",
      text:
        "교육부는 기관 단위 학교민원 대응체계를 정착시키고, 시·도교육청과 함께 체육활동 제한 실태를 살펴 지원을 " +
        "강화하며, 운동회 소음 민원에 따른 경찰 출동 문제는 경찰청 등과 협의하겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "교육부",
      sourceIds: ["src-sisajournal-20260423"],
      verified: true,
    },
    {
      id: "claim-bill",
      text:
        "천하람 의원은 2026년 5월 운동회처럼 어린이·학생 활동에서 나는 소리를 소음·진동관리법의 규제 대상에서 " +
        "빼는 개정안을 냈다. 국회 처리 여부는 2026년 10월 현재 확인되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-mk-20260504"],
      verified: true,
    },
    {
      id: "claim-president-visit",
      text:
        "이재명 대통령은 2026년 10월 22일 전북 익산 왕궁초등학교 가을 운동회에 참여한 뒤, X에 운동회가 \"온 동네가 " +
        "모여 함께 웃고 응원하는 마을의 축제\"였다며 인구 감소로 학교가 문을 닫는 지역이 늘고 있다고 썼다. 소음 " +
        "민원에 대한 대책은 글에 없었다.",
      assertionType: "FACT",
      sourceIds: ["src-x-20261022", "src-segye-20261023"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-minister",
      date: "2026-04-23",
      datePrecision: "day",
      title: "교육부 장관, 운동회 소음 양해 호소",
      summary: "민원 대응체계·경찰 출동 협의 방침.",
      claimIds: ["claim-minister", "claim-moe-plan"],
    },
    {
      id: "t-bill",
      date: "2026-05",
      datePrecision: "month",
      title: "아동 활동 소리 소음 규제 제외 법안 발의",
      summary: "천하람 의원.",
      claimIds: ["claim-bill"],
    },
    {
      id: "t-visit",
      date: "2026-10-22",
      datePrecision: "day",
      title: "대통령, 왕궁초 운동회 참여",
      summary: "\"아이들의 웃음소리가 마을의 미래\".",
      claimIds: ["claim-president-visit"],
    },
  ],
  gaps: [
    "경찰청이 운동회 소음 112 신고 출동 기준을 실제로 바꿨는지는 공식 발표로 확인하지 못했다.",
    "천하람 의원 개정안의 의안번호와 상임위 심사 상태를 의안정보시스템에서 확인하지 못했다.",
    "'일하는 부모가 오지 못하는데 부모 없이 운동회를 연다'는 답글은 학교별 운영 방식에 관한 것으로, 교육부 차원의 기준을 찾지 못해 싣지 않았다.",
  ],
  sources: [
    {
      id: "src-sisajournal-20260423",
      title: "'소음 사죄'로 시작하는 요즘 운동회…교육장관 \"아이들 함성 멈춘 사회 미래 없다\"",
      publisher: "시사저널",
      url: "https://www.sisajournal.com/news/articleView.html?idxno=370710",
      publishedAt: "2026-04-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mk-20260504",
      title: "[단독] 野천하람 \"어린이 목소리, 소음 아니다\"…'운동회 소리' 민원 방지법 발의",
      publisher: "매일경제(네이트 뉴스)",
      url: "https://m.news.nate.com/view/20260504n26510",
      publishedAt: "2026-05-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-x-20261022",
      title: "아이들의 웃음소리가 마을의 미래입니다",
      publisher: "이재명 대통령 X",
      url: "https://x.com/i/status/2113146516097429690",
      publishedAt: "2026-10-22",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-segye-20261023",
      title: "李 대통령, 초등학교 운동회 '깜짝 방문'…\"이겨라\" 응원하고 경기도 참여",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20261023502815",
      publishedAt: "2026-10-23",
      type: "press",
      license: "link-only",
    },
  ],
};
