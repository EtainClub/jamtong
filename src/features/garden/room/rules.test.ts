/**
 * 내 방의 규칙 — `pnpm garden:test`.
 * 칸 모델, 놓기·옮기기·넣기, 방 넓히기, 주간 진열, 전시·액자, 공개 문서 압축을 본다.
 * 공개 방의 상한은 firestore.rules의 publicRoom()과 짝이 맞아야 한다.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import type { Fruit, Species } from "../types";
import { FRAME_BLANK, FURNITURE, FURNITURE_BY_ID, MOODS } from "./catalog";
import {
  addShown,
  applySurface,
  buyItem,
  buyTrophyItem,
  canPlace,
  hasSurface,
  onSale,
  frameNote,
  freshRoom,
  kstWeek,
  move,
  normalizeRoom,
  openSlots,
  place,
  PUBLIC_ID_MAX,
  PUBLIC_PLACED_MAX,
  publicRoom,
  ROOM_SIZES,
  roomFromPublic,
  shownFromFruit,
  stow,
  stowedCount,
  upgradeRoom,
  validRoom,
  weekLeft,
  weeklyPicks,
  type RoomData,
} from "./rules";

const KST = 9 * 3_600_000;
/** 2026-11-16(월) 0시, 한국 시각. */
const MONDAY = Date.UTC(2026, 10, 16) - KST;
const DAY = 86_400_000;

const species = (id: string, tier: Species["tier"] = "sprout"): Species => ({
  id,
  tier,
  title: id,
  href: "/x",
  notes: [{ id: `${id}#n1`, kind: "FACT", text: "글" }],
  seed: 1,
  region: "words",
  links: [],
});

const owning = (owned: Record<string, number>, over: Partial<RoomData> = {}): RoomData => ({ ...freshRoom(), owned, ...over });

test("가구표: id가 겹치지 않고, 값과 크기가 설계 범위 안이다", () => {
  assert.equal(new Set(FURNITURE.map((f) => f.id)).size, FURNITURE.length);
  const jam = FURNITURE.filter((f) => !f.cur);
  assert.ok(jam.length >= 25 && jam.length <= 40);
  // 🏆 전리품: 뿌리 조각 5–30, 8–10개(docs/garden-miniroom.md §4.2·§7.4). 잼 상점에는 나오지 않는다.
  const roots = FURNITURE.filter((f) => f.cur === "root");
  assert.ok(roots.length >= 8 && roots.length <= 10, `${roots.length}`);
  for (const f of roots) {
    assert.ok(f.price >= 5 && f.price <= 30, f.id);
    assert.equal(onSale(f, 0), false, `${f.id}는 잼으로 사지 못한다`);
  }
  for (const f of FURNITURE) {
    assert.ok(!f.id.includes(":"), `가구 id에 ':'가 있으면 전시품과 헷갈린다: ${f.id}`);
    assert.ok(f.id.length <= PUBLIC_ID_MAX);
    if (f.kind === "window") assert.equal(f.size, 2);
    assert.ok(f.price >= 0 && f.price <= 2000, f.id);
  }
  assert.equal(FURNITURE_BY_ID.get(FRAME_BLANK)?.price, 30);
  assert.equal(MOODS.length, 12);
  assert.equal(FURNITURE.filter((f) => f.weekly).length >= 4, true);
});

test("방 크기와 넓히기 값: 6 → 8(1,500) → 10(5,000)", () => {
  assert.deepEqual(ROOM_SIZES.map((s) => [s.width, s.price]), [[6, 0], [8, 1500], [10, 5000]]);
  const a = upgradeRoom(freshRoom(), 1499);
  assert.equal(a, null);
  const b = upgradeRoom(freshRoom(), 1500)!;
  assert.equal(b.room.size, 1);
  assert.equal(b.jam, 0);
  const c = upgradeRoom(b.room, 5000)!;
  assert.equal(c.room.size, 2);
  assert.equal(upgradeRoom(c.room, 99999), null);
});

