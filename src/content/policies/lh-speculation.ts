import type { PolicyInput } from "./schema";

/**
 * 2021년 LH 직원 땅 투기 사건과 후속 조치.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」 답글에 "부동산 투기를 잡겠다면서 공기업 LH 관련 투기에는
 * 눈을 감는다"는 말이 달렸다(잼통 Voice). 사건 이후 수사와 확인되는 조치를 적는다.
 *
 * ★ 사건은 문재인 정부 때인 2021년에 드러났다. 이재명 정부의 별도 조치는 찾지 못했다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #134.
 */
export const LH_SPECULATION: PolicyInput = {
  slug: "lh-speculation",
  title: "2021년 LH 직원 땅 투기 사건과 후속 조치",
  scope: "2021년 3월 드러난 LH 직원들의 3기 신도시 투기 사건, 지방경찰청 수사 결과 사례, 이후 확인되는 제도 변화와 확인하지 못한 것",
  ministries: ["국토교통부", "경찰청"],
  categories: ["institution", "region"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-blind-eye",
      text: "부동산 투기를 잡겠다면서 공기업 LH 관련 투기에는 눈을 감는다",
      claimIds: ["claim-case", "claim-jeonbuk", "claim-conviction"],
    },
  ],
  claims: [
    {
      id: "claim-case",
      text: "2021년 3월 LH 직원들이 경기 광명·시흥 등 3기 신도시 예정지에서 내부 정보를 이용해 땅을 샀다는 의혹이 드러나 전국 경찰이 수사에 나섰다.",
      assertionType: "FACT",
      sourceIds: ["src-jjan-20211005"],
      verified: true,
    },
    {
      id: "claim-jeonbuk",
      text:
        "전북경찰청은 8개월간 142건 350명을 수사해 89건 201명을 검찰에 송치했다(1명 구속). 송치 유형은 내부정보 이용 14건 64명, " +
        "불법 형질변경·보상 노린 투기 23건 31명, 분양권 불법전매 등 52건 106명이었다.",
      assertionType: "FACT",
      sourceIds: ["src-jjan-20211005"],
      verified: true,
    },
    {
      id: "claim-conviction",
      text:
        "내부 정보로 땅 투기를 한 혐의를 받은 LH 직원은 1심 무죄가 2심에서 뒤집혀 2023년 8월 대법원에서 징역 2년이 확정됐고, 투기에 쓰인 " +
        "4개 필지 약 1만 7천㎡가 모두 몰수됐다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20230831"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-case",
      date: "2021-03",
      datePrecision: "month",
      title: "LH 직원 투기 의혹",
      summary: "3기 신도시.",
      claimIds: ["claim-case"],
    },
    {
      id: "t-jeonbuk",
      date: "2021-10-05",
      datePrecision: "day",
      title: "전북경찰 수사 마무리",
      summary: "201명 송치.",
      claimIds: ["claim-jeonbuk"],
    },
    {
      id: "t-conviction",
      date: "2023-08-31",
      datePrecision: "day",
      title: "LH 직원 징역 2년 확정",
      summary: "토지 몰수.",
      claimIds: ["claim-conviction"],
    },
  ],
  gaps: [
    "전국 LH 투기 사건 피고인 전체의 최종 재판 결과(유죄·무죄 건수)는 정리하지 못했다.",
    "사건 이후 도입된 LH 임직원 재산등록·미공개정보 이용 처벌 강화의 법령 원문은 대조하지 못했다.",
    "2025~2026년 LH 관련 새 투기 의혹과 이재명 정부의 대응은 찾지 못했다. 답글이 어떤 사건을 가리키는지도 나오지 않는다.",
  ],
  sources: [
    {
      id: "src-jjan-20211005",
      title: "전북경찰 8개월 간 부동산투기 수사 마무리",
      publisher: "전북일보",
      url: "https://www.jjan.kr/article/20211005741441",
      publishedAt: "2021-10-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20230831",
      title: "'내부 정보 투기' LH 전 직원, 징역 2년 확정...\"부동산 모두 몰수\"",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0103_202308311818138748",
      publishedAt: "2023-08-31",
      type: "press",
      license: "link-only",
    },
  ],
};
