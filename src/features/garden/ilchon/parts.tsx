"use client";

import { useState } from "react";

import type { LineDoc } from "@/lib/firebase/ilchon";

import { gardenFeedback } from "../feedback";
import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import { GUESTBOOK_MODES, lineText, PHRASES, readLine, STICKERS, tagLabel, TAGS, TEXT_MAX, type GuestbookMode, type Line } from "./rules";
import { cleanLine, LINE_PROBLEM_TEXT, lineProblem } from "./text";

/**
 * 1촌 화면의 조각 — 한 줄 쓰기 시트, 이름표 고르기, 방명록·1촌평 목록, 방 열기 안내.
 * 생김새는 정원 홈의 다이어리 속지(docs/garden-miniroom.md §3.3)를 따른다.
 *
 * ★ 사람이 쓴 글은 글로만 그린다. 링크로 만들지 않고, 카드·미리보기·위키에 싣지 않는다(§5.3).
 */

/** 한 줄(방명록·1촌평) 쓰기. 정해 둔 문구를 고르거나 직접 쓰고(60자), 스티커 하나를 고른다. */
export function LineComposer({
  title,
  label,
  submitLabel,
  onClose,
  onSubmit,
}: {
  title: string;
  label: string;
  submitLabel: string;
  onClose: () => void;
  /** 보낸다. 실패하면 던진다 — 시트가 까닭을 적는다. */
  onSubmit: (line: Line) => Promise<void>;
}) {
  const [mode, setMode] = useState<"preset" | "free">("preset");
  const [phrase, setPhrase] = useState(0);
  const [text, setText] = useState("");
  const [sticker, setSticker] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clean = cleanLine(text);
  const problem = mode === "free" ? lineProblem(clean) : null;

  const submit = async () => {
    if (busy || problem) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(mode === "preset" ? { p: phrase, x: "", k: sticker } : { p: -1, x: clean, k: sticker });
    } catch (e) {
      console.error("[ilchon] 한 줄을 남기지 못했다", e);
      setError(e instanceof Error && e.message ? e.message : "남기지 못했어요. 잠시 뒤 다시 해 보세요");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet label={label} title={title} onClose={onClose}>
      <div role="group" aria-label="쓰는 방법" className="garden-chips mt-3">
        <button type="button" className="garden-chip-btn" aria-pressed={mode === "preset"} onClick={() => setMode("preset")}>
          문구 고르기
        </button>
        <button type="button" className="garden-chip-btn" aria-pressed={mode === "free"} onClick={() => setMode("free")}>
          직접 쓰기
        </button>
      </div>

      {mode === "preset" ? (
        <ul className="garden-phrase-list mt-3" aria-label="문구">
          {PHRASES.map((p, i) => (
            <li key={p}>
              <button type="button" aria-pressed={phrase === i} onClick={() => setPhrase(i)} className="garden-phrase">
                {p}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3">
          <label htmlFor="garden-line-text" className="text-[12.5px] font-bold text-[var(--d-sky-ink)]">
            한 줄 ({clean.length}/{TEXT_MAX})
          </label>
          <input
            id="garden-line-text"
            value={text}
            maxLength={TEXT_MAX + 20}
            onChange={(e) => setText(e.target.value)}
            className="garden-line-input mt-1"
            placeholder="예: 화분이 정말 예뻐요"
            autoComplete="off"
          />
          <p className="mt-1 text-[12px] leading-relaxed text-smoke">
            링크·전화번호·메신저 아이디는 남길 수 없어요. 방 주인이 지울 수 있고, 누구나 신고할 수 있어요.
          </p>
          {clean.length > 0 && problem && <p className="mt-1 text-[12.5px] font-bold text-[#c2410c]">{LINE_PROBLEM_TEXT[problem]}</p>}
        </div>
      )}

      <p className="mt-4 text-[12.5px] font-bold text-[var(--d-sky-ink)]">스티커</p>
      <ul className="mt-1.5 grid grid-cols-6 gap-1.5" aria-label="스티커">
        {STICKERS.map((s, i) => (
          <li key={s.label}>
            <button type="button" aria-pressed={sticker === i} aria-label={s.label} onClick={() => setSticker(i)} className="garden-sticker">
              <span aria-hidden="true">{s.icon}</span>
            </button>
          </li>
        ))}
      </ul>

      {error && <p className="mt-3 text-[12.5px] font-bold text-[#c2410c]">{error}</p>}
      <button
        type="button"
        disabled={busy || (mode === "free" && Boolean(problem))}
        onClick={() => void submit()}
        className="garden-shop-buy mt-4 w-full"
      >
        {busy ? "남기는 중…" : submitLabel}
      </button>
    </Sheet>
  );
}

/** 1촌 이름표 고르기. 글을 짓지 않고 여덟 가지에서 고른다. */
export function TagSheet({
  title,
  intro,
  initial = 0,
  submitLabel,
  onClose,
  onPick,
}: {
  title: string;
  intro?: string;
  initial?: number;
  submitLabel: string;
  onClose: () => void;
  onPick: (tag: number) => Promise<void>;
}) {
  const [tag, setTag] = useState(initial);
  const [busy, setBusy] = useState(false);
  return (
    <Sheet label={title} title={title} onClose={onClose}>
      {intro && <p className="mt-1 text-[12.5px] leading-relaxed text-smoke">{intro}</p>}
      <ul className="mt-3 grid grid-cols-2 gap-2" aria-label="이름표">
        {TAGS.map((t, i) => (
          <li key={t}>
            <button type="button" aria-pressed={tag === i} onClick={() => setTag(i)} className="garden-mood-btn">
              🏷 {t}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onPick(tag);
          } finally {
            setBusy(false);
          }
        }}
        className="garden-shop-buy mt-4 w-full"
      >
        {busy ? "보내는 중…" : submitLabel}
      </button>
    </Sheet>
  );
}

/** 한 줄을 그린다. 스티커 · 글 · 이름. 글은 글로만. */
export function LineRow({
  line,
  owner,
  canRemove,
  admin,
  onVisit,
  onRemove,
  onReport,
  onBlock,
  onHide,
}: {
  line: LineDoc;
  /** 방 주인이 보는 화면인가(지우기·차단). */
  owner: boolean;
  /** 내가 지울 수 있는가(주인이거나 쓴 사람). */
  canRemove: boolean;
  admin: boolean;
  onVisit?: (gid: string) => void;
  onRemove: () => void;
  onReport: () => void;
  onBlock?: () => void;
  onHide?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const parsed = readLine(line);
  if (!parsed) return null;
  const sticker = STICKERS[parsed.k];
  const who = line.n || "이웃";
  const date = line.at ? new Date(line.at).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", timeZone: "Asia/Seoul" }) : "";
  return (
    <li className="garden-line">
      <div className="flex items-start gap-2">
        <span aria-label={sticker.label} className="text-[20px] leading-none">{sticker.icon}</span>
        <div className="min-w-0 flex-1">
          <p className={`break-words text-[13.5px] ${line.hidden ? "text-smoke line-through" : ""}`}>
            {line.hidden ? "운영자가 가린 글이에요" : `“${lineText(parsed)}”`}
          </p>
          <p className="mt-0.5 text-[12px] text-smoke">
            —{" "}
            {onVisit && line.g ? (
              <button type="button" onClick={() => { gardenFeedback("tap"); onVisit(line.g); }} className="garden-line-name">
                {who}
              </button>
            ) : (
              <b>{who}</b>
            )}
            {line.tag !== undefined && <span>({tagLabel(line.tag)})</span>}
            {date && <span> · {date}</span>}
          </p>
        </div>
        <button type="button" aria-expanded={open} aria-label={`${who}의 글 더 보기`} onClick={() => setOpen(!open)} className="garden-line-more">
          ⋯
        </button>
      </div>
      {open && (
        <div className="mt-1.5 flex flex-wrap justify-end gap-1.5">
          {canRemove && <button type="button" className="garden-chip-btn" onClick={onRemove}>지우기</button>}
          {owner && onBlock && <button type="button" className="garden-chip-btn" onClick={onBlock}>차단</button>}
          {admin && onHide && <button type="button" className="garden-chip-btn" onClick={onHide}>{line.hidden ? "가리기 풀기" : "가리기(운영자)"}</button>}
          <button type="button" className="garden-chip-btn" onClick={onReport}>신고</button>
        </div>
      )}
    </li>
  );
}

/** 방을 열면 1촌을 맺을 수 있다는 첫 안내(§5.1). 공개 스위치를 홈으로 끌어낸다. */
export function OpenRoomPrompt({ say }: { say: (text: string) => void }) {
  return (
    <section aria-labelledby="garden-open-room" className="garden-open-room">
      <h2 id="garden-open-room" className="garden-diary-title">방을 열면 1촌을 맺을 수 있어요</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-smoke">
        보이는 것은 정원 이름과 방, 텃밭뿐이에요. 잼·씨앗·쪽지는 보이지 않아요. 언제든 다시 닫을 수 있어요.
      </p>
      <button
        type="button"
        onClick={() => {
          gardenFeedback("tap");
          useGarden.getState().setShare(true);
          say("방을 열었어요 · 이제 1촌을 맺고 방명록을 받을 수 있어요");
        }}
        className="garden-diary-btn mt-2"
      >
        🔓 방 열기
      </button>
    </section>
  );
}

/** 켜고 끄는 줄. 44px 누름 자리. */
export function SwitchRow({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (on: boolean) => void }) {
  return (
    <label className="garden-switch-row">
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-bold">{label}</span>
        {hint && <span className="block text-[12px] leading-relaxed text-smoke">{hint}</span>}
      </span>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => { gardenFeedback("tap"); onChange(e.target.checked); }} className="garden-switch" />
    </label>
  );
}

/** 방명록 받기 — 모두 / 1촌만 / 받지 않기. */
export function GuestbookModePicker({ mode, onChange }: { mode: GuestbookMode; onChange: (mode: GuestbookMode) => void }) {
  return (
    <div role="group" aria-label="방명록 받기" className="garden-chips">
      {GUESTBOOK_MODES.map((m) => (
        <button key={m.id} type="button" className="garden-chip-btn" aria-pressed={mode === m.id} onClick={() => { gardenFeedback("tap"); onChange(m.id); }}>
          {m.label}
        </button>
      ))}
    </div>
  );
}
