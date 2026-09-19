import { feature } from "topojson-client";
import { geoCircle, geoGraticule } from "d3-geo";
import type { Topology, GeometryCollection } from "topojson-specification";
import topo from "world-atlas/land-110m.json";
import { createPathBuilder } from "./projection";

/**
 * 지도 배경 경로를 **서버에서 미리 계산**한다.
 *
 * 투영이 고정(팬/줌 없음)이므로 클라이언트가 topojson 원본과 변환 코드를
 * 받을 이유가 없다. 브라우저는 완성된 path 문자열만 받는다.
 * — 검토 문서 7.2 성능 예산(초기 JS < 150KB)을 지키는 방식.
 */

export interface MapBackground {
  land: string;
  graticule: string;
  arcticCircle: string;
}


/**
 * path 좌표의 자릿수를 줄인다.
 *
 * 760px 화면에서 0.1px 차이는 보이지 않는데, 자르지 않으면 좌표 하나가
 * 17자리까지 늘어나 HTML이 배로 커진다.
 *
 * precision 0은 히어로 카드용이다. 카드는 지도의 일부만, 그것도 작게 보여주므로
 * 소수점이 필요 없다. 같은 경로를 소수점까지 실으면 첫 화면에만 수십 KB가
 * 더 붙는다 — RSC 페이로드와 HTML에 각각 한 번씩 들어가므로 두 배로 문다.
 */
function compact(d: string | null, precision: 0 | 1): string {
  const text = d ?? "";
  return precision === 0
    ? text.replace(/(-?\d+)\.\d+/g, "$1")
    : text.replace(/(-?\d+\.\d)\d+/g, "$1");
}

const cache = new Map<number, MapBackground>();

export function getMapBackground(precision: 0 | 1 = 1): MapBackground {
  const hit = cache.get(precision);
  if (hit) return hit;

  const path = createPathBuilder();
  const topology = topo as unknown as Topology<{ land: GeometryCollection }>;
  const land = feature(topology, topology.objects.land);

  // 10° 간격 격자는 이 축척에서 그물처럼 보이고 HTML만 키운다.
  const graticule = geoGraticule().step([30, 15])();

  // 북위 66.5° — 북극권 경계. 항로가 어디를 지나는지 한눈에 보이게 한다.
  const arctic = geoCircle().center([0, 90]).radius(23.5).precision(1)();

  const value: MapBackground = {
    land: compact(path(land), precision),
    graticule: compact(path(graticule), precision),
    arcticCircle: compact(path(arctic), precision),
  };

  cache.set(precision, value);
  return value;
}
