"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { firebaseConfigured } from "@/lib/firebase/client";
import { spawnRaid, strikeRaid, watchRaid, type Raid, type StrikeResult } from "@/lib/firebase/raid";

import { kstDayNumber, RAID_STRIKE_GAP, raidHp } from "./rules";
import type { PlazaLevel } from "./types";

/**
 * 거대 잡초 — 광장이 무성해지면 하루 한 번 나타난다. 설계는 docs/garden-game.md §3.8.
 *
 * ★ 문지른 것은 화면에서 세고, 한 방씩 서버로 보낸다.
 *   한 사람은 1초에 한 번만 칠 수 있다(규칙). 손이 빠르면 방이 쌓이고, 쌓인 방은
 *   간격을 두고 차례로 나간다. 그래서 빨리 문질러도 헛손질이 없다.
 *
 * 파이어베이스 설정이 없는 환경에서는 이 브라우저 안의 거대 잡초로 대신한다.
 */

export interface RaidState {
  /** undefined=아직 읽는 중, null=오늘은 없다. */
  raid: Raid | null | undefined;
  /** 내가 때린 수. */
  mine: number;
  /** 아직 보내지 않은 방. */
  queued: number;
  day: number;
  strike: () => void;
}

const LOCAL_KEY = "jamtong-raid-local";
const RAID_QUEUE_MAX = 4;

interface LocalRaid extends Raid {
  day: number;
  mine: number;
}

function readLocal(day: number): LocalRaid | null {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "null") as LocalRaid | null;
    return raw?.day === day ? raw : null;
  } catch {
    return null;
  }
}

function writeLocal(raid: LocalRaid) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(raid));
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
  const [remote, setRemote] = useState<{ day: number; raid: Raid | null } | null>(null);
  const [mine, setMine] = useState<{ day: number; hits: number }>({ day, hits: 0 });
  const [local, setLocal] = useState<LocalRaid | null>(() =>
    typeof window !== "undefined" && !firebaseConfigured ? readLocal(day) : null,
  );
  const [queued, setQueued] = useState(0);
  const queue = useRef(0);
  const sending = useRef(false);

  useEffect(() => {
    if (!firebaseConfigured) return;
    return watchRaid(
      day,
      uid,
      (raid) => setRemote({ day, raid }),
      (hits) => setMine({ day, hits }),
    );
  }, [day, uid]);

  const raid: Raid | null | undefined = firebaseConfigured
    ? remote?.day === day
      ? remote.raid
      : undefined
    : local?.day === day
      ? local
      : null;

  // 광장이 무성한데 오늘 거대 잡초가 없으면 세운다. 먼저 본 사람이 세우고, 나머지는 그것을 본다.
  const spawning = useRef(false);
  useEffect(() => {
    if (level !== "overgrown" || raid !== null || spawning.current) return;
    const hp = raidHp(gardenersToday);
    if (!firebaseConfigured) {
      const next = { day, hp, hits: 0, fighters: 0, defeatedAt: null, mine: 0 };
      writeLocal(next);
      // 외부 저장소(localStorage)와 맞추는 것이다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocal(next);
      return;
    }
    if (!uid) return;
    spawning.current = true;
    spawnRaid(day, hp)
      .catch((error) => console.error("[raid] 거대 잡초를 세우지 못했다", error))
      .finally(() => {
        spawning.current = false;
      });
  }, [level, raid, uid, day, gardenersToday]);

  const flush = useCallback(async () => {
    if (sending.current) return;
    sending.current = true;
    try {
      while (queue.current > 0) {
        let result: StrikeResult;
        if (!firebaseConfigured) {
          const cur = readLocal(day);
          if (!cur || cur.defeatedAt) {
            result = "over";
          } else {
            const hits = cur.hits + 1;
            const next = {
              ...cur,
              hits,
              mine: cur.mine + 1,
              fighters: Math.max(1, cur.fighters),
              defeatedAt: hits >= cur.hp ? Date.now() : null,
            };
            writeLocal(next);
            setLocal(next);
            result = next.defeatedAt ? "defeated" : "ok";
          }
        } else if (!uid) {
          result = "error";
        } else {
          result = await strikeRaid(uid, day);
        }

        if (result === "busy") {
          // 1초 규칙에 걸렸다. 방은 그대로 두고 잠시 뒤 다시 보낸다.
          await new Promise((r) => setTimeout(r, RAID_STRIKE_GAP));
          continue;
        }
        if (result === "ok" || result === "defeated") {
          queue.current -= 1;
        } else {
          // 이미 쓰러졌거나 닿지 못했다. 남은 방은 버린다 — 다시 보낼 곳이 없다.
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
  }, [day, uid, onResult]);

  const strike = useCallback(() => {
    // 쌓아 둘 수 있는 방에는 끝이 있다. 손을 뗀 뒤에도 한참 나가면 이상하다.
    if (queue.current >= RAID_QUEUE_MAX) return;
    queue.current += 1;
    setQueued(queue.current);
    void flush();
  }, [flush]);

  const myHits = firebaseConfigured ? (mine.day === day ? mine.hits : 0) : local?.day === day ? local.mine : 0;
  return { raid, mine: myHits, queued, day, strike };
}
