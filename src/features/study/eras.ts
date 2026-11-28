/**
 * 업적의 길을 걷는 순서 — 성남시장 시절에서 이재명 정부까지(docs/daily-study.md §4).
 *
 * ★ 업적에는 시기 칸이 없다. 연표의 처음 날짜는 시민운동(성남의료원 2003)이나 전임 정부 통계(출생아 2024)에서
 *   시작하기도 해서 날짜만으로 시기를 가를 수 없다. 그래서 어느 시기의 일인지를 여기 손으로 적는다 —
 *   편집 판단이고, 그 판단이 코드에 보이는 편이 낫다(카르텔 순서와 같다).
 * ★ 새 업적에 문항이 생겼는데 여기 없으면 study.test.ts가 멈춘다. 빠뜨린 것과 정해서 둔 것은 다르다.
 * ★ 같은 시기 안에서는 그 임기 안에서 일이 시작된 날 순서다(임기 시작일 이후의 첫 연표 날짜).
 */

export type EraId = "seongnam" | "gyeonggi" | "government";

export const ERAS: ReadonlyArray<{ id: EraId; label: string; start: string }> = [
  { id: "seongnam", label: "성남시장 시절", start: "2010-07-01" },
  { id: "gyeonggi", label: "경기도지사 시절", start: "2018-07-01" },
  { id: "government", label: "이재명 정부", start: "2025-06-04" },
];

/** 업적 slug → 시기. */
export const ACHIEVEMENT_ERA: Readonly<Record<string, EraId>> = {
  // 성남시장(2010–2018)
  "seongnam-debt": "seongnam",
  "seongnam-welfare": "seongnam",
  "seongnam-meals": "seongnam",
  "seongnam-hospital": "seongnam",
  daejangdong: "seongnam",
  // 경기도지사(2018–2021)
  "gyeonggi-or-cctv": "gyeonggi",
  "gyeonggi-valley": "gyeonggi",
  "gyeonggi-construction": "gyeonggi",
  "gyeonggi-child-meal": "gyeonggi",
  "gyeonggi-comfort-women": "gyeonggi",
  "gyeonggi-shincheonji": "gyeonggi",
  "gyeonggi-basic-income": "gyeonggi",
  "gyeonggi-microloan": "gyeonggi",
  "gyeonggi-ilsan-bridge": "gyeonggi",
  // 이재명 정부(2025–)
  "stock-market": "government",
  "housing-stabilization": "government",
  "export-surplus": "government",
  "birth-rebound": "government",
  "inbound-tourism": "government",
  "nuclear-submarine": "government",
  "arctic-route": "government",
  "judicial-reform": "government",
  "prosecution-reform": "government",
  "oil-supply": "government",
  "youth-future-savings": "government",
  "resource-diplomacy": "government",
  "rail-merger": "government",
  "mexico-visit": "government",
  "integrated-care": "government",
  "regional-doctors": "government",
  "working-hours": "government",
  "local-currency": "government",
  "yellow-envelope": "government",
};

const ORDER = new Map(ERAS.map((e, i) => [e.id, i]));

/**
 * 같은 시기 안의 자리 — 그 임기가 시작된 뒤의 첫 연표 날짜(없으면 첫 날짜).
 * 날짜는 "2025", "2025-04", "2025-04-01"이 섞여 있어 글자 순서로 견준다(앞자리가 같으면 짧은 것이 먼저).
 */
export function eraKey(era: EraId, dates: readonly string[]): string {
  const start = ERAS[ORDER.get(era)!].start;
  const sorted = [...dates].sort();
  return sorted.find((d) => d >= start.slice(0, d.length)) ?? sorted[0] ?? "9999";
}

export function eraRank(era: EraId): number {
  return ORDER.get(era)!;
}
