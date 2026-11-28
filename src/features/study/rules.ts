/**
 * 잼공의 규칙 — 다시 묻기(라이트너 상자), 이어 가기(쉼표), 오늘의 한 판 고르기.
 * 설계는 docs/daily-study.md §4·§6. 수치는 모두 여기 한 군데에 있다. 순수 함수만 둔다(study.test.ts).
 *
 * ★ 날짜는 한국 날짜 "YYYY-MM-DD" 문자열로 다룬다. 문자열 비교가 곧 날짜 비교다.
 * ★ 경쟁이 없다 — 여기서 만드는 숫자는 모두 본인만 본다.
 */
import { LEVEL_OF, type StudyBank, type StudyItem, type StepId } from "./types";

const DAY = 86_400_000;
const KST = 9 * 3_600_000;

/** 한국 날짜 "YYYY-MM-DD". */
export function kstDay(t: number): string {
  return new Date(t + KST).toISOString().slice(0, 10);
}

export function addDays(day: string, n: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);
}

/** 0=일요일 … 6=토요일. */
export function weekday(day: string): number {
  return new Date(`${day}T00:00:00Z`).getUTCDay();
}

/** 그 날이 든 주의 월요일. 쉼표는 월~일 한 주마다 채워진다. */
export function weekOf(day: string): string {
  return addDays(day, -((weekday(day) + 6) % 7));
}

// ── 다시 묻기 ───────────────────────────────────────────────────────

/** 상자 칸마다 다시 묻는 간격(일). 맞히면 한 칸 오르고, 틀리면 1칸으로 돌아간다. */
export const BOX_DAYS = [1, 3, 7, 16, 35] as const;
export const BOX_MAX = BOX_DAYS.length;

/** [칸 1~5, 다음에 물을 날]. */
export type Box = [number, string];

/** 처음 보는 문항은 1칸에 있는 셈이다 — 처음 맞히면 2칸(익힘), 틀리면 1칸(내일 다시). */
export function grade(prev: Box | undefined, correct: boolean, today: string): Box {
  const box = correct ? Math.min(BOX_MAX, (prev?.[0] ?? 1) + 1) : 1;
  return [box, addDays(today, BOX_DAYS[box - 1])];
}

export function isDue(box: Box, today: string): boolean {
  return box[1] <= today;
}

/** 마지막으로 답했을 때 맞혔다 = 2칸 이상. 틀리면 1칸이다. */
export function learned(box: Box | undefined): boolean {
  return (box?.[0] ?? 0) >= 2;
}

// ── 단원 ────────────────────────────────────────────────────────────

/** 단원 상태. 그림으로만 보인다 — 숫자 점수는 없다. */
export type UnitStage = "seed" | "sprout" | "bloom" | "fruit";

export const STAGE_ICON: Record<UnitStage, string> = { seed: "🫘", sprout: "🌱", bloom: "🌸", fruit: "🍎" };
export const STAGE_LABEL: Record<UnitStage, string> = { seed: "씨앗", sprout: "새싹", bloom: "꽃", fruit: "열매" };

/** 그 단계의 문항을 모두 한 번 이상 맞혔는가. 문항이 없는 단계는 마치지 않은 것이다(준비 중). */
export function stepDone(items: StudyItem[], boxes: Record<string, Box>, step: StepId): boolean {
  const mine = items.filter((i) => i.step === step);
  return mine.length > 0 && mine.every((i) => learned(boxes[i.id]));
}

/**
 * 단원 상태. 손댄 적 없으면 씨앗, 알기를 마치면 새싹, 알기 문항이 모두 3칸 이상(두 번 넘게 맞힘)이면 꽃.
 * 열매는 **그 단원에 있는** 단계를 모두 마쳤을 때 — 알기 말고도 단계가 하나는 더 있어야 한다.
 *   (예전에는 다섯 단계가 모두 있어야 했는데, 다섯 단계 문항을 다 가진 단원이 없어 열매가 나오지 않았다.)
 */
