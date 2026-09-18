import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import type { Graph, Relation } from "@/content/schema";

/**
 * 관계도 배치를 **서버에서** 계산한다.
 *
 * 두 가지 이유가 있다.
 *  1. d3-force를 클라이언트로 보내지 않는다 (검토 문서 7.2 성능 예산).
 *  2. 좌표가 고정되므로 하이드레이션이 안전하고, 타임라인을 움직여도
 *     남아 있는 노드가 제자리를 지킨다.
 *
 * 시점마다 배치를 다시 계산하지 않는 것이 핵심이다. 커서를 옮길 때마다 노드가
 * 튀어다니면 "무엇이 새로 생겼는지"를 눈으로 따라갈 수 없다. 전체 그래프로 한 번
 * 배치하고, 시점에 따라 나타났다 사라지게만 한다.
 */

export const GRAPH_VIEW = { width: 720, height: 560 } as const;

interface SimNode extends SimulationNodeDatum {
  id: string;
  isFocus: boolean;
}

export interface GraphNodeLayout {
  id: string;
  x: number;
  y: number;
  /** 연결된 관계 수. 노드 크기에 쓴다. */
  degree: number;
}

export interface GraphLayout {
  nodes: Record<string, GraphNodeLayout>;
  /**
   * 내용에 맞춰 잘라낸 viewBox.
   *
   * 고정 비율 캔버스에 균일 배율로 맞추면 한쪽 축에 반드시 여백이 남는다.
   * 그래프의 자연스러운 종횡비는 데이터마다 다르므로, 배치를 끝낸 뒤
   * 내용 경계에 맞춰 캔버스를 자르는 편이 낫다.
   */
  viewBox: string;
  /** 모든 관계에 등장하는 시점을 정렬해 둔 것. 타임라인 눈금이 된다. */
  timePoints: string[];
}

export function buildGraphLayout(graph: Graph): GraphLayout {
  const degree = new Map<string, number>();
  for (const relation of graph.relations) {
    degree.set(relation.fromId, (degree.get(relation.fromId) ?? 0) + 1);
    degree.set(relation.toId, (degree.get(relation.toId) ?? 0) + 1);
  }

  const cx = GRAPH_VIEW.width / 2;
  const cy = GRAPH_VIEW.height / 2;

  // 초기 위치를 결정적으로 깐다. d3 기본 배치에 의존하지 않는다.
  const others = graph.entities.filter((e) => !e.isFocus);
  const nodes: SimNode[] = graph.entities.map((entity) => {
    if (entity.isFocus) {
      return { id: entity.id, isFocus: true, x: cx, y: cy, fx: cx, fy: cy };
    }
    const index = others.indexOf(entity);
    const angle = (index / Math.max(others.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const radius = Math.min(GRAPH_VIEW.width, GRAPH_VIEW.height) * 0.34;
    return {
      id: entity.id,
      isFocus: false,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    };
  });

  const links: SimulationLinkDatum<SimNode>[] = graph.relations.map((relation) => ({
    source: relation.fromId,
    target: relation.toId,
  }));

  const simulation = forceSimulation(nodes)
    .force(
      "link",
      forceLink<SimNode, SimulationLinkDatum<SimNode>>(links)
        .id((d) => d.id)
        .distance(150)
        .strength(0.35),
    )
    .force("charge", forceManyBody().strength(-620))
    .force("center", forceCenter(cx, cy).strength(0.08))
    .force("collide", forceCollide(62))
    .stop();

  // 동기 실행. 틱 수를 고정해야 매 빌드마다 같은 좌표가 나온다.
  simulation.tick(400);

  /*
   * 시뮬레이션 결과를 화면에 맞춘다.
   *
   * force 파라미터만으로 프레임을 채우려 하면 노드 수가 바뀔 때마다 다시
   * 튜닝해야 한다. 결과의 경계상자를 재서 균일 배율로 맞추는 편이 안정적이고,
   * 종횡비를 유지하므로 관계의 각도가 왜곡되지 않는다.
   */
  const margin = 78;
  const xs = nodes.map((n) => n.x ?? cx);
  const ys = nodes.map((n) => n.y ?? cy);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scale = Math.min(
    (GRAPH_VIEW.width - margin * 2) / spanX,
    (GRAPH_VIEW.height - margin * 2) / spanY,
    1.6,
  );

  // 배율을 적용한 뒤 남는 여백을 양쪽에 똑같이 나눈다.
  const offsetX = (GRAPH_VIEW.width - spanX * scale) / 2;
  const offsetY = (GRAPH_VIEW.height - spanY * scale) / 2;

  const round = (n: number) => Math.round(n * 10) / 10;
  const layout: Record<string, GraphNodeLayout> = {};
  for (const node of nodes) {
    layout[node.id] = {
      id: node.id,
      x: round(((node.x ?? cx) - minX) * scale + offsetX),
      y: round(((node.y ?? cy) - minY) * scale + offsetY),
      degree: degree.get(node.id) ?? 0,
    };
  }

  // 배치가 끝난 뒤 내용 경계 + 라벨 여유만큼만 남기고 캔버스를 자른다.
  const placed = Object.values(layout);
  const top = Math.min(...placed.map((n) => n.y)) - margin;
  const bottom = Math.max(...placed.map((n) => n.y)) + margin;
  const viewBox = `0 ${round(top)} ${GRAPH_VIEW.width} ${round(bottom - top)}`;

  return { nodes: layout, viewBox, timePoints: collectTimePoints(graph.relations) };
}

function collectTimePoints(relations: Relation[]): string[] {
  return [...new Set(relations.map((r) => r.startDate))].sort();
}

/** 커서 시점에 존재하는 관계만 남긴다. endDate가 지난 관계는 빠진다. */
export function relationsAt(relations: Relation[], cursor: string | null): Relation[] {
  if (!cursor) return relations;
  return relations.filter(
    (r) => r.startDate <= cursor && (!r.endDate || r.endDate >= cursor),
  );
}
