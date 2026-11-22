"use client";

import { useState } from "react";

import { CartoonView } from "./CartoonView";
import { PhotoCard } from "./PhotoCard";
import type { MemorialEntry } from "./types";

/**
 * 업적 하나를 보는 자리 — 카툰이 있으면 카툰부터, 사진 카드로 바꿔 볼 수 있다(docs/garden-cartoon-review.md).
 * 기념관 문제 전 "알아보기", 진열장·방의 기념품 시트가 같이 쓴다.
 */
export function EntryStory({ entry, from }: { entry: MemorialEntry; from: "memorial" | "room" | "album" }) {
  const [view, setView] = useState<"cartoon" | "card">(entry.cartoon ? "cartoon" : "card");
  if (!entry.cartoon) return <PhotoCard entry={entry} from={from} />;
  return (
    <div>
      <div className="mb-2 grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="보기">
        {(
          [
            ["cartoon", "🎞 카툰"],
            ["card", "📷 사진 카드"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" role="radio" aria-checked={view === id} onClick={() => setView(id)} className="cartoon-tab min-h-[40px]">
            {label}
          </button>
        ))}
      </div>
      {view === "cartoon" ? <CartoonView entry={entry} from={from} /> : <PhotoCard entry={entry} from={from} />}
    </div>
  );
}
