import type { Tone } from "./palette";
import type { Sprite } from "./sprites";

/**
 * 꼬마의 옷장 표. 설계는 docs/garden-avatar.md §6.3·§7.
 *
 * ★ 화면은 이 표에 있는 id만 그린다. 공개 문서에는 아무 값이나 담길 수 있다.
 * ★ id는 [a-z0-9-] 12자까지 — 공개 문자열(rules.ts의 packAvatar)과 규칙의 정규식이 받는 글자다.
 * ★ 순서를 바꿔도 되지만 id는 바꾸지 않는다(공개 문서와 장부가 id로 가리킨다).
 * ★ 실존 인물을 본뜬 얼굴·옷, 정당·기호를 그린 옷을 두지 않는다(§9). 효과는 없다 — 꾸밈일 뿐.
 * ★ 그림 글자: h·H 머리색, a·A 윗옷, b·B 아랫옷, f·F 신발, c·C 그 옷의 덧색(accent), 나머지는 palette.ts의 FIXED.
 */

export type Part = "hair" | "eyes" | "top" | "bottom" | "shoes" | "hat" | "face" | "held" | "bubble";

export const PARTS: Array<{ id: Part; label: string; optional: boolean }> = [
  { id: "hair", label: "머리", optional: false },
  { id: "eyes", label: "눈", optional: false },
  { id: "top", label: "윗옷", optional: false },
  { id: "bottom", label: "아랫옷", optional: false },
  { id: "shoes", label: "신발", optional: false },
  { id: "hat", label: "모자", optional: true },
  { id: "face", label: "소품", optional: true },
  { id: "held", label: "든 것", optional: true },
  { id: "bubble", label: "말풍선", optional: false },
];

/** 팔지 않는 옷 — 장부의 조건으로 열린다. */
export type Reward =
  | { kind: "title"; title: "dex" | "storm" | "plaza"; level: number }
  | { kind: "golden" }
  | { kind: "trophies"; n: number };

export interface Wear {
  id: string;
  part: Part;
  label: string;
  /** 0이고 cur가 없으면 처음부터 가진 것. cur가 root면 뿌리 조각. */
  price: number;
  cur?: "root" | "reward";
  reward?: Reward;
  /** 색 고르기가 되는 옷(윗옷·아랫옷·신발). */
  tint?: boolean;
  /** 옷 색(palette.ts CLOTHS의 번호). tint면 처음 색. */
  color?: number;
  /** c·C 글자의 색. */
  accent?: Tone;
  /** 앞 그림(머리카락 앞·옷 무늬·모자·얼굴 소품). */
  front?: Sprite;
  /** 몸 뒤에 그리는 그림(머리카락 뒤). */
  back?: Sprite;
  /** 손에 든 것. 손 자리에서 dx·dy만큼 옮겨 그린다. */
  held?: { dx: number; dy: number; rows: readonly string[] };
  /** 모자가 머리카락을 모두 가린다(우비 모자). */
  hideHair?: boolean;
  hint: string;
  newUntil?: string;
}

const r = (s: string, n: number) => s.repeat(n);

// ── 머리카락 ─────────────────────────────────────────────────────────

const SHORT_TOP = [
  "....oooooooo....",
  "..oohhhhhhhhoo..",
  ".ohhhhhhhhhhhho.",
  "ohhhhhhhhhhhhhho",
  "ohhHHHHHHHHHHhho",
];
const SHORT: Sprite = { x: 2, y: 1, rows: [...SHORT_TOP, "ohh..........hho", ".oh..........ho."] };
const BOB: Sprite = { x: 2, y: 1, rows: [...SHORT_TOP, "ohh..........hho", "ohh..........hho", "ohh..........hho", "ohh..........hho", "ohH..........Hho", ".oo..........oo."] };

