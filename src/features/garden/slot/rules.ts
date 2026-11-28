/**
 * 잼통 정원 슬롯머신 두 대 — 텃밭의 씨앗 슬롯, 미니룸의 아이템 슬롯(docs/garden-slots.md).
 *
 * ★ 잼으로만 돌린다. 잼은 현금으로 사지 못한다(docs/garden-game.md §1). 상품도 거래되지 않는다.
 * ★ 확률을 공개한다. 결과는 공개한 표로 **먼저** 정하고, 릴은 그 결과를 그대로 보인다.
 *   "아깝게 빗나간" 연출을 일부러 만들지 않는다 — 꽝은 표에 맞는 무작위 그림이다.
 * ★ 하루에 돌리는 수에 상한을 두고, 천장(보장)을 둔다. 기대값은 낸 잼을 넘지 않는다(테스트가 본다).
 * 순수 함수만 둔다(slot/rules.test.ts). 난수는 부르는 쪽이 넘긴다.
 */

import { RARE_SEEDS, type RareSeedId } from "./rare";

// ── 공통 ─────────────────────────────────────────────────────────────

/** 하루(한국 날짜) 한 대에 돌리는 수. */
export const SLOT_SPINS_PER_DAY = 20;

/**
 * 슬롯 장부. day가 오늘이 아니면 오늘치(seed·room·chance)는 0부터 다시 센다(ofToday).
 * 천장·무료 한 번·잼 항아리 받은 물결·증정 알림을 본 때는 날을 넘어 이어진다.
 */
export interface SlotLedger {
  day: string;
  seed: number;
  room: number;
  /** 희귀 씨앗 없이 돌린 수(천장 SEED_PITY). */
  seedPity: number;
  /** 아이템 없이 돌린 수(천장 ROOM_PITY). */
  roomPity: number;
  /** 오늘 쓴 퀴즈 찬스(SLOT_CHANCES_PER_DAY). */
  chance: number;
  /** 퀴즈 찬스로 받은 무료 한 번(텃밭·방). */
  freeSeed: number;
  freeRoom: number;
  /** 내 뽑기 기계에서 손님이 받아 간 것을 본 때(ms) — 이 뒤의 것만 알린다(slot/gift.ts). */
  giftSeen: number;
  /** 잼 항아리를 받은 물결(raidKey). */
  pots: number[];
}

export function freshSlots(): SlotLedger {
  return { day: "", seed: 0, room: 0, seedPity: 0, roomPity: 0, chance: 0, freeSeed: 0, freeRoom: 0, giftSeen: 0, pots: [] };
}

export function normalizeSlots(raw: unknown): SlotLedger {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<SlotLedger>;
  const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
  return {
    day: typeof r.day === "string" ? r.day : "",
    seed: n(r.seed),
    room: n(r.room),
    seedPity: n(r.seedPity),
    roomPity: n(r.roomPity),
    chance: n(r.chance),
    freeSeed: Math.min(n(r.freeSeed), SLOT_CHANCES_PER_DAY),
    freeRoom: Math.min(n(r.freeRoom), SLOT_CHANCES_PER_DAY),
    giftSeen: n(r.giftSeen),
    pots: Array.isArray(r.pots) ? r.pots.filter((x): x is number => Number.isInteger(x)).slice(-60) : [],
  };
}

/** 오늘의 장부 — 날이 바뀌었으면 오늘치를 비운다. */
export function ofToday(ledger: SlotLedger, today: string): SlotLedger {
  return ledger.day === today ? ledger : { ...ledger, day: today, seed: 0, room: 0, chance: 0 };
}

// ── 퀴즈 찬스 ───────────────────────────────────────────────────────

/**
 * 꽝이 나오면 업적 O/X 문항 하나를 맞혀 한 번 더(무료). 두 슬롯을 합쳐 하루 셋.
 * 문항을 여는 순간 찬스를 쓴다 — 닫고 다시 열어 쉬운 문항을 고를 수 없게.
 */
export const SLOT_CHANCES_PER_DAY = 3;

export function chancesLeft(ledger: SlotLedger, today: string): number {
  return Math.max(0, SLOT_CHANCES_PER_DAY - ofToday(ledger, today).chance);
}

// ── 광장 잼 항아리 ─────────────────────────────────────────────────

