import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 경기도 재난기본소득 — 모두에게, 지역화폐로, 기한을 두고.
 *
 * 책은 두 항목으로 나눠 적는다(2학기 51 지역화폐 활성화, 54 모든 경기 도민에
 * 제3차 재난기본소득 지급). 둘은 같은 이야기다. 지역화폐는 지급 수단이고,
 * 재난기본소득은 그 수단으로 무엇을 했는지다. 그래서 하나로 묶었다.
 *
 * ★ 책의 "모든 경기 도민에 제3차"는 사실과 다르다.
 *   1·2차는 전 도민이었지만 3차는 정부 지원금에서 빠진 소득상위 12%,
 *   253만 7천 명이 대상이었다. 정부 몫과 합치면 결과적으로 모두가 받은 셈이지만
 *   '경기도 3차'의 대상은 그 12%다. 틀린 수는 출처가 책이어도 고쳐 싣는다.
 *
 * ★ 이 정책의 논지는 '얼마'가 아니라 '어떻게'다.
 *   현금이 아니라 소멸성 지역화폐로, 기한을 두고, 큰 매장을 빼고 줬다.
 *   돈이 도 밖으로 나가지 않고 동네에서 돌게 하는 설계다.
 *
 * ★ 연인원과 인원을 섞지 않는다.
 *   모션 씬의 수치는 연인원이다. 같은 사람이 1차와 2차를 모두 받았다.
 *   "경기도민 2,979만 명"이라고 읽으면 틀린다 — 도 인구는 1,400만 안팎이다.
 */

