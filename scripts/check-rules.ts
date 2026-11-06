/**
 * 규칙 점검 — 실제 프로젝트에 대고 나쁜 쓰기를 시도해 본다.
 *
 * 카운터만 올리는 요청이 막히는지가 핵심이다. 막히지 않으면 '나도요'는
 * 누구나 원하는 만큼 올릴 수 있는 숫자가 된다.
 */
import { readFileSync } from "node:fs";
import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};
const app = initializeApp(config);
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
  await gardenChecks(uid);


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

/** 두 번째 익명 사용자. 남과 겨루거나 남의 것에 쓰는 규칙을 보려면 둘이 있어야 한다. */
let second: Promise<{ db: ReturnType<typeof getFirestore>; uid: string }> | null = null;
function secondUser() {
  second ??= (async () => {
    const app2 = initializeApp(config, "probe-2");
    const uid2 = (await signInAnonymously(getAuth(app2))).user.uid;
    return { db: getFirestore(app2), uid: uid2 };
  })();
  return second;
}

/** 서비스 계정 키(sa.json)가 있으면 관리자 Firestore를 연다. 없으면 null. */
async function openAdmin() {
  try {
    readFileSync("sa.json", "utf8");
    const appMod = await import("firebase-admin/app");
    const admin = await import("firebase-admin/firestore");
    if (!appMod.getApps().some((a) => a.name === "probe-admin")) {
      appMod.initializeApp({ credential: appMod.cert("sa.json") }, "probe-admin");
    }
    return admin.getFirestore(appMod.getApp("probe-admin"));
  } catch {
    return null;
  }
}

/*
 * 정원 쪽 검사 (docs/garden-game.md §3.8·§3.9, firestore.rules의 garden·plaza*·blooms).
 *
 * 광장 칸은 c00..c23 진짜 칸밖에 없어서, 통과해야 하는 쓰기를 하면 실제 광장의
 * 잡초가 한 포기 뽑힌다. 그래서 통과 검사는 관리자 키가 있을 때만 하고, 끝나면
 * 그 칸을 원래대로 되돌린다. 기록판은 지난 날짜(1999-01-01)에 써서 오늘 기록판을
 * 건드리지 않는다.
 *
 * 꽃밭은 품종표에 없는 업적 id(a:zz-rules-probe)로 한다. 화면은 품종표에 있는
 * 업적만 그리고 세므로, 검사하는 동안 점검용 꽃이 보이거나 보너스가 되지 않는다.
 * blooms는 지울 수 없는 규칙이라 치우기도 관리자 키로 한다.
 */
async function gardenChecks(uid: string) {
  const adminDb = await openAdmin();

  console.log("\n정원 — 개인");
  const state = (beds: number) => ({ v: 1, jam: 50, beds: Array(beds).fill(null), basket: [], notes: [], updatedAt: Date.now() });
  await expectDenied("남의 정원에 쓰기", () => setDoc(doc(db, "users", "somebody-else", "garden", "state"), state(6)));
  await expectDenied("state 말고 다른 문서에 쓰기", () => setDoc(doc(db, "users", uid, "garden", "other"), state(6)));
  await expectDenied("밭 13칸으로 쓰기", () => setDoc(doc(db, "users", uid, "garden", "state"), state(13)));
  await expectAllowed("제 정원 쓰기", () => setDoc(doc(db, "users", uid, "garden", "state"), state(12)));
  await expectAllowed("제 정원 지우기", () => deleteDoc(doc(db, "users", uid, "garden", "state")));

  await plazaChecks(uid, adminDb);
  await raidChecks(uid, adminDb);
  await bloomChecks(uid, adminDb);
  await leafChecks(uid, adminDb);
  await visitChecks(uid, adminDb);
  await inviteChecks(uid, adminDb);
}

/*
 * 초대 씨앗. invites/{uid}는 평생 하나라 통과 검사를 하면 점검 계정이 "초대받은 사람"이 된다.
 * 그래서 통과 검사는 관리자 키가 있을 때만 하고, 끝나면 점검용 문서를 모두 지운다.
 */
