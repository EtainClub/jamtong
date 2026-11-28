"use client";

import { collection, deleteField, doc, getDoc, getDocs, increment, limit, orderBy, query, runTransaction, serverTimestamp } from "firebase/firestore";

import { RAID_SLOTS, raidId } from "@/features/garden/rules";
import { canAddToStock, drawGift, readStock, type GiftDraw, type GiftStock } from "@/features/garden/slot/gift";
import { POT_GIVE_MAX } from "@/features/garden/slot/rules";

import { firebaseDb } from "./client";

/**
 * 슬롯머신의 함께 쓰는 자리(docs/garden-slots.md).
 *
 *   plazaPot/{물결 id}/givers/{uid}    광장 잼 항아리 — 그 물결에 낸 내 몫(j, 누적). 누구나 읽는다.
 *   gardens/{공개id}/giftBox/stock     뽑기 기계의 증정 상자 {items: {가구 id: 수}}. 주인이 넣고 빼고, 손님이 받으면 하나 준다. 열린 방이면 누구나 읽는다.
 *   gardens/{공개id}/giftWins/{uid}    손님이 그 기계를 돌린 마지막 기록 {day, it(받은 것, 꽝이면 ""), n}. 하루 한 번. 주인과 그 손님만 읽는다.
 *
 * ★ 불변식은 firestore.rules가 지킨다(한 번에 늘어나는 양, 한 사람 한 물결 상한, 하루 한 번).
 */

function need() {
  const db = firebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았다");
  return db;
}

const KST = 9 * 3_600_000;

/** 지금 잼이 모일 물결 — 열린 물결이 있고 아직 쓰러지지 않았으면 그것, 아니면 다음 물결(오늘 저녁이 지났으면 내일 아침). */
async function potTarget(now: number): Promise<string> {
  const db = need();
  const day = Math.floor((now + KST) / 86_400_000);
  const hour = ((now + KST) % 86_400_000) / 3_600_000;
  let wave = RAID_SLOTS.findIndex((s) => hour < s.close) + 1;
  if (wave === 0) return raidId(day + 1, 1);
  const open = hour >= RAID_SLOTS[wave - 1].open;
  if (open) {
    const snap = await getDoc(doc(db, "plazaRaids", raidId(day, wave))).catch(() => null);
    if (snap?.exists() && snap.get("defeatedAt")) wave += 1;
  }
  return wave > RAID_SLOTS.length ? raidId(day + 1, 1) : raidId(day, wave);
}

/** 잼 항아리에 내 몫을 더한다. 한 물결 상한에 닿았으면 더하지 않는다. 어느 물결에 더했는지 돌려준다. */
export async function givePot(uid: string, share: number, now = Date.now()): Promise<string | null> {
  if (share <= 0) return null;
  const db = need();
  const target = await potTarget(now);
  const ref = doc(db, "plazaPot", target, "givers", uid);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const j = snap.exists() ? Number(snap.get("j")) || 0 : 0;
    if (j + share > POT_GIVE_MAX) return null;
    tx.set(ref, { j: j + share, at: serverTimestamp() });
    return target;
  });
}

/** 그 물결 항아리에 모인 잼. */
export async function loadPot(id: string): Promise<number> {
  const db = need();
  const snap = await getDocs(collection(db, "plazaPot", id, "givers"));
  return snap.docs.reduce((n, d) => n + (Number(d.get("j")) || 0), 0);
}

// ── 방의 뽑기 기계 — 증정 상자 ─────────────────────────────────────

const stockRef = (gid: string) => doc(need(), "gardens", gid, "giftBox", "stock");

/** 그 방의 증정 상자. 없으면 빈 상자. */
export async function loadGiftStock(gid: string): Promise<GiftStock> {
  const snap = await getDoc(stockRef(gid));
  return snap.exists() ? readStock(snap.get("items")) : {};
}

/**
 * 주인 — 상자에 하나 넣는다. 손님이 같은 때 하나를 받아 가도 어긋나지 않게 늘리기(increment)로 쓴다.
 * 넣을 수 없으면(가지 수·한 가지 상한) false. 부르는 쪽은 true일 때만 보관함에서 뺀다.
 */
