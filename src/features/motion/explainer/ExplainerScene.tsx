"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { Claim, Explainer } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

import { ExplainerVisualView } from "./ExplainerVisuals";

/**
 * 해설 씬의 껍데기.
 *
 * 장을 고르고, 단계를 넘기고, 지금 무슨 일이 일어났는지 글로 적는다.
 * 그림은 보조다 — 이 컴포넌트가 내는 글만 읽어도 논지가 서야 한다.
 *
 * ★ 단계 이동은 장 경계를 넘는다.
 *   마지막 단계에서 →를 누르면 다음 장의 첫 단계로 간다. 장마다 따로
 *   끝나면 읽는 사람이 매번 다음 장을 찾아 눌러야 하고, 그러면 다섯 장이
 *   한 편으로 읽히지 않는다.
 *
 * ★ 자동 재생은 양보한다.
 *   탭을 떠나면, 화면 밖으로 나가면, 움직임을 원하지 않는다고 밝혔으면
 *   멈춘다. 뒤에서 혼자 돌아가는 캐러셀은 배터리를 먹고 포커스를 훔친다.
 */

const STEP_MS = 3600;

/**
 * 움직임을 원하지 않는다고 밝혔는가.
 *
 * effect로 state에 옮겨 담지 않는다 — 그러면 첫 렌더가 한 번 더 돈다.
 * 서버에서는 false로 두고(재생 단추가 없는 화면으로 나간다) 브라우저에서
 * 실제 값을 읽는다.
 */
function useReducedMotion() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function ExplainerScene({ explainer, claims }: { explainer: Explainer; claims: Claim[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState({ chapter: 0, step: 0 });
  const [playRequested, setPlayRequested] = useState(false);
  const reduced = useReducedMotion();

  const chapter = explainer.chapters[at.chapter];
  const step = Math.min(at.step, chapter.steps.length - 1);
  const current = chapter.steps[step];
  const claim = claims.find((c) => c.id === chapter.claimId);

  const last =
    at.chapter === explainer.chapters.length - 1 && step === chapter.steps.length - 1;

  /*
   * 재생 중인가는 상태가 아니라 계산이다.
   *
   * 마지막 단계에 닿으면 저절로 멈춘다 — effect에서 끄면 그 자리에서 렌더가
   * 한 번 더 돌고, "켜 놓았는데 갈 곳이 없는" 어중간한 상태가 생긴다.
   */
  const playing = playRequested && !last && !reduced;

  const go = useCallback(
    (delta: 1 | -1) => {
      setAt((now) => {
        const here = explainer.chapters[now.chapter];
        const next = now.step + delta;
        if (next >= 0 && next < here.steps.length) return { ...now, step: next };
        const nextChapter = now.chapter + delta;
        if (nextChapter < 0 || nextChapter >= explainer.chapters.length) return now;
        return {
          chapter: nextChapter,
          step: delta === 1 ? 0 : explainer.chapters[nextChapter].steps.length - 1,
        };
      });
    },
    [explainer.chapters],
  );

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => go(1), STEP_MS);
    return () => clearTimeout(timer);
  }, [playing, at, go]);

  /* 탭을 떠나면 멈춘다. */
  useEffect(() => {
    if (!playing) return;
    const onHide = () => {
      if (document.visibilityState === "hidden") setPlayRequested(false);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [playing]);

  /* 화면 밖으로 나가면 멈춘다. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !playing) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) setPlayRequested(false);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [playing]);

  return (
    <div
      ref={rootRef}
      onKeyDown={(e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        setPlayRequested(false);
        go(e.key === "ArrowRight" ? 1 : -1);
      }}
    >
      {/* 장 고르기 */}
      <ol className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" aria-label="장">
        {explainer.chapters.map((c, i) => {
          const active = i === at.chapter;
          return (
            <li key={c.id} className="shrink-0">
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => {
                  setPlayRequested(false);
                  setAt({ chapter: i, step: 0 });
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  active
                    ? "border-ink bg-ink text-eggshell"
                    : "border-stone text-smoke hover:border-graphite hover:text-ink"
                }`}
              >
                <span className="tabular opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {c.heading}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-10">
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold leading-snug text-ink">{chapter.question}</h3>
          <div className="mt-4">
            <ExplainerVisualView visual={chapter.visual} step={step} />
          </div>
        </div>

        <div className="min-w-0">
          {/* 단계 레일 */}
          <ol className="flex flex-col gap-1" aria-label="단계">
            {chapter.steps.map((s, i) => {
              const done = i <= step;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-current={i === step ? "step" : undefined}
                    onClick={() => {
                      setPlayRequested(false);
                      setAt({ chapter: at.chapter, step: i });
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left text-[12px] font-semibold transition-colors ${
                      i === step ? "bg-taupe text-ink" : "text-ash hover:text-smoke"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-6 shrink-0 rounded-full ${done ? "bg-navy" : "bg-stone"}`}
                    />
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="mt-4 text-[14px] leading-relaxed text-graphite" aria-live="polite">
            {current.caption}
          </p>

          {current.readout && (
            <div className="mt-3 rounded-card border border-stone bg-taupe/60 px-3 py-2.5">
              <p className="flex items-baseline gap-1.5">
                <span className="tabular text-[22px] font-light leading-none text-navy">
                  {current.readout.value}
                </span>
                {current.readout.unit && (
                  <span className="text-[12px] text-smoke">{current.readout.unit}</span>
                )}
              </p>
              {current.readout.note && (
                <p className="mt-1 text-[11.5px] leading-relaxed text-ash">{current.readout.note}</p>
              )}
            </div>
          )}

          {/* 이동 */}
          <div className="mt-4 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setPlayRequested(false);
                go(-1);
              }}
              disabled={at.chapter === 0 && step === 0}
              aria-label="이전 단계"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone text-smoke transition-colors hover:border-graphite hover:text-ink disabled:opacity-35"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPlayRequested(false);
                go(1);
              }}
              disabled={last}
              aria-label="다음 단계"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone text-smoke transition-colors hover:border-graphite hover:text-ink disabled:opacity-35"
            >
              <span aria-hidden="true">→</span>
            </button>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPlayRequested((on) => !on)}
                disabled={last}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone px-3 py-2 text-[12px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-ink disabled:opacity-35"
              >
                <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
                {playing ? "멈춤" : "자동 재생"}
              </button>
            )}
            <span className="tabular ml-auto text-[11px] text-ash">
              {step + 1} / {chapter.steps.length}
            </span>
          </div>

          <p className="mt-5 border-l-2 border-navy pl-3 text-[13px] leading-relaxed text-ink">
            {chapter.takeaway}
          </p>

          {claim && (
            <div className="mt-3">
              <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
            </div>
          )}
        </div>
      </div>

      {explainer.note && (
        <p className="mt-8 border-l-2 border-stone pl-4 text-[12px] leading-relaxed text-ash">
          {explainer.note}
        </p>
      )}
    </div>
  );
}
