import assert from "node:assert/strict";
import { test } from "node:test";

import { freshRoom, publicRoom } from "@/features/garden/room/rules";
import { cardRoom, loadGardenCard } from "./garden-state";

function field(value: unknown): object {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return { integerValue: String(value) };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(field) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(value as object).map(([k, v]) => [k, field(v)])) } };
}

// Feed the REST wire representation to the same parser used by the image route.
const parseRoom = (value: unknown) => cardRoom(field(value), new Map());

test("공유 방: 벽·바닥·가구 배치를 보존하고 알 수 없는 가구와 자유글은 제외한다", () => {
  const room = freshRoom();
  room.motto = "방에서만 보이는 말";
  room.placed = [{ at: "b0", it: "bed" }, { at: "f2", it: "keyboard" }];
  const pub = publicRoom(room);
  pub.placed.push({ a: "w0", i: "unknown-furniture" });
  const actual = parseRoom(pub);
  assert.equal(actual.wall, room.wall);
  assert.equal(actual.floor, room.floor);
  assert.deepEqual(actual.placed, room.placed);
  assert.deepEqual(actual.keys, room.keys);
  assert.equal(actual.motto, "");
});

test("공유 방: 방이 없는 옛 문서와 잘못된 배치는 빈 방으로 표시한다", () => {
  assert.deepEqual(cardRoom(undefined, new Map()), freshRoom());
  assert.deepEqual(parseRoom({ placed: [null, 1, "x", {}, { a: "f0", i: 7 }] }).placed, []);
});

test("공유 방: 가린 정원은 표시하지 않고, 키보드 가리기도 이미지에 적용한다", async () => {
  const originalFetch = globalThis.fetch;
  const originalProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const originalKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "demo-room-card";
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "demo-key";
  const room = freshRoom();
  room.placed = [{ at: "f0", it: "keyboard" }];
  let hidden = false;
  let modStatus = 200;
  const requests: string[] = [];
  globalThis.fetch = async (input) => {
    const url = String(input);
    requests.push(url);
    if (url.includes("/mod/keys")) {
      return modStatus === 200 ? Response.json({ fields: { hidden: field(true) } }) : new Response(null, { status: modStatus });
    }
    return Response.json({ fields: { room: field(publicRoom(room)), hidden: field(hidden) } });
  };
  try {
    const card = await loadGardenCard("gabcdefgh");
    assert.ok(card);
    assert.equal(card.room.keys.every((k) => k.face === "0".repeat(144)), true);
    modStatus = 404;
    assert.deepEqual((await loadGardenCard("gabcdefgh"))?.room.keys, room.keys);
    modStatus = 503;
    assert.equal((await loadGardenCard("gabcdefgh"))?.room.keys.every((k) => k.face === "0".repeat(144)), true);
    hidden = true;
    requests.length = 0;
    assert.equal(await loadGardenCard("gabcdefgh"), null);
    assert.equal(requests.length, 1, "가린 정원의 방과 운영자 표시는 더 읽지 않는다");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalProject === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    else process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = originalProject;
    if (originalKey === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    else process.env.NEXT_PUBLIC_FIREBASE_API_KEY = originalKey;
  }
});
