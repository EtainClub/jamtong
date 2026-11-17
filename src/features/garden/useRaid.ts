"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import {
  advanceRaid,
  aidRaid,
  spawnRaid,
  strikeRaid,
  watchMine,
  watchRaidWave,
  type AidResult,
  type Raid,
  type RaidAidMark,
  type RaidMine,
  type StrikeResult,
} from "@/lib/firebase/raid";
import { pingRaidSpawn } from "@/lib/firebase/push";

import { ACTIVE_WINDOW, TEAM_MIN, TEAM_WINDOW } from "./raidPlay";
import { PUSH_FRESH } from "./raid/push";
import { useGarden } from "./store";
import { raidStars } from "./raid/rules";
import {
  kstDayNumber,
  nextRaidWave,
  RAID_AID_MIN_GAP,
  RAID_AIDS,
  RAID_FINISHER_MAX,
  RAID_LIFE,
  RAID_PER_DAY,
  raidShard,
  RAID_SHARDS,
  RAID_STRIKE_GAP,
  RAID_USES_PER_PERSON,
  raidAdvanceKind,
  raidFilled,
  raidFormsCleared,
  raidId,
  raidKey,
  raidNextNeed,
  raidPhase,
  raidPoolValue,
  raidSize,
  raidSplit,
  type RaidAidId,
  type RaidPhase,
  type RaidPool,
  type RaidRoleId,
} from "./rules";
import type { PlazaLevel } from "./types";

/**
 * 거대 잡초 — 광장이 무성해지면 하루 여러 번(물결) 나타난다. 설계는 docs/garden-game.md §3.8,
 * 거대 잡초 2.0은 docs/garden-miniroom.md §7.
 *
 * ★ 문지른 것은 화면에서 세고, 기력 한 번씩 서버로 보낸다. 빈틈이면 그 한 번이 두 배로 센다(규칙이 본다).
 *   한 사람은 1초에 한 번만 칠 수 있다(규칙). 손이 빠르면 쌓이고, 쌓인 것은 간격을 두고 차례로 나간다.
 * ★ 한 사람이 한 물결에 쓸 수 있는 기력에는 끝이 있다(RAID_USES_PER_PERSON). 나머지는 친구 몫이다.
 * ★ 필살기는 기력 여러 번을 한 커밋에 쓴다(finisher). 기력을 넘지 못한다.
 * ★ 지원(aid)은 기력과 따로다. 다른 사람이 건 지원은 이미 보고 있는 칸 구독에 실려 온다 —
 *   표식(fighters)은 본인만 읽으므로 남의 표식을 구독하지 않는다. 읽기 비용이 늘지 않는다.
 * ★ 다른 사람이 친 방은 칸(shard) 합계의 변화에서 내가 보낸 몫을 빼서 안다. 새로 쓰는 것은 없다.
 *
 * 파이어베이스 설정이 없는 환경에서는 이 브라우저 안의 거대 잡초로 대신한다.
 */

export interface CurrentRaid extends Raid {
  wave: number;
  id: string;
  phase: RaidPhase;
}

export interface RaidState {
  /** 오늘의 마지막 물결. undefined=아직 읽는 중, null=오늘은 아직 없다. */
  raid: CurrentRaid | null | undefined;
  /** 이 물결에서 내 표식 — 센 값·쓴 기력·지원. uses는 **지금 형태에서** 쓴 기력이다(형태가 바뀌면 0부터). */
  me: RaidMine;
  /** 내 역할(3.0 물결). 이 형태에서 이미 쳤으면 표식의 역할, 아니면 고른 것. 아직 안 골랐으면 null. */
  role: RaidRoleId | null;
  /** 역할을 고르거나 바꿀 수 있는가 — 3.0 물결이고 이 형태에서 아직 치지 않았다. */
  canPickRole: boolean;
  pickRole: (role: RaidRoleId) => void;
  /** 아직 보내지 않은 기력(필살기 포함). */
  queued: number;
  /** 다른 사람이 친 방이 들어온 소식. 최근 것부터 몇 개만. 화면이 주먹을 그린다. */
  pulses: OthersPulse[];
  /** 지금(최근 10초) 함께 치는 사람 수의 어림(나 포함). 칸 수로 세므로 실제보다 적을 수 있다. */
  together: number;
  /** 지금 나도 치고 있는가(최근 10초). */
  meActive: boolean;
  day: number;
  /** 다음 물결이 나올 수 있는 때. 오늘 몫을 다 썼거나 싸우는 중이면 null. */
  next: { wave: number; at: number } | null;
  /** 기력 한 번을 게이지 하나에 넣으려고 줄에 넣는다. 줄이 찼거나 기력을 다 썼으면 false(넣지 않았다). */
  strike: (pool?: RaidPool) => boolean;
  /** 필살기. 기력 uses번을 한 번에 쓴다. 실제로 쓴 기력과 센 값(못 보냈으면 0). */
  finisher: (uses: number, pool?: RaidPool) => Promise<{ uses: number; hits: number }>;
  /** 지원을 건다. */
  aid: (kind: RaidAidId) => Promise<AidResult>;
}

