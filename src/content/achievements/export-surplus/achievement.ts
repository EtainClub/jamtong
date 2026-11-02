import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 경상수지 세계 2위와 수출 1조 달러 (2026).
 *
 * 2026년 2분기 경상수지 흑자(IMF 통계, 한국은행 경제통계시스템 수록)와
 * 1~10월 누적 수출(산업통상부 10월 수출입 동향)을 한 업적으로 묶는다.
 * 둘 다 같은 흐름 — 반도체 수출 급증 — 에서 나온 숫자다.
 *
 * ★ 연 수출 1조 달러는 아직 달성 전이다. 2026-11-01 산업통상부가 "11월 중
 *   달성이 확실시된다"고 밝힌 단계다. 제목과 그림 모두 "눈앞"으로 적는다.
 * ★ 주된 배경은 반도체 가격 급등과 AI 투자다. 정부 정책의 기여를 따로 잰
 *   자료는 확인하지 못했다. 정부가 직접 한 일로 확인된 것은 대미 관세 협상뿐이고,
 *   그 효과도 계량되지 않았다. 반론에 그대로 적는다.
 * ★ 반도체 쏠림(10월 수출의 약 49%)과 대미 흑자에 따른 통상 압박을 함께 싣는다.
 * ★ 2026-11-02 처음 작성. claim마다 인용한 보도자료·기사 본문과 대조했다.
 *   수출 수치는 산업통상부 보도자료와 맞췄다. 경상수지 국가 비교는 IMF 통계를
 *   인용한 두 보도(조선비즈·재경일보)가 일치하는 것을 확인했고, 한국은행
 *   경제통계시스템의 원통계와는 아직 대조하지 않았다.
 */
