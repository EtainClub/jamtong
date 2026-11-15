/**
 * 꼬마의 몸 — 자세별 몸 그림, 머리, 눈·입. 설계는 docs/garden-avatar.md §3·§4.
 *
 * ★ 판은 20×24 도트(1도트 = 2px → 40×48px). 맨 위 두 줄은 모자·머리카락 자리다.
 * ★ 머리는 x3–16, y2–12(너비 14). 몸통은 x6–13, y13–18. 다리·신발은 y19–23.
 * ★ 몸 그림의 a·A는 윗옷 색, b·B는 아랫옷 색, f·F는 신발 색, s·S는 피부색이다.
 *   그래서 소매·바지·신발은 옷 그림 없이도 옷 색을 입는다 — 옷 한 벌 = 몸통 그림 한 장.
 * ★ 그림 글자의 뜻은 palette.ts의 FIXED와 compose.ts의 색 칸이다. '.'은 비운다(아래 것이 보인다).
 */

export const GRID_W = 20;
export const GRID_H = 24;
/** 1도트의 크기(px). 방 칸은 40px이다. */
export const DOT = 2;

export interface Sprite {
  x: number;
  y: number;
  rows: readonly string[];
}

export type Pose = "stand" | "walk" | "wave" | "sit" | "sleep" | "play";

export interface PoseSpec {
  body: Sprite;
  /** 머리·윗옷·얼굴·모자를 아래로 내리는 줄 수(앉으면 3). */
  dy: number;
  /** 서 있는 자세 — 아랫옷·신발 그림을 그린다. 앉으면 몸 그림의 색만. */
  standing: boolean;
  /** 손에 든 것을 그릴 손의 자리. 없으면 그리지 않는다. */
  hand: { x: number; y: number } | null;
  /** 윗옷 위에 그리는 팔(연주). */
  front?: Sprite;
}

const STAND_TORSO = [
  "..oaaaaaao..",
  ".oaaaaaaaao.",
  "oaoaaaaaaoao",
  "oaoaaaaaaoao",
  "osoaaaaaaoso",
  ".ooaaaaaaoo.",
];
const STAND_LEGS = [
  "..obbbbbbo..",
  "..obbbbbbo..",
  "..obboobbo..",
  ".offfoofffo.",
  ".oooooooooo.",
];
const SIT = [
  "............",
  "............",
  "............",
  ...STAND_TORSO,
  "obbbbbbbbbbo",
  "offfo..offfo",
];

export const POSES: Record<Pose, PoseSpec> = {
  stand: { body: { x: 4, y: 13, rows: [...STAND_TORSO, ...STAND_LEGS] }, dy: 0, standing: true, hand: { x: 14, y: 17 } },
  // 걷기는 서기 그림 그대로 — 통통 튀는 것은 CSS가 한다. 다리를 벌린 그림은 신발·치마 그림과 어긋난다.
  walk: { body: { x: 4, y: 13, rows: [...STAND_TORSO, ...STAND_LEGS] }, dy: 0, standing: true, hand: { x: 14, y: 17 } },
  wave: {
    body: {
      x: 4,
      y: 13,
      rows: ["..oaaaaaaoso", ".oaaaaaaaaao", "oaoaaaaaao..", "oaoaaaaaao..", "osoaaaaaao..", ".ooaaaaaaoo.", ...STAND_LEGS],
    },
    dy: 0,
    standing: true,
    hand: { x: 14, y: 13 },
  },
  sit: { body: { x: 4, y: 13, rows: SIT }, dy: 3, standing: false, hand: { x: 14, y: 20 } },
  sleep: { body: { x: 4, y: 13, rows: SIT }, dy: 3, standing: false, hand: null },
  play: {
    body: { x: 4, y: 13, rows: ["..oaaaaaao..", ".oaaaaaaaao.", "..oaaaaaao..", "..oaaaaaao..", "..oaaaaaao..", "..oaaaaaao..", ...STAND_LEGS] },
    dy: 0,
    standing: true,
    hand: null,
    front: { x: 4, y: 15, rows: [".ooo....ooo.", "oaaso..osaao", ".oooo..oooo."] },
  },
};

