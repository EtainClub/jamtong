"use client";

import { pianoNotes, pianoSong, type PianoEvent } from "./room/piano";

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
  newInviteCode,
  openInviteBox,
  invitePending,
  canAcceptInvite,
  TRAIL_PER_DAY,
  openRaidBox,
  RAID_BOX,
  RAID_KINDS,
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
  WEED_QUIZ_ODDS,
  WEED_QUIZ_PER_DAY,
  WEED_REWARD_PER_DAY,
  WEED_SEED_ODDS,
  withRainbow,
  fertilize,
  MUTATION,
  TOOLS,
  FINISHERS,
  type FinisherId,
  type ToolId,
  fruitValue,
  FIRST_HARVEST_GIFT,
  jarFirstSeed,
  jarMutations,
  jarRegion,
  rotationOf,
  type PlotRecord,
  LEAF_JAM,
  leafSlot,
  caseReward,
  openCaseBox,
  type CaseLedger,
  type RaidKindId,
  type WeedStage,
} from "./rules";
import {
  addSample,
  freshKit,
  freshLoot,
  KIT,
  LEDGER_KEEP,
  normalizeKit,
  normalizeLoot,
  RAID_JAM,
  TROPHY_WALLPAPER,
  trimLedger,
  trophyId,
  type KitId,
  type KitLedger,
  type LootLedger,
  type RaidLoot,
} from "./raid/rules";
import {
  BOOK_ASK_JAM,
  bookIdOf,
  bookSeed,
  cleanMarks,
  freshLibrary,
  lendClaim,
  normalizeLibrary,
  roomBookOf,
  seedReady,
  type LibraryLedger,
} from "./room/library";
import { initialCoach, normalizeCoach, type CoachData, type CoachMark, type TipTab } from "./coach";
import * as room from "./room/rules";
import { avatarAtOk, avatarFree, buyWear as buyWearRule, grantRewards, normalizeAvatar, unownedWear, type AvatarData, type WearRefusal } from "./avatar/rules";
import { freshIlchon, newsEntry, normalizeIlchon, NEWS_MAX, pushNews, WATER_CUT_ILCHON, type IlchonData, type NewsEntry } from "./ilchon/rules";
import { MOODS, type Furniture } from "./room/catalog";
import { pickGift } from "./memorial/ox";
import * as slot from "./slot/rules";
import { parseRareKey, RARE_BY_ID, rareKey } from "./slot/rare";
import { todaysRoomTable } from "./slot/roomPool";
import { buyYardItem, normalizeYard, setYardSlot as setYardSlotRule, type YardData, type YardRefusal } from "./yard";
import * as album from "./album/rules";
import { normalizeKeys, type RoomKey } from "./room/keyboard";
import type { GardenTrackId } from "./musicTracks";
import { canUseTrack, ownedMusic, purchasedTrack } from "./musicTracks";
import { lineProblem, type LineProblem } from "./ilchon/text";
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
  /**
   * 잡초 O/X 퀴즈 장부(rules.ts의 WEED_QUIZ_*) — 오늘(day) 뜬 수(n)와, 떠 있는데 아직 답하지 않은 퀴즈가 있는지(open).
   * open일 때 한 번만 선물을 받는다. 옛 장부에는 없다.
   */
  weedQuiz?: { day: string; n: number; open: boolean };
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
  /**
   * 놀러 간 적 있는 공개 정원(최근 것부터, FRIENDS_MAX까지). 이웃 탭의 "친구 정원 비교"가 이 목록만 읽는다 —
   * 모두에게 공개된 순위가 아니라 내가 가 본 정원끼리 나란히 보는 것이다. nick은 목록에 그릴 이름의 사본.
   */
  friends: Array<{ id: string; nick: string; at: number }>;
  /** 오늘(한국 날짜 번호) 물을 준 정원(공개 id)과, 받아서 쓴 물(방문자 uid). */
  waters: { day: number; given: string[]; received: string[] };
  /** 가진 도구(rules.ts의 TOOLS)와 오늘(한국 날짜) 산 수. */
  tools: { have: Partial<Record<ToolId, number>>; day: string; bought: Partial<Record<ToolId, number>> };
  /** 가진 거대 잡초 필살기(rules.ts의 FINISHERS)와 오늘(한국 날짜) 산 수. */
  finishers: { have: Partial<Record<FinisherId, number>>; day: string; bought: Partial<Record<FinisherId, number>> };
  /** 거대 잡초 싸움 도구(raid/rules.ts의 KIT) — 가진 것, 오늘 산 수, 켜 둔 물결. */
  kit: KitLedger;
  /**
   * 뿌리 조각 — 거대 잡초에서만 나오는 두 번째 재화(docs/garden-miniroom.md §7.4). 🏆 전리품만 산다.
   * 잼으로 바꾸지 못하고 남에게 주지 못한다. 개인 장부라 손으로 고치면 혼자의 문제다(본문서 §3.12).
   */
  roots: number;
  /** 거대 잡초 보상 장부 — 도망간 물결의 조각, 표본, 고른 필살기 연출(raid/rules.ts). */
  loot: LootLedger;
  /** 특별한 책 장부 — 완독 도장, 책 씨앗, 오늘 물은 수, 빌려 읽기로 받은 잼(room/library.ts). */
  library: LibraryLedger;
  /** 첫 한 바퀴 코치와 탭 첫 방문 팁(coach.ts). 기기를 옮겨도 다시 뜨지 않게 정원과 함께 간다. */
  coach: CoachData;
  /**
   * 초대 씨앗(rules.ts). code=내 초대 코드(처음 보낼 때 만든다), registered=서버에 등록했다,
   * by=나를 초대한 코드, done=초대받은 몫을 끝냈다(받았거나 받을 수 없었다),
   * claimed=초대한 친구 몫으로 받은 상자 수.
   */
  invite: { code: string | null; registered: boolean; by: string | null; done: boolean; claimed: number };
  /** 내 방(docs/garden-miniroom.md §4). 규칙과 모양은 room/rules.ts. */
  room: room.RoomData;
  /** 1촌(docs/garden-miniroom.md §5). 설정과 사본. 모양은 ilchon/rules.ts. */
  ilchon: IlchonData;
  /** 1촌 소식 — 공개 문서에 싣는 종류 번호(ilchon/rules.ts의 NewsEntry). 최근 것부터. */
  news: NewsEntry[];
  /**
   * 돌려짓기(docs/garden-farm-v2.md §4) — 칸마다 마지막으로 거둔 품종과 분야. 칸 순번 = beds 순번. 옛 장부에는 없다.
   */
  plotLog?: Array<PlotRecord | null>;
  /** 잼 공방에서 병을 만든 분야(처음 만든 분야 병에만 씨앗 선물). 옛 장부에는 없다. */
  jars?: string[];
  /** 슬롯머신 장부 — 오늘 돌린 수와 천장(slot/rules.ts). 옛 장부에는 없다. */
  slots?: slot.SlotLedger;
  /** 희귀 씨앗 주머니 — `희귀 씨앗 id|품종 id` → 개수(slot/rare.ts). 옛 장부에는 없다. */
  rareSeeds?: Record<string, number>;
  /** 심어 거둔 희귀 씨앗 종류 — 칭호 💎 희귀종 수집가, 여섯이면 방 소품 "희귀 씨앗 유리병". 옛 장부에는 없다. */
  rareDex?: string[];
  /** 마당 꾸미기(yard.ts, docs/garden-farm-v2.md §6 4b) — 가진 소품과 자리마다 놓인 것. 옛 장부에는 없다. */
  yard?: YardData;
  /**
   * 사진첩 2(docs/garden-album-review.md) — 담은 사진·내 정원의 순간·퍼가기 보상 장부(album/rules.ts).
   * 옛 장부의 room.album(업적 품종 id 목록)은 정원을 열 때 이리로 옮긴다.
   */
  album?: album.AlbumLedger;
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

/** 친구 목록에 남길 정원 수. 비교 화면이 정원마다 문서 하나를 읽는다. */
export const FRIENDS_MAX = 30;

