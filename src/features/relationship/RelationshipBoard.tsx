"use client";

import { useMemo } from "react";
import type {
  Claim,
  Entity,
  EntityKind,
  Graph,
  Relation,
  TimelineEvent,
} from "@/content/schema";
import { relationsAt, type GraphLayout } from "@/lib/graph/layout";
import { useVisualState } from "@/lib/visual-state/store";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 관계도 보드 (설계서 6·7장).
 *
 * 두 가지가 이 화면을 다른 관계도와 구분한다.
 *
 *  1. Edge에 의미가 있다. 선만 그어 두지 않는다. 커서를 올리면 무슨 관계인지,
 *     언제 생겼는지, 근거가 몇 건인지가 바로 나온다.
 *  2. 시간에 따라 변한다. 타임라인 커서를 옮기면 그 시점에 존재하던 관계만 남는다.
 *     정적인 그림이 아니라 시간 좌표를 가진 지식 그래프다.
 *
 * 배치는 서버에서 한 번만 계산해 고정한다. 시점마다 다시 배치하면 노드가
 * 튀어다녀서 "무엇이 새로 생겼는지"를 눈으로 따라갈 수 없다.
 */

const KIND_STYLE: Record<EntityKind, { fill: string; ring: string }> = {
  government: { fill: "var(--navy-tint)", ring: "var(--navy)" },
  organization: { fill: "var(--navy-tint)", ring: "var(--navy-tint)" },
  company: { fill: "var(--burgundy-tint)", ring: "var(--burgundy)" },
  project: { fill: "var(--taupe)", ring: "var(--stone)" },
  place: { fill: "var(--taupe)", ring: "var(--ash)" },
  country: { fill: "var(--burgundy-tint)", ring: "var(--burgundy-tint)" },
};

const KIND_LABEL: Record<EntityKind, string> = {
  government: "정부·부처",
  organization: "공공기관·국제기구",
  company: "기업·민간",
  project: "사업",
  place: "장소·항만",
  country: "국가",
};

interface Props {
  graph: Graph;
  layout: GraphLayout;
  claims: Claim[];
  /** 커서는 연표 이벤트 id로 들어온다. 비교하려면 날짜로 바꿔야 한다. */
  timeline: TimelineEvent[];
}

