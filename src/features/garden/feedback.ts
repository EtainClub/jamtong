"use client";

/**
 * 정원의 소리 — 효과음과 배경음악. 둘 다 Web Audio로 그 자리에서 만든다(내려받는 파일 없음).
 *
 * ★ 켜는 것은 사람이다. 자동 재생하지 않는다. 켠 설정은 이 기기에 기억하지만,
 *   다시 열었을 때도 첫 터치가 있어야 소리가 난다(브라우저가 그 전의 재생을 막는다).
 * ★ 음악은 잼통 고유의 짧은 곡 다섯이다(docs/garden-game.md §1 "음악은 잼통 고유로"). 방 주인이 고른다.
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

// ── 거대 잡초 타격음 ────────────────────────────────────────────────

/**
 * 거대 잡초의 손맛. 문지르기(rub)·한 방(hit)·약점(weak)·남이 친 한 방(ghost)·단계(phase)·
 * 합동 게이지(surge)·반격 경고(warn)·맞음(hurt)·피함(dodge)·필살기(finisher)·쓰러뜨림(defeat).
 *
 * ★ 소리는 사람이 켰을 때만 난다(enabled). 진동은 소리와 따로이고, 움직임 줄이기 설정이면 내지 않는다.
 * ★ 타격음은 짧은 잡음(퍽)과 낮은 사인(쿵)을 겹친다. 파일을 받지 않는다.
 */
export type RaidSound = "rub" | "hit" | "weak" | "ghost" | "phase" | "surge" | "warn" | "hurt" | "dodge" | "finisher" | "defeat";

const RAID_VIBE: Partial<Record<RaidSound, number | number[]>> = {
  rub: 4,
  hit: [18, 20, 28],
  weak: [24, 16, 36],
  phase: [40, 40, 80],
  surge: [30, 30, 30, 30, 60],
  warn: [60, 60, 60],
  hurt: [120, 40, 120],
  dodge: 20,
  finisher: [30, 30, 50, 30, 120],
  defeat: [60, 50, 60, 50, 200],
};

let lastGhost = 0;

export function raidFeedback(kind: RaidSound) {
  if (typeof window === "undefined") return;
  const vibe = RAID_VIBE[kind];
  if (vibe !== undefined && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    try {
      navigator.vibrate?.(vibe);
    } catch {
      // 진동은 덤이다.
    }
  }
  if (!enabled) return;
  // 남이 친 소리는 겹치면 시끄럽다. 0.12초에 한 번만.
  if (kind === "ghost") {
    const t = performance.now();
    if (t - lastGhost < 120) return;
    lastGhost = t;
  }
  const ctx = unlock();
  if (!ctx || !master) return;
  const at = ctx.currentTime + 0.005;
  const out = master;
  switch (kind) {
    case "rub":
      noise(ctx, out, at, 0.05, 0.08, 2_400);
      break;
    case "hit":
      thud(ctx, out, at, 1);
      break;
    case "weak":
      thud(ctx, out, at, 1.1);
      tone(ctx, out, 1_320, at + 0.02, 0.18, 0.1, "square");
      break;
    case "ghost":
      thud(ctx, out, at, 0.35);
      break;
    case "phase":
      thud(ctx, out, at, 1.3);
      [523, 392, 330].forEach((hz, i) => tone(ctx, out, hz, at + 0.12 + i * 0.09, 0.3, 0.12, "sawtooth"));
      break;
    case "surge":
      [523, 659, 784, 1047].forEach((hz, i) => tone(ctx, out, hz, at + i * 0.07, 0.4, 0.13, "triangle"));
      sweep(ctx, out, at, 0.6, 300, 1_800, 0.08);
      break;
    case "warn":
      tone(ctx, out, 880, at, 0.12, 0.14, "square");
      tone(ctx, out, 880, at + 0.18, 0.12, 0.14, "square");
      break;
    case "hurt":
      sweep(ctx, out, at, 0.35, 420, 90, 0.16);
      noise(ctx, out, at, 0.25, 0.12, 900);
      break;
    case "dodge":
      sweep(ctx, out, at, 0.18, 600, 1_600, 0.1);
      break;
    case "finisher":
      sweep(ctx, out, at, 0.45, 180, 1_400, 0.12);
      [0.5, 0.68, 0.86].forEach((d, i) => thud(ctx, out, at + d, 1.1 + i * 0.2));
      break;
    case "defeat":
      thud(ctx, out, at, 1.6);
      [523, 659, 784, 1047, 1319].forEach((hz, i) => tone(ctx, out, hz, at + 0.35 + i * 0.1, 0.6, 0.12, "triangle"));
      break;
  }
}

