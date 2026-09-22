"use client";

import { useState } from "react";

import type { GuideVisual } from "./storyboard";

/**
 * 둘러보기 해설의 그림들.
 *
 * ★ 이 파일에는 이 사이트의 고유명사가 한 글자도 없다.
 *   "업적"도 "카르텔"도 여기 없다. 전부 대본에서 온다. 업적 해설의
 *   `ExplainerVisuals`와 같은 규칙이다 — 그림이 제 낱말을 갖기 시작하면
 *   화면의 다른 자리와 말이 갈라진다.
 *
 * ★ 종류마다 다른 그림이다.
 *   세 장의 논지가 서로 다른 모양이라 세 개를 그렸다. 같은 그림에 이름표만
 *   바꿔 다는 것은 목차이지 해설이 아니다.
 *
 * ★ 그림은 step의 함수다.
 *   단계를 넘기면 같은 그림이 변형된다. 사슬이 아래로 자라고, 조각이 자리를
 *   옮기고, 칸이 하나씩 찬다. 다른 그림으로 갈아 끼우지 않는다.
 *
 * ★ svg는 aria-hidden이다.
 *   뜻은 껍데기의 글이 나른다. 그림을 끄고 읽어도 말이 되어야 한다.
 */

const LABEL = { fontFamily: "inherit", fontWeight: 800 } as const;
const SUB = { fontFamily: "inherit", fontWeight: 600 } as const;

const svgClass = "w-full rounded-card border border-stone bg-taupe/50";

/** 단계에 따라 켜지고 꺼지는 층. 규칙을 한 곳에 둔다 — 층마다 따로 쓰면 하나를 빠뜨린다. */
function Layer({
  on,
  children,
  delay = 0,
}: {
  on: boolean;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <g
      style={{
        opacity: on ? 1 : 0,
        visibility: on ? "visible" : "hidden",
        transition: `opacity 420ms var(--ease-out-expo) ${delay}ms`,
      }}
    >
      {children}
    </g>
  );
}

/**
 * 줄바꿈.
 *
 * svg text는 스스로 접히지 않는다. 글자 수로 자르는 것은 거칠지만, 여기 들어오는
 * 것은 한 문장이고 칸은 고정이라 이 정도면 충분하다. 넘치면 말줄임으로 끝낸다 —
 * 칸 밖으로 흘러나간 글자는 잘린 줄도 모른 채 사라진다.
 */
function wrap(text: string, perLine: number, lines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > perLine && line) {
      out.push(line);
      line = word;
      if (out.length === lines) break;
    } else {
      line = next;
    }
  }
  if (out.length < lines && line) out.push(line);

  const used = out.join(" ").length;
  if (used < text.replace(/\s+/g, " ").length) {
    out[out.length - 1] = `${out[out.length - 1].slice(0, perLine - 1)}…`;
  }
  return out;
}

/* ══════════════════════════════════════════════════════════════
 * 1. 사슬 — 숫자가 문장을 거쳐 자료에 닿는다
 *
 * 네 칸이 처음부터 다 서 있고, 단계마다 하나씩 채워지며 그 사이가 이어진다.
 * 빈 칸을 처음부터 보이는 이유: 사슬의 길이를 먼저 알아야 마지막 칸이
 * 끊기는 것이 사건으로 읽힌다. 빈 무대에서 하나씩 나타나면 그냥 목록이다.
 * ══════════════════════════════════════════════════════════════ */

const CHAIN_W = 460;

/**
 * 칸 사이를 잇는 선. 그려지는 동안 아래로 자란다.
 *
 * 끊긴 쪽(`dead`)은 점선으로 내려가다 ✕에서 멈춘다. 같은 모양의 선을 쓰되
 * 끝맺음만 다르게 두어야 "한쪽은 닿고 한쪽은 못 닿는다"가 한눈에 보인다.
 */
