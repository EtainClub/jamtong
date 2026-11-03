/**
 * 정원 품종 장부 채우기 (src/features/garden/arrivals.ts).
 *
 *   pnpm garden:arrivals             장부에 없는 품종을 오늘(한국 날짜) 들어온 것으로 적는다
 *   pnpm garden:arrivals --baseline  장부에 없는 품종을 "base"(개장 전부터 있던 것)로 적는다
 *   pnpm garden:arrivals --dry       무엇이 바뀔지만 보여 준다
 *
 * 19시(한국 시각) 넘어서 돌리면 다음 날로 적는다. 그날 장마(19:00–20:00)가 이미
 * 시작됐거나 지났기 때문이다 — 새 품종이 장마 없이 지나가지 않게.
 *
 * 이미 적힌 품종은 건드리지 않는다. 콘텐츠에서 빠진 품종도 지우지 않는다 — 다시
 * 들어오면 신품종이 아니다.
 */
import { readFileSync, writeFileSync } from "node:fs";

import { buildCatalog } from "../src/features/garden/catalog";
import { kstDay } from "../src/features/garden/rules";

const FILE = "src/features/garden/arrivals.json";
const args = new Set(process.argv.slice(2));

const ledger = JSON.parse(readFileSync(FILE, "utf8")) as Record<string, string>;
const now = Date.now();
const hourKst = new Date(now + 9 * 3_600_000).getUTCHours();
const stamp = args.has("--baseline") ? "base" : kstDay(hourKst >= 19 ? now + 24 * 3_600_000 : now);

const missing = buildCatalog()
  .map((s) => s.id)
  .filter((id) => !(id in ledger));

if (missing.length === 0) {
  console.log("장부에 빠진 품종이 없다.");
  process.exit(0);
}

for (const id of missing) console.log(`  + ${id} → ${stamp}`);
if (args.has("--dry")) {
  console.log(`\n${missing.length}개를 ${stamp}로 적을 것이다 (--dry).`);
  process.exit(0);
}

const next = Object.fromEntries(
  Object.entries({ ...ledger, ...Object.fromEntries(missing.map((id) => [id, stamp])) }).sort(([a], [b]) =>
    a.localeCompare(b),
  ),
);
writeFileSync(FILE, `${JSON.stringify(next, null, 2)}\n`);
console.log(`\n${missing.length}개를 ${stamp}로 적었다.${stamp === "base" ? "" : ` 그날 19:00에 신품종 장마.`}`);
