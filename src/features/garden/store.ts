"use client";

import { create } from "zustand";

import {
  CARE_PER_DAY,
  defaultNick,
  growMinutes,
  kstDayNumber,
  NECTAR,
  NICK_MAX,
  kstDay,
  PLAZA_SPEED,
  PLOT_UPGRADES,
  pickNote,
  ripeTime,
  rng,
  rollMutations,
  SEED_PRICE,
  SHINE_PER_DAY,
  START_JAM,
  START_PLOTS,
  WEED,
  WEED_REWARD_PER_DAY,
  WEED_SEED_ODDS,
  withRainbow,
  fruitValue,
  type WeedStage,
} from "./rules";
import type { Fruit, Mutation, Plant, PlazaLevel, Species } from "./types";

/**
 * 개인 정원의 상태.
 *
 * 저장할 값(GardenData)과 동작을 나눈다. 저장할 값은 통째로 localStorage와
 * Firestore(users/{uid}/garden/state)에 간다. 동작은 매번 품종표를 받는다 —
 * 품종표는 서버가 콘텐츠에서 만들어 페이지로 내려 주는 것이라 상태에 넣지 않는다.
 */

export interface GardenData {
  v: 1;
  jam: number;
  beds: Array<Plant | null>;
  seeds: Record<string, number>;
  basket: Fruit[];
  /** 품종 id → 본 변이. 키가 있으면 한 번은 거둔 것이다. */
  dex: Record<string, Mutation[]>;
  /** 모은 쪽지 id. */
  notes: string[];
  shine: { day: string; count: number };
  shop: { slot: number; bought: Record<string, number> };
  weeds: { day: string; count: number };
  /** 원본 페이지에서 받아 간 선물 씨앗. 품종마다 한 번. */
  gifts: string[];
  /**
   * 내가 업적마다 준 가꿈과 오늘 준 양. 화면용 사본이다 — 정원지기를 가리는
   * 진짜 값은 Firestore의 blooms/{id}/keepers/{uid}에 있고 규칙이 지킨다.
   */
  care: Record<string, number>;
  careToday: { day: number; given: Record<string, number> };
  /** 정원 이름. 정원지기 명패에 걸린다. */
  nick: string;
  /** 오늘 꽃꿀을 받은 업적. */
  nectar: { day: string; taken: string[] };
  updatedAt: number;
}

const STORAGE_KEY = "jamtong-garden-v1";

function fresh(catalog: Species[]): GardenData {
  const roll = rng(Date.now() >>> 0);
  const sprouts = catalog.filter((s) => s.tier === "sprout");
  const commons = catalog.filter((s) => s.tier === "common");
  const seeds: Record<string, number> = {};
  // 처음 온 사람이 바로 심을 수 있게. 빨리 익는 새싹 셋과 일반 하나.
  for (let i = 0; i < 3 && sprouts.length; i++) {
    const s = sprouts[Math.floor(roll() * sprouts.length)];
    seeds[s.id] = (seeds[s.id] ?? 0) + 1;
  }
  if (commons.length) {
    const c = commons[Math.floor(roll() * commons.length)];
    seeds[c.id] = (seeds[c.id] ?? 0) + 1;
  }
  return {
    v: 1,
    jam: START_JAM,
    beds: Array(START_PLOTS).fill(null),
    seeds,
    basket: [],
    dex: {},
    notes: [],
    shine: { day: "", count: 0 },
    shop: { slot: 0, bought: {} },
    weeds: { day: "", count: 0 },
    gifts: [],
    care: {},
    careToday: { day: 0, given: {} },
    nick: defaultNick(String(Date.now()) + Math.random()),
    nectar: { day: "", taken: [] },
    updatedAt: Date.now(),
  };
}

/** 꽃밭이 생기기 전에 저장된 정원에 빈 칸을 채운다. */
function normalize(data: GardenData): GardenData {
  return {
    ...data,
    care: data.care ?? {},
    careToday: data.careToday ?? { day: 0, given: {} },
    nick: data.nick || defaultNick(String(data.updatedAt)),
    nectar: data.nectar ?? { day: "", taken: [] },
  };
}

export function readLocal(): GardenData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as GardenData) : null;
    return data?.v === 1 ? normalize(data) : null;
  } catch {
    return null;
  }
}

function writeLocal(data: GardenData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 비공개 창 등. 이번 방문 동안은 메모리에서 논다.
  }
}

function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function take(seeds: Record<string, number>, id: string): Record<string, number> {
  const next = { ...seeds, [id]: (seeds[id] ?? 0) - 1 };
  if (next[id] <= 0) delete next[id];
  return next;
}

function give(seeds: Record<string, number>, id: string, n = 1): Record<string, number> {
  return { ...seeds, [id]: (seeds[id] ?? 0) + n };
}

