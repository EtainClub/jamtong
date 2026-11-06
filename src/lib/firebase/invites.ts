"use client";

import { doc, increment, onSnapshot, runTransaction, serverTimestamp, writeBatch } from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 초대 씨앗 (docs/garden-game.md §3.10).
 *
 * inviteCodes/{코드}   초대한 사람(uid)과 첫 열매를 거둔 친구 수(joined). 주인만 읽는다.
 * invites/{uid}        나를 초대한 코드(by)와 때(at). 평생 하나. 본인만 읽는다.
 *
 * ★ 친구가 첫 열매를 거두면 친구 쪽에서 invites/{친구 uid}를 만들고 코드의 joined를 1 올린다.
 *   규칙이 둘의 짝을 본다 — joined는 새 초대 하나에 하나씩만 오른다. 자기 코드로는 못 한다.
 * ★ 상자는 각자의 정원 장부가 연다. 초대한 사람은 joined를 보고 아직 받지 않은 만큼 받는다.
 * ★ 코드 문서에는 친구가 누구인지 적지 않는다. 숫자 하나뿐이다.
 */

/** 내 코드를 등록한다. 이미 있으면 그대로 둔다. */
export async function registerInvite(code: string, uid: string): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  const ref = doc(db, "inviteCodes", code);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists()) return;
    tx.set(ref, { uid, joined: 0 });
  });
}

/** 초대받은 사람이 첫 열매를 거뒀다. ok=셌다, denied=셀 수 없는 초대(이미 받았거나 내 코드거나 없는 코드). */
export async function joinInvite(uid: string, code: string): Promise<"ok" | "denied" | "error"> {
  const db = firebaseDb();
  if (!db) return "error";
  const batch = writeBatch(db);
  batch.set(doc(db, "invites", uid), { by: code, at: serverTimestamp() });
  batch.update(doc(db, "inviteCodes", code), { joined: increment(1) });
  try {
    await batch.commit();
    return "ok";
  } catch (error) {
    const code = (error as { code?: string }).code;
    // 없는 코드는 not-found, 규칙에 막힌 것은 permission-denied. 둘 다 다시 해도 안 된다.
    if (code === "permission-denied" || code === "not-found") return "denied";
    console.error("[invites] 초대를 세지 못했다", error);
    return "error";
  }
}

/** 내 코드에 첫 열매를 거둔 친구 수. */
export function watchInvite(code: string, onJoined: (joined: number) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    doc(db, "inviteCodes", code),
    (snap) => onJoined((snap.get("joined") as number | undefined) ?? 0),
    // 아직 등록 전이면 읽기가 거절될 수 있다. 0으로 둔다.
    () => onJoined(0),
  );
}
