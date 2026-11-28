/**
 * 잼공 문항 검사 — `pnpm validate`가 부른다(docs/jamgong-roadmap.md §6 R1).
 *
 * 기계로 볼 수 있는 것:
 *   1. 문항 id가 겹치지 않는다(잼공 상자 기록이 이 id에 붙는다).
 *   2. 근거 앵커(claimIds)가 그 업적에 실재한다.
 *   3. O 문항(참인 문장)의 근거는 모두 확인된(verified) claim이다.
 *   4. O 문항의 근거에 주장(CLAIM)이 있으면, 문장에 주장한 사람이 나온다 — 주장을 사실처럼 쓰지 않는다.
 *   5. 근거가 해석·의견(INTERPRETATION·OPINION)뿐인 O 문항은 없다 — 해석을 "맞다"로 외우게 하지 않는다.
 *
 * 읽어야 아는 것(풀이가 근거로 바로잡는가, 실제로 도는 오해인가)은 에이전트·사람이 본다 — docs/jamgong-ox-review.md.
 */
import type { Policy } from "../policies/schema";
import type { Achievement, Claim } from "../schema";
import { DEBATE_ITEMS, debateItemSchema, type DebateItem } from "./debate";
import { WEAKNESS_ITEMS, weaknessItemSchema, type WeaknessItem } from "./weakness";
import { NUMBER_ITEMS, numberItemSchema, type NumberItem, type NumberKind } from "./numbers";
import { ACHIEVEMENT_OX, type OxItem } from "./ox";
import { SORT_ITEMS, sortItemSchema, type SortItem } from "./sort";

/** "국제통화기금(IMF)", "대한민국 정부"처럼 긴 이름도 문장에서 한 낱말로 불리면 된다. */
function names(by: string): string[] {
  return by
    .split(/[\s()·,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && t !== "대한민국");
}

export function validateStudy(achievements: Achievement[], ox: Record<string, OxItem[]> = ACHIEVEMENT_OX): string[] {
  const errors: string[] = [];
  const bySlug = new Map(achievements.map((a) => [a.slug, a]));
  for (const [slug, items] of Object.entries(ox)) {
    const a = bySlug.get(slug);
    if (!a) {
      errors.push(`잼공 ${slug}: 없는 업적의 문항`);
      continue;
    }
    const ids = new Set<string>();
    for (const q of items) {
      const where = `잼공 ${slug}/${q.id}`;
      if (ids.has(q.id)) errors.push(`${where}: 문항 id가 겹친다`);
      ids.add(q.id);
      const claims = q.claimIds.map((id) => a.claims.find((c) => c.id === id));
      const missing = q.claimIds.filter((_, k) => !claims[k]);
      if (missing.length) {
        errors.push(`${where}: 없는 claim ${missing.join(", ")}`);
        continue;
      }
      if (!q.answer) continue;
      const found = claims as Claim[];
      for (const c of found) if (!c.verified) errors.push(`${where}: 확인 전 claim(${c.id})을 O 문항의 근거로 썼다`);
      for (const c of found.filter((x) => x.assertionType === "CLAIM")) {
        const by = c.assertedBy ?? "";
        if (!names(by).some((name) => q.statement.includes(name))) {
          errors.push(`${where}: 근거가 「${by}」의 주장(${c.id})인데 문장에 주장한 사람이 없다 — 주장을 사실처럼 쓰지 않는다`);
        }
      }
      if (found.every((c) => c.assertionType === "INTERPRETATION" || c.assertionType === "OPINION")) {
        errors.push(`${where}: 근거가 해석·의견뿐인 O 문항 — 해석을 사실처럼 외우게 하지 않는다`);
      }
    }
  }
  return errors;
}

/** 문항 수 — 통과 줄에 적는다. */
export function studyCount(): { items: number; units: number; sort: number; numbers: number; debate: number; weakness: number } {
  const all = Object.values(ACHIEVEMENT_OX);
  return {
    items: all.reduce((n, xs) => n + xs.length, 0),
    units: all.length,
    sort: SORT_ITEMS.length,
    numbers: NUMBER_ITEMS.length,
    debate: DEBATE_ITEMS.length,
    weakness: WEAKNESS_ITEMS.length,
  };
}

// ── 2단계 「가리기」 (docs/jamgong-roadmap.md R2) ─────────────────────

/** "누가 말했다"를 뺐는지 — core에 남으면 안 되는 말. */
const ATTRIBUTION = /밝혔|라고 했|에 따르면|설명했|주장했|강조했|발표했/;
/** from에 답이 새면 안 된다. */
const ANSWER_WORDS = /사실|주장|해석|의견/;

/**
 * 사실·주장 가리기 검사.
 *   1. 모양(zod), id가 겹치지 않는다.
 *   2. 근거 claim이 실재하고 확인된(verified) 것이다.
 *   3. 정답(type)이 원본 claim의 층과 같다 — 문항이 층을 바꾸지 않는다.
 *   4. CLAIM이면 주장한 쪽(by)이 원본 assertedBy와 같다.
 *   5. core에 "누가 말했다"가 남지 않았고, from에 답이 새지 않았다.
 */
export function validateSort(achievements: Achievement[], policies: Policy[], items: SortItem[] = SORT_ITEMS): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const q of items) {
    const where = `잼공 가리기 ${q.unit}/${q.id}`;
    const parsed = sortItemSchema.safeParse(q);
    if (!parsed.success) {
      errors.push(`${where}: 모양 — ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join(", ")}`);
      continue;
    }
    if (ids.has(q.id)) errors.push(`${where}: 문항 id가 겹친다`);
    ids.add(q.id);
    const slug = q.unit.slice(2);
    const claims = q.unit.startsWith("a:") ? achievements.find((a) => a.slug === slug)?.claims : policies.find((p) => p.slug === slug)?.claims;
    const claim = claims?.find((c) => c.id === q.claimId);
    if (!claim) {
      errors.push(`${where}: 없는 claim ${q.claimId}`);
      continue;
    }
    if (!claim.verified) errors.push(`${where}: 확인 전 claim을 썼다`);
    if (claim.assertionType !== q.type) errors.push(`${where}: 정답 ${q.type}이 원본 층 ${claim.assertionType}과 다르다`);
    if (q.type === "CLAIM" && q.by !== claim.assertedBy) errors.push(`${where}: 주장한 쪽 「${q.by ?? ""}」이 원본 「${claim.assertedBy ?? ""}」과 다르다`);
    if (ATTRIBUTION.test(q.core)) errors.push(`${where}: core에 "누가 말했다"가 남았다 — ${q.core}`);
    if (!q.core.endsWith("다.")) errors.push(`${where}: core는 "다."로 끝나는 한 문장이다`);
    if (ANSWER_WORDS.test(q.from)) errors.push(`${where}: from에 답이 샌다 — ${q.from}`);
  }
  return errors;
}