export function unitStage(items: StudyItem[], boxes: Record<string, Box>): UnitStage {
  if (items.length === 0 || !items.some((i) => boxes[i.id])) return "seed";
  const steps = (["know", "understand", "source", "counter", "speak"] as StepId[]).filter((s) => items.some((i) => i.step === s));
  if (steps.length >= 2 && steps.every((s) => stepDone(items, boxes, s))) return "fruit";
  if (!stepDone(items, boxes, "know")) return "seed";
  const know = items.filter((i) => i.step === "know");
  return know.every((i) => (boxes[i.id]?.[0] ?? 0) >= 3) ? "bloom" : "sprout";
}

/** 지금 할 단원 — 알기를 아직 마치지 않은 첫 단원. 모두 마쳤으면 null. */
export function currentUnit(bank: StudyBank, boxes: Record<string, Box>): string | null {
  for (const u of bank.units) {
    const items = bank.items.filter((i) => i.unit === u.id);
    if (items.some((i) => i.step === "know") && !stepDone(items, boxes, "know")) return u.id;
  }
  return null;
}

/**
 * 단원이 열렸는가. 첫 단원과, 앞 단원을 한 번이라도 푼 단원이 열린다.
 * 오늘의 한 판이 새 문항을 단원 순서대로 채우므로(pickSession), 한 판에 들어오는 단원은 언제나 열려 있다.
 */
export function unitOpen(bank: StudyBank, boxes: Record<string, Box>, unitId: string): boolean {
  const at = bank.units.findIndex((u) => u.id === unitId);
  if (at <= 0) return at === 0;
  const touched = (id: string) => bank.items.some((i) => i.unit === id && boxes[i.id]);
  return touched(unitId) || touched(bank.units[at - 1].id);
}

/**
 * 길(업적·정책·언행)에 보일 단원 — 내 단계까지의 문항이 하나라도 있는 단원만. 위 단계 문항만 있는 단원은
 * 누르면 빈 판이 열리므로 보이지 않는다.
 */
export function courseUnits(bank: StudyBank, course: string, level: number): StudyBank["units"] {
  const playable = new Set(bank.items.filter((i) => LEVEL_OF[i.step] <= level).map((i) => i.unit));
  return bank.units.filter((u) => u.course === course && playable.has(u.id));
}

/**
 * 건너뛴 시기를 뺀 은행 — 업적의 길에서 고른 시기(성남·경기·정부)의 업적 단원과 그 문항을 뺀다.
 * 정책·언행 단원은 시기와 상관없이 남는다. 오늘의 한 판·지금 단원·초대·점검은 이 은행으로 고른다.
 * 시기를 모두 건너뛰지는 못한다(배움길이 하나는 남긴다).
 */
export function withoutSkipped(bank: StudyBank, skip: readonly string[] | undefined): StudyBank {
  if (!skip?.length) return bank;
  const drop = new Set(bank.units.filter((u) => u.course === "achievement" && skip.includes(u.era)).map((u) => u.id));
  if (drop.size === 0) return bank;
  return {
    units: bank.units.filter((u) => !drop.has(u.id)),
    items: bank.items.filter((i) => !drop.has(i.unit)),
    starter: bank.starter.filter((id) => !drop.has(id.split("/")[0])),
  };
}

// ── 오늘의 한 판 ────────────────────────────────────────────────────

export const SESSION_SIZE = 8;

/**
 * 한 판으로 세는 최소 문제 수. 「오늘의 연습 하나」처럼 한두 문제짜리 연습은 상자에는 적지만 판으로 세지 않는다 —
 * 하루 목표(와 그 정원 선물)가 한 문제로 채워지지 않게. 첫 3분(intro)과 오늘의 한 판은 늘 센다.
 */
export const PAN_MIN = 3;
export const SESSION_REVIEW_MAX = 5;

/**
 * 오늘의 한 판에 낼 문항 id.
 * 1. 다시 물을 때가 된 문항(오래 기다린 것, 낮은 칸 먼저) 많아야 5개.
 * 2. 나머지는 새 문항 — 지금 단원부터, 단원 순서대로.
 * 3. 새 것과 복습을 번갈아 놓는다(한 단원이 길게 이어지지 않게).
 * 4. 낼 것이 없으면(다 익혔고 아직 때가 안 됨) 다음에 물을 날이 가까운 것부터 미리 복습한다.
 */
