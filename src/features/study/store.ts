"use client";

import { create } from "zustand";

import { grade, kstDay, type Box, type Goal } from "./rules";
import { mergeStudy } from "./sync";
import type { Level } from "./types";

/**
 * 잼공 개인 기록 — 이 브라우저(localStorage)에 먼저 쌓이고, 계정이 있으면 Firestore(users/{uid}/study/state)로 따라간다.
 * 설계는 docs/daily-study.md §11, 단계는 docs/jamgong-roadmap.md §3.
 *
 * ★ 두 기기의 기록은 합친다(sync.ts). 어느 기기에서 공부했든 사라지지 않는다.
 * ★ 남과 견줄 값은 없다. 이 기록은 본인만 본다(규칙도 본인만 읽게 한다).
 * ★ 사람이 쓴 답(5단계 직접 쓰기)은 여기에 넣지 않는다 — 기기에만 따로 둔다.
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
  /** 첫 3분(첫 판)을 마쳤다. 마치기 전에는 상단 바에 "재밌는 공부, 잼통 공부"가 보인다. */
  intro: boolean;
  /** 하루 목표를 물었다 — 첫날에는 묻지 않고 다음에 온 날 묻는다(docs/jamgong-roadmap.md §4). */
  goalAsked?: boolean;
  /** 지금 단계(1~5). 내려가지 않는다. */
  level?: Level;
  /** 「지금 단계에 머물기」. */
  stay?: boolean;
  /** 마지막으로 다음 단계 초대를 거절한 날. */
  declinedOn?: string;
  /** 마지막으로 고친 때(ms). 설정을 합칠 때 늦은 쪽을 따른다. */
  updatedAt?: number;
  /** 하루 목표 선물(정원 슬롯)을 받으러 간 날. 그날은 "아직 안 받았어요"를 묻지 않는다. */
  perkDay?: string;
}

const STORAGE_KEY = "jamgong-v1";
const DAYS_KEEP = 400;

export function emptyStudy(): StudyData {
  return { v: 1, goal: 1, days: {}, boxes: {}, wallet: [], intro: false, goalAsked: false, level: 1, stay: false, updatedAt: 0 };
}

export function normalizeStudy(data: Partial<StudyData> | null | undefined): StudyData | null {
  if (!data || data.v !== 1) return null;
  const base = emptyStudy();
  // 3.0의 첫 안내는 하루 목표부터 물었다 — 그때 안내를 마친 사람은 이미 목표를 고른 것이다.
  const goalAsked = data.goalAsked ?? Boolean(data.intro);
  return { ...base, ...data, goalAsked, level: data.level ?? 1, stay: data.stay ?? false };
}

export function readLocalStudy(): StudyData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return normalizeStudy(raw ? (JSON.parse(raw) as StudyData) : null);
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
  /** 계정의 기록(remote)과 합친다. 합친 결과를 돌려준다 — 부르는 쪽이 계정에 쓴다. */
  link: (remote: StudyData | null) => StudyData;
  /** 한 문항에 답했다. card=O 문항이라 근거노트에 들어갈 수 있다. */
  answer: (itemId: string, correct: boolean, card: boolean) => void;
  /** 한 판을 마쳤다. 그날 마친 판 수를 돌려준다. */
  finish: () => number;
  setGoal: (goal: Goal) => void;
  endIntro: () => void;
  /** 다음 단계 초대를 받았다. */
  levelUp: (level: Level) => void;
  /** 초대를 거절했다 — 14일 뒤에 다시 묻는다. */
  declineInvite: () => void;
  setStay: (stay: boolean) => void;
  /** 하루 목표 선물을 받으러 정원으로 간다. */
  markPerk: (day: string) => void;
}

export const useStudy = create<StudyState>((set, get) => {
  const update = (fn: (d: StudyData) => StudyData) => {
    // 원본 페이지·정원의 퀴즈는 잼공 앱을 열지 않고 부른다 — 부팅 전이면 저장된 기록부터 읽어 덮어쓰지 않게.
    const cur = get().data ?? readLocalStudy() ?? emptyStudy();
    const next = { ...fn(cur), updatedAt: Date.now() };
    writeLocal(next);
    set({ data: next });
    return next;
  };
  const today = () => kstDay(Date.now());
  return {
    data: null,
    boot: () => set({ data: readLocalStudy() ?? emptyStudy() }),
    link: (remote) => {
      const local = get().data ?? readLocalStudy() ?? emptyStudy();
      const merged = mergeStudy(local, normalizeStudy(remote));
      writeLocal(merged);
      set({ data: merged });
      return merged;
    },
    answer: (itemId, correct, card) =>
      update((d) => ({
        ...d,
        boxes: { ...d.boxes, [itemId]: grade(d.boxes[itemId], correct, today()) },
        wallet: correct && card && !d.wallet.includes(itemId) ? [...d.wallet, itemId] : d.wallet,
      })),
    finish: () => {
      const t = today();
      return update((d) => ({ ...d, days: trimDays({ ...d.days, [t]: (d.days[t] ?? 0) + 1 }) })).days[t];
    },
    setGoal: (goal) => update((d) => ({ ...d, goal, goalAsked: true })),
    endIntro: () => update((d) => ({ ...d, intro: true })),
    levelUp: (level) => update((d) => ({ ...d, level: Math.max(d.level ?? 1, level) as Level, declinedOn: undefined })),
    declineInvite: () => update((d) => ({ ...d, declinedOn: today() })),
    setStay: (stay) => update((d) => ({ ...d, stay })),
    markPerk: (day) => update((d) => ({ ...d, perkDay: day })),
  };
});
