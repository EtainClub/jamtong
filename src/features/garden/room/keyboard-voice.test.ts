/**
 * 키 녹음의 소리 손질 — `pnpm garden:test`. 다듬기·줄이기·목소리 바꾸기·WAV 크기를 본다.
 * 올라가는 파일은 storage.rules의 64KB 아래여야 한다(keyboard.ts의 KEY_REC_MAX_BYTES).
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { KEY_REC_MAX_BYTES } from "./keyboard";
import {
  applyVoice,
  downsample,
  encodeWav,
  encodeWavBytes,
  finishRecording,
  MAX_REC_SAMPLES,
  normalize,
  peak,
  REC_SAMPLE_RATE,
  resample,
  rms,
  robotize,
  trimSilence,
  VOICE_MODES,
  DEFAULT_VOICE,
} from "./voice";

const sine = (hz: number, seconds: number, rate: number, amp = 0.5) =>
  Float32Array.from({ length: Math.floor(seconds * rate) }, (_, i) => amp * Math.sin((2 * Math.PI * hz * i) / rate));

test("목소리 고르기: 넷, 로봇이 기본, 원래 목소리는 맨 끝", () => {
  assert.deepEqual(VOICE_MODES.map((m) => m.id), ["robot", "high", "low", "original"]);
  assert.equal(DEFAULT_VOICE, "robot");
});

test("WAV: 16kHz 모노 16비트, 머리 44바이트", () => {
  const bytes = new DataView(encodeWavBytes(new Float32Array(100), REC_SAMPLE_RATE));
  const tag = (o: number) => String.fromCharCode(...[0, 1, 2, 3].map((i) => bytes.getUint8(o + i)));
  assert.equal(bytes.byteLength, 44 + 200);
  assert.equal(tag(0), "RIFF");
  assert.equal(tag(8), "WAVE");
  assert.equal(bytes.getUint16(22, true), 1, "모노");
  assert.equal(bytes.getUint32(24, true), REC_SAMPLE_RATE);
  assert.equal(bytes.getUint16(34, true), 16);
  assert.equal(encodeWav(new Float32Array(10)).type, "audio/wav");
});

test("어떤 목소리든 1.5초 아래·64KB 아래", () => {
  const long = sine(220, 1.5, REC_SAMPLE_RATE);
  for (const m of VOICE_MODES) {
    const out = applyVoice(long, m.id);
    assert.ok(out.length <= MAX_REC_SAMPLES, `${m.id}: ${out.length}`);
    assert.ok(encodeWav(out).size < KEY_REC_MAX_BYTES, m.id);
  }
  // 낮은 목소리는 느려져 길어진다 — 1.5초에서 자른다.
  assert.equal(applyVoice(long, "low").length, MAX_REC_SAMPLES);
  assert.ok(applyVoice(long, "high").length < long.length);
});

test("목소리 바꾸기는 원래 소리와 다른 소리를 만든다(원래 목소리만 같다)", () => {
  const voice = sine(200, 0.5, REC_SAMPLE_RATE);
  const same = (a: Float32Array, b: Float32Array) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 1e-6);
  const original = applyVoice(voice, "original");
  assert.ok(same(original, applyVoice(voice, "original")), "같은 입력이면 같은 출력");
  for (const mode of ["robot", "high", "low"] as const) assert.equal(same(applyVoice(voice, mode), original), false, mode);
  // 로봇: 낮은 사인파를 곱한다 — 모양은 그대로 길이, 값은 달라진다.
  const r = robotize(voice, REC_SAMPLE_RATE);
  assert.equal(r.length, voice.length);
  assert.ok(peak(r) <= peak(voice) + 1e-6);
});

test("resample: 빠르게 읽으면 짧아지고 느리게 읽으면 길어진다", () => {
  const x = sine(100, 1, 1000);
  assert.equal(resample(x, 2).length, 500);
  assert.equal(resample(x, 0.5).length, 2000);
  assert.equal(resample(new Float32Array(0), 2).length, 0);
});

test("다듬기: 앞뒤 고요를 자르고, 다 고요하면 그대로", () => {
  const rate = 16_000;
  const quiet = new Float32Array(rate / 2);
  const loud = sine(300, 0.3, rate);
  const all = new Float32Array(quiet.length * 2 + loud.length);
  all.set(loud, quiet.length);
  const trimmed = trimSilence(all, rate);
  assert.ok(trimmed.length < all.length && trimmed.length >= loud.length, `${trimmed.length}`);
  assert.equal(trimSilence(quiet, rate).length, quiet.length);
});

test("줄이기·키우기", () => {
  assert.equal(downsample(new Float32Array(48_000), 48_000, 16_000).length, 16_000);
  const n = normalize(sine(100, 0.1, 1000, 0.1));
  assert.ok(Math.abs(peak(n) - 0.9) < 1e-3);
  assert.equal(rms(new Float32Array(0)), 0);
});

test("finishRecording: 48kHz 2초 → 1.5초 안의 16kHz, 너무 조용하면 알린다", () => {
  const rate = 48_000;
  const chunks = Array.from({ length: 16 }, () => sine(250, 0.125, rate, 0.4));
  const take = finishRecording(chunks, rate);
  assert.ok(take.raw.length <= MAX_REC_SAMPLES && take.raw.length > REC_SAMPLE_RATE, `${take.raw.length}`);
  assert.equal(take.tooQuiet, false);
  assert.equal(finishRecording([sine(250, 1, rate, 0.005)], rate).tooQuiet, true);
});
