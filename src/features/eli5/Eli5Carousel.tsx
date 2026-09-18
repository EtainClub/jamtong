"use client";

import { useRef, useState } from "react";
import type { Claim, Eli5 } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { ELI5_ART } from "./art";

/**
 * 쉬운 설명 캐러셀.
 *
 * 한 화면에 한 장면만 둔다. 여러 장면을 세로로 늘어놓으면 결국 읽는 글이 되고,
 * 쉬운 설명의 이점이 사라진다.
 *
 * 마지막 장면 다음에는 원문으로 넘어가는 문을 둔다. 쉬운 설명은 입구이지
 * 종착지가 아니다.
 */
export function Eli5Carousel({
  eli5,
  claims,
  onOpenFull,
}: {
  eli5: Eli5;
  claims: Claim[];
  onOpenFull: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = eli5.scenes.length;

  const goTo = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(total - 1, next));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    setIndex((current) => (current === next ? current : next));
  };

  return (
    <section aria-labelledby="eli5-heading">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
        쉬운 설명 · 큰 그림으로 읽기
      </p>
      <p id="eli5-heading" className="mt-2.5 text-[15px] leading-relaxed text-text-secondary">
        {eli5.intro}
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-ink-700">
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          role="group"
          aria-label={`장면 ${total}개. 좌우 화살표 키로 넘길 수 있어요.`}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              goTo(index + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              goTo(index - 1);
            }
          }}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto focus:outline-none"
        >
          {eli5.scenes.map((scene, i) => {
            const Art = ELI5_ART[scene.art];
            const supporting = scene.claimIds
              .map((id) => claims.find((c) => c.id === id))
              .filter((c): c is Claim => Boolean(c));

            return (
              <div
                key={scene.id}
                className="w-full shrink-0 snap-start snap-always p-5"
                aria-label={`${i + 1}번 장면`}
              >
                <div className="aspect-[4/3] w-full">
                  <Art />
                </div>

                <p className="tabular mt-4 text-[11px] tracking-[0.1em] text-text-muted">
                  {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 text-[21px] font-bold leading-snug tracking-tight text-text-primary">
                  {scene.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-text-secondary">
                  {scene.say}
                </p>

                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  {scene.fact && (
                    <span
                      className={`tabular rounded-full px-3 py-1.5 text-xs font-semibold ${
                        scene.fact.tone === "warm"
                          ? "bg-warm-400/15 text-warm-400"
                          : "bg-ice-500/15 text-ice-400"
                      }`}
                    >
                      {scene.fact.value}
                    </span>
                  )}
                  {supporting[0] && (
                    <EvidenceButton
                      claimId={supporting[0].id}
                      count={new Set(supporting.flatMap((c) => c.sourceIds)).size}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3">
          <NavButton label="이전 장면" disabled={index === 0} onClick={() => goTo(index - 1)}>
            <path d="M15 5 8 12l7 7" />
          </NavButton>

          <div className="flex gap-1.5" role="tablist" aria-label="장면 선택">
            {eli5.scenes.map((scene, i) => (
              <button
                key={scene.id}
                type="button"
                role="tab"
                aria-label={`${i + 1}번 장면`}
                aria-selected={i === index}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-ice-400" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          <NavButton
            label="다음 장면"
            disabled={index === total - 1}
            onClick={() => goTo(index + 1)}
          >
            <path d="m9 5 7 7-7 7" />
          </NavButton>
        </div>
      </div>

      {eli5.caveat && (
        <Caveat text={eli5.caveat.text} claimIds={eli5.caveat.claimIds} claims={claims} />
      )}

      <button
        type="button"
        onClick={onOpenFull}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-ink-700 px-5 py-3.5 text-sm font-semibold text-ice-400 transition-colors hover:border-ice-600"
      >
        직접 움직여보기
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

function Caveat({
  text,
  claimIds,
  claims,
}: {
  text: string;
  claimIds: string[];
  claims: Claim[];
}) {
  const claim = claims.find((c) => c.id === claimIds[0]);
  return (
    <div
      role="note"
      className="mt-5 rounded-r-xl border-l-[3px] border-warm-400 bg-warm-400/[0.07] px-4 py-3.5"
    >
      <p className="text-[13px] leading-relaxed text-text-secondary">{text}</p>
      {claim && (
        <div className="mt-2.5">
          <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
        </div>
      )}
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full border border-line text-text-secondary transition-colors hover:border-ice-600 hover:text-ice-400 disabled:opacity-30 disabled:hover:border-line disabled:hover:text-text-secondary"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  );
}
