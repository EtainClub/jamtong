/**
 * 그림 파일로 그리는 가구 — `public/images/room/<art>.png`. 나머지 가구는 RoomSvg.tsx의 도형 그림 그대로다.
 *
 * ★ 가구 하나에 그림 하나, 움직이거나 방마다 달라지는 것이 없는 가구만 둔다.
 *   창문(창밖 날씨)·키보드(주인이 그린 키)·책(책마다 색)은 도형 그림이 그린다.
 * ★ 그림은 칸(w × 46px)의 네 배 해상도로 두고, 이 표의 높이 h 안에 비율을 지켜 넣는다.
 *   바닥 것은 아래 변에 서고(가운데 정렬), 벽 것은 y에서 시작한다(없으면 칸 가운데).
 * ★ 공유 카드(`/api/garden-card`)는 SVG를 이미지로 그리므로 주소를 data URI로 바꿔 넣는다(spriteDataUris).
 */

export interface FurnitureSprite {
  /** 그림이 차지할 수 있는 가장 큰 높이(px). 너비는 칸 너비 안에서 비율대로. */
  h: number;
  /** 벽 것의 위 변. 없으면 바닥 것은 아래 변에, 벽 것은 가운데에. */
  y?: number;
  wall?: boolean;
  /** 그림의 너비 ÷ 높이. glass가 있을 때 그림이 놓인 자리를 셈하는 데 쓴다. */
  ar?: number;
  /** 창문 유리 자리(그림 안 비율). 그림 아래에 창밖 날씨를 그리고, 유리는 그림에서 투명하게 뚫어 두었다. */
  glass?: { x: number; y: number; w: number; h: number; round?: boolean };
}

export const FURNITURE_SPRITES: Readonly<Record<string, FurnitureSprite>> = {
  // 바닥
  bed: { h: 38 },
  sofa: { h: 32 },
  desk: { h: 36 },
  bookshelf: { h: 46 },
  wardrobe: { h: 46 },
  chair: { h: 36 },
  table: { h: 26 },
  lamp: { h: 44 },
  rug: { h: 28 },
  can: { h: 20 },
  cushion: { h: 14 },
  radio: { h: 22 },
  mailbox: { h: 38 },
  piano: { h: 42 },
  picnic: { h: 22 },
  fishbowl: { h: 28 },
  rocker: { h: 38 },
  tent: { h: 46 },
  drum: { h: 26 },
  "lamp-reading": { h: 46 },
  "shelf-complete": { h: 46 },
  lantern: { h: 40 },
  bench: { h: 26 },
  showcase: { h: 46 },
  fountain: { h: 32 },
  // 이야기 소품·놀이 가구(stories.ts·activities.ts·lightsticks.ts) — 바닥
  "babi-mini": { h: 28 },
  "babi-bed": { h: 18 },
  "go-board": { h: 30 },
  "hiking-pack": { h: 32 },
  "hiking-boots": { h: 22 },
  "reading-books": { h: 30 },
  "reading-light": { h: 30 },
  "fishing-bag": { h: 40 },
  "gukbap-table": { h: 28 },
  "puer-tea": { h: 26 },
  "jade-inkstone": { h: 28 },
  "trout-aquarium": { h: 36 },
  "soccer-ball": { h: 22 },
  "blog-diary": { h: 28 },
  "led-blue": { h: 38 },
  "led-heart": { h: 38 },
  "led-star": { h: 38 },
  "led-rainbow": { h: 38 },
  "led-flower": { h: 38 },
  "led-wave": { h: 38 },
  "play-musicbox": { h: 32 },
  "voice-tv": { h: 40 },
  gacha: { h: 40 },
  "rare-jar": { h: 30 },
  "voice-mic": { h: 40 },
  "speech-screen": { h: 44 },
  // 이야기 소품·놀이 가구 — 벽
  "babi-paw": { h: 30, wall: true },
  "babi-leash": { h: 34, wall: true },
  "go-stones": { h: 26, wall: true },
  "hiking-watch": { h: 26, wall: true },
  "reading-shelf": { h: 36, wall: true },
  "fishing-rod": { h: 44, wall: true },
  "calligraphy-brush": { h: 42, wall: true },
  "baseball-ball": { h: 30, wall: true },
  "baseball-bat": { h: 28, wall: true },
  "tennis-racket": { h: 40, wall: true },
  "blog-baseball": { h: 28, wall: true },
  "play-chime": { h: 40, y: 0, wall: true },
  // 벽
  clock: { h: 30, wall: true },
  shelf: { h: 28, wall: true },
  garland: { h: 22, y: 2, wall: true },
  painting: { h: 34, wall: true },
  "wall-lamp": { h: 32, wall: true },
  "star-light": { h: 22, y: 2, wall: true },
  banner: { h: 44, wall: true },
  // 창문 — 틀만 그림. 유리 자리는 그림에서 뚫어 두고 아래에 창밖 날씨(RoomSvg의 Sky)를 그린다.
  "win-round": { h: 44, wall: true, ar: 0.942, glass: { x: 0.116, y: 0.154, w: 0.76, h: 0.719, round: true } },
  "win-wide": { h: 46, wall: true, ar: 1.656, glass: { x: 0.185, y: 0.203, w: 0.63, h: 0.605 } },
};

export const spriteHref = (art: string) => `/images/room/${art}.png`;

/** SVG 문자열 안의 가구 그림 주소를 data URI로 — 공유 카드가 SVG를 이미지로 그릴 때 바깥 파일을 읽지 못한다. */
export async function spriteDataUris(svg: string, read: (publicPath: string) => Promise<string>): Promise<string> {
  const paths = [...new Set(svg.match(/\/images\/room(?:-iso)?\/[a-z0-9-]+\.png/g) ?? [])];
  const uris = await Promise.all(paths.map((p) => read(`public${p}`)));
  return paths.reduce((s, p, i) => s.split(`"${p}"`).join(`"${uris[i]}"`), svg);
}
