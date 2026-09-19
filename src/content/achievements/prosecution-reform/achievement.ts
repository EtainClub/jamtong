import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 검찰개혁 — 수사와 기소를 나눈다.
 *
 * 대통령 시기의 첫 업적이다. 앞선 업적들과 성격이 다른 점이 둘 있다.
 *
 * ★ 아직 시행되지 않았다.
 *   중수청법과 공소청법은 2026년 3월 국회를 지났고 시행일은 2026년 10월 2일이다.
 *   이 문서를 쓰는 2026년 9월 19일 기준으로 아직 열흘 넘게 남았다. 그래서
 *   "검찰청이 폐지됐다"가 아니라 "폐지하기로 법이 정해졌고 언제 시행된다"로 적는다.
 *   시행 뒤에 이 파일을 다시 열어 실제로 무엇이 달라졌는지 더해야 한다.
 *
 * ★ 진행 중인 시기다.
 *   성남시장과 경기도지사 시기는 끝난 일이라 결말까지 적을 수 있었다. 여기는
 *   아니다. 일산대교처럼 뒤에 뒤집히는 일이 생길 수 있으므로 기준일을 밝힌다.
 *
 * ★ 법은 국회가 만든다.
 *   대통령의 단독 성과로 적지 않는다. 무상급식을 세 시정에 나눠 적은 것과 같다.
 *
 * ★ 반대를 싣는다.
 *   수사력 공백 우려와 준비 부족 지적이 컸다. 중수청 지원자가 정원의 61.3%에
 *   그친 것도 그대로 적는다. 감추면 공격거리가 되고, 적으면 근거가 된다.
 */

