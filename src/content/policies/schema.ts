import { z } from "zod";

import {
  AchievementCategory,
  claimSchema,
  sourceSchema,
  timelineEventSchema,
} from "@/content/schema";

/**
 * 정부 정책 팩트.
 *
 * 업적(대통령이 한 일)도 언행(대통령이 한 말)도 아닌, **이재명 정부가 시행하거나
 * 발표한 정책의 사실관계**를 담는다. 지원금 대상·금액, 대출 규제의 시행일,
 * 소문에 대한 부처 해명 같은 것들이다. 위키는 이 파일을 그대로 읽어
 * `/wiki/policy/<slug>` 페이지로 만들고, factbase는 claim 하나를 앵커
 * `policy:<slug>#<claimId>` 하나로 내보낸다.
 *
 * ★ 업적과 같은 근거 규칙.
 *   모든 문장은 claim이고, 모든 claim은 출처를 하나 이상 가진다. 부처 해명은
 *   그 부처의 주장이므로 CLAIM + assertedBy로 적는다. 법 시행일·지급 금액처럼
 *   문서로 확정된 것만 FACT다.
 *
 * ★ 소문은 우리 문장이 아니다.
 *   `rumors`는 SNS에서 실제로 도는 주장을 **요약해 옮긴 것**이다. 화면에서는
 *   반드시 "도는 주장"으로 표시되고, 그 옆에 대응하는 claim이 붙는다. 대응하는
 *   claim이 없는 소문은 싣지 않는다 — 반박 없이 소문만 실으면 퍼뜨리는 셈이다.
 */

export const rumorSchema = z.object({
  id: z.string(),
  /** 도는 주장의 요약. 따옴표 안에 들어갈 말이다. */
  text: z.string(),
  /** 이 주장에 대응하는 claim id. 최소 하나. */
  claimIds: z.array(z.string()).min(1, "대응하는 claim이 없는 소문은 싣지 않는다"),
});
export type Rumor = z.infer<typeof rumorSchema>;

export const policySchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/, "slug는 ascii 소문자·숫자·하이픈만"),
    title: z.string(),
    /** 무엇에 대한 페이지인지 한 줄. 단정이 아니라 범위를 적는다. */
    scope: z.string(),
    /** 소관 부처. */
    ministries: z.array(z.string()).default([]),
    categories: z.array(AchievementCategory).min(1),
    /** 이 페이지의 기준일. 정책은 바뀌므로 언제 기준인지 늘 밝힌다. */
    asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** 핵심 사실. 화면 순서대로 적는다. */
    claims: z.array(claimSchema).min(1),
    sources: z.array(sourceSchema).min(1),
    rumors: z.array(rumorSchema).default([]),
    timeline: z.array(timelineEventSchema).default([]),
    /** 아직 확인하지 못한 것. 비워 두면 다 확인한 것처럼 읽힌다. */
    gaps: z.array(z.string()).default([]),
  })
  .superRefine((policy, ctx) => {
    const claimIds = new Set(policy.claims.map((c) => c.id));
    const sourceIds = new Set(policy.sources.map((s) => s.id));

    for (const claim of policy.claims) {
      if (claim.assertionType === "CLAIM" && !claim.assertedBy) {
        ctx.addIssue({ code: "custom", message: `${claim.id}: CLAIM은 assertedBy가 필요하다` });
      }
      for (const id of claim.sourceIds) {
        if (!sourceIds.has(id)) {
          ctx.addIssue({ code: "custom", message: `${claim.id}: 없는 출처 ${id}` });
        }
      }
    }
    const refs = [
      ...policy.rumors.flatMap((r) => r.claimIds.map((id) => [r.id, id] as const)),
      ...policy.timeline.flatMap((e) => e.claimIds.map((id) => [e.id, id] as const)),
    ];
    for (const [owner, id] of refs) {
      if (!claimIds.has(id)) {
        ctx.addIssue({ code: "custom", message: `${owner}: 없는 claim ${id}` });
      }
    }
  });

export type Policy = z.infer<typeof policySchema>;
export type PolicyInput = z.input<typeof policySchema>;
