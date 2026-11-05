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
  newPublicId,
  TRAIL_PER_DAY,
  openRaidBox,
  RAID_BOX,
  WATER_PER_DAY,
  waterBeds,
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
  fertilize,
  TOOLS,
  type ToolId,
  fruitValue,
  LEAF_JAM,
  leafSlot,
  caseReward,
  openCaseBox,
  type CaseLedger,
  type WeedStage,
} from "./rules";
import { initialCoach, normalizeCoach, type CoachData, type CoachMark, type TipTab } from "./coach";
import type { Case, Fruit, Mutation, Plant, PlazaLevel, Species } from "./types";

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
  /**
   * 희귀 씨앗 상자를 받은 거대 잡초. rules.ts의 raidKey(날짜번호×10+물결).
   * 물결이 생기기 전에 받은 것은 날짜 번호 그대로 남아 있다 — 겹치지 않는다.
   */
  raids: number[];
  /**
   * 시든 잎. 확인한 잎 id, 마지막으로 확인한 두 시간 슬롯, 오늘 확인한 수.
   * 잎이 "가끔" 떨어지게 하는 장부다(rules.ts의 pickLeaf).
   */
  leaves: { checked: string[]; slot: number; day: string; count: number };
  /** 탐정 온실. 푼 사건, 틀린 적 있는 사건, 오늘 푼 사건(rules.ts의 todaysCases). */
  cases: CaseLedger;
  /** 정원 공개. id는 처음 켤 때 한 번 만들고, 껐다 켜도 같은 링크를 쓴다. */
  share: { id: string | null; on: boolean };
  /** 도감 지도에서 원본을 읽고 씨앗을 받은 품종, 그리고 오늘 받은 수. */
  trails: { taken: string[]; day: string; count: number };
  /** 오늘(한국 날짜 번호) 물을 준 정원(공개 id)과, 받아서 쓴 물(방문자 uid). */
  waters: { day: number; given: string[]; received: string[] };
  /** 가진 도구(rules.ts의 TOOLS)와 오늘(한국 날짜) 산 수. */
  tools: { have: Partial<Record<ToolId, number>>; day: string; bought: Partial<Record<ToolId, number>> };
  /** 첫 한 바퀴 코치와 탭 첫 방문 팁(coach.ts). 기기를 옮겨도 다시 뜨지 않게 정원과 함께 간다. */
  coach: CoachData;
  /**
   * 이 정원을 마지막으로 맞춘 계정. 없으면 아직 어느 계정과도 맞춘 적 없는
   * 이 기기만의 정원이다. updatedAt만으로 고르면 새 기기에서 갓 만든 빈 정원이
   * "더 새것"이 되어 계정에 쌓인 정원을 덮는다 — 그래서 주인부터 본다.
   */
  owner?: string;
  updatedAt: number;
}

/** 계정과 맞춘 결과. local이면 이 기기의 정원을 계정에 올려야 한다. */
export type LinkResult = "remote" | "local";

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
    raids: [],
    leaves: { checked: [], slot: 0, day: "", count: 0 },
    cases: { solved: [], missed: [], day: "", today: [] },
    share: { id: null, on: false },
    waters: { day: 0, given: [], received: [] },
    trails: { taken: [], day: "", count: 0 },
    coach: initialCoach(),
    tools: { have: {}, day: "", bought: {} },
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
    raids: data.raids ?? [],
    leaves: data.leaves ?? { checked: [], slot: 0, day: "", count: 0 },
    cases: data.cases ?? { solved: [], missed: [], day: "", today: [] },
    share: data.share ?? { id: null, on: false },
    waters: data.waters ?? { day: 0, given: [], received: [] },
    trails: data.trails ?? { taken: [], day: "", count: 0 },
    coach: normalizeCoach(data.coach),
    tools: data.tools ?? { have: {}, day: "", bought: {} },
  };
}

