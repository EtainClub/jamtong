"use client";

import { collection, doc, documentId, getDocs, onSnapshot, query, runTransaction, serverTimestamp, Timestamp, where } from "firebase/firestore";

import {
  MINUTE,
  RAID_AIDS,
  RAID_FINISHER_MAX,
  RAID_GAP_EVERY,
  RAID_LIFE,
  RAID_NAMES_PER_SHARD,
  RAID_SHARDS,
  RAID_USES_PER_PERSON,
  raidAidOf,
  raidId,
  raidShard,
  raidStrikeValue,
  type RaidAidId,
  type RaidWave,
} from "@/features/garden/rules";

import { firebaseDb } from "./client";

/**
 * 거대 잡초 — 광장이 무성해지면 나타나는 레이드. 설계는 docs/garden-game.md §3.8.
 *
 * plazaRaids/{날짜번호}-{물결}  hp·spawnedAt·defeatedAt, 그리고 옛 화면이 센 hits·fighters. 누구나 읽는다.
 *   ├ shards/{0..7}             맞은 수와 참여 인원을 나눠 센다(분산 카운터). 누구나 읽는다.
 *   │                           칸마다 함께한 사람 이름(names)과 마지막 지원(aid·aidAt·aidBy)도 싣는다 —
 *   │                           모두가 이미 칸을 보고 있으므로 지원을 보려고 새로 구독하지 않는다.
 *   └ fighters/{uid}            한 사람이 이 물결에 센 값(hits)·쓴 기력(uses)·지원(aid·aidAt·aids),
 *                               마지막으로 쓴 때(lastAt), 올리는 칸(shard). 본인만 읽는다.
 *
 * ★ 한 방은 내 표식과 내 칸을 한 트랜잭션으로 함께 올린다. 물결 문서는 건드리지 않는다 —
 *   모두가 한 문서를 올리면 문서당 쓰기 한도에 막혀 사람이 몰릴수록 밀린다.
 * ★ 합계 = 물결 문서의 hits(옛 화면 몫) + 칸의 합. 칸을 더한 합계가 체력에 닿으면 누구든
 *   finishRaid로 쓰러진 시각을 찍는다. 규칙이 칸을 모두 읽어 합계를 확인한다.
 *   그 사이 몇 방이 체력을 넘을 수 있다. 화면은 체력에서 멈춰 그린다.
 *
 * 규칙이 지키는 것은 firestore.rules의 plazaRaids 절에 있다.
 */

export interface RaidAidMark {
  /** 칸 번호. 같은 칸의 다음 지원이 덮는다. */
  shard: number;
  aid: RaidAidId;
  at: number;
  by: string;
}

export interface Raid extends RaidWave {
  /** 칸마다 맞은 수. 누가 지금 치고 있는지 어림하는 데 쓴다(화면 연출). 칸을 아직 못 읽었으면 없다. */
  shardHits?: number[];
  /** 칸마다 마지막 지원(있는 것만). */
  aids?: RaidAidMark[];
  /** 함께한 사람 이름(칸에 적힌 것만 — 옛 화면으로 든 사람은 빠진다). */
  names?: string[];
}

/** 이 물결에서 내 표식. */
export interface RaidMine {
  hits: number;
  uses: number;
  aids: number;
  /** 마지막 지원 시각(ms). */
  aidAt: number | null;
}

function toMillis(value: unknown): number | null {
  return value instanceof Timestamp ? value.toMillis() : null;
}

const shardIds = Array.from({ length: RAID_SHARDS }, (_, i) => String(i));

