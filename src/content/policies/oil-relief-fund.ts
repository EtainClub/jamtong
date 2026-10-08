import type { PolicyInput } from "./schema";

/**
 * 고유가 피해지원금.
 *
 * 2026년 중동 전쟁 추경(26.2조 원)에 들어간 4.8조 원짜리 지원금이다. "전 국민
 * 지급", "누구나 ○○만 원" 같은 말과 신청 링크 사칭이 돌았다.
 *
 * ★ 금액표는 행정안전부 안내 페이지 기준이다. 보도마다 인구감소지역 금액을
 *   다르게 적었는데, 행안부 표는 우대지원지역 20만·특별지원지역 25만으로 나눈다.
 * ★ 사용기한(2026-08-31)이 지났다. 지금 "받을 수 있다"는 글은 시점이 틀린 것이다.
 */
export const OIL_RELIEF_FUND: PolicyInput = {
  slug: "oil-relief-fund",
  title: "고유가 피해지원금",
  scope: "2026년 중동 전쟁 추경으로 지급한 고유가 피해지원금의 대상·금액·기한",
  ministries: ["행정안전부"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-08",
  rumors: [
    {
      id: "rumor-everyone",
      text: "전 국민이 똑같이 받는다",
      claimIds: ["claim-target", "claim-amounts"],
    },
    {
      id: "rumor-still-usable",
      text: "지금 신청하면 아직 받을 수 있다",
      claimIds: ["claim-deadline"],
    },
  ],
  claims: [
    {
      id: "claim-budget",
      text:
        "고유가 피해지원금은 2026년 3월 31일 국무회의가 의결한 26조 2천억 원 규모 " +
        "중동전쟁 위기 극복 추경안 가운데 4조 8천억 원으로 편성됐다.",
      assertionType: "FACT",
      sourceIds: ["src-daum-relief-0331"],
      verified: true,
    },
    {
      id: "claim-target",
      text:
        "대상은 건강보험료 기준 소득 하위 70%로, 추경안 발표 때 약 3,577만 명으로 " +
        "추산됐다. 재산세 과세표준 합계 12억 원 초과 또는 금융소득 2천만 원 초과 가구는 " +
        "제외됐다.",
      assertionType: "FACT",
      sourceIds: ["src-daum-relief-0331", "src-korea-relief-2nd"],
      verified: true,
    },
    {
      id: "claim-amounts",
      text:
        "1인당 금액은 지역과 계층에 따라 10만~60만 원이다. 소득 하위 70%는 수도권 " +
        "10만 원, 비수도권 15만 원, 인구감소지역 중 우대지원지역 20만 원·특별지원지역 " +
        "25만 원이다. 기초수급자는 수도권 55만·비수도권 60만 원, 차상위·한부모는 " +
        "수도권 45만·비수도권 50만 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-mois-relief", "src-korea-relief-2nd"],
      verified: true,
    },
    {
      id: "claim-schedule",
      text:
        "기초수급자·차상위·한부모는 2026년 4월 27일부터 먼저 신청했고, 소득 하위 70%는 " +
        "5월 18일부터 7월 3일까지 2차로 신청했다.",
      assertionType: "FACT",
      sourceIds: ["src-mois-relief"],
      verified: true,
    },
    {
      id: "claim-deadline",
      text:
        "사용기한은 1·2차 모두 2026년 8월 31일까지였고, 쓰지 않은 잔액은 소멸됐다. " +
        "주소지 관할 지역의 매장에서만 쓸 수 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-mois-relief", "src-korea-relief-2nd"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-cabinet",
      date: "2026-03-31",
      datePrecision: "day",
      title: "추경안 국무회의 의결",
      summary: "26.2조 원 추경 가운데 4.8조 원이 고유가 피해지원금이다.",
      claimIds: ["claim-budget"],
    },
    {
      id: "t-first",
      date: "2026-04-27",
      datePrecision: "day",
      title: "1차 신청 시작",
      summary: "기초수급자·차상위·한부모부터 받았다.",
      claimIds: ["claim-schedule"],
    },
    {
      id: "t-second",
      date: "2026-05-18",
      datePrecision: "day",
      title: "2차 신청 시작",
      summary: "소득 하위 70%가 7월 3일까지 신청했다.",
      claimIds: ["claim-schedule"],
    },
    {
      id: "t-deadline",
      date: "2026-08-31",
      datePrecision: "day",
      title: "사용기한 종료",
      summary: "남은 잔액은 소멸됐다.",
      claimIds: ["claim-deadline"],
    },
  ],
  gaps: [
    "국회 최종 의결 금액과 실제 지급 인원·집행액은 확인하지 못했다. 3,577만 명은 추경안 발표 때의 추산이다.",
    "신청 링크 사칭 피해 규모는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-mois-relief",
      title: "고유가 피해지원금 안내",
      publisher: "행정안전부",
      url: "https://www.mois.go.kr/frt/sub/a06/b07/highOilPriceSupport/screen.do",
      type: "official",
      license: "public",
    },
    {
      id: "src-korea-relief-2nd",
      title: "고유가 피해지원금 2차 지급 18일 시작…국민 70%에 10~25만 원",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148964141",
      publishedAt: "2026-05-11",
      type: "official",
      license: "public",
    },
    {
      id: "src-daum-relief-0331",
      title: "'국민 70%' 3577만명에 '고유가 지원금'…최대 60만원 준다",
      publisher: "다음 뉴스",
      url: "https://v.daum.net/v/20260331134654505",
      publishedAt: "2026-03-31",
      type: "press",
      license: "link-only",
    },
  ],
};
