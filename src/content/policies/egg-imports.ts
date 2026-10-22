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
 * ★ 2026-10-23 신통 이슈 #63: 브라질산 한 판 원가를 3만 9천 원이 아니라 4만 4천 원이라고
 *   하는 글이 돈다. 4만 3,923원은 aT 정산 자료와 농식품부 설명자료(10월 15일)에 나온 최종
 *   수입단가라 FACT로 적고, 의원실 계산(3만 9천 원)과 나란히 둔다.
 */
export const EGG_IMPORTS: PolicyInput = {
  slug: "egg-imports",
  title: "계란 수입과 할인 판매 (2026)",
  scope: "2026년 조류인플루엔자 이후 신선란 수입, 수입 원가, 할인 판매와 그 비용",
  ministries: ["농림축산식품부"],
  categories: ["economy", "welfare"],
  asOf: "2026-10-23",
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
    {
      id: "rumor-44000",
      text: "브라질산 계란이 한 판에 39,000원이 아니라 44,000원이다",
      claimIds: ["claim-brazil-final-cost", "claim-brazil-breakdown", "claim-two-figures"],
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
    {
      id: "claim-brazil-final-cost",
      text:
        "김용태 의원은 10월 14일 한국농수산식품유통공사(aT) 국정감사에서 aT 정산 자료를 근거로 브라질산 계란 구입 " +
        "단가가 개당 1,464원, 한 판(30개) 4만 3,923원이라고 지적했다. 농식품부도 10월 15일 설명자료에서 장거리 " +
        "항공운송과 관세 때문에 30개 기준 수입단가가 4만 3,923원으로 집계됐다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-egg-1014", "src-asiae-egg-1015"],
      verified: true,
    },
    {
      id: "claim-brazil-breakdown",
      text:
        "농식품부에 따르면 브라질산은 112만 개로, 2026년 미국·태국·브라질·덴마크에서 들여온 신선란 1억 3,324만 개의 " +
        "약 0.8%다. 브라질산에 든 약 16억 원 가운데 현지 계란 구매비는 약 2억 원(개당 178원, 한 판 5,340원)이고, " +
        "나머지 약 14억 원이 항공운송비·관세 등이었다. 관세는 국내 세입으로 들어갔다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-egg-1015", "src-segye-egg-1015"],
      verified: true,
    },
    {
      id: "claim-supply-price",
      text:
        "농식품부는 수입국별 원가와 관계없이 정책적으로 정한 공급가격을 적용했고, 전체 수입 기간 평균 공급가격은 " +
        "개당 약 131원이었다고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "농림축산식품부",
      sourceIds: ["src-asiae-egg-1015"],
      verified: true,
    },
    {
      id: "claim-two-figures",
      text:
        "한 판 3만 9천 원(개당 약 1,300원)은 10월 8일 의원실이 농식품부 국감 자료로 계산해 알려진 숫자이고, " +
        "4만 3,923원(개당 1,464원)은 그 뒤 aT 정산 자료와 농식품부 설명자료에 나온 최종 수입단가다. '4만 4천 원'은 " +
        "4만 3,923원을 반올림한 값으로 공식 자료와 맞는다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-chukkyung-egg-1008", "src-mt-egg-1014", "src-asiae-egg-1015"],
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
    {
      id: "t-final-cost",
      date: "2026-10-15",
      datePrecision: "day",
      title: "브라질산 최종 수입단가 한 판 4만 3,923원 공개",
      summary: "aT 국감(14일)과 농식품부 설명자료(15일).",
      claimIds: ["claim-brazil-final-cost", "claim-brazil-breakdown", "claim-supply-price"],
    },
  ],
  gaps: [
    "국고 투입액이 보도마다 다르다(약 800억 원, 819억 원, 1,200억 원, 1,211억 9,300만 원). 농식품부 원자료를 확인하지 못했다.",
    "의원실의 3만 9천 원 계산과 aT 정산의 4만 3,923원이 어떤 비용 항목에서 갈리는지 원자료로 확인하지 못했다.",
    "4,980원 할인 판매의 물량과 정확한 기간, 브라질산이 그중 얼마였는지 확인하지 못했다.",
    "유통업자에게 개당 약 100원에 넘겼다는 것은 의원 주장이다. 농식품부는 전체 평균 공급가를 개당 약 131원이라고 했고, 브라질산만의 공급가는 확인하지 못했다.",
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
    {
      id: "src-mt-egg-1014",
      title: "\"계란 한 판 4만3923원에 들여와\"...브라질산 '고가 수입' 질타",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/politics/2026/10/14/2026101411310899890",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-egg-1015",
      title: "'한 판에 4만4000원' 브라질산 계란 수입 논란에…농식품부 \"공급망 확보 목적\"",
      publisher: "아시아경제",
      url: "https://www.asiae.co.kr/article/2026101516135890716",
      publishedAt: "2026-10-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-egg-1015",
      title: "계란 한 판에 4.4만원… 정부는 왜 브라질산 수입에 16억을 썼나",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20261015519628",
      publishedAt: "2026-10-15",
      type: "press",
      license: "link-only",
    },
  ],
};
