import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 경기도 극저신용대출 — 사채로 가는 길을 막고, 대신 빌려줬다.
 *
 * 책은 두 항목으로 나눠 적는다(2학기 2 극 저신용 대출, 15 고금리 사채업자 퇴출).
 * 둘은 한 쌍이다. 사채를 없애기만 하면 돈이 급한 사람은 갈 곳이 사라진다.
 * 책도 그 지적을 그대로 옮긴다 — "돈 30만 원이 없어서 죽는 사람이 있는데
 * 거기서도 못 빌리면 죽으라는 것이냐!" 그래서 하나로 묶었다.
 *
 * ★ 이 업적의 논지는 '얼마를 빌려줬나'가 아니라 '누구에게 빌려줬나'다.
 *   신용점수가 낮아 제도권 금융에서 거절당한 사람이 대상이다. 은행이 빌려주지
 *   않는 이유는 떼일 가능성이 높아서이고, 그래서 이 정책은 회수율이 낮을 것을
 *   알면서 시작한 것이다. 상환 현황을 성과가 아니라 설계의 일부로 읽어야 한다.
 *
 * ★ 상환 수치를 감추지 않는다.
 *   만기 기준으로 완납 24.3%, 전환대출·분할약정으로 성실 상환 중 41.2%다.
 *   나머지는 그 밖이다. 이 수치를 빼면 "다 갚았다"로 읽히고, 그건 사실이 아니다.
 *   대신 무엇을 목표로 한 정책이었는지를 함께 적는다.
 */

