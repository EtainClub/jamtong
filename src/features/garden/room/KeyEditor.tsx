"use client";

import { useReducer, useRef, useState, type PointerEvent } from "react";

import { track } from "@/lib/analytics";
import { deleteKeyRec } from "@/lib/firebase/roomKeys";

import { gardenFeedback } from "../feedback";
import { useGarden } from "../store";
import { KeyFace } from "./KeyArt";
import { blankFace, FACE_SIZE, PALETTE, PALETTE_NAMES, PRESETS, REC, SILENT, soundLabel } from "./keyboard";
import { faceHistoryReducer, initialFaceHistory } from "./faceHistory";
import { playPreset } from "./keyboardSound";
import { KeyRecord } from "./KeyRecord";

/**
 * 키 하나 고치기 — 그림판과 소리 고르기(docs/garden-miniroom.md §4.5).
 *
 * ★ 그림판은 손가락으로 누르고 끌어 칠한다. 판 위에서는 화면이 밀리지 않는다(touch-action: none).
 *   되돌리기는 편집을 연 뒤의 획·모두 지우기를 차례로 되짚는다. 거울을 켜면 좌우가 같이 칠해진다.
 * ★ 저장해야 방의 키가 바뀐다. 녹음만은 올리는 순간 키에 붙는다(파일이 생겼으므로 가리키는 곳이 있어야 한다).
 * ★ 녹음을 틀던 키를 다른 소리로 바꾸면, 그 녹음 파일을 먼저 지우고 나서 바꾼다. 못 지우면 바꾸지 않는다.
 */
