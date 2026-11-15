import { CLOTHS, FIXED, HAIR_COLORS, pick, SKINS, type Tone } from "./palette";
import { wearOf, type Wear } from "./catalog";
import {
  BLUSH, CHEEKS, EYE_MOODS, EYE_STYLES, GRID_H, GRID_W, HEAD, MOUTHS, POSES, ZZZ,
  type EyeMood, type MouthMood, type Pose, type Px, type Sprite,
} from "./sprites";

/**
 * 꼬마 그리기 — 부위를 겹쳐 색 격자로, 같은 색 가로 줄을 사각형 하나로. DOM 없는 순수 함수라
 * 공유 카드(`/api/garden-card`)도 같은 것을 쓴다. 설계는 docs/garden-avatar.md §3.2.
 */

export interface Look {
  skin: number;
  hairColor: number;
  hair: string;
  eyes: string;
  top: string;
  bottom: string;
  shoes: string;
  hat?: string;
  face?: string;
  held?: string;
  /** 색 고르기가 되는 옷의 색 번호. */
  tint?: Partial<Record<"top" | "bottom" | "shoes", number>>;
  bubble?: string;
}

export interface Face {
  eyes: EyeMood;
  mouth: MouthMood;
  blush?: boolean;
  zzz?: boolean;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  fill: string;
}

type Grid = Array<Array<string | null>>;

function cloth(w: Wear | undefined, tint: number | undefined): Tone {
  return pick(CLOTHS, w?.tint && tint !== undefined ? tint : w?.color ?? 0);
}

function paint(grid: Grid, s: Sprite, dy: number, colors: Readonly<Record<string, string>>) {
  s.rows.forEach((row, j) => {
    const y = s.y + j + dy;
    if (y < 0 || y >= GRID_H) return;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      const x = s.x + i;
      if (ch === "." || x < 0 || x >= GRID_W) continue;
      const c = colors[ch] ?? FIXED[ch];
      if (c) grid[y][x] = c;
    }
  });
}

function dots(grid: Grid, px: readonly Px[], dy: number, colors: Readonly<Record<string, string>>) {
  for (const [x, y, ch] of px) {
    const c = colors[ch] ?? FIXED[ch];
    if (c && y + dy >= 0 && y + dy < GRID_H) grid[y + dy][x] = c;
  }
}

/** 꼬마 한 장의 색 격자. 표에 없는 id는 이미 rules.ts가 걸렀다고 보지만, 없으면 그 부위를 빼고 그린다. */
export function avatarGrid(look: Look, pose: Pose, face: Face): Grid {
  const grid: Grid = Array.from({ length: GRID_H }, () => Array<string | null>(GRID_W).fill(null));
  const spec = POSES[pose];
  const [skin, skinD] = pick(SKINS, look.skin);
  const [hair, hairD] = pick(HAIR_COLORS, look.hairColor);
  const hairW = wearOf("hair", look.hair);
  const topW = wearOf("top", look.top);
  const bottomW = wearOf("bottom", look.bottom);
  const shoesW = wearOf("shoes", look.shoes);
  const hatW = wearOf("hat", look.hat);
  const faceW = wearOf("face", look.face);
  const heldW = wearOf("held", look.held);
  const [a, A] = cloth(topW, look.tint?.top);
  const [b, B] = cloth(bottomW, look.tint?.bottom);
  const [f, F] = cloth(shoesW, look.tint?.shoes);
  const body = { s: skin, S: skinD, a, A, b, B, f, F };
  const acc = (w: Wear | undefined): Record<string, string> => (w?.accent ? { c: w.accent[0], C: w.accent[1] } : {});
  const showHair = !hatW?.hideHair;

  if (showHair && hairW?.back) paint(grid, hairW.back, spec.dy, { h: hair, H: hairD });
  paint(grid, spec.body, 0, body);
  if (spec.standing && bottomW?.front) paint(grid, bottomW.front, 0, { ...body, ...acc(bottomW) });
  if (spec.standing && shoesW?.front) paint(grid, shoesW.front, 0, { ...body, ...acc(shoesW) });
  paint(grid, HEAD, spec.dy, body);
  if (topW?.front) paint(grid, topW.front, spec.dy, { ...body, ...acc(topW) });
  const eyes = face.eyes === "open" ? EYE_STYLES[look.eyes] ?? EYE_STYLES.dot : EYE_MOODS[face.eyes];
  dots(grid, eyes, spec.dy, body);
  dots(grid, MOUTHS[face.mouth], spec.dy, body);
  dots(grid, face.blush ? BLUSH : CHEEKS, spec.dy, body);
  if (showHair && hairW?.front) paint(grid, hairW.front, spec.dy, { h: hair, H: hairD });
  if (hatW?.front) paint(grid, hatW.front, spec.dy, { ...body, ...acc(hatW) });
  if (faceW?.front) paint(grid, faceW.front, spec.dy, { ...body, ...acc(faceW) });
  if (spec.front) paint(grid, spec.front, 0, body);
  if (spec.hand && heldW?.held) {
    paint(grid, { x: spec.hand.x + heldW.held.dx, y: spec.hand.y + heldW.held.dy, rows: heldW.held.rows }, 0, { ...body, ...acc(heldW) });
  }
  if (face.zzz) paint(grid, ZZZ, 0, body);
  return grid;
}

/** 같은 색이 이어지는 가로 줄을 사각형 하나로. 공유 카드가 사각형 수백 개에 느려지지 않게. */
export function gridRects(grid: Grid): Rect[] {
  const out: Rect[] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (!c) { x++; continue; }
      let w = 1;
      while (x + w < row.length && row[x + w] === c) w++;
      out.push({ x, y, w, fill: c });
      x += w;
    }
  });
  return out;
}

export function avatarRects(look: Look, pose: Pose, face: Face): Rect[] {
  return gridRects(avatarGrid(look, pose, face));
}

/** b에서 a와 다른 칸만(눈 깜빡임 장). 겹쳐 그리면 b가 된다. */
export function avatarDiffRects(look: Look, pose: Pose, a: Face, b: Face): Rect[] {
  const ga = avatarGrid(look, pose, a);
  const gb = avatarGrid(look, pose, b);
  return gridRects(gb.map((row, y) => row.map((c, x) => (c !== ga[y][x] ? c : null))));
}
