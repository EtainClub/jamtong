import { pianoNotes, pianoSong, type PianoEvent } from "./piano";
import type { PublicPlaced, PublicRoom } from "@/lib/firebase/gardens";

import { bookIdOf, booksOwned, cleanMarks, LIBRARY_SETS, roomBookOf } from "./library";

import { DEFAULT_TRACK, isGardenTrack, type GardenTrackId } from "../musicTracks";
import { canUseTrack, ownedMusic, purchasedTrack, type PurchasedTrackId } from "../musicTracks";
import { hash, kstDayNumber, MUTATION_ORDER, rng } from "../rules";
import { cleanLine, lineProblem, type LineProblem } from "../ilchon/text";
import { isRaidKind } from "../raid/rules";
import type { Fruit, Mutation, Species } from "../types";
import { DEFAULT_FLOOR, DEFAULT_MOOD, DEFAULT_WALL, FRAME_BLANK, FURNITURE, FURNITURE_BY_ID, MOODS, ROOM_SIZES, type Furniture } from "./catalog";
import { avatarFromPublic, avatarSlotOk, freshAvatar, normalizeAvatar, packAvatar, type AvatarData } from "../avatar/rules";
import { freshKeys, KEYBOARD_ID, KEY_VER_MAX, recSlots, keysFromPublic, normalizeKeys, publicKeys, packKeyboard, unpackKeyboard, type RoomKey } from "./keyboard";

/**
 * 내 방의 규칙 — 순수 함수만 둔다. 설계는 docs/garden-miniroom.md §4.
 *
 * ★ 칸에 놓는다. 벽 한 줄(w), 바닥 뒷줄(b)·앞줄(f). 칸 이름은 "w3"·"b0"·"f5".
 *   가구는 1칸 또는 2칸을 차지하고, 2칸은 오른쪽 칸까지 쓴다.
 * ★ 놓인 것(placed)이 산 것(owned)·전시품(shown)을 가리킨다. 보관함은 따로 적지 않는다 —
 *   가진 것에서 놓인 것을 뺀 나머지다. 장부가 둘이면 서로 어긋난다.
 * ★ 전시품 id에는 ":"가 있다(p:<열매id>, f:<쪽지id>, t:<악초 종류>, s:<업적 품종 id>). 가구 id에는 없다.
 * ★ 업적 기념품(souvenir)은 업적 기념관에서 문제를 맞혀 받는다 — 잼으로 사지 않는다(docs/garden-achievement-strategy.md §3).
 */

export type ShownKind = "pot" | "tree" | "frame" | "trophy" | "souvenir";

/** 전시품. 거둔 것에서 나온다 — 상점에서 팔지 않는다. */
export interface Shown {
  id: string;
  kind: ShownKind;
  /** 품종 id. 박제(trophy)는 악초 종류 id(rules.ts의 RaidKindId), 기념품(souvenir)은 업적 품종 id(a:<slug>). */
  species?: string;
  mut?: Mutation[];
  note?: string;
}

