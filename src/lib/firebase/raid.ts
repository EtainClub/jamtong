"use client";

import { collection, doc, documentId, getDoc, getDocs, onSnapshot, query, runTransaction, serverTimestamp, Timestamp, updateDoc, where, type DocumentData } from "firebase/firestore";

import {
  MINUTE,
  RAID_AIDS,
  RAID_FINISHER_MAX,
  RAID_GAP_EVERY,
  RAID_GAP_MULT,
  RAID_NAMES_PER_SHARD,
  RAID_POOLS,
  RAID_ROLE_MULT,
  RAID_ROLES,
  RAID_SHARDS,
  RAID_USES_PER_PERSON,
  raidAdvanceKind,
  raidAidOf,
  raidClosesAtId,
  raidEndsFrom,
  raidFilled,
  raidId,
  raidNextNeed,
  raidRoleOf,
  raidShard,
  raidSplit,
  raidStrikeValue,
  type RaidAidId,
  type RaidPool,
  type RaidRoleId,
  type RaidV3,
  type RaidWave,
} from "@/features/garden/rules";

import { firebaseDb } from "./client";

/**
 * 거대 잡초 — 광장이 무성해지면 나타나는 레이드. 설계는 docs/garden-game.md §3.8.
 *
 * plazaRaids/{날짜번호}-{물결}  형태(form)·세 게이지의 목표(hp·brk·grd)·이 형태의 0점(base)·spawnedAt·defeatedAt. 누구나 읽는다.
 *   ├ shards/{0..7}             세 게이지(hits·brk·grd)와 참여 인원을 나눠 센다(분산 카운터). 누구나 읽는다.
 *   │                           칸마다 함께한 사람 이름(names)과 마지막 지원(aid·aidAt·aidBy)도 싣는다 —
 *   │                           모두가 이미 칸을 보고 있으므로 지원을 보려고 새로 구독하지 않는다.
 *   └ fighters/{uid}            한 사람이 이 물결에 센 값(hits)·쓴 기력(uses)·역할(role)·든 형태(form)·지원(aid·aidAt·aids),
 *                               마지막으로 쓴 때(lastAt), 올리는 칸(shard). 본인만 읽는다.
 *
 * ★ 한 방은 내 표식과 내 칸을 한 트랜잭션으로 함께 올린다. 물결 문서는 건드리지 않는다 —
 *   모두가 한 문서를 올리면 문서당 쓰기 한도에 막혀 사람이 몰릴수록 밀린다.
 * ★ 세 게이지(칸의 합)가 목표에 닿으면 누구든 advanceRaid로 다음으로 넘긴다 — 변신이거나 쓰러뜨리기.
 *   규칙이 칸을 모두 읽어 합계를 확인한다. 그 사이 몇 방이 목표를 넘을 수 있다. 화면은 목표에서 멈춰 그린다.
 * ★ 2.0 물결(form 없음)은 체력 하나로 그대로 싸운다. 설계는 docs/garden-raid-boss.md §3·§4.
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
  /** 칸마다 세 게이지를 더한 값. 누가 지금 치고 있는지 어림하는 데 쓴다(화면 연출). 칸을 아직 못 읽었으면 없다. */
  shardHits?: number[];
  /** 칸마다 마지막 지원(있는 것만). */
  aids?: RaidAidMark[];
  /** 함께한 사람 이름(칸에 적힌 것만 — 옛 화면으로 든 사람은 빠진다). */
  names?: string[];
}

/** 이 물결에서 내 표식. */
export interface RaidMine {
  hits: number;
  /** 쓴 기력 — 3.0 물결에서는 form 형태에서 쓴 것이다(형태가 바뀌면 0부터 다시). */
  uses: number;
  aids: number;
  /** 마지막 지원 시각(ms). */
  aidAt: number | null;
  /** 내 역할(3.0). 아직 안 골랐거나 2.0 화면으로 들었으면 null. */
  role: RaidRoleId | null;
  /** 내가 마지막으로 든 형태(3.0). 없으면 0. */
  form: number;
}

