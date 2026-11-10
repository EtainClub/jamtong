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
  FINISHER_ORDER,
  FINISHERS,
  HOUR,
  RAID_FINISHER_MAX,
  MINUTE,
  nextRaidWave,
  RAID_EVERY_HOURS,
  RAID_FIRST_HOUR,
  RAID_GAP,
  kstDayNumber,
  raidOpensAt,
  RAID_HITS_PER_PERSON,
  RAID_HP_MAX,
  RAID_HP_MIN,
  RAID_LIFE,
  RAID_MIN_FIGHTERS,
  RAID_PER_DAY,
  RAID_SHARDS,
  RAID_KINDS,
  RAID_MAX_FIGHTERS,
  josa,
  raidHp,
  raidKind,
  raidTaunt,
  raidShard,
  raidKey,
  raidPhase,
  fertilizerCut,
  TOOL_ORDER,
  TOOLS,
  type RaidWave,
} from "./rules";
import type { Plant } from "./types";
import { comboTier, RAID_GIMMICKS, raidRubsPerStrike, raidStage, raidSurge } from "./raidPlay";

const T = 1_800_000_000_000;
const wave = (over: Partial<RaidWave> = {}): RaidWave => ({ hp: 300, hits: 0, fighters: 0, spawnedAt: T, defeatedAt: null, ...over });

test("어느 종류도 혼자서는, 셋보다 적게는 쓰러뜨리지 못한다", () => {
  for (const kind of RAID_KINDS) {
    assert.ok(kind.hp > RAID_HITS_PER_PERSON * (RAID_MIN_FIGHTERS - 1), `${kind.id}: ${kind.hp}`);
    assert.ok(kind.hp >= RAID_HP_MIN && kind.hp <= RAID_HP_MAX);
  }
  assert.equal(RAID_HP_MIN, RAID_HITS_PER_PERSON * RAID_MIN_FIGHTERS);
});

test("어느 종류든 RAID_MAX_FIGHTERS명이 자기 몫을 다 치면 쓰러뜨린다", () => {
  for (const kind of RAID_KINDS) assert.ok(kind.hp <= RAID_HITS_PER_PERSON * RAID_MAX_FIGHTERS, kind.id);
  assert.equal(RAID_MIN_FIGHTERS, 3);
});

test("하루 세 물결은 서로 다른 종류이고, 날마다 순서가 바뀐다", () => {
  const firsts = new Set<string>();
  for (let day = 20_000; day < 20_100; day++) {
    const kinds = Array.from({ length: RAID_PER_DAY }, (_, i) => raidKind(day, i + 1).id);
    assert.equal(new Set(kinds).size, RAID_PER_DAY, `${day}: ${kinds.join(",")}`);
    assert.equal(raidKind(day, 1).id, raidKind(day, 1).id);
    assert.equal(raidHp(day, 2), raidKind(day, 2).hp);
    firsts.add(kinds[0]);
  }
  assert.equal(firsts.size, RAID_KINDS.length, "첫 물결로 모든 종류가 나온다");
});

test("대사는 맞을수록 넘어가고, 조사는 받침을 따른다", () => {
  const kind = RAID_KINDS[0];
  assert.equal(raidTaunt(kind, 0, kind.hp), kind.taunts[0]);
  assert.equal(raidTaunt(kind, kind.hp * 2, kind.hp), kind.taunts.at(-1));
  assert.equal(josa("가짜뉴스 덩굴", "이가"), "가짜뉴스 덩굴이");
  assert.equal(josa("갑질 엉겅퀴", "을를"), "갑질 엉겅퀴를");
  assert.equal(josa("땅투기 칡", "이가"), "땅투기 칡이");
});

test("세 시간 버티면 도망간다", () => {
  assert.equal(raidPhase(wave(), T + RAID_LIFE - 1), "active");
  assert.equal(raidPhase(wave(), T + RAID_LIFE), "escaped");
  assert.equal(raidPhase(wave({ defeatedAt: T + MINUTE }), T + RAID_LIFE * 2), "defeated");
  // 서버 시각이 아직 없으면 싸우는 중으로 본다.
  assert.equal(raidPhase(wave({ spawnedAt: null }), T + RAID_LIFE * 2), "active");
});

