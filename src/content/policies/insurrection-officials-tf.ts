import type { PolicyInput } from "./schema";

/**
 * 헌법존중 정부혁신 TF: 12·3 비상계엄 관여 공직자 조사와 조치.
 *
 * 「민주주의」 관련 X 게시물 답글에 "실용주의를 내세워 내란 관련 세력까지 끌어안으면서 핵심 지지층이
 * 떠나고 있다"는 말이 달렸다(잼통 Voice). 정부가 계엄 관여 공직자에게 한 조치를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #153.
 */
export const INSURRECTION_OFFICIALS_TF: PolicyInput = {
  slug: "insurrection-officials-tf",
  title: "헌법존중 정부혁신 TF: 계엄 관여 공직자 조사와 조치",
  scope:
    "2025년 11월 국무회의에서 꾸린 헌법존중 정부혁신 TF의 조사 범위와 2026년 2월 12일 발표된 결과(징계요구·수사의뢰), 국방부·경찰의 후속 조치",
  ministries: ["국무조정실", "국방부", "경찰청"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-embrace",
      text: "실용주의를 내세워 내란 관련 세력까지 끌어안으면서 핵심 지지층이 떠나고 있다",
      claimIds: ["claim-launch", "claim-result", "claim-mnd", "claim-police"],
    },
  ],
  claims: [
    {
      id: "claim-launch",
      text:
        "김민석 국무총리는 2025년 11월 11일 국무회의에서 비상계엄 등 내란에 참여·협조한 공직자를 조사해 인사 조치하는 '헌법존중 " +
        "정부혁신 TF' 구성을 제안했고, 대통령은 \"당연히 해야 할 일\"이라고 했다. TF는 49개 중앙행정기관에 설치됐다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20251111", "src-newsis-20260212"],
      verified: true,
    },
    {
      id: "claim-result",
      text:
        "윤창렬 국무조정실장은 2026년 2월 12일 실제 조사가 이뤄진 20개 기관에서 징계요구 89건, 주의·경고 82건, 수사의뢰 110건의 후속 " +
        "조치를 했다고 발표했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260212"],
      verified: true,
    },
    {
      id: "claim-mnd",
      text: "국방부는 6개월간 24개 부대·기관 860여 명을 조사해 35명을 중징계하고 직무배제 등 인사 조치를 병행했다고 발표했다.",
      assertionType: "FACT",
      sourceIds: ["src-newdaily-20260212"],
      verified: false,
    },
    {
      id: "claim-police",
      text: "경찰청 TF가 중징계를 요구한 총경급 이상 경찰관들은 이후 직위해제됐다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260218"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-launch",
      date: "2025-11-11",
      datePrecision: "day",
      title: "TF 구성 제안",
      summary: "국무회의.",
      claimIds: ["claim-launch"],
    },
    {
      id: "t-result",
      date: "2026-02-12",
      datePrecision: "day",
      title: "조사 결과 발표",
      summary: "징계요구 89, 수사의뢰 110.",
      claimIds: ["claim-result", "claim-mnd"],
    },
  ],
  gaps: [
    "답글이 말하는 '내란 관련 세력을 끌어안은' 인사가 누구를 가리키는지는 답글에 나오지 않아 대조하지 못했다.",
    "징계요구 89건의 최종 징계 결과와 수사의뢰 110건의 처리 결과는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-weeklykhan-20251111",
      title: "내란 가담 공직자 조사한다···이 대통령 \"당연히 해야할 일\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202511111435001",
      publishedAt: "2025-11-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260212",
      title: "정부 헌법존중 TF \"'계엄 연루자' 110명 수사 의뢰…89명 징계요구\"",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260212_0003513387",
      publishedAt: "2026-02-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newdaily-20260212",
      title: "안규백 장관, 헌법존중TF 활동결과 발표",
      publisher: "뉴데일리",
      url: "https://www.newdaily.co.kr/site/data/html/2026/02/12/2026021200412.html",
      publishedAt: "2026-02-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20260218",
      title: "무궁화 무더기로 떨어졌다…경찰청 헌법존중 TF 요구 중징계 대상 경찰들 직위해제 [세상&]",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026021818400021892",
      publishedAt: "2026-02-18",
      type: "press",
      license: "link-only",
    },
  ],
};
