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
import {
  CHECK_ITEMS,
  checkItemSchema,
  HEADLINE_ITEMS,
  headlineItemSchema,
  LEAP_ITEMS,
  leapItemSchema,
  WEIGHT_ITEMS,
  weightItemSchema,
  type CheckItem,
  type HeadlineItem,
  type LeapItem,
  type WeightItem,
} from "./weigh";
import { NUMBER_ITEMS, numberItemSchema, type NumberItem, type NumberKind } from "./numbers";
import { ACHIEVEMENT_OX, oxItemSchema, type OxItem } from "./ox";
import { POLICY_OX } from "./policyOx";
import { SORT_ITEMS, sortItemSchema, type SortItem } from "./sort";
import { SPEECH_PARTS, speechPartsSchema, type SpeechParts } from "./speech";

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
export function studyCount(): { items: number; units: number; policyOx: number; policyUnits: number; sort: number; numbers: number; debate: number; weakness: number; weigh: number; speech: number } {
  const all = Object.values(ACHIEVEMENT_OX);
  return {
    items: all.reduce((n, xs) => n + xs.length, 0),
    units: all.length,
    policyOx: Object.values(POLICY_OX).reduce((n, xs) => n + xs.length, 0),
    policyUnits: Object.keys(POLICY_OX).length,
    sort: SORT_ITEMS.length,
    numbers: NUMBER_ITEMS.length,
    debate: DEBATE_ITEMS.length,
    weakness: WEAKNESS_ITEMS.length,
    weigh: CHECK_ITEMS.length + WEIGHT_ITEMS.length + LEAP_ITEMS.length + HEADLINE_ITEMS.length,
    speech: SPEECH_PARTS.length,
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

// ── 3단계 「따지기」 (docs/jamgong-roadmap.md R4) ─────────────────────

interface WeighInput {
  check?: CheckItem[];
  weight?: WeightItem[];
  leap?: LeapItem[];
  headline?: HeadlineItem[];
}

/**
 * 따지기 검사 — 정답이 근거에서 나오는지.
 *   확인 수준: verified → 확인된 claim이고 답이 "확인됨". unverified → verified:false claim이고 답이 "확인 안 됨".
 *             gap → 그 정책의 gaps에 실재하고 답이 "확인 안 됨".
 *   자료의 무게: claim이 확인된 것이고, 답(법령·통계·판결·공식)이 그 claim의 출처 종류 가운데 하나다.
 *   비약 찾기: caveat → 그 언행에 "오해하기 쉬운 대목"이 있다. x → 그 업적의 X 문항이다.
 *   제목과 근거: 출처가 언론이고, claim이 확인된 것이며 그 출처를 근거로 든다.
 * 모든 문항: 모양(zod)과 id 겹침.
 */
export function validateWeigh(
  achievements: Achievement[],
  policies: Policy[],
  statements: Array<{ slug: string; easy?: { caveat?: unknown } }>,
  input: WeighInput = { check: CHECK_ITEMS, weight: WEIGHT_ITEMS, leap: LEAP_ITEMS, headline: HEADLINE_ITEMS },
): string[] {
  const errors: string[] = [];
  const shape = <T,>(where: string, schema: { safeParse: (x: unknown) => { success: boolean; error?: { issues: Array<{ path: PropertyKey[]; message: string }> } } }, q: T) => {
    const r = schema.safeParse(q);
    if (!r.success) errors.push(`${where}: 모양 — ${r.error!.issues.map((i) => i.path.join(".") + " " + i.message).join(", ")}`);
    return r.success;
  };
  const claimIn = (unit: string, claimId: string) => {
    const slug = unit.slice(2);
    return unit.startsWith("a:") ? achievements.find((a) => a.slug === slug)?.claims.find((c) => c.id === claimId) : policies.find((p) => p.slug === slug)?.claims.find((c) => c.id === claimId);
  };
  const sourcesIn = (unit: string) => {
    const slug = unit.slice(2);
    return unit.startsWith("a:") ? achievements.find((a) => a.slug === slug)?.sources : policies.find((p) => p.slug === slug)?.sources;
  };
  const dup = (kind: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) errors.push(`잼공 ${kind}: 문항 id ${id}가 겹친다`);
      seen.add(id);
    }
  };

  for (const q of input.check ?? []) {
    const where = `잼공 확인 수준 ${q.unit}/${q.id}`;
    if (!shape(where, checkItemSchema, q)) continue;
    if (q.kind === "gap") {
      const p = policies.find((x) => x.slug === q.unit.slice(2));
      if (q.gapIndex === undefined || !p?.gaps[q.gapIndex]) errors.push(`${where}: 그 정책에 gaps[${q.gapIndex}]가 없다`);
      if (q.answer !== "unconfirmed") errors.push(`${where}: 확인 못 한 것(gap)은 답이 "확인 안 됨"이다`);
      continue;
    }
    const c = q.claimId ? claimIn(q.unit, q.claimId) : undefined;
    if (!c) {
      errors.push(`${where}: 없는 claim ${q.claimId}`);
      continue;
    }
    if (q.kind === "verified" && (!c.verified || q.answer !== "confirmed")) errors.push(`${where}: 확인된 claim이어야 하고 답은 "확인됨"이다`);
    if (q.kind === "unverified" && (c.verified || q.answer !== "unconfirmed")) errors.push(`${where}: 확인 전 claim이어야 하고 답은 "확인 안 됨"이다`);
  }
  dup("확인 수준", (input.check ?? []).map((q) => q.id));

  for (const q of input.weight ?? []) {
    const where = `잼공 자료의 무게 ${q.unit}/${q.id}`;
    if (!shape(where, weightItemSchema, q)) continue;
    const c = claimIn(q.unit, q.claimId);
    if (!c?.verified) {
      errors.push(`${where}: 없거나 확인 전인 claim ${q.claimId}`);
      continue;
    }
    const types = c.sourceIds.map((id) => sourcesIn(q.unit)?.find((x) => x.id === id)?.type);
    if (!types.includes(q.answer)) errors.push(`${where}: 답 ${q.answer}이 그 claim의 출처 종류(${types.join(",")})에 없다`);
  }
  dup("자료의 무게", (input.weight ?? []).map((q) => q.id));

  for (const q of input.leap ?? []) {
    const where = `잼공 비약 ${q.id}`;
    if (!shape(where, leapItemSchema, q)) continue;
    if (q.source === "caveat") {
      const st = statements.find((x) => x.slug === q.slug);
      if (!st?.easy?.caveat) errors.push(`${where}: 언행 ${q.slug}에 "오해하기 쉬운 대목"이 없다`);
    } else {
      const items = q.unit ? ACHIEVEMENT_OX[q.unit.slice(2)] : undefined;
      const ox = items?.find((x) => x.id === q.oxId);
      if (!ox) errors.push(`${where}: 없는 X 문항 ${q.unit}/${q.oxId}`);
      else if (ox.answer) errors.push(`${where}: O 문항은 비약이 아니다`);
    }
  }
  dup("비약", (input.leap ?? []).map((q) => q.id));

  for (const q of input.headline ?? []) {
    const where = `잼공 제목과 근거 ${q.unit}/${q.id}`;
    if (!shape(where, headlineItemSchema, q)) continue;
    const source = sourcesIn(q.unit)?.find((x) => x.id === q.sourceId);
    const c = claimIn(q.unit, q.claimId);
    if (!source || source.type !== "press") errors.push(`${where}: 언론 출처가 아니다(${q.sourceId})`);
    if (!c?.verified) errors.push(`${where}: 없거나 확인 전인 claim ${q.claimId}`);
    else if (!c.sourceIds.includes(q.sourceId)) errors.push(`${where}: claim ${q.claimId}이 그 기사를 근거로 들지 않는다`);
  }
  dup("제목과 근거", (input.headline ?? []).map((q) => q.id));
  return errors;
}

