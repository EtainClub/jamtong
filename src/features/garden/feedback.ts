"use client";

let enabled = false;
let audio: AudioContext | undefined;

export function setGardenSound(value: boolean) {
  enabled = value;
  if (value) gardenFeedback("tap");
}

/** Opt-in, generated chimes; no downloads, music loop, or autoplay. */
export function gardenFeedback(kind: "tap" | "plant" | "harvest" | "pull" | "reward") {
  if (typeof window === "undefined") return;
  if (kind !== "tap" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    navigator.vibrate?.(kind === "pull" ? [12, 25, 18] : 12);
  }
  if (!enabled) return;
  try {
    audio ??= new AudioContext();
    if (audio.state === "suspended") void audio.resume().catch(() => {});
    const notes = kind === "tap" ? [440] : kind === "plant" ? [330, 440] : [523, 659, 784];
    notes.forEach((hz, i) => {
      const oscillator = audio!.createOscillator();
      const gain = audio!.createGain();
      const at = audio!.currentTime + i * .065;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(hz, at);
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(.045, at + .008);
      gain.gain.exponentialRampToValueAtTime(.001, at + .16);
      oscillator.connect(gain).connect(audio!.destination);
      oscillator.start(at);
      oscillator.stop(at + .18);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  } catch { /* Sound is optional on browsers without Web Audio. */ }
}
