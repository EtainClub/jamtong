import type { PolicyInput } from "../schema";
import { sid, sourcesFor } from "./sources";

const P = "tr-el";
const s = (key: Parameters<typeof sid>[1]) => sid(P, key);

/**
 * 대통령 형사재판 ① 공직선거법 위반(허위사실 공표).
 *
 * 다섯 사건 가운데 대통령에게 가장 불리한 법원 판단(대법원 유죄 취지 파기환송)이
 * 나온 사건이다. 그 판단을 "비판과 한계"로 숨기지 않고 법원 판단 그대로 적는다.
 * 대통령 측에 유리한 사실 — 2심 무죄, 대법관 두 명의 반대의견, '몰랐다' 발언
 * 부분은 세 심급 모두 유죄로 보지 않았다는 것, 형이 확정되지 않았다는 것 — 도
 * 같은 무게로 적는다.
 *
 * ★ 대법원 보도자료(2025-05-01)와 대조했다.
 *   공소사실, 1·2심 판단, 다수의견·반대의견의 요지는 보도자료 원문으로 확인했다.
 *   반대의견을 낸 대법관의 이름, 1·2심 선고 날짜, 재판 중단은 보도 기준이다.
 */
export const TRIAL_ELECTION_LAW: PolicyInput = {
  slug: "trial-election-law",
  title: "대통령 재판 ① 공직선거법 위반",
  scope:
    "2021년 대선 과정의 김문기·백현동 관련 발언이 허위사실 공표인지를 다투는 재판의 경과와 쟁점",
  categories: ["institution"],
  asOf: "2026-10-13",
  claims: [
    {
      id: "claim-charge",
      text:
        "검찰은 2022년 9월 8일 이 대통령을 공직선거법상 허위사실 공표 혐의로 기소했다. 대선 " +
        "후보 시절 방송에서 '성남시장 때는 김문기를 몰랐다', '해외출장 중 김문기와 골프를 치지 " +
        "않았다'는 취지로, 국정감사에서 '국토부의 압박으로 백현동 부지 용도를 바꿨고 직무유기 " +
        "협박까지 받았다'는 취지로 거짓말을 했다는 것이다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("scourt-0501")],
      verified: true,
    },
    {
      id: "claim-defense-charge",
      text:
        "이 대통령 측은 2022년 9월 기소 당일 대변인을 통해 \"국민과 법원을 믿고 의연하게 " +
        "대처하겠다\"고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 측",
      sourceIds: [s("inews-0908")],
      verified: false,
    },
    {
      id: "claim-defense-first",
      text:
        "이 대통령은 1심 선고 직후 \"기본적인 사실인정부터 도저히 수긍하기 어려운 결론이기에 " +
        "항소하겠다\"며 \"현실의 법정은 아직 두 번 더 남아있고 민심과 역사의 법정은 " +
        "영원하다\"고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령(당시 더불어민주당 대표)",
      sourceIds: [s("tf-1115")],
      verified: false,
    },
    {
      id: "claim-dates",
      text:
        "1심 선고는 2024년 11월 15일 서울중앙지법 형사합의34부에서, 2심 선고는 2025년 3월 " +
        "26일 서울고등법원에서 있었다.",
      assertionType: "FACT",
      sourceIds: [s("tf-1115"), s("seoul-0326")],
      verified: false,
    },
    {
      id: "claim-golf",
      text:
        "문제가 된 첫 발언은 2021년 12월 29일 방송에서 한 \"그리고 국민의힘에서 4명 사진을 " +
        "찍어가지고 마치 제가 골프를 친 것처럼 사진을 공개했던데, 제가 확인을 해 보니까 전체 " +
        "우리 일행 단체 사진 중 일부를 떼 내 가지고 이렇게 보여줬더군요. 조작한 거지요.\"라는 " +
        "말이다(골프 발언).",
      assertionType: "FACT",
      sourceIds: [s("scourt-0501")],
      verified: true,
    },
    {
      id: "claim-baekhyeon",
      text:
        "두 번째는 2021년 10월 20일 경기도 국정감사에서 한 발언이다. 국토부가 혁신도시법상 " +
        "의무조항을 근거로 용도지역 변경을 요구해 불가피하게 백현동 부지를 녹지지역에서 " +
        "준주거지역으로 바꿨고, 따르지 않으면 직무유기를 문제 삼겠다는 협박까지 받았다는 " +
        "취지다(백현동 관련 발언).",
      assertionType: "FACT",
      sourceIds: [s("scourt-0501")],
      verified: true,
    },
    {
      id: "claim-first",
      text:
        "1심은 골프 발언과 백현동 관련 발언을 유죄로 보고 징역 1년, 집행유예 2년을 선고했다. " +
        "골프 발언을 뺀 나머지 김문기 관련 발언은 이유무죄로 판단했다.",
      assertionType: "FACT",
      sourceIds: [s("scourt-0501"), s("lawtimes-0501")],
      verified: true,
    },
    {
      id: "claim-appeal",
      text:
        "2심은 1심을 파기하고 공소사실 전부를 무죄로 판단했다. 골프 발언은 다의적으로 해석될 " +
        "여지가 있어 허위로 보기 어렵고, 백현동 관련 발언은 전체적으로 의견 표명이라고 봤다.",
      assertionType: "FACT",
      sourceIds: [s("scourt-0501"), s("ohmy-0501")],
      verified: true,
    },
    {
      id: "claim-knew",
      text:
        "'성남시장 재직 때는 김문기를 몰랐다'는 취지의 발언 등 골프 발언을 뺀 나머지 김문기 " +
        "관련 발언은 1심에서 이유무죄, 2심에서 무죄였고, 대법원도 이 부분의 원심 판단을 " +
        "수긍했다. 2심은 이를 피고인의 인식에 관한 발언일 뿐 행위에 관한 발언이 아니라고 봤다.",
      assertionType: "FACT",
      sourceIds: [s("scourt-0501")],
      verified: true,
    },
    {
      id: "claim-remand",
      text:
        "대법원 전원합의체(재판장 조희대 대법원장, 주심 박영재 대법관)는 2025년 5월 1일 " +
        "2025도4697 판결로 원심판결을 파기하고 사건을 서울고등법원에 돌려보냈다. 유죄 취지의 " +
        "파기환송이며, 형은 아직 정해지지 않았다. 노태악 대법관은 중앙선거관리위원장 겸직 등을 " +
        "고려해 재판에서 빠졌다.",
      assertionType: "FACT",
      sourceIds: [s("scourt-0501")],
      verified: true,
    },
    {
      id: "claim-majority",
      text:
        "다수의견 10명은 골프 발언이 선거인에게 '해외출장 기간 중 김문기와 골프를 치지 않았다'는 " +
        "뜻으로 읽히는데 실제로는 골프를 쳤으므로 허위라고 봤다. 백현동 관련 발언도 국토부의 " +
        "압박이나 직무유기 협박이 없었으므로 의견이 아닌 허위사실의 공표라고 봤다.",
      assertionType: "FACT",
      sourceIds: [s("scourt-0501")],
      verified: true,
    },
    {
      id: "claim-dissent",
      text:
        "반대의견 2명은 골프 발언이 '국민의힘에서 공개한 사진이 조작되었다'는 다른 의미로 " +
        "해석될 여지가 크고, 백현동 관련 발언은 전체적으로 의견 표명이라며 상고를 기각해야 " +
        "한다고 봤다. 다른 합리적 해석을 배제하는 것은 '의심스러울 때는 피고인에게 유리하게'라는 " +
        "형사법의 기본 원칙에 반한다고 했다.",
      assertionType: "FACT",
      sourceIds: [s("scourt-0501")],
      verified: true,
    },
    {
      id: "claim-dissent-names",
      text: "반대의견을 낸 두 대법관은 이흥구·오경미 대법관이다.",
      assertionType: "FACT",
      sourceIds: [s("lawtimes-0501"), s("ohmy-0501")],
      verified: false,
    },
    {
      id: "claim-suspended",
      text:
        "파기환송심을 맡은 서울고법 형사7부는 2025년 6월 9일 \"헌법 제84조에 따른 조치\"라며 " +
        "6월 18일로 잡혀 있던 기일을 추후 지정으로 바꿨다. 이 재판은 재판 중단 상태다.",
      assertionType: "FACT",
      sourceIds: [s("edaily-0609")],
      verified: false,
    },
  ],
  critiqueIds: ["claim-majority"],
  timeline: [
    {
      id: "t-charge",
      date: "2022-09-08",
      datePrecision: "day",
      title: "기소",
      summary: "대법원 보도자료가 밝힌 1심 공소제기일.",
      claimIds: ["claim-charge", "claim-defense-charge"],
    },
    {
      id: "t-first",
      date: "2024-11-15",
      datePrecision: "day",
      title: "1심 징역 1년·집행유예 2년",
      summary: "골프 발언과 백현동 관련 발언을 유죄로 봤다.",
      claimIds: ["claim-first", "claim-dates", "claim-defense-first"],
    },
    {
      id: "t-appeal",
      date: "2025-03-26",
      datePrecision: "day",
      title: "2심 전부 무죄",
      summary: "발언을 다의적이거나 의견 표명으로 봤다.",
      claimIds: ["claim-appeal", "claim-dates"],
    },
    {
      id: "t-remand",
      date: "2025-05-01",
      datePrecision: "day",
      title: "대법원 유죄 취지 파기환송",
      summary: "10 대 2. 형은 정해지지 않았다.",
      claimIds: ["claim-remand", "claim-majority", "claim-dissent"],
    },
    {
      id: "t-suspend",
      date: "2025-06-09",
      datePrecision: "day",
      title: "파기환송심 기일 추후 지정",
      summary: "헌법 제84조를 근거로 들었다.",
      claimIds: ["claim-suspended"],
    },
  ],
  gaps: [
    "대법원 판결 전문이 아니라 대법원 보도자료와 대조했다. 1·2심 판결문은 보지 못했다.",
    "1·2심 선고일과 재판부는 언론 보도 기준이다.",
    "반대의견 대법관의 이름은 보도자료에 없어 언론 보도 기준이다.",
    "파기환송심의 기일 변경 결정문은 확인하지 못했다.",
  ],
  sources: sourcesFor(P, [
    "scourt-0501",
    "lawtimes-0501",
    "ohmy-0501",
    "edaily-0609",
    "inews-0908",
    "tf-1115",
    "seoul-0326",
  ]),
};
