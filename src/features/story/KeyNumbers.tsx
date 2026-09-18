"use client";

import type { Claim, KeyNumber } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 핵심 숫자.
 *
 * 불변식: 모든 숫자는 claimId를 갖고, 그 Claim은 최소 하나의 Source를 갖는다.
 * 대응하는 Claim을 찾지 못하면 **렌더링하지 않는다.** (검토 문서 4.2)
 */
export function KeyNumbers({
  numbers,
  claims,
}: {
  numbers: KeyNumber[];
  claims: Claim[];
}) {
  return (
    <dl className="grid gap-4">
      {numbers.map((number) => {
        const claim = claims.find((c) => c.id === number.claimId);
        if (!claim) return null;

        return (
          <div
            key={number.id}
            className="rounded-xl border border-line bg-ink-700 p-5"
          >
            <dt className="text-sm text-text-secondary">{number.label}</dt>
            <dd className="mt-2 flex items-baseline gap-1 whitespace-nowrap">
              {number.prefix && (
                <span className="text-sm font-medium text-text-muted">{number.prefix}</span>
              )}
              <span className="tabular text-3xl font-bold tracking-tight text-text-primary">
                {number.value}
              </span>
              {number.unit && (
                <span className="text-lg font-semibold text-ice-400">{number.unit}</span>
              )}
            </dd>
            {number.caption && (
              <p className="mt-1.5 text-xs text-text-muted">{number.caption}</p>
            )}
            <div className="mt-4">
              <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
            </div>
          </div>
        );
      })}
    </dl>
  );
}
