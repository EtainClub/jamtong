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
  RAID_FORM_GROW,
  RAID_FORM_SPLIT,
  RAID_NEED_MAX,
  RAID_NEED_PER_FIGHTER,
  RAID_NEED_SLACK,
  RAID_NEED_STEP,
  RAID_POOLS,
  RAID_ROLE_MULT,
  RAID_ROLE_ORDER,
  RAID_ROLES,
  RAID_SIZES,
  raidAdvanceKind,
  raidFilled,
  raidGauges,
  raidNeedV3,
  raidNextNeed,
  raidPoolValue,
  raidFormBase,
  raidSize,
  raidSplit,
  type RaidV3,
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
  RAID_JAM_MAX,
  raidJamLines,
  raidLoot,
  raidOutcome,
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
  const rules = readFileSync("firestore.rules", "utf8"); // pnpm garden:test는 저장소 뿌리에서 돈다
  const has = (text: string) => assert.ok(rules.includes(text), `firestore.rules에 없음: ${text}`);
  has(`'^[0-9]{5}-[1-${RAID_PER_DAY}]$'`);
  // 세우기: 1형, 종류의 크기를 모두 체력으로.
  has(`request.resource.data.size in [${RAID_SIZES.join(", ")}]`);
  assert.deepEqual([...RAID_FORM_SPLIT[1]], [100, 0, 0], "1형은 체력뿐이다(규칙이 hp == size, brk == 0, grd == 0으로 세운다)");
  has(`request.resource.data.hp == request.resource.data.size\n`);
  has(`request.resource.data.brk == 0`);
  has(`request.resource.data.grd == 0`);
  // 기력 60은 uses에 건다.
  has(`d.uses <= ${RAID_USES_PER_PERSON}`);
  // 빈틈: 분 % 30 < 3, 폭주(도망 30분 전 = 태어나고 150분)면 < 6, 두 배, 체력 하한에서만.
  has(`request.time.minutes() % ${RAID_GAP_EVERY}`);
  has(`(m < ${RAID_GAP_MINUTES} || (m < ${RAID_FRENZY_GAP_MINUTES} && request.time >= raid.spawnedAt + duration.value(${(RAID_LIFE - RAID_FRENZY) / MINUTE}, 'm')))`);
  has(`raid.hp >= ${RAID_HP_MIN}`);
  // 한 번의 값: 제 역할의 게이지면 두 배, 빈틈이면 다시 두 배. 역할 코드 = 게이지 번호 + 1.
  has(`gain == used * (role != 0 && (d.get('pool', 0) + 1 == role || form == 1) ? ${RAID_ROLE_MULT} : 1) * (raidGap(raid) ? ${RAID_GAP_MULT} : 1)`);
  for (const id of RAID_ROLE_ORDER) assert.equal(RAID_ROLES[id].code, RAID_ROLES[id].pool + 1, id);
  has(`role in [0, ${RAID_ROLE_ORDER.map((id) => RAID_ROLES[id].code).join(", ")}]`);
  assert.deepEqual([...RAID_POOLS], ["hits", "brk", "grd"]);
  has(`cellNow.get('${RAID_POOLS[1]}', 0) == cellWas.get('${RAID_POOLS[1]}', 0) + (pool == 1 ? gain : 0)`);
  has(`cellNow.get('${RAID_POOLS[2]}', 0) == cellWas.get('${RAID_POOLS[2]}', 0) + (pool == 2 ? gain : 0)`);
  // 지원: 종류 코드와 최소 간격.
  has(`d.aid in [${RAID_AID_ORDER.map((id) => RAID_AIDS[id].code).join(", ")}]`);
  has(`was.aidAt + duration.value(${RAID_AID_MIN_GAP / 1000}, 's')`);
  has(`names.size() <= ${RAID_NAMES_PER_SHARD}`);
  has(`resource.data.spawnedAt + duration.value(${RAID_LIFE / HOUR}, 'h')`);
  has(`prev.defeatedAt + duration.value(${RAID_GAP / MINUTE}, 'm')`);
  has(`prev.spawnedAt + duration.value(${(RAID_LIFE + RAID_GAP) / MINUTE}, 'm')`);
  has(`(${RAID_FIRST_HOUR} + ${RAID_EVERY_HOURS} * (raidWave(raidId) - 1)) * 3600000`);
  // 칸(분산 카운터)의 수. 규칙은 칸 번호를 받고, 넘길 때 칸을 하나하나 더한다.
  has(`n.matches('^[0-${RAID_SHARDS - 1}]$')`);
  has(`d.shard <= ${RAID_SHARDS - 1}`);
  has(`let c${RAID_SHARDS - 1} = getAfter(raidShardPath(raidId, '${RAID_SHARDS - 1}')).data;`);
  assert.ok(!rules.includes(`raidShardPath(raidId, '${RAID_SHARDS}')`), "규칙이 없는 칸까지 더한다");
  // 필살기: 한 커밋에 기력 RAID_FINISHER_MAX번까지. 칸의 게이지는 그 값(× 역할 × 빈틈)까지 오른다.
  has(`used <= ${RAID_FINISHER_MAX}\n`);
  const most = RAID_FINISHER_MAX * RAID_ROLE_MULT * RAID_GAP_MULT;
  for (const key of RAID_POOLS) assert.ok(rules.includes(`<= before.get('${key}', 0) + ${most}`), key);
  // 변신·처치: 3형 전에는 다 차면 늘 변신, 3형만 쓰러진다. 시간 조건은 없다(3.1).
  has(`&& (!('form' in resource.data) || resource.data.form == 3)`);
  assert.ok(!rules.includes("resource.data.formAt + duration"), "형태의 시간 조건이 남아 있다");
  // 1형은 누구나 두 배(역할 배수), 몸통(체력)에만.
  has(`(d.get('pool', 0) + 1 == role || form == 1) ? ${RAID_ROLE_MULT} : 1`);
  has(`(form != 1 || d.get('pool', 0) == 0)`);
  // 다음 형태의 필요량과 몫. 기본 크기는 1형의 6/5·3/2배(3.2). 넘어가는 동안 옛 화면의 2·5/2배도 받는다.
  assert.deepEqual(RAID_FORM_GROW[2], [6, 5]);
  assert.deepEqual(RAID_FORM_GROW[3], [3, 2]);
  has(`let floor = d.form == 2 ? was.size * ${RAID_FORM_GROW[2][0]} / ${RAID_FORM_GROW[2][1]} : was.size * ${RAID_FORM_GROW[3][0]} / ${RAID_FORM_GROW[3][1]};`);
  has(`let oldFloor = d.form == 2 ? was.size * 2 : was.size * 5 / 2;`);
  has(`d.n % ${RAID_NEED_STEP} == 0`);
  has(`d.n <= ${RAID_NEED_MAX}`);
  has(`d.n >= floor\n`);
  has(`d.n >= ${RAID_NEED_PER_FIGHTER} * (crowd - ${RAID_NEED_SLACK})`);
  // 위 끝은 옛 화면(60 × 인원)까지 받는다 — 새 값(40 × 인원)은 그 안에 든다.
  has(`(d.n == floor || d.n == oldFloor || (d.n % ${RAID_NEED_STEP} == 0 && d.n < 60 * crowd + ${RAID_NEED_STEP}))`);
  has(`let h = d.form == 2 ? ${RAID_FORM_SPLIT[2][0]} : ${RAID_FORM_SPLIT[3][0]};`);
  has(`let b = d.form == 2 ? ${RAID_FORM_SPLIT[2][1]} : ${RAID_FORM_SPLIT[3][1]};`);
  // 규칙은 갑옷과 울타리에 같은 몫(b)을 쓴다.
  assert.equal(RAID_FORM_SPLIT[2][1], RAID_FORM_SPLIT[2][2]);
  assert.equal(RAID_FORM_SPLIT[3][1], RAID_FORM_SPLIT[3][2]);
});