const HAIR: Wear[] = [
  { id: "short", part: "hair", label: "짧은 머리", price: 0, front: SHORT, hint: "단정한 짧은 머리." },
  { id: "bob", part: "hair", label: "단발", price: 0, front: BOB, hint: "턱까지 오는 단발." },
  {
    id: "pony", part: "hair", label: "묶은 머리", price: 0, front: SHORT,
    back: { x: 16, y: 4, rows: [".oo.", "ohho", "ohho", "ohho", "ohHo", ".oho", ".oHo", "..o."] },
    hint: "뒤로 하나로 묶은 머리.",
  },
  {
    id: "curly", part: "hair", label: "곱슬머리", price: 0,
    front: {
      x: 1, y: 0,
      rows: [
        "....oo..oo..oo....",
        "...ohhoohhoohho...",
        "..o" + r("h", 12) + "o..",
        ".o" + r("h", 14) + "o.",
        "o" + r("h", 16) + "o",
        "ohhhHhHHhHHhHhhhho",
        "ohhh" + r(".", 10) + "hhho",
        "ohhh" + r(".", 10) + "hhho",
        ".ohh" + r(".", 10) + "hho.",
        "..oo" + r(".", 10) + "oo..",
      ],
    },
    hint: "몽글몽글 곱슬머리.",
  },
  {
    id: "messy", part: "hair", label: "더벅머리", price: 0,
    front: {
      x: 2, y: 0,
      rows: ["....oo.oo.oo....", "...ohhohhohho...", ...SHORT_TOP.slice(1), "ohh.H......H.hho", ".oh..........ho."],
    },
    hint: "막 일어난 듯한 더벅머리.",
  },
  {
    id: "braid", part: "hair", label: "땋은 머리", price: 0, front: SHORT,
    back: {
      x: 0, y: 7,
      rows: [
        ".oho" + r(".", 12) + "oho.",
        ".oho" + r(".", 12) + "oho.",
        ".oHo" + r(".", 12) + "oHo.",
        ".oho" + r(".", 12) + "oho.",
        ".oHo" + r(".", 12) + "oHo.",
        ".oho" + r(".", 12) + "oho.",
        "..o" + r(".", 14) + "o..",
      ],
    },
    hint: "양쪽으로 길게 땋은 머리.",
  },
  {
    id: "twin", part: "hair", label: "양 갈래", price: 250, front: SHORT,
    back: {
      x: 0, y: 3,
      rows: [
        ".oo" + r(".", 14) + "oo.",
        "ohho" + r(".", 12) + "ohho",
        "ohho" + r(".", 12) + "ohho",
        "ohHo" + r(".", 12) + "oHho",
        "ohho" + r(".", 12) + "ohho",
        ".oho" + r(".", 12) + "oho.",
        ".oHo" + r(".", 12) + "oHo.",
        "..o" + r(".", 14) + "o..",
      ],
    },
    hint: "양쪽으로 묶은 머리.",
  },
  {
    id: "bun", part: "hair", label: "올림머리", price: 300,
    front: { x: 2, y: 0, rows: ["......oooo......", "....oohhhhoo....", ...SHORT_TOP.slice(1), "ohh..........hho", ".oh..........ho."] },
    hint: "머리 위로 동그랗게 올린 머리.",
  },
  {
    id: "long", part: "hair", label: "긴 생머리", price: 400, front: BOB,
    back: { x: 0, y: 4, rows: [...Array.from({ length: 12 }, () => "ohh" + r(".", 14) + "hho"), ".oo" + r(".", 14) + "oo."] },
    hint: "어깨 아래까지 내려오는 머리.",
  },
  {
    id: "starband", part: "hair", label: "별 머리띠 머리", price: 500,
    front: { x: 2, y: 1, rows: ["....oooooooo....", "..oohhhhhhqhoo..", ".o" + r("y", 12) + "o.", ...SHORT_TOP.slice(3), "ohh..........hho", ".oh..........ho."] },
    hint: "노란 머리띠에 작은 금별.",
  },
];

// ── 눈(그림은 sprites.ts의 EYE_STYLES) ────────────────────────────────

const EYES: Wear[] = [
  { id: "dot", part: "eyes", label: "콩 눈", price: 0, hint: "작고 까만 콩 같은 눈." },
  { id: "round", part: "eyes", label: "동그란 눈", price: 0, hint: "반짝 빛이 드는 동그란 눈." },
  { id: "lash", part: "eyes", label: "속눈썹 눈", price: 0, hint: "속눈썹이 살짝 있는 눈." },
  { id: "tall", part: "eyes", label: "길쭉한 눈", price: 0, hint: "세로로 길쭉한 눈." },
];