/** 물결 문서에서 3.0의 것을 읽는다. form이 없으면(2.0 물결) undefined. 갑옷·울타리 합계는 칸에서 채운다. */
function v3Of(get: (k: string) => unknown, formAt: unknown): RaidV3 | undefined {
  const form = get("form");
  if (form !== 1 && form !== 2 && form !== 3) return undefined;
  const num = (v: unknown) => (typeof v === "number" ? v : 0);
  const base = (get("base") ?? {}) as { h?: unknown; b?: unknown; g?: unknown };
  return {
    form,
    formAt: toMillis(formAt),
    size: num(get("size")),
    n: num(get("n")),
    brk: num(get("brk")),
    grd: num(get("grd")),
    base: { h: num(base.h), b: num(base.b), g: num(base.g) },
    brkHits: 0,
    grdHits: 0,
  };
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
  let shards: { hits: number; brk: number; grd: number; fighters: number; each: number[]; aids: RaidAidMark[]; names: string[] } | undefined;
  const emit = () => {
    if (base === undefined || shards === undefined) return;
    onRaid(
      base.exists
        ? {
            ...base,
            hits: base.hits + shards.hits,
            fighters: base.fighters + shards.fighters,
            v3: base.v3 ? { ...base.v3, brkHits: shards.brk, grdHits: shards.grd } : undefined,
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
        v3: v3Of((k) => snap.get(k), snap.get("formAt", { serverTimestamps: "estimate" })),
        closesAt: raidClosesAtId(id),
      };
      emit();
    },
    fail,
  );
  const offShards = onSnapshot(
    collection(db, "plazaRaids", id, "shards"),
    (snap) => {
      let hits = 0;
      let brk = 0;
      let grd = 0;
      let fighters = 0;
      const each = Array.from({ length: RAID_SHARDS }, () => 0);
      const aids: RaidAidMark[] = [];
      const names: string[] = [];
      snap.forEach((d) => {
        const h = (d.get("hits") as number | undefined) ?? 0;
        hits += h;
        brk += (d.get("brk") as number | undefined) ?? 0;
        grd += (d.get("grd") as number | undefined) ?? 0;
        fighters += (d.get("fighters") as number | undefined) ?? 0;
        const n = Number(d.id);
        // 칸마다의 값은 세 게이지를 더한 것 — 누가 지금 치고 있는지 보는 데만 쓴다.
        if (n >= 0 && n < RAID_SHARDS) each[n] = h + ((d.get("brk") as number | undefined) ?? 0) + ((d.get("grd") as number | undefined) ?? 0);
        const aid = raidAidOf(d.get("aid"));
        const at = toMillis(d.get("aidAt", { serverTimestamps: "estimate" }));
        const by = d.get("aidBy");
        if (aid && at !== null && typeof by === "string") aids.push({ shard: n, aid, at, by });
        const list = d.get("names");
        if (Array.isArray(list)) for (const name of list) if (typeof name === "string") names.push(name);
      });
      shards = { hits, brk, grd, fighters, each, aids, names };
      emit();
    },
    fail,
  );
  return () => {
    offRaid();
    offShards();
  };
}

const NO_MINE: RaidMine = { hits: 0, uses: 0, aids: 0, aidAt: null, role: null, form: 0 };

function mineOf(get: (k: string) => unknown, aidAt: unknown): RaidMine {
  const hits = (get("hits") as number | undefined) ?? 0;
  // 기력이 없는 옛 표식은 센 값이 곧 쓴 기력이다(규칙도 같게 본다).
  return {
    hits,
    uses: (get("uses") as number | undefined) ?? hits,
    aids: (get("aids") as number | undefined) ?? 0,
    aidAt: toMillis(aidAt),
    role: raidRoleOf(get("role")),
    form: (get("form") as number | undefined) ?? 0,
  };
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
      v3: v3Of((k) => d.get(k), d.get("formAt")),
      closesAt: raidClosesAtId(d.id),
    },
  }));
}

/**
 * 물결을 세운다. 보통 물결은 체력 하나(hp)뿐이고, 그 주의 변신하는 거대 잡초만 1형(3.1)으로 선다 — 규칙이 자리를 본다.
 * 이미 있으면 false(먼저 본 사람이 세웠다).
 */
export async function spawnRaid(id: string, born: { weekly: true; size: number } | { weekly: false; hp: number }): Promise<boolean> {
  const db = firebaseDb();
  if (!db) return false;
  const ref = doc(db, "plazaRaids", id);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists()) return false;
    if (born.weekly) {
      const first = raidSplit(born.size, 1);
      tx.set(ref, {
        hp: first.h,
        brk: first.b,
        grd: first.g,
        size: born.size,
        n: born.size,
        base: { h: 0, b: 0, g: 0 },
        form: 1,
        formAt: serverTimestamp(),
        hits: 0,
        fighters: 0,
        spawnedAt: serverTimestamp(),
        defeatedAt: null,
      });
    } else {
      tx.set(ref, { hp: born.hp, hits: 0, fighters: 0, spawnedAt: serverTimestamp(), defeatedAt: null });
    }
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

/** 한 번에 실어 보내는 내 선택 — 역할과 넣을 게이지. 2.0 물결에서는 쓰이지 않는다. */
export interface RaidAim {
  role: RaidRoleId | null;
  pool: RaidPool;
}