async function inviteChecks(uid: string, adminDb: Awaited<ReturnType<typeof openAdmin>>) {
  console.log("\n정원 — 초대 씨앗");
  const OTHER = "izzprobe001"; // 남의 코드 (관리자가 만든다)
  const MINE = "izzprobe002"; // 내 코드
  const SECOND = "izzprobe003"; // 두 번째로 받으려는 남의 코드
  const codeRef = (c: string) => doc(db, "inviteCodes", c);
  const inviteRef = doc(db, "invites", uid);
  const join = (code: string, by = code, step = 1) => {
    const batch = writeBatch(db);
    batch.set(inviteRef, { by, at: serverTimestamp() });
    batch.update(codeRef(code), { joined: increment(step) });
    return batch.commit();
  };

  await expectDenied("남의 uid로 코드 만들기", () => setDoc(codeRef(MINE), { uid: "somebody-else", joined: 0 }));
  await expectDenied("joined 5로 코드 만들기", () => setDoc(codeRef(MINE), { uid, joined: 5 }));
  await expectDenied("모양이 다른 코드(공개 id 꼴) 만들기", () => setDoc(codeRef("gabcdefghij"), { uid, joined: 0 }));

  if (!adminDb) {
    console.log("  초대 통과 검사는 건너뛴다 (sa.json 없음)");
    return;
  }
  const admin = (path: string) => adminDb.doc(path);
  try {
    await admin(`inviteCodes/${OTHER}`).set({ uid: "somebody-else", joined: 0 });
    await admin(`inviteCodes/${SECOND}`).set({ uid: "somebody-else-2", joined: 0 });

    await expectAllowed("내 코드 만들기", () => setDoc(codeRef(MINE), { uid, joined: 0 }));
    await expectAllowed("내 코드 읽기", () => getDoc(codeRef(MINE)));
    await expectDenied("남의 코드 읽기(누가 만들었는지)", () => getDoc(codeRef(OTHER)));
    await expectDenied("내 코드를 다시 만들어 joined 되돌리기", () => setDoc(codeRef(MINE), { uid, joined: 0 }));
    await expectDenied("내 코드로 나를 초대하기", () => join(MINE));
    await expectDenied("세지 않고 초대 표식만 만들기", () => setDoc(inviteRef, { by: OTHER, at: serverTimestamp() }));
    await expectDenied("표식 없이 남의 joined만 +1", () => updateDoc(codeRef(OTHER), { joined: increment(1) }));
    await expectDenied("한 번에 +2", () => join(OTHER, OTHER, 2));
    await expectDenied("다른 코드를 올리며 이 코드로 표식", () => join(SECOND, OTHER));
    await expectAllowed("초대받아 첫 열매 (표식 + joined +1)", () => join(OTHER));
    await expectDenied("두 번째 초대 받기", () => join(SECOND));
    await expectDenied("초대 표식 지우기", () => deleteDoc(inviteRef));
    await expectDenied("코드 지우기", () => deleteDoc(codeRef(MINE)));
    const after = await admin(`inviteCodes/${OTHER}`).get();
    if (after.get("joined") === 1) ok("남의 코드 joined가 1이 됐다");
    else bad(`남의 코드 joined가 ${after.get("joined")}다. 1이어야 한다`);
  } finally {
    for (const path of [`invites/${uid}`, `inviteCodes/${OTHER}`, `inviteCodes/${SECOND}`, `inviteCodes/${MINE}`]) await admin(path).delete();
    ok("점검용 초대 되돌리기");
  }
}

