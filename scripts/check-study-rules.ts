/**
 * 잼공 기록 규칙 점검 — **로컬 에뮬레이터에만** 붙는다(docs/daily-study.md §11).
 *
 *   firebase emulators:exec --only firestore --project demo-jamtong "pnpm check:study-rules"
 *
 * users/{uid}/study/state — 본인만 읽고 쓰고, 모양과 크기만 본다.
 */
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, deleteDoc, doc, getDoc, getFirestore, setDoc, type Firestore } from "firebase/firestore";

const EMU = process.env.FIRESTORE_EMULATOR_HOST;
const PROJECT = process.env.GCLOUD_PROJECT ?? "demo-jamtong";
if (!EMU || !PROJECT.startsWith("demo-")) {
  console.error("에뮬레이터의 demo- 프로젝트에서만 돈다 — firebase emulators:exec로 돌린다.");
  process.exit(1);
}
const [HOST, PORT_TEXT] = EMU.split(":");
const PORT = Number(PORT_TEXT);

let n = 0;
function client(uid: string): Firestore {
  const app = initializeApp({ projectId: PROJECT, apiKey: "x" }, `app${n++}`);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, HOST, PORT, { mockUserToken: { sub: uid, user_id: uid } });
  return db;
}

let failed = 0;
async function expect(allowed: boolean, label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    if (allowed) console.log(`  ✓ ${label}`);
    else { failed++; console.log(`  ✗ ${label} — 통과했다(막혀야 한다)`); }
  } catch (e) {
    const msg = String((e as { message?: string }).message);
    const denied = (e as { code?: string }).code === "permission-denied" || /permission|insufficient/i.test(msg);
    if (!allowed && denied) console.log(`  ✓ ${label} — 막혔다`);
    else { failed++; console.log(`  ✗ ${label} — ${allowed ? "막혔다" : "다른 오류"}: ${msg.slice(0, 200)}`); }
  }
}

const ME = "uMe", OTHER = "uOther";
const rec = (over: Record<string, unknown> = {}) => ({
  v: 1, goal: 1, days: { "2026-11-28": 1 }, boxes: { "a:daejangdong/ox1": [2, "2026-12-01"] }, wallet: ["a:daejangdong/ox1"],
  intro: true, goalAsked: false, level: 1, stay: false, updatedAt: Date.now(), ...over,
});

(async () => {
  await fetch(`http://${HOST}:${PORT}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
  const me = client(ME), other = client(OTHER);
  const mine = (db: Firestore, id = "state") => doc(db, "users", ME, "study", id);

  console.log("잼공 기록 — 본인만, 모양과 크기");
  await expect(true, "내 기록 쓰기", () => setDoc(mine(me), rec()));
  await expect(true, "내 기록 읽기", () => getDoc(mine(me)));
  await expect(true, "단계·목표 물음 칸이 없는 옛 기록(3.0)", () => {
    const old: Record<string, unknown> = rec();
    for (const key of ["level", "goalAsked", "stay"]) delete old[key];
    return setDoc(mine(me), old);
  });
  await expect(false, "남이 내 기록 읽기", () => getDoc(mine(other)));
  await expect(false, "남이 내 기록 쓰기", () => setDoc(mine(other), rec()));
  await expect(false, "state 말고 다른 문서", () => setDoc(mine(me, "extra"), rec()));
  await expect(false, "버전 2", () => setDoc(mine(me), rec({ v: 2 })));
  await expect(false, "목표 4판", () => setDoc(mine(me), rec({ goal: 4 })));
  await expect(false, "단계 6", () => setDoc(mine(me), rec({ level: 6 })));
  await expect(false, "날 401개", () => setDoc(mine(me), rec({ days: Object.fromEntries(Array.from({ length: 401 }, (_, k) => [`d${k}`, 1])) })));
  await expect(false, "상자가 목록", () => setDoc(mine(me), rec({ boxes: [] })));
  await expect(false, "안내 여부가 글자", () => setDoc(mine(me), rec({ intro: "yes" })));
  await expect(true, "내 기록 지우기", () => deleteDoc(mine(me)));

  console.log(failed ? `\n✗ ${failed}개 어긋남` : "\n✓ 모두 맞다");
  process.exit(failed ? 1 : 0);
})();
