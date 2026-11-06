"use client";

import { collection, doc, onSnapshot, runTransaction, serverTimestamp, Timestamp } from "firebase/firestore";

import { RAID_HITS_PER_PERSON, RAID_LIFE, RAID_SHARDS, raidShard, type RaidWave } from "@/features/garden/rules";

import { firebaseDb } from "./client";

/**
 * 거대 잡초 — 광장이 무성해지면 나타나는 레이드. 설계는 docs/garden-game.md §3.8.
 *
 * plazaRaids/{날짜번호}-{물결}  hp·spawnedAt·defeatedAt, 그리고 옛 화면이 센 hits·fighters. 누구나 읽는다.
 *   ├ shards/{0..7}             맞은 수와 참여 인원을 나눠 센다(분산 카운터). 누구나 읽는다.
 *   └ fighters/{uid}            한 사람이 이 물결에 때린 수(hits), 마지막으로 때린 때(lastAt),
 *                               올리는 칸(shard). 본인만 읽는다.
 *
 * ★ 한 방은 내 표식과 내 칸을 한 트랜잭션으로 함께 올린다. 물결 문서는 건드리지 않는다 —
 *   모두가 한 문서를 올리면 문서당 쓰기 한도에 막혀 사람이 몰릴수록 밀린다.
 * ★ 합계 = 물결 문서의 hits(옛 화면 몫) + 칸의 합. 칸을 더한 합계가 체력에 닿으면 누구든
 *   finishRaid로 쓰러진 시각을 찍는다. 규칙이 칸을 모두 읽어 합계를 확인한다.
 *   그 사이 몇 방이 체력을 넘을 수 있다. 화면은 체력에서 멈춰 그린다.
 *
 * 규칙이 지키는 것은 firestore.rules의 plazaRaids 절에 있다.
 */

export type Raid = RaidWave;

function toMillis(value: unknown): number | null {
  return value instanceof Timestamp ? value.toMillis() : null;
}

const shardIds = Array.from({ length: RAID_SHARDS }, (_, i) => String(i));

/** 물결 하나를 본다(문서와 칸을 함께). 없으면 null. */
export function watchRaidWave(id: string, onRaid: (raid: Raid | null) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  let base: (Raid & { exists: boolean }) | undefined;
  let shards: { hits: number; fighters: number } | undefined;
  const emit = () => {
    if (base === undefined || shards === undefined) return;
    onRaid(base.exists ? { ...base, hits: base.hits + shards.hits, fighters: base.fighters + shards.fighters } : null);
  };
  const fail = (error: unknown) => {
    console.error("[raid] 거대 잡초를 읽지 못했다", error);
    onRaid(null);
  };

  const offRaid = onSnapshot(
    doc(db, "plazaRaids", id),
    (snap) => {
      // 막 세운 직후에는 서버 시각이 아직 없다. 추정값으로 채워 "도망까지" 시계가 비지 않게.
      base = {
        exists: snap.exists(),
        hp: snap.get("hp") ?? 0,
        hits: snap.get("hits") ?? 0,
        fighters: snap.get("fighters") ?? 0,
        spawnedAt: toMillis(snap.get("spawnedAt", { serverTimestamps: "estimate" })),
        defeatedAt: toMillis(snap.get("defeatedAt", { serverTimestamps: "estimate" })),
      };
      emit();
    },
    fail,
  );
  const offShards = onSnapshot(
    collection(db, "plazaRaids", id, "shards"),
    (snap) => {
      let hits = 0;
      let fighters = 0;
      snap.forEach((d) => {
        hits += (d.get("hits") as number | undefined) ?? 0;
        fighters += (d.get("fighters") as number | undefined) ?? 0;
      });
      shards = { hits, fighters };
      emit();
    },
    fail,
  );
  return () => {
    offRaid();
    offShards();
  };
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

/**
 * 물결을 세운다(빈 칸까지 함께). 이미 있으면 아무것도 하지 않는다. 앞 물결이 덜 끝났으면 규칙이 막는다.
 * 내가 세웠으면 true.
 */
export async function spawnRaid(id: string, hp: number): Promise<boolean> {
  const db = firebaseDb();
  if (!db) return false;
  const ref = doc(db, "plazaRaids", id);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists()) return false;
    tx.set(ref, { hp, hits: 0, fighters: 0, spawnedAt: serverTimestamp(), defeatedAt: null });
    for (const n of shardIds) tx.set(doc(db, "plazaRaids", id, "shards", n), { hits: 0, fighters: 0 });
    return true;
  });
}

