import type { PolicyInput } from "./schema";

/**
 * 대장동 민간업자 범죄수익 환수 현황.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」 답글에 "대장동 민간업자의 불법 수익 7,800억 원은 환수하지
 * 않으면서 체납 징수를 자랑한다"는 말이 달렸다(잼통 Voice). 1심 추징액과 검찰 항소 포기, 민사
 * 환수 논의를 적는다.
 *
 * ★ 대통령 본인의 대장동 재판은 /trials 허브에 있다. 이 페이지는 민간업자 범죄수익 환수만 다룬다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #158.
 */
export const DAEJANG_RECOVERY: PolicyInput = {
  slug: "daejang-recovery",
  title: "대장동 민간업자 범죄수익 환수 현황",
  scope: "대장동 민간업자 1심의 추징 선고액, 2025년 11월 검찰 항소 포기의 영향, 성남도시개발공사의 민사소송과 법조계 평가",
  ministries: ["법무부", "대검찰청"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-7800",
      text: "대장동 민간업자의 불법 수익 7,800억 원은 환수하지 않으면서 체납 징수를 자랑한다",
      claimIds: ["claim-ruling", "claim-appeal", "claim-civil"],
    },
  ],
  claims: [
    {
      id: "claim-ruling",
      text:
        "서울중앙지법 형사합의22부는 대장동 민간업자 5명의 유죄를 인정했지만 추징금은 473억 원만 선고했다. 검찰이 범죄수익으로 본 " +
        "7,800억 원대에는 크게 못 미친다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1572397"],
      verified: true,
    },
    {
      id: "claim-appeal",
      text: "검찰이 2025년 11월 1심에 항소하지 않아, 항소심에서 추징할 수 있는 금액은 473억 원이 상한이 됐다는 지적이 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1572397"],
      verified: true,
    },
    {
      id: "claim-civil",
      text:
        "정성호 법무부 장관은 피해자인 성남도시개발공사의 민사소송으로 부당이익을 환수할 수 있다고 했다. 법조계는 형사재판에서 인정되지 " +
        "않은 손해액을 민사에서 새로 입증하기 어렵다며 전액 환수에 회의적이다.",
      assertionType: "CLAIM",
      assertedBy: "정성호 법무부 장관 / 법조계",
      sourceIds: ["src-dailian-1572397"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-appeal", "claim-civil"],
  timeline: [
    {
      id: "t-appeal",
      date: "2025-11",
      datePrecision: "month",
      title: "검찰 항소 포기",
      summary: "추징 상한 473억 원.",
      claimIds: ["claim-appeal"],
    },
  ],
  gaps: [
    "성남도시개발공사 민사소송의 2026년 진행 상황과 추징보전 해제 여부는 확인하지 못했다.",
    "특별법을 통한 환수 논의가 국회에서 어떻게 됐는지는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-dailian-1572397",
      title: "'대장동 범죄수익 7800억' 민사 환수 가능 주장 현실성 있나? [법조계에 물어보니 685]",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1572397/",
      publishedAt: "2025-11-13",
      type: "press",
      license: "link-only",
    },
  ],
};
