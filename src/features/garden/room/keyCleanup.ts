"use client";

import { useEffect } from "react";

import { firebaseConfigured } from "@/lib/firebase/client";
import { deleteKeyRecs } from "@/lib/firebase/roomKeys";

import { useGarden } from "../store";
import { mustWipeRecs, wipeRecs } from "./keyboard";
import { hasKeyboard } from "./rules";

/**
 * 들을 사람이 없는 녹음을 지운다(docs/garden-miniroom.md §4.5).
 *
 * 방 공개를 껐거나 키보드를 방에서 치웠으면 녹음은 공개 방에 실리지 않는데, 파일은 누구나 읽을 수 있는
 * 자리(roomKeys/{uid}/…)에 남는다. 그래서 이 기기가 지운다. 다 지운 뒤에만 키의 녹음 표시를 거둔다 —
 * 못 지웠으면 표시를 남겨 두고 다음에 정원을 열 때 다시 한다(표시가 곧 "지울 것" 목록이다).
 * 계정을 바꾼 기기나 정원 장부를 지운 기기는 옛 녹음을 지우지 못한다 — 배포 메모의 "남은 녹음 치우기".
 */
export function useKeyCleanup(uid: string | null, synced: boolean, say: (text: string) => void) {
  const room = useGarden((s) => s.data?.room);
  const shareOn = useGarden((s) => Boolean(s.data?.share.on));
  const slots = room ? mustWipeRecs(room.keys, shareOn, hasKeyboard(room)) : [];
  const todo = slots.map((slot) => ({ slot, ver: room!.keys[slot].ver }));
  const signature = todo.map((r) => `${r.slot}-${r.ver}`).join(",");

  useEffect(() => {
    if (!firebaseConfigured || !uid || !synced || !signature) return;
    let alive = true;
    const recs = signature.split(",").map((x) => {
      const [slot, ver] = x.split("-").map(Number);
      return { slot, ver };
    });
    deleteKeyRecs(uid, recs)
      .then(() => {
        if (!alive) return;
        const d = useGarden.getState().data;
        if (!d) return;
        useGarden.getState().setKeys(wipeRecs(d.room.keys, recs.map((r) => r.slot)));
        say("🎙 들을 사람이 없는 키 녹음을 지웠어요 · 그림은 그대로예요");
      })
      .catch((error) => console.error("[keyboard] 녹음을 지우지 못했다 — 다음에 다시 한다", error));
    return () => {
      alive = false;
    };
  }, [uid, synced, signature, say]);
}
