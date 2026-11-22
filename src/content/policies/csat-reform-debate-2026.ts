import type { PolicyInput } from "./schema";

/**
 * AI 부정행위 뒤 수능 평가 방식 개편 논의 (2026년 11월).
 *
 * 대통령 X 게시물 답글에 "AI 부정을 막으려면 논술형 시험이나 대학별 본고사 도입처럼 입시 평가 방식 자체를 바꿔야
 * 한다"는 주장이 달렸다(잼통 Voice #305). 국가교육위원회의 기존 논의와 각 단체 입장을 적는다.
 *
 * ★ 11월 22일 기준 정부가 수능 개편을 결정한 것은 없다. '논의'다.
 * ★ 2026-11-22 처음 등록 — 잼통 Voice 이슈 #305.
 */
export const CSAT_REFORM_DEBATE_2026: PolicyInput = {
  slug: "csat-reform-debate-2026",
  title: "AI 부정행위 뒤 수능 개편 논의 (2026년)",
  scope: "국가교육위원회의 수능 절대평가·서논술형 검토, 숙의 결과, AI 부정행위 뒤 다시 나온 개편·자격고사·폐지 주장과 우려",
  ministries: ["국가교육위원회", "교육부"],
  categories: ["institution"],
  asOf: "2026-11-22",
  rumors: [
    {
      id: "rumor-reform",
      text: "AI 부정을 막으려면 논술형 시험이나 대학별 본고사 도입처럼 입시 평가 방식 자체를 바꿔야 한다",
      claimIds: ["claim-nec-plan", "claim-deliberation", "claim-proposals", "claim-concern"],
    },
  ],
  claims: [
    {
      id: "claim-nec-plan",
      text:
        "국가교육위원회는 AI 부정행위 사태 전부터 수능 절대평가 전환과 서·논술형 문항 도입을 검토해 왔다. 이를 담을 국가교육발전계획 " +
        "시안 발표는 당초 10월 말에서 연말로 미뤄졌다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2651320-reform"],
      verified: true,
    },
    {
      id: "claim-deliberation",
      text: "국교위의 국민참여 숙의에서 서·논술형 문항 도입 찬성은 55.5%였다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2651320-reform"],
      verified: true,
    },
    {
      id: "claim-proposals",
      text:
        "AI 부정행위 뒤 개편 주장이 다시 커졌다. 전교조는 \"감독교사의 주의력에 의존하는 방식으로는 부정행위 문제를 근본적으로 " +
        "해결할 수 없다\"며 수능을 대입 자격고사로 바꾸자고 했다. 교총은 \"학생의 사고력과 문제 해결 과정, 지식의 활용 능력을 " +
        "충실히 평가하도록\" 바꿔야 한다고 했다. 서울시교육감은 2040년까지 수능을 폐지하자고 제안했다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2651320-reform"],
      verified: true,
    },
    {
      id: "claim-concern",
      text: "평가의 무게가 대학별 시험으로 옮겨 가면 사교육 수요가 늘 수 있다는 반대 의견도 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2651320-reform"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-concern"],
  timeline: [],
  gaps: [
    "대학별 본고사 부활을 정부나 국교위가 검토한다는 자료는 찾지 못했다.",
    "서·논술형 채점의 공정성 확보 방안과 도입 시점은 공식 발표되지 않았다.",
  ],
  sources: [
    {
      id: "src-etoday-2651320-reform",
      title: "수능 개편론 확산⋯서·논술형 도입 넘어 폐지론까지 [AI커닝 후폭풍]",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2651320",
      publishedAt: "2026-11-22",
      type: "press",
      license: "link-only",
    },
  ],
};
