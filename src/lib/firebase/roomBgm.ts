"use client";

import { getDownloadURL, ref } from "firebase/storage";

import { firebaseStorage } from "./client";

const urls = new Map<string, Promise<string | null>>();

/**
 * Firebase Storage에 올린 방 음원의 스트리밍 주소를 얻는다.
 * 음원 파일 자체를 미리 내려받지 않고 다운로드 URL만 조회해 이번 세션 동안 기억한다.
 */
export function bgmUrl(storagePath: string): Promise<string | null> {
  const storage = firebaseStorage();
  if (!storage) return Promise.resolve(null);
  let hit = urls.get(storagePath);
  if (!hit) {
    hit = getDownloadURL(ref(storage, storagePath)).catch((error) => {
      console.warn("[bgm] 음원 주소를 받지 못했다", storagePath, (error as { code?: string }).code);
      urls.delete(storagePath);
      return null;
    });
    urls.set(storagePath, hit);
  }
  return hit;
}

export const roomBgm = { url: bgmUrl };
