"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { Book, BookTone } from "@/content/books/schema";

/**
 * 자서전 서가 — 나선.
 *
 * 책들이 한 줄로 서지 않고 공간의 곡선을 따라 감긴다. 앞으로 온 한 권만
 * 선명하고 나머지는 뒤로 물러나며 흐려진다. 끌거나 화살표로 돌린다.
 *
 * 왜 이 섹션만 어두운가. 목록은 훑는 자리지만 서가는 **한 권을 고르는**
 * 자리다. 밝은 목록에서는 여섯 권이 동시에 눈에 들어와 고르는 일이 되지
 * 않는다. 배경을 내리고 앞의 한 권만 세우면 고르는 동작이 생긴다.
 *
 * ★ 움직임은 장식이 아니라 기능이지만, 움직임 없이도 다 된다.
 *   prefers-reduced-motion이면 나선을 접고 평평한 목록으로 내려간다. 링크는
 *   양쪽 모두 같은 <a>이고, 화살표 키와 버튼도 양쪽에서 동작한다.
 */

const TONE: Record<BookTone, { from: string; to: string; edge: string }> = {
  ink: { from: "#1b1d23", to: "#2c313d", edge: "#3b4250" },
  clay: { from: "#3a2a24", to: "#5b4135", edge: "#6d5142" },
  moss: { from: "#1f2b24", to: "#33463a", edge: "#42594a" },
  dusk: { from: "#241f33", to: "#3b3051", edge: "#4c3f66" },
  rust: { from: "#38221e", to: "#5c332a", edge: "#714236" },
  slate: { from: "#202830", to: "#354250", edge: "#455465" },
};

/** 한 권과 다음 권 사이의 각도. 여섯 권이 한 바퀴를 절반쯤 돈다. */
const STEP = 32;
/**
 * 카메라에서 서가까지, 그리고 원근의 깊이.
 *
 * 둘의 비가 앞 카드의 확대율을 정한다(P / (P − R)). 처음에 1100/330으로
 * 뒀더니 1.43배가 되어 앞 권이 상자 밖으로 잘렸다. 1.2배면 앞 권이 또렷하게
 * 서면서도 옆 권의 어깨가 함께 보인다.
 */
const PERSPECTIVE = 1400;
const RADIUS = 240;
/** 한 칸 올라가는 높이. 이것이 원이 아니라 나선이 되게 한다. */
const RISE = 22;
/** 표지 너비. 확대율을 곱해도 상자 안에 들어와야 한다. */
const COVER = 148;

export function BookHelix({ books }: { books: Book[] }) {
  const [at, setAt] = useState(0);
  const [drag, setDrag] = useState(0);
  const [flat, setFlat] = useState(false);
  /* 끄는 중인지는 렌더가 읽어야 한다(전환을 꺼야 하므로) — 그래서 상태다. */
  const [dragging, setDragging] = useState(false);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setFlat(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const go = (step: number) => {
    setAt((prev) => Math.min(books.length - 1, Math.max(0, prev + step)));
  };

  if (books.length === 0) return null;

  if (flat) {
    return (
      <ul className="mt-4 space-y-2">
        {books.map((book) => (
          <li key={book.id}>
            <BookLink book={book} />
          </li>
        ))}
      </ul>
    );
  }

  const turn = at * STEP - drag;

  return (
    <div className="-mx-4 mt-4 overflow-hidden rounded-card bg-[#0d0f12]">
      <div
        role="group"
        aria-label="자서전 서가. 좌우 화살표 키로 넘길 수 있습니다."
        tabIndex={0}
        onKeyDown={(event) => {
          const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
          if (step === 0) return;
          event.preventDefault();
          go(step);
        }}
        onPointerDown={(event) => {
          start.current = event.clientX;
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (start.current === null) return;
          /* 끄는 거리를 각도로. 화면 폭의 절반이 한 칸이다. */
          setDrag(((event.clientX - start.current) / 160) * STEP);
        }}
        onPointerUp={() => {
          if (start.current === null) return;
          const moved = Math.round(-drag / STEP);
          start.current = null;
          setDragging(false);
          setDrag(0);
          if (moved !== 0) go(moved);
        }}
        onPointerCancel={() => {
          start.current = null;
          setDragging(false);
          setDrag(0);
        }}
        className="relative h-[340px] touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateY(-10px) rotateY(${-turn}deg)`,
            transition: dragging ? "none" : "transform 620ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          {books.map((book, index) => {
            const away = Math.abs(index - at - (-drag / STEP));
            return (
              <div
                key={book.id}
                className="absolute"
                style={{
                  transform: `rotateY(${index * STEP}deg) translateZ(${RADIUS}px) translateY(${
                    (index - at) * RISE
                  }px) translate(-50%, -50%)`,
                  /* 멀수록 흐리고 어둡다. 앞의 한 권만 읽힌다. */
                  filter: `blur(${Math.min(away * 2.4, 7)}px) brightness(${Math.max(1 - away * 0.3, 0.25)})`,
                  opacity: away > 3.2 ? 0 : 1,
                  transition: "filter 400ms linear, opacity 400ms linear",
                  zIndex: 10 - Math.round(away),
                }}
              >
                <Cover book={book} active={Math.round(at) === index} />
              </div>
            );
          })}
        </div>

      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-1">
        <Arrow dir={-1} disabled={at === 0} onClick={() => go(-1)} />
        <p className="min-w-0 text-center text-[11px] text-white/45">
          {at + 1} / {books.length}
          <span className="ml-2 tracking-[0.14em] text-white/25">끌어서 넘기기</span>
        </p>
        <Arrow dir={1} disabled={at === books.length - 1} onClick={() => go(1)} />
      </div>
    </div>
  );
}

