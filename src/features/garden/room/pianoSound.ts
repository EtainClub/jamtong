"use client";

import { keyAudio } from "../feedback";
import { PIANO_MIN, PIANO_MAX, type PianoEvent } from "./piano";

/** 해머의 빠른 타격과 배음별 감쇠. 예약한 음도 시트 닫기·정지로 취소한다. */
export class PianoAudio {
  private audio = keyAudio();
  private voices = new Set<OscillatorNode>();

  note(note: number, at = (this.audio?.ctx.currentTime ?? 0) + .005) {
    if (!this.audio || !Number.isInteger(note) || note < PIANO_MIN || note > PIANO_MAX) return;
    const { ctx, out } = this.audio;
    const hz = 440 * 2 ** ((note - 69) / 12);
    [1, 2, 3, 4, 6].forEach((harmonic, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = hz * harmonic * (1 + i * .0004);
      gain.gain.setValueAtTime(.0001, at);
      gain.gain.linearRampToValueAtTime([.24, .1, .055, .025, .012][i], at + .004);
      gain.gain.exponentialRampToValueAtTime(.0001, at + 2.4 / (1 + i * .5));
      osc.connect(gain).connect(out);
      this.voices.add(osc);
      osc.start(at);
      osc.stop(at + 2.45);
      osc.onended = () => { this.voices.delete(osc); osc.disconnect(); gain.disconnect(); };
    });
  }

  play(song: PianoEvent[]): boolean {
    if (!this.audio) return false;
    const base = this.audio.ctx.currentTime + .01;
    song.forEach(({ t, n }) => this.note(n, base + t / 1000));
    return true;
  }

  stop() {
    this.voices.forEach((osc) => { osc.stop(); osc.disconnect(); });
    this.voices.clear();
  }
}
