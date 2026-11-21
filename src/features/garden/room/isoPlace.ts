import { ROOM_SIZES } from "./catalog";
import { ISO, SHOWN_ISO, type IsoSpec } from "./iso";
import type { Shown } from "./rules";

/**
 * 아이소 방의 자리 — 칸 대신 좌표(docs/garden-miniroom-iso.md §8). 2단계: 순수 함수와 시험만 둔다.
 * 3단계(2026-11-21)부터 장부(RoomData.placed)가 이 자리를 쓴다. 옛 칸 장부는 normalizeRoom이 isoFromSlots로 한 번 옮긴다.
 *
 * ★ 좌표는 반 타일 단위 정수다(x = u × 2). 바닥은 방향(dir)과 받침(on)을, 벽은 벽(L·R)·가로(a)·높이(z, px)를 갖는다.
 * ★ on은 같은 목록 안 받침의 순번이고, 받침은 늘 올린 것보다 앞에 있다(on < 자기 순번). 공개 문서에 실을 때는 실리는 목록의 순번으로 다시 매긴다.
 * ★ 겹침: 가구끼리, 가구와 바닥의 올려 두는 것끼리 막는다. 깔개는 무엇과도, 올려 두는 것끼리는 겹친다.
 *   벽걸이는 같은 벽의 벽걸이끼리만 막는다.
 * ★ rules.ts를 런타임에 import하지 않는다(3단계에서 rules.ts가 이 파일을 쓴다 — 순환을 만들지 않는다).
 */

/** 벽 높이(px, 타일 40). */
export const WALL_H = 120;

export type Dir = 0 | 1 | 2 | 3;
export interface FloorPos { x: number; y: number; dir: Dir; on?: number }
export interface WallPos { wall: "L" | "R"; a: number; z: number }
export type IsoPos = FloorPos | WallPos;

export interface IsoItem {
  it: string;
  pos: IsoPos;
  /** 키보드·피아노 개체 번호. 옛 장부의 kb를 그대로 옮긴다. */
  kb?: number;
}

export interface Rect { u: number; v: number; w: number; d: number }

/** 옛 칸 장부의 한 줄. */
export interface SlotPlaced { at: string; it: string; kb?: number }

export const isWallPos = (p: IsoPos): p is WallPos => "wall" in p;

/** 방 한 변의 타일 수 — 6·8·10. 지금 칸 방의 너비와 같은 수다. */
export function floorTiles(size: number): number {
  return (ROOM_SIZES[size] ?? ROOM_SIZES[0]).width;
}

/** 물건의 층·크기. 전시품은 종류로, 가구는 id로. 모르면 null. */
export function isoSpecOf(it: string, shown: readonly Shown[]): IsoSpec | null {
  if (it.includes(":")) {
    const s = shown.find((x) => x.id === it);
    return s ? SHOWN_ISO[s.kind] : null;
  }
  return ISO[it] ?? null;
}

/** 바닥 상자(타일). 방향 1·3은 w와 d를 바꾼다. */
export function footprint(spec: IsoSpec, pos: FloorPos): Rect {
  const odd = pos.dir % 2 === 1;
  return { u: pos.x / 2, v: pos.y / 2, w: odd ? spec.d : spec.w, d: odd ? spec.w : spec.d };
}

const overlap = (a: Rect, b: Rect) => a.u < b.u + b.w && b.u < a.u + a.w && a.v < b.v + b.d && b.v < a.v + a.d;
const within = (inner: Rect, outer: Rect) =>
  inner.u >= outer.u && inner.v >= outer.v && inner.u + inner.w <= outer.u + outer.w && inner.v + inner.d <= outer.v + outer.d;
const halfInt = (n: unknown): n is number => Number.isInteger(n) && (n as number) >= 0;

export type IsoProblem = "unknown" | "layer" | "bounds" | "base" | "overlap";

