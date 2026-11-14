"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { Bloom } from "@/lib/firebase/blooms";
import { firebaseConfigured } from "@/lib/firebase/client";
import { countCheerNotes } from "@/lib/firebase/cheers";
import { findRoomOf } from "@/lib/firebase/gardens";
import { loadTogether, type Together } from "@/lib/firebase/together";

import { gardenFeedback } from "./feedback";
import type { Species } from "./types";

/**
 * 이웃 — 순위표 대신 셋을 둔다 (docs/garden-game.md §3.10 "이웃").
 *
 * 1. 함께 쌓은 기록: 이번 주 다 같이 한 것. 개인은 없다.
 * 2. 정원지기 명패판: 꽃밭 명패를 정원 이름별로 모은다. 명패는 Firestore 규칙이 정직성을
 *    지키는 값이라(blooms) 손으로 만든 요청으로 부풀릴 수 없다. 번호·메달을 달지 않는다.
 * 3. (옛) 친구 정원 비교는 1촌 탭의 "가 본 방"으로 옮겼다(ilchon/IlchonTab.tsx).
 * 명패의 이름에서 그 정원지기의 방으로 건너갈 수 있다(마실, docs/garden-miniroom.md §5.4).
 *
 * ★ 사진은 어디에도 싣지 않는다. 남에게 보이는 것은 정원 이름뿐이다.
 */

const WEEK = 7 * 86_400_000;
const BOARD_MAX = 20;

export function Neighbors({
  uid,
  blooms,
  byId,
  now,
  onVisit,
  say,
}: {
  uid: string | null;
  blooms: Map<string, Bloom>;
  byId: Map<string, Species>;
  now: number;
  onVisit: (gid: string) => void;
  say: (text: string) => void;
}) {
  return (
    <div className="space-y-5">
      <TogetherCard blooms={blooms} now={now} />
      <KeeperBoard blooms={blooms} byId={byId} uid={uid} onVisit={onVisit} say={say} />
    </div>
  );
}

// ── 함께 쌓은 기록 ─────────────────────────────────────────────────

function TogetherCard({ blooms, now }: { blooms: Map<string, Bloom>; now: number }) {
  // 탭을 연 때를 기준으로 한 번 읽는다. 시계가 매초 바뀌어도 다시 읽지 않는다.
  const [since] = useState(() => now - WEEK);
  const [stats, setStats] = useState<Together | null | "error">(null);

  useEffect(() => {
    if (!firebaseConfigured) return;
    let alive = true;
    loadTogether(since)
      .then((t) => alive && setStats(t))
      .catch((error) => {
        console.error("[together] 함께 쌓은 기록을 읽지 못했다", error);
        if (alive) setStats("error");
      });
    return () => {
      alive = false;
    };
  }, [since]);

  const bloomed = [...blooms.values()].filter((b) => b.bloomedAt);
  const bloomedWeek = bloomed.filter((b) => (b.bloomedAt ?? 0) >= since).length;
  const care = [...blooms.values()].reduce((n, b) => n + b.care, 0);
  const ready = stats && stats !== "error";

  return (
    <section aria-labelledby="together-title" className="rounded-2xl bg-[var(--g-panel)] px-4 py-3.5">
      <h2 id="together-title" className="text-[14px] font-bold">🤝 이번 주 함께 쌓은 것</h2>
      <p className="mt-0.5 text-[11.5px] text-smoke">지난 7일, 정원에 온 모두가 같이 한 일이에요. 누가 얼마나 했는지는 세지 않아요.</p>
      {!firebaseConfigured ? (
        <p className="mt-3 text-[12px] text-smoke">이 환경에서는 볼 수 없어요.</p>
      ) : stats === "error" ? (
        <p className="mt-3 text-[12px] text-smoke">기록을 불러오지 못했어요. 잠시 뒤 다시 열어 보세요.</p>
      ) : (
        <dl className="mt-3 grid grid-cols-2 gap-2 text-center">
          <Stat value={ready ? stats.pulls.toLocaleString() : "…"} label="뽑은 잡초" />
          <Stat value={ready ? `${stats.raidsDefeated}/${stats.raidsSeen}` : "…"} label="쓰러뜨린 거대 잡초" />
          <Stat value={`${bloomedWeek}`} label={`새로 핀 업적 · 모두 ${bloomed.length}`} />
          <Stat value={ready ? `${stats.busiestDay}명` : "…"} label="가장 붐빈 날의 정원지기" />
        </dl>
      )}
      <p className="mt-2 text-[11px] text-smoke">꽃밭에 모인 가꿈은 지금까지 모두 {care.toLocaleString()}이에요.</p>
      <CheerLine since={since} />
    </section>
  );
}

/**
 * 같은 주, 언행 탭에 남은 응원 수 — 숫자와 길만.
 *
 * 응원 글은 싣지 않는다. 정원은 근거를 퍼뜨리는 자리이고 응원 글은 검증된 자료가 아니다.
 * 버프·잼도 붙이지 않는다 — 응원에 게임 보상을 붙이지 않는다(docs/garden-game.md §1).
 */
