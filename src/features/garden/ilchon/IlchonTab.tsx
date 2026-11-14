"use client";

import { useEffect, useMemo, useState } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import { loadPublicGardens, loadRecentRooms, type PublicGarden } from "@/lib/firebase/gardens";
import { acceptKnock, cancelKnock, cutIlchon, rejectKnock, retagIlchon, unblockUser, type Knock } from "@/lib/firebase/ilchon";

import { gardenFeedback } from "../feedback";
import { TitleChips } from "../parts";
import { publicSnapshot } from "../share";
import { Sheet } from "../Sheet";
import { useGarden, type GardenData } from "../store";
import type { Species } from "../types";
import { blockPerson, ilchonNews, refreshIlchon, useIlchonLive } from "./live";
import { GuestbookModePicker, OpenRoomPrompt, SwitchRow, TagSheet } from "./parts";
import { ILCHON_MAX, pickRandomRoom, SENT_MAX, tagLabel, type Friend } from "./rules";

/**
 * 1촌 탭 (docs/garden-miniroom.md §5). 위에서부터 1촌 소식 · 받은 신청 · 1촌 목록 · 보낸 신청 ·
 * 가 본 방 · 설정. 아래에는 지금까지의 이웃(함께 쌓은 것·명패)이 그대로 붙는다(GardenApp).
 *
 * ★ 1촌 목록은 본인만 본다. 계측에는 수만 보낸다(누구와 맺었는지 보내지 않는다).
 * ★ 1촌 수에는 보상이 없다. 많이 맺는다고 잼도 칭호도 주지 않는다.
 * ★ 읽기: 탭을 열 때 1촌 목록 한 번, 1촌 방 문서는 10분에 한 번까지(live.ts).
 */
