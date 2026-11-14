"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "../feedback";
import { useGarden, type GardenData } from "../store";
import type { Species } from "../types";
import { FURNITURE, FURNITURE_BY_ID } from "./catalog";
import { FurnitureIcon, itemName, RoomScene, ShownIcon, slotLabel } from "./RoomArt";
import { applySurface, hasSurface, isShownId, move, openSlots, place, placement, stow, stowedCount, type RoomData } from "./rules";

/**
 * 꾸미기 (docs/garden-miniroom.md §4.3). 손가락 기준이다.
 *
 * 1. 보관함에서 물건을 누르면 놓을 수 있는 칸이 빛난다. 칸을 누르면 놓인다. 끌지 않는다.
 * 2. 놓인 물건을 누르면 옮기기 · 넣기.
 * 3. 완료에서 저장한다.
 *
 * ★ 꾸미는 동안은 화면 안의 초안만 바꾼다. 정원 장부(store)가 그대로라 공개 문서도
 *   고쳐지지 않는다(share.ts는 장부가 바뀔 때만 올린다).
 * ★ 보관함은 화면 아래에 붙는 판이다. 모달 시트로 띄우면 위의 방을 누를 수 없다.
 */
type Chip = "shown" | "furniture" | "wall" | "floor";

const CHIPS: Array<{ id: Chip; label: string }> = [
  { id: "shown", label: "전시품" },
  { id: "furniture", label: "가구" },
  { id: "wall", label: "벽" },
  { id: "floor", label: "바닥" },
];

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
  const [chip, setChip] = useState<Chip>("shown");
  /** 놓으려고 고른 것. from이 있으면 옮기는 중. */
  const [pick, setPick] = useState<{ it: string; from?: string } | null>(null);
  /** 눌러 둔 놓인 물건의 칸(옮기기 · 넣기를 고른다). */
  const [focus, setFocus] = useState<string | null>(null);

  // 보관함 판이 화면 아래를 덮으므로, 꾸미기를 열면 방을 위쪽 바 바로 아래로 올린다.
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    top.current?.scrollIntoView({ block: "start" });
  }, []);

  const open = useMemo(() => new Set(pick ? openSlots(draft, pick.it, pick.from) : []), [draft, pick]);

  const choose = (it: string) => {
    gardenFeedback("tap");
    setFocus(null);
    if (pick?.it === it && !pick.from) {
      setPick(null);
      return;
    }
    if (openSlots(draft, it).length === 0) say("빈 칸이 없어요. 놓인 물건을 넣거나 방을 넓혀 보세요");
    setPick({ it });
  };

  const onSlot = (at: string) => {
    if (!pick) return;
    const next = pick.from ? move(draft, pick.from, at) : place(draft, pick.it, at);
    if (!next) return;
    gardenFeedback("plant");
    setDraft(next);
    setPick(null);
  };

  const onItem = (p: { at: string; it: string }) => {
    gardenFeedback("tap");
    if (pick) {
      setPick(null);
      return;
    }
    setFocus(focus === p.at ? null : p.at);
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

  const focused = focus ? draft.placed.find((p) => p.at === focus) : undefined;
  const shownLeft = draft.shown.filter((s) => stowedCount(draft, s.id) > 0);
  const furnitureLeft = FURNITURE.filter((f) => placement(f.id, draft.shown) && stowedCount(draft, f.id) > 0);
  const surfaces = FURNITURE.filter((f) => f.kind === (chip === "wall" ? "wallpaper" : "flooring") && hasSurface(draft, f.id, f.kind));

  return (
    <div ref={top} className="garden-room-editor">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-bold text-[#2f9bd8]">✏️ 꾸미는 중</p>
        <div className="flex gap-2">
          <button type="button" onClick={onDone} className="garden-diary-btn is-quiet">
            취소
          </button>
          <button type="button" onClick={finish} className="garden-diary-btn">
            완료
          </button>
        </div>
      </div>
      <p className="mt-1 text-[12.5px] text-smoke" aria-live="polite">
        {pick
          ? `${itemName(pick.it, draft, byId)} — 빛나는 칸을 눌러 ${pick.from ? "옮겨요" : "놓아요"}. 다시 누르면 그만둬요.`
          : focused
            ? `${itemName(focused.it, draft, byId)} · ${slotLabel(focused.at)}`
            : "아래 보관함에서 물건을 고르거나, 놓인 물건을 눌러요."}
      </p>

      <div className="mt-2">
        <RoomScene
          room={draft}
          byId={byId}
          now={now}
          label="꾸미는 중인 내 방"
          onSlot={onSlot}
          open={open}
          onItem={onItem}
          selected={pick?.from ?? focus}
        />
      </div>

      {focused && !pick && (
        <div className="mt-2 flex gap-2" role="group" aria-label={`${itemName(focused.it, draft, byId)} 옮기기와 넣기`}>
          <button type="button" className="garden-diary-btn" onClick={() => { setPick({ it: focused.it, from: focused.at }); setFocus(null); }}>
            옮기기
          </button>
          <button
            type="button"
            className="garden-diary-btn is-quiet"
            onClick={() => {
              setDraft(stow(draft, focused.at));
              setFocus(null);
              gardenFeedback("tap");
            }}
          >
            보관함에 넣기
          </button>
        </div>
      )}

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
        {chip === "shown" || chip === "furniture" ? (
          (chip === "shown" ? shownLeft.length : furnitureLeft.length) === 0 ? (
            <p className="mt-3 text-[12.5px] leading-relaxed text-smoke">
              {chip === "shown"
                ? "보관함에 전시품이 없어요. 바구니의 열매를 ‘전시하기’로, 도감의 쪽지를 ‘액자에 걸기’로 더해요."
                : "보관함에 가구가 없어요. 상점 ‘가구’에서 잼으로 사요."}
            </p>
          ) : (
            <ul className="garden-inventory-grid mt-3">
              {(chip === "shown" ? shownLeft.map((s) => s.id) : furnitureLeft.map((f) => f.id)).map((it) => {
                const shown = isShownId(it) ? draft.shown.find((s) => s.id === it) : undefined;
                return (
                  <li key={it}>
                    <button type="button" aria-pressed={pick?.it === it && !pick.from} onClick={() => choose(it)} className="garden-inventory-item">
                      {shown ? <ShownIcon shown={shown} byId={byId} size={48} /> : <FurnitureIcon id={it} size={44} />}
                      <span className="line-clamp-2">{itemName(it, draft, byId)}</span>
                      {!shown && <span className="text-smoke">×{stowedCount(draft, it)}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )
        ) : (
          <ul className="garden-inventory-grid mt-3">
            {surfaces.map((f) => {
              const on = chip === "wall" ? draft.wall === f.id : draft.floor === f.id;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      const next = applySurface(draft, f.id);
                      if (next) setDraft(next);
                      gardenFeedback("tap");
                    }}
                    className="garden-inventory-item"
                  >
                    <FurnitureIcon id={f.id} size={44} />
                    <span className="line-clamp-2">{FURNITURE_BY_ID.get(f.id)?.label}</span>
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
