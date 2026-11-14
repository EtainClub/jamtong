/**
 * 1촌의 규칙 — `pnpm garden:test`.
 * 표(이름표·문구·스티커)와 한 줄 읽기, 소식, 아무 방이나, 신청 상한을 본다.
 * 규칙이 지키는 값은 firestore.rules와 짝이 맞아야 한다 — 규칙 파일을 읽어 대조한다.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import type { Species } from "../types";
import {
  canSign,
  freshIlchon,
  guestbookId,
  ILCHON_MAX,
  knockRefusal,
  lineText,
  NEWS_KINDS,
  NEWS_MAX,
  newsEntry,
  newsText,
  normalizeIlchon,
  PHRASES,
  pickRandomRoom,
  pushNews,
  RANDOM_POOL,
  readLine,
  readNews,
  SENT_MAX,
  STICKERS,
  TAGS,
  TEXT_MAX,
  validTag,
  WATER_CUT_ILCHON,
} from "./rules";
import { WATER_CUT, waterBeds } from "../rules";

const species = (id: string): Species => ({ id, tier: "sprout", title: `품종 ${id}`, href: "/x", notes: [], seed: 1, region: "words", links: [] });
const byId = new Map([["w:a", species("w:a")]]);

test("표: 설계의 수와 같고 겹치지 않는다", () => {
  assert.equal(TAGS.length, 8);
  assert.equal(PHRASES.length, 30);
  assert.equal(STICKERS.length, 12);
  assert.equal(new Set(TAGS).size, TAGS.length);
  assert.equal(new Set(PHRASES).size, PHRASES.length);
  assert.equal(new Set(STICKERS.map((s) => s.icon)).size, STICKERS.length);
  // 문구는 표에 있는 글이라 그 자체로 60자 안이어야 한다.
  for (const p of PHRASES) assert.ok(p.length <= TEXT_MAX, p);
});

test("firestore.rules의 1촌 규칙이 ilchon/rules.ts의 값과 같다", () => {
  const rules = readFileSync("firestore.rules", "utf8"); // pnpm garden:test는 저장소 뿌리에서 돈다
  const has = (text: string) => assert.ok(rules.includes(text), `firestore.rules에 없음: ${text}`);
  has(`t is int && t >= 0 && t < ${TAGS.length}`);
  has(`d.p is int && d.p >= -1 && d.p < ${PHRASES.length}`);
  has(`d.k is int && d.k >= 0 && d.k < ${STICKERS.length}`);
  has(`d.x.size() >= 1 && d.x.size() <= ${TEXT_MAX}`);
  has(`d.news is list && d.news.size() <= ${NEWS_MAX}`);
  has(`d.ilchonList is list && d.ilchonList.size() <= ${ILCHON_MAX}`);
  has(`d.guestbook in ['all', 'ilchon', 'off']`);
  // 방명록 id = uid_오늘(guestbookId)
  has(`eid == request.auth.uid + '_' + string(int(kstDayNumber()))`);
  // 가린 방은 세 칸만
  has(`d.keys().hasOnly(['ownerUid', 'hidden', 'updatedAt'])`);
});

test("한 줄 읽기: 문구와 직접 쓴 글 중 하나, 스티커는 표 안", () => {
  assert.deepEqual(readLine({ p: 3, x: "", k: 0 }), { p: 3, x: "", k: 0 });
  assert.deepEqual(readLine({ p: -1, x: "안녕", k: 11 }), { p: -1, x: "안녕", k: 11 });
  assert.equal(readLine({ p: -1, x: "", k: 0 }), null, "직접 쓰기인데 비었다");
  assert.equal(readLine({ p: 3, x: "덧붙임", k: 0 }), null, "문구에 글을 덧붙였다");
  assert.equal(readLine({ p: PHRASES.length, x: "", k: 0 }), null);
  assert.equal(readLine({ p: 0, x: "", k: STICKERS.length }), null);
  assert.equal(readLine({ p: -1, x: "가".repeat(TEXT_MAX + 1), k: 0 }), null);
  assert.equal(readLine({ p: "0", x: "", k: 0 }), null);
  assert.equal(lineText({ p: 1, x: "", k: 0 }), PHRASES[1]);
  assert.equal(lineText({ p: -1, x: "직접", k: 0 }), "직접");
});

test("방명록 id는 uid_날, 받기는 모두·1촌만·받지 않기", () => {
  assert.equal(guestbookId("abc", 20406), "abc_20406");
  assert.equal(canSign("all", false), true);
  assert.equal(canSign("ilchon", false), false);
  assert.equal(canSign("ilchon", true), true);
  assert.equal(canSign("off", true), false);
});

test("소식: 최근 것부터 다섯, 같은 소식은 하나, 읽는 쪽이 표에서 문장을 만든다", () => {
  let news = [] as ReturnType<typeof pushNews>;
  for (let i = 0; i < 8; i++) news = pushNews(news, newsEntry("species", `w:${i}`, i));
  assert.equal(news.length, NEWS_MAX);
  assert.equal(news[0].s, "w:7");
  news = pushNews(news, newsEntry("species", "w:5", 99));
  assert.equal(news.filter((n) => n.s === "w:5").length, 1);
  assert.equal(news[0].t, 99);

  assert.equal(NEWS_KINDS.indexOf("species"), 0, "번호는 공개 문서에 실린다 — 순서를 바꾸지 않는다");
  assert.match(newsText(newsEntry("species", "w:a", 1), byId)!, /품종 w:a/);
  assert.match(newsText(newsEntry("mutant", "w:a", 1, "golden"), byId)!, /황금/);
  assert.match(newsText(newsEntry("room", "", 1, "2"), byId)!, /볕 드는 방/);
  assert.equal(newsText(newsEntry("species", "w:없음", 1), byId), null, "품종표에 없는 품종");
  assert.equal(newsText(newsEntry("mutant", "w:a", 1, "<script>"), byId), null, "모르는 변이");
  assert.equal(newsText({ k: 9, s: "w:a", t: 1 }, byId), null, "모르는 종류");
  assert.equal(newsText(newsEntry("room", "", 1, "0"), byId), null);
  assert.deepEqual(readNews([{ k: 0, s: "w:a", t: 1 }, { k: "x" }, null, "글"]), [{ k: 0, s: "w:a", t: 1 }]);
});

test("아무 방이나: 가린 방·내 방을 빼고 앞의 스무 곳에서", () => {
  const rooms = Array.from({ length: 30 }, (_, i) => ({ gid: `g${i}`, hidden: i === 0, mine: i === 1 }));
  assert.equal(pickRandomRoom(rooms, () => 0), "g2");
  assert.equal(pickRandomRoom(rooms, () => 0.9999), `g${RANDOM_POOL + 1}`);
  assert.equal(pickRandomRoom([{ gid: "g0", hidden: true, mine: false }]), null);
});

test("1촌 신청: 방을 열어야, 1촌·보낸 신청 상한 안에서", () => {
  const base = { myGid: "gme00000000", shareOn: true, target: "gyou0000000", friends: [], sent: [] };
  assert.equal(knockRefusal(base), null);
  assert.equal(knockRefusal({ ...base, shareOn: false }), "closed");
  assert.equal(knockRefusal({ ...base, target: base.myGid }), "self");
  assert.equal(knockRefusal({ ...base, sent: Array.from({ length: SENT_MAX }, (_, i) => ({ g: `g${i}`, n: "", tag: 0, at: 0 })) }), "sent-full");
  const friends = Array.from({ length: ILCHON_MAX }, (_, i) => ({ uid: `u${i}`, g: `g${i}`, n: "", tag: 0, at: 0 }));
  assert.equal(knockRefusal({ ...base, friends }), "friends-full");
  assert.equal(knockRefusal({ ...base, friends: [{ uid: "u", g: base.target, n: "", tag: 0, at: 0 }] }), "friend");
});

test("장부: 옛 정원에 빈 칸을 채우고, 어긋난 값은 버린다", () => {
  assert.deepEqual(normalizeIlchon(undefined), freshIlchon());
  const il = normalizeIlchon({ accept: false, guestbook: "nope" as never, friends: [{ uid: "u", g: "g1", n: "n", tag: 0, at: 0 }, null as never] });
  assert.equal(il.accept, false);
  assert.equal(il.guestbook, "all");
  assert.equal(il.friends.length, 1);
  assert.equal(validTag(7), true);
  assert.equal(validTag(8), false);
});

test("1촌의 물은 15%, 보통 물은 10%", () => {
  const now = 0;
  const plant = { id: "p", speciesId: "w:a", plantedAt: 0, ripeAt: 1000, speed: 1, harvests: 0 };
  assert.equal(waterBeds([plant], now)[0]!.ripeAt, 1000 * (1 - WATER_CUT));
  assert.equal(waterBeds([plant], now, WATER_CUT_ILCHON)[0]!.ripeAt, 1000 * (1 - WATER_CUT_ILCHON));
  assert.ok(WATER_CUT_ILCHON > WATER_CUT);
});
