import type { ReactNode } from "react";

import type { RaidForm } from "../forms";

/**
 * 보스 그림의 부품 — 여섯 종류가 함께 쓰는 도형(docs/garden-raid-boss.md §2.2).
 *
 * 그림판은 240×240, 땅은 y=214, 가운데는 x=120이다. 3형은 그림판 밖으로 뻗어도 된다(svg가 넘침을 보인다).
 * 빛은 필터 없이 그라데이션으로만 낸다 — 블러 필터는 저가 폰에서 프레임을 떨어뜨린다.
 * 유혈 표현은 그리지 않는다. 맞은 자국은 갑옷 금·불씨·수액 빛으로 그린다.
 */

/** 한 형태의 겹. 뒤에서 앞으로: aura → back → body → armor → head → front. 겹마다 CSS가 따로 움직인다. */
export interface BossLayers {
  aura: ReactNode;
  back?: ReactNode;
  body: ReactNode;
  armor?: ReactNode;
  head: ReactNode;
  front?: ReactNode;
}

/** 그라데이션 참조. 그림판마다 id가 달라서(한 화면에 여럿) 리그가 만들어 건넨다. */
export interface Paint {
  /** 몸 — 위는 밝고 아래는 어둡다. */
  body: string;
  /** 오라 — 가운데가 빛나고 가장자리는 투명하다. */
  aura: string;
  /** 눈빛·불씨의 번짐. */
  glow: string;
  /** 금속(갑옷·왕관). */
  metal: string;
}

export interface Palette {
  /** 몸의 밝은 쪽 / 어두운 쪽. */
  body: [string, string];
  /** 테두리. */
  line: string;
  /** 오라와 눈빛. */
  glow: string;
  /** 금속의 밝은 쪽 / 어두운 쪽. */
  metal: [string, string];
}

export type BossDraw = (form: RaidForm, paint: Paint, pal: Palette) => BossLayers;

const f = (n: number) => n.toFixed(1);

/** 별 모양(가시 몸). rot은 도. */
export function star(cx: number, cy: number, inner: number, outer: number, n: number, rot = 0): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / n - Math.PI / 2 + (rot * Math.PI) / 180;
    pts.push(`${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`);
  }
  return `M${pts.join("L")}Z`;
}

/** (x, y)에서 deg 쪽으로 뻗는 가시 하나. */
export function thorn(x: number, y: number, deg: number, len: number, width: number): string {
  const a = (deg * Math.PI) / 180;
  const px = Math.cos(a + Math.PI / 2) * (width / 2);
  const py = Math.sin(a + Math.PI / 2) * (width / 2);
  return `M${f(x + px)} ${f(y + py)}L${f(x + Math.cos(a) * len)} ${f(y + Math.sin(a) * len)}L${f(x - px)} ${f(y - py)}Z`;
}

/** 땅 그림자와 뿌리. */
export function Ground({ line, wide = 62 }: { line: string; wide?: number }) {
  return (
    <>
      <ellipse cx="120" cy="216" rx={wide} ry="9" fill="#000" opacity=".4" />
      <path d="M96 204 78 222 98 214 106 226 116 212 124 228 132 212 142 226 148 214 164 222 144 204Z" fill="#3b2a1c" stroke={line} strokeWidth="2" strokeLinejoin="round" />
    </>
  );
}

/** 뒤의 빛. rays는 뻗는 빛살 수(0이면 없음), rune은 문양 고리. */
export function Aura({ paint, glow, r, cy = 120, rays = 0, rune = false }: { paint: Paint; glow: string; r: number; cy?: number; rays?: number; rune?: boolean }) {
  return (
    <>
      <circle cx="120" cy={cy} r={r} fill={paint.aura} />
      {rays > 0 && <path className="boss-rays" d={star(120, cy, r * 0.42, r * 1.08, rays)} fill={glow} opacity=".16" />}
      {rune && (
        <g className="boss-rune" fill="none" stroke={glow} opacity=".55">
          <circle cx="120" cy={cy} r={r * 0.78} strokeWidth="1.6" strokeDasharray="2 7" />
          <circle cx="120" cy={cy} r={r * 0.9} strokeWidth="2.4" strokeDasharray="18 6 3 6" />
        </g>
      )}
    </>
  );
}

/**
 * 빛나는 눈 한 쌍. (x, y)가 두 눈의 가운데, gap은 눈 사이, tilt는 안쪽으로 내리꽂는 기울기(도).
 * 눈동자 없이 빛만 있다 — 얼굴이 아니라 눈빛이다.
 */
export function Eyes({ x, y, gap = 16, w = 12, h = 6, tilt = 18, color, paint, core = "#fff" }: { x: number; y: number; gap?: number; w?: number; h?: number; tilt?: number; color: string; paint: Paint; core?: string }) {
  const eye = (side: -1 | 1) => (
    <g transform={`translate(${x + (side * gap) / 2} ${y}) rotate(${side * tilt})`}>
      <circle r={w} fill={paint.glow} />
      <path d={`M${-w / 2} 0Q0 ${-h} ${w / 2} 0Q0 ${h * 0.7} ${-w / 2} 0Z`} fill={color} stroke="#12060a" strokeWidth="1.2" />
      <path d={`M${-w / 4} 0Q0 ${-h / 2.4} ${w / 4} 0Q0 ${h / 3} ${-w / 4} 0Z`} fill={core} />
    </g>
  );
  return (
    <g className="boss-eyes">
      {eye(-1)}
      {eye(1)}
    </g>
  );
}

