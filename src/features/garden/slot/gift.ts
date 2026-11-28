/**
 * 방의 뽑기 기계 — 주인이 고른 아이템을 손님에게 증정하는 슬롯(docs/garden-slots.md §5), 그리고 가구 되팔기.
 *
 * ★ 상품은 주인이 미리 넣어 둔 것뿐이다. 주인은 보관함(놓지 않은 것)에서 골라 증정 상자에 넣는다 — 그만큼 보관함에서 빠진다.
 *   상자는 공개 방(gardens/{gid}/giftBox/stock)에 있고, 손님이 받으면 거기서 하나 줄고 손님의 보관함에 하나 는다.
 * ★ 손님은 한 방의 기계를 하루 한 번 무료로 돌린다(gardens/{gid}/giftWins/{uid}의 day). 당첨은 GIFT_WIN_P,
 *   당첨이면 상자에 든 수에 비례해 하나. 손님이 더 가질 수 없는 것(가진 수 상한)은 그 손님에게는 나오지 않는다.
 * ★ 되팔기는 상점 값의 SELL_RATE. 잼으로 산 것만 판다 — 전리품(뿌리 조각)·보상·처음부터 가진 것은 팔지 않는다.
 * 순수 함수만 둔다(slot/rules.test.ts). 난수는 부르는 쪽이 넘긴다.
 */
import { FURNITURE_BY_ID, type FurnitureKind } from "../room/catalog";
import { GACHA_ID } from "./rules";

/** 손님 한 번이 당첨일 확률. */
export const GIFT_WIN_P = 0.5;
/** 증정 상자에 넣을 수 있는 가지 수와 한 가지의 수(firestore.rules의 giftBox와 같다). */
export const GIFT_KINDS_MAX = 20;
export const GIFT_EACH_MAX = 99;
/** 되팔 때 받는 몫(상점 값에 대해). */
export const SELL_RATE = 0.5;

/** 방에 놓는 것만 주고받고 판다 — 벽지·바닥재·필살기는 하나면 되는 것이라 넣지 않는다. */
const PLACEABLE: readonly FurnitureKind[] = ["floor", "wall", "window", "frame-blank"];

/** 증정 상자에 넣을 수 있는 가구인가. 보상(그 사람이 모아 받은 것)과 뽑기 기계 자신은 주지 않는다. */
export function giftable(id: string): boolean {
  const f = FURNITURE_BY_ID.get(id);
  return Boolean(f && PLACEABLE.includes(f.kind) && f.cur !== "reward" && id !== GACHA_ID);
}

/**
 * 되팔면 받는 잼. 팔 수 없으면 null.
 * 뽑기 기계는 팔지 않는다 — 값을 1,200에서 10,000으로 올렸으므로, 옛값에 산 사람이 되팔아 남기지 않게.
 */
export function sellPrice(id: string): number | null {
  const f = FURNITURE_BY_ID.get(id);
  if (!f || f.cur || f.price <= 0 || !PLACEABLE.includes(f.kind) || id === GACHA_ID) return null;
  return Math.max(1, Math.floor(f.price * SELL_RATE));
}

export type GiftStock = Record<string, number>;

/** 공개 문서의 상자를 읽는다. 표에 있고 줄 수 있는 것만, 수는 1~GIFT_EACH_MAX. */
export function readStock(raw: unknown): GiftStock {
  const out: GiftStock = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    const n = typeof v === "number" && Number.isFinite(v) ? Math.floor(v) : 0;
    if (n > 0 && giftable(id)) out[id] = Math.min(n, GIFT_EACH_MAX);
  }
  return out;
}

export function stockTotal(stock: GiftStock): number {
  return Object.values(stock).reduce((s, n) => s + n, 0);
}

/** 상자에 하나 더 넣을 수 있는가(가지 수·한 가지의 수 상한). */
export function canAddToStock(stock: GiftStock, id: string): boolean {
  if (!giftable(id)) return false;
  const have = stock[id] ?? 0;
  if (have >= GIFT_EACH_MAX) return false;
  return have > 0 || Object.keys(stock).length < GIFT_KINDS_MAX;
}

export type GiftDraw = { kind: "win"; id: string } | { kind: "miss" } | { kind: "empty" };

/**
 * 손님 한 번. accept는 그 손님이 받을 수 있는가(가진 수 상한). 받을 것이 없으면 empty(돌리지 않는다),
 * GIFT_WIN_P로 당첨, 당첨이면 든 수에 비례해 하나.
 */
export function drawGift(stock: GiftStock, accept: (id: string) => boolean, rand: () => number): GiftDraw {
  const pool = Object.entries(stock).filter(([id, n]) => n > 0 && accept(id));
  if (pool.length === 0) return { kind: "empty" };
  if (rand() >= GIFT_WIN_P) return { kind: "miss" };
  const total = pool.reduce((s, [, n]) => s + n, 0);
  let x = rand() * total;
  for (const [id, n] of pool) {
    if (x < n) return { kind: "win", id };
    x -= n;
  }
  return { kind: "win", id: pool[pool.length - 1][0] };
}
