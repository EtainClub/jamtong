import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 성남시 무상급식 — 세 시정을 건너 자란 정책.
 *
 * 책(『밍밍 잼칠라 이장님』 7)은 "전국 최초 초중고 친환경 무상급식 실현"으로
 * 적는다. 두 가지를 확인하지 못했다.
 *   1. '전국 최초'는 같은 시기 여러 지자체가 경쟁적으로 확대했고, 무엇을 기준으로
 *      최초인지에 따라 답이 갈린다. 확인되지 않은 것을 사실로 적지 않는다.
 *   2. '초중고'가 다 채워진 것은 2018년 2학기인데, 그건 이 시정이 끝난 뒤다.
 *
 * 그래서 이 업적은 '한 사람이 완성했다'가 아니라 **한 정책이 세 시정을 건너
 * 자란 기록**으로 쓴다. 이 시정의 몫은 2013년 의무교육 전면 확대다.
 * 시작도 완성도 남의 몫이라고 적는 편이, 전부 제 몫이라고 적는 것보다 강하다.
 *
 * 모션 자리에는 구성 씬을 둔다. 자료가 학교 수와 학생 수를 학교급별로 갈라
 * 적어 두었고, 둘 다 합이 정확히 맞는다(78+72+46+36=232, 81,195+26,499=107,694).
 * 근거에 있는 분해만 그린다.
 */

