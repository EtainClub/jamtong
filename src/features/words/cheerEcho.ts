/**
 * 내 응원에 돌아온 반응 — "지난번 이후 나도요 +N".
 *
 * ★ 서버가 보내는 알림이 아니다. 들렀을 때 보인다.
 *   정원의 익음 알림과 같은 결이다. 다시 올 이유를 하나 만들 뿐, 사람을 부르지 않는다.
 *
 * ★ 이 기기에만 적는다. 마지막으로 본 나도요 수를 글마다 적어 두고, 지금 수와 견준다.
 *   다른 기기에서 보면 처음 보는 셈이라 아무것도 띄우지 않는다(처음 본 글은 지금 수로 시작한다).
 *   저장소가 막혀 있으면(비공개 창) 아무것도 띄우지 않는다.
 */

interface Countable {
  id: string;
  agreeCount: number;
  createdAt: Date | null;
}

/** 마지막으로 본 때와 그때의 글마다 나도요 수. */
interface Ledger {
  at: number;
  seen: Record<string, number>;
}

const KEY = (uid: string) => `jamtong:cheer-echo:${uid}`;

function read(uid: string): Ledger | null {
  try {
    const raw = window.localStorage.getItem(KEY(uid));
    if (!raw) return { at: Infinity, seen: {} };
    const data = JSON.parse(raw) as Partial<Ledger>;
    return { at: typeof data.at === "number" ? data.at : Infinity, seen: data.seen ?? {} };
  } catch {
    return null;
  }
}

/**
 * 글마다 지난번 이후 늘어난 나도요.
 *
 * 장부에 없는 글은 둘이다. 지난번 이후에 쓴 글이면 0에서 시작한 셈이고(그동안 붙은 나도요가
 * 다 새것이다), 그 전부터 있던 글이면 이 기기에서 처음 보는 셈이라 세지 않는다.
 */
export function echoGains(uid: string, notes: Countable[]): Map<string, number> {
  const ledger = read(uid);
  const gains = new Map<string, number>();
  if (!ledger) return gains;
  for (const note of notes) {
    const known = ledger.seen[note.id];
    const before =
      known ?? ((note.createdAt?.getTime() ?? 0) > ledger.at ? 0 : undefined);
    if (before !== undefined && note.agreeCount > before) gains.set(note.id, note.agreeCount - before);
  }
  return gains;
}

/** 지금 수를 본 것으로 적는다. 지운 글은 장부에서 뺀다. */
export function markEchoSeen(uid: string, notes: Countable[]): void {
  try {
    const seen: Record<string, number> = {};
    for (const note of notes) seen[note.id] = note.agreeCount;
    const next: Ledger = { at: Date.now(), seen };
    window.localStorage.setItem(KEY(uid), JSON.stringify(next));
  } catch {
    /* 저장소가 막혀 있으면 다음에도 처음 보는 셈이다. */
  }
}
