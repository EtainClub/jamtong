/**
 * 잼공 문항 은행 만들기 — 서버에서만 부른다(콘텐츠를 읽는다). 설계는 docs/daily-study.md §10.
 *
 * ★ 지금 문항은 잡초 O/X 문항(src/content/study/ox.ts)뿐이다. 정원의 잡초 퀴즈와 같은 문항이고,
 *   잼공 문항 id는 `a:<slug>/<ox id>`로 영구다. 다른 유형(빈칸·사실·주장 가리기·대화 답장)은 다음 단계에서 더한다.
 * ★ 문항의 근거 claim이 업적에 없으면 그 문항은 싣지 않는다(기념관 build.ts와 같은 거름).
 * ★ 근거노트 카드는 O 문항에서만 만든다. X 문항(헷갈리기 쉬운 문장)은 문제 화면 밖으로 나가지 않는다.
 * ★ 단원은 성남시장 시절 → 경기도지사 시절 → 이재명 정부 순서로, 같은 시기 안에서는 일이 시작된 순서로 선다(eras.ts).
 */
import { getPublishedAchievements } from "@/content/achievements";
import { ACHIEVEMENT_OX } from "@/content/study/ox";
import type { Claim } from "@/content/schema";

import { ACHIEVEMENT_ERA, ERAS, eraKey, eraRank } from "./eras";
import type { AssertionKind, EvidenceCard, StudyBank, StudyItem, StudyUnit } from "./types";

/** 약한 층이 앞이다 — 카드에는 근거 claim들 가운데 가장 약한 층을 적는다. */
const WEAKEST: AssertionKind[] = ["OPINION", "CLAIM", "INTERPRETATION", "FACT"];

export function cardOf(statement: string, claims: Claim[], anchor: string): EvidenceCard | null {
  if (claims.length === 0 || claims.some((c) => !c.verified)) return null;
  const type = WEAKEST.find((t) => claims.some((c) => c.assertionType === t)) ?? "FACT";
  const by = type === "CLAIM" ? claims.find((c) => c.assertionType === "CLAIM")?.assertedBy : undefined;
  return { text: statement, type, ...(by ? { by } : {}), anchor };
}

export function buildStudyBank(): StudyBank {
  const units: StudyUnit[] = [];
  const keys = new Map<string, string>();
  const items: StudyItem[] = [];
  const missing: string[] = [];
  for (const a of getPublishedAchievements()) {
    const ox = ACHIEVEMENT_OX[a.slug];
    if (!ox?.length) continue;
    const unit = `a:${a.slug}`;
    const mine: StudyItem[] = [];
    for (const q of ox) {
      const claims = q.claimIds.map((id) => a.claims.find((c) => c.id === id));
      if (claims.some((c) => !c)) continue;
      const anchors = q.claimIds.map((id) => `${a.slug}#${id}`);
      mine.push({
        id: `${unit}/${q.id}`,
        unit,
        step: "know",
        skill: "A0",
        kind: "ox",
        statement: q.statement,
        answer: q.answer,
        explain: q.explain,
        anchors,
        card: q.answer ? cardOf(q.statement, claims as Claim[], anchors[0]) : null,
      });
    }
    if (!mine.length) continue;
    const era = ACHIEVEMENT_ERA[a.slug];
    if (!era) {
      missing.push(a.slug);
      continue;
    }
    keys.set(unit, `${eraRank(era)}|${eraKey(era, a.timeline.map((t) => t.date))}|${a.slug}`);
    units.push({ id: unit, course: "achievement", era, eraLabel: ERAS[eraRank(era)].label, title: a.title, kicker: a.kicker, href: `/achievement/${a.slug}` });
    items.push(...mine);
  }
  // 문항이 있는데 시기를 정하지 않은 업적 — 길의 어디에 둘지 모른다. 빌드를 세운다.
  if (missing.length) throw new Error(`잼공: 시기를 정하지 않은 업적 — src/features/study/eras.ts에 적는다: ${missing.join(", ")}`);
  units.sort((a, b) => keys.get(a.id)!.localeCompare(keys.get(b.id)!));
  return { units, items, starter: starterOf(items) };
}

/** 첫 3분의 세 문제 — 카드가 되는 O 문항 가운데 문장+풀이가 짧은 것, 단원마다 하나. 같은 길이면 id 순(빌드마다 같다). */
export function starterOf(items: StudyItem[], n = 3): string[] {
  const out: StudyItem[] = [];
  const sorted = items
    .filter((i) => i.answer && i.card)
    .sort((a, b) => a.statement.length + a.explain.length - (b.statement.length + b.explain.length) || a.id.localeCompare(b.id));
  for (const i of sorted) if (out.length < n && !out.some((o) => o.unit === i.unit)) out.push(i);
  return out.map((i) => i.id);
}

/** 원본 페이지에 심는 확인 문제 한 개 — 잼공 문항과 같은 id라서 푼 기록이 잼공 상자에 그대로 쌓인다. */
export interface PageQuizItem {
  /** 잼공 문항 id `a:<slug>/<ox id>`. */
  id: string;
  slug: string;
  title: string;
  statement: string;
  answer: boolean;
  explain: string;
  /** O 문항이면 근거노트 카드가 된다. */
  card: boolean;
}

/**
 * 업적 slug들의 확인 문제. 문항 은행(buildStudyBank)과 같은 거름을 쓴다 — 근거 claim이 없으면 싣지 않는다.
 * 업적·카르텔·언행·위키 페이지가 서버에서 부른다. 한 업적에서 넷까지.
 */
export function pageQuizItems(slugs: readonly string[]): PageQuizItem[] {
  const want = new Set(slugs);
  const out: PageQuizItem[] = [];
  for (const i of buildStudyBank().items) {
    const slug = i.unit.slice(2);
    if (!want.has(slug)) continue;
    const a = getPublishedAchievements().find((x) => x.slug === slug);
    if (!a) continue;
    out.push({ id: i.id, slug, title: a.title, statement: i.statement, answer: i.answer, explain: i.explain, card: Boolean(i.card) });
  }
  return out;
}
