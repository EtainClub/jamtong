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
import { judicialReform } from "./judicial-reform/achievement";
import { railMerger } from "./rail-merger/achievement";
import { nuclearSubmarine } from "./nuclear-submarine/achievement";
import { resourceDiplomacy } from "./resource-diplomacy/achievement";
import { oilSupply } from "./oil-supply/achievement";

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
  judicialReform,
  railMerger,
  nuclearSubmarine,
  resourceDiplomacy,
  oilSupply,
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

/* ────────────────────────────────────────────────────────────────
 * 최근 순 정렬
 *
 * 등록 순서는 내가 업적을 만든 순서다. 읽는 사람에게는 아무 뜻이 없다.
 * 목록과 히어로는 **최근에 무슨 일이 있었나** 순으로 세운다.
 * ──────────────────────────────────────────────────────────────── */

/**
 * 오늘. 모듈이 읽힐 때 한 번만 잡는다.
 *
 * 정적 빌드에서는 빌드 시각에 굳는다. 그래도 맞다 — 다시 배포할 때마다
 * 갱신되고, 그 사이에 순서가 뒤집힐 만한 시점이 생기면 그건 콘텐츠가
 * 바뀌었다는 뜻이라 어차피 다시 빌드한다.
 */
const TODAY = new Date().toISOString().slice(0, 10);

/**
 * 이 업적에서 **이미 일어난** 일 가운데 가장 나중 것의 날짜.
 *
 * ★ 앞으로의 계획을 최근으로 세지 않는다.
 *   연표에는 아직 오지 않은 시점이 함께 있다. 북극항로는 2030년까지,
 *   사법개혁은 2028년 대법관 증원까지 적혀 있다. 그냥 최댓값을 쓰면
 *   "2030년에 하겠다"가 "이번 주에 있었던 일"을 밀어내고 맨 위에 선다.
 *   그건 이 위키가 한 일과 하겠다는 일을 갈라 온 원칙과 정면으로 어긋난다.
 *
 * 날짜는 "2026", "2026-09", "2026-09-14"처럼 정밀도가 섞여 있다. 문자열
 * 비교가 곧 '그달 1일로 채운' 비교와 같으므로 따로 자릿수를 맞추지 않는다.
 * 늘 이른 쪽으로 기울므로, 모르는 것을 최근으로 올려 세는 일은 없다.
 */
export function latestEventDate(achievement: Achievement): string {
  let latest = "";
  for (const event of achievement.timeline) {
    if (event.date > TODAY) continue;
    if (event.date > latest) latest = event.date;
  }
  return latest;
}

/**
 * 최근이 앞으로. 날짜가 같거나 연표가 빈 업적은 slug로 갈라 순서를 고정한다 —
 * 정렬이 흔들리면 빌드마다 화면이 달라진다.
 */
export function byRecency(a: Achievement, b: Achievement): number {
  return latestEventDate(b).localeCompare(latestEventDate(a)) || a.slug.localeCompare(b.slug);
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

/**
 * 목록에 세우는 순서는 **최근 순**이다. 등록 순서가 아니다.
 *
 * 등록 순서는 내가 만든 순서일 뿐이라, 화면에서는 늘 북극항로가 맨 앞이고
 * 이번 주에 끝난 일이 스무 번째에 있었다.
 */
export const ACHIEVEMENT_CARDS: AchievementCardData[] = [...ACHIEVEMENTS]
  .sort(byRecency)
  .map(toCardData);
