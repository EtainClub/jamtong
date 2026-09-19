import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 자원 외교 — 핵심광물을 어디서 받을지를 넓힌 일.
 *
 * 2026년 7~8월 남미 순방과 9월 한-중앙아시아 정상회의가 이 업적의 두 축이다.
 * 리튬·구리 같은 핵심광물을 한두 나라에만 기대던 구조를 넓히려 한 것이다.
 *
 * ★ 이 업적에서 가장 조심해야 하는 것은 **MOU와 계약을 섞지 않는 것**이다.
 *   74건이라는 숫자는 협정과 양해각서를 합한 것이고, 양해각서는 합의문이지
 *   계약이 아니다. 이명박 정부 자원외교에서 MOU 96건 가운데 본계약은 16건이었다.
 *   이 사실을 반론에 그대로 싣는다 — 이 위키가 과거 정부를 공격하려는 것이 아니라,
 *   같은 잣대를 지금 정부에도 대기 위해서다.
 *
 * ★ 그래서 keyNumbers에는 '몇 건'과 '무엇이 확정됐나'를 나눠 적는다.
 *   아르헨티나 이중과세방지협정 타결과 투르크메니스탄 투자보호협정 타결은
 *   협정이고, 리튬 공동투자는 양해각서다. 같은 칸에 두지 않는다.
 *
 * ★ 88만 배럴은 이미 들어온 물량이다.
 *   이 업적에서 유일하게 '이미 일어난 일'로 셀 수 있는 수치다. 정식 수입은
 *   2027년부터이고 연간 물량은 확인하지 못했다.
 *
 * ★ 인과를 말하지 않는다.
 *   "자원외교로 공급이 안정됐다"는 말은 하지 않는다. 합의를 맺은 것과 실제로
 *   물량이 들어오는 것은 다른 일이고, 지금 확인된 것은 앞의 것뿐이다.
 */

