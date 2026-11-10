import type { PolicyInput } from "./schema";

/**
 * 2026년 세제개편안(8월 3일 발표): 보유세(종부세) 개편 방향, 세수 효과, '세금 폭탄' 공방, 국회 심의.
 *
 * 대통령 유튜브 영상 답글에 "세금 폭탄을 매겼으니 원래대로 되돌리라"는 비판(이슈 #253)이 달렸고, Voice 방문자가
 * "보유세 개편 방향"(이슈 #276) 자료를 찾았다(잼통 Voice). 2026년 세제개편안이 누구의 세금을 얼마나 바꾸는지와 여야 평가를 적는다.
 *
 * ★ 국토보유세 공약과 종부세 개편의 관계는 policy:land-holding-tax에 있다.
 * ★ 세제개편안은 정부안이다. 국회 의결 전이므로 확정 세법이 아니다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #253, #276.
 *   2026-11-10 factbot-gap #277(자영업자 '내년부터 세금 최대 500만 원 더')을 더했다. 바뀌는 것은 부가세
 *   신고 방식이 아니라 신용카드 매출세액공제의 한시 우대다.
 */
export const TAX_REFORM_2026: PolicyInput = {
  slug: "tax-reform-2026",
  title: "2026년 세제개편안: 보유세 개편 방향과 '세금 폭탄' 공방",
  scope:
    "2026년 8월 3일 정부 세제개편안의 종합부동산세 개편(가액 기준 일원화·실거주 공제 차등·세부담 상한), 5년 세수 효과, 다주택자 양도세 중과 한시 완화, " +
    "개인사업자 신용카드 매출세액공제 우대 축소, 여야 평가와 국회 심의 일정",
  ministries: ["재정경제부"],
  categories: ["economy"],
  asOf: "2026-11-10",
  rumors: [
    {
      id: "rumor-tax-bomb",
      text: "세금 폭탄을 매겼으니 원래대로 되돌리라",
      claimIds: ["claim-revenue", "claim-ccomprehensive", "claim-relief", "claim-politics"],
    },
    {
      id: "rumor-vat-500",
      text: "내년부터 부가세 신고 방식이 바뀌어 자영업자들이 세금을 최대 500만 원 더 내게 된다",
      claimIds: ["claim-card-credit-law", "claim-card-credit-plan", "claim-card-credit-impact", "claim-card-credit-gov", "claim-card-credit-status"],
    },
  ],
  claims: [
    {
      id: "claim-ccomprehensive",
      text:
        "2026년 세제개편안은 주택분 종합부동산세 세율을 주택 수가 아니라 주택 가액 기준으로 단계적으로 일원화하고, 과세표준 6억~12억 원 구간 세율을 1.0%에서 1.3%로 올린다. " +
        "1세대 1주택 기본공제는 실거주하면 12억 원에서 14억 원으로 올리고, 거주하지 않으면 9억 원으로 낮춘다. 종부세 세부담 상한은 150%에서 200%로 높인다.",
      assertionType: "FACT",
      sourceIds: ["src-taxnet-4802", "src-intn-2052313"],
      verified: true,
    },
    {
      id: "claim-relief",
      text:
        "같은 개편안은 시장 충격을 줄이고 매도 기회를 준다며 다주택자의 조정대상지역 양도소득세 중과를 2027~2028년 한시적으로 완화한다. 장기보유특별공제에는 10억 원 한도를 둔다.",
      assertionType: "FACT",
      sourceIds: ["src-taxnet-4802", "src-intn-2052313"],
      verified: true,
    },
    {
      id: "claim-revenue",
      text:
        "정부가 추산한 이 세제개편안 전체의 세수 효과는 2027~2031년 5년간 3조 4,430억 원 증가다. 부담이 늘어나는 쪽은 초고가·비거주 주택 보유자이며, 실거주 1주택자는 공제가 커진다.",
      assertionType: "FACT",
      sourceIds: ["src-taxnet-4802", "src-intn-2052313"],
      verified: true,
    },
    {
      id: "claim-politics",
      text:
        "국민의힘은 종부세 강화를 '징벌적 증세', '세금폭탄 선언'이라고 비판했고 여당은 '조세 정상화'라고 맞섰다. 조국 전 법무부 장관은 예외와 특례가 늘어 기대에 못 미친다고 평가했다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-10830261"],
      verified: true,
    },
    {
      id: "claim-schedule",
      text:
        "국회 재정경제기획위원회 여당 간사 오기형 의원은 조세소위원회와 상임위에서 차례로 논의하겠다고 밝혔고, 심의는 11월 말까지 이어진다. 민주당 이소영 의원은 그 전까지 문제점을 바로잡겠다고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-10830261"],
      verified: true,
    },
    {
      id: "claim-card-credit-law",
      text:
        "주로 소비자를 상대하는 연 매출 10억 원 이하 개인사업자는 신용카드·현금영수증 매출의 일정 비율을 부가가치세 납부세액에서 공제받는다. " +
        "현행법의 기본 공제율은 1.0%, 연간 한도는 500만 원이고, 2026년 말까지는 한시적으로 공제율 1.3%, 한도 1,000만 원이 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20260815509263"],
      verified: true,
    },
    {
      id: "claim-card-credit-plan",
      text:
        "2026년 세제개편안은 이 한시 우대를 2029년 말까지 3년 연장하되, 우대 공제율을 1.3%에서 1.2%로 낮추고 우대 한도를 기본 한도와 같은 500만 원으로 줄인다. " +
        "2027년 1월 1일 이후 공급분부터 적용하는 안이다. 부가가치세 신고·납부 방식을 바꾸는 내용은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20260815509263", "src-edaily-20260811"],
      verified: true,
    },
    {
      id: "claim-card-credit-impact",
      text:
        "공제액이 줄어드는 폭은 한 사업자당 최대 500만 원이다. 1.2% 공제율로 500만 원 한도에 닿는 카드 매출은 약 4억 1,667만 원이어서, 연 매출 약 4억 2천만~10억 원 사업자가 영향을 받는다. " +
        "서울경제는 약 30만 명, 1인당 평균 약 250만 원, 모두 최대 7,500억 원의 세부담이 늘어난다고 추산했다. '최대 500만 원'은 매출이 큰 쪽의 상한이지 모든 자영업자의 증가액이 아니다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-sedaily-20260811", "src-edaily-20260811"],
      verified: true,
    },
    {
      id: "claim-card-credit-gov",
      text:
        "정부는 글로벌 금융위기와 코로나19 때 한시로 높인 특례를 단계적으로 정상화하는 것이며 증세가 아니라고 설명했다. 기본 공제율 1%보다 높은 1.2%를 유지하고 기한을 늘린다는 점, " +
        "연 카드 매출 약 4억 원 이하 사업자(공제 대상의 약 95%)는 공제액이 달라지지 않는다는 점을 들었다. 한도 축소의 직접 영향은 공제 대상의 약 6%라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "재정경제부",
      sourceIds: ["src-edaily-20260811", "src-segye-20260815509263", "src-sedaily-20260811"],
      verified: true,
    },
    {
      id: "claim-card-credit-critique",
      text:
        "한국외식업중앙회 관계자는 공제 혜택 축소를 '사실상 증세'라고 했다. 정부안이 국회에서 통과되지 않고 한시 우대가 그대로 끝나면 2027년부터는 기본 규정(1.0%, 500만 원)이 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-sedaily-20260811", "src-segye-20260815509263"],
      verified: true,
    },
    {
      id: "claim-card-credit-status",
      text: "이 공제 축소는 정부가 국회에 낸 개정안으로, 국회 심의에서 공제율·한도·시행 시점이 바뀔 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20260815509263"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-politics", "claim-card-credit-critique"],
  timeline: [
    {
      id: "t-announce",
      date: "2026-08-03",
      datePrecision: "day",
      title: "2026년 세제개편안 발표",
      summary: "종부세 가액 기준 일원화.",
      claimIds: ["claim-ccomprehensive", "claim-relief", "claim-revenue", "claim-card-credit-plan"],
    },
    {
      id: "t-assembly",
      date: "2026-11",
      datePrecision: "month",
      title: "국회 조세소위 심의",
      summary: "11월 말까지.",
      claimIds: ["claim-schedule"],
    },
  ],
  gaps: [
    "종부세 개편만 따로 떼어 낸 세수 효과(전체 3조 4,430억 원 중 몫)는 확인하지 못했다.",
    "국회 조세소위의 수정 내용과 최종 의결 결과는 11월 10일 현재 나오지 않았다. 신용카드 매출세액공제 축소가 그대로 의결될지도 아직 모른다.",
    "신용카드 매출세액공제 개정 조문(부가가치세법 제46조)과 재정경제부 세제개편안 원문을 직접 대조하지 못했다. 현행 기본·우대 기준과 정부안은 보도로 확인했다.",
    "약 30만 명·최대 7,500억 원은 서울경제의 추산이다. 정부 공식 세수 효과 추계는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-taxnet-4802",
      title: "2026년 세제개편 (08.03 발표) 핵심이슈 한눈에 살펴보기",
      publisher: "택스넷",
      url: "https://www.taxnet.co.kr/contents/insightpreview/post-detail?id=4802&gubunCode=TP0020",
      publishedAt: "2026-08",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-intn-2052313",
      title: "2026 세법개정안 발표…초고가·비거주주택 종부세 인상, 장특공제 10억원 한도",
      publisher: "일간NTN",
      url: "https://www.intn.co.kr/news/articleView.html?idxno=2052313",
      publishedAt: "2026-08-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-10830261",
      title: "\"조세 정상화\" vs \"세금폭탄 선언\"…與野, 세제개편안 시각차 극명",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10830261",
      publishedAt: "2026-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20260815509263",
      title: "카드매출 세액공제 1000만→500만원 추진…“한도 축소 영향은 6%”",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20260815509263",
      publishedAt: "2026-08-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-edaily-20260811",
      title: "\"15만원 뿌리고 500만원 더 뜯어가\"...자영업 증세?",
      publisher: "이데일리",
      url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=06507526645546336",
      publishedAt: "2026-08-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sedaily-20260811",
      title: "[단독] 매출액 공제축소에…30만 자영업자 세부담 최대 7500억 증가",
      publisher: "서울경제",
      url: "https://www.sedaily.com/article/20078256",
      publishedAt: "2026-08-11",
      type: "press",
      license: "link-only",
    },
  ],
};
