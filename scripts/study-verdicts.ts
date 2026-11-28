/**
 * 도는 말 판정 — 승인 대기 목록과 승인(docs/jamgong-roadmap.md R5, AGENTS.md "도는 말 판정").
 *
 *   pnpm study:verdicts                       승인 대기 판정을 근거와 함께 보여 준다
 *   pnpm study:verdicts --all                 승인된 것까지 모두
 *   pnpm study:verdicts --approve <열쇠…>     그 판정에 오늘 날짜로 승인을 적는다(운영자만)
 *
 * ★ 승인은 사람이 한다. 에이전트는 이 스크립트로 승인하지 않는다 — 초안을 쓰고 목록을 보여 주는 데까지.
 * ★ 승인하기 전에 판정을 고치려면 src/content/policies/verdicts.ts를 직접 고친다. 고친 판정은 pnpm validate를 통과해야 한다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { POLICIES } from "../src/content/policies";
import { approveInSource, VERDICT_LABEL, VERDICTS, validateVerdicts } from "../src/content/policies/verdicts";

const FILE = join(process.cwd(), "src", "content", "policies", "verdicts.ts");
const args = process.argv.slice(2);
const today = new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);

if (args[0] === "--approve") {
  const keys = args.slice(1);
  if (keys.length === 0) {
    console.error("승인할 열쇠(<slug>#<rumorId>)를 적어 주세요.");
    process.exit(1);
  }
  const errors = validateVerdicts(POLICIES);
  if (errors.length) {
    console.error("판정 검사를 먼저 통과해야 한다:\n  " + errors.join("\n  "));
    process.exit(1);
  }
  let text = readFileSync(FILE, "utf8");
  let done = 0;
  for (const key of keys) {
    const v = VERDICTS[key];
    if (!v) {
      console.error(`  ✗ 없는 판정: ${key}`);
      continue;
    }
    if (v.approved) {
      console.log(`  · 이미 승인됨: ${key} (${v.approved})`);
      continue;
    }
    const next = approveInSource(text, key, today);
    if (!next) {
      console.error(`  ✗ 파일에서 그 판정의 줄을 찾지 못했다: ${key}`);
      continue;
    }
    text = next;
    done++;
    console.log(`  ✓ 승인: ${key} — ${VERDICT_LABEL[v.value]}`);
  }
  writeFileSync(FILE, text);
  console.log(`\n${done}건 승인(${today}). pnpm validate로 확인하고 커밋하세요.`);
  process.exit(0);
}

const all = args.includes("--all");
const entries = Object.entries(VERDICTS).filter(([, v]) => all || !v.approved);
console.log(`판정 ${Object.keys(VERDICTS).length}건 · 승인 대기 ${Object.values(VERDICTS).filter((v) => !v.approved).length}건\n`);
for (const [key, v] of entries) {
  const [slug, rumorId] = key.split("#");
  const policy = POLICIES.find((p) => p.slug === slug);
  const rumor = policy?.rumors.find((r) => r.id === rumorId);
  console.log(`■ ${key}${v.approved ? ` (승인 ${v.approved})` : ""}`);
  console.log(`  도는 말: 「${rumor?.text ?? "?"}」 — ${policy?.title ?? "?"}`);
  console.log(`  판정: ${VERDICT_LABEL[v.value]} — ${v.note}`);
  for (const id of rumor?.claimIds ?? []) {
    const c = policy?.claims.find((x) => x.id === id);
    if (c) console.log(`    · [${c.assertionType}${c.assertedBy ? `:${c.assertedBy}` : ""}${c.verified ? "" : " 미검증"}] ${c.text.slice(0, 140)}`);
  }
  console.log("");
}
