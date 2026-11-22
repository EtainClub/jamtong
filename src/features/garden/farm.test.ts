/**
 * 텃밭 가꾸기 2 — 첫 수확 선물·돌려짓기·잼 공방(docs/garden-farm-v2.md). `pnpm garden:test`.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  baseJam,
  fruitValue,
  JAR_STYLE,
  jarFirstSeed,
  jarMutations,
  jarRegion,
  jarRegions,
  REGION_ORDER,
  ROTATION,
  rotationLabel,
  rotationOf,
} from "./rules";
import { publicRoom, roomFromPublic } from "./room/rules";
import type { Fruit, Species, Tier } from "./types";

const sp = (id: string, region: string, tier: Tier = "common", seed = 1): Species => ({
  id, tier, title: id, href: `/${id}`, notes: [], seed, region, links: [],
});
const fruit = (id: string, speciesId: string, more: Partial<Fruit> = {}): Fruit => ({
  id, speciesId, noteId: "", mutations: [], harvestedAt: 0, ...more,
});

const A = sp("p:a", "welfare");
const B = sp("p:b", "welfare");
const C = sp("p:c", "welfare");
const E = sp("p:e", "economy");
const BY_ID = new Map([A, B, C, E].map((s) => [s.id, s]));

test("돌려짓기: 같은 품종은 연작 −30%, 다른 분야는 +10%, 같은 분야 다른 품종·첫 칸은 0", () => {
  assert.equal(rotationOf(null, A), 0);
  assert.equal(rotationOf({ s: "p:a", r: "welfare" }, A), ROTATION.same);
  assert.equal(rotationOf({ s: "p:b", r: "welfare" }, A), 0);
  assert.equal(rotationOf({ s: "p:e", r: "economy" }, A), ROTATION.other);
  assert.equal(rotationLabel(0.1), "돌려짓기 +10%");
  assert.equal(rotationLabel(-0.3), "연작 −30%");
  assert.equal(rotationLabel(undefined), "");
});

test("돌려짓기는 잼에 더하기로 붙는다 — 기본 × 변이 × (1 + 꽃밭 + 돌려짓기)", () => {
  const base = baseJam(A);
  assert.equal(fruitValue(fruit("f", A.id), A), base);
  assert.equal(fruitValue(fruit("f", A.id, { rot: 0.1 }), A), Math.round(base * 1.1));
  assert.equal(fruitValue(fruit("f", A.id, { rot: -0.3 }), A, 0.2), Math.round(base * 0.9));
  assert.equal(fruitValue(fruit("f", A.id, { rot: -0.3, mutations: ["golden"] }), A), Math.round(base * 10 * 0.7));
});

test("잼 공방: 같은 분야의 서로 다른 품종 셋이어야 병이 된다", () => {
  assert.equal(jarRegion([fruit("1", "p:a"), fruit("2", "p:b"), fruit("3", "p:c")], BY_ID), "welfare");
  assert.equal(jarRegion([fruit("1", "p:a"), fruit("2", "p:a"), fruit("3", "p:c")], BY_ID), null, "같은 품종 둘");
  assert.equal(jarRegion([fruit("1", "p:a"), fruit("2", "p:b"), fruit("3", "p:e")], BY_ID), null, "분야가 섞였다");
  assert.equal(jarRegion([fruit("1", "p:a"), fruit("2", "p:b")], BY_ID), null, "둘뿐");
  const basket = [fruit("1", "p:a"), fruit("2", "p:a"), fruit("3", "p:b"), fruit("4", "p:c"), fruit("5", "p:e")];
  assert.deepEqual(jarRegions(basket, BY_ID), ["welfare"]);
});

test("잼 공방: 재료의 변이가 병으로 옮겨 가고, 셋이 겹치면 무지개", () => {
  assert.deepEqual(jarMutations([fruit("1", "p:a", { mutations: ["golden"] }), fruit("2", "p:b"), fruit("3", "p:c", { mutations: ["golden"] })]), ["golden"]);
  assert.deepEqual(
    jarMutations([fruit("1", "p:a", { mutations: ["moist"] }), fruit("2", "p:b", { mutations: ["shine"] }), fruit("3", "p:c", { mutations: ["golden", "rainbow"] })]),
    ["golden", "moist", "shine", "rainbow"],
  );
});

test("잼 공방: 분야마다 병 모양이 있고, 처음 만든 분야의 선물은 그 분야 대표 씨앗(없으면 아무 대표)", () => {
  assert.deepEqual(Object.keys(JAR_STYLE).sort(), [...REGION_ORDER].sort());
  const catalog = [sp("a:w1", "welfare", "flagship"), sp("a:e1", "economy", "flagship"), sp("w:x", "words", "sprout")];
  assert.equal(jarFirstSeed("welfare", catalog, "닉")?.id, "a:w1");
  assert.equal(jarFirstSeed("words", catalog, "닉")?.tier, "flagship", "언행은 대표 품종이 없다");
  assert.equal(jarFirstSeed("words", catalog, "닉")?.id, jarFirstSeed("words", catalog, "닉")?.id, "같은 정원·분야면 같은 씨앗");
});

test("잼 병은 공개 방에 분야 id와 변이로 실리고, 손님 방은 분야 표에 있는 것만 그린다", async () => {
  const { freshRoom, addShown } = await import("./room/rules");
  const added = addShown(freshRoom(), { id: "j:1", kind: "jar", species: "welfare", mut: ["golden"] })!;
  assert.ok(added.at, "책상이 없어도 바닥에 놓인다");
  const pub = publicRoom(added.room);
  assert.deepEqual({ k: (pub.placed[0] as { k: string }).k, s: (pub.placed[0] as { s: string }).s, m: (pub.placed[0] as { m: string[] }).m }, { k: "jar", s: "welfare", m: ["golden"] });
  const back = roomFromPublic({ ...pub, placed: [...pub.placed, { ...pub.placed[0], s: "<b>" }] }, new Map());
  assert.deepEqual(back.shown.map((s) => [s.kind, s.species, s.mut]), [["jar", "welfare", ["golden"]]]);
});

test("정원: 처음 거두면 물뿌리개를 방에 놓고, 같은 칸에 같은 품종을 또 심으면 연작, 열매 셋으로 병", async () => {
  const { useGarden } = await import("./store");
  const before = useGarden.getState().data;
  try {
    const catalog = [A, B, C, E, sp("a:w1", "welfare", "flagship", 7)];
    useGarden.setState({ data: null });
    useGarden.getState().boot(catalog);
    const g = useGarden.getState();
    const d = g.data!;
    // 시작 새싹은 빈 카탈로그 품종이 없어 없을 수 있다 — 직접 심고 익힌다.
    useGarden.setState({ data: { ...d, dex: {}, beds: d.beds.map(() => null), seeds: { "p:a": 2, "p:e": 1 }, room: { ...d.room, owned: {}, placed: [] } } });
    g.plant(0, A, "normal");
    const ripe = (bed: number) => {
      const cur = useGarden.getState().data!;
      useGarden.setState({ data: { ...cur, beds: cur.beds.map((p, i) => (i === bed && p ? { ...p, ripeAt: 0 } : p)) } });
    };
    ripe(0);
    const first = g.harvest(0, A, "normal")!;
    assert.deepEqual(first.gift, { id: "can", placed: true });
    assert.ok(useGarden.getState().data!.room.placed.some((p) => p.it === "can"));
    assert.deepEqual(useGarden.getState().data!.plotLog?.[0], { s: "p:a", r: "welfare" });
    // 같은 칸에 같은 품종 — 연작.
    g.plant(0, A, "normal");
    assert.equal(useGarden.getState().data!.beds[0]?.rot, ROTATION.same);
    ripe(0);
    const second = g.harvest(0, A, "normal")!;
    assert.equal(second.rot, ROTATION.same);
    assert.equal(second.gift, undefined, "선물은 처음 한 번");
    // 다른 분야 — 돌려짓기.
    g.plant(0, E, "normal");
    assert.equal(useGarden.getState().data!.beds[0]?.rot, ROTATION.other);
    // 잼 공방 — 바구니에 같은 분야 서로 다른 셋.
    const cur = useGarden.getState().data!;
    useGarden.setState({ data: { ...cur, basket: [fruit("x1", "p:a", { mutations: ["golden"] }), fruit("x2", "p:b"), fruit("x3", "p:c"), ...cur.basket] } });
    const byId = new Map(catalog.map((s) => [s.id, s]));
    assert.equal(g.makeJar(["x1", "x2", "x1"], byId), null, "같은 열매 둘");
    const jar = g.makeJar(["x1", "x2", "x3"], byId)!;
    assert.equal(jar.region, "welfare");
    assert.equal(jar.seed?.id, "a:w1", "처음 만든 분야 — 대표 씨앗");
    const after = useGarden.getState().data!;
    assert.equal(after.basket.some((f) => ["x1", "x2", "x3"].includes(f.id)), false);
    assert.ok(after.room.shown.some((s) => s.kind === "jar" && s.species === "welfare" && s.mut?.includes("golden")));
    assert.equal(after.seeds["a:w1"], 1);
    assert.deepEqual(after.jars, ["welfare"]);
  } finally {
    useGarden.setState({ data: before });
  }
});

test("올려 두는 것(잼 병·라디오)은 책상·탁자 위가 먼저, 없으면 바닥", async () => {
  const { freshRoom, addShown, place } = await import("./room/rules");
  const withDesk = place({ ...freshRoom(), owned: { desk: 1 } }, "desk", { x: 4, y: 0, dir: 0 })!;
  const added = addShown(withDesk, { id: "j:1", kind: "jar", species: "economy" })!;
  const pos = added.room.placed.find((p) => p.it === "j:1")!.pos as { on?: number };
  assert.equal(pos.on, 0, "책상(0번) 위");
});

test("마당 꾸미기: 잼으로 사서 정해진 자리에 놓고, 가진 수만큼만, 옛 장부·틀린 값은 바로잡는다", async () => {
  const { buyYardItem, freshYard, normalizeYard, setYardSlot, yardLeft, YARD_OWN_MAX, YARD_SLOTS } = await import("./yard");
  let yard = freshYard();
  assert.equal(yard.slots.length, YARD_SLOTS);
  assert.equal(buyYardItem(yard, 299, "scarecrow"), "jam");
  assert.equal(buyYardItem(yard, 9999, "nope"), "unknown");
  const bought = buyYardItem(yard, 300, "scarecrow");
  assert.ok(typeof bought !== "string" && bought.jam === 0);
  yard = (bought as { yard: typeof yard }).yard;
  yard = setYardSlot(yard, 0, "scarecrow")!;
  assert.equal(yardLeft(yard, "scarecrow"), 0);
  assert.equal(setYardSlot(yard, 1, "scarecrow"), null, "하나뿐이라 두 자리에 못 놓는다");
  assert.deepEqual(setYardSlot(yard, 0, null)?.slots[0], null, "치우면 다시 놓을 수 있다");
  assert.equal(setYardSlot(yard, YARD_SLOTS, "scarecrow"), null, "없는 자리");
  let many = yard;
  for (let i = 0; i < YARD_OWN_MAX; i++) {
    const out = buyYardItem(many, 99_999, "flowerbed");
    if (typeof out !== "string") many = out.yard;
  }
  assert.equal(buyYardItem(many, 99_999, "flowerbed"), "full");
  const fixed = normalizeYard({ owned: { scarecrow: 1, evil: 3, well: 99 }, slots: ["scarecrow", "scarecrow", "evil", "well", null, "extra"] });
  assert.deepEqual(fixed.owned, { scarecrow: 1, well: YARD_OWN_MAX });
  assert.deepEqual(fixed.slots, ["scarecrow", null, null, "well", null]);
  assert.deepEqual(normalizeYard(undefined), freshYard());
});