/** 이빨 드러낸 입. (x, y)는 윗입술 가운데. */
export function Maw({ x, y, w, h, teeth = 5, glow }: { x: number; y: number; w: number; h: number; teeth?: number; glow?: string }) {
  const top: string[] = [];
  const bottom: string[] = [];
  const step = w / teeth;
  for (let i = 0; i < teeth; i++) {
    const x0 = x - w / 2 + i * step;
    top.push(`M${f(x0)} ${f(y + 1)}l${f(step / 2)} ${f(h * 0.55)} ${f(step / 2)} ${f(-h * 0.55)}Z`);
    bottom.push(`M${f(x0 + step / 2)} ${f(y + h - 1)}l${f(step / 2)} ${f(-h * 0.5)} ${f(step / 2)} ${f(h * 0.5)}Z`);
  }
  return (
    <g>
      <path d={`M${x - w / 2} ${y}Q${x} ${y - h * 0.25} ${x + w / 2} ${y}Q${x + w * 0.42} ${y + h * 1.15} ${x} ${y + h}Q${x - w * 0.42} ${y + h * 1.15} ${x - w / 2} ${y}Z`} fill="#1a070b" stroke="#000" strokeWidth="1.4" />
      {glow && <ellipse cx={x} cy={y + h * 0.62} rx={w * 0.26} ry={h * 0.26} fill={glow} opacity=".75" />}
      <path d={top.join("") + bottom.slice(0, -1).join("")} fill="#f4ecd8" stroke="#3a2a1a" strokeWidth=".6" />
    </g>
  );
}

/** 굵은 덩굴 한 줄. 어두운 테두리 · 몸 · 밝은 줄. */
export function Tendril({ d, width = 9, color, line, light }: { d: string; width?: number; color: string; line: string; light: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={line} strokeWidth={width + 3.5} />
      <path d={d} stroke={color} strokeWidth={width} />
      <path d={d} stroke={light} strokeWidth={Math.max(1.4, width / 4)} opacity=".6" />
    </g>
  );
}

/** 금속 판 하나. 위쪽 모서리에 빛이 걸린다. */
export function Plate({ d, paint, line = "#2a1c08", shine = true }: { d: string; paint: Paint; line?: string; shine?: boolean }) {
  return (
    <>
      <path d={d} fill={paint.metal} stroke={line} strokeWidth="2" strokeLinejoin="round" />
      {shine && <path d={d} fill="none" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" strokeDasharray="14 400" opacity=".7" />}
    </>
  );
}

/** 왕관. (x, y)는 아래 가운데. */
export function Crown({ x, y, w, h, paint, gem }: { x: number; y: number; w: number; h: number; paint: Paint; gem: string }) {
  const l = x - w / 2;
  const d = `M${l} ${y}L${l - w * 0.06} ${y - h * 0.72}L${l + w * 0.2} ${y - h * 0.36}L${l + w * 0.32} ${y - h * 0.92}L${x} ${y - h * 0.42}L${l + w * 0.68} ${y - h * 0.92}L${l + w * 0.8} ${y - h * 0.36}L${l + w * 1.06} ${y - h * 0.72}L${l + w} ${y}Z`;
  return (
    <g>
      <Plate d={d} paint={paint} />
      <path d={`M${l} ${y - h * 0.12}H${l + w}`} stroke="#2a1c08" strokeWidth="1.4" opacity=".6" />
      {[0.32, 0.68].map((t) => (
        <circle key={t} cx={l + w * t} cy={y - h * 0.92} r={h * 0.09} fill={gem} stroke="#2a1c08" strokeWidth="1" />
      ))}
      <path d={`M${x} ${y - h * 0.34}l${h * 0.13} ${h * 0.14} ${-h * 0.13} ${h * 0.14} ${-h * 0.13} ${-h * 0.14}Z`} fill={gem} stroke="#2a1c08" strokeWidth="1" />
    </g>
  );
}

/** 불씨·포자처럼 떠다니는 점들. 점마다 따로 깜박인다(CSS .boss-mote). */
export function Motes({ at, color, r = 2.2 }: { at: Array<[number, number]>; color: string; r?: number }) {
  return (
    <g>
      {at.map(([x, y], i) => (
        <circle key={`${x}-${y}`} className="boss-mote" style={{ animationDelay: `${(i * 0.37) % 2}s` }} cx={x} cy={y} r={r * (0.7 + (i % 3) * 0.25)} fill={color} />
      ))}
    </g>
  );
}

/** 말풍선 조각(악플·가짜뉴스). */
export function Bubble({ x, y, text, fill, color, r = 0, s = 1 }: { x: number; y: number; text: string; fill: string; color: string; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M-16 -10h32q4 0 4 4v11q0 4-4 4h-20l-8 8v-8h-4q-4 0-4-4v-11q0-4 4-4Z" fill={fill} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="900" fill={color}>
        {text}
      </text>
    </g>
  );
}
