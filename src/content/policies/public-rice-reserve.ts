import type { PolicyInput } from "./schema";

/**
 * 2026년 공공비축미 매입 계획과 가루쌀.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」 답글에 "가공용 국수쌀을 가루쌀처럼 공공비축 품목으로
 * 따로 정해 매입 물량을 배정하자"는 제안이 달렸다(잼통 Voice). 2026년 공공비축 계획을 적는다.
 *
 * ★ 농가 소득 지원은 policy:farm-income-support에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #141.
 */
export const PUBLIC_RICE_RESERVE: PolicyInput = {
  slug: "public-rice-reserve",
  title: "2026년 공공비축미 매입 계획과 가루쌀",
  scope:
    "2026년 8월 국무회의에서 의결된 공공비축 시행계획(쌀 40만 톤, 그 안의 가루쌀 3.5만 톤), 매입가격·중간정산금, 품종 제한, 정부 양곡 재고 목표",
  ministries: ["농림축산식품부"],
  categories: ["economy", "region"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-noodle-rice",
      text: "가공용 국수쌀을 가루쌀처럼 공공비축 품목으로 따로 정해 매입 물량을 배정하자",
      claimIds: ["claim-volume", "claim-price"],
    },
  ],
  claims: [
    {
      id: "claim-volume",
      text:
        "정부는 2026년 8월 25일 국무회의에서 2026년 공공비축 쌀 40만 톤 매입을 의결했다. 이 가운데 가루쌀이 3만 5천 톤이다. " +
        "공공비축 매입량은 2024년 45만, 2025년 43만 톤이었다.",
      assertionType: "FACT",
      sourceIds: ["src-mafra-578842"],
      verified: true,
    },
    {
      id: "claim-price",
      text:
        "매입가격은 수확기(10~12월) 평균 산지 쌀값으로 연말에 정하고, 매입 직후 40kg 벼 한 포대당 중간정산금 6만 원(2025년 4만 원)을 " +
        "먼저 준다. 시·군별로 지정한 2개 품종만 사들이며 다수확 품종은 제외한다.",
      assertionType: "FACT",
      sourceIds: ["src-mafra-578842"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-plan",
      date: "2026-08-25",
      datePrecision: "day",
      title: "2026년 공공비축 시행계획 의결",
      summary: "쌀 40만 톤(가루쌀 3.5만 톤).",
      claimIds: ["claim-volume", "claim-price"],
    },
  ],
  gaps: [
    "국수용 등 가공용 쌀을 공공비축 품목으로 따로 정하는 방안을 정부가 검토한 기록은 찾지 못했다.",
    "정부양곡의 가공용 공급 물량(2026년)은 공식 자료로 정리하지 못했다.",
  ],
  sources: [
    {
      id: "src-mafra-578842",
      title: "2026년 공공비축 시행계획 및 2027 양곡연도 정부관리양곡 수급계획 국무회의 의결",
      publisher: "농림축산식품부",
      url: "https://www.mafra.go.kr/bbs/home/792/578842/artclView.do",
      publishedAt: "2026-08-25",
      type: "official",
      license: "public",
    },
  ],
};
