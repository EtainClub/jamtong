import { existsSync } from "node:fs";
import { join } from "node:path";

import { getPublishedAchievements } from "@/content/achievements";
import { ACHIEVEMENT_HEROES } from "@/content/achievements/heroes";
import { CARTOON_MEDIA } from "@/content/cartoons";
import { ACHIEVEMENT_OX } from "@/content/quizzes/ox";
import { MILESTONES } from "@/content/milestones";
import type { Achievement, AchievementCategory } from "@/content/schema";

import { hash } from "../rules";
import type { MemorialCartoon, MemorialEntry, MemorialFact, Memento, SouvenirStatus } from "./types";

/**
 * 업적 기념관·사진첩의 자료 — 콘텐츠에서 빌드 때 만든다. 서버에서만 부른다(docs/garden-achievement-strategy.md §3).
 *
 * ★ 글을 짓지 않는다. 사진첩 카드와 문제의 모든 글은 업적의 제목·요약·핵심 숫자(keyNumbers)와 그 근거 claim에서 온다.
 *   핵심 숫자마다 claimId가 있으니 모든 줄에 앵커가 붙는다.
 * ★ 문제는 "어느 숫자가 이 업적의 것인가"다. 오답 보기는 **다른 업적의 실제 핵심 숫자**다 — 틀린 숫자를 지어내지 않는다.
 *   그래서 오답을 골라도 잘못된 사실을 배우지 않는다(그 숫자가 어느 업적의 것인지 알려 준다).
 * ★ 진행 상태는 성과 카드(milestones)가 이 업적에 이어졌을 때만 쓴다. 없으면 모른다(null) — 완료라고 지어 그리지 않는다.
 */

const CATEGORY_ICON: Record<AchievementCategory, string> = {
  diplomacy: "🌏",
  institution: "⚖️",
  welfare: "🤝",
  region: "🏙️",
  economy: "📈",
  disaster: "🛟",
};

/** 업적마다 기념품의 모양. 없으면 대표 분야의 표시. 그림이 아니라 이모지라 새 업적에 바로 붙는다. */
const ICONS: Partial<Record<string, string>> = {
  "export-surplus": "🚢",
  "inbound-tourism": "✈️",
  "birth-rebound": "👶",
  "youth-future-savings": "🐷",
  "arctic-route": "🧊",
  daejangdong: "🏘️",
  "stock-market": "📈",
  "seongnam-welfare": "🎓",
  "seongnam-debt": "🧾",
  "seongnam-hospital": "🏥",
  "seongnam-meals": "🍱",
  "gyeonggi-valley": "🏞️",
  "gyeonggi-basic-income": "💳",
  "gyeonggi-shincheonji": "🧪",
  "gyeonggi-or-cctv": "📹",
  "gyeonggi-construction": "🏗️",
  "gyeonggi-child-meal": "🍚",
  "gyeonggi-microloan": "💰",
  "gyeonggi-comfort-women": "🌼",
  "gyeonggi-ilsan-bridge": "🌉",
  "prosecution-reform": "⚖️",
  "judicial-reform": "🏛️",
  "rail-merger": "🚄",
  "nuclear-submarine": "⚓",
  "resource-diplomacy": "🤝",
  "oil-supply": "🛢️",
  "mexico-visit": "🌵",
  "housing-stabilization": "🏠",
};

const TEXT_LIMIT = 120;
function clip(text: string, limit = TEXT_LIMIT): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > limit ? `${flat.slice(0, limit - 1)}…` : flat;
}

export function souvenirIcon(a: Pick<Achievement, "slug" | "categories">): string {
  return ICONS[a.slug] ?? CATEGORY_ICON[a.categories[0]] ?? "🏅";
}

/** 이어진 성과 카드가 모두 완료면 완료, 모두 계획이면 계획, 섞였으면 추진 중. 없으면 null. */
export function souvenirStatus(slug: string): SouvenirStatus | null {
  const states = MILESTONES.filter((m) => m.achievementSlug === slug).map((m) => m.status);
  if (states.length === 0) return null;
  if (states.every((s) => s === "done")) return "done";
  if (states.every((s) => s === "planned")) return "planned";
  return "ongoing";
}

export function mementoOf(a: Pick<Achievement, "slug" | "categories">): Memento {
  return { icon: souvenirIcon(a), status: souvenirStatus(a.slug) };
}

type KeyNumber = Achievement["keyNumbers"][number];

/**
 * 카툰 — 쉬운 설명 장면마다 public/cartoons/<slug>/<장면id>.webp가 있으면 한 칸(docs/garden-cartoon-review.md).
 * 한 칸이라도 그림이 없으면 카툰을 열지 않는다(반쯤 그린 만화는 싣지 않는다).
 * 공유용 GIF·MP4는 Firebase Storage에 있고, 주소는 src/content/cartoons/media.json에서 읽는다(pnpm cartoon:upload).
 */
