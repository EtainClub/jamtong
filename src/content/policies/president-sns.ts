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
 */
export const PRESIDENT_SNS: PolicyInput = {
  slug: "president-sns",
  title: "대통령의 SNS 소통: 게시 빈도, 밝힌 이유, 논란이 된 인용",
  scope:
    "2026년 8~10월 이재명 대통령 X 게시 건수, 대통령·청와대가 밝힌 SNS 소통의 이유, 제미나이 답변 인용(10월 21일)과 에펨코리아 글 공유(10월 28일)를 둘러싼 논란, 글의 뜻을 스스로 풀어 쓴 사례",
  ministries: ["청와대"],
  categories: ["institution"],
  asOf: "2026-10-30",
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
    "대통령의 블루스카이 등 다른 SNS 계정 개설 계획은 찾지 못했다.",
    "10월 12일 이후의 월별 게시 건수는 집계된 보도를 찾지 못했다.",
    "SNS 의견이 실제 정책 결정에 어떻게 반영되는지 청와대의 절차 설명은 찾지 못했다.",
  ],
  sources: [
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
