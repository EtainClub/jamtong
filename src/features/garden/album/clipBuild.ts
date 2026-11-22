import { BOOKS } from "@/content/books";
import { POLICIES } from "@/content/policies";
import { STATEMENTS } from "@/content/words";
import { KIND_LABEL } from "@/content/words/schema";

import { clipKey, type BookClip, type Clip, type PolicyClip, type WordsClip } from "./clips";

/** 사진첩 카드 자료를 콘텐츠에서 굽는다(서버). /api/album-clip/[key]가 부른다. */

function wordsClip(slug: string): WordsClip | null {
  const w = STATEMENTS.find((s) => s.slug === slug);
  if (!w) return null;
  return {
    kind: "words",
    slug,
    title: w.title,
    label: KIND_LABEL[w.kind],
    channel: w.channel,
    displayDate: w.displayDate,
    href: `/words/${slug}`,
    ...(w.easy?.intro ? { intro: w.easy.intro } : w.context ? { intro: w.context } : {}),
    points: (w.easy?.points ?? []).map((p) => ({ id: p.id, title: p.title, say: p.say, quote: p.quote })),
  };
}

function policyClip(slug: string): PolicyClip | null {
  const p = POLICIES.find((x) => x.slug === slug);
  if (!p) return null;
  const rumorOf = new Map<string, string>();
  for (const r of p.rumors) for (const id of r.claimIds) if (!rumorOf.has(id)) rumorOf.set(id, r.text);
  return {
    kind: "policy",
    slug,
    title: p.title,
    asOf: p.asOf,
    href: `/wiki/policy/${slug}`,
    claims: p.claims.map((c) => ({
      id: c.id,
      text: c.text,
      type: c.assertionType,
      ...(c.assertedBy ? { by: c.assertedBy } : {}),
      verified: c.verified,
      ...(rumorOf.has(c.id) ? { rumor: rumorOf.get(c.id) } : {}),
    })),
  };
}

function bookClip(slug: string): BookClip | null {
  const b = BOOKS.find((x) => x.slug === slug);
  if (!b || b.chapters.length === 0) return null;
  return {
    kind: "book",
    slug,
    title: b.title,
    year: b.year,
    href: `/books/${slug}`,
    chapters: b.chapters.map((c) => ({ slug: c.slug, order: c.order, title: c.title, summary: c.summary, href: `/books/${slug}/${c.slug}` })),
  };
}

export function clipKeys(): string[] {
  return [
    ...STATEMENTS.map((w) => clipKey("words", w.slug)),
    ...POLICIES.map((p) => clipKey("policy", p.slug)),
    ...BOOKS.filter((b) => b.chapters.length > 0).map((b) => clipKey("book", b.slug)),
  ];
}

export function buildClip(key: string): Clip | null {
  const m = /^([wpb])-([a-z0-9-]+)$/.exec(key);
  if (!m) return null;
  if (m[1] === "w") return wordsClip(m[2]);
  if (m[1] === "p") return policyClip(m[2]);
  return bookClip(m[2]);
}
