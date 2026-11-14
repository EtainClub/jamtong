/**
 * 방에 놓는 산 것(가구)과 오늘의 기분. 설계는 docs/garden-miniroom.md §4.2.
 *
 * ★ 화면은 이 표에 있는 id만 그린다. 공개 문서에는 아무 값이나 담길 수 있다 —
 *   품종표처럼, 표에 없는 id는 그리지 않는다.
 * ★ 가구는 꾸밈일 뿐 효과가 없다. 몇 가지는 바로가기(책장 → 도감, 라디오 → 음악, 키보드 → 키 누르기)다.
 *   효과가 아니라 길이다. 성장 버프를 가구에 달면 방이 스펙이 된다.
 * ★ 무작위로 나오는 것(뽑기)은 두지 않는다. 보이는 것을 정해진 값에 산다.
 * ★ 그림은 RoomArt.tsx가 art 열쇠로 그린다. 잼통 고유의 그림이다.
 */

/**
 * wall=벽에 거는 것, floor=바닥에 놓는 것, window=벽 2칸 창문,
 * wallpaper·flooring=통째로 바뀌는 벽지·바닥재, frame-blank=쪽지를 거는 빈 액자틀(놓지 않고 쓴다),
 * fx=거대 잡초 필살기 연출(방에 놓지 않는다 — 싸움터의 그림만 바뀐다).
 */
export type FurnitureKind = "wall" | "floor" | "window" | "wallpaper" | "flooring" | "frame-blank" | "fx";

/** 바로가기. 눌렀을 때 가는 곳. */
export type Shortcut = "dex" | "music" | "guestbook" | "keyboard";

export interface Furniture {
  id: string;
  label: string;
  kind: FurnitureKind;
  /** 차지하는 칸. 벽지·바닥재·액자틀은 1로 둔다(놓지 않는다). */
  size: 1 | 2;
  /** 잼(cur가 root면 뿌리 조각). 0이고 cur가 없으면 처음부터 가진 것. */
  price: number;
  /**
   * 잼이 아닌 것. root=🏆 전리품 — 뿌리 조각으로만 산다(docs/garden-miniroom.md §7.4).
   * reward=팔지 않는다 — 여섯 박제를 다 모으면 받는다.
   */
  cur?: "root" | "reward";
  /** RoomArt의 그림 열쇠. */
  art: string;
  hint: string;
  /** 주마다 바뀌는 진열에서만 산다(weeklyPicks). */
  weekly?: boolean;
  /** 이날(한국 날짜, 그날 포함)까지 상점 가구 맨 위 "새로 들어온 가구"에 NEW로 보인다. 목록 한가운데 묻히지 않게. */
  newUntil?: string;
  shortcut?: Shortcut;
}

