"use client";

import { useState } from "react";

import { gardenFeedback, gardenTrack, TRACK_ORDER, type GardenTrackId } from "../feedback";
import type { NewsItem, Place } from "../nav";
import { LINE_PROBLEM_TEXT, type LineProblem } from "../ilchon/text";
import { MOODS } from "../room/catalog";
import { MOTTO_MAX } from "../room/rules";
import { useGarden } from "../store";
import { Sheet } from "../Sheet";

/**
 * 정원 홈의 조각들 (docs/garden-miniroom.md §3.2).
 *
 * 손님 수·1촌평·방명록은 1촌(§5)이 채운다. 방을 열지 않았으면 숫자는 "–", 칸은 안내 한 줄.
 */

/**
 * 오늘 손님 · 모든 손님. 내 방에만 보이고 순위는 없다(§5.3).
 * gardens/{gid}/meta/counter를 읽어 today·total을 넘긴다. 없으면 "–".
 */
export function VisitorCount({ today, total }: { today?: number; total?: number }) {
  const n = (v?: number) => (v === undefined ? "–" : v.toLocaleString());
  return (
    <p className="garden-today" aria-label={`오늘 손님 ${n(today)}, 모든 손님 ${n(total)}`}>
      <span>오늘 손님</span> <b>{n(today)}</b>
      <span aria-hidden="true"> · </span>
      <span>모든 손님</span> <b>{n(total)}</b>
    </p>
  );
}

