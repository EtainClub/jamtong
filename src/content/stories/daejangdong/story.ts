import { storySchema, type StoryInput } from "@/content/schema";
import { ISDC_DAEJANG, ISDC_PARK } from "@/content/sources";

/**
 * 성남 판교대장 도시개발사업 (통칭 대장동) — Sprint 2.
 *
 * 출처
 *  - `src-isdc-daejang`: 성남도시개발공사 추진사업 페이지. 사업개요·추진경위·토지이용계획.
 *  - `src-isdc-park`: 같은 곳의 제1공단 도시계획시설(공원화) 사업 페이지.
 *
 * ⚠ publishStatus: "draft"
 *   **금액은 아직 어느 것도 검증되지 않았다.** 공사 공개 자료에는 사업 개요와
 *   토지이용계획은 있으나 개발이익 환수액·배분 내역이 없다. 5,503억을 비롯한
 *   금액 claim은 전부 verified: false이며, published로 올리면 빌드가 깨진다.
 *
 * 그래서 이 초안의 무게중심은 금액이 아니라 **면적과 절차**에 있다.
 * 토지이용계획상 공공용지 비율과 결합 도시개발구역 지정은 인허가 고시에 실리는
 * 값이라 검증이 쉽고 다툼의 여지도 적다. 금액 자료가 확보되면 그때 보강한다.
 *
 * 설계 원칙 (설계 검토 문서 2.2)
 *   - 노드에 실존 개인을 올리지 않는다. 기관과 용처만으로 구조가 설명된다.
 *   - 쟁점을 빼지 않는다. counterpoints는 이 유형의 스토리에서 스키마가 요구한다.
 */

