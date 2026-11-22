"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "../feedback";
import { useGarden, type GardenData } from "../store";
import type { Species } from "../types";
import { FURNITURE, FURNITURE_BY_ID } from "./catalog";
import { holds } from "./iso";
import { footprint, isoSpecOf, isWallPos, WALL_H, type IsoPos } from "./isoPlace";
import { isoGeom } from "./IsoRoom";
import { avatarAtFor, avatarBlocked, avatarPoint } from "../avatar/rules";
import { FurnitureIcon, itemName, posLabel, RoomScene, ShownIcon, type SceneEdit } from "./RoomArt";
import { applySurface, facingDir, firstOpenSpot, hasSurface, isShownId, move, movedIndex, place, recordingCleanup, stow, stowedCount, turn, type RoomData } from "./rules";

/**
 * 꾸미기 (docs/garden-miniroom-iso.md §7). 손가락 기준이다.
 *
 * 1. 놓인 물건을 끌어서 옮긴다. 끄는 동안 놓을 수 없는 자리면 빨갛게, 놓으면 제자리로 돌아간다.
 *    작은 물건을 책상·탁자 위로 끌면 그 위에 올라간다. 받침을 옮기면 위의 것도 함께 간다.
 * 2. 눌러서 고르면 ↔ 돌리기(보는 사람을 향한 채 좌우로) · 뒤돌리기(등이 보이게) · 보관함에 넣기. 꾸미기 전체에 되돌리기.
 * 3. 보관함에서 누르면 빈자리에 놓이고 골라진다(마우스는 끌어서 원하는 자리에). 완료에서 저장한다.
 * 4. 키보드: 고른 물건에서 화살표로 반 타일씩, R로 돌리기, B로 뒤돌리기, Delete로 넣기.
 * 5. 꼬마도 끌어서 옮긴다(타일 한가운데에 선다). 의자·소파에 놓으면 앉고, 침대면 눕고, 피아노·키보드면 그 앞에서 연주한다.
 *    옷장·책장 같은 가구 안에는 서지 못한다. 꼬마 자리도 완료에서 함께 저장한다(store.ts의 saveRoom).
 *
 * ★ 꾸미는 동안은 화면 안의 초안만 바꾼다. 정원 장부(store)가 그대로라 공개 문서도
 *   고쳐지지 않는다(share.ts는 장부가 바뀔 때만 올린다).
 * ★ 보관함은 화면 아래에 붙는 판이다. 모달 시트로 띄우면 위의 방을 누를 수 없다.
 * ★ 손가락으로 보관함에서 끌지 않는다 — 보관함 판은 세로로 넘겨야 해서 끌기와 부딪친다.
 */
type Chip = "all" | "shown" | "furniture" | "wall" | "floor";

const CHIPS: Array<{ id: Chip; label: string }> = [
  { id: "all", label: "전체" },
  { id: "shown", label: "전시품" },
  { id: "furniture", label: "가구" },
  { id: "wall", label: "벽" },
  { id: "floor", label: "바닥" },
];

/** 끌기로 보는 거리(px). 이보다 덜 움직이면 누르기. */
const DRAG_PX = 6;

/** 끄는 것이 꼬마다(Drag.index). */
const AVATAR = -1;

interface Drag {
  /** 놓인 물건의 순번, 꼬마면 AVATAR. */
  index: number;
  origin: RoomData;
  /** 누른 점과 물건 바닥 자리(u·v)의 차이 — 잡은 곳을 그대로 끌고 간다. */
  du: number;
  dv: number;
  x0: number;
  y0: number;
  moved: boolean;
}

interface Preview {
  room: RoomData;
  index: number;
  bad: boolean;
}

