/**
 * 특별한 책 규칙 점검 — **로컬 에뮬레이터에만** 붙는다(docs/garden-miniroom.md "특별한 책 혜택").
 *
 *   firebase emulators:exec --only firestore --project demo-jamtong "pnpm check:library-rules"
 *
 * 빌려 읽기 표식(gardens/{gid}/reads/{uid})과 공개 정원의 새 칭호(read·lib), 서버만 쓰는 질문 수(bookAsks)를 본다.
 */
import { initializeApp } from "firebase/app";
import { collection, connectFirestoreEmulator, doc, getDocs, getFirestore, serverTimestamp, setDoc, type Firestore } from "firebase/firestore";

const EMU = process.env.FIRESTORE_EMULATOR_HOST;
const PROJECT = process.env.GCLOUD_PROJECT ?? "demo-jamtong";
if (!EMU || !PROJECT.startsWith("demo-")) {
  console.error("에뮬레이터의 demo- 프로젝트에서만 돈다 — firebase emulators:exec로 돌린다.");
  process.exit(1);
}
const [HOST, PORT_TEXT] = EMU.split(":");
const PORT = Number(PORT_TEXT);
const day = Math.floor((Date.now() + 9 * 3600000) / 86400000);

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

const OWNER = "uOwner", GUEST = "uGuest", OTHER = "uOther";
const gid = "glibrary001";
const pub = (over: Record<string, unknown> = {}) => ({ ownerUid: OWNER, nick: "서재", beds: [], dex: 0, golden: 0, rainbow: 0, updatedAt: serverTimestamp(), ...over });

(async () => {
  await fetch(`http://${HOST}:${PORT}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
  const owner = client(OWNER), guest = client(GUEST), other = client(OTHER);

  console.log("공개 정원 — 새 칭호");
  await expect(true, "애독가 2·서재지기 3으로 공개", () => setDoc(doc(owner, "gardens", gid), pub({ titles: { dex: 1, read: 2, lib: 3 } })));
  await expect(false, "서재지기 4(없는 단계)", () => setDoc(doc(owner, "gardens", gid), pub({ titles: { lib: 4 } })));
  await expect(false, "모르는 칭호", () => setDoc(doc(owner, "gardens", gid), pub({ titles: { vip: 1 } })));
  await expect(true, "다시 바른 칭호로", () => setDoc(doc(owner, "gardens", gid), pub({ titles: { read: 1 } })));

  console.log("빌려 읽기 표식");
  const lend = (db: Firestore, uid: string, over: Record<string, unknown> = {}) =>
    setDoc(doc(db, "gardens", gid, "reads", uid), { day, at: serverTimestamp(), nick: "손님", b: "autobiography", ...over });
  await expect(false, "주인이 제 방 책을 빌려 읽기", () => lend(owner, OWNER));
  await expect(false, "남의 이름으로 남기기", () => lend(guest, OTHER));
  await expect(false, "어제 날짜로", () => lend(guest, GUEST, { day: day - 1 }));
  await expect(false, "책 자리에 글", () => lend(guest, GUEST, { b: "<script>" }));
  await expect(false, "모르는 칸을 더하기", () => lend(guest, GUEST, { jam: 999 }));
  await expect(true, "손님이 오늘 한 번", () => lend(guest, GUEST));
  await expect(false, "같은 날 또", () => lend(guest, GUEST, { b: "revolution" }));
  await expect(true, "다른 손님도 오늘 한 번", () => lend(other, OTHER));
  await expect(true, "주인은 오늘 표식을 모두 읽는다", () => getDocs(collection(owner, "gardens", gid, "reads")));
  await expect(false, "손님은 남의 표식까지 읽지 못한다", () => getDocs(collection(guest, "gardens", gid, "reads")));
  await expect(false, "가린 방에는 남기지 못한다", async () => {
    const hidden = "glibrary002";
    await setDoc(doc(owner, "gardens", hidden), { ownerUid: OWNER, hidden: true, updatedAt: serverTimestamp() }).catch(() => null);
    return setDoc(doc(guest, "gardens", hidden, "reads", GUEST), { day, at: serverTimestamp(), nick: "손님", b: "autobiography" });
  });

  console.log("질문 수(bookAsks) — 서버 계정만");
  await expect(false, "내 질문 수를 화면이 지우기", () => setDoc(doc(owner, "bookAsks", OWNER), { day, n: {} }));

  console.log(failed ? `\n실패 ${failed}` : "\n모두 기대대로");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