const raw: AchievementInput = {
  id: "resource-diplomacy",
  slug: "resource-diplomacy",
  title: "핵심광물 공급망 외교",
  subtitle: "리튬과 구리를 어디서 받을지, 나라 수를 늘렸다",
  kicker: "외교·경제",
  summary:
    "2026년 7~8월 남미 순방에서 아르헨티나와 리튬 공동투자 양해각서·이중과세방지협정을 " +
    "맺고 원유 88만 배럴을 시범 도입했으며, 칠레와 광물자원 파트너십을 맺었다. " +
    "9월 14~16일에는 중앙아시아 5개국 정상을 서울로 불러 다자 정상회의를 처음 열고 " +
    "74건의 협정·양해각서를 맺었다. 다만 대부분은 양해각서이고, 계약이 되기까지는 " +
    "아직 남은 일이 있다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "순방 성과와 합의 건수는 보도로 확인했습니다. 각 합의의 원문과 이행 " +
    "일정은 아직 대조하지 못했습니다. 74건 가운데 몇 건이 본계약으로 " +
    "이어졌는지는 이 업적 기준일인 2026년 9월 19일까지 확인할 수 없습니다 — " +
    "중앙아시아 정상회의가 끝난 지 사흘밖에 지나지 않았기 때문입니다. " +
    "칠레의 연 21억 달러는 정부가 밝힌 ‘수급 안정성 확보’ 규모이고, 실제 " +
    "도입 실적이 아닙니다. 이 위키는 합의를 성과로, 성과를 결과로 올려 " +
    "적지 않으려 합니다.",

  headlineKeyNumberId: "kn-mou",

  scenes: [
    {
      id: "oilin",
      kind: "quantity-track",
      heading: "아르헨티나에서 실제로 들어온 것",
      lede:
        "이 업적에서 배럴로 셀 수 있는 것은 이 하나입니다. 스크롤하면 그 자리를 지나갑니다.",
      claimIds: ["claim-argentina"],
      track: {
        label: "아르헨티나산 원유 도입량",
        unit: "배럴",
        direction: "up",
        max: 880000,
        note:
          "시범 도입 물량이다. 정식 수입은 2027년부터이고 연간 물량은 아직 " +
          "확인하지 못했다. 그래서 이 추이는 두 시점에서 멈춘다 — 앞으로 얼마가 " +
          "들어올지는 자료가 없다.",
        checkpoints: [
          {
            id: "rd-before",
            displayDate: "2025년까지",
            title: "0배럴",
            amount: 0,
            caption:
              "아르헨티나에서 들여온 원유는 없었습니다. 남미는 우리 원유 수입처가 아니었습니다.",
            art: "min-map",
            claimId: "claim-argentina",
          },
          {
            id: "rd-trial",
            displayDate: "2026년",
            title: "88만 배럴",
            amount: 880000,
            caption:
              "시범 도입을 마쳤습니다. 정식 수입은 2027년부터 시작합니다.",
            art: "min-oil-ship",
            claimId: "claim-argentina",
          },
        ],
      },
    },
  ],

  shorts: [],

  eli5: {
    intro:
      "배터리나 전선을 만들려면 리튬·구리 같은 광물이 필요해요. 그걸 어디서 받을지 넓힌 이야기예요.",
    scenes: [
      {
        id: "e-rd-why",
        title: "한 곳에만 기대면 위험해요",
        say: "광물을 한두 나라에서만 사 오면, 그 나라가 안 판다고 할 때 공장이 멈춰요. 그래서 살 곳을 여러 군데로 늘리는 거예요.",
        art: "min-map",
        claimIds: ["claim-central"],
      },
      {
        id: "e-rd-lithium",
        title: "남미에 갔어요",
        say: "아르헨티나는 리튬이 세계에서 네 번째로 많이 묻혀 있는 나라예요. 같이 캐자는 약속을 하고, 세금을 두 번 안 내게 하는 협정도 맺었어요.",
        art: "min-lithium",
        fact: { value: "매장량 4위", tone: "ice" },
        claimIds: ["claim-argentina"],
      },
      {
        id: "e-rd-oil",
        title: "기름도 처음 들여왔어요",
        say: "아르헨티나에서 원유 88만 배럴을 시험 삼아 들여왔어요. 제대로 사 오는 건 2027년부터예요.",
        art: "min-oil-ship",
        fact: { value: "88만 배럴", tone: "ice" },
        claimIds: ["claim-argentina"],
      },
      {
        id: "e-rd-central",
        title: "중앙아시아 다섯 나라를 불렀어요",
        say: "2026년 9월 서울에서 다섯 나라 대통령이 한자리에 모였어요. 이렇게 다 같이 모인 건 처음이에요. 74건을 합의했어요.",
        art: "min-papers",
        fact: { value: "74건", tone: "ice" },
        claimIds: ["claim-central"],
      },
      {
        id: "e-rd-mou",
        title: "약속이 다 계약은 아니에요",
        say: "74건 중 대부분은 '같이 해 보자'는 약속 문서예요. 예전에 96건을 약속했는데 실제 계약은 16건뿐이었던 적이 있어요.",
        art: "min-contract",
        claimIds: ["claim-mb-mou"],
      },
    ],
    caveat: {
      text:
        "지금 확인된 건 '약속을 맺었다'까지예요. 광물이 실제로 얼마나 들어올지는 아직 몰라요. 중앙아시아 회의가 끝난 지 사흘밖에 안 됐어요.",
      claimIds: ["claim-central", "claim-mb-mou"],
    },
  },

  keyNumbers: [
    {
      id: "kn-mou",
      label: "한-중앙아 정상회의 합의",
      value: "74",
      unit: "건",
      caption: "협정과 양해각서를 합한 수 · 2026년 9월 14~16일 서울",
      claimId: "claim-central",
    },
    {
      id: "kn-oil",
      label: "아르헨티나산 원유 시범 도입",
      value: "88만",
      unit: "배럴",
      caption: "정식 수입은 2027년부터",
      claimId: "claim-argentina",
    },
    {
      id: "kn-chile",
      label: "칠레 광물 수급 규모",
      prefix: "연",
      value: "21억",
      unit: "달러",
      caption: "정부가 밝힌 ‘안정성 확보’ 규모 · 도입 실적이 아니다",
      claimId: "claim-chile",
    },
  ],

  timeline: [
    {
      id: "rd-brazil",
      date: "2026-07",
      displayDate: "2026년 7월",
      datePrecision: "month",
      title: "남미 순방 — 브라질",
      summary:
        "7박 11일 순방의 첫 기착지에서 재생에너지·전력망 등 에너지 분야 협력 양해각서를 맺었다.",
      claimIds: ["claim-chile"],
    },
    {
      id: "rd-chile",
      date: "2026-07",
      displayDate: "2026년 7월",
      datePrecision: "month",
      title: "칠레 — 광물자원 파트너십",
      summary:
        "리튬·구리 매장량 세계 1위인 칠레와 광물자원 파트너십 양해각서를 맺고, 연 21억 달러(약 3조 300억 원) 규모의 광물 수급 안정성을 확보했다고 밝혔다. 2004년 발효된 한·칠레 자유무역협정 개선도 논의했다.",
      claimIds: ["claim-chile"],
    },
    {
      id: "rd-argentina",
      date: "2026-08",
      displayDate: "2026년 8월",
      datePrecision: "month",
      title: "아르헨티나 — 리튬과 원유",
      summary:
        "리튬 탐사·채굴에 양국 기업이 공동 투자하는 핵심광물 협력 양해각서를 맺고, 이중과세방지협정을 타결했다. 원유는 올해 88만 배럴을 시범 도입했고 2027년부터 정식 수입을 시작한다.",
      claimIds: ["claim-argentina"],
    },
    {
      id: "rd-central",
      date: "2026-09-16",
      displayDate: "2026년 9월 14~16일",
      datePrecision: "day",
      title: "한-중앙아시아 정상회의 (서울)",
      summary:
        "우즈베키스탄·카자흐스탄·투르크메니스탄·타지키스탄·키르기스스탄 정상이 다자 형식으로 한자리에 모인 것은 처음이다. 74건의 협정·양해각서를 맺었다. 카자흐스탄과는 관계를 ‘미래지향적 포괄적 전략 동반자’로 17년 만에 격상하고 원유 공급 확대에 합의했으며, 투르크메니스탄과는 협상 개시 16년 만에 투자보호협정을 타결했다.",
      claimIds: ["claim-central", "claim-kazakh"],
    },
  ],

  graph: {
    note:
      "광물과 원유가 어디서 오기로 했는지를 그렸다. 협정으로 타결된 것과 " +
      "양해각서로 합의된 것을 선 위의 설명에 나눠 적었다. 연표에서 시점을 " +
      "옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "kr-gov", name: "대한민국 정부", kind: "government", isFocus: true,
        description: "순방과 정상회의로 공급처를 넓힌 쪽" },
      { id: "ar", name: "아르헨티나", kind: "country",
        description: "리튬 매장량 세계 4위. 원유 88만 배럴을 시범 공급했다" },
      { id: "cl", name: "칠레", kind: "country",
        description: "리튬·구리 매장량 세계 1위" },
      { id: "kz", name: "카자흐스탄", kind: "country",
        description: "원유 공급 확대에 합의. 관계를 17년 만에 격상했다" },
      { id: "tm", name: "투르크메니스탄", kind: "country",
        description: "천연가스 보유국. 투자보호협정을 16년 만에 타결했다" },
      { id: "industry", name: "국내 배터리·전선 산업", kind: "company",
        description: "리튬과 구리를 쓰는 쪽" },
    ],
    relations: [
      {
        id: "rd-r-cl",
        fromId: "kr-gov",
        toId: "cl",
        label: "광물자원 파트너십 양해각서를 맺었다. 정부는 연 21억 달러 규모라고 밝혔다.",
        startDate: "2026-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-chile"],
        bidirectional: true,
      },
      {
        id: "rd-r-ar",
        fromId: "kr-gov",
        toId: "ar",
        label: "리튬 공동투자 양해각서와 이중과세방지협정. 원유 88만 배럴을 시범 도입했다.",
        startDate: "2026-08",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-argentina"],
        bidirectional: true,
      },
      {
        id: "rd-r-kz",
        fromId: "kr-gov",
        toId: "kz",
        label: "원유 공급 확대에 합의하고 관계를 17년 만에 격상했다.",
        startDate: "2026-09-16",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-kazakh"],
        bidirectional: true,
      },
      {
        id: "rd-r-tm",
        fromId: "kr-gov",
        toId: "tm",
        label: "협상 개시 16년 만에 투자보호협정을 타결했다.",
        startDate: "2026-09-16",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-kazakh"],
        bidirectional: true,
      },
      {
        id: "rd-r-use",
        fromId: "cl",
        toId: "industry",
        label: "리튬과 구리를 쓰는 곳. 실제 도입 물량은 아직 확인되지 않았다.",
        startDate: "2026-07",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-chile"],
      },
    ],
  },

  counterpoints: [
    {
      id: "rd-cp-mou",
      question: "74건이면 대단한 것 아닌가?",
      response:
        "74건은 협정과 양해각서를 합한 수다. 양해각서는 ‘같이 해 보자’는 합의문이지 계약이 아니고, 법적 구속력도 없다. 이명박 정부 자원외교에서는 양해각서 96건 가운데 본계약으로 이어진 것이 16건이었다. 이 위키는 그때의 잣대를 지금 정부에 그대로 댄다. 74건 가운데 몇 건이 계약이 될지는 시간이 지나야 알 수 있고, 정상회의가 끝난 지 사흘 된 지금은 알 수 없다. 다만 협정으로 타결된 것 — 아르헨티나 이중과세방지협정, 투르크메니스탄 투자보호협정 — 은 양해각서와 다른 무게를 갖는다.",
      claimIds: ["claim-central", "claim-mb-mou"],
    },
    {
      id: "rd-cp-past",
      question: "예전 자원외교처럼 되는 것 아닌가?",
      response:
        "그 우려에는 근거가 있다. 이명박 정부 시기 해외자원 개발 투자는 큰 손실로 끝났고, 광해광업공단은 그 뒤 “사실상 손발이 묶였고 그 상태가 10년 이상 이어지면서 기능도 많이 축소됐다”고 밝혔다. 이번 합의들이 그때와 다른지는 투자 구조와 이행 실적을 봐야 알 수 있고, 이 위키는 아직 그 자료를 갖고 있지 않다. 다른 점을 하나 적자면, 이번에는 정부가 직접 광산을 사들이는 방식이 아니라 기업 공동투자와 협정을 앞세운 형태로 발표됐다.",
      claimIds: ["claim-mb-mou"],
    },
    {
      id: "rd-cp-supply",
      question: "그래서 광물이 실제로 들어오고 있나?",
      response:
        "배럴로 셀 수 있는 것은 아르헨티나 원유 88만 배럴뿐이고, 그것도 시범 도입이다. 칠레의 연 21억 달러는 정부가 밝힌 ‘수급 안정성 확보’ 규모이지 도입 실적이 아니다. 리튬 공동투자는 탐사·채굴 단계의 합의이므로 광물이 나오기까지는 여러 해가 걸린다. 이 업적은 ‘광물을 확보했다’가 아니라 ‘받을 곳을 넓히기로 했다’까지를 말한다.",
      claimIds: ["claim-argentina", "claim-chile"],
    },
  ],

  claims: [
    {
      id: "claim-argentina",
      text:
        "2026년 8월 남미 순방에서 한국과 아르헨티나는 리튬 탐사·채굴에 양국 기업이 공동 투자하는 핵심광물 협력 양해각서를 체결하고 이중과세방지협정을 타결했다. 아르헨티나는 세계 4위 리튬 매장국이다. 원유는 2026년 88만 배럴을 시범 도입했고 2027년부터 정식 수입을 시작한다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-rd"],
      verified: true,
    },
    {
      id: "claim-chile",
      text:
        "같은 순방에서 한국과 칠레는 광물자원 파트너십 양해각서를 체결했다. 정부는 이를 통해 연간 21억 달러(약 3조 300억 원) 규모의 광물 수급 안정성을 확보했다고 밝혔다. 칠레는 리튬·구리 매장량 세계 1위다. 브라질과는 재생에너지·전력망 등 에너지 분야 협력 양해각서를 맺었다.",
      assertionType: "CLAIM",
      assertedBy: "대한민국 정부",
      sourceIds: ["src-seoul-rd"],
      verified: true,
    },
    {
      id: "claim-central",
      text:
        "2026년 9월 14~16일 서울에서 열린 한-중앙아시아 정상회의에 우즈베키스탄·카자흐스탄·투르크메니스탄·타지키스탄·키르기스스탄 정상이 참석했다. 중앙아시아 5개국 정상이 다자 형식으로 한자리에 모인 것은 처음이다. 총 74건의 협정·양해각서가 체결됐다.",
      assertionType: "FACT",
      sourceIds: ["src-aju-rd"],
      verified: true,
    },
    {
      id: "claim-kazakh",
      text:
        "한국과 카자흐스탄은 양자회담에서 관계를 ‘미래지향적 포괄적 전략 동반자 관계’로 17년 만에 격상하고, 글로벌 공급 차질 시 원유 공급 확대에 합의했으며 원전·소형모듈원자로 공동 연구개발을 논의했다. 투르크메니스탄과는 협상 개시 16년 만에 투자보호협정을 타결했다.",
      assertionType: "FACT",
      sourceIds: ["src-aju-rd"],
      verified: true,
    },
    {
      id: "claim-mb-mou",
      text:
        "이명박 정부 자원외교에서 체결된 양해각서 96건 가운데 본계약으로 이어진 것은 16건이었다. 이후 광해광업공단은 “10여 년 전 정부의 무리한 해외자원 개발 투자로 엄청난 손실을 겪었고 이후 사실상 손발이 묶였다”며 “그 상태가 10년 이상 이어지면서 기능도 많이 축소됐다”고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-mb", "src-etoday-mineral"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-seoul-rd",
      title: "핵심광물 공급망 넓힌 李… 내년부터 아르헨 원유도 들여온다",
      url: "https://www.seoul.co.kr/news/politics/diplomacy/2026/08/03/20260803006004",
      publisher: "서울신문",
      publishedAt: "2026-08-03",
      type: "press",
      license: "quotable",
      quote:
        "아르헨티나와 핵심광물 협력 양해각서를 맺어 리튬 탐사·채굴에 양국 기업이 " +
        "공동 투자하기로 했다. 원유는 올해 88만 배럴을 시범 도입했고 내년부터 " +
        "정식 수입한다. 칠레와는 광물자원 파트너십 양해각서로 연간 21억 달러 " +
        "규모의 광물 수급 안정성을 확보했다.",
    },
    {
      id: "src-aju-rd",
      title: "핵심광물부터 가스전·플랜트까지…5개국 ‘맞춤형 경제외교’ 빛났다",
      url: "https://www.ajunews.com/view/20260916170137096",
      publisher: "아주경제",
      publishedAt: "2026-09-16",
      type: "press",
      license: "quotable",
      quote:
        "중앙아시아 5개국 정상이 다자 형식으로 한자리에 모인 것은 처음이다. " +
        "총 74건의 협정·양해각서가 체결됐다. 카자흐스탄과는 ‘미래지향적 포괄적 " +
        "전략 동반자 관계’로 17년 만에 격상했고, 투르크메니스탄과는 협상 개시 " +
        "16년 만에 투자보호협정을 타결했다.",
    },
    {
      id: "src-khan-mb",
      title: "[눈먼 불도저 ‘MB 자원외교’] “자원외교 실패했다”… 정권 바뀌자 ‘반성문’ 쓴 산업부",
      url: "https://www.khan.co.kr/article/201502090600015",
      publisher: "경향신문",
      publishedAt: "2015-02-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-mineral",
      title: "‘자원외교’ 후유증에 위축된 광물개발…민간 지원만으론 한계",
      url: "https://www.etoday.co.kr/news/view/2621087",
      publisher: "이투데이",
      type: "press",
      license: "quotable",
      quote:
        "10여년 전 정부의 무리한 해외자원 개발 투자로 엄청난 손실을 겪었고 이후 " +
        "사실상 손발이 묶였다. 그 상태가 10년 이상 이어지면서 기능도 많이 " +
        "축소됐다 (광해광업공단 사장)",
    },
  ],
};

export const resourceDiplomacy = achievementSchema.parse(raw);
