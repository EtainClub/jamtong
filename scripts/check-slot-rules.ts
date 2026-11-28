/**
 * 슬롯머신 규칙 점검 — **로컬 에뮬레이터에만** 붙는다(docs/garden-slots.md).
 *
 *   firebase emulators:exec --only firestore --project demo-jamtong "pnpm check:slot-rules"
 *
 * 광장 잼 항아리(plazaPot/{물결}/givers/{uid}), 뽑기 기계 증정 상자(gardens/{gid}/giftBox/stock·giftWins/{uid}), 칭호 rare를 본다.
 */
import { initializeApp } from "firebase/app";
import { collection, connectFirestoreEmulator, deleteField, doc, getDoc, getDocs, getFirestore, increment, runTransaction, serverTimestamp, setDoc, updateDoc, type Firestore } from "firebase/firestore";

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
const gid = "gslot00001";
const pub = (over: Record<string, unknown> = {}) => ({ ownerUid: OWNER, nick: "슬롯", beds: [], dex: 0, golden: 0, rainbow: 0, updatedAt: serverTimestamp(), ...over });

(async () => {
  await fetch(`http://${HOST}:${PORT}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
  const owner = client(OWNER), guest = client(GUEST), other = client(OTHER);

  console.log("칭호 rare");
  await expect(true, "희귀종 수집가 3단계로 공개", () => setDoc(doc(owner, "gardens", gid), pub({ titles: { dex: 1, rare: 3 } })));
  await expect(false, "희귀종 수집가 4단계", () => setDoc(doc(owner, "gardens", gid), pub({ titles: { rare: 4 } })));
  await setDoc(doc(owner, "gardens", gid), pub());

  console.log("광장 잼 항아리");
  const wave = `${day}-2`;
  const give = (db: Firestore, uid: string, j: number, id = wave) => setDoc(doc(db, "plazaPot", id, "givers", uid), { j, at: serverTimestamp() });
  await expect(true, "씨앗 슬롯 한 번(4)", () => give(guest, GUEST, 4));
  await expect(true, "방 슬롯 한 번 더(+7)", () => give(guest, GUEST, 11));
  await expect(false, "한 번에 100", () => give(guest, GUEST, 111));
  await expect(false, "줄이기", () => give(guest, GUEST, 7));
  await expect(false, "남의 몫에 쓰기", () => give(guest, OTHER, 4));
  await expect(true, "내일 아침 물결에(저녁이 지난 뒤)", () => give(other, OTHER, 4, `${day + 1}-1`));
  await expect(false, "모레 물결에", () => give(other, OTHER, 4, `${day + 2}-1`));
  await expect(false, "어제 물결에", () => give(other, OTHER, 4, `${day - 1}-3`));
  await expect(false, "물결 id 모양", () => give(other, OTHER, 4, "abc"));
  await expect(false, "모르는 칸", () => setDoc(doc(other, "plazaPot", wave, "givers", OTHER), { j: 4, at: serverTimestamp(), jam: 1 }));
  await expect(true, "누구나 합계를 읽는다", () => getDocs(collection(other, "plazaPot", wave, "givers")));

  console.log("뽑기 기계 증정 상자");
  const stock = (db: Firestore) => doc(db, "gardens", gid, "giftBox", "stock");
  const win = (db: Firestore, uid: string) => doc(db, "gardens", gid, "giftWins", uid);
  await expect(true, "주인이 상자를 만든다", () => setDoc(stock(owner), { items: { chair: 2, lamp: 1 }, at: serverTimestamp() }));
  await expect(true, "주인이 하나 더 넣는다", () => updateDoc(stock(owner), { "items.chair": increment(1), at: serverTimestamp() }));
  await expect(false, "손님이 상자를 마음대로 고친다", () => updateDoc(stock(guest), { "items.chair": 0 }));
  await expect(false, "상자에 모르는 칸", () => setDoc(stock(owner), { items: {}, at: serverTimestamp(), x: 1 }));
  await expect(true, "누구나(열린 방) 상자를 읽는다", () => getDoc(stock(other)));
  // 손님 한 번 — 기록과 빼기를 한 번에.
  const take = (db: Firestore, uid: string, it: string, left: number, over: Record<string, unknown> = {}) =>
    runTransaction(db, async (tx) => {
      await tx.get(stock(db));
      tx.set(win(db, uid), { day, it, n: "손님", at: serverTimestamp(), ...over });
      if (it) tx.update(stock(db), { [`items.${it}`]: left });
    });
  await expect(false, "기록 없이 빼기만", () => updateDoc(stock(guest), { "items.chair": 2 }));
  await expect(false, "적은 것과 다른 것을 뺀다", () =>
    runTransaction(guest, async (tx) => {
      await tx.get(stock(guest));
      tx.set(win(guest, GUEST), { day, it: "chair", n: "손님", at: serverTimestamp() });
      tx.update(stock(guest), { "items.lamp": 0 });
    }));
  await expect(false, "둘을 뺀다", () => take(guest, GUEST, "chair", 1));
  await expect(false, "빼지 않고 받았다고 적는다", () => setDoc(win(guest, GUEST), { day, it: "chair", n: "손님", at: serverTimestamp() }));
  await expect(false, "상자에 없는 것", () => take(guest, GUEST, "piano", 0));
  await expect(true, "손님이 오늘 하나 받는다", () => take(guest, GUEST, "chair", 2));
  await expect(false, "같은 날 또", () => take(guest, GUEST, "lamp", 0));
  await expect(false, "같은 날 꽝으로 또", () => setDoc(win(guest, GUEST), { day, it: "", n: "손님", at: serverTimestamp() }));
  await expect(true, "다른 손님은 꽝", () => setDoc(win(other, OTHER), { day, it: "", n: "다른", at: serverTimestamp() }));
  await expect(false, "주인이 제 기계를", () => take(owner, OWNER, "lamp", 0));
  await expect(false, "남의 이름으로", () => take(guest, "uNobody", "lamp", 0));
  await expect(false, "어제 날짜로", () => setDoc(win(client("uY"), "uY"), { day: day - 1, it: "", n: "어제", at: serverTimestamp() }));
  await expect(true, "주인은 기록을 읽는다", () => getDocs(collection(owner, "gardens", gid, "giftWins")));
  await expect(false, "손님은 모두의 기록을 읽지 못한다", () => getDocs(collection(guest, "gardens", gid, "giftWins")));
  await expect(true, "손님은 제 기록을 읽는다", () => getDoc(win(guest, GUEST)));
  const third = client("uThird");
  await expect(true, "마지막 하나는 칸째로 지운다", () =>
    runTransaction(third, async (tx) => {
      await tx.get(stock(third));
      tx.set(win(third, "uThird"), { day, it: "lamp", n: "셋째", at: serverTimestamp() });
      tx.update(stock(third), { "items.lamp": deleteField() });
    }));
  await setDoc(doc(owner, "gardens", gid), { ownerUid: OWNER, hidden: true, updatedAt: serverTimestamp() });
  await expect(false, "가린 방에서는 돌리지 못한다", () => setDoc(win(client("uNew"), "uNew"), { day, it: "", n: "새", at: serverTimestamp() }));

  console.log(failed ? `\n실패 ${failed}` : "\n모두 기대대로");
  process.exit(failed ? 1 : 0);
})();
