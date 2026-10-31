import type { PolicyInput } from "./schema";

/**
 * 공동주택 경비원 업무 범위 규정(2021년)과 현장 이행.
 *
 * 10월 말 X 게시물 답글에 "아파트·빌딩 경비원의 고충을 덜려고 만든 업무 규정이 현장에서 지켜지지
 * 않으니 실행되게 해 달라"는 요청이 달렸다(잼통 Voice). 규정의 내용과 지적된 한계를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #143.
 */
export const APARTMENT_GUARDS: PolicyInput = {
  slug: "apartment-guards",
  title: "공동주택 경비원 업무 범위 규정과 현장 이행",
  scope: "2021년 10월 21일 시행된 공동주택관리법 시행령의 경비원 업무 범위, 금지 업무와 과태료, 시행 직후와 이후 현장의 평가",
  ministries: ["국토교통부", "고용노동부"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-enforce",
      text: "아파트·빌딩 경비원의 고충을 덜려고 만든 업무 규정이 현장에서 지켜지지 않으니 실행되게 해 달라",
      claimIds: ["claim-scope", "claim-banned", "claim-limits"],
    },
  ],
  claims: [
    {
      id: "claim-scope",
      text:
        "2021년 10월 21일 시행된 공동주택관리법 시행령은 경비원이 경비 외에 할 수 있는 일을 낙엽 청소·제설, 재활용품 분리배출 " +
        "정리·감시, 위험 방지를 위한 차량 이동, 택배·우편물 보관 등으로 한정했다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1044519"],
      verified: true,
    },
    {
      id: "claim-banned",
      text:
        "개인 차량 대리주차, 택배의 세대별 배달, 세대 대형폐기물 수거, 관리사무소 일반 업무 보조는 원칙적으로 금지되며, 위반하면 " +
        "최대 1천만 원의 과태료가 부과될 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1044519"],
      verified: true,
    },
    {
      id: "claim-limits",
      text:
        "시행 직후 경비원과 전문가들은 용역업체의 단기 계약 구조 탓에 문제를 제기하면 해고될 수 있어 실효성이 낮다며 지자체의 정기 " +
        "실태조사가 필요하다고 지적했다.",
      assertionType: "CLAIM",
      assertedBy: "경비원·노무사·변호사",
      sourceIds: ["src-dailian-1044519"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-limits"],
  timeline: [
    {
      id: "t-effective",
      date: "2021-10-21",
      datePrecision: "day",
      title: "경비원 업무 범위 시행령 시행",
      summary: "업무 범위 한정.",
      claimIds: ["claim-scope", "claim-banned"],
    },
  ],
  gaps: [
    "시행령 위반으로 과태료가 실제 부과된 건수와 지자체 실태조사 실적은 찾지 못했다.",
    "이재명 정부의 경비원 처우 개선 계획은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-dailian-1044519",
      title: "경비원 보호하는 법? 갑질금지법 시행으로 경비원 일만 더 늘었다",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1044519/",
      publishedAt: "2021-10-24",
      type: "press",
      license: "link-only",
    },
  ],
};
