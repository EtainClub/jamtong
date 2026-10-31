import type { PolicyInput } from "./schema";

/**
 * 새만금 국제공항 기본계획 취소 소송과 추진 현황.
 *
 * 10월 X 게시물 답글에 "소송으로 멈춘 새만금 국제공항을 전북 균형 발전을 위해 살펴 달라"는 요청이
 * 달렸다(잼통 Voice). 1심 판결, 항소, 집행정지 결정과 항소심 일정을 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #169.
 */
export const SAEMANGEUM_AIRPORT: PolicyInput = {
  slug: "saemangeum-airport",
  title: "새만금 국제공항 기본계획 취소 소송과 추진 현황",
  scope:
    "2025년 9월 서울행정법원의 새만금 국제공항 기본계획 취소 판결과 이유, 국토교통부 항소, 2026년 3월 집행정지 기각, 항소심 선고 일정",
  ministries: ["국토교통부"],
  categories: ["region"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-airport",
      text: "소송으로 멈춘 새만금 국제공항을 전북 균형 발전을 위해 살펴 달라",
      claimIds: ["claim-ruling", "claim-appeal", "claim-stay", "claim-schedule"],
    },
  ],
  claims: [
    {
      id: "claim-ruling",
      text:
        "서울행정법원은 2025년 9월 11일 시민 1,297명이 낸 소송에서 새만금 국제공항 기본계획을 취소하라고 판결했다. 조류 충돌 위험과 " +
        "세계자연유산 서천갯벌 등 주변 생태계 영향이 이유였다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260325", "src-seoul-20250912"],
      verified: true,
    },
    {
      id: "claim-appeal",
      text: "국토교통부는 국가 균형발전 국정과제라며 항소했고, 전북특별자치도 등과 협의체를 꾸려 항소심에 대응하고 있다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260325"],
      verified: true,
    },
    {
      id: "claim-stay",
      text:
        "서울고법은 2026년 3월 원고 측의 집행정지 신청을 기각했다. 이에 따라 국토부는 항소심 판결 전까지 공항 건설 절차를 이어갈 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260325"],
      verified: true,
    },
    {
      id: "claim-schedule",
      text: "서울고법은 10월 14일로 잡았던 항소심 선고를 재판부 직권으로 11월 18일로 미뤘다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-saemangeum-20261008"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-ruling",
      date: "2025-09-11",
      datePrecision: "day",
      title: "1심 기본계획 취소",
      summary: "조류 충돌·생태계 영향.",
      claimIds: ["claim-ruling"],
    },
    {
      id: "t-stay",
      date: "2026-03-25",
      datePrecision: "day",
      title: "집행정지 기각",
      summary: "건설 절차 계속.",
      claimIds: ["claim-stay"],
    },
    {
      id: "t-appeal-ruling",
      date: "2026-11-18",
      datePrecision: "day",
      title: "항소심 선고 예정",
      summary: "10월 14일에서 연기.",
      claimIds: ["claim-schedule"],
    },
  ],
  gaps: [
    "1심이 지적한 비용 대비 편익(B/C)과 예비타당성조사 면제에 대한 판단은 판결문으로 대조하지 못했다.",
    "항소심 결과는 11월 18일 이후 반영해야 한다.",
  ],
  sources: [
    {
      id: "src-newsis-20260325",
      title: "법원, 새만금공항 집행정지 기각…국토부 \"항소심 대응\"(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260325_0003563568",
      publishedAt: "2026-03-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20250912",
      title: "법원, 새만금 신공항 제동… \"조류충돌 위험 축소\"",
      publisher: "서울신문",
      url: "https://m.seoul.co.kr/news/2025/09/12/20250912001005",
      publishedAt: "2025-09-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-saemangeum-20261008",
      title: "새만금공항 취소 항소심 다음 달 18일로 선고 연기",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0103_202610081607138605",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
  ],
};
