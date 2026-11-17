import { hash, rng } from "../rules";
import type { Species } from "../types";
import { ROOM_BOOKS, type RoomBook } from "./books";

/**
 * 특별한 책(상점 '특별한 책', 한 권 100,000잼)의 혜택 — 순수 함수만 둔다(library.test.ts).
 * 설계는 docs/garden-miniroom.md "특별한 책 혜택".
 *
 * ★ 요약은 잼통 사이트에서 누구나 읽는다. 책을 산 사람에게는 정보를 잠가 주는 대신, 바깥에서 할 수 없는 경험을 준다 —
 *   책에게 묻기(AI)·낭독·완독 도장·고른 문장·빌려 읽기·책 씨앗·장 카드·서재 세트.
 * ★ 대부분 방에 **놓은** 책에서만 된다(가지고만 있으면 안 된다). 고른 문장·장서표는 손님에게도 보인다.
 * ★ 잼 이자와 소장 번호는 두지 않는다(2026-11-17 결정).
 */

export type BookSlug = RoomBook["slug"];

export const BOOK_PREFIX = "book-";

export function bookIdOf(slug: string): string {
  return `${BOOK_PREFIX}${slug}`;
}

/** 가구 id가 특별한 책이면 그 책. */
export function roomBookOf(id: string): RoomBook | undefined {
  if (!id.startsWith(BOOK_PREFIX)) return undefined;
  const slug = id.slice(BOOK_PREFIX.length);
  return ROOM_BOOKS.find((b) => b.slug === slug);
}

// ── 책에게 묻기 ──────────────────────────────────────────────────────

/** 한 번 묻는 데 드는 잼. */
export const BOOK_ASK_JAM = 100;
/** 책마다 하루에 물을 수 있는 수. 서버(api/book-ask)가 같은 값을 지킨다. */
export const BOOK_ASK_PER_DAY = 3;
export const BOOK_ASK_MAX_CHARS = 200;

// ── 고른 문장 ─────────────────────────────────────────────────────────

/** 책마다 독서대에 펼쳐 두는 문장(쉽게 보기 토막) 수. */
export const BOOK_MARKS_MAX = 3;
/** 토막 id의 모양. 공개 문서에 실리는 값이라 짧고 정해진 글자만. */
export const BOOK_MARK_ID = /^[a-z0-9-]{1,24}$/;

export function cleanMarks(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.filter((x): x is string => typeof x === "string" && BOOK_MARK_ID.test(x)))].slice(0, BOOK_MARKS_MAX);
}

// ── 빌려 읽기 ─────────────────────────────────────────────────────────

/** 손님 한 사람이 내 책을 빌려 읽으면(하루 한 번) 주인이 받는 잼. */
export const LEND_JAM = 50;
/** 하루에 잼을 받는 손님 수 상한 — 500잼. */
export const LEND_PER_DAY = 10;

// ── 서재 세트 ─────────────────────────────────────────────────────────

/** 가진 책 수에 따라 받는 것. 팔지 않는다(catalog.ts의 cur: "reward"). */
export const LIBRARY_SETS = [
  { books: 3, item: "wp-library", label: "서재 벽지" },
  { books: 5, item: "lamp-reading", label: "서재 독서등" },
  { books: 7, item: "shelf-complete", label: "완전한 서재 책장" },
] as const;

// ── 장부 ─────────────────────────────────────────────────────────────

export interface LibraryLedger {
  /** 책마다 완독 도장을 찍은 장(장 slug). */
  read: Record<string, string[]>;
  /** 책마다 마지막으로 책 씨앗을 받은 날(한국 날짜 번호). */
  seedDay: Record<string, number>;
  /** 오늘 책마다 물은 수 — 화면이 남은 수를 보이려고 적는다. 지키는 것은 서버다. */
  asks: { day: number; n: Record<string, number> };
  /** 오늘 잼을 준 빌려 읽은 손님(uid). */
  lent: { day: number; uids: string[] };
}

export function freshLibrary(): LibraryLedger {
  return { read: {}, seedDay: {}, asks: { day: 0, n: {} }, lent: { day: 0, uids: [] } };
}

const isRecord = (v: unknown): v is Record<string, unknown> => Boolean(v) && typeof v === "object" && !Array.isArray(v);

