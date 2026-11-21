import { josa } from "../rules";
import { FURNITURE, type Furniture } from "../room/catalog";
import { roomBookOf } from "../room/library";
import { OWN_MAX, type RoomData } from "../room/rules";
import type { MemorialEntry, MemorialFact } from "./types";

/**
 * 잡초 O/X 퀴즈 — 광장 잡초를 뽑으면 가끔 뜬다(rules.ts의 WEED_QUIZ_ODDS·WEED_QUIZ_PER_DAY).
 * 맞히면 상점 가구 하나를 선물로 받는다. 순수 함수만 둔다(memorial.test.ts).
 *
 * ★ 틀린 문장을 지어내지 않는다. 문장은 "「업적」에서 확인된 숫자 중에 ‘값’이 있다"이고,
 *   O면 그 업적의 실제 핵심 숫자, X면 **다른 업적의 실제 핵심 숫자**다. 풀이가 그 숫자의 진짜 자리를 알려 준다.
 * ★ 선물은 무작위지만 확률을 공개한다 — 고를 수 있는 가구 가운데 같은 확률. 잼으로 사는 것이 아니고(뽑기 아님), 가진 수 상한(OWN_MAX)을 넘지 않는다.
 */

export interface OxQuiz {
  /** 퀴즈의 업적. */
  slug: string;
  title: string;
  href: string;
  /** "「…」에서 확인된 숫자 중에 ‘…’이 있다" */
  statement: string;
  answer: boolean;
  /** 맞혔든 틀렸든 보이는 풀이 — 그 숫자가 실제로 어디의 무엇인지. */
  explain: string;
  /** 풀이의 근거 앵커(업적slug#claimId). */
  anchor: string;
}

/** ‘값’에 붙는 이/가. 숫자·기호로 끝나면 읽는 소리를 모르니 "가"(josa가 그렇게 셈한다). */
function quoted(value: string): string {
  return `‘${value}’${josa(value, "이가").slice(value.length)}`;
}

function factLine(f: MemorialFact): string {
  return `${f.label} ${f.value}${f.type === "CLAIM" && f.by ? ` (${f.by} 발표)` : ""}`;
}

/** rand는 0 ≤ x < 1. 업적이 둘 이상이어야 만든다. */
export function makeOx(entries: readonly MemorialEntry[], rand: () => number): OxQuiz | null {
  const usable = entries.filter((e) => e.facts.length > 0);
  if (usable.length < 2) return null;
  const e = usable[Math.floor(rand() * usable.length)];
  const mine = new Set(e.facts.map((f) => f.value));
  if (rand() < 0.5) {
    const f = e.facts[Math.floor(rand() * e.facts.length)];
    return {
      slug: e.slug,
      title: e.title,
      href: e.href,
      statement: `「${e.title}」에서 확인된 숫자 중에 ${quoted(f.value)} 있다`,
      answer: true,
      explain: `맞아요 — ${factLine(f)}${f.caption ? ` · ${f.caption}` : ""}`,
      anchor: f.anchor,
    };
  }
  // 다른 업적의 숫자 — 이 업적의 숫자와 값이 겹치지 않는 것만.
  const others = usable.filter((o) => o.slug !== e.slug && !mine.has(o.facts[0].value));
  if (others.length === 0) return null;
  const o = others[Math.floor(rand() * others.length)];
  const f = o.facts[0];
  return {
    slug: e.slug,
    title: e.title,
    href: e.href,
    statement: `「${e.title}」에서 확인된 숫자 중에 ${quoted(f.value)} 있다`,
    answer: false,
    explain: `‘${f.value}’는 「${o.title}」의 ${f.label}이에요. 「${e.title}」의 대표 숫자는 ${factLine(e.facts[0])}.`,
    anchor: f.anchor,
  };
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
