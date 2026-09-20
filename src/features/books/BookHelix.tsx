"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { Book, BookTone } from "@/content/books/schema";

/**
 * 자서전 서가 — 나선.
 *
 * 책들이 한 줄로 서지 않고 공간의 곡선을 따라 감긴다. 가운데로 온 한 권이
 * 빛을 받고, 옆으로 갈수록 뒤로 물러나며 어둠에 잠긴다. 끌거나 굴리거나
 * 화살표로 돌린다.
 *
 * ★ 흐림이 아니라 빛으로 멀어진다.
 *   처음에는 옆 권을 blur로 뭉갰는데, 그러면 한 권만 남고 서가가 사라진다.
 *   원본이 하는 일은 초점이 아니라 조명이다 — 멀수록 어두워지고 아주 멀 때만
 *   살짝 풀린다. 그래야 다섯 권이 동시에 서 있고, 그 중 하나가 앞이다.
 *
 * ★ 원기둥이 아니라 호(弧)로 놓는다.
 *   rotateY + translateZ로 원기둥을 돌리면 옆 권이 각도만큼 뒤로 숨는다.
 *   여기서는 자리를 직접 준다 — 옆으로 x, 뒤로 z, 위로 y, 안쪽으로 살짝
 *   비튼다. 화면 폭에 몇 권을 세울지가 그대로 숫자가 된다.
 *
 * ★ 움직임 없이도 다 된다.
 *   prefers-reduced-motion이면 나선을 접고 평평한 목록으로 내려간다.
 */

const TONE: Record<BookTone, { from: string; to: string; edge: string }> = {
  ink: { from: "#1b1d23", to: "#2c313d", edge: "#3b4250" },
  clay: { from: "#3a2a24", to: "#5b4135", edge: "#6d5142" },
  moss: { from: "#1f2b24", to: "#33463a", edge: "#42594a" },
  dusk: { from: "#241f33", to: "#3b3051", edge: "#4c3f66" },
  rust: { from: "#38221e", to: "#5c332a", edge: "#714236" },
  slate: { from: "#202830", to: "#354250", edge: "#455465" },
};

/** 한 칸 옆으로 (px). 이 값이 화면에 몇 권이 서는지를 정한다. */
const SPACING = 112;
/** 한 칸 뒤로 (px). 가운데가 앞이고 양옆이 물러난다. */
const DEPTH = 150;
/** 한 칸 내려가는 높이. 이것이 호를 나선으로 만든다. */
const RISE = 16;
/** 안쪽으로 비트는 각도. */
const TILT = 24;
/** 표지 너비. */
const COVER = 126;
/**
 * 이만큼 움직이기 전에는 끌기가 아니다.
 *
 * 누를 때 곧바로 끌기로 치면 손가락이 몇 픽셀 떨리는 것만으로 책이 열리지
 * 않는다. 반대로 문턱이 너무 크면 서가가 늦게 따라온다.
 */
const DRAG_SLOP = 8;

/**
 * 클릭을 접는 문턱은 따로, 더 크게 둔다.
 *
 * 마우스를 누르고 떼는 사이에 사람 손은 몇 픽셀씩 흔들리고, 트랙패드에서는
 * 열 몇 픽셀도 흔한다. 끌기 문턱을 그대로 쓰면 그 흔들림이 전부 "끌었다"로
 * 읽혀 클릭이 사라진다 — 눌러도 책이 안 열리던 두 번째 이유가 이것이다.
 * 여기서부터는 사람이 의도해서 민 것으로 본다.
 */
const CLICK_SLOP = 16;

