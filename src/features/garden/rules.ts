import type { Fruit, Mutation, Plant, PlazaLevel, Species, Tier } from "./types";

/**
 * 정원의 규칙 — 순수 함수만 둔다. 설계는 docs/garden-game.md §3.
 *
 * ★ 시간과 씨앗에서 결정적으로 계산한다.
 *   성장은 심은 시각과 성장 시간으로, 상점 진열과 날씨는 시각으로, 변이는
 *   심을 때 만든 id로 정해진다. 그래서 서버가 틱을 돌릴 필요가 없고, 모두가
 *   같은 진열과 같은 비를 보며, 새로고침해도 운이 다시 굴러가지 않는다.
 *
 * ★ 수치는 모두 첫 실험값이다. 고칠 때는 여기 한 군데만 고친다.
 */

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
const KST = 9 * HOUR;

// ── 난수 ────────────────────────────────────────────────────────────

export function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 씨앗이 같으면 같은 수열. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function between(seed: number, lo: number, hi: number): number {
  return Math.round(lo + rng(seed)() * (hi - lo));
}

// ── 날짜 (한국 시각) ────────────────────────────────────────────────

/** 한국 날짜 "YYYY-MM-DD". 하루치 상한과 광장 기록판이 이 날짜로 끊긴다. */
export function kstDay(t: number): string {
  return new Date(t + KST).toISOString().slice(0, 10);
}

function kstMidnight(t: number): number {
  const d = new Date(t + KST);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - KST;
}

// ── 품종 ────────────────────────────────────────────────────────────

export const TIER_LABEL: Record<Tier, string> = {
  sprout: "새싹",
  common: "일반",
  flagship: "대표",
  perennial: "다년생",
};

/** 첫 열매까지 걸리는 시간(분)의 범위. 품종마다 이 안에서 고정된다. */
const GROW_MIN: Record<Tier, [number, number]> = {
  sprout: [5, 15],
  common: [30, 120],
  flagship: [240, 480],
  perennial: [480, 600],
};

/** 다년생이 다시 열리는 데 걸리는 시간(분). 아침저녁으로 들르게 한다. */
const REGROW_MIN: [number, number] = [300, 420];

export const SEED_PRICE: Record<Tier, number> = {
  sprout: 10,
  common: 40,
  flagship: 220,
  perennial: 600,
};

const JAM_VALUE: Record<Tier, [number, number]> = {
  sprout: [14, 22],
  common: [60, 95],
  flagship: [380, 520],
  perennial: [230, 300],
};

export function growMinutes(species: Species, regrow = false): number {
  if (regrow) return between(species.seed ^ 0x5eed, ...REGROW_MIN);
  return between(species.seed, ...GROW_MIN[species.tier]);
}

export function baseJam(species: Species): number {
  return between(species.seed ^ 0x1a77, ...JAM_VALUE[species.tier]);
}

/** 열매 모양. 품종마다 하나로 고정. */
const FRUITS: Record<Tier, string[]> = {
  sprout: ["🫐", "🍒", "🍓", "🫛", "🌰"],
  common: ["🍅", "🍋", "🍐", "🍊", "🍎", "🍇", "🥝", "🍑"],
  flagship: ["🍉", "🍍", "🥭", "🎃", "🍈"],
  perennial: ["🌳", "🌴", "🌲"],
};

export function fruitIcon(species: Species): string {
  const list = FRUITS[species.tier];
  return list[species.seed % list.length];
}

// ── 날씨: 단비 ──────────────────────────────────────────────────────

/** 매일 12:30, 19:30(한국 시각)에 10분. 정해진 시각이라 "점심 때 들어가자"가 된다. */
const RAIN_STARTS = [12 * HOUR + 30 * MINUTE, 19 * HOUR + 30 * MINUTE];
const RAIN_LENGTH = 10 * MINUTE;
const RAIN_SPEED = 2;

