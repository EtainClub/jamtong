/** 피아노 건반의 음과 15초 연주를 정규화한다. */
export const PIANO_DEFAULT = [60, 62, 64, 65, 67, 69, 71, 72];
export const PIANO_MIN = 48;
export const PIANO_MAX = 84;
export function pianoNotes(raw: unknown): number[] {
  return PIANO_DEFAULT.map((fallback, i) => {
    const n = Array.isArray(raw) ? raw[i] : undefined;
    return Number.isInteger(n) && n >= PIANO_MIN && n <= PIANO_MAX ? n : fallback;
  });
}
export function pianoNoteLabel(note: number): string {
  return `${["도", "도♯", "레", "레♯", "미", "파", "파♯", "솔", "솔♯", "라", "라♯", "시"][note % 12]}${Math.floor(note / 12) - 1}`;
}

/** 오디오 대신 누른 시각(ms)과 음만 저장해 같은 음색으로 재생한다. */
export const PIANO_DURATION = 15_000;
export const PIANO_EVENT_MAX = 256;
export interface PianoEvent { t: number; n: number }
export function pianoSong(raw: unknown): PianoEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, PIANO_EVENT_MAX).filter((e): e is PianoEvent =>
    e !== null && typeof e === "object" && Number.isInteger(e.t) && e.t >= 0 && e.t < PIANO_DURATION
    && Number.isInteger(e.n) && e.n >= PIANO_MIN && e.n <= PIANO_MAX,
  ).map(({ t, n }) => ({ t, n })).sort((a, b) => a.t - b.t);
}
