import type { RouteTrack, TrackWaypoint } from "./route-track";

/**
 * 트랙 위 좌표 계산 — 순수 산술. d3 의존 없음.
 * 서버가 구운 등간격 샘플 덕분에 진행도 → 인덱스가 곧바로 나온다.
 */

export interface TrackPosition {
  x: number;
  y: number;
  bearing: number;
  km: number;
  waypoint: TrackWaypoint;
  visible: boolean;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function sampleCount(track: RouteTrack): number {
  return track.points.length / 2;
}

export function positionOnTrack(track: RouteTrack, t: number): TrackPosition {
  const n = sampleCount(track);
  const progress = Math.min(1, Math.max(0, t));
  const f = progress * (n - 1);
  const i = Math.min(n - 2, Math.max(0, Math.floor(f)));
  const local = f - i;

  const x0 = track.points[i * 2];
  const y0 = track.points[i * 2 + 1];
  const x1 = track.points[i * 2 + 2];
  const y1 = track.points[i * 2 + 3];

  const visible = Number.isFinite(x0) && Number.isFinite(y0);
  const canInterpolate = visible && Number.isFinite(x1) && Number.isFinite(y1);

  const x = canInterpolate ? lerp(x0, x1, local) : x0;
  const y = canInterpolate ? lerp(y0, y1, local) : y0;
  const bearing = canInterpolate
    ? (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI
    : 0;

  const km = progress * track.totalKm;

  let waypoint = track.waypoints[0];
  for (const candidate of track.waypoints) {
    if (candidate.km <= km + 1) waypoint = candidate;
  }
  // 다음 경유지가 더 가까우면 그쪽 이름을 쓴다 ("부근"이 자연스럽게 읽히도록)
  const next = track.waypoints.find((w) => w.km > km);
  if (next && next.km - km < km - waypoint.km) waypoint = next;

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    bearing: Math.round(bearing * 10) / 10,
    km: Math.round(km),
    waypoint,
    visible,
  };
}

/** 화면 좌표에서 가장 가까운 샘플의 진행도를 되찾는다. */
export function progressFromPoint(track: RouteTrack, px: number, py: number): number {
  const n = sampleCount(track);
  let bestIndex = 0;
  let bestDistance = Infinity;

  for (let i = 0; i < n; i++) {
    const x = track.points[i * 2];
    const y = track.points[i * 2 + 1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

    const distance = (x - px) ** 2 + (y - py) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }

  return bestIndex / (n - 1);
}
