import type { PolicyInput } from "./schema";

/**
 * 정동영 통일부 장관·이종석 국정원장 경질 요구와 반박 (2026년 10월).
 *
 * 10월 말 X 게시물 답글에 "친중·친북 행보 논란이 있는 통일부 장관과 국정원장을 경질하지 않으면 한미
 * 관계가 나빠진다"는 말이 달렸다(잼통 Voice). 경질 요구의 근거와 장관의 반박을 나란히 적는다.
 *
 * ★ 미국의 정보공유 기준은 policy:us-intel-standards, DMZ 지뢰 사고는 policy:dmz-mine-2026에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #174.
 */
export const SECURITY_APPOINTMENTS: PolicyInput = {
  slug: "security-appointments",
  title: "통일부 장관·국정원장 경질 요구와 반박 (2026년 10월)",
  scope: "국민의힘의 정동영 통일부 장관·이종석 국정원장 경질 요구 근거, 정 장관의 반박, 정상회담 횟수 등 확인되는 사실",
  ministries: ["통일부", "국가정보원"],
  categories: ["diplomacy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-dismiss",
      text: "친중·친북 행보 논란이 있는 통일부 장관과 국정원장을 경질하지 않으면 한미 관계가 나빠진다",
      claimIds: ["claim-demand", "claim-rebuttal", "claim-dmz"],
    },
  ],
  claims: [
    {
      id: "claim-demand",
      text: "국민의힘은 미국의 일부 대북 정보 공유 제한 등을 근거로 한미 신뢰에 균열이 생겼다며 정동영 통일부 장관과 이종석 국정원장의 경질을 요구했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘",
      sourceIds: ["src-wikitree-1165498"],
      verified: true,
    },
    {
      id: "claim-rebuttal",
      text:
        "정 장관은 10월 12일 한미동맹에는 문제가 없고 \"경질해야 할 건 편향된 동맹관\"이라고 반박했다. 대통령과 트럼프 대통령이 1년 1개월 " +
        "사이 네 차례 만났다는 점을 들었고, 미 정보기관 관계자가 국정원장을 만나지 않았다는 보도는 가짜뉴스라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "정동영 통일부 장관",
      sourceIds: ["src-wikitree-1165498"],
      verified: true,
    },
    {
      id: "claim-dmz",
      text: "정 장관은 DMZ 지뢰 폭발을 북한의 의도적 공격으로 특정하기 어렵다는 입장을 유지하며, 북한의 의도는 검증 중이라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "정동영 통일부 장관",
      sourceIds: ["src-wikitree-1165498"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-demand"],
  timeline: [
    {
      id: "t-rebuttal",
      date: "2026-10-12",
      datePrecision: "day",
      title: "정동영 장관 반박",
      summary: "편향된 동맹관.",
      claimIds: ["claim-rebuttal"],
    },
  ],
  gaps: [
    "'친중' 행보로 지목된 구체적 사례는 답글과 보도에서 찾지 못했다.",
    "대통령이 두 사람의 경질 요구에 대해 밝힌 입장은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-wikitree-1165498",
      title: "\"경질해야 할 건 편향된 동맹관\" 정동영, 자신 향한 경질 요구에 밝힌 입장",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1165498",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
  ],
};
