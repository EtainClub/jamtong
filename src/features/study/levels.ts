/**
 * 잼공의 다섯 단계 — 알기 · 가리기 · 따지기 · 답하기 · 말하기. 설계는 docs/jamgong-roadmap.md §3·§4.
 * 순수 함수만 둔다(study.test.ts).
 *
 * ★ 1단계(알기)가 1차 목적이다. 거기 머무는 사람도 성공이다 — 다음 단계는 초대할 뿐 재촉하지 않는다.
 * ★ 단계는 "해 본 것"으로 열린다. 점수가 아니다. 내려가는 일은 없다.
 * ★ 문항이 없는 단계로는 초대하지 않는다. 지금은 알기 문항뿐이라 초대가 뜨지 않는다 — R2에서 가리기 문항이 들어오면 켜진다.
 * ★ 건너뛰기 점검은 4단계(답하기)가 생긴 뒤에 둔다(운영자 결정, 2026-11-28) — R3에서 켰다(skipTargets).
 */
import { addDays, pickSession, type Box } from "./rules";
import { LEVEL_OF, type Level, type StudyBank } from "./types";

export const LEVEL_MAX: Level = 5;

/** 다음 단계 초대가 뜨는 조건 — 지금 단계에서 해 본 것. key는 초대할 단계. */
export const INVITE_AFTER: Record<Exclude<Level, 1>, { cards?: number; answered?: number; label: string }> = {
  2: { cards: 10, label: "근거 카드 10장을 모았어요" },
  3: { answered: 20, label: "가리기 문제를 20개 풀었어요" },
  4: { answered: 20, label: "따지기 문제를 20개 풀었어요" },
  5: { answered: 10, label: "답하기 연습을 10번 했어요" },
};

/** 초대를 거절하면 다시 묻기까지 쉬는 날. */
export const INVITE_REST_DAYS = 14;

/** 단계마다 한 판의 문제 수. 처음 온 사람에게는 가장 짧게(2분 남짓). 답하기·말하기는 문제 하나가 무거워 적게. */
export function sessionSize(level: Level): number {
  return level === 1 ? 5 : level >= 4 ? 6 : 8;
}

export function itemLevel(bank: StudyBank, itemId: string): Level {
  const item = bank.items.find((i) => i.id === itemId);
  return item ? LEVEL_OF[item.step] : 1;
}

/** 그 단계 문항이 콘텐츠에 있는가. 없으면 그 단계로 초대하지 않는다. */
export function levelReady(bank: StudyBank, level: Level): boolean {
  return bank.items.some((i) => LEVEL_OF[i.step] === level);
}

export interface LevelState {
  level: Level;
  /** 「지금 단계에 머물기」. 켜 두면 초대하지 않는다. */
  stay: boolean;
  /** 마지막으로 초대를 거절한 날. */
  declinedOn?: string;
}

/**
 * 지금 띄울 초대 — 다음 단계 번호, 없으면 null.
 * 다음 단계 문항이 있고, 지금 단계에서 조건만큼 해 봤고, 머물기가 꺼져 있고, 거절한 지 14일이 지났을 때.
 */
export function inviteFor(
  bank: StudyBank,
  state: LevelState,
  boxes: Record<string, Box>,
  wallet: string[],
  today: string,
): Level | null {
  if (state.stay || state.level >= LEVEL_MAX) return null;
  // 다음 단계 가운데 문항이 있는 첫 단계. 비어 있는 단계(예: 3단계 따지기를 만들기 전)는 건너뛴다.
  let next: Level | null = null;
  for (let l = state.level + 1; l <= LEVEL_MAX; l++) if (levelReady(bank, l as Level)) { next = l as Level; break; }
  if (!next) return null;
  if (state.declinedOn && addDays(state.declinedOn, INVITE_REST_DAYS) > today) return null;
  // 조건은 "지금 단계 바로 다음"의 것 — 지금 단계에서 해 본 것을 본다.
  const need = INVITE_AFTER[(state.level + 1) as Exclude<Level, 1>];
  if (need.cards !== undefined && wallet.length < need.cards) return null;
  if (need.answered !== undefined) {
    const answered = bank.items.filter((i) => LEVEL_OF[i.step] === state.level && boxes[i.id]).length;
    if (answered < need.answered) return null;
  }
  return next;
}

// ── 건너뛰기 점검 (docs/jamgong-roadmap.md §3.1 — 4단계가 생긴 뒤에 켠다) ──────

export const SKIP_SIZE = 6;
export const SKIP_PASS = 5;

/** 건너뛰어 열 수 있는 단계 — 지금보다 위이고 문항이 있는 단계. 4단계 문항이 없으면 아무것도 없다(운영자 결정). */
export function skipTargets(bank: StudyBank, level: Level): Level[] {
  if (!levelReady(bank, 4)) return [];
  const out: Level[] = [];
  for (let l = level + 1; l <= LEVEL_MAX; l++) if (levelReady(bank, l as Level)) out.push(l as Level);
  return out;
}

/** 점검 문제 — 그 단계 문항 여섯. 안 푼 것부터, 단원이 겹치지 않게 고른다. 6개 가운데 5개를 맞히면 그 단계가 열린다. */
export function skipSession(bank: StudyBank, boxes: Record<string, Box>, target: Level): string[] {
  const pool = bank.items.filter((i) => LEVEL_OF[i.step] === target).sort((a, b) => Number(Boolean(boxes[a.id])) - Number(Boolean(boxes[b.id])));
  const out: string[] = [];
  const units = new Set<string>();
  for (const i of pool) if (out.length < SKIP_SIZE && !units.has(i.unit)) { out.push(i.id); units.add(i.unit); }
  for (const i of pool) if (out.length < SKIP_SIZE && !out.includes(i.id)) out.push(i.id);
  return out;
}

/** 그 단계까지의 문항만 담은 은행 — 아직 열지 않은 단계 문항은 한 판에 나오지 않는다. */
function upTo(bank: StudyBank, pred: (l: Level) => boolean): StudyBank {
  return { ...bank, items: bank.items.filter((i) => pred(LEVEL_OF[i.step])) };
}

/**
 * 오늘의 한 판 — 지금 단계 문제 70% + 아래 단계 복습 30%(docs/jamgong-roadmap.md §3.2).
 * 1단계는 알기 문제만, 5문제. 지금 단계 문제가 모자라면 아래 단계로 채운다.
 */
export function pickLevelSession(bank: StudyBank, boxes: Record<string, Box>, today: string, level: Level): string[] {
  const size = sessionSize(level);
  if (level === 1) return pickSession(upTo(bank, (l) => l === 1), boxes, today, size);
  const cur = pickSession(upTo(bank, (l) => l === level), boxes, today, Math.round(size * 0.7));
  const lower = pickSession(upTo(bank, (l) => l < level), boxes, today, size - cur.length);
  // 지금 단계 둘에 아래 단계 하나씩 번갈아.
  const out: string[] = [];
  let i = 0;
  let j = 0;
  while (i < cur.length || j < lower.length) {
    for (let k = 0; k < 2 && i < cur.length; k++) out.push(cur[i++]);
    if (j < lower.length) out.push(lower[j++]);
  }
  return out;
}
