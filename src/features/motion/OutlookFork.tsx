"use client";

import { useState } from "react";

import type { Claim, Outlook, OutlookScenario } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { useReveal } from "@/features/motion/useReveal";

/**
 * 전망 — 확인된 지점에서 두 갈래로 갈라지는 길.
 *
 * ★ 모양으로 먼저 말한다.
 *   확인된 것은 실선, 전망은 점선이다. 갈림점 왼쪽은 칠하고 오른쪽은 빗금을
 *   깐다. 글을 읽기 전에 "여기서부터는 아직 일어나지 않은 일"이 보여야 한다.
 *
 * ★ 한 번에 한 갈래.
 *   두 갈래를 똑같이 진하게 그리면 눈이 둘 사이를 오가며 아무것도 읽지
 *   못한다. 고른 갈래만 색을 입히고 다시 그려 보이며, 다른 갈래는 흐리게
 *   남겨 "다른 길도 있다"만 알린다.
 *
 * ★ 그림 안에는 시기와 번호만.
 *   휴대폰 폭에서 svg 글자는 반 크기로 줄어든다. 문장은 그림 아래 목록이
 *   맡고, 그림의 번호와 목록의 번호가 짝을 이룬다.
 */

const NOW = { x: 120, y: 140 };

/** 갈래 위 단계 점. 부정 갈래는 가운데 줄을 기준으로 뒤집는다. */
const UP = [
  { x: 262, y: 84 },
  { x: 422, y: 62 },
  { x: 598, y: 46 },
];
const flip = (p: { x: number; y: number }) => ({ x: p.x, y: NOW.y * 2 - p.y });

function branchPath(points: { x: number; y: number }[]) {
  const [a, b, c] = points;
  return (
    `M${NOW.x} ${NOW.y} C ${NOW.x + 60} ${NOW.y}, ${a.x - 60} ${a.y}, ${a.x} ${a.y} ` +
    `S ${b.x - 60} ${b.y}, ${b.x} ${b.y} S ${c.x - 60} ${c.y}, ${c.x} ${c.y}`
  );
}

