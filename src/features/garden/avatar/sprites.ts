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

// ── 눈·입·볼 — 두 배 판(40×48, 1칸 = 1px)에 바로 그린다 ─────────────────
// 얼굴은 밑그림의 머리 판보다 섬세해야 한다. 좌표는 두 배 판, 머리 기준(앉으면 dy×2만큼 내린다).
// 얼굴 살결은 x8–31, 가운데는 x19.5. 왼눈 x12–15, 오른눈 x24–27, 입 y18–21.

/** 두 배 판에 찍는 작은 그림. 글자는 FACE_INK. '.'은 비운다. */
export interface HiMark {
  x: number;
  y: number;
  rows: readonly string[];
}

export const FACE_INK: Readonly<Record<string, string>> = {
  k: "#2a211d", // 눈동자
  i: "#6b4636", // 눈동자 아래 밤색
  w: "#ffffff", // 눈의 빛
  m: "#9c3f33", // 입
  t: "#f08a80", // 혀·입 안
  p: "#ffa9bb", // 볼
  q: "#ffc8d3", // 볼 가장자리
};

/** 같은 그림을 두 눈에(오른눈은 12칸 오른쪽). 빛은 두 눈 모두 왼쪽 위. */
const pair = (x: number, y: number, rows: readonly string[]): HiMark[] => [{ x, y, rows }, { x: x + 12, y, rows }];

export type EyeMood = "open" | "closed" | "smile" | "sparkle";
export type MouthMood = "smile" | "grin" | "flat" | "o" | "open" | "frown";

/** 눈 모양 넷(기본 눈). */
export const HI_EYES: Record<string, readonly HiMark[]> = {
  dot: pair(13, 14, ["kk", "kk", "kk"]),
  round: pair(12, 13, [".kk.", "kwkk", "kiik", ".kk."]),
  lash: [
    { x: 11, y: 13, rows: ["k.kk.", ".kwkk", "..iik", "..kk."] },
    { x: 24, y: 13, rows: [".kk.k", "kwkk.", "kiik.", ".kk.."] },
  ],
  tall: pair(13, 12, ["kk", "wk", "kk", "kk", "ik"]),
};

/** 기분이 바꾸는 눈. open은 고른 눈 모양을 그대로 쓴다. */
export const HI_EYE_MOODS: Record<Exclude<EyeMood, "open">, readonly HiMark[]> = {
  closed: pair(12, 15, ["k..k", ".kk."]),
  smile: pair(12, 14, [".kk.", "k..k"]),
  sparkle: pair(12, 12, [".kk.", "kwkk", "kkwk", "kiik", ".kk."]),
};

export const HI_MOUTHS: Record<MouthMood, readonly HiMark[]> = {
  smile: [{ x: 18, y: 19, rows: ["m..m", ".mm."] }],
  grin: [{ x: 18, y: 18, rows: ["mmmm", "mttm", ".mm."] }],
  flat: [{ x: 19, y: 20, rows: ["mm"] }],
  o: [{ x: 18, y: 18, rows: [".mm.", "mttm", ".mm."] }],
  open: [{ x: 18, y: 18, rows: ["mmmm", "mttm", "mttm", ".mm."] }],
  frown: [{ x: 18, y: 19, rows: [".mm.", "m..m"] }],
};

export const HI_CHEEKS: readonly HiMark[] = [{ x: 9, y: 18, rows: ["qpq"] }, { x: 28, y: 18, rows: ["qpq"] }];
export const HI_BLUSH: readonly HiMark[] = [{ x: 8, y: 17, rows: ["qppq", "qppq"] }, { x: 28, y: 17, rows: ["qppq", "qppq"] }];
