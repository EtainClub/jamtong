import type { ReactNode } from "react";

import type { Species } from "../types";
import { AVATAR_H, AVATAR_W, AvatarFigure } from "../avatar/AvatarArt";
import { avatarAtOk, avatarPoint, faceFor, furnitureAt, poseAt } from "../avatar/rules";
import { FURNITURE_BY_ID } from "./catalog";
import type { IsoSpec } from "./iso";
import isoArt from "./isoArt.json";
import { floorReach, footprint, isoSpecOf, isWallPos, WALL_H, type FloorPos, type Rect, type WallPos } from "./isoPlace";
import { keyboardKeys, roomWidth, type Placed, type RoomData } from "./rules";
import { activityOf } from "./activities";
import { KeyFace } from "./KeyArt";
import { KEYBOARD_ID } from "./keyboard";
import { ART_H, CELL, ItemArt, ROOM_COLORS as C, Surface, weatherAt, type AvatarLive, type Weather } from "./RoomSvg";

/**
 * 아이소 방 — 2:1 아이소메트릭, 벽 두 면(왼쪽 L·오른쪽 R)과 바닥(docs/garden-miniroom-iso.md §4).
 * 내 방·손님 방·꾸미기·상점 미리보기·공유 카드가 같은 그림을 쓴다.
 *
 * ★ 타일 40px(가로 40 × 세로 20). 화면 좌표: x = ox + (u − v) × 20, y = oy + (u + v) × 10 − z. (0,0)이 안쪽 꼭짓점.
 * ★ 그림: 아이소 그림(public/images/room-iso)이 있는 물건은 그것을, 없는 물건은 지금 정면 그림(ItemArt)을 꼬마와 같은 배율로
 *   세워서 그린다. 벽걸이 정면 그림은 벽면을 따라 기울인다. 그림을 바꿔 넣어도 자리·장부는 그대로다.
 * ★ 앞뒤 순서: 바닥 상자가 어느 축으로든 떨어져 있으면 그것으로, 겹치면 높이로, 그래도 같으면 중심(u + v)으로.
 *   벽 → 깔개 → 벽걸이 → (가구·올려 두는 것·꼬마) 차례.
 * ★ 공유 카드는 SVG를 이미지로 그리므로 CSS가 없다 — 움직임은 class로만 걸고, 자리는 속성 transform으로 둔다.
 */

export const TILE_W = 40;
export const TILE_H = 20;
/** 틀 위 변과 안쪽 꼭짓점 벽 꼭대기 사이. */
const TOP = 6;
const SLOPE = TILE_H / TILE_W;

export interface IsoGeom {
  n: number;
  W: number;
  H: number;
  ox: number;
  oy: number;
  P: (u: number, v: number, z?: number) => [number, number];
  /** 화면 → 바닥(z=0) 타일 좌표. */
  toUV: (x: number, y: number) => { u: number; v: number };
}

/**
 * 방 틀 — 싸이월드 미니룸처럼(2026-11-22). 왼쪽·오른쪽 벽의 끝이 틀의 양 끝, 안쪽 꼭짓점 벽 꼭대기가 틀 위,
 * 틀 아래 변이 방 앞 꼭짓점을 자른다(isoPlace.ts의 floorReach). 벽은 틀 위까지, 바닥은 틀 아래 끝까지 채워 빈 모서리가 없다.
 * 처음에는 마름모 방 전체를 그려서 위아래 모서리가 비고 방이 작아 보였다.
 */
export function isoGeom(size: number): IsoGeom {
  const n = roomWidth(size);
  const ox = (n * TILE_W) / 2;
  const oy = TOP + WALL_H;
  return {
    n,
    W: n * TILE_W,
    H: oy + (floorReach(size) * TILE_H) / 2,
    ox,
    oy,
    P: (u, v, z = 0) => [ox + ((u - v) * TILE_W) / 2, oy + ((u + v) * TILE_H) / 2 - z],
    toUV: (x, y) => {
      const a = (x - ox) / (TILE_W / 2);
      const b = (y - oy) / (TILE_H / 2);
      return { u: (a + b) / 2, v: (b - a) / 2 };
    },
  };
}

