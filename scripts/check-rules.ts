/**
 * 규칙 점검 — 실제 프로젝트에 대고 나쁜 쓰기를 시도해 본다.
 *
 * 카운터만 올리는 요청이 막히는지가 핵심이다. 막히지 않으면 '나도요'는
 * 누구나 원하는 만큼 올릴 수 있는 숫자가 된다.
 */
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  increment,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
});
const db = getFirestore(app);
const auth = getAuth(app);

const ok = (s: string) => console.log(`  ✓ ${s}`);
const bad = (s: string) => {
  console.error(`  ✗ ${s}`);
  failed = true;
};
let failed = false;

async function expectDenied(label: string, run: () => Promise<unknown>) {
  try {
    await run();
    bad(`${label} — 통과했다. 막혔어야 한다`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/permission|insufficient/i.test(msg)) ok(`${label} — 막혔다`);
    else bad(`${label} — 다른 이유로 실패: ${msg}`);
  }
}

async function expectAllowed(label: string, run: () => Promise<unknown>) {
  try {
    await run();
    ok(`${label} — 통과했다`);
  } catch (e) {
    bad(`${label} — 막혔다: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function main() {
  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;
  console.log(`익명 로그인 ${uid.slice(0, 8)}…\n`);

  console.log("읽기");
  await expectAllowed("피드백 목록 공개 읽기", () =>
    getDocs(query(collection(db, "feedback"), limit(5))),
  );

  console.log("\n만들기");
  const mine = await addDoc(collection(db, "feedback"), {
    body: "[점검용] 지워도 되는 글",
    kind: "etc",
    authorUid: uid,
    status: "open",
    reply: null,
    repliedAt: null,
    agreeCount: 0,
    createdAt: serverTimestamp(),
  });
  ok("제 uid로 만들기 — 통과했다");

  await expectDenied("남의 uid로 만들기", () =>
    addDoc(collection(db, "feedback"), {
      body: "[점검용] 남의 것인 척",
      kind: "etc",
      authorUid: "somebody-else",
      status: "open",
      reply: null,
      repliedAt: null,
      agreeCount: 0,
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied("처음부터 '했음'으로 만들기", () =>
    addDoc(collection(db, "feedback"), {
      body: "[점검용] 상태 위조",
      kind: "etc",
      authorUid: uid,
      status: "done",
      reply: null,
      repliedAt: null,
      agreeCount: 0,
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied("카운터를 999로 깔고 만들기", () =>
    addDoc(collection(db, "feedback"), {
      body: "[점검용] 카운터 위조",
      kind: "etc",
      authorUid: uid,
      status: "open",
      reply: null,
      repliedAt: null,
      agreeCount: 999,
      createdAt: serverTimestamp(),
    }),
  );

  console.log("\n나도요");
  await expectDenied("표시 문서 없이 카운터만 +1", () =>
    updateDoc(doc(db, "feedback", mine.id), { agreeCount: increment(1) }),
  );

  await expectDenied("카운터만 +100", () =>
    updateDoc(doc(db, "feedback", mine.id), { agreeCount: increment(100) }),
  );

  await expectAllowed("표시 문서와 함께 +1 (배치)", () => {
    const b = writeBatch(db);
    b.set(doc(db, "feedback", mine.id, "agrees", uid), { at: serverTimestamp() });
    b.update(doc(db, "feedback", mine.id), { agreeCount: increment(1) });
    return b.commit();
  });

  await expectDenied("이미 누른 뒤 한 번 더 +1", () => {
    const b = writeBatch(db);
    b.set(doc(db, "feedback", mine.id, "agrees", uid), { at: serverTimestamp() });
    b.update(doc(db, "feedback", mine.id), { agreeCount: increment(1) });
    return b.commit();
  });

  console.log("\n운영자 권한");
  await expectDenied("일반 사용자가 상태 바꾸기", () =>
    updateDoc(doc(db, "feedback", mine.id), { status: "done" }),
  );

  await expectDenied("일반 사용자가 답 달기", () =>
    updateDoc(doc(db, "feedback", mine.id), { reply: "고치겠습니다" }),
  );

  await expectDenied("남의 운영자 여부 훔쳐보기", () =>
    getDocs(query(collection(db, "admins"), limit(1))),
  );

  console.log("\n치우기");
  await deleteDoc(doc(db, "feedback", mine.id, "agrees", uid));
  await deleteDoc(doc(db, "feedback", mine.id));
  ok("점검용 글 지우기 — 통과했다");

  console.log(failed ? "\n점검 실패." : "\n점검 통과.");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error("점검 중 오류:", e);
  process.exit(1);
});
