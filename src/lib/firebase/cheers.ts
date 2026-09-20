"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  limit as fsLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 지지자 응원 — 영상과 한 줄.
 *
 * ★ 피드백과 같은 뼈대를 쓴다.
 *   공개로 읽고, 익명으로 쓰고, '나도요'는 표시 문서와 카운터를 한 배치로
 *   보내고, 제 글과 운영자만 지운다. 이미 한 번 규칙까지 맞춰 둔 모양이므로
 *   여기서 새로 궁리하지 않는다 — 궁리하면 미묘하게 다른 두 번째 규칙이
 *   생기고, 둘 중 하나는 반드시 덜 검사된다.
 *
 * ★ 다른 것은 길이다. 80자.
 *   이 숫자가 이 게시판의 설계 전부다. 한 줄로는 남을 헐뜯거나 논쟁을 벌일
 *   수 없고, 운영자가 한 건 읽는 데 2초면 된다. 길이를 늘리는 순간 이것은
 *   응원판이 아니라 정치 게시판이 되고, 그때부터 옆 탭에 있는 근거까지
 *   같이 의심받는다. 답글을 만들지 않는 이유도 같다.
 *
 * ★ 영상은 문서 id가 곧 유튜브 영상 id다.
 *   같은 영상이 두 번 올라오는 것을 화면이 아니라 저장소가 막는다. 필드로
 *   두면 목록을 다 읽어 봐야 알 수 있고, 동시에 둘이 올리면 둘 다 통과한다.
 */

export const NOTE_MAX = 80;

/* ── 영상 ─────────────────────────────────────────────────────── */

export interface SubmittedVideo {
  youtubeId: string;
  title: string;
  channel: string;
  channelUrl: string | null;
  createdAt: Date | null;
  /** 내가 올린 것인지. 화면은 이것만 알면 되고 uid 자체는 쓰지 않는다. */
  mine: boolean;
}

/**
 * 주소에서 영상 id를 뽑는다.
 *
 * 붙여넣는 주소는 한 가지가 아니다 — 쇼츠 주소에는 `?si=` 꼬리가 붙고,
 * 공유 버튼은 youtu.be를 주고, 주소창에서 긁으면 watch?v= 가 온다. 셋을
 * 다 받지 않으면 사람들은 "주소가 틀렸다"는 말을 자기 잘못으로 읽는다.
 */
export function parseYoutubeId(input: string): string | null {
  const text = input.trim();
  const ok = (value: string | null | undefined) =>
    value && /^[\w-]{11}$/.test(value) ? value : null;

  if (ok(text)) return text;

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  const parts = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") return ok(parts[0]);
  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    if (parts[0] === "shorts" || parts[0] === "embed" || parts[0] === "live") {
      return ok(parts[1]);
    }
    if (parts[0] === "watch") return ok(url.searchParams.get("v"));
  }
  return null;
}

function toVideo(
  id: string,
  data: Record<string, unknown>,
  uid: string | null,
): SubmittedVideo {
  const createdAt = data.createdAt;
  return {
    youtubeId: id,
    title: typeof data.title === "string" ? data.title : "",
    channel: typeof data.channel === "string" ? data.channel : "",
    channelUrl: typeof data.channelUrl === "string" ? data.channelUrl : null,
    createdAt: createdAt instanceof Timestamp ? createdAt.toDate() : null,
    mine: Boolean(uid) && data.authorUid === uid,
  };
}

export function watchCheerVideos(
  uid: string | null,
  onChange: (videos: SubmittedVideo[]) => void,
  onError: (message: string) => void,
): () => void {
  const db = firebaseDb();
  if (!db) {
    onError("파이어베이스 설정이 없습니다.");
    return () => {};
  }

  const q = query(
    collection(db, "cheerVideos"),
    orderBy("createdAt", "desc"),
    fsLimit(100),
  );

  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => toVideo(d.id, d.data(), uid))),
    (error) => onError(error.message),
  );
}

/**
 * 영상을 건다.
 *
 * 제목과 채널은 부르는 쪽이 /api/youtube에서 받아 온 것을 그대로 넘긴다.
 * 여기서 다시 물으면 화면이 보여 준 것과 저장된 것이 달라질 수 있다 —
 * 사람은 확인 화면에서 본 것이 올라갔다고 믿는다.
 */
