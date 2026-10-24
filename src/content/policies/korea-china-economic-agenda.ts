import type { PolicyInput } from "./schema";

/**
 * 한중 경제협력 의제 (2026년 1월 정상회담).
 *
 * 대통령 X 게시물 답글에 "한중 경제협력 의제로 한국 기업의 슝안신구 인프라 사업 참여를
 * 추진해 달라"는 요청이 달렸다(잼통 Voice). 2026년 1월 한중 정상회담에서 실제로 합의한
 * 경제협력 항목과, 슝안신구가 그 안에 있었는지를 적는다.
 *
 * ★ 정상회담 양해각서 목록에 슝안신구나 해외 인프라 공동 진출은 없다. 없다는 것을 사실로
 *   적고, 앞으로의 가능성은 추측하지 않는다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #72.
 */
export const KOREA_CHINA_ECONOMIC_AGENDA: PolicyInput = {
  slug: "korea-china-economic-agenda",
  title: "한중 경제협력 의제 (2026년 1월 정상회담)",
  scope:
    "2026년 1월 5일 베이징 한중 정상회담의 경제·산업 양해각서, 정례 협의체 신설, 슝안신구 사업과 외국 기업 참여 현황",
  ministries: ["외교부", "산업통상부"],
  categories: ["diplomacy", "economy"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-xiongan",
      text: "한중 경제협력 의제로 한국 기업의 슝안신구 인프라 사업 참여를 추진해 달라",
      claimIds: ["claim-summit", "claim-mous", "claim-no-xiongan", "claim-xiongan-status"],
    },
  ],
  claims: [
    {
      id: "claim-summit",
      text:
        "이재명 대통령과 시진핑 중국 국가주석은 2026년 1월 5일 베이징 인민대회당에서 정상회담을 했다. 2025년 11월 경주 " +
        "APEC 계기 시 주석 국빈 방한에 이은 두 번째 회담이고, 정상 간 만남을 매년 한 차례 이상 정례화하기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeonggi-20260105"],
      verified: true,
    },
    {
      id: "claim-mous",
      text:
        "양국은 양해각서 14건과 문화재 기증 증서 1건을 교환했다. 경제 분야로는 산업통상부와 중국 상무부의 장관급 " +
        "'상무 협력 대화' 신설, 산업단지 협력 강화, 중소기업·혁신 협력, 디지털 기술, 교통, 지식재산, 식품안전, 수산물 " +
        "위생, 동식물 검역 협력이 들어 있다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeonggi-20260105"],
      verified: true,
    },
    {
      id: "claim-no-xiongan",
      text:
        "양해각서 목록에 슝안신구나 해외 인프라·도시 개발 공동 진출은 없다. 교통 분야 협력이 가장 가깝지만 인프라 건설 " +
        "참여를 명시하지 않는다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-kyeonggi-20260105"],
      verified: true,
    },
    {
      id: "claim-xiongan-status",
      text:
        "슝안신구는 중국이 베이징 기능을 분산하려고 조성하는 신도시로, 2023년 이후 중앙 국유기업의 자회사 157곳이 " +
        "들어섰다. 슝안 스마트시티 사업을 다룬 국내 연구 보고서는 사업이 중국 기업 중심이고 외국 기업이 들어간 " +
        "사례는 거의 없다고 분석했다(보고서 작성 시점 기준).",
      assertionType: "FACT",
      sourceIds: ["src-genews-20261021", "src-dbpia-xiongan"],
      verified: false,
    },
  ],
  timeline: [
    {
      id: "t-gyeongju",
      date: "2025-11",
      datePrecision: "month",
      title: "시진핑 주석 경주 APEC 국빈 방한",
      summary: "첫 한중 정상회담.",
      claimIds: ["claim-summit"],
    },
    {
      id: "t-beijing",
      date: "2026-01-05",
      datePrecision: "day",
      title: "베이징 한중 정상회담, 양해각서 14건",
      summary: "상무 협력 대화 신설, 산업단지 협력.",
      claimIds: ["claim-summit", "claim-mous"],
    },
  ],
  gaps: [
    "산업단지 협력 양해각서의 세부 내용(대상 단지, 기업 지원 방식)은 확인하지 못했다.",
    "정부가 슝안신구 사업 참여를 검토한 적이 있는지에 대한 자료는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-kyeonggi-20260105",
      title: "[영상] 한중 정상회담 계기로 14개 협력 MOU 체결…관계 전면 복원 강조",
      publisher: "경기일보",
      url: "https://www.kyeonggi.com/article/20260105580440",
      publishedAt: "2026-01-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-genews-20261021",
      title: "中, '미래 도시' 슝안에 초대형 국영기업 '국가데이터그룹' 설립",
      publisher: "글로벌이코노믹",
      url: "https://www.g-enews.com/article/Global-Biz/2026/10/2026102108224630640c8c1c064d_1",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dbpia-xiongan",
      title: "슝안신구(雄安新区)의 스마트시티 조성 정책과 추진 현황",
      publisher: "DBpia(연구 보고서)",
      url: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE07536131",
      type: "research",
      license: "link-only",
    },
  ],
};
