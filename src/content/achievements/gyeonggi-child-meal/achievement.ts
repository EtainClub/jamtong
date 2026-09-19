import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 경기도 아동급식 — 밥값, 쓸 곳, 그리고 카드 모양.
 *
 * 책은 두 항목으로 나눠 적는다(2학기 12 결식아동 급식지원·아동 급식카드,
 * 30 결식아동 급식비 전국 최고 수준으로 인상). 둘은 한 아이의 한 끼를 놓고
 * 서로 다른 세 가지를 고친 이야기다. 그래서 하나로 묶었다.
 *
 * ★ 이 업적의 논지는 '얼마를 올렸나'가 아니라 '무엇이 문제였는지 알아봤나'다.
 *   밥값이 적은 것이 하나, 쓸 데가 편의점뿐인 것이 둘, 카드가 티 나는 것이 셋이다.
 *   셋은 서로 다른 문제이고 각각 다른 방법으로 풀렸다. 금액만 적으면 이 업적의
 *   절반 이상이 사라진다.
 *
 * ★ 가이드의 E 묶음은 열한 항목이었다.
 *   1·4·12·14·30·36·37·48·49·59·65를 '아동·청소년'으로 묶으려 했는데 너무 넓다.
 *   한 아이의 한 끼라는 한 장면을 이루는 12와 30만 세운다. 나머지는 E′로 남긴다.
 *
 * ★ 4,500원은 7년 동안 묶여 있던 값이다.
 *   2012년에 4,500원이 된 뒤 2018년까지 그대로였다. 인상 폭보다 이 정지가
 *   먼저 적혀야 무엇이 달라졌는지가 보인다.
 */

