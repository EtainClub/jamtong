import type { PolicyInput } from "./schema";

/**
 * 평양 무인기 침투 사건과 일반이적 혐의 재판.
 *
 * "평양에 무인기를 보낸 일이 이적죄로 문제 삼아지고 있다"는 게시물이 돈다
 * (2026년 10월). 사실이다. 다만 재판받는 것은 무인기를 보낸 군인 개개인이
 * 아니라 작전을 지시한 윤석열 전 대통령과 김용현 전 국방부 장관 등이고,
 * 1심 재판부는 이 작전이 비상계엄 요건을 만들려는 것이었다고 판단했다.
 *
 * ★ 1심 판결이다. 항소심이 진행 중이어서 확정된 판단이 아니다.
 * ★ 피고 측 주장(오물풍선에 대한 정당한 대응)을 함께 적는다.
 * ★ 2026-10-20 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #49.
 */
export const PYONGYANG_DRONE_TRIAL: PolicyInput = {
  slug: "pyongyang-drone-trial",
  title: "평양 무인기 침투 사건과 일반이적 재판",
  scope: "2024년 10월 평양 무인기 투입 작전에 대한 일반이적·직권남용 혐의 재판의 1심 판결과 항소심 경과",
  ministries: ["국방부"],
  categories: ["institution"],
  asOf: "2026-10-20",
  rumors: [
    {
      id: "rumor-treason",
      text: "평양에 무인기를 보낸 일이 이적죄로 문제 삼아지고 있다",
      claimIds: ["claim-verdict", "claim-reasoning", "claim-defense", "claim-appeal", "claim-appeal-defense"],
    },
  ],
  claims: [
    {
      id: "claim-charge",
      text:
        "윤석열 전 대통령 등은 2024년 10월께 비상계엄 선포 요건을 만들기 위해 드론작전사령부에 평양 무인기 투입을 " +
        "지시한 혐의(일반이적·직권남용권리행사방해)로 내란 특별검사팀에 의해 기소됐다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-drone-20260612", "src-asiae-drone-20261016"],
      verified: true,
    },
    {
      id: "claim-verdict",
      text:
        "서울중앙지법 형사합의36부(재판장 이정엽)는 2026년 6월 12일 네 피고인의 혐의를 모두 유죄로 보고 윤석열 " +
        "전 대통령과 김용현 전 국방부 장관에게 각각 징역 30년, 여인형 전 국군방첩사령관에게 징역 15년, 김용대 전 " +
        "드론작전사령관에게 징역 3년에 집행유예 5년을 선고했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-drone-20260612", "src-hankyung-drone-20260612"],
      verified: true,
    },
    {
      id: "claim-reasoning",
      text:
        "1심 재판부는 \"평양 무인기 침투 작전은 비상계엄 요건을 조성하기 위한 작전으로 인정할 수 있고\", 북한에 " +
        "도발 명분을 주고 우리 군의 전력과 운용 방식을 노출해 군사상 이익을 해쳤다고 판단했다. 군사상 이익이 실제로 " +
        "침해될 위험만 생겨도 일반이적죄가 성립한다고 봤다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-drone-20260612", "src-hankyung-drone-20260612"],
      verified: true,
    },
    {
      id: "claim-defense",
      text:
        "윤 전 대통령 변호인단은 판결 직후 \"대북 무인기 작전은 북한의 7000개 오물풍선 공격에 대한 정당한 군사적 " +
        "대응이었다\"고 반박했다.",
      assertionType: "CLAIM",
      assertedBy: "윤석열 전 대통령 변호인단",
      sourceIds: ["src-hankyung-drone-20260612"],
      verified: true,
    },
    {
      id: "claim-appeal",
      text:
        "특검은 2026년 10월 16일 서울고법 형사1부 항소심 결심 공판에서 윤 전 대통령과 김 전 장관에게 각각 징역 " +
        "30년, 여 전 사령관에게 징역 20년, 김 전 사령관에게 징역 5년을 구형했다. 항소심 선고는 2026년 12월 4일 " +
        "오후 3시로 잡혔다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-drone-20261016", "src-tf-drone-20261016"],
      verified: true,
    },
    {
      id: "claim-appeal-defense",
      text:
        "윤 전 대통령은 항소심 최후진술에서 작전을 사전에 승인했다는 증거가 없다며 1심을 \"재판이라는 형식을 빙자한 " +
        "사법테러\"라고 했다. 변호인단은 무인기 작전이 북한 도발에 대응한 군사작전이었고 계엄 명분을 만들려는 " +
        "모의를 입증할 증거가 없다며 공소기각 또는 무죄를 요청했다.",
      assertionType: "CLAIM",
      assertedBy: "윤석열 전 대통령·변호인단",
      sourceIds: ["src-tf-drone-20261016"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-operation",
      date: "2024-10",
      datePrecision: "month",
      title: "평양 무인기 투입",
      summary: "특검은 비상계엄 요건을 만들기 위한 작전이라고 봤다.",
      claimIds: ["claim-charge"],
    },
    {
      id: "t-verdict",
      date: "2026-06-12",
      datePrecision: "day",
      title: "1심, 윤석열·김용현 징역 30년",
      summary: "일반이적과 직권남용을 모두 유죄로 봤다.",
      claimIds: ["claim-verdict", "claim-reasoning", "claim-defense"],
    },
    {
      id: "t-appeal",
      date: "2026-10-16",
      datePrecision: "day",
      title: "항소심 결심, 특검 징역 30년 구형",
      summary: "선고는 12월 4일로 잡혔다.",
      claimIds: ["claim-appeal", "claim-appeal-defense"],
    },
  ],
  critiqueIds: ["claim-defense", "claim-appeal-defense"],
  gaps: [
    "항소심 선고(2026년 12월 4일) 전이다. 1심 판결은 확정되지 않았다.",
    "재판 일부는 국가안보를 이유로 비공개로 진행됐다. 여기 적은 재판부 판단은 판결문이 아니라 언론 보도 기준이다.",
  ],
  sources: [
    {
      id: "src-khan-drone-20260612",
      title: "‘평양 무인기 투입’ 윤석열 1심 징역 30년…“계엄 위해 북한 도발 유도”",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202606121101001",
      publishedAt: "2026-06-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-drone-20260612",
      title: "평양 무인기 침투 지시…윤석열, 1심 징역 30년",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026061237441",
      publishedAt: "2026-06-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-drone-20261016",
      title: "특검, 尹 '평양 무인기 작전' 혐의 2심서 징역 30년 구형",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026101615220648711",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-tf-drone-20261016",
      title: "특검, '평양 무인기' 2심 징역 30년 구형…윤 \"재판 빙자 사법테러\"(종합)",
      publisher: "더팩트",
      url: "https://news.tf.co.kr/read/life/2377403.htm",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
  ],
};