/** 끄는 점 → 새 자리. 벽걸이(와 벽에도 거는 것이 벽 위에 있을 때)는 벽, 나머지는 바닥 — 작은 것은 받침 위로. */
function dragPos(room: RoomData, index: number, pt: { x: number; y: number }, du: number, dv: number): IsoPos | null {
  const item = room.placed[index];
  const spec = item && isoSpecOf(item.it, room.shown);
  if (!spec) return null;
  const g = isoGeom(room.size);
  const n = g.n;
  const uv = g.toUV(pt.x, pt.y);
  const toWall = spec.layer === "wall" || (spec.wallOk && (uv.u < 0 || uv.v < 0));
  if (toWall) {
    const along = Math.abs(pt.x - g.ox) / 20;
    const z = g.oy + along * 10 - pt.y;
    return {
      wall: pt.x < g.ox ? "L" : "R",
      a: Math.max(0, Math.min((n - spec.w) * 2, Math.round((along - spec.w / 2) * 2))),
      z: Math.max(0, Math.min(WALL_H - spec.h, Math.round(z - spec.h / 2))),
    };
  }
  // 끄는 자리에 맞춰 방향을 정한다 — 왼쪽 벽 쪽이면 왼쪽 벽을 등지게(rules.ts의 facingDir).
  const was = item.pos && !isWallPos(item.pos) ? item.pos.dir : 0;
  const dir = facingDir(spec, Math.round((uv.u - du) * 2), Math.round((uv.v - dv) * 2), was);
  const f = footprint(spec, { x: 0, y: 0, dir });
  let x = Math.max(0, Math.min((n - f.w) * 2, Math.round((uv.u - du) * 2)));
  let y = Math.max(0, Math.min((n - f.d) * 2, Math.round((uv.v - dv) * 2)));
  if (spec.layer === "small") {
    const cu = x / 2 + f.w / 2;
    const cv = y / 2 + f.d / 2;
    const on = room.placed.findIndex((b, j) => {
      if (j === index || isWallPos(b.pos) || b.pos.on !== undefined) return false;
      const bs = isoSpecOf(b.it, room.shown);
      if (!bs || !holds(bs, spec)) return false;
      const bf = footprint(bs, b.pos);
      return cu >= bf.u && cu <= bf.u + bf.w && cv >= bf.v && cv <= bf.v + bf.d;
    });
    if (on >= 0) {
      const b = room.placed[on];
      const bf = footprint(isoSpecOf(b.it, room.shown)!, b.pos as Exclude<IsoPos, { wall: string }>);
      x = Math.max(bf.u * 2, Math.min((bf.u + bf.w - f.w) * 2, x));
      y = Math.max(bf.v * 2, Math.min((bf.v + bf.d - f.d) * 2, y));
      return { x, y, dir, on };
    }
  }
  return { x, y, dir };
}

/** 화면 점 → 방 그림 좌표. 방 그림 밖이면 null. */
function roomPoint(stage: HTMLDivElement | null, clientX: number, clientY: number, size: number): { x: number; y: number } | null {
  const rect = stage?.getBoundingClientRect();
  if (!rect || rect.width === 0) return null;
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;
  const { W, H } = isoGeom(size);
  return { x: ((clientX - rect.left) / rect.width) * W, y: ((clientY - rect.top) / rect.height) * H };
}

/** 끌기 시작. center면 물건 한가운데를 잡는다(보관함에서 막 꺼낸 것). */
function newDrag(stage: HTMLDivElement | null, room: RoomData, index: number, clientX: number, clientY: number, center: boolean): Drag {
  const p = room.placed[index];
  const pt = roomPoint(stage, clientX, clientY, room.size);
  let du = 0;
  let dv = 0;
  if (p && !isWallPos(p.pos)) {
    const spec = isoSpecOf(p.it, room.shown);
    const f = spec ? footprint(spec, p.pos) : { u: 0, v: 0, w: 0, d: 0 };
    if (center || !pt) {
      du = f.w / 2;
      dv = f.d / 2;
    } else {
      const uv = isoGeom(room.size).toUV(pt.x, pt.y);
      du = uv.u - f.u;
      dv = uv.v - f.v;
    }
  }
  return { index, origin: room, du, dv, x0: clientX, y0: clientY, moved: center };
}

