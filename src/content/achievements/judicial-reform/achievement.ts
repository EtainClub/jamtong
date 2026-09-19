import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 사법개혁 3법 — 판결을 다시 볼 길을 늘린다.
 *
 * 인포그래픽에는 '대법관 증원', '법왜곡죄 도입', '재판소원 도입'이 따로 적혀
 * 있지만 셋은 한 묶음으로 처리됐고 한 논지를 이룬다. 확정된 판결을 다시 볼
 * 길이 사실상 없다는 문제에 세 방향으로 손을 댔다 — 대법원이 더 많이 볼 수
 * 있게(증원), 헌재가 다시 볼 수 있게(재판소원), 법을 왜곡하면 처벌받게(법왜곡죄).
 *
 * ★ 시행 시점이 셋 다 다르다.
 *   법왜곡죄와 재판소원은 2026년 3월 12일 공포 즉시 시행됐고, 대법관 증원은
 *   2028년 3월부터 3년에 걸쳐 진행된다. "사법개혁 3법이 시행됐다"고 한 줄로
 *   적으면 틀린다. 시행과 예정을 한 칸에 세지 않는다.
 *
 * ★ 반대가 컸다.
 *   야당은 표결에 참여하지 않았고, 법조계는 세 법 모두에 문제를 제기했다.
 *   시행 첫날 법왜곡죄 1호 고발 대상이 현직 대법원장이었다는 사실도 그대로
 *   적는다. 이런 것을 빼면 나머지 근거까지 의심받는다.
 *
 * ★ 법은 국회가 만든다.
 *   대통령의 단독 성과로 적지 않는다.
 */

