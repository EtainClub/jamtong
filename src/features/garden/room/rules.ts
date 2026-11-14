import type { PublicPlaced, PublicRoom } from "@/lib/firebase/gardens";

import { DEFAULT_TRACK, isGardenTrack, type GardenTrackId } from "../musicTracks";
import { hash, kstDayNumber, MUTATION_ORDER, rng } from "../rules";
import { cleanLine, lineProblem, type LineProblem } from "../ilchon/text";
import { isRaidKind } from "../raid/rules";
import type { Fruit, Mutation, Species } from "../types";
import { DEFAULT_FLOOR, DEFAULT_MOOD, DEFAULT_WALL, FRAME_BLANK, FURNITURE, FURNITURE_BY_ID, MOODS, ROOM_SIZES, type Furniture } from "./catalog";
import { freshKeys, KEYBOARD_ID, keysFromPublic, normalizeKeys, publicKeys, type RoomKey } from "./keyboard";

/**
 * 내 방의 규칙 — 순수 함수만 둔다. 설계는 docs/garden-miniroom.md §4.
 *
 * ★ 칸에 놓는다. 벽 한 줄(w), 바닥 뒷줄(b)·앞줄(f). 칸 이름은 "w3"·"b0"·"f5".
 *   가구는 1칸 또는 2칸을 차지하고, 2칸은 오른쪽 칸까지 쓴다.
 * ★ 놓인 것(placed)이 산 것(owned)·전시품(shown)을 가리킨다. 보관함은 따로 적지 않는다 —
 *   가진 것에서 놓인 것을 뺀 나머지다. 장부가 둘이면 서로 어긋난다.
 * ★ 전시품 id에는 ":"가 있다(p:<열매id>, f:<쪽지id>, t:<악초 종류>). 가구 id에는 없다.
 */

export type ShownKind = "pot" | "tree" | "frame" | "trophy";

/** 전시품. 거둔 것에서 나온다 — 상점에서 팔지 않는다. */
export interface Shown {
  id: string;
  kind: ShownKind;
  /** 품종 id. 박제(trophy)는 악초 종류 id(rules.ts의 RaidKindId). */
  species?: string;
  mut?: Mutation[];
  note?: string;
}

export interface Placed {
  /** 칸. "w3" | "b2" | "f5". 2칸짜리는 왼쪽 칸. */
  at: string;
  /** 가구 id 또는 전시품 id. */
  it: string;
}

export interface RoomData {
  size: 0 | 1 | 2;
  /** 벽지 id. */
  wall: string;
  /** 바닥재 id. */
  floor: string;
  /** 오늘의 기분 id. */
  mood: string;
  /** 방 음악(feedback.ts의 곡 id). 손님도 이 방에서는 이 곡을 듣는다. */
  bgm: GardenTrackId;
  placed: Placed[];
  /** 산 가구의 수. 처음부터 가진 벽지·바닥재(값 0)는 적지 않는다. */
  owned: Record<string, number>;
  shown: Shown[];
  /** 내 키보드의 키 넷(docs/garden-miniroom.md §4.5, keyboard.ts). 키보드를 사기 전에도 있다(처음 키). */
  keys: RoomKey[];
  /** 방 한마디. '내 방' 옆에 걸리는 한 줄(MOTTO_MAX자). 사람이 쓴 글이라 걸러서 받고, 그 방 안에서만 보인다. */
  motto: string;
}

export type Row = "w" | "b" | "f";

// 방 넓히기 표(ROOM_SIZES)는 catalog.ts에 둔다 — ilchon/rules.ts가 이 파일을 거치지 않고 읽게(순환 import를 끊는다).
export { ROOM_SIZES };

/** 전시품 상한. 장부가 끝없이 커지지 않게. 바구니(120)보다 넉넉하다. */
export const SHOWN_MAX = 200;
/** 가구 한 가지를 가질 수 있는 수. */
export const OWN_MAX = 9;
/** 공개 문서에 싣는 놓인 것의 수. firestore.rules의 publicRoom()과 같다. */
export const PUBLIC_PLACED_MAX = 40;
/** 공개 문서의 짧은 글(id)의 길이. firestore.rules의 publicRoom()과 같다. */
export const PUBLIC_ID_MAX = 40;
/** 방 한마디의 길이. firestore.rules의 publicRoom()과 같다. */
export const MOTTO_MAX = 30;

