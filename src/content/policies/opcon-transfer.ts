import type { PolicyInput } from "./schema";

/**
 * 전시작전통제권 전환 추진 현황 (2026년 10월 기준).
 *
 * 「극단적 진영주의는 경계해야」 답글에 "전작권 환수를 미국 처분에 맡기지 말고 독자 환수를 선언한
 * 뒤 작전계획과 군 조직을 개편하라"는 말이 달렸다(잼통 Voice). 한미가 합의한 전환 절차와 2026년
 * 경과를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #129.
 */
export const OPCON_TRANSFER: PolicyInput = {
  slug: "opcon-transfer",
  title: "전시작전통제권 전환 추진 현황 (2026년)",
  scope:
    "한미가 합의한 조건 기반 전작권 전환 절차, 정부의 2028년 목표연도 추진, 2026년 11월 예정이던 SCM의 2027년 초 연기와 미국 측 입장",
  ministries: ["국방부"],
  categories: ["diplomacy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-unilateral",
      text: "전작권 환수를 미국 처분에 맡기지 말고 독자 환수를 선언한 뒤 작전계획과 군 조직을 개편하라",
      claimIds: ["claim-conditions", "claim-target", "claim-scm-delay"],
    },
  ],
  claims: [
    {
      id: "claim-conditions",
      text:
        "전작권 전환은 한미가 합의한 조건을 충족하는지 검증하는 절차로 진행된다. 미래연합군사령부의 완전운용능력(FOC) 검증을 거쳐 " +
        "목표연도를 정하고, 이후 완전임무수행능력(FMC)을 검증하는 순서다. 미 행정부 당국자는 이 절차가 \"상호 합의한 조건에 기반한 " +
        "절차로 남아 있다\"고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261028"],
      verified: true,
    },
    {
      id: "claim-target",
      text:
        "정부는 올해 SCM 전에 FOC 검증을 마치고 2028년을 전환 목표연도로 정하는 방안을 추진해 왔다. 대통령 임기(2030년 6월) 안 " +
        "전환이 목표다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261028"],
      verified: true,
    },
    {
      id: "claim-scm-delay",
      text:
        "미 국방부는 10월 27일(현지시간) 11월 예정이던 제58차 한미안보협의회(SCM)를 내년 초로 미룬다고 발표했고, 국방부도 2027년 초 " +
        "개최에 합의했다고 밝혔다. 브런슨 주한미군사령관은 북한 핵·미사일 위협으로 전환 \"조건이 변했다\"고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261028"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-scm-delay",
      date: "2026-10-27",
      datePrecision: "day",
      title: "SCM 2027년 초로 연기",
      summary: "전환 목표연도 확정도 늦춰질 가능성.",
      claimIds: ["claim-scm-delay"],
    },
  ],
  gaps: [
    "FOC 검증 완료 여부와 그 평가 결과는 공식 발표로 확인하지 못했다.",
    "정부가 '독자 환수 선언'을 검토했다는 기록은 찾지 못했다.",
    "2027년 국방예산안의 전작권 전환 관련 항목은 정리하지 못했다.",
  ],
  sources: [
    {
      id: "src-khan-20261028",
      title: "전작권 논의할 SCM 내년으로…'조건 충족' 강조하는 미국, 전환 일정 늦춰지나",
      publisher: "경향신문",
      url: "https://khan.co.kr/article/202610281812001",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
  ],
};