function CheerLine({ since }: { since: number }) {
  const [week, setWeek] = useState<number | null>(null);
  useEffect(() => {
    if (!firebaseConfigured) return;
    let alive = true;
    countCheerNotes(since)
      .then((c) => alive && setWeek(c.week))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [since]);

  if (week === null) return null;
  return (
    <Link
      href="/words?tab=cheers&from=neighbors"
      className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-white/70 px-3 py-2 text-[12px]"
    >
      <span>
        💬 같은 주, 언행 탭에 남은 응원 <b className="tabular-nums">{week.toLocaleString()}</b>줄
      </span>
      <span aria-hidden="true" className="text-smoke">→</span>
    </Link>
  );
}

// ── 정원지기 명패판 ────────────────────────────────────────────────

interface Keeper {
  uid: string;
  nick: string | null;
  plates: Array<{ id: string; title: string; bloomed: boolean }>;
}

export function keeperBoard(blooms: Map<string, Bloom>, byId: Map<string, Species>): Keeper[] {
  const byUid = new Map<string, Keeper>();
  for (const [id, b] of blooms) {
    if (!b.ownerUid) continue;
    const species = byId.get(id);
    if (!species) continue; // 품종표에 없는 업적(내려간 콘텐츠)은 그리지 않는다.
    const k = byUid.get(b.ownerUid) ?? { uid: b.ownerUid, nick: null, plates: [] };
    // 숨긴 이름(ownerNick이 비었다)은 "이름 숨김"으로. 같은 사람의 다른 명패에 이름이 있으면 그것을 쓴다.
    if (b.ownerNick && !k.nick) k.nick = b.ownerNick;
    k.plates.push({ id, title: species.title, bloomed: Boolean(b.bloomedAt) });
    byUid.set(b.ownerUid, k);
  }
  const bloomedCount = (k: Keeper) => k.plates.filter((p) => p.bloomed).length;
  return [...byUid.values()].sort(
    (a, b) => b.plates.length - a.plates.length || bloomedCount(b) - bloomedCount(a) || (a.nick ?? "").localeCompare(b.nick ?? ""),
  );
}

function KeeperBoard({
  blooms,
  byId,
  uid,
  onVisit,
  say,
}: {
  blooms: Map<string, Bloom>;
  byId: Map<string, Species>;
  uid: string | null;
  onVisit: (gid: string) => void;
  say: (text: string) => void;
}) {
  const keepers = useMemo(() => keeperBoard(blooms, byId), [blooms, byId]);
  const [open, setOpen] = useState<string | null>(null);
  const shown = keepers.slice(0, BOARD_MAX);
  const mine = uid ? keepers.find((k) => k.uid === uid) : undefined;

  return (
    <section aria-labelledby="keepers-title" className="rounded-2xl bg-[var(--g-panel)] px-4 py-3.5">
      <h2 id="keepers-title" className="text-[14px] font-bold">👑 정원지기 명패</h2>
      <p className="mt-0.5 text-[11.5px] leading-relaxed text-smoke">
        업적마다 가장 많이 가꾼 사람에게 명패가 걸려요. 하루에 줄 수 있는 가꿈이 정해져 있어서, 여러 날 꾸준히 돌본 정원이 명패를 모아요.
      </p>
      {mine && (
        <p className="mt-2 text-[12px] font-semibold text-[var(--g-leaf)]">내 명패 {mine.plates.length}개 · 그중 만개 {mine.plates.filter((p) => p.bloomed).length}</p>
      )}
      {shown.length === 0 ? (
        <p className="mt-3 text-[12px] text-smoke">아직 걸린 명패가 없어요. 꽃밭에서 업적을 가꿔 첫 정원지기가 되어 보세요.</p>
      ) : (
        <ul className="mt-3 divide-y divide-stone/60">
          {shown.map((k) => {
            const bloomed = k.plates.filter((p) => p.bloomed).length;
            const expanded = open === k.uid;
            return (
              <li key={k.uid} className="py-2">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => {
                    gardenFeedback("tap");
                    setOpen(expanded ? null : k.uid);
                  }}
                  className="flex w-full items-center gap-2 text-left"
                >
                  <span className={`min-w-0 flex-1 truncate text-[13px] font-semibold ${k.uid === uid ? "text-[var(--g-leaf)]" : ""}`}>
                    {k.nick ?? "이름 숨김"}
                    {k.uid === uid && <span className="ml-1 text-[11px] font-medium">(나)</span>}
                  </span>
                  <span className="shrink-0 text-[12px] tabular-nums text-smoke">
                    👑 {k.plates.length}
                    {bloomed > 0 && <span className="ml-1.5">🌸 {bloomed}</span>}
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-[10px] text-smoke">{expanded ? "▴" : "▾"}</span>
                </button>
                {expanded && (
                  <>
                    <ul className="mt-1.5 flex flex-wrap gap-1">
                      {k.plates.map((p) => (
                        <li key={p.id} className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] ring-1 ring-stone">
                          {p.bloomed ? "🌸 " : ""}
                          {p.title}
                        </li>
                      ))}
                    </ul>
                    {k.uid !== uid && firebaseConfigured && (
                      // 명패에는 uid만 있다. 누를 때만 그 사람의 공개 방을 하나 찾는다(gardens.ts의 findRoomOf).
                      <button
                        type="button"
                        className="garden-chip-btn mt-1.5"
                        onClick={() => {
                          gardenFeedback("tap");
                          findRoomOf(k.uid)
                            .then((gid) => (gid ? onVisit(gid) : say("이 정원지기는 방을 열지 않았어요")))
                            .catch((error) => {
                              console.error("[neighbors] 정원지기의 방을 찾지 못했다", error);
                              say("방을 찾지 못했어요. 잠시 뒤 다시 해 보세요");
                            });
                        }}
                      >
                        방 구경 →
                      </button>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {keepers.length > BOARD_MAX && <p className="mt-1 text-[11px] text-smoke">명패가 있는 정원 {keepers.length}곳 중 {BOARD_MAX}곳을 보여요.</p>}
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse rounded-xl bg-white/70 py-2">
      <dt className="text-[11px] text-smoke">{label}</dt>
      <dd className="text-[17px] font-bold tabular-nums">{value}</dd>
    </div>
  );
}