const TONE = {
  positive: { stroke: "var(--navy)", text: "text-navy", tint: "bg-navy-tint", border: "border-navy" },
  negative: {
    stroke: "var(--burgundy)",
    text: "text-burgundy",
    tint: "bg-burgundy-tint",
    border: "border-burgundy",
  },
} as const;

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export function OutlookFork({ outlook, claims }: { outlook: Outlook; claims: Claim[] }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [selectedId, setSelectedId] = useState(outlook.scenarios[0].id);
  const selected = outlook.scenarios.find((s) => s.id === selectedId) ?? outlook.scenarios[0];

  const count = (claimId: string) => claims.find((c) => c.id === claimId)?.sourceIds.length ?? 0;

  return (
    <div ref={ref}>
      {/* 업적이 아니라는 안내. 그림보다 먼저 읽힌다. */}
      <aside className="rounded-card border border-dashed border-pending bg-pending-tint px-4 py-3.5">
        <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="rounded-full bg-pending px-2 py-0.5 text-eggshell">전망 · 업적 아님</span>
          <span className="text-pending">{formatDate(outlook.asOf)} 기준</span>
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-graphite">{outlook.notice}</p>
      </aside>

      {/* 갈래 고르기 */}
      <div role="radiogroup" aria-label="시나리오" className="mt-8 grid grid-cols-2 gap-2">
        {outlook.scenarios.map((scenario) => {
          const active = scenario.id === selected.id;
          const tone = TONE[scenario.tone];
          return (
            <button
              key={scenario.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedId(scenario.id)}
              className={`rounded-card border px-3.5 py-3 text-left transition-colors ${
                active ? `${tone.border} ${tone.tint}` : "border-stone hover:border-graphite"
              }`}
            >
              <span
                className={`flex items-center gap-1.5 text-[12px] font-bold ${
                  active ? tone.text : "text-smoke"
                }`}
              >
                <span aria-hidden="true">{scenario.tone === "positive" ? "↗" : "↘"}</span>
                {scenario.label}
              </span>
              <span
                className={`mt-1 block text-[13px] leading-snug ${
                  active ? "font-semibold text-ink" : "text-ash"
                }`}
              >
                {scenario.headline}
              </span>
            </button>
          );
        })}
      </div>

      <ForkGraphic outlook={outlook} selected={selected} shown={shown} />

      {/* 갈림점 — 확인된 것 */}
      <div className="mt-3 flex flex-wrap items-start gap-x-3 gap-y-2 border-l-2 border-ink pl-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-ink">{outlook.now.label} · 확인됨</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-graphite">{outlook.now.text}</p>
        </div>
        <EvidenceButton claimId={outlook.now.claimId} count={count(outlook.now.claimId)} />
      </div>

      {/* 고른 갈래의 내용. key가 바뀌면 카드가 처음부터 다시 떠오른다. */}
      <div key={selected.id} className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby={`factors-${selected.id}`}>
          <h3 id={`factors-${selected.id}`} className="text-[15px] font-bold text-ink">
            이렇게 되려면
          </h3>
          <p className="mt-1 text-[12px] text-ash">조건 하나하나에 출처가 있습니다.</p>
          <ul className="mt-4 space-y-2.5">
            {selected.factors.map((factor, i) => (
              <li
                key={factor.id}
                className="rounded-card border border-stone bg-eggshell px-3.5 py-3"
                style={{ animation: "outlook-rise 480ms var(--ease-out-expo) both", animationDelay: `${i * 70}ms` }}
              >
                <p className={`text-[12px] font-bold ${TONE[selected.tone].text}`}>{factor.label}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-graphite">{factor.text}</p>
                <div className="mt-2">
                  <EvidenceButton claimId={factor.claimId} count={count(factor.claimId)} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby={`stages-${selected.id}`}>
          <h3 id={`stages-${selected.id}`} className="text-[15px] font-bold text-ink">
            이렇게 흘러간다면
          </h3>
          <p className="mt-1 text-[12px] text-ash">그림의 번호와 같습니다. 점선 위의 예상입니다.</p>
          <ol className="mt-4 space-y-4">
            {selected.stages.map((stage, i) => (
              <li
                key={stage.id}
                className="flex gap-3"
                style={{
                  animation: "outlook-rise 480ms var(--ease-out-expo) both",
                  animationDelay: `${200 + i * 110}ms`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-dashed text-[11px] font-bold"
                  style={{ borderColor: TONE[selected.tone].stroke, color: TONE[selected.tone].stroke }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="tabular text-[12px] font-bold text-ink">{stage.when}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-graphite">{stage.text}</p>
                  <div className="mt-1.5">
                    <EvidenceButton claimId={stage.claimId} count={count(stage.claimId)} />
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div
            className={`mt-6 rounded-card border-2 border-dashed px-4 py-3.5 ${TONE[selected.tone].border} ${TONE[selected.tone].tint}`}
            style={{ animation: "outlook-rise 520ms var(--ease-out-expo) both", animationDelay: "560ms" }}
          >
            <p className={`text-[11px] font-bold ${TONE[selected.tone].text}`}>
              잼통의 정리 · 예측이며 보장되지 않습니다
            </p>
            <p className="mt-1.5 text-[14px] font-semibold leading-relaxed text-ink">
              {selected.outcome}
            </p>
            <div className="mt-2">
              <EvidenceButton claimId={selected.claimId} count={count(selected.claimId)} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ForkGraphic({
  outlook,
  selected,
  shown,
}: {
  outlook: Outlook;
  selected: OutlookScenario;
  shown: boolean;
}) {
  const branches = outlook.scenarios.map((scenario) => {
    const points = scenario.tone === "positive" ? UP : UP.map(flip);
    return { scenario, points, d: branchPath(points) };
  });
  /* 고른 갈래를 나중에 그려 위에 오게 한다. */
  const last = (id: string) => (id === selected.id ? 1 : 0);
  branches.sort((a, b) => last(a.scenario.id) - last(b.scenario.id));

  return (
    <figure className="m-0 mt-6">
      <svg
        viewBox="0 0 640 280"
        role="img"
        aria-label={`확인된 첫 왕복에서 ${outlook.scenarios.map((s) => s.label).join("와 ")}로 갈라지는 그림. 지금 ${selected.label}를 보고 있습니다.`}
        className="h-auto w-full"
      >
        <defs>
          <pattern id="outlook-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--stone)" strokeWidth="2" />
          </pattern>
          {branches.map(({ scenario, d }) => (
            <mask key={scenario.id} id={`outlook-mask-${scenario.id}`} maskUnits="userSpaceOnUse">
              <path
                /* 고를 때마다 다시 그려지도록 key에 선택을 싣는다. */
                key={`${scenario.id}-${selected.id === scenario.id ? "on" : "off"}`}
                d={d}
                fill="none"
                stroke="#fff"
                strokeWidth="14"
                pathLength={1}
                strokeDasharray="1"
                style={{
                  strokeDashoffset: shown ? 0 : 1,
                  animation:
                    shown && selected.id === scenario.id
                      ? "explainer-draw 1100ms var(--ease-out-expo) both"
                      : undefined,
                }}
              />
            </mask>
          ))}
        </defs>

        {/* 바탕: 왼쪽은 확인됨, 오른쪽은 전망 */}
        <rect x="0" y="0" width={NOW.x} height="280" fill="var(--taupe)" />
        <rect x={NOW.x} y="0" width={640 - NOW.x} height="280" fill="url(#outlook-hatch)" opacity="0.55" />
        <line x1={NOW.x} y1="0" x2={NOW.x} y2="280" stroke="var(--ash)" strokeDasharray="3 4" />
        <text x={NOW.x / 2} y="26" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--ink)">
          확인됨
        </text>
        <text x={NOW.x + 16} y="26" fontSize="15" fontWeight="700" fill="var(--pending)">
          전망 · 점선
        </text>

        {/* 확인된 길 — 실선 */}
        <path
          d={`M24 ${NOW.y} L${NOW.x} ${NOW.y}`}
          stroke="var(--ink)"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{
            strokeDashoffset: shown ? 0 : 1,
            transition: "stroke-dashoffset 600ms var(--ease-out-expo)",
          }}
        />
        <circle cx="24" cy={NOW.y} r="5" fill="var(--ink)" />
        <text x="24" y={NOW.y + 30} fontSize="13" fill="var(--smoke)">
          2026.8
        </text>

        {/* 두 갈래 — 점선 */}
        {branches.map(({ scenario, points, d }) => {
          const active = scenario.id === selected.id;
          const color = active ? TONE[scenario.tone].stroke : "var(--ash)";
          const below = scenario.tone === "negative";
          return (
            <g key={scenario.id} opacity={active ? 1 : 0.4} style={{ transition: "opacity 300ms" }}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={active ? 4 : 2.5}
                strokeLinecap="round"
                strokeDasharray="2 9"
                mask={`url(#outlook-mask-${scenario.id})`}
              />
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    key={`${scenario.id}-${active ? "on" : "off"}-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="9"
                    fill="var(--eggshell)"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeDasharray={active ? "3 3" : undefined}
                    style={{
                      opacity: shown ? 1 : 0,
                      animation:
                        shown && active
                          ? `outlook-pop 420ms var(--ease-out-expo) ${500 + i * 220}ms both`
                          : undefined,
                    }}
                  />
                  <text
                    x={p.x}
                    y={p.y + 4.5}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill={color}
                    style={{ opacity: shown ? 1 : 0 }}
                  >
                    {i + 1}
                  </text>
                  {active && (
                    <text
                      x={p.x}
                      y={below ? p.y + 32 : p.y - 18}
                      textAnchor={i === points.length - 1 ? "end" : "middle"}
                      fontSize="14"
                      fontWeight="600"
                      fill="var(--graphite)"
                      style={{
                        animation: shown
                          ? `outlook-rise 400ms var(--ease-out-expo) ${600 + i * 220}ms both`
                          : undefined,
                        opacity: shown ? undefined : 0,
                      }}
                    >
                      {scenario.stages[i]?.when}
                    </text>
                  )}
                </g>
              ))}
            </g>
          );
        })}

        {/* 갈림점 */}
        <circle cx={NOW.x} cy={NOW.y} r="10" fill="var(--ink)" />
        <circle cx={NOW.x} cy={NOW.y} r="4" fill="var(--eggshell)" />
        <text x={NOW.x} y={NOW.y + 32} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ink)">
          지금
        </text>
      </svg>
    </figure>
  );
}
