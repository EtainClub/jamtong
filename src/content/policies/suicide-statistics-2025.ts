import type { PolicyInput } from "./schema";

/**
 * 2025년 자살 통계 (2026년 9월 발표).
 *
 * 「어렵게 만든 민주주의를 꼭 지켜냅시다」 답글에 "이 정부 들어 올해 많은 청년이 스스로 목숨을 끊었다"는
 * 말이 달렸다(잼통 Voice). 가장 최근 공식 통계인 2025년 사망원인통계를 적는다.
 *
 * ★ 2026년 연간 통계는 2027년 9월에 나온다. '올해' 수치는 아직 없다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #182.
 */
export const SUICIDE_STATISTICS_2025: PolicyInput = {
  slug: "suicide-statistics-2025",
  title: "2025년 자살 통계 (사망원인통계)",
  scope: "국가데이터처의 2025년 사망원인통계(2026년 9월 22일 발표) 가운데 자살 사망자 수·자살률과 연령대별 추이",
  ministries: ["국가데이터처", "보건복지부"],
  categories: ["welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-youth",
      text: "이 정부 들어 올해 많은 청년이 스스로 목숨을 끊었다",
      claimIds: ["claim-total", "claim-teens", "claim-forties", "claim-twenties"],
    },
  ],
  claims: [
    {
      id: "claim-total",
      text:
        "2025년 자살 사망자는 1만 4,144명으로 1년 전보다 728명(4.9%) 줄었다. 자살률은 인구 10만 명당 27.8명으로 4.7% 낮아졌다. 하루 평균 " +
        "38.8명이다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2008258"],
      verified: true,
    },
    {
      id: "claim-teens",
      text: "10대 자살률은 10만 명당 8.6명으로 7.5% 늘어 전 연령대 가운데 유일하게 증가했고, 1983년 통계 작성 이래 가장 높았다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2008258"],
      verified: true,
    },
    {
      id: "claim-forties",
      text: "40대는 자살률 10만 명당 34.3명으로 2년 연속 자살이 사망원인 1위였다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2008258"],
      verified: true,
    },
    {
      id: "claim-twenties",
      text:
        "자살은 10대부터 40대까지 사망원인 1위였다. 사망자 가운데 자살 비중은 10대 51.2%, 20대 53.5%다. OECD 표준인구로 환산한 한국 자살률은 " +
        "24.9명으로 OECD 평균(10.9명)의 약 2.3배, 회원국 가운데 가장 높다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20260923"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-teens", "claim-twenties"],
  timeline: [
    {
      id: "t-release",
      date: "2026-09-22",
      datePrecision: "day",
      title: "2025년 사망원인통계 발표",
      summary: "자살 사망자 4.9% 감소, 10대 자살률 최고.",
      claimIds: ["claim-total", "claim-teens", "claim-forties"],
    },
  ],
  gaps: [
    "20대 자살률 수치(보도상 10만 명당 20.8명, 7.6% 감소)는 국가데이터처 원자료로 대조하지 못했다.",
    "2026년 자살 사망자 수(잠정)는 아직 공식 발표가 없다.",
    "2026년 정부의 청년 자살 예방 대책은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-inews24-2008258",
      title: "작년 사망자 역대 2위…40대 자살 1위·10대 자살률 역대 최고",
      publisher: "아이뉴스24",
      url: "https://www.inews24.com/view/2008258",
      publishedAt: "2026-09-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20260923",
      title: "[퀵브리핑] \"10대 사망, 절반이 자살\"…한국, OECD 자살률 또 1위",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026092310484833751",
      publishedAt: "2026-09-23",
      type: "press",
      license: "link-only",
    },
  ],
};
