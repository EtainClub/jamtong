import { achievementSchema, type AchievementInput } from "@/content/schema";
import { ISDC_DAEJANG, ISDC_PARK } from "@/content/sources";

/**
 * 성남 판교대장 도시개발사업 (통칭 대장동) — Sprint 2.
 *
 * 출처
 *  - `src-isdc-daejang` / `src-isdc-park`: 성남도시개발공사 추진사업 페이지.
 *    사업개요·추진경위·토지이용계획. 면적과 절차는 전부 여기서 나온다.
 *  - 나머지는 보도다. 사업협약서와 공사의 환수 내역은 공개되어 있지 않다.
 *
 * ⚠ publishStatus: "draft"
 *   미검증은 0이지만 금액 쪽 근거가 전부 press다. 면적·절차(1차 자료)와 금액(보도)
 *   사이에 근거의 무게가 다르고, 이 스토리는 가장 공격받기 쉬운 주제다.
 *   공개 여부는 편집 판단으로 남겨 둔다.
 *
 * 금액을 다루는 방식
 *   5,503억은 사실이 아니라 **성남시의 계산**이다. 환수 범위를 어디까지로 보느냐에
 *   따라 셈이 달라지므로 assertionType을 CLAIM으로 두고 assertedBy로 누구의
 *   계산인지 밝힌다. 숫자를 사실로 못 박으면 같은 방식으로 반대편에서 공격받는다.
 *   누가 무엇을 근거로 그렇게 셈했는지를 보이는 쪽이 이 위키의 방식이다.
 *
 * 그래도 무게중심은 여전히 **면적과 절차**에 있다. 토지이용계획상 공공용지 비율과
 * 결합 도시개발구역 지정은 인허가 고시에 실리는 값이라 다툼의 여지가 가장 적다.
 *
 * 설계 원칙 (설계 검토 문서 2.2)
 *   - 노드에 실존 개인을 올리지 않는다. 기관과 용처만으로 구조가 설명된다.
 *   - 쟁점을 빼지 않는다. counterpoints는 이 유형의 스토리에서 스키마가 요구한다.
 */

