import { Aura, Bubble, Eyes, Ground, Maw, Motes, Tendril, type BossDraw, type Paint, type Palette } from "./parts";

/**
 * 가짜뉴스 덩굴 — 근거 없는 말을 먹고 퍼진다.
 * 1형 덩굴 → 2형 속보 덩굴(확성기 꽃·속보 띠) → 3형 천 개의 입 카더라(온몸의 입과 눈, 가짜 본체 분신).
 */
export const rumorPal: [Palette, Palette, Palette] = [
  { body: ["#9a6ad8", "#3c1c6a"], line: "#16082c", glow: "#d9a8ff", metal: ["#ffe26a", "#b8860a"] },
  { body: ["#8a52d2", "#2e1258"], line: "#120626", glow: "#e6b0ff", metal: ["#ffe26a", "#b8860a"] },
  { body: ["#6a34b8", "#1c0a3c"], line: "#0a0318", glow: "#f0a0ff", metal: ["#ffe26a", "#b8860a"] },
];

/** 확성기 꽃. (x, y)에서 deg 쪽으로 벌어진다. */
function Horn({ x, y, deg, s = 1, paint }: { x: number; y: number; deg: number; s?: number; paint: Paint }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${deg}) scale(${s})`}>
      <path d="M0 -6L26 -18V18L0 6Z" fill={paint.metal} stroke="#2a1c08" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="26" cy="0" rx="6" ry="18" fill="#2a1030" stroke="#2a1c08" strokeWidth="2" />
      <path d="M38 -12q7 12 0 24M46 -18q11 18 0 36" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
    </g>
  );
}

export const rumor: BossDraw = (form, paint, pal) => {
  const vine = (d: string, w = 9) => <Tendril key={d} d={d} width={w} color={pal.body[1]} line={pal.line} light={pal.body[0]} />;
  const bulb = (cx: number, cy: number, rx: number, ry: number) => (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={paint.body} stroke={pal.line} strokeWidth="3" />
      <ellipse cx={cx - rx * 0.28} cy={cy - ry * 0.4} rx={rx * 0.42} ry={ry * 0.26} fill="#fff" opacity=".14" />
    </>
  );

  if (form === 1) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={94} cy={142} />,
      back: (
        <>
          {vine("M110 200C70 176 36 180 28 144C22 118 46 108 58 124")}
          {vine("M130 200C172 178 208 178 212 138C214 114 190 108 182 126")}
          {vine("M120 190C116 130 86 96 96 50C102 30 124 34 118 54")}
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} />
          {bulb(120, 152, 50, 46)}
        </>
      ),
      head: (
        <>
          <Eyes x={120} y={140} gap={36} w={16} h={8} color={pal.glow} paint={paint} />
          <Maw x={120} y={158} w={50} h={20} teeth={7} />
        </>
      ),
      front: (
        <>
          <Bubble x={44} y={92} text="?!" fill="#efe3ff" color="#3c1c6a" r={-12} />
          <Bubble x={196} y={84} text="속보" fill="#efe3ff" color="#3c1c6a" r={10} />
          <Bubble x={150} y={30} text="카더라" fill="#efe3ff" color="#3c1c6a" r={4} s={1.1} />
        </>
      ),
    };
  }

  if (form === 2) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={110} cy={134} rays={12} />,
      back: (
        <>
          {vine("M108 200C60 180 22 176 20 130C18 100 40 84 52 70", 10)}
          {vine("M132 200C180 180 218 176 220 130C222 100 200 84 188 70", 10)}
          {vine("M120 190C114 124 78 96 88 44C92 26 104 20 112 14", 10)}
          {vine("M124 190C140 130 168 104 160 60C158 46 150 38 144 32", 8)}
          <Horn x={52} y={70} deg={-125} paint={paint} />
          <Horn x={188} y={70} deg={-55} paint={paint} />
          <Horn x={112} y={14} deg={-100} s={0.9} paint={paint} />
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} wide={74} />
          {bulb(120, 148, 58, 54)}
        </>
      ),
      armor: (
        <g transform="rotate(-8 120 182)">
          <path d="M52 172H188L196 184 188 196H52L44 184Z" fill="#ffd84a" stroke="#2a1c08" strokeWidth="2.4" strokeLinejoin="round" />
          <text x="120" y="190" textAnchor="middle" fontSize="15" fontWeight="900" fill="#2a1030" letterSpacing="3">
            속보 · 단독 · 속보
          </text>
        </g>
      ),
      head: (
        <>
          <Eyes x={120} y={130} gap={42} w={18} h={9} tilt={22} color={pal.glow} paint={paint} />
          <Maw x={120} y={146} w={60} h={22} teeth={8} glow={pal.glow} />
        </>
      ),
      front: <Motes at={[[30, 40], [210, 40], [120, 0], [24, 190], [216, 190]]} color={pal.glow} />,
    };
  }

  // 3형 — 천 개의 입. 몸은 입과 눈으로 덮이고, 덩굴 끝에는 가짜 본체가 달린다.
  const decoy = (x: number, y: number, s: number, text: string) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="30" ry="27" fill={pal.body[0]} stroke={pal.glow} strokeWidth="2.4" strokeDasharray="5 4" opacity=".85" />
      <g transform="translate(-120 -120)" opacity=".9">
        <Eyes x={120} y={114} gap={24} w={11} h={6} color="#fff" paint={paint} />
        <Maw x={120} y={124} w={30} h={13} teeth={5} />
      </g>
      <text x="0" y="-34" textAnchor="middle" fontSize="12" fontWeight="900" fill={pal.glow}>
        {text}
      </text>
    </g>
  );
  const eye = (x: number, y: number, r: number) => (
    <g key={`${x}-${y}`}>
      <circle cx={x} cy={y} r={r * 1.7} fill={paint.glow} />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.62} fill={pal.glow} stroke={pal.line} strokeWidth="1.2" />
      <ellipse cx={x} cy={y} rx={r * 0.22} ry={r * 0.55} fill={pal.line} />
    </g>
  );
  return {
    aura: <Aura paint={paint} glow={pal.glow} r={130} cy={126} rays={20} rune />,
    back: (
      <>
        {vine("M104 204C40 190 -6 170 -8 112C-10 76 14 60 34 50", 12)}
        {vine("M136 204C200 190 246 170 248 112C250 76 226 60 206 50", 12)}
        {vine("M116 190C104 120 60 90 70 30C72 14 84 4 96 -2", 10)}
        {vine("M126 190C140 120 184 92 172 32C170 16 158 6 148 0", 10)}
        {decoy(34, 50, 1, "진짜?")}
        {decoy(206, 50, 1, "카더라")}
        {decoy(122, -6, 0.8, "단독")}
      </>
    ),
    body: (
      <>
        <Ground line={pal.line} wide={88} />
        {bulb(120, 142, 70, 64)}
      </>
    ),
    armor: (
      <>
        <Maw x={76} y={150} w={26} h={12} teeth={4} glow={pal.glow} />
        <Maw x={164} y={150} w={26} h={12} teeth={4} glow={pal.glow} />
        <Maw x={96} y={182} w={24} h={11} teeth={4} />
        <Maw x={146} y={182} w={24} h={11} teeth={4} />
        <Maw x={120} y={86} w={22} h={10} teeth={4} />
        {[[70, 124, 6], [170, 124, 6], [92, 96, 5], [150, 98, 5], [120, 190, 5], [60, 166, 4], [180, 168, 4]].map(([x, y, r]) => eye(x, y, r))}
      </>
    ),
    head: (
      <>
        <Eyes x={120} y={124} gap={44} w={20} h={10} tilt={24} color={pal.glow} paint={paint} />
        <Maw x={120} y={142} w={66} h={26} teeth={9} glow={pal.glow} />
      </>
    ),
    front: <Motes at={[[20, 150], [220, 150], [60, 220], [180, 222], [10, 20], [230, 20]]} color={pal.glow} r={2.6} />,
  };
};
