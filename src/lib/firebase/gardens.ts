"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 공개 정원과 놀러 가기. 설계는 docs/garden-game.md §3.10.
 *
 * gardens/{공개id}          주인이 켠 정원의 모습. 누구나 읽는다.
 *   └ waters/{방문자 uid}   그 정원에 물을 준 날(한국 날짜 번호)과 방문자의 정원 이름.
 *
 * ★ 공개는 주인이 직접 켠다. 끄면 문서를 지운다 — 1촌이 있는 방은 지우지 않고 가린다(hidden).
 *   가린 문서에는 주인과 hidden만 남는다(규칙의 hiddenGarden()). 읽는 쪽은 가린 문서를 없는 문서처럼 다룬다.
 * ★ 담는 것은 화면에 그릴 것뿐이다 — 정원 이름, 텃밭(품종 id와 시각), 도감 수.
 *   잼·씨앗·쪽지는 담지 않는다. 자랑할 것이 아니라 엿볼 것이 된다.
 */

/** 텃밭 한 칸. s=품종 id, p=심은 때, r=익는 때. 빈 칸은 null. */
export interface PublicBed {
  s: string;
  p: number;
  r: number;
}

export interface PublicGarden {
  nick: string;
  beds: Array<PublicBed | null>;
  dex: number;
  golden: number;
  rainbow: number;
  /** 칭호 단계(0~3). 이름은 보는 쪽이 features/garden/rules.ts의 TITLES에서 읽는다. 옛 문서에는 없다. */
  titles?: Partial<Record<"dex" | "storm" | "plaza", number>>;
  /** 내 방(docs/garden-miniroom.md §4.4). 옛 문서에는 없다. 안의 id는 보는 쪽이 표로 거른다. */
  room?: PublicRoom;
  /**
   * 1촌(docs/garden-miniroom.md §5.5). 옛 문서에는 없다.
   * news=소식(종류 번호·품종 id·때, 글이 아니다), accept=1촌 신청 받기, showIlchon=내 1촌 보이기,
   * guestbook=방명록 받기, ilchonList=보이기를 켰을 때만 싣는 1촌의 공개 id와 이름.
   */
  news?: Array<{ k: number; s: string; m?: string; t: number }>;
  accept?: boolean;
  showIlchon?: boolean;
  guestbook?: "all" | "ilchon" | "off";
  ilchonList?: Array<{ g: string; n: string }>;
}

/**
 * 방에 놓인 것 하나. a=칸. 가구는 i(가구 id), 전시품은 k(종류)·s(품종 id)·m(변이)·n(쪽지 id).
 * 글은 싣지 않는다 — 액자의 글은 보는 화면이 품종표에서 읽는다.
 */
export type PublicPlaced = { a: string; i: string } | { a: string; k: string; s: string; m?: string[]; n?: string };

export interface PublicRoom {
  size: number;
  wall: string;
  floor: string;
  mood: string;
  placed: PublicPlaced[];
}

export async function publishGarden(gid: string, uid: string, garden: PublicGarden): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  await setDoc(doc(db, "gardens", gid), { ownerUid: uid, ...garden, updatedAt: serverTimestamp() });
}

/**
 * 공개를 끈다. 1촌이 있으면 문서를 지우지 않고 가린다 — 다시 켜면 1촌이 그대로다(§5.5).
 * 가릴 때는 방·텃밭을 문서에서 걷어 낸다. 규칙은 누구나 읽는 문서의 칸을 숨기지 못한다.
 * 없는 문서는 그대로 둔다(규칙이 resource.data를 읽다 거절한다).
 */
export async function unpublishGarden(gid: string, uid: string): Promise<"hidden" | "deleted" | "none"> {
  const db = firebaseDb();
  if (!db) return "none";
  const ref = doc(db, "gardens", gid);
  if (!(await getDoc(ref)).exists()) return "none";
  const friends = await getDocs(query(collection(db, "gardens", gid, "ilchon"), limit(1)));
  if (friends.empty) {
    await deleteDoc(ref);
    return "deleted";
  }
  await setDoc(ref, { ownerUid: uid, hidden: true, updatedAt: serverTimestamp() });
  return "hidden";
}

