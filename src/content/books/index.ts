import { z } from "zod";

import { BENT_ARM_BOOK } from "./2017_bended_arm";
import { CITIZEN_BOOK } from "./2025_citizen";
import { AUTOBIOGRAPHY_BOOK } from "./auto_2025";
import { HOPE_BOOK } from "./hope_2010";
import { REVOLUTION_BOOK } from "./revolution_2017";
import { SAMPLE_BOOK } from "./sample";
import { TOGETHER_BOOK } from "./together";
import { bookSchema, type Book } from "./schema";

/**
 * 자서전 목록.
 *
 * ★ 여기 raw에 있는 책은 서지 정보만 있다. 챕터는 비어 있다.
 *   장을 채운 책(HOPE_BOOK, REVOLUTION_BOOK, BENT_ARM_BOOK, TOGETHER_BOOK,
 *   CITIZEN_BOOK, AUTOBIOGRAPHY_BOOK)은 제 폴더에서 온다.
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
    id: "book-does",
    slug: "lee-does-it",
    title: "이재명은 합니다",
    publisher: "위즈덤하우스",
    year: 2017,
    tone: "ink",
    source: WIKIPEDIA,
    chapters: [],
  },
];

/*
 * 샘플을 뒤에 붙인다. 배포본에는 싣지 않는다.
 *
 * 화면을 확인하려고 만든 책이라 독자에게는 읽을 것이 아니다. 개발 중에는
 * 맨 끝에 두고 표지·책 페이지·장 페이지가 모두 샘플이라고 밝힌다.
 */
export const BOOKS: Book[] = [
  ...raw.map((book) => bookSchema.parse(book)),
  HOPE_BOOK,
  REVOLUTION_BOOK,
  BENT_ARM_BOOK,
  TOGETHER_BOOK,
  CITIZEN_BOOK,
  AUTOBIOGRAPHY_BOOK,
  ...(process.env.NODE_ENV === "production" ? [] : [SAMPLE_BOOK]),
];

/**
 * 오래된 것부터. 한 사람이 무엇을 거쳐 왔는지가 순서로 읽힌다.
 * 샘플은 해와 무관하게 맨 뒤다 — 저서 사이에 끼면 한 권처럼 보인다.
 */
export const BOOKS_BY_YEAR: Book[] = [...BOOKS].sort((a, b) => {
  if (Boolean(a.sample) !== Boolean(b.sample)) return a.sample ? 1 : -1;
  return a.year - b.year;
});

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
