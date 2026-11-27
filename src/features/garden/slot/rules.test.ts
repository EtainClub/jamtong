import assert from "node:assert/strict";
import { test } from "node:test";

import { rng, rollMutations, SEED_PRICE } from "../rules";
import { freshRoom } from "../room/rules";
import type { Plant } from "../types";
import { RARE_SEEDS } from "./rare";
import { roomPool, todaysRoomTable } from "./roomPool";
import {
  nextRoomPity,
  nextSeedPity,
  ROOM_EV_MAX,
  ROOM_PITY,
  ROOM_SPIN_COST,
  ROOM_WIN_MAX,
  roomEv,
  roomLineup,
  roomTable,
  SEED_PITY,
  SEED_SPIN_COST,
  SEED_SYMBOLS,
  SEED_TABLE,
  spinRoom,
  spinSeed,
  spinsLeft,
  SLOT_SPINS_PER_DAY,
  freshSlots,
} from "./rules";

test("씨앗 슬롯: 확률표의 합은 1보다 작고(남는 것이 꽝), 희귀 여섯이 모두 있다", () => {
  const total = SEED_TABLE.reduce((s, r) => s + r.p, 0);
  assert.ok(total > 0.4 && total < 1, `당첨 합 ${total}`);
  const rares = SEED_TABLE.filter((r) => r.outcome.kind === "rare");
  assert.deepEqual(new Set(rares.map((r) => (r.outcome as { rare: string }).rare)), new Set(RARE_SEEDS.map((r) => r.id)));
});

test("씨앗 슬롯: 상점 값으로 친 기대값이 한 번 값보다 작다(희귀 씨앗은 업적 씨앗 값으로)", () => {
  const value = (o: (typeof SEED_TABLE)[number]["outcome"]) =>
    o.kind === "rare" ? SEED_PRICE.flagship : o.kind === "triple" ? SEED_PRICE[o.tier] * o.n : o.kind === "pair" ? SEED_PRICE.sprout : 0;
  const ev = SEED_TABLE.reduce((s, r) => s + r.p * value(r.outcome), 0);
  assert.ok(ev < SEED_SPIN_COST, `기대값 ${ev.toFixed(1)} < ${SEED_SPIN_COST}`);
});

test("씨앗 슬롯: 릴은 결과 그대로 — 꽝은 셋이 다르고, 짝은 일반 그림 둘, 당첨은 셋이 같다", () => {
  const rand = rng(7);
  const seen = { rare: 0, triple: 0, pair: 0, miss: 0 };
  for (let i = 0; i < 20000; i++) {
    const s = spinSeed(0, rand);
    seen[s.outcome.kind]++;
    const [a, b, c] = s.reels;
    if (s.outcome.kind === "miss") assert.ok(a !== b && b !== c && a !== c, "꽝은 셋이 모두 다르다");
    else if (s.outcome.kind === "pair") {
      const pair = a === b ? a : a === c ? a : b;
      assert.equal([a, b, c].filter((x) => x === pair).length, 2, "짝은 둘");
      assert.ok(SEED_SYMBOLS.slice(0, 3).includes(pair), "짝은 일반 그림 — 희귀 그림 둘로 '거의 당첨'을 만들지 않는다");
    } else assert.ok(a === b && b === c, "당첨은 셋이 같다");
  }
  // 공개한 확률과 맞는가(넉넉한 오차).
  assert.ok(Math.abs(seen.rare / 20000 - 0.02) < 0.006, `희귀 ${seen.rare}`);
  assert.ok(Math.abs(seen.miss / 20000 - 0.49) < 0.02, `꽝 ${seen.miss}`);
});

test("씨앗 슬롯 천장: SEED_PITY번째는 반드시 희귀 씨앗, 희귀가 나오면 0으로", () => {
  const rand = rng(3);
  const s = spinSeed(SEED_PITY - 1, rand);
  assert.equal(s.outcome.kind, "rare");
  assert.ok(s.pity);
  assert.equal(nextSeedPity(SEED_PITY - 1, s), 0);
  assert.equal(nextSeedPity(5, { outcome: { kind: "miss" }, reels: ["sprout", "common", "flagship"], pity: false }), 6);
});

test("하루 상한: 날이 바뀌면 다시", () => {
  const l = { ...freshSlots(), day: "2026-11-26", seed: SLOT_SPINS_PER_DAY, room: 3 };
  assert.equal(spinsLeft(l, "seed", "2026-11-26"), 0);
  assert.equal(spinsLeft(l, "room", "2026-11-26"), SLOT_SPINS_PER_DAY - 3);
  assert.equal(spinsLeft(l, "seed", "2026-11-27"), SLOT_SPINS_PER_DAY);
});

