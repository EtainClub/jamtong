import type { PolicyInput } from "./schema";

/**
 * 2026년 9월 비무장지대 지뢰 폭발과 정부 대응.
 *
 * "지뢰 폭발로 우리 장병이 발목을 잃었는데 정부가 아무런 조치도 취하지
 * 않았다"는 게시물이 돈다(2026년 10월). 부상은 사실이다. 정부·군이 한 일
 * (조사 발표, 대북 사과·제거 요구, 전상 예우 방침)과, 대응이 미온적이라는
 * 비판을 나란히 둔다.
 *
 * ★ '아무 조치도 없었다'는 사실과 다르다. 그러나 조치가 충분했는지는 평가라서
 *   판정하지 않는다. 비판은 critique로 함께 보인다.
 * ★ 2026-10-20 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #53.
 */
export const DMZ_MINE_2026: PolicyInput = {
  slug: "dmz-mine-2026",
  title: "비무장지대 지뢰 폭발과 정부 대응",
  scope:
    "2026년 9월 21일 서부전선 비무장지대 지뢰 폭발 사고의 경위, 합참·유엔사 조사 결과, 정부·군의 후속 조치와 " +
    "그에 대한 평가",
  ministries: ["국방부", "합동참모본부", "국가보훈부", "통일부"],
  categories: ["diplomacy"],
  asOf: "2026-10-20",
  rumors: [
    {
      id: "rumor-no-action",
      text: "지뢰 폭발로 우리 장병이 발목을 잃었는데 정부가 아무런 조치도 취하지 않았다",
      claimIds: ["claim-investigation", "claim-demand", "claim-war-wound", "claim-slow"],
    },
  ],
  claims: [
    {
      id: "claim-incident",
      text:
        "2026년 9월 21일 강원 연천 육군 25사단 관할 비무장지대에서 수색로를 내던 장병들 근처에서 지뢰가 터져 " +
        "3명이 다쳤다. 1명은 왼쪽 발목을 잃었고, 1명은 파편상, 1명은 경상이었다. 부상자는 헬기 등으로 군 병원에 " +
        "후송됐다.",
      assertionType: "FACT",
      sourceIds: ["src-withnews-mine-20261010", "src-newspim-mine-20261020"],
      verified: true,
    },
    {
      id: "claim-investigation",
      text:
        "합동참모본부는 9월 30일 북한군이 묻은 지뢰일 가능성이 높다는 중간 결과를, 10월 5일 유엔군사령부 공동 " +
        "현장조사와 국립과학수사연구원 감정을 종합한 최종 결과를 발표했다. 폭발 지점은 군사분계선 남쪽 약 10m였고, " +
        "파편은 북한군 규격의 플라스틱 대인지뢰와 같았다. 유엔사는 정전협정 위반이라고 밝혔고, 지뢰가 최근 1년 " +
        "안에 묻힌 것으로 평가했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-mine-20261020", "src-withnews-mine-20261010"],
      verified: true,
    },
    {
      id: "claim-demand",
      text:
        "합참 작전본부장은 북한에 다친 장병들에 대한 진정성 있는 사과와, 정전협정을 어기고 묻은 지뢰의 즉시 제거를 " +
        "요구했다. 북한 김여정 노동당 부부장은 담화에서 이를 \"자작극\"이라며 책임을 부인했다.",
      assertionType: "FACT",
      sourceIds: ["src-withnews-mine-20261010", "src-newspim-mine-20261020"],
      verified: true,
    },
    {
      id: "claim-war-wound",
      text:
        "국가보훈부 차관은 10월 6일 국정감사에서 다친 장병을 전상(戰傷)으로 예우하겠다고 답했다. 2015년 목함지뢰 " +
        "사건 뒤 국가유공자법 시행령의 전상 기준에 '적이 설치한 위험물로 다친 사람'이 추가된 것이 근거다.",
      assertionType: "CLAIM",
      assertedBy: "강윤진 국가보훈부 차관",
      sourceIds: ["src-withnews-mine-20261010"],
      verified: true,
    },
    {
      id: "claim-wording",
      text:
        "이재명 대통령은 10월 1일 국군의날 기념식에서 이 폭발을 \"불의의 사고\"라고 표현했다. 권오을 국가보훈부 " +
        "장관은 국정감사에서 이를 \"북한의 도발\"로 평가했다. 정동영 통일부 장관은 10월 2일 \"불행한 일\"이라고 " +
        "표현하며 북한에 대화를 제안했다.",
      assertionType: "FACT",
      sourceIds: ["src-withnews-mine-20261010", "src-newspim-mine-20261020"],
      verified: true,
    },
    {
      id: "claim-slow",
      text:
        "뉴스핌은 최종 조사 결과 발표 뒤 보름이 지났지만 사과·제거 요구를 관철할 \"뚜렷한 계획이나 의지는 드러나지 " +
        "않고 있다\"며 정부 대응이 미온적이라고 비판했다.",
      assertionType: "OPINION",
      sourceIds: ["src-newspim-mine-20261020"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-blast",
      date: "2026-09-21",
      datePrecision: "day",
      title: "DMZ 지뢰 폭발, 장병 3명 부상",
      summary: "1명이 발목을 잃었다.",
      claimIds: ["claim-incident"],
    },
    {
      id: "t-interim",
      date: "2026-09-30",
      datePrecision: "day",
      title: "합참 중간 조사 결과 발표",
      summary: "북한군 매설 지뢰일 가능성이 높다고 밝혔다. 유엔사는 정전협정 위반이라고 했다.",
      claimIds: ["claim-investigation"],
    },
    {
      id: "t-final",
      date: "2026-10-05",
      datePrecision: "day",
      title: "최종 조사 결과 발표, 대북 사과·제거 요구",
      summary: "파편이 북한군 지뢰와 같다고 밝혔다.",
      claimIds: ["claim-investigation", "claim-demand"],
    },
    {
      id: "t-war-wound",
      date: "2026-10-06",
      datePrecision: "day",
      title: "보훈부, 전상 예우 방침",
      summary: "국정감사 답변으로 밝혔다.",
      claimIds: ["claim-war-wound"],
    },
  ],
  critiqueIds: ["claim-slow", "claim-wording"],
  gaps: [
    "북한이 사과하거나 지뢰를 제거했다는 소식은 없다. 정부가 요구를 관철하기 위해 어떤 후속 조치를 할지는 발표되지 않았다.",
    "다친 장병의 전상 판정이 실제로 끝났는지는 확인하지 못했다.",
    "합참·유엔사 조사 결과 원문은 확인하지 못했다. 내용은 언론 보도 기준이다.",
  ],
  sources: [
    {
      id: "src-withnews-mine-20261010",
      title: "“사고 아니라 북한 도발이다”…北 지뢰에 발목 잃은 장병 두고 ‘설왕설래’",
      publisher: "더위드카",
      url: "https://car.withnews.kr/military/mine-soldier-war-wound-recognized",
      publishedAt: "2026-10-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-mine-20261020",
      title: "[뉴스분석] 北 지뢰도발 미온 대처가 김여정 오만방자 불렀다",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261020000593",
      publishedAt: "2026-10-20",
      type: "press",
      license: "link-only",
    },
  ],
};
