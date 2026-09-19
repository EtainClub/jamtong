"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  linkWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { firebaseAuth, firebaseConfigured } from "./client";

/**
 * 로그인 상태.
 *
 * 익명으로 시작한다. 질문 이력을 남기는 데 계정이 필요하지만, 그걸 이유로
 * 처음 온 사람에게 로그인 화면을 들이밀지 않는다. 익명 계정으로 쌓아 두고,
 * 기기를 옮기고 싶을 때 구글 계정을 **연결**하면 그 이력이 따라간다.
 *
 * ★ 익명 로그인을 페이지 열 때 자동으로 하지 않는다.
 *   방문자 수만큼 계정이 생긴다. 실제로 남길 것이 생겼을 때(질문을 던졌을 때,
 *   또는 MY를 열었을 때) 비로소 만든다. ensureUser()가 그 자리다.
 */

interface AuthState {
  user: User | null;
  /** 첫 상태 확인이 끝났는지. 끝나기 전에 "로그인하세요"를 띄우면 깜빡인다. */
  ready: boolean;
  configured: boolean;
  ensureUser: () => Promise<User | null>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  rename: (name: string) => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!firebaseConfigured);

  useEffect(() => {
    const auth = firebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setReady(true);
    });
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      ready,
      configured: firebaseConfigured,

      async ensureUser() {
        const auth = firebaseAuth();
        if (!auth) return null;
        if (auth.currentUser) return auth.currentUser;
        const credential = await signInAnonymously(auth);
        return credential.user;
      },

      async signInWithGoogle() {
        const auth = firebaseAuth();
        if (!auth) return;
        const provider = new GoogleAuthProvider();

        /*
         * 익명 계정이 이미 있으면 새로 로그인하지 않고 연결한다. 새로 로그인하면
         * 익명 uid가 버려지고 그 아래 쌓인 이력이 주인을 잃는다.
         *
         * 이미 그 구글 계정으로 만든 계정이 있으면 연결이 거부된다
         * (credential-already-in-use). 그때는 그 계정으로 들어간다 — 익명 쪽
         * 이력은 남지만 보이지 않게 된다. 화면에서 그 사정을 미리 알린다.
         */
        if (auth.currentUser?.isAnonymous) {
          try {
            await linkWithPopup(auth.currentUser, provider);
            return;
          } catch (error) {
            const code = (error as { code?: string }).code;
            if (code !== "auth/credential-already-in-use") throw error;
          }
        }
        await signInWithPopup(auth, provider);
      },

      async signOutUser() {
        const auth = firebaseAuth();
        if (auth) await signOut(auth);
      },

      async rename(name: string) {
        const auth = firebaseAuth();
        if (!auth?.currentUser) return;
        await updateProfile(auth.currentUser, { displayName: name });
        // updateProfile은 onAuthStateChanged를 다시 부르지 않는다. 직접 반영한다.
        setUser({ ...auth.currentUser } as User);
      },
    }),
    [user, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const value = useContext(Ctx);
  if (!value) throw new Error("useAuth는 AuthProvider 안에서만 쓸 수 있다");
  return value;
}
