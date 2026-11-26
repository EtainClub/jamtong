"use client";

import { useEffect, useState, type ReactNode } from "react";
import { loadGachaVisits } from "@/lib/firebase/slot";
import { GACHA_ID } from "../slot/rules";
import { kstDayNumber } from "../rules";

import type { LineDoc } from "@/lib/firebase/ilchon";

import { Dex } from "../Dex";
import { RoomSlot } from "../slot/RoomSlot";
import { AlbumView } from "../album/AlbumView";
import { requestSnap } from "../album/ClipLink";
import type { SnapClip } from "../album/snap";
import { MemorialView } from "../memorial/MemorialView";
import { gardenFeedback, gardenTrack, setGardenTrack } from "../feedback";
import { canUseTrack } from "../musicTracks";
import { SEGMENTS, type NewsItem, type Place, type Segment } from "../nav";
import { TitleChips } from "../parts";
import { FURNITURE_BY_ID, moodOf, type Shortcut } from "../room/catalog";
import { KeyboardSheet } from "../room/KeyboardSheet";
import { RoomEditor } from "../room/RoomEditor";
import { RoomItemSheet } from "../room/RoomItemSheet";
import { activityOf } from "../room/activities";
import { itemName, RoomScene } from "../room/RoomArt";
import { keyboardKeys, isShownId, SOUVENIR_CASE, type Placed } from "../room/rules";
import { josa, type TitleId } from "../rules";
import { useGarden, type GardenData } from "../store";
import type { Species } from "../types";
import { Guestbook, IlchonNotes, MoodSheet, MottoSheet, MusicSheet, NewsPanel, VisitorCount } from "./HomeParts";
import { GuestbookModePicker, OpenRoomPrompt } from "../ilchon/parts";
import { RoomLineList } from "../ilchon/RoomLines";
import { track as trackEvent } from "@/lib/analytics";
import { AVATAR_NAME } from "../avatar/catalog";
import { Wardrobe } from "../avatar/Wardrobe";

/**
 * 정원 홈 — 다이어리 속지 한 장 (docs/garden-miniroom.md §3.2·§3.3).
 *
 * 맨 위 가로 띠(정원 이름·칭호·기분·손님 수), 새 소식, 내 방, 1촌평·방명록 자리.
 * 오른쪽 위의 책갈피로 방 · 도감 · 방명록을 오간다. 주 이동은 하단 탭이다.
 */
