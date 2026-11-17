import { getChapter } from "@/content/books";
import { BOOK_PALETTES, ROOM_BOOKS } from "@/features/garden/room/books";
import { PUBLIC_ID } from "@/features/garden/rules";

/**
 * 특별한 책의 장 카드 — /bk/<책>/<장>?g=<공개 정원 id>와 그 그림(/api/book-card)이 쓴다.
 *
 * ★ 쿼리에서 받는 것은 책·장 slug와 공개 정원 id뿐이다. 카드의 글은 콘텐츠(장 제목·쉽게 보기 토막)와
 *   공개 정원의 이름(누구나 읽는 문서)뿐이다 — 링크에 글을 실어 카드에 찍을 수 없다.
 */
export interface BookCard {
  slug: string;
  chapter: string;
  bookTitle: string;
  order: number;
  title: string;
  summary: string;
  point: { title: string; say: string } | null;
  palette: { cover: string; paper: string; ribbon: string };
  /** 공유한 사람의 정원 이름. 공개 정원이 아니면 null. */
  owner: string | null;
}

async function ownerNick(gid: string | null): Promise<string | null> {
  if (!gid || !PUBLIC_ID.test(gid)) return null;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!project || !key) return null;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/gardens/${gid}?key=${key}&mask.fieldPaths=nick&mask.fieldPaths=hidden`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const f = ((await res.json()) as { fields?: { nick?: { stringValue?: string }; hidden?: { booleanValue?: boolean } } }).fields ?? {};
    if (f.hidden?.booleanValue === true) return null;
    const nick = f.nick?.stringValue?.trim().slice(0, 12);
    return nick || null;
  } catch {
    return null;
  }
}

export async function loadBookCard(slug: string, chapter: string, gid: string | null): Promise<BookCard | null> {
  if (!ROOM_BOOKS.some((b) => b.slug === slug)) return null;
  const found = getChapter(slug, chapter);
  const palette = BOOK_PALETTES.get(`book-${slug}`);
  if (!found || !palette) return null;
  const point = found.chapter.easy.points[0];
  return {
    slug,
    chapter,
    bookTitle: found.book.title,
    order: found.chapter.order,
    title: found.chapter.title,
    summary: found.chapter.summary,
    point: point ? { title: point.title, say: point.say } : null,
    palette,
    owner: await ownerNick(gid),
  };
}
