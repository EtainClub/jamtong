"use client";

import { useEffect, useRef } from "react";
import type { Claim, Source } from "@/content/schema";
import { SOURCE_TYPE_LABEL, SOURCE_TYPE_TIER } from "@/content/labels";
import { useVisualState } from "@/lib/visual-state/store";

/**
 * 근거 Drawer (설계서 8장).
 *
 * 화면에는 "근거 N개"만 두고, 누를 때 자료를 편다.
 * 여기서 FACT / CLAIM / INTERPRETATION / OPINION을 시각적으로 구분한다.
 */

const ASSERTION_STYLE: Record<Claim["assertionType"], { label: string; className: string }> = {
  FACT: { label: "사실", className: "bg-navy-tint text-navy ring-navy/25" },
  CLAIM: { label: "주장", className: "bg-burgundy-tint text-burgundy ring-burgundy/25" },
  INTERPRETATION: { label: "해석", className: "bg-taupe text-graphite ring-stone" },
  OPINION: { label: "의견", className: "bg-taupe text-graphite ring-stone" },
};

interface Props {
  claims: Claim[];
  sources: Source[];
}

export function EvidenceDrawer({ claims, sources }: Props) {
  const openPanel = useVisualState((s) => s.openPanel);
  const selectedClaimId = useVisualState((s) => s.selectedClaimId);
  const closePanel = useVisualState((s) => s.closePanel);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<Element | null>(null);

  const isOpen = openPanel === "evidence";
  const claim = claims.find((c) => c.id === selectedClaimId) ?? null;

  // 포커스 이동과 복귀. Drawer를 닫으면 누르기 전 자리로 돌아간다.
  useEffect(() => {
    if (isOpen) {
      restoreTo.current = document.activeElement;
      closeRef.current?.focus();
    } else if (restoreTo.current instanceof HTMLElement) {
      restoreTo.current.focus();
      restoreTo.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closePanel]);

  if (!isOpen || !claim) return null;

  const claimSources = claim.sourceIds
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is Source => Boolean(s));

  const style = ASSERTION_STYLE[claim.assertionType];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="근거 패널 닫기"
        onClick={closePanel}
        className="absolute inset-0 bg-ink/25 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="관련 근거"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-stone bg-taupe shadow-2xl"
      >
        <header className="sticky top-0 flex items-start justify-between gap-4 border-b border-stone bg-taupe/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-ash">관련 근거</p>
            <p className="mt-1 text-sm text-smoke">
              자료 {claimSources.length}개
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closePanel}
            className="rounded-full px-3 py-1.5 text-sm text-smoke transition-colors hover:bg-taupe hover:text-ink"
          >
            닫기
          </button>
        </header>

        <div className="px-6 py-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${style.className}`}
            >
              {style.label}
            </span>
            {!claim.verified && (
              <span className="rounded-full bg-pending-tint px-2.5 py-1 text-[11px] font-semibold text-pending ring-1 ring-pending/30">
                편집팀 검증 전
              </span>
            )}
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-ink">{claim.text}</p>
          {claim.assertedBy && (
            <p className="mt-2 text-sm text-ash">— {claim.assertedBy}의 주장</p>
          )}

          <ul className="mt-8 space-y-3">
            {claimSources.map((source) => (
              <li
                key={source.id}
                className="rounded-lg border border-stone bg-stone/60 p-4"
              >
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <span
                    aria-hidden="true"
                    className={
                      SOURCE_TYPE_TIER[source.type] === "primary"
                        ? "text-navy"
                        : "text-ash"
                    }
                  >
                    {SOURCE_TYPE_TIER[source.type] === "primary" ? "◆" : "◇"}
                  </span>
                  <span className="text-ash">{SOURCE_TYPE_LABEL[source.type]}</span>
                </p>
                <p className="mt-1.5 text-sm font-medium leading-snug text-ink">
                  {source.title}
                </p>
                <p className="mt-1 text-xs text-ash">
                  {source.publisher}
                  {source.publishedAt ? ` · ${source.publishedAt}` : ""}
                </p>

                {/* license가 link-only면 원문을 옮겨 싣지 않는다 (검토 문서 3장) */}
                {source.quote && source.license !== "link-only" && (
                  <blockquote className="mt-3 border-l-2 border-graphite pl-3 text-sm italic leading-relaxed text-smoke">
                    {source.quote}
                  </blockquote>
                )}

                {(source.url ?? source.archivedUrl) && (
                  <a
                    href={source.url ?? source.archivedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:text-navy"
                  >
                    원문 보기
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only">(새 창)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
