import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 원유 수급 — 중동 한 곳에 기대던 구조를 넓히고, 전쟁 속에서 값을 붙든 일.
 *
 * 2026년 중동에서 전쟁이 벌어졌다. 호르무즈 해협과 홍해가 막히고 사우디 석유
 * 시설이 공격받았다. 원유의 70%를 중동에서 받아 오던 나라에게는 직접적인 일이다.
 *
 * ★ 이 업적의 중심은 **중동 의존도 곡선**이다.
 *   2024년 71.5% → 2025년 69.1% → 2026년 1~5월 62.8%. 세 시점 모두 문서로
 *   확인된 값이고, 방향이 또렷하다. 목표는 50% 아래다.
 *
 * ★ 대통령의 "50%대" 발언은 수치로 싣지 않는다.
 *   2026년 9월 12일 이 대통령은 "70%에 이르던 원유 중동 의존도를 50%대로
 *   낮췄다"고 밝혔다. 그러나 이 위키가 확인한 정부 발표 수치는 1~5월 62.8%까지다.
 *   6월 이후 값이 50%대로 내려갔을 수 있지만 확인하지 못했다. 그래서 대통령
 *   발언은 CLAIM으로 싣고 추이 그래프에는 넣지 않는다. **자료가 있는 시점만
 *   주장한다**는 것이 이 씬의 규칙이다.
 *
 * ★ "기름값이 안정됐다"는 말을 그대로 쓰지 않는다.
 *   2026년 4월 휘발유는 리터당 2,000원을 넘었다. 그 뒤 17주 연속 내려 9월 둘째
 *   주에 1,859.1원이 됐다. 같은 주 두바이유는 배럴당 114.7달러로 한 주 만에
 *   14.4달러 올랐다. 국제 유가가 오르는 동안 국내 값이 내린 것은 사실이지만,
 *   1,859원은 낮은 값이 아니다. 오른 것도 내린 것도 함께 적는다.
 *
 * ★ 이것은 외교만의 일이 아니다.
 *   수입처 다변화와 원유 특사는 외교이지만, 최고가격제는 국내 가격 규제이고
 *   비축유 스와프는 수급 행정이다. 셋을 한 업적에 묶되 각각이 무엇인지 나눠 적는다.
 *
 * ★ 인과를 단정하지 않는다.
 *   국내 유가가 내린 것을 전부 정부 대책의 결과라고 말하지 않는다. 환율·정제
 *   마진·수요 등 다른 요인을 가려낼 자료가 이 위키에 없다.
 */

