"use client";

import { useReveal } from "@/features/motion/useReveal";

/**
 * 둘러보기의 삽화.
 *
 * ★ 이 자리에는 사진을 두지 않는다.
 *   홈 히어로에는 업적을 대표하는 실사 사진이 있다(`public/images/heroes`).
 *   그쪽은 "이 일이 있었던 곳"을 보이는 자리라 사진이 맞다. 여기가 설명하는
 *   것은 화면의 구조와 건수여서, 사진으로는 아무것도 가리킬 수 없고 분위기만
 *   얹힌다. 그래서 이 파일의 그림은 둘 중 하나다 — 콘텐츠에서 센 수를 그대로
 *   그린 것이거나, 이 앱의 화면 자체를 축소해 그린 것이다. 쉬운 설명
 *   삽화(`eli5/art.tsx`)와 같은 판단이다.
 *
 * ★ 앱 토큰으로만 칠한다.
 *   UI는 무채색, 색은 자료에만. 여기서 navy가 보이면 그건 언제나 건수이거나
 *   이 앱이 실제로 navy로 그리는 것(항로·근거)이다.
 *
 * ★ 작은 그림에는 글자를 넣지 않는다.
 *   48짜리 칸에 들어간 11px 글자는 읽히지 않으면서 자리만 먹는다. 이름은
 *   옆의 진짜 글이 갖는다.
 */

/* ══════════════════════════════════════════════════════════════
 * 서가 — 지금 실린 것을 낱개로 센다
 *
 * 숫자 넷을 표로 적는 것과, 그 수만큼 조각이 깔리는 것을 보는 것은 다르다.
 * 22와 46의 차이가 글자 크기가 아니라 넓이로 읽힌다. 세어 보라고 그리는
 * 것이 아니라 "이만큼 있다"를 몸으로 받게 하려고 그린다.
 * ══════════════════════════════════════════════════════════════ */

const COLS = 18;
const CELL_W = 24.5;
const CELL_H = 17;
const BAND_LEFT = 12;
const BAND_TOP = 12;

export interface LibraryGroup {
  label: string;
  count: number;
  tone: "navy" | "graphite" | "muted";
}

/*
 * 세 갈래를 짙기로 나눈다.
 *
 * 빈 테두리로 두면 안 된다. 이 앱에서 속이 빈 상자는 "아직 채우지 못한 칸"의
 * 표시이고(빈 카르텔·못 채운 일곱 칸), 여기 46쪽은 이미 있는 것이다. 모양이
 * 거짓말을 하지 않도록 셋 다 채우고 짙기만 달리한다.
 */
const TONE_FILL: Record<LibraryGroup["tone"], string> = {
  navy: "var(--navy)",
  graphite: "var(--graphite)",
  muted: "var(--stone)",
};

const TONE_CHIP: Record<LibraryGroup["tone"], string> = {
  navy: "bg-navy",
  graphite: "bg-graphite",
  muted: "bg-stone",
};

