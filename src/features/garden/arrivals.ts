import ledger from "./arrivals.json";

/**
 * 품종이 정원에 들어온 날의 장부 — `pnpm garden:arrivals`가 쓴다.
 *
 * 콘텐츠에는 "사이트에 실린 날"이 없다. 출처의 publishedAt은 기사 날짜이고,
 * 정책의 asOf는 자료 기준일이며, 언행의 날짜는 말한 날이다. 그래서 정원이 처음
 * 본 날을 따로 적는다. 이 저장소는 푸시가 곧 배포라, 커밋하는 날이 곧 배포일이다.
 *
 *   "YYYY-MM-DD"  그날 들어온 품종. 그날 19:00 신품종 장마, 30일 동안 신품종.
 *   "base"        정원을 열기 전부터 있던 품종. 신품종이 아니다.
 *
 * 손으로 날짜를 고치지 않는다. 장마 날을 옮기고 싶으면 스크립트를 다시 돌린다.
 */
export const ARRIVALS: Readonly<Record<string, string>> = ledger;

export const BASE = "base";

/** 장부의 값을 품종의 arrivedOn으로. 정원 개장 전 품종과 장부에 없는 품종은 비운다. */
export function arrivedOn(speciesId: string): string | undefined {
  const day = ARRIVALS[speciesId];
  return day && day !== BASE ? day : undefined;
}
