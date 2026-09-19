import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 경기도 수술실 CCTV — 먼저 하고, 법이 따라왔다.
 *
 * 책은 2학기 9에 "국공립 병원 수술실 CCTV설치"로 적는다. 수치도 경과도 없다.
 * 당시 보도로 채웠다.
 *
 * ★ 이 업적의 논지는 설치가 아니라 순서다.
 *   경기도가 2018년 10월 안성병원 한 곳에서 시작해 2019년 5월 도내 공공의료원
 *   여섯 곳으로 넓혔고, 2021년 8월 31일 국회가 의료법을 고쳐 전국 병원에
 *   의무화했다. 한 지자체가 먼저 해 보고 그것이 법이 된 경우다.
 *
 * ★ 가이드의 D 묶음을 쪼갰다.
 *   애초에 3(닥터헬기)·9(수술실 CCTV)·43(휴게소 공공병원)·52(헬기 안전장치)를
 *   'D. 공공의료와 응급'으로 묶으려 했는데, 넷이 한 논지를 이루지 않는다.
 *   수술실 CCTV는 '먼저 하고 법이 따라왔다'는 완결된 이야기라 단독으로 세운다.
 *   나머지 셋은 응급의료로 따로 묶는 편이 낫다.
 *
 * ★ 반대가 있었다는 사실을 지운다면 이 업적은 절반만 적는 것이다.
 *   의료계는 반대했고 법 통과 뒤 헌법소원도 냈다. 쟁점 섹션에 그대로 싣는다.
 *   책도 "나는 설치반대하는 이유의 타당성을 찾지 못했어"라고 적어, 반대가
 *   있었다는 것 자체는 감추지 않는다.
 */