export interface Placed {
  /** 칸. "w3" | "b2" | "f5". 2칸짜리는 왼쪽 칸. */
  at: string;
  /** 가구 id 또는 전시품 id. */
  it: string;
  /** 키보드·피아노 개체 번호(각 종류별 0–8). 옮겨도 유지한다. */
  kb?: number;
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
  /** 상점에서 한 번 구매한 음원. 공개 방에는 선택한 bgm id만 보낸다. */
  music?: PurchasedTrackId[];
  placed: Placed[];
  /** 산 가구의 수. 처음부터 가진 벽지·바닥재(값 0)는 적지 않는다. */
  owned: Record<string, number>;
  shown: Shown[];
  /** 내 키보드의 키 넷(docs/garden-miniroom.md §4.5, keyboard.ts). 키보드를 사기 전에도 있다(처음 키). */
  keys: RoomKey[];
  /** 두 번째부터의 키보드. 0번은 기존 keys를 사용한다. */
  keyboards?: Record<string, RoomKey[]>;
  /** 피아노 개체별 건반 음. kb 번호는 키보드와 별개다. */
  pianos?: Record<string, number[]>;
  /** 피아노마다 저장한 15초 연주. */
  pianoSongs?: Record<string, PianoEvent[]>;
  /** 방 한마디. '내 방' 옆에 걸리는 한 줄(MOTTO_MAX자). 사람이 쓴 글이라 걸러서 받고, 그 방 안에서만 보인다. */
  motto: string;
  /** 내 방의 꼬마(docs/garden-avatar.md). 옛 장부·남의 옛 방에는 없다 — normalizeRoom이 채운다. */
  avatar?: AvatarData;
  /**
   * 특별한 책(room/library.ts)마다 — 독서대에 펼쳐 둔 문장(쉽게 보기 토막 id, 셋까지)과 들인 날(한국 날짜 번호, 장서표).
   * 손님에게도 보인다(공개 문서의 bm·bd). 글이 아니라 id라서 걸러 받을 것이 없다.
   */
  books?: Record<string, RoomBookData>;
  /**
   * 사진첩(docs/garden-achievement-strategy.md §3) — 거둔 업적 품종 id(a:<slug>)를 올린 순서대로, ALBUM_MAX장까지.
   * 사진과 글은 보는 화면이 기념관 자료(/garden/memorial.json)에서 읽는다. 여기에는 id만 있다.
   */
  album?: string[];
  /**
   * 기념품 진열장을 저절로 놓은 적이 있는가. 한 번만 놓는다 — 사람이 진열장을 보관함에 넣었으면 다시 꺼내 놓지 않는다.
   */
  caseAuto?: boolean;
  /** 진열장을 놓느라 보관함에 넣은 물건 id. 방 화면이 한 번 알리고 지운다. */
  caseMoved?: string;
}

export interface RoomBookData {
  marks: string[];
  since?: number;
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
/** 사진첩의 장수. firestore.rules의 publicRoom()과 같다(album 글자 수 상한이 이것에서 나온다). */
export const ALBUM_MAX = 24;
/** 사진첩에 올릴 수 있는 품종 id — 업적 품종만. firestore.rules의 album 모양과 같다. */
export const ALBUM_ID = /^a:[a-z0-9-]{1,40}$/;

/** 사진첩 장부를 바로잡는다. 업적 품종 id만, 겹치지 않게, ALBUM_MAX장까지. */
export function cleanAlbum(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.filter((x): x is string => typeof x === "string" && ALBUM_ID.test(x)))].slice(0, ALBUM_MAX);
}

/** 공개 문서의 사진첩 — 품종 id를 쉼표로 이은 글자 하나. 규칙이 모양을 한 번에 본다. */
export function packAlbum(album: readonly string[] | undefined): string | null {
  const ids = cleanAlbum(album);
  return ids.length ? ids.join(",") : null;
}

export function unpackAlbum(raw: unknown): string[] {
  return typeof raw === "string" ? cleanAlbum(raw.split(",")) : [];
}

/** 기념품 진열장 — 받은 기념품을 모두 담는 가구 하나(한 칸). 첫 기념품을 받으면 생긴다. */
export const SOUVENIR_CASE = "souvenir-case";
/** 진열장이 공개 문서에 싣는 기념품 수의 상한. */
export const CASE_MAX = 60;

/** 받은 기념품의 업적 품종 id들 — 받은 순서대로. */
export function souvenirIds(room: RoomData): string[] {
  return room.shown.filter((s) => s.kind === "souvenir" && typeof s.species === "string").map((s) => s.species!);
}

/** 기념품이 하나라도 있으면 진열장을 준다(옛 장부도). 이미 있으면 그대로. */
export function grantSouvenirCase(room: RoomData): RoomData {
  return souvenirIds(room).length > 0 ? grantItem(room, SOUVENIR_CASE) : room;
}

/** 진열장을 놓느라 보관함에 넣어도 되는 물건인가 — 주인이 그린 키보드·피아노 연주·특별한 책은 건드리지 않는다. */
function movable(it: string): boolean {
  return it !== KEYBOARD_ID && it !== "piano" && it !== SOUVENIR_CASE && !roomBookOf(it);
}

/**
 * 기념품 진열장을 방에 놓는다 — 한 번만(caseAuto). 빈 바닥 칸이 있으면 거기에.
 * 꽉 찼으면 물건 하나를 보관함에 넣고 그 자리에 놓는다. 고르는 차례:
 *   1. 바닥에 따로 놓은 기념품(진열장 안에 이미 있다 — 잃는 것이 없다)
 *   2. 바닥의 한 칸짜리 가구, 값이 싼 것부터
 *   3. 바닥의 두 칸짜리 가구, 값이 싼 것부터
 * 넣은 물건 id를 caseMoved에 적는다(방 화면이 알린다). 이미 놓였거나, 진열장이 없거나, 이미 한 번 놓았으면 그대로.
 */
