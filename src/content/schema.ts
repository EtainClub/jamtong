import { z } from "zod";

/**
 * 콘텐츠 스키마.
 *
 * 설계 검토 문서 4.2의 불변식을 타입 수준에서 강제한다:
 *   "근거가 비어 있는 주장은 렌더링하지 않는다."
 *
 * 화면에 나타나는 모든 수치와 단정은 Claim을 거치고,
 * 모든 Claim은 최소 하나의 Source를 가져야 한다.
 */

export const DatePrecision = z.enum(["day", "month", "year", "circa", "unknown"]);
export type DatePrecision = z.infer<typeof DatePrecision>;

/** 8장: 사실 / 주장 / 해석 / 의견을 섞지 않는다. */
export const AssertionType = z.enum(["FACT", "CLAIM", "INTERPRETATION", "OPINION"]);
export type AssertionType = z.infer<typeof AssertionType>;

/** 3장: 저작권 취급 등급. link-only 자료는 원문을 보관하지 않는다. */
export const SourceLicense = z.enum(["public", "quotable", "link-only"]);

export const SourceType = z.enum([
  "official",     // 정부·공공기관 공식 자료
  "statistics",   // 통계
  "legislative",  // 국회·의회·조례
  "judicial",     // 판결·수사 자료
  "interview",    // 인터뷰·발언
  "press",        // 언론 보도
  "research",     // 연구 자료
]);
export type SourceType = z.infer<typeof SourceType>;

export const sourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url().optional(),
  publisher: z.string(),
  publishedAt: z.string().optional(),
  type: SourceType,
  license: SourceLicense,
  archivedUrl: z.string().url().optional(),
  /** license가 quotable/public일 때만 허용되는 짧은 인용. */
  quote: z.string().optional(),
});
export type Source = z.infer<typeof sourceSchema>;

export const claimSchema = z.object({
  id: z.string(),
  text: z.string(),
  assertionType: AssertionType,
  /** CLAIM이면 누구의 주장인지 반드시 밝힌다. */
  assertedBy: z.string().optional(),
  /** ★ 불변식: 근거 없는 주장은 존재할 수 없다. */
  sourceIds: z.array(z.string()).min(1, "근거 없는 Claim은 허용되지 않는다"),
  /** 편집팀 검증 여부. false면 UI에 미검증 표식이 붙는다. */
  verified: z.boolean().default(false),
});
export type Claim = z.infer<typeof claimSchema>;

/** 화면에 뜨는 모든 숫자는 Claim을 가리켜야 한다. */
export const keyNumberSchema = z.object({
  id: z.string(),
  label: z.string(),
  /** "약", "최대" 같은 한정어. 숫자와 분리해 두어야 줄바꿈이 깨지지 않는다. */
  prefix: z.string().optional(),
  value: z.string(),
  unit: z.string().optional(),
  caption: z.string().optional(),
  claimId: z.string(),
});
export type KeyNumber = z.infer<typeof keyNumberSchema>;

export const timelineEventSchema = z.object({
  id: z.string(),
  /**
   * 정렬·비교용 날짜. 반드시 ISO 형태(YYYY / YYYY-MM / YYYY-MM-DD)로 둔다.
   * 관계도가 이 값으로 시점을 필터링하므로 "2026 상반기" 같은 표기를 여기 넣으면
   * 문자열 비교가 어긋난다.
   */
  date: z.string().regex(/^\d{4}(-\d{2}){0,2}$/, "date는 YYYY[-MM[-DD]] 형식이어야 한다"),
  /** 화면 표기가 date와 다를 때만 쓴다. 예: "2026 상반기", "2016~2019" */
  displayDate: z.string().optional(),
  datePrecision: DatePrecision,
  title: z.string(),
  summary: z.string(),
  claimIds: z.array(z.string()).default([]),
});
export type TimelineEvent = z.infer<typeof timelineEventSchema>;

/** 지도 위 경로의 한 꼭짓점. */
export const waypointSchema = z.object({
  id: z.string(),
  name: z.string(),
  lon: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
  /** 출발지 기준 누적 거리(km). 경로 보간과 수치 표시에 쓰인다. */
  cumulativeKm: z.number().min(0),
  /**
   * 이 구간에 도달했을 때 보여줄 한 줄 해설.
   * 항로 자체에 대한 서술만 담는다. 근거가 필요한 주장은 Claim으로 분리한다.
   */
  note: z.string().optional(),
});
export type Waypoint = z.infer<typeof waypointSchema>;

export const routeSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** 대조군인지 여부. 비교 씬에서 회색으로 그린다. */
  isBaseline: z.boolean().default(false),
  waypoints: z.array(waypointSchema).min(2),
  totalKm: z.number(),
  /** 출처가 범위로 제시한 값은 범위 그대로 갖는다. */
  totalDaysMin: z.number(),
  totalDaysMax: z.number(),
  claimId: z.string(),
});
export type Route = z.infer<typeof routeSchema>;

/**
 * 항로 비교 막대.
 *
 * 지도에 올리지 못하는 비교군을 담는다. 희망봉 항로는 남위 34도를 지나는데,
 * 북극 중심 투영은 북위 -10도에서 잘리므로 지도에 그리면 중간에 끊긴다.
 * 지도가 못 보여주는 비교는 차트가 맡는다.
 */
export const routeComparisonSchema = z.object({
  id: z.string(),
  name: z.string(),
  km: z.number().positive(),
  daysMin: z.number().positive(),
  daysMax: z.number().positive(),
  /** 주인공 항로. 막대를 강조색으로 그린다. */
  highlight: z.boolean().default(false),
  claimId: z.string(),
});
export type RouteComparison = z.infer<typeof routeComparisonSchema>;

/**
 * 자금 흐름 (설계서 5장 "경제 → 돈의 흐름").
 *
 * 개발이익이 어디서 발생해 어디로 갔는지를 폭으로 보여준다.
 * 시나리오를 바꾸면 같은 사업이 다른 구조였을 때 어떻게 달라지는지 비교된다.
 *
 * 설계 원칙: 노드는 **기관과 용처**만 담는다. 실존 개인은 올리지 않는다.
 * 제도와 자금 흐름만으로 구조가 설명되며, 그것이 법적 노출도 줄인다.
 * (설계 검토 문서 2.2)
 */
export const flowAllocationSchema = z.object({
  id: z.string(),
  label: z.string(),
  /** 억 원 단위. 0도 유효한 값이다 — "환수 없음"이 곧 논지인 시나리오가 있다. */
  amountEok: z.number().min(0),
  kind: z.enum(["public", "private", "none"]),
  detail: z.string().optional(),
  claimId: z.string(),
});
export type FlowAllocation = z.infer<typeof flowAllocationSchema>;

export const flowScenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  /** 실제로 추진된 구조인지, 비교를 위한 가정인지. 섞이면 안 된다. */
  isActual: z.boolean(),
  allocations: z.array(flowAllocationSchema).min(1),
  claimId: z.string(),
});
export type FlowScenario = z.infer<typeof flowScenarioSchema>;

export const moneyFlowSchema = z.object({
  sourceLabel: z.string(),
  unitLabel: z.string().default("억 원"),
  /**
   * 합계 줄에 적을 말. 이 씬이 '환수'만 그리는 게 아니다 —
   * 예산이 갈라지는 것도 같은 모양이다. 무엇의 합계인지는 콘텐츠가 말한다.
   */
  totalLabel: z.string().default("공공 환수 합계"),
  scenarios: z.array(flowScenarioSchema).min(1),
  /** 비교의 전제. 숨기면 오도가 된다. */
  note: z.string().optional(),
});
export type MoneyFlow = z.infer<typeof moneyFlowSchema>;

/**
 * 구성 — "전체가 무엇으로 이루어져 있나".
 *
 * 원래 대장동의 토지이용 전용이었다(면적 ㎡ 고정, 주거/상업/공공 분류 고정).
 * 무상급식의 학교 수·학생 수에 같은 그림이 필요해지면서 단위와 분류를 열었다.
 * 종류를 하나 더 만드는 대신 있던 것을 넓힌다 — 같은 그림을 두 번 그리면
 * 둘이 갈라진다.
 *
 * tone은 의미가 아니라 강조다. 논지가 되는 몫에 primary를 준다.
 * 대장동에서는 공공용지가, 무상급식에서는 이 시정이 넓힌 몫이 그 자리다.
 */
export const compositionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  amount: z.number().min(0),
  sharePercent: z.number().min(0).max(100),
  tone: z.enum(["primary", "neutral", "accent"]).default("neutral"),
  detail: z.string().optional(),
});
export type CompositionItem = z.infer<typeof compositionItemSchema>;

