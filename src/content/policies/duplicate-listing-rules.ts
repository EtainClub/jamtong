import type { PolicyInput } from "./schema";

/**
 * 중복상장 원칙 금지 가이드라인(2026년 7월)과 대규모 유상증자 중점심사.
 *
 * 11월 대통령 X 게시물 답글에 "재벌 그룹이 블록딜·유상증자·중복상장 예외로 소액주주에게 손실을
 * 떠넘긴다"는 지적이 달렸다(잼통 Voice). 정부가 이 관행을 어떻게 규율하는지를 적는다.
 *
 * ★ 가이드라인은 새로 상장하는 자회사에 적용된다. 이미 중복상장된 회사까지 적용되는지는 확인하지 못했다.
 * ★ 블록딜(시간외 대량매매) 자체를 규율하는 새 제도는 찾지 못했다(gaps).
 * ★ 2026-11-15 처음 등록 — 잼통 Voice 이슈 #294.
 */
export const DUPLICATE_LISTING_RULES: PolicyInput = {
  slug: "duplicate-listing-rules",
  title: "중복상장 원칙 금지와 유상증자 중점심사",
  scope: "2026년 7월 확정된 중복상장 가이드라인의 주주동의·이사회 의무·제재, 그리고 금융감독원의 대규모 유상증자 중점심사 사례",
  ministries: ["금융위원회", "금융감독원", "한국거래소"],
  categories: ["economy", "institution"],
  asOf: "2026-11-15",
  rumors: [
    {
      id: "rumor-chaebol",
      text: "재벌 그룹이 블록딜·유상증자·중복상장 예외로 소액주주에게 손실을 떠넘기니 국내 시장에 투자할 수 없다",
      claimIds: ["claim-guideline", "claim-consent", "claim-low-weight", "claim-review", "claim-limits"],
    },
  ],
  claims: [
    {
      id: "claim-guideline",
      text:
        "금융위원회는 2026년 7월 31일 정례회의에서 모회사와 자회사가 함께 상장하는 중복상장을 원칙적으로 금지하는 세부 규정과 가이드라인을 승인했다. " +
        "7월 6일 발표안에 대한 의견수렴을 거친 것이고, 보도는 다음 달 3일부터 곧바로 시행한다고 전했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260731", "src-investchosun-20260706"],
      verified: true,
    },
    {
      id: "claim-consent",
      text:
        "물적분할로 만든 자회사를 상장하려면 모회사 주주총회의 동의를 반드시 받아야 한다. 최대주주 등의 의결권은 3%로 제한하고, " +
        "참석 지분의 과반과 전체 의결권의 4분의 1 동의를 요건으로 한다. 그 밖의 자회사는 주주동의를 권고하되, 받지 않으면 더 엄격한 심사를 받는다. " +
        "투자업계가 주장한 소수주주 다수결(MoM) 방식은 채택되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260731", "src-investchosun-20260706"],
      verified: true,
    },
    {
      id: "claim-low-weight",
      text:
        "자회사의 자산·매출·영업이익이 모두 모회사의 10% 미만인 '저비중 자회사'는 주주동의를 받지 않아도 된다. 다만 물적분할 자회사는 저비중이어도 동의가 필요하다.",
      assertionType: "FACT",
      sourceIds: ["src-investchosun-20260706"],
      verified: true,
    },
    {
      id: "claim-board",
      text:
        "모회사 이사회에는 주주 영향 평가와 보호 방안 마련, 주주 소통·동의 확인, 찬반 결의와 공시, 독립 특별위원회의 사전 검토 같은 의무가 붙는다. " +
        "어기면 최대 10억 원의 상장계약 위약금과 하루 매매거래 정지를 받을 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-investchosun-20260706"],
      verified: true,
    },
    {
      id: "claim-review",
      text:
        "금융감독원은 2026년 4월 9일 한화솔루션의 약 2조 4,000억 원 규모 유상증자 증권신고서에 정정을 요구했다. 중요사항의 기재가 불분명해 투자자의 합리적 판단을 해칠 수 있다는 이유였고, " +
        "이 유상증자를 중점심사 대상으로 정해 심사해 왔다. 회사가 규모를 약 1조 8,000억 원으로 줄여 다시 냈으나 4월 30일 두 번째 정정 요구가 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20260409", "src-investchosun-20260430"],
      verified: true,
    },
    {
      id: "claim-limits",
      text:
        "대기업의 물적분할을 통한 중복상장이 사실상 어려워지면서 IPO 시장이 위축될 것이라는 지적도 나왔다. 반대로 소수주주 다수결이 빠진 점은 소액주주 보호에 미흡하다는 평가를 받았다.",
      assertionType: "OPINION",
      assertedBy: "언론 보도(인베스트조선 등)",
      sourceIds: ["src-investchosun-20260706"],
      verified: false,
      limit: "평가를 전한 보도의 요약이다. 각 주장자의 원문은 확인하지 못했다.",
    },
  ],
  critiqueIds: ["claim-limits"],
  timeline: [
    {
      id: "t-draft",
      date: "2026-07-06",
      datePrecision: "day",
      title: "중복상장 가이드라인 발표",
      summary: "물적분할 자회사 주주동의 의무, 저비중 예외.",
      claimIds: ["claim-consent", "claim-low-weight"],
    },
    {
      id: "t-approved",
      date: "2026-07-31",
      datePrecision: "day",
      title: "금융위 최종 승인",
      summary: "원칙 금지 세부 규정 확정.",
      claimIds: ["claim-guideline"],
    },
  ],
  gaps: [
    "이미 중복상장돼 있는 모·자회사에 가이드라인이 적용되는지는 확인하지 못했다.",
    "블록딜(시간외 대량매매)로 인한 소액주주 피해를 막는 별도 제도는 자료에서 찾지 못했다.",
    "한화솔루션 유상증자의 최종 결과는 5월 일정 '미정' 공시 이후로 확인하지 못했다.",
    "시행일 '다음 달 3일'은 보도 표현이다. 거래소 규정 시행 공고와 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-investchosun-20260706",
      title: "중복상장 가이드라인 나왔다…물적분할시 3%룰 적용ㆍ특례심사 도입",
      publisher: "인베스트조선",
      url: "https://www.investchosun.com/site/data/html_dir/2026/07/06/2026070680096.html",
      publishedAt: "2026-07-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20260731",
      title: "금융위, 중복상장 원칙금지 가이드라인 승인…다음달 3일부터 시행",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/stock/2026/07/31/2026073117042654035",
      publishedAt: "2026-07-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20260409",
      title: "금감원, 2.4조 유증 제동…한화솔루션 \"정정요구 충실히 응할 것\"(종합)",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202604092029536937",
      publishedAt: "2026-04-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-investchosun-20260430",
      title: "금감원, 한화솔루션 유상증자 또 제동…신고서 2차 정정요구",
      publisher: "인베스트조선",
      url: "https://www.investchosun.com/site/data/html_dir/2026/04/30/2026043080211.html",
      publishedAt: "2026-04-30",
      type: "press",
      license: "link-only",
    },
  ],
};
