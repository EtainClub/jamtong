"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit as fsLimit,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * AI 안내 문답 이력.
 *
 * users/{uid}/asks/{id}. 사용자 아래에 두는 이유는 규칙이 단순해지기 때문이다 —
 * 제 문서만 읽고 쓴다. 한 줄로 끝나는 규칙이 가장 덜 틀린다.
 *
 * 답변 본문을 저장한다. 같은 질문을 다시 물으면 모델이 다른 말을 할 수 있으므로,
 * 이력을 질문만으로 남기면 "그때 뭐라고 했는지"를 되살릴 수 없다.
 *
 * 근거 id는 남기되 근거 문장은 남기지 않는다. 문장은 콘텐츠가 주인이고,
 * 고쳐지면 고쳐진 것이 보여야 한다. 답변 시점의 문장을 박제하면 콘텐츠를
 * 고쳐도 이력에는 옛말이 남는다.
 */

export interface AskRecord {
  id: string;
  question: string;
  message: string;
  grounded: boolean;
  achievementSlug: string;
  achievementTitle: string;
  claimIds: string[];
  askedAt: Date | null;
}

interface AskInput {
  question: string;
  message: string;
  grounded: boolean;
  achievementSlug: string;
  achievementTitle: string;
  claimIds: string[];
}

export async function saveAsk(uid: string, input: AskInput): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  await addDoc(collection(db, "users", uid, "asks"), {
    ...input,
    askedAt: serverTimestamp(),
  });
}

export async function listAsks(uid: string, limit = 100): Promise<AskRecord[]> {
  const db = firebaseDb();
  if (!db) return [];

  const snapshot = await getDocs(
    query(collection(db, "users", uid, "asks"), orderBy("askedAt", "desc"), fsLimit(limit)),
  );

  return snapshot.docs.map((d) => {
    const data = d.data();
    const at = data.askedAt;
    return {
      id: d.id,
      question: String(data.question ?? ""),
      message: String(data.message ?? ""),
      grounded: Boolean(data.grounded),
      achievementSlug: String(data.achievementSlug ?? ""),
      achievementTitle: String(data.achievementTitle ?? ""),
      claimIds: Array.isArray(data.claimIds) ? data.claimIds.map(String) : [],
      // serverTimestamp는 서버가 받기 전까지 null이다. 그 창을 열어 둔다.
      askedAt: at instanceof Timestamp ? at.toDate() : null,
    };
  });
}

export async function deleteAsk(uid: string, id: string): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  await deleteDoc(doc(db, "users", uid, "asks", id));
}
