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
export const GROW_MIN: Record<Tier, [number, number]> = {
  sprout: [5, 15],
  common: [30, 120],
  flagship: [240, 480],
  perennial: [480, 600],
};

/** 다년생이 다시 열리는 데 걸리는 시간(분). 아침저녁으로 들르게 한다. */
export const REGROW_MIN: [number, number] = [300, 420];

export const SEED_PRICE: Record<Tier, number> = {
  sprout: 10,
  common: 40,
  flagship: 220,
  perennial: 600,
};

export const JAM_VALUE: Record<Tier, [number, number]> = {
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
export const RAIN_STARTS = [12 * HOUR + 30 * MINUTE, 19 * HOUR + 30 * MINUTE];
export const RAIN_LENGTH = 10 * MINUTE;
export const RAIN_SPEED = 2;

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

// ── 날씨: 별똥별 ────────────────────────────────────────────────────

/**
 * 수·토 21:00(한국 시각)에 5분. 이 동안 자란 열매에 반짝 변이가 붙을 수 있다.
 * 성장 속도는 바꾸지 않는다. 22시 전이다 — 그 뒤에는 이벤트를 열지 않는다(§3.6).
 */
export const METEOR_WEEKDAYS = [3, 6]; // 0=일요일
export const METEOR_START = 21 * HOUR;
export const METEOR_LENGTH = 5 * MINUTE;

/** t가 끝나기 전인 가장 가까운 별똥별 창. */
export function nextMeteor(t: number): { start: number; end: number } {
  const day = kstMidnight(t);
  for (let i = 0; i <= 7; i++) {
    const base = day + i * 24 * HOUR;
    const weekday = new Date(base + KST).getUTCDay();
    const start = base + METEOR_START;
    if (METEOR_WEEKDAYS.includes(weekday) && start + METEOR_LENGTH > t) {
      return { start, end: start + METEOR_LENGTH };
    }
  }
  // 닿지 않는다. 여드레 안에 반드시 있다.
  return { start: day + 8 * 24 * HOUR, end: day + 8 * 24 * HOUR + METEOR_LENGTH };
}

export function isMeteor(t: number): boolean {
  const w = nextMeteor(t);
  return w.start <= t && t < w.end;
}

function overlapsMeteor(from: number, to: number): boolean {
  return nextMeteor(from).start < to;
}

// ── 신품종 ──────────────────────────────────────────────────────────

/** 들어온 날부터 30일 동안 신품종이다. 그 열매는 잼이 20% 더 나온다. */
export const NEW_VARIETY_DAYS = 30;
export const NEW_VARIETY_BONUS = 0.2;

function dayNumberOf(day: string): number {
  return kstDayNumber(Date.parse(`${day}T00:00:00+09:00`));
}

export function isNewVariety(species: Species, t: number): boolean {
  if (!species.arrivedOn) return false;
  const age = kstDayNumber(t) - dayNumberOf(species.arrivedOn);
  return age >= 0 && age < NEW_VARIETY_DAYS;
}

/**
 * 신품종 장마 — 품종이 들어온 날 19:00–20:00(한국 시각).
 * 이 동안 그날 들어온 품종이 상점에 꼭 나온다. 콘텐츠 배포를 모두가 같은 때에 모이는
 * 이벤트로 바꾼다(§3.6). 단비(19:30)와 겹친다 — 새 씨앗을 심으면 바로 단비를 맞는다.
 */
export const MONSOON_START = 19 * HOUR;
export const MONSOON_LENGTH = HOUR;

export function monsoonWindow(day: string): { start: number; end: number } {
  const start = Date.parse(`${day}T00:00:00+09:00`) + MONSOON_START;
  return { start, end: start + MONSOON_LENGTH };
}

/** 지금 장마 중이면 그날 들어온 품종. 아니면 빈 배열. */
export function monsoonSpecies(t: number, catalog: Species[]): Species[] {
  const today = kstDay(t);
  const w = monsoonWindow(today);
  if (t < w.start || t >= w.end) return [];
  return catalog.filter((s) => s.arrivedOn === today);
}

/** 아직 끝나지 않은 가장 가까운 장마. 들어올 품종이 없으면 null. */
export function nextMonsoon(
  t: number,
  catalog: Species[],
): { start: number; end: number; species: Species[] } | null {
  const days = [...new Set(catalog.map((s) => s.arrivedOn).filter((d): d is string => Boolean(d)))].sort();
  for (const day of days) {
    const w = monsoonWindow(day);
    if (w.end > t) return { ...w, species: catalog.filter((s) => s.arrivedOn === day) };
  }
  return null;
}

// ── 변이 ────────────────────────────────────────────────────────────

export const MUTATION: Record<Mutation, { label: string; multiplier: number; odds: string; hint: string }> = {
  golden: { label: "황금", multiplier: 10, odds: "1%", hint: "언제나 낮은 확률로" },
  moist: { label: "촉촉", multiplier: 2, odds: "30%", hint: "단비를 맞으며 자란 열매" },
  sparkle: { label: "반짝", multiplier: 5, odds: "5%", hint: "별똥별이 지나는 동안 자란 열매" },
  shine: { label: "원본 광택", multiplier: 1.5, odds: "확정", hint: "쪽지의 근거를 열었다" },
  blessed: { label: "광장의 축복", multiplier: 2, odds: "15%", hint: "광장이 깨끗할 때 수확" },
  rainbow: { label: "무지개", multiplier: 2, odds: "확정", hint: "변이 셋 이상이 겹쳤다" },
};

export const MUTATION_ORDER: Mutation[] = ["golden", "moist", "sparkle", "shine", "blessed", "rainbow"];

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
  // 새 굴림은 맨 뒤에 붙인다. 앞에 끼우면 이미 심은 포기의 황금·촉촉·축복이 바뀐다.
  const sparkle = roll() < 0.05;
  if (sparkle && overlapsMeteor(plant.plantedAt, plant.ripeAt)) out.push("sparkle");
  return withRainbow(out);
}