test("물결은 하루에 고르게 열린다 — 8·11·14·17·20시(한국 시각)", () => {
  const day = 20_400;
  const kstHour = (t: number) => ((t + 9 * HOUR) % (24 * HOUR)) / HOUR;
  const opens = Array.from({ length: RAID_PER_DAY }, (_, i) => raidOpensAt(day, i + 1));
  assert.deepEqual(opens.map(kstHour), [8, 11, 14, 17, 20]);
  for (const t of opens) assert.equal(kstDayNumber(t), day, "여는 시각은 그날 안이다");
  // 마지막 물결이 도망가도 그날 안에 끝난다.
  assert.ok(kstDayNumber(opens.at(-1)! + RAID_LIFE) === day);
  for (let i = 1; i < opens.length; i++) assert.equal(opens[i] - opens[i - 1], RAID_EVERY_HOURS * HOUR);
  assert.equal(RAID_PER_DAY, 5);
});

test("다음 물결은 제 시각이 되고, 앞 물결이 끝나고 30분이 지나야 나온다", () => {
  const day = 20_400;
  const open = (w: number) => raidOpensAt(day, w);
  const early = open(1) - 3 * HOUR; // 새벽 5시
  const none = Array.from({ length: RAID_PER_DAY }, () => null);
  assert.deepEqual(nextRaidWave(none, early), { wave: 1, at: open(1) }, "새벽에는 8시를 기다린다");
  const w1 = wave({ spawnedAt: open(1) });
  assert.equal(nextRaidWave([w1, null, null, null, null], open(1) + HOUR), null, "싸우는 중");
  // 10분 만에 쓰러져도 둘째는 11시에 열린다 — 오전에 몰리지 않는다.
  const quick = wave({ spawnedAt: open(1), defeatedAt: open(1) + 10 * MINUTE });
  assert.deepEqual(nextRaidWave([quick, null, null, null, null], open(1) + HOUR), { wave: 2, at: open(2) });
  // 오래 싸우면 끝나고 30분 뒤.
  const late = wave({ spawnedAt: open(2) + HOUR, defeatedAt: open(2) + 2.8 * HOUR });
  assert.deepEqual(nextRaidWave([quick, late, null, null, null], open(3)), { wave: 3, at: open(2) + 2.8 * HOUR + RAID_GAP });
  // 도망가면 태어나고 3시간 + 30분 뒤.
  const fled = wave({ spawnedAt: open(3) });
  assert.deepEqual(nextRaidWave([quick, late, fled, null, null], open(3) + RAID_LIFE), { wave: 4, at: Math.max(open(4), open(3) + RAID_LIFE + RAID_GAP) });
  const all = Array.from({ length: RAID_PER_DAY }, () => quick);
  assert.equal(nextRaidWave(all, open(5) + HOUR), null, "오늘 몫을 다 썼다");
  assert.equal(RAID_GAP, 30 * MINUTE);
  assert.equal(RAID_FIRST_HOUR, 8);
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
  has(`prev.defeatedAt + duration.value(${RAID_GAP / MINUTE}, 'm')`);
  has(`prev.spawnedAt + duration.value(${(RAID_LIFE + RAID_GAP) / MINUTE}, 'm')`);
  has(`(${RAID_FIRST_HOUR} + ${RAID_EVERY_HOURS} * (raidWave(raidId) - 1)) * 3600000`);
  // 칸(분산 카운터)의 수. 규칙은 칸 번호를 받고, 쓰러뜨릴 때 칸을 하나하나 더한다.
  has(`n.matches('^[0-${RAID_SHARDS - 1}]$')`);
  has(`request.resource.data.shard <= ${RAID_SHARDS - 1}`);
  has(`getAfter(raidShardPath(raidId, '${RAID_SHARDS - 1}')).data.hits;`);
  assert.ok(!rules.includes(`raidShardPath(raidId, '${RAID_SHARDS}')`), "규칙이 없는 칸까지 더한다");
  // 필살기: 한 커밋에 RAID_FINISHER_MAX방까지. 표식·칸 생성·칸 올리기 세 곳.
  has(`request.resource.data.hits <= (resource == null ? 0 : resource.data.hits) + ${RAID_FINISHER_MAX}`);
  has(`request.resource.data.hits <= ${RAID_FINISHER_MAX}\n`);
  has(`request.resource.data.hits <= resource.data.hits + ${RAID_FINISHER_MAX}`);
});

