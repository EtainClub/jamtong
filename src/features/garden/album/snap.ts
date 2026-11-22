/**
 * 스냅샷 — 내 방·내 텃밭을 "찍어" 사진첩에 남긴다(docs/garden-album-review.md §4.2).
 *
 * 사진 파일을 만들지 않는다. 찍은 순간의 배치(가구·전시품·꼬마·밭의 품종과 자란 정도·마당 소품)를
 * 자료로 굳혀 사진(sn)에 싣고, 보는 화면이 방·마당 그림 부품(IsoRoomSvg·IsoYard)으로 다시 그린다.
 * 그래서 방을 바꿔도 그날의 방이 그대로 남고, 찍은 시각의 날씨·낮밤까지 같다.
 *
 * ★ 글이 들어갈 자리가 없다. 방 한마디(motto)·방 음악·피아노 연주·책 문장은 싣지 않는다.
 *   액자는 쪽지 id만(보는 화면이 품종표에서 글을 읽는다) — 공개 방(publicRoom)과 같은 선이다.
 * ★ 남의 사진에서 읽은 값은 아무 값이나 담길 수 있다. 그리는 쪽이 표에 있는 것만 그린다(roomFromPublic·snapYardPlots).
 * ★ 값의 모양은 firestore.rules의 roomSnapOk()·yardSnapOk()와 같다 — album/rules.test.ts가 대조한다.
 */

import type { PublicPlaced, PublicRoom } from "@/lib/firebase/gardens";

import { AVATAR_PUBLIC_MAX, AVATAR_PUBLIC_RE, avatarFromPublic, packAvatar, type AvatarData } from "../avatar/rules";
import { DEFAULT_MOOD, MOODS } from "../room/catalog";
import { PUBLIC_ID_MAX, PUBLIC_PLACED_MAX, publicRoom, roomWidth, type RoomData } from "../room/rules";
import type { Plant, Species } from "../types";
import { YARD_BY_ID, YARD_SLOTS, type YardData } from "../yard";

export const SNAP_KINDS = ["room", "yard"] as const;
export type SnapKind = (typeof SNAP_KINDS)[number];

/** 방·텃밭 사진은 합쳐서 이만큼 — 사진 하나에 배치 자료가 통째로 실린다(장부는 users/{uid}/garden/state 한 문서). */
export const SNAP_MAX = 12;
/** 텃밭 밭 수의 상한. firestore.rules의 publicGarden()의 beds와 같다. */
export const SNAP_BEDS_MAX = 12;

/** 방 스냅샷 — 공개 방(PublicRoom)에서 글·소리를 뺀 것. */
export interface RoomSnap {
  size: number;
  wall: string;
  floor: string;
  mood: string;
  placed: PublicPlaced[];
  keys?: PublicRoom["keys"];
  avatar?: string;
}

/** 텃밭 한 칸 — 품종 id와 자란 정도(0–100, 100이면 다 자랐다). */
export interface SnapBed {
  s: string;
  g: number;
}

/** 텃밭 스냅샷 — b=밭, y=마당 꾸밈 자리, m=그때의 기분(꼬마 얼굴), av·z=꼬마(방 크기 z 기준으로 묶은 글자). */
export interface YardSnap {
  b: Array<SnapBed | null>;
  y: Array<string | null>;
  m: string;
  av?: string;
  z?: number;
}

export type Snap = RoomSnap | YardSnap;

