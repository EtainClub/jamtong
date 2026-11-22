"use client";

import type { CSSProperties } from "react";

import { AVATAR_H, AVATAR_W, AvatarFigure } from "./avatar/AvatarArt";
import { faceFor } from "./avatar/rules";
import { PlantArt } from "./GardenArt";
import { formatLeft, isRaining } from "./rules";
import type { AvatarData } from "./avatar/rules";
import type { Plant, Species } from "./types";
import { YARD_BY_ID, YARD_SLOTS, type YardData, type YardItem } from "./yard";
import yardArt from "./yardArt.json";

/**
 * 아이소 마당 — 텃밭을 내 방과 같은 2:1 아이소메트릭으로(docs/garden-farm-v2.md §6 4단계).
 *
 * ★ 밭은 세 줄 × (밭 수 / 3) 줄의 흙 두둑. 두둑 사이는 반 타일 길. 뒤 두 변에 낮은 울타리.
 * ★ 작물은 텃밭이 원래 쓰던 PlantArt(자라는 정도 progress로 씨앗 → 새싹 → 열매)를 두둑 위에 세운다 — 새 그림 없이.
 * ★ 누르기는 그림 위에 겹친 진짜 단추(방과 같다). 단추 이름·하는 일은 옛 칸 텃밭과 같다.
 * ★ 꼬마는 마당 앞 길에 서 있다가, 거두면 그 밭 앞으로 간다(CSS transform — 움직임 줄이기면 바로).
 * ★ 단비가 오는 동안 빗줄기를 그린다 — 단비는 성장 ×2라 쓸모 있는 표시다.
 */

const TW = 64;
const TH = TW / 2;
/** 밭 사이 간격(타일). 밭 하나 1 × 1, 길 0.5. */
const PITCH = 1.5;
const COLS = 3;
const MARGIN = 0.6;
const FENCE = 18;
const PLANT_W = 58;
const TOP = 42;

interface YardGeom {
  rows: number;
  W: number;
  H: number;
  P: (u: number, v: number, z?: number) => [number, number];
  /** 밭 i의 바닥 상자(u, v 시작). */
  plot: (i: number) => { u: number; v: number };
  /** 꼬마 기본 자리 — 마당 앞 길 가운데. */
  home: { u: number; v: number };
  /** 꾸밈 자리 i의 한가운데(yard.ts의 YARD_SLOTS) — 울타리를 따라 세 꼭짓점과 두 울타리 가운데. */
  slot: (i: number) => { u: number; v: number };
}

/** top은 마당 위 여백 — 뒤쪽 자리에 키 큰 소품(풍차)이 서면 늘린다. */
export function yardGeom(plots: number, top = TOP): YardGeom {
  const rows = Math.max(1, Math.ceil(plots / COLS));
  const nu = MARGIN * 2 + (COLS - 1) * PITCH + 1;
  const nv = MARGIN * 2 + (rows - 1) * PITCH + 1 + 0.9;
  const ox = (nv * TW) / 2 + 8;
  const oy = top;
  // 울타리를 따라 — 안쪽 꼭짓점, 오른쪽 꼭짓점, 왼쪽 꼭짓점, 오른쪽 울타리 가운데, 왼쪽 울타리 가운데.
  // 울타리 쪽 자리는 그리는 차례가 밭보다 앞이라 작물을 가리지 않는다. 앞 꼭짓점은 비운다(꼬마가 서는 길).
  const SLOTS = [{ u: 0.3, v: 0.3 }, { u: nu - 0.3, v: 0.3 }, { u: 0.3, v: nv - 0.4 }, { u: nu / 2, v: 0.3 }, { u: 0.3, v: nv / 2 }];
  const P = (u: number, v: number, z = 0): [number, number] => [ox + ((u - v) * TW) / 2, oy + ((u + v) * TH) / 2 - z];
  return {
    rows,
    W: ((nu + nv) * TW) / 2 + 16,
    H: oy + ((nu + nv) * TH) / 2 + 12,
    P,
    plot: (i) => ({ u: MARGIN + (i % COLS) * PITCH, v: MARGIN + Math.floor(i / COLS) * PITCH }),
    home: { u: nu / 2, v: nv - 0.45 },
    slot: (i) => SLOTS[i] ?? SLOTS[0],
  };
}

/** 마당 소품 그림 크기(마당 타일 64px — 방 타일 40의 1.6배). */
const YARD_K = TW / 40;
function decoSize(item: YardItem): { w: number; h: number } {
  return { w: TW, h: TH + item.h * YARD_K };
}

const pts = (list: Array<[number, number]>) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

export interface YardPlot {
  plant: Plant | null;
  species?: Species;
  progress: number;
  ripe: boolean;
  left: number;
}

