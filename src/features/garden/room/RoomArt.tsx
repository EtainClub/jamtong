"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from "react";

import { RAID_KINDS } from "../rules";
import type { Species } from "../types";
import { FURNITURE_BY_ID, moodOf } from "./catalog";
import { AVATAR_NAME } from "../avatar/catalog";
import { AVATAR_H } from "../avatar/AvatarArt";
import { avatarAtOk, furnitureAt, hopsOnTap, roamNext } from "../avatar/rules";
import { activityOf } from "./activities";
import { playActivitySound } from "./activitySound";
import { isoSpecOf, isWallPos } from "./isoPlace";
import { avatarScreen, IsoRoomSvg, isoGeom, itemBox } from "./IsoRoom";
import { roomWidth, type Placed, type RoomData, type Shown } from "./rules";
import { ART_H, CELL, ROOM_COLORS as C, FurnitureArt, ShownArt, Surface, type AvatarLive } from "./RoomSvg";
export { weatherAt, type Weather } from "./RoomSvg";

/**
 * 방 그림 — 아이소 방(IsoRoom.tsx, docs/garden-miniroom-iso.md). 바탕 설계는 docs/garden-miniroom.md §3.3·§4.1.
 *
 * ★ 도트 느낌은 방 그림에만. 글자는 그림 밖 HTML로 또렷하게 둔다.
 * ★ 물건 누르기는 그림 위에 겹친 진짜 <button>이 맡는다. SVG 조각에 포커스를 주는 것보다
 *   키보드·화면 읽기 프로그램이 다루기 쉽다. 단추는 그림 상자(itemBox)와 같은 자리, 뒤의 것부터 쌓는다.
 * ★ 꾸미기(edit)에서는 단추가 끌기의 손잡이다 — 누르고 끄는 일은 RoomEditor가 한다.
 * ★ 화분 그림은 품종표의 PlantArt를 그대로 쓴다. 등급은 화분 크기, 변이는 화분 빛깔로.
 */

/** 화면 읽기용 자리 이름. */
export function posLabel(room: Pick<RoomData, "size">, p: Placed): string {
  if (isWallPos(p.pos)) return `${p.pos.wall === "L" ? "왼쪽" : "오른쪽"} 벽`;
  if (p.pos.on !== undefined) return "받침 위";
  const n = roomWidth(room.size);
  return `${p.pos.y / 2 < n / 2 ? "안쪽" : "앞쪽"} 바닥`;
}

/** 놓인 것의 이름. 화면 읽기와 시트 제목에 쓴다. */
export function itemName(it: string, room: RoomData, byId: ReadonlyMap<string, Species>): string {
  const f = FURNITURE_BY_ID.get(it);
  if (f) return f.label;
  const s = room.shown.find((x) => x.id === it);
  const title = s?.species ? byId.get(s.species)?.title : undefined;
  if (!s) return "물건";
  if (s.kind === "frame") return `쪽지 액자${title ? ` · ${title}` : ""}`;
  if (s.kind === "tree") return `나무${title ? ` · ${title}` : ""}`;
  if (s.kind === "trophy") return `박제 · ${RAID_KINDS.find((k) => k.id === s.species)?.name ?? "악초"}`;
  if (s.kind === "souvenir") return `기념품${title ? ` · ${title}` : ""}`;
  return `화분${title ? ` · ${title}` : ""}`;
}

/** 꾸미기 손잡이. RoomEditor가 끌기·키보드를 맡는다. */
export interface SceneEdit {
  selected: number | null;
  /** 놓을 수 없는 자리로 끄는 중인 물건. */
  bad: number | null;
  onItemDown: (index: number, e: PointerEvent<HTMLButtonElement>) => void;
  onItemKey: (index: number, e: KeyboardEvent<HTMLButtonElement>) => void;
  onBackground: () => void;
  /** 꼬마 끌기·키보드. 꼬마가 서 있을 때만. */
  onAvatarDown: (e: PointerEvent<HTMLButtonElement>) => void;
  onAvatarKey: (e: KeyboardEvent<HTMLButtonElement>) => void;
  /** 꼬마를 골랐다(누른 채). */
  avatarPicked: boolean;
  /** 고른 물건 바로 위(위가 좁으면 아래)에 띄우는 막대 — 돌리기·넣기. */
  toolbar?: ReactNode;
  /** 방 그림 상자 — 화면 좌표를 방 좌표로 바꿀 때. */
  stageRef: RefObject<HTMLDivElement | null>;
}

