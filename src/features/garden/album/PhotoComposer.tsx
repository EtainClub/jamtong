"use client";

import { useState } from "react";

import { gardenFeedback } from "../feedback";
import { STICKERS } from "../ilchon/rules";
import { cleanLine, LINE_PROBLEM_TEXT, lineProblem } from "../ilchon/text";
import type { MemorialEntry } from "../memorial/types";
import { Sheet } from "../Sheet";
import type { Species } from "../types";
import { PhotoBody } from "./PhotoBody";
import { FOLDERS, LINE_MAX, REASON_SCRAP, REASONS, type MomentData, type PhotoPatch } from "./rules";

export interface ComposeValue {
  p: number;
  k: number;
  f: number;
  x: string;
  cv: boolean;
  nc: boolean;
}

/**
 * 사진 담기·고치기 시트 — 사진(콘텐츠)은 미리 보이고, 고르는 것은 내 몫뿐이다(docs/garden-album-review.md §5).
 * 왜 담았나(문구) · 스티커 · 폴더 · 한 줄(60자, 방명록과 같은 검사) · 대표 사진 · 댓글 받기.
 */
export function PhotoComposer({
  title,
  a,
  md,
  initial,
  entries,
  byId,
  submitLabel,
  onClose,
  onSubmit,
}: {
  title: string;
  a: string;
  md?: MomentData;
  initial: ComposeValue;
  entries: readonly MemorialEntry[] | null | undefined;
  byId: ReadonlyMap<string, Species>;
  submitLabel: string;
  onClose: () => void;
  /** 담는다. 못 담았으면 까닭을 돌려준다(시트에 적는다). */
  onSubmit: (value: ComposeValue) => string | null;
}) {
  const [v, setV] = useState<ComposeValue>(initial);
  const [error, setError] = useState<string | null>(null);
  const line = cleanLine(v.x);
  const problem = line ? lineProblem(line) : null;
  const set = (patch: Partial<ComposeValue>) => setV((old) => ({ ...old, ...patch }));

  return (
    <Sheet label={title} title={title} onClose={onClose}>
      <div className="mt-3">
        <PhotoBody a={a} md={md} entries={entries} byId={byId} />
      </div>

      <p className="mt-4 text-[12.5px] font-bold text-[var(--d-sky-ink)]">왜 담았나요</p>
      <ul className="garden-phrase-list mt-1.5" aria-label="왜 담았나요">
        {REASONS.map((r, i) => (i === REASON_SCRAP && initial.p !== REASON_SCRAP ? null : (
          <li key={r}>
            <button type="button" aria-pressed={v.p === i} onClick={() => set({ p: i })} className="garden-phrase">
              {r}
            </button>
          </li>
        )))}
      </ul>

      <label htmlFor="album-line" className="mt-4 block text-[12.5px] font-bold text-[var(--d-sky-ink)]">
        한 줄 더하기 (선택 · {line.length}/{LINE_MAX})
      </label>
      <input
        id="album-line"
        value={v.x}
        maxLength={LINE_MAX + 20}
        onChange={(e) => set({ x: e.target.value })}
        className="garden-line-input mt-1"
        placeholder="예: 엄마가 물어봐서 찾아봤어요"
        autoComplete="off"
      />
      <p className="mt-1 text-[12px] leading-relaxed text-smoke">
        내 말로 보여요(사실 칸과 따로). 링크·전화번호·메신저 아이디는 남길 수 없고, 누구나 신고할 수 있어요.
      </p>
      {problem && <p className="mt-1 text-[12.5px] font-bold text-[#c2410c]">{LINE_PROBLEM_TEXT[problem]}</p>}

      <p className="mt-4 text-[12.5px] font-bold text-[var(--d-sky-ink)]">스티커</p>
      <ul className="mt-1.5 grid grid-cols-6 gap-1.5" aria-label="스티커">
        {STICKERS.map((s, i) => (
          <li key={s.label}>
            <button type="button" aria-pressed={v.k === i} aria-label={s.label} onClick={() => set({ k: i })} className="garden-sticker">
              <span aria-hidden="true">{s.icon}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[12.5px] font-bold text-[var(--d-sky-ink)]">폴더</p>
      <div role="group" aria-label="폴더" className="garden-chips mt-1.5">
        {FOLDERS.map((f, i) => (
          <button key={f.label} type="button" className="garden-chip-btn" aria-pressed={v.f === i} onClick={() => set({ f: i })}>
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2 text-[13px]">
        <label className="flex min-h-[40px] items-center gap-2">
          <input type="checkbox" checked={v.cv} onChange={(e) => set({ cv: e.target.checked })} />
          대표 사진으로(사진첩 맨 앞)
        </label>
        <label className="flex min-h-[40px] items-center gap-2">
          <input type="checkbox" checked={!v.nc} onChange={(e) => set({ nc: !e.target.checked })} />
          이 사진에 댓글 받기(방명록 받기 설정을 따라요)
        </label>
      </div>

      {error && <p className="mt-3 text-[12.5px] font-bold text-[#c2410c]">{error}</p>}
      <button
        type="button"
        disabled={Boolean(problem)}
        className="garden-shop-buy mt-4 w-full"
        onClick={() => {
          if (problem) return;
          gardenFeedback("tap");
          const why = onSubmit({ ...v, x: line });
          if (why) setError(why);
        }}
      >
        {submitLabel}
      </button>
    </Sheet>
  );
}

/** 시트의 값을 장부의 고치기로. */
export function patchOf(v: ComposeValue): PhotoPatch {
  return { p: v.p, k: v.k, f: v.f, x: v.x, cv: v.cv, nc: v.nc };
}
