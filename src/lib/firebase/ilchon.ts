"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { firebaseDb } from "./client";
import { postFeedback } from "./feedback";

/**
 * 1촌 · 방명록 · 1촌평 · 손님 수 (docs/garden-miniroom.md §5.5).
 *
 * gardens/{공개id}
 *   ├ knocks/{신청자 uid}    1촌 신청. 신청자의 공개 id·이름·이름표. 주인과 신청자만 읽는다.
 *   ├ ilchon/{1촌 uid}       1촌. 그 1촌의 공개 id·이름 사본·내가 붙인 이름표. 주인(과 그 1촌)만 읽는다.
 *   ├ blocks/{uid}           차단. 주인만. 규칙이 신청·방명록을 막는 데 본다.
 *   ├ guestbook/{uid}_{날}   방명록. 한 사람이 한 방에 하루 하나. 방을 가리지 않았으면 누구나 읽는다.
 *   ├ notes/{1촌 uid}        1촌평. 1촌 한 명당 한 줄(다시 쓰면 바뀐다).
 *   ├ visits/{손님 uid}      손님이 온 날. 주인과 그 손님만 읽는다.
 *   └ meta/counter           오늘 손님·모든 손님. visits와 짝이 맞을 때만 오른다(plazaDays와 같다).
 *
 * ★ 불변식은 firestore.rules가 지킨다. 여기서는 규칙이 받는 모양으로 보낼 뿐이다.
 *   짝이 맞아야 하는 쓰기(수락·끊기·손님 세기)는 반드시 한 배치·트랜잭션으로 보낸다.
 * ★ 직접 쓴 글은 화면에서 거른 뒤에 온다(features/garden/ilchon/text.ts). 규칙은 길이만 본다.
 */

export interface Me {
  uid: string;
  gid: string;
  nick: string;
}

export interface Knock {
  uid: string;
  g: string;
  n: string;
  tag: number;
  at: number;
}

export interface IlchonDoc {
  uid: string;
  g: string;
  n: string;
  tag: number;
  at: number;
}

/** 방명록 한 장과 1촌평 한 줄. id는 문서 id(방명록은 uid_날, 1촌평은 uid). */
export interface LineDoc {
  id: string;
  /** 쓴 사람의 uid. 차단 거르기에만 쓰고 화면에 내보내지 않는다. */
  uid: string;
  /** 쓴 사람의 공개 id. 방을 열지 않았으면 "". */
  g: string;
  n: string;
  p: number;
  x: string;
  k: number;
  tag?: number;
  at: number;
  hidden: boolean;
}

const ms = (v: unknown) => (v instanceof Timestamp ? v.toMillis() : 0);

function need() {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 설정이 없습니다.");
  return db;
}

// ── 신청 ─────────────────────────────────────────────────────────────

/** 1촌 신청. 이미 보냈으면 규칙이 막는다(고치기를 열지 않았다). */
export async function sendKnock(target: string, me: Me, tag: number): Promise<void> {
  const db = need();
  await setDoc(doc(db, "gardens", target, "knocks", me.uid), { g: me.gid, n: me.nick, tag, at: serverTimestamp() });
}

/** 보낸 신청을 거둔다. 없으면 아무 일도 없다. */
export async function cancelKnock(target: string, uid: string): Promise<void> {
  const db = need();
  const ref = doc(db, "gardens", target, "knocks", uid);
  if ((await getDoc(ref)).exists()) await deleteDoc(ref);
}

/** 보낸 신청이 아직 있는가. 없으면 상대가 수락했거나 거절했다. */
export async function knockPending(target: string, uid: string): Promise<boolean> {
  const db = need();
  return (await getDoc(doc(db, "gardens", target, "knocks", uid))).exists();
}

/** 받은 신청. 주인만 읽는다. 바뀔 때만 오는 가벼운 구독이다(새 소식의 "1촌 신청 n"). */
export function watchKnocks(gid: string, onChange: (knocks: Knock[]) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "gardens", gid, "knocks"), limit(30)),
    (snap) =>
      onChange(
        snap.docs
          .map((d) => ({ uid: d.id, g: String(d.get("g") ?? ""), n: String(d.get("n") ?? "이웃"), tag: Number(d.get("tag")) || 0, at: ms(d.get("at")) }))
          .sort((a, b) => b.at - a.at),
      ),
    (error) => console.error("[ilchon] 받은 신청을 읽지 못했다", error),
  );
}

/** 거절. 신청만 사라진다. 상대에게 알리지 않는다. */
export async function rejectKnock(gid: string, fromUid: string): Promise<void> {
  const db = need();
  await deleteDoc(doc(db, "gardens", gid, "knocks", fromUid));
}