/** i번째 물건이 그 자리에 놓일 수 있는가. 문제가 없으면 null. */
export function isoProblemAt(items: readonly IsoItem[], i: number, shown: readonly Shown[], size: number): IsoProblem | null {
  const n = floorTiles(size);
  const me = items[i];
  const spec = isoSpecOf(me.it, shown);
  if (!spec) return "unknown";

  if (isWallPos(me.pos)) {
    const { a, z, wall } = me.pos;
    if (spec.layer !== "wall" && !spec.wallOk) return "layer";
    if ((wall !== "L" && wall !== "R") || !halfInt(a) || !Number.isInteger(z)) return "bounds";
    if (a / 2 + spec.w > n || z < 0 || z + spec.h > WALL_H) return "bounds";
    for (let j = 0; j < items.length; j++) {
      const o = items[j];
      if (j === i || !isWallPos(o.pos) || o.pos.wall !== wall) continue;
      const os = isoSpecOf(o.it, shown);
      if (!os) continue;
      const along = a / 2 < o.pos.a / 2 + os.w && o.pos.a / 2 < a / 2 + spec.w;
      const up = z < o.pos.z + os.h && o.pos.z < z + spec.h;
      if (along && up) return "overlap";
    }
    return null;
  }

  const pos = me.pos;
  if (spec.layer === "wall") return "layer";
  if (!halfInt(pos.x) || !halfInt(pos.y) || ![0, 1, 2, 3].includes(pos.dir)) return "bounds";
  const fp = footprint(spec, pos);
  if (fp.u + fp.w > n || fp.v + fp.d > n) return "bounds";

  if (pos.on !== undefined) {
    const base = items[pos.on];
    if (spec.layer !== "small" || !Number.isInteger(pos.on) || pos.on >= i || !base || isWallPos(base.pos) || base.pos.on !== undefined) return "base";
    const bs = isoSpecOf(base.it, shown);
    if (!bs?.surface || !within(fp, footprint(bs, base.pos))) return "base";
    return null;
  }
  if (spec.layer === "rug") return null;

  for (let j = 0; j < items.length; j++) {
    const o = items[j];
    if (j === i || isWallPos(o.pos) || o.pos.on !== undefined) continue;
    const os = isoSpecOf(o.it, shown);
    if (!os || os.layer === "rug" || os.layer === "wall") continue;
    if (spec.layer === "small" && os.layer === "small") continue;
    if (overlap(fp, footprint(os, o.pos))) return "overlap";
  }
  return null;
}

/** 목록 전체에서 첫 문제. 없으면 null. */
export function isoProblem(items: readonly IsoItem[], shown: readonly Shown[], size: number): { index: number; problem: IsoProblem } | null {
  for (let i = 0; i < items.length; i++) {
    const problem = isoProblemAt(items, i, shown, size);
    if (problem) return { index: i, problem };
  }
  return null;
}

// ── 옛 장부 옮기기(§8.1) ──────────────────────────────────────────────

const LAYER_ORDER = { furniture: 0, rug: 1, small: 2, wall: 3 } as const;
/** 벽걸이를 옮겨 걸 때의 높이 — 키 큰 창문(46px)도 벽 안에 든다. */
const WALL_Z = 50;

/**
 * 칸 장부 → 좌표. 같은 방 크기면 칸 수와 타일 수가 같다(6·8·10).
 *   w<i> → 오른쪽 벽 가로 i, 높이 WALL_Z   b<i> → u = i, v = 0(뒤쪽)   f<i> → u = i, v = n/2(앞쪽)
 * 자리가 겹치면 가까운 빈자리로 옮기고, 끝내 없으면 stowed(보관함)에 넣는다. 가구 → 깔개 → 올려 두는 것 → 벽걸이 차례로 놓는다.
 */
export function isoFromSlots(placed: readonly SlotPlaced[], shown: readonly Shown[], size: number): { items: IsoItem[]; stowed: string[] } {
  const n = floorTiles(size);
  const items: IsoItem[] = [];
  const stowed: string[] = [];
  const queue = placed
    .map((p) => ({ p, spec: isoSpecOf(p.it, shown), slot: /^([wbf])(\d{1,2})$/.exec(p.at) }))
    .sort((a, b) => (a.spec ? LAYER_ORDER[a.spec.layer] : 9) - (b.spec ? LAYER_ORDER[b.spec.layer] : 9));

  for (const { p, spec, slot } of queue) {
    if (!spec || !slot) {
      stowed.push(p.it);
      continue;
    }
    const keep = p.kb !== undefined ? { kb: p.kb } : {};
    const pos = spotNear(items, p.it, slotToPos(p.at, spec, n)!, shown, size);
    if (pos) items.push({ it: p.it, pos, ...keep });
    else stowed.push(p.it);
  }
  return { items, stowed };
}