export function KeyEditor({
  slot,
  uid,
  shareOn,
  say,
  onDone,
}: {
  slot: number;
  uid: string | null;
  shareOn: boolean;
  say: (text: string) => void;
  onDone: () => void;
}) {
  const stored = useGarden((s) => s.data?.room.keys[slot]);
  const [{ face, history }, dispatchFace] = useReducer(faceHistoryReducer, stored?.face ?? blankFace(), initialFaceHistory);
  const [sound, setSound] = useState(() => stored?.sound ?? SILENT);
  const [color, setColor] = useState(1);
  const [mirror, setMirror] = useState(false);
  const [tab, setTab] = useState<"face" | "sound">("face");
  const [recOpen, setRecOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);

  if (!stored) return null;
  const hasRec = stored.sound === REC && stored.ver > 0;

  const cellAt = (e: PointerEvent<HTMLDivElement>): number => {
    const r = grid.current?.getBoundingClientRect();
    if (!r) return -1;
    const x = Math.floor(((e.clientX - r.left) / r.width) * FACE_SIZE);
    const y = Math.floor(((e.clientY - r.top) / r.height) * FACE_SIZE);
    return x < 0 || y < 0 || x >= FACE_SIZE || y >= FACE_SIZE ? -1 : y * FACE_SIZE + x;
  };
  const paintAt = (i: number) => {
    if (i >= 0) dispatchFace({ type: "paint", cell: i, color, mirror });
  };
  const endStroke = () => {
    drawing.current = false;
    dispatchFace({ type: "end" });
  };

  const save = async () => {
    setSaving(true);
    try {
      // 녹음을 버리는 저장: 파일을 먼저 지운다. 못 지우면 저장하지 않는다 — 가리키는 곳 없는 파일을 남기지 않게.
      if (hasRec && sound !== REC) {
        if (!uid) return say("잠시 뒤 다시 해 보세요");
        await deleteKeyRec(uid, slot, stored.ver);
      }
      const now = useGarden.getState().data?.room.keys[slot] ?? stored;
      useGarden.getState().setKey(slot, { ...now, face, sound: sound === REC && !(now.sound === REC && now.ver > 0) ? now.sound : sound });
      const what = face !== stored.face && sound !== stored.sound ? "both" : face !== stored.face ? "face" : sound !== stored.sound ? "sound" : "none";
      if (what !== "none") track("key_edit", { what });
      gardenFeedback("reward");
      say(`⌨️ ${slot + 1}번 키를 저장했어요`);
      onDone();
    } catch (error) {
      console.error("[keyboard] 키를 저장하지 못했다", error);
      say("녹음을 지우지 못해 저장하지 않았어요. 잠시 뒤 다시 해 보세요");
    } finally {
      setSaving(false);
    }
  };

  const current = soundLabel({ sound });

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <span className="garden-keycap is-preview" aria-hidden="true">
          <KeyFace face={face} className="garden-keycap-face" />
        </span>
        <div className="min-w-0 flex-1 text-[12.5px]">
          <p className="font-bold">
            {slot + 1}번 키 · <span aria-hidden="true">{current.icon}</span> {current.label}
          </p>
          <p className="text-smoke">그림을 그리고 소리를 골라 저장해요.</p>
        </div>
      </div>

      <div role="group" aria-label="고칠 것" className="garden-chips mt-3">
        <button type="button" className="garden-chip-btn" aria-pressed={tab === "face"} onClick={() => setTab("face")}>
          🎨 그림
        </button>
        <button type="button" className="garden-chip-btn" aria-pressed={tab === "sound"} onClick={() => setTab("sound")}>
          🔊 소리
        </button>
      </div>

      {tab === "face" ? (
        <div className="mt-3">
          <div
            ref={grid}
            className="garden-pixel-grid"
            role="img"
            aria-label="그림판 — 손가락으로 누르거나 끌어서 칠해요"
            onPointerDown={(e) => {
              e.preventDefault();
              if (drawing.current || !e.isPrimary || e.button !== 0) return;
              try {
                grid.current?.setPointerCapture(e.pointerId);
              } catch {
                // 잡지 못해도 판 안에서는 칠해진다.
              }
              drawing.current = true;
              dispatchFace({ type: "begin" });
              paintAt(cellAt(e));
            }}
            onPointerMove={(e) => drawing.current && paintAt(cellAt(e))}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onLostPointerCapture={endStroke}
          >
            <KeyFace face={face} className="garden-pixel-art" />
          </div>
          <div className="garden-palette mt-3" role="radiogroup" aria-label="색">
            {PALETTE.map((c, i) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={color === i}
                aria-label={PALETTE_NAMES[i]}
                className={`garden-swatch ${i === 0 ? "is-eraser" : ""}`}
                style={i === 0 ? undefined : { background: c }}
                onClick={() => setColor(i)}
              >
                {i === 0 ? "⌫" : ""}
              </button>
            ))}
          </div>
          <div className="garden-pixel-actions mt-2 flex flex-wrap gap-2">
            <button type="button" className="garden-chip-btn" aria-pressed={mirror} onClick={() => setMirror((m) => !m)}>
              🪞 거울
            </button>
            <button
              type="button"
              className="garden-chip-btn"
              disabled={history.length === 0}
              onClick={() => dispatchFace({ type: "undo" })}
            >
              ↩ 되돌리기
            </button>
            <button
              type="button"
              className="garden-chip-btn"
              onClick={() => dispatchFace({ type: "clear" })}
            >
              🧹 모두 지우기
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="garden-sound-grid" role="radiogroup" aria-label="소리">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={sound === p.id}
                className="garden-sound-btn"
                onClick={() => {
                  setSound(p.id);
                  playPreset(p.id, false);
                }}
              >
                <span aria-hidden="true" className="text-[18px] leading-none">{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
            <button type="button" role="radio" aria-checked={sound === SILENT} className="garden-sound-btn" onClick={() => setSound(SILENT)}>
              <span aria-hidden="true" className="text-[18px] leading-none">🔇</span>
              <span>소리 없음</span>
            </button>
            {hasRec && (
              <button type="button" role="radio" aria-checked={sound === REC} className="garden-sound-btn" onClick={() => setSound(REC)}>
                <span aria-hidden="true" className="text-[18px] leading-none">🎙</span>
                <span>내 목소리</span>
              </button>
            )}
          </div>
          {hasRec && sound !== REC && (
            <p className="mt-2 text-[12px] text-smoke">저장하면 이 키에 올린 녹음이 지워져요.</p>
          )}
          <button
            type="button"
            className="garden-diary-btn is-quiet mt-3 min-h-[44px] w-full"
            aria-expanded={recOpen}
            onClick={() => {
              gardenFeedback("tap");
              setRecOpen((o) => !o);
            }}
          >
            🎙 {hasRec ? "목소리 다시 녹음하기" : "내 목소리 녹음하기"}
          </button>
          {recOpen && <KeyRecord slot={slot} uid={uid} shareOn={shareOn} say={say} onUploaded={() => { setSound(REC); setRecOpen(false); }} />}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button type="button" className="garden-diary-btn min-h-[44px] flex-1" disabled={saving} onClick={() => void save()}>
          저장
        </button>
        <button type="button" className="garden-diary-btn is-quiet min-h-[44px]" onClick={onDone}>
          닫기
        </button>
      </div>
    </div>
  );
}
