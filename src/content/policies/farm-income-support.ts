import type { PolicyInput } from "./schema";

/**
 * 농가 경영안정 지원: 2027년 예산안과 2026년 추경, 쌀값 동향.
 *
 * 대통령의 「당장 먹을 쌀조차 없는 국민이 있다면」(10월 19일) 답글에 "생산비 상승과 가격
 * 하락에 시달리는 농가에 최대 800만 원의 긴급경영회복지원금과 1조 원 특별예산을 마련해
 * 달라"는 요청이 달렸다(잼통 Voice). 지금 있는 농가 소득·경영안정 장치와 2027년 예산안,
 * 2026년 쌀값 흐름을 적는다.
 *
 * ★ '800만 원 긴급경영회복지원금'을 누가 언제 제안했는지는 찾지 못했다. 정부안에는 그런
 *   항목이 없다(gaps).
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #90.
 */
export const FARM_INCOME_SUPPORT: PolicyInput = {
  slug: "farm-income-support",
  title: "농가 경영안정 지원: 2027년 예산안과 2026년 추경, 쌀값 동향",
  scope:
    "농림축산식품부 2027년 예산안의 공익직불·농산물 가격안정제·농어촌 기본소득, 2026년 추경의 농가 부담 경감 예산, 2026년 수확기 쌀값과 생산량",
  ministries: ["농림축산식품부"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-800",
      text: "생산비 상승과 가격 하락에 시달리는 농가에 최대 800만 원의 긴급경영회복지원금과 1조 원 특별예산을 마련해 달라",
      claimIds: ["claim-budget-2027", "claim-price-stabilization", "claim-supplementary", "claim-rice-price"],
    },
  ],
  claims: [
    {
      id: "claim-budget-2027",
      text:
        "농림축산식품부의 2027년 예산안은 22조 2,215억 원으로 2026년보다 10.4%(2조 853억 원) 늘었다. 증가액과 " +
        "증가율 모두 2000년 이후 최대다. 공익직불 예산은 2조 9,703억 원에서 3조 615억 원으로, 농어촌 기본소득 " +
        "시범사업은 3,047억 원에서 1조 1,658억 원(35개 군)으로 늘었다. 국회 심의 전 정부안이다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260901", "src-etnews-20260901"],
      verified: true,
    },
    {
      id: "claim-price-stabilization",
      text:
        "같은 예산안에 농산물 가격안정제가 처음 들어갔다(91억 원). 주요 농산물의 평균가격이 기준가격보다 낮아지면 " +
        "차액의 전부 또는 일부를 보전하는 제도다.",
      assertionType: "FACT",
      sourceIds: ["src-etnews-20260901"],
      verified: true,
    },
    {
      id: "claim-supplementary",
      text:
        "2026년 추가경정예산에서 농식품부는 2,658억 원을 편성했다. 중동 전쟁에 따른 요소 공급 차질과 농업용 면세유 " +
        "가격 상승으로 늘어난 농가 부담을 줄이는 것이 주목적이고, 축산농가 사료구매자금 융자 650억 원이 더해졌다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20260331"],
      verified: true,
    },
    {
      id: "claim-rice-price",
      text:
        "10월 15일 산지 쌀값은 20kg당 5만 7,580원으로 1년 전보다 1.2% 낮았다. 국가데이터처는 2026년 쌀 생산량을 " +
        "351만 8천 톤(0.6% 감소)으로 예상했고, 한국농촌경제연구원은 수확기(10~12월) 산지 쌀값이 전년보다 강보합일 " +
        "것으로 전망했다.",
      assertionType: "FACT",
      sourceIds: ["src-agrinet-408313", "src-fnnews-20261013"],
      verified: false,
    },
    {
      id: "claim-critique",
      text:
        "농민들은 10월 평균 쌀값이 전년보다 떨어진 채 시작했고 단위농협 수매가와 공공비축미 매입량이 줄었다며 " +
        "가격 하락을 걱정했다. 공익직불 예산은 2024년 정부가 밝힌 '2027년 5조 원' 목표에 크게 못 미친다.",
      assertionType: "OPINION",
      sourceIds: ["src-nongupin-208674", "src-mt-20260901"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-supp",
      date: "2026-03-31",
      datePrecision: "day",
      title: "2026년 추경 농식품부 2,658억 원",
      summary: "요소·면세유 부담 경감.",
      claimIds: ["claim-supplementary"],
    },
    {
      id: "t-budget",
      date: "2026-09-01",
      datePrecision: "day",
      title: "2027년 농식품부 예산안 22.2조 원",
      summary: "가격안정제 신설, 공익직불 3조 원대.",
      claimIds: ["claim-budget-2027", "claim-price-stabilization"],
    },
  ],
  gaps: [
    "'최대 800만 원 긴급경영회복지원금'과 '1조 원 특별예산'을 누가 제안했는지(농민단체·국회 등) 찾지 못했다. 정부 예산안에는 이 이름의 사업이 없다.",
    "2027년 예산안의 국회 심의 결과는 아직 나오지 않았다.",
    "소농직불 단가와 농업수입안정보험의 2027년 변화는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-mt-20260901",
      title: "농어촌기본소득 예산 3047억→1조1658억…공익직불금 3조원 돌파",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/article/2026090110103117937",
      publishedAt: "2026-09-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etnews-20260901",
      title: "[2027 예산안]농식품부 내년 예산 22.2조 '역대 최대'…기본소득 확대·3개 기금 통합",
      publisher: "전자신문",
      url: "https://m.etnews.com/20260901000235",
      publishedAt: "2026-09-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20260331",
      title: "[전쟁 추경]농어촌기본소득 시범사업 5곳 추가…올 하반기부터 지원",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026033109464182148",
      publishedAt: "2026-03-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-agrinet-408313",
      title: "올 수확기 쌀값 강보합 전망",
      publisher: "한국농어민신문",
      url: "https://www.agrinet.co.kr/news/articleView.html?idxno=408313",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261013",
      title: "올해 쌀 초과 생산 6만6000t",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610131824024687",
      publishedAt: "2026-10-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nongupin-208674",
      title: "올해산 쌀값, 정부는 '안내려간다는데' 농민은 '내려간다' 걱정",
      publisher: "농업인신문",
      url: "https://www.nongupin.co.kr/news/articleView.html?idxno=208674",
      type: "press",
      license: "link-only",
    },
  ],
};
