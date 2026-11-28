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
import { DEBATE_ITEMS, type Skeleton } from "@/content/study/debate";
import { WEAKNESS_ITEMS } from "@/content/study/weakness";
import { CHECK_ITEMS, HEADLINE_ITEMS, LEAP_ITEMS, WEIGHT_ITEMS, type Leap, type WeightAnswer } from "@/content/study/weigh";
import { STATEMENTS } from "@/content/words";
import { SPEECH_PARTS } from "@/content/study/speech";
import { isQuestion, VERDICT_LABEL, VERDICTS, type Verdict, type VerdictValue } from "@/content/policies/verdicts";
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
  const level3 = levelThreeItems([...units, ...level2.units]);
  const level4 = levelFourItems([...units, ...level2.units, ...level3.units]);
  const rumors = rumorItems(VERDICTS, [...units, ...level2.units, ...level3.units, ...level4.units]);
  const before = [...units, ...level2.units, ...level3.units, ...level4.units, ...rumors.units];
  const level5 = levelFiveItems([...level4.items, ...rumors.items], before);
  return {
    units: [...before, ...level5.units],
    items: [...items, ...level2.items, ...level3.items, ...level4.items, ...rumors.items, ...level5.items],
    starter: starterOf(items),
  };
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

/** 답의 뼈대 네 보기. 마지막 "화제 돌리기"는 언제나 오답이다 — 하지 말아야 할 답을 익힌다. */
export const SKELETON_OPTIONS: Array<{ id: Skeleton | "dodge"; label: string; hint: string }> = [
  { id: "admit", label: "맞는 부분은 인정하고, 함께 볼 사실을 댄다", hint: "“맞아, 다만 …”" },
  { id: "correct", label: "사실과 다른 점을 근거로 바로잡는다", hint: "“그건 사실과 달라, …”" },
  { id: "unknown", label: "아직 모르는 건 모른다고 하고, 확인된 것만 말한다", hint: "“그건 아직 결론이 안 났어, …”" },
  { id: "dodge", label: "다른 이야기로 넘어간다", hint: "“그럼 저쪽은?”" },
];

/** 문항 id로 정한 순서 — 정답이 늘 같은 자리에 오지 않게. 빌드마다 같다. */
function shuffled<T>(xs: T[], seed: string): T[] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * 4단계 「답하기」 문항(docs/jamgong-roadmap.md R3) — 쟁점에 답하기(C1·C4)와 약점 먼저 말하기(C3).
 * 근거 claim이 없거나 확인 전이면 싣지 않는다.
 */
