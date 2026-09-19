import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 주식시장 개선 — Sprint 3. 세 번째 스토리.
 *
 * 출처
 *   출발점은 나무위키였지만 그건 사용자 편집 위키라 우리 근거 체계에 들어갈 수 없다.
 *   단서 목록으로만 쓰고, 항목마다 1차 자료를 찾아 붙였다.
 *   - 제도: 국가법령정보센터(상법 개정이유), 금융위원회 보도자료 5건, 기획재정부
 *   - 지수: 한국거래소 정보데이터시스템. 다만 조회 화면이라 특정 시점을 고정 인용할 수
 *     없어, 날짜별 수치는 같은 날 보도로 대조했다. 이 스토리에서 press를 쓴 곳은
 *     지수 종가뿐이고 제도 서술에는 쓰지 않았다.
 *
 * 이 스토리를 고른 이유는 두 가지다.
 *
 * 1. 전용 개념이 새롭다. 항로(공간)도 자금·면적(몫)도 아닌 시계열이다.
 *    확장 지점이 제대로 설계됐는지 시험한다.
 *
 * 2. 정직성을 시험한다. 지수는 올랐다가 되밀렸다. 고점에서 끊은 차트를 그리면
 *    그건 자료가 아니라 선전물이고, 이 제품의 전제가 무너진다.
 *    그래서 하락 구간까지 전부 싣고, 쟁점 섹션에서 정면으로 다룬다.
 */

