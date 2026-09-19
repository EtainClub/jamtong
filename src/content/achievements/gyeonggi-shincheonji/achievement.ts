import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 경기도 신천지 대응 — 명단을 달라고 기다리지 않았다.
 *
 * 책은 2학기 7에 "신천지 코로나 전수조사 지시 — 아무도 못 건드렸던 신천지"라고
 * 적는다. 수치가 없어 당시 보도로 채웠다.
 *
 * ★ 드라이브 스루는 이 업적에 넣지 않는다.
 *   책 2학기 21은 드라이브 스루 검사를 "경기도 공무원의 아이디어를 빠르게 채택"으로
 *   적지만, 전국 최초 드라이브 스루 선별진료소는 고양시가 2020년 2월 26일에 연
 *   '안심카 선별진료소'다. 고양시는 경기도 안의 기초지자체이지 경기도가 아니다.
 *   남의 공을 가져오면 나머지 근거까지 의심받는다. 빼는 편이 강하다.
 *
 * ★ 이 업적의 논지는 '무엇을 했나'가 아니라 '얼마나 빨리 했나'다.
 *   지시에서 전수조사 완료까지 이레, 총회장 검체 채취까지 열흘이다.
 *   모션 씬이 그 시간을 그린다.
 *
 * ★ 종교단체를 다루는 글이다.
 *   이 업적은 행정이 무엇을 했는지만 적는다. 신천지라는 단체나 그 신도에 대한
 *   평가는 적지 않는다. 강제 역학조사의 근거가 된 법 조항을 함께 싣고,
 *   종교의 자유에 관한 반론도 그대로 싣는다.
 */

