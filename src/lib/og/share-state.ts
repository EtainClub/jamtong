import { getAchievement } from "@/content/achievements";
import { ASSERTION_LABEL } from "@/content/labels";
import type { Achievement, Claim, TimelineEvent } from "@/content/schema";
import { scenesFor } from "@/features/achievement/scenes";

/**
 * 공유된 화면 상태를 콘텐츠로 되돌린다.
 *
 * ★ 카드에 들어가는 글자는 **전부 저장소에서 온다.**
 *   쿼리에 적힌 문자열을 그대로 그리면, 우리 도메인에서 아무 말이나 박힌
 *   카드를 만들어 퍼뜨릴 수 있게 된다. 그래서 쿼리로 받는 것은 id뿐이고,
 *   찾지 못한 id는 없는 것으로 친다.
 */

export interface SharedState {
  achievement: Achievement;
  sceneLabel?: string;
  moment?: TimelineEvent;
  claim?: Claim;
}

export function resolveShare(
  slug: string,
  query: URLSearchParams | Record<string, string | string[] | undefined>,
): SharedState | null {
  const achievement = getAchievement(slug);
  if (!achievement || achievement.publishStatus !== "published") return null;

  const get = (key: string): string | undefined => {
    if (query instanceof URLSearchParams) return query.get(key) ?? undefined;
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const sceneId = get("scene");
  const scene = sceneId ? scenesFor(achievement).find((s) => s.id === sceneId) : undefined;

  const at = get("at");
  const moment = at ? achievement.timeline.find((event) => event.id === at) : undefined;

  /* 근거 서랍이 열려 있을 때만 그 주장을 싣는다. 닫힌 서랍은 공유된 화면이 아니다. */
  const claimId = get("panel") === "evidence" ? get("claim") : undefined;
  const claim = claimId ? achievement.claims.find((c) => c.id === claimId) : undefined;

  return {
    achievement,
    sceneLabel: scene && scene.id !== "hero" ? scene.label : undefined,
    moment,
    claim,
  };
}

/** 카드와 og:description이 같은 문장을 쓴다. 두 곳에서 갈라지면 안 된다. */
export function shareSummary(state: SharedState): string {
  if (state.claim) {
    const kind = ASSERTION_LABEL[state.claim.assertionType];
    const by = state.claim.assertedBy ? ` — ${state.claim.assertedBy}` : "";
    return `${kind}${by}: ${state.claim.text}`;
  }
  if (state.moment) {
    return `${state.moment.displayDate ?? state.moment.date} · ${state.moment.title} — ${state.moment.summary}`;
  }
  return state.achievement.summary;
}

/** 공유된 화면이 업적 첫 화면과 다른가. 같으면 원래 카드로 충분하다. */
export function isStateful(state: SharedState): boolean {
  return Boolean(state.claim || state.moment || state.sceneLabel);
}
