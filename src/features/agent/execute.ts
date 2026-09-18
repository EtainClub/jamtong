"use client";

import type { AgentAction } from "@/lib/agent/actions";
import { useVisualState, type SceneId } from "@/lib/visual-state/store";

/**
 * 액션을 화면에 적용한다.
 *
 * 서버가 이미 실행 불가능한 액션을 걸러냈으므로 여기서는 실행만 한다.
 * 그래도 씬 요소가 없을 수 있어(초안 스토리 등) 스크롤은 방어적으로 다룬다.
 *
 * 한 박자씩 띄워 실행한다. 여러 변화가 동시에 일어나면 무엇이 바뀌었는지
 * 눈으로 따라갈 수 없다 — 안내의 목적이 바로 그 '따라가기'다.
 */

const STEP_MS = 480;

export async function runActions(actions: AgentAction[]): Promise<void> {
  const state = useVisualState.getState();

  for (const [index, action] of actions.entries()) {
    if (index > 0) await wait(STEP_MS);

    switch (action.type) {
      case "SET_VIEW":
        if (action.view) state.setStoryView(action.view);
        break;

      case "GO_TO_SCENE":
        if (action.targetId) {
          // 씬은 원문 보기에만 있다. 쉽게 보기 상태면 먼저 넘어간다.
          state.setStoryView("full");
          await wait(120);
          scrollToScene(action.targetId as SceneId);
        }
        break;

      case "SEEK_TIMELINE":
        if (action.targetId) {
          state.setStoryView("full");
          state.seekTimeline(action.targetId);
          scrollToScene("timeline");
        }
        break;

      case "FOCUS_ENTITY":
        if (action.targetId) {
          state.setStoryView("full");
          state.focusEntity(action.targetId);
          scrollToScene("relations");
        }
        break;

      case "SET_ROUTE":
        if (action.targetId) {
          state.setStoryView("full");
          state.setActiveRoute(action.targetId);
          scrollToScene("route");
        }
        break;

      case "SET_MOTION":
        if (action.progress !== null) {
          state.setStoryView("full");
          state.setMotionProgress(action.progress);
        }
        break;

      case "SET_SCENARIO":
        if (action.targetId) {
          state.setStoryView("full");
          state.setScenario(action.targetId);
          scrollToScene("flow");
        }
        break;

      case "OPEN_EVIDENCE":
        if (action.targetId) state.openEvidence(action.targetId);
        break;

      case "RESET_VIEW":
        state.resetView();
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
    }
  }
}

function scrollToScene(sceneId: SceneId) {
  const el = document.querySelector<HTMLElement>(`[data-scene="${sceneId}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  useVisualState.getState().setScene(sceneId);
}

function wait(ms: number) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return new Promise((resolve) => setTimeout(resolve, reduced ? 0 : ms));
}
