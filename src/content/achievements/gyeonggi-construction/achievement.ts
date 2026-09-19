import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 경기도 건설 불공정 단속 — 보이게 만들어서 막는다.
 *
 * 책은 두 항목으로 나눠 적는다(2학기 17 공공발주 건설공사 원가내역 공개,
 * 28 페이퍼 컴퍼니 단속). 둘은 같은 방법이다. 가려져 있던 것을 보이게 만들어
 * 손대지 못하게 하는 것. 그래서 하나로 묶었다.
 *
 * ★ 가이드의 F 묶음은 열두 항목이었다.
 *   15·17·18·24·25·27·28·33·40·45·55·56을 '불공정 단속과 행정 투명성'으로
 *   묶으려 했는데, 열둘이 한 논지를 이루지 않는다. 건설 현장이라는 한 무대에서
 *   같은 방법을 쓴 17과 28만 세운다. 나머지는 자료를 더 모은 뒤에 따로 묶는다.
 *
 * ★ 기준 금액은 10억 원이다.
 *   영문 요약을 옮긴 자료에 '100억'으로 적힌 것이 있는데, 10 billion won을
 *   잘못 옮긴 것이다. 오마이뉴스와 이데일리 두 곳이 모두 10억 원으로 적는다.
 *
 * ★ 효과는 경기도의 분석이다.
 *   경쟁률이 544대 1에서 349대 1로 내린 것은 수치이지만, 그것이 사전단속
 *   때문이라는 해석은 경기도가 내놓은 것이다. 인과를 단정하지 않는다.
 */

