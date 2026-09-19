"use client";

import { useRef, useState } from "react";

/**
 * 카드 캐러셀 껍데기.
 *
 * 한 화면에 한 장만 둔다. 여러 장을 세로로 늘어놓으면 결국 읽는 글이 되고,
 * 큰 그림으로 읽는다는 이점이 사라진다.
 *
 * 업적의 쉬운 설명과 언행의 쉽게 보기가 같은 것을 쓴다. 카드 안에 무엇을
 * 그릴지만 다르고 — 저쪽은 근거 단추, 이쪽은 원문 인용 — 넘기는 방식은
 * 같아야 한다. 두 벌로 두면 한쪽에서 스냅을 고치고 다른 쪽을 잊는다.
 *
 * 스크롤 위치에서 번호를 되읽는다. 손가락으로 쓸어 넘긴 것과 점을 눌러 넘긴
 * 것이 같은 상태로 모이게 하려면 이 방향이어야 한다.
 */
export function CardCarousel<T extends { id: string }>({
  items,
  label,
  itemLabel,
  children,
}: {
  items: T[];
  /** 트랙 전체의 이름. "장면 8개. 좌우 화살표 키로 넘길 수 있어요." */
  label: string;
  /** 카드 하나의 이름. 점 단추도 같은 이름을 쓴다. */
  itemLabel: (index: number) => string;
  /** 카드 속을 그린다. 여백(p-5)은 껍데기가 이미 잡아 둔다. */
  children: (item: T, index: number, total: number) => React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = items.length;

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
    <div className="overflow-hidden rounded-card-lg border border-stone bg-taupe">
      <div
        ref={trackRef}
        onScroll={onScroll}
        tabIndex={0}
        role="group"
        aria-label={label}
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
        {items.map((item, i) => (
          <div
            key={item.id}
            className="w-full shrink-0 snap-start snap-always p-5"
            aria-label={itemLabel(i)}
          >
            {children(item, i, total)}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-stone px-4 py-3">
        <NavButton label="이전 장면" disabled={index === 0} onClick={() => goTo(index - 1)}>
          <path d="M15 5 8 12l7 7" />
        </NavButton>

        <div className="flex gap-1.5" role="tablist" aria-label="장면 선택">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-label={itemLabel(i)}
              aria-selected={i === index}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-navy" : "w-1.5 bg-stone"
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
      className="grid h-10 w-10 place-items-center rounded-full border border-stone text-smoke transition-colors hover:border-graphite hover:text-navy disabled:opacity-30 disabled:hover:border-stone disabled:hover:text-smoke"
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
