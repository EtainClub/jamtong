import type { PolicyInput } from "./schema";

/**
 * 민생회복 소비쿠폰 — 지급 구조와 효과 평가.
 *
 * "정부 스스로 소비쿠폰 정책의 낮은 효과를 인정했다"는 글이 돈다(2025년 12월 게시물).
 * 정부는 효과가 낮다고 인정하지 않았다. 2025년 10월 KDI 분석을 공개하며 효과가
 * 있었다고 설명했고, 분석 기간이 짧고 다른 대책의 영향이 섞였을 수 있다는 한계를
 * 밝혔다. 효과가 지급 직후 한두 달에 몰렸다는 분석은 2026년 6월 한국은행이 냈다.
 *
 * ★ 정부·KDI·한국은행의 수치는 모두 추정이므로 CLAIM으로 적는다.
 * ★ 2026-10-13 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #31.
 */
export const CONSUMPTION_COUPON: PolicyInput = {
  slug: "consumption-coupon",
  title: "민생회복 소비쿠폰 — 지급 구조와 효과 평가",
  scope: "2025년 민생회복 소비쿠폰 1·2차 지급 구조, 정부(KDI)와 한국은행의 효과 분석",
  ministries: ["행정안전부", "재정경제부"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-13",
  rumors: [
    {
      id: "rumor-admitted-low",
      text: "정부 스스로 소비쿠폰 정책의 낮은 효과를 인정했다",
      claimIds: ["claim-kdi-govt", "claim-govt-limits", "claim-bok", "claim-no-admission"],
    },
  ],
  claims: [
    {
      id: "claim-scheme",
      text:
        "1차 소비쿠폰은 2025년 7월 21일~9월 12일 신청을 받아 1인당 15만 원을 기본으로 주고, 차상위·한부모는 " +
        "30만 원, 기초수급자는 40만 원이었다. 비수도권 주민은 3만 원, 농어촌 인구감소지역(84개 시·군) " +
        "주민은 5만 원을 더 받았다. 2차는 건강보험료로 소득을 가려 국민 90%에게 1인당 10만 원을 " +
        "9월 22일~10월 31일 지급했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsseoul-20250706"],
      verified: true,
    },
    {
      id: "claim-kdi-govt",
      text:
        "기획재정부는 2025년 10월 1일 KDI 분석을 공개했다. 쿠폰을 쓸 수 있는 업종의 매출이 지급 직전 2주보다 " +
        "지급 뒤 6주 동안 평균 4.93% 늘었고, 쿠폰으로 새로 생긴 매출은 약 2조 1,073억 원으로 같은 기간 " +
        "쓰인 쿠폰 5조 원의 약 42.5%라고 했다. 2020년 재난지원금(26.2~36.1%)보다 높다고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "기획재정부·KDI",
      sourceIds: ["src-khan-20251001"],
      verified: true,
    },
    {
      id: "claim-govt-limits",
      text:
        "정부는 같은 기간 농축수산물 할인, 숙박쿠폰 같은 다른 내수 대책도 결과에 영향을 줬을 수 있다고 " +
        "밝혔다. 분석 기간이 짧아 효과를 다 잡기 어렵고, 지역사랑상품권으로 받은 쿠폰은 분석에서 빠졌다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20251001"],
      verified: true,
    },
    {
      id: "claim-bok",
      text:
        "한국은행은 2026년 6월 10일 'BOK 이슈노트'에서 쿠폰 사용처 1곳의 월평균 매출이 비사용처보다 약 " +
        "2.91% 늘었고, 효과가 1차 지급 뒤 약 2개월, 2차 지급 뒤 약 1개월 이어졌다고 분석했다. 신용카드 " +
        "지급분 9.1조 원으로 생긴 추가 매출은 약 2.8조 원(추정 방법에 따라 1.4조~3.6조 원)으로 투입액의 " +
        "약 30.9%이고, 한계소비성향은 0.2, 연간 GDP를 약 0.12% 끌어올린 것으로 봤다.",
      assertionType: "CLAIM",
      assertedBy: "한국은행",
      sourceIds: ["src-herald-20260609"],
      verified: true,
    },
    {
      id: "claim-no-admission",
      text:
        "정부가 소비쿠폰 효과가 '낮다'고 인정한 발표는 찾지 못했다. 정부는 효과가 있었다고 설명하며 분석의 " +
        "한계를 함께 밝혔다. 효과가 짧게 끝났다는 분석은 정부가 아니라 한국은행이 냈다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-khan-20251001", "src-herald-20260609"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-bok", "claim-govt-limits"],
  timeline: [
    {
      id: "t-first",
      date: "2025-07-21",
      datePrecision: "day",
      title: "1차 소비쿠폰 신청 시작",
      summary: "1인당 15만~40만 원(지역 추가분 별도).",
      claimIds: ["claim-scheme"],
    },
    {
      id: "t-second",
      date: "2025-09-22",
      datePrecision: "day",
      title: "2차 소비쿠폰 지급 시작",
      summary: "국민 90%에게 10만 원.",
      claimIds: ["claim-scheme"],
    },
    {
      id: "t-kdi",
      date: "2025-10-01",
      datePrecision: "day",
      title: "정부, KDI 효과 분석 공개",
      summary: "6주간 매출 4.93% 증가, 새 매출 2.1조 원.",
      claimIds: ["claim-kdi-govt", "claim-govt-limits"],
    },
    {
      id: "t-bok",
      date: "2026-06-10",
      datePrecision: "day",
      title: "한국은행 효과 평가",
      summary: "매출 2.91% 증가, 효과는 1~2개월. GDP 0.12% 상승.",
      claimIds: ["claim-bok"],
    },
  ],
  gaps: [
    "1·2차 최종 집행액 합계는 정부 발표로 확인하지 못했다.",
    "행정안전부의 2025년 12월 자체 평가 원문은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newsseoul-20250706",
      title: "행정안전부, 민생회복 소비쿠폰 7월 21일 지급 시작",
      publisher: "뉴스서울(행정안전부 관계부처 합동 브리핑)",
      url: "https://newsseoul.co.kr/news/view/1065601219312535",
      publishedAt: "2025-07-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20251001",
      title: "'소비쿠폰 반짝효과' 지적에 정부 \"6주간 관련 평균매출 5% 증가\" 해명",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202510011805001",
      publishedAt: "2025-10-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-20260609",
      title: "한은 \"작년 소비쿠폰 매출 효과 2.8조…GDP 0.12% 올려\"",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026060922445273471",
      publishedAt: "2026-06-09",
      type: "press",
      license: "link-only",
    },
  ],
};
