import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 경기도 일본군 위안부 피해자 지원 — 기억하는 일도 행정이 한다.
 *
 * 책은 여러 항목에 흩어 적는다(2학기 5 독도, 6 일본 성노예 피해자 지원,
 * 26 친일문화 청산, 57 항일 애국지사 연금, 61 베를린 소녀상 서한). 그중
 * 수치와 시점이 또렷한 6번을 중심에 두고, 61번을 같은 줄기로 함께 적는다.
 *
 * ★ 이 업적은 규모가 작다. 그것이 요지다.
 *   도내 거주 피해자는 열 분이었다. 큰 숫자가 나오는 정책이 아니다.
 *   행정이 다루는 일 가운데는 사람 수로 크기를 말할 수 없는 것이 있고,
 *   이 업적은 그런 쪽이다.
 *
 * ★ 용어.
 *   책은 '성노예 피해자'로 적고 경기도 조례는 '일제하 일본군 성노예 피해자'를,
 *   정부와 대부분의 보도는 '일본군 위안부 피해자'를 쓴다. 여기서는 널리 쓰이는
 *   '일본군 위안부 피해자'를 쓰되, 조례를 인용할 때는 조례의 이름을 그대로 적는다.
 *
 * ★ 당사자를 소재로 삼지 않는다.
 *   피해 사실을 묘사하지 않고, 행정이 무엇을 했는지만 적는다.
 */

