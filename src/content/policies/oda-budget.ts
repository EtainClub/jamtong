import type { PolicyInput } from "./schema";

/**
 * 공적개발원조(ODA) 예산 규모 (2026년 확정, 2027년 요구).
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」 답글에 "다른 나라를 돕기 전에 우리 국민부터 보살펴야 한다"는
 * 말이 달렸다(잼통 Voice). ODA 규모와 쓰임을 적는다.
 *
 * ★ 대북 의료장비 지원 계획은 policy:nk-medical-aid에, 봉화 '베트남 밸리'(국내 사업)는
 *   policy:bonghwa-vietnam-valley에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #190.
 */
export const ODA_BUDGET: PolicyInput = {
  slug: "oda-budget",
  title: "공적개발원조(ODA) 예산 규모 (2026~2027년)",
  scope: "2026년 확정 ODA 규모와 감소 이유, 지역·분야 배분, 2027년 국제개발협력 종합시행계획의 요구액과 사업 정비",
  ministries: ["국무조정실", "외교부", "기획예산처"],
  categories: ["diplomacy", "economy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-aid-first",
      text: "다른 나라를 돕기 전에 우리 국민부터 보살펴야 한다",
      claimIds: ["claim-2026", "claim-2027"],
    },
  ],
  claims: [
    {
      id: "claim-2026",
      text:
        "2026년 ODA 예산은 5조 4,372억 원으로 확정돼 1년 전보다 1조 655억 원 줄었다. 정부는 단년도 저성과·소규모·행사성 사업을 정비한 " +
        "결과라고 설명했다. 37개 기관이 1,763개 사업을 한다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260226"],
      verified: true,
    },
    {
      id: "claim-2026-regions",
      text: "2026년 ODA는 89개국을 지원하며 아시아(30.4%)와 아프리카(24%) 비중이 가장 크다. 분야는 교통(28.2%), 인도적 지원(9.5%), 교육(8.1%), 보건(7.9%) 순이다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260226"],
      verified: true,
    },
    {
      id: "claim-2027",
      text:
        "국제개발협력위원회는 7월 23일 2027년 ODA 요구액을 6조 3,084억 원(8,712억 원 증가)으로 하는 시행계획을 확정했다. 사업은 536개 줄인 " +
        "1,227개로 정비했다. 요구액이며 예산 심사와 국회 의결로 바뀐다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260723"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-2026",
      date: "2026-02-26",
      datePrecision: "day",
      title: "2026년 ODA 확정",
      summary: "5조 4,372억 원, 1조 원 감소.",
      claimIds: ["claim-2026", "claim-2026-regions"],
    },
    {
      id: "t-2027",
      date: "2026-07-23",
      datePrecision: "day",
      title: "2027년 시행계획 확정",
      summary: "요구액 6조 3,084억 원.",
      claimIds: ["claim-2027"],
    },
  ],
  gaps: [
    "정부 예산안(9월)과 국회 확정 과정에서 2027년 ODA가 얼마로 조정됐는지는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newsis-20260226",
      title: "올해 ODA 규모 5조4372억 확정…전년 대비 1조 감소",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260224_0003524748",
      publishedAt: "2026-02-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260723",
      title: "내년 ODA 사업에 6조3084억 투입…문화·AI 등 분야 중점 지원",
      publisher: "뉴시스",
      url: "https://mobile.newsis.com/view/NISX20260723_0003720469",
      publishedAt: "2026-07-23",
      type: "press",
      license: "link-only",
    },
  ],
};
