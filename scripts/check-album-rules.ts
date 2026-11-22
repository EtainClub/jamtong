/**
 * 사진첩 2 규칙 점검 — **로컬 에뮬레이터에만** 붙는다(docs/garden-album-review.md).
 *
 *   firebase emulators:exec --only firestore --project demo-jamtong "pnpm check:album-rules"
 *
 * gardens/{gid}/photos(주인만), photoComments(방명록 같은 한 줄, 받기 설정), photoScraps(한 번, 순간은 못 퍼감)를 본다.
 */
import { initializeApp } from "firebase/app";
import { collection, connectFirestoreEmulator, deleteDoc, doc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc, type Firestore } from "firebase/firestore";

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
const gid = "galbum0001";
const pub = (over: Record<string, unknown> = {}) => ({ ownerUid: OWNER, nick: "사진첩", beds: [], dex: 0, golden: 0, rainbow: 0, updatedAt: serverTimestamp(), ...over });
const photo = (over: Record<string, unknown> = {}) => ({ a: "p:national-debt#nd-1", p: 11, k: 0, f: 4, x: "엄마가 물어봐서 찾아봤어요", at: Date.now(), ...over });

(async () => {
  await fetch(`http://${HOST}:${PORT}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
  const owner = client(OWNER), guest = client(GUEST), other = client(OTHER);
  await setDoc(doc(owner, "gardens", gid), pub());

  console.log("사진(photos) — 주인만, 앵커와 한 줄의 모양");
  const put = (db: Firestore, id: string, data: Record<string, unknown>) => setDoc(doc(db, "gardens", gid, "photos", id), data);
  await expect(true, "정책 팩트 한 줄 + 60자 한 줄", () => put(owner, "ph0001", photo()));
  await expect(true, "내 정원의 순간(md 있음)", () => put(owner, "ph0002", photo({ a: "m:raid", md: { s: "troll", v: 207771 }, x: "" })));
  await expect(true, "카툰 한 칸", () => put(owner, "ph0003", photo({ a: "a:birth-rebound/br-e-why", x: "" })));
  await expect(true, "퍼 온 사진(출처)", () => put(owner, "ph0004", photo({ a: "w:reform-is-hard#rh-one", fg: "gother0001", fp: "src001", fn: "이웃" })));
  const roomSn = { size: 1, wall: "wall-mint", floor: "floor-wood", mood: "happy", placed: [{ a: "f0", p: "2~3", i: "bed" }], avatar: "2;3~4;0;1;2;" };
  const yardSn = { b: [{ s: "p:national-debt", g: 100 }, null], y: ["scarecrow", null, null, null, null], m: "happy" };
  const snap = (a: string, sn: unknown) => photo({ a, md: { v: 29_000_000 }, x: "드디어 피아노를 들였어요", p: 31, f: 8, ...(sn === undefined ? {} : { sn }) });
  await expect(true, "내 방 스냅샷", () => put(owner, "ph0005", snap("m:room", roomSn)));
  await expect(true, "내 텃밭 스냅샷", () => put(owner, "ph0006", snap("m:yard", yardSn)));
  await expect(false, "스냅샷인데 sn 없음", () => put(owner, "ph0020", snap("m:room", undefined)));
  await expect(false, "sn이 스냅샷 아닌 사진에", () => put(owner, "ph0021", photo({ sn: yardSn })));
  await expect(false, "방 스냅샷에 방 한마디(글)", () => put(owner, "ph0022", snap("m:room", { ...roomSn, motto: "놀러 오세요" })));
  await expect(false, "방 모양으로 텃밭 스냅샷", () => put(owner, "ph0023", snap("m:yard", roomSn)));
  await expect(false, "텃밭 밭 13칸", () => put(owner, "ph0024", snap("m:yard", { ...yardSn, b: Array(13).fill(null) })));
  await expect(false, "손님이 남의 방에 사진", () => put(guest, "ph0009", photo()));
  await expect(false, "모르는 앵커(링크)", () => put(owner, "ph0010", photo({ a: "https://x.com" })));
  await expect(false, "순간인데 md 없음", () => put(owner, "ph0011", photo({ a: "m:raid" })));
  await expect(false, "md가 순간이 아닌데", () => put(owner, "ph0012", photo({ md: { s: "x" } })));
  await expect(false, "61자 한 줄", () => put(owner, "ph0013", photo({ x: "가".repeat(61) })));
  await expect(false, "문구 번호 32", () => put(owner, "ph0014", photo({ p: 32 })));
  await expect(true, "직접 쓰기(31) + 미니룸 폴더(8)", () => put(owner, "ph0007", snap("m:room", roomSn)));
  await expect(false, "폴더 번호 16", () => put(owner, "ph0017", photo({ f: 16 })));
  await expect(false, "모르는 칸", () => put(owner, "ph0015", photo({ jam: 1 })));
  await expect(false, "처음부터 hidden", () => put(owner, "ph0016", photo({ hidden: false })));
  await expect(false, "사진 id 모양", () => put(owner, "PH_1", photo()));
  await expect(true, "주인이 문구·대표를 고친다", () => updateDoc(doc(owner, "gardens", gid, "photos", "ph0001"), { p: 1, cv: true }));
  await expect(false, "주인이 앵커를 바꾼다", () => updateDoc(doc(owner, "gardens", gid, "photos", "ph0001"), { a: "p:national-debt#nd-2" }));
  await expect(false, "주인이 hidden을 단다", () => updateDoc(doc(owner, "gardens", gid, "photos", "ph0001"), { hidden: true }));
  await expect(true, "손님은 읽는다", () => getDocs(collection(guest, "gardens", gid, "photos")));

  console.log("댓글(photoComments) — 하루 한 번, 받기 설정, 사진이 있고 댓글을 끄지 않았을 때");
  const cm = (db: Firestore, uid: string, ph: string, over: Record<string, unknown> = {}, d = day) =>
    setDoc(doc(db, "gardens", gid, "photoComments", `${uid}_${ph}_${d}`), { ph, g: "", n: "손님", p: 1, x: "", k: 2, at: serverTimestamp(), ...over });
  await expect(true, "손님이 문구 댓글", () => cm(guest, GUEST, "ph0001"));
  await expect(false, "같은 날 같은 사진에 또", () => cm(guest, GUEST, "ph0001", { p: 2 }));
  await expect(true, "같은 날 다른 사진", () => cm(guest, GUEST, "ph0002", { p: -1, x: "축하해요!" }));
  await expect(false, "어제 id로", () => cm(other, OTHER, "ph0001", {}, day - 1));
  await expect(false, "남의 uid로", () => cm(guest, OTHER, "ph0003"));
  await expect(false, "없는 사진", () => cm(other, OTHER, "ph9999"));
  await expect(false, "문구와 글을 함께", () => cm(other, OTHER, "ph0003", { p: 1, x: "같이" }));
  await expect(true, "주인이 제 사진에 답글", () => cm(owner, OWNER, "ph0001"));
  await setDoc(doc(owner, "gardens", gid, "photos", "ph0003"), photo({ a: "a:birth-rebound/br-e-why", x: "", nc: true }));
  await expect(false, "댓글을 끈 사진", () => cm(other, OTHER, "ph0003"));
  await setDoc(doc(owner, "gardens", gid), pub({ guestbook: "off" }));
  await expect(false, "방명록을 받지 않는 방", () => cm(other, OTHER, "ph0004"));
  await expect(true, "그래도 주인은", () => cm(owner, OWNER, "ph0004"));
  await setDoc(doc(owner, "gardens", gid), pub({ guestbook: "all" }));
  await setDoc(doc(owner, "gardens", gid, "blocks", OTHER), { n: "차단", at: serverTimestamp() });
  await expect(false, "차단된 사람", () => cm(other, OTHER, "ph0004"));
  await expect(true, "주인이 손님 댓글을 지운다", () => deleteDoc(doc(owner, "gardens", gid, "photoComments", `${GUEST}_ph0002_${day}`)));
  await expect(false, "남이 남의 댓글을 지운다", () => deleteDoc(doc(other, "gardens", gid, "photoComments", `${GUEST}_ph0001_${day}`)));

  console.log("퍼감(photoScraps) — 한 사진에 한 번, 순간은 못 퍼감");
  const sc = (db: Firestore, uid: string, ph: string, over: Record<string, unknown> = {}) =>
    setDoc(doc(db, "gardens", gid, "photoScraps", `${uid}_${ph}`), { ph, g: "", n: "손님", at: serverTimestamp(), ...over });
  await expect(true, "손님이 퍼 간다", () => sc(guest, GUEST, "ph0001"));
  await expect(false, "같은 사진을 또", () => sc(guest, GUEST, "ph0001", { n: "다시" }));
  await expect(false, "순간 사진", () => sc(guest, GUEST, "ph0002"));
  await expect(false, "주인이 제 사진을", () => sc(owner, OWNER, "ph0001"));
  await expect(false, "남의 공개 id를 적기", () => sc(guest, GUEST, "ph0004", { g: gid }));
  await expect(true, "주인은 퍼감을 읽는다", () => getDocs(collection(owner, "gardens", gid, "photoScraps")));

  console.log("가린 방");
  await setDoc(doc(owner, "gardens", gid), { ownerUid: OWNER, hidden: true, updatedAt: serverTimestamp() });
  await expect(false, "가린 방의 사진을 손님이 읽기", () => getDocs(collection(guest, "gardens", gid, "photos")));
  await expect(false, "가린 방에 댓글", () => cm(guest, GUEST, "ph0004"));
  await expect(true, "주인은 가린 방의 사진을 읽는다", () => getDocs(collection(owner, "gardens", gid, "photos")));

  console.log(failed ? `\n실패 ${failed}` : "\n모두 기대대로");
  process.exit(failed ? 1 : 0);
})();
