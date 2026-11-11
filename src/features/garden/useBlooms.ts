"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  /** 서버에 쓰지 못했다(네트워크·규칙). 오늘 몫을 다 쓴 것과 구별한다. */
  failed?: boolean;
  bloomedNow: boolean;
  becameOwner: boolean;
}

export interface Blooms {
  blooms: Map<string, Bloom>;
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

  /*
   * 이 브라우저 안의 꽃밭(파이어베이스 없는 환경)의 최신 값. 줄 세운 가꿈이 앞 차례의
   * 결과를 바로 읽어야 하는데, state는 다음 렌더 전까지 옛 값이다.
   */
  const localRef = useRef(blooms);

  /*
   * 같은 업적의 가꿈은 한 줄로 세운다.
   *
   * '모두 수확'은 칸마다 가꿈을 한꺼번에 보낸다. 같은 업적이 두 칸에 있으면 두 트랜잭션이
   * 같은 옛 값을 읽고 같은 값을 쓴다. 앞의 것이 먼저 들어가면 뒤의 것은 규칙 눈에
   * "가꿈 +0"이라 권한 거부(permission-denied)로 떨어진다 — 재시도되지 않고 한 칸의
   * 가꿈이 사라진다. 앞 차례가 끝난 뒤 다음 차례가 그 결과를 읽게 하면 둘 다 들어간다.
   */
  const queue = useRef(new Map<string, Promise<unknown>>());

  const careNow = useCallback(
    async (speciesId: string, delta: number): Promise<CareOutcome> => {
      const garden = useGarden.getState();
      const room = garden.careRoom(speciesId, delta);
      const nick = garden.data?.nick;
      if (room <= 0 || !nick) return NOTHING;

      if (!firebaseConfigured) {
        const prev = localRef.current.get(speciesId);
        const total = (prev?.care ?? 0) + room;
        const mine = (garden.data?.care[speciesId] ?? 0) + room;
        const next = new Map(localRef.current);
        next.set(speciesId, {
          care: total,
          bloomedAt: prev?.bloomedAt ?? (total >= BLOOM_CARE ? Date.now() : null),
          ownerUid: "local",
          ownerNick: nick,
          ownerCare: mine,
          hiddenNick: null,
        });
        localRef.current = next;
        writeLocal(next);
        setBlooms(next);
        garden.recordCare(speciesId, room, mine);
        return { given: room, bloomedNow: !prev?.bloomedAt && total >= BLOOM_CARE, becameOwner: !prev };
      }

      if (!uid) return { ...NOTHING, failed: true };
      const result = await giveCare(uid, speciesId, room, nick, BLOOM_CARE, CARE_PER_DAY);
      // capped는 다른 기기에서 오늘 몫을 다 쓴 경우다. 조용히 넘어간다.
      if (!result.ok) return result.reason === "capped" ? NOTHING : { ...NOTHING, failed: true };
      garden.recordCare(speciesId, room, result.mine);
      return { given: room, bloomedNow: result.bloomedNow, becameOwner: result.becameOwner };
    },
    [uid],
  );

  const care = useCallback(
    (speciesId: string, delta: number): Promise<CareOutcome> => {
      const before = queue.current.get(speciesId) ?? Promise.resolve();
      const run = before.catch(() => {}).then(() => careNow(speciesId, delta));
      queue.current.set(speciesId, run);
      // 줄이 비면 지운다. 업적 수만큼 Promise가 쌓여 남지 않게.
      void run.finally(() => {
        if (queue.current.get(speciesId) === run) queue.current.delete(speciesId);
      });
      return run;
    },
    [careNow],
  );

  return { blooms, care };
}
