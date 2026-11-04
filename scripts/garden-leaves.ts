/**
 * 시든 잎 확인 결과 보기 — 운영자 큐 (docs/garden-game.md §3.8).
 *
 *   pnpm garden:leaves          확인이 하나라도 있는 잎을 "안 열려요"가 많은 순으로
 *   pnpm garden:leaves --all    아직 아무도 확인하지 않은 잎까지
 *
 * 정원 사람들이 "열려요"·"안 열려요"를 누른 수를 출처 url과 함께 보여 준다.
 * Firestore에는 url이 없다(leafChecks는 id와 숫자뿐) — 빌드와 같은 목록(buildLeaves)으로
 * id를 url로 되짚는다. 그래서 링크 확인 표가 바뀌어 잎에서 빠진 출처는 여기서도 빠진다.
 *
 * 고치는 길:
 *   - "안 열려요"가 많으면 출처 파일의 url을 바꾸거나 archivedUrl을 단다.
 *   - "열려요"가 많으면 사람에게는 열리는 링크다(대개 표의 blocked). 그대로 둔다.
 *   - 고친 뒤 `pnpm sources:archive`를 다시 돌리면 표가 ok로 바뀌고 잎이 사라진다.
 *
 * 읽기에 관리자 키(sa.json)가 필요하지 않다 — leafChecks는 누구나 읽는다. 다만
 * 콘솔에서 보듯 한꺼번에 보려고 firebase-admin을 쓴다.
 */
import { readFileSync } from "node:fs";

import { buildLeaves } from "../src/features/garden/catalog";

const args = new Set(process.argv.slice(2));

async function main() {
  readFileSync("sa.json", "utf8");
  const appMod = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  appMod.initializeApp({ credential: appMod.cert("sa.json") });
  const db = getFirestore();

  const leaves = buildLeaves();
  const snap = await db.collection("leafChecks").get();
  const counts = new Map(snap.docs.map((d) => [d.id, { opens: d.get("opens") ?? 0, fails: d.get("fails") ?? 0 }]));

  const rows = leaves
    .map((leaf) => ({ leaf, ...(counts.get(leaf.id) ?? { opens: 0, fails: 0 }) }))
    .filter((r) => args.has("--all") || r.opens + r.fails > 0)
    .sort((a, b) => b.fails - a.fails || b.opens + b.fails - (a.opens + a.fails));

  console.log(`시든 잎 ${leaves.length}장 · 확인된 잎 ${[...counts.keys()].filter((id) => leaves.some((l) => l.id === id)).length}장\n`);
  for (const { leaf, opens, fails } of rows) {
    const verdict = fails > opens ? "안 열림" : opens > fails ? "열림" : opens + fails ? "엇갈림" : "미확인";
    console.log(`[${verdict}] 안 열려요 ${fails} · 열려요 ${opens}  ${leaf.id}`);
    console.log(`  ${leaf.title}`);
    console.log(`  ${leaf.url}`);
    console.log(`  쓰는 곳: ${leaf.speciesTitle} (${leaf.href})\n`);
  }
  if (rows.length === 0) console.log("아직 확인된 잎이 없다. --all로 전체를 볼 수 있다.");
}

main().catch((error) => {
  if ((error as NodeJS.ErrnoException).code === "ENOENT") {
    console.error("sa.json(서비스 계정 키)이 없다. 저장소 루트에 두고 다시 돌린다.");
  } else {
    console.error(error);
  }
  process.exit(1);
});
