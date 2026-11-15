export interface ShopTrack<Id extends string = string> {
  readonly id: Id;
  readonly label: string;
  readonly title: string;
  readonly artist: string;
  readonly license: string;
  readonly icon: string;
  readonly hint: string;
  readonly price: number;
  readonly duration: string;
  /** 정적 public 경로. Firebase Storage 경로를 쓰는 곡은 storagePath를 둔다. */
  readonly src?: string;
  /** Firebase Storage 객체 경로(예: bgm/catalog/together-road.mp3). */
  readonly storagePath?: string;
  readonly source?: string;
}

/** CC0 원문과 잼통 AI 음원을 담은 상점 목록. 재생할 때만 스트리밍한다. */
export const MUSIC_SHOP = [
  { id: "song-together-road", label: "우리 함께 나아갈 길", title: "우리 함께 나아갈 길", artist: "잼통 AI 스튜디오", license: "AI 창작곡", icon: "🎤", hint: "함께 걸어가는 따뜻한 한국어 가요", price: 1000, duration: "2:57", storagePath: "bgm/catalog/together-road.mp3" },
  // 2026-11-15 추가. 원본은 assets/노래/, 올린 파일의 해시는 docs/garden-miniroom.md "상점 음원" 절.
  { id: "song-window-sunlight", label: "창가에 내린 햇살", title: "창가에 내린 햇살", artist: "잼통 AI 스튜디오", license: "AI 창작곡", icon: "🌤", hint: "창가에 햇살이 드는 아침 같은 노래", price: 1000, duration: "2:58", storagePath: "bgm/catalog/window-sunlight.mp3" },
  { id: "song-rain-rest", label: "단비처럼 찾아온 쉼표", title: "단비처럼 찾아온 쉼표", artist: "잼통 AI 스튜디오", license: "AI 창작곡", icon: "🌧", hint: "단비처럼 잠시 쉬어 가는 노래", price: 1000, duration: "2:48", storagePath: "bgm/catalog/rain-rest.mp3" },
  { id: "song-gift-of-today", label: "오늘이라는 선물", title: "오늘이라는 선물", artist: "잼통 AI 스튜디오", license: "AI 창작곡", icon: "🎁", hint: "오늘 하루를 선물처럼 맞는 노래", price: 1000, duration: "2:59", storagePath: "bgm/catalog/gift-of-today.mp3" },
  { id: "song-little-star-room", label: "작은 별의 방", title: "작은 별의 방", artist: "잼통 AI 스튜디오", license: "AI 창작곡", icon: "⭐", hint: "작은 방에 별빛이 내려앉는 노래", price: 1000, duration: "2:34", storagePath: "bgm/catalog/little-star-room.mp3" },
  { id: "song-dazzling-moment", label: "눈부신 이 순간", title: "눈부신 이 순간", artist: "잼통 AI 스튜디오", license: "AI 창작곡", icon: "✨", hint: "지금 이 순간을 반짝이게 하는 노래", price: 1000, duration: "2:58", storagePath: "bgm/catalog/dazzling-moment.mp3" },
  { id: "record-piano", label: "물망초 피아노", title: "Forget Me Not", artist: "Kistol", license: "CC0", icon: "🎹", hint: "부드럽고 아련한 피아노 선율", price: 800, duration: "2:04", storagePath: "bgm/catalog/forget-me-not.mp3", source: "https://opengameart.org/content/forget-me-not" },
  { id: "record-jazz", label: "작은 방 재즈", title: "Jazz", artist: "Julie Damsgaard / Spring Spring", license: "CC0", icon: "🎷", hint: "피아노와 베이스가 어우러진 가벼운 스윙", price: 700, duration: "1:12", storagePath: "bgm/catalog/jazz.mp3", source: "https://opengameart.org/content/jazz-1" },
  { id: "record-acoustic", label: "햇살 어쿠스틱", title: "Revelation", artist: "Indieteur", license: "CC0", icon: "🎸", hint: "차분하고 따뜻한 어쿠스틱 연주", price: 900, duration: "1:25", storagePath: "bgm/catalog/revelation.mp3", source: "https://opengameart.org/content/revelation" },
  { id: "record-chill", label: "느긋한 오후", title: "chill", artist: "Alex McCulloch", license: "CC0", icon: "☁️", hint: "편안하게 흐르는 느긋한 칠 음악", price: 600, duration: "1:46", storagePath: "bgm/catalog/chill.mp3", source: "https://opengameart.org/content/chill-1" },
  { id: "record-pond", label: "연못의 휴식", title: "Feel good slow ambient track with a beat", artist: "annandistance", license: "CC0", icon: "🪷", hint: "잔잔한 비트와 포근한 앰비언트", price: 1000, duration: "1:55", storagePath: "bgm/catalog/pond.mp3", source: "https://opengameart.org/content/feel-good-slow-ambient-track-with-a-beat" },
] as const satisfies readonly ShopTrack[];

export type PurchasedTrackId = (typeof MUSIC_SHOP)[number]["id"];
export type FreeTrackId = "orgel" | "waltz" | "walk" | "lullaby" | "festival";
/** Public room ids only, never arbitrary file URLs. */
export type GardenTrackId = FreeTrackId | PurchasedTrackId;
export const DEFAULT_TRACK: GardenTrackId = "orgel";
export const FREE_TRACKS: readonly FreeTrackId[] = ["orgel", "waltz", "walk", "lullaby", "festival"];
export const TRACK_ORDER: readonly GardenTrackId[] = [...FREE_TRACKS, ...MUSIC_SHOP.map((t) => t.id)];
export const purchasedTrack = (id: string): ShopTrack<PurchasedTrackId> | undefined => MUSIC_SHOP.find((t) => t.id === id);

export function ownedMusic(raw: unknown): PurchasedTrackId[] {
  return Array.isArray(raw) ? MUSIC_SHOP.filter((t) => raw.includes(t.id)).map((t) => t.id) : [];
}

export function canUseTrack(id: unknown, owned: readonly PurchasedTrackId[] = []): id is GardenTrackId {
  return isGardenTrack(id) && (!purchasedTrack(id) || owned.includes(id as PurchasedTrackId));
}

export function isGardenTrack(id: unknown): id is GardenTrackId {
  return typeof id === "string" && TRACK_ORDER.some((track) => track === id);
}
