import type { PolicyInput } from "./schema";

/**
 * 중국 단체관광객 한시 무비자 입국.
 *
 * "중국인 무비자 입국이 논의되고 있다"는 게시물이 돈다. 논의 단계가 아니라
 * 2025년 9월 29일부터 이미 시행 중이고, 2026년 12월 31일까지 연장됐다. 대상은
 * 모든 중국인이 아니라 전담여행사가 모은 3인 이상 단체관광객이다.
 *
 * ★ 중국 측도 한국인에게 무비자 입국을 허용하고 있다. 정부는 그 기간과 맞췄다고
 *   설명한다.
 * ★ 2026-10-20 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #50.
 */
export const CHINA_GROUP_VISA_FREE: PolicyInput = {
  slug: "china-group-visa-free",
  title: "중국 단체관광객 한시 무비자 입국",
  scope: "2025년 9월 시작된 중국 단체관광객 무사증 입국 제도의 조건, 불법체류 대책, 연장 경과와 이용 실적",
  ministries: ["법무부", "문화체육관광부"],
  categories: ["economy"],
  asOf: "2026-10-20",
  rumors: [
    {
      id: "rumor-discussing",
      text: "중국인 무비자 입국이 논의되고 있다",
      claimIds: ["claim-origin", "claim-start", "claim-conditions", "claim-extension", "claim-petition"],
    },
  ],
  claims: [
    {
      id: "claim-start",
      text:
        "정부는 2025년 8월 6일 국무총리 주재 관광 활성화 회의에서 중국 단체관광객 한시 무비자 입국을 확정했고, " +
        "2025년 9월 29일부터 2026년 6월 30일까지 시행했다. 중국은 2024년 11월부터 한국 국민의 무비자 입국을 " +
        "허용하고 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-visa-2025", "src-newsis-visa-20250907"],
      verified: true,
    },
    {
      id: "claim-conditions",
      text:
        "대상은 문화체육관광부가 지정한 국내 전담여행사나 주중 공관이 지정한 여행사가 모은 3인 이상 중국인 " +
        "단체관광객이다. 15일 안에서 전국을 여행할 수 있다. 개별 관광객은 대상이 아니며, 제주도는 예전처럼 30일 " +
        "무사증 입국이 따로 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-visa-20250907"],
      verified: true,
    },
    {
      id: "claim-safeguard",
      text:
        "법무부는 입국 명단을 미리 점검해 입국규제자·불법체류 이력자 등 고위험군을 거르고, 단체에서 무단이탈자가 " +
        "나오면 여행사에 행정처분을 한다. 고의·공모 이탈은 즉시 지정 취소하고, 분기 평균 이탈률이 2% 이상이면 " +
        "처분을 강화한다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-visa-20250907"],
      verified: true,
    },
    {
      id: "claim-extension",
      text:
        "법무부는 2026년 6월 제도를 2026년 7월 1일부터 12월 31일까지 연장했다. 중국이 한국 국민에게 허용한 무비자 " +
        "입국 기간(2026년 12월 31일까지)과 같게 맞춘 것이라고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-mofa-visa-20260623", "src-shanghaibang-visa-20260630"],
      verified: true,
    },
    {
      id: "claim-usage",
      text:
        "2025년 9월 29일부터 2026년 6월 21일까지 무비자로 들어온 중국인 단체관광객은 10만 4,369명이고, 이 가운데 " +
        "무단이탈은 21명(0.02%)이었다. 같은 기간 단체전자비자로 들어온 사람은 51만 2,998명이었다.",
      assertionType: "FACT",
      sourceIds: ["src-shanghaibang-visa-20260630"],
      verified: true,
    },
    {
      id: "claim-origin",
      text:
        "이 제도는 윤석열 정부 때 검토가 시작됐다. 2023년 3월 중국 단체관광객 무비자 환승 관광을 허용했고, 2024년 " +
        "12월 국가관광전략회의에서 방한 중국 단체관광객 무비자 시범 사업을 하기로 했다. 2025년 3월 최상목 대통령 " +
        "권한대행은 \"중국 단체관광객에 대한 한시 비자 면제를 3분기 중 시행하겠다\"고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-ohmynews-visa-20251015"],
      verified: true,
    },
    {
      id: "claim-concerns",
      text:
        "국민의힘 일부 인사는 시행 전후로 반대했다. 김민수 최고위원은 \"국민 안전을 담보로 한 위험한 도박\"이라며 범죄·" +
        "불법체류·전염병 확산을 우려했고, 나경원 의원은 출입국 전산 오류로 입국자 주소 입력이 빠질 수 있다며 시행 " +
        "연기를 요구했다. 더불어민주당은 근거 없이 특정 국가에 대한 혐오를 부추긴다고 맞섰다.",
      assertionType: "CLAIM",
      assertedBy: "김민수 국민의힘 최고위원·나경원 국민의힘 의원",
      sourceIds: ["src-khan-visa-20250929"],
      verified: true,
    },
    {
      id: "claim-petition",
      text:
        "2026년 9월 '중국인 무비자 폐지'를 요구하는 국회 국민동의청원에 7만 8,800명이 동의해, 소관 상임위원회인 " +
        "법제사법위원회 심사를 받게 됐다. 5만 명을 넘으면 상임위 심사 대상이 된다는 뜻이며, 제도가 폐지된다는 뜻은 " +
        "아니다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-visa-20260918"],
      verified: true,
    },
    {
      id: "claim-jeju",
      text:
        "단체관광 무비자와 별개로 운영되는 제주 무사증 제도에서는 2025년 8월 말 기준 무사증 자격 외국인 불법체류자가 " +
        "1만 738명이었고, 이 가운데 중국 국적이 9,100명(85%)이었다(법무부가 국회에 낸 자료).",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-visa-20260918"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-decide",
      date: "2025-08-06",
      datePrecision: "day",
      title: "중국 단체관광객 한시 무비자 확정",
      summary: "관광 활성화 회의에서 정했다.",
      claimIds: ["claim-start"],
    },
    {
      id: "t-start",
      date: "2025-09-29",
      datePrecision: "day",
      title: "무비자 입국 시행",
      summary: "3인 이상 단체, 15일 이내.",
      claimIds: ["claim-start", "claim-conditions"],
    },
    {
      id: "t-extend",
      date: "2026-06-23",
      datePrecision: "day",
      title: "2026년 말까지 연장 공지",
      summary: "중국의 한국인 무비자 기간과 맞췄다.",
      claimIds: ["claim-extension"],
    },
  ],
  critiqueIds: ["claim-concerns", "claim-petition", "claim-jeju"],
  gaps: [
    "2027년 이후 연장 여부는 아직 발표되지 않았다. 지금까지는 중국의 한국인 무비자 기간에 맞춰 왔다.",
    "2026년 6월 21일 이후의 무단이탈 통계는 공식 발표를 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-dailian-visa-2025",
      title: "중국인 단체관광객 9월 29일부터 한시 무비자…내년 6월까지",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1532672/",
      publishedAt: "2025-08-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-visa-20250907",
      title: "중국 단체관광객 15일 내 무비자 한국 관광 가능",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20250907_0003318800",
      publishedAt: "2025-09-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mofa-visa-20260623",
      title: "중국 단체관광객 무사증입국 허가제도 연장 시행",
      publisher: "주칭다오 대한민국 총영사관",
      url: "https://www.mofa.go.kr/cn-qingdao-ko/brd/m_24477/view.do?seq=1357024",
      publishedAt: "2026-06-23",
      type: "official",
      license: "public",
    },
    {
      id: "src-shanghaibang-visa-20260630",
      title: "중국인 단체관광 무비자 6개월 연장… 한·중 무비자 연말까지 동기화",
      publisher: "상하이방",
      url: "https://shanghaibang.com/ne/ne0402/ne0303/2026/06/30/1506362/",
      publishedAt: "2026-06-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ohmynews-visa-20251015",
      title: "\"중국인 무비자, 윤석열 정부에서 시작\" 민주당 주장 '사실' [오마이팩트]",
      publisher: "오마이뉴스",
      url: "https://www.ohmynews.com/NWS_Web/OhmyFact/at_pg.aspx?CNTN_CD=A0003173012",
      publishedAt: "2025-10-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-visa-20250929",
      title: "또 열린 혐중의 입···국힘 김민수 \"무비자 입국으로 범죄·전염병 확산 가능성\"",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202509291056001",
      publishedAt: "2025-09-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-visa-20260918",
      title: "'중국인 무비자 폐지' 청원 7만8800명… 제주 무사증도 쟁점",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202609180938341556",
      publishedAt: "2026-09-18",
      type: "press",
      license: "link-only",
    },
  ],
};
