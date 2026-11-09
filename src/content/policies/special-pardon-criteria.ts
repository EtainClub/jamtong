import type { PolicyInput } from "./schema";

/**
 * 광복절 특별사면의 대상과 '중대범죄 제외' 입법 논의.
 *
 * 대통령 유튜브 영상 답글에 "살인범은 형기와 상관없이 광복절 특별사면 대상에서 빼야 한다"는 제안이 달렸다(잼통 Voice).
 * 이재명 정부의 광복절 특사(2025년)가 누구를 대상으로 했는지, 2026년에는 있었는지, 사면 대상을 법으로 제한하자는
 * 개정안이 어디까지 갔는지 적는다.
 *
 * ★ 2025년 특사의 경제인·정치인 명단과 논란은 policy:japan-agreements-pardons에도 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #271.
 */
export const SPECIAL_PARDON_CRITERIA: PolicyInput = {
  slug: "special-pardon-criteria",
  title: "광복절 특별사면의 대상과 '중대범죄 사면 제한' 입법",
  scope:
    "2025년 8·15 특별사면의 대상 구성, 2026년 광복절 특사 여부, 살인·성범죄·내란 등을 사면 대상에서 빼자는 사면법 개정안의 처리 경과",
  ministries: ["법무부"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-murder",
      text: "살인범은 형기와 상관없이 광복절 특별사면 대상에서 빼야 한다",
      claimIds: ["claim-2025", "claim-2026-none", "claim-bills-ppp", "claim-bill-dem"],
    },
  ],
  claims: [
    {
      id: "claim-2025",
      text:
        "이재명 정부의 첫 특별사면은 2025년 8월 15일자로 시행됐다. 법무부가 밝힌 특별사면 대상은 소상공인·청년·운전업 종사자 등 서민생계형 형사범과 " +
        "경제인, 여야 정치인, 노동계, 농민 등 2,188명이었다(정치인·주요 공직자 27명, 경제인 16명, 중소기업인·소상공인 42명 포함).",
      assertionType: "FACT",
      sourceIds: ["src-moj-20250811", "src-newsis-20250811-pardon"],
      verified: true,
    },
    {
      id: "claim-2025-admin",
      text:
        "흔히 말하는 '83만 명 사면'의 대부분은 형사 사면이 아니라 운전면허·영업정지 같은 행정제재 감면(83만 4,499명)이다. 운전면허 감면에서는 음주운전, " +
        "교통 사망사고, 난폭운전, 무면허운전, 보호구역 내 위반이 제외됐다. 같은 때 모범수 1,014명이 가석방됐다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-pardon", "src-newsis-20250811-pardon"],
      verified: true,
    },
    {
      id: "claim-2026-none",
      text:
        "2026년 광복절에는 특별사면이 시행되지 않은 것으로 보도됐다. 사면 담당 관계자는 대상자 선별·자료 수집에 한 달 가까이 걸리는데 준비에 들어가지 않아 " +
        "\"물리적으로 광복절 특별사면은 어려운 상황\"이라고 설명했고, 법무부는 모범수·생계형 사범 중심의 가석방 심사를 진행했다.",
      assertionType: "CLAIM",
      assertedBy: "동아일보 보도(사면 업무 관계자 발언)",
      sourceIds: ["src-wikitree-1151550"],
      verified: true,
    },
    {
      id: "claim-bills-ppp",
      text:
        "2025년 8월 14~20일 국민의힘 의원들이 사면법 개정안 5건을 냈다. 주진우 의원 안은 살인·마약·성폭력 등 강력범죄와 이를 비호·은닉한 범죄를 사면 대상에서 빼고, " +
        "김민전 의원 안은 아동·청소년 대상 성범죄를 사면·감형·복권 대상에서 빼는 내용이다. 대통령과 그 친족·공범을 특별사면에서 빼는 내용도 함께 담겼다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1613661", "src-heraldk-20250811"],
      verified: true,
    },
    {
      id: "claim-bill-dem",
      text:
        "민주당이 낸 사면법 개정안은 내란·외환죄와 군형법상 반란죄에 대한 사면·감형·복권을 금지하되 국회 재적 5분의 3이 동의하면 예외를 두는 내용이다. " +
        "2026년 2월 20일 법사위 소위를 통과했으나, 2월 23일 법사위 전체회의에서 대통령 권한 제약에 대한 신중 검토 의견에 따라 보류됐다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20260220", "src-newsis-20260224-pardon"],
      verified: true,
    },
    {
      id: "claim-constitution",
      text:
        "사면권을 법률로 제한하는 데에는 대통령의 헌법상 권한을 침해한다는 위헌 논란이 있다는 지적이 법조계에서 나왔다.",
      assertionType: "CLAIM",
      assertedBy: "법조계(데일리안 취재)",
      sourceIds: ["src-dailian-1613661"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-constitution"],
  timeline: [
    {
      id: "t-2025",
      date: "2025-08-15",
      datePrecision: "day",
      title: "광복절 특별사면 2,188명",
      summary: "행정제재 감면 83만여 명 별도.",
      claimIds: ["claim-2025", "claim-2025-admin"],
    },
    {
      id: "t-bill-hold",
      date: "2026-02-23",
      datePrecision: "day",
      title: "내란 사면 제한법 법사위 보류",
      summary: "2월 20일 소위 통과 후.",
      claimIds: ["claim-bill-dem"],
    },
    {
      id: "t-2026",
      date: "2026-08",
      datePrecision: "month",
      title: "2026년 광복절 특사 없음",
      summary: "가석방 심사만.",
      claimIds: ["claim-2026-none"],
    },
  ],
  gaps: [
    "2025년 특사 대상 일반 형사범에 살인·강도·성폭력 사범이 포함됐는지는 법무부 보도자료 첨부(상세 내용)에 있으나 원문을 열람하지 못했다. 보도에는 강력범 포함 사례가 나오지 않는다.",
    "국민의힘 개정안 5건의 상임위 심사 경과는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-moj-20250811",
      title: "2025년 제80주년 광복절 특별사면 실시",
      publisher: "법무부",
      url: "https://www.moj.go.kr/bbs/moj/182/597851/artclView.do",
      publishedAt: "2025-08-11",
      type: "official",
      license: "public",
    },
    {
      id: "src-newsis-20250811-pardon",
      title: "광복절 특사에 조국 부부·윤미향…최신원 등 경제인도(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20250811_0003286343?pc_view=1",
      publishedAt: "2025-08-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-pardon",
      title: "대통령 특사, 왜 매번 논란일까?..숫자로 본 특별사면",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/listicle/special_pardon",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-wikitree-1151550",
      title: "조국·윤미향 풀어줬던 이재명 정부, 올해 광복절 특사 0명",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1151550",
      publishedAt: "2026-08-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1613661",
      title: "대통령 고유 '사면권' 제한하겠다는 민주당…위헌논란 불가피 [법조계에 물어보니 697]",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1613661/",
      publishedAt: "2026-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20250811",
      title: "조국 사면된 날…김민전 의원 '입시비리 사면 제한법' 입법 추진",
      publisher: "헤럴드K",
      url: "https://www.heraldk.com/article/2025081102545298833",
      publishedAt: "2025-08-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20260220",
      title: "'尹 사면 금지법', 與 주도 법사위 소위 통과…野 \"위헌적 입법 강행\" 반발",
      publisher: "서울신문",
      url: "https://m.seoul.co.kr/news/2026/02/20/20260220500279",
      publishedAt: "2026-02-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260224-pardon",
      title: "\"대통령 권한 제약은 더 신중한 검토 필요\"…추후 심사 계속",
      publisher: "뉴시스",
      url: "https://mobile.newsis.com/view/NISX20260224_0003524315",
      publishedAt: "2026-02-24",
      type: "press",
      license: "link-only",
    },
  ],
};