/**
 * 아이소 그림이 있는 물건 — scripts/room-iso-gen.ts가 다 그린 가구만 적는다. back=뒤가 먼 쪽(방향 0·1), front=뒤가 가까운 쪽(2·3),
 * wall=왼쪽 벽 기준(오른쪽 벽은 좌우 반전). 없는 물건은 정면 그림을 세워서 그린다.
 */
const ISO_ART: Readonly<Record<string, { back: string; front: string } | { wall: string }>> = isoArt;
export const isoArtHref = (name: string) => `/images/room-iso/${name}.png`;

const pts = (list: Array<[number, number]>) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** 받침 위면 받침의 올림면 높이. */
function baseZ(room: Pick<RoomData, "placed" | "shown">, pos: FloorPos): number {
  if (pos.on === undefined) return 0;
  const base = room.placed[pos.on];
  return (base && isoSpecOf(base.it, room.shown)?.surface) ?? 0;
}

/** 정면 그림의 칸 수(가구표 size). 전시품은 1. */
const artCells = (it: string) => FURNITURE_BY_ID.get(it)?.size ?? 1;

/** 물건이 차지하는 화면 상자 — 그림과 누름 자리가 같은 상자를 쓴다. */
export function itemBox(room: Pick<RoomData, "placed" | "shown" | "size">, p: Placed): { x: number; y: number; w: number; h: number } | null {
  const spec = isoSpecOf(p.it, room.shown);
  if (!spec) return null;
  const g = isoGeom(room.size);
  const art = ISO_ART[p.it];
  if (isWallPos(p.pos)) {
    const q = wallQuad(g, p.pos, spec.w, art && "wall" in art ? spec.h : ART_H);
    const xs = q.map((c) => c[0]);
    const ys = q.map((c) => c[1]);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  }
  const f = footprint(spec, p.pos);
  const z = baseZ(room, p.pos);
  if ((art && !("wall" in art)) || p.it === KEYBOARD_ID) {
    const w = ((f.w + f.d) * TILE_W) / 2;
    const h = ((f.w + f.d) * TILE_H) / 2 + spec.h;
    return { x: g.P(f.u, f.v + f.d, z)[0], y: g.P(f.u + f.w, f.v + f.d, z)[1] - h, w, h };
  }
  if (spec.layer === "rug") {
    const xs = [g.P(f.u, f.v + f.d)[0], g.P(f.u + f.w, f.v)[0]];
    return { x: xs[0], y: g.P(f.u, f.v)[1], w: xs[1] - xs[0], h: g.P(f.u + f.w, f.v + f.d)[1] - g.P(f.u, f.v)[1] };
  }
  // 세운 정면 그림 — 바닥 상자 한가운데와 앞 꼭짓점 사이에 아래 변을 둔다.
  const w = artCells(p.it) * CELL;
  const [cx, cy] = g.P(f.u + f.w / 2, f.v + f.d / 2, z);
  const bottom = cy + ((f.w + f.d) * TILE_H) / 4;
  return { x: cx - w / 2, y: bottom - ART_H, w, h: ART_H };
}

/** 벽면 위의 사각형(위 왼쪽부터 시계 방향). 오른쪽 벽은 a가 커질수록 오른쪽 아래로, 왼쪽 벽은 왼쪽 아래로. */
function wallQuad(g: IsoGeom, pos: WallPos, w: number, h: number): Array<[number, number]> {
  const at = (a: number, z: number) => (pos.wall === "R" ? g.P(a, 0, z) : g.P(0, a, z));
  const a0 = pos.a / 2;
  const [l, r] = pos.wall === "R" ? [a0, a0 + w] : [a0 + w, a0];
  return [at(l, pos.z + h), at(r, pos.z + h), at(r, pos.z), at(l, pos.z)];
}

