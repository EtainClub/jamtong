import type { PolicyInput } from "./schema";

/**
 * 실업급여(구직급여) — 자진 퇴사자 인정 사유와 반복 수급.
 *
 * 두 갈래의 글이 돈다. 하나는 "임금이 깎이거나 근로조건이 나빠지면 자진 퇴사라도
 * 실업급여를 받을 수 있다"는 안내이고, 다른 하나는 "반복 수급 지급액이 2016년
 * 2,179억 원에서 지난해 5,998억 원으로 세 배 가까이 늘었다"는 비판이다.
 * 둘 다 사실에 가깝다. 다만 앞의 것에는 기간 요건이 빠져 있고, 뒤의 것은
 * 이재명 정부가 만든 제도가 아니라 오래된 제도의 문제다.
 *
 * ★ 인정 여부는 법령 요건을 갖춰도 고용센터(직업안정기관장)가 사정을 보고 판단한다.
 * ★ 2026-10-11 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #5·#9.
 */
export const UNEMPLOYMENT_BENEFITS: PolicyInput = {
  slug: "unemployment-benefits",
  title: "실업급여 — 자진 퇴사자 인정 사유와 반복 수급",
  scope: "자발적 이직자가 구직급여를 받을 수 있는 정당한 사유, 5년 내 3회 이상 반복 수급 현황과 개편 논의",
  ministries: ["고용노동부"],
  categories: ["welfare"],
  asOf: "2026-10-11",
  rumors: [
    {
      id: "rumor-voluntary",
      text: "임금이 낮아지거나 근로조건이 불리하게 바뀌면 자진 퇴사라도 실업급여를 받을 수 있다",
      claimIds: ["claim-voluntary-rule", "claim-annex2-conditions", "claim-judgement"],
    },
    {
      id: "rumor-repeat-tripled",
      text: "반복 수급자 지급액이 2016년 2,179억 원에서 지난해 5,998억 원으로 세 배 가까이 늘었다",
      claimIds: ["claim-repeat-2016", "claim-repeat-2025", "claim-repeat-cause", "claim-no-repeat-limit"],
    },
  ],
  claims: [
    {
      id: "claim-voluntary-rule",
      text:
        "구직급여는 원칙적으로 비자발적으로 일자리를 잃은 사람이 받는다. 스스로 그만둔 사람은 " +
        "받지 못하지만, 고용보험법 시행규칙 제101조 제2항과 별표 2가 정한 '정당한 이직 사유'가 " +
        "있으면 예외로 받을 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-law-ei-rule", "src-dailypharm-20230320"],
      verified: false,
    },
    {
      id: "claim-annex2-conditions",
      text:
        "별표 2 제1호는 다음 사유가 이직일 전 1년 이내에 2개월 이상 있었던 경우를 정당한 사유로 " +
        "든다. 실제 근로조건이 채용 때 제시된 조건이나 그동안 적용받던 조건보다 낮아진 경우, " +
        "임금체불, 최저임금 미달, 근로기준법상 연장근로 제한 위반, 휴업으로 평균임금 70% " +
        "미만을 받은 경우다. 임금이 한 번 깎였다고 바로 해당하는 것은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-law-ei-rule", "src-dailypharm-20230320"],
      verified: false,
    },
    {
      id: "claim-judgement",
      text:
        "요건에 해당하는지는 이직 경위와 근로조건 저하 정도 등을 보고 고용센터가 판단한다. " +
        "사업주와 짜고 비자발적 퇴사로 꾸며 받으면 부정수급으로 처벌받는다.",
      assertionType: "FACT",
      sourceIds: ["src-dailypharm-20230320"],
      verified: false,
    },
    {
      id: "claim-repeat-2016",
      text:
        "고용노동부가 국민의힘 김소희 의원실에 낸 자료에 따르면 반복 수급자에게 나간 지급액은 " +
        "2016년 2,179억 원에서 2025년 5,998억 원으로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-joongang-20260408"],
      verified: true,
    },
    {
      id: "claim-repeat-2025",
      text:
        "노동부가 국회에 낸 자료에서 5년 안에 세 번 이상 실업급여를 받은 반복 수급자는 2025년 " +
        "11만 3천 명, 지급액은 5,997억 5,400만 원이었다. 다섯 번 이상 받은 사람은 약 1만 5천 명" +
        "(610억 8,600만 원)이다. 같은 사업장에서 퇴사·재입사를 되풀이해 받은 사람은 2023년부터 " +
        "매년 6만 명대다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261005"],
      verified: true,
    },
    {
      id: "claim-repeat-cause",
      text:
        "노동부는 반복 수급이 임시직 비중이 높은 노동시장 구조에서 비롯된 것으로 본다. 계절 " +
        "노동자처럼 반복 수급이 불가피한 경우도 있어 일률적으로 제한하면 선의의 피해자가 " +
        "생긴다는 연구자 지적도 있다.",
      assertionType: "CLAIM",
      assertedBy: "고용노동부·한국노동연구원 연구위원",
      sourceIds: ["src-fnnews-20261005"],
      verified: true,
    },
    {
      id: "claim-no-repeat-limit",
      text:
        "현행 제도는 부정수급은 처벌하지만 반복 수급 자체를 제한하는 조항은 없다. 국회에는 " +
        "수급에 필요한 피보험기간을 180일에서 12개월로 늘리고 5년간 3회 이상 수급자의 지급액을 " +
        "깎는 고용보험법 개정안(국민의힘 중심 발의)이 올라와 있지만 진전되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261005"],
      verified: true,
    },
    {
      id: "claim-floor-inversion",
      text:
        "2026년 구직급여 하한액(월 약 198만 원)이 최저임금 노동자의 세후 실수령액(월 약 " +
        "195만 원)보다 많다는 분석이 보도됐다. 실업급여 계정은 2027년 1.4조 원 부족이 " +
        "예상되며, 정부는 하한액 조정 등을 검토 중인 것으로 전해졌다.",
      assertionType: "FACT",
      sourceIds: ["src-joongang-20260408"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-no-repeat-limit", "claim-floor-inversion"],
  timeline: [
    {
      id: "t-2016",
      date: "2016",
      datePrecision: "year",
      title: "반복 수급 지급액 2,179억 원",
      summary: "노동부 자료.",
      claimIds: ["claim-repeat-2016"],
    },
    {
      id: "t-2025",
      date: "2025",
      datePrecision: "year",
      title: "반복 수급 11.3만 명, 5,998억 원",
      summary: "5년 내 3회 이상.",
      claimIds: ["claim-repeat-2016", "claim-repeat-2025"],
    },
  ],
  gaps: [
    "국가법령정보센터의 고용보험법 시행규칙 별표 2 현행 원문을 직접 열어 보지 못했다(접속 오류). 조문 내용은 2023년 보도에 인용된 별표 2로 확인했다.",
    "2016~2025년 사이 연도별 반복 수급 지급액과, 같은 기간 전체 실업급여 지급액·피보험자 수 증가를 함께 확인하지 못했다. 전체 대비 비중을 알아야 '세 배'의 의미를 판단할 수 있다.",
    "자발적 이직 사유로 수급을 인정받은 건수는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-law-ei-rule",
      title: "고용보험법 시행규칙 제101조, 별표 2 (수급자격이 제한되지 아니하는 정당한 이직 사유)",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B3%A0%EC%9A%A9%EB%B3%B4%ED%97%98%EB%B2%95%EC%8B%9C%ED%96%89%EA%B7%9C%EC%B9%99",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-dailypharm-20230320",
      title: "자발적 퇴사직원의 실업급여 요구...약국장도 형사처벌",
      publisher: "데일리팜",
      url: "https://www.dailypharm.com/user/news/30196",
      publishedAt: "2023-03-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-joongang-20260408",
      title: "[단독] 일하면 194만원, 쉬면 198만원…'실업급여 역전' 손본다",
      publisher: "중앙일보",
      url: "https://v.daum.net/v/20260408050238292",
      publishedAt: "2026-04-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261005",
      title: "5년 내 3회 이상 반복수급자 11만명에 지급액 5998억",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610051901449521",
      publishedAt: "2026-10-05",
      type: "press",
      license: "link-only",
    },
  ],
};