const raw: AchievementInput = {
  id: "gyeonggi-shincheonji",
  slug: "gyeonggi-shincheonji",
  title: "경기도 신천지 대응",
  subtitle: "명단을 달라고 기다리지 않았다",
  kicker: "주요 업적",
  category: "disaster",
  summary:
    "2020년 2월 코로나19가 집단감염으로 번지던 때 경기도가 한 일이다. 2월 20일 " +
    "전수조사와 예배당 폐쇄를 지시했고, 명단 제출을 기다리는 대신 2월 25일 " +
    "감염병예방법에 근거해 과천 신천지 부속기관에 강제 역학조사를 들어가 약 4만 2천 명의 " +
    "명단을 확보했다. 이어 사흘 동안 3만 4천 명을 전화로 전수조사했다.",
  type: "event",
  publishStatus: "published",
  sourceNote:
    "날짜와 인원은 당시 보도로 확인했습니다. 경기도가 직접 낸 보도자료로 대조하는 " +
    "일과, 전수조사에서 실제로 몇 명이 확진됐는지는 아직 확인하지 못했습니다. " +
    "그래서 이 업적은 '무엇을 얼마나 빨리 했나'까지만 적고 '그래서 확산이 얼마나 " +
    "줄었나'는 적지 않습니다.",

  headlineKeyNumberId: "kn-days",

  scenes: [
    {
      id: "speed",
      kind: "quantity-track",
      heading: "열흘 사이에 일어난 일입니다",
      lede:
        "보도로 날짜가 확인된 시점만 짚습니다. 스크롤하면 그 열흘을 지나갑니다.",
      claimIds: ["claim-order", "claim-entry", "claim-survey", "claim-lee"],
      track: {
        label: "지시로부터 흐른 시간",
        unit: "일",
        direction: "up",
        max: 11,
        note:
          "값은 보도에 적힌 날짜에서 계산한 날수다. 2020년 2월 20일 지시를 0일로 둔다. " +
          "'며칠이 걸렸다'는 수치가 따로 실린 자료가 있는 것은 아니다.",
        checkpoints: [
          {
            id: "cp-order",
            displayDate: "2020년 2월 20일",
            title: "전수조사와 예배당 폐쇄를 지시했다",
            amount: 0,
            caption:
              "도내 모든 신천지 예배당을 즉시 폐쇄하고 집회와 봉사활동을 중단하라고 지시했습니다. 신도 전수조사도 함께 지시했습니다.",
            art: "covid-order",
            claimId: "claim-order",
          },
          {
            id: "cp-entry",
            displayDate: "2020년 2월 25일",
            title: "기다리지 않고 직접 들어갔다",
            amount: 5,
            caption:
              "오전 10시 30분, 과천 신천지 부속기관에 강제 역학조사를 집행했습니다. 감염병예방법 제47조와 제49조가 근거였습니다.",
            art: "covid-entry",
            claimId: "claim-entry",
          },
          {
            id: "cp-survey",
            displayDate: "2020년 2월 28일",
            title: "사흘 만에 3만 4천 명",
            amount: 8,
            caption:
              "확보한 명단으로 도 연고 신도 3만 4천 명을 2월 26일부터 사흘 동안 전화로 전수조사했습니다.",
            art: "covid-calls",
            claimId: "claim-survey",
          },
          {
            id: "cp-lee",
            displayDate: "2020년 3월 2일",
            title: "총회장 검체까지",
            amount: 11,
            caption:
              "오후 7시 40분경 과천시보건소에서 이만희 총회장의 검체를 채취했습니다.",
            art: "covid-speed",
            claimId: "claim-lee",
          },
        ],
      },
    },
    {
      id: "force",
      kind: "composition",
      heading: "그날 동원된 인력",
      lede:
        "지자체가 행정력을 동원해 종교시설을 강제조사한 것은 이례적인 일이었습니다. 2020년 2월 25일 과천 현장입니다.",
      claimIds: ["claim-entry"],
      composition: {
        total: 197,
        unit: "명",
        totalLabel: "과천 현장에 투입된 인원",
        claimId: "claim-entry",
        note:
          "경찰 기동대는 만일의 사태에 대비해 배치된 인원이다. 실제 역학조사를 수행한 " +
          "인력은 역학조사관 2명과 지원인력 25명이다.",
        groups: [
          {
            id: "fo-police",
            label: "경찰 기동대",
            amount: 150,
            sharePercent: 76.1,
            tone: "neutral",
            detail: "만일의 사태 대비",
          },
          {
            id: "fo-support",
            label: "역학조사 지원인력",
            amount: 25,
            sharePercent: 12.7,
            tone: "primary",
          },
          {
            id: "fo-officials",
            label: "공무원",
            amount: 20,
            sharePercent: 10.2,
            tone: "primary",
          },
          {
            id: "fo-epi",
            label: "역학조사관",
            amount: 2,
            sharePercent: 1.0,
            tone: "accent",
            detail: "조사를 실제로 수행",
          },
        ],
      },
    },
  ],

  shorts: [
    {
      id: "short-sc-01",
      title: "명단을 기다리지 않은 열하루",
      summary:
        "지시에서 총회장 검체 채취까지 열하루입니다. 효과가 아니라 속도를 다룹니다.",
      youtubeId: "wrcLaAtmzPA",
      claimIds: ["claim-order", "claim-entry", "claim-survey", "claim-lee"],
      publishedAt: "2026-09-19",
    },
  ],

  eli5: {
    intro:
      "2020년 봄, 병이 한곳에서 크게 번지고 있었어요. 경기도가 무엇을 했는지 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-sc-spread",
        title: "한곳에서 병이 크게 번졌어요",
        say: "사람들이 많이 모이는 곳에서 병이 빠르게 퍼졌어요. 누가 그 자리에 있었는지 알아야 막을 수 있었어요.",
        art: "covid-spread",
        fact: { value: "2020년 2월", tone: "warm" },
        claimIds: ["claim-order"],
      },
      {
        id: "e-sc-order",
        title: "먼저 문을 닫으라고 했어요",
        say: "도지사가 도 안의 모든 예배당을 당장 닫고 모임을 멈추라고 했어요. 그리고 신도들을 모두 조사하겠다고 했어요.",
        art: "covid-order",
        fact: { value: "2월 20일", tone: "ice" },
        claimIds: ["claim-order"],
      },
      {
        id: "e-sc-wait",
        title: "그런데 명단을 주지 않았어요",
        say: "누가 그 자리에 있었는지 알려면 명단이 필요했어요. 기다리기만 하면 그사이에 병은 계속 퍼져요.",
        art: "covid-list",
        fact: { value: "기다릴 수 없다", tone: "warm" },
        claimIds: ["claim-entry"],
      },
      {
        id: "e-sc-entry",
        title: "그래서 직접 들어갔어요",
        say: "법에 그렇게 할 수 있다고 적혀 있었어요. 2월 25일 아침, 조사관들이 직접 가서 명단을 확보했어요. 4만 2천 명분이었어요.",
        art: "covid-entry",
        fact: { value: "4만 2천 명", tone: "ice" },
        claimIds: ["claim-entry"],
      },
      {
        id: "e-sc-calls",
        title: "사흘 동안 전화를 돌렸어요",
        say: "3만 4천 명에게 전화를 걸어 어디에 있었는지, 아픈 데는 없는지 물었어요. 사흘 만에 다 했어요.",
        art: "covid-calls",
        fact: { value: "3일", tone: "ice" },
        claimIds: ["claim-survey"],
      },
      {
        id: "e-sc-speed",
        title: "열흘 사이에 일어난 일이에요",
        say: "문을 닫으라고 한 날부터 총회장 검사를 한 날까지 열흘이 걸렸어요. 병을 막을 때는 빠른 게 제일 중요하니까요.",
        art: "covid-speed",
        fact: { value: "11일", tone: "ice" },
        claimIds: ["claim-lee"],
      },
    ],
    caveat: {
      text:
        "이 조사로 병이 얼마나 덜 퍼졌는지는 여기 적지 않았어요. 그건 숫자로 확인하지 못했거든요. 무엇을 얼마나 빨리 했는지까지만 적었어요.",
      claimIds: ["claim-survey"],
    },
  },

  keyNumbers: [
    {
      id: "kn-days",
      label: "지시에서 총회장 검체까지",
      value: "11",
      unit: "일",
      caption: "2020년 2월 20일 → 3월 2일",
      claimId: "claim-lee",
    },
    {
      id: "kn-list",
      label: "확보한 명단",
      prefix: "약",
      value: "4만 2천",
      unit: "명",
      caption: "2020년 2월 25일 강제 역학조사",
      claimId: "claim-entry",
    },
    {
      id: "kn-survey",
      label: "사흘 동안 전수조사한 인원",
      prefix: "약",
      value: "3만 4천",
      unit: "명",
      caption: "도 연고 신도 · 전화 문진",
      claimId: "claim-survey",
    },
  ],

  timeline: [
    {
      id: "sc-order",
      date: "2020-02-20",
      displayDate: "2020년 2월 20일",
      datePrecision: "day",
      title: "예배당 폐쇄와 전수조사 지시",
      summary:
        "도내 모든 신천지 예배당을 즉시 폐쇄하고 집회·봉사활동을 중단하라고 지시했다.",
      claimIds: ["claim-order"],
    },
    {
      id: "sc-entry",
      date: "2020-02-25",
      displayDate: "2020년 2월 25일",
      datePrecision: "day",
      title: "과천 부속기관 강제 역학조사",
      summary:
        "감염병예방법 제47조·제49조에 근거해 강제 역학조사를 집행하고 약 4만 2천 명의 명단을 확보했다.",
      claimIds: ["claim-entry"],
    },
    {
      id: "sc-survey",
      date: "2020-02-26",
      displayDate: "2020년 2월 26일",
      datePrecision: "day",
      title: "3만 4천 명 전수조사 착수",
      summary: "도 연고 신도 3만 4천 명을 대상으로 전화 문진을 시작해 사흘 만에 마쳤다.",
      claimIds: ["claim-survey"],
    },
    {
      id: "sc-lee",
      date: "2020-03-02",
      displayDate: "2020년 3월 2일",
      datePrecision: "day",
      title: "이만희 총회장 검체 채취",
      summary: "과천시보건소에서 오후 7시 40분경 검체를 채취했다.",
      claimIds: ["claim-lee"],
    },
  ],

  graph: {
    note:
      "무엇이 무엇을 가능하게 했는지를 그렸다. 법과 명단과 시간이 이 대응의 세 축이다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "gyeonggi", name: "경기도", kind: "government", isFocus: true,
        description: "지시하고 집행한 주체" },
      { id: "law", name: "감염병예방법", kind: "project",
        description: "제47조·제49조. 강제 역학조사의 근거" },
      { id: "facility", name: "과천 부속기관", kind: "organization",
        description: "2020년 2월 25일 강제 역학조사가 집행된 곳" },
      { id: "list", name: "신도 명단", kind: "project",
        description: "약 4만 2천 명분. 전수조사의 출발점" },
      { id: "members", name: "도 연고 신도", kind: "group",
        description: "3만 4천 명. 전화 문진 대상" },
      { id: "police", name: "경찰", kind: "government",
        description: "만일의 사태에 대비해 기동대 150명 배치" },
      { id: "residents", name: "도민", kind: "group",
        description: "확산을 막으려 한 대상" },
    ],
    relations: [
      {
        id: "sc-r-order",
        fromId: "gyeonggi",
        toId: "facility",
        label: "도내 예배당을 즉시 폐쇄하고 집회를 중단하라고 지시했다.",
        startDate: "2020-02-20",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-order"],
      },
      {
        id: "sc-r-law",
        fromId: "law",
        toId: "gyeonggi",
        label: "제47조·제49조가 강제 역학조사의 근거가 됐다.",
        startDate: "2020-02-25",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-entry"],
      },
      {
        id: "sc-r-entry",
        fromId: "gyeonggi",
        toId: "list",
        label: "명단 제출을 기다리는 대신 직접 들어가 약 4만 2천 명분을 확보했다.",
        startDate: "2020-02-25",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-entry"],
      },
      {
        id: "sc-r-police",
        fromId: "police",
        toId: "facility",
        label: "만일의 사태에 대비해 기동대 150명이 배치됐다.",
        startDate: "2020-02-25",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-entry"],
      },
      {
        id: "sc-r-survey",
        fromId: "list",
        toId: "members",
        label: "그 명단으로 3만 4천 명을 사흘 만에 전화로 조사했다.",
        startDate: "2020-02-26",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-survey"],
      },
      {
        id: "sc-r-protect",
        fromId: "gyeonggi",
        toId: "residents",
        label: "확산을 막으려면 속도가 우선이라는 판단으로 움직였다.",
        startDate: "2020-02-26",
        startPrecision: "day",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-survey", "claim-order"],
      },
    ],
  },

  counterpoints: [
    {
      id: "sc-cp-freedom",
      question: "종교의 자유를 침해한 것 아닌가?",
      response:
        "강제 역학조사의 근거는 감염병의 예방 및 관리에 관한 법률 제47조와 제49조다. 대상은 종교 활동 자체가 아니라 감염병 확산을 막기 위한 역학조사였고, 조사한 내용은 집회 참석 여부와 건강 상태였다. 다만 지자체가 행정력을 동원해 종교시설을 강제조사한 것은 당시로서 이례적인 일이었다는 평가가 함께 있었다.",
      claimIds: ["claim-entry"],
    },
    {
      id: "sc-cp-police",
      question: "경찰 150명까지 동원할 일이었나?",
      response:
        "경찰 기동대는 조사를 수행한 인력이 아니라 만일의 사태에 대비해 배치된 인원이다. 실제 역학조사를 한 사람은 역학조사관 2명과 지원인력 25명이었다. 현장에 투입된 197명 가운데 조사 인력은 27명이다.",
      claimIds: ["claim-entry"],
    },
    {
      id: "sc-cp-effect",
      question: "그래서 확산이 얼마나 줄었나?",
      response:
        "이 위키는 그 답을 갖고 있지 않다. 전수조사에서 몇 명이 확진됐는지, 그 조치로 확산이 얼마나 줄었는지를 보여주는 자료를 아직 확인하지 못했다. 그래서 여기에는 무엇을 얼마나 빨리 했는지까지만 적었다. 확인하지 못한 것을 성과로 적지 않는다.",
      claimIds: ["claim-survey"],
    },
  ],

  claims: [
    {
      id: "claim-order",
      text:
        "이재명 경기도지사는 2020년 2월 20일 도내 모든 신천지 예배당을 즉시 폐쇄하고 일체의 집회·봉사활동을 중단하도록 지시했으며, 신도 전수조사를 실시하겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-0221", "src-book-7"],
      verified: true,
    },
    {
      id: "claim-entry",
      text:
        "2020년 2월 25일 오전 10시 30분 경기도는 과천시 별양동의 신천지예수교회 부속기관에 대해 감염병의 예방 및 관리에 관한 법률 제47조·제49조에 근거한 강제 역학조사를 집행했다. 역학조사관 2명, 지원인력 25명, 공무원 20명이 투입됐고 경찰 기동대 약 150명이 배치됐다. 이 조사로 약 4만 2천 명분의 명단을 확보했다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-0225"],
      verified: true,
    },
    {
      id: "claim-survey",
      text:
        "경기도는 확보한 명단을 바탕으로 도 연고 신천지 신도 약 3만 4천 명을 대상으로 2020년 2월 26일부터 28일까지 사흘간 전화 문진 방식의 전수조사를 진행했다. 명단에는 도 연고 신도 33,840명과 2월 16일 과천예배 참석자 9,930명 등이 포함됐다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-0226"],
      verified: true,
    },
    {
      id: "claim-lee",
      text:
        "2020년 3월 2일 오후 7시 40분경 과천시보건소에서 신천지 이만희 총회장의 검체가 채취됐다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeongin-2024"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-hankook-0221",
      title: "이재명 경기지사 “신천지 전수조사 실시…예배당 즉시 폐쇄하라”",
      url: "https://www.hankookilbo.com/News/Read/202002210812394244",
      publisher: "한국일보",
      publishedAt: "2020-02-21",
      type: "press",
      license: "quotable",
      quote:
        "지역사회 감염확산을 저지하기 위해 신천지 신자들이 활동한 장소를 모조리 파악하고 " +
        "신속한 방역활동을 전개할 예정",
    },
    {
      id: "src-seoul-0225",
      title: "경기도, 강제 역학조사로 신천지 신도 4만여명 명단 확보",
      url: "https://www.seoul.co.kr/news/society/2020/02/25/20200225500216",
      publisher: "서울신문",
      publishedAt: "2020-02-25",
      type: "press",
      license: "quotable",
      quote:
        "감염병의 예방 및 관리에 관한 법률 제47조 및 제49조에 따라 역학조사관 2명, " +
        "지원인력 25명, 공무원 20명을 투입했고 경찰 기동대 150여 명이 배치됐다. " +
        "대규모 감염을 막기 위한 골든타임을 놓칠 수 없어 신천지 측이 명단을 제출할 때까지 " +
        "더는 지체할 시간적 여유도 없었다",
    },
    {
      id: "src-seoul-0226",
      title: "경기도, 신천지 신도 3만4000명 전수조사 착수…“사흘내 끝낸다”",
      url: "https://www.seoul.co.kr/news/society/2020/02/26/20200226500078",
      publisher: "서울신문",
      publishedAt: "2020-02-26",
      type: "press",
      license: "quotable",
      quote:
        "도 연고 신도 33,840명, 2월 16일 과천예배 참석자 9,930명 등의 명단을 확보해 " +
        "26일부터 28일까지 전화로 전수조사한다. 감염병 대응은 정확성과 속도가 중요한데 " +
        "그중에서 속도가 더 중요하다",
    },
    {
      id: "src-kyeongin-2024",
      title: "이만희 코로나 검체 채취한 이재명, 경기도와 신천지 악연 그때였다",
      url: "https://www.kyeongin.com/article/1718795",
      publisher: "경인일보",
      publishedAt: "2024-11-15",
      type: "press",
      license: "quotable",
      quote:
        "2020년 3월 2일 오후 7시 40분께 과천시보건소에서 이만희 총회장의 검체가 채취됐다.",
    },
    {
      id: "src-book-7",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 7",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "7. 신천지 코로나 전수조사 지시 — 아무도 못 건드렸던 신천지. 이장님이 코 쑤셨잖아.",
    },
  ],
};

export const gyeonggiShincheonji = achievementSchema.parse(raw);