const raw: AchievementInput = {
  id: "gyeonggi-child-meal",
  slug: "gyeonggi-child-meal",
  title: "경기도 아동급식",
  subtitle: "밥값을 올리고, 쓸 곳을 넓히고, 티 나지 않게 했다",
  kicker: "주요 업적",
  categories: ["welfare"],
  summary:
    "끼니가 걱정되는 아이에게 주는 급식카드를 세 군데 고친 일이다. 2012년부터 " +
    "4,500원에 묶여 있던 한 끼 값을 2018년 10월 6,000원으로 올렸고, 이후 " +
    "7,000원과 8,000원까지 올라갔다. 2020년에는 편의점에 몰려 있던 사용처를 " +
    "국내 처음으로 모든 일반음식점으로 넓혔고, 한눈에 급식카드로 보이던 카드를 " +
    "일반 체크카드와 같은 모양으로 바꿨다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "급식단가의 시점별 금액과 가맹점 수치는 당시 보도로 확인했습니다. 경기도가 " +
    "직접 낸 보도자료로 대조하는 일은 아직 남아 있습니다. 사용처를 넓힌 뒤 아이들이 " +
    "실제로 무엇을 더 먹게 됐는지, 카드 모양을 바꾼 뒤 낙인감이 얼마나 줄었는지를 " +
    "보여주는 자료는 확인하지 못했습니다.",

  headlineKeyNumberId: "kn-price",

  scenes: [
    {
      id: "price",
      kind: "quantity-track",
      heading: "한 끼 값이 오른 경로",
      lede:
        "2012년부터 7년 가까이 묶여 있던 값입니다. 스크롤하면 그 뒤를 지나갑니다.",
      claimIds: ["claim-frozen", "claim-6000", "claim-7000", "claim-8000"],
      track: {
        label: "결식아동 한 끼 급식단가",
        unit: "원",
        direction: "up",
        max: 8000,
        note:
          "경기도가 정한 단가다. 경기도·시군·경기도교육청이 예산을 함께 부담한다. " +
          "각 시점의 값은 그때 보도로 확인한 것이고, 그 사이에 다른 조정이 있었는지는 " +
          "확인하지 못했다.",
        checkpoints: [
          {
            id: "cm-frozen",
            displayDate: "2012년 ~ 2018년",
            title: "7년 동안 4,500원",
            amount: 4500,
            caption:
              "2012년에 4,500원이 된 뒤로 그대로였습니다. 그 사이 물가는 올랐습니다.",
            art: "meal-cheap",
            claimId: "claim-frozen",
          },
          {
            id: "cm-6000",
            displayDate: "2018년 10월",
            title: "6,000원으로, 33% 인상",
            amount: 6000,
            caption:
              "광역지자체 가운데 가장 높은 수준이 됐습니다. 2018년 8월 발표해 10월부터 시행했습니다.",
            art: "meal-raise",
            claimId: "claim-6000",
          },
          {
            id: "cm-7000",
            displayDate: "2021년 5월 1일",
            title: "7,000원",
            amount: 7000,
            caption:
              "한 번에 쓸 수 있는 한도도 1만 2,000원에서 1만 4,000원으로 올렸습니다.",
            art: "meal-table",
            claimId: "claim-7000",
          },
          {
            id: "cm-8000",
            displayDate: "2022년 8월 10일",
            title: "8,000원",
            amount: 8000,
            caption: "4,500원이던 값이 네 해 사이에 8,000원이 됐습니다.",
            art: "meal-table",
            claimId: "claim-8000",
          },
        ],
      },
    },
    {
      id: "where",
      kind: "composition",
      heading: "그 카드를 쓸 수 있던 곳",
      lede:
        "돈을 올려도 쓸 데가 없으면 소용이 없습니다. 개선 전인 2020년 초의 가맹점 구성입니다.",
      claimIds: ["claim-card"],
      composition: {
        total: 11500,
        unit: "곳",
        totalLabel: "개선 전 전체 가맹점",
        claimId: "claim-card",
        note:
          "열에 여덟이 편의점이었다. 아이들이 편의점 음식으로 끼니를 때운다는 지적이 " +
          "여기서 나왔다. 2020년 8월 31일 BC카드 가맹 일반음식점과 연계하면서 " +
          "쓸 수 있는 곳이 18만여 곳으로 늘었다.",
        groups: [
          {
            id: "wh-cvs",
            label: "편의점",
            amount: 8900,
            sharePercent: 77.4,
            tone: "accent",
            detail: "끼니를 때우게 되는 곳",
          },
          {
            id: "wh-rest",
            label: "일반음식점",
            amount: 2600,
            sharePercent: 22.6,
            tone: "primary",
          },
        ],
      },
    },
  ],

  shorts: [
    {
      id: "short-cm-01",
      title: "급식카드로 왜 편의점만 갔을까",
      summary:
        "금액만 올려서는 한 끼가 되지 않습니다. 쓸 곳과 카드 모양까지 고친 세 가지를 다룹니다.",
      youtubeId: "QQfmV-MQwkE",
      claimIds: ["claim-frozen", "claim-6000", "claim-card", "claim-design"],
      publishedAt: "2026-09-19",
    },
  ],

  eli5: {
    intro:
      "끼니가 걱정되는 아이에게 밥 사 먹으라고 카드를 줘요. 그 카드에 문제가 셋 있었어요.",
    scenes: [
      {
        id: "e-cm-cheap",
        title: "한 끼에 4,500원이었어요",
        say: "2012년에 정해진 값이 2018년까지 그대로였어요. 그사이 밥값은 올랐는데 이 돈은 그대로였죠.",
        art: "meal-cheap",
        fact: { value: "7년 동안", tone: "warm" },
        claimIds: ["claim-frozen"],
      },
      {
        id: "e-cm-raise",
        title: "먼저 밥값을 올렸어요",
        say: "2018년 10월, 6,000원으로 올렸어요. 그때 전국에서 가장 높았어요. 나중에는 8,000원까지 올라갔어요.",
        art: "meal-raise",
        fact: { value: "6,000원", tone: "ice" },
        claimIds: ["claim-6000", "claim-8000"],
      },
      {
        id: "e-cm-cvs",
        title: "그런데 쓸 데가 편의점뿐이었어요",
        say: "카드를 받아 주는 가게 1만 1,500곳 중에 8,900곳이 편의점이었어요. 그래서 아이들은 편의점에서 끼니를 때웠어요.",
        art: "meal-convenience",
        fact: { value: "열에 여덟", tone: "warm" },
        claimIds: ["claim-card"],
      },
      {
        id: "e-cm-anywhere",
        title: "아무 식당에서나 쓰게 했어요",
        say: "2020년 8월, 경기도 안 모든 일반음식점에서 쓸 수 있게 했어요. 3,500곳이던 식당이 18만 곳이 됐어요.",
        art: "meal-anywhere",
        fact: { value: "18만 곳", tone: "ice" },
        claimIds: ["claim-card"],
      },
      {
        id: "e-cm-same",
        title: "카드 모양도 바꿨어요",
        say: "예전 카드는 보면 급식카드인 걸 알 수 있었어요. 아이가 눈치를 봤죠. 그래서 어른들이 쓰는 체크카드와 똑같이 생긴 카드로 바꿨어요.",
        art: "meal-samecard",
        fact: { value: "똑같은 모양", tone: "ice" },
        claimIds: ["claim-design"],
      },
      {
        id: "e-cm-table",
        title: "이제 식당에 앉아서 먹어요",
        say: "돈이 모자라서도 아니고, 쓸 데가 없어서도 아니고, 눈치가 보여서도 아니게 됐어요. 세 가지를 다 고쳐야 한 끼가 됩니다.",
        art: "meal-table",
        fact: { value: "8,000원", tone: "ice" },
        claimIds: ["claim-8000", "claim-card", "claim-design"],
      },
    ],
    caveat: {
      text:
        "바뀐 뒤에 아이들이 실제로 무엇을 더 먹게 됐는지, 눈치가 얼마나 덜 보이게 됐는지는 확인하지 못했어요. 무엇을 어떻게 고쳤는지까지만 적었어요.",
      claimIds: ["claim-card", "claim-design"],
    },
  },

  keyNumbers: [
    {
      id: "kn-price",
      label: "한 끼 급식단가",
      value: "4,500 → 8,000",
      unit: "원",
      caption: "2012년 이후 동결 → 2022년 8월",
      claimId: "claim-8000",
    },
    {
      id: "kn-places",
      label: "쓸 수 있는 일반음식점",
      value: "3,500 → 18만",
      unit: "곳",
      caption: "2020년 8월 31일 · 국내 최초",
      claimId: "claim-card",
    },
    {
      id: "kn-children",
      label: "지원 대상 아동",
      prefix: "약",
      value: "6만 5천",
      unit: "명",
      caption: "2020년 기준 · 만 18세 미만",
      claimId: "claim-card",
    },
  ],

  timeline: [
    {
      id: "cm-frozen",
      date: "2012",
      displayDate: "2012년",
      datePrecision: "year",
      title: "급식단가 4,500원",
      summary: "이 값이 2018년까지 그대로 유지됐다.",
      claimIds: ["claim-frozen"],
    },
    {
      id: "cm-6000",
      date: "2018-10",
      displayDate: "2018년 10월",
      datePrecision: "month",
      title: "6,000원으로 33% 인상",
      summary:
        "2018년 8월 발표해 10월부터 시행했다. 광역지자체 가운데 가장 높은 수준이 됐다.",
      claimIds: ["claim-6000"],
    },
    {
      id: "cm-card",
      date: "2020-08-31",
      displayDate: "2020년 8월 31일",
      datePrecision: "day",
      title: "모든 일반음식점에서 사용 가능",
      summary:
        "국내 처음으로 BC카드 가맹 일반음식점 전체와 연계해 3,500곳이던 사용처가 18만여 곳이 됐다.",
      claimIds: ["claim-card"],
    },
    {
      id: "cm-design",
      date: "2021-01",
      displayDate: "2021년 1월",
      datePrecision: "month",
      title: "체크카드와 같은 모양으로 전면 교체",
      summary:
        "제3자가 급식카드임을 알아볼 수 있던 기존 카드를 일반 체크카드와 같은 디자인의 IC카드로 바꿨다.",
      claimIds: ["claim-design"],
    },
    {
      id: "cm-7000",
      date: "2021-05-01",
      displayDate: "2021년 5월 1일",
      datePrecision: "day",
      title: "7,000원으로 인상",
      summary: "1회 사용 한도도 1만 2,000원에서 1만 4,000원으로 올렸다.",
      claimIds: ["claim-7000"],
    },
    {
      id: "cm-8000",
      date: "2022-08-10",
      displayDate: "2022년 8월 10일",
      datePrecision: "day",
      title: "8,000원으로 인상",
      summary: "4,500원이던 단가가 네 해 사이에 8,000원이 됐다.",
      claimIds: ["claim-8000"],
    },
  ],

  graph: {
    note:
      "한 아이의 한 끼를 막고 있던 것이 무엇이었고 각각 무엇으로 풀렸는지를 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "gyeonggi", name: "경기도", kind: "government", isFocus: true,
        description: "단가와 사용처와 카드 모양을 차례로 고친 주체" },
      { id: "children", name: "결식 우려 아동", kind: "group",
        description: "약 6만 5천 명. 만 18세 미만" },
      { id: "price", name: "급식단가", kind: "project",
        description: "2012년 4,500원에서 2022년 8,000원까지" },
      { id: "cvs", name: "편의점", kind: "company",
        description: "가맹점 1만 1,500곳 중 8,900곳" },
      { id: "restaurants", name: "일반음식점", kind: "company",
        description: "2020년 8월 이후 18만여 곳" },
      { id: "card", name: "G드림카드", kind: "project",
        description: "아동급식카드. 모양과 사용처가 함께 바뀌었다" },
      { id: "eyes", name: "주위 시선", kind: "group",
        description: "카드가 티 나면 아이가 눈치를 본다" },
    ],
    relations: [
      {
        id: "cm-r-frozen",
        fromId: "price",
        toId: "children",
        label: "2012년에 정해진 4,500원이 2018년까지 그대로였다.",
        startDate: "2012",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-frozen"],
      },
      {
        id: "cm-r-raise",
        fromId: "gyeonggi",
        toId: "price",
        label: "6,000원으로 올린 뒤 7,000원, 8,000원까지 올렸다.",
        startDate: "2018-10",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-6000", "claim-7000", "claim-8000"],
      },
      {
        id: "cm-r-cvs",
        fromId: "cvs",
        toId: "children",
        label: "가맹점 열에 여덟이 편의점이어서 편의점 음식으로 끼니를 때우게 됐다.",
        startDate: "2018-10",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-card"],
      },
      {
        id: "cm-r-open",
        fromId: "gyeonggi",
        toId: "restaurants",
        label: "국내 처음으로 모든 일반음식점에서 쓸 수 있게 했다. 3,500곳에서 18만여 곳으로.",
        startDate: "2020-08-31",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-card"],
      },
      {
        id: "cm-r-stigma",
        fromId: "card",
        toId: "eyes",
        label: "예전 카드는 제3자가 급식카드임을 알아볼 수 있었다.",
        startDate: "2020-08-31",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-design"],
      },
      {
        id: "cm-r-design",
        fromId: "gyeonggi",
        toId: "card",
        label: "일반 체크카드와 같은 디자인의 IC카드로 전면 교체했다.",
        startDate: "2021-01",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-design"],
      },
    ],
  },

  counterpoints: [
    {
      id: "cm-cp-money",
      question: "결국 돈을 더 쓴 것 아닌가?",
      response:
        "단가를 올렸으니 예산은 늘었다. 다만 이 업적에서 돈이 든 것은 단가뿐이다. 사용처를 넓힌 것은 BC카드 가맹 일반음식점과 연계한 일이고, 카드 모양을 바꾼 것은 카드를 새로 찍은 일이다. 셋 중 둘은 돈보다 설계의 문제였다.",
      claimIds: ["claim-card", "claim-design"],
    },
    {
      id: "cm-cp-design",
      question: "카드 모양까지 바꿀 일이었나?",
      response:
        "예전 카드는 마그네틱이거나 별도 디자인이어서 쓰는 아이 말고 제3자도 급식카드임을 알 수 있었다. 경기도는 그것이 아이에게 낙인감을 준다고 봤고, 일반 체크카드와 같은 디자인의 IC카드로 바꿨다. 다만 바꾼 뒤에 낙인감이 실제로 얼마나 줄었는지를 보여주는 자료는 확인하지 못했다.",
      claimIds: ["claim-design"],
    },
    {
      id: "cm-cp-effect",
      question: "아이들이 정말 더 잘 먹게 됐나?",
      response:
        "그 답은 이 위키에 없다. 사용처를 넓힌 뒤 아이들이 어디서 무엇을 먹었는지를 보여주는 자료를 확인하지 못했다. 확인한 것은 단가가 얼마에서 얼마로 올랐고, 쓸 수 있는 곳이 몇 곳에서 몇 곳이 됐고, 카드 모양이 어떻게 바뀌었는지까지다.",
      claimIds: ["claim-card"],
    },
  ],

  claims: [
    {
      id: "claim-frozen",
      text:
        "결식아동 급식단가는 2012년 4,500원으로 오른 뒤 2018년까지 동결돼 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-2018", "src-edaily-6000"],
      verified: true,
    },
    {
      id: "claim-6000",
      text:
        "경기도는 2018년 8월 결식아동 한 끼 급식단가를 4,500원에서 6,000원으로 33% 인상한다고 발표하고 그해 10월부터 시행했다. 당시 6,000원은 광역지자체 가운데 가장 높은 수준이었다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-2018", "src-edaily-6000", "src-book-30"],
      verified: true,
    },
    {
      id: "claim-card",
      text:
        "경기도는 2020년 8월 31일부터 국내 처음으로 경기도 내 모든 일반음식점에서 아동급식카드(G드림카드)를 쓸 수 있게 했다. 개선 전 가맹점은 1만 1,500곳으로 그중 편의점이 8,900곳, 일반음식점이 2,600곳이었고, BC카드 가맹 일반음식점과 연계하면서 사용처가 18만여 곳으로 늘었다. 지원 대상은 만 18세 미만 결식 우려 아동 약 6만 5천 명이다.",
      assertionType: "FACT",
      sourceIds: ["src-safetimes-2020", "src-herald-2020", "src-book-12"],
      verified: true,
    },
    {
      id: "claim-design",
      text:
        "기존 아동급식카드는 마그네틱이거나 별도 디자인이어서 사용자 외 제3자도 급식카드임을 알 수 있었다. 경기도는 이를 일반 체크카드와 같은 디자인의 IC카드로 바꿔 2020년 12월 일부 시·군에서 시작해 2021년 1월부터 전면 교체했다.",
      assertionType: "FACT",
      sourceIds: ["src-safetimes-2020", "src-herald-2020"],
      verified: true,
    },
    {
      id: "claim-7000",
      text:
        "경기도는 2021년 5월 1일부터 결식아동 급식단가를 한 끼 6,000원에서 7,000원으로 인상하고, 아동급식카드의 1회 사용 한도를 1만 2,000원에서 1만 4,000원으로 올렸다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-7000"],
      verified: true,
    },
    {
      id: "claim-8000",
      text:
        "경기도는 2022년 8월 10일부터 결식아동 급식단가를 한 끼 7,000원에서 8,000원으로 인상했다.",
      assertionType: "FACT",
      sourceIds: ["src-edaily-8000"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-seoul-2018",
      title: "경기도, 결식아동 급식단가 4500→6000원 인상",
      url: "https://www.seoul.co.kr/news/localnews/2018/08/14/20180814500117",
      publisher: "서울신문",
      publishedAt: "2018-08-14",
      type: "press",
      license: "quotable",
      quote:
        "결식아동 급식단가를 1끼 4,500원에서 6,000원으로 인상해 10월부터 시행한다. " +
        "급식단가는 2012년 4,500원으로 오른 뒤 7년째 동결돼 있었다.",
    },
    {
      id: "src-edaily-6000",
      title: "경기도, 결식아동 급식비 6천원으로 인상..전국 최고 수준",
      url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=01856486619307648",
      publisher: "이데일리",
      publishedAt: "2018-08-14",
      type: "press",
      license: "quotable",
      quote: "급식단가 6,000원은 광역지자체 가운데 최고 수준이다.",
    },
    {
      id: "src-safetimes-2020",
      title: "경기 모든 일반음식점 아동급식카드 사용 가능 … 국내 최초",
      url: "https://www.safetimes.co.kr/news/articleView.html?idxno=85324",
      publisher: "세이프타임즈",
      publishedAt: "2020-08-31",
      type: "press",
      license: "quotable",
      quote:
        "국내 처음으로 모든 일반음식점에서 G드림카드를 사용할 수 있도록 했다. " +
        "3,500곳이던 사용처가 18만여 곳으로 늘었다. 12월 일부 시·군에서 시작해 " +
        "2021년 1월부터 일반 체크카드와 같은 디자인의 IC카드로 전면 교체한다.",
    },
    {
      id: "src-herald-2020",
      title: "이재명의 묘수..아동급식카드 전면개선",
      url: "https://biz.heraldcorp.com/article/2208352",
      publisher: "헤럴드경제",
      publishedAt: "2020-01-21",
      type: "press",
      license: "quotable",
      quote:
        "전체 가맹점 1만 1,500개소 중 편의점이 8,900개소다. 기존 카드는 마그네틱 카드나 " +
        "별도디자인으로 제작돼 사용자 외 제3자가 급식카드임을 알 수 있다. " +
        "대상 아동은 약 6만 5천 명이다.",
    },
    {
      id: "src-seoul-7000",
      title: "경기도, 5월부터 결식아동 급식단가 6000원→7000원으로 인상",
      url: "https://www.seoul.co.kr/news/society/2021/04/30/20210430500008",
      publisher: "서울신문",
      publishedAt: "2021-04-30",
      type: "press",
      license: "quotable",
      quote:
        "5월 1일부터 한 끼 6,000원에서 7,000원으로 인상한다. 급식카드 1회 한도도 " +
        "1만 2,000원에서 1만 4,000원으로 올린다.",
    },
    {
      id: "src-edaily-8000",
      title: "경기도 결식아동 급식단가 7000→8000원 인상",
      url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=02542006632425352",
      publisher: "이데일리",
      publishedAt: "2022-08-09",
      type: "press",
      license: "quotable",
      quote: "8월 10일부터 결식아동 급식단가를 1식 7,000원에서 8,000원으로 인상한다.",
    },
    {
      id: "src-book-12",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 12",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "12. 경기도 결식아동 급식지원, 아동 급식카드 — 처음 급식카드의 가맹점이 대부분 " +
        "편의점이었다. 게다가 제3자가 급식카드라는 걸 알게 되면 아이들이 주눅 들 수 있다. " +
        "경기도 내 모든 일반 음식점에서 사용 가능. 체크카드와 동일한 디자인으로 교체.",
    },
    {
      id: "src-book-30",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 30",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "30. 경기도 결식 아동 급식비 전국 최고 수준으로 인상 — 기존에 4,500원이던 " +
        "급식비를 6,000원으로 33% 인상했다. (광역지자체 최고 수준)",
    },
  ],
};

export const gyeonggiChildMeal = achievementSchema.parse(raw);