// ── 윗옷 — 몸통(x6–13, y13–18) 위 무늬. 소매는 몸 그림이 옷 색으로 그린다 ──

const torso = (rows: string[]): Sprite => ({ x: 6, y: 13, rows });

const TOPS: Wear[] = [
  { id: "tee", part: "top", label: "반팔 티", price: 0, tint: true, color: 2, hint: "색을 고르는 반팔 티." },
  { id: "stripe", part: "top", label: "줄무늬 티", price: 0, tint: true, color: 3, front: torso(["........", "........", ".wwwwww.", "........", ".wwwwww.", "........"]), hint: "흰 줄 두 개." },
  { id: "shirt", part: "top", label: "깃 셔츠", price: 0, tint: true, color: 0, front: torso([".ww..ww.", "..w..w..", "...ee...", "........", "...ee...", "........"]), hint: "깃이 달린 셔츠." },
  { id: "apron", part: "top", label: "정원사 앞치마", price: 300, tint: true, color: 1, front: torso(["..g..g..", "..gggg..", ".gggggg.", ".gGGGGg.", ".gggggg.", ".gggggg."]), hint: "주머니 달린 초록 앞치마." },
  { id: "knit", part: "top", label: "무늬 스웨터", price: 350, tint: true, color: 9, front: torso(["........", "........", ".w.ww.w.", "..w..w..", ".w.ww.w.", "........"]), hint: "흰 마름모 무늬 스웨터." },
  { id: "hoodie", part: "top", label: "후드티", price: 400, tint: true, color: 7, front: torso([".AwAAwA.", "...ww...", "........", ".AAAAAA.", ".A....A.", "........"]), hint: "끈과 앞주머니가 있는 후드티." },
  { id: "overalls", part: "top", label: "멜빵", price: 450, tint: true, color: 0, accent: ["#4a5c94", "#2b3a67"], front: torso([".c....c.", ".c....c.", ".cyccyc.", ".cccccc.", ".cCCCCc.", ".cccccc."]), hint: "단추 두 개 달린 청 멜빵." },
  { id: "jeogori", part: "top", label: "저고리", price: 800, tint: true, color: 5, front: torso([".w....w.", "..w..w..", "...ww...", "...RR...", "..R..R..", "........"]), hint: "흰 깃과 빨간 고름." },
  { id: "plazavest", part: "top", label: "광장 조끼", price: 10, cur: "root", color: 0, front: torso([".y....y.", ".yy..yy.", ".yyyyyy.", ".EEEEEE.", ".yyyyyy.", ".yyyyyy."]), hint: "거대 잡초를 함께 잡던 광장의 노란 조끼." },
];

// ── 아랫옷 ───────────────────────────────────────────────────────────

const skirt = (b: string): Sprite => ({ x: 5, y: 19, rows: [".o" + b + "o.", "o" + b + "bbo", ".ossoosso."] });

const BOTTOMS: Wear[] = [
  { id: "pants", part: "bottom", label: "긴 바지", price: 0, tint: true, color: 8, hint: "색을 고르는 긴 바지." },
  { id: "shorts", part: "bottom", label: "반바지", price: 0, tint: true, color: 10, front: { x: 6, y: 21, rows: ["ossoosso"] }, hint: "무릎 위 반바지." },
  { id: "skirt", part: "bottom", label: "치마", price: 0, tint: true, color: 5, front: skirt("bbbbbb"), hint: "살랑이는 치마." },
  { id: "jeans", part: "bottom", label: "청바지", price: 150, color: 8, front: { x: 6, y: 19, rows: [".l....l."] }, hint: "주머니 박음질이 보이는 청바지." },
  { id: "checkskirt", part: "bottom", label: "체크 치마", price: 250, color: 9, front: { x: 5, y: 19, rows: [".obwbwbwo.", "obwbwbwbwo", ".ossoosso."] }, hint: "빨간 체크 치마." },
  { id: "longskirt", part: "bottom", label: "긴 치마", price: 600, tint: true, color: 7, front: { x: 4, y: 19, rows: ["..obbbbbbo..", ".obbbbbbbbo.", "obbbbbbbbbbo"] }, hint: "발목까지 오는 긴 치마." },
];

// ── 신발 ─────────────────────────────────────────────────────────────

