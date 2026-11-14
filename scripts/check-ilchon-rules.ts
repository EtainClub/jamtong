/**
 * 1촌 규칙 점검 — **로컬 에뮬레이터에만** 붙는다(docs/garden-miniroom.md §5.5).
 *
 *   firebase emulators:exec --only firestore --project demo-jamtong "pnpm check:ilchon-rules"
 *
 * scripts/check-rules.ts는 실제 프로젝트에 대고 돌지만, 이것은 가짜 사용자 여럿(mockUserToken)과 운영자를
 * 만들고 문서를 마음대로 심어야 해서 에뮬레이터에서만 돈다. FIRESTORE_EMULATOR_HOST가 없으면 돌지 않는다.
 * @firebase/rules-unit-testing을 들이지 않고 이미 있는 firebase 클라이언트만 쓴다.
 */
import { initializeApp } from "firebase/app";
import {
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type Firestore,
} from "firebase/firestore";

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
const day = Math.floor((Date.now() + 9 * 3600000) / 86400000);

type Line = { p: number; x: string; k: number };

let n = 0;
function client(uid: string | null): Firestore {
  const app = initializeApp({ projectId: PROJECT, apiKey: "x" }, `app${n++}`);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, HOST, PORT, uid ? { mockUserToken: { sub: uid, user_id: uid } } : undefined);
  return db;
}

