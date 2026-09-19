import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * KTX·SRT 통합 — 둘로 나뉘어 있던 고속철도를 하나로.
 *
 * 인포그래픽의 'KTX·SRT 통합' 항목이다. 이 시기 업적 가운데 드물게 **이미
 * 끝난 일**이다. 2026년 8월 31일 기관통합 절차가 끝났고 9월 1일부터 통합
 * 운행이 시작됐다. 기준일인 2026년 9월 19일에는 이미 열여드레째 운행 중이다.
 *
 * ★ 이 업적은 결과를 숫자로 말할 수 있다.
 *   검찰개혁과 사법개혁은 "정해졌다"까지였지만 여기는 운임이 실제로 내렸고
 *   좌석이 실제로 늘었다. 그래서 모션도 계획이 아니라 실제 값을 그린다.
 *
 * ★ 다만 '통합했다'와 '그래서 좋아졌다'는 다른 말이다.
 *   운임 인하와 좌석 증가는 통합과 함께 발표된 수치다. 통합 이후의 이용객
 *   변화나 서비스 만족도, 재무 영향은 아직 확인하지 못했다. 열여드레밖에
 *   지나지 않았다.
 *
 * ★ 반대 자료를 아직 찾지 못했다.
 *   SR을 따로 세운 취지가 경쟁이었으므로 통합에 대한 문제 제기가 있었을
 *   가능성이 높지만, 이 위키가 확인한 보도에는 그 내용이 없었다. 없는 것을
 *   지어내지 않고, 찾지 못했다는 사실을 sourceNote에 적는다.
 */

