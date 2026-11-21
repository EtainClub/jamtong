import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { getPublishedAchievements } from "@/content/achievements";
import { MILESTONES } from "@/content/milestones";

import { buildMemorial, souvenirStatus } from "./build";

/**
 * 업적 기념관·사진첩의 자료(docs/garden-achievement-strategy.md §3).
 * 글을 짓지 않고, 오답 보기도 다른 업적의 실제 숫자이며, 모든 줄에 앵커가 붙는가.
 */
const entries = buildMemorial();
const achievements = new Map(getPublishedAchievements().map((a) => [a.slug, a]));

test("공개된 업적마다 기념관에 한 칸 — 핵심 숫자가 있는 업적은 빠지지 않는다", () => {
  const withNumbers = [...achievements.values()].filter((a) => a.keyNumbers.length > 0).map((a) => a.slug).sort();
  assert.deepEqual(entries.map((e) => e.slug).sort(), withNumbers);
  for (const e of entries) assert.equal(e.speciesId, `a:${e.slug}`);
});

test("모든 사실 줄은 그 업적의 claim을 가리킨다 — 층(CLAIM이면 누구의 주장인지)을 물려받는다", () => {
  for (const e of entries) {
    const a = achievements.get(e.slug)!;
    assert.ok(e.facts.length >= 1 && e.facts.length <= 3, e.slug);
    for (const f of e.facts) {
      const [slug, claimId] = f.anchor.split("#");
      assert.equal(slug, e.slug);
      const claim = a.claims.find((c) => c.id === claimId);
      assert.ok(claim, `${f.anchor}: claim이 없다`);
      assert.equal(f.type, claim!.assertionType);
      assert.equal(f.verified, claim!.verified);
      if (claim!.assertionType === "CLAIM") assert.equal(f.by, claim!.assertedBy, f.anchor);
    }
  }
});

test("문제: 보기 셋, 답 하나. 답은 이 업적의 대표 숫자, 오답은 다른 업적의 실제 대표 숫자", () => {
  const headText = new Map(entries.map((e) => [e.slug, e.facts[0]]));
  for (const e of entries) {
    const opts = e.quiz.options;
    assert.equal(opts.length, 3, e.slug);
    assert.equal(opts.filter((o) => o.answer).length, 1, e.slug);
    assert.equal(new Set(opts.map((o) => o.text)).size, 3, `${e.slug}: 보기가 겹친다`);
    const right = opts.find((o) => o.answer)!;
    assert.ok(right.text.startsWith(`${e.facts[0].label} ${e.facts[0].value}`), e.slug);
    assert.equal(e.quiz.anchor, e.facts[0].anchor);
    for (const o of opts.filter((x) => !x.answer)) {
      const from = entries.find((x) => x.title === o.from);
      assert.ok(from && from.slug !== e.slug, `${e.slug}: 오답의 출처가 다른 업적이 아니다`);
      const head = headText.get(from!.slug)!;
      assert.ok(o.text.startsWith(`${head.label} ${head.value}`), `${e.slug}: 오답이 그 업적의 실제 숫자가 아니다`);
    }
  }
});

test("사진은 실제 파일이거나 그 업적의 공유 카드다. 삽화는 삽화라고 표시한다", () => {
  for (const e of entries) {
    if (e.photo.kind === "illustration") assert.ok(existsSync(join(process.cwd(), "public", e.photo.src)), `${e.slug}: ${e.photo.src}`);
    else assert.equal(e.photo.src, `/achievement/${e.slug}/opengraph-image`);
  }
});

test("진행 상태는 이어진 성과 카드가 있을 때만 — 없으면 모른다(null)", () => {
  for (const e of entries) {
    const linked = MILESTONES.some((m) => m.achievementSlug === e.slug);
    assert.equal(e.status === null, !linked, e.slug);
    assert.equal(e.status, souvenirStatus(e.slug));
  }
});

// ── 잡초 O/X 퀴즈 ────────────────────────────────────────────────────

test("O/X 퀴즈: O는 그 업적의 실제 숫자, X는 다른 업적의 실제 숫자 — 틀린 숫자를 지어내지 않는다", async () => {
  const { makeOx } = await import("./ox");
  let seed = 1;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  let yes = 0;
  let no = 0;
  for (let i = 0; i < 400; i++) {
    const q = makeOx(entries, rand)!;
    assert.ok(q, "업적이 넉넉하면 늘 만든다");
    const e = entries.find((x) => x.slug === q.slug)!;
    const value = /‘(.+)’/.exec(q.statement)![1];
    const own = e.facts.map((f) => f.value);
    if (q.answer) {
      yes++;
      assert.ok(own.includes(value), `${q.statement}: O인데 이 업적의 숫자가 아니다`);
    } else {
      no++;
      assert.ok(!own.includes(value), `${q.statement}: X인데 이 업적의 숫자다`);
      assert.ok(entries.some((x) => x.slug !== e.slug && x.facts[0].value === value), "X의 숫자는 다른 업적의 대표 숫자다");
    }
    const [slug, claimId] = q.anchor.split("#");
    assert.ok(achievements.get(slug)!.claims.some((c) => c.id === claimId), q.anchor);
  }
  assert.ok(yes > 100 && no > 100, `O ${yes} · X ${no} — 반반쯤`);
  assert.equal(makeOx(entries.slice(0, 1), rand), null);
});

test("선물 가구: 늘 파는 방 가구만, 같은 확률, 가진 수 상한을 넘지 않는다", async () => {
  const { giftPool, pickGift, GIFT_PRICE_MAX } = await import("./ox");
  const { freshRoom, giftItem, OWN_MAX } = await import("../room/rules");
  const pool = giftPool();
  assert.ok(pool.length >= 10, `고를 것이 넉넉하다(${pool.length})`);
  for (const f of pool) {
    assert.ok(["floor", "wall", "window"].includes(f.kind), f.id);
    assert.ok(f.price > 0 && f.price <= GIFT_PRICE_MAX && !f.cur && !f.weekly && !f.reading, f.id);
  }
  const room = freshRoom();
  const full = { ...room, owned: Object.fromEntries(pool.map((f) => [f.id, OWN_MAX])) };
  assert.equal(pickGift(full, () => 0.5), null, "다 가졌으면 선물이 없다");
  assert.equal(giftItem(full, pool[0].id), null);
  const one = { ...full, owned: { ...full.owned, [pool[3].id]: OWN_MAX - 1 } };
  assert.equal(pickGift(one, () => 0.99)?.id, pool[3].id, "상한에 닿지 않은 것만 고른다");
  assert.equal(giftItem(room, pool[0].id)!.owned[pool[0].id], 1);
});
