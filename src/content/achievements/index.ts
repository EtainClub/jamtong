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
import { prosecutionReform } from "./prosecution-reform/achievement";

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
  prosecutionReform,
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

/**
 * 목록 카드가 쓰는 것만 뽑은 것.
 *
 * 홈 피드는 클라이언트 컴포넌트라, 여기에 Achievement를 통째로 넘기면 그 업적의
 * 근거·출처 인용문·쉬운 설명·관계도·반론이 전부 직렬화돼 첫 화면에 실린다.
 * 홈에서 아무도 읽지 않는 것들이고, 업적을 하나 더할 때마다 함께 커진다.
 * 실제로 홈 HTML이 628KB까지 갔다 — assertionType 244회, 인용문 69회.
 *
 * 카드가 쓰는 것은 일곱 가지뿐이다. 서버에서 그만큼만 뽑아 넘긴다.
 */
export interface AchievementCardData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  kicker: string;
  isDraft: boolean;
  /** 일곱 칸의 충족 여부. 화면이 다시 계산하지 않도록 여기서 정한다. */
  parts: boolean[];
  claimCount: number;
  sourceCount: number;
}

export function toCardData(achievement: Achievement): AchievementCardData {
  return {
    id: achievement.id,
    slug: achievement.slug,
    title: achievement.title,
    subtitle: achievement.subtitle,
    kicker: achievement.kicker,
    isDraft: achievement.publishStatus === "draft",
    parts: achievementParts(achievement),
    claimCount: achievement.claims.length,
    sourceCount: achievement.sources.length,
  };
}

export const ACHIEVEMENT_CARDS: AchievementCardData[] = ACHIEVEMENTS.map(toCardData);