const raw: AchievementInput = {
  id: "judicial-reform",
  slug: "judicial-reform",
  title: "사법개혁 3법",
  subtitle: "판결을 다시 볼 길을 세 방향으로 늘렸다",
  kicker: "주요 정책",
  category: "institution",
  summary:
    "법왜곡죄, 재판소원, 대법관 증원 세 법이 2026년 2월 말 차례로 국회를 지나 " +
    "3월 12일 공포됐다. 법왜곡죄와 재판소원은 그날 바로 시행됐고, 대법관 증원은 " +
    "2028년 3월부터 3년에 걸쳐 14명을 26명으로 늘린다. 셋 다 확정된 판결을 " +
    "다시 볼 길을 늘리는 쪽을 향한다.",
  type: "policy",
  publishStatus: "published",
  sourceNote:
    "공포일과 시행일, 증원 일정과 형량은 보도로 확인했습니다. 법률 원문(형법·" +
    "헌법재판소법·법원조직법 개정안)으로 대조하는 일은 아직 남아 있습니다. " +
    "이 업적은 2026년 9월 19일 기준이며, 시행 이후 재판소원과 법왜곡죄가 실제로 " +
    "어떻게 운용되고 있는지에 대한 통계는 확인하지 못했습니다.",

  headlineKeyNumberId: "kn-justices",

  scenes: [
    {
      id: "bench",
      kind: "quantity-track",
      heading: "대법관이 늘어나는 일정",
      lede:
        "법은 이미 정해졌고 늘어나는 것은 2028년부터입니다. 스크롤하면 그 일정을 지나갑니다.",
      claimIds: ["claim-bench"],
      track: {
        label: "대법관 수",
        unit: "명",
        direction: "up",
        max: 26,
        note:
          "2026년 3월 12일 공포된 법원조직법 개정안이 정한 일정이다. 2028년 3월부터 " +
          "3년에 걸쳐 매년 4명씩 늘린다. 2028년 이후의 수는 법이 정한 계획이지 " +
          "이미 일어난 일이 아니다.",
        checkpoints: [
          {
            id: "jr-now",
            displayDate: "2026년 3월 12일",
            title: "법이 공포된 날, 14명",
            amount: 14,
            caption:
              "대법관 증원법이 공포됐습니다. 다만 늘어나는 것은 2028년부터입니다.",
            art: "jr-bench",
            claimId: "claim-bench",
          },
          {
            id: "jr-2028",
            displayDate: "2028년",
            title: "첫 4명",
            amount: 18,
            caption: "2028년 3월부터 증원이 시작됩니다.",
            art: "jr-bench",
            claimId: "claim-bench",
          },
          {
            id: "jr-2029",
            displayDate: "2029년",
            title: "두 번째 4명",
            amount: 22,
            caption: "해마다 네 명씩 늘어납니다.",
            art: "jr-bench",
            claimId: "claim-bench",
          },
          {
            id: "jr-2030",
            displayDate: "2030년",
            title: "26명",
            amount: 26,
            caption:
              "3년에 걸쳐 열두 명이 늘어 26명이 됩니다. 대법원이 한 해에 볼 수 있는 사건이 늘어난다는 것이 이 법의 취지입니다.",
            art: "jr-bench",
            claimId: "claim-bench",
          },
        ],
      },
    },
  ],

  shorts: [],

  eli5: {
    intro:
      "재판에서 졌는데 억울하면 어디로 갈까요? 그 길을 늘린 이야기예요.",
    scenes: [
      {
        id: "e-jr-final",
        title: "대법원이 마지막이었어요",
        say: "재판은 세 번까지 받을 수 있어요. 대법원에서 끝나면 그걸로 끝이에요. 억울해도 더 갈 데가 없었어요.",
        art: "jr-final",
        fact: { value: "여기서 끝", tone: "warm" },
        claimIds: ["claim-appeal"],
      },
      {
        id: "e-jr-court",
        title: "헌법재판소에도 갈 수 있게 했어요",
        say: "2026년 3월부터는 법원 재판도 헌법재판소가 다시 볼 수 있어요. 헌법에 어긋나지 않았는지 따져 보는 거예요.",
        art: "jr-constitution",
        fact: { value: "2026년 3월 12일", tone: "ice" },
        claimIds: ["claim-appeal"],
      },
      {
        id: "e-jr-distort",
        title: "법을 비틀면 벌을 받아요",
        say: "판사나 검사가 일부러 법을 잘못 적용하거나 증거를 조작하면 처벌해요. 10년 이하 징역이에요.",
        art: "jr-distort",
        fact: { value: "10년 이하", tone: "ice" },
        claimIds: ["claim-distort"],
      },
      {
        id: "e-jr-bench",
        title: "대법관을 늘리기로 했어요",
        say: "지금은 14명인데 26명까지 늘려요. 사람이 많아지면 한 해에 볼 수 있는 사건도 늘어나요. 다만 늘어나는 건 2028년부터예요.",
        art: "jr-bench",
        fact: { value: "14 → 26명", tone: "ice" },
        claimIds: ["claim-bench"],
      },
      {
        id: "e-jr-three",
        title: "셋이 같은 곳을 봐요",
        say: "더 많이 보게 하고, 다시 보게 하고, 비틀면 벌하고. 방향은 하나예요 — 판결을 한 번 더 들여다볼 수 있게 하는 거예요.",
        art: "jr-three",
        fact: { value: "세 법", tone: "ice" },
        claimIds: ["claim-pass"],
      },
    ],
    caveat: {
      text:
        "반대도 컸어요. 판사와 검사가 위축된다, 재판이 더 길어진다, 대법관을 대통령이 너무 많이 임명하게 된다는 걱정이에요. 시행 첫날 법왜곡죄로 처음 고발된 사람이 대법원장이었어요.",
      claimIds: ["claim-criticism"],
    },
  },

  keyNumbers: [
    {
      id: "kn-justices",
      label: "대법관 수",
      value: "14 → 26",
      unit: "명",
      caption: "2028년 3월부터 3년간 매년 4명씩",
      claimId: "claim-bench",
    },
    {
      id: "kn-effective",
      label: "법왜곡죄·재판소원 시행",
      value: "2026. 3. 12.",
      caption: "공포 즉시 시행",
      claimId: "claim-pass",
    },
    {
      id: "kn-penalty",
      label: "법왜곡죄 형량",
      value: "10",
      unit: "년 이하",
      caption: "징역 10년 이하 · 자격정지 10년 이하",
      claimId: "claim-distort",
    },
  ],

  timeline: [
    {
      id: "jr-pass",
      date: "2026-02-28",
      displayDate: "2026년 2월 28일",
      datePrecision: "day",
      title: "대법관 증원법 국회 통과",
      summary:
        "법원조직법 개정안이 본회의를 통과하며 사법개혁 3법이 모두 국회를 지났다.",
      claimIds: ["claim-pass"],
    },
    {
      id: "jr-promulgate",
      date: "2026-03-12",
      displayDate: "2026년 3월 12일",
      datePrecision: "day",
      title: "세 법 공포, 둘은 즉시 시행",
      summary:
        "형법(법왜곡죄)·헌법재판소법(재판소원)·법원조직법(대법관 증원)이 공포됐다. 앞의 둘은 그날 시행됐다.",
      claimIds: ["claim-pass", "claim-appeal", "claim-distort"],
    },
    {
      id: "jr-firstcase",
      date: "2026-03-12",
      displayDate: "2026년 3월 12일",
      datePrecision: "day",
      title: "시행 첫날의 1호 사건",
      summary:
        "법왜곡죄 1호 고발 대상은 조희대 대법원장이었고, 재판소원 1호는 시리아인 강제퇴거 사건이었다.",
      claimIds: ["claim-criticism"],
    },
    {
      id: "jr-support",
      date: "2026-05-20",
      displayDate: "2026년 5월 20일",
      datePrecision: "day",
      title: "대법원, 법관 변호사비 지원 확대",
      summary:
        "법왜곡죄 고소·고발에 대응해 법관에게 변호사비를 최대 7,000만 원까지 지원하기로 했다.",
      claimIds: ["claim-criticism"],
    },
    {
      id: "jr-bench-start",
      date: "2028-03",
      displayDate: "2028년 3월",
      datePrecision: "month",
      title: "대법관 증원 시작 예정",
      summary: "3년에 걸쳐 매년 4명씩 늘려 26명이 된다. 아직 오지 않은 일정이다.",
      claimIds: ["claim-bench"],
    },
  ],

  graph: {
    note:
      "확정된 판결을 다시 볼 길이 어디로 났는지를 그렸다. " +
      "연표에서 시점을 옮기면 그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "assembly", name: "국회", kind: "government", isFocus: true,
        description: "세 법을 통과시킨 곳" },
      { id: "supreme", name: "대법원", kind: "organization",
        description: "대법관 14명. 2030년까지 26명으로" },
      { id: "constitutional", name: "헌법재판소", kind: "organization",
        description: "재판소원으로 법원 재판의 위헌성을 판단하게 됐다" },
      { id: "judges", name: "판사·검사", kind: "group",
        description: "법왜곡죄의 적용 대상" },
      { id: "parties", name: "재판 당사자", kind: "group",
        description: "다시 볼 길을 얻은 쪽" },
      { id: "opposition", name: "야당·법조계", kind: "group",
        description: "표결에 참여하지 않았고 세 법 모두에 문제를 제기했다" },
    ],
    relations: [
      {
        id: "jr-r-end",
        fromId: "supreme",
        toId: "parties",
        label: "대법원에서 끝나면 확정된 판결을 다시 볼 길이 사실상 없었다.",
        startDate: "2026-02-28",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-appeal"],
      },
      {
        id: "jr-r-pass",
        fromId: "assembly",
        toId: "constitutional",
        label: "재판소원을 도입해 법원 재판을 헌법소원 대상에 넣었다.",
        startDate: "2026-03-12",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-appeal"],
      },
      {
        id: "jr-r-review",
        fromId: "constitutional",
        toId: "parties",
        label: "대법원 판결의 위헌 여부까지 판단할 수 있게 됐다.",
        startDate: "2026-03-12",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-appeal"],
      },
      {
        id: "jr-r-distort",
        fromId: "assembly",
        toId: "judges",
        label: "법을 왜곡하면 10년 이하의 징역에 처하도록 했다.",
        startDate: "2026-03-12",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-distort"],
      },
      {
        id: "jr-r-bench",
        fromId: "assembly",
        toId: "supreme",
        label: "2028년부터 3년에 걸쳐 대법관을 14명에서 26명으로 늘리기로 했다.",
        startDate: "2028-03",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-bench"],
      },
      {
        id: "jr-r-oppose",
        fromId: "opposition",
        toId: "assembly",
        label: "표결에 참여하지 않았고 위헌성과 부작용을 들어 반대했다.",
        startDate: "2026-02-28",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-criticism"],
      },
    ],
  },

  counterpoints: [
    {
      id: "jr-cp-chill",
      question: "판사와 검사가 위축되지 않나?",
      response:
        "그 지적이 가장 크게 제기됐다. 법왜곡죄의 구성요건이 추상적이어서 판단이 갈릴 수 있고, 고소·고발이 늘면 직무가 위축된다는 것이다. 실제로 시행 첫날 1호 고발 대상이 조희대 대법원장이었고, 대법원은 2026년 5월 법왜곡죄 고소·고발에 대응해 법관 변호사비를 최대 7,000만 원까지 지원하기로 했다. 다만 법은 '위법·부당하게 이익을 주거나 권익을 해할 목적'이라는 고의를 요건으로 둔다. 어느 쪽이 옳은지는 운용을 더 봐야 알 수 있고, 이 위키는 아직 그 통계를 갖고 있지 않다.",
      claimIds: ["claim-distort", "claim-criticism"],
    },
    {
      id: "jr-cp-fourth",
      question: "재판소원은 사실상 4심제 아닌가?",
      response:
        "분쟁이 길어지고 헌법재판소 업무가 넘친다는 비판이 있었다. 재판소원은 사건을 다시 심리하는 것이 아니라 재판의 위헌성을 판단하는 제도이지만, 실제로 얼마나 청구되고 얼마나 인용되는지에 따라 효과가 달라진다. 시행 첫 사건은 시리아인 강제퇴거 건이었다. 시행 이후의 청구·인용 통계는 확인하지 못했다.",
      claimIds: ["claim-appeal", "claim-criticism"],
    },
    {
      id: "jr-cp-appoint",
      question: "대통령이 대법관을 너무 많이 임명하게 되는 것 아닌가?",
      response:
        "사법부 독립성 우려로 제기된 지적이다. 증원이 3년에 걸쳐 진행되면서 임명 기회가 늘어나는 것은 사실이다. 다만 증원은 2028년 3월에야 시작되고, 이 위키의 기준일인 2026년 9월 19일 시점에는 대법관 수가 14명 그대로다. 정해진 것과 일어난 것을 섞어 적지 않는다.",
      claimIds: ["claim-bench", "claim-criticism"],
    },
  ],

  claims: [
    {
      id: "claim-pass",
      text:
        "국회는 2026년 2월 법왜곡죄(형법)·재판소원(헌법재판소법)·대법관 증원(법원조직법) 개정안을 차례로 통과시켰고, 2월 28일 본회의에서 대법관 증원법을 의결하며 사법개혁 3법이 모두 국회를 지났다. 세 법은 2026년 3월 12일 공포됐다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-jr-2026", "src-nate-jr-2026"],
      verified: true,
    },
    {
      id: "claim-appeal",
      text:
        "재판소원제는 법원의 재판을 헌법소원심판 청구 대상에 포함해, 헌법재판소가 대법원 판결을 포함한 법원 재판의 위헌 여부를 판단할 수 있게 한 제도다. 2026년 3월 12일 공포와 동시에 시행됐으며 민사·행정 소송까지 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-jr-2026"],
      verified: true,
    },
    {
      id: "claim-distort",
      text:
        "법왜곡죄는 형사사건에 관여하는 판사와 검사 등이 타인에게 위법·부당하게 이익을 주거나 권익을 해할 목적으로 재판·수사 중인 사건에서 법을 왜곡하면 10년 이하의 징역과 10년 이하의 자격정지에 처하도록 한 규정이다. 2026년 3월 12일 공포와 동시에 시행됐다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-jr-2026"],
      verified: true,
    },
    {
      id: "claim-bench",
      text:
        "대법관 증원법은 대법관 수를 현행 14명에서 26명으로 늘리는 내용이다. 2028년 3월부터 3년에 걸쳐 매년 4명씩 증원한다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-jr-2026", "src-nate-jr-2026"],
      verified: true,
    },
    {
      id: "claim-criticism",
      text:
        "세 법에는 각각 비판이 제기됐다. 법왜곡죄에는 판·검사의 직무 위축과 실체적 진실 규명 저해 우려가, 재판소원에는 분쟁 장기화와 헌재 업무 과부하 우려가, 대법관 증원에는 하급심 부실화와 사법부 독립성 우려가 따랐다. 시행 첫날 법왜곡죄 1호 고발 대상은 조희대 대법원장이었고 재판소원 1호 사건은 시리아인 강제퇴거 건이었다. 대법원은 2026년 5월 법왜곡죄 고소·고발에 대응해 법관에게 변호사비를 최대 7,000만 원까지 지원하기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-jr-2026", "src-mbc-jr-2026", "src-seoul-jr-2026"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-newspim-jr-2026",
      title: "[사법 3법 시행] ① 법왜곡죄·재판소원·대법관 증원, 무엇이 달라지나",
      url: "https://www.newspim.com/news/view/20260312000312",
      publisher: "뉴스핌",
      publishedAt: "2026-03-12",
      type: "press",
      license: "quotable",
      quote:
        "재판소원제와 법왜곡죄는 공포 즉시 시행됐고 대법관 증원은 2028년 3월부터 " +
        "3년에 걸쳐 하게 된다. 법왜곡죄는 10년 이하의 징역과 10년 이하의 자격정지에 " +
        "처한다. 대법관은 현재 14명에서 26명으로 늘어난다.",
    },
    {
      id: "src-nate-jr-2026",
      title: "‘대법관 증원법’도 국회 통과…사법개혁 3법 완성",
      url: "https://m.news.nate.com/view/20260301n14144",
      publisher: "네이트 뉴스",
      publishedAt: "2026-03-01",
      type: "press",
      license: "quotable",
      quote:
        "국회는 지난달 28일 저녁 본회의를 열고 법원조직법 개정안(대법관 증원법)을 " +
        "의결했다. 대법관 수를 3년간 매년 4명씩 순차적으로 늘려 26명으로 증원한다.",
    },
    {
      id: "src-mbc-jr-2026",
      title: "사법개혁 첫날…‘법왜곡죄’ 1호 고발은 조희대",
      url: "https://imnews.imbc.com/replay/2026/nwtoday/article/6807079_37012.html",
      publisher: "MBC 뉴스",
      publishedAt: "2026-03-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-jr-2026",
      title: "‘법왜곡죄 고소·고발’ 법관 지원 확대… 대법원, 변호사비 최대 7000만원 지원",
      url: "https://www.seoul.co.kr/news/society/2026/05/20/20260520500040",
      publisher: "서울신문",
      publishedAt: "2026-05-20",
      type: "press",
      license: "quotable",
      quote:
        "대법원은 법왜곡죄 고소·고발에 대응해 법관에게 변호사비를 최대 7,000만 원까지 " +
        "지원하기로 했다.",
    },
  ],
};

export const judicialReform = achievementSchema.parse(raw);
