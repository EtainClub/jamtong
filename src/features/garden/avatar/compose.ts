import { CLOTHS, FIXED, HAIR_COLORS, pick, SKINS, type Tone } from "./palette";
import { wearOf, type Wear } from "./catalog";
import {
  FACE_INK, GRID_H, GRID_W, HEAD, HI_BLUSH, HI_CHEEKS, HI_EYE_MOODS, HI_EYES, HI_MOUTHS, POSES, ZZZ,
  type EyeMood, type HiMark, type MouthMood, type Pose, type Sprite,
} from "./sprites";

/**
 * 꼬마 그리기 — 부위를 겹쳐 색 격자로, 같은 색 가로 줄을 사각형 하나로. DOM 없는 순수 함수라
 * 공유 카드(`/api/garden-card`)도 같은 것을 쓴다. 설계는 docs/garden-avatar.md §3.2.
 *
 * ★ 두 단계로 그린다. 부위 그림(20×24)을 겹친 밑그림을 두 배(40×48)로 키우며 다듬는다 —
 *   ① Scale2x로 대각선을 둥글게 ② 덩어리 아래·오른쪽 가장자리에 그늘, 머리카락·옷 윗가장자리에 빛
 *   ③ 두 겹이 된 먹선의 안쪽 겹을 그 덩어리의 짙은 색으로(색 외곽선) ④ 눈·입·볼은 두 배 판에 따로 그린다.
 *   그래서 옷 한 벌 = 몸통 그림 한 장은 그대로이고, 그림이 늘지 않아도 모든 옷이 같이 고와진다.
 */

/** 두 배 판의 크기(1칸 = 1px). */
export const HI_W = GRID_W * 2;
export const HI_H = GRID_H * 2;

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
/** 밑그림 칸마다 그 칸을 마지막으로 칠한 부위. 얼굴은 "head"로 남은 칸에만 그린다(머리카락·안경 아래로 숨는다). */
type Layers = Array<Array<string | null>>;

function cloth(w: Wear | undefined, tint: number | undefined): Tone {
  return pick(CLOTHS, w?.tint && tint !== undefined ? tint : w?.color ?? 0);
}

function paint(grid: Grid, layers: Layers, layer: string, s: Sprite, dy: number, colors: Readonly<Record<string, string>>) {
  s.rows.forEach((row, j) => {
    const y = s.y + j + dy;
    if (y < 0 || y >= GRID_H) return;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      const x = s.x + i;
      if (ch === "." || x < 0 || x >= GRID_W) continue;
      const c = colors[ch] ?? FIXED[ch];
      if (c) {
        grid[y][x] = c;
        layers[y][x] = layer === "head" && ch !== "s" ? "head-edge" : layer;
      }
    }
  });
}

const blank = <T,>(w: number, h: number) => Array.from({ length: h }, () => Array<T | null>(w).fill(null));

/** 밑그림(20×24)과 그 위에 두 배로 그릴 것들. */
function base(look: Look, pose: Pose, face: Face) {
  const grid: Grid = blank<string>(GRID_W, GRID_H);
  const layers: Layers = blank<string>(GRID_W, GRID_H);
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

  const hairTones = { h: hair, H: hairD };
  const p = (layer: string, sp: Sprite, dy: number, colors: Readonly<Record<string, string>>) => paint(grid, layers, layer, sp, dy, colors);
  if (showHair && hairW?.back) p("hair", hairW.back, spec.dy, hairTones);
  p("body", spec.body, 0, body);
  if (spec.standing && bottomW?.front) p("bottom", bottomW.front, 0, { ...body, ...acc(bottomW) });
  if (spec.standing && shoesW?.front) p("shoes", shoesW.front, 0, { ...body, ...acc(shoesW) });
  p("head", HEAD, spec.dy, body);
  if (topW?.front) p("top", topW.front, spec.dy, { ...body, ...acc(topW) });
  if (showHair && hairW?.front) p("hair", hairW.front, spec.dy, hairTones);
  if (hatW?.front) p("hat", hatW.front, spec.dy, { ...body, ...acc(hatW) });
  if (faceW?.front) p("face", faceW.front, spec.dy, { ...body, ...acc(faceW) });
  if (spec.front) p("arm", spec.front, 0, body);
  if (spec.hand && heldW?.held) {
    p("held", { x: spec.hand.x + heldW.held.dx, y: spec.hand.y + heldW.held.dy, rows: heldW.held.rows }, 0, { ...body, ...acc(heldW) });
  }
  if (face.zzz) p("zzz", ZZZ, 0, body);

  // 바탕색 → 그늘색. 이 꼬마의 두 톤 짝과 FIXED의 짝. 짝이 없는 색은 먹색 쪽으로 섞는다.
  const pairs: Array<[string, string]> = [
    [skin, skinD], [hair, hairD], [a, A], [b, B], [f, F],
    [FIXED.y, FIXED.Y], [FIXED.g, FIXED.G], [FIXED.l, FIXED.L], [FIXED.d, FIXED.D], [FIXED.E, FIXED.e], [FIXED.w, FIXED.E],
  ];
  for (const w of [topW, bottomW, shoesW, hatW, faceW, heldW]) if (w?.accent) pairs.push([w.accent[0], w.accent[1]]);
  const shade = new Map<string, string>();
  for (const [lite, dark] of pairs) if (!shade.has(lite)) shade.set(lite, dark);
  return { grid, layers, dy: spec.dy, skin, skinD, hair, hairD, shade };
}

// ── 두 배로 다듬기 ───────────────────────────────────────────────────