export const HEAD: Sprite = {
  x: 3,
  y: 2,
  rows: [
    "...oooooooo...",
    ".oossssssssoo.",
    "osssssssssssso",
    "osssssssssssso",
    "osssssssssssso",
    "osssssssssssso",
    "osssssssssssso",
    "osssssssssssso",
    ".osssssssssso.",
    "..oossssssoo..",
    "....oooooo....",
  ],
};

/** 자는 꼬마의 z. */
export const ZZZ: Sprite = { x: 15, y: 0, rows: ["oooo", "..o.", ".o..", "oooo"] };

// ── 눈·입 — 점 몇 개라 그림 대신 좌표로 둔다 ─────────────────────────

export type Px = readonly [x: number, y: number, ch: string];

/** 눈 모양 넷(기본 눈). 왼눈 x6–7, 오른눈 x12–13, y7–8. */
export const EYE_STYLES: Record<string, readonly Px[]> = {
  dot: [[7, 7, "k"], [7, 8, "k"], [12, 7, "k"], [12, 8, "k"]],
  round: [[6, 7, "k"], [7, 7, "w"], [6, 8, "k"], [7, 8, "k"], [12, 7, "k"], [13, 7, "w"], [12, 8, "k"], [13, 8, "k"]],
  lash: [[5, 7, "k"], [6, 7, "k"], [7, 7, "w"], [6, 8, "k"], [7, 8, "k"], [12, 7, "k"], [13, 7, "w"], [14, 7, "k"], [12, 8, "k"], [13, 8, "k"]],
  tall: [[7, 6, "k"], [7, 7, "k"], [7, 8, "k"], [12, 6, "k"], [12, 7, "k"], [12, 8, "k"]],
};

export type EyeMood = "open" | "closed" | "smile" | "sparkle";
export type MouthMood = "smile" | "grin" | "flat" | "o" | "open" | "frown";

/** 기분이 바꾸는 눈. open은 고른 눈 모양을 그대로 쓴다. */
export const EYE_MOODS: Record<Exclude<EyeMood, "open">, readonly Px[]> = {
  closed: [[6, 8, "k"], [7, 8, "k"], [12, 8, "k"], [13, 8, "k"]],
  smile: [[6, 8, "k"], [7, 7, "k"], [8, 8, "k"], [11, 8, "k"], [12, 7, "k"], [13, 8, "k"]],
  sparkle: [[6, 6, "k"], [7, 6, "k"], [6, 7, "k"], [7, 7, "w"], [6, 8, "k"], [7, 8, "k"], [12, 6, "k"], [13, 6, "k"], [12, 7, "w"], [13, 7, "k"], [12, 8, "k"], [13, 8, "k"]],
};

export const MOUTHS: Record<MouthMood, readonly Px[]> = {
  smile: [[8, 9, "k"], [9, 10, "k"], [10, 10, "k"], [11, 9, "k"]],
  grin: [[8, 9, "k"], [9, 9, "k"], [10, 9, "k"], [11, 9, "k"], [9, 10, "r"], [10, 10, "r"]],
  flat: [[9, 10, "k"], [10, 10, "k"]],
  o: [[9, 9, "k"], [10, 9, "k"], [9, 10, "k"], [10, 10, "k"]],
  open: [[8, 9, "k"], [9, 9, "r"], [10, 9, "r"], [11, 9, "k"], [9, 10, "r"], [10, 10, "r"]],
  frown: [[8, 10, "k"], [9, 9, "k"], [10, 9, "k"], [11, 10, "k"]],
};

export const CHEEKS: readonly Px[] = [[5, 9, "p"], [14, 9, "p"]];
export const BLUSH: readonly Px[] = [[4, 9, "p"], [5, 9, "p"], [14, 9, "p"], [15, 9, "p"]];