async function plazaChecks(uid: string, adminDb: Awaited<ReturnType<typeof openAdmin>>) {
  console.log("\n정원 — 광장");
  const MIN = 60_000;
  const day = "1999-01-01";
  const cellRef = (id: string) => doc(db, "plazaCells", id);
  const dayRef = doc(db, "plazaDays", day);
  const markRef = doc(db, "plazaDays", day, "gardeners", uid);

  await expectDenied("없는 칸(c24) 뽑기", () =>
    setDoc(cellRef("c24"), { gen: 1, pulledAt: serverTimestamp(), regrowAt: Timestamp.fromMillis(Date.now() + 30 * MIN) }),
  );
  await expectDenied("칸은 두고 기록판만 +1", () => setDoc(dayRef, { pulls: 1, gardeners: 0, lastCell: "c00" }));

  if (!adminDb) {
    console.log("  광장 통과 검사는 건너뛴다 (sa.json 없음)");
    return;
  }

  // 지금 잡초가 나 있는 칸 둘을 고른다. 문서가 없으면 처음부터 나 있는 칸이다.
  const snaps = await adminDb.getAll(
    ...Array.from({ length: 24 }, (_, i) => adminDb.collection("plazaCells").doc(`c${String(i).padStart(2, "0")}`)),
  );
  const weedy = snaps.filter((s) => !s.exists || (s.get("regrowAt")?.toMillis() ?? 0) <= Date.now() - MIN);
  if (weedy.length < 2) {
    console.log("  광장 통과 검사는 건너뛴다 (잡초가 난 칸이 둘 미만)");
    return;
  }
  const [a, b] = weedy;
  const genOf = (s: (typeof snaps)[number]) => ((s.get("gen") as number | undefined) ?? 0) + 1;
  const pull = (s: (typeof snaps)[number], minutes: number) => ({
    gen: genOf(s),
    pulledAt: serverTimestamp(),
    regrowAt: Timestamp.fromMillis(Date.now() + minutes * MIN),
  });

  try {
    await expectDenied(`${a.id} 뽑고 300분 뒤에 다시 나게 하기`, () => setDoc(cellRef(a.id), pull(a, 300)));
    await expectDenied(`${a.id} 뽑으며 gen 건너뛰기`, () => setDoc(cellRef(a.id), { ...pull(a, 30), gen: genOf(a) + 5 }));

    await expectAllowed(`${a.id} 뽑기 (칸·기록판·표식 한 번에)`, () => {
      const batch = writeBatch(db);
      batch.set(cellRef(a.id), pull(a, 30));
      batch.set(dayRef, { pulls: 1, gardeners: 1, lastCell: a.id });
      batch.set(markRef, { at: serverTimestamp() });
      return batch.commit();
    });

    await expectDenied(`방금 뽑은 ${a.id} 다시 뽑기`, () =>
      setDoc(cellRef(a.id), { gen: genOf(a) + 1, pulledAt: serverTimestamp(), regrowAt: Timestamp.fromMillis(Date.now() + 30 * MIN) }),
    );
    await expectDenied(`${b.id} 뽑으며 기록판 +2`, () => {
      const batch = writeBatch(db);
      batch.set(cellRef(b.id), pull(b, 30));
      batch.set(dayRef, { pulls: 3, gardeners: 1, lastCell: b.id });
      return batch.commit();
    });
    await expectDenied(`${b.id} 뽑으며 이미 센 정원지기 +1`, () => {
      const batch = writeBatch(db);
      batch.set(cellRef(b.id), pull(b, 30));
      batch.set(dayRef, { pulls: 2, gardeners: 2, lastCell: b.id });
      return batch.commit();
    });
    await expectDenied("광장 칸 지우기", () => deleteDoc(cellRef(a.id)));
  } finally {
    // 뽑은 칸을 원래대로 돌리고, 지난 날짜 기록판을 치운다.
    for (const s of [a, b]) {
      if (s.exists) await s.ref.set(s.data()!);
      else await s.ref.delete();
    }
    await adminDb.doc(`plazaDays/${day}/gardeners/${uid}`).delete();
    await adminDb.doc(`plazaDays/${day}`).delete();
    ok("점검용 광장 쓰기 되돌리기");
  }
}

/*
 * 거대 잡초. 문서 id가 오늘의 물결(날짜번호-물결)이라 진짜 오늘의 레이드를 쓴다. 그래서 통과
 * 검사는 관리자 키가 있고 오늘 물결이 하나도 없을 때만 하고, 끝나면 원래대로 되돌린다.
 */