export const compositionSchema = z.object({
  total: z.number().positive(),
  /** 단위. "㎡", "명", "곳" 처럼 숫자 뒤에 그대로 붙는다. */
  unit: z.string(),
  /** 전체를 무엇이라 부를지. "전체 사업 면적", "무상급식 대상 학생". */
  totalLabel: z.string(),
  /** 최상위 구성. 합이 100%가 되어야 한다. 그리는 순서는 여기 적은 순서다. */
  groups: z.array(compositionItemSchema).min(1),
  /** 한 몫을 더 펴 보일 때. 비어 있으면 그리지 않는다. */
  breakdown: z.array(compositionItemSchema).default([]),
  /** 그 내역이 무엇의 내역인지. breakdown이 있으면 필요하다. */
  breakdownLabel: z.string().optional(),
  /**
   * 내역의 단위. 생략하면 unit을 쓴다.
   *
   * 전체와 내역이 다른 것을 셀 수 있다. 무상급식은 학생 수를 나눈 뒤 학교 수를
   * 편다. 여기가 없으면 학교 78곳이 "78 명"으로 나온다.
   */
  breakdownUnit: z.string().optional(),
  claimId: z.string(),
  note: z.string().optional(),
  /**
   * 항목 합과 전체의 허용 오차(단위 그대로).
   *
   * 1차 자료가 제 하위 항목과 어긋나는 경우가 있다. 그때는 자료에 적힌 값을
   * 그대로 싣되 오차를 명시적으로 선언하게 한다. 조용히 눈감지 않는다.
   * 1을 넘게 열어 두려면 note에 이유를 적어야 한다.
   */
  sumTolerance: z.number().min(0).default(1),
});
export type Composition = z.infer<typeof compositionSchema>;

/**
 * 쟁점과 답변 (설계 검토 문서 2.1).
 *
 * 관점을 가진 매체일수록 반론을 빼면 안 된다. 반론을 회피하면 그 자체가
 * 공격 지점이 되고, 반론에 근거로 답하면 그것이 무기가 된다.
 * 그래서 이 필드는 쟁점형 스토리에서 **스키마가 요구한다**.
 */
export const counterpointSchema = z.object({
  id: z.string(),
  question: z.string(),
  response: z.string(),
  /** 답변의 근거. 비어 있으면 렌더링하지 않는다. */
  claimIds: z.array(z.string()).min(1, "반론에 대한 답변에도 근거가 필요하다"),
});
export type Counterpoint = z.infer<typeof counterpointSchema>;

/* ────────────────────────────────────────────────────────────────
 * 분야
 *
 * 스물둘을 한 줄로 늘어놓으면 무엇이 무엇인지 보이지 않는다. 묶어야 하는데,
 * **묶는 축은 하나만 고른다**. 분야와 시기를 동시에 묶으면 같은 업적이 두 곳에
 * 나오고, 읽는 사람은 그 둘이 다른 것인지 같은 것인지부터 의심한다.
 *
 * ★ '기타'를 두지 않는다.
 *   기타가 생기면 분류가 아니라 쓰레기통이 된다. 스물둘을 다 넣어 보고 남는
 *   것이 없게 분야를 잡았다 — 남는 것이 생기면 분야 쪽을 고친다.
 *
 * ★ 하나에 하나만.
 *   원유 수입처 다변화는 외교이면서 경제이고, KTX 통합은 인프라이면서 민생이다.
 *   그래도 한 곳에만 둔다. 여러 곳에 두면 합이 스물둘이 아니게 되고, "몇 건"이
 *   무슨 뜻인지 설명할 수 없게 된다. 어느 쪽에 둘지는 **그 업적이 무엇을 바꿨나**로
 *   정한다. 원유는 값이 아니라 받아 오는 나라를 바꿨으므로 외교다.
 * ──────────────────────────────────────────────────────────────── */

export const AchievementCategory = z.enum([
  "diplomacy", // 외교·안보 — 나라 밖과의 관계, 자원, 안보
  "institution", // 제도·행정 — 법과 기관, 그리고 그 집행
  "welfare", // 민생·복지 — 사람에게 직접 가는 것
  "region", // 지역·인프라 — 땅과 길과 도시
  "economy", // 재정·경제 — 살림과 시장
  "disaster", // 재난 대응 — 닥친 일에 대한 대응
]);
export type AchievementCategory = z.infer<typeof AchievementCategory>;

export const achievementSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  kicker: z.string(),
  /**
   * 이 업적이 서는 자리. 목록에서 묶는 기준이다.
   *
   * ★ 여럿에 걸칠 수 있다. 앞의 것이 대표다.
   *   원유 수입처 다변화는 외교이면서 경제이고, KTX 통합은 인프라이면서
   *   경제다. 예전에는 하나만 고르게 했는데, 한 분야만 열어 보는 사람이
   *   그 분야와 맞물린 업적을 통째로 못 보게 된다 — 경제만 보는 사람에게
   *   원유가 안 보이는 식이다. 분야는 서랍이 아니라 들어가는 문이므로
   *   문이 여럿이어도 된다.
   *
   *   그 대신 분야별 건수의 합은 전체 건수보다 크다. 화면에서 그 둘을
   *   나란히 두지 않는다 — 분야 칸에는 그 분야의 건수를, 전체 건수는
   *   따로 적는다.
   *
   * 기본값을 두지 않는다. 어디에 둘지는 편집 판단이고, 판단을 빠뜨린 것과
   * 판단해서 그곳에 둔 것은 다른 일이다. 새 업적을 만들면 여기서 막힌다.
   */
  categories: z.array(AchievementCategory).min(1, "분야를 하나는 골라야 한다"),
  summary: z.string(),
  type: z.enum(["achievement", "policy", "event"]),
  /**
   * draft는 프로덕션 빌드에서 차단된다(validateAchievement).
   * 검증 전 골격이 실수로 공개되는 경로를 아예 없앤다.
   */
  publishStatus: z.enum(["draft", "published"]).default("draft"),
  /**
   * 홈 첫 화면에 세울지.
   *
   * 업적이 열여섯이 되면서 히어로를 전부 세우면 스와이프로 열여섯 장을 넘겨야
   * 한다. 그렇다고 화면이 임의로 몇 개를 고르면 "왜 이것들인가"에 답할 수 없다.
   * 그래서 콘텐츠가 정한다. 고르는 기준은 완성도가 아니라 **서로 다른 것을
   * 보여주는가**다 — 시기와 종류와 화면이 겹치지 않게 고른다.
   *
   * 감추는 것이 아니다. 바로 아래 줄에 전체가 있고, 히어로에도 몇 건 중 몇 건을
   * 세운 것인지 적는다.
   */
  featured: z.boolean().default(false),
  /**
   * 근거의 한계. 무엇에 기대고 있고 무엇이 아직 대조되지 않았는지.
   *
   * 미검증이 0이어도 자료의 무게는 고르지 않을 수 있다 — 면적은 공공기관
   * 자료인데 금액은 보도인 식이다. 공개했다고 이 사정이 사라지지 않으므로,
   * 초안일 때는 배너로, 공개된 뒤에는 조용한 한 줄로 계속 보인다.
   * 공개한다는 것이 한계를 감춘다는 뜻은 아니다.
   */
  sourceNote: z.string().optional(),
  /** 스토리 전용 개념. 종류마다 데이터가 다르고, 전부 claimIds를 갖는다. */
  scenes: z.lazy(() => z.array(sceneSchema)).default([]),
  keyNumbers: z.array(keyNumberSchema).default([]),
  /** ⑦ 쇼츠. 이 업적을 짧게 전하는 세로 영상. 정의는 아래에 있어 lazy로 건다. */
  shorts: z.lazy(() => z.array(shortSchema)).default([]),
  /**
   * 공유 카드에 실을 대표 수치. 생략하면 keyNumbers의 첫 항목을 쓴다.
   * 화면에 놓는 순서와 "이 스토리를 한 숫자로 말하면"이 늘 같지는 않다.
   */
  headlineKeyNumberId: z.string().optional(),
  timeline: z.array(timelineEventSchema).default([]),
  graph: z.lazy(() => graphSchema).optional(),
  eli5: z.lazy(() => eli5Schema).optional(),
  counterpoints: z.array(counterpointSchema).default([]),
  claims: z.array(claimSchema).default([]),
  sources: z.array(sourceSchema).default([]),
});
export type Achievement = z.infer<typeof achievementSchema>;

