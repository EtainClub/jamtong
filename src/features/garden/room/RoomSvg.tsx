import type { ReactNode } from "react";

import { PlantArt } from "../GardenArt";
import { RaidTrophyArt } from "../RaidWeedArt";
import { isRaidKind } from "../raid/rules";
import { HOUR, isMeteor, isRaining } from "../rules";
import type { Mutation, Species } from "../types";
import { BOOK_PALETTES } from "./books";
import { FURNITURE_BY_ID } from "./catalog";
import { FURNITURE_SPRITES, spriteHref } from "./furnitureSprites";
import { activityOf } from "./activities";
import { KeyFace } from "./KeyArt";
import { freshKeys, type RoomKey } from "./keyboard";
import { keyboardKeys, parseSlot, placement, roomWidth, type Placed, type RoomData, type Shown } from "./rules";
import { AVATAR_H, AvatarFigure } from "../avatar/AvatarArt";
import { avatarSlotOk, faceFor, poseAt } from "../avatar/rules";

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

/** 방에서 움직이는 꼬마의 지금 모습(RoomScene이 정한다). 없으면 제자리에 선 꼬마. */
export interface AvatarLive {
  at: string;
  /** 누르면 한 번 — 손 흔들기·뛰기. */
  act: "wave" | "hop" | null;
  walking: boolean;
  /** act가 다시 일어날 때마다 오른다(같은 CSS 애니메이션을 다시 튼다). */
  nonce: number;
}

/**
 * 꼬마 — 자기 줄 가구 바로 앞에 그린다. b줄 꼬마는 f줄 가구에 가려질 수 있다(그게 깊이다).
 * 칸을 차지하지 않는다. 그 칸의 가구가 자세를 정한다(docs/garden-avatar.md §4·§5).
 */
function AvatarInRoom({ room, live }: { room: RoomData; live?: AvatarLive | null }) {
  const av = room.avatar;
  if (!av?.on) return null;
  const at = live?.at ?? av.at;
  const slot = parseSlot(at);
  if (!slot || !avatarSlotOk(at, roomWidth(room.size))) return null;
  const seated = poseAt(room.placed, at);
  const pose = live?.act === "wave" && seated === "stand" ? "wave" : live?.walking ? "walk" : seated;
  const bottom = ROWS[slot.row].y + ROWS[slot.row].h;
  const motion = live?.walking ? "garden-avatar-walk" : live?.act ? `garden-avatar-${live.act}` : undefined;
  return (
    // 움직이는 방(live)은 CSS transform이라 칸 사이를 미끄러진다. 공유 카드는 속성 transform(CSS가 없다).
    <g
      transform={live ? undefined : `translate(${slot.i * CELL} ${bottom - AVATAR_H})`}
      style={live ? { transform: `translate(${slot.i * CELL}px, ${bottom - AVATAR_H}px)` } : undefined}
      className="garden-avatar"
    >
      <g key={live?.nonce ?? 0} className={motion}>
        <AvatarFigure look={av.look} pose={pose} face={faceFor(pose, room.mood)} blink />
      </g>
    </g>
  );
}

