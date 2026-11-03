/**
 * 정원 규칙의 단위 검사 — `pnpm garden:test`.
 *
 * rules.ts는 순수 함수만 있어 시각을 넣으면 결과가 정해진다. 여기서는 화면으로는
 * 눈치채기 어려운 것을 본다: 한국 날짜 경계, 단비 창, 성장 시간 계산, 상점 진열의
 * 결정성, 그리고 Firestore 규칙과 같아야 하는 값(다시 나는 시각, 하루 번호).
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BLOOM_CARE,
  bloomBonus,
  bloomStage,
  defaultNick,
  HOUR,
  isRaining,
  kstDay,
  kstDayNumber,
  MINUTE,
  NICK_MAX,
  nextRain,
  plazaLevel,
  regrowMinutes,
  ripeTime,
  rollMutations,
  shopFor,
  SHOP_ODDS,
  withRainbow,
} from "./rules";
import type { Plant, Species, Tier } from "./types";

/** 한국 시각으로 적은 때를 밀리초로. */
const kst = (iso: string) => Date.parse(`${iso}+09:00`);

const species = (id: string, tier: Tier, seed: number): Species => ({
  id,
  tier,
  title: id,
  href: `/${id}`,
  notes: [],
  seed,
});

const CATALOG: Species[] = [
  ...Array.from({ length: 20 }, (_, i) => species(`w:s${i}`, "sprout", 1000 + i)),
  ...Array.from({ length: 20 }, (_, i) => species(`p:c${i}`, "common", 2000 + i)),
  ...Array.from({ length: 8 }, (_, i) => species(`a:f${i}`, "flagship", 3000 + i)),
  ...Array.from({ length: 3 }, (_, i) => species(`a:p${i}`, "perennial", 4000 + i)),
];

test("한국 날짜는 한국 자정에 넘어간다", () => {
  assert.equal(kstDay(kst("2026-11-03T23:59:59")), "2026-11-03");
  assert.equal(kstDay(kst("2026-11-04T00:00:00")), "2026-11-04");
});

test("하루 번호는 Firestore 규칙의 식과 같다", () => {
  // firestore.rules: math.floor((request.time.toMillis() + 32400000) / 86400000)
  for (const t of [kst("2026-11-03T23:59:59"), kst("2026-11-04T00:00:00"), Date.UTC(2026, 0, 1)]) {
    assert.equal(kstDayNumber(t), Math.floor((t + 32400000) / 86400000));
  }
  assert.equal(kstDayNumber(kst("2026-11-04T00:00:00")) - kstDayNumber(kst("2026-11-03T23:59:59")), 1);
});

test("단비는 12:30과 19:30에 10분 온다", () => {
  assert.equal(isRaining(kst("2026-11-03T12:29:59")), false);
  assert.equal(isRaining(kst("2026-11-03T12:30:00")), true);
  assert.equal(isRaining(kst("2026-11-03T12:39:59")), true);
  assert.equal(isRaining(kst("2026-11-03T12:40:00")), false);
  assert.equal(nextRain(kst("2026-11-03T12:40:00")).start, kst("2026-11-03T19:30:00"));
  assert.equal(nextRain(kst("2026-11-03T21:00:00")).start, kst("2026-11-04T12:30:00"));
});

test("성장 시간: 단비 없으면 그대로, 배율만큼 빨라진다", () => {
  const start = kst("2026-11-03T01:00:00");
  assert.equal(ripeTime(start, 60, 1), start + 60 * MINUTE);
  assert.equal(ripeTime(start, 60, 1.25), start + 48 * MINUTE);
});

test("성장 시간: 단비 동안은 두 배로 자란다", () => {
  // 12:30에 30분짜리를 심으면 단비 10분이 20분 몫이고, 남은 10분은 단비 뒤에 자란다.
  assert.equal(ripeTime(kst("2026-11-03T12:30:00"), 30, 1), kst("2026-11-03T12:50:00"));
  // 12:20에 15분짜리: 10분 자라고, 단비 2.5분이 남은 5분 몫.
  assert.equal(ripeTime(kst("2026-11-03T12:20:00"), 15, 1), kst("2026-11-03T12:32:30"));
});

test("성장 시간: 여러 날에 걸쳐도 단비 넷을 모두 건넌다", () => {
  const start = kst("2026-11-03T00:00:00");
  // 이틀(2880분) 동안 단비 넷(40분)이 있으니 40분 몫을 덜 기다린다.
  assert.equal(ripeTime(start, 48 * 60, 1), start + (48 * 60 - 40) * MINUTE);
});

