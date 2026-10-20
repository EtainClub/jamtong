import type { PolicyInput } from "./schema";

/**
 * 국민연금 기금 — 리밸런싱 유예, 환율 방어 역할, 2026년 하반기 평가액 감소.
 *
 * 인스타그램에 세 갈래 주장이 함께 돈다(2026년 10월).
 *   1. "정부가 국민연금까지 동원해 환율 방어에 나섰다"
 *   2. "정부가 증시 부양을 위해 리밸런싱을 유예시켰다"
 *   3. "단일 레버리지 도입과 리밸런싱 유예로 182조 원이 증발했고 7월 이후
 *      평가액이 35% 넘게 급감했다"
 * 셋 다 사실의 조각을 담고 있지만, 결정 주체와 숫자의 범위가 섞여 있다.
 *   - 외환스와프·전략적 환헤지는 실제로 있다. 다만 2022년부터 이어진 제도다.
 *   - 리밸런싱 유예는 복지부 장관이 위원장이고 노사·가입자 대표가 함께 앉는
 *     기금운용위원회가 의결했다. 정치적 동원이었는지는 국정감사의 쟁점이며
 *     판정하지 않는다.
 *   - 182조 원·35.3%는 '지분 5% 이상 공시 종목'의 평가액 감소다. 기금 전체가
 *     35% 줄었다는 뜻이 아니다. 7월 한 달 기금 전체 감소는 181.4조 원이다.
 *
 * ★ 평가액은 매일 바뀐다. 숫자마다 기준일을 붙인다.
 * ★ 2026-10-20 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #54·#55·#56.
 */
