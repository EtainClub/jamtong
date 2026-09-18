import { storySchema, type StoryInput } from "@/content/schema";

/**
 * 대장동 개발사업 — Sprint 2.
 *
 * ⚠ publishStatus: "draft"
 *   아래 수치와 연표는 **출처 미확정 골격**이다. 편집팀이 1차 자료로 대조하기
 *   전까지 published로 올릴 수 없고, validateStory가 빌드에서 막는다.
 *   sources[]의 `src-need-*` 항목이 각각 어떤 자료가 필요한지를 적어 둔 자리다.
 *
 * 설계 원칙 (설계 검토 문서 2.2)
 *   - 노드에 실존 개인을 올리지 않는다. 성남시·성남도시개발공사·LH·성남의뜰 등
 *     기관과 용처만으로 구조가 설명되고, 그것이 법적 노출도 줄인다.
 *   - 쟁점을 빼지 않는다. counterpoints는 이 유형의 스토리에서 스키마가 요구한다.
 *   - 논지는 비교에 있다. 같은 사업이 다른 구조였을 때와 나란히 놓는다.
 */

const raw: StoryInput = {
  id: "daejangdong",
  slug: "daejangdong",
  title: "대장동 개발사업",
  subtitle: "민간에 넘어갈 뻔한 개발이익을 공공이 환수한 구조",
  kicker: "주요 업적",
  summary:
    "LH가 발을 빼면서 대장동은 순수 민간개발로 넘어갈 상황이었다. " +
    "성남시는 이를 민관합동 구조로 되돌려 개발이익의 일부를 공공이 먼저 확정해 환수했다. " +
    "돈이 어디서 생겨 어디로 갔는지, 그리고 다른 구조였다면 어떻게 됐을지를 나란히 놓고 보라.",
  type: "event",
  publishStatus: "draft",

  moneyFlow: {
    sourceLabel: "대장동 개발이익",
    unitLabel: "억 원",
    note:
      "이 그림은 개발이익 가운데 공공이 환수한 몫만 다룬다. 전체 개발이익 규모와 " +
      "민간 배분액은 이 자료의 범위 밖이며, 왼쪽 기둥은 축척이 아니라 출처를 나타낸다. " +
      "공공 환수분의 구성과 금액은 편집팀 검증 전 골격으로, 성남도시개발공사 제출 자료로 대조한 뒤 확정한다.",
    scenarios: [
      {
        id: "sc-ppp",
        name: "민관합동 (실제 추진된 구조)",
        summary:
          "성남도시개발공사가 사업에 참여해 개발이익 중 일부를 사전에 확정된 몫으로 환수했다.",
        isActual: true,
        claimId: "claim-ppp-structure",
        allocations: [
          {
            id: "al-park",
            label: "제1공단 공원 조성",
            amountEok: 2561,
            kind: "public",
            detail: "도심 공원 조성 및 지하주차장",
            claimId: "claim-recovery-breakdown",
          },
          {
            id: "al-infra",
            label: "기반시설 조성",
            amountEok: 1120,
            kind: "public",
            detail: "터널·도로 등 광역 기반시설",
            claimId: "claim-recovery-breakdown",
          },
          {
            id: "al-dividend",
            label: "확정이익 배당",
            amountEok: 1822,
            kind: "public",
            detail: "성남도시개발공사 우선주 배당",
            claimId: "claim-recovery-breakdown",
          },
        ],
      },
      {
        id: "sc-private",
        name: "순수 민간개발 (LH 철수 후 예정되었던 경로)",
        summary:
          "LH가 사업에서 빠진 뒤 대장동은 민간개발로 넘어갈 상황이었다. 그 경로에서 공공이 환수하는 개발이익은 없다.",
        isActual: false,
        claimId: "claim-private-path",
        allocations: [
          {
            id: "al-none",
            label: "공공 환수",
            amountEok: 0,
            kind: "none",
            detail: "민간개발에서 공공은 개발이익을 환수하지 않는다",
            claimId: "claim-private-path",
          },
        ],
      },
    ],
  },

  keyNumbers: [
    {
      id: "kn-recovery",
      label: "공공 환수 규모",
      prefix: "약",
      value: "5,503",
      unit: "억 원",
      caption: "공원·기반시설·확정이익 합계",
      claimId: "claim-recovery-total",
    },
    {
      id: "kn-share",
      label: "성남도시개발공사 지분",
      value: "50",
      unit: "%+1주",
      caption: "의결권 확보를 위한 구조",
      claimId: "claim-ppp-structure",
    },
    {
      id: "kn-baseline",
      label: "민간개발 시 공공 환수",
      value: "0",
      unit: "원",
      caption: "LH 철수 후 예정되었던 경로",
      claimId: "claim-private-path",
    },
  ],

  timeline: [
    {
      id: "dj-lh-exit",
      date: "2010",
      datePrecision: "year",
      title: "LH 사업 철수",
      summary:
        "공영개발을 추진하던 LH가 대장동 사업에서 철수하면서, 사업은 순수 민간개발로 넘어갈 상황이 되었다.",
      claimIds: ["claim-lh-exit"],
    },
    {
      id: "dj-ppp-decision",
      date: "2014",
      datePrecision: "year",
      title: "민관합동 개발 방식 결정",
      summary:
        "성남시는 공영개발 경로가 닫힌 상황에서 민관합동 방식으로 사업을 재구성하고, 공공이 개발이익 일부를 환수하는 구조를 설계했다.",
      claimIds: ["claim-ppp-structure"],
    },
    {
      id: "dj-spc",
      date: "2015",
      datePrecision: "year",
      title: "프로젝트금융투자회사 설립 및 사업협약",
      summary:
        "성남도시개발공사가 의결권 과반을 갖는 구조로 프로젝트금융투자회사가 설립되고 사업협약이 체결되었다.",
      claimIds: ["claim-ppp-structure"],
    },
    {
      id: "dj-recovery",
      date: "2016~2019",
      datePrecision: "circa",
      title: "공공 환수분 확정 및 집행",
      summary:
        "사업 시행과 함께 공원 조성, 기반시설, 확정이익 배당으로 공공 환수분이 집행되었다.",
      claimIds: ["claim-recovery-total", "claim-recovery-breakdown"],
    },
  ],

  counterpoints: [
    {
      id: "cp-excess",
      question: "초과이익 환수 조항이 빠진 것 아닌가?",
      response:
        "확정이익 방식은 부동산 경기가 하락해도 공공이 정해진 몫을 먼저 가져가는 구조다. 상승분을 나누지 않는 대신 하락 위험도 지지 않는다. 어느 쪽이 유리한지는 사후의 시세로 판단할 문제가 아니라 계약 시점의 위험 배분으로 봐야 한다는 것이 성남시의 설명이다.",
      claimIds: ["claim-fixed-profit"],
    },
    {
      id: "cp-private-gain",
      question: "민간 사업자가 과도한 이익을 얻은 것 아닌가?",
      response:
        "민간 배당 규모와 별개로, 공공이 환수한 금액 자체가 동시기 도시개발사업과 비교해 어떤 수준이었는지를 함께 놓고 봐야 한다. 비교군 없이 한쪽 숫자만 보면 구조를 판단할 수 없다.",
      claimIds: ["claim-comparison-context"],
    },
    {
      id: "cp-why-not-public",
      question: "왜 처음부터 공영개발로 하지 않았나?",
      response:
        "LH가 2010년에 사업에서 철수하면서 공영개발 경로는 이미 닫혀 있었다. 당시 선택지는 순수 민간개발이거나 민관합동이었다.",
      claimIds: ["claim-lh-exit"],
    },
  ],

  claims: [
    {
      id: "claim-lh-exit",
      text: "LH는 2010년 대장동 개발사업에서 철수했고, 이후 사업은 민간개발로 전환될 상황이었다.",
      assertionType: "FACT",
      sourceIds: ["src-need-lh"],
      verified: false,
    },
    {
      id: "claim-ppp-structure",
      text:
        "성남시는 민관합동 방식으로 사업을 재구성했고, 성남도시개발공사가 의결권 과반(50%+1주)을 갖는 구조로 프로젝트금융투자회사가 설립되었다.",
      assertionType: "FACT",
      sourceIds: ["src-need-agreement"],
      verified: false,
    },
    {
      id: "claim-recovery-total",
      text: "대장동 개발사업에서 공공이 환수한 개발이익은 약 5,503억 원이다.",
      assertionType: "CLAIM",
      assertedBy: "성남시",
      sourceIds: ["src-need-smdc"],
      verified: false,
    },
    {
      id: "claim-recovery-breakdown",
      text:
        "공공 환수분은 제1공단 공원 조성, 광역 기반시설 조성, 확정이익 배당으로 구성된다.",
      assertionType: "CLAIM",
      assertedBy: "성남시",
      sourceIds: ["src-need-smdc"],
      verified: false,
    },
    {
      id: "claim-private-path",
      text:
        "순수 민간개발로 진행되었을 경우 공공이 환수하는 개발이익은 발생하지 않는다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-need-comparison"],
      verified: false,
    },
    {
      id: "claim-fixed-profit",
      text:
        "확정이익 방식은 부동산 경기 변동에 따른 위험을 공공이 지지 않는 대신 상승분도 나누지 않는 구조다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-need-agreement"],
      verified: false,
    },
    {
      id: "claim-comparison-context",
      text:
        "동시기 도시개발사업에서 공공이 환수한 개발이익 규모와 비교할 필요가 있다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-need-comparison"],
      verified: false,
    },
  ],

  sources: [
    {
      id: "src-need-lh",
      title: "[필요] LH 대장동 사업 참여 및 철수 경위 자료 — 국회·국정감사 제출본 또는 LH 공식 자료",
      publisher: "미정",
      type: "official",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/lh-exit",
    },
    {
      id: "src-need-agreement",
      title:
        "[필요] 성남의뜰 사업협약서·정관 중 공개분 — 지분구조와 이익배분 방식 확인용",
      publisher: "미정",
      type: "official",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/agreement",
    },
    {
      id: "src-need-smdc",
      title: "[필요] 성남도시개발공사 대장동 공공환수 내역 — 항목별 금액 확인용",
      publisher: "미정",
      type: "official",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/smdc-recovery",
    },
    {
      id: "src-need-comparison",
      title:
        "[필요] 동시기 도시개발사업 공공 환수 실적 비교 자료 — 국토연구원·감사원·국회입법조사처 등",
      publisher: "미정",
      type: "research",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/comparison",
    },
  ],
};

export const daejangdong = storySchema.parse(raw);