function Arrow({
  dir,
  disabled,
  onClick,
}: {
  dir: -1 | 1;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === -1 ? "이전 책" : "다음 책"}
      className="rounded-full border border-white/15 px-3 py-1.5 text-[13px] text-white/70 transition-colors hover:border-white/35 hover:text-white disabled:opacity-25"
    >
      {dir === -1 ? "←" : "→"}
    </button>
  );
}

/**
 * 표지.
 *
 * 실제 표지 그림은 쓰지 않는다 — 출판사의 저작물이다. 제목과 해를 앉힌
 * 색면으로 대신하고, 오른쪽에 책등을 한 줄 세워 두께를 만든다.
 */
function Cover({ book, active }: { book: Book; active: boolean }) {
  const tone = TONE[book.tone];
  const ready = book.chapters.length > 0;

  return (
    <Link
      href={`/books/${book.slug}`}
      tabIndex={active ? 0 : -1}
      aria-hidden={!active}
      className="block rounded-[3px] px-3.5 py-4 shadow-[0_18px_40px_rgba(0,0,0,.55)] transition-transform duration-300 hover:scale-[1.03]"
      style={{
        width: COVER,
        background: `linear-gradient(150deg, ${tone.from}, ${tone.to})`,
        borderRight: `5px solid ${tone.edge}`,
        aspectRatio: "3 / 4.4",
      }}
    >
      <span className="block text-[10px] font-semibold tracking-[0.14em] text-white/35">
        {book.year}
      </span>
      <span className="mt-1.5 block text-[13.5px] font-bold leading-snug tracking-[-0.01em] text-white/90">
        {book.title}
      </span>
      <span className="mt-2 block text-[10px] text-white/35">{book.publisher}</span>
      <span
        className={`mt-3 inline-block rounded-full px-2 py-0.5 text-[10px] ${
          ready ? "bg-white/15 text-white/80" : "border border-white/15 text-white/40"
        }`}
      >
        {ready ? `${book.chapters.length}장` : "정리 전"}
      </span>
    </Link>
  );
}

/** 움직임을 끈 화면에서 쓰는 평평한 줄. */
function BookLink({ book }: { book: Book }) {
  const ready = book.chapters.length > 0;
  return (
    <Link
      href={`/books/${book.slug}`}
      className="flex items-baseline justify-between gap-3 rounded-card border border-stone px-4 py-3 transition-colors hover:border-graphite"
    >
      <span className="min-w-0">
        <span className="block text-[14px] font-bold text-ink">{book.title}</span>
        <span className="mt-0.5 block text-[12px] text-smoke">
          {book.publisher} · {book.year}
        </span>
      </span>
      <span className="shrink-0 text-[11px] text-ash">{ready ? `${book.chapters.length}장` : "정리 전"}</span>
    </Link>
  );
}
