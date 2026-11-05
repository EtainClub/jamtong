"use client";

import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 개인 정원 — users/{uid}/garden/state 한 문서.
 *
 * 정원은 브라우저(localStorage)에 먼저 쌓이고, 계정이 있으면 여기로 따라간다.
 * 둘이 다르면 updatedAt이 늦은 쪽이 이긴다. 기기를 오가며 동시에 키우는 일은
 * 드물고, 칸 단위로 합치면 씨앗이 두 번 쓰이는 틈이 생긴다.
 *
 * 개인 정원의 부정행위는 혼자의 문제다. 잼으로 살 수 있는 것은 이 정원 안의
 * 물건뿐이고 거래도 없다. 그래서 규칙은 모양만 본다.
 */

export async function loadGarden<T>(uid: string): Promise<T | null> {
  const db = firebaseDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid, "garden", "state"));
  return snap.exists() ? (snap.data() as T) : null;
}

export async function saveGarden(uid: string, state: object): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  await setDoc(doc(db, "users", uid, "garden", "state"), state);
}

/**
 * 정원을 처음부터 다시 시작한다 — 계정의 정원과 공개 정원을 지운다.
 * 꽃밭의 가꿈, 광장, 물 표식처럼 모두와 함께 쓴 기록은 지우지 않는다(규칙상 지울 수 없다).
 */
export async function deleteGarden(uid: string, publicId: string | null): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  // 없는 문서를 지우려 하면 규칙이 resource.data를 읽다 거절한다. 있을 때만 지운다.
  if (publicId && (await getDoc(doc(db, "gardens", publicId))).exists()) {
    await deleteDoc(doc(db, "gardens", publicId));
  }
  await deleteDoc(doc(db, "users", uid, "garden", "state"));
}
