"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import { finishRaid, spawnRaid, strikeRaid, watchMyHits, watchRaidWave, type Raid, type StrikeResult } from "@/lib/firebase/raid";

import {
  kstDayNumber,
  nextRaidWave,
  RAID_HITS_PER_PERSON,
  RAID_LIFE,
  RAID_PER_DAY,
  RAID_STRIKE_GAP,
  raidHp,
  raidId,
  raidPhase,
  type RaidPhase,
} from "./rules";
import type { PlazaLevel } from "./types";

/**
 * 거대 잡초 — 광장이 무성해지면 하루 여러 번(물결) 나타난다. 설계는 docs/garden-game.md §3.8.
 *
 * ★ 문지른 것은 화면에서 세고, 한 방씩 서버로 보낸다.
 *   한 사람은 1초에 한 번만 칠 수 있다(규칙). 손이 빠르면 방이 쌓이고, 쌓인 방은
 *   간격을 두고 차례로 나간다. 그래서 빨리 문질러도 헛손질이 없다.
 * ★ 한 사람이 한 물결에 칠 수 있는 수에는 끝이 있다(RAID_HITS_PER_PERSON). 나머지는 친구 몫이다.
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
  /** 이 물결에서 내가 때린 수. */
  mine: number;
  /** 아직 보내지 않은 방. */
  queued: number;
  day: number;
  /** 다음 물결이 나올 수 있는 때. 오늘 몫을 다 썼거나 싸우는 중이면 null. */
  next: { wave: number; at: number } | null;
  strike: () => void;
}

const LOCAL_KEY = "jamtong-raid-local-v2";
const ENDED_KEY = "jamtong-raid-ended";

/** 끝남을 센 물결을 적는다. 처음이면 true. 오늘 몫(세 물결)만 넉넉히 남긴다. */
function markEnded(id: string): boolean {
  try {
    const seen = JSON.parse(localStorage.getItem(ENDED_KEY) ?? "[]") as string[];
    if (seen.includes(id)) return false;
    localStorage.setItem(ENDED_KEY, JSON.stringify([...seen, id].slice(-9)));
    return true;
  } catch {
    // 적지 못하면 세지 않는다. 같은 물결을 여러 번 세는 것보다 낫다.
    return false;
  }
}
const RAID_QUEUE_MAX = 4;
const WAVES = Array.from({ length: RAID_PER_DAY }, (_, i) => i + 1);

