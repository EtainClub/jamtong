import type { PolicyInput } from "./schema";

/**
 * 집값이 크게 떨어질 때의 정부 대비책.
 *
 * 2026년 11월 3일 이 대통령이 X에 서울 집값 폭락론을 다룬 기사를 공유하며 "집값이 크게 하락할
 * 경우 공적임대주택 용도로 정부가 대량 매입하는 것을 포함해 대비책은 이미 강구 중"이라고 썼다.
 * 그 답글에 "집값을 떨어뜨리겠다는 정책은 집을 가진 국민의 자산 피해를 외면한다"는 말이
 * 달렸다(잼통 Voice). 대통령이 무엇을 말했고, 무엇이 아직 정해지지 않았는지 나눈다.
 *
 * ★ 대통령의 판단(금융시장 불안 제한적 등)은 CLAIM이다.
 * ★ 매입 대상·가격·시기·재원은 공개되지 않았다(gaps). 대책이 있다고 단정하지 않는다.
 * ★ 지방 미분양 매입은 policy:local-unsold-housing에 있다.
 * ★ 2026-11-04 처음 등록 — 잼통 Voice 이슈 #205.
 */
export const HOME_PRICE_DROP_PLAN: PolicyInput = {
  slug: "home-price-drop-plan",
  title: "집값 급락 대비책과 주택 보유자",
  scope:
    "2026년 11월 3일 대통령 X 글과 국무회의 발언(집값 하락 시 공적임대용 대량 매입 구상), 8월 매입 시스템 준비 지시, 과거 정부 매입 사례, 아직 공개되지 않은 세부",
  ministries: ["국토교통부", "금융위원회"],
  categories: ["economy", "welfare"],
  asOf: "2026-11-04",
  rumors: [
    {
      id: "rumor-owners",
      text: "집값을 떨어뜨리겠다는 정책은 집을 가진 국민의 자산 피해를 외면한다",
      claimIds: ["claim-buyback", "claim-finance-limited", "claim-undecided", "claim-goal-stability"],
    },
  ],
  claims: [
    {
      id: "claim-buyback",
      text:
        "이 대통령은 2026년 11월 3일 X에 서울 집값 폭락 가능성을 다룬 기사를 공유하며 \"집값이 크게 하락할 경우 공적임대주택 용도로 정부가 대량 매입하는 것을 포함해 대비책은 이미 강구 중\"이라고 썼다. " +
        "같은 글에서 \"부동산 불패 신화는 이제 깨질 때가 됐고 또 반드시 깨야 한다\"고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-pressian-20261103", "src-ajunews-20261104"],
      verified: true,
    },
    {
      id: "claim-august-order",
      text: "대통령은 2026년 8월에도 주택 가격 급락에 대비해 일정 기준 이하 주택을 대량 매입하는 시스템을 준비하라고 지시했다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-ajunews-20261104"],
      verified: true,
    },
    {
      id: "claim-finance-limited",
      text:
        "대통령은 \"이 정부 들어 가계대출 증가를 억제하고 주택담보대출을 관리했기 때문에 집값 변동에 따른 금융시장 불안도 제한적\"이라고 했다. " +
        "서울 집값 상승은 \"상당 정도 2022년부터 시작된 지방정부의 주택 인허가 급감\" 때문이고, 인허가가 정상화돼 \"2028년 전후부터는 공급절벽도 완화될 것\"이라고 봤다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-insight-20261103"],
      verified: true,
    },
    {
      id: "claim-cabinet",
      text:
        "같은 날 국무회의에서 대통령은 서울 아파트 매물이 급속히 늘고 거래량이 급속히 줄고 있으며 주요 지역 실거래가가 \"놀라울 정도로\" 떨어지고 있다고 말했다. " +
        "수도권에서 공포매수 압박을 느끼는 사람들에게는 거래량, 매물, 핵심지역 실거래가, 담보대출 연체율, 경매 건수 추이를 살펴보라고 당부했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-pressian-20261103", "src-insight-20261103"],
      verified: true,
    },
    {
      id: "claim-undecided",
      text:
        "2026년 11월 4일 기준 매입 대상, 가격 기준, 시행 시점, 재원 조달 방식은 공개되지 않았고, 기존 LH 매입임대 사업을 넓히는 방식인지도 정해지지 않았다. " +
        "LH의 2026년 매입임대 추진 물량은 전국 3만 8,224가구이고 그 가운데 기존 주택은 3,497가구다.",
      assertionType: "FACT",
      sourceIds: ["src-ajunews-20261104"],
      verified: true,
    },
    {
      id: "claim-past-cases",
      text:
        "정부가 주택을 사들인 전례로는 2008~2010년 LH가 지방 준공 후 미분양 아파트 7,058가구를 분양가의 약 70% 수준에 산 것, " +
        "2013~2014년 대출 상환이 어려운 '하우스푸어' 주택 1,070가구를 희망임대주택 리츠로 사들여 집주인이 임차인으로 계속 살게 한 것이 있다.",
      assertionType: "FACT",
      sourceIds: ["src-ajunews-20261104"],
      verified: true,
    },
    {
      id: "claim-goal-stability",
      text:
        "이 대통령은 후보 시절인 2025년 5월 28일 세금으로 집값을 잡는 일은 하지 않겠다며 목표는 집값 안정이라고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-hpd-hankook-20250528"],
      verified: true,
    },
    {
      id: "claim-critique-cost",
      text:
        "아주경제는 정부가 시세보다 비싸게 사면 공공재정 부담이 커지고, 너무 낮게 부르면 집주인이 팔지 않으며, 임대 수요가 적은 곳을 대량 매입하면 공실이 생길 수 있다고 분석했다. " +
        "집값이 떨어져도 정부가 모든 주택을 사거나 손실을 보전해 주는 구상은 아니라고 해석했다.",
      assertionType: "INTERPRETATION",
      assertedBy: "아주경제",
      sourceIds: ["src-ajunews-20261104"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique-cost"],
  timeline: [
    {
      id: "t-pledge",
      date: "2025-05-28",
      datePrecision: "day",
      title: "\"세금으로 집값 잡지 않겠다\"",
      summary: "후보 시절 라디오 인터뷰. 목표는 집값 안정.",
      claimIds: ["claim-goal-stability"],
    },
    {
      id: "t-august",
      date: "2026-08",
      datePrecision: "month",
      title: "대량 매입 시스템 준비 지시",
      summary: "대통령이 11월 글에서 밝힌 지시 시점.",
      claimIds: ["claim-august-order"],
    },
    {
      id: "t-post",
      date: "2026-11-03",
      datePrecision: "day",
      title: "집값 급락 대비책 X 글·국무회의 발언",
      summary: "공적임대용 대량 매입 포함 대비책 강구 중.",
      claimIds: ["claim-buyback", "claim-finance-limited", "claim-cabinet"],
    },
  ],
  gaps: [
    "매입 대상(가격대·지역·주택 유형), 매입가 기준, 시행 시점, 재원은 정부가 공개하지 않았다.",
    "대통령이 말한 '대비책'이 국토교통부의 공식 계획 문서로 나왔는지는 확인하지 못했다.",
    "11월 3일 X 글 전문은 원문으로 대조하지 못했고, 보도에 실린 문장만 옮겼다.",
    "서울 아파트 실거래가·매물 추이에 대한 대통령의 진단을 한국부동산원 통계와 대조하지 못했다. 10월 초까지의 통계는 업적 housing-stabilization에 있다.",
  ],
  sources: [
    {
      id: "src-pressian-20261103",
      title: "李대통령 \"집값 크게 하락시, 대량매입 등 정부 대책 강구\"",
      publisher: "프레시안",
      url: "https://www.pressian.com/pages/articles/2026110314323444465",
      publishedAt: "2026-11-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-insight-20261103",
      title: "李대통령 \"집값 폭락 땐 정부가 대량 매입…부동산 불패신화 깨야\"",
      publisher: "인사이트",
      url: "https://www.insight.co.kr/news/580477",
      publishedAt: "2026-11-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-20261104",
      title: "\"집값 폭락하면 정부가 사준다?\"…李대통령이 꺼낸 카드의 실체",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20261104112019691",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hpd-hankook-20250528",
      title: "이재명 \"세금으로 집값 잡지 않겠다...목표는 집값 안정\"",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2025052822320005424",
      publishedAt: "2025-05-28",
      type: "press",
      license: "link-only",
    },
  ],
};
