import type { ReactNode } from "react";

import { PlantArt } from "../GardenArt";
import { RaidTrophyArt } from "../RaidWeedArt";
import { isRaidKind } from "../raid/rules";
import { HOUR, isMeteor, isRaining } from "../rules";
import type { Mutation, Species } from "../types";
import { FURNITURE_BY_ID } from "./catalog";
import { KeyFace } from "./KeyArt";
import { freshKeys, type RoomKey } from "./keyboard";
import { keyboardKeys, parseSlot, placement, roomWidth, type Placed, type RoomData, type Shown } from "./rules";

export const CELL = 40;
export const HEIGHT = 170;
/** 칸 줄마다의 그림 상자(위 y, 높이). 바닥 두 줄은 아래 변이 바닥선이다. */
export const ROWS = { w: { y: 12, h: 46 }, b: { y: 76, h: 46 }, f: { y: 124, h: 46 } } as const;
export const ROOM_COLORS = {
  ink: "#3a2f2a",
  paper: "#fffdf6",
  cream: "#fff3d6",
  wood: "#d39a5e",
  woodD: "#9a6439",
  sky: "#9fd8f2",
  skyD: "#2f9bd8",
  orange: "#f47b20",
  orangeL: "#ffb36b",
  pink: "#f5a3c0",
  green: "#86c46d",
  greenD: "#3f8a4a",
  yellow: "#ffd85c",
  grey: "#cfd5da",
  greyD: "#8e979e",
  navy: "#2b3a67",
  red: "#d9574a",
  purple: "#9b86d1",
  white: "#ffffff",
};

const C = ROOM_COLORS;

export type Weather = "day" | "night" | "rain" | "meteor";

/** 창밖 날씨. 단비·별똥별은 rules.ts의 시각 그대로, 밤은 한국 시각 19–6시. */
export function weatherAt(now: number): Weather {
  if (isMeteor(now)) return "meteor";
  if (isRaining(now)) return "rain";
  const hour = Math.floor(((now + 9 * HOUR) % (24 * HOUR)) / HOUR);
  return hour >= 19 || hour < 6 ? "night" : "day";
}

/** Shared room drawing for the live room and server-rendered share card. */
export function RoomSvg({ room, byId, now, label, uid = "room", ghost, selected }: {
  room: RoomData;
  byId: ReadonlyMap<string, Species>;
  now: number;
  label: string;
  uid?: string;
  ghost?: Placed | null;
  selected?: string | null;
}) {
  const width = roomWidth(room.size);
  const W = width * CELL;
  const weather = weatherAt(now);
  const items = [...room.placed, ...(ghost ? [ghost] : [])]
    .map((p) => ({ p, spec: placement(p.it, room.shown), slot: parseSlot(p.at) }))
    .filter((x): x is { p: Placed; spec: NonNullable<typeof x.spec>; slot: NonNullable<typeof x.slot> } => Boolean(x.spec && x.slot))
    .sort((a, b) => "wbf".indexOf(a.slot.row) - "wbf".indexOf(b.slot.row));
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={W} height={HEIGHT} viewBox={`0 0 ${W} ${HEIGHT}`} role="img" aria-label={label} className="garden-room-art">
      <defs>
        <Surface id={`${uid}-wall`} art={room.wall} />
        <Surface id={`${uid}-floor`} art={room.floor} />
        <linearGradient id={`${uid}-rainbow`} x1="0" x2="1">
          {[C.red, C.orange, C.yellow, C.green, C.skyD, C.purple].map((c, i) => <stop key={c} offset={i / 5} stopColor={c} />)}
        </linearGradient>
      </defs>
      <g shapeRendering="crispEdges">
        <rect x="0" y="0" width={W} height="92" fill={`url(#${uid}-wall)`} />
        <rect x="0" y="92" width={W} height={HEIGHT - 92} fill={`url(#${uid}-floor)`} />
        <rect x="0" y="88" width={W} height="6" fill={C.woodD} stroke={C.ink} strokeWidth="2" />
        <rect x="1" y="1" width={W - 2} height={HEIGHT - 2} fill="none" stroke={C.ink} strokeWidth="3" />
      </g>
      {items.map(({ p, spec, slot }) => {
        const w = spec.size * CELL;
        const h = ROWS[slot.row].h;
        const isGhost = ghost === p;
        return (
          <g
            key={`${p.at}-${p.it}${isGhost ? "-ghost" : ""}`}
            transform={`translate(${slot.i * CELL} ${ROWS[slot.row].y})`}
            opacity={isGhost ? 0.6 : 1}
            className={selected === p.at ? "garden-room-picked" : undefined}
          >
            <ItemArt it={p.it} shown={room.shown} keys={keyboardKeys(room, p.kb)} byId={byId} w={w} h={h} weather={weather} rainbow={`url(#${uid}-rainbow)`} />
          </g>
        );
      })}
    </svg>
  );
}

