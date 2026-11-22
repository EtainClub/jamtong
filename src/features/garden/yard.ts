/**
 * 마당 꾸미기 — 아이소 마당(IsoYard.tsx)의 정해진 자리에 소품을 놓는다(docs/garden-farm-v2.md §6 4b).
 *
 * ★ 효과가 없다. 방 가구와 같은 선(room/catalog.ts 머리말) — 성장 버프를 달면 마당이 스펙이 된다.
 * ★ 자유 배치가 아니라 정해진 자리(YARD_SLOTS). 마당은 밭이 거의 다 차지해 빈자리가 몇 곳뿐이고, 휴대폰에서는 끌기보다 누르기가 낫다.
 * ★ 잼으로 산다. 한 가지를 YARD_OWN_MAX개까지. 효과 없는 꾸밈이라 쌓인 잼을 쓸 곳이 된다(docs/garden-farm-v2.md §1).
 * ★ 순수 함수만 둔다.
 */

export interface YardItem {
  id: string;
  label: string;
  /** 잼. */
  price: number;
  /** 그림이 아직 없을 때 대신 세우는 글자. */
  emoji: string;
  /** 그림 높이(px, 타일 40 기준) — scripts/room-iso-gen.ts의 기하 안내와 그림 상자. */
  h: number;
  hint: string;
  /** GPT 그림 생성의 설명(영어). */
  art: string;
}

export const YARD_ITEMS: readonly YardItem[] = [
  { id: "scarecrow", label: "허수아비", price: 300, emoji: "🧑‍🌾", h: 70, hint: "밀짚모자를 쓴 다정한 허수아비.", art: "a friendly garden scarecrow on a wooden post, straw hat, checked shirt, stuffed with straw" },
  { id: "flowerbed", label: "꽃밭", price: 200, emoji: "🌷", h: 22, hint: "알록달록 튤립을 심은 작은 꽃밭.", art: "a small low flower bed with a stone border full of colorful tulips" },
  { id: "birdhouse", label: "새집", price: 250, emoji: "🐦", h: 64, hint: "기둥 위의 빨간 지붕 새집.", art: "a wooden birdhouse with a red roof on a tall wooden pole, a small blue bird on the perch" },
  { id: "garden-lamp", label: "정원등", price: 350, emoji: "🏮", h: 62, hint: "저녁이면 따뜻한 빛을 내는 정원등.", art: "a classic black iron garden lamp post with a warm glowing lantern on top" },
  { id: "bench", label: "정원 벤치", price: 500, emoji: "🪑", h: 34, hint: "잠깐 쉬어 가는 나무 벤치.", art: "a small wooden garden bench with curled iron armrests" },
  { id: "well", label: "우물", price: 800, emoji: "🪣", h: 66, hint: "도르래와 두레박이 달린 돌우물.", art: "a round stone wishing well with a small wooden roof, rope and a wooden bucket" },
  { id: "windmill", label: "작은 풍차", price: 1200, emoji: "🌬️", h: 90, hint: "바람에 날개가 도는 작은 풍차.", art: "a small cute wooden garden windmill with four white sails and a blue door" },
];

export const YARD_BY_ID = new Map(YARD_ITEMS.map((x) => [x.id, x]));

/**
 * 마당의 꾸밈 자리 — 울타리를 따라 안쪽·오른쪽·왼쪽 꼭짓점과 두 울타리 가운데. 밭보다 뒤라 작물을 가리지 않는다.
 * 자리의 마당 좌표는 IsoYard.tsx의 yardGeom이 정한다(밭 수에 따라 마당 크기가 바뀐다).
 */
export const YARD_SLOTS = 5;
/** 한 가지 소품을 가질 수 있는 수. */
export const YARD_OWN_MAX = 3;

export interface YardData {
  owned: Record<string, number>;
  /** 자리마다 놓인 소품 id. 비었으면 null. 길이 YARD_SLOTS. */
  slots: Array<string | null>;
}

export function freshYard(): YardData {
  return { owned: {}, slots: Array(YARD_SLOTS).fill(null) };
}

/** 옛 장부·모양이 틀린 장부를 바로잡는다. 표에 없는 소품, 가진 수를 넘게 놓인 것은 뺀다. */
export function normalizeYard(raw: unknown): YardData {
  const base = freshYard();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as { owned?: unknown; slots?: unknown };
  const owned: Record<string, number> = {};
  if (r.owned && typeof r.owned === "object") {
    for (const [id, n] of Object.entries(r.owned as Record<string, unknown>)) {
      if (YARD_BY_ID.has(id) && Number.isInteger(n) && (n as number) > 0) owned[id] = Math.min(YARD_OWN_MAX, n as number);
    }
  }
  const used: Record<string, number> = {};
  const slots = base.slots.map((_, i) => {
    const id = Array.isArray(r.slots) ? r.slots[i] : null;
    if (typeof id !== "string" || !owned[id] || (used[id] ?? 0) >= owned[id]) return null;
    used[id] = (used[id] ?? 0) + 1;
    return id;
  });
  return { owned, slots };
}

/** 놓지 않고 남은 수. */
export function yardLeft(yard: YardData, id: string): number {
  return (yard.owned[id] ?? 0) - yard.slots.filter((x) => x === id).length;
}

export type YardRefusal = "unknown" | "full" | "jam";

/** 잼으로 산다. */
export function buyYardItem(yard: YardData, jam: number, id: string): { yard: YardData; jam: number } | YardRefusal {
  const item = YARD_BY_ID.get(id);
  if (!item) return "unknown";
  const have = yard.owned[id] ?? 0;
  if (have >= YARD_OWN_MAX) return "full";
  if (!Number.isFinite(jam) || jam < item.price) return "jam";
  return { yard: { ...yard, owned: { ...yard.owned, [id]: have + 1 } }, jam: jam - item.price };
}

/** 자리에 놓거나(id) 치운다(null). 남은 것이 없거나 자리가 틀리면 null. 같은 자리의 것은 보관으로 돌아간다. */
export function setYardSlot(yard: YardData, slot: number, id: string | null): YardData | null {
  if (!Number.isInteger(slot) || slot < 0 || slot >= YARD_SLOTS) return null;
  const slots = [...yard.slots];
  slots[slot] = null;
  const freed = { ...yard, slots };
  if (id === null) return freed;
  if (!YARD_BY_ID.has(id) || yardLeft(freed, id) <= 0) return null;
  slots[slot] = id;
  return { ...freed, slots };
}
