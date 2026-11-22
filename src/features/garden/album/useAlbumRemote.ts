"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { firebaseConfigured } from "@/lib/firebase/client";
import { loadPhotoComments, loadPhotos, loadPhotoScraps, syncPhotos, type PhotoComment, type PhotoScrap } from "@/lib/firebase/album";

import { useGarden } from "../store";
import type { PublicPhoto } from "./rules";

/**
 * 한 방의 사진첩 — 공개 방에서 읽는다. 손님은 사진까지, 주인은 댓글·퍼감만(사진은 내 장부에 있다).
 * undefined=읽는 중, null=읽지 못했다(방이 없거나 가렸다).
 */
export function useAlbumRemote(gid: string | null, withPhotos: boolean) {
  // 읽은 것은 방 id에 묶는다 — 다시 읽는 동안에도 앞의 것을 보이고, 방이 바뀌면 버린다.
  const [got, setGot] = useState<{ gid: string; photos?: PublicPhoto[] | null; comments?: PhotoComment[] | null; scraps?: PhotoScrap[] | null } | null>(null);
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((n) => n + 1), []);
  const live = Boolean(gid && firebaseConfigured);

  useEffect(() => {
    if (!gid || !live) return;
    let alive = true;
    const put = (patch: Partial<NonNullable<typeof got>>) =>
      alive && setGot((old) => ({ ...(old?.gid === gid ? old : { gid }), ...patch }));
    const fail = (what: string) => (error: unknown) => {
      console.error(`[album] ${what}을 읽지 못했다`, error);
      return null;
    };
    if (withPhotos) void loadPhotos(gid).catch(fail("사진")).then((photos) => put({ photos }));
    void loadPhotoComments(gid).catch(fail("댓글")).then((comments) => put({ comments }));
    void loadPhotoScraps(gid).catch(fail("퍼감")).then((scraps) => put({ scraps }));
    return () => {
      alive = false;
    };
  }, [gid, live, withPhotos, tick]);

  const mine = got && got.gid === gid ? got : null;
  return {
    photos: !live ? (withPhotos ? null : undefined) : mine?.photos,
    comments: !live ? null : mine?.comments,
    scraps: !live ? null : mine?.scraps,
    reload,
  };
}

const SYNC_DELAY = 1_500;

/**
 * 내 사진첩을 공개 방(gardens/{gid}/photos)에 맞추고, 받은 퍼감에서 잼을 받는다.
 * 방을 열었을 때만 한다. 계정과 맞춘 뒤에만 — 맞추기 전 정원은 남의 것일 수 있다(share.ts와 같다).
 * 공개 문서(gardens/{gid})는 공개를 켤 때 먼저 생긴다 — 사진 규칙이 그 문서의 주인을 본다.
 */
export function usePhotoSync(uid: string | null, synced: boolean, say: (text: string) => void) {
  const photos = useGarden((s) => s.data?.album?.photos);
  const on = useGarden((s) => Boolean(s.data?.share.on));
  const gid = useGarden((s) => s.data?.share.id ?? null);
  const last = useRef<{ gid: string; map: Map<string, string> } | null>(null);
  const warned = useRef(false);

  useEffect(() => {
    if (!firebaseConfigured || !uid || !synced || !on || !gid || !photos) return;
    const timer = setTimeout(() => {
      const before = last.current?.gid === gid ? last.current.map : null;
      syncPhotos(gid, photos, before)
        .then((map) => {
          last.current = { gid, map };
        })
        .catch((error) => {
          // 공개 문서가 아직 없으면(방금 공개를 켰다) 거절된다. 다음 변화나 다음 열기에 다시 한다.
          last.current = null;
          console.error("[album] 사진첩을 공개 방에 싣지 못했다", error);
          if (!warned.current) say("사진첩을 방에 싣지 못했어요. 잠시 뒤 다시 해 볼게요");
          warned.current = true;
        });
    }, SYNC_DELAY);
    return () => clearTimeout(timer);
  }, [uid, synced, on, gid, photos, say]);

  // 퍼감 보상 — 정원을 열 때 한 번 본다(빌려 읽기의 잼과 같은 방식).
  const claimed = useRef<string | null>(null);
  useEffect(() => {
    if (!firebaseConfigured || !uid || !synced || !on || !gid || claimed.current === gid) return;
    claimed.current = gid;
    loadPhotoScraps(gid)
      .then((scraps) => {
        const got = useGarden.getState().claimScraps(scraps.filter((s) => s.uid !== uid && s.at > 0));
        if (got && got.count > 0) say(`📷 내 사진이 ${got.count}번 퍼가졌어요${got.jam ? ` · 잼 +${got.jam}` : " · 오늘 보상은 다 받았어요"}`);
      })
      .catch((error) => console.error("[album] 퍼감을 읽지 못했다", error));
  }, [uid, synced, on, gid, say]);
}
