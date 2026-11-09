import type { PolicyInput } from "./schema";

/**
 * 새출발기금(소상공인·자영업자 채무조정)의 대상과 2025년 확대, 지식산업센터 분양 피해.
 *
 * 대통령 유튜브 영상 답글에 "새출발기금 채무조정에서 거주지 대출은 빼 주는 등 지식산업센터 분양 피해자도 구제해 달라"는 제안이 달렸다(잼통 Voice).
 * 새출발기금이 누구의 어떤 빚을 조정하는지, 2025년 무엇이 넓어졌는지, 지식산업센터 피해 구제가 어디까지 왔는지 적는다.
 *
 * ★ 장기 연체채권 소각(새도약기금)은 별개 제도다 — policy:new-leap-fund.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #252.
 */
export const NEW_START_FUND: PolicyInput = {
  slug: "new-start-fund",
  title: "새출발기금 지원 대상과 지식산업센터 분양 피해",
  scope:
    "코로나 피해 소상공인 채무조정 프로그램 새출발기금의 대상 사업 기간·감면율 확대(2025년 9월), 지식산업센터 수분양자 피해와 구제 논의",
  ministries: ["금융위원회", "한국자산관리공사"],
  categories: ["economy", "welfare"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-kic",
      text: "새출발기금 채무조정에서 거주지 대출은 빼 주는 등 지식산업센터 분양 피해자도 구제해 달라",
      claimIds: ["claim-expand", "claim-low-income", "claim-kic"],
    },
  ],
  claims: [
    {
      id: "claim-expand",
      text:
        "금융위원회는 2025년 9월 22일부터 새출발기금 대상 사업 영위 기간을 '2020년 4월부터 2025년 6월 중'으로 넓혔다. 2024년 12월 비상계엄 이후 창업한 사업자도 대상에 들어간다. " +
        "2차 추경 7,000억 원이 새출발기금에 출자됐다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-20250918"],
      verified: true,
    },
    {
      id: "claim-low-income",
      text:
        "총 채무액 1억 원 이하 저소득 부실차주의 무담보 채무 원금 감면율은 최대 80%에서 90%로, 거치기간은 최대 1년에서 3년으로, 상환기간은 최대 10년에서 20년으로 늘었다. " +
        "30일 이하 연체자의 조정 후 금리 상한은 9%에서 3.9~4.7%로 낮아졌고, 이 조건은 기존 이용자에게도 소급 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-20250918"],
      verified: true,
    },
    {
      id: "claim-kic",
      text:
        "지식산업센터 수분양자들은 허위·과장 분양 광고 피해를 호소하며 모여 대응하고 있으나, 한 1심 재판부는 계약이 정당하게 체결됐다며 수분양자 주장을 받아들이지 않았다. " +
        "구리시는 분쟁 조사를 했지만 홍보 행위의 위법 여부는 사법부가 판단할 사안이라는 입장이다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20260318"],
      verified: true,
    },
    {
      id: "claim-kic-demand",
      text: "전국 15개 지식산업센터 피해자 단체는 분양 실태 전수조사, 허위·과장 광고 수사, 피해자 구제대책 마련을 요구하며 서울 도심에서 집회를 열었다.",
      assertionType: "FACT",
      sourceIds: ["src-challenge-6054"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-kic"],
  timeline: [
    {
      id: "t-expand",
      date: "2025-09-22",
      datePrecision: "day",
      title: "새출발기금 지원 확대",
      summary: "대상 기간·감면율 확대.",
      claimIds: ["claim-expand", "claim-low-income"],
    },
  ],
  gaps: [
    "지식산업센터 분양대금 대출이 새출발기금 조정 대상 채무에 들어가는지(사업용 대출 판정 기준)는 공식 안내로 확인하지 못했다.",
    "채무조정 때 거주 주택 담보대출을 제외해 주는 별도 장치는 새출발기금 공식 자료에서 찾지 못했다.",
    "지식산업센터 피해에 대한 정부 차원의 구제 대책은 11월 9일까지 나오지 않았다.",
  ],
  sources: [
    {
      id: "src-korea-20250918",
      title: "새출발기금 22일부터 지원 확대…원금 감면율 최대 90%까지",
      publisher: "대한민국 정책브리핑(금융위원회)",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148949556",
      publishedAt: "2025-09-18",
      type: "official",
      license: "public",
    },
    {
      id: "src-ytn-20260318",
      title: "[팩트추적] 피해 구제도 막막…달콤한 분양의 덫",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0532_202603182345017643",
      publishedAt: "2026-03-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-challenge-6054",
      title: "전국 15개 지식산업센터 피해자들, 서울 도심서 '사기분양' 규탄 집회 개최",
      publisher: "챌린지뉴스",
      url: "https://www.challengenews.co.kr/6054",
      type: "press",
      license: "link-only",
    },
  ],
};