export function cartoonOf(a: Achievement): MemorialCartoon | undefined {
  const scenes = a.eli5?.scenes ?? [];
  if (scenes.length === 0) return undefined;
  const dir = join(process.cwd(), "public", "cartoons", a.slug);
  if (!scenes.every((s) => existsSync(join(dir, `${s.id}.webp`)))) return undefined;
  const gif = CARTOON_MEDIA[a.slug]?.gif?.url;
  const mp4 = CARTOON_MEDIA[a.slug]?.mp4?.url;
  return {
    panels: scenes.map((s) => ({
      id: s.id,
      image: `/cartoons/${a.slug}/${s.id}.webp`,
      title: s.title,
      say: s.say,
      ...(s.fact ? { fact: s.fact.value } : {}),
      anchors: s.claimIds.map((id) => `${a.slug}#${id}`),
    })),
    ...(a.eli5?.caveat ? { caveat: a.eli5.caveat.text } : {}),
    ...(gif ? { gif } : {}),
    ...(mp4 ? { mp4 } : {}),
  };
}

function valueText(k: KeyNumber): string {
  return `${k.prefix ? `${k.prefix} ` : ""}${k.value}${k.unit ?? ""}`.replace(/\s+/g, " ").trim();
}

function headOf(a: Achievement): KeyNumber | undefined {
  return a.keyNumbers.find((k) => k.id === a.headlineKeyNumberId) ?? a.keyNumbers[0];
}

function factOf(a: Achievement, k: KeyNumber): MemorialFact | null {
  const claim = a.claims.find((c) => c.id === k.claimId);
  if (!claim) return null;
  return {
    label: k.label,
    value: valueText(k),
    ...(k.caption ? { caption: clip(k.caption, 80) } : {}),
    anchor: `${a.slug}#${claim.id}`,
    type: claim.assertionType,
    ...(claim.assertionType === "CLAIM" && claim.assertedBy ? { by: claim.assertedBy } : {}),
    verified: claim.verified,
  };
}

/** 보기 글 — 숫자의 이름과 값. 주장이면 누가 말했는지까지(CLAIM을 사실처럼 옮기지 않는다). */
function optionText(f: MemorialFact): string {
  return `${f.label} ${f.value}${f.type === "CLAIM" && f.by ? ` (${f.by} 발표)` : ""}`;
}

export function buildMemorial(): MemorialEntry[] {
  const list = getPublishedAchievements();
  const heads = new Map<string, MemorialFact>();
  for (const a of list) {
    const k = headOf(a);
    const fact = k ? factOf(a, k) : null;
    if (fact) heads.set(a.slug, fact);
  }

  const entries: MemorialEntry[] = [];
  for (const a of list) {
    const head = heads.get(a.slug);
    if (!head) continue; // 핵심 숫자가 없으면 문제를 낼 수 없다 — 기념관에 세우지 않는다.
    const facts = [head, ...a.keyNumbers.filter((k) => k !== headOf(a)).map((k) => factOf(a, k)).filter((f): f is MemorialFact => f !== null)].slice(0, 3);

    // 오답 보기: 다른 업적의 대표 숫자 둘. 업적마다 정해진 순서로 고른다(빌드마다 같다).
    const others = list
      .filter((o) => o.slug !== a.slug && heads.has(o.slug))
      .sort((x, y) => hash(`${a.slug}:${x.slug}`) - hash(`${a.slug}:${y.slug}`))
      .filter((o) => heads.get(o.slug)!.label !== head.label && optionText(heads.get(o.slug)!) !== optionText(head))
      .slice(0, 2);
    const options = [
      { text: optionText(head), answer: true, from: a.title, href: `/achievement/${a.slug}` },
      ...others.map((o) => ({ text: optionText(heads.get(o.slug)!), answer: false, from: o.title, href: `/achievement/${o.slug}` })),
    ].sort((x, y) => hash(`${a.slug}:opt:${x.text}`) - hash(`${a.slug}:opt:${y.text}`));

    const hero = ACHIEVEMENT_HEROES[a.slug];
    const counter = a.counterpoints[0];
    entries.push({
      slug: a.slug,
      speciesId: `a:${a.slug}`,
      title: a.title,
      kicker: a.kicker,
      subtitle: a.subtitle,
      summary: clip(a.summary),
      href: `/achievement/${a.slug}`,
      icon: souvenirIcon(a),
      status: souvenirStatus(a.slug),
      photo: hero
        ? { src: hero, kind: "illustration", alt: `${a.title} 설명용 삽화` }
        : { src: `/achievement/${a.slug}/opengraph-image`, kind: "card", alt: `${a.title} 공유 카드` },
      facts,
      ...(counter ? { counter: { text: clip(counter.question, 90), href: `/achievement/${a.slug}#counterpoint` } } : {}),
      ...(cartoonOf(a) ? { cartoon: cartoonOf(a) } : {}),
      ox: (ACHIEVEMENT_OX[a.slug] ?? [])
        .filter((q) => q.claimIds.every((id) => a.claims.some((c) => c.id === id)))
        .map((q) => ({ statement: q.statement, answer: q.answer, explain: q.explain, anchor: `${a.slug}#${q.claimIds[0]}` })),
      quiz: {
        question: `「${a.title}」에서 확인된 숫자는 무엇일까요?`,
        options,
        explain: `${head.label} ${head.value}${head.caption ? ` — ${head.caption}` : ""}`,
        anchor: head.anchor,
      },
    });
  }
  return entries;
}