function levelFourItems(known: StudyUnit[]): { units: StudyUnit[]; items: StudyItem[] } {
  const achievements = new Map(getPublishedAchievements().map((a) => [a.slug, a]));
  const policies = new Map(POLICIES.map((p) => [p.slug, p]));
  const units: StudyUnit[] = [];
  const items: StudyItem[] = [];

  for (const q of DEBATE_ITEMS) {
    const a = achievements.get(q.unit.slice(2));
    const cp = a?.counterpoints.find((c) => c.id === q.counterpointId);
    if (!a || !cp || !known.some((u) => u.id === q.unit)) continue;
    const picks = [q.evidence, ...q.decoys];
    if (picks.some((p) => !a.claims.find((c) => c.id === p.claimId)?.verified)) continue;
    const order = shuffled(picks, `${q.unit}/${q.id}`);
    items.push({
      id: `${q.unit}/${q.id}`,
      unit: q.unit,
      step: "counter",
      skill: "C1",
      kind: "debate",
      statement: q.message,
      answer: true,
      debate: {
        message: q.message,
        skeleton: {
          options: SKELETON_OPTIONS.map(({ label, hint }) => ({ label, hint })),
          correct: SKELETON_OPTIONS.findIndex((o) => o.id === q.skeleton),
          why: q.why,
        },
        evidence: { options: order.map((p) => p.label), correct: order.indexOf(q.evidence) },
        response: cp.response,
        href: `/achievement/${a.slug}#counterpoint`,
      },
      explain: q.why,
      anchors: cp.claimIds.map((id) => `${a.slug}#${id}`),
      card: null,
    });
  }

  for (const q of WEAKNESS_ITEMS) {
    const p = policies.get(q.unit.slice(2));
    if (!p) continue;
    const critique = p.claims.find((c) => c.id === q.critique.claimId);
    if (!critique?.verified || !p.critiqueIds.includes(critique.id)) continue;
    if (q.decoys.some((d) => !p.claims.find((c) => c.id === d.claimId)?.verified || p.critiqueIds.includes(d.claimId))) continue;
    if (!known.some((u) => u.id === q.unit) && !units.some((u) => u.id === q.unit)) {
      units.push({ id: q.unit, course: "policy", era: "government", eraLabel: ERAS[eraRank("government")].label, title: p.title, kicker: "정부 정책", href: `/wiki/policy/${p.slug}` });
    }
    const picks = [q.critique, ...q.decoys];
    const order = shuffled(picks, `${q.unit}/${q.id}`);
    const anchor = `policy:${p.slug}#${critique.id}`;
    items.push({
      id: `${q.unit}/${q.id}`,
      unit: q.unit,
      step: "counter",
      skill: "C3",
      kind: "choice",
      statement: `「${p.title}」에 대해 나온 비판·한계는 어느 것일까요?`,
      answer: true,
      choice: {
        prompt: "상대가 꺼내기 전에 먼저 인정할 약점을 골라요.",
        options: order.map((x) => ({ label: x.label, hint: "" })),
        correct: order.indexOf(q.critique),
      },
      explain: `${q.why} 다른 둘은 이 정책의 사실이지만 비판·한계는 아니에요.`,
      anchors: [anchor],
      card: { text: q.critique.label, type: critique.assertionType, ...(critique.assertedBy ? { by: critique.assertedBy } : {}), anchor },
    });
  }
  return { units, items };
}

export const CHECK_OPTIONS = [
  { answer: "confirmed", label: "확인된 사실이에요", hint: "문서·통계·판결로 확인됐어요" },
  { answer: "unconfirmed", label: "아직 확인되지 않았어요", hint: "확인 못 했거나, 검증에 한계가 있어요" },
] as const;

export const WEIGHT_OPTIONS: Array<{ answer: WeightAnswer | "press"; label: string; hint: string }> = [
  { answer: "legislative", label: "법령·관보·국회 기록", hint: "법이 정한 것, 언제 통과·시행됐는지" },
  { answer: "statistics", label: "공식 통계", hint: "통계청·한국은행 같은 기관의 숫자" },
  { answer: "judicial", label: "판결문·수사 기록", hint: "법원이 무엇을 판단했는지" },
  { answer: "official", label: "정부·기관 공식 발표", hint: "보도자료·공식 계획·공고" },
  { answer: "press", label: "언론 기사", hint: "기자가 옮기거나 정리한 것" },
];

export const LEAP_OPTIONS: Array<{ leap: Leap; label: string; hint: string }> = [
  { leap: "plan-as-done", label: "계획·약속을 이미 한 일로", hint: "“하겠다”를 “했다”로" },
  { leap: "forecast-as-fact", label: "전망·추정을 확정된 것으로", hint: "“될 것”을 “됐다”로" },
  { leap: "part-as-whole", label: "일부를 전체로", hint: "“몇 곳”을 “모두”로" },
  { leap: "claim-as-fact", label: "한쪽의 말을 확인된 사실로", hint: "발표·해명을 그대로 사실로" },
  { leap: "cause", label: "함께 일어난 일을 원인으로", hint: "“같이 늘었다”를 “때문이다”로" },
];

export const HEADLINE_OPTIONS = [
  { verdict: "same", label: "제목이 근거와 같은 말을 해요", hint: "근거에 그대로 있어요" },
  { verdict: "stronger", label: "제목이 근거보다 세게 말해요", hint: "확정·전부·최초처럼 더 나갔어요" },
  { verdict: "different", label: "제목이 근거와 다른 말을 해요", hint: "근거가 말하지 않은 쪽을 말해요" },
] as const;

/**
 * 3단계 「따지기」 문항(docs/jamgong-roadmap.md R4) — 확인 수준(A2)·자료의 무게(A4)·비약 찾기(B1)·제목과 근거(B2).
 * 근거가 없거나 어긋나면 싣지 않는다(검사는 src/content/study/validate.ts).
 */
