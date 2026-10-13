import type { PolicyInput } from "../schema";
import { sid, sourcesFor } from "./sources";

const P = "tr-cc";
const s = (key: Parameters<typeof sid>[1]) => sid(P, key);

/**
 * 대통령 형사재판 ⑤ 경기도 법인카드·관용차 예산 유용.
 *
 * ★ 경찰 불송치는 사실이지만 날짜가 주장마다 다르다.
 *   민주당 지도부는 기소 직후 "2022년 8월 경찰이 이미 불송치한 사건"이라고 했다.
 *   연합뉴스 보도로는 경찰이 2022년 8월 김혜경·배모 씨를 송치했고, 이 대통령은
 *   그해 12월 불송치했다. 사실 문장은 보도대로 쓰고, 민주당의 말은 주장으로 둔다.
 *
 * ★ 배우자 사건의 판결은 이 대통령에 대한 판단이 아니다.
 *   김혜경 씨의 기부행위 사건은 경기도 법인카드로 낸 식사 한 번을 다룬 별개
 *   사건이다. 이 대통령 재판에 대한 법원 판단은 아직 없으므로, 관련 판결은
 *   그 사실을 같은 문장에 적고 싣는다.
 */
export const TRIAL_CORPORATE_CARD: PolicyInput = {
  slug: "trial-corporate-card",
  title: "대통령 재판 ⑤ 경기도 법인카드",
  scope: "경기도지사 시절 법인카드·관용차 등 도 예산을 사적으로 썼다는 업무상 배임 혐의의 재판 경과와 쟁점",
  categories: ["institution"],
  asOf: "2026-10-13",
  claims: [
    {
      id: "claim-charge",
      text:
        "수원지검은 2024년 11월 19일 이재명 대통령(당시 더불어민주당 대표)을 업무상 배임 혐의로 " +
        "불구속 기소했다. 2018년 7월부터 2021년 10월까지 경기도 관용차를 사적으로 쓰고, " +
        "법인카드 등 경기도 예산으로 과일·샌드위치·세탁비·식사 대금을 냈다는 혐의다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("newsis-1119"), s("yna-1119")],
      verified: false,
    },
    {
      id: "claim-amount",
      text:
        "검찰이 추산한 이 대통령의 배임액은 1억 653만 원이다. 관용차 사적 사용 6,016만 원, " +
        "과일 2,791만 원, 샌드위치 685만 원, 세탁비 270만 원, 법인카드 사적 사용 889만 원을 " +
        "더한 것으로, 법인카드 결제액은 그중 일부다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("yna-1119"), s("newsis-1119")],
      verified: false,
    },
    {
      id: "claim-others",
      text:
        "같은 날 당시 비서실장 정모 씨와 별정직 공무원 배모 씨도 기소됐고, 배우자 김혜경 씨는 " +
        "기소유예 처분을 받았다.",
      assertionType: "FACT",
      sourceIds: [s("newsis-1119"), s("yna-1119")],
      verified: false,
    },
    {
      id: "claim-police",
      text:
        "경기남부경찰청은 2022년 8월 김혜경 씨와 배모 씨를 검찰에 송치했고, 이 대통령에 대해서는 " +
        "같은 해 12월 \"관여 정황이 확인되지 않는다\"는 취지로 불송치 결정했다. 검찰은 경찰이 " +
        "재수사 요청을 이행하지 않자 사건을 넘겨받아 다시 수사했고, 법인카드 관련 배임액을 경찰 " +
        "송치 때의 약 200만 원에서 889만 원으로 다시 산정했다.",
      assertionType: "FACT",
      sourceIds: [s("yna-1119")],
      verified: false,
    },
    {
      id: "claim-defense",
      text:
        "이 대통령은 기소 다음 날 \"증거는 없지만 기소한다, 이게 검찰의 입장\"이라며, 검찰이 " +
        "도지사가 일선 부서의 법인카드 사용이나 예산 집행을 알았을 가능성이 높다는 논리로 " +
        "기소했다고 비판했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령(당시 더불어민주당 대표)",
      sourceIds: [s("kbmaeil-1120")],
      verified: false,
    },
    {
      id: "claim-party",
      text:
        "더불어민주당은 \"명백한 억지 기소이자 야당 탄압\"이라고 했다. 조승래 수석대변인은 검찰이 " +
        "\"이 대표가 법인카드를 쓴 것도 아닌데 몰랐을 리 없다는 억지춘향식 논리\"를 들이밀었다며 " +
        "\"이미 경찰 수사에서 이 대표에게 혐의가 없다는 사실이 밝혀지기도 했다\"고 했다.",
      assertionType: "CLAIM",
      assertedBy: "더불어민주당",
      sourceIds: [s("dailian-1119")],
      verified: false,
    },
    {
      id: "claim-spouse-court",
      text:
        "이 사건과 별개로, 배우자 김혜경 씨는 2021년 8월 경기도 법인카드로 10만 4천 원 상당의 " +
        "식사를 제공한 공직선거법 위반(기부행위)으로 1심(2024년 11월 14일)과 항소심(2025년 5월 " +
        "12일)에서 벌금 150만 원을 선고받았다. 항소심은 김 씨가 배모 씨의 결제를 \"묵인 내지 " +
        "용인\"했다며 공모관계를 인정했고, 김 씨 측은 상고했다. 이 대통령에 대한 판단은 아니다.",
      assertionType: "FACT",
      sourceIds: [s("segye-1114"), s("dailian-0519")],
      verified: false,
    },
    {
      id: "claim-suspended",
      text:
        "수원지법에서 공판준비기일 단계에 있던 이 재판은 이 대통령 당선 뒤 기일이 추후 지정돼 " +
        "중단됐다. 이 대통령에 대한 1심 유무죄 판단은 없다.",
      assertionType: "FACT",
      sourceIds: [s("edaily-0609"), s("newsis-0722")],
      verified: false,
    },
  ],
  critiqueIds: ["claim-spouse-court"],
  timeline: [
    {
      id: "t-police",
      date: "2022-12",
      datePrecision: "month",
      title: "경찰, 이 대통령 불송치",
      summary: "관여 정황이 확인되지 않는다는 취지였다.",
      claimIds: ["claim-police"],
    },
    {
      id: "t-charge",
      date: "2024-11-19",
      datePrecision: "day",
      title: "업무상 배임 기소",
      summary: "검찰 추산 1억 653만 원.",
      claimIds: ["claim-charge", "claim-amount", "claim-party"],
    },
    {
      id: "t-spouse",
      date: "2025-05-12",
      datePrecision: "day",
      title: "김혜경 씨 기부행위 항소심 벌금 150만 원",
      summary: "별개 사건. 김 씨 측 상고.",
      claimIds: ["claim-spouse-court"],
    },
    {
      id: "t-suspend",
      date: "2025-07",
      displayDate: "2025년 6~7월",
      datePrecision: "circa",
      title: "공판준비기일 추후 지정",
      summary: "7월 1일로 잡혀 있던 기일 전후로 멈췄다.",
      claimIds: ["claim-suspended"],
    },
  ],
  gaps: [
    "공소장 원문을 보지 못해 항목별 금액은 언론 보도 기준이다.",
    "경찰 불송치 결정서는 보지 못했다. 민주당은 불송치 시점을 2022년 8월이라고 했지만 연합뉴스 보도로는 12월이다.",
    "김혜경 씨 사건의 상고심 결과는 확인하지 못했다.",
    "기일이 추후 지정된 정확한 날짜를 확인하지 못했다.",
  ],
  sources: sourcesFor(P, [
    "newsis-1119",
    "yna-1119",
    "dailian-1119",
    "kbmaeil-1120",
    "segye-1114",
    "dailian-0519",
    "edaily-0609",
    "newsis-0722",
  ]),
};
