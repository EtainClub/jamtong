"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { GuideVisualView } from "./GuideVisuals";
import type { GuideChapter } from "./storyboard";

/**
 * 둘러보기 해설의 껍데기.
 *
 * 업적 해설(`motion/explainer/ExplainerScene`)과 같은 판단을 쓴다. 저쪽을
 * 그대로 부르지 않는 이유는 하나다 — 저 컴포넌트는 장마다 근거(claim)를
 * 요구한다. 이 해설이 설명하는 것은 이 앱의 화면이지 대조 대상이 되는
 * 사실이 아니라서, 없는 근거를 지어 넣어야 재사용이 된다. 그 대신 장마다
 * 제가 줄여 말한 본문 절로 돌아가는 문을 둔다.
 *
 * ★ 단계 이동은 장 경계를 넘는다.
 *   마지막 단계에서 →를 누르면 다음 장의 첫 단계로 간다. 장마다 따로 끝나면
 *   읽는 사람이 매번 다음 장을 찾아 눌러야 한다.
 *
 * ★ 자동 재생은 양보한다.
 *   탭을 떠나면, 화면 밖으로 나가면, 움직임을 원하지 않는다고 밝혔으면
 *   멈춘다.
 *
 * ★ 글이 뜻을 나른다.
 *   그림은 aria-hidden이다. 설명·단계 이름·맺음말은 전부 진짜 글이라
 *   그림을 끄고도 이 절만 읽어 내려갈 수 있다.
 */

const STEP_MS = 4200;

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

export function GuideExplainer({ chapters }: { chapters: GuideChapter[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState({ chapter: 0, step: 0 });
  const [playRequested, setPlayRequested] = useState(false);
  const reduced = useReducedMotion();

  const chapter = chapters[at.chapter];
  const step = Math.min(at.step, chapter.steps.length - 1);
  const current = chapter.steps[step];

  const last = at.chapter === chapters.length - 1 && step === chapter.steps.length - 1;
  const playing = playRequested && !last && !reduced;

  const go = useCallback(
    (delta: 1 | -1) => {
      setAt((now) => {
        const here = chapters[now.chapter];
        const next = now.step + delta;
        if (next >= 0 && next < here.steps.length) return { ...now, step: next };
        const nextChapter = now.chapter + delta;
        if (nextChapter < 0 || nextChapter >= chapters.length) return now;
        return {
          chapter: nextChapter,
          step: delta === 1 ? 0 : chapters[nextChapter].steps.length - 1,
        };
      });
    },
    [chapters],
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
      <ol className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1" aria-label="장">
        {chapters.map((c, i) => {
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

      <h3 className="mt-5 text-[17px] font-bold leading-snug text-ink">{chapter.question}</h3>

      <div className="mt-4">
        <GuideVisualView visual={chapter.visual} step={step} />
      </div>

      {/* 단계 레일 */}
      <ol className="mt-5 flex flex-col gap-1" aria-label="단계">
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
            <span className="tabular text-[20px] font-light leading-none text-navy">
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

      {/*
       * 그림에서 본 것을 글로 확인할 자리. 해설은 본문의 입구이지 본문을
       * 대신하는 것이 아니다.
       */}
      <a
        href={`#${chapter.sectionId}`}
        className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-navy"
      >
        글로 읽기 · {chapter.sectionLabel}
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}
