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
  scenarios: z.array(flowScenarioSchema).min(1),
  /** 비교의 전제. 숨기면 오도가 된다. */
  note: z.string().optional(),
});
export type MoneyFlow = z.infer<typeof moneyFlowSchema>;

/**
 * 토지이용 구성.
 *
 * 금액 자료가 없을 때 "공공이 무엇을 가져갔는가"를 면적으로 보여준다.
 * 인허가 고시에 실리는 값이라 금액보다 검증이 쉽고 다툼의 여지도 적다.
 */
export const landUseItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  areaSqm: z.number().min(0),
  sharePercent: z.number().min(0).max(100),
  group: z.enum(["residential", "commercial", "public"]),
  detail: z.string().optional(),
});
export type LandUseItem = z.infer<typeof landUseItemSchema>;

export const landUseSchema = z.object({
  totalSqm: z.number().positive(),
  /** 최상위 구성. 합이 100%가 되어야 한다. */
  groups: z.array(landUseItemSchema).min(1),
  /** 공공용지 내역. 무엇이 공공 몫인지 항목으로 보여준다. */
  publicBreakdown: z.array(landUseItemSchema).default([]),
  claimId: z.string(),
  note: z.string().optional(),
  /**
   * 면적 합과 총면적의 허용 오차(㎡).
   *
   * 1차 자료가 제 하위 항목과 어긋나는 경우가 있다. 그때는 자료에 적힌 값을
   * 그대로 싣되 오차를 명시적으로 선언하게 한다. 조용히 눈감지 않는다.
   * 1㎡를 넘게 열어 두려면 note에 이유를 적어야 한다.
   */
  sumToleranceSqm: z.number().min(0).default(1),
});
export type LandUse = z.infer<typeof landUseSchema>;

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

export const storySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  kicker: z.string(),
  summary: z.string(),
  type: z.enum(["achievement", "policy", "event"]),
  /**
   * draft는 프로덕션 빌드에서 차단된다(validateStory).
   * 검증 전 골격이 실수로 공개되는 경로를 아예 없앤다.
   */
  publishStatus: z.enum(["draft", "published"]).default("draft"),
  routes: z.array(routeSchema).default([]),
  comparisons: z.array(routeComparisonSchema).default([]),
  /** 비교의 전제 조건. 수치만 보여주고 조건을 숨기면 오도가 된다. */
  comparisonNote: z.string().optional(),
  keyNumbers: z.array(keyNumberSchema).default([]),
  timeline: z.array(timelineEventSchema).default([]),
  moneyFlow: moneyFlowSchema.optional(),
  landUse: landUseSchema.optional(),
  graph: z.lazy(() => graphSchema).optional(),
  counterpoints: z.array(counterpointSchema).default([]),
  claims: z.array(claimSchema).default([]),
  sources: z.array(sourceSchema).default([]),
});
export type Story = z.infer<typeof storySchema>;

/**
 * 콘텐츠 파일이 쓰는 입력 타입.
 * 기본값이 채워지기 전 형태이므로 default가 있는 필드를 생략할 수 있다.
 */
export type StoryInput = z.input<typeof storySchema>;

/**
 * 참조 무결성 검사. 빌드/CI에서 실행한다.
 * 존재하지 않는 id를 가리키는 순간 빌드를 깬다.
 */
