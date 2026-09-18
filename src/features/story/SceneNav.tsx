"use client";

import { useEffect } from "react";
import { useVisualState, type SceneId } from "@/lib/visual-state/store";
import type { SceneNavItem } from "./scenes";

/**
 * 씬 내비게이션 + 스크롤 관찰자.
 *
 * 화면에 들어온 섹션을 VisualState의 sceneId로 올린다. 이 값은 지금은 헤더
 * 표시에만 쓰이지만, AI Visual Guide가 GO_TO_SCENE을 실행할 때 기준이 되는
 * 좌표이기도 하다. 그래서 지역 상태가 아니라 전역 상태에 둔다.
 */

export function SceneNav({ scenes }: { scenes: SceneNavItem[] }) {
  const sceneId = useVisualState((s) => s.sceneId);
  const setScene = useVisualState((s) => s.setScene);

  useEffect(() => {
    const sections = scenes.map(({ id }) =>
      document.querySelector<HTMLElement>(`[data-scene="${id}"]`),
    ).filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면 중앙 띠에 걸친 섹션 중 가장 많이 보이는 것을 현재 씬으로 본다.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const id = visible?.target.getAttribute("data-scene") as SceneId | null;
        if (id) setScene(id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.01, 0.5, 1] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [scenes, setScene]);

  const goTo = (id: SceneId) => {
    const el = document.querySelector<HTMLElement>(`[data-scene="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label="스토리 구간" className="hidden sm:block">
      <ol className="flex items-center gap-1">
        {scenes.map((scene) => {
          const isActive = scene.id === sceneId;
          return (
            <li key={scene.id}>
              <button
                type="button"
                onClick={() => goTo(scene.id)}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-ice-500/15 text-ice-400"
                    : "text-text-muted hover:bg-white/5 hover:text-text-secondary"
                }`}
              >
                {scene.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
