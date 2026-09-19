import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 경기도 청정계곡 — 다들 불가능하다던 일.
 *
 * 책(『밍밍 잼칠라 이장님』 2학기 8)은 "계곡 정비" 한 줄과 "다들 불가능하다고
 * 했지. 하지만 꾸준한 토론과 설득으로 결국엔 해냈네"라고만 적는다. 수치가 없다.
 * 그래서 경기도 보도자료와 당시 보도로 수치를 붙였다.
 *
 * ★ 분모가 자란다.
 *   조사 범위가 176개 하천(2019.12) → 187개(2020.4) → 234곳(2021.6)으로 넓어져서
 *   적발 수도 1,392 → 1,436 → 1,601로 늘었다. 그래서 "몇 개 중 몇 개"를 시점마다
 *   따로 적는다. 마지막 분모로 앞 시점의 비율을 다시 계산하면 그건 자료가 아니다.
 *
 * ★ 이 업적의 논지는 '철거'가 아니라 '자진철거'다.
 *   2020년 4월 기준 철거된 1,347곳 가운데 1,298곳이 스스로 뜯은 것이고
 *   행정대집행은 49곳이다. 힘으로 밀어붙인 것이 아니라는 것이 이 정책의 핵심이고,
 *   구성 씬이 그 비율을 그린다.
 *
 * ★ 강제철거 건수는 발표 시점마다 다르게 알려졌다.
 *   여기서는 경기도가 2020년 4월에 발표한 49곳을 싣는다. 그보다 뒤에 다른 수가
 *   언급된 적이 있으나 어느 쪽이 무엇을 센 것인지 확인하지 못했다. 확인한 것만
 *   싣고, 확인하지 못한 사정은 sourceNote에 적는다.
 */