export const FURNITURE: Furniture[] = [
  // 벽지
  { id: "wp-cream", label: "크림 벽지", kind: "wallpaper", size: 1, price: 0, art: "wp-cream", hint: "처음 방의 벽지예요." },
  { id: "wp-stripe", label: "연두 줄무늬 벽지", kind: "wallpaper", size: 1, price: 150, art: "wp-stripe", hint: "텃밭 생각이 나는 연두 줄무늬." },
  { id: "wp-dot", label: "하늘 물방울 벽지", kind: "wallpaper", size: 1, price: 200, art: "wp-dot", hint: "단비 오는 날의 물방울." },
  { id: "wp-check", label: "체크 벽지", kind: "wallpaper", size: 1, price: 250, art: "wp-check", hint: "다이어리 속지 같은 체크." },
  { id: "wp-brick", label: "벽돌 벽지", kind: "wallpaper", size: 1, price: 350, art: "wp-brick", hint: "든든한 붉은 벽돌." },
  { id: "wp-night", label: "밤하늘 벽지", kind: "wallpaper", size: 1, price: 600, art: "wp-night", hint: "별똥별 기다리는 밤." },
  { id: "wp-rainbow", label: "무지개 벽지", kind: "wallpaper", size: 1, price: 1200, art: "wp-rainbow", hint: "이번 주에만 들어오는 벽지.", weekly: true },
  // 바닥재
  { id: "fl-wood", label: "나무 마루", kind: "flooring", size: 1, price: 0, art: "fl-wood", hint: "처음 방의 마루예요." },
  { id: "fl-tile", label: "하늘 타일", kind: "flooring", size: 1, price: 200, art: "fl-tile", hint: "시원한 타일 바닥." },
  { id: "fl-grass", label: "잔디 바닥", kind: "flooring", size: 1, price: 300, art: "fl-grass", hint: "방 안에도 정원을." },
  { id: "fl-carpet", label: "주황 카펫", kind: "flooring", size: 1, price: 400, art: "fl-carpet", hint: "폭신한 주황 카펫." },
  { id: "fl-cloud", label: "구름 바닥", kind: "flooring", size: 1, price: 900, art: "fl-cloud", hint: "이번 주에만 들어오는 바닥재.", weekly: true },
  // 창문 (벽 2칸)
  { id: "win-round", label: "둥근 창", kind: "window", size: 2, price: 300, art: "win-round", hint: "창밖에 지금 날씨가 보여요. 단비·별똥별도." },
  { id: "win-wide", label: "넓은 창", kind: "window", size: 2, price: 800, art: "win-wide", hint: "커튼 달린 넓은 창. 창밖은 지금 날씨." },
  // 벽에 거는 것
  { id: "frame", label: "빈 액자틀", kind: "frame-blank", size: 1, price: 30, art: "frame", hint: "도감의 쪽지를 액자에 걸어요. 도감 → 쪽지 → ‘액자에 걸기’." },
  { id: "clock", label: "벽시계", kind: "wall", size: 1, price: 180, art: "clock", hint: "똑딱똑딱 둥근 시계." },
  { id: "shelf", label: "벽 선반", kind: "wall", size: 1, price: 220, art: "shelf", hint: "작은 화분을 올려 둔 선반." },
  { id: "garland", label: "꽃줄", kind: "wall", size: 2, price: 150, art: "garland", hint: "벽에 늘어뜨린 꽃줄." },
  { id: "painting", label: "언덕 그림", kind: "wall", size: 1, price: 260, art: "painting", hint: "정원 언덕을 그린 그림." },
  { id: "wall-lamp", label: "벽등", kind: "wall", size: 1, price: 120, art: "wall-lamp", hint: "은은한 벽등." },
  { id: "star-light", label: "별 조명", kind: "wall", size: 2, price: 400, art: "star-light", hint: "이번 주에만 들어오는 조명.", weekly: true },
  // 바닥에 놓는 것
  { id: "bed", label: "침대", kind: "floor", size: 2, price: 900, art: "bed", hint: "폭신한 이불을 덮은 침대." },
  { id: "sofa", label: "소파", kind: "floor", size: 2, price: 700, art: "sofa", hint: "둘이 앉는 하늘색 소파." },
  { id: "desk", label: "책상", kind: "floor", size: 2, price: 500, art: "desk", hint: "숙제도 하고 그림도 그리는 책상." },
  { id: "bookshelf", label: "책장", kind: "floor", size: 1, price: 600, art: "bookshelf", hint: "누르면 도감이 열려요.", shortcut: "dex" },
  { id: "wardrobe", label: "옷장", kind: "floor", size: 1, price: 1200, art: "wardrobe", hint: "두 짝 문 옷장." },
  { id: "chair", label: "나무 의자", kind: "floor", size: 1, price: 200, art: "chair", hint: "등받이가 있는 나무 의자." },
  { id: "table", label: "동그란 탁자", kind: "floor", size: 1, price: 350, art: "table", hint: "차 한 잔 놓는 탁자." },
  { id: "lamp", label: "스탠드", kind: "floor", size: 1, price: 120, art: "lamp", hint: "노란 갓을 씌운 스탠드." },
  { id: "rug", label: "둥근 러그", kind: "floor", size: 2, price: 150, art: "rug", hint: "바닥에 까는 둥근 러그." },
  { id: "can", label: "물뿌리개", kind: "floor", size: 1, price: 50, art: "can", hint: "정원지기의 물뿌리개." },
  { id: "cushion", label: "방석", kind: "floor", size: 1, price: 60, art: "cushion", hint: "앉기 좋은 동그란 방석." },
  { id: "radio", label: "라디오", kind: "floor", size: 1, price: 300, art: "radio", hint: "누르면 정원 음악을 켜고 꺼요.", shortcut: "music" },
  { id: "mailbox", label: "우편함", kind: "floor", size: 1, price: 250, art: "mailbox", hint: "누르면 방명록으로 가요.", shortcut: "guestbook" },
  { id: "keyboard", label: "내 키보드", kind: "floor", size: 2, price: 400, art: "keyboard", hint: "키 네 개에 그림을 그리고 소리를 골라요. 손님도 눌러 볼 수 있어요.", shortcut: "keyboard", newUntil: "2026-12-14" },
  { id: "piano", label: "피아노", kind: "floor", size: 2, price: 1500, art: "piano", hint: "건반 여든여덟 개." },
  { id: "picnic", label: "피크닉 바구니", kind: "floor", size: 1, price: 450, art: "picnic", hint: "이번 주에만 들어오는 소품.", weekly: true },
  { id: "fishbowl", label: "어항", kind: "floor", size: 1, price: 800, art: "fishbowl", hint: "이번 주에만 들어오는 어항.", weekly: true },
  { id: "rocker", label: "흔들의자", kind: "floor", size: 1, price: 900, art: "rocker", hint: "이번 주에만 들어오는 흔들의자.", weekly: true },
  { id: "tent", label: "방 안 텐트", kind: "floor", size: 2, price: 2000, art: "tent", hint: "이번 주에만 들어오는 작은 텐트.", weekly: true },
  // 🏆 전리품 — 뿌리 조각으로만(잼으로 사지 못하고 남에게 주지 못한다). 꾸밈일 뿐 효과는 없다.
  { id: "wp-vine", label: "덩굴무늬 벽지", kind: "wallpaper", size: 1, price: 10, cur: "root", art: "wp-vine", hint: "거대 잡초를 이긴 덩굴무늬. 뿌리 조각으로만 바꿔요." },
  { id: "fl-plaza", label: "광장 돌바닥", kind: "flooring", size: 1, price: 8, cur: "root", art: "fl-plaza", hint: "광장의 네모 돌. 뿌리 조각으로만 바꿔요." },
  { id: "banner", label: "광장 깃발", kind: "wall", size: 1, price: 5, cur: "root", art: "banner", hint: "함께 지킨 광장의 깃발." },
  { id: "drum", label: "응원 북", kind: "floor", size: 1, price: 6, cur: "root", art: "drum", hint: "싸움터에서 두드리던 그 북." },
  { id: "lantern", label: "광장 등불", kind: "floor", size: 1, price: 8, cur: "root", art: "lantern", hint: "밤 광장을 밝히던 등불." },
  { id: "bench", label: "광장 벤치", kind: "floor", size: 2, price: 12, cur: "root", art: "bench", hint: "다 같이 쉬던 광장 벤치." },
  { id: "showcase", label: "전리품 진열장", kind: "floor", size: 1, price: 15, cur: "root", art: "showcase", hint: "유리문 달린 진열장." },
  { id: "fountain", label: "작은 분수", kind: "floor", size: 2, price: 25, cur: "root", art: "fountain", hint: "광장 한가운데의 분수를 방으로." },
  { id: "fx-petal", label: "꽃잎 필살기", kind: "fx", size: 1, price: 20, cur: "root", art: "🌸", hint: "필살기를 쓸 때 꽃잎이 흩날려요. 그림만 바뀌고 세기는 같아요." },
  { id: "fx-star", label: "별빛 필살기", kind: "fx", size: 1, price: 30, cur: "root", art: "🌟", hint: "필살기를 쓸 때 별빛이 터져요. 그림만 바뀌고 세기는 같아요." },
  // 팔지 않는 것 — 여섯 악초의 박제를 다 모으면(raid/rules.ts의 TROPHY_WALLPAPER).
  { id: "wp-guard", label: "광장을 지킨 방", kind: "wallpaper", size: 1, price: 0, cur: "reward", art: "wp-guard", hint: "여섯 악초의 박제를 다 모은 사람의 벽지." },
];

