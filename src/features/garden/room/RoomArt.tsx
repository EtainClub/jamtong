"use client";

import { useId } from "react";

import { RAID_KINDS } from "../rules";
import type { Species } from "../types";
import { FURNITURE_BY_ID } from "./catalog";
import { parseSlot, placement, roomWidth, slotsOf, type Placed, type RoomData, type Shown } from "./rules";
import { CELL, HEIGHT, ROWS, ROOM_COLORS as C, FurnitureArt, RoomSvg, ShownArt, Surface } from "./RoomSvg";
export { weatherAt, type Weather } from "./RoomSvg";

/**
 * 방 그림 — 정면에서 본 방(뒷벽 + 바닥). 설계는 docs/garden-miniroom.md §3.3·§4.1.
 *
 * ★ 도트 느낌은 방 그림에만: shape-rendering crispEdges, 굵은 외곽선, 정해 둔 색 몇 가지.
 *   글자는 그림 밖 HTML로 또렷하게 둔다.
 * ★ 칸 누르기는 그림 위에 겹친 진짜 <button>이 맡는다. SVG 조각에 포커스를 주는 것보다
 *   키보드·화면 읽기 프로그램이 다루기 쉽고, 누름 자리를 44px 위로 지키기 쉽다.
 * ★ 화분 그림은 품종표의 PlantArt를 그대로 쓴다. 품종 220여 개의 그림을 따로 그리지 않는다.
 *   등급은 화분 크기, 변이는 화분 빛깔로.
 */

const ROW_NAME = { w: "벽", b: "바닥 뒷줄", f: "바닥 앞줄" } as const;
const MIN_CELL_PX = 46;

export function slotLabel(at: string): string {
  const p = parseSlot(at);
  return p ? `${ROW_NAME[p.row]} ${p.i + 1}번 칸` : at;
}

/** 놓인 것의 이름. 화면 읽기와 시트 제목에 쓴다. */
export function itemName(it: string, room: RoomData, byId: ReadonlyMap<string, Species>): string {
  const f = FURNITURE_BY_ID.get(it);
  if (f) return f.label;
  const s = room.shown.find((x) => x.id === it);
  const title = s?.species ? byId.get(s.species)?.title : undefined;
  if (!s) return "물건";
  if (s.kind === "frame") return `쪽지 액자${title ? ` · ${title}` : ""}`;
  if (s.kind === "tree") return `나무${title ? ` · ${title}` : ""}`;
  if (s.kind === "trophy") return `박제 · ${RAID_KINDS.find((k) => k.id === s.species)?.name ?? "악초"}`;
  return `화분${title ? ` · ${title}` : ""}`;
}

interface SceneProps {
  room: RoomData;
  byId: ReadonlyMap<string, Species>;
  now: number;
  /** 그림 전체의 이름(화면 읽기). */
  label: string;
  /** 눌리는 놓인 것. 없으면 그 물건은 그림일 뿐이다. */
  onItem?: (p: Placed) => void;
  isItemActive?: (p: Placed) => boolean;
  /** 꾸미기: 빈 칸 누르기. 있으면 모든 빈 칸이 단추가 된다. */
  onSlot?: (at: string) => void;
  /** 꾸미기: 지금 놓을 수 있는 칸. */
  open?: ReadonlySet<string>;
  /** 꾸미기: 골라 둔 놓인 것의 칸. */
  selected?: string | null;
  /** 미리 보기로 얹은 것(상점의 "방에 놓아 보기"). 흐리게 그린다. */
  ghost?: Placed | null;
}

