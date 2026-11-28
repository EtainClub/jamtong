/**
 * 5단계 「내 말로 답하기」에 쓴 글 — **이 기기에만** 둔다(docs/jamgong-roadmap.md R6, §7 "쓴 답은 보내지 않는다").
 *
 * ★ 계정(Firestore)에도, 분석 이벤트에도 보내지 않는다. 공부 기록(store.ts)과 다른 열쇠에 둔다.
 * ★ 비공개 창이나 저장이 막힌 곳에서는 조용히 넘어간다 — 쓴 글을 다시 보여 주는 것은 편의일 뿐이다.
 */
const KEY = "jamgong-say-v1";
/** 문항마다 마지막 글 하나. 너무 길면 자른다. */
const MAX_LEN = 2000;

type Saved = Record<string, { text: string; day: string }>;

function readAll(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : {};
  } catch {
    return {};
  }
}

/** 이 문항에 지난번 쓴 글. */
export function savedSay(itemId: string): { text: string; day: string } | null {
  return readAll()[itemId] ?? null;
}

export function saveSay(itemId: string, text: string, day: string): void {
  const trimmed = text.trim().slice(0, MAX_LEN);
  if (!trimmed) return;
  try {
    const all = readAll();
    all[itemId] = { text: trimmed, day };
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // 저장이 막힌 기기 — 이번 화면에서만 본다.
  }
}