/**
 * 콘텐츠 파일이 쓰는 입력 타입.
 * 기본값이 채워지기 전 형태이므로 default가 있는 필드를 생략할 수 있다.
 */
export type AchievementInput = z.input<typeof achievementSchema>;

/**
 * 참조 무결성 검사. 빌드/CI에서 실행한다.
 * 존재하지 않는 id를 가리키는 순간 빌드를 깬다.
 */
export function validateAchievement(achievement: Achievement): string[] {
  const errors: string[] = [];
  const sourceIds = new Set(achievement.sources.map((s) => s.id));
  const claimIds = new Set(achievement.claims.map((c) => c.id));

  for (const claim of achievement.claims) {
    for (const sid of claim.sourceIds) {
      if (!sourceIds.has(sid)) {
        errors.push(`claim "${claim.id}" → 존재하지 않는 source "${sid}"`);
      }
    }
    if (claim.assertionType === "CLAIM" && !claim.assertedBy) {
      errors.push(`claim "${claim.id}" → assertionType이 CLAIM인데 assertedBy가 없다`);
    }
  }

  const checkClaimRef = (owner: string, cid: string) => {
    if (!claimIds.has(cid)) errors.push(`${owner} → 존재하지 않는 claim "${cid}"`);
  };

  for (const n of achievement.keyNumbers) checkClaimRef(`keyNumber "${n.id}"`, n.claimId);
  for (const e of achievement.timeline) {
    for (const cid of e.claimIds) checkClaimRef(`event "${e.id}"`, cid);
  }

  // 씬 검사는 한 곳으로 모은다. 종류가 늘어도 여기는 그대로다.
  const sceneIds = new Set<string>();
  for (const scene of achievement.scenes) {
    if (sceneIds.has(scene.id)) errors.push(`씬 id가 중복이다: "${scene.id}"`);
    sceneIds.add(scene.id);
    for (const error of validateScene(scene, checkClaimRef)) errors.push(error);
  }

  if (achievement.graph) {
    for (const error of validateGraph(achievement.graph, claimIds)) errors.push(error);
  }

  if (achievement.eli5) {
    for (const scene of achievement.eli5.scenes) {
      for (const cid of scene.claimIds) checkClaimRef(`eli5 장면 "${scene.id}"`, cid);
    }
    for (const cid of achievement.eli5.caveat?.claimIds ?? []) {
      checkClaimRef("eli5 단서", cid);
    }
    const seenArt = new Set<string>();
    for (const scene of achievement.eli5.scenes) {
      if (seenArt.has(scene.art)) {
        errors.push(`eli5 → 삽화 "${scene.art}"가 두 장면에 쓰였다`);
      }
      seenArt.add(scene.art);
    }
  }

  for (const cp of achievement.counterpoints) {
    for (const cid of cp.claimIds) checkClaimRef(`counterpoint "${cp.id}"`, cid);
  }

  // 쟁점형 스토리는 반론 섹션을 비워 둘 수 없다.
  if (achievement.type === "event" && achievement.counterpoints.length === 0) {
    errors.push(`achievement "${achievement.slug}" → 쟁점형 스토리에는 counterpoints가 필요하다`);
  }

  if (
    achievement.headlineKeyNumberId &&
    !achievement.keyNumbers.some((k) => k.id === achievement.headlineKeyNumberId)
  ) {
    errors.push(
      `achievement "${achievement.slug}" → headlineKeyNumberId "${achievement.headlineKeyNumberId}"에 해당하는 keyNumber가 없다`,
    );
  }

  // 공개 스토리에 미검증 주장이 남아 있으면 빌드를 깬다.
  if (achievement.publishStatus === "published") {
    for (const claim of achievement.claims) {
      if (!claim.verified) {
        errors.push(`published 스토리에 미검증 claim이 있다: "${claim.id}"`);
      }
    }
  }

  for (const s of achievement.sources) {
    if (s.license === "link-only" && s.quote) {
      errors.push(`source "${s.id}" → link-only 자료에 quote를 담을 수 없다`);
    }
    if (!s.url && !s.archivedUrl) {
      errors.push(`source "${s.id}" → url 또는 archivedUrl 중 하나는 필요하다`);
    }
  }

  return errors;
}

/* ────────────────────────────────────────────────────────────────
 * 성과 카드
 *
 * Visual Story는 하나에 몇 주가 든다. 그 방식만으로는 수백 건의 정책을
 * 덮을 수 없고, 콘텐츠가 비어 있는 제품은 엔진이 아무리 좋아도 성립하지 않는다.
 *
 * 그래서 두 계층을 둔다.
 *   카드  — 가볍게 넓게 덮는다. 항목당 근거 1건 이상.
 *   스토리 — 그중 깊이 다룰 것만 승격한다.
 *
 * 카드라고 해서 근거 원칙이 느슨해지지는 않는다. 4.2 불변식은 그대로 적용된다.
 * ──────────────────────────────────────────────────────────────── */

export const Category = z.enum([
  "economy", // 경제·물류
  "welfare", // 복지
  "labor", // 노동
  "health", // 보건
  "environment", // 환경·안전
  "fisheries", // 수산
  "region", // 지역균형
  "diplomacy", // 외교·안보
  "science", // 과학기술
  "education", // 교육
  "culture", // 문화·체육
]);
export type Category = z.infer<typeof Category>;

/** 진행 상태. 계획을 성과처럼 보이게 하지 않으려면 이 구분이 필요하다. */
export const MilestoneStatus = z.enum(["done", "ongoing", "planned"]);
export type MilestoneStatus = z.infer<typeof MilestoneStatus>;

export const milestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  categories: z.array(Category).min(1),
  /** 누구에게 해당되는 일인지. 비어 있어도 된다. */
  audiences: z.array(z.string()).default([]),
  status: MilestoneStatus,
  date: z.string(),
  datePrecision: DatePrecision,
  /** ★ 불변식: 근거 없는 카드는 존재할 수 없다. */
  claimIds: z.array(z.string()).min(1, "근거 없는 성과 카드는 허용되지 않는다"),
  /** 눈에 띄는 수치가 있으면 카드 앞면에 하나만 올린다. */
  highlight: z.object({ value: z.string(), label: z.string() }).optional(),
  /** Visual Story로 승격된 경우 그 slug. */
  achievementSlug: z.string().optional(),
});
export type Milestone = z.infer<typeof milestoneSchema>;
export type MilestoneInput = z.input<typeof milestoneSchema>;

export interface MilestoneCollection {
  milestones: Milestone[];
  claims: Claim[];
  sources: Source[];
}

export function validateMilestones(collection: MilestoneCollection): string[] {
  const errors: string[] = [];
  const sourceIds = new Set(collection.sources.map((s) => s.id));
  const claimIds = new Set(collection.claims.map((c) => c.id));
  const seen = new Set<string>();

  for (const claim of collection.claims) {
    for (const sid of claim.sourceIds) {
      if (!sourceIds.has(sid)) {
        errors.push(`claim "${claim.id}" → 존재하지 않는 source "${sid}"`);
      }
    }
    if (claim.assertionType === "CLAIM" && !claim.assertedBy) {
      errors.push(`claim "${claim.id}" → assertionType이 CLAIM인데 assertedBy가 없다`);
    }
  }

  for (const item of collection.milestones) {
    if (seen.has(item.id)) errors.push(`성과 카드 id가 중복이다: "${item.id}"`);
    seen.add(item.id);

    for (const cid of item.claimIds) {
      if (!claimIds.has(cid)) {
        errors.push(`성과 카드 "${item.id}" → 존재하지 않는 claim "${cid}"`);
      }
    }
  }

  return errors;
}

/* ────────────────────────────────────────────────────────────────
 * 관계도 (설계서 6·7장)
 *
 * 가장 중요한 규칙: **Edge에 반드시 의미가 있어야 한다.**
 *   나쁜 예   A ───── B
 *   좋은 예   A ──[2015 사업협약 · 근거 2건]──▶ B
 *
 * 그리고 관계는 시간에 따라 변한다. 타임라인 커서가 움직이면 그 시점에
 * 존재하던 관계만 남는다. 이 둘의 결합이 이 제품의 차별점이다.
 * ──────────────────────────────────────────────────────────────── */

