/**
 * 거대 잡초의 형태와 대기술 시각표 — `pnpm garden:test`.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { RAID_KINDS } from "../rules";
import { FORM_NAMES, FORM_SCALE, formName, nextSkillAt, raidForm, raidFormByHp, SKILL_EVERY, SKILL_FRENZY } from "./forms";

test("2.0 물결의 형태는 남은 체력에서 — 60% 아래 2형, 25% 아래 3형", () => {
  assert.equal(raidFormByHp(0, 360), 1);
  assert.equal(raidFormByHp(143, 360), 1);
  assert.equal(raidFormByHp(144, 360), 2, "남은 체력 60%");
  assert.equal(raidFormByHp(269, 360), 2);
  assert.equal(raidFormByHp(270, 360), 3, "남은 체력 25%");
  assert.equal(raidFormByHp(999, 360), 3, "넘치게 맞아도 3형");
  assert.equal(raidFormByHp(-5, 360), 1);
});

test("3.0 물결의 형태는 문서에 있다 — 체력이 얼마 남았든", () => {
  const base = { hp: 378, hits: 370, fighters: 3, spawnedAt: 0, defeatedAt: null };
  const v3 = { formAt: 0, size: 540, n: 540, brk: 162, grd: 0, base: { h: 0, b: 0, g: 0 }, brkHits: 0, grdHits: 0 };
  assert.equal(raidForm({ ...base, v3: { ...v3, form: 1 } }), 1);
  assert.equal(raidForm({ ...base, v3: { ...v3, form: 2 } }), 2);
  assert.equal(raidForm(base), 3, "2.0 물결은 체력에서");
});

test("형태가 오를수록 커지고, 종류마다 세 이름이 있다", () => {
  assert.ok(FORM_SCALE[1] < FORM_SCALE[2] && FORM_SCALE[2] < FORM_SCALE[3]);
  for (const kind of RAID_KINDS) {
    assert.equal(FORM_NAMES[kind.id].length, 3);
    assert.equal(formName(kind.id, 1), kind.name, "1형은 종류 이름 그대로");
    assert.equal(new Set(FORM_NAMES[kind.id]).size, 3);
  }
});

test("대기술은 태어난 시각과 물결 id에서 정해져 모두에게 같다", () => {
  const born = Date.UTC(2026, 10, 16, 2, 0);
  const a = nextSkillAt("20773-2", 1, false, born, born + 100_000);
  assert.equal(a, nextSkillAt("20773-2", 1, false, born, born + 100_000));
  // 같은 칸 안에서 조금 일찍 물어도 같은 답이다.
  assert.equal(nextSkillAt("20773-2", 1, false, born, a - 1), a);
  assert.ok(a > born + 100_000);
  // 지나면 다음 것으로 넘어간다.
  const b = nextSkillAt("20773-2", 1, false, born, a);
  assert.ok(b > a);
  assert.notEqual(nextSkillAt("20773-3", 1, false, born, born + 100_000), a, "물결이 다르면 때가 다르다");
});

test("대기술은 칸마다 하나, 칸의 20–80% 자리에 온다 — 형태가 오르거나 폭주면 잦다", () => {
  const born = 1_000_000;
  for (const form of [1, 2, 3] as const) {
    for (const frenzy of [false, true]) {
      const every = Math.round(SKILL_EVERY[form] * (frenzy ? SKILL_FRENZY : 1));
      let t = born;
      for (let i = 0; i < 20; i++) {
        const next = nextSkillAt("20773-1", form, frenzy, born, t);
        const into = (next - born) % every;
        assert.ok(into >= every * 0.2 - 1 && into <= every * 0.8 + 1, `${form} ${frenzy} ${into}`);
        assert.ok(next - t <= every * 1.6 + 1, "두 칸을 넘겨 비지 않는다");
        t = next;
      }
    }
  }
  assert.ok(SKILL_EVERY[1] > SKILL_EVERY[2] && SKILL_EVERY[2] > SKILL_EVERY[3]);
});
