import type { PolicyInput } from "./schema";

/**
 * 한일 재외국민보호 협력 각서와 2026년 중동 대피.
 *
 * "중동 위기에서 한국인이 무사히 대피한 것은 윤석열 전 대통령이 2024년 9월 일본과
 * 맺은 자국민 대피 협력 양해각서 덕분이다"라는 글이 돈다(2026년 3월 게시물).
 * 각서를 2024년 9월에 맺은 것도, 2026년 3월 대피 때 그 각서에 따라 서로 자리를
 * 내준 것도 사실이다. 그러나 각서로 오간 사람은 양쪽 합쳐 십여 명이고, 한국인
 * 204명은 정부가 띄운 공군 수송기로 돌아왔다. 상대국 국민 대피를 돕는 협력은
 * 각서 전인 2023년 수단·이스라엘 때부터 있었다.
 *
 * ★ 각서는 법적 구속력이 없다(외교부 설명). '사실상 의무화'라는 평가는 해석이다.
 * ★ 2026-10-13 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #25·#26·#28.
 */
export const KOREA_JAPAN_EVACUATION: PolicyInput = {
  slug: "korea-japan-evacuation",
  title: "한일 재외국민보호 협력 각서와 2026년 중동 대피",
  scope:
    "2024년 9월 한일이 교환한 제3국 내 재외국민보호 협력 각서의 내용, " +
    "2026년 3월 중동 사태 때 한국인 대피 경위와 한일 상호 탑승",
  ministries: ["외교부", "국방부"],
  categories: ["diplomacy"],
  asOf: "2026-10-13",
  rumors: [
    {
      id: "rumor-mou-signed",
      text: "윤석열 대통령이 2024년 9월 일본과 '제3국 분쟁 시 자국민 대피 협력 양해각서'를 체결했다",
      claimIds: ["claim-mou"],
    },
    {
      id: "rumor-joint",
      text: "중동 위기 때 한국과 일본이 각자 수송기를 이용해 양국 국민을 함께 대피시켰다",
      claimIds: ["claim-2026-kc330", "claim-2026-japan-charter"],
    },
    {
      id: "rumor-thanks-to-mou",
      text: "이 양해각서 덕분에 한국인들이 중동에서 무사히 대피할 수 있었다",
      claimIds: ["claim-mou-role", "claim-2026-kc330", "claim-prior-coop"],
    },
  ],
  claims: [
    {
      id: "claim-mou",
      text:
        "한국 외교부와 일본 외무성은 2024년 9월 6일 '제3국 내 한국 및 일본 재외국민보호 협력에 관한 " +
        "각서'를 교환했다. 조태열 외교부 장관과 가미카와 요코 외무대신이 서명했고 같은 날 발효했다. " +
        "같은 날 윤석열 대통령과 기시다 총리의 정상회담이 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-newsseoul-20240906"],
      verified: true,
    },
    {
      id: "claim-mou-content",
      text:
        "각서는 위기관리 절차·훈련 정보 공유, 제3국 위기 때 대피 계획 등 정보 교환, 자국민 대피 때 상호 " +
        "협의와 지원, 고위급 협의를 담았다. 외교부는 이 각서가 국제법상 법적 구속력 있는 권리나 의무를 " +
        "만들지 않는다고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsseoul-20240906"],
      verified: true,
    },
    {
      id: "claim-prior-coop",
      text:
        "한일은 각서 전에도 코로나19 때 서로의 국민 귀국을 도왔고, 2023년 4월 수단과 2023년 10~11월 " +
        "이스라엘에서 상대국 국민 대피를 지원했다. 외교부는 이 협력을 각서의 계기로 들었다.",
      assertionType: "FACT",
      sourceIds: ["src-newsseoul-20240906"],
      verified: true,
    },
    {
      id: "claim-2026-japan-charter",
      text:
        "2026년 3월 미국·이스라엘의 이란 공습 뒤 항공편이 끊기자, 사우디아라비아를 떠난 일본 전세기에 " +
        "한국인 11명과 외국인 배우자 1명이 타고 3월 11일 도쿄에 도착했다. 외교부는 '제3국 내 재외국민보호 " +
        "협력에 관한 양해각서'에 따라 한일 외교당국과 공관이 협력한 결과라고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeonggi-20260311"],
      verified: true,
    },
    {
      id: "claim-2026-kc330",
      text:
        "정부는 공군 KC-330 수송기를 리야드에 보내('사막의 빛' 작전) 한국인 204명과 외국 국적 가족 5명, " +
        "일본인 2명 등 211명을 태워 2026년 3월 15일 서울공항으로 데려왔다. 중동에 발이 묶인 한국인 대피에 " +
        "군 수송기를 쓴 것은 처음이다. 정부는 리야드에 정부합동 신속대응팀을 보냈다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20260315", "src-kyeonggi-20260311"],
      verified: true,
    },
    {
      id: "claim-japan-thanks",
      text:
        "다카이치 일본 총리는 3월 15일 한국 정부와 한국군 관계자에게 감사를 표했다. 외교 당국은 일본인 " +
        "2명의 탑승이 2024년 각서에 따른 조치라고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20260316"],
      verified: true,
    },
    {
      id: "claim-mou-role",
      text:
        "각서는 2026년 3월 대피 때 한일이 서로 남는 자리를 내주는 근거로 쓰였다. 그러나 각서로 오간 " +
        "사람은 일본 전세기의 한국인 11명과 한국 수송기의 일본인 2명 정도이고, 한국인 204명은 정부가 " +
        "띄운 공군 수송기로 돌아왔다. 상대국 국민 대피 지원도 각서 전부터 있었다. '각서 덕분에 한국인이 " +
        "무사히 대피했다'는 말은 각서의 몫을 크게 부풀린다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-kyeonggi-20260311", "src-newspim-20260315", "src-newsseoul-20240906"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-mou",
      date: "2024-09-06",
      datePrecision: "day",
      title: "한일 재외국민보호 협력 각서 교환",
      summary: "외교장관 교차 서명, 같은 날 발효. 법적 구속력은 없다.",
      claimIds: ["claim-mou", "claim-mou-content"],
    },
    {
      id: "t-japan-charter",
      date: "2026-03-11",
      datePrecision: "day",
      title: "일본 전세기에 한국인 11명 탑승",
      summary: "사우디아라비아에서 도쿄로. 외교부는 각서에 따른 협력이라고 밝혔다.",
      claimIds: ["claim-2026-japan-charter"],
    },
    {
      id: "t-kc330",
      date: "2026-03-15",
      datePrecision: "day",
      title: "공군 KC-330 '사막의 빛' 귀국",
      summary: "한국인 204명, 외국 국적 가족 5명, 일본인 2명.",
      claimIds: ["claim-2026-kc330", "claim-japan-thanks"],
    },
  ],
  gaps: [
    "2026년 중동 사태 때 육로·민항기·전세기를 포함해 귀국한 한국인 전체 수는 확인하지 못했다.",
    "각서 원문(8개 항)은 직접 확인하지 못했다. 내용은 외교부 발표를 옮긴 보도로 확인했다.",
  ],
  sources: [
    {
      id: "src-newsseoul-20240906",
      title: "외교부, 한일 제3국 내 재외국민보호 협력 강화",
      publisher: "뉴스서울(외교부 발표)",
      url: "https://newsseoul.co.kr/news/view/1065618614096154",
      publishedAt: "2024-09-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kyeonggi-20260311",
      title: "사우디 탈출 日 전세기에 한국인 11명 탑승",
      publisher: "경기일보",
      url: "https://kyeonggi.com/article/20260311580344",
      publishedAt: "2026-03-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20260315",
      title: "李대통령 \"韓국민 204명 군 수송기로 무사 귀국…원팀 협력 성과\"",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260315000202",
      publishedAt: "2026-03-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20260316",
      title: "사우디서 일본인 운송한 한국에 감사 표명",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026031609102819064",
      publishedAt: "2026-03-16",
      type: "press",
      license: "link-only",
    },
  ],
};
