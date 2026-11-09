import type { PolicyInput } from "./schema";

/**
 * 브런슨 주한미군사령관(유엔군사령관 겸임) 발언 논란과 정부 대응 (2026년 5월·10월).
 *
 * 11월 초 대통령 X 게시물 답글에 "주한미군사령관 브런슨의 국내 활동을 문제 삼아 추방을 검토해 달라"는 요청이
 * 달렸다(잼통 Voice). 무슨 발언이 문제가 됐고 정부·국회가 어떻게 반응했는지 적는다.
 *
 * ★ 전시작전권 전환과 SCM 연기에 관한 브런슨 사령관 발언은 policy:opcon-transfer에 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #268.
 */
export const BRUNSON_REMARKS: PolicyInput = {
  slug: "brunson-remarks",
  title: "브런슨 주한미군사령관 발언 논란과 정부 입장 (2026년)",
  scope:
    "제이비어 브런슨 주한미군사령관의 '한국은 중국을 겨눈 단검'(5월)·'대한민국은 남쪽 철책선에서 시작'(10월) 발언, 국방부·청와대·국회의 반응",
  ministries: ["국방부", "외교부", "청와대"],
  categories: ["diplomacy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-expel",
      text: "주한미군사령관 브런슨의 국내 활동을 문제 삼아 추방을 검토해 달라",
      claimIds: ["claim-dmz", "claim-mnd", "claim-us", "claim-assembly"],
    },
  ],
  claims: [
    {
      id: "claim-dagger",
      text:
        "브런슨 사령관은 2026년 5월 샹그릴라 대화 무렵 한국을 '중국을 겨누는 단검'에 빗댄 발언으로 논란이 되자 \"작전환경을 설명한 것\"이라고 해명했다. " +
        "청와대는 \"한미 간에는 제반 현안에 대해 각급에서 소통해오고 있다\"고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260530", "src-segye-20260531"],
      verified: true,
    },
    {
      id: "claim-dmz",
      text:
        "10월 14일 워싱턴 싱크탱크 세미나에서 브런슨 사령관은 유엔군사령부 관점에서 대한민국은 비무장지대 남쪽 철책선에서 시작한다는 취지로 말했다. " +
        "정전협정상 유엔사의 DMZ 관리 책임을 설명하다 나온 말이라는 해석이 있다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20261017", "src-newstomato-1317102"],
      verified: true,
    },
    {
      id: "claim-mnd",
      text:
        "국방부는 이 발언을 \"유엔군사령관 개인의 견해\"로 규정하고 대한민국 영토주권에 대한 입장은 확고하다고 밝혔다. 유엔사는 \"대한민국의 주권에는 의문의 여지가 없다\"며 " +
        "DMZ 내 정전협정상 책임을 설명한 것이라고 진화했다.",
      assertionType: "FACT",
      sourceIds: ["src-koreancenter-1426186", "src-newstomato-1317226"],
      verified: true,
    },
    {
      id: "claim-us",
      text: "국방부는 미국 측과 소통했고, 미국 측은 한국의 우려에 \"공감한다\"는 입장을 밝힌 것으로 알려졌다.",
      assertionType: "CLAIM",
      assertedBy: "국방부(보도)",
      sourceIds: ["src-sbsbiz-20000340805"],
      verified: true,
    },
    {
      id: "claim-assembly",
      text:
        "국정감사에서 민주당 김병주·박선원 의원 등은 발언 철회와 사과를 요구했고, 진성준 국방위원장은 영토를 한반도와 부속 도서로 정한 헌법 제3조와 배치된다고 지적했다. " +
        "김현정 의원은 경질을 요구했다. 김규하 육군참모총장은 발언에 \"동의하지 못한다\"고 답했다. 보도된 반응 가운데 추방을 요구하거나 검토한 사례는 없었다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20261017", "src-newstomato-1317226", "src-supple-brunson"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-assembly"],
  timeline: [
    {
      id: "t-dagger",
      date: "2026-05-30",
      datePrecision: "day",
      title: "'단검' 발언 해명",
      summary: "청와대 \"각급에서 소통\".",
      claimIds: ["claim-dagger"],
    },
    {
      id: "t-dmz",
      date: "2026-10-14",
      datePrecision: "day",
      title: "'남쪽 철책선' 발언",
      summary: "워싱턴 세미나.",
      claimIds: ["claim-dmz"],
    },
    {
      id: "t-response",
      date: "2026-10-17",
      datePrecision: "day",
      title: "국방부 \"개인 견해\", 국회 사과 요구",
      summary: "유엔사·미측 진화.",
      claimIds: ["claim-mnd", "claim-us", "claim-assembly"],
    },
  ],
  gaps: [
    "브런슨 사령관 본인이 10월 발언을 철회하거나 사과했는지는 11월 9일까지 보도에서 확인되지 않았다.",
    "정부가 주한미군사령관의 교체·추방을 미국에 요구하거나 검토했다는 자료는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-newsis-20260530",
      title: "주한美사령관, '韓은 中겨눈 단검' 발언 논란에 \"작전환경 설명한 것…지역의 관점 변화\"(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260530_0003650254",
      publishedAt: "2026-05-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20260531",
      title: "靑 \"美와 소통\" 사실상 유감 표명",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20260531507962",
      publishedAt: "2026-05-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-weeklykhan-20261017",
      title: "김병주 \"주한미군사령관 '남쪽 철책선' 발언 선 넘어···사과해야\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202610171911001",
      publishedAt: "2026-10-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-1317102",
      title: "\"한국은 DMZ 이남부터\" 파장…여 내부 \"브런슨, 선 넘었다\"",
      publisher: "뉴스토마토",
      url: "https://newstomato.com/ReadNews.aspx?no=1317102",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-1317226",
      title: "국감장 뒤덮은 'DMZ 이남' 발언…여당도 \"브런슨, 사과하라\"",
      publisher: "뉴스토마토",
      url: "https://newstomato.com/ReadNews.aspx?no=1317226",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-koreancenter-1426186",
      title: "유엔군사령관 발언 파장 계속…국방부 \"대한민국 영토주권 입장은 확고\" 강조",
      publisher: "코리안센터",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1426186",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20000340805",
      title: "브런슨 '韓 영토' 발언 관련…美 \"韓에 공감\" 입장 표명",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000340805",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-supple-brunson",
      title: "與김병주 \"주한미군 사령관, 대한민국 영토주권 침해 사과해야\"(종합)",
      publisher: "서플",
      url: "https://supple.kr/news/cmvc9dpz00018yxiwgfguf9xt",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
  ],
};
