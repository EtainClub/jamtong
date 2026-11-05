"use client";

/**
 * 정원의 소리 — 효과음과 배경음악. 둘 다 Web Audio로 그 자리에서 만든다(내려받는 파일 없음).
 *
 * ★ 켜는 것은 사람이다. 자동 재생하지 않는다. 켠 설정은 이 기기에 기억하지만,
 *   다시 열었을 때도 첫 터치가 있어야 소리가 난다(브라우저가 그 전의 재생을 막는다).
 * ★ 음악은 잼통 고유의 짧은 오르골 곡이다(docs/garden-game.md §1 "음악은 잼통 고유로").
 *
 * 모바일에서 소리가 나지 않던 이유와 대응:
 * - iOS 무음 스위치는 따른다. 무음이면 음악도 효과음도 나지 않는다 — 이건 고장이 아니다.
 *   audioSession을 "ambient"로 못 박아 둔다(Safari 16.4+). 다른 앱의 음악도 끊지 않는다.
 *   그보다 오래된 iOS는 빈 소리를 한 번 재생해 오디오를 연다(Web Audio라 무음 스위치는 그대로 따른다).
 * - 화면을 끄거나 다른 앱에 다녀오면 AudioContext가 suspended/interrupted가 된다.
 *   다시 보이거나 터치할 때 resume한다. 숨겨지면 스스로 멈춘다(배터리).
 * - 효과음이 0.16초·작은 사인파라 휴대폰 스피커로는 거의 들리지 않았다. 음량과 음색을 키웠다.
 */

const STORAGE_KEY = "jamtong-garden-sound";

let enabled = false;
let audio: AudioContext | undefined;
let master: GainNode | undefined;
let music: GainNode | undefined;
let timer: ReturnType<typeof setInterval> | undefined;
let nextAt = 0;
let step = 0;
let listening = false;

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

/** 사용자가 켠 적이 있는가. 화면의 버튼 표시용. */
export function savedGardenSound(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function save(value: boolean) {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, "on");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 비공개 창 등. 이번 방문 동안만 기억한다.
  }
}

/**
 * 반드시 사용자의 터치·클릭 안에서 부른다. 모바일 브라우저는 그 안에서만 오디오를 연다.
 */
function unlock(): AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const session = (navigator as AudioSessionNavigator).audioSession;
    if (session && session.type !== "ambient") session.type = "ambient";
  } catch {
    // 지원하지 않는 브라우저.
  }
  try {
    if (!audio) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return undefined;
      audio = new Ctx();
      master = audio.createGain();
      master.gain.value = 0.9;
      master.connect(audio.destination);
      // 오래된 iOS: 터치 안에서 소리를 한 번 내야 이후 재생이 풀린다. 빈 버퍼면 들리지 않는다.
      const silent = audio.createBufferSource();
      silent.buffer = audio.createBuffer(1, 1, 22050);
      silent.connect(audio.destination);
      silent.start(0);
    }
    if (audio.state !== "running") void audio.resume().catch(() => {});
    return audio;
  } catch {
    return undefined; // Web Audio가 없는 브라우저. 소리는 덤이다.
  }
}

/** 화면이 다시 보이거나 터치하면 깨운다. 숨겨지면 멈춘다. */
function listen() {
  if (listening || typeof document === "undefined") return;
  listening = true;
  const wake = () => {
    if (!enabled) return;
    unlock();
    startMusic();
  };
  document.addEventListener("visibilitychange", () => {
    if (!audio) return;
    if (document.hidden) void audio.suspend().catch(() => {});
    else if (enabled) void audio.resume().catch(() => {});
  });
  // 저장된 설정으로 다시 열었을 때, 그리고 iOS가 끊었을(interrupted) 때 첫 터치로 다시 연다.
  // 터치의 pointerdown은 브라우저가 "사용자 활성화"로 치지 않는다 — 손을 뗄 때(pointerup·touchend)라야 열린다.
  window.addEventListener("pointerup", wake, { passive: true });
  window.addEventListener("touchend", wake, { passive: true });
  window.addEventListener("keydown", wake);
}

/** 정원을 열 때 부른다. 켜 둔 사람이면 첫 터치를 기다렸다가 소리를 낸다. */
export function restoreGardenSound(): boolean {
  const on = savedGardenSound();
  enabled = on;
  if (on) listen();
  return on;
}

/** 버튼에서 부른다(사용자 터치 안). */
export function setGardenSound(value: boolean, remember = true) {
  enabled = value;
  if (remember) save(value);
  if (value) {
    listen();
    unlock();
    startMusic();
    gardenFeedback("tap");
  } else {
    stopMusic();
  }
}