const raw: AchievementInput = {
  id: "gyeonggi-or-cctv",
  slug: "gyeonggi-or-cctv",
  title: "경기도 수술실 CCTV",
  subtitle: "한 병원에서 시작해 전국 법이 되기까지",
  kicker: "주요 업적",
  categories: ["institution", "welfare"],
  summary:
    "환자가 잠든 사이 수술실에서 무슨 일이 있었는지 확인할 방법이 없다는 데서 " +
    "시작한 일이다. 경기도는 2018년 10월 경기도의료원 안성병원에 전국 처음으로 " +
    "수술실 CCTV를 시범 설치했고, 2019년 5월 도내 공공의료원 여섯 곳으로 넓혔다. " +
    "3년 뒤인 2021년 8월 31일 국회가 의료법을 고쳐 전국 병원에 의무화했다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "설치 시점과 동의율, 민간 지원 규모, 법 개정 경과는 당시 보도로 확인했습니다. " +
    "경기도가 직접 낸 보도자료로 대조하는 일은 아직 남아 있습니다. 촬영된 영상이 " +
    "실제로 분쟁 해결에 쓰인 사례가 몇 건인지는 확인하지 못했습니다.",

  headlineKeyNumberId: "kn-consent",

  scenes: [
    {
      id: "spread",
      kind: "quantity-track",
      heading: "한 곳에서 전국까지",
      lede:
        "보도로 시점이 확인된 것만 짚습니다. 스크롤하면 3년을 지나갑니다.",
      claimIds: ["claim-first", "claim-six", "claim-private", "claim-law"],
      track: {
        label: "수술실 CCTV를 둔 병원",
        unit: "곳",
        direction: "up",
        max: 20,
        note:
          "마지막 시점은 병원 수가 아니라 법이다. 2021년 의료법 개정으로 전신마취 " +
          "수술을 하는 전국의 모든 병원이 대상이 됐으므로, 여기서 세던 '곳'의 단위를 " +
          "넘어선다. 그래서 막대는 거기서 끝난다.",
        checkpoints: [
          {
            id: "or-cp-first",
            displayDate: "2018년 10월",
            title: "안성병원 한 곳에서",
            amount: 1,
            caption:
              "경기도의료원 안성병원에 전국에서 처음으로 수술실 CCTV를 시범 설치했습니다.",
            art: "or-firstcam",
            claimId: "claim-first",
          },
          {
            id: "or-cp-six",
            displayDate: "2019년 5월",
            title: "도내 공공의료원 여섯 곳으로",
            amount: 6,
            caption:
              "수원·의정부·파주·이천·포천 등 경기도의료원 산하 여섯 개 병원으로 전면 확대했습니다.",
            art: "or-sixhospitals",
            claimId: "claim-six",
          },
          {
            id: "or-cp-private",
            displayDate: "2020년 5월 25일",
            title: "민간병원 열두 곳까지",
            amount: 18,
            caption:
              "민간 병원급 의료기관 12곳에 설치비의 약 60%인 3천만 원씩을 지원하기로 했습니다.",
            art: "or-private",
            claimId: "claim-private",
          },
          {
            id: "or-cp-law",
            displayDate: "2021년 8월 31일",
            title: "그리고 법이 됐다",
            amount: 20,
            caption:
              "국회가 의료법을 고쳐 전신마취 수술을 하는 전국의 모든 병원에 수술실 CCTV를 의무화했습니다. 찬성 135, 반대 24, 기권 24였습니다.",
            art: "or-nationwide",
            claimId: "claim-law",
          },
        ],
      },
    },
    {
      id: "consent",
      kind: "composition",
      heading: "환자들은 촬영에 동의했나",
      lede:
        "설치는 의무여도 촬영은 환자가 정합니다. 2018년 10월부터 2019년 12월까지의 수술 4,239건입니다.",
      claimIds: ["claim-consent"],
      composition: {
        total: 4239,
        unit: "건",
        totalLabel: "그 기간의 전체 수술",
        claimId: "claim-consent",
        note:
          "경기도의료원 산하 여섯 개 병원의 집계다. 동의하지 않으면 촬영하지 않는다. " +
          "촬영된 영상도 의료사고 의심 같은 사유가 없으면 열어 보지 않는다.",
        groups: [
          {
            id: "or-yes",
            label: "환자가 촬영에 동의",
            amount: 2850,
            sharePercent: 67.2,
            tone: "primary",
          },
          {
            id: "or-no",
            label: "동의하지 않음",
            amount: 1389,
            sharePercent: 32.8,
            tone: "neutral",
            detail: "촬영하지 않았다",
          },
        ],
      },
    },
  ],

  shorts: [
    {
      id: "short-or-01",
      title: "한 병원의 시도가 전국의 법이 되기까지",
      summary:
        "2018년 안성병원 한 곳에서 시작해 2021년 전국 의무화까지 간 3년을 다룹니다. 촬영 여부를 정하는 쪽은 환자입니다.",
      youtubeId: "YJs9c1Sh818",
      claimIds: ["claim-first", "claim-consent", "claim-law"],
      publishedAt: "2026-09-19",
    },
  ],

  eli5: {
    intro:
      "수술을 받을 때는 잠들어 있어요. 그 사이에 무슨 일이 있었는지 알 방법이 없었어요. 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-or-closed",
        title: "수술실 문은 닫혀 있어요",
        say: "수술을 받는 사람은 잠들어 있어요. 가족은 밖에서 기다려요. 안에서 무슨 일이 있었는지 아무도 볼 수 없어요.",
        art: "or-closed",
        fact: { value: "볼 수 없다", tone: "warm" },
        claimIds: ["claim-first"],
      },
      {
        id: "e-or-first",
        title: "한 병원에 카메라를 달았어요",
        say: "2018년 10월, 경기도가 안성병원 수술실에 카메라를 달았어요. 전국에서 처음이었어요.",
        art: "or-firstcam",
        fact: { value: "2018년 10월", tone: "ice" },
        claimIds: ["claim-first"],
      },
      {
        id: "e-or-consent",
        title: "찍을지는 환자가 정해요",
        say: "카메라가 있다고 무조건 찍는 게 아니에요. 환자가 찍어 달라고 해야 찍어요. 열에 일곱 정도가 찍어 달라고 했어요.",
        art: "or-consent",
        fact: { value: "67%", tone: "ice" },
        claimIds: ["claim-consent"],
      },
      {
        id: "e-or-six",
        title: "여섯 병원으로 늘렸어요",
        say: "해 보니 괜찮았어요. 그래서 경기도가 가진 병원 여섯 곳 모두에 달았어요.",
        art: "or-sixhospitals",
        fact: { value: "6개 병원", tone: "ice" },
        claimIds: ["claim-six"],
      },
      {
        id: "e-or-private",
        title: "다른 병원도 돕기로 했어요",
        say: "경기도 병원이 아닌 곳에도 달 수 있게 돈을 보탰어요. 열두 곳에 설치비를 나눠 줬어요.",
        art: "or-private",
        fact: { value: "12곳", tone: "ice" },
        claimIds: ["claim-private"],
      },
      {
        id: "e-or-law",
        title: "3년 뒤에 법이 됐어요",
        say: "2021년, 국회가 법을 고쳤어요. 이제는 전국의 모든 병원이 수술실에 카메라를 달아야 해요.",
        art: "or-nationwide",
        fact: { value: "2021년 8월 31일", tone: "ice" },
        claimIds: ["claim-law"],
      },
    ],
    caveat: {
      text:
        "반대하는 사람도 많았어요. 의사들은 수술에 방해가 되고 사생활이 걱정된다고 했어요. 법이 통과된 뒤에는 헌법에 어긋난다며 다투기도 했어요.",
      claimIds: ["claim-law"],
    },
  },

  keyNumbers: [
    {
      id: "kn-consent",
      label: "환자 촬영 동의율",
      value: "67",
      unit: "%",
      caption: "수술 4,239건 중 2,850건 · 2018년 10월~2019년 12월",
      claimId: "claim-consent",
    },
    {
      id: "kn-years",
      label: "첫 설치에서 법 개정까지",
      value: "3",
      unit: "년",
      caption: "2018년 10월 → 2021년 8월",
      claimId: "claim-law",
    },
    {
      id: "kn-support",
      label: "민간병원 설치비 지원",
      value: "3,000",
      unit: "만 원",
      caption: "12곳 · 설치비의 약 60%",
      claimId: "claim-private",
    },
  ],

  timeline: [
    {
      id: "or-first",
      date: "2018-10",
      displayDate: "2018년 10월",
      datePrecision: "month",
      title: "안성병원 시범 설치",
      summary: "경기도의료원 안성병원에 전국에서 처음으로 수술실 CCTV를 시범 설치했다.",
      claimIds: ["claim-first"],
    },
    {
      id: "or-six",
      date: "2019-05",
      displayDate: "2019년 5월",
      datePrecision: "month",
      title: "도내 공공의료원 전면 확대",
      summary:
        "수원·의정부·파주·이천·포천 등 경기도의료원 산하 여섯 개 병원으로 넓혔다.",
      claimIds: ["claim-six"],
    },
    {
      id: "or-consent",
      date: "2020-01-14",
      displayDate: "2020년 1월 14일",
      datePrecision: "day",
      title: "동의율 67%로 정착",
      summary:
        "2018년 10월부터 2019년 12월까지 수술 4,239건 중 2,850건이 환자 동의로 촬영됐다.",
      claimIds: ["claim-consent"],
    },
    {
      id: "or-private",
      date: "2020-05-25",
      displayDate: "2020년 5월 25일",
      datePrecision: "day",
      title: "민간병원 12곳 설치비 지원",
      summary: "병원급 의료기관 12곳에 설치비의 약 60%인 3천만 원씩을 지원하기로 했다.",
      claimIds: ["claim-private"],
    },
    {
      id: "or-law",
      date: "2021-08-31",
      displayDate: "2021년 8월 31일",
      datePrecision: "day",
      title: "의료법 개정, 전국 의무화",
      summary:
        "국회가 전신마취 수술을 하는 전국 병원의 수술실 CCTV 설치를 의무화했다. 2년 유예를 거쳐 2023년 시행됐다.",
      claimIds: ["claim-law"],
    },
  ],

  graph: {
    note:
      "한 지자체에서 시작한 것이 어떻게 전국의 법이 됐는지를 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "gyeonggi", name: "경기도", kind: "government", isFocus: true,
        description: "먼저 해 본 주체" },
      { id: "ansung", name: "안성병원", kind: "organization",
        description: "2018년 10월 전국 첫 설치" },
      { id: "medical6", name: "경기도의료원 6곳", kind: "organization",
        description: "2019년 5월 전면 확대" },
      { id: "private", name: "민간 병원 12곳", kind: "organization",
        description: "설치비 3천만 원씩 지원" },
      { id: "patients", name: "환자", kind: "group",
        description: "촬영 여부를 정하는 쪽" },
      { id: "doctors", name: "의료계", kind: "group",
        description: "반대하고 법 통과 뒤 헌법소원을 낸 쪽" },
      { id: "assembly", name: "국회", kind: "government",
        description: "2021년 의료법을 고쳐 전국에 의무화" },
    ],
    relations: [
      {
        id: "or-r-first",
        fromId: "gyeonggi",
        toId: "ansung",
        label: "전국에서 처음으로 수술실 CCTV를 시범 설치했다.",
        startDate: "2018-10",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-first"],
      },
      {
        id: "or-r-six",
        fromId: "gyeonggi",
        toId: "medical6",
        label: "시범 운영 뒤 도내 공공의료원 여섯 곳으로 넓혔다.",
        startDate: "2019-05",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-six"],
      },
      {
        id: "or-r-choice",
        fromId: "patients",
        toId: "medical6",
        label: "촬영 여부는 환자가 정했다. 수술 4,239건 중 2,850건이 동의였다.",
        startDate: "2020-01-14",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-consent"],
      },
      {
        id: "or-r-private",
        fromId: "gyeonggi",
        toId: "private",
        label: "민간 병원 12곳에 설치비의 약 60%를 보탰다.",
        startDate: "2020-05-25",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-private"],
      },
      {
        id: "or-r-oppose",
        fromId: "doctors",
        toId: "assembly",
        label: "의료계는 반대했고 법이 통과된 뒤 헌법소원을 냈다.",
        startDate: "2021-08-31",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-law"],
      },
      {
        id: "or-r-law",
        fromId: "assembly",
        toId: "patients",
        label: "의료법을 고쳐 전국 병원에 의무화했다. 찬성 135, 반대 24, 기권 24.",
        startDate: "2021-08-31",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-law"],
      },
    ],
  },

  counterpoints: [
    {
      id: "or-cp-privacy",
      question: "환자의 몸이 찍히는 것 아닌가?",
      response:
        "촬영 여부를 정하는 쪽은 환자다. 경기도의료원에서 2018년 10월부터 2019년 12월까지 이뤄진 수술 4,239건 가운데 2,850건이 동의로 촬영됐고 나머지는 촬영하지 않았다. 경기도는 의료사고 의심 같은 명백한 사유가 없으면 영상을 열어 보는 일조차 없다고 밝혔다.",
      claimIds: ["claim-consent"],
    },
    {
      id: "or-cp-doctors",
      question: "의사를 감시하려는 것 아닌가?",
      response:
        "의료계는 수술 집중을 방해하고 의료진의 사생활을 침해한다며 반대했고, 2021년 법이 통과된 뒤에는 헌법소원을 냈다. 반대가 있었다는 사실은 이 업적의 일부다. 책도 그 반대를 언급하며 '설치반대하는 이유의 타당성을 찾지 못했다'고 적는다. 어느 쪽이 옳은지는 여기서 판단하지 않고, 경기도가 무엇을 했고 국회가 어떻게 결정했는지만 적는다.",
      claimIds: ["claim-law"],
    },
    {
      id: "or-cp-effect",
      question: "실제로 분쟁을 줄였나?",
      response:
        "그 답은 이 위키에 없다. 촬영된 영상이 의료분쟁 해결에 몇 건이나 쓰였는지, 분쟁이 얼마나 줄었는지를 보여주는 자료를 확인하지 못했다. 확인한 것은 설치 경과와 동의율, 그리고 3년 뒤 법이 바뀌었다는 사실까지다.",
      claimIds: ["claim-consent", "claim-law"],
    },
  ],

  claims: [
    {
      id: "claim-first",
      text:
        "경기도는 2018년 10월 경기도의료원 안성병원에 전국에서 처음으로 수술실 CCTV를 시범 설치했다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-or-2020", "src-seoul-law-2021", "src-book-9"],
      verified: true,
    },
    {
      id: "claim-six",
      text:
        "경기도는 2019년 5월 수원·의정부·파주·이천·포천 등 경기도의료원 산하 여섯 개 병원의 수술실로 CCTV를 전면 확대했다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-private-2020", "src-seoul-or-2020"],
      verified: true,
    },
    {
      id: "claim-consent",
      text:
        "2018년 10월부터 2019년 12월까지 경기도의료원 산하 병원에서 이뤄진 수술 4,239건 가운데 2,850건(67%)이 환자 동의로 촬영·녹화됐다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-or-2020"],
      verified: true,
    },
    {
      id: "claim-private",
      text:
        "경기도는 2020년 5월 민간 병원급 의료기관 12곳을 대상으로 수술실 CCTV 설치비의 약 60%인 3천만 원씩을 지원하기로 했다. 치과병원·한방병원·요양병원은 제외됐다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-private-2020"],
      verified: true,
    },
    {
      id: "claim-law",
      text:
        "2021년 8월 31일 국회 본회의는 전신마취 등 환자가 의식 없는 상태에서 수술하는 병원에 수술실 CCTV 설치를 의무화하는 의료법 개정안을 찬성 135, 반대 24, 기권 24로 통과시켰다. 2년의 유예를 거쳐 2023년 시행됐으며, 촬영은 환자나 보호자가 요청할 때 이뤄진다. 의료계는 법 통과 뒤 헌법소원을 냈다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-law-2021", "src-seoul-hunbeop-2023"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-seoul-or-2020",
      title: "경기도 수술실 CCTV, 제도 정착단계..동의율 67%",
      url: "https://www.seoul.co.kr/news/society/2020/01/14/20200114500096",
      publisher: "서울신문",
      publishedAt: "2020-01-14",
      type: "press",
      license: "quotable",
      quote:
        "2018년 10월부터 2019년 12월까지 시행한 수술 4,239건 가운데 67%인 2,850건에 대해 " +
        "환자 동의로 CCTV 촬영과 녹화가 이뤄졌다. 의료사고 의심 등 명백한 사유 없이는 " +
        "영상물이 사용될 일조차 없다",
    },
    {
      id: "src-seoul-private-2020",
      title: "경기도 ‘수술실 CCTV’ 민간병원 확대 추진…12곳 설치비 지원",
      url: "https://www.seoul.co.kr/news/society/health-welfare/2020/05/25/20200525500089",
      publisher: "서울신문",
      publishedAt: "2020-05-25",
      type: "press",
      license: "quotable",
      quote:
        "병원급 의료기관 12곳에 설치비의 약 60%인 3,000만 원씩을 지원한다. " +
        "2018년 10월 경기도의료원 안성병원에 처음 도입한 후 지난해 5월 수원·의정부·파주·이천·포천 등 " +
        "산하 6개 병원으로 전면 확대했다",
    },
    {
      id: "src-seoul-law-2021",
      title: "수술실 CCTV법 통과, 국회 문턱 넘었다…의료계 법적 투쟁 경고",
      url: "https://www.seoul.co.kr/news/society/2021/09/01/20210901500002",
      publisher: "서울신문",
      publishedAt: "2021-09-01",
      type: "press",
      license: "quotable",
      quote:
        "국회는 31일 본회의에서 의료법 개정안을 찬성 135, 반대 24, 기권 24로 통과시켰다. " +
        "경기도는 전국에서 처음으로 2018년 경기도의료원 안성병원에 수술실 CCTV를 시범 설치했고, " +
        "2019년 도내 공공의료원의 수술실에 CCTV 설치를 의무화했다",
    },
    {
      id: "src-seoul-hunbeop-2023",
      title: "수술실 CCTV 의무화 코앞인데… 헌법소원에 실효성 논란까지",
      url: "https://www.seoul.co.kr/news/society/2023/09/11/20230911009001",
      publisher: "서울신문",
      publishedAt: "2023-09-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-book-9",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 9",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "9. 국공립 병원 수술실 CCTV설치 — 의사와 환자, 서로에게 벌어질 수 있는 억울한 일을 " +
        "풀어 줄 방법이 아닐까. 나는 설치반대하는 이유의 타당성을 찾지 못했어.",
    },
  ],
};

export const gyeonggiOrCctv = achievementSchema.parse(raw);
