"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  linkWithPopup,
  onIdTokenChanged,
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
 *
 * ★ User 인스턴스를 상태에 담지 않는다.
 *   연결(link)과 프로필 변경은 uid를 바꾸지 않으므로 파이어베이스가 **같은 객체를
 *   고쳐서** 돌려준다. 그대로 setState하면 참조가 같아 React가 리렌더를 건너뛰고,
 *   팝업은 정상 종료됐는데 화면은 그대로인 일이 생긴다. 실제로 그렇게 나갔다.
 *   그래서 값만 뽑아 새 객체로 담는다 — 매번 새 참조이므로 건너뛸 자리가 없다.
 */

export interface Account {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  /** 연결된 로그인 수단. "google.com" 등. */
  providers: string[];
}

function snapshot(user: User | null): Account | null {
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    providers: user.providerData.map((p) => p.providerId),
  };
}

/** 구글 연결이 막힌 이유. 화면이 무엇을 말할지 정한다. */
export type LinkBlock = "already-in-use" | null;

interface AuthState {
  user: Account | null;
  /** 첫 상태 확인이 끝났는지. 끝나기 전에 "로그인하세요"를 띄우면 깜빡인다. */
  ready: boolean;
  configured: boolean;
  linkBlock: LinkBlock;
  ensureUser: () => Promise<User | null>;
  signInWithGoogle: () => Promise<void>;
  /** 연결이 막혔을 때, 이력을 포기하고 그 구글 계정으로 들어간다. */
  switchToGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  rename: (name: string) => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [ready, setReady] = useState(!firebaseConfigured);
  const [linkBlock, setLinkBlock] = useState<LinkBlock>(null);

  useEffect(() => {
    const auth = firebaseAuth();
    if (!auth) return;
    /*
     * onAuthStateChanged가 아니라 onIdTokenChanged를 듣는다. 연결은 로그인
     * 상태를 바꾸지 않고 토큰만 바꾸므로, 앞의 것은 조용히 지나간다.
     */
    return onIdTokenChanged(auth, (next) => {
      setUser(snapshot(next));
      setReady(true);
    });
  }, []);

  /** 리스너를 기다리지 않고 지금 값을 화면에 밀어 넣는다. */
  const push = useCallback(async () => {
    const auth = firebaseAuth();
    if (!auth?.currentUser) return;
    await auth.currentUser.reload();
    setUser(snapshot(auth.currentUser));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      ready,
      configured: firebaseConfigured,
      linkBlock,

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
        setLinkBlock(null);
        const provider = new GoogleAuthProvider();

        /*
         * 익명 계정이 있으면 새로 로그인하지 않고 연결한다. 새로 로그인하면
         * 익명 uid가 버려지고 그 아래 쌓인 이력이 주인을 잃는다.
         */
        if (auth.currentUser?.isAnonymous) {
          try {
            await linkWithPopup(auth.currentUser, provider);
            await push();
            return;
          } catch (error) {
            const code = (error as { code?: string }).code;
            /*
             * 그 구글 계정으로 이미 만든 기록이 있으면 연결이 거부된다.
             * 여기서 곧바로 두 번째 팝업을 열면 안 된다 — 클릭 제스처가 이미
             * 첫 팝업에 쓰였으므로 브라우저가 막고, 아무 일도 일어나지 않은
             * 것처럼 보인다. 화면에 사정을 알리고 한 번 더 누르게 한다.
             */
            if (code === "auth/credential-already-in-use") {
              setLinkBlock("already-in-use");
              return;
            }
            // 사용자가 팝업을 스스로 닫은 것은 실패가 아니다. 조용히 둔다.
            if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
              return;
            }
            throw error;
          }
        }

        await signInWithPopup(auth, provider);
        await push();
      },

      async switchToGoogle() {
        const auth = firebaseAuth();
        if (!auth) return;
        await signInWithPopup(auth, new GoogleAuthProvider());
        setLinkBlock(null);
        await push();
      },

      async signOutUser() {
        const auth = firebaseAuth();
        if (auth) await signOut(auth);
        setLinkBlock(null);
      },

      async rename(name: string) {
        const auth = firebaseAuth();
        if (!auth?.currentUser) return;
        await updateProfile(auth.currentUser, { displayName: name });
        await push();
      },
    }),
    [user, ready, linkBlock, push],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const value = useContext(Ctx);
  if (!value) throw new Error("useAuth는 AuthProvider 안에서만 쓸 수 있다");
  return value;
}
