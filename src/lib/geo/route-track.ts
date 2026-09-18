import { geoDistance, geoInterpolate } from "d3-geo";
import type { Route, Waypoint } from "@/content/schema";
import { createProjection, VIEW } from "./projection";

/**
 * 경로를 **서버에서** 화면 좌표 트랙으로 미리 구워 둔다.
 *
 * 이유: 투영이 고정이므로 브라우저가 d3-geo로 구면 보간을 다시 할 이유가 없다.
 * 트랙을 넘기면 클라이언트는 배열 조회와 선형 보간만 하면 되고,
 * d3-geo(약 25KB gzip)가 번들에서 통째로 빠진다.
 * — 검토 문서 7.2 성능 예산(First Load JS < 150KB).
 *
 * 샘플은 **누적 거리 기준으로 등간격**이다. 따라서 진행도 t에서의 인덱스가
 * t * (n - 1)로 바로 나오고, 배가 일정한 속도로 움직인다.
 */

const EARTH_RADIUS_KM = 6371;
const SAMPLE_COUNT = 300;

export interface TrackWaypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  km: number;
  /** 진행도가 이 구간에 닿으면 보여줄 해설. */
  note?: string;
  /** 기점·종점이면 true. 라벨을 항상 띄운다. */
  isEndpoint: boolean;
}

export interface RouteTrack {
  id: string;
  name: string;
  isBaseline: boolean;
  totalKm: number;
  totalDaysMin: number;
  totalDaysMax: number;
  claimId: string;
  /** [x, y] 쌍을 평탄화한 배열. 객체 배열보다 직렬화 크기가 작다. */
  points: number[];
  /** 위 샘플로 만든 SVG path. 클라이언트는 이걸 그대로 그린다. */
  pathD: string;
  waypoints: TrackWaypoint[];
}

type Coord = [number, number];

/** 경유지를 대권으로 이어 누적 거리를 가진 촘촘한 폴리라인으로 만든다. */
function densify(waypoints: Waypoint[]): { coord: Coord; km: number }[] {
  const out: { coord: Coord; km: number }[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a: Coord = [waypoints[i].lon, waypoints[i].lat];
    const b: Coord = [waypoints[i + 1].lon, waypoints[i + 1].lat];
    const interpolate = geoInterpolate(a, b);
    const steps = Math.max(
      2,
      Math.ceil((geoDistance(a, b) * EARTH_RADIUS_KM) / 40),
    );
    const fromKm = waypoints[i].cumulativeKm;
    const spanKm = waypoints[i + 1].cumulativeKm - fromKm;

    for (let s = 0; s < steps; s++) {
      const local = s / steps;
      out.push({ coord: interpolate(local) as Coord, km: fromKm + spanKm * local });
    }
  }

  const last = waypoints[waypoints.length - 1];
  out.push({ coord: [last.lon, last.lat], km: last.cumulativeKm });
  return out;
}

export function buildTrack(route: Route): RouteTrack {
  const projection = createProjection();
  const dense = densify(route.waypoints);
  const totalKm = route.waypoints[route.waypoints.length - 1].cumulativeKm;

  const round = (n: number) => Math.round(n * 10) / 10;
  const points: number[] = [];
  let cursor = 0;

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const targetKm = (i / (SAMPLE_COUNT - 1)) * totalKm;
    while (cursor < dense.length - 2 && dense[cursor + 1].km < targetKm) cursor++;

    const a = dense[cursor];
    const b = dense[cursor + 1] ?? a;
    const span = b.km - a.km;
    const local = span > 0 ? (targetKm - a.km) / span : 0;
    const coord = geoInterpolate(a.coord, b.coord)(local) as Coord;

    const screen = projection(coord);
    // 투영 밖으로 잘린 샘플은 NaN으로 표시해 클라이언트가 선을 끊게 한다.
    points.push(
      screen && Number.isFinite(screen[0]) ? round(screen[0]) : Number.NaN,
      screen && Number.isFinite(screen[1]) ? round(screen[1]) : Number.NaN,
    );
  }

  let pathD = "";
  let penDown = false;
  for (let i = 0; i < points.length; i += 2) {
    const x = points[i];
    const y = points[i + 1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      penDown = false;
      continue;
    }
    pathD += penDown ? `L${x},${y}` : `M${x},${y}`;
    penDown = true;
  }

  const lastIndex = route.waypoints.length - 1;
  const waypoints: TrackWaypoint[] = route.waypoints.flatMap((wp, index) => {
    const screen = projection([wp.lon, wp.lat]);
    if (!screen || !Number.isFinite(screen[0])) return [];
    return [
      {
        id: wp.id,
        name: wp.name,
        x: round(screen[0]),
        y: round(screen[1]),
        km: wp.cumulativeKm,
        note: wp.note,
        isEndpoint: index === 0 || index === lastIndex,
      },
    ];
  });

  return {
    id: route.id,
    name: route.name,
    isBaseline: route.isBaseline,
    totalKm: route.totalKm,
    totalDaysMin: route.totalDaysMin,
    totalDaysMax: route.totalDaysMax,
    claimId: route.claimId,
    points,
    pathD,
    waypoints,
  };
}

export const TRACK_VIEW = VIEW;