const v3wave = (over: Partial<RaidV3> = {}, hits = 0, born = T): RaidWave => {
  const v: RaidV3 = { form: 1, formAt: born, size: 300, n: 300, brk: 0, grd: 0, base: { h: 0, b: 0, g: 0 }, brkHits: 0, grdHits: 0, ...over };
  return { hp: v.base.h + raidSplit(v.n, v.form).h, hits, fighters: 3, spawnedAt: born, defeatedAt: null, v3: v };
};

test("3.1: 1형은 작다 — 혼자서는 못 잡고, 셋이면 빈틈 없이도 잡힌다", () => {
  assert.deepEqual([...new Set(RAID_KINDS.map((k) => k.size))].sort((a, b) => a - b), [...RAID_SIZES]);
  for (let wave = 1; wave <= RAID_PER_DAY; wave++) assert.ok((RAID_SIZES as readonly number[]).includes(raidSize(20773, wave)));
  // 한 사람이 한 형태에 넣는 최대: 기력 60 × 2 × 빈틈 2.
  const most = RAID_USES_PER_PERSON * RAID_ROLE_MULT * RAID_GAP_MULT;
  assert.equal(most, 240);
  for (const size of RAID_SIZES) {
    assert.ok(size > most, `혼자 ${most} ≥ ${size}`);
    // 1형은 모두 ×2라 한 사람이 빈틈 없이 120 — 셋–넷이면 잡힌다.
    const need = raidNeedV3(size);
    assert.ok(need.most >= 3 && need.most <= 4, `${size}: ${need.most}`);
    assert.equal(need.least, 2);
  }
});

