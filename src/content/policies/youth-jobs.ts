import type { PolicyInput } from "./schema";

/**
 * 청년 일자리·구직 지원 — 2026년 하반기 발표.
 *
 * '쉬었음 청년' 대책으로 발표된 계획(요건 폐지, 수당 인상, 자발적 이직자 실업급여,
 * K-유스개런티)을 묶는다. 이미 시행 중인 제도는 통통에서 가져온 항목에 있다
 * (청년일자리도약장려금 `youth-job-leap`, 국민취업지원제도 `national-employment-support`).
 *
 * ★ 구직촉진수당 금액은 보도마다 다르다.
 *   한국경제(7/14)는 "월 50만 원씩 6개월", SBS Biz(8/4)는 "현재 월 60만 원 → 내년
 *   65만 원"이라고 적었다. 원자료로 확정하기 전까지 금액을 FACT로 단정하지 않고,
 *   노동부 업무보고의 계획으로만 적는다. gaps에 남긴다.
 *
 * ★ 2026-10-09 처음 등록, 같은 날 편집팀이 원자료와 대조했다.
 */
export const YOUTH_JOBS: PolicyInput = {
  slug: "youth-jobs",
  title: "청년 일자리·구직 지원 (2026)",
  scope: "구직촉진수당 요건 완화와 인상, 자발적 이직자 실업급여, K-유스개런티 등 2026년 하반기에 발표된 청년 고용 계획",
  ministries: ["고용노동부", "재정경제부"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-09",
  rumors: [
    {
      id: "rumor-paid-to-rest",
      text: "이제 청년은 일 안 하고 쉬기만 해도 매달 수당을 받는다",
      claimIds: ["claim-requirement-removed", "claim-allowance-plan"],
    },
    {
      id: "rumor-quit-benefit",
      text: "회사를 스스로 그만둬도 이제 실업급여를 받는다",
      claimIds: ["claim-voluntary-quit"],
    },
  ],
  claims: [
    {
      id: "claim-requirement-removed",
      text:
        "정부는 2026년 7월 14일 '하반기 경제성장전략'에서 청년 구직촉진수당의 '최근 2년 안 " +
        "100일 이상 일 경험' 요건을 없애겠다고 발표했다. 경력이 없어도 교육 수료 같은 " +
        "구직 과제를 이행해야 받을 수 있고, 대상은 기준 중위소득 120% 이하 청년이다. " +
        "시행일은 기사에 나오지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-strategy-0714"],
      verified: true,
    },
    {
      id: "claim-allowance-plan",
      text:
        "고용노동부는 하반기 업무보고에서 구직촉진수당을 내년에 월 65만 원으로 올리겠다고 " +
        "밝혔다. 국회 예산 심의 전 계획이다.",
      assertionType: "CLAIM",
      assertedBy: "고용노동부",
      sourceIds: ["src-sbs-moel-0804"],
      verified: true,
    },
    {
      id: "claim-voluntary-quit",
      text:
        "자발적으로 이직한 청년에게도 구직급여(실업급여)를 주는 방안은 추진 단계다. 노동부 " +
        "업무보고에 따르면 생애 1회로 한정하고 수급 요건과 금액을 기존 수급자와 다르게 " +
        "적용한다. 법 개정 전이라 현재는 받을 수 없다.",
      assertionType: "FACT",
      sourceIds: ["src-sbs-moel-0804"],
      verified: true,
    },
    {
      id: "claim-youth-guarantee",
      text:
        "노동부는 첫 취업을 준비하는 청년을 위해 졸업 후 4개월 안에 인턴 같은 일경험을 " +
        "연결해 주는 'K-유스개런티'를 새로 만들겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "고용노동부",
      sourceIds: ["src-sbs-moel-0804"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-strategy",
      date: "2026-07-14",
      datePrecision: "day",
      title: "하반기 경제성장전략 발표",
      summary: "구직촉진수당 일 경험 요건 폐지 계획.",
      claimIds: ["claim-requirement-removed"],
    },
    {
      id: "t-report",
      date: "2026-08-04",
      datePrecision: "day",
      title: "노동부 하반기 업무보고 보도",
      summary: "수당 인상, 자발적 이직자 실업급여, K-유스개런티 계획.",
      claimIds: ["claim-allowance-plan", "claim-voluntary-quit", "claim-youth-guarantee"],
    },
  ],
  gaps: [
    "구직촉진수당의 현재 금액이 보도마다 다르다(월 50만 원, 60만 원). 고용노동부 원자료로 확인하지 못했다.",
    "일 경험 요건 폐지와 수당 인상의 시행일, 국회 예산 반영 여부를 확인하지 못했다.",
    "자발적 이직자 구직급여는 고용보험법 개정이 필요하다. 법안 제출 여부를 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-hankyung-strategy-0714",
      title: "'쉬었음 청년' 노동시장 진입 유도 [하반기 경제]",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/202607143141i",
      publishedAt: "2026-07-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbs-moel-0804",
      title: "구직수당 월 65만원 받는다…자발적 이직 청년도 실업급여",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000326624",
      publishedAt: "2026-08-04",
      type: "press",
      license: "link-only",
    },
  ],
};
