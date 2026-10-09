import type { PolicyInput } from "./schema";

/**
 * 계란 수입과 할인 판매 (2026).
 *
 * 인스타그램에 "39,000원에 들여온 계란을 4,980원에 판다"는 카드가 돌았다. 잼통 신고
 * 센터에 처음 들어온 실제 제보다.
 *
 * ★ 이 주장은 대체로 근거가 있다.
 *   숫자는 국민의힘 김용태 의원실이 농림축산식품부 국정감사 자료로 계산한 것이고,
 *   할인 판매도 실제로 있었다. 정부에 불리한 주장이라고 해서 틀렸다고 쓰지 않는다.
 *   빠진 맥락(브라질산은 일부였고 물량 대부분은 미국산이었다는 것, 정부 해명)을
 *   함께 적어 둘 뿐이다.
 *
 * ★ 원가는 의원실 계산이라 CLAIM이다. 국고 투입액은 보도마다 다르다(800억·1,200억·
 *   1,211억). 축산경제신문이 농식품부 국감 자료로 적은 1,211억 원을 쓰고, 나머지는
 *   gaps에 남긴다.
 */
export const EGG_IMPORTS: PolicyInput = {
  slug: "egg-imports",
  title: "계란 수입과 할인 판매 (2026)",
  scope: "2026년 조류인플루엔자 이후 신선란 수입, 수입 원가, 할인 판매와 그 비용",
  ministries: ["농림축산식품부"],
  categories: ["economy", "welfare"],
  asOf: "2026-10-09",
  rumors: [
    {
      id: "rumor-39000-to-4980",
      text: "정부가 한 판 39,000원에 들여온 계란을 4,980원에 판다(세금 낭비)",
      claimIds: ["claim-unit-cost", "claim-sale-price", "claim-budget", "claim-ministry"],
    },
    {
      id: "rumor-diplomacy",
      text: "외교 성과를 위해 비싼 브라질산 계란을 사 줬다",
      claimIds: ["claim-lawmaker", "claim-ministry"],
    },
  ],
  claims: [
    {
      id: "claim-decision",
      text:
        "2026년 6월 4일 정부는 민생물가 특별관리 관계장관 태스크포스 회의에서 계란값 안정을 " +
        "위해 브라질산 계란을 처음 수입하는 등 신선란 3,123만 개를 추가로 들여오기로 했다. " +
        "당시 계란 한 판 가격은 7,500원대에 육박했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-egg-0604"],
      verified: true,
    },
    {
      id: "claim-unit-cost",
      text:
        "농식품부 국정감사 자료를 분석한 결과, 30개 한 판 기준 수입 원가는 브라질산 약 " +
        "3만 9,000원(개당 약 1,300원), 덴마크산 약 2만 2,830원, 미국산 약 1만 3,930원, " +
        "태국산 약 9,170원이었고, 물량 대부분은 미국산이었다.",
      assertionType: "CLAIM",
      assertedBy: "김용태 국민의힘 의원실",
      sourceIds: ["src-chukkyung-egg-1008", "src-newspim-egg-1008"],
      verified: true,
    },
    {
      id: "claim-sale-price",
      text:
        "수입한 계란은 정부 할인 지원을 거쳐 2026년 7~8월 대형마트에서 한 판 4,980원에 " +
        "판매됐다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-egg-1008"],
      verified: true,
    },
    {
      id: "claim-budget",
      text:
        "2026년 신선란 수입사업에 들어간 국고는 1,211억 9,300만 원이고, 수입업체가 " +
        "한국농수산식품유통공사(aT)에 공급한 신선란 계약금액은 621억 1,800만 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-chukkyung-egg-1008"],
      verified: true,
    },
    {
      id: "claim-ministry",
      text:
        "농식품부는 브라질산 수입이 외교 일정과 무관하며 조류인플루엔자에 따른 계란값 안정을 " +
        "위한 공급선 다변화였다고 밝혔다. 송미령 장관은 조류인플루엔자가 없는 지역에서 " +
        "수입선을 찾기 어려웠고 항공 운송으로 비용이 높아졌다며, 지금은 수입을 중단했다고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "농림축산식품부",
      sourceIds: ["src-newspim-egg-1008", "src-wikitree-egg-1008"],
      verified: true,
    },
    {
      id: "claim-effect",
      text:
        "농식품부는 미국산 수입만 따져 700억 원의 가격 안정 효과를 거뒀다고 자체 추산했다. " +
        "네 나라 계란 수입에 들어간 국고 1,211억 원과 단순 비교하기는 어렵다.",
      assertionType: "CLAIM",
      assertedBy: "농림축산식품부",
      sourceIds: ["src-chukkyung-egg-1008"],
      verified: true,
    },
    {
      id: "claim-lawmaker",
      text:
        "김용태 의원은 정부가 개당 약 1,300원에 들여온 브라질산 계란을 국내 유통업자에게 " +
        "개당 약 100원에 넘겼다며, 대통령의 외교 성과를 위해 비싼 계란을 사 준 것이 아닌지 " +
        "의심된다고 주장했다.",
      assertionType: "CLAIM",
      assertedBy: "김용태 국민의힘 의원",
      sourceIds: ["src-newspim-egg-1008"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-decision",
      date: "2026-06-04",
      datePrecision: "day",
      title: "브라질산 첫 수입 등 신선란 추가 수입 결정",
      summary: "민생물가 특별관리 관계장관 TF.",
      claimIds: ["claim-decision"],
    },
    {
      id: "t-sale",
      date: "2026-07",
      datePrecision: "month",
      title: "대형마트 할인 판매 (7~8월)",
      summary: "정부 할인 지원으로 한 판 4,980원.",
      claimIds: ["claim-sale-price"],
    },
    {
      id: "t-audit",
      date: "2026-10-08",
      datePrecision: "day",
      title: "국정감사에서 수입 원가 공개",
      summary: "의원실 계산과 농식품부 해명.",
      claimIds: ["claim-unit-cost", "claim-ministry", "claim-lawmaker"],
    },
  ],
  gaps: [
    "국고 투입액이 보도마다 다르다(약 800억 원, 1,200억 원, 1,211억 9,300만 원). 농식품부 원자료를 확인하지 못했다.",
    "수입 원가 계산에 포장비·검역비·항공운송비가 어디까지 들어갔는지 원자료로 확인하지 못했다.",
    "4,980원 할인 판매의 물량과 정확한 기간, 브라질산이 그중 얼마였는지 확인하지 못했다.",
    "유통업자에게 개당 약 100원에 넘겼다는 것은 의원 주장이다. 농식품부의 공급가 자료를 확인하지 못했다.",
    "수입이 계란값 안정에 얼마나 기여했는지 정부 분석 자료는 보도에서 확인되지 않았다.",
  ],
  sources: [
    {
      id: "src-hankook-egg-0604",
      title: "계란 한 판이 7500원… 정부 \"브라질산 계란 최초 수입\"",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026060411000001694",
      publishedAt: "2026-06-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-chukkyung-egg-1008",
      title: "농식품부 국정감사 | 수입란에 국고 1212억 쏟았다",
      publisher: "축산경제신문",
      url: "https://www.chukkyung.co.kr/news/articleView.html?idxno=83195",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-egg-1008",
      title: "[2026 국감] 김용태 \"브라질산 계란 1300원에 수입해 100원 유통…성과용 외교\"",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261008000945",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-wikitree-egg-1008",
      title: "정부, 계란 한 판 3만9000원에 수입해 4980원에 풀었다",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1164801",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
  ],
};