/** bonus는 꽃밭 보너스(만개한 업적 수에서 나온다). 신품종 보너스는 거둔 때로 정해진다. */
export function fruitValue(fruit: Fruit, species: Species, bonus = 0): number {
  const multiplier = fruit.mutations.reduce((m, k) => m * MUTATION[k].multiplier, 1);
  const fresh = isNewVariety(species, fruit.harvestedAt) ? NEW_VARIETY_BONUS : 0;
  return Math.round(baseJam(species) * multiplier * (1 + bonus + fresh));
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
export const SHOP_SIZE = 6;

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

/** 장마 때 상점에 꼭 세우는 신품종 수. 나머지 칸은 평소처럼 굴린다. */
const MONSOON_SHELF = 3;

/**
 * featured는 신품종 장마의 품종이다. 앞 칸에 먼저 세우고(재고 +1), 남은 칸을 평소
 * 확률로 채운다. 장마가 아니면 비어 있고 진열은 예전과 같다.
 */
export function shopFor(slot: number, catalog: Species[], featured: Species[] = []): ShopItem[] {
  const roll = rng(Math.imul(slot, 2654435761) >>> 0);
  const byTier = new Map<Tier, Species[]>();
  for (const s of catalog) byTier.set(s.tier, [...(byTier.get(s.tier) ?? []), s]);

  const items: ShopItem[] = [];
  const taken = new Set<string>();
  // 장마 품종이 많으면 슬롯마다 돌려 가며 세운다. 모두가 같은 진열을 본다.
  for (let i = 0; i < Math.min(MONSOON_SHELF, featured.length); i++) {
    const species = featured[(slot * MONSOON_SHELF + i) % featured.length];
    if (taken.has(species.id)) continue;
    taken.add(species.id);
    items.push({ speciesId: species.id, stock: STOCK[species.tier][1] + 1 });
  }
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

// ── 거대 잡초 (레이드) ──────────────────────────────────────────────

/**
 * 거대 잡초는 하루 여러 번(물결) 나타난다. 물결마다 Firestore 문서 하나 — plazaRaids/{날짜번호}-{물결}.
 *
 * ★ 혼자서는 잡지 못한다. 한 사람은 물결마다 기력 RAID_USES_PER_PERSON번까지만 쓸 수 있고(빈틈이면
 *   한 번이 RAID_GAP_MULT), 체력은 적어도 RAID_MIN_FIGHTERS명이 빈틈에 끝까지 쳐야 닿는다. 규칙이 둘 다 지킨다.
 * ★ 오래 버티면 도망간다(RAID_LIFE). 그래서 "지금 같이 잡자"가 된다. 도망가면 상자는 없다.
 * ★ 물결마다 여는 시각이 있다(한국 시각 RAID_FIRST_HOUR시부터 RAID_EVERY_HOURS시간마다).
 *   앞 물결이 끝나고(쓰러지거나 도망가고) RAID_GAP이 지났고, 제 시각이 됐고, 광장이 무성할 때 나온다.
 *   여는 시각이 없을 때는 앞 물결이 빨리 쓰러지면 다음이 줄줄이 나와 오전에 몰렸다.
 * 값을 바꾸면 firestore.rules의 plazaRaids 절도 같이 바꾼다 — raid.test.ts가 짝을 본다.
 */
export const RAID_PER_DAY = 5;
export const RAID_LIFE = 3 * HOUR;
export const RAID_GAP = 30 * MINUTE;
/** 첫 물결이 열리는 시각(한국 시각, 시). */
export const RAID_FIRST_HOUR = 8;
/** 물결 사이 여는 시각의 간격(시간). 8·11·14·17·20시. */
export const RAID_EVERY_HOURS = 3;

/** 이 물결이 열리는 시각(ms). day는 한국 날짜 번호. */
export function raidOpensAt(day: number, wave: number): number {
  return day * 24 * HOUR - KST + (RAID_FIRST_HOUR + RAID_EVERY_HOURS * (wave - 1)) * HOUR;
}
/**
 * 기력 — 한 사람이 한 물결에 쓸 수 있는 횟수(거대 잡초 2.0, docs/garden-miniroom.md §7.2).
 * 센 값(hits)과 따로 센다. 빈틈에 쓴 한 번은 RAID_GAP_MULT로 센다 — 그래서 한 사람이 넣을 수 있는
 * 맞은 수는 RAID_USES_PER_PERSON × RAID_GAP_MULT(120)까지다. 상한 60은 규칙이 기력(uses)에 건다.
 */
export const RAID_USES_PER_PERSON = 60;
export const RAID_GAP_MULT = 2;
export const RAID_HITS_MAX_PER_PERSON = RAID_USES_PER_PERSON * RAID_GAP_MULT;
export const RAID_MIN_FIGHTERS = 3;
/**
 * 체력 하한 = RAID_MIN_FIGHTERS × 60 × 1.5 = 270. 혼자(120)도, 둘(240)도 어느 체력에도 닿지 못한다.
 * 빈틈의 두 배를 받기 전의 하한(180)은 둘이 빈틈에만 치면(240) 닿았다 — 그래서 빈틈과 함께 올린다.
 */
export const RAID_HP_MIN = (RAID_MIN_FIGHTERS * RAID_USES_PER_PERSON * 3) / 2;
export const RAID_HP_MAX = 3000;

/**
 * 거대 잡초의 종류 — 사회를 갉아먹는 악초들. 종류마다 체력·생김새·성질(대사)이 다르다.
 *
 * ★ 종류는 물결 id(날짜·물결)에서 정한다. 문서에 적지 않아도 모두가 같은 잡초를 본다.
 *   하루 다섯 물결(RAID_PER_DAY)은 서로 다른 종류다(날마다 섞은 여섯 종류에서 앞의 다섯).
 * ★ 체력은 종류가 정한다 — 세운 사람이 문서에 적고, 화면은 문서의 체력을 그린다.
 *   어느 종류든 RAID_MIN_FIGHTERS명보다 적게는 못 잡고, 빈틈을 쓰지 않아도 RAID_MAX_FIGHTERS명이면 잡는다.
 *   "N명이면 잡아요"는 체력에서 셈하므로 종류마다 화면이 맞게 바뀐다.
 * ★ 특정 사람·정당·집단을 가리키지 않는다. 누구에게나 해로운 행동만 잡초로 삼는다.
 */
export type RaidKindId = "troll" | "hate" | "rumor" | "bribe" | "bossy" | "grab";

export interface RaidKind {
  id: RaidKindId;
  name: string;
  hp: number;
  /** 한 줄 성질. */
  trait: string;
  /** 맞을수록 바뀌는 대사(체력 많을 때부터). */
  taunts: string[];
  /** 도망갔을 때. */
  escaped: string;
  /** 패널 바탕(위·아래). 글자는 흰색이라 어둡게 둔다. */
  bg: [string, string];
}

/** 빈틈을 하나도 쓰지 않고 모두 기력을 다 쓰면 잡히는 인원(가장 센 450 ÷ 60 → 8). */
export const RAID_MAX_FIGHTERS = 8;

export const RAID_KINDS: RaidKind[] = [
  {
    id: "troll",
    name: "악플 가시풀",
    hp: 270,
    trait: "익명 뒤에 숨어 가시를 날려요",
    taunts: ["ㅋㅋ 그게 최선이야?", "얼굴 안 보이니까 아무 말이나 해도 되지~", "가시 하나에 하루가 망가지지? 그게 재밌거든", "잠깐, 신고는 하지 마…"],
    escaped: "악플 가시풀이 가시를 뿌리고 숨어 버렸어요",
    bg: ["#7a2433", "#3d0f18"],
  },
  {
    id: "hate",
    name: "혐오 쐐기풀",
    hp: 270,
    trait: "닿기만 해도 따끔, 편을 갈라 번져요",
    taunts: ["너희끼리 싸우면 내가 자라지", "다르면 틀린 거야, 몰랐어?", "한 포기 뽑아도 미움은 씨를 남겨", "어… 다 같이 덤비는 건 반칙이야!"],
    escaped: "혐오 쐐기풀이 씨를 날리고 사라졌어요",
    bg: ["#8a3a12", "#421a06"],
  },
  {
    id: "rumor",
    name: "가짜뉴스 덩굴",
    hp: 360,
    trait: "근거 없는 말을 먹고 퍼져요",
    taunts: ["근거? 그런 거 없어도 잘만 퍼지는데!", "퍼 나르는 손이 많을수록 난 커진다고", "제목만 읽고 가, 본문은 내가 지어 줄게", "원문을 확인하다니… 그건 반칙이야!"],
    escaped: "가짜뉴스 덩굴이 광장 밖으로 퍼져 나갔어요",
    bg: ["#4b2a74", "#21103a"],
  },
  {
    id: "bribe",
    name: "검은돈 독초",
    hp: 360,
    trait: "탁자 밑으로 오가는 돈에 뿌리를 내려요",
    taunts: ["이거 받고 못 본 척해", "영수증? 그런 건 없어", "뿌리는 땅 밑으로, 돈은 탁자 밑으로", "장부를 펼치지 마!"],
    escaped: "검은돈 독초가 돈다발을 챙겨 달아났어요",
    bg: ["#2b2a1e", "#0f0e08"],
  },
  {
    id: "bossy",
    name: "갑질 엉겅퀴",
    hp: 450,
    trait: "높은 자리에서 남을 짓눌러요",
    taunts: ["내가 누군 줄 알아?", "꼬우면 네가 올라오든가", "물? 내 화분부터 줘", "여, 여럿이 오면 얘기가 다르지…"],
    escaped: "갑질 엉겅퀴가 큰소리만 남기고 떠났어요",
    bg: ["#2f2f7a", "#13133a"],
  },
  {
    id: "grab",
    name: "땅투기 칡",
    hp: 450,
    trait: "남의 땅까지 휘감아 차지해요",
    taunts: ["여기도 내 땅, 저기도 내 땅", "빈칸 보이면 바로 감는다", "광장도 곧 내 거야", "놔, 놔! 내 덩굴 놓으라고!"],
    escaped: "땅투기 칡이 광장 구석까지 휘감고 사라졌어요",
    bg: ["#4d4a14", "#22200a"],
  },
];

/** 이 물결의 거대 잡초. 날마다 종류를 섞고, 물결 순서대로 꺼낸다 — 하루 안에는 겹치지 않는다. */
export function raidKind(day: number, wave: number): RaidKind {
  const order = RAID_KINDS.map((_, i) => i);
  const roll = rng(hash(`raid-kinds:${day}`));
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(roll() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return RAID_KINDS[order[(wave - 1) % order.length]];
}

/** 이 물결의 체력(때릴 수). 종류가 정한다. */
export function raidHp(day: number, wave: number): number {
  return raidKind(day, wave).hp;
}

/** 맞은 만큼 바뀌는 대사. */
export function raidTaunt(kind: RaidKind, hits: number, hp: number): string {
  const i = Math.min(kind.taunts.length - 1, Math.floor((Math.min(hits, hp) / hp) * kind.taunts.length));
  return kind.taunts[i];
}

/** 받침에 맞는 조사. 이/가, 을/를. */
export function josa(word: string, pair: "이가" | "을를"): string {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const batchim = code >= 0 && code <= 11171 && code % 28 !== 0;
  return word + (batchim ? pair[0] : pair[1]);
}

/**
 * 맞은 수를 나눠 세는 칸(분산 카운터). plazaRaids/{id}/shards/{0..RAID_SHARDS-1}.
 * 모두가 물결 문서 하나를 1씩 올리면 Firestore의 문서당 쓰기 한도(대략 초당 1회)에 막혀
 * 사람이 몰릴수록 한 방이 밀린다. 사람마다 칸 하나를 정해 거기에 올리고, 합계는 칸을 더해 본다.
 * 규칙이 쓰러뜨릴 때 칸을 모두 읽으므로 규칙의 읽기 상한(요청당 10–20)보다 작게 둔다.
 */
export const RAID_SHARDS = 8;

/** 이 사람이 올리는 칸. 사람마다 고정이라 같은 사람의 방끼리는 겹쳐도 다른 사람과는 덜 겹친다. */
export function raidShard(uid: string): number {
  return hash(uid) % RAID_SHARDS;
}

/** 물결 문서 id. 규칙: ^[0-9]{5}-[1-5]$ */
export function raidId(day: number, wave: number): string {
  return `${day}-${wave}`;
}

/**
 * 상자 장부(GardenData.raids)의 열쇠. 물결이 생기기 전에는 날짜 번호(5자리)만 적었다 —
 * 날짜×10+물결(6자리)이라 옛 값과 겹치지 않는다.
 */
export function raidKey(day: number, wave: number): number {
  return day * 10 + wave;
}

export interface RaidWave {
  hp: number;
  hits: number;
  fighters: number;
  /** 서버가 찍은 시각. 막 세운 직후 잠깐 null일 수 있다. */
  spawnedAt: number | null;
  defeatedAt: number | null;
}

export type RaidPhase = "active" | "defeated" | "escaped";

export function raidPhase(r: RaidWave, now: number): RaidPhase {
  if (r.defeatedAt) return "defeated";
  if (r.spawnedAt !== null && now >= r.spawnedAt + RAID_LIFE) return "escaped";
  return "active";
}

/** 이 물결이 끝난 시각(쓰러지거나 도망간). 아직 싸우는 중이면 null. */
export function raidEndedAt(r: RaidWave, now: number): number | null {
  if (r.defeatedAt) return r.defeatedAt;
  if (r.spawnedAt !== null && now >= r.spawnedAt + RAID_LIFE) return r.spawnedAt + RAID_LIFE;
  return null;
}

/**
 * 오늘 물결들(1번부터, 없으면 null)을 보고 다음 물결이 언제 나올 수 있는지.
 * wave=다음 물결 번호, at=그 시각. 오늘 몫을 다 썼거나 아직 싸우는 중이면 null.
 */
export function nextRaidWave(waves: Array<RaidWave | null>, now: number): { wave: number; at: number } | null {
  const day = kstDayNumber(now);
  const last = waves.reduce((n, w, i) => (w ? i + 1 : n), 0);
  if (last === 0) return { wave: 1, at: raidOpensAt(day, 1) };
  if (last >= RAID_PER_DAY) return null;
  const ended = raidEndedAt(waves[last - 1]!, now);
  return ended === null ? null : { wave: last + 1, at: Math.max(raidOpensAt(day, last + 1), ended + RAID_GAP) };
}

/** 문지르기 이만큼이 한 방이다. */
export const RAID_RUBS_PER_STRIKE = 4;
/** 한 사람이 한 방을 보내는 간격. 규칙은 1초를 지키고, 화면은 여유를 둔다. */
export const RAID_STRIKE_GAP = 1_200;

// ── 빈틈 (거대 잡초 2.0, docs/garden-miniroom.md §7.2) ─────────────

/**
 * 빈틈 — 매 시 정각과 30분부터 RAID_GAP_MINUTES분(한국 시각). 빈틈 안의 한 번은 RAID_GAP_MULT로 센다.
 *
 * ★ 시각에서만 정해진다. 규칙이 request.time의 분만 보고 같은 판단을 한다 — 한국 시각과 UTC는
 *   9시간 차이라 분이 같다. 화면이 속여 두 배를 적으면 규칙이 막는다.
 * ★ 폭주(도망 RAID_FRENZY 전부터)에는 빈틈이 RAID_FRENZY_GAP_MINUTES분으로 길어진다. 규칙은
 *   spawnedAt으로 본다.
 * ★ 체력이 RAID_HP_MIN보다 작은 물결(2.0 이전에 태어난 것)에는 빈틈이 없다 — 규칙도 같다.
 *   배포하는 날 이미 떠 있던 체력 180짜리를 둘이 빈틈에 잡지 못하게.
 * 값을 바꾸면 firestore.rules의 raidGap()도 같이 바꾼다 — raid.test.ts가 짝을 본다.
 */
export const RAID_GAP_EVERY = 30;
export const RAID_GAP_MINUTES = 3;
export const RAID_FRENZY_GAP_MINUTES = 6;
export const RAID_FRENZY = 30 * MINUTE;

/** 폭주 중인가 — 도망 RAID_FRENZY 전부터. */
export function raidFrenzy(spawnedAt: number | null, t: number): boolean {
  return spawnedAt !== null && t >= spawnedAt + RAID_LIFE - RAID_FRENZY;
}

/** t가 빈틈 안인가. 규칙의 raidGap()과 같은 판단. */
export function raidGapAt(t: number, spawnedAt: number | null, hp: number): boolean {
  if (hp < RAID_HP_MIN) return false;
  const m = new Date(t).getUTCMinutes() % RAID_GAP_EVERY;
  return m < (raidFrenzy(spawnedAt, t) ? RAID_FRENZY_GAP_MINUTES : RAID_GAP_MINUTES);
}

/**
 * 지금이 빈틈이면 그 끝, 아니면 다음 빈틈의 시작과 끝. 체력이 작은 옛 물결이면 null.
 * 폭주가 빈틈 한가운데서 시작하는 드문 경우는 화면이 1–3분 일찍 끝을 말할 뿐이다(규칙이 세는 값은 같다).
 */
export function raidGapWindow(t: number, spawnedAt: number | null, hp: number): { start: number; end: number; now: boolean } | null {
  if (hp < RAID_HP_MIN) return null;
  const slot = RAID_GAP_EVERY * MINUTE;
  const length = (at: number) => (raidFrenzy(spawnedAt, at) ? RAID_FRENZY_GAP_MINUTES : RAID_GAP_MINUTES) * MINUTE;
  const start = Math.floor(t / slot) * slot;
  if (raidGapAt(t, spawnedAt, hp)) return { start, end: start + length(t), now: true };
  // 폭주가 이 칸의 3–6분 사이에서 시작하면 그때부터가 빈틈이다.
  const frenzyAt = spawnedAt === null ? Infinity : spawnedAt + RAID_LIFE - RAID_FRENZY;
  if (frenzyAt > t && frenzyAt < start + RAID_FRENZY_GAP_MINUTES * MINUTE) {
    return { start: frenzyAt, end: start + RAID_FRENZY_GAP_MINUTES * MINUTE, now: false };
  }
  const next = start + slot;
  return { start: next, end: next + length(next + 1), now: false };
}

/** 한 번(기력 1)이 몇으로 세지는가. */
export function raidStrikeValue(t: number, spawnedAt: number | null, hp: number): number {
  return raidGapAt(t, spawnedAt, hp) ? RAID_GAP_MULT : 1;
}

/**
 * 잡는 데 드는 사람 — 모두 빈틈에만 치면(least), 빈틈을 하나도 쓰지 않으면(most).
 * 체력이 작은 옛 물결은 빈틈이 없어 둘이 같다.
 */
export function raidNeed(hp: number): { least: number; most: number } {
  const most = Math.ceil(hp / RAID_USES_PER_PERSON);
  return { least: hp < RAID_HP_MIN ? most : Math.ceil(hp / RAID_HITS_MAX_PER_PERSON), most };
}

// ── 지원 (거대 잡초 2.0, §7.2) ───────────────────────────────────────

/**
 * 지원 — 기력과 따로, 물결에 든 누구나 건다. 내 표식(fighters/{uid})에 종류(aid)와 때(aidAt)를,
 * 내 칸(shards/{n})에도 같은 것을 적어 모두가 이미 보고 있는 칸 구독으로 본다.
 *
 * ★ 효과는 손맛에만 닿는다(문지르기 수·반격·가짜 약점). 센 값은 바뀌지 않는다 — 반칙해도 얻을 것이 없다.
 * ★ 규칙은 종류(1–3)와 RAID_AID_MIN_GAP 간격만 본다. 60초/20초(아이템)는 화면이 지킨다 —
 *   아이템은 규칙이 못 보는 내 정원 장부에 있다.
 * 값을 바꾸면 firestore.rules의 raidAid()도 같이 바꾼다 — raid.test.ts가 짝을 본다.
 */
export type RaidAidId = "drum" | "umbrella" | "torch";

export const RAID_AIDS: Record<RaidAidId, { code: 1 | 2 | 3; icon: string; label: string; did: string; effect: string; ms: number }> = {
  drum: { code: 1, icon: "🥁", label: "응원 북", did: "북을 쳤어요", effect: "20초 동안 모두 문지르기 절반", ms: 20_000 },
  umbrella: { code: 2, icon: "☂️", label: "큰 우산", did: "우산을 펼쳤어요", effect: "다음 반격 한 번을 모두가 피해요", ms: 0 },
  torch: { code: 3, icon: "🔦", label: "손전등", did: "손전등을 켰어요", effect: "30초 동안 가짜 약점이 사라지고 약점이 자주 떠요", ms: 30_000 },
};
export const RAID_AID_ORDER: RaidAidId[] = ["drum", "umbrella", "torch"];
export function raidAidOf(code: unknown): RaidAidId | null {
  return RAID_AID_ORDER.find((id) => RAID_AIDS[id].code === code) ?? null;
}
/** 지원 사이의 기다림. 아이템이 있으면 짧다(화면이 지킨다). 규칙은 RAID_AID_MIN_GAP만. */
export const RAID_AID_COOLDOWN = 60_000;
export const RAID_AID_COOLDOWN_ITEM = 20_000;
export const RAID_AID_MIN_GAP = 20_000;

/** 함께한 사람 이름을 칸마다 이만큼까지 적는다(쓰러뜨린 뒤 "함께한 사람들"). 칸 8 × 30 = 240명. */
export const RAID_NAMES_PER_SHARD = 30;

/**
 * 필살기 — 상점에서 잼으로 사서 거대 잡초에 쓴다. 쓰면 내 기력(RAID_USES_PER_PERSON)에서
 * 여러 번을 한 커밋에 한꺼번에 쓴다. 빈틈에 쓰면 그것도 RAID_GAP_MULT배로 센다.
 *
 * ★ 필살기는 내 몫을 넘지 못한다. 아이템은 내 정원 문서(클라이언트가 쓴다)에 있어
 *   규칙이 샀는지 볼 수 없다. 그래서 규칙은 "한 커밋에 기력 RAID_FINISHER_MAX번까지, 내 기력 안에서"만
 *   본다. 위조해도 얻는 것은 모아 둔 몫을 한 번에 쓰는 것뿐이고, 혼자서는 여전히 못 잡는다.
 * 값을 바꾸면 firestore.rules의 fighters·shards 절도 같이 바꾼다 — raid.test.ts가 짝을 본다.
 */
export const RAID_FINISHER_MAX = 20;

export type FinisherId = "pick" | "whirl" | "sun";

export const FINISHERS: Record<FinisherId, { label: string; icon: string; hits: number; price: number; perDay: number; shout: string }> = {
  pick: { label: "곡괭이 내려찍기", icon: "⛏️", hits: 5, price: 20, perDay: 6, shout: "내려찍기!" },
  whirl: { label: "뿌리 뽑기 회오리", icon: "🌪️", hits: 10, price: 45, perDay: 3, shout: "회오리!" },
  sun: { label: "햇살 폭발", icon: "☀️", hits: 20, price: 100, perDay: 1, shout: "햇살 폭발!" },
};

export const FINISHER_ORDER: FinisherId[] = ["pick", "whirl", "sun"];

/** 쓰러뜨리면 참여한 사람이 받는 희귀 씨앗 상자. 확률을 공개한다. */
export const RAID_BOX = { jam: 50, odds: [{ tier: "flagship" as Tier, p: 0.8 }, { tier: "perennial" as Tier, p: 0.2 }] };
/** ★★★(빠른 처치)이면 상자의 다년생 확률이 이만큼으로 오른다(§7.4). 공개한다. */
export const RAID_BOX_FAST_PERENNIAL = 0.35;

/**
 * 상자를 연다. 같은 물결·같은 사람이면 같은 씨앗이다 — 새로고침으로 다시 굴리지 못하게.
 * perennial은 다년생 확률. 굴림 값 r이 1 − perennial 이상이면 다년생이다 — 확률이 오르면 다년생 쪽만
 * 넓어지므로, 20%에서 다년생이던 상자는 35%에서도 다년생이다. 품종을 고르는 둘째 굴림은 그대로다.
 * 이미 연 상자는 장부(raids)가 다시 열지 않고, 별은 쓰러진 뒤 바뀌지 않으므로 다시 굴러가는 일이 없다.
 */
export function openRaidBox(seed: string, catalog: Species[], perennial = RAID_BOX.odds[1].p): Species | undefined {
  return openBox(`raid:${seed}`, catalog, perennial);
}

/** 희귀 씨앗 상자(업적 80%, 다년생 20%). key가 같으면 같은 씨앗이다. */
function openBox(key: string, catalog: Species[], perennial = RAID_BOX.odds[1].p): Species | undefined {
  const roll = rng(hash(key));
  const r = roll();
  const tier: Tier = r >= 1 - perennial ? "perennial" : "flagship";
  const pool = catalog.filter((s) => s.tier === tier);
  const fallback = catalog.filter((s) => s.tier === "flagship" || s.tier === "perennial");
  const from = pool.length ? pool : fallback;
  return from.length ? from[Math.floor(roll() * from.length)] : undefined;
}

// ── 도구 ────────────────────────────────────────────────────────────

/**
 * 상점에서 늘 파는 도구. 씨앗과 달리 진열이 돌지 않는다. 확률도 없다.
 *
 * ★ 비료는 남은 시간을 정해진 만큼 당긴다. 비율로 깎으면 오래 걸리는 업적 작물일수록
 *   한 번에 많이 줄어 기다림이 사라진다 — 그래서 절반 비료(황금)는 당기는 양에 상한을 둔다.
 * ★ 한 작물이 한 번 익는 동안 비료는 종류와 상관없이 한 번만. 겹쳐 주지 못하게.
 * ★ 하루에 살 수 있는 수에 상한을 둔다. 잼이 쌓인 사람이 정원을 통째로 건너뛰지 않게.
 */
export type ToolId = "sprinkle" | "fertilizer" | "golden";

export type ToolEffect = { kind: "minutes"; minutes: number } | { kind: "half"; maxMinutes: number };

export const TOOLS: Record<ToolId, { label: string; icon: string; price: number; perDay: number; effect: ToolEffect; hint: string }> = {
  sprinkle: {
    label: "톡톡 비료",
    icon: "💧",
    price: 15,
    perDay: 10,
    effect: { kind: "minutes", minutes: 10 },
    hint: "자라는 작물 하나를 10분 당겨요.",
  },
  fertilizer: {
    label: "쑥쑥 비료",
    icon: "🧴",
    price: 60,
    perDay: 5,
    effect: { kind: "minutes", minutes: 60 },
    hint: "자라는 작물 하나를 1시간 당겨요.",
  },
  golden: {
    label: "황금 비료",
    icon: "✨",
    price: 200,
    perDay: 2,
    effect: { kind: "half", maxMinutes: 120 },
    hint: "자라는 작물 하나의 남은 시간을 절반으로. 다만 2시간까지만 당겨요.",
  },
};

export const TOOL_ORDER: ToolId[] = ["sprinkle", "fertilizer", "golden"];

/** 이 비료가 지금 당겨 줄 시간(ms). 남은 시간을 넘지 않는다. */
export function fertilizerCut(id: ToolId, left: number): number {
  const effect = TOOLS[id].effect;
  const cut = effect.kind === "minutes" ? effect.minutes * MINUTE : Math.min(left / 2, effect.maxMinutes * MINUTE);
  return Math.max(0, Math.min(left, cut));
}

/** 비료를 준 포기. 이미 익었거나 이번 차례에 이미 줬으면 null. */
export function fertilize(plant: Plant, now: number, id: ToolId): Plant | null {
  if (plant.ripeAt <= now || plant.fed === plant.harvests) return null;
  return { ...plant, ripeAt: Math.round(plant.ripeAt - fertilizerCut(id, plant.ripeAt - now)), fed: plant.harvests };
}

// ── 시든 잎 ─────────────────────────────────────────────────────────

/**
 * 시든 잎은 원문 링크가 열리지 않았던 출처다. 광장 한쪽에 가끔 떨어져 있고,
 * 눌러서 링크가 열리는지 확인하면 그 결과가 운영자에게 간다(§3.8).
 *
 * ★ 가끔이어야 한다. 두 시간에 한 장, 하루 세 장까지. 잡초 뽑기의 손맛을
 *   밀어내지 않고, 확인이 일이 되지 않게.
 * ★ 보상은 잡초의 세 배. 링크를 열어 보는 수고가 손해가 아니게.
 * ★ "모르겠어요"에도 같은 보상을 준다. 답에 따라 보상이 달라지면 아무 답이나
 *   누르게 된다 — 이 확인은 정직해야 쓸모가 있다.
 */
export const LEAF_SLOT = 2 * HOUR;
export const LEAF_PER_DAY = 3;
export const LEAF_JAM = WEED.grown.jam * 3;

export type LeafVerdict = "opens" | "fails" | "unsure";

export function leafId(url: string): string {
  return `l${hash(url).toString(36)}`;
}

export function leafSlot(t: number): number {
  return Math.floor((t + KST) / LEAF_SLOT);
}

/**
 * 지금 광장에 떨어진 잎. 이미 확인한 잎은 빼고, 두 시간 슬롯마다 하나를 고른다.
 * 이번 슬롯에 이미 하나 확인했거나 오늘 몫을 다 썼으면 없다.
 */
export function pickLeaf<T extends { id: string }>(
  leaves: T[],
  seen: { checked: string[]; slot: number; day: string; count: number },
  t: number,
): T | undefined {
  const slot = leafSlot(t);
  const today = kstDay(t);
  if (seen.slot === slot) return undefined;
  if (seen.day === today && seen.count >= LEAF_PER_DAY) return undefined;
  const done = new Set(seen.checked);
  const pool = leaves.filter((l) => !done.has(l.id)).sort((a, b) => (a.id < b.id ? -1 : 1));
  return pool.length ? pool[hash(`leaf:${slot}`) % pool.length] : undefined;
}

/** 잎이 떨어질 칸. 잡초가 없는 칸을 고른다. 다 덮였으면 없다 — 뽑으면 보인다. */
export function leafCell(id: string, slot: number, weedy: Set<number>, cells = PLAZA_CELLS): number | undefined {
  const start = hash(`${id}:${slot}`) % cells;
  for (let i = 0; i < cells; i++) {
    const c = (start + i) % cells;
    if (!weedy.has(c)) return c;
  }
  return undefined;
}

// ── 탐정 온실 ───────────────────────────────────────────────────────

/**
 * 탐정 온실은 고르고 싶은 사람만 들어가는 구역이다(§3.13, §4). SNS에서 도는 주장
 * (정책의 `rumors`) 하나를 보여 주고, 그 말에 답하는 내용을 카드 셋 중에서 찾게 한다.
 *
 * ★ 사람이 소문을 참·거짓으로 판정하지 않는다. 답은 콘텐츠가 이미 정해 두었다
 *   (rumor.claimIds). 온실은 그 답을 찾아 읽게 하는 놀이다 — 사용자 입력은 아무 데도
 *   쓰이지 않는다.
 * ★ 틀려도 잃는 것은 없다. 처음에 맞히면 잼을 조금 더 줄 뿐이다.
 * ★ 하루 세 사건. 온실이 정원의 몸체를 밀어내지 않게.
 * ★ 사건 셋을 풀 때마다 온실 상자(희귀 씨앗)를 준다. 온실에서만 나오는 보상이다.
 */
export const CASE_PER_DAY = 3;
export const CASE_JAM = { first: 20, later: 10 } as const;
export const CASE_BOX_EVERY = 3;

export interface CaseLedger {
  /** 푼 사건 id. */
  solved: string[];
  /** 한 번이라도 틀린 사건 id. 새로고침으로 "처음에 맞힘"을 다시 받지 못하게. */
  missed: string[];
  /** 오늘(한국 날짜)과 오늘 푼 사건. */
  day: string;
  today: string[];
}

/**
 * 오늘의 사건. 어제까지 푼 것을 뺀 사건들 중에서 날짜로 정한 순서의 앞 셋이다.
 * 오늘 푼 사건은 빼지 않는다 — 하나를 풀었다고 나머지 둘이 바뀌면 안 된다.
 * 아직 안 푼 사람끼리는 같은 사건을 본다.
 */
export function todaysCases<T extends { id: string }>(cases: T[], ledger: CaseLedger, t: number): T[] {
  const day = kstDay(t);
  const today = new Set(ledger.day === day ? ledger.today : []);
  const before = new Set(ledger.solved.filter((id) => !today.has(id)));
  return cases
    .filter((c) => !before.has(c.id))
    .map((c) => ({ c, k: hash(`case:${day}:${c.id}`) }))
    .sort((a, b) => a.k - b.k || (a.c.id < b.c.id ? -1 : 1))
    .slice(0, CASE_PER_DAY)
    .map(({ c }) => c);
}

/** 사건을 푼 보상. n은 이 사건까지 푼 수 — 셋째마다 온실 상자가 열린다. */
export function caseReward(firstTry: boolean, n: number): { jam: number; box: boolean } {
  return { jam: firstTry ? CASE_JAM.first : CASE_JAM.later, box: n > 0 && n % CASE_BOX_EVERY === 0 };
}

/** 온실 상자. 사건 id로 굴린다 — 같은 사건이면 같은 씨앗이다. */
export function openCaseBox(caseId: string, catalog: Species[]): Species | undefined {
  return openBox(`case:${caseId}`, catalog);
}

// ── 도감 지도 ───────────────────────────────────────────────────────

/**
 * 지도의 구역 이름. 업적 분야 이름(GROUP_LABEL)과 같아야 한다 — rules.test.ts가 본다.
 * 화면에서 @/content/achievements를 불러오면 업적 전체가 번들에 실려서 여기 따로 둔다.
 */
export const REGION_LABEL: Record<string, string> = {
  economy: "재정·경제",
  welfare: "민생·복지",
  institution: "제도·행정",
  diplomacy: "외교·안보",
  region: "지역·인프라",
  disaster: "재난 대응",
  words: "언행",
};
export const REGION_ORDER = ["economy", "welfare", "institution", "diplomacy", "region", "disaster", "words"];

/** 이어진 품종의 원본을 읽으면 그 씨앗을 준다. 품종마다 한 번, 하루 이만큼. */
export const TRAIL_PER_DAY = 3;

export type MapCell = "seen" | "trail" | "fog";

/**
 * 지도의 칸 상태. 거둔 품종은 밝고(seen), 거둔 품종에서 이어진 품종은 실루엣(trail)이며,
 * 나머지는 안개(fog)다. 링크를 따라가야 새 칸이 열린다(§4).
 */
export function mapCells(catalog: Species[], seen: ReadonlySet<string>): Map<string, MapCell> {
  const out = new Map<string, MapCell>();
  for (const s of catalog) out.set(s.id, seen.has(s.id) ? "seen" : "fog");
  for (const s of catalog) {
    if (!seen.has(s.id)) continue;
    for (const id of s.links) if (out.get(id) === "fog") out.set(id, "trail");
  }
  return out;
}

// ── 정원 놀러 가기 ──────────────────────────────────────────────────

/** 하루에 줄 수 있는 물, 받아서 쓰는 물. 둘 다 한국 날짜로 끊는다. */
export const WATER_PER_DAY = 5;
/** 물 한 번이 자라는 중인 포기마다 줄여 주는 남은 시간의 몫. */
export const WATER_CUT = 0.1;

/**
 * 물을 준다. 아직 익지 않은 포기의 남은 시간을 cut만큼 줄인다(보통 WATER_CUT, 1촌의 물은
 * ilchon/rules.ts의 WATER_CUT_ILCHON).
 * 단비 창은 다시 계산하지 않는다 — 남은 시간이 조금 짧아질 뿐이라 차이가 작다.
 */
export function waterBeds(beds: Array<Plant | null>, now: number, cut = WATER_CUT): Array<Plant | null> {
  return beds.map((p) =>
    p && p.ripeAt > now ? { ...p, ripeAt: Math.round(now + (p.ripeAt - now) * (1 - cut)) } : p,
  );
}

/** 공개 id. uid가 아니다 — 링크가 돌아도 계정을 되짚지 못하게. 규칙: ^g[0-9a-z]{8,12}$ */
export function newPublicId(random: () => number = Math.random): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  return `g${Array.from({ length: 10 }, () => chars[Math.floor(random() * chars.length)]).join("")}`;
}

export const PUBLIC_ID = /^g[0-9a-z]{8,12}$/;

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
export const BLOOM_BONUS = { each: 0.02, max: 0.4 } as const;

export function bloomBonus(bloomed: number): number {
  return Math.min(BLOOM_BONUS.max, bloomed * BLOOM_BONUS.each);
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

// ── 초대 씨앗 ───────────────────────────────────────────────────────

/**
 * 초대 씨앗 (docs/garden-game.md §3.10). 초대 링크로 온 사람이 첫 열매를 거두면
 * 둘 다 희귀 씨앗 상자를 하나씩 받는다.
 *
 * ★ 보상은 링크를 보낸 횟수가 아니라 친구가 실제로 거둔 것에 건다(§1).
 * ★ 초대한 사람은 평생 INVITE_CAP명까지만 받는다. 익명 계정을 여럿 만들어 자기를
 *   초대하는 반칙의 끝을 정해 둔다. 초대받은 사람은 평생 한 번이다(규칙).
 * ★ 초대 코드는 공개 id와 따로다. 정원을 공개하지 않아도 초대할 수 있다.
 */
export const INVITE_CAP = 10;
export const INVITE_CODE = /^i[0-9a-z]{10}$/;

export function newInviteCode(random: () => number = Math.random): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  return `i${Array.from({ length: 10 }, () => chars[Math.floor(random() * chars.length)]).join("")}`;
}

/** 초대 상자. 거대 잡초 상자와 같은 확률이다(대표 80% · 다년생 20%). key가 같으면 같은 씨앗. */
export function openInviteBox(key: string, catalog: Species[]): Species | undefined {
  return openBox(`invite:${key}`, catalog);
}

/** 초대한 사람이 지금 더 받을 상자 수. joined=첫 열매를 거둔 친구 수, claimed=이미 받은 수. */
export function invitePending(joined: number, claimed: number): number {
  return Math.max(0, Math.min(joined, INVITE_CAP) - claimed);
}

/**
 * 초대를 받아들일 수 있는 정원인가. 아직 아무것도 거두지 않은 새 정원이고, 다른 초대를
 * 받은 적 없고, 내 코드가 아니어야 한다.
 */
export function canAcceptInvite(
  d: { dex: Record<string, unknown>; invite: { code: string | null; by: string | null } },
  code: string,
): boolean {
  return INVITE_CODE.test(code) && Object.keys(d.dex).length === 0 && d.invite.by === null && d.invite.code !== code;
}

// ── 칭호 ────────────────────────────────────────────────────────────

/**
 * 칭호 (docs/garden-game.md §3.10). 정원에 이미 적힌 기록에서 셈한다 — 따로 모으는 장부가 없어
 * 예전에 한 것도 저절로 쳐 준다. 내 정원과 공개한 정원에만 보인다. 순위표는 없다(§1).
 *
 * ★ 공개 정원에는 단계 숫자만 싣는다. 이름은 보는 쪽이 이 표에서 읽는다 — 사람이 지은 글이 아니다.
 * ★ 꽃밭의 "정원지기"(업적마다 가장 많이 가꾼 사람)와 겹치지 않게, 광장 칭호는 잡초 사냥꾼이다.
 */
export type TitleId = "dex" | "storm" | "plaza";

export const TITLE_ORDER: TitleId[] = ["dex", "storm", "plaza"];

export const TITLES: Record<TitleId, { icon: string; name: string; what: string; unit: string; steps: [number, number, number] }> = {
  dex: { icon: "📖", name: "품종학자", what: "도감에 모은 품종", unit: "종", steps: [10, 40, 100] },
  storm: { icon: "⛈", name: "폭풍추적자", what: "도감에 모은 촉촉·반짝 변이", unit: "칸", steps: [3, 15, 40] },
  plaza: { icon: "🪓", name: "잡초 사냥꾼", what: "함께 쓰러뜨린 거대 잡초", unit: "마리", steps: [1, 5, 20] },
};

export const TITLE_MAX = 3;

/** 칭호마다 센 값. 도감(품종 → 본 변이)과 받은 거대 잡초 상자에서 나온다. */
export function titleCounts(d: { dex: Record<string, readonly string[]>; raids: readonly number[] }): Record<TitleId, number> {
  const seen = Object.values(d.dex);
  return {
    dex: seen.length,
    storm: seen.reduce((n, m) => n + (m.includes("moist") ? 1 : 0) + (m.includes("sparkle") ? 1 : 0), 0),
    plaza: d.raids.length,
  };
}

/** 단계. 0=아직, 1~3=★ 수. */
export function titleLevel(id: TitleId, count: number): number {
  return TITLES[id].steps.filter((s) => count >= s).length;
}

export function titleLevels(d: Parameters<typeof titleCounts>[0]): Record<TitleId, number> {
  const c = titleCounts(d);
  return { dex: titleLevel("dex", c.dex), storm: titleLevel("storm", c.storm), plaza: titleLevel("plaza", c.plaza) };
}

/** 다음 단계까지 남은 수. 다 올랐으면 null. */
export function titleNext(id: TitleId, count: number): number | null {
  const step = TITLES[id].steps.find((s) => count < s);
  return step === undefined ? null : step - count;
}

export function titleLabel(id: TitleId, level: number): string {
  return `${TITLES[id].icon} ${TITLES[id].name} ${"★".repeat(Math.min(level, TITLE_MAX))}`;
}

// ── 익음 알림 ───────────────────────────────────────────────────────

/**
 * 다 익는 때를 캘린더에 넣는다(§3.6). 서버가 보내는 알림이 아니라 내 캘린더가 울린다.
 * ★ 22시~다음 날 8시에 익으면 8시로 미룬다 — 22시 이후에는 알림을 보내지 않는다(§3.6).
 *   열매는 익은 채로 기다린다. 시드는 일은 없다.
 */
export const QUIET_FROM = 22;
export const QUIET_UNTIL = 8;

export function alarmTime(ripeAt: number): number {
  const hour = new Date(ripeAt + KST).getUTCHours();
  if (hour >= QUIET_FROM) return kstMidnight(ripeAt) + 24 * HOUR + QUIET_UNTIL * HOUR;
  if (hour < QUIET_UNTIL) return kstMidnight(ripeAt) + QUIET_UNTIL * HOUR;
  return ripeAt;
}

/** 알림 카드를 띄울 만큼 먼가. 곧 익으면 기다리면 된다. */
export const ALARM_MIN_LEAD = 15 * MINUTE;

/** 한국 시각 "오후 3:42" 또는 날이 다르면 "내일 오전 8:00". */
export function formatClock(t: number, now: number): string {
  const clock = new Date(t).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Seoul" });
  const days = Math.round((kstMidnight(t) - kstMidnight(now)) / (24 * HOUR));
  return days === 0 ? clock : days === 1 ? `내일 ${clock}` : `${kstDay(t).slice(5).replace("-", "/")} ${clock}`;
}

// ── 표시 ────────────────────────────────────────────────────────────

export function formatLeft(ms: number): string {
  if (ms <= 0) return "다 익음";
  const m = Math.ceil(ms / MINUTE);
  if (m < 60) return `${m}분`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}시간 ${rest}분` : `${h}시간`;
}