/** 키보드 한 번에 한 걸음. 고칠 것이 없는 키면 null. */
function stepPos(pos: IsoPos, key: string): IsoPos | null {
  if (isWallPos(pos)) {
    if (key === "ArrowLeft") return { ...pos, a: pos.a + (pos.wall === "L" ? 1 : -1) };
    if (key === "ArrowRight") return { ...pos, a: pos.a + (pos.wall === "L" ? -1 : 1) };
    if (key === "ArrowUp") return { ...pos, z: pos.z + 5 };
    if (key === "ArrowDown") return { ...pos, z: pos.z - 5 };
    return null;
  }
  const { on: _on, ...floor } = pos;
  void _on;
  if (key === "ArrowLeft") return { ...floor, x: pos.x - 1 };
  if (key === "ArrowRight") return { ...floor, x: pos.x + 1 };
  if (key === "ArrowUp") return { ...floor, y: pos.y - 1 };
  if (key === "ArrowDown") return { ...floor, y: pos.y + 1 };
  return null;
}

export function RoomEditor({
  data,
  byId,
  now,
  onDone,
  say,
}: {
  data: GardenData;
  byId: ReadonlyMap<string, Species>;
  now: number;
  onDone: () => void;
  say: (text: string) => void;
}) {
  const [draft, setDraft] = useState<RoomData>(data.room);
  const [hist, setHist] = useState<RoomData[]>([]);
  const [chip, setChip] = useState<Chip>("all");
  /** 고른 놓인 물건의 순번(돌리기 · 넣기). */
  const [sel, setSel] = useState<number | null>(null);
  /** 꼬마를 골랐다. */
  const [avatarSel, setAvatarSel] = useState(false);
  const [preview, setPreviewState] = useState<Preview | null>(null);
  /** 놓을 때 읽는 미리 보기 — 상태 갱신 함수 안에서 저장하지 않으려고 ref에도 둔다. */
  const previewRef = useRef<Preview | null>(null);
  const setPreview = (pv: Preview | null) => {
    previewRef.current = pv;
    setPreviewState(pv);
  };
  const drag = useRef<Drag | null>(null);
  /** 마우스로 보관함에서 끌기 시작한 것. 끌어서 놓았으면 뒤따르는 click을 무시한다. */
  const tray = useRef<{ it: string; x: number; y: number; dragged: boolean } | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);

  // 보관함 판이 화면 아래를 덮으므로, 꾸미기를 열면 방을 위쪽 바 바로 아래로 올린다.
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    top.current?.scrollIntoView({ block: "start" });
  }, []);

  const commit = (next: RoomData, select: number | null) => {
    setHist((h) => [...h.slice(-30), draft]);
    setDraft(next);
    setSel(select);
  };

  // 끌기는 창 전체에서 따라간다 — 손가락이 물건 밖으로 나가도 놓치지 않게.
  const latest = useRef({ draft, say });
  useEffect(() => {
    latest.current = { draft, say };
  });
  useEffect(() => {
    const onMove = (e: globalThis.PointerEvent) => {
      const t = tray.current;
      if (t && !drag.current && Math.hypot(e.clientX - t.x, e.clientY - t.y) > DRAG_PX * 2) {
        const room = latest.current.draft;
        if (!roomPoint(stage.current, e.clientX, e.clientY, room.size) || stowedCount(room, t.it) <= 0) return;
        const pos = firstOpenSpot(room, t.it);
        const next = pos && place(room, t.it, pos);
        if (!next) return;
        t.dragged = true;
        setHist((h) => [...h.slice(-30), room]);
        setDraft(next);
        drag.current = newDrag(stage.current, next, next.placed.length - 1, e.clientX, e.clientY, true);
      }
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < DRAG_PX) return;
      d.moved = true;
      const pt = roomPoint(stage.current, e.clientX, e.clientY, d.origin.size);
      if (!pt) return;
      if (d.index === AVATAR) {
        const av = d.origin.avatar;
        if (!av) return;
        const uv = isoGeom(d.origin.size).toUV(pt.x, pt.y);
        const room = { ...d.origin, avatar: { ...av, at: avatarAtFor(uv.u, uv.v, d.origin.size) } };
        setPreview({ room, index: AVATAR, bad: avatarBlocked(room, room.avatar.at) });
        return;
      }
      const pos = dragPos(d.origin, d.index, pt, d.du, d.dv);
      if (!pos) return;
      const next = move(d.origin, d.index, pos);
      if (next) setPreview({ room: next, index: movedIndex(d.origin, d.index, pos), bad: false });
      else setPreview({ room: { ...d.origin, placed: d.origin.placed.map((p, i) => (i === d.index ? { ...p, pos } : p)) }, index: d.index, bad: true });
    };
    const onUp = () => {
      tray.current = tray.current?.dragged ? tray.current : null;
      const d = drag.current;
      drag.current = null;
      if (!d) return;
      const pv = previewRef.current;
      setPreview(null);
      if (!d.moved || !pv) return;
      if (pv.bad) {
        latest.current.say(d.index === AVATAR ? "옷장·책장 같은 가구 안에는 설 수 없어요 · 제자리로 돌아갔어요" : "그 자리에는 놓을 수 없어요 · 제자리로 돌아갔어요");
        gardenFeedback("tap");
        return;
      }
      setHist((h) => [...h.slice(-30), d.origin]);
      setDraft(pv.room);
      setSel(pv.index === AVATAR ? null : pv.index);
      gardenFeedback("plant");
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const edit: SceneEdit = {
    selected: preview?.index ?? sel,
    bad: preview?.bad ? preview.index : null,
    stageRef: stage,
    onItemDown: (index: number, e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.focus();
      gardenFeedback("tap");
      setSel(index);
      setAvatarSel(false);
      drag.current = newDrag(stage.current, draft, index, e.clientX, e.clientY, false);
    },
    onItemKey: (index: number, e: KeyboardEvent<HTMLButtonElement>) => {
      const p = draft.placed[index];
      if (!p) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSel(sel === index ? null : index);
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        commit(stow(draft, index), null);
        return;
      }
      if (e.key === "r" || e.key === "R" || e.key === "b" || e.key === "B") {
        e.preventDefault();
        const next = turn(draft, index, e.key.toLowerCase() === "b" ? "back" : "side");
        if (next) commit(next, index);
        else say("돌리면 다른 물건과 부딪쳐요");
        return;
      }
      const pos = stepPos(p.pos, e.key);
      if (!pos) return;
      e.preventDefault();
      const next = move(draft, index, pos);
      if (next) commit(next, movedIndex(draft, index, pos));
    },
    onBackground: () => { setSel(null); setAvatarSel(false); },
    avatarPicked: avatarSel,
    onAvatarDown: (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.focus();
      gardenFeedback("tap");
      setSel(null);
      setAvatarSel(true);
      drag.current = { index: AVATAR, origin: draft, du: 0, dv: 0, x0: e.clientX, y0: e.clientY, moved: false };
    },
    onAvatarKey: (e: KeyboardEvent<HTMLButtonElement>) => {
      const av = draft.avatar;
      const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (!av || !step) return;
      e.preventDefault();
      const here = avatarPoint(av.at, draft.size);
      const at = avatarAtFor(here.u + step[0], here.v + step[1], draft.size);
      const next = { ...draft, avatar: { ...av, at } };
      if (avatarBlocked(next, at)) say("옷장·책장 같은 가구 안에는 설 수 없어요");
      else commit(next, null);
    },
  };

  const choose = (it: string) => {
    gardenFeedback("tap");
    const pos = firstOpenSpot(draft, it);
    const next = pos && place(draft, it, pos);
    if (!next) {
      say("빈자리가 없어요. 놓인 물건을 넣거나 방을 넓혀 보세요");
      return;
    }
    commit(next, next.placed.length - 1);
  };

  const finish = () => {
    if (!useGarden.getState().saveRoom(draft)) {
      say("방을 저장하지 못했어요. 다시 해 보세요");
      return;
    }
    track("room_edit", { placed: draft.placed.length });
    gardenFeedback("reward");
    say("✏️ 방을 꾸몄어요");
    onDone();
  };

  const shown = preview?.room ?? draft;
  const focused = sel !== null ? draft.placed[sel] : undefined;
  const focusedSpec = focused && isoSpecOf(focused.it, draft.shown);
  // 고른 물건 바로 위에 뜨는 막대 — 방 아래에 두었더니 보관함 판에 가려 돌리기를 찾지 못했다(2026-11-22).
  const tools = focused && sel !== null && !preview ? (
    <div className="garden-room-tools" role="group" aria-label={`${itemName(focused.it, draft, byId)} 돌리기와 넣기`}>
      {focusedSpec?.layer !== "wall" && !isWallPos(focused.pos) &&
        (["side", "back"] as const).map((how) => (
          <button
            key={how}
            type="button"
            aria-label={how === "side" ? "좌우로 돌리기" : "뒤돌리기 — 등이 보이게"}
            onClick={() => {
              const next = turn(draft, sel, how);
              if (next) { commit(next, sel); gardenFeedback("tap"); }
              else say("돌리면 다른 물건과 부딪쳐요");
            }}
          >
            {how === "side" ? "↔ 돌리기" : "↻ 뒤로"}
          </button>
        ))}
      <button type="button" onClick={() => { commit(stow(draft, sel), null); gardenFeedback("tap"); }}>넣기</button>
      <button type="button" aria-label="고르기 끝" onClick={() => setSel(null)}>✕</button>
    </div>
  ) : null;
  const shownLeft = draft.shown.filter((s) => stowedCount(draft, s.id) > 0);
  const furnitureLeft = FURNITURE.filter((f) => isoSpecOf(f.id, draft.shown) && stowedCount(draft, f.id) > 0);
  const surfaces = FURNITURE.filter((f) => (f.kind === "wallpaper" || f.kind === "flooring") && hasSurface(draft, f.id, f.kind));
  const allItems = [
    ...draft.shown.map((s) => s.id),
    ...FURNITURE.filter((f) => isoSpecOf(f.id, draft.shown) && (draft.owned[f.id] ?? 0) > 0).map((f) => f.id),
    ...surfaces.map((f) => f.id),
  ];
  const visibleItems = chip === "all" ? allItems : chip === "shown" ? shownLeft.map((s) => s.id)
    : chip === "furniture" ? furnitureLeft.map((f) => f.id)
    : surfaces.filter((f) => f.kind === (chip === "wall" ? "wallpaper" : "flooring")).map((f) => f.id);

  return (
    <div ref={top} className="garden-room-editor">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-bold text-[#2f9bd8]">✏️ 꾸미는 중</p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={hist.length === 0}
            onClick={() => {
              const prev = hist.at(-1);
              if (!prev) return;
              setHist(hist.slice(0, -1));
              setDraft(prev);
              setSel(null);
              gardenFeedback("tap");
            }}
            className="garden-diary-btn is-quiet disabled:opacity-40"
          >
            ↶ 되돌리기
          </button>
          <button type="button" onClick={onDone} className="garden-diary-btn is-quiet">
            취소
          </button>
          <button type="button" onClick={finish} className="garden-diary-btn">
            완료
          </button>
        </div>
      </div>
      <p className="mt-1 text-[12.5px] text-smoke" aria-live="polite">
        {focused
          ? `${itemName(focused.it, draft, byId)} · ${posLabel(draft, focused)} — 끌어서 옮겨요.`
          : `물건을 끌어서 옮기고, 눌러서 돌리거나 넣어요. 작은 물건은 책상·탁자 위에 올라가요. 놓인 물건 ${draft.placed.length}개.`}
      </p>
      {recordingCleanup({ ...data.room, placed: draft.placed }, true).targets.length > 0 && (
        <p className="garden-key-note mt-1.5" role="status">키보드를 보관함에 넣고 완료하면 키에 녹음한 목소리가 지워져요. 그림은 남아요.</p>
      )}

      <div className="mt-2">
        <RoomScene room={shown} byId={byId} now={now} label="꾸미는 중인 내 방" edit={{ ...edit, toolbar: tools }} />
      </div>

      {/* 보관함 판이 방을 가리지 않게 아래에 자리를 비워 둔다. */}
      <div aria-hidden="true" className="h-[46vh]" />

      <section aria-label="보관함" className="garden-inventory">
        <div className="garden-chips" role="group" aria-label="보관함 칸">
          {CHIPS.map((c) => (
            <button key={c.id} type="button" aria-pressed={chip === c.id} onClick={() => { gardenFeedback("tap"); setChip(c.id); }} className="garden-chip-btn">
              {c.label}
            </button>
          ))}
        </div>
        {chip === "all" && <p className="mt-2 text-[12px] text-smoke">가진 아이템을 모두 모았어요. 배치 중인 물건도 눌러 옮기거나 보관할 수 있어요.</p>}
        {visibleItems.length === 0 ? (
            <p className="mt-3 text-[12.5px] leading-relaxed text-smoke">
              {chip === "shown"
                ? "보관함에 전시품이 없어요. 바구니의 열매를 ‘전시하기’로, 도감의 쪽지를 ‘액자에 걸기’로 더해요."
                : chip === "furniture" ? "보관함에 가구가 없어요. 상점 ‘가구’에서 잼으로 사요."
                : "가진 아이템이 없어요. 상점에서 마음에 드는 소품을 골라 보세요."}
            </p>
          ) : (
            <ul className="garden-inventory-grid mt-3">
              {visibleItems.map((it) => {
                const shown = isShownId(it) ? draft.shown.find((s) => s.id === it) : undefined;
                const furniture = FURNITURE_BY_ID.get(it);
                const surface = furniture?.kind === "wallpaper" || furniture?.kind === "flooring";
                const applied = surface && (draft.wall === it || draft.floor === it);
                const stored = surface ? 0 : stowedCount(draft, it);
                const placed = draft.placed.flatMap((p, i) => (p.it === it ? [i] : []));
                return (
                  <li key={it}>
                    <button
                      type="button"
                      aria-pressed={surface ? applied : focused?.it === it}
                      onPointerDown={(e) => {
                        if (!surface && stored > 0 && e.pointerType !== "touch") tray.current = { it, x: e.clientX, y: e.clientY, dragged: false };
                      }}
                      onClick={() => {
                        if (tray.current?.dragged) { tray.current = null; return; }
                        tray.current = null;
                        if (surface) {
                          const next = applySurface(draft, it);
                          if (next) commit(next, null);
                          gardenFeedback("tap");
                        } else if (stored > 0) choose(it);
                        else if (placed.length > 0) {
                          setSel(sel === placed[0] ? null : placed[0]);
                          gardenFeedback("tap");
                        }
                      }}
                      className="garden-inventory-item"
                    >
                      {shown ? <ShownIcon shown={shown} byId={byId} size={48} /> : <FurnitureIcon id={it} size={44} />}
                      <span className="line-clamp-2">{itemName(it, draft, byId)}</span>
                      <span className="text-[11px] text-smoke">
                        {surface ? `${furniture.kind === "wallpaper" ? "벽지" : "바닥재"}${applied ? " · 사용 중" : ""}`
                          : chip === "all" ? `${shown ? "전시품" : "가구"} · 보관 ${stored}개${placed.length ? ` · 배치 ${placed.length}개` : ""}`
                          : !shown ? `×${stored}` : "전시품"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
        )}
        {(chip === "wall" || chip === "floor") && (
          <p className="mt-2 text-[12px] text-smoke">새 벽지·바닥재는 상점 ‘벽·바닥’에서 사요.</p>
        )}
      </section>
    </div>
  );
}
