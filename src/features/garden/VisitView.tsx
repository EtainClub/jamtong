"use client";

import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import { loadPublicGarden, waterGarden, type PublicGarden } from "@/lib/firebase/gardens";
import { countVisit, isIlchonOf, loadCounter, sendKnock, signGuestbook, writeNote, type Counter } from "@/lib/firebase/ilchon";

import { PlantArt } from "./GardenArt";
import { gardenFeedback } from "./feedback";
import { VisitorCount } from "./home/HomeParts";
import { useRoomLines } from "./ilchon/live";
import { LineComposer, TagSheet } from "./ilchon/parts";
import { RoomLineList } from "./ilchon/RoomLines";
import { canSign, KNOCK_REFUSAL_TEXT, knockRefusal, tagLabel, WATER_CUT_ILCHON } from "./ilchon/rules";
import { TitleChips } from "./parts";
import { moodOf } from "./room/catalog";
import { RoomItemSheet } from "./room/RoomItemSheet";
import { RoomScene } from "./room/RoomArt";
import { isShownId, roomFromPublic, type Placed } from "./room/rules";
import { formatLeft, kstDayNumber, TIER_LABEL, WATER_CUT, WATER_PER_DAY } from "./rules";
import { useGarden } from "./store";
import type { Species } from "./types";

/**
 * 친구 정원에 놀러 가기 — /garden?visit=<공개id> (docs/garden-game.md §3.10).
 *
 * 링크를 받은 사람이 처음 만나는 화면이다. 정원을 보여 주고, 물을 주게 하고,
 * 자기 정원으로 데려간다. 거기서 쪽지와 전광판을 거쳐 원본으로 간다.
 *
 * ★ 품종표에 있는 id만 그린다. 공개 문서는 아무 값이나 담길 수 있다.
 * ★ 방을 연 정원이면 방을 먼저 보이고, 텃밭은 그 아래 "텃밭 구경"으로 둔다(docs/garden-miniroom.md §3.2).
 *   방의 가구·전시품도 표(가구표·품종표)에 있는 것만 그린다(room/rules.ts의 roomFromPublic).
 * ★ 손님 자리(docs/garden-miniroom.md §5): 🚿 물 주기 · 📮 방명록 · 🤝 1촌 신청(1촌이면 ✏️ 1촌평).
 *   1촌평은 방 바로 아래(첫 화면), 방명록은 그 아래. 방명록의 이름을 누르면 그 사람 방으로 건너간다(마실).
 * ★ 손님 수는 이 방에서만 보인다. 누가 왔는지는 보이지 않는다.
 */
type Loaded = { garden: PublicGarden; mine: boolean; wateredToday: boolean };

/** 이번 세션에 이미 센 방(공개 id:날). 같은 방을 여러 번 열어도 트랜잭션을 다시 보내지 않는다. */
const counted = new Set<string>();

