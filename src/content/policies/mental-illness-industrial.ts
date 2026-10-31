import type { PolicyInput } from "./schema";

/**
 * 정신질환 산재 인정률과 처리 기간.
 *
 * 10월 X 게시물 답글에 "근로복지공단이 정신질환 산재의 상병을 축소 승인하고 병세가 나빠져도 요양을
 * 기계적으로 끝내고 있다"는 말이 달렸다(잼통 Voice). 확인되는 인정률·처리 기간 통계를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #180.
 */
export const MENTAL_ILLNESS_INDUSTRIAL: PolicyInput = {
  slug: "mental-illness-industrial",
  title: "정신질환 산재 인정률과 처리 기간",
  scope: "근로복지공단의 정신질환 산재 인정률(2021~2025년), 업무상 질병 처리 기간과 단축 목표, 업무상질병판정위원회 구성에 대한 지적",
  ministries: ["고용노동부", "근로복지공단"],
  categories: ["welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-mental",
      text: "근로복지공단이 정신질환 산재의 상병을 축소 승인하고 병세가 나빠져도 요양을 기계적으로 끝내고 있다",
      claimIds: ["claim-rate", "claim-period", "claim-committee"],
    },
  ],
  claims: [
    {
      id: "claim-rate",
      text: "정신질환 산재 인정률은 2021년 70.8%에서 2025년 56.0%로 14.8%포인트 떨어졌다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeongin-1765929"],
      verified: true,
    },
    {
      id: "claim-period",
      text: "2025년 업무상 질병 처리 기간은 평균 227.7일이었다. 근로복지공단은 2026년 160일, 2027년까지 120일로 줄이겠다는 목표를 세웠다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeongin-1765929"],
      verified: true,
    },
    {
      id: "claim-committee",
      text: "노무사들은 업무상질병판정위원회가 임상 의사 중심이라 노동 환경과 업무 특성이 충분히 반영되지 않는 경우가 있다고 지적한다.",
      assertionType: "CLAIM",
      assertedBy: "공인노무사",
      sourceIds: ["src-kyeongin-1765929"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-rate", "claim-committee"],
  timeline: [],
  gaps: [
    "정신질환 산재의 상병 일부만 승인하는 사례 통계와 요양 종결 기준(심사 절차)은 공식 자료로 정리하지 못했다.",
    "2026년 국정감사에서 정신질환 산재 요양 종결 문제가 다뤄졌는지는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-kyeongin-1765929",
      title: "'질병·일 관계 증명' 인정 확률 4년새 더 낮아졌다 [더딘 산재 인정, 무너지는 삶·(1-2)]",
      publisher: "경인일보",
      url: "https://www.kyeongin.com/article/1765929",
      publishedAt: "2026-06-21",
      type: "press",
      license: "link-only",
    },
  ],
};
