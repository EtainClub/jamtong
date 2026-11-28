"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { gardenFeedback } from "../feedback";

/**
 * 슬롯머신 한 대 — 잼병 모양 함(GPT 그림, public/garden/slot/)의 창 뒤에 3×3 릴, 옆에 레버(docs/garden-slots.md).
 *
 * ★ 결과는 레버를 당기는 순간 장부에 정해진다(store의 spinSeedSlot·spinRoomSlot). 릴은 그 결과를 보여 주기만 한다 —
 *   돌아가는 동안 닫아도 받은 것은 그대로다.
 * ★ 당첨은 가운데 줄만 본다. 위·아래 줄은 세 칸 모두 다른 그림 — "거의 당첨" 연출을 만들지 않는다.
 * ★ 릴은 Web Animations로 움직인다: 살짝 아래로 당겼다가(준비) 빠르게 올라가고, 감속하며 조금 지나쳤다 돌아와 멈춘다.
 *   움직임 줄이기면 돌지 않고 바로 멈춘다.
 */
export interface SlotSymbol {
  key: string;
  label: string;
  node: ReactNode;
}

export interface SlotResult {
  /** 가운데 줄(당첨 줄)에 멈출 그림의 번호(symbols 안). */
  reels: [number, number, number];
  win: boolean;
  /** 멈춘 뒤 보일 결과. */
  message: ReactNode;
}

/** 함 그림 안의 창 자리(그림 크기에 대한 %, 그림을 처리할 때 잰 값 — docs/garden-slots.md). */
const WINDOW = { left: 22.58, top: 38.8, width: 54.37, height: 37.41 };
/** 레버가 꽂히는 자리(함 그림에 대한 %). */
const SOCKET = { left: 93, top: 56.6 };
/** 레버가 내려가는 시간 — 내려간 순간 릴이 돈다. */
const PULL_MS = 280;
/** 릴마다 멈추는 데 걸리는 시간(차례로 멈춘다). */
const SPIN_MS = [1700, 2300, 2900];
/** 띠의 채움 길이 — 마지막 릴일수록 더 많이 돈다. */
const FILL = [16, 22, 28];

type Column = number[];

/** 한 릴의 띠 — [지금 보이는 셋, 채움…, 멈출 위·가운데·아래, 덤 하나(지나쳤다 돌아올 때 비지 않게)]. */
function stripOf(from: Column, mid: number, n: number, len: number, rand: () => number, top: number, bottom: number): Column {
  const fill = () => Math.floor(rand() * n);
  return [...from, ...Array.from({ length: len }, fill), top, mid, bottom, fill()];
}

/** 위·아래 줄 — 세 칸 모두 다른 그림(그림이 셋보다 적으면 셋이 같지만 않게). */
function sideRow(n: number, rand: () => number): [number, number, number] {
  if (n < 2) return [0, 0, 0];
  let row: [number, number, number];
  do row = [0, 1, 2].map(() => Math.floor(rand() * n)) as [number, number, number];
  while (n >= 3 ? new Set(row).size < 3 : row[0] === row[1] && row[1] === row[2]);
  return row;
}