const raw: StoryInput = {
  id: "daejangdong",
  slug: "daejangdong",
  title: "성남 판교대장 도시개발사업",
  subtitle: "부지의 절반 이상을 공공용지로 되돌린 결합 개발구역",
  kicker: "주요 업적",
  summary:
    "대장동 개발사업으로 알려진 이 사업의 공식 명칭은 성남 판교대장 도시개발사업이다. " +
    "성남시는 2014년 대장동과 제1공단을 하나의 결합 도시개발구역으로 묶었다. " +
    "대장동에서 나온 개발이익으로 도심의 옛 공단 부지를 공원으로 되돌리는 구조다. " +
    "전체 917,068.8㎡ 가운데 공공용지는 53.5%다.",
  type: "event",
  publishStatus: "draft",

  scenes: [
    {
      id: "land-use",
      kind: "land-use",
      heading: "땅은 어떻게 나뉘었나",
      lede:
        "금액을 따지기 전에 부지가 무엇으로 계획되었는지부터 봅니다. 인허가 고시에 실리는 값이라 다툼의 여지가 가장 적은 숫자입니다.",
      claimIds: ["claim-land-use"],
      landUse: {
        totalSqm: 917068.8,
        claimId: "claim-land-use",
        // 공개 표의 주거용지 소계가 제 하위 항목 합과 9㎡ 어긋난다. 자료에 적힌 값을
        // 그대로 싣고 차이를 note에 밝힌다. 임의로 고치면 인용이 아니게 된다.
        sumToleranceSqm: 10,
        note:
          "성남도시개발공사가 공개한 토지이용계획표다. 공공용지에는 공원·녹지·도로·학교 등 " +
          "사업 완료 후 공공이 관리하는 용지가 포함된다. " +
          "다만 공개된 표의 주거용지 소계(417,976.7㎡)는 하위 항목 합(417,967.7㎡)과 9㎡ 차이가 있다. " +
          "여기서는 자료에 적힌 소계를 그대로 싣는다.",
        groups: [
          {
            id: "lu-residential",
            label: "주거용지",
            areaSqm: 417976.7,
            sharePercent: 45.6,
            group: "residential",
            detail: "아파트·연립·단독·준주거",
          },
          {
            id: "lu-commercial",
            label: "상업시설용지",
            areaSqm: 8353.5,
            sharePercent: 0.9,
            group: "commercial",
          },
          {
            id: "lu-public",
            label: "공공용지",
            areaSqm: 490747.6,
            sharePercent: 53.5,
            group: "public",
            detail: "공원·녹지·도로·학교 등",
          },
        ],
        publicBreakdown: [
          { id: "lu-green", label: "녹지", areaSqm: 168847.3, sharePercent: 18.4, group: "public" },
          { id: "lu-road", label: "도로", areaSqm: 147175.9, sharePercent: 16.0, group: "public" },
          { id: "lu-park", label: "공원", areaSqm: 109349.2, sharePercent: 11.9, group: "public" },
          {
            id: "lu-school",
            label: "학교",
            areaSqm: 19100.9,
            sharePercent: 2.1,
            group: "public",
            detail: "초등학교 1, 중학교 1",
          },
          { id: "lu-detention", label: "저류지", areaSqm: 12217.7, sharePercent: 1.3, group: "public" },
          { id: "lu-plaza", label: "공공공지", areaSqm: 8726.2, sharePercent: 1.0, group: "public" },
          { id: "lu-kinder", label: "유치원", areaSqm: 4899.8, sharePercent: 0.5, group: "public" },
          {
            id: "lu-civic",
            label: "커뮤니티시설(공공청사)",
            areaSqm: 3482.5,
            sharePercent: 0.4,
            group: "public",
          },
          { id: "lu-welfare", label: "사회복지시설", areaSqm: 3142.7, sharePercent: 0.3, group: "public" },
          { id: "lu-power", label: "전기공급설비", areaSqm: 3092.9, sharePercent: 0.3, group: "public" },
          { id: "lu-culture", label: "복합문화시설", areaSqm: 1863.0, sharePercent: 0.2, group: "public" },
          { id: "lu-parking", label: "주차장", areaSqm: 6182.3, sharePercent: 0.7, group: "public" },
          { id: "lu-bus", label: "버스차고지", areaSqm: 1390.2, sharePercent: 0.2, group: "public" },
          { id: "lu-religion", label: "종교시설", areaSqm: 1112.0, sharePercent: 0.1, group: "public" },
          { id: "lu-telecom", label: "통신시설용지", areaSqm: 165.0, sharePercent: 0.1, group: "public" },
        ],
      },

    },
    {
      id: "money-flow",
      kind: "money-flow",
      heading: "돈은 어디로 갔나",
      lede:
        "시나리오를 바꿔 보십시오. 같은 사업이 다른 구조였다면 공공으로 흐르는 몫이 어떻게 달라지는지 폭으로 나타납니다.",
      claimIds: ["claim-recovery-total", "claim-recovery-breakdown"],
      flow: {
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

    },
  ],

  keyNumbers: [
    {
      id: "kn-public-share",
      label: "공공용지 비율",
      value: "53.5",
      unit: "%",
      caption: "전체 917,068.8㎡ 중 490,747.6㎡",
      claimId: "claim-land-use",
    },
    {
      id: "kn-park-green",
      label: "공원·녹지",
      prefix: "약",
      value: "27.8",
      unit: "만 ㎡",
      caption: "공원 109,349.2 + 녹지 168,847.3",
      claimId: "claim-park-green",
    },
    {
      id: "kn-first-park",
      label: "제1공단 공원",
      value: "46,615",
      unit: "㎡",
      caption: "결합 구역으로 함께 추진",
      claimId: "claim-first-park",
    },
    {
      id: "kn-recovery",
      label: "공공 환수 규모",
      prefix: "약",
      value: "5,503",
      unit: "억 원",
      caption: "금액 출처 확정 전",
      claimId: "claim-recovery-total",
    },
  ],

  timeline: [
    {
      id: "dj-district",
      date: "2014-05",
      datePrecision: "month",
      title: "결합 도시개발구역 지정 고시",
      summary:
        "대장동과 제1공단을 하나의 도시개발구역으로 묶었다. 대장동 개발이익으로 도심의 옛 공단 부지를 공원으로 되돌리는 구조가 이때 만들어졌다.",
      claimIds: ["claim-combined-district"],
    },
    {
      id: "dj-select",
      date: "2015-03",
      datePrecision: "month",
      title: "민간사업자 우선협상대상자 선정",
      summary:
        "2015년 2월 민간사업자 공모 공고를 거쳐 성남의뜰이 우선협상대상자로 선정되었다.",
      claimIds: ["claim-procurement"],
    },
    {
      id: "dj-spc",
      date: "2015-07",
      datePrecision: "month",
      title: "사업협약 체결 및 PFV 설립",
      summary:
        "2015년 6월 사업협약이 체결되고 7월 프로젝트금융투자회사가 설립되었다. 8월 사업시행자로 지정 고시되었다.",
      claimIds: ["claim-procurement"],
    },
    {
      id: "dj-tunnel",
      date: "2017-06",
      datePrecision: "month",
      title: "북측 터널 도시계획시설 결정",
      summary:
        "같은 해 6월 단지조성공사 착공계가 제출되었고, 광역 기반시설인 북측 터널이 도시계획시설로 결정 고시되었다.",
      claimIds: ["claim-tunnel"],
    },
    {
      id: "dj-park-done",
      date: "2022-03",
      datePrecision: "month",
      title: "제1공단 공원 사업 마무리 단계",
      summary:
        "2016년 4월 시작된 제1공단 공원화 사업이 2022년 3월 실시계획 변경 인가를 끝으로 사업기간을 마쳤다. 공원 46,615㎡와 도로 9,407㎡가 조성되고 시립박물관이 반영되었다.",
      claimIds: ["claim-first-park"],
    },
    {
      id: "dj-partial",
      date: "2023-06",
      datePrecision: "month",
      title: "1-1단계·2단계 부분 준공",
      summary:
        "대장동 사업의 일부 구간이 공사를 마치고 부분 준공 공고되었다. 전체 사업기간은 2026년 12월까지다.",
      claimIds: ["claim-overview"],
    },
  ],

  counterpoints: [
    {
      id: "cp-what-public-got",
      question: "공공이 실제로 가져간 것이 있나?",
      response:
        "토지이용계획상 전체 917,068.8㎡ 가운데 공공용지가 490,747.6㎡로 53.5%다. 공원 109,349.2㎡, 녹지 168,847.3㎡, 도로 147,175.9㎡, 학교 부지 19,100.9㎡ 등이 여기 포함된다. 여기에 결합 구역으로 함께 추진된 제1공단 공원 46,615㎡가 더해진다. 금액과 별개로, 부지의 절반 이상이 공공용지로 계획되었다는 사실은 인허가 고시로 확인된다.",
      claimIds: ["claim-land-use", "claim-first-park"],
    },
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
        "민간 배당 규모와 별개로, 공공이 환수한 몫 자체가 동시기 도시개발사업과 비교해 어떤 수준이었는지를 함께 놓고 봐야 한다. 비교군 없이 한쪽 숫자만 보면 구조를 판단할 수 없다.",
      claimIds: ["claim-comparison-context"],
    },
    {
      id: "cp-why-not-public",
      question: "왜 처음부터 공영개발로 하지 않았나?",
      response:
        "LH가 사업에서 철수하면서 공영개발 경로가 닫혔다는 것이 성남시의 설명이다. 다만 철수 경위와 시점은 공사 공개 자료의 추진경위(2014년 5월부터 시작) 범위 밖이므로, 별도 자료로 확인이 필요하다.",
      claimIds: ["claim-lh-exit"],
    },
  ],

  claims: [
    {
      id: "claim-overview",
      text:
        "성남 판교대장 도시개발사업은 분당구 대장동 210일원 917,068.8㎡를 대상으로 2014년 5월부터 2026년 12월까지 추진되며, 계획인구는 15,938인(5,903세대)이다. 2023년 6월 1-1단계와 2단계가 부분 준공되었다.",
      assertionType: "FACT",
      sourceIds: ["src-isdc-daejang"],
      verified: true,
    },
    {
      id: "claim-combined-district",
      text:
        "2014년 5월 대장동과 제1공단을 묶은 결합 도시개발구역이 지정 고시되었다.",
      assertionType: "FACT",
      sourceIds: ["src-isdc-daejang", "src-isdc-park"],
      verified: true,
    },
    {
      id: "claim-procurement",
      text:
        "2015년 2월 민간사업자 공모 공고, 3월 우선협상대상자(성남의뜰) 선정, 6월 사업협약 체결, 7월 PFV 설립, 8월 사업시행자 지정 고시가 순차적으로 이루어졌다.",
      assertionType: "FACT",
      sourceIds: ["src-isdc-daejang"],
      verified: true,
    },
    {
      id: "claim-land-use",
      text:
        "토지이용계획상 전체 917,068.8㎡ 가운데 공공용지는 490,747.6㎡로 53.5%이며, 주거용지 417,976.7㎡(45.6%), 상업시설용지 8,353.5㎡(0.9%)로 구성된다.",
      assertionType: "FACT",
      sourceIds: ["src-isdc-daejang"],
      verified: true,
    },
    {
      id: "claim-park-green",
      text:
        "공공용지 중 공원은 109,349.2㎡, 녹지는 168,847.3㎡로 합계 약 27.8만㎡다.",
      assertionType: "FACT",
      sourceIds: ["src-isdc-daejang"],
      verified: true,
    },
    {
      id: "claim-tunnel",
      text:
        "2017년 6월 단지조성공사 착공계가 제출되었고 북측 터널이 도시계획시설로 결정 고시되었으며, 같은 해 12월 실시계획이 인가 고시되었다.",
      assertionType: "FACT",
      sourceIds: ["src-isdc-daejang"],
      verified: true,
    },
    {
      id: "claim-first-park",
      text:
        "제1공단 도시계획시설(공원화) 사업은 수정구 신흥동 2458일원 56,022㎡를 대상으로 2016년 4월부터 2022년 3월까지 추진되었고, 공원 46,615㎡와 도로 9,407㎡로 구성되며 2018년 1월 시립박물관이 공원조성계획에 반영되었다.",
      assertionType: "FACT",
      sourceIds: ["src-isdc-park"],
      verified: true,
    },

    // ── 아래부터 출처 미확정 ───────────────────────────
    {
      id: "claim-lh-exit",
      text: "LH는 대장동 개발사업에서 철수했고, 이후 사업은 민간개발로 전환될 상황이었다.",
      assertionType: "CLAIM",
      assertedBy: "성남시",
      sourceIds: ["src-need-lh"],
      verified: false,
    },
    {
      id: "claim-ppp-structure",
      text:
        "성남도시개발공사가 의결권 과반(50%+1주)을 갖는 구조로 프로젝트금융투자회사가 설립되었다.",
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
      text: "순수 민간개발로 진행되었을 경우 공공이 환수하는 개발이익은 발생하지 않는다.",
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
      text: "동시기 도시개발사업에서 공공이 환수한 개발이익 규모와 비교할 필요가 있다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-need-comparison"],
      verified: false,
    },
  ],

  sources: [ISDC_DAEJANG, ISDC_PARK,
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