test("희귀 씨앗: 심은 포기는 정해진 변이가 반드시 붙는다(무지개는 셋이 겹쳐 무지개까지)", () => {
  for (const r of RARE_SEEDS) {
    for (let i = 0; i < 30; i++) {
      const plant: Plant = { id: `p${i}`, speciesId: "a:x", plantedAt: 0, ripeAt: 1, speed: 1, harvests: i, rare: r.id };
      const got = rollMutations(plant, "normal");
      for (const m of r.mutations) assert.ok(got.includes(m), `${r.id}: ${m}`);
      if (r.id === "rs-rainbow") assert.ok(got.includes("rainbow"));
    }
  }
});

test("아이템 슬롯: 진열은 상점의 가구·벽지·바닥재·음원, 기대값은 낸 잼의 90% 아래", () => {
  const room = freshRoom("x");
  const pool = roomPool(room);
  for (const kind of ["furniture", "wallpaper", "flooring", "music"] as const) assert.ok(pool.some((p) => p.kind === kind), kind);
  for (let day = 0; day < 60; day++) {
    const lineup = roomLineup(pool, rng(day + 1));
    assert.equal(lineup.length, 6);
    assert.equal(new Set(lineup.map((x) => x.id)).size, 6, "겹치지 않는다");
    const table = roomTable(lineup);
    const w = table.reduce((s, r) => s + r.p, 0);
    assert.ok(w <= ROOM_WIN_MAX + 1e-9, `당첨 합 ${w}`);
    assert.ok(roomEv(table) <= ROOM_SPIN_COST * ROOM_EV_MAX + 1e-6, `기대값 ${roomEv(table)}`);
    const cheap = [...table].sort((a, b) => a.price - b.price);
    assert.ok(cheap[0].p >= cheap[cheap.length - 1].p, "싼 것이 더 자주");
  }
  // 진열 여섯 + 카르텔 카드 칸(아직 하나도 없으니).
  assert.ok(todaysRoomTable(room, Date.UTC(2026, 10, 26)).length === 7);
});

test("아이템 슬롯: 이미 가진 벽지·바닥재·음원과 가진 수 상한에 닿은 가구는 진열에 오르지 않는다", () => {
  const base = freshRoom("x");
  const pool = roomPool(base);
  const wall = pool.find((p) => p.kind === "wallpaper")!;
  const furn = pool.find((p) => p.kind === "furniture")!;
  const song = pool.find((p) => p.kind === "music")!;
  const room = { ...base, owned: { ...base.owned, [wall.id]: 1, [furn.id]: 9 }, music: [song.id] as typeof base.music };
  const ids = new Set(roomPool(room).map((p) => p.id));
  assert.ok(!ids.has(wall.id) && !ids.has(furn.id) && !ids.has(song.id));
});

test("아이템 슬롯: 당첨은 셋이 같고 그 진열이 상품, 꽝은 셋이 같지 않다, 천장", () => {
  const table = roomTable(roomLineup(roomPool(freshRoom("x")), rng(9)));
  const rand = rng(11);
  let wins = 0;
  for (let i = 0; i < 20000; i++) {
    const s = spinRoom(table, 0, rand);
    const [a, b, c] = s.reels;
    if (s.prize) {
      wins++;
      assert.ok(a === b && b === c);
      assert.equal(table[a].id, s.prize.id);
    } else assert.ok(!(a === b && b === c), "꽝은 셋이 같지 않다");
  }
  const w = table.reduce((s, r) => s + r.p, 0);
  assert.ok(Math.abs(wins / 20000 - w) < 0.015, `당첨 ${wins} · 표 ${w}`);
  const forced = spinRoom(table, ROOM_PITY - 1, rand);
  assert.ok(forced.prize && forced.pity);
  assert.equal(nextRoomPity(ROOM_PITY - 1, forced), 0);
});

test("퀴즈 찬스: 하루 셋, 날이 바뀌면 다시", async () => {
  const { chancesLeft, ofToday, SLOT_CHANCES_PER_DAY } = await import("./rules");
  const l = { ...freshSlots(), day: "2026-11-26", chance: 2, freeSeed: 1 };
  assert.equal(chancesLeft(l, "2026-11-26"), SLOT_CHANCES_PER_DAY - 2);
  assert.equal(chancesLeft(l, "2026-11-27"), SLOT_CHANCES_PER_DAY);
  assert.equal(ofToday(l, "2026-11-27").freeSeed, 1, "무료 한 번은 날을 넘어 남는다");
});