/** 숫자의 성격을 가르는 단서 낱말. 근거 claim 문장에 그 갈래의 낱말이 하나는 있어야 한다. */
const NUMBER_CUES: Record<NumberKind, RegExp> = {
  actual: /./,
  provisional: /잠정|누적|집계|기준|현재|중간/,
  forecast: /전망|예상|추정|역산|추산|예측|내다|분석한 결과|의 계산/,
  target: /목표|계획|추진|예산|하겠|할 예정|투입|하기로 했/,
};
/** 확정된 실적이라면서 근거가 전망·목표·잠정을 말하면 의심한다. */
const NOT_ACTUAL = /전망치|예상치|추정치|목표치|잠정치|잠정 집계|전망했|목표로/;

/**
 * 숫자 읽기 검사.
 *   1. 모양, id 겹침.
 *   2. 업적·핵심 숫자·근거 claim이 실재하고, 핵심 숫자가 그 claim을 가리키며, claim이 확인된 것이다.
 *   3. 고른 성격(kind)의 단서 낱말이 근거 문장에 있다. 실적이라면 전망·목표·잠정을 말하는 근거가 아니다.
 */
export function validateNumbers(achievements: Achievement[], items: NumberItem[] = NUMBER_ITEMS): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const q of items) {
    const where = `잼공 숫자 ${q.unit}/${q.id}`;
    const parsed = numberItemSchema.safeParse(q);
    if (!parsed.success) {
      errors.push(`${where}: 모양 — ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join(", ")}`);
      continue;
    }
    if (ids.has(q.id)) errors.push(`${where}: 문항 id가 겹친다`);
    ids.add(q.id);
    const a = achievements.find((x) => x.slug === q.unit.slice(2));
    const key = a?.keyNumbers.find((k) => k.id === q.keyNumberId);
    const claim = a?.claims.find((c) => c.id === q.claimId);
    if (!a || !key || !claim) {
      errors.push(`${where}: 없는 업적·핵심 숫자·claim`);
      continue;
    }
    if (key.claimId !== q.claimId) errors.push(`${where}: 핵심 숫자 ${q.keyNumberId}의 근거는 ${key.claimId}다`);
    if (!claim.verified) errors.push(`${where}: 확인 전 claim을 썼다`);
    const text = `${claim.text} ${key.caption ?? ""}`;
    if (!NUMBER_CUES[q.kind].test(text)) errors.push(`${where}: ${q.kind}라는 단서가 근거 문장에 없다`);
    if (q.kind === "actual" && NOT_ACTUAL.test(text)) errors.push(`${where}: 실적이라는데 근거가 전망·목표·잠정을 말한다`);
  }
  return errors;
}

