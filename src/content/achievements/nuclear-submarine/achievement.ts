import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 핵추진잠수함 — 한미 정상 담판에서 장보고-N까지.
 *
 * 인포그래픽에는 '핵잠수함 도입 추진'으로 적혀 있었고, 이 위키의 대통령 시기
 * 가이드(docs/achievements/president.md)는 그것을 "목표이지 결과"라며 보류로
 * 분류했다. 그 판단은 **항목 이름만 보고 내린 것**이었다. 조사해 보니 실제로
 * 일어난 일이 셋 있었다.
 *
 *   1. 2025년 10월 29일 경주 한미정상회담에서 연료 공급을 요청했다
 *   2. 2025년 11월 14일 한미 공동 팩트시트에 미국의 건조 승인이 명문화됐다
 *   3. 2026년 5월 26일 정부가 사업 기본계획(장보고-N)을 내놨다
 *
 * ★ 그래서 이 업적이 말하는 것은 '핵잠수함을 가졌다'가 아니다.
 *   **막혀 있던 문 하나가 열렸다**는 것이다. 배는 한 척도 없고, 착공은 2031년
 *   이후이며, 전력화 목표는 2030년대 후반이다. 제목과 요약과 연표가 전부
 *   이 선을 지킨다.
 *
 * ★ 가장 중요한 것이 아직 안 풀렸다.
 *   연료다. 현 한미원자력협정으로는 농축 우라늄을 우리가 만들 수도 가질 수도
 *   없다. 2026년 6월 개정 협상이 시작됐지만 타결되지 않았고, 미국 의회 동의도
 *   남아 있다. 이걸 빼고 '승인받았다'만 적으면 사실상 거짓말이 된다.
 *
 * ★ 건조 장소를 두고 두 정상의 말이 달랐다.
 *   트럼프는 트루스소셜에 "미국 필리조선소에서 건조할 예정"이라고 적었고,
 *   한국 정부는 국내 건조 방침을 유지했다. 불리해 보이는 대목이지만 결과가
 *   한국 쪽이므로 그대로 싣는다. 숨기면 그 자체가 공격거리가 된다.
 *
 * ★ 조선소는 아직 확정이 아니다.
 *   한화오션이 개념설계를 맡아 앞서 있다는 평가가 있을 뿐, 건조사 선정은
 *   끝나지 않았다. '한화오션으로 확정'이라고 적지 않는다.
 */