export async function addGiftStock(gid: string, id: string): Promise<boolean> {
  const db = need();
  return runTransaction(db, async (tx) => {
    const ref = stockRef(gid);
    const snap = await tx.get(ref);
    const stock = snap.exists() ? readStock(snap.get("items")) : {};
    if (!canAddToStock(stock, id)) return false;
    if (snap.exists()) tx.update(ref, { [`items.${id}`]: increment(1), at: serverTimestamp() });
    else tx.set(ref, { items: { [id]: 1 }, at: serverTimestamp() });
    return true;
  });
}

/** 주인 — 상자에서 하나 꺼낸다. 이미 다 나갔으면 false. 부르는 쪽은 true일 때만 보관함에 되돌린다. */
export async function takeGiftStock(gid: string, id: string): Promise<boolean> {
  const db = need();
  return runTransaction(db, async (tx) => {
    const ref = stockRef(gid);
    const snap = await tx.get(ref);
    const have = snap.exists() ? (readStock(snap.get("items"))[id] ?? 0) : 0;
    if (have <= 0) return false;
    tx.update(ref, have === 1 ? { [`items.${id}`]: deleteField(), at: serverTimestamp() } : { [`items.${id}`]: increment(-1), at: serverTimestamp() });
    return true;
  });
}

export interface GiftWin {
  uid: string;
  /** 받은 가구 id. 꽝이면 "". */
  it: string;
  nick: string;
  day: number;
  at: number;
}

const winRef = (gid: string, uid: string) => doc(need(), "gardens", gid, "giftWins", uid);

function readWin(uid: string, x: Record<string, unknown>): GiftWin {
  const at = x.at as { toMillis?: () => number } | undefined;
  return {
    uid,
    it: typeof x.it === "string" ? x.it : "",
    nick: typeof x.n === "string" ? x.n.slice(0, 12) : "이웃",
    day: typeof x.day === "number" ? x.day : 0,
    at: typeof at?.toMillis === "function" ? at.toMillis() : 0,
  };
}

/** 손님 — 이 방의 기계를 마지막으로 돌린 기록(오늘 돌렸는지 본다). */
export async function loadMyGiftWin(gid: string, uid: string): Promise<GiftWin | null> {
  const snap = await getDoc(winRef(gid, uid));
  return snap.exists() ? readWin(uid, snap.data()) : null;
}

/**
 * 손님 — 한 번 돌린다. 상자를 읽고 결과를 정해, 당첨이면 상자에서 하나 빼고 기록을 남기는 것을 한 번에(트랜잭션) 한다.
 * 규칙이 하루 한 번과 "기록한 그것을 하나만 뺐다"를 본다. done=오늘 이미, empty=받을 것이 없다.
 */
export async function spinGift(
  gid: string,
  me: { uid: string; nick: string },
  day: number,
  accept: (id: string) => boolean,
  rand: () => number,
): Promise<GiftDraw | "done"> {
  const db = need();
  return runTransaction(db, async (tx) => {
    const [mine, box] = await Promise.all([tx.get(winRef(gid, me.uid)), tx.get(stockRef(gid))]);
    if (mine.exists() && mine.get("day") === day) return "done" as const;
    const stock = box.exists() ? readStock(box.get("items")) : {};
    const got = drawGift(stock, accept, rand);
    if (got.kind === "empty") return got;
    const it = got.kind === "win" ? got.id : "";
    tx.set(winRef(gid, me.uid), { day, it, n: me.nick, at: serverTimestamp() });
    if (got.kind === "win") {
      const left = (box.get("items") as Record<string, number>)[it];
      // 마지막 하나면 칸째로 지운다(빈 칸이 가지 수 상한을 차지하지 않게).
      tx.update(stockRef(gid), { [`items.${it}`]: left <= 1 ? deleteField() : left - 1 });
    }
    return got;
  });
}

/** 주인 — 내 기계를 돌린 손님들(최근 것부터). 받은 것과 꽝 모두. */
export async function loadGiftWins(gid: string): Promise<GiftWin[]> {
  const db = need();
  const snap = await getDocs(query(collection(db, "gardens", gid, "giftWins"), orderBy("at", "desc"), limit(GIFT_WINS_LOAD)));
  return snap.docs.map((d) => readWin(d.id, d.data()));
}

const GIFT_WINS_LOAD = 50;
