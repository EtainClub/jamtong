import type { PolicyInput } from "./schema";

/**
 * 회사가 지원한 임직원 건강검진비의 근로소득세 과세 논란 (2026년 11월).
 *
 * 2026년 11월 인스타그램 게시물이 "정부가 건강검진비에도 세금을 매긴다", "건강검진비에 세금폭탄을 부과한다"고
 * 올렸다(신고 센터 factbot-gap #299). 이슈 제목은 '부가가치세 과세'였다.
 *
 * ★ 보도된 사안은 부가가치세가 아니라 소득세다. 국세청이 한 회사의 세무조사에서 회사가 낸 임직원 검진비를
 *   근로소득으로 보고 소득세를 매기겠다고 통보한 것이고, 조세심판원 판단을 앞두고 있다.
 * ★ 새 세법이나 세법개정안이 아니다. 기존 소득세법 해석의 문제다.
 * ★ 2026-11-15 처음 등록 — factbot-gap #299.
 */
export const HEALTH_CHECKUP_TAX: PolicyInput = {
  slug: "health-checkup-tax",
  title: "회사 지원 건강검진비 근로소득 과세 논란 (2026년)",
  scope: "국세청이 한 회사 임직원 건강검진비를 근로소득으로 보고 소득세를 과세 통보한 사안, 해석 변화, 정부·국회 반응",
  ministries: ["국세청", "재정경제부", "고용노동부"],
  categories: ["economy", "welfare"],
  asOf: "2026-11-15",
  rumors: [
    {
      id: "rumor-vat",
      text: "정부가 건강검진비에 부가가치세를 매긴다",
      claimIds: ["claim-not-vat", "claim-case"],
    },
    {
      id: "rumor-bomb",
      text: "정부가 건강검진비에 세금폭탄을 부과한다",
      claimIds: ["claim-case", "claim-pending", "claim-critique"],
    },
  ],
  claims: [
    {
      id: "claim-case",
      text:
        "국세청은 한 보험사 자회사를 세무조사하면서 이 회사가 2020~2024년 임직원(연인원 6,927명)에게 지원한 건강검진비 49억 3,500만 원을 근로소득으로 보고, " +
        "근로소득세 6억 6,131만 원을 과세하겠다고 회사에 통보했다.",
      assertionType: "FACT",
      sourceIds: ["src-sidae-20261112"],
      verified: true,
    },
    {
      id: "claim-not-vat",
      text:
        "보도된 과세는 부가가치세가 아니라 회사 지원금을 직원의 근로소득으로 보는 소득세 문제다. 2026년 세제개편안 정리에서도 건강검진에 부가가치세를 새로 매기는 항목은 찾지 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-sidae-20261112", "src-samili-vat-2026"],
      verified: false,
      limit: "'찾지 못했다'는 2026년 11월 15일 자료 검색 결과다. 세법개정안 원문 전체와 대조하지 못했다.",
    },
    {
      id: "claim-interpretation",
      text:
        "국세청은 국민건강보험공단 검진만으로 회사의 법정 검진 의무를 다할 수 있으므로 회사가 추가로 쓴 비용은 의무 이행이 아니라고 봤다. " +
        "국세청 해석은 2005년 \"법률에 따라 모든 임직원에게 실시하는 건강검진 비용은 근로소득에 해당하지 않는다\"에서 2024년 지원 비용이 근로소득에 포함된다는 쪽으로 바뀌었다.",
      assertionType: "FACT",
      sourceIds: ["src-sidae-20261112"],
      verified: true,
    },
    {
      id: "claim-pending",
      text:
        "회사는 과세전적부심사를 청구했으나 받아들여지지 않아 조세심판원에 심판을 청구했다. 세법 해석을 맡은 재정경제부는 1월 접수된 해석 요청에 10개월 넘게 회신하지 않았고, " +
        "\"개별 기업 관련 내용은 확인해 줄 수 없다\"고 답했다. 국세청 실무자는 아직 일반적인 판단 기준이 없어 사건마다 판단이 달라질 수 있다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-sidae-20261112"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "국민의힘 박수영 의원은 \"직장인들의 얇은 유리통장마저 세금으로 털어가겠다는 것이냐\"며 과세를 중단하고 법정 검진과 복지성 검진 지원의 과세 기준을 명확히 구분하라고 요구했다. " +
        "조세 전문가들도 과거에 과세하지 않던 것을 소급해 추징하는 것은 바람직하지 않다며 과세 전에 제도 정비가 필요하다고 지적했다.",
      assertionType: "OPINION",
      assertedBy: "박수영 국민의힘 의원, 김우철 서울시립대 교수 등",
      sourceIds: ["src-wbcb-20261109", "src-sidae-20261112"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-notice",
      date: "2025",
      datePrecision: "year",
      title: "국세청 과세 통보",
      summary: "검진비 49억 원을 근로소득으로 보고 소득세 6억 6천만 원 통보.",
      claimIds: ["claim-case"],
    },
    {
      id: "t-reported",
      date: "2026-11",
      datePrecision: "month",
      title: "보도와 국회 비판",
      summary: "조세심판원 판단 앞둠.",
      claimIds: ["claim-pending", "claim-critique"],
    },
  ],
  gaps: [
    "조세심판원 결정은 11월 15일까지 나오지 않았다.",
    "국세청이 다른 기업에도 같은 기준을 적용하는지, 일반 지침을 낼지는 확인하지 못했다.",
    "세무조사 시점은 보도마다 표현이 달라 연 단위로만 적었다.",
  ],
  sources: [
    {
      id: "src-sidae-20261112",
      title: "회사 건강검진비에 세금 물리는 국세청…\"제도 정비부터\"",
      publisher: "동행미디어 시대",
      url: "https://www.sidae.com/article/2026111212070252970",
      publishedAt: "2026-11-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-wbcb-20261109",
      title: "박수영 의원 \"직장인 건강검진비까지 과세하나…국민 주머니 털기식 세금 폭주 중단하라\"",
      publisher: "복지TV부울경방송",
      url: "https://www.wbcb.co.kr/news/articleView.html?idxno=107610",
      publishedAt: "2026-11-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-samili-vat-2026",
      title: "2026년부터 달라지는 부가가치세 개정내역",
      publisher: "삼일아이닷컴",
      url: "https://brand.samili.com/issue-brief/%EC%84%B8%EB%AC%B4%EC%A7%80%EC%9B%90/2026%EB%85%84%EB%B6%80%ED%84%B0-%EB%8B%AC%EB%9D%BC%EC%A7%80%EB%8A%94-%EB%B6%80%EA%B0%80%EA%B0%80%EC%B9%98%EC%84%B8",
      type: "research",
      license: "link-only",
    },
  ],
};
