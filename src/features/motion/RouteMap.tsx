"use client";

import { useCallback, useMemo, useRef } from "react";
import { useVisualState } from "@/lib/visual-state/store";
import type { RouteTrack } from "@/lib/geo/route-track";
import { elapsedDayRange, positionOnTrack, progressFromPoint } from "@/lib/geo/track-math";
import type { MapBackground } from "@/lib/geo/land";

/**
 * 모션 씬 — 사용자가 배를 직접 끌어 두 항로의 차이를 확인한다.
 *
 * 설계서 35장 원칙: "의미 없는 애니메이션은 만들지 않는다."
 * 여기서 움직임이 설명하는 것은 **거리**다. 배를 끌면 이동 거리와 운항 일수가
 * 같이 변하고, 회색 대조 항로와의 차이가 눈에 보인다.
 *
 * 접근성(검토 문서 7.1): 드래그는 유일한 조작 수단이 아니다.
 * 배 자체가 role="slider"이며 화살표/PageUp/Home/End 키로 동일하게 조작된다.
 *
 * 기하 계산은 전부 서버에서 끝났다(route-track.ts). 여기서는 배열 조회뿐이다.
 */

const VIEW = { width: 760, height: 760 } as const;
const KEY_STEP = 0.02;
const KEY_STEP_LARGE = 0.1;

interface Props {
  tracks: RouteTrack[];
  background: MapBackground;
  /** 스크롤 씬에서는 수치를 옆 패널이 갖는다. 지도 아래 표는 숨긴다. */
  hideReadouts?: boolean;
}

