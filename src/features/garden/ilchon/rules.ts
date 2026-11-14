import { MUTATION, MUTATION_ORDER } from "../rules";
import type { Mutation, Species } from "../types";
import { ROOM_SIZES } from "../room/catalog";

/**
 * 1촌의 규칙 — 순수 함수와 표만 둔다. 설계는 docs/garden-miniroom.md §5.
 *
 * ★ 여기 있는 수 가운데 firestore.rules가 지키는 것은 규칙 파일에도 같은 값으로 적혀 있다
 *   (이름표 수, 문구 수, 스티커 수, 글 길이, 소식 수, 공개 1촌 목록 수). ilchon/rules.test.ts가 짝을 본다.
 * ★ 1촌 수·보낸 신청 수의 상한은 규칙이 세지 못한다(문서를 셀 길이 없다). 화면이 지킨다.
 *   넘겨서 얻는 것은 1촌이 더 많은 것뿐이고, 1촌 수에는 보상이 없다(§5.2).
 */

/** 1촌은 50명까지. */
export const ILCHON_MAX = 50;
/** 보낸 신청은 동시에 10건까지. */
export const SENT_MAX = 10;
/** 방명록·1촌평에 직접 쓰는 글의 길이. firestore.rules의 lineOk()와 같다. */
export const TEXT_MAX = 60;
/** 방명록은 최근 30개를 보인다. */
export const GUESTBOOK_SHOWN = 30;
/** 공개 문서의 소식은 최근 5개. firestore.rules의 publicGarden()과 같다. */
export const NEWS_MAX = 5;
/** "아무 방이나"는 최근에 고쳐진 공개 방 스무 곳 중 하나. */
export const RANDOM_POOL = 20;
/** 1촌 방 문서는 탭이 열려 있어도 10분에 한 번만 다시 읽는다(§5.5 읽기 비용). */
export const FRIENDS_REFRESH = 10 * 60_000;
/** 1촌에게 준 물은 남은 시간을 15% 줄인다(아무 공개 정원은 rules.ts의 WATER_CUT, 10%). */
export const WATER_CUT_ILCHON = 0.15;
/** 차단 목록 상한. 장부가 끝없이 커지지 않게. */
export const BLOCK_MAX = 100;

/** 1촌 이름표. 글을 짓지 않고 고른다. 번호가 공개 문서에 실린다 — 순서를 바꾸지 않고 뒤에만 더한다. */
export const TAGS = ["씨앗 친구", "물 친구", "잡초 전우", "광장 동지", "옆 텃밭", "꽃밭 이웃", "도감 친구", "단비 친구"] as const;

/** 정해 둔 문구. 번호가 문서에 실린다 — 순서를 바꾸지 않고 뒤에만 더한다(규칙의 상한도 함께). */
export const PHRASES = [
  "구경 잘 했어요",
  "물 주고 가요",
  "방이 예뻐요",
  "황금 화분 부러워요",
  "같이 잡초 잡아요",
  "오늘도 좋은 하루예요",
  "또 놀러 올게요",
  "텃밭이 잘 자라요",
  "도감 대단해요",
  "액자 잘 봤어요",
  "쪽지 하나 읽고 가요",
  "단비 때 만나요",
  "별똥별 같이 봐요",
  "거대 잡초 같이 쳐요",
  "꽃밭에서 만나요",
  "광장에서 봤어요",
  "1촌 해요",
  "반가워요",
  "고마워요",
  "응원해요",
  "푹 쉬어요",
  "좋은 아침이에요",
  "좋은 밤 보내요",
  "기분 좋은 방이에요",
  "가구 센스 최고예요",
  "새 품종 축하해요",
  "변이 축하해요",
  "꾸준함 멋져요",
  "다음엔 물 많이 줄게요",
  "다녀갑니다",
] as const;

/** 스티커. 그림이 아니라 글자 이모지라 따로 그리지 않는다. */
export const STICKERS = [
  { icon: "🌱", label: "새싹" },
  { icon: "🌸", label: "꽃" },
  { icon: "🍓", label: "딸기" },
  { icon: "🚿", label: "물뿌리개" },
  { icon: "☀️", label: "햇살" },
  { icon: "🌧", label: "단비" },
  { icon: "🌠", label: "별똥별" },
  { icon: "🍯", label: "잼" },
  { icon: "🐝", label: "꿀벌" },
  { icon: "🐿", label: "다람쥐" },
  { icon: "💌", label: "편지" },
  { icon: "👏", label: "박수" },
] as const;

/** 방명록 받기. 기본은 모두. */
export type GuestbookMode = "all" | "ilchon" | "off";
export const GUESTBOOK_MODES: Array<{ id: GuestbookMode; label: string }> = [
  { id: "all", label: "모두" },
  { id: "ilchon", label: "1촌만" },
  { id: "off", label: "받지 않기" },
];

