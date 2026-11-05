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
 * ★ 혼자서는 잡지 못한다. 한 사람은 물결마다 RAID_HITS_PER_PERSON방까지만 칠 수 있고,
 *   체력은 적어도 RAID_MIN_FIGHTERS명이 끝까지 쳐야 닿는다. 규칙이 둘 다 지킨다.
 * ★ 오래 버티면 도망간다(RAID_LIFE). 그래서 "지금 같이 잡자"가 된다. 도망가면 상자는 없다.
 * ★ 다음 물결은 앞 물결이 끝나고(쓰러지거나 도망가고) RAID_GAP 뒤, 광장이 무성할 때 나온다.
 * 값을 바꾸면 firestore.rules의 plazaRaids 절도 같이 바꾼다 — raid.test.ts가 짝을 본다.
 */
export const RAID_PER_DAY = 3;
export const RAID_LIFE = 3 * HOUR;
export const RAID_GAP = 2 * HOUR;
export const RAID_HITS_PER_PERSON = 60;
export const RAID_MIN_FIGHTERS = 3;
export const RAID_HP_PER_GARDENER = 30;
export const RAID_HP_MIN = RAID_MIN_FIGHTERS * RAID_HITS_PER_PERSON;
export const RAID_HP_MAX = 3000;

/**
 * 거대 잡초의 체력(때릴 수). 그날 온 정원지기 수로 정한다 — 오늘 온 사람의 절반쯤이
 * 자기 몫을 다 쳐야 쓰러진다. 적어도 RAID_MIN_FIGHTERS명은 있어야 한다.
 */
export function raidHp(gardenersToday: number): number {
  return Math.min(RAID_HP_MAX, Math.max(RAID_HP_MIN, Math.round(Math.max(0, gardenersToday) * RAID_HP_PER_GARDENER)));
}

/** 물결 문서 id. 규칙: ^[0-9]{5}-[1-3]$ */
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
  const last = waves.reduce((n, w, i) => (w ? i + 1 : n), 0);
  if (last === 0) return { wave: 1, at: now };
  if (last >= RAID_PER_DAY) return null;
  const ended = raidEndedAt(waves[last - 1]!, now);
  return ended === null ? null : { wave: last + 1, at: ended + RAID_GAP };
}

/** 문지르기 이만큼이 한 방이다. */
export const RAID_RUBS_PER_STRIKE = 4;
/** 한 사람이 한 방을 보내는 간격. 규칙은 1초를 지키고, 화면은 여유를 둔다. */
export const RAID_STRIKE_GAP = 1_200;

/** 쓰러뜨리면 참여한 사람이 받는 희귀 씨앗 상자. 확률을 공개한다. */
export const RAID_BOX = { jam: 50, odds: [{ tier: "flagship" as Tier, p: 0.8 }, { tier: "perennial" as Tier, p: 0.2 }] };

/** 상자를 연다. 같은 날·같은 사람이면 같은 씨앗이다 — 새로고침으로 다시 굴리지 못하게. */
export function openRaidBox(seed: string, catalog: Species[]): Species | undefined {
  return openBox(`raid:${seed}`, catalog);
}

/** 희귀 씨앗 상자(업적 80%, 다년생 20%). key가 같으면 같은 씨앗이다. */
function openBox(key: string, catalog: Species[]): Species | undefined {
  const roll = rng(hash(key));
  let r = roll();
  let tier: Tier = "flagship";
  for (const o of RAID_BOX.odds) {
    if (r < o.p) {
      tier = o.tier;
      break;
    }
    r -= o.p;
  }
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
 * 물을 준다. 아직 익지 않은 포기의 남은 시간을 WATER_CUT만큼 줄인다.
 * 단비 창은 다시 계산하지 않는다 — 남은 시간이 조금 짧아질 뿐이라 차이가 작다.
 */
export function waterBeds(beds: Array<Plant | null>, now: number): Array<Plant | null> {
  return beds.map((p) =>
    p && p.ripeAt > now ? { ...p, ripeAt: Math.round(now + (p.ripeAt - now) * (1 - WATER_CUT)) } : p,
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

// ── 표시 ────────────────────────────────────────────────────────────

export function formatLeft(ms: number): string {
  if (ms <= 0) return "다 익음";
  const m = Math.ceil(ms / MINUTE);
  if (m < 60) return `${m}분`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}시간 ${rest}분` : `${h}시간`;
}
