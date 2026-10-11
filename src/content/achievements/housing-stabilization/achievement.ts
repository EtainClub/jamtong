import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 부동산 안정화 대책 (2025.6~ , 진행 중).
 *
 * 대출 규제(6·27), 공급 확대(9·7), 규제지역·토지거래허가구역(10·15), 양도세 중과
 * 재개(2026.5), 다주택자 만기연장 금지(2026.4)를 한 흐름으로 묶는다.
 *
 * ★ 결과는 엇갈린다. 그대로 적는다.
 *   강남·서초는 1년간 1~3%대로 묶였고 최근 9주 연속 내렸다. 갭투자 비중도 절반으로
 *   줄었다. 그러나 서울 전체 아파트값은 87주 연속 올라 1년 새 10% 넘게 뛰었고,
 *   외곽 중저가 지역과 전세가 크게 올랐다. 지지자가 보낸 링크를 받은 사람이
 *   부동산원 통계를 직접 찾아봐도 버틸 수 있게, 불리한 숫자를 위에 둔다.
 *
 * ★ "안정화"는 목표다. 제목은 정책 이름으로 두고 성공했다고 쓰지 않는다.
 * ★ 9월 가계대출 감소는 보도가 금리 인상 영향으로 설명한다. 대책의 효과로 쓰지 않는다.
 * ★ 2026-10-11 처음 작성. claim마다 인용한 기사·보도자료 본문과 대조했다. 가격은 부동산원 원통계가 아니라 그것을 인용한 보도다.
 */