/**
 * 수락. 양쪽 1촌 문서를 쓰고 신청을 지운다 — 한 배치로(규칙이 셋의 짝을 본다).
 * 내 쪽 이름표는 내가 고른 것, 상대 쪽은 상대가 신청할 때 고른 것.
 */
export async function acceptKnock(me: Me, knock: Knock, myTag: number): Promise<void> {
  const db = need();
  const batch = writeBatch(db);
  batch.set(doc(db, "gardens", me.gid, "ilchon", knock.uid), { g: knock.g, n: knock.n, tag: myTag, at: serverTimestamp() });
  batch.set(doc(db, "gardens", knock.g, "ilchon", me.uid), { g: me.gid, n: me.nick, tag: knock.tag, at: serverTimestamp() });
  batch.delete(doc(db, "gardens", me.gid, "knocks", knock.uid));
  await batch.commit();
}

// ── 1촌 ─────────────────────────────────────────────────────────────

/** 내 1촌 목록. 1촌 탭을 열 때 한 번 읽는다. */
export async function loadIlchon(gid: string): Promise<IlchonDoc[]> {
  const db = need();
  const snap = await getDocs(collection(db, "gardens", gid, "ilchon"));
  return snap.docs
    .map((d) => ({ uid: d.id, g: String(d.get("g") ?? ""), n: String(d.get("n") ?? "이웃"), tag: Number(d.get("tag")) || 0, at: ms(d.get("at")) }))
    .sort((a, b) => b.at - a.at);
}

/** 내가 그 방 주인의 1촌인가. 1촌 문서는 그 1촌 본인도 읽을 수 있다. */
export async function isIlchonOf(gid: string, uid: string): Promise<boolean> {
  const db = need();
  return (await getDoc(doc(db, "gardens", gid, "ilchon", uid))).exists();
}

/** 내 쪽 이름표를 바꾼다. */
export async function retagIlchon(gid: string, friendUid: string, tag: number): Promise<void> {
  const db = need();
  await updateDoc(doc(db, "gardens", gid, "ilchon", friendUid), { tag });
}

/**
 * 끊기. 양쪽 1촌 문서와 서로 남긴 1촌평을 한 배치로 지운다. 상대에게 알리지 않는다.
 * 상대 쪽 문서가 이미 없으면(상대 방이 지워졌거나 어긋났다) 내 쪽만 지운다 — 없는 문서를 지우려 하면
 * 규칙이 resource.data를 읽다 배치 전체를 거절한다.
 */
export async function cutIlchon(me: { uid: string; gid: string }, friend: { uid: string; g: string }): Promise<void> {
  const db = need();
  const theirs = doc(db, "gardens", friend.g, "ilchon", me.uid);
  const theirGarden = await getDoc(doc(db, "gardens", friend.g));
  const batch = writeBatch(db);
  batch.delete(doc(db, "gardens", me.gid, "ilchon", friend.uid));
  batch.delete(doc(db, "gardens", me.gid, "notes", friend.uid));
  if (theirGarden.exists() && (await getDoc(theirs)).exists()) {
    batch.delete(theirs);
    batch.delete(doc(db, "gardens", friend.g, "notes", me.uid));
  }
  await batch.commit();
}

// ── 차단 ─────────────────────────────────────────────────────────────

/** 차단. 그 사람의 신청이 있으면 함께 지운다. 1촌이면 부르는 쪽이 먼저 끊는다. */
export async function blockUser(gid: string, uid: string, nick: string): Promise<void> {
  const db = need();
  const batch = writeBatch(db);
  batch.set(doc(db, "gardens", gid, "blocks", uid), { n: nick.slice(0, 12) || "이웃", at: serverTimestamp() });
  batch.delete(doc(db, "gardens", gid, "knocks", uid));
  await batch.commit();
}

export async function unblockUser(gid: string, uid: string): Promise<void> {
  const db = need();
  await deleteDoc(doc(db, "gardens", gid, "blocks", uid));
}

// ── 방명록 · 1촌평 ───────────────────────────────────────────────────

function toLine(id: string, d: Record<string, unknown>, uid: string): LineDoc {
  return {
    id,
    uid,
    g: typeof d.g === "string" ? d.g : "",
    n: typeof d.n === "string" ? d.n.slice(0, 12) : "이웃",
    p: typeof d.p === "number" ? d.p : -2,
    x: typeof d.x === "string" ? d.x : "",
    k: typeof d.k === "number" ? d.k : 0,
    tag: typeof d.tag === "number" ? d.tag : undefined,
    at: ms(d.at),
    hidden: d.hidden === true,
  };
}

/** 최근 방명록. at 하나로 줄 세우므로 자동 색인으로 된다. */
export async function loadGuestbook(gid: string, size: number): Promise<LineDoc[]> {
  const db = need();
  const snap = await getDocs(query(collection(db, "gardens", gid, "guestbook"), orderBy("at", "desc"), limit(size)));
  return snap.docs.map((d) => toLine(d.id, d.data(), d.id.split("_")[0]));
}