/** 물결 하나를 본다(문서와 칸을 함께). 없으면 null. */
export function watchRaidWave(id: string, onRaid: (raid: Raid | null) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  let base: (Raid & { exists: boolean }) | undefined;
  let shards: { hits: number; fighters: number; each: number[]; aids: RaidAidMark[]; names: string[] } | undefined;
  const emit = () => {
    if (base === undefined || shards === undefined) return;
    onRaid(
      base.exists
        ? {
            ...base,
            hits: base.hits + shards.hits,
            fighters: base.fighters + shards.fighters,
            shardHits: shards.each,
            aids: shards.aids,
            names: shards.names,
          }
        : null,
    );
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
      const each = Array.from({ length: RAID_SHARDS }, () => 0);
      const aids: RaidAidMark[] = [];
      const names: string[] = [];
      snap.forEach((d) => {
        const h = (d.get("hits") as number | undefined) ?? 0;
        hits += h;
        fighters += (d.get("fighters") as number | undefined) ?? 0;
        const n = Number(d.id);
        if (n >= 0 && n < RAID_SHARDS) each[n] = h;
        const aid = raidAidOf(d.get("aid"));
        const at = toMillis(d.get("aidAt", { serverTimestamps: "estimate" }));
        const by = d.get("aidBy");
        if (aid && at !== null && typeof by === "string") aids.push({ shard: n, aid, at, by });
        const list = d.get("names");
        if (Array.isArray(list)) for (const name of list) if (typeof name === "string") names.push(name);
      });
      shards = { hits, fighters, each, aids, names };
      emit();
    },
    fail,
  );
  return () => {
    offRaid();
    offShards();
  };
}

const NO_MINE: RaidMine = { hits: 0, uses: 0, aids: 0, aidAt: null };

function mineOf(get: (k: string) => unknown, aidAt: unknown): RaidMine {
  const hits = (get("hits") as number | undefined) ?? 0;
  // 기력이 없는 옛 표식은 센 값이 곧 쓴 기력이다(규칙도 같게 본다).
  return { hits, uses: (get("uses") as number | undefined) ?? hits, aids: (get("aids") as number | undefined) ?? 0, aidAt: toMillis(aidAt) };
}

/** 이 물결에서 내 표식(센 값·쓴 기력·지원). 표식이 없으면 모두 0. */
export function watchMine(id: string, uid: string, onMine: (mine: RaidMine) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    doc(db, "plazaRaids", id, "fighters", uid),
    (snap) => onMine(snap.exists() ? mineOf((k) => snap.get(k), snap.get("aidAt", { serverTimestamps: "estimate" })) : NO_MINE),
    // 아직 표식이 없으면 읽기가 거절될 수 있다. 그때는 0으로 둔다.
    () => onMine(NO_MINE),
  );
}

/**
 * 오늘 물결을 한 번 읽는다 — 정원 홈의 새 소식("거대 잡초 등장 · 빈틈 4분 뒤")용.
 * 홈은 광장 구독을 두지 않는다. 문서 id 범위 질의 하나라 있는 물결 수만큼만 읽는다(없으면 1).
 * 칸은 읽지 않는다 — 소식에는 체력이 필요 없다.
 */