test("벽 물건은 벽 줄에만, 바닥 물건은 바닥 두 줄에만", () => {
  const room = owning({ clock: 1, chair: 1 });
  assert.ok(canPlace(room, "clock", "w0"));
  assert.ok(!canPlace(room, "clock", "b0"));
  assert.ok(canPlace(room, "chair", "b0"));
  assert.ok(canPlace(room, "chair", "f5"));
  assert.ok(!canPlace(room, "chair", "w0"));
  assert.ok(!canPlace(room, "chair", "f6"), "작은 방은 6칸");
  assert.ok(!canPlace(room, FRAME_BLANK, "w0"), "빈 액자틀은 놓지 않는다");
  assert.ok(!canPlace(room, "wp-cream", "w0"));
});

test("2칸짜리는 오른쪽 칸까지 쓰고, 겹치지 않는다", () => {
  let room = owning({ bed: 1, chair: 1 });
  assert.ok(!canPlace(room, "bed", "b5"), "오른쪽 끝에서는 넘친다");
  room = place(room, "bed", "b1")!;
  assert.ok(room);
  assert.ok(!canPlace(room, "chair", "b2"));
  assert.ok(!canPlace(room, "chair", "b1"));
  assert.ok(canPlace(room, "chair", "b3"));
  assert.ok(!openSlots(room, "chair").includes("b2"));
});

test("가진 수만큼만 놓고, 넣으면 보관함으로 돌아온다", () => {
  let room = owning({ chair: 1 });
  assert.equal(stowedCount(room, "chair"), 1);
  room = place(room, "chair", "f0")!;
  assert.equal(stowedCount(room, "chair"), 0);
  assert.equal(place(room, "chair", "f1"), null, "하나뿐이다");
  room = stow(room, "f0");
  assert.equal(stowedCount(room, "chair"), 1);
  assert.equal(room.placed.length, 0);
});

test("옮기기는 제 자리를 비운 셈 치고 본다", () => {
  let room = place(owning({ bed: 1 }), "bed", "b0")!;
  room = move(room, "b0", "b1")!;
  assert.deepEqual(room.placed, [{ at: "b1", it: "bed" }]);
  assert.equal(move(room, "b1", "w0"), null);
  assert.equal(move(room, "x9", "b2"), null);
});

test("저장할 방 검사: 겹침·가진 수 넘침·가지지 않은 벽지를 받지 않는다", () => {
  const ok = place(owning({ chair: 1 }), "chair", "f0")!;
  assert.ok(validRoom(ok));
  assert.ok(!validRoom({ ...ok, placed: [...ok.placed, { at: "f1", it: "chair" }] }));
  assert.ok(!validRoom({ ...ok, wall: "wp-brick" }));
  assert.ok(validRoom({ ...ok, wall: "wp-brick", owned: { ...ok.owned, "wp-brick": 1 } }));
  assert.ok(!validRoom({ ...owning({ bed: 2 }), placed: [{ at: "b0", it: "bed" }, { at: "b1", it: "bed" }] }));
});

test("벽지·바닥재는 하나면 되고, 가진 것만 바른다", () => {
  const t = MONDAY;
  const bought = buyItem(freshRoom(), 1000, "wp-brick", t);
  assert.ok(typeof bought === "object");
  assert.equal(bought.jam, 650);
  assert.equal(buyItem(bought.room, 1000, "wp-brick", t), "owned");
  assert.equal(applySurface(freshRoom(), "wp-brick"), null);
  assert.equal(applySurface(bought.room, "wp-brick")?.wall, "wp-brick");
  assert.equal(applySurface(bought.room, "fl-wood")?.floor, "fl-wood", "처음 것은 늘 가졌다");
  assert.equal(buyItem(freshRoom(), 10, "chair", t), "jam");
  assert.equal(buyItem(freshRoom(), 10, "nope", t), "unknown");
  assert.equal(buyItem(freshRoom(), 10, "wp-cream", t), "off-sale", "값 0인 것은 팔지 않는다");
});