/**
 * 슬롯에 낸 잼의 5%가 광장 잼 항아리에 모인다(지금 열린 거대 잡초 물결, 없으면 다음 물결의 항아리).
 * 그 물결을 쓰러뜨리면 함께한 사람이 항아리를 나눈다 — 모인 잼 ÷ 함께한 사람 수, 한 사람 POT_SHARE_MAX까지.
 * firestore.rules의 plazaPot와 같은 값이다(한 번에 POT_STEPS, 한 사람 한 물결 POT_GIVE_MAX).
 */
export const POT_RATE = 0.05;
export const POT_GIVE_MAX = 300;
export const POT_SHARE_MAX = 400;

export function potShare(cost: number): number {
  return Math.floor(cost * POT_RATE);
}

export function potReward(sum: number, fighters: number): number {
  return Math.max(0, Math.min(POT_SHARE_MAX, Math.floor(sum / Math.max(1, fighters))));
}

// ── 방에 놓는 뽑기 기계 ─────────────────────────────────────────────

/** 가구 id. 방에 놓으면 주인이 고른 증정 상자에서 손님이 하루 한 번 돌려 받는다(slot/gift.ts). */
export const GACHA_ID = "gacha";

// ── 희귀 씨앗 컬렉션 ───────────────────────────────────────────────

/** 다 모으면 받는 방 소품. 칭호(rules.ts의 TITLES.rare)는 거둔 종류 수에서 셈한다. */
export const RARE_JAR_ID = "rare-jar";

/** 오늘 남은 수. 날이 바뀌었으면 처음부터. */
export function spinsLeft(ledger: SlotLedger, machine: "seed" | "room", today: string): number {
  const used = ledger.day === today ? ledger[machine] : 0;
  return Math.max(0, SLOT_SPINS_PER_DAY - used);
}

function pick<T>(list: readonly T[], rand: () => number): T {
  return list[Math.floor(rand() * list.length)];
}

/** 가중치대로 하나. 가중치 합이 1보다 작으면 남는 몫은 null(꽝). */
function draw<T extends { p: number }>(table: readonly T[], rand: () => number): T | null {
  let x = rand();
  for (const row of table) {
    if (x < row.p) return row;
    x -= row.p;
  }
  return null;
}

/** 세 칸이 모두 다른 꽝 그림. 표 밖의 연출은 없다 — 그림 목록에서 고르게 고른다. */
function distinctReels<S>(symbols: readonly S[], rand: () => number): [S, S, S] {
  const a = pick(symbols, rand);
  let b = pick(symbols, rand);
  while (b === a) b = pick(symbols, rand);
  let c = pick(symbols, rand);
  while (c === a || c === b) c = pick(symbols, rand);
  return [a, b, c];
}

// ── 텃밭: 씨앗 슬롯 ─────────────────────────────────────────────────

export const SEED_SPIN_COST = 80;
/** 희귀 씨앗 없이 이만큼 돌리면 다음 한 번은 반드시 희귀 씨앗. */
export const SEED_PITY = 40;

/** 릴 그림. 일반 셋 + 희귀 여섯. */
export type SeedSymbol = "sprout" | "common" | "flagship" | RareSeedId;
export const SEED_SYMBOLS: readonly SeedSymbol[] = ["sprout", "common", "flagship", ...RARE_SEEDS.map((r) => r.id)];
export const SEED_SYMBOL_LABEL: Record<"sprout" | "common" | "flagship", { icon: string; label: string }> = {
  sprout: { icon: "🌱", label: "언행 씨앗" },
  common: { icon: "🍅", label: "정책 씨앗" },
  flagship: { icon: "⭐", label: "업적 씨앗" },
};

export type SeedOutcome =
  | { kind: "rare"; rare: RareSeedId }
  | { kind: "triple"; tier: "sprout" | "common" | "flagship"; n: number }
  | { kind: "pair"; n: 1 }
  | { kind: "miss" };

/** 공개하는 확률표. 순서대로 굴린다(합 51%, 남은 49%는 꽝). */
export const SEED_TABLE: ReadonlyArray<{ p: number; outcome: SeedOutcome; label: string }> = [
  { p: 0.004, outcome: { kind: "rare", rare: "rs-golden" }, label: "황금 씨앗" },
  { p: 0.004, outcome: { kind: "rare", rare: "rs-meteor" }, label: "별똥별 씨앗" },
  { p: 0.004, outcome: { kind: "rare", rare: "rs-rain" }, label: "단비 씨앗" },
  { p: 0.004, outcome: { kind: "rare", rare: "rs-bless" }, label: "축복 씨앗" },
  { p: 0.0025, outcome: { kind: "rare", rare: "rs-ancient" }, label: "고목 씨앗" },
  { p: 0.0015, outcome: { kind: "rare", rare: "rs-rainbow" }, label: "무지개 씨앗" },
  { p: 0.04, outcome: { kind: "triple", tier: "flagship", n: 1 }, label: "⭐⭐⭐ 업적 씨앗 1" },
  { p: 0.08, outcome: { kind: "triple", tier: "common", n: 2 }, label: "🍅🍅🍅 정책 씨앗 2" },
  { p: 0.12, outcome: { kind: "triple", tier: "sprout", n: 3 }, label: "🌱🌱🌱 언행 씨앗 3" },
  { p: 0.25, outcome: { kind: "pair", n: 1 }, label: "같은 그림 둘 · 언행 씨앗 1" },
];