const SHOES: Wear[] = [
  { id: "sneaker", part: "shoes", label: "운동화", price: 0, tint: true, color: 9, front: { x: 8, y: 22, rows: ["w..w"] }, hint: "흰 코가 있는 운동화." },
  { id: "socks", part: "shoes", label: "양말과 단화", price: 0, tint: true, color: 10, front: { x: 6, y: 21, rows: ["owwoowwo"] }, hint: "흰 양말에 단화." },
  { id: "boots", part: "shoes", label: "장화", price: 200, color: 6, front: { x: 6, y: 21, rows: ["offooffo"] }, hint: "물웅덩이도 괜찮은 노란 장화." },
  { id: "gomusin", part: "shoes", label: "고무신", price: 150, color: 0, hint: "하얀 고무신." },
];

// ── 모자 ─────────────────────────────────────────────────────────────

const HATS: Wear[] = [
  {
    id: "straw", part: "hat", label: "밀짚모자", price: 300,
    front: { x: 1, y: 0, rows: [".....oooooooo.....", "....oyyyyyyyyo....", "....oRRRRRRRRo....", ".ooooyyyyyyyyoooo.", "o" + r("y", 16) + "o", "." + r("o", 16) + "."] },
    hint: "빨간 띠를 두른 밀짚모자.",
  },
  {
    id: "beanie", part: "hat", label: "털모자", price: 200, accent: ["#e57a6e", "#b9443a"],
    front: { x: 3, y: 0, rows: ["......oo......", ".....owwo.....", "...ooccccoo...", "..o" + r("c", 8) + "o..", ".o" + r("c", 10) + "o.", ".o" + r("C", 10) + "o.", ".." + r("o", 10) + ".."] },
    hint: "방울 달린 털모자.",
  },
  {
    id: "flowers", part: "hat", label: "꽃 화관", price: 450,
    front: { x: 3, y: 2, rows: ["..P..P..P..P..", ".PyPPyPPyPPyP.", ".gGggGggGggGg."] },
    hint: "분홍 꽃을 엮은 화관.",
  },
  {
    id: "raincap", part: "hat", label: "우비 모자", price: 350, hideHair: true, accent: ["#ffd85c", "#d9a62e"],
    front: {
      x: 2, y: 1,
      rows: [
        "....oooooooo....",
        "..oo" + r("c", 8) + "oo..",
        ".o" + r("c", 12) + "o.",
        "o" + r("c", 14) + "o",
        "occ" + r("C", 10) + "cco",
        "occ" + r(".", 10) + "cco",
        "occ" + r(".", 10) + "cco",
        "occ" + r(".", 10) + "cco",
        "occ" + r(".", 10) + "cco",
        ".oco" + r(".", 8) + "oco.",
        "..oo" + r(".", 8) + "oo..",
      ],
    },
    hint: "단비 오는 날의 노란 우비 모자.",
  },
  {
    id: "cheerband", part: "hat", label: "응원 머리띠", price: 6, cur: "root",
    front: { x: 3, y: 4, rows: ["." + r("o", 12) + ".", "o" + r("R", 5) + "ww" + r("R", 5) + "o", "." + r("o", 12) + "."] },
    hint: "싸움터에서 두르던 빨간 머리띠.",
  },
  {
    id: "vinecrown", part: "hat", label: "덩굴 화관", price: 15, cur: "root",
    front: { x: 3, y: 2, rows: ["..g..G..G..g..", ".gGgGgGgGgGgG.", ".GgGgGgGgGgGg."] },
    hint: "거대 잡초를 이긴 덩굴로 엮은 화관.",
  },
  {
    id: "dexcap", part: "hat", label: "도감 박사 모자", price: 0, cur: "reward", reward: { kind: "title", title: "dex", level: 3 },
    front: { x: 2, y: 0, rows: [".." + r("o", 12) + "..", "o" + r("n", 14) + "o", ".oooo" + r("n", 6) + "oooo.", "....o" + r("n", 6) + "oy...", "...." + r("o", 8) + "y..."] },
    hint: "도감 칭호 ★3을 받은 사람의 모자.",
  },
];

// ── 얼굴 소품 ────────────────────────────────────────────────────────

