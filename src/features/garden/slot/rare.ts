import type { Mutation, Tier } from "../types";

/**
 * 희귀 씨앗 — 텃밭 슬롯머신의 당첨 상품(docs/garden-slots.md).
 *
 * ★ "특별판 씨앗"이다. 콘텐츠 없는 새 품종을 만들지 않는다 — 심으면 업적·정책 품종 하나가 자라고(쪽지는 그 콘텐츠에서 나온다),
 *   씨앗마다 정해진 변이가 **확정**으로 붙는다. 변이의 그림·배율은 기존 것(rules.ts의 MUTATION)을 그대로 쓴다.
 * ★ 그림은 GPT(Codex 내장 이미지 생성)로 그렸다 — public/garden/rare-seeds/<id>.webp. 글자 없음.
 * ★ 이 파일은 rules.ts를 가져오지 않는다(rules.ts의 rollMutations가 이것을 가져온다 — 순환을 피한다).
 */

export interface RareSeed {
  id: string;
  label: string;
  /** 심으면 거둘 때 확정으로 붙는 변이. 셋이 겹치면 무지개가 따라붙는다(withRainbow). */
  mutations: readonly Mutation[];
  /** 당첨 때 어느 등급의 품종으로 주는가. */
  tier: Tier;
  /** 성장 시간 배율(1이면 보통). */
  grow: number;
  hint: string;
}

export const RARE_SEEDS = [
  { id: "rs-golden", label: "황금 씨앗", mutations: ["golden"], tier: "flagship", grow: 1, hint: "업적 품종이 자라고, 거두면 언제나 황금 열매(×10)예요." },
  { id: "rs-meteor", label: "별똥별 씨앗", mutations: ["sparkle"], tier: "flagship", grow: 1, hint: "업적 품종이 자라고, 거두면 언제나 반짝 열매(×5)예요." },
  { id: "rs-rain", label: "단비 씨앗", mutations: ["moist"], tier: "common", grow: 0.5, hint: "정책 품종이 두 배 빨리 자라고, 거두면 언제나 촉촉 열매(×2)예요." },
  { id: "rs-bless", label: "축복 씨앗", mutations: ["blessed"], tier: "common", grow: 1, hint: "정책 품종이 자라고, 거두면 언제나 광장의 축복 열매(×2)예요." },
  { id: "rs-rainbow", label: "무지개 씨앗", mutations: ["moist", "sparkle", "blessed"], tier: "common", grow: 1, hint: "정책 품종이 자라고, 거두면 촉촉·반짝·축복이 겹친 무지개 열매예요." },
  { id: "rs-ancient", label: "고목 씨앗", mutations: ["blessed"], tier: "perennial", grow: 1, hint: "여러 해 업적의 나무가 자라고, 거둘 때마다 광장의 축복 열매(×2)예요." },
] as const satisfies readonly RareSeed[];

export type RareSeedId = (typeof RARE_SEEDS)[number]["id"];

export const RARE_BY_ID: ReadonlyMap<string, RareSeed> = new Map(RARE_SEEDS.map((r) => [r.id, r]));

export function rareImage(id: string): string {
  return `/garden/rare-seeds/${id}.webp`;
}

/** 희귀 씨앗 주머니의 열쇠 — 어느 희귀 씨앗이 어느 품종으로 자라는가. `rs-golden|a:seongnam-hospital`. */
export function rareKey(kind: string, speciesId: string): string {
  return `${kind}|${speciesId}`;
}

export function parseRareKey(key: string): { kind: RareSeed; speciesId: string } | null {
  const [kind, speciesId] = key.split("|");
  const r = RARE_BY_ID.get(kind);
  return r && speciesId ? { kind: r, speciesId } : null;
}