function levelThreeItems(known: StudyUnit[]): { units: StudyUnit[]; items: StudyItem[] } {
  const achievements = new Map(getPublishedAchievements().map((a) => [a.slug, a]));
  const policies = new Map(POLICIES.map((p) => [p.slug, p]));
  const words = new Map((STATEMENTS as Array<{ slug: string; title: string }>).map((w) => [w.slug, w]));
  const units: StudyUnit[] = [];
  const items: StudyItem[] = [];
  const gov = { era: "government" as const, eraLabel: ERAS[eraRank("government")].label };
  const ensure = (unit: string): boolean => {
    if (known.some((u) => u.id === unit) || units.some((u) => u.id === unit)) return true;
    const slug = unit.slice(2);
    if (unit.startsWith("p:")) {
      const p = policies.get(slug);
      if (!p) return false;
      units.push({ id: unit, course: "policy", ...gov, title: p.title, kicker: "정부 정책", href: `/wiki/policy/${slug}` });
      return true;
    }
    if (unit.startsWith("w:")) {
      const w = words.get(slug);
      if (!w) return false;
      units.push({ id: unit, course: "words", ...gov, title: w.title, kicker: "말과 연설", href: `/words/${slug}` });
      return true;
    }
    return false;
  };
  const claimOf = (unit: string, claimId: string) =>
    unit.startsWith("a:") ? achievements.get(unit.slice(2))?.claims.find((c) => c.id === claimId) : policies.get(unit.slice(2))?.claims.find((c) => c.id === claimId);
  const anchorOf = (unit: string, claimId: string) => (unit.startsWith("a:") ? `${unit.slice(2)}#${claimId}` : `policy:${unit.slice(2)}#${claimId}`);
  const base = (unit: string, id: string, skill: StudyItem["skill"], statement: string, explain: string, anchors: string[]): StudyItem => ({
    id: `${unit}/${id}`,
    unit,
    step: "source",
    skill,
    kind: "choice",
    statement,
    answer: true,
    explain,
    anchors,
    card: null,
  });

  for (const q of CHECK_ITEMS) {
    if (!ensure(q.unit)) continue;
    const anchor = q.kind === "gap" ? `policy:${q.unit.slice(2)}` : anchorOf(q.unit, q.claimId ?? "");
    const it = base(q.unit, q.id, "A2", q.statement, q.clue, [anchor]);
    it.choice = {
      prompt: "이 말은 지금 확인된 걸까요?",
      options: CHECK_OPTIONS.map(({ label, hint }) => ({ label, hint })),
      correct: CHECK_OPTIONS.findIndex((o) => o.answer === q.answer),
    };
    if (q.kind === "verified") it.card = { text: q.statement, type: "FACT", anchor };
    items.push(it);
  }
  for (const q of WEIGHT_ITEMS) {
    const claim = claimOf(q.unit, q.claimId);
    if (!claim?.verified || !ensure(q.unit)) continue;
    const anchor = anchorOf(q.unit, q.claimId);
    const it = base(q.unit, q.id, "A4", q.statement, q.clue, [anchor]);
    it.choice = {
      prompt: "이 말을 가장 단단히 확정해 주는 자료는?",
      options: WEIGHT_OPTIONS.map(({ label, hint }) => ({ label, hint })),
      correct: WEIGHT_OPTIONS.findIndex((o) => o.answer === q.answer),
    };
    items.push(it);
  }
  for (const q of LEAP_ITEMS) {
    let unit: string;
    let anchors: string[];
    if (q.source === "caveat") {
      if (!q.slug) continue;
      unit = `w:${q.slug}`;
      anchors = [`words:${q.slug}`];
    } else {
      const a = q.unit ? achievements.get(q.unit.slice(2)) : undefined;
      const ox = a ? ACHIEVEMENT_OX[a.slug]?.find((x) => x.id === q.oxId) : undefined;
      if (!a || !ox || !q.unit) continue;
      unit = q.unit;
      anchors = ox.claimIds.map((id) => `${a.slug}#${id}`);
    }
    if (!ensure(unit)) continue;
    const it = base(unit, q.id, "B1", q.overreach, q.clue, anchors);
    it.choice = {
      prompt: "이 말은 어디서 근거보다 더 나갔을까요?",
      options: LEAP_OPTIONS.map(({ label, hint }) => ({ label, hint })),
      correct: LEAP_OPTIONS.findIndex((o) => o.leap === q.leap),
    };
    items.push(it);
  }
  for (const q of HEADLINE_ITEMS) {
    const slug = q.unit.slice(2);
    const sources = q.unit.startsWith("a:") ? achievements.get(slug)?.sources : policies.get(slug)?.sources;
    const source = sources?.find((x) => x.id === q.sourceId);
    const claim = claimOf(q.unit, q.claimId);
    if (!source || !claim?.verified || !ensure(q.unit)) continue;
    const it = base(q.unit, q.id, "B2", `“${source.title}”`, q.clue, [anchorOf(q.unit, q.claimId)]);
    it.choice = {
      prompt: "기사 제목과 근거를 견줘 보세요.",
      from: source.publisher,
      evidence: claim.text,
      options: HEADLINE_OPTIONS.map(({ label, hint }) => ({ label, hint })),
      correct: HEADLINE_OPTIONS.findIndex((o) => o.verdict === q.verdict),
    };
    items.push(it);
  }
  return { units, items };
}

