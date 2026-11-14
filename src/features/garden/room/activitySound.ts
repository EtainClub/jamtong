"use client";

import { keyAudio, synth } from "../feedback";
import type { RoomSound } from "./activities";

/** 클릭 시에만 짧게 합성한다. 키보드와 같이 배경음악 설정은 바꾸지 않는다. */
export function playActivitySound(sound: RoomSound): boolean {
  const a = keyAudio();
  if (!a) return false;
  const { ctx, out } = a;
  const at = ctx.currentTime + .01;
  const { tone, noise, thud } = synth;
  switch (sound) {
    case "bark":
      [0, .19].forEach((t) => { tone(ctx, out, 210, at+t, .1, .13, "triangle"); noise(ctx, out, at+t, .06, .06, 700); });
      break;
    case "stone": noise(ctx, out, at, .035, .15, 2200); tone(ctx, out, 740, at, .09, .15, "triangle"); break;
    case "bubble": [0, .13, .3].forEach((t, i) => tone(ctx, out, 620+i*280, at+t, .13, .16, "sine")); break;
    case "bounce": thud(ctx, out, at, .45); tone(ctx, out, 180, at+.08, .13, .12, "sine"); break;
    case "chime": [1318, 1781, 2637].forEach((hz, i) => tone(ctx, out, hz, at+i*.02, 1.2, .08, "sine")); break;
    case "musicbox": [523, 659, 784, 1047, 784, 659].forEach((hz, i) => tone(ctx, out, hz, at+i*.18, .4, .13, "triangle")); break;
  }
  return true;
}
