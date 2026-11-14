"use client";

import { keyAudio, musicGrid, synth } from "../feedback";
import { REC, snapTime, type RoomKey } from "./keyboard";

/**
 * 키보드의 소리 — 정해 둔 소리 스물(그 자리에서 만든다)과 녹음 재생(docs/garden-miniroom.md §4.5).
 *
 * ★ 키를 누르면 소리를 꺼 두었어도 난다(누른 것이 사용자 터치다). 배경음악은 켜지 않는다.
 * ★ 방 음악이 흐르면 다음 8분음표에 맞춘다(feedback.ts의 musicGrid). 아니면 바로.
 * ★ 녹음은 <audio>로 튼다. 버킷에 CORS 설정이 없어 fetch+decodeAudioData로는 다른 출처에서 읽지 못한다.
 *   그래서 박자에 맞출 때는 Web Audio 시각까지 남은 만큼 타이머로 기다린다(수 ms 어긋날 수 있다).
 */

type Ctx = AudioContext;
type Play = (ctx: Ctx, out: AudioNode, at: number) => void;

const { tone, noise, thud } = synth;

/** 미끄러지는 음. 시작·끝 주파수, 파형을 고른다. */
function glide(ctx: Ctx, out: AudioNode, at: number, length: number, from: number, to: number, peak: number, type: OscillatorType = "sine") {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + length);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(peak, at + Math.min(0.015, length / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + length + 0.05);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

/** 오르골 한 음: 세모파 + 한 옥타브 위 사인을 살짝. */
const orgel = (hz: number): Play => (ctx, out, at) => {
  tone(ctx, out, hz, at, 1.3, 0.2, "triangle");
  tone(ctx, out, hz * 2, at, 0.6, 0.05, "sine");
};

/** 정해 둔 소리. id는 keyboard.ts의 PRESETS와 같다(keyboard.test.ts가 본다). 모두 잼통 고유로 만든 소리다. */
export const SYNTH: Record<string, Play> = {
  "orgel-do": orgel(523.25),
  "orgel-mi": orgel(659.25),
  "orgel-sol": orgel(783.99),
  "orgel-hi": orgel(1046.5),
  chime: (ctx, out, at) => {
    // 풍경: 배음이 어긋난 사인 셋, 길게.
    [1318, 1781, 2637].forEach((hz, i) => tone(ctx, out, hz, at + i * 0.012, 2.2 - i * 0.4, 0.1 - i * 0.02, "sine"));
  },
  drop: (ctx, out, at) => glide(ctx, out, at, 0.14, 500, 1700, 0.28),
  toad: (ctx, out, at) => {
    glide(ctx, out, at, 0.12, 160, 95, 0.16, "square");
    glide(ctx, out, at + 0.16, 0.16, 150, 85, 0.16, "square");
  },
  rooster: (ctx, out, at) => {
    glide(ctx, out, at, 0.12, 520, 820, 0.1, "sawtooth");
    glide(ctx, out, at + 0.13, 0.1, 820, 980, 0.1, "sawtooth");
    glide(ctx, out, at + 0.24, 0.42, 1000, 640, 0.1, "sawtooth");
  },
  bird: (ctx, out, at) => {
    [0, 0.09, 0.2].forEach((d, i) => glide(ctx, out, at + d, 0.07, 2300 + i * 200, 3300 + i * 150, 0.12));
  },
  drum: (ctx, out, at) => thud(ctx, out, at, 1),
  xylo: (ctx, out, at) => {
    tone(ctx, out, 1046.5, at, 0.45, 0.22, "sine");
    tone(ctx, out, 4186, at, 0.08, 0.05, "sine");
  },
  "jam-pop": (ctx, out, at) => {
    noise(ctx, out, at, 0.03, 0.12, 4000);
    glide(ctx, out, at + 0.01, 0.1, 280, 950, 0.3);
  },
  "weed-pull": (ctx, out, at) => {
    noise(ctx, out, at, 0.22, 0.18, 1800);
    glide(ctx, out, at + 0.04, 0.2, 520, 180, 0.12, "triangle");
  },
  bell: (ctx, out, at) => {
    [0, 0.11, 0.22].forEach((d) => {
      tone(ctx, out, 2093, at + d, 0.25, 0.09, "square");
      tone(ctx, out, 2637, at + d + 0.04, 0.25, 0.06, "sine");
    });
  },
  cat: (ctx, out, at) => {
    glide(ctx, out, at, 0.18, 480, 820, 0.09, "sawtooth");
    glide(ctx, out, at + 0.18, 0.32, 820, 420, 0.09, "sawtooth");
  },
  clap: (ctx, out, at) => {
    noise(ctx, out, at, 0.08, 0.35, 3500);
    noise(ctx, out, at + 0.012, 0.06, 0.2, 2500);
  },
  spring: (ctx, out, at) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const wobble = ctx.createOscillator();
    const depth = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, at);
    osc.frequency.exponentialRampToValueAtTime(520, at + 0.5);
    wobble.frequency.value = 14;
    depth.gain.value = 60;
    wobble.connect(depth).connect(osc.frequency);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.linearRampToValueAtTime(0.2, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.6);
    osc.connect(gain).connect(out);
    osc.start(at);
    wobble.start(at);
    osc.stop(at + 0.65);
    wobble.stop(at + 0.65);
    osc.onended = () => {
      osc.disconnect();
      wobble.disconnect();
      depth.disconnect();
      gain.disconnect();
    };
  },
  sparkle: (ctx, out, at) => {
    [1568, 2093, 2637, 3136].forEach((hz, i) => tone(ctx, out, hz, at + i * 0.05, 0.35, 0.08, "triangle"));
  },
  bubble: (ctx, out, at) => {
    [0, 0.08, 0.19].forEach((d, i) => glide(ctx, out, at + d, 0.08, 380 + i * 90, 900 + i * 120, 0.18));
  },
  whistle: (ctx, out, at) => {
    glide(ctx, out, at, 0.18, 1200, 1700, 0.12);
    glide(ctx, out, at + 0.2, 0.3, 1700, 1300, 0.12);
  },
};