interface Node extends Rect {
  z: number;
  top: number;
  order: number;
  key: string;
  draw: ReactNode;
}

function before(a: Node, b: Node): boolean {
  const e = 1e-6;
  if (a.u + a.w <= b.u + e) return true;
  if (b.u + b.w <= a.u + e) return false;
  if (a.v + a.d <= b.v + e) return true;
  if (b.v + b.d <= a.v + e) return false;
  if (a.top <= b.z + e) return true;
  if (b.top <= a.z + e) return false;
  const ca = a.u + a.v + (a.w + a.d) / 2;
  const cb = b.u + b.v + (b.w + b.d) / 2;
  return Math.abs(ca - cb) > e ? ca < cb : a.order < b.order;
}

/** 앞뒤 순서. 물건이 80개 안팎이라 매번 다 견준다. 순환이 생기면 중심이 먼 것부터. */
function depthSort(nodes: Node[]): Node[] {
  const left = nodes.slice();
  const out: Node[] = [];
  while (left.length) {
    let pick = left.findIndex((x) => !left.some((y) => y !== x && before(y, x)));
    if (pick < 0) {
      pick = 0;
      left.forEach((x, i) => {
        const c = x.u + x.v + (x.w + x.d) / 2;
        const best = left[pick].u + left[pick].v + (left[pick].w + left[pick].d) / 2;
        if (c < best) pick = i;
      });
    }
    out.push(left.splice(pick, 1)[0]);
  }
  return out;
}