const raw: AchievementInput = {
  id: "gyeonggi-construction",
  slug: "gyeonggi-construction",
  title: "경기도 건설 불공정 단속",
  subtitle: "원가를 보이게, 실체 없는 업체를 걸러내게",
  kicker: "주요 업적",
  summary:
    "건설 현장에서 돈이 새는 두 곳을 각각 막은 일이다. 하나는 원가다. 경기도는 " +
    "2018년 9월 1일부터 계약금액 10억 원 이상 공공건설공사의 설계내역서와 " +
    "하도급내역서를 홈페이지에 공개했다. 다른 하나는 입찰이다. 2019년 10월부터 " +
    "전국 처음으로 입찰 단계에서 페이퍼컴퍼니를 사전단속해 3년 2개월 동안 " +
    "1,124건을 조사하고 395건을 적발했다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "원가 공개의 시점과 기준, 페이퍼컴퍼니 사전단속의 연도별 실적은 당시 보도로 " +
    "확인했습니다. 경기도가 직접 낸 보도자료로 대조하는 일은 아직 남아 있습니다. " +
    "원가 공개가 실제로 공사비를 얼마나 낮췄는지는 확인하지 못했습니다.",

  headlineKeyNumberId: "kn-caught",

  scenes: [
    {
      id: "catch",
      kind: "quantity-track",
      heading: "3년 2개월 동안 쌓인 적발",
      lede:
        "입찰 단계에서 실체를 확인한 결과입니다. 스크롤하면 해마다 쌓이는 것이 보입니다.",
      claimIds: ["claim-paper-start", "claim-paper-yearly"],
      track: {
        label: "페이퍼컴퍼니 누적 적발",
        unit: "건",
        direction: "up",
        max: 400,
        note:
          "연도별 적발 건수를 더한 값이다(19 + 104 + 160 + 112 = 395). " +
          "2019년은 10월 시행 이후 석 달치이고, 2022년은 11월까지의 집계다.",
        checkpoints: [
          {
            id: "pc-start",
            displayDate: "2019년 10월",
            title: "입찰 전에 들여다보기로 했다",
            amount: 0,
            caption:
              "전국에서 처음으로 입찰 단계 사전단속을 시작했습니다. 자본금·사무실·기술인력이 등록 기준에 맞는지 서류와 현장으로 확인합니다.",
            art: "paper-check",
            claimId: "claim-paper-start",
          },
          {
            id: "pc-2019",
            displayDate: "2019년 12월",
            title: "석 달 만에 19건",
            amount: 19,
            caption: "시행 첫 석 달 동안 114건을 조사해 19건을 적발했습니다.",
            art: "paper-shell",
            claimId: "claim-paper-yearly",
          },
          {
            id: "pc-2020",
            displayDate: "2020년 12월",
            title: "한 해 동안 104건",
            amount: 123,
            caption: "324건을 조사해 104건을 적발했습니다. 누적 123건입니다.",
            art: "paper-caught",
            claimId: "claim-paper-yearly",
          },
          {
            id: "pc-2021",
            displayDate: "2021년 12월",
            title: "가장 많이 걸린 해",
            amount: 283,
            caption: "383건을 조사해 160건을 적발했습니다. 누적 283건입니다.",
            art: "paper-caught",
            claimId: "claim-paper-yearly",
          },
          {
            id: "pc-2022",
            displayDate: "2022년 11월",
            title: "누적 395건",
            amount: 395,
            caption:
              "같은 기간 공공입찰 경쟁률은 544대 1에서 349대 1로 내렸습니다. 경기도는 사전단속의 효과로 봤습니다.",
            art: "bid-drop",
            claimId: "claim-paper-yearly",
          },
        ],
      },
    },
    {
      id: "hitrate",
      kind: "composition",
      heading: "들여다본 것 중 얼마가 걸렸나",
      lede:
        "2019년 10월부터 2022년 11월까지 사전단속한 1,124건의 결과입니다.",
      claimIds: ["claim-paper-yearly"],
      composition: {
        total: 1124,
        unit: "건",
        totalLabel: "사전단속한 건수",
        claimId: "claim-paper-yearly",
        note:
          "연도별 조사 건수를 더한 값이다(114 + 324 + 383 + 303 = 1,124). " +
          "세 건 중 한 건꼴로 등록 기준에 미치지 못한 것이 확인됐다.",
        groups: [
          {
            id: "hr-caught",
            label: "적발",
            amount: 395,
            sharePercent: 35.1,
            tone: "accent",
            detail: "등록 기준 미달",
          },
          {
            id: "hr-clear",
            label: "이상 없음",
            amount: 729,
            sharePercent: 64.9,
            tone: "neutral",
          },
        ],
        breakdownLabel: "연도별 적발",
        breakdown: [
          { id: "hr-2019", label: "2019년 (10~12월)", amount: 19, sharePercent: 4.8, tone: "accent" },
          { id: "hr-2020", label: "2020년", amount: 104, sharePercent: 26.3, tone: "accent" },
          { id: "hr-2021", label: "2021년", amount: 160, sharePercent: 40.5, tone: "accent" },
          { id: "hr-2022", label: "2022년 (11월까지)", amount: 112, sharePercent: 28.4, tone: "accent" },
        ],
      },
    },
  ],

  shorts: [],

  eli5: {
    intro:
      "공사에는 큰돈이 들어가요. 그 돈이 어디로 새는지 두 군데를 막은 이야기예요. 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-gc-hidden",
        title: "공사비가 얼마인지 알 수 없었어요",
        say: "도로를 놓고 건물을 지을 때 얼마가 들었는지 아무도 볼 수 없었어요. 볼 수 없으면 부풀려도 모르죠.",
        art: "cost-hidden",
        fact: { value: "볼 수 없다", tone: "warm" },
        claimIds: ["claim-cost"],
      },
      {
        id: "e-gc-open",
        title: "그래서 원가를 펼쳐 놨어요",
        say: "2018년 9월부터 10억 원이 넘는 공사는 설계서와 하도급 내역까지 홈페이지에 올렸어요. 누구나 볼 수 있게요.",
        art: "cost-open",
        fact: { value: "10억 원 이상", tone: "ice" },
        claimIds: ["claim-cost"],
      },
      {
        id: "e-gc-shell",
        title: "간판만 있는 회사도 있었어요",
        say: "사무실도 사람도 없이 이름만 등록해 두고 공사를 따내려는 회사들이 있었어요. 이런 걸 페이퍼컴퍼니라고 해요.",
        art: "paper-shell",
        fact: { value: "이름뿐인 회사", tone: "warm" },
        claimIds: ["claim-paper-start"],
      },
      {
        id: "e-gc-check",
        title: "공사를 주기 전에 찾아갔어요",
        say: "사무실이 진짜 있는지, 기술자가 있는지 미리 가서 봤어요. 2019년 10월부터 전국에서 처음 한 일이에요.",
        art: "paper-check",
        fact: { value: "2019년 10월", tone: "ice" },
        claimIds: ["claim-paper-start"],
      },
      {
        id: "e-gc-caught",
        title: "세 곳 중 한 곳이 걸렸어요",
        say: "3년 조금 넘게 1,124건을 들여다봤더니 395건이 기준에 못 미쳤어요.",
        art: "paper-caught",
        fact: { value: "395건", tone: "ice" },
        claimIds: ["claim-paper-yearly"],
      },
      {
        id: "e-gc-drop",
        title: "그러자 몰려드는 수가 줄었어요",
        say: "한 공사에 544군데가 달려들던 것이 349군데로 줄었어요. 경기도는 사전단속 덕분이라고 봤어요.",
        art: "bid-drop",
        fact: { value: "544 → 349", tone: "ice" },
        claimIds: ["claim-paper-yearly"],
      },
    ],
    caveat: {
      text:
        "경쟁률이 줄어든 게 정말 이 단속 때문인지는 경기도의 분석이에요. 다른 이유가 있었을 수도 있어요. 그리고 원가를 공개해서 공사비가 얼마나 내렸는지는 아직 확인하지 못했어요.",
      claimIds: ["claim-paper-yearly", "claim-cost"],
    },
  },

  keyNumbers: [
    {
      id: "kn-caught",
      label: "페이퍼컴퍼니 적발",
      value: "395",
      unit: "건",
      caption: "2019년 10월~2022년 11월 · 조사 1,124건의 35.1%",
      claimId: "claim-paper-yearly",
    },
    {
      id: "kn-threshold",
      label: "원가 공개 기준",
      value: "10",
      unit: "억 원",
      caption: "이 금액 이상 공공건설공사 · 2018년 9월 1일부터",
      claimId: "claim-cost",
    },
    {
      id: "kn-bid",
      label: "공공입찰 경쟁률",
      value: "544 → 349",
      unit: "대 1",
      caption: "2019년 → 2022년 9월 · 경기도 분석",
      claimId: "claim-paper-yearly",
    },
  ],

  timeline: [
    {
      id: "gc-seongnam",
      date: "2016-04",
      displayDate: "2016년 4월",
      datePrecision: "month",
      title: "성남시, 전국 처음으로 공사원가 공개",
      summary:
        "성남시장 시절 시 발주 공사의 세부내역과 공사원가를 홈페이지에 공개했다.",
      claimIds: ["claim-cost"],
    },
    {
      id: "gc-announce",
      date: "2018-07-27",
      displayDate: "2018년 7월 27일",
      datePrecision: "day",
      title: "경기도 원가 공개 방침 발표",
      summary:
        "9월부터 계약금액 10억 원 이상 공공건설공사의 원가 자료를 공개하겠다고 밝혔다.",
      claimIds: ["claim-cost"],
    },
    {
      id: "gc-open",
      date: "2018-09-01",
      displayDate: "2018년 9월 1일",
      datePrecision: "day",
      title: "원가 공개 시행",
      summary:
        "경기도와 직속기관·사업소·경기도시공사가 시행하는 공공건설공사의 원가를 홈페이지에 공개하기 시작했다.",
      claimIds: ["claim-cost", "claim-poll"],
    },
    {
      id: "gc-paper",
      date: "2019-10",
      displayDate: "2019년 10월",
      datePrecision: "month",
      title: "페이퍼컴퍼니 사전단속 시행",
      summary:
        "전국에서 처음으로 입찰 단계에서 건설업 등록 기준 충족 여부를 서류와 현장으로 확인하기 시작했다.",
      claimIds: ["claim-paper-start"],
    },
    {
      id: "gc-result",
      date: "2022-12-07",
      displayDate: "2022년 12월 7일",
      datePrecision: "day",
      title: "3년 2개월 실적 공개",
      summary:
        "1,124건을 조사해 395건을 적발했고, 같은 기간 공공입찰 경쟁률이 544대 1에서 349대 1로 내렸다고 밝혔다.",
      claimIds: ["claim-paper-yearly"],
    },
  ],

  graph: {
    note:
      "가려져 있던 것을 보이게 만들면 누가 무엇을 못 하게 되는지를 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "gyeonggi", name: "경기도", kind: "government", isFocus: true,
        description: "원가를 공개하고 입찰 전에 실체를 확인한 주체" },
      { id: "cost", name: "공사원가 자료", kind: "project",
        description: "설계내역서·계약내역서·하도급내역서 등" },
      { id: "residents", name: "도민", kind: "group",
        description: "공개된 원가를 볼 수 있게 된 쪽" },
      { id: "builders", name: "건설업계", kind: "group",
        description: "영업기밀이라며 반발한 쪽" },
      { id: "shells", name: "페이퍼컴퍼니", kind: "company",
        description: "서류로만 등록 기준을 갖춘 업체" },
      { id: "honest", name: "건실한 건설사", kind: "company",
        description: "수주 기회가 늘어난 쪽" },
      { id: "bidding", name: "공공입찰", kind: "project",
        description: "경쟁률이 544대 1에서 349대 1로 내렸다" },
    ],
    relations: [
      {
        id: "gc-r-open",
        fromId: "gyeonggi",
        toId: "cost",
        label: "계약금액 10억 원 이상 공사의 원가 자료를 홈페이지에 공개했다.",
        startDate: "2018-09-01",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-cost"],
      },
      {
        id: "gc-r-see",
        fromId: "cost",
        toId: "residents",
        label: "누구나 설계내역서와 하도급내역서를 볼 수 있게 됐다.",
        startDate: "2018-09-01",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-cost"],
      },
      {
        id: "gc-r-oppose",
        fromId: "builders",
        toId: "cost",
        label: "건설업계는 영업기밀이라며 반발했다.",
        startDate: "2018-07-27",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-cost"],
      },
      {
        id: "gc-r-screen",
        fromId: "gyeonggi",
        toId: "shells",
        label: "입찰 단계에서 자본금·사무실·기술인력을 확인해 걸러냈다.",
        startDate: "2019-10",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-paper-start"],
      },
      {
        id: "gc-r-caught",
        fromId: "shells",
        toId: "bidding",
        label: "1,124건 중 395건이 등록 기준에 미치지 못한 것으로 확인됐다.",
        startDate: "2022-12-07",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-paper-yearly"],
      },
      {
        id: "gc-r-honest",
        fromId: "bidding",
        toId: "honest",
        label: "경쟁률이 내리면서 건실한 건설사의 수주 기회가 늘어난 것으로 경기도는 분석했다.",
        startDate: "2022-12-07",
        startPrecision: "day",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-paper-yearly"],
      },
    ],
  },

  counterpoints: [
    {
      id: "gc-cp-secret",
      question: "원가는 기업의 영업기밀 아닌가?",
      response:
        "건설업계는 그렇게 주장하며 반발했다. 다만 공개 대상은 민간공사가 아니라 세금으로 발주한 공공건설공사이고, 공개 항목은 설계내역서와 계약내역서, 하도급내역서처럼 그 공사에 얼마가 들었는지를 보여주는 자료다. 경기도가 케이스탯리서치에 의뢰해 도민 1,000명에게 물은 결과로는 일반건설 부문 90%, 주택건설 부문 92%가 공개에 찬성했다.",
      claimIds: ["claim-cost", "claim-poll"],
    },
    {
      id: "gc-cp-cause",
      question: "경쟁률이 내린 게 정말 단속 때문인가?",
      response:
        "그렇게 단정할 수 없다. 2019년 544대 1이던 공공입찰 경쟁률이 2022년 9월 349대 1로 내린 것은 수치이지만, 그 원인이 사전단속이라는 해석은 경기도가 내놓은 것이다. 건설 경기나 발주 물량 같은 다른 요인이 함께 작용했을 수 있고, 이 위키는 그것을 가려낼 자료를 갖고 있지 않다.",
      claimIds: ["claim-paper-yearly"],
    },
    {
      id: "gc-cp-cost-effect",
      question: "원가를 공개해서 공사비가 실제로 내렸나?",
      response:
        "확인하지 못했다. 이 업적이 적을 수 있는 것은 무엇을 언제부터 공개했는지까지다. 공개 이후 낙찰가나 공사비가 어떻게 달라졌는지를 보여주는 자료를 찾지 못했다. 확인하지 못한 것을 성과로 적지 않는다.",
      claimIds: ["claim-cost"],
    },
  ],

  claims: [
    {
      id: "claim-cost",
      text:
        "경기도는 2018년 9월 1일부터 경기도와 직속기관·사업소·경기도시공사가 시행하는 계약금액 10억 원 이상 공공건설공사의 설계내역서·계약(변경)내역서·하도급내역서 등 원가 자료를 홈페이지에 공개했다. 이재명 지사는 성남시장이던 2016년 4월 전국에서 처음으로 시 발주 공사의 세부내역과 공사원가를 공개한 바 있다. 건설업계는 영업기밀이라며 반발했다.",
      assertionType: "FACT",
      sourceIds: ["src-ohmy-2018", "src-edaily-cost-2018", "src-book-17"],
      verified: true,
    },
    {
      id: "claim-poll",
      text:
        "경기도가 케이스탯리서치에 의뢰해 2018년 8월 31일~9월 1일 도민 1,000명에게 물은 결과, 공공건설공사 원가 공개에 일반건설 부문은 90%, 주택건설 부문은 92%가 찬성했다.",
      assertionType: "CLAIM",
      assertedBy: "경기도(케이스탯리서치 조사)",
      sourceIds: ["src-edaily-cost-2018"],
      verified: true,
    },
    {
      id: "claim-paper-start",
      text:
        "경기도는 2019년 10월 전국에서 처음으로 공공건설공사 입찰 단계의 페이퍼컴퍼니 사전단속 제도를 시행했다. 자본금·사무실·기술인력 등 건설업 등록 기준 충족 여부를 서류 검토와 현장 점검으로 확인한다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-paper-2019", "src-edaily-paper-2022", "src-book-28"],
      verified: true,
    },
    {
      id: "claim-paper-yearly",
      text:
        "경기도가 2022년 12월 7일 밝힌 집계에 따르면 2019년 10월부터 2022년 11월까지 사전단속으로 1,124건을 조사해 395건을 적발했다. 연도별로는 2019년 114건 중 19건, 2020년 324건 중 104건, 2021년 383건 중 160건, 2022년 11월까지 303건 중 112건이다. 같은 기간 공공입찰 경쟁률은 2019년 544대 1에서 2022년 9월 349대 1로 35.8% 내렸다.",
      assertionType: "FACT",
      sourceIds: ["src-edaily-paper-2022"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-ohmy-2018",
      title: "이재명 “공사비 부풀리기... 원가공개로 막겠다”",
      url: "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0002458340",
      publisher: "오마이뉴스",
      publishedAt: "2018-07-27",
      type: "press",
      license: "quotable",
      quote:
        "9월부터 계약금액 10억 원 이상의 공공건설공사에 대해 설계내역서, 계약(변경)내역서, " +
        "하도급내역서, 원하도급 대비표 등을 공개한다. 성남시장이던 2016년 4월 전국 최초로 " +
        "시 발주 공사의 세부내역과 공사원가를 홈페이지에 공개했다. 누군가의 부당한 이익은 " +
        "누군가의 부당한 손실이다",
    },
    {
      id: "src-edaily-cost-2018",
      title: "경기도 공공건설공사 원가 공개 “도민 10명 중 9명 찬성”",
      url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=02607606619339136",
      publisher: "이데일리",
      publishedAt: "2018-09-11",
      type: "press",
      license: "quotable",
      quote:
        "9월 1일부터 계약금액 10억 원 이상 공공건설공사의 원가를 공개한다. " +
        "케이스탯리서치가 8월 31일~9월 1일 도민 1,000명에게 물은 결과 일반건설 부문 90%, " +
        "주택건설 부문 92%가 찬성했다.",
    },
    {
      id: "src-hankook-paper-2019",
      title: "“경기도 발주공사에서 페이퍼컴퍼니 입찰단계부터 배제한다”",
      url: "https://www.hankookilbo.com/news/article/201909300978096027",
      publisher: "한국일보",
      publishedAt: "2019-09-30",
      type: "press",
      license: "quotable",
      quote:
        "10월부터 공공건설공사 입찰 참여 업체를 대상으로 자본금, 사무실, 기술인력 등 " +
        "건설업 등록 기준 충족 여부를 사전에 단속한다.",
    },
    {
      id: "src-edaily-paper-2022",
      title: "경기도, 페이퍼컴퍼니 단속 ‘벌떼입찰’ 줄어…경쟁률 ⅓↓",
      url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=01820406632556224",
      publisher: "이데일리",
      publishedAt: "2022-12-07",
      type: "press",
      license: "quotable",
      quote:
        "2019년 10월부터 2022년 11월까지 1,124건을 조사해 395건을 적발했다. " +
        "2019년 114건 중 19건, 2020년 324건 중 104건, 2021년 383건 중 160건, " +
        "2022년 303건 중 112건이다. 공공입찰 경쟁률은 2019년 544대 1에서 " +
        "2022년 9월 349대 1로 35.8% 줄었다. 사전단속을 통해 서류로만 등록기준을 갖춘 " +
        "불공정거래업체를 근절하고 건실한 건설사의 수주 기회가 늘어난 것으로 분석한다",
    },
    {
      id: "src-book-17",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 17",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "17. 공공발주 건설공사 원가내역 공개 — 이거 진짜 중요해. 이렇게 되면 민간공사에서 " +
        "원가를 높게 책정해 버릴 수가 없겠지. 원가를 비교할 수 있게 되니까.",
    },
    {
      id: "src-book-28",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 28",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "28. 페이퍼 컴퍼니 단속 — 공사수주를 노리는 페이퍼 컴퍼니를 단속함으로써 " +
        "입찰 단계에서 행정처분 받고 수주에서 제외되도록 했다.",
    },
  ],
};

export const gyeonggiConstruction = achievementSchema.parse(raw);
