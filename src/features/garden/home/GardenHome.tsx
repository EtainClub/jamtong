"use client";

import { useEffect, useState, type ReactNode } from "react";

import type { LineDoc } from "@/lib/firebase/ilchon";

import { Dex } from "../Dex";
import { gardenFeedback, gardenTrack, setGardenTrack } from "../feedback";
import { SEGMENTS, type NewsItem, type Place, type Segment } from "../nav";
import { TitleChips } from "../parts";
import { FURNITURE_BY_ID, moodOf, type Shortcut } from "../room/catalog";
import { KeyboardSheet } from "../room/KeyboardSheet";
import { RoomEditor } from "../room/RoomEditor";
import { RoomItemSheet } from "../room/RoomItemSheet";
import { RoomScene } from "../room/RoomArt";
import { isShownId, type Placed } from "../room/rules";
import type { TitleId } from "../rules";
import { useGarden, type GardenData } from "../store";
import type { Species } from "../types";
import { Guestbook, IlchonNotes, MoodSheet, MottoSheet, MusicSheet, NewsPanel, VisitorCount } from "./HomeParts";
import { GuestbookModePicker, OpenRoomPrompt } from "../ilchon/parts";
import { RoomLineList } from "../ilchon/RoomLines";

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
}) {
  const [editing, setEditing] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [mottoOpen, setMottoOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
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

  const shortcut = (s: Shortcut) => {
    gardenFeedback("tap");
    if (s === "dex") onSeg("dex");
    else if (s === "guestbook") onSeg("guestbook");
    else if (s === "keyboard") setKeyboardOpen(true);
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
      ) : seg === "guestbook" ? (
        <div className="mt-4">
          {!data.share.on && <OpenRoomPrompt say={say} />}
          <Guestbook>{guestbookFull}</Guestbook>
        </div>
      ) : editing ? (
        <div className="mt-4">
          <RoomEditor data={data} byId={byId} now={now} onDone={() => setEditing(false)} say={say} />
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
                isItemActive={(p) => isShownId(p.it) || Boolean(FURNITURE_BY_ID.get(p.it)?.shortcut)}
                onItem={(p) => {
                  const s = FURNITURE_BY_ID.get(p.it)?.shortcut;
                  if (s) shortcut(s);
                  else {
                    gardenFeedback("tap");
                    setOpened(p);
                  }
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <button type="button" onClick={() => { gardenFeedback("tap"); setMoodOpen(true); }} className="garden-mood-now" aria-label={`오늘의 기분 ${mood.label} · 바꾸기`}>
                <span className="text-smoke">오늘의 기분</span>
                <span aria-hidden="true">{mood.icon}</span>
                <b>{mood.label}</b>
              </button>
              <button type="button" onClick={() => { gardenFeedback("tap"); setEditing(true); }} className="garden-diary-btn">
                ✏️ 꾸미기
              </button>
            </div>
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

      {mottoOpen && <MottoSheet current={data.room.motto} onClose={() => setMottoOpen(false)} say={say} />}
      {musicOpen && (
        <MusicSheet
          current={data.room.bgm}
          sound={sound}
          onToggle={onSound}
          onPick={(id) => {
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
      {opened && <RoomItemSheet room={data.room} placed={opened} byId={byId} onClose={() => setOpened(null)} />}
      {keyboardOpen && (
        <KeyboardSheet keys={data.room.keys} owner ownerUid={uid} gid={gid} uid={uid} nick={data.nick} say={say} onClose={() => setKeyboardOpen(false)} />
      )}
    </div>
  );
}
