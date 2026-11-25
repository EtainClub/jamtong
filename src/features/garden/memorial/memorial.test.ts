import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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

test("O/X 문항: 업적마다 O·X 둘씩, 근거 claim이 실재하고, 확인 전 claim으로 O를 만들지 않는다", async () => {
  const { ACHIEVEMENT_OX } = await import("../../../content/quizzes/ox");
  for (const e of entries) {
    const items = ACHIEVEMENT_OX[e.slug];
    assert.ok(items && items.length >= 4, `${e.slug}: 문항이 넷 이상`);
    assert.equal(items.filter((q) => q.answer).length, items.filter((q) => !q.answer).length, `${e.slug}: O와 X가 같은 수`);
    assert.equal(new Set(items.map((q) => q.id)).size, items.length, `${e.slug}: 문항 id가 겹치지 않는다`);
    const a = achievements.get(e.slug)!;
    for (const q of items) {
      for (const id of q.claimIds) {
        const claim = a.claims.find((c) => c.id === id);
        assert.ok(claim, `${e.slug} ${q.id}: 없는 claim ${id}`);
        if (q.answer) assert.ok(claim.verified, `${e.slug} ${q.id}: 확인 전 claim(${id})으로 O 문항을 만들지 않는다`);
      }
      // 숫자 맞히기가 아니다 — 문장의 대부분이 숫자면 안 된다.
      assert.ok((q.statement.match(/[0-9]/g) ?? []).length <= 6, `${e.slug} ${q.id}: 숫자를 묻는 문항 같다 — ${q.statement}`);
    }
    assert.equal(e.ox.length, items.length, `${e.slug}: 기념관 자료에 문항이 모두 실린다`);
  }
  assert.deepEqual(Object.keys(ACHIEVEMENT_OX).filter((slug) => !achievements.has(slug)), [], "없는 업적의 문항이 없다");
});

test("O/X 퀴즈: 문항에서만 뽑고, 앵커가 실재하며, O·X가 고루 나온다", async () => {
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
    assert.ok(q, "문항이 있으면 늘 만든다");
    const e = entries.find((x) => x.slug === q.slug)!;
    assert.ok(e.ox.some((o) => o.statement === q.statement && o.answer === q.answer), `${q.statement}: 그 업적의 문항이다`);
    if (q.answer) yes++;
    else no++;
    const [slug, claimId] = q.anchor.split("#");
    assert.ok(achievements.get(slug)!.claims.some((c) => c.id === claimId), q.anchor);
  }
  assert.ok(yes > 120 && no > 120, `O ${yes} · X ${no} — 반반쯤`);
  assert.equal(makeOx(entries.map((e) => ({ ...e, ox: [] })), rand), null, "문항이 없으면 내지 않는다");
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

// ── 업적 카툰 (docs/garden-cartoon-review.md) ─────────────────────────

test("카툰: 모든 장면에 그림이 있을 때만 열리고, 칸마다 그 업적의 claim을 가리킨다", () => {
  for (const e of entries) {
    const a = achievements.get(e.slug)!;
    const scenes = a.eli5?.scenes ?? [];
    const drawn = scenes.filter((s) => existsSync(join(process.cwd(), "public", "cartoons", e.slug, `${s.id}.webp`)));
    if (!e.cartoon) {
      assert.ok(scenes.length === 0 || drawn.length < scenes.length, `${e.slug}: 다 그렸는데 카툰이 없다`);
      continue;
    }
    assert.equal(e.cartoon.panels.length, scenes.length, `${e.slug}: 반쯤 그린 카툰`);
    e.cartoon.panels.forEach((p, i) => {
      assert.equal(p.id, scenes[i].id);
      assert.equal(p.say, scenes[i].say, "말풍선은 쉬운 설명 문장 그대로");
      assert.ok(existsSync(join(process.cwd(), "public", p.image)), p.image);
      for (const anchor of p.anchors) {
        const [slug, claimId] = anchor.split("#");
        assert.ok(slug === e.slug && a.claims.some((c) => c.id === claimId), anchor);
      }
    });
    // 공유 파일은 Storage에 있다 — 저장소에 두지 않는다.
    for (const f of [e.cartoon.gif, e.cartoon.mp4]) if (f) assert.match(f, /^https:\/\/firebasestorage\.googleapis\.com\/.+\/cartoons%2F/, f);
    for (const name of ["cartoon.gif", "cartoon.mp4"]) assert.ok(!existsSync(join(process.cwd(), "public", "cartoons", e.slug, name)), `${e.slug}/${name}: 공유 파일이 저장소에 있다`);
  }
});

test("카툰 그림마다 만든 기록(prompts.json)이 있다", () => {
  for (const e of entries.filter((x) => x.cartoon)) {
    const log = join(process.cwd(), "public", "cartoons", e.slug, "prompts.json");
    assert.ok(existsSync(log), `${e.slug}: prompts.json`);
    const records = JSON.parse(readFileSync(log, "utf8")) as Record<string, { tool: string; prompt: string }>;
    for (const p of e.cartoon!.panels) assert.ok(records[p.id]?.prompt, `${e.slug}/${p.id}: 프롬프트 기록`);
  }
});
