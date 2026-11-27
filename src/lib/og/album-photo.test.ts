import assert from "node:assert/strict";
import { test } from "node:test";

import { STATEMENTS } from "@/content/words";
import { buildCatalog } from "@/features/garden/catalog";

import { loadPhotoAnchor, photoCaption } from "./album-photo";

test("사진 링크 미리보기 제목은 콘텐츠에서만 꺼낸다", () => {
  const ach = buildCatalog().find((s) => s.id.startsWith("a:"))!;
  assert.equal(photoCaption(ach.id), `업적 「${ach.title}」`);
  assert.equal(photoCaption(`${ach.id}/scene1`), `카툰 「${ach.title}」 한 칸`);
  const w = STATEMENTS[0];
  assert.equal(photoCaption(`w:${w.slug}`), `언행 「${w.title}」`);
  assert.equal(photoCaption("m:room"), "방 사진");
  assert.equal(photoCaption("a:no-such-thing"), "업적 카드", "없는 업적은 종류만");
  assert.equal(photoCaption("<script>"), "사진첩 사진", "앵커가 아니면 아무 글도 싣지 않는다");
});

test("사진 링크는 모양이 틀린 id로 Firestore를 부르지 않는다", async () => {
  assert.equal(await loadPhotoAnchor("nope", "abcdef12"), null);
  assert.equal(await loadPhotoAnchor("gabcdefgh1", "../x"), null);
});
