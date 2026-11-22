import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 수출 1조 달러와 경상수지 세계 2위 (2026).
 *
 * 연간 누적 수출 1조 달러 돌파(산업통상부 2026-11-19 참고자료, 잠정 집계),
 * 2026년 2분기 경상수지 흑자(IMF 통계, 한국은행 경제통계시스템 수록),
 * 9월 경상수지(한국은행 9월 국제수지 잠정)를 한 업적으로 묶는다.
 * 모두 같은 흐름 — 반도체 수출 급증 — 에서 나온 숫자다.
 *
 * ★ 1조 달러는 2026-11-19 14:09:38 기준 산업통상부의 **잠정 집계**다. 연간 확정치가 아니다.
 * ★ "세계 네 번째 1조 달러 국가"와 "세계 4위 수출국"은 다른 말이다. 수출액 순위는
 *   보도마다 5위·6위로 다르게 적고, 연말 4위는 전망이다. 섞지 않는다.
 * ★ 주된 배경은 반도체 가격 급등과 AI 투자다. 정부 정책의 기여를 따로 잰
 *   자료는 확인하지 못했다. 정부가 직접 한 일로 확인된 것은 대미 관세 협상뿐이고,
 *   그 효과도 계량되지 않았다. 반론에 그대로 적는다.
 * ★ 반도체 쏠림(1~10월 수출의 42.7%), 낙수효과 한계, 대미 흑자에 따른 통상 압박을 함께 싣는다.
 * ★ 2026-11-02 처음 작성, 2026-11-22 1조 달러 돌파와 9월 경상수지를 반영했다.
 *   claim마다 인용한 보도자료·기사 본문과 대조했다. 경상수지 국가 비교는 IMF 통계를
 *   인용한 두 보도가 일치하는 것을, 9월 경상수지는 한국은행 잠정 통계를 인용한 두 보도가
 *   일치하는 것을 확인했고, 한국은행 원자료와는 아직 대조하지 않았다.
 */
