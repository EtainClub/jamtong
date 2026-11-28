/**
 * 잼공 — `pnpm study:test`. 설계는 docs/daily-study.md.
 * 다시 묻기 상자, 이어 가기(쉼표), 오늘의 한 판, 길(탭·칸), 문항 은행의 근거를 본다.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { getPublishedAchievements } from "../../content/achievements";
import { POLICIES } from "../../content/policies";
import { SORT_ITEMS } from "../../content/study/sort";
import { DEBATE_ITEMS } from "../../content/study/debate";
import { WEAKNESS_ITEMS } from "../../content/study/weakness";
import { validateDebate, validateNumbers, validateSort, validateStudy, validateWeakness, validateWeigh } from "../../content/study/validate";
import { CHECK_ITEMS, WEIGHT_ITEMS } from "../../content/study/weigh";
import { STATEMENTS } from "../../content/words";
import { buildStudyBank, SKELETON_OPTIONS, starterOf } from "./build";
import { ASSESS_SIZE, assessReady, assessSession, inviteFor, levelReady, pickLevelSession, sessionSize, SKIP_SIZE, skipSession, skipTargets, type LevelState } from "./levels";
import { navForLevel, STUDY_SEGMENTS, STUDY_TABS, studyNavOf, SOON, visibleSegments, visibleTabs } from "./nav";
import { emptyStudy, normalizeStudy, type StudyData } from "./store";
import { mergeBox, mergeStudy } from "./sync";
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
  unitSession,
} from "./rules";
import type { StepId, StudyBank, StudyItem } from "./types";

const item = (unit: string, n: number, answer = true, step: StepId = "know"): StudyItem => ({
  id: `${unit}/${step === "know" ? "ox" : step}${n}`, unit, step, skill: "A0", kind: "ox", statement: "s", answer, explain: "e", anchors: [`${unit}#c`], card: null,
});
const BANK: StudyBank = {
  units: ["a:one", "a:two", "a:three"].map((id) => ({ id, course: "achievement", era: "seongnam", eraLabel: "성남시장 시절", title: id, kicker: "", href: "/" })),
  items: ["a:one", "a:two", "a:three"].flatMap((u) => [1, 2, 3, 4].map((n) => item(u, n, n <= 2))),
  starter: [],
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

/** 앵커가 가리키는 것 — 업적 claim `<slug>#<id>`, 정책 claim `policy:<slug>#<id>`, 정책 `policy:<slug>`, 언행 `words:<slug>`. */
function claimAt(anchor: string) {
  const [head, claimId] = anchor.split("#");
  if (head.startsWith("policy:")) return POLICIES.find((p) => p.slug === head.slice(7))?.claims.find((c) => c.id === claimId);
  return getPublishedAchievements().find((a) => a.slug === head)?.claims.find((c) => c.id === claimId);
}
function anchorExists(anchor: string): boolean {
  if (anchor.startsWith("words:")) return (STATEMENTS as Array<{ slug: string }>).some((w) => w.slug === anchor.slice(6));
  if (anchor.startsWith("policy:") && !anchor.includes("#")) return POLICIES.some((p) => p.slug === anchor.slice(7));
  return Boolean(claimAt(anchor));
}

test("문항 은행: id가 영구 꼴이고 겹치지 않으며, 앵커가 실재하는 것을 가리킨다", () => {
  const bank = buildStudyBank();
  assert.ok(bank.units.filter((u) => u.course === "achievement").length >= 20, "업적 단원이 스물 넘게");
  assert.equal(new Set(bank.items.map((i) => i.id)).size, bank.items.length);
  for (const i of bank.items) {
    assert.match(i.id, i.kind === "ox" ? /^a:[a-z0-9-]+\/ox[0-9]+$/ : /^[apw]:[a-z0-9-]+\/[sndwkglh][0-9]+$/);
    assert.ok(bank.units.some((u) => u.id === i.unit), `${i.id}: 단원이 있다`);
    for (const anchor of i.anchors) assert.ok(anchorExists(anchor), `${i.id}: 없는 앵커 ${anchor}`);
  }
});

