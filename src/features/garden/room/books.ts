import type { Furniture } from "./catalog";

/** 장별 내용이 있는 실제 책만. 본문 모듈은 정원 클라이언트로 가져오지 않는다. */
const EDITIONS = [
  { slug: "hope-through-hardship", title: "고난을 통해 희망을 만들다", publisher: "청동거울", year: 2010, cover: "#8c5139", paper: "#fff0d3", ribbon: "#52744b" },
  { slug: "revolution", title: "이재명, 대한민국 혁명하라", publisher: "메디치미디어", year: 2017, cover: "#843e44", paper: "#f8e4df", ribbon: "#d49b3b" },
  { slug: "bent-arm", title: "이재명의 굽은 팔", subtitle: "굽은 세상을 펴는 이재명의 삶과 공부", publisher: "김영사", year: 2017, cover: "#65547f", paper: "#f0e7f8", ribbon: "#bc7b43" },
  { slug: "lee-does-it", title: "이재명은 합니다", publisher: "위즈덤하우스", year: 2017, cover: "#293e61", paper: "#e5edf8", ribbon: "#b54e47" },
  { slug: "not-lonely-together", title: "함께 가는 길은 외롭지 않습니다", publisher: "위즈덤하우스", year: 2022, cover: "#946c31", paper: "#fff0b9", ribbon: "#507966" },
  { slug: "people-do-it", title: "결국 국민이 합니다", publisher: "오마이북", year: 2025, cover: "#356978", paper: "#dff4f4", ribbon: "#d78b46" },
  { slug: "autobiography", title: "이재명 자서전", subtitle: "그 꿈이 있어 여기까지 왔다", publisher: "아시아", year: 2025, cover: "#264b42", paper: "#f8f0d6", ribbon: "#b75440" },
];

export const BOOK_FURNITURE: Furniture[] = EDITIONS.map((book) => ({
  id: `book-${book.slug}`,
  label: book.title,
  kind: "floor",
  size: 1,
  price: 100_000,
  art: `book-${book.slug}`,
  hint: `『${book.title}${book.subtitle ? ` — ${book.subtitle}` : ""}』(${book.publisher}, ${book.year}). 금빛 독서대에 놓은 특별한 책이에요. 누르면 잼통의 장별 요약을 읽을 수 있어요.`,
  reading: { href: `/books/${book.slug}`, label: "자서전 장별 요약 읽기" },
}));

/** 실제 출판 표지를 복제하지 않는 잼통 고유의 색 조합. */
export const BOOK_PALETTES = new Map(EDITIONS.map((book) => [`book-${book.slug}`, { cover: book.cover, paper: book.paper, ribbon: book.ribbon }]));
