"use client";

import { create } from "zustand";

/**
 * Global Visual State (설계서 11장).
 *
 * 규칙: 모든 씬 컴포넌트는 이 상태만 읽고 자기 지역 상태를 갖지 않는다.
 * 이 규칙을 지키면 나중에 Scene 엔진 추출이 단순 리팩터링으로 끝나고,
 * AI Visual Guide가 화면을 조작할 지점도 여기 하나로 모인다.
 */

export type SceneId = "hero" | "route" | "timeline" | "evidence";
export type PanelId = "evidence" | null;

export interface VisualState {
  storyId: string | null;
  sceneId: SceneId;

  /** 경로 위 진행도 0..1. 사용자가 배를 끌면 여기가 바뀐다. */
  motionProgress: number;
  activeRouteId: string;
  /** 비교 항로를 겹쳐 그릴지 여부. */
  showBaseline: boolean;

  /** 타임라인 커서. 연표 이벤트 id. */
  timelineCursor: string | null;

  openPanel: PanelId;
  selectedClaimId: string | null;

  /** 사용자가 드래그 중인지. 애니메이션 보간을 끄는 데 쓴다. */
  isScrubbing: boolean;
}

export interface VisualActions {
  setScene: (sceneId: SceneId) => void;
  setMotionProgress: (progress: number) => void;
  setActiveRoute: (routeId: string) => void;
  toggleBaseline: () => void;
  seekTimeline: (eventId: string | null) => void;
  openEvidence: (claimId: string) => void;
  closePanel: () => void;
  setScrubbing: (scrubbing: boolean) => void;
  resetView: () => void;
  hydrate: (patch: Partial<VisualState>) => void;
}

export const initialVisualState: VisualState = {
  storyId: null,
  sceneId: "hero",
  motionProgress: 0,
  activeRouteId: "nsr",
  showBaseline: true,
  timelineCursor: null,
  openPanel: null,
  selectedClaimId: null,
  isScrubbing: false,
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const useVisualState = create<VisualState & VisualActions>((set) => ({
  ...initialVisualState,

  setScene: (sceneId) => set({ sceneId }),
  setMotionProgress: (progress) => set({ motionProgress: clamp01(progress) }),
  setActiveRoute: (activeRouteId) => set({ activeRouteId }),
  toggleBaseline: () => set((s) => ({ showBaseline: !s.showBaseline })),
  seekTimeline: (timelineCursor) => set({ timelineCursor }),

  openEvidence: (claimId) => set({ openPanel: "evidence", selectedClaimId: claimId }),
  closePanel: () => set({ openPanel: null, selectedClaimId: null }),
  setScrubbing: (isScrubbing) => set({ isScrubbing }),

  resetView: () =>
    set({
      sceneId: "hero",
      motionProgress: 0,
      timelineCursor: null,
      openPanel: null,
      selectedClaimId: null,
    }),

  hydrate: (patch) => set(patch),
}));
