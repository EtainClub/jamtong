import type { Achievement, AchievementCollection } from "@/content/schema";
import { maritime2026 } from "./maritime-2026";

/**
 * 성과 카드 레지스트리.
 *
 * 컬렉션 단위로 관리한다. 하나의 1차 자료에서 나온 카드 묶음이 한 파일이 되고,
 * 그래야 출처가 갱신될 때 어디를 고쳐야 하는지가 분명해진다.
 */
export const COLLECTIONS: AchievementCollection[] = [maritime2026];

export const ACHIEVEMENTS: Achievement[] = COLLECTIONS.flatMap((c) => c.achievements);

export const ALL_CLAIMS = COLLECTIONS.flatMap((c) => c.claims);
export const ALL_SOURCES = COLLECTIONS.flatMap((c) => c.sources);