export function IlchonTab({
  data,
  uid,
  byId,
  knocks,
  onVisit,
  say,
}: {
  data: GardenData;
  uid: string | null;
  byId: Map<string, Species>;
  knocks: Knock[];
  onVisit: (gid: string) => void;
  say: (text: string) => void;
}) {
  const il = data.ilchon;
  const gid = data.share.on ? data.share.id : null;
  const rooms = useIlchonLive((s) => s.rooms);
  const [done, setDone] = useState<{ key: string; error: boolean } | null>(null);
  const [accepting, setAccepting] = useState<Knock | null>(null);
  const [menu, setMenu] = useState<Friend | null>(null);
  const [retag, setRetag] = useState<Friend | null>(null);
  const [cutting, setCutting] = useState<Friend | null>(null);
  const [rolling, setRolling] = useState(false);

  // 탭을 열 때 한 번. 방 문서는 10분이 지났을 때만 다시 읽는다(live.ts의 refreshIlchon).
  const loadKey = `${uid}:${gid}`;
  useEffect(() => {
    if (!firebaseConfigured || !uid || !gid) return;
    let alive = true;
    refreshIlchon(gid, uid)
      .then(() => alive && setDone({ key: loadKey, error: false }))
      .catch((error) => {
        console.error("[ilchon] 1촌 목록을 읽지 못했다", error);
        if (alive) setDone({ key: loadKey, error: true });
      });
    return () => {
      alive = false;
    };
  }, [uid, gid, loadKey]);
  const loading = !firebaseConfigured || !uid || !gid ? "idle" : done?.key !== loadKey ? "loading" : done.error ? "error" : "idle";

  const me = uid && gid ? { uid, gid, nick: data.nick } : null;
  const news = useMemo(() => ilchonNews(il.friends, rooms, byId), [il.friends, rooms, byId]);
  const fail = (what: string) => (error: unknown) => {
    console.error(`[ilchon] ${what}`, error);
    say(`${what} 잠시 뒤 다시 해 보세요`);
  };

  const roll = async () => {
    if (rolling) return;
    setRolling(true);
    gardenFeedback("tap");
    try {
      const recent = await loadRecentRooms();
      const pick = pickRandomRoom(recent.map((r) => ({ gid: r.gid, hidden: r.hidden, mine: r.ownerUid === uid || r.gid === data.share.id })));
      if (pick) onVisit(pick);
      else say("아직 열린 방이 없어요");
    } catch (error) {
      fail("방을 찾지 못했어요.")(error);
    } finally {
      setRolling(false);
    }
  };

  return (
    <div className="space-y-4">
      <section aria-labelledby="ilchon-head" className="garden-diary is-plain">
        <p className="garden-today">
          <span>1촌</span> <b>{il.friends.length}</b>
          <span aria-hidden="true"> / </span>
          <span>{ILCHON_MAX}</span>
          {knocks.length > 0 && (
            <>
              <span aria-hidden="true"> · </span>
              <span>받은 신청</span> <b>{knocks.length}</b>
            </>
          )}
        </p>
        <h2 id="ilchon-head" className="garden-diary-name">{data.nick}의 1촌</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-smoke">
          1촌은 서로의 방에 마실을 다니는 사이예요. 1촌에게 준 물은 남은 시간을 15% 줄여요. 1촌 목록은 나만 봐요.
        </p>
        <button type="button" disabled={rolling} onClick={() => void roll()} className="garden-diary-btn mt-2 w-full">
          🎲 파도타기
        </button>
      </section>

      {!data.share.on && <OpenRoomPrompt say={say} />}

      {gid && (
        <section aria-labelledby="ilchon-news" className="garden-news">
          <h2 id="ilchon-news" className="garden-diary-title">1촌 소식</h2>
          {news.length === 0 ? (
            <p className="mt-1 text-[13px] text-smoke">
              {loading === "loading" ? "불러오는 중…" : il.friends.length ? "아직 새 소식이 없어요." : "1촌을 맺으면 1촌이 새 품종을 거두거나 변이 화분을 놓을 때 여기에 와요."}
            </p>
          ) : (
            <ul className="mt-1.5">
              {news.map((n) => (
                <li key={n.g}>
                  <button type="button" onClick={() => { gardenFeedback("tap"); onVisit(n.g); }} className="garden-news-row">
                    <span aria-hidden="true" className="text-[17px] leading-none">🌿</span>
                    <span className="min-w-0 flex-1 text-left"><b>{n.nick}</b> — {n.text}</span>
                    <span className="garden-news-go">방 →</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {gid && knocks.length > 0 && (
        <section aria-labelledby="ilchon-knocks" className="garden-diary-box">
          <h2 id="ilchon-knocks" className="garden-diary-title">받은 1촌 신청 {knocks.length}</h2>
          <ul className="mt-1.5 divide-y divide-dashed divide-[var(--d-line)]">
            {knocks.map((k) => (
              <li key={k.uid} className="py-2">
                <p className="text-[13.5px]">
                  <b>{k.n}</b> <span className="text-smoke">· 「{tagLabel(k.tag)}」로 신청했어요</span>
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <button type="button" className="garden-diary-btn" disabled={il.friends.length >= ILCHON_MAX} onClick={() => { gardenFeedback("tap"); setAccepting(k); }}>
                    수락
                  </button>
                  <button type="button" className="garden-diary-btn is-quiet" onClick={() => onVisit(k.g)}>방 보기</button>
                  <button
                    type="button"
                    className="garden-diary-btn is-quiet"
                    onClick={() => {
                      if (!me) return;
                      gardenFeedback("tap");
                      rejectKnock(me.gid, k.uid).then(() => say("거절했어요 · 상대에게 알리지 않아요")).catch(fail("거절하지 못했어요."));
                    }}
                  >
                    거절
                  </button>
                  <button
                    type="button"
                    className="garden-diary-btn is-quiet"
                    onClick={() => {
                      if (!me) return;
                      blockPerson(me, { uid: k.uid, n: k.n }).then(() => say(`${k.n}님을 차단했어요`)).catch(fail("차단하지 못했어요."));
                    }}
                  >
                    차단
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {il.friends.length >= ILCHON_MAX && <p className="mt-1 text-[12px] text-smoke">1촌은 {ILCHON_MAX}명까지예요. 수락하려면 먼저 한 명을 끊어야 해요.</p>}
        </section>
      )}

      {gid && (
        <section aria-labelledby="ilchon-list" className="garden-diary-box">
          <h2 id="ilchon-list" className="garden-diary-title">1촌 목록</h2>
          {loading === "error" && <p className="mt-1 text-[13px] text-smoke">1촌 목록을 불러오지 못했어요. 잠시 뒤 다시 열어 보세요.</p>}
          {il.friends.length === 0 ? (
            <p className="mt-1 text-[13px] leading-relaxed text-smoke">
              아직 1촌이 없어요. 마음에 드는 방에서 ‘🤝 1촌 신청’을 눌러 보세요. 위의 ‘파도타기’로 시작해도 좋아요.
            </p>
          ) : (
            <ul className="mt-1">
              <CompareRow nick={`${data.nick} (나)`} garden={publicSnapshot(data)} mine />
              {il.friends.map((f) => (
                <FriendRow key={f.uid} friend={f} room={rooms.get(f.g)} onVisit={() => onVisit(f.g)} onMenu={() => setMenu(f)} />
              ))}
            </ul>
          )}
        </section>
      )}

      {il.sent.length > 0 && (
        <section aria-labelledby="ilchon-sent" className="garden-diary-box">
          <h2 id="ilchon-sent" className="garden-diary-title">보낸 신청 {il.sent.length}/{SENT_MAX}</h2>
          <ul className="mt-1">
            {il.sent.map((s) => (
              <li key={s.g} className="flex min-h-[44px] items-center gap-2 border-b border-dotted border-[var(--d-line)] last:border-0">
                <button type="button" className="min-w-0 flex-1 truncate text-left text-[13.5px] font-bold" onClick={() => onVisit(s.g)}>
                  {s.n}
                </button>
                <span className="shrink-0 text-[12px] text-smoke">「{tagLabel(s.tag)}」 · 기다리는 중</span>
                <button
                  type="button"
                  className="garden-chip-btn"
                  onClick={() => {
                    if (!uid) return;
                    cancelKnock(s.g, uid)
                      .then(() => {
                        useGarden.getState().updateIlchon((x) => ({ ...x, sent: x.sent.filter((y) => y.g !== s.g) }));
                        say("신청을 거뒀어요");
                      })
                      .catch(fail("신청을 거두지 못했어요."));
                  }}
                >
                  취소
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <VisitedRooms data={data} onVisit={onVisit} />

      {gid && me && <IlchonSettings data={data} me={me} say={say} />}

      {accepting && me && (
        <TagSheet
          title={`${accepting.n}님과 1촌 맺기`}
          intro="내 목록에서 이 1촌에게 붙일 이름표를 골라요. 상대는 신청할 때 고른 이름표를 써요."
          submitLabel="1촌 맺기"
          onClose={() => setAccepting(null)}
          onPick={async (tag) => {
            try {
              await acceptKnock(me, accepting, tag);
              gardenFeedback("reward");
              track("ilchon_accept");
              say(`🤝 ${accepting.n}님과 1촌이 되었어요`);
              setAccepting(null);
              await refreshIlchon(me.gid, me.uid, true);
            } catch (error) {
              fail("1촌을 맺지 못했어요. 상대가 방을 닫았을 수도 있어요.")(error);
            }
          }}
        />
      )}

      {menu && me && (
        <Sheet label={`${menu.n} 1촌 메뉴`} title={rooms.get(menu.g)?.nick || menu.n} onClose={() => setMenu(null)}>
          <p className="mt-1 text-[12.5px] text-smoke">내 이름표 「{tagLabel(menu.tag)}」</p>
          <div className="mt-3 grid gap-2">
            <button type="button" className="garden-diary-btn is-quiet" onClick={() => { setRetag(menu); setMenu(null); }}>🏷 이름표 바꾸기</button>
            <button type="button" className="garden-diary-btn is-quiet" onClick={() => { setCutting(menu); setMenu(null); }}>✂️ 1촌 끊기</button>
            <button
              type="button"
              className="garden-diary-btn is-quiet"
              onClick={() => {
                const f = menu;
                setMenu(null);
                blockPerson(me, { uid: f.uid, n: f.n })
                  .then(() => say(`${f.n}님을 차단했어요 · 1촌도 끊었어요`))
                  .catch(fail("차단하지 못했어요."));
              }}
            >
              🚫 차단
            </button>
          </div>
        </Sheet>
      )}

      {retag && me && (
        <TagSheet
          title="이름표 바꾸기"
          initial={retag.tag}
          submitLabel="바꾸기"
          onClose={() => setRetag(null)}
          onPick={async (tag) => {
            try {
              await retagIlchon(me.gid, retag.uid, tag);
              useGarden.getState().updateIlchon((x) => ({ ...x, friends: x.friends.map((f) => (f.uid === retag.uid ? { ...f, tag } : f)) }));
              setRetag(null);
            } catch (error) {
              fail("이름표를 바꾸지 못했어요.")(error);
            }
          }}
        />
      )}

      {cutting && me && (
        <Sheet label="1촌 끊기" title={`${cutting.n}님과 1촌을 끊을까요?`} onClose={() => setCutting(null)}>
          <p className="mt-1 text-[13px] leading-relaxed text-smoke">
            양쪽 목록에서 함께 빠지고, 서로 남긴 1촌평도 지워져요. 상대에게 알리지 않아요.
          </p>
          <button
            type="button"
            className="garden-shop-buy mt-4 w-full"
            onClick={() => {
              const f = cutting;
              cutIlchon(me, f)
                .then(() => {
                  useGarden.getState().updateIlchon((x) => ({ ...x, friends: x.friends.filter((y) => y.uid !== f.uid) }));
                  track("ilchon_cut");
                  setCutting(null);
                  say("1촌을 끊었어요");
                })
                .catch(fail("1촌을 끊지 못했어요."));
            }}
          >
            끊기
          </button>
        </Sheet>
      )}
    </div>
  );
}

function FriendRow({ friend, room, onVisit, onMenu }: { friend: Friend; room: PublicGarden | null | undefined; onVisit: () => void; onMenu: () => void }) {
  const nick = room?.nick || friend.n;
  return (
    <li className="garden-friend-row">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-bold">
          {nick} <span className="text-[12px] font-medium text-smoke">· {tagLabel(friend.tag)}</span>
        </p>
        {room ? <TitleChips levels={room.titles} className="mt-0.5" /> : <p className="text-[12px] text-smoke">{room === null ? "방을 닫았어요" : "…"}</p>}
        <div className="mt-1 flex gap-1.5">
          {room && <button type="button" className="garden-chip-btn" onClick={() => { gardenFeedback("tap"); onVisit(); }}>놀러 가기</button>}
          <button type="button" className="garden-chip-btn" aria-label={`${nick} 메뉴`} onClick={() => { gardenFeedback("tap"); onMenu(); }}>⋯</button>
        </div>
      </div>
      {room && <Stats garden={room} />}
    </li>
  );
}

function CompareRow({ nick, garden, mine, onOpen }: { nick: string; garden: PublicGarden; mine?: boolean; onOpen?: () => void }) {
  return (
    <li className="garden-friend-row">
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[13.5px] font-bold ${mine ? "text-[var(--d-orange)]" : ""}`}>{nick}</p>
        <TitleChips levels={garden.titles} className="mt-0.5" />
        {onOpen && (
          <button type="button" className="garden-chip-btn mt-1" onClick={() => { gardenFeedback("tap"); onOpen(); }}>
            놀러 가기
          </button>
        )}
      </div>
      <Stats garden={garden} />
    </li>
  );
}

function Stats({ garden }: { garden: PublicGarden }) {
  return (
    <dl className="grid shrink-0 grid-cols-3 gap-1.5 text-center text-[11px]">
      {[
        [garden.dex, "도감"],
        [garden.golden, "황금"],
        [garden.rainbow, "무지개"],
      ].map(([v, label]) => (
        <div key={label} className="flex w-10 flex-col-reverse">
          <dt className="text-smoke">{label}</dt>
          <dd className="text-[13px] font-bold tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * 가 본 방 — 예전 "친구 정원과 나란히". 내가 놀러 간 공개 방끼리만 내 화면에서 나란히 본다.
 * 모두에게 보이는 순위가 아니다. 1촌은 위 목록에 있으므로 여기서는 뺀다.
 */
function VisitedRooms({ data, onVisit }: { data: GardenData; onVisit: (gid: string) => void }) {
  const friendGids = useMemo(() => new Set(data.ilchon.friends.map((f) => f.g)), [data.ilchon.friends]);
  const visited = useMemo(() => data.friends.filter((f) => !friendGids.has(f.id)), [data.friends, friendGids]);
  const key = visited.map((f) => f.id).join(",");
  const [loaded, setLoaded] = useState<{ key: string; gardens: Map<string, PublicGarden | null> } | "error" | null>(null);

  useEffect(() => {
    if (!firebaseConfigured || !key) return;
    let alive = true;
    loadPublicGardens(key.split(","))
      .then((gardens) => alive && setLoaded({ key, gardens }))
      .catch((error) => {
        console.error("[ilchon] 가 본 방을 읽지 못했다", error);
        if (alive) setLoaded("error");
      });
    return () => {
      alive = false;
    };
  }, [key]);

  const gardens = loaded && loaded !== "error" && loaded.key === key ? loaded.gardens : null;
  const rows = visited.map((f) => ({ ...f, garden: gardens ? (gardens.get(f.id) ?? null) : undefined }));
  const live = rows.filter((r) => r.garden).sort((a, b) => b.garden!.dex - a.garden!.dex);
  const gone = rows.filter((r) => r.garden === null);

  return (
    <section aria-labelledby="ilchon-visited" className="garden-diary-box">
      <h2 id="ilchon-visited" className="garden-diary-title">가 본 방</h2>
      <p className="mt-0.5 text-[12.5px] leading-relaxed text-smoke">
        내가 놀러 간 방을 내 화면에서만 나란히 놓아 봐요. 모두에게 보이는 순위가 아니에요.
      </p>
      {visited.length === 0 ? (
        <p className="mt-2 text-[13px] text-smoke">아직 놀러 간 방이 없어요.</p>
      ) : loaded === "error" ? (
        <p className="mt-2 text-[13px] text-smoke">불러오지 못했어요. 잠시 뒤 다시 열어 보세요.</p>
      ) : gardens === null ? (
        <p className="mt-2 text-[13px] text-smoke">불러오는 중…</p>
      ) : (
        <>
          <ul className="mt-1">
            <CompareRow nick={`${data.nick} (나)`} garden={publicSnapshot(data)} mine />
            {live.map((r) => (
              <CompareRow key={r.id} nick={r.garden!.nick || r.nick} garden={r.garden!} onOpen={() => onVisit(r.id)} />
            ))}
          </ul>
          {gone.length > 0 && (
            <div className="mt-2 text-[12px] text-smoke">
              <p>닫힌 방 {gone.length}곳</p>
              <ul className="mt-1 flex flex-wrap gap-1">
                {gone.map((r) => (
                  <li key={r.id}>
                    <button type="button" onClick={() => useGarden.getState().forgetFriend(r.id)} className="garden-chip-btn" aria-label={`${r.nick} 목록에서 빼기`}>
                      {r.nick} ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function IlchonSettings({ data, me, say }: { data: GardenData; me: { uid: string; gid: string }; say: (text: string) => void }) {
  const il = data.ilchon;
  const set = (patch: Partial<typeof il>) => useGarden.getState().updateIlchon((x) => ({ ...x, ...patch }));
  return (
    <section aria-labelledby="ilchon-settings" className="garden-diary-box">
      <h2 id="ilchon-settings" className="garden-diary-title">1촌 설정</h2>
      <SwitchRow label="1촌 신청 받기" hint="끄면 아무도 신청을 보낼 수 없어요." on={il.accept} onChange={(accept) => set({ accept })} />
      <SwitchRow
        label="내 1촌 보이기"
        hint="켜면 내 방에 1촌의 이름이 보여요. 손님이 그 방으로 건너갈 수 있어요. 기본은 꺼짐이에요."
        on={il.show}
        onChange={(show) => set({ show })}
      />
      <p className="mt-3 text-[13.5px] font-bold">방명록 받기</p>
      <div className="mt-1.5">
        <GuestbookModePicker mode={il.guestbook} onChange={(guestbook) => set({ guestbook })} />
      </div>
      <p className="mt-3 text-[13.5px] font-bold">차단 {il.blocked.length}</p>
      {il.blocked.length === 0 ? (
        <p className="text-[12.5px] text-smoke">차단한 사람의 신청과 방명록은 내게 오지 않아요.</p>
      ) : (
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {il.blocked.map((b) => (
            <li key={b.uid}>
              <button
                type="button"
                className="garden-chip-btn"
                aria-label={`${b.n} 차단 풀기`}
                onClick={() =>
                  unblockUser(me.gid, b.uid)
                    .then(() => {
                      set({ blocked: il.blocked.filter((x) => x.uid !== b.uid) });
                      say(`${b.n}님 차단을 풀었어요`);
                    })
                    .catch((error) => {
                      console.error("[ilchon] 차단을 풀지 못했다", error);
                      say("차단을 풀지 못했어요. 잠시 뒤 다시 해 보세요");
                    })
                }
              >
                {b.n} ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