const raw: AchievementInput = {
  id: "gyeonggi-basic-income",
  slug: "gyeonggi-basic-income",
  title: "경기도 재난기본소득",
  subtitle: "현금 대신 지역화폐로, 3개월 기한을 걸어서",
  kicker: "주요 정책",
  summary:
    "코로나19 때 경기도가 세 차례에 걸쳐 지급한 재난기본소득이다. 1차는 소득을 " +
    "가리지 않고 전 도민 1,326만 명에게 1인당 10만 원, 2차는 외국인까지 포함해 " +
    "1,399만 명에게 10만 원, 3차는 정부 지원금에서 빠진 소득상위 12% 253만 명에게 " +
    "25만 원이었다. 모두 소멸성 지역화폐로 줬다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "1·2·3차의 대상과 금액, 2차 재원은 경기도 보도자료와 경기도 안내로 확인했습니다. " +
    "1차 총액은 발표 당시 보도로 받쳤습니다. 3차 총액과 실제 집행률, 소비 효과의 " +
    "사후 검증 자료는 아직 대조하지 못했습니다.",

  headlineKeyNumberId: "kn-first",

  scenes: [
    {
      id: "reach",
      kind: "quantity-track",
      heading: "세 차례에 걸쳐 갔습니다",
      lede:
        "경기도가 대상과 금액을 밝힌 시점만 짚습니다. 스크롤하면 그 사이를 지나갑니다.",
      claimIds: ["claim-first", "claim-second", "claim-third"],
      track: {
        label: "누적 지급 대상 (연인원)",
        unit: "만 명",
        direction: "up",
        max: 3000,
        note:
          "연인원이다. 같은 사람이 1차와 2차를 모두 받았으므로 서로 다른 2,979만 명이 " +
          "아니다. 경기도 인구는 1,400만 안팎이다. 각 회차의 대상 수를 더한 값이다.",
        checkpoints: [
          {
            id: "cp-1st",
            displayDate: "2020년 3월 24일",
            title: "전 도민에게, 소득을 가리지 않고",
            amount: 1326.5,
            caption:
              "1,326만 5,377명 모두에게 1인당 10만 원. 소득 조건을 두지 않았습니다. 총 1조 3,642억 원이었습니다.",
            art: "basic-everyone",
            claimId: "claim-first",
          },
          {
            id: "cp-2nd",
            displayDate: "2021년 1월 20일",
            title: "두 번째, 이번엔 외국인까지",
            amount: 2725.5,
            caption:
              "내국인 1,341만 명과 등록외국인 58만 명, 모두 1,399만 명에게 다시 10만 원. 소요 예산은 1조 4,035억 원이었습니다.",
            art: "basic-rounds",
            claimId: "claim-second",
          },
          {
            id: "cp-3rd",
            displayDate: "2021년 10월 1일",
            title: "세 번째는 정부가 빼놓은 12%에게",
            amount: 2979.2,
            caption:
              "정부 상생 국민지원금 대상에서 제외된 소득상위 12%, 253만 7천 명에게 1인당 25만 원. 이 회차는 전 도민이 아닙니다.",
            art: "basic-top12",
            claimId: "claim-third",
          },
        ],
      },
    },
    {
      id: "fund",
      kind: "composition",
      heading: "그 돈은 어디서 났나",
      lede:
        "2차 재난기본소득 1조 4,035억 원의 재원입니다. 빚을 낸 것이 아니라 쌓아 둔 기금을 헐었습니다.",
      claimIds: ["claim-second"],
      composition: {
        total: 14035,
        unit: "억 원",
        totalLabel: "제2차 재난기본소득 소요 예산",
        claimId: "claim-second",
        note:
          "경기도가 2021년 1월 20일 밝힌 재원 구성이다. 이 가운데 도민에게 지급된 몫은 " +
          "1조 3,998억 원이고 나머지 37억 원은 부대경비다.",
        groups: [
          {
            id: "fu-dev",
            label: "지역개발기금",
            amount: 8255,
            sharePercent: 58.8,
            tone: "primary",
          },
          {
            id: "fu-stab",
            label: "통합재정안정화기금",
            amount: 5380,
            sharePercent: 38.3,
            tone: "neutral",
          },
          {
            id: "fu-disaster",
            label: "재난·재해기금",
            amount: 400,
            sharePercent: 2.9,
            tone: "accent",
          },
        ],
      },
    },
  ],

  shorts: [],

  eli5: {
    intro:
      "코로나 때 경기도가 도민에게 돈을 나눠 줬어요. 그냥 돈이 아니었어요. 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-bi-everyone",
        title: "모두에게 줬어요",
        say: "돈을 많이 버는 사람인지 아닌지 따지지 않았어요. 경기도에 사는 사람 모두에게 똑같이 10만 원씩 줬어요.",
        art: "basic-everyone",
        fact: { value: "1,326만 명", tone: "ice" },
        claimIds: ["claim-first"],
      },
      {
        id: "e-bi-card",
        title: "현금이 아니라 지역화폐였어요",
        say: "통장에 돈을 넣어 준 게 아니에요. 경기도 안에서만 쓸 수 있는 카드에 넣어 줬어요.",
        art: "basic-localcard",
        fact: { value: "지역화폐", tone: "ice" },
        claimIds: ["claim-first"],
      },
      {
        id: "e-bi-expire",
        title: "기한이 있었어요",
        say: "석 달 안에 쓰지 않으면 사라졌어요. 모아 두지 말고 쓰라는 뜻이에요.",
        art: "basic-expire",
        fact: { value: "3개월", tone: "warm" },
        claimIds: ["claim-first"],
      },
      {
        id: "e-bi-shops",
        title: "그래서 동네 가게로 갔어요",
        say: "큰 백화점이나 대형마트에서는 쓸 수 없었어요. 그 돈은 동네 가게와 시장에서 쓰였어요.",
        art: "basic-shops",
        fact: { value: "동네 상권", tone: "ice" },
        claimIds: ["claim-third"],
      },
      {
        id: "e-bi-again",
        title: "한 번이 아니라 세 번이었어요",
        say: "2020년에 한 번, 2021년 초에 또 한 번, 그해 가을에 한 번 더 줬어요.",
        art: "basic-rounds",
        fact: { value: "세 차례", tone: "ice" },
        claimIds: ["claim-second", "claim-third"],
      },
      {
        id: "e-bi-top12",
        title: "세 번째는 좀 달랐어요",
        say: "세 번째는 모두에게 준 게 아니에요. 나라에서 주는 돈을 못 받은 사람들에게 줬어요. 그래야 빠지는 사람이 없으니까요.",
        art: "basic-top12",
        fact: { value: "소득상위 12%", tone: "warm" },
        claimIds: ["claim-third"],
      },
    ],
    caveat: {
      text:
        "'모든 도민에게 세 번 다 줬다'고 말하면 틀려요. 1·2차는 모두에게 갔지만 3차는 정부 지원금을 못 받은 12%만 받았어요.",
      claimIds: ["claim-third"],
    },
  },

  keyNumbers: [
    {
      id: "kn-first",
      label: "1차 지급 대상",
      prefix: "약",
      value: "1,326",
      unit: "만 명",
      caption: "소득 조건 없이 전 도민 · 1인당 10만 원",
      claimId: "claim-first",
    },
    {
      id: "kn-second-budget",
      label: "2차 소요 예산",
      value: "1조 4,035",
      unit: "억 원",
      caption: "지역개발기금 등 세 기금에서",
      claimId: "claim-second",
    },
    {
      id: "kn-third",
      label: "3차 지급 대상",
      value: "253.7",
      unit: "만 명",
      caption: "정부 지원금에서 빠진 소득상위 12% · 1인당 25만 원",
      claimId: "claim-third",
    },
  ],

  timeline: [
    {
      id: "bi-1st",
      date: "2020-03-24",
      displayDate: "2020년 3월 24일",
      datePrecision: "day",
      title: "1차 재난기본소득 발표",
      summary:
        "소득을 가리지 않고 전 도민 1,326만 5,377명에게 1인당 10만 원을 지역화폐로 주겠다고 밝혔다.",
      claimIds: ["claim-first"],
    },
    {
      id: "bi-effect",
      date: "2020-04-25",
      displayDate: "2020년 4월 25일",
      datePrecision: "day",
      title: "소상공인 설문 결과 공개",
      summary:
        "경기도시장상권진흥원이 도내 자영업자 488명에게 물은 결과가 알려졌다. 73%가 매출 증대에 도움이 될 것이라고 답했다.",
      claimIds: ["claim-survey"],
    },
    {
      id: "bi-2nd",
      date: "2021-01-20",
      displayDate: "2021년 1월 20일",
      datePrecision: "day",
      title: "2차 재난기본소득 발표",
      summary:
        "내국인과 등록외국인 약 1,399만 명에게 1인당 10만 원. 소요 예산 1조 4,035억 원을 세 기금에서 마련했다.",
      claimIds: ["claim-second"],
    },
    {
      id: "bi-3rd",
      date: "2021-10-01",
      displayDate: "2021년 10월 1일",
      datePrecision: "day",
      title: "3차 재난기본소득 신청 시작",
      summary:
        "정부 상생 국민지원금 대상에서 제외된 소득상위 12%, 253만 7천 명에게 1인당 25만 원을 지급했다.",
      claimIds: ["claim-third"],
    },
  ],

  graph: {
    note:
      "돈이 어디서 나와 어디로 가서 어디에 머물렀는지를 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "gyeonggi", name: "경기도", kind: "government", isFocus: true,
        description: "재원을 마련하고 지급을 결정한 주체" },
      { id: "funds", name: "도 기금", kind: "project",
        description: "지역개발기금·통합재정안정화기금·재난재해기금" },
      { id: "residents", name: "전 도민", kind: "group",
        description: "1·2차의 대상. 소득을 가리지 않았다" },
      { id: "top12", name: "소득상위 12%", kind: "group",
        description: "3차의 대상. 정부 지원금에서 빠진 쪽" },
      { id: "government", name: "정부", kind: "government",
        description: "상생 국민지원금으로 하위 88%를 맡은 쪽" },
      { id: "localcard", name: "소멸성 지역화폐", kind: "project",
        description: "지급 수단. 기한이 지나면 사라진다" },
      { id: "shops", name: "동네 상권", kind: "group",
        description: "큰 매장이 빠진 자리에 돈이 머문 곳" },
    ],
    relations: [
      {
        id: "bi-r-fund",
        fromId: "funds",
        toId: "gyeonggi",
        label: "빚을 내는 대신 쌓아 둔 기금을 헐어 재원을 마련했다.",
        startDate: "2021-01-20",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-second"],
      },
      {
        id: "bi-r-all",
        fromId: "gyeonggi",
        toId: "residents",
        label: "소득을 가리지 않고 전 도민에게 1인당 10만 원을 줬다.",
        startDate: "2020-03-24",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-first"],
      },
      {
        id: "bi-r-card",
        fromId: "gyeonggi",
        toId: "localcard",
        label: "현금이 아니라 기한이 지나면 사라지는 지역화폐로 줬다.",
        startDate: "2020-03-24",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-first"],
      },
      {
        id: "bi-r-shops",
        fromId: "localcard",
        toId: "shops",
        label: "백화점·대형마트·프랜차이즈 직영점에서는 쓸 수 없어 돈이 동네에 남았다.",
        startDate: "2020-03-24",
        startPrecision: "day",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-third", "claim-first"],
      },
      {
        id: "bi-r-gov",
        fromId: "government",
        toId: "residents",
        label: "상생 국민지원금으로 소득 하위 88%를 맡았다.",
        startDate: "2021-10-01",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-third"],
      },
      {
        id: "bi-r-gap",
        fromId: "gyeonggi",
        toId: "top12",
        label: "정부 지원금에서 빠진 12%를 경기도가 맡아 1인당 25만 원을 줬다.",
        startDate: "2021-10-01",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-third"],
      },
    ],
  },

  counterpoints: [
    {
      id: "bi-cp-rich",
      question: "부자에게도 주는 것은 낭비 아닌가?",
      response:
        "선별하면 가르는 비용과 시간이 들고, 경계에 걸린 사람이 빠진다. 경기도는 1·2차에서 소득을 가리지 않았다. 흥미로운 것은 3차다. 정부가 하위 88%를 맡자 경기도는 남은 12%를 맡았다. 결과적으로 모두가 받았지만, 그 12%에게 준 쪽이 경기도였다는 점은 '부자에게 준다'는 지적과 정확히 겹친다. 판단은 갈릴 수 있고, 여기서는 누가 누구에게 얼마를 줬는지만 적는다.",
      claimIds: ["claim-first", "claim-third"],
    },
    {
      id: "bi-cp-money",
      question: "결국 빚내서 나눠 준 것 아닌가?",
      response:
        "2차의 경우는 아니다. 경기도가 밝힌 재원은 지역개발기금 8,255억 원, 통합재정안정화기금 5,380억 원, 재난·재해기금 400억 원으로 모두 쌓아 둔 기금이다. 다만 기금을 헐면 그 기금이 하려던 일이 미뤄진다. 그 몫이 얼마였는지는 이 자료로 확인하지 못했다.",
      claimIds: ["claim-second"],
    },
    {
      id: "bi-cp-effect",
      question: "정말 효과가 있었나?",
      response:
        "경기도는 1차 지급의 소비 견인효과가 1.85배였다고 밝혔다. 다만 이는 경기도가 내놓은 수치다. 소상공인 설문도 경기도시장상권진흥원이 자영업자 488명에게 물은 것으로, 표본이 크지 않고 자기 응답이다. 효과가 있었다는 판단의 근거로는 쓸 수 있지만 확정된 사실로 읽으면 안 된다.",
      claimIds: ["claim-effect", "claim-survey"],
    },
  ],

  claims: [
    {
      id: "claim-first",
      text:
        "경기도는 2020년 3월 24일 소득 조건 없이 전 도민 1,326만 5,377명에게 1인당 10만 원을 지역화폐로 지급하겠다고 발표했다. 총 소요 예산은 1조 3,642억 원이며 지급일로부터 3개월이 지나면 소멸한다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-2020", "src-book-51"],
      verified: true,
    },
    {
      id: "claim-second",
      text:
        "경기도는 2021년 1월 20일 내국인 1,341만 명과 등록외국인·거소신고자 58만 명 등 약 1,399만 명에게 1인당 10만 원의 2차 재난기본소득을 소멸성 지역화폐로 지급한다고 밝혔다. 소요 예산은 1조 4,035억 원(지급액 1조 3,998억 원, 부대경비 37억 원)이며 재원은 지역개발기금 8,255억 원, 통합재정안정화기금 5,380억 원, 재난·재해기금 400억 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-gg-2nd"],
      verified: true,
    },
    {
      id: "claim-third",
      text:
        "제3차 경기도 재난기본소득은 2021년 6월 30일 기준 도내 거주 내국인 252만 1천 명과 외국인 1만 6천 명 등 253만 7천 명에게 1인당 25만 원을 지급했다. 대상은 정부의 상생 국민지원금 지급대상에서 제외된 소득상위 12%다. 백화점·대형마트·기업형 슈퍼마켓·프랜차이즈 직영점·유흥업소 등에서는 사용이 제한됐다.",
      assertionType: "FACT",
      sourceIds: ["src-gg-3rd", "src-book-54"],
      verified: true,
    },
    {
      id: "claim-effect",
      text:
        "경기도는 1차 재난기본소득의 소비 견인효과가 1.85배로, 10만 원을 지급하면 최대 18만 5천 원의 소비를 유도한다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "경기도",
      sourceIds: ["src-gg-2nd"],
      verified: true,
    },
    {
      id: "claim-survey",
      text:
        "경기도시장상권진흥원이 2020년 4월 22~24일 도내 자영업자 488명에게 온라인으로 물은 결과, 73%가 재난기본소득이 매출 증대에 도움이 될 것이라고 답했다.",
      assertionType: "CLAIM",
      assertedBy: "경기도시장상권진흥원",
      sourceIds: ["src-edaily-2020"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-gg-2nd",
      title: "경기도, 2차 재난기본소득 지급…도민 1인당 10만원",
      url: "https://gnews.gg.go.kr/news/news_detail.do?number=202101201133469195C048",
      publisher: "경기도 뉴스포털",
      publishedAt: "2021-01-20",
      type: "official",
      license: "public",
      quote:
        "소요 예산은 1조 4,035억 원으로 지급액 1조 3,998억 원과 부대경비 37억 원이다. " +
        "재원은 지역개발기금 8,255억 원, 통합재정안정화기금 5,380억 원, 재난·재해기금 400억 원이다.",
    },
    {
      id: "src-gg-3rd",
      title: "제3차 경기도 재난기본소득 Q&A",
      url: "https://gnews.gg.go.kr/news/news_view.do?number=202110011805045673C052&s_code=C052&type_m=main",
      publisher: "경기도 뉴스포털",
      publishedAt: "2021-10-01",
      type: "official",
      license: "public",
      quote:
        "6월 30일 기준 경기도 거주 내국인 252만 1천 명, 외국인 1만 6천 명이 대상이며 " +
        "1인당 25만 원을 지급한다. 정부의 상생 국민지원금 지급대상에서 제외된 소득상위 12%다.",
    },
    {
      id: "src-seoul-2020",
      title: "이재명 “전 도민에 재난기본소득 10만원”…3개월 안에 써야",
      url: "https://www.seoul.co.kr/news/society/2020/03/24/20200324500067",
      publisher: "서울신문",
      publishedAt: "2020-03-24",
      type: "press",
      license: "quotable",
      quote:
        "경기도민 1,326만 5,377명 전원에게 1인당 10만 원씩, 모두 1조 3,642억 원을 " +
        "지역화폐로 지급한다. 지급일로부터 3개월이 지나면 소멸한다.",
    },
    {
      id: "src-edaily-2020",
      title: "경기도 재난기본소득 지급했더니…자영업자 56% 매출↑",
      url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=01669526625739728",
      publisher: "이데일리",
      publishedAt: "2020-04-25",
      type: "press",
      license: "quotable",
      quote:
        "경기도시장상권진흥원이 4월 22~24일 도내 자영업자 488명을 대상으로 온라인 설문한 결과, " +
        "73%가 매출 증대에 도움이 될 것이라고 답했다.",
    },
    {
      id: "src-book-51",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 51",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "51. 지역화폐 활성화 — 성남시장 때부터 청년배당을 지역화폐로 활용했어. " +
        "그 뒤로 경기도지사 때는 지역화폐를 더 확대해서 공공 산후조리비까지 지원했지.",
    },
    {
      id: "src-book-54",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 54",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "54. 모든 경기 도민에 제3차 재난기본소득 지급 — 지방자치의 효용성을 최대한 " +
        "보여주는 정책! (다만 3차의 대상은 전 도민이 아니라 소득상위 12%였다.)",
    },
  ],
};

export const gyeonggiBasicIncome = achievementSchema.parse(raw);