export function BookHelix({ books }: { books: Book[] }) {
  /** 지금 앞에 있는 자리. 끄는 동안에는 정수가 아니다. */
  const [at, setAt] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flat, setFlat] = useState(false);
  const from = useRef<{ x: number; at: number; id: number } | null>(null);
  const wheeled = useRef(0);
  /* 이번 몸짓에서 손이 움직인 거리. 끌고 놓았는데 책이 열리면 안 된다. */
  const moved = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setFlat(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const clamp = useCallback(
    (value: number) => Math.min(books.length - 1, Math.max(0, value)),
    [books.length],
  );

  const go = useCallback((step: number) => setAt((prev) => clamp(Math.round(prev) + step)), [clamp]);

  if (books.length === 0) return null;

  if (flat) {
    return (
      <ul className="mt-4 space-y-2">
        {books.map((book) => (
          <li key={book.id}>
            <BookRow book={book} />
          </li>
        ))}
      </ul>
    );
  }

  const front = Math.round(at);

  return (
    <div className="-mx-4 mt-4 overflow-hidden rounded-card bg-[#0b0c0f]">
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
        /*
         * ★ 누르는 순간에 몸짓을 정하지 않는다.
         *
         *   처음에는 pointerdown에서 preventDefault를 불렀다. 그러면 네이티브
         *   링크 드래그는 막히지만 **브라우저가 클릭까지 함께 삼킨다.** 표지를
         *   눌러도 책이 열리지 않고 어쩌다 한 번만 열리던 것이 이것 때문이다.
         *
         *   그래서 누름과 끌기를 갈랐다. 누를 때는 자리만 기억하고 아무것도
         *   막지 않는다. 손이 5px 넘게 움직인 뒤에야 끌기로 바꾸고, 그때부터
         *   포인터를 이 상자에 묶는다. 움직이지 않고 뗀 것은 그냥 클릭이다.
         */
        onPointerDown={(event) => {
          from.current = { x: event.clientX, at, id: event.pointerId };
          moved.current = 0;
        }}
        onPointerMove={(event) => {
          const start = from.current;
          if (!start) return;

          const dx = event.clientX - start.x;
          moved.current = Math.max(moved.current, Math.abs(dx));
          if (moved.current <= DRAG_SLOP) return;

          if (!dragging) {
            setDragging(true);
            /* 여기서부터는 끌기다. 상자 밖으로 나가도 놓치지 않게 잡아 둔다. */
            try {
              event.currentTarget.setPointerCapture(start.id);
            } catch {
              /* 잡지 못해도 끄는 것 자체는 된다. */
            }
          }

          /* 밀린 거리에서 문턱을 빼야 손끝과 서가가 같은 속도로 움직인다. */
          const pulled = dx - Math.sign(dx) * DRAG_SLOP;
          setAt(clamp(start.at - pulled / SPACING));
        }}
        onPointerUp={() => {
          if (!from.current) return;
          from.current = null;
          if (!dragging) return;
          setDragging(false);
          setAt((prev) => clamp(Math.round(prev)));
        }}
        onPointerCancel={() => {
          from.current = null;
          if (!dragging) return;
          setDragging(false);
          setAt((prev) => clamp(Math.round(prev)));
        }}
        onPointerLeave={() => {
          /* 끌지 않은 채 상자를 벗어났으면 누르던 것은 없던 일이다. */
          if (!dragging) from.current = null;
        }}
        onWheel={(event) => {
          /* 트랙패드 가로 스크롤. 세로로만 굴리는 마우스는 건드리지 않는다. */
          const delta = event.deltaX;
          if (Math.abs(delta) < Math.abs(event.deltaY)) return;
          wheeled.current += delta;
          if (Math.abs(wheeled.current) < 60) return;
          go(wheeled.current > 0 ? 1 : -1);
          wheeled.current = 0;
        }}
        className="relative h-[320px] cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25"
        style={{ perspective: "1500px" }}
      >
        {/* 뒤에 남는 잔상. 서가가 한 겹이 아니라는 느낌만 준다. */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ perspective: "1500px" }}>
          <div className="absolute left-1/2 top-1/2" style={{ transformStyle: "preserve-3d" }}>
            {books.map((book, index) => (
              <Placed key={`echo-${book.id}`} index={index} at={at} echo>
                <div
                  className="rounded-[10px]"
                  style={{
                    width: COVER,
                    aspectRatio: "3 / 4.3",
                    background: `linear-gradient(150deg, ${TONE[book.tone].from}, ${TONE[book.tone].to})`,
                  }}
                />
              </Placed>
            ))}
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2" style={{ transformStyle: "preserve-3d" }}>
          {books.map((book, index) => (
            <Placed key={book.id} index={index} at={at} animate={!dragging}>
              <Cover
                book={book}
                front={index === front}
                onPick={() => go(index - front)}
                moved={moved}
              />
            </Placed>
          ))}
        </div>

        {/* 가운데로 떨어지는 빛. 앞의 한 권이 어디인지 말해 준다. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 45%, rgba(255,255,255,.06), transparent 70%)",
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-1">
        <Arrow dir={-1} disabled={front === 0} onClick={() => go(-1)} />
        <p className="min-w-0 truncate text-center text-[11px] text-white/45">
          {front + 1} / {books.length}
          <span className="ml-2 tracking-[0.14em] text-white/25">
            {books[front]?.chapters.length
              ? "앞의 책을 눌러 펼치기"
              : "서지 정보만 있는 책"}
          </span>
        </p>
        <Arrow dir={1} disabled={front === books.length - 1} onClick={() => go(1)} />
      </div>
    </div>
  );
}

/** 호 위의 한 자리. 가운데에서 몇 칸 떨어졌는지로 전부 정해진다. */
function Placed({
  index,
  at,
  children,
  echo = false,
  animate = true,
}: {
  index: number;
  at: number;
  children: React.ReactNode;
  echo?: boolean;
  animate?: boolean;
}) {
  const d = index - at;
  const away = Math.abs(d);

  return (
    <div
      className="absolute"
      style={{
        transform: [
          `translate(-50%, -50%)`,
          `translateX(${d * (echo ? 74 : SPACING)}px)`,
          `translateY(${d * RISE + (echo ? 54 : 0)}px)`,
          `translateZ(${-away * DEPTH - (echo ? 420 : 0)}px)`,
          `rotateY(${-d * TILT}deg)`,
        ].join(" "),
        /* 멀수록 어두워진다. 흐림은 아주 멀 때만 조금. */
        filter: echo
          ? "blur(16px) brightness(.5)"
          : `brightness(${Math.max(1 - away * 0.26, 0.2)}) blur(${away > 2 ? Math.min((away - 2) * 2, 4) : 0}px)`,
        opacity: echo ? (away > 3 ? 0 : 0.35) : away > 3.6 ? 0 : 1,
        /*
         * 멀리 있는 표지는 눌리지 않게 한다. opacity가 0이어도 엘리먼트는
         * 그대로 있어서, 3D로 접힌 자리에 따라 앞 표지 위에 겹쳐 클릭을
         * 가로챌 수 있다. 앞과 바로 옆까지만 손이 닿는다.
         */
        pointerEvents: echo || away > 1.6 ? "none" : "auto",
        zIndex: echo ? 0 : 20 - Math.round(away),
        transition: animate
          ? "transform 560ms cubic-bezier(.2,.8,.2,1), filter 420ms linear, opacity 420ms linear"
          : "filter 420ms linear",
      }}
    >
      {children}
    </div>
  );
}

function Arrow({ dir, disabled, onClick }: { dir: -1 | 1; disabled: boolean; onClick: () => void }) {
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
 * 색면으로 대신하고, 오른쪽에 책등을 세워 두께를 만든다.
 *
 * 앞이든 아니든 늘 같은 <a>로 그린다. 앞일 때만 링크로 두고 아닐 때 버튼으로
 * 바꾸면, 끄는 도중 앞자리가 넘어갈 때마다 손 밑의 노드가 갈아 끼워진다.
 * 무엇을 하느냐는 클릭에서 가른다.
 *
 * ★ 정리한 책과 아직 못 한 책을 같은 무게로 세우지 않는다.
 *   배지 하나로만 가르니 서가에서는 일곱 권이 똑같이 단단해 보였다. 장이
 *   들어온 책만 실물처럼 칠하고, 서지 정보만 있는 책은 **비워 둔 자리**처럼
 *   윤곽만 남긴다. 감추지는 않는다 — 무엇이 아직 안 됐는지 보이는 편이
 *   이 사이트의 태도에 맞다.
 */
function Cover({
  book,
  front,
  onPick,
  moved,
}: {
  book: Book;
  front: boolean;
  onPick: () => void;
  moved: React.RefObject<number>;
}) {
  const tone = TONE[book.tone];
  const ready = book.chapters.length > 0;

  return (
    <Link
      href={`/books/${book.slug}`}
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      tabIndex={front ? 0 : -1}
      aria-hidden={!front}
      onClick={(event) => {
        /*
         * 끌고 나서 손을 뗀 것은 클릭이 아니다. 몇 픽셀만 밀려도 브라우저는
         * 클릭으로 치므로, 움직인 거리를 보고 가른다.
         */
        if (moved.current > CLICK_SLOP) {
          event.preventDefault();
          return;
        }
        /*
         * 옆에 선 책을 누르면 그 책이 앞으로 온다. 곧바로 열리면 무엇을 고른
         * 것인지 모른 채 페이지가 바뀐다.
         */
        if (!front) {
          event.preventDefault();
          onPick();
        }
      }}
      className={`block rounded-[10px] px-3 py-3.5 text-left ${
        ready ? "shadow-[0_22px_48px_rgba(0,0,0,.6)]" : ""
      } ${front ? "ring-1 ring-white/10" : ""}`}
      style={{
        width: COVER,
        /* 정리한 책은 색면, 아직인 책은 윤곽만. */
        background: ready
          ? `linear-gradient(150deg, ${tone.from}, ${tone.to})`
          : `linear-gradient(150deg, ${tone.from}22, ${tone.to}22)`,
        border: ready ? undefined : "1px dashed rgba(255,255,255,.22)",
        borderRight: ready ? `4px solid ${tone.edge}` : "1px dashed rgba(255,255,255,.22)",
        aspectRatio: "3 / 4.3",
      }}
    >
      <span
        className={`block text-[9.5px] font-semibold tracking-[0.14em] ${
          ready ? "text-white/35" : "text-white/25"
        }`}
      >
        {book.year}
      </span>
      <span
        className={`mt-1.5 block text-[12.5px] font-bold leading-snug tracking-[-0.01em] ${
          ready ? "text-white/90" : "text-white/45"
        }`}
      >
        {book.title}
      </span>
      <span
        className={`mt-1.5 block text-[9.5px] ${ready ? "text-white/35" : "text-white/20"}`}
      >
        {book.publisher}
      </span>
      <span className="mt-2 flex flex-wrap gap-1">
        {book.sample && (
          <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-[#0b0c0f]">
            샘플
          </span>
        )}
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] ${
            ready ? "bg-white/15 text-white/80" : "border border-white/20 text-white/35"
          }`}
        >
          {ready ? `${book.chapters.length}장` : "정리 전"}
        </span>
      </span>
    </Link>
  );
}

/** 움직임을 끈 화면에서 쓰는 평평한 줄. */
function BookRow({ book }: { book: Book }) {
  const ready = book.chapters.length > 0;
  return (
    <Link
      href={`/books/${book.slug}`}
      className={`flex items-baseline justify-between gap-3 rounded-card px-4 py-3 transition-colors hover:border-graphite ${
        ready ? "border border-stone" : "border border-dashed border-stone"
      }`}
    >
      <span className="min-w-0">
        <span className={`block text-[14px] font-bold ${ready ? "text-ink" : "text-ash"}`}>
          {book.title}
        </span>
        <span className={`mt-0.5 block text-[12px] ${ready ? "text-smoke" : "text-ash"}`}>
          {book.publisher} · {book.year}
        </span>
      </span>
      <span className="shrink-0 text-[11px] text-ash">
        {ready ? `${book.chapters.length}장` : "정리 전"}
      </span>
    </Link>
  );
}
