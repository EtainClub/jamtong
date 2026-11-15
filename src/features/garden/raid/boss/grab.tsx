import { Aura, Eyes, Ground, Maw, Motes, Plate, Tendril, type BossDraw, type Palette } from "./parts";

/**
 * 땅투기 칡 — 남의 땅까지 휘감아 차지한다.
 * 1형 칡(움켜쥐는 덩굴·"내땅" 깃발) → 2형 울타리 칡(말뚝 울타리) → 3형 광장을 삼키는 칡 거수(그림판 밖으로 뻗는 네 팔, 움켜쥔 땅).
 */
export const grabPal: [Palette, Palette, Palette] = [
  { body: ["#b8c63c", "#4a4c10"], line: "#16170a", glow: "#eaff6a", metal: ["#c9a26a", "#5a3c16"] },
  { body: ["#a4b234", "#3c3e0c"], line: "#101106", glow: "#f0ff5a", metal: ["#c9a26a", "#5a3c16"] },
  { body: ["#7f8c26", "#24260a"], line: "#080902", glow: "#f6ff4a", metal: ["#b88c54", "#4a2e0e"] },
];

function Flag({ x, y, h = 30, flip = false }: { x: number; y: number; h?: number; flip?: boolean }) {
  const d = flip ? -1 : 1;
  return (
    <g>
      <path d={`M${x} ${y}V${y - h}`} stroke="#3a240c" strokeWidth="3.4" strokeLinecap="round" />
      <path d={`M${x} ${y - h}h${d * 30}l${d * -6} 9 ${d * 6} 9H${x}Z`} fill="#e94b3c" stroke="#5a120a" strokeWidth="1.6" strokeLinejoin="round" />
      <text x={x + d * 14} y={y - h + 13.5} textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#fff">
        내땅
      </text>
    </g>
  );
}