/** Shared room drawing for the live room and server-rendered share card. */
export function RoomSvg({ room, byId, now, label, uid = "room", ghost, selected, pulses, avatar }: {
  room: RoomData;
  byId: ReadonlyMap<string, Species>;
  now: number;
  label: string;
  uid?: string;
  ghost?: Placed | null;
  selected?: string | null;
  pulses?: Readonly<Record<string, number>>;
  avatar?: AvatarLive | null;
}) {
  const width = roomWidth(room.size);
  const W = width * CELL;
  const weather = weatherAt(now);
  const items = [...room.placed, ...(ghost ? [ghost] : [])]
    .map((p) => ({ p, spec: placement(p.it, room.shown), slot: parseSlot(p.at) }))
    .filter((x): x is { p: Placed; spec: NonNullable<typeof x.spec>; slot: NonNullable<typeof x.slot> } => Boolean(x.spec && x.slot))
    .sort((a, b) => "wbf".indexOf(a.slot.row) - "wbf".indexOf(b.slot.row));
  // 꼬마를 그릴 자리: 자기 줄(b·f)의 마지막 가구 뒤. 그 줄과 앞줄에 가구가 없으면 맨 앞(prev=null)에서.
  const avRow = room.avatar?.on ? (avatar?.at ?? room.avatar.at)[0] : null;
  const order = (r: string | null | undefined) => (r ? "wbf".indexOf(r) : -1);
  const avatarAfter = (prev: string | null, next: string | undefined) =>
    avRow !== null && order(prev) <= order(avRow) && (next === undefined || order(next) > order(avRow));
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
      {avatarAfter(null, items[0]?.slot.row) && <AvatarInRoom room={room} live={avatar} />}
      {items.flatMap(({ p, spec, slot }, n) => {
        const w = spec.size * CELL;
        const h = ROWS[slot.row].h;
        const isGhost = ghost === p;
        const art = (
          <g
            key={`${p.at}-${p.it}${isGhost ? "-ghost" : ""}`}
            transform={`translate(${slot.i * CELL} ${ROWS[slot.row].y})`}
            opacity={isGhost ? 0.6 : 1}
            className={selected === p.at ? "garden-room-picked" : undefined}
          >
            <g key={pulses?.[p.at] ?? 0} className={pulses?.[p.at] && !isGhost ? `garden-room-react garden-room-react-${activityOf(p.it)?.motion}` : undefined}>
              <ItemArt it={p.it} shown={room.shown} keys={keyboardKeys(room, p.kb)} byId={byId} w={w} h={h} weather={weather} rainbow={`url(#${uid}-rainbow)`} />
            </g>
          </g>
        );
        const next = items[n + 1];
        return avatarAfter(slot.row, next?.slot.row) ? [art, <AvatarInRoom key="avatar" room={room} live={avatar} />] : [art];
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
    case "wp-library":
      // 책등이 줄지어 선 서재 — 일곱 권의 책 색을 돌려 쓴다.
      return pattern(28, <><rect width="28" height="28" fill="#4a3424" /><rect y="13" width="28" height="2" fill="#2e1f14" /><rect y="27" width="28" height="1" fill="#2e1f14" />{[...BOOK_PALETTES.values()].slice(0, 6).map((b, i) => <rect key={b.cover} x={1 + i * 4.5} y={i % 2 ? 4 : 3} width="3.5" height={i % 2 ? 9 : 10} fill={b.cover} />)}{[...BOOK_PALETTES.values()].slice(1, 7).map((b, i) => <rect key={`l${b.cover}`} x={2 + i * 4.3} y={i % 3 ? 17 : 16} width="3.2" height={i % 3 ? 10 : 11} fill={b.ribbon} />)}</>);
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
  const sprite = FURNITURE_SPRITES[art];
  if (sprite) {
    const sh = Math.min(sprite.h, h);
    const y = sprite.y ?? (sprite.wall ? (h - sh) / 2 : h - sh);
    const align = sprite.wall && sprite.y === undefined ? "xMidYMid" : sprite.y !== undefined ? "xMidYMin" : "xMidYMax";
    const image = <image href={spriteHref(art)} x={1} y={y} width={w - 2} height={sh} preserveAspectRatio={`${align} meet`} />;
    const g = sprite.glass;
    if (!g || !sprite.ar) return image;
    // 창문: 그림(가운데 정렬)이 실제로 놓인 자리를 셈해 유리 자리에 창밖 날씨를 먼저 그린다.
    const iw = Math.min(w - 2, sh * sprite.ar);
    const ih = iw / sprite.ar;
    const gx = 1 + (w - 2 - iw) / 2 + g.x * iw;
    const gy = y + (sh - ih) / 2 + g.y * ih;
    const clip = `glass-${art}`;
    return (
      <>
        {g.round && <clipPath id={clip}><ellipse cx={gx + (g.w * iw) / 2} cy={gy + (g.h * ih) / 2} rx={(g.w * iw) / 2} ry={(g.h * ih) / 2} /></clipPath>}
        <g clipPath={g.round ? `url(#${clip})` : undefined}>
          <Sky x={gx} y={gy} w={g.w * iw} h={g.h * ih} weather={weather} />
        </g>
        {image}
      </>
    );
  }
  const base = h; // 바닥 물건은 아래 변에 선다
  const cx = w / 2;
  const book = BOOK_PALETTES.get(art);
  let body: ReactNode = null;
  switch (art) {
    case "book-hope-through-hardship":
    case "book-revolution":
    case "book-bent-arm":
    case "book-lee-does-it":
    case "book-not-lonely-together":
    case "book-people-do-it":
    case "book-autobiography":
      if (!book) break;
      body = <>
        <B x={cx - 15} y={38} w={30} h={5} fill="#bf913e" />
        <B x={cx - 11} y={32} w={22} h={6} fill="#e3bd68" />
        <B x={cx - 13} y={3} w={26} h={30} fill={book.cover} />
        <B x={cx - 9} y={5} w={20} h={26} fill={book.paper} />
        <B x={cx - 9} y={5} w={3} h={26} fill="#cfaa51" />
        <B x={cx - 3} y={10} w={11} h={2} fill={book.cover} />
        <B x={cx - 3} y={14} w={9} h={2} fill={book.cover} />
        <B x={cx - 3} y={20} w={11} h={1} fill="#bf913e" />
        <path d={`M${cx + 3} 26h4v10l-2-2-2 2z`} fill={book.ribbon} />
      </>;
      break;
    case "frame":
      body = <><B x={5} y={4} w={w - 10} h={38} fill={C.wood} /><B x={10} y={9} w={w - 20} h={28} fill={C.paper} /></>;
      break;
    case "keyboard":
      body = <KeyboardArt w={w} base={base} keys={keys ?? STARTER_KEYS} />;
      break;
    default:
      // 표에 있지만 그림 파일도 도형도 없는 가구(rules.test.ts가 막는다). 빈 자리 대신 회색 상자.
      body = <B x={8} y={base - 20} w={w - 16} h={20} fill={C.grey} />;
  }
  return <g shapeRendering="crispEdges">{body}</g>;
}
