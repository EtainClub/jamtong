"use client";

import { useMemo, useState } from "react";
import type { Claim, IndexSeries, Instrument, TimelineEvent } from "@/content/schema";
import { useVisualState } from "@/lib/visual-state/store";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 지수 시계열 + 제도 축.
 *
 * 이 업적의 논지는 "지수는 되밀렸지만 제도는 남는다"다. 지수만 그리면 그 논지가
 * 화면에 없다. 그래서 같은 시간축 위에 두 줄기를 놓는다 — 올랐다 내리는 선과,
 * 내려오지 않는 계단.
 *
 * 움직임이 설명이다. 눈금을 끌면 두 줄기가 함께 드러나고, 어느 지점에서
 * 지수는 꺾이는데 계단은 그대로인 것이 눈에 보인다. 문장으로 "제도는 남습니다"라고
 * 쓰는 것보다 정확히 같은 말을 더 정확히 전한다.
 *
 * ★ 사이 값은 주장하지 않는다.
 *   읽어 주는 지수는 늘 "그 시점까지 문서로 확인된 마지막 종가"이고, 화면이 그
 *   날짜를 함께 적는다. 선은 점과 점을 잇지만 그 사이의 값은 자료가 아니다.
 *
 * ★ 시행과 발표를 한 칸에 세지 않는다.
 *   계단은 법률로 시행된 것만 오른다. 발표된 방안은 축 위에 빈 점으로 남는다.
 *   되돌릴 수 있는 것을 되돌릴 수 없는 것처럼 보이게 하지 않는다.
 *
 * 고점 이후 구간을 반드시 함께 그린다. 오른 데까지만 그리고 멈추면
 * 그건 자료가 아니라 선전물이고, 이 제품의 전제가 무너진다.
 */

