import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  addPhoto,
  ANCHOR_RE,
  canScrap,
  cleanPhoto,
  COMMENT_PHRASES,
  commentId,
  editPhoto,
  folderCounts,
  FOLDERS,
  freshAlbum,
  MOMENT_KEEP,
  needsHarvest,
  normalizeAlbum,
  ordered,
  parseAnchor,
  PHOTO_MAX,
  photoDoc,
  pushMoment,
  readPhotoDoc,
  REASONS,
  removePhoto,
  SCRAP_JAM,
  SCRAP_JAM_DAY,
  scrapJam,
  speciesOf,
  REASON_OWN,
  reasonsFor,
  reasonText,
  FOLDER_ROOM,
  FOLDER_YARD,
  defaultFolder,
  type PhotoInput,
} from "./rules";
import { cleanSnap, roomSnap, SNAP_MAX, yardFacts, yardSnap, type RoomSnap, type YardSnap } from "./snap";
import { freshRoom, place, PUBLIC_ID_MAX, PUBLIC_PLACED_MAX, roomFromPublic, type RoomData } from "../room/rules";

const RULES = readFileSync("firestore.rules", "utf8");
const input = (a: string, over: Partial<PhotoInput> = {}): PhotoInput => ({ a, p: 0, k: 0, f: 0, x: "", ...over });

test("앵커: 일곱 모양만 받는다", () => {
  for (const ok of ["a:seongnam-hospital", "a:birth-rebound/br-e-why", "w:reform-is-hard", "w:reform-is-hard#rh-one", "p:national-debt#nd-1", "b:autobiography/ch-01", "m:raid"]) {
    assert.ok(ANCHOR_RE.test(ok), ok);
    assert.ok(parseAnchor(ok), ok);
  }
  for (const bad of ["a:", "a:X", "p:debt", "w:a#b#c", "b:book", "m:jam", "javascript:alert(1)", "a:x/y/z", "https://x.com"]) {
    assert.equal(parseAnchor(bad), null, bad);
  }
  assert.deepEqual(parseAnchor("a:x/y"), { kind: "cut", slug: "x", scene: "y" });
  assert.deepEqual(parseAnchor("p:x#c1"), { kind: "policy", slug: "x", claim: "c1" });
  assert.equal(speciesOf(parseAnchor("w:x#p")!), "w:x");
  assert.equal(speciesOf(parseAnchor("b:x/y")!), null);
  assert.ok(needsHarvest(parseAnchor("a:x/y")!));
  assert.ok(!needsHarvest(parseAnchor("p:x#y")!), "정책은 조건 없이 담는다(결정)");
  assert.ok(!needsHarvest(parseAnchor("w:x")!), "언행은 조건 없이 담는다(결정)");
});

