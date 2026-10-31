import type { PolicyInput } from "./schema";

/**
 * 한일 과거사 합의 유지 입장과 2025년 광복절 특별사면의 경제인.
 *
 * 「어렵게 만든 민주주의를 꼭 지켜냅시다」 답글에 "위안부·강제징용 합의를 이어 가고 기업인을 사면하는 등
 * 윤석열 정부의 길을 답습한다", 「대통령은 국민의 제1공복」 답글에 "재벌과 검찰에 특혜를 주고받는
 * 거래를 하면서 국민만 고생시킨다"는 말이 달렸다(잼통 Voice). 확인되는 대통령 발언과 사면 명단을 적는다.
 *
 * ★ 가석방 제도는 policy:parole-2026에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #155, #188.
 */
export const JAPAN_AGREEMENTS_PARDONS: PolicyInput = {
  slug: "japan-agreements-pardons",
  title: "한일 과거사 합의 유지 입장과 2025년 광복절 특사의 경제인",
  scope:
    "대통령의 2025년 8월 요미우리 인터뷰(위안부 합의·강제징용 제3자 변제 유지), 2025년 8·15 특별사면의 경제인 16명과 전체 규모, 정부 설명",
  ministries: ["외교부", "법무부"],
  categories: ["diplomacy", "institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-follow-yoon",
      text: "위안부·강제징용 합의를 이어 가고 기업인을 사면하는 등 윤석열 정부의 길을 답습한다",
      claimIds: ["claim-japan", "claim-pardon-business", "claim-pardon-scale"],
    },
    {
      id: "rumor-chaebol-deal",
      text: "재벌과 검찰에 특혜를 주고받는 거래를 하면서 국민만 고생시킨다",
      claimIds: ["claim-pardon-business", "claim-pardon-scale"],
    },
  ],
  claims: [
    {
      id: "claim-japan",
      text:
        "대통령은 2025년 8월 21일 공개된 요미우리신문 인터뷰에서 박근혜 정부의 위안부 합의와 윤석열 정부의 강제징용 제3자 변제를 유지하겠다고 " +
        "했다. 국민으로서 받아들이기 어려워도 국가 간 약속이라 \"내가 뒤집을 수는 없다\"며 \"국가는 내 개인의 소유물이 아니다\"라고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20250821"],
      verified: true,
    },
    {
      id: "claim-pardon-business",
      text:
        "2025년 8·15 특별사면에는 최신원 전 SK네트웍스 회장, 최지성 전 삼성 미래전략실장, 박상진 전 삼성전자 사장, 현재현 전 동양그룹 회장 등 " +
        "경제인 16명이 포함됐다. 법무부는 경제 살리기에 기여할 기회를 주는 취지라고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20250811"],
      verified: true,
    },
    {
      id: "claim-pardon-scale",
      text:
        "같은 사면에서 특별사면·복권은 모두 2,188명이었고, 정치인·고위공직자 27명(조국 전 대표 부부 등)과 국민의힘이 요청한 인사도 들어 있었다. " +
        "운전면허 등 행정제재 특별감면은 83만 4,499명이었다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20250811"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-pardon",
      date: "2025-08-11",
      datePrecision: "day",
      title: "광복절 특별사면 발표",
      summary: "경제인 16명 포함.",
      claimIds: ["claim-pardon-business", "claim-pardon-scale"],
    },
    {
      id: "t-yomiuri",
      date: "2025-08-21",
      datePrecision: "day",
      title: "요미우리 인터뷰 공개",
      summary: "한일 합의 유지.",
      claimIds: ["claim-japan"],
    },
  ],
  gaps: [
    "답글이 말하는 '재벌·검찰과의 거래'를 뒷받침하는 구체적 사안은 답글에 나오지 않고, 그런 거래가 있었다는 근거는 찾지 못했다.",
    "강제징용 제3자 변제의 2025~2026년 집행 현황과 피해자 수용 여부는 정리하지 못했다.",
  ],
  sources: [
    {
      id: "src-hankyung-20250821",
      title: "李 \"위안부·강제징용 합의는 국가간 약속…뒤집을 수 없어\"",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2025082142371",
      publishedAt: "2025-08-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20250811",
      title: "광복절 특사에 조국 부부·윤미향…최신원 등 경제인도(종합)",
      publisher: "뉴시스",
      url: "https://mobile.newsis.com/view/NISX20250811_0003286343",
      publishedAt: "2025-08-11",
      type: "press",
      license: "link-only",
    },
  ],
};
