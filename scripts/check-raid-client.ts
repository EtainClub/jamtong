/**
 * 거대 잡초 3.1 — **화면이 쓰는 함수 그대로**(src/lib/firebase/raid.ts) 규칙을 통과하는지 본다. 로컬 에뮬레이터에만 붙는다.
 *
 *   firebase emulators:exec --only firestore --project demo-jamtong "pnpm check:raid-client"
 *
 * check-raid-rules.ts는 손으로 만든 커밋으로 규칙의 갈래를 본다. 여기는 반대쪽이다 — 세우기·치기·지원·변신·처치를
 * 화면의 함수로 불러, 화면이 만드는 커밋의 모양이 규칙과 어긋나지 않는지 본다. 어긋나면 배포한 날 모든 타격이 막힌다.
 * 한국 시각 8시 전에는 물결을 세울 수 없어 돌지 않는다.
 */
import { connectFirestoreEmulator, doc, getDoc } from "firebase/firestore";

const EMU = process.env.FIRESTORE_EMULATOR_HOST;
const PROJECT = process.env.GCLOUD_PROJECT ?? "demo-jamtong";
if (!EMU || !PROJECT.startsWith("demo-")) {
  console.error("에뮬레이터의 demo- 프로젝트에서만 돈다 — firebase emulators:exec로 돌린다.");
  process.exit(1);
}
const [HOST, PORT_TEXT] = EMU.split(":");
const PORT = Number(PORT_TEXT);

// 화면의 파이어베이스 모듈은 브라우저에서만 앱을 만든다. 여기서는 창이 있는 척하고 에뮬레이터로 돌린다.
(globalThis as { window?: unknown }).window = globalThis;
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "x";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = PROJECT;

const HOUR = 3_600_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const UID = "uClient";

let failed = 0;
function check(label: string, ok: boolean, detail: unknown = "") {
  if (ok) console.log(`  ✓ ${label}`);
  else {
    failed++;
    console.log(`  ✗ ${label} — ${JSON.stringify(detail)}`);
  }
}