export function IsoRoomSvg({
  room,
  byId,
  now,
  label,
  uid = "room",
  ghost,
  selected,
  bad,
  bounds,
  pulses,
  avatar,
}: {
  room: RoomData;
  byId: ReadonlyMap<string, Species>;
  now: number;
  label: string;
  uid?: string;
  /** 미리 보기로 얹은 것(상점). 흐리게. */
  ghost?: Placed | null;
  /** 꾸미기: 고른 물건의 순번. 바닥 상자(벽걸이는 벽 사각형)에 점선. */
  selected?: number | null;
  /** 꾸미기: 놓을 수 없는 자리로 끄는 중인 물건의 순번. 빨갛게. */
  bad?: number | null;
  /** 꾸미기: 놓을 수 있는 바닥의 테두리를 점선으로. */
  bounds?: boolean;
  /** 누름 반응(activities) — 순번마다 몇 번째인지. */
  pulses?: Readonly<Record<number, number>>;
  avatar?: AvatarLive | null;
}) {
  const g = isoGeom(room.size);
  const { n, W, H } = g;
  const weather = weatherAt(now);
  const list: Placed[] = ghost ? [...room.placed, ghost] : room.placed;
  const ghostIndex = ghost ? room.placed.length : -1;
  const drawn = { ...room, placed: list };

  const art = (p: Placed, i: number): ReactNode => {
    const spec = isoSpecOf(p.it, room.shown);
    if (!spec) return null;
    const body = itemArt(drawn, p, spec, g, byId, weather, `url(#${uid}-rainbow)`, keyboardKeys(room, p.kb));
    const pulse = pulses?.[i];
    const motion = pulse && i !== ghostIndex ? `garden-room-react garden-room-react-${activityOf(p.it)?.motion}` : undefined;
    return (
      <g key={`${i}-${p.it}`} opacity={i === ghostIndex ? 0.55 : 1} className={i === bad ? "garden-room-bad" : undefined}>
        <g key={pulse ?? 0} className={motion}>{body}</g>
      </g>
    );
  };

  const walls: ReactNode[] = [];
  const rugs: ReactNode[] = [];
  const nodes: Node[] = [];
  list.forEach((p, i) => {
    const spec = isoSpecOf(p.it, room.shown);
    if (!spec) return;
    if (isWallPos(p.pos)) return walls.push(art(p, i));
    if (spec.layer === "rug") return rugs.push(art(p, i));
    const f = footprint(spec, p.pos);
    const z = baseZ(drawn, p.pos);
    nodes.push({ ...f, z, top: z + spec.h, order: p.pos.on !== undefined ? 1 : 0, key: `${i}`, draw: art(p, i) });
  });

  const av = room.avatar?.on && avatarAtOk(avatar?.at ?? room.avatar.at, n) ? room.avatar : null;
  if (av) {
    const at = avatar?.at ?? av.at;
    const spot = avatarSpot(room, at);
    nodes.push({ ...spot.area, z: spot.z, top: spot.z + AVATAR_H, order: 9, key: "avatar", draw: <IsoAvatar key="avatar" room={room} at={at} live={avatar} /> });
  }

  const sel = selected !== null && selected !== undefined ? list[selected] : undefined;
  const selSpec = sel && isoSpecOf(sel.it, room.shown);
  let outline: Array<[number, number]> | null = null;
  if (sel && selSpec) {
    if (isWallPos(sel.pos)) outline = wallQuad(g, sel.pos, selSpec.w, selSpec.h);
    else {
      const f = footprint(selSpec, sel.pos);
      const z = baseZ(drawn, sel.pos);
      outline = [g.P(f.u, f.v, z), g.P(f.u + f.w, f.v, z), g.P(f.u + f.w, f.v + f.d, z), g.P(f.u, f.v + f.d, z)];
    }
  }
  const P = g.P;
  const reach = floorReach(room.size);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="garden-room-art">
      <defs>
        {/* 무늬를 면에 눕힌다 — 오른쪽 벽은 오른쪽 아래로, 왼쪽 벽은 왼쪽 아래로 기울고, 바닥은 마름모로. */}
        <Surface id={`${uid}-wall-r`} art={room.wall} transform={`matrix(1 ${SLOPE} 0 1 ${g.ox} ${g.oy - WALL_H})`} />
        <Surface id={`${uid}-wall-l`} art={room.wall} transform={`matrix(-1 ${SLOPE} 0 1 ${g.ox} ${g.oy - WALL_H})`} />
        <Surface id={`${uid}-floor`} art={room.floor} transform={`matrix(0.7 0.35 -0.7 0.35 ${g.ox} ${g.oy})`} />
        <linearGradient id={`${uid}-rainbow`} x1="0" x2="1">
          {[C.red, C.orange, C.yellow, C.green, C.skyD, C.purple].map((c, i) => <stop key={c} offset={i / 5} stopColor={c} />)}
        </linearGradient>
      </defs>
      <g stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round">
        {/* 벽은 틀 위 변까지, 바닥은 틀 아래 변까지 — 방이 틀을 가득 채운다. */}
        <polygon points={pts([P(0, 0), P(n, 0), [W, 0], [g.ox, 0]])} fill={`url(#${uid}-wall-r)`} />
        <polygon points={pts([P(0, n), P(0, 0), [g.ox, 0], [0, 0]])} fill={`url(#${uid}-wall-l)`} />
        <polygon points={pts([P(0, n), P(0, 0), [g.ox, 0], [0, 0]])} fill="#000" fillOpacity=".06" />
        <polygon points={pts([P(0, 0), P(n, 0), [W, H], [0, H], P(0, n)])} fill={`url(#${uid}-floor)`} />
        <polygon points={pts([P(0, 0), P(n, 0), P(n, 0, 8), P(0, 0, 8)])} fill={C.woodD} />
        <polygon points={pts([P(0, 0), P(0, n), P(0, n, 8), P(0, 0, 8)])} fill={C.woodD} />
      </g>
      {bounds && (
        // 꾸미기: 놓을 수 있는 바닥 — 방 안이고 틀 아래로 잘리지 않는 곳.
        <polygon points={pts([P(0, 0), P(n, 0), P(n, reach - n), P(reach - n, n), P(0, n)])} fill="none" stroke={C.ink} strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="6 4" pointerEvents="none" />
      )}
      {walls}
      {rugs}
      {depthSort(nodes).map((x) => x.draw)}
      {outline && (
        <polygon points={pts(outline)} fill={C.orange} fillOpacity=".16" stroke={bad === selected ? C.red : C.orange} strokeWidth="2" strokeDasharray="5 3" pointerEvents="none" />
      )}
    </svg>
  );
}

