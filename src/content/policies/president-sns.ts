import type { PolicyInput } from "./schema";

/**
 * 대통령의 SNS 소통: 게시 빈도, 대통령이 밝힌 이유, 논란이 된 인용.
 *
 * 10월 대통령 X 글 여럿에 "하루 종일 SNS만 하니 국정은 언제 하나", "SNS 댓글은 지지자에게만
 * 닿는다", "AI(제미나이) 답변을 인용하다니", "펨코 글을 인용했다", "정책 조정은 정부가 근거를
 * 갖춰 발표하라", "뜻을 글 끝에 밝혀 달라"는 답글이 달렸다(잼통 Voice). 얼마나 자주 올리는지,
 * 대통령과 청와대가 이유를 뭐라고 했는지, 논란이 된 인용이 무엇이었는지 적는다.
 *
 * ★ 지지층 갈등은 policy:supporter-conflict, 국정홍보 체계는 policy:government-communication에 있다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #92.
 * ★ 2026-11-09 보충 — 이슈 #245(심리 상태 주장), #222(유튜브 조회수·좋아요 조작 주장), #232(댓글 삭제 주장):
 *   11월 5일 유튜브 '대통령의 Y' 첫 방송과 그에 대한 팩트체크·청와대 설명.
 */
export const PRESIDENT_SNS: PolicyInput = {
  slug: "president-sns",
  title: "대통령의 SNS 소통: 게시 빈도, 밝힌 이유, 논란이 된 인용",
  scope:
    "2026년 8~10월 이재명 대통령 X 게시 건수, 대통령·청와대가 밝힌 SNS 소통의 이유, 제미나이 답변 인용(10월 21일)과 에펨코리아 글 공유(10월 28일)를 둘러싼 논란, 글의 뜻을 스스로 풀어 쓴 사례, 11월 유튜브 '대통령의 Y' 개설과 조회수 조작 주장 팩트체크",
  ministries: ["청와대"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-all-day",
      text: "대통령이 하루 종일 SNS에 글을 올리고 댓글마다 대응하니 국정은 언제 하나",
      claimIds: ["claim-count", "claim-reason", "claim-cheongwadae"],
    },
    {
      id: "rumor-reduce",
      text: "SNS에 글 올리는 일을 줄이고 국정에 집중해야 한다",
      claimIds: ["claim-count", "claim-reason", "claim-critique"],
    },
    {
      id: "rumor-echo",
      text: "SNS 댓글은 주로 지지자에게 닿아 의견 수렴 창구로 한계가 있고, 공개 자리에서 사람을 나무라는 모습도 보기 좋지 않다",
      claimIds: ["claim-reason", "claim-critique"],
    },
    {
      id: "rumor-gemini",
      text: "국정 논쟁에서 AI(제미나이) 답변을 인용하는 것은 한심하다",
      claimIds: ["claim-gemini", "claim-gemini-reply", "claim-gemini-critique"],
    },
    {
      id: "rumor-fmkorea",
      text: "대통령이 여성혐오·극우 성향으로 알려진 커뮤니티 펨코의 글을 인용했다",
      claimIds: ["claim-fmkorea", "claim-fmkorea-reply"],
    },
    {
      id: "rumor-policy-process",
      text: "대통령 글이 매번 해석 논란과 진영 다툼을 부르니, 정책 조정은 근거를 갖춘 뒤 정부가 신중히 발표해야 한다",
      claimIds: ["claim-fmkorea", "claim-critique"],
    },
    {
      id: "rumor-intent",
      text: "글로 소통하면 오해가 생기니 '칭찬입니다', '보완을 권유합니다'처럼 뜻을 끝에 밝혀 달라",
      claimIds: ["claim-clarify"],
    },
    {
      id: "rumor-mental",
      text: "측근 말처럼 대통령의 심리 상태가 불안정하고, 최근 SNS 글이 그 징후다",
      claimIds: ["claim-y-launch", "claim-y-remarks", "claim-y-cheongwadae"],
    },
    {
      id: "rumor-views",
      text: "조회수보다 좋아요와 댓글이 훨씬 많으니 댓글과 좋아요를 사서 부풀린 것이다",
      claimIds: ["claim-y-views"],
    },
    {
      id: "rumor-delete",
      text: "선거 조작에 해명하지 않고 독재자처럼 댓글을 지운다",
      claimIds: ["claim-y-comments"],
    },
  ],
  claims: [
    {
      id: "claim-count",
      text:
        "아이뉴스24 집계로 대통령의 X 게시물은 2026년 8월 37건(참모 건의로 줄였던 시기), 9월 116건, 10월 1~11일 63건" +
        "(하루 평균 5.7건)이었다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-20261012"],
      verified: true,
    },
    {
      id: "claim-reason",
      text:
        "대통령은 10월 10일 밤 X에 \"품격없다, 권위없다 비난하겠지만 경호를 최소화한 뒷골목 삶의 현장 방문도, SNS " +
        "소통도, 그분들의 언어로 교감하는 일도 계속할 것\"이라고 썼다. 10월 29일 「뒷골목에도 사람이 삽니다」에서는 " +
        "SNS 속 국민과의 직접 소통을 대표공복이 포기하면 안 될 책무라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-wikitree-20261011", "src-sns-x-1029"],
      verified: true,
    },
    {
      id: "claim-cheongwadae",
      text:
        "청와대 관계자는 국정 지지도가 하락한 것도 사실이라며 SNS 활동이 일부 오해를 낳지만 대통령이 상황을 절박하게 " +
        "보는 측면이 있다고 설명했다. 성기홍 홍보소통수석은 대통령이 지향하는 것이 단순한 'SNS 정치'가 아니라 " +
        "국민과의 거리를 좁히는 대화라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "청와대",
      sourceIds: ["src-inews24-20261012"],
      verified: true,
    },
    {
      id: "claim-gemini",
      text:
        "대통령은 10월 21일 X에 '제미나이에게 물어봤습니다'라는 글을 올려, 김지용 중수청장의 국무회의 배석이 " +
        "문제없다는 AI 제미나이의 답변을 공개했다. 답변은 배석 불가론을 \"헌법과 정부조직법상 대통령의 행정감독권을 " +
        "부정하는 궤변\"이라고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20261021", "src-koreancenter-1428274"],
      verified: true,
    },
    {
      id: "claim-gemini-reply",
      text:
        "대통령은 이튿날 \"몰라서 제미나이를 인용한 것이 아니라 그 주장이 얼마나 초보적 논리와 팩트에 어긋나고 " +
        "수준낮은 것인지를 느꺼보라고 한 것\"이라고 썼다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-sns-x-1022"],
      verified: true,
    },
    {
      id: "claim-gemini-critique",
      text:
        "국민의힘 박충권 수석대변인은 \"국정운영의 정당성의 근거를 AI로부터 그 답을 얻는다는 게 말이 됩니까\"라고 " +
        "했고, 국민의힘 의원들은 같은 질문에 제미나이가 다른 답을 내놓았다며 AI가 질문자의 입맛에 맞춘다고 비판했다.",
      assertionType: "OPINION",
      sourceIds: ["src-ytn-20261021"],
      verified: true,
    },
    {
      id: "claim-fmkorea",
      text:
        "대통령은 10월 28일 서울형 안심 산후조리원 입실 순위에서 다문화가족 산모가 국가유공자와 같은 2순위인 점을 " +
        "문제 삼은 온라인 커뮤니티 에펨코리아의 글을 X에 공유하며 \"좋은 지적 감사\"하다고 쓰고, 다문화가족 우대 " +
        "제도를 검토하겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-koreancenter-1431203", "src-sns-wikitree-1028"],
      verified: true,
    },
    {
      id: "claim-fmkorea-reply",
      text:
        "같은 날 「극단적 진영주의는 경계해야」에서 대통령은 \"대통령을 지지하던 반대하던 모두가 대한민국의 주권자 " +
        "국민이고, 누가 하던 좋은 지적은 좋은 지적\"이라고 썼다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-x-20261028"],
      verified: true,
    },
    {
      id: "claim-clarify",
      text:
        "대통령은 글이 오해를 사면 뒤에 뜻을 풀어 쓰기도 했다. 10월 28일 농지조사 글에서는 장관 이름을 밝힌 것이 " +
        "'칭찬 삼아' 한 말이었다고 했고, 같은 날 검찰개혁 답글은 \"오해가 해소되었기를 바랍니다\"로 끝냈다.",
      assertionType: "FACT",
      sourceIds: ["src-x-20261028-farm", "src-x-20261028-extreme"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "정치권 관계자들은 SNS 활용의 부작용과 정치적 부담이 만만치 않다고 지적했고, 진영 내 갈등이 대통령의 입을 " +
        "통해 퍼진다는 우려도 나왔다.",
      assertionType: "OPINION",
      sourceIds: ["src-inews24-20261012", "src-metro-20261012"],
      verified: false,
    },
    {
      id: "claim-y-launch",
      text:
        "청와대는 2026년 11월 5일 밤 대통령 유튜브 대담 프로그램 '대통령의 Y' 첫 회를 공개했다. 한 회 30분 안팎으로 2~3주 간격으로 이어갈 예정이다.",
      assertionType: "FACT",
      sourceIds: ["src-imbc-6863304", "src-fnnews-20261105"],
      verified: true,
    },
    {
      id: "claim-y-remarks",
      text:
        "대통령은 첫 방송에서 SNS 과다 사용 지적에 \"논란이 나쁜 게 아니다\"라고 했고, 알고리즘에 갇혔다는 김어준 씨의 지적에는 욕도 비난도 다 본다며 갇히지 않았다고 반박했다. " +
        "하루 6시간 정도 잔다고 했고, 평정심을 잃을까 걱정하는 것 같지만 전혀 아니라고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261105-y", "src-news1-6344839"],
      verified: true,
    },
    {
      id: "claim-y-cheongwadae",
      text: "청와대 관계자는 대통령의 SNS 활동이 늘어난 데 대해 현 상황을 절박하게 보는 측면이 있다고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "청와대 관계자",
      sourceIds: ["src-imbc-6856382"],
      verified: true,
    },
    {
      id: "claim-y-views",
      text:
        "첫 방송 공개 직후 '조회수 3,700회에 좋아요 2만 개' 같은 화면을 근거로 매크로 조작 주장이 돌았다. 주간경향 팩트체크는 유튜브가 조회수와 좋아요를 서로 다른 검증 과정을 거쳐 집계해 " +
        "일시적으로 이런 차이가 날 수 있다며 조작 주장을 '거짓'으로 판정했다. 몇 시간 뒤 조회수는 16만 회로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20261106"],
      verified: true,
    },
    {
      id: "claim-y-comments",
      text:
        "대통령은 욕설과 비난 댓글도 모두 읽는다고 했고, 청와대 홍보소통수석은 국민 댓글에 직접 답변도 하겠다고 밝혔다. 첫 방송 댓글을 분석한 보도에서는 지지 반응 69.3%(9,929건), 비판 6.9%(994건)였다.",
      assertionType: "FACT",
      sourceIds: ["src-imbc-6863304", "src-sidae-20261106"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-gemini-critique", "claim-critique"],
  timeline: [
    {
      id: "t-sept",
      date: "2026-09",
      datePrecision: "month",
      title: "X 게시 116건",
      summary: "8월의 3배 이상.",
      claimIds: ["claim-count"],
    },
    {
      id: "t-1010",
      date: "2026-10-10",
      datePrecision: "day",
      title: "\"SNS 소통 계속할 것\"",
      summary: "현장 방문과 함께.",
      claimIds: ["claim-reason"],
    },
    {
      id: "t-gemini",
      date: "2026-10-21",
      datePrecision: "day",
      title: "제미나이 답변 인용",
      summary: "중수청장 국무회의 배석 논란.",
      claimIds: ["claim-gemini", "claim-gemini-critique"],
    },
    {
      id: "t-fmkorea",
      date: "2026-10-28",
      datePrecision: "day",
      title: "에펨코리아 글 공유",
      summary: "다문화 우대 제도 검토 언급.",
      claimIds: ["claim-fmkorea", "claim-fmkorea-reply"],
    },
  ],
  gaps: [
    "답글이 말한 '대통령 심리 상태가 불안정하다'는 측근 발언은 공개 보도에서 찾지 못했다.",
    "'대통령의 Y' 채널이 댓글을 삭제·차단하는 운영 기준은 공개되지 않았고, 삭제 사례를 다룬 보도도 찾지 못했다. 부정선거 주장 자체는 policy:ballot-shortage-2026에 있다.",
    "대통령의 블루스카이 등 다른 SNS 계정 개설 계획은 찾지 못했다.",
    "10월 12일 이후의 월별 게시 건수는 집계된 보도를 찾지 못했다.",
    "SNS 의견이 실제 정책 결정에 어떻게 반영되는지 청와대의 절차 설명은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-imbc-6863304",
      title: "대통령 유튜브 오늘 첫선‥'언론 불만' 직접 돌파?",
      publisher: "MBC",
      url: "https://imnews.imbc.com/replay/2026/nwtoday/article/6863304_37012.html",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261105",
      title: "李, SNS 논란에도 '유튜브 소통 확대'…'대통령의 Y' 첫 방송",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202611052017104938",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20261105-y",
      title: "\"언론·정치·권력이 나를 공격했지만…국민과 직접 소통 덕에 지금 이 자리\"",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202611052205005/",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-6344839",
      title: "李대통령 \"논란 나쁜 것 아냐…'SNS 왜하냐?', 사람 왜 만나냐는 얘기\"",
      publisher: "뉴스1",
      url: "https://www.news1.kr/politics/president/6344839",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-imbc-6856382",
      title: "靑 \"활발해진 이 대통령 SNS, 현 상황 절박하게 보는 측면\"",
      publisher: "MBC",
      url: "https://imnews.imbc.com/news/2026/politics/article/6856382_36911.html",
      publishedAt: "2026-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-weeklykhan-20261106",
      title: "첫방 '대통령의 Y'···'매크로 조작' 주장은 '거짓'",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202611061053001",
      publishedAt: "2026-11-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sidae-20261106",
      title: "이 대통령 유튜브, 댓글 70% 지지에도…\"마이너스\" 우려 왜",
      publisher: "시대일보",
      url: "https://www.sidae.com/article/2026110615121712743",
      publishedAt: "2026-11-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-inews24-20261012",
      title: "거침없는 李 'SNS 정치'…'개혁 주도권' 확보 포석[여의뷰]",
      publisher: "아이뉴스24",
      url: "https://www.inews24.com/view/2013876",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-wikitree-20261011",
      title: "이 대통령 \"품격·권위 없다 비난해도 SNS 소통 계속할 것\"",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1165207",
      publishedAt: "2026-10-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sns-x-1029",
      title: "뒷골목에도 사람이 삽니다",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2115658725759566233",
      publishedAt: "2026-10-29",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-ytn-20261021",
      title: "'제미나이 답변' 인용에 맹공...\"깃털처럼 가벼워\" \"중수청은 하수청\"",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202610211835192297",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-koreancenter-1428274",
      title: "\"헌법 어기며 지휘감독 말라는 것인가, 밀실에서 지휘감독 하라는 것인가\"",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1428274",
      publishedAt: "2026-10-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sns-x-1022",
      title: "이재명 X 글 (중수청 지휘감독)",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2113120631999041866",
      publishedAt: "2026-10-22",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-koreancenter-1431203",
      title: "다문화산모 우대 비판한 보수성향 '에펨코리아' 글 공유…\"좋은 지적 감사\"",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1431203",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sns-wikitree-1028",
      title: "민심 좋아질 수 있을까…이 대통령이 \"폐지 필요한지 검토하겠다\"고 밝힌 내용",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1169961",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-x-20261028",
      title: "극단적 진영주의는 경계해야",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2115365589984358837",
      publishedAt: "2026-10-28",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-x-20261028-farm",
      title: "\"짜장면 좋다는 건 짬뽕 폄훼\" 시대가 도래하고 있습니다",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2115215294881018252",
      publishedAt: "2026-10-28",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-x-20261028-extreme",
      title: "무책임한 극단주의",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2115101548695154815",
      publishedAt: "2026-10-28",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-metro-20261012",
      title: "'거침없이 SNS 업로드' 이 대통령… 진영 내 갈등 표출 우려도",
      publisher: "메트로신문",
      url: "https://www.metroseoul.co.kr/article/20261012500542",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
  ],
};