/** 내 정원 장부의 1촌 칸(store.ts의 GardenData.ilchon). 1촌 목록의 진짜는 Firestore에 있고 이것은 사본이다. */
export interface IlchonData {
  /** 신청 받기. */
  accept: boolean;
  /** 내 1촌 보이기(기본 꺼짐). 켜면 공개 문서에 1촌의 공개 id와 이름만 싣는다. */
  show: boolean;
  guestbook: GuestbookMode;
  /** 1촌 목록 사본. 1촌 탭을 열 때 Firestore에서 다시 받는다. tag는 내가 붙인 이름표. */
  friends: Friend[];
  /** 보낸 신청. 수락·거절은 상대가 하므로 1촌 탭이 열릴 때 맞춘다. */
  sent: Array<{ g: string; n: string; tag: number; at: number }>;
  /** 차단한 사람. 진짜는 gardens/{내 id}/blocks에 있고 규칙이 본다. 이름은 목록에 그릴 사본. */
  blocked: Array<{ uid: string; n: string }>;
  /** 방명록을 마지막으로 본 때. 새 소식의 "새 방명록" 수를 센다. */
  seenGb: number;
}

export interface Friend {
  uid: string;
  /** 1촌의 공개 id. */
  g: string;
  /** 이름 사본(맺을 때). 화면은 1촌 방 문서의 이름을 먼저 쓴다. */
  n: string;
  tag: number;
  at: number;
}

export function freshIlchon(): IlchonData {
  return { accept: true, show: false, guestbook: "all", friends: [], sent: [], blocked: [], seenGb: 0 };
}

/** 1촌이 생기기 전에 저장된 정원, 또는 모양이 어긋난 칸. */
export function normalizeIlchon(raw: Partial<IlchonData> | undefined): IlchonData {
  const base = freshIlchon();
  if (!raw || typeof raw !== "object") return base;
  const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  return {
    accept: typeof raw.accept === "boolean" ? raw.accept : base.accept,
    show: typeof raw.show === "boolean" ? raw.show : base.show,
    guestbook: GUESTBOOK_MODES.some((m) => m.id === raw.guestbook) ? raw.guestbook! : base.guestbook,
    friends: arr<Friend>(raw.friends).filter((f) => f && typeof f.uid === "string" && typeof f.g === "string").slice(0, ILCHON_MAX),
    sent: arr<IlchonData["sent"][number]>(raw.sent).filter((s) => s && typeof s.g === "string").slice(0, SENT_MAX),
    blocked: arr<IlchonData["blocked"][number]>(raw.blocked).filter((b) => b && typeof b.uid === "string").slice(0, BLOCK_MAX),
    seenGb: typeof raw.seenGb === "number" ? raw.seenGb : 0,
  };
}

export function tagLabel(tag: number): string {
  return TAGS[tag] ?? TAGS[0];
}

export function validTag(tag: unknown): tag is number {
  return typeof tag === "number" && Number.isInteger(tag) && tag >= 0 && tag < TAGS.length;
}

// ── 한 줄(방명록·1촌평) ──────────────────────────────────────────────

/**
 * 한 줄. p=정해 둔 문구 번호(직접 쓴 글이면 -1), x=직접 쓴 글(문구를 골랐으면 ""), k=스티커 번호.
 * 둘 중 하나만 있다 — 규칙(lineOk)이 같은 것을 본다.
 */
export interface Line {
  p: number;
  x: string;
  k: number;
}

/** 저장된 한 줄을 읽는다. 모양이 틀렸으면 null — 공개 문서처럼 아무 값이나 담길 수 있다. */
export function readLine(raw: { p?: unknown; x?: unknown; k?: unknown }): Line | null {
  const { p, x, k } = raw;
  if (typeof p !== "number" || typeof x !== "string" || typeof k !== "number") return null;
  if (!Number.isInteger(k) || k < 0 || k >= STICKERS.length) return null;
  if (p === -1) return x.length >= 1 && x.length <= TEXT_MAX ? { p, x, k } : null;
  return Number.isInteger(p) && p >= 0 && p < PHRASES.length && x === "" ? { p, x, k } : null;
}

/** 한 줄의 글. 문구면 표에서, 아니면 직접 쓴 글 그대로(그리는 쪽은 글로만 그린다). */
export function lineText(line: Line): string {
  return line.p >= 0 ? PHRASES[line.p] : line.x;
}

/** 방명록 문서 id. 한 사람이 한 방에 하루 한 번 — 규칙이 id를 본다. */
export function guestbookId(uid: string, day: number): string {
  return `${uid}_${day}`;
}

/** 방명록을 남길 수 있는가. 주인이 고른 받기와 1촌인지로만 정한다(규칙의 guestbookOpen()과 같다). */
export function canSign(mode: GuestbookMode, isFriend: boolean): boolean {
  return mode === "all" || (mode === "ilchon" && isFriend);
}