// ── 4단계 「답하기」 (docs/jamgong-roadmap.md R3) ─────────────────────

/**
 * 쟁점에 답하기 검사.
 *   1. 모양, id 겹침, 반론 하나에 문항 하나.
 *   2. 반론이 실재한다. 근거(evidence)는 그 반론의 claimIds 가운데 하나다.
 *   3. 오답 근거(decoys)는 같은 업적의 claim이되 반론의 claimIds가 아니다 — 근거와 섞이면 정답이 둘이 된다.
 *   4. 모두 확인된(verified) claim이고, 보기 셋의 claim·글이 서로 다르다.
 */
export function validateDebate(achievements: Achievement[], items: DebateItem[] = DEBATE_ITEMS): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const cps = new Set<string>();
  for (const q of items) {
    const where = `잼공 쟁점 ${q.unit}/${q.id}`;
    const parsed = debateItemSchema.safeParse(q);
    if (!parsed.success) {
      errors.push(`${where}: 모양 — ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join(", ")}`);
      continue;
    }
    if (ids.has(q.id)) errors.push(`${where}: 문항 id가 겹친다`);
    ids.add(q.id);
    const key = `${q.unit}#${q.counterpointId}`;
    if (cps.has(key)) errors.push(`${where}: 같은 반론의 문항이 둘이다`);
    cps.add(key);
    const a = achievements.find((x) => x.slug === q.unit.slice(2));
    const cp = a?.counterpoints.find((c) => c.id === q.counterpointId);
    if (!a || !cp) {
      errors.push(`${where}: 없는 업적·반론`);
      continue;
    }
    if (!cp.claimIds.includes(q.evidence.claimId)) errors.push(`${where}: 근거 ${q.evidence.claimId}가 반론의 근거(claimIds)가 아니다`);
    for (const d of q.decoys) if (cp.claimIds.includes(d.claimId)) errors.push(`${where}: 오답 근거 ${d.claimId}가 반론의 근거다 — 정답이 둘이 된다`);
    const picks = [q.evidence, ...q.decoys];
    for (const p of picks) {
      const c = a.claims.find((x) => x.id === p.claimId);
      if (!c) errors.push(`${where}: 없는 claim ${p.claimId}`);
      else if (!c.verified) errors.push(`${where}: 확인 전 claim ${p.claimId}`);
    }
    if (new Set(picks.map((p) => p.claimId)).size !== 3 || new Set(picks.map((p) => p.label)).size !== 3) errors.push(`${where}: 보기 셋이 겹친다`);
  }
  return errors;
}

/**
 * 약점 먼저 말하기 검사.
 *   1. 모양, id 겹침.
 *   2. 비판(critique)은 그 정책의 critiqueIds 가운데 하나이고, 오답(decoys)은 critiqueIds가 아니다.
 *   3. 모두 확인된 claim이고 보기 셋이 서로 다르다.
 */
export function validateWeakness(policies: Policy[], items: WeaknessItem[] = WEAKNESS_ITEMS): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const q of items) {
    const where = `잼공 약점 ${q.unit}/${q.id}`;
    const parsed = weaknessItemSchema.safeParse(q);
    if (!parsed.success) {
      errors.push(`${where}: 모양 — ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join(", ")}`);
      continue;
    }
    if (ids.has(q.id)) errors.push(`${where}: 문항 id가 겹친다`);
    ids.add(q.id);
    const p = policies.find((x) => x.slug === q.unit.slice(2));
    if (!p) {
      errors.push(`${where}: 없는 정책`);
      continue;
    }
    if (!p.critiqueIds.includes(q.critique.claimId)) errors.push(`${where}: ${q.critique.claimId}는 비판·한계(critiqueIds)가 아니다`);
    for (const d of q.decoys) if (p.critiqueIds.includes(d.claimId)) errors.push(`${where}: 오답 ${d.claimId}도 비판·한계다 — 정답이 둘이 된다`);
    const picks = [q.critique, ...q.decoys];
    for (const x of picks) {
      const c = p.claims.find((y) => y.id === x.claimId);
      if (!c) errors.push(`${where}: 없는 claim ${x.claimId}`);
      else if (!c.verified) errors.push(`${where}: 확인 전 claim ${x.claimId}`);
    }
    if (new Set(picks.map((x) => x.claimId)).size !== 3 || new Set(picks.map((x) => x.label)).size !== 3) errors.push(`${where}: 보기 셋이 겹친다`);
  }
  return errors;
}
