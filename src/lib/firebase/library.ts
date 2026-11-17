"use client";

import { collection, doc, onSnapshot, query, runTransaction, serverTimestamp, where } from "firebase/firestore";

import { firebaseAuth, firebaseDb } from "./client";

/**
 * 특별한 책(src/features/garden/room/library.ts)의 바깥 일 — 책 꾸러미 받기, 빌려 읽기 표식, 책에게 묻기.
 *
 * gardens/{gid}/reads/{손님 uid}   손님이 그 방의 책을 한 장 읽은 날(한국 날짜 번호)·이름·책. 하루 한 번(규칙).
 *                                 주인만 읽는다 — 오늘 표식을 세어 잼을 받는다(장부는 주인 정원에).
 */

/** 책 꾸러미 — 장마다 제목·한 줄·쉽게 보기 토막·요약 본문. 잼통 사이트에 이미 공개된 글이다. */
export interface BookPack {
  slug: string;
  title: string;
  year: number;
  chapters: Array<{
    slug: string;
    order: number;
    title: string;
    summary: string;
    minutes: number;
    points: Array<{ id: string; title: string; say: string }>;
    /** 요약 원문. 문단은 빈 줄로, 소제목은 "## "로 시작한다. 없는 장도 있다. */
    body?: string;
  }>;
}

const packs = new Map<string, Promise<BookPack | null>>();

/** 꾸러미는 빌드 때 구운 정적 JSON이다(api/book-pack). 한 번 받으면 이 탭에서 다시 받지 않는다. */
export function loadBookPack(slug: string): Promise<BookPack | null> {
  const cached = packs.get(slug);
  if (cached) return cached;
  const p = fetch(`/api/book-pack/${encodeURIComponent(slug)}`)
    .then((res) => (res.ok ? (res.json() as Promise<BookPack>) : null))
    .catch((error) => {
      console.error("[library] 책 꾸러미를 받지 못했다", error);
      packs.delete(slug);
      return null;
    });
  packs.set(slug, p);
  return p;
}

function todayNumber(): number {
  return Math.floor((Date.now() + 9 * 3_600_000) / 86_400_000);
}

export type LendResult = "ok" | "already" | "error";

/** 남의 방 책을 빌려 읽었다고 남긴다 — 그 방에 하루 한 번(규칙). 주인이 잼을 받는다. */
export async function lendRead(gid: string, uid: string, nick: string, slug: string): Promise<LendResult> {
  const db = firebaseDb();
  if (!db) return "error";
  const ref = doc(db, "gardens", gid, "reads", uid);
  try {
    return await runTransaction(db, async (tx): Promise<LendResult> => {
      const mine = await tx.get(ref);
      if (mine.exists() && mine.get("day") === todayNumber()) return "already";
      tx.set(ref, { day: todayNumber(), at: serverTimestamp(), nick: nick.trim().slice(0, 12) || "이웃", b: slug });
      return "ok";
    });
  } catch (error) {
    console.error("[library] 빌려 읽기를 남기지 못했다", error);
    return "error";
  }
}

export interface Reader {
  uid: string;
  nick: string;
  book: string;
}

/** 오늘 내 방 책을 빌려 읽은 손님. 주인만 읽는다. */
export function watchReaders(gid: string, day: number, onChange: (readers: Reader[]) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "gardens", gid, "reads"), where("day", "==", day)),
    (snap) => onChange(snap.docs.map((d) => ({ uid: d.id, nick: (d.get("nick") as string) || "이웃", book: (d.get("b") as string) || "" }))),
    (error) => console.error("[library] 빌려 읽은 손님을 읽지 못했다", error),
  );
}

export interface BookAnswer {
  grounded: boolean;
  message: string;
  /** 근거로 든 장. */
  chapters: Array<{ order: number; slug: string; title: string }>;
  /** 오늘 이 책에 남은 질문 수. */
  left: number;
}

export type AskResult = { ok: true; answer: BookAnswer } | { ok: false; error: string; left?: number };

/** 책에게 묻는다(api/book-ask). 서버가 방에 놓인 책인지·오늘 남은 수·잼을 본다. 잼은 답을 받은 뒤 화면이 치른다. */
export async function askBook(slug: string, question: string): Promise<AskResult> {
  const user = firebaseAuth()?.currentUser;
  if (!user) return { ok: false, error: "정원을 연 뒤에 다시 물어 주세요." };
  try {
    const token = await user.getIdToken();
    const res = await fetch("/api/book-ask", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ slug, question }),
    });
    const body = (await res.json().catch(() => null)) as (BookAnswer & { error?: string }) | null;
    if (!res.ok || !body || body.error) return { ok: false, error: body?.error ?? "답을 받지 못했어요. 잠시 뒤 다시 물어 주세요.", left: body?.left };
    return { ok: true, answer: body };
  } catch (error) {
    console.error("[library] 책에게 묻지 못했다", error);
    return { ok: false, error: "답을 받지 못했어요. 잠시 뒤 다시 물어 주세요." };
  }
}