async function raidChecks(uid: string, adminDb: Awaited<ReturnType<typeof openAdmin>>) {
  console.log("\n정원 — 거대 잡초");
  const today = Math.floor((Date.now() + 9 * 3_600_000) / 86_400_000);
  const id = (wave = 1, day = today) => `${day}-${wave}`;
  const raidRef = (wave = 1, day = today) => doc(db, "plazaRaids", id(wave, day));
  const mineRef = doc(db, "plazaRaids", id(), "fighters", uid);
  const shardRef = (n: number) => doc(db, "plazaRaids", id(), "shards", String(n));
  const SHARDS = 8;
  const S = 3; // 이 점검이 올리는 칸
  const fresh = (hp: number) => ({ hp, hits: 0, fighters: 0, spawnedAt: serverTimestamp(), defeatedAt: null });
  // 세울 때 빈 칸 여덟을 함께 만든다(lib/firebase/raid.ts의 spawnRaid).
  const spawn = (wave = 1, hp = 180) => {
    const batch = writeBatch(db);
    batch.set(raidRef(wave), fresh(hp));
    for (let n = 0; n < SHARDS; n++) batch.set(doc(db, "plazaRaids", id(wave), "shards", String(n)), { hits: 0, fighters: 0 });
    return batch.commit();
  };
  // 한 방 = 내 표식(mine) + 내 칸(shard=S)의 hits·fighters.
  const strike = (mine: number, hits: number, fighters: number, shard = S, target = S) => {
    const batch = writeBatch(db);
    batch.set(mineRef, { hits: mine, lastAt: serverTimestamp(), shard });
    batch.set(shardRef(target), { hits, fighters });
    return batch.commit();
  };
  const wait = () => new Promise((r) => setTimeout(r, 1_200));

  await expectDenied("옛 id(날짜 번호만)로 세우기", () => setDoc(doc(db, "plazaRaids", String(today)), fresh(180)));
  await expectDenied("어제 번호로 세우기", () => setDoc(raidRef(1, today - 1), fresh(180)));
  await expectDenied("넷째 물결 세우기", () => setDoc(raidRef(4), fresh(180)));
  await expectDenied("체력 150(둘이 잡을 수 있는 크기)으로 세우기", () => setDoc(raidRef(), fresh(150)));
  await expectDenied("체력 5000으로 세우기", () => setDoc(raidRef(), fresh(5000)));
  await expectDenied("맞은 수 5로 세우기", () => setDoc(raidRef(), { ...fresh(180), hits: 5 }));

  if (!adminDb) {
    console.log("  거대 잡초 통과 검사는 건너뛴다 (sa.json 없음)");
    return;
  }
  const lives = [1, 2, 3].map((w) => adminDb.doc(`plazaRaids/${id(w)}`));
  const befores = await Promise.all(lives.map((l) => l.get()));
  if (befores.some((b) => b.exists)) {
    console.log("  거대 잡초 통과 검사는 건너뛴다 (오늘 물결이 이미 있다)");
    return;
  }
  const live = lives[0];
  const adminMine = adminDb.doc(`plazaRaids/${id()}/fighters/${uid}`);
  const adminShard = (n: number, wave = 1) => adminDb.doc(`plazaRaids/${id(wave)}/shards/${n}`);

  try {
    await expectDenied("첫 물결 없이 둘째 물결 세우기", () => spawn(2));
    await expectAllowed("오늘 첫 물결을 체력 180으로, 빈 칸 여덟과 함께 세우기", () => spawn());
    await expectDenied("첫 물결이 싸우는 중에 둘째 물결 세우기", () => spawn(2));
    await expectDenied("칸에 1을 넣어 두기(내 표식 없이)", () => updateDoc(shardRef(S), { hits: 1 }));
    await expectDenied("물결 문서 합계를 바로 +1(표식 없이)", () => updateDoc(raidRef(), { hits: 1 }));
    await expectDenied("칸은 두고 내 표식만 +1", () => setDoc(mineRef, { hits: 1, lastAt: serverTimestamp(), shard: S }));
    await expectDenied("표식이 가리키지 않는 칸을 올리기", () => strike(1, 1, 1, S, S + 1));
    await expectDenied("칸 번호 8(없는 칸)", () => strike(1, 1, 1, 8, 8));
    await expectDenied("한 번에 +2", () => strike(2, 2, 1));
    await expectDenied("칸과 물결 문서를 함께 +1(한 방에 두 번 세기)", () => {
      const batch = writeBatch(db);
      batch.set(mineRef, { hits: 1, lastAt: serverTimestamp(), shard: S });
      batch.set(shardRef(S), { hits: 1, fighters: 1 });
      batch.update(raidRef(), { hits: 1, fighters: 0, defeatedAt: null });
      return batch.commit();
    });
    await expectAllowed("한 방 (내 표식·내 칸 함께)", () => strike(1, 1, 1));
    await expectDenied("1초 안에 또 한 방", () => strike(2, 2, 1));
    await wait();
    await expectDenied("이미 센 참여자를 또 세기", () => strike(2, 2, 2));
    await expectAllowed("1초 뒤 한 방", () => strike(2, 2, 1));
    await wait();
    // 칸으로 세기 전에 연 탭: 표식에 shard 없이 물결 문서를 1 올린다. 끝없이 막히지 않게 남겨 둔 길.
    await expectAllowed("옛 화면의 한 방(물결 문서 +1)", () => {
      const batch = writeBatch(db);
      batch.set(mineRef, { hits: 3, lastAt: serverTimestamp() });
      batch.update(raidRef(), { hits: 1, fighters: 0, defeatedAt: null });
      return batch.commit();
    });
    await wait();
    await expectAllowed("다시 칸으로 한 방", () => strike(4, 3, 1));

    // 내 몫(60방)을 다 친 것으로 관리자가 올려 둔다.
    await adminMine.update({ hits: 60 });
    await wait();
    await expectDenied("내 몫 60방을 넘어 61번째 한 방", () => strike(61, 4, 1));

    // 합계 = 물결 문서 1 + 칸 3 = 4. 체력 180에 못 미친다.
    await expectDenied("합계가 체력에 못 미쳐 쓰러뜨리기", () => updateDoc(raidRef(), { defeatedAt: serverTimestamp() }));
    // 칸을 올려 합계를 180으로(1 + 179).
    await adminShard(S).update({ hits: 179 });
    await expectDenied("쓰러뜨리며 체력도 바꾸기", () => updateDoc(raidRef(), { defeatedAt: serverTimestamp(), hp: 1 }));
    await expectDenied("쓰러진 시각을 옛날로 찍기", () => updateDoc(raidRef(), { defeatedAt: Timestamp.fromMillis(Date.now() - 3_600_000) }));
    // 칸 하나가 없으면 합을 못 낸다. 쓰러뜨리는 커밋이 빈 칸을 함께 만든다.
    await adminShard(7).delete();
    await expectDenied("빈 칸 없이 쓰러뜨리기(칸 하나가 없다)", () => updateDoc(raidRef(), { defeatedAt: serverTimestamp() }));
    await expectAllowed("빈 칸을 만들며 쓰러뜨리기", () => {
      const batch = writeBatch(db);
      batch.set(shardRef(7), { hits: 0, fighters: 0 });
      batch.update(raidRef(), { defeatedAt: serverTimestamp() });
      return batch.commit();
    });
    await expectDenied("쓰러진 시각을 다시 찍기", () => updateDoc(raidRef(), { defeatedAt: serverTimestamp() }));
    await adminMine.update({ hits: 10 });
    await wait();
    await expectDenied("쓰러진 뒤 한 방", () => strike(11, 180, 1));
    await expectDenied("쓰러진 지 2시간 안에 둘째 물결 세우기", () => spawn(2));
    await expectDenied("거대 잡초 지우기", () => deleteDoc(raidRef()));
    await expectDenied("칸 지우기", () => deleteDoc(shardRef(S)));

    // 도망: 태어난 지 3시간이 지난 물결은 칠 수 없다.
    await live.set({ hp: 180, hits: 0, fighters: 0, spawnedAt: Timestamp.fromMillis(Date.now() - 3.5 * 3_600_000), defeatedAt: null });
    await adminShard(S).update({ hits: 1, fighters: 1 });
    await adminMine.update({ hits: 1 });
    await wait();
    await expectDenied("도망간(3시간 지난) 거대 잡초 치기", () => strike(2, 2, 1));
    await expectDenied("도망간 지 2시간 안에 둘째 물결 세우기", () => spawn(2));
    await live.update({ spawnedAt: Timestamp.fromMillis(Date.now() - 5.5 * 3_600_000) });
    await expectAllowed("도망가고 2시간 뒤 둘째 물결 세우기", () => spawn(2));
  } finally {
    await adminMine.delete();
    for (const wave of [1, 2, 3]) for (let n = 0; n < SHARDS; n++) await adminShard(n, wave).delete();
    for (const l of lives) await l.delete();
    ok("점검용 거대 잡초 되돌리기");
  }
}

