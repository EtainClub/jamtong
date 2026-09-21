import type { Milestone, MilestoneCollection } from "@/content/schema";
import { maritime2026 } from "./maritime-2026";
import { mega2026 } from "./mega-2026";
import { cartel2026 } from "./cartel-2026";

/**
 * 성과 카드 레지스트리.
 *
 * 컬렉션 단위로 관리한다. 하나의 1차 자료에서 나온 카드 묶음이 한 파일이 되고,
 * 그래야 출처가 갱신될 때 어디를 고쳐야 하는지가 분명해진다.
 *
 * 카르텔 묶음만 예외다. 한 자료가 아니라 한 **표적**에서 모였고, 그래서 출처가
 * 넷이다. 표적별 화면(`/cartel`)이 이 카드들을 끌어 쓴다.
 */
export const COLLECTIONS: MilestoneCollection[] = [maritime2026, mega2026, cartel2026];

export const MILESTONES: Milestone[] = COLLECTIONS.flatMap((c) => c.milestones);

export const ALL_CLAIMS = COLLECTIONS.flatMap((c) => c.claims);
export const ALL_SOURCES = COLLECTIONS.flatMap((c) => c.sources);