test("근거노트 카드: 참이고 확인된 것에서만, 주장(CLAIM)이면 누구의 주장인지 붙는다", () => {
  const bank = buildStudyBank();
  for (const i of bank.items) {
    if (i.kind === "ox" && !i.answer) assert.equal(i.card, null, `${i.id}: X 문항(헷갈리기 쉬운 문장)은 카드가 되지 않는다`);
    if (i.skill === "A2" && i.choice?.correct === 1) assert.equal(i.card, null, `${i.id}: 확인되지 않은 말은 카드가 되지 않는다`);
    if (i.kind === "debate" || i.skill === "A3" || i.skill === "B1" || i.skill === "B2") assert.equal(i.card, null, `${i.id}: 카드가 아니다`);
    if (!i.card) continue;
    assert.ok(i.anchors.every((x) => claimAt(x)?.verified), `${i.id}: 확인된 claim만`);
    if (i.card.type === "CLAIM") assert.ok(i.card.by, `${i.id}: 주장한 사람`);
  }
  for (const i of bank.items.filter((x) => (x.kind === "ox" && x.answer) || x.skill === "A1" || x.skill === "C3")) assert.ok(i.card, `${i.id}: 카드가 된다`);
});

test("업적의 길: 성남시장 → 경기도지사 → 이재명 정부, 문항이 있는 업적은 모두 시기가 정해져 있다", async () => {
  const { ACHIEVEMENT_ERA, ERAS } = await import("./eras");
  const { ACHIEVEMENT_OX } = await import("@/content/study/ox");
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

// ── 단계 (docs/jamgong-roadmap.md §3) ───────────────────────────────

const L1: LevelState = { level: 1, stay: false };
const cards = (n: number) => Array.from({ length: n }, (_, k) => `c${k}`);
const WITH_L2: StudyBank = { ...BANK, items: [...BANK.items, ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => item("a:one", n, true, "understand"))] };

test("단계: 1단계 판은 5문제(가볍게), 그 위는 8문제", () => {
  assert.equal(sessionSize(1), 5);
  assert.equal(sessionSize(2), 8);
  assert.equal(pickLevelSession(BANK, {}, "2026-11-28", 1).length, 5);
});

test("단계 초대: 다음 단계 문항이 없으면 초대하지 않는다 — 지금은 알기 문항뿐이다", () => {
  assert.equal(levelReady(BANK, 2), false);
  assert.equal(inviteFor(BANK, L1, {}, cards(30), "2026-11-28"), null);
  const real = buildStudyBank();
  assert.equal(levelReady(real, 1), true);
  assert.equal(levelReady(real, 2), true, "R2: 가리기 문항이 있다");
  assert.equal(levelReady(real, 3), true, "R4: 따지기 문항이 있다");
  assert.equal(inviteFor(real, L1, {}, cards(10), "2026-11-28"), 2, "근거 카드 10장이면 2단계로 초대");
  assert.equal(inviteFor(real, { level: 2, stay: false }, {}, cards(99), "2026-11-28"), null, "가리기 문제를 아직 풀지 않았으면 초대하지 않는다");
});

test("단계 초대: 근거 카드 10장이면 2단계로 초대, 머물기·거절 14일·마지막 단계면 묻지 않는다", () => {
  assert.equal(inviteFor(WITH_L2, L1, {}, cards(9), "2026-11-28"), null);
  assert.equal(inviteFor(WITH_L2, L1, {}, cards(10), "2026-11-28"), 2);
  assert.equal(inviteFor(WITH_L2, { ...L1, stay: true }, {}, cards(10), "2026-11-28"), null, "머물기");
  assert.equal(inviteFor(WITH_L2, { ...L1, declinedOn: "2026-11-20" }, {}, cards(10), "2026-11-28"), null, "거절한 지 8일");
  assert.equal(inviteFor(WITH_L2, { ...L1, declinedOn: "2026-11-14" }, {}, cards(10), "2026-11-28"), 2, "거절한 지 14일");
  assert.equal(inviteFor(WITH_L2, { level: 5, stay: false }, {}, cards(99), "2026-11-28"), null);
});

test("단계 판: 1단계에는 위 단계 문항이 나오지 않고, 2단계는 가리기 문제가 많고 알기 복습이 섞인다", () => {
  const l1 = pickLevelSession(WITH_L2, {}, "2026-11-28", 1);
  assert.ok(l1.every((id) => id.includes("/ox")), "1단계 판은 알기 문항만");
  const l2 = pickLevelSession(WITH_L2, {}, "2026-11-28", 2);
  const cur = l2.filter((id) => id.includes("/understand"));
  assert.equal(l2.length, 8);
  assert.ok(cur.length > l2.length - cur.length, "지금 단계가 더 많다");
  assert.ok(cur.length < l2.length, "아래 단계 복습도 섞인다");
  assert.equal(new Set(l2).size, l2.length);
});

test("보이는 화면: 1단계 하단 탭은 넷(말하기 없음), 준비 중 칸은 그 단계에 닿아야 보인다", () => {
  assert.deepEqual(visibleTabs(1).map((t) => t.id), ["class", "road", "note", "me"]);
  assert.deepEqual(visibleSegments("class", 1).map((s) => s.id), ["today"]);
  assert.deepEqual(visibleSegments("note", 1).map((s) => s.id), ["cards", "review"]);
  assert.equal(visibleTabs(4).length, 5, "4단계부터 말하기 탭");
  for (const id of Object.keys(SOON)) {
    const seg = Object.values(STUDY_SEGMENTS).flat().find((s) => s.id === id)!;
    assert.ok(seg.minLevel > 1, `준비 중 칸 ${id}은 1단계 사람에게 보이지 않는다`);
  }
  assert.deepEqual(navForLevel(studyNavOf("reply"), 1), { tab: "class", seg: "today" }, "안 보이는 칸으로 온 링크는 교실로");
  assert.deepEqual(navForLevel(studyNavOf("review"), 1), { tab: "note", seg: "review" });
});

test("첫 3분 문제: 서로 다른 단원의 O 문항 셋, 근거 카드가 되는 것, 짧은 것부터", () => {
  const bank = buildStudyBank();
  assert.equal(bank.starter.length, 3);
  const items = bank.starter.map((id) => bank.items.find((i) => i.id === id)!);
  assert.ok(items.every((i) => i.answer && i.card), "맞히면 근거 카드를 받는 O 문항");
  assert.equal(new Set(items.map((i) => i.unit)).size, 3);
  assert.deepEqual(starterOf(bank.items), bank.starter, "빌드마다 같다");
});

// ── 기기 사이 합치기 ─────────────────────────────────────────────────

const rec = (over: Partial<StudyData>): StudyData => ({ ...emptyStudy(), ...over });

test("합치기: 상자는 더 늦게 답한 쪽, 같은 날이면 낮은 칸", () => {
  // [2, 12-01]은 11-28에 답함(3일), [3, 12-03]은 11-26에 답함(7일)
  assert.deepEqual(mergeBox([2, "2026-12-01"], [3, "2026-12-03"]), [2, "2026-12-01"]);
  assert.deepEqual(mergeBox([1, "2026-11-29"], [2, "2026-12-01"]), [1, "2026-11-29"], "같은 날(11-28)이면 낮은 칸");
  assert.deepEqual(mergeBox(undefined, [2, "x"]), [2, "x"]);
});

test("합치기: 두 기기에서 따로 공부해도 날·카드·상자가 모두 남고, 설정은 늦게 고친 쪽", () => {
  const phone = rec({ days: { "2026-11-27": 1 }, wallet: ["a", "b"], boxes: { a: [2, "2026-11-30"] }, goal: 2, updatedAt: 100, intro: true });
  const pc = rec({ days: { "2026-11-27": 2, "2026-11-28": 1 }, wallet: ["c", "a"], boxes: { c: [2, "2026-12-01"] }, goal: 3, updatedAt: 200, level: 2 });
  const m = mergeStudy(phone, pc);
  assert.deepEqual(m.days, { "2026-11-27": 2, "2026-11-28": 1 });
  assert.deepEqual(m.wallet, ["c", "a", "b"]);
  assert.deepEqual(Object.keys(m.boxes).sort(), ["a", "c"]);
  assert.equal(m.goal, 3, "늦게 고친 쪽");
  assert.equal(m.intro, true, "한쪽이라도 안내를 마쳤으면");
  assert.equal(m.level, 2, "단계는 내려가지 않는다");
  assert.deepEqual(mergeStudy(phone, null), phone, "계정에 기록이 없으면 이 기기 것 그대로");
});

test("옛 기록 읽기: 3.0에서 안내를 마친 사람은 목표를 이미 고른 것, 단계는 1", () => {
  const old = normalizeStudy({ v: 1, goal: 2, days: {}, boxes: {}, wallet: [], intro: true } as StudyData)!;
  assert.equal(old.goalAsked, true);
  assert.equal(old.level, 1);
  assert.equal(normalizeStudy({ v: 2 } as unknown as StudyData), null);
});

// ── 문항 검사 (pnpm validate) ─────────────────────────────────────────

test("문항 검사: 지금 문항은 통과하고, 주장을 사실처럼·해석을 O로·없는 앵커·확인 전 근거를 잡는다", () => {
  const achievements = getPublishedAchievements();
  assert.deepEqual(validateStudy(achievements), []);
  const a = achievements.find((x) => x.claims.some((c) => c.assertionType === "CLAIM" && c.assertedBy))!;
  const claim = a.claims.find((c) => c.assertionType === "CLAIM" && c.assertedBy)!;
  const fact = a.claims.find((c) => c.assertionType === "FACT")!;
  const bad = (statement: string, claimIds: string[], answer = true) => ({ id: "ox9", statement, answer, explain: "풀이를 열 자 넘게 적는다.", claimIds });
  const run = (q: ReturnType<typeof bad>) => validateStudy(achievements, { [a.slug]: [q] });
  assert.equal(run(bad("누가 했는지 빼고 주장만 적은 문장이다.", [claim.id])).length, 1, "주장한 사람이 없다");
  assert.deepEqual(run(bad(`${claim.assertedBy}은 그렇게 밝혔다고 적은 문장이다.`, [claim.id])), []);
  assert.equal(run(bad("없는 앵커를 가리키는 문장이다.", ["nope"])).length, 1);
  assert.deepEqual(run(bad("누가 했는지 빼고 주장만 적은 문장이다.", [claim.id], false)), [], "X 문항은 오해라 귀속을 묻지 않는다");
  assert.deepEqual(run(bad("사실만 근거로 쓴 문장이다.", [fact.id])), []);
  const interp = achievements.flatMap((x) => x.claims.map((c) => ({ x, c }))).find(({ c }) => c.assertionType === "INTERPRETATION");
  if (interp) {
    const r = validateStudy(achievements, { [interp.x.slug]: [bad("해석을 사실처럼 외우게 하는 문장이다.", [interp.c.id])] });
    assert.equal(r.length, 1, "해석뿐인 O 문항");
  }
});

// ── 2단계 「가리기」 (R2) ─────────────────────────────────────────────

test("가리기 문항: 은행에 들어오고, 정답은 원본 claim의 층이며, 정책 단원은 위키 정책 페이지로 간다", () => {
  const bank = buildStudyBank();
  const sort = bank.items.filter((i) => i.skill === "A1");
  const nums = bank.items.filter((i) => i.skill === "A3");
  assert.equal(sort.length, SORT_ITEMS.length, "가리기 문항이 모두 실린다");
  assert.ok(nums.length >= 20);
  for (const i of [...sort, ...nums]) {
    assert.equal(i.step, "understand");
    assert.equal(i.kind, "choice");
    assert.ok(i.choice && i.choice.correct >= 0 && i.choice.correct < i.choice.options.length, `${i.id}: 정답 번호`);
  }
  for (const i of sort) {
    const q = SORT_ITEMS.find((x) => `${x.unit}/${x.id}` === i.id)!;
    assert.equal(i.card?.type, q.type, `${i.id}: 카드 층 = 원본 층`);
    const label = i.choice!.options[i.choice!.correct].label;
    if (q.type === "CLAIM") assert.equal(label, `${q.by}의 주장`, `${i.id}: 주장한 쪽이 보기에 나온다`);
  }
  const policyUnits = bank.units.filter((u) => u.course === "policy");
  assert.ok(policyUnits.length > 10);
  for (const u of policyUnits) assert.match(u.href, /^\/wiki\/policy\/[a-z0-9-]+$/);
  assert.ok(bank.items.filter((i) => i.unit.startsWith("p:")).every((i) => i.anchors[0].startsWith("policy:")), "정책 앵커 꼴");
  assert.ok(bank.starter.every((id) => bank.items.find((i) => i.id === id)?.kind === "ox"), "첫 3분은 O/X만");
});

test("가리기 문항은 1단계 판과 1단계 단원 판에 나오지 않는다", () => {
  const bank = buildStudyBank();
  const l1 = pickLevelSession(bank, {}, "2026-11-28", 1);
  assert.ok(l1.every((id) => bank.items.find((i) => i.id === id)?.kind === "ox"));
  const unit = bank.items.find((i) => i.skill === "A3")!.unit;
  assert.ok(unitSession(bank, {}, unit, 1).every((id) => bank.items.find((i) => i.id === id)?.step === "know"));
  assert.ok(unitSession(bank, {}, unit, 2).some((id) => bank.items.find((i) => i.id === id)?.step === "understand"));
});

test("가리기 검사: 지금 문항은 통과하고, 층 바꾸기·귀속 남기기·답 새기·숫자 성격 어긋남을 잡는다", () => {
  const achievements = getPublishedAchievements();
  assert.deepEqual(validateSort(achievements, POLICIES), []);
  assert.deepEqual(validateNumbers(achievements), []);
  const base = SORT_ITEMS.find((q) => q.type === "CLAIM")!;
  const run = (over: Partial<typeof base>) => validateSort(achievements, POLICIES, [{ ...base, ...over }]);
  assert.equal(run({ type: "FACT" }).length >= 1, true, "원본 층과 다른 정답");
  assert.equal(run({ core: `${base.by}는 그렇게 밝혔다고 하는 문장이다.` }).length, 1, "core에 귀속이 남았다");
  assert.equal(run({ from: "정부 주장 자료" }).length, 1, "from에 답이 샌다");
  assert.equal(run({ by: "다른 기관" }).length, 1, "주장한 쪽이 원본과 다르다");
  const a = achievements.find((x) => x.slug === "export-surplus")!;
  const imf = a.keyNumbers.find((k) => a.claims.find((c) => c.id === k.claimId)?.text.includes("전망치"));
  if (imf) {
    const bad = validateNumbers(achievements, [{ id: "n1", unit: "a:export-surplus", keyNumberId: imf.id, claimId: imf.claimId, kind: "actual", question: "이 숫자는 어떤 숫자일까요? 열다섯 자 넘게.", clue: "열 자 넘는 단서 문장." }]);
    assert.ok(bad.some((e) => e.includes("실적이라는데")), "전망을 실적이라 하면 잡는다");
  }
});

// ── 4단계 「답하기」와 건너뛰기 (R3) ─────────────────────────────────

const WITH_L4: StudyBank = {
  ...WITH_L2,
  items: [...WITH_L2.items, ...[1, 2, 3, 4, 5, 6, 7].map((n) => item(["a:one", "a:two", "a:three"][n % 3], n, true, "counter"))],
};

test("초대: 비어 있는 단계(3단계)는 건너뛰어 4단계로 초대한다. 조건은 지금 단계에서 해 본 것", () => {
  const l2: LevelState = { level: 2, stay: false };
  const answered = Object.fromEntries(WITH_L4.items.filter((i) => i.step === "understand").map((i) => [i.id, [2, "x"] as Box]));
  assert.equal(inviteFor(WITH_L4, l2, {}, cards(99), "2026-11-28"), null, "가리기 문제를 아직 20개 풀지 않았다");
  const twenty = { ...answered, ...Object.fromEntries(Array.from({ length: 12 }, (_, k) => [`x${k}`, [2, "x"] as Box])) };
  // 가리기 문항은 8개뿐이라 20개 조건을 채울 수 없다 — 문항이 늘면 열린다. 조건 자체를 본다.
  assert.equal(inviteFor(WITH_L4, l2, twenty, cards(99), "2026-11-28"), null);
  const many: StudyBank = { ...WITH_L4, items: [...WITH_L4.items, ...Array.from({ length: 20 }, (_, k) => item("a:two", 100 + k, true, "understand"))] };
  const all = Object.fromEntries(many.items.filter((i) => i.step === "understand").map((i) => [i.id, [2, "x"] as Box]));
  assert.equal(inviteFor(many, l2, all, cards(99), "2026-11-28"), 4, "3단계가 비어 있으니 4단계로");
});

test("건너뛰기 점검: 4단계가 있어야 켜지고, 그 단계 문제 6개를 단원이 겹치지 않게 낸다", () => {
  assert.deepEqual(skipTargets(WITH_L2, 1), [], "4단계 문항이 없으면 점검도 없다(운영자 결정)");
  assert.deepEqual(skipTargets(WITH_L4, 1), [2, 4]);
  assert.deepEqual(skipTargets(WITH_L4, 2), [4]);
  const ids = skipSession(WITH_L4, {}, 4);
  assert.equal(ids.length, SKIP_SIZE);
  assert.ok(ids.every((id) => WITH_L4.items.find((i) => i.id === id)?.step === "counter"));
  assert.equal(new Set(ids.slice(0, 3).map((id) => id.split("/")[0])).size, 3, "앞의 셋은 서로 다른 단원");
  assert.equal(sessionSize(4), 6, "답하기 판은 문제가 무거워 6개");
});

test("답하기 문항: 쟁점·약점이 은행에 들어오고, 화제 돌리기는 늘 오답이며, 정답 자리가 한곳에 몰리지 않는다", () => {
  const bank = buildStudyBank();
  const debates = bank.items.filter((i) => i.kind === "debate");
  const weak = bank.items.filter((i) => i.skill === "C3");
  assert.equal(debates.length, DEBATE_ITEMS.length);
  assert.equal(weak.length, WEAKNESS_ITEMS.length);
  const dodge = SKELETON_OPTIONS.findIndex((o) => o.id === "dodge");
  for (const i of debates) {
    assert.equal(i.step, "counter");
    assert.notEqual(i.debate!.skeleton.correct, dodge, `${i.id}: 화제 돌리기는 정답이 아니다`);
    assert.equal(i.debate!.evidence.options.length, 3);
    assert.ok(i.debate!.response.length > 20, `${i.id}: 모범 답변`);
    assert.match(i.debate!.href, /^\/achievement\/[a-z0-9-]+#counterpoint$/);
  }
  const spots = new Set(debates.map((i) => i.debate!.evidence.correct));
  assert.ok(spots.size >= 2, "근거 정답 자리가 섞인다");
  for (const i of weak) assert.ok(i.card && i.anchors[0].startsWith("policy:"), `${i.id}: 약점 카드`);
  assert.ok(levelReady(bank, 4));
  assert.equal(inviteFor(bank, { level: 2, stay: false }, Object.fromEntries(bank.items.filter((i) => i.step === "understand").slice(0, 20).map((i) => [i.id, [2, "x"] as Box])), cards(10), "2026-11-28"), 3, "가리기 20개를 풀면 3단계 따지기로(R4부터 3단계가 있다)");
});

test("답하기 검사: 지금 문항은 통과하고, 반론의 근거를 오답으로 쓰거나 비판을 오답으로 쓰면 잡는다", () => {
  const achievements = getPublishedAchievements();
  assert.deepEqual(validateDebate(achievements), []);
  assert.deepEqual(validateWeakness(POLICIES), []);
  const q = DEBATE_ITEMS[0];
  const bad = validateDebate(achievements, [{ ...q, decoys: [{ ...q.evidence, label: "같은 근거를 오답으로 쓴 보기" }, q.decoys[1]] }]);
  assert.ok(bad.some((e) => e.includes("정답이 둘")));
  const w = WEAKNESS_ITEMS[0];
  const policy = POLICIES.find((p) => p.slug === w.unit.slice(2))!;
  const other = policy.critiqueIds.find((id) => id !== w.critique.claimId);
  if (other) assert.ok(validateWeakness(POLICIES, [{ ...w, decoys: [{ claimId: other, label: "다른 비판을 오답으로 쓴 보기" }, w.decoys[1]] }]).some((e) => e.includes("정답이 둘")));
});

// ── 3단계 「따지기」와 실력 점검 (R4) ─────────────────────────────────

test("따지기 문항: 네 갈래가 은행에 들어오고, 단계는 3(source), 언행 단원은 /words로 간다", () => {
  const bank = buildStudyBank();
  const l3 = bank.items.filter((i) => i.step === "source");
  for (const skill of ["A2", "A4", "B1", "B2"]) assert.ok(l3.some((i) => i.skill === skill), `${skill} 문항이 있다`);
  for (const i of l3) assert.ok(i.choice && i.choice.correct >= 0 && i.choice.correct < i.choice.options.length, `${i.id}: 정답 번호`);
  assert.ok(l3.filter((i) => i.skill === "B2").every((i) => i.choice?.evidence), "제목과 근거 문항은 근거 문장을 함께 보인다");
  assert.ok(l3.filter((i) => i.skill === "A4").every((i) => i.choice!.options[i.choice!.correct].label !== "언론 기사"), "언론 기사는 늘 오답 보기");
  const words = bank.units.filter((u) => u.course === "words");
  assert.ok(words.length > 5);
  for (const u of words) assert.match(u.href, /^\/words\/[a-z0-9-]+$/);
  assert.ok(bank.items.filter((i) => i.unit.startsWith("w:")).every((i) => i.anchors[0].startsWith("words:")));
});

test("따지기 검사: 지금 문항은 통과하고, 확인 수준을 거꾸로 하거나 출처에 없는 자료를 답으로 하면 잡는다", () => {
  const achievements = getPublishedAchievements();
  assert.deepEqual(validateWeigh(achievements, POLICIES, STATEMENTS as never), []);
  const v = CHECK_ITEMS.find((q) => q.kind === "verified")!;
  assert.equal(validateWeigh(achievements, POLICIES, STATEMENTS as never, { check: [{ ...v, answer: "unconfirmed" }] }).length, 1, "확인된 claim을 확인 안 됨으로");
  const g = CHECK_ITEMS.find((q) => q.kind === "gap")!;
  assert.equal(validateWeigh(achievements, POLICIES, STATEMENTS as never, { check: [{ ...g, gapIndex: 999 }] }).length, 1, "없는 gap");
  const w = WEIGHT_ITEMS.find((q) => q.answer === "legislative")!;
  const other = (["statistics", "judicial", "official"] as const).find((t) => {
    const unit = w.unit;
    const c = (unit.startsWith("a:") ? achievements.find((a) => a.slug === unit.slice(2))?.claims : POLICIES.find((p) => p.slug === unit.slice(2))?.claims)?.find((x) => x.id === w.claimId);
    const srcs = unit.startsWith("a:") ? achievements.find((a) => a.slug === unit.slice(2))?.sources : POLICIES.find((p) => p.slug === unit.slice(2))?.sources;
    return !c?.sourceIds.some((id) => srcs?.find((x) => x.id === id)?.type === t);
  });
  if (other) assert.equal(validateWeigh(achievements, POLICIES, STATEMENTS as never, { weight: [{ ...w, answer: other }] }).length, 1, "출처 종류에 없는 답");
});

test("실력 점검: 3단계부터, 28일마다, 처음 보는 문장만, 기술을 고루 12개", () => {
  const bank = buildStudyBank();
  assert.equal(assessReady(2, [], "2026-11-28"), false, "2단계는 아직");
  assert.equal(assessReady(3, [], "2026-11-28"), true);
  assert.equal(assessReady(3, [{ day: "2026-11-10" }], "2026-11-28"), false, "18일 전에 봤다");
  assert.equal(assessReady(3, [{ day: "2026-10-31" }], "2026-11-28"), true, "28일 지났다");
  const seen = Object.fromEntries(bank.items.slice(0, 40).map((i) => [i.id, [2, "x"] as Box]));
  const checked = bank.items.slice(40, 60).map((i) => i.id);
  const ids = pickAssess(bank, seen, checked);
  assert.equal(ids.length, ASSESS_SIZE);
  assert.ok(ids.every((id) => !seen[id] && !checked.includes(id)), "푼 적도, 점검에 낸 적도 없는 문항");
  const skills = new Set(ids.map((id) => bank.items.find((i) => i.id === id)!.skill));
  assert.ok(skills.size >= 4, "기술이 고루 섞인다");
  assert.ok(ids.every((id) => (bank.items.find((i) => i.id === id)!.step as string) !== "counter"), "3단계 사람에게 4단계 문항을 내지 않는다");
});

function pickAssess(bank: StudyBank, boxes: Record<string, Box>, checked: string[]) {
  return assessSession(bank, boxes, checked, 3);
}