const VERDICT_ORDER: VerdictValue[] = ["true", "partly", "false", "official-only", "unknown"];

const VERDICT_HINT: Record<VerdictValue, string> = {
  true: "확인된 자료가 그대로 뒷받침해요",
  partly: "맞는 데와 틀리거나 부풀린 데가 섞였어요",
  false: "확인된 사실과 어긋나요",
  "official-only": "부처가 설명했지만 따로 확인된 건 아니에요",
  unknown: "지금 자료로는 맞다 틀리다를 가릴 수 없어요",
};

/** 판정 → 지인에게 답할 때의 뼈대. 사실이면 인정, 틀렸으면 바로잡기, 해명뿐이거나 모르면 모른다. */
const VERDICT_SKELETON: Record<VerdictValue, Skeleton> = {
  true: "admit",
  partly: "admit",
  false: "correct",
  "official-only": "unknown",
  unknown: "unknown",
};

/**
 * 도는 말 문항(docs/jamgong-roadmap.md R5) — **사람이 승인한 판정만** 쓴다(verdicts.ts의 approved).
 *   3단계 「이 말, 맞을까?」(C2): 도는 말을 보고 다섯 판정 가운데 고른다. 풀이는 승인된 판정의 note.
 *   4단계 대화 답장(C2): 지인이 그 말을 보내면 ① 답의 뼈대(판정에서) ② 근거(이어진 claim) → 판정 note가 모범 답.
 * 승인 전에는 문항이 하나도 생기지 않는다.
 */