export function autoPlaceCase(room: RoomData): { room: RoomData; moved: string | null } | null {
  if (room.caseAuto || !(room.owned[SOUVENIR_CASE] ?? 0) || room.placed.some((p) => p.it === SOUVENIR_CASE)) return null;
  const open = firstOpenSlot(room, SOUVENIR_CASE);
  if (open) {
    const placed = place(room, SOUVENIR_CASE, open);
    return placed ? { room: { ...placed, caseAuto: true }, moved: null } : null;
  }
  const price = (it: string) => FURNITURE_BY_ID.get(it)?.price ?? 0;
  const floorItems = room.placed.filter((p) => parseSlot(p.at)?.row !== "w" && movable(p.it));
  const souvenirs = floorItems.filter((p) => room.shown.some((s) => s.id === p.it && s.kind === "souvenir"));
  const size = (p: Placed) => placement(p.it, room.shown)?.size ?? 1;
  const furniture = floorItems.filter((p) => !isShownId(p.it)).sort((a, b) => size(a) - size(b) || price(a.it) - price(b.it));
  for (const p of [...souvenirs, ...furniture]) {
    const placed = place(stow(room, p.at), SOUVENIR_CASE, p.at);
    if (placed) return { room: { ...placed, caseAuto: true, caseMoved: p.it }, moved: p.it };
  }
  return null;
}

/**
 * 기념품을 받는다 — 기념품은 진열장에 담기고, 진열장이 방에 없으면 저절로 놓는다(autoPlaceCase — 꽉 찼으면 물건 하나를 보관함에).
 * where: case=진열장 안, stowed=진열장이 보관함에 있다(주인이 넣어 두었거나 놓을 자리가 끝내 없다). moved: 진열장 때문에 보관함에 넣은 물건.
 * 이미 받았거나 상한이면 null.
 */
export function receiveSouvenir(room: RoomData, speciesId: string): { room: RoomData; where: "case" | "stowed"; moved: string | null } | null {
  if (hasSouvenir(room, speciesId) || room.shown.length >= SHOWN_MAX) return null;
  const next = grantSouvenirCase({ ...room, shown: [...room.shown, { id: souvenirShownId(speciesId), kind: "souvenir", species: speciesId }] });
  if (next.placed.some((p) => p.it === SOUVENIR_CASE)) return { room: next, where: "case", moved: null };
  const auto = autoPlaceCase(next);
  return auto ? { room: auto.room, where: "case", moved: auto.moved } : { room: next, where: "stowed", moved: null };
}

/** 기념품의 전시품 id. */
export function souvenirShownId(speciesId: string): string {
  return `s:${speciesId}`;
}

/** 이 업적의 기념품을 이미 받았나. */
export function hasSouvenir(room: RoomData, speciesId: string): boolean {
  return room.shown.some((s) => s.kind === "souvenir" && s.species === speciesId);
}

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

function normalizeRoomBooks(raw: unknown): Record<string, RoomBookData> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, RoomBookData> = {};
  for (const [slug, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!roomBookOf(bookIdOf(slug)) || !v || typeof v !== "object") continue;
    const x = v as { marks?: unknown; since?: unknown };
    out[slug] = { marks: cleanMarks(x.marks), ...(typeof x.since === "number" && Number.isInteger(x.since) ? { since: x.since } : {}) };
  }
  return out;
}

/** seed는 기본 꼬마를 정한다(avatar/rules.ts의 freshAvatar). */
export function freshRoom(seed = ""): RoomData {
  return { size: 0, wall: DEFAULT_WALL, floor: DEFAULT_FLOOR, mood: DEFAULT_MOOD, bgm: DEFAULT_TRACK, music: [], placed: [], owned: {}, shown: [], keys: freshKeys(), motto: "", avatar: freshAvatar(seed) };
}

