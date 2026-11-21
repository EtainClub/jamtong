"use client";

import { useState } from "react";

import { gardenFeedback } from "../feedback";
import { hasSouvenir, SOUVENIR_CASE } from "../room/rules";
import type { GardenData } from "../store";
import type { Species } from "../types";
import { QuizSheet } from "./QuizSheet";
import { SOUVENIR_STATUS_LABEL, type MemorialEntry } from "./types";
import { useMemorial } from "./useMemorial";

/**
 * 업적 기념관 — 업적마다 기념품 하나. 알아보고 문제를 맞히면 방에 생긴다(docs/garden-achievement-strategy.md §3).
 * 빈 칸이 곧 "다음에 알아볼 업적" 목록이다.
 */
export function MemorialView({ data, byId, say }: { data: GardenData; byId: Map<string, Species>; say: (text: string) => void }) {
  const entries = useMemorial();
  const [open, setOpen] = useState<MemorialEntry | null>(null);

  if (entries === undefined) return <p className="mt-4 text-[13px] text-smoke">기념관을 여는 중…</p>;
  if (entries === null) return <p className="mt-4 text-[13px] text-smoke">기념관 자료를 받지 못했어요. 잠시 뒤 다시 열어 주세요.</p>;

  const got = entries.filter((e) => hasSouvenir(data.room, e.speciesId)).length;
  return (
    <section aria-labelledby="garden-memorial" className="mt-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="garden-memorial" className="garden-diary-title">업적 기념관</h2>
        <p className="text-[12px] text-smoke tabular-nums">
          기념품 {got}/{entries.length}
        </p>
      </div>
      <p className="mt-1 text-[12.5px] leading-relaxed text-smoke">
        업적 카드를 읽고 문제 하나를 맞히면 그 업적의 기념품이 내 방 기념품 진열장(한 칸)에 모여요. 잼으로는 살 수 없어요 — 알아본 만큼 모여요.
      </p>
      {got > 0 && !data.room.placed.some((p) => p.it === SOUVENIR_CASE) && (
        <p className="mt-2 rounded-xl border border-dashed border-[var(--g-leaf)] bg-white px-3 py-2 text-[12.5px] leading-relaxed">
          🏛️ 기념품 진열장이 보관함에 있어요. <b>꾸미기</b>에서 진열장을 놓으면 받은 기념품 {got}개가 모두 그 안에 보여요.
        </p>
      )}
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {entries.map((e) => {
          const have = hasSouvenir(data.room, e.speciesId);
          return (
            <li key={e.slug}>
              <button
                type="button"
                onClick={() => { gardenFeedback("tap"); setOpen(e); }}
                className={`flex min-h-[104px] w-full flex-col items-center justify-start gap-1 rounded-2xl border px-1.5 py-2 text-center ${have ? "border-[var(--g-leaf)] bg-white" : "border-dashed border-stone bg-[var(--g-panel)]"}`}
                aria-label={`${e.title} — ${have ? "기념품을 받았어요" : "알아보고 기념품 받기"}`}
              >
                <span className={`text-[30px] leading-none ${have ? "" : "opacity-35 grayscale"}`} aria-hidden="true">{e.icon}</span>
                <span className="line-clamp-2 text-[11.5px] font-semibold leading-tight">{e.title}</span>
                <span className="text-[10.5px] text-smoke">
                  {have ? "✓ 받음" : "알아보기"}
                  {e.status ? ` · ${SOUVENIR_STATUS_LABEL[e.status]}` : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {open && <QuizSheet key={open.slug} entry={open} earned={hasSouvenir(data.room, open.speciesId)} byId={byId} onClose={() => setOpen(null)} say={say} />}
    </section>
  );
}