export interface WeedReward {
  jam: number;
  seed?: string;
  capped: boolean;
}

interface GardenState {
  data: GardenData | null;
  /** 첫 렌더 뒤에 부른다. localStorage는 서버 렌더에 없다. */
  boot: (catalog: Species[]) => void;
  /** Firestore에서 받은 것이 더 새것이면 바꾼다. */
  adopt: (remote: GardenData) => void;
  plant: (bed: number, species: Species, plaza: PlazaLevel) => void;
  harvest: (bed: number, species: Species, plaza: PlazaLevel) => Fruit | null;
  dig: (bed: number) => void;
  shine: (fruitId: string) => boolean;
  sell: (fruitIds: string[], catalog: Map<string, Species>, bonus: number) => number;
  buy: (species: Species, slot: number, stock: number) => boolean;
  upgrade: () => boolean;
  weed: (stage: WeedStage, catalog: Species[]) => WeedReward;
  gift: (species: Species) => boolean;
  /** 오늘 상한 안에서 줄 수 있는 가꿈. 0이면 오늘은 다 줬다. */
  careRoom: (speciesId: string, delta: number) => number;
  /** 가꿈을 준 뒤 사본을 맞춘다. mine은 서버가 돌려준 내 합계(없으면 더한다). */
  recordCare: (speciesId: string, delta: number, mine?: number) => void;
  rename: (nick: string) => void;
  takeNectar: (speciesIds: string[]) => number;
}

