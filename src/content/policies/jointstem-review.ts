import type { PolicyInput } from "./schema";

/**
 * 조인트스템 품목허가 반려와 행정소송.
 *
 * 10월 말 X 게시물 답글에 "식약처가 임상 3상까지 마친 국산 신약 조인트스템의 허가를 부당하게 막아
 * 국내 치료를 해외로 내몰았다"는 말이 달렸다(잼통 Voice). 허가 신청·반려 경위와 2026년 판결을 적는다.
 *
 * ★ 효능 판단은 식약처와 회사 주장이 맞선다. 판결은 반려 처분을 취소했을 뿐 허가를 명하지 않았다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #172.
 */
export const JOINTSTEM_REVIEW: PolicyInput = {
  slug: "jointstem-review",
  title: "조인트스템 품목허가 반려와 행정소송",
  scope: "네이처셀 관계사 알바이오의 퇴행성 관절염 줄기세포치료제 조인트스템 허가 신청·반려 경위, 2026년 7월 서울행정법원 판결과 재심사",
  ministries: ["식품의약품안전처"],
  categories: ["institution", "welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-blocked",
      text: "식약처가 임상 3상까지 마친 국산 신약 조인트스템의 허가를 부당하게 막아 국내 치료를 해외로 내몰았다",
      claimIds: ["claim-history", "claim-dispute", "claim-ruling"],
    },
  ],
  claims: [
    {
      id: "claim-history",
      text:
        "조인트스템은 2018년 조건부 허가 신청이 반려됐고, 2021년 정식 허가를 신청했다가 2023년 반려됐다. 보완 자료를 내 다시 신청했지만 " +
        "2025년 8월 임상적 유의성 부족을 이유로 또 반려됐다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20260709"],
      verified: true,
    },
    {
      id: "claim-dispute",
      text:
        "회사는 임상 3상 규모를 10배 넘게 늘려 통계적 유의성을 확인했는데 식약처가 '임상적 유의성'이라는 새 기준을 들이밀었다고 주장했다. " +
        "식약처 중앙약사심의위원회는 2023년 위원 10명 가운데 9명이 허가에 반대했다.",
      assertionType: "CLAIM",
      assertedBy: "네이처셀 / 식품의약품안전처",
      sourceIds: ["src-mtn-20260709", "src-dailypharm-3264"],
      verified: false,
    },
    {
      id: "claim-ruling",
      text:
        "서울행정법원 행정14부는 2026년 7월 알바이오가 낸 소송에서 반려 처분을 취소했다. 식약처의 법령 해석이 잘못됐다고 봤지만 허가를 " +
        "명한 것은 아니어서, 식약처가 처음부터 다시 심사해야 한다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20260709"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-2023",
      date: "2023-04",
      datePrecision: "month",
      title: "정식 허가 신청 반려",
      summary: "중앙약사심의위원회 반대.",
      claimIds: ["claim-history"],
    },
    {
      id: "t-2025",
      date: "2025-08",
      datePrecision: "month",
      title: "재신청 반려, 행정소송 제기",
      summary: "임상적 유의성 부족.",
      claimIds: ["claim-history"],
    },
    {
      id: "t-ruling",
      date: "2026-07-09",
      datePrecision: "day",
      title: "반려 처분 취소 판결",
      summary: "재심사.",
      claimIds: ["claim-ruling"],
    },
  ],
  gaps: [
    "판결 뒤 식약처가 항소했는지, 재심사 결과가 나왔는지는 확인하지 못했다.",
    "국내 환자가 해외에서 조인트스템 치료를 받는 규모는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-mtn-20260709",
      title: "[단독] '조인트스템' 재심사…네이처셀, 식약처에 승소",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026070912225837071",
      publishedAt: "2026-07-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailypharm-3264",
      title: "'조인트스템' 허가 반려...\"중앙약심 10명 중 9명 반대\"",
      publisher: "데일리팜",
      url: "https://m.dailypharm.com/user/news/3264",
      type: "press",
      license: "link-only",
    },
  ],
};
