import type { PolicyInput } from "./schema";

/**
 * 2027년 최저임금과 업종별 차등 적용 부결.
 *
 * 「대통령은 국민의 제1공복」 답글에 "낮은 곳으로 향한다면서 최저임금 업종별 차등 적용은 어떻게
 * 보는가"라는 물음이 달렸다(잼통 Voice). 차등 적용은 최저임금위원회가 표결로 정한다. 2026년 표결
 * 결과와 노사 입장을 적는다.
 *
 * ★ 정부(대통령)의 별도 공식 입장은 찾지 못했다. gaps에 적는다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #184.
 */
export const MINIMUM_WAGE_2027: PolicyInput = {
  slug: "minimum-wage-2027",
  title: "2027년 최저임금과 업종별 차등 적용 부결",
  scope: "최저임금위원회의 2027년 적용 업종별 구분 적용 표결(2026년 6월 18일), 노사 입장, 2027년 최저임금 결정",
  ministries: ["고용노동부", "최저임금위원회"],
  categories: ["economy", "welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-differentiation",
      text: "낮은 곳으로 향한다면서 최저임금 업종별 차등 적용은 어떻게 보는가",
      claimIds: ["claim-vote", "claim-positions", "claim-2027"],
    },
  ],
  claims: [
    {
      id: "claim-vote",
      text:
        "최저임금위원회는 2026년 6월 18일 제7차 전원회의에서 2027년 적용 최저임금의 업종별 구분 적용안을 찬성 11, 반대 14, 무효 1로 " +
        "부결했다. 2027년에도 모든 업종에 같은 최저임금이 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260618"],
      verified: true,
    },
    {
      id: "claim-positions",
      text:
        "경영계는 음식점업부터 구분 적용하자며 지불능력 한계를 들었고, 노동계는 저임금 노동자 차별을 제도화한다며 반대했다.",
      assertionType: "CLAIM",
      assertedBy: "경영계 / 한국노총·민주노총",
      sourceIds: ["src-heraldk-20260618"],
      verified: true,
    },
    {
      id: "claim-2027",
      text:
        "최저임금위원회는 7월 14일 2027년 최저임금을 2026년(시급 1만 320원)보다 3.7% 오른 시급 1만 700원(월 환산 약 223만 원)으로 정했다. " +
        "소상공인연합회는 지불능력을 고려하지 않았다며 7월 27일 노동부에 이의를 제기했다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260618", "src-kbmaeil-20260728"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-vote",
      date: "2026-06-18",
      datePrecision: "day",
      title: "업종별 구분 적용 부결",
      summary: "찬성 11, 반대 14.",
      claimIds: ["claim-vote"],
    },
  ],
  gaps: [
    "업종별 차등 적용에 대한 대통령이나 고용노동부의 공식 입장은 찾지 못했다.",
    "업종별 구분 적용이 실제 시행된 것은 제도 첫해인 1988년뿐이라는 보도가 있으나 원 자료로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-heraldk-20260618",
      title: "최저임금 업종별 구분적용 부결…2027년에도 단일 최저임금",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026061803264877218",
      publishedAt: "2026-06-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kbmaeil-20260728",
      title: "소상공인 최저 임금 재심요구, 제도 개선이 답",
      publisher: "경북매일",
      url: "https://www.kbmaeil.com/article/20260728500385",
      publishedAt: "2026-07-28",
      type: "press",
      license: "link-only",
    },
  ],
};
