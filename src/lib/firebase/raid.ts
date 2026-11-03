"use client";

import { doc, onSnapshot, runTransaction, serverTimestamp, Timestamp } from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 거대 잡초 — 광장이 무성해지면 나타나는 레이드. 설계는 docs/garden-game.md §3.8.
 *
 * plazaRaids/{한국 날짜 번호}  hp·hits·fighters·spawnedAt·defeatedAt. 누구나 읽는다.
 *   └ fighters/{uid}           한 사람이 때린 수(hits)와 마지막으로 때린 때(lastAt). 본인만 읽는다.
 *
 * 규칙이 지키는 것은 firestore.rules의 plazaRaids 절에 있다. 여기서는 그 짝을 맞춰 쓴다 —
 * 한 방은 언제나 레이드와 내 표식을 한 트랜잭션으로 함께 올린다.
 */

export interface Raid {
  hp: number;
  hits: number;
  fighters: number;
  defeatedAt: number | null;
}

export function watchRaid(
  day: number,
  uid: string | null,
  onRaid: (raid: Raid | null) => void,
  onMine: (hits: number) => void,
): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  const offRaid = onSnapshot(doc(db, "plazaRaids", String(day)), (snap) => {
    if (!snap.exists()) return onRaid(null);
    const at = snap.get("defeatedAt") as Timestamp | null | undefined;
    onRaid({
      hp: snap.get("hp") ?? 0,
      hits: snap.get("hits") ?? 0,
      fighters: snap.get("fighters") ?? 0,
      defeatedAt: at ? at.toMillis() : null,
    });
  });
  const offMine = uid
    ? onSnapshot(
        doc(db, "plazaRaids", String(day), "fighters", uid),
        (snap) => onMine((snap.get("hits") as number | undefined) ?? 0),
        // 아직 표식이 없으면 읽기가 거절될 수 있다. 그때는 0으로 둔다.
        () => onMine(0),
      )
    : () => {};
  return () => {
    offRaid();
    offMine();
  };
}

/** 오늘의 거대 잡초를 세운다. 이미 있으면 아무것도 하지 않는다. */
export async function spawnRaid(day: number, hp: number): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  const ref = doc(db, "plazaRaids", String(day));
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists()) return;
    tx.set(ref, { hp, hits: 0, fighters: 0, spawnedAt: serverTimestamp(), defeatedAt: null });
  });
}

export type StrikeResult = "ok" | "defeated" | "over" | "busy" | "error";

/**
 * 한 방. 레이드 합계와 내 표식을 함께 1씩 올린다.
 * over=이미 쓰러졌거나 아직 없다, defeated=내 한 방으로 쓰러졌다,
 * busy=규칙에 막혔다(대개 1초 안에 두 번 — 잠시 뒤 다시 보내면 된다).
 */
export async function strikeRaid(uid: string, day: number): Promise<StrikeResult> {
  const db = firebaseDb();
  if (!db) return "error";
  const raidRef = doc(db, "plazaRaids", String(day));
  const mineRef = doc(db, "plazaRaids", String(day), "fighters", uid);
  try {
    return await runTransaction(db, async (tx): Promise<StrikeResult> => {
      const [raid, mine] = await Promise.all([tx.get(raidRef), tx.get(mineRef)]);
      if (!raid.exists() || raid.get("defeatedAt")) return "over";
      const hp = raid.get("hp") as number;
      const hits = (raid.get("hits") as number) + 1;
      if (hits > hp) return "over";
      tx.set(mineRef, { hits: ((mine.get("hits") as number | undefined) ?? 0) + 1, lastAt: serverTimestamp() });
      tx.update(raidRef, {
        hits,
        fighters: (raid.get("fighters") as number) + (mine.exists() ? 0 : 1),
        defeatedAt: hits === hp ? serverTimestamp() : null,
      });
      return hits === hp ? "defeated" : "ok";
    });
  } catch (error) {
    // 1초 안에 두 번 친 것은 규칙에 막힌다. 화면이 간격을 두므로 드물다.
    if ((error as { code?: string }).code === "permission-denied") return "busy";
    console.error("[raid] 거대 잡초를 치지 못했다", error);
    return "error";
  }
}