function hex(c: string): [number, number, number] {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** a와 b를 t만큼 섞은 색. */
function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${m(r1, r2)}${m(g1, g2)}${m(b1, b2)}`;
}

const INK = FIXED.o;
const EYE_INK = FIXED.k;

/** Scale2x(EPX) — 한 칸을 넷으로 나누되 이웃이 같으면 모서리를 이웃 색으로. 계단이 대각선이 된다. */
function scale2x(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= W || y >= H ? null : grid[y][x]);
  const out: Grid = blank<string>(W * 2, H * 2);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const P = grid[y][x];
      const A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
      let e0 = P, e1 = P, e2 = P, e3 = P;
      // 빈 칸을 채우는 쪽으로만 둥글린다 — 이웃 색이 빈 칸을 먹어 들어가면 꼬마가 뚱뚱해진다.
      if (C === A && C !== D && A !== B && (P !== null || C === INK)) e0 = A;
      if (A === B && A !== C && B !== D && (P !== null || A === INK)) e1 = B;
      if (D === C && D !== B && C !== A && (P !== null || D === INK)) e2 = C;
      if (B === D && B !== A && D !== C && (P !== null || B === INK)) e3 = D;
      out[y * 2][x * 2] = e0;
      out[y * 2][x * 2 + 1] = e1;
      out[y * 2 + 1][x * 2] = e2;
      out[y * 2 + 1][x * 2 + 1] = e3;
    }
  }
  return out;
}

function stamp(grid: Grid, mask: (x: number, y: number) => boolean, mark: HiMark, dy: number) {
  mark.rows.forEach((row, j) => {
    const y = mark.y + j + dy;
    for (let i = 0; i < row.length; i++) {
      const c = FACE_INK[row[i]];
      const x = mark.x + i;
      if (!c || y < 0 || y >= grid.length || x < 0 || x >= grid[0].length || !mask(x, y)) continue;
      grid[y][x] = c;
    }
  });
}

/** 꼬마 한 장의 색 격자(40×48). 표에 없는 id는 이미 rules.ts가 걸렀다고 보지만, 없으면 그 부위를 빼고 그린다. */
export function avatarGrid(look: Look, pose: Pose, face: Face): Grid {
  const lo = base(look, pose, face);
  const g0 = scale2x(lo.grid);
  const H = g0.length;
  const W = g0[0].length;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= W || y >= H ? null : g0[y][x]);
  const isMat = (c: string | null): c is string => c !== null && c !== INK && c !== EYE_INK;
  const out: Grid = g0.map((row) => [...row]);
  const lit = new Set([lo.hair, ...[...lo.shade.keys()].filter((c) => c !== lo.skin)]);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = g0[y][x];
      if (c === INK) {
        // ③ 먹선 안쪽 겹 → 붙은 덩어리의 짙은 색. 아래·위·옆 순서로 먼저 닿는 덩어리.
        const n = [at(x, y + 1), at(x, y - 1), at(x - 1, y), at(x + 1, y)].find(isMat);
        if (n) out[y][x] = mix(lo.shade.get(n) ?? n, INK, 0.5);
        continue;
      }
      if (!isMat(c)) continue;
      const dark = lo.shade.get(c) ?? mix(c, INK, 0.35);
      const up = at(x, y - 1), down = at(x, y + 1), right = at(x + 1, y);
      // ② 그늘: 아래·오른쪽 가장자리. 머리카락이 드리운 이마 그늘.
      if (down !== c || right !== c) out[y][x] = mix(c, dark, 0.55);
      else if (c === lo.skin && (up === lo.hair || up === lo.hairD)) out[y][x] = mix(c, dark, 0.6);
      else if (up !== c && lit.has(c)) out[y][x] = mix(c, "#ffffff", 0.45);
    }
  }

  // 머리카락 윤기 — 정수리 왼쪽에 짧은 활 모양 빛(⌒). 열마다 위에서 처음 만나는 머리카락에서 두 칸 아래.
  for (let x = 10; x <= 19; x++) {
    let top = -1;
    for (let y = 0; y < 14; y++) {
      const c = g0[y][x];
      if (c === lo.hair || c === lo.hairD) { top = y; break; }
    }
    if (top < 0) continue;
    const rows = x >= 12 && x <= 17 ? [top + 2, top + 3] : [top + 3];
    for (const y of rows) if (g0[y]?.[x] === lo.hair && lo.layers[y >> 1][x >> 1] === "hair") out[y][x] = mix(lo.hair, "#ffffff", 0.5);
  }

  // ④ 얼굴 — 밑그림에서 아직 얼굴(head)인 칸에만.
  const dy = lo.dy * 2;
  const onFace = (x: number, y: number) => lo.layers[y >> 1]?.[x >> 1] === "head";
  const eyes = face.eyes === "open" ? HI_EYES[look.eyes] ?? HI_EYES.dot : HI_EYE_MOODS[face.eyes];
  for (const m of face.blush ? HI_BLUSH : HI_CHEEKS) stamp(out, onFace, m, dy);
  for (const m of eyes) stamp(out, onFace, m, dy);
  for (const m of HI_MOUTHS[face.mouth]) stamp(out, onFace, m, dy);
  return out;
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

/** 사각형을 색마다 path 하나로 [색, d]. 두 배 판의 1칸 = 1px(AVATAR_W×AVATAR_H = HI_W×HI_H). */
export function colorPaths(rects: readonly Rect[]): Array<[string, string]> {
  const by = new Map<string, string[]>();
  for (const r of rects) {
    const list = by.get(r.fill) ?? [];
    list.push(`M${r.x} ${r.y}h${r.w}v1h-${r.w}z`);
    by.set(r.fill, list);
  }
  return [...by].map(([fill, d]) => [fill, d.join("")]);
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