/** 방 한마디를 한 줄로. 걸러낼 것이 있으면 빈 글 — 공개 문서에서 읽을 때도 다시 거른다(손으로 만든 요청). */
export function cleanMotto(input: string): string {
  const text = cleanLine(input);
  return text.length <= MOTTO_MAX && lineProblem(text) === null ? text : "";
}

/** 방 한마디의 문제. 비우는 것은 문제가 아니다(한마디를 지운다). */
export function mottoProblem(input: string): LineProblem | null {
  const text = cleanLine(input);
  if (text.length === 0) return null;
  if (text.length > MOTTO_MAX) return "long";
  return lineProblem(text);
}

/** 주마다 바뀌는 진열의 칸 수. */
export const WEEKLY_SIZE = 4;

export function freshRoom(): RoomData {
  return { size: 0, wall: DEFAULT_WALL, floor: DEFAULT_FLOOR, mood: DEFAULT_MOOD, bgm: DEFAULT_TRACK, placed: [], owned: {}, shown: [], keys: freshKeys(), motto: "" };
}

/** 방이 생기기 전에 저장된 정원, 또는 모양이 어긋난 방. */
export function normalizeRoom(raw: Partial<RoomData> | undefined): RoomData {
  const base = freshRoom();
  if (!raw) return base;
  const size = raw.size === 1 || raw.size === 2 ? raw.size : 0;
  return {
    size,
    wall: typeof raw.wall === "string" ? raw.wall : base.wall,
    floor: typeof raw.floor === "string" ? raw.floor : base.floor,
    mood: typeof raw.mood === "string" ? raw.mood : base.mood,
    bgm: isGardenTrack(raw.bgm) ? raw.bgm : base.bgm,
    placed: Array.isArray(raw.placed) ? raw.placed.filter((p) => p && typeof p.at === "string" && typeof p.it === "string") : [],
    owned: raw.owned && typeof raw.owned === "object" ? raw.owned : {},
    shown: Array.isArray(raw.shown) ? raw.shown.filter((s) => s && typeof s.id === "string") : [],
    keys: normalizeKeys(raw.keys),
    motto: typeof raw.motto === "string" ? cleanMotto(raw.motto) : "",
  };
}

/** 키보드가 방에 놓였는가. 놓였을 때만 공개 방에 키를 싣고, 녹음을 남겨 둔다. */
export function hasKeyboard(room: Pick<RoomData, "placed">): boolean {
  return room.placed.some((p) => p.it === KEYBOARD_ID);
}

export function roomWidth(size: number): number {
  return ROOM_SIZES[size]?.width ?? ROOM_SIZES[0].width;
}

export function parseSlot(at: string): { row: Row; i: number } | null {
  const m = /^([wbf])(\d{1,2})$/.exec(at);
  return m ? { row: m[1] as Row, i: Number(m[2]) } : null;
}

export function isShownId(it: string): boolean {
  return it.includes(":");
}

/** 놓는 곳과 크기. 놓을 수 없는 것(벽지·액자틀·연출·모르는 id)은 null. 박제는 벽에도 바닥에도(any). */
export function placement(it: string, shown: readonly Shown[]): { on: "wall" | "floor" | "any"; size: 1 | 2 } | null {
  if (isShownId(it)) {
    const s = shown.find((x) => x.id === it);
    if (!s) return null;
    return { on: s.kind === "frame" ? "wall" : s.kind === "trophy" ? "any" : "floor", size: 1 };
  }
  const f = FURNITURE_BY_ID.get(it);
  if (!f) return null;
  if (f.kind === "wall" || f.kind === "window") return { on: "wall", size: f.size };
  if (f.kind === "floor") return { on: "floor", size: f.size };
  return null;
}

/** 이 물건이 at에 놓이면 차지하는 칸들. 방을 벗어나면 null. */
export function slotsOf(at: string, size: 1 | 2, width: number): string[] | null {
  const p = parseSlot(at);
  if (!p || p.i + size > width) return null;
  return Array.from({ length: size }, (_, k) => `${p.row}${p.i + k}`);
}

