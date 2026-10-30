import type { PolicyInput } from "./schema";

/**
 * 대법관 재제청 갈등과 조희대 대법원장 탄핵 논의 (2026년 8~10월).
 *
 * 대통령 X 글(10월 16·22일) 답글에 "대법원장 임명·탄핵 논란처럼 사법부를 압박해 삼권분립을
 * 무너뜨린다", "대법원장을 탄핵해 사법부를 장악하고 본인 재판의 공소를 취소하려 한다"는 말이
 * 달렸다(잼통 Voice). 대통령과 대법원장이 무엇으로 맞섰는지, 탄핵은 누가 추진하는지,
 * 대법관 증원은 어떻게 정해졌는지 적는다.
 *
 * ★ 사법개혁 3법은 업적 judicial-reform, 대통령 재판 중단은 policy:trial-suspension에 있다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #93.
 */
export const CHIEF_JUSTICE_CONFLICT: PolicyInput = {
  slug: "chief-justice-conflict",
  title: "대법관 재제청 갈등과 조희대 대법원장 탄핵 논의 (2026년 8~10월)",
  scope:
    "대법관 후임 제청 반려와 재제청 요구, 조희대 대법원장의 사법부 독립 발언, 2026년 10월 민주당·조국혁신당의 탄핵 논의와 요건, 대법관 증원법의 내용과 비판",
  ministries: ["청와대", "국회"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-separation",
      text: "대법원장 임명·탄핵 논란처럼 사법부를 압박해 민주주의를 지키는 삼권분립을 무너뜨리고 있다",
      claimIds: ["claim-reject", "claim-court-day", "claim-impeach-who", "claim-expert"],
    },
    {
      id: "rumor-capture",
      text: "대법원장을 탄핵해 사법부까지 장악하고 본인 재판의 공소를 취소하려는 독재로 가고 있다",
      claimIds: ["claim-impeach-who", "claim-impeach-grounds", "claim-requirement", "claim-justices"],
    },
  ],
  claims: [
    {
      id: "claim-reject",
      text:
        "헌법상 대법관은 대법원장의 제청으로 국회 동의를 얻어 대통령이 임명한다. 조희대 대법원장이 노태악 전 대법관 " +
        "후임으로 손봉기 대구지법 부장판사를 제청하자, 이재명 대통령은 2026년 8월 28일 제청을 반려하고 다른 후보의 " +
        "재제청을 요청했다. 청와대는 9월 11일 대법관 공석이 길어져 국민의 재판받을 권리가 침해된다며 대법관후보" +
        "추천위원회 추천을 존중해 재제청을 서둘러 달라고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20260911"],
      verified: true,
    },
    {
      id: "claim-court-day",
      text:
        "조 대법원장은 같은 날 법원의 날 기념식에서 \"법원이 다른 국가 기관과 정치권력, 사회권력 등으로부터 부당한 " +
        "간섭·영향을 받지 않아야 법치주의를 실현할 수 있다\"고 했다.",
      assertionType: "CLAIM",
      assertedBy: "조희대 대법원장",
      sourceIds: ["src-weeklykhan-20260911"],
      verified: true,
    },
    {
      id: "claim-impeach-who",
      text:
        "탄핵을 꺼낸 것은 여당과 조국혁신당이다. 김민석 민주당 대표는 10월 7일 자진 사퇴를 요구한 뒤 16일 탄핵을 " +
        "직접 언급했다. 조 대법원장이 6일 대법원 국정감사에서 증인 선서를 거부하고, 격려금 지급 해명이 감사원장 " +
        "답변과 어긋난 일이 공세의 계기가 됐다. 이 페이지가 확인한 보도에는 대통령이나 청와대의 탄핵 관련 입장이 " +
        "없다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261018"],
      verified: true,
    },
    {
      id: "claim-impeach-grounds",
      text:
        "조국혁신당은 10월 19일 탄핵소추안을 공개했다. 사유로 2025년 이재명 당시 후보의 공직선거법 사건 파기환송 " +
        "과정의 정치적 중립 의무 위반, 대법관 재제청 거부에 따른 신속한 재판을 받을 권리 침해, 격려금·업무추진비 " +
        "집행 의혹을 들었다.",
      assertionType: "CLAIM",
      assertedBy: "조국혁신당",
      sourceIds: ["src-yonhap-20261019"],
      verified: true,
    },
    {
      id: "claim-requirement",
      text:
        "대법원장 탄핵소추는 재적의원 과반수 찬성으로 의결되고, 의결서가 송달되면 헌법재판소 결정 때까지 권한 " +
        "행사가 정지된다. 민주당 의석(161석)만으로 의결할 수 있다. 조 대법원장의 임기는 2027년 6월까지다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261018"],
      verified: true,
    },
    {
      id: "claim-justices",
      text:
        "대법관 수를 14명에서 26명으로 늘리는 법원조직법 개정안이 2026년 2월 28일 국회를 통과해 3월 12일 공포됐다. " +
        "2028년 3월부터 해마다 4명씩 3년간 12명을 늘린다. 이 대통령 임기 안에 대법관 26명 가운데 22명을 임명하게 " +
        "된다는 전망이 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-1944057", "src-heraldk-20260311"],
      verified: true,
    },
    {
      id: "claim-expert",
      text:
        "일부 헌법학자들은 대법관 재제청 거부나 파기환송 판결을 헌법·법률 위반으로 보기 어렵다고 했고, 국민의힘은 " +
        "탄핵 추진을 사법부 독립을 겨냥한 정치적 압박이라고 규정했다. 대법관 증원을 두고는 하급심을 늘리지 않고 " +
        "대법관만 늘리면 재판 지연이 풀리지 않는다는 비판이 법조계에서 나왔다.",
      assertionType: "OPINION",
      sourceIds: ["src-koreancenter-1426179", "src-heraldk-20260311"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-expert"],
  timeline: [
    {
      id: "t-pass",
      date: "2026-02-28",
      datePrecision: "day",
      title: "대법관 증원법 국회 통과",
      summary: "14명→26명, 2028년부터 단계적.",
      claimIds: ["claim-justices"],
    },
    {
      id: "t-reject",
      date: "2026-08-28",
      datePrecision: "day",
      title: "대통령, 대법관 제청 반려",
      summary: "재제청 요청.",
      claimIds: ["claim-reject"],
    },
    {
      id: "t-court-day",
      date: "2026-09-11",
      datePrecision: "day",
      title: "대법원장 '부당한 간섭' 발언, 청와대 재제청 촉구",
      summary: "같은 날.",
      claimIds: ["claim-court-day", "claim-reject"],
    },
    {
      id: "t-impeach-talk",
      date: "2026-10-16",
      datePrecision: "day",
      title: "민주당 대표 탄핵 언급",
      summary: "7일 사퇴 요구에서 수위를 높였다.",
      claimIds: ["claim-impeach-who"],
    },
    {
      id: "t-rebuild",
      date: "2026-10-19",
      datePrecision: "day",
      title: "조국혁신당 탄핵소추안 공개",
      summary: "중립 의무 위반 등 세 가지 사유.",
      claimIds: ["claim-impeach-grounds"],
    },
  ],
  gaps: [
    "탄핵에 대한 이재명 대통령이나 청와대의 공식 입장은 찾지 못했다.",
    "대통령 재판의 '공소취소'를 정부나 여당이 추진한다는 공식 발표는 찾지 못했다. 한 정치평론가가 여당이 탄핵이나 '공소취소 특검' 가운데 하나를 추진할 것이라 전망한 보도만 있다.",
    "대법관 제청 반려의 이유를 청와대가 공개적으로 설명한 자료는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-weeklykhan-20260911",
      title: "조희대 \"법원 정치권력 부당한 간섭 안돼\" VS 청와대 \"대법관 후보 재제청 서둘러라\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202609112311001",
      publishedAt: "2026-09-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261018",
      title: "與 '조희대 탄핵' 꺼내자 野 \"밀어붙여 보라\"…정국 또 탄핵 공방",
      publisher: "파이낸셜뉴스(뉴스1)",
      url: "https://www.fnnews.com/news/202610180630406255",
      publishedAt: "2026-10-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-yonhap-20261019",
      title: "혁신당, 曺대법원장 탄핵안 공개…\"국민의 명령이자 정치 의무\"",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1426429",
      publishedAt: "2026-10-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-inews24-1944057",
      title: "與 '사법개혁 3법' 마침표…대법관증원법 본회의 통과",
      publisher: "아이뉴스24",
      url: "https://www.inews24.com/view/1944057",
      publishedAt: "2026-02-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20260311",
      title: "대법관 12명 증원…현 정권서 22명 임명",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026031118230731900",
      publishedAt: "2026-03-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-koreancenter-1426179",
      title: "여권 의석만으로 대법원장 탄핵소추 가능…심판 때까지 권한정지",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1426179",
      publishedAt: "2026-10-17",
      type: "press",
      license: "link-only",
    },
  ],
};
