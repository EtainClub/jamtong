import type { PolicyInput } from "./schema";

/**
 * 2026년 경찰청 국정감사: 22개월 직무대행 체제와 답변 태도 논란.
 *
 * 10월 X 게시물 답글에 "국정감사에서 드러난 경찰 간부들의 역량과 성의 부족을 대통령이 직접 살펴봐
 * 달라"는 요청이 달렸다(잼통 Voice). 10월 12일 경찰청 국감에서 지적된 내용을 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #136.
 */
export const POLICE_AUDIT_2026: PolicyInput = {
  slug: "police-audit-2026",
  title: "2026년 경찰청 국정감사: 직무대행 체제와 답변 논란",
  scope:
    "2026년 10월 12일 국회 행정안전위원회 경찰청 국정감사에서 지적된 청장 공석 장기화, 준비 부족·답변 태도, 수사 미흡 인정과 개선 약속",
  ministries: ["경찰청", "행정안전부"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-competence",
      text: "국정감사에서 드러난 경찰 간부들의 역량과 성의 부족을 대통령이 직접 살펴봐 달라",
      claimIds: ["claim-acting", "claim-attitude", "claim-admit", "claim-reform"],
    },
  ],
  claims: [
    {
      id: "claim-acting",
      text:
        "경찰청은 2024년 12월 조지호 전 청장이 비상계엄 연루로 직무정지된 뒤 약 1년 10개월째 김종철 직무대행 체제다. 김 직무대행은 " +
        "청장 임명 시점은 정부 인사라 답할 수 없다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2013969"],
      verified: true,
    },
    {
      id: "claim-attitude",
      text:
        "여야 의원들은 질의 중 의원을 보지 않는 답변 태도, 이미 크게 보도된 한동훈 의원 딸 사건에 '알아보겠다'고만 답한 준비 부족, " +
        "대구 천장 붕괴 당시 대통령과의 통화 시각을 밝히지 않은 점을 지적했다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2013969"],
      verified: true,
    },
    {
      id: "claim-admit",
      text:
        "김 직무대행은 한동훈 의원 딸 의혹 수사에 미흡한 점이 있었다고 인정하고 재수사와 당시 수사라인 감찰을 검토하겠다고 했다. " +
        "안산 준강간 사건도 아쉬움이 있었다며 별도 수사 매뉴얼을 만들겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2013969"],
      verified: true,
    },
    {
      id: "claim-reform",
      text:
        "경력 3년 이하 수사관이 32%라는 지적에 김 직무대행은 올해 4천여 명을 수사부서에 투입했다고 답하고, 경찰개혁단을 통해 12월까지 " +
        "개혁 과제 이행 상황을 발표하겠다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "김종철 경찰청장 직무대행",
      sourceIds: ["src-inews24-2013969"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-attitude"],
  timeline: [
    {
      id: "t-audit",
      date: "2026-10-12",
      datePrecision: "day",
      title: "경찰청 국정감사",
      summary: "행정안전위원회.",
      claimIds: ["claim-acting", "claim-attitude", "claim-admit", "claim-reform"],
    },
  ],
  gaps: [
    "국감 뒤 경찰청장 임명 절차나 간부 인사 조치가 있었는지는 확인하지 못했다.",
    "대통령이 경찰 지휘부의 국감 대응에 대해 지시하거나 언급한 기록은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-inews24-2013969",
      title: "[2026 국감] 22개월째 '대행 체제' 경찰청⋯'준비부족·태도논란' 뭇매 [종합]",
      publisher: "아이뉴스24",
      url: "https://www.inews24.com/v/2013969",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
  ],
};