function Link({
  x,
  y1,
  y2,
  on,
  dead = false,
}: {
  x: number;
  y1: number;
  y2: number;
  on: boolean;
  dead?: boolean;
}) {
  const length = y2 - y1;
  return (
    <g>
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={dead ? "var(--ash)" : "var(--navy)"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={dead ? "3 4" : `${length} ${length}`}
        style={{
          strokeDashoffset: dead || on ? 0 : length,
          opacity: on ? 1 : 0,
          transition: "stroke-dashoffset 560ms var(--ease-out-expo), opacity 220ms",
        }}
      />
      <Layer on={on} delay={dead ? 260 : 420}>
        {dead ? (
          <g stroke="var(--ash)" strokeWidth={2} strokeLinecap="round">
            <line x1={x - 5.5} y1={y2 + 1} x2={x + 5.5} y2={y2 + 12} />
            <line x1={x + 5.5} y1={y2 + 1} x2={x - 5.5} y2={y2 + 12} />
          </g>
        ) : (
          <path
            d={`M${x - 6} ${y2 - 7} L${x} ${y2} L${x + 6} ${y2 - 7}`}
            fill="none"
            stroke="var(--navy)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </Layer>
    </g>
  );
}

function AnchorChain({ v, step }: { v: Extract<GuideVisual, { kind: "anchor" }>; step: number }) {
  const claimOn = step >= 1;
  const sourceOn = step >= 2;
  const orphanOn = step >= 3;

  const claimLines = wrap(v.claimText, 38, 2);
  const sourceLines = wrap(v.sourceTitle, 40, 2);
  const orphanLines = wrap(v.orphanText, 20, 2);
  const claimTone = v.verified ? "var(--navy)" : "var(--pending)";

  return (
    <svg viewBox={`0 0 ${CHAIN_W} 268`} className={svgClass} aria-hidden="true">
      {/* 숫자 */}
      <rect
        x={14}
        y={10}
        width={200}
        height={64}
        rx={14}
        fill="var(--eggshell)"
        stroke="var(--navy)"
        strokeWidth={1.4}
      />
      <text x={32} y={46} fontSize={27} {...LABEL} fill="var(--navy)">
        {v.number}
        {v.unit && (
          <tspan fontSize={13} dx={3} fill="var(--smoke)">
            {v.unit}
          </tspan>
        )}
      </text>
      <text x={32} y={63} fontSize={10.5} {...SUB} fill="var(--ash)">
        {wrap(v.numberLabel, 24, 1)[0]}
      </text>

      {/*
       * 닿지 못하는 쪽. 성공한 사슬 옆에 나란히 세운다 — 아래에 따로 두면
       * 그저 덧붙은 경고문이 되고, 옆에 두어야 같은 자리에서 한쪽만 내려간다는
       * 것이 보인다.
       */}
      <Layer on={orphanOn}>
        <rect
          x={246}
          y={10}
          width={200}
          height={64}
          rx={14}
          fill="none"
          stroke="var(--ash)"
          strokeWidth={1.4}
          strokeDasharray="5 5"
        />
        {orphanLines.map((line, i) => (
          <text key={i} x={264} y={38 + i * 15} fontSize={11} {...SUB} fill="var(--ash)">
            {line}
          </text>
        ))}
      </Layer>

      <Link x={112} y1={74} y2={104} on={claimOn} />
      <Link x={346} y1={74} y2={86} on={orphanOn} dead />

      {/* 근거 문장 */}
      <rect
        x={14}
        y={104}
        width={432}
        height={62}
        rx={12}
        fill={claimOn ? "var(--eggshell)" : "none"}
        stroke={claimOn ? claimTone : "var(--stone)"}
        strokeWidth={1.4}
        strokeDasharray={claimOn ? undefined : "5 5"}
        style={{ transition: "fill 380ms, stroke 380ms" }}
      />
      <Layer on={claimOn}>
        <rect x={28} y={116} width={46} height={16} rx={8} fill={claimTone} />
        <text x={51} y={127.5} textAnchor="middle" fontSize={10} {...LABEL} fill="var(--eggshell)">
          {v.verified ? "대조함" : "대조 전"}
        </text>
        {claimLines.map((line, i) => (
          <text key={i} x={28} y={150 + i * 14} fontSize={11.5} {...SUB} fill="var(--graphite)">
            {line}
          </text>
        ))}
      </Layer>

      <Link x={112} y1={166} y2={196} on={sourceOn} />

      {/* 원자료 */}
      <rect
        x={14}
        y={196}
        width={432}
        height={60}
        rx={12}
        fill={sourceOn ? "var(--navy-tint)" : "none"}
        stroke={sourceOn ? "var(--navy)" : "var(--stone)"}
        strokeWidth={1.4}
        strokeDasharray={sourceOn ? undefined : "5 5"}
        style={{ transition: "fill 380ms, stroke 380ms" }}
      />
      <Layer on={sourceOn}>
        <text x={28} y={218} fontSize={11} {...LABEL} fill="var(--navy)">
          {wrap(v.sourcePublisher, 24, 1)[0]}
        </text>
        {sourceLines.map((line, i) => (
          <text key={i} x={28} y={236 + i * 13} fontSize={10.5} {...SUB} fill="var(--graphite)">
            {line}
          </text>
        ))}
      </Layer>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 2. 다시 앉는 조각들 — 같은 열두 개가 질문마다 다른 모양이 된다
 *
 * 조각의 개수는 단계 내내 같다. 바뀌는 것은 자리뿐이고, 그래서 "자료는
 * 하나인데 보는 각도가 다섯"이라는 말이 그림으로 보인다. 각 모양을 받치는
 * 보조선(묶음 상자·인용 기둥·시간 축·표적 고리·연결선)은 그 단계에서만 켠다.
 * ══════════════════════════════════════════════════════════════ */

type Seat = readonly [number, number];

/** 묶음 — 넷씩 세 덩이. */
function bundleSeats(n: number): Seat[] {
  const centers = [104, 220, 336];
  return Array.from({ length: n }, (_, i) => {
    const group = Math.floor(i / 4);
    const slot = i % 4;
    const cx = centers[Math.min(group, centers.length - 1)];
    return [cx + (slot % 2 === 0 ? -15 : 15), 112 + (slot < 2 ? -17 : 17)] as const;
  });
}

/** 기둥 — 두 줄로 세로로 선다. */
function columnSeats(n: number): Seat[] {
  return Array.from({ length: n }, (_, i) => {
    const row = i % 6;
    const col = Math.floor(i / 6);
    return [184 + col * 28, 44 + row * 25] as const;
  });
}

/** 줄 — 축 하나 위로 전부 올라간다. */
function lineSeats(n: number): Seat[] {
  const left = 44;
  const right = 396;
  return Array.from({ length: n }, (_, i) => {
    return [left + (i * (right - left)) / (n - 1), 118] as const;
  });
}

/** 고리 — 가운데 하나를 둘러싼다. */
function ringSeats(n: number): Seat[] {
  return Array.from({ length: n }, (_, i) => {
    const angle = ((-90 + (i * 360) / n) * Math.PI) / 180;
    return [220 + Math.cos(angle) * 78, 116 + Math.sin(angle) * 66] as const;
  });
}

/**
 * 그물 — 서로 잇는다.
 *
 * 자리를 난수로 뿌리지 않는다. 난수는 서버와 브라우저가 다른 그림을 그리게
 * 하고(하이드레이션 불일치), 다시 들어온 사람이 같은 점을 가리킬 수 없게 한다.
 */
const NET_SEATS: Seat[] = [
  [64, 56],
  [148, 40],
  [238, 60],
  [330, 44],
  [398, 84],
  [58, 118],
  [150, 108],
  [242, 122],
  [332, 112],
  [108, 172],
  [214, 178],
  [324, 170],
];

const NET_EDGES: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [1, 6],
  [2, 7],
  [3, 8],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [6, 9],
  [7, 10],
  [8, 11],
  [9, 10],
  [10, 11],
];

function netSeats(n: number): Seat[] {
  return Array.from({ length: n }, (_, i) => NET_SEATS[i % NET_SEATS.length]);
}

function Doors({ v, step }: { v: Extract<GuideVisual, { kind: "doors" }>; step: number }) {
  const door = v.doors[Math.min(step, v.doors.length - 1)];
  const n = v.pieces;

  const seats =
    door.shape === "묶음"
      ? bundleSeats(n)
      : door.shape === "기둥"
        ? columnSeats(n)
        : door.shape === "줄"
          ? lineSeats(n)
          : door.shape === "고리"
            ? ringSeats(n)
            : netSeats(n);

  return (
    <svg viewBox="0 0 440 214" className={svgClass} aria-hidden="true">
      {/* 묶음 상자 */}
      <Layer on={door.shape === "묶음"}>
        {[104, 220, 336].map((cx) => (
          <rect
            key={cx}
            x={cx - 40}
            y={74}
            width={80}
            height={76}
            rx={14}
            fill="var(--navy-tint)"
            stroke="var(--navy)"
            strokeWidth={1.2}
            opacity={0.55}
          />
        ))}
      </Layer>

      {/* 인용 기둥 */}
      <Layer on={door.shape === "기둥"}>
        <rect x={158} y={34} width={4} height={146} rx={2} fill="var(--navy)" opacity={0.7} />
      </Layer>

      {/* 시간 축 */}
      <Layer on={door.shape === "줄"}>
        <line
          x1={28}
          y1={118}
          x2={412}
          y2={118}
          stroke="var(--navy)"
          strokeWidth={1.4}
          opacity={0.5}
        />
        {[44, 220, 396].map((x) => (
          <line
            key={x}
            x1={x}
            y1={132}
            x2={x}
            y2={142}
            stroke="var(--ash)"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        ))}
      </Layer>

      {/* 표적 고리 */}
      <Layer on={door.shape === "고리"}>
        <circle
          cx={220}
          cy={116}
          r={30}
          fill="var(--burgundy-tint)"
          stroke="var(--burgundy)"
          strokeWidth={1.4}
        />
        <circle cx={220} cy={116} r={14} fill="none" stroke="var(--burgundy)" strokeWidth={1.4} />
        <circle cx={220} cy={116} r={4} fill="var(--burgundy)" />
      </Layer>

      {/* 연결선 */}
      <Layer on={door.shape === "그물"}>
        {NET_EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={NET_SEATS[a][0]}
            y1={NET_SEATS[a][1]}
            x2={NET_SEATS[b][0]}
            y2={NET_SEATS[b][1]}
            stroke="var(--navy)"
            strokeWidth={1.2}
            opacity={0.45}
          />
        ))}
      </Layer>

      {/* 조각. 개수는 내내 같고 자리만 옮긴다. */}
      {seats.map(([x, y], i) => (
        <g
          key={i}
          style={{
            transform: `translate(${x}px, ${y}px)`,
            transition: `transform 660ms var(--ease-out-expo) ${(i % 6) * 26}ms`,
          }}
        >
          <circle r={7} fill="var(--navy)" />
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 3. 일곱 칸 — 한 편의 뼈대가 하나씩 찬다
 *
 * 세로로 긴 그림이라 폭을 넓히면 빈 무대가 남는다. viewBox를 그림에 붙이고
 * 대신 최대 폭을 묶어 1:1에 가깝게 그린다.
 *
 * 여기에 자유롭게 움직이는 손잡이를 둔다. 단계를 넘기는 것은 순서를 익히는
 * 일이고, 보기를 제 손으로 바꿔 보는 것이 이 화면을 실제로 쓰는 일이다.
 * ══════════════════════════════════════════════════════════════ */

const SLOT_H = 28;
const SLOT_GAP = 36;
const SLOT_TOP = 22;

function Slots({ v, step }: { v: Extract<GuideVisual, { kind: "slots" }>; step: number }) {
  const [view, setView] = useState<"easy" | "full">("easy");
  const rows = v.slots.length;
  const height = SLOT_TOP + rows * SLOT_GAP + 8;

  return (
    <div>
      <svg
        viewBox={`0 0 300 ${height}`}
        className={`${svgClass} mx-auto block`}
        style={{ maxWidth: 340 }}
        aria-hidden="true"
      >
        <rect
          x={8}
          y={8}
          width={170}
          height={height - 16}
          rx={16}
          fill="var(--eggshell)"
          stroke="var(--stone)"
          strokeWidth={1.4}
        />

        {v.slots.map((slot, i) => {
          const y = SLOT_TOP + i * SLOT_GAP;
          const on = i <= step;
          const here = i === step;
          return (
            <g key={slot.label}>
              <rect
                x={20}
                y={y}
                width={146}
                height={SLOT_H}
                rx={8}
                fill={on ? "var(--taupe)" : "none"}
                stroke={here ? "var(--navy)" : on ? "var(--stone)" : "var(--stone)"}
                strokeWidth={here ? 1.8 : 1.2}
                strokeDasharray={on ? undefined : "4 4"}
                style={{ transition: "fill 360ms, stroke 360ms" }}
              />

              {/* 쉽게 보기 — 그림 한 점과 짧은 말 */}
              <Layer on={on && view === "easy"}>
                <circle cx={36} cy={y + SLOT_H / 2} r={7} fill="var(--navy)" opacity={0.85} />
                <rect
                  x={50}
                  y={y + SLOT_H / 2 - 3.5}
                  width={72}
                  height={7}
                  rx={3.5}
                  fill="var(--navy)"
                  opacity={0.3}
                />
              </Layer>

              {/* 원문 보기 — 줄글과 수치 */}
              <Layer on={on && view === "full"}>
                {[122, 100, 78].map((w, k) => (
                  <rect
                    key={w}
                    x={32}
                    y={y + 7 + k * 6}
                    width={w}
                    height={3}
                    rx={1.5}
                    fill="var(--graphite)"
                    opacity={0.45}
                  />
                ))}
              </Layer>

              <text
                x={190}
                y={y + SLOT_H / 2 + 4}
                fontSize={11.5}
                {...SUB}
                fill={on ? "var(--ink)" : "var(--ash)"}
                style={{ transition: "fill 360ms" }}
              >
                {slot.label}
              </text>
              <Layer on={on}>
                <text x={292} y={y + SLOT_H / 2 + 4} textAnchor="end" fontSize={10} {...SUB} fill="var(--ash)">
                  {slot.filled}/{slot.total}
                </text>
              </Layer>
            </g>
          );
        })}
      </svg>

      {/*
       * 손잡이는 svg 밖에 둔다. 진짜 버튼이라 키보드로 닿고, 그림이 자라도
       * 글자가 그림에 깔리지 않는다.
       */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {v.views.map((option) => {
          const active = option.id === view;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setView(option.id)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                active
                  ? "border-ink bg-ink text-eggshell"
                  : "border-stone text-smoke hover:border-graphite hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function GuideVisualView({ visual, step }: { visual: GuideVisual; step: number }) {
  switch (visual.kind) {
    case "anchor":
      return <AnchorChain v={visual} step={step} />;
    case "doors":
      return <Doors v={visual} step={step} />;
    case "slots":
      return <Slots v={visual} step={step} />;
  }
}
