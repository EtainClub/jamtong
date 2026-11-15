/**
 * 거대 잡초 3.0 규칙 점검 — **로컬 에뮬레이터에만** 붙는다(docs/garden-raid-boss.md §4.2).
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

type V = { integerValue: string } | { timestampValue: string } | { nullValue: null } | { stringValue: string } | { arrayValue: { values?: V[] } } | { mapValue: { fields: Record<string, V> } };
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

/** 2.0 물결(form 없음) 하나와 빈 칸 여덟을 심는다. */
async function seedWave(wave: number, hp: number, spawnedAt: number) {
  await bypass(`plazaRaids/${rid(wave)}`, { hp: int(hp), hits: int(0), fighters: int(0), spawnedAt: ts(spawnedAt), defeatedAt: { nullValue: null } });
  for (let s = 0; s < 8; s++) await bypass(`plazaRaids/${rid(wave)}/shards/${s}`, { hits: int(0), fighters: int(0) });
}

/** 3.0 물결을 심는다. 목표(hp·brk·grd)는 쌓인 값이다. */
async function seedV3(wave: number, o: { size?: number; form: number; formAt: number; spawnedAt: number; n?: number; hp: number; brk: number; grd: number; base?: [number, number, number] }) {
  const [h, b, g] = o.base ?? [0, 0, 0];
  await bypass(`plazaRaids/${rid(wave)}`, {
    hp: int(o.hp), brk: int(o.brk), grd: int(o.grd), size: int(o.size ?? 540), n: int(o.n ?? o.size ?? 540),
    base: { mapValue: { fields: { h: int(h), b: int(b), g: int(g) } } },
    form: int(o.form), formAt: ts(o.formAt), hits: int(0), fighters: int(0), spawnedAt: ts(o.spawnedAt), defeatedAt: { nullValue: null },
  });
  for (let s = 0; s < 8; s++) await bypass(`plazaRaids/${rid(wave)}/shards/${s}`, { hits: int(0), fighters: int(0) });
}

