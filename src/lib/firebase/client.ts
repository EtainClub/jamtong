"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * 파이어베이스 클라이언트.
 *
 * 브라우저에서만 만든다. 모듈을 읽는 것만으로 앱이 초기화되면 서버 렌더에서도
 * 실행되고, 키가 없는 환경(빌드 중 등)에서 터진다. 그래서 필요할 때 부른다.
 *
 * 설정값이 없으면 null을 돌려준다. 설정이 없는 환경에서도 사이트의 나머지는
 * 그대로 동작해야 한다 — 로그인과 이력은 이 사이트의 부속이지 본체가 아니다.
 */

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId);

function app(): FirebaseApp | null {
  if (typeof window === "undefined" || !firebaseConfigured) return null;
  return getApps().length ? getApp() : initializeApp(config);
}

export function firebaseAuth(): Auth | null {
  const instance = app();
  return instance ? getAuth(instance) : null;
}

export function firebaseDb(): Firestore | null {
  const instance = app();
  return instance ? getFirestore(instance) : null;
}