/**
 * 바구니 상한. 넘으면 가장 오래된 열매부터 빠진다(firestore.rules도 120까지 받는다).
 * 빠지기 전에 화면이 알린다 — nav.ts의 BASKET_WARN_AT, Beds.tsx.
 */
export const BASKET_MAX = 120;

/** 새 정원의 첫 새싹이 익는 데 걸리는 시간. 첫 수확을 첫 세션 안에(docs/garden-miniroom.md §8의 1). */
const STARTER_RIPE = 60_000;

const NO_INVITE: GardenData["invite"] = { code: null, registered: false, by: null, done: false, claimed: 0 };

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
  // 곧 익는 새싹 한 포기를 심어 둔다. 코치의 첫 걸음이 심기가 아니라 거두기가 된다(coach.ts).
  const beds: Array<Plant | null> = Array(START_PLOTS).fill(null);
  const starter = sprouts.length ? sprouts[Math.floor(roll() * sprouts.length)] : undefined;
  const now = Date.now();
  if (starter) {
    beds[0] = { id: uid(), speciesId: starter.id, plantedAt: now, ripeAt: now + STARTER_RIPE, speed: 1, harvests: 0 };
  }
  return {
    v: 1,
    jam: START_JAM,
    beds,
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
    nick: (typeof window !== "undefined" && readPendingNick()) || defaultNick(String(Date.now()) + Math.random()),
    nectar: { day: "", taken: [] },
    raids: [],
    leaves: { checked: [], slot: 0, day: "", count: 0 },
    cases: { solved: [], missed: [], day: "", today: [] },
    share: { id: null, on: false },
    waters: { day: 0, given: [], received: [] },
    trails: { taken: [], day: "", count: 0 },
    coach: initialCoach(),
    tools: { have: {}, day: "", bought: {} },
    finishers: { have: {}, day: "", bought: {} },
    kit: freshKit(),
    roots: 0,
    loot: freshLoot(),
    library: freshLibrary(),
    invite: NO_INVITE,
    friends: [],
    // 새 정원마다 다른 기본 꼬마(docs/garden-avatar.md §6.1). 장부에 저장되어 기기를 바꿔도 같다.
    room: room.freshRoom(String(Date.now()) + Math.random()),
    ilchon: freshIlchon(),
    news: [],
    album: album.freshAlbum(),
    updatedAt: Date.now(),
  };
}

/** 꽃밭이 생기기 전에 저장된 정원에 빈 칸을 채운다. */
/** 기념품이 있는데 진열장이 방에 없으면 한 번 저절로 놓는다(꽉 찼으면 물건 하나를 보관함에 — room/rules.ts의 autoPlaceCase). */
function withCase(r: room.RoomData): room.RoomData {
  return room.autoPlaceCase(r)?.room ?? r;
}

/** 사진첩 2로 옮긴 뒤 방 장부의 옛 사진첩을 뺀다. 공개 방에도 더는 싣지 않는다(손님은 photos를 읽는다). */
function withoutOldAlbum(r: room.RoomData): room.RoomData {
  if (r.album === undefined) return r;
  const { album: _moved, ...rest } = r;
  void _moved;
  return rest;
}

/** 내 정원의 순간을 사진첩 후보로 기억한다. */
function withMoment(d: GardenData, m: album.Moment): GardenData {
  const a = d.album ?? album.freshAlbum();
  return { ...d, album: { ...a, moments: album.pushMoment(a.moments, m) } };
}

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
    finishers: data.finishers ?? { have: {}, day: "", bought: {} },
    kit: normalizeKit(data.kit),
    roots: Number.isFinite(data.roots) ? Math.max(0, data.roots) : 0,
    loot: normalizeLoot(data.loot),
    library: normalizeLibrary(data.library),
    invite: data.invite ?? NO_INVITE,
    friends: data.friends ?? [],
    // 꼬마가 없는 옛 장부는 정원 이름으로 기본 꼬마를 정한다 — 저장되기 전에 다시 열어도 같은 꼬마.
    // 서재 세트는 가진 책 수에서 정해진다 — 이 기능이 생기기 전에 산 책에도 준다.
    room: withoutOldAlbum(withCase(room.grantSouvenirCase(room.grantLibrarySets(room.normalizeRoom(data.room, data.nick || String(data.updatedAt)))))),
    // 옛 사진첩(room.album)은 사진 장부로 옮긴다 — 옮긴 뒤에는 방 장부에서 뺀다(withoutOldAlbum).
    album: album.normalizeAlbum(data.album, data.room?.album),
    ilchon: normalizeIlchon(data.ilchon),
    news: Array.isArray(data.news) ? data.news.slice(0, NEWS_MAX) : [],
    plotLog: Array.isArray(data.plotLog)
      ? data.plotLog.map((x) => (x && typeof x.s === "string" && typeof x.r === "string" ? { s: x.s, r: x.r } : null))
      : [],
    jars: Array.isArray(data.jars) ? data.jars.filter((r): r is string => typeof r === "string") : [],
    slots: slot.normalizeSlots(data.slots),
    rareDex: Array.isArray(data.rareDex) ? data.rareDex.filter((k) => RARE_BY_ID.has(k)) : [],
    rareSeeds: Object.fromEntries(
      Object.entries(data.rareSeeds ?? {}).filter(([k, n]) => parseRareKey(k) && typeof n === "number" && n > 0),
    ),
    yard: normalizeYard(data.yard),
  };
}

/**
 * MY에서 정원 이름을 바꾼다. 정원 이름은 남에게 보이는 유일한 이름이라(꽃밭 명패, 공개 정원)
 * MY의 닉네임도 이것이다.
 *
 * MY는 정원 화면 밖이라 store를 띄우지 않는다. MY가 고른 정원(이 계정 것이고 더 새것)에
 * 이름만 바꾸고 updatedAt을 올려 이 브라우저에 쓴다 — 정원의 link가 이 사본을 "더 새것"으로
 * 고른다. 계정 쪽은 부르는 쪽이 saveGarden으로 쓴다. 이름이 비면 null.
 */
export function renameStoredGarden(garden: GardenData, uid: string | null, nick: string): GardenData | null {
  const clean = cleanNick(nick);
  if (!clean) return null;
  const next: GardenData = { ...garden, nick: clean, owner: uid ?? garden.owner, updatedAt: Date.now() };
  writeLocal(next);
  return next;
}

export function cleanNick(nick: string): string {
  return nick.replace(/\s+/g, " ").trim().slice(0, NICK_MAX);
}

/**
 * 정원을 시작하기 전에 MY에서 정한 이름. 정원을 처음 만들 때(fresh) 지어 준 이름 대신 쓴다.
 * 계정에 이미 정원이 있으면 그 정원의 이름이 이긴다 — MY는 그때 정원 이름을 직접 고친다.
 */
const PENDING_NICK_KEY = "jamtong-garden-nick";

export function readPendingNick(): string | null {
  try {
    return localStorage.getItem(PENDING_NICK_KEY);
  } catch {
    return null;
  }
}

