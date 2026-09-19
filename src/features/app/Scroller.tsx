"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 가로 스크롤 목록.
 *
 * 터치에서는 native 스크롤로 충분하다. 문제는 마우스다 —
 * 스크롤바를 감췄고(`no-scrollbar`) 드래그도 화살표도 없으면,
 * 데스크탑에서는 옆으로 넘길 방법이 사실상 없다. shift+휠을 아는 사람만 넘긴다.
 *
 * 모바일 우선은 "데스크탑에서 깨져도 된다"가 아니다.
 * 그래서 포인터가 정밀한 환경에서만 화살표를 띄운다. 터치에는 나타나지 않는다.
 */

interface State {
  canPrev: boolean;
  canNext: boolean;
  index: number;
  pages: number;
}

export function useScroller<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<State>({
    canPrev: false,
    canNext: false,
    index: 0,
    pages: 1,
  });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({
      // 1px 여유를 둔다. 소수점 때문에 끝에서 화살표가 깜빡인다.
      canPrev: el.scrollLeft > 1,
      canNext: el.scrollLeft < max - 1,
      index: Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)),
      pages: Math.max(1, Math.round(el.scrollWidth / Math.max(el.clientWidth, 1))),
    });
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  /** 한 화면씩. 카드 목록이면 화면 너비의 80%만 움직여 다음 카드가 걸쳐 보이게 한다. */
  const page = useCallback((dir: -1 | 1, ratio = 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * ratio, behavior: "smooth" });
  }, []);

  const toIndex = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  return { ref, ...state, onScroll: measure, page, toIndex };
}

export function ScrollArrow({
  dir,
  disabled,
  onClick,
  label,
}: {
  dir: -1 | 1;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-stone bg-eggshell/90 text-graphite shadow-sm backdrop-blur transition-opacity hover:border-graphite disabled:pointer-events-none disabled:opacity-0 [@media(pointer:fine)]:grid ${
        dir === -1 ? "left-1" : "right-1"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={dir === -1 ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
