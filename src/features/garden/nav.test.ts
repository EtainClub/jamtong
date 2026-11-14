/**
 * 정원의 길과 새 소식 — `pnpm garden:test`.
 * 옛 ?tab= 값이 새 탭의 해당 칸으로 가는지, 홈의 새 소식이 지금 할 일을 말하는지 본다.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { BASKET_WARN_AT, defaultNav, homeNews, navOf, type NewsInput } from "./nav";
import type { Plant } from "./types";

const KST = 9 * 3_600_000;
/** 2026-11-17(화) 10:00 한국 시각 — 단비(12:30)·별똥별(수 21:00)과 멀다. */
const NOW = Date.UTC(2026, 10, 17, 10) - KST;
const plant = (ripeAt: number): Plant => ({ id: "p", speciesId: "w:x", plantedAt: NOW - 1, ripeAt, speed: 1, harvests: 0 });
const input = (over: Partial<NewsInput> = {}): NewsInput => ({ beds: [null], basket: 0, basketMax: 120, plaza: "normal", nectar: 0, ...over });

test("옛 탭 이름은 새 탭의 해당 칸으로 간다", () => {
  assert.deepEqual(navOf("flowers"), { tab: "plaza", seg: "flowers" });
  assert.deepEqual(navOf("greenhouse"), { tab: "beds", seg: "greenhouse" });
  assert.deepEqual(navOf("dex"), { tab: "room", seg: "dex" });
  assert.deepEqual(navOf("neighbors"), { tab: "friends", seg: "friends" });
  assert.deepEqual(navOf("plaza"), { tab: "plaza", seg: "plaza" }, "같이 잡자 링크(/r/…)");
  assert.deepEqual(navOf("beds"), { tab: "beds", seg: "beds" });
  assert.deepEqual(navOf("shop"), { tab: "shop", seg: "shop" });
  assert.deepEqual(navOf("room"), { tab: "room", seg: "room" });
  assert.deepEqual(navOf("guestbook"), { tab: "room", seg: "guestbook" });
  assert.equal(navOf("nope"), null);
  assert.equal(navOf(null), null);
});

test("첫 수확 전에는 텃밭부터, 그 뒤로는 방부터 연다", () => {
  assert.deepEqual(defaultNav(false), { tab: "beds", seg: "beds" });
  assert.deepEqual(defaultNav(true), { tab: "room", seg: "room" });
});

test("새 소식: 익은 밭이 맨 위, 아무것도 없으면 가장 먼저 익는 것", () => {
  const news = homeNews(input({ beds: [plant(NOW - 1), plant(NOW + 5 * 60_000)] }), NOW);
  assert.equal(news[0].key, "ripe");
  assert.equal(news[0].go, "beds");
  assert.ok(!news.some((n) => n.key === "next"));
  const waiting = homeNews(input({ beds: [plant(NOW + 7 * 60_000), null] }), NOW);
  assert.deepEqual(waiting.map((n) => n.key), ["next"]);
  assert.match(waiting[0].text, /7분 뒤/);
  assert.deepEqual(homeNews(input(), NOW).map((n) => n.key), ["empty"]);
});

test("새 소식: 광장·꽃꿀·바구니·덧붙인 소식이 제 자리로 보낸다", () => {
  const news = homeNews(
    input({
      plaza: "overgrown",
      nectar: 2,
      basket: BASKET_WARN_AT,
      extra: [{ key: "guestbook", icon: "📮", text: "방명록 2", go: "guestbook", goLabel: "방명록" }],
    }),
    NOW,
  );
  const by = new Map(news.map((n) => [n.key, n]));
  assert.equal(by.get("overgrown")?.go, "plaza");
  assert.equal(by.get("nectar")?.go, "flowers");
  assert.equal(by.get("basket")?.go, "beds");
  assert.equal(by.get("guestbook")?.go, "guestbook");
  assert.equal(homeNews(input({ raid: { active: true } }), NOW)[0].key, "raid");
  assert.ok(!homeNews(input({ basket: BASKET_WARN_AT - 1 }), NOW).some((n) => n.key === "basket"));
});

test("새 소식: 단비가 가까우면 알리고, 오는 중이면 남은 시간을", () => {
  const before = Date.UTC(2026, 10, 17, 12, 0) - KST;
  assert.match(homeNews(input(), before).find((n) => n.key === "rain")?.text ?? "", /단비 30분 뒤/);
  const during = Date.UTC(2026, 10, 17, 12, 33) - KST;
  assert.match(homeNews(input(), during).find((n) => n.key === "rain")?.text ?? "", /오는 중/);
  assert.equal(homeNews(input(), NOW).find((n) => n.key === "rain"), undefined);
});
