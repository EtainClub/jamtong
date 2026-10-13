import type { PolicyInput } from "../schema";
import { sid, sourcesFor } from "./sources";

const P = "tr-nr";
const s = (key: Parameters<typeof sid>[1]) => sid(P, key);

/**
 * 대통령 형사재판 ④ 쌍방울 대북송금.
 *
 * 공범으로 기소된 이화영 전 부지사의 유죄가 확정됐다. 그 판결은 이 대통령에 대한
 * 판단이 아니지만, "쌍방울 송금이 경기도 비용의 대납"이라는 사실 판단은 이 대통령
 * 재판과 겹친다. 둘을 섞지도, 숨기지도 않는다.
 *
 * ★ 회유 의혹은 양쪽 판단이 엇갈린다.
 *   서울고검 TF는 검찰청 안에 소주가 반입돼 마셨다고 결론냈고(2026-05), 법원은
 *   이 전 부지사가 국회에서 한 '연어 술파티' 증언을 위증으로 판단했다(2026-06,
 *   1심). 어느 한쪽만 실으면 그 자체가 왜곡이다.
 */
export const TRIAL_NORTH_REMITTANCE: PolicyInput = {
  slug: "trial-north-remittance",
  title: "대통령 재판 ④ 쌍방울 대북송금",
  scope: "쌍방울이 북한에 보낸 800만 달러가 경기도 비용의 대납이었고 이 대통령이 관여했다는 혐의의 재판 경과와 쟁점",
  categories: ["institution"],
  asOf: "2026-10-13",
  claims: [
    {
      id: "claim-charge",
      text:
        "수원지검은 2024년 6월 12일 이재명 대통령(당시 더불어민주당 대표)이 이화영 전 경기도 " +
        "평화부지사와 공모해 김성태 전 쌍방울 회장에게 경기도가 북측에 약속한 스마트팜 사업비 " +
        "500만 달러와 도지사 방북 비용 300만 달러, 모두 800만 달러를 대신 내게 했다며 제3자 " +
        "뇌물·외국환거래법·남북교류협력법 위반 혐의로 기소했다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("seoul-0612")],
      verified: false,
    },
    {
      id: "claim-defense",
      text:
        "이 대통령 측은 혐의를 전면 부인하며, 800만 달러는 경기도와 무관하게 쌍방울이 " +
        "독자적으로 추진한 대북사업 비용이고 김 전 회장과 통화한 기억도 없다고 주장했다. " +
        "이 대통령은 기소 당일 \"검찰의 창작 수준이 갈수록 떨어지고 있다\"고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 측(기소 당시)",
      sourceIds: [s("seoul-0612")],
      verified: false,
    },
    {
      id: "claim-lee-final",
      text:
        "대법원 2부(주심 박영재 대법관)는 2025년 6월 5일 이화영 전 경기도 평화부지사 등의 " +
        "사건(2025도810)에서 피고인과 검사의 상고를 모두 기각해, 수원고등법원의 2024년 12월 " +
        "19일 판결(2024노620)을 확정했다. 대법원은 검사가 사전면담을 한 증인의 법정진술의 " +
        "신빙성 판단 등에 관한 이 전 부지사 측 상고이유를 받아들이지 않았다.",
      assertionType: "FACT",
      sourceIds: [s("scourt-2025do810")],
      verified: true,
    },
    {
      id: "claim-lee-hwayoung",
      text:
        "확정된 형은 징역 7년 8개월이다. 하급심은 쌍방울이 스마트팜 사업비와 도지사 방북비를 대납하려 한 혐의 대부분을 유죄로 봤고, " +
        "800만 달러 가운데 394만 달러를 불법 자금으로 인정했다.",
      assertionType: "FACT",
      sourceIds: [s("dailian-0605")],
      verified: false,
    },
    {
      id: "claim-separate",
      text:
        "이화영 전 부지사 사건의 피고인은 이 전 부지사 등 두 명이고, 이 대통령은 그 사건의 " +
        "피고인이 아니다. 이 판결은 이 대통령에 대한 판단이 아니다.",
      assertionType: "FACT",
      sourceIds: [s("scourt-2025do810")],
      verified: true,
    },
    {
      id: "claim-own-stage",
      text:
        "이 대통령 사건은 수원지법에서 공판준비기일 단계에 있었고, 이 대통령은 2025년 5월 27일 " +
        "공판준비기일에서 공소사실을 부인했다.",
      assertionType: "FACT",
      sourceIds: [s("dailian-0605")],
      verified: false,
    },
    {
      id: "claim-coaxing-court",
      text:
        "이화영 전 부지사 항소심은 검찰청 안 '연어·술파티' 회유 주장에 대해 교도관 다수 동행과 " +
        "영상녹화실 구조를 들어 \"납득하기 어렵다\"고 판단했다.",
      assertionType: "FACT",
      sourceIds: [s("newsis-1219")],
      verified: false,
    },
    {
      id: "claim-coaxing-tf",
      text:
        "서울고검 인권침해점검 TF는 2026년 5월 수원지검 수사 당시 검찰청에 소주가 반입됐고 " +
        "조사받던 이 전 부지사 등이 마셨다고 결론 내려 대검찰청에 보고했다. 이 결론이 진술 " +
        "회유까지 인정한 것인지는 보도에 나오지 않는다.",
      assertionType: "FACT",
      sourceIds: [s("khan-0505")],
      verified: false,
    },
    {
      id: "claim-prosecutor-reply",
      text:
        "박상용 검사는 TF가 자신을 한 차례도 조사하지 않고 결론을 냈다며 \"애초 결론 " +
        "정해놓고 하는 '답정너'의 수사였다\"고 반발했다.",
      assertionType: "CLAIM",
      assertedBy: "박상용 검사(당시 수사 검사)",
      sourceIds: [s("khan-0505")],
      verified: false,
    },
    {
      id: "claim-perjury-verdict",
      text:
        "수원지법 형사11부는 2026년 6월 이 전 부지사가 국회에서 한 '연어 술자리' 증언을 위증으로 " +
        "보고 국회증언감정법 위반으로 징역 4개월을 선고했다(1심, 배심원 7명 중 4명 유죄). " +
        "영상녹화실 관련자들의 진술은 일관되고 피고인 진술은 계속 바뀌었다고 봤다.",
      assertionType: "FACT",
      sourceIds: [s("chosun-0620")],
      verified: false,
    },
    {
      id: "claim-warrant",
      text:
        "서울중앙지법 유창훈 영장전담 판사는 2023년 9월 27일 백현동·대북송금 혐의의 구속영장을 " +
        "기각하면서, 대북송금 부분은 이 대통령의 인식이나 공모 여부, 관여 정도에 \"다툼의 " +
        "여지가 있다\"고 봤다. 구속할지를 정한 판단이고 유무죄 판단은 아니다.",
      assertionType: "FACT",
      sourceIds: [s("mt-0927")],
      verified: false,
    },
    {
      id: "claim-suspended",
      text:
        "수원지법 형사11부는 2025년 7월 22일 \"국정운영 계속성 등을 보장하기 위해\" 이 대통령의 " +
        "공판절차 기일을 추후 지정했다. 공범 이화영·김성태 씨의 재판은 따로 진행하기로 했다.",
      assertionType: "FACT",
      sourceIds: [s("newsis-0722")],
      verified: false,
    },
  ],
  critiqueIds: ["claim-lee-final", "claim-lee-hwayoung", "claim-coaxing-court", "claim-perjury-verdict"],
  timeline: [
    {
      id: "t-warrant",
      date: "2023-09-27",
      datePrecision: "day",
      title: "구속영장 기각",
      summary: "인식·공모 여부에 다툼의 여지가 있다고 했다.",
      claimIds: ["claim-warrant"],
    },
    {
      id: "t-charge",
      date: "2024-06-12",
      datePrecision: "day",
      title: "대북송금 기소",
      summary: "제3자 뇌물 등 세 혐의.",
      claimIds: ["claim-charge", "claim-defense"],
    },
    {
      id: "t-appeal",
      date: "2024-12-19",
      datePrecision: "day",
      title: "이화영 항소심 징역 7년 8개월",
      summary: "회유 주장을 받아들이지 않았다.",
      claimIds: ["claim-coaxing-court"],
    },
    {
      id: "t-final",
      date: "2025-06-05",
      datePrecision: "day",
      title: "이화영 형 확정",
      summary: "대통령 본인에 대한 판단은 아니다.",
      claimIds: ["claim-lee-final", "claim-lee-hwayoung", "claim-separate"],
    },
    {
      id: "t-suspend",
      date: "2025-07-22",
      datePrecision: "day",
      title: "대통령 재판 기일 추후 지정",
      summary: "이로써 다섯 재판이 모두 멈췄다.",
      claimIds: ["claim-suspended"],
    },
    {
      id: "t-tf",
      date: "2026-05",
      datePrecision: "month",
      title: "고검 TF '검찰청 술자리' 결론",
      summary: "소주 반입·음주를 인정. 수사 검사는 반발.",
      claimIds: ["claim-coaxing-tf", "claim-prosecutor-reply"],
    },
    {
      id: "t-perjury",
      date: "2026-06",
      datePrecision: "month",
      title: "이화영 '술자리 증언' 위증 1심 유죄",
      summary: "징역 4개월. 양쪽이 항소했다.",
      claimIds: ["claim-perjury-verdict"],
    },
  ],
  gaps: [
    "대법원 상고심 판결문(2025도810)과는 대조했다. 그 판결은 상고기각만 적고 있어, 형량·394만 달러·대납 판단이 담긴 수원고법 판결문(2024노620)은 아직 보지 못했다.",
    "이 대통령 사건의 공소장 원문은 보지 못했다.",
    "이 대통령이 송금을 미리 알았거나 승인했다는 검찰의 직접 증거가 무엇인지 1차 자료로 확인하지 못했다.",
    "고검 TF가 진술 회유 여부에 대해 어떤 결론을 냈는지 확인하지 못했다.",
    "이화영 위증 사건 항소심 결과는 아직 없다.",
  ],
  sources: sourcesFor(P, [
    "scourt-2025do810",
    "seoul-0612",
    "mt-0927",
    "dailian-0605",
    "newsis-1219",
    "khan-0505",
    "chosun-0620",
    "newsis-0722",
  ]),
};