const raw: AchievementInput = {
  id: "gyeonggi-comfort-women",
  slug: "gyeonggi-comfort-women",
  title: "경기도 위안부 피해자 지원",
  subtitle: "열 분에게, 전국에서 가장 높은 수준으로",
  kicker: "주요 업적",
  summary:
    "경기도는 2015년 10월 관련 조례를 만든 뒤, 2018년 10월 도내 거주 일본군 위안부 " +
    "피해자에 대한 월 지원금을 203만 원에서 293만 원으로 올리겠다고 밝혔다. " +
    "정부 지원금 133만 원을 포함한 금액이며 2019년부터 적용됐다. 당시 도내에는 " +
    "열 분이 살고 있었다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "지원금 인상 시점과 금액, 도내 거주 인원은 당시 보도로 확인했습니다. 경기도가 " +
    "직접 낸 보도자료와 조례 원문으로 대조하는 일은 아직 남아 있습니다. 베를린 " +
    "소녀상 서한이 실제로 어떤 영향을 미쳤는지는 확인하지 못했습니다.",

  headlineKeyNumberId: "kn-amount",

  scenes: [
    {
      id: "raise",
      kind: "quantity-track",
      heading: "월 지원금이 오른 자리",
      lede: "두 시점만 자료로 확인됩니다. 스크롤하면 그 사이를 지나갑니다.",
      claimIds: ["claim-before", "claim-raise"],
      track: {
        label: "도내 거주 피해자 월 지원금",
        unit: "만 원",
        direction: "up",
        max: 293,
        note:
          "정부 지원금 133만 원을 포함한 금액이다. 경기도가 더 얹은 몫은 70만 원에서 " +
          "160만 원으로 늘었다. 이 두 시점 사이에 다른 조정이 있었는지는 확인하지 못했다.",
        checkpoints: [
          {
            id: "cw-before",
            displayDate: "2018년까지",
            title: "월 203만 원",
            amount: 203,
            caption:
              "정부 지원금 133만 원에 경기도 몫 70만 원을 더한 금액이었습니다.",
            art: "cw-ordinance",
            claimId: "claim-before",
          },
          {
            id: "cw-after",
            displayDate: "2019년부터",
            title: "월 293만 원",
            amount: 293,
            caption:
              "90만 원을 올렸습니다. 진료비를 '건강관리비'로 바꿔 신청 여부와 상관없이 매월 정액 지급하고, 월 60만 원의 위로금을 새로 뒀습니다.",
            art: "cw-raise",
            claimId: "claim-raise",
          },
        ],
      },
    },
    {
      id: "share",
      kind: "composition",
      heading: "293만 원은 어디서 오나",
      lede: "정부가 내는 몫과 경기도가 더 얹은 몫입니다.",
      claimIds: ["claim-raise"],
      composition: {
        total: 293,
        unit: "만 원",
        totalLabel: "월 지원금 합계",
        claimId: "claim-raise",
        note:
          "인상 전에는 경기도 몫이 70만 원이었다(203 − 133). 인상으로 늘어난 90만 원은 " +
          "모두 경기도 몫이다.",
        groups: [
          {
            id: "sh-gg",
            label: "경기도",
            amount: 160,
            sharePercent: 54.6,
            tone: "primary",
            detail: "인상 전 70만 원에서",
          },
          {
            id: "sh-gov",
            label: "정부 지원금",
            amount: 133,
            sharePercent: 45.4,
            tone: "neutral",
          },
        ],
      },
    },
  ],

  shorts: [],

  eli5: {
    intro:
      "아주 오래전 일을 아직 안고 사는 분들이 계세요. 경기도가 한 일을 다섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-cw-few",
        title: "도내에 열 분이 계셨어요",
        say: "광주 나눔의 집에 여덟 분, 군포와 의정부에 한 분씩. 모두 열 분이었어요. 큰 숫자가 아니에요.",
        art: "cw-few",
        fact: { value: "10명", tone: "warm" },
        claimIds: ["claim-raise"],
      },
      {
        id: "e-cw-rule",
        title: "먼저 규칙을 만들었어요",
        say: "2015년 10월, 경기도가 조례를 만들었어요. 무엇을 어떻게 도울지 정해 놓은 규칙이에요.",
        art: "cw-ordinance",
        fact: { value: "2015년", tone: "ice" },
        claimIds: ["claim-ordinance"],
      },
      {
        id: "e-cw-raise",
        title: "드리는 돈을 올렸어요",
        say: "2019년부터 매달 203만 원에서 293만 원으로 올렸어요. 90만 원을 더 얹은 거예요.",
        art: "cw-raise",
        fact: { value: "293만 원", tone: "ice" },
        claimIds: ["claim-raise"],
      },
      {
        id: "e-cw-berlin",
        title: "독일에도 편지를 보냈어요",
        say: "베를린에 세운 소녀상을 치우라는 요구가 있었어요. 2020년, 경기도지사가 베를린 시장에게 그 명령을 거둬 달라는 편지를 보냈어요.",
        art: "cw-berlin",
        fact: { value: "2020년", tone: "ice" },
        claimIds: ["claim-berlin"],
      },
      {
        id: "e-cw-remember",
        title: "기억하는 것도 일이에요",
        say: "돈을 드리는 것도, 편지를 쓰는 것도 행정이 하는 일이에요. 사람 수가 적다고 안 하는 일이 아니에요.",
        art: "cw-remember",
        fact: { value: "전국 최고 수준", tone: "ice" },
        claimIds: ["claim-raise"],
      },
    ],
    caveat: {
      text:
        "베를린에 보낸 편지가 실제로 어떤 영향을 줬는지는 확인하지 못했어요. 편지를 보냈다는 사실까지만 적었어요.",
      claimIds: ["claim-berlin"],
    },
  },

  keyNumbers: [
    {
      id: "kn-amount",
      label: "월 지원금",
      value: "203 → 293",
      unit: "만 원",
      caption: "2019년부터 · 정부 지원금 133만 원 포함",
      claimId: "claim-raise",
    },
    {
      id: "kn-people",
      label: "도내 거주 피해자",
      value: "10",
      unit: "명",
      caption: "광주 나눔의 집 8 · 군포 1 · 의정부 1",
      claimId: "claim-raise",
    },
    {
      id: "kn-new",
      label: "새로 둔 위로금",
      value: "60",
      unit: "만 원",
      caption: "월 정액 · 건강관리비는 신청 없이 지급",
      claimId: "claim-raise",
    },
  ],

  timeline: [
    {
      id: "cw-ord",
      date: "2015-10",
      displayDate: "2015년 10월",
      datePrecision: "month",
      title: "지원 조례 제정",
      summary:
        "'경기도 일제하 일본군 성노예 피해자 생활안정지원 및 기념사업에 관한 조례'를 만들었다.",
      claimIds: ["claim-ordinance"],
    },
    {
      id: "cw-raise",
      date: "2018-10-23",
      displayDate: "2018년 10월 23일",
      datePrecision: "day",
      title: "월 지원금 203만 원 → 293만 원",
      summary:
        "2019년부터 90만 원을 올리고, 건강관리비 정액 지급과 월 60만 원 위로금을 새로 뒀다.",
      claimIds: ["claim-raise"],
    },
    {
      id: "cw-berlin",
      date: "2020-10",
      displayDate: "2020년 10월",
      datePrecision: "month",
      title: "베를린 시장에게 서한",
      summary:
        "베를린 미테구가 소녀상 철거를 명령하자 철회를 요청하는 서한을 보냈다.",
      claimIds: ["claim-berlin"],
    },
  ],

  graph: {
    note:
      "누가 무엇을 맡았는지를 그렸다. 연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "gyeonggi", name: "경기도", kind: "government", isFocus: true,
        description: "조례를 만들고 지원금을 올린 주체" },
      { id: "survivors", name: "도내 거주 피해자", kind: "group",
        description: "2018년 기준 열 분" },
      { id: "government", name: "정부", kind: "government",
        description: "월 133만 원을 맡은 쪽" },
      { id: "ordinance", name: "지원 조례", kind: "project",
        description: "2015년 10월 제정. 지원의 법적 토대" },
      { id: "house", name: "나눔의 집", kind: "organization",
        description: "광주시. 여덟 분이 거주" },
      { id: "berlin", name: "베를린 미테구", kind: "government",
        description: "소녀상 철거를 명령한 쪽" },
    ],
    relations: [
      {
        id: "cw-r-ord",
        fromId: "gyeonggi",
        toId: "ordinance",
        label: "생활안정지원과 기념사업에 관한 조례를 만들었다.",
        startDate: "2015-10",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-ordinance"],
      },
      {
        id: "cw-r-gov",
        fromId: "government",
        toId: "survivors",
        label: "월 133만 원을 지원한다.",
        startDate: "2018-10-23",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-raise"],
      },
      {
        id: "cw-r-add",
        fromId: "gyeonggi",
        toId: "survivors",
        label: "경기도 몫을 70만 원에서 160만 원으로 올려 합계 293만 원이 됐다.",
        startDate: "2018-10-23",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-raise"],
      },
      {
        id: "cw-r-house",
        fromId: "house",
        toId: "survivors",
        label: "도내 열 분 가운데 여덟 분이 이곳에 거주했다.",
        startDate: "2018-10-23",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-raise"],
      },
      {
        id: "cw-r-berlin",
        fromId: "gyeonggi",
        toId: "berlin",
        label: "소녀상 철거 명령을 거둬 달라는 서한을 보냈다.",
        startDate: "2020-10",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-berlin"],
      },
    ],
  },

  counterpoints: [
    {
      id: "cw-cp-small",
      question: "열 명에게 쓰는 돈치고 지나친 것 아닌가?",
      response:
        "판단이 갈릴 수 있다. 다만 이 지원은 생활비 보조이자 국가가 하지 못한 일에 대한 지방정부의 몫이라는 성격을 함께 갖는다. 경기도가 더 얹은 몫은 한 사람당 월 160만 원이고, 대상은 열 명이었다. 규모로 따지면 도 예산에서 차지하는 비중은 크지 않다.",
      claimIds: ["claim-raise"],
    },
    {
      id: "cw-cp-berlin",
      question: "베를린에 편지를 보낸 것이 무슨 소용인가?",
      response:
        "그 편지가 실제로 어떤 영향을 미쳤는지는 확인하지 못했다. 소녀상 철거 명령은 이후 보류됐지만, 그것이 이 서한 때문이라고 말할 근거를 이 위키는 갖고 있지 않다. 여기에는 서한을 보냈다는 사실까지만 적는다.",
      claimIds: ["claim-berlin"],
    },
  ],

  claims: [
    {
      id: "claim-ordinance",
      text:
        "경기도는 2015년 10월 '경기도 일제하 일본군 성노예 피해자 생활안정지원 및 기념사업에 관한 조례'를 제정했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-cw-2018"],
      verified: true,
    },
    {
      id: "claim-before",
      text:
        "경기도가 지원금을 올리기 전까지 도내 거주 일본군 위안부 피해자에 대한 월 지원금은 정부 지원금 133만 원을 포함해 203만 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-cw-2018"],
      verified: true,
    },
    {
      id: "claim-raise",
      text:
        "경기도는 2018년 10월 23일 도내 거주 일본군 위안부 피해자에 대한 월 지원금을 203만 원에서 293만 원으로 90만 원 올려 2019년부터 적용한다고 밝혔다. 정부 지원금 133만 원이 포함된 금액이다. 진료비를 '건강관리비'로 바꿔 신청 여부와 상관없이 매월 정액 지급하고, 월 60만 원의 위로금을 새로 뒀다. 당시 도내에는 광주 나눔의 집 8명, 군포시 1명, 의정부시 1명 등 모두 10명이 거주하고 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-cw-2018", "src-hankook-cw-2018", "src-book-6"],
      verified: true,
    },
    {
      id: "claim-berlin",
      text:
        "베를린 미테구가 현지에 설치된 소녀상의 철거를 명령하자, 이재명 경기도지사는 2020년 베를린 시장에게 철거 명령 철회를 요청하는 서한을 보냈다.",
      assertionType: "FACT",
      sourceIds: ["src-book-61"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-seoul-cw-2018",
      title: "경기도, 위안부 피해자 월 지원금 203만원→293만원",
      url: "https://www.seoul.co.kr/news/localnews/2018/10/23/20181023500066",
      publisher: "서울신문",
      publishedAt: "2018-10-23",
      type: "press",
      license: "quotable",
      quote:
        "도내 거주 위안부 피해자들에 대한 생활안정자금 등 지원금을 월 203만 원" +
        "(정부지원금 133만 원 포함)에서 내년부터 월 293만 원으로 90만 원 인상한다. " +
        "월 60만 원의 위로금도 신설한다.",
    },
    {
      id: "src-hankook-cw-2018",
      title: "경기도, 일본군 성노예 피해자 생활지원금 전국 최고수준 인상",
      url: "https://www.hankookilbo.com/news/article/201810231097387797",
      publisher: "한국일보",
      publishedAt: "2018-10-23",
      type: "press",
      license: "quotable",
      quote:
        "도내에는 광주 나눔의 집에 8명, 군포시와 의정부시에 각 1명씩 모두 10명이 " +
        "거주하고 있다. 경기도는 2015년 10월 관련 조례를 제정했다.",
    },
    {
      id: "src-book-6",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 6",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "6. 일본 성노예 피해자 매월 최고 293만 원 지원 — 이래야 되는 거지. 이게 맞지. " +
        "우리의 역사를 절대 잊으면 안 돼.",
    },
    {
      id: "src-book-61",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 61",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "61. 베를린 시장에게 '소녀상 철거' 철회 요청 서한 — 독일 베를린에서 " +
        "일본군 성노예 피해자를 기리는 소녀상의 설치를 2020년 7월에 허가했어. " +
        "그런데 일본 측의 반발이 거세지자 베를린시는 철거하라는 공문을 보냈어.",
    },
  ],
};

export const gyeonggiComfortWomen = achievementSchema.parse(raw);
