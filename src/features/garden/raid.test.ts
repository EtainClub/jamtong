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
  RAID_USES_PER_PERSON,
  RAID_HITS_MAX_PER_PERSON,
  RAID_GAP_MULT,
  RAID_GAP_EVERY,
  RAID_GAP_MINUTES,
  RAID_FRENZY,
  RAID_FRENZY_GAP_MINUTES,
  RAID_AIDS,
  RAID_AID_ORDER,
  RAID_AID_MIN_GAP,
  RAID_NAMES_PER_SHARD,
  RAID_BOX,
  RAID_BOX_FAST_PERENNIAL,
  openRaidBox,
  raidGapAt,
  raidGapWindow,
  raidNeed,
  raidStrikeValue,
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
import {
  addSample,
  aidCooldown,
  boxPerennial,
  freshKit,
  KIT,
  KIT_ORDER,
  raidLoot,
  raidStars,
  SAMPLES_PER_TROPHY,
  SPORE_COUNT,
  sporeCells,
} from "./raid/rules";
import type { Species } from "./types";

const T = 1_800_000_000_000;
const wave = (over: Partial<RaidWave> = {}): RaidWave => ({ hp: 300, hits: 0, fighters: 0, spawnedAt: T, defeatedAt: null, ...over });

test("혼자도 둘도 — 모든 기력을 빈틈에 써도 — 어느 체력에도 닿지 못한다", () => {
  assert.equal(RAID_HITS_MAX_PER_PERSON, RAID_USES_PER_PERSON * RAID_GAP_MULT);
  assert.equal(RAID_HP_MIN, 270);
  // 체력 하한 자체가 두 사람의 최대치(240)보다 크다 — 규칙이 이 하한으로 물결을 받는다.
  assert.ok(RAID_HP_MIN > 2 * RAID_HITS_MAX_PER_PERSON, `${RAID_HP_MIN} <= ${2 * RAID_HITS_MAX_PER_PERSON}`);
  for (const kind of RAID_KINDS) {
    assert.ok(kind.hp > RAID_HITS_MAX_PER_PERSON * (RAID_MIN_FIGHTERS - 1), `${kind.id}: ${kind.hp}`);
    assert.ok(kind.hp >= RAID_HP_MIN && kind.hp <= RAID_HP_MAX);
  }
  assert.deepEqual(RAID_KINDS.map((k) => k.hp).sort((a, b) => a - b), [270, 270, 360, 360, 450, 450]);
});

test("모두 빈틈이면 3–4명, 빈틈을 하나도 안 쓰면 5–8명이 든다", () => {
  for (const kind of RAID_KINDS) {
    const need = raidNeed(kind.hp);
    assert.ok(need.least >= RAID_MIN_FIGHTERS && need.least <= 4, `${kind.id}: ${need.least}`);
    assert.ok(need.most >= 5 && need.most <= RAID_MAX_FIGHTERS, `${kind.id}: ${need.most}`);
    assert.ok(kind.hp <= RAID_USES_PER_PERSON * RAID_MAX_FIGHTERS, kind.id);
  }
  // 2.0 이전에 태어난 작은 물결에는 빈틈이 없다.
  assert.deepEqual(raidNeed(180), { least: 3, most: 3 });
});

// 분과 초로 시각을 만든다. UTC 분 = 한국 시각 분.
const at = (minute: number, second = 0) => Date.UTC(2026, 10, 14, 5, minute, second);

test("빈틈은 매 시 정각·30분부터 3분, 폭주(도망 30분 전부터)에는 6분", () => {
  const born = at(0) - HOUR; // 한 시간 전에 태어났다 — 폭주 아님
  for (const [m, gap] of [[0, true], [2, true], [3, false], [5, false], [29, false], [30, true], [32, true], [33, false], [59, false]] as const) {
    assert.equal(raidGapAt(at(m, 30), born, 270), gap, `${m}분`);
    assert.equal(raidStrikeValue(at(m, 30), born, 270), gap ? RAID_GAP_MULT : 1);
  }
  const frenzied = at(0) - (RAID_LIFE - RAID_FRENZY) - MINUTE; // 폭주 중
  for (const [m, gap] of [[0, true], [5, true], [6, false], [35, true], [36, false]] as const) assert.equal(raidGapAt(at(m, 10), frenzied, 270), gap, `폭주 ${m}분`);
  // 작은 옛 물결에는 빈틈이 없다(규칙도 hp >= 270에서만 두 배를 받는다).
  assert.equal(raidGapAt(at(1), born, 180), false);
  assert.equal(raidGapWindow(at(1), born, 180), null);
  assert.equal(RAID_GAP_EVERY, 30);
  assert.equal(RAID_FRENZY, 30 * MINUTE);
});

