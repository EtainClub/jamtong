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
  className = "grid gap-4",
}: {
  numbers: KeyNumber[];
  claims: Claim[];
  className?: string;
}) {
  return (
    <dl className={className}>
      {numbers.map((number) => {
        const claim = claims.find((c) => c.id === number.claimId);
        if (!claim) return null;

        return (
          <div
            key={number.id}
            className={`rounded-card border bg-taupe p-5 ${
              claim.verified ? "border-stone" : "border-pending/40"
            }`}
          >
            <dt className="text-sm text-smoke">{number.label}</dt>
            <dd className="mt-2 flex items-baseline gap-1 whitespace-nowrap">
              {number.prefix && (
                <span className="text-sm font-medium text-ash">{number.prefix}</span>
              )}
              <span className="tabular text-3xl font-light tracking-[-0.02em] text-ink">
                {number.value}
              </span>
              {number.unit && (
                <span className="text-lg font-semibold text-navy">{number.unit}</span>
              )}
            </dd>
            {number.caption && (
              <p className="mt-1.5 text-xs text-ash">{number.caption}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
              {!claim.verified && (
                <span className="rounded-full bg-pending-tint px-2 py-1 text-[10px] font-semibold text-pending ring-1 ring-pending/30">
                  검증 전
                </span>
              )}
            </div>
          </div>
        );
      })}
    </dl>
  );
}