/** 들어 보기·누르기. 소리를 낼 수 없는 브라우저면 조용히 넘어간다(소리는 덤이다). */
export function playPreset(id: string, snap = true) {
  const a = keyAudio();
  const play = SYNTH[id];
  if (!a || !play) return;
  play(a.ctx, a.out, startAt(a.ctx, snap));
}

function startAt(ctx: Ctx, snap: boolean): number {
  const grid = snap ? musicGrid() : null;
  return grid ? snapTime(ctx.currentTime, grid.nextAt, grid.eighth) : ctx.currentTime + 0.005;
}

/**
 * 녹음 넷을 미리 받아 두고 트는 판. 키보드 시트를 열 때 만들고 닫을 때 버린다.
 * iOS는 사용자 터치 밖의 play()를 막기도 한다 — 첫 누름에서 넷을 소리 없이 한 번 틀어 풀어 둔다.
 */
export class ClipBank {
  private clips: Array<HTMLAudioElement | null> = [];
  private primed = false;

  load(urls: ReadonlyArray<string | null>) {
    this.clips = urls.map((url) => {
      if (!url) return null;
      const el = new Audio();
      el.preload = "auto";
      el.src = url;
      el.load();
      return el;
    });
  }

  /** 반드시 사용자 터치 안에서. except는 지금 틀려는 칸(그 칸은 진짜로 튼다). */
  prime(except = -1) {
    if (this.primed) return;
    this.primed = true;
    this.clips.forEach((el, i) => {
      if (!el || i === except) return;
      el.muted = true;
      void el
        .play()
        .then(() => {
          el.pause();
          el.currentTime = 0;
        })
        .catch(() => {})
        .finally(() => {
          el.muted = false;
        });
    });
  }

  has(slot: number): boolean {
    return Boolean(this.clips[slot]);
  }

  play(slot: number, delayMs: number) {
    const el = this.clips[slot];
    if (!el) return;
    const go = () => {
      // 아직 울리는 중이면 겹쳐 튼다(빠르게 연타).
      const target = el.paused || el.ended ? el : (el.cloneNode(true) as HTMLAudioElement);
      target.currentTime = 0;
      void target.play().catch(() => {});
    };
    if (delayMs > 4) setTimeout(go, delayMs);
    else go();
  }

  dispose() {
    for (const el of this.clips) {
      if (!el) continue;
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    this.clips = [];
  }
}

/** 키 하나를 누른다. 녹음 키는 bank에서, 나머지는 그 자리에서 만든다. 어떤 소리였는지 돌려준다. */
export function pressKey(key: RoomKey, slot: number, bank: ClipBank | null): "preset" | "rec" | null {
  if (key.sound === REC) {
    if (!bank?.has(slot)) return null;
    bank.prime(slot);
    const a = keyAudio();
    const delay = a ? Math.max(0, (startAt(a.ctx, true) - a.ctx.currentTime) * 1000) : 0;
    bank.play(slot, delay);
    return "rec";
  }
  if (!SYNTH[key.sound]) return null;
  bank?.prime();
  playPreset(key.sound);
  return "preset";
}
