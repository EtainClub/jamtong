import type { ReactNode } from "react";

import type { RaidKindId } from "./rules";

/**
 * 거대 잡초 그림 — 종류(rules.ts RAID_KINDS)마다 생김새가 다르다.
 *
 * 광장의 작은 잡초(WeedArt)는 순한 풀이지만, 거대 잡초는 사회를 갉아먹는 악초다.
 * 성난 눈썹·이빨·가시로 드세 보이게 그린다. 아이가 보는 화면이라 무섭기보다 얄밉게.
 * 숨 쉬듯 으르렁대는 움직임은 CSS(.garden-raid-menace)가 준다.
 */

type Mood = "angry" | "sneer" | "sly";

/** 성난 얼굴. (x, y)가 두 눈의 가운데. */
function Face({ x, y, s = 1, mood = "angry", shades = false }: { x: number; y: number; s?: number; mood?: Mood; shades?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shades ? (
        <path d="M-15 -4h12l1 2h4l1-2h12v4q-1 7-7 7t-7-6h-2q-1 6-7 6t-7-7Z" fill="#111" stroke="#000" strokeWidth=".8" />
      ) : (
        <>
          <ellipse cx="-7" cy="0" rx="5.2" ry="4.4" fill="#fff8e1" stroke="#1d1208" strokeWidth="1.2" />
          <ellipse cx="7" cy="0" rx="5.2" ry="4.4" fill="#fff8e1" stroke="#1d1208" strokeWidth="1.2" />
          <circle cx={mood === "sly" ? -5 : -6} cy="1" r="2.2" fill="#c0162d" />
          <circle cx={mood === "sly" ? 9 : 6} cy="1" r="2.2" fill="#c0162d" />
          <circle cx={mood === "sly" ? -5 : -6} cy="1" r=".9" fill="#1d1208" />
          <circle cx={mood === "sly" ? 9 : 6} cy="1" r=".9" fill="#1d1208" />
        </>
      )}
      {/* 눈썹 — 안쪽으로 내리꽂는다. 비웃는 얼굴은 한쪽만 치켜든다. */}
      <path
        d={mood === "sneer" ? "M-13 -8 -2 -4M2 -9 13 -11" : "M-13 -9 -2 -4M2 -4 13 -9"}
        stroke="#1d1208"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* 이빨 드러낸 입 */}
      <path
        d={mood === "sly" ? "M-8 10q8 5 16-1q-8 9-16 1Z" : "M-9 9q9-4 18 0q-2 7-9 7t-9-7Z"}
        fill="#3a0d12"
        stroke="#1d1208"
        strokeWidth="1"
      />
      <path d={mood === "sly" ? "M-5 11l2 2 2-1.6 2 2 2-2" : "M-7 9.4l2 3 2-3 2 3 2-3 2 3 2-3"} stroke="#fff8e1" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    </g>
  );
}