test("firestore.rules가 같은 앵커·표 크기를 본다", () => {
  const m = /a\.matches\('(\^\(a:[^']+)'\)/.exec(RULES);
  assert.ok(m, "anchorOk의 정규식이 있다");
  assert.equal(m[1], ANCHOR_RE.source.replace(/\\\//g, "/"), "RegExp.source는 /를 \\/로 적는다");
  assert.ok(RULES.includes("d.p < 32") && REASONS.length <= 31 && REASON_OWN === 31, "문구 수 · 직접 쓰기 번호");
  assert.ok(RULES.includes("d.f < 16") && FOLDERS.length <= 16, "폴더 수");
  assert.ok(COMMENT_PHRASES.length <= 30, "댓글 문구는 lineOk(p < 30) 안");
  assert.ok(RULES.includes("d.x.size() <= 60"), "한 줄 60자");
});

test("담기: 맨 앞에, 같은 것은 두 번 담지 않고, PHOTO_MAX장까지", () => {
  let album = freshAlbum();
  const one = addPhoto(album, input("a:x"), "abc123", 1);
  assert.ok(typeof one !== "string");
  album = one.album;
  assert.equal(addPhoto(album, input("a:x", { p: 3 }), "abc124", 2), "have");
  const two = addPhoto(album, input("p:y#c"), "abc125", 3);
  assert.ok(typeof two !== "string");
  assert.deepEqual(two.album.photos.map((p) => p.a), ["p:y#c", "a:x"]);
  let full = freshAlbum();
  for (let i = 0; i < PHOTO_MAX; i++) {
    const r = addPhoto(full, input(`w:w${i}`), `ph${String(i).padStart(4, "0")}`, i);
    assert.ok(typeof r !== "string");
    full = r.album;
  }
  assert.equal(addPhoto(full, input("w:more"), "phmore1", 99), "full");
  assert.equal(addPhoto(freshAlbum(), input("a:x", { x: "가".repeat(61) }), "abc999", 1), "bad");
  assert.equal(addPhoto(freshAlbum(), input("m:species"), "abc998", 1), "bad", "순간은 내용(md)이 있어야 한다");
});

test("순간: 같은 순간은 한 번, 다른 물결은 따로", () => {
  let album = freshAlbum();
  const a = addPhoto(album, input("m:raid", { md: { s: "troll", v: 207771 } }), "mom001", 1);
  assert.ok(typeof a !== "string");
  album = a.album;
  assert.equal(addPhoto(album, input("m:raid", { md: { s: "troll", v: 207771 } }), "mom002", 2), "have");
  assert.ok(typeof addPhoto(album, input("m:raid", { md: { s: "troll", v: 207772 } }), "mom003", 3) !== "string");
  let ms = pushMoment([], { t: "golden", s: "a:x", at: 1 });
  ms = pushMoment(ms, { t: "golden", s: "a:x", at: 2 });
  assert.equal(ms.length, 1);
  for (let i = 0; i < 30; i++) ms = pushMoment(ms, { t: "species", s: `a:s${i}`, v: i, at: i });
  assert.equal(ms.length, MOMENT_KEEP);
  assert.equal(ms[0].s, "a:s29", "최근 것부터");
  assert.ok(!canScrap({ a: "m:raid" }), "남의 정원의 순간은 퍼가지 않는다");
  assert.ok(canScrap({ a: "p:x#y" }));
});

test("대표 사진은 한 장, 고치기는 내 몫만", () => {
  let album = freshAlbum();
  for (const [i, a] of ["a:x", "a:y", "a:z"].entries()) {
    const r = addPhoto(album, input(a, { cv: i < 2 }), `cov00${i}`, i + 1);
    assert.ok(typeof r !== "string");
    album = r.album;
  }
  assert.deepEqual(album.photos.filter((p) => p.cv).map((p) => p.a), ["a:y"]);
  const edited = editPhoto(album, "cov002", { cv: true, x: "엄마가 물어봐서", f: 3 });
  assert.ok(edited);
  assert.deepEqual(edited.photos.filter((p) => p.cv).map((p) => p.id), ["cov002"]);
  assert.equal(ordered(edited.photos)[0].id, "cov002", "대표가 맨 앞");
  const off = editPhoto(edited, "cov002", { cv: false, nc: true });
  assert.ok(off && !off.photos.find((p) => p.id === "cov002")!.cv && off.photos.find((p) => p.id === "cov002")!.nc);
  assert.equal(off!.photos.find((p) => p.id === "cov002")!.a, "a:z", "앵커는 그대로");
  assert.equal(editPhoto(album, "nope00", { p: 1 }), null);
  assert.equal(removePhoto(album, "cov000")!.photos.length, 2);
  assert.deepEqual(folderCounts(edited.photos).slice(0, 4), [2, 0, 0, 1]);
});

test("옛 사진첩(room.album)을 옮긴다 — 겹치지 않고 업적 품종만", () => {
  const moved = normalizeAlbum(undefined, ["a:x", "a:y", "a:x", "w:z", 3 as unknown as string]);
  assert.deepEqual(moved.photos.map((p) => p.a), ["a:x", "a:y"]);
  assert.ok(moved.photos.every((p) => cleanPhoto(p)), "옮긴 사진도 모양이 맞다");
  const again = normalizeAlbum(moved, ["a:x", "a:y"]);
  assert.equal(again.photos.length, 2, "두 번 열어도 늘지 않는다");
});

test("공개 문서로 갔다 돌아와도 같다", () => {
  const r = addPhoto(freshAlbum(), input("w:x#p1", { p: 2, k: 4, f: 5, x: "같이 봐요", from: { g: "gabcdefgh1", p: "src001", n: "이웃" }, cv: true }), "rt0001", 1700000000000);
  assert.ok(typeof r !== "string");
  const doc = photoDoc(r.photo);
  assert.deepEqual(Object.keys(doc).sort(), ["a", "at", "cv", "f", "fg", "fn", "fp", "k", "p", "x"]);
  const back = readPhotoDoc("rt0001", { ...doc, hidden: true });
  assert.ok(back);
  assert.equal(back.hidden, true);
  assert.deepEqual({ ...back, hidden: undefined }, { ...r.photo, hidden: undefined });
  assert.equal(readPhotoDoc("rt0002", { ...doc, a: "javascript:x" }), null);
});

test("퍼가기 보상: 새 퍼감만, 한 번에 20, 하루 100까지", () => {
  const album = freshAlbum();
  const three = scrapJam(album, [{ at: 10 }, { at: 20 }, { at: 30 }], 5);
  assert.ok(three);
  assert.equal(three.jam, 3 * SCRAP_JAM);
  assert.equal(scrapJam(three.album, [{ at: 10 }, { at: 30 }], 5), null, "본 것은 다시 세지 않는다");
  const many = scrapJam(three.album, Array.from({ length: 10 }, (_, i) => ({ at: 100 + i })), 5);
  assert.ok(many);
  assert.equal(three.jam + many.jam, SCRAP_JAM_DAY, "하루 100");
  const tomorrow = scrapJam(many.album, [{ at: 999 }], 6);
  assert.equal(tomorrow?.jam, SCRAP_JAM, "다음 날 다시");
  assert.equal(commentId("u1", "ph0001", 20777), "u1_ph0001_20777");
});

const ROOM: RoomData = {
  size: 1, wall: "wall-mint", floor: "floor-wood", mood: "happy", bgm: "garden" as RoomData["bgm"],
  placed: [{ it: "bed", pos: { x: 2, y: 3, d: 0 } as unknown as RoomData["placed"][number]["pos"] }],
  owned: { bed: 1 }, shown: [], keys: [], motto: "놀러 오세요",
};

test("스냅샷: 방 — 찍은 배치만, 글(방 한마디)은 싣지 않는다", () => {
  const sn = roomSnap(ROOM);
  assert.equal(sn.size, 1);
  assert.ok(!("motto" in sn) && !("bgm" in sn) && !("album" in sn), "글·음악·사진첩은 싣지 않는다");
  assert.ok(sn.placed.every((p) => !("pn" in p) && !("ps" in p) && !("bm" in p)), "연주·책 문장은 뺀다");
  const r = addPhoto(freshAlbum(), input("m:room", { md: { v: 29_000_000 }, sn }), "snap01", 1);
  assert.ok(typeof r !== "string");
  assert.deepEqual(readPhotoDoc("snap01", { ...photoDoc(r.photo) })?.sn, r.photo.sn, "공개 문서로 갔다 와도 같다");
  assert.equal(addPhoto(freshAlbum(), input("m:room", { md: { v: 1 } }), "snap02", 1), "bad", "스냅샷은 sn이 있어야 한다");
  assert.equal(addPhoto(freshAlbum(), input("m:yard", { md: { v: 1 }, sn }), "snap03", 1), "bad", "방 모양으로 텃밭 사진을 담지 않는다");
  assert.equal(cleanPhoto({ id: "snap04", a: "p:x#c", p: 0, k: 0, f: 0, x: "", at: 1, sn })?.sn, undefined, "스냅샷이 아닌 사진의 sn은 버린다");
});

test("스냅샷: 텃밭 — 자란 정도는 찍은 때 기준, 표에 없는 소품은 빈자리", () => {
  const beds = [
    { id: "a", speciesId: "p:x", plantedAt: 0, ripeAt: 100, speed: 1, harvests: 0 },
    null,
    { id: "b", speciesId: "a:y", plantedAt: 0, ripeAt: 400, speed: 1, harvests: 0 },
  ];
  const sn = yardSnap(beds, { owned: {}, slots: ["scarecrow", "nope", null, null, null] }, ROOM, 200);
  assert.deepEqual(sn.b, [{ s: "p:x", g: 100 }, null, { s: "a:y", g: 50 }]);
  assert.deepEqual(sn.y, ["scarecrow", null, null, null, null]);
  const byId = new Map([["p:x", {}], ["a:y", {}]]) as unknown as Parameters<typeof yardFacts>[1];
  assert.deepEqual(yardFacts(sn, byId), { plots: 3, planted: 2, ripe: 1, kinds: 2, deco: 1 });
  assert.equal(cleanSnap("yard", { ...sn, b: Array(13).fill(null) }), null, "밭 12칸까지");
  assert.deepEqual((cleanSnap("yard", { ...sn, b: [{ s: "p:x", g: 101 }] }) as YardSnap).b, [null], "자란 정도 0–100");
});

test("스냅샷: 합쳐서 SNAP_MAX장", () => {
  let album = freshAlbum();
  const sn = roomSnap(ROOM);
  for (let i = 0; i < SNAP_MAX; i++) {
    const r = addPhoto(album, input("m:room", { md: { v: i }, sn }), `snp${String(i).padStart(3, "0")}`, i);
    assert.ok(typeof r !== "string");
    album = r.album;
  }
  assert.equal(addPhoto(album, input("m:room", { md: { v: 99 }, sn }), "snp999", 99), "snaps");
  assert.ok(typeof addPhoto(album, input("a:x"), "snpok1", 99) !== "string", "다른 사진은 담긴다");
  assert.ok(!canScrap({ a: "m:room" }), "남의 방 사진은 퍼가지 않는다");
});

test("firestore.rules가 스냅샷 모양을 같은 값으로 본다", () => {
  const room = /function roomSnapOk\(r\) \{([\s\S]*?)\n    \}/.exec(RULES)?.[1] ?? "";
  const yard = /function yardSnapOk\(r\) \{([\s\S]*?)\n    \}/.exec(RULES)?.[1] ?? "";
  assert.ok(room && yard, "두 함수가 있다");
  const keys: Array<keyof RoomSnap> = ["size", "wall", "floor", "mood", "placed", "keys", "avatar"];
  assert.ok(room.includes(`hasOnly([${keys.map((k) => `'${k}'`).join(", ")}])`), "방 스냅샷 키");
  assert.ok(!room.includes("motto"), "방 한마디는 받지 않는다");
  assert.ok(room.includes(`r.placed.size() <= ${PUBLIC_PLACED_MAX}`) && room.includes(`r.wall.size() <= ${PUBLIC_ID_MAX}`));
  assert.ok(yard.includes("r.b.size() <= 12") && yard.includes("r.y.size() <= 5"));
  assert.ok(RULES.includes("(d.a == 'm:room' || d.a == 'm:yard') == ('sn' in d)"));
});

test("스냅샷: 꾸민 방이 찍었다 되살려도 같은 자리", () => {
  let room: RoomData = { ...freshRoom(), owned: { wardrobe: 1, chair: 1 }, motto: "놀러 오세요" };
  room = place(room, "wardrobe", { x: 0, y: 0, dir: 0 })!;
  room = place(room, "chair", { x: 4, y: 4, dir: 0 })!;
  assert.ok(room && room.placed.length === 2);
  const back = roomFromPublic({ ...roomSnap(room) }, new Map());
  assert.deepEqual(back.placed.map((p) => [p.it, p.pos]), room.placed.map((p) => [p.it, p.pos]));
  assert.equal(back.motto, "", "방 한마디는 사진에 없다");
});

test("문구: 종류에 맞는 몇 개만, 직접 쓰기는 한 줄이 있어야", () => {
  const room = reasonsFor(parseAnchor("m:room")!);
  assert.ok(room.length <= 5 && room.every((p) => /남겨|꾸민|놀러|간직/.test(REASONS[p])), "방 사진에는 방에 맞는 문구");
  assert.ok(reasonsFor(parseAnchor("p:x#c")!).includes(11), "정책에는 소문 확인");
  assert.equal(reasonsFor(parseAnchor("a:x")!, { scrap: true })[0], 12, "퍼 온 사진");
  assert.equal(reasonsFor(parseAnchor("m:room")!, { keep: 0 })[0], 0, "고치는 사진의 옛 문구는 남긴다");
  assert.equal(defaultFolder(parseAnchor("m:room")!), FOLDER_ROOM);
  assert.equal(defaultFolder(parseAnchor("m:yard")!), FOLDER_YARD);
  const own = addPhoto(freshAlbum(), input("a:x", { p: REASON_OWN, x: "처음 거둔 업적" }), "own001", 1);
  assert.ok(typeof own !== "string" && own.photo.p === REASON_OWN);
  assert.equal(reasonText(REASON_OWN), null, "직접 쓰기는 문구 없이 한 줄만");
  const empty = addPhoto(freshAlbum(), input("a:x", { p: REASON_OWN, x: "" }), "own002", 1);
  assert.ok(typeof empty !== "string" && empty.photo.p === 0, "한 줄이 없으면 처음 문구로");
  assert.equal(cleanPhoto({ id: "own003", a: "a:x", p: 20, k: 0, f: 0, x: "", at: 1 })?.p, 0, "없는 번호");
});
