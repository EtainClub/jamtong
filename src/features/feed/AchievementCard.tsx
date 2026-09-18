"use client";

import Link from "next/link";
import type { Achievement, Claim } from "@/content/schema";
import { CATEGORY_LABEL, STATUS_LABEL, STATUS_STYLE, formatDate } from "@/content/labels";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 성과 카드 (설계서 3장 Infographic Card).
 *
 * 카드 안의 텍스트는 최대한 적게 둔다. 대신 근거 칩과 상태 배지를 반드시 붙인다.
 * 스토리로 승격된 항목은 "직접 보기"로 연결한다 — 카드는 입구이고 스토리가 본문이다.
 */
export function AchievementCard({
  item,
  claims,
}: {
  item: Achievement;
  claims: Claim[];
}) {
  const supporting = item.claimIds
    .map((id) => claims.find((c) => c.id === id))
    .filter((c): c is Claim => Boolean(c));

  // 근거 없는 카드는 렌더링하지 않는다. (검토 문서 4.2)
  if (supporting.length === 0) return null;

  const sourceCount = new Set(supporting.flatMap((c) => c.sourceIds)).size;
  const unverified = supporting.some((c) => !c.verified);

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-ink-700 p-6 transition-colors ${
        unverified ? "border-warm-400/25" : "border-line hover:border-ice-600/60"
      }`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${STATUS_STYLE[item.status]}`}
        >
          {STATUS_LABEL[item.status]}
        </span>
        {item.categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] text-text-muted"
          >
            {CATEGORY_LABEL[category]}
          </span>
        ))}
      </div>

      <h3 className="mt-4 text-[17px] font-bold leading-snug tracking-tight text-text-primary">
        {item.title}
      </h3>

      {item.highlight && (
        <p className="mt-3">
          <span className="tabular text-2xl font-bold tracking-tight text-ice-400">
            {item.highlight.value}
          </span>
          <span className="mt-0.5 block text-xs text-text-muted">
            {item.highlight.label}
          </span>
        </p>
      )}

      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.summary}</p>

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <EvidenceButton claimId={supporting[0].id} count={sourceCount} />
          {unverified && (
            <span className="rounded-full bg-warm-400/15 px-2 py-1 text-[10px] font-semibold text-warm-400 ring-1 ring-warm-400/30">
              검증 전
            </span>
          )}
          <span className="ml-auto text-xs text-text-muted">
            {formatDate(item.date, item.datePrecision)}
          </span>
        </div>

        {item.storySlug && (
          <Link
            href={`/story/${item.storySlug}`}
            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ice-400 hover:text-ice-500"
          >
            직접 보기
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}