export function GardenHome({
  data,
  catalog,
  byId,
  now,
  seg,
  news,
  levels,
  sound,
  onSound,
  onSeg,
  onGo,
  say,
  coach,
  tip,
  visitors,
  uid,
  lines,
  onVisit,
  clip,
  onClipDone,
}: {
  data: GardenData;
  catalog: Species[];
  byId: Map<string, Species>;
  now: number;
  seg: Segment;
  news: NewsItem[];
  levels?: Record<TitleId, number>;
  sound: boolean;
  onSound: () => void;
  onSeg: (seg: Segment) => void;
  onGo: (place: Place) => void;
  say: (text: string) => void;
  /** 첫 한 바퀴 카드(GardenCoach). 새 소식 위에 놓인다. */
  coach?: ReactNode;
  /** 첫 방문 팁(TabTip). */
  tip?: ReactNode;
  /** 손님 수(gardens/{gid}/meta/counter). 방을 열지 않았으면 없다. */
  visitors?: { today?: number; total?: number };
  uid: string | null;
  /** 내 방의 1촌평·방명록(ilchon/live.ts의 useRoomLines). 방을 열지 않았으면 null. */
  lines: { notes: LineDoc[] | null; guestbook: LineDoc[] | null; reload: () => void } | null;
  /** 방명록의 이름을 누르면 그 사람 방으로(마실). */
  onVisit: (gid: string) => void;
  /** 사이트 페이지의 "사진첩에 담기"로 왔다(앵커, album/rules.ts). 사진첩 칸이 담기 시트를 연다. */
  clip?: string | SnapClip | null;
  onClipDone?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  /** 꾸미기를 막 마쳤다 — 「📸 꾸민 방 찍기」를 한 번 권한다. */
  const [justDecorated, setJustDecorated] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [mottoOpen, setMottoOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState<number | null>(null);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [slotOpen, setSlotOpen] = useState(false);
  // 뽑기 기계(docs/garden-slots.md) — 방을 열 때 오늘 돌려 보고 간 손님을 읽어 주인 몫 잼을 받는다(손님 한 명 10, 하루 50).
  const hasGacha = data.room.placed.some((p) => p.it === GACHA_ID);
  const hostGid = data.share.on ? data.share.id : null;
  useEffect(() => {
    const gid = hostGid;
    if (!hasGacha || !gid || !uid) return;
    let alive = true;
    loadGachaVisits(gid, kstDayNumber(Date.now()))
      .then((list) => {
        if (!alive) return;
        const got = useGarden.getState().claimGachaHost(list.filter((v) => v.uid !== uid).map((v) => v.uid));
        if (!got) return;
        const names = list.slice(0, 2).map((v) => v.nick).join(", ");
        say(`🎰 ${names}${got.count > 2 ? ` 외 ${got.count - 2}명` : ""}님이 뽑기 기계를 돌려 보고 갔어요${got.jam ? ` · 잼 +${got.jam}` : ""}`);
      })
      .catch((e) => console.error("[gacha] 손님 표식을 읽지 못했다", e));
    return () => {
      alive = false;
    };
  }, [hasGacha, hostGid, uid, say]);
  const track = gardenTrack(data.room.bgm);
  const [opened, setOpened] = useState<Placed | null>(null);
  const mood = moodOf(data.room.mood);
  const gid = data.share.on ? data.share.id : null;

  // 방명록 칸을 열면 본 것으로 적는다(새 소식의 "새 방명록" 수).
  const newest = lines?.guestbook?.[0]?.at ?? 0;
  useEffect(() => {
    if (seg !== "guestbook" || newest <= data.ilchon.seenGb) return;
    useGarden.getState().updateIlchon((il) => ({ ...il, seenGb: newest }));
  }, [seg, newest, data.ilchon.seenGb]);

  const notes = gid && lines ? (
    <RoomLineList kind="notes" gid={gid} lines={lines.notes} uid={uid} owner empty="1촌이 남긴 한 줄이 여기에 걸려요." onVisit={onVisit} onChanged={lines.reload} say={say} />
  ) : undefined;
  const guestbookFull = gid && lines ? (
    <>
      <RoomLineList kind="guestbook" gid={gid} lines={lines.guestbook} uid={uid} owner empty="아직 방명록이 없어요. 손님이 문구와 스티커를 남기는 자리예요." onVisit={onVisit} onChanged={lines.reload} say={say} />
      <p className="mt-3 text-[13px] font-bold">방명록 받기</p>
      <div className="mt-1.5">
        <GuestbookModePicker mode={data.ilchon.guestbook} onChange={(guestbook) => useGarden.getState().updateIlchon((il) => ({ ...il, guestbook }))} />
      </div>
    </>
  ) : undefined;
  const guestbookPeek = gid && lines ? (
    <>
      <RoomLineList kind="guestbook" gid={gid} lines={lines.guestbook} uid={uid} owner max={3} empty="아직 방명록이 없어요." onVisit={onVisit} onChanged={lines.reload} say={say} />
      {(lines.guestbook?.length ?? 0) > 3 && (
        <button type="button" className="garden-news-go mt-1 min-h-[44px]" onClick={() => { gardenFeedback("tap"); onSeg("guestbook"); }}>
          방명록 {lines.guestbook!.length} ▸
        </button>
      )}
    </>
  ) : undefined;

  const shortcut = (s: Shortcut, keyboard = 0) => {
    gardenFeedback("tap");
    if (s === "dex") onSeg("dex");
    else if (s === "guestbook") onSeg("guestbook");
    else if (s === "keyboard") setKeyboardOpen(keyboard);
    else onSound();
  };

  return (
    <div className="garden-diary">
      <div role="group" aria-label="홈 책갈피" className="garden-bookmarks">
        {SEGMENTS.room.map((s) => (
          <button key={s.id} type="button" aria-pressed={seg === s.id} onClick={() => { gardenFeedback("tap"); setEditing(false); onSeg(s.id); }}>
            {s.label}
          </button>
        ))}
      </div>

      <header className="garden-diary-head">
        <VisitorCount today={visitors?.today} total={visitors?.total} />
        <h1 className="garden-diary-name">{data.nick}의 방</h1>
        <TitleChips levels={levels} className="mt-1" />
        <button type="button" className="garden-music-band" aria-haspopup="dialog" onClick={() => { gardenFeedback("tap"); setMusicOpen(true); }}>
          <span aria-hidden="true">♪ {track.icon}</span>
          <span className="min-w-0 flex-1 truncate">{track.label} · {sound ? "듣는 중" : "꺼짐"}</span>
          <span className="shrink-0 text-smoke">곡 고르기 ▸</span>
        </button>
      </header>

      {seg === "dex" ? (
        <div className="mt-4">
          {tip}
          <Dex data={data} catalog={catalog} now={now} say={say} />
        </div>
      ) : seg === "album" ? (
        <AlbumView data={data} ownerNick={data.nick} byId={byId} uid={uid} clip={clip} onClipDone={onClipDone} onVisit={onVisit} say={say} />
      ) : seg === "memorial" ? (
        <MemorialView data={data} byId={byId} say={say} />
      ) : seg === "guestbook" ? (
        <div className="mt-4">
          {!data.share.on && <OpenRoomPrompt say={say} />}
          <Guestbook>{guestbookFull}</Guestbook>
        </div>
      ) : editing ? (
        <div className="mt-4">
          <RoomEditor data={data} byId={byId} now={now} onDone={() => { setEditing(false); setJustDecorated(true); }} say={say} />
        </div>
      ) : (
        <>
          <section aria-labelledby="garden-my-room" className="mt-3">
            <div className="garden-room-head">
              <h2 id="garden-my-room" className="garden-diary-title shrink-0">내 방</h2>
              <button
                type="button"
                className={`garden-motto${data.room.motto ? "" : " is-empty"}`}
                aria-haspopup="dialog"
                aria-label={data.room.motto ? `방 한마디: ${data.room.motto} · 고치기` : "방 한마디 쓰기"}
                onClick={() => { gardenFeedback("tap"); setMottoOpen(true); }}
              >
                {data.room.motto ? <q>{data.room.motto}</q> : "✏️ 내 방 한마디를 적어 보세요"}
              </button>
            </div>
            <div className="mt-1.5">
              <RoomScene
                room={data.room}
                byId={byId}
                now={now}
                label={`${data.nick}의 방`}
                onAvatarTap={() => trackEvent("avatar_tap", { mine: true })}
                avatarActions={
                  <>
                    <button type="button" className="garden-diary-btn" onClick={() => { gardenFeedback("tap"); setWardrobeOpen(true); }}>👕 옷 갈아입기</button>
                    <button type="button" className="garden-diary-btn is-quiet" onClick={() => { gardenFeedback("tap"); setMoodOpen(true); }}>😊 기분 바꾸기</button>
                  </>
                }
                isItemActive={(p) => isShownId(p.it) || p.it === "piano" || p.it === SOUVENIR_CASE || p.it === GACHA_ID || Boolean(activityOf(p.it) || FURNITURE_BY_ID.get(p.it)?.shortcut || FURNITURE_BY_ID.get(p.it)?.story || FURNITURE_BY_ID.get(p.it)?.reading)}
                onItem={(p) => {
                  const s = FURNITURE_BY_ID.get(p.it)?.shortcut;
                  if (s) shortcut(s, p.kb ?? 0);
                  else {
                    gardenFeedback("tap");
                    setOpened(p);
                  }
                }}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <button type="button" onClick={() => { gardenFeedback("tap"); setMoodOpen(true); }} className="garden-mood-now" aria-label={`오늘의 기분 ${mood.label} · 바꾸기`}>
                <span className="text-smoke">오늘의 기분</span>
                <span aria-hidden="true">{mood.icon}</span>
                <b>{mood.label}</b>
              </button>
              <span className="flex shrink-0 gap-1.5">
                <button type="button" onClick={() => { gardenFeedback("tap"); setWardrobeOpen(true); }} className="garden-diary-btn is-quiet" aria-label={`${AVATAR_NAME} 옷 갈아입기`}>
                  👕 {AVATAR_NAME}
                </button>
                <button type="button" onClick={() => { gardenFeedback("tap"); setSlotOpen(true); }} className="garden-diary-btn is-quiet" aria-label="방 꾸미기 슬롯머신">
                  🎰
                </button>
                <button type="button" onClick={() => { gardenFeedback("tap"); requestSnap("room"); }} className="garden-diary-btn is-quiet" aria-label="지금 내 방을 찍어 사진첩에 남기기">
                  📸 찍기
                </button>
                <button type="button" onClick={() => { gardenFeedback("tap"); setJustDecorated(false); setEditing(true); }} className="garden-diary-btn">
                  ✏️ 꾸미기
                </button>
              </span>
            </div>
            {justDecorated && (
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-[var(--g-leaf)] bg-white px-3 py-2 text-[12.5px]">
                <span className="min-w-0 flex-1">✨ 새로 꾸민 방을 사진으로 남겨 둘까요? 나중에 바꿔도 오늘의 방이 사진첩에 그대로 남아요.</span>
                <button type="button" className="garden-diary-btn shrink-0" onClick={() => { gardenFeedback("tap"); setJustDecorated(false); requestSnap("room"); }}>
                  📸 찍기
                </button>
                <button type="button" className="shrink-0 px-1 text-smoke" aria-label="닫기" onClick={() => setJustDecorated(false)}>
                  ✕
                </button>
              </div>
            )}
            {data.room.isoMoved !== undefined && (
              <div className="mt-2 rounded-xl border border-dashed border-[var(--g-leaf)] bg-white px-3 py-2 text-[12.5px] leading-relaxed">
                🏠 방이 입체로 바뀌었어요. 물건을 그대로 옮겨 놓았어요
                {data.room.isoMoved > 0 ? ` — 자리가 모자란 ${data.room.isoMoved}개는 보관함에 넣었어요` : ""}. 이제 꾸미기에서 물건을 끌어 옮기고,
                책상·탁자 위에 소품을 올릴 수 있어요.{" "}
                <button type="button" className="min-h-[36px] font-semibold underline underline-offset-2" onClick={() => useGarden.getState().clearIsoMoved()}>
                  알겠어요
                </button>
              </div>
            )}
            {data.room.caseMoved && (
              <div className="mt-2 rounded-xl border border-dashed border-[var(--g-leaf)] bg-white px-3 py-2 text-[12.5px] leading-relaxed">
                🏛️ 기념품 진열장을 방에 놓았어요. 자리가 모자라서 「{itemName(data.room.caseMoved, data.room, byId)}」{josa(itemName(data.room.caseMoved, data.room, byId), "을를").slice(itemName(data.room.caseMoved, data.room, byId).length)} 보관함에 넣었어요 — 꾸미기에서 다시 놓을 수
                있어요.{" "}
                <button type="button" className="min-h-[36px] font-semibold underline underline-offset-2" onClick={() => useGarden.getState().clearCaseMoved()}>
                  알겠어요
                </button>
              </div>
            )}
            {data.room.placed.length === 0 && (
              <p className="mt-2 text-[12.5px] leading-relaxed text-smoke">
                아직 빈 방이에요. 바구니의 열매를 ‘전시하기’로 방에 놓고, 가구는 상점 ‘가구’에서 사요.
              </p>
            )}
          </section>
          {/* 새 소식은 방 아래. 방이 이 화면의 얼굴이다(2026-11-14). 코치 카드와 팁은 그 아래. */}
          <div className="mt-4">
            <NewsPanel news={news} onGo={onGo} />
          </div>
          {!data.share.on && <div className="mt-4"><OpenRoomPrompt say={say} /></div>}
          {coach}
          {tip && <div className="mt-4">{tip}</div>}


          <div className="mt-4 space-y-3">
            <IlchonNotes>{notes}</IlchonNotes>
            <Guestbook>{guestbookPeek}</Guestbook>
          </div>
        </>
      )}

      {slotOpen && <RoomSlot now={now} onClose={() => setSlotOpen(false)} say={say} />}
      {wardrobeOpen && data.room.avatar && <Wardrobe data={data} levels={levels} onClose={() => setWardrobeOpen(false)} say={say} />}
      {mottoOpen && <MottoSheet current={data.room.motto} onClose={() => setMottoOpen(false)} say={say} />}
      {musicOpen && (
        <MusicSheet
          current={data.room.bgm}
          owned={data.room.music}
          onShop={() => { setMusicOpen(false); onGo("shop"); }}
          sound={sound}
          onToggle={onSound}
          onPick={(id) => {
            if (!canUseTrack(id, data.room.music)) return;
            useGarden.getState().setBgm(id);
            setGardenTrack(id);
            // 고르는 손길이 곧 "듣고 싶다"다. 꺼져 있으면 켠다(사용자 터치 안이라 소리가 열린다).
            if (!sound) onSound();
            else gardenFeedback("tap");
          }}
          onClose={() => setMusicOpen(false)}
        />
      )}
      {moodOpen && (
        <MoodSheet
          current={data.room.mood}
          onClose={() => setMoodOpen(false)}
          onPick={(id) => {
            useGarden.getState().setMood(id);
            gardenFeedback("tap");
            setMoodOpen(false);
          }}
        />
      )}
      {opened && <RoomItemSheet room={data.room} placed={opened} byId={byId} reader={{ mode: "owner", ownerNick: data.nick, gid, uid }} say={say} onPianoSave={(song) => useGarden.getState().savePianoSong(opened.kb ?? 0, song)} onPianoNotes={(notes) => useGarden.getState().setPianoNotes(opened.kb ?? 0, notes)} onClose={() => setOpened(null)} />}
      {keyboardOpen !== null && (
        <KeyboardSheet keyboard={keyboardOpen} keys={keyboardKeys(data.room, keyboardOpen)} owner ownerUid={uid} gid={gid} uid={uid} nick={data.nick} say={say} onClose={() => setKeyboardOpen(null)} />
      )}
    </div>
  );
}
