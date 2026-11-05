/**
 * 거대 잡초 물결과 쑥쑥 비료 — `pnpm garden:test`.
 *
 * 물결 규칙은 firestore.rules와 짝이 맞아야 한다. 규칙 파일을 읽어 숫자를 대조한다 —
 * 한쪽만 고치면 여기서 깨진다.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  fertilize,
  HOUR,
  MINUTE,
  nextRaidWave,
  RAID_GAP,
  RAID_HITS_PER_PERSON,
  RAID_HP_MAX,
  RAID_HP_MIN,
  RAID_LIFE,
  RAID_MIN_FIGHTERS,
  RAID_PER_DAY,
  raidHp,
  raidKey,
  raidPhase,
  fertilizerCut,
  TOOL_ORDER,
  TOOLS,
  type RaidWave,
} from "./rules";
import type { Plant } from "./types";

const T = 1_800_000_000_000;
const wave = (over: Partial<RaidWave> = {}): RaidWave => ({ hp: 300, hits: 0, fighters: 0, spawnedAt: T, defeatedAt: null, ...over });

test("혼자서는 쓰러뜨리지 못한다", () => {
  for (const people of [0, 1, 3, 10, 100, 10_000]) {
    const hp = raidHp(people);
    assert.ok(hp > RAID_HITS_PER_PERSON * (RAID_MIN_FIGHTERS - 1), `${people}명: ${hp}`);
    assert.ok(hp >= RAID_HP_MIN && hp <= RAID_HP_MAX);
  }
  assert.equal(RAID_HP_MIN, RAID_HITS_PER_PERSON * RAID_MIN_FIGHTERS);
});

test("세 시간 버티면 도망간다", () => {
  assert.equal(raidPhase(wave(), T + RAID_LIFE - 1), "active");
  assert.equal(raidPhase(wave(), T + RAID_LIFE), "escaped");
  assert.equal(raidPhase(wave({ defeatedAt: T + MINUTE }), T + RAID_LIFE * 2), "defeated");
  // 서버 시각이 아직 없으면 싸우는 중으로 본다.
  assert.equal(raidPhase(wave({ spawnedAt: null }), T + RAID_LIFE * 2), "active");
});

test("다음 물결은 앞 물결이 끝나고 두 시간 뒤", () => {
  assert.deepEqual(nextRaidWave([null, null, null], T), { wave: 1, at: T });
  assert.equal(nextRaidWave([wave(), null, null], T + HOUR), null, "싸우는 중");
  const beaten = wave({ defeatedAt: T + HOUR });
  assert.deepEqual(nextRaidWave([beaten, null, null], T + HOUR), { wave: 2, at: T + HOUR + RAID_GAP });
  assert.deepEqual(nextRaidWave([wave(), null, null], T + RAID_LIFE), { wave: 2, at: T + RAID_LIFE + RAID_GAP });
  assert.equal(nextRaidWave([beaten, beaten, beaten], T + 10 * HOUR), null, "오늘 몫을 다 썼다");
  assert.ok(RAID_PER_DAY >= 2);
});

test("상자 장부 열쇠는 옛 날짜 번호와 겹치지 않는다", () => {
  const day = 20_397;
  for (let w = 1; w <= RAID_PER_DAY; w++) assert.ok(raidKey(day, w) > 99_999 && raidKey(day, w) !== day);
  assert.notEqual(raidKey(day, 1), raidKey(day, 2));
});

test("firestore.rules의 물결 규칙이 rules.ts의 값과 같다", () => {
  const rules = readFileSync("firestore.rules", "utf8") // pnpm garden:test는 저장소 뿌리에서 돈다;
  const has = (text: string) => assert.ok(rules.includes(text), `firestore.rules에 없음: ${text}`);
  has(`'^[0-9]{5}-[1-${RAID_PER_DAY}]$'`);
  has(`request.resource.data.hp >= ${RAID_HP_MIN}`);
  has(`request.resource.data.hp <= ${RAID_HP_MAX}`);
  has(`request.resource.data.hits <= ${RAID_HITS_PER_PERSON}`);
  has(`resource.data.spawnedAt + duration.value(${RAID_LIFE / HOUR}, 'h')`);
  has(`prev.defeatedAt + duration.value(${RAID_GAP / HOUR}, 'h')`);
  has(`prev.spawnedAt + duration.value(${(RAID_LIFE + RAID_GAP) / HOUR}, 'h')`);
});

const plant = (over: Partial<Plant> = {}): Plant => ({ id: "p", speciesId: "a:x", plantedAt: T, ripeAt: T + 8 * HOUR, speed: 1, harvests: 0, ...over });

test("비료는 정해진 만큼만 당기고, 황금 비료도 2시간을 넘지 않는다", () => {
  const at = T + 2 * HOUR; // 남은 6시간
  assert.equal(fertilize(plant(), at, "sprinkle")!.ripeAt, T + 8 * HOUR - 10 * MINUTE);
  assert.equal(fertilize(plant(), at, "fertilizer")!.ripeAt, T + 8 * HOUR - HOUR);
  assert.equal(fertilize(plant(), at, "golden")!.ripeAt, T + 8 * HOUR - 2 * HOUR, "6시간의 절반은 3시간이지만 2시간까지만");
  // 짧게 남았으면 절반, 남은 것보다 많이 당기지는 않는다.
  assert.equal(fertilizerCut("golden", 30 * MINUTE), 15 * MINUTE);
  assert.equal(fertilizerCut("fertilizer", 5 * MINUTE), 5 * MINUTE);
  // 8시간 업적 작물을 어떤 비료로도 4시간으로 줄이지 못한다.
  for (const id of TOOL_ORDER) assert.ok(fertilizerCut(id, 8 * HOUR) <= 2 * HOUR, id);
});

test("비료는 종류와 상관없이 한 번 익는 동안 한 번만", () => {
  const fed = fertilize(plant(), T + HOUR, "sprinkle")!;
  for (const id of TOOL_ORDER) assert.equal(fertilize(fed, T + HOUR, id), null, id);
  assert.equal(fertilize(plant(), T + 9 * HOUR, "fertilizer"), null, "이미 익었다");
  // 다년생은 다시 열리면 또 줄 수 있다.
  assert.ok(fertilize({ ...fed, harvests: 1, ripeAt: T + 20 * HOUR }, T + 10 * HOUR, "golden"));
});

test("값이 큰 비료일수록 더 많이 당기고, 하루 상한은 더 적다", () => {
  const order = TOOL_ORDER.map((id) => TOOLS[id]);
  for (let i = 1; i < order.length; i++) {
    assert.ok(order[i].price > order[i - 1].price);
    assert.ok(order[i].perDay <= order[i - 1].perDay);
  }
});
