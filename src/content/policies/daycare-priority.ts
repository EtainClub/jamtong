import type { PolicyInput } from "./schema";

/**
 * 어린이집 입소 우선순위와 다문화가족.
 *
 * 대통령 X 게시물 답글에 "다문화 가정 혜택에 밀려 한국 아이들과 부모가 우선순위에서
 * 밀린다"는 말이 달렸다(잼통 Voice). 같은 시기 국공립 어린이집 입소 1순위를 둘러싼 '역차별'
 * 보도가 있었다. 법정 우선순위가 실제로 어떻게 정해져 있는지 적는다.
 *
 * ★ 다문화가족 영유아가 1순위인 것은 사실이다. 그러나 1순위에는 맞벌이·다자녀·한부모·
 *   저소득 가정도 함께 들어 있고, 다문화가족 자녀 상당수는 한국 국적이다. 우대가 옳은지는
 *   평가라서 양쪽 의견을 함께 싣는다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #73.
 */
export const DAYCARE_PRIORITY: PolicyInput = {
  slug: "daycare-priority",
  title: "어린이집 입소 우선순위와 다문화가족",
  scope: "영유아보육법상 어린이집 입소 1·2순위, 다문화가족의 정의, 우선순위를 둘러싼 '역차별' 논란과 입소 대기 현황",
  ministries: ["교육부", "성평등가족부"],
  categories: ["welfare"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-pushed-back",
      text: "다문화 가정 혜택에 밀려 한국 아이들과 부모가 우선순위에서 밀린다",
      claimIds: ["claim-first-rank", "claim-definition", "claim-wait", "claim-reverse-critique", "claim-counter"],
    },
  ],
  claims: [
    {
      id: "claim-first-rank",
      text:
        "영유아보육법 제28조와 시행규칙 제29조에 따른 어린이집 입소 1순위는 기초생활수급자, 한부모가족, 차상위계층, " +
        "중증 장애인 가족, 맞벌이(취업·취업준비) 가정, 다문화가족, 국가유공자(전몰·순직·상이자), 자녀 2명 이상 가구, " +
        "임신부, 북한이탈주민 가정 등의 영유아다. 다문화가족만 따로 앞세운 것이 아니라 여러 1순위 가운데 하나다.",
      assertionType: "FACT",
      sourceIds: ["src-childcare-priority"],
      verified: true,
    },
    {
      id: "claim-definition",
      text:
        "다문화가족은 다문화가족지원법 제2조 제1호에 따라 결혼이민자나 귀화자와 한국 국적자로 이루어진 가족을 말한다. " +
        "그래서 다문화가족 자녀는 한국 국적인 경우가 많다.",
      assertionType: "FACT",
      sourceIds: ["src-childcare-priority", "src-edaily-20261022"],
      verified: true,
    },
    {
      id: "claim-wait",
      text:
        "교육부 자료(서범수 국민의힘 의원실 공개)로 전국 어린이집 평균 입소 대기는 2026년 6월 말 7.5개월이고, " +
        "국공립 1세반은 2022년 7.9개월에서 10.6개월로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-edaily-20261022"],
      verified: true,
    },
    {
      id: "claim-reverse-critique",
      text:
        "다문화가족 자녀는 소득 심사 없이 1순위가 된다. 성평등가족부 실태조사에서 월소득 300만 원 이상 다문화가족은 " +
        "2009년 9.6%에서 2024년 65.8%로 늘었다. 윤인진 고려대 교수는 소득·재산 등 누구에게나 적용되는 보편적 " +
        "기준으로 지원 대상을 정해야 국민 공감을 얻을 수 있다고 주장했다.",
      assertionType: "OPINION",
      sourceIds: ["src-edaily-20261022"],
      verified: true,
    },
    {
      id: "claim-counter",
      text:
        "반대로 다문화가족이 여전히 언어·교육 환경에서 어려움을 겪는 소수자이므로 일정한 우대는 유지해야 한다는 " +
        "의견도 있다. 한 베트남 출신 학부모는 집 앞 국공립 어린이집에 두 번 떨어져 버스로 30분 거리 시설에 다닌다며 " +
        "특혜를 받는다는 시선이 억울하다고 했다.",
      assertionType: "OPINION",
      sourceIds: ["src-edaily-20261022"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-reverse-critique"],
  timeline: [
    {
      id: "t-debate",
      date: "2026-10-22",
      datePrecision: "day",
      title: "국공립 어린이집 다문화 1순위 '역차별' 논란 보도",
      summary: "입소 대기 7.5개월.",
      claimIds: ["claim-wait", "claim-reverse-critique", "claim-counter"],
    },
  ],
  gaps: [
    "같은 1순위 안에서 다문화가족에 가점이 따로 붙는지, 순번을 어떻게 정하는지 전국 공통 기준은 확인하지 못했다(지자체·어린이집마다 다르다는 안내만 있다).",
    "정부(교육부·성평등가족부)가 우선순위 기준 개편을 검토하는지는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-childcare-priority",
      title: "어린이집 입소순위",
      publisher: "중앙육아종합지원센터",
      url: "https://central.childcare.go.kr/lcentral/d1_40000/d1_60046/d1_40013/d1_40020.jsp",
      type: "official",
      license: "public",
    },
    {
      id: "src-edaily-20261022",
      title: "\"다문화 가정 1순위\" 어린이집 입소 순번 '역차별' 논란",
      publisher: "이데일리",
      url: "https://www.edaily.co.kr/News/Read?newsId=03952406645615544&mediaCodeNo=257",
      publishedAt: "2026-10-22",
      type: "press",
      license: "link-only",
    },
  ],
};