/** 옛 칸 하나의 첫 자리 — 위 표 그대로. 칸 모양이 틀리면 null. 벽 칸이라도 벽에 걸 수 없는 물건이면 바닥 뒤쪽. */
export function slotToPos(at: string, spec: IsoSpec, n: number): IsoPos | null {
  const slot = /^([wbf])(\d{1,2})$/.exec(at);
  if (!slot) return null;
  const i = Math.min(Number(slot[2]), n - 1);
  if (slot[1] === "w" && (spec.layer === "wall" || spec.wallOk)) return { wall: "R", a: i * 2, z: Math.min(WALL_Z, WALL_H - spec.h) };
  return { x: i * 2, y: slot[1] === "f" ? n : 0, dir: 0 };
}

/** first에 놓을 수 있으면 first, 아니면 가까운 빈자리. 끝내 없으면 null. items 뒤에 붙인다고 보고 잰다. */
export function spotNear(items: readonly IsoItem[], it: string, first: IsoPos, shown: readonly Shown[], size: number): IsoPos | null {
  const fits = (pos: IsoPos) => isoProblemAt([...items, { it, pos }], items.length, shown, size) === null;
  return [first, ...candidates(first, floorTiles(size))].find(fits) ?? null;
}

/** 저장된 자리의 모양만 본다(숫자인지). 놓일 수 있는지는 isoProblemAt이. 틀리면 null. */
export function posShape(raw: unknown): IsoPos | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const int = (v: unknown): v is number => Number.isInteger(v);
  if (r.wall === "L" || r.wall === "R") return int(r.a) && int(r.z) ? { wall: r.wall, a: r.a, z: r.z } : null;
  if (!int(r.x) || !int(r.y) || !(r.dir === 0 || r.dir === 1 || r.dir === 2 || r.dir === 3)) return null;
  return { x: r.x, y: r.y, dir: r.dir, ...(int(r.on) ? { on: r.on } : {}) };
}

/** 첫 자리에서 가까운 차례의 다른 자리들. 벽은 오른쪽 벽 → 왼쪽 벽, 바닥은 반 타일 거리 순서. */
function candidates(first: IsoPos, n: number): IsoPos[] {
  if (isWallPos(first)) {
    const out: WallPos[] = [];
    for (const wall of ["R", "L"] as const)
      for (const z of [first.z, 10, 80])
        for (let a = 0; a <= n * 2; a++) out.push({ wall, a, z });
    return out.sort((p, q) => (p.wall === q.wall ? 0 : p.wall === "R" ? -1 : 1) || Math.abs(p.a - first.a) - Math.abs(q.a - first.a));
  }
  const out: FloorPos[] = [];
  for (const dir of [0, 1] as const)
    for (let x = 0; x <= n * 2; x++)
      for (let y = 0; y <= n * 2; y++) out.push({ x, y, dir });
  const dist = (p: FloorPos) => Math.abs(p.x - first.x) + Math.abs(p.y - first.y) + p.dir;
  return out.sort((p, q) => dist(p) - dist(q));
}

// ── 공개 문서의 자리 글자 ───────────────────────────────────────────────

/** 바닥 x~y~dir[~on], 벽 L|R~a~z. 글자는 숫자·L·R·~뿐 — 글이 들어갈 자리가 없다. */
export const POS_RE = /^(?:(\d{1,2})~(\d{1,2})~([0-3])(?:~(\d{1,2}))?|([LR])~(\d{1,2})~(\d{1,3}))$/;

export function packPos(pos: IsoPos): string {
  return isWallPos(pos) ? `${pos.wall}~${pos.a}~${pos.z}` : `${pos.x}~${pos.y}~${pos.dir}${pos.on !== undefined ? `~${pos.on}` : ""}`;
}

/** 남의 공개 문서에서 읽은 자리. 모양이 틀리면 null — 놓일 수 있는지는 isoProblemAt이 따로 본다. */
export function unpackPos(raw: unknown): IsoPos | null {
  if (typeof raw !== "string") return null;
  const m = POS_RE.exec(raw);
  if (!m) return null;
  if (m[5]) return { wall: m[5] as "L" | "R", a: Number(m[6]), z: Number(m[7]) };
  return { x: Number(m[1]), y: Number(m[2]), dir: Number(m[3]) as Dir, ...(m[4] !== undefined ? { on: Number(m[4]) } : {}) };
}
