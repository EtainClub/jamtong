/**
 * 공개 방 읽기 — `pnpm garden:test`. 주인이 싣는 것(publicRoom)이 Firestore에서 읽는 모양(toRoom)을 지나
 * 손님의 방(roomFromPublic)까지 빠짐없이 가는지 본다. 하나라도 빠지면 주인 화면은 멀쩡한데 손님에게만 사라진다.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { freshRoom, publicRoom, roomFromPublic, SOUVENIR_CASE, souvenirIds, type RoomData } from "@/features/garden/room/rules";
import { itemAt, place, slotOf } from "@/features/garden/room/slotTest";
import type { Species } from "@/features/garden/types";
import { freshKeys } from "@/features/garden/room/keyboard";

import { toRoom } from "./gardens";

function decorated(): RoomData {
  let r: RoomData = { ...freshRoom("visit"), owned: { piano: 2, keyboard: 2, chair: 1 }, motto: "놀러 오세요" };
  r = place(r, "chair", "b0")!;
  r = place(r, "piano", "f0")!;
  r = place(r, "piano", "f3")!;
  r = place(r, "keyboard", "b2")!;
  r = place(r, "keyboard", "b4")!;
  const second = freshKeys().map((k, i) => ({ ...k, face: String(i + 1).repeat(144) }));
  return {
    ...r,
    pianos: { 0: [60, 62, 64, 65, 67, 69, 71, 72], 1: [48, 50, 52, 53, 55, 57, 59, 60] },
    pianoSongs: { 0: [{ t: 0, n: 60 }, { t: 400, n: 64 }], 1: [{ t: 1200, n: 48 }] },
    keyboards: { 1: second },
    avatar: { ...r.avatar!, at: "3~7", roam: true },
  };
}

test("손님이 읽은 방에 피아노 연주·건반 음이 그대로 있다", () => {
  const owner = decorated();
  // Firestore를 지난 것처럼 — JSON으로 한 번 풀고 읽기 함수로.
  const visitor = roomFromPublic(toRoom(JSON.parse(JSON.stringify(publicRoom(owner))))!, new Map());
  for (const p of owner.placed.filter((x) => x.it === "piano")) {
    const where = slotOf(owner, p);
    const there = itemAt(visitor, where)!;
    assert.deepEqual(visitor.pianoSongs?.[there.kb ?? 0], owner.pianoSongs?.[p.kb ?? 0], `${where}의 연주`);
    assert.deepEqual(visitor.pianos?.[there.kb ?? 0], owner.pianos?.[p.kb ?? 0], `${where}의 건반 음`);
  }
});

test("손님이 읽은 방에 두 번째 키보드의 키와 꼬마가 있다", () => {
  const owner = decorated();
  const visitor = roomFromPublic(toRoom(JSON.parse(JSON.stringify(publicRoom(owner))))!, new Map());
  const second = itemAt(visitor, "b4")!;
  assert.equal(visitor.keyboards?.[second.kb!]?.[0].face, "1".repeat(144));
  assert.equal(visitor.avatar?.at, "3~7");
  assert.equal(visitor.avatar?.roam, true);
  assert.deepEqual(visitor.avatar?.look.hair, owner.avatar!.look.hair);
});

test("읽기 함수는 모양이 틀린 값을 버린다", () => {
  const room = toRoom({
    size: 0, wall: "wp-cream", floor: "fl-wood", mood: "easy", placed: [{ a: "f0", i: "piano", kb: "x", pn: [60, "도"], ps: [{ t: 1, n: 60 }, { t: "a", n: 1 }, null] }],
    keyboards: { 1: "ok", 2: 7 }, avatar: 42,
  })!;
  const p = room.placed[0] as { kb?: number; pn?: number[]; ps?: unknown[] };
  assert.equal(p.kb, undefined);
  assert.deepEqual(p.pn, [60]);
  assert.deepEqual(p.ps, [{ t: 1, n: 60 }]);
  assert.deepEqual(room.keyboards, { 1: "ok" });
  assert.equal(room.avatar, undefined);
});

test("손님이 읽은 방에 사진첩과 기념품 진열장의 기념품이 있다", () => {
  let owner: RoomData = { ...freshRoom("souvenir"), owned: { [SOUVENIR_CASE]: 1 }, shown: [{ id: "s:a:x", kind: "souvenir", species: "a:x" }], album: ["a:x"] };
  owner = place(owner, SOUVENIR_CASE, "b0")!;
  const byId = new Map([["a:x", { id: "a:x" } as Species]]);
  const visitor = roomFromPublic(toRoom(JSON.parse(JSON.stringify(publicRoom(owner))))!, byId);
  assert.deepEqual(visitor.album, ["a:x"]);
  assert.deepEqual(souvenirIds(visitor), ["a:x"]);
});

test("읽기 함수는 아이소 방의 자리(p)를 옮기고, 너무 긴 것은 버린다", () => {
  const room = toRoom({
    size: 0, wall: "wp-cream", floor: "fl-wood", mood: "easy",
    placed: [{ a: "b0", p: "0~0~1", i: "bed" }, { a: "w1", p: "L~2~40", k: "trophy", s: "x" }, { a: "b2", p: "1".repeat(13), i: "desk" }],
  })!;
  assert.deepEqual(room.placed.map((x) => x.p), ["0~0~1", "L~2~40", undefined]);
});
