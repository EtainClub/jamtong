import { z } from "zod";

import { bookSchema, type Book } from "./schema";

/**
 * 자서전 목록.
 *
 * ★ 지금은 서지 정보만 있다. 챕터는 비어 있다.
 *   책 내용을 추측해서 채우지 않는다. 이 저장소가 막으려는 오염이 바로
 *   그것이고, 자서전은 실존 인물이 쓴 저작물이라 더 그렇다. 챕터는 실제 책을
 *   펴 놓고 한 장씩 넣는다.
 *
 * ★ 서지 정보의 출처는 아직 백과사전이다.
 *   `source.verified: false`가 그 뜻이고, 화면도 그렇게 밝힌다. 출판사나
 *   국립중앙도서관 자료로 대조하면 true로 올린다.
 *   (위키의 [[concept/sources-and-weight]]가 정한 4층이다.)
 */

const WIKIPEDIA = {
  title: "이재명 — 저서",
  publisher: "한국어 위키백과",
  url: "https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%9E%AC%EB%AA%85",
  verified: false,
};

const raw: z.input<typeof bookSchema>[] = [
  {
    id: "book-hope",
    slug: "hope-through-hardship",
    title: "고난을 통해 희망을 만들다",
    publisher: "청동거울",
    year: 2010,
    tone: "clay",
    source: WIKIPEDIA,
    chapters: [],
  },
  {
    id: "book-democracy",
    slug: "only-democracy",
    title: "오직 민주주의, 꼬리를 잡고 몸통을 흔들다",
    publisher: "리북",
    year: 2014,
    tone: "moss",
    source: WIKIPEDIA,
    chapters: [],
  },
  {
    id: "book-revolution",
    slug: "revolution",
    title: "이재명, 대한민국 혁명하라",
    publisher: "메디치미디어",
    year: 2017,
    tone: "rust",
    source: WIKIPEDIA,
    chapters: [],
  },
  {
    id: "book-does",
    slug: "lee-does-it",
    title: "이재명은 합니다",
    publisher: "위즈덤하우스",
    year: 2017,
    tone: "ink",
    source: WIKIPEDIA,
    chapters: [],
  },
  {
    id: "book-together",
    slug: "not-lonely-together",
    title: "함께 가는 길은 외롭지 않습니다",
    publisher: "위즈덤하우스",
    year: 2022,
    tone: "dusk",
    source: WIKIPEDIA,
    chapters: [],
  },
  {
    id: "book-people",
    slug: "people-do-it",
    title: "결국 국민이 합니다",
    publisher: "오마이북",
    year: 2025,
    tone: "slate",
    source: WIKIPEDIA,
    chapters: [],
  },
];

export const BOOKS: Book[] = raw.map((book) => bookSchema.parse(book));

/** 오래된 것부터. 한 사람이 무엇을 거쳐 왔는지가 순서로 읽힌다. */
export const BOOKS_BY_YEAR: Book[] = [...BOOKS].sort((a, b) => a.year - b.year);

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((book) => book.slug === slug);
}

export function getChapter(bookSlug: string, chapterSlug: string) {
  const book = getBook(bookSlug);
  const chapter = book?.chapters.find((c) => c.slug === chapterSlug);
  return book && chapter ? { book, chapter } : undefined;
}

/** 챕터가 한 장이라도 있는 책. 목록에서 "읽을 수 있음"으로 가른다. */
export function hasChapters(book: Book): boolean {
  return book.chapters.length > 0;
}
