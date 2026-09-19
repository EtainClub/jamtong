import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 성남시 3대 무상복지 — 무상교복 · 공공산후조리 · 청년배당.
 *
 * 출처
 *  - `src-book`: 『밍밍 잼칠라 이장님』(맘껏 지음, 와우라이프). 어떤 정책이
 *    있었는지를 알려 준다. 다만 이 책은 날짜와 금액을 담지 않으므로,
 *    수치와 시점은 성남시 시정소식지와 당시 보도로 확정했다.
 *  - `src-snvision-*`: 성남시 시정소식지 『비전성남』. 시가 직접 낸 자료다.
 *  - `src-press-*`: 제소와 취하는 시가 낸 자료가 아니므로 보도로 받쳤다.
 *
 * 이 업적을 셋으로 쪼개지 않은 이유
 *   따로 보면 복지 사업 셋이지만, 묶여 있었기 때문에 다툼이 됐다. 예산안 하나에
 *   함께 실렸고, 하나의 재의요구 지시를 받았고, 하나의 소송으로 갔다.
 *   쪼개면 이 사건의 형태가 사라진다.
 *
 * 설계 원칙 (설계 검토 문서 2.2)
 *   - 노드에 실존 개인을 올리지 않는다. 기관과 제도, 그리고 받는 쪽의 집단만 올린다.
 *   - 쟁점을 빼지 않는다. 절차 위반 주장은 실제로 제기됐고 그대로 싣는다.
 */

