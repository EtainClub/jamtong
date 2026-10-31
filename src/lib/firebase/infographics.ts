"use client";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { firebaseDb, firebaseStorage } from "./client";

/**
 * 업적 인포그래픽 — 구글 계정을 연결한 사람이 올리고, 운영자가 승인한 것만 싣는다.
 *
 * ★ 그림은 Storage에, 나머지는 Firestore `infographics`에 둔다.
 *   그림 경로는 `infographics/{uid}/{문서 id}`다. 올린 사람이 경로에 들어
 *   있어야 Storage 규칙이 "제 것만 올리고 제 것만 지운다"를 문서를 읽지
 *   않고 판단한다.
 *
 * ★ 새 그림은 늘 승인 대기로 시작한다.
 *   업적 페이지는 근거가 붙은 것만 싣는 자리다. 올리자마자 보이면 확인하지
 *   않은 숫자가 업적과 같은 층에 선다. 그래서 상태를 옮기는 것은 운영자뿐이다.
 *
 * ★ 정렬은 화면에서 한다.
 *   `status ==`에 `orderBy(createdAt)`을 겹치면 복합 색인이 필요하다. 수십
 *   장을 넘길 일이 없으므로 색인을 두지 않고 받아서 정렬한다.
 */

export const TITLE_MAX = 80;
export const AUTHOR_NAME_MAX = 30;
export const ALT_MAX = 3000;
export const FILE_MAX_MB = 8;
export const FILE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export type InfographicStatus = "pending" | "approved";

export interface Infographic {
  id: string;
  title: string;
  /** 그림 속 글을 옮겨 적은 것. 화면 읽기 프로그램이 읽는다. */
  alt: string;
  /** 그림 밑에 등록자로 적을 이름. 적지 않았으면 null이고 아무것도 적지 않는다. */
  authorName: string | null;
  imageUrl: string;
  imagePath: string;
  width: number;
  height: number;
  status: InfographicStatus;
  createdAt: Date | null;
  /** 내가 올린 것인지. 화면은 이것만 알면 되고 uid 자체는 쓰지 않는다. */
  mine: boolean;
}

function toInfographic(
  id: string,
  data: Record<string, unknown>,
  uid: string | null,
): Infographic {
  const createdAt = data.createdAt;
  return {
    id,
    title: typeof data.title === "string" ? data.title : "",
    alt: typeof data.alt === "string" ? data.alt : "",
    authorName: typeof data.authorName === "string" ? data.authorName : null,
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
    imagePath: typeof data.imagePath === "string" ? data.imagePath : "",
    width: typeof data.width === "number" ? data.width : 1,
    height: typeof data.height === "number" ? data.height : 1,
    status: data.status === "approved" ? "approved" : "pending",
    createdAt: createdAt instanceof Timestamp ? createdAt.toDate() : null,
    mine: Boolean(uid) && data.authorUid === uid,
  };
}

/** 새것이 앞. 서버 시각이 아직 안 찍힌 방금 올린 것은 맨 앞이다. */
function byNewest(a: Infographic, b: Infographic): number {
  return (b.createdAt?.getTime() ?? Infinity) - (a.createdAt?.getTime() ?? Infinity);
}

function watch(
  constraint: QueryConstraint,
  uid: string | null,
  onChange: (items: Infographic[]) => void,
  onError: (message: string) => void,
): () => void {
  const db = firebaseDb();
  if (!db) {
    onError("파이어베이스 설정이 없습니다.");
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "infographics"), constraint),
    (snap) =>
      onChange(snap.docs.map((d) => toInfographic(d.id, d.data(), uid)).sort(byNewest)),
    (error) => onError(error.message),
  );
}

/** 실린 것. 누구나 읽는다. */
export function watchApprovedInfographics(
  uid: string | null,
  onChange: (items: Infographic[]) => void,
  onError: (message: string) => void,
): () => void {
  return watch(where("status", "==", "approved"), uid, onChange, onError);
}