export const EntityKind = z.enum([
  "government", // 정부·부처
  "organization", // 공공기관·국제기구
  "company", // 기업·민간사업자
  "project", // 사업·프로젝트
  "place", // 장소·항만·지역
  "country", // 국가
  /**
   * 사람의 무리. 일반주주·지배주주처럼 기관이 아니라 '입장'이 같은 집단이다.
   * 실존 개인은 올리지 않는다는 원칙은 그대로다 — 집단이지 사람이 아니다.
   */
  "group", // 주주·투자자 등 입장이 같은 집단
]);
export type EntityKind = z.infer<typeof EntityKind>;

/**
 * 이 노드가 법적으로 누구인가 (검토 문서 3장).
 *
 * `kind`와 겹쳐 보이지만 보는 것이 다르다. `kind`는 화면에서 무엇으로
 * 그릴지를 정하고, 이것은 **무엇을 적어도 되는지**를 정한다. 한국은 사실
 * 적시도 명예훼손이 되고(정보통신망법 §70①), 그 위험은 상대가 사인일 때
 * 가장 크다.
 *
 *   public-figure       공직자·후보처럼 공적 검증의 대상
 *   organization        기관·기업·사업·장소·국가·집단
 *   private-individual  실존 사인 — **올리지 않는다**
 */
export const SubjectType = z.enum(["public-figure", "organization", "private-individual"]);
export type SubjectType = z.infer<typeof SubjectType>;

/** kind로 정해지는 기본값. 사람 노드가 생길 때만 entity가 직접 적는다. */
const SUBJECT_BY_KIND: Record<EntityKind, SubjectType> = {
  government: "organization",
  organization: "organization",
  company: "organization",
  project: "organization",
  place: "organization",
  country: "organization",
  group: "organization",
};

export const entitySchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: EntityKind,
  /**
   * 적지 않으면 kind에서 정해진다. 지금 EntityKind에는 사람이 없어서 전부
   * organization이 된다 — 사람 노드를 처음 세우는 사람이 이 칸을 마주하게
   * 하려고 스키마에 둔다. 나중에 붙이면 그때는 마이그레이션이 된다.
   */
  subjectType: SubjectType.optional(),
  description: z.string().optional(),
  /** 화면 중앙에 두고 나머지를 둘러 배치한다. 스토리당 하나만. */
  isFocus: z.boolean().default(false),
});
export type Entity = z.infer<typeof entitySchema>;

/** 이 노드를 어떤 대상으로 다뤄야 하는가. 적혀 있으면 그것, 아니면 kind에서. */
export function subjectTypeOf(entity: Entity): SubjectType {
  return entity.subjectType ?? SUBJECT_BY_KIND[entity.kind];
}

export const relationSchema = z.object({
  id: z.string(),
  fromId: z.string(),
  toId: z.string(),
  /** Edge에 붙는 의미. 비워 둘 수 없다. */
  label: z.string().min(1, "의미 없는 Edge는 허용되지 않는다"),
  /** 관계가 성립한 시점. 타임라인 필터의 기준이다. */
  startDate: z.string(),
  startPrecision: DatePrecision,
  endDate: z.string().optional(),
  /**
   * 끝난 시점을 얼마나 아는가 (검토 문서 4.1).
   *
   * 시작에만 precision이 있었다. 관계가 언제 끝났는지는 대개 시작보다 더
   * 흐린데, 그것을 적을 칸이 없으면 흐린 날짜가 확정된 날짜처럼 그려진다.
   */
  endPrecision: DatePrecision.optional(),
  assertionType: AssertionType,
  assertedBy: z.string().optional(),
  /** ★ 불변식: 근거 없는 관계는 그리지 않는다. */
  claimIds: z.array(z.string()).min(1, "근거 없는 Relation은 허용되지 않는다"),
  /** 양방향 협력이면 화살표를 양쪽에 둔다. */
  bidirectional: z.boolean().default(false),
});
export type Relation = z.infer<typeof relationSchema>;

export const graphSchema = z.object({
  entities: z.array(entitySchema).min(2),
  relations: z.array(relationSchema).min(1),
  note: z.string().optional(),
});
export type Graph = z.infer<typeof graphSchema>;

export function validateGraph(graph: Graph, claimIds: Set<string>): string[] {
  const errors: string[] = [];
  const entityIds = new Set(graph.entities.map((e) => e.id));

  const focusCount = graph.entities.filter((e) => e.isFocus).length;
  if (focusCount > 1) errors.push(`graph → isFocus 노드가 ${focusCount}개다 (최대 1개)`);

  for (const relation of graph.relations) {
    if (!entityIds.has(relation.fromId)) {
      errors.push(`relation "${relation.id}" → 존재하지 않는 entity "${relation.fromId}"`);
    }
    if (!entityIds.has(relation.toId)) {
      errors.push(`relation "${relation.id}" → 존재하지 않는 entity "${relation.toId}"`);
    }
    if (relation.fromId === relation.toId) {
      errors.push(`relation "${relation.id}" → 자기 자신을 가리킨다`);
    }
    for (const cid of relation.claimIds) {
      if (!claimIds.has(cid)) {
        errors.push(`relation "${relation.id}" → 존재하지 않는 claim "${cid}"`);
      }
    }
    if (relation.assertionType === "CLAIM" && !relation.assertedBy) {
      errors.push(`relation "${relation.id}" → CLAIM인데 assertedBy가 없다`);
    }
    if (relation.endDate && relation.endDate < relation.startDate) {
      errors.push(`relation "${relation.id}" → endDate가 startDate보다 이르다`);
    }
    /* 끝난 날짜를 적었으면 얼마나 아는지도 적는다. 둘은 한 쌍이다. */
    if (relation.endDate && !relation.endPrecision) {
      errors.push(`relation "${relation.id}" → endDate가 있는데 endPrecision이 없다`);
    }
    if (!relation.endDate && relation.endPrecision) {
      errors.push(`relation "${relation.id}" → endPrecision만 있고 endDate가 없다`);
    }
  }

  /*
   * 실존 사인은 그리지 않는다 (검토 문서 3장).
   *
   * 지금까지 이 원칙은 EntityKind 옆 주석에만 있었다. 주석은 빌드를 멈추지
   * 못한다. subjectType이 생겼으므로 여기서 막는다.
   */
  for (const entity of graph.entities) {
    if (subjectTypeOf(entity) === "private-individual") {
      errors.push(
        `entity "${entity.id}" → 실존 사인은 관계도에 올리지 않는다 (검토 문서 3장)`,
      );
    }
  }

  // 어느 관계에도 등장하지 않는 노드는 빈 점으로 남는다.
  const connected = new Set(graph.relations.flatMap((r) => [r.fromId, r.toId]));
  for (const entity of graph.entities) {
    if (!connected.has(entity.id)) {
      errors.push(`entity "${entity.id}" → 어떤 relation에도 연결되지 않았다`);
    }
  }

  return errors;
}

/* ────────────────────────────────────────────────────────────────
 * 쇼츠 — 업적 하나를 짧게 전하는 세로 영상 (구성요소 ⑦)
 *
 * 영상은 편집자가 유튜브에 올리고, 여기에는 id만 적는다. 저장소에 영상을 두면
 * 몇 편 만에 무거워지고 빌드도 같이 느려진다. 유튜브에 원본이 있으면 그쪽
 * 유입도 생긴다.
 *
 * 쇼츠는 전역 목록이 아니라 **업적에 속한다.** 목록으로 따로 늘어놓으면
 * 업적이 단위로 보이지 않는다. 한 업적 페이지 안에서 나머지 여섯 구성요소와
 * 함께 놓인다.
 *
 * 영상이라고 근거 원칙이 느슨해지지 않는다. 짧을수록 맥락이 잘리므로
 * 오히려 출처가 더 중요하다.
 * ──────────────────────────────────────────────────────────────── */

export const shortSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  /**
   * 유튜브 영상 id. URL이 아니라 id만 적는다 —
   * youtube.com/shorts/<id>, youtu.be/<id>, watch?v=<id> 가 모두 같은 영상이다.
   */
  youtubeId: z.string().regex(/^[\w-]{11}$/, "유튜브 영상 id는 11자다"),
  durationSec: z.number().positive().optional(),
  /** ★ 불변식: 근거 없는 쇼츠는 올리지 않는다. */
  claimIds: z.array(z.string()).min(1, "근거 없는 쇼츠는 허용되지 않는다"),
  publishedAt: z.string().optional(),
});
export type Short = z.infer<typeof shortSchema>;
export type ShortInput = z.input<typeof shortSchema>;

/* ────────────────────────────────────────────────────────────────
 * 쉬운 설명 (eli5)
 *
 * 같은 내용을 아무것도 모르는 사람에게 여섯 장면쯤으로 전한다.
 *
 * 장면마다 근거를 따로 매단다. 쉽게 쓸수록 한 문장이 감당하는 주장이 커지기
 * 때문이다. "북극으로 가면 빨라요" 한 줄 뒤에는 거리 비교 자료가 있어야 한다.
 * ──────────────────────────────────────────────────────────────── */