/** t가 끝나기 전인 가장 가까운 단비 창. */
export function nextRain(t: number): { start: number; end: number } {
  const day = kstMidnight(t);
  for (const base of [day, day + 24 * HOUR]) {
    for (const offset of RAIN_STARTS) {
      const start = base + offset;
      if (start + RAIN_LENGTH > t) return { start, end: start + RAIN_LENGTH };
    }
  }
  // 닿지 않는다. 위 두 날 안에 반드시 있다.
  return { start: day + 48 * HOUR, end: day + 48 * HOUR + RAIN_LENGTH };
}

export function isRaining(t: number): boolean {
  const w = nextRain(t);
  return w.start <= t && t < w.end;
}

function overlapsRain(from: number, to: number): boolean {
  const w = nextRain(from);
  return w.start < to;
}

/**
 * 익는 시각. 단비가 오는 동안에는 두 배로 자란다.
 * 단비 창을 하나씩 건너며 남은 성장량을 깎는다.
 */
export function ripeTime(start: number, minutes: number, speed: number): number {
  let t = start;
  let remaining = minutes * MINUTE;
  for (let i = 0; i < 400; i++) {
    const w = nextRain(t);
    if (t < w.start) {
      const dry = (w.start - t) * speed;
      if (dry >= remaining) return t + remaining / speed;
      remaining -= dry;
      t = w.start;
    }
    const wet = (w.end - t) * speed * RAIN_SPEED;
    if (wet >= remaining) return t + remaining / (speed * RAIN_SPEED);
    remaining -= wet;
    t = w.end;
  }
  return t + remaining / speed;
}

// ── 변이 ────────────────────────────────────────────────────────────

export const MUTATION: Record<Mutation, { label: string; multiplier: number; odds: string; hint: string }> = {
  golden: { label: "황금", multiplier: 10, odds: "1%", hint: "언제나 낮은 확률로" },
  moist: { label: "촉촉", multiplier: 2, odds: "30%", hint: "단비를 맞으며 자란 열매" },
  shine: { label: "원본 광택", multiplier: 1.5, odds: "확정", hint: "쪽지의 근거를 열었다" },
  blessed: { label: "광장의 축복", multiplier: 2, odds: "15%", hint: "광장이 깨끗할 때 수확" },
  rainbow: { label: "무지개", multiplier: 2, odds: "확정", hint: "변이 셋 이상이 겹쳤다" },
};

export const MUTATION_ORDER: Mutation[] = ["golden", "moist", "shine", "blessed", "rainbow"];

/** 변이 셋 이상이 겹치면 무지개가 붙는다. 무지개 자신은 세지 않는다. */
export function withRainbow(mutations: Mutation[]): Mutation[] {
  const base = mutations.filter((m) => m !== "rainbow");
  return base.length >= 3 ? [...base, "rainbow"] : base;
}

/** 수확할 때 굴린다. 씨앗이 심을 때 정해져 있어 새로고침으로 다시 굴릴 수 없다. */
export function rollMutations(plant: Plant, plaza: PlazaLevel): Mutation[] {
  const roll = rng(hash(`${plant.id}:${plant.harvests}`));
  const out: Mutation[] = [];
  if (roll() < 0.01) out.push("golden");
  const wet = roll() < 0.3;
  if (wet && overlapsRain(plant.plantedAt, plant.ripeAt)) out.push("moist");
  const blessed = roll() < 0.15;
  if (blessed && plaza === "clean") out.push("blessed");
  return withRainbow(out);
}

/** bonus는 꽃밭 보너스(만개한 업적 수에서 나온다). */
export function fruitValue(fruit: Fruit, species: Species, bonus = 0): number {
  const multiplier = fruit.mutations.reduce((m, k) => m * MUTATION[k].multiplier, 1);
  return Math.round(baseJam(species) * multiplier * (1 + bonus));
}

/** 원본 광택은 하루 다섯 번까지. 게임이 근거 열람 지표를 부풀리지 않게. */
export const SHINE_PER_DAY = 5;

export function pickNote(fruitId: string, species: Species): string {
  if (species.notes.length === 0) return "";
  return species.notes[hash(fruitId) % species.notes.length].id;
}

