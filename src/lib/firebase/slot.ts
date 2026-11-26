"use client";

import { collection, doc, getDoc, getDocs, query, runTransaction, serverTimestamp, setDoc, where } from "firebase/firestore";

import { RAID_SLOTS, raidId } from "@/features/garden/rules";
import { POT_GIVE_MAX } from "@/features/garden/slot/rules";

import { firebaseDb } from "./client";

/**
 * 슬롯머신의 함께 쓰는 자리(docs/garden-slots.md).
 *
 *   plazaPot/{물결 id}/givers/{uid}    광장 잼 항아리 — 그 물결에 낸 내 몫(j, 누적). 누구나 읽는다.
 *   gardens/{공개id}/slotVisits/{uid}  남의 방 뽑기 기계를 오늘 돌려 봤다는 표식. 주인과 그 손님만 읽는다.
 *
 * ★ 불변식은 firestore.rules가 지킨다(한 번에 늘어나는 양, 한 사람 한 물결 상한, 하루 한 번).
 */

function need() {
  const db = firebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았다");
  return db;
}

const KST = 9 * 3_600_000;

/** 지금 잼이 모일 물결 — 열린 물결이 있고 아직 쓰러지지 않았으면 그것, 아니면 다음 물결(오늘 저녁이 지났으면 내일 아침). */
async function potTarget(now: number): Promise<string> {
  const db = need();
  const day = Math.floor((now + KST) / 86_400_000);
  const hour = ((now + KST) % 86_400_000) / 3_600_000;
  let wave = RAID_SLOTS.findIndex((s) => hour < s.close) + 1;
  if (wave === 0) return raidId(day + 1, 1);
  const open = hour >= RAID_SLOTS[wave - 1].open;
  if (open) {
    const snap = await getDoc(doc(db, "plazaRaids", raidId(day, wave))).catch(() => null);
    if (snap?.exists() && snap.get("defeatedAt")) wave += 1;
  }
  return wave > RAID_SLOTS.length ? raidId(day + 1, 1) : raidId(day, wave);
}

/** 잼 항아리에 내 몫을 더한다. 한 물결 상한에 닿았으면 더하지 않는다. 어느 물결에 더했는지 돌려준다. */
export async function givePot(uid: string, share: number, now = Date.now()): Promise<string | null> {
  if (share <= 0) return null;
  const db = need();
  const target = await potTarget(now);
  const ref = doc(db, "plazaPot", target, "givers", uid);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const j = snap.exists() ? Number(snap.get("j")) || 0 : 0;
    if (j + share > POT_GIVE_MAX) return null;
    tx.set(ref, { j: j + share, at: serverTimestamp() });
    return target;
  });
}

/** 그 물결 항아리에 모인 잼. */
export async function loadPot(id: string): Promise<number> {
  const db = need();
  const snap = await getDocs(collection(db, "plazaPot", id, "givers"));
  return snap.docs.reduce((n, d) => n + (Number(d.get("j")) || 0), 0);
}

// ── 방의 뽑기 기계 ──────────────────────────────────────────────────

/** 오늘 이 방의 뽑기 기계를 돌려 봤다고 남긴다. 오늘 이미 남겼으면 규칙이 막는다. */
export async function markGachaVisit(gid: string, me: { uid: string; nick: string }, day: number): Promise<void> {
  const db = need();
  await setDoc(doc(db, "gardens", gid, "slotVisits", me.uid), { day, nick: me.nick, at: serverTimestamp() });
}

/** 주인 — 오늘 내 뽑기 기계를 돌려 본 손님. */
export async function loadGachaVisits(gid: string, day: number): Promise<Array<{ uid: string; nick: string }>> {
  const db = need();
  const snap = await getDocs(query(collection(db, "gardens", gid, "slotVisits"), where("day", "==", day)));
  return snap.docs.map((d) => ({ uid: d.id, nick: typeof d.get("nick") === "string" ? (d.get("nick") as string).slice(0, 12) : "이웃" }));
}
