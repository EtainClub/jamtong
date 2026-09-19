"use client";

import { useEffect, useRef, useState } from "react";
import type { Claim, QuantityTrack as Track } from "@/content/schema";
import { ELI5_ART } from "@/features/eli5/art";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 수량 추이 모션 씬.
 *
 * 스크롤이 시간을 민다. 큰 숫자가 세어지고, 막대가 자라거나 줄고, 그 시점의
 * 삽화가 넘어온다. 북극항로의 항해 씬과 같은 원리다 — 스크롤을 가로채지 않고,
 * 위치에서 진행도만 파생한다.
 *
 * 움직임이 설명이다. "7,285억을 3년 6개월에 갚았다"는 문장보다, 막대가 실제로
 * 0까지 줄어드는 편이 같은 말을 더 정확히 전한다.
 *
 * ★ 사이 값은 주장하지 않는다. 큰 숫자는 흐르지만 근거가 붙는 것은 시점의
 *   값뿐이고, 화면은 늘 "지금 어느 시점인지"를 함께 적는다.
 */

interface Props {
  track: Track;
  claims: Claim[];
}

/**
 * 자릿수는 추이 전체의 성격이지 그때그때 값의 크기가 아니다.
 *
 * 값마다 정하면 7,285가 "7,285"인데 0이 "0.0"으로 떨어진다. 같은 줄에서
 * 자릿수가 바뀌면 숫자가 흔들리는 것처럼 보인다.
 */
const decimalsFor = (track: Track) =>
  track.checkpoints.every((cp) => Number.isInteger(cp.amount)) ? 0 : 1;

const fmt = (n: number, decimals: number) =>
  n.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

// 시점 사이를 부드럽게 넘긴다. 시점 위에서는 값이 딱 멈춘다.
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function QuantityTrack({ track, claims }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const measure = () => {
      frame.current = null;
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      setProgress(Math.min(1, Math.max(0, -rect.top / travel)));
    };

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const { checkpoints } = track;
  const decimals = decimalsFor(track);
  const last = checkpoints.length - 1;

  // 진행도를 시점 위의 좌표로 옮긴다. 2.4 = 세 번째 시점을 막 지난 참.
  const pos = progress * last;
  const index = Math.min(last, Math.floor(pos));
  const nextIndex = Math.min(last, index + 1);
  const span = ease(pos - index);

  const current = checkpoints[index];
  const next = checkpoints[nextIndex];
  const value = current.amount + (next.amount - current.amount) * span;
  // 시점에 거의 닿았으면 그 시점에 있는 것으로 본다. 사이 상태를 오래 보이지 않는다.
  const settled = span < 0.15 ? current : span > 0.85 ? next : null;
  const shown = settled ?? current;

  const claim = claims.find((c) => c.id === shown.claimId);
  const Art = shown.art ? ELI5_ART[shown.art] : null;
  const barPercent = Math.min(100, (value / track.max) * 100);
  const falling = track.direction === "down";

  return (
    <div
      ref={sectionRef}
      // 시점 하나마다 한 화면씩. 천천히 읽히게 한다.
      style={{ height: `${checkpoints.length * 85 + 60}vh` }}
      className="relative"
    >
      <div className="sticky top-14 flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center py-4 sm:py-6">
        <div className="grid items-center gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-10">
          {/* 삽화 — 시점이 바뀌면 넘어온다 */}
          <div className="relative h-[220px] overflow-hidden rounded-card border border-stone bg-taupe sm:h-[300px]">
            {checkpoints.map((cp, i) => {
              const ArtI = cp.art ? ELI5_ART[cp.art] : null;
              if (!ArtI) return null;
              return (
                <div
                  key={cp.id}
                  aria-hidden={i !== index}
                  className="absolute inset-0 p-5 transition-opacity duration-500 ease-out"
                  style={{ opacity: i === index ? 1 : 0 }}
                >
                  <ArtI />
                </div>
              );
            })}
            {!Art && (
              <div className="flex h-full items-center justify-center text-sm text-ash">
                {track.label}
              </div>
            )}
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-navy">
              {shown.displayDate}
            </p>
            <h3 className="mt-1.5 text-lg font-bold leading-snug text-ink">{shown.title}</h3>

            {/* 세어지는 숫자 */}
            <div className="mt-5 flex items-baseline gap-2">
              <span
                className={`tabular text-[44px] font-light leading-none tracking-tight sm:text-[56px] ${
                  falling ? "text-navy" : "text-ink"
                }`}
              >
                {fmt(value, decimals)}
              </span>
              <span className="text-sm text-smoke">{track.unit}</span>
            </div>
            <p className="mt-1.5 text-[13px] text-ash">{track.label}</p>

            {/* 자라거나 줄어드는 막대 */}
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-stone">
              <div
                className={`h-full rounded-full ${falling ? "bg-navy" : "bg-burgundy"}`}
                style={{ width: `${barPercent}%` }}
              />
            </div>

            {shown.caption && (
              <p className="mt-4 text-[14px] leading-relaxed text-smoke">{shown.caption}</p>
            )}

            {/* 시점 레일 — 지금 몇 번째인지 */}
            <ol className="mt-5 flex items-center gap-1.5" aria-label="시점">
              {checkpoints.map((cp, i) => (
                <li
                  key={cp.id}
                  aria-current={i === index ? "step" : undefined}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= index ? "bg-navy" : "bg-stone"
                  }`}
                  title={`${cp.displayDate} ${cp.title}`}
                />
              ))}
            </ol>

            {claim && (
              <div className="mt-5">
                <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
              </div>
            )}

            <p className="mt-5 border-l-2 border-stone pl-4 text-[12px] leading-relaxed text-ash">
              스크롤하면 시점이 넘어갑니다. 값이 확인된 것은 위에 적힌 시점들이고,
              그 사이 값은 자료에 없습니다.
              {track.note && <span className="mt-1.5 block">{track.note}</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
