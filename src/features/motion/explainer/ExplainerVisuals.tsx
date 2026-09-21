"use client";

import { useState } from "react";

import type { ExplainerVisual as Visual } from "@/content/schema";

/**
 * 해설 씬의 그림들.
 *
 * ★ 이 파일에는 업적의 고유명사가 한 글자도 없다.
 *   "중동"도 "휘발유"도 여기 없고, 전부 콘텐츠에서 온다. 그림이 제 낱말을
 *   갖기 시작하면 그 낱말은 아무도 대조하지 않은 말이 되고, 다음 업적에
 *   이 그림을 쓸 때 남의 이야기가 묻어 온다.
 *
 * ★ 종류마다 다른 그림이다.
 *   점 N개와 점선 하나로 다섯 장을 다 그리면 그건 목차다. 다섯 장의 논지가
 *   서로 다른 모양이라서 다섯 개를 그렸다.
 *
 * ★ 그림은 step의 함수다.
 *   단계를 넘기면 같은 그림이 변형된다. 통이 자리를 옮기고, 끊긴 자리가
 *   이어지고, 천장이 내려앉는다. 다른 그림으로 갈아 끼우지 않는다.
 *
 * ★ svg는 aria-hidden이다.
 *   뜻은 전부 껍데기의 글이 나른다. 그림을 끄고 읽어도 말이 되어야 한다.
 *   그래서 여기서 그리는 것은 보조이고, 이름표도 자리가 겹칠 것 같으면
 *   svg 밖 칩으로 내보낸다.
 */

const LABEL = { fontFamily: "inherit", fontWeight: 800 } as const;
const SUB = { fontFamily: "inherit", fontWeight: 600 } as const;

/** 단계에 따라 켜지고 꺼지는 층. 규칙을 한 곳에 둔다 — 층마다 따로 쓰면 하나를 빠뜨린다. */
function Layer({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <g
      style={{
        opacity: on ? 1 : 0,
        visibility: on ? "visible" : "hidden",
        transition: "opacity 400ms var(--ease-out-expo)",
      }}
    >
      {children}
    </g>
  );
}