export const NPS_FUND_2026: PolicyInput = {
  slug: "nps-fund-2026",
  title: "국민연금 기금: 리밸런싱 유예·환율 방어·평가액 감소",
  scope:
    "2026년 국민연금기금운용위원회의 국내주식 리밸런싱 유예와 목표비중 상향, 외환스와프·전략적 환헤지, " +
    "2026년 6월 말 이후 보유주식 평가액 감소의 규모와 계산 범위",
  ministries: ["보건복지부", "재정경제부", "한국은행"],
  categories: ["economy"],
  asOf: "2026-10-20",
  rumors: [
    {
      id: "rumor-fx-defense",
      text: "정부가 국민연금까지 동원해 환율 방어에 나섰다",
      claimIds: ["claim-swap", "claim-hedge"],
    },
    {
      id: "rumor-rebalancing",
      text: "정부가 증시 부양을 위해 국민연금 리밸런싱을 유예시켰다",
      claimIds: ["claim-january", "claim-may", "claim-unanimous", "claim-opposition"],
    },
    {
      id: "rumor-182",
      text: "국민연금 182조 원이 증발했고 7월 이후 평가액이 35% 넘게 급감했다",
      claimIds: ["claim-182-scope", "claim-july-fund", "claim-allocation"],
    },
  ],
  claims: [
    {
      id: "claim-swap",
      text:
        "외환당국(기획재정부·한국은행)과 국민연금은 2025년 12월 15일 650억 달러 한도의 외환스와프를 2026년 말까지 " +
        "연장하기로 했다. 국민연금이 해외투자에 쓸 달러를 시장에서 사는 대신 외환보유액에서 빌리는 구조로, " +
        "2022년 9월 100억 달러로 시작해 한도를 늘려 왔다. 만기에 돌려받으므로 외환보유액 감소는 일시적이라는 것이 " +
        "당국 설명이다.",
      assertionType: "FACT",
      sourceIds: ["src-edaily-nps-swap-20251215"],
      verified: true,
    },
    {
      id: "claim-hedge",
      text:
        "전략적 환헤지는 환율이 정해 둔 기준보다 오르면 국민연금이 달러 표시 해외자산의 일정 비율까지 달러를 팔아 시장에 " +
        "달러를 공급하는 제도다. 2022년 말 0%에서 최대 10%로 한시적으로 올렸고, 기금운용위원회는 2026년 4월 14일 " +
        "전략적 환헤지 비율을 15%로 높였다(전술적 5%를 더해 최대 20%). 당시 원·달러 환율은 1,500원을 넘었다.",
      assertionType: "FACT",
      sourceIds: ["src-edaily-nps-swap-20251215", "src-edaily-nps-hedge-20260414"],
      verified: true,
    },
    {
      id: "claim-january",
      text:
        "기금운용위원회(위원장 정은경 보건복지부 장관)는 2026년 1월 26일 국내주식 목표비중을 14.4%에서 14.9%로 " +
        "올리고, 국내주식 비중이 허용범위(목표 ±3%p)를 벗어나도 기계적 매도(리밸런싱)를 한시적으로 유예하기로 " +
        "했다. 공식 이유로는 기금 규모 확대에 따른 외환조달 부담, 리밸런싱의 시장 영향 확대, 주식·외환시장 급변을 " +
        "들었다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-nps-20260126"],
      verified: true,
    },
    {
      id: "claim-may",
      text:
        "기금운용위원회는 2026년 5월 28일 국내주식 목표비중을 14.9%에서 20.8%로 올리고 허용범위를 한시적으로 " +
        "넓혔다(폭은 비공개). 새 목표는 리밸런싱 유예가 끝나는 6월 말부터 적용됐다. 복지부는 상법 개정 등에 따른 " +
        "시장 구조 변화 가능성과 실제 비중 확대를 이유로 들었다. 유예 종료 시 약 170조 원의 매도 물량이 나올 수 " +
        "있다는 우려가 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-nps-20260528"],
      verified: true,
    },
    {
      id: "claim-unanimous",
      text:
        "김성주 국민연금공단 이사장은 2026년 10월 14일 국정감사에서 \"1월 결정도 그렇고 5월 결정도 다 만장일치였다\", " +
        "\"정부의 주문 사항이 그대로 통과된 것을 경험해본 적 없다\"고 말했다. 증권사 보고서 등을 근거로 국내 증시를 " +
        "낙관적으로 본 것이 배경이라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "김성주 국민연금공단 이사장",
      sourceIds: ["src-mtn-nps-20261014", "src-khan-nps-20261014"],
      verified: true,
    },
    {
      id: "claim-opposition",
      text:
        "국민의힘 이달희 의원은 같은 국정감사에서 대통령의 국내주식 관련 발언 이후 유예와 비중 확대가 이뤄졌다며 " +
        "\"국민연금은 정권의 증시 부양 펀드가 아니다\", \"리밸런싱 유예라는 헛발질로 외국인에게 국내 주식을 비싸게 " +
        "팔고 나갈 기회를 줬다\"고 비판했다. 국민의힘은 국정조사를 추진하겠다고 밝혔다. 결정 과정이 담긴 회의록은 " +
        "2030년에 공개될 예정이다.",
      assertionType: "CLAIM",
      assertedBy: "이달희 국민의힘 의원",
      sourceIds: ["src-khan-nps-20261014", "src-mtn-nps-20261014"],
      verified: true,
    },
    {
      id: "claim-july-fund",
      text:
        "국민연금 기금 전체는 2026년 6월 말 1,865조 6천억 원에서 7월 말 1,684조 2천억 원으로 한 달 새 181조 4천억 원 " +
        "줄었다(약 9.7%). 같은 기간 국내주식 평가액은 124조 6천억 원 줄었고, 연초 이후 누적 수익률은 27.22%에서 " +
        "14.84%로 낮아졌다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-nps-20261014"],
      verified: true,
    },
    {
      id: "claim-182-scope",
      text:
        "\"182조 원\"은 에프앤가이드가 집계한 수치로, 국민연금이 지분 5% 이상을 보유해 공시한 상장사 287곳의 주식 " +
        "평가액이 6월 말 515조 9,293억 원에서 10월 15일 333조 5,330억 원으로 182조 3,963억 원(35.3%) 줄었다는 " +
        "뜻이다. 기금 전체가 35% 줄었다는 뜻이 아니며, 팔지 않은 주식의 평가손이다. 감소분의 71.8%가 SK하이닉스와 " +
        "삼성전자 두 종목에서 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-nps-20261018"],
      verified: true,
    },
    {
      id: "claim-allocation",
      text:
        "2026년 6월 말 기금 금융부문 자산 1,864조 8천억 원 가운데 국내주식은 29.1%로 연말 목표 20.8%보다 8.3%p " +
        "높았다. 주식 전체 비중은 64.5%였다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-nps-20261018"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-swap",
      date: "2025-12-15",
      datePrecision: "day",
      title: "외환스와프·전략적 환헤지 2026년 말까지 연장",
      summary: "650억 달러 한도 외환스와프를 1년 더 이어 가기로 했다.",
      claimIds: ["claim-swap"],
    },
    {
      id: "t-january",
      date: "2026-01-26",
      datePrecision: "day",
      title: "기금위, 국내주식 리밸런싱 한시 유예",
      summary: "목표비중을 14.9%로 올리고 기계적 매도를 미뤘다.",
      claimIds: ["claim-january"],
    },
    {
      id: "t-hedge",
      date: "2026-04-14",
      datePrecision: "day",
      title: "전략적 환헤지 비율 15%로 상향",
      summary: "환율이 1,500원을 넘은 때였다.",
      claimIds: ["claim-hedge"],
    },
    {
      id: "t-may",
      date: "2026-05-28",
      datePrecision: "day",
      title: "국내주식 목표비중 20.8%로 상향",
      summary: "허용범위도 한시적으로 넓혔다. 폭은 공개하지 않았다.",
      claimIds: ["claim-may"],
    },
    {
      id: "t-july",
      date: "2026-07",
      datePrecision: "month",
      title: "7월 한 달 기금 181조 원 감소",
      summary: "국내주식 평가액만 124조 원 넘게 줄었다.",
      claimIds: ["claim-july-fund"],
    },
    {
      id: "t-audit",
      date: "2026-10-14",
      datePrecision: "day",
      title: "국정감사에서 리밸런싱 유예 공방",
      summary: "야당은 증시 부양 동원을, 공단은 만장일치 결정을 말했다.",
      claimIds: ["claim-unanimous", "claim-opposition"],
    },
  ],
  critiqueIds: ["claim-opposition", "claim-july-fund", "claim-allocation"],
  gaps: [
    "단일종목 레버리지 상품 도입이 국민연금 평가액 감소와 어떻게 이어지는지 설명한 자료는 찾지 못했다. 레버리지 상품 자체는 별도 페이지(single-stock-leverage-etf)에 있다.",
    "리밸런싱 유예가 6월 말 이후에도 이어졌는지, 넓힌 허용범위의 폭이 얼마인지는 공개되지 않았다.",
    "리밸런싱을 유예하지 않았을 때와 비교한 손익 추정치는 찾지 못했다.",
    "외환스와프·환헤지가 실제로 얼마나 집행됐는지는 공개되지 않는다.",
    "2026년 10월 20일 기금운용위원회 회의 결과는 아직 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-edaily-nps-swap-20251215",
      title: "고환율에…국민연금 외환스와프·환헤지 1년 연장(종합)",
      publisher: "이데일리",
      url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=04178726642398848",
      publishedAt: "2025-12-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-edaily-nps-hedge-20260414",
      title: "국민연금, 전략적 환헤지 비율 15%로 상향…환율 방어 총력",
      publisher: "이데일리",
      url: "https://marketin.edaily.co.kr/News/Read?newsId=04523126645416120",
      publishedAt: "2026-04-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-nps-20260126",
      title: "기금위, 국내주식 비중 14.4%→14.9%…기계적매도 유예",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260126_0003490799",
      publishedAt: "2026-01-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-nps-20260528",
      title: "국민연금발 170조 매물폭탄 해소…국내주식 최대 '25.8%+α'(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260528_0003648199",
      publishedAt: "2026-05-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-nps-20261014",
      title: "“헛발질에 외국인 ATM 돼” vs “그땐 다들 증시 낙관”···국민연금 ‘리밸런싱 유예’ 놓고 국감 격돌",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202610141350001/",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-nps-20261014",
      title: "김성주 \"리밸런싱 유예 이견 없었다\"…정치적 동원 의혹 반박",
      publisher: "머니투데이방송",
      url: "https://news.mtn.co.kr/article/2026101411361262109",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-nps-20261018",
      title: "'폭락장 못 버틴' 국민연금, 보유주식 석 달 반 만에 182조 날아갔다",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610181841084071",
      publishedAt: "2026-10-18",
      type: "press",
      license: "link-only",
    },
  ],
};
