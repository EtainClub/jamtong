"use client";

import { useCallback, useEffect, useState } from "react";

import { giveCare, watchBlooms, type Bloom } from "@/lib/firebase/blooms";
import { firebaseConfigured } from "@/lib/firebase/client";

import { BLOOM_CARE, CARE_PER_DAY } from "./rules";
import { useGarden } from "./store";

/**
 * 꽃밭 상태를 읽고 가꿈을 준다.
 *
 * 파이어베이스 설정이 없는 환경에서는 광장처럼 이 브라우저 안의 꽃밭으로
 * 대신한다. 혼자 노는 꽃밭이라 정원지기는 언제나 나다.
 */

export interface CareOutcome {
  given: number;
  bloomedNow: boolean;
  becameOwner: boolean;
}

export interface Blooms {
  blooms: Map<string, Bloom>;
  bloomed: number;
  care: (speciesId: string, delta: number) => Promise<CareOutcome>;
}

const LOCAL_KEY = "jamtong-blooms-local";

function readLocal(): Map<string, Bloom> {
  try {
    return new Map(Object.entries(JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "{}") as Record<string, Bloom>));
  } catch {
    return new Map();
  }
}

function writeLocal(blooms: Map<string, Bloom>) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(Object.fromEntries(blooms)));
  } catch {
    // 저장하지 못해도 이번 방문은 논다.
  }
}

const NOTHING: CareOutcome = { given: 0, bloomedNow: false, becameOwner: false };

export function useBlooms(uid: string | null): Blooms {
  const [blooms, setBlooms] = useState<Map<string, Bloom>>(() =>
    typeof window !== "undefined" && !firebaseConfigured ? readLocal() : new Map(),
  );

  useEffect(() => {
    if (!firebaseConfigured) return;
    return watchBlooms(setBlooms);
  }, []);

  const care = useCallback(
    async (speciesId: string, delta: number): Promise<CareOutcome> => {
      const garden = useGarden.getState();
      const room = garden.careRoom(speciesId, delta);
      const nick = garden.data?.nick;
      if (room <= 0 || !nick) return NOTHING;

      if (!firebaseConfigured) {
        const prev = blooms.get(speciesId);
        const total = (prev?.care ?? 0) + room;
        const mine = (garden.data?.care[speciesId] ?? 0) + room;
        const next = new Map(blooms);
        next.set(speciesId, {
          care: total,
          bloomedAt: prev?.bloomedAt ?? (total >= BLOOM_CARE ? Date.now() : null),
          ownerUid: "local",
          ownerNick: nick,
          ownerCare: mine,
        });
        writeLocal(next);
        setBlooms(next);
        garden.recordCare(speciesId, room, mine);
        return { given: room, bloomedNow: !prev?.bloomedAt && total >= BLOOM_CARE, becameOwner: !prev };
      }

      if (!uid) return NOTHING;
      const result = await giveCare(uid, speciesId, room, nick, BLOOM_CARE, CARE_PER_DAY);
      // capped는 다른 기기에서 오늘 몫을 다 쓴 경우다. 조용히 넘어간다.
      if (!result.ok) return NOTHING;
      garden.recordCare(speciesId, room, result.mine);
      return { given: room, bloomedNow: result.bloomedNow, becameOwner: result.becameOwner };
    },
    [blooms, uid],
  );

  const bloomed = [...blooms.values()].filter((b) => b.bloomedAt).length;
  return { blooms, bloomed, care };
}
