"use client";

import { keyAudio, synth } from "../feedback";
import type { RoomSound } from "./activities";
import { lightstickOf } from "./lightsticks";

let barkAudio: HTMLAudioElement | undefined;

function bark(): boolean {
  if (typeof Audio === "undefined") return false;
  barkAudio ??= new Audio("/audio/room/dog-bark.mp3");
  barkAudio.volume = .65;
  barkAudio.currentTime = 0;
  void barkAudio.play().catch(() => { /* 다음 클릭에서 다시 시도할 수 있어요. */ });
  return true;
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) barkAudio?.pause();
  });
}

/** 클릭 시에만 짧은 효과음을 재생한다. 배경음악 설정은 바꾸지 않는다. */
export function playActivitySound(sound: RoomSound): boolean {
  if (sound === "bark") return bark();
  const a = keyAudio();
  if (!a) return false;
  const { ctx, out } = a;
  const at = ctx.currentTime + .01;
  const { tone, noise, thud } = synth;
  const light = lightstickOf(sound);
  if (light) {
    light.notes.forEach((hz, i) => {
      tone(ctx, out, hz, at + i * .13, .32, .1, light.shape === "heart" ? "sine" : "triangle");
      tone(ctx, out, hz * 2, at + i * .13, .17, .025, "sine");
    });
    return true;
  }
  switch (sound) {
    case "stone": noise(ctx, out, at, .035, .15, 2200); tone(ctx, out, 740, at, .09, .15, "triangle"); break;
    case "bubble": [0, .13, .3].forEach((t, i) => tone(ctx, out, 620+i*280, at+t, .13, .16, "sine")); break;
    case "bounce": thud(ctx, out, at, .45); tone(ctx, out, 180, at+.08, .13, .12, "sine"); break;
    case "chime": [1318, 1781, 2637].forEach((hz, i) => tone(ctx, out, hz, at+i*.02, 1.2, .08, "sine")); break;
    case "musicbox": [523, 659, 784, 1047, 784, 659].forEach((hz, i) => tone(ctx, out, hz, at+i*.18, .4, .13, "triangle")); break;
  }
  return true;
}
