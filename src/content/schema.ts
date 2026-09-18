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
  date: z.string(),
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
});
export type Waypoint = z.infer<typeof waypointSchema>;

export const routeSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** 대조군인지 여부. 비교 씬에서 회색으로 그린다. */
  isBaseline: z.boolean().default(false),
  waypoints: z.array(waypointSchema).min(2),
  totalKm: z.number(),
  totalDays: z.number(),
  claimId: z.string(),
});
export type Route = z.infer<typeof routeSchema>;

export const storySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  kicker: z.string(),
  summary: z.string(),
  type: z.enum(["achievement", "policy", "event"]),
  routes: z.array(routeSchema).default([]),
  keyNumbers: z.array(keyNumberSchema).default([]),
  timeline: z.array(timelineEventSchema).default([]),
  claims: z.array(claimSchema).default([]),
  sources: z.array(sourceSchema).default([]),
});
export type Story = z.infer<typeof storySchema>;

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
  for (const e of story.timeline) {
    for (const cid of e.claimIds) checkClaimRef(`event "${e.id}"`, cid);
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