/** 승인 대기. 규칙이 운영자에게만 연다. */
export function watchPendingInfographics(
  uid: string,
  onChange: (items: Infographic[]) => void,
  onError: (message: string) => void,
): () => void {
  return watch(where("status", "==", "pending"), uid, onChange, onError);
}

/** 내가 올린 것. 승인 대기인 제 그림을 보여 주려고 읽는다. */
export function watchMyInfographics(
  uid: string,
  onChange: (items: Infographic[]) => void,
  onError: (message: string) => void,
): () => void {
  return watch(where("authorUid", "==", uid), uid, onChange, onError);
}

/** 화면이 먼저 걸러 준다. 규칙도 같은 것을 보지만, 거기서 막히면 이유를 말해 주지 못한다. */
export function checkInfographicFile(file: File): string | null {
  if (!FILE_TYPES.includes(file.type)) return "PNG·JPG·WEBP 그림만 올릴 수 있습니다.";
  if (file.size > FILE_MAX_MB * 1024 * 1024) return `${FILE_MAX_MB}MB까지 올릴 수 있습니다.`;
  return null;
}

async function measure(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

/**
 * 올린다. 그림을 먼저, 문서를 나중에.
 *
 * 문서가 먼저 생기면 그림 없는 카드가 승인 대기열에 선다. 문서 쓰기가
 * 실패하면 방금 올린 그림을 지운다 — 어디에도 묶이지 않은 파일을 남기지 않는다.
 */
export async function uploadInfographic(
  uid: string,
  input: { file: File; title: string; alt: string; authorName: string },
): Promise<void> {
  const db = firebaseDb();
  const storage = firebaseStorage();
  if (!db || !storage) throw new Error("파이어베이스 설정이 없습니다.");

  const fileError = checkInfographicFile(input.file);
  if (fileError) throw new Error(fileError);

  const title = input.title.replace(/\s+/g, " ").trim();
  const alt = input.alt.trim();
  const authorName = input.authorName.replace(/\s+/g, " ").trim();
  if (authorName.length > AUTHOR_NAME_MAX) {
    throw new Error(`등록자 이름은 ${AUTHOR_NAME_MAX}자까지입니다.`);
  }
  if (title.length > TITLE_MAX) throw new Error(`제목은 ${TITLE_MAX}자까지입니다.`);
  if (alt.length > ALT_MAX) throw new Error(`그림 설명은 ${ALT_MAX}자까지입니다.`);

  const { width, height } = await measure(input.file);

  const docRef = doc(collection(db, "infographics"));
  const imagePath = `infographics/${uid}/${docRef.id}`;
  const imageRef = ref(storage, imagePath);

  await uploadBytes(imageRef, input.file, { contentType: input.file.type });

  try {
    const imageUrl = await getDownloadURL(imageRef);
    await setDoc(docRef, {
      title,
      alt,
      authorName: authorName || null,
      imageUrl,
      imagePath,
      width,
      height,
      authorUid: uid,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    await deleteObject(imageRef).catch(() => {});
    throw e;
  }
}

export async function approveInfographic(id: string): Promise<void> {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 설정이 없습니다.");
  await updateDoc(doc(db, "infographics", id), {
    status: "approved",
    approvedAt: serverTimestamp(),
  });
}

/**
 * 내린다. 문서를 먼저, 그림을 나중에.
 *
 * 그림이 먼저 지워지면 그 사이에 깨진 카드가 보인다. 문서를 지운 뒤 그림
 * 지우기가 실패하면 파일만 남는데, 화면에는 아무 영향이 없다.
 */
export async function deleteInfographic(item: Pick<Infographic, "id" | "imagePath">): Promise<void> {
  const db = firebaseDb();
  const storage = firebaseStorage();
  if (!db || !storage) throw new Error("파이어베이스 설정이 없습니다.");
  await deleteDoc(doc(db, "infographics", item.id));
  await deleteObject(ref(storage, item.imagePath)).catch(() => {});
}
