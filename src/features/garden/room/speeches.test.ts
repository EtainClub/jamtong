/**
 * 연설 상영관(room/speeches.ts) — `pnpm garden:test`.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { STATEMENTS } from "@/content/words";

import { activityOf, PLAY_FURNITURE } from "./activities";
import { ISO } from "./iso";
import { buildSpeeches, youtubeId } from "./speeches";

test("유튜브 주소에서 영상 id를 뽑고, 모르는 모양은 null", () => {
  assert.equal(youtubeId("https://www.youtube.com/watch?v=M6cPQ84zVrI"), "M6cPQ84zVrI");
  assert.equal(youtubeId("https://www.youtube.com/live/7i_0jYPo7zo"), "7i_0jYPo7zo");
  assert.equal(youtubeId("https://youtu.be/tMdmb8qV_A0?t=3"), "tMdmb8qV_A0");
  assert.equal(youtubeId("https://www.youtube.com/watch?v=bad"), null);
  assert.equal(youtubeId("https://example.com/watch?v=M6cPQ84zVrI"), null);
  assert.equal(youtubeId("not a url"), null);
});

test("상영관 목록: 연설만, 같은 영상은 한 번, 최근이 먼저", () => {
  const list = buildSpeeches(STATEMENTS);
  assert.ok(list.length > 0);
  const slugs = new Set(STATEMENTS.filter((s) => s.kind === "speech").map((s) => s.slug));
  assert.ok(list.every((s) => slugs.has(s.slug)), "연설만");
  assert.equal(new Set(list.map((s) => s.video)).size, list.length, "같은 영상은 한 번");
  assert.ok(list.every((s, i) => i === 0 || list[i - 1].postedAt >= s.postedAt), "최근이 먼저");
  assert.ok(!list.some((s) => s.slug === "budget-post-2027"), "영상을 알린 SNS 글은 빠진다");
});

test("연설 상영관 가구: 10,000잼, 누르면 상영관, 아이소 크기가 있다", () => {
  const f = PLAY_FURNITURE.find((x) => x.id === "speech-screen");
  assert.equal(f?.price, 10_000);
  assert.equal(activityOf("speech-screen")?.speeches, true);
  assert.ok(ISO["speech-screen"]);
});