/** 뾰족뾰족한 몸(별 모양). */
function spiky(cx: number, cy: number, inner: number, outer: number, n: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

function Bubble({ x, y, text, fill = "#fff", color = "#7a2433", r = 0 }: { x: number; y: number; text: string; fill?: string; color?: string; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M-11 -7h22q3 0 3 3v8q0 3-3 3h-14l-5 5v-5h-3q-3 0-3-3v-8q0-3 3-3Z" fill={fill} stroke={color} strokeWidth="1.2" />
      <text x="0" y="3.4" textAnchor="middle" fontSize="9" fontWeight="900" fill={color}>
        {text}
      </text>
    </g>
  );
}

const ROOTS = (
  <>
    <ellipse cx="60" cy="110" rx="40" ry="7" fill="#000" opacity=".25" />
    <path d="M52 104 46 115 55 110 60 117 65 110 74 115 68 104" fill="#8a5a2b" stroke="#4d2f12" strokeWidth="1.2" />
  </>
);

const ART: Record<RaidKindId, ReactNode> = {
  // 악플 가시풀 — 가시 공. 말풍선 가시를 날린다.
  troll: (
    <>
      {ROOTS}
      <path d={spiky(60, 66, 27, 42, 14)} fill="#c23a4e" stroke="#5c0f1c" strokeWidth="2" strokeLinejoin="round" />
      <path d={spiky(60, 66, 20, 30, 14)} fill="#e0596b" opacity=".7" />
      <Face x={60} y={62} s={1.25} mood="sneer" />
      <Bubble x={18} y={20} text="#@!" r={-12} />
      <Bubble x={100} y={18} text="ㅋㅋ" r={10} />
      <path d="M12 44l-8 2M108 42l8 3M28 8l-3-6" stroke="#fff3" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  // 혐오 쐐기풀 — 불꽃처럼 갈라진 잎, 쐐기 털.
  hate: (
    <>
      {ROOTS}
      <g stroke="#3d1004" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M58 106C30 98 16 78 22 50L30 60 32 38 42 54 46 30 52 52Z" fill="#b8451a" />
        <path d="M62 106C90 98 104 78 98 50L90 60 88 38 78 54 74 30 68 52Z" fill="#b8451a" />
        <path d="M60 104C42 92 40 60 52 30L56 42 60 10 64 42 68 30C80 60 78 92 60 104Z" fill="#e0682a" />
      </g>
      <path d="M26 56l-5-2M34 44l-4-4M92 56l5-2M86 44l4-4M50 34l-4-3M70 34l4-3M60 18v-6" stroke="#ffd0a0" strokeWidth="1.4" strokeLinecap="round" />
      <Face x={60} y={66} s={1.15} mood="angry" />
    </>
  ),
  // 가짜뉴스 덩굴 — 말풍선 잎, 뻗어 나가는 덩굴손.
  rumor: (
    <>
      {ROOTS}
      <g fill="none" stroke="#3c1d63" strokeWidth="5" strokeLinecap="round">
        <path d="M58 104C40 90 20 92 14 74c-4-12 8-18 14-10" />
        <path d="M62 104C82 92 104 92 106 70c1-12-12-14-15-5" />
        <path d="M60 100C58 70 40 50 46 26c3-10 14-8 12 2" />
      </g>
      <g fill="none" stroke="#9b6fd6" strokeWidth="2" strokeLinecap="round">
        <path d="M58 104C40 90 20 92 14 74c-4-12 8-18 14-10" />
        <path d="M62 104C82 92 104 92 106 70c1-12-12-14-15-5" />
      </g>
      <ellipse cx="60" cy="74" rx="24" ry="22" fill="#7a4bb8" stroke="#2a1046" strokeWidth="2" />
      <Face x={60} y={70} s={1.15} mood="angry" />
      <Bubble x={22} y={46} text="?!" fill="#efe3ff" color="#4b2a74" r={-10} />
      <Bubble x={98} y={42} text="속보" fill="#efe3ff" color="#4b2a74" r={8} />
      <Bubble x={74} y={16} text="카더라" fill="#efe3ff" color="#4b2a74" r={4} />
    </>
  ),
  // 검은돈 독초 — 검은 잎, 금화 열매, 선글라스.
  bribe: (
    <>
      {ROOTS}
      <g stroke="#000" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M58 104Q20 100 14 66Q40 60 56 92Z" fill="#2f3a24" />
        <path d="M62 104Q100 100 106 66Q80 60 64 92Z" fill="#2f3a24" />
        <path d="M60 100Q30 70 46 34Q68 52 60 100ZM60 100Q90 70 74 34Q52 52 60 100Z" fill="#3e4d2c" />
      </g>
      <ellipse cx="60" cy="72" rx="20" ry="19" fill="#4a5a32" stroke="#000" strokeWidth="1.8" />
      <Face x={60} y={68} s={1.1} mood="sly" shades />
      <g fill="#f0c43c" stroke="#8a6410" strokeWidth="1.4">
        {[
          [24, 58],
          [96, 58],
          [46, 28],
          [76, 26],
          [32, 84],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="7" />
            <text x={cx} y={cy + 3.2} textAnchor="middle" fontSize="9" fontWeight="900" fill="#8a6410" stroke="none">
              ₩
            </text>
          </g>
        ))}
      </g>
      <rect x="82" y="84" width="20" height="12" rx="2" fill="#7fb35a" stroke="#2f4a1c" strokeWidth="1.2" transform="rotate(-14 92 90)" />
    </>
  ),
  // 갑질 엉겅퀴 — 왕관 같은 꽃머리, 내리누르는 가시 팔.
  bossy: (
    <>
      {ROOTS}
      <path d="M60 106V58" stroke="#2b5a2a" strokeWidth="7" strokeLinecap="round" />
      <g stroke="#1b3a1a" strokeWidth="1.6" strokeLinejoin="round" fill="#4f8f3c">
        <path d="M58 86 22 70l8-2-10-8 10 0-6-10 14 8 2-8 18 26Z" />
        <path d="M62 86 98 70l-8-2 10-8-10 0 6-10-14 8-2-8-18 26Z" />
      </g>
      <path d={spiky(60, 50, 18, 26, 16)} fill="#2d6b2a" stroke="#123012" strokeWidth="1.4" />
      <circle cx="60" cy="50" r="19" fill="#5b8f3a" stroke="#123012" strokeWidth="1.6" />
      <path d="M40 30 44 10 52 24 60 4 68 24 76 10 80 30Z" fill="#9b4fd1" stroke="#3d1366" strokeWidth="1.6" strokeLinejoin="round" />
      <g fill="#f0c43c">
        <circle cx="44" cy="10" r="2.4" />
        <circle cx="60" cy="4" r="2.6" />
        <circle cx="76" cy="10" r="2.4" />
      </g>
      <Face x={60} y={48} s={1.05} mood="sneer" />
    </>
  ),
  // 땅투기 칡 — 양옆으로 휘감아 뻗는 덩굴, 꽂아 둔 "내 땅" 깃발.
  grab: (
    <>
      {ROOTS}
      <g fill="none" stroke="#3d3a0e" strokeWidth="6" strokeLinecap="round">
        <path d="M54 96C30 96 12 86 6 66" />
        <path d="M66 96C90 96 108 86 114 66" />
      </g>
      <g fill="#8a9a2a" stroke="#2f300a" strokeWidth="1.5" strokeLinejoin="round">
        {/* 움켜쥐는 세 갈래 잎 */}
        <path d="M6 66l-6-10 8 4 0-10 6 9 6-6-2 12Z" />
        <path d="M114 66l6-10-8 4 0-10-6 9-6-6 2 12Z" />
        <path d="M60 100Q28 76 38 40Q62 46 60 100ZM60 100Q92 76 82 40Q58 46 60 100Z" />
      </g>
      <ellipse cx="60" cy="68" rx="22" ry="20" fill="#a3b236" stroke="#2f300a" strokeWidth="1.8" />
      <Face x={60} y={64} s={1.15} mood="angry" />
      <g>
        <path d="M18 92V70" stroke="#4d2f12" strokeWidth="2" />
        <path d="M18 70h16l-3 5 3 5H18Z" fill="#e94b3c" stroke="#7a1a10" strokeWidth="1" />
        <text x="25" y="78" textAnchor="middle" fontSize="6" fontWeight="900" fill="#fff">
          내땅
        </text>
        <path d="M102 92V72" stroke="#4d2f12" strokeWidth="2" />
        <path d="M102 72H86l3 5-3 5h16Z" fill="#e94b3c" stroke="#7a1a10" strokeWidth="1" />
        <text x="95" y="80" textAnchor="middle" fontSize="6" fontWeight="900" fill="#fff">
          내땅
        </text>
      </g>
    </>
  ),
};

export function RaidWeedArt({ kind }: { kind: RaidKindId }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="garden-weed-art garden-raid-art">
      {ART[kind]}
    </svg>
  );
}