async function bloomChecks(uid: string, adminDb: Awaited<ReturnType<typeof openAdmin>>) {
  console.log("\n정원 — 꽃밭");
  const species = "a:zz-rules-probe";
  const bloomRef = (d = db) => doc(d, "blooms", species);
  const keeperRef = (d = db, who = uid) => doc(d, "blooms", species, "keepers", who);
  const today = Math.floor((Date.now() + 9 * 3_600_000) / 86_400_000);
  const keeper = (care: number, dayCare: number) => ({ care, day: today, dayCare, updatedAt: serverTimestamp() });
  const bloom = (care: number, ownerUid: string, ownerCare: number, ownerNick = "점검용", bloomedAt: unknown = null) => ({
    care,
    bloomedAt,
    ownerUid,
    ownerNick,
    ownerCare,
  });
  const both = (d: typeof db, who: string, k: object, b: object) => {
    const batch = writeBatch(d);
    batch.set(keeperRef(d, who), k);
    batch.set(bloomRef(d), b);
    return batch.commit();
  };

  await expectDenied("가꿈 +3", () => both(db, uid, keeper(3, 3), bloom(3, uid, 3)));
  await expectDenied("내 가꿈 없이 합계만 +1", () => setDoc(bloomRef(), bloom(1, uid, 0)));
  await expectDenied("처음부터 만개 시각 찍기", () => both(db, uid, keeper(2, 2), bloom(2, uid, 2, "점검용", serverTimestamp())));
  await expectDenied("정원 이름 13자", () => both(db, uid, keeper(2, 2), bloom(2, uid, 2, "가".repeat(13))));
  await expectDenied("남을 정원지기로 올리기", () => both(db, uid, keeper(2, 2), bloom(2, "somebody-else", 2)));

  if (!adminDb) {
    console.log("  꽃밭 통과 검사는 건너뛴다 (sa.json 없음 — blooms는 지울 수 없어 치우지 못한다)");
    return;
  }

  // 두 번째 사람. 정원지기 다툼을 보려면 둘이 있어야 한다.
  const { db: db2, uid: uid2 } = await secondUser();

  const clean = async () => {
    for (const who of [uid, uid2]) await adminDb.doc(`blooms/${species}/keepers/${who}`).delete();
    await adminDb.doc(`blooms/${species}`).delete();
  };
  await clean();

  try {
    await expectAllowed("가꿈 +2, 정원지기가 되기", () => both(db, uid, keeper(2, 2), bloom(2, uid, 2)));
    await expectDenied("내 가꿈 +2에 합계 +7", () => both(db, uid, keeper(4, 4), bloom(9, uid, 4)));
    await expectDenied("정원지기 값을 내 가꿈보다 크게", () => both(db, uid, keeper(4, 4), bloom(4, uid, 40)));

    let mine = 2;
    let total = 2;
    let fine = true;
    while (mine < 12) {
      mine += 2;
      total += 2;
      try {
        await both(db, uid, keeper(mine, mine), bloom(total, uid, mine));
      } catch (e) {
        fine = false;
        bad(`하루 12까지 채우기 — ${mine}에서 막혔다: ${e instanceof Error ? e.message : String(e)}`);
        break;
      }
    }
    if (fine) ok("하루 12까지 채우기 — 통과했다");
    await expectDenied("하루 12를 넘겨 +1", () => both(db, uid, keeper(13, 13), bloom(total + 1, uid, 13)));

    console.log("  (두 번째 사람)");
    await expectDenied("가꿈 2로 정원지기(12) 빼앗기", () => both(db2, uid2, keeper(2, 2), bloom(total + 2, uid2, 2)));
    await expectAllowed("가꿈 +2, 정원지기는 그대로", () => both(db2, uid2, keeper(2, 2), bloom(total + 2, uid, 12)));
    await expectDenied("남의 가꿈 읽기", () => getDocs(query(collection(db2, "blooms", species, "keepers"), limit(5))));

    // 만개 직전까지 관리자가 합계를 올려 둔다. 한 사람은 하루 12까지라 규칙으로는 못 닿는다.
    await adminDb.doc(`blooms/${species}`).update({ care: 28 });
    await expectDenied("합계 30이 되는데 만개 시각을 안 찍기", () => both(db2, uid2, keeper(4, 4), bloom(30, uid, 12)));
    await expectAllowed("합계 30에서 만개 시각 찍기", () =>
      both(db2, uid2, keeper(4, 4), bloom(30, uid, 12, "점검용", serverTimestamp())),
    );
    await expectDenied("만개 시각 다시 찍기", () =>
      both(db2, uid2, keeper(6, 6), bloom(32, uid, 12, "점검용", serverTimestamp())),
    );
    await expectDenied("꽃 지우기", () => deleteDoc(bloomRef()));

    console.log("  (운영자 — 두 번째 사람을 잠깐 올렸다 내린다)");
    await expectDenied("일반 사용자가 남의 정원 이름 지우기", () => updateDoc(bloomRef(db2), { ownerNick: null }));
    await adminDb.doc(`admins/${uid2}`).set({ grantedAt: new Date().toISOString(), probe: true });
    try {
      await expectDenied("운영자가 남의 정원 이름 바꾸기", () => updateDoc(bloomRef(db2), { ownerNick: "바꿈" }));
      await expectDenied("운영자가 숨긴 이름을 남기지 않고 지우기", () => updateDoc(bloomRef(db2), { ownerNick: null }));
      await expectDenied("운영자가 다른 이름을 숨긴 이름으로 적기", () =>
        updateDoc(bloomRef(db2), { ownerNick: null, hiddenNick: "엉뚱한 이름" }),
      );
      await expectAllowed("운영자가 남의 정원 이름 숨기기", () =>
        updateDoc(bloomRef(db2), { ownerNick: null, hiddenNick: "점검용" }),
      );
    } finally {
      await adminDb.doc(`admins/${uid2}`).delete();
    }

    console.log("  (숨긴 뒤 — 정원지기 본인)");
    await expectDenied("숨긴 이름을 다시 걸기", () => updateDoc(bloomRef(), { ownerNick: "점검용" }));
    await expectDenied("숨긴 이름 기록 지우기", () => updateDoc(bloomRef(), { hiddenNick: null }));
    await expectAllowed("새 이름으로 다시 걸기", () => updateDoc(bloomRef(), { ownerNick: "새 이름" }));
    await expectDenied("남(두 번째 사람)이 정원지기 이름 바꾸기", () => updateDoc(bloomRef(db2), { ownerNick: "남의 손" }));
  } finally {
    await clean();
    ok("점검용 꽃 치우기");
  }
}

