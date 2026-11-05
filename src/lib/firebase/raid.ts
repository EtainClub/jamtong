"use client";

import { doc, onSnapshot, runTransaction, serverTimestamp, Timestamp } from "firebase/firestore";

import { RAID_HITS_PER_PERSON, RAID_LIFE, type RaidWave } from "@/features/garden/rules";

import { firebaseDb } from "./client";

/**
 * 거대 잡초 — 광장이 무성해지면 나타나는 레이드. 설계는 docs/garden-game.md §3.8.
 *
 * plazaRaids/{날짜번호}-{물결}  hp·hits·fighters·spawnedAt·defeatedAt. 누구나 읽는다.
 *   └ fighters/{uid}            한 사람이 이 물결에 때린 수(hits)와 마지막으로 때린 때(lastAt). 본인만 읽는다.
 *
 * 규칙이 지키는 것은 firestore.rules의 plazaRaids 절에 있다. 여기서는 그 짝을 맞춰 쓴다 —
 * 한 방은 언제나 레이드와 내 표식을 한 트랜잭션으로 함께 올린다.
 */

export type Raid = RaidWave;

function toMillis(value: unknown): number | null {
  return value instanceof Timestamp ? value.toMillis() : null;
}

/** 물결 하나를 본다. 없으면 null. */
export function watchRaidWave(id: string, onRaid: (raid: Raid | null) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    doc(db, "plazaRaids", id),
    // 막 세운 직후에는 서버 시각이 아직 없다. 추정값으로 채워 "도망까지" 시계가 비지 않게.
    (snap) =>
      onRaid(
        snap.exists()
          ? {
              hp: snap.get("hp") ?? 0,
              hits: snap.get("hits") ?? 0,
              fighters: snap.get("fighters") ?? 0,
              spawnedAt: toMillis(snap.get("spawnedAt", { serverTimestamps: "estimate" })),
              defeatedAt: toMillis(snap.get("defeatedAt", { serverTimestamps: "estimate" })),
            }
          : null,
      ),
    (error) => {
      console.error("[raid] 거대 잡초를 읽지 못했다", error);
      onRaid(null);
    },
  );
}

/** 이 물결에서 내가 때린 수. */
export function watchMyHits(id: string, uid: string, onMine: (hits: number) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    doc(db, "plazaRaids", id, "fighters", uid),
    (snap) => onMine((snap.get("hits") as number | undefined) ?? 0),
    // 아직 표식이 없으면 읽기가 거절될 수 있다. 그때는 0으로 둔다.
    () => onMine(0),
  );
}

/** 물결을 세운다. 이미 있으면 아무것도 하지 않는다. 앞 물결이 덜 끝났으면 규칙이 막는다. */
export async function spawnRaid(id: string, hp: number): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  const ref = doc(db, "plazaRaids", id);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists()) return;
    tx.set(ref, { hp, hits: 0, fighters: 0, spawnedAt: serverTimestamp(), defeatedAt: null });
  });
}

/**
 * ok·defeated=맞혔다(defeated는 내 한 방으로 쓰러졌다), over=이미 쓰러졌거나 없다,
 * escaped=도망갔다, capped=이 물결에 내 몫을 다 쳤다,
 * busy=규칙에 막혔다(대개 1초 안에 두 번 — 잠시 뒤 다시 보내면 된다).
 */
export type StrikeResult = "ok" | "defeated" | "over" | "escaped" | "capped" | "busy" | "error";

export async function strikeRaid(uid: string, id: string): Promise<StrikeResult> {
  const db = firebaseDb();
  if (!db) return "error";
  const raidRef = doc(db, "plazaRaids", id);
  const mineRef = doc(db, "plazaRaids", id, "fighters", uid);
  try {
    return await runTransaction(db, async (tx): Promise<StrikeResult> => {
      const [raid, mine] = await Promise.all([tx.get(raidRef), tx.get(mineRef)]);
      if (!raid.exists() || raid.get("defeatedAt")) return "over";
      const spawnedAt = toMillis(raid.get("spawnedAt"));
      if (spawnedAt !== null && Date.now() >= spawnedAt + RAID_LIFE) return "escaped";
      const myHits = ((mine.get("hits") as number | undefined) ?? 0) + 1;
      if (myHits > RAID_HITS_PER_PERSON) return "capped";
      const hp = raid.get("hp") as number;
      const hits = (raid.get("hits") as number) + 1;
      if (hits > hp) return "over";
      tx.set(mineRef, { hits: myHits, lastAt: serverTimestamp() });
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
