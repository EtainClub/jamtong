import type { PolicyInput } from "./schema";

/**
 * 석유제품 최고가격제와 정유사 손실 보전.
 *
 * "정유사 손실을 세금으로 보전하면 운전하지 않는 납세자 돈으로 운전자의 기름값을
 * 대 주는 셈이다"라는 답글이 돈다(2026년 10월). 상한은 정유사가 주유소에 넘기는
 * 공급가격에 걸리고, 손실은 정부 예비비로 사후 정산한다. 예비비 4조 2,000억원은
 * 확보한 한도이고 실제 지급액은 11월 말 첫 정산 뒤에야 나온다.
 *
 * ★ 재원이 일반 재정이라는 점은 사실이다. 혜택이 자가용 운전자에게만 가는지는
 *   경유·등유에도 상한이 걸린다는 점과 함께 적는다.
 * ★ 고유가 피해지원금(현금 지원)은 `oil-relief-fund`가 따로 다룬다.
 * ★ 2026-10-17 처음 등록 — 잼통 Voice voice-gap 이슈 #41.
 */
export const OIL_PRICE_CAP: PolicyInput = {
  slug: "oil-price-cap",
  title: "석유제품 최고가격제와 정유사 손실 보전",
  scope:
    "2026년 3월 시행한 석유제품 최고가격제의 대상·가격, 정유사 손실 정산 방식과 예비비 규모",
  ministries: ["산업통상부", "재정경제부"],
  categories: ["economy"],
  asOf: "2026-10-17",
  rumors: [
    {
      id: "rumor-taxpayers",
      text: "정유사 손실을 세금으로 보전하면 운전하지 않는 납세자 돈으로 운전자의 기름값을 대 주는 셈이다",
      claimIds: ["claim-reserve", "claim-settlement", "claim-who-pays"],
    },
  ],
  claims: [
    {
      id: "claim-launch",
      text:
        "산업통상부는 2026년 3월 13일 0시부터 석유제품 최고가격제를 시행했다. 상한은 정유사가 주유소·" +
        "대리점에 넘기는 공급가격에 걸리고, 주유소 판매가격은 대상에서 빠졌다. 1차 최고가격은 리터당 " +
        "보통휘발유 1,724원, 자동차용 경유 1,713원, 등유 1,320원으로, 3월 11일 정유사 평균 공급가격보다 " +
        "각각 109원·218원·408원 낮았다.",
      assertionType: "FACT",
      sourceIds: ["src-motir-20260313", "src-mt-20260312"],
      verified: true,
    },
    {
      id: "claim-basis",
      text:
        "근거는 석유의 수입·판매 가격이 현저하게 오르내리거나 그럴 우려가 있을 때 판매가격의 최고액을 " +
        "정할 수 있게 한 석유사업법 규정이다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260312"],
      verified: true,
    },
    {
      id: "claim-current",
      text:
        "10월 17일부터 4주간 적용되는 11차 최고가격은 리터당 휘발유 1,784원, 경유 1,773원, 등유 1,380원으로 " +
        "4개월 연속 동결됐다.",
      assertionType: "FACT",
      sourceIds: ["src-sedaily-20261016"],
      verified: true,
    },
    {
      id: "claim-settlement",
      text:
        "정유사가 손실액을 스스로 산정해 정산을 요청하면 최고가격 정산위원회가 업체별 원가와 적정 이윤을 " +
        "심사해 정산가격을 정하고, 그 뒤 손실보전금을 준다. 산업통상부는 3월 13일부터 6월 말까지의 손실 " +
        "자료를 9월 말까지 받았고, 첫 정산가격은 11월 말 확정할 계획이다. 7월 이후 손실은 분기별로 정산한다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260312", "src-dailian-20261004"],
      verified: true,
    },
    {
      id: "claim-reserve",
      text:
        "정부는 손실 보전용 목적예비비 4조 2,000억원을 확보했다. 당초 9월까지 필요한 금액을 2조 7,600억원으로 " +
        "추산했고, 국제유가가 배럴당 150달러까지 오를 경우에 대비해 국회예산정책처 의견을 반영해 1조 5,000억원을 " +
        "더했다. 시장가격과 최고가격의 차이가 리터당 100원 벌어질 때마다 약 1조 5,000억원이 든다고 보고, 그 " +
        "차이가 200원을 넘지 않는다고 가정했다. 이 금액은 예산 한도이며 실제 정산액은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261004", "src-dailian-20261004"],
      verified: true,
    },
    {
      id: "claim-who-pays",
      text:
        "손실 보전 재원이 예비비, 곧 일반 재정이므로 운전하지 않는 납세자도 부담을 나눈다는 지적은 재원 구조상 " +
        "맞다. 다만 상한은 휘발유뿐 아니라 화물·버스가 쓰는 경유와 난방용 등유에도 걸려 있어, 혜택이 자가용 " +
        "운전자에게만 가는 것은 아니다. 주유소 판매가격은 상한 대상이 아니어서 공급가 인하가 소비자 가격에 " +
        "얼마나 옮겨졌는지는 따로 따져야 한다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-motir-20260313", "src-fnnews-20261004", "src-sedaily-20261016"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-who-pays"],
  timeline: [
    {
      id: "t-launch",
      date: "2026-03-13",
      datePrecision: "day",
      title: "최고가격제 시행",
      summary: "휘발유 1,724원·경유 1,713원·등유 1,320원(공급가).",
      claimIds: ["claim-launch"],
    },
    {
      id: "t-reserve",
      date: "2026-10-04",
      datePrecision: "day",
      title: "손실보전 예비비 4.2조원 보도",
      summary: "가격 차이 100원당 1.5조원 산정.",
      claimIds: ["claim-reserve"],
    },
    {
      id: "t-11th",
      date: "2026-10-17",
      datePrecision: "day",
      title: "11차 최고가격 동결",
      summary: "4개월 연속 동결.",
      claimIds: ["claim-current"],
    },
  ],
  gaps: [
    "첫 정산(3월 13일~6월 30일분)의 실제 지급액은 2026년 11월 말 확정 예정이라 아직 없다.",
    "정유업계는 싱가포르 국제가격(MOPS) 기준으로 3조~4조원대 손실을 주장한다는 보도가 있으나 원문을 확인하지 못했다.",
    "공급가 상한이 주유소 판매가격을 얼마나 낮췄는지 비교한 공식 분석은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-motir-20260313",
      title: "(참고자료) 정부, 석유제품 가격 안정에 총력",
      publisher: "산업통상부",
      url: "https://www.motir.go.kr/kor/article/ATCL3f49a5a8c/171589/view",
      publishedAt: "2026-03-13",
      type: "official",
      license: "public",
    },
    {
      id: "src-mt-20260312",
      title: "13일부터 휘발유 공급가 1724원 상한…주유소 판매가에는 미적용",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/economy/2026/03/12/2026031214344330115",
      publishedAt: "2026-03-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-20261004",
      title: "기름값 상한 유지에 4조2000억원 확보…정유사 손실 11월 정산",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1697795/",
      publishedAt: "2026-10-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261004",
      title: "석유 시장·최고가 100원 차이땐 1조5000억 필요",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610041816219817",
      publishedAt: "2026-10-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sedaily-20261016",
      title: "7개월 넘긴 석유최고가격제…이번에도 동결",
      publisher: "서울경제",
      url: "https://m.sedaily.com/article/20102674",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
  ],
};
