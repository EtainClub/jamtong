import { storySchema, type StoryInput } from "@/content/schema";

/**
 * 주식시장 개선 — Sprint 3. 세 번째 스토리.
 *
 * ⚠ publishStatus: "draft"
 *   **모든 수치가 미검증이다.** 출발점이 나무위키였고, 그건 사용자 편집 위키라
 *   우리 근거 체계에 들어갈 수 없다. 단서 목록으로만 썼다.
 *   sources[]의 `src-need-*`가 각 항목에 필요한 1차 자료를 적어 둔 자리다.
 *
 * 이 스토리를 고른 이유는 두 가지다.
 *
 * 1. 전용 개념이 새롭다. 항로(공간)도 자금·면적(몫)도 아닌 시계열이다.
 *    확장 지점이 제대로 설계됐는지 시험한다.
 *
 * 2. 정직성을 시험한다. 지수는 올랐다가 되밀렸다. 고점에서 끊은 차트를 그리면
 *    그건 자료가 아니라 선전물이고, 이 제품의 전제가 무너진다.
 *    그래서 하락 구간까지 전부 싣고, 쟁점 섹션에서 정면으로 다룬다.
 */

const raw: StoryInput = {
  id: "stock-market",
  slug: "stock-market",
  title: "주식시장 개선",
  subtitle: "코리아 디스카운트를 줄이려는 제도 개편",
  kicker: "주요 정책",
  summary:
    "한국 주식시장은 오래 '코리아 디스카운트'라 불리는 저평가를 겪었다. " +
    "정부는 이사의 충실의무 확대, 자사주 소각, 상장폐지 제도 개편 등으로 구조를 손보고 있다. " +
    "지수는 크게 올랐다가 2026년 7월 이후 되밀렸다. 오른 구간과 내린 구간을 함께 본다.",
  type: "event",
  publishStatus: "draft",

  scenes: [
    {
      id: "index-series",
      kind: "index-series",
      heading: "지수는 오르고, 또 내렸습니다",
      lede:
        "오른 구간만 보여주면 자료가 아니라 선전물입니다. 고점 이후 되밀린 구간까지 함께 싣습니다. 아래 연표에서 시점을 옮기면 차트에도 그 시점이 찍힙니다.",
      claimIds: ["claim-index-series", "claim-drawdown"],
      series: {
        name: "코스피",
        unit: "포인트",
        claimId: "claim-index-series",
        note:
          "돌파·붕괴가 보도된 날의 지수대만 표시한 개략 시계열이다. 일별 종가 전체가 아니며, " +
          "마지막 점(2026년 7월 29일) 이후 구간은 아직 반영하지 않았다. " +
          "한국거래소 일별 종가로 대조한 뒤 확정한다.",
        points: [
          { date: "2025-06-11", value: 2900, milestone: true, label: "2,900선" },
          { date: "2025-06-20", value: 3000, milestone: true, label: "3,000선 회복" },
          { date: "2025-06-24", value: 3100, milestone: false },
          { date: "2025-10-27", value: 4000, milestone: true, label: "4,000선" },
          { date: "2026-01-22", value: 5000, milestone: true, label: "5,000선" },
          { date: "2026-02-25", value: 6000, milestone: false },
          { date: "2026-05-06", value: 7000, milestone: false },
          { date: "2026-05-15", value: 8000, milestone: false },
          { date: "2026-06-18", value: 9000, milestone: true, label: "9,000선 · 고점" },
          { date: "2026-07-13", value: 7000, milestone: true, label: "7,000선 하회" },
          { date: "2026-07-29", value: 6000, milestone: true, label: "6,000선 하회" },
        ],
      },

    },
  ],

  keyNumbers: [
    {
      id: "kn-peak",
      label: "코스피 고점",
      value: "9,000",
      unit: "선",
      caption: "2026년 6월 18일",
      claimId: "claim-index-series",
    },
    {
      id: "kn-drawdown",
      label: "고점 대비 하락",
      prefix: "약",
      value: "33",
      unit: "%",
      caption: "9,000 → 6,000 (2026년 7월 29일)",
      claimId: "claim-drawdown",
    },
    {
      id: "kn-marketcap",
      label: "시가총액",
      prefix: "약",
      value: "3,020",
      unit: "조 원",
      caption: "2025년 7월 10일 사상 첫 3천조 돌파",
      claimId: "claim-marketcap",
    },
  ],

  timeline: [
    {
      id: "sm-3000",
      date: "2025-06-20",
      displayDate: "2025년 6월",
      datePrecision: "day",
      title: "코스피 3,000선 회복",
      summary: "새 정부 출범 직후 지수가 3,000선을 회복했다.",
      claimIds: ["claim-index-series"],
    },
    {
      id: "sm-taskforce",
      date: "2025-07",
      displayDate: "2025년 7월",
      datePrecision: "month",
      title: "주가조작 대응 체계 출범",
      summary:
        "부당이득 대비 과징금과 자본시장 퇴출을 포함한 제재 체계가 가동되기 시작했다.",
      claimIds: ["claim-manipulation"],
    },
    {
      id: "sm-withdraw",
      date: "2025-09-15",
      displayDate: "2025년 9월",
      datePrecision: "day",
      title: "대주주 양도세 기준 하향 철회",
      summary:
        "50억 원에서 10억 원으로 낮추려던 안을 철회하고 현행 기준을 유지하기로 했다.",
      claimIds: ["claim-capgains"],
    },
    {
      id: "sm-delisting",
      date: "2026-02-12",
      displayDate: "2026년 2월",
      datePrecision: "day",
      title: "상장폐지 제도 개편 발표",
      summary: "집중관리기간 운영과 상장폐지 요건 강화, 절차 효율화가 포함됐다.",
      claimIds: ["claim-delisting"],
    },
    {
      id: "sm-reform",
      date: "2026-03-18",
      displayDate: "2026년 3월",
      datePrecision: "day",
      title: "자본시장 체질개선 방안 발표",
      summary:
        "신뢰·주주보호·혁신·시장접근성을 축으로 불공정거래 제재, 중복상장 제한, 결제주기 단축 등이 제시됐다.",
      claimIds: ["claim-reform"],
    },
    {
      id: "sm-peak",
      date: "2026-06-18",
      displayDate: "2026년 6월",
      datePrecision: "day",
      title: "코스피 9,000선 — 고점",
      summary: "지수가 9,000선에 닿았다. 이후 하락이 시작된다.",
      claimIds: ["claim-index-series"],
    },
    {
      id: "sm-fall",
      date: "2026-07-29",
      displayDate: "2026년 7월",
      datePrecision: "day",
      title: "6,000선 하회",
      summary:
        "7월 13일 7,000선이 무너졌고, 29일에는 6,000선도 하회했다. 고점 대비 약 33% 하락이다.",
      claimIds: ["claim-drawdown"],
    },
  ],

  counterpoints: [
    {
      id: "sm-cp-fall",
      question: "지수가 결국 되밀렸는데 개선이라고 할 수 있나?",
      response:
        "지수와 제도는 분리해서 봐야 한다. 지수는 금리·환율·해외 증시 등 정책 밖 요인에 크게 좌우되고, 실제로 고점 대비 약 33% 하락했다. 반면 이사 충실의무 확대, 자사주 소각, 상장폐지 요건 강화 같은 제도 변화는 지수와 무관하게 남는다. 이 스토리가 다루는 것은 후자이며, 지수는 그 배경으로만 싣는다.",
      claimIds: ["claim-drawdown", "claim-reform"],
    },
    {
      id: "sm-cp-tax",
      question: "증권거래세를 올리면 투자자 부담이 늘지 않나?",
      response:
        "인상안은 폐지된 금융투자소득세를 되돌리는 취지로 제시됐다. 다만 거래세는 손익과 무관하게 부과되므로 손실을 본 투자자에게도 걸린다는 비판이 있다. 이 항목은 세제개편안 단계이며 확정 내용은 국회 논의 결과에 달려 있다.",
      claimIds: ["claim-transactiontax"],
    },
    {
      id: "sm-cp-causal",
      question: "지수 상승이 정부 정책 때문인가?",
      response:
        "인과를 단정할 수 없다. 같은 기간 글로벌 증시도 올랐고, 반도체 업황과 환율이 함께 움직였다. 이 스토리는 제도 변화의 내용과 시점을 기록할 뿐, 지수 변동의 원인을 정책으로 돌리지 않는다.",
      claimIds: ["claim-index-series"],
    },
  ],

  claims: [
    {
      id: "claim-index-series",
      text:
        "코스피는 2025년 6월 3,000선을 회복한 뒤 2026년 6월 18일 9,000선까지 올랐고, 이후 하락해 2026년 7월 29일 6,000선을 하회했다.",
      assertionType: "FACT",
      sourceIds: ["src-need-krx"],
      verified: false,
    },
    {
      id: "claim-drawdown",
      text: "코스피는 고점 9,000선 대비 약 33% 하락해 2026년 7월 29일 6,000선을 하회했다.",
      assertionType: "FACT",
      sourceIds: ["src-need-krx"],
      verified: false,
    },
    {
      id: "claim-marketcap",
      text: "2025년 7월 10일 유가증권시장 시가총액이 사상 처음 3,000조 원을 넘어 약 3,020조 원을 기록했다.",
      assertionType: "FACT",
      sourceIds: ["src-need-krx"],
      verified: false,
    },
    {
      id: "claim-duty",
      text:
        "이사의 충실의무 대상을 회사에서 주주까지 확대하는 상법 개정이 추진되었다.",
      assertionType: "FACT",
      sourceIds: ["src-need-assembly"],
      verified: false,
    },
    {
      id: "claim-buyback",
      text: "자사주 소각 의무화와 경영권 프리미엄 공유를 포함한 상법 개정이 추진되고 있다.",
      assertionType: "FACT",
      sourceIds: ["src-need-assembly"],
      verified: false,
    },
    {
      id: "claim-manipulation",
      text:
        "주가조작에 대해 부당이득 대비 과징금과 최대 5년의 자본시장 거래 제한을 포함한 제재가 도입되었다.",
      assertionType: "FACT",
      sourceIds: ["src-need-fsc-manipulation"],
      verified: false,
    },
    {
      id: "claim-capgains",
      text:
        "주식 양도소득세 대주주 기준을 50억 원에서 10억 원으로 낮추려던 안이 2025년 9월 15일 철회되어 현행 기준이 유지되었다.",
      assertionType: "FACT",
      sourceIds: ["src-need-moef"],
      verified: false,
    },
    {
      id: "claim-transactiontax",
      text: "증권거래세율을 0.15%에서 0.2%로 인상하는 안이 2025년 세제개편안에 포함되었다.",
      assertionType: "FACT",
      sourceIds: ["src-need-moef"],
      verified: false,
    },
    {
      id: "claim-delisting",
      text:
        "2026년 2월 12일 집중관리기간 운영과 상장폐지 요건 강화를 포함한 상장폐지 제도 개편이 발표되었다.",
      assertionType: "FACT",
      sourceIds: ["src-need-fsc-delisting"],
      verified: false,
    },
    {
      id: "claim-reform",
      text:
        "2026년 3월 18일 신뢰·주주보호·혁신·시장접근성을 축으로 하는 자본시장 체질개선 방안이 발표되었다.",
      assertionType: "FACT",
      sourceIds: ["src-need-fsc-reform"],
      verified: false,
    },
  ],

  sources: [
    {
      id: "src-need-krx",
      title: "[필요] 코스피 일별 종가·시가총액 시계열 — 한국거래소 정보데이터시스템",
      publisher: "미정",
      type: "statistics",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/krx",
    },
    {
      id: "src-need-assembly",
      title: "[필요] 상법 개정안 의안 원문 — 국회 의안정보시스템 또는 국가법령정보센터",
      publisher: "미정",
      type: "legislative",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/assembly",
    },
    {
      id: "src-need-fsc-reform",
      title: "[필요] 자본시장 체질개선 방안 보도자료 (2026-03-18) — 금융위원회",
      publisher: "미정",
      type: "official",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/fsc-reform",
    },
    {
      id: "src-need-fsc-delisting",
      title: "[필요] 상장폐지 제도 개편 보도자료 (2026-02-12) — 금융위원회·한국거래소",
      publisher: "미정",
      type: "official",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/fsc-delisting",
    },
    {
      id: "src-need-fsc-manipulation",
      title: "[필요] 불공정거래 제재 강화 보도자료 — 금융위원회·증권선물위원회",
      publisher: "미정",
      type: "official",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/fsc-manipulation",
    },
    {
      id: "src-need-moef",
      title: "[필요] 2025년 세제개편안 및 대주주 기준 관련 발표 — 기획재정부",
      publisher: "미정",
      type: "official",
      license: "link-only",
      archivedUrl: "https://example.invalid/need/moef",
    },
  ],
};

export const stockMarket = storySchema.parse(raw);
