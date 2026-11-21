/**
 * 특별한 책의 혜택 — `pnpm garden:test`.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { BOOKS } from "../../../content/books";
import { bookPack } from "../../../lib/books/pack";
import type { Species } from "../types";
import { BOOK_FURNITURE, ROOM_BOOKS } from "./books";
import { FURNITURE_BY_ID } from "./catalog";
import { at } from "./slotTest";
import {
  BOOK_ASK_JAM,
  BOOK_ASK_PER_DAY,
  bookIdOf,
  bookSeed,
  booksDone,
  booksOwned,
  cleanMarks,
  freshLibrary,
  lendClaim,
  LEND_JAM,
  LEND_PER_DAY,
  LIBRARY_SETS,
  normalizeLibrary,
  roomBookOf,
  seedReady,
} from "./library";
import { freshRoom, grantLibrarySets, publicRoom, roomFromPublic, stampBookSince } from "./rules";

test("방의 책 일곱 권은 내용이 있는 자서전과 짝이고, 장 수가 같다", () => {
  for (const b of ROOM_BOOKS) {
    const book = BOOKS.find((x) => x.slug === b.slug);
    assert.ok(book, b.slug);
    assert.equal(b.chapters, book.chapters.length, `${b.slug} 장 수`);
    assert.equal(b.year, book.year, `${b.slug} 해`);
    assert.equal(roomBookOf(bookIdOf(b.slug))?.slug, b.slug);
    const pack = bookPack(b.slug);
    assert.ok(pack && pack.chapters.length === b.chapters);
    // 꾸러미에는 공개된 요약만 — 원문 발췌(excerpt)는 싣지 않는다.
    for (const c of book.chapters) if (c.bodyKind === "excerpt") assert.equal(pack.chapters.find((x) => x.slug === c.slug)?.body, undefined);
  }
  assert.equal(BOOK_FURNITURE.length, ROOM_BOOKS.length);
  assert.equal(roomBookOf("book-only-democracy"), undefined, "내용 없는 책은 방의 책이 아니다");
  assert.equal(roomBookOf("piano"), undefined);
});

test("펼쳐 둔 문장은 id 모양만, 셋까지, 겹치지 않게", () => {
  assert.deepEqual(cleanMarks(["a1-p1", "a1-p1", "a2-p3", "<b>", 3, "a3-p1", "a4-p1"]), ["a1-p1", "a2-p3", "a3-p1"]);
  assert.deepEqual(cleanMarks("x"), []);
});

test("장서표와 펼쳐 둔 문장은 공개 방으로 나가 손님 화면에 그대로 돌아온다", () => {
  const id = bookIdOf("autobiography");
  let room = { ...freshRoom("t"), owned: { [id]: 1 }, placed: [at(id, "f0")] };
  room = stampBookSince(room, id, 20774);
  assert.equal(stampBookSince(room, id, 20999).books?.autobiography?.since, 20774, "처음 들인 날은 바뀌지 않는다");
  room = { ...room, books: { autobiography: { marks: ["a1-p1", "a2-p1"], since: 20774 } } };
  const pub = publicRoom(room);
  const item = pub.placed.find((p) => "i" in p && p.i === id);
  assert.deepEqual(item && "bm" in item ? [item.bm, item.bd] : null, [["a1-p1", "a2-p1"], 20774]);
  const back = roomFromPublic(pub, new Map<string, Species>());
  assert.deepEqual(back.books?.autobiography, { marks: ["a1-p1", "a2-p1"], since: 20774 });
});

test("서재 세트 — 3·5·7권이면 벽지·독서등·책장, 팔지 않는다", () => {
  for (const set of LIBRARY_SETS) {
    const f = FURNITURE_BY_ID.get(set.item);
    assert.ok(f && f.cur === "reward" && f.price === 0, set.item);
  }
  const own = (n: number) => Object.fromEntries(ROOM_BOOKS.slice(0, n).map((b) => [bookIdOf(b.slug), 1]));
  assert.equal(booksOwned(own(4)), 4);
  const two = grantLibrarySets({ ...freshRoom("t"), owned: own(2) });
  assert.equal(two.owned["wp-library"], undefined);
  const five = grantLibrarySets({ ...freshRoom("t"), owned: own(5) });
  assert.equal(five.owned["wp-library"], 1);
  assert.equal(five.owned["lamp-reading"], 1);
  assert.equal(five.owned["shelf-complete"], undefined);
  assert.equal(grantLibrarySets({ ...freshRoom("t"), owned: own(7) }).owned["shelf-complete"], 1);
  assert.equal(grantLibrarySets(five), grantLibrarySets(five).owned === five.owned ? five : grantLibrarySets(five), "다시 받지 않는다");
});

test("완독 — 모든 장에 도장을 찍은 책만", () => {
  const lib = freshLibrary();
  const auto = ROOM_BOOKS.find((b) => b.slug === "autobiography")!;
  lib.read.autobiography = Array.from({ length: auto.chapters - 1 }, (_, i) => `c${i}`);
  assert.equal(booksDone(lib), 0);
  lib.read.autobiography.push("last");
  assert.equal(booksDone(lib), 1);
  assert.deepEqual(normalizeLibrary({ read: { a: ["x", "x", 3] }, seedDay: { a: 1, b: "x" }, lent: { day: 5, uids: ["u", 1] } }).read, { a: ["x"] });
  assert.deepEqual(normalizeLibrary(null), freshLibrary());
});

test("빌려 읽기 — 한 사람 50잼, 하루 10명(500잼)까지, 받은 사람은 다시 없다", () => {
  assert.equal(LEND_JAM * LEND_PER_DAY, 500);
  const lib = freshLibrary();
  const many = Array.from({ length: 14 }, (_, i) => `u${i}`);
  const first = lendClaim(lib, many, 9);
  assert.equal(first.uids.length, 10);
  assert.equal(first.jam, 500);
  const after = { ...lib, lent: { day: 9, uids: first.uids } };
  assert.deepEqual(lendClaim(after, many, 9), { uids: [], jam: 0 }, "오늘 상한");
  assert.equal(lendClaim(after, many, 10).jam, 500, "다음 날은 다시");
  assert.deepEqual(lendClaim({ ...lib, lent: { day: 9, uids: ["u0"] } }, ["u0", "u1", "u1"], 9), { uids: ["u1"], jam: 50 });
});

test("책 씨앗 — 그 책이 나온 해까지 시작된 업적에서, 같은 날·같은 사람이면 같은 씨앗", () => {
  const sp = (id: string, since?: number, tier: Species["tier"] = "flagship"): Species => ({ id, tier, title: id, href: "", notes: [], seed: 1, region: "x", links: [], ...(since ? { since } : {}) });
  const catalog = [sp("a:old", 2008), sp("a:mid", 2016), sp("a:new", 2024), sp("w:word"), sp("a:sprout", 2005, "sprout")];
  const hope = ROOM_BOOKS.find((b) => b.slug === "hope-through-hardship")!;
  for (let day = 1; day < 40; day++) assert.equal(bookSeed(hope, day, "u", catalog)?.id, "a:old", "2010년 책은 2010년까지의 업적만");
  const auto = ROOM_BOOKS.find((b) => b.slug === "autobiography")!;
  const picks = new Set(Array.from({ length: 60 }, (_, d) => bookSeed(auto, d, "u", catalog)?.id));
  assert.deepEqual([...picks].sort(), ["a:mid", "a:new", "a:old"]);
  assert.equal(bookSeed(auto, 3, "u", catalog)?.id, bookSeed(auto, 3, "u", catalog)?.id);
  assert.equal(seedReady({ ...freshLibrary(), seedDay: { autobiography: 3 } }, "autobiography", 3), false);
  assert.equal(seedReady({ ...freshLibrary(), seedDay: { autobiography: 3 } }, "autobiography", 4), true);
});

test("책에게 묻기 — 책마다 하루 3번, 한 번에 100잼. 서버 라우트와 같은 값을 쓴다", () => {
  assert.equal(BOOK_ASK_PER_DAY, 3);
  assert.equal(BOOK_ASK_JAM, 100);
  const route = readFileSync("src/app/api/book-ask/route.ts", "utf8");
  assert.ok(route.includes("BOOK_ASK_PER_DAY") && route.includes("BOOK_ASK_JAM"), "라우트가 같은 상수를 쓴다");
  assert.ok(route.includes("bookIdOf(slug)") && route.includes("placed"), "방에 놓인 책인지 본다");
});

test("firestore.rules — 빌려 읽기 표식과 칭호", () => {
  const rules = readFileSync("firestore.rules", "utf8");
  assert.ok(rules.includes("match /reads/{uid}"));
  assert.ok(rules.includes("request.resource.data.keys().hasOnly(['day', 'at', 'nick', 'b'])"));
  assert.ok(rules.includes("&& !isGardenOwner(gid)"), "내 방 책은 빌려 읽을 수 없다");
  assert.ok(rules.includes("t.keys().hasOnly(['dex', 'storm', 'plaza', 'read', 'lib'])"));
});
