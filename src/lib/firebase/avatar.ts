"use client";

import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile, type User } from "firebase/auth";

import { firebaseStorage } from "./client";

/**
 * 프로필 사진 — avatars/{uid}/{시각}.webp 하나.
 *
 * ★ 올리기 전에 브라우저에서 256px 정사각형으로 줄인다. 휴대폰 사진은 수 MB라 그대로 올리면
 *   상단 단추 하나 그리는 데 그만큼 내려받는다. 줄인 그림은 수십 KB다. 규칙도 크기를 막는다.
 * ★ 사진은 내 화면(상단 단추, MY)에만 쓴다. 공개 정원·꽃밭 명패·자랑 카드에는 싣지 않는다 —
 *   청소년의 얼굴 사진이 모두에게 보이는 자리에 오르지 않게. 남에게 보이는 것은 정원 이름뿐이다.
 * ★ 주소는 계정의 photoURL에 건다. 상단 단추는 이미 그 값을 그린다.
 *   바꾸면 이전 파일을 지운다. 파일 이름에 시각을 넣는 것은 같은 주소를 덮으면 브라우저가
 *   옛 그림을 캐시에서 보여 주기 때문이다.
 */

const SIZE = 256;
export const AVATAR_MAX_INPUT = 20 * 1024 * 1024;

function folder(uid: string): string {
  return `avatars/${uid}/`;
}

/** 우리 버킷에 올린 내 사진의 경로. 구글 사진이나 남의 주소면 null. */
function ownPath(url: string | null, uid: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname !== "firebasestorage.googleapis.com") return null;
    const path = decodeURIComponent(u.pathname.split("/o/")[1] ?? "");
    return path.startsWith(folder(uid)) ? path : null;
  } catch {
    return null;
  }
}

async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("그림을 그릴 수 없는 브라우저다");
  // 가운데를 정사각형으로 잘라 줄인다.
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  // webp를 못 내는 브라우저(옛 사파리)는 png를 돌려준다. 그것도 규칙이 받는다.
  if (!blob) throw new Error("그림을 줄이지 못했다");
  return blob;
}

async function removeFile(path: string | null) {
  const storage = firebaseStorage();
  if (!storage || !path) return;
  // 이미 없는 파일이면 그대로 둔다. 남아도 해가 없는 찌꺼기다.
  await deleteObject(ref(storage, path)).catch((error) => console.error("[avatar] 이전 사진을 지우지 못했다", error));
}

export async function uploadAvatar(user: User, file: File): Promise<void> {
  const storage = firebaseStorage();
  if (!storage) throw new Error("파이어베이스 설정이 없다");
  if (!file.type.startsWith("image/")) throw new Error("not-image");
  if (file.size > AVATAR_MAX_INPUT) throw new Error("too-large");

  const blob = await shrink(file);
  const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/jpeg" ? "jpg" : "png";
  const target = ref(storage, `${folder(user.uid)}${Date.now()}.${ext}`);
  await uploadBytes(target, blob, { contentType: blob.type, cacheControl: "public, max-age=31536000, immutable" });
  const url = await getDownloadURL(target);

  const previous = ownPath(user.photoURL, user.uid);
  await updateProfile(user, { photoURL: url });
  await removeFile(previous);
}

/** 올린 사진을 내리고, 구글 계정이 있으면 그 사진으로 돌아간다. */
export async function clearAvatar(user: User): Promise<void> {
  const previous = ownPath(user.photoURL, user.uid);
  const google = user.providerData.find((p) => p.providerId === "google.com")?.photoURL ?? null;
  // null을 주면 서버가 그 값을 무시하고 옛 주소를 그대로 돌려준다(2026-11-07 확인). 빈 문자열이어야 지워진다.
  await updateProfile(user, { photoURL: google ?? "" });
  await removeFile(previous);
}

/** 지금 사진이 내가 올린 것인지. "기본 사진으로" 단추를 보일지 정한다. */
export function isUploadedAvatar(url: string | null, uid: string): boolean {
  return ownPath(url, uid) !== null;
}