/** 장면 삽화 키. 스토리별 SVG 컴포넌트 레지스트리와 맞춘다. */
export const Eli5Art = z.enum([
  "suez-long",
  "arctic-short",
  "compare-bars",
  "season",
  "icebreaker",
  "trial-voyage",

  "empty-land",
  "lh-exit",
  "half-share",
  "land-split",
  "old-factory-park",
  "two-counts",

  "up-down",
  "many-owners",
  "burn-share",
  "share-premium",
  "penalty",
  "exit-gate",

  "uniform-free",
  "postpartum-free",
  "youth-dividend",
  "three-together",
  "gov-block",
  "case-dropped",

  "inherited-debt",
  "wrong-pocket",
  "declare-moratorium",
  "tighten-belt",
  "paid-off",
  "debt-zero",

  "hospital-closed",
  "citizens-petition",
  "rejected-twice",
  "passed-third",
  "ground-broken",
  "hospital-open",

  "lunch-pay",
  "first-grade-only",
  "step-by-step",
  "all-compulsory",
  "high-school-too",
  "lunch-count",

  // 경기도 청정계곡
  "valley-blocked",
  "valley-public",
  "valley-notice",
  "valley-selfremove",
  "valley-force",
  "valley-open",

  // 경기도 재난기본소득·지역화폐
  "basic-everyone",
  "basic-localcard",
  "basic-expire",
  "basic-shops",
  "basic-rounds",
  "basic-top12",

  // 경기도 신천지 대응
  "covid-spread",
  "covid-order",
  "covid-entry",
  "covid-list",
  "covid-calls",
  "covid-speed",

  // 경기도 수술실 CCTV
  "or-closed",
  "or-firstcam",
  "or-consent",
  "or-sixhospitals",
  "or-private",
  "or-nationwide",

  // 경기도 건설 불공정 단속
  "cost-hidden",
  "cost-open",
  "paper-shell",
  "paper-check",
  "paper-caught",
  "bid-drop",

  // 경기도 아동급식
  "meal-cheap",
  "meal-convenience",
  "meal-raise",
  "meal-anywhere",
  "meal-samecard",
  "meal-table",

  // 경기도 극저신용대출
  "loan-refused",
  "loan-loanshark",
  "loan-lend",
  "loan-repay",
  "loan-only",

  // 경기도 위안부 피해자 지원
  "cw-few",
  "cw-ordinance",
  "cw-raise",
  "cw-berlin",
  "cw-remember",

  // 일산대교 무료화
  "br-toll",
  "br-free",
  "br-court",
  "br-back",
  "br-record",

  // 검찰개혁
  "pr-onehand",
  "pr-split",
  "pr-law",
  "pr-newoffice",
  "pr-staffing",
  "pr-notyet",

  // 사법개혁
  "jr-final",
  "jr-constitution",
  "jr-distort",
  "jr-bench",
  "jr-three",

  // KTX·SRT 통합
  "rail-two",
  "rail-merge",
  "rail-fare",
  "rail-seats",
  "rail-oneapp",
  "sub-ask",
  "sub-approve",
  "sub-where",
  "sub-fuel",
  "sub-years",
  "min-lithium",
  "min-map",
  "min-papers",
  "min-contract",
  "min-oil-ship",
  "oil-mideast",
  "oil-spread",
  "oil-freight",
  "oil-swap",
  "oil-cap",
]);
export type Eli5Art = z.infer<typeof Eli5Art>;

export const eli5SceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  /** 한두 문장. 길어지면 쉬운 설명이 아니게 된다. */
  say: z.string(),
  art: Eli5Art,
  fact: z
    .object({
      value: z.string(),
      tone: z.enum(["ice", "warm"]).default("ice"),
    })
    .optional(),
  /** ★ 불변식: 근거 없는 장면은 그리지 않는다. */
  claimIds: z.array(z.string()).min(1, "근거 없는 eli5 장면은 허용되지 않는다"),
});
export type Eli5Scene = z.infer<typeof eli5SceneSchema>;

export const eli5Schema = z.object({
  intro: z.string(),
  scenes: z.array(eli5SceneSchema).min(2),
  /**
   * 아직 정해지지 않은 것. 쉽게 설명한다고 확정되지 않은 것을 확정된 것처럼
   * 전하면 안 되므로, 단서가 있는 주제에서는 이 칸을 채운다.
   */
  caveat: z.object({ text: z.string(), claimIds: z.array(z.string()).min(1) }).optional(),
});
export type Eli5 = z.infer<typeof eli5Schema>;

/* ────────────────────────────────────────────────────────────────
 * 수량 추이
 *
 * 문서로 확인된 시점들을 지나며 한 수치가 변한다. 빚이 줄고, 세월이 쌓이고,
 * 대상이 넓어진다. 지수 시계열과 다른 점은 **촘촘한 값이 없다는 것**이다.
 * 시계열은 매일의 종가가 있지만, 행정 기록은 선언한 날과 끝낸 날만 남는다.
 *
 * 그래서 이 씬은 자료가 있는 시점만 주장하고, 그 사이는 잇기만 한다.
 * 사이 값을 자료처럼 내보이지 않는 일이 이 씬의 전부다 — 화면에서 큰 숫자가
 * 흐르더라도, 근거가 붙는 것은 언제나 시점의 값이다.
 * ──────────────────────────────────────────────────────────────── */
export const quantityCheckpointSchema = z.object({
  id: z.string(),
  /** 화면에 그대로 적는 날짜. "2010년 7월"처럼 자료의 정밀도를 따른다. */
  displayDate: z.string(),
  title: z.string(),
  /** 그 시점의 값. 자료에 적힌 값이어야 한다. */
  amount: z.number().min(0),
  caption: z.string().optional(),
  /** 이 시점에 띄울 삽화. 쉬운 설명과 같은 그림을 쓴다. */
  art: Eli5Art.optional(),
  claimId: z.string(),
});
export type QuantityCheckpoint = z.infer<typeof quantityCheckpointSchema>;

export const quantityTrackSchema = z.object({
  /** 무엇을 세는지. "성남시가 갚아야 할 빚". */
  label: z.string(),
  unit: z.string(),
  /** 느는 이야기인가 주는 이야기인가. 색과 문구가 갈린다. */
  direction: z.enum(["up", "down"]),
  /** 막대의 기준값. 보통 최댓값이다. */
  max: z.number().positive(),
  checkpoints: z.array(quantityCheckpointSchema).min(2, "시점이 둘은 있어야 추이가 된다"),
  /**
   * 값의 성격에 단서가 필요할 때.
   *
   * 시점 사이 값이 자료에 없다는 사실은 렌더러가 늘 적는다. 여기에는 그
   * 업적에만 해당하는 사정을 적는다 — 날짜에서 계산한 값이라든지.
   */
  note: z.string().optional(),
});
export type QuantityTrack = z.infer<typeof quantityTrackSchema>;

/* ────────────────────────────────────────────────────────────────
 * 지수 시계열
 *
 * 세 번째 스토리가 들고 온 전용 개념. 공간(항로)도 몫(자금·면적)도 아닌
 * **시간에 따른 한 숫자의 움직임**이다.
 *
 * 설계 원칙 하나를 스키마가 강제한다: 구간을 잘라낼 수 없다.
 * 오른 데까지만 그리고 멈추면 그건 자료가 아니라 선전물이다.
 * peak 이후 값이 있으면 그것도 반드시 실려야 한다(validateIndexSeries).
 * ──────────────────────────────────────────────────────────────── */

export const indexPointSchema = z.object({
  /** 정렬·비교용 ISO 날짜. 연표 커서와 같은 축을 쓴다. */
  date: z.string().regex(/^\d{4}(-\d{2}){0,2}$/, "date는 YYYY[-MM[-DD]] 형식이어야 한다"),
  value: z.number(),
  /** 눈금으로 표시할 지점인지. 돌파·붕괴처럼 의미가 있는 곳만. */
  milestone: z.boolean().default(false),
  label: z.string().optional(),
});
export type IndexPoint = z.infer<typeof indexPointSchema>;

