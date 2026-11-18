import type { PolicyInput } from "./schema";

/**
 * TBS 운영 지원 예산(2027년도 예산안 국회 심사).
 *
 * 11월 대통령 X 게시물 답글에 "편향된 시사 방송을 할 TBS 부활을 위한 정부 예산 편성을 철회해 달라"는 요청이 달렸다(잼통 Voice).
 *
 * ★ 이 돈은 정부안이 아니라 국회 상임위 심사에서 새로 넣은 것이다. 방미통위원장도 "국회에서 증액"이라고 답했다.
 * ★ 답글이 든 '76억'은 확인되지 않는다. 보도된 액수는 약 73억 5,000만 원이다.
 * ★ 상임위 의결은 최종 확정이 아니다. 예결특위·본회의 결과는 gaps에 둔다.
 * ★ 2026-11-15 처음 등록 — 잼통 Voice 이슈 #297.
 */
export const TBS_FUNDING_2027: PolicyInput = {
  slug: "tbs-funding-2027",
  title: "TBS 운영 지원 예산 (2027년도 예산안)",
  scope: "2027년도 예산안 국회 과학기술정보방송통신위원회 심사에서 새로 편성된 TBS 지원금의 규모·용도와 여야 논쟁",
  ministries: ["방송미디어통신위원회", "국회 과학기술정보방송통신위원회"],
  categories: ["institution"],
  asOf: "2026-11-15",
  rumors: [
    {
      id: "rumor-tbs",
      text: "정부가 편향된 시사 방송을 할 TBS를 살리려고 76억 원을 편성했다",
      claimIds: ["claim-amount", "claim-restriction", "claim-who", "claim-stage"],
    },
  ],
  claims: [
    {
      id: "claim-amount",
      text:
        "국회 과학기술정보방송통신위원회 예산결산심사소위원회는 2027년도 예산안에 TBS 운영 지원금 약 73억 5,000만 원을 새로 편성하는 안을 통과시켰다. " +
        "외국어라디오방송 지원 39억 6,000만 원과 교통방송 지원 33억 9,300만 원이다. 과방위 전체회의는 11월 13일 이 예산이 담긴 2027년도 예산안을 의결했다.",
      assertionType: "FACT",
      sourceIds: ["src-imaeil-20261114", "src-dailian-20261113"],
      verified: true,
    },
    {
      id: "claim-restriction",
      text: "이진숙 국민의힘 의원의 설명에 따르면 이 예산은 교통방송과 외국어방송 용도로만 쓸 수 있고, 시사·유튜브 방송에는 쓸 수 없도록 제한됐다.",
      assertionType: "CLAIM",
      assertedBy: "이진숙 국민의힘 의원",
      sourceIds: ["src-imaeil-20261114"],
      verified: false,
      limit: "예산안 부대의견 원문과 대조하지 못했다.",
    },
    {
      id: "claim-who",
      text:
        "김종철 방송미디어통신위원장은 이 지원금에 대해 \"국회에서 증액을 해주신 것으로 안다\"고 답했다. 원칙적으로 서울시 중심으로 지원해야 하지만 " +
        "공백기에 대한 \"마중물 차원\"이라고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "김종철 방송미디어통신위원장",
      sourceIds: ["src-imaeil-20261114", "src-dailian-20261113"],
      verified: true,
    },
    {
      id: "claim-debate",
      text:
        "국민의힘 김장겸 의원은 TBS가 편향적인 방송이었다며 세금으로 지원할 이유와 중앙정부 지원 근거를 따졌고, 박정하 의원은 서울시·방미통위·TBS가 참여하는 협의 결과를 먼저 보아야 한다고 했다. " +
        "더불어민주당 이주희 의원은 TBS 사태가 인위적 개입으로 빚어졌다며 서울시가 TBS를 극단적인 상황으로 몰기 전에는 시민들에게 사랑받던 방송이었다고 반박했다.",
      assertionType: "OPINION",
      assertedBy: "국회 과방위 여야 의원",
      sourceIds: ["src-dailian-20261113"],
      verified: true,
    },
    {
      id: "claim-stage",
      text:
        "서울경제 보도에 따르면 지원금 규모는 73억 5,300만 원이고, 더불어민주당 김현·이주희 의원이 편성을 추진했다. " +
        "과방위는 이 예산이 담긴 방송미디어통신위원회 소관 예산안을 여당 주도로 의결했고, 국민의힘은 표결을 거부했다.",
      assertionType: "FACT",
      sourceIds: ["src-sedaily-tbs"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-debate"],
  timeline: [
    {
      id: "t-committee",
      date: "2026-11-13",
      datePrecision: "day",
      title: "과방위, TBS 지원 포함 예산안 의결",
      summary: "약 73억 5,000만 원 신규 편성.",
      claimIds: ["claim-amount"],
    },
  ],
  gaps: [
    "'76억 원'이라는 액수의 출처는 확인하지 못했다. 보도된 액수는 약 73억 5,000만 원이다.",
    "예결특위와 본회의에서 이 예산이 최종 반영되는지는 11월 15일 현재 정해지지 않았다.",
    "용도 제한이 예산안 부대의견에 어떻게 적혔는지는 원문과 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-imaeil-20261114",
      title: "김어준 진행했던 TBS에 73억 편성…방미통위원장, `프로그램 하나 대봐라` 이진숙 추궁에 진땀",
      publisher: "매일신문",
      url: "https://www.imaeil.com/page/view/2026111411113346989",
      publishedAt: "2026-11-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-20261113",
      title: "과방위, 2027년도 예산안 의결…TBS 지원 놓고 여야 공방",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1714804/%EA%B3%BC%EB%B0%A9%EC%9C%84-2027%EB%85%84%EB%8F%84-%EC%98%88%EC%82%B0%EC%95%88-%EC%9D%98%EA%B2%B0TBS-2026",
      publishedAt: "2026-11-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sedaily-tbs",
      title: "與, 내년 예산에 TBS 지원금 73억 편성",
      publisher: "서울경제",
      url: "https://www.sedaily.com/article/20114184",
      publishedAt: "2026-11-13",
      type: "press",
      license: "link-only",
    },
  ],
};