// ── 5단계 「말하기」 › 말의 뼈대 (docs/jamgong-roadmap.md R6) ────────────

/** 공백을 한 칸으로 — 원문 대조는 줄바꿈 차이만 너그럽게 본다. */
const squash = (t: string) => t.replace(/\s+/g, " ").trim();

/**
 * 말의 뼈대 검사.
 *   1. 모양, id가 겹치지 않는다, 언행이 있고 원문(body)이 있다.
 *   2. 문장마다 원문에 그대로 있고, 원문의 순서대로 이어진다(사이에 다른 문장이 끼지 않는다).
 *   3. 주장이 하나는 있고, 근거나 예시가 하나는 있다.
 */
export function validateSpeech(statements: Array<{ slug: string; body?: string }>, items: SpeechParts[] = SPEECH_PARTS): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const q of items) {
    const where = `말의 뼈대 ${q.id}`;
    const r = speechPartsSchema.safeParse(q);
    if (!r.success) {
      errors.push(`${where}: 모양 — ${r.error.issues.map((i) => i.path.join(".") + " " + i.message).join(", ")}`);
      continue;
    }
    if (seen.has(q.id)) errors.push(`${where}: id가 겹친다`);
    seen.add(q.id);
    const st = statements.find((x) => x.slug === q.slug);
    if (!st?.body) {
      errors.push(`${where}: 원문이 있는 언행 ${q.slug}이 없다`);
      continue;
    }
    const body = squash(st.body);
    const joined = q.parts.map((p) => squash(p.text)).join(" ");
    for (const p of q.parts) if (!body.includes(squash(p.text))) errors.push(`${where}: 원문에 없는 문장 — 「${p.text.slice(0, 30)}…」`);
    if (q.parts.every((p) => body.includes(squash(p.text))) && !body.includes(joined)) errors.push(`${where}: 문장이 원문에서 이어지지 않는다(순서가 다르거나 사이에 문장이 빠졌다)`);
    if (!q.parts.some((p) => p.role === "claim")) errors.push(`${where}: 주장이 없다`);
    if (!q.parts.some((p) => p.role !== "claim")) errors.push(`${where}: 근거나 예시가 없다`);
  }
  return errors;
}

