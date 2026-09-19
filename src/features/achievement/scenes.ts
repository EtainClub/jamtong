import type { Achievement } from "@/content/schema";
import type { SceneId } from "@/lib/visual-state/store";

export interface SceneNavItem {
  id: SceneId;
  label: string;
}

/**
 * 업적별 씬 목록.
 *
 * 헤더 내비게이션과 AI 안내가 같은 목록을 본다. 두 곳에 따로 적어 두면
 * AI가 존재하지 않는 씬으로 데려가려 한다.
 *
 * ★ 업적을 하나 추가하면 여기도 추가해야 한다. 빠뜨리면 그 업적의 AI 안내는
 *   404로 죽는다(`/api/ask`). `pnpm agent:check`가 이걸 잡는다.
 */
export const SCENES_BY_ACHIEVEMENT: Record<string, SceneNavItem[]> = {
  "arctic-route": [
    { id: "hero", label: "개요" },
    { id: "route", label: "항로" },
    { id: "compare", label: "비교" },
    { id: "timeline", label: "경과" },
    { id: "relations", label: "관계도" },
    { id: "shorts", label: "쇼츠" },
    { id: "share", label: "공유" },
  ],
  daejangdong: [
    { id: "hero", label: "개요" },
    { id: "timeline", label: "경과" },
    { id: "land", label: "토지이용" },
    { id: "flow", label: "자금 흐름" },
    { id: "relations", label: "관계도" },
    { id: "counterpoint", label: "쟁점" },
    { id: "shorts", label: "쇼츠" },
    { id: "share", label: "공유" },
  ],
  "stock-market": [
    { id: "hero", label: "개요" },
    { id: "series", label: "지수" },
    { id: "timeline", label: "경과" },
    { id: "relations", label: "관계도" },
    { id: "counterpoint", label: "쟁점" },
    { id: "shorts", label: "쇼츠" },
    { id: "share", label: "공유" },
  ],
  "seongnam-welfare": [
    { id: "timeline", label: "경과" },
    { id: "flow", label: "예산" },
    { id: "relations", label: "관계도" },
    { id: "counterpoint", label: "쟁점" },
    { id: "shorts", label: "쇼츠" },
    { id: "share", label: "공유" },
  ],
  "seongnam-debt": [
    { id: "timeline", label: "경과" },
    { id: "flow", label: "빚의 구성" },
    { id: "relations", label: "관계도" },
    { id: "counterpoint", label: "쟁점" },
    { id: "shorts", label: "쇼츠" },
    { id: "share", label: "공유" },
  ],
  "seongnam-hospital": [
    { id: "timeline", label: "경과" },
    { id: "relations", label: "관계도" },
    { id: "counterpoint", label: "쟁점" },
    { id: "shorts", label: "쇼츠" },
    { id: "share", label: "공유" },
  ],
  "seongnam-meals": [
    { id: "timeline", label: "경과" },
    { id: "composition", label: "구성" },
    { id: "relations", label: "관계도" },
    { id: "counterpoint", label: "쟁점" },
    { id: "shorts", label: "쇼츠" },
    { id: "share", label: "공유" },
  ],
};

/**
 * 이 업적이 지금 실제로 가진 씬.
 *
 * 쇼츠가 없는 업적에 "쇼츠" 탭이 뜨면 눌러도 갈 곳이 없고, AI 안내는 그 빈 칸으로
 * 데려가려 한다. 화면과 AI가 같은 목록을 보도록 거르는 일을 한 군데서 한다.
 */
export function scenesFor(achievement: Achievement): SceneNavItem[] {
  const scenes = SCENES_BY_ACHIEVEMENT[achievement.slug];
  if (!scenes) return [];
  return scenes.filter((scene) => scene.id !== "shorts" || achievement.shorts.length > 0);
}