const raw: AchievementInput = {
  id: "oil-supply",
  slug: "oil-supply",
  title: "원유 수입처 다변화",
  subtitle: "중동에서 전쟁이 나는 동안, 기대는 곳을 옮겼다",
  kicker: "외교·경제",
  summary:
    "2026년 중동 무력 충돌로 호르무즈 해협과 홍해가 위태로워지는 사이, 정부는 " +
    "원유 수입처를 미국·호주·알제리·남미 등으로 넓혔다. 중동산 비중은 2024년 " +
    "71.5%에서 2026년 1~5월 62.8%로 내려왔고 목표는 50% 아래다. 비중동 원유의 " +
    "운임 차액을 전액 지원하고 비축유 스와프를 가동했으며, 국내에는 30여 년 만에 " +
    "석유 최고가격제를 시행했다.",
  type: "policy",
  publishStatus: "published",
  featured: true,
  sourceNote:
    "중동산 비중 수치는 산업통상부 발표와 국회 입법조사처 분석에서 확인했습니다. " +
    "2026년 6월 이후 비중은 확인하지 못했습니다 — 이 대통령이 9월 12일 “50%대로 " +
    "낮췄다”고 밝혔으나 이 위키가 대조한 정부 수치는 1~5월 62.8%까지입니다. " +
    "그 발언은 주장으로 싣고 추이 그래프에는 넣지 않았습니다. 국내 유가가 내린 " +
    "것이 정부 대책 때문인지는 단정하지 않습니다 — 환율·정제마진·수요를 가려낼 " +
    "자료가 없습니다. 이 업적은 2026년 9월 19일 기준이며 중동 정세가 진행 중이라 " +
    "뒤집힐 수 있습니다.",

  headlineKeyNumberId: "kn-share",

  scenes: [
    {
      id: "share",
      kind: "quantity-track",
      heading: "중동에 기대던 몫이 줄어든 자리",
      lede:
        "원유 수입 가운데 중동산이 차지한 비중입니다. 스크롤하면 그 사이를 지나갑니다.",
      claimIds: ["claim-share"],
      track: {
        label: "원유 수입 중 중동산 비중",
        unit: "%",
        direction: "down",
        max: 71.5,
        note:
          "정부와 국회가 밝힌 시점만 그린다. 2026년 값은 1~5월 누계이고 그 뒤는 " +
          "확인하지 못했다. 이 대통령은 9월 12일 “50%대로 낮췄다”고 밝혔으나 " +
          "대조할 정부 통계를 찾지 못해 이 추이에는 넣지 않았다.",
        checkpoints: [
          {
            id: "os-2024",
            displayDate: "2024년",
            title: "71.5%",
            amount: 71.5,
            caption:
              "원유 열 통 중 일곱 통이 중동에서 왔습니다. 사우디·미국·UAE 세 나라가 전체의 62.3%였습니다.",
            art: "oil-mideast",
            claimId: "claim-share",
          },
          {
            id: "os-2025",
            displayDate: "2025년",
            title: "69.1%",
            amount: 69.1,
            caption:
              "7억 1,100만 배럴이 중동에서 들어왔습니다.",
            art: "oil-mideast",
            claimId: "claim-share",
          },
          {
            id: "os-2026",
            displayDate: "2026년 1~5월",
            title: "62.8%",
            amount: 62.8,
            caption:
              "2억 4,700만 배럴입니다. 정부 목표는 50% 아래입니다.",
            art: "oil-spread",
            claimId: "claim-share",
          },
        ],
      },
    },
  ],

  shorts: [],

  eli5: {
    intro:
      "우리나라는 기름이 안 나와서 다 사 와요. 그런데 사 오던 동네에서 전쟁이 났어요.",
    scenes: [
      {
        id: "e-os-one",
        title: "한 동네에서만 샀어요",
        say: "우리가 쓰는 기름 열 통 중 일곱 통이 중동에서 왔어요. 그 길이 막히면 큰일이 나요.",
        art: "oil-mideast",
        fact: { value: "71.5%", tone: "warm" },
        claimIds: ["claim-share"],
      },
      {
        id: "e-os-many",
        title: "여러 동네로 넓혔어요",
        say: "미국, 호주, 알제리, 남미에서도 사 오기로 했어요. 중동산 비중이 62.8%까지 내려왔고, 50% 아래로 낮추는 게 목표예요.",
        art: "oil-spread",
        fact: { value: "62.8%", tone: "ice" },
        claimIds: ["claim-share"],
      },
      {
        id: "e-os-far",
        title: "먼 데서 사면 배삯이 더 들어요",
        say: "그래서 정부가 더 드는 배삯을 대신 내 줬어요. 그랬더니 캐나다산은 160%, 에콰도르산은 422% 늘었어요.",
        art: "oil-freight",
        fact: { value: "전액 지원", tone: "ice" },
        claimIds: ["claim-freight"],
      },
      {
        id: "e-os-swap",
        title: "나라 기름을 먼저 빌려줬어요",
        say: "정유회사가 기름이 모자랄까 봐, 나라가 모아 둔 기름을 먼저 빌려주고 나중에 같은 양으로 돌려받기로 했어요.",
        art: "oil-swap",
        claimIds: ["claim-swap"],
      },
      {
        id: "e-os-cap",
        title: "값에 천장을 씌웠어요",
        say: "정유회사가 주유소에 넘기는 값에 '여기보다 비싸게 팔면 안 된다'는 선을 그었어요. 이런 건 30년 만이에요.",
        art: "oil-cap",
        fact: { value: "1,784원", tone: "ice" },
        claimIds: ["claim-cap"],
      },
    ],
    caveat: {
      text:
        "기름값이 싸진 건 아니에요. 4월에는 2,000원을 넘었고 9월에도 1,859원이에요. 국제 가격이 오르는 동안 국내 값이 내린 건 맞지만, 그게 다 정부 덕분인지는 확인할 수 없어요.",
      claimIds: ["claim-price"],
    },
  },

  keyNumbers: [
    {
      id: "kn-share",
      label: "중동산 원유 비중",
      value: "71.5 → 62.8",
      unit: "%",
      caption: "2024년 → 2026년 1~5월 · 목표는 50% 아래",
      claimId: "claim-share",
    },
    {
      id: "kn-ecuador",
      label: "에콰도르산 도입 증가",
      value: "422.1",
      unit: "%",
      caption: "운임차액 지원 시행기(4~6월) · 캐나다산 160.8%, 아프리카산 156.7%",
      claimId: "claim-freight",
    },
    {
      id: "kn-gas",
      label: "휘발유 전국 평균",
      value: "1,859.1",
      unit: "원",
      caption: "2026년 9월 6~10일 · 17주 연속 하락 · 4월에는 2,000원을 넘었다",
      claimId: "claim-price",
    },
  ],

  timeline: [
    {
      id: "os-cap",
      date: "2026-03-13",
      displayDate: "2026년 3월 13일",
      datePrecision: "day",
      title: "석유 최고가격제 시행",
      summary:
        "석유사업법 제23조에 근거해 정유사가 주유소·대리점에 넘기는 공급가격에 상한을 뒀다. 1994년 유가 자유화 이후 30여 년 만의 가격 개입이다. 상한은 2주마다 국제유가를 반영해 다시 정한다.",
      claimIds: ["claim-cap"],
    },
    {
      id: "os-peak",
      date: "2026-04-25",
      displayDate: "2026년 4월",
      datePrecision: "month",
      title: "휘발유 2,000원 돌파",
      summary:
        "중동 사태로 국제유가가 뛰면서 국내 휘발유 가격이 리터당 2,000원을 넘었다. 이 업적은 값이 내린 구간만 그리지 않는다.",
      claimIds: ["claim-price"],
    },
    {
      id: "os-policy",
      date: "2026-07-13",
      displayDate: "2026년 7월 13일",
      datePrecision: "day",
      title: "산업통상부, 다변화 방침 발표",
      summary:
        "문신학 차관 주재 점검회의에서 중동산 비중을 50% 아래로 낮추고 미국·호주·알제리 등으로 도입선을 넓히겠다고 밝혔다. 2025년 69.1%(7억 1,100만 배럴), 2026년 1~5월 62.8%(2억 4,700만 배럴)라는 수치가 함께 공개됐다.",
      claimIds: ["claim-share"],
    },
    {
      id: "os-swap",
      date: "2026-08-24",
      displayDate: "2026년 8월 24일",
      datePrecision: "day",
      title: "비축유 스와프 재시행",
      summary:
        "정부 비축유를 정유사에 먼저 공급하고, 정유사가 해외 대체유를 들여온 뒤 같은 양을 돌려주는 방식이다. 2개월 운영하되 필요하면 연장한다.",
      claimIds: ["claim-swap"],
    },
    {
      id: "os-freight",
      date: "2026-09-14",
      displayDate: "2026년 9월 14일",
      datePrecision: "day",
      title: "다변화 운임차액 지원 재시행",
      summary:
        "비중동 지역에서 원유를 들여올 때 생기는 운임 차액을 전액 지원한다. 9월분부터 적용한다. 4~6월 시행 때는 미국산 14.2%, 캐나다산 160.8%, 에콰도르산 422.1%, 아프리카산 156.7%가 늘었다.",
      claimIds: ["claim-freight"],
    },
    {
      id: "os-say",
      date: "2026-09-12",
      displayDate: "2026년 9월 12일",
      datePrecision: "day",
      title: "대통령 “중동 의존도 50%대로 낮췄다”",
      summary:
        "이재명 대통령이 소셜미디어에 70%에 이르던 중동 의존도를 50%대로 낮췄고 원유 특사 파견·장거리 수송비 보조·비축유 스와프로 공급 안정성을 유지하고 있다고 밝혔다. 이 위키가 대조한 정부 통계는 1~5월 62.8%까지이며, 6월 이후 값은 확인하지 못했다.",
      claimIds: ["claim-president"],
    },
  ],

  graph: {
    note:
      "기름이 어디서 오고, 값이 어디서 붙들리는지를 그렸다. 외교로 한 일과 " +
      "국내 규제로 한 일이 섞여 있어 나눠 표시했다.",
    entities: [
      { id: "motie", name: "산업통상부", kind: "government", isFocus: true,
        description: "다변화 방침과 지원 제도를 운영하는 쪽" },
      { id: "mideast", name: "중동", kind: "place",
        description: "2024년 기준 원유의 71.5%가 오던 곳. 2026년 전쟁이 벌어졌다" },
      { id: "others", name: "미국·호주·남미 등", kind: "place",
        description: "새로 넓힌 수입처" },
      { id: "refiners", name: "정유사", kind: "company",
        description: "원유를 들여와 정제하는 쪽. 공급가격에 상한이 걸렸다" },
      { id: "reserve", name: "정부 비축유", kind: "project",
        description: "위기 때 먼저 빌려주는 재고. 위기 전 정부·민간 합산 약 206.9일분" },
      { id: "drivers", name: "운전자", kind: "group",
        description: "주유소에서 값을 치르는 쪽" },
    ],
    relations: [
      {
        id: "os-r-cap",
        fromId: "motie",
        toId: "refiners",
        label: "주유소에 넘기는 공급가격에 상한을 뒀다. 30여 년 만이다.",
        startDate: "2026-03-13",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-cap"],
      },
      {
        id: "os-r-mideast",
        fromId: "mideast",
        toId: "refiners",
        label: "원유의 대부분이 오던 길. 2024년 71.5%에서 2026년 1~5월 62.8%로 줄었다.",
        startDate: "2024",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-share"],
      },
      {
        id: "os-r-others",
        fromId: "others",
        toId: "refiners",
        label: "새로 넓힌 길. 운임 차액을 정부가 전액 지원한다.",
        startDate: "2026-09-14",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-freight"],
      },
      {
        id: "os-r-swap",
        fromId: "reserve",
        toId: "refiners",
        label: "먼저 공급하고 같은 양을 돌려받는다.",
        startDate: "2026-08-24",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-swap"],
      },
      {
        id: "os-r-price",
        fromId: "refiners",
        toId: "drivers",
        label: "국제 유가가 오르는 동안 국내 가격은 17주 연속 내렸다. 인과는 단정하지 않는다.",
        startDate: "2026-09",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-price"],
      },
    ],
  },

  counterpoints: [
    {
      id: "os-cp-cheap",
      question: "기름값이 싸졌나?",
      response:
        "아니다. 2026년 4월 휘발유는 리터당 2,000원을 넘었고, 9월 둘째 주에도 전국 평균 1,859.1원이다. 이 업적이 말하는 것은 값이 싸졌다는 것이 아니라, 국제 유가가 오르는 동안 국내 값이 따라 오르지 않았다는 것이다. 같은 주 두바이유는 배럴당 114.7달러로 한 주에만 14.4달러 올랐는데 국내 휘발유는 1.1원 내렸고, 이것이 17주째였다. 값이 오른 구간을 빼고 내린 구간만 그리지 않는다.",
      claimIds: ["claim-price"],
    },
    {
      id: "os-cp-cause",
      question: "값이 안 오른 게 정부 덕인가?",
      response:
        "이 위키는 그렇게 말하지 않는다. 최고가격제가 정유사 공급가격에 상한을 씌운 것은 사실이고 그 시점 이후 국내 가격이 국제 가격을 덜 따라간 것도 사실이지만, 환율·정제마진·수요·유류세 같은 다른 요인을 가려낼 자료가 없다. 청정계곡의 경쟁률에서도 재난기본소득의 소비 효과에서도 인과를 단정하지 않았고, 여기서도 같다. 대책이 있었다는 것과 그 대책이 원인이라는 것은 다른 말이다.",
      claimIds: ["claim-cap", "claim-price"],
    },
    {
      id: "os-cp-fifty",
      question: "중동 의존도가 정말 50%대인가?",
      response:
        "확인하지 못했다. 이 대통령은 2026년 9월 12일 “70%에 이르던 원유 중동 의존도를 50%대로 낮췄다”고 밝혔다. 그러나 이 위키가 대조한 정부 통계는 산업통상부가 7월 13일 공개한 2026년 1~5월 누계 62.8%까지다. 6월 이후 값이 50%대로 내려갔을 수도 있지만 대조할 자료를 찾지 못했다. 그래서 대통령 발언은 ‘누가 말했는지’를 밝혀 주장으로 싣고, 추이 그래프의 점으로는 쓰지 않았다.",
      claimIds: ["claim-president", "claim-share"],
    },
    {
      id: "os-cp-reserve",
      question: "비축은 충분한가?",
      response:
        "국회 입법조사처는 위기 전 정부·민간 합산 비축량이 약 206.9일분, 정부 직접 관리 전략비축유가 국제에너지기구 기준 약 116일분이라고 밝히면서, 스와프로 얼마를 썼고 이후 어느 수준까지 회복했는지가 충분히 공개되지 않았다고 지적했다. 방출 기준도 “민간재고가 일정 비율 이상 감소할 경우”라고만 돼 있어 어느 수준을 요건으로 삼는지 명확하지 않다는 비판이 따랐다. 또 국내 정유 설비가 오랫동안 중동산 중질·고유황 원유에 맞춰져 있어, 다른 지역 원유를 늘리면 추가 비용이 생길 수 있다는 지적도 함께 나왔다.",
      claimIds: ["claim-reserve"],
    },
  ],

  claims: [
    {
      id: "claim-share",
      text:
        "산업통상부는 2026년 7월 13일 원유 수입 중 중동산 비중이 2025년 69.1%(7억 1,100만 배럴), 2026년 1~5월 62.8%(2억 4,700만 배럴)라고 밝히고, 미국·호주·알제리 등으로 도입선을 넓혀 50% 아래로 낮추겠다고 발표했다. 국회 입법조사처 분석에 따르면 2024년 기준 중동산 비중은 71.5%였고 사우디·미국·UAE 세 나라가 전체의 62.3%를 차지했다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-oil", "src-energy-oil"],
      verified: true,
    },
    {
      id: "claim-freight",
      text:
        "산업통상부는 2026년 9월 14일 원유 수급 긴급 점검회의에서 비중동 지역 원유 도입 시 발생하는 운임 차액을 전액 지원하는 다변화 운임차액 지원을 9월분부터 재시행한다고 밝혔다. 4~6월 시행 결과 미국산 14.2%, 캐나다산 160.8%, 에콰도르산 422.1%, 아프리카산 156.7%가 증가했다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-oil"],
      verified: true,
    },
    {
      id: "claim-swap",
      text:
        "정부는 2026년 8월 24일 비축유 스와프를 재시행했다. 정부 비축유를 정유사에 선제 공급하고 정유사가 해외 대체유를 도입한 뒤 같은 양을 반환하는 방식으로, 2개월간 운영하되 필요시 연장한다. 7~8월 도입 원유는 전년 대비 100% 이상, 9~10월은 전년 대비 90% 이상 확보됐다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-oil"],
      verified: true,
    },
    {
      id: "claim-cap",
      text:
        "정부는 2026년 3월 13일 0시부터 석유사업법 제23조에 근거해 석유 최고가격제를 시행했다. 주유소 판매가격이 아니라 국내 4대 정유사가 주유소·대리점에 출고하는 공급가격에 상한을 두는 방식이며, 2주마다 국제유가 변동을 반영해 재조정한다. 1994년 유가 자유화 이후 30여 년 만의 가격 개입이다. 2026년 8월 21일 지정된 9차 최고가격은 휘발유 리터당 1,784원, 경유 1,773원, 등유 1,380원이다.",
      assertionType: "FACT",
      sourceIds: ["src-kuki-oil", "src-fn-oil"],
      verified: true,
    },
    {
      id: "claim-price",
      text:
        "2026년 9월 6~10일 전국 주유소 휘발유 평균 판매가는 리터당 1,859.1원으로 전주보다 1.1원 내렸고, 이는 17주 연속 하락이다. 경유는 1,844.0원이다. 같은 기간 두바이유는 배럴당 114.7달러로 한 주간 14.4달러 올랐다. 2026년 4월에는 국내 휘발유 가격이 리터당 2,000원을 넘은 바 있다.",
      assertionType: "FACT",
      sourceIds: ["src-fn-oil", "src-mt-oil"],
      verified: true,
    },
    {
      id: "claim-president",
      text:
        "이재명 대통령은 2026년 9월 12일 소셜미디어를 통해 “70%에 이르던 원유 중동 의존도”를 “50%대로 낮췄다”고 밝히고, 원유 특사 파견 등 원유 외교 강화, 장거리 원유 수송비 보조, 전략 비축유 스와프제 도입, 최고가격제와 수출 물량 통제로 공급과 가격을 유지하고 있다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-seoul-say"],
      verified: true,
    },
    {
      id: "claim-reserve",
      text:
        "국회 입법조사처는 위기 이전 정부·민간 합산 석유 비축량이 약 206.9일분, 정부가 직접 관리하는 전략비축유가 국제에너지기구 기준 약 116일분이며 6월까지 시행된 스와프 규모가 약 2,100만 배럴이라고 밝혔다. 그러면서 민간재고와 비축유 스와프를 얼마나 사용했고 어느 수준까지 회복했는지가 충분히 공개되지 않았고, 방출 요건이 구체화되지 않았다고 지적했다. 국내 정유사 설비가 중동산 중질·고유황 원유에 최적화돼 있어 다른 지역 원유 확대 시 추가 비용이 발생할 수 있다는 지적도 함께 제기됐다.",
      assertionType: "FACT",
      sourceIds: ["src-energy-oil"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-seoul-oil",
      title: "정부 “원유 중동산 비중 50% 아래로 낮추고 다변화”",
      url: "https://www.seoul.co.kr/news/economy/2026/07/14/20260714032005",
      publisher: "서울신문",
      publishedAt: "2026-07-14",
      type: "press",
      license: "quotable",
      quote:
        "지난해 중동산 원유는 69.1%(7억 1100만 배럴), 올해 1~5월은 " +
        "62.8%(2억 4700만 배럴)였다. 정부는 미국·호주·알제리 등으로 도입선을 " +
        "넓혀 중동산 비중을 50% 아래로 낮추기로 했다.",
    },
    {
      id: "src-asiae-oil",
      title: "‘중동 긴장 재고조’에 원유 수급 긴급 점검…산업부 “9월분부터 다변화 운임차액 지원”",
      url: "https://view.asiae.co.kr/article/2026091410283056156",
      publisher: "아시아경제",
      publishedAt: "2026-09-14",
      type: "press",
      license: "quotable",
      quote:
        "비중동지역에서 원유 도입 시 발생하는 운임차액을 전액 지원한다. " +
        "4~6월 시행 결과 미국산 14.2%, 캐나다산 160.8%, 에콰도르산 422.1%, " +
        "아프리카산 156.7% 증가했다. 비축유 스와프는 8월 24일 재시행했다.",
    },
    {
      id: "src-fn-oil",
      title: "국제유가 뛰었지만 국내 기름값 소폭 내려…휘발유 평균 1859.1원",
      url: "https://www.fnnews.com/news/202609120832262658",
      publisher: "파이낸셜뉴스",
      publishedAt: "2026-09-12",
      type: "press",
      license: "quotable",
      quote:
        "휘발유 1859.1원(전주 대비 1.1원 하락, 17주 연속 하락), 경유 1844.0원. " +
        "같은 기간 두바이유는 배럴당 114.7달러로 1주간 14.4달러 올랐다. " +
        "9차 최고가격은 휘발유 1784원, 경유 1773원, 등유 1380원이다.",
    },
    {
      id: "src-kuki-oil",
      title: "‘정유사 공급가’ 초점, 석유 최고가격제 시행됐지만…출렁이는 유가 반영될까",
      url: "https://www.kukinews.com/article/view/kuk202603120231",
      publisher: "쿠키뉴스",
      publishedAt: "2026-03-12",
      type: "press",
      license: "quotable",
      quote:
        "주유소 판매가격이 아니라 정유사의 공급가격에 상한을 두는 방식이다. " +
        "석유사업법 제23조에 근거하며, 최고가격은 2주마다 국제유가 변동을 " +
        "반영해 재조정한다. 1994년 유가 자유화 이후 30여 년 만이다.",
    },
    {
      id: "src-mt-oil",
      title: "공급가 묶어도 치솟는 기름값…리터당 2000원 돌파, 어디까지 오르나",
      url: "https://www.mt.co.kr/economy/2026/04/25/2026042510362822741",
      publisher: "머니투데이",
      publishedAt: "2026-04-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-say",
      title: "[속보] 李 대통령 “유가 급등 걱정 안해도 돼… 중동 의존도 낮춰”",
      url: "https://www.seoul.co.kr/news/politics/president/2026/09/12/20260912500092",
      publisher: "서울신문",
      publishedAt: "2026-09-12",
      type: "interview",
      license: "quotable",
      quote:
        "70%에 이르던 원유 중동 의존도를 50%대로 낮췄다. 원유 특사 파견 등 " +
        "원유 외교를 강화하고 장거리 원유 수송비를 보조했으며, 전략 비축유 " +
        "스와프제 도입으로 원유 공급 안정성을 유지하고 있다 (이재명 대통령)",
    },
    {
      id: "src-energy-oil",
      title: "[2026 국감] 호르무즈 위기에 흔들린 석유 공급망…비축·조달 전략 작동했나",
      url: "https://www.energydaily.co.kr/news/articleView.html?idxno=202892",
      publisher: "에너지데일리",
      type: "press",
      license: "quotable",
      quote:
        "위기 이전 정부·민간 합산 비축량은 약 206.9일분, 정부 직접 관리 " +
        "전략비축유는 IEA 기준 약 116일분이다. 2024년 기준 원유의 71.5%를 " +
        "중동에서 수입하며 상위 3개국이 전체의 62.3%를 점유한다. " +
        "민간재고와 비축유 스왑을 얼마나 사용했고 이후 어느 수준까지 " +
        "회복했는지 충분히 공개되지 않았다 (국회 입법조사처)",
    },
  ],
};

export const oilSupply = achievementSchema.parse(raw);
