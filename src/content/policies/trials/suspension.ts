import type { PolicyInput } from "../schema";
import { sid, sourcesFor } from "./sources";

const P = "tr-sp";
const s = (key: Parameters<typeof sid>[1]) => sid(P, key);

/**
 * 다섯 재판을 함께 둘러싼 것 — 헌법 제84조와 재판 중단, 그리고 2026년 수사 과정
 * 재조사와 조작기소 특검법 논의.
 *
 * ★ "조사 대상 선정"은 "조작 입증"이 아니다.
 *   검찰미래위가 사건을 골랐다는 것은 들여다보겠다는 뜻이다. 결과가 나오기 전까지
 *   그 이상으로 쓰지 않는다. 사건명에 결론이 담겼다는 비판도 같이 싣는다.
 */
export const TRIAL_SUSPENSION: PolicyInput = {
  slug: "trial-suspension",
  title: "대통령 재판 중단과 그 뒤",
  scope: "헌법 제84조에 따른 다섯 재판의 중단, 2026년 검찰 수사 과정 재조사와 조작기소 특검법 논의",
  ministries: ["법무부"],
  categories: ["institution"],
  asOf: "2026-10-13",
  claims: [
    {
      id: "claim-art84",
      text:
        "헌법 제84조는 \"대통령은 내란 또는 외환의 죄를 범한 경우를 제외하고는 재직 중 " +
        "형사상의 소추를 받지 아니한다\"고 정한다.",
      assertionType: "FACT",
      sourceIds: [s("constitution")],
      verified: true,
    },
    {
      id: "claim-art84-scope",
      text:
        "조문은 '소추'라는 말만 쓰고, 취임 전에 이미 시작된 재판을 어떻게 할지는 따로 정하지 " +
        "않았다. 그래서 진행 중이던 재판까지 멈춰야 하는지를 두고 해석이 갈린다.",
      assertionType: "FACT",
      sourceIds: [s("constitution"), s("newsis-0722")],
      verified: false,
    },
    {
      id: "claim-all-stopped",
      text:
        "2025년 7월 22일 대북송금 재판의 기일이 추후 지정되면서, 이 대통령이 당선 전 기소된 " +
        "다섯 형사재판이 모두 멈췄다. 위증교사 항소심은 대선 전에, 나머지는 당선 뒤에 기일이 " +
        "추후 지정됐다.",
      assertionType: "FACT",
      sourceIds: [s("newsis-0722")],
      verified: false,
    },
    {
      id: "claim-not-acquittal",
      text:
        "기일 추후 지정은 무죄 판결도 공소 취소도 아니다. 2026년 8월 보도에서도 이 재판들은 " +
        "재판부가 기일을 잡지 않아 중단된 상태다.",
      assertionType: "FACT",
      sourceIds: [s("inews-0814")],
      verified: false,
    },
    {
      id: "claim-lawyer",
      text: "이 대통령 측 변호인은 \"헌법 84조에 따라 어쩔 수 없이 중단될 수밖에 없지 않나 싶다\"고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "이 대통령 측 변호인(2025년 7월)",
      sourceIds: [s("newsis-0722")],
      verified: false,
    },
    {
      id: "claim-committee",
      text:
        "법무부는 2026년 6월 10일 검찰의 인권침해 및 검찰권 남용 의혹 사건의 진상규명을 위해 " +
        "검찰인권존중미래위원회(위원장 장주영 변호사 등 위원 7명)를 발족했다. 위원회는 같은 날 " +
        "쌍방울 대북송금·대장동·김용 전 민주연구원 부원장·위례 신도시·서해 공무원 피격·통계조작·" +
        "'윤석열 명예훼손' 허위보도 의혹 사건 등 7건을 1차 조사 대상으로 정했다.",
      assertionType: "FACT",
      sourceIds: [s("moj-0610"), s("nocut-0610")],
      verified: true,
    },
    {
      id: "claim-committee-more",
      text:
        "위원회는 2026년 8월 14일 경기도 법인카드·백현동·성남 FC 관련 의혹 사건 등 12건(국민 " +
        "제안 7건 포함)을 추가 조사 대상으로 정했다. 1차 대상과 합치면 이 대통령이 기소된 " +
        "사건과 겹치는 것은 대북송금·대장동·위례·백현동·성남FC·법인카드 6건이다.",
      assertionType: "FACT",
      sourceIds: [s("moj-0814"), s("moj-0610"), s("inews-0814")],
      verified: true,
    },
    {
      id: "claim-committee-scope",
      text:
        "위원회의 일은 사건 선정, 조사기구의 조사 결과를 통한 진상규명, 재발방지·피해회복 조치 " +
        "권고다. 조사 대상으로 정했다는 것은 들여다보겠다는 뜻이고, 2026년 10월 13일 현재 조사 " +
        "결과는 나오지 않았다.",
      assertionType: "FACT",
      sourceIds: [s("moj-0610"), s("moj-0814")],
      verified: false,
    },
    {
      id: "claim-committee-critique",
      text:
        "대북송금·대장동 수사를 지휘한 전 수원지검장·서울중앙지검장 4명은 2026년 7월 공동성명과 " +
        "입장문에서 검찰미래위 조사를 \"사법부 독립과 재판 공정성을 심각하게 훼손하는 " +
        "시도\"라고 비판했다.",
      assertionType: "CLAIM",
      assertedBy: "전 수원지검장·서울중앙지검장 4명",
      sourceIds: [s("inews-0814")],
      verified: false,
    },
    {
      id: "claim-president-request",
      text:
        "이 대통령은 2026년 9월 18일 기자회견에서 국회에 조작기소 특검의 권한 가운데 \"기존 " +
        "기소 사건의 이송 및 처분에 관한 조항을 삭제하고 진상 규명에만 집중해주길 바란다\"고 " +
        "요청했다. 악의적 수사 조작이 의심되는 사건은 특검으로 진상을 밝히는 게 맞다고도 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: [s("seoul-0918"), s("ilyo-1009")],
      verified: false,
    },
    {
      id: "claim-bill-delay",
      text:
        "더불어민주당은 2026년 4월 30일 대장동·대북송금 등 12개 사건의 조작기소 여부를 수사하는 " +
        "특검법을 발의했다. 9월 29일 의원총회에서 10월 1일 본회의 상정을 하지 않고 처리를 " +
        "국정감사 이후로 미뤘고, 구체적 날짜는 정하지 않았다.",
      assertionType: "FACT",
      sourceIds: [s("ilyo-1009")],
      verified: false,
    },
    {
      id: "claim-opposition",
      text:
        "국민의힘은 2026년 9월 29일 특검법 반대를 당론으로 정했다. 정점식 원내대표는 공소취소 " +
        "권한을 빼더라도 조작기소로 결론을 내려놓고 수사를 시키는 '공소취소 빌드업 특검'이라고 " +
        "비판했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘",
      sourceIds: [s("ilyo-1009")],
      verified: false,
    },
  ],
  critiqueIds: ["claim-committee-critique", "claim-opposition"],
  timeline: [
    {
      id: "t-all-stopped",
      date: "2025-07-22",
      datePrecision: "day",
      title: "다섯 재판 모두 중단",
      summary: "대북송금 재판까지 기일이 추후 지정됐다.",
      claimIds: ["claim-all-stopped"],
    },
    {
      id: "t-bill",
      date: "2026-04-30",
      datePrecision: "day",
      title: "조작기소 특검법 발의",
      summary: "12개 사건이 수사 대상이다.",
      claimIds: ["claim-bill-delay"],
    },
    {
      id: "t-committee",
      date: "2026-06-10",
      datePrecision: "day",
      title: "검찰미래위 출범",
      summary: "1차 조사 대상 7건.",
      claimIds: ["claim-committee"],
    },
    {
      id: "t-committee-more",
      date: "2026-08-14",
      datePrecision: "day",
      title: "조사 대상 12건 추가",
      summary: "대통령 기소 혐의 관련 사건이 6건이 됐다.",
      claimIds: ["claim-committee-more", "claim-committee-critique"],
    },
    {
      id: "t-request",
      date: "2026-09-18",
      datePrecision: "day",
      title: "대통령, 공소취소 조항 삭제 요청",
      summary: "진상 규명에만 집중해 달라고 했다.",
      claimIds: ["claim-president-request"],
    },
    {
      id: "t-delay",
      date: "2026-09-29",
      datePrecision: "day",
      title: "특검법 처리 국감 이후로",
      summary: "날짜는 정하지 않았다.",
      claimIds: ["claim-bill-delay"],
    },
  ],
  gaps: [
    "헌법 조문과 법무부 보도자료는 원문과 대조했다. 법원의 기일 변경 결정문과 대통령 기자회견 질의응답 녹취는 확인하지 못했다(대통령실이 공개한 모두발언에는 특검 관련 문장이 없다).",
    "검찰미래위 조사 결과는 아직 나오지 않았다.",
    "특검법의 현재 조문(공소취소 조항 삭제 반영 여부)을 국회 의안정보시스템에서 확인하지 못했다.",
  ],
  sources: sourcesFor(P, ["constitution", "moj-0610", "moj-0814", "newsis-0722", "inews-0814", "nocut-0610", "seoul-0918", "ilyo-1009"]),
};