// ── 텃밭 ────────────────────────────────────────────────────────────

export const START_JAM = 50;
export const START_PLOTS = 6;
/** 텃밭 늘리기. 6 → 9 → 12. */
export const PLOT_UPGRADES = [
  { plots: 9, price: 300 },
  { plots: 12, price: 1200 },
];

// ── 씨앗 상점 ───────────────────────────────────────────────────────

/** 15분마다 진열이 바뀐다. 모두가 같은 진열을 본다. */
export const SHOP_SLOT = 15 * MINUTE;
const SHOP_SIZE = 6;

/** 칸마다 등급이 나올 확률. 화면에 그대로 공개한다. */
export const SHOP_ODDS: Array<{ tier: Tier; p: number }> = [
  { tier: "sprout", p: 0.45 },
  { tier: "common", p: 0.38 },
  { tier: "flagship", p: 0.14 },
  { tier: "perennial", p: 0.03 },
];

const STOCK: Record<Tier, [number, number]> = {
  sprout: [3, 6],
  common: [2, 4],
  flagship: [1, 2],
  perennial: [1, 1],
};

export interface ShopItem {
  speciesId: string;
  stock: number;
}

export function shopSlot(t: number): number {
  return Math.floor(t / SHOP_SLOT);
}

export function shopFor(slot: number, catalog: Species[]): ShopItem[] {
  const roll = rng(Math.imul(slot, 2654435761) >>> 0);
  const byTier = new Map<Tier, Species[]>();
  for (const s of catalog) byTier.set(s.tier, [...(byTier.get(s.tier) ?? []), s]);

  const items: ShopItem[] = [];
  const taken = new Set<string>();
  for (let i = 0; i < SHOP_SIZE * 3 && items.length < SHOP_SIZE; i++) {
    let r = roll();
    let tier: Tier = "sprout";
    for (const o of SHOP_ODDS) {
      if (r < o.p) {
        tier = o.tier;
        break;
      }
      r -= o.p;
    }
    const pool = byTier.get(tier) ?? [];
    if (pool.length === 0) continue;
    const species = pool[Math.floor(roll() * pool.length)];
    if (taken.has(species.id)) continue;
    taken.add(species.id);
    const [lo, hi] = STOCK[tier];
    items.push({ speciesId: species.id, stock: lo + Math.floor(roll() * (hi - lo + 1)) });
  }
  return items;
}

// ── 광장 ────────────────────────────────────────────────────────────

export const PLAZA_CELLS = 24;

/** 잡초가 덮은 비율로 정한다. 20% 미만 깨끗함, 60% 이하 보통. */
export function plazaLevel(weeds: number): PlazaLevel {
  const ratio = weeds / PLAZA_CELLS;
  if (ratio < 0.2) return "clean";
  if (ratio <= 0.6) return "normal";
  return "overgrown";
}

export const PLAZA_SPEED: Record<PlazaLevel, number> = { clean: 1.25, normal: 1.1, overgrown: 1 };

export const PLAZA_LABEL: Record<PlazaLevel, string> = {
  clean: "깨끗함",
  normal: "보통",
  overgrown: "무성함",
};

export type WeedStage = "young" | "grown" | "tough";

/** 오래 둔 잡초일수록 질기다. */
export function weedStage(age: number): WeedStage {
  if (age < HOUR) return "young";
  if (age < 6 * HOUR) return "grown";
  return "tough";
}

export const WEED: Record<WeedStage, { rubs: number; jam: number; label: string }> = {
  young: { rubs: 3, jam: 3, label: "어린 잡초" },
  grown: { rubs: 5, jam: 5, label: "잡초" },
  tough: { rubs: 8, jam: 9, label: "질긴 잡초" },
};

/** 잡초에서 씨앗이 나올 확률. 공개한다. */
export const WEED_SEED_ODDS = 0.04;
/** 하루에 보상을 받는 잡초 수. 넘으면 뽑을 수는 있지만 잼은 없다. */
export const WEED_REWARD_PER_DAY = 60;