const raw: AchievementInput = {
  id: "gyeonggi-microloan",
  slug: "gyeonggi-microloan",
  title: "경기도 극저신용대출",
  subtitle: "은행이 거절한 사람에게, 연 1%로",
  kicker: "주요 정책",
  categories: ["welfare", "economy"],
  summary:
    "신용점수가 낮아 제도권 금융에서 돈을 빌릴 수 없는 사람에게 경기도가 직접 " +
    "빌려준 제도다. 2020년 시작해 연 1% 금리로 최대 300만 원까지, 담보와 보증 " +
    "없이 빌려준다. 지금까지 약 11만 명이 지원받았고 광역지자체 가운데 유일하다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "대출 조건과 지원 규모, 상환 현황은 보도로 확인했습니다. 경기도가 직접 낸 " +
    "집계로 대조하는 일은 아직 남아 있습니다. 이 대출이 불법 사채 이용을 얼마나 " +
    "줄였는지를 보여주는 자료는 확인하지 못했습니다.",

  headlineKeyNumberId: "kn-people",

  scenes: [
    {
      id: "repay",
      kind: "composition",
      heading: "빌려준 돈은 어떻게 됐나",
      lede:
        "만기가 된 대출의 상환 현황입니다. 은행이 거절한 사람을 대상으로 한 제도이므로 회수율이 낮을 것은 처음부터 예상된 일이었습니다.",
      claimIds: ["claim-repay"],
      composition: {
        total: 100,
        unit: "%",
        totalLabel: "만기가 된 대출",
        claimId: "claim-repay",
        note:
          "완납과 성실 상환을 더하면 65.5%다. 나머지 34.5%는 그 밖으로, 이 자료에서 " +
          "더 나누지 않았다. 제도권에서 거절당한 사람을 대상으로 한 대출이라 " +
          "일반 대출의 회수율과 나란히 놓고 비교할 수 없다.",
        groups: [
          {
            id: "rp-full",
            label: "완납",
            amount: 24.3,
            sharePercent: 24.3,
            tone: "primary",
          },
          {
            id: "rp-ongoing",
            label: "성실 상환 중",
            amount: 41.2,
            sharePercent: 41.2,
            tone: "primary",
            detail: "전환대출·분할약정",
          },
          {
            id: "rp-other",
            label: "그 밖",
            amount: 34.5,
            sharePercent: 34.5,
            tone: "neutral",
          },
        ],
      },
    },
  ],

  shorts: [
    {
      id: "short-ml-01",
      title: "다 갚지 못할 걸 알면서도 연 1%를 빌려주는 이유",
      summary:
        "사채를 단속하기만 하면 갈 곳이 사라집니다. 상환 현황까지 그대로 싣습니다.",
      youtubeId: "GeoBnCpmgyc",
      claimIds: ["claim-loan", "claim-repay", "claim-scale"],
      publishedAt: "2026-09-19",
    },
  ],

  eli5: {
    intro:
      "돈이 급한데 은행이 안 빌려주면 어디로 갈까요? 그 자리를 경기도가 대신한 이야기예요.",
    scenes: [
      {
        id: "e-ml-refused",
        title: "은행이 안 빌려주는 사람이 있어요",
        say: "신용점수가 낮으면 은행은 돈을 빌려주지 않아요. 떼일까 봐서요. 그런데 그런 사람일수록 돈이 급하죠.",
        art: "loan-refused",
        fact: { value: "거절", tone: "warm" },
        claimIds: ["claim-loan"],
      },
      {
        id: "e-ml-shark",
        title: "그래서 사채로 갔어요",
        say: "은행이 안 되면 사채밖에 없어요. 이자가 무섭게 높아요. 한 번 발을 들이면 빠져나오기 어려워요.",
        art: "loan-loanshark",
        fact: { value: "고금리", tone: "warm" },
        claimIds: ["claim-loan"],
      },
      {
        id: "e-ml-lend",
        title: "경기도가 대신 빌려줬어요",
        say: "2020년부터 경기도가 직접 빌려줬어요. 1년에 이자가 1%예요. 최대 300만 원까지, 담보도 보증도 없이요.",
        art: "loan-lend",
        fact: { value: "연 1%", tone: "ice" },
        claimIds: ["claim-loan"],
      },
      {
        id: "e-ml-repay",
        title: "다 갚지는 못했어요",
        say: "만기가 된 사람 중 넷에 하나가 다 갚았고, 열에 넷은 나눠서 갚고 있어요. 나머지는 그러지 못했어요. 애초에 은행이 거절한 사람들이니까요.",
        art: "loan-repay",
        fact: { value: "완납 24.3%", tone: "warm" },
        claimIds: ["claim-repay"],
      },
      {
        id: "e-ml-only",
        title: "아직도 여기밖에 없어요",
        say: "약 11만 명이 이 돈을 빌렸어요. 광역지자체 중에는 경기도만 이렇게 해요.",
        art: "loan-only",
        fact: { value: "약 11만 명", tone: "ice" },
        claimIds: ["claim-scale"],
      },
    ],
    caveat: {
      text:
        "이 대출 덕분에 사채를 덜 쓰게 됐는지는 확인하지 못했어요. 누구에게 얼마를 빌려줬고 얼마나 갚았는지까지만 적었어요.",
      claimIds: ["claim-repay", "claim-scale"],
    },
  },

  keyNumbers: [
    {
      id: "kn-people",
      label: "지원받은 사람",
      prefix: "약",
      value: "11",
      unit: "만 명",
      caption: "2020년 시작 이후 누적",
      claimId: "claim-scale",
    },
    {
      id: "kn-rate",
      label: "금리",
      value: "1",
      unit: "%",
      caption: "연 1% · 담보와 보증 없음",
      claimId: "claim-loan",
    },
    {
      id: "kn-limit",
      label: "한도",
      value: "300",
      unit: "만 원",
      caption: "상환 기간 5년",
      claimId: "claim-loan",
    },
  ],

  timeline: [
    {
      id: "ml-start",
      date: "2020",
      displayDate: "2020년",
      datePrecision: "year",
      title: "극저신용대출 시행",
      summary:
        "제도권 금융을 이용하기 어려운 도민에게 담보와 보증 없이 저리로 빌려주는 제도를 시작했다.",
      claimIds: ["claim-loan"],
    },
    {
      id: "ml-2021",
      date: "2021-07-26",
      displayDate: "2021년 7월 26일",
      datePrecision: "day",
      title: "연 1%, 최대 300만 원",
      summary:
        "만 19세 이상 도민 중 NICE 724점 이하 또는 KCB 670점 이하를 대상으로 접수했다.",
      claimIds: ["claim-loan"],
    },
    {
      id: "ml-scale",
      date: "2026-03-05",
      displayDate: "2026년 3월",
      datePrecision: "month",
      title: "누적 약 11만 명, 광역 중 유일",
      summary:
        "지금까지 약 11만 명이 지원받았고, 만기 기준 완납 24.3%·성실 상환 41.2%로 집계됐다.",
      claimIds: ["claim-scale", "claim-repay"],
    },
  ],

  graph: {
    note:
      "은행이 거절한 사람 앞에 무엇이 있었고 경기도가 어디에 끼어들었는지를 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "gyeonggi", name: "경기도", kind: "government", isFocus: true,
        description: "직접 빌려준 주체" },
      { id: "lowcredit", name: "저신용 도민", kind: "group",
        description: "NICE 724점 이하 또는 KCB 670점 이하" },
      { id: "banks", name: "제도권 금융", kind: "organization",
        description: "떼일 가능성을 이유로 빌려주지 않는 쪽" },
      { id: "sharks", name: "고금리 사채", kind: "group",
        description: "남은 유일한 선택지였던 곳" },
      { id: "loan", name: "극저신용대출", kind: "project",
        description: "연 1%, 최대 300만 원, 담보·보증 없음" },
      { id: "repayment", name: "상환", kind: "project",
        description: "만기 기준 완납 24.3%, 성실 상환 41.2%" },
    ],
    relations: [
      {
        id: "ml-r-refuse",
        fromId: "banks",
        toId: "lowcredit",
        label: "신용점수가 낮다는 이유로 대출을 거절한다.",
        startDate: "2020",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-loan"],
      },
      {
        id: "ml-r-shark",
        fromId: "lowcredit",
        toId: "sharks",
        label: "제도권에서 거절당하면 고금리 사채 말고는 갈 곳이 없었다.",
        startDate: "2020",
        startPrecision: "year",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-loan"],
      },
      {
        id: "ml-r-lend",
        fromId: "gyeonggi",
        toId: "loan",
        label: "연 1%, 최대 300만 원을 담보와 보증 없이 빌려줬다.",
        startDate: "2020",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-loan"],
      },
      {
        id: "ml-r-reach",
        fromId: "loan",
        toId: "lowcredit",
        label: "약 11만 명이 이 대출을 받았다.",
        startDate: "2026-03-05",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-scale"],
      },
      {
        id: "ml-r-repay",
        fromId: "lowcredit",
        toId: "repayment",
        label: "만기가 된 대출 중 완납 24.3%, 성실 상환 41.2%로 집계됐다.",
        startDate: "2026-03-05",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-repay"],
      },
    ],
  },

  counterpoints: [
    {
      id: "ml-cp-waste",
      question: "못 받을 돈을 빌려준 것 아닌가?",
      response:
        "회수율이 낮을 것은 처음부터 알고 시작한 제도다. 대상이 제도권 금융에서 거절당한 사람이기 때문이다. 만기 기준으로 완납 24.3%, 전환대출·분할약정을 통한 성실 상환이 41.2%이고 나머지는 그 밖이다. 이 수치를 일반 대출의 회수율과 나란히 놓고 비교할 수는 없다. 다만 '거의 다 갚았다'고 말할 수도 없으므로 여기에는 수치를 그대로 적는다.",
      claimIds: ["claim-repay"],
    },
    {
      id: "ml-cp-shark",
      question: "사채를 없애기만 하면 되지 않나?",
      response:
        "사채업자를 단속하면 돈이 급한 사람은 갈 곳이 사라진다. 책도 그 지적을 그대로 옮긴다. 이 대출은 그 빈자리를 메우려고 만든 것이고, 그래서 단속과 대출이 한 쌍으로 묶인다. 다만 이 대출이 실제로 불법 사채 이용을 얼마나 줄였는지를 보여주는 자료는 확인하지 못했다.",
      claimIds: ["claim-loan"],
    },
  ],

  claims: [
    {
      id: "claim-loan",
      text:
        "경기도는 2020년부터 제도권 금융을 이용하기 어려운 도민을 대상으로 담보와 보증 없이 연 1% 금리로 최대 300만 원까지 빌려주는 극저신용대출을 시행했다. 대상은 만 19세 이상 도민 가운데 NICE 신용점수 724점 이하 또는 KCB 670점 이하이며 상환 기간은 5년이다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-loan-2021", "src-khan-loan-2026", "src-book-2"],
      verified: true,
    },
    {
      id: "claim-scale",
      text:
        "극저신용대출로 지금까지 약 11만 명이 지원을 받았으며, 광역지자체 가운데 이런 제도를 운영하는 곳은 경기도가 유일하다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-loan-2026"],
      verified: true,
    },
    {
      id: "claim-repay",
      text:
        "만기가 된 극저신용대출의 상환 현황은 완납 24.3%, 전환대출과 분할약정을 통한 성실 상환 41.2%로 집계됐다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-loan-2026"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-hankook-loan-2021",
      title: "경기도 극저신용대출 26일부터 접수…연 1%에 최대 300만원",
      url: "https://www.hankookilbo.com/news/article/A2021071909390001635",
      publisher: "한국일보",
      publishedAt: "2021-07-19",
      type: "press",
      license: "quotable",
      quote:
        "만 19세 이상 도민 중 NICE 신용점수 724점 이하 또는 KCB 670점 이하를 대상으로 " +
        "연 1% 금리에 최대 300만 원까지 담보와 보증 없이 빌려준다.",
    },
    {
      id: "src-khan-loan-2026",
      title: "“300만원 덕분에 버텼다”…‘전국 유일’ 경기도 극저신용대출을 찾는 사람들",
      url: "https://www.khan.co.kr/article/202603051540011/",
      publisher: "경향신문",
      publishedAt: "2026-03-05",
      type: "press",
      license: "quotable",
      quote:
        "지금까지 약 11만 명이 지원을 받았다. 만기 도래분 기준 완납 24.3%, " +
        "전환대출·분할약정 등을 통한 성실 상환 41.2%로 집계됐다.",
    },
    {
      id: "src-book-2",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 2·15",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "2. 극 저신용 대출 — 이 정책을 반대하는 사람들이 참 많았지만 밍밍이는 도민을 " +
        "믿는다고 했어. / 15. 고금리 사채업자 퇴출 — “돈 30만 원이 없어서 죽는 사람이 " +
        "있는데 거기서도 못 빌리면 죽으라는 것이냐!” 그렇게 절박하신 분들을 위해 " +
        "극 저신용대출을 만들고 기본소득을 주장하는 거잖아.",
    },
  ],
};

export const gyeonggiMicroloan = achievementSchema.parse(raw);