const VIEW = { width: 720, height: 366 } as const;
const PAD = { top: 26, right: 18, bottom: 100, left: 52 } as const;
/** 제도 축이 앉는 띠. 지수 밑동에서 이만큼 내려온다. */
const LANE = { offset: 30, height: 44 } as const;

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
  /**
   * 눈금의 위치(0..1). null이면 아직 사용자가 잡지 않은 것이고, 그때는 연표
   * 커서를 따르고 커서도 없으면 끝까지 다 보인다. 효과로 맞추지 않는다 —
   * 렌더 중에 파생하면 두 상태가 어긋날 자리가 없다.
   */
  const [scrub, setScrub] = useState<number | null>(null);

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
    const baseline = round(PAD.top + plotH);

    /*
     * 제도 축.
     *
     * 계단은 시행된 것만 오른다. 발표된 방안은 축 위에 빈 점으로 남는다.
     * 계단의 높이는 시행 건수이므로, 시행이 하나도 없으면 띠는 그려지지 않는다.
     */
    const laneTop = baseline + LANE.offset;
    const laneBase = laneTop + LANE.height;
    const enactedTotal = series.instruments.filter((i) => i.status === "enacted").length;

    // 누계를 map 안에서 올리면 컴파일러가 렌더 중 재할당으로 본다. 평범한 반복으로 쌓는다.
    const marks: (Instrument & { x: number; count: number; y: number })[] = [];
    for (const inst of series.instruments) {
      const count = marks.filter((m) => m.status === "enacted").length +
        (inst.status === "enacted" ? 1 : 0);
      marks.push({
        ...inst,
        x: round(x(toTime(inst.date))),
        /** 이 제도가 놓인 뒤의 시행 누계. 계단의 높이가 된다. */
        count,
        y: round(laneBase - (count / Math.max(enactedTotal, 1)) * LANE.height),
      });
    }

    // 계단은 처음 시행 전까지 밑동에 붙어 있다가 시행 때마다 한 칸 오른다.
    const stairs: string[] = [`${round(x(minT))},${laneBase}`];
    for (const mark of marks) {
      if (mark.status !== "enacted") continue;
      stairs.push(`${mark.x},${stairs.length === 1 ? laneBase : Number(stairs[stairs.length - 1].split(",")[1])}`);
      stairs.push(`${mark.x},${mark.y}`);
    }
    stairs.push(`${round(x(maxT))},${marks.length ? marks[marks.length - 1].y : laneBase}`);

    return {
      nodes,
      peakIndex,
      plotH,
      baseline,
      laneTop,
      laneBase,
      marks,
      stairs: stairs.join(" "),
      enactedTotal,
      minT,
      maxT,
      ticks: [0, 0.5, 1].map((r) => ({ value: Math.round(maxV * r), y: round(y(maxV * r)) })),
      x,
    };
  }, [series.points, series.instruments]);

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

  /**
   * 지금 어디까지 드러낼 것인가.
   *
   * 사용자가 눈금을 잡았으면 그 위치, 아니면 연표 커서, 그것도 없으면 끝까지.
   * 세 가지가 같은 시간 좌표를 쓴다.
   */
  const revealT =
    scrub !== null
      ? geometry.minT + (geometry.maxT - geometry.minT) * scrub
      : (cursorEventId && timeline.find((e) => e.id === cursorEventId)
          ? toTime(timeline.find((e) => e.id === cursorEventId)!.date)
          : geometry.maxT);
  const revealX = round(geometry.x(revealT));

  // 읽어 주는 값은 늘 '그 시점까지 문서로 확인된 마지막 것'이다. 사이 값은 자료가 아니다.
  const knownPoint = [...geometry.nodes].filter((n) => toTime(n.date) <= revealT).pop();
  const knownMarks = geometry.marks.filter((m) => toTime(m.date) <= revealT);
  const enactedSoFar = knownMarks.filter((m) => m.status === "enacted").length;
  const lastMark = knownMarks[knownMarks.length - 1];
  const markClaim = lastMark ? claims.find((c) => c.id === lastMark.claimId) : undefined;

  /** 단계. 문서로 남은 순간들만 세운다. 누르면 눈금이 그 자리로 간다. */
  const steps = [
    ...geometry.nodes
      .filter((n) => n.milestone && n.label)
      .map((n) => ({ id: `p-${n.date}`, at: toTime(n.date), label: n.label! })),
    ...geometry.marks.map((m) => ({ id: m.id, at: toTime(m.date), label: m.label })),
  ].sort((a, b) => a.at - b.at);

  const toScrub = (t: number) =>
    (t - geometry.minT) / Math.max(geometry.maxT - geometry.minT, 1);

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
        aria-label={`${series.name} 시계열과 제도 축. ${series.name}는 최고 ${peak.value.toLocaleString("ko-KR")}${series.unit}까지 오른 뒤 ${last.value.toLocaleString("ko-KR")}${series.unit}로 내려왔고, 같은 기간에 법률로 시행된 제도는 ${geometry.enactedTotal}건으로 줄지 않았습니다.`}
      >
        <defs>
          {/*
           * 드러내기. 값이 아니라 보이는 범위를 움직인다 — 값을 애니메이션하면
           * 중간 프레임이 자료처럼 보인다.
           */}
          <clipPath id="series-reveal">
            <rect x={0} y={0} width={revealX} height={VIEW.height} />
          </clipPath>
          <linearGradient id="rise" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--navy)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--navy)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--burgundy)" stopOpacity={0.24} />
            <stop offset="100%" stopColor="var(--burgundy)" stopOpacity={0} />
          </linearGradient>
        </defs>

        {geometry.ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PAD.left}
              y1={tick.y}
              x2={VIEW.width - PAD.right}
              y2={tick.y}
              stroke="var(--stone)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              className="tabular fill-[var(--ash)] font-mono text-[11px]"
            >
              {tick.value.toLocaleString("ko-KR")}
            </text>
          </g>
        ))}

        {/* 오른 구간과 내린 구간을 색으로 나눈다. 같은 색이면 하락이 눈에 안 띈다. */}
        <g clipPath="url(#series-reveal)">
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
          stroke="var(--navy)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {fellBack && (
          <polyline
            points={areaAfter.map((n) => `${n.x},${n.y}`).join(" ")}
            fill="none"
            stroke="var(--burgundy)"
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
                fill={toTime(node.date) > toTime(peak.date) ? "var(--burgundy)" : "var(--navy)"}
                stroke="var(--canvas)"
                strokeWidth={1.5}
              />
              {node.showLabel && (
                <text
                  x={node.x}
                  y={node.labelBelow ? node.y + 18 : node.y - 12}
                  textAnchor={node.anchor}
                  className="fill-[var(--smoke)] text-[10.5px] font-medium"
                  style={{ paintOrder: "stroke", stroke: "var(--canvas)", strokeWidth: 3 }}
                >
                  {node.label}
                </text>
              )}
            </g>
          ) : null,
        )}


          {/* 제도 계단. 내려오지 않는다 — 이 그림의 논지가 그것이다. */}
          {geometry.enactedTotal > 0 && (
            <polyline
              points={geometry.stairs}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={2}
              strokeLinejoin="round"
              opacity={0.75}
            />
          )}
        </g>

        {/* 제도 축의 밑줄. 계단이 어디서부터 오르는지 기준이 된다. */}
        <line
          x1={PAD.left}
          y1={geometry.laneBase}
          x2={VIEW.width - PAD.right}
          y2={geometry.laneBase}
          stroke="var(--stone)"
          strokeWidth={1}
        />
        {geometry.marks.map((mark) => {
          const on = toTime(mark.date) <= revealT;
          const enacted = mark.status === "enacted";
          return (
            <g key={mark.id} opacity={on ? 1 : 0.28}>
              <line
                x1={mark.x}
                y1={geometry.baseline}
                x2={mark.x}
                y2={enacted ? mark.y : geometry.laneBase}
                stroke="var(--stone)"
                strokeWidth={1}
                strokeDasharray="2 3"
              />
              <circle
                cx={mark.x}
                cy={enacted ? mark.y : geometry.laneBase}
                r={enacted ? 4.5 : 3.5}
                fill={enacted ? "var(--ink)" : "var(--canvas)"}
                stroke={enacted ? "var(--canvas)" : "var(--ash)"}
                strokeWidth={1.5}
              />
            </g>
          );
        })}
        {cursor && (
          <g>
            <line
              x1={cursor.x}
              y1={PAD.top - 8}
              x2={cursor.x}
              y2={geometry.baseline}
              stroke="var(--ink)"
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
              className="fill-[var(--ink)] text-[11px] font-semibold"
            >
              {cursor.label}
            </text>
          </g>
        )}

        <text
          x={geometry.nodes[0].x}
          y={VIEW.height - 12}
          className="tabular fill-[var(--ash)] font-mono text-[11px]"
        >
          {geometry.nodes[0].date}
        </text>
        <text
          x={last.x}
          y={VIEW.height - 12}
          textAnchor="end"
          className="tabular fill-[var(--ash)] font-mono text-[11px]"
        >
          {last.date}
        </text>
      </svg>

      {series.instruments.length > 0 && (
        <>
          {/*
           * 두 줄기의 이름은 그림 밖에 둔다. 그림 안에 쓰면 선과 부딪히고,
           * 밖에 두면 그 말이 진짜 글자가 되어 이미지 없이도 읽힌다.
           */}
          <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-smoke">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-navy" />
              {series.name} · 올랐다 내린다
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-ink" />
              시행된 제도 · 내려오지 않는다
            </li>
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full border border-ash bg-canvas"
              />
              발표된 방안
            </li>
          </ul>
        </>
      )}

      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-3">
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

      {series.instruments.length > 0 && (
        <>
          {/*
           * 눈금. 준비된 순간을 눌러도 되고 직접 끌어도 된다. 끌어 보는 쪽이
           * 핵심이다 — 어느 지점에서 선은 꺾이는데 계단은 그대로인지가 손에 잡힌다.
           */}
          <div className="mt-5">
            <label htmlFor="series-scrub" className="text-[12px] font-medium text-smoke">
              시점을 끌어 보세요
            </label>
            <input
              id="series-scrub"
              type="range"
              min={0}
              max={1}
              step={0.002}
              value={scrub ?? toScrub(revealT)}
              onChange={(e) => setScrub(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--navy)]"
            />
          </div>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {steps.map((step) => {
              const on = step.at <= revealT;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => setScrub(toScrub(step.at))}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      on
                        ? "border-navy/25 bg-navy-tint text-navy"
                        : "border-stone text-ash hover:border-graphite hover:text-smoke"
                    }`}
                  >
                    {step.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-stone bg-stone">
            <Cell
              label={knownPoint ? `${knownPoint.date} 종가` : "이 시점 지수"}
              value={
                knownPoint ? `${knownPoint.value.toLocaleString("ko-KR")} ${series.unit}` : "—"
              }
              tone={knownPoint && knownPoint.value < peak.value ? "warm" : "ice"}
            />
            <Cell
              label="시행된 제도"
              value={`${enactedSoFar} / ${geometry.enactedTotal}`}
              tone="plain"
            />
          </div>

          {lastMark && (
            <div className="mt-3 rounded-card border border-stone bg-taupe px-4 py-3">
              <p className="text-[11px] font-semibold text-navy">
                {lastMark.displayDate}
                {lastMark.status === "enacted" ? " · 시행" : " · 발표"}
              </p>
              <p className="mt-1 text-[14px] font-semibold text-ink">{lastMark.label}</p>
              {lastMark.detail && (
                <p className="mt-0.5 text-[12px] text-ash">{lastMark.detail}</p>
              )}
              {markClaim && (
                <div className="mt-2.5">
                  <EvidenceButton claimId={markClaim.id} count={markClaim.sourceIds.length} />
                </div>
              )}
            </div>
          )}

          {/* 계단이 무엇을 세고 무엇을 세지 않는지. 세지 않는 것을 적어 두지 않으면 부풀려 읽힌다. */}
          <p className="mt-3 border-l-2 border-stone pl-4 text-[12px] leading-relaxed text-ash">
            계단은 법률로 시행된 것만 오릅니다. 발표된 방안은 축 위에 빈 점으로
            남습니다 — 되돌릴 수 있는 것과 없는 것을 한 칸에 세지 않습니다.
            읽어 주는 지수는 그 시점까지 확인된 마지막 종가이고, 그 사이 값은 자료에 없습니다.
          </p>
        </>
      )}

      {series.note && (
        <figcaption className="mt-5 border-l-2 border-ash pl-4 text-[13px] leading-relaxed text-ash">
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
    tone === "ice" ? "text-navy" : tone === "warm" ? "text-burgundy" : "text-ink";
  return (
    <div className="bg-taupe px-4 py-3">
      <div className="truncate text-[11px] uppercase tracking-wider text-ash">{label}</div>
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
