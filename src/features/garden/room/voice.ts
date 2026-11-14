/**
 * 키 녹음의 소리 손질 — 다듬기·줄이기·목소리 바꾸기·WAV 만들기. 순수 함수만 둔다(브라우저 없이 시험한다).
 *
 * keycap-creator(같은 만든이의 다른 앱)의 audio-engine/wav.ts·voice.ts에서 필요한 것만 옮겨 고쳤다.
 *
 * ★ 목소리는 **올리기 전에 이 기기에서 한 번** 바꾼다. 재생할 때 효과를 걸면 원래 목소리가 그대로 올라간다.
 *   로봇·높은·낮은 목소리를 고르면 올라가는 것은 바뀐 소리뿐이고, 원래 녹음은 이 기기의 메모리에만 있다가 버려진다.
 *   원래 목소리는 사람이 따로 골라 확인했을 때만 올라간다(KeyEditor.tsx).
 * ★ 바꾼 목소리가 "알아볼 수 없는" 목소리라고 말하지 않는다. 바꾼다는 사실만 말한다.
 * ★ MediaRecorder를 쓰지 않는다 — 기기마다 코덱이 달라(iOS mp4, 안드로이드 webm) 서로 열리지 않는 일이 있다.
 *   16kHz 모노 16비트 WAV는 모든 브라우저가 연다. 1.5초면 약 47KB다.
 */

export const REC_SAMPLE_RATE = 16_000;
export const MAX_RECORD_SECONDS = 1.5;
export const MAX_REC_SAMPLES = Math.round(REC_SAMPLE_RATE * MAX_RECORD_SECONDS);
/** 이보다 조용하면 "소리가 작아요"를 띄운다. */
export const QUIET_RMS = 0.02;

export type VoiceMode = "robot" | "high" | "low" | "original";

/** 고르는 차례. 로봇이 기본이다. 원래 목소리는 맨 끝, 고르면 확인을 받는다. */
export const VOICE_MODES: Array<{ id: VoiceMode; icon: string; label: string }> = [
  { id: "robot", icon: "🤖", label: "로봇" },
  { id: "high", icon: "🐿", label: "높은 목소리" },
  { id: "low", icon: "🐻", label: "낮은 목소리" },
  { id: "original", icon: "🙂", label: "원래 목소리" },
];
export const DEFAULT_VOICE: VoiceMode = "robot";

export function rms(samples: Float32Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

export function peak(samples: Float32Array): number {
  let max = 0;
  for (let i = 0; i < samples.length; i++) max = Math.max(max, Math.abs(samples[i]));
  return max;
}

export function concat(chunks: readonly Float32Array[]): Float32Array {
  const out = new Float32Array(chunks.reduce((n, c) => n + c.length, 0));
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

/** 앞뒤의 조용한 곳을 잘라 낸다. 단추를 누르고 한 박자 뒤에 소리를 내기 마련이다. */
export function trimSilence(samples: Float32Array, rate: number, padMs = 40, windowMs = 10): Float32Array {
  const size = Math.max(1, Math.floor((rate * windowMs) / 1000));
  const pad = Math.floor((rate * padMs) / 1000);
  // 절대 문턱과 가장 큰 소리의 8% 중 큰 쪽 — 조용한 녹음이 통째로 잘리지 않게.
  const threshold = Math.max(0.012, peak(samples) * 0.08);
  let start = -1;
  let end = -1;
  for (let i = 0; i + size <= samples.length; i += size) {
    if (rms(samples.subarray(i, i + size)) >= threshold) {
      if (start < 0) start = i;
      end = i + size;
    }
  }
  if (start < 0) return samples;
  return samples.slice(Math.max(0, start - pad), Math.min(samples.length, end + pad));
}

/** 표본율을 낮춘다. 솎아 내기 전에 구간 평균으로 살짝 뭉갠다(목소리 효과음에는 이것으로 넉넉하다). */
export function downsample(samples: Float32Array, from: number, to: number): Float32Array {
  if (to >= from) return samples;
  const ratio = from / to;
  const out = new Float32Array(Math.floor(samples.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const a = Math.floor(i * ratio);
    const b = Math.min(samples.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = a; j < b; j++) sum += samples[j];
    out[i] = b > a ? sum / (b - a) : 0;
  }
  return out;
}

/** 가장 큰 소리를 target에 맞춘다. 휴대폰 녹음은 대개 작다. */
export function normalize(samples: Float32Array, target = 0.9): Float32Array {
  const p = peak(samples);
  if (p < 1e-5) return samples;
  const g = target / p;
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) out[i] = samples[i] * g;
  return out;
}

/**
 * 빠르기를 바꿔 다시 읽는다(rate>1이면 빠르고 높게, <1이면 느리고 낮게). 사이는 직선으로 잇는다.
 * 빠르게 읽을 때는 먼저 뭉개 거친 소리(에일리어싱)를 줄인다.
 */
export function resample(samples: Float32Array, rate: number): Float32Array {
  if (!(rate > 0) || samples.length === 0) return samples;
  const src = rate > 1 ? smooth(samples, Math.ceil(rate)) : samples;
  const out = new Float32Array(Math.max(1, Math.floor(samples.length / rate)));
  for (let i = 0; i < out.length; i++) {
    const x = i * rate;
    const a = Math.floor(x);
    const b = Math.min(src.length - 1, a + 1);
    const t = x - a;
    out[i] = (src[Math.min(a, src.length - 1)] ?? 0) * (1 - t) + (src[b] ?? 0) * t;
  }
  return out;
}

function smooth(samples: Float32Array, width: number): Float32Array {
  if (width <= 1) return samples;
  const out = new Float32Array(samples.length);
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i];
    if (i >= width) sum -= samples[i - width];
    out[i] = sum / Math.min(i + 1, width);
  }
  return out;
}