const raw: AchievementInput = {
  id: "export-surplus",
  slug: "export-surplus",
  title: "경상수지 세계 2위·수출 1조 달러",
  subtitle: "2분기 경상흑자는 중국 다음, 연 수출은 1조 달러 눈앞",
  kicker: "재정·경제 · 수출",
  categories: ["economy"],
  summary:
    "2026년 2분기 한국의 경상수지 흑자는 1,166억 달러로 1년 전의 4.1배였고, 통계가 확인되는 36개국 가운데 중국 다음 2위였다. " +
    "1~10월 누적 수출은 9,300억 달러로 처음 9,000억 달러를 넘었고, 산업통상부는 11월 중 연 수출 1조 달러 달성이 확실시된다고 밝혔다. " +
    "반도체가 10월 수출의 약 49%를 차지해, 쏠림과 대미 통상 압박이 함께 과제로 꼽힌다.",
  type: "event",
  publishStatus: "published",
  featured: true,
  lifeQuestion: "한국 경상수지가 세계 2위라는데, 수출 1조 달러는 사실인가요?",
  sourceNote:
    "2026년 11월 2일 기준입니다. 수출 수치는 산업통상부 「2026년 10월 수출입 동향」과 대조했습니다. " +
    "경상수지 국가 비교는 IMF 통계를 인용한 보도 두 건이 일치하는 것을 확인했고, 원통계와는 아직 대조하지 않았습니다. " +
    "연 수출 1조 달러는 기준일 현재 달성 전입니다. 정부 정책이 흑자에 얼마나 기여했는지 잰 자료는 찾지 못했습니다.",
  headlineKeyNumberId: "es-q2-surplus",
  keyNumbers: [
    { id: "es-q2-surplus", label: "2분기 경상수지 흑자", value: "1,166", unit: "억 달러", caption: "1년 전 284억 달러의 4.1배 · IMF 통계 인용 보도", claimId: "es-q2" },
    { id: "es-q2-rank", label: "2분기 경상흑자 순위", value: "2", unit: "위", caption: "36개국 중 · 1위 중국 1,937억 달러", claimId: "es-q2-rank" },
    { id: "es-cum", label: "1~10월 누적 수출", value: "9,300", unit: "억 달러", caption: "전년 대비 60.6% · 산업통상부", claimId: "es-cum" },
    { id: "es-chip", label: "10월 반도체 수출", value: "564.4", unit: "억 달러", caption: "전년 대비 259.4% · 10월 수출의 약 49%", claimId: "es-chip-oct" },
  ],
  timeline: [
    { id: "es-t-tariff", date: "2025-04", datePrecision: "month", title: "미국, 한국에 상호관세 25% 예고", summary: "이후 정부가 3,500억 달러 대미투자를 약속하고 관세를 15%로 낮췄다.", claimIds: ["es-tariff"] },
    { id: "es-t-q2", date: "2026-06", datePrecision: "month", displayDate: "2026 2분기", title: "2분기 경상흑자 1,166억 달러", summary: "36개국 중 중국 다음 2위, 독일·일본 합계보다 많았다.", claimIds: ["es-q2", "es-q2-rank", "es-q2-dejp"] },
    { id: "es-t-julaug", date: "2026-08", datePrecision: "month", displayDate: "2026.7~8", title: "7~8월 경상흑자 881.9억 달러", summary: "독일·일본 합계(808.2억 달러)를 다시 넘었다.", claimIds: ["es-julaug"] },
    { id: "es-t-imf", date: "2026-10", datePrecision: "month", title: "IMF, 올해 한국 경상흑자 세계 2위 전망", summary: "4,219억 달러, 190개 국가·지역 중 중국 다음.", claimIds: ["es-imf"] },
    { id: "es-t-cmp", date: "2026-10-25", datePrecision: "day", title: "국가별 2분기 경상수지 비교 보도", summary: "IMF 통계로 독일·일본 합계 추월이 1996년 이후 처음으로 확인됐다.", claimIds: ["es-q2-dejp"] },
    { id: "es-t-oct", date: "2026-11-01", datePrecision: "day", title: "1~10월 누적 수출 9,300억 달러", summary: "처음으로 9,000억 달러를 넘었다. 11월 중 연 1조 달러가 확실시된다.", claimIds: ["es-cum", "es-trillion"] },
  ],
  eli5: {
    intro: "나라 밖과 물건·서비스를 사고팔아 남긴 돈과, 수출이 어디까지 왔는지 봐요.",
    scenes: [
      {
        id: "es-e-jump", title: "1년 만에 네 배가 넘었어요",
        say: "올해 4~6월에 한국이 나라 밖과 거래해 남긴 돈(경상수지 흑자)은 1,166억 달러예요. 1년 전 같은 때는 284억 달러였어요.",
        art: "es-jump", fact: { value: "4.1배", tone: "ice" }, claimIds: ["es-q2"],
      },
      {
        id: "es-e-rank", title: "중국 다음, 두 번째예요",
        say: "숫자가 확인되는 36개 나라를 줄 세우면 1등은 중국, 2등이 한국이에요.",
        art: "es-rank", fact: { value: "36개국 중 2위", tone: "ice" }, claimIds: ["es-q2-rank"],
      },
      {
        id: "es-e-dejp", title: "독일과 일본을 합친 것보다 커요",
        say: "독일 523억 달러, 일본 506억 달러를 더해도 한국보다 137억 달러 적어요. 비교할 수 있는 1996년 이후 처음이에요.",
        art: "es-dejp", claimIds: ["es-q2-dejp"],
      },
      {
        id: "es-e-trillion", title: "수출 1조 달러, 문턱 앞이에요",
        say: "1월부터 10월까지 수출이 9,300억 달러예요. 700억 달러만 더하면 1조 달러라, 정부는 11월 안에 넘을 것으로 봐요.",
        art: "es-trillion", fact: { value: "9,300억 달러", tone: "warm" }, claimIds: ["es-cum", "es-trillion"],
      },
      {
        id: "es-e-chip", title: "반도체가 절반을 끌었어요",
        say: "10월 수출 1,153억 달러 가운데 반도체가 564억 달러였어요. 1년 전보다 3.6배로 늘었어요.",
        art: "es-chip", claimIds: ["es-chip-oct"],
      },
    ],
    caveat: {
      text: "연 수출 1조 달러는 아직 ‘확실시’ 단계예요. 흑자가 늘어난 큰 이유는 반도체 값이 오른 것이라, 반도체가 꺾이면 흑자도 흔들릴 수 있어요.",
      claimIds: ["es-trillion", "es-driver"],
    },
  },
  scenes: [{
    id: "es-explainer", kind: "explainer", heading: "숫자로 보는 흑자와 수출", lede: "순위, 남은 거리, 무엇이 끌어올렸는지를 차례로 봅니다.",
    claimIds: ["es-q2-rank", "es-q2-dejp", "es-cum", "es-trillion", "es-chip-oct"],
    explainer: {
      chapters: [
        {
          id: "es-ch-rank", question: "2분기 경상흑자는 세계 몇 위인가요?", heading: "중국 다음, 독일·일본 합계보다 위",
          steps: [
            { id: "es-step-others", label: "다른 나라", caption: "2026년 2분기 경상흑자는 중국 1,937억, 독일 523억, 일본 506억 달러였다." },
            { id: "es-step-korea", label: "한국", caption: "한국은 1,166억 달러로, 통계가 확인되는 36개국 중 중국 다음 2위였다." },
            { id: "es-step-sum", label: "독일+일본", caption: "독일과 일본을 합친 1,029억 달러보다 137억 달러 많다. 1996년 1분기 이후 처음이다." },
          ],
          visual: {
            kind: "rank-bars", unit: "억 달러", periodLabel: "2026년 2분기 경상수지 흑자",
            bars: [
              { id: "es-bar-cn", label: "중국", value: 1937.2 },
              { id: "es-bar-kr", label: "한국", value: 1166.3, focus: true },
              { id: "es-bar-de", label: "독일", value: 522.8 },
              { id: "es-bar-jp", label: "일본", value: 506.2 },
            ],
            sum: { label: "독일+일본", memberIds: ["es-bar-de", "es-bar-jp"] },
            note: "IMF 통계를 인용한 보도 기준입니다. 순위는 수치가 확인되는 36개국 안에서 매겼습니다.",
          },
          takeaway: "2분기 한국의 경상흑자는 중국 다음으로 컸고, 독일·일본 합계보다 많았다.", claimId: "es-q2-dejp",
        },
        {
          id: "es-ch-trillion", question: "수출 1조 달러는 달성했나요?", heading: "9,300억 달러까지 왔다",
          steps: [
            { id: "es-step-1995", label: "1995년", caption: "한국 수출은 1995년 연 1,000억 달러를 처음 넘었다." },
            { id: "es-step-9000", label: "10월까지", caption: "2026년 1~10월 누적 수출은 9,300억 달러로, 처음 9,000억 달러를 넘었다." },
            { id: "es-step-1t", label: "1조 달러", caption: "산업통상부는 11월 중 연 1조 달러 달성이 확실시된다고 밝혔다. 기준일 현재 달성 전이다." },
          ],
          visual: {
            kind: "stage-gates", asOfLabel: "2026.11.1 발표 기준", pendingLabel: "아직 달성 전",
            stages: [
              { id: "es-gate-1995", label: "1,000억 달러", note: "1995", status: "done" },
              { id: "es-gate-9000", label: "9,000억 달러", note: "26.1~10월", status: "done" },
              { id: "es-gate-1t", label: "1조 달러", note: "11월 예상", status: "pending" },
            ],
          },
          takeaway: "1조 달러까지 700억 달러가 남았다. 달성은 아직 예상이다.", claimId: "es-trillion",
        },
        {
          id: "es-ch-chip", question: "무엇이 수출을 끌어올렸나요?", heading: "10월 수출의 절반이 반도체",
          steps: [
            { id: "es-step-total", label: "10월 수출", caption: "10월 수출은 1,152.8억 달러로 1년 전보다 93.7% 늘었다." },
            { id: "es-step-chip", label: "반도체", caption: "그 가운데 반도체가 564.4억 달러로 259.4% 늘었다." },
            { id: "es-step-rest", label: "그 밖의 품목", caption: "반도체를 뺀 나머지 품목을 다 합쳐도 절반을 조금 넘는다. 한 품목이 절반 가까이를 맡은 셈이다." },
          ],
          visual: {
            kind: "seats", unit: "억 달러", per: 20,
            capacity: { label: "10월 전체 수출", value: 1153 },
            filled: { label: "반도체", value: 564 },
            gapLabel: "반도체 밖 품목",
          },
          takeaway: "반도체가 10월 수출의 약 49%를 차지했다. 강점이면서 쏠림이다.", claimId: "es-chip-oct",
        },
      ],
    },
  }],
  graph: {
    note: "개인 대신 흐름에 관여한 주체를 표시했습니다.",
    entities: [
      { id: "es-kr", name: "한국 수출 기업", kind: "group", description: "반도체·컴퓨터 등 수출", isFocus: true },
      { id: "es-gov", name: "정부", kind: "government", description: "산업통상부 · 대미 통상 협상" },
      { id: "es-us", name: "미국", kind: "government", description: "트럼프 행정부 · 상호관세" },
      { id: "es-bigtech", name: "글로벌 빅테크", kind: "group", description: "AI 설비투자" },
    ],
    relations: [
      { id: "es-r-ai", fromId: "es-bigtech", toId: "es-kr", label: "AI 설비투자로 반도체 수요·가격 유지", startDate: "2026", startPrecision: "year", assertionType: "CLAIM", assertedBy: "산업통상부", claimIds: ["es-chip-oct"] },
      { id: "es-r-export", fromId: "es-kr", toId: "es-us", label: "10월 대미 수출 249억 달러(+185.8%)", startDate: "2026-10", startPrecision: "month", assertionType: "FACT", claimIds: ["es-us"] },
      { id: "es-r-tariff", fromId: "es-us", toId: "es-gov", label: "상호관세 25% 예고 → 15%로 인하", startDate: "2025-04", startPrecision: "month", assertionType: "FACT", claimIds: ["es-tariff"] },
      { id: "es-r-invest", fromId: "es-gov", toId: "es-us", label: "대미투자 3,500억 달러 약속", startDate: "2025", startPrecision: "year", assertionType: "FACT", claimIds: ["es-tariff"] },
    ],
  },
  counterpoints: [
    {
      id: "es-cp-gov",
      question: "정부가 한 일인가요?",
      response: "흑자와 수출이 늘어난 주된 배경으로 보도와 산업통상부는 반도체 가격 상승과 빅테크의 AI 설비투자를 든다. 정부가 직접 한 일로 확인된 것은 대미 관세를 25% 예고에서 15%로 낮춘 협상이고, 그 협상이 수출을 얼마나 지켰는지 잰 자료는 확인하지 못했다.",
      claimIds: ["es-driver", "es-chip-oct", "es-tariff"],
    },
    {
      id: "es-cp-done",
      question: "수출 1조 달러를 이미 넘었나요?",
      response: "아직 아니다. 11월 1일 발표 기준 1~10월 누적은 9,300억 달러이고, 산업통상부는 11월 중 달성이 확실시된다고 밝혔다. 넘으면 미국·중국·독일에 이어 네 번째라고 보도됐다.",
      claimIds: ["es-cum", "es-trillion", "es-fourth"],
    },
    {
      id: "es-cp-chip",
      question: "반도체 하나에 기대는 것 아닌가요?",
      response: "그렇다는 지적이 있다. 반도체는 8월 47.5%, 9월 49.9%, 10월 약 49%로 수출의 절반 가까이를 차지했고, 중국 CXMT 등의 추격도 위협 요인으로 꼽힌다. AI 투자가 둔화하면 흑자도 흔들릴 수 있다는 보도가 있다. 다만 10월에는 20대 품목 중 18개가 함께 늘었다.",
      claimIds: ["es-chip-trend", "es-driver", "es-broad"],
    },
    {
      id: "es-cp-us",
      question: "흑자가 크면 미국과 마찰이 생기지 않나요?",
      response: "그 위험이 있다. 1~10월 대미 무역흑자는 1,023억 달러로 처음 연간 1,000억 달러를 넘었다. 미국은 2025년 한국의 흑자에 불만을 표하며 상호관세 25%를 예고한 적이 있고, 이후에도 알래스카 LNG 사업을 압박하며 관세 인상을 시사하고 있다.",
      claimIds: ["es-us-surplus", "es-tariff"],
    },
  ],
  claims: [
    {
      id: "es-q2",
      text: "2026년 2분기 한국의 경상수지 흑자는 1,166억 3,000만 달러로, 전년 동기(283억 9,000만 달러)의 4.1배였다. IMF 통계(한국은행 경제통계시스템 수록)를 인용한 보도 수치다.",
      assertionType: "FACT",
      sourceIds: ["src-es-chosun-1025", "src-es-jkn-1025"],
      verified: true,
    },
    {
      id: "es-q2-rank",
      text: "같은 분기 수치가 확인되는 주요 36개국 가운데 한국은 중국(1,937억 2,000만 달러)에 이어 경상흑자 2위였다.",
      assertionType: "FACT",
      sourceIds: ["src-es-chosun-1025", "src-es-jkn-1025"],
      verified: true,
    },
    {
      id: "es-q2-dejp",
      text: "2026년 2분기 독일(522억 8,000만 달러)과 일본(506억 2,000만 달러)의 경상흑자 합계는 1,028억 9,000만 달러로 한국보다 137억 4,000만 달러 적었다. 세 나라를 비교할 수 있는 1996년 1분기 이후 한국이 두 나라 합계를 넘은 것은 처음이다.",
      assertionType: "FACT",
      sourceIds: ["src-es-jkn-1025", "src-es-chosun-1025"],
      verified: true,
    },
    {
      id: "es-julaug",
      text: "2026년 7~8월 한국의 경상흑자는 881억 9,000만 달러로, 독일(368억 5,000만 달러)과 일본(439억 7,000만 달러)의 합계 808억 2,000만 달러보다 많았다.",
      assertionType: "FACT",
      sourceIds: ["src-es-chosun-1025"],
      verified: true,
    },
    {
      id: "es-imf",
      text: "IMF는 2026년 10월 세계경제전망에서 올해 한국의 경상흑자를 4,219억 4,600만 달러로 예상했다. 190개 국가·지역 가운데 중국(8,632억 500만 달러) 다음이고, 작년 5위에서 2위로 오르는 것이다. GDP 대비 흑자 비율은 18.8%로 전망됐다. 전망치이며 확정 통계가 아니다.",
      assertionType: "CLAIM",
      assertedBy: "국제통화기금(IMF)",
      sourceIds: ["src-es-chosun-1025", "src-es-jkn-1025"],
      verified: true,
    },
    {
      id: "es-driver",
      text: "조선비즈는 흑자 확대의 배경으로 반도체 가격 급등을 들고, 반도체 의존도가 높아 AI 투자 둔화나 경쟁 심화 시 흑자가 다시 흔들릴 수 있다고 지적했다.",
      assertionType: "INTERPRETATION",
      assertedBy: "조선비즈",
      sourceIds: ["src-es-chosun-1025"],
      verified: true,
    },
    {
      id: "es-oct",
      text: "2026년 10월 수출은 1,152.8억 달러로 전년 동월보다 93.7% 늘어 9월에 이어 월간 역대 2위였다. 수입은 727.8억 달러, 무역수지는 425.0억 달러 흑자였다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1101"],
      verified: true,
    },
    {
      id: "es-chip-oct",
      text: "2026년 10월 반도체 수출은 564.4억 달러로 전년 동월보다 259.4% 늘어 10월 전체 수출(1,152.8억 달러)의 약 49%를 차지했다. 산업통상부는 글로벌 빅테크의 AI 설비투자가 이어져 반도체의 높은 가격과 수출물량이 유지됐다고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1101"],
      verified: true,
    },
    {
      id: "es-broad",
      text: "2026년 10월 20대 주요 수출 품목 가운데 18개 품목의 수출이 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1101"],
      verified: true,
    },
    {
      id: "es-cum",
      text: "2026년 1~10월 누적 수출은 9,300억 달러로 전년 같은 기간보다 60.6% 늘어 사상 처음 9,000억 달러를 넘었다. 한국 수출은 1995년 연 1,000억 달러를 처음 넘었다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1101", "src-es-khan-1101"],
      verified: true,
    },
    {
      id: "es-trillion",
      text: "산업통상부는 2026년 11월 1일 11월 중 연 수출 1조 달러 달성이 확실시된다고 밝혔다. 남은 금액은 약 700억 달러다. 기준일(11월 2일) 현재 달성 전이다.",
      assertionType: "CLAIM",
      assertedBy: "산업통상부",
      sourceIds: ["src-es-motir-1101", "src-es-khan-1101"],
      verified: true,
    },
    {
      id: "es-fourth",
      text: "연 수출 1조 달러를 넘으면 미국·중국·독일에 이어 세계 네 번째라고 경향신문이 보도했다.",
      assertionType: "FACT",
      sourceIds: ["src-es-khan-1101"],
      verified: true,
    },
    {
      id: "es-chip-trend",
      text: "전체 수출에서 반도체가 차지한 비중은 2026년 8월 47.5%, 9월 49.9%, 10월 49.0%였다. 경향신문은 중국 CXMT 등의 기술 추격을 위협 요인으로 꼽았다.",
      assertionType: "FACT",
      sourceIds: ["src-es-khan-1101"],
      verified: true,
    },
    {
      id: "es-us",
      text: "2026년 10월 대미국 수출은 249.0억 달러로 전년 동월보다 185.8% 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1101"],
      verified: true,
    },
    {
      id: "es-us-surplus",
      text: "2026년 1~10월 누적 대미 무역흑자는 1,023억 달러로, 대미 흑자가 연간 기준 1,000억 달러를 넘은 것은 처음이다. 기존 최고는 2024년 556억 달러였다.",
      assertionType: "FACT",
      sourceIds: ["src-es-khan-1101"],
      verified: true,
    },
    {
      id: "es-tariff",
      text: "트럼프 행정부는 2025년 4월 한국의 대미 흑자에 불만을 표하며 상호관세 25%를 예고했고, 정부는 3,500억 달러 대미투자를 약속해 관세를 15%로 낮췄다. 미국은 이후에도 알래스카 LNG 개발사업을 압박하며 관세 인상을 시사하고 있다.",
      assertionType: "FACT",
      sourceIds: ["src-es-khan-1101"],
      verified: true,
    },
  ],
  sources: [
    { id: "src-es-chosun-1025", title: "2분기 韓 경상수지 흑자 1166억달러… 중국 이어 세계 2위", publisher: "조선비즈", url: "https://v.daum.net/v/20261025135440549", publishedAt: "2026-10-25", type: "press", license: "link-only" },
    { id: "src-es-jkn-1025", title: "2분기 경상흑자 1166억달러…독일·일본 합계 추월", publisher: "재경일보", url: "https://news.jkn.co.kr/post/1048892", publishedAt: "2026-10-25", type: "press", license: "link-only" },
    { id: "src-es-motir-1101", title: "2026년 10월 수출입 동향 (보도자료)", publisher: "산업통상부", url: "https://www.motir.go.kr/kor/article/ATCL3f49a5a8c/172360/view", publishedAt: "2026-11-01", type: "official", license: "public" },
    { id: "src-es-khan-1101", title: "세계 4번째…연 수출액 ‘1조달러’ 확실시", publisher: "경향신문", url: "https://v.daum.net/v/20261101204143348", publishedAt: "2026-11-01", type: "press", license: "link-only" },
  ],
};

export const exportSurplus = achievementSchema.parse(raw);