const raw: AchievementInput = {
  id: "stock-market",
  slug: "stock-market",
  title: "주식시장 개선",
  subtitle: "코리아 디스카운트를 줄이려는 제도 개편",
  kicker: "주요 정책",
  categories: ["economy", "institution"],
  summary:
    "한국 주식시장은 오래 '코리아 디스카운트'라 불리는 저평가를 겪었다. " +
    "이사의 충실의무 확대와 자사주 소각 의무화는 상법 개정으로 이미 시행됐고, 상장폐지 제도와 " +
    "불공정거래 제재도 개편됐다. " +
    "지수는 크게 올랐다가 2026년 7월 이후 되밀렸다. 오른 구간과 내린 구간을 함께 본다.",
  type: "event",
  publishStatus: "published",
  featured: true,

  scenes: [
    {
      id: "index-series",
      kind: "index-series",
      heading: "지수는 오르고, 또 내렸습니다",
      lede:
        "오른 구간만 보여주면 자료가 아니라 선전물입니다. 고점 이후 되밀린 구간까지 함께 싣습니다. 아래 연표에서 시점을 옮기면 차트에도 그 시점이 찍힙니다.",
      claimIds: ["claim-index-series", "claim-drawdown"],
      series: {
        name: "코스피",
        unit: "포인트",
        claimId: "claim-index-series",
        note:
          "돌파·붕괴가 보도된 날의 지수대만 표시한 개략 시계열이다. 일별 종가 전체가 아니며, " +
          "마지막 점(2026년 7월 29일) 이후 구간은 아직 반영하지 않았다. " +
          "한국거래소 일별 종가로 대조한 뒤 확정한다.",
        instruments: [
          {
            id: "in-duty",
            date: "2025-07-22",
            displayDate: "2025년 7월 22일",
            label: "이사 충실의무 확대",
            status: "enacted",
            detail: "법률 제20991호",
            claimId: "claim-duty",
          },
          {
            id: "in-tax",
            date: "2025-07-31",
            displayDate: "2025년 7월 31일",
            label: "증권거래세율 환원",
            status: "announced",
            detail: "2025년 세제개편안",
            claimId: "claim-transactiontax",
          },
          {
            id: "in-capgains",
            date: "2025-09-15",
            displayDate: "2025년 9월 15일",
            label: "대주주 기준 유지",
            status: "announced",
            detail: "종목당 50억 원",
            claimId: "claim-capgains",
          },
          {
            id: "in-delisting",
            date: "2026-02-12",
            displayDate: "2026년 2월 12일",
            label: "상장폐지 개혁 방안",
            status: "announced",
            detail: "금융위원회·한국거래소",
            claimId: "claim-delisting",
          },
          {
            id: "in-buyback",
            date: "2026-03-06",
            displayDate: "2026년 3월 6일",
            label: "자사주 소각 의무화",
            status: "enacted",
            detail: "법률 제21448호",
            claimId: "claim-buyback",
          },
          {
            id: "in-reform",
            date: "2026-03-18",
            displayDate: "2026년 3월 18일",
            label: "자본시장 정책방향",
            status: "announced",
            detail: "4대 정책방향",
            claimId: "claim-reform",
          },
        ],
        points: [
          { date: "2025-06-11", value: 2900, milestone: true, label: "2,900선" },
          { date: "2025-06-20", value: 3000, milestone: true, label: "3,000선 회복" },
          { date: "2025-06-24", value: 3100, milestone: false },
          { date: "2025-10-27", value: 4000, milestone: true, label: "4,000선" },
          { date: "2026-01-22", value: 5000, milestone: true, label: "5,000선" },
          { date: "2026-02-25", value: 6000, milestone: false },
          { date: "2026-05-06", value: 7000, milestone: false },
          { date: "2026-05-15", value: 8000, milestone: false },
          { date: "2026-06-18", value: 9000, milestone: true, label: "9,000선 · 고점" },
          { date: "2026-07-13", value: 7000, milestone: true, label: "7,000선 하회" },
          { date: "2026-07-29", value: 6000, milestone: true, label: "6,000선 하회" },
        ],
      },

    },
  ],

  /**
   * ⑦ 쇼츠.
   *
   * 제목의 '한 줄'은 상법 제382조의3이다 — 이사가 회사뿐 아니라 총주주의 이익을
   * 보호하고 전체 주주를 공평하게 대우해야 한다는 조항. 근거를 그쪽에 건다.
   */
  shorts: [
    {
      id: "short-sm-01",
      title: "이재명의 주식시장을 정상화한 한 줄의 마법",
      summary:
        "이사의 충실의무 대상에 주주를 넣은 상법 개정을 다룹니다. 근거에서 개정 조문과 공포 시점을 확인할 수 있습니다.",
      youtubeId: "lU-tfo48g2I",
      claimIds: ["claim-duty", "claim-buyback"],
      publishedAt: "2026-09-19",
    },
  ],

  /**
   * ④ 관계도.
   *
   * 기관을 늘어놓고 제도를 잇는 그림은 만들지 않았다. 그건 "어떤 제도가 언제
   * 도입됐나"이고, 연표가 이미 더 잘 한다. 관계도를 그렇게 쓰면 화면 하나가
   * 낭비된다.
   *
   * 대신 **힘이 어느 쪽으로 옮겨가나**를 그린다. 코리아 디스카운트의 핵심은
   * 일반주주가 회사의 결정과 이익에서 밀려나 있었다는 것이므로, 제도 하나하나가
   * 누구 쪽으로 힘을 옮기는지가 이 업적의 논지다. 연표가 못 하는 일이다.
   *
   * 이득만 그리지 않는다. 부담이 느는 쪽도 같은 굵기로 그린다 — 한쪽만 그리면
   * 자료가 아니라 홍보물이 된다.
   */
  graph: {
    note:
      "제도가 힘을 어느 쪽으로 옮기는지를 그렸다. 가운데가 일반주주다. " +
      "이득을 보는 쪽만이 아니라 부담이 느는 쪽도 함께 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 시행된 제도만 남는다.",
    entities: [
      { id: "retail", name: "일반주주", kind: "group", isFocus: true,
        description: "회사의 결정과 이익에서 밀려나 있던 쪽" },
      { id: "major", name: "지배주주", kind: "group",
        description: "경영권을 쥐고 넘길 수 있는 쪽" },
      { id: "listed", name: "상장회사", kind: "company",
        description: "규칙이 직접 적용되는 쪽" },
      { id: "manipulator", name: "시세조종 세력", kind: "group",
        description: "값을 인위로 움직여 이익을 얻으려는 쪽" },
      { id: "shell", name: "부실 상장사", kind: "company",
        description: "돈을 벌지 못한 채 시장에 남아 있던 회사" },
      { id: "assembly", name: "국회", kind: "government",
        description: "상법을 고친 쪽" },
      { id: "fsc", name: "금융위원회", kind: "government",
        description: "자본시장 제도를 만드는 쪽" },
      { id: "krx", name: "한국거래소", kind: "organization",
        description: "시장을 운영하고 상장·폐지를 판단하는 쪽" },
      { id: "duty", name: "이사 충실의무", kind: "project",
        description: "2025년 7월 22일 법률 제20991호" },
      { id: "buyback", name: "자사주 소각 의무", kind: "project",
        description: "2026년 3월 6일 법률 제21448호" },
      { id: "mto", name: "의무공개매수", kind: "project",
        description: "자본시장법 개정안. 아직 시행 전" },
      { id: "sanction", name: "불공정거래 제재", kind: "project",
        description: "과징금과 거래·임원 제한" },
      { id: "delisting", name: "상장폐지 개혁", kind: "project",
        description: "2026년 2월 12일 발표" },
    ],
    relations: [
      {
        id: "sr-duty-law",
        fromId: "assembly",
        toId: "duty",
        label: "상법을 고쳐 이사의 충실의무 대상에 주주를 넣었다.",
        startDate: "2025-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-duty"],
      },
      {
        id: "sr-duty-retail",
        fromId: "duty",
        toId: "retail",
        label: "회사만 보던 판단에 총주주의 이익을 함께 놓게 했다. 전체 주주를 공평하게 대해야 한다.",
        startDate: "2025-07",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-duty"],
      },
      {
        id: "sr-sanction-fsc",
        fromId: "fsc",
        toId: "sanction",
        label: "부당이득의 최대 2배 과징금과, 최대 5년의 거래·임원 선임 제한을 시행했다.",
        startDate: "2025-04",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-manipulation"],
      },
      {
        id: "sr-sanction-manip",
        fromId: "sanction",
        toId: "manipulator",
        label: "적발되면 번 돈을 토해내고 최대 5년 시장에서 나가야 한다. 이쪽은 부담이 는다.",
        startDate: "2025-04",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-manipulation"],
      },
      {
        id: "sr-sanction-retail",
        fromId: "sanction",
        toId: "retail",
        label: "값을 속여 올려 손해를 떠안는 쪽이 줄어든다.",
        startDate: "2025-04",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-manipulation"],
      },
      {
        id: "sr-delisting-fsc",
        fromId: "fsc",
        toId: "delisting",
        label: "한국거래소와 함께 상장폐지 개혁 방안을 발표했다. 시가총액 기준을 단계적으로 올린다.",
        startDate: "2026-02",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-delisting"],
      },
      {
        id: "sr-delisting-krx",
        fromId: "krx",
        toId: "delisting",
        label: "집중관리기간을 운영하며 퇴출 절차를 직접 맡는다.",
        startDate: "2026-02",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-delisting"],
      },
      {
        id: "sr-delisting-shell",
        fromId: "delisting",
        toId: "shell",
        label: "시가총액 기준이 150억에서 300억까지 올라 남아 있기 어려워진다. 이쪽은 부담이 는다.",
        startDate: "2026-02",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-delisting"],
      },
      {
        id: "sr-delisting-retail",
        fromId: "delisting",
        toId: "retail",
        label: "부실 회사가 오래 남아 시장 전체의 신뢰를 갉는 일이 줄어든다.",
        startDate: "2026-02",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-delisting"],
      },
      {
        id: "sr-buyback-law",
        fromId: "assembly",
        toId: "buyback",
        label: "상법을 고쳐 취득한 자기주식을 1년 안에 소각하도록 했다.",
        startDate: "2026-03",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-buyback"],
      },
      {
        id: "sr-buyback-listed",
        fromId: "buyback",
        toId: "listed",
        label: "사들인 자기주식을 계속 들고 있을 수 없다. 임직원 보상 등은 주주총회 승인으로 예외를 둔다.",
        startDate: "2026-03",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-buyback"],
      },
      {
        id: "sr-buyback-retail",
        fromId: "buyback",
        toId: "retail",
        label: "언제든 다시 풀릴 수 있던 주식이 사라져, 남은 주주의 몫이 뒤늦게 묽어지지 않는다.",
        startDate: "2026-03",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-buyback"],
      },
      {
        id: "sr-reform-fsc",
        fromId: "fsc",
        toId: "retail",
        label: "신뢰·주주보호·혁신·시장접근성 네 방향으로 묶어 자본시장 체질개선 방안을 발표했다.",
        startDate: "2026-03",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-reform"],
      },
      {
        id: "sr-mto-fsc",
        fromId: "fsc",
        toId: "mto",
        label: "경영권 지분을 포함해 총 50%+1주 이상을 매수하도록 하는 안을 제시했다. 아직 시행 전이다.",
        startDate: "2026-09",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-mto"],
      },
      {
        id: "sr-mto-retail",
        fromId: "mto",
        toId: "retail",
        label: "지배주주만 받던 경영권 프리미엄을 일반주주도 나눠 받게 한다.",
        startDate: "2026-09",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-mto"],
      },
      {
        id: "sr-mto-major",
        fromId: "mto",
        toId: "major",
        label: "지분을 넘길 때 일반주주 몫까지 사야 하므로 거래 부담이 는다. 이쪽은 손해다.",
        startDate: "2026-09",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-mto"],
      },
    ],
  },

  /**
   * ① 쉬운 설명.
   *
   * 주식을 모르는 사람에게 "코리아 디스카운트"부터 꺼내면 아무것도 전해지지
   * 않는다. 이 업적이 실제로 바꾼 것은 **회사가 주주를 어떻게 대해야 하는가**의
   * 규칙이므로, 규칙 하나하나를 그림으로 보인다.
   *
   * 지수를 첫 장면에 두되 성적표로 쓰지 않는다. 오른 것도 내린 것도 함께 놓고,
   * 마지막 단서에서 지수와 제도를 분리해야 한다고 밝힌다. 쉬운 설명이라고
   * 유리한 구간만 보이면 그건 설명이 아니라 선전이다.
   */
  eli5: {
    intro:
      "주식시장에서 규칙 몇 가지가 바뀌었어요. 무엇이 어떻게 달라졌는지 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-sm-index",
        title: "값은 올랐다가 다시 내렸어요",
        say: "주식 값을 한 숫자로 모은 것을 지수라고 해요. 3,021에서 9,063까지 올랐다가 5,663으로 내려왔어요.",
        art: "up-down",
        fact: { value: "3,021 → 9,063 → 5,663", tone: "warm" },
        claimIds: ["claim-index-series"],
      },
      {
        id: "e-sm-duty",
        title: "회사를 맡은 사람이 주주도 챙겨야 해요",
        say: "회사를 이끄는 사람을 이사라고 해요. 원래는 회사만 챙기면 됐는데, 이제는 주식을 가진 사람 모두를 공평하게 대해야 해요.",
        art: "many-owners",
        fact: { value: "2025년 7월 법이 바뀜", tone: "ice" },
        claimIds: ["claim-duty"],
      },
      {
        id: "e-sm-buyback",
        title: "회사가 자기 주식을 사면 없애야 해요",
        say: "사두고 갖고만 있으면 나중에 다시 내놓을 수 있어요. 그러면 내 몫이 다시 줄어요. 이제는 1년 안에 없애야 해요.",
        art: "burn-share",
        fact: { value: "2026년 3월 법이 바뀜", tone: "ice" },
        claimIds: ["claim-buyback"],
      },
      {
        id: "e-sm-mto",
        title: "회사를 통째로 살 땐 작은 주주도 챙겨요",
        say: "회사를 사는 쪽은 큰 주주 것만 비싸게 사고 작은 주주는 두고 갔어요. 작은 주주도 같이 팔 수 있게 하자는 규칙을 만들고 있어요.",
        art: "share-premium",
        fact: { value: "아직 만드는 중", tone: "warm" },
        claimIds: ["claim-mto"],
      },
      {
        id: "e-sm-penalty",
        title: "값을 속여 올리면 크게 물어내요",
        say: "일부러 값을 올려 돈을 벌면, 번 돈의 두 배까지 물어내야 해요. 최대 5년 동안 주식을 사고팔 수도 없어요.",
        art: "penalty",
        fact: { value: "번 돈의 2배 · 최대 5년", tone: "warm" },
        claimIds: ["claim-manipulation"],
      },
      {
        id: "e-sm-delisting",
        title: "속이 빈 회사는 더 빨리 내보내요",
        say: "돈도 못 벌고 값도 아주 싼 회사가 오래 남아 있으면 시장을 믿기 어려워요. 내보내는 기준을 더 엄하게 했어요.",
        art: "exit-gate",
        fact: { value: "2026년 2월 발표", tone: "ice" },
        claimIds: ["claim-delisting"],
      },
    ],
    caveat: {
      text:
        "지수가 오르내린 것을 제도의 성적표로 읽으면 안 돼요. 지수는 금리와 환율, 다른 나라 시장처럼 정책 밖의 일에도 크게 움직여요. 규칙이 바뀐 것과 값이 움직인 것은 따로 봐야 해요.",
      claimIds: ["claim-index-series", "claim-drawdown"],
    },
  },

  keyNumbers: [
    {
      id: "kn-peak",
      label: "코스피 고점",
      value: "9,000",
      unit: "선",
      caption: "2026년 6월 18일",
      claimId: "claim-index-series",
    },
    {
      id: "kn-drawdown",
      label: "고점 대비 하락",
      prefix: "약",
      value: "37.5",
      unit: "%",
      caption: "9,063.84 → 5,663.24 (2026년 7월 29일 종가)",
      claimId: "claim-drawdown",
    },
    {
      id: "kn-marketcap",
      label: "유가증권시장 시가총액",
      value: "3,476.8",
      unit: "조 원",
      caption: "2025년 말 · 전년 말 대비 77.2% 증가",
      claimId: "claim-marketcap",
    },
  ],

  timeline: [
    {
      id: "sm-3000",
      date: "2025-06-20",
      displayDate: "2025년 6월",
      datePrecision: "day",
      title: "코스피 3,000선 회복",
      summary: "새 정부 출범 직후 지수가 3,000선을 회복했다.",
      claimIds: ["claim-index-series"],
    },
    {
      id: "sm-taskforce",
      date: "2025-07",
      displayDate: "2025년 7월",
      datePrecision: "month",
      title: "주가조작 대응 체계 출범",
      summary:
        "부당이득 대비 과징금과 자본시장 퇴출을 포함한 제재 체계가 가동되기 시작했다.",
      claimIds: ["claim-manipulation"],
    },
    {
      id: "sm-withdraw",
      date: "2025-09-15",
      displayDate: "2025년 9월",
      datePrecision: "day",
      title: "대주주 양도세 기준 하향 철회",
      summary:
        "50억 원에서 10억 원으로 낮추려던 안을 철회하고 현행 기준을 유지하기로 했다.",
      claimIds: ["claim-capgains"],
    },
    {
      id: "sm-delisting",
      date: "2026-02-12",
      displayDate: "2026년 2월",
      datePrecision: "day",
      title: "상장폐지 제도 개편 발표",
      summary: "집중관리기간 운영과 상장폐지 요건 강화, 절차 효율화가 포함됐다.",
      claimIds: ["claim-delisting"],
    },
    {
      id: "sm-reform",
      date: "2026-03-18",
      displayDate: "2026년 3월",
      datePrecision: "day",
      title: "자본시장 체질개선 방안 발표",
      summary:
        "신뢰·주주보호·혁신·시장접근성을 축으로 불공정거래 제재, 중복상장 제한, 결제주기 단축 등이 제시됐다.",
      claimIds: ["claim-reform"],
    },
    {
      id: "sm-mto",
      date: "2026-09",
      displayDate: "2026년 9월",
      datePrecision: "month",
      title: "의무공개매수 도입 추진",
      summary:
        "경영권이 바뀔 때 일반주주도 경영권 프리미엄을 나눠 받도록 하는 자본시장법 개정이 논의되고 있다.",
      claimIds: ["claim-mto"],
    },
    {
      id: "sm-peak",
      date: "2026-06-18",
      displayDate: "2026년 6월",
      datePrecision: "day",
      title: "코스피 9,000선 — 고점",
      summary: "지수가 9,000선에 닿았다. 이후 하락이 시작된다.",
      claimIds: ["claim-index-series"],
    },
    {
      id: "sm-fall",
      date: "2026-07-29",
      displayDate: "2026년 7월",
      datePrecision: "day",
      title: "6,000선 하회",
      summary:
        "7월 13일 7,000선이 무너졌고, 29일 종가 5,663.24로 6,000선도 내줬다. 고점 대비 약 37.5% 하락이다.",
      claimIds: ["claim-drawdown"],
    },
  ],

  counterpoints: [
    {
      id: "sm-cp-fall",
      question: "지수가 결국 되밀렸는데 개선이라고 할 수 있나?",
      response:
        "지수와 제도는 분리해서 봐야 한다. 지수는 금리·환율·해외 증시 등 정책 밖 요인에 크게 좌우되고, 실제로 고점 대비 약 37.5% 하락했다. 반면 이사 충실의무 확대, 자사주 소각, 상장폐지 요건 강화 같은 제도 변화는 지수와 무관하게 남는다. 이 스토리가 다루는 것은 후자이며, 지수는 그 배경으로만 싣는다.",
      claimIds: ["claim-drawdown", "claim-reform"],
    },
    {
      id: "sm-cp-tax",
      question: "증권거래세를 올리면 투자자 부담이 늘지 않나?",
      response:
        "인상안은 폐지된 금융투자소득세를 되돌리는 취지로 제시됐다. 다만 거래세는 손익과 무관하게 부과되므로 손실을 본 투자자에게도 걸린다는 비판이 있다. 이 항목은 세제개편안 단계이며 확정 내용은 국회 논의 결과에 달려 있다.",
      claimIds: ["claim-transactiontax"],
    },
    {
      id: "sm-cp-causal",
      question: "지수 상승이 정부 정책 때문인가?",
      response:
        "인과를 단정할 수 없다. 같은 기간 글로벌 증시도 올랐고, 반도체 업황과 환율이 함께 움직였다. 이 스토리는 제도 변화의 내용과 시점을 기록할 뿐, 지수 변동의 원인을 정책으로 돌리지 않는다.",
      claimIds: ["claim-index-series"],
    },
  ],

  claims: [
    {
      id: "claim-index-series",
      text:
        "코스피는 2025년 6월 20일 종가 3,021.84로 3년 6개월 만에 3,000선을 회복했고, " +
        "2026년 6월 18일 종가 9,063.84로 사상 처음 9,000선을 넘었다. " +
        "이후 하락해 2026년 7월 29일 종가 5,663.24로 6,000선을 내주었다.",
      assertionType: "FACT",
      sourceIds: ["src-krx-index", "src-kospi-3000", "src-kospi-9000", "src-kospi-5663"],
      verified: true,
    },
    {
      id: "claim-drawdown",
      text:
        "코스피는 고점(2026년 6월 18일 종가 9,063.84) 대비 2026년 7월 29일 종가 5,663.24까지 " +
        "약 37.5% 하락했다. 같은 날 유가증권·코스닥 두 시장에 이틀 연속 서킷브레이커가 발동했다.",
      assertionType: "FACT",
      sourceIds: ["src-krx-index", "src-kospi-9000", "src-kospi-5663"],
      verified: true,
    },
    {
      id: "claim-marketcap",
      text:
        "유가증권시장 시가총액은 2024년 말 1,962조 1,000억 원에서 2025년 말 3,476조 8,000억 원으로 " +
        "77.2% 늘어 사상 처음 3,000조 원을 넘었다.",
      assertionType: "FACT",
      sourceIds: ["src-krx-index", "src-marketcap-2025"],
      verified: true,
    },
    {
      id: "claim-duty",
      text:
        "2025년 7월 22일 법률 제20991호로 상법이 개정되어, 이사가 직무를 수행할 때 회사뿐 아니라 " +
        "총주주의 이익을 보호하고 전체 주주의 이익을 공평하게 대우하도록 하는 조항이 신설되었다.",
      assertionType: "FACT",
      sourceIds: ["src-law-commercial"],
      verified: true,
    },
    {
      id: "claim-buyback",
      text:
        "2026년 3월 6일 법률 제21448호로 상법이 개정되어, 회사가 자기주식을 취득한 경우 " +
        "1년 이내에 소각할 의무가 부과되었다. 임직원 보상 등의 경우에는 주주총회 승인에 따라 " +
        "예외적인 보유와 처분이 허용된다.",
      assertionType: "FACT",
      sourceIds: ["src-law-commercial"],
      verified: true,
    },
    {
      id: "claim-mto",
      text:
        "경영권 변경 시 일반주주도 경영권 프리미엄을 나눠 받도록 하는 의무공개매수 제도가 " +
        "자본시장법 개정으로 추진되고 있다. 정부는 매수 의무 범위를 경영권 지분을 포함해 " +
        "총 50%+1주 이상으로 하는 안을 제시했다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-mto"],
      verified: true,
    },
    {
      id: "claim-manipulation",
      text:
        "불공정거래 행위자에게 부당이득의 최대 2배까지 과징금을 부과할 수 있고, " +
        "2025년 4월 23일부터는 금융투자상품 거래와 상장사 임원 선임·재임을 최대 5년까지 " +
        "제한하는 명령이 시행되었다. 2025년 7월 9일에는 주가조작 근절 합동대응단 설치를 담은 " +
        "「자본시장 불공정거래 근절 실천방안」이 발표되었다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-sanction", "src-fsc-unfair"],
      verified: true,
    },
    {
      id: "claim-capgains",
      text:
        "정부는 2025년 9월 15일 주식 양도소득세 과세 대상 대주주 기준을 현행 종목당 50억 원으로 " +
        "유지한다고 밝혔다. 7월 세제개편안 발표 이후 이어진 논의 끝에 나온 결정이다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-capgains"],
      verified: true,
    },
    {
      id: "claim-transactiontax",
      text:
        "2025년 7월 31일 발표된 2025년 세제개편안에 증권거래세율 환원이 포함되었다.",
      assertionType: "FACT",
      sourceIds: ["src-moef-tax-2025"],
      verified: true,
    },
    {
      id: "claim-delisting",
      text:
        "2026년 2월 12일 금융위원회와 한국거래소가 「부실기업 신속·엄정 퇴출을 위한 상장폐지 개혁 방안」을 " +
        "발표했다. 2026년 2월부터 2027년 6월까지 상장폐지 집중관리기간을 운영하고, " +
        "시가총액 기준을 2026년 7월 150억 원에서 200억 원으로, 2027년 1월 300억 원으로 강화한다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-delisting"],
      verified: true,
    },
    {
      id: "claim-reform",
      text:
        "2026년 3월 18일 금융위원회가 신뢰·주주보호·혁신·시장접근성 제고의 4대 정책방향을 담은 " +
        "자본시장 체질개선 방안을 발표했다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-reform"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-krx-index",
      title: "주가지수·시가총액 통계 — KRX 정보데이터시스템",
      url: "https://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC03010202",
      publisher: "한국거래소",
      type: "statistics",
      // 조회 화면이라 특정 시점을 고정 인용할 수 없다. 숫자의 출처는 여기이고,
      // 날짜별 확인은 아래 보도자료로 대조한다.
      license: "link-only",
    },
    {
      id: "src-kospi-3000",
      title: "코스피, 3000선 돌파…3년 6개월만",
      url: "https://www.seoul.co.kr/news/economy/securities/2025/06/20/20250620800005",
      publisher: "서울신문",
      publishedAt: "2025-06-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kospi-9000",
      title: "코스피 '9000' 시대 개막…종가 9063.84 마감",
      url: "https://www.asiae.co.kr/article/2026061816204217852",
      publisher: "아시아경제",
      publishedAt: "2026-06-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kospi-5663",
      title: "[속보] 코스피 5.9%↓ 5663 마감…'6000피' 밑으로",
      url: "https://www.kmib.co.kr/article/view.asp?arcid=9000000244&code=61141211&sid1=eco",
      publisher: "국민일보",
      publishedAt: "2026-07-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-marketcap-2025",
      title: "올해 76% 뛴 코스피, G20·OECD 1위…시총 첫 3000조 돌파",
      url: "https://www.hankyung.com/article/2025123033346",
      publisher: "한국경제",
      publishedAt: "2025-12-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-law-commercial",
      title: "상법 — 전체 제정·개정이유 (법률 제20991호·제21448호)",
      url: "https://www.law.go.kr/LSW/lsRvsRsnListP.do?lsId=001702&chrClsCd=010202&lsRvsGubun=all",
      publisher: "법제처 국가법령정보센터",
      type: "legislative",
      license: "public",
      quote:
        "이사는 그 직무를 수행함에 있어 회사뿐만 아니라 총주주의 이익을 보호하고 전체 주주의 이익을 공평하게 대우하도록 (…) " +
        "회사가 자기주식을 취득한 경우 1년 이내에 소각할 의무를 부과하고, 임직원 보상 등의 경우 주주총회의 승인에 따라 " +
        "자기주식의 예외적인 보유 또는 처분을 허용",
    },
    {
      id: "src-fsc-sanction",
      title: "불법공매도 제재수단이 도입됩니다 — 「자본시장과 금융투자업에 관한 법률」 하위규정 개정",
      url: "https://www.fsc.go.kr/po010101/84365",
      publisher: "금융위원회",
      type: "official",
      license: "public",
      quote:
        "불공정거래·불법공매도 행위를 한 자의 상장사등 임원으로서의 선임·재임을 위반행위의 내용·정도, 기간·횟수, " +
        "취득한 이익 규모를 고려하여 최대 5년의 범위에서 제한할 수 있도록 규정",
    },
    {
      id: "src-fsc-unfair",
      title: "불공정거래를 신속적발, 엄정제재하여 주가조작의 유인을 근본적으로 차단하겠습니다",
      url: "https://www.fsc.go.kr/no010101/84892",
      publisher: "금융위원회·금융감독원·한국거래소",
      publishedAt: "2025-07-09",
      type: "official",
      license: "public",
      quote: "과징금(최대 부당이득의 2배)",
    },
    {
      id: "src-fsc-mto",
      title: "신주우선배정 및 의무공개매수 제도와 관련한 정부입장 설명",
      url: "https://fsc.go.kr/no010102/86503",
      publisher: "금융위원회",
      type: "official",
      license: "public",
      quote:
        "경영권 지분을 포함하여 총 50%+1주 이상을 매수하도록 의무를 부과",
    },
    {
      id: "src-moef-tax-2025",
      title: "2025년 세제개편안 발표",
      url: "https://mofe.go.kr/nw/nes/detailNesDtaView.do?menuNo=4010100&searchNttId1=MOSF_000000000074687",
      publisher: "기획재정부",
      publishedAt: "2025-07-31",
      type: "official",
      // 본문은 첨부 PDF에 있다. 페이지 자체에는 인용할 문장이 없다.
      license: "link-only",
    },
    {
      id: "src-korea-capgains",
      title: "주식 양도세 대주주 기준, 현행 '종목당 50억 원 이상' 유지",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148949309",
      publisher: "기획재정부 (대한민국 정책브리핑)",
      publishedAt: "2025-09-15",
      type: "official",
      license: "public",
      quote: "주식 양도세 대주주 기준, 현행 '종목당 50억 원 이상' 유지",
    },
    {
      id: "src-fsc-delisting",
      title: "부실기업 신속·엄정 퇴출을 위한 상장폐지 개혁 방안",
      url: "https://www.fsc.go.kr/no010101/86273",
      publisher: "금융위원회·한국거래소",
      publishedAt: "2026-02-12",
      type: "official",
      license: "public",
      quote:
        "'26.2월~'27.6월 상장폐지 집중관리기간 운영 (…) 시가총액 기준을 '26.7월 150억원 → 200억원, " +
        "'27.1월 200억원 → 300억원으로 강화",
    },
    {
      id: "src-fsc-reform",
      title: "위기에 강한, 국민이 믿는 자본시장 — 자본시장 체질개선을 일관되게 추진합니다",
      url: "https://fsc.go.kr/no010101/86493",
      publisher: "금융위원회",
      publishedAt: "2026-03-18",
      type: "official",
      license: "public",
      quote: "신뢰, 주주보호, 혁신, 시장접근성 제고의 4대 정책방향",
    },
  ],
};

export const stockMarket = achievementSchema.parse(raw);
