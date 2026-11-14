/**
 * 거대 잡초 2.0 규칙 점검 — **로컬 에뮬레이터에만** 붙는다(docs/garden-miniroom.md §7.5).
 *
 *   firebase emulators:exec --only firestore --project demo-jamtong "pnpm check:raid-rules"
 *
 * check-ilchon-rules.ts와 같은 방식이다: 가짜 사용자 여럿(mockUserToken), 문서는 REST로 심는다.
 * 빈틈은 서버 시각(request.time)으로 정해져 바꿀 수 없다. 그래서 돌 때의 분을 보고 기대를 정하고, 어느 갈래를
 * 확인했는지 찍는다. 보통 물결(빈틈 0–2분)과 폭주 물결(0–5분)을 함께 쓰므로 3–5분·33–35분에 돌리면 두 갈래가
 * 한 번에 다 나온다 — RAID_RULES_WAIT=1이면 그 분까지 기다린다(최대 30분).
 */
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, deleteDoc, doc, getFirestore, serverTimestamp, setDoc, updateDoc, writeBatch, type Firestore } from "firebase/firestore";

const EMU = process.env.FIRESTORE_EMULATOR_HOST;
if (!EMU) {
  console.error("FIRESTORE_EMULATOR_HOST가 없다. 운영 프로젝트에는 붙지 않는다 — firebase emulators:exec로 돌린다.");
  process.exit(1);
}
const [HOST, PORT_TEXT] = EMU.split(":");
const PORT = Number(PORT_TEXT);
const PROJECT = process.env.GCLOUD_PROJECT ?? "demo-jamtong";
if (!PROJECT.startsWith("demo-")) {
  console.error(`demo- 프로젝트에서만 돈다(지금 ${PROJECT}).`);
  process.exit(1);
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const day = Math.floor((Date.now() + 9 * HOUR) / (24 * HOUR));
const rid = (wave: number) => `${day}-${wave}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let n = 0;
function client(uid: string): Firestore {
  const app = initializeApp({ projectId: PROJECT, apiKey: "x" }, `app${n++}`);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, HOST, PORT, { mockUserToken: { sub: uid, user_id: uid } });
  return db;
}

type V = { integerValue: string } | { timestampValue: string } | { nullValue: null } | { stringValue: string } | { arrayValue: { values?: V[] } };
const int = (x: number): V => ({ integerValue: String(x) });
const ts = (t: number): V => ({ timestampValue: new Date(t).toISOString() });

async function bypass(path: string, fields: Record<string, V>) {
  const res = await fetch(`http://${HOST}:${PORT}/v1/projects/${PROJECT}/databases/(default)/documents/${path}`, {
    method: "PATCH",
    headers: { Authorization: "Bearer owner", "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`seed ${path}: ${res.status} ${await res.text()}`);
}

let failed = 0;
let passed = 0;
async function expect(allowed: boolean, label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    if (allowed) { passed++; console.log(`  ✓ ${label}`); }
    else { failed++; console.log(`  ✗ ${label} — 통과했다(막혀야 한다)`); }
  } catch (e) {
    const err = e as { message?: string; code?: string };
    const msg = String(err?.message);
    const denied = err?.code === "permission-denied" || /permission|insufficient/i.test(msg);
    if (!allowed && denied) { passed++; console.log(`  ✓ ${label} — 막혔다`); }
    else { failed++; console.log(`  ✗ ${label} — ${allowed ? "막혔다" : "다른 오류"}: ${msg.slice(0, 200)}`); }
  }
}

/** 분의 경계 2초 안이면 넘어갈 때까지 기다린다 — 기대와 서버 판단이 어긋나지 않게. */
async function steady() {
  const s = new Date().getUTCSeconds();
  if (s >= 57) await sleep((61 - s) * 1000);
  else if (s < 2) await sleep(2_500);
}
const minute = () => new Date().getUTCMinutes() % 30;
const gapNormal = () => minute() < 3;
const gapFrenzy = () => minute() < 6;

/** 물결 하나와 빈 칸 여덟을 심는다. */
async function seedWave(wave: number, hp: number, spawnedAt: number, hits = 0) {
  await bypass(`plazaRaids/${rid(wave)}`, { hp: int(hp), hits: int(hits), fighters: int(0), spawnedAt: ts(spawnedAt), defeatedAt: { nullValue: null } });
  for (let s = 0; s < 8; s++) await bypass(`plazaRaids/${rid(wave)}/shards/${s}`, { hits: int(0), fighters: int(0) });
}

