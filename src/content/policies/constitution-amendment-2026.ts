import type { PolicyInput } from "./schema";

/**
 * 2026년 개헌안(5·18 정신 헌법 전문 수록·계엄 국회 통제) 국회 표결 무산.
 *
 * 「어렵게 만든 민주주의를 꼭 지켜냅시다」 답글에 "5·18 관련 법과 12·3 내란 관련 법이 국회를
 * 통과하지 못하는데 국회의원들은 무엇을 하나", "이번 개헌의 핵심은 헌법 전문이 아니라 대선
 * 결선투표제여야 한다"는 말이 달렸다(잼통 Voice). 2026년 개헌안의 경과를 적는다.
 *
 * ★ 대통령 글은 words:keep-democracy에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #133, #157.
 */
export const CONSTITUTION_AMENDMENT_2026: PolicyInput = {
  slug: "constitution-amendment-2026",
  title: "2026년 개헌안(5·18 전문 수록·계엄 국회 통제) 표결 무산",
  scope:
    "2026년 4월 발의된 헌법 개정안의 내용, 5월 7일 투표 불성립과 5월 8일 미상정으로 6·3 국민투표가 무산된 경과, 국민의힘의 입장, 이후 대통령의 개헌 촉구",
  ministries: [],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-assembly",
      text: "5·18 관련 법과 12·3 내란 관련 법이 국회를 통과하지 못하는데 국회의원들은 무엇을 하는가",
      claimIds: ["claim-content", "claim-vote", "claim-halt", "claim-ppp"],
    },
    {
      id: "rumor-runoff",
      text: "6월 항쟁의 목표가 직선제였듯 이번 개헌의 핵심은 헌법 전문이 아니라 대선 결선투표제여야 한다",
      claimIds: ["claim-content"],
    },
  ],
  claims: [
    {
      id: "claim-content",
      text:
        "더불어민주당 등 국민의힘을 뺀 정당들이 낸 개헌안은 부마민주항쟁과 5·18민주화운동 정신을 헌법 전문에 넣고 대통령의 계엄 " +
        "선포에 대한 국회 통제를 강화하는 내용이다. 보도된 주요 내용에 대통령 결선투표제는 없었다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260506"],
      verified: true,
    },
    {
      id: "claim-vote",
      text:
        "5월 7일 본회의 표결은 의결 정족수(재적 286명의 3분의 2인 191명)를 채우지 못해 투표 불성립이 선언됐다. 국민의힘은 전날 " +
        "반대를 당론으로 정하고 표결에 들어오지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260506"],
      verified: true,
    },
    {
      id: "claim-halt",
      text:
        "5월 8일 재표결을 위한 본회의에서 국민의힘이 필리버스터로 맞서자 우원식 국회의장은 개헌안을 상정하지 않겠다며 6월 3일 " +
        "국민투표 절차가 중단됐다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260507"],
      verified: false,
    },
    {
      id: "claim-ppp",
      text: "국민의힘은 지방선거 뒤 22대 국회 후반기에 여야 합의로 개헌특위를 꾸려 논의하자고 주장했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘",
      sourceIds: ["src-heraldk-20260507"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-vote",
      date: "2026-05-07",
      datePrecision: "day",
      title: "개헌안 투표 불성립",
      summary: "국민의힘 불참.",
      claimIds: ["claim-vote"],
    },
    {
      id: "t-halt",
      date: "2026-05-08",
      datePrecision: "day",
      title: "개헌안 미상정, 국민투표 무산",
      summary: "필리버스터 대치.",
      claimIds: ["claim-halt"],
    },
  ],
  gaps: [
    "지방선거 뒤 국회 개헌특위 구성 여부와 결선투표제 논의 상황은 확인하지 못했다.",
    "답글이 말하는 '12·3 내란 관련 법'이 어떤 법안인지는 답글에 나오지 않아 대조하지 못했다.",
    "대선 결선투표제를 개헌 없이 공직선거법 개정으로 도입할 수 있는지에 대한 견해 차이는 정리하지 못했다.",
    "10월 16일 부마민주항쟁 기념식에서 대통령이 개헌을 촉구한 발언 원문은 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-heraldk-20260506",
      title: "李정부 첫 개헌안 '투표 불성립'…국민의힘 불참(종합)",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026050623185659127",
      publishedAt: "2026-05-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20260507",
      title: "헌법 개정안 표결 최종 무산…우원식 \"본회의 상정 안 할 것\"",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026050721513259654",
      publishedAt: "2026-05-08",
      type: "press",
      license: "link-only",
    },
  ],
};