export function SlotMachine({
  symbols,
  cost,
  jam,
  left,
  footer,
  odds,
  onSpin,
  free = 0,
  freeLabel = "🎟 무료로 당기기",
  after,
}: {
  symbols: SlotSymbol[];
  /** 무료로 당길 수 있는 수(퀴즈 찬스·손님 한 번). 있으면 잼·남은 수와 상관없이 당긴다. */
  free?: number;
  freeLabel?: string;
  /** 멈춘 뒤 결과 아래에 붙일 것(퀴즈 찬스 등). 꽝이었는지(win=false)를 받는다. */
  after?: (win: boolean) => ReactNode;
  cost: number;
  jam: number;
  /** 오늘 남은 수. */
  left: number;
  /** 천장까지 남은 수 같은 한 줄. */
  footer?: ReactNode;
  /** 확률표(접어 둔다). */
  odds: ReactNode;
  /** 돌린다. 돌리지 못하면 까닭(글). 서버에서 정하는 결과(남의 방 뽑기 기계)는 Promise로 — 그동안 레버를 막는다. */
  onSpin: () => SlotResult | string | Promise<SlotResult | string>;
}) {
  const n = Math.max(1, symbols.length);
  const [strips, setStrips] = useState<Column[]>(() => [0, 1, 2].map((c) => [c % n, (c + 1) % n, (c + 2) % n]));
  const [phase, setPhase] = useState<"idle" | "wait" | "pull" | "spin">("idle");
  const [result, setResult] = useState<SlotResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(0);
  /** 레버를 당긴 횟수 — 바뀔 때마다 레버 그림을 새로 그려 당기는 움직임(0.75초)을 끝까지 한 번 보인다. */
  const [pulls, setPulls] = useState(0);
  const stripEls = useRef<Array<HTMLDivElement | null>>([]);
  const reelEls = useRef<Array<HTMLDivElement | null>>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pending = useRef<{ next: Column[]; got: SlotResult } | null>(null);
  const busy = phase !== "idle";

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // 띠를 새로 깐 뒤(spin 단계로 들어간 렌더 다음) 릴마다 움직임을 건다.
  useEffect(() => {
    if (phase !== "spin" || !pending.current) return;
    const { next, got } = pending.current;
    let done = 0;
    next.forEach((strip, i) => {
      const el = stripEls.current[i];
      if (!el) return;
      const end = ((strip.length - 4) / strip.length) * 100;
      const cell = 100 / strip.length;
      const anim = el.animate(
        [
          { transform: "translateY(0)", filter: "blur(0)" },
          { transform: `translateY(${cell * 0.35}%)`, filter: "blur(0)", offset: 0.07, easing: "cubic-bezier(.5,0,.7,.4)" },
          { transform: `translateY(-${end * 0.55}%)`, filter: "blur(2.4px)", offset: 0.45, easing: "linear" },
          { transform: `translateY(-${end + cell * 0.22}%)`, filter: "blur(0.6px)", offset: 0.9, easing: "cubic-bezier(.2,.7,.3,1)" },
          { transform: `translateY(-${end}%)`, filter: "blur(0)" },
        ],
        { duration: SPIN_MS[i], easing: "cubic-bezier(.35,0,.25,1)", fill: "forwards" },
      );
      anim.onfinish = () => {
        gardenFeedback("tap");
        reelEls.current[i]?.animate([{ transform: "translateY(0)" }, { transform: "translateY(3px)" }, { transform: "translateY(0)" }], { duration: 180, easing: "ease-out" });
        if (++done < 3) return;
        // 다음 판을 위해 띠를 멈춘 셋으로 접는다(움직임 없이, 같은 그림이라 튀지 않는다).
        timers.current.push(
          setTimeout(() => {
            stripEls.current.forEach((e) => e?.getAnimations().forEach((a) => a.cancel()));
            setStrips(next.map((s) => s.slice(-4, -1)));
            setPhase("idle");
            setResult(got);
            pending.current = null;
            if (got.win) {
              gardenFeedback("reward");
              setCelebrate((c) => c + 1);
            }
          }, 140),
        );
      };
    });
  }, [phase]);

  const spin = async () => {
    if (busy) return;
    setError(null);
    const out = onSpin();
    let got: SlotResult | string;
    if (out instanceof Promise) {
      setPhase("wait");
      got = await out.catch((e: unknown) => {
        console.error("[slot] 돌리지 못했다", e);
        return "돌리지 못했어요. 잠시 뒤 다시 해 보세요";
      });
      setPhase("idle");
    } else got = out;
    if (typeof got === "string") {
      setError(got);
      gardenFeedback("tap");
      return;
    }
    setResult(null);
    gardenFeedback("tap");
    const rand = Math.random;
    const top = sideRow(n, rand);
    const bottom = sideRow(n, rand);
    const next = strips.map((s, i) => stripOf(s.slice(-3), got.reels[i], n, FILL[i], rand, top[i], bottom[i]));
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setStrips(next.map((s) => s.slice(-4, -1)));
      setResult(got);
      if (got.win) gardenFeedback("reward");
      return;
    }
    pending.current = { next, got };
    setPulls((p) => p + 1);
    setPhase("pull");
    timers.current.push(
      setTimeout(() => {
        setStrips(next);
        setPhase("spin");
      }, PULL_MS),
    );
  };

  const canSpin = !busy && (free > 0 || (left > 0 && jam >= cost));
  const label = busy ? "돌아가는 중" : `가운데 줄: ${strips.map((s) => symbols[s[s.length - 2]]?.label).join(", ")}`;
  return (
    <div className="garden-slot">
      <div className={`garden-slot-cabinet ${busy ? "is-busy" : ""} ${celebrate && !busy && result?.win ? "is-win" : ""}`} key={`c${celebrate}`}>
        <div
          className="garden-slot-window"
          role="img"
          aria-label={label}
          style={{ left: `${WINDOW.left}%`, top: `${WINDOW.top}%`, width: `${WINDOW.width}%`, height: `${WINDOW.height}%` }}
        >
          <span className="garden-slot-payline" aria-hidden="true" />
          {strips.map((strip, i) => (
            <div key={i} className="garden-slot-reel" ref={(el) => { reelEls.current[i] = el; }}>
              <div className="garden-slot-strip" ref={(el) => { stripEls.current[i] = el; }} style={{ height: `${(strip.length / 3) * 100}%` }}>
                {strip.map((sym, k) => (
                  <div key={k} className={`garden-slot-cell ${result?.win && !busy && k === strip.length - 2 ? "is-win" : ""}`}>
                    {symbols[sym]?.node}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* 함 그림(창은 투명) — 릴 위에 겹친다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/garden/slot/cabinet.webp" alt="" className="garden-slot-frame" draggable={false} />
        <span
          className="garden-slot-bulbs"
          aria-hidden="true"
          style={{ left: `${WINDOW.left - 3.5}%`, top: `${WINDOW.top - 2.6}%`, width: `${WINDOW.width + 7}%`, height: `${WINDOW.height + 5.2}%` }}
        />
        <button
          type="button"
          className="garden-slot-lever"
          aria-label={free > 0 ? "레버 당기기 · 무료" : `레버 당기기 · 잼 ${cost}`}
          disabled={!canSpin}
          onClick={() => void spin()}
          style={{ left: `${SOCKET.left}%`, top: `${SOCKET.top}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={pulls} src="/garden/slot/lever.webp" alt="" draggable={false} className={pulls ? "is-pulled" : ""} />
        </button>
        {celebrate > 0 && !busy && result?.win && (
          <span className="garden-slot-sparks" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} style={{ ["--a" as string]: `${i * 36}deg` }} />
            ))}
          </span>
        )}
      </div>

      <div className="garden-slot-controls">
        <button type="button" className="garden-slot-go" disabled={!canSpin} onClick={() => void spin()}>
          {busy ? "돌아가는 중…" : free > 0 ? freeLabel : left <= 0 ? "오늘은 끝" : jam < cost ? `🍯${cost} 필요` : `🍯${cost} 당기기`}
        </button>
        <p className="garden-slot-meta">
          남은 {left}번 · 🍯{jam.toLocaleString("ko-KR")}
          {footer && <span className="block">{footer}</span>}
        </p>
      </div>
      {error && <p className="mt-1 text-center text-[12.5px] font-bold text-[#c2410c]">{error}</p>}
      <div aria-live="polite">{result && !busy && <div className={`garden-slot-result ${result.win ? "is-win" : ""}`}>{result.message}</div>}</div>
      {result && !busy && after?.(result.win)}
      <details className="garden-slot-odds">
        <summary>확률 보기 · 가운데 줄이 당첨 줄</summary>
        <div className="mt-1.5">{odds}</div>
      </details>
    </div>
  );
}

export function pct(p: number): string {
  const v = p * 100;
  return `${v >= 1 ? v.toFixed(v % 1 ? 1 : 0) : v.toFixed(v >= 0.1 ? 2 : 3).replace(/0+$/, "")}%`;
}