/*
 * 시든 잎 확인. 진짜 잎이 아닌 id(lzzprobe)로 한다 — 빌드 목록에 없으니 운영자 스크립트에도
 * 화면에도 나오지 않는다. leafChecks는 지울 수 없어 통과 검사는 관리자 키가 있을 때만 하고
 * 끝나면 치운다.
 */
async function leafChecks(uid: string, adminDb: Awaited<ReturnType<typeof openAdmin>>) {
  console.log("\n정원 — 시든 잎");
  const id = "lzzprobe";
  const leafRef = doc(db, "leafChecks", id);
  const voteRef = doc(db, "leafChecks", id, "votes", uid);
  const both = (verdict: string, opens: number, fails: number) => {
    const batch = writeBatch(db);
    batch.set(voteRef, { verdict, at: serverTimestamp() });
    batch.set(leafRef, { opens, fails, updatedAt: serverTimestamp() });
    return batch.commit();
  };

  await expectDenied("답 없이 숫자만 +1", () => setDoc(leafRef, { opens: 1, fails: 0, updatedAt: serverTimestamp() }));
  await expectDenied("'열려요'라 답하고 '안 열려요'를 +1", () => both("opens", 0, 1));
  await expectDenied("한 번 답하고 +2", () => both("fails", 0, 2));
  await expectDenied("모르는 답(maybe)", () => both("maybe", 0, 0));
  await expectDenied("url 적기", () => {
    const batch = writeBatch(db);
    batch.set(voteRef, { verdict: "fails", at: serverTimestamp() });
    batch.set(leafRef, { opens: 0, fails: 1, updatedAt: serverTimestamp(), url: "https://evil.example" });
    return batch.commit();
  });
  await expectDenied("잎 모양이 아닌 id", () => setDoc(doc(db, "leafChecks", "zz-probe"), { opens: 0, fails: 0, updatedAt: serverTimestamp() }));

  if (!adminDb) {
    console.log("  시든 잎 통과 검사는 건너뛴다 (sa.json 없음 — leafChecks는 지울 수 없어 치우지 못한다)");
    return;
  }

  try {
    await expectAllowed("'안 열려요' 답하기 (답·숫자 한 번에)", () => both("fails", 0, 1));
    await expectDenied("같은 잎에 다시 답하기", () => both("opens", 1, 1));
    await expectDenied("남의 답 읽기", () => getDocs(query(collection(db, "leafChecks", id, "votes"), limit(5))));
    await expectDenied("잎 지우기", () => deleteDoc(leafRef));
  } finally {
    await adminDb.doc(`leafChecks/${id}/votes/${uid}`).delete();
    await adminDb.doc(`leafChecks/${id}`).delete();
    ok("점검용 잎 치우기");
  }
}