test("상점: 같은 슬롯은 같은 진열, 품종은 겹치지 않는다", () => {
  const a = shopFor(123456, CATALOG);
  const b = shopFor(123456, CATALOG);
  assert.deepEqual(a, b);
  assert.equal(a.length, 6);
  assert.equal(new Set(a.map((i) => i.speciesId)).size, a.length);
  for (const item of a) assert.ok(item.stock >= 1);
});

test("상점: 공개한 등급 확률의 합은 1이고, 긴 기간에서 그 비율에 가깝다", () => {
  const sum = SHOP_ODDS.reduce((s, o) => s + o.p, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
  const tierOf = new Map(CATALOG.map((s) => [s.id, s.tier]));
  const seen: Record<string, number> = {};
  let total = 0;
  for (let slot = 0; slot < 3000; slot++) {
    for (const item of shopFor(slot, CATALOG)) {
      const tier = tierOf.get(item.speciesId)!;
      seen[tier] = (seen[tier] ?? 0) + 1;
      total++;
    }
  }
  // 칸 안에서 겹치는 품종을 다시 굴리므로 정확히 같지는 않다. 대표·다년생처럼
  // 품종이 적은 등급이 조금 덜 나온다. 공개 확률과 크게 어긋나지 않는지만 본다.
  for (const o of SHOP_ODDS) {
    const got = (seen[o.tier] ?? 0) / total;
    assert.ok(Math.abs(got - o.p) < 0.05, `${o.tier}: 공개 ${o.p}, 실제 ${got.toFixed(3)}`);
  }
});

test("광장 상태: 20% 미만 깨끗함, 60% 이하 보통", () => {
  assert.equal(plazaLevel(0), "clean");
  assert.equal(plazaLevel(4), "clean"); // 16.7%
  assert.equal(plazaLevel(5), "normal"); // 20.8%
  assert.equal(plazaLevel(14), "normal"); // 58.3%
  assert.equal(plazaLevel(15), "overgrown"); // 62.5%
});

test("다시 나는 시각은 Firestore 규칙의 [15, 245]분 안이다", () => {
  for (const people of [0, 1, 2, 5, 20, 100, 10_000]) {
    for (const roll of [0, 0.5, 0.999999]) {
      const m = regrowMinutes(people, roll);
      assert.ok(m >= 20 && m <= 240, `${people}명, roll ${roll}: ${m}분`);
    }
  }
  // 사람이 많을수록 빨리 난다.
  assert.ok(regrowMinutes(100, 0.5) < regrowMinutes(1, 0.5));
});

test("무지개는 변이 셋 이상일 때 한 번만 붙는다", () => {
  assert.deepEqual(withRainbow(["golden", "moist"]), ["golden", "moist"]);
  assert.deepEqual(withRainbow(["golden", "moist", "shine"]), ["golden", "moist", "shine", "rainbow"]);
  assert.deepEqual(withRainbow(["golden", "moist", "shine", "rainbow"]), ["golden", "moist", "shine", "rainbow"]);
});

test("변이는 같은 포기·같은 수확이면 다시 굴러가지 않는다", () => {
  const plant: Plant = {
    id: "abc123",
    speciesId: "w:s0",
    plantedAt: kst("2026-11-03T12:25:00"),
    ripeAt: kst("2026-11-03T12:45:00"),
    speed: 1,
    harvests: 0,
  };
  assert.deepEqual(rollMutations(plant, "clean"), rollMutations(plant, "clean"));
  // 축복은 광장이 깨끗할 때만.
  for (let i = 0; i < 500; i++) {
    const p = { ...plant, id: `p${i}` };
    assert.ok(!rollMutations(p, "normal").includes("blessed"));
  }
});

test("촉촉은 성장 중에 단비가 없었으면 붙지 않는다", () => {
  for (let i = 0; i < 500; i++) {
    const plant: Plant = {
      id: `dry${i}`,
      speciesId: "w:s0",
      plantedAt: kst("2026-11-03T01:00:00"),
      ripeAt: kst("2026-11-03T01:10:00"),
      speed: 1,
      harvests: 0,
    };
    assert.ok(!rollMutations(plant, "clean").includes("moist"));
  }
});

test("꽃밭: 만개 단계와 보너스 상한", () => {
  assert.equal(bloomStage(0, false), "seedling");
  assert.equal(bloomStage(BLOOM_CARE - 1, false), "bud");
  assert.equal(bloomStage(0, true), "bloom");
  assert.equal(bloomBonus(1), 0.02);
  assert.equal(bloomBonus(100), 0.4);
});

test("지어 주는 정원 이름은 규칙의 12자 안이다", () => {
  for (let i = 0; i < 1000; i++) {
    const nick = defaultNick(`seed-${i}`);
    assert.ok(nick.length >= 1 && nick.length <= NICK_MAX, nick);
  }
  assert.equal(HOUR, 60 * MINUTE);
});
