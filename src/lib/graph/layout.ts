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
  /** 이름이 차지하는 자리까지 포함한 반경. 충돌 계산에 쓴다. */
  radius: number;
}

/**
 * 노드가 실제로 먹는 자리.
 *
 * 원의 크기만으로 밀어내면 이름이 긴 노드끼리 글자가 겹친다.
 * "자사주 소각 의무"는 "국회"보다 훨씬 넓은 자리를 차지한다.
 */
function footprint(name: string, isFocus: boolean): number {
  const base = isFocus ? 58 : 48;
  return base + Math.min(name.replace(/\s/g, "").length, 9) * 3.4;
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
    const radius = footprint(entity.name, entity.isFocus);
    if (entity.isFocus) {
      /*
       * 중심 노드를 못 박지 않는다.
       *
       * 고정하면 충돌 힘이 그 노드를 밀어낼 수 없어서, 연결이 몰리는 중심
       * 위로 이웃들이 그대로 올라앉는다. 노드가 열 개를 넘으면 반드시 겹친다.
       * 풀어 두면 연결이 가장 많은 노드라 어차피 가운데로 모인다.
       */
      return { id: entity.id, isFocus: true, radius, x: cx, y: cy };
    }
    const index = others.indexOf(entity);
    const angle = (index / Math.max(others.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const ring = Math.min(GRAPH_VIEW.width, GRAPH_VIEW.height) * 0.34;
    return {
      id: entity.id,
      isFocus: false,
      radius,
      x: cx + Math.cos(angle) * ring,
      y: cy + Math.sin(angle) * ring,
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
        /*
         * 중심 노드는 고정돼 있어 밀려나지 않는다. 연결이 몰리는 것도 중심이라,
         * 중심에 붙는 선을 길게 잡지 않으면 이웃들이 중심 위에 겹쳐 앉는다.
         */
        .distance((link) => {
          const a = link.source as SimNode;
          const b = link.target as SimNode;
          return a.isFocus || b.isFocus ? 215 : 160;
        })
        .strength(0.28),
    )
    .force("charge", forceManyBody().strength(-820))
    .force("center", forceCenter(cx, cy).strength(0.08))
    // 이름이 먹는 자리만큼 밀어낸다. 노드가 많아져도 글자가 겹치지 않는다.
    .force("collide", forceCollide<SimNode>((d) => d.radius).strength(1).iterations(4))
    .stop();

  // 동기 실행. 틱 수를 고정해야 매 빌드마다 같은 좌표가 나온다.
  simulation.tick(600);

  /*
   * 프레임을 결과에 맞춘다. 결과를 프레임에 맞추지 않는다.
   *
   * 전에는 배치가 끝난 뒤 경계상자를 재서 고정 캔버스(720×560)에 욱여넣었다.
   * 그런데 노드가 많아 경계가 넓어지면 배율이 1보다 작아지고, 그러면 충돌 힘이
   * 벌려 놓은 간격까지 같이 줄어든다. 겹치지 말라고 민 것을 도로 붙이는 셈이다.
   *
   * 좌표는 그대로 두고 viewBox만 내용에 맞춰 잡는다. 화면에 맞추는 일은
   * 브라우저가 한다 — 그게 SVG가 원래 하는 일이다.
   */
  const margin = 86;
  const round = (n: number) => Math.round(n * 10) / 10;

  const layout: Record<string, GraphNodeLayout> = {};
  for (const node of nodes) {
    layout[node.id] = {
      id: node.id,
      x: round(node.x ?? cx),
      y: round(node.y ?? cy),
      degree: degree.get(node.id) ?? 0,
    };
  }

  const placed = Object.values(layout);
  const left = Math.min(...placed.map((n) => n.x)) - margin;
  const right = Math.max(...placed.map((n) => n.x)) + margin;
  const top = Math.min(...placed.map((n) => n.y)) - margin;
  const bottom = Math.max(...placed.map((n) => n.y)) + margin;
  const viewBox = `${round(left)} ${round(top)} ${round(right - left)} ${round(bottom - top)}`;

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