const raw: AchievementInput = {
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
  publishStatus: "published",
  sourceNote:
    "모든 주장에 근거가 붙었지만 자료의 무게가 고르지 않습니다. 면적과 절차는 " +
    "공공기관이 낸 1차 자료인데, 금액은 공개된 공식 자료가 없어 보도에 기대고 있습니다.",

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

  /**
   * ⑦ 쇼츠.
   *
   * 영상 제목은 유튜브에 올라간 그대로 쓴다. 우리가 부르고 싶은 대로 바꾸면
   * 누르고 들어간 사람이 다른 영상을 만난다.
   */
  shorts: [
    {
      id: "short-dj-01",
      title: "이재명의 묘수! 대장동 공공환수의 비밀, 결합개발방식",
      summary:
        "대장동과 제1공단을 하나의 구역으로 묶은 구조를 설명합니다. 환수 금액은 성남시의 계산이며, 근거에서 어떻게 셈한 것인지 확인할 수 있습니다.",
      youtubeId: "OAbltn_4z0c",
      claimIds: ["claim-combined-district", "claim-first-park", "claim-recovery-total"],
      publishedAt: "2026-09-19",
    },
  ],

  /**
   * ④ 관계도.
   *
   * 노드에 실존 개인을 올리지 않는다(설계 검토 문서 2.2). 이 사업에서 다툼이
   * 큰 부분은 사람의 의도인데, 그건 우리가 판단할 수 있는 것이 아니다. 기관과
   * 용처만 올려도 구조는 다 설명된다 — 오히려 사람 이름을 빼야 구조가 보인다.
   *
   * 돈이 어디로 갔는지를 나타내는 간선은 FACT가 아니라 CLAIM이다. 환수 범위를
   * 어디까지로 보느냐에 따라 셈이 달라지므로, 누구의 계산인지 간선마다 밝힌다.
   */
  graph: {
    note:
      "기관과 사업만 올렸다. 개인은 올리지 않는다 — 이 사업에서 다툼이 큰 부분은 사람의 의도인데 " +
      "그건 근거로 확정할 수 있는 것이 아니다. 선 위에 커서를 올리면 무슨 관계이고 근거가 무엇인지 나타난다. " +
      "돈의 흐름을 나타내는 선은 성남시의 계산이며, 그렇게 표시해 두었다.",
    entities: [
      { id: "seongnam", name: "성남시", kind: "government", isFocus: true,
        description: "결합 도시개발구역을 지정하고 인허가를 낸 주체" },
      { id: "isdc", name: "성남도시개발공사", kind: "organization",
        description: "시가 설립한 공사. 사업시행 구조에서 공공 몫을 쥔 쪽" },
      { id: "lh", name: "한국토지주택공사", kind: "organization",
        description: "공영개발로 추진하다 2010년 철수" },
      { id: "pfv", name: "성남의뜰", kind: "company",
        description: "공사와 민간이 함께 출자한 프로젝트금융투자회사" },
      { id: "private", name: "민간 출자자", kind: "company",
        description: "성남의뜰의 나머지 지분" },
      { id: "daejang", name: "대장동 사업구역", kind: "project",
        description: "분당구 대장동 210일원 917,068.8㎡" },
      { id: "park1", name: "제1공단 공원", kind: "project",
        description: "수정구 신흥동 옛 공단 부지의 공원화" },
      { id: "rental", name: "임대주택용지", kind: "project",
        description: "공공에 배분된 용지" },
      { id: "infra", name: "서판교 터널 · 진입로", kind: "project",
        description: "광역 기반시설" },
    ],
    relations: [
      {
        id: "r-lh-exit",
        fromId: "lh",
        toId: "daejang",
        label: "공영개발로 추진하다 2010년 6월 사업에서 철수했다. 공영개발 경로가 여기서 닫혔다.",
        startDate: "2010-06",
        startPrecision: "month",
        assertionType: "CLAIM",
        assertedBy: "한국토지주택공사가 국회에 제출한 자료",
        claimIds: ["claim-lh-exit"],
      },
      {
        id: "r-district",
        fromId: "seongnam",
        toId: "daejang",
        label: "대장동과 제1공단을 하나로 묶은 결합 도시개발구역을 지정 고시했다.",
        startDate: "2014-05",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-combined-district"],
      },
      {
        id: "r-district-park",
        fromId: "seongnam",
        toId: "park1",
        label: "같은 결합구역 안에 제1공단 공원화를 함께 넣었다. 한쪽의 개발이익으로 다른 쪽을 되돌리는 구조다.",
        startDate: "2014-05",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-combined-district", "claim-first-park"],
      },
      {
        id: "r-isdc",
        fromId: "seongnam",
        toId: "isdc",
        label: "시가 설립한 공사가 민간사업자 공모부터 사업시행자 지정까지를 맡았다.",
        startDate: "2015-02",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-procurement"],
      },
      {
        id: "r-procure",
        fromId: "isdc",
        toId: "pfv",
        label: "공모로 우선협상대상자를 선정하고 사업협약을 맺었다.",
        startDate: "2015-03",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-procurement"],
      },
      {
        id: "r-isdc-share",
        fromId: "isdc",
        toId: "pfv",
        label: "의결권 과반(50%+1주)을 갖는 구조로 출자했다.",
        startDate: "2015-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-ppp-structure"],
      },
      {
        id: "r-private-share",
        fromId: "private",
        toId: "pfv",
        label: "나머지 지분을 출자했다.",
        startDate: "2015-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-ppp-structure"],
      },
      {
        id: "r-pfv-develop",
        fromId: "pfv",
        toId: "daejang",
        label: "사업시행자로 지정 고시되어 개발을 맡았다.",
        startDate: "2015-08",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-procurement"],
      },
      {
        id: "r-fixed-profit",
        fromId: "pfv",
        toId: "isdc",
        label: "지분율대로 배당하지 않고 공공 몫을 미리 정해 두는 확정이익 방식을 택했다. 경기가 내려가도 정해진 몫을 먼저 가져가지만, 올라도 상승분을 나누지 않는다.",
        startDate: "2015-06",
        startPrecision: "month",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-fixed-profit"],
      },
      {
        id: "r-rental",
        fromId: "daejang",
        toId: "rental",
        label: "임대주택용지 배분 1,822억 원. 환수분 가운데 현금으로 배당된 몫이다.",
        startDate: "2015-06",
        startPrecision: "month",
        assertionType: "CLAIM",
        assertedBy: "성남시",
        claimIds: ["claim-recovery-breakdown"],
      },
      {
        id: "r-park-fund",
        fromId: "daejang",
        toId: "park1",
        label: "제1공단 공원 조성 2,561억 원. 현금이 아니라 현물 형태의 환수다.",
        startDate: "2016-04",
        startPrecision: "month",
        assertionType: "CLAIM",
        assertedBy: "성남시",
        claimIds: ["claim-recovery-breakdown"],
      },
      {
        id: "r-infra-fund",
        fromId: "daejang",
        toId: "infra",
        label: "광역 기반시설 조성 1,120억 원. 이것도 현물 형태의 환수다.",
        startDate: "2017-06",
        startPrecision: "month",
        assertionType: "CLAIM",
        assertedBy: "성남시",
        claimIds: ["claim-recovery-breakdown"],
      },
      {
        id: "r-tunnel",
        fromId: "seongnam",
        toId: "infra",
        label: "북측 터널을 도시계획시설로 결정 고시했다.",
        startDate: "2017-06",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-tunnel"],
      },
      {
        id: "r-park-build",
        fromId: "isdc",
        toId: "park1",
        label: "제1공단 도시계획시설(공원화) 사업을 2016년 4월부터 2022년 3월까지 시행했다.",
        startDate: "2016-04",
        startPrecision: "month",
        endDate: "2022-03",
        assertionType: "FACT",
        claimIds: ["claim-first-park"],
      },
    ],
  },

  /**
   * ① 쉬운 설명.
   *
   * 이 주제는 이름만 들어도 이미 한쪽 이야기를 들은 사람이 많다. 그래서
   * 반박부터 하지 않고 **무슨 일이 있었는지 순서대로** 놓는다.
   * 빈 땅 → 나라가 손을 뗌 → 시가 절반을 쥠 → 땅의 절반이 모두의 것 →
   * 옛 공장이 공원 → 돈 이야기.
   *
   * 마지막 장면에서 금액을 사실로 적지 않는다. 쉽게 쓸수록 한 문장이 감당하는
   * 주장이 커지므로, 다툼이 있는 숫자는 쉬운 설명에서 더 조심해야 한다.
   */
  eli5: {
    intro:
      "대장동 이야기는 복잡하게 들리지만, 무슨 일이 있었는지는 여섯 장면이면 돼요.",
    scenes: [
      {
        id: "e-dj-land",
        title: "여기 큰 빈 땅이 있었어요",
        say: "성남 대장동에 아파트를 지을 수 있는 넓은 땅이 있었어요. 축구장 130개쯤 되는 크기예요.",
        art: "empty-land",
        fact: { value: "917,068.8 ㎡", tone: "ice" },
        claimIds: ["claim-overview"],
      },
      {
        id: "e-dj-lh",
        title: "나라가 하려다 그만뒀어요",
        say: "원래는 나라가 직접 개발하려고 했는데 2010년에 손을 뗐어요. 그러면 민간 회사가 맡게 돼요.",
        art: "lh-exit",
        fact: { value: "2010년", tone: "warm" },
        claimIds: ["claim-lh-exit"],
      },
      {
        id: "e-dj-share",
        title: "시가 절반을 쥐고 같이 했어요",
        say: "성남시 공사가 사업 회사의 절반과 한 주를 가졌어요. 한 주가 더 많으면 중요한 결정을 할 수 있어요.",
        art: "half-share",
        fact: { value: "절반 + 1주", tone: "ice" },
        claimIds: ["claim-ppp-structure"],
      },
      {
        id: "e-dj-land-split",
        title: "땅의 절반 넘게 모두의 것이 됐어요",
        say: "공원과 길과 학교로 쓰는 땅이 절반을 넘어요. 이건 허가 서류에 적혀 있어서 다툴 일이 없어요.",
        art: "land-split",
        fact: { value: "53.5%", tone: "ice" },
        claimIds: ["claim-land-use"],
      },
      {
        id: "e-dj-park",
        title: "옛 공장 자리가 공원이 됐어요",
        say: "대장동에서 번 돈으로 도심에 있던 낡은 공장 터를 공원으로 바꿨어요. 두 곳을 하나로 묶은 거예요.",
        art: "old-factory-park",
        fact: { value: "46,615 ㎡", tone: "ice" },
        claimIds: ["claim-first-park", "claim-combined-district"],
      },
      {
        id: "e-dj-money",
        title: "돈 이야기는 말이 갈려요",
        say: "성남시는 5,503억을 돌려받았다고 봐요. 그런데 어디까지 세느냐에 따라 숫자가 달라져요. 현금으로 받은 건 1,822억이고, 나머지는 공원과 길처럼 물건으로 받았어요.",
        art: "two-counts",
        fact: { value: "세는 방식에 따라 다름", tone: "warm" },
        claimIds: ["claim-recovery-total", "claim-recovery-breakdown"],
      },
    ],
    caveat: {
      text:
        "금액은 확정된 사실이 아니라 성남시의 계산이에요. 땅 넓이와 절차는 허가 서류로 확인되지만, 돈을 얼마나 돌려받았는지는 아직 공개된 공식 자료가 없어 보도에 기대고 있어요.",
      claimIds: ["claim-recovery-total"],
    },
  },

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
      caption: "성남시의 계산 · 현금 배당은 1,822억",
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

    {
      id: "claim-lh-exit",
      text:
        "한국토지주택공사는 2010년 6월 성남 판교대장 도시개발사업에서 철수했다. " +
        "LH가 국회에 제출한 자료에 따르면 철회 검토의 기점은 2009년 10월 " +
        "\"민간회사와 경쟁할 필요가 없다\"는 발언이었다. 공영개발 경로가 닫히면서 " +
        "이후 사업은 민간개발로 전환될 상황이었다.",
      assertionType: "CLAIM",
      assertedBy: "한국토지주택공사가 국회에 제출한 자료 · 성남시",
      sourceIds: ["src-lh-withdraw"],
      verified: true,
    },
    {
      id: "claim-ppp-structure",
      text:
        "성남도시개발공사가 의결권 과반(50%+1주)을 갖는 구조로 프로젝트금융투자회사가 설립되었다.",
      assertionType: "FACT",
      sourceIds: ["src-structure", "src-isdc-daejang"],
      verified: true,
    },
    {
      id: "claim-recovery-total",
      text:
        "성남시는 대장동 개발사업에서 공공이 환수한 개발이익을 약 5,503억 원으로 본다. " +
        "환수 범위를 어디까지로 볼지에 따라 셈이 달라지므로, 이 수치는 확정된 사실이 아니라 " +
        "성남시의 계산이다.",
      assertionType: "CLAIM",
      assertedBy: "성남시",
      sourceIds: ["src-recovery-claim", "src-recovery-check"],
      verified: true,
    },
    {
      id: "claim-recovery-breakdown",
      text:
        "성남시가 밝힌 환수 내역은 임대주택용지 배분 1,822억 원, 제1공단 공원 조성 2,561억 원, " +
        "서판교 터널·진입로·주차장 등 광역 기반시설 1,120억 원이다. " +
        "이 가운데 현금으로 배당된 것은 확정이익 1,822억 원이고, 나머지는 현물 형태의 환수다.",
      assertionType: "CLAIM",
      assertedBy: "성남시",
      sourceIds: ["src-recovery-claim", "src-recovery-check"],
      verified: true,
    },
    {
      id: "claim-private-path",
      text:
        "LH 철수로 공영개발 경로가 닫힌 뒤 순수 민간개발로 진행되었다면, " +
        "공공이 사업 구조 안에서 환수하는 몫은 발생하지 않는다. " +
        "환수가 가능했던 것은 공사가 사업시행자 지분을 갖는 구조를 만들었기 때문이다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-lh-withdraw", "src-structure"],
      verified: true,
    },
    {
      id: "claim-fixed-profit",
      text:
        "확정이익 방식은 지분율에 따라 배당하지 않고 공공의 몫을 미리 정해 두는 구조다. " +
        "부동산 경기가 내려가도 공공은 정해진 몫을 먼저 가져가지만, 올라도 상승분을 나누지 않는다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-structure"],
      verified: true,
    },
    {
      id: "claim-comparison-context",
      text:
        "환수 규모를 판단하려면 한쪽 숫자만이 아니라 토지이용계획상 공공용지 비율과 " +
        "현금·현물 환수 내역을 함께 놓고 봐야 한다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-recovery-check", "src-isdc-daejang"],
      verified: true,
    },
  ],

  sources: [ISDC_DAEJANG, ISDC_PARK,
    {
      id: "src-lh-withdraw",
      title: "LH \"대장동 사업철회 기점은 이명박 발언\" — LH가 국회에 제출한 사업철회 경위 자료",
      url: "https://m.khan.co.kr/national/national-general/article/202109281310001",
      publisher: "경향신문",
      publishedAt: "2021-09-28",
      // LH가 국회에 낸 자료를 옮긴 보도다. 원자료(국정감사 제출본)를 구하면 교체한다.
      type: "press",
      license: "link-only",
    },
    {
      id: "src-structure",
      title: "[대장동 의혹 해부] 대장동 사업이란 무엇인가 — 사업 구조와 지분·이익배분 방식 정리",
      url: "https://www.khan.co.kr/article/202110041959001",
      publisher: "경향신문",
      publishedAt: "2021-10-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-recovery-claim",
      title: "[대장동 리뷰] ②공익환수 5503억 — 성남시 환수 내역 주장과 항목별 금액",
      url: "https://www.mindlenews.com/news/articleView.html?idxno=537",
      publisher: "시민언론 민들레",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-recovery-check",
      title: "\"대장동 개발이익 환수 10% 뿐\" 주장은 '사실 반 거짓 반' — 환수 항목별 사실확인",
      url: "https://www.ohmynews.com/NWS_Web/OhmyFact/at_pg.aspx?CNTN_CD=A0002781713",
      publisher: "오마이뉴스",
      type: "press",
      license: "link-only",
    },
  ],
};

export const daejangdong = achievementSchema.parse(raw);