const shardOf = (uid: string) => {
  // rules.ts의 raidShard와 같다(FNV-1a % 8).
  let h = 2166136261;
  for (let i = 0; i < uid.length; i++) {
    h ^= uid.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 8;
};

/** 지금 화면의 한 커밋: 내 표식 + 내 칸. shardNow는 칸의 지금 값(이 점검이 따라 적는다). */
interface Cell { hits: number; fighters: number; names?: string[] }
const cells = new Map<string, Cell>();
const cellKey = (wave: number, s: number) => `${wave}/${s}`;
const cell = (wave: number, s: number) => cells.get(cellKey(wave, s)) ?? { hits: 0, fighters: 0 };

function move(db: Firestore, uid: string, wave: number, mine: Record<string, unknown>, shard: Cell, s = shardOf(uid)) {
  const w = writeBatch(db);
  w.set(doc(db, "plazaRaids", rid(wave), "fighters", uid), { ...mine, lastAt: serverTimestamp(), shard: s });
  w.set(doc(db, "plazaRaids", rid(wave), "shards", String(s)), shard);
  return w.commit().then(() => cells.set(cellKey(wave, s), { ...shard }));
}

(async () => {
  if (process.env.RAID_RULES_WAIT === "1") {
    while (!(minute() >= 3 && minute() < 6)) {
      console.log(`(${new Date().toISOString().slice(11, 19)} UTC — 3–5분·33–35분을 기다린다)`);
      await sleep(30_000);
    }
  }
  await fetch(`http://${HOST}:${PORT}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
  const now = Date.now();
  console.log(`지금 ${new Date(now).toISOString().slice(11, 19)} UTC · 분%30 = ${minute()} · 보통 빈틈 ${gapNormal()} · 폭주 빈틈 ${gapFrenzy()}`);

  const users = ["uA", "uB", "uC", "uD", "uE", "uF", "uG", "uH"].map((u) => ({ uid: u, db: client(u), s: shardOf(u) }));
  const [A, B, C, D, E, F, G, H] = users;

  console.log("세우기(체력 하한 270)");
  const kstHour = new Date(now + 9 * HOUR).getUTCHours();
  const fresh = (hp: number) => ({ hp, hits: 0, fighters: 0, spawnedAt: serverTimestamp(), defeatedAt: null });
  await expect(false, "체력 240(둘이 빈틈에 잡을 수 있는 크기)으로 세우기", () => setDoc(doc(A.db, "plazaRaids", rid(1)), fresh(240)));
  if (kstHour >= 8) {
    await expect(true, "체력 270으로 첫 물결 세우기", () => setDoc(doc(A.db, "plazaRaids", rid(1)), fresh(270)));
  } else console.log("  (한국 시각 8시 전이라 세우기 통과 검사는 건너뛴다)");

  // 물결: 1=보통(한 시간 전), 2=폭주(2시간 40분 전), 3=옛 체력 180, 4=도망(3시간 10분 전).
  await seedWave(1, 270, now - HOUR);
  await seedWave(2, 360, now - 160 * MIN);
  await seedWave(3, 180, now - HOUR);
  await seedWave(4, 270, now - 190 * MIN);

  console.log("빈틈과 기력 (보통 물결)");
  await steady();
  {
    const v = gapNormal() ? 2 : 1;
    const c = cell(1, A.s);
    await expect(false, `틀린 값 ${3 - v}(지금 ${gapNormal() ? "빈틈" : "빈틈 아님"})`, () =>
      move(A.db, A.uid, 1, { hits: 3 - v, uses: 1 }, { hits: c.hits + 3 - v, fighters: c.fighters + 1, names: ["에이"] }));
    await steady();
    await expect(true, `맞는 값 ${v}로 한 번 + 이름`, () => move(A.db, A.uid, 1, { hits: v, uses: 1 }, { hits: c.hits + v, fighters: c.fighters + 1, names: ["에이"] }));
    const c2 = cell(1, A.s);
    await expect(false, "1초 안에 또 치기", () => move(A.db, A.uid, 1, { hits: v + v, uses: 2 }, { ...c2, hits: c2.hits + v }));
    console.log(`  (확인한 갈래: 보통 물결 ${gapNormal() ? "빈틈 안 ×2" : "빈틈 밖 ×1"})`);
    await sleep(1_100);
    await steady();
    await expect(false, "이미 든 사람이 이름을 또 붙이기", () => move(A.db, A.uid, 1, { hits: v + v, uses: 2 }, { ...c2, hits: c2.hits + v, names: ["에이", "에이"] }));
    await expect(false, "센 값만 올리고 칸은 덜 올리기", async () => { await sleep(1_100); await steady(); return move(A.db, A.uid, 1, { hits: v + v, uses: 2 }, { ...c2, hits: c2.hits + v - 1 }); });
  }

  console.log("체력이 작은 옛 물결(180)에는 빈틈이 없다");
  await steady();
  await expect(false, "옛 물결에 ×2", () => move(B.db, B.uid, 3, { hits: 2, uses: 1 }, { hits: 2, fighters: 1 }));
  await expect(true, "옛 물결에 ×1", () => move(B.db, B.uid, 3, { hits: 1, uses: 1 }, { hits: 1, fighters: 1 }));

  console.log("폭주 물결(빈틈 6분)");
  await steady();
  {
    const v = gapFrenzy() ? 2 : 1;
    await expect(false, `폭주에 틀린 값 ${3 - v}`, () => move(C.db, C.uid, 2, { hits: 3 - v, uses: 1 }, { hits: 3 - v, fighters: 1 }));
    await expect(true, `폭주에 맞는 값 ${v}`, () => move(C.db, C.uid, 2, { hits: v, uses: 1 }, { hits: v, fighters: 1 }));
    console.log(`  (확인한 갈래: 폭주 ${gapFrenzy() ? "빈틈 안 ×2" : "빈틈 밖 ×1"}${gapFrenzy() && !gapNormal() ? " — 보통 물결은 빈틈 밖인 분이라 폭주만의 6분을 확인했다" : ""})`);
  }

  console.log("필살기와 기력 60");
  await steady();
  {
    const v = gapNormal() ? 2 : 1;
    const c = cell(1, D.s);
    await expect(false, "기력 21번을 한 커밋에", () => move(D.db, D.uid, 1, { hits: 21 * v, uses: 21 }, { hits: c.hits + 21 * v, fighters: c.fighters + 1 }));
    await expect(true, "기력 20번(필살기)을 한 커밋에", () => move(D.db, D.uid, 1, { hits: 20 * v, uses: 20 }, { hits: c.hits + 20 * v, fighters: c.fighters + 1 }));
  }
  await bypass(`plazaRaids/${rid(1)}/fighters/${E.uid}`, { hits: int(100), uses: int(50), lastAt: ts(now - MIN), shard: int(E.s) });
  await steady();
  {
    const v = gapNormal() ? 2 : 1;
    const c = cell(1, E.s);
    await expect(false, "기력 50에서 20번 더(60을 넘음)", () => move(E.db, E.uid, 1, { hits: 100 + 20 * v, uses: 70 }, { ...c, hits: c.hits + 20 * v }));
    await expect(true, "기력 50에서 10번 더(딱 60)", () => move(E.db, E.uid, 1, { hits: 100 + 10 * v, uses: 60 }, { ...c, hits: c.hits + 10 * v }));
    await sleep(1_100);
    await steady();
    const c2 = cell(1, E.s);
    await expect(false, "기력 60을 다 쓴 뒤 한 번 더", () => move(E.db, E.uid, 1, { hits: 100 + 10 * v + v, uses: 61 }, { ...c2, hits: c2.hits + v }));
  }

  console.log("지원(기력과 따로, 20초 간격)");
  {
    const c = cell(1, F.s);
    const aid = (code: number, extra: Record<string, unknown> = {}, shard: Partial<Cell> & Record<string, unknown> = {}) =>
      move(F.db, F.uid, 1, { hits: 0, uses: 0, aid: code, aidAt: serverTimestamp(), aids: 1, ...extra }, { hits: c.hits, fighters: c.fighters + 1, names: ["에프"], aid: code, aidAt: serverTimestamp(), aidBy: "에프", ...shard } as Cell);
    await expect(false, "없는 지원 종류 4", () => aid(4));
    await expect(false, "지원하며 센 값도 올리기", () => aid(1, { hits: 5 }, { hits: c.hits + 5 }));
    await expect(false, "칸에 다른 지원을 적기", () => aid(1, {}, { aid: 2 }));
    await expect(true, "지원만으로 처음 들기(북, 표식·이름이 생긴다)", () => aid(1));
    await sleep(1_500);
    await expect(false, "20초 안에 다시 지원", () => move(F.db, F.uid, 1, { hits: 0, uses: 0, aid: 2, aidAt: serverTimestamp(), aids: 2 }, { ...cell(1, F.s), aid: 2, aidAt: serverTimestamp(), aidBy: "에프" } as Cell));
    console.log("  (20초 기다린다)");
    await sleep(20_000);
    await expect(true, "20초 뒤 다시 지원(우산)", () => move(F.db, F.uid, 1, { hits: 0, uses: 0, aid: 2, aidAt: serverTimestamp(), aids: 2 }, { ...cell(1, F.s), aid: 2, aidAt: serverTimestamp(), aidBy: "에프" } as Cell));
    await sleep(1_100);
    await steady();
    const v = gapNormal() ? 2 : 1;
    const cf = cell(1, F.s) as Cell & Record<string, unknown>;
    await expect(false, "치면서 지원 횟수를 지우기", () => move(F.db, F.uid, 1, { hits: v, uses: 1 }, { ...cf, hits: cf.hits + v }));
  }

  console.log("2.0 이전 화면(uses 없음)");
  await steady();
  {
    const c = cell(1, G.s);
    await expect(true, "옛 모양 한 방 {hits, lastAt, shard} + 칸 {hits, fighters}(이름이 지워져도)", () => move(G.db, G.uid, 1, { hits: 1 }, { hits: c.hits + 1, fighters: c.fighters + 1 }));
    await sleep(1_100);
    const c2 = cell(1, G.s);
    await expect(true, "옛 모양 필살기 +5(빈틈과 상관없이 1:1)", () => move(G.db, G.uid, 1, { hits: 6 }, { hits: c2.hits + 5, fighters: c2.fighters }));
    await sleep(1_100);
    await expect(false, "옛 모양으로 한 커밋에 +21", () => move(G.db, G.uid, 1, { hits: 6 + 21 }, { hits: c2.hits + 5 + 21, fighters: c2.fighters }));
    await steady();
    const v = gapNormal() ? 2 : 1;
    const c3 = cell(1, G.s);
    await expect(true, "옛 표식(센 값 6 = 기력 6)에 지금 화면이 이어 치기(uses 7)", () => move(G.db, G.uid, 1, { hits: 6 + v, uses: 7 }, { hits: c3.hits + v, fighters: c3.fighters }));
  }
  await bypass(`plazaRaids/${rid(1)}/fighters/${H.uid}`, { hits: int(60), lastAt: ts(now - MIN) });
  await expect(false, "옛 모양으로 60을 넘기", () => move(H.db, H.uid, 1, { hits: 61 }, { ...cell(1, H.s), hits: cell(1, H.s).hits + 1 }));
  await steady();
  await expect(false, "옛 표식 60(=기력 60)에 지금 화면이 더 치기", () => move(H.db, H.uid, 1, { hits: 62, uses: 61 }, { ...cell(1, H.s), hits: cell(1, H.s).hits + 2 }));
  {
    const legacy = client("uL");
    await expect(true, "칸 이전 화면: 표식(shard 없음) + 물결 문서 +1", () => {
      const w = writeBatch(legacy);
      w.set(doc(legacy, "plazaRaids", rid(1), "fighters", "uL"), { hits: 1, lastAt: serverTimestamp() });
      w.update(doc(legacy, "plazaRaids", rid(1)), { hits: 1, fighters: 1, defeatedAt: null });
      return w.commit();
    });
  }

  console.log("쓰러뜨리기(칸 8개의 합)");
  await bypass(`plazaRaids/${rid(1)}/shards/0`, { hits: int(100), fighters: int(1) });
  await bypass(`plazaRaids/${rid(1)}/shards/1`, { hits: int(100), fighters: int(1) });
  for (let s = 2; s < 8; s++) await bypass(`plazaRaids/${rid(1)}/shards/${s}`, { hits: int(0), fighters: int(0) });
  // 합계 = 물결 문서 1 + 200 = 201 < 270
  await expect(false, "합계 201로 쓰러뜨리기(체력 270)", () => updateDoc(doc(A.db, "plazaRaids", rid(1)), { defeatedAt: serverTimestamp() }));
  await bypass(`plazaRaids/${rid(1)}/shards/2`, { hits: int(69), fighters: int(1) });
  await expect(false, "쓰러뜨리며 체력도 바꾸기", () => updateDoc(doc(A.db, "plazaRaids", rid(1)), { defeatedAt: serverTimestamp(), hp: 1 }));
  await expect(true, "합계 270으로 쓰러뜨리기", () => updateDoc(doc(A.db, "plazaRaids", rid(1)), { defeatedAt: serverTimestamp() }));
  await expect(false, "쓰러진 시각을 다시 찍기", () => updateDoc(doc(A.db, "plazaRaids", rid(1)), { defeatedAt: serverTimestamp() }));
  await sleep(1_100);
  await expect(false, "쓰러진 뒤 지원", () => move(B.db, B.uid, 1, { hits: 0, uses: 0, aid: 1, aidAt: serverTimestamp(), aids: 1 }, { hits: 0, fighters: 1, aid: 1, aidAt: serverTimestamp(), aidBy: "비" } as Cell));

  console.log("도망(3시간)");
  await steady();
  await expect(false, "도망간 물결 치기", () => move(A.db, A.uid, 4, { hits: 1, uses: 1 }, { hits: 1, fighters: 1 }));
  await expect(false, "도망간 물결에 지원", () => move(A.db, A.uid, 4, { hits: 0, uses: 0, aid: 1, aidAt: serverTimestamp(), aids: 1 }, { hits: 0, fighters: 1, aid: 1, aidAt: serverTimestamp(), aidBy: "에이" } as Cell));
  await expect(false, "칸 지우기", () => deleteDoc(doc(A.db, "plazaRaids", rid(2), "shards", "0")));

  console.log(failed ? `\n실패 ${failed} · 통과 ${passed}` : `\n모두 기대대로 (${passed})`);
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