const raw: AchievementInput = {
  id: "prosecution-reform",
  slug: "prosecution-reform",
  title: "검찰개혁",
  subtitle: "한 기관이 쥐던 수사와 기소를 둘로 나눈다",
  kicker: "주요 정책",
  featured: true,
  summary:
    "수사와 기소를 한 기관이 함께 쥐던 구조를 바꾸는 일이다. 2026년 3월 국회가 " +
    "중대범죄수사청법과 공소청법을 통과시켰고, 2026년 10월 2일 시행된다. " +
    "검찰청은 폐지되고 수사는 행정안전부 산하 중수청이, 기소와 공소유지는 " +
    "공소청이 맡는다. 검사는 수사개시권을 잃고 영장 청구와 기소, 공소유지만 맡는다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "법 통과와 시행일, 조직 규모는 보도로 확인했습니다. 법률 원문과 정부조직법 " +
    "개정안으로 대조하는 일은 아직 남아 있습니다. 이 업적은 2026년 9월 19일 " +
    "기준입니다. 시행일인 10월 2일이 지나면 실제로 무엇이 달라졌는지 다시 " +
    "확인해야 합니다. 지금 적을 수 있는 것은 무엇이 정해졌는지까지입니다.",

  headlineKeyNumberId: "kn-when",

  scenes: [
    {
      id: "staffing",
      kind: "composition",
      heading: "출범을 앞둔 중수청의 인력",
      lede:
        "새 기관이 사람을 채웠는지가 이 개혁의 첫 시험대입니다. 2026년 9월 16일 기준입니다.",
      claimIds: ["claim-staffing"],
      composition: {
        total: 2874,
        unit: "명",
        totalLabel: "중대범죄수사청 정원",
        claimId: "claim-staffing",
        note:
          "지원자가 정원에 미치지 못한다는 사실은 수사력 공백 우려의 근거로 쓰였다. " +
          "다만 지원자 수가 곧 채용 결과는 아니며, 시행 이후의 실제 충원은 " +
          "확인하지 못했다.",
        groups: [
          {
            id: "st-applied",
            label: "지원",
            amount: 1761,
            sharePercent: 61.3,
            tone: "primary",
          },
          {
            id: "st-open",
            label: "아직 채워지지 않음",
            amount: 1113,
            sharePercent: 38.7,
            tone: "accent",
          },
        ],
      },
    },
  ],

  shorts: [],

  eli5: {
    intro:
      "죄를 밝히는 일과 재판에 넘기는 일을 한 곳이 다 했어요. 그걸 둘로 나누는 이야기예요.",
    scenes: [
      {
        id: "e-pr-one",
        title: "한 곳이 둘 다 했어요",
        say: "누가 죄를 지었는지 찾아내는 일(수사)과, 그 사람을 재판에 넘기는 일(기소)을 검찰이 함께 했어요.",
        art: "pr-onehand",
        fact: { value: "수사 + 기소", tone: "warm" },
        claimIds: ["claim-law"],
      },
      {
        id: "e-pr-why",
        title: "왜 나누자고 했을까요",
        say: "찾아낸 사람이 직접 재판에 넘기면, 스스로 한 일을 스스로 점검하는 셈이에요. 서로 다른 곳이 맡으면 한쪽이 다른 쪽을 볼 수 있어요.",
        art: "pr-split",
        fact: { value: "나누기", tone: "ice" },
        claimIds: ["claim-law"],
      },
      {
        id: "e-pr-law",
        title: "2026년 3월, 법이 만들어졌어요",
        say: "국회가 법을 두 개 통과시켰어요. 하나는 수사를 맡을 곳을 만드는 법, 다른 하나는 기소를 맡을 곳을 만드는 법이에요.",
        art: "pr-law",
        fact: { value: "2026년 3월", tone: "ice" },
        claimIds: ["claim-law"],
      },
      {
        id: "e-pr-two",
        title: "두 곳으로 갈라져요",
        say: "수사는 중대범죄수사청이, 재판에 넘기는 일은 공소청이 해요. 검찰청이라는 이름은 사라져요.",
        art: "pr-newoffice",
        fact: { value: "중수청 · 공소청", tone: "ice" },
        claimIds: ["claim-law", "claim-agencies"],
      },
      {
        id: "e-pr-people",
        title: "그런데 사람이 덜 모였어요",
        say: "새로 만드는 중수청에 2,874자리가 필요한데 1,761명이 지원했어요. 열에 여섯쯤이에요. 그래서 걱정하는 사람도 많아요.",
        art: "pr-staffing",
        fact: { value: "61.3%", tone: "warm" },
        claimIds: ["claim-staffing"],
      },
      {
        id: "e-pr-notyet",
        title: "아직 시작 전이에요",
        say: "법은 정해졌지만 실제로 바뀌는 날은 2026년 10월 2일이에요. 그러니까 지금은 '이렇게 하기로 했다'까지예요.",
        art: "pr-notyet",
        fact: { value: "10월 2일", tone: "warm" },
        claimIds: ["claim-law"],
      },
    ],
    caveat: {
      text:
        "아직 시행되지 않았어요. 실제로 어떻게 달라지는지는 10월 2일이 지나 봐야 알 수 있어요. 여기에는 무엇이 정해졌는지까지만 적었어요.",
      claimIds: ["claim-law"],
    },
  },

  keyNumbers: [
    {
      id: "kn-when",
      label: "시행일",
      value: "2026. 10. 2.",
      caption: "2026년 3월 국회 통과 · 기준일 2026년 9월 19일",
      claimId: "claim-law",
    },
    {
      id: "kn-staff",
      label: "중수청 지원율",
      value: "61.3",
      unit: "%",
      caption: "정원 2,874명 · 지원 1,761명",
      claimId: "claim-staffing",
    },
    {
      id: "kn-prosecutors",
      label: "현행 검사 정원",
      value: "2,292",
      unit: "명",
      caption: "수사개시권을 잃고 기소·공소유지를 맡는다",
      claimId: "claim-staffing",
    },
  ],

  timeline: [
    {
      id: "pr-pass",
      date: "2026-03",
      displayDate: "2026년 3월",
      datePrecision: "month",
      title: "중수청법·공소청법 국회 통과",
      summary:
        "수사와 기소를 분리하는 두 법이 국회 본회의를 통과했다. 검찰청 폐지가 정해졌다.",
      claimIds: ["claim-law"],
    },
    {
      id: "pr-prep",
      date: "2026-09-16",
      displayDate: "2026년 9월 16일",
      datePrecision: "day",
      title: "출범 준비 현황 공개",
      summary:
        "중수청 정원 2,874명에 1,761명(61.3%)이 지원한 것으로 알려졌다. 현행 검사 정원은 2,292명이다.",
      claimIds: ["claim-staffing"],
    },
    {
      id: "pr-start",
      date: "2026-10-02",
      displayDate: "2026년 10월 2일",
      datePrecision: "day",
      title: "시행 예정",
      summary:
        "행정안전부 산하 중대범죄수사청과 공소청이 출범하고 검찰청이 폐지된다. 이 위키의 기준일(9월 19일) 기준으로 아직 시행 전이다.",
      claimIds: ["claim-law", "claim-agencies"],
    },
  ],

  graph: {
    note:
      "한 기관이 쥐던 두 일이 어디로 갈라지는지를 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "assembly", name: "국회", kind: "government", isFocus: true,
        description: "중수청법·공소청법을 통과시킨 곳" },
      { id: "prosecution", name: "검찰청", kind: "government",
        description: "수사와 기소를 함께 맡아 온 기관. 시행일에 폐지된다" },
      { id: "investigation", name: "중대범죄수사청", kind: "government",
        description: "행정안전부 산하. 권력형 부패·대규모 경제범죄 수사" },
      { id: "indictment", name: "공소청", kind: "government",
        description: "영장 청구와 기소, 공소유지를 맡는다" },
      { id: "prosecutors", name: "검사", kind: "group",
        description: "수사개시권을 잃는다. 현행 정원 2,292명" },
      { id: "citizens", name: "국민", kind: "group",
        description: "형사사법 절차의 상대편" },
    ],
    relations: [
      {
        id: "pr-r-both",
        fromId: "prosecution",
        toId: "citizens",
        label: "수사와 기소를 한 기관이 함께 맡아 왔다.",
        startDate: "2026-03",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-law"],
      },
      {
        id: "pr-r-pass",
        fromId: "assembly",
        toId: "prosecution",
        label: "중수청법과 공소청법을 통과시켜 검찰청 폐지를 정했다.",
        startDate: "2026-03",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-law"],
      },
      {
        id: "pr-r-inv",
        fromId: "investigation",
        toId: "citizens",
        label: "시행일부터 권력형 부패범죄와 대규모 경제범죄 수사를 맡는다.",
        startDate: "2026-10-02",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-agencies"],
      },
      {
        id: "pr-r-ind",
        fromId: "indictment",
        toId: "citizens",
        label: "시행일부터 영장 청구와 기소, 공소유지를 맡는다.",
        startDate: "2026-10-02",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-agencies"],
      },
      {
        id: "pr-r-lose",
        fromId: "prosecutors",
        toId: "investigation",
        label: "검사는 수사개시권을 잃는다.",
        startDate: "2026-10-02",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-agencies"],
      },
    ],
  },

  counterpoints: [
    {
      id: "pr-cp-gap",
      question: "수사력에 공백이 생기지 않나?",
      response:
        "그 지적이 가장 크게 제기됐다. 2026년 9월 16일 기준으로 중수청 정원 2,874명에 지원자는 1,761명으로 61.3%였다. 새 기관이 사람을 다 채우지 못한 채 출범하면 진행 중인 수사가 흔들릴 수 있다는 것이다. 다만 지원자 수가 곧 채용 결과는 아니며, 실제 충원은 시행 이후에야 확인할 수 있다.",
      claimIds: ["claim-staffing"],
    },
    {
      id: "pr-cp-rush",
      question: "너무 서둘러 밀어붙인 것 아닌가?",
      response:
        "숙의가 부족했다는 비판이 있었다. 2026년 3월 통과에서 10월 시행까지 약 일곱 달이고, 그 사이에 78년 된 기관을 해체하고 두 기관을 새로 세워야 했다. 이 위키는 어느 쪽이 옳은지 판단하지 않는다. 언제 무엇이 정해졌고 준비가 어디까지 왔는지만 적는다.",
      claimIds: ["claim-law", "claim-staffing"],
    },
    {
      id: "pr-cp-done",
      question: "그래서 검찰청은 없어졌나?",
      response:
        "아직 아니다. 이 문서의 기준일은 2026년 9월 19일이고 시행일은 10월 2일이다. 법으로 정해졌을 뿐 그날이 오기 전까지는 달라진 것이 없다. 시행 뒤에 실제로 무엇이 달라졌는지는 다시 확인해 여기에 더해야 한다.",
      claimIds: ["claim-law"],
    },
  ],

  claims: [
    {
      id: "claim-law",
      text:
        "2026년 3월 국회 본회의는 중대범죄수사청법과 공소청법을 통과시켰다. 이에 따라 검찰청은 폐지되고 수사와 기소가 분리되며, 시행일은 2026년 10월 2일이다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-pr-2026", "src-khan-pr-2026"],
      verified: true,
    },
    {
      id: "claim-agencies",
      text:
        "시행일부터 행정안전부 산하에 중대범죄수사청이, 별도로 공소청이 설치된다. 중수청은 권력형 부패범죄와 대규모 경제범죄 등을 수사하고, 검사는 수사개시권을 잃고 영장 청구와 기소, 공소유지 업무를 맡는다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-pr-2026", "src-khan-pr-2026"],
      verified: true,
    },
    {
      id: "claim-staffing",
      text:
        "2026년 9월 16일 기준 중대범죄수사청 정원은 2,874명이고 지원자는 1,761명으로 정원의 61.3%였다. 현행 검사 정원은 2,292명이다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-pr-2026"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-seoul-pr-2026",
      title: "검찰청 해체 ‘D-16’…중수청·공소청 어디까지 준비됐나",
      url: "https://www.seoul.co.kr/news/plan/law-human-story/2026/09/16/20260916500056",
      publisher: "서울신문",
      publishedAt: "2026-09-16",
      type: "press",
      license: "quotable",
      quote:
        "다음 달 2일 중수청과 공소청이 출범한다. 중수청 정원은 2,874명이고 지원자는 " +
        "1,761명으로 정원의 61.3%다. 현행 검사 정원은 2,292명이다.",
    },
    {
      id: "src-khan-pr-2026",
      title: "검찰청 폐지·대법관 증원…이재명 정부 1년 ‘검찰·사법개혁’",
      url: "https://www.khan.co.kr/article/202605181748001/",
      publisher: "경향신문",
      publishedAt: "2026-05-18",
      type: "press",
      license: "quotable",
      quote:
        "공소청법이 시행되면 검사는 수사개시권을 완전히 잃고 영장 청구, 기소, " +
        "공소유지 업무만 맡게 된다. 검찰이 주로 수사해온 권력형 부패범죄와 " +
        "대규모 경제범죄 등은 신설되는 중대범죄수사청이 수사한다.",
    },
  ],
};

export const prosecutionReform = achievementSchema.parse(raw);