export function RoomScene({ room, byId, now, label, onItem, isItemActive, onSlot, open, selected, ghost }: SceneProps) {
  const uid = useId().replace(/:/g, "");
  const width = roomWidth(room.size);
  const W = width * CELL;
  const items = [...room.placed, ...(ghost ? [ghost] : [])]
    .map((p) => ({ p, spec: placement(p.it, room.shown), slot: parseSlot(p.at) }))
    .filter((x): x is { p: Placed; spec: NonNullable<typeof x.spec>; slot: NonNullable<typeof x.slot> } => Boolean(x.spec && x.slot))
    .sort((a, b) => "wbf".indexOf(a.slot.row) - "wbf".indexOf(b.slot.row));
  const busy = new Set(room.placed.flatMap((p) => slotsOf(p.at, placement(p.it, room.shown)?.size ?? 1, width) ?? []));
  const box = (row: "w" | "b" | "f", i: number, size: number) => ({
    left: `${((i * CELL) / W) * 100}%`,
    top: `${(ROWS[row].y / HEIGHT) * 100}%`,
    width: `${((size * CELL) / W) * 100}%`,
    height: `${(ROWS[row].h / HEIGHT) * 100}%`,
  });

  return (
    <div className="garden-room-scroll">
      <div className="garden-room" style={{ minWidth: width * MIN_CELL_PX, aspectRatio: `${W} / ${HEIGHT}` }}>
        <RoomSvg room={room} byId={byId} now={now} label={label} uid={uid} ghost={ghost} selected={selected} />

        {onSlot &&
          (["w", "b", "f"] as const).flatMap((row) =>
            Array.from({ length: width }, (_, i) => {
              const at = `${row}${i}`;
              if (busy.has(at)) return null;
              const can = open?.has(at) ?? false;
              return (
                <button
                  key={at}
                  type="button"
                  disabled={!can}
                  onClick={() => onSlot(at)}
                  aria-label={`${slotLabel(at)}에 놓기`}
                  className={`garden-room-slot ${can ? "is-open" : ""}`}
                  style={box(row, i, 1)}
                />
              );
            }),
          )}

        {onItem &&
          items
            .filter(({ p }) => p !== ghost && (isItemActive ? isItemActive(p) : true))
            .map(({ p, spec, slot }) => (
              <button
                key={`hit-${p.at}`}
                type="button"
                onClick={() => onItem(p)}
                aria-pressed={selected !== undefined ? selected === p.at : undefined}
                aria-label={`${itemName(p.it, room, byId)} · ${slotLabel(p.at)}`}
                className={`garden-room-item ${selected === p.at ? "is-picked" : ""}`}
                style={box(slot.row, slot.i, spec.size)}
              />
            ))}
      </div>
    </div>
  );
}

/** 상점 카드·보관함에 그리는 물건 하나. */
export function FurnitureIcon({ id, size = 64 }: { id: string; size?: number }) {
  const f = FURNITURE_BY_ID.get(id);
  const uid = useId().replace(/:/g, "");
  if (!f) return null;
  if (f.kind === "wallpaper" || f.kind === "flooring") {
    return (
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className="garden-room-icon">
        <defs><Surface id={`${uid}-s`} art={f.art} /></defs>
        <rect x="2" y="2" width="36" height="36" fill={`url(#${uid}-s)`} stroke={C.ink} strokeWidth="2" shapeRendering="crispEdges" />
      </svg>
    );
  }
  const w = f.size * CELL;
  return (
    <svg viewBox={`-2 -2 ${w + 4} 50`} width={size * (f.size === 2 ? 1.6 : 1)} height={size} aria-hidden="true" className="garden-room-icon">
      <FurnitureArt art={f.art} w={w} h={46} weather="day" />
    </svg>
  );
}

/** 전시품 하나(보관함 칸). */
export function ShownIcon({ shown, byId, size = 56 }: { shown: Shown; byId: ReadonlyMap<string, Species>; size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="-2 -14 44 62" width={size} height={size} aria-hidden="true" className="garden-room-icon">
      <defs>
        <linearGradient id={`${uid}-rb`} x1="0" x2="1">
          {[C.red, C.orange, C.yellow, C.green, C.skyD, C.purple].map((c, i) => <stop key={c} offset={i / 5} stopColor={c} />)}
        </linearGradient>
      </defs>
      <ShownArt shown={shown} byId={byId} w={40} h={46} rainbow={`url(#${uid}-rb)`} />
    </svg>
  );
}