/**
 * 제도 축.
 *
 * 지수와 같은 시간축 위에 놓이는 두 번째 줄기다. 이 업적의 논지가 "지수는
 * 되밀렸지만 제도는 남는다"인데, 지수만 그리면 그 논지가 화면에 없다.
 *
 * ★ 시행과 발표를 한 칸에 세지 않는다.
 *   법률로 시행된 것과 방안으로 발표된 것은 무게가 다르다. 섞어 세면 제도 수가
 *   부풀려지고, 되돌릴 수 있는 것을 되돌릴 수 없는 것처럼 보이게 한다.
 */
export const instrumentSchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}(-\d{2}){0,2}$/, "date는 YYYY[-MM[-DD]] 형식이어야 한다"),
  displayDate: z.string(),
  label: z.string(),
  status: z.enum(["enacted", "announced"]),
  /** 법률 번호처럼 그 제도를 특정하는 문구. */
  detail: z.string().optional(),
  claimId: z.string(),
});
export type Instrument = z.infer<typeof instrumentSchema>;

export const indexSeriesSchema = z.object({
  name: z.string(),
  unit: z.string(),
  points: z.array(indexPointSchema).min(2),
  claimId: z.string(),
  /** 같은 시간축 위의 제도들. 비어 있으면 지수만 그린다. */
  instruments: z.array(instrumentSchema).default([]),
  /** 측정 조건. 종가 기준인지 장중인지 등. 숨기면 오도가 된다. */
  note: z.string().optional(),
});
export type IndexSeries = z.infer<typeof indexSeriesSchema>;

export function validateIndexSeries(series: IndexSeries): string[] {
  const errors: string[] = [];
  const sorted = [...series.points].every(
    (p, i, all) => i === 0 || all[i - 1].date <= p.date,
  );
  if (!sorted) errors.push("indexSeries → points가 날짜순이 아니다");

  /*
   * 고점에서 끊었는지 본다.
   *
   * 마지막 점이 최고값이면 둘 중 하나다 — 정말 지금이 최고점이거나,
   * 내려간 구간을 잘라냈거나. 후자를 막을 방법은 없지만, 적어도
   * note에 왜 거기서 끝나는지 적게 만든다.
   */
  const last = series.points[series.points.length - 1];
  const peak = Math.max(...series.points.map((p) => p.value));
  if (last.value === peak && !series.note) {
    errors.push(
      "indexSeries → 마지막 점이 최고값이다. 구간을 자른 게 아니라면 note에 기준 시점을 밝혀야 한다",
    );
  }

  return errors;
}

/* ────────────────────────────────────────────────────────────────
 * 해설 — 논지를 장으로 끊어 그린다
 *
 * ★ 수량 추이와 무엇이 다른가.
 *   수량 추이는 숫자 하나가 시점을 지나며 변하는 것이다. 여기는 **한 업적의
 *   논지가 여러 갈래일 때** 쓴다. 원유 수급은 의존도·운임·비축·가격상한·유가가
 *   서로 다른 주장이고, 막대 하나로 다섯 가지를 말할 수는 없다.
 *
 * ★ 장마다 그림이 다르다.
 *   같은 그림에 이름표만 갈아 다는 순간 이 씬은 목차가 된다. 그래서 visual은
 *   장마다 종류가 다른 판별 유니온이고, 종류를 늘리는 일은 그 논지가 정말
 *   다른 모양일 때만 한다. 두 장이 같아 보이면 둘 중 하나는 제 내용을
 *   나르고 있지 않은 것이다.
 *
 * ★ 화면에 나오는 낱말은 전부 여기 있다.
 *   그림 컴포넌트에는 이 업적의 고유명사가 한 글자도 없다. 콘텐츠에 없는
 *   말이 그림에서 나오면 그 말은 누구도 대조하지 않은 말이다.
 *
 * ★ 단계는 그림을 미는 축이다.
 *   장 하나는 순서 있는 단계들이고, 그림은 step의 함수다. 단계를 넘기면
 *   같은 그림이 변형된다 — 다른 그림으로 갈아 끼우면 그건 슬라이드쇼다.
 *
 * ★ 읽는 사람이 직접 움직이는 자리가 하나는 있어야 한다.
 *   준비된 단계를 넘기는 것은 순서를 가르치고, 손잡이를 직접 움직이는 것은
 *   구조를 가르친다. 다만 자료에 없는 값에 손잡이가 멈추면 화면이 그렇게
 *   밝힌다 — 움직인다고 해서 주장이 되지는 않는다.
 * ──────────────────────────────────────────────────────────────── */

export const explainerStepSchema = z.object({
  id: z.string(),
  /** 단계 레일에 적히는 짧은 이름. 두세 낱말. */
  label: z.string(),
  /** 이 단계에서 무슨 일이 일어났는지. 그림 아래에 그대로 나온다. */
  caption: z.string(),
  /** 이 단계에서만 뜨는 수치. 그림 밖 배지로 나간다. */
  readout: z
    .object({ value: z.string(), unit: z.string().optional(), note: z.string().optional() })
    .optional(),
});
export type ExplainerStep = z.infer<typeof explainerStepSchema>;

/**
 * 장마다 하나씩 붙는 그림의 데이터.
 *
 * 좌표는 여기 없다. 여기 있는 것은 이름과 수치뿐이고, 어디에 그릴지는
 * 그림 컴포넌트가 정한다. 콘텐츠가 좌표를 갖기 시작하면 편집자가 그림을
 * 고치게 되고, 그러면 자료와 그림이 한 덩어리로 굳는다.
 */
