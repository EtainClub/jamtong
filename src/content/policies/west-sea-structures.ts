import type { PolicyInput } from "./schema";

/**
 * 서해 잠정조치수역 중국 구조물과 정부 대응.
 *
 * 2026년 10월 31일 대통령 X 게시물에 "중국 어선들이 바다에 방어벽을 치며 긴장을 높이는데 대통령은
 * 대응하지 않고 있다"는 답글이 달렸다(잼통 Voice). 서해 한중 잠정조치수역(PMZ)의 중국 구조물을
 * 두고 정부가 한 일과, 아직 남은 것을 적는다.
 *
 * ★ 구조물의 성격(양식 시설인지)은 중국 측 주장이다. CLAIM으로 적는다.
 * ★ "중국 어선의 방어벽"이 무엇을 가리키는지는 확인하지 못했다(gaps).
 * ★ 2026-11-05 처음 등록 — 잼통 Voice 이슈 #212.
 */
export const WEST_SEA_STRUCTURES: PolicyInput = {
  slug: "west-sea-structures",
  title: "서해 잠정조치수역 중국 구조물과 정부 대응",
  scope:
    "한중 잠정조치수역에 중국이 설치한 구조물 3기, 2026년 1월 한중 정상회담 뒤 관리시설 1기 이동, 남은 양식 구조물 2기, 해양경계획정 차관급 회담 재개 합의",
  ministries: ["외교부", "해양수산부", "해양경찰청"],
  categories: ["diplomacy"],
  asOf: "2026-11-05",
  rumors: [
    {
      id: "rumor-no-response",
      text: "중국 어선들이 바다에 방어벽을 치며 긴장을 높이는데 대통령은 대응하지 않고 있다",
      claimIds: ["claim-summit", "claim-removal", "claim-boundary-talks"],
    },
  ],
  claims: [
    {
      id: "claim-structures",
      text:
        "중국은 한중 잠정조치수역 안에 선란 1호(2018년), 선란 2호(2024년)와 석유 시추설비 형태의 관리시설(2022년) 등 구조물 3기를 설치했다. " +
        "잠정조치수역은 두 나라 배타적경제수역이 겹치는 곳으로, 해양경계가 정해지기 전까지 한중 어업협정으로 정한 구역이며, 어업협정에는 구조물·양식에 관한 규정이 없다.",
      assertionType: "FACT",
      sourceIds: ["src-jtbc-20260127", "src-khan-20260127"],
      verified: true,
    },
    {
      id: "claim-china-position",
      text: "중국은 구조물이 민간기업이 투자한 심해 양식 시설이며 서해 영유권이나 해양경계 문제와 무관하다는 입장이다.",
      assertionType: "CLAIM",
      assertedBy: "중국 정부",
      sourceIds: ["src-jtbc-20260127"],
      verified: true,
    },
    {
      id: "claim-summit",
      text:
        "2026년 1월 5일 베이징 한중 정상회담에서는 서해 구조물도 의제로 다룬 것으로 알려졌다. 이 대통령은 1월 7일 상하이 기자단 간담회에서 중국이 관리시설은 철수하겠다고 했다며 " +
        "공동 관리 수역에 대해 \"'중간을 정확히 그어버리자'고 실무적인 얘기를 하기로 했다\"고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-mbc-20260107", "src-jtbc-20260127"],
      verified: true,
    },
    {
      id: "claim-removal",
      text:
        "중국은 2026년 1월 27~31일 관리시설 1기를 잠정조치수역 밖으로 옮겼다. 중국 외교부는 기업이 경영 필요에 따라 자율적으로 조정한 것이라고 했고, " +
        "우리 외교부는 \"일방적 구조물 설치 반대 입장 하에 대중국 협의를 해온 만큼 이번 조치를 의미 있는 진전으로 평가한다\"고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260127", "src-jtbc-20260127"],
      verified: true,
    },
    {
      id: "claim-remaining",
      text:
        "선란 1·2호 2기는 남아 있다. 정부는 구조물 3기 모두를 잠정조치수역 밖으로 옮기라고 요구해 왔고, 나머지 2기도 옮기도록 협의를 이어 가겠다는 방침이다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260127", "src-jtbc-20260127"],
      verified: true,
    },
    {
      id: "claim-boundary-talks",
      text:
        "두 정상은 2026년 안에 해양경계획정 차관급 회담을 열도록 노력하기로 했다. 차관급 회담은 2019년 이후 열리지 않았다. " +
        "외교부는 구조물 문제는 경계획정과 별도 트랙의 기존 채널에서 다룬다고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-nocut-20260106", "src-yonhaptv-20260115"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-remaining"],
  timeline: [
    {
      id: "t-summit",
      date: "2026-01-05",
      datePrecision: "day",
      title: "한중 정상회담, 서해 구조물 논의",
      summary: "해양경계 차관급 회담 재개 합의.",
      claimIds: ["claim-summit", "claim-boundary-talks"],
    },
    {
      id: "t-removal",
      date: "2026-01-27",
      datePrecision: "day",
      title: "중국, 관리시설 1기 이동",
      summary: "1월 31일까지 잠정조치수역 밖으로.",
      claimIds: ["claim-removal"],
    },
  ],
  gaps: [
    "답글이 말한 '중국 어선의 방어벽'이 무엇을 가리키는지 확인하지 못했다.",
    "2026년 안에 열기로 한 해양경계획정 차관급 회담이 실제로 열렸는지 확인하지 못했다.",
    "선란 1·2호 철수 협의의 2026년 1월 이후 진전은 공개 자료로 찾지 못했다.",
    "서해 중국 어선 불법조업 단속 실적(해양경찰청)은 정리하지 못했다.",
  ],
  sources: [
    {
      id: "src-jtbc-20260127",
      title: "중, 서해에 무단 설치 구조물 이동…외교부 \"한중 관계에 도움\"",
      publisher: "JTBC",
      url: "https://m.news.nate.com/view/20260127n28008",
      publishedAt: "2026-01-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260127",
      title: "중국, 서해 구조물 1개 철수…한국 \"의미 있는 진전\"",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202601271836001",
      publishedAt: "2026-01-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mbc-20260107",
      title: "이 대통령 \"중국, 서해구조물 일부 옮길 것‥공동수역 선긋자 제안\"",
      publisher: "MBC",
      url: "https://imnews.imbc.com/news/2026/politics/article/6791814_36911.html",
      publishedAt: "2026-01-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nocut-20260106",
      title: "한중, 서해문제 차관급회담 갖기로…구조물은 별도트랙",
      publisher: "CBS노컷뉴스",
      url: "https://m.news.nate.com/view/20260106n30972",
      publishedAt: "2026-01-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-yonhaptv-20260115",
      title: "외교부 \"해양경계획정 협의 속도\"…'서해 구조물'은 별도 트랙으로",
      publisher: "연합뉴스TV",
      url: "https://m.news.nate.com/view/20260115n36144",
      publishedAt: "2026-01-15",
      type: "press",
      license: "link-only",
    },
  ],
};
