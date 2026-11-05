/**
 * 정원 코치의 단계 판정 — `pnpm garden:test`.
 * 단계는 정원 상태로만 넘어간다. 화면 없이 상태를 넣어 본다.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { coachCard, coachStep, COACH_STEPS, initialCoach, normalizeCoach, type CoachData } from "./coach";
import type { Plant } from "./types";

const NOW = 1_800_000_000_000;
const plant = (ripeAt: number): Plant => ({ id: "p", speciesId: "w:x", plantedAt: NOW - 1, ripeAt, speed: 1, harvests: 0 });
const state = (over: Partial<{ coach: CoachData; beds: Array<Plant | null>; basket: unknown[]; dex: Record<string, unknown> }> = {}) => ({
  coach: initialCoach(),
  beds: [null, null],
  basket: [],
  dex: {},
  ...over,
});

test("새 정원은 심기부터", () => {
  assert.equal(coachStep(state(), NOW), "plant");
});

test("심으면 자라는 중, 익으면 거두기", () => {
  assert.equal(coachStep(state({ beds: [plant(NOW + 60_000), null] }), NOW), "grow");
  assert.equal(coachStep(state({ beds: [plant(NOW), null] }), NOW), "harvest");
});

test("거둔 뒤에는 졸이기, 졸인 뒤에는 사기, 산 뒤에는 끝", () => {
  const dex = { "w:x": [] };
  assert.equal(coachStep(state({ dex, basket: [{}] }), NOW), "sell");
  assert.equal(coachStep(state({ dex, basket: [] }), NOW), "buy");
  const coach = { ...initialCoach(), marks: ["sold", "bought"] };
  assert.equal(coachStep(state({ dex, coach }), NOW), "done");
});

test("끄면 아무것도 보이지 않는다", () => {
  assert.equal(coachStep(state({ coach: { ...initialCoach(), off: true } }), NOW), null);
});

test("이미 거둔 정원도 코치를 켜고, 남은 단계부터 보인다", () => {
  const c = normalizeCoach(undefined);
  assert.equal(c.off, false);
  assert.equal(coachStep(state({ coach: c, dex: { "w:x": [] } }), NOW), "buy");
});

test("v1에서 자동으로 꺼진 코치는 다시 켜고, 실제로 마친 코치는 둔다", () => {
  const auto = normalizeCoach({ marks: [], off: true, tips: ["shop", "dex"] });
  assert.deepEqual(auto, { v: 2, marks: [], off: false, tips: [] });
  const finished = normalizeCoach({ marks: ["sold", "bought"], off: true, tips: [] });
  assert.equal(finished.off, true);
  const current: CoachData = { v: 2, marks: [], off: true, tips: ["shop"] };
  assert.equal(normalizeCoach(current), current);
});

test("모든 단계에 카드가 있다", () => {
  for (const step of COACH_STEPS) {
    for (const hasSeeds of [true, false]) {
      const card = coachCard(step, { now: NOW, beds: [plant(NOW + 600_000)], hasSeeds });
      assert.ok(card.title && card.body, step);
      assert.ok(!card.body.includes("undefined") && !card.body.includes("NaN"), step);
    }
  }
});