/** 이미 차 있는 칸. except는 옮기는 중인 물건의 칸(그 자리는 비었다고 본다). */
function taken(room: RoomData, except?: string): Set<string> {
  const width = roomWidth(room.size);
  const out = new Set<string>();
  for (const p of room.placed) {
    if (p.at === except) continue;
    const spec = placement(p.it, room.shown);
    for (const s of (spec && slotsOf(p.at, spec.size, width)) ?? []) out.add(s);
  }
  return out;
}

function fits(on: "wall" | "floor" | "any", row: Row): boolean {
  return on === "any" || (on === "wall") === (row === "w");
}

export function canPlace(room: RoomData, it: string, at: string, except?: string): boolean {
  const spec = placement(it, room.shown);
  const slot = parseSlot(at);
  if (!spec || !slot) return false;
  if (!fits(spec.on, slot.row)) return false;
  const cells = slotsOf(at, spec.size, roomWidth(room.size));
  if (!cells) return false;
  const busy = taken(room, except);
  return cells.every((c) => !busy.has(c));
}

/** 이 물건을 놓을 수 있는 모든 칸. 꾸미기 화면이 빛낼 칸이다. */
export function openSlots(room: RoomData, it: string, except?: string): string[] {
  const width = roomWidth(room.size);
  const rows: Row[] = ["w", "b", "f"];
  return rows.flatMap((row) => Array.from({ length: width }, (_, i) => `${row}${i}`)).filter((at) => canPlace(room, it, at, except));
}

/** 보관함에 남은 수. 가구는 가진 수에서 놓인 수를 뺀다. 전시품은 놓이지 않았으면 1. */
export function stowedCount(room: RoomData, it: string): number {
  const placed = room.placed.filter((p) => p.it === it).length;
  if (isShownId(it)) return room.shown.some((s) => s.id === it) && placed === 0 ? 1 : 0;
  return Math.max(0, (room.owned[it] ?? 0) - placed);
}

/** 보관함 → 칸. 남은 것이 없거나 칸이 맞지 않으면 null. */
export function place(room: RoomData, it: string, at: string): RoomData | null {
  if (stowedCount(room, it) <= 0 || !canPlace(room, it, at)) return null;
  return { ...room, placed: [...room.placed, { at, it }] };
}

export function move(room: RoomData, from: string, to: string): RoomData | null {
  const item = room.placed.find((p) => p.at === from);
  if (!item || from === to || !canPlace(room, item.it, to, from)) return null;
  return { ...room, placed: room.placed.map((p) => (p.at === from ? { at: to, it: p.it } : p)) };
}

/** 칸 → 보관함. 치워도 사라지지 않는다. */
export function stow(room: RoomData, at: string): RoomData {
  return { ...room, placed: room.placed.filter((p) => p.at !== at) };
}

/** 첫 빈 칸(바닥은 뒷줄부터). 없으면 null. 전시하자마자 방에 보이게 할 때 쓴다. */
export function firstOpenSlot(room: RoomData, it: string): string | null {
  return openSlots(room, it)[0] ?? null;
}

/**
 * 저장할 방이 맞는가. 꾸미기를 마칠 때 본다 — 화면의 초안이 어긋나 있으면 받지 않는다.
 * 모든 놓인 것이 제 칸에 맞고, 겹치지 않고, 가진 수를 넘지 않는다. 벽지·바닥재는 가진 것이다.
 */
export function validRoom(room: RoomData): boolean {
  if (!hasSurface(room, room.wall, "wallpaper") || !hasSurface(room, room.floor, "flooring")) return false;
  const width = roomWidth(room.size);
  const busy = new Set<string>();
  const counts = new Map<string, number>();
  for (const p of room.placed) {
    const spec = placement(p.it, room.shown);
    const slot = parseSlot(p.at);
    if (!spec || !slot || !fits(spec.on, slot.row)) return false;
    const cells = slotsOf(p.at, spec.size, width);
    if (!cells || cells.some((c) => busy.has(c))) return false;
    cells.forEach((c) => busy.add(c));
    counts.set(p.it, (counts.get(p.it) ?? 0) + 1);
  }
  for (const [it, n] of counts) {
    if (isShownId(it) ? n > 1 : n > (room.owned[it] ?? 0)) return false;
  }
  return true;
}