export function normalizeLibrary(raw: unknown): LibraryLedger {
  const base = freshLibrary();
  if (!isRecord(raw)) return base;
  const read: Record<string, string[]> = {};
  if (isRecord(raw.read)) for (const [k, v] of Object.entries(raw.read)) if (Array.isArray(v)) read[k] = [...new Set(v.filter((x): x is string => typeof x === "string"))];
  const seedDay: Record<string, number> = {};
  if (isRecord(raw.seedDay)) for (const [k, v] of Object.entries(raw.seedDay)) if (typeof v === "number") seedDay[k] = v;
  const asks = isRecord(raw.asks) && typeof raw.asks.day === "number" && isRecord(raw.asks.n)
    ? { day: raw.asks.day, n: Object.fromEntries(Object.entries(raw.asks.n).filter((e): e is [string, number] => typeof e[1] === "number")) }
    : base.asks;
  const lent = isRecord(raw.lent) && typeof raw.lent.day === "number" && Array.isArray(raw.lent.uids)
    ? { day: raw.lent.day, uids: raw.lent.uids.filter((x): x is string => typeof x === "string").slice(0, LEND_PER_DAY) }
    : base.lent;
  return { read, seedDay, asks, lent };
}

/** 오늘 이 책에 물은 수. */
export function asksToday(lib: LibraryLedger, slug: string, day: number): number {
  return lib.asks.day === day ? (lib.asks.n[slug] ?? 0) : 0;
}

/** 다 읽은 책인가 — 모든 장에 도장. */
export function bookDone(lib: LibraryLedger, book: RoomBook): boolean {
  return (lib.read[book.slug]?.length ?? 0) >= book.chapters;
}

export function booksDone(lib: LibraryLedger): number {
  return ROOM_BOOKS.filter((b) => bookDone(lib, b)).length;
}

/** 가진 특별한 책의 수(놓았든 아니든). */
export function booksOwned(owned: Record<string, number>): number {
  return ROOM_BOOKS.filter((b) => (owned[bookIdOf(b.slug)] ?? 0) > 0).length;
}

/**
 * 빌려 읽은 손님에게서 지금 받을 잼. readers=오늘 빌려 읽은 손님(uid), 이미 받은 사람은 빼고 하루 상한까지.
 */
export function lendClaim(lib: LibraryLedger, readers: readonly string[], day: number): { uids: string[]; jam: number } {
  const paid = lib.lent.day === day ? lib.lent.uids : [];
  const room = Math.max(0, LEND_PER_DAY - paid.length);
  const uids = [...new Set(readers)].filter((u) => !paid.includes(u)).slice(0, room);
  return { uids, jam: uids.length * LEND_JAM };
}

// ── 책 씨앗 ──────────────────────────────────────────────────────────

/**
 * 오늘의 책 씨앗 — 놓아 둔 책마다 하루 하나. 그 책이 나온 해까지 시작된 업적의 씨앗에서 고른다
 * (품종의 since = 그 업적 연표의 첫 해). 그런 업적이 없으면 업적 씨앗 전체에서.
 * 같은 사람·같은 날·같은 책이면 같은 씨앗이다(무작위가 아니라 정해진 뽑기).
 */
export function bookSeed(book: RoomBook, day: number, who: string, catalog: readonly Species[]): Species | undefined {
  const deeds = catalog.filter((s) => s.id.startsWith("a:") && (s.tier === "flagship" || s.tier === "perennial"));
  const era = deeds.filter((s) => s.since !== undefined && s.since <= book.year);
  const pool = era.length > 0 ? era : deeds;
  if (pool.length === 0) return undefined;
  const roll = rng(hash(`book-seed:${book.slug}:${day}:${who}`));
  return pool[Math.floor(roll() * pool.length)];
}

/** 칭호(rules.ts의 titleCounts)에 넘기는 책의 두 수. */
export function bookTitleInput(lib: LibraryLedger, owned: Record<string, number>): { booksRead: number; booksOwned: number } {
  return { booksRead: booksDone(lib), booksOwned: booksOwned(owned) };
}

/** 그 책이 오늘 씨앗을 줄 수 있는가. */
export function seedReady(lib: LibraryLedger, slug: string, day: number): boolean {
  return (lib.seedDay[slug] ?? -1) !== day;
}
