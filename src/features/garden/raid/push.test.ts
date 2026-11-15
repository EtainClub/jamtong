/**
 * 거대 잡초 등장 알림의 규칙 — `pnpm garden:test`.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { MINUTE, RAID_KINDS } from "../rules";
import { PUSH_FRESH, PUSH_RAID_ID, pushCopy, pushDue, pushHourOk } from "./push";

/** 한국 시각 2026-11-16 hh:mm. */
const kst = (h: number, m = 0) => Date.UTC(2026, 10, 16, h - 9, m);

test("알림은 한국 시각 8시부터 22시 전까지만 보낸다", () => {
  assert.equal(pushHourOk(kst(7, 59)), false);
  assert.equal(pushHourOk(kst(8)), true);
  assert.equal(pushHourOk(kst(21, 59)), true);
  assert.equal(pushHourOk(kst(22)), false);
  assert.equal(pushHourOk(kst(3)), false);
});

test("갓 태어나고 안 쓰러진 물결만 알린다", () => {
  const born = kst(11);
  assert.equal(pushDue(born, null, born + MINUTE), true);
  assert.equal(pushDue(born, null, born + PUSH_FRESH + 1), false, "늦게 온 요청");
  assert.equal(pushDue(born, born + 30_000, born + MINUTE), false, "이미 쓰러졌다");
  assert.equal(pushDue(null, null, born), false, "태어난 때가 아직 안 찍혔다");
  assert.equal(pushDue(born, null, born - 1), false, "앞선 시각");
  assert.equal(pushDue(kst(23), null, kst(23, 1)), false, "밤");
});

test("글은 정해 둔 말과 종류 이름뿐이고, 사이트 안의 광장을 연다", () => {
  const copy = pushCopy("20772-3");
  assert.ok(RAID_KINDS.some((k) => copy.title.includes(k.name)));
  assert.equal(copy.url, "/garden?tab=plaza&push=20772-3");
  assert.equal(copy.tag, "raid-20772-3");
  assert.ok(PUSH_RAID_ID.test("20772-3"));
  assert.ok(!PUSH_RAID_ID.test("20772-6"));
  assert.ok(!PUSH_RAID_ID.test("../x"));
});

test("서비스 워커는 서버가 싣는 열쇠(title·body·url·tag)를 읽는다", () => {
  const sw = readFileSync(new URL("../../../../public/push-sw.js", import.meta.url), "utf8");
  for (const key of ["title", "body", "url", "tag"]) assert.ok(sw.includes(`data.${key}`), key);
  const server = readFileSync(new URL("../../../lib/server/push.ts", import.meta.url), "utf8");
  assert.ok(server.includes("data: { title: copy.title, body: copy.body, url: copy.url, tag: copy.tag }"));
});
