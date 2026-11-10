import type { PolicyInput } from "./schema";

/**
 * 철원 국도 자주포 추돌 사망 사고와 수사 (2026년 11월).
 *
 * 11월 대통령 X 게시물 답글에 "K9 자주포가 호송과 교통 통제 없이 도로를 달리다 사망 사고가 났는데 정부 대응이 보이지 않는다"는
 * 지적이 달렸다(잼통 Voice). 사고 경위·수사·군 입장을 보도 기준으로 적는다.
 *
 * ★ 2026-11-11 처음 등록 — 잼통 Voice 이슈 #281.
 */
export const CHEORWON_HOWITZER_CRASH: PolicyInput = {
  slug: "cheorwon-howitzer-crash",
  title: "철원 국도 자주포 추돌 사망 사고와 군 장비 도로 이동 안전 (2026년 11월)",
  scope: "11월 5일 강원 철원 43번 국도에서 야간 이동하던 육군 자주포에 승용차 2대가 추돌한 사고의 경위, 경찰 수사, 육군 입장",
  ministries: ["국방부", "육군", "경찰청"],
  categories: ["diplomacy", "institution"],
  asOf: "2026-11-11",
  rumors: [
    {
      id: "rumor-no-escort",
      text: "K9 자주포가 호송과 교통 통제 없이 도로를 달리다 사망 사고가 났는데 정부 대응이 보이지 않는다",
      claimIds: ["claim-vehicle", "claim-visibility", "claim-investigation", "claim-army"],
    },
  ],
  claims: [
    {
      id: "claim-crash",
      text:
        "2026년 11월 5일 저녁 강원 철원군 청양리 일대 43번 국도에서 훈련을 마치고 부대로 복귀하던 육군 자주포에 승용차 2대가 차례로 추돌했다. " +
        "첫 추돌 차량 운전자(28)가 숨지고 뒤 차량 운전자(57)가 다쳤으며, 자주포에 탄 장병 7명 가운데 일부가 가벼운 찰과상을 입었다. " +
        "사고는 10일 군 당국 발표로 알려졌다. 사고 시각은 보도에 따라 오후 7시께와 오후 8시 57분께로 엇갈린다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-2026111085427", "src-hankookilbo-20261110", "src-mt-20261110"],
      verified: true,
    },
    {
      id: "claim-vehicle",
      text: "군 당국 발표를 옮긴 보도에 따르면 사고 장비는 K9이 아니라 K55A1 자주포다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-2026111085427", "src-genews-20261110"],
      verified: true,
    },
    {
      id: "claim-visibility",
      text:
        "공개된 블랙박스 영상에는 가로등이 없는 어두운 도로와 잘 보이지 않는 자주포 후면 표시등이 담겼다. 자주포는 시속 27km 안팎으로 달린 것으로 전해졌다(제한속도 70km). " +
        "호위 차량 배치나 교통 통제가 있었는지는 군이 밝히지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-hankookilbo-20261110", "src-mt-20261110", "src-genews-20261110"],
      verified: true,
    },
    {
      id: "claim-investigation",
      text:
        "경찰은 군사경찰과 함께 자주포 대열 간 거리·주행 속도에 관한 운행 규정과 매뉴얼, 안전조치가 제대로 이뤄졌는지를 확인하고 있다. " +
        "민간 차량의 사고 당시 속도를 보려고 국립과학수사연구원에 사고기록장치(EDR) 감정을 의뢰했고, 탑승 장병과 지휘관을 조사할 방침이다.",
      assertionType: "FACT",
      sourceIds: ["src-genews-20261110"],
      verified: true,
    },
    {
      id: "claim-army",
      text: "육군은 \"경찰이 정확한 사고 경위와 원인을 수사 중이며, 군은 경찰 수사에 적극 협조할 예정\"이라고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "육군",
      sourceIds: ["src-hankyung-2026111085427", "src-genews-20261110"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "교통사고 전문 한문철 변호사는 영상 분석에서 자주포가 경광등을 켜거나 호위 차량을 붙였어야 한다고 지적하면서, 승용차의 주행 속도도 문제로 봤다. " +
        "유족은 국가를 상대로 손해배상 소송을 낼 예정인 것으로 알려졌다.",
      assertionType: "OPINION",
      assertedBy: "한문철 변호사(보도)",
      sourceIds: ["src-mt-20261110"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-visibility", "claim-critique"],
  timeline: [
    {
      id: "t-crash",
      date: "2026-11-05",
      datePrecision: "day",
      title: "철원 43번 국도 추돌",
      summary: "민간인 1명 사망.",
      claimIds: ["claim-crash"],
    },
    {
      id: "t-disclosed",
      date: "2026-11-10",
      datePrecision: "day",
      title: "군 당국 발표, 경찰 수사",
      summary: "운행 규정·안전조치 확인, EDR 감정.",
      claimIds: ["claim-investigation", "claim-army"],
    },
  ],
  gaps: [
    "국방부·육군이 재발 방지 대책(야간 궤도차량 이동 기준, 호위 차량·교통 통제 의무 등)을 내놓았는지는 11월 11일까지 보도에서 확인되지 않았다.",
    "군 궤도차량이 일반 도로를 이동할 때 따르는 운행 규정과 매뉴얼의 내용은 공개되지 않았다.",
    "사고 당일 호위 차량 배치·교통 통제 여부는 군이 공식 확인하지 않았다.",
    "경찰 수사의 결론(책임 소재)은 아직 나오지 않았다.",
  ],
  sources: [
    {
      id: "src-hankyung-2026111085427",
      title: "훈련 마치고 복귀하던 자주포…민간 차량 2대 연쇄 추돌 2명 사상",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026111085427",
      publishedAt: "2026-11-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankookilbo-20261110",
      title: "밤길 국도 나타난 자주포에 3중 추돌...민간인 운전자 1명 사망",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026111019510004253",
      publishedAt: "2026-11-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-genews-20261110",
      title: "자주포 안전조치 적절했나…철원 3중추돌 경찰 수사",
      publisher: "글로벌이코노믹",
      url: "https://www.g-enews.com/article/General-News/2026/11/202611101856471983740eacf404_1",
      publishedAt: "2026-11-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20261110",
      title: "[영상] '한밤중 시속 27㎞' 자주포 뒤로 3중추돌…운전자 사망",
      publisher: "머니투데이(서플)",
      url: "https://supple.kr/news/cmwa1lz5zx7udal9p6pj2wyu9",
      publishedAt: "2026-11-10",
      type: "press",
      license: "link-only",
    },
  ],
};
