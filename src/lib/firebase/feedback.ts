"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  limit as fsLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 피드백.
 *
 * ★ 공개인 것이 기능이다.
 *   보낸 사람만 보는 건의함은 같은 말을 몇 번이고 다시 받게 된다. 남들이 무엇을
 *   남겼는지 보이면 "이미 있네" 하고 '나도요'를 누르게 되고, 운영자는 같은
 *   이야기를 한 번만 읽으면 된다. 그래서 목록이 먼저 나오고 쓰는 칸이 그 위에 있다.
 *
 * ★ 익명이다. 다만 익명의 뜻을 좁게 쓴다.
 *   authorUid는 본인 삭제와 '나도요' 중복 방지에만 쓰고 화면에 내보내지 않는다.
 *   문서를 직접 읽으면 uid는 보이므로, uid로 사람을 되짚을 수 있는 것은 아무것도
 *   담지 않는다. 이름도 이메일도 담지 않는다.
 *
 * ★ 카운터는 규칙이 지킨다.
 *   agreeCount만 올리는 요청은 firestore.rules의 isAgreeDelta가 막는다.
 *   agrees/{uid} 문서와 카운터를 **같은 배치**로 써야 통과하므로 여기서도
 *   반드시 batch로 보낸다.
 */

export const FEEDBACK_KINDS = ["bug", "idea", "content", "etc"] as const;
export type FeedbackKind = (typeof FEEDBACK_KINDS)[number];

export const KIND_LABEL: Record<FeedbackKind, string> = {
  bug: "오류",
  idea: "제안",
  content: "내용",
  etc: "기타",
};

export const FEEDBACK_STATUSES = ["open", "planned", "done", "wontfix"] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

/** 상태 표기. 성과 카드와 같은 이유로 '안 하기로 함'도 숨기지 않는다. */
export const STATUS_LABEL: Record<FeedbackStatus, string> = {
  open: "읽는 중",
  planned: "하기로 함",
  done: "했음",
  wontfix: "안 하기로 함",
};

export const STATUS_STYLE: Record<FeedbackStatus, string> = {
  open: "bg-taupe text-smoke",
  planned: "bg-navy-tint text-navy",
  done: "bg-ink text-eggshell",
  wontfix: "bg-stone text-graphite",
};

export const BODY_MAX = 1000;

export interface FeedbackItem {
  id: string;
  body: string;
  kind: FeedbackKind;
  status: FeedbackStatus;
  reply: string | null;
  agreeCount: number;
  createdAt: Date | null;
  /** 내가 쓴 것인지. 화면은 이것만 알면 되고 uid 자체는 쓰지 않는다. */
  mine: boolean;
}

function toItem(
  id: string,
  data: Record<string, unknown>,
  uid: string | null,
): FeedbackItem {
  const createdAt = data.createdAt;
  return {
    id,
    body: typeof data.body === "string" ? data.body : "",
    kind: (FEEDBACK_KINDS as readonly string[]).includes(data.kind as string)
      ? (data.kind as FeedbackKind)
      : "etc",
    status: (FEEDBACK_STATUSES as readonly string[]).includes(data.status as string)
      ? (data.status as FeedbackStatus)
      : "open",
    reply: typeof data.reply === "string" && data.reply.length > 0 ? data.reply : null,
    agreeCount: typeof data.agreeCount === "number" ? data.agreeCount : 0,
    createdAt: createdAt instanceof Timestamp ? createdAt.toDate() : null,
    mine: Boolean(uid) && data.authorUid === uid,
  };
}

/**
 * 목록을 구독한다.
 *
 * 한 번 읽고 마는 것이 아니라 onSnapshot으로 듣는 이유: 내가 방금 쓴 글과
 * 방금 누른 '나도요'가 바로 보여야 한다. 다시 불러오는 코드를 곳곳에 두면
 * 한 군데를 빠뜨리고, 그러면 눌렀는데 아무 일도 안 일어난 것처럼 보인다.
 */