/** 방명록을 남긴다. 문서 id가 uid_날이라 하루 두 번째는 규칙이 막는다(고치기를 열지 않았다). */
export async function signGuestbook(gid: string, me: { uid: string; gid: string | null; nick: string }, line: { p: number; x: string; k: number }, day: number): Promise<void> {
  const db = need();
  await setDoc(doc(db, "gardens", gid, "guestbook", `${me.uid}_${day}`), {
    g: me.gid ?? "",
    n: me.nick,
    p: line.p,
    x: line.x,
    k: line.k,
    at: serverTimestamp(),
  });
}

export async function deleteGuestbook(gid: string, id: string): Promise<void> {
  const db = need();
  await deleteDoc(doc(db, "gardens", gid, "guestbook", id));
}

/** 이 방의 1촌평. 1촌은 50명까지라 통째로 읽는다. */
export async function loadNotes(gid: string): Promise<LineDoc[]> {
  const db = need();
  const snap = await getDocs(collection(db, "gardens", gid, "notes"));
  return snap.docs.map((d) => toLine(d.id, d.data(), d.id)).sort((a, b) => b.at - a.at);
}

/** 1촌평을 쓴다(다시 쓰면 바뀐다). 규칙이 1촌인지, 내 공개 id가 1촌 문서와 같은지 본다. */
export async function writeNote(gid: string, me: Me, tag: number, line: { p: number; x: string; k: number }): Promise<void> {
  const db = need();
  await setDoc(doc(db, "gardens", gid, "notes", me.uid), { g: me.gid, n: me.nick, tag, p: line.p, x: line.x, k: line.k, at: serverTimestamp() });
}

export async function deleteNote(gid: string, uid: string): Promise<void> {
  const db = need();
  await deleteDoc(doc(db, "gardens", gid, "notes", uid));
}

/** 운영자의 가리기. 지우지 않고 가린다(신고를 되짚을 수 있게). 규칙이 운영자만 받는다. */
export async function hideLine(gid: string, coll: "guestbook" | "notes", id: string, hidden: boolean): Promise<void> {
  const db = need();
  await updateDoc(doc(db, "gardens", gid, coll, id), { hidden });
}

/**
 * 신고 — 운영자 큐(feedback)로 보낸다.
 * ★ 피드백은 누구나 읽는 곳이다. 그래서 글은 싣지 않고 자리(문서 경로)만 적는다 — 신고가 그 글을 한 번 더
 *   퍼뜨리면 안 된다. 운영자가 경로로 찾아가 읽고 가린다.
 */
export async function reportLine(uid: string, gid: string, coll: "guestbook" | "notes", id: string): Promise<void> {
  await postFeedback(uid, { kind: "etc", body: `[정원 신고] ${coll === "guestbook" ? "방명록" : "1촌평"} · gardens/${gid}/${coll}/${id}` });
}

// ── 손님 수 ──────────────────────────────────────────────────────────

export interface Counter {
  today: number;
  total: number;
}

/** 오늘 손님·모든 손님. 날이 바뀌었으면 오늘은 0. */
export async function loadCounter(gid: string, day: number): Promise<Counter> {
  const db = need();
  const snap = await getDoc(doc(db, "gardens", gid, "meta", "counter"));
  if (!snap.exists()) return { today: 0, total: 0 };
  return { today: snap.get("day") === day ? Number(snap.get("today")) || 0 : 0, total: Number(snap.get("total")) || 0 };
}

/**
 * 손님으로 센다. 오늘 이미 셌으면 쓰지 않는다. 표식과 숫자를 한 트랜잭션으로 — 규칙이 짝을 본다.
 * 센 뒤의 숫자를 돌려준다.
 */
export async function countVisit(gid: string, uid: string, day: number): Promise<Counter> {
  const db = need();
  const mark = doc(db, "gardens", gid, "visits", uid);
  const counter = doc(db, "gardens", gid, "meta", "counter");
  return runTransaction(db, async (tx) => {
    const [m, c] = await Promise.all([tx.get(mark), tx.get(counter)]);
    const before = c.exists() ? { day: Number(c.get("day")), today: Number(c.get("today")) || 0, total: Number(c.get("total")) || 0 } : { day: 0, today: 0, total: 0 };
    if (m.exists() && m.get("day") === day) return { today: before.day === day ? before.today : 0, total: before.total };
    const next = { day, today: (before.day === day ? before.today : 0) + 1, total: before.total + 1 };
    tx.set(mark, { day });
    tx.set(counter, next);
    return { today: next.today, total: next.total };
  });
}
