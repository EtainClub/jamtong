import type { PolicyInput } from "./schema";

/**
 * 국민제안의 검토 절차와 '국민제안 정책화 시스템'(2026년 7월).
 *
 * 대통령 X 글(10월 10일) 답글에 "국민제안의 '공감 30개' 문턱은 지인 동원을 부르니 공감 수가
 * 아니라 내용으로 검토해 달라"는 요청이 달렸다(잼통 Voice). 국민신문고 국민제안이 지금 어떻게
 * 처리되는지, 7월에 연 재검토 시스템이 무엇을 기준으로 고르는지 확인된 만큼 적는다.
 *
 * ★ '공감 30개' 기준은 공식 자료나 보도에서 찾지 못했다(gaps). 이 페이지는 그 기준이
 *   있다고도 없다고도 단정하지 않는다.
 * ★ 국민신문고 민원 처리 일반은 policy:petition-handling에 있다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #89.
 */
export const NATIONAL_PROPOSAL: PolicyInput = {
  slug: "national-proposal",
  title: "국민제안의 검토 절차와 '국민제안 정책화 시스템'(2026년 7월)",
  scope:
    "국민신문고 국민제안의 채택률, 2026년 7월 국민권익위원회가 연 불채택 제안 재검토 시스템의 선정 방식과 절차",
  ministries: ["국민권익위원회", "청와대"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-threshold",
      text: "국민제안의 '공감 30개' 문턱은 지인 동원을 부르니 공감 수가 아니라 내용으로 검토해 달라",
      claimIds: ["claim-rejected", "claim-system", "claim-selection"],
    },
  ],
  claims: [
    {
      id: "claim-rejected",
      text:
        "2025년 국민신문고에 접수된 국민제안 7만 8,588건 가운데 7만 1,681건(91.2%)이 채택되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20260729"],
      verified: true,
    },
    {
      id: "claim-system",
      text:
        "국민권익위원회는 2026년 7월 29일 채택되지 않은 국민제안을 다시 검토해 정책으로 만드는 과정을 공개하는 " +
        "'국민제안 정책화 시스템'(가칭)을 열었다. 청와대 누리집 '국민과 함께' 메뉴에서도 들어갈 수 있다. 대통령이 " +
        "\"민원은 보물창고\"라고 당부한 뒤 만들어졌다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20260729", "src-sedaily-20260729"],
      verified: true,
    },
    {
      id: "claim-selection",
      text:
        "보도된 절차는 권익위와 심의위원회가 불채택 제안 가운데 대상을 발굴하고, 공청회와 정책화 추진 회의를 거쳐 " +
        "제도 개선으로 잇는 방식이다. 공식 발표에는 공감 수로 제안을 거르는 기준이 나오지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20260729", "src-ajunews-20260729"],
      verified: true,
    },
    {
      id: "claim-survey",
      text:
        "권익위가 2026년 4~5월 국민생각함에서 1,812명에게 물은 설문에서 85.2%는 채택되지 않은 제안도 국민이 공감하고 " +
        "전문가와 다듬으면 다시 정책이 될 수 있다고 답했고, 30.6%는 행정적 이유로 충분히 검토되지 못한 점이 가장 " +
        "아쉬웠다고 답했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20260729"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-rejected"],
  timeline: [
    {
      id: "t-open",
      date: "2026-07-29",
      datePrecision: "day",
      title: "국민제안 정책화 시스템 개통",
      summary: "불채택 제안 재검토.",
      claimIds: ["claim-system", "claim-selection"],
    },
  ],
  gaps: [
    "'공감 30개' 문턱이 어느 제도(국민신문고, 국민생각함, 정책화 시스템, 청와대 누리집)의 기준인지, 실제로 있는 기준인지 공식 자료와 보도에서 찾지 못했다.",
    "정책화 시스템의 확정 명칭과 개통 뒤 정책으로 이어진 제안 건수는 확인하지 못했다.",
    "심의위원회의 구성과 선정 기준 원문은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newspim-20260729",
      title: "권익위, 국민제안 정책화 시스템 개통…미채택 아이디어 재검토",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260729000867",
      publishedAt: "2026-07-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-20260729",
      title: "靑, '국민 제안 정책화 시스템' 구축...'숙의 거쳐 정책으로 발전'",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20260729161602641",
      publishedAt: "2026-07-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sedaily-20260729",
      title: "李 \"민원은 보물창고\" 당부에…靑, '국민 제안 정책화 시스템' 구축",
      publisher: "서울경제",
      url: "https://www.sedaily.com/article/20073412",
      publishedAt: "2026-07-29",
      type: "press",
      license: "link-only",
    },
  ],
};