/** 물건 하나의 그림. */
function itemArt(
  room: Pick<RoomData, "placed" | "shown" | "size">,
  p: Placed,
  spec: IsoSpec,
  g: IsoGeom,
  byId: ReadonlyMap<string, Species>,
  weather: Weather,
  rainbow: string,
  keys: ReturnType<typeof keyboardKeys>,
): ReactNode {
  const iso = ISO_ART[p.it];
  const box = itemBox(room, p);
  if (!box) return null;
  if (p.it === KEYBOARD_ID && !isWallPos(p.pos)) return <IsoKeyboard g={g} spec={spec} pos={p.pos} z={baseZ(room, p.pos)} keys={keys} />;
  if (iso) {
    const name = "wall" in iso ? iso.wall : p.pos && !isWallPos(p.pos) && p.pos.dir >= 2 ? iso.front : iso.back;
    // 그림은 방향 0(back)·왼쪽 벽 기준. 방향 1·3과 오른쪽 벽은 좌우 반전.
    const mirror = isWallPos(p.pos) ? p.pos.wall === "R" : p.pos.dir % 2 === 1;
    return (
      <image
        href={isoArtHref(name)}
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        preserveAspectRatio="xMidYMax meet"
        transform={mirror ? `translate(${2 * box.x + box.w} 0) scale(-1 1)` : undefined}
      />
    );
  }
  const w0 = artCells(p.it) * CELL;
  const front = <ItemArt it={p.it} shown={room.shown} keys={keys} byId={byId} w={w0} h={ART_H} weather={weather} rainbow={rainbow} />;
  if (isWallPos(p.pos)) {
    // 벽걸이 정면 그림을 벽면에 붙인다 — 가로는 벽을 따라 반으로 줄고(아이소 벽의 짧아짐), 기울기는 벽과 같다.
    const [x, y] = wallQuad(g, p.pos, spec.w, ART_H)[0];
    const slope = p.pos.wall === "R" ? SLOPE / 2 : -SLOPE / 2;
    return <g transform={`matrix(0.5 ${slope} 0 1 ${x.toFixed(1)} ${y.toFixed(1)})`}>{front}</g>;
  }
  if (spec.layer === "rug") {
    // 깔개 정면 그림을 바닥 마름모에 눕힌다.
    const f = footprint(spec, p.pos);
    const [x, y] = g.P(f.u, f.v);
    const sx = (f.w * TILE_W) / 2 / w0;
    const sy = (f.d * TILE_W) / 2 / ART_H;
    return <g transform={`matrix(${sx} ${sx * SLOPE} ${-sy} ${sy * SLOPE} ${x.toFixed(1)} ${y.toFixed(1)})`}>{front}</g>;
  }
  return <g transform={`translate(${box.x.toFixed(1)} ${box.y.toFixed(1)})`}>{front}</g>;
}

