"use client";

import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, writeBatch } from "firebase/firestore";

import { COMMENTS_LOAD, commentId, PHOTO_MAX, photoDoc, readPhotoDoc, SCRAPS_LOAD, scrapId, type Photo, type PublicPhoto } from "@/features/garden/album/rules";

import { firebaseDb } from "./client";
import { postFeedback } from "./feedback";

/**
 * 사진첩 2(docs/garden-album-review.md) — 공개 방의 사진·댓글·퍼감.
 *
 * gardens/{공개id}
 *   ├ photos/{사진id}               주인의 장부(GardenData.album)를 옮겨 싣는다. 방을 가리지 않았으면 누구나 읽는다.
 *   ├ photoComments/{uid}_{사진}_{날}  댓글. 한 사람이 한 사진에 하루 하나. 모양은 방명록과 같다(문구·60자·스티커).
 *   └ photoScraps/{uid}_{사진}      퍼감 표식. 한 사람이 한 사진에 한 번. 주인이 읽고 잼을 받는다.
 *
 * ★ 댓글·퍼감은 사진마다가 아니라 방 하나에 모은다 — 최근 것을 한 번에 읽어 사진마다 나눈다(수를 따로 세지 않는다).
 * ★ 불변식은 firestore.rules가 지킨다. 직접 쓴 글은 화면에서 거른 뒤에 온다(ilchon/text.ts). 규칙은 길이만 본다.
 */

function need() {
  const db = firebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았다");
  return db;
}

function ms(v: unknown): number {
  return v instanceof Timestamp ? v.toMillis() : 0;
}

// ── 사진 ─────────────────────────────────────────────────────────────

export async function loadPhotos(gid: string): Promise<PublicPhoto[]> {
  const db = need();
  const snap = await getDocs(query(collection(db, "gardens", gid, "photos"), orderBy("at", "desc"), limit(PHOTO_MAX)));
  return snap.docs.map((d) => readPhotoDoc(d.id, d.data())).filter((p): p is PublicPhoto => p !== null);
}

/**
 * 장부의 사진을 공개 방에 맞춘다. 없는 것은 만들고, 바뀐 것은 고치고, 장부에서 내린 것은 지운다.
 * last는 지난번에 맞춘 모양(사진 id → JSON) — 같으면 쓰지 않는다. 맞춘 뒤의 모양을 돌려준다.
 * 처음(last가 null)이면 공개 방의 사진을 읽어 그것과 견준다.
 */
export async function syncPhotos(gid: string, photos: readonly Photo[], last: Map<string, string> | null): Promise<Map<string, string>> {
  const db = need();
  let before = last;
  if (!before) {
    const snap = await getDocs(collection(db, "gardens", gid, "photos"));
    before = new Map(
      snap.docs.map((d) => {
        const p = readPhotoDoc(d.id, d.data());
        return [d.id, p ? JSON.stringify(photoDoc(p)) : ""];
      }),
    );
  }
  const next = new Map(photos.map((p) => [p.id, JSON.stringify(photoDoc(p))]));
  const batch = writeBatch(db);
  let n = 0;
  for (const [id, json] of next) {
    if (before.get(id) === json) continue;
    // 통째로 쓴다(운영자의 hidden은 규칙이 지킨다 — 주인이 지우지 못한다. 그래서 있던 문서는 고치기로).
    const data = JSON.parse(json) as Record<string, unknown>;
    if (before.has(id)) batch.update(doc(db, "gardens", gid, "photos", id), { ...withDeletes(data) });
    else batch.set(doc(db, "gardens", gid, "photos", id), data);
    n++;
  }
  for (const id of before.keys()) {
    if (next.has(id)) continue;
    batch.delete(doc(db, "gardens", gid, "photos", id));
    n++;
  }
  if (n > 0) await batch.commit();
  return next;
}

/** 고치기에서 빠진 칸(대표·댓글 끄기·출처·순간)을 지운다. */
function withDeletes(data: Record<string, unknown>): Record<string, unknown> {
  // deleteField를 쓰지 않고 규칙이 받는 빈 값으로 — 규칙은 cv·nc가 bool이면 받는다.
  return { cv: false, nc: false, ...data };
}

