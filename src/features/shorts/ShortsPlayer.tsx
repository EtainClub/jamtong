"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Achievement, Claim } from "@/content/schema";
import { ShortSlide } from "./ShortSlide";

/**
 * 숏츠 플레이어.
 *
 * 세로 전체화면, 자동 재생, 위아래로 넘긴다. 목록을 훑는 대신 한 장씩
 * 밀어 넣는 방식이라 "짧고 굵게"에 맞는다.
 *
 * 스크롤 컨테이너 + scroll-snap으로 만든다. 직접 만든 스와이프 핸들러보다
 * 관성·바운스·접근성이 브라우저 기본 동작으로 해결되고, 키보드와
 * 스크롤바도 공짜로 따라온다.
 *
 * 자동 넘김은 정지할 수 있어야 한다. 읽는 속도는 사람마다 다르고,
 * 멈출 수 없는 자동 재생은 접근성에서 실패다(WCAG 2.2.2).
 */

const DURATION_MS = 6200;

export function ShortsPlayer({
  items,
  claims,
}: {
  items: Achievement[];
  claims: Claim[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((next: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const clamped = Math.max(0, Math.min(scroller.children.length - 1, next));
    scroller.scrollTo({
      top: clamped * scroller.clientHeight,
      behavior: "smooth",
    });
  }, []);

  // 스크롤 위치에서 현재 장을 읽는다. 상태로 스크롤을 밀지 않는다.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const next = Math.round(scroller.scrollTop / scroller.clientHeight);
        setIndex((current) => (current === next ? current : next));
      });
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // 장이 바뀌면 진행 막대를 처음부터.
  useEffect(() => setProgress(0), [index]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!playing || reduced) return;

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const ratio = Math.min(1, (now - start) / DURATION_MS);
      setProgress(ratio);
      if (ratio < 1) {
        frame = requestAnimationFrame(tick);
      } else if (index < items.length - 1) {
        goTo(index + 1);
      } else {
        setPlaying(false);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [playing, index, items.length, goTo]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === " ") {
      event.preventDefault();
      setPlaying((p) => !p);
    }
  };

  return (
    <div
      className="relative mx-auto flex w-full max-w-[460px] flex-col overflow-hidden rounded-2xl border border-line bg-ink-900"
      style={{ height: "min(860px, calc(100dvh - 7rem))" }}
      onKeyDown={onKeyDown}
    >
      {/* 진행 막대 — 몇 장 중 몇 번째인지가 보여야 넘길 마음이 든다 */}
      <div className="absolute inset-x-0 top-0 z-20 flex gap-1 p-3">
        {items.map((item, i) => (
          <span key={item.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
            <span
              className="block h-full rounded-full bg-white"
              style={{
                width: i < index ? "100%" : i === index ? `${progress * 100}%` : "0%",
              }}
            />
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-pressed={!playing}
        className="absolute right-3 top-7 z-20 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-semibold text-white/85 backdrop-blur transition-colors hover:bg-black/55"
      >
        {playing ? "❚❚ 멈춤" : "▶ 재생"}
      </button>

      <div
        ref={scrollerRef}
        tabIndex={0}
        role="group"
        aria-label={`성과 숏츠 ${items.length}장. 위아래 화살표로 넘기고 스페이스로 재생을 멈춥니다.`}
        className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto scroll-smooth focus:outline-none"
      >
        {items.map((item, i) => (
          <div key={item.id} className="h-full w-full snap-start snap-always">
            <ShortSlide item={item} claims={claims} active={i === index} />
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 text-[11px] font-medium text-white/40">
        {index + 1} / {items.length}
      </div>
    </div>
  );
}
