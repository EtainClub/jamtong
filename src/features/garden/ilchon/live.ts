"use client";

import { useCallback, useEffect, useState } from "react";
import { create } from "zustand";

import { firebaseConfigured } from "@/lib/firebase/client";
import { checkAdmin } from "@/lib/firebase/feedback";
import { loadPublicGardens, type PublicGarden } from "@/lib/firebase/gardens";
import { blockUser, cutIlchon, knockPending, loadGuestbook, loadIlchon, loadNotes, watchKnocks, type Knock, type LineDoc } from "@/lib/firebase/ilchon";

import { useGarden } from "../store";
import { BLOCK_MAX, FRIENDS_REFRESH, GUESTBOOK_SHOWN, newsText, readNews, type Friend } from "./rules";
import type { Species } from "../types";

/**
 * 1촌의 살아 있는 상태 — 저장하지 않는 것만(받은 신청, 1촌 방 문서, 운영자인지).
 * 저장할 것(설정·1촌 사본·보낸 신청·차단)은 정원 장부(store.ts의 ilchon)에 있다.
 *
 * ★ 읽기 비용(docs/garden-miniroom.md §5.5): 늘 켜 두는 구독은 받은 신청 하나뿐이다(바뀔 때만 온다).
 *   1촌 목록은 1촌 탭을 열 때 한 번, 1촌 방 문서는 10분에 한 번까지만 다시 읽는다.
 */
interface Live {
  knocks: Knock[];
  admin: boolean;
  rooms: Map<string, PublicGarden | null>;
  roomsAt: number;
}

export const useIlchonLive = create<Live>(() => ({ knocks: [], admin: false, rooms: new Map(), roomsAt: 0 }));

/** 받은 신청을 지켜보고, 운영자인지 한 번 본다. 방을 열었을 때만. */
export function useOwnerIlchon(uid: string | null, synced: boolean) {
  const on = useGarden((s) => Boolean(s.data?.share.on));
  const gid = useGarden((s) => s.data?.share.id ?? null);
  const blocked = useGarden((s) => s.data?.ilchon.blocked);

  useEffect(() => {
    if (!firebaseConfigured || !uid || !synced || !on || !gid) {
      useIlchonLive.setState({ knocks: [] });
      return;
    }
    return watchKnocks(gid, (knocks) => useIlchonLive.setState({ knocks }));
  }, [uid, synced, on, gid]);

  useEffect(() => {
    if (!firebaseConfigured || !uid) return;
    let alive = true;
    void checkAdmin(uid).then((admin) => alive && useIlchonLive.setState({ admin }));
    return () => {
      alive = false;
    };
  }, [uid]);

  // 차단한 사람의 신청은 규칙이 새로 받지 않는다. 차단 전에 온 것은 차단할 때 지운다 — 그래도 남았으면 그리지 않는다.
  const knocks = useIlchonLive((s) => s.knocks);
  return blocked?.length ? knocks.filter((k) => !blocked.some((b) => b.uid === k.uid)) : knocks;
}

/**
 * 1촌 목록과 1촌 방을 다시 받는다. 목록은 부를 때마다, 방 문서는 10분이 지났거나 force일 때만.
 * 보낸 신청도 여기서 맞춘다 — 1촌이 되었거나(수락) 신청이 사라졌으면(거절) 목록에서 뺀다.
 */
export async function refreshIlchon(gid: string, uid: string, force = false): Promise<void> {
  const docs = await loadIlchon(gid);
  const friends: Friend[] = docs.map((d) => ({ uid: d.uid, g: d.g, n: d.n, tag: d.tag, at: d.at }));
  const sent = useGarden.getState().data?.ilchon.sent ?? [];
  const still = await Promise.all(
    sent.map(async (s) => (friends.some((f) => f.g === s.g) ? false : await knockPending(s.g, uid).catch(() => true))),
  );
  useGarden.getState().updateIlchon((il) => ({ ...il, friends, sent: il.sent.filter((s) => still[sent.findIndex((x) => x.g === s.g)] !== false) }));

  const { roomsAt } = useIlchonLive.getState();
  if (!force && Date.now() - roomsAt < FRIENDS_REFRESH) return;
  const rooms = friends.length ? await loadPublicGardens(friends.map((f) => f.g)) : new Map<string, PublicGarden | null>();
  useIlchonLive.setState({ rooms, roomsAt: Date.now() });
}

/**
 * 차단. 그 사람의 신청을 지우고, 1촌이면 끊는다(상대에게 알리지 않는다). 그 뒤로 그 사람의
 * 신청·방명록은 규칙이 받지 않는다(gardens/{내 id}/blocks/{uid}).
 */
export async function blockPerson(me: { uid: string; gid: string }, who: { uid: string; n: string }): Promise<void> {
  const friend = useGarden.getState().data?.ilchon.friends.find((f) => f.uid === who.uid);
  if (friend) await cutIlchon(me, friend);
  await blockUser(me.gid, who.uid, who.n);
  useGarden.getState().updateIlchon((il) => ({
    ...il,
    friends: il.friends.filter((f) => f.uid !== who.uid),
    blocked: [{ uid: who.uid, n: who.n }, ...il.blocked.filter((b) => b.uid !== who.uid)].slice(0, BLOCK_MAX),
  }));
}

/** 1촌 소식 — 1촌마다 가장 최근 한 줄, 최근 것부터. 읽은 1촌 방이 없으면 빈 목록. */
export function ilchonNews(
  friends: readonly Friend[],
  rooms: ReadonlyMap<string, PublicGarden | null>,
  byId: ReadonlyMap<string, Species>,
): Array<{ g: string; nick: string; text: string; t: number }> {
  const out: Array<{ g: string; nick: string; text: string; t: number }> = [];
  for (const f of friends) {
    const room = rooms.get(f.g);
    if (!room) continue;
    for (const n of readNews(room.news)) {
      const text = newsText(n, byId);
      if (!text) continue;
      out.push({ g: f.g, nick: room.nick || f.n, text, t: n.t });
      break;
    }
  }
  return out.sort((a, b) => b.t - a.t);
}

/** 한 방의 1촌평과 방명록. 열 때 한 번 읽고, 쓰거나 지운 뒤 reload로 다시. */
export function useRoomLines(gid: string | null, enabled: boolean) {
  const [state, setState] = useState<{ key: string; notes: LineDoc[]; guestbook: LineDoc[] } | "error" | null>(null);
  const [version, setVersion] = useState(0);
  const key = `${gid}:${version}`;
  useEffect(() => {
    if (!firebaseConfigured || !gid || !enabled) return;
    let alive = true;
    Promise.all([loadNotes(gid), loadGuestbook(gid, GUESTBOOK_SHOWN)])
      .then(([notes, guestbook]) => alive && setState({ key, notes, guestbook }))
      .catch((error) => {
        console.error("[ilchon] 1촌평·방명록을 읽지 못했다", error);
        if (alive) setState("error");
      });
    return () => {
      alive = false;
    };
  }, [gid, enabled, key]);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const loaded = state && state !== "error" && state.key.startsWith(`${gid}:`) ? state : null;
  return { notes: loaded?.notes ?? null, guestbook: loaded?.guestbook ?? null, error: state === "error", reload };
}
