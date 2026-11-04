/**
 * 정원 코치의 단계 판정 — `pnpm garden:test`.
 * 단계는 정원 상태로만 넘어간다. 화면 없이 상태를 넣어 본다.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { coachCard, coachStep, COACH_STEPS, initialCoach, TIP_TABS, type CoachData } from "./coach";
import type { Plant } from "./types";

const NOW = 1_800_000_000_000;
const plant = (ripeAt: number): Plant => ({ id: "p", speciesId: "w:x", plantedAt: NOW - 1, ripeAt, speed: 1, harvests: 0 });
const state = (over: Partial<{ coach: CoachData; beds: Array<Plant | null>; basket: unknown[]; dex: Record<string, unknown> }> = {}) => ({
  coach: initialCoach({}),
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
  const coach = { ...initialCoach({}), marks: ["sold", "bought"] };
  assert.equal(coachStep(state({ dex, coach }), NOW), "done");
});

test("끄면 아무것도 보이지 않는다", () => {
  assert.equal(coachStep(state({ coach: { ...initialCoach({}), off: true } }), NOW), null);
});

test("코치 이전에 거둔 적 있는 정원은 끈 채로, 팁도 다 본 것으로", () => {
  const c = initialCoach({ "w:x": [] });
  assert.equal(c.off, true);
  assert.deepEqual(c.tips, TIP_TABS);
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