const ID_RE = /^[a-z0-9:#-]{1,100}$/;

export function isSnapAnchor(a: string): a is `m:${SnapKind}` {
  return a === "m:room" || a === "m:yard";
}

export function snapKindOf(a: string): SnapKind | null {
  return a === "m:room" ? "room" : a === "m:yard" ? "yard" : null;
}

/** 피아노 연주·책 문장·진열장 밖의 칸은 뺀다 — 그림에 필요한 것만. */
function stripPlaced(p: PublicPlaced): PublicPlaced {
  if (!("i" in p)) return p;
  const { pn: _pn, ps: _ps, bm: _bm, bd: _bd, ...rest } = p;
  void _pn;
  void _ps;
  void _bm;
  void _bd;
  return rest;
}

/** 지금 방을 찍는다. */
export function roomSnap(room: RoomData): RoomSnap {
  const pub = publicRoom(room);
  return {
    size: pub.size,
    wall: pub.wall,
    floor: pub.floor,
    mood: pub.mood,
    placed: pub.placed.map(stripPlaced),
    ...(pub.keys ? { keys: pub.keys } : {}),
    ...(pub.avatar ? { avatar: pub.avatar } : {}),
  };
}

/** 지금 텃밭을 찍는다. 자란 정도는 찍은 시각(now) 기준. */
export function yardSnap(beds: ReadonlyArray<Plant | null>, yard: YardData | undefined, room: RoomData, now: number): YardSnap {
  const b = beds.slice(0, SNAP_BEDS_MAX).map((p): SnapBed | null => {
    if (!p || !ID_RE.test(p.speciesId)) return null;
    const span = p.ripeAt - p.plantedAt;
    const g = span <= 0 ? 100 : Math.round(Math.min(1, Math.max(0, (now - p.plantedAt) / span)) * 100);
    return { s: p.speciesId, g };
  });
  const y = Array.from({ length: YARD_SLOTS }, (_, i) => {
    const id = yard?.slots[i];
    return typeof id === "string" && YARD_BY_ID.has(id) ? id : null;
  });
  const av = room.avatar ? packAvatar(room.avatar, roomWidth(room.size)) : null;
  return { b, y, m: room.mood, ...(av ? { av, z: room.size } : {}) };
}

export interface SnapClip {
  a: `m:${SnapKind}`;
  md: { v: number };
  sn: Snap;
}

/** 찍는다 — 사진첩 담기 시트에 넘길 앵커·찍은 때(분, md.v)·배치. */
export function takeSnap(
  kind: SnapKind,
  d: { room: RoomData; beds: ReadonlyArray<Plant | null>; yard?: YardData },
  now: number,
): SnapClip {
  return { a: `m:${kind}`, md: { v: Math.floor(now / 60_000) }, sn: kind === "room" ? roomSnap(d.room) : yardSnap(d.beds, d.yard, d.room, now) };
}

/** 정해진 키만 남기고 모양을 본다. 틀리면 null(그 사진은 담지 않는다). */
export function cleanSnap(kind: SnapKind, raw: unknown): Snap | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const short = (v: unknown) => typeof v === "string" && v.length <= PUBLIC_ID_MAX;
  const avatarOk = (v: unknown) => typeof v === "string" && v.length <= AVATAR_PUBLIC_MAX && AVATAR_PUBLIC_RE.test(v);
  if (kind === "room") {
    if (!(r.size === 0 || r.size === 1 || r.size === 2) || !short(r.wall) || !short(r.floor) || !short(r.mood)) return null;
    if (!Array.isArray(r.placed) || r.placed.length > PUBLIC_PLACED_MAX) return null;
    const placed = r.placed.filter((p): p is PublicPlaced => Boolean(p) && typeof p === "object" && typeof (p as { a?: unknown }).a === "string");
    const keys = Array.isArray(r.keys) && r.keys.length === 4 ? (r.keys as RoomSnap["keys"]) : undefined;
    return {
      size: r.size,
      wall: r.wall as string,
      floor: r.floor as string,
      mood: r.mood as string,
      placed,
      ...(keys ? { keys } : {}),
      ...(avatarOk(r.avatar) ? { avatar: r.avatar as string } : {}),
    };
  }
  if (!Array.isArray(r.b) || r.b.length > SNAP_BEDS_MAX || !Array.isArray(r.y) || r.y.length > YARD_SLOTS || !short(r.m)) return null;
  const b = r.b.map((x): SnapBed | null => {
    if (!x || typeof x !== "object") return null;
    const { s, g } = x as Record<string, unknown>;
    return typeof s === "string" && ID_RE.test(s) && typeof g === "number" && Number.isInteger(g) && g >= 0 && g <= 100 ? { s, g } : null;
  });
  const y = r.y.map((x) => (typeof x === "string" && short(x) ? x : null));
  const z = r.z === 0 || r.z === 1 || r.z === 2 ? r.z : undefined;
  return { b, y, m: r.m as string, ...(avatarOk(r.av) && z !== undefined ? { av: r.av as string, z } : {}) };
}

// ── 그리기 ───────────────────────────────────────────────────────────

/** 텃밭 사진의 밭 — 품종표에 없는 품종은 빈 밭으로. */
export function snapYardPlots(snap: YardSnap, byId: ReadonlyMap<string, Species>) {
  return snap.b.map((bed) => {
    const species = bed ? byId.get(bed.s) : undefined;
    if (!bed || !species) return { plant: null, progress: 0, ripe: false, left: 0 };
    return { plant: null, species, progress: bed.g / 100, ripe: bed.g >= 100, left: 0 };
  });
}

export function snapYard(snap: YardSnap): YardData {
  return { owned: {}, slots: Array.from({ length: YARD_SLOTS }, (_, i) => (snap.y[i] && YARD_BY_ID.has(snap.y[i]!) ? snap.y[i] : null)) };
}

export function snapYardAvatar(snap: YardSnap): AvatarData | undefined {
  return (snap.av && avatarFromPublic(snap.av, snap.z ?? 0)) || undefined;
}

export function snapMood(id: string): string {
  return MOODS.some((m) => m.id === id) ? id : DEFAULT_MOOD;
}

/** 사진 아래에 적는 짧은 기록 — 세기만 한다(지어낸 말이 없다). */
export function yardFacts(snap: YardSnap, byId: ReadonlyMap<string, Species>): { plots: number; planted: number; ripe: number; kinds: number; deco: number } {
  const live = snap.b.filter((x): x is SnapBed => Boolean(x) && byId.has(x!.s));
  return {
    plots: snap.b.length,
    planted: live.length,
    ripe: live.filter((x) => x.g >= 100).length,
    kinds: new Set(live.map((x) => x.s)).size,
    deco: snap.y.filter(Boolean).length,
  };
}