export function ItemArt({
  it,
  shown,
  keys,
  byId,
  w,
  h,
  weather,
  rainbow,
}: {
  it: string;
  shown: readonly Shown[];
  keys?: readonly RoomKey[];
  byId: ReadonlyMap<string, Species>;
  w: number;
  h: number;
  weather: Weather;
  rainbow: string;
}) {
  const s = shown.find((x) => x.id === it);
  if (s) return <ShownArt shown={s} byId={byId} w={w} h={h} rainbow={rainbow} />;
  const f = FURNITURE_BY_ID.get(it);
  return f ? <FurnitureArt art={f.art} w={w} h={h} weather={weather} keys={keys} /> : null;
}

const STARTER_KEYS = freshKeys();

/** 내 키보드 — 받침 위의 키 넷. 키마다 그 방 주인이 그린 그림을 작게(docs/garden-miniroom.md §4.5). */
function KeyboardArt({ w, base, keys }: { w: number; base: number; keys: readonly RoomKey[] }) {
  const cap = 17;
  const gap = (w - 6 - cap * 4) / 3;
  return (
    <>
      <B x={6} y={base - 10} w={4} h={10} fill={C.woodD} />
      <B x={w - 10} y={base - 10} w={4} h={10} fill={C.woodD} />
      <B x={1} y={base - 22} w={w - 2} h={12} fill={C.greyD} />
      {keys.slice(0, 4).map((k, i) => {
        const x = 3 + i * (cap + gap);
        return (
          <g key={i}>
            <B x={x} y={base - 37} w={cap} h={17} fill={C.cream} />
            <rect x={x + 1} y={base - 23} width={cap - 2} height="2" fill={C.grey} />
            <KeyFace face={k.face} x={x + 2.5} y={base - 35.5} size={12} />
          </g>
        );
      })}
    </>
  );
}

// ── 전시품 ──────────────────────────────────────────────────────────

const POT_WIDTH = { sprout: 18, common: 22, flagship: 28, perennial: 32 } as const;

function potColor(mut: readonly Mutation[] | undefined, rainbow: string): string {
  const m = new Set(mut ?? []);
  if (m.has("rainbow")) return rainbow;
  if (m.has("golden")) return "#ffd24a";
  if (m.has("sparkle")) return "#4a4fa8";
  if (m.has("blessed")) return "#9ad48a";
  if (m.has("moist")) return "#7fc4ec";
  if (m.has("shine")) return "#fff1c2";
  return "#cf7a4f";
}

