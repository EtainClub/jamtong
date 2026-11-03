"use client";

import { collection, doc, onSnapshot, runTransaction, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 꽃밭 — 업적을 함께 피우고, 가장 많이 가꾼 사람이 정원지기가 된다.
 * 설계는 docs/garden-game.md §3.9.
 *
 * blooms/{speciesId}              모두의 가꿈 합계, 만개 시각, 정원지기.
 *   └ keepers/{uid}               한 사람의 가꿈. 본인만 읽는다.
 *
 * ★ 정원지기는 경쟁하는 공개 자리라, 개인 정원과 달리 값의 정직성을 규칙이 본다.
 *   - 가꿈은 한 번에 1~2, 한 사람이 한 업적에 하루 12까지만 오른다.
 *   - 합계는 같은 커밋에서 내 keeper가 오른 만큼만 오른다.
 *   - 정원지기는 내 keeper 값으로만, 그리고 지금 정원지기보다 많을 때만 바뀐다.
 *   하루 상한이 있으니 손으로 만든 요청으로도 하루에 몰아서 차지할 수는 없다.
 *   여러 날 꾸준히 돌본 사람이 차지한다.
 *
 * ★ 정원지기 자리에는 정원 이름만 걸린다. 본명이 아니라 정원에서 지은 이름이다.
 *   ownerUid는 규칙이 "지금 정원지기가 나인가"를 보려고 남긴다. uid는 비밀이
 *   아니지만, 그것으로 사람을 되짚을 것은 함께 두지 않는다.
 */

export interface Bloom {
  care: number;
  bloomedAt: number | null;
  ownerUid: string | null;
  ownerNick: string | null;
  ownerCare: number;
  /** 운영자가 숨긴 이름. 이 이름으로는 다시 걸리지 않는다. */
  hiddenNick: string | null;
}

const DAY = 24 * 3_600_000;
const KST = 9 * 3_600_000;

export function watchBlooms(onChange: (blooms: Map<string, Bloom>) => void): () => void {
  const db = firebaseDb();
  if (!db) return () => {};
  return onSnapshot(collection(db, "blooms"), (snap) => {
    const out = new Map<string, Bloom>();
    snap.forEach((d) => {
      const at = d.get("bloomedAt") as Timestamp | null | undefined;
      out.set(d.id, {
        care: d.get("care") ?? 0,
        bloomedAt: at ? at.toMillis() : null,
        ownerUid: d.get("ownerUid") ?? null,
        ownerNick: d.get("ownerNick") ?? null,
        ownerCare: d.get("ownerCare") ?? 0,
        hiddenNick: d.get("hiddenNick") ?? null,
      });
    });
    onChange(out);
  });
}

export type CareResult =
  | { ok: true; mine: number; becameOwner: boolean; bloomedNow: boolean }
  | { ok: false; reason: "capped" | "error" };

export async function giveCare(
  uid: string,
  speciesId: string,
  delta: number,
  nick: string,
  bloomAt: number,
  dayCap: number,
): Promise<CareResult> {
  const db = firebaseDb();
  if (!db) return { ok: false, reason: "error" };

  const bloomRef = doc(db, "blooms", speciesId);
  const keeperRef = doc(db, "blooms", speciesId, "keepers", uid);

  try {
    return await runTransaction(db, async (tx): Promise<CareResult> => {
      const [b, k] = await Promise.all([tx.get(bloomRef), tx.get(keeperRef)]);
      const today = Math.floor((Date.now() + KST) / DAY);
      const used = k.exists() && k.get("day") === today ? (k.get("dayCare") as number) : 0;
      if (used + delta > dayCap) return { ok: false, reason: "capped" };

      const mine = ((k.get("care") as number | undefined) ?? 0) + delta;
      tx.set(keeperRef, { care: mine, day: today, dayCare: used + delta, updatedAt: serverTimestamp() });

      const care = ((b.get("care") as number | undefined) ?? 0) + delta;
      const wasBloomed = Boolean(b.get("bloomedAt"));
      const ownerUid = (b.get("ownerUid") as string | null | undefined) ?? null;
      const ownerCare = (b.get("ownerCare") as number | undefined) ?? 0;
      const takes = ownerUid === uid || mine > ownerCare;
      const hiddenNick = (b.get("hiddenNick") as string | null | undefined) ?? null;

      tx.set(bloomRef, {
        care,
        bloomedAt: wasBloomed ? b.get("bloomedAt") : care >= bloomAt ? serverTimestamp() : null,
        ownerUid: takes ? uid : ownerUid,
        // 운영자가 숨긴 이름이면 다시 걸지 않는다. 이름을 바꾸면 다음 가꿈부터 걸린다.
        ownerNick: takes ? (nick === hiddenNick ? null : nick) : ((b.get("ownerNick") as string | null | undefined) ?? null),
        ownerCare: takes ? mine : ownerCare,
        ...(hiddenNick === null ? {} : { hiddenNick }),
      });

      return { ok: true, mine, becameOwner: takes && ownerUid !== uid, bloomedNow: !wasBloomed && care >= bloomAt };
    });
  } catch (error) {
    console.error("[blooms] 가꿈을 주지 못했다", error);
    return { ok: false, reason: "error" };
  }
}

/**
 * 운영자가 부적절한 정원 이름을 숨긴다. 명패에는 "이름 숨김"으로 남고, 숨긴 이름은
 * hiddenNick에 남아 같은 이름으로 다시 걸리지 않는다. 규칙이 운영자만 허락한다.
 */
export async function hideOwnerNick(speciesId: string, nick: string): Promise<void> {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스가 설정되지 않았다");
  await updateDoc(doc(db, "blooms", speciesId), { ownerNick: null, hiddenNick: nick });
}
