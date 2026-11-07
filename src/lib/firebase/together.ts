"use client";

import { collection, documentId, getDocs, query, where, type Timestamp } from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 함께 쌓은 기록 — 이웃 탭 맨 위 (docs/garden-game.md §3.10).
 *
 * 개인 순위 없이 "다 같이 한 것"만 센다. 모두 이미 누구나 읽는 문서다.
 *   plazaDays/{YYYY-MM-DD}       그날 뽑힌 잡초(pulls)와 정원지기 수(gardeners)
 *   plazaRaids/{날짜번호}-{물결}   쓰러진 시각(defeatedAt)
 *   blooms/{a:<slug>}            만개 시각(bloomedAt)은 꽃밭이 이미 듣고 있어서 여기서 읽지 않는다
 *
 * 한 번 읽는다. 실시간일 필요가 없는 숫자다.
 */

export interface Together {
  /** 기간 안에 뽑힌 잡초. */
  pulls: number;
  /** 기간 안에 하루 가장 많이 모인 정원지기 수. 사람을 날마다 따로 세서 기간 합계는 낼 수 없다. */
  busiestDay: number;
  /** 기간 안에 함께 쓰러뜨린 거대 잡초. */
  raidsDefeated: number;
  /** 기간 안에 나타난 거대 잡초. */
  raidsSeen: number;
}

const DAY = 86_400_000;
const KST = 9 * 3_600_000;

/** since(밀리초)부터 지금까지. */
export async function loadTogether(since: number): Promise<Together | null> {
  const db = firebaseDb();
  if (!db) return null;
  const fromDay = new Date(since + KST).toISOString().slice(0, 10);
  const fromNumber = Math.floor((since + KST) / DAY);

  const [days, raids] = await Promise.all([
    getDocs(query(collection(db, "plazaDays"), where(documentId(), ">=", fromDay))),
    getDocs(query(collection(db, "plazaRaids"), where(documentId(), ">=", String(fromNumber)))),
  ]);

  let pulls = 0;
  let busiestDay = 0;
  days.forEach((d) => {
    pulls += Number(d.get("pulls")) || 0;
    busiestDay = Math.max(busiestDay, Number(d.get("gardeners")) || 0);
  });

  let raidsDefeated = 0;
  raids.forEach((d) => {
    if ((d.get("defeatedAt") as Timestamp | null | undefined) != null) raidsDefeated += 1;
  });

  return { pulls, busiestDay, raidsDefeated, raidsSeen: raids.size };
}
