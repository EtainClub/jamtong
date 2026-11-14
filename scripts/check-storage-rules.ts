/**
 * Storage 규칙 점검 — 정원 키보드 녹음(roomKeys/{uid}/{칸}-{판}.wav). **로컬 에뮬레이터에만** 붙는다.
 *
 *   firebase emulators:exec --only firestore,storage --project demo-jamtong "pnpm check:storage-rules"
 *
 * 운영자 판정(isAdmin)이 Firestore의 admins 문서를 보므로 Firestore 에뮬레이터도 함께 띄운다.
 * check-ilchon-rules.ts와 같이 이미 있는 firebase 클라이언트만 쓴다(mockUserToken).
 */
import { initializeApp } from "firebase/app";
import { connectStorageEmulator, deleteObject, getBytes, getStorage, ref, uploadBytes, type FirebaseStorage } from "firebase/storage";

const STORAGE = process.env.FIREBASE_STORAGE_EMULATOR_HOST;
const FIRESTORE = process.env.FIRESTORE_EMULATOR_HOST;
if (!STORAGE || !FIRESTORE) {
  console.error("FIREBASE_STORAGE_EMULATOR_HOST·FIRESTORE_EMULATOR_HOST가 없다. 운영 버킷에는 붙지 않는다 — firebase emulators:exec --only firestore,storage로 돌린다.");
  process.exit(1);
}
const PROJECT = process.env.GCLOUD_PROJECT ?? "demo-jamtong";
if (!PROJECT.startsWith("demo-")) {
  console.error(`demo- 프로젝트에서만 돈다(지금 ${PROJECT}).`);
  process.exit(1);
}
const [SHOST, SPORT] = STORAGE.split(":");
const [FHOST, FPORT] = FIRESTORE.split(":");
const BUCKET = `${PROJECT}.appspot.com`;

let n = 0;
function client(uid: string | null): FirebaseStorage {
  const app = initializeApp({ projectId: PROJECT, apiKey: "x", storageBucket: BUCKET }, `s${n++}`);
  const storage = getStorage(app);
  connectStorageEmulator(storage, SHOST, Number(SPORT), uid ? { mockUserToken: { sub: uid, user_id: uid } } : undefined);
  return storage;
}

let failed = 0;
async function expect(allowed: boolean, label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    if (allowed) console.log(`  ✓ ${label}`);
    else {
      failed++;
      console.log(`  ✗ ${label} — 통과했다(막혀야 한다)`);
    }
  } catch (e) {
    const err = e as { code?: string; message?: string };
    const denied = err.code === "storage/unauthorized" || err.code === "storage/unauthenticated";
    if (!allowed && denied) console.log(`  ✓ ${label} — 막혔다`);
    else {
      failed++;
      console.log(`  ✗ ${label} — ${allowed ? "막혔다" : "다른 오류"}: ${err.code ?? ""} ${String(err.message).slice(0, 160)}`);
    }
  }
}

const A = "userA", B = "userB", ADMIN = "userAdmin";
const wav = (bytes: number) => new Uint8Array(bytes);
const put = (s: FirebaseStorage, path: string, bytes = 2_000, contentType = "audio/wav") => uploadBytes(ref(s, path), wav(bytes), { contentType });

(async () => {
  // 운영자 표시(Firestore 에뮬레이터, 규칙을 건너뛰는 owner 토큰).
  const res = await fetch(`http://${FHOST}:${FPORT}/v1/projects/${PROJECT}/databases/(default)/documents/admins/${ADMIN}`, {
    method: "PATCH",
    headers: { Authorization: "Bearer owner", "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { on: { booleanValue: true } } }),
  });
  if (!res.ok) throw new Error(`admins 심기: ${res.status} ${await res.text()}`);

  const a = client(A), b = client(B), admin = client(ADMIN), anon = client(null);

  console.log("올리기");
  await expect(true, "A가 제 경로에 WAV(0-1)", () => put(a, `roomKeys/${A}/0-1.wav`));
  await expect(true, "A가 다른 칸·판(3-12)", () => put(a, `roomKeys/${A}/3-12.wav`));
  await expect(false, "B가 A의 경로에", () => put(b, `roomKeys/${A}/1-1.wav`));
  await expect(false, "로그인하지 않고", () => put(anon, `roomKeys/${A}/1-1.wav`));
  await expect(false, "운영자도 남의 경로에는 못 올린다", () => put(admin, `roomKeys/${A}/1-2.wav`));
  await expect(false, "audio/mpeg", () => put(a, `roomKeys/${A}/1-1.wav`, 2_000, "audio/mpeg"));
  await expect(false, "64KB", () => put(a, `roomKeys/${A}/1-1.wav`, 64 * 1024));
  await expect(true, "64KB보다 1바이트 작게", () => put(a, `roomKeys/${A}/1-3.wav`, 64 * 1024 - 1));
  await expect(false, "칸 4", () => put(a, `roomKeys/${A}/4-1.wav`));
  await expect(false, "판 0", () => put(a, `roomKeys/${A}/0-0.wav`));
  await expect(false, "이름이 다르다", () => put(a, `roomKeys/${A}/voice.wav`));
  await expect(false, "하위 폴더", () => put(a, `roomKeys/${A}/x/0-1.wav`));
  await expect(false, "같은 경로 덮어쓰기(update)", () => put(a, `roomKeys/${A}/0-1.wav`));

  console.log("읽기");
  await expect(true, "로그인하지 않은 손님이 듣기", () => getBytes(ref(anon, `roomKeys/${A}/0-1.wav`)));
  await expect(true, "B가 듣기", () => getBytes(ref(b, `roomKeys/${A}/3-12.wav`)));

  console.log("지우기");
  await expect(false, "B가 A의 녹음 지우기", () => deleteObject(ref(b, `roomKeys/${A}/0-1.wav`)));
  await expect(false, "로그인하지 않고 지우기", () => deleteObject(ref(anon, `roomKeys/${A}/0-1.wav`)));
  await expect(true, "A가 제 녹음 지우기", () => deleteObject(ref(a, `roomKeys/${A}/0-1.wav`)));
  await expect(true, "운영자가 A의 녹음 지우기", () => deleteObject(ref(admin, `roomKeys/${A}/3-12.wav`)));
  await expect(true, "A가 남은 것 지우기", () => deleteObject(ref(a, `roomKeys/${A}/1-3.wav`)));

  console.log("다른 경로는 그대로 닫혀 있다");
  await expect(false, "아무 경로에 WAV", () => put(a, `other/${A}/0-1.wav`));

  console.log(failed ? `\n실패 ${failed}` : "\n모두 기대대로");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