async function seedCell(id: string, s: number, c: { hits: number; brk: number; grd: number; fighters: number }) {
  const int = (x: number) => ({ integerValue: String(x) });
  const res = await fetch(`http://${HOST}:${PORT}/v1/projects/${PROJECT}/databases/(default)/documents/plazaRaids/${id}/shards/${s}`, {
    method: "PATCH",
    headers: { Authorization: "Bearer owner", "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { hits: int(c.hits), brk: int(c.brk), grd: int(c.grd), fighters: int(c.fighters) } }),
  });
  if (!res.ok) throw new Error(`seed: ${res.status} ${await res.text()}`);
}

(async () => {
  const kstHour = new Date(Date.now() + 9 * HOUR).getUTCHours();
  if (kstHour < 8) {
    console.log("한국 시각 8시 전이라 물결을 세울 수 없다 — 건너뛴다.");
    process.exit(0);
  }
  await fetch(`http://${HOST}:${PORT}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });

  const { firebaseDb } = await import("../src/lib/firebase/client");
  const { advanceRaid, aidRaid, spawnRaid, strikeRaid } = await import("../src/lib/firebase/raid");
  const { kstDayNumber, raidId, raidShard, raidStrikeValue } = await import("../src/features/garden/rules");
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 앱을 만들지 못했다");
  connectFirestoreEmulator(db, HOST, PORT, { mockUserToken: { sub: UID, user_id: UID } });

  const id = raidId(kstDayNumber(Date.now()), 1);
  const raid = async () => (await getDoc(doc(db, "plazaRaids", id))).data()!;
  const mine = async () => (await getDoc(doc(db, "plazaRaids", id, "fighters", UID))).data()!;
  const gap = () => raidStrikeValue(Date.now(), Date.now(), 378);
  // 내 칸이 아닌 칸 둘에 남의 몫을 심어 게이지를 채운다.
  const others = [0, 1, 2].filter((n) => n !== raidShard(UID)).slice(0, 2);

  console.log("세우기");
  check("spawnRaid(300)", (await spawnRaid(id, 300)) === true);
  check("한 번 더 세우면 아무 일도 없다", (await spawnRaid(id, 300)) === false);
  const born = await raid();
  check("1형 · 체력 300 · 갑옷 0 · 울타리 0", born.form === 1 && born.hp === 300 && born.brk === 0 && born.grd === 0, born);

  console.log("1형 — 누구나 몸통을 ×2로");
  let g = gap();
  let hit = await strikeRaid(UID, id, 1, "화면", { role: "reaper", pool: 0 });
  check(`낫잡이가 체력에 한 번 → 값 ${2 * g}`, hit.result === "ok" && hit.hits === 2 * g, hit);
  await sleep(1_200);
  g = gap();
  hit = await strikeRaid(UID, id, 1, "화면", { role: "seeker", pool: 1 });
  check(`1형에서 갑옷을 골라도 몸통으로, 표식의 역할(낫잡이)로 → 값 ${2 * g}`, hit.result === "ok" && hit.hits === 2 * g, hit);
  check("표식: 역할 1 · 형태 1 · 기력 2", await mine().then((m) => m.role === 1 && m.form === 1 && m.uses === 2), await mine());
  await sleep(1_200);
  g = gap();
  hit = await strikeRaid(UID, id, 20, "화면", { role: "reaper", pool: 0 });
  check(`필살기 20 → 값 ${40 * g}`, hit.result === "ok" && hit.uses === 20 && hit.hits === 40 * g, hit);
  await sleep(1_200);
  check("지원(북)", (await aidRaid(UID, id, "drum", "화면", "reaper")) === "ok");
  check("지원 뒤에도 기력·역할은 그대로", await mine().then((m) => m.uses === 22 && m.role === 1 && m.aids === 1), await mine());

  console.log("변신 — 1형 체력을 다 깎으면 언제든 2형");
  check("덜 찼으면 넘기지 않는다", (await advanceRaid(id)) === null);
  await seedCell(id, others[0], { hits: 300, brk: 0, grd: 0, fighters: 3 });
  await seedCell(id, others[1], { hits: 0, brk: 0, grd: 0, fighters: 2 });
  check("advanceRaid → 변신", (await advanceRaid(id)) === "morph");
  const second = await raid();
  check("2형 · 필요량 360(여섯 명이라 기본 300 × 6/5) · 체력 +180 · 갑옷 +90 · 울타리 +90",
    second.form === 2 && second.n === 360 && second.hp === second.base.h + 180 && second.brk === second.base.b + 90 && second.grd === second.base.g + 90, second);
  check("넘긴 직후 또 넘기지 않는다", (await advanceRaid(id)) === null);

  console.log("새 형태 — 기력이 다시 차고 역할을 바꾼다");
  await sleep(1_200);
  g = gap();
  hit = await strikeRaid(UID, id, 1, "화면", { role: "warden", pool: 2 });
  check(`울타리지기로 바꿔 울타리에 → 값 ${2 * g}`, hit.result === "ok" && hit.hits === 2 * g, hit);
  check("표식: 역할 3 · 형태 2 · 기력 1(다시 셌다)", await mine().then((m) => m.role === 3 && m.form === 2 && m.uses === 1), await mine());
  await sleep(1_200);
  g = gap();
  hit = await strikeRaid(UID, id, 1, "화면", { role: "warden", pool: 0 });
  check(`울타리지기가 체력을 돕기 → 값 ${g}`, hit.result === "ok" && hit.hits === g, hit);
  await sleep(1_200);
  check("2형에서 지원(우산은 20초 뒤라 막힌다 → busy)", (await aidRaid(UID, id, "umbrella", "화면", "warden")) === "busy");

  console.log("3형까지, 그리고 처치");
  await seedCell(id, others[0], { hits: 300 + 300, brk: 150, grd: 150, fighters: 3 });
  check("advanceRaid → 변신(3형)", (await advanceRaid(id)) === "morph");
  const third = await raid();
  check("3형 · 기본 450(300 × 3/2) · 체력 +180 · 갑옷 +135 · 울타리 +135", third.form === 3 && third.n === 450 && third.hp === third.base.h + 180 && third.brk === third.base.b + 135 && third.grd === third.base.g + 135, third);
  await sleep(1_200);
  hit = await strikeRaid(UID, id, 1, "화면", { role: "seeker", pool: 1 });
  check("3형에서 돋보기꾼으로", hit.result === "ok" && (await mine()).role === 2 && (await mine()).uses === 1, hit);
  await seedCell(id, others[0], { hits: 600 + 400, brk: 150 + 300, grd: 150 + 300, fighters: 3 });
  check("advanceRaid → 처치(3형은 쓰러진다)", (await advanceRaid(id)) === "finish");
  check("쓰러진 시각이 찍혔다", (await raid()).defeatedAt != null);
  await sleep(1_200);
  hit = await strikeRaid(UID, id, 1, "화면", { role: "seeker", pool: 1 });
  check("쓰러진 뒤에는 치지 못한다(over)", hit.result === "over", hit);

  console.log(failed ? `\n실패 ${failed}` : "\n화면의 함수가 모두 규칙을 통과했다");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