/** 이 공개 id의 문서가 남의 것인가. 계정이 바뀐 기기가 옛 계정의 공개 id를 들고 있을 때(share.ts). */
export async function gardenOwnedByOther(gid: string, uid: string): Promise<boolean> {
  const db = firebaseDb();
  if (!db) return false;
  const snap = await getDoc(doc(db, "gardens", gid));
  return snap.exists() && snap.get("ownerUid") !== uid;
}

/** 가린 문서는 없는 문서와 같다. */
function isLive(d: Record<string, unknown> | undefined): d is Record<string, unknown> {
  return Boolean(d) && d!.hidden !== true;
}

/** 공개 정원을 읽는다. 없거나 공개를 끈 정원이면 null. mine은 내 정원인지. */
export async function loadPublicGarden(
  gid: string,
  uid: string | null,
): Promise<{ garden: PublicGarden; mine: boolean; wateredToday: boolean } | null> {
  const db = firebaseDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "gardens", gid));
  const d = snap.data();
  if (!isLive(d)) return null;
  const garden = toPublic(d);
  const mine = Boolean(uid && d.ownerUid === uid);
  let wateredToday = false;
  if (uid && !mine) {
    const w = await getDoc(doc(db, "gardens", gid, "waters", uid));
    wateredToday = w.exists() && w.get("day") === todayNumber();
  }
  return { garden, mine, wateredToday };
}

/**
 * 공개 정원 여럿을 읽는다 — 이웃 탭의 친구 정원 비교. 없거나 공개를 끈 정원은 null.
 * 물 표식은 읽지 않는다(비교에는 필요 없다).
 */
export async function loadPublicGardens(gids: string[]): Promise<Map<string, PublicGarden | null>> {
  const db = firebaseDb();
  const out = new Map<string, PublicGarden | null>();
  if (!db) return out;
  const snaps = await Promise.all(gids.map((gid) => getDoc(doc(db, "gardens", gid))));
  snaps.forEach((snap, i) => {
    const d = snap.data();
    out.set(gids[i], isLive(d) ? toPublic(d) : null);
  });
  return out;
}

/**
 * 마실 "아무 방이나"의 후보. 최근에 고쳐진 공개 문서 30개(가린 것 포함 — 가린 문서를 걸러 내는
 * where를 붙이면 복합 색인이 든다. updatedAt 하나로 줄 세우는 것은 자동 색인으로 된다).
 */
export async function loadRecentRooms(): Promise<Array<{ gid: string; hidden: boolean; ownerUid: string }>> {
  const db = firebaseDb();
  if (!db) return [];
  const snap = await getDocs(query(collection(db, "gardens"), orderBy("updatedAt", "desc"), limit(30)));
  return snap.docs.map((d) => ({ gid: d.id, hidden: d.get("hidden") === true, ownerUid: String(d.get("ownerUid") ?? "") }));
}

/**
 * 꽃밭 정원지기의 방. 명패에는 uid만 있어 공개 문서를 ownerUid로 하나 찾는다(등호 하나라 자동 색인).
 * 누를 때만 읽는다. 없거나 가렸으면 null.
 */
export async function findRoomOf(ownerUid: string): Promise<string | null> {
  const db = firebaseDb();
  if (!db) return null;
  const snap = await getDocs(query(collection(db, "gardens"), where("ownerUid", "==", ownerUid), limit(1)));
  const d = snap.docs[0];
  return d && d.get("hidden") !== true ? d.id : null;
}

/** 아무 값이나 담길 수 있는 문서다. 모양이 맞는 값만 받는다. */
function toPublic(d: Record<string, unknown>): PublicGarden {
  return {
    nick: typeof d.nick === "string" ? d.nick : "",
    beds: Array.isArray(d.beds) ? d.beds.map(toBed) : [],
    dex: Number(d.dex) || 0,
    golden: Number(d.golden) || 0,
    rainbow: Number(d.rainbow) || 0,
    titles: toTitles(d.titles),
    room: toRoom(d.room),
    news: Array.isArray(d.news) ? (d.news as PublicGarden["news"]) : undefined,
    accept: d.accept !== false,
    showIlchon: d.showIlchon === true,
    guestbook: d.guestbook === "ilchon" || d.guestbook === "off" ? d.guestbook : "all",
    ilchonList: d.showIlchon === true ? toIlchonList(d.ilchonList) : undefined,
  };
}

