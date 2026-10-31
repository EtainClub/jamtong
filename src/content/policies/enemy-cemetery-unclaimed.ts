import type { PolicyInput } from "./schema";

/**
 * 파주 북한군 묘지와 무연고 사망자 장례 지원.
 *
 * 「어렵게 만든 민주주의를 꼭 지켜냅시다」 답글에 "무연고 자국민에게는 무덤도 마련해 주지 않으면서
 * 북한군 묘에는 비석과 추모를 해 준다"는 말이 달렸다(잼통 Voice). 두 제도의 사실관계를 적는다.
 *
 * ★ 북한군 묘지는 1996년 조성됐다. 이재명 정부가 새로 만든 것이 아니다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #179.
 */
export const ENEMY_CEMETERY_UNCLAIMED: PolicyInput = {
  slug: "enemy-cemetery-unclaimed",
  title: "파주 북한군 묘지와 무연고 사망자 장례 지원",
  scope: "1996년 조성된 파주 적성면 북한군 묘지의 경위·안장 규모·근거, 2024년 무연고 사망자 수와 지자체 공영장례 실태",
  ministries: ["국방부", "보건복지부"],
  categories: ["welfare", "diplomacy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-cemetery",
      text: "무연고 자국민에게는 무덤도 마련해 주지 않으면서 북한군 묘에는 비석과 추모를 해 준다",
      claimIds: ["claim-cemetery", "claim-unclaimed", "claim-funeral-gap"],
    },
  ],
  claims: [
    {
      id: "claim-cemetery",
      text:
        "파주 적성면의 북한군 묘지는 1996년 전쟁 뒤 흩어진 북한군·중국군 유해를 모아 '북한군·중국군 묘지'로 조성됐고, 중국군 유해 송환 뒤 " +
        "2018년 '북한군 묘지'로 이름이 바뀌었다. 2023년 기준 6·25 전사 북한군 810구, 무장공비 58구 등이 묻혀 있다. 조성 근거로는 " +
        "제네바협약과 전사자 예우의 인도주의 원칙이 거론된다.",
      assertionType: "FACT",
      sourceIds: ["src-rfa-20230406"],
      verified: true,
    },
    {
      id: "claim-unclaimed",
      text:
        "보건복지부 자료에 따르면 2024년 무연고 사망자는 6,139명이었다. 연고자가 장례를 위임한 경우가 4,682명으로 가장 많았고, 70세 이상 " +
        "남성이 많았다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20250905"],
      verified: true,
    },
    {
      id: "claim-funeral-gap",
      text:
        "무연고 사망자 장례는 지자체가 맡아 예산·시설·조례에 따라 편차가 크다. 공영장례 매뉴얼이 없는 지자체가 73곳이고, 국가 공식 통계도 " +
        "없다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20250905"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-funeral-gap"],
  timeline: [
    {
      id: "t-cemetery",
      date: "1996",
      datePrecision: "year",
      title: "북한군·중국군 묘지 조성",
      summary: "파주 적성면.",
      claimIds: ["claim-cemetery"],
    },
  ],
  gaps: [
    "북한군 묘지의 현재 관리 주체와 연간 예산은 확인하지 못했다.",
    "2026년 무연고 사망자 공영장례 국고 지원이나 제도 개선은 찾지 못했다.",
    "답글이 말하는 '비석과 추모'가 어떤 행사를 가리키는지는 답글에 나오지 않아 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-rfa-20230406",
      title: "한국 내 북한군 묘지에 북 무장공비 시신 58구 안장 중",
      publisher: "자유아시아방송(RFA)",
      url: "https://www.rfa.org/korean/in_focus/nk_nuclear_talks/enemycemetry-04062023085029.html",
      publishedAt: "2023-04-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20250905",
      title: "작년 무연고 사망자 6139명…국가 공식통계 없어 대안 마련 차질[무연고자 존엄사②]",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20250905_0003318050",
      publishedAt: "2025-09-07",
      type: "press",
      license: "link-only",
    },
  ],
};