const raw: AchievementInput = {
  id: "seongnam-welfare",
  slug: "seongnam-welfare",
  title: "성남시 3대 무상복지",
  subtitle: "중앙정부가 막아선 지방정부의 복지 실험",
  kicker: "주요 업적",
  category: "welfare",
  summary:
    "성남시는 2016년부터 무상교복·공공산후조리·청년배당 세 가지를 한 예산안에 묶어 시행했다. " +
    "보건복지부는 사회보장기본법상 사전협의를 거치지 않았다며 제동을 걸었고, " +
    "경기도가 대법원에 예산안 의결 무효확인을 청구했다. " +
    "소송은 2년 반 뒤 취하됐고, 세 사업은 그동안에도 멈추지 않았다.",
  type: "event",
  publishStatus: "published",
  sourceNote:
    "정책의 내용과 규모는 성남시가 직접 낸 자료로 확인했습니다. 다만 재의요구·제소·취하의 " +
    "경위는 시가 낸 자료가 아니어서 당시 보도에 기대고 있습니다. 관련 공문과 대법원 사건 " +
    "자료는 아직 붙이지 못했습니다.",

  headlineKeyNumberId: "kn-youth",

  scenes: [
    {
      id: "flow",
      kind: "money-flow",
      heading: "194억이 어디로 갔나",
      lede:
        "2016년 예산안에 세 사업이 함께 실렸습니다. 이 한 덩어리가 재의요구와 소송의 대상이 됐습니다.",
      claimIds: ["claim-budget-2016"],
      flow: {
        sourceLabel: "2016년 성남시 예산",
        unitLabel: "억 원",
        totalLabel: "세 사업 합계",
        note:
          "2016년 예산안에 실린 세 사업의 사업비다. 성남시 전체 예산이 아니라 " +
          "이 세 사업만의 몫이며, 재의요구 지시와 대법원 제소의 대상이 된 범위와 같다.",
        scenarios: [
          {
            id: "sc-2016",
            name: "2016년 예산안",
            summary: "세 사업이 한 예산안에 함께 실렸다.",
            isActual: true,
            claimId: "claim-budget-2016",
            allocations: [
              {
                id: "al-youth",
                label: "청년배당",
                amountEok: 113,
                kind: "public",
                detail: "만 24세 청년에게 지역화폐로",
                claimId: "claim-budget-2016",
              },
              {
                id: "al-postpartum",
                label: "산후조리 지원",
                amountEok: 56,
                kind: "public",
                detail: "산모에게 산후조리비",
                claimId: "claim-budget-2016",
              },
              {
                id: "al-uniform",
                label: "무상교복",
                amountEok: 25,
                kind: "public",
                detail: "중학교 신입생 교복",
                claimId: "claim-budget-2016",
              },
            ],
          },
        ],
      },
    },
  ],

  shorts: [
    {
      id: "short-sw-01",
      title: "3대 복지와 대법원 소송의 결말",
      summary:
        "교복·산후조리·청년배당 셋을 시가 맡았고, 정부가 막았고, 대법원까지 갔습니다.",
      youtubeId: "5I5CK0vJz3c",
      claimIds: ["claim-three", "claim-mohw", "claim-lawsuit", "claim-withdraw"],
      publishedAt: "2026-09-19",
    },
  ],

  eli5: {
    intro:
      "성남시가 세 가지를 공짜로 해줬어요. 그런데 정부가 하지 말라고 했어요. 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-sw-uniform",
        title: "교복을 시가 사줬어요",
        say: "중학교에 들어가면 교복을 사야 해요. 그 돈을 시가 냈어요. 처음에는 형편이 어려운 집만, 나중에는 모두에게요.",
        art: "uniform-free",
        fact: { value: "1인당 30만 원 상당", tone: "ice" },
        claimIds: ["claim-uniform-universal"],
      },
      {
        id: "e-sw-postpartum",
        title: "아기를 낳으면 산후조리를 도왔어요",
        say: "아기를 낳고 몸을 추스르는 곳을 산후조리원이라고 해요. 그 비용을 시가 보탰어요.",
        art: "postpartum-free",
        fact: { value: "2016년 1월 7일 첫 지원", tone: "ice" },
        claimIds: ["claim-first-payment"],
      },
      {
        id: "e-sw-youth",
        title: "스물넷이 되면 돈을 나눠 줬어요",
        say: "성남에 3년 넘게 산 스물네 살이면 누구나 받았어요. 가난한지 아닌지 따지지 않았어요.",
        art: "youth-dividend",
        fact: { value: "1년에 100만 원", tone: "ice" },
        claimIds: ["claim-youth"],
      },
      {
        id: "e-sw-together",
        title: "셋을 한꺼번에 했어요",
        say: "세 가지를 따로따로 하지 않고 한 예산에 같이 담았어요. 그래서 나중에 한꺼번에 문제가 됐어요.",
        art: "three-together",
        fact: { value: "194억 원", tone: "ice" },
        claimIds: ["claim-budget-2016"],
      },
      {
        id: "e-sw-block",
        title: "정부가 하지 말라고 했어요",
        say: "복지를 새로 만들 때는 정부와 미리 의논해야 하는 법이 있어요. 정부는 그걸 안 지켰다고 했고, 경기도가 법원에 물었어요.",
        art: "gov-block",
        fact: { value: "2016년 1월 대법원 제소", tone: "warm" },
        claimIds: ["claim-mohw", "claim-lawsuit"],
      },
      {
        id: "e-sw-dropped",
        title: "2년 반 뒤 소송을 거뒀어요",
        say: "법원이 옳고 그름을 가리기 전에 경기도가 소송을 거뒀어요. 그동안에도 세 가지는 멈추지 않았어요.",
        art: "case-dropped",
        fact: { value: "2018년 7월 2일", tone: "ice" },
        claimIds: ["claim-withdraw"],
      },
    ],
    caveat: {
      text:
        "법원이 '성남시가 옳다'고 판단한 것은 아니에요. 판단이 나오기 전에 소송을 거둔 거예요. 절차를 지켰는지에 대한 다툼은 법적으로 결론나지 않았어요.",
      claimIds: ["claim-withdraw", "claim-mohw"],
    },
  },

  keyNumbers: [
    {
      id: "kn-youth",
      label: "청년배당",
      value: "100",
      unit: "만 원 / 년",
      caption: "3년 이상 거주한 만 24세 · 분기 25만 원",
      claimId: "claim-youth",
    },
    {
      id: "kn-budget",
      label: "2016년 세 사업 예산",
      value: "194",
      unit: "억 원",
      caption: "청년배당 113 · 산후조리 56 · 무상교복 25",
      claimId: "claim-budget-2016",
    },
    {
      id: "kn-uniform",
      label: "무상교복 지원 인원",
      value: "17,928",
      unit: "명",
      caption: "2021년 · 중·고 신입생 전체",
      claimId: "claim-uniform-universal",
    },
  ],

  timeline: [
    {
      id: "sw-2011",
      date: "2011-02",
      displayDate: "2011년 2월",
      datePrecision: "month",
      title: "전국 최초 무상교복 — 선별 지원으로 시작",
      summary: "기초생활수급자 자녀에게 교복을 지원했다. 대상을 가려 주는 방식이었다.",
      claimIds: ["claim-uniform-2011"],
    },
    {
      id: "sw-budget",
      date: "2015-12",
      displayDate: "2015년 12월",
      datePrecision: "month",
      title: "세 사업을 한 예산안에 담아 의결",
      summary:
        "시의회가 2016년 예산안을 의결했다. 보건복지부와의 사전협의를 거치지 않은 상태였다.",
      claimIds: ["claim-budget-2016", "claim-mohw"],
    },
    {
      id: "sw-start",
      date: "2016-01-07",
      displayDate: "2016년 1월 7일",
      datePrecision: "day",
      title: "산후조리비 첫 지원",
      summary: "산모 한 명에게 처음 지급됐다. 열흘 뒤 청년배당이 뒤따랐다.",
      claimIds: ["claim-first-payment"],
    },
    {
      id: "sw-youth-start",
      date: "2016-01-20",
      displayDate: "2016년 1월 20일",
      datePrecision: "day",
      title: "청년배당 지급 시작",
      summary: "만 24세 청년에게 지역화폐로 지급하기 시작했다.",
      claimIds: ["claim-first-payment", "claim-youth"],
    },
    {
      id: "sw-lawsuit",
      date: "2016-01",
      displayDate: "2016년 1월",
      datePrecision: "month",
      title: "경기도, 대법원 제소",
      summary:
        "성남시가 재의요구를 거부하자 경기도가 예산안 의결 무효확인을 청구했다.",
      claimIds: ["claim-lawsuit"],
    },
    {
      id: "sw-withdraw",
      date: "2018-07-02",
      displayDate: "2018년 7월 2일",
      datePrecision: "day",
      title: "경기도, 제소 취하",
      summary: "법원 판단이 나오기 전에 소가 취하됐다. 절차 다툼은 결론나지 않았다.",
      claimIds: ["claim-withdraw"],
    },
    {
      id: "sw-universal",
      date: "2021-02",
      displayDate: "2021년 2월",
      datePrecision: "month",
      title: "무상교복, 중·고 신입생 전체로",
      summary: "1만7,928명에게 30만 원 상당을 지원했다. 선별에서 보편으로 넓어졌다.",
      claimIds: ["claim-uniform-universal"],
    },
  ],

  graph: {
    note:
      "기관과 제도, 그리고 받는 쪽만 올렸다. 개인은 올리지 않는다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "seongnam", name: "성남시", kind: "government", isFocus: true,
        description: "세 사업을 예산에 담아 집행한 주체" },
      { id: "council", name: "성남시의회", kind: "government",
        description: "2016년 예산안을 의결한 곳" },
      { id: "mohw", name: "보건복지부", kind: "government",
        description: "사회보장기본법상 협의 절차를 관장하는 부처" },
      { id: "gyeonggi", name: "경기도", kind: "government",
        description: "재의요구를 지시하고 대법원에 제소한 광역단체" },
      { id: "court", name: "대법원", kind: "organization",
        description: "예산안 의결 무효확인 소송이 걸린 곳" },
      { id: "uniform", name: "무상교복", kind: "project" },
      { id: "postpartum", name: "공공산후조리", kind: "project" },
      { id: "youth", name: "청년배당", kind: "project" },
      { id: "students", name: "중·고 신입생", kind: "group",
        description: "교복을 받는 쪽" },
      { id: "mothers", name: "산모", kind: "group",
        description: "산후조리비를 받는 쪽" },
      { id: "youths", name: "만 24세 청년", kind: "group",
        description: "청년배당을 받는 쪽" },
    ],
    relations: [
      {
        id: "gw-uniform-2011",
        fromId: "seongnam",
        toId: "uniform",
        label: "기초생활수급자 자녀를 대상으로 전국 처음 시작했다.",
        startDate: "2011-02",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-uniform-2011"],
      },
      {
        id: "gw-budget",
        fromId: "council",
        toId: "seongnam",
        label: "세 사업을 함께 담은 2016년 예산안을 의결했다.",
        startDate: "2015-12",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-budget-2016"],
      },
      {
        id: "gw-uniform",
        fromId: "seongnam",
        toId: "uniform",
        label: "중학교 신입생 교복에 25억 원을 배정했다.",
        startDate: "2016-01",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-budget-2016"],
      },
      {
        id: "gw-postpartum",
        fromId: "seongnam",
        toId: "postpartum",
        label: "산후조리 지원에 56억 원을 배정했다.",
        startDate: "2016-01",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-budget-2016"],
      },
      {
        id: "gw-youth",
        fromId: "seongnam",
        toId: "youth",
        label: "청년배당에 113억 원을 배정했다. 세 사업 가운데 가장 크다.",
        startDate: "2016-01",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-budget-2016"],
      },
      {
        id: "gw-students",
        fromId: "uniform",
        toId: "students",
        label: "1인당 30만 원 상당을 현물로 준다. 2021년에는 1만7,928명이 받았다.",
        startDate: "2016-01",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-uniform-universal"],
      },
      {
        id: "gw-mothers",
        fromId: "postpartum",
        toId: "mothers",
        label: "2016년 1월 7일 산모 한 명에게 처음 지급됐다.",
        startDate: "2016-01-07",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-first-payment"],
      },
      {
        id: "gw-youths",
        fromId: "youth",
        toId: "youths",
        label: "3년 이상 거주한 만 24세에게 분기 25만 원씩 연 100만 원을 지역화폐로 준다. 소득이나 재산을 따지지 않는다.",
        startDate: "2016-01-20",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-youth"],
      },
      {
        id: "gw-mohw",
        fromId: "mohw",
        toId: "gyeonggi",
        label: "사회보장기본법상 사전협의를 거치지 않았다며 재의요구를 지시하도록 통보했다.",
        startDate: "2015-12",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-mohw"],
      },
      {
        id: "gw-reconsider",
        fromId: "gyeonggi",
        toId: "seongnam",
        label: "재의요구를 지시했다. 성남시는 따르지 않았다.",
        startDate: "2016-01",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-lawsuit"],
      },
      {
        id: "gw-sue",
        fromId: "gyeonggi",
        toId: "court",
        label: "예산안 의결 무효확인을 청구했다.",
        startDate: "2016-01",
        startPrecision: "month",
        endDate: "2018-07-02",
        assertionType: "FACT",
        claimIds: ["claim-lawsuit"],
      },
      {
        id: "gw-withdraw",
        fromId: "gyeonggi",
        toId: "court",
        label: "2018년 7월 2일 소를 취하했다. 법원 판단은 나오지 않았다.",
        startDate: "2018-07-02",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-withdraw"],
      },
    ],
  },

  counterpoints: [
    {
      id: "sw-cp-procedure",
      question: "법이 정한 절차를 어긴 것 아닌가?",
      response:
        "사회보장기본법은 지방자치단체가 사회보장제도를 신설·변경할 때 보건복지부장관과 협의하도록 한다. 복지부는 그 협의가 없었다고 봤고, 성남시는 재의요구를 따르지 않았다. 다툼은 실제로 있었고 대법원까지 갔다. 다만 법원이 옳고 그름을 가리기 전에 경기도가 소를 취하해, 절차 위반 여부는 법적으로 결론나지 않았다. 이 스토리는 그 결론을 대신 내리지 않는다.",
      claimIds: ["claim-mohw", "claim-lawsuit", "claim-withdraw"],
    },
    {
      id: "sw-cp-cash",
      question: "결국 현금 살포 아닌가?",
      response:
        "청년배당은 현금이 아니라 성남사랑상품권, 즉 지역에서만 쓰는 화폐로 지급됐다. 받은 돈이 다른 지역이나 대형 유통으로 빠져나가지 않고 지역 상권에 묶인다. 무상교복은 아예 현물이다 — 관내 신입생은 학교를 통해 교복을 받는다.",
      claimIds: ["claim-youth", "claim-uniform-universal"],
    },
    {
      id: "sw-cp-selective",
      question: "어려운 사람만 주면 되지 않나?",
      response:
        "성남시는 2011년 무상교복을 기초생활수급자 자녀부터 시작했고, 2021년에는 중·고 신입생 전체로 넓혔다. 선별에서 보편으로 간 셈이다. 어느 쪽이 나은지는 판단의 문제지만, 이 사업이 처음부터 보편이었다는 서술은 사실과 다르다.",
      claimIds: ["claim-uniform-2011", "claim-uniform-universal"],
    },
  ],

  claims: [
    {
      id: "claim-three",
      text:
        "성남시는 무상교복·공공산후조리·청년배당 세 가지를 묶어 '3대 무상복지'로 시행했다.",
      assertionType: "FACT",
      sourceIds: ["src-book", "src-press-start"],
      verified: true,
    },
    {
      id: "claim-uniform-2011",
      text:
        "성남시는 2011년 전국에서 처음으로 기초생활수급자 자녀에게 무상 교복을 지급했다.",
      assertionType: "FACT",
      sourceIds: ["src-snvision-uniform-2011", "src-book"],
      verified: true,
    },
    {
      id: "claim-uniform-universal",
      text:
        "무상교복은 이후 보편 지원으로 넓어졌다. 2021년에는 관내 중학교 신입생 8,803명, 고등학교 신입생 8,725명 등 모두 1만7,928명에게 1인당 30만 원 상당을 지원했고, 사업비는 53억7,840만 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-snvision-uniform-2021"],
      verified: true,
    },
    {
      id: "claim-youth",
      text:
        "청년배당은 3년 이상 성남에 거주한 만 24세 청년에게 분기별 25만 원씩 연 100만 원을 성남사랑상품권으로 지급하는 제도다. 소득이나 재산, 취업 여부를 따지지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-snvision-youth", "src-book"],
      verified: true,
    },
    {
      id: "claim-budget-2016",
      text:
        "2016년 예산안에 청년배당 113억 원, 산후조리비 56억 원, 무상교복 25억 원이 함께 담겼다.",
      assertionType: "FACT",
      sourceIds: ["src-press-start"],
      verified: true,
    },
    {
      id: "claim-first-payment",
      text:
        "2016년 1월 7일 산모 한 명에게 산후조리비가 처음 지급됐고, 1월 20일부터 청년배당 지급이 시작됐다.",
      assertionType: "FACT",
      sourceIds: ["src-press-start"],
      verified: true,
    },
    {
      id: "claim-mohw",
      text:
        "보건복지부는 성남시가 사회보장기본법상 사전협의 절차를 지키지 않았다며 경기도에 재의요구를 지시하도록 통보했다.",
      assertionType: "FACT",
      sourceIds: ["src-press-lawsuit"],
      verified: true,
    },
    {
      id: "claim-lawsuit",
      text:
        "성남시가 재의요구를 따르지 않자 경기도는 2016년 1월 대법원에 2016년도 예산안 의결 무효확인을 청구했다.",
      assertionType: "FACT",
      sourceIds: ["src-press-lawsuit"],
      verified: true,
    },
    {
      id: "claim-withdraw",
      text:
        "경기도는 2018년 7월 2일 이 제소를 취하했다. 대법원의 판단은 나오지 않았고, 절차 위반 여부는 법적으로 결론나지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-press-withdraw"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-book",
      title: "『밍밍 잼칠라 이장님』 — 1학기 이장님 업적(성남시장) 1·2·11",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "1. 무상 교복 / 2. 무상 산후조리 / 11. 청년 기본 소득 — " +
        "이장님업적을 하루에 한 개씩 몇 달에 걸쳐 정리해왔습니다. 오류를 범하지 않기 위해 " +
        "다양한 기사와 공보를 확인하였고 (…) 실수가 있을 수 있고 개인적인 해석임을 이해 부탁드립니다.",
    },
    {
      id: "src-snvision-uniform-2011",
      title: "전국 최초 무상 교복 지원",
      url: "https://m.snvision.seongnam.go.kr/a.html?uid=1590",
      publisher: "성남시 시정소식지 비전성남",
      publishedAt: "2011-02-25",
      type: "official",
      license: "public",
      quote: "성남시는 전국 최초로 올해부터 기초생활수급자 자녀에게 무상 교복을 지급한다.",
    },
    {
      id: "src-snvision-uniform-2021",
      title: "성남시, 중·고교 신입생 무상 교복 지원",
      url: "https://snvision.seongnam.go.kr/13553",
      publisher: "성남시 시정소식지 비전성남",
      publishedAt: "2021-02-26",
      type: "official",
      license: "public",
      quote:
        "모두 1만7,928명에 무상 교복을 지원한다 (…) 53억7,840만 원(도교육청·도비 39억7,500만 원 포함) (…) " +
        "각 입학 학교를 통해 30만 원 상당의 교복을 현물로 지원",
    },
    {
      id: "src-snvision-youth",
      title: "'기본소득 정책' 성남시 청년배당 4분기 지급",
      url: "http://snvision.seongnam.go.kr/7256",
      publisher: "성남시 시정소식지 비전성남",
      publishedAt: "2017-10-20",
      type: "official",
      license: "public",
      quote:
        "3년 이상 성남에 거주한 만 24세 청년 (…) 분기별로 25만원씩 연 100만원 (…) 성남사랑상품권(지역화폐)",
    },
    {
      id: "src-press-start",
      title: "드디어 닻 올린 성남시 3대 무상복지사업",
      url: "https://www.hankookilbo.com/news/article/201601072057099249",
      publisher: "한국일보",
      publishedAt: "2016-01-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-press-lawsuit",
      title: "성남시 3대 무상복지 재의요구 거부…경기도 대법원 제소 방침",
      url: "https://www.hankookilbo.com/news/article/201601111562866021",
      publisher: "한국일보",
      publishedAt: "2016-01-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-press-withdraw",
      title: "경기도 '성남 3대 무상복지' 대법원 제소 취하",
      url: "https://www.hankookilbo.com/news/article/201807021624730665",
      publisher: "한국일보",
      publishedAt: "2018-07-02",
      type: "press",
      license: "link-only",
    },
  ],
};

export const seongnamWelfare = achievementSchema.parse(raw);
