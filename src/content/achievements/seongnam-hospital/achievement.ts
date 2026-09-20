import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 성남시의료원 — 시민이 발의해 만든 전국 첫 공공병원.
 *
 * 이 업적의 무게중심은 '누가 지었나'가 아니라 '얼마나 걸렸나'다.
 * 2003년 병원 두 곳이 문을 닫자 시민들이 직접 조례를 냈고, 두 번 부결된 뒤
 * 2006년에 통과됐다. 그런데도 첫 삽을 뜨기까지 다시 7년이 걸렸다.
 *
 * 그래서 시장 시절의 몫을 부풀리지 않는다. 조례를 통과시킨 것은 시민과
 * 시의회이고, 2013년에 착공한 것이 이 시정의 몫이다. 각각 claim을 나눠 두었다.
 *
 * ⚠ 모션 씬이 없다.
 *   이 업적을 움직여 볼 만한 전용 개념이 마땅치 않다. 지도도 자금 배분도
 *   아니고, 시계열로 그릴 만한 숫자는 병상 계획 정도인데 그건 연표가 더 잘 한다.
 *   억지로 채우면 화면 하나가 낭비되므로 비워 둔다. 목록에 그렇게 보인다.
 */

const raw: AchievementInput = {
  id: "seongnam-hospital",
  slug: "seongnam-hospital",
  title: "성남시의료원",
  subtitle: "시민이 발의하고 17년이 걸린 전국 첫 공공병원",
  kicker: "주요 업적",
  categories: ["welfare"],
  summary:
    "2003년 성남 본시가지의 병원 두 곳이 문을 닫았다. 시민들이 직접 조례를 발의했고, " +
    "두 번 부결된 끝에 2006년 시의회를 통과했다. 그러고도 첫 삽을 뜨기까지 7년이 더 걸렸다. " +
    "2013년 착공해 2020년 509병상으로 문을 열었다.",
  type: "event",
  publishStatus: "published",
  sourceNote:
    "착공과 규모는 성남시 시정소식지로 확인했습니다. 다만 조례 부결·가결 경위는 " +
    "한국학중앙연구원 디지털성남문화대전에 기대고 있고, 성남시의회 회의록으로 대조하는 일은 " +
    "아직 남아 있습니다.",

  headlineKeyNumberId: "kn-years",

  scenes: [
    {
      id: "wait",
      kind: "quantity-track",
      heading: "17년이 흐르는 것을 봅니다",
      lede:
        "문 닫힌 병원을 다시 세우는 데 걸린 시간입니다. 스크롤하면 그 세월을 지나갑니다.",
      claimIds: ["claim-closure", "claim-petition", "claim-passed", "claim-groundbreak", "claim-open"],
      track: {
        label: "병원이 문을 닫은 뒤 흐른 시간",
        unit: "년",
        direction: "up",
        max: 17,
        note:
          "값은 자료에 적힌 날짜들에서 계산한 햇수다. 2003년 폐업을 0년으로 둔다. " +
          "'몇 년이 걸렸다'는 수치가 따로 실린 자료가 있는 것은 아니다.",
        checkpoints: [
          {
            id: "qt-closed",
            displayDate: "2003년",
            title: "두 병원이 문을 닫았다",
            amount: 0,
            caption:
              "인하병원과 중앙병원이 잇따라 문을 닫았습니다. 성남 본시가지에 종합병원이 없어졌습니다.",
            art: "hospital-closed",
            claimId: "claim-closure",
          },
          {
            id: "qt-committee",
            displayDate: "2003년 11월 7일",
            title: "시민이 추진위를 꾸렸다",
            amount: 0,
            caption:
              "각계각층의 성남 시민이 모여 성남시립병원설립범시민추진위원회를 구성했습니다.",
            art: "citizens-petition",
            claimId: "claim-closure",
          },
          {
            id: "qt-rejected",
            displayDate: "2004년 3월 · 2005년",
            title: "주민발의 조례안이 두 번 부결됐다",
            amount: 2,
            caption:
              "시민이 직접 발의한 조례안이 성남시의회에서 부결됐습니다. 이듬해 다시 올렸지만 또 부결됐습니다.",
            art: "rejected-twice",
            claimId: "claim-petition",
          },
          {
            id: "qt-passed",
            displayDate: "2006년 3월 15일",
            title: "세 번째에 만장일치로 가결",
            amount: 3,
            caption:
              "제133회 성남시의회에서 성남시립병원 설립 조례가 만장일치로 가결됐습니다.",
            art: "passed-third",
            claimId: "claim-passed",
          },
          {
            id: "qt-ground",
            displayDate: "2013년 11월 14일",
            title: "가결로부터 7년 뒤에야 첫 삽",
            amount: 10,
            caption:
              "연면적 81,510㎡에 22개 진료과와 43개 진료실, 501병상을 수용하는 규모로 기공식이 열렸습니다.",
            art: "ground-broken",
            claimId: "claim-groundbreak",
          },
          {
            id: "qt-open",
            displayDate: "2020년 5월 6일",
            title: "509병상으로 진료를 시작했다",
            amount: 17,
            caption:
              "22개 진료과와 전문의 69명으로 진료를 시작했습니다. 정식 개원식은 코로나19로 미뤄져 7월에 온라인으로 열렸습니다.",
            art: "hospital-open",
            claimId: "claim-open",
          },
        ],
      },
    },
  ],
  shorts: [],

  eli5: {
    intro:
      "성남에 시민들이 직접 만든 병원이 있어요. 만드는 데 17년이 걸렸어요. 여섯 장면으로 볼게요.",
    scenes: [
      {
        id: "e-sh-closed",
        title: "동네 병원이 문을 닫았어요",
        say: "2003년에 큰 병원 두 곳이 한꺼번에 없어졌어요. 아프면 멀리 가야 했어요.",
        art: "hospital-closed",
        fact: { value: "2003년", tone: "warm" },
        claimIds: ["claim-closure"],
      },
      {
        id: "e-sh-petition",
        title: "시민들이 직접 법을 만들자고 했어요",
        say: "시장이나 시의원이 아니라 시민들이 이름을 모아 '병원을 지어 달라'는 규칙을 내놨어요. 이런 걸 주민발의라고 해요.",
        art: "citizens-petition",
        fact: { value: "전국 최초", tone: "ice" },
        claimIds: ["claim-first"],
      },
      {
        id: "e-sh-rejected",
        title: "두 번이나 퇴짜를 맞았어요",
        say: "시의회가 2004년에 한 번, 2005년에 또 한 번 안 된다고 했어요. 시민들은 포기하지 않았어요.",
        art: "rejected-twice",
        fact: { value: "2004 · 2005", tone: "warm" },
        claimIds: ["claim-petition"],
      },
      {
        id: "e-sh-passed",
        title: "세 번째에 모두가 찬성했어요",
        say: "2006년 3월, 시의회가 한 명도 반대하지 않고 통과시켰어요.",
        art: "passed-third",
        fact: { value: "2006년 3월 15일 만장일치", tone: "ice" },
        claimIds: ["claim-passed"],
      },
      {
        id: "e-sh-ground",
        title: "그런데 7년 동안 땅을 파지 않았어요",
        say: "규칙은 생겼는데 공사가 시작되지 않았어요. 2013년에야 첫 삽을 떴어요.",
        art: "ground-broken",
        fact: { value: "2013년 11월 14일 기공식", tone: "ice" },
        claimIds: ["claim-groundbreak"],
      },
      {
        id: "e-sh-open",
        title: "17년 만에 문을 열었어요",
        say: "2020년에 병원이 열렸어요. 침대가 509개, 진료과가 스물두 개예요.",
        art: "hospital-open",
        fact: { value: "509병상 · 22개 진료과", tone: "ice" },
        claimIds: ["claim-open", "claim-scale"],
      },
    ],
    caveat: {
      text:
        "문을 연 시점은 두 가지로 적혀 있어요. 진료를 시작한 건 2020년 5월이고, 정식 개원식은 코로나 때문에 미뤄져 7월에 온라인으로 했어요.",
      claimIds: ["claim-open"],
    },
  },

  keyNumbers: [
    {
      id: "kn-years",
      label: "폐업에서 개원까지",
      value: "17",
      unit: "년",
      caption: "2003년 병원 폐업 → 2020년 개원",
      claimId: "claim-open",
    },
    {
      id: "kn-beds",
      label: "병상",
      value: "509",
      unit: "병상",
      caption: "전문의 69명 · 22개 진료과",
      claimId: "claim-scale",
    },
    {
      id: "kn-wait",
      label: "조례 통과에서 착공까지",
      value: "7",
      unit: "년",
      caption: "2006년 3월 가결 → 2013년 11월 기공",
      claimId: "claim-groundbreak",
    },
  ],

  timeline: [
    {
      id: "sh-closed",
      date: "2003-11-07",
      displayDate: "2003년 11월 7일",
      datePrecision: "day",
      title: "병원 폐업, 그리고 시민추진위 구성",
      summary:
        "인하병원과 중앙병원이 문을 닫은 뒤 각계각층 시민이 성남시립병원설립범시민추진위원회를 꾸렸다.",
      claimIds: ["claim-closure"],
    },
    {
      id: "sh-reject1",
      date: "2004-03",
      displayDate: "2004년 3월",
      datePrecision: "month",
      title: "주민발의 조례안 부결",
      summary: "시민이 이름을 모아 낸 조례안이 시의회에서 부결됐다.",
      claimIds: ["claim-petition", "claim-first"],
    },
    {
      id: "sh-reject2",
      date: "2005",
      displayDate: "2005년",
      datePrecision: "year",
      title: "다시 부결",
      summary: "두 번째로 제출된 조례안도 통과되지 못했다.",
      claimIds: ["claim-petition"],
    },
    {
      id: "sh-passed",
      date: "2006-03-15",
      displayDate: "2006년 3월 15일",
      datePrecision: "day",
      title: "제133회 성남시의회 만장일치 가결",
      summary: "세 번째 시도에서 반대 없이 통과됐다. 조례는 생겼지만 공사는 시작되지 않았다.",
      claimIds: ["claim-passed"],
    },
    {
      id: "sh-ground",
      date: "2013-11-14",
      displayDate: "2013년 11월 14일",
      datePrecision: "day",
      title: "기공식 — 조례 가결 7년 만의 첫 삽",
      summary:
        "연면적 81,510㎡에 22개 진료과와 43개 진료실, 501병상 규모로 착공했다.",
      claimIds: ["claim-groundbreak"],
    },
    {
      id: "sh-open",
      date: "2020-05-06",
      displayDate: "2020년 5월 6일",
      datePrecision: "day",
      title: "진료 시작",
      summary:
        "22개 진료과로 문을 열었다. 정식 개원식은 코로나19로 미뤄져 7월 27~29일 온라인으로 열렸다.",
      claimIds: ["claim-open", "claim-scale"],
    },
  ],

  graph: {
    note:
      "이 병원을 만든 주체가 누구였는지를 그렸다. 가운데가 성남시민이다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "citizens", name: "성남시민", kind: "group", isFocus: true,
        description: "조례를 직접 발의한 쪽" },
      { id: "closed", name: "폐업한 병원 두 곳", kind: "organization",
        description: "인하병원 · 중앙병원" },
      { id: "committee", name: "시립병원설립 범시민추진위", kind: "organization",
        description: "2003년 11월 구성" },
      { id: "council", name: "성남시의회", kind: "government" },
      { id: "ordinance", name: "시립병원 설립 조례", kind: "project" },
      { id: "seongnam", name: "성남시", kind: "government",
        description: "착공하고 준공한 주체" },
      { id: "hospital", name: "성남시의료원", kind: "project",
        description: "509병상 · 22개 진료과" },
    ],
    relations: [
      {
        id: "sh-r-closed",
        fromId: "closed",
        toId: "citizens",
        label: "본시가지의 병원 두 곳이 한꺼번에 문을 닫았다.",
        startDate: "2003-11-07",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-closure"],
      },
      {
        id: "sh-r-committee",
        fromId: "citizens",
        toId: "committee",
        label: "각계각층이 모여 범시민추진위원회를 꾸렸다.",
        startDate: "2003-11-07",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-closure"],
      },
      {
        id: "sh-r-petition",
        fromId: "committee",
        toId: "ordinance",
        label: "시민이 이름을 모아 조례안을 발의했다. 주민발의로 설립된 공공병원은 전국에서 처음이다.",
        startDate: "2004-03",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-first", "claim-petition"],
      },
      {
        id: "sh-r-reject",
        fromId: "council",
        toId: "ordinance",
        label: "2004년 3월과 2005년, 두 차례 부결했다.",
        startDate: "2004-03",
        startPrecision: "month",
        endDate: "2006-03-15",
        endPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-petition"],
      },
      {
        id: "sh-r-pass",
        fromId: "council",
        toId: "ordinance",
        label: "2006년 3월 15일 제133회 회의에서 만장일치로 가결했다.",
        startDate: "2006-03-15",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-passed"],
      },
      {
        id: "sh-r-build",
        fromId: "seongnam",
        toId: "hospital",
        label: "조례 가결 7년 만에 기공식을 열었다. 연면적 81,510㎡, 501병상 규모였다.",
        startDate: "2013-11-14",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-groundbreak"],
      },
      {
        id: "sh-r-open",
        fromId: "hospital",
        toId: "citizens",
        label: "2020년 5월 22개 진료과로 진료를 시작했다. 509병상, 전문의 69명이다.",
        startDate: "2020-05-06",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-open", "claim-scale"],
      },
    ],
  },

  counterpoints: [
    {
      id: "sh-cp-whose",
      question: "이걸 한 사람의 업적이라고 할 수 있나?",
      response:
        "조례를 발의한 것은 시민이고, 통과시킨 것은 2006년의 시의회다. 이 시정의 몫은 조례가 통과되고도 7년간 멈춰 있던 사업을 2013년에 착공한 것이다. 이 스토리는 그 구분을 지운 채 쓰지 않는다 — 연표와 관계도에서 누가 어느 단계를 맡았는지 그대로 보인다.",
      claimIds: ["claim-first", "claim-passed", "claim-groundbreak"],
    },
    {
      id: "sh-cp-slow",
      question: "17년이나 걸린 게 자랑인가?",
      response:
        "자랑이 아니라 기록이다. 조례가 통과된 2006년부터 착공한 2013년까지 7년이 비어 있고, 이 스토리는 그 공백을 지우지 않는다. 다만 시민이 발의한 조례로 공공병원이 실제로 지어진 사례는 전국에서 이것이 처음이다.",
      claimIds: ["claim-passed", "claim-groundbreak", "claim-first"],
    },
    {
      id: "sh-cp-open",
      question: "개원일이 왜 두 가지로 나오나?",
      response:
        "진료를 시작한 것은 2020년 5월 6일이고, 정식 개원식은 3월로 준비됐다가 코로나19로 미뤄져 7월 27~29일 온라인으로 열렸다. 어느 쪽을 개원일로 볼지에 따라 날짜가 달라진다. 이 스토리는 둘을 모두 적는다.",
      claimIds: ["claim-open"],
    },
  ],

  claims: [
    {
      id: "claim-closure",
      text:
        "2003년 인하병원과 중앙병원이 문을 닫은 뒤, 2003년 11월 7일 각계각층의 성남 시민이 참여해 성남시립병원설립범시민추진위원회를 구성했다.",
      assertionType: "FACT",
      sourceIds: ["src-grandculture"],
      verified: true,
    },
    {
      id: "claim-first",
      text:
        "성남시의료원은 주민발의 조례로 설립된 전국 첫 공공병원이다.",
      assertionType: "FACT",
      sourceIds: ["src-grandculture", "src-book"],
      verified: true,
    },
    {
      id: "claim-petition",
      text:
        "주민발의 조례안은 2004년 3월 성남시의회에서 부결됐고, 2005년에도 다시 부결됐다.",
      assertionType: "FACT",
      sourceIds: ["src-grandculture"],
      verified: true,
    },
    {
      id: "claim-passed",
      text:
        "2006년 3월 15일 제133회 성남시의회에서 성남시립병원 설립 조례가 만장일치로 가결됐다.",
      assertionType: "FACT",
      sourceIds: ["src-grandculture"],
      verified: true,
    },
    {
      id: "claim-groundbreak",
      text:
        "2013년 11월 14일 기공식이 열렸다. 연면적 81,510㎡에 22개 진료과와 43개 진료실, 501병상을 수용하는 규모였다. 조례 가결로부터 7년이 지난 뒤였다.",
      assertionType: "FACT",
      sourceIds: ["src-snvision-2013", "src-grandculture"],
      verified: true,
    },
    {
      id: "claim-open",
      text:
        "2019년 준공하고 2020년 5월 6일 22개 진료과로 진료를 시작했다. 정식 개원식은 코로나19로 미뤄져 7월 27~29일 온라인으로 열렸다.",
      assertionType: "FACT",
      sourceIds: ["src-grandculture", "src-snvision-2020"],
      verified: true,
    },
    {
      id: "claim-scale",
      text:
        "509병상 규모이며, 8개 세분 분과를 포함한 22개 진료과와 대학병원 수준의 전문의 69명을 두었다.",
      assertionType: "FACT",
      sourceIds: ["src-snvision-2020"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-book",
      title: "『밍밍 잼칠라 이장님』 — 1학기 이장님 업적(성남시장) 15",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote: "15. 성남 의료원",
    },
    {
      id: "src-grandculture",
      title: "성남시 의료원 — 디지털성남문화대전",
      url: "https://seongnam.grandculture.net/seongnam/toc/GC00103041",
      publisher: "한국학중앙연구원 디지털성남문화대전",
      type: "research",
      license: "public",
      quote:
        "2003년 11월 7일 각계각층의 성남 시민들이 참여하여 성남시립병원설립범시민추진위원회를 구성 (…) " +
        "2006년 3월 15일 133회 성남시의회에서 만장일치로 '성남시립병원 설립 조례'가 가결 (…) " +
        "2020년 5월 6일 22개 진료과를 두고 문을 열었",
    },
    {
      id: "src-snvision-2013",
      title: "성남의 역사와 함께 하는 '성남시의료원' 착공",
      url: "http://snvision.seongnam.go.kr/2892",
      publisher: "성남시 시정소식지 비전성남",
      publishedAt: "2013-11-13",
      type: "official",
      license: "public",
      quote: "연면적 81,510㎡에 22개 진료과와 43개 진료실, 501병상을 수용",
    },
    {
      id: "src-snvision-2020",
      title: "성남시의료원 온라인 개원식 이벤트",
      url: "https://snvision.seongnam.go.kr/12418",
      publisher: "성남시 시정소식지 비전성남",
      publishedAt: "2020-07-18",
      type: "official",
      license: "public",
      quote:
        "509병상 규모 (…) 8개 세분 분과를 포함한 22개 진료과 (…) 대학병원 수준의 전문의 69명 (…) " +
        "7월 27일(월) ~ 7월 29일(수)",
    },
  ],
};

export const seongnamHospital = achievementSchema.parse(raw);
