import type { PolicyInput } from "./schema";

/**
 * 재난·사고 때 대통령의 일정과 대응: 골프 의혹, 순직·참사 추모 기록.
 *
 * 대통령 X 글 여럿에 "참사가 날 때마다 골프장에 있었다", "대구 천장 붕괴와 해군 장병 실종
 * 때 골프를 쳤다", "순직 소방관을 외면했다", "무안 참사와 천안함은 외면한다"는 답글이 달렸다
 * (잼통 Voice). 각각의 날에 무엇이 있었고, 야당이 무엇을 주장했으며, 청와대가 무엇이라고
 * 했는지 나란히 적는다.
 *
 * ★ 이 페이지는 의혹과 해명을 함께 싣고 어느 쪽이 맞다고 판정하지 않는다. 확인된 사실은
 *   청와대가 스스로 밝힌 범위(10월 10일 태릉 골프장 방문)까지다.
 * ★ 비무장지대 지뢰 사고는 policy:dmz-mine-2026, 소방 재정은 policy:firefighter-finance에 있다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #95, #96.
 */
export const PRESIDENT_DISASTER_RESPONSE: PolicyInput = {
  slug: "president-disaster-response",
  title: "재난·사고 때 대통령의 일정과 대응: 골프 의혹과 추모 기록",
  scope:
    "2026년 7월 해군 승조원 실종일과 10월 대구 상가 천장 붕괴일의 대통령 골프 의혹과 청와대 해명, 부천 화재 순직 소방관 추모 경과, 무안 제주항공 참사 1주기와 서해수호의 날 참석",
  ministries: ["청와대", "국방부"],
  categories: ["disaster"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-golf-always",
      text: "대통령은 참사가 날 때마다 일은 하지 않고 골프장에 있었다",
      claimIds: ["claim-daegu-golf", "claim-navy", "claim-navy-response"],
    },
    {
      id: "rumor-daegu-navy",
      text: "대구 천장 붕괴 사고와 해군 장병 실종 수색 때 대통령은 골프장에 있었다",
      claimIds: ["claim-daegu", "claim-daegu-order", "claim-daegu-golf", "claim-daegu-defense", "claim-navy", "claim-navy-response"],
    },
    {
      id: "rumor-firefighter",
      text: "순직 소식을 다른 행사 글에 몇 줄 덧붙였다가 비판을 받고서야 따로 긴 추모 글을 올렸다",
      claimIds: ["claim-firefighter"],
    },
    {
      id: "rumor-muan-cheonan",
      text: "민주화 희생자 앞에서는 눈물을 보이면서 무안공항 참사와 천안함 희생자는 외면한다",
      claimIds: ["claim-muan", "claim-west-sea"],
    },
  ],
  claims: [
    {
      id: "claim-daegu",
      text:
        "2026년 10월 10일 오전 10시 16분께 대구 북구 관음동 4층 상가 2층에서 천장 마감재가 무너졌다. 현장에 있던 " +
        "66명이 대피했고 38명이 경상을 입었으며, 부상자 모두 생명에는 지장이 없었다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-1165293"],
      verified: true,
    },
    {
      id: "claim-daegu-order",
      text:
        "청와대는 사고 당일 강유정 수석대변인 명의로, 대통령이 경찰청장 직무대행에게 상황을 보고받고 인명 구조와 사고 " +
        "수습에 만전을 기하도록 관계기관에 지시했다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "청와대",
      sourceIds: ["src-wikitree-1165293"],
      verified: true,
    },
    {
      id: "claim-daegu-golf",
      text:
        "국민의힘 주진우 의원이 대통령이 그날 가족과 골프를 쳤다고 문제를 제기하자, 청와대는 11일 \"이재명 대통령은 " +
        "지난 10일 가족과 함께 태릉 골프장을 찾았다\", \"대통령은 현장에서 대구에서 발생한 상가 천장 붕괴 사고를 보고 " +
        "받았다\"고 밝혔다. 사적인 비공개 일정을 정치 공방에 쓰는 데 유감을 표했다.",
      assertionType: "CLAIM",
      assertedBy: "청와대",
      sourceIds: ["src-wikitree-1165293"],
      verified: true,
    },
    {
      id: "claim-daegu-defense",
      text:
        "민주당은 대통령이 민간 시설이 아닌 24시간 대비태세가 유지되는 군 체력단련장에서 보고를 받았다며 국민의힘의 " +
        "공세를 '정쟁 목적의 비방'이라고 했다. 국민의힘 장동혁 대표는 '직무 포기'라고 비판했다.",
      assertionType: "OPINION",
      sourceIds: ["src-ytn-20261012"],
      verified: true,
    },
    {
      id: "claim-navy",
      text:
        "2026년 7월 12일 동해 북방한계선 인근에서 경비 임무를 하던 해군 함정 승조원 1명이 아침 당직에 나오지 않아 " +
        "실종이 확인됐고, 13일 새벽 숨진 채 발견됐다. 국민의힘 나경원 의원은 대통령과 안규백 국방부 장관이 그날 오전 " +
        "11시쯤부터 골프를 쳤다고 주장하며 보고 기록과 골프장 출입 기록 공개를 요구했다.",
      assertionType: "FACT",
      sourceIds: ["src-newdaily-20260714"],
      verified: true,
    },
    {
      id: "claim-navy-response",
      text:
        "국방부는 안 장관의 골프 의혹을 부인하며 장관이 공관에서 해군 상황을 관리하는 등 통상 업무를 했다고 했다. " +
        "청와대는 대통령의 그날 일정에 대해 별도 공식 입장을 내지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "국방부",
      sourceIds: ["src-newdaily-20260714"],
      verified: true,
    },
    {
      id: "claim-firefighter",
      text:
        "부천 공장 화재(10월 16일)에서 구조된 소방관은 17일 0시 55분께 숨졌다. 대통령은 같은 날 오전 10시께 X에 " +
        "「고인의 희생을 잊지 않겠습니다」를 올렸고, 그날 빈소를 찾아 조문했다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-1166953", "src-wikitree-1167019"],
      verified: true,
    },
    {
      id: "claim-muan",
      text:
        "대통령은 무안 제주항공 여객기 참사 1주기(2025년 12월 29일)를 앞두고 영상 추모사에서 대통령으로서 깊이 사죄하고, " +
        "항공철도사고조사위원회의 독립성·전문성을 강화하고 유가족을 종합 지원하겠다고 했다. 2025년 7월에는 제주항공 " +
        "참사와 세월호·이태원·오송 참사 유가족을 초청해 정부를 대표해 사과했다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20251228"],
      verified: true,
    },
    {
      id: "claim-west-sea",
      text:
        "대통령은 2026년 3월 27일 대전현충원에서 열린 제11회 서해수호의 날 기념식에 참석해 \"55인의 서해 수호 영웅들에게 " +
        "머리 숙여 깊은 경의와 추모의 마음을 전합니다\"라고 했다. 하루 앞선 천안함 16주기 추모식은 해군 2함대사령관이 " +
        "주관했고 대통령은 참석하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-rfa-20260327", "src-rfa-20260326"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "유가족 측은 무안 참사 1주기에 국가가 아직 누구에게도 책임을 묻지 않았고 정보를 공개하지 않는다고 비판했다. " +
        "골프 의혹에 대해 국민의힘은 대통령이 실종일 행적을 밝히지 않는다고 비판했다.",
      assertionType: "OPINION",
      sourceIds: ["src-heraldk-20251228", "src-newdaily-20260714"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-daegu-defense", "claim-critique"],
  timeline: [
    {
      id: "t-muan",
      date: "2025-12-29",
      datePrecision: "day",
      title: "무안 참사 1주기, 대통령 영상 추모사",
      summary: "대통령으로서 사죄.",
      claimIds: ["claim-muan"],
    },
    {
      id: "t-west-sea",
      date: "2026-03-27",
      datePrecision: "day",
      title: "서해수호의 날 기념식 참석",
      summary: "취임 후 처음.",
      claimIds: ["claim-west-sea"],
    },
    {
      id: "t-navy",
      date: "2026-07-12",
      datePrecision: "day",
      title: "해군 승조원 실종, 골프 의혹 제기",
      summary: "청와대 공식 입장 없음.",
      claimIds: ["claim-navy", "claim-navy-response"],
    },
    {
      id: "t-daegu",
      date: "2026-10-10",
      datePrecision: "day",
      title: "대구 상가 천장 붕괴, 대통령 태릉 골프장",
      summary: "청와대 \"현장에서 보고 받았다\".",
      claimIds: ["claim-daegu", "claim-daegu-order", "claim-daegu-golf"],
    },
    {
      id: "t-firefighter",
      date: "2026-10-17",
      datePrecision: "day",
      title: "순직 소방관 추모 글, 빈소 조문",
      summary: "숨진 지 약 9시간 뒤 글.",
      claimIds: ["claim-firefighter"],
    },
  ],
  gaps: [
    "7월 12일 대통령의 실제 일정과 실종 보고 시점은 공개된 자료로 확인하지 못했다.",
    "'순직 소식을 다른 글에 몇 줄 덧붙였다'는 답글이 가리키는 글은 찾지 못했다. 대통령의 단독 추모 글은 17일 오전에 올라왔다.",
    "해외 순방 비용과 횟수는 이 페이지에서 정리하지 못했다.",
    "대통령의 무안 참사 유가족 직접 면담 기록(2026년)은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-wikitree-1165293",
      title: "靑 \"이 대통령, 대구 상가 붕괴 당일 가족과 골프장…현장서 보고 받아\"",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1165293",
      publishedAt: "2026-10-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20261012",
      title: "국힘 '직무포기'·민주 '막말 그만'...'골프 공방' 격화",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202610121811564250",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newdaily-20260714",
      title: "李 대통령, '소총 보도'엔 '조작·정치 공격' … '해군 실종일 골프 의혹'엔 침묵",
      publisher: "뉴데일리",
      url: "https://www.newdaily.co.kr/site/data/html/2026/07/14/2026071400133.html",
      publishedAt: "2026-07-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-wikitree-1166953",
      title: "\"참담한 마음…\" 부천 화재 소방관 순직에 이재명 대통령이 올린 글 (전문)",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1166953",
      publishedAt: "2026-10-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-wikitree-1167019",
      title: "[속보] 이 대통령, 부천 공장 화재 순직 소방관 빈소 조문",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1167019",
      publishedAt: "2026-10-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20251228",
      title: "무안 제주항공 참사 1년 맞아 李 \"대통령으로서 깊은 사죄\"",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2025122818210861679",
      publishedAt: "2025-12-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-rfa-20260327",
      title: "서해 수호의 날...이 대통령 \"평화가 최고의 안보\"",
      publisher: "자유아시아방송",
      url: "https://www.rfa.org/korean/in-focus/2026/03/27/south-korea-president-west-sea-defense-day/",
      publishedAt: "2026-03-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-rfa-20260326",
      title: "천안함 46용사 16주기 추모식...\"해양안보 굳건히 수호\"",
      publisher: "자유아시아방송",
      url: "https://www.rfa.org/korean/in-focus/2026/03/26/south-korea-naval-ship-cheonan-16th/",
      publishedAt: "2026-03-26",
      type: "press",
      license: "link-only",
    },
  ],
};