interface SceneProps {
  room: RoomData;
  byId: ReadonlyMap<string, Species>;
  now: number;
  /** 그림 전체의 이름(화면 읽기). */
  label: string;
  /** 눌리는 놓인 것. 없으면 그 물건은 그림일 뿐이다. */
  onItem?: (p: Placed, index: number) => void;
  isItemActive?: (p: Placed) => boolean;
  /** 미리 보기로 얹은 것(상점의 "방에 놓아 보기"). 흐리게 그린다. */
  ghost?: Placed | null;
  /** 꼬마를 눌렀을 때 아래에 뜨는 단추(주인: 옷 갈아입기·기분 바꾸기). 없으면 말풍선만. */
  avatarActions?: ReactNode;
  /** 꼬마를 눌렀다(계측). */
  onAvatarTap?: () => void;
  /** 꾸미기. 있으면 놓인 것이 모두 끌기 손잡이가 되고, 꼬마는 멈춘 그림이다. */
  edit?: SceneEdit;
}

const ROAM_EVERY = 5000;
const STEP_MS = 800;
/** 누름 자리의 가장 작은 변(방 그림 px). 라디오 같은 작은 물건도 누를 수 있게. */
const MIN_HIT = 28;

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** 누름 단추를 쌓는 차례 — 벽 → 깔개 → 나머지는 안쪽부터(그림의 앞뒤 순서와 거의 같다). */
function hitOrder(room: RoomData, i: number): number {
  const p = room.placed[i];
  const spec = isoSpecOf(p.it, room.shown);
  if (!spec) return -1;
  if (isWallPos(p.pos)) return 0;
  if (spec.layer === "rug") return 1;
  const odd = p.pos.dir % 2 === 1;
  return 10 + p.pos.x / 2 + p.pos.y / 2 + (odd ? spec.d + spec.w : spec.w + spec.d) / 2 + (p.pos.on !== undefined ? 0.5 : 0);
}

