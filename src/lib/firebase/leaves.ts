"use client";

import { doc, runTransaction, serverTimestamp } from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 시든 잎 확인 — 운영자 큐. 설계는 docs/garden-game.md §3.8.
 *
 * leafChecks/{leafId}        "열려요"·"안 열려요"를 누른 수. 누구나 읽는다.
 *   └ votes/{uid}            한 사람의 답. 본인만 읽는다. 한 사람이 잎 하나에 한 번.
 *
 * ★ 피드백 게시판에 쓰지 않는다.
 *   피드백은 사람이 쓴 글이 모이는 공개 게시판이다. 링크 확인이 거기 쌓이면 사람의
 *   글이 묻히고, 같은 링크에 대한 같은 말이 수십 건 생긴다. 여기서는 잎마다 숫자
 *   두 개로 모으고, 운영자는 `pnpm garden:leaves`로 본다.
 *
 * ★ url을 문서에 적지 않는다. 규칙은 id와 url의 짝을 확인할 수 없어, 적게 두면
 *   누구나 아무 url이나 적을 수 있다. id는 빌드 때 url에서 나오고, 운영자 스크립트가
 *   같은 목록으로 되짚는다.
 *
 * "모르겠어요"는 여기 쓰지 않는다. 운영자에게 줄 정보가 없다.
 */

export type LeafWrite = "ok" | "already" | "error";

export async function checkLeaf(uid: string, leafId: string, verdict: "opens" | "fails"): Promise<LeafWrite> {
  const db = firebaseDb();
  if (!db) return "error";

  const leafRef = doc(db, "leafChecks", leafId);
  const voteRef = doc(db, "leafChecks", leafId, "votes", uid);

  try {
    return await runTransaction(db, async (tx) => {
      const [leaf, vote] = await Promise.all([tx.get(leafRef), tx.get(voteRef)]);
      if (vote.exists()) return "already" as const;
      const opens = (leaf.get("opens") as number | undefined) ?? 0;
      const fails = (leaf.get("fails") as number | undefined) ?? 0;
      tx.set(voteRef, { verdict, at: serverTimestamp() });
      tx.set(leafRef, {
        opens: opens + (verdict === "opens" ? 1 : 0),
        fails: fails + (verdict === "fails" ? 1 : 0),
        updatedAt: serverTimestamp(),
      });
      return "ok" as const;
    });
  } catch (error) {
    console.error("[leaves] 확인을 남기지 못했다", error);
    return "error";
  }
}