test("주간 진열: 월요일(한국 시각)에 바뀌고, 그 주 안에서는 같다", () => {
  assert.equal(kstWeek(MONDAY), kstWeek(MONDAY + 6 * DAY + DAY - 1));
  assert.equal(kstWeek(MONDAY - 1) + 1, kstWeek(MONDAY));
  assert.deepEqual(weeklyPicks(MONDAY), weeklyPicks(MONDAY + 3 * DAY));
  assert.equal(weeklyPicks(MONDAY).length, 4);
  assert.equal(weekLeft(MONDAY), 7 * DAY);
  assert.equal(weekLeft(MONDAY + DAY), 6 * DAY);
  const off = FURNITURE.find((f) => f.weekly && !weeklyPicks(MONDAY).includes(f.id))!;
  assert.equal(buyItem(freshRoom(), 99999, off.id, MONDAY), "off-sale");
  const on = weeklyPicks(MONDAY)[0];
  assert.equal(typeof buyItem(freshRoom(), 99999, on, MONDAY), "object");
});

test("전시: 열매가 화분·나무가 되고, 빈 칸이 있으면 바로 놓인다", () => {
  const fruit: Fruit = { id: "abc-0", speciesId: "w:x", noteId: "", mutations: ["golden"], harvestedAt: 0 };
  const pot = shownFromFruit(fruit, species("w:x"));
  assert.deepEqual(pot, { id: "p:abc-0", kind: "pot", species: "w:x", mut: ["golden"] });
  assert.equal(shownFromFruit(fruit, species("a:y", "perennial")).kind, "tree");
  const added = addShown(freshRoom(), pot)!;
  assert.equal(added.at, "b0");
  assert.equal(addShown(added.room, pot), null, "같은 전시품은 한 번");
  // 바닥이 가득 차면 보관함에 둔다.
  const full: RoomData = { ...freshRoom(), owned: { chair: 12 }, placed: ["b", "f"].flatMap((r) => [0, 1, 2, 3, 4, 5].map((i) => ({ at: `${r}${i}`, it: "chair" }))) };
  const stowed = addShown(full, pot)!;
  assert.equal(stowed.at, null);
  assert.equal(stowedCount(stowed.room, pot.id), 1);
});

test("액자: 빈 틀을 쓰거나 잼 30으로 사서 건다. 쪽지 하나에 액자 하나", () => {
  const none = frameNote(freshRoom(), 29, "w:x#n1", "w:x");
  assert.equal(none, null);
  const bought = frameNote(freshRoom(), 30, "w:x#n1", "w:x")!;
  assert.equal(bought.jam, 0);
  assert.equal(bought.bought, true);
  assert.equal(bought.at, "w0");
  assert.equal(frameNote(bought.room, 100, "w:x#n1", "w:x"), null);
  const used = frameNote(owning({ [FRAME_BLANK]: 1 }), 0, "w:x#n1", "w:x")!;
  assert.equal(used.bought, false);
  assert.equal(used.room.owned[FRAME_BLANK], undefined, "다 쓴 틀은 지운다");
});

test("공개 방: 글은 싣지 않고, 상한을 넘지 않는다", () => {
  let room = owning({ chair: 9, clock: 1 });
  room = place(room, "clock", "w0")!;
  room = frameNote(room, 30, "w:x#n1", "w:x")!.room;
  const pub = publicRoom(room);
  assert.equal(pub.placed.length, 2);
  assert.ok(!JSON.stringify(pub).includes("글"));
  assert.ok(pub.placed.some((p) => "k" in p && p.k === "frame" && p.n === "w:x#n1" && p.s === "w:x"));
  assert.ok(!JSON.stringify(pub).includes("undefined"));
  const many: RoomData = { ...room, placed: Array.from({ length: 60 }, (_, i) => ({ at: `b${i}`, it: "chair" })) };
  assert.equal(publicRoom(many).placed.length, PUBLIC_PLACED_MAX);
});