export function ShownArt({ shown, byId, w, h, rainbow }: { shown: Shown; byId: ReadonlyMap<string, Species>; w: number; h: number; rainbow: string }) {
  const species = shown.species ? byId.get(shown.species) : undefined;
  if (shown.kind === "frame") {
    return (
      <g shapeRendering="crispEdges">
        <rect x="5" y="4" width={w - 10} height="38" fill={C.wood} stroke={C.ink} strokeWidth="2" />
        <rect x="10" y="9" width={w - 20} height="28" fill={C.paper} stroke={C.woodD} strokeWidth="1" />
        <rect x="13" y="13" width={w - 26} height="3" fill={C.skyD} />
        {[20, 25, 30].map((y) => <rect key={y} x="13" y={y} width={y === 30 ? (w - 26) * 0.6 : w - 26} height="2" fill={C.greyD} />)}
      </g>
    );
  }
  if (shown.kind === "trophy") {
    // 악초 박제. 종류표에 없는 값(남의 공개 문서)이면 빈 받침만.
    if (!isRaidKind(shown.species)) return <rect x="8" y={h - 10} width={w - 16} height="10" fill={C.greyD} stroke={C.ink} strokeWidth="2" />;
    return (
      <svg x={(w - 44) / 2} y={h - 44} width="44" height="44" overflow="visible">
        <RaidTrophyArt kind={shown.species} />
      </svg>
    );
  }
  const tier = species?.tier ?? "sprout";
  const tree = shown.kind === "tree";
  const potW = POT_WIDTH[tree ? "perennial" : tier];
  const potH = tree ? 14 : 10 + potW / 4;
  const plant = tree ? 52 : potW * 1.7;
  const mutated = (shown.mut?.length ?? 0) > 0;
  const x = (w - potW) / 2;
  return (
    <g>
      {mutated && <ellipse cx={w / 2} cy={h - potH - plant / 3} rx={plant / 2} ry={plant / 2.2} fill={C.yellow} opacity=".35" />}
      <svg x={(w - plant) / 2} y={h - potH - plant + 6} width={plant} height={plant} overflow="visible">
        <PlantArt species={species} />
      </svg>
      <g shapeRendering="crispEdges">
        <rect x={x - 2} y={h - potH} width={potW + 4} height="4" fill={potColor(shown.mut, rainbow)} stroke={C.ink} strokeWidth="2" />
        <path d={`M${x} ${h - potH + 4}H${x + potW}L${x + potW - 3} ${h}H${x + 3}Z`} fill={potColor(shown.mut, rainbow)} stroke={C.ink} strokeWidth="2" />
      </g>
    </g>
  );
}

// ── 벽지·바닥재 ──────────────────────────────────────────────────────

