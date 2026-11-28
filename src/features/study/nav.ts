/**
 * 잼공의 길 — 하단 탭 다섯과 그 안의 칸. 설계는 docs/daily-study.md §8.2. 순수 함수만 둔다(study.test.ts).
 * 정원의 nav.ts와 같은 모양이다. 주소의 ?tab= 값은 "자리(place)" — 탭 이름이거나 칸 이름이다.
 */

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

/** 탭마다의 칸. 첫 칸이 기본이다. */
export const STUDY_SEGMENTS: Record<StudyTab, Array<{ id: StudySegment; label: string }>> = {
  class: [{ id: "today", label: "오늘" }, { id: "notice", label: "알림장" }],
  road: [{ id: "path", label: "길" }, { id: "fields", label: "분야 지도" }],
  talk: [{ id: "reply", label: "대화 연습" }, { id: "rumors", label: "도는 말" }, { id: "explain", label: "30초 설명" }],
  note: [{ id: "cards", label: "근거 카드" }, { id: "review", label: "다시 볼 것" }, { id: "terms", label: "용어장" }],
  me: [{ id: "attend", label: "출석부" }, { id: "rewards", label: "꽃밭·배지" }, { id: "settings", label: "설정" }],
};

/**
 * 아직 만들지 않은 칸과 그 칸이 무엇이 될지. 눌리는데 아무 일도 없는 칸이 가장 나쁘다 —
 * 칸은 보이되 "준비 중"과 할 일을 글로 적는다(BottomNav와 같은 원칙). 다 만들면 여기서 뺀다.
 */
export const SOON: Partial<Record<StudySegment, string>> = {
  notice: "새 단원이 열리거나, 내가 익힌 근거가 고쳐지면 여기에 알려 드려요.",
  fields: "분야(외교·안보, 민생·복지 …)마다 내가 아는 단원이 꽃밭으로 피어요.",
  reply: "친구가 보낸 도는 말에 근거 카드를 골라 답장을 만들어 보는 연습이에요. 정책 팩트의 길과 함께 열려요.",
  rumors: "SNS에서 도는 말 가운데 대응하는 근거가 있는 것만 모아 보여 드려요.",
  explain: "다 익힌 단원을 소리 내어 30초 동안 설명하고, 빠뜨린 것을 스스로 짚어 보는 연습이에요.",
  terms: "언행의 용어 풀이와 레슨에서 만난 낱말이 모여요.",
  rewards: "공부한 만큼 정원에 씨앗과 잼이 가고, 알아낸 것으로 배지를 받아요.",
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
