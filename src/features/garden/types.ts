/**
 * 정원의 자료형. 설계는 docs/garden-game.md §3.
 */

/** sprout=언행, common=정책, flagship=업적, perennial=여러 해에 걸친 업적(여러 번 수확). */
export type Tier = "sprout" | "common" | "flagship" | "perennial";

/**
 * 쪽지의 종류. claim의 assertionType을 그대로 물려받고, 셋을 더한다.
 * COUNTER=업적 페이지의 반론, CRITIQUE=정책의 비판·한계 claim, WORD=언행 쉽게 보기 토막.
 */
export type NoteKind = "FACT" | "CLAIM" | "INTERPRETATION" | "OPINION" | "COUNTER" | "CRITIQUE" | "WORD";

/** 열매 속 쪽지. 콘텐츠의 한 줄과 그 출처. */
export interface Note {
  id: string;
  kind: NoteKind;
  text: string;
  /** CLAIM이면 누구의 주장인지. */
  by?: string;
  verified?: boolean;
  sourceUrl?: string;
  sourceTitle?: string;
  /** 출처 대신 원본 페이지의 자리로 보낼 때. */
  href?: string;
}

export interface Species {
  /** a:<slug> | p:<slug> | w:<slug> */
  id: string;
  tier: Tier;
  title: string;
  /** 원본 페이지. 게임이 끝나는 곳. */
  href: string;
  notes: Note[];
  /** 품종마다 고정된 수. 성장 시간·열매 모양·값을 정한다. */
  seed: number;
}

export type Mutation = "golden" | "moist" | "shine" | "blessed" | "rainbow";

export interface Plant {
  /** 심을 때 만든 무작위 id. 변이 판정의 씨앗이라 새로고침해도 결과가 같다. */
  id: string;
  speciesId: string;
  plantedAt: number;
  /** 이번 열매가 익는 시각. 다년생은 수확할 때마다 다시 정해진다. */
  ripeAt: number;
  /** 심을 때 광장 버프로 정해진 성장 배율. */
  speed: number;
  harvests: number;
}

export interface Fruit {
  id: string;
  speciesId: string;
  noteId: string;
  mutations: Mutation[];
  harvestedAt: number;
}

export type PlazaLevel = "clean" | "normal" | "overgrown";