const FACES: Wear[] = [
  { id: "glasses", part: "face", label: "동그란 안경", price: 150, front: { x: 5, y: 6, rows: ["oooo..oooo", "o..oooo..o", "o..o..o..o", "oooo..oooo"] }, hint: "까만 테 동그란 안경." },
  { id: "bandage", part: "face", label: "반창고", price: 50, accent: ["#f3dcb5", "#d9b98a"], front: { x: 12, y: 9, rows: ["occo"] }, hint: "볼에 붙인 반창고." },
  { id: "heart", part: "face", label: "하트 스티커", price: 80, front: { x: 4, y: 9, rows: ["P.P", ".P."] }, hint: "볼에 붙인 작은 하트." },
];

// ── 손에 든 것(손 자리 기준) ─────────────────────────────────────────

const CAN = ["oooo..", "occcoo", "oCCCo.", "oooo.."];

const HELD: Wear[] = [
  { id: "flower", part: "held", label: "꽃 한 송이", price: 60, held: { dx: -1, dy: -4, rows: [".P.", "PyP", ".P.", ".g."] }, hint: "분홍 꽃 한 송이." },
  { id: "trowel", part: "held", label: "모종삽", price: 100, held: { dx: -1, dy: -4, rows: [".o.", "oeo", ".o.", ".d."] }, hint: "모종 옮기는 작은 삽." },
  { id: "can", part: "held", label: "물뿌리개", price: 120, accent: ["#9fd8f2", "#2f9bd8"], held: { dx: 0, dy: -1, rows: CAN }, hint: "하늘색 물뿌리개." },
  { id: "book", part: "held", label: "책", price: 150, accent: ["#e57a6e", "#b9443a"], held: { dx: -1, dy: -1, rows: ["oooo", "ocwo", "ocwo", "oooo"] }, hint: "빨간 표지의 책." },
  { id: "goldcan", part: "held", label: "황금 물뿌리개", price: 0, cur: "reward", reward: { kind: "golden" }, accent: ["#ffd700", "#d9a62e"], held: { dx: 0, dy: -1, rows: CAN }, hint: "황금 변이를 처음 거둔 사람의 물뿌리개." },
  { id: "guardflag", part: "held", label: "광장 지킴이 깃발", price: 0, cur: "reward", reward: { kind: "trophies", n: 6 }, held: { dx: 0, dy: -6, rows: ["ooooo", "eRRRo", "eRRo.", "eoo..", "e....", "e...."] }, hint: "여섯 악초의 박제를 다 모은 사람의 깃발." },
];

// ── 말풍선 틀(그림은 CSS: garden-avatar-bubble.is-<id>) ─────────────────

const BUBBLES: Wear[] = [
  { id: "basic", part: "bubble", label: "기본 말풍선", price: 0, hint: "하얀 말풍선." },
  { id: "dots", part: "bubble", label: "도트 상자", price: 100, hint: "점선 테두리 상자." },
  { id: "cloud", part: "bubble", label: "구름", price: 150, hint: "몽실몽실 구름 말풍선." },
  { id: "petal", part: "bubble", label: "꽃잎", price: 200, hint: "분홍 꽃잎 말풍선." },
  { id: "letter", part: "bubble", label: "편지지", price: 250, hint: "줄이 그어진 편지지 말풍선." },
];

export const WEAR: Wear[] = [...HAIR, ...EYES, ...TOPS, ...BOTTOMS, ...SHOES, ...HATS, ...FACES, ...HELD, ...BUBBLES];

export const WEAR_BY_ID = new Map(WEAR.map((w) => [w.id, w]));

/** 처음부터 가진 것. */
export function isFree(w: Wear): boolean {
  return w.price === 0 && !w.cur;
}

export function wearOf(part: Part, id: string | undefined): Wear | undefined {
  const w = id ? WEAR_BY_ID.get(id) : undefined;
  return w && w.part === part ? w : undefined;
}

export const FREE: Record<Part, string[]> = Object.fromEntries(
  PARTS.map((p) => [p.id, WEAR.filter((w) => w.part === p.id && isFree(w)).map((w) => w.id)]),
) as Record<Part, string[]>;

/** 사람에게 보이는 이름. "꼬마"는 가칭이다(docs/garden-avatar.md §11의 1) — 바꾸면 여기만. */
export const AVATAR_NAME = "꼬마";