test("잼 항아리: 한 번에 4·7(firestore.rules와 같다), 몫은 나누되 상한", async () => {
  const { readFileSync } = await import("node:fs");
  const { potShare, potReward, POT_SHARE_MAX, POT_GIVE_MAX, ROOM_SPIN_COST: room } = await import("./rules");
  assert.equal(potShare(SEED_SPIN_COST), 4);
  assert.equal(potShare(room), 7);
  const rules = readFileSync("firestore.rules", "utf8");
  assert.ok(rules.includes("in [4, 7]") && rules.includes(`request.resource.data.j <= ${POT_GIVE_MAX}`), "규칙의 값과 같다");
  assert.equal(potReward(1000, 4), 250);
  assert.equal(potReward(100000, 2), POT_SHARE_MAX);
  assert.equal(potReward(10, 0), 10, "함께한 사람 0이면 1로 나눈다");
});

test("뽑기 기계: 손님은 한 방에 하루 한 번·하루 다섯 방, 주인은 손님마다 10·하루 50", async () => {
  const { guestCanSpin, hostJam, GUEST_SPINS_PER_DAY, HOST_JAM_DAY } = await import("./rules");
  const day = "2026-11-26";
  const l = { ...freshSlots(), day, guestRooms: ["gaaaaaaaa1"] };
  assert.equal(guestCanSpin(l, "gaaaaaaaa1", day), "done-here");
  assert.equal(guestCanSpin(l, "gbbbbbbbb1", day), "ok");
  assert.equal(guestCanSpin({ ...l, guestRooms: Array.from({ length: GUEST_SPINS_PER_DAY }, (_, i) => `g${i}xxxxxxx1`) }, "gzzzzzzzz1", day), "done-today");
  assert.equal(guestCanSpin(l, "gaaaaaaaa1", "2026-11-27"), "ok", "날이 바뀌면 다시");
  const a = hostJam(freshSlots(), ["u1", "u2", "u2"], day)!;
  assert.equal(a.jam, 20);
  const b = hostJam(a.ledger, ["u1", "u3", "u4", "u5", "u6", "u7"], day)!;
  assert.equal(a.jam + b.jam, HOST_JAM_DAY, "하루 50까지");
  assert.equal(hostJam(b.ledger, ["u3"], day), null, "본 손님은 다시 세지 않는다");
});

test("희귀종 수집가 칭호: 거둔 희귀 씨앗 종류 2·4·6", async () => {
  const { titleLevels } = await import("../rules");
  const base = { dex: {}, raids: [] };
  assert.equal(titleLevels({ ...base, rareDex: ["rs-golden"] }).rare, 0);
  assert.equal(titleLevels({ ...base, rareDex: RARE_SEEDS.slice(0, 4).map((r) => r.id) }).rare, 2);
  assert.equal(titleLevels({ ...base, rareDex: RARE_SEEDS.map((r) => r.id) }).rare, 3);
});

test("카르텔 카드 칸: 아직 없는 카드가 있을 때만, 따로 2%, 천장에는 들지 않는다", async () => {
  const { CARTEL_P, CARTEL_ROW_ID, withCartelRow } = await import("./rules");
  const { CARTEL_FURNITURE, missingCartelCards } = await import("../room/cartels");
  const base = freshRoom("x");
  const all = Object.fromEntries(CARTEL_FURNITURE.map((f) => [f.id, 1]));
  assert.equal(missingCartelCards(base.owned).length, 12);
  assert.equal(missingCartelCards({ ...base.owned, ...all }).length, 0);
  const t = Date.UTC(2026, 10, 27);
  const full = todaysRoomTable({ ...base, owned: { ...base.owned, ...all } }, t);
  assert.ok(!full.some((r) => r.kind === "cartel"), "다 모으면 칸이 없다");
  const table = todaysRoomTable(base, t);
  const row = table.find((r) => r.id === CARTEL_ROW_ID)!;
  assert.equal(row.p, CARTEL_P);
  assert.equal(row.price, 0);
  // 진열의 당첨 합·기대값은 카르텔 칸과 따로 본다.
  const shelf = table.filter((r) => r.kind !== "cartel");
  assert.ok(shelf.reduce((s, r) => s + r.p, 0) <= ROOM_WIN_MAX + 1e-9);
  assert.ok(roomEv(table) <= ROOM_SPIN_COST * ROOM_EV_MAX + 1e-6);
  assert.deepEqual(withCartelRow([], 12), [], "진열이 없으면 칸도 없다");
  const rand = rng(5);
  for (let i = 0; i < 2000; i++) {
    const forced = spinRoom(table, ROOM_PITY - 1, rand);
    assert.ok(forced.prize && forced.prize.kind !== "cartel", "천장은 진열에서만");
  }
  let cartels = 0;
  for (let i = 0; i < 50000; i++) if (spinRoom(table, 0, rand).prize?.kind === "cartel") cartels++;
  assert.ok(Math.abs(cartels / 50000 - CARTEL_P) < 0.004, `카르텔 칸 ${cartels}`);
});
