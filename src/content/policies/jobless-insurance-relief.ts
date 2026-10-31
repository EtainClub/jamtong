import type { PolicyInput } from "./schema";

/**
 * 실직자의 국민연금 보험료 부담 완화: 납부예외·실업크레딧.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」 답글에 "실직으로 소득이 끊긴 특수고용직도 건강보험료와
 * 연금 납부 부담을 덜어 달라"는 요청이 달렸다(잼통 Voice). 확인되는 국민연금 제도를 적는다.
 *
 * ★ 특수고용직의 구직급여 자격은 고용보험 가입 여부에 달려 있다. 실업급여는 policy:unemployment-benefits에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #173.
 */
export const JOBLESS_INSURANCE_RELIEF: PolicyInput = {
  slug: "jobless-insurance-relief",
  title: "실직자의 국민연금 보험료 부담 완화: 납부예외·실업크레딧",
  scope: "소득이 끊긴 국민연금 가입자의 납부예외, 구직급여 수급자의 실업크레딧(보험료 75% 지원), 재개 시 지역가입자 보험료 지원",
  ministries: ["보건복지부", "국민연금공단"],
  categories: ["welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-special-workers",
      text: "실직으로 소득이 끊긴 특수고용직도 건강보험료와 연금 납부 부담을 덜어 달라",
      claimIds: ["claim-exemption", "claim-credit", "claim-resume"],
    },
  ],
  claims: [
    {
      id: "claim-exemption",
      text: "소득이 없는 기간에는 국민연금 가입을 유지한 채 보험료를 내지 않는 '납부예외'를 신청할 수 있다. 다만 그 기간은 가입기간에 들어가지 않아 연금액이 줄 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000300147"],
      verified: true,
    },
    {
      id: "claim-credit",
      text:
        "구직급여를 받는 사람은 '실업크레딧'으로 보험료의 25%만 내고 나머지 75%를 국가가 지원받아 최대 12개월 가입기간을 이을 수 있다. " +
        "재산세 과세표준 합계 6억 원 초과 등 고소득·고자산자는 제외된다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000300147"],
      verified: true,
    },
    {
      id: "claim-resume",
      text: "사업 중단·실직 뒤 보험료 납부를 다시 시작하는 지역가입자는 최대 12개월 보험료의 50%를 지원받을 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000300147"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [],
  gaps: [
    "특수고용직이 실업크레딧을 받으려면 고용보험 구직급여 수급자여야 하는데, 직종별 고용보험 적용 범위는 이 페이지에서 정리하지 못했다.",
    "실직자의 건강보험료(지역가입자 전환, 임의계속가입, 경감) 제도는 공식 자료로 정리하지 못했다.",
    "2026년 이재명 정부가 실직자 사회보험료 경감을 확대한 조치는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-sbsbiz-20000300147",
      title: "갑자기 퇴사, 국민연금 어떡하죠…'이 방법이 있네'",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000300147",
      publishedAt: "2026-03-26",
      type: "press",
      license: "link-only",
    },
  ],
};