/** 이 벽지·바닥재를 쓸 수 있는가. 값 0(잼)은 처음부터 가진 것. 전리품·보상은 가져야 쓴다. */
export function hasSurface(room: RoomData, id: string, kind: "wallpaper" | "flooring"): boolean {
  const f = FURNITURE_BY_ID.get(id);
  return Boolean(f && f.kind === kind && ((f.price === 0 && !f.cur) || (room.owned[id] ?? 0) > 0));
}

/** 벽지나 바닥재를 바른다. 가지지 않았으면 null. */
export function applySurface(room: RoomData, id: string): RoomData | null {
  const f = FURNITURE_BY_ID.get(id);
  if (!f || (f.kind !== "wallpaper" && f.kind !== "flooring")) return null;
  if (!hasSurface(room, id, f.kind)) return null;
  return f.kind === "wallpaper" ? { ...room, wall: id } : { ...room, floor: id };
}

// ── 주마다 바뀌는 진열 ───────────────────────────────────────────────

/** 한국 시각으로 월요일에 바뀌는 주 번호. 날짜 번호 0(1970-01-01)은 목요일이다. */
export function kstWeek(t: number): number {
  return Math.floor((kstDayNumber(t) + 3) / 7);
}

/** 다음 진열까지 남은 시간(ms). */
export function weekLeft(t: number): number {
  const nextMonday = (kstWeek(t) + 1) * 7 - 3;
  return nextMonday * 86_400_000 - 9 * 3_600_000 - t;
}

/** 이번 주 진열. 주 번호에서 정해지므로 모두가 같은 진열을 본다. */
export function weeklyPicks(t: number, items: readonly Furniture[] = FURNITURE): string[] {
  const pool = items.filter((f) => f.weekly).map((f) => f.id);
  const roll = rng(hash(`room-week:${kstWeek(t)}`));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(roll() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, WEEKLY_SIZE);
}

/** 지금 잼으로 살 수 있는가. 주간 진열 물건은 그 주에만. 전리품·보상은 잼으로 사지 못한다. */
export function onSale(f: Furniture, t: number): boolean {
  return !f.cur && f.price > 0 && (!f.weekly || weeklyPicks(t).includes(f.id));
}

/**
 * 🏆 전리품을 뿌리 조각으로 산다(docs/garden-miniroom.md §7.4). 잼 상점의 buyItem과 같은 상한을 둔다.
 * 벽지·바닥재·연출은 하나면 된다.
 */
export function buyTrophyItem(room: RoomData, roots: number, id: string): { room: RoomData; roots: number } | BuyRefusal {
  const f = FURNITURE_BY_ID.get(id);
  if (!f) return "unknown";
  if (f.cur !== "root") return "off-sale";
  const have = room.owned[id] ?? 0;
  if ((f.kind === "wallpaper" || f.kind === "flooring" || f.kind === "fx") && have > 0) return "owned";
  if (have >= OWN_MAX) return "full";
  if (roots < f.price) return "jam";
  return { room: { ...room, owned: { ...room.owned, [id]: have + 1 } }, roots: roots - f.price };
}

/** 받은 것을 장부에 넣는다(보상 벽지). 이미 있으면 그대로. */
export function grantItem(room: RoomData, id: string): RoomData {
  return (room.owned[id] ?? 0) > 0 ? room : { ...room, owned: { ...room.owned, [id]: 1 } };
}

export type BuyRefusal = "unknown" | "off-sale" | "owned" | "full" | "jam";

/**
 * 가구를 산다. 벽지·바닥재는 하나면 된다. 다른 것은 OWN_MAX까지.
 * 사지 못하면 그 까닭을, 사면 새 방과 남은 잼을.
 */
