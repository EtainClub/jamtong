import type { Achievement } from "@/content/schema";
import { arcticRoute } from "./arctic-route/achievement";
import { daejangdong } from "./daejangdong/achievement";
import { stockMarket } from "./stock-market/achievement";
import { seongnamWelfare } from "./seongnam-welfare/achievement";
import { seongnamDebt } from "./seongnam-debt/achievement";
import { seongnamHospital } from "./seongnam-hospital/achievement";
import { seongnamMeals } from "./seongnam-meals/achievement";
import { gyeonggiValley } from "./gyeonggi-valley/achievement";
import { gyeonggiBasicIncome } from "./gyeonggi-basic-income/achievement";
import { gyeonggiShincheonji } from "./gyeonggi-shincheonji/achievement";
import { gyeonggiOrCctv } from "./gyeonggi-or-cctv/achievement";
import { gyeonggiConstruction } from "./gyeonggi-construction/achievement";
import { gyeonggiChildMeal } from "./gyeonggi-child-meal/achievement";
import { gyeonggiMicroloan } from "./gyeonggi-microloan/achievement";
import { gyeonggiComfortWomen } from "./gyeonggi-comfort-women/achievement";
import { gyeonggiIlsanBridge } from "./gyeonggi-ilsan-bridge/achievement";

/**
 * 업적 레지스트리.
 *
 * 콘텐츠가 저장소에 있으므로 목록도 빌드 타임 상수다.
 * 검색·피드·정적 경로가 전부 이걸 본다.
 */
export const ACHIEVEMENTS: Achievement[] = [
  arcticRoute,
  daejangdong,
  stockMarket,
  seongnamWelfare,
  seongnamDebt,
  seongnamHospital,
  seongnamMeals,
  gyeonggiValley,
  gyeonggiBasicIncome,
  gyeonggiShincheonji,
  gyeonggiOrCctv,
  gyeonggiConstruction,
  gyeonggiChildMeal,
  gyeonggiMicroloan,
  gyeonggiComfortWomen,
  gyeonggiIlsanBridge,
];

export function getAchievement(slug: string): Achievement | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.slug === slug);
}

/** 피드에는 공개 업적만 올린다. draft는 URL을 아는 사람만 본다. */
export function getPublishedAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.publishStatus === "published");
}

/**
 * 업적 하나가 갖춰야 하는 일곱 가지.
 *
 * 목록에서 무엇이 채워졌고 무엇이 비었는지 보인다. 비어 있는 것을 숨기면
 * 만드는 쪽도 보는 쪽도 무엇이 남았는지 모른다.
 */
export const PART_LABELS = [
  "쉬운 설명",
  "연표",
  "모션",
  "관계도",
  "근거",
  "AI 안내",
  "쇼츠",
] as const;

export function achievementParts(achievement: Achievement): boolean[] {
  return [
    Boolean(achievement.eli5),
    achievement.timeline.length > 0,
    achievement.scenes.length > 0,
    Boolean(achievement.graph),
    achievement.claims.length > 0 && achievement.sources.length > 0,
    // AI 안내는 근거에서 맥락을 만들므로 근거가 있으면 늘 동작한다.
    achievement.claims.length > 0,
    achievement.shorts.length > 0,
  ];
}