/** 퍽 — 잡음 한 줌과 낮은 쿵. power가 클수록 낮고 크다. */
function thud(ctx: AudioContext, out: AudioNode, at: number, power: number) {
  noise(ctx, out, at, 0.09 * power, 0.22 * Math.min(power, 1.4), 1_200);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150 / Math.sqrt(power), at);
  osc.frequency.exponentialRampToValueAtTime(45, at + 0.18 * power);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(0.4 * Math.min(power, 1.4), at + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.22 * power);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + 0.25 * power + 0.05);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

let noiseBuffer: AudioBuffer | undefined;

function noise(ctx: AudioContext, out: AudioNode, at: number, length: number, peak: number, cutoff: number) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(peak, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  src.connect(filter).connect(gain).connect(out);
  src.start(at);
  src.stop(at + length + 0.02);
  src.onended = () => {
    src.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

function sweep(ctx: AudioContext, out: AudioNode, at: number, length: number, from: number, to: number, peak: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + length);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(peak, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + length + 0.05);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
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

// ── 배경음악: 내 방 음악 다섯 곡 ──────────────────────────────────────
//
// 모두 잼통 고유의 짧은 곡이다(docs/garden-game.md §1 "음악은 잼통 고유로"). 파일을 내려받지 않고
// 악보를 Web Audio로 그 자리에서 연주한다 — 번들이 몇 KB 느는 것뿐이고, 저작권이 걸린 곡이 끼어들 길이 없다.
// 곡을 더하려면 TRACKS에 한 줄. id는 공개 방 문서에 실리므로 바꾸지 않는다(GardenTrackId).

type Line = Array<number | null>;

interface Track {
  label: string;
  icon: string;
  /** 고르는 화면의 한 줄 설명. */
  hint: string;
  bpm: number;
  /** 한 마디의 8분음표 칸 수. 8=4/4, 6=3/4. */
  bar: number;
  /** 마디마다 돌아가는 화음(낮은 MIDI 음 셋). */
  chords: number[][];
  melody: Line[];
  lead: { type: OscillatorType; length: number; peak: number };
  /** 베이스: [마디 안의 칸, 뿌리음에서 반음 수]. */
  bass: Array<[number, number]>;
  bassType: OscillatorType;
}

const C = [48, 52, 55];
const AM = [45, 48, 52];
const F = [41, 45, 48];
const G = [43, 47, 50];

const TRACKS = {
  /** 처음부터 있던 곡. 기본값이라 예전에 음악을 켜 둔 사람은 같은 곡을 듣는다. */
  orgel: {
    label: "잼통 오르골",
    icon: "🎐",
    hint: "느긋한 오르골. 정원의 처음 곡",
    bpm: 84,
    bar: 8,
    chords: [C, AM, F, G],
    melody: [
      [76, null, 79, 76, 72, null, 74, null],
      [72, null, 76, 74, 69, null, null, 72],
      [69, null, 72, 77, 76, null, 72, null],
      [74, null, 71, 74, 79, null, 77, 74],
      [79, null, 76, null, 79, 81, 79, null],
      [76, null, 72, null, 76, 74, 72, null],
      [77, null, 76, 72, 69, null, 72, 74],
      [71, null, 74, null, 72, null, null, null],
    ],
    lead: { type: "triangle", length: 0.9, peak: 0.07 },
    bass: [[0, 0], [4, 7]],
    bassType: "sine",
  },
  waltz: {
    label: "단비 왈츠",
    icon: "☔",
    hint: "쿵짝짝 세 박자. 창밖에 비가 올 때",
    bpm: 100,
    bar: 6,
    chords: [C, G, AM, F],
    melody: [
      [72, null, 76, null, 79, null],
      [79, null, 77, null, 74, null],
      [76, null, 72, null, 69, null],
      [72, null, 77, 76, 74, null],
      [72, null, 76, null, 79, 81],
      [83, null, 79, null, 74, null],
      [76, null, 72, null, 69, 72],
      [77, null, 76, null, 74, null],
    ],
    lead: { type: "triangle", length: 0.7, peak: 0.065 },
    bass: [[0, 0], [2, 12], [4, 7]],
    bassType: "sine",
  },
  walk: {
    label: "햇살 산책",
    icon: "🌤",
    hint: "통통 튀는 8비트. 옛 휴대폰 벨소리 같은",
    bpm: 112,
    bar: 8,
    chords: [C, F, G, C],
    melody: [
      [72, 74, 76, 72, 76, null, 79, null],
      [77, 76, 74, 72, 69, null, 72, null],
      [74, null, 74, 76, 77, null, 74, null],
      [76, 74, 72, null, 72, null, null, null],
      [79, null, 79, 77, 76, null, 72, null],
      [81, 79, 77, 76, 77, null, 81, null],
      [79, 77, 76, 74, 74, null, 71, null],
      [72, null, 76, null, 72, null, null, null],
    ],
    lead: { type: "square", length: 0.22, peak: 0.028 },
    bass: [[0, 0], [2, 12], [4, 7], [6, 12]],
    bassType: "triangle",
  },
  lullaby: {
    label: "별밤 자장가",
    icon: "🌙",
    hint: "느리고 조용한 단조. 밤에 듣기 좋은",
    bpm: 62,
    bar: 8,
    chords: [AM, F, C, G],
    melody: [
      [69, null, null, 72, 76, null, null, null],
      [77, null, 76, null, 72, null, null, null],
      [72, null, null, 74, 76, null, 79, null],
      [79, null, null, 77, 74, null, null, null],
      [69, null, null, 72, 76, null, 81, null],
      [77, null, null, 76, 72, null, 69, null],
      [67, null, null, 72, 76, null, 72, null],
      [71, null, null, null, 74, null, null, null],
    ],
    lead: { type: "sine", length: 1.6, peak: 0.08 },
    bass: [[0, 0], [2, 7], [4, 12], [6, 7]],
    bassType: "sine",
  },
  festival: {
    label: "광장 축제",
    icon: "🎉",
    hint: "신나는 행진. 거대 잡초를 잡으러 갈 때",
    bpm: 126,
    bar: 8,
    chords: [C, G, AM, F],
    melody: [
      [72, null, 74, 76, null, 79, null, 76],
      [74, null, 71, null, 67, null, 71, 74],
      [76, null, 72, null, 69, 72, 76, null],
      [77, 76, 74, 72, 74, null, null, null],
      [72, null, 74, 76, null, 79, null, 81],
      [79, null, 74, null, 71, null, 74, null],
      [72, 76, 79, null, 76, 72, 69, null],
      [77, null, 74, null, 72, null, null, null],
    ],
    lead: { type: "square", length: 0.2, peak: 0.026 },
    bass: [[0, 0], [2, 12], [4, 0], [6, 12]],
    bassType: "triangle",
  },
} satisfies Record<string, Track>;

export type GardenTrackId = keyof typeof TRACKS;
export const DEFAULT_TRACK: GardenTrackId = "orgel";
export const TRACK_ORDER: GardenTrackId[] = ["orgel", "waltz", "walk", "lullaby", "festival"];

export function isGardenTrack(id: unknown): id is GardenTrackId {
  return typeof id === "string" && Object.prototype.hasOwnProperty.call(TRACKS, id);
}

export function gardenTrack(id: GardenTrackId): { label: string; icon: string; hint: string } {
  const t: Track = TRACKS[id];
  return { label: t.label, icon: t.icon, hint: t.hint };
}

let current: GardenTrackId = DEFAULT_TRACK;

/**
 * 곡을 바꾼다. 음악이 흐르는 중이면 곧바로 갈아 끼우고(살짝 줄였다가), 꺼져 있으면 다음에 켤 때 이 곡이다.
 * 남의 방에 놀러 가면 그 방의 곡으로, 돌아오면 내 곡으로 — 부르는 쪽이 정한다.
 */
export function setGardenTrack(id: GardenTrackId) {
  if (id === current) return;
  current = id;
  if (timer) {
    stopMusic();
    startMusic();
  }
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

function playStep(ctx: AudioContext, out: AudioNode, t: Track, s: number, at: number) {
  const eighth = 60 / t.bpm / 2;
  const bar = Math.floor(s / t.bar) % t.melody.length;
  const beat = s % t.bar;
  const chord = t.chords[bar % t.chords.length];
  const note = t.melody[bar][beat];
  if (note !== null) tone(ctx, out, midi(note), at, t.lead.length, t.lead.peak, t.lead.type);
  for (const [at8, up] of t.bass) {
    if (at8 === beat) tone(ctx, out, midi(chord[0] + up), at, at8 === 0 ? 1.4 : 1.0, at8 === 0 ? 0.06 : 0.04, t.bassType);
  }
  // 화음: 마디 첫 박에 낮게 깐다.
  if (beat === 0) for (const n of chord) tone(ctx, out, midi(n + 12), at, t.bar * eighth, 0.012, "sine");
}

function schedule() {
  if (!audio || !music || audio.state !== "running") return;
  const t: Track = TRACKS[current];
  const eighth = 60 / t.bpm / 2;
  const loop = t.melody.length * t.bar;
  // 멈췄다 돌아왔으면 박자를 지금으로 당긴다. 밀린 음을 한꺼번에 쏟지 않게.
  if (nextAt < audio.currentTime) nextAt = audio.currentTime + 0.05;
  while (nextAt < audio.currentTime + 0.6) {
    playStep(audio, music, t, step, nextAt);
    nextAt += eighth;
    step = (step + 1) % loop;
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