export function buyItem(
  room: RoomData,
  jam: number,
  id: string,
  t: number,
): { room: RoomData; jam: number } | BuyRefusal {
  const f = FURNITURE_BY_ID.get(id);
  if (!f) return "unknown";
  if (!onSale(f, t)) return "off-sale";
  const have = room.owned[id] ?? 0;
  if ((f.kind === "wallpaper" || f.kind === "flooring") && have > 0) return "owned";
  if (have >= OWN_MAX) return "full";
  if (jam < f.price) return "jam";
  return { room: { ...room, owned: { ...room.owned, [id]: have + 1 } }, jam: jam - f.price };
}

export function nextRoomSize(room: RoomData): (typeof ROOM_SIZES)[number] | null {
  return ROOM_SIZES[room.size + 1] ?? null;
}

/** 방 넓히기. 놓인 것은 그대로 — 칸은 오른쪽으로만 늘어난다. */
export function upgradeRoom(room: RoomData, jam: number): { room: RoomData; jam: number } | null {
  const next = nextRoomSize(room);
  if (!next || jam < next.price) return null;
  return { room: { ...room, size: (room.size + 1) as 1 | 2 }, jam: jam - next.price };
}

// ── 전시 ─────────────────────────────────────────────────────────────

/** 열매를 전시품으로. 다년생은 나무, 나머지는 화분. 변이는 그대로 옮긴다. */
export function shownFromFruit(fruit: Fruit, species: Species): Shown {
  return {
    id: `p:${fruit.id}`,
    kind: species.tier === "perennial" ? "tree" : "pot",
    species: species.id,
    mut: fruit.mutations,
  };
}

/** 전시품을 더하고, 빈 칸이 있으면 바로 놓는다. 상한에 닿았으면 null. */
export function addShown(room: RoomData, shown: Shown): { room: RoomData; at: string | null } | null {
  if (room.shown.length >= SHOWN_MAX || room.shown.some((s) => s.id === shown.id)) return null;
  const next = { ...room, shown: [...room.shown, shown] };
  const at = firstOpenSlot(next, shown.id);
  return { room: at ? { ...next, placed: [...next.placed, { at, it: shown.id }] } : next, at };
}

/** 이 쪽지가 이미 걸렸는가. 쪽지 하나에 액자 하나. */
export function framed(room: RoomData, noteId: string): boolean {
  return room.shown.some((s) => s.kind === "frame" && s.note === noteId);
}

/**
 * 쪽지를 액자에 건다. 빈 액자틀이 있으면 그것을, 없으면 잼으로 하나 사서 건다.
 * 이미 걸린 쪽지거나, 액자틀도 잼도 없으면 null.
 */
export function frameNote(
  room: RoomData,
  jam: number,
  noteId: string,
  speciesId: string,
): { room: RoomData; jam: number; at: string | null; bought: boolean } | null {
  if (framed(room, noteId)) return null;
  const blank = FURNITURE_BY_ID.get(FRAME_BLANK)!;
  const have = room.owned[FRAME_BLANK] ?? 0;
  const bought = have <= 0;
  if (bought && jam < blank.price) return null;
  const owned: Record<string, number> = { ...room.owned, [FRAME_BLANK]: have - (bought ? 0 : 1) };
  if (owned[FRAME_BLANK] <= 0) delete owned[FRAME_BLANK];
  const added = addShown({ ...room, owned }, { id: `f:${noteId}`, kind: "frame", species: speciesId, note: noteId });
  if (!added) return null;
  return { room: added.room, jam: bought ? jam - blank.price : jam, at: added.at, bought };
}

// ── 공개 ─────────────────────────────────────────────────────────────

/**
 * 공개 문서에 싣는 방. 글은 싣지 않는다 — 액자는 쪽지 id와 품종 id만.
 * 보는 화면이 품종표에서 글을 읽으므로 사람이 지은 글이 액자에 들어갈 길이 없다.
 * 너무 긴 id나 넘치는 것은 버린다(규칙이 받지 않는다).
 */