async function bypass(path: string, fields: Record<string, unknown>) {
  const res = await fetch(`http://${HOST}:${PORT}/v1/projects/${PROJECT}/databases/(default)/documents/${path}`, {
    method: "PATCH",
    headers: { Authorization: "Bearer owner", "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`seed ${path}: ${res.status} ${await res.text()}`);
}

let failed = 0;
async function expect(allowed: boolean, label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    if (allowed) console.log(`  ✓ ${label}`);
    else { failed++; console.log(`  ✗ ${label} — 통과했다(막혀야 한다)`); }
  } catch (e) {
    const err = e as { message?: string; code?: string };
    const msg = String(err?.message);
    const denied = err?.code === "permission-denied" || /permission|insufficient/i.test(msg);
    if (!allowed && denied) console.log(`  ✓ ${label} — 막혔다`);
    else { failed++; console.log(`  ✗ ${label} — ${allowed ? "막혔다" : "다른 오류"}: ${msg.slice(0, 200)}`); }
  }
}

const A = "userA", B = "userB", C = "userC", D = "userD", ADMIN = "userAdmin";
const gA = "gaaaaaaaa01", gB = "gbbbbbbbb01", gC = "gcccccccc01";
const pub = (owner: string, nick: string, over: Record<string, unknown> = {}) => ({ ownerUid: owner, nick, beds: [], dex: 0, golden: 0, rainbow: 0, updatedAt: serverTimestamp(), ...over });

(async () => {
  await fetch(`http://${HOST}:${PORT}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
  await bypass(`admins/${ADMIN}`, { on: { booleanValue: true } });
  const a = client(A), b = client(B), c = client(C), d = client(D), admin = client(ADMIN);

  console.log("공개 문서");
  await expect(true, "A 공개(새 키 포함)", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { news: [{ k: 0, s: "w:x", t: 1 }], accept: true, showIlchon: false, guestbook: "all" })));
  await expect(true, "옛 화면 모양으로 공개(새 키 없음)", () => setDoc(doc(b, "gardens", gB), pub(B, "비")));
  await expect(true, "C 공개", () => setDoc(doc(c, "gardens", gC), pub(C, "씨")));
  await expect(false, "보이기를 끈 채 1촌 목록 싣기", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { showIlchon: false, ilchonList: [] })));
  await expect(true, "보이기를 켜고 1촌 목록 싣기", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { showIlchon: true, ilchonList: [{ g: gB, n: "비" }] })));
  await expect(false, "소식 6개", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { news: Array(6).fill({ k: 0, s: "w", t: 1 }) })));
  await expect(false, "방명록 받기 값이 표 밖", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { guestbook: "friends" })));
  await expect(false, "가린 문서에 텃밭을 남기기", () => setDoc(doc(a, "gardens", gA), { ownerUid: A, hidden: true, nick: "에이", updatedAt: serverTimestamp() }));
  await expect(false, "공개 문서에 hidden 섞기", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { hidden: false })));
  await expect(true, "A 다시 공개", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { guestbook: "all", accept: true })));

  console.log("공개 방의 키보드(docs/garden-miniroom.md §4.5)");
  const face = "0123456701234567".repeat(9);
  const key = (over: Record<string, unknown> = {}) => ({ f: face, s: "drum", ...over });
  const room = (keys: unknown) => ({ size: 0, wall: "wp-cream", floor: "fl-wood", mood: "easy", bgm: "orgel", placed: [{ a: "b0", i: "keyboard" }], keys });
  await expect(true, "키 넷(녹음 판 포함)", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key(), key({ s: "rec", v: 3 }), key({ s: "bird" }), key({ s: "none" })]) })));
  await expect(true, "키 없는 방(옛 화면)", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: { size: 0, wall: "wp-cream", floor: "fl-wood", mood: "easy", placed: [] } })));
  await expect(false, "키 셋", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key(), key(), key()]) })));
  await expect(false, "키 다섯", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key(), key(), key(), key(), key()]) })));
  await expect(false, "그림이 143자", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key({ f: face.slice(1) }), key(), key(), key()]) })));
  await expect(false, "그림에 팔레트 밖의 색(8)", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key({ f: "8" + face.slice(1) }), key(), key(), key()]) })));
  await expect(false, "그림 자리에 글", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key({ f: "안녕".repeat(72) }), key(), key(), key()]) })));
  await expect(false, "소리 id 41자", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key({ s: "x".repeat(41) }), key(), key(), key()]) })));
  await expect(false, "녹음 판 0", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key({ s: "rec", v: 0 }), key(), key(), key()]) })));
  await expect(false, "녹음 판이 소수", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key({ s: "rec", v: 1.5 }), key(), key(), key()]) })));
  await expect(false, "녹음 판 1천만", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key({ s: "rec", v: 10_000_000 }), key(), key(), key()]) })));
  await expect(false, "키에 다른 칸(주소)을 덧붙이기", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room([key({ url: "https://x" }), key(), key(), key()]) })));
  await expect(false, "키가 목록이 아니다", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: room({ 0: key() }) })));

  const packed = `${face}:drum:0;`.repeat(4);
  const many = { ...room([key(), key(), key(), key()]), keyboards: Object.fromEntries(Array.from({ length: 8 }, (_, i) => [String(i + 1), packed])) };
  await expect(true, "키보드 아홉 개의 독립된 키", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: many })));
  await expect(false, "키보드 개체 번호 범위 밖", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: { ...many, keyboards: { "9": packed } } })));
  await expect(false, "두 번째 키보드의 잘못된 그림", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: { ...many, keyboards: { "1": `x:drum:0;${packed}` } } })));
  await expect(false, "키보드 목록 자리에 문자열", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: { ...many, keyboards: "x" } })));

  console.log("키보드 가리기(mod/keys)");
  await expect(true, "아무나 가리기 표시 읽기(없는 문서)", () => getDoc(doc(client(null), "gardens", gA, "mod", "keys")));
  await expect(false, "주인이 스스로 가리기 풀기", () => setDoc(doc(a, "gardens", gA, "mod", "keys"), { hidden: false, at: serverTimestamp() }));
  await expect(false, "손님이 가리기", () => setDoc(doc(b, "gardens", gA, "mod", "keys"), { hidden: true, at: serverTimestamp() }));
  await expect(true, "운영자가 가리기", () => setDoc(doc(admin, "gardens", gA, "mod", "keys"), { hidden: true, at: serverTimestamp() }));
  await expect(false, "운영자가 다른 칸을 덧붙이기", () => setDoc(doc(admin, "gardens", gA, "mod", "keys"), { hidden: true, at: serverTimestamp(), why: "글" }));
  await expect(false, "운영자가 다른 mod 문서 쓰기", () => setDoc(doc(admin, "gardens", gA, "mod", "beds"), { hidden: true, at: serverTimestamp() }));
  await expect(true, "아무나 가리기 표시 읽기", () => getDoc(doc(client(null), "gardens", gA, "mod", "keys")).then((x) => { if (x.get("hidden") !== true) throw new Error("가리기가 안 보인다"); }));
  await expect(false, "주인이 가리기 표시 지우기", () => deleteDoc(doc(a, "gardens", gA, "mod", "keys")));
  await expect(true, "운영자가 가리기 풀기", () => setDoc(doc(admin, "gardens", gA, "mod", "keys"), { hidden: false, at: serverTimestamp() }));

  console.log("방 한마디(room.motto, mod/motto)");
  const plain = (over: Record<string, unknown>) => ({ size: 0, wall: "wp-cream", floor: "fl-wood", mood: "easy", bgm: "orgel", placed: [], ...over });
  await expect(true, "한마디 30자", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: plain({ motto: "가".repeat(30) }) })));
  await expect(false, "한마디 31자", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: plain({ motto: "가".repeat(31) }) })));
  await expect(false, "한마디가 글이 아니다", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { room: plain({ motto: 7 }) })));
  await expect(true, "아무나 한마디 가리기 표시 읽기", () => getDoc(doc(client(null), "gardens", gA, "mod", "motto")));
  await expect(false, "주인이 한마디 가리기 표시 쓰기", () => setDoc(doc(a, "gardens", gA, "mod", "motto"), { hidden: false, at: serverTimestamp() }));
  await expect(true, "운영자가 한마디 가리기", () => setDoc(doc(admin, "gardens", gA, "mod", "motto"), { hidden: true, at: serverTimestamp() }));
  await expect(false, "운영자도 정해 둔 것 밖의 가리기 문서는 못 쓴다", () => setDoc(doc(admin, "gardens", gA, "mod", "beds"), { hidden: true, at: serverTimestamp() }));
  await expect(false, "아무나 정해 둔 것 밖의 가리기 문서 읽기", () => getDoc(doc(client(null), "gardens", gA, "mod", "beds")));
  await expect(true, "A 다시 공개(키 없이)", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { guestbook: "all", accept: true })));

  console.log("1촌 신청");
  const knock = (db: Firestore, uid: string, target: string, g: string, tag = 1) => setDoc(doc(db, "gardens", target, "knocks", uid), { g, n: "이름", tag, at: serverTimestamp() });
  await expect(false, "남의 공개 id로 신청", () => knock(d, D, gA, gB));
  await expect(false, "남의 uid 문서로 신청", () => knock(b, C, gA, gB));
  await expect(false, "내 방에 신청", () => knock(b, B, gB, gB));
  await expect(false, "이름표가 표 밖", () => knock(b, B, gA, gB, 8));
  await expect(true, "B → A 신청", () => knock(b, B, gA, gB, 2));
  await expect(false, "같은 신청 다시(고치기)", () => knock(b, B, gA, gB, 3));
  await expect(true, "A가 받은 신청 목록 읽기", () => getDocs(collection(a, "gardens", gA, "knocks")));
  await expect(false, "C가 A의 신청 목록 읽기", () => getDocs(collection(c, "gardens", gA, "knocks")));
  await expect(true, "B가 제 신청 읽기", () => getDoc(doc(b, "gardens", gA, "knocks", B)));

  console.log("수락");
  await expect(false, "A가 내 쪽만 쓰기", async () => {
    const w = writeBatch(a);
    w.set(doc(a, "gardens", gA, "ilchon", B), { g: gB, n: "비", tag: 0, at: serverTimestamp() });
    w.delete(doc(a, "gardens", gA, "knocks", B));
    await w.commit();
  });
  await expect(false, "A가 신청을 지우지 않고 양쪽 쓰기", async () => {
    const w = writeBatch(a);
    w.set(doc(a, "gardens", gA, "ilchon", B), { g: gB, n: "비", tag: 0, at: serverTimestamp() });
    w.set(doc(a, "gardens", gB, "ilchon", A), { g: gA, n: "에이", tag: 2, at: serverTimestamp() });
    await w.commit();
  });
  await expect(false, "상대 쪽 이름표를 신청과 다르게", async () => {
    const w = writeBatch(a);
    w.set(doc(a, "gardens", gA, "ilchon", B), { g: gB, n: "비", tag: 0, at: serverTimestamp() });
    w.set(doc(a, "gardens", gB, "ilchon", A), { g: gA, n: "에이", tag: 5, at: serverTimestamp() });
    w.delete(doc(a, "gardens", gA, "knocks", B));
    await w.commit();
  });
  await expect(false, "C가 신청 없이 C↔A 1촌 만들기", async () => {
    const w = writeBatch(c);
    w.set(doc(c, "gardens", gC, "ilchon", A), { g: gA, n: "에이", tag: 0, at: serverTimestamp() });
    w.set(doc(c, "gardens", gA, "ilchon", C), { g: gC, n: "씨", tag: 0, at: serverTimestamp() });
    await w.commit();
  });
  await expect(true, "A가 수락(양쪽+신청 지우기 한 배치)", async () => {
    const w = writeBatch(a);
    w.set(doc(a, "gardens", gA, "ilchon", B), { g: gB, n: "비", tag: 0, at: serverTimestamp() });
    w.set(doc(a, "gardens", gB, "ilchon", A), { g: gA, n: "에이", tag: 2, at: serverTimestamp() });
    w.delete(doc(a, "gardens", gA, "knocks", B));
    await w.commit();
  });
  await expect(true, "B가 A 방의 제 1촌 문서 읽기", () => getDoc(doc(b, "gardens", gA, "ilchon", B)));
  await expect(false, "C가 A의 1촌 목록 읽기", () => getDocs(collection(c, "gardens", gA, "ilchon")));
  await expect(false, "이미 1촌인데 또 신청", () => knock(b, B, gA, gB));
  await expect(true, "A가 내 쪽 이름표 바꾸기", () => updateDoc(doc(a, "gardens", gA, "ilchon", B), { tag: 4 }));
  await expect(false, "A가 상대 쪽 이름표 바꾸기", () => updateDoc(doc(a, "gardens", gB, "ilchon", A), { tag: 4 }));
  await expect(false, "A가 1촌의 공개 id 바꾸기", () => updateDoc(doc(a, "gardens", gA, "ilchon", B), { g: gC }));

  console.log("물");
  const water = (db: Firestore, uid: string, target: string, il: boolean) => setDoc(doc(db, "gardens", target, "waters", uid), { day, at: serverTimestamp(), nick: "물", ...(il ? { il: true } : {}) });
  await expect(true, "1촌 B가 A에게 1촌의 물", () => water(b, B, gA, true));
  await expect(false, "1촌 아닌 C가 1촌의 물이라 적기", () => water(c, C, gA, true));
  await expect(true, "C가 보통 물(옛 모양)", () => water(c, C, gA, false));
  await expect(false, "il: false 적기", () => water(d, D, gA, false).then(() => setDoc(doc(d, "gardens", gB, "waters", D), { day, at: serverTimestamp(), nick: "물", il: false })));

  console.log("방명록");
  const sign = (db: Firestore, uid: string, target: string, line: Line, over: { id?: string; g?: string } = {}) => setDoc(doc(db, "gardens", target, "guestbook", over.id ?? `${uid}_${day}`), { g: over.g ?? "", n: "손님", ...line, at: serverTimestamp() });
  await expect(true, "C가 문구로 방명록", () => sign(c, C, gA, { p: 3, x: "", k: 2 }, { g: gC }));
  await expect(false, "C가 같은 날 또(고치기)", () => sign(c, C, gA, { p: 4, x: "", k: 2 }));
  await expect(false, "어제 날짜 id", () => sign(d, D, gA, { p: 0, x: "", k: 0 }, { id: `${D}_${day - 1}` }));
  await expect(false, "남의 uid id", () => sign(d, D, gA, { p: 0, x: "", k: 0 }, { id: `${B}_${day}` }));
  await expect(false, "61자", () => sign(d, D, gA, { p: -1, x: "가".repeat(61), k: 0 }));
  await expect(false, "문구에 글 덧붙이기", () => sign(d, D, gA, { p: 3, x: "덧", k: 0 }));
  await expect(false, "문구 번호 30", () => sign(d, D, gA, { p: 30, x: "", k: 0 }));
  await expect(false, "스티커 12", () => sign(d, D, gA, { p: 0, x: "", k: 12 }));
  await expect(false, "남의 공개 id를 내 것이라 적기", () => sign(d, D, gA, { p: 0, x: "", k: 0 }, { g: gB }));
  await expect(false, "주인이 제 방에", () => sign(a, A, gA, { p: 0, x: "", k: 0 }));
  await expect(false, "hidden을 스스로 적기", () => setDoc(doc(d, "gardens", gA, "guestbook", `${D}_${day}`), { g: "", n: "손님", p: 0, x: "", k: 0, at: serverTimestamp(), hidden: false }));
  await expect(true, "D가 60자 직접 쓴 글", () => sign(d, D, gA, { p: -1, x: "가".repeat(60), k: 11 }));
  await expect(true, "아무나 방명록 읽기(가리지 않은 방)", () => getDocs(query(collection(client(null), "gardens", gA, "guestbook"), orderBy("at", "desc"), limit(30))));
  await expect(false, "B가 C의 글 지우기", () => deleteDoc(doc(b, "gardens", gA, "guestbook", `${C}_${day}`)));
  await expect(false, "운영자 아닌 사람이 가리기", () => updateDoc(doc(b, "gardens", gA, "guestbook", `${C}_${day}`), { hidden: true }));
  await expect(true, "운영자가 가리기", () => updateDoc(doc(admin, "gardens", gA, "guestbook", `${C}_${day}`), { hidden: true }));
  await expect(false, "운영자가 글을 고치기", () => updateDoc(doc(admin, "gardens", gA, "guestbook", `${C}_${day}`), { x: "바꿈" }));
  await expect(true, "쓴 사람이 제 글 지우기", () => deleteDoc(doc(c, "gardens", gA, "guestbook", `${C}_${day}`)));
  await expect(true, "주인이 남의 글 지우기", () => deleteDoc(doc(a, "gardens", gA, "guestbook", `${D}_${day}`)));
  await expect(true, "A가 1촌만 받기로", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { guestbook: "ilchon" })));
  await expect(false, "1촌 아닌 D가 남기기(1촌만)", () => sign(d, D, gA, { p: 0, x: "", k: 0 }));
  await expect(true, "1촌 B가 남기기(1촌만)", () => sign(b, B, gA, { p: 0, x: "", k: 0 }, { g: gB }));
  await expect(true, "A가 받지 않기로", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { guestbook: "off" })));
  await expect(false, "C가 남기기(받지 않기)", () => sign(c, C, gA, { p: 0, x: "", k: 0 }));
  await expect(true, "A가 모두 받기로", () => setDoc(doc(a, "gardens", gA), pub(A, "에이", { guestbook: "all" })));

  console.log("1촌평");
  const note = (db: Firestore, uid: string, target: string, g: string, over: Record<string, unknown> = {}) => setDoc(doc(db, "gardens", target, "notes", uid), { g, n: "비", tag: 2, p: 1, x: "", k: 0, at: serverTimestamp(), ...over });
  await expect(true, "1촌 B가 A 방에 1촌평", () => note(b, B, gA, gB));
  await expect(true, "B가 다시 쓰기(덮기)", () => note(b, B, gA, gB, { p: -1, x: "다시" }));
  await expect(false, "1촌 아닌 C가 1촌평", () => note(c, C, gA, gC));
  await expect(false, "B가 남의 공개 id로", () => note(b, B, gA, gC));
  await expect(true, "운영자 가리기", () => updateDoc(doc(admin, "gardens", gA, "notes", B), { hidden: true }));
  await expect(false, "가린 1촌평을 덮어 풀기", () => note(b, B, gA, gB));

  console.log("차단");
  await expect(true, "A가 D 차단", () => setDoc(doc(a, "gardens", gA, "blocks", D), { n: "디", at: serverTimestamp() }));
  await expect(false, "C가 A의 차단 목록 읽기", () => getDocs(collection(c, "gardens", gA, "blocks")));
  await bypass(`gardens/gddddddd01`, { ownerUid: { stringValue: D }, nick: { stringValue: "디" }, beds: { arrayValue: {} }, dex: { integerValue: "0" }, golden: { integerValue: "0" }, rainbow: { integerValue: "0" } });
  await expect(false, "차단된 D가 신청", () => knock(d, D, gA, "gddddddd01"));
  await expect(false, "차단된 D가 방명록", () => sign(d, D, gA, { p: 0, x: "", k: 0 }));

  console.log("손님 수");
  const visit = (db: Firestore, uid: string, target: string) => runTransaction(db, async (tx) => {
    const cref = doc(db, "gardens", target, "meta", "counter");
    const cs = await tx.get(cref);
    const before = (cs.exists() ? cs.data() : { day: 0, today: 0, total: 0 }) as { day: number; today: number; total: number };
    tx.set(doc(db, "gardens", target, "visits", uid), { day });
    tx.set(cref, { day, today: (before.day === day ? before.today : 0) + 1, total: before.total + 1 });
  });
  await expect(true, "C가 손님으로 세기", () => visit(c, C, gA));
  await expect(false, "C가 같은 날 또", () => visit(c, C, gA));
  await expect(false, "주인이 제 방 세기", () => visit(a, A, gA));
  await expect(false, "표식 없이 숫자만", () => setDoc(doc(b, "gardens", gA, "meta", "counter"), { day, today: 2, total: 2 }));
  await expect(false, "숫자를 2 올리기", () => runTransaction(b, async (tx) => {
    tx.set(doc(b, "gardens", gA, "visits", B), { day });
    tx.set(doc(b, "gardens", gA, "meta", "counter"), { day, today: 3, total: 3 });
  }));
  await expect(true, "B가 손님으로 세기", () => visit(b, B, gA));
  const cnt = await getDoc(doc(a, "gardens", gA, "meta", "counter"));
  console.log(`  손님 수: 오늘 ${cnt.get("today")} · 모두 ${cnt.get("total")} (2·2이어야)`);
  if (cnt.get("today") !== 2 || cnt.get("total") !== 2) failed++;
  await expect(false, "C가 A의 손님 표식 목록 읽기", () => getDocs(collection(c, "gardens", gA, "visits")));

  console.log("끊기");
  await expect(false, "B가 한쪽만 끊기", () => deleteDoc(doc(b, "gardens", gA, "ilchon", B)));
  await expect(false, "C가 남의 1촌 끊기", async () => {
    const w = writeBatch(c);
    w.delete(doc(c, "gardens", gA, "ilchon", B));
    w.delete(doc(c, "gardens", gB, "ilchon", A));
    await w.commit();
  });
  await expect(true, "B가 끊기(양쪽+1촌평 한 배치)", async () => {
    const w = writeBatch(b);
    w.delete(doc(b, "gardens", gB, "ilchon", A));
    w.delete(doc(b, "gardens", gB, "notes", A));
    w.delete(doc(b, "gardens", gA, "ilchon", B));
    w.delete(doc(b, "gardens", gA, "notes", B));
    await w.commit();
  });

  console.log("가린 방");
  // 다시 1촌을 맺어 둔다(C → A 신청, A 수락).
  await expect(true, "C → A 신청", () => knock(c, C, gA, gC, 0));
  await expect(true, "A 수락", async () => {
    const w = writeBatch(a);
    w.set(doc(a, "gardens", gA, "ilchon", C), { g: gC, n: "씨", tag: 1, at: serverTimestamp() });
    w.set(doc(a, "gardens", gC, "ilchon", A), { g: gA, n: "에이", tag: 0, at: serverTimestamp() });
    w.delete(doc(a, "gardens", gA, "knocks", C));
    await w.commit();
  });
  await expect(true, "A가 공개를 끄며 가리기", () => setDoc(doc(a, "gardens", gA), { ownerUid: A, hidden: true, updatedAt: serverTimestamp() }));
  await expect(false, "가린 방의 방명록을 남이 읽기", () => getDocs(collection(b, "gardens", gA, "guestbook")));
  await expect(true, "가린 방의 방명록을 주인이 읽기", () => getDocs(collection(a, "gardens", gA, "guestbook")));
  await expect(false, "가린 방의 손님 수를 남이 읽기", () => getDoc(doc(b, "gardens", gA, "meta", "counter")));
  await expect(false, "가린 방에 물", () => water(d, D, gA, false));
  await expect(false, "가린 방에 신청", () => knock(b, B, gA, gB));
  await expect(false, "가린 방에 방명록", () => sign(b, B, gA, { p: 0, x: "", k: 0 }));
  await expect(false, "가린 방의 주인이 남에게 신청", () => knock(a, A, gB, gA));
  await expect(true, "다시 공개", () => setDoc(doc(a, "gardens", gA), pub(A, "에이")));
  await expect(true, "1촌이 그대로", () => getDoc(doc(a, "gardens", gA, "ilchon", C)).then((s) => { if (!s.exists()) throw new Error("1촌이 사라졌다"); }));

  console.log("상대 방이 없어진 1촌 끊기");
  await expect(true, "A가 공개 문서를 지움(옛 화면)", () => deleteDoc(doc(a, "gardens", gA)));
  await expect(true, "C가 내 쪽만 끊기", () => deleteDoc(doc(c, "gardens", gC, "ilchon", A)));
  await expect(true, "C가 문서 없는 방에 남은 제 1촌 문서 지우기", () => deleteDoc(doc(c, "gardens", gA, "ilchon", C)));

  console.log(failed ? `\n실패 ${failed}` : "\n모두 기대대로");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