export const useGarden = create<GardenState>((set, get) => {
  /** 바꾸고 저장한다. 모든 동작이 이 한 길로 지나간다. */
  const commit = (next: GardenData) => {
    const stamped = { ...next, updatedAt: Date.now() };
    writeLocal(stamped);
    set({ data: stamped });
  };

  return {
    data: null,

    boot: (catalog) => {
      if (get().data) return;
      const known = new Set(catalog.map((s) => s.id));
      const saved = readLocal();
      // 콘텐츠가 빠지면 그 품종도 빠진다. 밭에 남은 것은 비운다.
      const data = saved
        ? { ...saved, beds: saved.beds.map((p) => (p && known.has(p.speciesId) ? p : null)) }
        : fresh(catalog);
      writeLocal(data);
      set({ data });
    },

    adopt: (remote) => {
      const local = get().data;
      if (remote?.v !== 1) return;
      if (!local || remote.updatedAt > local.updatedAt) {
        const data = normalize(remote);
        writeLocal(data);
        set({ data });
      }
    },

    plant: (bed, species, plaza) => {
      const d = get().data;
      if (!d || d.beds[bed] || !d.seeds[species.id]) return;
      const now = Date.now();
      const speed = PLAZA_SPEED[plaza];
      const beds = [...d.beds];
      beds[bed] = {
        id: uid(),
        speciesId: species.id,
        plantedAt: now,
        ripeAt: ripeTime(now, growMinutes(species), speed),
        speed,
        harvests: 0,
      };
      commit({ ...d, beds, seeds: take(d.seeds, species.id) });
    },

    harvest: (bed, species, plaza) => {
      const d = get().data;
      const plant = d?.beds[bed];
      const now = Date.now();
      if (!d || !plant || plant.ripeAt > now) return null;

      const fruitId = `${plant.id}-${plant.harvests}`;
      const fruit: Fruit = {
        id: fruitId,
        speciesId: species.id,
        noteId: pickNote(fruitId, species),
        mutations: rollMutations(plant, plaza),
        harvestedAt: now,
      };

      const beds = [...d.beds];
      // 다년생은 다시 연다. 나머지는 밭을 비운다.
      beds[bed] =
        species.tier === "perennial"
          ? {
              ...plant,
              plantedAt: now,
              ripeAt: ripeTime(now, growMinutes(species, true), plant.speed),
              harvests: plant.harvests + 1,
            }
          : null;

      const seen = new Set([...(d.dex[species.id] ?? []), ...fruit.mutations]);
      commit({
        ...d,
        beds,
        basket: [fruit, ...d.basket].slice(0, 120),
        dex: { ...d.dex, [species.id]: [...seen] },
        notes: fruit.noteId && !d.notes.includes(fruit.noteId) ? [...d.notes, fruit.noteId] : d.notes,
      });
      return fruit;
    },

    dig: (bed) => {
      const d = get().data;
      if (!d) return;
      const beds = [...d.beds];
      beds[bed] = null;
      commit({ ...d, beds });
    },

    shine: (fruitId) => {
      const d = get().data;
      if (!d) return false;
      const today = kstDay(Date.now());
      const used = d.shine.day === today ? d.shine.count : 0;
      const fruit = d.basket.find((f) => f.id === fruitId);
      if (!fruit || fruit.mutations.includes("shine") || used >= SHINE_PER_DAY) return false;
      const mutations = withRainbow([...fruit.mutations, "shine"]);
      const dexSeen = new Set([...(d.dex[fruit.speciesId] ?? []), ...mutations]);
      commit({
        ...d,
        basket: d.basket.map((f) => (f.id === fruitId ? { ...f, mutations } : f)),
        dex: { ...d.dex, [fruit.speciesId]: [...dexSeen] },
        shine: { day: today, count: used + 1 },
      });
      return true;
    },

    sell: (fruitIds, catalog, bonus) => {
      const d = get().data;
      if (!d) return 0;
      const ids = new Set(fruitIds);
      let jam = 0;
      for (const f of d.basket) {
        const species = catalog.get(f.speciesId);
        if (ids.has(f.id) && species) jam += fruitValue(f, species, bonus);
      }
      commit({ ...d, jam: d.jam + jam, basket: d.basket.filter((f) => !ids.has(f.id)) });
      return jam;
    },

    buy: (species, slot, stock) => {
      const d = get().data;
      if (!d) return false;
      const bought = d.shop.slot === slot ? d.shop.bought : {};
      const price = SEED_PRICE[species.tier];
      if ((bought[species.id] ?? 0) >= stock || d.jam < price) return false;
      commit({
        ...d,
        jam: d.jam - price,
        seeds: give(d.seeds, species.id),
        shop: { slot, bought: { ...bought, [species.id]: (bought[species.id] ?? 0) + 1 } },
      });
      return true;
    },

    upgrade: () => {
      const d = get().data;
      const next = d && PLOT_UPGRADES.find((u) => u.plots > d.beds.length);
      if (!d || !next || d.jam < next.price) return false;
      const beds = [...d.beds, ...Array(next.plots - d.beds.length).fill(null)];
      commit({ ...d, jam: d.jam - next.price, beds });
      return true;
    },

    weed: (stage, catalog) => {
      const d = get().data;
      if (!d) return { jam: 0, capped: true };
      const today = kstDay(Date.now());
      const count = d.weeds.day === today ? d.weeds.count : 0;
      if (count >= WEED_REWARD_PER_DAY) {
        commit({ ...d, weeds: { day: today, count: count + 1 } });
        return { jam: 0, capped: true };
      }
      const jam = WEED[stage].jam;
      let seed: string | undefined;
      if (Math.random() < WEED_SEED_ODDS) {
        // 잡초 속 씨앗은 새싹 70%, 일반 30%.
        const tier = Math.random() < 0.7 ? "sprout" : "common";
        const pool = catalog.filter((s) => s.tier === tier);
        seed = pool[Math.floor(Math.random() * pool.length)]?.id;
      }
      commit({
        ...d,
        jam: d.jam + jam,
        seeds: seed ? give(d.seeds, seed) : d.seeds,
        weeds: { day: today, count: count + 1 },
      });
      return { jam, seed, capped: false };
    },

    careRoom: (speciesId, delta) => {
      const d = get().data;
      if (!d) return 0;
      const today = kstDayNumber(Date.now());
      const given = d.careToday.day === today ? (d.careToday.given[speciesId] ?? 0) : 0;
      return Math.max(0, Math.min(delta, CARE_PER_DAY - given));
    },

    recordCare: (speciesId, delta, mine) => {
      const d = get().data;
      if (!d) return;
      const today = kstDayNumber(Date.now());
      const given = d.careToday.day === today ? d.careToday.given : {};
      commit({
        ...d,
        care: { ...d.care, [speciesId]: mine ?? (d.care[speciesId] ?? 0) + delta },
        careToday: { day: today, given: { ...given, [speciesId]: (given[speciesId] ?? 0) + delta } },
      });
    },

    rename: (nick) => {
      const d = get().data;
      const clean = nick.replace(/\s+/g, " ").trim().slice(0, NICK_MAX);
      if (!d || !clean) return;
      commit({ ...d, nick: clean });
    },

    takeNectar: (speciesIds) => {
      const d = get().data;
      if (!d) return 0;
      const today = kstDay(Date.now());
      const taken = d.nectar.day === today ? d.nectar.taken : [];
      const fresh = speciesIds.filter((id) => !taken.includes(id));
      if (fresh.length === 0) return 0;
      const jam = fresh.length * NECTAR;
      commit({ ...d, jam: d.jam + jam, nectar: { day: today, taken: [...taken, ...fresh] } });
      return jam;
    },

    gift: (species) => {
      const d = get().data;
      if (!d || d.gifts.includes(species.id)) return false;
      commit({ ...d, seeds: give(d.seeds, species.id), gifts: [...d.gifts, species.id] });
      return true;
    },
  };
});
