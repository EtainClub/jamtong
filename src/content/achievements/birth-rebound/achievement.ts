import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 출생아 반등 (2024.7~ , 진행 중).
 *
 * 국가데이터처 「2026년 8월 인구동향」(2026-10-28)을 중심으로, 2025년 연간 출생
 * 통계와 2026년 10월 제1차 국가인구전략 기본계획을 묶는다.
 *
 * ★ 증가의 원인은 통계 발표에 나오지 않는다. 정책 효과로 단정하지 않는다.
 *   반등은 2024년 7월, 이 정부 출범(2025년 6월) 전에 시작됐다. 그대로 적는다.
 * ★ 출생아는 여전히 사망자보다 적다(자연감소). 2019년 수준에도 아직 못 미친다.
 * ★ 기본계획은 2026~2030년 계획이다. 결과가 아니다.
 * ★ 정책 팩트 `policy:population-strategy`와 같은 출처를 일부 쓴다.
 * ★ 2026-11-02 처음 작성. claim마다 인용한 보도·정책브리핑 본문과 대조했다.
 *   KOSIS 원표와는 아직 대조하지 않았다.
 */
const raw: AchievementInput = {
  id: "birth-rebound",
  slug: "birth-rebound",
  title: "출생아 26개월 연속 증가",
  subtitle: "8월 출생아 7년 만에 최다, 1~8월 증가율 역대 최고",
  kicker: "민생·복지 · 인구",
  categories: ["welfare"],
  summary:
    "2026년 8월 출생아는 2만 3,703명으로 1년 전보다 13.0% 늘어 8월 기준 2019년 이후 가장 많았다. " +
    "출생아는 2024년 7월부터 26개월 연속 늘었고, 1~8월 누적은 19만 3,783명으로 증가율(14.5%)이 역대 최고였다. " +
    "다만 사망자가 여전히 더 많아 인구는 자연감소 중이고, 증가 원인은 통계로 밝혀지지 않았다. 정부는 10월 제1차 국가인구전략 기본계획을 내놓았다.",
  type: "event",
  publishStatus: "published",
  featured: true,
  lifeQuestion: "아기가 정말 늘고 있나요? 정부 정책 덕분인가요?",
  sourceNote:
    "2026년 11월 2일 기준입니다. 국가데이터처 「2026년 8월 인구동향」을 전한 보도 두 건과 정책브리핑을 대조했습니다. KOSIS 원표와는 아직 대조하지 않았습니다. " +
    "증가 원인을 정책 효과로 가른 자료는 찾지 못했습니다. 반등은 이 정부 출범 전인 2024년 7월에 시작됐습니다.",
  headlineKeyNumberId: "br-streak-n",
  keyNumbers: [
    { id: "br-streak-n", label: "출생아 연속 증가", value: "26", unit: "개월", caption: "2024년 7월부터 · 전년 같은 달 대비", claimId: "br-streak" },
    { id: "br-aug-n", label: "8월 출생아", value: "23,703", unit: "명", caption: "+13.0% · 8월 기준 2019년 이후 최다", claimId: "br-aug" },
    { id: "br-cum-n", label: "1~8월 누적 증가율", value: "14.5", unit: "%", caption: "19만 3,783명 · 역대 최고 증가율", claimId: "br-cum" },
    { id: "br-tfr-n", label: "8월 합계출산율", value: "0.87", unit: "명", caption: "1년 전보다 0.09명 높음", claimId: "br-tfr" },
  ],
  timeline: [
    { id: "br-t-start", date: "2024-07", datePrecision: "month", title: "출생아 증가 시작", summary: "전년 같은 달보다 많아지기 시작했다. 이 정부 출범 전이다.", claimIds: ["br-streak"] },
    { id: "br-t-2025", date: "2025", datePrecision: "year", title: "2025년 출생아 25만 4,341명", summary: "6.7% 증가, 합계출산율 0.80명. 2년 연속 증가.", claimIds: ["br-2025"] },
    { id: "br-t-law", date: "2026-06", datePrecision: "month", title: "인구전략기본법 전부개정", summary: "저출산·고령사회기본법을 바꿨다.", claimIds: ["br-plan"] },
    { id: "br-t-plan", date: "2026-10-14", datePrecision: "day", title: "제1차 국가인구전략 기본계획 발표", summary: "2026~2030년. 출산율 대신 삶의 만족도와 경제활동참가율을 지표로.", claimIds: ["br-plan"] },
    { id: "br-t-aug", date: "2026-10-28", datePrecision: "day", title: "8월 인구동향 발표", summary: "8월 출생아 7년 만에 최다, 26개월 연속 증가.", claimIds: ["br-aug", "br-streak", "br-cum"] },
  ],
  eli5: {
    intro: "아기가 얼마나 늘었는지, 아직 무엇이 모자란지 봐요.",
    scenes: [
      {
        id: "br-e-streak", title: "26달째 작년보다 많이 태어났어요",
        say: "2024년 7월부터 매달, 1년 전 같은 달보다 아기가 더 많이 태어났어요.",
        art: "br-streak", fact: { value: "26개월 연속", tone: "ice" }, claimIds: ["br-streak"],
      },
      {
        id: "br-e-aug", title: "8월엔 7년 만에 가장 많았어요",
        say: "올해 8월에 2만 3,703명이 태어났어요. 8월만 놓고 보면 2019년 이후 가장 많아요.",
        art: "br-aug", fact: { value: "2만 3,703명", tone: "ice" }, claimIds: ["br-aug"],
      },
      {
        id: "br-e-cum", title: "올해 늘어난 속도는 역대 최고예요",
        say: "1월부터 8월까지 19만 3,783명이 태어났어요. 작년 같은 때보다 14.5% 많아, 증가율로는 가장 높아요.",
        art: "br-cum", claimIds: ["br-cum"],
      },
      {
        id: "br-e-natural", title: "그래도 떠나는 사람이 더 많아요",
        say: "8월에 태어난 아기보다 돌아가신 분이 6,605명 많았어요. 인구는 아직 줄고 있어요.",
        art: "br-natural", claimIds: ["br-natural"],
      },
      {
        id: "br-e-why", title: "왜 늘었는지는 아직 몰라요",
        say: "결혼과 30대 인구가 늘고 출산 인식이 바뀌었다는 분석이 있어요. 통계 발표 자체는 이유를 밝히지 않아요.",
        art: "br-why", claimIds: ["br-cause", "br-marriage", "br-2025"],
      },
    ],
    caveat: {
      text: "아기가 늘기 시작한 건 2024년 7월, 이 정부 전이에요. 정책 덕분인지는 아직 가를 자료가 없고, 2019년 수준에는 아직 못 미쳐요.",
      claimIds: ["br-streak", "br-2025", "br-cum"],
    },
  },
  scenes: [{
    id: "br-explainer", kind: "explainer", heading: "얼마나 늘었고, 무엇이 남았나", lede: "몇 해 전과 견주고, 사망과 견주고, 정부 계획이 어디까지 왔는지 봅니다.",
    claimIds: ["br-cum", "br-natural", "br-plan"],
    explainer: {
      chapters: [
        {
          id: "br-ch-years", question: "몇 해 전과 비교하면 어느 정도인가요?", heading: "작년보다 많고, 2019년보다는 적다",
          steps: [
            { id: "br-step-before", label: "2019·2025년", caption: "1~8월 출생아는 2019년 20만 8,018명, 2025년 16만 9,211명이었다." },
            { id: "br-step-2026", label: "2026년", caption: "2026년 1~8월은 19만 3,783명으로 14.5% 늘었다. 2019년 이후 가장 많지만 2019년에는 못 미친다." },
          ],
          visual: {
            kind: "rank-bars", unit: "명", periodLabel: "1~8월 누적 출생아",
            bars: [
              { id: "br-bar-2019", label: "2019년", value: 208018 },
              { id: "br-bar-2026", label: "2026년", value: 193783, focus: true },
              { id: "br-bar-2025", label: "2025년", value: 169211 },
            ],
            note: "국가데이터처 「2026년 8월 인구동향」을 전한 보도 기준입니다.",
          },
          takeaway: "올해는 2019년 이후 가장 많이 태어났지만 2019년 수준에는 아직 못 미친다.", claimId: "br-cum",
        },
        {
          id: "br-ch-natural", question: "출생이 사망을 따라잡았나요?", heading: "아직 사망이 더 많다",
          steps: [
            { id: "br-step-death", label: "사망", caption: "2026년 8월 사망자는 3만 308명이었다." },
            { id: "br-step-birth", label: "출생", caption: "같은 달 출생아는 2만 3,703명이었다." },
            { id: "br-step-gap", label: "자연감소", caption: "6,605명이 자연감소했다. 1년 전보다 감소 폭은 1,313명 줄었다." },
          ],
          visual: {
            kind: "seats", unit: "명", per: 500,
            capacity: { label: "8월 사망자", value: 30308 },
            filled: { label: "8월 출생아", value: 23703 },
            gapLabel: "자연감소",
          },
          takeaway: "출생은 늘었지만 인구는 아직 자연감소 중이다.", claimId: "br-natural",
        },
        {
          id: "br-ch-plan", question: "정부는 무엇을 하고 있나요?", heading: "법을 바꾸고 5년 계획을 냈다",
          steps: [
            { id: "br-step-law", label: "법", caption: "2026년 6월 저출산·고령사회기본법을 인구전략기본법으로 전부개정했다." },
            { id: "br-step-plan", label: "계획", caption: "10월 14일 제1차 국가인구전략 기본계획(2026~2030)을 발표했다. 출산율 대신 삶의 만족도와 경제활동참가율을 지표로 삼았다." },
            { id: "br-step-next", label: "실행", caption: "계획은 2030년까지다. 결과는 아직 평가할 수 없다." },
          ],
          visual: { kind: "stage-gates", asOfLabel: "2026.11.2 기준", pendingLabel: "계획 기간",
            stages: [
              { id: "br-gate-law", label: "인구전략기본법", note: "26.6", status: "done" },
              { id: "br-gate-plan", label: "기본계획 발표", note: "26.10.14", status: "done" },
              { id: "br-gate-run", label: "계획 실행", note: "~2030", status: "pending" },
            ] },
          takeaway: "법과 계획은 나왔다. 그 계획이 출생에 미칠 효과는 아직 알 수 없다.", claimId: "br-plan",
        },
      ],
    },
  }],
  graph: {
    note: "개인 대신 통계와 정책에 관여한 주체를 표시했습니다.",
    entities: [
      { id: "br-gov", name: "정부", kind: "government", description: "인구전략위원회 · 국가인구전략 기본계획", isFocus: true },
      { id: "br-stat", name: "국가데이터처", kind: "government", description: "인구동향 통계 발표" },
      { id: "br-families", name: "혼인·출산 가구", kind: "group", description: "30대 인구 · 신혼·양육 가구" },
    ],
    relations: [
      { id: "br-r-plan", fromId: "br-gov", toId: "br-families", label: "공공주택 57만 1천 호, 맞춤형 육아휴직·유연근무 계획", startDate: "2026-10-14", startPrecision: "day", assertionType: "FACT", claimIds: ["br-plan-detail"] },
      { id: "br-r-stat", fromId: "br-stat", toId: "br-families", label: "8월 출생아 2만 3,703명, 26개월 연속 증가", startDate: "2026-10-28", startPrecision: "day", assertionType: "FACT", claimIds: ["br-aug", "br-streak"] },
    ],
  },
  counterpoints: [
    {
      id: "br-cp-gov",
      question: "정부 정책 덕분인가요?",
      response: "가를 수 없다. 출생아 증가는 이 정부 출범 전인 2024년 7월에 시작됐고, 국가데이터처 발표는 원인을 따로 밝히지 않았다. 보도는 혼인과 30대 인구 증가, 출산 인식 변화를 배경으로 든다. 정부의 국가인구전략 기본계획은 2026년 10월에 나온 5년 계획이라 아직 결과로 볼 수 없다.",
      claimIds: ["br-streak", "br-2025", "br-cause", "br-plan"],
    },
    {
      id: "br-cp-pop",
      question: "그럼 인구가 늘고 있나요?",
      response: "아니다. 8월에도 사망자(3만 308명)가 출생아보다 많아 6,605명 자연감소했고, 1~8월 누적 자연감소는 4만 4,269명이다. 감소 폭이 줄었을 뿐이다.",
      claimIds: ["br-natural"],
    },
    {
      id: "br-cp-marriage",
      question: "결혼도 계속 늘고 있나요?",
      response: "올해 누적으로는 늘었지만 8월은 줄었다. 1~8월 혼인은 16만 5,874건으로 5.2% 늘었고, 8월 혼인은 1만 9,218건으로 1.2% 줄어 3개월 만에 감소했다.",
      claimIds: ["br-marriage"],
    },
    {
      id: "br-cp-plan",
      question: "정부 계획에 대한 평가는요?",
      response: "출산율 대신 삶의 질을 지표로 삼은 점이 특징이다. 인구학자 조영태 서울대 교수는 10년 뒤 달라질 연령·계층별 인구에 맞춘 개별 정책이 보이지 않는다고 지적했고, 지방을 떠난 청년을 지역 돌봄 일자리로 유도하는 방식은 실효성이 낮다는 비판도 나왔다.",
      claimIds: ["br-plan", "br-plan-critique"],
    },
  ],
  claims: [
    {
      id: "br-aug",
      text: "국가데이터처 「2026년 8월 인구동향」에 따르면 8월 출생아는 2만 3,703명으로 1년 전보다 13.0% 늘었다. 8월 기준으로 2019년(2만 4,371명) 이후 가장 많고, 증가율은 2007년(17.6%)에 이어 8월 기준 역대 2위다.",
      assertionType: "FACT",
      sourceIds: ["src-br-sbs-1028", "src-br-ksw-1028"],
      verified: true,
    },
    {
      id: "br-streak",
      text: "출생아 수는 2024년 7월부터 2026년 8월까지 26개월 연속 전년 같은 달보다 많았다.",
      assertionType: "FACT",
      sourceIds: ["src-br-ksw-1028"],
      verified: true,
    },
    {
      id: "br-cum",
      text: "2026년 1~8월 누적 출생아는 19만 3,783명으로 1년 전(16만 9,211명)보다 14.5% 늘어 같은 기간 역대 가장 높은 증가율을 기록했다. 2019년(20만 8,018명) 이후 가장 많은 수준이다.",
      assertionType: "FACT",
      sourceIds: ["src-br-sbs-1028", "src-br-ksw-1028"],
      verified: true,
    },
    {
      id: "br-tfr",
      text: "2026년 8월 합계출산율은 0.87명으로 1년 전보다 0.09명 높았다.",
      assertionType: "FACT",
      sourceIds: ["src-br-sbs-1028", "src-br-ksw-1028"],
      verified: true,
    },
    {
      id: "br-natural",
      text: "2026년 8월 사망자는 3만 308명으로 4.9% 늘어 출생아보다 6,605명 많았다(자연감소). 자연감소 폭은 1년 전보다 1,313명 줄었다. 1~8월 누적 자연감소는 4만 4,269명이다.",
      assertionType: "FACT",
      sourceIds: ["src-br-ksw-1028"],
      verified: true,
    },
    {
      id: "br-marriage",
      text: "2026년 8월 혼인은 1만 9,218건으로 1.2% 줄어 3개월 만에 감소했다. 1~8월 누적 혼인은 16만 5,874건으로 5.2% 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-br-ksw-1028", "src-br-sbs-1028"],
      verified: true,
    },
    {
      id: "br-cause",
      text: "SBS Biz는 최근 혼인과 30대 인구 증가세, 출산에 대한 인식의 긍정적 변화가 출생아 증가의 배경이라고 보도했다.",
      assertionType: "INTERPRETATION",
      assertedBy: "SBS Biz",
      sourceIds: ["src-br-sbs-1028"],
      verified: true,
    },
    {
      id: "br-2025",
      text: "2025년 출생아는 25만 4,341명으로 전년보다 6.7% 늘어 2년 연속 증가했고, 합계출산율은 0.80명으로 0.05명 올랐다. 국가데이터처 발표는 증가 원인을 따로 밝히지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-br-korea-0826"],
      verified: true,
    },
    {
      id: "br-plan",
      text: "정부는 2026년 10월 14일 제1차 국가인구전략 기본계획(2026~2030)을 발표했다. 합계출산율 대신 삶의 만족도(2025년 6.6점→2030년 7.0점)와 경제활동참가율(71.8%→74.0%)을 핵심 성과지표로 삼았다. 앞서 2026년 6월 저출산·고령사회기본법이 인구전략기본법으로 전부개정됐다.",
      assertionType: "FACT",
      sourceIds: ["src-br-khan-1014", "src-br-ajunews-1014"],
      verified: true,
    },
    {
      id: "br-plan-detail",
      text: "기본계획에는 청년·신혼·양육가구 대상 공공주택 57만 1천 호 공급, 맞춤형 육아휴직과 유연근무, 인구감소지역의 청년 돌봄 일자리 모델이 들어 있다. 상당수는 부처가 이미 시행하거나 발표한 정책이다.",
      assertionType: "FACT",
      sourceIds: ["src-br-khan-1014", "src-br-ajunews-1014"],
      verified: true,
    },
    {
      id: "br-plan-critique",
      text: "조영태 서울대 교수는 10년 뒤 연령·계층별 인구 규모와 세대 특성이 달라지는데 이에 맞춘 개별 정책이 보이지 않는다고 지적했다. 이미 지방을 떠난 청년을 지역 노인 돌봄 일자리로 유도하는 방식은 실효성이 낮다는 비판도 나왔다.",
      assertionType: "OPINION",
      assertedBy: "조영태 서울대 교수 등",
      sourceIds: ["src-br-khan-1014"],
      verified: true,
    },
  ],
  sources: [
    { id: "src-br-sbs-1028", title: "8월 출생아 2만4천명, 7년 만에 최대…연간 누적 20만명 육박", publisher: "SBS Biz", url: "https://biz.sbs.co.kr/amp/article/20000342664", publishedAt: "2026-10-28", type: "press", license: "link-only" },
    { id: "src-br-ksw-1028", title: "출생아 26개월 연속 증가…8월 기준 7년 만에 최다", publisher: "한국사회복지저널", url: "https://www.ksw-news.com/news/articleView.html?idxno=3053573", publishedAt: "2026-10-28", type: "press", license: "link-only" },
    { id: "src-br-korea-0826", title: "지난해 출생아 25만 4300명, 6.7% ↑…합계출산율 0.8명대 회복", publisher: "대한민국 정책브리핑(국가데이터처)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148970652", publishedAt: "2026-08-26", type: "statistics", license: "public" },
    { id: "src-br-khan-1014", title: "출산율 대신 '삶의 질' 내건 정부 인구전략···\"미래 세대 대응 전략은 부족\"", publisher: "경향신문", url: "https://www.khan.co.kr/article/202610141524021/", publishedAt: "2026-10-14", type: "press", license: "link-only" },
    { id: "src-br-ajunews-1014", title: "李대통령, 첫 인구전략위 주재…저출생 넘어 '인구의 판' 바꾼다", publisher: "아주경제", url: "https://www.ajunews.com/view/20261014151658792", publishedAt: "2026-10-14", type: "press", license: "link-only" },
  ],
};

export const birthRebound = achievementSchema.parse(raw);
