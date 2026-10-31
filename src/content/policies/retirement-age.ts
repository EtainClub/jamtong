import type { PolicyInput } from "./schema";

/**
 * 65세 정년연장 입법 추진 현황.
 *
 * 「대통령은 국민의 제1공복」 등 답글에 "정년연장 법안은 언제 통과되나", "곧 퇴직하는 1967·68년생을
 * 위해 언제 결론 내나"는 물음이 달렸다(잼통 Voice). 정부·여당 안의 변천과 국회 상황을 적는다.
 *
 * ★ 단체대화방에 도는 '출생연도별 연장표'는 확정안이 아니다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #130.
 */
export const RETIREMENT_AGE: PolicyInput = {
  slug: "retirement-age",
  title: "65세 정년연장 입법 추진 현황",
  scope:
    "법정 정년 60세를 65세로 단계적으로 올리는 입법의 2025년 11월 세 가지 안, 2026년 6월 중재안 초안, 국회 일정과 노사 입장, 출생연도별 연장표의 진위",
  ministries: ["고용노동부"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-when",
      text: "곧 퇴직하는 1967·68년생을 위해 정년연장 여부를 언제 결론 내는가, 정년연장 법안은 언제 통과되는가",
      claimIds: ["claim-drafts", "claim-mediation", "claim-schedule", "claim-chart"],
    },
  ],
  claims: [
    {
      id: "claim-drafts",
      text:
        "2025년 11월 민주당 정년연장특위는 65세 도달 시점을 2036년·2039년·2041년으로 하는 세 가지 안을 내놨지만 노사 합의를 얻지 못해 " +
        "연내 입법이 무산됐다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20260829"],
      verified: true,
    },
    {
      id: "claim-mediation",
      text:
        "2026년 6월 중재안 초안은 2029년 법정 정년을 61세로 올리고 2년마다 1세씩 높여 2037년 65세에 이르는 방식이다. 이를 그대로 " +
        "적용하면 1969년생이 첫 대상이 된다. 2026년 6월 입법 목표도 지켜지지 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20260829"],
      verified: true,
    },
    {
      id: "claim-schedule",
      text:
        "고용노동부는 8월 4일 업무보고에서 '세대 상생형 정년연장 법제화'를 하반기 과제로 다시 명시했다. 노동계는 2037년 도달이 " +
        "늦다고 반발하고, 경영계는 법정 정년보다 재고용을 먼저 도입하자고 주장한다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20260829"],
      verified: true,
    },
    {
      id: "claim-chart",
      text: "'68년생 1년, 76년생 5년 연장' 같은 출생연도별 연장표는 정부·국회가 확정한 내용이 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20260829"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-drafts",
      date: "2025-11",
      datePrecision: "month",
      title: "민주당 특위 세 가지 안",
      summary: "노사 합의 실패.",
      claimIds: ["claim-drafts"],
    },
    {
      id: "t-mediation",
      date: "2026-06",
      datePrecision: "month",
      title: "중재안 초안",
      summary: "2029년 61세, 2037년 65세.",
      claimIds: ["claim-mediation"],
    },
    {
      id: "t-moel",
      date: "2026-08-04",
      datePrecision: "day",
      title: "노동부 업무보고",
      summary: "하반기 법제화 과제.",
      claimIds: ["claim-schedule"],
    },
  ],
  gaps: [
    "9월 이후 정기국회에서 중재안이 다시 나왔는지, 환경노동위원회 심사가 시작됐는지는 확인하지 못했다.",
    "1967·68년생이 연장 대상에 들어가는지는 최종 법안의 시행일과 부칙에 달려 있어 아직 알 수 없다.",
  ],
  sources: [
    {
      id: "src-weeklykhan-20260829",
      title: "'68년생 1년, 76년생 5년 연장' 정말일까…정년연장 어디까지 왔나",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202608291624001",
      publishedAt: "2026-08-29",
      type: "press",
      license: "link-only",
    },
  ],
};
