import { BOOKS } from "@/content/books";
import { ROOM_BOOKS } from "@/features/garden/room/books";
import type { BookPack } from "@/lib/firebase/library";

/**
 * 특별한 책 꾸러미 — 방의 책(room/books.ts의 ROOM_BOOKS)마다 장별 제목·한 줄·쉽게 보기 토막·요약 본문.
 * 서버에서만 부른다(본문은 디스크에서 읽은 콘텐츠다). 화면은 api/book-pack의 정적 JSON으로 받는다.
 * 잼통 사이트의 /books/<slug>에 이미 공개된 글만 담는다 — 원문 전문이 아니다(bodyKind summary).
 */
export function bookPack(slug: string): BookPack | null {
  const room = ROOM_BOOKS.find((b) => b.slug === slug);
  const book = BOOKS.find((b) => b.slug === slug);
  if (!room || !book) return null;
  return {
    slug,
    title: book.title,
    year: book.year,
    chapters: book.chapters.map((c) => ({
      slug: c.slug,
      order: c.order,
      title: c.title,
      summary: c.summary,
      minutes: c.minutes,
      points: c.easy.points.map((p) => ({ id: p.id, title: p.title, say: p.say })),
      ...(c.body && c.bodyKind === "summary" ? { body: c.body } : {}),
    })),
  };
}
