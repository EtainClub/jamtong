"use client";

import { useMemo } from "react";
import type { Claim, MoneyFlow as Flow } from "@/content/schema";
import { useVisualState } from "@/lib/visual-state/store";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 자금 흐름 씬 (설계서 5장 "경제 → 돈의 흐름").
 *
 * 움직임이 설명하는 것은 **몫**이다. 시나리오를 바꾸면 띠의 굵기가 변하고,
 * 민간개발 경로에서는 공공으로 흐르는 띠가 0으로 사라진다. 그 사라짐이 논지다.
 * 숫자를 나열하는 대신 폭으로 보여주는 이유도 같다 — 5,503억과 0의 차이는
 * 글자로 읽을 때보다 띠가 없어질 때 더 정확히 전달된다.
 *
 * 축척은 시나리오 사이에 고정된다. 각 시나리오를 제 폭에 맞춰 늘리면
 * 비교가 무의미해진다.
 */

const VIEW = { width: 760, height: 340 } as const;
const SOURCE_X = 10;
const SOURCE_W = 18;
const TARGET_X = 330;
const TARGET_W = 26;
const GAP = 14;
const TOP = 38; // 출처 라벨이 들어갈 자리

interface Props {
  flow: Flow;
  claims: Claim[];
}

export function MoneyFlow({ flow, claims }: Props) {
  const activeScenarioId = useVisualState((s) => s.activeScenarioId);
  const setScenario = useVisualState((s) => s.setScenario);

  const actual = flow.scenarios.find((s) => s.isActual) ?? flow.scenarios[0];
  const scenario =
    flow.scenarios.find((s) => s.id === activeScenarioId) ?? actual;

  // 모든 시나리오에 공통으로 쓰는 축척. 이게 고정돼야 비교가 성립한다.
  const maxTotal = Math.max(
    ...flow.scenarios.map((s) => s.allocations.reduce((sum, a) => sum + a.amountEok, 0)),
    1,
  );

  const geometry = useMemo(() => {
    const rows = scenario.allocations;
    const total = rows.reduce((sum, a) => sum + a.amountEok, 0);
    const usableHeight = VIEW.height - GAP * (rows.length - 1) - TOP - 12;

    // 출처 기둥은 세로 중앙에 둔다. 몫이 작은 시나리오일수록 가운데로 모인다.
    const bands: {
      allocation: (typeof rows)[number];
      height: number;
      sourceY: number;
      targetY: number;
    }[] = [];

    let sourceCursor = TOP;
    let targetCursor = TOP;

    for (const allocation of rows) {
      const height = (allocation.amountEok / maxTotal) * usableHeight;
      bands.push({ allocation, height, sourceY: sourceCursor, targetY: targetCursor });
      sourceCursor += height;
      targetCursor += Math.max(height, 2) + GAP;
    }

    return { bands, total, usableHeight };
  }, [scenario, maxTotal]);

  const scenarioClaim = claims.find((c) => c.id === scenario.claimId);

  return (
    <figure className="m-0">
      {/* 시나리오 전환 — 실제 구조와 가정을 명확히 구분해 표시한다 */}
      <div
        role="radiogroup"
        aria-label="자금 흐름 시나리오"
        className="flex flex-col gap-1 rounded-xl border border-line bg-ink-700 p-1.5 sm:flex-row"
      >
        {flow.scenarios.map((option) => {
          const isActive = option.id === scenario.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setScenario(option.id)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-left transition-colors ${
                isActive
                  ? "bg-ink-500/70 text-text-primary"
                  : "text-text-muted hover:bg-white/5 hover:text-text-secondary"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                {option.name}
                {!option.isActual && (
                  <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
                    가정
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-text-secondary" aria-live="polite">
        {scenario.summary}
      </p>

      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="mt-6 w-full h-auto"
        role="img"
        aria-label={`${scenario.name}. ${flow.sourceLabel}에서 ${geometry.total.toLocaleString("ko-KR")}${flow.unitLabel}이 공공으로 환수된다.`}
      >
        <defs>
          <linearGradient id="flow-public" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ice-600)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--ice-400)" stopOpacity={0.75} />
          </linearGradient>
        </defs>

        {/* 출처 기둥 */}
        <rect
          x={SOURCE_X}
          y={TOP}
          width={SOURCE_W}
          height={geometry.usableHeight}
          rx={3}
          fill="var(--ink-500)"
        />
        <text
          x={SOURCE_X}
          y={18}
          className="fill-[var(--text-secondary)] text-[14px] font-medium"
        >
          {flow.sourceLabel}
        </text>
        <text
          x={SOURCE_X}
          y={32}
          className="fill-[var(--text-muted)] text-[11.5px]"
        >
          전체 규모는 이 자료의 범위 밖
        </text>

        {geometry.bands.map(({ allocation, height, sourceY, targetY }) => {
          const isEmpty = allocation.amountEok === 0;
          const h = Math.max(height, isEmpty ? 0 : 1);
          const midX = (SOURCE_X + SOURCE_W + TARGET_X) / 2;

          const d = [
            `M${SOURCE_X + SOURCE_W},${sourceY}`,
            `C${midX},${sourceY} ${midX},${targetY} ${TARGET_X},${targetY}`,
            `L${TARGET_X},${targetY + h}`,
            `C${midX},${targetY + h} ${midX},${sourceY + h} ${SOURCE_X + SOURCE_W},${sourceY + h}`,
            "Z",
          ].join(" ");

          return (
            <g key={allocation.id}>
              {isEmpty ? (
                // 0인 몫은 점선으로 자리만 남긴다. 아예 지우면 "없다"가 보이지 않는다.
                <line
                  x1={SOURCE_X + SOURCE_W}
                  y1={TOP + geometry.usableHeight / 2}
                  x2={TARGET_X + TARGET_W}
                  y2={TOP + geometry.usableHeight / 2}
                  stroke="var(--ink-500)"
                  strokeWidth={1.5}
                  strokeDasharray="6 6"
                />
              ) : (
                <>
                  <path
                    d={d}
                    fill="url(#flow-public)"
                    style={{ transition: "d 420ms var(--ease-out-expo)" }}
                  />
                  <rect
                    x={TARGET_X}
                    y={targetY}
                    width={TARGET_W}
                    height={h}
                    rx={3}
                    fill="var(--ice-400)"
                  />
                </>
              )}

              <text
                x={TARGET_X + TARGET_W + 16}
                y={(isEmpty ? TOP + geometry.usableHeight / 2 : targetY + h / 2) + 5}
                className={
                  isEmpty
                    ? "fill-[var(--text-muted)] text-[14px] font-medium"
                    : "fill-[var(--text-primary)] text-[14px] font-semibold"
                }
              >
                {allocation.label}
              </text>
              <text
                x={TARGET_X + TARGET_W + 16}
                y={(isEmpty ? TOP + geometry.usableHeight / 2 : targetY + h / 2) + 24}
                className="tabular fill-[var(--text-muted)] text-[13px]"
              >
                {allocation.amountEok.toLocaleString("ko-KR")}
                {flow.unitLabel}
                {allocation.detail ? ` · ${allocation.detail}` : ""}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-ink-700 px-5 py-4">
        <span className="text-sm text-text-secondary">
          {scenario.isActual ? "공공 환수 합계" : "이 경로에서 공공 환수"}
        </span>
        <span className="tabular text-2xl font-bold text-text-primary">
          {geometry.total.toLocaleString("ko-KR")}
          <span className="ml-1 text-base font-semibold text-ice-400">{flow.unitLabel}</span>
        </span>
      </div>

      {flow.note && (
        <figcaption className="mt-5 border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-text-muted">
          {flow.note}
        </figcaption>
      )}

      {scenarioClaim && (
        <div className="mt-5">
          <EvidenceButton
            claimId={scenarioClaim.id}
            count={scenarioClaim.sourceIds.length}
          />
        </div>
      )}
    </figure>
  );
}