export async function postCheerVideo(
  uid: string,
  video: { youtubeId: string; title: string; channel: string; channelUrl: string | null },
): Promise<void> {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 설정이 없습니다.");

  /*
   * setDoc은 이미 있으면 덮어쓴다. 그런데 규칙이 이 컬렉션의 update를 아예
   * 막아 두었으므로, 이미 걸린 영상이면 여기서 권한 오류로 튕긴다. 그게
   * 곧 "겹쳤다"는 뜻이다.
   */
  try {
    await setDoc(doc(db, "cheerVideos", video.youtubeId), {
      youtubeId: video.youtubeId,
      title: video.title,
      channel: video.channel,
      channelUrl: video.channelUrl,
      authorUid: uid,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (/permission|insufficient/i.test(message)) {
      throw new Error("이미 올라와 있는 영상입니다.");
    }
    throw e;
  }
}

export async function deleteCheerVideo(youtubeId: string): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  await deleteDoc(doc(db, "cheerVideos", youtubeId));
}

/* ── 한 줄 응원 ────────────────────────────────────────────────── */

export interface CheerNote {
  id: string;
  body: string;
  agreeCount: number;
  createdAt: Date | null;
  mine: boolean;
}

function toNote(
  id: string,
  data: Record<string, unknown>,
  uid: string | null,
): CheerNote {
  const createdAt = data.createdAt;
  return {
    id,
    body: typeof data.body === "string" ? data.body : "",
    agreeCount: typeof data.agreeCount === "number" ? data.agreeCount : 0,
    createdAt: createdAt instanceof Timestamp ? createdAt.toDate() : null,
    mine: Boolean(uid) && data.authorUid === uid,
  };
}

export function watchCheerNotes(
  uid: string | null,
  onChange: (notes: CheerNote[]) => void,
  onError: (message: string) => void,
): () => void {
  const db = firebaseDb();
  if (!db) {
    onError("파이어베이스 설정이 없습니다.");
    return () => {};
  }

  const q = query(
    collection(db, "cheerNotes"),
    orderBy("createdAt", "desc"),
    fsLimit(300),
  );

  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => toNote(d.id, d.data(), uid))),
    (error) => onError(error.message),
  );
}

export async function loadMyNoteAgrees(uid: string, ids: string[]): Promise<Set<string>> {
  const db = firebaseDb();
  if (!db || ids.length === 0) return new Set();

  const found = await Promise.all(
    ids.map(async (id) => {
      try {
        const snap = await getDoc(doc(db, "cheerNotes", id, "agrees", uid));
        return snap.exists() ? id : null;
      } catch {
        return null;
      }
    }),
  );
  return new Set(found.filter((id): id is string => id !== null));
}

export async function postCheerNote(uid: string, input: string): Promise<void> {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 설정이 없습니다.");

  /* 줄바꿈을 지운다. 한 줄이라고 해 놓고 여러 줄이 들어오면 한 줄이 아니다. */
  const body = input.replace(/\s+/g, " ").trim();
  if (body.length === 0) throw new Error("응원을 적어 주세요.");
  if (body.length > NOTE_MAX) throw new Error(`${NOTE_MAX}자까지 쓸 수 있습니다.`);

  await addDoc(collection(db, "cheerNotes"), {
    body,
    authorUid: uid,
    agreeCount: 0,
    createdAt: serverTimestamp(),
  });
}

/** 카운터와 표시 문서를 한 배치로. 따로 보내면 규칙이 둘 다 거절한다. */
export async function toggleNoteAgree(
  uid: string,
  id: string,
  agreed: boolean,
): Promise<void> {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 설정이 없습니다.");

  const batch = writeBatch(db);
  const note = doc(db, "cheerNotes", id);
  const mark = doc(db, "cheerNotes", id, "agrees", uid);

  if (agreed) {
    batch.delete(mark);
    batch.update(note, { agreeCount: increment(-1) });
  } else {
    batch.set(mark, { at: serverTimestamp() });
    batch.update(note, { agreeCount: increment(1) });
  }

  await batch.commit();
}

export async function deleteCheerNote(id: string): Promise<void> {
  const db = firebaseDb();
  if (!db) return;
  await deleteDoc(doc(db, "cheerNotes", id));
}
