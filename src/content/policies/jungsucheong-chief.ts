import type { PolicyInput } from "./schema";

/**
 * 김지용 중수청장: 임은정 감찰 지시와 국무회의 배석 논란 (2026년 10월).
 *
 * 대통령 X 글 여럿에 "중수청장 후보와 행안부 장관이 임은정을 감찰하겠다고 압박한다",
 * "쓴소리한 검사에게 감찰을 지시하는 건 앞뒤가 안 맞다", "중수청장의 국무회의 배석은 의무가
 * 아니고 정치적 중립을 흔든다", "재판받는 대통령이 수사기관을 지휘하면 본인 사건에 개입할
 * 우려가 있다"는 답글이 달렸다(잼통 Voice). 감찰은 누가 무엇을 이유로 지시했는지, 배석은
 * 언제부터 왜 시작됐는지, 대통령과 반대 측이 각각 무엇을 말했는지 적는다.
 *
 * ★ 중수청·공소청 출범 자체는 policy:prosecution-launch에 있다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #107, #110.
 */
export const JUNGSUCHEONG_CHIEF: PolicyInput = {
  slug: "jungsucheong-chief",
  title: "김지용 중수청장: 임은정 감찰 지시와 국무회의 배석 논란 (2026년 10월)",
  scope:
    "윤호중 행정안전부 장관의 임은정 광주지방중수청장 감찰 지시(10월 11~12일)와 그 근거·반응, 수사·공소기관장의 국무회의 배석의 시작과 근거, 김지용 청장 첫 배석(10월 20일) 뒤 대통령의 반박과 반대 측 주장",
  ministries: ["행정안전부", "중대범죄수사청", "청와대"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-pressure",
      text: "편 가르지 않는 수사를 말하면서, 중수청장 후보와 행안부 장관이 임은정 검사장을 수사·감찰하겠다고 압박한다",
      claimIds: ["claim-inspection", "claim-inspection-reason", "claim-lim"],
    },
    {
      id: "rumor-bitter",
      text: "쓴소리를 하는 친구가 좋은 친구라면서, 쓴소리를 한 검사에게 감찰을 지시하는 것은 앞뒤가 맞지 않는다",
      claimIds: ["claim-inspection", "claim-inspection-reason", "claim-procedure"],
    },
    {
      id: "rumor-pc",
      text: "임은정 검사장의 PC를 들여다보며 쓴소리한 사람을 잡으려 한다",
      claimIds: ["claim-procedure"],
    },
    {
      id: "rumor-seat",
      text: "행정감독과 수사지휘는 다르고 청장 국무회의 배석은 의무가 아니며, 중수청을 대통령 아래 두면 정치적 중립이 흔들린다",
      claimIds: ["claim-seat-start", "claim-president-seat", "claim-no-case-command", "claim-seat-critique"],
    },
    {
      id: "rumor-own-trial",
      text: "재판을 받는 대통령이 수사기관을 지휘감독하면 본인 사건에 개입할 우려가 있다",
      claimIds: ["claim-no-case-command", "claim-seat-critique"],
    },
  ],
  claims: [
    {
      id: "claim-lim",
      text:
        "임은정 광주지방중수청장은 김지용 초대 중수청장 후보자가 2018년 대검찰청 감찰1과장 시절 성폭력 은폐 의혹 관련 " +
        "감찰 민원을 묵살했다며 공개적으로 임명에 반대해 왔다. 중수청은 \"감찰 민원을 묵살하거나 부적정하게 처리했다는 " +
        "주장은 사실과 다르다\"고 반박했다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-1165306", "src-jsc-ytn-20261012"],
      verified: true,
    },
    {
      id: "claim-inspection",
      text:
        "감찰을 지시한 것은 윤호중 행정안전부 장관이다. 윤 장관은 10월 11일 \"임은정 청장은 중수청을 수사하는 기관이 " +
        "아니라 정치하는 기관으로 착각하고 있는 것 같다\"며 감찰 착수를 지시하겠다고 했고, 12일 중수청에 공문을 보냈다. " +
        "중수청은 같은 날 감찰담당관에게 감찰을 지시했다. 근거로는 중수청에 대한 장관의 지휘·감독권을 들었다.",
      assertionType: "FACT",
      sourceIds: ["src-jsc-fnnews-20261011", "src-weeklykhan-20261012"],
      verified: true,
    },
    {
      id: "claim-inspection-reason",
      text:
        "윤 장관은 임 청장의 공개 비판이 정치 중립 의무와 품위 유지 의무를 어겼을 소지가 있다고 보고, \"직위를 이용한 " +
        "정치 행동은 아닐지 감찰하라는 지시\"라고 설명했다. 감찰 착수만으로 직무가 정지되지는 않는다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "행정안전부",
      sourceIds: ["src-fnnews-20261012", "src-weeklykhan-20261012"],
      verified: false,
    },
    {
      id: "claim-procedure",
      text:
        "보도된 감찰 절차는 서면 질의와 증거·자료 제출 요구로 자료를 모은 뒤 징계 여부를 검토하고, 중수청→행정안전부 " +
        "장관→국무총리 소속 징계위원회를 거쳐 의결하는 순서다. 업무용 PC를 조사했다는 보도는 찾지 못했다. 임 청장은 " +
        "\"감찰 1호인 만큼 사명감을 가지고 잘 대처하겠다\"고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-koreancenter-1423815", "src-wikitree-1165306"],
      verified: true,
    },
    {
      id: "claim-seat-start",
      text:
        "검찰총장 등 수사·공소기관장은 정치적 중립을 이유로 국무회의에 나오지 않는 것이 관례였다. 행정안전부 자료상 " +
        "2000년부터 2025년 12월 이전까지 검찰총장이 국무회의에 배석한 사례는 없다. 이 대통령의 지시로 2025년 12월(보도에 " +
        "따라 '올해 초')부터 참석이 시작됐고, 김지용 중수청장은 2026년 10월 20일 처음 배석했다.",
      assertionType: "FACT",
      sourceIds: ["src-jsc-yonhap-20261020", "src-fnnews-20261021"],
      verified: true,
    },
    {
      id: "claim-president-seat",
      text:
        "대통령은 10월 21일 AI 제미나이의 답변을 인용해 배석 불가론을 \"위헌적 억지\"라고 했고, 22일에는 \"공소청이든 " +
        "기상청이든 소방청이든 모든 부처청은 대통령과 총리의 지휘감독을 받는다\"며 중수청에 대한 지휘감독 포기는 헌법과 " +
        "정부조직법 위반이라고 썼다. 공개회의 참석에서 '열외'시키는 것이 정치적 중립 확보 방안이라는 것은 \"무논리\"라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-fnnews-20261021", "src-jsc-x-1022"],
      verified: true,
    },
    {
      id: "claim-no-case-command",
      text:
        "대통령은 \"구체적 사건 수사 지휘는 하지 않겠다\"고 했고, \"검사는 대통령에게 충성할 필요도 없고, 또 그렇게 만들 " +
        "필요도 없으며 그래서도 안 된다\"고 했다. 청와대는 국무회의에서 구체적 개별 사건의 수사나 공소 지휘는 논의하지 " +
        "않는다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-fnnews-20261021", "src-jsc-yonhap-20261020"],
      verified: true,
    },
    {
      id: "claim-seat-critique",
      text:
        "참여연대는 구체적 사건 지시가 없더라도 수사·공소기관에 정치적 부담을 준다며 정례 참석 자제를 요구했다. 한동훈 " +
        "무소속 의원은 대통령이 수사·기소를 지휘하면 안 된다며 중수청을 '하수청'으로 만든다고 비판했고, 국민의힘은 " +
        "수사기관장이 대통령 발언을 받아 적고 업무 지시를 받는다고 비판했다. 법학계 일부도 배석이 수사권 독립을 실질적으로 " +
        "침해할 수 있다고 지적했다.",
      assertionType: "OPINION",
      sourceIds: ["src-jsc-yonhap-20261020", "src-fnnews-20261021"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-seat-critique"],
  timeline: [
    {
      id: "t-order",
      date: "2026-10-11",
      datePrecision: "day",
      title: "행안부 장관, 임은정 감찰 지시 예고",
      summary: "12일 공문, 중수청 감찰 착수.",
      claimIds: ["claim-inspection"],
    },
    {
      id: "t-seat",
      date: "2026-10-20",
      datePrecision: "day",
      title: "김지용 중수청장 국무회의 첫 배석",
      summary: "\"검찰개혁 완수\".",
      claimIds: ["claim-seat-start"],
    },
    {
      id: "t-gemini",
      date: "2026-10-21",
      datePrecision: "day",
      title: "대통령 \"배석 불가론은 위헌적 억지\"",
      summary: "제미나이 답변 인용, 구체 사건 지휘는 않겠다.",
      claimIds: ["claim-president-seat", "claim-no-case-command"],
    },
  ],
  gaps: [
    "임은정 청장 감찰의 결과와 징계 여부는 아직 나오지 않았다.",
    "임 청장의 업무용 PC를 들여다본다는 답글의 근거는 찾지 못했다.",
    "중수청장 국무회의 배석이 정부조직법상 의무인지에 대한 법학계의 정리된 해석은 찾지 못했다.",
    "보수 정부 때 민주당이 수사기관장의 대통령 보고·배석에 반대했다는 답글의 구체적 발언은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-wikitree-1165306",
      title: "\"안타깝고 서글픈 일\"…'중수청 1호 감찰 대상' 임은정이 직접 남긴 말",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1165306",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-jsc-ytn-20261012",
      title: "'김지용 공개 비판' 임은정, 중수청 첫 감찰 대상",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0103_202610121743286769",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-jsc-fnnews-20261011",
      title: "중수청 출범 9일만 임은정 광주청장 감찰 지시…기강 세우기 포석",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610111649472055",
      publishedAt: "2026-10-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261012",
      title: "'임은정 1호 감찰' 혼란 맞은 중수청...지휘부 갈등 '증폭'",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610121409001752",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-weeklykhan-20261012",
      title: "[속보] 중수청, 임은정 감찰 곧 착수···\"지위 이용해 영향력 행사 의심\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202610121459001",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-koreancenter-1423815",
      title: "자료 수집 후 징계 여부 검토…중수청→행안장관→총리 징계위 거쳐 의결",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1423815",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-jsc-yonhap-20261020",
      title: "국무회의 첫 참석 김지용 \"중수청 정착시켜 검찰개혁 완수할 것\"(종합)",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1427043",
      publishedAt: "2026-10-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261021",
      title: "김지용 국무회의 배석 논란…李 \"위헌적 억지\" 반박에 野 \"기가 막혀\"",
      publisher: "파이낸셜뉴스(뉴스1)",
      url: "https://www.fnnews.com/news/202610211742052904",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-jsc-x-1022",
      title: "이재명 X 글 (중수청 지휘감독)",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2113120631999041866",
      publishedAt: "2026-10-22",
      type: "interview",
      license: "quotable",
    },
  ],
};
