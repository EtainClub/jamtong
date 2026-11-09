import type { PolicyInput } from "./schema";

/**
 * 온라인 댓글 '접속 국가 표시'와 인터넷 실명제 논의.
 *
 * 대통령 유튜브 영상 답글 세 건에 "온라인 댓글에 국적 표기와 실명제를 하루빨리 도입하자"는 제안이 달렸다(잼통 Voice).
 * 국회에 발의된 '댓글 국적(접속 국가) 표기법'의 내용과 처리 상황, 쟁점을 적는다.
 *
 * ★ 인터넷 실명제(제한적 본인확인제)는 2012년 헌법재판소에서 위헌 결정을 받았다. 이 페이지는 확인된 출처가 있는 접속 국가 표시 법안을 중심으로 적는다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #227.
 */
export const COMMENT_NATIONALITY_LABEL: PolicyInput = {
  slug: "comment-nationality-label",
  title: "온라인 댓글 '접속 국가 표시' 법안과 쟁점",
  scope:
    "2026년 1월 발의된 정보통신망법 개정안(대형 포털 댓글 작성자 접속 국가 표시 의무화)과 앞선 유사 법안들, 여야 입장, 국회 검토에서 나온 표현의 자유·차별·실효성 쟁점",
  ministries: ["국회", "과학기술정보통신부"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-nationality",
      text: "온라인 댓글에 국적 표기와 실명제를 하루빨리 도입하자",
      claimIds: ["claim-bill", "claim-pending", "claim-issues"],
    },
  ],
  claims: [
    {
      id: "claim-bill",
      text:
        "국민의힘 박충권 의원은 2026년 1월 30일 네이버·다음·네이트 등 일정 규모 이상 정보통신서비스 제공자가 게시판·댓글 작성자의 접속 국가를 다른 이용자가 볼 수 있게 표시하도록 의무화하는 정보통신망법 개정안을 대표발의했다. " +
        "외국인이 내국인을 사칭해 국내 여론에 개입한다는 의혹을 근거로 들었다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260130", "src-lawtimes-215506"],
      verified: true,
    },
    {
      id: "claim-pending",
      text:
        "비슷한 법안은 2023년 김기현 의원, 2025년 나경원 의원 등이 냈고 2026년 1월 김장겸 의원 안도 과학기술정보방송통신위원회에 계류 중이다. 2026년 8월까지 국회를 통과한 안은 없다. " +
        "국민의힘 장동혁 대표가 도입을 거듭 촉구했고, 민주당은 혐중 정서를 부추긴다며 반대했다.",
      assertionType: "FACT",
      sourceIds: ["src-newdaily-20260813", "src-nate-20260131"],
      verified: true,
    },
    {
      id: "claim-issues",
      text:
        "앞선 국회 논의에서는 표현의 자유 침해 가능성, 외국인 이용자 차별 소지, 실효성과 기술적 한계가 지적돼 법안이 통과되지 못했다. 과방위 수석전문위원은 VPN 등으로 우회 접속한 이용자의 실제 국가를 실시간으로 가려내기 어렵다고 검토했다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260131"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-issues"],
  timeline: [
    {
      id: "t-bill",
      date: "2026-01-30",
      datePrecision: "day",
      title: "댓글 접속 국가 표시법 발의",
      summary: "박충권 의원.",
      claimIds: ["claim-bill"],
    },
  ],
  gaps: [
    "접속 국가 표시 법안에 대한 정부(과기정통부·방미통위)의 공식 의견은 찾지 못했다.",
    "실명제(본인확인제) 재도입 법안이 22대 국회에 발의됐는지는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-mt-20260130",
      title: "\"외국인이 내국인으로 가장해 댓글\"…박충권, '댓글 국적 표기법' 발의",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/politics/2026/01/30/2026013015522648258",
      publishedAt: "2026-01-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-lawtimes-215506",
      title: "온라인 댓글에 '접속 국가' 표시 추진…박충권 의원, 법안 발의",
      publisher: "법률신문",
      url: "https://www.lawtimes.co.kr/news/215506",
      publishedAt: "2026-01-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260131",
      title: "외국인 여론조작 막는다지만…'댓글 국적 표기제' 또 논란 예고",
      publisher: "네이트 뉴스",
      url: "https://m.news.nate.com/view/20260131n02111",
      publishedAt: "2026-01-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newdaily-20260813",
      title: "음모론이라더니 사실로 드러난 외국發 여론공작 … 野, '댓글 국적제' 드라이브",
      publisher: "뉴데일리",
      url: "https://www.newdaily.co.kr/site/data/html/2026/08/13/2026081300110.html",
      publishedAt: "2026-08-13",
      type: "press",
      license: "link-only",
    },
  ],
};
