import type { PolicyInput } from "./schema";

/**
 * 3기 신도시 남양주 왕숙지구 공급 일정 지연 (2021~2026).
 *
 * Voice 방문자가 "3기 신도시 공급 일정"을 찾았고, 영상 답글에 "왕숙지구 공급이 또 1년 넘게 미뤄졌으니 현장을 직접 챙겨 달라"는 요청이 달렸다(잼통 Voice).
 * 왕숙지구의 일정이 언제 어떻게 밀렸는지와 LH가 밝힌 사유·보완책을 적는다.
 *
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #235.
 */
export const WANGSUK_NEW_TOWN: PolicyInput = {
  slug: "wangsuk-new-town",
  title: "3기 신도시 남양주 왕숙지구 공급 일정 지연",
  scope:
    "왕숙지구 첫 입주 목표(2026년 말)에서 2028년 이후로 밀린 경과, A1 블록 사업기간·사업비 증가(2025년), A19 블록 본청약 1년 연기(2026년 9월)와 LH 보완책",
  ministries: ["국토교통부", "한국토지주택공사"],
  categories: ["region", "welfare"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-delay",
      text: "3기 신도시 왕숙지구 공급이 또 1년 넘게 미뤄졌으니 현장을 직접 챙겨 달라",
      claimIds: ["claim-first-plan", "claim-2025-delay", "claim-a19", "claim-lh-measures"],
    },
  ],
  claims: [
    {
      id: "claim-first-plan",
      text: "2021년 12월 토지보상에 들어갈 때 남양주 왕숙의 첫 입주 목표는 2026년 12월이었다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20211201"],
      verified: true,
    },
    {
      id: "claim-2025-delay",
      text:
        "2025년 인허가 지연과 공사비 상승으로 A1 블록 사업기간이 2028년 3월로 15개월 늦춰졌고 총사업비는 2,429억 원에서 3,210억 원으로 32% 늘었다. " +
        "2022년 사전청약 때 2027년 3월로 안내된 입주 시기는 2025년 본청약 공고에서 2028년 8월로 바뀌었다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20250526", "src-ekn-20250724"],
      verified: true,
    },
    {
      id: "claim-a19",
      text:
        "LH는 2026년 9월 왕숙 A19 블록(1,015가구, 사전청약 932가구)의 본청약을 2027년 6월에서 2028년 6월로 1년 미뤘다. 사업지 안 기존 거주자의 이주·철거 일정이 늦어졌다는 이유다. " +
        "당초 2030년으로 안내된 입주 시점은 본청약 공고 때 확정한다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1693479"],
      verified: true,
    },
    {
      id: "claim-lh-measures",
      text:
        "LH는 본청약이 예정보다 6개월 이상 늦어진 경우 계약금 비율을 10%에서 5%로 낮추고 중도금 30%를 한 번에 내도록 조정하겠다고 했다. 사전청약 당첨자들은 대기 기간 동안의 주거비와 분양가 상승을 걱정했다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1693479"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-2025-delay", "claim-a19"],
  timeline: [
    {
      id: "t-compensation",
      date: "2021-12",
      datePrecision: "month",
      title: "토지보상 착수, 2026년 말 입주 목표",
      summary: "첫 3기 신도시.",
      claimIds: ["claim-first-plan"],
    },
    {
      id: "t-a1",
      date: "2025-05",
      datePrecision: "month",
      title: "A1 사업기간 15개월 연장, 사업비 32% 증가",
      summary: "입주 2028년 8월로.",
      claimIds: ["claim-2025-delay"],
    },
    {
      id: "t-a19",
      date: "2026-09-22",
      datePrecision: "day",
      title: "A19 본청약 1년 연기",
      summary: "이주·철거 지연.",
      claimIds: ["claim-a19", "claim-lh-measures"],
    },
  ],
  gaps: [
    "대통령이나 국토부 장관이 왕숙 현장을 점검했거나 일정 단축을 지시했다는 자료는 찾지 못했다.",
    "왕숙지구 전체의 블록별 최신 일정표는 공개 자료로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-khan-20211201",
      title: "3기 남양주왕숙 토지보상 착수, 2026년 입주",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202112011005001",
      publishedAt: "2021-12-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20250526",
      title: "사업비 32% 뛴 남양주 왕숙…\"이대론 3년내 입주 못해\"",
      publisher: "네이트 뉴스",
      url: "https://news.nate.com/view/20250526n34294",
      publishedAt: "2025-05-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ekn-20250724",
      title: "'첫 3기 신도시' 남양주 왕숙 지구, 입주 1.5년 늦춰진다",
      publisher: "에너지경제",
      url: "https://m.ekn.kr/view.php?key=20250724021260019",
      publishedAt: "2025-07-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1693479",
      title: "[단독] 본청약 1년 연기된 남양주 왕숙…'공급 속도전' 무색",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1693479/",
      publishedAt: "2026-09-22",
      type: "press",
      license: "link-only",
    },
  ],
};