export function VisitView({
  gid,
  uid,
  byId,
  now,
  say,
  onLeave,
  onVisit,
}: {
  gid: string;
  uid: string | null;
  byId: Map<string, Species>;
  now: number;
  say: (text: string) => void;
  onLeave: () => void;
  /** 다른 방으로 건너간다(마실). */
  onVisit: (gid: string) => void;
}) {
  const [state, setState] = useState<{ gid: string; uid: string | null; loaded: Loaded | null | "error" } | null>(null);
  const [watering, setWatering] = useState(false);
  const [opened, setOpened] = useState<Placed | null>(null);
  const [counter, setCounter] = useState<{ gid: string; c: Counter } | null>(null);
  /** 내가 이 방 주인의 1촌인가. 규칙이 읽게 해 주는 내 1촌 문서로 확인한다. */
  const [friendOf, setFriendOf] = useState<{ gid: string; yes: boolean } | null>(null);
  const [sheet, setSheet] = useState<"guestbook" | "note" | "knock" | null>(null);
  const room = useGarden((s) => (s.data ? s.waterRoom(gid) : 0));
  const nick = useGarden((s) => s.data?.nick ?? "");
  const share = useGarden((s) => s.data?.share);
  const il = useGarden((s) => s.data?.ilchon);

  useEffect(() => {
    let alive = true;
    loadPublicGarden(gid, uid)
      .then(async (loaded) => {
        if (!alive) return;
        setState({ gid, uid, loaded });
        if (!loaded) return;
        track("garden_visit", { mine: loaded.mine });
        if (!loaded.mine) useGarden.getState().metFriend(gid, loaded.garden.nick);
        const yes = Boolean(uid && !loaded.mine && (await isIlchonOf(gid, uid).catch(() => false)));
        if (!alive) return;
        setFriendOf({ gid, yes });
        track("room_visit", { mine: loaded.mine, ilchon: yes });
        // 손님 수. 내 방이 아니면 오늘 한 번 센다(규칙이 하루 한 번만 받는다). 내 방이면 읽기만.
        const day = kstDayNumber(Date.now());
        const key = `${gid}:${day}`;
        try {
          const c = uid && !loaded.mine && !counted.has(key) ? await countVisit(gid, uid, day) : await loadCounter(gid, day);
          counted.add(key);
          if (alive) setCounter({ gid, c });
        } catch (error) {
          // 손님 수는 곁가지다. 못 세도 방은 보인다 — 숫자 자리만 "–"로 남는다.
          console.error("[ilchon] 손님 수를 세지 못했다", error);
        }
      })
      .catch((error) => {
        console.error("[gardens] 정원을 읽지 못했다", error);
        if (alive) setState({ gid, uid, loaded: "error" });
      });
    return () => {
      alive = false;
    };
  }, [gid, uid]);

  const current = state?.gid === gid && state.uid === uid ? state.loaded : undefined;
  const live = current && current !== "error";
  const lines = useRoomLines(gid, Boolean(live));

  const back = (
    <button
      type="button"
      onClick={onLeave}
      className="mt-4 w-full rounded-full bg-ink py-2.5 text-[13px] font-semibold text-eggshell"
    >
      🌱 내 정원으로 가기
    </button>
  );

  if (!firebaseConfigured) {
    return (
      <div className="py-10 text-center text-[13px] text-smoke">
        이 환경에서는 친구 정원에 갈 수 없어요.
        {back}
      </div>
    );
  }
  if (current === undefined) return <p className="py-16 text-center text-[13px] text-smoke">정원에 가는 중…</p>;
  if (current === "error" || current === null) {
    return (
      <div className="py-10 text-center text-[13px] text-smoke">
        {current === null ? "이 정원이 없거나 주인이 공개를 껐어요." : "정원을 불러오지 못했어요. 잠시 뒤 다시 해 보세요."}
        {back}
      </div>
    );
  }

  const { garden, mine, wateredToday } = current;
  const isFriend = friendOf?.gid === gid && friendOf.yes;
  const myGid = share?.on ? share.id : null;
  const refusal = il && share ? knockRefusal({ myGid, shareOn: share.on, target: gid, friends: il.friends, sent: il.sent }) : "closed";
  const cut = isFriend ? WATER_CUT_ILCHON : WATER_CUT;
  const beds = garden.beds.map((b) => (b && byId.has(b.s) ? { ...b, species: byId.get(b.s)! } : null));
  const theirRoom = garden.room ? roomFromPublic(garden.room, byId) : null;
  const ripe = beds.filter((b) => b && b.r <= now).length;

  const water = async () => {
    if (!uid || watering) return;
    setWatering(true);
    const result = await waterGarden(gid, uid, nick || "이웃", isFriend);
    setWatering(false);
    if (result === "ok") {
      useGarden.getState().gaveWater(gid, isFriend);
      setState((s) => (s && s.loaded && s.loaded !== "error" ? { ...s, loaded: { ...s.loaded, wateredToday: true } } : s));
      gardenFeedback("reward");
      track("garden_water");
      say(`🚿 물을 줬어요 · 내 텃밭도 ${Math.round(cut * 100)}% 빨리 자라요${isFriend ? " (1촌)" : ""}`);
    } else if (result === "already") {
      setState((s) => (s && s.loaded && s.loaded !== "error" ? { ...s, loaded: { ...s.loaded, wateredToday: true } } : s));
      say("오늘은 이미 물을 줬어요");
    } else if (result === "gone") say("주인이 정원 공개를 껐어요");
    else say("물을 주지 못했어요. 잠시 뒤 다시 해 보세요");
  };

  return (
    <div>
      <VisitorCount today={counter?.gid === gid ? counter.c.today : undefined} total={counter?.gid === gid ? counter.c.total : undefined} />
      <p className="mt-1 text-[11px] font-semibold tracking-wide text-smoke">놀러 온 정원</p>
      <h2 className="mt-0.5 text-[18px] font-bold">{garden.nick || "이름 없는"}의 정원</h2>
      <TitleChips levels={garden.titles} className="mt-1.5" />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Stat value={garden.dex} label="도감" />
        <Stat value={garden.golden} label="황금 변이" />
        <Stat value={garden.rainbow} label="무지개 변이" />
      </div>

      {theirRoom && (
        <section aria-labelledby="visit-room" className="garden-diary is-plain mt-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 id="visit-room" className="garden-diary-title">{garden.nick || "이름 없는"}의 방</h3>
            <p className="text-[12.5px] text-smoke">
              오늘의 기분 <span aria-hidden="true">{moodOf(theirRoom.mood).icon}</span> {moodOf(theirRoom.mood).label}
            </p>
          </div>
          <div className="mt-1.5">
            <RoomScene
              room={theirRoom}
              byId={byId}
              now={now}
              label={`${garden.nick || "이름 없는"}의 방`}
              isItemActive={(p) => isShownId(p.it)}
              onItem={(p) => { gardenFeedback("tap"); setOpened(p); }}
            />
          </div>
          <p className="mt-1.5 text-[12px] text-smoke">화분과 액자를 누르면 그 품종과 쪽지의 원본으로 갈 수 있어요.</p>
          {opened && <RoomItemSheet room={theirRoom} placed={opened} byId={byId} onClose={() => setOpened(null)} />}
        </section>
      )}

      {!mine && (
        <div className="garden-guest-actions mt-3" role="group" aria-label="손님 자리">
          <button type="button" className="garden-diary-btn" disabled={!uid || watering || wateredToday || room <= 0} onClick={() => void water()}>
            🚿 {wateredToday ? "물 줬어요" : "물 주기"}
          </button>
          <button
            type="button"
            className="garden-diary-btn"
            disabled={!uid || !canSign(garden.guestbook ?? "all", isFriend)}
            onClick={() => { gardenFeedback("tap"); setSheet("guestbook"); }}
          >
            📮 방명록
          </button>
          {isFriend ? (
            <button type="button" className="garden-diary-btn" disabled={!uid || !myGid} onClick={() => { gardenFeedback("tap"); setSheet("note"); }}>
              ✏️ 1촌평
            </button>
          ) : (
            <button
              type="button"
              className="garden-diary-btn"
              disabled={!uid || refusal !== null || garden.accept === false}
              onClick={() => { gardenFeedback("tap"); setSheet("knock"); }}
            >
              🤝 1촌 신청
            </button>
          )}
        </div>
      )}
      {!mine && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-smoke">
          {isFriend
            ? "1촌이에요 · 1촌평은 이 방 첫 화면에 한 줄로 걸려요."
            : garden.accept === false
              ? "이 방은 1촌 신청을 받지 않아요."
              : refusal
                ? KNOCK_REFUSAL_TEXT[refusal]
                : "1촌이 되면 서로의 방 소식을 보고, 물을 주면 15% 줄어요."}
          {garden.guestbook === "off" ? " 방명록은 받지 않아요." : garden.guestbook === "ilchon" && !isFriend ? " 방명록은 1촌만 남길 수 있어요." : ""}
        </p>
      )}

      <section aria-labelledby="visit-notes" className="garden-diary-box mt-4">
        <h3 id="visit-notes" className="garden-diary-title">1촌평</h3>
        <RoomLineList kind="notes" gid={gid} lines={lines.notes} uid={uid} owner={mine} empty="아직 1촌평이 없어요." onVisit={onVisit} onChanged={lines.reload} say={say} />
      </section>

      {garden.showIlchon && garden.ilchonList && garden.ilchonList.length > 0 && (
        <section aria-labelledby="visit-ilchon" className="garden-diary-box mt-3">
          <h3 id="visit-ilchon" className="garden-diary-title">{garden.nick || "이 방"}의 1촌</h3>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {garden.ilchonList.map((f) => (
              <li key={f.g}>
                <button type="button" className="garden-chip-btn" onClick={() => { gardenFeedback("tap"); onVisit(f.g); }}>
                  {f.n || "이웃"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="visit-guestbook" className="garden-diary-box mt-3">
        <h3 id="visit-guestbook" className="garden-diary-title">방명록</h3>
        <RoomLineList kind="guestbook" gid={gid} lines={lines.guestbook} uid={uid} owner={mine} empty="아직 방명록이 없어요. 첫 줄을 남겨 보세요." onVisit={onVisit} onChanged={lines.reload} say={say} />
      </section>

      {sheet === "guestbook" && uid && (
        <LineComposer
          title={`${garden.nick || "이 방"}의 방명록`}
          label="방명록 남기기"
          submitLabel="📮 남기기"
          onClose={() => setSheet(null)}
          onSubmit={async (line) => {
            try {
              await signGuestbook(gid, { uid, gid: myGid, nick: nick || "이웃" }, line, kstDayNumber(Date.now()));
            } catch (error) {
              if ((error as { code?: string }).code === "permission-denied") throw new Error("오늘은 이미 남겼거나, 이 방이 지금 방명록을 받지 않아요");
              throw error;
            }
            track("guestbook_post", { preset: line.p >= 0, where: "guestbook" });
            gardenFeedback("reward");
            say("📮 방명록을 남겼어요");
            setSheet(null);
            lines.reload();
          }}
        />
      )}
      {sheet === "note" && uid && myGid && (
        <LineComposer
          title={`${garden.nick || "1촌"}에게 1촌평`}
          label="1촌평 쓰기"
          submitLabel="✏️ 걸기"
          onClose={() => setSheet(null)}
          onSubmit={async (line) => {
            const tag = il?.friends.find((f) => f.g === gid)?.tag ?? 0;
            await writeNote(gid, { uid, gid: myGid, nick: nick || "이웃" }, tag, line);
            track("guestbook_post", { preset: line.p >= 0, where: "note" });
            gardenFeedback("reward");
            say("✏️ 1촌평을 걸었어요 · 다시 쓰면 바뀌어요");
            setSheet(null);
            lines.reload();
          }}
        />
      )}
      {sheet === "knock" && uid && myGid && (
        <TagSheet
          title={`${garden.nick || "이 방"}에 1촌 신청`}
          intro="내 목록에서 이 사람에게 붙일 이름표를 골라요. 상대가 수락하면 1촌이 돼요. 거절해도 알림은 가지 않아요."
          submitLabel="🤝 신청 보내기"
          onClose={() => setSheet(null)}
          onPick={async (tag) => {
            try {
              await sendKnock(gid, { uid, gid: myGid, nick: nick || "이웃" }, tag);
              useGarden.getState().updateIlchon((x) => ({ ...x, sent: [{ g: gid, n: garden.nick || "이웃", tag, at: Date.now() }, ...x.sent.filter((s) => s.g !== gid)] }));
              track("ilchon_knock");
              gardenFeedback("reward");
              say(`🤝 「${tagLabel(tag)}」로 1촌 신청을 보냈어요`);
              setSheet(null);
            } catch (error) {
              console.error("[ilchon] 1촌 신청을 보내지 못했다", error);
              say("신청을 보내지 못했어요. 이미 보냈거나, 이 방이 지금 신청을 받지 않아요");
            }
          }}
        />
      )}

      {theirRoom && <h3 className="mt-5 text-[14px] font-bold">텃밭 구경</h3>}
      <ul className="garden-beds mt-4 grid grid-cols-3 gap-2" aria-label="텃밭">
        {beds.map((b, i) => (
          <li key={i} className="garden-soil relative aspect-square overflow-hidden rounded-2xl p-1.5 text-center text-[10.5px] text-[var(--g-soil-ink)]">
            {b ? (
              <>
                <span className="block h-[70%]">
                  <PlantArt species={b.species} progress={Math.min(1, Math.max(0, (now - b.p) / Math.max(1, b.r - b.p)))} />
                </span>
                <span className="block truncate font-semibold">{b.species.title}</span>
                <span className="block opacity-80">
                  {TIER_LABEL[b.species.tier]} · {b.r <= now ? "다 익음" : formatLeft(b.r - now)}
                </span>
              </>
            ) : (
              <span className="grid h-full place-items-center opacity-60">빈 밭</span>
            )}
          </li>
        ))}
      </ul>

      {mine ? (
        <p className="mt-4 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3 text-[12.5px]">
          내 정원이에요. 이 링크를 친구에게 보내면 친구가 물을 줄 수 있어요.
        </p>
      ) : (
        <div className="mt-4 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
          <button
            type="button"
            disabled={!uid || watering || wateredToday || room <= 0}
            onClick={() => void water()}
            className="w-full rounded-full bg-[var(--g-leaf)] py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-40"
          >
            {wateredToday ? "오늘 물을 줬어요 💧" : room <= 0 ? `오늘 줄 물을 다 썼어요 (${WATER_PER_DAY}번)` : "🚿 물 주기"}
          </button>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-smoke">
            물을 주면 이 정원과 내 정원 모두, 자라는 중인 포기의 남은 시간이 {Math.round(cut * 100)}%{isFriend ? "(1촌)" : ""} 줄어요. 한
            정원에 하루 한 번, 하루 {WATER_PER_DAY}번까지.
            {ripe > 0 ? ` 지금 다 익은 밭이 ${ripe}칸 있어요.` : ""}
          </p>
        </div>
      )}
      {back}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-[var(--g-panel)] py-2.5">
      <p className="text-[18px] font-bold tabular-nums">{value.toLocaleString()}</p>
      <p className="text-[11px] text-smoke">{label}</p>
    </div>
  );
}
