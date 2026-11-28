"use client";

import { create } from "zustand";

import { grade, kstDay, type Box, type Goal } from "./rules";

/**
 * 잼공 개인 기록 — 이 브라우저(localStorage)에 쌓인다. 설계는 docs/daily-study.md §11.
 *
 * ★ 계정(Firestore studies/{uid}) 동기화는 다음 단계다. 지금은 기기마다 따로다.
 * ★ 남과 견줄 값은 없다. 이 기록은 본인만 본다.
 */

export interface StudyData {
  v: 1;
  goal: Goal;
  /** 한국 날짜 → 그날 마친 판 수. */
  days: Record<string, number>;
  /** 문항 id → [칸, 다음에 물을 날]. */
  boxes: Record<string, Box>;
  /** 근거노트에 든 문항 id(O 문항을 맞혔을 때). 들어온 순서. */
  wallet: string[];
  /** 첫 안내를 마쳤다. 마치기 전에는 상단 바에 "재밌는 공부, 잼통 공부"가 보인다. */
  intro: boolean;
}

const STORAGE_KEY = "jamgong-v1";
const DAYS_KEEP = 400;

export function emptyStudy(): StudyData {
  return { v: 1, goal: 1, days: {}, boxes: {}, wallet: [], intro: false };
}

function readLocal(): StudyData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as StudyData) : null;
    return data?.v === 1 ? { ...emptyStudy(), ...data } : null;
  } catch {
    return null;
  }
}

function writeLocal(data: StudyData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 비공개 창 등. 이번 방문 동안은 메모리에서 논다.
  }
}

function trimDays(days: Record<string, number>): Record<string, number> {
  const keys = Object.keys(days).sort();
  if (keys.length <= DAYS_KEEP) return days;
  return Object.fromEntries(keys.slice(-DAYS_KEEP).map((k) => [k, days[k]]));
}

interface StudyState {
  data: StudyData | null;
  /** 첫 렌더 뒤에 부른다. localStorage는 서버 렌더에 없다. */
  boot: () => void;
  /** 한 문항에 답했다. card=O 문항이라 근거노트에 들어갈 수 있다. */
  answer: (itemId: string, correct: boolean, card: boolean) => void;
  /** 한 판을 마쳤다. 그날 마친 판 수를 돌려준다. */
  finish: () => number;
  setGoal: (goal: Goal) => void;
  endIntro: () => void;
}

export const useStudy = create<StudyState>((set, get) => {
  const update = (fn: (d: StudyData) => StudyData) => {
    // 원본 페이지·정원의 퀴즈는 잼공 앱을 열지 않고 부른다 — 부팅 전이면 저장된 기록부터 읽어 덮어쓰지 않게.
    const cur = get().data ?? readLocal() ?? emptyStudy();
    const next = fn(cur);
    writeLocal(next);
    set({ data: next });
    return next;
  };
  return {
    data: null,
    boot: () => set({ data: readLocal() ?? emptyStudy() }),
    answer: (itemId, correct, card) =>
      update((d) => ({
        ...d,
        boxes: { ...d.boxes, [itemId]: grade(d.boxes[itemId], correct, kstDay(Date.now())) },
        wallet: correct && card && !d.wallet.includes(itemId) ? [...d.wallet, itemId] : d.wallet,
      })),
    finish: () => {
      const today = kstDay(Date.now());
      return update((d) => ({ ...d, days: trimDays({ ...d.days, [today]: (d.days[today] ?? 0) + 1 }) })).days[today];
    },
    setGoal: (goal) => update((d) => ({ ...d, goal })),
    endIntro: () => update((d) => ({ ...d, intro: true })),
  };
});
