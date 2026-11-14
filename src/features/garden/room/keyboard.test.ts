/**
 * 내 키보드 — `pnpm garden:test`. 그림 문자열, 옛 저장 맞추기, 공개 방, 박자 맞추기, 녹음 경로를 본다.
 * 공개 방의 키 모양은 firestore.rules의 publicKeys(), 녹음 파일은 storage.rules의 roomKeys와 짝이 맞아야 한다.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { FURNITURE_BY_ID } from "./catalog";
import { faceHistoryReducer, initialFaceHistory } from "./faceHistory";
import {
  blankFace,
  blankKeys,
  packKeyboard,
  unpackKeyboard,
  decodeFace,
  encodeFace,
  FACE_CELLS,
  FACE_SIZE,
  faceToPaths,
  freshKeys,
  isFace,
  KEY_COUNT,
  KEY_REC_MAX_BYTES,
  KEY_SOUND_MAX,
  KEY_VER_MAX,
  KEYBOARD_ID,
  keyForCode,
  keysFromPublic,
  mirrorCell,
  mustWipeRecs,
  nextVer,
  normalizeKeys,
  paint,
  PALETTE,
  PRESETS,
  publicKeys,
  REC,
  REC_FILE_RE,
  recPath,
  recSlots,
  SILENT,
  snapTime,
  wipeRecs,
  type RoomKey,
} from "./keyboard";
import { SYNTH } from "./keyboardSound";
import { freshRoom, normalizeRoom, place, publicRoom, roomFromPublic, validRoom, keyboardKeys, keyboardBanks, withKeyboardKeys, move, stow, recordingCleanup, sharedRecording, nextRecordingVer } from "./rules";

const withRec = (slot: number, ver: number): RoomKey[] => freshKeys().map((k, i) => (i === slot ? { ...k, sound: REC, ver } : k));

test("가구표: 키보드는 바닥 2칸, 잼 400, 누르면 키보드 바로가기", () => {
  const f = FURNITURE_BY_ID.get(KEYBOARD_ID);
  assert.ok(f);
  assert.equal(f.kind, "floor");
  assert.equal(f.size, 2);
  assert.equal(f.price, 400);
  assert.equal(f.shortcut, "keyboard");
  assert.equal(f.cur, undefined);
});

test("정해 둔 소리: 스물, id가 겹치지 않고, 모두 만들어진다", () => {
  assert.equal(PRESETS.length, 20);
  assert.equal(new Set(PRESETS.map((p) => p.id)).size, PRESETS.length);
  for (const p of PRESETS) {
    assert.ok(p.id.length <= KEY_SOUND_MAX && p.id !== REC && p.id !== SILENT, p.id);
    assert.equal(typeof SYNTH[p.id], "function", `${p.id}의 소리가 없다`);
  }
  assert.deepEqual(Object.keys(SYNTH).sort(), PRESETS.map((p) => p.id).sort());
});

test("그림: 144자, 팔레트 번호만, 칠하기·거울·지우개", () => {
  assert.equal(FACE_CELLS, 144);
  assert.equal(PALETTE.length, 8);
  assert.ok(isFace(blankFace()));
  assert.equal(isFace("0".repeat(143)), false);
  assert.equal(isFace("8".repeat(144)), false, "팔레트 밖의 색");
  assert.equal(isFace("0".repeat(143) + "a"), false);
  assert.equal(isFace(123), false);
  const cells = decodeFace(blankFace());
  cells[5] = 7;
  assert.equal(encodeFace(cells)[5], "7");
  assert.throws(() => encodeFace([1, 2]));

  const one = paint(blankFace(), 13, 3);
  assert.equal(one[13], "3");
  assert.equal(one.replace(/0/g, "").length, 1);
  const mirrored = paint(blankFace(), FACE_SIZE + 1, 4, true); // (1,1) ↔ (10,1)
  assert.equal(mirrored[FACE_SIZE + 1], "4");
  assert.equal(mirrored[mirrorCell(FACE_SIZE + 1)], "4");
  assert.equal(mirrorCell(FACE_SIZE + 1), FACE_SIZE + 10);
  assert.equal(paint(one, 13, 0)[13], "0", "지우개");
  assert.equal(paint(one, 200, 3), one, "판 밖");
  assert.equal(paint(one, 1, 9), one, "팔레트 밖");
  assert.equal(paint(one, 13, 3), one, "같으면 같은 문자열");
});

test("그림 → path: 투명은 그리지 않고 색마다 하나", () => {
  assert.deepEqual(faceToPaths(blankFace()), []);
  const f = paint(paint(paint(blankFace(), 0, 1), 1, 1), 143, 5);
  const paths = faceToPaths(f);
  assert.equal(paths.length, 2);
  assert.equal(paths[0].color, PALETTE[1]);
  assert.equal(paths[0].d, "M0 0h1v1h-1zM1 0h1v1h-1z");
  assert.equal(paths[1].d, "M11 11h1v1h-1z");
});

test("처음 키: 넷, 그림이 있고, 오르골 도·미·솔·높은 도", () => {
  const keys = freshKeys();
  assert.equal(keys.length, KEY_COUNT);
  for (const k of keys) {
    assert.ok(isFace(k.face));
    assert.notEqual(k.face, blankFace());
    assert.equal(k.ver, 0);
  }
  assert.deepEqual(keys.map((k) => k.sound), ["orgel-do", "orgel-mi", "orgel-sol", "orgel-hi"]);
});

test("옛 저장·어긋난 키를 맞춘다", () => {
  assert.deepEqual(normalizeKeys(undefined), freshKeys());
  assert.deepEqual(normalizeRoom({}).keys, freshKeys(), "키보드 전에 저장한 방");
  assert.deepEqual(normalizeRoom(undefined), freshRoom());
  const odd = normalizeKeys([
    { face: "x", sound: "bird", ver: 2 },
    { face: blankFace(), sound: REC, ver: 0 },
    { face: blankFace(), sound: REC, ver: 3 },
    { face: blankFace(), sound: "../evil", ver: -1 },
    { face: blankFace(), sound: "drum", ver: 1 },
  ]);
  assert.equal(odd.length, KEY_COUNT);
  assert.equal(odd[0].face, freshKeys()[0].face, "어긋난 그림은 처음 그림");
  assert.equal(odd[0].sound, "bird");
  assert.equal(odd[0].ver, 2, "판은 녹음을 지워도 남는다");
  assert.equal(odd[1].sound, "orgel-mi", "판 없는 녹음은 처음 소리");
  assert.deepEqual(odd[2], { face: blankFace(), sound: REC, ver: 3 });
  assert.equal(odd[3].sound, "orgel-hi");
  assert.equal(odd[3].ver, 0);
  assert.equal(normalizeKeys([{ face: blankFace(), sound: SILENT, ver: 0 }])[0].sound, SILENT);
});

test("공개 키: 그림·소리 id·녹음 판만, 녹음 판은 녹음일 때만", () => {
  const keys = withRec(2, 5);
  const pub = publicKeys(keys);
  assert.equal(pub.length, KEY_COUNT);
  assert.deepEqual(Object.keys(pub[0]).sort(), ["f", "s"]);
  assert.deepEqual(pub[2], { f: keys[2].face, s: REC, v: 5 });
  const back = keysFromPublic(pub);
  assert.deepEqual(back, keys.map((k, i) => (i === 2 ? k : { ...k, ver: 0 })));
});

test("남의 키: 어긋난 그림은 빈 그림, 모르는 소리·판 없는 녹음은 소리 없음", () => {
  const raw = [
    { f: "9".repeat(144), s: "drum" },
    { f: blankFace(), s: "../../evil.mp3" },
    { f: blankFace(), s: REC },
    { f: blankFace(), s: REC, v: 1.5 },
    { f: blankFace(), s: "bird", v: 4 },
  ];
  const keys = keysFromPublic(raw);
  assert.equal(keys.length, KEY_COUNT);
  assert.equal(keys[0].face, blankFace());
  assert.equal(keys[0].sound, "drum");
  assert.equal(keys[1].sound, SILENT);
  assert.equal(keys[2].sound, SILENT);
  assert.equal(keys[3].sound, SILENT);
  assert.equal(keysFromPublic(undefined).every((k) => k.sound === SILENT && k.face === blankFace()), true, "옛 문서");
  assert.equal(keysFromPublic([null]).length, KEY_COUNT);
});

test("공개 방: 키보드를 놓았을 때만 키를 싣고, 되돌리면 같은 키", () => {
  const room = { ...freshRoom(), owned: { [KEYBOARD_ID]: 1 }, keys: withRec(1, 2) };
  assert.equal(publicRoom(room).keys, undefined, "보관함에만 있으면 싣지 않는다");
  const placed = place(room, KEYBOARD_ID, "b0")!;
  assert.ok(placed && validRoom(placed));
  const pub = publicRoom(placed);
  assert.equal(pub.keys?.length, KEY_COUNT);
  assert.deepEqual(pub.keys?.[1], { f: room.keys[1].face, s: REC, v: 2 });
  const back = roomFromPublic(pub, new Map());
  assert.deepEqual(back.placed, [{ at: "b0", it: KEYBOARD_ID, kb: 0 }]);
  assert.deepEqual(back.keys[1], room.keys[1]);
  assert.equal(roomFromPublic({ ...pub, keys: undefined }, new Map()).keys[0].sound, SILENT);
});

test("녹음 지우기: 공개를 끄거나 키보드를 치우면, 판은 남기고 처음 소리로", () => {
  const keys = withRec(3, 7);
  assert.deepEqual(recSlots(keys), [3]);
  assert.deepEqual(mustWipeRecs(keys, true, true), []);
  assert.deepEqual(mustWipeRecs(keys, false, true), [3]);
  assert.deepEqual(mustWipeRecs(keys, true, false), [3]);
  assert.deepEqual(mustWipeRecs(freshKeys(), false, false), []);
  const wiped = wipeRecs(keys, [3]);
  assert.deepEqual(wiped[3], { ...keys[3], sound: "orgel-hi", ver: 7 });
  assert.equal(nextVer(wiped[3]), 8, "다음 녹음은 새 판 — 캐시가 옛 목소리를 들려주지 않게");
  assert.equal(nextVer({ ...wiped[3], ver: KEY_VER_MAX }), KEY_VER_MAX);
});

test("녹음 경로: roomKeys/{uid}/{칸}-{판}.wav, storage.rules와 같은 모양", () => {
  assert.equal(recPath("u1", 0, 1), "roomKeys/u1/0-1.wav");
  assert.equal(recPath("u1", 3, KEY_VER_MAX), `roomKeys/u1/3-${KEY_VER_MAX}.wav`);
  assert.throws(() => recPath("u1", 4, 1));
  assert.throws(() => recPath("u1", 0, 0));
  assert.throws(() => recPath("u1", 0, KEY_VER_MAX + 1));

  const rules = readFileSync("storage.rules", "utf8");
  const block = rules.slice(rules.indexOf("match /roomKeys/{uid}/{fileId}"));
  assert.ok(block.length > 0);
  const m = /fileId\.matches\('([^']+)'\)/.exec(block);
  assert.ok(m, "파일 이름 검사가 있다");
  const ruleRe = new RegExp(m[1]);
  for (const name of ["0-1.wav", "3-9999999.wav", "2-40.wav"]) {
    assert.ok(ruleRe.test(name) && REC_FILE_RE.test(name), name);
  }
  for (const name of ["4-1.wav", "0-0.wav", "0-01.wav", "0-10000000.wav", "0-1.mp3", "0-1xwav", "../0-1.wav"]) {
    assert.equal(ruleRe.test(name), false, name);
    assert.equal(REC_FILE_RE.test(name), false, name);
  }
  assert.match(block, new RegExp(`request\\.resource\\.size < ${KEY_REC_MAX_BYTES / 1024} \\* 1024`));
  assert.match(block, /contentType == 'audio\/wav'/);
  assert.match(block, /allow update: if false/);
  assert.match(block, /resource == null/, "덮어쓰기 막기");
});

test("firestore.rules의 publicKeys()가 같은 모양을 본다", () => {
  const rules = readFileSync("firestore.rules", "utf8");
  const room = rules.slice(rules.indexOf("function publicRoom("));
  assert.match(room, /hasOnly\(\['size', 'wall', 'floor', 'mood', 'bgm', 'placed', 'keys'[^\]]*\]\)/);
  assert.match(room, /\(!\('keys' in r\) \|\| publicKeys\(r\.keys\)\)/);
  const fn = rules.slice(rules.indexOf("function publicKeys("));
  assert.match(fn, new RegExp(`k\\.size\\(\\) == ${KEY_COUNT}`));
  for (let i = 0; i < KEY_COUNT; i++) assert.match(fn, new RegExp(`publicKey\\(k\\[${i}\\]\\)`));
  const key = rules.slice(rules.indexOf("function publicKey("));
  assert.match(key, new RegExp(`k\\.f\\.matches\\('\\^\\[0-${PALETTE.length - 1}\\]\\{${FACE_CELLS}\\}\\$'\\)`));
  assert.match(key, new RegExp(`k\\.s\\.size\\(\\) <= ${KEY_SOUND_MAX}`));
  assert.match(key, new RegExp(`k\\.v <= ${KEY_VER_MAX}`));
  // 운영자 가리기: 운영자만 쓴다.
  const mod = rules.slice(rules.indexOf("match /mod/{docId}"));
  assert.match(mod, /allow create, update: if isAdmin\(\)/);
});

test("박자: 다음 8분음표에 맞춘다", () => {
  const eighth = 0.25;
  // 격자 …, 9.75, 10.0, 10.25, … (nextAt=10은 앞으로 올 음, 지난 격자도 같은 줄이다)
  assert.equal(snapTime(9.8, 10, eighth), 10);
  assert.equal(snapTime(9.6, 10, eighth), 9.75);
  assert.equal(snapTime(10.1, 10, eighth), 10.25);
  assert.equal(snapTime(9.995, 10, eighth), 10.25, "너무 가까우면 그다음 격자");
  assert.equal(snapTime(9.74, 10.5, eighth), 9.75, "스케줄러가 앞서 있어도 지난 격자로");
  const t = snapTime(3.33, 5, eighth);
  assert.ok(t >= 3.34 && t - 3.33 <= eighth + 0.01);
  assert.equal(snapTime(1, 2, 0), 1.01, "격자가 없으면 바로");
});

test("손가락 자판: 1–4, A S D F", () => {
  assert.deepEqual(["1", "2", "3", "4"].map(keyForCode), [0, 1, 2, 3]);
  assert.deepEqual(["a", "S", "d", "F"].map(keyForCode), [0, 1, 2, 3]);
  assert.equal(keyForCode("5"), null);
  assert.equal(keyForCode("g"), null);
});

test("키 그림: 여러 획과 모두 지우기를 열었을 때의 그림까지 되돌린다", () => {
  const original = paint(blankFace(), 5, 2, false);
  let state = initialFaceHistory(original);
  const stroke = (cells: number[], color: number, mirror = false) => {
    state = faceHistoryReducer(state, { type: "begin" });
    for (const cell of cells) state = faceHistoryReducer(state, { type: "paint", cell, color, mirror });
    state = faceHistoryReducer(state, { type: "end" });
  };
  stroke([0, 1, 2], 1);
  const first = state.face;
  stroke([12, 13], 3, true);
  const second = state.face;
  assert.equal(state.history.length, 2, "드래그 한 번은 한 단계");
  state = faceHistoryReducer(state, { type: "clear" });
  assert.equal(state.face, blankFace());
  for (const expected of [second, first, original]) {
    state = faceHistoryReducer(state, { type: "undo" });
    assert.equal(state.face, expected);
  }
  assert.equal(state.history.length, 0);
  assert.equal(faceHistoryReducer(state, { type: "undo" }), state);
});

test("키 그림: 바뀌지 않은 획은 기록하지 않고, 되돌린 뒤 새 획도 되돌린다", () => {
  let state = initialFaceHistory(blankFace());
  state = faceHistoryReducer(state, { type: "clear" });
  state = faceHistoryReducer(state, { type: "begin" });
  state = faceHistoryReducer(state, { type: "paint", cell: 0, color: 0, mirror: false });
  state = faceHistoryReducer(state, { type: "end" });
  assert.equal(state.history.length, 0);
  for (const cell of [0, 1, 2]) {
    state = faceHistoryReducer(state, { type: "begin" });
    state = faceHistoryReducer(state, { type: "paint", cell, color: 1, mirror: false });
    state = faceHistoryReducer(state, { type: "end" });
  }
  state = faceHistoryReducer(state, { type: "undo" });
  const afterUndo = state.face;
  state = faceHistoryReducer(state, { type: "begin" });
  state = faceHistoryReducer(state, { type: "paint", cell: 10, color: 4, mirror: false });
  state = faceHistoryReducer(state, { type: "end" });
  state = faceHistoryReducer(state, { type: "undo" });
  assert.equal(state.face, afterUndo);
  assert.equal(state.history.length, 2);
  state = faceHistoryReducer(state, { type: "undo" });
  state = faceHistoryReducer(state, { type: "undo" });
  assert.equal(state.face, blankFace());
});


test("여러 키보드: 그림·소리는 개체별로 저장하고 이동·보관·다시 읽기에도 유지한다", () => {
  let room = place({ ...freshRoom(), owned: { keyboard: 3 } }, KEYBOARD_ID, "b0")!;
  room = place(room, KEYBOARD_ID, "b2")!;
  const original = keyboardKeys(room, 0);
  const edited = keyboardKeys(room, 1).map((k, i) => i === 0 ? { ...k, face: "3".repeat(144), sound: "bird" } : k);
  room = withKeyboardKeys(room, 1, edited);
  assert.deepEqual(keyboardKeys(room, 0), original);
  assert.deepEqual(keyboardKeys(room, 1), edited);
  room = move(room, "b2", "f2")!;
  assert.equal(room.placed.find((p) => p.at === "f2")?.kb, 1);
  room = place(stow(room, "f2"), KEYBOARD_ID, "b2")!;
  assert.equal(room.placed.find((p) => p.at === "b2")?.kb, 1);
  room = normalizeRoom(JSON.parse(JSON.stringify(room)));
  assert.deepEqual(keyboardKeys(room, 1), edited);
  assert.deepEqual(keyboardKeys(room, 0), original);
  assert.ok(validRoom(room));
  const visited = roomFromPublic(publicRoom(room), new Map());
  for (const p of room.placed) {
    const visible = visited.placed.find((q) => q.at === p.at)!;
    assert.deepEqual(keyboardKeys(visited, visible.kb), keyboardKeys(room, p.kb));
  }
  // 0번을 치워도 공개된 다른 키보드의 키를 올바르게 복원한다.
  const onlySecond = publicRoom(stow(room, "b0"));
  assert.equal(onlySecond.keys, undefined);
  assert.deepEqual(roomFromPublic(onlySecond, new Map()).keys, edited);
  // 한 개체를 초기화해도 다른 개체는 그대로다.
  assert.deepEqual(withKeyboardKeys(room, 0, freshKeys()).keyboards?.[1], edited);
});

test("여러 키보드: 이전 방의 그림과 녹음은 복사하고 서로의 녹음을 삭제하지 않는다", () => {
  let room = normalizeRoom({ ...freshRoom(), keys: withRec(0, 7), owned: { keyboard: 2 }, placed: [
    { at: "b0", it: KEYBOARD_ID }, { at: "b2", it: KEYBOARD_ID },
  ] });
  assert.deepEqual(room.placed.map((p) => p.kb), [0, 1]);
  assert.deepEqual(keyboardKeys(room, 0), keyboardKeys(room, 1));
  assert.notEqual(keyboardKeys(room, 0), keyboardKeys(room, 1));
  assert.equal(sharedRecording(room, 0, 0, 7), true);
  assert.equal(nextRecordingVer(room), 8);
  const oneStowed = recordingCleanup(stow(room, "b0"), true);
  assert.deepEqual(oneStowed.targets, [{ keyboard: 0, slot: 0, ver: 7 }]);
  assert.deepEqual(oneStowed.deletions, [], "다른 키보드에서 쓰는 파일은 지우지 않는다");
  room = withKeyboardKeys(room, 1, withRec(0, nextRecordingVer(room)));
  assert.equal(keyboardKeys(room, 0)[0].ver, 7);
  assert.equal(keyboardKeys(room, 1)[0].ver, 8);
  assert.equal(sharedRecording(room, 0, 0, 7), false);
  assert.deepEqual(recordingCleanup(stow(room, "b0"), true).deletions, [{ keyboard: 0, slot: 0, ver: 7 }]);
  assert.equal(recordingCleanup(room, true).targets.length, 0);
  assert.equal(recordingCleanup(room, false).deletions.length, 2);
  const pub = roomFromPublic(publicRoom(room), new Map());
  assert.equal(keyboardKeys(pub, 0)[0].ver, 7);
  assert.equal(keyboardKeys(pub, 1)[0].ver, 8);
  assert.equal(nextRecordingVer(withKeyboardKeys(room, 1, withRec(0, KEY_VER_MAX - 1))), KEY_VER_MAX);
  assert.throws(() => nextRecordingVer(withKeyboardKeys(room, 1, withRec(0, KEY_VER_MAX))));
});

test("여러 키보드: 중복·범위 밖 개체 번호를 정리하고 저장 검증에서 거부한다", () => {
  const raw = { ...freshRoom(), owned: { keyboard: 2 }, placed: [
    { at: "b0", it: KEYBOARD_ID, kb: 1 }, { at: "b2", it: KEYBOARD_ID, kb: 1 },
  ] };
  assert.equal(validRoom(raw), false);
  const normalized = normalizeRoom(raw);
  assert.equal(validRoom(normalized), true);
  assert.equal(new Set(normalized.placed.map((p) => p.kb)).size, 2);
  assert.equal(keyboardBanks(normalizeRoom({ ...raw, keyboards: { "99": freshKeys() } })).length, 2);
});


test("추가 키보드 공개 압축: 그림·소리·녹음을 복원하고 잘못된 입력은 비운다", () => {
  const keys = withRec(2, 9999999);
  assert.deepEqual(unpackKeyboard(packKeyboard(keys)), keys);
  assert.deepEqual(unpackKeyboard(packKeyboard(keys).replace(":rec:", ":https://evil:")), blankKeys());
  assert.deepEqual(unpackKeyboard(null), blankKeys());
  assert.deepEqual(unpackKeyboard(packKeyboard(keys) + ";"), blankKeys());
});