const raw: AchievementInput = {
  id: "export-surplus",
  slug: "export-surplus",
  title: "수출 1조 달러·경상수지 세계 2위",
  subtitle: "세계 네 번째로 연 수출 1조 달러, 2분기 경상흑자는 중국 다음",
  kicker: "재정·경제 · 수출",
  categories: ["economy"],
  summary:
    "2026년 한국의 누적 수출이 11월 19일 1조 달러를 넘었다(산업통상부 잠정 집계). 독일·미국·중국에 이어 세계 네 번째다. " +
    "2분기 경상수지 흑자는 1,166억 달러로 통계가 확인되는 36개국 가운데 중국 다음 2위였고, 9월 한 달 흑자는 614억 달러로 월간 역대 최대였다. " +
    "1~10월 수출의 42.7%가 반도체여서, 쏠림과 대미 통상 압박이 함께 과제로 꼽힌다.",
  type: "event",
  publishStatus: "published",
  featured: true,
  lifeQuestion: "수출 1조 달러를 넘었다는데, 무슨 뜻인가요?",
  sourceNote:
    "2026년 11월 22일 기준입니다. 1조 달러 돌파는 산업통상부 참고자료(11월 19일)의 잠정 집계이고, 연간 확정치가 아닙니다. " +
    "경상수지 국가 비교는 IMF 통계를 인용한 보도 두 건, 9월 경상수지는 한국은행 잠정 통계를 인용한 보도 두 건이 일치하는 것을 확인했고, 원자료와는 아직 대조하지 않았습니다. " +
    "정부 정책이 흑자에 얼마나 기여했는지 잰 자료는 찾지 못했습니다.",
  headlineKeyNumberId: "es-1t",
  keyNumbers: [
    { id: "es-1t", label: "연간 누적 수출", value: "1", unit: "조 달러", caption: "2026.11.19 잠정 집계 · 세계 네 번째", claimId: "es-1t" },
    { id: "es-q2-surplus", label: "2분기 경상수지 흑자", value: "1,166", unit: "억 달러", caption: "1년 전 284억 달러의 4.1배 · IMF 통계 인용 보도", claimId: "es-q2" },
    { id: "es-q2-rank", label: "2분기 경상흑자 순위", value: "2", unit: "위", caption: "36개국 중 · 1위 중국 1,937억 달러", claimId: "es-q2-rank" },
    { id: "es-sep", label: "9월 경상수지 흑자", value: "614.6", unit: "억 달러", caption: "월간 역대 최대 · 한국은행 잠정", claimId: "es-sep" },
    { id: "es-chip", label: "1~10월 반도체 수출", value: "3,968", unit: "억 달러", caption: "전년 대비 193.1% · 전체 수출의 42.7%", claimId: "es-chip-cum" },
  ],
  timeline: [
    { id: "es-t-tariff", date: "2025-04", datePrecision: "month", title: "미국, 한국에 상호관세 25% 예고", summary: "이후 정부가 3,500억 달러 대미투자를 약속하고 관세를 15%로 낮췄다.", claimIds: ["es-tariff"] },
    { id: "es-t-q2", date: "2026-06", datePrecision: "month", displayDate: "2026 2분기", title: "2분기 경상흑자 1,166억 달러", summary: "36개국 중 중국 다음 2위, 독일·일본 합계보다 많았다.", claimIds: ["es-q2", "es-q2-rank", "es-q2-dejp"] },
    { id: "es-t-julaug", date: "2026-08", datePrecision: "month", displayDate: "2026.7~8", title: "7~8월 경상흑자 881.9억 달러", summary: "독일·일본 합계(808.2억 달러)를 다시 넘었다.", claimIds: ["es-julaug"] },
    { id: "es-t-imf", date: "2026-10", datePrecision: "month", title: "IMF, 올해 한국 경상흑자 세계 2위 전망", summary: "4,219억 달러, 190개 국가·지역 중 중국 다음.", claimIds: ["es-imf"] },
    { id: "es-t-cmp", date: "2026-10-25", datePrecision: "day", title: "국가별 2분기 경상수지 비교 보도", summary: "IMF 통계로 독일·일본 합계 추월이 1996년 이후 처음으로 확인됐다.", claimIds: ["es-q2-dejp"] },
    { id: "es-t-oct", date: "2026-11-01", datePrecision: "day", title: "1~10월 누적 수출 9,300억 달러", summary: "처음으로 9,000억 달러를 넘었다. 산업통상부는 11월 중 1조 달러가 확실시된다고 밝혔다.", claimIds: ["es-cum", "es-trillion"] },
    { id: "es-t-sep", date: "2026-11-05", datePrecision: "day", title: "9월 경상흑자 614.6억 달러, 월간 역대 최대", summary: "한국은행 잠정 통계. 1~9월 누적 흑자는 3,406.6억 달러로 1년 전의 약 4배다.", claimIds: ["es-sep"] },
    { id: "es-t-1t", date: "2026-11-19", datePrecision: "day", title: "연 수출 1조 달러 돌파", summary: "오후 2시 9분 38초 기준 잠정 집계. 독일·미국·중국에 이어 세계 네 번째다. 대통령은 이 성과를 지속적인 성장으로 이어가야 한다고 밝혔다.", claimIds: ["es-1t", "es-fourth", "es-president"] },
    { id: "es-t-6org", date: "2026-11-20", datePrecision: "day", title: "산업통상부·경제 6단체 간담회", summary: "장관은 1조 달러가 끝이 아닌 새 출발선이라며 성과 확산과 새 수출동력 육성을 과제로 꼽았다.", claimIds: ["es-minister"] },
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
        id: "es-e-trillion", title: "수출 1조 달러를 넘었어요",
        say: "11월 19일 오후 2시 9분, 올해 수출이 1조 달러를 넘었어요. 작년 한 해 수출은 7,093억 달러였어요. 1조 달러를 넘은 나라는 독일·미국·중국 다음으로 한국이 네 번째예요.",
        art: "es-trillion", fact: { value: "세계 4번째", tone: "warm" }, claimIds: ["es-1t", "es-history", "es-fourth"],
      },
      {
        id: "es-e-chip", title: "반도체가 절반을 끌었어요",
        say: "10월 수출 1,153억 달러 가운데 반도체가 564억 달러였어요. 1년 전보다 3.6배로 늘었어요.",
        art: "es-chip", claimIds: ["es-chip-oct"],
      },
    ],
    caveat: {
      text: "1조 달러는 정부가 잠정으로 센 숫자예요. 흑자와 수출이 늘어난 큰 이유는 반도체 값이 오른 것이라, 반도체가 꺾이면 흔들릴 수 있어요.",
      claimIds: ["es-1t", "es-driver"],
    },
  },
  scenes: [{
    id: "es-explainer", kind: "explainer", heading: "숫자로 보는 흑자와 수출", lede: "순위, 1조 달러까지 온 길, 무엇이 끌어올렸는지를 차례로 봅니다.",
    claimIds: ["es-q2-rank", "es-q2-dejp", "es-history", "es-1t", "es-forecast", "es-chip-oct"],
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
          id: "es-ch-trillion", question: "수출 1조 달러는 언제 넘었나요?", heading: "11월 19일, 세계 네 번째",
          steps: [
            { id: "es-step-1995", label: "1995년", caption: "한국 수출은 1995년 연 1,000억 달러를 처음 넘었다." },
            { id: "es-step-2025", label: "2025년", caption: "2025년 한 해 수출은 7,093억 달러였다." },
            { id: "es-step-1t", label: "2026.11.19", caption: "오후 2시 9분 38초 기준 연간 누적 수출이 1조 달러를 넘었다. 산업통상부 잠정 집계다." },
            { id: "es-step-forecast", label: "연말 전망", caption: "산업통상부는 올해 연간 수출을 1조 1,700억 달러로 내다봤다. 아직 전망이다." },
          ],
          visual: {
            kind: "stage-gates", asOfLabel: "2026.11.19 잠정 집계 기준", pendingLabel: "연말까지는 전망",
            stages: [
              { id: "es-gate-1995", label: "1,000억 달러", note: "1995", status: "done" },
              { id: "es-gate-7000", label: "7,000억 달러", note: "2025", status: "done" },
              { id: "es-gate-1t", label: "1조 달러", note: "26.11.19", status: "done" },
              { id: "es-gate-forecast", label: "1조 1,700억 달러", note: "연간 전망", status: "pending" },
            ],
          },
          takeaway: "1년 만에 7,000억 달러대에서 1조 달러로 올라섰다. 독일·미국·중국에 이어 네 번째다.", claimId: "es-1t",
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
      question: "세계 4위 수출국이 됐다는 뜻인가요?",
      response: "같은 말이 아니다. 연 수출 1조 달러를 넘은 나라로는 독일·미국(2006년)과 중국(2007년)에 이어 네 번째라는 뜻이다. 수출액 순위는 보도마다 현재 5위 또는 6위로 적고, 연말에 4위로 오를 것이라는 전망이 있다. 1조 달러 자체도 11월 19일 기준 잠정 집계다.",
      claimIds: ["es-1t", "es-fourth", "es-rank-outlook"],
    },
    {
      id: "es-cp-chip",
      question: "반도체 하나에 기대는 것 아닌가요?",
      response: "그렇다는 지적이 있다. 1~10월 반도체 수출은 3,968억 달러로 전체의 42.7%였고, 월별로는 8월 47.5%, 9월 49.9%, 10월 49.0%였다. 중국 CXMT 등의 추격도 위협 요인으로 꼽히고, AI 투자가 둔화하면 흑자도 흔들릴 수 있다는 보도가 있다. 다만 반도체를 뺀 수출도 1~10월 20% 늘었고, 20대 품목 중 16개가 함께 늘었다.",
      claimIds: ["es-chip-cum", "es-chip-trend", "es-driver", "es-nonchip"],
    },
    {
      id: "es-cp-life",
      question: "내 살림과는 무슨 상관인가요?",
      response: "서울신문은 수출 성과가 반도체에 쏠려 낙수효과가 제한적이고, 청년 고용 악화와 실질임금 정체가 이어진다고 지적했다. 산업통상부는 중소기업 수출이 1~10월 1,076억 달러로 역대 최대였고 화장품·농수산식품·의약품도 사상 최대였다고 밝혔다. 수출 증가가 가계 소득으로 얼마나 이어졌는지 잰 자료는 확인하지 못했다.",
      claimIds: ["es-trickle", "es-sme"],
    },
    {
      id: "es-cp-us",
      question: "흑자가 크면 미국과 마찰이 생기지 않나요?",
      response: "그 위험이 있다. 1~10월 대미 무역흑자는 1,023억 달러로 처음 연간 1,000억 달러를 넘었다. 미국은 2025년 한국의 흑자에 불만을 표하며 상호관세 25%를 예고한 적이 있고, 이후에도 알래스카 LNG 사업을 압박하며 관세 인상을 시사하고 있다. 산업통상부도 미국·EU 보호무역주의 강화를 앞으로의 위험으로 꼽았다.",
      claimIds: ["es-us-surplus", "es-tariff", "es-risk"],
    },
  ],
  claims: [
    {
      id: "es-1t",
      text: "산업통상부는 2026년 11월 19일 14시 09분 38초 기준으로 잠정 집계한 결과 한국의 연간 누적 수출액이 1조 달러를 넘었다고 밝혔다. 연간 확정치가 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1119", "src-es-fn-1119"],
      verified: true,
    },
    {
      id: "es-fourth",
      text: "연 수출 1조 달러를 넘은 나라는 독일·미국(2006년), 중국(2007년)에 이어 한국이 네 번째다. 새 나라가 이름을 올린 것은 2007년 중국 이후 19년 만이다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1119", "src-es-fn-1119"],
      verified: true,
    },
    {
      id: "es-history",
      text: "한국 수출은 1995년 연 1,000억 달러, 2011년 5,000억 달러, 2018년 6,000억 달러를 처음 넘었고, 2025년 한 해 수출은 7,093억 달러였다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1119", "src-es-seoul-1119"],
      verified: true,
    },
    {
      id: "es-forecast",
      text: "산업통상부는 2026년 연간 수출을 1조 1,700억 달러로 전망했다. 전망치다.",
      assertionType: "CLAIM",
      assertedBy: "산업통상부",
      sourceIds: ["src-es-motir-1119", "src-es-fn-1119"],
      verified: true,
    },
    {
      id: "es-rank-outlook",
      text: "수출액 기준 세계 순위는 서울신문이 WTO 8월 발표 기준 5위, 파이낸셜뉴스가 6위로 적어 보도마다 다르다. 두 매체 모두 올해 4위로 오를 것으로 내다봤고, 서울신문은 네덜란드를 제칠 것으로 봤다. 전망이다.",
      assertionType: "CLAIM",
      assertedBy: "서울신문·파이낸셜뉴스",
      sourceIds: ["src-es-seoul-1119", "src-es-fn-1119"],
      verified: true,
    },
    {
      id: "es-chip-cum",
      text: "2026년 1~10월 반도체 수출은 3,968억 달러로 전년 같은 기간보다 193.1% 늘어 전체 수출의 42.7%를 차지했다.",
      assertionType: "FACT",
      sourceIds: ["src-es-seoul-1119", "src-es-fn-1119"],
      verified: true,
    },
    {
      id: "es-nonchip",
      text: "2026년 1~10월 반도체를 뺀 품목의 수출은 20% 늘었다. 20대 수출 품목 가운데 16개, 9대 주요 수출 지역 가운데 7개에서 수출이 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1119"],
      verified: true,
    },
    {
      id: "es-sme",
      text: "2026년 1~10월 중소기업 수출은 1,076억 달러로 9.9% 늘어 역대 최대였고, 1~3분기 중견기업 수출도 1,037억 달러(+11.5%)로 역대 최대였다. 화장품은 10개월 만에 124억 달러로 전년 연간 최대(114억 달러)를 넘었고, 의약품·농수산식품도 사상 최대였다.",
      assertionType: "FACT",
      sourceIds: ["src-es-motir-1119"],
      verified: true,
    },
    {
      id: "es-risk",
      text: "산업통상부는 반도체·석유제품 단가 변동성, 미국·EU의 보호무역주의 강화, 글로벌 공급과잉을 앞으로의 위험 요인으로 꼽았다.",
      assertionType: "CLAIM",
      assertedBy: "산업통상부",
      sourceIds: ["src-es-motir-1119"],
      verified: true,
    },
    {
      id: "es-minister",
      text: "김정관 산업통상부 장관은 1조 달러 돌파를 두고 “세계에서 단 4개국만이 달성한 역사적인 이정표”라고 했고, 11월 20일 경제 6단체 간담회에서 “1조 달러 달성은 끝이 아닌 새로운 출발선”이라며 수출 성과 확산과 반도체 다음 수출동력 육성을 과제로 꼽았다.",
      assertionType: "CLAIM",
      assertedBy: "김정관 산업통상부 장관",
      sourceIds: ["src-es-motir-1119", "src-es-motir-1120"],
      verified: true,
    },
    {
      id: "es-president",
      text: "이재명 대통령은 수출 1조 달러 돌파 소식에 X(옛 트위터)에 글을 올려 수출 1조 달러 시대가 열렸다고 알리며 “이 성과를 지속적인 성장으로 이어가야 한다”고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-es-seoul-1119"],
      verified: true,
    },
    {
      id: "es-trickle",
      text: "서울신문은 수출 성과가 반도체에 쏠려 낙수효과가 제한적이고 청년 고용 악화와 실질임금 정체가 이어지고 있다고 지적했다. 강감찬 산업통상부 무역투자실장도 수출 양극화를 인정했다고 보도했다.",
      assertionType: "INTERPRETATION",
      assertedBy: "서울신문",
      sourceIds: ["src-es-seoul-1119"],
      verified: true,
    },
    {
      id: "es-sep",
      text: "한국은행 「2026년 9월 국제수지(잠정)」에 따르면 9월 경상수지 흑자는 614억 6,000만 달러로 월간 처음 600억 달러를 넘어 역대 최대였다. 종전 최대는 같은 해 6월 497억 3,000만 달러였다. 1~9월 누적 흑자는 3,406억 6,000만 달러로 전년 같은 기간(838억 9,000만 달러)의 약 4배다.",
      assertionType: "FACT",
      sourceIds: ["src-es-mt-1105", "src-es-tomato-1105"],
      verified: true,
    },
    {
      id: "es-bok-outlook",
      text: "한국은행은 올해 연간 경상흑자 전망치를 4,500억 달러로 제시했고, 1~9월 누적 흑자는 그 75.7%다. 전망치다.",
      assertionType: "CLAIM",
      assertedBy: "한국은행",
      sourceIds: ["src-es-mt-1105", "src-es-tomato-1105"],
      verified: true,
    },
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
      text: "산업통상부는 2026년 11월 1일 11월 중 연 수출 1조 달러 달성이 확실시된다고 밝혔다. 당시 남은 금액은 약 700억 달러였고, 실제로 11월 19일 넘었다.",
      assertionType: "CLAIM",
      assertedBy: "산업통상부",
      sourceIds: ["src-es-motir-1101", "src-es-khan-1101", "src-es-motir-1119"],
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
    { id: "src-es-mt-1105", title: "9월 경상흑자 614억불 '사상 최대'…반도체 수출 260% 급증", publisher: "머니투데이", url: "https://www.mt.co.kr/article/2026110509533881967", publishedAt: "2026-11-05", type: "press", license: "link-only" },
    { id: "src-es-tomato-1105", title: "경상흑자 사상 첫 '600억달러'…'반도체 쏠림' 난제", publisher: "뉴스토마토", url: "https://www.newstomato.com/ReadNews.aspx?no=1319455", publishedAt: "2026-11-05", type: "press", license: "link-only" },
    { id: "src-es-motir-1119", title: "(참고자료) 대한민국 수출 1조 달러 돌파, 기업이 뛰고 국민이 함께 이룬 성과", publisher: "산업통상부", url: "https://www.motir.go.kr/kor/article/ATCL3f49a5a8c/172422/view", publishedAt: "2026-11-19", type: "official", license: "public" },
    { id: "src-es-fn-1119", title: "韓 수출 1조달러 시대 개막…세계 네 번째 대기록", publisher: "파이낸셜뉴스", url: "https://www.fnnews.com/news/202611190847109209", publishedAt: "2026-11-19", type: "press", license: "link-only" },
    { id: "src-es-seoul-1119", title: "오징어 팔던 나라, 韓 78년 만에 ‘수출 1조 달러’ 금자탑", publisher: "서울신문", url: "https://www.seoul.co.kr/news/economy/2026/11/19/20261119500342", publishedAt: "2026-11-19", type: "press", license: "link-only" },
    { id: "src-es-motir-1120", title: "(참고자료) 산업부·경제 6단체, 수출 1조 달러 넘어 ‘질적 성장’ 도약 다짐", publisher: "산업통상부", url: "https://www.motir.go.kr/kor/article/ATCL3f49a5a8c/172431/view", publishedAt: "2026-11-20", type: "official", license: "public" },
  ],
};

export const exportSurplus = achievementSchema.parse(raw);
