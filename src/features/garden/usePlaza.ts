"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { firebaseConfigured } from "@/lib/firebase/client";
import { cellId, pullWeed, watchPlaza, type PlazaCell, type PlazaDay } from "@/lib/firebase/plaza";

import { kstDay, PLAZA_CELLS, plazaLevel, regrowMinutes, weedStage, type WeedStage } from "./rules";
import type { PlazaLevel } from "./types";

/**
 * 광장 상태를 읽고 뽑는다.
 *
 * 파이어베이스 설정이 없는 환경(손에서 도는 dev 등)에서는 이 브라우저 안에서만
 * 도는 광장으로 대신한다. 혼자 노는 광장이지만 화면과 규칙은 같다.
 */

export interface Weed {
  cell: string;
  index: number;
  stage: WeedStage;
  since: number;
}

export interface Plaza {
  weeds: Weed[];
  level: PlazaLevel;
  today: PlazaDay;
  /** 뽑았으면 true. 그새 누가 먼저 뽑았으면 false. */
  pull: (cell: string) => Promise<boolean>;
  shared: boolean;
}

const LOCAL_KEY = "jamtong-plaza-local";

function readLocalCells(): Map<string, PlazaCell> {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "{}") as Record<string, number>;
    return new Map(Object.entries(raw).map(([id, regrowAt]) => [id, { id, regrowAt }]));
  } catch {
    return new Map();
  }
}

function writeLocalCells(cells: Map<string, PlazaCell>) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(Object.fromEntries([...cells].map(([id, c]) => [id, c.regrowAt]))));
  } catch {
    // 저장하지 못해도 이번 방문은 논다.
  }
}

export function usePlaza(uid: string | null, now: number): Plaza {
  // 혼자 쓰는 광장은 처음부터 이 브라우저에서 읽는다. 정원은 클라이언트에서만 그려진다.
  const [cells, setCells] = useState<Map<string, PlazaCell>>(() =>
    typeof window !== "undefined" && !firebaseConfigured ? readLocalCells() : new Map(),
  );
  const [today, setToday] = useState<PlazaDay>({ pulls: 0, gardeners: 0 });
  const day = kstDay(now);

  useEffect(() => {
    if (!firebaseConfigured) return;
    return watchPlaza(day, setCells, setToday);
  }, [day]);

  const weeds = useMemo(() => {
    const out: Weed[] = [];
    for (let i = 0; i < PLAZA_CELLS; i++) {
      const id = cellId(i);
      const since = cells.get(id)?.regrowAt ?? 0;
      if (since <= now) {
        // 처음부터 나 있던 잡초는 하루 묵은 것으로 친다.
        const age = since === 0 ? 24 * 3_600_000 : now - since;
        out.push({ cell: id, index: i, stage: weedStage(age), since });
      }
    }
    return out;
  }, [cells, now]);

  const pull = useCallback(
    async (cell: string) => {
      const minutes = regrowMinutes(Math.max(1, today.gardeners), Math.random());
      if (!firebaseConfigured) {
        const next = new Map(cells);
        next.set(cell, { id: cell, regrowAt: Date.now() + minutes * 60_000 });
        writeLocalCells(next);
        setCells(next);
        setToday((t) => ({ pulls: t.pulls + 1, gardeners: Math.max(1, t.gardeners) }));
        return true;
      }
      if (!uid) return false;
      const result = await pullWeed(uid, day, cell, minutes);
      return result === "ok";
    },
    [cells, day, today.gardeners, uid],
  );

  return { weeds, level: plazaLevel(weeds.length), today, pull, shared: firebaseConfigured };
}
