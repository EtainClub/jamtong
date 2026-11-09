import type { PolicyInput } from "./schema";

/**
 * 중국산 등 수입식품 안전관리: 통관 검사, 해외 제조업소 현지실사, 2026년 국정감사 지적.
 *
 * 대통령 유튜브 영상 답글에 "중국산 식자재 수입이 늘고 있으니 국민이 안심할 수 있게 안전을 점검해 달라"는 요청이 달렸다(잼통 Voice).
 * 수입 규모, 식약처가 쓰는 관리 수단, 국감에서 나온 수치를 적는다.
 *
 * ★ 수치 대부분은 국회의원실이 식약처 자료를 분석한 것이다. 분석 주체를 밝힌다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #254.
 */
export const IMPORTED_FOOD_SAFETY: PolicyInput = {
  slug: "imported-food-safety",
  title: "중국산 수입식품 안전관리와 2026년 국정감사 지적",
  scope:
    "중국산 수입식품 수입 건수 증가(2021~2025), 통관 부적합률, 중국 소재 해외 제조업소 현지실사 결과와 수입 중단, 김장철 집중 검사",
  ministries: ["식품의약품안전처"],
  categories: ["welfare"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-china-food",
      text: "중국산 식자재 수입이 늘고 있으니 국민이 안심할 수 있게 안전을 점검해 달라",
      claimIds: ["claim-volume", "claim-inspection", "claim-onsite", "claim-kimjang"],
    },
  ],
  claims: [
    {
      id: "claim-volume",
      text:
        "전종덕 의원실이 식약처 자료를 분석한 결과, 중국산 수입식품 수입 건수는 2021년 23만 5,224건에서 2025년 31만 2,432건으로 32.8% 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-khealth-101658"],
      verified: true,
    },
    {
      id: "claim-inspection",
      text:
        "식약처는 중국산 수입식품의 통관 부적합률이 0.18%라고 밝혔다. 이 비율은 실제 검사 건수가 아니라 전체 수입 건수를 분모로 한 것이라는 지적이 있다. " +
        "부적합 판정을 받은 업체의 같은 식품은 이후 정밀검사를 반복해 받으며, 정밀검사 횟수 상한은 최대 20회로 강화됐다.",
      assertionType: "FACT",
      sourceIds: ["src-news33-118564", "src-news1-6305482"],
      verified: true,
    },
    {
      id: "claim-onsite",
      text:
        "중국 소재 해외 제조업소 현지실사에서 부적합 판정을 받은 업소는 2021년 89곳 중 1곳에서 2025년 105곳 중 13곳으로 늘었다. 2025년에는 개선 필요 11곳, 부적합 13곳, 실사 거부·기피 2곳으로 " +
        "4곳 중 1곳이 적합 판정을 받지 못했다. 2021년부터 2026년 8월까지 85곳이 부적합이나 실사 거부·기피로 수입이 중단됐다.",
      assertionType: "FACT",
      sourceIds: ["src-agrinet-407872", "src-foodtoday-208736"],
      verified: true,
    },
    {
      id: "claim-kimjang",
      text:
        "식약처는 2026년 김장철을 앞두고 수입 배추·고춧가루 등의 수입·유통 단계 검사를 강화하고, 중국산 배추와 절임배추의 포름알데히드 검사를 계속한다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2645843"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-onsite"],
  timeline: [],
  gaps: [
    "식약처 수입식품 검사 인력이 수입 증가에 맞춰 늘었는지는 의원실도 확인하지 못했다고 밝혔다.",
  ],
  sources: [
    {
      id: "src-khealth-101658",
      title: "중국산 수입식품 5년 새 33% 증가…\"현지 제조업소 안전관리 점검 강화 시급\"",
      publisher: "헬스경향",
      url: "https://www.k-health.com/news/articleView.html?idxno=101658",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news33-118564",
      title: "중국산 수입식품 부적합률 0.18%는 안전 신호인가…현지실사 부적합은 1곳→13곳",
      publisher: "창업일보",
      url: "https://www.news33.net/news/articleView.html?idxno=118564",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-6305482",
      title: "부적합 수입식품 검사 더 깐깐해진다…정밀검사 최대 20회",
      publisher: "뉴스1",
      url: "https://www.news1.kr/bio/general/6305482",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-agrinet-407872",
      title: "중국산 수입식품 현지실사, 4곳 중 1곳 문제",
      publisher: "한국농어민신문",
      url: "https://www.agrinet.co.kr/news/articleView.html?idxno=407872",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-foodtoday-208736",
      title: "[2026 국감] 중국산 식품 현지 부적합 업체 13배↑…식약처 관리 도마",
      publisher: "푸드투데이",
      url: "https://www.foodtoday.or.kr/news/article.html?no=208736",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-2645843",
      title: "식약처, 김장철 수입 배추·고춧가루 집중 검사…김장매트도 첫 포함",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2645843",
      publishedAt: "2026-11",
      type: "press",
      license: "link-only",
    },
  ],
};