test("3.1: 필요량은 형태마다 정수로 나뉘고 합이 그대로다", () => {
  for (const form of [1, 2, 3] as const) {
    assert.equal(RAID_FORM_SPLIT[form].reduce((a, b) => a + b, 0), 100);
    const ns = form === 1 ? [...RAID_SIZES] : [...RAID_SIZES.map((s) => raidFormBase(s, form)), 1080, 7200, RAID_NEED_MAX];
    for (const n of ns) {
      const part = raidSplit(n, form);
      assert.ok([part.h, part.b, part.g].every(Number.isInteger), `${form} ${n}`);
      assert.equal(part.h + part.b + part.g, n);
    }
  }
});

test("3.2: 2·3형은 1형의 1.2·1.5배, 사람이 많으면 40 × 인원(60 단위)까지 커진다", () => {
  assert.deepEqual(RAID_SIZES.map((s) => raidFormBase(s, 2)), [360, 432, 504]);
  assert.deepEqual(RAID_SIZES.map((s) => raidFormBase(s, 3)), [450, 540, 630]);
  assert.equal(raidNextNeed(300, 2, 4), 360, "넷이면 기본");
  assert.equal(raidNextNeed(420, 3, 6), 630);
  assert.equal(raidNextNeed(300, 2, 11), 480, "40 × 11 → 60 단위로 올림");
  assert.equal(raidNextNeed(300, 3, 11), 480);
  assert.equal(raidNextNeed(300, 2, 100), 4020);
  assert.equal(raidNextNeed(300, 2, 5000), RAID_NEED_MAX);
  // 2026-11-18의 물결: 1형을 잡은 6명이 빈틈 없이(120씩) 치면 가장 큰 2·3형(504·630)도 잡힌다. 넷이면 빈틈을 써야 한다.
  const crew = (n: number) => n * RAID_USES_PER_PERSON * RAID_ROLE_MULT;
  assert.ok(crew(6) >= raidNextNeed(420, 3, 6), "여섯이 3형");
  assert.ok(crew(4) < raidNextNeed(420, 2, 4) && crew(4) * RAID_GAP_MULT >= raidNextNeed(420, 3, 4), "넷은 빈틈으로");
  // 온 사람이 모두 제 역할로 빈틈 없이 치면(120씩) 사람 몫(40)의 세 배 — ⅓만 남아 쳐도 넘긴다.
  for (const f of [11, 37, 250]) assert.ok(raidNextNeed(300, 2, f) <= f * RAID_USES_PER_PERSON * RAID_ROLE_MULT);
  // 규칙이 받는 범위 안이다(인원을 정확히 읽었을 때).
  for (const size of RAID_SIZES) {
    for (const form of [2, 3] as const) {
      for (const f of [1, 7, 12, 18, 100, 999]) {
        const n = raidNextNeed(size, form, f);
        const floor = raidFormBase(size, form);
        assert.ok(n >= floor && n >= RAID_NEED_PER_FIGHTER * (f - RAID_NEED_SLACK), `${size} ${form} ${f}: ${n}`);
        assert.ok(n === floor || (n % RAID_NEED_STEP === 0 && n < RAID_NEED_PER_FIGHTER * f + RAID_NEED_STEP), `${size} ${form} ${f}: ${n}`);
      }
    }
  }
});