test("필살기는 한 커밋 상한 안이고, 내 몫으로는 여전히 혼자 못 잡는다", () => {
  for (const id of FINISHER_ORDER) {
    const f = FINISHERS[id];
    assert.ok(f.hits >= 2 && f.hits <= RAID_FINISHER_MAX, id);
    assert.ok(f.hits < RAID_HITS_PER_PERSON, id);
  }
  // 값이 클수록 더 세고, 하루에 덜 판다.
  for (let i = 1; i < FINISHER_ORDER.length; i++) {
    const [a, b] = [FINISHERS[FINISHER_ORDER[i - 1]], FINISHERS[FINISHER_ORDER[i]]];
    assert.ok(b.hits > a.hits && b.price > a.price && b.perDay <= a.perDay);
  }
  // 하루 살 수 있는 필살기를 다 써도 한 사람 몫(60)을 넘지 못한다 — 몫은 규칙이 지킨다.
  for (const kind of RAID_KINDS) assert.ok(kind.hp > RAID_HITS_PER_PERSON, kind.id);
});

test("손맛 규칙: 단계·합동 게이지·한 방에 드는 문지르기", () => {
  assert.equal(raidStage(0, 200), 0);
  assert.equal(raidStage(60, 200), 1);
  assert.equal(raidStage(100, 200), 2);
  assert.equal(raidStage(160, 200), 3);
  assert.equal(raidStage(999, 200), 3);
  assert.deepEqual(raidSurge(0, 200), { count: 0, fill: 0 });
  assert.deepEqual(raidSurge(50, 200), { count: 1, fill: 0.25 });
  assert.equal(raidSurge(200, 200).count, 4, "마지막 칸은 햇살이 아니다");
  for (const kind of RAID_KINDS) {
    const base = raidRubsPerStrike(kind.id, 0, kind.hp, false);
    assert.ok(base >= 2);
    assert.ok(raidRubsPerStrike(kind.id, 0, kind.hp, true) < base, `${kind.id}: 햇살은 문지르기를 줄인다`);
    assert.ok(RAID_GIMMICKS[kind.id].counter.stunMs <= 5_000, `${kind.id}: 반격이 너무 길다`);
  }
  // 갑질 엉겅퀴는 절반 아래에서 방패를 든다.
  assert.ok(raidRubsPerStrike("bossy", 250, 300, false) > raidRubsPerStrike("bossy", 0, 300, false));
  assert.equal(comboTier(5), 0);
  assert.equal(comboTier(10), 1);
  assert.equal(comboTier(60), 3);
});

test("칸은 사람마다 고정이고 고르게 퍼지며, 규칙의 읽기 상한 안에 든다", () => {
  // 쓰러뜨리는 규칙은 칸을 모두 getAfter로 읽는다. 한 문서 요청의 상한은 10번이고 물결 문서도 읽는다.
  assert.ok(RAID_SHARDS >= 2 && RAID_SHARDS <= 9);
  const counts = Array.from({ length: RAID_SHARDS }, () => 0);
  for (let i = 0; i < 4000; i++) {
    const n = raidShard(`uid-${i}-${i * 7919}`);
    assert.ok(Number.isInteger(n) && n >= 0 && n < RAID_SHARDS);
    counts[n] += 1;
  }
  assert.equal(raidShard("same-user"), raidShard("same-user"));
  for (const c of counts) assert.ok(c > 4000 / RAID_SHARDS / 2, `한 칸에 너무 적다: ${counts.join(",")}`);
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
