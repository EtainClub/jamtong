"use client";

import { useMemo } from "react";
import type { Claim, IndexSeries, TimelineEvent } from "@/content/schema";
import { useVisualState } from "@/lib/visual-state/store";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 지수 시계열 (세 번째 스토리의 전용 개념).
 *
 * 연표 커서와 **같은 시간축**을 쓴다. 커서를 옮기면 차트에도 그 시점이 찍힌다.
 * 관계도가 시점에 따라 관계를 걸러내는 것과 같은 원리다 — 설계서 4장의
 * "타임라인 = 화면 전체의 시간 좌표"가 세 번째 씬에서도 성립하는지 확인하는 자리다.
 *
 * 고점 이후 구간을 반드시 함께 그린다. 오른 데까지만 그리고 멈추면
 * 그건 자료가 아니라 선전물이고, 이 제품의 전제가 무너진다.
 */

const VIEW = { width: 720, height: 300 } as const;
const PAD = { top: 26, right: 18, bottom: 34, left: 52 } as const;

export function IndexSeriesChart({
  series,
  timeline,
  claims,
}: {
  series: IndexSeries;
  timeline: TimelineEvent[];
  claims: Claim[];
}) {
  const cursorEventId = useVisualState((s) => s.timelineCursor);

  const geometry = useMemo(() => {
    const times = series.points.map((p) => toTime(p.date));
    const values = series.points.map((p) => p.value);
    const minT = Math.min(...times);
    const maxT = Math.max(...times);
    const maxV = Math.max(...values);

    const plotW = VIEW.width - PAD.left - PAD.right;
    const plotH = VIEW.height - PAD.top - PAD.bottom;

    // y축은 0에서 시작한다. 밑동을 자르면 변화가 실제보다 크게 보인다.
    const x = (t: number) => PAD.left + ((t - minT) / Math.max(maxT - minT, 1)) * plotW;
    const y = (v: number) => PAD.top + plotH - (v / maxV) * plotH;

    /*
     * 라벨 배치.
     *
     * 돌파 지점이 몰려 있으면 글자가 겹쳐 둘 다 못 읽는다. 앞선 라벨과
     * 가까우면 이번 것을 건너뛴다 — 겹쳐 놓느니 하나를 포기하는 편이 낫다.
     * 꼭대기에 붙은 점은 커서 라벨과 부딪히므로 아래쪽에 쓴다.
     */
    let lastLabelX = -Infinity;
    const nodes: {
      date: string;
      value: number;
      label?: string;
      x: number;
      y: number;
      milestone: boolean;
      showLabel: boolean;
      labelBelow: boolean;
      anchor: "start" | "middle" | "end";
    }[] = [];

    for (const point of series.points) {
      const px = round(x(toTime(point.date)));
      const py = round(y(point.value));
      const showLabel = Boolean(point.milestone && point.label) && px - lastLabelX > 74;
      if (showLabel) lastLabelX = px;

      nodes.push({
        date: point.date,
        value: point.value,
        label: point.label,
        milestone: point.milestone,
        x: px,
        y: py,
        showLabel,
        // 꼭대기에 붙은 점은 커서 라벨과 부딪히므로 아래쪽에 쓴다.
        labelBelow: py - PAD.top < 26,
        // 가장자리에서는 글자가 잘리므로 기준점을 안쪽으로 당긴다.
        anchor:
          px > VIEW.width - 80 ? "end" : px < PAD.left + 40 ? "start" : "middle",
      });
    }

    const peakIndex = values.indexOf(maxV);

    return {
      nodes,
      peakIndex,
      plotH,
      baseline: round(PAD.top + plotH),
      ticks: [0, 0.5, 1].map((r) => ({ value: Math.round(maxV * r), y: round(y(maxV * r)) })),
      x,
    };
  }, [series.points]);

  // 커서가 가리키는 시점을 차트 위에 찍는다.
  const cursor = useMemo(() => {
    if (!cursorEventId) return null;
    const event = timeline.find((e) => e.id === cursorEventId);
    if (!event) return null;

    const t = toTime(event.date);
    // 그 시점까지 알려진 마지막 값
    const known = [...geometry.nodes].filter((n) => toTime(n.date) <= t).pop();
    return {
      x: round(geometry.x(t)),
      label: event.displayDate ?? event.date,
      value: known?.value ?? null,
    };
  }, [cursorEventId, timeline, geometry]);

  const claim = claims.find((c) => c.id === series.claimId);
  const peak = geometry.nodes[geometry.peakIndex];
  const last = geometry.nodes[geometry.nodes.length - 1];
  const fellBack = last.value < peak.value;

  const line = geometry.nodes.map((n) => `${n.x},${n.y}`).join(" ");
  const areaUpTo = geometry.nodes.slice(0, geometry.peakIndex + 1);
  const areaAfter = geometry.nodes.slice(geometry.peakIndex);

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${series.name} 시계열. ${geometry.nodes[0].label ?? geometry.nodes[0].value}에서 시작해 최고 ${peak.value.toLocaleString("ko-KR")}${series.unit}까지 오른 뒤 ${last.value.toLocaleString("ko-KR")}${series.unit}로 내려왔습니다.`}
      >
        <defs>
          <linearGradient id="rise" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ice-400)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--ice-400)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--warm-400)" stopOpacity={0.24} />
            <stop offset="100%" stopColor="var(--warm-400)" stopOpacity={0} />
          </linearGradient>
        </defs>

        {geometry.ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PAD.left}
              y1={tick.y}
              x2={VIEW.width - PAD.right}
              y2={tick.y}
              stroke="var(--line)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              className="tabular fill-[var(--text-muted)] text-[11px]"
            >
              {tick.value.toLocaleString("ko-KR")}
            </text>
          </g>
        ))}

        {/* 오른 구간과 내린 구간을 색으로 나눈다. 같은 색이면 하락이 눈에 안 띈다. */}
        <polygon
          points={`${areaUpTo.map((n) => `${n.x},${n.y}`).join(" ")} ${areaUpTo[areaUpTo.length - 1].x},${geometry.baseline} ${areaUpTo[0].x},${geometry.baseline}`}
          fill="url(#rise)"
        />
        {fellBack && (
          <polygon
            points={`${areaAfter.map((n) => `${n.x},${n.y}`).join(" ")} ${areaAfter[areaAfter.length - 1].x},${geometry.baseline} ${areaAfter[0].x},${geometry.baseline}`}
            fill="url(#fall)"
          />
        )}

        <polyline
          points={line}
          fill="none"
          stroke="var(--ice-400)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {fellBack && (
          <polyline
            points={areaAfter.map((n) => `${n.x},${n.y}`).join(" ")}
            fill="none"
            stroke="var(--warm-400)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {geometry.nodes.map((node) =>
          node.milestone ? (
            <g key={node.date}>
              <circle
                cx={node.x}
                cy={node.y}
                r={4}
                fill={toTime(node.date) > toTime(peak.date) ? "var(--warm-400)" : "var(--ice-400)"}
                stroke="var(--ink-800)"
                strokeWidth={1.5}
              />
              {node.showLabel && (
                <text
                  x={node.x}
                  y={node.labelBelow ? node.y + 18 : node.y - 12}
                  textAnchor={node.anchor}
                  className="fill-[var(--text-secondary)] text-[10.5px] font-medium"
                  style={{ paintOrder: "stroke", stroke: "var(--ink-800)", strokeWidth: 3 }}
                >
                  {node.label}
                </text>
              )}
            </g>
          ) : null,
        )}

        {cursor && (
          <g>
            <line
              x1={cursor.x}
              y1={PAD.top - 8}
              x2={cursor.x}
              y2={geometry.baseline}
              stroke="var(--text-primary)"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.55}
            />
            <text
              x={cursor.x}
              y={PAD.top - 14}
              textAnchor={
                cursor.x > VIEW.width - 80
                  ? "end"
                  : cursor.x < PAD.left + 40
                    ? "start"
                    : "middle"
              }
              className="fill-[var(--text-primary)] text-[11px] font-semibold"
            >
              {cursor.label}
            </text>
          </g>
        )}

        <text
          x={geometry.nodes[0].x}
          y={VIEW.height - 12}
          className="tabular fill-[var(--text-muted)] text-[11px]"
        >
          {geometry.nodes[0].date}
        </text>
        <text
          x={last.x}
          y={VIEW.height - 12}
          textAnchor="end"
          className="tabular fill-[var(--text-muted)] text-[11px]"
        >
          {last.date}
        </text>
      </svg>

      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        <Cell label="고점" value={`${peak.value.toLocaleString("ko-KR")} ${series.unit}`} tone="ice" />
        <Cell label="최근" value={`${last.value.toLocaleString("ko-KR")} ${series.unit}`} tone={fellBack ? "warm" : "ice"} />
        {cursor && (
          <Cell
            label={`${cursor.label} 시점`}
            value={cursor.value ? `${cursor.value.toLocaleString("ko-KR")} ${series.unit}` : "—"}
            tone="plain"
          />
        )}
      </div>

      {series.note && (
        <figcaption className="mt-5 border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-text-muted">
          {series.note}
        </figcaption>
      )}

      {claim && (
        <div className="mt-4">
          <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
        </div>
      )}
    </figure>
  );
}

function Cell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ice" | "warm" | "plain";
}) {
  const color =
    tone === "ice" ? "text-ice-400" : tone === "warm" ? "text-warm-400" : "text-text-primary";
  return (
    <div className="bg-ink-700 px-4 py-3">
      <div className="truncate text-[11px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`tabular mt-1 whitespace-nowrap text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}

/** YYYY / YYYY-MM / YYYY-MM-DD를 모두 받는다. */
function toTime(date: string): number {
  const [y, m = "01", d = "01"] = date.split("-");
  return Date.UTC(Number(y), Number(m) - 1, Number(d));
}

const round = (n: number) => Math.round(n * 10) / 10;
