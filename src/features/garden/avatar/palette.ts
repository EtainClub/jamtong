/**
 * 꼬마의 색. 설계는 docs/garden-avatar.md §3.3.
 *
 * ★ 부위 그림은 색을 직접 적지 않고 색 칸 글자를 적는다. 그리는 쪽이 고른 색으로 바꾼다.
 * ★ 색 값은 room/RoomSvg.tsx의 ROOM_COLORS와 같다(그 파일이 꼬마를 그리므로 import하면 순환한다).
 * ★ 피부색·머리색은 값을 받지 않는다 — 바꾸는 데 잼이 들면 피부색이 "비싼 것과 싼 것"이 된다.
 */

/** [바탕, 그늘] */
export type Tone = readonly [string, string];

/** 피부 여섯 + 상상 색 둘(하늘·연두). 순서가 공개 문자열의 번호다 — 뒤에만 더한다. */
export const SKINS: readonly Tone[] = [
  ["#ffe3cc", "#f2c3a0"],
  ["#f9d3b0", "#e5b089"],
  ["#f0c08f", "#d49d6c"],
  ["#d9a06a", "#b97f4e"],
  ["#b07a4b", "#8c5a33"],
  ["#7d5234", "#5e3b22"],
  ["#bfe6f7", "#8cc6e0"],
  ["#cdeebb", "#9fcf89"],
];

export const SKIN_NAMES = ["아주 밝은", "밝은", "중간 밝은", "중간", "어두운", "아주 어두운", "하늘", "연두"] as const;

/** 머리색 열. 순서가 공개 문자열의 번호다. */
export const HAIR_COLORS: readonly Tone[] = [
  ["#3a3436", "#1f1b1c"],
  ["#5b3a29", "#3d2519"],
  ["#8a5a3b", "#663f27"],
  ["#b5683f", "#8c4b2a"],
  ["#f2cf6b", "#cfa53e"],
  ["#b7b2ad", "#8e8883"],
  ["#c9493c", "#982f25"],
  ["#f39cc0", "#d16e97"],
  ["#6f9fe0", "#4a76b8"],
  ["#7fbf6a", "#55964a"],
];

export const HAIR_COLOR_NAMES = ["검정", "고동", "갈색", "밤색", "금빛", "잿빛", "빨강", "분홍", "파랑", "초록"] as const;

/** 옷 색 열둘. 색 고르기가 되는 옷이 이 안에서 고른다. */
export const CLOTHS: readonly Tone[] = [
  ["#ffffff", "#cfd5da"],
  ["#fff3d6", "#e2c99a"],
  ["#9fd8f2", "#2f9bd8"],
  ["#ffb36b", "#f47b20"],
  ["#86c46d", "#3f8a4a"],
  ["#f5a3c0", "#d9708f"],
  ["#ffd85c", "#d9a62e"],
  ["#c3b3ea", "#9b86d1"],
  ["#4a5c94", "#2b3a67"],
  ["#e57a6e", "#b9443a"],
  ["#d39a5e", "#9a6439"],
  ["#8e979e", "#5f676d"],
];

export const CLOTH_NAMES = ["흰", "크림", "하늘", "주황", "초록", "분홍", "노랑", "보라", "남색", "빨강", "갈색", "회색"] as const;

/** 어느 부위에서나 같은 색. 그림 글자 → 색. */
export const FIXED: Readonly<Record<string, string>> = {
  o: "#3a2f2a",
  k: "#2a211d",
  w: "#ffffff",
  p: "#f5a3c0",
  r: "#d9574a",
  y: "#ffd85c",
  Y: "#d9a62e",
  g: "#86c46d",
  G: "#3f8a4a",
  e: "#8e979e",
  E: "#cfd5da",
  d: "#d39a5e",
  D: "#9a6439",
  n: "#2b3a67",
  R: "#d9574a",
  P: "#f5a3c0",
  v: "#9b86d1",
  l: "#9fd8f2",
  L: "#2f9bd8",
  q: "#ffd700",
};

/** 번호가 어긋나면 첫 색. 공개 문서에는 아무 숫자나 올 수 있다. */
export function pick(list: readonly Tone[], i: number | undefined): Tone {
  return (Number.isInteger(i) && list[i!]) || list[0];
}
