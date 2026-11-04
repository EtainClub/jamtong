
import { ACHIEVEMENTS } from "@/content/achievements";
import { POLICIES } from "@/content/policies";
import type { Claim, Source } from "@/content/schema";
import { archiveEntry } from "@/content/source-archive";
import { STATEMENTS } from "@/content/words";

import { arrivedOn } from "./arrivals";
import { hash, leafId } from "./rules";
import type { Case, CaseOption, Leaf, Note, NoteKind, Species, Tier } from "./types";

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
  const species: Array<Omit<Species, "region" | "links">> = [];

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
      arrivedOn: arrivedOn(`a:${a.slug}`),
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
      arrivedOn: arrivedOn(`p:${p.slug}`),
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
      arrivedOn: arrivedOn(`w:${w.slug}`),
    });
  }

  return withMap(species);
}

/** 한 품종이 보여 줄 이웃의 최대 수. 분야가 넓으면 수십 개가 이어져 지도가 아니라 목록이 된다. */
const LINK_LIMIT = 6;

/** 해시 순으로 고른다. 콘텐츠 순서의 앞쪽만 늘 이웃이 되지 않게, 그러나 빌드마다 같게. */
function pick(ids: string[], self: string, n: number): string[] {
  return ids
    .filter((id) => id !== self)
    .sort((x, y) => hash(`${self}>${x}`) - hash(`${self}>${y}`))
    .slice(0, n);
}

/**
 * 도감 지도 — 구역과 이웃을 붙인다 (docs/garden-game.md §4, A안의 안개 지도).
 *
 * 이웃은 콘텐츠에 이미 적힌 연결뿐이다.
 *   언행 → 그 언행의 관련 업적(relatedAchievements)
 *   업적 → 그 업적을 다룬 언행, 같은 분야의 업적, 같은 분야의 정책
 *   정책 → 같은 분야의 업적
 * "같은 분야"는 느슨한 연결이라, 분야 이웃은 LINK_LIMIT까지만 고른다.
 */
function withMap(species: Array<Omit<Species, "region" | "links">>): Species[] {
  const known = new Set(species.map((s) => s.id));
  const achievements = ACHIEVEMENTS.filter((a) => known.has(`a:${a.slug}`));
  const categoriesOf = new Map<string, string[]>();
  for (const a of achievements) categoriesOf.set(`a:${a.slug}`, a.categories);
  for (const p of POLICIES) categoriesOf.set(`p:${p.slug}`, p.categories);

  const inCategory = (prefix: "a:" | "p:", categories: string[]) =>
    [...categoriesOf.entries()]
      .filter(([id, cats]) => id.startsWith(prefix) && cats.some((c) => categories.includes(c)))
      .map(([id]) => id);

  const wordsFor = new Map<string, string[]>();
  for (const w of STATEMENTS) {
    for (const slug of w.relatedAchievements) {
      const id = `a:${slug}`;
      if (known.has(id)) wordsFor.set(id, [...(wordsFor.get(id) ?? []), `w:${w.slug}`]);
    }
  }
  const relatedOf = new Map(
    STATEMENTS.map((w) => [`w:${w.slug}`, w.relatedAchievements.map((slug) => `a:${slug}`).filter((id) => known.has(id))]),
  );

  return species.map((s) => {
    if (s.id.startsWith("w:")) {
      const related = relatedOf.get(s.id) ?? [];
      const region = related.length ? (categoriesOf.get(related[0])?.[0] ?? "words") : "words";
      return { ...s, region, links: related };
    }
    const categories = categoriesOf.get(s.id) ?? [];
    if (s.id.startsWith("a:")) {
      const links = [
        ...(wordsFor.get(s.id) ?? []),
        ...pick(inCategory("a:", categories), s.id, 3),
        ...pick(inCategory("p:", categories), s.id, 3),
      ];
      return { ...s, region: categories[0] ?? "words", links: [...new Set(links)].slice(0, LINK_LIMIT + 4) };
    }
    return { ...s, region: categories[0] ?? "words", links: pick(inCategory("a:", categories), s.id, LINK_LIMIT) };
  });
}

