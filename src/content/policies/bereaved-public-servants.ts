import type { PolicyInput } from "./schema";

/**
 * 순직 공무원 유족 보상 개선(2026년 공무원 재해보상 제도개선 종합계획).
 *
 * 「고인의 희생을 잊지 않겠습니다」(순직 소방대원 추모) 답글에 "순직 소방관 유족의 연금을 크게 올리고
 * 생활비와 자녀 교육비를 국가가 책임져 달라"는 요청이 달렸다(잼통 Voice). 2026년 9월 인사혁신처가
 * 발표한 개선 계획을 적는다.
 *
 * ★ 대통령 글은 words:firefighter-sacrifice에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #127.
 */
export const BEREAVED_PUBLIC_SERVANTS: PolicyInput = {
  slug: "bereaved-public-servants",
  title: "순직 공무원 유족 보상 개선 (2026년 종합계획)",
  scope:
    "인사혁신처의 2026년 9월 '공무원 재해보상 제도개선 종합계획' 가운데 순직 유족 관련 사망조위금·유족연금 지급률·보상 시점과 재활·예방 대책",
  ministries: ["인사혁신처", "소방청"],
  categories: ["welfare", "disaster"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-pension",
      text: "순직 소방관 유족의 연금을 크게 올리고, 유족 생활비와 자녀 교육비를 국가가 책임져 달라",
      claimIds: ["claim-condolence", "claim-pension-rate", "claim-timing"],
    },
  ],
  claims: [
    {
      id: "claim-condolence",
      text: "인사혁신처는 2026년 9월 '공무원 재해보상 제도개선 종합계획'에서 순직공무원 사망조위금 최저액을 595만 원에서 1,190만 원으로 올리겠다고 발표했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260914"],
      verified: true,
    },
    {
      id: "claim-pension-rate",
      text: "위험직무순직 공무원의 유족연금 지급률은 기준소득월액의 43%에서 47%로 높인다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260914"],
      verified: true,
    },
    {
      id: "claim-timing",
      text:
        "순직유족급여 청구일과 국가유공자 등록 신청일 가운데 빠른 날부터 보훈 보상 권리가 생기도록 바꾸고, 유족 심리상담 등 " +
        "맞춤형 지원을 하겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260914"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-plan",
      date: "2026-09-14",
      datePrecision: "day",
      title: "공무원 재해보상 제도개선 종합계획 발표",
      summary: "사망조위금 두 배, 위험직무순직 유족연금 47%.",
      claimIds: ["claim-condolence", "claim-pension-rate", "claim-timing"],
    },
  ],
  gaps: [
    "개선안의 시행 시기와 필요한 법령 개정 일정은 확인하지 못했다.",
    "순직 공무원 자녀의 교육 지원(보훈 교육지원 등) 현행 기준은 정리하지 못했다.",
    "유족연금 실제 수령액 사례는 공식 자료로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-mt-20260914",
      title: "순직 사망조위금 595만→1190만원…자살위험 땐 '긴급직무휴지'",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/policy/2026/09/14/2026091411172179704",
      publishedAt: "2026-09-14",
      type: "press",
      license: "link-only",
    },
  ],
};
