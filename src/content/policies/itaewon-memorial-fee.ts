import type { PolicyInput } from "./schema";

/**
 * 이태원 참사 서울광장 분향소 변상금.
 *
 * 대통령 X 게시물 답글에 "서울시가 이태원 참사 유가족에게 매긴 광화문광장 기억공간
 * 변상금을 취소하게 해 달라"는 요청이 달렸다(잼통 Voice). 변상금이 매겨진 곳은 광화문광장이
 * 아니라 서울광장 합동분향소다. 부과 경위와 1심 판결을 적는다.
 *
 * ★ 변상금은 서울시(지방자치단체)의 처분이고 법원이 1심에서 정당하다고 봤다. 대통령이나
 *   중앙정부가 취소할 수 있는 처분이 아니다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #69.
 */
export const ITAEWON_MEMORIAL_FEE: PolicyInput = {
  slug: "itaewon-memorial-fee",
  title: "이태원 참사 서울광장 분향소 변상금",
  scope: "서울시가 이태원 참사 유가족 측에 부과한 서울광장 합동분향소 변상금의 경위와 2026년 1월 1심 판결",
  ministries: ["서울특별시"],
  categories: ["disaster", "institution"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-cancel",
      text: "이태원 참사 유가족에게 서울시가 매긴 광화문광장 기억공간 변상금을 취소하고 돌려주게 해 달라",
      claimIds: ["claim-place", "claim-charges", "claim-agreement", "claim-ruling"],
    },
  ],
  claims: [
    {
      id: "claim-place",
      text:
        "변상금이 매겨진 곳은 광화문광장이 아니라 서울광장이다. 유가족 측은 2023년 2월 4일 서울시의 허가 없이 서울광장에 " +
        "합동분향소를 차렸고, 2024년 6월까지 운영했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20230411", "src-nate-20260120"],
      verified: false,
    },
    {
      id: "claim-charges",
      text:
        "서울시는 공유재산법과 서울광장 조례에 따라 무단 점유 변상금(사용료의 120%)을 매겼다. 2023년 5월 2,899만 원을, " +
        "이후 2023년 4월 7일부터 2024년 6월 12일까지의 점유에 대해 1억 8,773만 원을 추가로 부과했다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260120", "src-newsis-20230411"],
      verified: false,
    },
    {
      id: "claim-agreement",
      text:
        "2024년 6월 유가족 측과 서울시가 맺은 협약에는 \"유가족은 분향소 운영을 위해 서울광장을 점유함에 따라 발생한 " +
        "변상금을 관련 절차에 따라 서울시에 납부해야 한다\"는 조항이 들어 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260120"],
      verified: false,
    },
    {
      id: "claim-ruling",
      text:
        "서울행정법원 행정3단독은 2026년 1월 14일 유가족 측이 낸 변상금 부과처분 취소소송에서 원고 패소로 판결했다. " +
        "유가족은 서울시가 재난안전법 제66조의 추모 공간 설치 의무를 다하지 않아 대신 분향소를 세웠다고 주장했으나, " +
        "법원은 이 조항이 특별재난지역 복구 비용 보조에 관한 것이라 합동분향소에 해당하지 않고, 공유재산법상 변상금 " +
        "예외 요건도 충족하지 않는다고 봤다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260120"],
      verified: false,
    },
  ],
  timeline: [
    {
      id: "t-altar",
      date: "2023-02-04",
      datePrecision: "day",
      title: "서울광장 합동분향소 설치",
      summary: "서울시 허가 없이.",
      claimIds: ["claim-place"],
    },
    {
      id: "t-charge",
      date: "2023-05",
      datePrecision: "month",
      title: "변상금 2,899만 원 부과",
      summary: "이후 1억 8,773만 원 추가.",
      claimIds: ["claim-charges"],
    },
    {
      id: "t-agreement",
      date: "2024-06",
      datePrecision: "month",
      title: "서울시·유가족 협약, 분향소 이전",
      summary: "변상금 납부 조항 포함.",
      claimIds: ["claim-agreement"],
    },
    {
      id: "t-ruling",
      date: "2026-01-14",
      datePrecision: "day",
      title: "1심, 변상금 처분 정당",
      summary: "유가족 측 패소.",
      claimIds: ["claim-ruling"],
    },
  ],
  gaps: [
    "유가족 측이 1심 판결에 항소했는지는 확인하지 못했다.",
    "광화문광장에 별도의 이태원 참사 기억공간 변상금이 매겨졌다는 자료는 찾지 못했다. 답글이 서울광장 분향소를 가리킨 것으로 보고 정리했다.",
  ],
  sources: [
    {
      id: "src-newsis-20230411",
      title: "서울시 \"분향소 무단점유, 변상금 대상\"…이태원 유족 반박",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20230411_0002262796",
      publishedAt: "2023-04-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260120",
      title: "법원 \"이태원 참사 유가족, 서울광장 분향소 변상금 내야\"",
      publisher: "네이트 뉴스",
      url: "https://news.nate.com/view/20260120n31068",
      publishedAt: "2026-01-20",
      type: "press",
      license: "link-only",
    },
  ],
};
