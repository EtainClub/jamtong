/**
 * 방명록·1촌평 걸러내기 — `pnpm garden:test`.
 * 링크·연락처 모양은 막고, 보통 말은 지나가게 한다.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { TEXT_MAX } from "./rules";
import { cleanLine, lineProblem } from "./text";

test("한 줄로 접는다", () => {
  assert.equal(cleanLine("  안녕\n  하세요  "), "안녕 하세요");
});

test("보통 말은 지나간다", () => {
  for (const ok of [
    "화분이 정말 예뻐요",
    "황금 화분 3개 부러워요!",
    "꽃씨 바구니가 가득하네요",
    "아이디어가 좋아요",
    "2026년 11월 14일에 왔어요",
    "물 5번 다 줬어요 ㅎㅎ",
    "시발점이 어디였을까요",
    "잼 1,200개 모았어요",
  ]) {
    assert.equal(lineProblem(cleanLine(ok)), null, ok);
  }
});

test("길이: 비었거나 60자를 넘으면 안 된다", () => {
  assert.equal(lineProblem(""), "empty");
  assert.equal(lineProblem("가".repeat(TEXT_MAX)), null);
  assert.equal(lineProblem("가".repeat(TEXT_MAX + 1)), "long");
});

test("링크를 막는다", () => {
  for (const bad of ["https://example.com", "www.naver.com 와요", "jamtong . kr 가자", "open.kakao.com/o/abc", "bit.ly/xyz", "오픈 kakao 방"]) {
    assert.equal(lineProblem(cleanLine(bad)), bad.includes("오픈 kakao") ? "contact" : "link", bad);
  }
});

test("연락처·메신저 아이디를 막는다", () => {
  for (const bad of [
    "010-1234-5678",
    "01012345678",
    "010 1234 5678로 연락",
    "공일공 일이삼사",
    "@jamtong_fan 팔로우",
    "카톡 주세요",
    "카카오톡 아이디 abc",
    "오픈채팅 들어와요",
    "텔레그램으로",
    "인스타 놀러와",
    "dm 주세요",
    "아이디 abc123",
    "id: hello",
    "메일 a@b.com",
  ]) {
    assert.ok(["contact", "link"].includes(lineProblem(cleanLine(bad)) ?? ""), bad);
  }
});

test("욕을 막는다 — 빈칸·숫자를 끼워도", () => {
  for (const bad of ["씨발", "씨 발", "씨1발", "병신아", "ㅅㅂ", "FUCK"]) {
    assert.equal(lineProblem(cleanLine(bad)), "swear", bad);
  }
});