export const grab: BossDraw = (form, paint, pal) => {
  /** 덩굴 팔과 그 끝의 움켜쥐는 세 갈래 손. (hx, hy)가 손목, deg는 손이 벌어지는 쪽. */
  const limb = (d: string, hx: number, hy: number, deg: number, w: number, s = 1) => (
    <g key={d}>
      <Tendril d={d} width={w} color={pal.body[1]} line={pal.line} light={pal.body[0]} />
      <g transform={`translate(${hx} ${hy}) rotate(${deg}) scale(${s})`}>
        <path d="M-10 4L-22 -22-6 -12 0 -32 6 -12 22 -22 10 4Z" fill={paint.body} stroke={pal.line} strokeWidth="2.6" strokeLinejoin="round" />
      </g>
    </g>
  );
  /** 움켜쥔 땅 한 뙈기 — 작은 집과 깃발. */
  const plot = (x: number, y: number, flip: boolean) => (
    <g key={`${x}-${y}`}>
      <path d={`M${x - 26} ${y}h52l-6 12h-40Z`} fill="#7a5a2c" stroke={pal.line} strokeWidth="2" strokeLinejoin="round" />
      <path d={`M${x - 14} ${y}v-14l10 -9 10 9v14Z`} fill="#e8dcc0" stroke={pal.line} strokeWidth="1.8" strokeLinejoin="round" />
      <Flag x={x + (flip ? -18 : 18)} y={y} h={26} flip={flip} />
    </g>
  );
  const bodyAt = (cy: number, rx: number, ry: number) => (
    <>
      <ellipse cx="120" cy={cy} rx={rx} ry={ry} fill={paint.body} stroke={pal.line} strokeWidth="3" />
      <ellipse cx={120 - rx * 0.26} cy={cy - ry * 0.4} rx={rx * 0.4} ry={ry * 0.24} fill="#fff" opacity=".14" />
    </>
  );

  if (form === 1) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={94} cy={140} />,
      back: (
        <>
          {limb("M104 190C60 194 26 170 16 132", 16, 132, -20, 11)}
          {limb("M136 190C180 194 214 170 224 132", 224, 132, 20, 11)}
          <path d="M120 200Q56 152 76 80Q124 92 120 200ZM120 200Q184 152 164 80Q116 92 120 200Z" fill={pal.body[1]} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} />
          {bodyAt(142, 44, 40)}
        </>
      ),
      head: (
        <>
          <Eyes x={120} y={132} gap={34} w={16} h={8} color={pal.glow} paint={paint} />
          <Maw x={120} y={148} w={42} h={18} teeth={6} />
        </>
      ),
      front: (
        <>
          <Flag x={40} y={212} h={36} />
          <Flag x={200} y={212} h={36} flip />
        </>
      ),
    };
  }

  if (form === 2) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={110} cy={132} rays={12} />,
      back: (
        <>
          {limb("M100 190C40 200 4 160 6 104", 6, 104, -8, 13, 1.25)}
          {limb("M140 190C200 200 236 160 234 104", 234, 104, 8, 13, 1.25)}
          {limb("M108 150C80 110 60 80 64 44", 64, 44, -6, 9)}
          {limb("M132 150C160 110 180 80 176 44", 176, 44, 6, 9)}
          <path d="M120 204Q44 150 70 60Q128 78 120 204ZM120 204Q196 150 170 60Q112 78 120 204Z" fill={pal.body[1]} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} wide={76} />
          {bodyAt(138, 52, 48)}
        </>
      ),
      armor: (
        <>
          {/* 말뚝 울타리 */}
          {[60, 84, 108, 132, 156, 180].map((x, i) => (
            <Plate key={x} d={`M${x - 9} 214V${172 - (i % 2) * 6}L${x} ${158 - (i % 2) * 6}L${x + 9} ${172 - (i % 2) * 6}V214Z`} paint={paint} line="#2a1806" />
          ))}
          <path d="M48 186H192M48 202H192" stroke="#2a1806" strokeWidth="5" strokeLinecap="round" />
          <path d="M48 186H192M48 202H192" stroke={pal.metal[0]} strokeWidth="2.4" strokeLinecap="round" />
        </>
      ),
      head: (
        <>
          <Eyes x={120} y={124} gap={40} w={18} h={9} tilt={22} color={pal.glow} paint={paint} />
          <Maw x={120} y={140} w={50} h={20} teeth={7} glow={pal.glow} />
        </>
      ),
      front: (
        <>
          <Flag x={26} y={214} h={44} />
          <Flag x={214} y={214} h={44} flip />
          <Motes at={[[40, 60], [200, 56], [120, 20]]} color={pal.glow} />
        </>
      ),
    };
  }

  // 3형 — 칡 거수. 네 팔이 그림판 밖으로 뻗어 땅을 움켜쥔다.
  return {
    aura: <Aura paint={paint} glow={pal.glow} r={132} cy={120} rays={20} rune />,
    back: (
      <>
        {limb("M96 190C20 210 -40 170 -44 96", -44, 96, -10, 16, 1.5)}
        {limb("M144 190C220 210 280 170 284 96", 284, 96, 10, 16, 1.5)}
        {limb("M100 140C60 96 10 70 -10 10", -10, 10, -22, 12, 1.3)}
        {limb("M140 140C180 96 230 70 250 10", 250, 10, 22, 12, 1.3)}
        {plot(-44, 62, false)}
        {plot(284, 62, true)}
        <path d="M120 206Q24 150 58 30Q130 60 120 206ZM120 206Q216 150 182 30Q110 60 120 206Z" fill={pal.body[1]} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
        {/* 땅 위를 기는 덩굴 */}
        <Tendril d="M120 214C60 226 0 206 -50 222M120 214C180 226 240 206 290 222" width={8} color={pal.body[1]} line={pal.line} light={pal.body[0]} />
      </>
    ),
    body: (
      <>
        <Ground line={pal.line} wide={100} />
        {bodyAt(132, 64, 60)}
      </>
    ),
    armor: (
      <>
        {/* 이끼 낀 나무 갑옷 */}
        <Plate d="M70 150 100 136 112 176 86 196Z" paint={paint} line="#2a1806" />
        <Plate d="M170 150 140 136 128 176 154 196Z" paint={paint} line="#2a1806" />
        {[52, 76, 164, 188].map((x, i) => (
          <Plate key={x} d={`M${x - 9} 216V${182 - (i % 2) * 8}L${x} ${166 - (i % 2) * 8}L${x + 9} ${182 - (i % 2) * 8}V216Z`} paint={paint} line="#2a1806" />
        ))}
      </>
    ),
    head: (
      <>
        <path d="M84 84 76 44 100 70ZM156 84 164 44 140 70Z" fill={pal.body[1]} stroke={pal.line} strokeWidth="2.6" strokeLinejoin="round" />
        <Eyes x={120} y={112} gap={46} w={21} h={10} tilt={26} color={pal.glow} paint={paint} />
        <Maw x={120} y={130} w={64} h={26} teeth={9} glow={pal.glow} />
      </>
    ),
    front: (
      <>
        <Flag x={14} y={216} h={50} />
        <Flag x={226} y={216} h={50} flip />
        <Motes at={[[30, 130], [210, 130], [70, 16], [170, 16], [120, -10], [0, 190], [240, 190]]} color={pal.glow} r={2.8} />
      </>
    ),
  };
};