export interface OthersPulse {
  seq: number;
  /** 다른 사람이 친 방 수. */
  count: number;
  /** 짧은 사이에 여럿이 함께 쳤다(합동 공격). */
  team: boolean;
}

interface Shot {
  uses: number;
  /** 넣을 게이지. */
  pool: RaidPool;
  /** 규칙에 막혀(busy) 다시 보낸 횟수. */
  tries?: number;
  /** 필살기면 결과를 기다리는 사람. */
  done?: (landed: { uses: number; hits: number }) => void;
}

const LOCAL_KEY = "jamtong-raid-local-v3";
const ENDED_KEY = "jamtong-raid-ended";
const NO_MINE: RaidMine = { hits: 0, uses: 0, aids: 0, aidAt: null, role: null, form: 0 };

/** 끝남을 센 물결을 적는다. 처음이면 true. 사흘 치 물결만 남긴다. */
function markEnded(id: string): boolean {
  try {
    const seen = JSON.parse(localStorage.getItem(ENDED_KEY) ?? "[]") as string[];
    if (seen.includes(id)) return false;
    localStorage.setItem(ENDED_KEY, JSON.stringify([...seen, id].slice(-RAID_PER_DAY * 3)));
    return true;
  } catch {
    // 적지 못하면 세지 않는다. 같은 물결을 여러 번 세는 것보다 낫다.
    return false;
  }
}
const RAID_QUEUE_MAX = 4;
const RAID_BUSY_TRIES = 4;
const sum = (shots: Shot[]) => shots.reduce((n, q) => n + q.uses, 0);
const WAVES = Array.from({ length: RAID_PER_DAY }, (_, i) => i + 1);

interface LocalRaids {
  day: number;
  waves: Array<(Raid & { mine: RaidMine }) | null>;
}

function readLocal(day: number): LocalRaids {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "null") as LocalRaids | null;
    if (raw?.day === day) return raw;
  } catch {
    // 아래의 빈 장부로.
  }
  return { day, waves: WAVES.map(() => null) };
}

function writeLocal(raids: LocalRaids) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(raids));
  } catch {
    // 저장하지 못해도 이번 방문은 논다.
  }
}