const raw: AchievementInput = {
  id: "housing-stabilization",
  slug: "housing-stabilization",
  title: "부동산 안정화 대책",
  subtitle: "대출 규제·규제지역·양도세 중과·공급 확대를 함께 쓴 주택 대책",
  kicker: "재정·경제 · 주거",
  categories: ["economy", "region"],
  summary:
    "이재명 정부는 2025년 6월 수도권 주택담보대출을 6억 원으로 묶은 데 이어, 9월 수도권 135만 호 착공 계획, " +
    "10월 서울 전역 규제지역·토지거래허가구역 지정, 2026년 다주택자 양도세 중과 재개와 대출 만기연장 금지를 내놓았다. " +
    "1년 뒤 강남·서초 아파트값은 1~3%대 상승에 그쳤지만, 서울 전체는 10.42% 올랐고 전세도 약 10% 올랐다. 대책은 진행 중이다.",
  type: "policy",
  publishStatus: "published",
  featured: true,
  lifeQuestion: "이재명 정부의 부동산 대책 이후 집값과 전셋값은 어떻게 됐나요?",
  sourceNote:
    "2026년 10월 11일 기준으로 금융위원회 보도자료와 언론 보도를 모았습니다. 가격은 한국부동산원 주간 통계를 인용한 보도이고, " +
    "원자료와는 아직 대조하지 않았습니다. 착공 실적과 거래량 1년 추이는 확인하지 못했습니다.",
  headlineKeyNumberId: "hs-seoul-1y",
  keyNumbers: [
    { id: "hs-seoul-1y", label: "서울 아파트값 1년 상승률", value: "10.42", unit: "%", caption: "10·15 대책 직후~2026.10.5 · 한국부동산원", claimId: "hs-seoul-price" },
    { id: "hs-gangnam-1y", label: "강남구 1년 상승률", value: "1.40", unit: "%", caption: "서초 3.35% · 성북 16.52%", claimId: "hs-district" },
    { id: "hs-jeonse-1y", label: "서울 아파트 전세 1년 상승률", value: "9.92", unit: "%", caption: "직전 1년 2.41% · 한국부동산원", claimId: "hs-jeonse" },
    { id: "hs-supply", label: "수도권 착공 목표", value: "135", unit: "만 호", caption: "2026~2030 · 계획", claimId: "hs-supply" },
  ],
  timeline: [
    { id: "hs-t-627", date: "2025-06-27", datePrecision: "day", title: "주택담보대출 6억 원 상한", summary: "수도권·규제지역 주택 구입 대출을 최대 6억 원으로 묶었다.", claimIds: ["hs-627"] },
    { id: "hs-t-907", date: "2025-09-07", datePrecision: "day", title: "수도권 135만 호 착공 계획", summary: "2026~2030년 연평균 27만 호, LH 직접 시행.", claimIds: ["hs-supply"] },
    { id: "hs-t-1015", date: "2025-10-15", datePrecision: "day", title: "서울 전역 규제지역·토지거래허가구역", summary: "LTV 40%, 집값별 대출 한도, 2년 실거주 의무.", claimIds: ["hs-1015", "hs-loan-tiers"] },
    { id: "hs-t-tax", date: "2026-02-12", datePrecision: "day", title: "양도세 중과 유예 종료 발표", summary: "5월 9일 종료, 5월 10일부터 중과.", claimIds: ["hs-tax"] },
    { id: "hs-t-debt", date: "2026-04-01", datePrecision: "day", title: "다주택자 대출 만기연장 금지", summary: "수도권·규제지역 아파트, 4월 17일 시행.", claimIds: ["hs-debt-2026"] },
    { id: "hs-t-1y", date: "2026-10-05", datePrecision: "day", title: "10·15 대책 1년 시점 통계", summary: "서울 10.42% 상승, 강남 1.40%, 87주 연속 상승.", claimIds: ["hs-seoul-price", "hs-district"] },
  ],
  scenes: [{
    id: "hs-explainer", kind: "explainer", heading: "대책은 어디까지 왔나", lede: "발표된 대책과 시행된 날, 아직 남은 결정을 나눠 봅니다.",
    claimIds: ["hs-627", "hs-1015", "hs-tax", "hs-debt-2026", "hs-permit-end"],
    explainer: {
      chapters: [
        {
          id: "hs-ch-dates", question: "언제 무엇이 시행됐나요?", heading: "대출에서 세금까지, 1년 4개월",
          steps: [
            { id: "hs-step-loan", label: "대출 한도", caption: "2025년 6월 28일부터 수도권 주택 구입 대출을 최대 6억 원으로 묶었다." },
            { id: "hs-step-zone", label: "규제지역", caption: "2025년 10월 서울 전역과 경기 12곳을 규제지역·토지거래허가구역으로 묶고 LTV를 40%로 낮췄다." },
            { id: "hs-step-tax", label: "세금·만기", caption: "2026년 4월 17일 다주택자 대출 만기연장을 막고, 5월 10일부터 양도세를 중과했다." },
            { id: "hs-step-next", label: "다음 결정", caption: "서울 토지거래허가구역 지정 기간은 2026년 말까지다. 연장 여부는 아직 정해지지 않았다." },
          ],
          visual: { kind: "timeline-gate", start: "2025-06-27", end: "2026-12-31", spanLabel: "6·27 대책 이후", futureLabel: "토허구역 기한까지",
            marks: [
              { id: "hs-mark-627", date: "2025-06-28", displayDate: "25.6.28", label: "대출 6억 상한", status: "done" },
              { id: "hs-mark-1015", date: "2025-10-15", displayDate: "25.10.15", label: "10·15 대책", status: "done" },
              { id: "hs-mark-debt", date: "2026-04-17", displayDate: "26.4.17", label: "만기연장 금지", status: "done" },
              { id: "hs-mark-tax", date: "2026-05-10", displayDate: "26.5.10", label: "양도세 중과", status: "done" },
              { id: "hs-mark-asof", date: "2026-10-11", displayDate: "26.10.11", label: "기준일", status: "asof" },
              { id: "hs-mark-permit", date: "2026-12-31", displayDate: "26.12.31", label: "토허구역 기한", status: "planned" },
            ] },
          takeaway: "대출·규제지역·세금 대책은 시행됐다. 토허구역을 이어 갈지는 남은 결정이다.", claimId: "hs-permit-end",
        },
        {
          id: "hs-ch-tools", question: "어떤 수단이 끝났고 무엇이 남았나요?", heading: "시행된 규제와 남은 공급",
          steps: [
            { id: "hs-step-demand", label: "수요 억제", caption: "대출 한도, 규제지역, 양도세 중과, 만기연장 금지는 모두 시행 중이다." },
            { id: "hs-step-supply", label: "공급", caption: "수도권 135만 호는 2026~2030년 착공 계획이다. 착공 실적은 아직 확인하지 못했다." },
          ],
          visual: { kind: "stage-gates", asOfLabel: "2026.10.11 기준 시행", pendingLabel: "아직 계획",
            stages: [
              { id: "hs-gate-loan", label: "대출 한도", note: "25.6.28", status: "done" },
              { id: "hs-gate-zone", label: "규제지역·토허", note: "25.10", status: "done" },
              { id: "hs-gate-debt", label: "만기연장 금지", note: "26.4.17", status: "done" },
              { id: "hs-gate-tax", label: "양도세 중과", note: "26.5.10", status: "done" },
              { id: "hs-gate-supply", label: "135만 호 착공", note: "~2030", status: "pending" },
            ] },
          takeaway: "수요를 누르는 대책은 시행됐고, 공급은 아직 계획 단계다.", claimId: "hs-supply",
        },
      ],
    },
  }],
  graph: {
    note: "개인 대신 대책이 겨냥한 집단을 표시했습니다.",
    entities: [
      { id: "hs-gov", name: "정부", kind: "government", description: "국토교통부·금융위원회·재정경제부", isFocus: true },
      { id: "hs-multi", name: "다주택자·임대사업자", kind: "group", description: "양도세 중과, 대출 만기연장 금지 대상" },
      { id: "hs-buyer", name: "주택 구입자", kind: "group", description: "규제지역 무주택 실수요자 포함" },
      { id: "hs-tenant", name: "세입자", kind: "group", description: "전월세 시장" },
      { id: "hs-bank", name: "금융회사", kind: "organization", description: "주택담보대출 취급" },
    ],
    relations: [
      { id: "hs-r-cap", fromId: "hs-gov", toId: "hs-bank", label: "주택 구입 대출 최대 6억 원, 집값별 한도", startDate: "2025-06-28", startPrecision: "day", assertionType: "FACT", claimIds: ["hs-627", "hs-loan-tiers"] },
      { id: "hs-r-zone", fromId: "hs-gov", toId: "hs-buyer", label: "LTV 40%, 토허구역 2년 실거주 의무", startDate: "2025-10-15", startPrecision: "day", assertionType: "FACT", claimIds: ["hs-1015"] },
      { id: "hs-r-tax", fromId: "hs-gov", toId: "hs-multi", label: "양도세 20~30%p 중과", startDate: "2026-05-10", startPrecision: "day", assertionType: "FACT", claimIds: ["hs-tax"] },
      { id: "hs-r-debt", fromId: "hs-bank", toId: "hs-multi", label: "수도권 아파트 대출 만기연장 불허", startDate: "2026-04-17", startPrecision: "day", assertionType: "FACT", claimIds: ["hs-debt-2026"] },
      { id: "hs-r-rent", fromId: "hs-buyer", toId: "hs-tenant", label: "갭투자 감소, 전월세 매물 감소", startDate: "2025-10-15", startPrecision: "day", assertionType: "FACT", claimIds: ["hs-gap", "hs-jeonse"] },
    ],
  },
  counterpoints: [
    {
      id: "hs-cp-stable",
      question: "집값이 안정됐나요?",
      response: "서울 전체로는 아니다. 서울 아파트값은 87주 연속 올랐고, 10·15 대책 직후부터 1년간 10.42% 올랐다. 내린 곳은 강남·서초 등 일부 고가 지역이다.",
      claimIds: ["hs-seoul-price", "hs-district"],
    },
    {
      id: "hs-cp-jeonse",
      question: "세입자는 어떻게 됐나요?",
      response: "전셋값이 1년간 9.92% 올라 직전 1년(2.41%)의 4배가 넘었고, 서울 전월세 매물은 1년 전보다 12.5% 줄었다. 토지거래허가구역의 실거주 의무로 임대용 매입이 줄었다는 분석이 있다.",
      claimIds: ["hs-jeonse"],
    },
    {
      id: "hs-cp-loans",
      question: "9월 가계대출이 줄어든 건 대책 효과인가요?",
      response: "단정할 수 없다. 9월 5대 은행 가계대출은 1.3조 원 줄었지만, 보도는 7·8월 기준금리 인상에 따른 이자 부담을 주된 이유로 들었다. 같은 시기 은행권 대출 총량 목표는 1.5%에서 3.0%로 올라갔다.",
      claimIds: ["hs-loans-sep"],
    },
    {
      id: "hs-cp-nothing",
      question: "그럼 대책은 효과가 없었나요?",
      response: "겨냥한 곳에서는 변화가 있었다. 강남·서초 상승률은 1~3%대로 서울 평균보다 훨씬 낮았고 9주 연속 하락 중이다. 서울 아파트 매수 자금 중 보증금을 승계하는 갭투자 비중은 15.76%에서 7.80%로 줄었다. 다만 수요가 외곽 중저가 지역으로 옮겨 갔다는 분석이 함께 나온다.",
      claimIds: ["hs-district", "hs-gap"],
    },
  ],
  claims: [
    {
      id: "hs-627",
      text: "2025년 6월 27일 금융당국은 6월 28일부터 수도권·규제지역의 주택 구입 목적 주택담보대출을 최대 6억 원으로 제한한다고 발표했다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-fsc-627"],
      verified: true,
    },
    {
      id: "hs-supply",
      text: "2025년 9월 7일 정부는 2026년부터 2030년까지 수도권에 주택 135만 호를 착공하는 공급 확대방안을 발표했다. 연평균 27만 호로 최근 3년 평균(15만 8,000호)보다 11만 2,000호 많고, LH가 공동주택용지를 민간에 팔지 않고 직접 시행한다. 착공 기준 계획이며 실적은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-newsis-907"],
      verified: true,
    },
    {
      id: "hs-1015",
      text: "2025년 10월 15일 정부는 서울 전역과 경기 12곳을 조정대상지역·투기과열지구와 토지거래허가구역으로 지정하고, 이 지역 무주택자의 주택담보대출 LTV를 70%에서 40%로 낮췄다. 토지거래허가구역에서는 취득 후 2년 실거주 의무가 붙었다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-newsis-1015", "src-hs-dailian-1015"],
      verified: true,
    },
    {
      id: "hs-loan-tiers",
      text: "주택담보대출 한도는 집값에 따라 15억 원 이하 최대 6억 원, 15억~25억 원 4억 원, 25억 원 초과 2억 원으로 차등됐다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-sankyung-1011"],
      verified: true,
    },
    {
      id: "hs-tax",
      text: "정부는 2026년 2월 12일 다주택자 양도소득세 중과 유예를 5월 9일 예정대로 끝낸다고 발표했다. 5월 10일부터 조정대상지역 2주택자는 기본세율에 20%포인트, 3주택 이상은 30%포인트가 더해진다(최고 지방세 포함 82.5%).",
      assertionType: "FACT",
      sourceIds: ["src-hs-khan-tax-0212"],
      verified: true,
    },
    {
      id: "hs-debt-2026",
      text: "금융위원회는 2026년 4월 1일 가계부채 관리방안에서 다주택자·임대사업자의 수도권·규제지역 아파트 담보대출 만기연장을 4월 17일부터 원칙적으로 허용하지 않기로 했다. 임차인이 있으면 임대차 종료일까지는 연장된다. 2026년 가계대출 증가율 목표는 1.5%로 잡았다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-fsc-0401"],
      verified: true,
    },
    {
      id: "hs-permit-end",
      text: "서울 토지거래허가구역 지정 기간은 2026년 말까지다. 홍지선 국토교통부 장관은 10월 7일 국정감사에서 현 시장 상황에서 제도 유지가 필요하다는 취지로 답해 연장 가능성을 시사했다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-sankyung-1011"],
      verified: true,
    },
    {
      id: "hs-seoul-price",
      text: "한국부동산원 주간 통계로 서울 아파트 매매가격은 2026년 10월 5일 기준 87주 연속 올라 통계 사상 최장 상승을 이어 갔고, 10·15 대책 직후(2025년 10월 셋째 주)부터 1년간 10.42% 올랐다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-newspim-1008", "src-hs-sankyung-1011"],
      verified: true,
    },
    {
      id: "hs-district",
      text: "같은 1년간 강남구는 1.40%, 서초구는 3.35% 올랐고, 성북구는 16.52%, 서대문구는 14.40% 올랐다. 2026년 10월 첫째 주 강남구(-0.34%)·서초구(-0.27%)·송파구(-0.19%)는 내렸고, 서초구는 9주째 하락했다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-sankyung-1011", "src-hs-newspim-1008"],
      verified: true,
    },
    {
      id: "hs-jeonse",
      text: "서울 아파트 전세가격지수는 토지거래허가구역 지정 뒤 1년(2025년 10월~2026년 9월)간 9.92% 올라 직전 1년(2.41%)보다 크게 높았다. 서울 전월세 매물은 1년 전 4만 3,281건에서 3만 7,896건으로 12.5% 줄었다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-asiae-1011"],
      verified: true,
    },
    {
      id: "hs-gap",
      text: "서울 아파트 매수 자금 가운데 임대보증금을 승계하는 갭투자 비중은 토지거래허가구역 지정 전 15.76%에서 지정 후 7.80%로 줄었다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-asiae-1011"],
      verified: true,
    },
    {
      id: "hs-loans-sep",
      text: "5대 은행 가계대출은 2026년 9월 1조 2,852억 원 줄어 6개월 만에 감소했고, 주택담보대출은 1,253억 원 느는 데 그쳤다. 보도는 7·8월 기준금리 인상에 따른 이자 부담을 주된 이유로 들었고, 같은 시기 당국은 은행권 가계대출 총량 목표를 1.5%에서 3.0%로 높였다.",
      assertionType: "FACT",
      sourceIds: ["src-hs-fnnews-1002"],
      verified: true,
    },
  ],
  sources: [
    { id: "src-hs-fsc-627", title: "가계부채 관리 방안 (보도자료)", publisher: "금융위원회", url: encodeURI("https://files-scs.pstatic.net/2025/06/27/6yDjjGw0Ji/250627(보도자료)가계부채 관리 방안.pdf"), publishedAt: "2025-06-27", type: "official", license: "public" },
    { id: "src-hs-newsis-907", title: "李정부 첫 주택공급 대책…5년간 수도권 135만호 착공 [9·7 주택공급 확대]", publisher: "뉴시스", url: "https://mobile.newsis.com/view/NISX20250907_0003318892", publishedAt: "2025-09-07", type: "press", license: "link-only" },
    { id: "src-hs-newsis-1015", title: "서울, 경기 12곳 LTV 70%→40% 축소", publisher: "뉴시스", url: "https://mobile.newsis.com/view/NISX20251016_0003365057", publishedAt: "2025-10-16", type: "press", license: "link-only" },
    { id: "src-hs-dailian-1015", title: "서울 전역·경기 12곳, LTV 40%·실거주 의무 적용 [10.15 부동산 대책]", publisher: "데일리안", url: "https://www.dailian.co.kr/news/view/1559740", publishedAt: "2025-10-15", type: "press", license: "link-only" },
    { id: "src-hs-khan-tax-0212", title: "다주택자 양도세 중과 유예 종료 Q&A", publisher: "경향신문", url: "https://www.khan.co.kr/article/202602121659001", publishedAt: "2026-02-12", type: "press", license: "link-only" },
    { id: "src-hs-fsc-0401", title: "부동산 시장과 금융의 절연을 위한 「'26년도 가계부채 관리방안」 발표", publisher: "금융위원회", url: "https://fsc.go.kr/po010103/86606", publishedAt: "2026-04-01", type: "official", license: "public" },
    { id: "src-hs-fnnews-1002", title: "공급 문 열었지만 '금리'에 막혔다…9월 5대 은행 가계대출 1.3조↓", publisher: "파이낸셜뉴스(뉴스1)", url: "https://www.fnnews.com/news/202610020515392498", publishedAt: "2026-10-02", type: "press", license: "link-only" },
    { id: "src-hs-newspim-1008", title: "서울 아파트 매맷값, 87주 연속 상승…강남권 9주 하락에도 상승폭 커져", publisher: "뉴스핌", url: "https://www.newspim.com/news/view/20261008000746", publishedAt: "2026-10-08", type: "press", license: "link-only" },
    { id: "src-hs-asiae-1011", title: "\"가수요 잡겠다\"던 정책목표, 임대차 시장 불안만 키웠다 [서울전역 토허제 1년]", publisher: "아시아경제", url: "https://view.asiae.co.kr/article/2026100723312539678", publishedAt: "2026-10-11", type: "press", license: "link-only" },
    { id: "src-hs-sankyung-1011", title: "10·15 부동산 대책 1년…강남 잡았더니 서울 외곽 집값 급등", publisher: "산경투데이", url: "https://www.sankyungtoday.com/news/articleView.html?idxno=63532", publishedAt: "2026-10-11", type: "press", license: "link-only" },
  ],
};

export const housingStabilization = achievementSchema.parse(raw);