/** 방이 생기기 전에 저장된 정원, 또는 모양이 어긋난 방. */
export function normalizeRoom(raw: Partial<RoomData> | undefined, seed = ""): RoomData {
  const base = freshRoom(seed);
  if (!raw) return base;
  const size = raw.size === 1 || raw.size === 2 ? raw.size : 0;
  const room: RoomData = {
    size,
    wall: typeof raw.wall === "string" ? raw.wall : base.wall,
    floor: typeof raw.floor === "string" ? raw.floor : base.floor,
    mood: typeof raw.mood === "string" ? raw.mood : base.mood,
    bgm: canUseTrack(raw.bgm, ownedMusic(raw.music)) ? raw.bgm : base.bgm,
    music: ownedMusic(raw.music),
    placed: Array.isArray(raw.placed) ? raw.placed.filter((p) => p && typeof p.at === "string" && typeof p.it === "string") : [],
    owned: raw.owned && typeof raw.owned === "object" ? raw.owned : {},
    shown: Array.isArray(raw.shown) ? raw.shown.filter((s) => s && typeof s.id === "string") : [],
    keys: normalizeKeys(raw.keys),
    pianoSongs: Object.fromEntries(Object.entries(raw.pianoSongs ?? {}).filter(([id]) => /^[0-8]$/.test(id)).map(([id, song]) => [id, pianoSong(song)])),
    pianos: Object.fromEntries(Object.entries(raw.pianos ?? {}).filter(([id]) => /^[0-8]$/.test(id)).map(([id, notes]) => [id, pianoNotes(notes)])),
    keyboards: Object.fromEntries(Object.entries(raw.keyboards ?? {}).filter(([id]) => /^[1-8]$/.test(id)).map(([id, keys]) => [id, normalizeKeys(keys)])),
    motto: typeof raw.motto === "string" ? cleanMotto(raw.motto) : "",
    avatar: normalizeAvatar(raw.avatar, seed),
    books: normalizeRoomBooks(raw.books),
    album: cleanAlbum(raw.album),
    ...(raw.caseAuto === true ? { caseAuto: true } : {}),
    ...(typeof raw.caseMoved === "string" && raw.caseMoved.length <= 80 ? { caseMoved: raw.caseMoved } : {}),
  };
  // 옛 방의 여러 키보드는 같은 키를 보였다. 각각 복사해서 독립시킨다.
  const used = new Set<number>();
  room.placed = room.placed.map((p) => {
    if (p.it !== KEYBOARD_ID) return p;
    const id = Number.isInteger(p.kb) && p.kb! >= 0 && p.kb! < OWN_MAX && !used.has(p.kb!)
      ? p.kb! : Array.from({ length: OWN_MAX }, (_, i) => i).find((i) => !used.has(i));
    if (id === undefined) return p;
    used.add(id);
    if (id > 0 && !room.keyboards![id]) room.keyboards![id] = room.keys.map((k) => ({ ...k }));
    return { ...p, kb: id };
  });
  const pianos = new Set<number>();
  room.placed = room.placed.map((p) => {
    if (p.it !== "piano") return p;
    const id = Number.isInteger(p.kb) && p.kb! >= 0 && p.kb! < OWN_MAX && !pianos.has(p.kb!) ? p.kb! : Array.from({ length: OWN_MAX }, (_, i) => i).find((i) => !pianos.has(i));
    if (id === undefined) return p;
    pianos.add(id);
    return { ...p, kb: id };
  });
  return room;
}

/** 키보드별 키. 0번의 기존 저장 형식을 보존한다. */
export function keyboardKeys(room: RoomData, id = 0): RoomKey[] {
  return id === 0 ? room.keys : room.keyboards?.[id] ?? room.keys;
}

export function keyboardBanks(room: RoomData): Array<{ id: number; keys: RoomKey[] }> {
  return [{ id: 0, keys: room.keys }, ...Object.entries(room.keyboards ?? {}).map(([id, keys]) => ({ id: Number(id), keys }))];
}

export function withKeyboardKeys(room: RoomData, id: number, keys: RoomKey[]): RoomData {
  if (!Number.isInteger(id) || id < 0 || id >= OWN_MAX) return room;
  return id === 0 ? { ...room, keys: normalizeKeys(keys) }
    : { ...room, keyboards: { ...room.keyboards, [id]: normalizeKeys(keys) } };
}

/** 이 녹음을 다른 키보드도 가리키는가(옛 방 이전 때만 공유 가능). */
export function sharedRecording(room: RoomData, id: number, slot: number, ver: number): boolean {
  return keyboardBanks(room).some((b) => b.id !== id && b.keys[slot]?.sound === "rec" && b.keys[slot].ver === ver);
}

