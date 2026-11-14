"use client";

import { gardenFeedback } from "../feedback";
import type { NewsItem, Place } from "../nav";
import { MOODS } from "../room/catalog";
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
