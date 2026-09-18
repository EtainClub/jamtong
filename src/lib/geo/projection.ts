import { geoAzimuthalEquidistant, geoPath, geoInterpolate, geoDistance } from "d3-geo";
import type { Waypoint } from "@/content/schema";

/**
 * 북극 중심 정사방위도법(azimuthal equidistant).
 *
 * MapLibre GL 대신 이 투영을 쓰는 이유(검토 문서 6장):
 *  - 메르카토르는 극지에서 왜곡이 심해 북극항로가 실제보다 길고 이상하게 보인다.
 *  - 이 투영은 중심(북극)으로부터의 거리가 보존되므로 "가까워진다"는 주장을
 *    지도 자체가 증명한다. 즉 투영 선택이 곧 논지다.
 *  - 팬/줌이 필요 없으므로 지도 라이브러리 800KB가 통째로 불필요하다.
 */

export const VIEW = { width: 760, height: 760 } as const;

export function createProjection(width: number = VIEW.width, height: number = VIEW.height) {
  // rotate 경도 67°E = 부산(129°E)과 로테르담(5°E)의 중간.
  // 두 도착지가 화면 아래쪽 좌우로 갈라지고, 북극항로가 위쪽을 가로지른다.
  // clipAngle 100° — 북위 -10°까지만 그린다. 남반구를 버려야 북극이 커진다.
  return geoAzimuthalEquidistant()
    .rotate([-67, -90])
    .clipAngle(100)
    .translate([width / 2, height / 2])
    .scale(width / 3.6);
}

export function createPathBuilder(width?: number, height?: number) {
  return geoPath(createProjection(width, height));
}

export type Point = [number, number];

/**
 * 투영 좌표를 고정 소수점으로 반올림한다.
 *
 * 삼각함수 결과의 마지막 자리가 Node와 브라우저에서 다르게 나오면
 * (403.41872569110063 vs 403.4187256911007) React가 하이드레이션 불일치로
 * 잡는다. 화면상 차이는 없으므로 양쪽을 같은 값으로 맞춘다.
 */
const round = (n: number) => Math.round(n * 100) / 100;

export function roundPoint(point: [number, number]): Point {
  return [round(point[0]), round(point[1])];
}

/** 지구 반지름(km). 대권거리 → km 환산에 쓴다. */
const EARTH_RADIUS_KM = 6371;

/**
 * 경유지를 대권(great circle)으로 이어 촘촘한 폴리라인으로 만든다.
 * 점 단위로 투영하므로 날짜변경선 통과도 자연스럽게 처리된다.
 */
export function densifyRoute(waypoints: Waypoint[], stepKm = 120): Point[] {
  const out: Point[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a: Point = [waypoints[i].lon, waypoints[i].lat];
    const b: Point = [waypoints[i + 1].lon, waypoints[i + 1].lat];
    const segmentKm = geoDistance(a, b) * EARTH_RADIUS_KM;
    const steps = Math.max(2, Math.ceil(segmentKm / stepKm));
    const interpolate = geoInterpolate(a, b);

    for (let s = 0; s < steps; s++) {
      out.push(interpolate(s / steps) as Point);
    }
  }

  const last = waypoints[waypoints.length - 1];
  out.push([last.lon, last.lat]);
  return out;
}

/** 폴리라인을 SVG path 문자열로. 투영 밖으로 잘린 점에서 선을 끊는다. */
export function toSvgPath(points: Point[], width?: number, height?: number): string {
  const projection = createProjection(width, height);
  let d = "";
  let penDown = false;

  for (const point of points) {
    const projected = projection(point);
    if (!projected || !Number.isFinite(projected[0]) || !Number.isFinite(projected[1])) {
      penDown = false;
      continue;
    }
    const [x, y] = projected;
    d += penDown ? `L${x.toFixed(1)},${y.toFixed(1)}` : `M${x.toFixed(1)},${y.toFixed(1)}`;
    penDown = true;
  }

  return d;
}

export interface RoutePosition {
  /** 지리 좌표 */
  coord: Point;
  /** 화면 좌표 (투영 밖이면 null) */
  screen: Point | null;
  /** 진행 방향(도). 배 아이콘 회전에 쓴다. */
  bearing: number;
  /** 출발지 기준 누적 거리(km) */
  km: number;
  /** 직전에 지난 경유지 */
  nearestWaypoint: Waypoint;
}

/**
 * 진행도 t(0..1)에서의 위치를 누적 거리 기준으로 구한다.
 *
 * 경유지 간격이 균일하지 않으므로 t를 인덱스가 아니라 cumulativeKm에
 * 대응시킨다. 그래야 배가 일정한 속도로 움직이는 것처럼 보인다.
 */
export function positionAt(
  waypoints: Waypoint[],
  t: number,
  width?: number,
  height?: number,
): RoutePosition {
  const projection = createProjection(width, height);
  const totalKm = waypoints[waypoints.length - 1].cumulativeKm;
  const targetKm = Math.min(totalKm, Math.max(0, t * totalKm));

  let i = 0;
  while (i < waypoints.length - 2 && waypoints[i + 1].cumulativeKm < targetKm) i++;

  const from = waypoints[i];
  const to = waypoints[i + 1];
  const span = to.cumulativeKm - from.cumulativeKm;
  const local = span > 0 ? (targetKm - from.cumulativeKm) / span : 0;

  const interpolate = geoInterpolate([from.lon, from.lat], [to.lon, to.lat]);
  const coord = interpolate(local) as Point;
  const ahead = interpolate(Math.min(1, local + 0.01)) as Point;

  const screen = projection(coord);
  const screenAhead = projection(ahead);
  const bearing =
    screen && screenAhead
      ? (Math.atan2(screenAhead[1] - screen[1], screenAhead[0] - screen[0]) * 180) / Math.PI
      : 0;

  return {
    coord,
    screen: screen && Number.isFinite(screen[0]) ? roundPoint(screen as Point) : null,
    bearing: round(bearing),
    km: Math.round(targetKm),
    nearestWaypoint: local < 0.5 ? from : to,
  };
}

/** 화면 좌표(마우스/터치)에서 가장 가까운 경로 진행도를 되찾는다. */
export function progressFromScreen(
  waypoints: Waypoint[],
  x: number,
  y: number,
  width?: number,
  height?: number,
): number {
  const projection = createProjection(width, height);
  const totalKm = waypoints[waypoints.length - 1].cumulativeKm;
  const points = densifyRoute(waypoints, 60);

  let best = 0;
  let bestDist = Infinity;
  let accumulated = 0;

  for (let i = 0; i < points.length; i++) {
    if (i > 0) accumulated += geoDistance(points[i - 1], points[i]) * EARTH_RADIUS_KM;
    const projected = projection(points[i]);
    if (!projected || !Number.isFinite(projected[0])) continue;

    const dx = projected[0] - x;
    const dy = projected[1] - y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      best = accumulated;
    }
  }

  return Math.min(1, Math.max(0, best / totalKm));
}
