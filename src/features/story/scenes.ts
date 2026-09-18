import type { SceneId } from "@/lib/visual-state/store";

export interface SceneNavItem {
  id: SceneId;
  label: string;
}

/**
 * 스토리별 씬 목록.
 *
 * 헤더 내비게이션과 AI 안내가 같은 목록을 본다. 두 곳에 따로 적어 두면
 * AI가 존재하지 않는 씬으로 데려가려 한다.
 */
export const SCENES_BY_STORY: Record<string, SceneNavItem[]> = {
  "arctic-route": [
    { id: "hero", label: "개요" },
    { id: "route", label: "항로" },
    { id: "compare", label: "비교" },
    { id: "timeline", label: "경과" },
    { id: "relations", label: "관계도" },
    { id: "share", label: "공유" },
  ],
  daejangdong: [
    { id: "hero", label: "개요" },
    { id: "timeline", label: "경과" },
    { id: "land", label: "토지이용" },
    { id: "flow", label: "자금 흐름" },
    { id: "counterpoint", label: "쟁점" },
    { id: "share", label: "공유" },
  ],
};
