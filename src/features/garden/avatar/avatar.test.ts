/**
 * 내 방의 꼬마 — `pnpm garden:test`. 부위 그림의 모양, 자세 × 부위 그리기, 공개 문자열, 거르기, 자세, 사기·받기를 본다.
 * 공개 문자열은 firestore.rules의 publicRoom()과 짝이 맞아야 한다. 설계는 docs/garden-avatar.md.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { FURNITURE_BY_ID } from "../room/catalog";
import { freshRoom, normalizeRoom, publicRoom, roomFromPublic } from "../room/rules";
import { FIXED } from "./palette";
import { FREE, PARTS, WEAR, WEAR_BY_ID, type Wear } from "./catalog";
import { avatarDiffRects, avatarGrid, avatarRects, type Look } from "./compose";
import {
  AVATAR_PUBLIC_MAX, AVATAR_PUBLIC_RE, avatarFromPublic, buyWear, faceFor, freshAvatar, grantRewards, moodFace,
  normalizeAvatar, ownedLook, packAvatar, poseAt, roamNext, unownedWear, type AvatarData,
} from "./rules";
import { GRID_H, GRID_W, HEAD, POSES, type Pose, type Sprite } from "./sprites";
import { MOODS } from "../room/catalog";

const SLOT_LETTERS = new Set(["s", "S", "h", "H", "a", "A", "b", "B", "f", "F", "c", "C", "."]);
const POSE_LIST = Object.keys(POSES) as Pose[];

function checkSprite(name: string, s: Sprite) {
  const w = s.rows[0]?.length ?? 0;
  for (const [j, row] of s.rows.entries()) {
    assert.equal(row.length, w, `${name} ${j}줄의 길이`);
    for (const ch of row) assert.ok(SLOT_LETTERS.has(ch) || FIXED[ch], `${name}의 모르는 글자 ${ch}`);
  }
  assert.ok(s.x >= 0 && s.x + w <= GRID_W, `${name}가 옆으로 판 밖`);
  assert.ok(s.y >= 0 && s.y + s.rows.length <= GRID_H, `${name}가 위아래로 판 밖`);
}

test("부위 그림은 줄 길이가 같고, 아는 글자만 쓰고, 판 안에 있다", () => {
  checkSprite("머리", HEAD);
  for (const [p, spec] of Object.entries(POSES)) {
    checkSprite(`자세 ${p}`, spec.body);
    if (spec.front) checkSprite(`자세 ${p} 팔`, spec.front);
  }
  for (const w of WEAR) {
    if (w.front) checkSprite(`${w.id} 앞`, w.front);
    if (w.back) checkSprite(`${w.id} 뒤`, w.back);
    if (w.held) checkSprite(`${w.id} 든 것`, { x: 0, y: 0, rows: w.held.rows });
  }
});

test("옷 id는 겹치지 않고 공개 문자열이 받는 글자다", () => {
  assert.equal(WEAR_BY_ID.size, WEAR.length);
  for (const w of WEAR) assert.match(w.id, /^[a-z0-9-]{1,12}$/, w.id);
  for (const w of WEAR.filter((x) => x.cur === "reward")) assert.ok(w.reward, `${w.id}에 받는 조건`);
  for (const p of PARTS.filter((x) => !x.optional)) assert.ok(FREE[p.id].length > 0, `${p.id}의 무료 옷`);
});

test("모든 자세 × 모든 옷이 그려지고, 사각형은 꼬마 하나에 170개 아래다", () => {
  const base = freshAvatar("t").look;
  let most = 0;
  for (const pose of POSE_LIST) {
    for (const w of WEAR) {
      const look: Look = w.part === "bubble" ? base : { ...base, [w.part]: w.id };
      const n = avatarRects(look, pose, faceFor(pose, "sleepy")).length;
      most = Math.max(most, n);
      assert.ok(n > 30, `${pose}·${w.id}가 거의 비었다`);
    }
  }
  assert.ok(most < 170, `가장 많은 사각형 ${most}`);
});

test("눈 깜빡임 장은 눈 둘레만 — 사각형 열 개 아래", () => {
  const look = freshAvatar("blink").look;
  const n = avatarDiffRects(look, "stand", moodFace("focus"), { ...moodFace("focus"), eyes: "closed" }).length;
  assert.ok(n > 0 && n < 10, String(n));
});

test("발은 판 맨 아래 줄에 닿는다 — 방 줄의 바닥선에 선다", () => {
  const look = freshAvatar("feet").look;
  for (const pose of POSE_LIST) {
    const grid = avatarGrid(look, pose, moodFace("easy"));
    assert.ok(grid[GRID_H - 1].some(Boolean), `${pose}의 발`);
  }
});

test("모든 기분에 표정이 있다", () => {
  for (const m of MOODS) assert.ok(moodFace(m.id).mouth);
  assert.equal(faceFor("sleep", "happy").eyes, "closed");
});

test("기본 꼬마는 같은 seed면 같고 무료 옷만 입는다", () => {
  assert.deepEqual(freshAvatar("a"), freshAvatar("a"));
  const av = freshAvatar("b");
  assert.deepEqual(unownedWear(av, av.look), []);
});

test("공개 문자열은 되돌아오고, 가장 긴 조합도 규칙에 맞는다", () => {
  const longest = (part: Wear["part"]) => WEAR.filter((w) => w.part === part).sort((a, b) => b.id.length - a.id.length)[0].id;
  const av: AvatarData = {
    on: true, at: "b9", roam: true, owned: WEAR.map((w) => w.id),
    look: {
      skin: 7, hairColor: 9, hair: longest("hair"), eyes: longest("eyes"), top: longest("top"), bottom: longest("bottom"), shoes: longest("shoes"),
      hat: longest("hat"), face: longest("face"), held: longest("held"), bubble: longest("bubble"), tint: { top: 11, bottom: 11, shoes: 11 },
    },
  };
  const packed = packAvatar(av, 10);
  assert.ok(packed && packed.length <= AVATAR_PUBLIC_MAX && AVATAR_PUBLIC_RE.test(packed), packed ?? "null");
  const back = avatarFromPublic(packed)!;
  assert.equal(back.at, "b9");
  assert.equal(back.roam, true);
  for (const k of ["hair", "eyes", "top", "bottom", "shoes", "hat", "face", "held", "bubble", "skin", "hairColor"] as const) assert.equal(back.look[k], av.look[k], k);
});

test("색 고르기가 없는 옷에는 색 번호를 싣지 않는다", () => {
  const av = { ...freshAvatar("c"), owned: ["jeans"], look: { ...freshAvatar("c").look, bottom: "jeans", tint: { bottom: 3 } } };
  assert.ok(packAvatar(av, 6)!.split(";")[8] === "jeans");
});

test("가지지 않은 옷은 공개하기 전에 기본으로, 끈 꼬마·방 밖 칸은 싣지 않는다", () => {
  const av = freshAvatar("d");
  const fake: AvatarData = { ...av, look: { ...av.look, hat: "straw", top: "jeogori", bubble: "letter" } };
  const f = packAvatar(fake, 6)!.split(";");
  assert.equal(f[7].split(".")[0], FREE.top[0]);
  assert.equal(f[10], "");
  assert.equal(f[13], "basic");
  assert.deepEqual(ownedLook({ ...fake, owned: ["straw"] }).hat, "straw");
  assert.equal(packAvatar({ ...av, on: false }, 6), null);
  assert.equal(packAvatar({ ...av, at: "f7" }, 6), null);
});

test("공개 문자열 거르기 — 모르는 id는 기본, 모양이 틀리면 없음", () => {
  assert.equal(avatarFromPublic("2;b1;0;0;0;short;dot;tee;pants;sneaker;;;;basic"), null);
  assert.equal(avatarFromPublic("1;w1;0;0;0;short;dot;tee;pants;sneaker;;;;basic"), null);
  assert.equal(avatarFromPublic("1;b1;0;0;0;Short;dot;tee;pants;sneaker;;;;basic"), null);
  assert.equal(avatarFromPublic(42), null);
  assert.equal(avatarFromPublic("1;b1;0;0;0;short;dot;tee"), null);
  const odd = avatarFromPublic("1;b1;0;0;0;nope;dot;tee.99;pants;sneaker;bed;;can;zzz")!;
  assert.notEqual(odd.look.hair, "nope");
  assert.equal(odd.look.tint?.top, undefined);
  assert.equal(odd.look.hat, undefined);
  assert.equal(odd.look.held, "can");
  assert.equal(odd.look.bubble, "basic");
});

test("방의 공개·되돌리기에 꼬마가 실린다", () => {
  const room = freshRoom("e");
  const pub = publicRoom(room);
  assert.ok(pub.avatar);
  const back = roomFromPublic(pub, new Map());
  assert.equal(back.avatar?.at, room.avatar!.at);
  assert.equal(roomFromPublic({ ...pub, avatar: "1;f9;0;0;0;short;dot;tee;pants;sneaker;;;;basic" }, new Map()).avatar, undefined, "방 밖의 칸");
  assert.equal(publicRoom({ ...room, avatar: { ...room.avatar!, on: false } }).avatar, undefined);
});

test("옛 장부는 seed로 기본 꼬마를 받고, 장부의 모양을 바로잡는다", () => {
  const old = normalizeRoom({ size: 0, wall: "wp-cream", floor: "fl-wood" } as never, "닉");
  assert.deepEqual(old.avatar, freshAvatar("닉"));
  const bad = normalizeAvatar({ on: "yes" as never, at: "z9", roam: 1 as never, owned: ["straw", "nope", "straw"], look: { skin: 99 } as never }, "s");
  assert.equal(bad.on, true);
  assert.equal(bad.at, freshAvatar("s").at);
  assert.equal(bad.roam, false);
  assert.deepEqual(bad.owned, ["straw"]);
  assert.equal(bad.look.skin, freshAvatar("s").look.skin);
});

test("가구가 자세를 정한다 — 2칸 가구는 오른쪽 칸도", () => {
  const placed = [{ at: "f0", it: "sofa" }, { at: "b2", it: "bed" }, { at: "f3", it: "piano" }, { at: "f5", it: "lamp" }];
  assert.equal(poseAt(placed, "f0"), "sit");
  assert.equal(poseAt(placed, "f1"), "sit");
  assert.equal(poseAt(placed, "b3"), "sleep");
  assert.equal(poseAt(placed, "f4"), "play");
  assert.equal(poseAt(placed, "f5"), "stand");
  assert.equal(poseAt(placed, "f2"), "stand");
  for (const id of ["chair", "sofa", "cushion", "rocker", "bench"]) assert.equal(FURNITURE_BY_ID.get(id)?.pose, "sit", id);
});

test("돌아다니기는 같은 줄의 옆 칸으로 — 가구가 양옆을 막아도 지나간다", () => {
  assert.equal(roamNext("f0", 6, "x"), "f1");
  assert.equal(roamNext("f5", 6, "x"), "f4");
  assert.ok(["f2", "f4"].includes(roamNext("f3", 6, "y")));
  assert.equal(roamNext("b0", 1, "z"), "b0");
  // 예전에는 양옆이 가구(자세 없음)면 멈춰 있었다.
  const seen = new Set(Array.from({ length: 20 }, (_, n) => roamNext("f1", 6, String(n))));
  assert.deepEqual([...seen].sort(), ["f0", "f2"]);
});

test("옷 사기 — 잼·뿌리 조각, 받는 옷·무료 옷은 팔지 않는다", () => {
  const av = freshAvatar("buy");
  const ok = buyWear(av, { jam: 500, roots: 0 }, "straw");
  assert.ok(typeof ok !== "string" && ok.jam === 200 && ok.avatar.owned.includes("straw"));
  assert.equal(buyWear(ok.avatar, { jam: 500, roots: 0 }, "straw"), "owned");
  assert.equal(buyWear(av, { jam: 100, roots: 0 }, "straw"), "short");
  assert.equal(buyWear(av, { jam: 9999, roots: 0 }, "short"), "off-sale");
  assert.equal(buyWear(av, { jam: 9999, roots: 0 }, "dexcap"), "off-sale");
  assert.equal(buyWear(av, { jam: 9999, roots: 0 }, "plazavest"), "short");
  const root = buyWear(av, { jam: 10, roots: 10 }, "plazavest");
  assert.ok(typeof root !== "string" && root.roots === 0 && root.jam === 10);
});

test("받는 옷은 조건을 채우면 들어오고, 같으면 같은 것을 돌려준다", () => {
  const av = freshAvatar("gift");
  assert.equal(grantRewards(av, { titles: {}, golden: 0, trophies: 0 }), av);
  const got = grantRewards(av, { titles: { dex: 3 }, golden: 1, trophies: 6 });
  assert.deepEqual([...got.owned].sort(), ["dexcap", "goldcan", "guardflag"]);
});

test("firestore.rules의 publicRoom()이 같은 길이·정규식을 본다", () => {
  const rules = readFileSync("firestore.rules", "utf8");
  assert.match(rules, /'avatar'\]\)/);
  assert.ok(rules.includes(`r.avatar.size() <= ${AVATAR_PUBLIC_MAX}`));
  assert.ok(rules.includes(`r.avatar.matches('${AVATAR_PUBLIC_RE.source}')`));
});
