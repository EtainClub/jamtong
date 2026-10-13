import type { PolicyInput } from "../schema";
import { sid, sourcesFor } from "./sources";

const P = "tr-pj";
const s = (key: Parameters<typeof sid>[1]) => sid(P, key);

/**
 * 대통령 형사재판 ② 위증교사.
 *
 * 1심이 무죄다. 다만 같은 재판에서 증인 김진성 씨의 위증은 유죄였으므로, "위증은
 * 있었지만 교사의 고의는 증명되지 않았다"는 구조를 그대로 보여야 한다. 위증 자체가
 * 없었다고 읽히게 쓰면 판결과 어긋난다.
 */
export const TRIAL_PERJURY: PolicyInput = {
  slug: "trial-perjury",
  title: "대통령 재판 ② 위증교사",
  scope: "증인에게 거짓 증언을 하게 했다는 혐의의 재판 경과와 쟁점",
  categories: ["institution"],
  asOf: "2026-10-13",
  claims: [
    {
      id: "claim-charge",
      text:
        "검찰은 이재명 대통령이 2019년 2월 자신의 공직선거법 위반 재판(검사 사칭 관련)에서 " +
        "김병량 전 성남시장의 비서였던 김진성 씨에게 거짓 증언을 요구했다고 보고 기소했다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("lawtimes-1125")],
      verified: false,
    },
    {
      id: "claim-prosecution-sentence",
      text:
        "검찰은 2024년 9월 30일 결심공판에서 징역 3년을 구형했다. 김진성 씨에게 거짓 주장을 " +
        "여러 차례 주입한 수법이 유사 사례를 찾기 어려울 만큼 치밀하다고 주장했다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("lawtimes-0930")],
      verified: false,
    },
    {
      id: "claim-defense",
      text:
        "이 대통령은 같은 날 최후진술에서 혐의를 부인하며 \"최소한 저와 관계된 사건에선 " +
        "대한민국 검사가 증거 숨기기 다반사\"라고 했다. 검찰이 '고소 취소 협의'와 '고소 취소 " +
        "약속 또는 합의'를 뒤섞고, 불리한 증거를 감추고 짜깁기했다고 주장했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령(당시 더불어민주당 대표)",
      sourceIds: [s("lawtimes-0930")],
      verified: false,
    },
    {
      id: "claim-defense-after",
      text: "이 대통령은 1심 선고 직후 \"진실과 정의를 되찾아준 재판부에 감사드린다\"고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령(당시 더불어민주당 대표)",
      sourceIds: [s("lawtimes-1125")],
      verified: false,
    },
    {
      id: "claim-acquitted",
      text:
        "서울중앙지법 형사33부는 2024년 11월 25일 이재명 대통령(당시 더불어민주당 대표)의 " +
        "위증교사 혐의에 1심 무죄를 선고했다.",
      assertionType: "FACT",
      sourceIds: [s("lawtimes-1125")],
      verified: false,
    },
    {
      id: "claim-reason",
      text:
        "재판부는 통화 당시 김 씨가 증언할지, 무엇을 증언할지가 정해지지 않았고, 통화 방식이 " +
        "일반적인 증언 요청과 크게 다르지 않으며 김 씨가 기억하거나 동조하는 사항 위주로 " +
        "요청했다고 봤다. 그래서 교사의 고의를 인정할 증거가 부족하다고 판단했다.",
      assertionType: "FACT",
      sourceIds: [s("lawtimes-1125")],
      verified: false,
    },
    {
      id: "claim-defense-right",
      text:
        "재판부는 검사 사칭 사건 상황을 설명하고 변론요지서를 건넨 행위를 피고인의 방어권 " +
        "범위 안이라고 봤다.",
      assertionType: "FACT",
      sourceIds: [s("lawtimes-1125")],
      verified: false,
    },
    {
      id: "claim-witness",
      text:
        "같은 재판에서 김진성 씨는 기억에 반하는 일부 증언이 위증으로 인정돼 벌금 500만 원을 " +
        "선고받았다.",
      assertionType: "FACT",
      sourceIds: [s("lawtimes-1125")],
      verified: false,
    },
    {
      id: "claim-prosecution-appeal",
      text:
        "검찰은 항소 방침을 밝히며 \"재판부가 김 씨에게 유죄를 인정하면서도 이 대표에게 " +
        "위증교사의 범의가 없다고 보아 무죄를 선고한 것은 법리와 증거관계에 비춰 납득하기 " +
        "어렵다\"고 했다.",
      assertionType: "CLAIM",
      assertedBy: "서울중앙지검",
      sourceIds: [s("lawtimes-1125")],
      verified: false,
    },
    {
      id: "claim-suspended",
      text:
        "항소심(서울고법)은 대선 전에 2025년 5월 20일 공판을 추후 지정으로 바꿔 기일을 잡지 " +
        "않았고, 이후 재판 중단 상태다.",
      assertionType: "FACT",
      sourceIds: [s("edaily-0609"), s("newsis-0722")],
      verified: false,
    },
  ],
  critiqueIds: ["claim-prosecution-appeal"],
  timeline: [
    {
      id: "t-close",
      date: "2024-09-30",
      datePrecision: "day",
      title: "결심공판, 징역 3년 구형",
      summary: "이 대통령은 최후진술에서 혐의를 부인했다.",
      claimIds: ["claim-prosecution-sentence", "claim-defense"],
    },
    {
      id: "t-acquit",
      date: "2024-11-25",
      datePrecision: "day",
      title: "1심 무죄",
      summary: "교사의 고의가 증명되지 않았다. 증인 김진성 씨는 위증 유죄.",
      claimIds: ["claim-acquitted", "claim-witness"],
    },
    {
      id: "t-suspend",
      date: "2025-05",
      datePrecision: "month",
      title: "항소심 기일 추후 지정",
      summary: "5월 20일 공판이 잡히지 않았다.",
      claimIds: ["claim-suspended"],
    },
  ],
  gaps: [
    "판결문 원문과 대조하지 않았다. 모든 문장이 언론 보도 기준이다.",
    "항소심이 기일을 추후 지정한 날짜와 사유 원문을 확인하지 못했다.",
    "변호인의 변론요지서 원문은 보지 못했다. 대통령 측 주장은 최후진술 보도 기준이다.",
  ],
  sources: sourcesFor(P, ["lawtimes-0930", "lawtimes-1125", "edaily-0609", "newsis-0722"]),
};