test("3.1: 다 차면 3형 전에는 늘 변신, 3형만 쓰러진다", () => {
  const w = v3wave({}, 299);
  assert.deepEqual(raidGauges(w).map((g) => [g.have, g.need]), [[299, 300], [0, 0], [0, 0]]);
  assert.equal(raidFilled(w), false);
  const full = v3wave({}, 320);
  assert.deepEqual(raidGauges(full).map((g) => g.have), [300, 0, 0], "목표에서 멈춰 그린다");
  assert.equal(raidFilled(full), true);
  assert.equal(raidAdvanceKind(full), "morph", "1형은 몇 시간이 걸려도 변신한다");
  // 2형: 0점은 변신할 때의 합계다.
  const second = v3wave({ form: 2, n: 600, base: { h: 320, b: 0, g: 0 }, brk: 150, grd: 150, brkHits: 30, grdHits: 150 }, 420);
  assert.deepEqual(raidGauges(second).map((g) => [g.have, g.need]), [[100, 300], [30, 150], [150, 150]]);
  assert.equal(raidAdvanceKind(second), "morph");
  assert.equal(raidAdvanceKind(v3wave({ form: 3, n: 750, base: { h: 620, b: 150, g: 150 } })), "finish");
  // 2.0 물결은 체력 하나.
  assert.deepEqual(raidGauges(wave({ hp: 270, hits: 300 })).map((g) => [g.have, g.need]), [[270, 270], [0, 0], [0, 0]]);
  assert.equal(raidAdvanceKind(wave({ hp: 270, hits: 270 })), "finish");
});

test("3.1: 한 번의 값 — 제 역할의 게이지 ×2, 남의 게이지 ×1(1형은 누구나 ×2), 빈틈이면 다시 ×2. 2.0 물결에는 역할 배수가 없다", () => {
  const born = at(10) - HOUR;
  const w = v3wave({ form: 2, n: 600, base: { h: 300, b: 0, g: 0 }, brk: 150, grd: 150 }, 300, born);
  assert.equal(raidPoolValue(w, "reaper", 0, at(10)), 2);
  assert.equal(raidPoolValue(w, "reaper", 1, at(10)), 1);
  assert.equal(raidPoolValue(w, "seeker", 1, at(10)), 2);
  assert.equal(raidPoolValue(w, "warden", 2, at(31)), 4, "빈틈");
  assert.equal(raidPoolValue(w, null, 0, at(31)), 2, "역할을 안 골랐으면 빈틈만");
  // 1형은 누구나 몸통에 ×2.
  const first = v3wave({}, 0, born);
  assert.equal(raidPoolValue(first, "warden", 0, at(10)), 2);
  assert.equal(raidPoolValue(first, "seeker", 0, at(31)), 4);
  assert.equal(raidPoolValue(wave({ hp: 270, spawnedAt: born }), "reaper", 0, at(10)), 1);
});