interface LocalRaids {
  day: number;
  waves: Array<(Raid & { mine: number }) | null>;
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
  now: number,
  level: PlazaLevel,
  gardenersToday: number,
  onResult: (result: StrikeResult) => void,
): RaidState {
  const day = kstDayNumber(now);
  // 원격 물결. 날짜와 함께 둔다 — 자정을 넘기면 어제 것이 남지 않게.
  const [remote, setRemote] = useState<{ day: number; waves: Array<Raid | null | undefined> } | null>(null);
  const [mine, setMine] = useState<{ id: string; hits: number } | null>(null);
  const [local, setLocal] = useState<LocalRaids | null>(() =>
    typeof window !== "undefined" && !firebaseConfigured ? readLocal(day) : null,
  );
  const [queued, setQueued] = useState(0);
  const queue = useRef(0);
  const sending = useRef(false);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const offs = WAVES.map((wave, i) =>
      watchRaidWave(raidId(day, wave), (raid) =>
        setRemote((old) => {
          const waves = old?.day === day ? [...old.waves] : WAVES.map(() => undefined);
          waves[i] = raid;
          return { day, waves };
        }),
      ),
    );
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

  // 내가 때린 수는 지금 물결 것만 본다.
  const currentId = raid?.id ?? null;
  useEffect(() => {
    if (!firebaseConfigured || !uid || !currentId) return;
    return watchMyHits(currentId, uid, (hits) => setMine({ id: currentId, hits }));
  }, [uid, currentId]);

  const myHits = firebaseConfigured
    ? mine && mine.id === currentId
      ? mine.hits
      : 0
    : raid && local
      ? (local.waves[raid.wave - 1]?.mine ?? 0)
      : 0;
  const myHitsRef = useRef(myHits);
  useEffect(() => {
    myHitsRef.current = myHits;
  }, [myHits]);

  // 광장이 무성하고 다음 물결이 나올 때가 됐으면 세운다. 먼저 본 사람이 세우고, 나머지는 그것을 본다.
  const spawning = useRef(false);
  const due = level === "overgrown" && next !== null && now >= next.at ? next.wave : null;
  useEffect(() => {
    if (due === null || spawning.current) return;
    const hp = raidHp(gardenersToday);
    if (!firebaseConfigured) {
      const cur = readLocal(day);
      if (cur.waves[due - 1]) return;
      const waves = [...cur.waves];
      waves[due - 1] = { hp, hits: 0, fighters: 0, spawnedAt: Date.now(), defeatedAt: null, mine: 0 };
      const nextLocal = { day, waves };
      writeLocal(nextLocal);
      // 외부 저장소(localStorage)와 맞추는 것이다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocal(nextLocal);
      return;
    }
    if (!uid) return;
    spawning.current = true;
    spawnRaid(raidId(day, due), hp)
      .then((made) => {
        if (made) track("raid_spawn", { wave: due });
      })
      .catch((error) => console.error("[raid] 거대 잡초를 세우지 못했다", error))
      .finally(() => {
        spawning.current = false;
      });
  }, [due, uid, day, gardenersToday]);

  // 합계가 체력에 닿았는데 아직 쓰러진 시각이 없으면 찍는다. 맞은 수는 칸에 나눠 세므로
  // 마지막 한 방이 따로 찍지 못한다(raid.ts). 누가 찍어도 한 번만 찍히고, 보는 사람 누구나 시도한다.
  const finishing = useRef<string | null>(null);
  const full = firebaseConfigured && uid !== null && raid?.defeatedAt === null && raid.hits >= raid.hp ? raid.id : null;
  const fullRef = useRef(false);
  useEffect(() => {
    fullRef.current = full !== null;
    if (full === null || finishing.current === full) return;
    finishing.current = full;
    void finishRaid(full).then((mine) => {
      // 내가 찍었고 나도 때렸으면 마지막 한 방의 기쁨을 준다. 아니면 화면이 쓰러진 모습으로 바뀔 뿐이다.
      if (mine && myHitsRef.current > 0) onResult("defeated");
      // 찍지 못했으면(겨루다 졌거나 막혔으면) 다음 변화에서 다시 시도한다.
      if (!mine) finishing.current = null;
    });
  }, [full, onResult]);

  // 계측: 내가 때린 물결이 끝났다. 때린 사람마다 물결당 한 번(이 기기 기준).
  const endedPhase = raid && raid.phase !== "active" && myHits > 0 ? raid.phase : null;
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
      mine: myHits,
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
    try {
      while (queue.current > 0) {
        // 합계가 이미 체력에 닿았다. 쓰러진 시각이 찍히는 중이니 더 보내지 않는다.
        if (fullRef.current) {
          queue.current = 0;
          break;
        }
        let result: StrikeResult;
        if (!firebaseConfigured) {
          const cur = readLocal(day);
          const w = cur.waves[wave - 1];
          if (!w || w.defeatedAt) result = "over";
          else if (w.spawnedAt !== null && Date.now() >= w.spawnedAt + RAID_LIFE) result = "escaped";
          else if (w.mine >= RAID_HITS_PER_PERSON) result = "capped";
          else {
            const hits = w.hits + 1;
            const waves = [...cur.waves];
            waves[wave - 1] = {
              ...w,
              hits,
              mine: w.mine + 1,
              fighters: Math.max(1, w.fighters),
              defeatedAt: hits >= w.hp ? Date.now() : null,
            };
            const nextLocal = { day, waves };
            writeLocal(nextLocal);
            setLocal(nextLocal);
            result = hits >= w.hp ? "defeated" : "ok";
          }
        } else if (!uid) {
          result = "error";
        } else {
          result = await strikeRaid(uid, id);
        }

        if (result === "busy") {
          // 1초 규칙에 걸렸다. 방은 그대로 두고 잠시 뒤 다시 보낸다.
          await new Promise((r) => setTimeout(r, RAID_STRIKE_GAP));
          continue;
        }
        if (result === "ok" || result === "defeated") {
          queue.current -= 1;
          if (myHitsRef.current === 0 && !joined.current.has(id)) {
            joined.current.add(id);
            track("raid_join", { wave, fighters: fightersRef.current + 1 });
          }
        } else {
          // 쓰러졌거나, 도망갔거나, 내 몫을 다 쳤거나, 닿지 못했다. 남은 방은 버린다.
          queue.current = 0;
        }
        setQueued(queue.current);
        onResult(result);
        if (result !== "ok") break;
        if (queue.current > 0) await new Promise((r) => setTimeout(r, RAID_STRIKE_GAP));
      }
    } finally {
      queue.current = Math.max(0, queue.current);
      setQueued(queue.current);
      sending.current = false;
    }
  }, [day, wave, uid, onResult]);

  const strike = useCallback(() => {
    // 쌓아 둘 수 있는 방에는 끝이 있다. 손을 뗀 뒤에도 한참 나가면 이상하다.
    if (queue.current >= RAID_QUEUE_MAX) return;
    // 내 몫을 넘는 방은 쌓지 않는다. 보내 봐야 규칙이 막는다.
    if (myHitsRef.current + queue.current >= RAID_HITS_PER_PERSON) return;
    queue.current += 1;
    setQueued(queue.current);
    void flush();
  }, [flush]);

  return { raid, mine: myHits, queued, day, next, strike };
}