/** 로봇 목소리 — 낮은 사인파를 곱하는 고리 변조(ring modulation)에 원래 소리를 조금 섞는다. */
export function robotize(samples: Float32Array, rate: number, carrier = 60, dry = 0.2): Float32Array {
  const out = new Float32Array(samples.length);
  const w = (2 * Math.PI * carrier) / rate;
  for (let i = 0; i < samples.length; i++) out[i] = samples[i] * (Math.sin(w * i) * (1 - dry) + dry);
  return out;
}

/** 고른 목소리로 바꾼다. 입력은 16kHz 모노(finishRecording이 만든 것). 1.5초를 넘으면 자른다. */
export function applyVoice(samples: Float32Array, mode: VoiceMode): Float32Array {
  const shaped =
    mode === "robot" ? robotize(samples, REC_SAMPLE_RATE) : mode === "high" ? resample(samples, 1.45) : mode === "low" ? resample(samples, 0.72) : samples;
  const clipped = shaped.length > MAX_REC_SAMPLES ? shaped.slice(0, MAX_REC_SAMPLES) : shaped;
  return fade(normalize(clipped));
}

/** 끝을 아주 짧게 줄여 딸깍 소리를 없앤다. */
function fade(samples: Float32Array, n = 80): Float32Array {
  const out = samples.slice();
  const m = Math.min(n, Math.floor(out.length / 2));
  for (let i = 0; i < m; i++) {
    out[i] *= i / m;
    out[out.length - 1 - i] *= i / m;
  }
  return out;
}

/** 16비트 PCM 모노 WAV의 바이트. */
export function encodeWavBytes(samples: Float32Array, rate: number): ArrayBuffer {
  const size = samples.length * 2;
  const buffer = new ArrayBuffer(44 + size);
  const view = new DataView(buffer);
  const str = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i));
  };
  str(0, "RIFF");
  view.setUint32(4, 36 + size, true);
  str(8, "WAVE");
  str(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // 모노
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  str(36, "data");
  view.setUint32(40, size, true);
  let o = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    o += 2;
  }
  return buffer;
}

export function encodeWav(samples: Float32Array, rate = REC_SAMPLE_RATE): Blob {
  return new Blob([encodeWavBytes(samples, rate)], { type: "audio/wav" });
}

export interface Take {
  /** 다듬고 16kHz로 줄인 원래 녹음. 이 기기의 메모리에만 있다. */
  raw: Float32Array;
  /** 다듬기 전의 크기. 너무 작으면 다시 녹음하라고 권한다. */
  rms: number;
  tooQuiet: boolean;
}

/** 모은 조각 → 1.5초로 자르고 → 앞뒤를 다듬고 → 16kHz로. 목소리 바꾸기는 applyVoice가 따로 한다. */
export function finishRecording(chunks: readonly Float32Array[], inputRate: number): Take {
  const all = concat(chunks);
  const capped = all.slice(0, Math.floor(inputRate * MAX_RECORD_SECONDS));
  const level = rms(capped);
  const down = downsample(trimSilence(capped, inputRate), inputRate, REC_SAMPLE_RATE);
  return { raw: down.length > MAX_REC_SAMPLES ? down.slice(0, MAX_REC_SAMPLES) : down, rms: level, tooQuiet: level < QUIET_RMS };
}
