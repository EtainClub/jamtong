import { FURNITURE, type Furniture } from "../room/catalog";
import { roomBookOf } from "../room/library";
import { OWN_MAX, type RoomData } from "../room/rules";
import type { MemorialEntry } from "./types";

/**
 * 잡초 O/X 퀴즈 — 광장 잡초를 뽑으면 가끔 뜬다(rules.ts의 WEED_QUIZ_ODDS·WEED_QUIZ_PER_DAY).
 * 맞히면 상점 가구 하나를 선물로 받는다. 순수 함수만 둔다(memorial.test.ts).
 *
 * ★ 숫자를 맞히게 하지 않는다 — 내용을 이해했는지 묻는다(2026-11-25). 문항은 content/quizzes/ox.ts에 있고,
 *   업적의 claim만으로 참·거짓이 가려진다. X 문항은 흔한 오해이고, 풀이가 근거 claim으로 바로잡는다.
 * ★ 선물은 무작위지만 확률을 공개한다 — 고를 수 있는 가구 가운데 같은 확률. 잼으로 사는 것이 아니고(뽑기 아님), 가진 수 상한(OWN_MAX)을 넘지 않는다.
 */

export interface OxQuiz {
  /** 퀴즈의 업적. */
  slug: string;
  title: string;
  href: string;
  /** 참인지 거짓인지 고르는 한 문장. */
  statement: string;
  answer: boolean;
  /** 맞혔든 틀렸든 보이는 풀이 — 정답의 까닭을 근거로. */
  explain: string;
  /** 풀이의 근거 앵커(업적slug#claimId). */
  anchor: string;
  /** 잼공 문항 id `a:<slug>/<ox id>` — 정원에서 푼 것도 잼공 상자에 쌓인다(docs/daily-study.md §7). */
  item: string;
}

/** rand는 0 ≤ x < 1. 문항이 있는 업적에서 고른다 — 업적을 먼저 고르고 그 안에서 문항을(업적마다 같은 확률). 없으면 null. */
export function makeOx(entries: readonly MemorialEntry[], rand: () => number): OxQuiz | null {
  const usable = entries.filter((e) => e.ox?.length);
  if (usable.length === 0) return null;
  const e = usable[Math.floor(rand() * usable.length)];
  const q = e.ox[Math.floor(rand() * e.ox.length)];
  return { slug: e.slug, title: e.title, href: e.href, statement: q.statement, answer: q.answer, explain: q.explain, anchor: q.anchor, item: `a:${e.slug}/${q.id}` };
}

/**
 * 선물로 줄 수 있는 가구 — 상점에서 잼으로 늘 파는 방 가구·소품·창문(벽지·바닥재는 하나면 되니 뺀다).
 * 주마다 바뀌는 한정, 전리품(뿌리 조각)·보상 전용, 특별한 책(서재 세트가 걸려 있다)은 뺀다. 값이 큰 것(800잼 넘게)도 뺀다.
 */
export const GIFT_PRICE_MAX = 800;
export function giftPool(): Furniture[] {
  return FURNITURE.filter(
    (f) =>
      (f.kind === "floor" || f.kind === "wall" || f.kind === "window") &&
      f.price > 0 &&
      f.price <= GIFT_PRICE_MAX &&
      !f.cur &&
      !f.weekly &&
      !f.reading &&
      !roomBookOf(f.id),
  );
}

/** 이 방에 줄 수 있는 것(가진 수 상한에 닿은 것은 뺀다) 가운데 하나. 없으면 null. */
export function pickGift(room: RoomData, rand: () => number): Furniture | null {
  const pool = giftPool().filter((f) => (room.owned[f.id] ?? 0) < OWN_MAX);
  return pool.length ? pool[Math.floor(rand() * pool.length)] : null;
}