export function Surface({ id, art }: { id: string; art: string }) {
  const pattern = (size: number, children: ReactNode, w = size) => (
    <pattern id={id} width={w} height={size} patternUnits="userSpaceOnUse">
      {children}
    </pattern>
  );
  switch (art) {
    case "wp-stripe":
      return pattern(16, <><rect width="16" height="16" fill="#e6f5c9" /><rect width="6" height="16" fill="#cdeaa0" /></>);
    case "wp-dot":
      return pattern(16, <><rect width="16" height="16" fill="#e2f3fc" /><rect x="3" y="3" width="3" height="3" fill={C.sky} /><rect x="11" y="11" width="3" height="3" fill={C.sky} /></>);
    case "wp-check":
      return pattern(12, <><rect width="12" height="12" fill={C.paper} /><rect width="12" height="1" fill="#d6e7f5" /><rect width="1" height="12" fill="#d6e7f5" /></>);
    case "wp-brick":
      return pattern(16, <><rect width="24" height="16" fill="#d9785f" /><rect width="24" height="1" fill="#b5523c" /><rect y="8" width="24" height="1" fill="#b5523c" /><rect x="12" width="1" height="8" fill="#b5523c" /><rect y="8" width="1" height="8" fill="#b5523c" /></>, 24);
    case "wp-night":
      return pattern(24, <><rect width="24" height="24" fill={C.navy} /><rect x="4" y="5" width="2" height="2" fill={C.yellow} /><rect x="16" y="15" width="2" height="2" fill="#fff4b0" /><rect x="19" y="3" width="1" height="1" fill={C.white} /></>);
    case "wp-rainbow":
      return pattern(36, <>{[C.red, C.orangeL, C.yellow, "#bfe6a8", C.sky, "#c9b8ef"].map((c, i) => <rect key={c} y={i * 6} width="8" height="6" fill={c} />)}</>, 8);
    case "fl-tile":
      return pattern(16, <><rect width="16" height="16" fill="#cfeaf6" /><rect width="8" height="8" fill="#a9d6ec" /><rect x="8" y="8" width="8" height="8" fill="#a9d6ec" /></>);
    case "fl-grass":
      return pattern(14, <><rect width="14" height="14" fill="#8fcb6a" /><rect x="3" y="5" width="2" height="4" fill="#6aa94f" /><rect x="10" y="10" width="2" height="3" fill="#6aa94f" /></>);
    case "fl-carpet":
      return pattern(12, <><rect width="12" height="12" fill="#f6a35c" /><rect x="5" y="5" width="2" height="2" fill={C.orange} /></>);
    case "fl-cloud":
      return pattern(24, <><rect width="24" height="24" fill="#eef6ff" /><rect x="3" y="6" width="10" height="4" fill={C.white} /><rect x="14" y="16" width="8" height="3" fill={C.white} /></>);
    case "fl-wood":
      return pattern(12, <><rect width="40" height="12" fill="#d9a066" /><rect width="40" height="1" fill="#b07a45" /><rect x="22" width="1" height="12" fill="#b07a45" /></>, 40);
    case "wp-vine":
      return pattern(20, <><rect width="20" height="20" fill="#eef5df" /><path d="M0 14Q5 6 10 10T20 6" fill="none" stroke="#7fa64a" strokeWidth="2" /><rect x="9" y="8" width="3" height="3" fill="#a3b236" /></>);
    case "wp-guard":
      return pattern(24, <><rect width="24" height="24" fill="#2b4a2a" /><rect x="3" y="4" width="4" height="4" fill="#ffd85c" /><rect x="15" y="15" width="3" height="3" fill="#ffd85c" /><rect x="10" y="10" width="4" height="2" fill="#86c46d" /><rect x="11" y="9" width="2" height="4" fill="#86c46d" /></>);
    case "fl-plaza":
      return pattern(16, <><rect width="16" height="16" fill="#cfc6b4" /><rect width="16" height="1" fill="#a39a88" /><rect x="8" width="1" height="8" fill="#a39a88" /><rect y="8" width="16" height="1" fill="#a39a88" /><rect x="0" y="8" width="1" height="8" fill="#a39a88" /></>);
    case "wp-cream":
    default:
      return pattern(20, <><rect width="20" height="20" fill={C.cream} /><rect x="9" width="2" height="20" fill="#fbe8c2" /></>);
  }
}

// ── 가구 ────────────────────────────────────────────────────────────

/** 굵은 외곽선 사각형. 도트 그림의 기본 조각. */
function B({ x, y, w, h, fill, line = true }: { x: number; y: number; w: number; h: number; fill: string; line?: boolean }) {
  return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={line ? C.ink : "none"} strokeWidth={line ? 2 : 0} />;
}

function Sky({ x, y, w, h, weather }: { x: number; y: number; w: number; h: number; weather: Weather }) {
  const night = weather === "night" || weather === "meteor";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={weather === "rain" ? "#9fb6c4" : night ? C.navy : C.sky} />
      {weather === "day" && <><rect x={x + w - 14} y={y + 4} width="8" height="8" fill={C.yellow} /><rect x={x + 4} y={y + h - 10} width="14" height="4" fill={C.white} /></>}
      {weather === "night" && <><rect x={x + w - 12} y={y + 4} width="6" height="6" fill="#fff4b0" /><rect x={x + 6} y={y + 8} width="2" height="2" fill={C.white} /></>}
      {weather === "meteor" && <><rect x={x + 6} y={y + 6} width="2" height="2" fill={C.white} /><path d={`M${x + w - 6} ${y + 4}L${x + 10} ${y + h - 6}`} stroke={C.yellow} strokeWidth="2" /><rect x={x + 8} y={y + h - 8} width="4" height="4" fill={C.white} /></>}
      {weather === "rain" && Array.from({ length: Math.floor(w / 8) }, (_, i) => <rect key={i} x={x + 3 + i * 8} y={y + 3 + (i % 3) * 5} width="2" height="6" fill={C.white} opacity=".8" />)}
    </g>
  );
}

