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
import { POLICIES } from "@/content/policies";
import { NUMBER_ITEMS, NUMBER_KIND_LABEL, type NumberKind } from "@/content/study/numbers";
import { SORT_ITEMS } from "@/content/study/sort";
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
  const level2 = levelTwoItems(units);
  return { units: [...units, ...level2.units], items: [...items, ...level2.items], starter: starterOf(items) };
}

/** 사실·주장 가리기의 네 보기. 늘 같은 순서 — 갈래를 익히게 한다. */
export const SORT_OPTIONS: Array<{ type: AssertionKind; label: string; hint: string }> = [
  { type: "FACT", label: "확인된 사실", hint: "문서·통계·판결로 확정된 일" },
  { type: "CLAIM", label: "누군가의 주장", hint: "말한 쪽이 그렇다고 한 것(확인 전)" },
  { type: "INTERPRETATION", label: "해석·분석", hint: "왜·어떻게를 풀이한 것" },
  { type: "OPINION", label: "의견·평가", hint: "좋다·나쁘다는 판단" },
];

export const NUMBER_OPTIONS: Array<{ kind: NumberKind; label: string; hint: string }> = [
  { kind: "actual", label: NUMBER_KIND_LABEL.actual, hint: "이미 일어나 숫자가 굳은 것" },
  { kind: "provisional", label: NUMBER_KIND_LABEL.provisional, hint: "아직 바뀔 수 있는 중간 집계" },
  { kind: "forecast", label: NUMBER_KIND_LABEL.forecast, hint: "앞으로 그렇게 되리라는 셈" },
  { kind: "target", label: NUMBER_KIND_LABEL.target, hint: "그렇게 하겠다는 목표·예산" },
];

/**
 * 2단계 「가리기」 문항(docs/jamgong-roadmap.md R2) — 사실·주장 가리기(A1)와 숫자 읽기(A3).
 * 정부 정책에서 온 문항은 정책 단원(`p:<slug>`, 위키 정책 페이지)에 든다. 근거 claim이 없거나 확인 전이면 싣지 않는다.
 */
function levelTwoItems(achievementUnits: StudyUnit[]): { units: StudyUnit[]; items: StudyItem[] } {
  const achievements = new Map(getPublishedAchievements().map((a) => [a.slug, a]));
  const policies = new Map(POLICIES.map((p) => [p.slug, p]));
  const units: StudyUnit[] = [];
  const items: StudyItem[] = [];
  const claimOf = (unit: string, claimId: string): Claim | undefined => {
    const slug = unit.slice(2);
    return unit.startsWith("a:") ? achievements.get(slug)?.claims.find((c) => c.id === claimId) : policies.get(slug)?.claims.find((c) => c.id === claimId);
  };
  const anchorOf = (unit: string, claimId: string) => (unit.startsWith("a:") ? `${unit.slice(2)}#${claimId}` : `policy:${unit.slice(2)}#${claimId}`);
  const ensureUnit = (unit: string): boolean => {
    if (unit.startsWith("a:")) return achievementUnits.some((u) => u.id === unit);
    if (units.some((u) => u.id === unit)) return true;
    const p = policies.get(unit.slice(2));
    if (!p) return false;
    units.push({ id: unit, course: "policy", era: "government", eraLabel: ERAS[eraRank("government")].label, title: p.title, kicker: "정부 정책", href: `/wiki/policy/${p.slug}` });
    return true;
  };

  for (const q of SORT_ITEMS) {
    const claim = claimOf(q.unit, q.claimId);
    if (!claim || !claim.verified || claim.assertionType !== q.type || !ensureUnit(q.unit)) continue;
    const anchor = anchorOf(q.unit, q.claimId);
    items.push({
      id: `${q.unit}/${q.id}`,
      unit: q.unit,
      step: "understand",
      skill: "A1",
      kind: "choice",
      statement: q.core,
      answer: true,
      choice: {
        prompt: "이 문장은 어떤 말일까요?",
        from: q.from,
        options: SORT_OPTIONS.map(({ label, hint }) => ({ label: label === "누군가의 주장" && q.by ? `${q.by}의 주장` : label, hint })),
        correct: SORT_OPTIONS.findIndex((o) => o.type === q.type),
      },
      explain: `${q.clue} 전할 때는 이렇게: “${q.relay}”`,
      anchors: [anchor],
      card: { text: q.core, type: q.type, ...(q.by ? { by: q.by } : {}), anchor },
    });
  }

  for (const q of NUMBER_ITEMS) {
    const a = achievements.get(q.unit.slice(2));
    const claim = a?.claims.find((c) => c.id === q.claimId);
    const key = a?.keyNumbers.find((k) => k.id === q.keyNumberId);
    if (!a || !claim || !claim.verified || !key || key.claimId !== q.claimId || !ensureUnit(q.unit)) continue;
    items.push({
      id: `${q.unit}/${q.id}`,
      unit: q.unit,
      step: "understand",
      skill: "A3",
      kind: "choice",
      statement: q.question,
      answer: true,
      choice: {
        prompt: "이 숫자는 어떤 숫자일까요?",
        options: NUMBER_OPTIONS.map(({ label, hint }) => ({ label, hint })),
        correct: NUMBER_OPTIONS.findIndex((o) => o.kind === q.kind),
      },
      explain: q.clue,
      anchors: [anchorOf(q.unit, q.claimId)],
      card: null,
    });
  }
  return { units, items };
}

/** 첫 3분의 세 문제 — 카드가 되는 O 문항 가운데 문장+풀이가 짧은 것, 단원마다 하나. 같은 길이면 id 순(빌드마다 같다). */
export function starterOf(items: StudyItem[], n = 3): string[] {
  const out: StudyItem[] = [];
  const sorted = items
    .filter((i) => i.kind === "ox" && i.answer && i.card)
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
    if (i.kind !== "ox") continue;
    const slug = i.unit.slice(2);
    if (!want.has(slug)) continue;
    const a = getPublishedAchievements().find((x) => x.slug === slug);
    if (!a) continue;
    out.push({ id: i.id, slug, title: a.title, statement: i.statement, answer: i.answer, explain: i.explain, card: Boolean(i.card) });
  }
  return out;
}