test("남의 방은 표에 있는 것만 그린다", () => {
  const byId = new Map([["w:x", species("w:x")]]);
  const room = roomFromPublic(
    {
      size: 7,
      wall: "<script>",
      floor: "fl-grass",
      mood: "nope",
      placed: [
        { a: "w0", i: "clock" },
        { a: "w1", i: "unknown-thing" },
        { a: "b0", i: "bed" },
        { a: "b1", i: "chair" }, // 침대와 겹친다
        { a: "f0", k: "pot", s: "w:x", m: ["golden", "evil"] },
        { a: "f1", k: "pot", s: "w:missing" },
        { a: "w2", k: "frame", s: "w:x", n: "w:x#n1" },
        { a: "w3", k: "frame", s: "w:x", n: "w:x#forged" },
        { a: "f2", k: "trophy", s: "w:x" },
      ],
    },
    byId,
  );
  assert.equal(room.size, 0);
  assert.equal(room.wall, "wp-cream");
  assert.equal(room.floor, "fl-grass");
  assert.equal(room.mood, MOODS[0].id);
  assert.deepEqual(room.placed.map((p) => p.at), ["w0", "b0", "f0", "w2"]);
  assert.deepEqual(room.shown.find((s) => s.kind === "pot")?.mut, ["golden"]);
});

test("옛 정원에도 방이 생긴다", () => {
  assert.deepEqual(normalizeRoom(undefined), freshRoom());
  const odd = normalizeRoom({ size: 5 as 0, placed: [{ at: "w0", it: "clock" }, null as never] });
  assert.equal(odd.size, 0);
  assert.equal(odd.placed.length, 1);
});

test("firestore.rules의 publicRoom()이 같은 상한을 쓴다", () => {
  const rules = readFileSync("firestore.rules", "utf8");
  const fn = rules.slice(rules.indexOf("function publicRoom("));
  assert.ok(fn.length > 0 && rules.includes("publicRoom(d.room)"));
  assert.match(fn, new RegExp(`r\\.placed\\.size\\(\\) <= ${PUBLIC_PLACED_MAX}`));
  for (const key of ["wall", "floor", "mood"]) assert.match(fn, new RegExp(`r\\.${key}\\.size\\(\\) <= ${PUBLIC_ID_MAX}`));
  assert.match(fn, new RegExp(`r\\.size <= ${ROOM_SIZES.length - 1}`));
  // 공개 문서의 키 목록에 room이 있다(1촌 단계가 뒤에 키를 더했다 — ilchon/rules.test.ts).
  assert.match(rules, /hasOnly\(\['ownerUid', 'nick', 'beds', 'dex', 'golden', 'rainbow', 'titles', 'room', [^\]]*'updatedAt'\]\)/);
});

test("악초 박제: 벽에도 바닥에도, 공개 방에는 종류 id만, 모르는 종류는 그리지 않는다", () => {
  const added = addShown(freshRoom(), { id: "t:troll", kind: "trophy", species: "troll" })!;
  assert.ok(added.at, "빈 칸에 바로 놓인다");
  const room = stow(added.room, added.at!);
  assert.ok(canPlace(room, "t:troll", "w0"), "벽");
  assert.ok(canPlace(room, "t:troll", "f3"), "바닥");
  const onWall = place(room, "t:troll", "w2")!;
  assert.ok(validRoom(onWall));
  const pub = publicRoom(onWall);
  assert.deepEqual(pub.placed, [{ a: "w2", k: "trophy", s: "troll" }]);
  const back = roomFromPublic({ ...pub, placed: [...pub.placed, { a: "f0", k: "trophy", s: "ghost" }] }, new Map());
  assert.deepEqual(back.placed.map((p) => p.at), ["w2"]);
  assert.equal(back.shown[0].species, "troll");
});

test("전리품은 뿌리 조각으로만, 보상 벽지는 팔지 않고 처음부터 가진 것도 아니다", () => {
  const room = freshRoom();
  assert.equal(buyItem(room, 99_999, "banner", 0), "off-sale", "잼으로 못 산다");
  assert.equal(buyTrophyItem(room, 4, "banner"), "jam");
  const out = buyTrophyItem(room, 5, "banner");
  assert.ok(typeof out !== "string" && out.roots === 0 && out.room.owned.banner === 1);
  assert.equal(buyTrophyItem(room, 99, "bed"), "off-sale", "잼 가구는 조각으로 못 산다");
  assert.equal(buyTrophyItem(room, 99, "wp-guard"), "off-sale", "보상 벽지는 팔지 않는다");
  assert.equal(hasSurface(room, "wp-guard", "wallpaper"), false);
  assert.equal(hasSurface({ ...room, owned: { "wp-guard": 1 } }, "wp-guard", "wallpaper"), true);
});
