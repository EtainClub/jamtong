import type { ReactNode } from "react";

import { PlantArt } from "../GardenArt";
import { RaidTrophyArt } from "../RaidWeedArt";
import { isRaidKind } from "../raid/rules";
import { HOUR, isMeteor, isRaining, JAR_STYLE } from "../rules";
import type { Mutation, Species } from "../types";
import { BOOK_PALETTES } from "./books";
import { cartelCardImage, cartelOf } from "./cartels";
import { FURNITURE_BY_ID } from "./catalog";
import { FURNITURE_SPRITES, spriteHref } from "./furnitureSprites";
import { KeyFace } from "./KeyArt";
import { freshKeys, type RoomKey } from "./keyboard";
import { SOUVENIR_CASE, type Shown } from "./rules";

/**
 * 물건 하나의 그림(정면) — 아이소 방(IsoRoom.tsx)·상점·보관함이 쓴다. 아이소 그림(public/images/room-iso)이 아직 없는
 * 물건은 아이소 방에서도 이 정면 그림이 선 채로(싸이월드식) 그려진다(docs/garden-miniroom-iso.md §9).
 * 그림 한 칸의 너비. 정면 그림은 칸 너비 × 46px 상자에 그려진다 — 꼬마(40×48)와 같은 배율.
 */
export const CELL = 40;
/** 정면 그림 상자의 높이. */
export const ART_H = 46;
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
  if (it === SOUVENIR_CASE) {
    const icons = shown.filter((x) => x.kind === "souvenir").map((x) => (x.species ? byId.get(x.species)?.memento?.icon : undefined) ?? "🏅");
    return <CaseArt icons={icons} w={w} h={h} />;
  }
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
  if (shown.kind === "souvenir") {
    // 업적 기념품 — 받침 위의 작은 모형. 진행을 아는 업적만 모습이 다르다: 계획이면 설계도, 추진 중이면 비계.
    // 진행을 모르면(대부분) 유리 덮개를 씌운 보통 모형이다 — 완료라고 그리지 않는다.
    const memento = species?.memento;
    const status = memento?.status ?? null;
    const cx = w / 2;
    return (
      <g>
        <g shapeRendering="crispEdges">
          <rect x={cx - 16} y={h - 9} width="32" height="9" fill={C.wood} stroke={C.ink} strokeWidth="2" />
          <rect x={cx - 12} y={h - 6} width="24" height="2" fill={C.woodD} />
        </g>
        {status === "planned" ? (
          <g>
            <rect x={cx - 15} y={h - 37} width="30" height="26" fill="#cfe3f6" stroke="#4a78a8" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x={cx} y={h - 17} fontSize="17" textAnchor="middle" opacity=".55">{memento?.icon ?? "🏅"}</text>
          </g>
        ) : (
          <g>
            <text x={cx} y={h - 14} fontSize="22" textAnchor="middle">{memento?.icon ?? "🏅"}</text>
            {status === "ongoing" ? (
              <g stroke={C.greyD} strokeWidth="1.5" fill="none">
                <path d={`M${cx - 15} ${h - 9}V${h - 40}M${cx + 15} ${h - 9}V${h - 40}M${cx - 15} ${h - 24}H${cx + 15}M${cx - 15} ${h - 38}H${cx + 15}`} />
              </g>
            ) : (
              <path d={`M${cx - 15} ${h - 9}V${h - 30}Q${cx - 15} ${h - 42} ${cx} ${h - 42}Q${cx + 15} ${h - 42} ${cx + 15} ${h - 30}V${h - 9}`} fill="#dff1ff" fillOpacity=".28" stroke="#9cc6e6" strokeWidth="1.5" />
            )}
          </g>
        )}
      </g>
    );
  }
  if (shown.kind === "jar") return <JarArt region={shown.species ?? ""} mut={shown.mut} w={w} h={h} rainbow={rainbow} />;
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

/**
 * 분야 잼 병(잼 공방, docs/garden-farm-v2.md §5). 유리병에 분야 색 잼, 앞에 분야 표식.
 * 재료 열매의 변이가 병으로 옮겨 온다 — 황금은 금빛 뚜껑, 무지개는 무지개 띠, 반짝은 별, 촉촉은 물방울.
 */
export function JarArt({ region, mut, w, h, rainbow }: { region: string; mut?: readonly Mutation[]; w: number; h: number; rainbow: string }) {
  const style = JAR_STYLE[region] ?? { jam: "#c96b3d", icon: "🍯" };
  const m = new Set(mut ?? []);
  const jw = 22;
  const x = (w - jw) / 2;
  const top = h - 30;
  return (
    <g>
      <g shapeRendering="crispEdges">
        <rect x={x - 1} y={top} width={jw + 2} height="6" fill={m.has("golden") ? "#ffd24a" : C.red} stroke={C.ink} strokeWidth="2" />
        <rect x={x} y={top + 6} width={jw} height="24" fill="#eaf6ff" stroke={C.ink} strokeWidth="2" />
        <rect x={x + 2} y={top + 11} width={jw - 4} height="17" fill={style.jam} />
        {m.has("rainbow") && <rect x={x} y={top + 6} width={jw} height="3" fill={rainbow} />}
        <rect x={x + 3} y={top + 13} width="3" height="10" fill="#ffffff" opacity=".45" />
        <rect x={x + 4} y={top + 16} width={jw - 8} height="9" fill={C.paper} stroke={C.ink} strokeWidth="1" />
      </g>
      <text x={w / 2} y={top + 24} fontSize="7" textAnchor="middle">{style.icon}</text>
      {m.has("sparkle") && <text x={x + jw + 1} y={top + 4} fontSize="8">✨</text>}
      {m.has("moist") && <text x={x - 7} y={top + 12} fontSize="7">💧</text>}
    </g>
  );
}

