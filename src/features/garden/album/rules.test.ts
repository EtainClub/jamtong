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
  type PhotoInput,
} from "./rules";

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
  assert.ok(RULES.includes("d.p < 16") && REASONS.length <= 16, "문구 수");
  assert.ok(RULES.includes("d.f < 8") && FOLDERS.length === 8, "폴더 수");
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
