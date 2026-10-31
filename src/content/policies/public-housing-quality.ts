import type { PolicyInput } from "./schema";

/**
 * 공공주택 품질·층간소음 관리.
 *
 * 10월 X 게시물 답글에 "주택 공급을 서두르더라도 하자와 층간소음이 없도록 관리·감독해 달라"는
 * 요청이 달렸다(잼통 Voice). LH의 2026년 국정감사 답변과 2023년 층간소음 대책을 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #142.
 */
export const PUBLIC_HOUSING_QUALITY: PolicyInput = {
  slug: "public-housing-quality",
  title: "공공주택 품질·층간소음 관리",
  scope:
    "LH 사장의 2026년 국정감사 답변(품질 목표·공급 일정·현장 모니터링), 2023년 12월 정부 층간소음 해소 방안의 보완시공 의무화",
  ministries: ["국토교통부", "한국토지주택공사"],
  categories: ["region", "welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-quality",
      text: "주택 공급을 서두르더라도 하자와 층간소음이 없도록 관리·감독해 달라",
      claimIds: ["claim-lh-goal", "claim-lh-monitoring", "claim-noise"],
    },
  ],
  claims: [
    {
      id: "claim-lh-goal",
      text:
        "이성훈 LH 사장은 2026년 10월 국정감사에서 공공주택 품질을 민간 주요 브랜드 아파트 이상으로 높이고, 분양·임대 주택의 마감재와 " +
        "설계에 차이를 두지 않겠다고 말했다. LH는 2026년 전국 9만 6천 호(수도권 8만 6천 호) 착공을 목표로 한다.",
      assertionType: "CLAIM",
      assertedBy: "한국토지주택공사(LH)",
      sourceIds: ["src-mtn-20261012"],
      verified: true,
    },
    {
      id: "claim-lh-monitoring",
      text: "LH는 건설 현장과 임대주택에 AI 기반 실시간 모니터링을 늘리고, 현장 공정률과 공급 일정을 공개하겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "한국토지주택공사(LH)",
      sourceIds: ["src-mtn-20261012"],
      verified: true,
    },
    {
      id: "claim-noise",
      text:
        "정부는 2023년 12월 층간소음 해소 방안에서 준공 전 성능 검사에서 기준에 못 미치면 보완시공을 의무화하고, 이행하지 않으면 " +
        "준공 승인을 받지 못하게 하겠다고 했다. 그전까지 보완조치는 권고에 그쳤다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20231211"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-noise",
      date: "2023-12-11",
      datePrecision: "day",
      title: "층간소음 해소 방안",
      summary: "보완시공 의무화.",
      claimIds: ["claim-noise"],
    },
    {
      id: "t-audit",
      date: "2026-10-12",
      datePrecision: "day",
      title: "LH 국정감사",
      summary: "품질 목표와 공급 일정.",
      claimIds: ["claim-lh-goal", "claim-lh-monitoring"],
    },
  ],
  gaps: [
    "LH 공공주택의 연도별 중대하자 건수는 LH 발표 원문으로 대조하지 못했다.",
    "층간소음 보완시공 의무화가 법령으로 언제 시행됐는지와 실제 적용 실적은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-mtn-20261012",
      title: "이성훈 LH 사장, \"공공주택 품질, 민간아파트 수준 격상\"",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026101210563128811",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20231211",
      title: "현재 공동주택 층간소음 문제 시 보완조치는 권고",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0102_202312111458537765",
      publishedAt: "2023-12-11",
      type: "press",
      license: "link-only",
    },
  ],
};