const raw: AchievementInput = {
  id: "rail-merger",
  slug: "rail-merger",
  title: "KTX·SRT 통합",
  subtitle: "같은 선로를 달리던 두 열차가 한 회사가 됐다",
  kicker: "주요 정책",
  summary:
    "코레일과 에스알로 나뉘어 있던 고속철도 운영을 하나로 합친 일이다. " +
    "2026년 8월 31일 기관통합에 필요한 법정·행정 절차가 끝났고 9월 1일부터 " +
    "통합 운행이 시작됐다. 운임은 SRT 수준으로 맞춰 평균 10% 내렸고, " +
    "고속철도 좌석은 하루 평균 1만 6천 석이 늘었다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "통합 시점과 운임·좌석 수치는 통합 직전과 직후의 보도로 확인했습니다. " +
    "국토교통부 보도자료 원문으로 대조하는 일은 아직 남아 있습니다. 이 업적은 " +
    "2026년 9월 19일 기준이며, 통합 운행이 시작된 지 열여드레째입니다. " +
    "이용객 변화와 재무 영향은 아직 확인하지 못했습니다. 통합에 대한 반대나 " +
    "우려를 다룬 자료도 아직 찾지 못했습니다 — 없어서가 아니라 확인하지 " +
    "못해서입니다.",

  headlineKeyNumberId: "kn-fare",

  scenes: [
    {
      id: "fare",
      kind: "quantity-track",
      heading: "서울에서 부산까지, 값이 내린 자리",
      lede:
        "통합과 함께 운임이 SRT 수준으로 맞춰졌습니다. 스크롤하면 그 변화를 지나갑니다.",
      claimIds: ["claim-fare"],
      track: {
        label: "서울~부산 KTX 운임",
        unit: "원",
        direction: "down",
        max: 59800,
        note:
          "인하 폭은 구간마다 다르고 평균 10%다. 이 씬은 서울~부산 한 구간만 " +
          "그린다. 용산~광주송정은 46,800원에서 42,000원이 됐다.",
        checkpoints: [
          {
            id: "rm-before",
            displayDate: "2026년 8월까지",
            title: "59,800원",
            amount: 59800,
            caption:
              "같은 선로를 달리는데 KTX와 SRT의 운임이 달랐습니다. KTX가 더 비쌌습니다.",
            art: "rail-two",
            claimId: "claim-fare",
          },
          {
            id: "rm-after",
            displayDate: "2026년 9월 1일",
            title: "54,400원",
            amount: 54400,
            caption:
              "통합과 함께 운임을 SRT 수준으로 맞췄습니다. 구간에 따라 평균 10% 내렸습니다.",
            art: "rail-fare",
            claimId: "claim-fare",
          },
        ],
      },
    },
  ],

  shorts: [],

  eli5: {
    intro:
      "같은 철길을 달리는데 회사가 둘이었어요. 그래서 생긴 불편을 없앤 이야기예요.",
    scenes: [
      {
        id: "e-rm-two",
        title: "회사가 둘이었어요",
        say: "고속열차를 코레일과 에스알 두 회사가 따로 운영했어요. KTX와 SRT예요. 같은 철길을 달리는데도요.",
        art: "rail-two",
        fact: { value: "두 회사", tone: "warm" },
        claimIds: ["claim-merge"],
      },
      {
        id: "e-rm-app",
        title: "표를 따로 찾아봐야 했어요",
        say: "앱도 따로였어요. 이쪽에서 자리가 없으면 저쪽 앱을 다시 열어 봐야 했죠. 이제는 '코레일+' 하나에서 다 봐요.",
        art: "rail-oneapp",
        fact: { value: "코레일+", tone: "ice" },
        claimIds: ["claim-app"],
      },
      {
        id: "e-rm-merge",
        title: "두 회사가 하나가 됐어요",
        say: "2026년 8월 31일에 합치는 절차가 끝났고, 9월 1일부터 하나로 운행해요. SRT 열차는 이름도 'KTX-산천'으로 바뀌었어요.",
        art: "rail-merge",
        fact: { value: "9월 1일", tone: "ice" },
        claimIds: ["claim-merge"],
      },
      {
        id: "e-rm-fare",
        title: "값이 내렸어요",
        say: "둘 중 싼 쪽에 맞췄어요. 서울에서 부산까지 59,800원이던 게 54,400원이 됐어요. 평균 10%쯤 내린 거예요.",
        art: "rail-fare",
        fact: { value: "평균 10%", tone: "ice" },
        claimIds: ["claim-fare"],
      },
      {
        id: "e-rm-seats",
        title: "자리도 늘었어요",
        say: "하루에 1만 6천 자리가 더 생겼어요. 특히 수서역에서 탈 수 있는 열차가 30%쯤 늘었어요.",
        art: "rail-seats",
        fact: { value: "1만 6천 석", tone: "ice" },
        claimIds: ["claim-seats"],
      },
    ],
    caveat: {
      text:
        "통합한 지 얼마 되지 않았어요. 값이 내리고 자리가 늘었다는 건 발표된 수치이고, 실제로 타는 사람이 얼마나 편해졌는지는 아직 확인하지 못했어요.",
      claimIds: ["claim-fare", "claim-seats"],
    },
  },

  keyNumbers: [
    {
      id: "kn-fare",
      label: "운임 인하",
      prefix: "평균",
      value: "10",
      unit: "%",
      caption: "SRT 수준으로 · 서울~부산 59,800 → 54,400원",
      claimId: "claim-fare",
    },
    {
      id: "kn-seats",
      label: "하루 늘어난 좌석",
      prefix: "약",
      value: "1만 6,000",
      unit: "석",
      caption: "주간 11만 6,000석 · 수서역 기준 약 30% 증가",
      claimId: "claim-seats",
    },
    {
      id: "kn-runs",
      label: "주중 운행 횟수",
      value: "379 → 402",
      unit: "회",
      caption: "주말은 431 → 457회",
      claimId: "claim-seats",
    },
  ],

  timeline: [
    {
      id: "rm-app",
      date: "2026-08-03",
      displayDate: "2026년 8월 3일",
      datePrecision: "day",
      title: "통합 예매 앱 ‘코레일+’ 개시",
      summary:
        "따로 쓰던 코레일톡과 SRT 앱을 합쳐 KTX와 SRT를 한 곳에서 조회·예매할 수 있게 했다.",
      claimIds: ["claim-app"],
    },
    {
      id: "rm-done",
      date: "2026-08-31",
      displayDate: "2026년 8월 31일",
      datePrecision: "day",
      title: "기관통합 절차 완료",
      summary:
        "국토교통부가 코레일과 에스알의 기관 통합에 필요한 법정·행정 절차를 모두 마쳤다고 밝혔다.",
      claimIds: ["claim-merge"],
    },
    {
      id: "rm-start",
      date: "2026-09-01",
      displayDate: "2026년 9월 1일",
      datePrecision: "day",
      title: "통합 운행 시작",
      summary:
        "KTX와 SRT가 하나로 운행되기 시작했다. 기존 SRT 차량은 ‘KTX-산천’으로 이름이 바뀌었고 운임은 평균 10% 내렸다.",
      claimIds: ["claim-merge", "claim-fare", "claim-seats"],
    },
  ],

  graph: {
    note:
      "둘로 나뉘어 있던 것이 하나가 되면서 무엇이 달라졌는지를 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "molit", name: "국토교통부", kind: "government", isFocus: true,
        description: "통합 절차를 마무리한 주체" },
      { id: "korail", name: "코레일", kind: "company",
        description: "KTX를 운영하던 쪽. 통합 후 존속 법인" },
      { id: "sr", name: "에스알(SR)", kind: "company",
        description: "SRT를 운영하던 쪽. 통합으로 합쳐졌다" },
      { id: "line", name: "고속철도 선로", kind: "project",
        description: "두 회사가 같이 쓰던 선로" },
      { id: "riders", name: "이용객", kind: "group",
        description: "운임이 내리고 좌석이 늘어난 쪽" },
      { id: "suseo", name: "수서역", kind: "project",
        description: "좌석이 약 30% 늘어난 곳" },
    ],
    relations: [
      {
        id: "rm-r-split",
        fromId: "sr",
        toId: "line",
        label: "같은 선로를 코레일과 나눠 쓰며 SRT를 따로 운영했다.",
        startDate: "2026-08-03",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-merge"],
      },
      {
        id: "rm-r-app",
        fromId: "molit",
        toId: "riders",
        label: "예매 앱을 ‘코레일+’ 하나로 합쳤다.",
        startDate: "2026-08-03",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-app"],
      },
      {
        id: "rm-r-merge",
        fromId: "molit",
        toId: "korail",
        label: "기관 통합에 필요한 법정·행정 절차를 마쳤다.",
        startDate: "2026-08-31",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-merge"],
      },
      {
        id: "rm-r-fare",
        fromId: "korail",
        toId: "riders",
        label: "운임을 SRT 수준으로 맞춰 평균 10% 내렸다.",
        startDate: "2026-09-01",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-fare"],
      },
      {
        id: "rm-r-seats",
        fromId: "korail",
        toId: "suseo",
        label: "수서역에서 탈 수 있는 좌석이 약 30% 늘었다.",
        startDate: "2026-09-01",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-seats"],
      },
    ],
  },

  counterpoints: [
    {
      id: "rm-cp-compete",
      question: "경쟁을 없앤 것 아닌가?",
      response:
        "에스알은 고속철도에 경쟁을 들이려고 따로 세운 회사였으므로, 통합은 그 구조를 되돌린 것이다. 다만 두 회사는 같은 선로를 나눠 쓰고 있었고 요금과 예매가 갈려 있었다. 통합 직후 발표된 결과는 운임이 낮은 쪽으로 맞춰졌다는 것이다. 경쟁이 사라진 뒤에도 그 수준이 유지되는지는 시간이 지나야 알 수 있고, 이 위키는 아직 그 자료를 갖고 있지 않다.",
      claimIds: ["claim-merge", "claim-fare"],
    },
    {
      id: "rm-cp-effect",
      question: "정말 편해졌나?",
      response:
        "발표된 수치로는 운임이 평균 10% 내렸고 하루 좌석이 약 1만 6천 석 늘었으며 주중 운행이 379회에서 402회가 됐다. 다만 통합 운행이 시작된 지 이 문서 기준으로 열여드레다. 이용객이 실제로 어떻게 달라졌는지, 정시성이나 혼잡도가 어떤지는 아직 확인할 자료가 없다.",
      claimIds: ["claim-fare", "claim-seats"],
    },
  ],

  claims: [
    {
      id: "claim-merge",
      text:
        "국토교통부는 코레일과 에스알의 기관 통합에 필요한 법정·행정 절차를 2026년 8월 31일까지 모두 마치고, 9월 1일부터 KTX·SRT 통합 운행을 시작한다고 밝혔다. 기존 SRT 차량은 ‘KTX-산천’으로 명칭이 바뀌었다.",
      assertionType: "FACT",
      sourceIds: ["src-koreadaily-rm", "src-khan-rm"],
      verified: true,
    },
    {
      id: "claim-fare",
      text:
        "통합과 함께 고속철도 운임이 기존 SRT 수준으로 조정돼 구간에 따라 평균 10% 낮아졌다. 서울~부산은 5만 9,800원에서 5만 4,400원으로, 용산~광주송정은 4만 6,800원에서 4만 2,000원으로 내렸다. 수서역 출·도착 열차를 이용하면 결제액의 5%가 마일리지로 적립된다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-rm"],
      verified: true,
    },
    {
      id: "claim-seats",
      text:
        "통합으로 고속철도 좌석이 하루 평균 약 1만 6,000석(주간 11만 6,000석) 늘었고, 주중 운행은 379회에서 402회로, 주말 운행은 431회에서 457회로 늘었다. 수서역 기준 좌석은 약 30% 증가했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-rm", "src-koreadaily-rm"],
      verified: true,
    },
    {
      id: "claim-app",
      text:
        "따로 운영되던 예매 앱 코레일톡과 SRT 앱이 ‘코레일+’로 통합돼 2026년 8월 3일부터 KTX와 SRT를 한 곳에서 조회·예매할 수 있게 됐다. 기존 코레일 회원은 자동 전환됐다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-rm"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-khan-rm",
      title: "9월부터 KTX·SRT 통합 운영…운임 평균 10% 인하",
      url: "https://www.khan.co.kr/article/202608061131001",
      publisher: "경향신문",
      publishedAt: "2026-08-06",
      type: "press",
      license: "quotable",
      quote:
        "서울~부산은 5만 9,800원에서 5만 4,400원으로, 용산~광주송정은 4만 6,800원에서 " +
        "4만 2,000원으로 내린다. 하루 평균 1만 6,000석이 추가 공급되고 주중 운행은 " +
        "379회에서 402회로 늘어난다. 통합 앱 ‘코레일+’는 8월 3일 개시됐다.",
    },
    {
      id: "src-koreadaily-rm",
      title: "코레일·SR 통합 완료…9월 1일부터 KTX·SRT 통합 운행",
      url: "https://www.koreadaily.com/article/20260830225033104",
      publisher: "미주중앙일보",
      publishedAt: "2026-08-30",
      type: "press",
      license: "quotable",
      quote:
        "국토교통부는 코레일과 SR의 기관 통합에 필요한 법정·행정 절차를 모두 마치고 " +
        "9월 1일부터 KTX·SRT 통합 운행을 시작한다고 밝혔다. " +
        "통합의 출발부터 안전을 최우선으로 현장을 세심하게 점검하겠다(김윤덕 국토교통부 장관)",
    },
  ],
};

export const railMerger = achievementSchema.parse(raw);
