import type { PolicyInput } from "./schema";

/**
 * 공적임대주택의 규칙: 최저주거면적, LH 매입임대 기준, 임대 조건, 불법 전대 처벌, 재개발 원주민 우선입주.
 *
 * 2026년 11월 25일 대통령 X 게시물(공적주택 현장간담회) 답글에 달린 요청 다섯 가지를 모았다(잼통 Voice):
 * 1인 가구 최소 주거면적 상향(이슈 #317), LH 매입임대 규제 완화(#318), 공공임대 보증금 부담(#319),
 * 공적주택 부정 사용 처벌(#320), 재개발 원주민 재정착(#322).
 *
 * ★ 최저주거기준 상향은 연구진 제안이며 정부 확정안이 아니다.
 * ★ 원주민 우선입주 확대는 입법예고 단계다.
 * ★ 공급 계획·재원·LH 부채는 policy:public-housing-240k에 있다.
 * ★ 2026-11-28 처음 등록 — 잼통 Voice 이슈 #317~#320, #322.
 */
export const PUBLIC_RENTAL_RULES: PolicyInput = {
  slug: "public-rental-rules",
  title: "공적임대주택의 규칙: 면적·매입·임대 조건·불법 전대·원주민 우선입주",
  scope:
    "최저주거기준 개선 논의(2026년 11월 20일 토론회), LH 매입임대 가격·심의 기준 개편(2026년 3월), 영구임대·행복주택·통합공공임대의 임대 조건과 수급자 입주 대상, 공공주택 특별법의 불법 양도·전대 처벌과 입주 자격 제한, 공공재개발 원주민의 인근 공공임대 우선입주 확대 입법예고(2026년 11월 24일)",
  ministries: ["국토교통부", "한국토지주택공사"],
  categories: ["welfare", "region", "institution"],
  asOf: "2026-11-28",
  rumors: [
    {
      id: "rumor-min-area",
      text: "통로 같은 좁은 원룸을 막도록 1인 가구 최소 주거면적 기준을 높여 달라",
      claimIds: ["claim-min-area", "claim-mid-size"],
    },
    {
      id: "rumor-purchase",
      text: "이미 준공된 주택도 진입도로 소유 문제 같은 규정 때문에 LH가 매입하지 못하니 매입임대 규제를 풀어야 한다",
      claimIds: ["claim-purchase-reform"],
    },
    {
      id: "rumor-deposit",
      text: "행복주택 보증금이 수급자에게도 수천만 원이라 기댈 곳 없는 서민은 공공임대에 들어갈 수 없다",
      claimIds: ["claim-rent-levels", "claim-happy-housing"],
    },
    {
      id: "rumor-penalty",
      text: "공적주택을 사무실·투기·사기 목적으로 쓰는 사람은 거액 벌금과 징역으로 엄하게 처벌해야 한다",
      claimIds: ["claim-sublet-ban", "claim-penalty", "claim-eligibility-ban"],
    },
    {
      id: "rumor-resettle",
      text: "재개발 때 집 한 채 가진 원주민이 공적주택을 받아 동네에 남을 수 있게 해 달라",
      claimIds: ["claim-resettle"],
    },
  ],
  claims: [
    {
      id: "claim-min-area",
      text:
        "국토교통부가 2026년 11월 20일 연 주거복지정책 토론회에서 서지은 영남대 교수가 최저주거기준 개선 방안을 발표했다. 1인 가구 최저주거면적을 현행 14㎡에서 17㎡·19㎡·21㎡로 넓히는 세 가지 대안이며, " +
        "2인 가구는 26㎡에서 27~32㎡, 4인 가구는 43㎡에서 45~54㎡로 함께 올리는 안이다. 연구진 제안이며 정부의 확정안은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-20261120"],
      verified: true,
    },
    {
      id: "claim-mid-size",
      text: "국토교통부는 11월 25일 공적주택 현장간담회에서 공적임대주택의 중형 평형 비중을 기존 20% 미만에서 40% 이하로 늘리겠다는 목표를 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부",
      sourceIds: ["src-asiae-20261125-rental"],
      verified: true,
    },
    {
      id: "claim-purchase-reform",
      text:
        "LH는 2026년 3월 매입임대 제도를 고쳤다. 신축 매입약정의 매입가격은 감정평가로만 산정하고, 매입 심의는 외부 전문가 토의 대신 계량평가(서류심사: 임대수요·교통·생활편의·재무영향, " +
        "매입심의: 입지·건축계획·가격·공공성)로 바꿨으며, 서류 접수 뒤 6개월 안에 결과를 알리도록 했다. 2026년 매입 목표는 3만 8,224가구(수도권 3만 1,014가구)다. 기존주택 매입은 전년 기준을 유지한다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260318"],
      verified: true,
    },
    {
      id: "claim-rent-levels",
      text:
        "정부 마이홈포털에 따르면 영구임대는 생계급여·의료급여 수급자 등 최저소득 계층이 대상이고 보증금과 임대료가 시세의 30% 수준으로, 공공임대 가운데 가장 낮다. " +
        "국민임대와 행복주택은 시세의 60~80%, 통합공공임대는 소득에 따라 시세의 35~90% 수준이다.",
      assertionType: "FACT",
      sourceIds: ["src-myhome-rental", "src-myhome-happy"],
      verified: true,
    },
    {
      id: "claim-happy-housing",
      text:
        "행복주택은 주거급여 수급자도 입주 대상(최대 20년 거주)이지만, 공급의 80%가 대학생·청년·신혼부부 몫이고 임대 조건은 '공급대상자별 시중시세의 60~80% 수준'이다. " +
        "마이홈포털은 수급자에게 따로 적용하는 보증금 비율을 밝히지 않는다. 보증금은 단지 시세에 따라 정해지므로 수도권 단지에서는 수급자에게도 부담이 클 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-myhome-happy"],
      verified: false,
      limit: "단지별 수급자 보증금 실제 금액은 모집공고로 확인하지 못했다. 마지막 문장은 임대 조건 구조에서 나오는 추론이다.",
    },
    {
      id: "claim-sublet-ban",
      text:
        "공공주택 특별법 제49조의4는 공공임대주택 임차인이 임차권을 양도하거나 집을 다른 사람에게 전대할 수 없다고 정한다. 근무·생업·질병치료 등 대통령령으로 정하는 경우로서 공공주택사업자의 동의를 받은 때만 예외다.",
      assertionType: "FACT",
      sourceIds: ["src-law-public-housing-act"],
      verified: true,
    },
    {
      id: "claim-penalty",
      text:
        "같은 법 제57조의3에 따라 거짓이나 부정한 방법으로 임대주택을 임대받거나 임대받게 한 자, 공공임대주택을 불법 양도·전대한 자와 이를 알선한 자는 3년 이하의 징역 또는 3천만 원 이하의 벌금에 처한다. " +
        "얻은 이익의 3배까지 벌금을 매기는 가중 조항은 지분적립형·이익공유형 분양주택의 불법 전매 등에만 적용되고 임대주택 전대에는 적용되지 않는다. 법인 등은 제59조에 따라 함께 벌금형을 받는다.",
      assertionType: "FACT",
      sourceIds: ["src-law-public-housing-act"],
      verified: true,
    },
    {
      id: "claim-eligibility-ban",
      text: "제49조의8에 따라 국토교통부장관이나 지방자치단체장은 불법 양도·전대한 임차인의 공공임대주택 입주 자격을 4년 범위에서 제한할 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-law-public-housing-act"],
      verified: true,
    },
    {
      id: "claim-resettle",
      text:
        "국토교통부는 2026년 11월 24일 공공주택 특별법 시행령·시행규칙 개정안을 2027년 1월 4일까지 입법예고했다. 공공재개발 등으로 기존 주택이 철거되는 소유자와 세입자가 사업 기간에 " +
        "같은 특별시·광역시 안 인근 공공임대주택에 우선 입주할 수 있는 물량 한도를 지금의 30% 이내에서 30%를 넘겨 적용할 수 있게 하는 내용이다. 보상 협의 뒤 4개월 안에 지장물을 넘기면 보상액의 최대 30%를 " +
        "협조장려금으로 더 주는 방안도 함께 담겼다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-20261124"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-happy-housing"],
  timeline: [
    {
      id: "t-purchase",
      date: "2026-03-18",
      datePrecision: "day",
      title: "LH 매입임대 제도 개편",
      summary: "감정평가 일원화·계량평가.",
      claimIds: ["claim-purchase-reform"],
    },
    {
      id: "t-min-area",
      date: "2026-11-20",
      datePrecision: "day",
      title: "최저주거기준 개선 토론회",
      summary: "1인 14㎡ → 17~21㎡ 제안.",
      claimIds: ["claim-min-area"],
    },
    {
      id: "t-resettle",
      date: "2026-11-24",
      datePrecision: "day",
      title: "원주민 우선입주 확대 입법예고",
      summary: "2027년 1월 4일까지.",
      claimIds: ["claim-resettle"],
    },
  ],
  gaps: [
    "최저주거기준 개정의 정부 확정안과 시행 시점은 나오지 않았다(11월 28일 기준).",
    "LH 매입 공고의 진입도로·사도 관련 매입 제외 요건이 2026년 공고에서 어떻게 정해졌는지는 원문으로 확인하지 못했다. 2024년 공고에 진입도로 미확보·사도 주택을 제외하는 조항이 있었다는 정리가 있으나 대조하지 못했다.",
    "수급자가 행복주택에 입주할 때 내는 보증금의 실제 수준과 전국 단위 보증금 지원 제도는 확인하지 못했다. 일부 지자체가 수급자 공공임대 보증금 무이자 융자를 운영한다는 보도만 있다.",
    "공공임대를 사무실 등 주거 외 용도로 쓰는 것 자체를 처벌하는 별도 조항, 그리고 불법 전대 적발·처벌 통계는 찾지 못했다.",
    "입법예고안은 사업 기간 중 임시 거주를 위한 것이다. 원주민 소유자가 사업 뒤 공적주택을 받아 동네에 계속 사는 제도는 이 페이지에서 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-dailian-20261120",
      title: "\"혼자 살아도 14㎡는 좁다\"…1인 가구 최저주거면적 21㎡ 확대 제안",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1717823/",
      publishedAt: "2026-11-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20261125-rental",
      title: "李대통령 \"공적주택 年 24만호 공급 속도…투기 진원지 안 되도록\"(종합)",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026112516334172550",
      publishedAt: "2026-11-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260318",
      title: "'너무 비싸게 산다' 지적에 LH, 매입임대 가격 기준 바꾼다",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202603181639001",
      publishedAt: "2026-03-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-myhome-rental",
      title: "임대주택소개",
      publisher: "마이홈포털(국토교통부)",
      url: "https://www.myhome.go.kr/hws/portal/cont/selectContRentalHouseView.do",
      type: "official",
      license: "public",
    },
    {
      id: "src-myhome-happy",
      title: "행복주택",
      publisher: "마이홈포털(국토교통부)",
      url: "https://www.myhome.go.kr/hws/portal/cont/selectHappyHouseView.do",
      type: "official",
      license: "public",
    },
    {
      id: "src-law-public-housing-act",
      title: "공공주택 특별법 제49조의4·제49조의8·제57조의3·제59조 (시행 2026. 9. 8.)",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/법령/공공주택특별법",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-etoday-20261124",
      title: "정부, 공공택지 보상 협조 시 장려금 최대 30% 지급",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2651993",
      publishedAt: "2026-11-24",
      type: "press",
      license: "link-only",
    },
  ],
};