export interface SeedSpin {
  outcome: SeedOutcome;
  reels: [SeedSymbol, SeedSymbol, SeedSymbol];
  /** 천장으로 받은 희귀 씨앗인가. */
  pity: boolean;
}

/** 한 번 돌린다. pity = 지금까지 희귀 씨앗 없이 돌린 수. */
export function spinSeed(pity: number, rand: () => number): SeedSpin {
  if (pity + 1 >= SEED_PITY) {
    const rares = SEED_TABLE.filter((r) => r.outcome.kind === "rare");
    const total = rares.reduce((s, r) => s + r.p, 0);
    const row = draw(rares.map((r) => ({ ...r, p: r.p / total })), rand) ?? rares[0];
    const rare = (row.outcome as { rare: RareSeedId }).rare;
    return { outcome: row.outcome, reels: [rare, rare, rare], pity: true };
  }
  const row = draw(SEED_TABLE, rand);
  const outcome: SeedOutcome = row?.outcome ?? { kind: "miss" };
  if (outcome.kind === "rare") return { outcome, reels: [outcome.rare, outcome.rare, outcome.rare], pity: false };
  if (outcome.kind === "triple") return { outcome, reels: [outcome.tier, outcome.tier, outcome.tier], pity: false };
  if (outcome.kind === "pair") {
    // 같은 그림 둘 + 다른 하나. 짝은 일반 그림으로(희귀 그림 둘은 "거의 당첨"처럼 보인다 — 만들지 않는다).
    const common = SEED_SYMBOLS.slice(0, 3);
    const a = pick(common, rand);
    let b = pick(SEED_SYMBOLS, rand);
    while (b === a) b = pick(SEED_SYMBOLS, rand);
    const at = Math.floor(rand() * 3);
    const reels: [SeedSymbol, SeedSymbol, SeedSymbol] = [a, a, a];
    reels[at] = b;
    return { outcome, reels, pity: false };
  }
  return { outcome, reels: distinctReels(SEED_SYMBOLS, rand), pity: false };
}

/** 희귀 씨앗이 나오지 않은 채 쌓이는 수. 희귀 씨앗이 나오면 0. */
export function nextSeedPity(pity: number, spin: SeedSpin): number {
  return spin.outcome.kind === "rare" ? 0 : pity + 1;
}

// ── 미니룸: 아이템 슬롯 ─────────────────────────────────────────────

export const ROOM_SPIN_COST = 150;
export const ROOM_PITY = 20;
/** 진열 여섯 가운데 하나가 맞을 확률의 상한(비싼 것이 섞이면 더 낮춘다 — 기대값 상한). */
export const ROOM_WIN_MAX = 0.35;
/** 기대값 상한 — 낸 잼의 이만큼(상품을 상점 값으로 쳐서). */
export const ROOM_EV_MAX = 0.9;
export const ROOM_REELS = 6;

/** 진열 후보 하나 — 상점의 가구·벽지·바닥재 또는 음원. cartel은 진열 밖의 「카르텔 카드」 칸(CARTEL_ROW). */
export interface RoomPrize {
  id: string;
  kind: "furniture" | "wallpaper" | "flooring" | "music" | "cartel";
  label: string;
  price: number;
}

export interface RoomRow extends RoomPrize {
  p: number;
}

/**
 * 오늘의 진열 — 받을 수 있는 것(가진 수 상한·이미 가진 벽지·바닥재·음원은 부르는 쪽이 뺀다) 가운데 여섯.
 * 가구 셋, 벽지 하나, 바닥재 하나, 음원 하나를 먼저 채우고 모자라면 남은 것으로. 날마다 같은 진열(seed = 날짜).
 */
