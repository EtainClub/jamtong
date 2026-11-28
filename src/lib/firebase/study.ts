"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 잼공 기록 — users/{uid}/study/state 한 문서(docs/daily-study.md §11).
 *
 * 기록은 브라우저(localStorage)에 먼저 쌓이고, 계정이 있으면 여기로 따라간다. 두 기기의 기록은 합친다
 * (src/features/study/sync.ts) — 정원처럼 한쪽이 이기지 않는다. 본인만 읽고 쓴다(firestore.rules).
 */

export async function loadStudy<T>(uid: string): Promise<T | null> {
  const db = firebaseDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid, "study", "state"));
  return snap.exists() ? (snap.data() as T) : null;
}

export async function saveStudy(uid: string, state: object): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  // undefined 칸(거절한 적 없는 declinedOn 등)은 Firestore가 받지 않는다 — JSON으로 한 번 걸러 뺀다.
  await setDoc(doc(db, "users", uid, "study", "state"), JSON.parse(JSON.stringify(state)));
}
