import { BOOK_FURNITURE } from "./books";
import { LIGHTSTICK_FURNITURE } from "./lightsticks";

/**
 * 아이소 방의 물건 층과 크기 — docs/garden-miniroom-iso.md §5. 1단계: 표만 둔다(지금 방 화면은 아직 칸으로 그린다).
 *
 * ★ 가구표(catalog.ts)와 같은 id로 따로 둔다 — furnitureSprites.ts와 같은 방식. 가구표 70줄에 열을 더하면 읽기 어렵다.
 *   방에 놓는 가구(kind wall·window·frame-blank·floor)는 모두 여기 있어야 한다(rules.test.ts가 본다).
 * ★ 값은 타일 40px 기준이다. w·d는 바닥(타일, 반 타일 단위), h는 높이(px). 벽걸이는 w가 벽을 따라 가는 너비, d는 0.
 *   방향 0(뒤가 먼 쪽)의 값이다. 방향 1·3은 w와 d를 바꾼다.
 * ★ 그림 상자는 크기에서 계산된다(isoBox) — 그림을 만드는 쪽(scripts/room-iso-gen.ts)도 이 표를 읽는다.
 * ★ 자세(앉기·자기·연주)는 가구표의 pose가 정하고, 여기는 그 자리의 높이(seatZ)만 둔다.
 */

/** rug=깔개(무엇과도 겹친다) · furniture=가구(서로 막는다) · small=올려 두는 것(올림면 위에 놓인다) · wall=벽걸이. */
export type IsoLayer = "rug" | "furniture" | "small" | "wall";

export interface IsoSpec {
  layer: IsoLayer;
  w: number;
  d: number;
  h: number;
  /** 위에 올려 둘 수 있는 면의 높이(px). small 층이 여기에 놓인다. */
  surface?: number;
  /** 꼬마가 이 가구에 앉거나 누운 자리의 높이(px). 가구표에 pose가 있는 가구만. */
  seatZ?: number;
  /** small 층이지만 벽에도 걸 수 있다(박제·기념품 — 지금 방에서 벽·바닥 어디에나 놓이던 것). */
  wallOk?: boolean;
}

export const ISO_TILE = 40;

const wall = (w: number, h: number): IsoSpec => ({ layer: "wall", w, d: 0, h });
const small = (h: number, w = 0.5, d = 0.5): IsoSpec => ({ layer: "small", w, d, h });
const furn = (w: number, d: number, h: number, more: Partial<IsoSpec> = {}): IsoSpec => ({ layer: "furniture", w, d, h, ...more });

export const ISO: Readonly<Record<string, IsoSpec>> = {
  // ── 벽걸이
  "win-round": wall(2, 44),
  "win-wide": wall(2, 46),
  frame: wall(1, 35),
  clock: wall(1, 30),
  shelf: wall(1, 28),
  garland: wall(2, 22),
  painting: wall(1, 35),
  "wall-lamp": wall(1, 32),
  "star-light": wall(2, 22),
  banner: wall(1, 44),
  "babi-paw": wall(1, 30),
  "babi-leash": wall(1, 34),
  "go-stones": wall(1, 26),
  "hiking-watch": wall(1, 26),
  "reading-shelf": wall(2, 36),
  "fishing-rod": wall(1, 44),
  "calligraphy-brush": wall(1, 42),
  "baseball-ball": wall(1, 30),
  "baseball-bat": wall(2, 28),
  "tennis-racket": wall(1, 40),
  "blog-baseball": wall(1, 28),
  "play-chime": wall(1, 40),

  // ── 깔개
  rug: { layer: "rug", w: 3, d: 2, h: 0 },

  // ── 가구
  bed: furn(2, 3, 33, { seatZ: 16 }),
  sofa: furn(2, 1, 36, { seatZ: 18 }),
  desk: furn(2, 1, 29, { surface: 29 }),
  bookshelf: furn(1, 0.5, 80),
  wardrobe: furn(1, 1, 88),
  chair: furn(1, 1, 40, { seatZ: 20 }),
  table: furn(1, 1, 24, { surface: 24 }),
  lamp: furn(0.5, 0.5, 60),
  cushion: furn(1, 1, 6, { seatZ: 6 }),
  mailbox: furn(0.5, 0.5, 40),
  keyboard: furn(2, 1, 32, { seatZ: 0 }),
  piano: furn(2, 1, 48, { seatZ: 0 }),
  rocker: furn(1, 1, 40, { seatZ: 18 }),
  tent: furn(2, 2, 60, { seatZ: 8 }),
  drum: furn(1, 1, 26),
  lantern: furn(0.5, 0.5, 44),
  bench: furn(2, 1, 28, { seatZ: 16 }),
  showcase: furn(1, 0.5, 70),
  fountain: furn(2, 2, 36),
  "souvenir-case": furn(1, 0.5, 70),
  "lamp-reading": furn(0.5, 0.5, 64),
  "shelf-complete": furn(2, 0.5, 80),
  "babi-bed": furn(1, 1, 10),
  "go-board": furn(1, 1, 18, { surface: 18 }),
  "gukbap-table": furn(1, 1, 18, { surface: 18 }),
  "trout-aquarium": furn(2, 1, 40),
  "voice-tv": furn(2, 1, 44),
  "voice-mic": furn(0.5, 0.5, 48),

  // ── 올려 두는 것
  radio: small(13),
  can: small(16),
  picnic: small(18),
  fishbowl: small(24),
  "babi-mini": small(20),
  "hiking-pack": small(28),
  "hiking-boots": small(16),
  "reading-books": small(20),
  "reading-light": small(26),
  "fishing-bag": small(32),
  "puer-tea": small(16, 1, 0.5),
  "jade-inkstone": small(10),
  "soccer-ball": small(14),
  "blog-diary": small(8),
  "play-musicbox": small(20),
  ...Object.fromEntries(LIGHTSTICK_FURNITURE.map((f) => [f.id, small(34)])),

  // ── 특별한 책 — 금빛 독서대째로 바닥에 선다
  ...Object.fromEntries(BOOK_FURNITURE.map((f) => [f.id, furn(0.5, 0.5, 40)])),
};

/** 전시품(rules.ts의 ShownKind)의 층과 크기. 화분은 탁자에 올릴 수 있게 small, 나무는 바닥에 선다. */
export const SHOWN_ISO: Readonly<Record<"pot" | "tree" | "frame" | "trophy" | "souvenir", IsoSpec>> = {
  pot: small(26),
  tree: furn(1, 1, 64),
  frame: wall(1, 35),
  trophy: { ...small(30), wallOk: true },
  souvenir: { ...small(24), wallOk: true },
};

/** 그림 상자(px, 타일 40). 가로 (w+d)×20, 세로 (w+d)×10+h. 벽걸이는 가로 w×20, 세로 w×10+h. 기준점은 바닥의 앞 꼭짓점. */
export function isoBox(spec: IsoSpec): { w: number; h: number } {
  const span = spec.layer === "wall" ? spec.w : spec.w + spec.d;
  return { w: (span * ISO_TILE) / 2, h: (span * ISO_TILE) / 4 + spec.h };
}
