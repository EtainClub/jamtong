/**
 * 잼공 — `pnpm study:test`. 설계는 docs/daily-study.md.
 * 다시 묻기 상자, 이어 가기(쉼표), 오늘의 한 판, 길(탭·칸), 문항 은행의 근거를 본다.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { getPublishedAchievements } from "../../content/achievements";
import { buildStudyBank } from "./build";
import { STUDY_SEGMENTS, STUDY_TABS, studyNavOf, SOON } from "./nav";
import {
  addDays,
  currentUnit,
  grade,
  learned,
  pickSession,
  RESTS_PER_WEEK,
  SESSION_REVIEW_MAX,
  SESSION_SIZE,
  streakOf,
  unitOpen,
  unitStage,
  weekOf,
  type Box,
} from "./rules";
import type { StudyBank, StudyItem } from "./types";

const item = (unit: string, n: number, answer = true): StudyItem => ({
  id: `${unit}/ox${n}`, unit, step: "know", kind: "ox", statement: "s", answer, explain: "e", anchors: [`${unit}#c`], card: null,
});
const BANK: StudyBank = {
  units: ["a:one", "a:two", "a:three"].map((id) => ({ id, course: "achievement", era: "seongnam", eraLabel: "성남시장 시절", title: id, kicker: "", href: "/" })),
  items: ["a:one", "a:two", "a:three"].flatMap((u) => [1, 2, 3, 4].map((n) => item(u, n, n <= 2))),
};

// ── 날짜 ─────────────────────────────────────────────────────────────

test("날짜 셈: 달·해를 넘기고, 주는 월요일에 시작한다", () => {
  assert.equal(addDays("2026-11-30", 1), "2026-12-01");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  assert.equal(weekOf("2026-11-28"), "2026-11-23", "토요일 → 그 주 월요일");
  assert.equal(weekOf("2026-11-29"), "2026-11-23", "일요일은 그 주의 끝");
  assert.equal(weekOf("2026-11-30"), "2026-11-30", "월요일은 새 주");
});

// ── 다시 묻기 ────────────────────────────────────────────────────────

test("상자: 새 문항은 1칸에서 시작해 맞히면 한 칸씩 오르고(3·7·16·35일), 틀리면 1칸(내일)으로", () => {
  let b: Box | undefined;
  const seen: Box[] = [];
  for (let k = 0; k < 5; k++) seen.push((b = grade(b, true, "2026-11-01")));
  assert.deepEqual(seen.map((x) => x[0]), [2, 3, 4, 5, 5], "처음 맞히면 2칸(익힘), 5칸이 끝");
  assert.deepEqual(seen.slice(0, 4).map((x) => x[1]), ["2026-11-04", "2026-11-08", "2026-11-17", "2026-12-06"]);
  assert.deepEqual(grade(undefined, false, "2026-11-01"), [1, "2026-11-02"], "처음 틀리면 1칸, 내일 다시");
  assert.deepEqual(grade([4, "2026-11-01"], false, "2026-11-01"), [1, "2026-11-02"], "틀리면 1칸으로");
  assert.ok(learned(grade(undefined, true, "2026-11-01")) && !learned(grade(undefined, false, "2026-11-01")), "맞힌 것만 익힌 것");
});

// ── 단원 ─────────────────────────────────────────────────────────────

test("단원 상태: 씨앗 → 새싹(알기 마침) → 꽃(두 번 넘게 맞힘). 다섯 단계 문항이 없으면 열매는 없다", () => {
  const items = BANK.items.filter((i) => i.unit === "a:one");
  assert.equal(unitStage(items, {}), "seed");
  const half: Record<string, Box> = { [items[0].id]: [2, "x"] };
  assert.equal(unitStage(items, half), "seed", "알기를 다 마치지 않았다");
  const two = Object.fromEntries(items.map((i) => [i.id, [2, "x"] as Box]));
  assert.equal(unitStage(items, two), "sprout");
  const three = Object.fromEntries(items.map((i) => [i.id, [5, "x"] as Box]));
  assert.equal(unitStage(items, three), "bloom", "반론·말하기 문항이 없으니 열매가 아니다");
});

test("단원 순서: 앞 단원을 한 번이라도 풀면 열리고, 오늘의 한 판은 열린 단원에서만 새 문항을 낸다", () => {
  assert.equal(currentUnit(BANK, {}), "a:one");
  assert.equal(unitOpen(BANK, {}, "a:one"), true);
  assert.equal(unitOpen(BANK, {}, "a:two"), false);
  assert.equal(unitOpen(BANK, { "a:one/ox1": [1, "x"] }, "a:two"), true, "앞 단원을 풀기 시작하면 다음이 열린다");
  assert.equal(unitOpen(BANK, {}, "a:three"), false);
  const one = Object.fromEntries(BANK.items.filter((i) => i.unit === "a:one").map((i) => [i.id, [2, "2099-01-01"] as Box]));
  assert.equal(currentUnit(BANK, one), "a:two");
  // 몇 판을 이어 풀어도, 한 판에 나온 새 문항의 단원은 풀고 나면 모두 열려 있다.
  let boxes: Record<string, Box> = {};
  for (let k = 0; k < 3; k++) {
    for (const id of pickSession(BANK, boxes, "2026-11-28")) boxes = { ...boxes, [id]: boxes[id] ?? [1, "2026-11-29"] };
    for (const u of new Set(Object.keys(boxes).map((id) => id.split("/")[0]))) assert.ok(unitOpen(BANK, boxes, u), `${u}는 열려 있다`);
  }
});

// ── 오늘의 한 판 ─────────────────────────────────────────────────────

test("오늘의 한 판: 처음이면 지금 단원부터 새 문항 8개", () => {
  const ids = pickSession(BANK, {}, "2026-11-28");
  assert.equal(ids.length, SESSION_SIZE);
  assert.deepEqual(ids.slice(0, 4), ["a:one/ox1", "a:one/ox2", "a:one/ox3", "a:one/ox4"]);
});

test("오늘의 한 판: 때가 된 복습이 먼저 들어가고(5개까지), 새 문항과 번갈아 놓인다", () => {
  const boxes: Record<string, Box> = {};
  BANK.items.filter((i) => i.unit !== "a:three").forEach((i, k) => (boxes[i.id] = [2, k < 6 ? "2026-11-27" : "2026-12-30"]));
  const ids = pickSession(BANK, boxes, "2026-11-28");
  const due = ids.filter((id) => boxes[id]);
  assert.equal(due.length, SESSION_REVIEW_MAX);
  assert.equal(ids.length, SESSION_SIZE);
  assert.ok(ids.filter((id) => !boxes[id]).every((id) => id.startsWith("a:three/")), "새 문항은 아직 안 푼 단원에서");
  assert.ok(!boxes[ids[0]] && boxes[ids[1]], "새 것과 복습이 번갈아");
  assert.equal(new Set(ids).size, ids.length, "겹치지 않는다");
});

test("오늘의 한 판: 다 익혔고 때가 안 됐으면 가까운 것부터 미리 복습", () => {
  const boxes = Object.fromEntries(BANK.items.map((i, k) => [i.id, [3, addDays("2026-12-01", k)] as Box]));
  const ids = pickSession(BANK, boxes, "2026-11-28");
  assert.equal(ids.length, SESSION_SIZE);
  assert.equal(ids[0], BANK.items[0].id);
});

// ── 이어 가기 ────────────────────────────────────────────────────────

test("이어 가기: 오늘 안 했으면 어제부터 세고, 빠진 날은 그 주 쉼표(2개)가 메운다", () => {
  // 2026-11-23(월)~11-28(토). 수요일 하루 빠짐.
  const days = { "2026-11-23": 1, "2026-11-24": 2, "2026-11-26": 1, "2026-11-27": 1 };
  const s = streakOf(days, "2026-11-28");
  assert.equal(s.count, 4, "쉼표로 메운 날은 세지 않는다");
  assert.deepEqual(s.rested, ["2026-11-25"]);
  assert.equal(s.restsLeft, RESTS_PER_WEEK - 1);
  assert.equal(s.today, 0);
  assert.equal(streakOf({ ...days, "2026-11-28": 1 }, "2026-11-28").count, 5, "오늘 하면 하나 는다");
});

test("이어 가기: 한 주에 셋 빠지면 끊긴다. 끊긴 너머의 쉼표는 남기지 않는다", () => {
  const days = { "2026-11-23": 1, "2026-11-27": 1 }; // 화·수·목 빠짐
  const s = streakOf(days, "2026-11-27");
  assert.equal(s.count, 1);
  assert.deepEqual(s.rested, []);
  assert.equal(s.restsLeft, 0);
});

test("이어 가기: 처음 공부한 날 앞으로는 쉼표를 쓰지 않는다. 기록이 없으면 0", () => {
  assert.deepEqual(streakOf({}, "2026-11-28"), { count: 0, rested: [], restsLeft: RESTS_PER_WEEK, today: 0 });
  const s = streakOf({ "2026-11-27": 1 }, "2026-11-28");
  assert.equal(s.count, 1);
  assert.equal(s.restsLeft, RESTS_PER_WEEK, "처음 공부한 날 앞의 빈 날은 빠진 날이 아니다");
});

test("이어 가기: 주가 바뀌면 쉼표가 다시 둘", () => {
  // 지난주 일요일 빠짐(쉼표), 이번 주 월요일 빠짐(쉼표) — 서로 다른 주라 둘 다 메운다.
  const days = { "2026-11-21": 1, "2026-11-24": 1 };
  const s = streakOf(days, "2026-11-24");
  assert.deepEqual(s.rested.sort(), ["2026-11-22", "2026-11-23"]);
  assert.equal(s.count, 2);
});

// ── 길 ───────────────────────────────────────────────────────────────

test("길: 탭 다섯, 칸 이름이 겹치지 않고, 자리 이름으로 탭·칸을 찾는다", () => {
  assert.equal(STUDY_TABS.length, 5);
  const segs = Object.values(STUDY_SEGMENTS).flat().map((s) => s.id);
  assert.equal(new Set(segs).size, segs.length);
  assert.deepEqual(studyNavOf("talk"), { tab: "talk", seg: "reply" });
  assert.deepEqual(studyNavOf("review"), { tab: "note", seg: "review" });
  assert.equal(studyNavOf("nope"), null);
  for (const id of Object.keys(SOON)) assert.ok(segs.includes(id as never), `준비 중 칸 ${id}이 실재한다`);
});

// ── 문항 은행 ────────────────────────────────────────────────────────

test("문항 은행: id가 영구 꼴이고 겹치지 않으며, 앵커가 실재하는 claim을 가리킨다", () => {
  const bank = buildStudyBank();
  assert.ok(bank.units.length >= 20, "업적 단원이 스물 넘게");
  assert.equal(new Set(bank.items.map((i) => i.id)).size, bank.items.length);
  const achievements = new Map(getPublishedAchievements().map((a) => [a.slug, a]));
  for (const i of bank.items) {
    assert.match(i.id, /^a:[a-z0-9-]+\/ox[0-9]+$/);
    assert.ok(bank.units.some((u) => u.id === i.unit), `${i.id}: 단원이 있다`);
    for (const anchor of i.anchors) {
      const [slug, claimId] = anchor.split("#");
      assert.ok(achievements.get(slug)?.claims.some((c) => c.id === claimId), `${i.id}: 없는 앵커 ${anchor}`);
    }
  }
});

test("근거노트 카드: O 문항에서만, 확인된 claim으로만, 주장(CLAIM)이면 누구의 주장인지 붙는다", () => {
  const bank = buildStudyBank();
  const achievements = new Map(getPublishedAchievements().map((a) => [a.slug, a]));
  for (const i of bank.items) {
    if (!i.answer) {
      assert.equal(i.card, null, `${i.id}: X 문항(오해)은 카드가 되지 않는다`);
      continue;
    }
    assert.ok(i.card, `${i.id}: O 문항은 카드가 된다`);
    const [slug] = i.anchors[0].split("#");
    const claims = i.anchors.map((x) => achievements.get(slug)!.claims.find((c) => c.id === x.split("#")[1])!);
    assert.ok(claims.every((c) => c.verified), `${i.id}: 확인된 claim만`);
    if (i.card.type === "CLAIM") assert.ok(i.card.by, `${i.id}: 주장한 사람`);
  }
});

test("업적의 길: 성남시장 → 경기도지사 → 이재명 정부, 문항이 있는 업적은 모두 시기가 정해져 있다", async () => {
  const { ACHIEVEMENT_ERA, ERAS } = await import("./eras");
  const { ACHIEVEMENT_OX } = await import("@/content/quizzes/ox");
  const bank = buildStudyBank();
  const rank = (id: string) => ERAS.findIndex((e) => e.id === id);
  for (let i = 1; i < bank.units.length; i++) assert.ok(rank(bank.units[i - 1].era) <= rank(bank.units[i].era), `${bank.units[i].id}: 시기가 거꾸로`);
  assert.equal(bank.units[0].era, "seongnam");
  assert.equal(bank.units.at(-1)!.era, "government");
  for (const a of getPublishedAchievements()) if (ACHIEVEMENT_OX[a.slug]?.length) assert.ok(ACHIEVEMENT_ERA[a.slug], `${a.slug}: 시기를 정하지 않았다`);
  for (const slug of Object.keys(ACHIEVEMENT_ERA)) assert.ok(getPublishedAchievements().some((a) => a.slug === slug), `${slug}: 없는 업적`);
});

test("원본 페이지 확인 문제: 잼공 문항과 같은 id, 고른 업적의 것만, 정원 퀴즈의 문항 id도 잼공에 있다", async () => {
  const { pageQuizItems } = await import("./build");
  const { buildMemorial } = await import("@/features/garden/memorial/build");
  const bank = buildStudyBank();
  const ids = new Set(bank.items.map((i) => i.id));
  const slug = bank.units[0].id.slice(2);
  const q = pageQuizItems([slug, "no-such-thing"]);
  assert.ok(q.length > 0);
  for (const i of q) {
    assert.equal(i.slug, slug);
    assert.ok(ids.has(i.id), `${i.id}: 잼공 문항`);
    assert.equal(i.card, Boolean(bank.items.find((b) => b.id === i.id)!.card));
  }
  assert.deepEqual(pageQuizItems([]), []);
  // 정원의 잡초 퀴즈·퀴즈 찬스(memorial/ox.ts)가 잼공 상자에 적는 id
  for (const e of buildMemorial()) for (const o of e.ox) assert.ok(ids.has(`a:${e.slug}/${o.id}`), `${e.slug}/${o.id}: 정원 퀴즈 문항이 잼공에 없다`);
});