const raw: AchievementInput = {
  id: "gyeonggi-valley",
  slug: "gyeonggi-valley",
  title: "경기도 청정계곡",
  subtitle: "불가능하다던 일을, 대부분 스스로 뜯게 했다",
  kicker: "주요 업적",
  category: "institution",
  summary:
    "계곡과 하천을 막고 있던 평상과 가건물을 걷어내는 일이다. 2019년 6월 시작해 " +
    "2021년 6월까지 25개 시군 234곳에서 적발한 1,601개 가운데 1,576개를 정비했다. " +
    "눈여겨볼 것은 철거한 방법이다. 2020년 4월 기준으로 철거된 1,347곳 중 1,298곳이 " +
    "영업주가 스스로 뜯은 것이고, 행정대집행은 49곳이었다.",
  type: "event",
  publishStatus: "published",
  featured: true,
  sourceNote:
    "시점별 수치는 경기도 보도자료와 경기도 발표를 옮긴 보도로 확인했습니다. " +
    "다만 행정대집행 건수는 발표 시점에 따라 다르게 알려진 적이 있어, 여기서는 " +
    "경기도가 2020년 4월에 밝힌 49곳을 싣습니다. 복원 면적과 사후 투입 예산은 " +
    "아직 1차 자료로 대조하지 못했습니다.",

  headlineKeyNumberId: "kn-removed",

  scenes: [
    {
      id: "progress",
      kind: "quantity-track",
      heading: "2년에 걸쳐 걷어냈습니다",
      lede:
        "경기도가 수치를 밝힌 시점만 짚습니다. 스크롤하면 그 사이를 지나갑니다.",
      claimIds: ["claim-start", "claim-2019", "claim-2020", "claim-2021"],
      track: {
        label: "정비를 마친 불법시설",
        unit: "개",
        direction: "up",
        max: 1601,
        note:
          "조사 범위가 넓어지면서 적발 수(분모)도 함께 늘었다. 176개 하천 1,392개소 → " +
          "187개 하천 1,436곳 → 234곳 1,601개. 그래서 비율은 시점마다 그때의 분모로 적는다.",
        checkpoints: [
          {
            id: "cp-start",
            displayDate: "2019년 6월",
            title: "계곡을 도민에게 돌려주겠다",
            amount: 0,
            caption:
              "청정계곡 도민환원 사업이 시작됐습니다. 그해 9월부터 시·군과 함께 불법점유 시설물에 대한 조치에 들어갔습니다.",
            art: "valley-blocked",
            claimId: "claim-start",
          },
          {
            id: "cp-2019",
            displayDate: "2019년 12월 11일",
            title: "176개 하천에서 1,021개소",
            amount: 1021,
            caption:
              "25개 시군 176개 하천에서 적발한 1,392개소 가운데 1,021개소를 철거했습니다. 그때 기준 73.3%입니다.",
            art: "valley-notice",
            claimId: "claim-2019",
          },
          {
            id: "cp-2020",
            displayDate: "2020년 4월 3일",
            title: "1,347곳, 그중 1,298곳은 스스로",
            amount: 1347,
            caption:
              "187개 하천에서 적발한 1,436곳 중 1,347곳을 철거했습니다. 93.8%입니다. 이 가운데 행정대집행은 49곳이었습니다.",
            art: "valley-selfremove",
            claimId: "claim-2020",
          },
          {
            id: "cp-2021",
            displayDate: "2021년 6월 30일",
            title: "234곳에서 1,576개",
            amount: 1576,
            caption:
              "적발한 1,601개 가운데 1,576개를 정비했습니다. 98.7%입니다. 남은 25개는 실제 주거시설 18개와 소송 중인 7개였습니다.",
            art: "valley-open",
            claimId: "claim-2021",
          },
        ],
      },
    },
    {
      id: "how",
      kind: "composition",
      heading: "어떻게 걷어냈나",
      lede:
        "이 정책에서 눈여겨볼 것은 철거한 개수가 아니라 철거한 방법입니다. 2020년 4월 기준입니다.",
      claimIds: ["claim-2020"],
      composition: {
        total: 1347,
        unit: "곳",
        totalLabel: "그때까지 철거된 시설",
        claimId: "claim-2020",
        note:
          "경기도가 2020년 4월 9일 밝힌 수치다(기준일 4월 3일). 이 밖에 실제 주거용 53곳은 " +
          "철거 대상에서 제외됐고, 붕괴 우려로 손대지 못한 1곳이 있었다.",
        groups: [
          {
            id: "co-self",
            label: "영업주가 스스로 철거",
            amount: 1298,
            sharePercent: 96.4,
            tone: "primary",
            detail: "설득과 지원으로",
          },
          {
            id: "co-force",
            label: "행정대집행",
            amount: 49,
            sharePercent: 3.6,
            tone: "accent",
            detail: "끝내 응하지 않은 곳",
          },
        ],
      },
    },
  ],

  shorts: [
    {
      id: "short-gv-01",
      title: "계곡을 막던 1,576개 평상, 어떻게 치웠을까",
      summary:
        "철거한 개수가 아니라 방법이 요지입니다. 2020년 4월 기준 철거된 1,347곳 중 1,298곳이 자진철거였습니다.",
      youtubeId: "pDw00qIESxU",
      claimIds: ["claim-start", "claim-2020", "claim-2021"],
      publishedAt: "2026-09-19",
    },
  ],

  eli5: {
    intro:
      "계곡에 평상이 빼곡히 놓여 있었어요. 물에 발도 못 담갔죠. 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-gv-blocked",
        title: "계곡이 막혀 있었어요",
        say: "계곡마다 평상과 가건물이 놓여 있었어요. 자리를 잡으려면 음식을 시켜야 했고, 그냥 물놀이만 하기는 어려웠어요.",
        art: "valley-blocked",
        fact: { value: "1,601개", tone: "warm" },
        claimIds: ["claim-2021"],
      },
      {
        id: "e-gv-public",
        title: "그런데 계곡은 원래 모두의 것이에요",
        say: "하천과 계곡은 나라 땅이에요. 누구도 제 것처럼 막아 둘 수 없어요. 오래 그래 왔다고 해서 제 것이 되지는 않아요.",
        art: "valley-public",
        fact: { value: "234곳", tone: "ice" },
        claimIds: ["claim-2021"],
      },
      {
        id: "e-gv-notice",
        title: "먼저 알리고 설득했어요",
        say: "곧바로 부수지 않았어요. 시·군과 함께 찾아가 알리고, 스스로 걷으면 돕겠다고 했어요.",
        art: "valley-notice",
        fact: { value: "2019년 9월", tone: "ice" },
        claimIds: ["claim-start", "claim-2019"],
      },
      {
        id: "e-gv-self",
        title: "대부분은 스스로 뜯었어요",
        say: "철거된 곳 열 중 아홉은 영업하던 분들이 직접 걷어낸 거예요. 힘으로 밀어붙인 게 아니에요.",
        art: "valley-selfremove",
        fact: { value: "1,298곳", tone: "ice" },
        claimIds: ["claim-2020"],
      },
      {
        id: "e-gv-force",
        title: "끝내 안 되면 행정이 걷어냈어요",
        say: "아무리 말해도 응하지 않은 곳은 행정이 직접 걷어냈어요. 그런 곳은 마흔아홉 곳이었어요.",
        art: "valley-force",
        fact: { value: "49곳", tone: "warm" },
        claimIds: ["claim-2020"],
      },
      {
        id: "e-gv-open",
        title: "계곡이 다시 열렸어요",
        say: "2021년 6월까지 적발한 1,601개 중 1,576개를 정비했어요. 이제 돈을 내지 않아도 계곡에 앉을 수 있어요.",
        art: "valley-open",
        fact: { value: "98.7%", tone: "ice" },
        claimIds: ["claim-2021"],
      },
    ],
    caveat: {
      text:
        "아직 남은 곳도 있어요. 2021년 6월 기준으로 25개가 남아 있었는데, 열여덟 개는 사람이 실제로 살고 있는 집이었고 일곱 개는 재판 중이었어요.",
      claimIds: ["claim-2021"],
    },
  },

  keyNumbers: [
    {
      id: "kn-removed",
      label: "정비를 마친 불법시설",
      value: "1,576",
      unit: "개",
      caption: "적발 1,601개의 98.7% · 2021년 6월 30일 기준",
      claimId: "claim-2021",
    },
    {
      id: "kn-self",
      label: "영업주가 스스로 철거",
      value: "1,298",
      unit: "곳",
      caption: "2020년 4월 기준 · 행정대집행은 49곳",
      claimId: "claim-2020",
    },
    {
      id: "kn-places",
      label: "정비한 계곡·하천",
      value: "234",
      unit: "곳",
      caption: "25개 시군",
      claimId: "claim-2021",
    },
  ],

  timeline: [
    {
      id: "gv-start",
      date: "2019-06",
      displayDate: "2019년 6월",
      datePrecision: "month",
      title: "청정계곡 도민환원 사업 시작",
      summary: "계곡과 하천의 불법점유 시설물을 걷어내는 일에 착수했다.",
      claimIds: ["claim-start"],
    },
    {
      id: "gv-enforce",
      date: "2019-09",
      displayDate: "2019년 9월",
      datePrecision: "month",
      title: "시·군 합동 조치 개시",
      summary: "시·군과 협력해 하천·계곡 일원의 불법점유 시설물에 대한 조치에 들어갔다.",
      claimIds: ["claim-start"],
    },
    {
      id: "gv-2019",
      date: "2019-12-11",
      displayDate: "2019년 12월 11일",
      datePrecision: "day",
      title: "176개 하천에서 73.3% 철거",
      summary: "25개 시군 176개 하천의 1,392개소 중 1,021개소를 철거했다고 밝혔다.",
      claimIds: ["claim-2019"],
    },
    {
      id: "gv-2020",
      date: "2020-04-09",
      displayDate: "2020년 4월 9일",
      datePrecision: "day",
      title: "93.8% 철거, 대부분 자진철거",
      summary:
        "187개 하천 1,436곳 중 1,347곳을 철거했고, 그중 1,298곳이 자진철거였다고 밝혔다.",
      claimIds: ["claim-2020"],
    },
    {
      id: "gv-2021",
      date: "2021-06-30",
      displayDate: "2021년 6월 30일",
      datePrecision: "day",
      title: "98.7% 정비, 남은 25개",
      summary:
        "234곳에서 적발한 1,601개 중 1,576개를 정비했다. 남은 25개는 실주거 18개와 소송 중 7개였다.",
      claimIds: ["claim-2021"],
    },
  ],

  graph: {
    note:
      "누가 무엇을 걷어냈고 그 자리가 누구에게 돌아갔는지를 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "gyeonggi", name: "경기도", kind: "government", isFocus: true,
        description: "사업을 결정하고 시군과 함께 추진한 주체" },
      { id: "cities", name: "25개 시·군", kind: "government",
        description: "현장 단속과 철거를 함께 집행" },
      { id: "owners", name: "계곡 영업주", kind: "group",
        description: "시설을 놓고 영업하던 쪽. 대부분 스스로 걷었다" },
      { id: "streams", name: "계곡·하천 234곳", kind: "project",
        description: "정비 대상이 된 국유 하천과 계곡" },
      { id: "residents", name: "도민", kind: "group",
        description: "정비된 계곡을 돌려받은 쪽" },
      { id: "voluntary", name: "자진철거", kind: "project",
        description: "설득과 지원으로 스스로 걷어낸 방식" },
      { id: "enforcement", name: "행정대집행", kind: "project",
        description: "끝내 응하지 않은 곳에 행정이 직접 집행" },
    ],
    relations: [
      {
        id: "gv-r-occupy",
        fromId: "owners",
        toId: "streams",
        label: "평상과 가건물로 계곡과 하천을 막고 영업했다.",
        startDate: "2019-06",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-start"],
      },
      {
        id: "gv-r-launch",
        fromId: "gyeonggi",
        toId: "streams",
        label: "계곡을 도민에게 돌려주겠다며 정비에 착수했다.",
        startDate: "2019-06",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-start"],
      },
      {
        id: "gv-r-joint",
        fromId: "gyeonggi",
        toId: "cities",
        label: "시·군과 협력해 현장 조치에 들어갔다.",
        startDate: "2019-09",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-start"],
      },
      {
        id: "gv-r-self",
        fromId: "owners",
        toId: "voluntary",
        label: "철거된 1,347곳 중 1,298곳은 영업주가 스스로 걷어낸 것이다.",
        startDate: "2020-04-09",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-2020"],
      },
      {
        id: "gv-r-force",
        fromId: "gyeonggi",
        toId: "enforcement",
        label: "끝내 응하지 않은 49곳은 행정대집행으로 걷어냈다.",
        startDate: "2020-04-09",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-2020"],
      },
      {
        id: "gv-r-return",
        fromId: "streams",
        toId: "residents",
        label: "적발한 1,601개 중 1,576개를 정비해 계곡을 열었다.",
        startDate: "2021-06-30",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-2021"],
      },
    ],
  },

  counterpoints: [
    {
      id: "gv-cp-livelihood",
      question: "오래 장사하던 사람들의 생계를 빼앗은 것 아닌가?",
      response:
        "부담이 없었다고 말할 수 없다. 다만 대상은 국유인 하천과 계곡을 점유한 시설이었고, 경기도는 곧바로 철거하는 대신 시·군과 함께 알리고 자진철거를 지원하는 방식을 먼저 썼다. 그 결과 2020년 4월 기준 철거된 1,347곳 중 1,298곳이 자진철거였고 행정대집행은 49곳이었다. 실제 주거용 53곳은 철거 대상에서 제외됐다.",
      claimIds: ["claim-2020", "claim-start"],
    },
    {
      id: "gv-cp-force",
      question: "결국 힘으로 밀어붙인 것 아닌가?",
      response:
        "경기도가 밝힌 수치로는 그렇게 보기 어렵다. 2020년 4월 기준 행정대집행은 철거된 곳의 3.6%였다. 다만 행정대집행 건수는 이후 발표에서 다르게 알려진 적이 있고, 어느 쪽이 무엇을 센 것인지 확인하지 못했다. 여기서는 경기도가 당시 밝힌 49곳을 싣는다.",
      claimIds: ["claim-2020"],
    },
    {
      id: "gv-cp-done",
      question: "정말 다 끝난 것인가?",
      response:
        "아니다. 2021년 6월 30일 기준으로 25개가 남아 있었다. 열여덟 개는 사람이 실제로 살고 있는 시설이라 이주를 기다려야 했고, 일곱 개는 소송이 진행 중이었다. 경기도는 그해 안에 마무리하겠다고 밝혔다.",
      claimIds: ["claim-2021"],
    },
  ],

  claims: [
    {
      id: "claim-start",
      text:
        "경기도는 2019년 6월부터 청정계곡 도민환원 사업을 추진했고, 그해 9월부터 시·군과 협력해 하천·계곡 일원의 불법점유 시설물에 대한 조치에 들어갔다.",
      assertionType: "FACT",
      sourceIds: ["src-gg-2019", "src-book"],
      verified: true,
    },
    {
      id: "claim-2019",
      text:
        "2019년 12월 11일 경기도는 25개 시군 176개 하천에서 적발한 불법시설 1,392개소 가운데 1,021개소를 철거해 철거율이 73.3%라고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-gg-2019"],
      verified: true,
    },
    {
      id: "claim-2020",
      text:
        "경기도가 2020년 4월 9일 밝힌 4월 3일 기준 집계에 따르면, 25개 시군 187개 하천에서 적발한 1,436곳 중 1,347곳(93.8%)이 철거됐다. 이 가운데 1,298곳은 자진철거였고 행정대집행은 49곳이었다. 실제 주거용 53곳은 철거 대상에서 제외됐다.",
      assertionType: "FACT",
      sourceIds: ["src-hkbs-2020"],
      verified: true,
    },
    {
      id: "claim-2021",
      text:
        "2021년 6월 30일 기준 경기도는 25개 시군 234곳의 계곡·하천에서 적발한 불법시설 1,601개 가운데 1,576개(98.7%)를 정비했다. 남은 25개는 실제 주거시설 18개와 소송이 진행 중인 7개였다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeongin-2021"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-gg-2019",
      title: "道, 계곡·하천 불법시설 73% 철거…자진철거는 대폭 지원, 미이행 시 강력 처벌",
      url: "https://gnews.gg.go.kr/news/news_detail.do?number=201912111432407418C048&s_code=C048",
      publisher: "경기도 뉴스포털",
      publishedAt: "2019-12-11",
      type: "official",
      license: "public",
      quote:
        "깨끗한 계곡을 도민들에게 돌려드리겠다는 이재명 지사의 정책 의지에 따라 " +
        "올해 9월부터 시·군과 협력해 하천·계곡 일원의 불법점유 시설물에 대한 강력한 조치를 취해 왔다",
    },
    {
      id: "src-hkbs-2020",
      title: "경기도 “계곡불법 남은 35곳, 예외 없이 강제 철거”",
      url: "https://www.hkbs.co.kr/news/articleView.html?idxno=565613",
      publisher: "환경일보",
      publishedAt: "2020-04-09",
      type: "press",
      license: "quotable",
      quote:
        "4월 3일 기준 25개 시·군 187개 하천에서 1,436곳이 적발돼 1,347곳(93.8%)이 철거됐다. " +
        "자진 철거 1,298곳, 행정대집행 49곳이다.",
    },
    {
      id: "src-kyeongin-2021",
      title: "경기도, 계곡·하천 불법시설 98.7% 철거… 정비사업 연내 마무리",
      url: "https://www.kyeongin.com/article/1556835",
      publisher: "경인일보",
      publishedAt: "2021-06-30",
      type: "press",
      license: "quotable",
      quote:
        "2019년 6월부터 25개 시군 234곳의 계곡·하천에서 불법시설 1,601개를 적발해 " +
        "1,576개(98.7%)를 철거했다. 남은 25개 중 18개는 실주거시설, 7개는 소송이 진행 중이다.",
    },
    {
      id: "src-book",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 8",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "8. 계곡 정비 — 다들 불가능하다고 했지. 괜히 건들지 말라고도 했고. " +
        "하지만 꾸준한 토론과 설득으로 결국엔 해냈네. (이 책에는 수치가 없어 " +
        "경기도 자료로 채웠다.)",
    },
  ],
};

export const gyeonggiValley = achievementSchema.parse(raw);