// ── 1단계 「알기」 › 정부 정책 팩트 O/X ─────────────────────────────

/** 문장의 숫자(쉼표·소수점 포함). 근거 claim에 없는 숫자를 잡는다. */
const numbersIn = (t: string) => (t.match(/\d[\d,.]*\d|\d/g) ?? []).map((n) => n.replace(/[.,]$/, ""));

/**
 * 정책 O/X 검사.
 *   1. 모양, id 겹침, 정책과 claim이 실재한다.
 *   2. 근거 claim은 O·X 모두 확인된 것.
 *   3. O 문항 — 부처 주장(CLAIM)이 근거면 주장한 쪽이 문장에 있다. 근거가 해석·의견뿐이면 안 된다.
 *   4. 문장·풀이의 숫자는 근거 claim이나 정책 제목에 있다.
 *   5. 정책마다 같은 문장이 두 번 나오지 않는다.
 */
export function validatePolicyOx(policies: Policy[], ox: Record<string, OxItem[]> = POLICY_OX): string[] {
  const errors: string[] = [];
  const bySlug = new Map(policies.map((p) => [p.slug, p]));
  for (const [slug, items] of Object.entries(ox)) {
    const p = bySlug.get(slug);
    if (!p) {
      errors.push(`정책 O/X ${slug}: 없는 정책`);
      continue;
    }
    const ids = new Set<string>();
    const statements = new Set<string>();
    for (const q of items) {
      const where = `정책 O/X ${slug}/${q.id}`;
      const shape = oxItemSchema.safeParse(q);
      if (!shape.success) {
        errors.push(`${where}: 모양 — ${shape.error.issues.map((i) => i.path.join(".") + " " + i.message).join(", ")}`);
        continue;
      }
      if (ids.has(q.id)) errors.push(`${where}: 문항 id가 겹친다`);
      ids.add(q.id);
      if (statements.has(q.statement)) errors.push(`${where}: 같은 문장이 두 번`);
      statements.add(q.statement);
      const claims = q.claimIds.map((id) => p.claims.find((c) => c.id === id));
      if (claims.some((c) => !c)) {
        errors.push(`${where}: 없는 claim ${q.claimIds.filter((_, k) => !claims[k]).join(", ")}`);
        continue;
      }
      const found = claims as Claim[];
      for (const c of found) if (!c.verified) errors.push(`${where}: 확인 전 claim(${c.id})을 근거로 썼다`);
      // 숫자는 근거 claim이나 정책 제목(「2026년 …」「5·18」 같은 이름)에 있어야 한다.
      const text = `${p.title} ${found.map((c) => c.text).join(" ")}`;
      for (const n of [...numbersIn(q.statement), ...numbersIn(q.explain)]) if (!text.includes(n)) errors.push(`${where}: 근거 claim에 없는 숫자 ${n}`);
      if (!q.answer) continue;
      for (const c of found.filter((x) => x.assertionType === "CLAIM")) {
        const by = c.assertedBy ?? "";
        if (!names(by).some((name) => q.statement.includes(name))) errors.push(`${where}: 근거가 「${by}」의 주장(${c.id})인데 문장에 주장한 쪽이 없다`);
      }
      if (found.every((c) => c.assertionType === "INTERPRETATION" || c.assertionType === "OPINION")) errors.push(`${where}: 근거가 해석·의견뿐인 O 문항`);
    }
  }
  return errors;
}