export function RelationshipBoard({ graph, layout, claims, timeline }: Props) {
  const cursorEventId = useVisualState((s) => s.timelineCursor);
  const focusedEntityId = useVisualState((s) => s.focusedEntityId);
  const hoveredRelationId = useVisualState((s) => s.hoveredRelationId);
  const focusEntity = useVisualState((s) => s.focusEntity);
  const hoverRelation = useVisualState((s) => s.hoverRelation);

  // 연표 커서를 실제 날짜로 바꾼다. 커서가 없으면 전체를 보여준다.
  const cursor = useMemo(() => {
    if (!cursorEventId) return null;
    return timeline.find((e) => e.id === cursorEventId)?.date ?? null;
  }, [cursorEventId, timeline]);

  const cursorLabel = useMemo(() => {
    if (!cursorEventId) return null;
    const event = timeline.find((e) => e.id === cursorEventId);
    return event ? (event.displayDate ?? event.date) : null;
  }, [cursorEventId, timeline]);

  const entityById = useMemo(
    () => new Map(graph.entities.map((e) => [e.id, e])),
    [graph.entities],
  );

  // 시점 필터 → 노드 선택 필터. 순서가 중요하다.
  const visibleRelations = useMemo(() => {
    const atTime = relationsAt(graph.relations, cursor);
    if (!focusedEntityId) return atTime;
    return atTime.filter(
      (r) => r.fromId === focusedEntityId || r.toId === focusedEntityId,
    );
  }, [graph.relations, cursor, focusedEntityId]);

  const liveEntityIds = useMemo(() => {
    const ids = new Set(visibleRelations.flatMap((r) => [r.fromId, r.toId]));
    return ids;
  }, [visibleRelations]);

  const hovered = visibleRelations.find((r) => r.id === hoveredRelationId) ?? null;

  return (
    <figure className="m-0">
      <svg
        viewBox={layout.viewBox}
        className="w-full h-auto"
        role="group"
        aria-label="인물·기관·사업 관계도"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0,1 L9,5 L0,9 z" fill="var(--navy)" />
          </marker>
        </defs>

        {/* Edge */}
        <g>
          {graph.relations.map((relation) => {
            const from = layout.nodes[relation.fromId];
            const to = layout.nodes[relation.toId];
            if (!from || !to) return null;

            const isVisible = visibleRelations.some((r) => r.id === relation.id);
            const isHovered = relation.id === hoveredRelationId;
            const isClaim = relation.assertionType !== "FACT";

            return (
              <g
                key={relation.id}
                opacity={isVisible ? 1 : 0.07}
                style={{ transition: "opacity 320ms var(--ease-out-expo)" }}
                className={isVisible ? "cursor-pointer" : "pointer-events-none"}
                onPointerEnter={() => isVisible && hoverRelation(relation.id)}
                onPointerLeave={() => hoverRelation(null)}
              >
                {/* 히트 영역을 넓게 둔다. 선만으로는 잡기 어렵다. */}
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="transparent"
                  strokeWidth={18}
                />
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isHovered ? "var(--navy)" : "var(--ash)"}
                  strokeWidth={isHovered ? 2.4 : 1.4}
                  // 점선 = 확인된 사실이 아니라 주장·해석 (설계 검토 4.1)
                  strokeDasharray={isClaim ? "5 4" : undefined}
                  markerEnd="url(#arrow)"
                  markerStart={relation.bidirectional ? "url(#arrow)" : undefined}
                />
              </g>
            );
          })}
        </g>

        {/* Node */}
        <g>
          {graph.entities.map((entity) => {
            const node = layout.nodes[entity.id];
            if (!node) return null;

            const style = KIND_STYLE[entity.kind];
            const isLive = liveEntityIds.has(entity.id);
            const isFocused = entity.id === focusedEntityId;
            const radius = entity.isFocus ? 44 : 30 + Math.min(node.degree, 4) * 2;

            return (
              <g
                key={entity.id}
                transform={`translate(${node.x} ${node.y})`}
                opacity={isLive ? 1 : 0.18}
                style={{ transition: "opacity 320ms var(--ease-out-expo)" }}
                tabIndex={0}
                role="button"
                aria-pressed={isFocused}
                aria-label={`${entity.name} (${KIND_LABEL[entity.kind]})${isFocused ? ", 선택됨" : ""}`}
                onClick={() => focusEntity(entity.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    focusEntity(entity.id);
                  }
                }}
                className="cursor-pointer"
              >
                {isFocused && (
                  <circle r={radius + 9} fill="none" stroke="var(--navy)" strokeWidth={1.5} />
                )}
                <circle
                  r={radius}
                  fill={style.fill}
                  stroke={style.ring}
                  strokeWidth={entity.isFocus ? 2.5 : 1.5}
                />
                <text
                  textAnchor="middle"
                  y={4}
                  className={`pointer-events-none fill-[var(--ink)] font-semibold ${
                    entity.isFocus
                      ? "text-[14px]"
                      : entity.name.length > 8
                        ? "text-[11px]"
                        : "text-[12px]"
                  }`}
                >
                  {wrap(entity.name).map((line, i, all) => (
                    <tspan key={line} x={0} dy={i === 0 ? -(all.length - 1) * 6.5 : 13}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Edge 설명 — 선을 클릭하지 않아도 의미가 보여야 한다 */}
      <figcaption
        className="mt-4 min-h-[112px] rounded-card border border-stone bg-taupe p-5"
        aria-live="polite"
      >
        {hovered ? (
          <RelationDetail relation={hovered} entityById={entityById} claims={claims} />
        ) : (
          <p className="text-sm leading-relaxed text-ash">
            선 위에 커서를 올리면 어떤 관계인지, 언제 생겼는지, 근거가 무엇인지 나타납니다.
            노드를 누르면 그 기관에 걸린 관계만 남습니다.
          </p>
        )}
      </figcaption>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ash">
        <span className="flex items-center gap-1.5">
          <svg width="22" height="6" aria-hidden="true">
            <line x1="0" y1="3" x2="22" y2="3" stroke="var(--ash)" strokeWidth="1.6" />
          </svg>
          확인된 사실
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="22" height="6" aria-hidden="true">
            <line
              x1="0"
              y1="3"
              x2="22"
              y2="3"
              stroke="var(--ash)"
              strokeWidth="1.6"
              strokeDasharray="5 4"
            />
          </svg>
          주장·해석
        </span>
        <span>
          {cursorLabel ? `${cursorLabel} 시점 ` : ""}관계 {visibleRelations.length}건 / 전체{" "}
          {graph.relations.length}건
        </span>
        {focusedEntityId && (
          <button
            type="button"
            onClick={() => focusEntity(null)}
            className="ml-auto rounded-full px-2.5 py-1 font-medium text-navy hover:bg-taupe"
          >
            선택 해제
          </button>
        )}
      </div>

      {graph.note && (
        <p className="mt-4 border-l-2 border-ash pl-4 text-[13px] leading-relaxed text-ash">
          {graph.note}
        </p>
      )}
    </figure>
  );
}

function RelationDetail({
  relation,
  entityById,
  claims,
}: {
  relation: Relation;
  entityById: Map<string, Entity>;
  claims: Claim[];
}) {
  const from = entityById.get(relation.fromId);
  const to = entityById.get(relation.toId);
  const supporting = relation.claimIds
    .map((id) => claims.find((c) => c.id === id))
    .filter((c): c is Claim => Boolean(c));

  return (
    <div>
      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
        <span>{from?.name}</span>
        <span aria-hidden="true" className="text-navy">
          {relation.bidirectional ? "↔" : "→"}
        </span>
        <span>{to?.name}</span>
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-smoke">{relation.label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="tabular rounded-full bg-taupe px-2 py-1 text-[11px] text-ash">
          {relation.startDate}
          {relation.startPrecision === "circa" && " 무렵"}
        </span>
        {relation.assertionType !== "FACT" && relation.assertedBy && (
          <span className="rounded-full bg-burgundy-tint px-2 py-1 text-[11px] font-medium text-burgundy ring-1 ring-burgundy/25">
            {relation.assertedBy}의 주장
          </span>
        )}
        {supporting.map((claim) => (
          <EvidenceButton
            key={claim.id}
            claimId={claim.id}
            count={claim.sourceIds.length}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 노드 안에 들어갈 만큼만 줄을 나눈다.
 *
 * 한국어는 임의 위치에서 끊으면 "한국해양수 / 산개발원"처럼 읽을 수 없게 된다.
 * 공백과 가운뎃점을 먼저 찾고, 없을 때만 길이로 자른다.
 */
function wrap(name: string, maxPerLine = 7): string[] {
  if (name.length <= maxPerLine) return [name];

  const separator = /[ ·]/;
  if (separator.test(name)) {
    const lines: string[] = [];
    let current = "";
    for (const token of name.split(/(?<=[ ·])/)) {
      if (current && (current + token).trim().length > maxPerLine) {
        lines.push(current.trim());
        current = token;
      } else {
        current += token;
      }
    }
    if (current.trim()) lines.push(current.trim());
    return lines.slice(0, 3);
  }

  // 구분자가 없는 한국어 이름은 균등하게 나눈다.
  // 7자씩 끊으면 "북극항로추진본 / 부"처럼 마지막 줄에 한 글자만 남는다.
  const lineCount = Math.min(3, Math.ceil(name.length / maxPerLine));
  const perLine = Math.ceil(name.length / lineCount);
  const lines: string[] = [];
  for (let i = 0; i < name.length; i += perLine) {
    lines.push(name.slice(i, i + perLine));
  }
  return lines.slice(0, 3);
}