const raw: AchievementInput = {
  id: "nuclear-submarine",
  slug: "nuclear-submarine",
  title: "핵추진잠수함 건조 승인",
  subtitle: "40년 막혀 있던 문이 열렸다. 배는 아직 한 척도 없다",
  kicker: "외교·안보",
  summary:
    "2025년 10월 29일 경주 한미정상회담에서 이재명 대통령이 핵추진잠수함 연료 " +
    "공급을 요청했고, 11월 14일 한미 공동 팩트시트에 미국의 건조 승인이 담겼다. " +
    "2026년 5월 26일 정부는 국내에서 개발·건조한다는 기본계획을 내놨다. " +
    "다만 연료를 어떻게 확보할지는 아직 정해지지 않았고, 착공은 2031년 이후다.",
  type: "policy",
  publishStatus: "published",
  featured: true,
  sourceNote:
    "정상회담 발언과 트럼프 대통령의 승인 발표, 정부 기본계획은 보도로 " +
    "확인했습니다. 한미 공동 팩트시트와 국방부 기본계획 원문으로 대조하는 일은 " +
    "아직 남아 있습니다. 총사업비 28조 9,000억 원과 2030년대 중반 진수 일정은 " +
    "언론이 전한 정부 설명이며, 확정 예산이 아니라 사업 윤곽입니다. 건조사 " +
    "선정은 이 업적 기준일인 2026년 9월 19일까지 끝나지 않았습니다. " +
    "이 업적은 진행 중인 일이고, 연료 문제가 풀리지 않으면 뒤집힐 수 있습니다.",

  headlineKeyNumberId: "kn-approve",

  scenes: [],

  shorts: [],

  eli5: {
    intro:
      "우리나라가 원자력으로 움직이는 잠수함을 만들 수 있게 됐어요. 아직 만들지는 못했고요.",
    scenes: [
      {
        id: "e-sub-ask",
        title: "연료를 달라고 했어요",
        say: "2025년 10월 29일 경주에서 두 나라 대통령이 만났어요. 이 대통령이 '핵추진잠수함 연료를 받을 수 있게 결단해 달라'고 했어요.",
        art: "sub-ask",
        fact: { value: "2025년 10월 29일", tone: "ice" },
        claimIds: ["claim-ask"],
      },
      {
        id: "e-sub-ok",
        title: "미국이 좋다고 했어요",
        say: "다음 날 트럼프 대통령이 승인한다고 발표했고, 11월 14일 두 나라가 함께 낸 문서에도 그렇게 적혔어요.",
        art: "sub-approve",
        fact: { value: "한미 공동 팩트시트", tone: "ice" },
        claimIds: ["claim-approve"],
      },
      {
        id: "e-sub-where",
        title: "어디서 만들지 달랐어요",
        say: "트럼프 대통령은 '미국 조선소에서 만든다'고 적었어요. 그런데 우리 정부는 2026년 5월에 '한국에서 만든다'고 정했어요.",
        art: "sub-where",
        fact: { value: "국내 건조", tone: "ice" },
        claimIds: ["claim-where"],
      },
      {
        id: "e-sub-fuel",
        title: "연료는 아직이에요",
        say: "잠수함을 움직이려면 우라늄 연료가 필요한데, 지금 협정으로는 우리가 만들 수도 가질 수도 없어요. 그걸 바꾸는 이야기를 2026년 6월부터 하고 있어요.",
        art: "sub-fuel",
        claimIds: ["claim-fuel"],
      },
      {
        id: "e-sub-when",
        title: "배는 아직 없어요",
        say: "설계를 하고 있고, 짓기 시작하는 건 2031년 뒤예요. 실제로 바다에 띄우는 건 2030년대 중반, 쓰는 건 2030년대 후반이 목표예요.",
        art: "sub-years",
        fact: { value: "착공 2031년 이후", tone: "warm" },
        claimIds: ["claim-plan"],
      },
    ],
    caveat: {
      text:
        "가장 중요한 연료 문제가 아직 안 풀렸어요. 협정을 바꾸는 이야기가 진행 중이고, 미국 의회도 동의해야 해요. 그래서 '허락받았다'까지가 지금까지 일어난 일이에요.",
      claimIds: ["claim-fuel"],
    },
  },

  keyNumbers: [
    {
      id: "kn-approve",
      label: "미국의 건조 승인",
      value: "2025.11.14",
      caption: "한미 공동 팩트시트에 명문화 · 정상회담은 10월 29일 경주",
      claimId: "claim-approve",
    },
    {
      id: "kn-cost",
      label: "사업비 윤곽",
      prefix: "약",
      value: "28조 9,000",
      unit: "억 원",
      caption: "정부가 제시한 총사업비 · 확정 예산이 아니다",
      claimId: "claim-plan",
    },
    {
      id: "kn-launch",
      label: "1번함 진수 목표",
      value: "2030년대 중반",
      caption: "착공 2031년 이후 · 전력화는 2030년대 후반",
      claimId: "claim-plan",
    },
  ],

  timeline: [
    {
      id: "sub-summit",
      date: "2025-10-29",
      displayDate: "2025년 10월 29일",
      datePrecision: "day",
      title: "경주 한미정상회담",
      summary:
        "이재명 대통령이 경주 국립박물관에서 열린 회담에서 “핵추진잠수함의 연료를 우리가 공급받을 수 있도록 결단해 달라”고 요청하고 한미 원자력협정 개정을 촉구했다.",
      claimIds: ["claim-ask"],
    },
    {
      id: "sub-truth",
      date: "2025-10-30",
      displayDate: "2025년 10월 30일",
      datePrecision: "day",
      title: "트럼프 대통령, 승인 발표",
      summary:
        "회담 다음 날 트루스소셜에 한국의 핵추진잠수함 건조 승인을 밝혔다. 다만 같은 글에 “미국 필리조선소에서 건조할 예정”이라고 적었다.",
      claimIds: ["claim-approve", "claim-where"],
    },
    {
      id: "sub-fact",
      date: "2025-11-14",
      displayDate: "2025년 11월 14일",
      datePrecision: "day",
      title: "한미 공동 팩트시트",
      summary:
        "미국이 한국의 핵추진 공격잠수함 건조를 승인했고, 연료 조달 방안을 포함한 관련 요건을 긴밀히 협의하겠다는 내용이 공동 문서에 담겼다.",
      claimIds: ["claim-approve"],
    },
    {
      id: "sub-plan",
      date: "2026-05-26",
      displayDate: "2026년 5월 26일",
      datePrecision: "day",
      title: "정부 기본계획 — 장보고-N",
      summary:
        "제1회 미래국방전략위원회에서 “전력 획득·유지·정비의 자립성과 안정성을 확보하기 위해 한국에서 개발·건조하겠다”고 밝혔다. 농축도 20% 미만 저농축우라늄 기반, 총사업비 약 28조 9,000억 원, 2030년대 중반 1번함 진수가 윤곽으로 제시됐다.",
      claimIds: ["claim-where", "claim-plan"],
    },
    {
      id: "sub-talks",
      date: "2026-06-02",
      displayDate: "2026년 6월 2일",
      datePrecision: "day",
      title: "한미 원자력협정 개정 협상 개시",
      summary:
        "핵잠 연료 조달과 우라늄 농축·재처리 권한 확대를 위한 공식 협상이 시작됐다. 이 업적 기준일까지 타결되지 않았고, 미국 의회 동의도 남아 있다.",
      claimIds: ["claim-fuel"],
    },
  ],

  graph: {
    note:
      "무엇이 열렸고 무엇이 아직 잠겨 있는지를 그렸다. 연표에서 시점을 옮기면 " +
      "그때까지 성립한 관계만 남는다.",
    entities: [
      { id: "kr", name: "대한민국 정부", kind: "government", isFocus: true,
        description: "연료 공급을 요청하고 국내 건조 방침을 정한 쪽" },
      { id: "us", name: "미국", kind: "country",
        description: "건조를 승인한 쪽. 연료와 협정의 열쇠를 쥐고 있다" },
      { id: "congress", name: "미국 의회", kind: "organization",
        description: "협정 개정에 동의해야 하는 곳. 아직 남아 있다" },
      { id: "treaty", name: "한미 원자력협정", kind: "project",
        description: "농축·재처리를 제한하는 협정. 2026년 6월부터 개정 협상 중" },
      { id: "jangbogo", name: "장보고-N 사업", kind: "project",
        description: "국내 개발·건조 사업. 총사업비 약 28조 9,000억 원" },
      { id: "yard", name: "국내 조선소", kind: "company",
        description: "건조를 맡을 곳. 선정은 아직 끝나지 않았다" },
    ],
    relations: [
      {
        id: "sub-r-ask",
        fromId: "kr",
        toId: "us",
        label: "정상회담에서 핵추진잠수함 연료 공급을 요청했다.",
        startDate: "2025-10-29",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-ask"],
      },
      {
        id: "sub-r-approve",
        fromId: "us",
        toId: "kr",
        label: "핵추진 공격잠수함 건조를 승인했다.",
        startDate: "2025-11-14",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-approve"],
      },
      {
        id: "sub-r-plan",
        fromId: "kr",
        toId: "jangbogo",
        label: "국내에서 개발·건조한다는 기본계획을 내놨다.",
        startDate: "2026-05-26",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-where", "claim-plan"],
      },
      {
        id: "sub-r-yard",
        fromId: "jangbogo",
        toId: "yard",
        label: "선체 건조를 맡을 곳. 건조사 선정은 아직 끝나지 않았다.",
        startDate: "2026-05-26",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-yard"],
      },
      {
        id: "sub-r-treaty",
        fromId: "kr",
        toId: "treaty",
        label: "연료 확보를 위해 개정 협상을 시작했다. 아직 타결되지 않았다.",
        startDate: "2026-06-02",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-fuel"],
      },
      {
        id: "sub-r-congress",
        fromId: "treaty",
        toId: "congress",
        label: "개정에는 미국 의회의 동의가 필요하다.",
        startDate: "2026-06-02",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-fuel"],
      },
    ],
  },

  counterpoints: [
    {
      id: "sub-cp-have",
      question: "그래서 핵잠수함이 생긴 건가?",
      response:
        "아니다. 지금까지 일어난 일은 ‘미국이 승인했고 우리 정부가 계획을 냈다’까지다. 배는 한 척도 없고 설계 단계이며, 착공은 2031년 이후, 1번함 진수 목표가 2030년대 중반, 전력화 목표가 2030년대 후반이다. 이 위키는 발표와 시행을 나눠 적는다. 이것은 오래 막혀 있던 문이 열린 일이지 배가 생긴 일이 아니다.",
      claimIds: ["claim-approve", "claim-plan"],
    },
    {
      id: "sub-cp-fuel",
      question: "연료 없이도 지을 수 있나?",
      response:
        "핵추진잠수함은 원자로로 움직이므로 농축 우라늄이 있어야 한다. 현 한미원자력협정에서 한국은 20% 미만 농축에도 미국의 서면 동의가 필요하고, 군사용 이전은 별도 협정과 미국 의회 동의를 거쳐야 한다. 2026년 6월 개정 협상이 시작됐지만 이 업적 기준일까지 타결되지 않았다. 사업의 성패를 가를 대목이 아직 열려 있는 것이고, 이 위키는 그것을 닫힌 것처럼 적지 않는다.",
      claimIds: ["claim-fuel"],
    },
    {
      id: "sub-cp-price",
      question: "공짜로 받은 건가?",
      response:
        "아니다. 같은 팩트시트에 한국의 1,500억 달러 규모 조선 분야 투자와 2,000억 달러 규모 추가 투자가 함께 적혀 있다. 미국은 한국산 자동차·부품과 목재 제품의 232조 관세를 15%로 내렸다. 승인은 이 묶음 안에서 나온 것이므로 따로 떼어 ‘받아 냈다’고만 말하면 절반만 말하는 것이 된다. 이 투자가 실제로 어떻게 집행되는지, 그 대가가 적정했는지를 판단할 자료는 이 위키에 아직 없다.",
      claimIds: ["claim-cost"],
    },
    {
      id: "sub-cp-where",
      question: "미국에서 짓기로 한 것 아닌가?",
      response:
        "트럼프 대통령은 승인을 알리며 “한국은 바로 이곳, 미국 필리조선소에서 핵잠을 건조할 예정”이라고 적었다. 한국 정부는 2026년 5월 26일 기본계획에서 “전력 획득·유지·정비의 자립성과 안정성을 확보하기 위해” 국내에서 개발·건조한다고 밝혔다. 두 발언이 달랐다는 사실을 그대로 적는다. 기준일까지 유지되고 있는 것은 국내 건조 방침이다.",
      claimIds: ["claim-where"],
    },
  ],

  claims: [
    {
      id: "claim-ask",
      text:
        "2025년 10월 29일 경주 국립박물관에서 열린 한미정상회담에서 이재명 대통령은 “핵추진잠수함의 연료를 우리가 공급받을 수 있도록 대통령님께서 결단을 좀 해 주시면 좋겠습니다”라고 요청하고, 한미 원자력협정 개정 추진을 촉구했다.",
      assertionType: "FACT",
      sourceIds: ["src-mbc-sub"],
      verified: true,
    },
    {
      id: "claim-approve",
      text:
        "트럼프 대통령은 2025년 10월 30일 소셜미디어를 통해 한국의 핵추진잠수함 건조 승인을 밝혔고, 2025년 11월 14일 발표된 한미 공동 팩트시트에 미국이 한국의 핵추진 공격잠수함 건조를 승인하고 연료 조달 방안을 포함한 관련 요건을 긴밀히 협의한다는 내용이 담겼다.",
      assertionType: "FACT",
      sourceIds: ["src-mbc-sub", "src-hankook-sub"],
      verified: true,
    },
    {
      id: "claim-civil",
      text:
        "한미 공동 팩트시트에는 “미국은 한미 원자력 협력 협정에 부합하고, 미국의 법적 요건을 준수하는 범위 내에서 한국의 평화적 이용을 위한 민간 우라늄 농축 및 사용후핵연료 재처리로 귀결될 절차를 지지한다”는 문장이 함께 담겼다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-sub"],
      verified: true,
    },
    {
      id: "claim-cost",
      text:
        "같은 팩트시트에는 “금번 합의는 미국에 의해 승인된 한국의 1천500억 달러 규모 조선 분야 투자(승인 투자)를 포함한다”와 한국의 2천억 달러 규모 추가 투자, 그리고 한국산 자동차·부품과 목재 제품에 대한 232조 관세를 15%로 인하한다는 내용이 함께 담겼다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-sub"],
      verified: true,
    },
    {
      id: "claim-where",
      text:
        "트럼프 대통령은 2025년 10월 30일 트루스소셜에 “한국은 바로 이곳, 미국 필리조선소에서 핵잠을 건조할 예정”이라고 적었으나, 한국 정부는 2026년 5월 26일 기본계획에서 “전력 획득·유지·정비의 자립성과 안정성을 확보하기 위해 한국에서 핵잠을 개발·건조하겠다”고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-sub"],
      verified: true,
    },
    {
      id: "claim-plan",
      text:
        "정부는 2026년 5월 26일 제1회 미래국방전략위원회에서 핵추진잠수함 사업(장보고-N)을 공식화했다. 농축도 20% 미만 저농축우라늄 기반, 국내 건조, 2030년대 중반 1번함 진수, 총사업비 약 28조 9,000억 원이 윤곽으로 제시됐다. 건조계약은 2029~2030년, 착공은 2031년 이후, 전력화 목표는 2030년대 후반이다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-sub", "src-dealsite-sub", "src-etoday-sub"],
      verified: true,
    },
    {
      id: "claim-fuel",
      text:
        "핵추진잠수함 연료 확보를 위한 한미 원자력협정 개정 공식 협상이 2026년 6월 2~3일 시작됐다. 현 협정에서 한국은 20% 미만 우라늄 농축에도 미국의 서면 동의가 필요하며, 핵연료 이전에는 별도 협정 체결과 미국 의회 동의가 필요하다. 2026년 9월 19일 기준 협상은 타결되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-sub", "src-khan-sub"],
      verified: true,
    },
    {
      id: "claim-yard",
      text:
        "한화오션이 국방과학연구소 주관 한국형 원자력추진잠수함 개념설계 계약을 맺어 선체 건조에서 앞서 있다는 평가가 나오지만, 건조사 선정은 2026년 9월 19일 기준 끝나지 않았고 HD현대중공업과의 수주 경쟁이 진행 중이다.",
      assertionType: "FACT",
      sourceIds: ["src-dealsite-sub", "src-etoday-sub"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-mbc-sub",
      title: "트럼프 “한국 핵추진 잠수함 건조 승인”",
      url: "https://imnews.imbc.com/news/2025/politics/article/6770369_36711.html",
      publisher: "MBC 뉴스",
      publishedAt: "2025-10-30",
      type: "press",
      license: "quotable",
      quote:
        "핵추진잠수함의 연료를 우리가 공급받을 수 있도록 대통령님께서 결단을 좀 " +
        "해 주시면 좋겠습니다 (이재명 대통령) / 트럼프 대통령은 한국이 핵추진잠수함 " +
        "능력을 필요로 한다는 데 공감을 표하면서 후속 협의를 해 나가자고 제안했다",
    },
    {
      id: "src-khan-sub",
      title: "“핵추진잠수함 건조 장소는 한국”…한·미 추가 논의 없어도 될까",
      url: "https://www.khan.co.kr/article/202605261835001/",
      publisher: "경향신문",
      publishedAt: "2026-05-26",
      type: "press",
      license: "quotable",
      quote:
        "전력 획득·유지·정비의 자립성과 안정성을 확보하기 위해 한국에서 핵잠을 " +
        "개발·건조하겠다 (정부 기본계획) / 트럼프 대통령은 2025년 10월 30일 " +
        "트루스소셜에 “한국은 바로 이곳, 미국 필리조선소에서 핵잠을 건조할 " +
        "예정”이라고 밝혔다",
    },
    {
      id: "src-newspim-sub",
      title: "한·미, 핵잠수함·농축·재처리 권한 확대 위한 공식협상 시작",
      url: "https://www.newspim.com/news/view/20260602000815",
      publisher: "뉴스핌",
      publishedAt: "2026-06-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dealsite-sub",
      title: "한화오션 ‘핵잠 선두’의 역설…연료 확보는 미지수",
      url: "https://dealsite.co.kr/articles/163447",
      publisher: "딜사이트",
      type: "press",
      license: "quotable",
      quote:
        "정부는 장보고-N 사업을 공식화하면서 농축도 20% 미만 저농축우라늄(LEU) " +
        "기반, 국내 건조, 2030년대 중반 1번함 진수, 총사업비 약 28조9000억원의 " +
        "윤곽을 제시했다",
    },
    {
      id: "src-etoday-sub",
      title: "핵잠수함 시대 열렸다…HD현대·한화오션 수주전 촉각",
      url: "https://www.etoday.co.kr/news/view/2588232",
      publisher: "이투데이",
      publishedAt: "2026-05-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankook-sub",
      title: "[전문] 한미, 팩트시트 확정…핵추진 잠수함 건조 추진·주요품목 일괄관세 15%",
      url: "https://www.hankookilbo.com/News/Read/Amp/A2025111411120005157",
      publisher: "한국일보",
      publishedAt: "2025-11-14",
      type: "official",
      license: "quotable",
      quote:
        "미국은 한국이 핵추진 잠수함을 건조하는 것을 승인하였다. 미국은 이 조선 " +
        "사업의 요건들을 진전시키기 위해, 연료 조달 방안을 포함하여, 한국과 " +
        "긴밀히 협력해 나갈 것이다. / 미국은 한미 원자력 협력 협정에 부합하고, " +
        "미국의 법적 요건을 준수하는 범위 내에서 한국의 평화적 이용을 위한 민간 " +
        "우라늄 농축 및 사용후핵연료 재처리로 귀결될 절차를 지지한다. / 금번 " +
        "합의는 미국에 의해 승인된 한국의 1천500억 달러 규모 조선 분야 투자를 " +
        "포함한다 (한미 공동 팩트시트 전문)",
    },
  ],
};

export const nuclearSubmarine = achievementSchema.parse(raw);
