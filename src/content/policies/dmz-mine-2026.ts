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
 *   2026-10-23 신통 이슈 #64(전상 인정 시 보상금)를 더했다. 8,925만 원은 보훈 전문가가
 *   법령 산식으로 계산한 추정치라 CLAIM이다. 실제 금액은 전상 판정과 장애등급 심사로 정해진다.
 */
export const DMZ_MINE_2026: PolicyInput = {
  slug: "dmz-mine-2026",
  title: "비무장지대 지뢰 폭발과 정부 대응",
  scope:
    "2026년 9월 21일 서부전선 비무장지대 지뢰 폭발 사고의 경위, 합참·유엔사 조사 결과, 정부·군의 후속 조치와 " +
    "그에 대한 평가, 다친 장병이 전상으로 인정될 때의 보상",
  ministries: ["국방부", "합동참모본부", "국가보훈부", "통일부"],
  categories: ["diplomacy"],
  asOf: "2026-10-23",
  rumors: [
    {
      id: "rumor-no-action",
      text: "지뢰 폭발로 우리 장병이 발목을 잃었는데 정부가 아무런 조치도 취하지 않았다",
      claimIds: ["claim-investigation", "claim-removal", "claim-demand", "claim-war-wound", "claim-resolution", "claim-slow"],
    },
    {
      id: "rumor-compensation",
      text:
        "발목을 잃은 25사단 수색대대장이 전상으로 인정받으면 장애보상금 약 8,925만 원을 일시금으로 받고, 상이연금과 " +
        "국가유공자 보상금도 매달 받을 수 있다",
      claimIds: ["claim-war-wound", "claim-disability-lump-sum", "claim-monthly", "claim-payment-timing"],
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
        "합동참모본부는 9월 말 북한군 지뢰일 가능성이 매우 높다는 중간 결과를 낸 뒤, 10월 5일 최종 결과를 발표했다. " +
        "유엔군사령부와 9월 26~29일 공동 현장조사를 하고 10월 2일 국립과학수사연구원 감정 결과를 받아, 부상자 몸에서 " +
        "나온 파편이 북한군 수지반보병지뢰와 같다고 확인했다. 폭발 지점은 군사분계선 남쪽 약 10m였고, 합참은 자연 " +
        "유실이 아닌 인위적 매설로 판단했다. 유엔사는 정전협정 위반이라고 밝히고 설치 시기를 12개월 이내로 평가했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-mine-20261005", "src-newspim-mine-20261020"],
      verified: true,
    },
    {
      id: "claim-removal",
      text:
        "군은 10월 5일 낮 12시 51분께 폭발 원인이 된 군사분계선 이남의 북한군 지뢰지대를 제거했다. 유엔사를 통해 " +
        "북측에 미리 알렸고, 북한이 스스로 제거하지 않으면 \"MDL 이남으로 넘어온 모든 지뢰를 제거할 것\"이라고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-mine-20261005"],
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
    {
      id: "claim-resolution",
      text:
        "국회 국방위원회는 10월 14일 북한의 지뢰 매설을 정전협정 위반 도발로 규정하고 북한의 사과·책임자 처벌·재발 " +
        "방지, 부상 장병의 치료·예우 지원을 촉구하는 결의안을 채택했다. 군의 대응 과정과 조사 지연 책임을 국회가 " +
        "규명하자는 국민의힘 요구 조항은 더불어민주당 반대로 빠졌다.",
      assertionType: "FACT",
      sourceIds: ["src-voa-mine-20261014"],
      verified: true,
    },
    {
      id: "claim-disability-lump-sum",
      text:
        "군인 재해보상법 제33조의 장애보상금은 공무원 전체 기준소득월액 평균(2026년 5월부터 595만 원)에 장애등급별 " +
        "배수를 곱하고, 전상이면 2.5배(특수직무공상은 1.88배)를 적용한다. 한쪽 발목 상실을 심신장애 5급(장애보상금 " +
        "2급)으로 보면 전상일 때 약 8,925만 원, 특수직무공상일 때 약 6,711만 원이다.",
      assertionType: "CLAIM",
      assertedBy: "안종민 국가보훈행정사무소 대표(헤럴드경제 분석)",
      sourceIds: ["src-herald-mine-20261005"],
      verified: true,
    },
    {
      id: "claim-monthly",
      text:
        "같은 분석에서, 상이연금은 퇴직한 간부가 일시금과 별도로 매달 받으며 본인 기준소득월액에 등급별 비율(5급 " +
        "39%)을 곱해 정한다. 국가유공자로 등록되면 국가유공자법 시행령상 한쪽 다리를 발목관절 이상에서 잃은 경우 " +
        "상이등급 5급으로, 2026년 월 보상금이 211만 6천 원이고 전상군경이면 전상수당 9만 원이 더해진다.",
      assertionType: "CLAIM",
      assertedBy: "안종민 국가보훈행정사무소 대표(헤럴드경제 분석)",
      sourceIds: ["src-herald-mine-20261005"],
      verified: true,
    },
    {
      id: "claim-payment-timing",
      text:
        "장애보상금과 상이연금은 심신장애 판정 뒤 퇴직할 때 나오므로, 대대장이 현역으로 계속 복무하면 전역 이후로 " +
        "미뤄진다. 실제 금액은 전상 여부와 장애등급 심사 결과에 따라 달라진다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-mine-20261005"],
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
      date: "2026-09",
      datePrecision: "month",
      title: "합참 중간 조사 결과 발표",
      summary: "북한군 지뢰일 가능성이 매우 높다고 밝혔다.",
      claimIds: ["claim-investigation"],
    },
    {
      id: "t-final",
      date: "2026-10-05",
      datePrecision: "day",
      title: "최종 조사 결과 발표, 지뢰지대 제거",
      summary: "북한에 사과와 지뢰 제거를 요구하고, MDL 이남 지뢰지대를 직접 제거했다.",
      claimIds: ["claim-investigation", "claim-removal", "claim-demand"],
    },
    {
      id: "t-war-wound",
      date: "2026-10-06",
      datePrecision: "day",
      title: "보훈부, 전상 예우 방침",
      summary: "국정감사 답변으로 밝혔다.",
      claimIds: ["claim-war-wound"],
    },
    {
      id: "t-resolution",
      date: "2026-10-14",
      datePrecision: "day",
      title: "국회 국방위, 북한 지뢰 도발 규탄 결의안 채택",
      summary: "군 대응 진상 규명 조항은 빠졌다.",
      claimIds: ["claim-resolution"],
    },
  ],
  critiqueIds: ["claim-slow", "claim-wording"],
  gaps: [
    "북한은 사과하지 않았고 책임을 부인했다. 정부가 요구를 관철하기 위해 어떤 추가 조치를 할지는 보안을 이유로 공개하지 않았다.",
    "다친 장병의 전상 판정과 국가유공자 등록이 끝났다는 공식 발표는 아직 없다. 그래서 장애등급과 실제 보상액도 확정되지 않았다.",
    "장애보상금 등급별 배수(8,925만 원 계산에 쓰인 6배)는 보도된 금액으로 역산한 것이고, 군인 재해보상법 시행령 별표 원문과 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-herald-mine-20261005",
      title: "발목 잃은 DMZ 대대장, '전상' 인정시 장애보상금 8925만원…\"현역 복무 열어줘야\"",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10893261",
      publishedAt: "2026-10-05",
      type: "press",
      license: "link-only",
    },
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
    {
      id: "src-newsis-mine-20261005",
      title: "합참 \"北지뢰로 우리 장병 부상 최종 판단…MDL 이남 北지뢰 모두 제거할 것\"(종합2보)",
      publisher: "뉴시스",
      url: "https://newsis.com/view/NISX20261005_0003814618",
      publishedAt: "2026-10-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-voa-mine-20261014",
      title: "한국 국회 국방위, 북한 지뢰 도발 규탄 결의안 채택..책임자 처벌·재발 방지 대책 촉구",
      publisher: "VOA 한국어",
      url: "https://www.voakorea.com/a/korean-peninsula-10-14-26/8211106.html",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
  ],
};