export function validateStory(story: Story): string[] {
  const errors: string[] = [];
  const sourceIds = new Set(story.sources.map((s) => s.id));
  const claimIds = new Set(story.claims.map((c) => c.id));

  for (const claim of story.claims) {
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

  for (const n of story.keyNumbers) checkClaimRef(`keyNumber "${n.id}"`, n.claimId);
  for (const r of story.routes) checkClaimRef(`route "${r.id}"`, r.claimId);
  for (const c of story.comparisons) {
    checkClaimRef(`comparison "${c.id}"`, c.claimId);
    if (c.daysMin > c.daysMax) {
      errors.push(`comparison "${c.id}" → daysMin이 daysMax보다 크다`);
    }
  }
  for (const e of story.timeline) {
    for (const cid of e.claimIds) checkClaimRef(`event "${e.id}"`, cid);
  }

  for (const flow of story.moneyFlow ? [story.moneyFlow] : []) {
    for (const scenario of flow.scenarios) {
      checkClaimRef(`scenario "${scenario.id}"`, scenario.claimId);
      for (const allocation of scenario.allocations) {
        checkClaimRef(`allocation "${allocation.id}"`, allocation.claimId);
      }
    }
    if (!flow.scenarios.some((sc) => sc.isActual)) {
      errors.push(`moneyFlow → 실제 구조(isActual)인 시나리오가 없다`);
    }
  }

  if (story.landUse) {
    checkClaimRef("landUse", story.landUse.claimId);
    const sum = story.landUse.groups.reduce((t, g) => t + g.sharePercent, 0);
    if (Math.abs(sum - 100) > 0.5) {
      errors.push(`landUse → 최상위 구성비 합이 ${sum.toFixed(1)}%다 (100%여야 한다)`);
    }
    const area = story.landUse.groups.reduce((t, g) => t + g.areaSqm, 0);
    const gap = Math.abs(area - story.landUse.totalSqm);
    if (gap > story.landUse.sumToleranceSqm) {
      errors.push(
        `landUse → 구성 면적 합(${area})이 총면적(${story.landUse.totalSqm})과 ${gap.toFixed(1)}㎡ 다르다`,
      );
    }
    if (story.landUse.sumToleranceSqm > 1 && !story.landUse.note) {
      errors.push("landUse → 오차를 1㎡ 넘게 허용하려면 note에 이유를 적어야 한다");
    }
  }

  if (story.graph) {
    for (const error of validateGraph(story.graph, claimIds)) errors.push(error);
  }

  for (const cp of story.counterpoints) {
    for (const cid of cp.claimIds) checkClaimRef(`counterpoint "${cp.id}"`, cid);
  }

  // 쟁점형 스토리는 반론 섹션을 비워 둘 수 없다.
  if (story.type === "event" && story.counterpoints.length === 0) {
    errors.push(`story "${story.slug}" → 쟁점형 스토리에는 counterpoints가 필요하다`);
  }

  // 공개 스토리에 미검증 주장이 남아 있으면 빌드를 깬다.
  if (story.publishStatus === "published") {
    for (const claim of story.claims) {
      if (!claim.verified) {
        errors.push(`published 스토리에 미검증 claim이 있다: "${claim.id}"`);
      }
    }
  }

  for (const s of story.sources) {
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

export const AchievementCategory = z.enum([
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
export type AchievementCategory = z.infer<typeof AchievementCategory>;

/** 진행 상태. 계획을 성과처럼 보이게 하지 않으려면 이 구분이 필요하다. */
export const AchievementStatus = z.enum(["done", "ongoing", "planned"]);
export type AchievementStatus = z.infer<typeof AchievementStatus>;

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  categories: z.array(AchievementCategory).min(1),
  /** 누구에게 해당되는 일인지. 비어 있어도 된다. */
  audiences: z.array(z.string()).default([]),
  status: AchievementStatus,
  date: z.string(),
  datePrecision: DatePrecision,
  /** ★ 불변식: 근거 없는 카드는 존재할 수 없다. */
  claimIds: z.array(z.string()).min(1, "근거 없는 성과 카드는 허용되지 않는다"),
  /** 눈에 띄는 수치가 있으면 카드 앞면에 하나만 올린다. */
  highlight: z.object({ value: z.string(), label: z.string() }).optional(),
  /** Visual Story로 승격된 경우 그 slug. */
  storySlug: z.string().optional(),
});
export type Achievement = z.infer<typeof achievementSchema>;
export type AchievementInput = z.input<typeof achievementSchema>;

export interface AchievementCollection {
  achievements: Achievement[];
  claims: Claim[];
  sources: Source[];
}

export function validateAchievements(collection: AchievementCollection): string[] {
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

  for (const item of collection.achievements) {
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
]);
export type EntityKind = z.infer<typeof EntityKind>;

export const entitySchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: EntityKind,
  description: z.string().optional(),
  /** 화면 중앙에 두고 나머지를 둘러 배치한다. 스토리당 하나만. */
  isFocus: z.boolean().default(false),
});
export type Entity = z.infer<typeof entitySchema>;

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
 * 쇼츠 (직접 제작한 세로 영상)
 *
 * 영상 자체는 편집자가 만들어 넣는다. 앱은 그것을 재생하고, 근거를 붙이고,
 * 더 깊은 스토리로 연결하는 일만 한다.
 *
 * 영상이라고 해서 근거 원칙이 느슨해지지 않는다. 짧은 영상일수록 맥락이
 * 잘리므로 오히려 출처가 더 중요하다.
 * ──────────────────────────────────────────────────────────────── */

export const shortSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  /** 세로 영상 파일 경로. 9:16을 전제로 한다. */
  videoUrl: z.string(),
  /** 첫 프레임. 없으면 로딩 중 검은 화면이 보인다. */
  posterUrl: z.string().optional(),
  durationSec: z.number().positive().optional(),
  categories: z.array(AchievementCategory).min(1),
  /** ★ 불변식: 근거 없는 쇼츠는 올리지 않는다. */
  claimIds: z.array(z.string()).min(1, "근거 없는 쇼츠는 허용되지 않는다"),
  /** 더 깊이 볼 스토리가 있으면 연결한다. */
  storySlug: z.string().optional(),
  publishedAt: z.string(),
});
export type Short = z.infer<typeof shortSchema>;
export type ShortInput = z.input<typeof shortSchema>;