/** 모양만 본다. 공개 id 모양과 이름 길이가 맞는 것만. */
function toIlchonList(raw: unknown): PublicGarden["ilchonList"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 50)
    .filter((x): x is { g: string; n: string } => Boolean(x) && typeof x.g === "string" && /^g[0-9a-z]{8,12}$/.test(x.g) && typeof x.n === "string")
    .map((x) => ({ g: x.g, n: x.n.slice(0, 12) }));
}

/** 모양만 본다. 표에 있는 id인지는 그리는 쪽(features/garden/room/rules.ts의 roomFromPublic)이 본다. */
function toRoom(raw: unknown): PublicRoom | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const placed: PublicPlaced[] = [];
  for (const item of Array.isArray(r.placed) ? r.placed : []) {
    if (!item || typeof item !== "object") continue;
    const p = item as Record<string, unknown>;
    if (typeof p.a !== "string") continue;
    if (typeof p.i === "string") placed.push({ a: p.a, i: p.i });
    else if (typeof p.k === "string" && typeof p.s === "string") {
      placed.push({
        a: p.a,
        k: p.k,
        s: p.s,
        m: Array.isArray(p.m) ? p.m.filter((m): m is string => typeof m === "string") : undefined,
        n: typeof p.n === "string" ? p.n : undefined,
      });
    }
  }
  return { size: Number(r.size) || 0, wall: str(r.wall), floor: str(r.floor), mood: str(r.mood), placed };
}

function toTitles(raw: unknown): PublicGarden["titles"] {
  if (!raw || typeof raw !== "object") return {};
  const t = raw as Record<string, unknown>;
  const out: NonNullable<PublicGarden["titles"]> = {};
  for (const k of ["dex", "storm", "plaza"] as const) {
    const v = t[k];
    if (typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 3) out[k] = v;
  }
  return out;
}

/** 아무 값이나 담길 수 있는 문서다. 모양이 맞는 칸만 받는다. */
function toBed(raw: unknown): PublicBed | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  if (typeof b.s !== "string" || typeof b.p !== "number" || typeof b.r !== "number") return null;
  return { s: b.s, p: b.p, r: b.r };
}

function todayNumber(): number {
  return Math.floor((Date.now() + 9 * 3_600_000) / 86_400_000);
}

export type WaterResult = "ok" | "already" | "gone" | "error";

/**
 * 남의 정원에 물을 준다. 한 정원에 하루 한 번(규칙).
 * ilchon이면 1촌의 물(il: true)로 적는다 — 규칙이 정말 1촌인지 보고(gardens/{gid}/ilchon/{내 uid}),
 * 받는 쪽은 그 표시를 믿고 더 줄인다(rules.ts의 waterBeds, ilchon/rules.ts의 WATER_CUT_ILCHON).
 */
export async function waterGarden(gid: string, uid: string, nick: string, ilchon = false): Promise<WaterResult> {
  const db = firebaseDb();
  if (!db) return "error";
  const ref = doc(db, "gardens", gid, "waters", uid);
  try {
    return await runTransaction(db, async (tx): Promise<WaterResult> => {
      const [garden, mine] = await Promise.all([tx.get(doc(db, "gardens", gid)), tx.get(ref)]);
      if (!isLive(garden.data())) return "gone";
      if (mine.exists() && mine.get("day") === todayNumber()) return "already";
      tx.set(ref, { day: todayNumber(), at: serverTimestamp(), nick, ...(ilchon ? { il: true } : {}) });
      return "ok";
    });
  } catch (error) {
    console.error("[gardens] 물을 주지 못했다", error);
    return "error";
  }
}

export interface Visitor {
  uid: string;
  nick: string;
  /** 1촌이 준 물인가. 규칙이 1촌인지 보고 받아들인 표시다. */
  il: boolean;
}

/** 오늘 내 정원에 물을 준 사람들. 주인만 읽을 수 있다. */
export function watchWaters(gid: string, day: number, onChange: (visitors: Visitor[]) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "gardens", gid, "waters"), where("day", "==", day)),
    (snap) => onChange(snap.docs.map((d) => ({ uid: d.id, nick: (d.get("nick") as string) || "이웃", il: d.get("il") === true }))),
    (error) => console.error("[gardens] 받은 물을 읽지 못했다", error),
  );
}