export function RouteMap({ tracks, background, hideReadouts = false }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const activeRouteId = useVisualState((s) => s.activeRouteId);
  const showBaseline = useVisualState((s) => s.showBaseline);
  const progress = useVisualState((s) => s.motionProgress);
  const isScrubbing = useVisualState((s) => s.isScrubbing);
  const setMotionProgress = useVisualState((s) => s.setMotionProgress);
  const setScrubbing = useVisualState((s) => s.setScrubbing);

  const active = tracks.find((t) => t.id === activeRouteId) ?? tracks[0];
  const baseline = tracks.find((t) => t.id !== active.id);

  const position = useMemo(() => positionOnTrack(active, progress), [active, progress]);

  const toViewBox = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * VIEW.width,
      y: ((clientY - rect.top) / rect.height) * VIEW.height,
    };
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!useVisualState.getState().isScrubbing) return;
      const point = toViewBox(event.clientX, event.clientY);
      if (!point) return;
      setMotionProgress(progressFromPoint(active, point.x, point.y));
    },
    [active, setMotionProgress, toViewBox],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setScrubbing(true);
      const point = toViewBox(event.clientX, event.clientY);
      if (point) setMotionProgress(progressFromPoint(active, point.x, point.y));
    },
    [active, setMotionProgress, setScrubbing, toViewBox],
  );

  const endScrub = useCallback(() => setScrubbing(false), [setScrubbing]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<SVGGElement>) => {
      const current = useVisualState.getState().motionProgress;
      let next: number | null = null;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = current + KEY_STEP;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          next = current - KEY_STEP;
          break;
        case "PageUp":
          next = current + KEY_STEP_LARGE;
          break;
        case "PageDown":
          next = current - KEY_STEP_LARGE;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      setMotionProgress(next);
    },
    [setMotionProgress],
  );

  const remainingKm = active.totalKm - position.km;
  const elapsedDays = elapsedDayRange(active, position.km);

  /**
   * 구간 라벨의 노출 규칙.
   *  - 기점·종점은 항상 보인다. 어디서 어디로 가는지가 먼저다.
   *  - 중간 경유지는 배가 다가오면 떠오르고, 지나간 뒤에는 흐려진다.
   *    처음부터 전부 띄우면 극지 구간이 글자로 뒤덮인다.
   */
  const labels = active.waypoints.map((wp) => {
    if (wp.isEndpoint) return { wp, opacity: 1, current: false };

    const distance = wp.km - position.km;
    const current = Math.abs(distance) < 600;
    const approaching = distance > 0 && distance < 1600;
    const passed = distance <= 0;

    const opacity = current ? 1 : approaching ? 0.45 : passed ? 0.32 : 0;
    return { wp, opacity, current };
  });

  return (
    <figure className="relative m-0">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="w-full h-auto touch-none select-none cursor-grab active:cursor-grabbing"
        role="group"
        aria-label={`${active.name} 지도. 배를 끌거나 화살표 키로 항로를 따라 이동할 수 있습니다.`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endScrub}
        onPointerCancel={endScrub}
        onPointerLeave={endScrub}
      >
        <defs>
          <radialGradient id="ocean" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--map-sea-top)" />
            <stop offset="100%" stopColor="var(--map-sea)" />
          </radialGradient>
        </defs>

        <circle
          cx={VIEW.width / 2}
          cy={VIEW.height / 2}
          r={VIEW.width / 2 - 8}
          fill="url(#ocean)"
        />

        <path d={background.graticule} fill="none" stroke="var(--map-grid)" strokeWidth={0.6} />
        <path d={background.land} fill="var(--map-land)" stroke="var(--map-land-edge)" strokeWidth={0.5} />
        <path
          d={background.arcticCircle}
          fill="none"
          stroke="var(--navy-tint)"
          strokeWidth={1}
          strokeDasharray="4 5"
          opacity={0.7}
        />

        {/* 대조 항로 — 점선. 비교 대상이지 주인공이 아니다. */}
        {showBaseline && baseline && (
          <path
            aria-hidden="true"
            d={baseline.pathD}
            fill="none"
            stroke="var(--burgundy)"
            strokeWidth={2}
            strokeDasharray="6 6"
            opacity={0.55}
            strokeLinecap="round"
          />
        )}

        {/* 주항로: 발광 → 전체 → 지나온 구간 */}
        <path
          d={active.pathD}
          fill="none"
          stroke="var(--navy)"
          strokeWidth={9}
          opacity={0.1}
          strokeLinecap="round"
        />
        <path
          d={active.pathD}
          fill="none"
          stroke="var(--navy-tint)"
          strokeWidth={2.5}
          opacity={0.6}
          strokeLinecap="round"
        />
        <path
          d={active.pathD}
          fill="none"
          stroke="var(--navy)"
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
          style={{
            transition: isScrubbing ? "none" : "stroke-dashoffset 220ms var(--ease-out-expo)",
          }}
        />

        <g aria-hidden="true">
          {active.waypoints.map((wp) => {
            const passed = wp.km <= position.km;
            return (
              <circle
                key={wp.id}
                cx={wp.x}
                cy={wp.y}
                r={passed ? 3.5 : 2.5}
                fill={passed ? "var(--navy)" : "var(--stone)"}
                stroke="var(--canvas)"
                strokeWidth={1}
              />
            );
          })}
        </g>

        {/* 구간 라벨 */}
        <g aria-hidden="true" className="pointer-events-none">
          {labels.map(({ wp, opacity, current }) =>
            opacity === 0 ? null : (
              <text
                key={`label-${wp.id}`}
                x={wp.x}
                y={wp.y - (current ? 26 : wp.isEndpoint ? 15 : 11)}
                textAnchor="middle"
                opacity={opacity}
                className={
                  wp.isEndpoint || current
                    ? "fill-[var(--ink)] text-[15px] font-semibold"
                    : "fill-[var(--smoke)] text-[11.5px] font-medium"
                }
                style={{
                  paintOrder: "stroke",
                  stroke: "var(--canvas)",
                  strokeWidth: wp.isEndpoint || current ? 4 : 3,
                  transition: isScrubbing ? "none" : "opacity 260ms var(--ease-out-expo)",
                }}
              >
                {wp.name}
              </text>
            ),
          )}
        </g>

        {/* 배 — 키보드로도 조작되는 슬라이더 */}
        {position.visible && (
          <g
            tabIndex={0}
            role="slider"
            aria-label="항로 위 현재 위치"
            aria-valuemin={0}
            aria-valuemax={active.totalKm}
            aria-valuenow={position.km}
            aria-valuetext={`부산에서 ${position.km.toLocaleString("ko-KR")}킬로미터, ${position.waypoint.name} 부근, ${elapsedDays}차`}
            onKeyDown={handleKeyDown}
            transform={`translate(${position.x} ${position.y})`}
            style={{
              transition: isScrubbing ? "none" : "transform 220ms var(--ease-out-expo)",
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <circle r={16} fill="var(--navy)" opacity={0.16} />
            <circle r={9} fill="var(--navy)" />
            <g transform={`rotate(${position.bearing})`}>
              <path d="M9 0 L-5 5 L-2.5 0 L-5 -5 Z" fill="var(--eggshell)" />
            </g>
          </g>
        )}
      </svg>

      {/* 스크린리더용 서술 — "Card First, Text Later"의 Text */}
      <p className="sr-only" aria-live="polite">
        {`${active.name}. 부산에서 ${position.km.toLocaleString("ko-KR")}킬로미터 이동했고 ${remainingKm.toLocaleString("ko-KR")}킬로미터 남았습니다. 현재 ${position.waypoint.name} 부근이며 ${elapsedDays}차입니다. 전체 ${active.totalKm.toLocaleString("ko-KR")}킬로미터, ${active.totalDaysMin}~${active.totalDaysMax}일.`}
      </p>

      {!hideReadouts && (
        <figcaption className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-stone bg-stone">
          <Readout label="현재 위치" value={position.waypoint.name} />
          <Readout label="이동 거리" value={`${position.km.toLocaleString("ko-KR")} km`} />
          <Readout label="운항 일수" value={elapsedDays} />
        </figcaption>
      )}
    </figure>
  );
}

export function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-taupe px-3 py-3">
      <div className="truncate text-[11px] uppercase tracking-wider text-ash">
        {label}
      </div>
      {/* 스크럽 중에 줄바꿈이 생기면 숫자가 위아래로 튄다. 한 줄로 고정한다. */}
      <div className="tabular mt-1 whitespace-nowrap text-[15px] font-semibold text-ink">
        {value}
      </div>
    </div>
  );
}