/** 새 소식. 누르면 그 자리로 간다. 첫 화면의 일이다. */
export function NewsPanel({ news, onGo }: { news: NewsItem[]; onGo: (place: Place) => void }) {
  return (
    <section aria-labelledby="garden-news" className="garden-news">
      <h2 id="garden-news" className="garden-diary-title">새 소식</h2>
      <ul className="mt-1.5">
        {news.map((n) => (
          <li key={n.key}>
            <button type="button" onClick={() => { gardenFeedback("tap"); onGo(n.go); }} className="garden-news-row">
              <span aria-hidden="true" className="text-[17px] leading-none">{n.icon}</span>
              <span className="min-w-0 flex-1 text-left">{n.text}</span>
              <span className="garden-news-go">{n.goLabel} →</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 오늘의 기분 고르기. 정해 둔 열둘뿐이다 — 글을 짓지 않는다. */
export function MoodSheet({ current, onPick, onClose }: { current: string; onPick: (id: string) => void; onClose: () => void }) {
  return (
    <Sheet label="오늘의 기분 고르기" title="오늘의 기분" onClose={onClose}>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {MOODS.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              aria-pressed={current === m.id}
              onClick={() => onPick(m.id)}
              className="garden-mood-btn"
            >
              <span aria-hidden="true" className="text-[24px] leading-none">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

/**
 * 방 한마디 쓰기 (§4.6). '내 방' 옆에 걸리는 한 줄. 방을 공개하면 손님도 그 방에서 본다.
 * 방명록과 같은 걸러내기(링크·연락처·욕)를 거치고, 손님은 신고하고 운영자는 가린다.
 */
export function MottoSheet({ current, onClose, say }: { current: string; onClose: () => void; say: (text: string) => void }) {
  const [text, setText] = useState(current);
  const [problem, setProblem] = useState<LineProblem | null>(null);
  const save = () => {
    const found = useGarden.getState().setMotto(text);
    setProblem(found);
    if (found) return;
    gardenFeedback("reward");
    say(text.trim() ? "✏️ 방 한마디를 걸었어요" : "방 한마디를 지웠어요");
    onClose();
  };
  return (
    <Sheet label="방 한마디 쓰기" title="방 한마디" onClose={onClose}>
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label htmlFor="garden-motto-input" className="text-[12.5px] text-smoke">
          내 방을 한 줄로 소개해요. 방을 공개하면 손님도 봐요.
        </label>
        <input
          id="garden-motto-input"
          className="garden-motto-input mt-1.5"
          value={text}
          maxLength={MOTTO_MAX}
          autoComplete="off"
          enterKeyHint="done"
          placeholder="예) 오늘도 물 주러 왔어요 🌱"
          onChange={(e) => {
            setText(e.target.value);
            setProblem(null);
          }}
        />
        <div className="mt-1 flex justify-between text-[12px]">
          <span role="alert" className="text-[var(--d-orange)]">{problem ? LINE_PROBLEM_TEXT[problem] : ""}</span>
          <span className="tabular-nums text-smoke">{text.length}/{MOTTO_MAX}</span>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-smoke">이름·학교·연락처는 적지 마세요. 링크는 남길 수 없어요.</p>
        <div className="mt-3 flex gap-2">
          {current && (
            <button type="button" className="garden-diary-btn is-quiet min-h-[44px] flex-1" onClick={() => { setText(""); setProblem(null); }}>
              비우기
            </button>
          )}
          <button type="submit" className="garden-diary-btn min-h-[44px] flex-[2]">
            걸기
          </button>
        </div>
      </form>
    </Sheet>
  );
}

/**
 * 방 음악 고르기. 다섯 곡 모두 잼통이 만든 곡이고 공짜다. 고른 곡은 공개 방에 실려 손님도 이 방에서 듣는다.
 * 곡을 누르면 바로 그 곡이 흐른다(꺼져 있었으면 켠다). 시트는 닫지 않는다 — 들어 보며 고르게.
 */
export function MusicSheet({
  current,
  sound,
  onPick,
  onToggle,
  onClose,
}: {
  current: GardenTrackId;
  sound: boolean;
  onPick: (id: GardenTrackId) => void;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet label="방 음악 고르기" title="방 음악" onClose={onClose}>
      <ul className="mt-3 space-y-2">
        {TRACK_ORDER.map((id) => {
          const t = gardenTrack(id);
          const on = current === id;
          return (
            <li key={id}>
              <button type="button" aria-pressed={on} onClick={() => onPick(id)} className="garden-track-btn">
                <span aria-hidden="true" className="text-[22px] leading-none">{t.icon}</span>
                <span className="min-w-0 flex-1 text-left">
                  <b className="block text-[14px]">{t.label}</b>
                  <span className="block text-[12px] text-smoke">{t.hint}</span>
                </span>
                {on && <span className="shrink-0 text-[12px] font-bold">{sound ? "♪ 재생 중" : "고름"}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={onToggle} className="garden-diary-btn mt-3 min-h-[44px] w-full">
        {sound ? "음악 끄기" : "음악 켜기"}
      </button>
      <p className="mt-2 text-[12px] leading-relaxed text-smoke">
        고른 곡은 방을 공개하면 손님도 이 방에서 들어요. 무음 모드에서는 들리지 않아요.
      </p>
    </Sheet>
  );
}

/**
 * 1촌평 자리(§5.2). 1촌이 남긴 한 줄을 children으로 받는다. 없으면(방을 열지 않았다) 안내 한 줄.
 */
export function IlchonNotes({ children }: { children?: React.ReactNode }) {
  return (
    <section aria-labelledby="garden-ilchon-notes" className="garden-diary-box">
      <h2 id="garden-ilchon-notes" className="garden-diary-title">1촌평</h2>
      {children ?? <p className="mt-1 text-[13px] text-smoke">방을 열고 1촌을 맺으면 1촌이 남긴 한 줄이 여기에 걸려요.</p>}
    </section>
  );
}

/**
 * 방명록 자리(§5.3). 홈의 "방명록" 책갈피도 같은 자리다. 목록을 children으로 받는다.
 * 없으면(방을 열지 않았다) 안내 한 줄.
 */
export function Guestbook({ children }: { children?: React.ReactNode }) {
  return (
    <section aria-labelledby="garden-guestbook" className="garden-diary-box">
      <h2 id="garden-guestbook" className="garden-diary-title">방명록</h2>
      {children ?? <p className="mt-1 text-[13px] text-smoke">손님이 한 줄과 스티커를 남기는 자리예요. 방을 열면 받을 수 있어요.</p>}
    </section>
  );
}
