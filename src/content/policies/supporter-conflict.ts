import type { PolicyInput } from "./schema";

/**
 * 지지율 변화와 지지층 갈등에 대한 대통령의 입장.
 *
 * "처음과 달리 많이 변했고 초심을 잃어 지지를 거두었다"는 답글이 돈다(2026년
 * 10월, 35건). 지지를 거둔 이유는 사람마다 달라 한 문장으로 확인할 수 없다.
 * 여기에는 숫자(한국갤럽 직무 평가와 부정 평가 이유), 보도된 갈등 쟁점,
 * 대통령이 직접 한 말을 나란히 둔다.
 *
 * ★ 여론조사는 한 기관(한국갤럽)으로 시계열을 맞춘다. 기관마다 수치가 다르다.
 * ★ "변했다"·"변하지 않았다"는 둘 다 평가다. 대통령의 말은 CLAIM이 아니라
 *   "그렇게 말했다"는 FACT로 적고, 그 내용이 맞는지는 판단하지 않는다.
 * ★ 2026-10-17 처음 등록 — 잼통 Voice voice-gap 이슈 #43.
 */
export const SUPPORTER_CONFLICT: PolicyInput = {
  slug: "supporter-conflict",
  title: "지지율 변화와 지지층 갈등에 대한 대통령의 입장",
  scope:
    "2026년 한국갤럽 대통령 직무 평가 추이와 부정 평가 이유, 검찰개혁 후속 조치 등 여권 지지층 갈등 쟁점, " +
    "이에 대한 대통령의 발언",
  ministries: ["청와대"],
  categories: ["institution"],
  asOf: "2026-10-17",
  rumors: [
    {
      id: "rumor-changed",
      text: "처음과 달리 많이 변했고 초심을 잃어 지지를 거두었다",
      claimIds: ["claim-gallup-low", "claim-reasons", "claim-issues", "claim-president-1015"],
    },
  ],
  claims: [
    {
      id: "claim-gallup-high",
      text:
        "한국갤럽의 2026년 3월 10~12일 조사에서 대통령 직무 긍정 평가는 66%로 취임 뒤 가장 높았고, 부정 " +
        "평가는 24%였다.",
      assertionType: "FACT",
      sourceIds: ["src-kbmaeil-20260313"],
      verified: true,
    },
    {
      id: "claim-gallup-low",
      text:
        "같은 조사의 9월 15~17일 결과는 긍정 37%, 부정 56%로, 긍정은 4주 연속 취임 뒤 최저치를 다시 썼다. " +
        "10월 13~15일 조사에서는 긍정 39%, 부정 52%였다. 이 조사에서 민주당 지지층의 74%, 진보층의 65%가 " +
        "긍정 평가했다.",
      assertionType: "FACT",
      sourceIds: ["src-kbmaeil-20260918", "src-fnnews-20261016"],
      verified: true,
    },
    {
      id: "claim-reasons",
      text:
        "10월 13~15일 조사의 부정 평가 이유는 부동산 정책(19%), 경제·민생·주식시장 대응(12%), 국방·안보·" +
        "대북(11%) 순이었다. 9월 셋째 주에는 부동산 정책(20%), 인사(16%), 경제·민생(9%) 순이었다. 긍정 평가 " +
        "이유 1위는 외교(20%)였다.",
      assertionType: "FACT",
      sourceIds: ["src-kbmaeil-20260918", "src-fnnews-20261016"],
      verified: true,
    },
    {
      id: "claim-issues",
      text:
        "2026년 9월 여권 지지층 사이에서는 법무부의 검찰 직제안(사법통제부 신설·검사 정원 유지)이 수사지휘권 " +
        "폐지를 무력화할 수 있다는 우려가 나와 대통령이 재검토를 지시했고, 2020년 검사장 집단 성명에 이름을 " +
        "올린 김지용 중수청장 내정자에 대한 반발로 청와대가 인선을 보류했다. 민주당과 조국혁신당은 연대·통합 " +
        "방안에서 이견을 보였다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260920"],
      verified: true,
    },
    {
      id: "claim-president-0918",
      text:
        "이재명 대통령은 2026년 9월 18일 기자회견에서 \"우리는 모두 친문(친문재인)이고 친노(친노무현)이며 " +
        "친김대중이고 이재명의 동지들\"이라고 말했고, 9월 20일 X에 '대통령의 친구'라는 글을 올려 \"여러분이 " +
        "바로 이재명이고, 여러분이 바로 대통령이라고 생각하고 행동해 주시기 바란다\"고 썼다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260920"],
      verified: true,
    },
    {
      id: "claim-president-1015",
      text:
        "대통령은 2026년 10월 15일 X에서 \"지향점이 바뀌었다\"며 지지를 거둔 누리꾼의 글을 공유하고 \"참으로 " +
        "안타깝다\", \"지향점은 바뀐 게 없다\"고 답했다. 대표하는 범위가 넓어져 방법이 더 실용적이고 신중해졌을 " +
        "뿐이라고 했고, 개헌은 국회의원 200명 이상이 동의해야 해 뜻대로 할 수 없으며 연임 목적 개헌론에서 " +
        "벗어나도 된다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261015"],
      verified: true,
    },
    {
      id: "claim-president-reform",
      text:
        "같은 글에서 대통령은 개혁을 약속보다 빠르게 추진하고 있으며, 검찰의 수사권을 완전히 분리했으니 새 " +
        "체계가 제대로 작동하게 하는 것이 과제라고 했다. 미흡한 과제가 있으면 구체적으로 알려 달라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-newspim-20261015"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-gallup-low", "claim-reasons", "claim-issues"],
  timeline: [
    {
      id: "t-high",
      date: "2026-03-12",
      datePrecision: "day",
      title: "직무 긍정 66%, 취임 뒤 최고",
      summary: "한국갤럽 3월 10~12일.",
      claimIds: ["claim-gallup-high"],
    },
    {
      id: "t-low",
      date: "2026-09-17",
      datePrecision: "day",
      title: "직무 긍정 37%, 취임 뒤 최저",
      summary: "부정 이유 1위 부동산.",
      claimIds: ["claim-gallup-low", "claim-reasons"],
    },
    {
      id: "t-comrades",
      date: "2026-09-18",
      datePrecision: "day",
      title: "\"이재명의 동지들\" 기자회견",
      summary: "20일 X 글 '대통령의 친구'.",
      claimIds: ["claim-president-0918"],
    },
    {
      id: "t-reply",
      date: "2026-10-15",
      datePrecision: "day",
      title: "지지 철회 글에 \"지향점은 바뀐 게 없다\"",
      summary: "X 답글. 개헌·검찰개혁 설명.",
      claimIds: ["claim-president-1015", "claim-president-reform"],
    },
    {
      id: "t-now",
      date: "2026-10-15",
      datePrecision: "day",
      title: "직무 긍정 39%",
      summary: "한국갤럽 10월 13~15일.",
      claimIds: ["claim-gallup-low"],
    },
  ],
  gaps: [
    "지지를 거둔 사람들이 꼽는 이유를 따로 조사한 자료는 찾지 못했다. 갤럽의 부정 평가 이유는 전체 응답자 기준이다.",
    "김지용 중수청장 내정자 인선의 최종 결과와 법무부 직제안 재검토 결과는 확인하지 못했다.",
    "한국갤럽 외 다른 조사기관의 같은 기간 수치는 싣지 않았다.",
  ],
  sources: [
    {
      id: "src-kbmaeil-20260313",
      title: "이 대통령 국정 지지율, 취임 후 최고...한국갤럽 조사",
      publisher: "경북매일",
      url: "https://kbmaeil.com/article/20260313500090",
      publishedAt: "2026-03-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kbmaeil-20260918",
      title: "李 지지율 37% 또 최저…부정평가 56% '최고'",
      publisher: "경북매일",
      url: "https://kbmaeil.com/article/20260918500078",
      publishedAt: "2026-09-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261016",
      title: "李대통령 지지율 2%p 오른 39%…긍정·부정평가 함께 상승 [한국갤럽]",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610161039278590",
      publishedAt: "2026-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260920",
      title: "\"여러분이 이재명\" \"동지들\" 대통령 잇단 호소, 지지층 골 메울까",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202609202104005/",
      publishedAt: "2026-09-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20261015",
      title: "李대통령, '지지철회' 누리꾼에 \"참으로 안타까워…지향점 바뀐 것 없다\"",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261015001270",
      publishedAt: "2026-10-15",
      type: "press",
      license: "link-only",
    },
  ],
};