test("다음 빈틈의 시각과 끝", () => {
  const born = at(0) - HOUR;
  assert.deepEqual(raidGapWindow(at(1), born, 300), { start: at(0), end: at(3), now: true });
  assert.deepEqual(raidGapWindow(at(10), born, 300), { start: at(30), end: at(33), now: false });
  assert.deepEqual(raidGapWindow(at(45), born, 300), { start: at(60), end: at(63), now: false });
  const frenzied = at(0) - (RAID_LIFE - RAID_FRENZY) - MINUTE;
  assert.deepEqual(raidGapWindow(at(4), frenzied, 300), { start: at(0), end: at(6), now: true });
});

test("하루 다섯 물결은 서로 다른 종류이고, 날마다 순서가 바뀐다", () => {
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

test("상자 장부 열쇠(raidKey)는 옛 날짜 번호와 겹치지 않는다 — 보상을 물결마다 한 번만", () => {
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
  // 기력 60은 uses에, 옛 화면(uses 없음)은 hits에 건다.
  has(`d.uses <= ${RAID_USES_PER_PERSON}`);
  has(`request.resource.data.hits <= ${RAID_USES_PER_PERSON}`);
  // 빈틈: 분 % 30 < 3, 폭주(도망 30분 전 = 태어나고 150분)면 < 6, 두 배, 체력 하한에서만.
  has(`request.time.minutes() % ${RAID_GAP_EVERY}`);
  has(`(m < ${RAID_GAP_MINUTES} || (m < ${RAID_FRENZY_GAP_MINUTES} && request.time >= raid.spawnedAt + duration.value(${(RAID_LIFE - RAID_FRENZY) / MINUTE}, 'm')))`);
  has(`used * (raidGap(raid) ? ${RAID_GAP_MULT} : 1)`);
  has(`raid.hp >= ${RAID_HP_MIN}`);
  // 지원: 종류 코드와 최소 간격.
  has(`d.aid in [${RAID_AID_ORDER.map((id) => RAID_AIDS[id].code).join(", ")}]`);
  has(`was.aidAt + duration.value(${RAID_AID_MIN_GAP / 1000}, 's')`);
  has(`names.size() <= ${RAID_NAMES_PER_SHARD}`);
  has(`resource.data.spawnedAt + duration.value(${RAID_LIFE / HOUR}, 'h')`);
  has(`prev.defeatedAt + duration.value(${RAID_GAP / MINUTE}, 'm')`);
  has(`prev.spawnedAt + duration.value(${(RAID_LIFE + RAID_GAP) / MINUTE}, 'm')`);
  has(`(${RAID_FIRST_HOUR} + ${RAID_EVERY_HOURS} * (raidWave(raidId) - 1)) * 3600000`);
  // 칸(분산 카운터)의 수. 규칙은 칸 번호를 받고, 쓰러뜨릴 때 칸을 하나하나 더한다.
  has(`n.matches('^[0-${RAID_SHARDS - 1}]$')`);
  has(`d.shard <= ${RAID_SHARDS - 1}`);
  has(`getAfter(raidShardPath(raidId, '${RAID_SHARDS - 1}')).data.hits;`);
  assert.ok(!rules.includes(`raidShardPath(raidId, '${RAID_SHARDS}')`), "규칙이 없는 칸까지 더한다");
  // 필살기: 한 커밋에 기력 RAID_FINISHER_MAX번까지(빈틈이면 센 값은 그 두 배). 표식·칸 생성·칸 올리기.
  has(`used <= ${RAID_FINISHER_MAX}\n`);
  has(`request.resource.data.hits <= (resource == null ? 0 : resource.data.hits) + ${RAID_FINISHER_MAX}`);
  has(`request.resource.data.hits <= ${RAID_FINISHER_MAX * RAID_GAP_MULT}\n`);
  has(`request.resource.data.hits <= resource.data.hits + ${RAID_FINISHER_MAX * RAID_GAP_MULT}`);
});

test("필살기는 한 커밋 상한 안이고, 기력으로는 여전히 혼자 못 잡는다", () => {
  for (const id of FINISHER_ORDER) {
    const f = FINISHERS[id];
    assert.ok(f.hits >= 2 && f.hits <= RAID_FINISHER_MAX, id);
    assert.ok(f.hits < RAID_USES_PER_PERSON, id);
  }
  // 값이 클수록 더 세고, 하루에 덜 판다.
  for (let i = 1; i < FINISHER_ORDER.length; i++) {
    const [a, b] = [FINISHERS[FINISHER_ORDER[i - 1]], FINISHERS[FINISHER_ORDER[i]]];
    assert.ok(b.hits > a.hits && b.price > a.price && b.perDay <= a.perDay);
  }
  // 필살기를 빈틈에 다 써도 한 사람 최대치(120)를 넘지 못한다 — 기력은 규칙이 지킨다.
  for (const kind of RAID_KINDS) assert.ok(kind.hp > RAID_HITS_MAX_PER_PERSON, kind.id);
});

test("기력을 더 주는 도구는 없다 — 도구는 기다림·묶임·콤보·알림뿐", () => {
  for (const id of KIT_ORDER) {
    const k = KIT[id];
    assert.ok(k.price > 0 && k.perDay > 0, id);
    assert.ok(!/기력.*(더|늘)/.test(k.hint), `${id}: ${k.hint}`);
  }
  assert.equal(KIT_ORDER.length + FINISHER_ORDER.length, 9, "아이템은 모두 아홉");
  // 지원 도구는 그 지원의 기다림만 60초 → 20초로, 켠 물결에서만.
  const kit = { ...freshKit(), on: { drumstick: "20406-1" } };
  assert.equal(aidCooldown(kit, "drum", "20406-1"), 20_000);
  assert.equal(aidCooldown(kit, "drum", "20406-2"), 60_000, "다른 물결에는 꺼져 있다");
  assert.equal(aidCooldown(kit, "torch", "20406-1"), 60_000);
  assert.ok(RAID_AID_MIN_GAP <= 20_000, "규칙의 간격은 아이템의 기다림보다 길면 안 된다");
});

test("빠른 처치 ★ — 물결 문서의 두 시각에서만", () => {
  assert.equal(raidStars(T, T + 30 * MINUTE), 3);
  assert.equal(raidStars(T, T + 31 * MINUTE), 2);
  assert.equal(raidStars(T, T + 90 * MINUTE), 2);
  assert.equal(raidStars(T, T + 91 * MINUTE), 1);
  assert.equal(raidStars(T, null), 0);
  assert.equal(raidStars(null, T), 0);
});

test("보상: ★ 조각, 끝까지, 응원단, 지원만 해도 상자, 도망에는 친 사람만 조각 하나", () => {
  const full = raidLoot("defeated", 3, { uses: 60, aids: 3 });
  assert.equal(full.box, true);
  assert.equal(full.roots, 3 + 1 + 1);
  assert.equal(full.perennial, RAID_BOX_FAST_PERENNIAL);
  assert.equal(raidLoot("defeated", 1, { uses: 10, aids: 0 }).roots, 1);
  assert.equal(raidLoot("defeated", 2, { uses: 59, aids: 2 }).roots, 2);
  const cheer = raidLoot("defeated", 2, { uses: 0, aids: 1 });
  assert.equal(cheer.box, true, "지원만 해도 참여 상자");
  assert.equal(cheer.perennial, RAID_BOX.odds[1].p);
  assert.equal(raidLoot("defeated", 3, { uses: 0, aids: 0 }).box, false, "들지 않았으면 없다");
  assert.equal(raidLoot("escaped", 0, { uses: 5, aids: 0 }).roots, 1);
  assert.equal(raidLoot("escaped", 0, { uses: 0, aids: 4 }).roots, 0, "도망에는 친 사람만");
  assert.equal(raidLoot("escaped", 0, { uses: 5, aids: 0 }).box, false);
  assert.equal(boxPerennial(2), 0.2);
});

const fakeCatalog = (): Species[] =>
  [
    ...Array.from({ length: 8 }, (_, i) => ({ id: `a:f${i}`, tier: "flagship" })),
    ...Array.from({ length: 4 }, (_, i) => ({ id: `a:p${i}`, tier: "perennial" })),
  ] as unknown as Species[];

test("상자 확률: 같은 씨앗이면 같은 결과, ★★★은 다년생 쪽만 넓힌다(옛 상자가 바뀌지 않는다)", () => {
  const catalog = fakeCatalog();
  let p20 = 0;
  let p35 = 0;
  for (let i = 0; i < 4000; i++) {
    const seed = `20406-${i % 5}:uid-${i}`;
    const a = openRaidBox(seed, catalog);
    const b = openRaidBox(seed, catalog, RAID_BOX_FAST_PERENNIAL);
    assert.equal(openRaidBox(seed, catalog)?.id, a?.id, "같은 씨앗 같은 결과");
    if (a?.tier === "perennial") {
      p20++;
      assert.equal(b?.id, a.id, "20%에서 다년생이던 상자는 35%에서도 같은 다년생");
    }
    if (b?.tier === "perennial") p35++;
  }
  assert.ok(Math.abs(p20 / 4000 - 0.2) < 0.03, `${p20}`);
  assert.ok(Math.abs(p35 / 4000 - 0.35) < 0.03, `${p35}`);
});

test("표본 셋이면 박제 하나, 이미 있으면 다시 주지 않는다", () => {
  let samples = {};
  const got: Array<string | null> = [];
  for (let i = 0; i < SAMPLES_PER_TROPHY + 1; i++) {
    const out = addSample(samples, "troll", new Set(got.filter(Boolean) as never[]));
    samples = out.samples;
    got.push(out.trophy);
  }
  assert.deepEqual(got, [null, null, "troll", null]);
});

test("포자는 물결마다 같은 여섯 칸", () => {
  const a = sporeCells("20406-2", 24);
  assert.equal(a.length, SPORE_COUNT);
  assert.equal(new Set(a).size, SPORE_COUNT);
  assert.deepEqual(sporeCells("20406-2", 24), a);
  assert.notDeepEqual(sporeCells("20406-3", 24), a);
  for (const c of a) assert.ok(c >= 0 && c < 24);
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
