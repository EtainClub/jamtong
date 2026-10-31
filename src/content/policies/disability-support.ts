import type { PolicyInput } from "./schema";

/**
 * 장애수당·장애인연금과 장애인 전용주차구역 기준.
 *
 * 10월 말 X 게시물 답글에 "장애인연금은 해마다 올랐는데 경증 기초수급 장애인의 장애수당은 수년째
 * 6만 원이니 올려 달라", "장애인 전용주차구역이 지나치게 많아 비어 있으니 수를 조정하고 거동이
 * 불편한 장애인만 쓰게 해 달라"는 말이 달렸다(잼통 Voice). 두 제도의 현행 기준을 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #177, #178.
 */
export const DISABILITY_SUPPORT: PolicyInput = {
  slug: "disability-support",
  title: "장애수당·장애인연금과 장애인 전용주차구역 기준",
  scope:
    "2026년 장애수당 대상·금액과 장애인연금과의 차이, 2027년 예산안의 장애인연금 대상 확대, 장애인 전용주차구역 설치 비율과 이용 조건",
  ministries: ["보건복지부", "국토교통부"],
  categories: ["welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-allowance",
      text: "장애인 연금은 해마다 올랐는데 경증 기초수급 장애인의 장애수당은 수년째 6만 원이니 올려 달라",
      claimIds: ["claim-allowance", "claim-pension", "claim-pension-2027"],
    },
    {
      id: "rumor-parking",
      text: "장애인 전용주차구역이 지나치게 많아 비어 있으니 수를 조정하고 거동이 불편한 장애인만 쓰게 해 달라",
      claimIds: ["claim-parking-ratio", "claim-parking-debate"],
    },
  ],
  claims: [
    {
      id: "claim-allowance",
      text:
        "장애수당은 18세 이상 등록장애인 가운데 중증이 아니면서 기초생활수급자 또는 차상위계층인 사람에게 2026년 기준 월 6만 원(보장시설 " +
        "입소 생계·의료급여 수급자는 월 3만 원)을 준다.",
      assertionType: "FACT",
      sourceIds: ["src-vegannews-390679"],
      verified: true,
    },
    {
      id: "claim-pension",
      text:
        "장애인연금은 18세 이상 중증장애인 가운데 소득인정액이 선정기준액(2026년 단독 월 140만 원) 이하인 사람이 대상이며, 기초급여 최고액은 " +
        "18~64세 기준 월 34만 9,700원이다.",
      assertionType: "FACT",
      sourceIds: ["src-vegannews-390679"],
      verified: true,
    },
    {
      id: "claim-pension-2027",
      text:
        "2027년 예산안은 2027년 7월부터 장애인연금 대상을 '장애의 정도가 심한 장애인' 전체로 넓혀, 그동안 장애수당만 받던 옛 3급 단일장애인 " +
        "등 26만 7천 명을 새로 포함한다(34만 5천→61만 2천 명). 새로 들어오는 3급 단일장애인의 기초급여는 기존 수급자의 절반 수준이다.",
      assertionType: "FACT",
      sourceIds: ["src-nocut-6573485"],
      verified: true,
    },
    {
      id: "claim-parking-ratio",
      text:
        "주차장법 시행령은 건축물 부설주차장의 2~4% 범위에서 지자체 조례로 장애인 전용주차구역 비율을 정하게 한다. 경기도만 해도 시군별로 " +
        "2%에서 4%까지 다르다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeongin-1733440"],
      verified: true,
    },
    {
      id: "claim-parking-debate",
      text:
        "일부 아파트에서는 비어 있는 장애인 주차면을 줄이자는 민원이 나오지만, 장애인 단체는 본인 명의 차량만 쓸 수 있는 등 이용이 어려운 " +
        "제도부터 고쳐야 하며 한번 줄이면 되찾기 어렵다고 반대한다.",
      assertionType: "CLAIM",
      assertedBy: "아파트 주민 / 한국장애인인권포럼",
      sourceIds: ["src-kyeongin-1733440"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-pension-2027",
      date: "2027-07",
      datePrecision: "month",
      title: "장애인연금 대상 확대 시행 예정",
      summary: "26만 7천 명 추가.",
      claimIds: ["claim-pension-2027"],
    },
  ],
  gaps: [
    "장애수당 월 6만 원 단가가 언제 정해졌고 2027년 예산안에서 인상되는지는 복지부 자료로 확인하지 못했다.",
    "장애인 전용주차구역 이용 자격(보행상 장애 여부)을 바꾸려는 정부 논의는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-vegannews-390679",
      title: "장애수당 월 6만원…장애인연금과 대상 달라",
      publisher: "비건뉴스",
      url: "https://www.vegannews.co.kr/news/article.html?no=390679",
      publishedAt: "2026-10-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nocut-6573485",
      title: "장애등급제 폐지 9년 만에…연금 '사각지대' 중증장애인 26만명 품는다",
      publisher: "노컷뉴스",
      url: "https://nocutnews.co.kr/news/6573485",
      publishedAt: "2026-09-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kyeongin-1733440",
      title: "[여러분 생각은?] 장애인 주차구역 줄여도 될까",
      publisher: "경인일보",
      url: "https://www.kyeongin.com/article/1733440",
      publishedAt: "2025-03-23",
      type: "press",
      license: "link-only",
    },
  ],
};