/** 이 브라우저의 정원 사본을 지운다. MY의 "정원 처음부터 다시 시작"이 쓴다. 못 지우면 던진다. */
export function clearLocal(): void {
  localStorage.removeItem(STORAGE_KEY);
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
  /**
   * 계정의 정원(remote)과 맞춘다. 이 기기의 정원이 그 계정 것이고 더 새것일 때만
   * 이 기기 것을 남기고, 아니면 계정 것을 받는다. 계정에 정원이 없으면 이 기기
   * 것이 그 계정의 정원이 된다.
   */
  link: (uid: string, remote: GardenData | null) => LinkResult;
  plant: (bed: number, species: Species, plaza: PlazaLevel) => void;
  harvest: (bed: number, species: Species, plaza: PlazaLevel) => Fruit | null;
  dig: (bed: number) => void;
  shine: (fruitId: string) => boolean;
  sell: (fruitIds: string[], catalog: Map<string, Species>, bonus: number) => number;
  buy: (species: Species, slot: number, stock: number) => boolean;
  upgrade: () => boolean;
  weed: (stage: WeedStage, catalog: Species[]) => WeedReward;
  /** 시든 잎을 확인했다. 받은 잼(이미 확인한 잎이면 0). */
  leaf: (id: string, rewarded: boolean) => number;
  gift: (species: Species) => boolean;
  /** 온실 사건에서 답이 아닌 보기를 골랐다. 그 사건은 "처음에 맞힘"을 잃는다. */
  missCase: (caseId: string) => void;
  /**
   * 온실 사건을 풀었다. 그 정책의 씨앗과 잼, 셋째마다 온실 상자. 이미 푼 사건이면 null.
   */
  solveCase: (c: Case, catalog: Species[]) => { jam: number; seed?: Species; box?: Species; firstTry: boolean } | null;
  /** 오늘 상한 안에서 줄 수 있는 가꿈. 0이면 오늘은 다 줬다. */
  careRoom: (speciesId: string, delta: number) => number;
  /** 가꿈을 준 뒤 사본을 맞춘다. mine은 서버가 돌려준 내 합계(없으면 더한다). */
  recordCare: (speciesId: string, delta: number, mine?: number) => void;
  rename: (nick: string) => void;
  takeNectar: (speciesIds: string[]) => number;
  /** 거대 잡초의 희귀 씨앗 상자를 연다. 물결마다 한 번(key=raidKey). 이미 받았으면 null. */
  claimRaid: (key: number, seed: string, catalog: Species[]) => { species?: Species; jam: number } | null;
  /** 도구를 산다. 잼이 모자라거나 오늘 상한에 닿았으면 false. */
  buyTool: (id: ToolId) => boolean;
  /** 자라는 작물에 비료를 준다. 그 비료가 없거나, 익었거나, 이번 차례에 이미 줬으면 false. */
  feed: (bed: number, id: ToolId) => boolean;
  /**
   * 도감 지도에서 이어진 품종의 원본을 열었다. 처음이고 오늘 몫이 남았으면 씨앗을 준다.
   * 돌려주는 값: given=씨앗을 줬다, taken=이미 받은 품종, capped=오늘 몫을 다 썼다.
   */
  trail: (species: Species) => "given" | "taken" | "capped";
  /** 정원 공개를 켜고 끈다. 켤 때 공개 id가 없으면 만든다. */
  setShare: (on: boolean) => string | null;
  /** 오늘 이 정원에 물을 줄 수 있는가. 남은 횟수(0이면 못 준다). */
  waterRoom: (gid: string) => number;
  /** 물을 준 뒤 부른다. 내 텃밭도 함께 자란다. */
  gaveWater: (gid: string) => void;
  /** 받은 물을 쓴다. 오늘 처음 보는 방문자만, 하루 WATER_PER_DAY까지. 쓴 방문자를 돌려준다. */
  receiveWaters: <T extends { uid: string }>(visitors: T[]) => T[];
  /** 코치를 끈다(마쳤거나 건너뛰었다). */
  endCoach: () => void;
  /** 탭 첫 방문 팁을 닫았다. */
  seeTip: (tab: TipTab) => void;
}