export const explainerVisualSchema = z.discriminatedUnion("kind", [
  /**
   * 한 곳에 묶여 있던 몫이 다른 곳으로 옮겨 앉는다.
   * 통 하나가 몇 %인지는 marks가 정한다 — 40개면 한 통이 2.5%다.
   */
  z.object({
    kind: z.literal("origin-shift"),
    from: z.object({ label: z.string(), note: z.string().optional() }),
    to: z.object({ label: z.string(), note: z.string().optional() }),
    unit: z.string(),
    marks: z.number().int().min(10).max(60),
    /** 자료로 확인된 시점. 손잡이가 여기 멈추면 근거가 붙는다. */
    points: z
      .array(
        z.object({
          id: z.string(),
          displayDate: z.string(),
          share: z.number().min(0).max(100),
          note: z.string().optional(),
        }),
      )
      .min(2),
    target: z.object({ share: z.number().min(0).max(100), label: z.string() }),
    /** 자료로 대조하지 못한 구간. 그림에서 점선으로 남는다. */
    unconfirmed: z
      .object({ label: z.string(), claim: z.string(), assertedBy: z.string(), claimId: z.string() })
      .optional(),
  }),

  /** 먼 길에 붙는 비용이 문턱이 되고, 그 문턱을 없애자 물량이 흘렀다. */
  z.object({
    kind: z.literal("freight-gap"),
    origin: z.string(),
    destination: z.string(),
    gapLabel: z.string(),
    offLabel: z.string(),
    onLabel: z.string(),
    /** 막대의 기준선. "지원 전 = 100". */
    baselineLabel: z.string(),
    routes: z
      .array(z.object({ id: z.string(), label: z.string(), growthPercent: z.number().min(0) }))
      .min(2),
    periodLabel: z.string(),
  }),

  /** 먼저 내주고 같은 양을 돌려받는 순환. 한 바퀴가 한 기간이다. */
  z.object({
    kind: z.literal("reserve-loop"),
    nodes: z
      .array(z.object({ id: z.string(), label: z.string(), detail: z.string().optional() }))
      .min(3)
      .max(5),
    counter: z.object({
      label: z.string(),
      /** 한 바퀴마다 적히는 말. 자료에 있는 기간만 적는다. */
      laps: z.array(z.object({ id: z.string(), label: z.string(), value: z.string() })).min(1),
    }),
    note: z.string().optional(),
  }),

  /** 사슬의 어느 마디에 상한이 걸렸는지. 걸리지 않은 마디를 함께 그린다. */
  z.object({
    kind: z.literal("price-cap"),
    links: z.array(z.object({ id: z.string(), label: z.string() })).min(3),
    /** 상한이 걸린 화살표. 0이면 첫 마디와 둘째 마디 사이다. */
    capAt: z.number().int().min(0),
    capLabel: z.string(),
    caps: z.array(z.object({ id: z.string(), label: z.string(), value: z.string() })).min(1),
    /** 상한이 걸리지 않은 화살표에 적는 말. */
    uncappedLabel: z.string(),
    /** 얼마나 자주 다시 정하는지. */
    cadence: z.string(),
  }),

  /** 두 수치가 같은 기간에 반대로 움직였다. 사이 값은 그리지 않는다. */
  z.object({
    kind: z.literal("divergence"),
    lanes: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          unit: z.string(),
          direction: z.enum(["up", "down"]),
          /** 움직임을 한마디로. "한 주에 14.4달러 올랐다". */
          moveLabel: z.string(),
          /** 자료에 있는 시점만. 사이는 점선으로 남는다. */
          marks: z
            .array(
              z.object({
                id: z.string(),
                displayDate: z.string(),
                value: z.number(),
                display: z.string(),
                note: z.string().optional(),
              }),
            )
            .min(2),
        }),
      )
      .length(2),
    /** 두 줄 사이에 적는 말. 방향이 갈렸다는 사실까지만 적는다. */
    gapLabel: z.string(),
  }),

  /** 한 몸이 쥐던 두 일이 둘로 갈라지고, 원래 몸은 없어진다. */
  z.object({
    kind: z.literal("split-powers"),
    origin: z.object({
      label: z.string(),
      /** 갈라진 뒤 이 기관이 어떻게 되는지. */
      endLabel: z.string(),
    }),
    /** 한 기관 안에서 두 일이 이어져 있다는 표시에 붙는 말. */
    loopLabel: z.string(),
    branches: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          /** 이 기관이 가져가는 일. 갈라지기 전에는 origin 안에 있다. */
          power: z.string(),
          note: z.string().optional(),
        }),
      )
      .length(2),
    /** 갈라지는 날. */
    whenLabel: z.string(),
  }),

  /** 권한이 어느 기관으로 가는지, 그리고 누가 무엇을 잃는지. */
  z.object({
    kind: z.literal("powers-ledger"),
    fromLabel: z.string(),
    holders: z
      .array(z.object({ id: z.string(), label: z.string(), note: z.string().optional() }))
      .length(2),
    powers: z
      .array(z.object({ id: z.string(), label: z.string(), holderId: z.string() }))
      .min(3),
    /**
     * 어떤 권한을 누가 잃는가.
     *
     * 가져가는 기관만 그리면 절반만 그린 것이다. 권한이 기관 사이를 옮겨 앉는
     * 동안 그 일을 하던 사람에게서 무엇이 빠지는지가 이 개혁의 절반이다.
     */
    actor: z.string(),
    lostPowerId: z.string(),
    lostLabel: z.string(),
    keptLabel: z.string(),
  }),

  /**
   * 정해진 것과 아직 오지 않은 것.
   *
   * 기준일이 축 위에 있고, 그 뒤는 예정이다. 이 그림의 일은 시간을 그리는 것이
   * 아니라 **어디까지가 확인된 것인지**를 그리는 것이다.
   */
  z.object({
    kind: z.literal("timeline-gate"),
    start: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "start는 YYYY-MM[-DD] 형식이어야 한다"),
    end: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "end는 YYYY-MM[-DD] 형식이어야 한다"),
    /** 처음과 끝 사이에 적는 말. "약 일곱 달". */
    spanLabel: z.string(),
    /** 기준일 뒤 구간에 적는 말. */
    futureLabel: z.string(),
    marks: z
      .array(
        z.object({
          id: z.string(),
          date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "date는 YYYY-MM[-DD] 형식이어야 한다"),
          displayDate: z.string(),
          label: z.string(),
          /**
           *   done     일어난 일
           *   asof     이 위키가 대조한 마지막 날
           *   planned  아직 오지 않은 일
           */
          status: z.enum(["done", "asof", "planned"]),
        }),
      )
      .min(3),
  }),

  /** 자리와 사람. 눈금 하나가 몇 명인지는 per가 정한다. */
  z.object({
    kind: z.literal("seats"),
    unit: z.string(),
    per: z.number().int().positive(),
    capacity: z.object({ label: z.string(), value: z.number().int().positive() }),
    filled: z.object({ label: z.string(), value: z.number().int().min(0) }),
    /** 덜 찬 자리에 붙는 말. */
    gapLabel: z.string(),
    /** 같은 눈금 위에 견줘 놓는 다른 수. 견줄 것이 없으면 비운다. */
    reference: z
      .object({ label: z.string(), value: z.number().int().positive(), note: z.string().optional() })
      .optional(),
  }),
]);
export type ExplainerVisual = z.infer<typeof explainerVisualSchema>;
export type ExplainerVisualKind = ExplainerVisual["kind"];

export const explainerChapterSchema = z.object({
  id: z.string(),
  /** 이 장이 답하는 질문. 제목이 아니라 질문으로 적는다. */
  question: z.string(),
  heading: z.string(),
  steps: z.array(explainerStepSchema).min(2, "단계가 둘은 있어야 그림이 움직인다"),
  visual: explainerVisualSchema,
  /** 이 장이 남기는 한 문장. 그림을 끄고 읽어도 말이 되어야 한다. */
  takeaway: z.string(),
  claimId: z.string(),
});
export type ExplainerChapter = z.infer<typeof explainerChapterSchema>;

export const explainerSchema = z.object({
  chapters: z.array(explainerChapterSchema).min(2),
  /** 읽는 법. 껍데기가 한 번 적는다. */
  note: z.string().optional(),
});
export type Explainer = z.infer<typeof explainerSchema>;

/**
 * 그림 종류마다 제 데이터를 갖췄는지.
 *
 * 종류별로 함수를 나눠 둔다. 한 switch 안에 다 넣으면 종류가 늘 때마다
 * 그 함수 하나가 길어지고, 새 종류를 넣는 사람이 남의 검사까지 읽게 된다.
 */
type VisualCheck<K extends ExplainerVisualKind> = (
  visual: Extract<ExplainerVisual, { kind: K }>,
  at: string,
) => string[];

const checkOriginShift: VisualCheck<"origin-shift"> = (visual, at) => {
  /* 목표가 확인된 값보다 높으면 "낮추는 이야기"가 아니다. */
  const lowest = Math.min(...visual.points.map((p) => p.share));
  return visual.target.share > lowest
    ? [`${at} → 목표(${visual.target.share})가 확인된 최저값(${lowest})보다 높다`]
    : [];
};

const checkPriceCap: VisualCheck<"price-cap"> = (visual, at) =>
  /* 화살표는 마디 수보다 하나 적다. 없는 화살표에 상한을 걸 수 없다. */
  visual.capAt > visual.links.length - 2
    ? [`${at} → capAt(${visual.capAt})이 가리키는 화살표가 없다`]
    : [];

const checkDivergence: VisualCheck<"divergence"> = (visual, at) =>
  visual.lanes[0].direction === visual.lanes[1].direction
    ? [`${at} → 두 줄의 방향이 같다. 갈라지지 않는다`]
    : [];

const checkPowersLedger: VisualCheck<"powers-ledger"> = (visual, at) => {
  const errors: string[] = [];
  const holderIds = new Set(visual.holders.map((h) => h.id));
  for (const power of visual.powers) {
    if (!holderIds.has(power.holderId)) {
      errors.push(`${at} → 권한 "${power.id}"가 없는 기관 "${power.holderId}"으로 간다`);
    }
  }
  if (!visual.powers.some((p) => p.id === visual.lostPowerId)) {
    errors.push(`${at} → lostPowerId "${visual.lostPowerId}"에 해당하는 권한이 없다`);
  }
  return errors;
};

const checkTimelineGate: VisualCheck<"timeline-gate"> = (visual, at) => {
  const errors: string[] = [];
  const { marks } = visual;

  /* 날짜순이 아니면 축이 뒤엉킨다. 문자열 비교로 충분하다 — 전부 ISO다. */
  if (!marks.every((m, i, all) => i === 0 || all[i - 1].date <= m.date)) {
    errors.push(`${at} → 시점이 날짜순이 아니다`);
  }

  /*
   * 기준일은 하나여야 한다. 이 그림의 전부가 "어디까지가 확인된 것인가"이고,
   * 그 선이 둘이거나 없으면 그릴 것이 없다.
   */
  const asOf = marks.filter((m) => m.status === "asof");
  if (asOf.length !== 1) {
    errors.push(`${at} → 기준일(asof)이 ${asOf.length}개다 (하나여야 한다)`);
  }

  /* 기준일보다 이른 것은 예정이 아니다. */
  for (const mark of marks) {
    if (mark.status === "planned" && asOf[0] && mark.date <= asOf[0].date) {
      errors.push(`${at} → "${mark.id}"가 기준일보다 이른데 예정으로 적혀 있다`);
    }
  }

  if (marks[0].date < visual.start || marks[marks.length - 1].date > visual.end) {
    errors.push(`${at} → 축(${visual.start}~${visual.end}) 밖에 놓인 시점이 있다`);
  }

  return errors;
};

