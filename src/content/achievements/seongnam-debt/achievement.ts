import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 성남시 모라토리엄 — 선언에서 채무 제로까지.
 *
 * 책(『밍밍 잼칠라 이장님』 21)은 "취임 3년 만에 성남시 부채 5,400억 청산"으로
 * 적는다. 수치가 헐겁다. 실제로는 3년 6개월에 7,285억이고, 5,400억은 그 가운데
 * 판교특별회계 전입금 몫이다. 책을 출처에서 빼지 않되 숫자는 고쳐 싣는다 —
 * 유리하게 부풀린 것도 아니고 오히려 작게 적힌 것이지만, 어느 쪽이든 틀린 수는
 * 그대로 두면 안 된다.
 *
 * 두 개의 끝점이 있다. 섞으면 안 된다.
 *   2014년 1월 — 모라토리엄이 대상으로 삼은 '비공식 부채' 7,285억 청산
 *   2018년 1월 — 일반회계 채무까지 상환한 '채무 제로'
 * 서로 다른 셈이므로 claim을 나누고 각각의 출처를 붙였다.
 */

const raw: AchievementInput = {
  id: "seongnam-debt",
  slug: "seongnam-debt",
  title: "성남시 모라토리엄",
  subtitle: "못 갚겠다고 먼저 말한 뒤, 3년 6개월 만에 갚았다",
  kicker: "주요 업적",
  summary:
    "2010년 7월 성남시는 전임 시정이 남긴 빚을 갚기 어렵다며 모라토리엄을 선언했다. " +
    "판교테크노밸리를 지으라고 마련한 회계에서 5,400억 원이 다른 사업에 쓰여 있었다. " +
    "성남시는 3년 6개월 만에 7,285억 원을 모두 정리했고, 2018년 1월에는 일반회계 채무까지 갚았다.",
  type: "event",
  publishStatus: "draft",
  draftReason:
    "모라토리엄 선언과 졸업은 성남시가 기자회견으로 밝힌 내용이라 당시 보도로 받쳤고, " +
    "채무 제로는 성남시 시정소식지로 확인했습니다. 연도별 채무 잔액을 성남시 재정공시로 " +
    "대조하기 전까지는 초안으로 둡니다.",

  headlineKeyNumberId: "kn-total",

  scenes: [
    {
      id: "flow",
      kind: "money-flow",
      heading: "7,285억은 무엇으로 이뤄져 있었나",
      lede:
        "모라토리엄이 대상으로 삼은 빚의 구성입니다. 흔히 인용되는 5,400억은 이 가운데 한 조각입니다.",
      claimIds: ["claim-moratorium"],
      flow: {
        sourceLabel: "2010년 7월 비공식 부채",
        unitLabel: "억 원",
        totalLabel: "비공식 부채 합계",
        note:
          "성남시가 모라토리엄을 선언하며 밝힌 '비공식 부채'다. 지방채 같은 공식 채무와는 " +
          "다른 셈이며, 2018년의 '채무 제로'는 또 다른 범위를 말한다. 섞어 읽으면 안 된다.",
        scenarios: [
          {
            id: "sc-2010",
            name: "2010년 7월",
            summary: "판교특별회계에서 빠져나간 돈이 4분의 3을 차지했다.",
            isActual: true,
            claimId: "claim-moratorium",
            allocations: [
              {
                id: "al-pangyo",
                label: "판교특별회계 전입금",
                amountEok: 5400,
                kind: "public",
                detail: "판교테크노밸리를 지으라고 마련한 회계에서 빠져나간 돈",
                claimId: "claim-moratorium",
              },
              {
                id: "al-obligation",
                label: "예산 미편성 의무금",
                amountEok: 1885,
                kind: "public",
                detail: "시청사 부지 잔금 등 내야 할 돈인데 예산에 잡히지 않은 것",
                claimId: "claim-moratorium",
              },
            ],
          },
        ],
      },
    },
  ],

  shorts: [],

  eli5: {
    intro:
      "성남시가 빚을 물려받았어요. 시장이 '지금은 못 갚는다'고 먼저 말했어요. 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-sd-inherit",
        title: "앞사람이 쓴 빚이 남아 있었어요",
        say: "새 시장이 왔더니 갚아야 할 돈이 7천억 원이 넘게 있었어요. 장부에 제대로 적혀 있지도 않았어요.",
        art: "inherited-debt",
        fact: { value: "7,285억 원", tone: "warm" },
        claimIds: ["claim-moratorium"],
      },
      {
        id: "e-sd-pocket",
        title: "다른 주머니 돈을 꺼내 쓴 거였어요",
        say: "판교에 새 동네를 지으라고 따로 모아 둔 돈이 있었어요. 그 돈으로 시청 건물을 짓고 길을 넓혔어요. 나중에 채워 넣어야 하는 돈이었죠.",
        art: "wrong-pocket",
        fact: { value: "5,400억 원", tone: "warm" },
        claimIds: ["claim-moratorium"],
      },
      {
        id: "e-sd-declare",
        title: "못 갚는다고 먼저 말했어요",
        say: "숨기지 않고 '지금은 못 갚으니 미뤄 달라'고 했어요. 이걸 어려운 말로 모라토리엄이라고 해요.",
        art: "declare-moratorium",
        fact: { value: "2010년 7월", tone: "warm" },
        claimIds: ["claim-moratorium"],
      },
      {
        id: "e-sd-tighten",
        title: "허리띠를 졸라맸어요",
        say: "당장 급하지 않은 일은 뒤로 미루고 예산을 깎았어요. 그렇게 모은 돈으로 조금씩 갚아 나갔어요.",
        art: "tighten-belt",
        fact: { value: "3년 6개월", tone: "ice" },
        claimIds: ["claim-graduation"],
      },
      {
        id: "e-sd-paid",
        title: "다 갚았다고 알렸어요",
        say: "2014년 1월, 미뤄 뒀던 7,285억 원을 모두 정리했다고 밝혔어요.",
        art: "paid-off",
        fact: { value: "2014년 1월 27일", tone: "ice" },
        claimIds: ["claim-graduation"],
      },
      {
        id: "e-sd-zero",
        title: "4년 뒤엔 빚이 거의 0이 됐어요",
        say: "2018년 1월에는 일반회계 빚 190억 원까지 갚았어요. 나라 돈으로 자동으로 갚아지는 9억 원만 남았어요.",
        art: "debt-zero",
        fact: { value: "2018년 1월 29일", tone: "ice" },
        claimIds: ["claim-zero"],
      },
    ],
    caveat: {
      text:
        "'빚 0'이라는 말은 범위를 정해 놓고 하는 말이에요. 2014년에 정리한 7,285억 원과 2018년의 '채무 제로'는 서로 다른 셈이에요. 그리고 9억 원은 남아 있었어요.",
      claimIds: ["claim-moratorium", "claim-zero"],
    },
  },

  keyNumbers: [
    {
      id: "kn-total",
      label: "모라토리엄이 선언한 빚",
      value: "7,285",
      unit: "억 원",
      caption: "판교특별회계 5,400 + 미편성 의무금 1,885",
      claimId: "claim-moratorium",
    },
    {
      id: "kn-years",
      label: "청산까지 걸린 기간",
      value: "3년 6개월",
      caption: "2010년 7월 → 2014년 1월",
      claimId: "claim-graduation",
    },
    {
      id: "kn-zero",
      label: "채무 제로 시점에 남은 빚",
      value: "9",
      unit: "억 원",
      caption: "국비로 자동 상환되는 공기업특별회계분",
      claimId: "claim-zero",
    },
  ],

  timeline: [
    {
      id: "sd-declare",
      date: "2010-07",
      displayDate: "2010년 7월",
      datePrecision: "month",
      title: "모라토리엄 선언",
      summary:
        "민선 5기 출범과 동시에 비공식 부채 7,285억 원을 갚기 어렵다고 밝혔다.",
      claimIds: ["claim-moratorium"],
    },
    {
      id: "sd-graduate",
      date: "2014-01-27",
      displayDate: "2014년 1월 27일",
      datePrecision: "day",
      title: "모라토리엄 졸업 선언",
      summary: "7,285억 원을 모두 정리했다고 기자회견에서 밝혔다. 3년 6개월이 걸렸다.",
      claimIds: ["claim-graduation"],
    },
    {
      id: "sd-zero",
      date: "2018-01-29",
      displayDate: "2018년 1월 29일",
      datePrecision: "day",
      title: "일반회계 채무 전액 상환",
      summary:
        "일반회계 채무 190억 원을 갚았다. 국비로 자동 상환되는 9억 원을 제외하면 빚이 남지 않았다.",
      claimIds: ["claim-zero"],
    },
  ],

  graph: {
    note:
      "돈이 어디서 빠져나가 어디로 갔는지를 그렸다. 기관과 회계, 사업만 올린다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "seongnam", name: "성남시", kind: "government", isFocus: true,
        description: "빚을 떠안고 갚은 주체" },
      { id: "pangyo", name: "판교특별회계", kind: "project",
        description: "판교테크노밸리 조성용으로 따로 둔 회계" },
      { id: "cityhall", name: "시청사 건립", kind: "project" },
      { id: "road", name: "공원로 확장", kind: "project" },
      { id: "obligation", name: "미편성 의무금", kind: "project",
        description: "시청사 부지 잔금 등 내야 하는데 예산에 잡히지 않은 돈" },
      { id: "bond", name: "지방채", kind: "project",
        description: "공식 채무. 비공식 부채와는 다른 셈이다" },
      { id: "citizens", name: "성남시민", kind: "group",
        description: "사업 순위 조정을 함께 감당한 쪽" },
    ],
    relations: [
      {
        id: "sd-r-cityhall",
        fromId: "pangyo",
        toId: "cityhall",
        label: "판교테크노밸리를 지으라고 마련한 회계가 시청사 건립에 쓰였다.",
        startDate: "2010-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-moratorium"],
      },
      {
        id: "sd-r-road",
        fromId: "pangyo",
        toId: "road",
        label: "같은 회계가 공원로 확장에도 쓰였다.",
        startDate: "2010-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-moratorium"],
      },
      {
        id: "sd-r-owe",
        fromId: "seongnam",
        toId: "pangyo",
        label: "빠져나간 전입금 5,400억 원을 채워 넣어야 할 빚으로 선언했다.",
        startDate: "2010-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-moratorium"],
      },
      {
        id: "sd-r-obligation",
        fromId: "seongnam",
        toId: "obligation",
        label: "예산에 잡히지 않은 의무금 1,885억 원도 함께 선언했다.",
        startDate: "2010-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-moratorium"],
      },
      {
        id: "sd-r-austerity",
        fromId: "seongnam",
        toId: "citizens",
        label: "사업 투자순위를 조정하고 예산을 깎아 갚았다. 그 몫은 시민이 함께 졌다.",
        startDate: "2010-07",
        startPrecision: "month",
        endDate: "2014-01-27",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-graduation"],
      },
      {
        id: "sd-r-cleared",
        fromId: "seongnam",
        toId: "pangyo",
        label: "2013년 말까지 비공식 부채를 모두 정리했다.",
        startDate: "2014-01-27",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-graduation"],
      },
      {
        id: "sd-r-bond",
        fromId: "seongnam",
        toId: "bond",
        label: "8년간 지방채 1,724억 원을 발행하고 1,805억 원을 상환했다. 발행보다 갚은 쪽이 많다.",
        startDate: "2018-01-29",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-bond"],
      },
    ],
  },

  counterpoints: [
    {
      id: "sd-cp-need",
      question: "모라토리엄까지 선언할 필요가 있었나?",
      response:
        "당시 경기도는 그 정도로 급하지 않았다는 입장이었다. 선언 자체는 '돈이 없다'가 아니라 '이 시점에는 못 내니 미루겠다'는 통보에 가깝다. 다만 미뤘다고 사라지는 빚이 아니었고, 성남시는 3년 6개월 뒤 7,285억 원을 모두 정리했다고 밝혔다. 선언이 과했는지는 판단의 문제지만, 갚았다는 사실과는 별개다.",
      claimIds: ["claim-moratorium", "claim-graduation"],
    },
    {
      id: "sd-cp-austerity",
      question: "빚 갚느라 시민에게 쓸 돈을 줄인 것 아닌가?",
      response:
        "사업 투자순위를 조정하고 예산을 깎았다. 그 부담이 없었다고 말할 수 없다. 다만 같은 시기에 무상교복·공공산후조리·청년배당을 새로 시작했다. 줄인 것과 늘린 것이 함께 있었고, 어느 쪽이 컸는지는 항목별로 따로 봐야 한다.",
      claimIds: ["claim-graduation"],
    },
    {
      id: "sd-cp-zero",
      question: "'채무 제로'가 정말 빚이 하나도 없다는 뜻인가?",
      response:
        "아니다. 성남시가 밝힌 것은 일반회계 채무 190억 원을 전액 상환했다는 것이고, 국비로 자동 상환되는 공기업특별회계 채무 9억 원은 제외한 수치다. 성남시 스스로 그렇게 밝혔고, 이 스토리도 그 범위를 그대로 적는다. 2014년에 정리한 7,285억 원과도 다른 셈이다.",
      claimIds: ["claim-zero", "claim-moratorium"],
    },
  ],

  claims: [
    {
      id: "claim-moratorium",
      text:
        "성남시는 2010년 7월 민선 5기 출범과 동시에 비공식 부채를 갚기 어렵다며 모라토리엄을 선언했다. 당시 밝힌 규모는 공원로 확장 등에 쓰인 판교특별회계 전입금 5,400억 원과 예산 미편성 의무금 1,885억 원 등 7,285억 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-press-2014", "src-book"],
      verified: true,
    },
    {
      id: "claim-graduation",
      text:
        "성남시는 2014년 1월 27일 기자회견에서 그 7,285억 원을 모두 정리해 3년 6개월 만에 모라토리엄을 졸업했다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-press-2014"],
      verified: true,
    },
    {
      id: "claim-zero",
      text:
        "2018년 1월 29일 성남시는 일반회계 채무 190억 원을 전액 상환했다. 국비로 자동 상환되는 공기업특별회계 채무 9억 원을 제외하면 남은 빚이 없다.",
      assertionType: "FACT",
      sourceIds: ["src-snvision-2018"],
      verified: true,
    },
    {
      id: "claim-bond",
      text:
        "성남시는 2010년부터 8년간 지방채 1,724억 원을 발행하고 같은 기간 1,805억 원을 상환했다.",
      assertionType: "FACT",
      sourceIds: ["src-snvision-2018"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-book",
      title: "『밍밍 잼칠라 이장님』 — 1학기 이장님 업적(성남시장) 21",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "21. 취임 3년 만에 성남시 부채 5,400억 청산 — 행정 능력을 인정 할 수밖에 없어. " +
        "(이 책의 수치는 기간과 금액이 실제와 다르다. 3년 6개월에 7,285억이고 5,400억은 그 일부다.)",
    },
    {
      id: "src-press-2014",
      title: "성남시 \"채무 7285억 상환… 3년6개월 만에 모라토리엄 졸업\"",
      url: "https://www.hankookilbo.com/news/article/201401271334486207",
      publisher: "한국일보",
      publishedAt: "2014-01-27",
      type: "press",
      license: "quotable",
      quote:
        "비공식 부채는 공원로 확장 등에 사용한 판교특별회계 전입금 5,400억원, " +
        "예산 미편성 의무금 1,885억원 등 7,285억원 규모였다.",
    },
    {
      id: "src-snvision-2018",
      title: "성남의 변신… '모라토리엄'에서 '채무 제로'까지",
      url: "https://snvision.seongnam.go.kr/7760",
      publisher: "성남시 시정소식지 비전성남",
      publishedAt: "2018-02-02",
      type: "official",
      license: "public",
      quote:
        "지난달 29일 일반회계 채무 190억 원을 전액 상환하면서 국비로 자동 상환되는 " +
        "공기업특별회계 채무 9억 원을 제외한 모든 빚을 청산 (…) 지난 8년간 1,724억 원의 " +
        "지방채를 발행한 성남시는 같은 기간 1,805억 원을 상환",
    },
  ],
};

export const seongnamDebt = achievementSchema.parse(raw);