export function FurnitureArt({ art, w, h, weather, keys }: { art: string; w: number; h: number; weather: Weather; keys?: readonly RoomKey[] }) {
  const base = h; // 바닥 물건은 아래 변에 선다
  const cx = w / 2;
  let body: ReactNode = null;
  switch (art) {
    case "frame":
      body = <><B x={5} y={4} w={w - 10} h={38} fill={C.wood} /><B x={10} y={9} w={w - 20} h={28} fill={C.paper} /></>;
      break;
    case "clock":
      body = <><circle cx={cx} cy="22" r="14" fill={C.paper} stroke={C.ink} strokeWidth="3" /><rect x={cx - 1} y="12" width="2" height="11" fill={C.ink} /><rect x={cx} y="21" width="8" height="2" fill={C.orange} /></>;
      break;
    case "shelf":
      body = <><B x={3} y={30} w={w - 6} h={5} fill={C.wood} /><B x={8} y={20} w={8} h={10} fill="#cf7a4f" /><rect x="9" y="12" width="6" height="8" fill={C.green} /><B x={22} y={18} w={4} h={12} fill={C.skyD} /><B x={27} y={21} w={4} h={9} fill={C.orange} /></>;
      break;
    case "garland":
      body = <><path d={`M2 10Q${cx} 34 ${w - 2} 10`} fill="none" stroke={C.greenD} strokeWidth="2" />{[0.15, 0.32, 0.5, 0.68, 0.85].map((t, i) => <B key={t} x={w * t - 4} y={10 + Math.sin(t * Math.PI) * 13} w={8} h={8} fill={[C.pink, C.yellow, C.sky, C.orangeL, C.pink][i]} />)}</>;
      break;
    case "painting":
      body = <><B x={4} y={6} w={w - 8} h={32} fill={C.woodD} /><rect x="8" y="10" width={w - 16} height="24" fill={C.sky} /><rect x="8" y="24" width={w - 16} height="10" fill={C.green} /><rect x="22" y="13" width="5" height="5" fill={C.yellow} /></>;
      break;
    case "wall-lamp":
      body = <><B x={cx - 2} y={8} w={4} h={14} fill={C.greyD} /><path d={`M${cx - 10} 32H${cx + 10}L${cx + 6} 20H${cx - 6}Z`} fill={C.yellow} stroke={C.ink} strokeWidth="2" /><rect x={cx - 12} y="32" width="24" height="6" fill={C.yellow} opacity=".35" /></>;
      break;
    case "star-light":
      body = <><path d={`M2 8Q${cx} 22 ${w - 2} 8`} fill="none" stroke={C.ink} strokeWidth="1.5" />{[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((t) => <path key={t} d={`M${w * t} ${10 + Math.sin(t * Math.PI) * 8}l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z`} fill={C.yellow} stroke={C.ink} strokeWidth="1" />)}</>;
      break;
    case "win-round":
      body = <><circle cx={cx} cy="23" r="21" fill={C.wood} stroke={C.ink} strokeWidth="3" /><clipPath id="win-round-clip"><circle cx={cx} cy="23" r="16" /></clipPath><g clipPath="url(#win-round-clip)"><Sky x={cx - 16} y={7} w={32} h={32} weather={weather} /></g><circle cx={cx} cy="23" r="16" fill="none" stroke={C.ink} strokeWidth="2" /><rect x={cx - 1} y="7" width="2" height="32" fill={C.wood} /><rect x={cx - 16} y="22" width="32" height="2" fill={C.wood} /></>;
      break;
    case "win-wide":
      body = <><B x={6} y={2} w={w - 12} h={40} fill={C.wood} /><Sky x={10} y={6} w={w - 20} h={32} weather={weather} /><rect x={cx - 1} y="6" width="2" height="32" fill={C.wood} /><B x={2} y={0} w={14} h={44} fill={C.pink} /><B x={w - 16} y={0} w={14} h={44} fill={C.pink} /><rect x="0" y="-2" width={w} height="4" fill={C.woodD} /></>;
      break;
    case "bed":
      body = <><B x={2} y={base - 34} w={10} h={34} fill={C.woodD} /><B x={8} y={base - 18} w={w - 10} h={12} fill={C.paper} /><B x={30} y={base - 22} w={w - 32} h={12} fill={C.skyD} /><B x={12} y={base - 24} w={16} h={8} fill={C.white} /><B x={8} y={base - 6} w={w - 10} h={6} fill={C.wood} /></>;
      break;
    case "sofa":
      body = <><B x={4} y={base - 30} w={w - 8} h={16} fill={C.sky} /><B x={2} y={base - 18} w={w - 4} h={12} fill={C.skyD} /><B x={0} y={base - 22} w={8} h={16} fill={C.sky} /><B x={w - 8} y={base - 22} w={8} h={16} fill={C.sky} /><B x={6} y={base - 6} w={4} h={6} fill={C.woodD} /><B x={w - 10} y={base - 6} w={4} h={6} fill={C.woodD} /></>;
      break;
    case "desk":
      body = <><B x={2} y={base - 26} w={w - 4} h={5} fill={C.wood} /><B x={4} y={base - 21} w={4} h={21} fill={C.woodD} /><B x={w - 26} y={base - 21} w={22} h={21} fill={C.wood} /><rect x={w - 22} y={base - 13} width="14" height="2" fill={C.woodD} /><B x={12} y={base - 38} w={14} h={12} fill={C.grey} /><B x={30} y={base - 33} w={10} h={7} fill={C.orange} /></>;
      break;
    case "bookshelf":
      body = <><B x={4} y={base - 44} w={w - 8} h={44} fill={C.woodD} />{[base - 40, base - 26, base - 12].map((y, r) => <g key={y}>{[0, 1, 2, 3].map((k) => <rect key={k} x={8 + k * 6} y={y + (k % 2)} width="5" height={10 - (k % 2)} fill={[C.red, C.skyD, C.yellow, C.green][(k + r) % 4]} stroke={C.ink} strokeWidth="1" />)}<rect x="6" y={y + 10} width={w - 12} height="2" fill={C.ink} /></g>)}</>;
      break;
    case "wardrobe":
      body = <><B x={4} y={base - 44} w={w - 8} h={42} fill={C.wood} /><rect x={cx - 1} y={base - 42} width="2" height="38" fill={C.woodD} /><rect x={cx - 6} y={base - 24} width="3" height="5" fill={C.ink} /><rect x={cx + 3} y={base - 24} width="3" height="5" fill={C.ink} /><B x={6} y={base - 2} w={4} h={2} fill={C.woodD} /><B x={w - 10} y={base - 2} w={4} h={2} fill={C.woodD} /></>;
      break;
    case "chair":
      body = <><B x={10} y={base - 34} w={5} h={34} fill={C.wood} /><B x={10} y={base - 16} w={22} h={5} fill={C.wood} /><B x={27} y={base - 11} w={5} h={11} fill={C.woodD} /><B x={10} y={base - 34} w={14} h={5} fill={C.wood} /></>;
      break;
    case "table":
      body = <><B x={4} y={base - 22} w={w - 8} h={6} fill={C.wood} /><B x={cx - 3} y={base - 16} w={6} h={14} fill={C.woodD} /><B x={cx - 10} y={base - 3} w={20} h={3} fill={C.woodD} /><B x={cx + 4} y={base - 30} w={8} h={8} fill={C.paper} /></>;
      break;
    case "lamp":
      body = <><path d={`M${cx - 11} ${base - 28}H${cx + 11}L${cx + 7} ${base - 42}H${cx - 7}Z`} fill={C.yellow} stroke={C.ink} strokeWidth="2" /><B x={cx - 2} y={base - 28} w={4} h={24} fill={C.greyD} /><B x={cx - 9} y={base - 4} w={18} h={4} fill={C.greyD} /></>;
      break;
    case "rug":
      body = <><ellipse cx={cx} cy={base - 6} rx={cx - 4} ry="6" fill={C.orangeL} stroke={C.ink} strokeWidth="2" /><ellipse cx={cx} cy={base - 6} rx={cx - 14} ry="3" fill={C.orange} /></>;
      break;
    case "can":
      body = <><B x={10} y={base - 18} w={18} h={18} fill={C.skyD} /><path d={`M28 ${base - 14}L37 ${base - 22}`} stroke={C.ink} strokeWidth="3" /><B x={14} y={base - 24} w={10} h={4} fill={C.skyD} /></>;
      break;
    case "cushion":
      body = <><B x={6} y={base - 10} w={w - 12} h={10} fill={C.pink} /><rect x={cx - 2} y={base - 7} width="4" height="4" fill={C.white} /></>;
      break;
    case "radio":
      body = <><B x={6} y={base - 22} w={w - 12} h={22} fill={C.orange} /><B x={10} y={base - 18} w={12} h={12} fill={C.paper} /><rect x="12" y={base - 14} width="8" height="2" fill={C.ink} /><rect x="12" y={base - 10} width="8" height="2" fill={C.ink} /><circle cx={w - 13} cy={base - 12} r="4" fill={C.yellow} stroke={C.ink} strokeWidth="2" /><path d={`M${w - 10} ${base - 22}L${w - 4} ${base - 34}`} stroke={C.ink} strokeWidth="2" /></>;
      break;
    case "mailbox":
      body = <><B x={cx - 2} y={base - 20} w={4} h={20} fill={C.woodD} /><B x={cx - 12} y={base - 36} w={24} h={16} fill={C.red} /><rect x={cx - 8} y={base - 30} width="16" height="2" fill={C.ink} /><B x={cx + 10} y={base - 40} w={3} h={10} fill={C.yellow} /></>;
      break;
    case "keyboard":
      body = <KeyboardArt w={w} base={base} keys={keys ?? STARTER_KEYS} />;
      break;
    case "piano":
      body = <><B x={2} y={base - 40} w={w - 4} h={26} fill={C.ink} /><B x={2} y={base - 18} w={w - 4} h={6} fill={C.white} />{Array.from({ length: 8 }, (_, i) => <rect key={i} x={8 + i * 9} y={base - 18} width="4" height="3" fill={C.ink} />)}<B x={6} y={base - 12} w={5} h={12} fill={C.ink} /><B x={w - 11} y={base - 12} w={5} h={12} fill={C.ink} /></>;
      break;
    case "picnic":
      body = <><B x={6} y={base - 18} w={w - 12} h={18} fill={C.wood} /><path d={`M10 ${base - 18}Q${cx} ${base - 38} ${w - 10} ${base - 18}`} fill="none" stroke={C.ink} strokeWidth="3" /><rect x="8" y={base - 12} width={w - 16} height="3" fill={C.red} /></>;
      break;
    case "fishbowl":
      body = <><B x={10} y={base - 6} w={20} h={6} fill={C.woodD} /><circle cx={cx} cy={base - 20} r="14" fill="#cfeefc" stroke={C.ink} strokeWidth="2" /><rect x={cx - 10} y={base - 18} width="20" height="10" fill={C.sky} /><B x={cx - 4} y={base - 24} w={7} h={5} fill={C.orange} /></>;
      break;
    case "rocker":
      body = <><path d={`M4 ${base - 3}Q${cx} ${base + 2} ${w - 4} ${base - 3}`} fill="none" stroke={C.woodD} strokeWidth="4" /><B x={8} y={base - 38} w={5} h={34} fill={C.wood} /><B x={8} y={base - 18} w={24} h={5} fill={C.wood} /><B x={28} y={base - 14} w={4} h={10} fill={C.woodD} /><B x={13} y={base - 32} w={10} h={14} fill={C.pink} /></>;
      break;
    case "tent":
      body = <><path d={`M4 ${base}L${cx} ${base - 42}L${w - 4} ${base}Z`} fill={C.orangeL} stroke={C.ink} strokeWidth="2" /><path d={`M${cx - 10} ${base}L${cx} ${base - 24}L${cx + 10} ${base}Z`} fill={C.navy} /><rect x={cx - 1} y={base - 46} width="2" height="6" fill={C.ink} /><rect x={cx + 1} y={base - 46} width="8" height="4" fill={C.red} /></>;
      break;
    case "banner":
      body = <><B x={cx - 1} y={2} w={3} h={40} fill={C.woodD} /><path d={`M${cx + 2} 4H${cx + 16}L${cx + 11} 13L${cx + 16} 22H${cx + 2}Z`} fill={C.greenD} stroke={C.ink} strokeWidth="2" /><rect x={cx + 5} y="10" width="4" height="4" fill={C.yellow} /></>;
      break;
    case "drum":
      body = <><B x={8} y={base - 22} w={w - 16} h={20} fill={C.red} /><rect x="8" y={base - 22} width={w - 16} height="4" fill={C.paper} /><rect x="8" y={base - 6} width={w - 16} height="4" fill={C.paper} /><path d={`M10 ${base - 18}L${w - 10} ${base - 6}M${w - 10} ${base - 18}L10 ${base - 6}`} stroke={C.yellow} strokeWidth="1.5" /><B x={w - 12} y={base - 34} w={3} h={12} fill={C.wood} /></>;
      break;
    case "lantern":
      body = <><B x={cx - 2} y={base - 14} w={4} h={14} fill={C.ink} /><B x={cx - 8} y={base - 36} w={16} h={22} fill={C.yellow} /><rect x={cx - 8} y={base - 38} width="16" height="3" fill={C.ink} /><rect x={cx - 4} y={base - 30} width="8" height="10" fill={C.orangeL} /></>;
      break;
    case "bench":
      body = <><B x={4} y={base - 24} w={w - 8} h={5} fill={C.wood} /><B x={4} y={base - 16} w={w - 8} h={5} fill={C.wood} /><B x={8} y={base - 11} w={4} h={11} fill={C.ink} /><B x={w - 12} y={base - 11} w={4} h={11} fill={C.ink} /></>;
      break;
    case "showcase":
      body = <><B x={5} y={base - 44} w={w - 10} h={44} fill={C.woodD} /><rect x="9" y={base - 40} width={w - 18} height="36" fill="#cfeefc" stroke={C.ink} strokeWidth="1" /><rect x="9" y={base - 22} width={w - 18} height="2" fill={C.woodD} /><B x={14} y={base - 34} w={6} h={10} fill={C.yellow} /><B x={22} y={base - 16} w={8} h={10} fill={C.green} /></>;
      break;
    case "fountain":
      body = <><ellipse cx={cx} cy={base - 6} rx={cx - 4} ry="6" fill={C.grey} stroke={C.ink} strokeWidth="2" /><ellipse cx={cx} cy={base - 7} rx={cx - 10} ry="3" fill={C.sky} /><B x={cx - 4} y={base - 28} w={8} h={20} fill={C.grey} /><path d={`M${cx} ${base - 30}Q${cx - 12} ${base - 40} ${cx - 16} ${base - 12}M${cx} ${base - 30}Q${cx + 12} ${base - 40} ${cx + 16} ${base - 12}`} stroke={C.skyD} strokeWidth="2" fill="none" /></>;
      break;
    default:
      body = <B x={8} y={base - 20} w={w - 16} h={20} fill={C.grey} />;
  }
  return <g shapeRendering="crispEdges">{body}</g>;
}
