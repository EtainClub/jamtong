/**
 * 잼공의 길 — 하단 탭 다섯과 그 안의 칸. 설계는 docs/daily-study.md §8.2. 순수 함수만 둔다(study.test.ts).
 * 정원의 nav.ts와 같은 모양이다. 주소의 ?tab= 값은 "자리(place)" — 탭 이름이거나 칸 이름이다.
 *
 * ★ 화면은 단계만큼만 보인다(docs/jamgong-roadmap.md §3.3). 칸마다 보이기 시작하는 단계(minLevel)가 있고,
 *   칸이 하나도 안 보이는 탭은 하단 탭에서 빠진다 — 1단계 사람의 하단 탭은 넷이다(말하기는 4단계부터).
 *   「준비 중」 칸도 그 단계에 닿은 사람에게만 보인다. 처음 온 사람은 만들다 만 칸을 보지 않는다.
 */
import type { Level } from "./types";

export type StudyTab = "class" | "road" | "talk" | "note" | "me";

export type StudySegment =
  | "today" | "notice"
  | "path" | "fields"
  | "reply" | "rumors" | "explain"
  | "cards" | "review" | "terms"
  | "attend" | "rewards" | "settings";

export type StudyPlace = StudyTab | StudySegment;

export interface StudyNav {
  tab: StudyTab;
  seg: StudySegment;
}

export const STUDY_TABS: Array<{ id: StudyTab; icon: string; label: string }> = [
  { id: "class", icon: "🏫", label: "교실" },
  { id: "road", icon: "🗺️", label: "배움길" },
  { id: "talk", icon: "💬", label: "말하기" },
  { id: "note", icon: "📒", label: "근거노트" },
  { id: "me", icon: "🌼", label: "내 기록" },
];

/** 탭마다의 칸. 첫 칸이 기본이다. minLevel = 그 칸이 보이기 시작하는 단계. */
export const STUDY_SEGMENTS: Record<StudyTab, Array<{ id: StudySegment; label: string; minLevel: Level }>> = {
  class: [{ id: "today", label: "오늘", minLevel: 1 }, { id: "notice", label: "알림장", minLevel: 3 }],
  road: [{ id: "path", label: "길", minLevel: 1 }, { id: "fields", label: "분야 지도", minLevel: 2 }],
  talk: [{ id: "reply", label: "쟁점 연습", minLevel: 4 }, { id: "rumors", label: "도는 말", minLevel: 4 }, { id: "explain", label: "30초 설명", minLevel: 5 }],
  note: [{ id: "cards", label: "근거 카드", minLevel: 1 }, { id: "review", label: "다시 볼 것", minLevel: 1 }, { id: "terms", label: "용어장", minLevel: 2 }],
  me: [{ id: "attend", label: "출석부", minLevel: 1 }, { id: "rewards", label: "실력 점검", minLevel: 3 }, { id: "settings", label: "설정", minLevel: 1 }],
};

/** 이 단계에서 보이는 칸. */
export function visibleSegments(tab: StudyTab, level: Level): Array<{ id: StudySegment; label: string }> {
  return STUDY_SEGMENTS[tab].filter((s) => s.minLevel <= level);
}

/** 이 단계에서 보이는 탭 — 보이는 칸이 하나라도 있는 탭. */
export function visibleTabs(level: Level): typeof STUDY_TABS {
  return STUDY_TABS.filter((t) => visibleSegments(t.id, level).length > 0);
}

/** 자리가 이 단계에서 보이지 않으면 교실로 — 옛 링크(?tab=reply)로 온 1단계 사람이 빈 칸을 보지 않게. */
export function navForLevel(nav: StudyNav | null, level: Level): StudyNav {
  if (nav && visibleSegments(nav.tab, level).some((s) => s.id === nav.seg)) return nav;
  return STUDY_HOME;
}

/**
 * 아직 만들지 않은 칸과 그 칸이 무엇이 될지. 눌리는데 아무 일도 없는 칸이 가장 나쁘다 —
 * 칸은 보이되 "준비 중"과 할 일을 글로 적는다(BottomNav와 같은 원칙). 다 만들면 여기서 뺀다.
 */
export const SOON: Partial<Record<StudySegment, string>> = {
  notice: "새 단원이 열리거나, 내가 익힌 근거가 고쳐지면 여기에 알려 드려요.",
  fields: "분야(외교·안보, 민생·복지 …)마다 내가 아는 단원이 꽃밭으로 피어요.",
  rumors: "SNS에서 도는 말 가운데 대응하는 근거가 있는 것만 모아 보여 드려요.",
  explain: "다 익힌 단원을 소리 내어 30초 동안 설명하고, 빠뜨린 것을 스스로 짚어 보는 연습이에요.",
  terms: "언행의 용어 풀이와 레슨에서 만난 낱말이 모여요.",
};

/** 자리 → 탭과 칸. 모르는 값이면 null. */
export function studyNavOf(place: string | null | undefined): StudyNav | null {
  if (!place) return null;
  for (const tab of Object.keys(STUDY_SEGMENTS) as StudyTab[]) {
    if (place === tab) return { tab, seg: STUDY_SEGMENTS[tab][0].id };
    if (STUDY_SEGMENTS[tab].some((s) => s.id === place)) return { tab, seg: place as StudySegment };
  }
  return null;
}

export const STUDY_HOME: StudyNav = { tab: "class", seg: "today" };