export function IsoYard({
  plots,
  now,
  selected,
  avatar,
  mood,
  avatarAt,
  harvested,
  onPlot,
  yard,
  editing = false,
  onSlot,
}: {
  plots: YardPlot[];
  now: number;
  selected: number | null;
  avatar?: AvatarData;
  mood: string;
  /** 꼬마가 가 있는 밭(최근에 거둔 밭). 없으면 마당 앞 길. */
  avatarAt: number | null;
  /** 밭마다 마지막으로 거둔 시각 — "✦ 수확!"을 띄운다. */
  harvested: Record<number, number>;
  onPlot: (i: number) => void;
  /** 마당 꾸밈(yard.ts). */
  yard?: YardData;
  /** 마당 꾸미기 중 — 밭 대신 꾸밈 자리가 단추가 된다. */
  editing?: boolean;
  onSlot?: (slot: number) => void;
}) {
  const slots = yard?.slots ?? [];
  // 뒤쪽 두 자리(0·1)에 선 소품이 마당 위 여백보다 크면 여백을 늘린다 — 잘리지 않게.
  const tallest = Math.max(0, ...[0, 1].map((i) => { const it = slots[i] ? YARD_BY_ID.get(slots[i]!) : undefined; return it ? decoSize(it).h : 0; }));
  const g = yardGeom(plots.length, Math.max(TOP, tallest - TH / 2 + 8));
  const { P, W, H } = g;
  const nu = MARGIN * 2 + (COLS - 1) * PITCH + 1;
  const nv = MARGIN * 2 + (g.rows - 1) * PITCH + 1 + 0.9;
  const rain = isRaining(now);
  // 뒤(안쪽)부터 그린다 — 두둑과 소품을 함께, 한가운데의 u + v가 작은 것부터.
  const order: Array<{ kind: "plot" | "deco"; i: number; depth: number }> = [
    ...plots.map((_, i) => { const p = g.plot(i); return { kind: "plot" as const, i, depth: p.u + p.v + 1 }; }),
    ...slots.flatMap((id, i) => (id ? [{ kind: "deco" as const, i, depth: g.slot(i).u + g.slot(i).v }] : [])),
  ].sort((a, b) => a.depth - b.depth);
  const spot = avatarAt !== null ? (() => { const p = g.plot(avatarAt); return { u: p.u + 0.5, v: p.v + 1.15 }; })() : g.home;
  const [ax, ay] = P(spot.u, spot.v);
  const box = (i: number) => {
    const p = g.plot(i);
    const [x0] = P(p.u, p.v + 1);
    const [x1] = P(p.u + 1, p.v);
    const [, top] = P(p.u, p.v, 10 + PLANT_W * 0.9);
    const [, bottom] = P(p.u + 1, p.v + 1);
    return { x: x0, y: top, w: x1 - x0, h: bottom - top };
  };
  const pct = (b: { x: number; y: number; w: number; h: number }): CSSProperties => ({
    left: `${(b.x / W) * 100}%`,
    top: `${(b.y / H) * 100}%`,
    width: `${(b.w / W) * 100}%`,
    height: `${(b.h / H) * 100}%`,
  });

  return (
    <div className="garden-yard" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="내 텃밭 마당" className="garden-yard-art">
        <defs>
          <pattern id="yard-grass" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform={`matrix(0.7 0.35 -0.7 0.35 ${P(0, 0)[0]} ${P(0, 0)[1]})`}>
            <rect width="22" height="22" fill="#8fcb6a" />
            <rect x="4" y="6" width="2" height="4" fill="#6aa94f" />
            <rect x="14" y="14" width="2" height="3" fill="#6aa94f" />
          </pattern>
          <pattern id="yard-soil" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform={`matrix(0.7 0.35 -0.7 0.35 ${P(0, 0)[0]} ${P(0, 0)[1]})`}>
            <rect width="12" height="12" fill="#8a5a36" />
            <rect y="5" width="12" height="2" fill="#7a4d2d" />
          </pattern>
        </defs>
        <g stroke="#3a2f2a" strokeWidth="1.5" strokeLinejoin="round">
          {/* 마당 바닥과 앞쪽 흙 두께 */}
          <polygon points={pts([P(nu, 0, -10), P(nu, nv, -10), P(nu, nv), P(nu, 0)])} fill="#7a5233" />
          <polygon points={pts([P(0, nv, -10), P(nu, nv, -10), P(nu, nv), P(0, nv)])} fill="#9a6439" />
          <polygon points={pts([P(0, 0), P(nu, 0), P(nu, nv), P(0, nv)])} fill="url(#yard-grass)" />
          {/* 뒤 두 변의 낮은 울타리 — 기둥과 가로대 */}
          {Array.from({ length: Math.ceil(nu / 0.5) + 1 }, (_, k) => k * 0.5).filter((u) => u <= nu).map((u) => (
            <polygon key={`fu${u}`} points={pts([P(u, 0), P(u + 0.12, 0), P(u + 0.12, 0, FENCE + 4), P(u, 0, FENCE + 4)])} fill="#e9c98f" />
          ))}
          {Array.from({ length: Math.ceil(nv / 0.5) + 1 }, (_, k) => k * 0.5).filter((v) => v <= nv).map((v) => (
            <polygon key={`fv${v}`} points={pts([P(0, v), P(0, v + 0.12), P(0, v + 0.12, FENCE + 4), P(0, v, FENCE + 4)])} fill="#d9b67a" />
          ))}
          <polygon points={pts([P(0, 0, FENCE - 4), P(nu, 0, FENCE - 4), P(nu, 0, FENCE), P(0, 0, FENCE)])} fill="#f3d9a6" />
          <polygon points={pts([P(0, 0, FENCE - 4), P(0, nv, FENCE - 4), P(0, nv, FENCE), P(0, 0, FENCE)])} fill="#e2c38c" />
        </g>
        {order.map(({ kind, i }) => {
          if (kind === "deco") {
            const item = YARD_BY_ID.get(slots[i]!);
            if (!item) return null;
            const c = g.slot(i);
            const [x] = P(c.u, c.v);
            const [, bottom] = P(c.u + 0.5, c.v + 0.5);
            const size = decoSize(item);
            return yardArt.includes(item.id) ? (
              <image key={`d${i}`} href={`/images/room-iso/yard-${item.id}.png`} x={x - size.w / 2} y={bottom - size.h} width={size.w} height={size.h} preserveAspectRatio="xMidYMax meet" />
            ) : (
              <text key={`d${i}`} x={x} y={bottom - 6} fontSize={Math.min(46, 16 + item.h * 0.4)} textAnchor="middle">{item.emoji}</text>
            );
          }
          const { u, v } = g.plot(i);
          const plot = plots[i];
          const h = 8;
          const [cx, cy] = P(u + 0.5, v + 0.5, h);
          const size = PLANT_W * (0.6 + plot.progress * 0.4);
          return (
            <g key={i}>
              <g stroke="#3a2f2a" strokeWidth="1.5" strokeLinejoin="round">
                <polygon points={pts([P(u, v + 1), P(u + 1, v + 1), P(u + 1, v + 1, h), P(u, v + 1, h)])} fill="#6e4426" />
                <polygon points={pts([P(u + 1, v), P(u + 1, v + 1), P(u + 1, v + 1, h), P(u + 1, v, h)])} fill="#5a361e" />
                <polygon
                  points={pts([P(u, v, h), P(u + 1, v, h), P(u + 1, v + 1, h), P(u, v + 1, h)])}
                  fill={plot.ripe ? "#9a6a3f" : "url(#yard-soil)"}
                  stroke={selected === i ? "#2f6b22" : "#3a2f2a"}
                  strokeWidth={selected === i ? 3 : 1.5}
                />
              </g>
              {plot.ripe && <ellipse cx={cx} cy={cy} rx={TW * 0.42} ry={TH * 0.42} fill="#fff6b0" opacity=".55" className="garden-yard-glow" />}
              {plot.species && (
                <svg x={cx - size / 2} y={cy - size * 0.88} width={size} height={size} overflow="visible">
                  <PlantArt species={plot.species} progress={plot.progress} />
                </svg>
              )}
            </g>
          );
        })}
        {avatar?.on && (
          <g className="garden-yard-avatar" style={{ transform: `translate(${ax - AVATAR_W / 2}px, ${ay - AVATAR_H + 4}px)` }}>
            <AvatarFigure look={avatar.look} pose="stand" face={faceFor("stand", mood)} blink />
          </g>
        )}
        {rain && (
          <g className="garden-yard-rain" aria-hidden="true">
            {Array.from({ length: 26 }, (_, k) => (
              <line key={k} x1={(k * 37) % W} y1={(k * 53) % (H - 40)} x2={((k * 37) % W) - 4} y2={((k * 53) % (H - 40)) + 12} stroke="#e8f6ff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
            ))}
          </g>
        )}
      </svg>
      {editing && Array.from({ length: YARD_SLOTS }, (_, i) => {
        const c = g.slot(i);
        const [x, y] = P(c.u, c.v);
        const item = slots[i] ? YARD_BY_ID.get(slots[i]!) : undefined;
        return (
          <button
            key={`slot${i}`}
            type="button"
            onClick={() => onSlot?.(i)}
            aria-label={`마당 꾸밈 자리 ${i + 1}${item ? ` · ${item.label}` : " · 비어 있음"}`}
            className={`garden-yard-slot ${item ? "is-full" : ""}`}
            style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
          >
            {item ? "✎" : "＋"}
          </button>
        );
      })}
      {!editing && plots.map((plot, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPlot(i)}
          aria-label={!plot.plant || !plot.species ? `${i + 1}번 밭 · 씨앗 심기` : `${plot.species.title} ${plot.ripe ? "수확하기" : `${formatLeft(plot.left)} 남음`}`}
          aria-pressed={selected === i}
          className={`garden-yard-plot ${plot.ripe ? "is-ripe" : ""}`}
          style={pct(box(i))}
        >
          <span className="garden-yard-tag">
            {!plot.plant || !plot.species ? "＋ 심기" : plot.ripe ? "수확!" : formatLeft(plot.left)}
          </span>
          {harvested[i] && <span key={harvested[i]} className="garden-harvest-float" aria-hidden="true">✦ 수확!</span>}
        </button>
      ))}
    </div>
  );
}
