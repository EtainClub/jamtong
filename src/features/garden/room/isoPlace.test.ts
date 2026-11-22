/**
 * 아이소 방의 자리(room/isoPlace.ts) — `pnpm garden:test`. 설계는 docs/garden-miniroom-iso.md §8.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { FURNITURE } from "./catalog";
import { ISO } from "./iso";
import { footprint, isoFromSlots, isoProblem, isoProblemAt, packPos, unpackPos, WALL_H, type IsoItem, type SlotPlaced } from "./isoPlace";
import type { Shown } from "./rules";

const NONE: Shown[] = [];
const floor = (it: string, x: number, y: number, more: { dir?: 0 | 1 | 2 | 3; on?: number } = {}): IsoItem => ({ it, pos: { x, y, dir: more.dir ?? 0, ...(more.on !== undefined ? { on: more.on } : {}) } });
const wall = (it: string, w: "L" | "R", a: number, z: number): IsoItem => ({ it, pos: { wall: w, a, z } });

test("바닥 상자: 방향 1·3은 너비와 깊이를 바꾼다", () => {
  assert.deepEqual(footprint(ISO.bed, { x: 2, y: 4, dir: 0 }), { u: 1, v: 2, w: 2, d: 3 });
  assert.deepEqual(footprint(ISO.bed, { x: 2, y: 4, dir: 1 }), { u: 1, v: 2, w: 3, d: 2 });
  assert.deepEqual(footprint(ISO.bed, { x: 2, y: 4, dir: 2 }), { u: 1, v: 2, w: 2, d: 3 });
});

test("겹침: 가구끼리는 막고, 깔개는 무엇과도, 올려 두는 것끼리는 겹친다", () => {
  assert.equal(isoProblemAt([floor("bed", 0, 0), floor("desk", 2, 0)], 1, NONE, 0), "overlap");
  assert.equal(isoProblemAt([floor("bed", 0, 0), floor("desk", 4, 0)], 1, NONE, 0), null);
  assert.equal(isoProblemAt([floor("bed", 0, 0), floor("rug", 0, 0)], 1, NONE, 0), null);
  assert.equal(isoProblemAt([floor("radio", 0, 0), floor("can", 0, 0)], 1, NONE, 0), null);
  assert.equal(isoProblemAt([floor("bed", 0, 0), floor("radio", 1, 1)], 1, NONE, 0), "overlap", "바닥의 소품은 가구와 겹치지 않는다");
  assert.equal(isoProblemAt([floor("radio", 1, 1), floor("bed", 0, 0)], 1, NONE, 0), "overlap", "거꾸로도");
});

test("방석: 애완동물만 올라간다", () => {
  for (const seat of ["cushion", "babi-bed"]) {
    assert.equal(isoProblemAt([floor(seat, 0, 0), floor("babi-mini", 0, 0, { on: 0 })], 1, NONE, 0), null, `${seat} 위 바비`);
    assert.equal(isoProblemAt([floor(seat, 0, 0), floor("radio", 0, 0, { on: 0 })], 1, NONE, 0), "base", `${seat} 위 라디오는 안 된다`);
  }
  assert.equal(isoProblemAt([floor("desk", 4, 0), floor("babi-mini", 5, 1, { on: 0 })], 1, NONE, 0), null, "책상 위에도 그대로 놓인다");
});

test("받침: 올림면이 있는 가구 위, 그 바닥 상자 안에만 올린다", () => {
  const desk = floor("desk", 4, 0); // u 2..4, v 0..1
  assert.equal(isoProblemAt([desk, floor("radio", 5, 1, { on: 0 })], 1, NONE, 0), null);
  assert.equal(isoProblemAt([desk, floor("radio", 8, 1, { on: 0 })], 1, NONE, 0), "base", "책상 밖으로 삐져나온다");
  assert.equal(isoProblemAt([floor("bed", 0, 0), floor("radio", 1, 1, { on: 0 })], 1, NONE, 0), "base", "침대에는 올림면이 없다");
  assert.equal(isoProblemAt([desk, floor("chair", 4, 0, { on: 0 })], 1, NONE, 0), "base", "가구는 올리지 않는다");
  assert.equal(isoProblemAt([desk, floor("radio", 5, 1, { on: 0 }), floor("can", 5, 1, { on: 1 })], 2, NONE, 0), "base", "받침 위의 것은 받침이 못 된다");
  assert.equal(isoProblemAt([desk, floor("radio", 5, 1, { on: 0 }), floor("chair", 6, 2)], 2, NONE, 0), null, "책상 앞 의자는 책상 위 라디오와 부딪치지 않는다");
});

test("방 앞쪽: 틀이 자르는 바닥(u + v > 1.4n)에는 놓지 않고, 벽은 바깥으로 갈수록 높이 건다", () => {
  assert.equal(isoProblemAt([floor("chair", 6, 8)], 0, NONE, 0), "bounds", "6×6 방: 타일 (3,4)는 3+4+2 > 8");
  assert.equal(isoProblemAt([floor("chair", 6, 2)], 0, NONE, 0), null);
  assert.equal(isoProblemAt([wall("painting", "R", 0, 70)], 0, NONE, 0), "bounds", "안쪽 꼭짓점은 96px까지");
  assert.equal(isoProblemAt([wall("painting", "R", 8, 70)], 0, NONE, 0), null, "네 타일 바깥은 136px까지");
});

test("방 밖·층이 맞지 않는 자리는 받지 않는다", () => {
  assert.equal(isoProblemAt([floor("bed", 10, 0)], 0, NONE, 0), "bounds", "6×6 방에서 u 5..7");
  assert.equal(isoProblemAt([floor("bed", 10, 0)], 0, NONE, 2), null, "10×10 방에서는 들어간다");
  assert.equal(isoProblemAt([floor("painting", 0, 0)], 0, NONE, 0), "layer");
  assert.equal(isoProblemAt([wall("bed", "L", 0, 10)], 0, NONE, 0), "layer");
  assert.equal(isoProblemAt([wall("painting", "L", 0, WALL_H - 10)], 0, NONE, 0), "bounds", "벽 위로 넘친다");
  assert.equal(isoProblemAt([floor("nope", 0, 0)], 0, NONE, 0), "unknown");
  assert.equal(isoProblemAt([floor("radio", 1.5, 0)], 0, NONE, 0), "bounds", "반 타일 단위 정수만");
});

test("벽걸이: 같은 벽에서 겹치면 막고, 다른 벽·다른 높이는 괜찮다. 박제·기념품은 벽에도 건다", () => {
  assert.equal(isoProblemAt([wall("painting", "L", 0, 40), wall("clock", "L", 1, 50)], 1, NONE, 0), "overlap");
  assert.equal(isoProblemAt([wall("painting", "L", 0, 40), wall("clock", "R", 0, 40)], 1, NONE, 0), null);
  assert.equal(isoProblemAt([wall("painting", "L", 0, 10), wall("clock", "L", 0, 60)], 1, NONE, 0), null);
  const shown: Shown[] = [{ id: "v:1", kind: "trophy", species: "x" }, { id: "p:1", kind: "pot", species: "y" }];
  assert.equal(isoProblemAt([wall("v:1", "R", 4, 30)], 0, shown, 0), null);
  assert.equal(isoProblemAt([wall("p:1", "R", 4, 30)], 0, shown, 0), "layer", "화분은 벽에 걸지 않는다");
});

test("옛 장부 옮기기: 꾸민 방이 겹침 없이 옮겨지고 키보드·피아노 번호가 남는다", () => {
  const shown: Shown[] = [{ id: "v:t", kind: "trophy", species: "x" }, { id: "p:a", kind: "pot", species: "y" }];
  const placed: SlotPlaced[] = [
    { at: "w0", it: "v:t" }, { at: "w1", it: "painting" }, { at: "w3", it: "win-round" }, { at: "w5", it: "clock" },
    { at: "b0", it: "bed" }, { at: "b2", it: "desk" }, { at: "b4", it: "piano", kb: 1 },
    { at: "f0", it: "rug" }, { at: "f2", it: "chair" }, { at: "f3", it: "keyboard", kb: 0 }, { at: "f5", it: "p:a" },
  ];
  const { items, stowed } = isoFromSlots(placed, shown, 0);
  assert.deepEqual(stowed, []);
  assert.equal(items.length, placed.length);
  assert.equal(isoProblem(items, shown, 0), null);
  assert.deepEqual(items.find((x) => x.it === "painting")?.pos, { wall: "R", a: 2, z: 50 });
  assert.equal(items.find((x) => x.it === "piano")?.kb, 1);
  assert.equal(items.find((x) => x.it === "keyboard")?.kb, 0);
  assert.ok(items.slice(0, 5).every((x) => ISO[x.it]?.layer === "furniture"), "가구부터 놓는다");
});

test("옛 장부 옮기기: 칸이 모두 찬 가장 큰 방도 보관함으로 가는 것 없이 옮긴다", () => {
  for (const size of [0, 1, 2]) {
    const n = [6, 8, 10][size];
    const placed: SlotPlaced[] = [];
    for (let i = 0; i < n; i++) {
      placed.push({ at: `w${i}`, it: "clock" }, { at: `b${i}`, it: "wardrobe" }, { at: `f${i}`, it: "chair" });
    }
    const { items, stowed } = isoFromSlots(placed, NONE, size);
    assert.deepEqual(stowed, [], `size ${size}`);
    assert.equal(isoProblem(items, NONE, size), null, `size ${size}`);
  }
});

test("옛 장부 옮기기: 방에 놓는 가구는 모두 가장 작은 방의 첫 칸에서 옮겨진다", () => {
  const placeable = FURNITURE.filter((f) => f.kind === "floor" || f.kind === "wall" || f.kind === "window" || f.kind === "frame-blank");
  for (const f of placeable) {
    const at = f.kind === "floor" ? "f0" : "w0";
    const { items, stowed } = isoFromSlots([{ at, it: f.id }], NONE, 0);
    assert.deepEqual(stowed, [], f.id);
    assert.equal(isoProblem(items, NONE, 0), null, f.id);
  }
});

test("옛 장부 옮기기: 모르는 물건·틀린 칸은 보관함으로", () => {
  const { items, stowed } = isoFromSlots([{ at: "b0", it: "nope" }, { at: "x1", it: "chair" }, { at: "b1", it: "chair" }], NONE, 0);
  assert.deepEqual([...stowed].sort(), ["chair", "nope"]);
  assert.equal(items.length, 1);
});

test("공개 문서의 자리 글자: 되돌리면 같고, 모양이 틀리면 null", () => {
  for (const pos of [{ x: 0, y: 0, dir: 0 }, { x: 19, y: 20, dir: 3, on: 79 }, { wall: "L", a: 18, z: 120 }, { wall: "R", a: 0, z: 0 }] as const) {
    const s = packPos(pos);
    assert.ok(s.length <= 12, s);
    assert.deepEqual(unpackPos(s), pos);
  }
  for (const bad of ["", "1~2", "1~2~4", "1~2~0~", "X~1~2", "L~1", "1~2~0~123", "<b>", 7, null]) assert.equal(unpackPos(bad), null, String(bad));
});
