"use client";

import type { RouteTrack } from "@/lib/geo/route-track";
import { useVisualState } from "@/lib/visual-state/store";

export function RouteSwitcher({ tracks }: { tracks: RouteTrack[] }) {
  const activeRouteId = useVisualState((s) => s.activeRouteId);
  const showBaseline = useVisualState((s) => s.showBaseline);
  const setActiveRoute = useVisualState((s) => s.setActiveRoute);
  const toggleBaseline = useVisualState((s) => s.toggleBaseline);
  const setMotionProgress = useVisualState((s) => s.setMotionProgress);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div
        role="radiogroup"
        aria-label="항로 선택"
        className="inline-flex rounded-lg border border-line bg-ink-700 p-1"
      >
        {tracks.map((route) => {
          const isActive = route.id === activeRouteId;
          return (
            <button
              key={route.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => {
                setActiveRoute(route.id);
                setMotionProgress(0);
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-ice-500 text-ink-900"
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
              }`}
            >
              {route.name}
              <span className="tabular ml-2 text-xs opacity-70">
                {route.totalKm.toLocaleString("ko-KR")}km
              </span>
            </button>
          );
        })}
      </div>

      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={showBaseline}
          onChange={toggleBaseline}
          className="h-4 w-4 accent-[var(--warm-400)]"
        />
        비교 항로 함께 보기
      </label>
    </div>
  );
}