export function useRaid(
  uid: string | null,
  nick: string,
  now: number,
  level: PlazaLevel,
  onResult: (result: StrikeResult, hits: number) => void,
): RaidState {
  const day = kstDayNumber(now);
  // 원격 물결. 날짜와 함께 둔다 — 자정을 넘기면 어제 것이 남지 않게.
  const [remote, setRemote] = useState<{ day: number; waves: Array<Raid | null | undefined> } | null>(null);
  const [mine, setMine] = useState<{ id: string; me: RaidMine } | null>(null);
  const [local, setLocal] = useState<LocalRaids | null>(() =>
    typeof window !== "undefined" && !firebaseConfigured ? readLocal(day) : null,
  );
  const [queued, setQueued] = useState(0);
  const queue = useRef<Shot[]>([]);
  const sending = useRef(false);
  const nickRef = useRef(nick);
  useEffect(() => {
    nickRef.current = nick;
  }, [nick]);

  // 다른 사람의 방. 칸마다 지난 값을 기억하고, 내 칸에서는 내가 보낸(보내는 중인) 몫을 먼저 뺀다.
  const myShard = uid ? raidShard(uid) : -1;
  const myShardRef = useRef(myShard);
  useEffect(() => {
    myShardRef.current = myShard;
  }, [myShard]);
  const lastShards = useRef<Record<string, number[]>>({});
  const pending = useRef<{ id: string; hits: number }>({ id: "", hits: 0 });
  const recent = useRef<Array<{ at: number; count: number }>>([]);
  const seq = useRef(0);
  const [pulses, setPulses] = useState<OthersPulse[]>([]);
  const [otherAt, setOtherAt] = useState<number[]>(() => Array.from({ length: RAID_SHARDS }, () => 0));
  const [mineAt, setMineAt] = useState(0);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const offs = WAVES.map((wave, i) => {
      const id = raidId(day, wave);
      return watchRaidWave(id, (raid) => {
        const shards = raid?.shardHits;
        const before = lastShards.current[id];
        if (shards) lastShards.current[id] = [...shards];
        if (shards && before && !raid.defeatedAt) {
          const at = Date.now();
          let others = 0;
          const touched: number[] = [];
          shards.forEach((h, n) => {
            let d = h - (before[n] ?? 0);
            if (d <= 0) return;
            if (n === myShardRef.current && pending.current.id === id) {
              const mine = Math.min(d, pending.current.hits);
              pending.current.hits -= mine;
              d -= mine;
            }
            if (d > 0) {
              others += d;
              touched.push(n);
            }
          });
          if (others > 0) {
            recent.current = [...recent.current.filter((r) => at - r.at < TEAM_WINDOW), { at, count: others }];
            const team = recent.current.reduce((n, r) => n + r.count, 0) >= TEAM_MIN;
            const next = { seq: ++seq.current, count: others, team };
            setPulses((old) => [...old.slice(-5), next]);
            setOtherAt((old) => old.map((t, n) => (touched.includes(n) ? at : t)));
          }
        }
        setRemote((old) => {
          const waves = old?.day === day ? [...old.waves] : WAVES.map(() => undefined);
          waves[i] = raid;
          return { day, waves };
        });
      });
    });
    return () => offs.forEach((off) => off());
  }, [day]);

  const waves: Array<Raid | null | undefined> = firebaseConfigured
    ? remote?.day === day
      ? remote.waves
      : WAVES.map(() => undefined)
    : local?.day === day
      ? local.waves
      : WAVES.map(() => null);
  const loaded = waves.every((w) => w !== undefined);

  const lastIndex = waves.reduce<number>((n, w, i) => (w ? i : n), -1);
  const last = lastIndex >= 0 ? waves[lastIndex]! : null;
  const raid: CurrentRaid | null | undefined = !loaded
    ? undefined
    : last
      ? { ...last, wave: lastIndex + 1, id: raidId(day, lastIndex + 1), phase: raidPhase(last, now) }
      : null;
  const next = loaded ? nextRaidWave(waves as Array<Raid | null>, now) : null;

  // 내 표식은 지금 물결 것만 본다.
  const currentId = raid?.id ?? null;

  // 갓 태어났거나 갓 변신한 물결을 봤으면 서버에 알린다 — 알림을 켠 기기에 푸시가 간다(docs/garden-raid-boss.md §8).
  // 세운 화면도, 그 직후에 본 화면도 부른다. 서버가 물결·형태마다 한 번만 보낸다.
  const shownForm = raid?.v3?.form ?? 1;
  const bornAt = raid?.v3 && raid.v3.form > 1 ? raid.v3.formAt : (raid?.spawnedAt ?? null);
  const fresh = raid?.phase === "active" && bornAt !== null && now - bornAt < PUSH_FRESH;
  useEffect(() => {
    if (firebaseConfigured && fresh && currentId) pingRaidSpawn(currentId, shownForm);
  }, [fresh, currentId, shownForm]);
  useEffect(() => {
    if (!firebaseConfigured || !uid || !currentId) return;
    return watchMine(currentId, uid, (me) => setMine({ id: currentId, me }));
  }, [uid, currentId]);

  const stored: RaidMine = firebaseConfigured
    ? mine && mine.id === currentId
      ? mine.me
      : NO_MINE
    : raid && local
      ? (local.waves[raid.wave - 1]?.mine ?? NO_MINE)
      : NO_MINE;
  // 3.0 물결: 기력은 형태마다 다시 찬다. 내 표식의 형태가 지금 형태와 다르면 이 형태에서는 아직 안 쓴 것이다.
  const formNow = raid?.v3?.form ?? 0;
  const inForm = formNow === 0 || stored.form === formNow;
  const me: RaidMine = inForm ? stored : { ...stored, uses: 0 };
  // 역할: 이 형태에서 이미 쳤으면 표식의 것(바꿀 수 없다), 아니면 고른 것(없으면 앞 형태의 것).
  const [picked, setPicked] = useState<{ id: string; role: RaidRoleId } | null>(null);
  const canPickRole = formNow !== 0 && raid?.phase === "active" && !(stored.role !== null && stored.form === formNow);
  // 1형은 누구나 몸통을 친다 — 역할을 고르지 않아도 바로 낫잡이로 든다(1형에서는 역할에 상관없이 두 배다).
  const role: RaidRoleId | null =
    formNow === 0
      ? null
      : canPickRole
        ? ((picked && picked.id === currentId ? picked.role : stored.role) ?? (formNow === 1 ? "reaper" : null))
        : stored.role;
  const roleRef = useRef(role);
  useEffect(() => {
    roleRef.current = role;
  }, [role]);
  const pickRole = useCallback(
    (next: RaidRoleId) => {
      if (currentId) setPicked({ id: currentId, role: next });
    },
    [currentId],
  );
  const usesRef = useRef(me.uses);
  const hitsRef = useRef(me.hits);
  useEffect(() => {
    usesRef.current = me.uses;
    hitsRef.current = me.hits;
  }, [me.uses, me.hits]);
  const raidRef = useRef(raid);
  useEffect(() => {
    raidRef.current = raid;
  });

  // 광장이 무성하고 다음 물결이 나올 때가 됐으면 세운다. 먼저 본 사람이 세우고, 나머지는 그것을 본다.
  const spawning = useRef(false);
  const due = level === "overgrown" && next !== null && now >= next.at ? next.wave : null;
  useEffect(() => {
    if (due === null || spawning.current) return;
    const size = raidSize(day, due);
    if (!firebaseConfigured) {
      const cur = readLocal(day);
      if (cur.waves[due - 1]) return;
      const waves = [...cur.waves];
      const first = raidSplit(size, 1);
      const born = Date.now();
      waves[due - 1] = {
        hp: first.h,
        hits: 0,
        fighters: 0,
        spawnedAt: born,
        defeatedAt: null,
        v3: { form: 1, formAt: born, size, n: size, brk: first.b, grd: first.g, base: { h: 0, b: 0, g: 0 }, brkHits: 0, grdHits: 0 },
        mine: NO_MINE,
      };
      const nextLocal = { day, waves };
      writeLocal(nextLocal);
      // 외부 저장소(localStorage)와 맞추는 것이다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocal(nextLocal);
      return;
    }
    if (!uid) return;
    spawning.current = true;
    spawnRaid(raidId(day, due), size)
      .then((made) => {
        if (made) track("raid_spawn", { wave: due });
      })
      .catch((error) => console.error("[raid] 거대 잡초를 세우지 못했다", error))
      .finally(() => {
        spawning.current = false;
      });
  }, [due, uid, day]);

  // 세 게이지가 다 찼는데 아직 넘어가지 않았으면 넘긴다 — 변신이거나 쓰러뜨리기(raid.ts의 advanceRaid).
  // 게이지는 칸에 나눠 세므로 마지막 한 방이 따로 넘기지 못한다. 누가 해도 한 번만 되고, 보는 사람 누구나 시도한다.
  // 막히면(다른 사람이 먼저 했으면) 다음 변화에서 다시 본다 — 3초에 한 번까지만.
  const filled = raid && raid.defeatedAt === null && raid.phase === "active" && raidFilled(raid) ? raid : null;
  // 곧 쓰러질 물결에는 더 보내지 않는다. 변신할 물결에 넘치게 들어간 것은 다음 형태의 몫이 되므로 그대로 보낸다.
  const ending = filled !== null && raidAdvanceKind(filled) === "finish";
  const fullRef = useRef(false);
  const advancing = useRef({ busy: false, at: 0 });
  const advanceKey = firebaseConfigured && uid !== null && filled ? `${filled.id}:${formNow}:${filled.hits + (filled.v3 ? filled.v3.brkHits + filled.v3.grdHits : 0)}` : null;
  useEffect(() => {
    fullRef.current = ending;
  }, [ending]);
  useEffect(() => {
    if (advanceKey === null || advancing.current.busy || Date.now() - advancing.current.at < 3_000) return;
    const id = advanceKey.split(":")[0];
    advancing.current = { busy: true, at: Date.now() };
    void advanceRaid(id).then((did) => {
      advancing.current.busy = false;
      // 내가 쓰러뜨렸고 나도 쳤으면 마지막 한 방의 기쁨을 준다. 아니면 화면이 바뀔 뿐이다.
      if (did === "finish" && hitsRef.current > 0) onResult("defeated", 0);
    });
  }, [advanceKey, onResult]);

  // 계측: 내가 든(쳤거나 지원한) 물결이 끝났다. 사람마다 물결당 한 번(이 기기 기준).
  const endedPhase = raid && raid.phase !== "active" && (me.hits > 0 || me.aids > 0) ? raid.phase : null;
  useEffect(() => {
    if (!raid || endedPhase === null || !markEnded(raid.id)) return;
    const end = raid.defeatedAt ?? (raid.spawnedAt !== null ? raid.spawnedAt + RAID_LIFE : null);
    track("raid_end", {
      raid: raid.id,
      wave: raid.wave,
      result: endedPhase,
      fighters: raid.fighters,
      hits: Math.min(raid.hits, raid.hp),
      hp: raid.hp,
      minutes: end !== null && raid.spawnedAt !== null ? Math.round((end - raid.spawnedAt) / 60_000) : -1,
      mine: me.hits,
      uses: me.uses,
      // 내가 쓴 기력 중 빈틈에 쓴 몫(빈틈의 한 번은 두 번으로 세므로 센 값 − 기력 = 빈틈에 쓴 기력).
      gapShare: me.uses > 0 ? Math.round(((me.hits - me.uses) / me.uses) * 100) / 100 : 0,
      aids: me.aids,
      stars: raidFormsCleared(raid, endedPhase) ?? raidStars(raid.spawnedAt, raid.defeatedAt),
      // 3.0: 어느 형태에서 끝났는지와 내 역할.
      form: raid.v3?.form ?? 0,
      role: me.role ?? "none",
    });
    // 끝난 순간 한 번만 본다. 숫자가 뒤늦게 바뀌어도 다시 보내지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raid?.id, endedPhase]);

  // 계측: 이 물결에 처음 한 방을 넣었다.
  const joined = useRef(new Set<string>());
  const fightersRef = useRef(0);
  useEffect(() => {
    fightersRef.current = raid?.fighters ?? 0;
  }, [raid?.fighters]);

  const wave = raid?.wave ?? null;
  const flush = useCallback(async () => {
    if (sending.current || wave === null) return;
    sending.current = true;
    const id = raidId(day, wave);
    const drop = () => {
      for (const q of queue.current) q.done?.({ uses: 0, hits: 0 });
      queue.current = [];
    };
    try {
      while (queue.current.length > 0) {
        // 합계가 이미 체력에 닿았다. 쓰러진 시각이 찍히는 중이니 더 보내지 않는다.
        if (fullRef.current) {
          drop();
          break;
        }
        const shot = queue.current[0];
        let result: StrikeResult;
        let landed = { uses: 0, hits: 0 };
        if (!firebaseConfigured) {
          const cur = readLocal(day);
          const w = cur.waves[wave - 1];
          if (!w || w.defeatedAt) result = "over";
          else if (w.spawnedAt !== null && Date.now() >= w.spawnedAt + RAID_LIFE) result = "escaped";
          else {
            // 이 브라우저 안의 거대 잡초 — 서버 규칙과 같은 셈을 여기서 한다(게이지 하나에 넣고, 다 차면 변신하거나 쓰러진다).
            const form = w.v3?.form ?? 0;
            const myRole = form === 0 ? null : roleRef.current;
            const usesWas = form !== 0 && w.mine.form !== form ? 0 : w.mine.uses;
            const n = Math.min(shot.uses, RAID_USES_PER_PERSON - usesWas);
            if (n <= 0) result = "capped";
            else {
              const pool: RaidPool = myRole ? shot.pool : 0;
              const at = Date.now();
              landed = { uses: n, hits: n * raidPoolValue(w, myRole, pool, at) };
              let next: Raid = {
                ...w,
                hits: w.hits + (pool === 0 ? landed.hits : 0),
                fighters: Math.max(1, w.fighters),
                v3: w.v3 ? { ...w.v3, brkHits: w.v3.brkHits + (pool === 1 ? landed.hits : 0), grdHits: w.v3.grdHits + (pool === 2 ? landed.hits : 0) } : undefined,
              };
              result = "ok";
              if (raidFilled(next)) {
                if (next.v3 && raidAdvanceKind(next) === "morph") {
                  const v = next.v3;
                  const nextForm = (v.form + 1) as 2 | 3;
                  const need = raidNextNeed(v.size, nextForm, next.fighters);
                  const part = raidSplit(need, nextForm);
                  const base = { h: next.hits, b: v.brkHits, g: v.grdHits };
                  next = { ...next, hp: base.h + part.h, v3: { ...v, form: nextForm, formAt: at, n: need, base, brk: base.b + part.b, grd: base.g + part.g } };
                } else {
                  next = { ...next, defeatedAt: at };
                  result = "defeated";
                }
              }
              const waves = [...cur.waves];
              waves[wave - 1] = { ...next, mine: { ...w.mine, hits: w.mine.hits + landed.hits, uses: usesWas + n, role: myRole, form } };
              const nextLocal = { day, waves };
              writeLocal(nextLocal);
              setLocal(nextLocal);
            }
          }
        } else if (!uid) {
          result = "error";
        } else {
          // 보내는 몫을 먼저 적어 둔다. 칸 소식이 커밋 응답보다 먼저 올 수 있다. 빈틈이면 두 배로 어림한다.
          const r = raidRef.current;
          const guess = shot.uses * (r ? raidPoolValue(r, roleRef.current, roleRef.current ? shot.pool : 0, Date.now()) : 1);
          pending.current = pending.current.id === id ? { id, hits: pending.current.hits + guess } : { id, hits: guess };
          const sent = await strikeRaid(uid, id, shot.uses, nickRef.current, { role: roleRef.current, pool: shot.pool });
          result = sent.result;
          landed = { uses: sent.uses, hits: sent.hits };
          // 덜 들어간 몫(기력 끝)과 못 들어간 몫은 되돌린다.
          if (pending.current.id === id) pending.current.hits = Math.max(0, pending.current.hits - Math.max(0, guess - landed.hits));
        }

        if (result === "busy") {
          // 1초 규칙에 걸렸다. 방은 그대로 두고 잠시 뒤 다시 보낸다.
          // 몇 번을 다시 보내도 막히면 1초 규칙이 아니다(예: 필살기를 모르는 옛 규칙). 그 방은 버린다.
          shot.tries = (shot.tries ?? 0) + 1;
          if (shot.tries < RAID_BUSY_TRIES) {
            await new Promise((r) => setTimeout(r, RAID_STRIKE_GAP));
            continue;
          }
          result = "error";
        }
        // 기다리는 사이 필살기가 앞에 끼었을 수 있다. 보낸 것만 뺀다.
        queue.current = queue.current.filter((q) => q !== shot);
        if (result === "ok" || result === "defeated") {
          shot.done?.(landed);
          setMineAt(Date.now());
          // 형태 보상은 그 형태에 든 사람만 받는다 — 든 형태를 내 장부에 적는다.
          useGarden.getState().markRaidPart(raidKey(day, wave), raidRef.current?.v3?.form ?? 1);
          if (hitsRef.current === 0 && !joined.current.has(id)) {
            joined.current.add(id);
            track("raid_join", { wave, fighters: fightersRef.current + 1 });
          }
        } else {
          // 쓰러졌거나, 도망갔거나, 기력을 다 썼거나, 닿지 못했다. 남은 방은 버린다.
          shot.done?.({ uses: 0, hits: 0 });
          drop();
        }
        setQueued(sum(queue.current));
        onResult(result, landed.hits);
        if (result !== "ok") break;
        if (queue.current.length > 0) await new Promise((r) => setTimeout(r, RAID_STRIKE_GAP));
      }
    } finally {
      setQueued(sum(queue.current));
      sending.current = false;
    }
  }, [day, wave, uid, onResult]);

  const strike = useCallback((pool: RaidPool = 0) => {
    // 쌓아 둘 수 있는 방에는 끝이 있다. 손을 뗀 뒤에도 한참 나가면 이상하다.
    if (queue.current.filter((q) => !q.done).length >= RAID_QUEUE_MAX) return false;
    // 기력을 넘는 방은 쌓지 않는다. 보내 봐야 규칙이 막는다.
    if (usesRef.current + sum(queue.current) >= RAID_USES_PER_PERSON) return false;
    queue.current.push({ uses: 1, pool });
    setQueued(sum(queue.current));
    void flush();
    return true;
  }, [flush]);

  const finisher = useCallback(
    (uses: number, pool: RaidPool = 0) => {
      const room = RAID_USES_PER_PERSON - usesRef.current - sum(queue.current);
      const n = Math.min(uses, RAID_FINISHER_MAX, room);
      if (n <= 0 || wave === null) return Promise.resolve({ uses: 0, hits: 0 });
      return new Promise<{ uses: number; hits: number }>((resolve) => {
        // 필살기는 줄 맨 앞으로. 쌓인 한 방들보다 먼저 터져야 손맛이 산다.
        queue.current.unshift({ uses: n, pool, done: resolve });
        setQueued(sum(queue.current));
        void flush();
      });
    },
    [flush, wave],
  );

  const aid = useCallback(
    async (kind: RaidAidId): Promise<AidResult> => {
      if (wave === null) return "over";
      const id = raidId(day, wave);
      let result: AidResult;
      if (!firebaseConfigured) {
        const cur = readLocal(day);
        const w = cur.waves[wave - 1];
        if (!w || w.defeatedAt) result = "over";
        else if (w.mine.aidAt !== null && Date.now() - w.mine.aidAt < RAID_AID_MIN_GAP) result = "busy";
        else {
          const at = Date.now();
          const waves = [...cur.waves];
          const marks: RaidAidMark[] = [...(w.aids ?? []).filter((m) => m.shard !== 0), { shard: 0, aid: kind, at, by: nickRef.current || "나" }];
          waves[wave - 1] = {
            ...w,
            fighters: Math.max(1, w.fighters),
            aids: marks,
            names: w.names?.length ? w.names : [nickRef.current || "나"],
            mine: { ...w.mine, aids: w.mine.aids + 1, aidAt: at },
          };
          const nextLocal = { day, waves };
          writeLocal(nextLocal);
          setLocal(nextLocal);
          result = "ok";
        }
      } else if (!uid) {
        result = "error";
      } else {
        result = await aidRaid(uid, id, kind, nickRef.current, roleRef.current);
        // 1초 규칙(방금 친 방)에 걸렸으면 한 번만 잠시 뒤 다시.
        if (result === "busy") {
          await new Promise((r) => setTimeout(r, RAID_STRIKE_GAP));
          result = await aidRaid(uid, id, kind, nickRef.current, roleRef.current);
        }
      }
      if (result === "ok") {
        track("raid_aid", { kind, wave });
        useGarden.getState().markRaidPart(raidKey(day, wave), raidRef.current?.v3?.form ?? 1);
      }
      return result;
    },
    [day, wave, uid],
  );

  const together = otherAt.filter((t) => now - t < ACTIVE_WINDOW).length;
  const meActive = now - mineAt < ACTIVE_WINDOW;

  return {
    raid,
    me,
    role,
    canPickRole,
    pickRole,
    queued,
    day,
    next,
    strike,
    finisher,
    aid,
    pulses,
    together: together + (meActive ? 1 : 0),
    meActive,
  };
}

/** 지원의 효과가 지금 켜져 있는가 — 칸에 실린 마지막 지원들에서 셈한다. 모두가 같은 칸을 보므로 거의 같다. */
export function aidActive(aids: readonly RaidAidMark[] | undefined, kind: RaidAidId, now: number): RaidAidMark | null {
  const ms = RAID_AIDS[kind].ms;
  const hit = (aids ?? []).filter((m) => m.aid === kind && now >= m.at - 2_000 && now < m.at + ms).sort((a, b) => b.at - a.at);
  return hit[0] ?? null;
}
