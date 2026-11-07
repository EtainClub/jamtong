"use client";

import { useEffect, useMemo, useState } from "react";

import type { Bloom } from "@/lib/firebase/blooms";
import { firebaseConfigured } from "@/lib/firebase/client";
import { loadPublicGardens, type PublicGarden } from "@/lib/firebase/gardens";
import { loadTogether, type Together } from "@/lib/firebase/together";

import { gardenFeedback } from "./feedback";
import { TitleChips } from "./parts";
import { publicSnapshot } from "./share";
import { useGarden, type GardenData } from "./store";
import type { Species } from "./types";

/**
 * 이웃 — 순위표 대신 셋을 둔다 (docs/garden-game.md §3.10 "이웃").
 *
 * 1. 함께 쌓은 기록: 이번 주 다 같이 한 것. 개인은 없다.
 * 2. 정원지기 명패판: 꽃밭 명패를 정원 이름별로 모은다. 명패는 Firestore 규칙이 정직성을
 *    지키는 값이라(blooms) 손으로 만든 요청으로 부풀릴 수 없다. 번호·메달을 달지 않는다.
 * 3. 친구 정원 비교: 내가 놀러 간 공개 정원끼리만 나란히 본다. 공개 정원의 숫자는 주인
 *    브라우저가 적는 값이라 모두에게 보이는 순위로 쓰지 않는다.
 *
 * ★ 사진은 어디에도 싣지 않는다. 남에게 보이는 것은 정원 이름뿐이다.
 */

const WEEK = 7 * 86_400_000;
const BOARD_MAX = 20;

export function Neighbors({
  data,
  uid,
  blooms,
  byId,
  now,
  onVisit,
}: {
  data: GardenData;
  uid: string | null;
  blooms: Map<string, Bloom>;
  byId: Map<string, Species>;
  now: number;
  onVisit: (gid: string) => void;
}) {
  return (
    <div className="space-y-5">
      <TogetherCard blooms={blooms} now={now} />
      <KeeperBoard blooms={blooms} byId={byId} uid={uid} />
      <FriendCompare data={data} onVisit={onVisit} />
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
    </section>
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

function KeeperBoard({ blooms, byId, uid }: { blooms: Map<string, Bloom>; byId: Map<string, Species>; uid: string | null }) {
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
                  <ul className="mt-1.5 flex flex-wrap gap-1">
                    {k.plates.map((p) => (
                      <li key={p.id} className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] ring-1 ring-stone">
                        {p.bloomed ? "🌸 " : ""}
                        {p.title}
                      </li>
                    ))}
                  </ul>
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

// ── 친구 정원 비교 ─────────────────────────────────────────────────

function FriendCompare({ data, onVisit }: { data: GardenData; onVisit: (gid: string) => void }) {
  const ids = useMemo(() => data.friends.map((f) => f.id), [data.friends]);
  const key = ids.join(",");
  const [loaded, setLoaded] = useState<{ key: string; gardens: Map<string, PublicGarden | null> } | "error" | null>(null);

  useEffect(() => {
    if (!firebaseConfigured || !key) return;
    let alive = true;
    loadPublicGardens(key.split(","))
      .then((gardens) => alive && setLoaded({ key, gardens }))
      .catch((error) => {
        console.error("[neighbors] 친구 정원을 읽지 못했다", error);
        if (alive) setLoaded("error");
      });
    return () => {
      alive = false;
    };
  }, [key]);

  const me = publicSnapshot(data);
  const gardens = loaded && loaded !== "error" && loaded.key === key ? loaded.gardens : null;
  const rows = data.friends.map((f) => ({ ...f, garden: gardens ? (gardens.get(f.id) ?? null) : undefined }));
  const live = rows.filter((r) => r.garden).sort((a, b) => b.garden!.dex - a.garden!.dex);
  const gone = rows.filter((r) => r.garden === null);

  return (
    <section aria-labelledby="friends-title" className="rounded-2xl bg-[var(--g-panel)] px-4 py-3.5">
      <h2 id="friends-title" className="text-[14px] font-bold">🌿 친구 정원과 나란히</h2>
      <p className="mt-0.5 text-[11.5px] leading-relaxed text-smoke">
        내가 놀러 간 공개 정원만 보여요. 모두에게 보이는 순위가 아니라 내 화면에서만 나란히 놓아 보는 거예요.
      </p>

      <Row nick={`${data.nick} (나)`} garden={me} mine />

      {data.friends.length === 0 ? (
        <p className="mt-3 text-[12px] leading-relaxed text-smoke">
          아직 놀러 간 정원이 없어요. 친구가 보낸 정원 링크를 열면 여기에 친구 정원이 생겨요.
        </p>
      ) : loaded === "error" ? (
        <p className="mt-3 text-[12px] text-smoke">친구 정원을 불러오지 못했어요. 잠시 뒤 다시 열어 보세요.</p>
      ) : gardens === null ? (
        <p className="mt-3 text-[12px] text-smoke">친구 정원을 불러오는 중…</p>
      ) : (
        <>
          {live.map((r) => (
            <Row key={r.id} nick={r.garden!.nick || r.nick} garden={r.garden!} onOpen={() => onVisit(r.id)} />
          ))}
          {gone.length > 0 && (
            <div className="mt-3 text-[11.5px] text-smoke">
              <p>공개를 끈 정원 {gone.length}곳</p>
              <ul className="mt-1 flex flex-wrap gap-1">
                {gone.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => useGarden.getState().forgetFriend(r.id)}
                      className="rounded-full bg-white/70 px-2 py-0.5 ring-1 ring-stone"
                      aria-label={`${r.nick} 목록에서 빼기`}
                    >
                      {r.nick} ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      {!data.share.on && (
        <p className="mt-3 text-[11px] text-smoke">내 정원은 공개하지 않아서 친구 화면에는 보이지 않아요(정원 머리의 ‘자랑하기’).</p>
      )}
    </section>
  );
}

function Row({ nick, garden, mine, onOpen }: { nick: string; garden: PublicGarden; mine?: boolean; onOpen?: () => void }) {
  // 칭호 목록(ul)과 숫자(dl)는 단추 안에 둘 수 없다. 놀러 가기는 따로 작은 단추로.
  return (
    <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-stone/70">
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[13px] font-semibold ${mine ? "text-[var(--g-leaf)]" : ""}`}>{nick}</p>
        <TitleChips levels={garden.titles} className="mt-1" />
        {onOpen && (
          <button
            type="button"
            onClick={() => {
              gardenFeedback("tap");
              onOpen();
            }}
            className="mt-1 text-[11px] font-medium text-smoke underline underline-offset-2"
          >
            놀러 가기 →
          </button>
        )}
      </div>
      <dl className="grid shrink-0 grid-cols-3 gap-2 text-center text-[11px]">
        <Mini value={garden.dex} label="도감" />
        <Mini value={garden.golden} label="황금" />
        <Mini value={garden.rainbow} label="무지개" />
      </dl>
    </div>
  );
}

function Mini({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex w-9 flex-col-reverse">
      <dt className="text-smoke">{label}</dt>
      <dd className="text-[13px] font-bold tabular-nums">{value}</dd>
    </div>
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