// ── 효과음 ──────────────────────────────────────────────────────────

export function gardenFeedback(kind: "tap" | "plant" | "harvest" | "pull" | "reward") {
  if (typeof window === "undefined") return;
  if (kind !== "tap" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    navigator.vibrate?.(kind === "pull" ? [12, 25, 18] : 12);
  }
  if (!enabled) return;
  const ctx = unlock();
  if (!ctx || !master) return;
  const notes = kind === "tap" ? [880] : kind === "plant" ? [523, 784] : kind === "pull" ? [392, 330] : [784, 988, 1175];
  notes.forEach((hz, i) => tone(ctx, master!, hz, ctx.currentTime + 0.01 + i * 0.07, kind === "tap" ? 0.12 : 0.28, 0.16, "triangle"));
}

function tone(ctx: AudioContext, out: AudioNode, hz: number, at: number, length: number, peak: number, type: OscillatorType) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(hz, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(peak, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  oscillator.connect(gain).connect(out);
  oscillator.start(at);
  oscillator.stop(at + length + 0.05);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
}

// ── 배경음악: 잼통 오르골 ─────────────────────────────────────────────

/** 느긋한 8분음표 오르골. 네 마디 화성(도·라·파·솔) 위에 두 갈래 선율이 번갈아 돈다. */
const BPM = 84;
const EIGHTH = 60 / BPM / 2;
const BAR = 8;
const CHORDS = [
  [48, 52, 55], // 도
  [45, 48, 52], // 라
  [41, 45, 48], // 파
  [43, 47, 50], // 솔
];
type Line = Array<number | null>;
const MELODY: Line[] = [
  // 첫째 갈래
  [76, null, 79, 76, 72, null, 74, null],
  [72, null, 76, 74, 69, null, null, 72],
  [69, null, 72, 77, 76, null, 72, null],
  [74, null, 71, 74, 79, null, 77, 74],
  // 둘째 갈래
  [79, null, 76, null, 79, 81, 79, null],
  [76, null, 72, null, 76, 74, 72, null],
  [77, null, 76, 72, 69, null, 72, 74],
  [71, null, 74, null, 72, null, null, null],
];
const LOOP = MELODY.length * BAR;

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

function playStep(ctx: AudioContext, out: AudioNode, s: number, at: number) {
  const bar = Math.floor(s / BAR) % MELODY.length;
  const beat = s % BAR;
  const chord = CHORDS[bar % CHORDS.length];
  const note = MELODY[bar][beat];
  if (note !== null) tone(ctx, out, midi(note), at, 0.9, 0.07, "triangle");
  // 베이스: 마디 첫 박과 셋째 박에 뿌리음과 5도.
  if (beat === 0) tone(ctx, out, midi(chord[0]), at, 1.4, 0.06, "sine");
  if (beat === 4) tone(ctx, out, midi(chord[0] + 7), at, 1.2, 0.04, "sine");
  // 화음: 마디 첫 박에 낮게 깐다.
  if (beat === 0) for (const n of chord) tone(ctx, out, midi(n + 12), at, BAR * EIGHTH, 0.012, "sine");
}

function schedule() {
  if (!audio || !music || audio.state !== "running") return;
  // 멈췄다 돌아왔으면 박자를 지금으로 당긴다. 밀린 음을 한꺼번에 쏟지 않게.
  if (nextAt < audio.currentTime) nextAt = audio.currentTime + 0.05;
  while (nextAt < audio.currentTime + 0.6) {
    playStep(audio, music, step, nextAt);
    nextAt += EIGHTH;
    step = (step + 1) % LOOP;
  }
}

function startMusic() {
  if (!audio || !master || timer) return;
  music = audio.createGain();
  music.gain.setValueAtTime(0.0001, audio.currentTime);
  music.gain.exponentialRampToValueAtTime(0.8, audio.currentTime + 1.5);
  music.connect(master);
  nextAt = audio.currentTime + 0.1;
  step = 0;
  timer = setInterval(schedule, 150);
  schedule();
}

function stopMusic() {
  if (timer) clearInterval(timer);
  timer = undefined;
  if (audio && music) {
    const fading = music;
    fading.gain.cancelScheduledValues(audio.currentTime);
    fading.gain.setValueAtTime(fading.gain.value, audio.currentTime);
    fading.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.4);
    setTimeout(() => fading.disconnect(), 600);
  }
  music = undefined;
}

/** 정원 화면을 떠날 때. 설정은 지우지 않는다. */
export function leaveGardenSound() {
  enabled = false;
  stopMusic();
}
