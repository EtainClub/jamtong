"use client";

import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 광장 — 모두가 함께 쓰는 정원. 설계는 docs/garden-game.md §3.8.
 *
 * plazaCells/{c00..c23}  칸마다 마지막으로 뽑힌 때와 다시 날 때(regrowAt).
 *                        문서가 없으면 처음부터 잡초가 나 있는 칸이다.
 * plazaDays/{YYYY-MM-DD} 그날 뽑힌 수와 정원지기 수 (기록판).
 *   └ gardeners/{uid}    한 사람을 한 번만 세기 위한 표식. 공개하지 않는다.
 *
 * ★ 서버 라우트를 거치지 않고 규칙이 지킨다.
 *   firebase-admin은 이 저장소에서 런타임 의존성이 아니다. 대신 규칙이 지켜야
 *   할 불변식만 지킨다 — 없는 잡초는 뽑을 수 없고(regrowAt <= 지금), 다시 나는
 *   시각은 [15, 245]분 안이며, 기록판은 실제로 뽑힌 칸과 짝이 맞을 때만 오른다.
 *   손으로 만든 요청으로 광장을 한꺼번에 치울 수는 있다. 그 방향의 반칙은
 *   광장을 깨끗하게 만들 뿐이라 감당한다.
 *
 * ★ 누가 뽑았는지는 칸에 남기지 않는다. 칸은 누구나 읽는다.
 */

export interface PlazaCell {
  id: string;
  /** 이 시각부터 잡초가 나 있다. 0이면 처음부터. */
  regrowAt: number;
}

export interface PlazaDay {
  pulls: number;
  gardeners: number;
}

export type PullResult = "ok" | "gone" | "error";

export function cellId(i: number): string {
  return `c${String(i).padStart(2, "0")}`;
}

export function watchPlaza(
  day: string,
  onCells: (cells: Map<string, PlazaCell>) => void,
  onDay: (day: PlazaDay) => void,
): () => void {
  const db = firebaseDb();
  if (!db) return () => {};

  const offCells = onSnapshot(collection(db, "plazaCells"), (snap) => {
    const cells = new Map<string, PlazaCell>();
    snap.forEach((d) => {
      const regrowAt = d.get("regrowAt") as Timestamp | undefined;
      cells.set(d.id, { id: d.id, regrowAt: regrowAt?.toMillis() ?? 0 });
    });
    onCells(cells);
  });
  const offDay = onSnapshot(doc(db, "plazaDays", day), (snap) => {
    onDay({ pulls: snap.get("pulls") ?? 0, gardeners: snap.get("gardeners") ?? 0 });
  });

  return () => {
    offCells();
    offDay();
  };
}

/**
 * 한 칸을 뽑는다. 이미 누가 뽑았으면 "gone", 그 밖의 실패는 "error".
 * 칸·기록판·정원지기 표식을 한 트랜잭션으로 쓴다 — 규칙이 셋의 짝을 본다.
 */
export async function pullWeed(
  uid: string,
  day: string,
  cell: string,
  regrowMinutes: number,
): Promise<PullResult> {
  const db = firebaseDb();
  if (!db) return "error";

  const cellRef = doc(db, "plazaCells", cell);
  const dayRef = doc(db, "plazaDays", day);
  const gardenerRef = doc(db, "plazaDays", day, "gardeners", uid);

  try {
    return await runTransaction(db, async (tx) => {
      const [c, d, g] = await Promise.all([tx.get(cellRef), tx.get(dayRef), tx.get(gardenerRef)]);
      const regrowAt = (c.get("regrowAt") as Timestamp | undefined)?.toMillis() ?? 0;
      if (regrowAt > Date.now()) return "gone" as const;

      tx.set(cellRef, {
        gen: ((c.get("gen") as number | undefined) ?? 0) + 1,
        pulledAt: serverTimestamp(),
        regrowAt: Timestamp.fromMillis(Date.now() + regrowMinutes * 60_000),
      });
      tx.set(dayRef, {
        pulls: ((d.get("pulls") as number | undefined) ?? 0) + 1,
        gardeners: ((d.get("gardeners") as number | undefined) ?? 0) + (g.exists() ? 0 : 1),
        lastCell: cell,
      });
      if (!g.exists()) tx.set(gardenerRef, { at: serverTimestamp() });
      return "ok" as const;
    });
  } catch (error) {
    // 규칙에 막힌 것은 대개 그새 누가 뽑았거나, 시계가 어긋나 아직 안 난 잡초를
    // 뽑으려 한 경우다. 그 밖의 실패(네트워크 등)는 "누가 먼저"로 덮지 않는다.
    if ((error as { code?: string }).code === "permission-denied") return "gone";
    console.error("[plaza] 잡초를 뽑지 못했다", error);
    return "error";
  }
}
