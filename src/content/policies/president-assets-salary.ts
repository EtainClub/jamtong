import type { PolicyInput } from "./schema";

/**
 * 대통령 본인의 부동산 매각·재산 신고와 연봉.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」 등 10월 X 게시물 답글에 "세제 혜택을 누리며 부동산을
 * 거래한 대통령이 조세 정의를 말한다", "연봉이 2억 원이 넘으니 직접 기부부터 하라"는 말이
 * 달렸다(잼통 Voice). 확인되는 매각 경위·재산 신고·연봉을 적는다.
 *
 * ★ 매각에 따른 양도소득세 신고·납부 내역은 공개된 자료로 확인하지 못했다. 세제 혜택을
 *   받았는지는 단정하지 않는다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #120, #161.
 */
export const PRESIDENT_ASSETS_SALARY: PolicyInput = {
  slug: "president-assets-salary",
  title: "대통령의 분당 아파트 매각·재산 신고와 연봉",
  scope:
    "이재명 대통령 부부의 성남 분당 아파트 매물 등록(2026년 2월)과 매각(7월), 2026년 재산 신고액, 2026년 대통령 연봉, 확인하지 못한 세금·기부 내역",
  ministries: ["청와대", "인사혁신처"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-tax",
      text: "대통령 본인이 편법과 세제 혜택으로 부동산을 거래해 놓고 조세 정의를 말하는 것은 내로남불이다",
      claimIds: ["claim-listing", "claim-sale", "claim-assets"],
    },
    {
      id: "rumor-donate",
      text: "대통령은 연봉이 2억 원이 넘으니 어려운 국민을 위해 직접 기부부터 해야 한다",
      claimIds: ["claim-salary"],
    },
  ],
  claims: [
    {
      id: "claim-listing",
      text:
        "대통령은 1998년 산 성남 분당 아파트(김혜경 여사와 공동명의)를 2026년 2월 시세보다 약 10% 낮은 29억 원에 매물로 " +
        "내놓았다. 청와대는 시장 정상화 의지를 보여주려는 취지라고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260227"],
      verified: false,
    },
    {
      id: "claim-sale",
      text:
        "등기에 따르면 7월 14일 29억 원에 매매계약을 맺고 16일 소유권이 넘어갔으며, 채권최고액 17억 7천만 원의 근저당이 함께 " +
        "설정됐다. 이를 두고 국민의힘이 문제를 제기했고, 청와대는 매수자 사정이라고 답했다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20260720"],
      verified: true,
    },
    {
      id: "claim-assets",
      text: "대통령은 2025년 말 기준 재산을 49억 7천여만 원으로 신고했다(1년 전보다 18억 8천만 원 증가). 매각 전 신고다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000299929"],
      verified: false,
    },
    {
      id: "claim-salary",
      text: "2026년 공무원 보수가 3.5% 오르면서 대통령 연봉은 2억 7,177만 원이 됐다(2025년 2억 6,258만 원).",
      assertionType: "FACT",
      sourceIds: ["src-daum-20251230"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-listing",
      date: "2026-02",
      datePrecision: "month",
      title: "분당 아파트 매물 등록",
      summary: "29억 원.",
      claimIds: ["claim-listing"],
    },
    {
      id: "t-sale",
      date: "2026-07-16",
      datePrecision: "day",
      title: "소유권 이전",
      summary: "7월 14일 계약.",
      claimIds: ["claim-sale"],
    },
  ],
  gaps: [
    "분당 아파트 매각에 따른 양도소득세 신고·납부 내역과 적용된 공제는 공개 자료로 확인하지 못했다.",
    "답글이 말하는 '편법' 거래가 어떤 거래를 가리키는지는 답글에 나오지 않아 대조하지 못했다.",
    "대통령 개인의 기부 내역은 공개 자료로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-mt-20260227",
      title: "이 대통령, 결국 내놓은 분당 아파트…\"고점 신호?\" 부동산 시장 술렁",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/estate/2026/02/27/2026022717510145573",
      publishedAt: "2026-02-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20260720",
      title: "李대통령 아파트 29억에 매각… 매수인에 17억 근저당 설정",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202607201827474782",
      publishedAt: "2026-07-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20000299929",
      title: "李 대통령, 49억7천만원 신고…1년 전보다 18억8천만원 증가 [재산공개]",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000299929",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-daum-20251230",
      title: "이재명 대통령 연봉 2억7177만 원… 내년 공무원 보수 3.5% 인상",
      publisher: "다음뉴스",
      url: "https://v.daum.net/v/20251230164703121",
      publishedAt: "2025-12-30",
      type: "press",
      license: "link-only",
    },
  ],
};