export function LibraryBand({ groups }: { groups: LibraryGroup[] }) {
  const { ref, shown } = useReveal<HTMLDivElement>();

  /* 조각 하나하나가 실물 한 편이다. 순서는 갈래 순서 그대로다. */
  const marks = groups.flatMap((group) =>
    Array.from({ length: group.count }, () => group.tone),
  );
  const rows = Math.max(1, Math.ceil(marks.length / COLS));
  const height = BAND_TOP * 2 + rows * CELL_H;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 460 ${height}`}
        className="w-full rounded-card border border-stone bg-taupe/50"
        role="img"
        aria-label={groups.map((g) => `${g.label} ${g.count}`).join(", ")}
      >
        {marks.map((tone, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          return (
            <rect
              key={i}
              x={BAND_LEFT + col * CELL_W}
              y={BAND_TOP + row * CELL_H}
              width={18}
              height={11}
              rx={3}
              fill={TONE_FILL[tone]}
              stroke="none"
              strokeWidth={1.2}
              style={{
                /*
                 * 0에서 자라난다. 다 깔린 그림을 던지는 것보다 쌓이는 것을
                 * 보는 쪽이 양을 몸으로 읽게 한다. 지연은 위에서 아래로
                 * 흐르되, 끝까지 기다리게 하지 않으려고 상한을 둔다.
                 */
                opacity: shown ? 1 : 0,
                transform: shown ? "none" : "translateY(5px)",
                transition: `opacity 420ms var(--ease-out-expo) ${Math.min(i * 9, 900)}ms, transform 420ms var(--ease-out-expo) ${Math.min(i * 9, 900)}ms`,
              }}
            />
          );
        })}
      </svg>

      {/* 이름은 그림 밖에서. 조각 위에 글자를 얹으면 둘 다 읽히지 않는다. */}
      <ul className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {groups.map((group) => (
          <li key={group.label} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`h-2.5 w-4 rounded-sm ${TONE_CHIP[group.tone]}`}
            />
            <span className="text-[12px] text-smoke">{group.label}</span>
            <span className="tabular text-[12px] font-bold text-ink">{group.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
 * 해보기 카드의 작은 그림
 *
 * 카드 셋이 글만으로는 다 같아 보였다. 무엇을 만지게 되는지를 48칸 안에
 * 그려 두면 어느 쪽으로 들어갈지 고르는 데 글을 읽지 않아도 된다.
 * ══════════════════════════════════════════════════════════════ */

const demoArtClass = "h-11 w-11 shrink-0 rounded-sm border border-stone bg-eggshell";

/** 지도 — 두 항로가 한 화면에 겹친다. 앱이 실제로 그리는 그림의 축소판이다. */
function MapArt() {
  return (
    <svg viewBox="0 0 48 48" className={demoArtClass} aria-hidden="true">
      <circle cx={24} cy={24} r={16} fill="var(--map-sea)" opacity={0.5} />
      <path d="M8 24 A16 16 0 0 1 40 24" fill="none" stroke="var(--map-grid)" strokeWidth={1} />
      <path
        d="M11 31 C17 12, 31 12, 37 31"
        fill="none"
        stroke="var(--burgundy)"
        strokeWidth={1.8}
        strokeDasharray="3 3"
        strokeLinecap="round"
      />
      <path
        d="M11 31 C19 22, 29 22, 37 31"
        fill="none"
        stroke="var(--navy)"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <circle cx={11} cy={31} r={2.6} fill="var(--navy)" />
      <circle cx={37} cy={31} r={2.6} fill="var(--navy)" />
    </svg>
  );
}

/** 흐름 — 하나가 갈라져 내려간다. 갈래마다 굵기가 다르다. */
function FlowArt() {
  return (
    <svg viewBox="0 0 48 48" className={demoArtClass} aria-hidden="true">
      <rect x={17} y={8} width={14} height={7} rx={2} fill="var(--navy)" />
      <path
        d="M24 15 C24 23, 12 23, 12 33"
        fill="none"
        stroke="var(--navy)"
        strokeWidth={3.4}
        opacity={0.75}
      />
      <path d="M24 15 L24 33" fill="none" stroke="var(--navy)" strokeWidth={2.2} opacity={0.55} />
      <path
        d="M24 15 C24 23, 36 23, 36 33"
        fill="none"
        stroke="var(--navy)"
        strokeWidth={1.4}
        opacity={0.4}
      />
      {[12, 24, 36].map((x) => (
        <rect key={x} x={x - 4} y={33} width={8} height={6} rx={1.5} fill="var(--stone)" />
      ))}
    </svg>
  );
}

/** 근거 — 숫자에서 자료로 내려가는 줄. 이 앱의 뼈대 그 자체다. */
function EvidenceArt() {
  return (
    <svg viewBox="0 0 48 48" className={demoArtClass} aria-hidden="true">
      <rect x={9} y={8} width={30} height={12} rx={3} fill="none" stroke="var(--navy)" strokeWidth={1.4} />
      {/* 숫자 자리. 실제 수를 적지 않는다 — 콘텐츠가 바뀌면 이 그림이 거짓말을 한다. */}
      <rect x={14} y={11} width={13} height={6} rx={1.5} fill="var(--navy)" />
      <rect x={29} y={12} width={5} height={4} rx={1} fill="var(--navy)" opacity={0.45} />
      <line
        x1={24}
        y1={20}
        x2={24}
        y2={28}
        stroke="var(--navy)"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path d="M21 25.5 L24 28.5 L27 25.5" fill="none" stroke="var(--navy)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={9} y={29} width={30} height={11} rx={3} fill="var(--navy-tint)" />
      {[13, 17].map((y, i) => (
        <rect key={y} x={13} y={y + 19} width={i === 0 ? 20 : 14} height={1.6} rx={0.8} fill="var(--navy)" opacity={0.5} />
      ))}
    </svg>
  );
}

const DEMO_ART = { map: MapArt, flow: FlowArt, evidence: EvidenceArt };
export type DemoArtKind = keyof typeof DEMO_ART;

export function DemoArt({ kind }: { kind: DemoArtKind }) {
  const Art = DEMO_ART[kind];
  return <Art />;
}

/* ══════════════════════════════════════════════════════════════
 * 할 수 있는 것 — 화면 축소판 다섯
 *
 * 전부 이 앱에 실제로 있는 화면 부품을 줄여 그린 것이다. 상상한 아이콘이
 * 아니라 "그 화면이 이렇게 생겼다"여야, 나중에 만났을 때 알아본다.
 * ══════════════════════════════════════════════════════════════ */

const abilityArtClass = "h-10 w-10 shrink-0";

/** 쉽게 보기 ↔ 원문 보기. 왼쪽은 그림, 오른쪽은 줄글, 가운데 손잡이. */
function SwitchArt() {
  return (
    <svg viewBox="0 0 40 40" className={abilityArtClass} aria-hidden="true">
      <rect x={2} y={6} width={15} height={22} rx={3} fill="none" stroke="var(--stone)" strokeWidth={1.4} />
      <circle cx={9.5} cy={14} r={3.4} fill="var(--navy)" opacity={0.75} />
      <rect x={5} y={20} width={9} height={2.4} rx={1.2} fill="var(--navy)" opacity={0.3} />
      <rect x={23} y={6} width={15} height={22} rx={3} fill="none" stroke="var(--stone)" strokeWidth={1.4} />
      {[11, 15, 19, 23].map((y, i) => (
        <rect key={y} x={26} y={y} width={i % 2 ? 6 : 9} height={1.8} rx={0.9} fill="var(--graphite)" opacity={0.45} />
      ))}
      <rect x={13} y={32} width={14} height={6} rx={3} fill="var(--ink)" />
      <circle cx={17} cy={35} r={2} fill="var(--eggshell)" />
    </svg>
  );
}

/** 근거 열기. 아래에서 서랍이 올라온다. */
function DrawerArt() {
  return (
    <svg viewBox="0 0 40 40" className={abilityArtClass} aria-hidden="true">
      <rect x={5} y={3} width={30} height={34} rx={4} fill="none" stroke="var(--stone)" strokeWidth={1.4} />
      {[9, 13].map((y, i) => (
        <rect key={y} x={9} y={y} width={i === 0 ? 18 : 12} height={2} rx={1} fill="var(--ash)" opacity={0.6} />
      ))}
      <rect x={9} y={18} width={13} height={5} rx={2.5} fill="none" stroke="var(--navy)" strokeWidth={1.2} />
      <path d="M13 21.5 L15 19.5 L17 21.5" fill="none" stroke="var(--navy)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={5} y={25} width={30} height={12} rx={4} fill="var(--navy-tint)" stroke="var(--navy)" strokeWidth={1.2} />
      {[29, 33].map((y, i) => (
        <rect key={y} x={10} y={y} width={i === 0 ? 20 : 14} height={1.8} rx={0.9} fill="var(--navy)" opacity={0.5} />
      ))}
    </svg>
  );
}

/** AI 안내. 떠 있는 단추에서 화면 한 곳으로 시선이 옮겨 간다. */
function AskArt() {
  return (
    <svg viewBox="0 0 40 40" className={abilityArtClass} aria-hidden="true">
      <rect x={3} y={3} width={34} height={34} rx={5} fill="none" stroke="var(--stone)" strokeWidth={1.4} />
      <rect x={8} y={9} width={16} height={9} rx={2} fill="var(--navy)" opacity={0.18} />
      <rect x={8} y={9} width={16} height={9} rx={2} fill="none" stroke="var(--navy)" strokeWidth={1.4} />
      <path
        d="M29 27 C29 21, 22 20, 18 18"
        fill="none"
        stroke="var(--navy)"
        strokeWidth={1.4}
        strokeDasharray="2.5 2.5"
        strokeLinecap="round"
      />
      <path d="M16.5 20.5 L17.6 17.6 L20.5 18.8" fill="none" stroke="var(--navy)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={30} cy={30} r={6} fill="var(--ink)" />
      <circle cx={30} cy={30} r={2} fill="var(--eggshell)" />
    </svg>
  );
}

/** 검색. 돋보기 아래로 여러 층이 한꺼번에 걸린다. */
function SearchArt() {
  return (
    <svg viewBox="0 0 40 40" className={abilityArtClass} aria-hidden="true">
      <circle cx={17} cy={15} r={9} fill="none" stroke="var(--navy)" strokeWidth={1.8} />
      <line x1={23.5} y1={21.5} x2={30} y2={28} stroke="var(--navy)" strokeWidth={1.8} strokeLinecap="round" />
      {[28, 33].map((y, i) => (
        <rect key={y} x={5} y={y} width={i === 0 ? 24 : 17} height={3} rx={1.5} fill="var(--stone)" />
      ))}
      <rect x={5} y={28} width={9} height={3} rx={1.5} fill="var(--navy)" opacity={0.55} />
      <rect x={5} y={33} width={6} height={3} rx={1.5} fill="var(--navy)" opacity={0.55} />
    </svg>
  );
}

/** 공유. 보고 있던 상태가 그대로 떠난다. */
function ShareArt() {
  return (
    <svg viewBox="0 0 40 40" className={abilityArtClass} aria-hidden="true">
      <rect x={4} y={8} width={22} height={26} rx={4} fill="none" stroke="var(--stone)" strokeWidth={1.4} />
      <path d="M9 24 C13 16, 19 16, 22 22" fill="none" stroke="var(--navy)" strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={9} cy={24} r={1.8} fill="var(--navy)" />
      <path
        d="M24 14 C31 12, 34 11, 36 10"
        fill="none"
        stroke="var(--navy)"
        strokeWidth={1.4}
        strokeDasharray="2.5 2.5"
        strokeLinecap="round"
      />
      <path d="M32.5 8 L36.5 9.6 L34 13" fill="none" stroke="var(--navy)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ABILITY_ART = {
  switch: SwitchArt,
  drawer: DrawerArt,
  ask: AskArt,
  search: SearchArt,
  share: ShareArt,
};
export type AbilityArtKind = keyof typeof ABILITY_ART;

export function AbilityArt({ kind }: { kind: AbilityArtKind }) {
  const Art = ABILITY_ART[kind];
  return <Art />;
}
