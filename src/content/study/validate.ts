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
import type { Achievement, Claim } from "../schema";
import { ACHIEVEMENT_OX, type OxItem } from "./ox";

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
export function studyCount(): { items: number; units: number } {
  const all = Object.values(ACHIEVEMENT_OX);
  return { items: all.reduce((n, xs) => n + xs.length, 0), units: all.length };
}