/** 표식에 적을 역할·형태·기력의 시작점. 물결의 형태와 내 표식의 형태가 다르면 새 형태의 첫 커밋이다(기력 0부터, 역할을 바꿀 수 있다). */
function entering(raid: DocumentData, before: RaidMine, aim: RaidAim): { v3: boolean; fresh: boolean; role: RaidRoleId | null; usesWas: number } {
  const form = raid.form as number | undefined;
  if (form === undefined) return { v3: false, fresh: false, role: null, usesWas: before.uses };
  // 형태 안에서는 역할을 못 바꾼다(규칙). 이미 든 형태면 표식의 역할을 따른다.
  const sameForm = before.role !== null && before.form === form;
  const role = sameForm ? before.role : (aim.role ?? before.role);
  const fresh = role !== null && before.form !== form;
  return { v3: true, fresh, role, usesWas: fresh ? 0 : before.uses };
}

/**
 * 기력을 쓴다 — 한 번(count=1) 또는 필살기(count>1, RAID_FINISHER_MAX까지). 기력을 넘는 만큼은 덜어 낸다.
 * 3.0 물결에서는 게이지 하나(aim.pool)에 넣는다 — 제 역할의 게이지면 RAID_ROLE_MULT배, 빈틈이면 다시 RAID_GAP_MULT배.
 * 빈틈은 이 기기의 시계로 정하고 규칙이 서버 시각으로 다시 본다 — 가장자리에서 막히면 반대로 한 번 더 보낸다(시계가 몇 초 어긋난 몫).
 * 처음 드는 사람이면 칸에 이름(nick)을 적는다(쓰러뜨린 뒤 "함께한 사람들").
 * 돌려주는 uses는 실제로 쓴 기력, hits는 센 값이다(ok일 때).
 */
export async function strikeRaid(
  uid: string,
  id: string,
  count = 1,
  nick = "",
  aim: RaidAim = { role: null, pool: 0 },
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
      // 물결 문서는 세울 때, 변신할 때, 쓰러질 때만 바뀐다.
      const [raid, mine, cell] = await Promise.all([tx.get(raidRef), tx.get(mineRef), tx.get(shardRef)]);
      if (!raid.exists() || raid.get("defeatedAt")) return { result: "over", uses: 0, hits: 0 };
      const spawnedAt = toMillis(raid.get("spawnedAt"));
      const now = Date.now();
      const ends = raidEndsFrom(spawnedAt, raid.get("form") !== undefined, raidClosesAtId(id));
      if (ends !== null && now >= ends) return { result: "escaped", uses: 0, hits: 0 };
      const before = mine.exists() ? mineOf((k) => mine.get(k), mine.get("aidAt")) : NO_MINE;
      const enter = entering(raid.data(), before, aim);
      const n = Math.min(want, RAID_USES_PER_PERSON - enter.usesWas);
      if (n <= 0) return { result: "capped", uses: 0, hits: 0 };
      // 역할이 없으면(2.0 물결이거나 아직 안 골랐으면) 체력에 역할 배수 없이 넣는다. 1형은 체력뿐이다.
      const pool: RaidPool = enter.role && raid.get("form") !== 1 ? aim.pool : 0;
      let gap = raidStrikeValue(now, spawnedAt, raid.get("hp") as number);
      if (flip) gap = gap === 1 ? RAID_GAP_MULT : 1;
      // 제 게이지면 두 배 — 1형은 누구나 몸통을 치므로 늘 두 배다(규칙도 같다).
      const onRole = enter.role !== null && (RAID_ROLES[enter.role].pool === pool || raid.get("form") === 1);
      const add = n * gap * (onRole ? RAID_ROLE_MULT : 1);
      // 지원 칸은 그대로 옮긴다. set은 통째로 쓰므로 빠뜨리면 지워진다.
      const kept: Record<string, unknown> = {};
      for (const k of ["aid", "aidAt", "aids"]) if (mine.get(k) !== undefined) kept[k] = mine.get(k);
      const part = enter.role ? { role: RAID_ROLES[enter.role].code, form: raid.get("form") as number, pool } : {};
      tx.set(mineRef, { ...kept, ...part, hits: before.hits + add, uses: enter.usesWas + n, lastAt: serverTimestamp(), shard });
      tx.set(shardRef, shardAfter(cell.exists() ? cell.data() : {}, RAID_POOLS[pool], add, mine.exists() ? "" : name, !mine.exists()));
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
function shardAfter(cell: Record<string, unknown>, key: (typeof RAID_POOLS)[number], add: number, name: string, joined: boolean): Record<string, unknown> {
  const names = Array.isArray(cell.names) ? (cell.names as unknown[]).filter((x): x is string => typeof x === "string") : [];
  return {
    ...cell,
    // 체력(hits)은 늘 있어야 한다 — 다른 게이지만 올리는 칸에도.
    hits: (cell.hits as number | undefined) ?? 0,
    [key]: ((cell[key] as number | undefined) ?? 0) + add,
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
export async function aidRaid(uid: string, id: string, aid: RaidAidId, nick: string, role: RaidRoleId | null = null): Promise<AidResult> {
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
      const ends = raidEndsFrom(spawnedAt, raid.get("form") !== undefined, raidClosesAtId(id));
      if (ends !== null && Date.now() >= ends) return "escaped";
      const before = mine.exists() ? mineOf((k) => mine.get(k), mine.get("aidAt")) : NO_MINE;
      // 새 형태에서 지원으로 먼저 들 수도 있다 — 그때도 형태를 맞추고 기력을 0부터 다시 센다.
      const enter = entering(raid.data(), before, { role, pool: 0 });
      const part = enter.role ? { role: RAID_ROLES[enter.role].code, form: raid.get("form") as number, pool: enter.fresh ? 0 : ((mine.get("pool") as number | undefined) ?? 0) } : {};
      tx.set(mineRef, {
        ...part,
        hits: before.hits,
        uses: enter.usesWas,
        lastAt: serverTimestamp(),
        shard,
        aid: code,
        aidAt: serverTimestamp(),
        aids: before.aids + 1,
      });
      tx.set(shardRef, { ...shardAfter(cell.exists() ? cell.data() : {}, "hits", 0, mine.exists() ? "" : name, !mine.exists()), aid: code, aidAt: serverTimestamp(), aidBy: name });
      return "ok";
    });
  } catch (error) {
    if (permissionDenied(error)) return "busy";
    console.error("[raid] 지원을 걸지 못했다", error);
    return "error";
  }
}

