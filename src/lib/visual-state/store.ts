"use client";

import { create } from "zustand";

/**
 * Global Visual State (설계서 11장).
 *
 * 규칙: 모든 씬 컴포넌트는 이 상태만 읽고 자기 지역 상태를 갖지 않는다.
 * 이 규칙을 지키면 나중에 Scene 엔진 추출이 단순 리팩터링으로 끝나고,
 * AI Visual Guide가 화면을 조작할 지점도 여기 하나로 모인다.
 */

export type SceneId = "hero" | "route" | "compare" | "land" | "flow" | "counterpoint" | "timeline" | "share";
export type PanelId = "evidence" | null;

/**
 * 진행도를 누가 몰고 있는가.
 *
 * 기본은 스크롤이다. 사용자가 배를 잡거나 키로 움직이는 순간 "manual"로 바뀌고,
 * 그때부터 스크롤은 진행도를 건드리지 않는다. 그러지 않으면 직접 맞춰 놓은 위치가
 * 살짝만 스크롤해도 튕겨 나간다.
 */
export type ProgressSource = "scroll" | "manual";

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

  /**
   * 자금 흐름에서 보고 있는 시나리오.
   * "다른 구조였다면" 화면을 그대로 공유할 수 있어야 하므로 URL에 실린다.
   */
  activeScenarioId: string | null;

  openPanel: PanelId;
  selectedClaimId: string | null;

  /** 사용자가 드래그 중인지. 애니메이션 보간을 끄는 데 쓴다. */
  isScrubbing: boolean;

  progressSource: ProgressSource;
}

export interface VisualActions {
  setScene: (sceneId: SceneId) => void;
  /** 사용자 조작. 이 시점부터 스크롤은 진행도를 몰지 않는다. */
  setMotionProgress: (progress: number) => void;
  /** 스크롤 구동. manual로 넘어간 뒤에는 무시된다. */
  setScrollProgress: (progress: number) => void;
  /** 스크롤에 다시 진행도를 맡긴다. */
  followScroll: () => void;
  setActiveRoute: (routeId: string) => void;
  toggleBaseline: () => void;
  seekTimeline: (eventId: string | null) => void;
  setScenario: (scenarioId: string) => void;
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
  activeScenarioId: null,
  openPanel: null,
  selectedClaimId: null,
  isScrubbing: false,
  progressSource: "scroll",
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const useVisualState = create<VisualState & VisualActions>((set) => ({
  ...initialVisualState,

  setScene: (sceneId) => set({ sceneId }),

  setMotionProgress: (progress) =>
    set({ motionProgress: clamp01(progress), progressSource: "manual" }),

  setScrollProgress: (progress) =>
    set((s) =>
      s.progressSource === "manual" ? s : { motionProgress: clamp01(progress) },
    ),

  followScroll: () => set({ progressSource: "scroll" }),

  setActiveRoute: (activeRouteId) => set({ activeRouteId }),
  toggleBaseline: () => set((s) => ({ showBaseline: !s.showBaseline })),
  seekTimeline: (timelineCursor) => set({ timelineCursor }),
  setScenario: (activeScenarioId) => set({ activeScenarioId }),

  openEvidence: (claimId) => set({ openPanel: "evidence", selectedClaimId: claimId }),
  closePanel: () => set({ openPanel: null, selectedClaimId: null }),
  setScrubbing: (isScrubbing) => set({ isScrubbing }),

  resetView: () =>
    set({
      sceneId: "hero",
      motionProgress: 0,
      timelineCursor: null,
      activeScenarioId: null,
      openPanel: null,
      selectedClaimId: null,
      progressSource: "scroll",
    }),

  hydrate: (patch) => set(patch),
}));
