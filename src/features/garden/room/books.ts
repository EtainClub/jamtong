import type { Furniture } from "./catalog";

/** 장별 내용이 있는 실제 책만. 본문 모듈은 정원 클라이언트로 가져오지 않는다. */
/**
 * 방에 놓는 책(상점 '특별한 책'). chapters는 장의 수 — 완독 도장을 셀 때 쓴다(본문을 정원 번들에 싣지 않으려고 수만 둔다).
 * rules.test.ts가 콘텐츠의 BOOKS와 대조한다.
 */
export const ROOM_BOOKS = [
  { slug: "hope-through-hardship", title: "고난을 통해 희망을 만들다", publisher: "청동거울", year: 2010, cover: "#8c5139", paper: "#fff0d3", ribbon: "#52744b", chapters: 7 },
  { slug: "revolution", title: "이재명, 대한민국 혁명하라", publisher: "메디치미디어", year: 2017, cover: "#843e44", paper: "#f8e4df", ribbon: "#d49b3b", chapters: 17 },
  { slug: "bent-arm", title: "이재명의 굽은 팔", subtitle: "굽은 세상을 펴는 이재명의 삶과 공부", publisher: "김영사", year: 2017, cover: "#65547f", paper: "#f0e7f8", ribbon: "#bc7b43", chapters: 16 },
  { slug: "lee-does-it", title: "이재명은 합니다", publisher: "위즈덤하우스", year: 2017, cover: "#293e61", paper: "#e5edf8", ribbon: "#b54e47", chapters: 21 },
  { slug: "not-lonely-together", title: "함께 가는 길은 외롭지 않습니다", publisher: "위즈덤하우스", year: 2022, cover: "#946c31", paper: "#fff0b9", ribbon: "#507966", chapters: 22 },
  { slug: "people-do-it", title: "결국 국민이 합니다", publisher: "오마이북", year: 2025, cover: "#356978", paper: "#dff4f4", ribbon: "#d78b46", chapters: 5 },
  { slug: "autobiography", title: "이재명 자서전", subtitle: "그 꿈이 있어 여기까지 왔다", publisher: "아시아", year: 2025, cover: "#264b42", paper: "#f8f0d6", ribbon: "#b75440", chapters: 8 },
] as const;

export type RoomBook = (typeof ROOM_BOOKS)[number];
export type RoomBookSlug = RoomBook["slug"];

export const BOOK_FURNITURE: Furniture[] = ROOM_BOOKS.map((book) => ({
  id: `book-${book.slug}`,
  label: book.title,
  kind: "floor",
  size: 1,
  price: 100_000,
  art: `book-${book.slug}`,
  hint: `『${book.title}${"subtitle" in book ? ` — ${book.subtitle}` : ""}』(${book.publisher}, ${book.year}). 금빛 독서대에 놓은 특별한 책이에요. 방에 놓으면 책에게 묻기·낭독·완독 도장·밑줄·빌려 읽기·책 씨앗·장 카드를 쓸 수 있어요.`,
  reading: { href: `/books/${book.slug}`, label: "자서전 장별 요약 읽기" },
}));

/** 실제 출판 표지를 복제하지 않는 잼통 고유의 색 조합. */
export const BOOK_PALETTES = new Map(ROOM_BOOKS.map((book) => [`book-${book.slug}`, { cover: book.cover, paper: book.paper, ribbon: book.ribbon }]));
