/**
 * 규칙 점검 — 실제 프로젝트에 대고 나쁜 쓰기를 시도해 본다.
 *
 * 카운터만 올리는 요청이 막히는지가 핵심이다. 막히지 않으면 '나도요'는
 * 누구나 원하는 만큼 올릴 수 있는 숫자가 된다.
 */
import { readFileSync } from "node:fs";
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
  setDoc,
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
  await cheerChecks(uid);
  await correctionChecks(uid);
  await adminChecks(uid);


  console.log(failed ? "\n점검 실패." : "\n점검 통과.");
  process.exit(failed ? 1 : 0);
}


/*
 * 정정·반론 접수.
 *
 * 피드백과 반대로, 여기는 **읽히지 않는 것**이 핵심이다. 접수한 글에는
 * 남에 대한 이야기와 연락처가 들어간다. 목록이 열리면 창구가 아니라
 * 발행면이 된다.
 */
async function correctionChecks(uid: string) {
  console.log("\n정정·반론");

  await expectDenied("접수 목록 훔쳐보기", () =>
    getDocs(query(collection(db, "corrections"), limit(1))),
  );

  await expectDenied("처음부터 '처리됨'으로 접수하기", () =>
    addDoc(collection(db, "corrections"), {
      page: "/achievement/daejangdong",
      kind: "fact",
      role: "reader",
      body: "[점검용] 상태 위조 — 지워도 됩니다",
      evidenceUrl: "",
      contact: "",
      authorUid: uid,
      status: "fixed",
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied("없는 종류로 접수하기", () =>
    addDoc(collection(db, "corrections"), {
      page: "/achievement/daejangdong",
      kind: "whatever",
      role: "reader",
      body: "[점검용] 종류 위조 — 지워도 됩니다",
      evidenceUrl: "",
      contact: "",
      authorUid: uid,
      status: "received",
      createdAt: serverTimestamp(),
    }),
  );

  const mine = await addDoc(collection(db, "corrections"), {
    page: "/achievement/daejangdong",
    kind: "fact",
    role: "reader",
    body: "[점검용] 지워도 되는 접수입니다",
    evidenceUrl: "",
    contact: "",
    authorUid: uid,
    status: "received",
    createdAt: serverTimestamp(),
  }).catch((e) => {
    bad(`제 uid로 접수하기 — 막혔다: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  });

  if (!mine) return;
  ok("제 uid로 접수하기 — 통과했다");

  await expectDenied("일반 사용자가 상태 바꾸기", () =>
    updateDoc(doc(db, "corrections", mine.id), { status: "fixed" }),
  );

  await deleteDoc(doc(db, "corrections", mine.id));
  ok("제 접수 거두기 — 통과했다");
}

/*
 * 운영자 쪽 검사.
 *
 * 여기까지 오면 "일반 사용자는 못 한다"만 확인한 것이다. 운영자가 실제로
 * 할 수 있는지는 반대쪽 절반이고, isAdmin()이 고장 나 있으면 운영자는
 * 피드백을 열어 상태 단추를 눌러 보고서야 알게 된다.
 *
 * 그래서 이 점검용 익명 계정을 잠깐 운영자로 올렸다 내린다. 서비스 계정
 * 키가 있을 때만 돈다 — 키가 없으면 앞의 검사만 하고 끝낸다.
 */
async function adminChecks(uid: string) {
  let admin: typeof import("firebase-admin/firestore");
  let appMod: typeof import("firebase-admin/app");
  try {
    appMod = await import("firebase-admin/app");
    admin = await import("firebase-admin/firestore");
    readFileSync("sa.json", "utf8");
  } catch {
    console.log("\n운영자 쪽 검사는 건너뛴다 (sa.json 없음)");
    return;
  }

  if (appMod.getApps().length === 0) {
    appMod.initializeApp({ credential: appMod.cert("sa.json") }, "probe-admin");
  }
  const adminDb = admin.getFirestore(appMod.getApp("probe-admin"));
  const adminDoc = adminDb.collection("admins").doc(uid);

  console.log("\n운영자 쪽 (점검 계정을 잠깐 올렸다 내린다)");
  await adminDoc.set({ grantedAt: new Date().toISOString(), probe: true });

  // 토큰이 아니라 문서를 보는 규칙이므로 새로 로그인할 필요는 없다.
  const target = await addDoc(collection(db, "feedback"), {
    body: "[점검용] 운영자 검사 대상",
    kind: "etc",
    authorUid: "someone-else",
    status: "open",
    reply: null,
    repliedAt: null,
    agreeCount: 0,
    createdAt: serverTimestamp(),
  }).catch(() => null);

  // 남의 uid로는 못 만드므로 관리자 키로 만든다.
  const ref = target ?? { id: (await adminDb.collection("feedback").add({
    body: "[점검용] 운영자 검사 대상",
    kind: "etc",
    authorUid: "someone-else",
    status: "open",
    reply: null,
    repliedAt: null,
    agreeCount: 0,
    createdAt: new Date(),
  })).id };

  await expectAllowed("운영자가 상태 바꾸기", () =>
    updateDoc(doc(db, "feedback", ref.id), { status: "planned" }),
  );

  await expectAllowed("운영자가 답 달기", () =>
    updateDoc(doc(db, "feedback", ref.id), {
      reply: "[점검용] 답",
      repliedAt: serverTimestamp(),
    }),
  );

  await expectDenied("운영자라도 남의 글 본문 고치기", () =>
    updateDoc(doc(db, "feedback", ref.id), { body: "몰래 고침" }),
  );

  await expectDenied("운영자라도 카운터 손대기", () =>
    updateDoc(doc(db, "feedback", ref.id), { agreeCount: 42 }),
  );

  await expectAllowed("운영자가 남의 글 지우기", () =>
    deleteDoc(doc(db, "feedback", ref.id)),
  );

  /*
   * 응원도 같은 손이 내린다. isAdmin()을 세 군데에서 부르므로, 한 군데에서만
   * 도는지 아닌지는 세 군데를 다 눌러 봐야 안다.
   */
  const strayVideo = "zzAdminVid1";
  await adminDb.collection("cheerVideos").doc(strayVideo).set({
    youtubeId: strayVideo,
    title: "[점검용] 남이 올린 영상",
    channel: "[점검용] 채널",
    channelUrl: null,
    authorUid: "someone-else",
    createdAt: new Date(),
  });
  await expectAllowed("운영자가 남의 영상 내리기", () =>
    deleteDoc(doc(db, "cheerVideos", strayVideo)),
  );

  const strayNote = (
    await adminDb.collection("cheerNotes").add({
      body: "[점검용] 남이 남긴 한 줄",
      authorUid: "someone-else",
      agreeCount: 0,
      createdAt: new Date(),
    })
  ).id;
  await expectAllowed("운영자가 남의 한 줄 지우기", () =>
    deleteDoc(doc(db, "cheerNotes", strayNote)),
  );

  await adminDoc.delete();
  ok("점검 계정 운영자 해제");
}

/*
 * 응원 쪽 검사.
 *
 * 피드백과 같은 모양을 쓰지만 같은 규칙이 도는 것은 아니다. isAgreeDelta를
 * 경로 받는 함수 하나로 묶어 두었어도, 그 경로를 cheerNotes 쪽에서 제대로
 * 넘겼는지는 실제로 눌러 봐야 안다. 한 글자 틀리면 카운터가 통째로 열린다.
 *
 * 영상에는 피드백에 없는 불변식이 하나 더 있다 — 같은 영상이 두 번 걸리지
 * 않는다. 그 불변식을 update 금지 한 줄에 맡겨 두었으므로, 그 한 줄이 실제로
 * 두 번째 시도를 막는지 여기서 확인한다.
 */
async function cheerChecks(uid: string) {
  console.log("\n응원 — 한 줄");

  const note = await addDoc(collection(db, "cheerNotes"), {
    body: "[점검용] 지워도 되는 한 줄",
    authorUid: uid,
    agreeCount: 0,
    createdAt: serverTimestamp(),
  });
  ok("제 uid로 한 줄 남기기 — 통과했다");

  await expectDenied("80자를 넘겨 남기기", () =>
    addDoc(collection(db, "cheerNotes"), {
      body: "가".repeat(81),
      authorUid: uid,
      agreeCount: 0,
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied("한 줄에 카운터만 +1", () =>
    updateDoc(doc(db, "cheerNotes", note.id), { agreeCount: increment(1) }),
  );

  await expectAllowed("한 줄에 표시 문서와 함께 +1 (배치)", () => {
    const b = writeBatch(db);
    b.set(doc(db, "cheerNotes", note.id, "agrees", uid), { at: serverTimestamp() });
    b.update(doc(db, "cheerNotes", note.id), { agreeCount: increment(1) });
    return b.commit();
  });

  await expectDenied("제 한 줄이라도 본문 고치기", () =>
    updateDoc(doc(db, "cheerNotes", note.id), { body: "몰래 고침" }),
  );

  console.log("\n응원 — 영상");
  const videoId = "zzTestVid01";

  await expectAllowed("제 uid로 영상 걸기", () =>
    setDoc(doc(db, "cheerVideos", videoId), {
      youtubeId: videoId,
      title: "[점검용] 지워도 되는 영상",
      channel: "[점검용] 채널",
      channelUrl: null,
      authorUid: uid,
      createdAt: serverTimestamp(),
    }),
  );

  // 같은 영상을 두 번. 이게 통과하면 응원 벽에 같은 영상이 두 칸을 차지한다.
  await expectDenied("같은 영상 다시 걸기", () =>
    setDoc(doc(db, "cheerVideos", videoId), {
      youtubeId: videoId,
      title: "[점검용] 덮어쓰기 시도",
      channel: "[점검용] 채널",
      channelUrl: null,
      authorUid: uid,
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied("문서 id와 다른 영상 id로 걸기", () =>
    setDoc(doc(db, "cheerVideos", "zzTestVid02"), {
      youtubeId: videoId,
      title: "[점검용] 어긋난 id",
      channel: "[점검용] 채널",
      channelUrl: null,
      authorUid: uid,
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied("남의 uid로 영상 걸기", () =>
    setDoc(doc(db, "cheerVideos", "zzTestVid03"), {
      youtubeId: "zzTestVid03",
      title: "[점검용] 남의 것인 척",
      channel: "[점검용] 채널",
      channelUrl: null,
      authorUid: "somebody-else",
      createdAt: serverTimestamp(),
    }),
  );

  console.log("\n치우기 (응원)");
  await deleteDoc(doc(db, "cheerNotes", note.id, "agrees", uid));
  await deleteDoc(doc(db, "cheerNotes", note.id));
  await deleteDoc(doc(db, "cheerVideos", videoId));
  ok("점검용 응원 지우기 — 통과했다");
}
main().catch((e) => {
  console.error("점검 중 오류:", e);
  process.exit(1);
});