export function watchFeedback(
  uid: string | null,
  onChange: (items: FeedbackItem[]) => void,
  onError: (message: string) => void,
): () => void {
  const db = firebaseDb();
  if (!db) {
    onError("파이어베이스 설정이 없습니다.");
    return () => {};
  }

  const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"), fsLimit(200));

  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => toItem(d.id, d.data(), uid))),
    (error) => onError(error.message),
  );
}

/** 내가 '나도요'를 누른 글의 id. */
export async function loadMyAgrees(uid: string, ids: string[]): Promise<Set<string>> {
  const db = firebaseDb();
  if (!db || ids.length === 0) return new Set();

  const found = await Promise.all(
    ids.map(async (id) => {
      try {
        const snap = await getDoc(doc(db, "feedback", id, "agrees", uid));
        return snap.exists() ? id : null;
      } catch {
        return null;
      }
    }),
  );
  return new Set(found.filter((id): id is string => id !== null));
}

export async function postFeedback(
  uid: string,
  input: { body: string; kind: FeedbackKind },
): Promise<void> {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 설정이 없습니다.");

  const body = input.body.trim();
  if (body.length === 0) throw new Error("내용을 적어 주세요.");
  if (body.length > BODY_MAX) throw new Error(`${BODY_MAX}자까지 쓸 수 있습니다.`);

  await addDoc(collection(db, "feedback"), {
    body,
    kind: input.kind,
    authorUid: uid,
    status: "open",
    reply: null,
    repliedAt: null,
    agreeCount: 0,
    createdAt: serverTimestamp(),
  });
}

/**
 * '나도요'를 켜고 끈다.
 *
 * 카운터와 표시 문서를 한 배치로 보낸다. 규칙이 둘의 짝을 보므로 따로 보내면
 * 둘 다 거절된다 — 그게 맞다. 따로 보낼 수 있으면 카운터만 올릴 수 있다.
 */
export async function toggleAgree(
  uid: string,
  id: string,
  agreed: boolean,
): Promise<void> {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 설정이 없습니다.");

  const batch = writeBatch(db);
  const item = doc(db, "feedback", id);
  const mark = doc(db, "feedback", id, "agrees", uid);

  if (agreed) {
    batch.delete(mark);
    batch.update(item, { agreeCount: increment(-1) });
  } else {
    batch.set(mark, { at: serverTimestamp() });
    batch.update(item, { agreeCount: increment(1) });
  }

  await batch.commit();
}

export async function deleteFeedback(id: string): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  await deleteDoc(doc(db, "feedback", id));
}

/** 운영자만 통과한다. 화면에서 막는 것은 안내일 뿐이고 실제로는 규칙이 막는다. */
export async function updateFeedback(
  id: string,
  patch: { status?: FeedbackStatus; reply?: string | null },
): Promise<void> {
  const db = firebaseDb();
  if (!db) return;

  const data: Record<string, unknown> = {};
  if (patch.status) data.status = patch.status;
  if (patch.reply !== undefined) {
    data.reply = patch.reply && patch.reply.trim().length > 0 ? patch.reply.trim() : null;
    data.repliedAt = data.reply ? serverTimestamp() : null;
  }
  if (Object.keys(data).length === 0) return;

  await updateDoc(doc(db, "feedback", id), data);
}

/**
 * 내가 운영자인가.
 *
 * admins/{uid}를 읽어 본다. 규칙이 제 문서만 읽게 해 두었으므로 명단 전체는
 * 볼 수 없고, 없으면 읽기 자체가 거절돼 false가 된다.
 */
export async function checkAdmin(uid: string): Promise<boolean> {
  const db = firebaseDb();
  if (!db) return false;
  try {
    const snap = await getDoc(doc(db, "admins", uid));
    return snap.exists();
  } catch {
    return false;
  }
}