function marked(coach: CoachData, mark: CoachMark): CoachData {
  return coach.marks.includes(mark) ? coach : { ...coach, marks: [...coach.marks, mark] };
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

    link: (owner, remote) => {
      const local = get().data;
      const usable = remote?.v === 1 ? remote : null;
      const keepLocal = !usable || (local?.owner === owner && local.updatedAt >= usable.updatedAt);
      const base = keepLocal || !usable ? local : normalize(usable);
      if (!base) return "local";
      // 주인 표시는 내용이 바뀐 것이 아니므로 updatedAt을 건드리지 않는다.
      const data = { ...base, owner };
      writeLocal(data);
      set({ data });
      return keepLocal ? "local" : "remote";
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
      commit({
        ...d,
        jam: d.jam + jam,
        basket: d.basket.filter((f) => !ids.has(f.id)),
        coach: jam > 0 ? marked(d.coach, "sold") : d.coach,
      });
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
        coach: marked(d.coach, "bought"),
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

    leaf: (id, rewarded) => {
      const d = get().data;
      if (!d || d.leaves.checked.includes(id)) return 0;
      const now = Date.now();
      const today = kstDay(now);
      const count = d.leaves.day === today ? d.leaves.count : 0;
      const jam = rewarded ? LEAF_JAM : 0;
      commit({
        ...d,
        jam: d.jam + jam,
        leaves: { checked: [...d.leaves.checked, id], slot: leafSlot(now), day: today, count: count + 1 },
      });
      return jam;
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

    trail: (species) => {
      const d = get().data;
      if (!d) return "capped";
      if (d.trails.taken.includes(species.id)) return "taken";
      const today = kstDay(Date.now());
      const count = d.trails.day === today ? d.trails.count : 0;
      if (count >= TRAIL_PER_DAY) return "capped";
      commit({
        ...d,
        seeds: give(d.seeds, species.id),
        trails: { taken: [...d.trails.taken, species.id], day: today, count: count + 1 },
      });
      return "given";
    },

    setShare: (on) => {
      const d = get().data;
      if (!d) return null;
      const id = d.share.id ?? (on ? newPublicId() : null);
      commit({ ...d, share: { id, on } });
      return id;
    },

    waterRoom: (gid) => {
      const d = get().data;
      if (!d) return 0;
      const w = d.waters.day === kstDayNumber(Date.now()) ? d.waters : { day: 0, given: [], received: [] };
      if (w.given.includes(gid) || gid === d.share.id) return 0;
      return Math.max(0, WATER_PER_DAY - w.given.length);
    },

    gaveWater: (gid) => {
      const d = get().data;
      if (!d) return;
      const today = kstDayNumber(Date.now());
      const w = d.waters.day === today ? d.waters : { day: today, given: [], received: [] };
      if (w.given.includes(gid)) return;
      commit({ ...d, beds: waterBeds(d.beds, Date.now()), waters: { ...w, given: [...w.given, gid] } });
    },

    receiveWaters: (visitors) => {
      const d = get().data;
      if (!d) return [];
      const today = kstDayNumber(Date.now());
      const w = d.waters.day === today ? d.waters : { day: today, given: [], received: [] };
      const fresh = visitors
        .filter((v) => !w.received.includes(v.uid))
        .slice(0, Math.max(0, WATER_PER_DAY - w.received.length));
      if (fresh.length === 0) return [];
      let beds = d.beds;
      for (let i = 0; i < fresh.length; i++) beds = waterBeds(beds, Date.now());
      commit({ ...d, beds, waters: { ...w, received: [...w.received, ...fresh.map((v) => v.uid)] } });
      return fresh;
    },

    claimRaid: (key, seed, catalog) => {
      const d = get().data;
      if (!d || d.raids.includes(key)) return null;
      const species = openRaidBox(seed, catalog);
      commit({
        ...d,
        jam: d.jam + RAID_BOX.jam,
        seeds: species ? give(d.seeds, species.id) : d.seeds,
        // 오래된 날은 버린다. 문서가 끝없이 커지지 않게.
        raids: [...d.raids, key].slice(-60),
      });
      return { species, jam: RAID_BOX.jam };
    },

    buyTool: (id) => {
      const d = get().data;
      if (!d) return false;
      const tool = TOOLS[id];
      const today = kstDay(Date.now());
      const bought = d.tools.day === today ? d.tools.bought : {};
      if ((bought[id] ?? 0) >= tool.perDay || d.jam < tool.price) return false;
      commit({
        ...d,
        jam: d.jam - tool.price,
        tools: {
          have: { ...d.tools.have, [id]: (d.tools.have[id] ?? 0) + 1 },
          day: today,
          bought: { ...bought, [id]: (bought[id] ?? 0) + 1 },
        },
      });
      return true;
    },

    feed: (bed, id) => {
      const d = get().data;
      const plant = d?.beds[bed];
      if (!d || !plant || !(d.tools.have[id] ?? 0)) return false;
      const fed = fertilize(plant, Date.now(), id);
      if (!fed) return false;
      const beds = [...d.beds];
      beds[bed] = fed;
      const left = (d.tools.have[id] ?? 0) - 1;
      // 다 쓴 도구는 키를 지운다. 0이 끝없이 쌓이지 않게.
      const have: GardenData["tools"]["have"] = { ...d.tools.have, [id]: left };
      if (left <= 0) delete have[id];
      commit({ ...d, beds, tools: { ...d.tools, have } });
      return true;
    },

    missCase: (caseId) => {
      const d = get().data;
      if (!d || d.cases.missed.includes(caseId) || d.cases.solved.includes(caseId)) return;
      commit({ ...d, cases: { ...d.cases, missed: [...d.cases.missed, caseId] } });
    },

    solveCase: (c, catalog) => {
      const d = get().data;
      if (!d || d.cases.solved.includes(c.id)) return null;
      const firstTry = !d.cases.missed.includes(c.id);
      const n = d.cases.solved.length + 1;
      const reward = caseReward(firstTry, n);
      const seed = catalog.find((s) => s.id === c.speciesId);
      const box = reward.box ? openCaseBox(c.id, catalog) : undefined;
      let seeds = seed ? give(d.seeds, seed.id) : d.seeds;
      if (box) seeds = give(seeds, box.id);
      const today = kstDay(Date.now());
      commit({
        ...d,
        jam: d.jam + reward.jam,
        seeds,
        cases: {
          solved: [...d.cases.solved, c.id],
          missed: d.cases.missed.filter((id) => id !== c.id),
          day: today,
          today: [...(d.cases.day === today ? d.cases.today : []), c.id],
        },
      });
      return { jam: reward.jam, seed, box, firstTry };
    },

    gift: (species) => {
      const d = get().data;
      if (!d || d.gifts.includes(species.id)) return false;
      commit({ ...d, seeds: give(d.seeds, species.id), gifts: [...d.gifts, species.id] });
      return true;
    },

    endCoach: () => {
      const d = get().data;
      if (!d || d.coach.off) return;
      commit({ ...d, coach: { ...d.coach, off: true } });
    },

    seeTip: (tab) => {
      const d = get().data;
      if (!d || d.coach.tips.includes(tab)) return;
      commit({ ...d, coach: { ...d.coach, tips: [...d.coach.tips, tab] } });
    },
  };
});