/**
 * ok=맞혔다, over=이미 쓰러졌거나 없다, escaped=도망갔다, capped=이 물결에 내 몫을 다 쳤다,
 * busy=규칙에 막혔다(대개 1초 안에 두 번 — 잠시 뒤 다시 보내면 된다).
 * 쓰러뜨리기는 한 방과 따로다(finishRaid).
 */
export type StrikeResult = "ok" | "defeated" | "over" | "escaped" | "capped" | "busy" | "error";

export async function strikeRaid(uid: string, id: string): Promise<StrikeResult> {
  const db = firebaseDb();
  if (!db) return "error";
  const shard = raidShard(uid);
  const raidRef = doc(db, "plazaRaids", id);
  const mineRef = doc(db, "plazaRaids", id, "fighters", uid);
  const shardRef = doc(db, "plazaRaids", id, "shards", String(shard));
  try {
    return await runTransaction(db, async (tx): Promise<StrikeResult> => {
      // 물결 문서는 읽기만 한다. 트랜잭션이 읽은 문서는 다른 사람의 쓰기와 겨루지 않는다 —
      // 물결 문서는 세울 때와 쓰러질 때만 바뀐다.
      const [raid, mine, cell] = await Promise.all([tx.get(raidRef), tx.get(mineRef), tx.get(shardRef)]);
      if (!raid.exists() || raid.get("defeatedAt")) return "over";
      const spawnedAt = toMillis(raid.get("spawnedAt"));
      if (spawnedAt !== null && Date.now() >= spawnedAt + RAID_LIFE) return "escaped";
      const myHits = ((mine.get("hits") as number | undefined) ?? 0) + 1;
      if (myHits > RAID_HITS_PER_PERSON) return "capped";
      tx.set(mineRef, { hits: myHits, lastAt: serverTimestamp(), shard });
      tx.set(shardRef, {
        hits: ((cell.get("hits") as number | undefined) ?? 0) + 1,
        fighters: ((cell.get("fighters") as number | undefined) ?? 0) + (mine.exists() ? 0 : 1),
      });
      return "ok";
    });
  } catch (error) {
    // 1초 안에 두 번 친 것은 규칙에 막힌다. 화면이 간격을 두므로 드물다.
    if ((error as { code?: string }).code === "permission-denied") return "busy";
    console.error("[raid] 거대 잡초를 치지 못했다", error);
    return "error";
  }
}

/**
 * 합계가 체력에 닿은 물결에 쓰러진 시각을 찍는다. 누가 불러도 한 번만 찍힌다.
 * 내가 찍었으면 true. 빈 칸이 있으면(칸이 생기기 전에 세운 물결) 함께 만든다 — 규칙이 칸을 다 읽는다.
 */
export async function finishRaid(id: string): Promise<boolean> {
  const db = firebaseDb();
  if (!db) return false;
  const raidRef = doc(db, "plazaRaids", id);
  const refs = shardIds.map((n) => doc(db, "plazaRaids", id, "shards", n));
  try {
    return await runTransaction(db, async (tx) => {
      const raid = await tx.get(raidRef);
      if (!raid.exists() || raid.get("defeatedAt")) return false;
      const cells = await Promise.all(refs.map((r) => tx.get(r)));
      const total = ((raid.get("hits") as number | undefined) ?? 0) + cells.reduce((n, c) => n + ((c.get("hits") as number | undefined) ?? 0), 0);
      if (total < (raid.get("hp") as number)) return false;
      cells.forEach((c, i) => {
        if (!c.exists()) tx.set(refs[i], { hits: 0, fighters: 0 });
      });
      tx.update(raidRef, { defeatedAt: serverTimestamp() });
      return true;
    });
  } catch (error) {
    console.error("[raid] 거대 잡초를 쓰러뜨리지 못했다", error);
    return false;
  }
}
