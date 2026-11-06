"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
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
 * ★ 공개는 주인이 직접 켠다. 끄면 문서를 지운다.
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
}

export async function publishGarden(gid: string, uid: string, garden: PublicGarden): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  await setDoc(doc(db, "gardens", gid), { ownerUid: uid, ...garden, updatedAt: serverTimestamp() });
}

export async function unpublishGarden(gid: string): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  await deleteDoc(doc(db, "gardens", gid));
}

/** 공개 정원을 읽는다. 없거나 공개를 끈 정원이면 null. mine은 내 정원인지. */
export async function loadPublicGarden(
  gid: string,
  uid: string | null,
): Promise<{ garden: PublicGarden; mine: boolean; wateredToday: boolean } | null> {
  const db = firebaseDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "gardens", gid));
  if (!snap.exists()) return null;
  const d = snap.data();
  const garden: PublicGarden = {
    nick: typeof d.nick === "string" ? d.nick : "",
    beds: Array.isArray(d.beds) ? d.beds.map(toBed) : [],
    dex: Number(d.dex) || 0,
    golden: Number(d.golden) || 0,
    rainbow: Number(d.rainbow) || 0,
    titles: toTitles(d.titles),
  };
  const mine = Boolean(uid && d.ownerUid === uid);
  let wateredToday = false;
  if (uid && !mine) {
    const w = await getDoc(doc(db, "gardens", gid, "waters", uid));
    wateredToday = w.exists() && w.get("day") === todayNumber();
  }
  return { garden, mine, wateredToday };
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

/** 남의 정원에 물을 준다. 한 정원에 하루 한 번(규칙). */
export async function waterGarden(gid: string, uid: string, nick: string): Promise<WaterResult> {
  const db = firebaseDb();
  if (!db) return "error";
  const ref = doc(db, "gardens", gid, "waters", uid);
  try {
    return await runTransaction(db, async (tx): Promise<WaterResult> => {
      const [garden, mine] = await Promise.all([tx.get(doc(db, "gardens", gid)), tx.get(ref)]);
      if (!garden.exists()) return "gone";
      if (mine.exists() && mine.get("day") === todayNumber()) return "already";
      tx.set(ref, { day: todayNumber(), at: serverTimestamp(), nick });
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
}

/** 오늘 내 정원에 물을 준 사람들. 주인만 읽을 수 있다. */
export function watchWaters(gid: string, day: number, onChange: (visitors: Visitor[]) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "gardens", gid, "waters"), where("day", "==", day)),
    (snap) => onChange(snap.docs.map((d) => ({ uid: d.id, nick: (d.get("nick") as string) || "이웃" }))),
    (error) => console.error("[gardens] 받은 물을 읽지 못했다", error),
  );
}
