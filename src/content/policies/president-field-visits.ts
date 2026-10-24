import type { PolicyInput } from "./schema";

/**
 * 대통령 현장 방문과 경호.
 *
 * 대통령 X 게시물 답글에 "행사와 보여 주기만 다닌다", "경호원을 대동하고 운동회에 가서
 * 행사를 방해한다", "지지자에게만 가지 말라"는 말이 달린다(잼통 Voice). 대통령이 밝힌
 * 현장 방문의 취지, 실제로 다닌 곳, 그에 대한 비판을 나란히 적는다.
 *
 * ★ 현장 방문이 '보여 주기'인지는 평가라서 판정하지 않는다. 대통령의 설명은 CLAIM,
 *   야당 비판은 CLAIM으로 둔다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #67.
 */
export const PRESIDENT_FIELD_VISITS: PolicyInput = {
  slug: "president-field-visits",
  title: "대통령 현장 방문과 경호",
  scope:
    "이재명 대통령의 시장·골목·학교 현장 방문, 경호 최소화 방침, '품격'·'선거용'이라는 비판과 대통령의 설명",
  ministries: ["대통령실", "대통령경호처"],
  categories: ["institution"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-showing-off",
      text: "주식·부동산이 어려운데 국민의 시간과 세금을 들여 행사와 보여 주기만 다닌다",
      claimIds: ["claim-purpose", "claim-recent-visits", "claim-market-critique", "claim-market-reply"],
    },
    {
      id: "rumor-security",
      text: "경호원을 대동하고 아이들 운동회에 가서 행사를 방해한다",
      claimIds: ["claim-sports-day", "claim-purpose"],
    },
  ],
  claims: [
    {
      id: "claim-purpose",
      text:
        "이 대통령은 2026년 10월 10일 X에 \"품격없다 권위없다 비난하겠지만 경호를 최소화한 뒷골목 삶의 현장 " +
        "방문도, SNS소통도, 그분들의 언어로 교감하는 일도 계속할 것\"이라며, 권력은 낮은 곳으로 향해야 한다고 썼다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-x-20261010"],
      verified: true,
    },
    {
      id: "claim-sports-day",
      text:
        "대통령은 2026년 10월 22일 오전 전북 익산 왕궁초등학교 가을 운동회에 참여해 공 던지기 등 경기에 함께하고 " +
        "이어달리기 결승선 테이프를 잡았으며, 급식실에서 학생들과 점심을 먹었다. 청와대 대변인 서면 브리핑으로 " +
        "알려졌고, 대통령은 \"제가 초등학교 운동회에 한번 가보고 싶다고 했더니\"라며 방문 계기를 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20261023", "src-segye-visit-20261023"],
      verified: true,
    },
    {
      id: "claim-recent-visits",
      text:
        "같은 시기 대통령은 인천 계양 3기 신도시 공급 현장을 점검한 뒤 인근 전통시장과 골목상권을 둘러봤고, 부산 " +
        "북항 친수공원에서 시민들과 인사했다. YTN은 국무회의 생중계와 SNS 소통 방식을 둘러싼 논란 속에 현장 행보를 " +
        "늘리는 흐름으로 봤다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20261023"],
      verified: true,
    },
    {
      id: "claim-market-critique",
      text:
        "대통령은 6·3 지방선거를 앞둔 2026년 5월 26일 저녁 부산 자갈치시장을, 27일 남항시장을 찾았다. 26일은 서울 " +
        "서소문 고가차도 철거 현장에서 시민 3명이 숨진 날이다. 장동혁 국민의힘 대표는 \"어제는 서소문 사고가 " +
        "발생했는데도 자갈치시장에서 '회 파티'를 벌였다\"고 했고, 국민의힘 선대위는 \"노골적인 관권선거판\"이라고 " +
        "비판했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘",
      sourceIds: ["src-dailian-20260528"],
      verified: true,
    },
    {
      id: "claim-market-reply",
      text:
        "대통령은 5월 28일 수석보좌관회의에서 \"원래 저는 시장에서 밥 먹는 것을 좋아하니까 좀 이해하길 바란다\"며, " +
        "골목상권에는 경기 회복 효과가 닿지 않았다고 말했다. 서소문 사고에 대해서는 철저한 조사와 엄정한 책임을 " +
        "주문했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-heraldk-20260527"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-market-critique"],
  timeline: [
    {
      id: "t-market",
      date: "2026-05-26",
      datePrecision: "day",
      title: "부산 자갈치시장 방문, 야당 비판",
      summary: "지방선거 직전, 서소문 사고 당일.",
      claimIds: ["claim-market-critique", "claim-market-reply"],
    },
    {
      id: "t-post",
      date: "2026-10-10",
      datePrecision: "day",
      title: "\"경호 최소화한 현장 방문 계속\" X 게시",
      summary: "'품격' 비판에 대한 답.",
      claimIds: ["claim-purpose"],
    },
    {
      id: "t-sports-day",
      date: "2026-10-22",
      datePrecision: "day",
      title: "왕궁초 운동회 참여",
      summary: "청와대 서면 브리핑.",
      claimIds: ["claim-sports-day"],
    },
  ],
  gaps: [
    "운동회 방문 때 경호 인력 규모와, 행사 진행에 지장이 있었는지에 대한 보도나 학교 측 설명은 찾지 못했다.",
    "현장 방문 대상을 어떻게 고르는지(지지자 위주라는 주장 포함)에 대한 대통령실 기준이나 통계는 공개된 것이 없다.",
    "현장 방문에 드는 경호·의전 비용은 공개 자료로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-x-20261010",
      title: "대통령은 국민의 제1공복 — 현장 방문과 SNS 소통에 관한 글",
      publisher: "이재명 대통령 X",
      url: "https://x.com/i/status/2108912234709884950",
      publishedAt: "2026-10-10",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-ytn-20261023",
      title: "이 대통령, 초등학교 가을 운동회 깜짝 방문...소통 행보 강화",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202610230424312285",
      publishedAt: "2026-10-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-visit-20261023",
      title: "李 대통령, 초등학교 운동회 '깜짝 방문'…\"이겨라\" 응원하고 경기도 참여",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20261023502815",
      publishedAt: "2026-10-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-20260528",
      title: "지선 코앞 이틀 연속 부산 누빈 李대통령…野 \"서소문 사고 당일 회 파티\"",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1649408",
      publishedAt: "2026-05-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20260527",
      title: "李대통령 \"원래 시장에서 밥먹는 것 좋아해…이해하길 바라\"",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026052721585168100",
      publishedAt: "2026-05-28",
      type: "press",
      license: "link-only",
    },
  ],
};