// ── 벽지·바닥재 ──────────────────────────────────────────────────────

/** 벽지·바닥재 무늬. transform은 아이소 벽·바닥 면에 무늬를 눕히는 patternTransform. */
export function Surface({ id, art, transform }: { id: string; art: string; transform?: string }) {
  const pattern = (size: number, children: ReactNode, w = size) => (
    <pattern id={id} width={w} height={size} patternUnits="userSpaceOnUse" patternTransform={transform}>
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

/**
 * 기념품 진열장 — 유리장 세 칸에 받은 기념품을 여섯까지 보이고, 그보다 많으면 수를 단다.
 * 상점·보관함의 아이콘(FurnitureArt)은 빈 진열장이다.
 */
export function CaseArt({ icons, w, h }: { icons: readonly string[]; w: number; h: number }) {
  const cw = Math.min(w - 4, 36);
  const x = (w - cw) / 2;
  const top = h - 44;
  const shelves = [top + 13, top + 26, top + 39];
  const shown = icons.slice(0, 6);
  return (
    <g>
      <g shapeRendering="crispEdges">
        <rect x={x} y={top} width={cw} height="44" fill={C.wood} stroke={C.ink} strokeWidth="2" />
        <rect x={x + 3} y={top + 3} width={cw - 6} height="38" fill="#e6f3fb" />
        {shelves.map((y) => (
          <rect key={y} x={x + 3} y={y} width={cw - 6} height="2" fill={C.woodD} />
        ))}
      </g>
      {shown.map((icon, i) => (
        <text key={i} x={x + 3 + ((i % 2) + 0.5) * ((cw - 6) / 2)} y={shelves[Math.floor(i / 2)] - 1} fontSize="10" textAnchor="middle">
          {icon}
        </text>
      ))}
      <rect x={x + 3} y={top + 3} width={(cw - 6) / 2} height="38" fill="#ffffff" opacity=".18" />
      {icons.length > 6 && (
        <g>
          <rect x={x + cw - 14} y={top - 6} width="16" height="10" rx="5" fill={C.ink} />
          <text x={x + cw - 6} y={top + 1.5} fontSize="7" fontWeight="700" fill="#fff" textAnchor="middle">
            {icons.length}
          </text>
        </g>
      )}
    </g>
  );
}

/**
 * 카르텔 카드 — 나무 받침대에 세운 카드 한 장(room/cartels.ts). 카드 머리띠는 카르텔마다 색, 가운데는 카르텔 지도의 표적 삽화.
 * 글자는 넣지 않는다(공유 카드는 그림 속 글자를 그릴 글꼴이 없다). 어느 카르텔인지는 누르면 나온다.
 */
export function CartelCardArt({ slug, color, w, h }: { slug: string; color: string; w: number; h: number }) {
  const cx = w / 2;
  const top = h - 43;
  return (
    <g>
      <g shapeRendering="crispEdges">
        <B x={cx - 14} y={h - 5} w={28} h={4} fill={C.woodD} />
        <B x={cx - 9} y={h - 8} w={18} h={3} fill={C.wood} />
        <B x={cx - 13} y={top} w={26} h={35} fill={color} />
        <rect x={cx - 10} y={top + 3} width="20" height="20" fill="#fffdf6" />
        <rect x={cx - 10} y={top + 26} width="20" height="2" fill="#fffdf6" opacity=".85" />
        <rect x={cx - 10} y={top + 29} width="12" height="2" fill="#fffdf6" opacity=".6" />
      </g>
      <image href={cartelCardImage(slug)} x={cx - 10} y={top + 3} width="20" height="20" preserveAspectRatio="xMidYMid meet" />
      {/* 슬롯에서만 나오는 카드의 반짝임 */}
      <path d={`M${cx + 11} ${top - 3}l1.2 2.6 2.6 1.2-2.6 1.2-1.2 2.6-1.2-2.6-2.6-1.2 2.6-1.2z`} fill="#ffd24a" stroke={C.ink} strokeWidth=".6" />
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
  if (art === SOUVENIR_CASE) return <CaseArt icons={[]} w={w} h={h} />;
  const cartel = cartelOf(art);
  if (cartel) return <CartelCardArt slug={cartel.slug} color={cartel.color} w={w} h={h} />;
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