/*
 * 공개 정원과 물 주기 (docs/garden-game.md §3.10). 점검용 공개 id로 하고, 물 표식은
 * 지울 수 없는 규칙이라 치우기는 관리자 키로 한다. 키가 없으면 쓰지 않는 검사만 한다.
 */
async function visitChecks(uid: string, adminDb: Awaited<ReturnType<typeof openAdmin>>) {
  console.log("\n정원 — 공개와 물 주기");
  const gid = "gzzrulesprobe";
  const today = Math.floor((Date.now() + 9 * 3_600_000) / 86_400_000);
  const garden = (over: Record<string, unknown> = {}) => ({
    ownerUid: uid,
    nick: "점검용",
    beds: [{ s: "w:probe", p: 1, r: 2 }, null],
    dex: 3,
    golden: 0,
    rainbow: 0,
    updatedAt: serverTimestamp(),
    ...over,
  });
  const gardenRef = (d = db, id = gid) => doc(d, "gardens", id);

  await expectDenied("남의 uid로 공개하기", () => setDoc(gardenRef(), garden({ ownerUid: "somebody-else" })));
  await expectDenied("공개 id 모양이 틀림", () => setDoc(gardenRef(db, "uid-like-id"), garden()));
  await expectDenied("정원 이름 13자", () => setDoc(gardenRef(), garden({ nick: "가".repeat(13) })));
  await expectDenied("밭 13칸", () => setDoc(gardenRef(), garden({ beds: Array(13).fill(null) })));
  await expectDenied("잼까지 담기", () => setDoc(gardenRef(), garden({ jam: 999 })));

  if (!adminDb) {
    console.log("  공개 정원 통과 검사는 건너뛴다 (sa.json 없음 — 물 표식은 지울 수 없어 치우지 못한다)");
    return;
  }
  const { db: db2, uid: uid2 } = await secondUser();
  const waterRef = (d: typeof db, who: string) => doc(d, "gardens", gid, "waters", who);
  const water = (d: typeof db, who: string, day = today, nick = "이웃") =>
    setDoc(waterRef(d, who), { day, at: serverTimestamp(), nick });

  const clean = async () => {
    for (const who of [uid, uid2]) await adminDb.doc(`gardens/${gid}/waters/${who}`).delete();
    await adminDb.doc(`gardens/${gid}`).delete();
  };
  await clean();

  try {
    await expectAllowed("제 정원 공개하기", () => setDoc(gardenRef(), garden()));
    await expectAllowed("누구나 공개 정원 읽기", () => getDoc(gardenRef(db2)));
    await expectDenied("남이 공개 정원 고치기", () => setDoc(gardenRef(db2), garden({ ownerUid: uid2 })));
    await expectDenied("남이 공개 정원 지우기", () => deleteDoc(gardenRef(db2)));
    await expectDenied("주인 바꾸기", () => setDoc(gardenRef(), garden({ ownerUid: uid2 })));

    await expectDenied("내 정원에 물 주기", () => water(db, uid));
    await expectDenied("남의 uid로 물 주기", () => water(db2, uid));
    await expectDenied("어제 날짜로 물 주기", () => water(db2, uid2, today - 1));
    await expectAllowed("친구 정원에 물 주기", () => water(db2, uid2));
    await expectDenied("같은 날 또 물 주기", () => water(db2, uid2));
    await expectAllowed("주인이 받은 물 읽기", () =>
      getDocs(query(collection(db, "gardens", gid, "waters"), where("day", "==", today))),
    );
    await expectAllowed("물 준 사람이 제 표식 읽기", () => getDoc(waterRef(db2, uid2)));
    await expectDenied("물 표식 지우기", () => deleteDoc(waterRef(db2, uid2)));
    await expectAllowed("주인이 공개 끄기(지우기)", () => deleteDoc(gardenRef()));
    await expectDenied("공개를 끈 정원에 물 주기", () => water(db, uid, today, "주인"));
  } finally {
    await clean();
    ok("점검용 공개 정원 치우기");
  }
}

main().catch((e) => {
  console.error("점검 중 오류:", e);
  process.exit(1);
});
