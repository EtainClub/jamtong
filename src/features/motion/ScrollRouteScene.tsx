"use client";

import { useEffect, useRef } from "react";
import type { RouteTrack } from "@/lib/geo/route-track";
import type { MapBackground } from "@/lib/geo/land";
import { elapsedDayRange, positionOnTrack } from "@/lib/geo/track-math";
import { useVisualState } from "@/lib/visual-state/store";
import { RouteMap, Readout } from "./RouteMap";
import { RouteSwitcher } from "@/features/story/RouteSwitcher";

/**
 * 스크롤 구동 모션 씬.
 *
 * 긴 구간 안에서 지도를 고정(sticky)해 두고, 스크롤한 만큼 배가 나아간다.
 * 스크롤이 곧 항해다 — 설계서 32장의 Vertical Visual Story를 데스크탑까지
 * 같은 원리로 확장한 것이다.
 *
 * 스크롤 하이재킹은 하지 않는다. 페이지는 평범하게 스크롤되고, 진행도만
 * 그 위치에서 파생된다. 사용자가 배를 직접 잡으면 진행도 주도권이 넘어가고
 * (progressSource: "manual") 스크롤은 더 이상 위치를 건드리지 않는다.
 */

interface Props {
  tracks: RouteTrack[];
  background: MapBackground;
}

export function ScrollRouteScene({ tracks, background }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  const activeRouteId = useVisualState((s) => s.activeRouteId);
  const progress = useVisualState((s) => s.motionProgress);
  const progressSource = useVisualState((s) => s.progressSource);
  const setScrollProgress = useVisualState((s) => s.setScrollProgress);
  const followScroll = useVisualState((s) => s.followScroll);

  const active = tracks.find((t) => t.id === activeRouteId) ?? tracks[0];
  const position = positionOnTrack(active, progress);
  const elapsedDays = elapsedDayRange(active, position.km);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const measure = () => {
      frame.current = null;
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      setScrollProgress(-rect.top / travel);
    };

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [setScrollProgress]);

  return (
    <div
      ref={sectionRef}
      // 항해 구간의 길이. 뷰포트 3개분을 스크롤하면 부산에서 로테르담에 닿는다.
      className="relative h-[340vh]"
    >
      <div className="sticky top-14 flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center py-4 sm:py-6">
        <div className="grid items-center gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <RouteMap tracks={tracks} background={background} hideReadouts />

          <div className="space-y-4">
            <RouteSwitcher tracks={tracks} />

            {/* 구간 해설 — 스크롤에 따라 바뀌는 자막 */}
            <div
              className="min-h-[104px] rounded-xl border border-line bg-ink-700 p-5"
              aria-live="polite"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ice-400">
                {position.waypoint.name}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                {position.waypoint.note ?? "항로를 따라 이동 중입니다."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
              <Readout label="이동 거리" value={`${position.km.toLocaleString("ko-KR")} km`} />
              <Readout label="운항 일수" value={elapsedDays} />
              <Readout
                label="남은 거리"
                value={`${(active.totalKm - position.km).toLocaleString("ko-KR")} km`}
              />
            </div>

            {progressSource === "manual" ? (
              <button
                type="button"
                onClick={followScroll}
                className="w-full rounded-lg border border-line bg-ink-700 px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-ice-600 hover:text-ice-400"
              >
                스크롤에 다시 맡기기
              </button>
            ) : (
              <p className="px-1 text-xs leading-relaxed text-text-muted">
                스크롤하면 배가 나아갑니다. 직접 끌거나 화살표 키로 움직일 수도 있습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