/** 방 전체에서 새 녹음 판을 고른다. 키보드끼리 Storage 주소가 겹치지 않는다. */
export function nextRecordingVer(room: RoomData): number {
  const max = Math.max(...keyboardBanks(room).flatMap((b) => b.keys.map((k) => k.ver)));
  if (max >= KEY_VER_MAX) throw new Error("녹음 판 번호를 모두 사용했어요");
  return max + 1;
}

/** 치운 키보드의 녹음 표시와 실제로 지울 파일. 이전한 방의 공유 녹음은 마지막 참조까지 보존한다. */
export function recordingCleanup(room: RoomData, shareOn: boolean) {
  const banks = keyboardBanks(room);
  const placed = new Set(room.placed.filter((p) => p.it === KEYBOARD_ID).map((p) => p.kb ?? 0));
  const targets = banks.flatMap((b) => shareOn && placed.has(b.id) ? []
    : recSlots(b.keys).map((slot) => ({ keyboard: b.id, slot, ver: b.keys[slot].ver })));
  const protectedRefs = new Set(banks.filter((b) => shareOn && placed.has(b.id))
    .flatMap((b) => recSlots(b.keys).map((slot) => `${slot}-${b.keys[slot].ver}`)));
  const deletions = targets.filter((r) => !protectedRefs.has(`${r.slot}-${r.ver}`))
    .filter((r, i, all) => all.findIndex((x) => x.slot === r.slot && x.ver === r.ver) === i);
  return { targets, deletions };
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

/** 놓는 곳과 크기. 놓을 수 없는 것(벽지·연출·모르는 id)은 null. 박제는 벽에도 바닥에도(any). */
export function placement(it: string, shown: readonly Shown[]): { on: "wall" | "floor" | "any"; size: 1 | 2 } | null {
  if (isShownId(it)) {
    const s = shown.find((x) => x.id === it);
    if (!s) return null;
    return { on: s.kind === "frame" ? "wall" : s.kind === "trophy" || s.kind === "souvenir" ? "any" : "floor", size: 1 };
  }
  const f = FURNITURE_BY_ID.get(it);
  if (!f) return null;
  if (f.kind === "wall" || f.kind === "window" || f.kind === "frame-blank") return { on: "wall", size: f.size };
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
  if (it === "piano") {
    const used = new Set(room.placed.filter((p) => p.it === "piano").map((p) => p.kb ?? 0));
    const kb = Array.from({ length: OWN_MAX }, (_, i) => i).find((i) => !used.has(i));
    if (kb === undefined) return null;
    return { ...room, placed: [...room.placed, { at, it, kb }] };
  }
  if (it === KEYBOARD_ID) {
    const used = new Set(room.placed.filter((p) => p.it === KEYBOARD_ID).map((p) => p.kb ?? 0));
    const kb = Array.from({ length: OWN_MAX }, (_, i) => i).find((i) => !used.has(i));
    if (kb === undefined) return null;
    const next = kb > 0 && !room.keyboards?.[kb] ? withKeyboardKeys(room, kb, freshKeys()) : room;
    return { ...next, placed: [...next.placed, { at, it, kb }] };
  }
  return { ...room, placed: [...room.placed, { at, it }] };
}

export function move(room: RoomData, from: string, to: string): RoomData | null {
  const item = room.placed.find((p) => p.at === from);
  if (!item || from === to || !canPlace(room, item.it, to, from)) return null;
  return { ...room, placed: room.placed.map((p) => (p.at === from ? { ...p, at: to } : p)) };
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
  const keyboards = new Set<number>();
  const pianos = new Set<number>();
  for (const p of room.placed) {
    if (p.it === KEYBOARD_ID || p.it === "piano") {
      const bank = p.it === "piano" ? pianos : keyboards;
      const id = p.kb ?? 0;
      if (!Number.isInteger(id) || id < 0 || id >= OWN_MAX || bank.has(id)) return false;
      bank.add(id);
    }
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
/** 선물로 하나 더 준다(잡초 O/X 퀴즈). 한 가지를 OWN_MAX개까지만 — 넘으면 null. */
export function giftItem(room: RoomData, id: string): RoomData | null {
  const have = room.owned[id] ?? 0;
  return have >= OWN_MAX ? null : { ...room, owned: { ...room.owned, [id]: have + 1 } };
}

export function grantItem(room: RoomData, id: string): RoomData {
  return (room.owned[id] ?? 0) > 0 ? room : { ...room, owned: { ...room.owned, [id]: 1 } };
}

/** 서재 세트 — 특별한 책을 3·5·7권 가지면 받는 것(room/library.ts의 LIBRARY_SETS). 이미 받았으면 그대로. */
export function grantLibrarySets(room: RoomData): RoomData {
  const n = booksOwned(room.owned);
  return LIBRARY_SETS.reduce((r, set) => (n >= set.books ? grantItem(r, set.item) : r), room);
}

/** 특별한 책을 처음 들인 날(장서표). 이미 있으면 그대로. */
export function stampBookSince(room: RoomData, id: string, day: number): RoomData {
  const book = roomBookOf(id);
  if (!book || room.books?.[book.slug]?.since !== undefined) return room;
  const prev = room.books?.[book.slug] ?? { marks: [] };
  return { ...room, books: { ...room.books, [book.slug]: { ...prev, since: day } } };
}

export type BuyRefusal = "unknown" | "off-sale" | "owned" | "full" | "jam";

/** 음원은 한 번만 산다. 현재 방 음악은 구매만으로 바꾸지 않는다. */
export function buyMusic(room: RoomData, jam: number, id: string): { room: RoomData; jam: number } | "unknown" | "owned" | "jam" {
  const t = purchasedTrack(id);
  if (!t) return "unknown";
  const owned = ownedMusic(room.music);
  if (owned.includes(t.id)) return "owned";
  if (!Number.isFinite(jam) || jam < t.price) return "jam";
  return { room: { ...room, music: [...owned, t.id] }, jam: jam - t.price };
}

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
  // 보관함의 틀부터 쓴다. 남은 틀이 모두 벽에 걸렸다면 그 자리에서 쪽지를 채운다.
  const usedAt = !bought && stowedCount(room, FRAME_BLANK) === 0
    ? room.placed.find((p) => p.it === FRAME_BLANK)?.at
    : undefined;
  const base = usedAt ? stow(room, usedAt) : room;
  const id = `f:${noteId}`;
  const added = addShown({ ...base, owned }, { id, kind: "frame", species: speciesId, note: noteId });
  if (!added) return null;
  const next = usedAt
    ? { ...added.room, placed: [...added.room.placed.filter((p) => p.it !== id), { at: usedAt, it: id }] }
    : added.room;
  return { room: next, jam: bought ? jam - blank.price : jam, at: usedAt ?? added.at, bought };
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
      const book = roomBookOf(p.it);
      const bookData = book ? room.books?.[book.slug] : undefined;
      if (short(p.it)) placed.push({
        a: p.at,
        i: p.it,
        // 기념품 진열장 — 담긴 기념품(업적 품종 id)을 쉼표로 이은 글자 하나. 손님 화면이 품종표에 있는 것만 꺼낸다.
        ...(p.it === SOUVENIR_CASE && souvenirIds(room).length ? { sv: souvenirIds(room).slice(0, CASE_MAX).join(",") } : {}),
        ...(p.it === KEYBOARD_ID ? { kb: p.kb ?? 0 } : p.it === "piano" ? { pn: pianoNotes(room.pianos?.[p.kb ?? 0]), ps: pianoSong(room.pianoSongs?.[p.kb ?? 0]) } : {}),
        // 특별한 책 — 펼쳐 둔 문장(id)과 들인 날. 손님이 독서대에서 본다.
        ...(bookData?.marks.length ? { bm: cleanMarks(bookData.marks) } : {}),
        ...(bookData?.since !== undefined ? { bd: bookData.since } : {}),
      });
      continue;
    }
    const s = room.shown.find((x) => x.id === p.it);
    if (!s || !short(s.species)) continue;
    if (s.kind === "trophy" || s.kind === "souvenir") {
      // 박제는 악초 종류 id만, 기념품은 업적 품종 id만. 보는 화면이 표에서 이름·그림을 읽는다.
      placed.push({ a: p.at, k: s.kind, s: s.species! });
    } else if (s.kind === "frame") {
      if (s.note && s.note.length <= 120) placed.push({ a: p.at, k: "frame", s: s.species!, n: s.note });
    } else {
      placed.push({ a: p.at, k: s.kind, s: s.species!, m: s.mut ?? [] });
    }
  }
  // 키보드는 방에 놓였을 때만 싣는다 — 그림·소리 id·녹음 판 번호뿐이다(keyboard.ts의 publicKeys).
  const keys = placed.some((p) => "i" in p && p.i === KEYBOARD_ID && (p.kb ?? 0) === 0) ? { keys: publicKeys(room.keys) } : {};
  const keyboards = Object.fromEntries(room.placed.filter((p) => p.it === KEYBOARD_ID && (p.kb ?? 0) > 0)
    .map((p) => [p.kb!, packKeyboard(keyboardKeys(room, p.kb))]));
  const motto = room.motto ? { motto: room.motto } : {};
  // 꼬마는 문자열 하나. 끈 꼬마는 싣지 않고, 가지지 않은 옷은 기본으로 바꿔 싣는다(avatar/rules.ts의 packAvatar).
  const packed = room.avatar ? packAvatar(room.avatar, roomWidth(room.size)) : null;
  const avatar = packed ? { avatar: packed } : {};
  const albumText = packAlbum(room.album);
  const album = albumText ? { album: albumText } : {};
  return { size: room.size, wall: room.wall, floor: room.floor, mood: room.mood, bgm: room.bgm, placed, ...keys, ...(Object.keys(keyboards).length ? { keyboards } : {}), ...motto, ...avatar, ...album };
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
  const avatar = avatarFromPublic(pub.avatar);
  // 사진첩은 품종표에 있는 업적 품종만(남의 공개 문서에는 아무 값이나 담길 수 있다).
  const album = unpackAlbum(pub.album).filter((id) => byId.has(id));
  let room: RoomData = { size, wall, floor, mood, bgm, placed: [], owned: {}, shown: [], keys: keysFromPublic(pub.keys), motto: typeof pub.motto === "string" ? cleanMotto(pub.motto) : "", ...(avatar && avatarSlotOk(avatar.at, roomWidth(size)) ? { avatar } : {}), ...(album.length ? { album } : {}) };
  pub.placed.slice(0, PUBLIC_PLACED_MAX).forEach((p, n) => {
    if ("i" in p) {
      // 남의 방은 가진 수를 모른다. 놓인 만큼 가졌다고 본다.
      const owned = { ...room.owned, [p.i]: (room.owned[p.i] ?? 0) + 1 };
      const next = place({ ...room, owned }, p.i, p.a);
      if (next) {
        room = next;
        const book = roomBookOf(p.i);
        if (book && (p.bm || p.bd !== undefined)) {
          room = { ...room, books: { ...room.books, [book.slug]: { marks: cleanMarks(p.bm), ...(typeof p.bd === "number" ? { since: p.bd } : {}) } } };
        }
        if (p.i === SOUVENIR_CASE && typeof p.sv === "string") {
          // 진열장 안의 기념품 — 방에 놓이지 않은 전시품으로 되살린다. 업적 품종이고 품종표에 있는 것만.
          const ids = [...new Set(p.sv.split(","))].filter((id) => /^a:[a-z0-9-]{1,40}$/.test(id) && byId.has(id)).slice(0, CASE_MAX);
          room = { ...room, shown: [...room.shown, ...ids.filter((id) => !hasSouvenir(room, id)).map((id): Shown => ({ id: `v:case:${id}`, kind: "souvenir", species: id }))] };
        }
        if (p.i === "piano") {
          const id = room.placed.at(-1)!.kb ?? 0;
          room = { ...room, pianos: { ...room.pianos, [id]: pianoNotes(p.pn) }, pianoSongs: { ...room.pianoSongs, [id]: pianoSong(p.ps) } };
        }
        if (p.i === KEYBOARD_ID) {
          const id = room.placed.at(-1)!.kb ?? 0;
          const source = typeof p.kb === "number" ? p.kb : 0;
          room = withKeyboardKeys(room, id, source === 0 ? keysFromPublic(pub.keys) : unpackKeyboard(pub.keyboards?.[source]));
        }
      }
      return;
    }
    if (p.k === "trophy") {
      if (!isRaidKind(p.s)) return;
      const shown: Shown = { id: `v:${n}`, kind: "trophy", species: p.s };
      const next = place({ ...room, shown: [...room.shown, shown] }, shown.id, p.a);
      if (next) room = next;
      return;
    }
    if (p.k === "souvenir") {
      // 기념품은 품종표에 있는 업적 품종만.
      if (!p.s.startsWith("a:") || !byId.has(p.s)) return;
      const shown: Shown = { id: `v:${n}`, kind: "souvenir", species: p.s };
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