// ── 1촌 소식 ─────────────────────────────────────────────────────────

/**
 * 소식은 글이 아니라 종류 번호다(§5.2). k=종류, s=품종 id, m=변이 id 또는 방 크기, t=때.
 * 읽는 화면이 표에서 문장을 만든다. 번호는 공개 문서에 실린다 — 순서를 바꾸지 않는다.
 */
export const NEWS_KINDS = ["species", "mutant", "room"] as const;
export type NewsKind = (typeof NEWS_KINDS)[number];

export interface NewsEntry {
  k: number;
  s: string;
  m?: string;
  t: number;
}

export function newsEntry(kind: NewsKind, s: string, t: number, m?: string): NewsEntry {
  return { k: NEWS_KINDS.indexOf(kind), s, t, ...(m ? { m } : {}) };
}

/** 소식을 맨 앞에 더한다. 같은 소식(종류·품종·변이)은 하나만, 최근 NEWS_MAX개. */
export function pushNews(news: readonly NewsEntry[], entry: NewsEntry): NewsEntry[] {
  const same = (a: NewsEntry) => a.k === entry.k && a.s === entry.s && a.m === entry.m;
  return [entry, ...news.filter((n) => !same(n))].slice(0, NEWS_MAX);
}

/** 공개 문서의 소식 목록을 읽는다. 모양이 맞는 것만. */
export function readNews(raw: unknown): NewsEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: NewsEntry[] = [];
  for (const item of raw.slice(0, NEWS_MAX)) {
    if (!item || typeof item !== "object") continue;
    const n = item as Record<string, unknown>;
    if (typeof n.k !== "number" || typeof n.s !== "string" || typeof n.t !== "number") continue;
    out.push({ k: n.k, s: n.s, t: n.t, ...(typeof n.m === "string" ? { m: n.m } : {}) });
  }
  return out;
}

/**
 * 소식 한 줄. 품종표에 없는 품종, 모르는 종류·변이는 null — 그리지 않는다.
 * 글은 모두 이 표에서 나온다. 공개 문서의 글자가 화면에 그대로 나오지 않는다.
 */
export function newsText(entry: NewsEntry, byId: ReadonlyMap<string, Species>): string | null {
  const kind = NEWS_KINDS[entry.k];
  if (kind === "room") {
    const size = ROOM_SIZES[Number(entry.m)];
    return size && Number(entry.m) > 0 ? `방을 「${size.label}」으로 넓혔어요` : null;
  }
  const species = byId.get(entry.s);
  if (!species) return null;
  if (kind === "species") return `새 품종 「${species.title}」을 거뒀어요`;
  if (kind === "mutant") {
    const m = entry.m as Mutation | undefined;
    if (!m || !MUTATION_ORDER.includes(m)) return null;
    return `${MUTATION[m].label} 화분 「${species.title}」을 놓았어요`;
  }
  return null;
}

// ── 마실 ─────────────────────────────────────────────────────────────

/**
 * "아무 방이나". 최근에 고쳐진 순서로 받은 방들에서 가린 방·내 방을 빼고, 앞의 RANDOM_POOL곳 중 하나.
 * 고를 곳이 없으면 null.
 */
export function pickRandomRoom(
  rooms: ReadonlyArray<{ gid: string; hidden: boolean; mine: boolean }>,
  random: () => number = Math.random,
): string | null {
  const pool = rooms.filter((r) => !r.hidden && !r.mine).slice(0, RANDOM_POOL);
  if (pool.length === 0) return null;
  return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))].gid;
}

/** 1촌 신청을 보낼 수 있는가. 못 하면 그 까닭. */
export type KnockRefusal = "closed" | "self" | "friend" | "sent" | "sent-full" | "friends-full";

export function knockRefusal(d: {
  myGid: string | null;
  shareOn: boolean;
  target: string;
  friends: readonly Friend[];
  sent: IlchonData["sent"];
}): KnockRefusal | null {
  if (!d.shareOn || !d.myGid) return "closed";
  if (d.target === d.myGid) return "self";
  if (d.friends.some((f) => f.g === d.target)) return "friend";
  if (d.sent.some((s) => s.g === d.target)) return "sent";
  if (d.sent.length >= SENT_MAX) return "sent-full";
  if (d.friends.length >= ILCHON_MAX) return "friends-full";
  return null;
}

export const KNOCK_REFUSAL_TEXT: Record<KnockRefusal, string> = {
  closed: "내 방을 열어야 1촌 신청을 할 수 있어요",
  self: "내 방이에요",
  friend: "이미 1촌이에요",
  sent: "신청을 보냈어요 · 기다리는 중",
  "sent-full": `보낸 신청이 ${SENT_MAX}건이에요 · 답을 기다리거나 취소해 주세요`,
  "friends-full": `1촌은 ${ILCHON_MAX}명까지예요`,
};