export async function loadTodayRaids(day: number): Promise<Array<{ wave: number; raid: RaidWave }>> {
  const db = firebaseDb();
  if (!db) return [];
  const snap = await getDocs(
    query(collection(db, "plazaRaids"), where(documentId(), ">=", raidId(day, 1)), where(documentId(), "<=", raidId(day, 9))),
  );
  return snap.docs.map((d) => ({
    wave: Number(d.id.split("-")[1]),
    raid: {
      hp: (d.get("hp") as number | undefined) ?? 0,
      hits: (d.get("hits") as number | undefined) ?? 0,
      fighters: (d.get("fighters") as number | undefined) ?? 0,
      spawnedAt: toMillis(d.get("spawnedAt")),
      defeatedAt: toMillis(d.get("defeatedAt")),
    },
  }));
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
 * ok=맞혔다, over=이미 쓰러졌거나 없다, escaped=도망갔다, capped=이 물결에 기력을 다 썼다,
 * busy=규칙에 막혔다(대개 1초 안에 두 번 — 잠시 뒤 다시 보내면 된다).
 * 쓰러뜨리기는 한 방과 따로다(finishRaid).
 */
export type StrikeResult = "ok" | "defeated" | "over" | "escaped" | "capped" | "busy" | "error";

/** 빈틈의 가장자리(시작·끝)에서 이만큼 안이면, 막혔을 때 반대 판단으로 한 번 더 보낸다. 기기 시계가 어긋난 몫이다. */
const GAP_EDGE = 20_000;

function nearGapEdge(t: number): boolean {
  const slot = RAID_GAP_EVERY * MINUTE;
  const into = t % slot;
  // 빈틈의 시작(0분)과 끝(3분·폭주면 6분) 근처. 끝은 둘 다 본다 — 폭주 판단도 시계에 달려 있다.
  return [0, 3 * MINUTE, 6 * MINUTE, slot].some((edge) => Math.abs(into - edge) < GAP_EDGE);
}

function permissionDenied(error: unknown): boolean {
  return (error as { code?: string }).code === "permission-denied";
}

/**
 * 기력을 쓴다 — 한 번(count=1) 또는 필살기(count>1, RAID_FINISHER_MAX까지). 기력을 넘는 만큼은 덜어 낸다.
 * 빈틈이면 쓴 기력의 RAID_GAP_MULT배를 센다. 빈틈은 이 기기의 시계로 정하고 규칙이 서버 시각으로 다시 본다 —
 * 가장자리에서 막히면 반대로 한 번 더 보낸다(시계가 몇 초 어긋난 몫).
 * 처음 드는 사람이면 칸에 이름(nick)을 적는다(쓰러뜨린 뒤 "함께한 사람들").
 * 돌려주는 uses는 실제로 쓴 기력, hits는 센 값이다(ok일 때).
 */
export async function strikeRaid(
  uid: string,
  id: string,
  count = 1,
  nick = "",
): Promise<{ result: StrikeResult; uses: number; hits: number }> {
  const want = Math.max(1, Math.min(RAID_FINISHER_MAX, Math.floor(count)));
  const db = firebaseDb();
  if (!db) return { result: "error", uses: 0, hits: 0 };
  const shard = raidShard(uid);
  const raidRef = doc(db, "plazaRaids", id);
  const mineRef = doc(db, "plazaRaids", id, "fighters", uid);
  const shardRef = doc(db, "plazaRaids", id, "shards", String(shard));
  const name = nick.trim().slice(0, 12);

  const attempt = (flip: boolean) =>
    runTransaction(db, async (tx): Promise<{ result: StrikeResult; uses: number; hits: number }> => {
      // 물결 문서는 읽기만 한다. 트랜잭션이 읽은 문서는 다른 사람의 쓰기와 겨루지 않는다 —
      // 물결 문서는 세울 때와 쓰러질 때만 바뀐다.
      const [raid, mine, cell] = await Promise.all([tx.get(raidRef), tx.get(mineRef), tx.get(shardRef)]);
      if (!raid.exists() || raid.get("defeatedAt")) return { result: "over", uses: 0, hits: 0 };
      const spawnedAt = toMillis(raid.get("spawnedAt"));
      const now = Date.now();
      if (spawnedAt !== null && now >= spawnedAt + RAID_LIFE) return { result: "escaped", uses: 0, hits: 0 };
      const before = mine.exists() ? mineOf((k) => mine.get(k), mine.get("aidAt")) : NO_MINE;
      const n = Math.min(want, RAID_USES_PER_PERSON - before.uses);
      if (n <= 0) return { result: "capped", uses: 0, hits: 0 };
      let value = raidStrikeValue(now, spawnedAt, raid.get("hp") as number);
      if (flip) value = value === 1 ? 2 : 1;
      const add = n * value;
      // 지원 칸은 그대로 옮긴다. set은 통째로 쓰므로 빠뜨리면 지워진다.
      const kept: Record<string, unknown> = {};
      for (const k of ["aid", "aidAt", "aids"]) if (mine.get(k) !== undefined) kept[k] = mine.get(k);
      tx.set(mineRef, { ...kept, hits: before.hits + add, uses: before.uses + n, lastAt: serverTimestamp(), shard });
      tx.set(shardRef, shardAfter(cell.exists() ? cell.data() : {}, add, mine.exists() ? "" : name, !mine.exists()));
      return { result: "ok", uses: n, hits: add };
    });

  try {
    return await attempt(false);
  } catch (error) {
    if (permissionDenied(error) && nearGapEdge(Date.now())) {
      try {
        return await attempt(true);
      } catch (again) {
        if (permissionDenied(again)) return { result: "busy", uses: 0, hits: 0 };
        console.error("[raid] 거대 잡초를 치지 못했다", again);
        return { result: "error", uses: 0, hits: 0 };
      }
    }
    // 1초 안에 두 번 친 것은 규칙에 막힌다. 화면이 간격을 두므로 드물다.
    if (permissionDenied(error)) return { result: "busy", uses: 0, hits: 0 };
    console.error("[raid] 거대 잡초를 치지 못했다", error);
    return { result: "error", uses: 0, hits: 0 };
  }
}

/** 칸의 다음 모습. 새로 든 사람이면 참여 인원을 하나 올리고 이름을 붙인다(칸마다 RAID_NAMES_PER_SHARD까지). */
function shardAfter(cell: Record<string, unknown>, add: number, name: string, joined: boolean): Record<string, unknown> {
  const names = Array.isArray(cell.names) ? (cell.names as unknown[]).filter((x): x is string => typeof x === "string") : [];
  return {
    ...cell,
    hits: ((cell.hits as number | undefined) ?? 0) + add,
    fighters: ((cell.fighters as number | undefined) ?? 0) + (joined ? 1 : 0),
    ...(name && names.length < RAID_NAMES_PER_SHARD ? { names: [...names, name] } : {}),
  };
}

export type AidResult = "ok" | "over" | "escaped" | "busy" | "error";

/**
 * 지원을 건다 — 기력과 따로. 내 표식과 내 칸에 같은 종류·시각을 적는다(다른 사람의 화면은 칸에서 본다).
 * 센 값은 그대로다. 처음 드는 사람이면 표식이 여기서 생긴다 — 지원만 해도 참여 상자를 받는다.
 * 규칙은 앞선 지원에서 RAID_AID_MIN_GAP이 지났는지만 본다. 60초 기다림은 화면이 지킨다.
 */
export async function aidRaid(uid: string, id: string, aid: RaidAidId, nick: string): Promise<AidResult> {
  const db = firebaseDb();
  if (!db) return "error";
  const shard = raidShard(uid);
  const raidRef = doc(db, "plazaRaids", id);
  const mineRef = doc(db, "plazaRaids", id, "fighters", uid);
  const shardRef = doc(db, "plazaRaids", id, "shards", String(shard));
  const name = nick.trim().slice(0, 12) || "정원지기";
  const code = RAID_AIDS[aid].code;
  try {
    return await runTransaction(db, async (tx): Promise<AidResult> => {
      const [raid, mine, cell] = await Promise.all([tx.get(raidRef), tx.get(mineRef), tx.get(shardRef)]);
      if (!raid.exists() || raid.get("defeatedAt")) return "over";
      const spawnedAt = toMillis(raid.get("spawnedAt"));
      if (spawnedAt !== null && Date.now() >= spawnedAt + RAID_LIFE) return "escaped";
      const before = mine.exists() ? mineOf((k) => mine.get(k), mine.get("aidAt")) : NO_MINE;
      tx.set(mineRef, {
        hits: before.hits,
        uses: before.uses,
        lastAt: serverTimestamp(),
        shard,
        aid: code,
        aidAt: serverTimestamp(),
        aids: before.aids + 1,
      });
      tx.set(shardRef, { ...shardAfter(cell.exists() ? cell.data() : {}, 0, mine.exists() ? "" : name, !mine.exists()), aid: code, aidAt: serverTimestamp(), aidBy: name });
      return "ok";
    });
  } catch (error) {
    if (permissionDenied(error)) return "busy";
    console.error("[raid] 지원을 걸지 못했다", error);
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
