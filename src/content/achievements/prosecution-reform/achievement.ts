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
  categories: ["institution"],
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
      id: "explain",
      kind: "explainer",
      heading: "한 기관이 쥐던 두 일",
      lede:
        "구조·권한·시점·준비는 서로 다른 이야기입니다. 막대 하나로 넷을 말할 수 " +
        "없어 한 장씩 그렸습니다. 셋째 장에서는 손잡이를 끌어 시점을 직접 옮겨 " +
        "볼 수 있습니다 — 기준일을 넘기면 화면이 그렇게 밝힙니다.",
      claimIds: ["claim-law", "claim-agencies", "claim-staffing"],
      explainer: {
        note:
          "이 업적의 기준일은 2026년 9월 19일이고 시행일은 10월 2일입니다. " +
          "그림은 정해진 것까지만 그리고, 그 뒤는 예정으로 적습니다. " +
          "시행 뒤에 실제로 무엇이 달라졌는지는 그날이 지나야 적을 수 있습니다.",
        chapters: [
          {
            id: "split",
            question: "한 기관이 쥐던 두 일이 어디로 가나?",
            heading: "갈라지는 몸",
            claimId: "claim-law",
            takeaway:
              "하나가 둘이 되는 것이 아닙니다. 하나가 없어지고 둘이 생기는 것입니다.",
            steps: [
              {
                id: "sp-one",
                label: "한 기관",
                caption:
                  "검찰청이 수사와 기소를 함께 맡아 왔습니다. 죄를 찾아내는 일과 재판에 넘기는 일입니다.",
              },
              {
                id: "sp-loop",
                label: "이어진 구조",
                caption:
                  "찾아내는 일과 재판에 넘기는 일이 한 기관 안에서 이어집니다. 이 구조를 바꾸자는 것이 이 개혁입니다.",
              },
              {
                id: "sp-split",
                label: "법이 정한 갈림",
                caption:
                  "2026년 3월 국회가 중대범죄수사청법과 공소청법을 통과시켰습니다. 수사는 중수청으로, 기소는 공소청으로 갑니다.",
                readout: { value: "2026년 3월", note: "국회 본회의 통과" },
              },
              {
                id: "sp-end",
                label: "검찰청 폐지",
                caption:
                  "시행일에 검찰청은 폐지됩니다. 두 일이 옮겨 가고 원래 기관은 남지 않습니다.",
                readout: { value: "2026. 10. 2.", note: "시행 예정일" },
              },
            ],
            visual: {
              kind: "split-powers",
              origin: { label: "검찰청", endLabel: "시행일에 폐지" },
              loopLabel: "한 기관 안에서 이어진다",
              whenLabel: "2026년 10월 2일 시행",
              branches: [
                {
                  id: "b-inv",
                  label: "중대범죄수사청",
                  power: "수사",
                  note: "행정안전부 산하",
                },
                { id: "b-ind", label: "공소청", power: "기소" },
              ],
            },
          },
          {
            id: "powers",
            question: "그러면 검사에게는 무엇이 남나?",
            heading: "권한이 가는 곳",
            claimId: "claim-agencies",
            takeaway:
              "검사는 수사를 시작할 수 없게 되고, 재판에 넘기고 그 재판을 끌고 가는 일만 맡습니다.",
            steps: [
              {
                id: "pw-all",
                label: "쥐던 네 가지",
                caption: "수사 개시, 영장 청구, 기소, 공소유지입니다.",
              },
              {
                id: "pw-inv",
                label: "수사는 중수청으로",
                caption:
                  "권력형 부패범죄와 대규모 경제범죄 등의 수사는 신설되는 중대범죄수사청이 맡습니다.",
              },
              {
                id: "pw-ind",
                label: "나머지는 공소청으로",
                caption: "영장 청구와 기소, 공소유지는 공소청이 맡습니다.",
              },
              {
                id: "pw-actor",
                label: "잃는 것과 남는 것",
                caption:
                  "검사는 수사개시권을 완전히 잃고, 영장 청구·기소·공소유지 업무만 맡게 됩니다.",
                readout: {
                  value: "수사개시권",
                  note: "검사가 잃는 권한 · 현행 검사 정원은 2,292명",
                },
              },
            ],
            visual: {
              kind: "powers-ledger",
              fromLabel: "검찰청이 쥐던 것",
              actor: "검사",
              lostPowerId: "p-open",
              lostLabel: "수사개시권을 잃는다",
              keptLabel: "영장 청구·기소·공소유지를 맡는다",
              holders: [
                { id: "h-inv", label: "중대범죄수사청", note: "행정안전부 산하" },
                { id: "h-ind", label: "공소청", note: "검사가 일하는 곳" },
              ],
              powers: [
                { id: "p-open", label: "수사 개시", holderId: "h-inv" },
                { id: "p-warrant", label: "영장 청구", holderId: "h-ind" },
                { id: "p-indict", label: "기소", holderId: "h-ind" },
                { id: "p-keep", label: "공소유지", holderId: "h-ind" },
              ],
            },
          },
          {
            id: "when",
            question: "그래서 검찰청은 없어졌나?",
            heading: "아직 오지 않은 날",
            claimId: "claim-law",
            takeaway:
              "법으로 정해졌을 뿐입니다. 기준일인 2026년 9월 19일까지 달라진 것은 없습니다.",
            steps: [
              {
                id: "wh-pass",
                label: "2026년 3월",
                caption:
                  "국회 본회의가 중대범죄수사청법과 공소청법을 통과시켰습니다. 검찰청 폐지가 정해졌습니다.",
              },
              {
                id: "wh-asof",
                label: "2026년 9월 19일",
                caption:
                  "이 위키가 대조한 마지막 날입니다. 여기까지가 “정해졌다”이고, 그 뒤는 “이렇게 하기로 했다”입니다.",
              },
              {
                id: "wh-start",
                label: "2026년 10월 2일",
                caption:
                  "중수청과 공소청이 출범하고 검찰청이 폐지될 예정입니다. 아직 오지 않은 날이라 무엇이 달라졌는지는 적을 수 없습니다.",
                readout: {
                  value: "2026. 10. 2.",
                  note: "시행 예정 · 기준일은 2026년 9월 19일",
                },
              },
            ],
            visual: {
              kind: "timeline-gate",
              start: "2026-02",
              end: "2026-11",
              spanLabel: "통과에서 시행까지 약 일곱 달",
              futureLabel: "기준일 뒤는 예정입니다",
              marks: [
                {
                  id: "m-pass",
                  date: "2026-03",
                  displayDate: "2026년 3월",
                  label: "중수청법·공소청법이 국회 본회의를 통과했습니다.",
                  status: "done",
                },
                {
                  id: "m-asof",
                  date: "2026-09-19",
                  displayDate: "2026년 9월 19일",
                  label: "이 위키가 대조한 마지막 날입니다.",
                  status: "asof",
                },
                {
                  id: "m-start",
                  date: "2026-10-02",
                  displayDate: "2026년 10월 2일",
                  label: "중수청·공소청 출범과 검찰청 폐지가 예정된 날입니다.",
                  status: "planned",
                },
              ],
            },
          },
          {
            id: "staffing",
            question: "새 기관은 사람을 채웠나?",
            heading: "자리와 사람",
            claimId: "claim-staffing",
            takeaway:
              "지원자 수가 곧 채용 결과는 아닙니다. 실제 충원은 시행 이후에야 확인할 수 있습니다.",
            steps: [
              {
                id: "se-capacity",
                label: "자리",
                caption: "중대범죄수사청 정원은 2,874명입니다.",
              },
              {
                id: "se-applied",
                label: "지원",
                caption:
                  "2026년 9월 16일 기준 1,761명이 지원했습니다. 정원의 61.3%입니다.",
                readout: { value: "61.3", unit: "%", note: "정원 2,874명 · 지원 1,761명" },
              },
              {
                id: "se-gap",
                label: "덜 찬 자리",
                caption:
                  "1,113자리가 남습니다. 수사력 공백 우려가 근거로 든 수가 이것입니다.",
              },
              {
                id: "se-ref",
                label: "견줄 수 있는 수",
                caption:
                  "현행 검사 정원은 2,292명입니다. 같은 눈금 위에 놓은 것일 뿐, 두 수가 같은 것을 세는지는 자료가 밝히지 않았습니다.",
                readout: { value: "2,292", unit: "명", note: "현행 검사 정원" },
              },
            ],
            visual: {
              kind: "seats",
              unit: "명",
              per: 50,
              capacity: { label: "중대범죄수사청 정원", value: 2874 },
              filled: { label: "지원", value: 1761 },
              gapLabel: "아직 채워지지 않음",
              reference: {
                label: "현행 검사 정원",
                value: 2292,
                note: "두 수를 같은 눈금 위에 놓았을 뿐입니다.",
              },
            },
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