/** 칸 하나를 통째로 심는다(합계를 맞춰 넘기기를 볼 때). */
async function seedCell(wave: number, s: number, c: { hits?: number; brk?: number; grd?: number; fighters?: number }) {
  await bypass(`plazaRaids/${rid(wave)}/shards/${s}`, { hits: int(c.hits ?? 0), brk: int(c.brk ?? 0), grd: int(c.grd ?? 0), fighters: int(c.fighters ?? 0) });
  cells.set(cellKey(wave, s), { hits: c.hits ?? 0, brk: c.brk ?? 0, grd: c.grd ?? 0, fighters: c.fighters ?? 0 });
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

/** 지금 화면의 한 커밋: 내 표식 + 내 칸. 칸의 지금 값은 이 점검이 따라 적는다. */
interface Cell { hits: number; brk?: number; grd?: number; fighters: number; names?: string[] }
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
  console.log(`지금 ${new Date(now).toISOString().slice(11, 19)} UTC · 분%30 = ${minute()} · 빈틈 ${gapNormal()}`);

  const users = ["uA", "uB", "uC", "uD", "uE", "uF", "uG", "uH", "uI", "uJ"].map((u) => ({ uid: u, db: client(u), s: shardOf(u) }));
  const [A, B, C, D, E, F, G, H, I, J] = users;

  console.log("세우기(3.0 — 1형, 기본 필요량 540·720·900을 체력 70%·갑옷 30%로)");
  const kstHour = new Date(now + 9 * HOUR).getUTCHours();
  const fresh = (size: number, over: Record<string, unknown> = {}) => ({
    hp: (size * 70) / 100, brk: (size * 30) / 100, grd: 0, size, n: size, base: { h: 0, b: 0, g: 0 },
    form: 1, formAt: serverTimestamp(), hits: 0, fighters: 0, spawnedAt: serverTimestamp(), defeatedAt: null, ...over,
  });
  await expect(false, "2.0 모양(체력 270, 형태 없음)으로 세우기", () => setDoc(doc(A.db, "plazaRaids", rid(1)), { hp: 270, hits: 0, fighters: 0, spawnedAt: serverTimestamp(), defeatedAt: null }));
  await expect(false, "없는 크기 480(둘이 잡을 수 있다)", () => setDoc(doc(A.db, "plazaRaids", rid(1)), fresh(480)));
  await expect(false, "갑옷 없이 세우기", () => setDoc(doc(A.db, "plazaRaids", rid(1)), fresh(540, { brk: 0 })));
  await expect(false, "2형으로 세우기", () => setDoc(doc(A.db, "plazaRaids", rid(1)), fresh(540, { form: 2 })));
  if (kstHour >= 8) {
    await expect(true, "크기 540으로 첫 물결 세우기", () => setDoc(doc(A.db, "plazaRaids", rid(1)), fresh(540)));
  } else console.log("  (한국 시각 8시 전이라 세우기 통과 검사는 건너뛴다)");

  // 물결: 1=3.0 1형(한 시간 전 — 30분을 넘겼다), 2=3.0 2형(막 변신), 3=2.0 물결(체력 270), 4=3.0 1형(5분 전 — 빠르다), 5=3.0 3형(5분 전).
  await seedV3(1, { form: 1, formAt: now - HOUR, spawnedAt: now - HOUR, hp: 378, brk: 162, grd: 0 });
  await seedV3(2, { form: 2, formAt: now - MIN, spawnedAt: now - 20 * MIN, n: 540, hp: 400 + 270, brk: 170 + 135, grd: 135, base: [400, 170, 0] });
  await seedWave(3, 270, now - HOUR);
  await seedV3(4, { form: 1, formAt: now - 5 * MIN, spawnedAt: now - 5 * MIN, hp: 378, brk: 162, grd: 0 });
  await seedV3(5, { form: 3, formAt: now - 5 * MIN, spawnedAt: now - 40 * MIN, n: 540, hp: 900 + 216, brk: 400 + 162, grd: 200 + 162, base: [900, 400, 200] });

  console.log("역할과 게이지 (3.0 1형)");
  await steady();
  {
    const g = gapNormal() ? 2 : 1;
    const c = cell(1, A.s);
    await expect(false, `낫잡이가 체력에 넣으며 역할 배수를 빼먹기(값 ${g})`, () =>
      move(A.db, A.uid, 1, { hits: g, uses: 1, role: 1, form: 1, pool: 0 }, { hits: c.hits + g, fighters: c.fighters + 1, names: ["에이"] }));
    await steady();
    await expect(true, `낫잡이가 체력에 ×2(값 ${2 * g}) + 이름`, () =>
      move(A.db, A.uid, 1, { hits: 2 * g, uses: 1, role: 1, form: 1, pool: 0 }, { hits: c.hits + 2 * g, fighters: c.fighters + 1, names: ["에이"] }));
    const c2 = cell(1, A.s);
    await expect(false, "1초 안에 또 치기", () => move(A.db, A.uid, 1, { hits: 4 * g, uses: 2, role: 1, form: 1, pool: 0 }, { ...c2, hits: c2.hits + 2 * g }));
    console.log(`  (확인한 갈래: ${gapNormal() ? "빈틈 안 ×2" : "빈틈 밖 ×1"})`);
    await sleep(1_100);
    await steady();
    const g2 = gapNormal() ? 2 : 1;
    await expect(false, "같은 형태에서 역할 바꾸기(낫잡이 → 돋보기꾼)", () =>
      move(A.db, A.uid, 1, { hits: 2 * g + 2 * g2, uses: 2, role: 2, form: 1, pool: 1 }, { ...c2, brk: (c2.brk ?? 0) + 2 * g2 }));
    await expect(false, "낫잡이가 갑옷에 ×2(남의 일은 ×1이다)", () =>
      move(A.db, A.uid, 1, { hits: 2 * g + 2 * g2, uses: 2, role: 1, form: 1, pool: 1 }, { ...c2, brk: (c2.brk ?? 0) + 2 * g2 }));
    await expect(false, "갑옷에 넣는다며 체력 칸을 올리기", () =>
      move(A.db, A.uid, 1, { hits: 2 * g + g2, uses: 2, role: 1, form: 1, pool: 1 }, { ...c2, hits: c2.hits + g2 }));
    await expect(true, `낫잡이가 갑옷을 돕기 ×1(값 ${g2})`, () =>
      move(A.db, A.uid, 1, { hits: 2 * g + g2, uses: 2, role: 1, form: 1, pool: 1 }, { ...c2, brk: (c2.brk ?? 0) + g2 }));
  }
  await steady();
  {
    const g = gapNormal() ? 2 : 1;
    const c = cell(1, B.s);
    await expect(true, `돋보기꾼이 갑옷에 ×2(값 ${2 * g})`, () =>
      move(B.db, B.uid, 1, { hits: 2 * g, uses: 1, role: 2, form: 1, pool: 1 }, { hits: c.hits, brk: (c.brk ?? 0) + 2 * g, fighters: c.fighters + 1 }));
    const cw = cell(1, C.s);
    await expect(false, "없는 역할 4", () => move(C.db, C.uid, 1, { hits: g, uses: 1, role: 4, form: 1, pool: 0 }, { hits: cw.hits + g, fighters: cw.fighters + 1 }));
    await expect(false, "없는 게이지 3", () => move(C.db, C.uid, 1, { hits: g, uses: 1, role: 1, form: 1, pool: 3 }, { hits: cw.hits + g, fighters: cw.fighters + 1 }));
    await expect(false, "물결과 다른 형태(2)를 적기", () => move(C.db, C.uid, 1, { hits: 2 * g, uses: 1, role: 1, form: 2, pool: 0 }, { hits: cw.hits + 2 * g, fighters: cw.fighters + 1 }));
    await expect(true, `울타리지기가 울타리에 ×2(값 ${2 * g})`, () =>
      move(C.db, C.uid, 1, { hits: 2 * g, uses: 1, role: 3, form: 1, pool: 2 }, { hits: cw.hits, grd: (cw.grd ?? 0) + 2 * g, fighters: cw.fighters + 1 }));
    await sleep(1_100);
    const cb = cell(1, B.s);
    await expect(false, "칸을 통째로 써서 갑옷을 지우기(2.0 이전 화면의 모양)", () => move(B.db, B.uid, 1, { hits: 2 * g + 1, uses: 2 }, { hits: cb.hits + 1, fighters: cb.fighters }));
  }

  console.log("역할을 모르는 2.0 화면(role 없음) — 3.0 물결에서 체력에 1:1");
  await steady();
  {
    const g = gapNormal() ? 2 : 1;
    const c = cell(1, D.s);
    await expect(false, "역할 없이 ×2", () => move(D.db, D.uid, 1, { hits: 2 * g, uses: 1 }, { hits: c.hits + 2 * g, fighters: c.fighters + 1 }));
    await expect(false, "역할 없이 갑옷에", () => move(D.db, D.uid, 1, { hits: g, uses: 1, pool: 1 }, { hits: c.hits, brk: g, fighters: c.fighters + 1 }));
    await expect(true, `역할 없이 체력에 값 ${g}`, () => move(D.db, D.uid, 1, { hits: g, uses: 1 }, { hits: c.hits + g, fighters: c.fighters + 1 }));
  }

  console.log("필살기와 기력 60");
  await steady();
  {
    const g = gapNormal() ? 2 : 1;
    const c = cell(1, E.s);
    await expect(false, "기력 21번을 한 커밋에", () => move(E.db, E.uid, 1, { hits: 42 * g, uses: 21, role: 1, form: 1, pool: 0 }, { hits: c.hits + 42 * g, fighters: c.fighters + 1 }));
    await expect(true, `기력 20번(필살기)을 한 커밋에(값 ${40 * g})`, () => move(E.db, E.uid, 1, { hits: 40 * g, uses: 20, role: 1, form: 1, pool: 0 }, { hits: c.hits + 40 * g, fighters: c.fighters + 1 }));
  }
  await bypass(`plazaRaids/${rid(1)}/fighters/${F.uid}`, { hits: int(100), uses: int(50), role: int(1), form: int(1), pool: int(0), lastAt: ts(now - MIN), shard: int(F.s) });
  await steady();
  {
    const g = gapNormal() ? 2 : 1;
    const c = cell(1, F.s);
    await expect(false, "기력 50에서 20번 더(60을 넘음)", () => move(F.db, F.uid, 1, { hits: 100 + 40 * g, uses: 70, role: 1, form: 1, pool: 0 }, { ...c, hits: c.hits + 40 * g }));
    await expect(true, "기력 50에서 10번 더(딱 60)", () => move(F.db, F.uid, 1, { hits: 100 + 20 * g, uses: 60, role: 1, form: 1, pool: 0 }, { ...c, hits: c.hits + 20 * g }));
    await sleep(1_100);
    await steady();
    const c2 = cell(1, F.s);
    const g2 = gapNormal() ? 2 : 1;
    await expect(false, "기력 60을 다 쓴 뒤 한 번 더", () => move(F.db, F.uid, 1, { hits: 100 + 20 * g + 2 * g2, uses: 61, role: 1, form: 1, pool: 0 }, { ...c2, hits: c2.hits + 2 * g2 }));
    await expect(false, "같은 형태에서 기력을 0부터 다시 세기", () => move(F.db, F.uid, 1, { hits: 100 + 20 * g + 2 * g2, uses: 1, role: 1, form: 1, pool: 0 }, { ...c2, hits: c2.hits + 2 * g2 }));
  }

  console.log("새 형태 — 기력이 다시 차고 역할을 바꿀 수 있다 (3.0 2형)");
  await bypass(`plazaRaids/${rid(2)}/fighters/${G.uid}`, { hits: int(240), uses: int(60), role: int(1), form: int(1), pool: int(0), lastAt: ts(now - MIN), shard: int(G.s) });
  await steady();
  {
    const g = gapNormal() ? 2 : 1;
    const c = cell(2, G.s);
    await expect(false, "앞 형태의 기력(60)에 이어 세기", () => move(G.db, G.uid, 2, { hits: 240 + 2 * g, uses: 61, role: 1, form: 2, pool: 0 }, { ...c, hits: c.hits + 2 * g }));
    await expect(true, "2형의 첫 커밋: 기력 1부터, 역할을 울타리지기로", () =>
      move(G.db, G.uid, 2, { hits: 240 + 2 * g, uses: 1, role: 3, form: 2, pool: 2 }, { ...c, grd: (c.grd ?? 0) + 2 * g }));
    await sleep(1_100);
    await steady();
    const g2 = gapNormal() ? 2 : 1;
    const c2 = cell(2, G.s);
    await expect(false, "2형 안에서 다시 역할 바꾸기", () =>
      move(G.db, G.uid, 2, { hits: 240 + 2 * g + 2 * g2, uses: 2, role: 1, form: 2, pool: 0 }, { ...c2, hits: c2.hits + 2 * g2 }));
  }

  console.log("2.0 물결(형태 없음)에는 역할을 실을 수 없다");
  await steady();
  {
    const g = gapNormal() ? 2 : 1;
    await expect(false, "2.0 물결에 역할 ×2", () => move(H.db, H.uid, 3, { hits: 2 * g, uses: 1, role: 1, form: 1, pool: 0 }, { hits: 2 * g, fighters: 1 }));
    await expect(true, `2.0 물결에 2.0 모양으로 값 ${g}`, () => move(H.db, H.uid, 3, { hits: g, uses: 1 }, { hits: g, fighters: 1 }));
  }

  console.log("지원(기력과 따로, 20초 간격)");
  {
    const c = cell(1, I.s);
    const aid = (code: number, extra: Record<string, unknown> = {}, shard: Partial<Cell> & Record<string, unknown> = {}) =>
      move(I.db, I.uid, 1, { hits: 0, uses: 0, aid: code, aidAt: serverTimestamp(), aids: 1, ...extra }, { ...c, fighters: c.fighters + 1, names: [...(c.names ?? []), "아이"], aid: code, aidAt: serverTimestamp(), aidBy: "아이", ...shard } as Cell);
    await expect(false, "없는 지원 종류 4", () => aid(4));
    await expect(false, "지원하며 센 값도 올리기", () => aid(1, { hits: 5 }, { hits: c.hits + 5 }));
    await expect(false, "칸에 다른 지원을 적기", () => aid(1, {}, { aid: 2 }));
    await expect(true, "역할을 고르기 전에 지원만으로 처음 들기(북)", () => aid(1));
    await sleep(1_500);
    await expect(false, "20초 안에 다시 지원", () => move(I.db, I.uid, 1, { hits: 0, uses: 0, aid: 2, aidAt: serverTimestamp(), aids: 2 }, { ...cell(1, I.s), aid: 2, aidAt: serverTimestamp(), aidBy: "아이" } as Cell));
    // 지원으로 먼저 든 사람(표식에 역할이 없다)이 역할을 골라 첫 한 방을 넣는다. 지원 기록은 그대로 옮겨야 한다.
    await bypass(`plazaRaids/${rid(1)}/fighters/${J.uid}`, { hits: int(0), uses: int(0), aid: int(1), aidAt: ts(now - MIN), aids: int(1), lastAt: ts(now - MIN), shard: int(J.s) });
    await steady();
    const g = gapNormal() ? 2 : 1;
    const cj = cell(1, J.s);
    const kept = { aid: 1, aidAt: new Date(now - MIN), aids: 1 };
    await expect(false, "역할을 고르며 지원 횟수를 지우기", () => move(J.db, J.uid, 1, { hits: 2 * g, uses: 1, role: 2, form: 1, pool: 1 }, { ...cj, brk: (cj.brk ?? 0) + 2 * g }));
    await expect(true, "지원으로 든 뒤 역할을 골라 첫 한 방", () => move(J.db, J.uid, 1, { hits: 2 * g, uses: 1, role: 2, form: 1, pool: 1, ...kept }, { ...cj, brk: (cj.brk ?? 0) + 2 * g }));
    console.log("  (20초 기다린다)");
    await sleep(20_000);
    await expect(true, "20초 뒤 다시 지원(우산)", () => move(I.db, I.uid, 1, { hits: 0, uses: 0, aid: 2, aidAt: serverTimestamp(), aids: 2 }, { ...cell(1, I.s), aid: 2, aidAt: serverTimestamp(), aidBy: "아이" } as Cell));
  }

  console.log("넘기기 — 30분을 넘긴 1형은 쓰러진다 (물결 1)");
  for (let s = 0; s < 8; s++) await seedCell(1, s, {});
  await seedCell(1, 0, { hits: 200, brk: 100, fighters: 2 });
  await seedCell(1, 1, { hits: 178, fighters: 2 });
  await expect(false, "갑옷이 덜 찼는데(100/162) 쓰러뜨리기", () => updateDoc(doc(A.db, "plazaRaids", rid(1)), { defeatedAt: serverTimestamp() }));
  await seedCell(1, 2, { brk: 62, fighters: 1 });
  await expect(false, "30분을 넘겼는데 변신하기", () =>
    updateDoc(doc(A.db, "plazaRaids", rid(1)), { form: 2, formAt: serverTimestamp(), n: 540, base: { h: 378, b: 162, g: 0 }, hp: 378 + 270, brk: 162 + 135, grd: 135 }));
  await expect(false, "쓰러뜨리며 체력도 바꾸기", () => updateDoc(doc(A.db, "plazaRaids", rid(1)), { defeatedAt: serverTimestamp(), hp: 1 }));
  await expect(true, "세 게이지가 다 찬 1형을 쓰러뜨리기(30분 넘김)", () => updateDoc(doc(A.db, "plazaRaids", rid(1)), { defeatedAt: serverTimestamp() }));
  await expect(false, "쓰러진 시각을 다시 찍기", () => updateDoc(doc(A.db, "plazaRaids", rid(1)), { defeatedAt: serverTimestamp() }));
  await sleep(1_100);
  await expect(false, "쓰러진 뒤 지원", () => move(B.db, B.uid, 1, { hits: 0, uses: 0, aid: 1, aidAt: serverTimestamp(), aids: 1 }, { ...cell(1, B.s), aid: 1, aidAt: serverTimestamp(), aidBy: "비" } as Cell));

  console.log("넘기기 — 30분 안에 채운 1형은 변신한다 (물결 4, 온 사람 20명)");
  // 합계: 체력 390(목표 378) · 갑옷 170(목표 162) · 인원 20 → 다음 필요량 max(540, 72 × 20 = 1440) = 1440.
  await seedCell(4, 0, { hits: 200, brk: 100, fighters: 12 });
  await seedCell(4, 1, { hits: 190, brk: 70, fighters: 8 });
  const morph = (over: Record<string, unknown> = {}) =>
    updateDoc(doc(A.db, "plazaRaids", rid(4)), { form: 2, formAt: serverTimestamp(), n: 1440, base: { h: 390, b: 170, g: 0 }, hp: 390 + 720, brk: 170 + 360, grd: 360, ...over });
  await expect(false, "빨리 채웠는데 쓰러뜨리기(변신해야 한다)", () => updateDoc(doc(A.db, "plazaRaids", rid(4)), { defeatedAt: serverTimestamp() }));
  await expect(false, "두 형태를 건너뛰기(3형으로)", () => morph({ form: 3 }));
  await expect(false, "필요량을 기본값으로 줄이기(20명인데 540)", () => morph({ n: 540, hp: 390 + 270, brk: 170 + 135, grd: 135 }));
  await expect(false, "필요량을 부풀리기(6000)", () => morph({ n: 6000, hp: 390 + 3000, brk: 170 + 1500, grd: 1500 }));
  await expect(false, "60 단위가 아닌 필요량(1450)", () => morph({ n: 1450, hp: 390 + 725, brk: 170 + 362, grd: 362 }));
  await expect(false, "몫을 다르게 나누기(체력을 덜)", () => morph({ hp: 390 + 100 }));
  await expect(false, "시작점을 합계보다 높게(체력 500)", () => morph({ base: { h: 500, b: 170, g: 0 }, hp: 500 + 720 }));
  await expect(false, "시작점을 앞 목표보다 낮게(체력 300)", () => morph({ base: { h: 300, b: 170, g: 0 }, hp: 300 + 720 }));
  await expect(false, "변신하며 태어난 때를 바꾸기", () => morph({ spawnedAt: serverTimestamp() }));
  await expect(true, "변신: 2형, 필요량 1440(체력 720·갑옷 360·울타리 360)", () => morph());
  await expect(false, "2형이 덜 찼는데 또 변신", () =>
    updateDoc(doc(A.db, "plazaRaids", rid(4)), { form: 3, formAt: serverTimestamp(), n: 1440, base: { h: 390, b: 170, g: 0 }, hp: 390 + 576, brk: 170 + 432, grd: 432 }));
  await expect(false, "2형이 덜 찼는데 쓰러뜨리기", () => updateDoc(doc(A.db, "plazaRaids", rid(4)), { defeatedAt: serverTimestamp() }));
  // 읽은 뒤 몇 방 더 들어온 것은 받는다: 시작점이 합계보다 조금 낮아도, 인원을 몇 명 덜 읽었어도.
  await seedV3(4, { form: 1, formAt: now - 5 * MIN, spawnedAt: now - 5 * MIN, hp: 378, brk: 162, grd: 0 });
  await seedCell(4, 0, { hits: 200, brk: 100, fighters: 12 });
  await seedCell(4, 1, { hits: 190, brk: 70, fighters: 8 });
  await expect(true, "변신: 조금 늦게 읽은 값(시작점 380·165, 인원 17명 몫 1260)", () =>
    updateDoc(doc(B.db, "plazaRaids", rid(4)), { form: 2, formAt: serverTimestamp(), n: 1260, base: { h: 380, b: 165, g: 0 }, hp: 380 + 630, brk: 165 + 315, grd: 315 }));

  console.log("넘기기 — 3형은 빨리 채워도 쓰러진다 (물결 5)");
  await seedCell(5, 0, { hits: 1116, brk: 562, grd: 300, fighters: 5 });
  await expect(false, "울타리가 덜 찼는데(300/362) 쓰러뜨리기", () => updateDoc(doc(A.db, "plazaRaids", rid(5)), { defeatedAt: serverTimestamp() }));
  await seedCell(5, 1, { grd: 62, fighters: 1 });
  await expect(false, "3형에서 또 변신(4형은 없다)", () =>
    updateDoc(doc(A.db, "plazaRaids", rid(5)), { form: 4, formAt: serverTimestamp(), n: 540, base: { h: 1116, b: 562, g: 362 }, hp: 1116 + 216, brk: 562 + 162, grd: 362 + 162 }));
  await expect(true, "3형을 쓰러뜨리기(5분 만에 채웠어도)", () => updateDoc(doc(A.db, "plazaRaids", rid(5)), { defeatedAt: serverTimestamp() }));

  console.log("2.0 물결은 체력 하나로 쓰러진다 (물결 3)");
  for (let s = 0; s < 8; s++) await seedCell(3, s, {});
  await seedCell(3, 0, { hits: 269, fighters: 3 });
  await expect(false, "합계 269로 쓰러뜨리기(체력 270)", () => updateDoc(doc(A.db, "plazaRaids", rid(3)), { defeatedAt: serverTimestamp() }));
  await expect(false, "2.0 물결을 변신시키기", () =>
    updateDoc(doc(A.db, "plazaRaids", rid(3)), { form: 2, formAt: serverTimestamp(), n: 540, base: { h: 269, b: 0, g: 0 }, hp: 269 + 270, brk: 135, grd: 135 }));
  await seedCell(3, 1, { hits: 1, fighters: 1 });
  await expect(true, "합계 270으로 쓰러뜨리기", () => updateDoc(doc(A.db, "plazaRaids", rid(3)), { defeatedAt: serverTimestamp() }));

  console.log("도망(3시간)");
  await seedV3(2, { form: 2, formAt: now - 100 * MIN, spawnedAt: now - 190 * MIN, n: 540, hp: 670, brk: 305, grd: 135, base: [400, 170, 0] });
  await steady();
  await expect(false, "도망간 물결 치기", () => move(A.db, A.uid, 2, { hits: 2, uses: 1, role: 1, form: 2, pool: 0 }, { hits: 2, fighters: 1 }));
  await expect(false, "도망간 물결에 지원", () => move(A.db, A.uid, 2, { hits: 0, uses: 0, aid: 1, aidAt: serverTimestamp(), aids: 1 }, { hits: 0, fighters: 1, aid: 1, aidAt: serverTimestamp(), aidBy: "에이" } as Cell));
  await expect(false, "칸 지우기", () => deleteDoc(doc(A.db, "plazaRaids", rid(2), "shards", "0")));

  console.log(failed ? `\n실패 ${failed} · 통과 ${passed}` : `\n모두 기대대로 (${passed})`);
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
