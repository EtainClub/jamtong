import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 방한 외국인 관광객 역대 최다 (2026).
 *
 * 10월 27일 기준 누적 방한객이 지난해 연간 최다(1,894만 명)를 넘었다.
 * 문화체육관광부 발표와 정책브리핑(1~8월 통계)을 묶는다.
 *
 * ★ 2,000만 명·2,300만 명은 문체부의 전망·목표다. 기준일 현재 달성 전이다.
 * ★ 배경으로 든 정책(비자 완화, 국가관광전략회의 격상 등)은 문체부의 설명이다.
 *   정책별 기여를 잰 자료는 확인하지 못했다. 'K-컬처 확산'도 같은 설명에 들어 있다.
 * ★ 중국 단체관광 무비자는 윤석열 정부 때 검토가 시작됐다. 함께 적는다.
 *   (정책 팩트 `policy:china-group-visa-free`와 같은 출처를 쓴다.)
 * ★ 2026-11-02 처음 작성. claim마다 인용한 보도자료·기사 본문과 대조했다.
 *   한국관광공사 한국관광통계 원자료와는 아직 대조하지 않았다.
 */
const raw: AchievementInput = {
  id: "inbound-tourism",
  slug: "inbound-tourism",
  title: "외국인 관광객 역대 최다",
  subtitle: "10월에 이미 지난해 1년치를 넘어선 방한 관광객",
  kicker: "재정·경제 · 관광",
  categories: ["economy", "diplomacy"],
  summary:
    "2026년 10월 27일 누적 방한 외국인 관광객이 지난해 연간 최다 기록인 1,894만 명을 넘었다. " +
    "1~9월 방한객은 1,711만 명으로 1년 전보다 21.5% 늘었고, 같은 기간 일본(-2.9%)·태국(-3.8%)은 줄었다. " +
    "외국인 카드 소비는 47.7% 늘었다. 문화체육관광부는 11월 셋째 주 2,000만 명, 연말 2,300만 명 목표 달성을 전망한다.",
  type: "event",
  publishStatus: "published",
  featured: true,
  lifeQuestion: "외국인 관광객이 정말 역대 최다인가요? 무엇이 달라졌나요?",
  sourceNote:
    "2026년 11월 2일 기준입니다. 문화체육관광부 발표를 전한 보도와 정책브리핑(1~8월 통계)을 대조했습니다. " +
    "한국관광공사 원자료와는 아직 대조하지 않았습니다. 2,000만·2,300만 명은 전망이고, 비자 완화 등 정책이 증가에 얼마나 기여했는지 잰 자료는 찾지 못했습니다.",
  headlineKeyNumberId: "tr-record-n",
  keyNumbers: [
    { id: "tr-record-n", label: "10.27 누적 방한객", value: "1,894", unit: "만 명", caption: "지난해 연간 최다를 두 달 앞당겨 넘음 · 문체부", claimId: "tr-record" },
    { id: "tr-growth", label: "1~9월 증가율", value: "21.5", unit: "%", caption: "1,711만 명 · 일본 -2.9%, 태국 -3.8%", claimId: "tr-q3" },
    { id: "tr-spend-n", label: "1~9월 외국인 카드 소비", value: "15.9", unit: "조 원", caption: "1년 전 10.8조 원 · 47.7% 증가", claimId: "tr-spend" },
    { id: "tr-target", label: "연말 정부 목표", value: "2,300", unit: "만 명", caption: "목표·전망 · 기준일 현재 달성 전", claimId: "tr-forecast" },
  ],
  timeline: [
    { id: "tr-t-china", date: "2025-09-29", datePrecision: "day", title: "중국 단체관광객 한시 무비자 시행", summary: "3인 이상 단체, 15일 이내. 검토는 윤석열 정부 때 시작됐다.", claimIds: ["tr-china-visa", "tr-origin"] },
    { id: "tr-t-sea", date: "2026-03-30", datePrecision: "day", title: "동남아 11개국 복수사증 요건 완화", summary: "필리핀·베트남·인도네시아 등.", claimIds: ["tr-visa-sea"] },
    { id: "tr-t-indo", date: "2026-05-28", datePrecision: "day", title: "인도네시아 단체관광객 무사증 시범", summary: "한시 시범 시행.", claimIds: ["tr-visa-sea"] },
    { id: "tr-t-extend", date: "2026-07-01", datePrecision: "day", title: "중국 단체 무비자 연말까지 연장", summary: "2026년 12월 31일까지.", claimIds: ["tr-china-visa"] },
    { id: "tr-t-aug", date: "2026-09-28", datePrecision: "day", title: "1~8월 누적 1,505만 명 발표", summary: "8월 225만 명은 월 단위 역대 최고.", claimIds: ["tr-aug"] },
    { id: "tr-t-record", date: "2026-10-27", datePrecision: "day", title: "연간 최다 기록 경신", summary: "지난해 1,894만 명을 두 달 앞당겨 넘었다.", claimIds: ["tr-record"] },
  ],
  eli5: {
    intro: "올해 한국을 찾은 외국인이 얼마나, 어디서, 왜 늘었는지 봐요.",
    scenes: [
      {
        id: "tr-e-record", title: "10월에 벌써 작년 1년치를 넘었어요",
        say: "작년 한 해 동안 온 외국인 관광객은 1,894만 명이었어요. 올해는 10월 27일에 그 숫자를 넘었어요.",
        art: "tr-record", fact: { value: "1,894만 명", tone: "ice" }, claimIds: ["tr-record"],
      },
      {
        id: "tr-e-neighbors", title: "이웃 나라와 방향이 달랐어요",
        say: "1~9월 한국은 21.5% 늘었는데, 같은 때 일본은 2.9%, 태국은 3.8% 줄었어요.",
        art: "tr-neighbors", claimIds: ["tr-q3", "tr-compare"],
      },
      {
        id: "tr-e-spend", title: "쓰는 돈은 더 크게 늘었어요",
        say: "외국인이 카드로 쓴 돈이 1년 전 10.8조 원에서 15.9조 원이 됐어요. 쇼핑, 숙박, 의료·웰니스 순이에요.",
        art: "tr-spend", fact: { value: "+47.7%", tone: "warm" }, claimIds: ["tr-spend"],
      },
      {
        id: "tr-e-region", title: "서울 밖으로 바로 오는 사람도 늘었어요",
        say: "수도권이 아닌 공항과 항구로 들어온 외국인이 374만 명에서 482만 명으로 늘었어요.",
        art: "tr-region", claimIds: ["tr-region"],
      },
      {
        id: "tr-e-visa", title: "들어오는 문을 넓혔어요",
        say: "중국 단체관광객 무비자, 동남아 복수비자 완화, 인도네시아 단체 무비자 시범이 이어졌어요.",
        art: "tr-visa", claimIds: ["tr-china-visa", "tr-visa-sea"],
      },
    ],
    caveat: {
      text: "2,000만·2,300만 명은 아직 전망이에요. 비자 완화가 얼마나 보탰는지는 따로 잰 자료가 없어요. 중국 무비자는 이전 정부 때 검토가 시작됐어요.",
      claimIds: ["tr-forecast", "tr-policy", "tr-origin"],
    },
  },
  scenes: [{
    id: "tr-explainer", kind: "explainer", heading: "기록, 문, 지갑", lede: "어디까지 왔는지, 무엇을 열었는지, 얼마를 썼는지 차례로 봅니다.",
    claimIds: ["tr-aug", "tr-record", "tr-forecast", "tr-china-visa", "tr-visa-sea", "tr-spend"],
    explainer: {
      chapters: [
        {
          id: "tr-ch-record", question: "기록은 언제 넘었고, 무엇이 남았나요?", heading: "작년 기록은 넘었고, 목표는 남았다",
          steps: [
            { id: "tr-step-aug", label: "8월 말", caption: "1~8월 누적 1,505만 명으로 같은 기간 역대 최고였다." },
            { id: "tr-step-record", label: "10월 27일", caption: "누적 방한객이 지난해 연간 최다 1,894만 명을 넘었다." },
            { id: "tr-step-asof", label: "기준일", caption: "11월 2일 현재 2,000만 명은 아직 넘지 않았다." },
            { id: "tr-step-goal", label: "전망", caption: "문체부는 11월 셋째 주 2,000만 명, 연말 2,300만 명 목표 달성을 전망한다." },
          ],
          visual: { kind: "timeline-gate", start: "2026-01-01", end: "2026-12-31", spanLabel: "올해 1월부터", futureLabel: "전망 구간",
            marks: [
              { id: "tr-mark-aug", date: "2026-08-31", displayDate: "8월 말", label: "1,505만", status: "done" },
              { id: "tr-mark-record", date: "2026-10-27", displayDate: "10.27", label: "1,894만 돌파", status: "done" },
              { id: "tr-mark-asof", date: "2026-11-02", displayDate: "11.2", label: "기준일", status: "asof" },
              { id: "tr-mark-2000", date: "2026-11-16", displayDate: "11월 3주", label: "2,000만(전망)", status: "planned" },
              { id: "tr-mark-goal", date: "2026-12-31", displayDate: "12.31", label: "2,300만(목표)", status: "planned" },
            ] },
          takeaway: "역대 최다는 이미 넘었다. 2,000만·2,300만 명은 아직 전망이다.", claimId: "tr-forecast",
        },
        {
          id: "tr-ch-visa", question: "들어오는 문은 어떻게 넓어졌나요?", heading: "비자 문턱을 차례로 낮췄다",
          steps: [
            { id: "tr-step-china", label: "중국 단체", caption: "2025년 9월 29일 중국 단체관광객 한시 무비자를 시작했다. 검토는 이전 정부 때 시작됐다." },
            { id: "tr-step-sea", label: "동남아", caption: "2026년 3월 30일 필리핀·베트남·인도네시아 등 동남아 11개국 복수사증 요건을 낮췄다." },
            { id: "tr-step-indo", label: "인도네시아", caption: "5월 28일 인도네시아 단체관광객 무사증을 한시 시범 시행했다." },
            { id: "tr-step-extend", label: "연장", caption: "중국 단체 무비자를 2026년 12월 31일까지 연장했다." },
            { id: "tr-step-next", label: "연말 기한", caption: "그 뒤에 이어 갈지는 아직 정해지지 않았다." },
          ],
          visual: { kind: "stage-gates", asOfLabel: "2026.11.2 기준 시행", pendingLabel: "남은 결정",
            stages: [
              { id: "tr-gate-china", label: "중국 단체 무비자", note: "25.9.29", status: "done" },
              { id: "tr-gate-sea", label: "동남아 복수비자", note: "26.3.30", status: "done" },
              { id: "tr-gate-indo", label: "인니 단체 시범", note: "26.5.28", status: "done" },
              { id: "tr-gate-extend", label: "중국 연장", note: "26.7.1", status: "done" },
              { id: "tr-gate-end", label: "연말 기한 이후", note: "26.12.31", status: "pending" },
            ] },
          takeaway: "비자 완화는 시행 중이다. 중국 무비자를 내년에도 이어 갈지는 남은 결정이다.", claimId: "tr-china-visa",
        },
        {
          id: "tr-ch-spend", question: "돈은 얼마나 썼나요?", heading: "카드 소비 10.8조 → 15.9조",
          steps: [
            { id: "tr-step-last", label: "지난해", caption: "2025년 1~9월 외국인 관광 카드 소비는 10.8조 원이었다." },
            { id: "tr-step-this", label: "올해", caption: "2026년 같은 기간 15.9조 원으로 47.7% 늘었다. 방한객 증가율(21.5%)보다 크다." },
          ],
          visual: {
            kind: "rank-bars", unit: "조 원", periodLabel: "1~9월 외국인 관광 신용카드 소비",
            bars: [
              { id: "tr-bar-2026", label: "2026년", value: 15.9, focus: true },
              { id: "tr-bar-2025", label: "2025년", value: 10.8 },
            ],
            note: "문화체육관광부 발표를 전한 보도 기준입니다. 현금·간편결제 지출은 들어 있지 않습니다.",
          },
          takeaway: "관광객보다 지출이 더 빨리 늘었다.", claimId: "tr-spend",
        },
      ],
    },
  }],
  graph: {
    note: "개인 대신 정책과 관광에 관여한 주체를 표시했습니다.",
    entities: [
      { id: "tr-gov", name: "정부", kind: "government", description: "문화체육관광부·법무부 · 국가관광전략회의", isFocus: true },
      { id: "tr-visitors", name: "방한 외국인 관광객", kind: "group", description: "중화권·일본·구미주·동남아" },
      { id: "tr-local", name: "비수도권 지역", kind: "group", description: "지방 공항·항만, 지역 상권" },
      { id: "tr-biz", name: "관광 업계", kind: "group", description: "쇼핑·숙박·의료·웰니스" },
    ],
    relations: [
      { id: "tr-r-visa", fromId: "tr-gov", toId: "tr-visitors", label: "단체 무비자·복수사증 요건 완화", startDate: "2025-09-29", startPrecision: "day", assertionType: "FACT", claimIds: ["tr-china-visa", "tr-visa-sea"] },
      { id: "tr-r-spend", fromId: "tr-visitors", toId: "tr-biz", label: "1~9월 카드 소비 15.9조 원", startDate: "2026", startPrecision: "year", assertionType: "FACT", claimIds: ["tr-spend"] },
      { id: "tr-r-region", fromId: "tr-visitors", toId: "tr-local", label: "비수도권 공항·항만 입국 482만 명", startDate: "2026", startPrecision: "year", assertionType: "FACT", claimIds: ["tr-region"] },
      { id: "tr-r-council", fromId: "tr-gov", toId: "tr-biz", label: "국가관광전략회의 대통령 소속 격상, 항공편·마케팅 지원", startDate: "2026", startPrecision: "year", assertionType: "CLAIM", assertedBy: "문화체육관광부", claimIds: ["tr-policy"] },
    ],
  },
  counterpoints: [
    {
      id: "tr-cp-gov",
      question: "정부 정책 덕분인가요?",
      response: "문체부는 국가관광전략회의 격상, 항공편 확충, 비자 발급 완화, 해외 마케팅과 함께 K-컬처 확산을 배경으로 든다. 비자 완화는 실제로 시행됐지만, 각 정책이 증가에 얼마나 기여했는지 잰 자료는 확인하지 못했다.",
      claimIds: ["tr-policy", "tr-china-visa", "tr-visa-sea"],
    },
    {
      id: "tr-cp-china",
      question: "중국 무비자는 이 정부가 시작한 건가요?",
      response: "시행은 이 정부 때인 2025년 9월 29일이다. 검토는 윤석열 정부 때 시작됐고, 2025년 3월 최상목 권한대행이 3분기 시행을 밝혔다.",
      claimIds: ["tr-china-visa", "tr-origin"],
    },
    {
      id: "tr-cp-2000",
      question: "2,000만 명을 넘었나요?",
      response: "11월 2일 현재 아직 아니다. 문체부는 11월 셋째 주 2,000만 명을 넘고 연말 정부 목표 2,300만 명도 달성할 수 있다고 전망했다. 환율 변동과 고유가를 불안 요인으로 함께 꼽았다.",
      claimIds: ["tr-forecast", "tr-risk"],
    },
    {
      id: "tr-cp-china-only",
      question: "중국인만 늘어난 것 아닌가요?",
      response: "중화권 증가율이 가장 높지만 다른 지역도 늘었다. 1~9월 중화권 29.1%, 일본 16.9%, 구미주 15.1% 증가했다. 1~8월 필리핀·베트남·인도네시아 등 동남아 방한객도 10~20%대 늘었다.",
      claimIds: ["tr-origin-mix", "tr-aug"],
    },
  ],
  claims: [
    {
      id: "tr-record",
      text: "문화체육관광부는 2026년 10월 27일 기준 누적 방한 외국인 관광객이 기존 연간 최다 기록인 2025년의 1,894만 명을 넘었다고 밝혔다. 종전 기록보다 두 달가량 빠르다.",
      assertionType: "FACT",
      sourceIds: ["src-tr-khan-1027", "src-tr-asiatoday-1027"],
      verified: true,
    },
    {
      id: "tr-q3",
      text: "2026년 1~9월 방한 외국인 관광객은 1,711만 명으로 1년 전보다 21.5% 늘었다. 9월 한 달은 206만 명으로 21.1% 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-tr-khan-1027"],
      verified: true,
    },
    {
      id: "tr-compare",
      text: "같은 1~9월 주변국 방문객 증감률은 일본 -2.9%, 태국 -3.8%, 베트남 +14.5%였다(문화체육관광부 발표).",
      assertionType: "FACT",
      sourceIds: ["src-tr-khan-1027"],
      verified: true,
    },
    {
      id: "tr-origin-mix",
      text: "1~9월 출신 지역별 방한객 증가율은 중화권 29.1%, 일본 16.9%, 구미주 15.1%였다.",
      assertionType: "FACT",
      sourceIds: ["src-tr-khan-1027"],
      verified: true,
    },
    {
      id: "tr-aug",
      text: "2026년 1~8월 방한 외국인 관광객은 1,505만 명으로 1년 전(1,238만 명)보다 21.6% 늘어 같은 기간 역대 최고였다. 8월 한 달 225만 명은 월 단위 역대 최고다. 동남아에서는 필리핀(+16.1%), 베트남(+10.5%), 인도네시아(+22.5%) 등이 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-tr-korea-0928"],
      verified: true,
    },
    {
      id: "tr-spend",
      text: "2026년 1~9월 외국인 관광 신용카드 소비액은 15조 9,000억 원으로 1년 전(10조 8,000억 원)보다 47.7% 늘었다. 업종별 비중은 쇼핑업 37.0%, 숙박업 19.6%, 의료·웰니스업 16.6%였다.",
      assertionType: "FACT",
      sourceIds: ["src-tr-khan-1027"],
      verified: true,
    },
    {
      id: "tr-region",
      text: "2026년 1~9월 비수도권 공항·항만으로 들어온 외국인은 482만 명으로 1년 전(374만 명)보다 늘었다. 외국인 관광객의 지역 방문 횟수는 6,472만 회로 전년 같은 기간보다 19.7% 늘었다(기간은 보도에 명시되지 않음).",
      assertionType: "FACT",
      sourceIds: ["src-tr-khan-1027"],
      verified: true,
    },
    {
      id: "tr-forecast",
      text: "문화체육관광부는 11월 셋째 주 연간 누적 2,000만 명을 처음 넘고, 연말까지 정부 목표치 2,300만 명도 달성할 수 있다고 전망했다. 기준일(11월 2일) 현재 달성 전이다.",
      assertionType: "CLAIM",
      assertedBy: "문화체육관광부",
      sourceIds: ["src-tr-asiatoday-1027", "src-tr-khan-1027"],
      verified: true,
    },
    {
      id: "tr-policy",
      text: "문화체육관광부는 성과 배경으로 국가관광전략회의의 대통령 소속 격상과 범부처 협력, 항공편 확충, 비자 발급 완화, 교통 편의 증진, 추경을 통한 해외 마케팅 강화와 함께 K-컬처 확산과 국민 환대를 꼽았다.",
      assertionType: "CLAIM",
      assertedBy: "문화체육관광부",
      sourceIds: ["src-tr-khan-1027"],
      verified: true,
    },
    {
      id: "tr-risk",
      text: "문화체육관광부는 환율 변동과 고유가를 불안 요인으로 언급했다.",
      assertionType: "CLAIM",
      assertedBy: "문화체육관광부",
      sourceIds: ["src-tr-khan-1027"],
      verified: true,
    },
    {
      id: "tr-visa-sea",
      text: "정부는 2026년 3월 30일부터 필리핀·베트남·인도네시아 등 동남아 11개국 대상 복수사증 발급 요건을 완화했고, 5월 28일부터 인도네시아 단체관광객 무사증 입국을 한시 시범 시행했다.",
      assertionType: "FACT",
      sourceIds: ["src-tr-korea-0928"],
      verified: true,
    },
    {
      id: "tr-china-visa",
      text: "중국 단체관광객(3인 이상, 지정 여행사 모집) 한시 무비자 입국은 2025년 9월 29일 시작돼 15일 이내 체류를 허용한다. 법무부는 2026년 6월 시행 기간을 2026년 12월 31일까지 연장했다.",
      assertionType: "FACT",
      sourceIds: ["src-tr-newsis-visa-0907", "src-tr-mofa-visa-0623"],
      verified: true,
    },
    {
      id: "tr-origin",
      text: "중국 단체관광 무비자는 윤석열 정부 때 검토가 시작됐다. 2024년 12월 국가관광전략회의에서 시범 사업을 하기로 했고, 2025년 3월 최상목 대통령 권한대행이 3분기 중 시행하겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-tr-ohmynews-visa"],
      verified: true,
    },
  ],
  sources: [
    { id: "src-tr-khan-1027", title: "연간 외국인 관광객 수, 역대 최고치 기록 두 달 앞당겨 경신", publisher: "경향신문", url: "https://www.khan.co.kr/article/202610271754001/", publishedAt: "2026-10-27", type: "press", license: "link-only" },
    { id: "src-tr-asiatoday-1027", title: "올해 외국인 관광객 역대 최다 기록, 2300만명 목표 달성 전망", publisher: "아시아투데이", url: "https://www.asiatoday.co.kr/kn/view.php?key=20261027010009580", publishedAt: "2026-10-27", type: "press", license: "link-only" },
    { id: "src-tr-korea-0928", title: "올해 8월까지 누적 외국인 관광객 1505만 명 '역대 최고'", publisher: "대한민국 정책브리핑(문화체육관광부)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148972696", publishedAt: "2026-09-28", type: "official", license: "public" },
    { id: "src-tr-newsis-visa-0907", title: "중국 단체관광객 15일 내 무비자 한국 관광 가능", publisher: "뉴시스", url: "https://www.newsis.com/view/NISX20250907_0003318800", publishedAt: "2025-09-07", type: "press", license: "link-only" },
    { id: "src-tr-mofa-visa-0623", title: "중국 단체관광객 무사증입국 허가제도 연장 시행", publisher: "주칭다오 대한민국 총영사관", url: "https://www.mofa.go.kr/cn-qingdao-ko/brd/m_24477/view.do?seq=1357024", publishedAt: "2026-06-23", type: "official", license: "public" },
    { id: "src-tr-ohmynews-visa", title: "\"중국인 무비자, 윤석열 정부에서 시작\" 민주당 주장 '사실' [오마이팩트]", publisher: "오마이뉴스", url: "https://www.ohmynews.com/NWS_Web/OhmyFact/at_pg.aspx?CNTN_CD=A0003173012", publishedAt: "2025-10-15", type: "press", license: "link-only" },
  ],
};

export const inboundTourism = achievementSchema.parse(raw);