export const FURNITURE_BY_ID = new Map(FURNITURE.map((f) => [f.id, f]));

export const DEFAULT_WALL = "wp-cream";
export const DEFAULT_FLOOR = "fl-wood";
export const FRAME_BLANK = "frame";

/** 오늘의 기분. 정해 둔 열둘에서 고른다 — 글을 짓지 않는다. */
export const MOODS: Array<{ id: string; icon: string; label: string }> = [
  { id: "easy", icon: "🌤", label: "느긋" },
  { id: "happy", icon: "😊", label: "신남" },
  { id: "proud", icon: "🏅", label: "뿌듯" },
  { id: "calm", icon: "🍵", label: "차분" },
  { id: "excited", icon: "🎉", label: "두근두근" },
  { id: "focus", icon: "📚", label: "집중" },
  { id: "thanks", icon: "💐", label: "고마워" },
  { id: "busy", icon: "🏃", label: "바빠" },
  { id: "sleepy", icon: "😴", label: "졸려" },
  { id: "hungry", icon: "🍙", label: "배고파" },
  { id: "rainy", icon: "🌧", label: "촉촉" },
  { id: "tired", icon: "🫖", label: "쉬는 중" },
];

export const DEFAULT_MOOD = MOODS[0].id;

export function moodOf(id: string): { id: string; icon: string; label: string } {
  return MOODS.find((m) => m.id === id) ?? MOODS[0];
}

/** 방 넓히기. 6칸 → 8칸 → 10칸(벽 한 줄의 칸 수, 바닥은 두 줄). */
export const ROOM_SIZES = [
  { width: 6, price: 0, label: "작은 방" },
  { width: 8, price: 1500, label: "넓은 방" },
  { width: 10, price: 5000, label: "볕 드는 방" },
] as const;
