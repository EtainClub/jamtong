/**
 * 초대 씨앗 — `pnpm garden:test`. 규칙(firestore.rules)의 코드 모양과도 대조한다.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { canAcceptInvite, INVITE_CAP, INVITE_CODE, invitePending, newInviteCode, openInviteBox, rng } from "./rules";
import type { Species } from "./types";

const sp = (id: string, tier: Species["tier"]): Species => ({ id, tier, title: id, href: "", notes: [], seed: 1, region: "words", links: [] });
const catalog = [sp("s1", "sprout"), sp("c1", "common"), sp("f1", "flagship"), sp("f2", "flagship"), sp("p1", "perennial")];

test("초대 코드는 모양이 정해져 있고 공개 id와 겹치지 않는다", () => {
  const random = rng(7);
  for (let i = 0; i < 200; i++) assert.match(newInviteCode(random), INVITE_CODE);
  assert.ok(!INVITE_CODE.test("gabcdefghij"), "공개 id(g…)는 초대 코드가 아니다");
  assert.ok(!INVITE_CODE.test("iABCDEFGHIJ"));
  assert.ok(!INVITE_CODE.test("i123"));
});

test("firestore.rules가 같은 코드 모양을 쓴다", () => {
  const rules = readFileSync("firestore.rules", "utf8");
  const pattern = `'${INVITE_CODE.source}'`;
  assert.equal(rules.split(pattern).length - 1, 2, `inviteCodes와 invites 둘 다 ${pattern}`);
});

test("초대한 사람은 평생 INVITE_CAP명까지만 받는다", () => {
  assert.equal(invitePending(0, 0), 0);
  assert.equal(invitePending(3, 1), 2);
  assert.equal(invitePending(50, 0), INVITE_CAP);
  assert.equal(invitePending(50, INVITE_CAP), 0);
  assert.equal(invitePending(2, 5), 0, "받은 것보다 적게 세어져도 음수가 아니다");
});

test("새 정원만, 한 번만, 내 코드가 아닐 때만 초대를 받는다", () => {
  const code = "iabcdefghij";
  const fresh = { dex: {}, invite: { code: null, by: null } };
  assert.ok(canAcceptInvite(fresh, code));
  assert.ok(!canAcceptInvite({ ...fresh, dex: { x: [] } }, code), "이미 거둔 정원");
  assert.ok(!canAcceptInvite({ ...fresh, invite: { code: null, by: "izzzzzzzzzz" } }, code), "이미 초대받음");
  assert.ok(!canAcceptInvite({ ...fresh, invite: { code, by: null } }, code), "내 코드");
  assert.ok(!canAcceptInvite(fresh, "gabcdefghij"), "코드 모양이 아니다");
});

test("초대 상자는 업적·다년생 씨앗이고, 열쇠가 같으면 같다", () => {
  for (let i = 0; i < 50; i++) {
    const s = openInviteBox(`k${i}`, catalog);
    assert.ok(s && (s.tier === "flagship" || s.tier === "perennial"), s?.id);
  }
  assert.equal(openInviteBox("same", catalog)?.id, openInviteBox("same", catalog)?.id);
});