export function rumorItems(verdicts: Record<string, Verdict>, known: StudyUnit[]): { units: StudyUnit[]; items: StudyItem[] } {
  const units: StudyUnit[] = [];
  const items: StudyItem[] = [];
  for (const [key, v] of Object.entries(verdicts)) {
    if (!v.approved) continue;
    const [slug, rumorId] = key.split("#");
    const p = POLICIES.find((x) => x.slug === slug);
    const rumor = p?.rumors.find((r) => r.id === rumorId);
    if (!p || !rumor || isQuestion(rumor.text)) continue;
    const unit = `p:${slug}`;
    if (!known.some((u) => u.id === unit) && !units.some((u) => u.id === unit)) {
      units.push({ id: unit, course: "policy", era: "government", eraLabel: ERAS[eraRank("government")].label, title: p.title, kicker: "정부 정책", href: `/wiki/policy/${slug}` });
    }
    const anchors = rumor.claimIds.map((id) => `policy:${slug}#${id}`);
    items.push({
      id: `${unit}/v-${rumorId}`,
      unit,
      step: "source",
      skill: "C2",
      kind: "choice",
      statement: `“${rumor.text}”`,
      answer: true,
      choice: {
        prompt: "SNS에서 도는 말이에요. 맞을까요?",
        options: VERDICT_ORDER.map((x) => ({ label: VERDICT_LABEL[x], hint: VERDICT_HINT[x] })),
        correct: VERDICT_ORDER.indexOf(v.value),
      },
      explain: v.note,
      anchors,
      card: null,
    });
    // 대화 답장 — 근거 하나(이어진 확인된 claim)와 같은 정책의 다른 사실 둘.
    const linked = rumor.claimIds.map((id) => p.claims.find((c) => c.id === id)).filter((c): c is Claim => Boolean(c?.verified));
    const others = p.claims.filter((c) => c.verified && !rumor.claimIds.includes(c.id)).slice(0, 2);
    if (linked.length === 0 || others.length < 2) continue;
    const short = (t: string) => (t.length > 60 ? `${t.slice(0, 58)}…` : t);
    const picks = [linked[0], ...others];
    const order = shuffled(picks, `${unit}/r-${rumorId}`);
    items.push({
      id: `${unit}/r-${rumorId}`,
      unit,
      step: "counter",
      skill: "C2",
      kind: "debate",
      statement: rumor.text,
      answer: true,
      debate: {
        message: rumor.text.length > 70 ? `${rumor.text.slice(0, 68)}…` : rumor.text,
        skeleton: {
          options: SKELETON_OPTIONS.map(({ label, hint }) => ({ label, hint })),
          correct: SKELETON_OPTIONS.findIndex((o) => o.id === VERDICT_SKELETON[v.value]),
          why: `판정은 「${VERDICT_LABEL[v.value]}」예요. ${v.note}`,
        },
        evidence: { options: order.map((c) => short(c.text)), correct: order.indexOf(linked[0]) },
        response: v.note,
        href: `/wiki/policy/${slug}`,
      },
      explain: v.note,
      anchors,
      card: null,
    });
  }
  return { units, items };
}

/**
 * 5단계 「말하기」(docs/jamgong-roadmap.md R6).
 *   직접 말하기·쓰기(C4): 4단계 쟁점·도는 말 대화 답장의 메시지에 이번엔 보기 없이 내 말로 답한다.
 *     모범 답은 4단계와 같은 답이고, 견주는 것은 네 칸 점검표다(AI가 채점하지 않는다).
 *     id는 4단계 문항의 `d<n>`→`t<n>`, `r-<도는 말>`→`t-<도는 말>` — 같은 쟁점이 단계를 건너 이어진다.
 *   말의 뼈대(B3): 연설·글의 이어진 문장을 주장·근거·예시로 가른다(src/content/study/speech.ts).
 */
export function levelFiveItems(prior: StudyItem[], known: StudyUnit[]): { units: StudyUnit[]; items: StudyItem[] } {
  const units: StudyUnit[] = [];
  const items: StudyItem[] = [];
  for (const d of prior) {
    if (d.kind !== "debate" || !d.debate) continue;
    const id = d.id.replace(/\/d([0-9]+)$/, "/t$1").replace(/\/r-/, "/t-");
    if (id === d.id) continue;
    items.push({
      id,
      unit: d.unit,
      step: "speak",
      skill: "C4",
      kind: "say",
      statement: d.debate.message,
      answer: true,
      say: { message: d.debate.message, response: d.debate.response, href: d.debate.href },
      explain: d.debate.skeleton.why,
      anchors: d.anchors,
      card: null,
    });
  }
  const words = new Map(STATEMENTS.map((w) => [w.slug, w]));
  for (const q of SPEECH_PARTS) {
    const w = words.get(q.slug);
    if (!w?.body) continue;
    const unit = `w:${q.slug}`;
    if (!known.some((u) => u.id === unit) && !units.some((u) => u.id === unit)) {
      units.push({ id: unit, course: "words", era: "government", eraLabel: ERAS[eraRank("government")].label, title: w.title, kicker: "말과 연설", href: `/words/${q.slug}` });
    }
    items.push({
      id: `${unit}/${q.id}`,
      unit,
      step: "speak",
      skill: "B3",
      kind: "parts",
      statement: "문장마다 주장·근거·예시를 골라 봐요.",
      answer: true,
      parts: { sentences: q.parts, why: q.why, href: `/words/${q.slug}` },
      explain: q.why,
      anchors: [`words:${q.slug}`],
      card: null,
    });
  }
  return { units, items };
}
