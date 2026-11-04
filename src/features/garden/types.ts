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
  /**
   * 정원에 들어온 날(한국 날짜 YYYY-MM-DD). 신품종 장마와 신품종 보너스가 이 날로 정해진다.
   * 정원을 열기 전부터 있던 품종은 비어 있다. 장부는 arrivals.json.
   */
  arrivedOn?: string;
}

export type Mutation = "golden" | "moist" | "sparkle" | "shine" | "blessed" | "rainbow";

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

/**
 * 시든 잎 — 원문 링크가 열리지 않았던 출처 하나. docs/garden-game.md §3.8.
 *
 * 링크 확인 표(`pnpm sources:archive`)가 ok가 아니라고 적은 출처만 잎이 된다.
 * 표가 다시 ok로 적으면 잎도 사라진다 — 운영자가 출처를 고치면 저절로 닫힌다.
 */
export interface Leaf {
  /** "l" + url 해시. Firestore 문서 id이자 운영자 스크립트가 url로 되짚는 열쇠. */
  id: string;
  url: string;
  /** 출처 이름. "발행처 · 제목". */
  title: string;
  /** 이 출처를 쓰는 콘텐츠 하나. 확인하는 사람에게 맥락을 준다. */
  speciesTitle: string;
  href: string;
}

/**
 * 탐정 온실의 사건 — 정책 페이지의 "도는 주장" 하나. docs/garden-game.md §4.
 *
 * 보기는 셋이다. 하나는 콘텐츠가 그 주장에 대응한다고 적어 둔 claim이고(답),
 * 둘은 같은 분야 다른 정책의 claim이다. 빌드 때 정해 둔다.
 */
export interface Case {
  /** <정책slug>#<rumorId> */
  id: string;
  /** 도는 주장의 요약. 화면에서는 늘 "도는 주장"으로 표시한다. */
  rumor: string;
  policyTitle: string;
  /** 정책 품종 id(p:<slug>). 풀면 이 씨앗을 준다. */
  speciesId: string;
  href: string;
  options: CaseOption[];
}

export interface CaseOption {
  note: Note;
  /** 이 claim이 실린 정책. 답이 아닌 보기에 "이건 「…」 이야기예요"라고 알려 줄 때 쓴다. */
  policyTitle: string;
  href: string;
  answer: boolean;
}
