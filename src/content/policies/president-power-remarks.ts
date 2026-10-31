import type { PolicyInput } from "./schema";

/**
 * 대통령의 권력관 발언과 수사 지시 논란.
 *
 * X 게시물 답글에 "예전에는 권력을 잔인하게 써야 한다더니 이제 대통령은 왕이 아니라고 하니 앞뒤가
 * 맞지 않는다", "공개 자리에서는 편 가르지 않는 수사를 말하면서 뒤에서는 수사를 지시한다"는 말이
 * 달렸다(잼통 Voice). 확인되는 발언 원문과 공개된 수사 지시를 적는다.
 *
 * ★ "권력은 잔인하게" 발언은 2016년 방송에서 나왔다고 커뮤니티 글들이 옮기지만, 언론 보도나 원본
 *   영상으로 확인하지 못했다. 원문과 맥락을 대조하기 전에는 claim으로 싣지 않는다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #160, #162.
 */
export const PRESIDENT_POWER_REMARKS: PolicyInput = {
  slug: "president-power-remarks",
  title: "대통령의 권력관 발언과 수사 지시 논란",
  scope:
    "2025년 대선 유세의 '대통령은 왕이 아니다' 발언 원문, 2016년 '권력은 잔인하게' 발언의 확인 상태, 2025년 12월 통일교 연루 의혹 수사 지시",
  ministries: ["청와대"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-cruel",
      text: "예전에는 권력을 잔인하게 써야 한다더니 이제 대통령은 왕이 아니라고 하니 앞뒤가 맞지 않는다",
      claimIds: ["claim-not-king"],
    },
    {
      id: "rumor-order",
      text: "공개 자리에서는 편 가르지 않는 수사를 말하면서 뒤에서는 수사를 지시한다",
      claimIds: ["claim-unification-church"],
    },
  ],
  claims: [
    {
      id: "claim-not-king",
      text:
        "이재명 당시 후보는 2025년 5월 15일 광양 유세에서 \"대통령은 누가 스스로 착각하는 것처럼 왕이 아니다\"라며, 대통령은 일꾼인데 " +
        "자신을 주인 위의 지배자로 착각하면 반드시 책임을 물어야 한다고 말했다. 윤석열 전 대통령을 겨냥한 발언이었다.",
      assertionType: "FACT",
      sourceIds: ["src-pressian-20250515"],
      verified: true,
    },
    {
      id: "claim-unification-church",
      text:
        "대통령은 2025년 12월 10일 특정 종교단체와 정치인의 불법 연루 의혹에 대해 \"여야, 지위고하와 관계없이 엄정하게 수사할 것\"을 " +
        "지시했고, 대변인실이 이를 공개 브리핑했다.",
      assertionType: "FACT",
      sourceIds: ["src-jjan-20251210"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-gwangyang",
      date: "2025-05-15",
      datePrecision: "day",
      title: "광양 유세 '대통령은 왕이 아니다'",
      summary: "윤석열 전 대통령 겨냥.",
      claimIds: ["claim-not-king"],
    },
    {
      id: "t-order",
      date: "2025-12-10",
      datePrecision: "day",
      title: "통일교 연루 의혹 엄정 수사 지시",
      summary: "여야 불문.",
      claimIds: ["claim-unification-church"],
    },
  ],
  gaps: [
    "\"권력행사는 잔인하게 해야 한다\"는 2016년 방송 발언은 커뮤니티 글의 2차 인용만 있고 원본 영상·언론 보도로 확인하지 못했다. 커뮤니티 인용에는 잘못을 뉘우치지 않는 상대에 대한 말이라는 맥락이 붙어 있으나 이 역시 대조하지 못했다.",
    "답글이 말하는 '뒤에서 한 수사 지시'가 어떤 사건을 가리키는지는 답글에 나오지 않아 대조하지 못했다.",
    "대통령이 공개적으로 '편 가르지 않는 수사'라고 말한 발언의 원문은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-pressian-20250515",
      title: "호남 간 이재명 \"윤석열, 본인을 왕으로 착각…버르장머리 고쳐야\"",
      publisher: "프레시안",
      url: "https://pressian.com/pages/articles/2025051517272620160",
      publishedAt: "2025-05-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-jjan-20251210",
      title: "李대통령, '정치권-통일교 연루 의혹'에 \"여야 불문, 엄정 수사\" 지시",
      publisher: "전북일보",
      url: "https://www.jjan.kr/articleAmp/20251210500235",
      publishedAt: "2025-12-10",
      type: "press",
      license: "link-only",
    },
  ],
};