/** 면 색을 어둡게(아이소 상자의 왼쪽·오른쪽 면). */
function shade(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(c * (1 - t));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

/** 아이소 상자 하나 — 윗면 원색, 왼쪽 면 12%, 오른쪽 면 25% 어둡게(그림 가이드 §4.2). */
function IsoBox({ g, r, z, h, color }: { g: IsoGeom; r: Rect; z: number; h: number; color: string }) {
  const { u, v, w, d } = r;
  const P = g.P;
  return (
    <g stroke={C.ink} strokeWidth="1" strokeLinejoin="round">
      <polygon points={pts([P(u, v + d, z), P(u + w, v + d, z), P(u + w, v + d, z + h), P(u, v + d, z + h)])} fill={shade(color, 0.12)} />
      <polygon points={pts([P(u + w, v, z), P(u + w, v + d, z), P(u + w, v + d, z + h), P(u + w, v, z + h)])} fill={shade(color, 0.25)} />
      <polygon points={pts([P(u, v, z + h), P(u + w, v, z + h), P(u + w, v + d, z + h), P(u, v + d, z + h)])} fill={color} />
    </g>
  );
}

/**
 * 내 키보드 — 받침 다리·몸통·키 넷을 아이소 상자로 코드가 그린다. 키마다 주인이 그린 그림(12×12)을 키의 앞면에 붙인다.
 * 그림 파일로 만들지 않는 까닭: 키 그림이 방마다 다르다. 방향 0·1은 앞면(그림)이 보이고, 2·3(뒤돌림)은 키의 뒷면만 보인다.
 * 그림은 뒤집지 않는다 — 방향 1도 왼쪽 키가 첫 키다.
 */
function IsoKeyboard({ g, spec, pos, z, keys }: { g: IsoGeom; spec: IsoSpec; pos: FloorPos; z: number; keys: ReturnType<typeof keyboardKeys> }) {
  const f = footprint(spec, pos);
  const long = pos.dir % 2 === 0;
  const facing = pos.dir < 2;
  // 몸통의 긴 축 a(0..2)와 깊이 b(0..1, 1이 앞)를 바닥 상자로. 방향 0은 a = u·앞 = v+, 방향 1은 a가 커질수록 v가 줄고 앞 = u+.
  const rect = (a0: number, a1: number, b0: number, b1: number): Rect => {
    const [c0, c1] = facing ? [b0, b1] : [1 - b1, 1 - b0];
    return long
      ? { u: f.u + a0 * (f.w / 2), v: f.v + c0 * f.d, w: (a1 - a0) * (f.w / 2), d: (c1 - c0) * f.d }
      : { u: f.u + c0 * f.w, v: f.v + f.d - a1 * (f.d / 2), w: (c1 - c0) * f.w, d: (a1 - a0) * (f.d / 2) };
  };
  const KEY = { b0: 0.42, b1: 0.72, z0: 14, z1: 32 };
  const caps = keys.slice(0, 4).map((k, i) => ({ k, r: rect(0.06 + i * 0.48, 0.06 + i * 0.48 + 0.42, KEY.b0, KEY.b1) }));
  caps.sort((a, b) => a.r.u + a.r.v - (b.r.u + b.r.v));
  return (
    <g>
      <IsoBox g={g} r={rect(0.12, 0.3, 0.35, 0.65)} z={z} h={8} color={C.woodD} />
      <IsoBox g={g} r={rect(1.7, 1.88, 0.35, 0.65)} z={z} h={8} color={C.woodD} />
      <IsoBox g={g} r={rect(0, 2, 0.15, 0.85)} z={z + 8} h={6} color={C.greyD} />
      {caps.map(({ k, r }, i) => {
        // 앞면(방향 0: v = v+d 면, 방향 1: u = u+w 면)의 왼쪽 위 — 그림 12칸이 키 너비를 따라 기울어 붙는다.
        const along = long ? r.w : r.d;
        const s = (along * TILE_W) / 2 / 12;
        const [x, y] = long ? g.P(r.u, r.v + r.d, z + KEY.z1) : g.P(r.u + r.w, r.v + r.d, z + KEY.z1);
        return (
          <g key={i}>
            <IsoBox g={g} r={r} z={z + KEY.z0} h={KEY.z1 - KEY.z0} color={C.cream} />
            {facing && (
              <g transform={`matrix(${s.toFixed(3)} ${(long ? s / 2 : -s / 2).toFixed(3)} 0 ${((KEY.z1 - KEY.z0 - 2) / 12).toFixed(3)} ${x.toFixed(1)} ${(y + 1).toFixed(1)})`}>
                <KeyFace face={k.face} x={0} y={0} size={12} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

/** 꼬마 — 칸 자리의 바닥(앉거나 누우면 그 높이)에 발을 딛는다. */
function IsoAvatar({ room, at, live }: { room: RoomData; at: string; live?: AvatarLive | null }) {
  const av = room.avatar!;
  const g = isoGeom(room.size);
  const spot = avatarSpot(room, at);
  const [x, y] = g.P(spot.u, spot.v, spot.z);
  const seated = poseAt(room, at);
  const pose = live?.act === "wave" && seated === "stand" ? "wave" : live?.walking ? "walk" : seated;
  const motion = live?.walking ? "garden-avatar-walk" : live?.act ? `garden-avatar-${live.act}` : undefined;
  const tx = x - AVATAR_W / 2;
  const ty = y - AVATAR_H + 4;
  return (
    // 움직이는 방(live)은 CSS transform이라 칸 사이를 미끄러진다. 공유 카드는 속성 transform(CSS가 없다).
    <g
      transform={live ? undefined : `translate(${tx} ${ty})`}
      style={live ? { transform: `translate(${tx}px, ${ty}px)` } : undefined}
      className="garden-avatar"
    >
      <g key={live?.nonce ?? 0} className={motion}>
        <AvatarFigure look={av.look} pose={pose} face={faceFor(pose, room.mood)} blink />
      </g>
    </g>
  );
}

/** 꼬마의 화면 자리(발 가운데) — 누름 자리·말풍선. */
export function avatarScreen(room: RoomData, at: string): { x: number; y: number } {
  const spot = avatarSpot(room, at);
  const [x, y] = isoGeom(room.size).P(spot.u, spot.v, spot.z);
  return { x, y: y + 4 };
}

/**
 * 꼬마를 그릴 자리(발 가운데 u·v, 높이 z)와 앞뒤 순서를 셈할 바닥 상자.
 * 앉거나 누우면(의자·소파·침대…) 그 가구 한가운데의 앉는 높이에, 연주하면(피아노·키보드) 건반 쪽 바로 앞 바닥에 선다.
 * 그 밖에는 제 타일 한가운데.
 */
export function avatarSpot(room: RoomData, at: string): { u: number; v: number; z: number; area: Rect } {
  const pt = avatarPoint(at, room.size);
  const own = { u: pt.u, v: pt.v, z: 0, area: { u: pt.u - 0.25, v: pt.v - 0.25, w: 0.5, d: 0.5 } };
  const seat = furnitureAt(room, at);
  const sp = seat !== undefined ? room.placed[seat] : undefined;
  const spec = sp && isoSpecOf(sp.it, room.shown);
  if (!sp || !spec || isWallPos(sp.pos) || spec.seatZ === undefined) return own;
  const f = footprint(spec, sp.pos);
  const cu = f.u + f.w / 2;
  const cv = f.v + f.d / 2;
  if (spec.seatZ > 0) return { u: cu, v: cv, z: spec.seatZ, area: f };
  // 연주 — 뒤(방향 0: v가 작은 쪽)의 반대편 앞.
  const n = roomWidth(room.size);
  const inside = (t: number) => Math.max(0.25, Math.min(n - 0.25, t));
  const raw = [{ u: cu, v: f.v + f.d + 0.25 }, { u: f.u + f.w + 0.25, v: cv }, { u: cu, v: f.v - 0.25 }, { u: f.u - 0.25, v: cv }][sp.pos.dir];
  const front = { u: inside(raw.u), v: inside(raw.v) };
  return { ...front, z: 0, area: { u: front.u - 0.25, v: front.v - 0.25, w: 0.5, d: 0.5 } };
}