test("3.0: ★은 넘긴 형태 수 — 1형을 넘겼으면 도망가도 상자, 2.0 물결은 쓰러뜨려야 상자", () => {
  assert.deepEqual(raidOutcome({ ...v3wave(), defeatedAt: T + 1 }, "defeated"), { won: true, stars: 1 });
  assert.deepEqual(raidOutcome({ ...v3wave({ form: 3 }), defeatedAt: T + 1 }, "defeated"), { won: true, stars: 3 });
  assert.deepEqual(raidOutcome(v3wave(), "escaped"), { won: false, stars: 0 }, "1형도 못 넘겼다");
  assert.deepEqual(raidOutcome(v3wave({ form: 2 }), "escaped"), { won: true, stars: 1 });
  assert.deepEqual(raidOutcome(v3wave({ form: 3 }), "escaped"), { won: true, stars: 2 });
  assert.equal(raidOutcome(v3wave({ form: 2 }), "active").won, false, "싸우는 중에는 아직");
  assert.deepEqual(raidOutcome(wave({ defeatedAt: T + 20 * MINUTE }), "defeated"), { won: true, stars: 3 });
  assert.deepEqual(raidOutcome(wave(), "escaped"), { won: false, stars: 0 });
  // 지원만 했거나, 앞 형태에서만 쳤어도(기력 0으로 돌아가도) 든 사람이다.
  assert.equal(raidLoot("defeated", 2, { hits: 40, uses: 0, aids: 0 }).box, true);
});

test("3.1 잼: 참여 300 · 1형 700 · 2형 1,500 · 3형 2,500 — 끝까지 함께하면 5,000", () => {
  assert.equal(RAID_JAM_MAX, 5_000);
  assert.deepEqual(raidJamLines(0, false, [], []), [], "안 든 사람은 없다");
  assert.deepEqual(raidJamLines(0, false, [1], []), [], "아직 아무것도 넘어가지 않았다");
  assert.deepEqual(raidJamLines(0, true, [1], []).map((l) => [l.id, l.jam]), [[0, 300]], "1형에서 놓쳐도 참여 보상");
  assert.deepEqual(raidJamLines(1, false, [1], []).map((l) => [l.id, l.jam]), [[0, 300], [1, 700]], "1형을 넘기면 바로");
  assert.deepEqual(raidJamLines(2, false, [1, 2], [0, 1]).map((l) => l.id), [2], "받은 것은 다시 없다");
  assert.deepEqual(raidJamLines(3, true, [1, 2, 3], []).reduce((n, l) => n + l.jam, 0), 5_000);
  assert.deepEqual(raidJamLines(3, true, [3], []).map((l) => l.id), [0, 3], "3형에만 든 사람은 참여 + 3형");
  assert.deepEqual(raidJamLines(2, true, [1, 2, 3], []).map((l) => l.id), [0, 1, 2], "3형이 도망가면 3형 보상은 없다");
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
  const full = raidLoot("defeated", 3, { hits: 60, uses: 60, aids: 3 });
  assert.equal(full.box, true);
  assert.equal(full.roots, 3 + 1 + 1);
  assert.equal(full.perennial, RAID_BOX_FAST_PERENNIAL);
  assert.equal(raidLoot("defeated", 1, { hits: 10, uses: 10, aids: 0 }).roots, 1);
  assert.equal(raidLoot("defeated", 2, { hits: 59, uses: 59, aids: 2 }).roots, 2);
  const cheer = raidLoot("defeated", 2, { hits: 0, uses: 0, aids: 1 });
  assert.equal(cheer.box, true, "지원만 해도 참여 상자");
  assert.equal(cheer.perennial, RAID_BOX.odds[1].p);
  assert.equal(raidLoot("defeated", 3, { hits: 0, uses: 0, aids: 0 }).box, false, "들지 않았으면 없다");
  assert.equal(raidLoot("escaped", 0, { hits: 5, uses: 5, aids: 0 }).roots, 1);
  assert.equal(raidLoot("escaped", 0, { hits: 0, uses: 0, aids: 4 }).roots, 0, "도망에는 친 사람만");
  assert.equal(raidLoot("escaped", 0, { hits: 5, uses: 5, aids: 0 }).box, false);
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