/** 그림 밖 칩. 겹칠 수 있는 이름표는 전부 여기로 나온다. */
function Chip({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "navy" | "burgundy" | "pending";
  children: React.ReactNode;
}) {
  const skin = {
    neutral: "border-stone text-smoke",
    navy: "border-navy/30 bg-navy-tint text-navy",
    burgundy: "border-burgundy/30 bg-burgundy-tint text-burgundy",
    pending: "border-pending/40 bg-pending-tint text-pending",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${skin}`}>
      {children}
    </span>
  );
}

const svgClass = "w-full rounded-card border border-stone bg-taupe/50";

/* ══════════════════════════════════════════════════════════════
 * 1. 옮겨 앉는 몫
 *
 * 통 마흔 개가 두 자리 사이를 오간다. 단계는 자료에 있는 시점에 멈추고,
 * 손잡이는 그 사이 어디든 갈 수 있다 — 대신 자료를 벗어난 통은 검증 전
 * 색으로 점선이 된다. 움직일 수 있다는 것과 주장할 수 있다는 것은 다르다.
 * ══════════════════════════════════════════════════════════════ */

const COLS = 5;
const CELL_X = 26;
const CELL_Y = 25;
const SEAT_LEFT = 44;
const SEAT_RIGHT = 300;
const SEAT_TOP = 40;

function seat(index: number, side: "from" | "to") {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return {
    x: (side === "from" ? SEAT_LEFT : SEAT_RIGHT) + col * CELL_X,
    y: SEAT_TOP + row * CELL_Y,
  };
}

function OriginShift({ v, step }: { v: Extract<Visual, { kind: "origin-shift" }>; step: number }) {
  const stops = [...v.points.map((p) => p.share), v.target.share];
  const atStep = stops[Math.min(step, stops.length - 1)];
  /*
   * 손으로 옮긴 값은 그 단계 안에서만 산다.
   *
   * 단계가 넘어가면 손잡이도 그 시점으로 돌아가야 하는데, 그것을 effect에서
   * 되돌리면 단계마다 렌더가 한 번 더 돈다. 옮긴 값에 어느 단계의 것인지를
   * 함께 적어 두면 단계가 바뀌는 순간 그 값은 저절로 남의 것이 된다.
   */
  const [moved, setMoved] = useState<{ step: number; share: number } | null>(null);
  const share = moved?.step === step ? moved.share : atStep;
  const setShare = (next: number) => setMoved({ step, share: next });

  const lowest = Math.min(...v.points.map((p) => p.share));
  /*
   * viewBox를 그림에 붙인다.
   *
   * 한 자리에 마흔 개가 다 들어갈 일은 없다 — 왼쪽은 최대치에서, 오른쪽은
   * 목표에서 가장 길어진다. 그 둘 중 긴 쪽으로 높이를 정하지 않으면 통
   * 아래로 빈 무대가 남고, 그림이 우표만 해진다.
   */
  const rows = Math.ceil(
    Math.max(
      Math.round((v.marks * v.points[0].share) / 100),
      v.marks - Math.round((v.marks * v.target.share) / 100),
    ) / COLS,
  );
  const height = SEAT_TOP + (rows - 1) * CELL_Y + 32;
  const held = Math.round((v.marks * share) / 100);
  /* 자료가 확인한 가장 낮은 값까지가 근거의 끝이다. 그보다 더 옮긴 통은 점선으로 남는다. */
  const confirmed = Math.round((v.marks * lowest) / 100);
  const exact = v.points.find((p) => Math.abs(p.share - share) < 0.05);
  const onTarget = Math.abs(share - v.target.share) < 0.05;

  return (
    <div>
      <svg viewBox={`0 0 480 ${height}`} className={svgClass} aria-hidden="true" focusable="false">
        <text x={104} y={22} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">
          {v.from.label}
        </text>
        <text x={368} y={22} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">
          {v.to.label}
        </text>

        <line
          x1={240}
          y1={32}
          x2={240}
          y2={height - 12}
          stroke="var(--stone)"
          strokeWidth={1.5}
          strokeDasharray="4 6"
        />

        {Array.from({ length: v.marks }, (_, i) => {
          const inFrom = i < held;
          const pos = inFrom ? seat(i, "from") : seat(i - held, "to");
          const beyond = !inFrom && i < confirmed;
          const tone = inFrom ? "var(--burgundy)" : beyond ? "var(--pending)" : "var(--navy)";
          return (
            <g
              key={i}
              transform={`translate(${pos.x} ${pos.y})`}
              style={{ transition: "transform 620ms var(--ease-out-expo)" }}
            >
              <rect
                width={16}
                height={20}
                rx={4}
                fill={beyond ? "var(--pending-tint)" : tone}
                stroke={beyond ? tone : "none"}
                strokeWidth={beyond ? 1.6 : 0}
                strokeDasharray={beyond ? "3 2.5" : undefined}
                opacity={0.92}
                style={{ transition: "fill 620ms linear" }}
              />
              <rect y={6} width={16} height={1.4} fill="var(--eggshell)" opacity={beyond ? 0 : 0.45} />
              <rect y={12} width={16} height={1.4} fill="var(--eggshell)" opacity={beyond ? 0 : 0.45} />
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="tabular text-[34px] font-light leading-none tracking-tight text-navy">
          {share.toFixed(1)}
        </span>
        <span className="text-sm text-smoke">{v.unit}</span>
        {exact ? (
          <Chip tone="navy">{exact.displayDate} · 자료로 확인된 값</Chip>
        ) : onTarget ? (
          <Chip tone="pending">{v.target.label} · 아직 확인되지 않았습니다</Chip>
        ) : (
          <Chip tone="pending">자료에 없는 값입니다</Chip>
        )}
      </div>

      <label className="mt-4 block">
        <span className="text-[12px] font-semibold text-smoke">
          손잡이를 직접 옮겨 보세요 — 통 하나가 {(100 / v.marks).toFixed(1)}
          {v.unit}입니다
        </span>
        <input
          type="range"
          min={v.target.share}
          max={v.points[0].share}
          step={0.1}
          value={share}
          onChange={(e) => setShare(Number(e.target.value))}
          aria-label={`${v.from.label} 비중`}
          aria-valuetext={`${share.toFixed(1)}${v.unit}`}
          className="mt-2 w-full accent-[var(--navy)]"
        />
      </label>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {v.points.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setShare(p.share)}
            className="rounded-full border border-stone px-2.5 py-1 text-[11px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-navy"
          >
            {p.displayDate} {p.share}
            {v.unit}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShare(v.target.share)}
          className="rounded-full border border-dashed border-pending px-2.5 py-1 text-[11px] font-semibold text-pending transition-colors hover:bg-pending-tint"
        >
          {v.target.label} {v.target.share}
          {v.unit}
        </button>
      </div>

      {v.unconfirmed && share < lowest && (
        <p className="mt-3 rounded-card border border-dashed border-pending bg-pending-tint/60 px-3 py-2 text-[12px] leading-relaxed text-graphite">
          <strong className="font-bold text-pending">{v.unconfirmed.label}</strong> ·{" "}
          {v.unconfirmed.claim} — {v.unconfirmed.assertedBy}의 주장입니다. 이 위키가 대조한
          정부 통계는 {lowest}
          {v.unit}까지입니다.
        </p>
      )}
      {(v.from.note || v.to.note) && (
        <p className="mt-3 text-[12px] leading-relaxed text-ash">
          {[v.from.note, v.to.note].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 2. 끊긴 길
 *
 * 먼 길에 붙는 값이 문턱이 되어 길이 끊겨 있다. 그 문턱을 메우면 물량이
 * 흐른다 — 흐른 만큼이 아래 막대다. 지원을 껐다 켰다 해 볼 수 있다.
 * ══════════════════════════════════════════════════════════════ */

const BAR_X0 = 132;
const BAR_W = 316;

function FreightGap({ v, step }: { v: Extract<Visual, { kind: "freight-gap" }>; step: number }) {
  /* 손으로 끈 스위치도 그 단계 안에서만 산다. 첫 장의 손잡이와 같은 방식이다. */
  const [flipped, setFlipped] = useState<{ step: number; on: boolean } | null>(null);
  const support = flipped?.step === step ? flipped.on : step >= 3;
  const setSupport = (on: boolean) => setFlipped({ step, on });

  const bridged = step >= 2 && support;
  const grown = step >= 3 && support;
  const peak = Math.max(...v.routes.map((r) => 100 + r.growthPercent));
  const width = (total: number) => (total / peak) * BAR_W;

  return (
    <div>
      <svg viewBox="0 0 480 268" className={svgClass} aria-hidden="true" focusable="false">
        <text x={48} y={26} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">
          {v.origin}
        </text>
        <text x={432} y={26} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">
          {v.destination}
        </text>
        <circle cx={48} cy={58} r={11} fill="var(--graphite)" opacity={0.8} />
        <circle cx={432} cy={58} r={11} fill="var(--navy)" />

        {/* 0단계 — 이어진 먼 길 */}
        <Layer on={step === 0}>
          <path
            d="M60 58 Q240 14 420 58"
            fill="none"
            stroke="var(--ash)"
            strokeWidth={3}
            strokeDasharray="9 8"
            strokeLinecap="round"
          />
        </Layer>

        {/* 1단계부터 — 가운데가 끊긴다 */}
        <Layer on={step >= 1}>
          <path d="M60 58 Q150 26 206 40" fill="none" stroke="var(--ash)" strokeWidth={3} strokeLinecap="round" />
          <path d="M274 40 Q330 26 420 58" fill="none" stroke="var(--ash)" strokeWidth={3} strokeLinecap="round" />
          <path
            d="M206 30 V50 M274 30 V50"
            stroke="var(--burgundy)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <text x={240} y={74} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">
            {v.gapLabel}
          </text>
        </Layer>

        {/* 2단계 — 문턱을 메운다 */}
        <Layer on={bridged}>
          <rect x={206} y={33} width={68} height={14} rx={7} fill="var(--navy)" />
          <path
            d="M228 40 h20 M243 35 l6 5 -6 5"
            fill="none"
            stroke="var(--eggshell)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Layer>

        {/* 3단계 — 흐른 물량 */}
        <Layer on={step >= 2}>
          <line x1={BAR_X0} y1={104} x2={BAR_X0} y2={250} stroke="var(--stone)" strokeWidth={2} />
          <text x={BAR_X0 - 6} y={102} textAnchor="end" fontSize={11} {...SUB} fill="var(--ash)">
            {v.baselineLabel}
          </text>
          {v.routes.map((r, i) => {
            const y = 118 + i * 32;
            const total = grown ? 100 + r.growthPercent : 100;
            const w = width(total);
            const inside = w > 74;
            return (
              <g key={r.id}>
                <text x={BAR_X0 - 8} y={y + 13} textAnchor="end" fontSize={12} {...SUB} fill="var(--graphite)">
                  {r.label}
                </text>
                <rect
                  x={BAR_X0}
                  y={y}
                  width={w}
                  height={18}
                  rx={4}
                  fill={grown ? "var(--navy)" : "var(--stone)"}
                  style={{ transition: "width 700ms var(--ease-out-expo), fill 400ms linear" }}
                />
                <text
                  x={BAR_X0 + w + (inside ? -8 : 8)}
                  y={y + 13}
                  textAnchor={inside ? "end" : "start"}
                  fontSize={11.5}
                  {...LABEL}
                  fill={inside ? "var(--eggshell)" : "var(--ash)"}
                  style={{ transition: "x 700ms var(--ease-out-expo)" }}
                >
                  {grown ? `+${r.growthPercent}%` : "100"}
                </text>
              </g>
            );
          })}
        </Layer>
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={support}
          onClick={() => setSupport(!support)}
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-colors ${
            support
              ? "border-navy bg-navy text-eggshell"
              : "border-stone bg-taupe text-smoke hover:border-graphite"
          }`}
        >
          <span aria-hidden="true">{support ? "●" : "○"}</span>
          {support ? v.onLabel : v.offLabel}
        </button>
        <Chip>{v.periodLabel}</Chip>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 3. 돌려받는 고리
 *
 * 먼저 내주고 같은 양을 돌려받는다. 한 바퀴가 한 기간이고, "한 바퀴 더"를
 * 누르면 자료에 있는 다음 기간으로 넘어간다. 없는 기간은 돌지 않는다.
 * ══════════════════════════════════════════════════════════════ */

const RING = { cx: 240, cy: 142, rx: 152, ry: 86 };

function ringPoint(t: number) {
  return { x: RING.cx + RING.rx * Math.cos(t), y: RING.cy + RING.ry * Math.sin(t) };
}

/** 타원에서는 접선이 angle+90이 아니다. 미분해서 구하지 않으면 화살표가 부채처럼 벌어진다. */
function ringTangentDeg(t: number) {
  return (Math.atan2(RING.ry * Math.cos(t), -RING.rx * Math.sin(t)) * 180) / Math.PI;
}

function ReserveLoop({ v, step }: { v: Extract<Visual, { kind: "reserve-loop" }>; step: number }) {
  const [lap, setLap] = useState(0);

  /*
   * 한 바퀴 돌 때마다 고리를 다시 긋는다.
   *
   * key가 바뀌면 path가 새로 마운트되고 CSS 애니메이션이 처음부터 다시 돈다.
   * 상태를 두 번 밀어 다시 트리거하는 것보다 짧고 렌더가 한 번 덜 돈다.
   * 움직임을 원하지 않는 사람에게는 globals.css가 이 애니메이션을 끈다.
   */

  const n = v.nodes.length;
  const current = v.counter.laps[Math.min(lap, v.counter.laps.length - 1)];
  const ring =
    `M ${RING.cx} ${RING.cy - RING.ry} ` +
    `A ${RING.rx} ${RING.ry} 0 1 1 ${RING.cx} ${RING.cy + RING.ry} ` +
    `A ${RING.rx} ${RING.ry} 0 1 1 ${RING.cx} ${RING.cy - RING.ry}`;

  return (
    <div>
      <svg viewBox="0 0 480 284" className={svgClass} aria-hidden="true" focusable="false">
        <path d={ring} fill="none" stroke="var(--stone)" strokeWidth={2.5} />
        <path
          key={lap}
          d={ring}
          fill="none"
          stroke="var(--navy)"
          strokeWidth={2.5}
          pathLength={1}
          strokeDasharray={1}
          style={{ animation: "explainer-draw 1500ms linear both" }}
        />

        {v.nodes.map((node, i) => {
          const t = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          const p = ringPoint(t);
          const lit = i <= step;
          const mid = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / n;
          const a = ringPoint(mid);
          return (
            <g key={node.id}>
              <g
                transform={`translate(${a.x} ${a.y}) rotate(${ringTangentDeg(mid)})`}
                style={{ transition: "opacity 400ms linear" }}
                /* 마지막 단계에서는 고리가 닫힌다. 한 칸이 흐리면 순환으로 읽히지 않는다. */
                opacity={i < step || step >= n - 1 ? 1 : 0.3}
              >
                <path d="M-7 -6 L7 0 L-7 6 Z" fill="var(--navy)" />
              </g>
              <rect
                x={p.x - 64}
                y={p.y - 21}
                width={128}
                height={42}
                rx={10}
                fill={lit ? "var(--navy)" : "var(--eggshell)"}
                stroke={lit ? "var(--navy)" : "var(--stone)"}
                strokeWidth={1.5}
                style={{ transition: "fill 400ms linear, stroke 400ms linear" }}
              />
              <text
                x={p.x}
                y={node.detail ? p.y - 1 : p.y + 4}
                textAnchor="middle"
                fontSize={11.5}
                {...LABEL}
                fill={lit ? "var(--eggshell)" : "var(--graphite)"}
              >
                {node.label}
              </text>
              {node.detail && (
                <text
                  x={p.x}
                  y={p.y + 13}
                  textAnchor="middle"
                  fontSize={10}
                  {...SUB}
                  fill={lit ? "var(--eggshell)" : "var(--ash)"}
                  opacity={0.85}
                >
                  {node.detail}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setLap((l) => (l + 1) % v.counter.laps.length)}
          className="inline-flex items-center gap-2 rounded-full border border-stone bg-taupe px-3.5 py-2 text-[12px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-navy"
        >
          <span aria-hidden="true">↻</span> 한 바퀴 더
        </button>
        <Chip tone="navy">
          {v.counter.label} · {current.label} {current.value}
        </Chip>
        <span className="tabular text-[11px] text-ash">
          {lap + 1} / {v.counter.laps.length}
        </span>
      </div>
      {v.note && <p className="mt-3 text-[12px] leading-relaxed text-ash">{v.note}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 4. 천장이 걸린 자리
 *
 * 사슬의 어느 마디에 상한이 걸렸는지가 이 장의 전부다. 걸리지 않은 마디를
 * 함께 그리지 않으면 "기름값에 상한을 씌웠다"로 읽힌다.
 * ══════════════════════════════════════════════════════════════ */

const LINK_W = 110;
const LINK_GAP = 65;

function linkX(i: number) {
  return 14 + i * (LINK_W + LINK_GAP);
}

function PriceCap({ v, step }: { v: Extract<Visual, { kind: "price-cap" }>; step: number }) {
  const arrows = v.links.length - 1;

  return (
    <div>
      <svg viewBox="0 0 480 214" className={svgClass} aria-hidden="true" focusable="false">
        {v.links.map((link, i) => (
          <g key={link.id}>
            <rect
              x={linkX(i)}
              y={96}
              width={LINK_W}
              height={44}
              rx={10}
              fill={i === 0 ? "var(--navy)" : "var(--eggshell)"}
              stroke={i === 0 ? "var(--navy)" : "var(--stone)"}
              strokeWidth={1.5}
            />
            <text
              x={linkX(i) + LINK_W / 2}
              y={123}
              textAnchor="middle"
              fontSize={12}
              {...LABEL}
              fill={i === 0 ? "var(--eggshell)" : "var(--graphite)"}
            >
              {link.label}
            </text>
          </g>
        ))}

        {Array.from({ length: arrows }, (_, i) => {
          const x0 = linkX(i) + LINK_W;
          const capped = i === v.capAt;
          const shown = capped ? step >= 1 : step >= 2;
          return (
            <g key={`arrow-${i}`}>
              <path
                d={`M${x0 + 6} 118 h${LINK_GAP - 24}`}
                stroke={capped && step >= 1 ? "var(--burgundy)" : "var(--ash)"}
                strokeWidth={2.5}
                strokeLinecap="round"
                style={{ transition: "stroke 400ms linear" }}
              />
              <path
                d={`M${x0 + LINK_GAP - 24} 112 l7 6 -7 6`}
                fill="none"
                stroke={capped && step >= 1 ? "var(--burgundy)" : "var(--ash)"}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "stroke 400ms linear" }}
              />
              <Layer on={shown}>
                {capped ? (
                  <g
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animation: step >= 3 ? "explainer-bob 2.4s ease-in-out infinite" : undefined,
                    }}
                  >
                    <rect x={x0 - 4} y={64} width={LINK_GAP + 8} height={10} rx={3} fill="var(--burgundy)" />
                    <path
                      d={`M${x0 + LINK_GAP / 2} 76 v26`}
                      stroke="var(--burgundy)"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  </g>
                ) : (
                  <rect
                    x={x0 - 4}
                    y={64}
                    width={LINK_GAP + 8}
                    height={10}
                    rx={3}
                    fill="none"
                    stroke="var(--ash)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                )}
                <text
                  x={x0 + LINK_GAP / 2}
                  y={54}
                  textAnchor="middle"
                  fontSize={11.5}
                  {...LABEL}
                  fill={capped ? "var(--burgundy)" : "var(--ash)"}
                >
                  {capped ? v.capLabel : v.uncappedLabel}
                </text>
              </Layer>
            </g>
          );
        })}

        <Layer on={step >= 3}>
          <text x={240} y={186} textAnchor="middle" fontSize={11.5} {...SUB} fill="var(--ash)">
            {v.cadence}
          </text>
        </Layer>
      </svg>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {v.caps.map((cap) => (
          <Chip key={cap.id} tone={step >= 1 ? "burgundy" : "neutral"}>
            {cap.label} {cap.value}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 5. 갈라진 방향
 *
 * 두 수치가 같은 기간에 반대로 움직였다. 사이 값은 자료에 없으므로 점선으로
 * 잇기만 하고, 왜 갈라졌는지는 이 그림이 말하지 않는다.
 * ══════════════════════════════════════════════════════════════ */

const LANE_X = [130, 350];
const LANE_TOP = 74;
const LANE_BOTTOM = 198;

function Divergence({ v, step }: { v: Extract<Visual, { kind: "divergence" }>; step: number }) {
  return (
    <div>
      <svg viewBox="0 0 480 250" className={svgClass} aria-hidden="true" focusable="false">
        {v.lanes.map((lane, li) => {
          const cx = LANE_X[li];
          const values = lane.marks.map((m) => m.value);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const y = (value: number) =>
            LANE_BOTTOM - ((value - min) / (max - min || 1)) * (LANE_BOTTOM - LANE_TOP);
          const rising = lane.direction === "up";
          const tone = rising ? "var(--burgundy)" : "var(--navy)";
          /* 첫 줄은 1단계부터, 둘째 줄은 2단계부터. 한 번에 다 띄우면 갈라진 것이 안 보인다. */
          const on = step >= (li === 0 ? 2 : 0);
          const both = step >= (li === 0 ? 2 : 1);

          return (
            <Layer key={lane.id} on={on}>
              <text x={cx} y={30} textAnchor="middle" fontSize={12.5} {...LABEL} fill="var(--graphite)">
                {lane.label}
              </text>
              <line
                x1={cx}
                y1={LANE_TOP - 8}
                x2={cx}
                y2={LANE_BOTTOM + 14}
                stroke="var(--stone)"
                strokeWidth={1.5}
              />

              <Layer on={both}>
                <path
                  d={`M${cx - 38} ${y(lane.marks[0].value)} L${cx + 38} ${y(lane.marks[1].value)}`}
                  stroke={tone}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  opacity={0.75}
                />
              </Layer>

              {lane.marks.map((mark, mi) => {
                const mx = cx + (mi === 0 ? -38 : 38);
                const my = y(mark.value);
                const atTop = mark.value === max;
                return (
                  <Layer key={mark.id} on={mi === 0 ? true : both}>
                    <circle cx={mx} cy={my} r={6} fill={tone} />
                    <text
                      x={mx}
                      y={atTop ? my - 14 : my + 22}
                      textAnchor="middle"
                      fontSize={12}
                      {...LABEL}
                      fill={tone}
                    >
                      {mark.display}
                    </text>
                  </Layer>
                );
              })}

              {/*
                * 방향 화살표를 줄마다 따로 달지 않는다. 기운 점선이 이미 방향이고,
                * 마지막 단계의 가운데 화살표 둘이 "갈라졌다"를 말한다. 넷을 다 두면
                * 화살표가 그림의 주인공이 된다.
                */}
            </Layer>
          );
        })}

        <Layer on={step >= 3}>
          <path
            d="M228 150 L212 116 M212 116 l9 1 M212 116 l1 9"
            fill="none"
            stroke="var(--burgundy)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M252 150 L268 184 M268 184 l-9 -1 M268 184 l-1 -9"
            fill="none"
            stroke="var(--navy)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Layer>
      </svg>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {v.lanes.map((lane) => (
          <div key={lane.id} className="rounded-card border border-stone px-3 py-2.5">
            <p className="text-[12px] font-bold text-ink">{lane.label}</p>
            <p
              className={`mt-0.5 text-[12px] font-semibold ${
                lane.direction === "up" ? "text-burgundy" : "text-navy"
              }`}
            >
              {lane.moveLabel}
            </p>
            <ul className="mt-1.5 space-y-0.5">
              {lane.marks.map((mark) => (
                <li key={mark.id} className="text-[11.5px] leading-relaxed text-smoke">
                  <span className="text-ash">{mark.displayDate}</span> · {mark.display}
                  {mark.note && <span className="block text-[11px] text-ash">{mark.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-ash">{v.gapLabel}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 6. 갈라지는 몸
 *
 * 한 기관이 두 일을 쥐고 있고, 그 둘이 각각 새 기관으로 떠난다. 떠나고 난
 * 자리에 원래 기관이 어떻게 되는지를 적는다 — 갈라지는 것만 그리고 없어지는
 * 것을 안 그리면 "하나가 둘이 됐다"로 읽힌다.
 * ══════════════════════════════════════════════════════════════ */

const BODY = { x: 150, y: 24, w: 180, h: 88 };
/** 떠나기 전 두 일이 앉아 있는 자리. 몸 안이다. */
const POWER_HOME = [
  { x: 200, y: 86 },
  { x: 280, y: 86 },
];
/** 떠난 뒤 두 일이 앉는 자리. 새 기관 바로 위다. */
const POWER_AWAY = [
  { x: 108, y: 150 },
  { x: 372, y: 150 },
];
const BRANCH = [
  { x: 108, w: 176 },
  { x: 372, w: 140 },
];

function SplitPowers({ v, step }: { v: Extract<Visual, { kind: "split-powers" }>; step: number }) {
  const apart = step >= 2;
  const ended = step >= 3;

  return (
    <div>
      <svg viewBox="0 0 480 252" className={svgClass} aria-hidden="true" focusable="false">
        {/* 갈라지기 전의 몸 */}
        <rect
          x={BODY.x}
          y={BODY.y}
          width={BODY.w}
          height={BODY.h}
          rx={14}
          fill="var(--eggshell)"
          stroke={ended ? "var(--burgundy)" : "var(--graphite)"}
          strokeWidth={2}
          strokeDasharray={ended ? "6 5" : undefined}
          style={{ transition: "stroke 400ms linear" }}
        />
        <text
          x={240}
          y={50}
          textAnchor="middle"
          fontSize={14}
          {...LABEL}
          fill={ended ? "var(--burgundy)" : "var(--ink)"}
        >
          {v.origin.label}
        </text>
        <Layer on={ended}>
          <path
            d={`M${BODY.x + 14} ${BODY.y + BODY.h - 14} L${BODY.x + BODY.w - 14} ${BODY.y + 14}`}
            stroke="var(--burgundy)"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.5}
          />
          <text x={240} y={96} textAnchor="middle" fontSize={12.5} {...LABEL} fill="var(--burgundy)">
            {v.origin.endLabel}
          </text>
        </Layer>

        {/* 한 기관 안에서 이어져 있다 */}
        <Layer on={step === 1}>
          <path
            d="M330 54 C 394 34, 394 96, 336 84"
            fill="none"
            stroke="var(--burgundy)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <path
            d="M344 78 L334 85 L344 92"
            fill="none"
            stroke="var(--burgundy)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x={405} y={124} textAnchor="middle" fontSize={11.5} {...SUB} fill="var(--burgundy)">
            {v.loopLabel}
          </text>
        </Layer>

        {/* 갈라진 뒤의 두 기관 */}
        {v.branches.map((branch, i) => {
          const at = BRANCH[i];
          return (
            <Layer key={branch.id} on={apart}>
              <path
                d={`M${POWER_HOME[i].x} ${BODY.y + BODY.h} C ${POWER_HOME[i].x} 128, ${at.x} 120, ${at.x} 134`}
                fill="none"
                stroke="var(--navy)"
                strokeWidth={2}
              />
              <path
                d={`M${at.x - 5} 128 L${at.x} 136 L${at.x + 5} 128`}
                fill="none"
                stroke="var(--navy)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x={at.x - at.w / 2}
                y={172}
                width={at.w}
                height={branch.note ? 52 : 44}
                rx={10}
                fill="var(--navy)"
              />
              <text
                x={at.x}
                y={branch.note ? 194 : 199}
                textAnchor="middle"
                fontSize={12.5}
                {...LABEL}
                fill="var(--eggshell)"
              >
                {branch.label}
              </text>
              {branch.note && (
                <text
                  x={at.x}
                  y={211}
                  textAnchor="middle"
                  fontSize={10.5}
                  {...SUB}
                  fill="var(--eggshell)"
                  opacity={0.8}
                >
                  {branch.note}
                </text>
              )}
            </Layer>
          );
        })}

        {/* 두 일. 몸 안에서 새 기관 위로 옮겨 앉는다. */}
        {v.branches.map((branch, i) => {
          const home = POWER_HOME[i];
          const away = POWER_AWAY[i];
          const at = apart ? away : home;
          return (
            <g
              key={`${branch.id}-power`}
              transform={`translate(${at.x} ${at.y})`}
              style={{ transition: "transform 700ms var(--ease-out-expo)" }}
            >
              <rect x={-40} y={-15} width={80} height={30} rx={15} fill="var(--burgundy)" />
              <text y={5} textAnchor="middle" fontSize={12.5} {...LABEL} fill="var(--eggshell)">
                {branch.power}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip tone={apart ? "navy" : "neutral"}>{v.whenLabel}</Chip>
        {ended && <Chip tone="burgundy">{v.origin.endLabel}</Chip>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 7. 권한이 어디로 가나
 *
 * 카드가 가운데 쌓여 있다가 두 기관으로 흩어진다. 마지막에 누가 무엇을
 * 잃고 무엇을 남기는지를 잇는다 — 가져가는 쪽만 그리면 절반만 그린 것이다.
 * ══════════════════════════════════════════════════════════════ */

const CARD = { w: 132, h: 32 };
const LEDGER_MID = { x: 240, top: 60, gap: 44 };
const LEDGER_SIDE = [
  { x: 82, boxX: 14 },
  { x: 398, boxX: 330 },
];
const LEDGER_SLOT_TOP = 112;
const LEDGER_SLOT_GAP = 40;

function PowersLedger({ v, step }: { v: Extract<Visual, { kind: "powers-ledger" }>; step: number }) {
  /* 1단계에서는 잃는 권한 하나만, 2단계부터는 전부 제자리로 간다. */
  const placed = (powerId: string) =>
    step >= 2 || (step === 1 && powerId === v.lostPowerId);

  /* 아직 안 옮긴 카드는 가운데에서 위로 당겨 앉는다 — 빈자리를 남기지 않는다. */
  const waiting = v.powers.filter((p) => !placed(p.id));
  const seatOf = (powerId: string, holderId: string) => {
    if (!placed(powerId)) {
      const k = waiting.findIndex((p) => p.id === powerId);
      return { x: LEDGER_MID.x, y: LEDGER_MID.top + k * LEDGER_MID.gap };
    }
    const side = v.holders.findIndex((h) => h.id === holderId);
    const k = v.powers.filter((p) => p.holderId === holderId).findIndex((p) => p.id === powerId);
    return { x: LEDGER_SIDE[side].x, y: LEDGER_SLOT_TOP + k * LEDGER_SLOT_GAP };
  };

  const lost = v.powers.find((p) => p.id === v.lostPowerId);
  const lostSeat = lost ? seatOf(lost.id, lost.holderId) : null;

  /*
   * 남는 쪽은 한 덩어리로 묶는다.
   *
   * 카드 하나에만 선을 대면 그 하나만 맡는 것처럼 읽힌다. 남는 권한이 셋이면
   * 셋을 감싸는 괄호를 그리고 거기에 선을 댄다.
   */
  const keptSide = lost ? v.holders.findIndex((h) => h.id !== lost.holderId) : -1;
  const keptCards = keptSide < 0 ? [] : v.powers.filter((p) => p.holderId === v.holders[keptSide].id);
  const keptEdge =
    keptSide < 0
      ? 0
      : LEDGER_SIDE[keptSide].x + (keptSide === 0 ? CARD.w / 2 + 8 : -(CARD.w / 2 + 8));
  const keptTop = LEDGER_SLOT_TOP - CARD.h / 2;
  const keptBottom = LEDGER_SLOT_TOP + (keptCards.length - 1) * LEDGER_SLOT_GAP + CARD.h / 2;
  const keptTick = keptSide === 0 ? -8 : 8;

  return (
    <div>
      <svg viewBox="0 0 480 268" className={svgClass} aria-hidden="true" focusable="false">
        <Layer on={step === 0}>
          <text x={240} y={30} textAnchor="middle" fontSize={12} {...SUB} fill="var(--ash)">
            {v.fromLabel}
          </text>
        </Layer>

        {/* 받아 가는 두 기관 */}
        {v.holders.map((holder, i) => (
          <Layer key={holder.id} on={step >= 1}>
            <rect
              x={LEDGER_SIDE[i].boxX}
              y={30}
              width={136}
              height={holder.note ? 54 : 42}
              rx={10}
              fill="var(--eggshell)"
              stroke="var(--navy)"
              strokeWidth={1.5}
            />
            <text
              x={LEDGER_SIDE[i].x}
              y={holder.note ? 52 : 57}
              textAnchor="middle"
              fontSize={12.5}
              {...LABEL}
              fill="var(--navy)"
            >
              {holder.label}
            </text>
            {holder.note && (
              <text
                x={LEDGER_SIDE[i].x}
                y={70}
                textAnchor="middle"
                fontSize={10.5}
                {...SUB}
                fill="var(--ash)"
              >
                {holder.note}
              </text>
            )}
          </Layer>
        ))}

        {/* 마지막에 잇는다 — 잃는 쪽과 남는 쪽 */}
        {lostSeat && (
          <Layer on={step >= 3}>
            <path
              d={`M240 216 L${lostSeat.x} ${lostSeat.y + CARD.h / 2}`}
              stroke="var(--burgundy)"
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <path
              d={`M${keptEdge + keptTick} ${keptTop} H${keptEdge} V${keptBottom} H${keptEdge + keptTick}`}
              fill="none"
              stroke="var(--navy)"
              strokeWidth={2}
            />
            <path
              d={`M${240 + (keptSide === 0 ? -45 : 45)} 230 L${keptEdge} ${keptBottom - 8}`}
              stroke="var(--navy)"
              strokeWidth={2}
            />
            <rect x={195} y={218} width={90} height={30} rx={15} fill="var(--ink)" />
            <text y={238} x={240} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--eggshell)">
              {v.actor}
            </text>
          </Layer>
        )}

        {/* 권한 카드 */}
        {v.powers.map((power) => {
          const at = seatOf(power.id, power.holderId);
          const isLost = power.id === v.lostPowerId && step >= 3;
          return (
            <g
              key={power.id}
              transform={`translate(${at.x} ${at.y})`}
              style={{ transition: "transform 650ms var(--ease-out-expo)" }}
            >
              <rect
                x={-CARD.w / 2}
                y={-CARD.h / 2}
                width={CARD.w}
                height={CARD.h}
                rx={8}
                fill={isLost ? "var(--burgundy-tint)" : "var(--navy)"}
                stroke={isLost ? "var(--burgundy)" : "none"}
                strokeWidth={isLost ? 2 : 0}
                strokeDasharray={isLost ? "5 4" : undefined}
                style={{ transition: "fill 400ms linear" }}
              />
              <text
                y={5}
                textAnchor="middle"
                fontSize={12.5}
                {...LABEL}
                fill={isLost ? "var(--burgundy)" : "var(--eggshell)"}
              >
                {power.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip tone={step >= 3 ? "burgundy" : "neutral"}>
          {v.actor} · {v.lostLabel}
        </Chip>
        <Chip tone={step >= 3 ? "navy" : "neutral"}>
          {v.actor} · {v.keptLabel}
        </Chip>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 8. 정해진 것과 아직 오지 않은 것
 *
 * 축 위에 기준일이 있고 그 뒤는 예정이다. 손잡이를 끌어 볼 수 있지만,
 * 기준일을 넘기면 화면이 "여기부터는 아직"이라고 적는다. 이 그림이 하는
 * 일은 시간을 그리는 것이 아니라 **어디까지가 확인된 것인지**를 그리는 것이다.
 * ══════════════════════════════════════════════════════════════ */

const AXIS = { y: 104, x0: 40, x1: 440 };

/** "2026-03"도 "2026-03-13"도 같은 축에 올린다. 달만 적힌 것은 그달 1일로 본다. */
function dayOf(iso: string) {
  return Date.parse(iso.length === 7 ? `${iso}-01` : iso);
}

function TimelineGate({ v, step }: { v: Extract<Visual, { kind: "timeline-gate" }>; step: number }) {
  const t0 = dayOf(v.start);
  const t1 = dayOf(v.end);
  const xOf = (iso: string) =>
    AXIS.x0 + ((dayOf(iso) - t0) / (t1 - t0)) * (AXIS.x1 - AXIS.x0);

  const atStep = v.marks[Math.min(step, v.marks.length - 1)];
  /* 손으로 끈 값은 그 단계 안에서만 산다. 다른 그림의 손잡이와 같은 방식이다. */
  const [dragged, setDragged] = useState<{ step: number; day: number } | null>(null);
  const day = dragged?.step === step ? dragged.day : dayOf(atStep.date);

  const asOf = v.marks.find((m) => m.status === "asof");
  const reached = v.marks.filter((m) => dayOf(m.date) <= day);
  const here = reached[reached.length - 1] ?? v.marks[0];
  const beyond = Boolean(asOf && day > dayOf(asOf.date));
  const handleX = AXIS.x0 + ((day - t0) / (t1 - t0)) * (AXIS.x1 - AXIS.x0);

  const toneOf = (status: "done" | "asof" | "planned") =>
    status === "planned" ? "var(--pending)" : status === "asof" ? "var(--ink)" : "var(--navy)";

  return (
    <div>
      <svg viewBox="0 0 480 176" className={svgClass} aria-hidden="true" focusable="false">
        {/* 처음과 끝 사이 */}
        <path
          d={`M${xOf(v.marks[0].date)} 52 v-8 H${xOf(v.marks[v.marks.length - 1].date)} v8`}
          fill="none"
          stroke="var(--ash)"
          strokeWidth={1.5}
        />
        <text
          x={(xOf(v.marks[0].date) + xOf(v.marks[v.marks.length - 1].date)) / 2}
          y={36}
          textAnchor="middle"
          fontSize={11.5}
          {...SUB}
          fill="var(--ash)"
        >
          {v.spanLabel}
        </text>

        <line
          x1={AXIS.x0}
          y1={AXIS.y}
          x2={AXIS.x1}
          y2={AXIS.y}
          stroke="var(--stone)"
          strokeWidth={2}
        />

        {/* 기준일 뒤 — 아직 오지 않은 구간 */}
        {asOf && (
          <>
            <line
              x1={xOf(asOf.date)}
              y1={AXIS.y}
              x2={AXIS.x1}
              y2={AXIS.y}
              stroke="var(--pending)"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <text x={AXIS.x1} y={146} textAnchor="end" fontSize={11} {...SUB} fill="var(--pending)">
              {v.futureLabel}
            </text>
          </>
        )}

        {v.marks.map((mark) => {
          const x = xOf(mark.date);
          const tone = toneOf(mark.status);
          return (
            <g key={mark.id}>
              <line x1={x} y1={AXIS.y - 12} x2={x} y2={AXIS.y + 12} stroke={tone} strokeWidth={1.5} />
              <circle
                cx={x}
                cy={AXIS.y}
                r={6}
                fill={mark.status === "done" ? tone : "var(--eggshell)"}
                stroke={tone}
                strokeWidth={2.5}
                strokeDasharray={mark.status === "planned" ? "3 2.5" : undefined}
              />
            </g>
          );
        })}

        {/* 손잡이 */}
        <g
          transform={`translate(${handleX} 0)`}
          style={{ transition: "transform 450ms var(--ease-out-expo)" }}
        >
          <line
            y1={70}
            y2={AXIS.y - 8}
            stroke={beyond ? "var(--pending)" : "var(--ink)"}
            strokeWidth={2}
          />
          <path
            d="M-7 62 L7 62 L0 72 Z"
            fill={beyond ? "var(--pending)" : "var(--ink)"}
            style={{ transition: "fill 300ms linear" }}
          />
        </g>
      </svg>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="text-[15px] font-bold text-ink">{here.displayDate}</span>
        {here.status === "planned" ? (
          <Chip tone="pending">아직 오지 않았습니다</Chip>
        ) : here.status === "asof" ? (
          <Chip>이 위키가 대조한 마지막 날</Chip>
        ) : (
          <Chip tone="navy">일어난 일</Chip>
        )}
      </div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-graphite">{here.label}</p>

      <label className="mt-4 block">
        <span className="text-[12px] font-semibold text-smoke">
          손잡이를 직접 끌어 보세요 — 기준일을 넘기면 그 뒤는 예정입니다
        </span>
        <input
          type="range"
          min={t0}
          max={t1}
          step={86400000}
          value={day}
          onChange={(e) => setDragged({ step, day: Number(e.target.value) })}
          aria-label="시점"
          aria-valuetext={here.displayDate}
          className="mt-2 w-full accent-[var(--navy)]"
        />
      </label>

      <ol className="mt-2 flex flex-wrap gap-1.5">
        {v.marks.map((mark) => (
          <li key={mark.id}>
            <button
              type="button"
              onClick={() => setDragged({ step, day: dayOf(mark.date) })}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                mark.status === "planned"
                  ? "border-dashed border-pending text-pending hover:bg-pending-tint"
                  : "border-stone text-smoke hover:border-graphite hover:text-navy"
              }`}
            >
              {/* 그림의 점과 같은 표식. 이름표를 축에 달 자리가 없어서 여기로 내보냈다. */}
              <span
                aria-hidden="true"
                className={`inline-block h-2 w-2 rounded-full ${
                  mark.status === "done"
                    ? "bg-navy"
                    : mark.status === "asof"
                      ? "border-2 border-ink"
                      : "border border-dashed border-pending"
                }`}
              />
              {mark.displayDate}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 9. 자리와 사람
 *
 * 눈금 하나가 몇 명인지를 밝히고, 정원만큼 눈금을 놓은 뒤 찬 만큼만 채운다.
 * 견줄 수가 있으면 같은 눈금 위에 한 줄 더 놓는다 — 다른 축에 그리면
 * 둘 중 어느 쪽이 큰지가 그림이 아니라 눈금의 문제가 된다.
 * ══════════════════════════════════════════════════════════════ */

const TRACK = { x0: 36, width: 400, height: 34 };

function Seats({ v, step }: { v: Extract<Visual, { kind: "seats" }>; step: number }) {
  const total = Math.ceil(v.capacity.value / v.per);
  const done = Math.round(v.filled.value / v.per);
  const pitch = TRACK.width / total;
  const tickW = Math.max(3, pitch - 2);

  const tick = (i: number, y: number, fill: string, dashed = false) => (
    <rect
      key={`${y}-${i}`}
      x={TRACK.x0 + i * pitch}
      y={y}
      width={tickW}
      height={TRACK.height}
      rx={1.5}
      fill={dashed ? "none" : fill}
      stroke={dashed ? fill : "none"}
      strokeWidth={dashed ? 1.2 : 0}
      strokeDasharray={dashed ? "3 2" : undefined}
      style={{ transition: "fill 500ms linear" }}
    />
  );

  return (
    <div>
      <svg viewBox="0 0 480 232" className={svgClass} aria-hidden="true" focusable="false">
        <text x={TRACK.x0} y={54} fontSize={12} {...LABEL} fill="var(--ink)">
          {v.capacity.label}
        </text>
        {Array.from({ length: total }, (_, i) => {
          const filled = step >= 1 && i < done;
          const gap = step >= 2 && i >= done;
          return tick(i, 66, filled ? "var(--navy)" : gap ? "var(--burgundy)" : "var(--stone)", gap);
        })}

        {/* 덜 찬 자리 */}
        <Layer on={step >= 2}>
          <path
            d={`M${TRACK.x0 + done * pitch} 112 v8 H${TRACK.x0 + TRACK.width} v-8`}
            fill="none"
            stroke="var(--burgundy)"
            strokeWidth={1.5}
          />
        </Layer>

        {/* 같은 눈금 위의 다른 수 */}
        {v.reference && (
          <Layer on={step >= 3}>
            <text x={TRACK.x0} y={158} fontSize={12} {...LABEL} fill="var(--graphite)">
              {v.reference.label}
            </text>
            {Array.from({ length: Math.round(v.reference.value / v.per) }, (_, i) =>
              tick(i, 170, "var(--graphite)"),
            )}
            <line
              x1={TRACK.x0 + Math.round(v.reference.value / v.per) * pitch}
              y1={60}
              x2={TRACK.x0 + Math.round(v.reference.value / v.per) * pitch}
              y2={210}
              stroke="var(--graphite)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          </Layer>
        )}
      </svg>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip>
          {v.capacity.label} {v.capacity.value.toLocaleString("ko-KR")}
          {v.unit}
        </Chip>
        <Chip tone={step >= 1 ? "navy" : "neutral"}>
          {v.filled.label} {v.filled.value.toLocaleString("ko-KR")}
          {v.unit}
        </Chip>
        <Chip tone={step >= 2 ? "burgundy" : "neutral"}>
          {v.gapLabel} {(v.capacity.value - v.filled.value).toLocaleString("ko-KR")}
          {v.unit}
        </Chip>
        {v.reference && step >= 3 && (
          <Chip>
            {v.reference.label} {v.reference.value.toLocaleString("ko-KR")}
            {v.unit}
          </Chip>
        )}
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-ash">
        눈금 하나가 {v.per.toLocaleString("ko-KR")}
        {v.unit}입니다.
        {v.reference?.note ? ` ${v.reference.note}` : ""}
      </p>
    </div>
  );
}

/** 종류 → 그림. 새 종류를 만들면 스키마에 한 갈래, 여기에 한 줄이다. */
export function ExplainerVisualView({ visual, step }: { visual: Visual; step: number }) {
  switch (visual.kind) {
    case "origin-shift":
      return <OriginShift v={visual} step={step} />;
    case "freight-gap":
      return <FreightGap v={visual} step={step} />;
    case "reserve-loop":
      return <ReserveLoop v={visual} step={step} />;
    case "price-cap":
      return <PriceCap v={visual} step={step} />;
    case "divergence":
      return <Divergence v={visual} step={step} />;
    case "split-powers":
      return <SplitPowers v={visual} step={step} />;
    case "powers-ledger":
      return <PowersLedger v={visual} step={step} />;
    case "timeline-gate":
      return <TimelineGate v={visual} step={step} />;
    case "seats":
      return <Seats v={visual} step={step} />;
  }
}
