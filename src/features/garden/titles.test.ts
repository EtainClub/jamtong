/**
 * 칭호와 익음 알림 — `pnpm garden:test`.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { alarmAtOk, calendarFile, googleCalendarLink } from "./alarm";
import { alarmTime, formatClock, HOUR, TITLE_ORDER, TITLES, titleCounts, titleLevel, titleLevels, titleNext } from "./rules";

/** 한국 시각 2026-11-06 hh:mm. */
const kst = (h: number, m = 0, day = 6) => Date.UTC(2026, 10, day, h - 9, m);

test("칭호는 도감과 받은 거대 잡초 상자에서 셈한다", () => {
  const d = {
    dex: { a: ["golden"], b: ["moist", "sparkle"], c: [], d: ["moist"] },
    raids: [1, 2],
  };
  assert.deepEqual(titleCounts(d), { dex: 4, storm: 3, plaza: 2 });
  assert.deepEqual(titleLevels(d), { dex: 0, storm: 1, plaza: 1 });
});

test("단계는 계단마다 하나씩, 셋에서 멈춘다", () => {
  for (const id of TITLE_ORDER) {
    const [a, b, c] = TITLES[id].steps;
    assert.ok(a < b && b < c, id);
    assert.equal(titleLevel(id, a - 1), 0);
    assert.equal(titleLevel(id, a), 1);
    assert.equal(titleLevel(id, b), 2);
    assert.equal(titleLevel(id, c * 10), 3);
    assert.equal(titleNext(id, a - 1), 1);
    assert.equal(titleNext(id, c), null);
  }
});

test("규칙은 공개 정원의 칭호를 0~3 숫자로만 받는다", () => {
  const rules = readFileSync("firestore.rules", "utf8");
  assert.match(rules, /'titles'/);
  for (const id of TITLE_ORDER) assert.match(rules, new RegExp(`t\\.get\\('${id}', 0\\) <= 3`));
});

test("22시~8시에 익으면 8시에 알린다", () => {
  assert.equal(alarmTime(kst(15, 42)), kst(15, 42));
  assert.equal(alarmTime(kst(21, 59)), kst(21, 59));
  assert.equal(alarmTime(kst(22, 0)), kst(8, 0, 7));
  assert.equal(alarmTime(kst(23, 30)), kst(8, 0, 7));
  assert.equal(alarmTime(kst(3, 0)), kst(8, 0));
  assert.equal(alarmTime(kst(8, 0)), kst(8, 0));
});

test("시각은 한국 시각으로, 날이 다르면 내일을 붙인다", () => {
  assert.match(formatClock(kst(15, 42), kst(10)), /^오후 3:42$/);
  assert.match(formatClock(kst(8, 0, 7), kst(21)), /^내일 오전 8:00$/);
});

test("캘린더 파일은 시각과 정해 둔 글뿐이고, 한 줄은 75바이트를 넘지 않는다", () => {
  const at = kst(15, 42);
  const ics = calendarFile(at, "https://jamtong.kr/garden", kst(10));
  assert.match(ics, /DTSTART:20261106T064200Z/);
  assert.match(ics, /UID:garden-\d+@jamtong\.kr/);
  assert.match(ics, /BEGIN:VALARM[\s\S]*TRIGGER:PT0M[\s\S]*END:VALARM/);
  assert.ok(ics.endsWith("\r\n"));
  for (const line of ics.split("\r\n")) assert.ok(new TextEncoder().encode(line).length <= 75, line);
  // 접은 줄을 펴면 원래 글이 나온다.
  assert.match(ics.replace(/\r\n /g, ""), /SUMMARY:잼통 정원 · 열매가 익었어요/);
  assert.equal(calendarFile(at, "u", 1).match(/UID:.*/)?.[0], calendarFile(at, "u", 2).match(/UID:.*/)?.[0]);
});

test("받는 시각의 범위와 구글 캘린더 링크", () => {
  const now = kst(10);
  assert.ok(alarmAtOk(now + HOUR, now));
  assert.ok(!alarmAtOk(now - 2 * HOUR, now));
  assert.ok(!alarmAtOk(now + 15 * 24 * HOUR, now));
  assert.ok(!alarmAtOk(Number.NaN, now));
  const link = new URL(googleCalendarLink(kst(15, 42), "https://jamtong.kr/garden"));
  assert.equal(link.searchParams.get("dates"), "20261106T064200Z/20261106T065200Z");
});
