
import { ACHIEVEMENTS } from "@/content/achievements";
import { POLICIES } from "@/content/policies";
import type { Claim, Source } from "@/content/schema";
import { STATEMENTS } from "@/content/words";

import { hash } from "./rules";
import type { Note, NoteKind, Species, Tier } from "./types";

/**
 * 정원의 품종 목록 — 콘텐츠에서 빌드 때 만든다.
 *
 * ★ 씨앗 하나가 콘텐츠 한 건이다.
 *   업적·정책·언행을 더하면 품종이 저절로 는다. 품종을 손으로 적는 표를 두면
 *   콘텐츠와 게임이 따로 늙는다.
 *
 * ★ 쪽지는 콘텐츠의 구성비를 그대로 옮긴다.
 *   반론과 비판·한계 claim을 사실 claim과 같은 주머니에 넣는다. 좋은 말만
 *   골라 담으면 열매가 홍보물이 된다. 다만 한 품종의 주머니가 너무 커지면
 *   /garden 페이지 무게가 늘어서, 품종마다 몇 장으로 자른다.
 *
 * 서버에서만 부른다. 콘텐츠 전체를 클라이언트 번들에 싣지 않는다.
 */

const NOTE_LIMIT = 5;
const CRITIQUE_LIMIT = 2;
const TEXT_LIMIT = 140;

function clip(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > TEXT_LIMIT ? `${flat.slice(0, TEXT_LIMIT - 1)}…` : flat;
}

function sourceOf(claim: Claim, sources: Source[]): Pick<Note, "sourceUrl" | "sourceTitle"> {
  for (const id of claim.sourceIds) {
    const source = sources.find((s) => s.id === id);
    const url = source?.url ?? source?.archivedUrl;
    if (source && url) return { sourceUrl: url, sourceTitle: source.publisher };
  }
  return {};
}

function claimNote(prefix: string, claim: Claim, sources: Source[], kind?: NoteKind): Note {
  return {
    id: `${prefix}#${claim.id}`,
    kind: kind ?? claim.assertionType,
    text: clip(claim.text),
    by: claim.assertionType === "CLAIM" ? claim.assertedBy : undefined,
    verified: claim.verified,
    ...sourceOf(claim, sources),
  };
}

/** 고르게 뽑는다. 앞쪽 claim만 담으면 페이지 첫머리의 이야기만 반복된다. */
function spread<T>(items: T[], n: number): T[] {
  if (items.length <= n) return items;
  const step = items.length / n;
  return Array.from({ length: n }, (_, i) => items[Math.floor(i * step)]);
}

/** 여러 해에 걸친 업적은 다년생이다. 연표의 첫해와 끝해가 2년 넘게 벌어지면. */
function spansYears(dates: string[]): boolean {
  const years = dates.map((d) => Number(d.slice(0, 4))).filter(Number.isFinite);
  if (years.length < 2) return false;
  return Math.max(...years) - Math.min(...years) >= 2;
}

export function buildCatalog(): Species[] {
  const species: Species[] = [];

  for (const a of ACHIEVEMENTS) {
    if (a.publishStatus !== "published") continue;
    const prefix = a.slug;
    const counters: Note[] = a.counterpoints.slice(0, CRITIQUE_LIMIT).map((cp) => ({
      id: `${prefix}#${cp.id}`,
      kind: "COUNTER",
      text: clip(cp.question),
      href: `/achievement/${a.slug}#counterpoint`,
    }));
    const facts = spread(a.claims, NOTE_LIMIT - counters.length).map((c) => claimNote(prefix, c, a.sources));
    const tier: Tier = spansYears(a.timeline.map((e) => e.date)) ? "perennial" : "flagship";
    species.push({
      id: `a:${a.slug}`,
      tier,
      title: a.title,
      href: `/achievement/${a.slug}`,
      notes: [...facts, ...counters],
      seed: hash(a.slug),
    });
  }

  for (const p of POLICIES) {
    const prefix = `policy:${p.slug}`;
    const critique = new Set(p.critiqueIds);
    const critiques = p.claims
      .filter((c) => critique.has(c.id))
      .slice(0, CRITIQUE_LIMIT)
      .map((c) => claimNote(prefix, c, p.sources, "CRITIQUE"));
    const facts = spread(
      p.claims.filter((c) => !critique.has(c.id)),
      NOTE_LIMIT - critiques.length,
    ).map((c) => claimNote(prefix, c, p.sources));
    species.push({
      id: `p:${p.slug}`,
      tier: "common",
      title: p.title,
      href: `/wiki/policy/${p.slug}`,
      notes: [...facts, ...critiques],
      seed: hash(p.slug),
    });
  }

  for (const w of STATEMENTS) {
    const prefix = `words:${w.slug}`;
    const notes: Note[] = w.easy
      ? spread(w.easy.points, NOTE_LIMIT).map((pt) => ({
          id: `${prefix}#${pt.id}`,
          kind: "WORD",
          text: clip(pt.say),
          sourceUrl: w.url,
          sourceTitle: w.url ? w.channel : undefined,
        }))
      : [
          {
            id: prefix,
            kind: "WORD",
            text: clip(w.overview ?? w.body ?? w.title),
            sourceUrl: w.url,
            sourceTitle: w.url ? w.channel : undefined,
          },
        ];
    species.push({
      id: `w:${w.slug}`,
      tier: "sprout",
      title: w.title,
      href: `/words/${w.slug}`,
      notes,
      seed: hash(w.slug),
    });
  }

  return species;
}
