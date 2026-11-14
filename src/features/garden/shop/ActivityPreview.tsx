"use client";

import { useState } from "react";
import { activityOf } from "../room/activities";
import { playActivitySound } from "../room/activitySound";
import { FurnitureIcon } from "../room/RoomArt";
import { RoomVoicePlayer } from "../room/RoomVoicePlayer";

/** 구매·소유·방의 빈칸과 무관한 체험. 방 배치와 같은 그림·소리·음성 플레이어를 쓴다. */
export function ActivityPreview({ id, label }: { id: string; label: string }) {
  const [take, setTake] = useState(0);
  const [message, setMessage] = useState("");
  const action = activityOf(id);
  if (!action) return null;
  const play = () => {
    setTake((n) => n+1);
    const played = action.sound ? playActivitySound(action.sound) : true;
    setMessage(played ? action.message : "이 브라우저에서는 소리를 재생할 수 없어요. 움직임을 체험해 보세요.");
  };
  return (
    <section aria-label={`${label} 구매 전 체험`} className="w-full p-3">
      <button type="button" onClick={play} className="flex min-h-[140px] w-full flex-col items-center justify-center gap-3 rounded-xl" aria-label={`${label} 무료 체험하기`}>
        <span key={take} aria-hidden="true" className={take ? `block garden-room-react garden-room-react-${action.motion}` : "block"}>
          <FurnitureIcon id={id} size={96} />
        </span>
        <span className="garden-diary-btn">{take ? "↻ 한 번 더 체험하기" : "▶ 구매 전에 체험하기"}</span>
      </button>
      <p className="mt-1 text-center text-[12px] text-smoke">무료 체험 · 잼을 사용하지 않아요</p>
      <p role="status" className="mt-2 text-center text-[12px]">{message}</p>
      {take > 0 && action.clips && <RoomVoicePlayer key={take} clips={action.clips} />}
    </section>
  );
}