export function publicRoom(room: RoomData): PublicRoom {
  const short = (s: string | undefined) => s !== undefined && s.length <= PUBLIC_ID_MAX;
  const placed: PublicPlaced[] = [];
  for (const p of room.placed) {
    if (placed.length >= PUBLIC_PLACED_MAX) break;
    if (!isShownId(p.it)) {
      if (short(p.it)) placed.push({ a: p.at, i: p.it });
      continue;
    }
    const s = room.shown.find((x) => x.id === p.it);
    if (!s || !short(s.species)) continue;
    if (s.kind === "trophy") {
      // 박제는 악초 종류 id만. 보는 화면이 종류표에서 이름·그림·성질을 읽는다.
      placed.push({ a: p.at, k: "trophy", s: s.species! });
    } else if (s.kind === "frame") {
      if (s.note && s.note.length <= 120) placed.push({ a: p.at, k: "frame", s: s.species!, n: s.note });
    } else {
      placed.push({ a: p.at, k: s.kind, s: s.species!, m: s.mut ?? [] });
    }
  }
  // 키보드는 방에 놓였을 때만 싣는다 — 그림·소리 id·녹음 판 번호뿐이다(keyboard.ts의 publicKeys).
  const keys = placed.some((p) => "i" in p && p.i === KEYBOARD_ID) ? { keys: publicKeys(room.keys) } : {};
  const motto = room.motto ? { motto: room.motto } : {};
  return { size: room.size, wall: room.wall, floor: room.floor, mood: room.mood, bgm: room.bgm, placed, ...keys, ...motto };
}

/**
 * 남의 방을 그릴 방으로 되돌린다. 표에 있는 것만 — 모르는 가구, 품종표에 없는 품종,
 * 그 품종에 없는 쪽지, 칸이 맞지 않거나 겹치는 것은 뺀다. 공개 문서에는 아무 값이나 담길 수 있다.
 */
export function roomFromPublic(pub: PublicRoom, byId: ReadonlyMap<string, Species>): RoomData {
  const size = pub.size === 1 || pub.size === 2 ? pub.size : 0;
  const wall = FURNITURE_BY_ID.get(pub.wall)?.kind === "wallpaper" ? pub.wall : DEFAULT_WALL;
  const floor = FURNITURE_BY_ID.get(pub.floor)?.kind === "flooring" ? pub.floor : DEFAULT_FLOOR;
  const mood = MOODS.some((m) => m.id === pub.mood) ? pub.mood : DEFAULT_MOOD;
  const bgm = isGardenTrack(pub.bgm) ? pub.bgm : DEFAULT_TRACK;
  // 키는 모양을 다시 본다 — 어긋난 그림은 빈 그림, 모르는 소리는 소리 없음(keyboard.ts의 keysFromPublic).
  let room: RoomData = { size, wall, floor, mood, bgm, placed: [], owned: {}, shown: [], keys: keysFromPublic(pub.keys), motto: typeof pub.motto === "string" ? cleanMotto(pub.motto) : "" };
  pub.placed.slice(0, PUBLIC_PLACED_MAX).forEach((p, n) => {
    if ("i" in p) {
      // 남의 방은 가진 수를 모른다. 놓인 만큼 가졌다고 본다.
      const owned = { ...room.owned, [p.i]: (room.owned[p.i] ?? 0) + 1 };
      const next = place({ ...room, owned }, p.i, p.a);
      if (next) room = next;
      return;
    }
    if (p.k === "trophy") {
      if (!isRaidKind(p.s)) return;
      const shown: Shown = { id: `v:${n}`, kind: "trophy", species: p.s };
      const next = place({ ...room, shown: [...room.shown, shown] }, shown.id, p.a);
      if (next) room = next;
      return;
    }
    const species = byId.get(p.s);
    if (!species || (p.k !== "pot" && p.k !== "tree" && p.k !== "frame")) return;
    if (p.k === "frame" && !(p.n && species.notes.some((x) => x.id === p.n))) return;
    const shown: Shown =
      p.k === "frame"
        ? { id: `v:${n}`, kind: "frame", species: p.s, note: p.n }
        : { id: `v:${n}`, kind: p.k, species: p.s, mut: (p.m ?? []).filter((m): m is Mutation => MUTATION_ORDER.includes(m as Mutation)) };
    const next = place({ ...room, shown: [...room.shown, shown] }, shown.id, p.a);
    if (next) room = next;
  });
  return room;
}