/**
 * 시든 잎 목록 — 원문 링크가 열리지 않았던 출처. 빌드 때 링크 확인 표에서 만든다.
 *
 * ★ 원문 링크만 본다. 보존본이 있어도 원문이 안 열리면 잎이다 — 운영자가 링크를
 *   바꿀지 보존본으로 돌릴지 정할 일이다.
 * ★ 표가 "blocked"(사이트가 기계 확인을 막음)라고 적은 것도 잎이다. 사람에게는
 *   열릴 가능성이 크고, 그래서 사람이 확인할 가치가 있다. 화면은 상태를 말하지
 *   않고 "열리나요?"만 묻는다 — 답을 미리 알려 주면 확인이 아니다.
 * ★ 같은 출처를 여러 콘텐츠가 쓰면 처음 만난 하나만 맥락으로 단다.
 */
export function buildLeaves(): Leaf[] {
  const leaves = new Map<string, Leaf>();
  const add = (url: string | undefined, title: string, speciesTitle: string, href: string) => {
    if (!url || leaves.has(url)) return;
    const status = archiveEntry(url)?.status;
    if (!status || status === "ok") return;
    leaves.set(url, { id: leafId(url), url, title: clip(title), speciesTitle, href });
  };

  for (const a of ACHIEVEMENTS) {
    if (a.publishStatus !== "published") continue;
    for (const s of a.sources) add(s.url, `${s.publisher} · ${s.title}`, a.title, `/achievement/${a.slug}`);
  }
  for (const p of POLICIES) {
    for (const s of p.sources) add(s.url, `${s.publisher} · ${s.title}`, p.title, `/wiki/policy/${p.slug}`);
  }
  for (const w of STATEMENTS) add(w.url, `${w.channel} · ${w.title}`, w.title, `/words/${w.slug}`);

  return [...leaves.values()];
}

/**
 * 탐정 온실의 사건 — 정책의 "도는 주장"마다 하나. 빌드 때 보기까지 정해 둔다.
 *
 * ★ 답은 콘텐츠가 정한 것이다. 소문에 대응한다고 적힌 claim(rumor.claimIds) 하나가
 *   답이고, 다른 것을 답으로 삼지 않는다.
 * ★ 오답 보기는 **다른 정책**의 claim이다. 같은 정책의 다른 claim은 그 소문에 일부
 *   답할 수도 있어서, "틀렸다"고 하면 거짓말이 될 수 있다. 다른 정책의 claim이면
 *   "이건 「…」 이야기예요"라고 사실대로 말할 수 있다.
 * ★ 너무 쉽지 않게 같은 분야(categories)의 정책에서 고른다. 없으면 아무 정책에서.
 * ★ 보기 순서와 고르는 claim은 사건 id로 정한다. 빌드마다 바뀌지 않는다.
 */
export function buildCases(): Case[] {
  const option = (p: (typeof POLICIES)[number], claim: Claim, answer: boolean): CaseOption => ({
    note: claimNote(`policy:${p.slug}`, claim, p.sources, p.critiqueIds.includes(claim.id) ? "CRITIQUE" : undefined),
    policyTitle: p.title,
    href: `/wiki/policy/${p.slug}`,
    answer,
  });

  const cases: Case[] = [];
  for (const p of POLICIES) {
    const others = POLICIES.filter((o) => o.slug !== p.slug);
    const near = others.filter((o) => o.categories.some((c) => p.categories.includes(c)));
    for (const r of p.rumors) {
      const id = `${p.slug}#${r.id}`;
      const h = hash(id);
      const answers = r.claimIds
        .map((cid) => p.claims.find((c) => c.id === cid))
        .filter((c): c is Claim => Boolean(c));
      if (answers.length === 0) continue;
      const right = option(p, answers[h % answers.length], true);

      const wrong: CaseOption[] = [];
      const pools = [near, others];
      for (const pool of pools) {
        for (let i = 0; wrong.length < 2 && i < pool.length; i++) {
          const o = pool[(h + i * 7919) % pool.length];
          if (wrong.some((w) => w.href === `/wiki/policy/${o.slug}`) || o.claims.length === 0) continue;
          wrong.push(option(o, o.claims[hash(`${id}:${o.slug}`) % o.claims.length], false));
        }
      }
      if (wrong.length < 2) continue;

      const options = [right, ...wrong];
      const at = h % options.length;
      [options[0], options[at]] = [options[at], options[0]];
      cases.push({
        id,
        rumor: clip(r.text),
        policyTitle: p.title,
        speciesId: `p:${p.slug}`,
        href: `/wiki/policy/${p.slug}`,
        options,
      });
    }
  }
  return cases;
}