const checkSeats: VisualCheck<"seats"> = (visual, at) =>
  visual.filled.value > visual.capacity.value
    ? [`${at} → 찬 자리(${visual.filled.value})가 정원(${visual.capacity.value})보다 많다`]
    : [];

function checkVisual(visual: ExplainerVisual, at: string): string[] {
  switch (visual.kind) {
    case "origin-shift":
      return checkOriginShift(visual, at);
    case "price-cap":
      return checkPriceCap(visual, at);
    case "divergence":
      return checkDivergence(visual, at);
    case "powers-ledger":
      return checkPowersLedger(visual, at);
    case "timeline-gate":
      return checkTimelineGate(visual, at);
    case "seats":
      return checkSeats(visual, at);
    /* 한 레코드 안에서 어긋날 수 있는 것이 없는 종류들. */
    case "freight-gap":
    case "reserve-loop":
    case "split-powers":
      return [];
  }
}

/** 장 사이의 약속. 그림 하나 안의 약속은 checkVisual이 본다. */
function validateExplainer(
  explainer: Explainer,
  where: string,
  checkClaim: (owner: string, claimId: string) => void,
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const chapter of explainer.chapters) {
    const at = `${where} chapter "${chapter.id}"`;
    if (ids.has(chapter.id)) errors.push(`${at} → 장 id가 중복이다`);
    ids.add(chapter.id);
    checkClaim(at, chapter.claimId);

    /* 그림이 따로 근거를 다는 경우. 장의 근거로는 받칠 수 없는 주장이 있다. */
    if (chapter.visual.kind === "origin-shift" && chapter.visual.unconfirmed) {
      checkClaim(`${at} unconfirmed`, chapter.visual.unconfirmed.claimId);
    }

    for (const error of checkVisual(chapter.visual, at)) errors.push(error);
  }

  return errors;
}

/* ────────────────────────────────────────────────────────────────
 * 씬 — 스토리 전용 개념의 확장 지점
 *
 * 스토리 셋을 만들고 나서 확인된 것:
 *   북극항로 → 항로(공간)
 *   대장동   → 토지·자금(몫)
 *   주식시장 → 지수(시계열)
 * 스토리마다 정확히 하나씩 새 개념을 들고 왔고, 하나도 재사용되지 않았다.
 *
 * 그래서 전용 개념을 최상위 필드로 붙이면 스키마가 스토리 수만큼 자란다.
 * 여기 꽂게 하면 새 스토리가 storySchema를 건드리지 않는다.
 *
 * 더 중요한 이득: 모든 씬이 claimIds를 균일하게 갖는다. 전용 개념이 생길 때마다
 * 4.2 불변식을 손으로 다시 배선하던 것을 한 곳에서 강제한다.
 *
 * 배치는 여전히 레이아웃이 하드코딩한다. 씬은 데이터의 단위이지
 * 화면 구성의 단위가 아니다 — 그건 스토리가 더 쌓인 뒤에 판단할 일이다.
 * ──────────────────────────────────────────────────────────────── */

const sceneBase = {
  id: z.string(),
  /** 섹션 제목. 레이아웃이 그대로 쓴다. */
  heading: z.string(),
  /** 제목 아래 한두 문장. */
  lede: z.string().optional(),
  /** ★ 불변식: 근거 없는 씬은 렌더링하지 않는다. */
  claimIds: z.array(z.string()).min(1, "근거 없는 씬은 허용되지 않는다"),
};

export const sceneSchema = z.discriminatedUnion("kind", [
  z.object({
    ...sceneBase,
    kind: z.literal("route-map"),
    routes: z.array(routeSchema).min(1),
  }),
  z.object({
    ...sceneBase,
    kind: z.literal("route-compare"),
    comparisons: z.array(routeComparisonSchema).min(2),
    note: z.string().optional(),
  }),
  z.object({
    ...sceneBase,
    kind: z.literal("composition"),
    composition: compositionSchema,
  }),
  z.object({
    ...sceneBase,
    kind: z.literal("money-flow"),
    flow: moneyFlowSchema,
  }),
  z.object({
    ...sceneBase,
    kind: z.literal("index-series"),
    series: indexSeriesSchema,
  }),
  z.object({
    ...sceneBase,
    kind: z.literal("quantity-track"),
    track: quantityTrackSchema,
  }),
  z.object({
    ...sceneBase,
    kind: z.literal("explainer"),
    explainer: explainerSchema,
  }),
]);
export type Scene = z.infer<typeof sceneSchema>;
export type SceneKind = Scene["kind"];

/** 특정 종류의 씬을 타입이 맞게 꺼낸다. 히어로 비주얼처럼 한 종류만 필요한 곳에서 쓴다. */
export function findScene<K extends SceneKind>(
  achievement: Achievement,
  kind: K,
): Extract<Scene, { kind: K }> | undefined {
  return achievement.scenes.find((s): s is Extract<Scene, { kind: K }> => s.kind === kind);
}

/** 씬 하나를 검사한다. 종류가 늘어도 호출부는 그대로다. */
export function validateScene(
  scene: Scene,
  checkClaim: (owner: string, claimId: string) => void,
): string[] {
  const errors: string[] = [];
  const where = `scene "${scene.id}"`;

  for (const cid of scene.claimIds) checkClaim(where, cid);

  switch (scene.kind) {
    case "route-map":
      for (const route of scene.routes) checkClaim(`${where} route "${route.id}"`, route.claimId);
      break;

    case "route-compare":
      for (const c of scene.comparisons) {
        checkClaim(`${where} comparison "${c.id}"`, c.claimId);
        if (c.daysMin > c.daysMax) errors.push(`${where} → "${c.id}"의 daysMin이 daysMax보다 크다`);
      }
      break;

    case "composition": {
      const { composition } = scene;
      const share = composition.groups.reduce((t, g) => t + g.sharePercent, 0);
      if (Math.abs(share - 100) > 0.5) {
        errors.push(`${where} → 구성비 합이 ${share.toFixed(1)}%다 (100%여야 한다)`);
      }
      const sum = composition.groups.reduce((t, g) => t + g.amount, 0);
      const gap = Math.abs(sum - composition.total);
      if (gap > composition.sumTolerance) {
        errors.push(
          `${where} → 항목 합(${sum})이 전체(${composition.total})와 ` +
            `${gap.toFixed(1)}${composition.unit} 다르다`,
        );
      }
      if (composition.sumTolerance > 1 && !composition.note) {
        errors.push(`${where} → 오차를 1 넘게 허용하려면 note에 이유를 적어야 한다`);
      }
      if (composition.breakdown.length > 0 && !composition.breakdownLabel) {
        errors.push(`${where} → breakdown이 있으면 breakdownLabel이 필요하다`);
      }
      break;
    }

    case "money-flow":
      for (const scenario of scene.flow.scenarios) {
        checkClaim(`${where} scenario "${scenario.id}"`, scenario.claimId);
        for (const a of scenario.allocations) checkClaim(`${where} allocation "${a.id}"`, a.claimId);
      }
      if (!scene.flow.scenarios.some((s) => s.isActual)) {
        errors.push(`${where} → 실제 구조(isActual)인 시나리오가 없다`);
      }
      break;

    case "index-series":
      for (const inst of scene.series.instruments) {
        checkClaim(`${where} instrument "${inst.id}"`, inst.claimId);
      }
      for (const error of validateIndexSeries(scene.series)) errors.push(`${where} → ${error}`);
      break;

    case "quantity-track": {
      const { track } = scene;
      for (const cp of track.checkpoints) {
        checkClaim(`${where} checkpoint "${cp.id}"`, cp.claimId);
        if (cp.amount > track.max) {
          errors.push(`${where} → "${cp.id}"의 값(${cp.amount})이 max(${track.max})보다 크다`);
        }
      }
      // 줄어드는 이야기인데 늘어나 있으면 direction이 틀렸거나 시점 순서가 틀렸다.
      const first = track.checkpoints[0].amount;
      const last = track.checkpoints[track.checkpoints.length - 1].amount;
      if (track.direction === "down" && last > first) {
        errors.push(`${where} → direction이 "down"인데 마지막 값이 첫 값보다 크다`);
      }
      if (track.direction === "up" && last < first) {
        errors.push(`${where} → direction이 "up"인데 마지막 값이 첫 값보다 작다`);
      }
      break;
    }

    case "explainer":
      for (const error of validateExplainer(scene.explainer, where, checkClaim)) {
        errors.push(error);
      }
      break;
  }

  return errors;
}