export function RoomScene({ room, byId, now, label, onItem, isItemActive, ghost, avatarActions, onAvatarTap, edit }: SceneProps) {
  const uid = useId().replace(/:/g, "");
  const editing = Boolean(edit);
  const av = room.avatar?.on && avatarAtOk(room.avatar.at, roomWidth(room.size)) ? room.avatar : null;
  const rest = (at: string | null): AvatarLive | null => (at ? { at, act: null, walking: false, nonce: 0 } : null);
  const [live, setLive] = useState<AvatarLive | null>(() => rest(av?.at ?? null));
  // talk = 머리 위 말풍선(4초), menu = 그림 아래 단추 줄(닫을 때까지).
  const [talk, setTalk] = useState(0);
  const [menu, setMenu] = useState(false);
  const timers = useRef<number[]>([]);
  const later = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const home = av?.at ?? null;
  const roam = Boolean(av?.roam) && !editing;
  // 자리가 바뀌거나 꾸미기를 드나들면 제자리로(렌더 중에 맞춘다 — effect에서 setState하지 않는다).
  const restKey = `${home}|${editing}`;
  const [seenKey, setSeenKey] = useState(restKey);
  if (seenKey !== restKey) {
    setSeenKey(restKey);
    setLive(rest(home));
  }
  // 돌아다니기는 가구를 피한다 — 지금 방을 ref로 읽어 방이 바뀔 때마다 걸음 시계를 다시 맞추지 않는다.
  const roomNow = useRef(room);
  useEffect(() => {
    roomNow.current = room;
  });
  useEffect(() => {
    if (!roam || !home || reducedMotion()) return;
    const step = () => {
      if (document.hidden) return;
      setLive((cur) => {
        if (!cur || cur.act) return cur;
        const next = roamNext(cur.at, roomNow.current, `${label}:${Math.floor(Date.now() / ROAM_EVERY)}`);
        if (next === cur.at) return cur;
        later(STEP_MS, () => setLive((c) => (c ? { ...c, walking: false } : c)));
        return { ...cur, at: next, walking: true };
      });
    };
    const id = window.setInterval(step, ROAM_EVERY);
    return () => window.clearInterval(id);
  }, [roam, home, label]);
  function tapAvatar() {
    if (!live) return;
    onAvatarTap?.();
    setLive({ ...live, walking: false, act: hopsOnTap(room.mood) ? "hop" : "wave", nonce: live.nonce + 1 });
    const n = Date.now();
    setTalk(n);
    setMenu(true);
    later(4000, () => setTalk((t) => (t === n ? 0 : t)));
    later(1400, () => setLive((c) => (c ? { ...c, act: null } : c)));
  }
  const [pulses, setPulses] = useState<Record<number, number>>({});
  const [reacted, setReacted] = useState<{ index: number; it: string; message: string } | null>(null);
  function activate(i: number) {
    const p = room.placed[i];
    if (!p) return;
    const action = !editing ? activityOf(p.it) : undefined;
    if (!action) { onItem?.(p, i); return; }
    setPulses((prev) => ({ ...prev, [i]: (prev[i] ?? 0) + 1 }));
    const played = action.sound ? playActivitySound(action.sound) : true;
    setReacted({ index: i, it: p.it, message: played ? action.message : `${action.message} 이 브라우저에서는 소리를 재생할 수 없어요.` });
    if (action.clips) onItem?.(p, i);
  }
  const { W, H } = isoGeom(room.size);
  const pct = (b: { x: number; y: number; w: number; h: number }) => {
    const w = Math.max(b.w, MIN_HIT);
    const h = Math.max(b.h, MIN_HIT);
    return {
      left: `${((b.x - (w - b.w) / 2) / W) * 100}%`,
      top: `${((b.y - (h - b.h) / 2) / H) * 100}%`,
      width: `${(w / W) * 100}%`,
      height: `${(h / H) * 100}%`,
    };
  };
  const hits = room.placed
    .map((p, i) => ({ p, i, box: itemBox(room, p) }))
    .filter((x): x is { p: Placed; i: number; box: NonNullable<typeof x.box> } =>
      // 꾸미기는 모두 손잡이, 보기는 눌리는 것만.
      Boolean(x.box) && (editing || (onItem !== undefined && (isItemActive ? isItemActive(x.p) : true))))
    .sort((a, b) => hitOrder(room, a.i) - hitOrder(room, b.i));
  const avatarAt = live?.at ?? home;
  const avPoint = av && avatarAt ? avatarScreen(room, avatarAt) : null;

  return (
    <div>
    <div className="garden-room-scroll">
      <div ref={edit?.stageRef} className={`garden-room ${editing ? "is-editing" : ""}`} style={{ aspectRatio: `${W} / ${H}` }}>
        <IsoRoomSvg room={room} byId={byId} now={now} label={label} uid={uid} ghost={ghost} selected={edit?.selected} bad={edit?.bad} bounds={editing} pulses={editing ? undefined : pulses} avatar={editing ? null : live} />

        {edit && <div className="garden-room-bg" onPointerDown={() => edit.onBackground()} aria-hidden="true" />}

        {hits.map(({ p, i, box }) => (
          <button
            key={`hit-${i}-${p.it}`}
            type="button"
            onClick={edit ? undefined : () => activate(i)}
            onPointerDown={edit ? (e) => edit.onItemDown(i, e) : undefined}
            onKeyDown={edit ? (e) => edit.onItemKey(i, e) : undefined}
            aria-pressed={edit ? edit.selected === i : undefined}
            aria-label={`${itemName(p.it, room, byId)} · ${posLabel(room, p)}${edit ? " · 끌어서 옮기기, 화살표로 옮기고 R로 돌리기·B로 뒤돌리기" : activityOf(p.it) ? " · 눌러서 반응 보기" : ""}`}
            className={`garden-room-item ${edit?.selected === i ? "is-picked" : ""}`}
            style={pct(box)}
          />
        ))}
        {edit?.toolbar && edit.selected !== null && room.placed[edit.selected] && (() => {
          const b = itemBox(room, room.placed[edit.selected!]);
          if (!b) return null;
          const below = b.y < 44;
          // 막대는 방 그림 폭 안에 — 물건이 왼쪽이면 왼쪽 끝에, 오른쪽이면 오른쪽 끝에 붙이고, 가운데면 물건 위 가운데.
          const cx = (b.x + b.w / 2) / W;
          const side = cx < 0.36 ? "is-left" : cx > 0.64 ? "is-right" : "";
          return (
            <div
              className={`garden-room-tools-at ${below ? "is-below" : ""} ${side}`}
              style={{ left: side ? undefined : `${cx * 100}%`, top: `${((below ? b.y + b.h : b.y) / H) * 100}%` }}
            >
              {edit.toolbar}
            </div>
          );
        })()}
        {edit && av && (() => {
          const p = avatarScreen(room, av.at);
          return (
            <button
              type="button"
              onPointerDown={(e) => edit.onAvatarDown(e)}
              onKeyDown={(e) => edit.onAvatarKey(e)}
              aria-pressed={edit.avatarPicked}
              aria-label={`${AVATAR_NAME} · 끌어서 서는 자리 옮기기, 화살표로 한 칸씩. 의자·소파는 앉고 침대는 자고 피아노·키보드는 연주해요`}
              className={`garden-room-item garden-avatar-hit ${edit.avatarPicked ? "is-picked" : ""}`}
              style={pct({ x: p.x - 16, y: p.y - AVATAR_H, w: 32, h: AVATAR_H })}
            />
          );
        })()}
        {!editing && live && avPoint && (() => {
          const mood = moodOf(room.mood);
          const top = avPoint.y - AVATAR_H;
          return (
            <>
              <button
                type="button"
                onClick={tapAvatar}
                aria-label={`${AVATAR_NAME} · 오늘의 기분 ${mood.label} · 눌러서 인사하기`}
                className="garden-room-item garden-avatar-hit"
                style={pct({ x: avPoint.x - 16, y: top, w: 32, h: AVATAR_H })}
              />
              {talk > 0 && (
                <div
                  role="status"
                  className={`garden-avatar-bubble is-${room.avatar?.look.bubble ?? "basic"}`}
                  style={{ left: `${(avPoint.x / W) * 100}%`, top: `${(top / H) * 100}%` }}
                >
                  <span aria-hidden="true">{mood.icon}</span> {mood.label}
                  {room.motto && <span className="garden-avatar-bubble-line">{room.motto}</span>}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
    {!editing && menu && live && (() => {
      const under = furnitureAt(room, live.at);
      const underActive = under !== undefined && onItem && (isItemActive ? isItemActive(room.placed[under]) : true);
      if (!avatarActions && !underActive) return null;
      return (
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--d-line)] p-2 text-[12px]">
          {avatarActions}
          {underActive && (
            <button type="button" className="garden-diary-btn" onClick={() => activate(under)}>
              {itemName(room.placed[under].it, room, byId)} 보기
            </button>
          )}
          <button type="button" className="garden-diary-btn" onClick={() => { setMenu(false); setTalk(0); }}>닫기</button>
        </div>
      );
    })()}
    {!editing && reacted && room.placed[reacted.index]?.it === reacted.it && (
      <div className="mt-2 rounded-xl border border-[var(--d-line)] p-2 text-[12px]">
        <p role="status">{reacted.message}</p>
        <div className="mt-1 flex flex-wrap gap-2">
          <button type="button" className="garden-diary-btn" onClick={() => activate(reacted.index)}>↻ 한 번 더</button>
          <button type="button" className="garden-diary-btn" onClick={() => onItem?.(room.placed[reacted.index], reacted.index)}>이야기·설명 보기</button>
        </div>
      </div>
    )}
    </div>
  );
}

/** 상점 카드·보관함에 그리는 물건 하나. */
export function FurnitureIcon({ id, size = 64 }: { id: string; size?: number }) {
  const f = FURNITURE_BY_ID.get(id);
  const uid = useId().replace(/:/g, "");
  if (!f) return null;
  if (f.kind === "wallpaper" || f.kind === "flooring") {
    return (
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className="garden-room-icon">
        <defs><Surface id={`${uid}-s`} art={f.art} /></defs>
        <rect x="2" y="2" width="36" height="36" fill={`url(#${uid}-s)`} stroke={C.ink} strokeWidth="2" shapeRendering="crispEdges" />
      </svg>
    );
  }
  const w = f.size * CELL;
  return (
    <svg viewBox={`-2 -2 ${w + 4} 50`} width={size * (f.size === 2 ? 1.6 : 1)} height={size} aria-hidden="true" className="garden-room-icon">
      <FurnitureArt art={f.art} w={w} h={ART_H} weather="day" />
    </svg>
  );
}

/** 전시품 하나(보관함 칸). */
export function ShownIcon({ shown, byId, size = 56 }: { shown: Shown; byId: ReadonlyMap<string, Species>; size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="-2 -14 44 62" width={size} height={size} aria-hidden="true" className="garden-room-icon">
      <defs>
        <linearGradient id={`${uid}-rb`} x1="0" x2="1">
          {[C.red, C.orange, C.yellow, C.green, C.skyD, C.purple].map((c, i) => <stop key={c} offset={i / 5} stopColor={c} />)}
        </linearGradient>
      </defs>
      <ShownArt shown={shown} byId={byId} w={40} h={46} rainbow={`url(#${uid}-rb)`} />
    </svg>
  );
}
