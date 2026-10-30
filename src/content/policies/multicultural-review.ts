import type { PolicyInput } from "./schema";

/**
 * 다문화가족 우대 제도 점검과 대입 다문화 전형·결혼이민 귀화 요건.
 *
 * 대통령이 10월 28~29일 X에 다문화가족 우대 제도의 '과잉'을 검토하겠다는 글을 올리자
 * "극우 정치에 올라탄다", "지원 자체를 없애라", "구체적인 조정안을 내라", "대학 다문화
 * 전형을 없애라", "국제결혼 귀화 심사를 강화하라"는 답글이 달렸다(잼통 Voice). 대통령이
 * 무엇을 검토하겠다고 했는지, 대입 다문화 전형과 결혼이민자 귀화 요건이 지금 어떤지 적는다.
 *
 * ★ 어린이집 입소 순위는 policy:daycare-priority에 따로 있다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #84, #91, #98.
 */
export const MULTICULTURAL_REVIEW: PolicyInput = {
  slug: "multicultural-review",
  title: "다문화가족 우대 제도 점검과 대입 다문화 전형·결혼이민 귀화 요건",
  scope:
    "2026년 10월 대통령의 다문화가족 우대 제도 검토 발언, 서울형 안심 산후조리원 순위 논란, 대입 다문화가정 자녀 전형의 운영 방식, 결혼이민자 간이귀화 요건",
  ministries: ["성평등가족부", "교육부", "법무부"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-farright",
      text: "다문화 특혜를 문제 삼는 것은 이주민 혐오에 올라타는 극우 정치와 다르지 않다",
      claimIds: ["claim-post-1029", "claim-critique"],
    },
    {
      id: "rumor-abolish",
      text: "다문화·외국인 대상 지원 자체를 없애고 이주민 수용은 엄격히 제한해야 한다",
      claimIds: ["claim-post-1029"],
    },
    {
      id: "rumor-concrete",
      text: "과잉을 시정하겠다는 말만 하지 말고 다문화 예산을 어떻게 조정할지 구체적인 정책으로 보여 달라",
      claimIds: ["claim-post-1028", "claim-not-yet"],
    },
    {
      id: "rumor-college",
      text: "대학 다문화 전형은 낮은 성적으로도 명문대에 가게 해 일반 학생에게 불공정하니 없애야 한다",
      claimIds: ["claim-college", "claim-college-count"],
    },
    {
      id: "rumor-naturalization",
      text: "국제결혼을 이용한 국적 취득 악용을 막도록 심사를 강화해 달라",
      claimIds: ["claim-naturalization"],
    },
  ],
  claims: [
    {
      id: "claim-post-1028",
      text:
        "이재명 대통령은 2026년 10월 28일 X에, 서울형 안심 산후조리원 입실 순위에서 다문화가족 산모가 국가유공자 " +
        "산모와 같은 2순위인 점을 문제 삼은 온라인 커뮤니티 글을 공유했다. \"서울시 등 지방정부들이 다문화가족을 " +
        "우대하는 제도가 문제가 되고 있다\"며 우대 필요성과 폐지 여부를 \"지방정부와 협의는 물론 시행령 개정까지 " +
        "포함해 깊이 검토해 보겠다\"고 썼다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-wikitree-20261028", "src-koreancenter-1028"],
      verified: true,
    },
    {
      id: "claim-post-1029",
      text:
        "이튿날 X 글에서는 \"다문화가정이 내국인가정에 비해 차별받지 않도록 하는 것은 필요한 정책이고 당연히 " +
        "계속되어야 합니다\"라고 하면서, 일부 정책이 특혜나 역차별에 이르러서는 안 된다고 했다. 과잉을 시정하는 것이 " +
        "\"다문화가정에 대한 일반적 차별이나 혐오유발조치로 오인되어서는 안될 것\"이라고 덧붙였다. 지원 자체를 " +
        "없애겠다는 말은 하지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-x-20261029"],
      verified: true,
    },
    {
      id: "claim-not-yet",
      text:
        "10월 30일 현재 대통령이 밝힌 것은 '검토하겠다'까지다. 어떤 제도를 어떻게 바꿀지, 다문화 예산을 얼마나 " +
        "조정할지에 대한 정부 발표는 나오지 않았다. 지방정부 자체 사업의 순위 기준은 해당 지방정부가 정한다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-20261028"],
      verified: true,
    },
    {
      id: "claim-college",
      text:
        "대입에서 다문화가정 자녀 전형은 대개 고른기회·사회통합·사회적배려대상자 전형 안에 하나의 지원 자격으로 " +
        "들어 있다. 대학마다 지원 자격(부모의 국적, 출생지, 가족관계 등)과 모집 인원이 다르며, 일부 대학은 다문화가정 " +
        "자녀만 따로 모집한다.",
      assertionType: "FACT",
      sourceIds: ["src-kci-selective", "src-sstimes-2022"],
      verified: false,
    },
    {
      id: "claim-college-count",
      text:
        "2022학년도 수시 기준으로 일반대학 60곳이 다문화가정 자녀가 지원할 수 있는 전형으로 2,201명을 뽑는 것으로 " +
        "집계됐다. 이 인원은 다문화가정 자녀만이 아니라 같은 전형의 다른 자격자와 함께 뽑는 경우가 많다.",
      assertionType: "FACT",
      sourceIds: ["src-sstimes-2022"],
      verified: false,
    },
    {
      id: "claim-naturalization",
      text:
        "국적법 제6조 제2항에 따라 한국인과 결혼한 외국인은 혼인 상태로 국내에 2년 이상 살았거나, 혼인 후 3년이 " +
        "지나고 국내에 1년 이상 살았으면 간이귀화를 신청할 수 있다. 귀화는 신청만으로 되는 것이 아니라 법무부 " +
        "심사(품행·생계유지 능력·기본 소양 등)를 거쳐 허가된다.",
      assertionType: "FACT",
      sourceIds: ["src-law-nationality"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "대통령이 공유한 글이 보수 성향 커뮤니티 에펨코리아의 게시물이라는 점과, 같은 시기 외국인 노동자 관련 " +
        "발언을 두고 범진보 진영에서 비판이 나왔다. 반면 대통령은 \"누가 그 문제를 지적하였는지에 따라 문제의 본질이 " +
        "달라지는 것도 아니\"라고 했다.",
      assertionType: "OPINION",
      sourceIds: ["src-koreancenter-1028", "src-nocut-6598811", "src-x-20261029"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-1028",
      date: "2026-10-28",
      datePrecision: "day",
      title: "대통령, 다문화 우대 제도 검토 언급",
      summary: "서울형 안심 산후조리원 순위 글 공유.",
      claimIds: ["claim-post-1028"],
    },
    {
      id: "t-1029",
      date: "2026-10-29",
      datePrecision: "day",
      title: "\"차별 금지는 계속, 과잉은 시정\"",
      summary: "혐오 조치로 오인돼선 안 된다고 덧붙였다.",
      claimIds: ["claim-post-1029"],
    },
  ],
  gaps: [
    "2027학년도 대입에서 다문화가정 자녀 전형을 운영하는 대학 수와 모집 인원, 합격자 성적은 찾지 못했다. 2022학년도 집계만 확인했다.",
    "'다문화 우대 법안을 대통령이 만들었다'는 답글은 어느 법안을 가리키는지 확인할 수 없어 다루지 않는다.",
    "결혼이민자 귀화 심사를 강화하는 법무부의 최근 방침은 찾지 못했다.",
    "중앙정부의 다문화가족 지원 예산 규모는 이 페이지에서 정리하지 못했다.",
  ],
  sources: [
    {
      id: "src-wikitree-20261028",
      title: "민심 좋아질 수 있을까…이 대통령이 \"폐지 필요한지 검토하겠다\"고 밝힌 내용",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1169961",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-koreancenter-1028",
      title: "다문화산모 우대 비판한 보수성향 '에펨코리아' 글 공유…\"좋은 지적 감사\"",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1431203",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-x-20261029",
      title: "이재명 X 글 (다문화가정 정책의 과잉 시정)",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2115615868520718385",
      publishedAt: "2026-10-29",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-nocut-6598811",
      title: "李 '외노자·다문화' 발언 논란 증폭…범진보 \"망언\" 맹폭",
      publisher: "노컷뉴스",
      url: "https://nocutnews.co.kr/news/6598811",
      publishedAt: "2026-10-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kci-selective",
      title: "'다문화학생' 대상 대학입학 특별전형에서 나타나는 선별적 통합",
      publisher: "한국학술지인용색인(KCI)",
      url: "https://dspace.kci.go.kr/handle/kci/2134906",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-sstimes-2022",
      title: "2022학년도 수시, '다문화가정자녀전형'의 이해",
      publisher: "서산시대",
      url: "http://www.sstimes.kr/news/articleView.html?idxno=26202",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-law-nationality",
      title: "국적법 제6조(간이귀화 요건)",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B5%AD%EC%A0%81%EB%B2%95/%EC%A0%9C6%EC%A1%B0",
      type: "legislative",
      license: "public",
    },
  ],
};
