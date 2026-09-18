import type { AchievementCategory } from "@/content/schema";

/**
 * 숏츠 배경 톤.
 *
 * 분야마다 다른 색을 주되 3계열로만 돌린다. 열한 개 분야에 열한 색을 주면
 * 서커스가 되고, Editorial 톤(설계서 34장)에서 가장 멀어진다.
 */
export interface ShortTheme {
  from: string;
  to: string;
  accent: string;
  onAccent: string;
}

const ICE: ShortTheme = {
  from: "#0d2438",
  to: "#071523",
  accent: "#5cc8ec",
  onAccent: "#04121f",
};

const DEEP: ShortTheme = {
  from: "#141d3a",
  to: "#080c1c",
  accent: "#8aa2f0",
  onAccent: "#0a0f22",
};

const WARM: ShortTheme = {
  from: "#2c2415",
  to: "#16110a",
  accent: "#e6b25a",
  onAccent: "#1a1206",
};

export const CATEGORY_THEME: Record<AchievementCategory, ShortTheme> = {
  economy: ICE,
  region: ICE,
  science: DEEP,
  diplomacy: DEEP,
  education: DEEP,
  environment: WARM,
  fisheries: WARM,
  welfare: WARM,
  labor: WARM,
  health: ICE,
  culture: DEEP,
};

/**
 * 숫자를 셀 수 있는 부분과 아닌 부분으로 가른다.
 *
 * "10.4억 달러"는 10.4만 세고 "억 달러"는 고정이다. "70 → 90"처럼 숫자가
 * 둘인 값은 세지 않는다 — 중간값이 아무 의미도 없기 때문이다.
 */
export interface CountableValue {
  prefix: string;
  target: number | null;
  decimals: number;
  suffix: string;
}

export function parseCountable(value: string): CountableValue {
  const matches = value.match(/\d[\d,]*(\.\d+)?/g);
  if (!matches || matches.length !== 1) {
    return { prefix: value, target: null, decimals: 0, suffix: "" };
  }

  const raw = matches[0];
  const index = value.indexOf(raw);
  const numeric = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(numeric)) {
    return { prefix: value, target: null, decimals: 0, suffix: "" };
  }

  const dot = raw.indexOf(".");
  return {
    prefix: value.slice(0, index),
    target: numeric,
    decimals: dot === -1 ? 0 : raw.length - dot - 1,
    suffix: value.slice(index + raw.length),
  };
}
