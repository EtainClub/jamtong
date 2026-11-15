import { hash, type RaidKindId, type RaidWave } from "../rules";

/**
 * 거대 잡초의 세 형태와 대기술 시각표 — 순수 함수만 둔다(forms.test.ts).
 * 설계는 docs/garden-raid-boss.md §2·§3.5.
 *
 * ★ 3.0 물결의 형태는 물결 문서에 있다(rules.ts의 RaidV3 — 변신 커밋이 올린다). 2.0 물결은 형태가 없어
 *   남은 체력에서 셈해 그림만 바꾼다(raidFormByHp).
 * ★ 대기술은 태어난 시각과 물결 id에서 정해진다. 아무것도 쓰지 않아도 모두가 같은 때 같은 예고를 본다
 *   (기기 시계가 어긋난 만큼은 어긋난다 — 결과에 닿지 않으므로 받아들인다).
 */

export type RaidForm = 1 | 2 | 3;

/** 2.0 물결: 남은 체력이 이 비율 아래로 내려가면 2형·3형으로 그린다. */
export const FORM_BELOW = [0.6, 0.25] as const;

export function raidFormByHp(hits: number, hp: number): RaidForm {
  const left = 1 - Math.min(Math.max(hits, 0), hp) / hp;
  return left > FORM_BELOW[0] ? 1 : left > FORM_BELOW[1] ? 2 : 3;
}

/** 지금 형태. 3.0 물결은 문서의 형태, 2.0 물결은 남은 체력에서. */
export function raidForm(r: RaidWave): RaidForm {
  return r.v3 ? r.v3.form : raidFormByHp(r.hits, r.hp);
}

/** 형태마다 몸이 커지는 배수. 2형은 칸을 넘고, 3형은 화면 전체 무대에 선다. */
export const FORM_SCALE: Record<RaidForm, number> = { 1: 1, 2: 1.35, 3: 1.8 };

export const FORM_ORDER: Record<RaidForm, string> = { 1: "제1형", 2: "제2형 · 각성", 3: "제3형 · 최종" };

/** 형태의 이름. 1형은 종류 이름(RAID_KINDS) 그대로다. */
export const FORM_NAMES: Record<RaidKindId, [string, string, string]> = {
  troll: ["악플 가시풀", "자판 갑주 가시풀", "익명의 가시 군주"],
  hate: ["혐오 쐐기풀", "불씨 쐐기풀", "갈라치는 쌍두 쐐기"],
  rumor: ["가짜뉴스 덩굴", "속보 덩굴", "천 개의 입 카더라"],
  bribe: ["검은돈 독초", "금고 독초", "황금 가면 독룡"],
  bossy: ["갑질 엉겅퀴", "왕관 엉겅퀴", "옥좌의 폭군"],
  grab: ["땅투기 칡", "울타리 칡", "광장을 삼키는 칡 거수"],
};

export function formName(kind: RaidKindId, form: RaidForm): string {
  return FORM_NAMES[kind][form - 1];
}

/** 변신 컷이 떠 있는 시간. */
export const FORM_CUT_MS = 2_200;

// ── 대기술 (§3.5) ────────────────────────────────────────────────────

/** 대기술 사이(형태마다). 뒤로 갈수록 잦다. */
export const SKILL_EVERY: Record<RaidForm, number> = { 1: 45_000, 2: 35_000, 3: 25_000 };
/** 폭주 때는 이만큼 더 잦다. */
export const SKILL_FRENZY = 0.6;
/** 예고가 떠 있는 시간. 이 안에 눌러야 피한다. */
export const SKILL_WARN_MS = 3_000;

/**
 * after보다 뒤의 첫 대기술 시각. 태어난 때부터 시간을 같은 길이의 칸으로 나누고, 칸마다 물결 id에서 정한
 * 자리(칸의 20–80%)에 하나씩 둔다. 형태·폭주가 바뀌면 칸의 길이가 달라지지만, 같은 것을 보는 사람끼리는 늘 같다.
 */
export function nextSkillAt(id: string, form: RaidForm, frenzy: boolean, spawnedAt: number, after: number): number {
  const every = Math.round(SKILL_EVERY[form] * (frenzy ? SKILL_FRENZY : 1));
  const at = (slot: number) => spawnedAt + slot * every + Math.round(every * (0.2 + ((hash(`skill:${id}:${every}:${slot}`) % 1000) / 1000) * 0.6));
  let slot = Math.max(0, Math.floor((after - spawnedAt) / every));
  while (at(slot) <= after) slot += 1;
  return at(slot);
}
