"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useVisualState, type SceneId, type VisualState } from "./store";

/**
 * VisualState ↔ URL 양방향 동기화. **단일 지점**이다.
 *
 * 설계서 36장의 공유 기능 전체가 여기에 의존하므로, URL을 읽거나 쓰는 코드는
 * 이 파일 밖에 두지 않는다. (검토 문서 5.3 — shareSnapshot 컬렉션 대신 URL만 쓴다)
 *
 *   /story/arctic-route?scene=route&t=0.42&route=nsr&panel=evidence&claim=claim-days
 */

const SCENES: SceneId[] = [
  "hero",
  "route",
  "compare",
  "flow",
  "counterpoint",
  "timeline",
  "share",
];

function readFromParams(params: URLSearchParams): Partial<VisualState> {
  const patch: Partial<VisualState> = {};

  const scene = params.get("scene");
  if (scene && (SCENES as string[]).includes(scene)) patch.sceneId = scene as SceneId;

  const t = params.get("t");
  if (t !== null) {
    const n = Number(t);
    if (Number.isFinite(n)) patch.motionProgress = Math.min(1, Math.max(0, n));
  }

  const route = params.get("route");
  if (route) patch.activeRouteId = route;

  const cursor = params.get("at");
  if (cursor) patch.timelineCursor = cursor;

  const scenario = params.get("sc");
  if (scenario) patch.activeScenarioId = scenario;

  const panel = params.get("panel");
  if (panel === "evidence") patch.openPanel = "evidence";

  const claim = params.get("claim");
  if (claim) patch.selectedClaimId = claim;

  return patch;
}

function writeToParams(state: VisualState): string {
  const p = new URLSearchParams();
  if (state.sceneId !== "hero") p.set("scene", state.sceneId);
  if (state.motionProgress > 0) p.set("t", state.motionProgress.toFixed(3));
  if (state.activeRouteId !== "nsr") p.set("route", state.activeRouteId);
  if (state.timelineCursor) p.set("at", state.timelineCursor);
  if (state.activeScenarioId) p.set("sc", state.activeScenarioId);
  if (state.openPanel) p.set("panel", state.openPanel);
  if (state.selectedClaimId) p.set("claim", state.selectedClaimId);
  return p.toString();
}

/** 스토리 페이지에서 한 번만 마운트한다. */
export function useUrlSync(storyId: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydrated = useRef(false);
  const lastWritten = useRef<string | null>(null);
  const frame = useRef<number | null>(null);

  // URL → 상태 (최초 1회. 공유 링크로 들어온 사용자를 그 상태로 복원한다)
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    useVisualState.getState().hydrate({
      storyId,
      ...readFromParams(new URLSearchParams(searchParams.toString())),
    });
  }, [storyId, searchParams]);

  // 상태 → URL (드래그 중에는 rAF로 묶어 히스토리 폭주를 막는다)
  useEffect(() => {
    return useVisualState.subscribe((state) => {
      if (!hydrated.current) return;
      const qs = writeToParams(state);
      if (qs === lastWritten.current) return;

      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        lastWritten.current = qs;
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    });
  }, [router, pathname]);
}

/** 현재 화면 상태를 그대로 담은 공유용 절대 URL. */
export function buildShareUrl(origin: string, pathname: string, state: VisualState): string {
  const qs = writeToParams(state);
  return qs ? `${origin}${pathname}?${qs}` : `${origin}${pathname}`;
}