/**
 * 뽑은 칸에 잡초가 다시 날 때까지(분).
 *
 * 오늘 광장에 온 사람이 적을수록 천천히 자란다. 한두 명이 들러도 지킬 수
 * 있어야 한다 — 사람이 적다고 정원이 망가지면 남은 사람도 떠난다.
 * Firestore 규칙이 [20, 240]분 밖의 값을 막는다.
 */
export function regrowMinutes(gardenersToday: number, roll: number): number {
  const base = Math.min(170, Math.max(25, 170 / Math.pow(Math.max(1, gardenersToday), 0.6)));
  return Math.round(Math.min(240, Math.max(20, base * (0.6 + 0.8 * roll))));
}

// ── 꽃밭: 업적을 함께 피우고, 가장 많이 가꾼 사람이 정원지기가 된다 ─────

/**
 * 업적 하나가 만개하는 데 필요한 가꿈. 모두의 가꿈을 더한다.
 *
 * 만개는 영구다. 한 번 핀 업적은 더 가꾸지 않아도 된다 — 모두가 모든 업적을
 * 끝없이 돌볼 필요가 없게 하고, 손길을 아직 안 핀 업적으로 옮기게 한다.
 * 만개한 뒤에도 가꿈은 쌓이고, 그것은 정원지기 다툼에만 쓰인다.
 */
export const BLOOM_CARE = 30;

/**
 * 한 사람이 한 업적에 하루 줄 수 있는 가꿈. Firestore 규칙이 같은 값을 지킨다.
 * 정원지기는 공개되는 자리라, 하루에 몰아서가 아니라 여러 날 꾸준히 돌본
 * 사람이 차지하게 한다.
 */
export const CARE_PER_DAY = 12;

/** 가꿈이 생기는 일. 업적(대표·다년생) 열매를 거두면 1, 그 쪽지의 근거를 열면 1. */
export const CARE = { harvest: 1, shine: 1 } as const;

export function caresFor(species: Species): boolean {
  return species.tier === "flagship" || species.tier === "perennial";
}

/** 한국 날짜의 일련번호. 규칙이 request.time에서 같은 식으로 계산한다. */
export function kstDayNumber(t: number): number {
  return Math.floor((t + KST) / (24 * HOUR));
}

export type BloomStage = "seedling" | "leafy" | "bud" | "bloom";

export function bloomStage(care: number, bloomed: boolean): BloomStage {
  if (bloomed) return "bloom";
  const r = care / BLOOM_CARE;
  if (r < 0.34) return "seedling";
  if (r < 0.75) return "leafy";
  return "bud";
}

export const BLOOM_ICON: Record<BloomStage, string> = {
  seedling: "🌱",
  leafy: "🌿",
  bud: "🌷",
  bloom: "🌸",
};

/** 만개한 업적 하나마다 모두의 잼이 2% 더 나온다. 40%까지. */
export function bloomBonus(bloomed: number): number {
  return Math.min(0.4, bloomed * 0.02);
}

/** 정원지기가 만개한 업적마다 하루 한 번 받는 꽃꿀. */
export const NECTAR = 30;

/** 정원 이름. 처음에는 지어 준다 — 본명이 공개 자리에 오르지 않게. */
const NICK_A = ["초록", "새벽", "단비", "햇살", "보리", "솔잎", "꽃잎", "이슬", "바람", "들꽃"];
const NICK_B = ["고슴도치", "다람쥐", "참새", "두더지", "꿀벌", "달팽이", "토끼", "부엉이", "나비", "개구리"];

export function defaultNick(seed: string): string {
  const h = hash(seed);
  return `${NICK_A[h % NICK_A.length]} ${NICK_B[(h >>> 8) % NICK_B.length]} ${(h >>> 16) % 100}`;
}

export const NICK_MAX = 12;

// ── 표시 ────────────────────────────────────────────────────────────

export function formatLeft(ms: number): string {
  if (ms <= 0) return "다 익음";
  const m = Math.ceil(ms / MINUTE);
  if (m < 60) return `${m}분`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}시간 ${rest}분` : `${h}시간`;
}
