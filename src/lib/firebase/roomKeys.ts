"use client";

import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { KEY_REC_MAX_BYTES, recPath } from "@/features/garden/room/keyboard";

import { firebaseStorage } from "./client";
import { loadRoomHidden, reportRoomPart, setRoomHidden } from "./roomMod";

/**
 * 내 키보드의 녹음과 운영자 가리기 (docs/garden-miniroom.md §4.5).
 *
 * roomKeys/{uid}/{칸}-{판}.wav   Storage. 녹음 하나. 누구나 읽는다(공개 방의 소리다). 주인만 올리고, 주인·운영자가 지운다.
 * gardens/{gid}/mod/keys          Firestore. 운영자가 그 방의 키보드를 가렸는지({hidden, at}). 누구나 읽고 운영자만 쓴다.
 *
 * ★ 읽기를 열어 둔 대가는 "지울 때 정말 지운다"이다(인포그래픽·프로필 사진과 같다). 방 공개를 끄거나 키보드를 치우거나
 *   처음으로 되돌리면 이 기기가 녹음을 지운다(room/keyCleanup.ts·KeyboardSheet.tsx). 지우지 못한 파일은 docs의 배포 메모대로 치운다.
 * ★ 판 번호를 파일 이름에 넣는다. 같은 주소를 덮으면 브라우저·CDN이 옛 목소리를 들려준다. 규칙도 덮어쓰기를 막는다.
 */

function need() {
  const storage = firebaseStorage();
  if (!storage) throw new Error("파이어베이스 설정이 없다");
  return storage;
}

/** 바꾼(또는 사람이 고른 원래) 목소리 WAV를 올린다. 올린 뒤에야 방의 키가 이 판을 가리킨다. */
export async function uploadKeyRec(uid: string, slot: number, ver: number, wav: Blob): Promise<void> {
  if (wav.type !== "audio/wav") throw new Error("WAV가 아니다");
  if (wav.size >= KEY_REC_MAX_BYTES) throw new Error("녹음이 너무 크다");
  await uploadBytes(ref(need(), recPath(uid, slot, ver)), wav, {
    contentType: "audio/wav",
    cacheControl: "public, max-age=31536000, immutable",
  });
}

/** 녹음 하나를 지운다. 이미 없으면 지운 것으로 친다. */
export async function deleteKeyRec(uid: string, slot: number, ver: number): Promise<void> {
  try {
    await deleteObject(ref(need(), recPath(uid, slot, ver)));
  } catch (error) {
    if ((error as { code?: string }).code === "storage/object-not-found") return;
    throw error;
  }
}

/** 여럿을 지운다. 하나라도 못 지우면 던진다 — 부르는 쪽은 그 키의 녹음 표시를 남겨 두고 다음에 다시 한다. */
export async function deleteKeyRecs(uid: string, recs: ReadonlyArray<{ slot: number; ver: number }>): Promise<void> {
  const results = await Promise.allSettled(recs.map((r) => deleteKeyRec(uid, r.slot, r.ver)));
  const failed = results.find((r) => r.status === "rejected");
  if (failed) throw (failed as PromiseRejectedResult).reason;
}

const urls = new Map<string, Promise<string | null>>();

/** 녹음의 내려받기 주소. 없거나(지워졌거나) 읽지 못하면 null — 그 키는 조용하다. 주소는 이번 세션 동안 기억한다. */
export function keyRecUrl(uid: string, slot: number, ver: number): Promise<string | null> {
  const path = recPath(uid, slot, ver);
  let hit = urls.get(path);
  if (!hit) {
    hit = getDownloadURL(ref(need(), path)).catch((error) => {
      console.warn("[keyboard] 녹음 주소를 받지 못했다", path, (error as { code?: string }).code);
      urls.delete(path);
      return null;
    });
    urls.set(path, hit);
  }
  return hit;
}

/** 운영자가 이 방의 키보드를 가렸는가. 방 한마디와 같은 표시를 쓴다(roomMod.ts). */
export const loadKeysHidden = (gid: string) => loadRoomHidden(gid, "keys");

/** 운영자만. */
export const setKeysHidden = (gid: string, hidden: boolean) => setRoomHidden(gid, "keys", hidden);

/** 신고. 그림·소리를 싣지 않고 자리만 운영자 큐로. */
export const reportKeys = (uid: string, gid: string) => reportRoomPart(uid, gid, "keys");