/**
 * 세 게이지가 다 찬 물결을 다음으로 넘긴다 — 변신(3형 전)이거나 쓰러뜨리기. 누가 불러도 한 번만 된다.
 * 무엇을 했는지 돌려준다(못 했으면 null).
 *
 * 트랜잭션을 쓰지 않는다. 칸은 싸우는 동안 초마다 바뀌어 트랜잭션이 끝없이 겨룬다. 그래서 한 번 읽고 그대로 쓴다 —
 * 규칙이 커밋 순간의 합계로 다시 보고, 읽은 뒤 몇 방 더 들어온 것(시작점·인원)은 받아 준다. 형태가 이미 바뀌었으면
 * 규칙이 막는다(form은 딱 하나만 오른다, 쓰러진 시각은 한 번만 찍힌다).
 */
export async function advanceRaid(id: string): Promise<"morph" | "finish" | null> {
  const db = firebaseDb();
  if (!db) return null;
  const raidRef = doc(db, "plazaRaids", id);
  try {
    const [raid, cells] = await Promise.all([getDoc(raidRef), getDocs(collection(db, "plazaRaids", id, "shards"))]);
    if (!raid.exists() || raid.get("defeatedAt")) return null;
    const sum = (key: string) => cells.docs.reduce((n, c) => n + ((c.get(key) as number | undefined) ?? 0), 0);
    const wave: RaidWave = {
      hp: raid.get("hp") as number,
      hits: ((raid.get("hits") as number | undefined) ?? 0) + sum("hits"),
      fighters: sum("fighters"),
      spawnedAt: toMillis(raid.get("spawnedAt")),
      defeatedAt: null,
      v3: v3Of((k) => raid.get(k), raid.get("formAt")),
    };
    if (wave.v3) wave.v3 = { ...wave.v3, brkHits: sum("brk"), grdHits: sum("grd") };
    if (!raidFilled(wave)) return null;
    if (wave.v3 && raidAdvanceKind(wave) === "morph") {
      const v = wave.v3;
      const form = (v.form + 1) as 2 | 3;
      const n = raidNextNeed(v.size, form, wave.fighters);
      const need = raidSplit(n, form);
      const base = { h: wave.hits, b: v.brkHits, g: v.grdHits };
      await updateDoc(raidRef, { form, formAt: serverTimestamp(), n, base, hp: base.h + need.h, brk: base.b + need.b, grd: base.g + need.g });
      return "morph";
    }
    await updateDoc(raidRef, { defeatedAt: serverTimestamp() });
    return "finish";
  } catch (error) {
    // 다른 사람이 먼저 넘겼다(규칙이 막는다). 다음 변화에서 다시 본다.
    if (!permissionDenied(error)) console.error("[raid] 거대 잡초를 다음으로 넘기지 못했다", error);
    return null;
  }
}
