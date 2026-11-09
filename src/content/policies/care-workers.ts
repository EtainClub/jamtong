import type { PolicyInput } from "./schema";

/**
 * 요양보호사 처우: 2026년 장기근속장려금 개편과 2027년 장기요양 수가 결정.
 *
 * 대통령 유튜브 영상 답글에 "최저임금을 받으며 가장 힘든 일을 하는 요양보호사의 처우를 개선해 달라"는 요청이 달렸다(잼통 Voice).
 * 2026~2027년에 정해진 처우 관련 조치와, 기본급 인상은 정해지지 않았다는 한계를 함께 적는다.
 *
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #256.
 */
export const CARE_WORKERS: PolicyInput = {
  slug: "care-workers",
  title: "요양보호사 처우: 장기근속장려금과 2027년 장기요양 수가",
  scope:
    "2026년 장기근속장려금 지급 요건 완화, 2027년 장기요양보험료율·수가 의결(2026년 10월 30일)과 그 안의 종사자 처우 항목, 기본급 기준 부재에 대한 지적",
  ministries: ["보건복지부", "국민건강보험공단"],
  categories: ["welfare"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-care",
      text: "최저임금을 받으며 가장 힘든 일을 하는 요양보호사의 처우를 개선해 달라",
      claimIds: ["claim-longterm", "claim-2027", "claim-2027-workers", "claim-no-base"],
    },
  ],
  claims: [
    {
      id: "claim-longterm",
      text:
        "2026년부터 요양보호사 장기근속장려금의 근속 요건이 3년 이상에서 1년 이상으로 낮아져 받는 사람이 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-eachj-13711"],
      verified: false,
    },
    {
      id: "claim-2027",
      text:
        "보건복지부는 2026년 10월 30일 장기요양위원회에서 2027년 수가와 보험료율을 의결했다. 장기요양보험료율은 소득 대비 0.9448%에서 0.9994%로 5.78% 오르고, " +
        "가입자 세대당 월평균 보험료는 약 1,100원 늘어난 2만 129원으로 예상된다.",
      assertionType: "FACT",
      sourceIds: ["src-khanews-252013", "src-jkn-1061074"],
      verified: true,
    },
    {
      id: "claim-2027-workers",
      text:
        "종사자 처우 항목으로는 섬·벽지 방문요양·방문간호 교통비 30% 인상, 유급휴일 가산율 상향, 올해 끝날 예정이던 노인요양시설 요양보호사 한시가산의 2027년 말까지 1년 연장이 들어갔다.",
      assertionType: "FACT",
      sourceIds: ["src-khanews-252013", "src-dalang-3982"],
      verified: true,
    },
    {
      id: "claim-no-base",
      text:
        "보험료율 인상이 곧바로 임금 인상으로 이어지지는 않는다. 2027년 결정에는 요양보호사 전체 기본급을 얼마나 올릴지에 대한 확정 수치가 없다는 지적이 나왔고, " +
        "돌봄서비스노조는 최저임금 118% 수준의 기본급 보장 등 처우개선 예산 편성을 요구했다.",
      assertionType: "FACT",
      sourceIds: ["src-dalang-3982", "src-laborplus-41575"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-no-base"],
  timeline: [
    {
      id: "t-2027",
      date: "2026-10-30",
      datePrecision: "day",
      title: "2027년 장기요양 수가·보험료율 의결",
      summary: "보험료율 0.9994%, 한시가산 1년 연장.",
      claimIds: ["claim-2027", "claim-2027-workers"],
    },
  ],
  gaps: [
    "2026년 장기근속장려금의 근속기간별 금액은 자료마다 달라(월 5만~18만 원) 복지부 고시 원문으로 확인하지 못했다.",
    "요양보호사 평균 임금 실태 통계(2026년)는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-eachj-13711",
      title: "돌봄의 품격이 달라진다… 2026년 장기요양 완전 개편",
      publisher: "이치저널",
      url: "https://www.eachj.co.kr/news/articleView.html?idxno=13711",
      publishedAt: "2026",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khanews-252013",
      title: "내년 장기요양보험료율 전년 대비 5.78% 인상",
      publisher: "병원신문",
      url: "http://www.khanews.com/news/articleView.html?idxno=252013",
      publishedAt: "2026-10-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-jkn-1061074",
      title: "내년 장기요양보험료 1100원 인상…재가급여 한도 확대",
      publisher: "재경일보",
      url: "https://news.jkn.co.kr/post/1061074",
      publishedAt: "2026-10-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dalang-3982",
      title: "2027년 장기요양보험료 5.78% 인상 확정…요양보호사 임금은 얼마나 오르나?",
      publisher: "달랑",
      url: "https://www.dalang.kr/3982",
      publishedAt: "2026-10-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-laborplus-41575",
      title: "[포토] 돌봄서비스노조, \"요양보호사 처우개선 예산 편성하라\"",
      publisher: "참여와혁신",
      url: "https://www.laborplus.co.kr/news/articleView.html?idxno=41575",
      type: "press",
      license: "link-only",
    },
  ],
};