export function roomLineup(pool: readonly RoomPrize[], rand: () => number): RoomPrize[] {
  const left = [...pool];
  const take = (kind: RoomPrize["kind"], n: number) => {
    const out: RoomPrize[] = [];
    for (let i = 0; i < n; i++) {
      const cands = left.filter((x) => x.kind === kind);
      if (cands.length === 0) break;
      const one = pick(cands, rand);
      out.push(one);
      left.splice(left.indexOf(one), 1);
    }
    return out;
  };
  const lineup = [...take("furniture", 3), ...take("wallpaper", 1), ...take("flooring", 1), ...take("music", 1)];
  while (lineup.length < ROOM_REELS && left.length) {
    const one = pick(left, rand);
    lineup.push(one);
    left.splice(left.indexOf(one), 1);
  }
  return lineup;
}

/**
 * 진열마다 맞을 확률 — 값에 반비례(비싼 것은 드물게). 다 더한 확률 W는 ROOM_WIN_MAX를 넘지 않고,
 * 기대값(Σ p × 값)이 ROOM_SPIN_COST × ROOM_EV_MAX를 넘지 않도록 낮춘다.
 */
export function roomTable(lineup: readonly RoomPrize[]): RoomRow[] {
  if (lineup.length === 0) return [];
  const inv = lineup.map((x) => 1 / Math.max(1, x.price));
  const sum = inv.reduce((s, v) => s + v, 0);
  // Σ p×값 = W × n / sum.
  const w = Math.min(ROOM_WIN_MAX, (ROOM_SPIN_COST * ROOM_EV_MAX * sum) / lineup.length);
  return lineup.map((x, i) => ({ ...x, p: (w * inv[i]) / sum }));
}

/**
 * 카르텔 카드 칸 — 진열 여섯 옆에 따로 붙는 일곱째 칸. 상점에서 팔지 않는 카르텔 카드(room/cartels.ts)가 이 칸으로만 나온다.
 * 아직 없는 카드 가운데 하나를 고르게 준다(부르는 쪽이 고른다). 다 모으면 칸이 없다.
 * 확률은 진열과 따로 CARTEL_P — 진열의 당첨 합(ROOM_WIN_MAX)·기대값(상점 값이 없어 0으로 친다)과 섞지 않는다. 천장은 진열에서만 준다.
 */
export const CARTEL_ROW_ID = "cartel";
export const CARTEL_P = 0.02;

export function withCartelRow(table: readonly RoomRow[], missing: number): RoomRow[] {
  if (table.length === 0 || missing <= 0) return [...table];
  return [...table, { id: CARTEL_ROW_ID, kind: "cartel", label: "카르텔 카드", price: 0, p: CARTEL_P }];
}

export function roomEv(table: readonly RoomRow[]): number {
  return table.reduce((s, r) => s + r.p * r.price, 0);
}

export interface RoomSpin {
  prize: RoomPrize | null;
  /** 릴 세 칸 — 진열의 번호. */
  reels: [number, number, number];
  pity: boolean;
}

export function spinRoom(table: readonly RoomRow[], pity: number, rand: () => number): RoomSpin {
  if (table.length === 0) return { prize: null, reels: [0, 0, 0], pity: false };
  if (pity + 1 >= ROOM_PITY) {
    // 천장은 진열 하나(카르텔 카드 칸은 빼고).
    const shelf = table.filter((r) => r.kind !== "cartel");
    const total = shelf.reduce((s, r) => s + r.p, 0);
    const row = draw(shelf.map((r) => ({ ...r, p: r.p / total })), rand) ?? shelf[0];
    const at = table.indexOf(table.find((r) => r.id === row.id)!);
    const { p: _p, ...prize } = row;
    void _p;
    return { prize, reels: [at, at, at], pity: true };
  }
  const row = draw(table, rand);
  if (row) {
    const at = table.findIndex((r) => r.id === row.id);
    const { p: _p, ...prize } = row;
    void _p;
    return { prize, reels: [at, at, at], pity: false };
  }
  // 꽝 — 셋이 같지 않으면 된다. 짝은 우연히만 생긴다(일부러 만들지 않는다).
  const idx = table.map((_, i) => i);
  if (idx.length < 2) return { prize: null, reels: [0, 0, 0], pity: false };
  let reels: [number, number, number];
  do reels = [pick(idx, rand), pick(idx, rand), pick(idx, rand)];
  while (reels[0] === reels[1] && reels[1] === reels[2]);
  return { prize: null, reels, pity: false };
}

export function nextRoomPity(pity: number, spin: RoomSpin): number {
  return spin.prize ? 0 : pity + 1;
}
