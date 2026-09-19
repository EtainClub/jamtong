"use client";

import { useRef } from "react";
import type { Claim, TimelineEvent } from "@/content/schema";
import { useVisualState } from "@/lib/visual-state/store";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 맥락 타임라인 (설계서 4장).
 *
 * Sprint 1에서는 커서가 연표 자체만 바꾼다. 관계도와의 동기화 —
 * "커서를 옮기면 화면 전체의 시간 좌표가 바뀐다" — 는 Sprint 2(대장동)에서
 * 관계도가 들어올 때 같은 `timelineCursor` 위에 얹는다.
 */

const PRECISION_NOTE: Record<TimelineEvent["datePrecision"], string | null> = {
  day: null,
  month: null,
  year: null,
  circa: "대략적 시점",
  unknown: "시점 미상",
};

interface Props {
  events: TimelineEvent[];
  claims: Claim[];
}

export function Timeline({ events, claims }: Props) {
  const cursor = useVisualState((s) => s.timelineCursor);
  const seekTimeline = useVisualState((s) => s.seekTimeline);
  const listRef = useRef<HTMLDivElement>(null);

  const activeIndex = Math.max(
    0,
    events.findIndex((e) => e.id === cursor),
  );
  const active = events[activeIndex];

  const focusAt = (index: number) => {
    const next = events[Math.min(events.length - 1, Math.max(0, index))];
    if (!next) return;
    seekTimeline(next.id);
    listRef.current
      ?.querySelector<HTMLButtonElement>(`[data-event-id="${next.id}"]`)
      ?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusAt(activeIndex + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusAt(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(events.length - 1);
        break;
    }
  };

  const activeClaims = active.claimIds
    .map((id) => claims.find((c) => c.id === id))
    .filter((c): c is Claim => Boolean(c));

  return (
    <div>
      <div
        ref={listRef}
        role="group"
        aria-label="연표. 좌우 화살표 키로 시점을 이동합니다."
        onKeyDown={onKeyDown}
        className="relative"
      >
        {/* 축 */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[11px] h-px bg-ash"
        />
        <div
          aria-hidden="true"
          className="absolute left-0 top-[11px] h-px bg-ink transition-all duration-300"
          style={{
            width: `${(activeIndex / Math.max(1, events.length - 1)) * 100}%`,
          }}
        />

        <ol className="relative flex justify-between gap-2">
          {events.map((event, index) => {
            const isActive = index === activeIndex;
            const isPassed = index <= activeIndex;
            return (
              <li key={event.id} className="flex-1">
                <button
                  type="button"
                  data-event-id={event.id}
                  tabIndex={isActive ? 0 : -1}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => seekTimeline(event.id)}
                  className="group flex w-full flex-col items-start gap-3 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`h-[22px] w-[22px] shrink-0 rounded-full border-2 transition-all ${
                      isActive
                        ? "border-navy bg-navy scale-110"
                        : isPassed
                          ? "border-graphite bg-taupe"
                          : "border-stone bg-taupe group-hover:border-stone"
                    }`}
                  />
                  <span className="min-w-0">
                    <span
                      className={`tabular block text-sm font-semibold ${
                        isActive ? "text-ink" : "text-ash"
                      }`}
                    >
                      {event.displayDate ?? event.date}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs leading-snug ${
                        isActive ? "text-smoke" : "text-ash"
                      }`}
                    >
                      {event.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div
        className="mt-8 rounded-card border border-stone bg-taupe p-6"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="tabular text-2xl font-light tracking-[-0.02em] text-navy">
            {active.displayDate ?? active.date}
          </span>
          <h3 className="text-lg font-semibold text-ink">{active.title}</h3>
          {PRECISION_NOTE[active.datePrecision] && (
            <span className="rounded-full bg-taupe px-2 py-0.5 text-[11px] text-ash">
              {PRECISION_NOTE[active.datePrecision]}
            </span>
          )}
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-smoke">{active.summary}</p>

        {activeClaims.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeClaims.map((claim) => (
              <EvidenceButton
                key={claim.id}
                claimId={claim.id}
                count={claim.sourceIds.length}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