const raw: AchievementInput = {
  id: "seongnam-meals",
  slug: "seongnam-meals",
  title: "성남시 무상급식",
  subtitle: "1학년만 주던 밥이 모든 학년에 가기까지",
  kicker: "주요 업적",
  summary:
    "2007년 초등학교 1학년을 대상으로 시작한 무상급식은 2013년 의무교육 대상 전체로 넓어졌고, " +
    "2018년 2학기에 고등학교까지 갔다. 시작한 시정과 넓힌 시정과 완성한 시정이 모두 다르다. " +
    "이 시정의 몫은 초·중학교 전면 확대다.",
  type: "event",
  publishStatus: "published",
  sourceNote:
    "연혁과 규모를 성남시 보도자료를 옮긴 보도로 확인했습니다. 성남시가 직접 낸 자료나 " +
    "학교급식 지원 조례로 대조하는 일은 아직 남아 있습니다. 이 업적의 근거는 다른 업적보다 " +
    "얇습니다.",

  headlineKeyNumberId: "kn-students",

  scenes: [
    {
      id: "composition",
      kind: "composition",
      heading: "누가 급식을 받고 있나",
      lede:
        "2018년 2학기, 고등학교까지 채워진 시점의 구성입니다. 이 시정이 넓힌 몫은 초·중학교입니다.",
      claimIds: ["claim-scale", "claim-highschool"],
      composition: {
        total: 107694,
        unit: "명",
        totalLabel: "무상급식을 받는 학생",
        claimId: "claim-scale",
        note:
          "고등학교 확대 이전의 196개교 8만1,195명에 2018년 2학기 고등학교 36개교 " +
          "2만6,499명을 더한 수다. 초등학교와 중학교를 가른 값은 자료에 없어 " +
          "의무교육 대상으로 묶었다. 이 시정의 몫은 그 묶음이다.",
        groups: [
          {
            id: "co-compulsory",
            label: "의무교육 대상",
            amount: 81195,
            sharePercent: 75.4,
            tone: "primary",
            detail: "사립유치원·초·중 196개교",
          },
          {
            id: "co-high",
            label: "고등학교",
            amount: 26499,
            sharePercent: 24.6,
            tone: "neutral",
            detail: "36개교 · 2018년 2학기",
          },
        ],
        breakdownLabel: "학교 232곳의 구성",
        breakdownUnit: "곳",
        breakdown: [
          { id: "co-kinder", label: "사립유치원", amount: 78, sharePercent: 33.6, tone: "primary" },
          { id: "co-elem", label: "초등학교", amount: 72, sharePercent: 31.0, tone: "primary" },
          { id: "co-middle", label: "중학교", amount: 46, sharePercent: 19.8, tone: "primary" },
          { id: "co-highschool", label: "고등학교", amount: 36, sharePercent: 15.5, tone: "neutral" },
        ],
      },
    },
  ],
  shorts: [],

  eli5: {
    intro:
      "학교에서 먹는 점심이 공짜가 되기까지 11년이 걸렸어요. 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-sm-pay",
        title: "예전엔 급식비를 냈어요",
        say: "학교에서 점심을 먹으려면 매달 돈을 내야 했어요. 형편이 어려우면 눈치가 보였어요.",
        art: "lunch-pay",
        fact: { value: "2007년 이전", tone: "warm" },
        claimIds: ["claim-start"],
      },
      {
        id: "e-sm-first",
        title: "처음엔 1학년만 공짜였어요",
        say: "2007년에 초등학교 1학년부터 시작했어요. 아주 작게 시작한 거예요.",
        art: "first-grade-only",
        fact: { value: "2007년 · 초등 1학년", tone: "ice" },
        claimIds: ["claim-start"],
      },
      {
        id: "e-sm-step",
        title: "해마다 조금씩 넓혔어요",
        say: "한 학년씩, 한 학교씩 늘려 갔어요. 한 번에 다 한 게 아니에요.",
        art: "step-by-step",
        fact: { value: "2007 → 2013", tone: "ice" },
        claimIds: ["claim-expand"],
      },
      {
        id: "e-sm-all",
        title: "초등·중학교 모두가 됐어요",
        say: "2013년부터는 의무교육을 받는 아이들 전부가 공짜로 먹게 됐어요.",
        art: "all-compulsory",
        fact: { value: "2013년", tone: "ice" },
        claimIds: ["claim-expand"],
      },
      {
        id: "e-sm-high",
        title: "고등학교까지 간 건 나중이에요",
        say: "고등학생까지 공짜가 된 건 2018년 2학기예요. 그때는 시장이 바뀐 뒤였어요.",
        art: "high-school-too",
        fact: { value: "2018년 2학기", tone: "warm" },
        claimIds: ["claim-highschool"],
      },
      {
        id: "e-sm-count",
        title: "지금은 10만 명이 넘어요",
        say: "유치원부터 고등학교까지 합치면 십만 명이 넘는 아이들이 공짜로 점심을 먹어요.",
        art: "lunch-count",
        fact: { value: "약 10만 7천 명", tone: "ice" },
        claimIds: ["claim-scale", "claim-highschool"],
      },
    ],
    caveat: {
      text:
        "세 시정이 이어서 한 일이에요. 2007년에 시작한 사람, 2013년에 넓힌 사람, 2018년에 고등학교까지 넣은 사람이 각각 달라요.",
      claimIds: ["claim-start", "claim-expand", "claim-highschool"],
    },
  },

  keyNumbers: [
    {
      id: "kn-students",
      label: "무상급식을 받는 학생",
      prefix: "약",
      value: "107,694",
      unit: "명",
      caption: "2018년 2학기 · 유치원부터 고등학교까지",
      claimId: "claim-scale",
    },
    {
      id: "kn-schools",
      label: "지원 학교",
      value: "232",
      unit: "곳",
      caption: "사립유치원 78 · 초 72 · 중 46 · 고 36",
      claimId: "claim-scale",
    },
    {
      id: "kn-years",
      label: "1학년에서 고등학교까지",
      value: "11",
      unit: "년",
      caption: "2007년 시작 → 2018년 고교 전면",
      claimId: "claim-highschool",
    },
  ],

  timeline: [
    {
      id: "sm-start",
      date: "2007",
      displayDate: "2007년",
      datePrecision: "year",
      title: "초등학교 1학년으로 시작",
      summary: "무상급식 지원 사업이 초등학교 1학년을 대상으로 처음 시작됐다.",
      claimIds: ["claim-start"],
    },
    {
      id: "sm-expand",
      date: "2013",
      displayDate: "2013년",
      datePrecision: "year",
      title: "의무교육 대상 전체로",
      summary: "초·중학교에 다니는 아이들 전부가 무상급식을 받게 됐다.",
      claimIds: ["claim-expand"],
    },
    {
      id: "sm-high",
      date: "2018-07",
      displayDate: "2018년 7월",
      datePrecision: "month",
      title: "고등학교 전면 시행 결정",
      summary:
        "2학기부터 36개교 2만6,499명으로 넓히기로 했다. 2학기분 예산은 69억 원이다.",
      claimIds: ["claim-highschool"],
    },
  ],

  graph: {
    note:
      "한 정책이 어디까지 넓어졌는지를 그렸다. 연표에서 시점을 옮기면 그때까지 " +
      "포함된 대상만 남는다 — 무엇이 언제 들어왔는지가 그대로 보인다.",
    entities: [
      { id: "seongnam", name: "성남시", kind: "government", isFocus: true,
        description: "급식비를 대는 주체" },
      { id: "meals", name: "무상급식", kind: "project" },
      { id: "elementary", name: "초등학교", kind: "organization",
        description: "2007년 1학년부터 시작" },
      { id: "middle", name: "중학교", kind: "organization",
        description: "2013년 의무교육 전면 확대에 포함" },
      { id: "high", name: "고등학교", kind: "organization",
        description: "2018년 2학기부터" },
      { id: "kinder", name: "사립유치원", kind: "organization" },
      { id: "students", name: "학생과 학부모", kind: "group",
        description: "급식비 부담이 사라진 쪽" },
    ],
    relations: [
      {
        id: "sm-r-fund",
        fromId: "seongnam",
        toId: "meals",
        label: "시 예산으로 급식비를 댄다.",
        startDate: "2007",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-start"],
      },
      {
        id: "sm-r-elem",
        fromId: "meals",
        toId: "elementary",
        label: "2007년 초등학교 1학년을 대상으로 시작했다.",
        startDate: "2007",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-start"],
      },
      {
        id: "sm-r-middle",
        fromId: "meals",
        toId: "middle",
        label: "2013년 의무교육 대상 전체로 넓어지면서 포함됐다.",
        startDate: "2013",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-expand"],
      },
      {
        id: "sm-r-kinder",
        fromId: "meals",
        toId: "kinder",
        label: "사립유치원 78개원도 지원 대상이다.",
        startDate: "2018-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-scale"],
      },
      {
        id: "sm-r-high",
        fromId: "meals",
        toId: "high",
        label: "2018년 2학기에 36개교 2만6,499명으로 넓어졌다. 이 시정이 끝난 뒤의 일이다.",
        startDate: "2018-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-highschool"],
      },
      {
        id: "sm-r-students",
        fromId: "meals",
        toId: "students",
        label: "급식비를 내지 않아도 된다. 형편을 밝히지 않아도 된다는 뜻이기도 하다.",
        startDate: "2007",
        startPrecision: "year",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-start"],
      },
    ],
  },

  counterpoints: [
    {
      id: "sm-cp-whose",
      question: "시작한 것도 끝낸 것도 다른 시정 아닌가?",
      response:
        "맞다. 2007년에 시작했고, 2018년 2학기에 고등학교까지 채워졌다. 두 시점 모두 이 시정 밖이다. 이 시정의 몫은 2013년 의무교육 대상 전체로 넓힌 것이다. 이 스토리는 그 구분을 연표와 관계도에 그대로 남긴다 — 세 시정이 이어서 한 일이라고 적는 편이, 전부 한 사람의 공이라고 적는 것보다 무너뜨리기 어렵다.",
      claimIds: ["claim-start", "claim-expand", "claim-highschool"],
    },
    {
      id: "sm-cp-first",
      question: "'전국 최초'라는 말은 맞나?",
      response:
        "확인하지 못했다. 같은 시기 여러 지자체가 경쟁적으로 무상급식을 넓혔고, 무엇을 기준으로 최초인지에 따라 답이 갈린다. 그래서 이 스토리는 '전국 최초'를 주장하지 않는다. 확인되지 않은 수식어를 붙이면 확인된 내용까지 함께 의심받는다.",
      claimIds: ["claim-start"],
    },
    {
      id: "sm-cp-universal",
      question: "형편이 어려운 학생만 주면 되지 않나?",
      response:
        "선별 지원은 대상을 가려내는 과정이 필요하고, 그 과정 자체가 아이에게 드러난다. 모두에게 주면 그 절차가 사라진다. 대신 돈이 더 든다 — 2018년 2학기 고등학교분만 69억 원이었다. 어느 쪽이 나은지는 판단의 문제이며, 이 스토리는 비용과 효과를 함께 적는다.",
      claimIds: ["claim-highschool", "claim-scale"],
    },
  ],

  claims: [
    {
      id: "claim-start",
      text:
        "성남시 무상급식 지원 사업은 2007년 초등학교 1학년을 대상으로 시작됐다.",
      assertionType: "FACT",
      sourceIds: ["src-press-2018", "src-book"],
      verified: true,
    },
    {
      id: "claim-expand",
      text:
        "2013년부터는 의무교육 대상자 모두가 무상급식을 받게 됐다.",
      assertionType: "FACT",
      sourceIds: ["src-press-2018"],
      verified: true,
    },
    {
      id: "claim-highschool",
      text:
        "2018년 2학기부터 고등학교 무상급식이 전면 시행돼 36개교 2만6,499명이 대상이 됐다. 2학기분 예산은 69억 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-press-2018"],
      verified: true,
    },
    {
      id: "claim-scale",
      text:
        "고등학교 확대 이전까지 사립유치원 78개원, 초등학교 72개교, 중학교 46개교 등 196개교 8만1,195명이 무상급식을 지원받고 있었다. 고등학교 36개교 2만6,499명을 더하면 232개교 약 10만7,694명이다.",
      assertionType: "FACT",
      sourceIds: ["src-press-2018"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-book",
      title: "『밍밍 잼칠라 이장님』 — 1학기 이장님 업적(성남시장) 7",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "7. 전국 최초 초중고 친환경 무상급식 실현 " +
        "(이 책이 붙인 '전국 최초'는 확인하지 못했고, '초중고'가 채워진 것은 2018년 2학기다.)",
    },
    {
      id: "src-press-2018",
      title: "성남시, 고등학교 무상급식 전면 시행하기로",
      url: "http://www.kgnews.net/news/articleView.html?idxno=64172",
      publisher: "광교신문",
      publishedAt: "2018-07-13",
      type: "press",
      license: "quotable",
      quote:
        "2007년 초등학교 1학년을 대상으로 시작돼 (…) 2013년부터는 의무 교육 대상자 모두가 " +
        "혜택을 보고 있다 (…) 올해 2학기부터 36개교 2만6499명 혜택을 보게 됐다 (…) " +
        "2학기분 소요 예산은 69억원이다 (…) 사립유치원 78개원, 초등학교 72개교, 중학교 46개교 등 " +
        "모두 총 196개교, 8만1195명",
    },
  ],
};

export const seongnamMeals = achievementSchema.parse(raw);