export function pickSession(bank: StudyBank, boxes: Record<string, Box>, today: string, size = SESSION_SIZE): string[] {
  const due = bank.items
    .filter((i) => boxes[i.id] && isDue(boxes[i.id], today))
    .sort((a, b) => boxes[a.id][1].localeCompare(boxes[b.id][1]) || boxes[a.id][0] - boxes[b.id][0])
    .slice(0, SESSION_REVIEW_MAX);
  const fresh: StudyItem[] = [];
  const start = Math.max(0, bank.units.findIndex((u) => u.id === currentUnit(bank, boxes)));
  for (const u of [...bank.units.slice(start), ...bank.units.slice(0, start)]) {
    for (const i of bank.items) if (i.unit === u.id && !boxes[i.id] && fresh.length < size - due.length) fresh.push(i);
  }
  const out: string[] = [];
  for (let k = 0; out.length < due.length + fresh.length; k++) {
    if (k < fresh.length) out.push(fresh[k].id);
    if (k < due.length) out.push(due[k].id);
  }
  if (out.length) return out;
  return bank.items
    .filter((i) => boxes[i.id])
    .sort((a, b) => boxes[a.id][1].localeCompare(boxes[b.id][1]))
    .slice(0, size)
    .map((i) => i.id);
}

/**
 * 단원 하나만 푸는 판 — 아직 안 푼 것, 낮은 칸 순. 내 단계까지의 문항만(1단계 사람에게 가리기 문항을 내지 않는다).
 */
export function unitSession(bank: StudyBank, boxes: Record<string, Box>, unitId: string, level = 1): string[] {
  return bank.items
    .filter((i) => i.unit === unitId && LEVEL_OF[i.step] <= level)
    .sort((a, b) => (boxes[a.id]?.[0] ?? 0) - (boxes[b.id]?.[0] ?? 0))
    .map((i) => i.id);
}

// ── 이어 가기 ───────────────────────────────────────────────────────

/** 한 주(월~일)마다 저절로 채워지는 쉼표. 빠진 날을 메운다. 잼으로 사지 않는다. */
export const RESTS_PER_WEEK = 2;

export const GOALS = [
  { n: 1, label: "가볍게", hint: "하루 1판" },
  { n: 2, label: "꾸준히", hint: "하루 2판" },
  { n: 3, label: "열심히", hint: "하루 3판" },
] as const;
export type Goal = 1 | 2 | 3;

export interface Streak {
  /** 이어 간 날. 쉼표로 메운 날은 끊기지 않게만 하고 세지 않는다. */
  count: number;
  /** 쉼표가 메운 날(달력 표시용). */
  rested: string[];
  /** 이번 주에 남은 쉼표. */
  restsLeft: number;
  /** 오늘 마친 판 수. */
  today: number;
}

/**
 * 이어 간 날. 오늘을 아직 안 했으면 어제부터 센다(오늘은 아직 기회가 있다).
 * 빠진 날은 그 주의 쉼표가 남아 있으면 메운다. 처음 공부한 날보다 앞으로는 가지 않는다.
 */
export function streakOf(days: Record<string, number>, today: string): Streak {
  const done = (d: string) => (days[d] ?? 0) > 0;
  const first = Object.keys(days).filter(done).sort()[0];
  const used = new Map<string, number>();
  const rested: string[] = [];
  let count = 0;
  let oldest = "";
  if (first) {
    let d = done(today) ? today : addDays(today, -1);
    for (let guard = 0; guard < 800 && d >= first; guard++, d = addDays(d, -1)) {
      if (done(d)) {
        count++;
        oldest = d;
        continue;
      }
      const w = weekOf(d);
      if ((used.get(w) ?? 0) >= RESTS_PER_WEEK) break;
      used.set(w, (used.get(w) ?? 0) + 1);
      rested.push(d);
    }
  }
  // 이번 주 남은 쉼표 — 이번 주에 (처음 공부한 날 뒤로) 빠진 날만큼 줄어든다.
  let missed = 0;
  if (first) for (let d = weekOf(today); d < today; d = addDays(d, 1)) if (d >= first && !done(d)) missed++;
  // 끊긴 자리 너머의 쉼표는 아무것도 잇지 않는다 — 이어 간 날 사이의 것만 남긴다.
  return { count, rested: rested.filter((d) => d > oldest && count > 0), restsLeft: Math.max(0, RESTS_PER_WEEK - missed), today: days[today] ?? 0 };
}
