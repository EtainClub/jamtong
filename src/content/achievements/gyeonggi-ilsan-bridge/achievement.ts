import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 일산대교 무료화 — 22일 만에 되돌아간 일.
 *
 * 책은 2학기 67에 적으면서 스스로 결말을 밝힌다. "무료화가 되고 28일 만에 다시
 * 유료화로 바뀌었어. (…) 비록 실패했다 하더라도 정책의 방향성은 옳았다고
 * 말하고 싶어."
 *
 * ★ 실패한 일을 싣는다.
 *   성공만 골라 실으면 그건 자료가 아니라 선전물이다. 이 위키의 다른 업적이
 *   믿을 만하려면 이런 것도 같은 자리에 있어야 한다.
 *
 * ★ 책의 '28일'은 맞지 않는다.
 *   2021년 10월 27일 정오에 무료 통행이 시작됐고 11월 18일 0시에 징수가
 *   재개됐다. 22일이다. 책의 수치를 고쳐 싣되 출처 목록에서 빼지는 않는다.
 *
 * ★ 결말까지 적는다.
 *   2024년 10월 대법원이 경기도 패소를 확정했다. 여기서 끝난 일이다.
 */

const raw: AchievementInput = {
  id: "gyeonggi-ilsan-bridge",
  slug: "gyeonggi-ilsan-bridge",
  title: "일산대교 무료화",
  subtitle: "22일 동안 공짜였고, 법정에서 졌다",
  kicker: "주요 정책",
  summary:
    "한강의 다리 스물여덟 개 중 유일하게 통행료를 받던 일산대교를 무료로 만들려 한 " +
    "일이다. 경기도는 2021년 10월 27일 정오 사업시행자 지정을 취소하는 공익처분을 " +
    "내리고 무료 통행을 시작했다. 운영사가 법원에 집행정지를 신청해 받아들여지면서 " +
    "11월 18일 0시부터 통행료 징수가 다시 시작됐다. 2024년 10월 대법원은 경기도의 " +
    "패소를 확정했다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "무료화 시작과 징수 재개 시점, 법원 결정은 당시 보도로 확인했습니다. 공익처분 " +
    "문서와 판결문 원문으로 대조하는 일은 아직 남아 있습니다. 22일 동안 통행료를 " +
    "내지 않은 차량이 몇 대였는지, 그 비용을 누가 부담했는지는 확인하지 못했습니다.",

  headlineKeyNumberId: "kn-days",

  scenes: [
    {
      id: "days",
      kind: "quantity-track",
      heading: "공짜였던 22일",
      lede:
        "시작과 끝이 또렷한 일입니다. 스크롤하면 그 22일을 지나갑니다.",
      claimIds: ["claim-free", "claim-stay", "claim-back", "claim-final"],
      track: {
        label: "통행료를 받지 않은 날",
        unit: "일",
        direction: "up",
        max: 22,
        note:
          "2021년 10월 27일 정오부터 11월 18일 0시까지를 센 날수다. 책은 28일로 적지만 " +
          "보도에 실린 두 시점으로 계산하면 22일이다. 마지막 시점에서 막대가 멈추는 이유는 " +
          "그날로 끝났기 때문이다.",
        checkpoints: [
          {
            id: "ib-free",
            displayDate: "2021년 10월 27일 정오",
            title: "무료 통행이 시작됐다",
            amount: 0,
            caption:
              "경기도가 사업시행자 지정을 취소하는 공익처분을 내리고 통행료를 받지 않기 시작했습니다.",
            art: "br-free",
            claimId: "claim-free",
          },
          {
            id: "ib-stay",
            displayDate: "2021년 11월 15일",
            title: "법원이 운영사 손을 들었다",
            amount: 19,
            caption:
              "일산대교㈜가 낸 집행정지 신청을 법원이 받아들였습니다. 무료 통행의 근거가 멈춰 섰습니다.",
            art: "br-court",
            claimId: "claim-stay",
          },
          {
            id: "ib-back",
            displayDate: "2021년 11월 18일 0시",
            title: "다시 통행료를 받았다",
            amount: 22,
            caption:
              "시스템 점검을 거쳐 징수가 재개됐습니다. 무료였던 기간은 22일입니다.",
            art: "br-back",
            claimId: "claim-back",
          },
          {
            id: "ib-final",
            displayDate: "2024년 10월 11일",
            title: "대법원, 경기도 패소 확정",
            amount: 22,
            caption:
              "1심은 2017~2020년 당기순이익이 발생해 자체 사업이 어려운 상태로 보기 어렵다고 판단했습니다. 대법원이 원심을 확정하면서 이 일은 끝났습니다.",
            art: "br-record",
            claimId: "claim-final",
          },
        ],
      },
    },
  ],

  shorts: [
    {
      id: "short-ib-01",
      title: "공짜였던 22일, 가장 당당한 실패의 기록",
      summary:
        "2021년 10월 27일 무료화, 11월 18일 징수 재개, 2024년 대법원 패소 확정까지 싣습니다.",
      youtubeId: "u5r_PQUQNV0",
      claimIds: ["claim-free", "claim-back", "claim-final"],
      publishedAt: "2026-09-19",
    },
  ],

  eli5: {
    intro:
      "한강에 다리가 스물여덟 개 있는데 딱 하나만 돈을 받았어요. 그 다리 이야기예요.",
    scenes: [
      {
        id: "e-ib-toll",
        title: "한강에서 유일하게 돈을 받는 다리였어요",
        say: "다른 다리는 다 공짜인데 이 다리만 건널 때마다 돈을 냈어요. 이 근처 사는 사람들은 매일 내야 했죠.",
        art: "br-toll",
        fact: { value: "유일", tone: "warm" },
        claimIds: ["claim-free"],
      },
      {
        id: "e-ib-free",
        title: "경기도가 공짜로 만들었어요",
        say: "2021년 10월 27일 낮 열두 시, 경기도가 다리를 운영할 자격을 거두고 통행료를 받지 않기로 했어요.",
        art: "br-free",
        fact: { value: "10월 27일", tone: "ice" },
        claimIds: ["claim-free"],
      },
      {
        id: "e-ib-court",
        title: "운영하던 회사가 법원에 갔어요",
        say: "다리를 운영하던 회사가 그건 안 된다며 법원에 갔어요. 법원은 회사 말을 들어줬어요.",
        art: "br-court",
        fact: { value: "11월 15일", tone: "warm" },
        claimIds: ["claim-stay"],
      },
      {
        id: "e-ib-back",
        title: "22일 만에 다시 돈을 받았어요",
        say: "11월 18일 0시부터 다시 통행료를 받기 시작했어요. 공짜였던 건 22일이었어요.",
        art: "br-back",
        fact: { value: "22일", tone: "warm" },
        claimIds: ["claim-back"],
      },
      {
        id: "e-ib-record",
        title: "결국 졌어요",
        say: "2024년에 대법원이 경기도가 졌다고 최종 결정했어요. 이 일은 여기서 끝났어요. 잘된 일만 적으면 나머지도 믿을 수 없게 되니까 이것도 적어 둬요.",
        art: "br-record",
        fact: { value: "패소 확정", tone: "warm" },
        claimIds: ["claim-final"],
      },
    ],
    caveat: {
      text:
        "22일 동안 몇 대가 공짜로 건넜는지, 그 돈을 누가 물어 줬는지는 확인하지 못했어요. 무엇이 언제 있었는지까지만 적었어요.",
      claimIds: ["claim-back"],
    },
  },

  keyNumbers: [
    {
      id: "kn-days",
      label: "통행료를 받지 않은 기간",
      value: "22",
      unit: "일",
      caption: "2021년 10월 27일 정오 → 11월 18일 0시",
      claimId: "claim-back",
    },
    {
      id: "kn-result",
      label: "최종 결과",
      value: "패소",
      caption: "2024년 10월 대법원 확정",
      claimId: "claim-final",
    },
  ],

  timeline: [
    {
      id: "ib-free",
      date: "2021-10-27",
      displayDate: "2021년 10월 27일",
      datePrecision: "day",
      title: "공익처분, 무료 통행 시작",
      summary:
        "경기도가 사업시행자 지정을 취소하는 공익처분을 내리고 정오부터 통행료를 받지 않았다.",
      claimIds: ["claim-free"],
    },
    {
      id: "ib-stay",
      date: "2021-11-15",
      displayDate: "2021년 11월 15일",
      datePrecision: "day",
      title: "법원, 집행정지 신청 인용",
      summary: "일산대교㈜가 낸 집행정지 신청을 법원이 받아들였다.",
      claimIds: ["claim-stay"],
    },
    {
      id: "ib-back",
      date: "2021-11-18",
      displayDate: "2021년 11월 18일",
      datePrecision: "day",
      title: "통행료 징수 재개",
      summary: "시스템 점검을 거쳐 0시부터 통행료를 다시 받기 시작했다.",
      claimIds: ["claim-back"],
    },
    {
      id: "ib-final",
      date: "2024-10-11",
      displayDate: "2024년 10월 11일",
      datePrecision: "day",
      title: "대법원 패소 확정",
      summary:
        "대법원이 사업시행자 지정 취소처분 취소 소송에서 원심의 원고 승소 판결을 확정했다.",
      claimIds: ["claim-final"],
    },
  ],

  graph: {
    note:
      "무엇이 무엇을 막았는지를 그렸다. 연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "gyeonggi", name: "경기도", kind: "government", isFocus: true,
        description: "공익처분으로 무료화를 시도한 쪽" },
      { id: "operator", name: "일산대교㈜", kind: "company",
        description: "다리를 운영하던 사업시행자" },
      { id: "bridge", name: "일산대교", kind: "project",
        description: "한강 다리 가운데 유일하게 통행료를 받던 곳" },
      { id: "drivers", name: "이용자", kind: "group",
        description: "22일 동안 통행료를 내지 않았다" },
      { id: "court", name: "법원", kind: "organization",
        description: "집행정지를 인용하고 최종적으로 운영사 손을 들었다" },
      { id: "disposal", name: "공익처분", kind: "project",
        description: "사업시행자 지정을 취소한 행정처분" },
    ],
    relations: [
      {
        id: "ib-r-toll",
        fromId: "operator",
        toId: "bridge",
        label: "한강 다리 중 유일하게 통행료를 받으며 운영했다.",
        startDate: "2021-10-27",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-free"],
      },
      {
        id: "ib-r-disposal",
        fromId: "gyeonggi",
        toId: "disposal",
        label: "사업시행자 지정을 취소하는 공익처분을 내렸다.",
        startDate: "2021-10-27",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-free"],
      },
      {
        id: "ib-r-free",
        fromId: "disposal",
        toId: "drivers",
        label: "10월 27일 정오부터 통행료를 받지 않았다.",
        startDate: "2021-10-27",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-free"],
      },
      {
        id: "ib-r-stay",
        fromId: "court",
        toId: "disposal",
        label: "운영사의 집행정지 신청을 받아들여 처분의 효력을 멈췄다.",
        startDate: "2021-11-15",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-stay"],
      },
      {
        id: "ib-r-final",
        fromId: "court",
        toId: "gyeonggi",
        label: "대법원이 원심을 확정하면서 경기도가 최종 패소했다.",
        startDate: "2024-10-11",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-final"],
      },
    ],
  },

  counterpoints: [
    {
      id: "ib-cp-fail",
      question: "실패한 일을 왜 업적에 넣나?",
      response:
        "성공만 골라 실으면 그건 자료가 아니라 선전물이 되고, 그 순간 다른 업적까지 믿을 수 없게 된다. 이 일은 22일 만에 되돌아갔고 3년 뒤 법정에서 최종적으로 졌다. 그 결말까지 적는 편이 이 위키를 더 쓸모 있게 만든다. 책도 결말을 스스로 밝히며 '비록 실패했다 하더라도 정책의 방향성은 옳았다'고 적는다.",
      claimIds: ["claim-back", "claim-final"],
    },
    {
      id: "ib-cp-rush",
      question: "무리한 처분이었던 것 아닌가?",
      response:
        "법원은 그렇게 판단했다. 1심은 일산대교가 2017년부터 2020년까지 당기순이익을 냈으므로 자체 사업이 어려운 상태로 보기 어렵다고 봤고, 대법원이 이를 확정했다. 다만 한강 다리 가운데 이곳만 통행료를 받고 있었다는 사정 자체는 처분과 별개로 남아 있다.",
      claimIds: ["claim-final"],
    },
    {
      id: "ib-cp-days",
      question: "무료였던 기간이 28일 아닌가?",
      response:
        "책에는 28일로 적혀 있으나 보도에 실린 두 시점으로 계산하면 22일이다. 2021년 10월 27일 정오에 시작해 11월 18일 0시에 징수가 재개됐다. 틀린 수는 출처가 책이어도 고쳐 싣는다.",
      claimIds: ["claim-free", "claim-back"],
    },
  ],

  claims: [
    {
      id: "claim-free",
      text:
        "경기도는 2021년 10월 27일 일산대교의 사업시행자 지정을 취소하는 공익처분을 내리고 같은 날 정오부터 통행료를 받지 않는 무료 통행을 시작했다. 일산대교는 한강 다리 가운데 유일하게 통행료를 받던 곳이다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-ib-2021", "src-book-67"],
      verified: true,
    },
    {
      id: "claim-stay",
      text:
        "일산대교㈜는 공익처분에 불복해 법원에 집행정지를 신청했고, 법원은 2021년 11월 15일 이를 받아들였다.",
      assertionType: "FACT",
      sourceIds: ["src-namu-ib"],
      verified: true,
    },
    {
      id: "claim-back",
      text:
        "집행정지 결정에 따라 시스템 점검을 거쳐 2021년 11월 18일 0시부터 일산대교 통행료 징수가 재개됐다. 통행료를 받지 않은 기간은 22일이다.",
      assertionType: "FACT",
      sourceIds: ["src-namu-ib"],
      verified: true,
    },
    {
      id: "claim-final",
      text:
        "대법원 1부는 2024년 10월 일산대교㈜가 경기도를 상대로 낸 사업시행자 지정 취소처분 취소 소송에서 원심의 원고 승소 판결을 확정했다. 1심은 일산대교가 2017년부터 2020년까지 당기순이익을 냈으므로 자체 사업을 하기 어려운 상태로 보기 어렵다고 판단했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-ib-2024", "src-mbc-ib-2024"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-seoul-ib-2021",
      title: "일산대교측, 무료화 불복 법적조치… 경기도·3개市 긴급 대책",
      url: "https://go.seoul.co.kr/news/newsView.php?id=20211027011012",
      publisher: "서울신문",
      publishedAt: "2021-10-27",
      type: "press",
      license: "quotable",
      quote:
        "경기도가 일산대교의 사업시행자 지정을 취소하는 공익처분을 내리고 " +
        "27일 12시부터 무료통행을 실시한다고 밝혔다.",
    },
    {
      id: "src-namu-ib",
      title: "일산대교 무료화 추진 논란",
      url: "https://namu.wiki/w/%EC%9D%BC%EC%82%B0%EB%8C%80%EA%B5%90%20%EB%AC%B4%EB%A3%8C%ED%99%94%20%EC%B6%94%EC%A7%84%20%EB%85%BC%EB%9E%80",
      publisher: "나무위키",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-ib-2024",
      title: "일산대교 무료화 결국 무산…대법, 패소 확정",
      url: "https://www.hankyung.com/article/2024101199425",
      publisher: "한국경제",
      publishedAt: "2024-10-11",
      type: "press",
      license: "quotable",
      quote:
        "대법원 1부는 주식회사 일산대교가 경기도를 상대로 제기한 사업시행자 지정 " +
        "취소처분 취소 소송에서 원심의 원고 승소 판결을 확정했다.",
    },
    {
      id: "src-mbc-ib-2024",
      title: "‘일산대교 무료화’ 무산…대법, 패소 확정",
      url: "https://imnews.imbc.com/news/2024/society/article/6645325_36438.html",
      publisher: "MBC 뉴스",
      publishedAt: "2024-10-11",
      type: "press",
      license: "quotable",
      quote:
        "1심 재판부는 2017년에서 2020년 당기순이익이 발생해 일산대교가 자체 사업하기 " +
        "어려운 상태라고 보기 어렵다고 판시했다.",
    },
    {
      id: "src-book-67",
      title: "『밍밍 잼칠라 이장님』 — 2학기 이장님 업적(경기도지사) 67",
      url: "https://wowlife.co.kr",
      publisher: "맘껏 지음 · 와우라이프",
      type: "press",
      license: "quotable",
      quote:
        "67. 일산대교 통행료 무료화 — 경기도지사로서 마지막으로 집행한 정책. " +
        "하지만 무료화가 되고 28일 만에 다시 유료화로 바뀌었어. " +
        "비록 실패했다 하더라도 정책의 방향성은 옳았다고 말하고 싶어. " +
        "(실제 무료 기간은 22일이다.)",
    },
  ],
};

export const gyeonggiIlsanBridge = achievementSchema.parse(raw);
