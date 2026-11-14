"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { firebaseDb } from "./client";
import { postFeedback } from "./feedback";

/**
 * 방에서 사람이 만든 것을 운영자가 가리는 표시와 신고 (docs/garden-miniroom.md §4.5·§4.6).
 *
 * gardens/{gid}/mod/{what}   {hidden, at}. 누구나 읽고 운영자만 쓴다(firestore.rules). 주인이 방 문서를 고쳐도 풀리지 않는다.
 *   keys  = 내 키보드(그림·소리)
 *   motto = 방 한마디
 */
export type RoomModPart = "keys" | "motto";

/** 운영자가 가렸는가. 읽지 못하면 가리지 않은 것으로 본다(글·그림은 화면이 이미 거른 것뿐이다). */
export async function loadRoomHidden(gid: string, what: RoomModPart): Promise<boolean> {
  const db = firebaseDb();
  if (!db) return false;
  try {
    const snap = await getDoc(doc(db, "gardens", gid, "mod", what));
    return snap.exists() && snap.get("hidden") === true;
  } catch (error) {
    console.warn(`[room] 가리기 표시(${what})를 읽지 못했다`, error);
    return false;
  }
}

/** 운영자만. 규칙이 운영자가 아니면 거절한다. */
export async function setRoomHidden(gid: string, what: RoomModPart, hidden: boolean): Promise<void> {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 설정이 없다");
  await setDoc(doc(db, "gardens", gid, "mod", what), { hidden, at: serverTimestamp() });
}

const REPORT_LABEL: Record<RoomModPart, string> = { keys: "키보드(그림·소리)", motto: "방 한마디" };

/** 신고. 내용을 싣지 않고 자리만 운영자 큐로 보낸다(피드백은 누구나 읽는다). 운영자는 그 방에 가서 보고 가린다. */
export async function reportRoomPart(uid: string, gid: string, what: RoomModPart): Promise<void> {
  await postFeedback(uid, { kind: "etc", body: `[정원 신고] ${REPORT_LABEL[what]} · gardens/${gid}/room/${what}` });
}