/** 운영자의 가리기 — 사진의 한 줄을 가린다(사진 자체는 콘텐츠라 그대로 둔다). */
export async function hidePhotoLine(gid: string, photoId: string, hidden: boolean): Promise<void> {
  const db = need();
  await updateDoc(doc(db, "gardens", gid, "photos", photoId), { hidden });
}

// ── 댓글 ─────────────────────────────────────────────────────────────

export interface PhotoComment {
  id: string;
  uid: string;
  /** 사진 id. */
  ph: string;
  g: string;
  n: string;
  p: number;
  x: string;
  k: number;
  at: number;
  hidden: boolean;
}

function toComment(id: string, d: Record<string, unknown>): PhotoComment {
  return {
    id,
    uid: id.split("_")[0],
    ph: typeof d.ph === "string" ? d.ph : "",
    g: typeof d.g === "string" ? d.g : "",
    n: typeof d.n === "string" ? d.n.slice(0, 12) : "이웃",
    p: typeof d.p === "number" ? d.p : -2,
    x: typeof d.x === "string" ? d.x : "",
    k: typeof d.k === "number" ? d.k : 0,
    at: ms(d.at),
    hidden: d.hidden === true,
  };
}

export async function loadPhotoComments(gid: string): Promise<PhotoComment[]> {
  const db = need();
  const snap = await getDocs(query(collection(db, "gardens", gid, "photoComments"), orderBy("at", "desc"), limit(COMMENTS_LOAD)));
  return snap.docs.map((d) => toComment(d.id, d.data()));
}

export async function addPhotoComment(
  gid: string,
  me: { uid: string; gid: string | null; nick: string },
  photoId: string,
  line: { p: number; x: string; k: number },
  day: number,
): Promise<void> {
  const db = need();
  await setDoc(doc(db, "gardens", gid, "photoComments", commentId(me.uid, photoId, day)), {
    ph: photoId,
    g: me.gid ?? "",
    n: me.nick,
    p: line.p,
    x: line.x,
    k: line.k,
    at: serverTimestamp(),
  });
}

export async function deletePhotoComment(gid: string, id: string): Promise<void> {
  const db = need();
  await deleteDoc(doc(db, "gardens", gid, "photoComments", id));
}

export async function hidePhotoComment(gid: string, id: string, hidden: boolean): Promise<void> {
  const db = need();
  await updateDoc(doc(db, "gardens", gid, "photoComments", id), { hidden });
}

/** 신고 — 글은 싣지 않고 자리만(ilchon.ts의 reportLine과 같다). */
export async function reportAlbum(uid: string, gid: string, where: { photo: string } | { comment: string }): Promise<void> {
  const path = "photo" in where ? `gardens/${gid}/photos/${where.photo}` : `gardens/${gid}/photoComments/${where.comment}`;
  await postFeedback(uid, { kind: "etc", body: `[정원 신고] ${"photo" in where ? "사진첩 사진의 한 줄" : "사진첩 댓글"} · ${path}` });
}

// ── 퍼감 ─────────────────────────────────────────────────────────────

export interface PhotoScrap {
  id: string;
  uid: string;
  ph: string;
  g: string;
  n: string;
  at: number;
}

export async function loadPhotoScraps(gid: string): Promise<PhotoScrap[]> {
  const db = need();
  const snap = await getDocs(query(collection(db, "gardens", gid, "photoScraps"), orderBy("at", "desc"), limit(SCRAPS_LOAD)));
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      uid: d.id.split("_")[0],
      ph: typeof x.ph === "string" ? x.ph : "",
      g: typeof x.g === "string" ? x.g : "",
      n: typeof x.n === "string" ? x.n.slice(0, 12) : "이웃",
      at: ms(x.at),
    };
  });
}

/** 퍼감 표식을 남긴다. 이미 남겼으면 규칙이 막는다(고치기를 열지 않았다) — 부르는 쪽이 먼저 본다. */
export async function markScrap(gid: string, me: { uid: string; gid: string | null; nick: string }, photoId: string): Promise<void> {
  const db = need();
  await setDoc(doc(db, "gardens", gid, "photoScraps", scrapId(me.uid, photoId)), { ph: photoId, g: me.gid ?? "", n: me.nick, at: serverTimestamp() });
}