export function writePendingNick(nick: string): string | null {
  const clean = cleanNick(nick);
  if (!clean) return null;
  try {
    localStorage.setItem(PENDING_NICK_KEY, clean);
  } catch {
    return null;
  }
  return clean;
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
  /** 거둔 열매. gift = 처음 거둬서 받은 방 소품(가구 id, docs/garden-farm-v2.md §3) — 방에 놓였으면 placed. */
  harvest: (
    bed: number,
    species: Species,
    plaza: PlazaLevel,
  ) => (Fruit & { gift?: { id: string; placed: boolean }; rare?: { kind: string; done: boolean } }) | null;
  /**
   * 잼 공방 — 같은 분야의 서로 다른 품종 열매 셋으로 분야 잼 병을 만든다(docs/garden-farm-v2.md §5).
   * 병은 전시품이 되어 방에(빈자리가 있으면) 놓인다. 처음 만든 분야면 대표 씨앗 하나(seed). 못 만들면 null.
   */
  makeJar: (fruitIds: string[], catalog: Map<string, Species>) => { region: string; placed: boolean; seed: Species | null } | null;
  /** 마당 소품을 잼으로 산다(yard.ts). 사면 true, 못 사면 그 까닭. */
  buyYard: (id: string) => true | YardRefusal;
  /** 마당 자리에 소품을 놓거나(id) 치운다(null). */
  setYardSlot: (slot: number, id: string | null) => boolean;
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
  /**
   * 쓰러뜨린 거대 잡초의 보상을 받는다 — 상자·뿌리 조각·그 종류의 표본. 물결마다 한 번(key=raidKey).
   * 이미 받았으면 null. 표본이 셋이 되면 박제가, 여섯 박제가 모이면 벽지가 생긴다.
   */
  claimRaid: (
    key: number,
    seed: string,
    catalog: Species[],
    loot: RaidLoot,
    kind: RaidKindId,
  ) => { species?: Species; jam: number; roots: number; trophy: RaidKindId | null; wallpaper: boolean } | null;
  /** 도망간 거대 잡초에서 친 사람의 뿌리 조각. 물결마다 한 번. 이미 받았으면 null. */
  claimEscape: (key: number, roots: number) => number | null;
  /** 특별한 책 — 이 장에 완독 도장을 찍는다. 새로 찍었으면 true. */
  markChapterRead: (slug: string, chapter: string) => boolean;
  /** 특별한 책 — 독서대에 펼쳐 둘 문장(쉽게 보기 토막 id, 셋까지). */
  setBookMarks: (slug: string, ids: string[]) => void;
  /** 특별한 책 — 놓아 둔 책의 오늘 씨앗을 받는다. 받을 수 없으면 null. */
  claimBookSeed: (slug: string, catalog: Species[], who: string) => Species | null;
  /** 특별한 책 — 책에게 물은 값(잼 BOOK_ASK_JAM)을 치르고 오늘 수를 적는다. 서버가 답한 뒤에 부른다. */
  payBookAsk: (slug: string) => boolean;
  /** 특별한 책 — 오늘 빌려 읽은 손님(uid)에게서 잼을 받는다. 받은 잼(없으면 0). */
  claimLends: (readers: string[]) => number;
  /** 이 물결의 이 형태에 들었다고 적는다(형태 보상의 조건). 이미 적혀 있으면 아무것도 하지 않는다. */
  markRaidPart: (key: number, form: number) => void;
  /** 거대 잡초 잼 보상을 받는다(raid/rules.ts의 RAID_JAM). 받은 잼 합(받을 게 없으면 0). */
  claimRaidJam: (key: number, ids: number[]) => number;
  /** 싸움 도구를 산다. 잼이 모자라거나 오늘 상한에 닿았으면 false. */
  buyKit: (id: KitId) => boolean;
  /** 싸움 도구 하나를 이 물결에 켠다. 없거나 이미 켰으면 false. */
  armKit: (id: KitId, raid: string) => boolean;
  /** 반격에 맞는 순간 가죽 장갑 하나를 쓴다. 없으면 false(묶인다). */
  useGlove: () => boolean;
  /** 🏆 전리품을 뿌리 조각으로 산다. */
  buyTrophy: (id: string) => true | room.BuyRefusal;
  /** 필살기 연출을 고른다(가진 것만). null이면 기본. */
  setFx: (id: string | null) => void;
  /** 도구를 산다. 잼이 모자라거나 오늘 상한에 닿았으면 false. */
  buyTool: (id: ToolId) => boolean;
  /**
   * 텃밭 씨앗 슬롯을 한 번 돌린다(slot/rules.ts). 잼이 모자라거나 오늘 다 돌렸으면 그 까닭.
   * 받은 것은 바로 주머니에 들어간다 — 화면은 돌려준 결과를 릴로 보일 뿐이다.
   */
  spinSeedSlot: (
    catalog: Species[],
    rand?: () => number,
    /** paid=잼을 낸다, free=퀴즈 찬스로 받은 무료 한 번, guest=남의 방 뽑기 기계(그 방의 공개 id) — 하루 한 번 무료. */
    mode?: "paid" | "free" | { guest: string },
  ) => { spin: slot.SeedSpin; got: Array<{ species: Species; rare?: string }>; paid: number } | "jam" | "done" | "no-free" | "guest-done";
  /** 미니룸 아이템 슬롯을 한 번 돌린다. 진열이 비었으면 "empty". */
  spinRoomSlot: (rand?: () => number, mode?: "paid" | "free") => { spin: slot.RoomSpin; table: slot.RoomRow[]; paid: number } | "jam" | "done" | "empty" | "no-free";
  /** 퀴즈 찬스를 하나 쓴다(문항을 여는 순간). 오늘 다 썼으면 false. */
  takeSlotChance: () => boolean;
  /** 퀴즈 찬스 문항을 맞혔다 — 그 슬롯의 무료 한 번. */
  winSlotChance: (machine: "seed" | "room") => void;
  /** 잼 항아리 몫을 받는다(물결마다 한 번). 받았으면 true. */
  claimPot: (key: number, jam: number) => boolean;
  /** 내 뽑기 기계를 돌려 본 손님(uid)에게서 주인 몫 잼을 받는다. 받은 잼과 처음 본 손님 수. */
  claimGachaHost: (visitors: string[]) => { jam: number; count: number } | null;
  /** 희귀 씨앗을 심는다(주머니 열쇠 key = `희귀 씨앗|품종`). */
  plantRare: (bed: number, key: string, species: Species, plaza: PlazaLevel) => void;
  /** 필살기를 산다. 잼이 모자라거나 오늘 상한에 닿았으면 false. */
  buyFinisher: (id: FinisherId) => boolean;
  /** 필살기 하나를 꺼낸다(쓰기 직전). 없으면 false. 보내지 못했으면 refundFinisher로 되돌린다. */
  spendFinisher: (id: FinisherId) => boolean;
  refundFinisher: (id: FinisherId) => void;
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
  /** 물을 준 뒤 부른다. 내 텃밭도 함께 자란다. ilchon이면 1촌에게 준 물이라 더 줄인다. */
  gaveWater: (gid: string, ilchon?: boolean) => void;
  /** 남의 공개 정원에 놀러 갔다. 친구 목록 맨 앞에 둔다. */
  metFriend: (gid: string, nick: string) => void;
  /** 친구 목록에서 뺀다(공개를 껐거나 더 보고 싶지 않다). */
  forgetFriend: (gid: string) => void;
  /** 받은 물을 쓴다. 오늘 처음 보는 방문자만, 하루 WATER_PER_DAY까지. 쓴 방문자를 돌려준다. il이면 1촌의 물. */
  receiveWaters: <T extends { uid: string; il?: boolean }>(visitors: T[]) => T[];
  /** 공개 id를 새로 만든다. 이 id의 공개 문서가 다른 계정 것일 때(share.ts). */
  renewShareId: () => void;
  /** 1촌 칸을 고친다(설정·1촌 사본·보낸 신청·차단). */
  updateIlchon: (fn: (il: IlchonData) => IlchonData) => void;
  /** 코치를 끈다(마쳤거나 건너뛰었다). */
  endCoach: () => void;
  /** 탭 첫 방문 팁을 닫았다. */
  seeTip: (tab: TipTab) => void;
  /** 내 초대 코드. 없으면 만든다. */
  inviteCode: () => string | null;
  /** 내 초대 코드를 서버에 등록했다. */
  inviteRegistered: () => void;
  /** 초대 링크로 왔다. 새 정원일 때만 받아들인다(rules.ts의 canAcceptInvite). */
  acceptInvite: (code: string) => boolean;
  /** 초대받은 몫을 끝낸다. reward면 상자를 연다(key가 같으면 같은 씨앗). */
  finishInvite: (reward: { key: string; catalog: Species[] } | null) => Species | undefined | null;
  /** 첫 열매를 거둔 친구 수를 보고, 아직 받지 않은 상자를 연다(평생 INVITE_CAP까지). */
  claimInvites: (joined: number, catalog: Species[]) => Array<Species | undefined>;
  /** 가구·벽지를 산다. 샀으면 true, 못 샀으면 그 까닭. */
  buyFurniture: (id: string) => true | room.BuyRefusal;
  /** 방을 넓힌다. 잼이 모자라거나 다 넓혔으면 false. */
  upgradeRoom: () => boolean;
  setMood: (id: string) => void;
  /** 방 음악. 공개 방에 실려 손님도 이 곡을 듣는다. */
  setBgm: (id: GardenTrackId) => void;
  buyMusic: (id: string) => true | "unknown" | "owned" | "jam";
  /** 방 한마디. 걸러낼 것이 있으면 그 까닭을 돌려주고 바꾸지 않는다. 빈 글은 한마디를 지운다. */
  setMotto: (text: string) => LineProblem | null;
  /** 내 키보드의 키 하나를 바꾼다(그림·소리·녹음 판). 모양이 어긋난 값은 room/keyboard.ts가 바로잡는다. */
  setKey: (slot: number, key: RoomKey, keyboard?: number) => void;
  /** 놓인 피아노 하나의 건반 음 여덟 개를 저장한다. */
  setPianoNotes: (id: number, notes: number[]) => void;
  /** 완성한 15초 연주를 해당 피아노에 저장한다. */
  savePianoSong: (id: number, song: PianoEvent[]) => boolean;
  /** 키 넷을 통째로 바꾼다(처음으로 되돌리기, 녹음을 지운 뒤). */
  setKeys: (keys: RoomKey[], keyboard?: number) => void;
  /** 가진 벽지·바닥재를 바른다. */
  applySurface: (id: string) => boolean;
  /** 꼬마를 저장한다(docs/garden-avatar.md). 가지지 않은 옷을 입었거나 칸이 방 밖이면 false. */
  saveAvatar: (next: AvatarData) => boolean;
  /** 꼬마 옷을 잼·뿌리 조각으로 산다. */
  buyWear: (id: string) => true | WearRefusal;
  /** 조건을 채운 받는 옷(칭호·황금·박제)을 옷장에 넣는다. 새로 넣은 id. */
  claimWear: (levels: Partial<Record<"dex" | "storm" | "plaza", number>>) => string[];
  /** 꾸미기를 마쳤다. 초안이 맞지 않으면(room/rules.ts의 validRoom) 받지 않고 false. */
  saveRoom: (draft: room.RoomData) => boolean;
  /** 바구니의 열매를 방에 전시한다(열매는 사라진다). 놓인 칸(빈 칸이 없으면 null)과 전시품. */
  showFruit: (fruitId: string, catalog: Map<string, Species>) => { shown: room.Shown; at: string | null } | null;
  /** 쪽지를 액자에 건다. 빈 액자틀이 없으면 잼으로 하나 사서. */
  frameNote: (noteId: string, speciesId: string) => { at: string | null; bought: boolean } | null;
  /**
   * 잡초를 뽑은 뒤 O/X 퀴즈를 띄울지 굴린다(확률 WEED_QUIZ_ODDS, 하루 WEED_QUIZ_PER_DAY번). 띄우면 true — 장부에 적는다.
   */
  rollWeedQuiz: () => boolean;
  /** 띄운 퀴즈에 답했다. 맞혔으면 상점 가구 하나를 선물로(가구 표의 것, 같은 확률). 받은 가구, 아니면 null. */
  settleWeedQuiz: (correct: boolean) => Furniture | null;
  /**
   * 업적 기념관 — 문제를 맞힌 업적의 기념품을 방에 들인다(docs/garden-achievement-strategy.md §3).
   * 잼으로 사지 않는다. 업적 품종이 품종표에 있고 아직 받지 않았을 때만. 놓인 칸(빈 칸이 없으면 null) 또는 받지 못하면 false.
   */
  earnSouvenir: (speciesId: string, catalog: Map<string, Species>) => { where: "case" | "stowed"; moved: string | null } | false;
  /** 진열장을 놓느라 보관함에 넣은 물건의 알림을 읽었다. */
  clearCaseMoved: () => void;
  /** 옛 칸 방을 아이소 방으로 옮겼다는 알림을 봤다(room/rules.ts의 isoMoved). */
  clearIsoMoved: () => void;
  /** 사진첩에 거둔 업적 하나를 올린다. 거둔 적 없는 업적·가득 찬 사진첩·이미 올린 것은 받지 않는다(이유를 돌려준다). */
  /**
   * 사진첩에 담는다(docs/garden-album-review.md). 업적·카툰 칸은 거둔 업적만, 언행·정책·책은 조건 없이.
   * 담았으면 그 사진, 못 담았으면 까닭.
   */
  clipPhoto: (input: album.PhotoInput, catalog: Map<string, Species>) => album.Photo | album.AddRefusal | "unharvested" | "unknown";
  /** 사진의 내 몫(문구·스티커·폴더·한 줄·대표·댓글 받기)을 고친다. 한 줄에 걸러낼 것이 있으면 그 까닭. */
  editPhoto: (id: string, patch: album.PhotoPatch) => true | LineProblem | "missing";
  removePhoto: (id: string) => void;
  /** 받은 퍼감에서 잼을 받는다(한 번에 20, 하루 100). 새 퍼감이 없으면 null. */
  claimScraps: (scraps: ReadonlyArray<{ at: number }>) => { jam: number; count: number } | null;
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
      // 돌려짓기 — 이 칸에서 마지막으로 거둔 것과 견준다.
      const rot = rotationOf(d.plotLog?.[bed], species);
      beds[bed] = {
        id: uid(),
        speciesId: species.id,
        plantedAt: now,
        ripeAt: ripeTime(now, growMinutes(species), speed),
        speed,
        harvests: 0,
        ...(rot ? { rot } : {}),
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
        ...(plant.rot ? { rot: plant.rot } : {}),
      };
      // 이 칸의 기록 — 다음에 심을 때 돌려짓기를 본다.
      const plotLog = [...(d.plotLog ?? [])];
      while (plotLog.length < d.beds.length) plotLog.push(null);
      plotLog[bed] = { s: species.id, r: species.region };
      // 첫 수확 선물 — 도감이 비어 있으면(처음 거두는 그 한 번) 방 소품을 주고 방에 놓는다.
      let roomNext = d.room;
      let gift: { id: string; placed: boolean } | undefined;
      if (Object.keys(d.dex).length === 0) {
        const given = room.giftItem(d.room, FIRST_HARVEST_GIFT);
        if (given) {
          const pos = room.firstOpenSpot(given, FIRST_HARVEST_GIFT);
          const placed = pos ? room.place(given, FIRST_HARVEST_GIFT, pos) : null;
          roomNext = placed ?? given;
          gift = { id: FIRST_HARVEST_GIFT, placed: Boolean(placed) };
        }
      }

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
      let next: GardenData = {
        ...d,
        beds,
        plotLog,
        room: roomNext,
        basket: [fruit, ...d.basket].slice(0, BASKET_MAX),
        dex: { ...d.dex, [species.id]: [...seen] },
        // 처음 거둔 품종은 1촌 소식이 된다.
        news: d.dex[species.id] ? d.news : pushNews(d.news, newsEntry("species", species.id, now)),
        notes: fruit.noteId && !d.notes.includes(fruit.noteId) ? [...d.notes, fruit.noteId] : d.notes,
      };
      // 내 정원의 순간 — 사진첩에 담을 수 있게 기억해 둔다(album/rules.ts).
      if (!d.dex[species.id]) next = withMoment(next, { t: "species", s: species.id, v: Object.keys(next.dex).length, at: now });
      for (const m of ["golden", "rainbow"] as const) if (fruit.mutations.includes(m)) next = withMoment(next, { t: m, s: species.id, at: now });
      // 희귀 씨앗 컬렉션(slot/rules.ts) — 처음 거둔 종류를 적고, 여섯을 다 모으면 방 소품 "희귀 씨앗 유리병".
      let rareDone = false;
      if (plant.rare && RARE_BY_ID.has(plant.rare) && !(d.rareDex ?? []).includes(plant.rare)) {
        const rareDex = [...(d.rareDex ?? []), plant.rare];
        rareDone = rareDex.length === RARE_BY_ID.size;
        next = { ...next, rareDex, ...(rareDone ? { room: room.grantItem(next.room, slot.RARE_JAR_ID) } : {}) };
      }
      commit(next);
      return { ...fruit, ...(gift ? { gift } : {}), ...(plant.rare ? { rare: { kind: plant.rare, done: rareDone } } : {}) };
    },

    buyYard: (id) => {
      const d = get().data;
      if (!d) return "unknown";
      const out = buyYardItem(normalizeYard(d.yard), d.jam, id);
      if (typeof out === "string") return out;
      commit({ ...d, yard: out.yard, jam: out.jam });
      return true;
    },

    setYardSlot: (slot, id) => {
      const d = get().data;
      if (!d) return false;
      const next = setYardSlotRule(normalizeYard(d.yard), slot, id);
      if (!next) return false;
      commit({ ...d, yard: next });
      return true;
    },

    makeJar: (fruitIds, catalog) => {
      const d = get().data;
      if (!d) return null;
      const fruits = fruitIds.map((id) => d.basket.find((f) => f.id === id)).filter((f): f is Fruit => Boolean(f));
      const region = fruits.length === fruitIds.length ? jarRegion(fruits, catalog) : null;
      if (!region) return null;
      const shown: room.Shown = { id: `j:${uid()}`, kind: "jar", species: region, mut: jarMutations(fruits) };
      const added = room.addShown(d.room, shown);
      if (!added) return null;
      const made = d.jars ?? [];
      const seed = made.includes(region) ? null : jarFirstSeed(region, [...catalog.values()], d.nick);
      const ids = new Set(fruitIds);
      commit({
        ...d,
        room: added.room,
        basket: d.basket.filter((f) => !ids.has(f.id)),
        jars: made.includes(region) ? made : [...made, region],
        seeds: seed ? { ...d.seeds, [seed.id]: (d.seeds[seed.id] ?? 0) + 1 } : d.seeds,
      });
      return { region, placed: Boolean(added.at), seed };
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
      const clean = cleanNick(nick);
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

    metFriend: (gid, nick) => {
      const d = get().data;
      if (!d) return;
      const name = cleanNick(nick) || "이웃";
      const head = d.friends[0];
      // 같은 정원을 다시 열 때마다 쓰지 않는다. 이름이 바뀌었을 때만.
      if (head && head.id === gid && head.nick === name) return;
      const rest = d.friends.filter((f) => f.id !== gid);
      commit({ ...d, friends: [{ id: gid, nick: name, at: Date.now() }, ...rest].slice(0, FRIENDS_MAX) });
    },

    forgetFriend: (gid) => {
      const d = get().data;
      if (!d || !d.friends.some((f) => f.id === gid)) return;
      commit({ ...d, friends: d.friends.filter((f) => f.id !== gid) });
    },

    gaveWater: (gid, ilchon) => {
      const d = get().data;
      if (!d) return;
      const today = kstDayNumber(Date.now());
      const w = d.waters.day === today ? d.waters : { day: today, given: [], received: [] };
      if (w.given.includes(gid)) return;
      // 1촌인지는 주는 쪽 화면이 안다. 속여도 빨라지는 것은 제 텃밭뿐이다(받는 쪽은 규칙이 본 표시를 쓴다).
      const cut = ilchon ? WATER_CUT_ILCHON : undefined;
      commit({ ...d, beds: waterBeds(d.beds, Date.now(), cut), waters: { ...w, given: [...w.given, gid] } });
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
      for (const v of fresh) beds = waterBeds(beds, Date.now(), v.il ? WATER_CUT_ILCHON : undefined);
      commit({ ...d, beds, waters: { ...w, received: [...w.received, ...fresh.map((v) => v.uid)] } });
      return fresh;
    },

    claimRaid: (key, seed, catalog, loot, kind) => {
      const d = get().data;
      if (!d || d.raids.includes(key) || !loot.box) return null;
      const species = openRaidBox(seed, catalog, loot.perennial);
      // 표본 하나. 셋이면 그 악초의 박제가 방 보관함에 생긴다(놓을 칸이 있으면 바로 놓는다).
      const have = new Set(d.room.shown.filter((x) => x.kind === "trophy").map((x) => x.species as RaidKindId));
      const sample = addSample(d.loot.samples, kind, have);
      let nextRoom = d.room;
      if (sample.trophy) nextRoom = room.addShown(nextRoom, { id: trophyId(sample.trophy), kind: "trophy", species: sample.trophy })?.room ?? nextRoom;
      const trophies = nextRoom.shown.filter((x) => x.kind === "trophy").length;
      const wallpaper = Boolean(sample.trophy) && trophies >= RAID_KINDS.length && !(nextRoom.owned[TROPHY_WALLPAPER] ?? 0);
      if (wallpaper) nextRoom = room.grantItem(nextRoom, TROPHY_WALLPAPER);
      commit({
        ...d,
        jam: d.jam + RAID_BOX.jam,
        roots: d.roots + loot.roots,
        seeds: species ? give(d.seeds, species.id) : d.seeds,
        // 오래된 날은 버린다. 문서가 끝없이 커지지 않게.
        raids: [...d.raids, key].slice(-60),
        loot: { ...d.loot, samples: sample.samples },
        room: nextRoom,
        album: withMoment(d, { t: "raid", s: kind, v: key, at: Date.now() }).album,
      });
      return { species, jam: RAID_BOX.jam, roots: loot.roots, trophy: sample.trophy, wallpaper };
    },

    markChapterRead: (slug, chapter) => {
      const d = get().data;
      const had = d?.library.read[slug] ?? [];
      if (!d || had.includes(chapter) || !roomBookOf(bookIdOf(slug))) return false;
      const read = [...had, chapter];
      const book = roomBookOf(bookIdOf(slug));
      const done = book && read.length >= book.chapters && had.length < book.chapters;
      const next: GardenData = { ...d, library: { ...d.library, read: { ...d.library.read, [slug]: read } } };
      commit(done ? withMoment(next, { t: "book", s: slug, at: Date.now() }) : next);
      return true;
    },

    setBookMarks: (slug, ids) => {
      const d = get().data;
      if (!d || !roomBookOf(bookIdOf(slug))) return;
      const prev = d.room.books?.[slug] ?? { marks: [] };
      commit({ ...d, room: { ...d.room, books: { ...d.room.books, [slug]: { ...prev, marks: cleanMarks(ids) } } } });
    },

    claimBookSeed: (slug, catalog, who) => {
      const d = get().data;
      const book = roomBookOf(bookIdOf(slug));
      const day = kstDayNumber(Date.now());
      if (!d || !book || !d.room.placed.some((p) => p.it === bookIdOf(slug)) || !seedReady(d.library, slug, day)) return null;
      const species = bookSeed(book, day, who, catalog);
      if (!species) return null;
      commit({ ...d, seeds: give(d.seeds, species.id), library: { ...d.library, seedDay: { ...d.library.seedDay, [slug]: day } } });
      return species;
    },

    payBookAsk: (slug) => {
      const d = get().data;
      const day = kstDayNumber(Date.now());
      if (!d || d.jam < BOOK_ASK_JAM) return false;
      const n = d.library.asks.day === day ? d.library.asks.n : {};
      commit({ ...d, jam: d.jam - BOOK_ASK_JAM, library: { ...d.library, asks: { day, n: { ...n, [slug]: (n[slug] ?? 0) + 1 } } } });
      return true;
    },

    claimLends: (readers) => {
      const d = get().data;
      const day = kstDayNumber(Date.now());
      if (!d) return 0;
      const got = lendClaim(d.library, readers, day);
      if (got.jam <= 0) return 0;
      const paid = d.library.lent.day === day ? d.library.lent.uids : [];
      commit({ ...d, jam: d.jam + got.jam, library: { ...d.library, lent: { day, uids: [...paid, ...got.uids] } } });
      return got.jam;
    },

    markRaidPart: (key, form) => {
      const d = get().data;
      const k = String(key);
      if (!d || form < 1 || form > 3 || (d.loot.parts[k] ?? []).includes(form)) return;
      commit({ ...d, loot: { ...d.loot, parts: trimLedger({ ...d.loot.parts, [k]: [...(d.loot.parts[k] ?? []), form] }) } });
    },

    claimRaidJam: (key, ids) => {
      const d = get().data;
      const k = String(key);
      if (!d) return 0;
      const paid = d.loot.paid[k] ?? [];
      // 값은 장부의 표에서 셈한다. 화면이 넘긴 것은 무엇을 받을지(id)뿐이다.
      const fresh = [...new Set(ids)].filter((id) => id >= 0 && id <= 3 && !paid.includes(id));
      if (fresh.length === 0) return 0;
      const jam = fresh.reduce((n, id) => n + (id === 0 ? RAID_JAM.base : RAID_JAM.forms[id - 1]), 0);
      commit({ ...d, jam: d.jam + jam, loot: { ...d.loot, paid: trimLedger({ ...d.loot.paid, [k]: [...paid, ...fresh] }) } });
      return jam;
    },

    claimEscape: (key, roots) => {
      const d = get().data;
      if (!d || roots <= 0 || d.loot.fled.includes(key)) return null;
      commit({ ...d, roots: d.roots + roots, loot: { ...d.loot, fled: [...d.loot.fled, key].slice(-LEDGER_KEEP) } });
      return roots;
    },

    buyKit: (id) => {
      const d = get().data;
      if (!d) return false;
      const item = KIT[id];
      const today = kstDay(Date.now());
      const bought = d.kit.day === today ? d.kit.bought : {};
      if ((bought[id] ?? 0) >= item.perDay || d.jam < item.price) return false;
      commit({
        ...d,
        jam: d.jam - item.price,
        kit: { ...d.kit, have: { ...d.kit.have, [id]: (d.kit.have[id] ?? 0) + 1 }, day: today, bought: { ...bought, [id]: (bought[id] ?? 0) + 1 } },
      });
      return true;
    },

    armKit: (id, raid) => {
      const d = get().data;
      const have = d?.kit.have[id] ?? 0;
      if (!d || have <= 0 || d.kit.on[id] === raid) return false;
      const left: KitLedger["have"] = { ...d.kit.have, [id]: have - 1 };
      if (have - 1 <= 0) delete left[id];
      commit({ ...d, kit: { ...d.kit, have: left, on: { ...d.kit.on, [id]: raid } } });
      return true;
    },

    useGlove: () => {
      const d = get().data;
      const have = d?.kit.have.glove ?? 0;
      if (!d || have <= 0) return false;
      const left: KitLedger["have"] = { ...d.kit.have, glove: have - 1 };
      if (have - 1 <= 0) delete left.glove;
      commit({ ...d, kit: { ...d.kit, have: left } });
      return true;
    },

    buyTrophy: (id) => {
      const d = get().data;
      if (!d) return "unknown";
      const out = room.buyTrophyItem(d.room, d.roots, id);
      if (typeof out === "string") return out;
      commit({ ...d, room: out.room, roots: out.roots });
      return true;
    },

    setFx: (id) => {
      const d = get().data;
      if (!d || d.loot.fx === id || (id !== null && !(d.room.owned[id] ?? 0))) return;
      commit({ ...d, loot: { ...d.loot, fx: id } });
    },

    spinSeedSlot: (catalog, rand = Math.random, mode = "paid") => {
      const d = get().data;
      if (!d) return "done";
      const now = Date.now();
      const today = kstDay(now);
      const ledger = slot.ofToday(slot.normalizeSlots(d.slots), today);
      if (mode === "paid") {
        if (slot.spinsLeft(ledger, "seed", today) <= 0) return "done";
        if (d.jam < slot.SEED_SPIN_COST) return "jam";
      } else if (mode === "free") {
        if (ledger.freeSeed <= 0) return "no-free";
      } else if (slot.guestCanSpin(ledger, mode.guest, today) !== "ok") return "guest-done";
      const spin = slot.spinSeed(ledger.seedPity, rand);
      const of = (tier: Species["tier"]) => {
        const list = catalog.filter((x) => x.tier === tier);
        return list.length ? list[Math.floor(rand() * list.length)] : undefined;
      };
      const got: Array<{ species: Species; rare?: string }> = [];
      let seeds = d.seeds;
      let rare = { ...(d.rareSeeds ?? {}) };
      const o = spin.outcome;
      if (o.kind === "rare") {
        const species = of(RARE_BY_ID.get(o.rare)!.tier);
        if (species) {
          const key = rareKey(o.rare, species.id);
          rare = { ...rare, [key]: (rare[key] ?? 0) + 1 };
          got.push({ species, rare: o.rare });
        }
      } else if (o.kind === "triple" || o.kind === "pair") {
        const tier = o.kind === "pair" ? "sprout" : o.tier;
        for (let i = 0; i < o.n; i++) {
          const species = of(tier);
          if (!species) continue;
          seeds = give(seeds, species.id);
          got.push({ species });
        }
      }
      const paid = mode === "paid" ? slot.SEED_SPIN_COST : 0;
      const counted =
        mode === "paid"
          ? { seed: ledger.seed + 1 }
          : mode === "free"
            ? { freeSeed: ledger.freeSeed - 1 }
            : { guestRooms: [...ledger.guestRooms, mode.guest] };
      commit({
        ...d,
        jam: d.jam - paid,
        seeds,
        rareSeeds: rare,
        slots: { ...ledger, ...counted, seedPity: slot.nextSeedPity(ledger.seedPity, spin) },
      });
      return { spin, got, paid };
    },

    spinRoomSlot: (rand = Math.random, mode = "paid") => {
      const d = get().data;
      if (!d) return "done";
      const now = Date.now();
      const today = kstDay(now);
      const ledger = slot.ofToday(slot.normalizeSlots(d.slots), today);
      const table = todaysRoomTable(d.room, now);
      if (table.length === 0) return "empty";
      if (mode === "free") {
        if (ledger.freeRoom <= 0) return "no-free";
      } else {
        if (slot.spinsLeft(ledger, "room", today) <= 0) return "done";
        if (d.jam < slot.ROOM_SPIN_COST) return "jam";
      }
      const spin = slot.spinRoom(table, ledger.roomPity, rand);
      let nextRoom = d.room;
      const prize = spin.prize;
      if (prize?.kind === "music") {
        const t = purchasedTrack(prize.id);
        if (t) nextRoom = { ...nextRoom, music: [...ownedMusic(nextRoom.music), t.id] };
      }
      else if (prize) nextRoom = room.giftItem(nextRoom, prize.id) ?? nextRoom;
      const paid = mode === "paid" ? slot.ROOM_SPIN_COST : 0;
      commit({
        ...d,
        jam: d.jam - paid,
        room: nextRoom,
        slots: {
          ...ledger,
          ...(mode === "paid" ? { room: ledger.room + 1 } : { freeRoom: ledger.freeRoom - 1 }),
          roomPity: slot.nextRoomPity(ledger.roomPity, spin),
        },
      });
      return { spin, table, paid };
    },

    takeSlotChance: () => {
      const d = get().data;
      if (!d) return false;
      const today = kstDay(Date.now());
      const ledger = slot.ofToday(slot.normalizeSlots(d.slots), today);
      if (ledger.chance >= slot.SLOT_CHANCES_PER_DAY) return false;
      commit({ ...d, slots: { ...ledger, chance: ledger.chance + 1 } });
      return true;
    },

    winSlotChance: (machine) => {
      const d = get().data;
      if (!d) return;
      const ledger = slot.normalizeSlots(d.slots);
      const key = machine === "seed" ? "freeSeed" : "freeRoom";
      commit({ ...d, slots: { ...ledger, [key]: Math.min(slot.SLOT_CHANCES_PER_DAY, ledger[key] + 1) } });
    },

    claimPot: (key, jam) => {
      const d = get().data;
      if (!d) return false;
      const ledger = slot.normalizeSlots(d.slots);
      if (ledger.pots.includes(key)) return false;
      commit({ ...d, jam: d.jam + Math.max(0, Math.min(slot.POT_SHARE_MAX, Math.floor(jam))), slots: { ...ledger, pots: [...ledger.pots, key].slice(-60) } });
      return true;
    },

    claimGachaHost: (visitors) => {
      const d = get().data;
      if (!d) return null;
      const got = slot.hostJam(slot.normalizeSlots(d.slots), visitors, kstDay(Date.now()));
      if (!got) return null;
      commit({ ...d, jam: d.jam + got.jam, slots: got.ledger });
      return { jam: got.jam, count: got.fresh.length };
    },

    plantRare: (bed, key, species, plaza) => {
      const d = get().data;
      const parsed = parseRareKey(key);
      if (!d || d.beds[bed] || !parsed || parsed.speciesId !== species.id || !(d.rareSeeds?.[key] ?? 0)) return;
      const now = Date.now();
      const speed = PLAZA_SPEED[plaza];
      const beds = [...d.beds];
      const rot = rotationOf(d.plotLog?.[bed], species);
      beds[bed] = {
        id: uid(),
        speciesId: species.id,
        plantedAt: now,
        ripeAt: ripeTime(now, growMinutes(species) * parsed.kind.grow, speed),
        speed,
        harvests: 0,
        rare: parsed.kind.id,
        ...(rot ? { rot } : {}),
      };
      const left = (d.rareSeeds?.[key] ?? 0) - 1;
      const rareSeeds = { ...d.rareSeeds };
      if (left > 0) rareSeeds[key] = left;
      else delete rareSeeds[key];
      commit({ ...d, beds, rareSeeds });
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

    buyFinisher: (id) => {
      const d = get().data;
      if (!d) return false;
      const item = FINISHERS[id];
      const today = kstDay(Date.now());
      const bought = d.finishers.day === today ? d.finishers.bought : {};
      if ((bought[id] ?? 0) >= item.perDay || d.jam < item.price) return false;
      commit({
        ...d,
        jam: d.jam - item.price,
        finishers: {
          have: { ...d.finishers.have, [id]: (d.finishers.have[id] ?? 0) + 1 },
          day: today,
          bought: { ...bought, [id]: (bought[id] ?? 0) + 1 },
        },
      });
      return true;
    },

    spendFinisher: (id) => {
      const d = get().data;
      const have = d?.finishers.have[id] ?? 0;
      if (!d || have <= 0) return false;
      const next: GardenData["finishers"]["have"] = { ...d.finishers.have, [id]: have - 1 };
      // 다 쓴 것은 키를 지운다. 0이 끝없이 쌓이지 않게.
      if (have - 1 <= 0) delete next[id];
      commit({ ...d, finishers: { ...d.finishers, have: next } });
      return true;
    },

    refundFinisher: (id) => {
      const d = get().data;
      if (!d) return;
      commit({ ...d, finishers: { ...d.finishers, have: { ...d.finishers.have, [id]: (d.finishers.have[id] ?? 0) + 1 } } });
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

    inviteCode: () => {
      const d = get().data;
      if (!d) return null;
      if (d.invite.code) return d.invite.code;
      const code = newInviteCode();
      commit({ ...d, invite: { ...d.invite, code, registered: false } });
      return code;
    },

    inviteRegistered: () => {
      const d = get().data;
      if (!d || d.invite.registered) return;
      commit({ ...d, invite: { ...d.invite, registered: true } });
    },

    acceptInvite: (code) => {
      const d = get().data;
      if (!d || !canAcceptInvite(d, code)) return false;
      commit({ ...d, invite: { ...d.invite, by: code, done: false } });
      return true;
    },

    finishInvite: (reward) => {
      const d = get().data;
      if (!d || !d.invite.by || d.invite.done) return null;
      const species = reward ? openInviteBox(reward.key, reward.catalog) : undefined;
      commit({ ...d, seeds: species ? give(d.seeds, species.id) : d.seeds, invite: { ...d.invite, done: true } });
      return species;
    },

    claimInvites: (joined, catalog) => {
      const d = get().data;
      if (!d || !d.invite.code) return [];
      const n = invitePending(joined, d.invite.claimed);
      if (n === 0) return [];
      const boxes = Array.from({ length: n }, (_, i) => openInviteBox(`${d.invite.code}:${d.invite.claimed + i + 1}`, catalog));
      let seeds = d.seeds;
      for (const b of boxes) if (b) seeds = give(seeds, b.id);
      commit({ ...d, seeds, invite: { ...d.invite, claimed: d.invite.claimed + n } });
      return boxes;
    },

    renewShareId: () => {
      const d = get().data;
      if (!d) return;
      commit({ ...d, share: { id: newPublicId(), on: d.share.on } });
    },

    updateIlchon: (fn) => {
      const d = get().data;
      if (!d) return;
      const next = fn(d.ilchon);
      if (next === d.ilchon) return;
      commit({ ...d, ilchon: next });
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

    buyFurniture: (id) => {
      const d = get().data;
      if (!d) return "unknown";
      const out = room.buyItem(d.room, d.jam, id, Date.now());
      if (typeof out === "string") return out;
      // 특별한 책이면 들인 날(장서표)을 적고 서재 세트를 본다.
      const next = room.grantLibrarySets(room.stampBookSince(out.room, id, kstDayNumber(Date.now())));
      commit({ ...d, room: next, jam: out.jam });
      return true;
    },

    upgradeRoom: () => {
      const d = get().data;
      const out = d && room.upgradeRoom(d.room, d.jam);
      if (!d || !out) return false;
      commit({ ...d, room: out.room, jam: out.jam, news: pushNews(d.news, newsEntry("room", "", Date.now(), String(out.room.size))) });
      return true;
    },

    setMood: (id) => {
      const d = get().data;
      if (!d || d.room.mood === id || !MOODS.some((m) => m.id === id)) return;
      commit({ ...d, room: { ...d.room, mood: id } });
    },

    setMotto: (text) => {
      const d = get().data;
      if (!d) return "empty";
      const problem = room.mottoProblem(text);
      if (problem) return problem;
      const motto = room.cleanMotto(text);
      if (d.room.motto !== motto) commit({ ...d, room: { ...d.room, motto } });
      return null;
    },

    buyMusic: (id) => {
      const d = get().data;
      if (!d) return "unknown";
      const out = room.buyMusic(d.room, d.jam, id);
      if (typeof out === "string") return out;
      commit({ ...d, room: out.room, jam: out.jam });
      return true;
    },

    setBgm: (id) => {
      const d = get().data;
      if (!d || d.room.bgm === id || !canUseTrack(id, d.room.music)) return;
      commit({ ...d, room: { ...d.room, bgm: id } });
    },

    savePianoSong: (id, song) => {
      const d = get().data;
      const take = pianoSong(song);
      if (!d || !take.length || !d.room.placed.some((p) => p.it === "piano" && (p.kb ?? 0) === id)) return false;
      commit({ ...d, room: { ...d.room, pianoSongs: { ...d.room.pianoSongs, [id]: take } } });
      return true;
    },
    setPianoNotes: (id, notes) => {
      const d = get().data;
      if (!d || !d.room.placed.some((p) => p.it === "piano" && (p.kb ?? 0) === id)) return;
      commit({ ...d, room: { ...d.room, pianos: { ...d.room.pianos, [id]: pianoNotes(notes) } } });
    },
    setKey: (slot, key, keyboard = 0) => {
      const d = get().data;
      if (!d || slot < 0 || slot >= room.keyboardKeys(d.room, keyboard).length) return;
      const keys = normalizeKeys(room.keyboardKeys(d.room, keyboard).map((k, i) => (i === slot ? key : k)));
      commit({ ...d, room: room.withKeyboardKeys(d.room, keyboard, keys) });
    },

    setKeys: (keys, keyboard = 0) => {
      const d = get().data;
      if (!d) return;
      commit({ ...d, room: room.withKeyboardKeys(d.room, keyboard, keys) });
    },

    applySurface: (id) => {
      const d = get().data;
      const next = d && room.applySurface(d.room, id);
      if (!d || !next) return false;
      commit({ ...d, room: next });
      return true;
    },

    saveAvatar: (next) => {
      const d = get().data;
      if (!d || !d.room.avatar) return false;
      const cur = d.room.avatar;
      const draft = normalizeAvatar({ ...next, owned: cur.owned }, "", d.room.size);
      if (!avatarAtOk(draft.at, room.roomWidth(d.room.size)) || unownedWear(cur, draft.look).length) return false;
      commit({ ...d, room: { ...d.room, avatar: draft } });
      return true;
    },

    buyWear: (id) => {
      const d = get().data;
      if (!d || !d.room.avatar) return "unknown";
      const out = buyWearRule(d.room.avatar, { jam: d.jam, roots: d.roots }, id);
      if (typeof out === "string") return out;
      commit({ ...d, room: { ...d.room, avatar: out.avatar }, jam: out.jam, roots: out.roots });
      return true;
    },

    claimWear: (levels) => {
      const d = get().data;
      if (!d || !d.room.avatar) return [];
      const golden = Object.values(d.dex).filter((m) => m.includes("golden")).length;
      const trophies = new Set(d.room.shown.filter((x) => x.kind === "trophy").map((x) => x.species)).size;
      const next = grantRewards(d.room.avatar, { titles: levels, golden, trophies });
      if (next === d.room.avatar) return [];
      commit({ ...d, room: { ...d.room, avatar: next } });
      return next.owned.filter((id) => !d.room.avatar!.owned.includes(id));
    },

    saveRoom: (draft) => {
      const d = get().data;
      // 꾸미는 동안 산 것·전시한 것이 있을 수 있다. 장부(owned·shown·size)는 지금 것을 쓰고, 배치만 받는다.
      const next = d && { ...d.room, wall: draft.wall, floor: draft.floor, placed: draft.placed, keyboards: { ...draft.keyboards, ...d.room.keyboards } };
      if (!d || !next || !room.validRoom(next)) return false;
      // 꼬마 자리(꾸미기에서 끌어 옮긴다). 가구를 옮기다 꼬마 자리를 옷장 같은 것이 덮었으면 가까운 빈 바닥으로 비킨다.
      if (next.avatar) {
        const at = draft.avatar && avatarAtOk(draft.avatar.at, room.roomWidth(next.size)) ? draft.avatar.at : next.avatar.at;
        next.avatar = { ...next.avatar, at: avatarFree(next, at) ?? at };
      }
      commit({ ...d, room: next });
      return true;
    },

    showFruit: (fruitId, catalog) => {
      const d = get().data;
      const fruit = d?.basket.find((f) => f.id === fruitId);
      const species = fruit && catalog.get(fruit.speciesId);
      if (!d || !fruit || !species) return null;
      const shown = room.shownFromFruit(fruit, species);
      const added = room.addShown(d.room, shown);
      if (!added) return null;
      // 변이 화분을 놓으면 1촌 소식이 된다. 가장 값진 변이 하나로.
      const top = [...fruit.mutations].sort((a, b) => MUTATION[b].multiplier - MUTATION[a].multiplier)[0];
      const news = top && added.at ? pushNews(d.news, newsEntry("mutant", species.id, Date.now(), top)) : d.news;
      commit({ ...d, room: added.room, basket: d.basket.filter((f) => f.id !== fruitId), news });
      return { shown, at: added.at };
    },

    frameNote: (noteId, speciesId) => {
      const d = get().data;
      const out = d && room.frameNote(d.room, d.jam, noteId, speciesId);
      if (!d || !out) return null;
      commit({ ...d, room: out.room, jam: out.jam });
      return { at: out.at, bought: out.bought };
    },

    rollWeedQuiz: () => {
      const d = get().data;
      if (!d) return false;
      const today = kstDay(Date.now());
      const n = d.weedQuiz?.day === today ? d.weedQuiz.n : 0;
      if (n >= WEED_QUIZ_PER_DAY || d.weedQuiz?.open || Math.random() >= WEED_QUIZ_ODDS) return false;
      commit({ ...d, weedQuiz: { day: today, n: n + 1, open: true } });
      return true;
    },

    settleWeedQuiz: (correct) => {
      const d = get().data;
      if (!d || !d.weedQuiz?.open) return null;
      const closed = { ...d.weedQuiz, open: false };
      const gift = correct ? pickGift(d.room, Math.random) : null;
      const nextRoom = gift ? room.giftItem(d.room, gift.id) : null;
      commit({ ...d, weedQuiz: closed, ...(nextRoom ? { room: nextRoom } : {}) });
      return nextRoom ? gift : null;
    },

    earnSouvenir: (speciesId, catalog) => {
      const d = get().data;
      if (!d || !speciesId.startsWith("a:") || !catalog.has(speciesId)) return false;
      const got = room.receiveSouvenir(d.room, speciesId);
      if (!got) return false;
      commit(withMoment({ ...d, room: got.room, news: pushNews(d.news, newsEntry("souvenir", speciesId, Date.now())) }, { t: "souvenir", s: speciesId, at: Date.now() }));
      return { where: got.where, moved: got.moved };
    },

    clearIsoMoved: () => {
      const d = get().data;
      if (d?.room.isoMoved === undefined) return;
      const { isoMoved: _seen, ...rest } = d.room;
      void _seen;
      commit({ ...d, room: rest });
    },

    clearCaseMoved: () => {
      const d = get().data;
      if (!d?.room.caseMoved) return;
      const { caseMoved: _seen, ...rest } = d.room;
      void _seen;
      commit({ ...d, room: rest });
    },

    clipPhoto: (input, catalog) => {
      const d = get().data;
      const anchor = album.parseAnchor(input.a);
      if (!d || !anchor) return "unknown";
      const species = album.speciesOf(anchor);
      if (species && !catalog.has(species)) return "unknown";
      // 퍼 온 사진은 남이 거둔 것이라 거두기 조건을 보지 않는다(출처가 붙는다).
      if (album.needsHarvest(anchor) && species && !d.dex[species] && !input.from) return "unharvested";
      if (input.x && lineProblem(input.x)) return "bad";
      const got = album.addPhoto(d.album ?? album.freshAlbum(), input, uid().slice(0, 20), Date.now());
      if (typeof got === "string") return got;
      // 1촌 소식은 품종이 있는 사진만(소식 글은 품종표에서 나온다 — newsText).
      const newsOf = species ?? (anchor.kind === "moment" && got.photo.md?.s && catalog.has(got.photo.md.s) ? got.photo.md.s : null);
      commit({ ...d, album: got.album, ...(newsOf ? { news: pushNews(d.news, newsEntry("album", newsOf, Date.now())) } : {}) });
      return got.photo;
    },

    editPhoto: (id, patch) => {
      const d = get().data;
      if (!d?.album) return "missing";
      if (patch.x) {
        const problem = lineProblem(patch.x);
        if (problem) return problem;
      }
      const next = album.editPhoto(d.album, id, patch);
      if (!next) return "missing";
      commit({ ...d, album: next });
      return true;
    },

    removePhoto: (id) => {
      const d = get().data;
      const next = d?.album ? album.removePhoto(d.album, id) : null;
      if (!d || !next) return;
      commit({ ...d, album: next });
    },

    claimScraps: (scraps) => {
      const d = get().data;
      if (!d) return null;
      const got = album.scrapJam(d.album ?? album.freshAlbum(), scraps, kstDayNumber(Date.now()));
      if (!got) return null;
      commit({ ...d, jam: d.jam + got.jam, album: got.album });
      return { jam: got.jam, count: got.count };
    },
  };
});
