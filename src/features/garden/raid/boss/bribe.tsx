import { Aura, Eyes, Ground, Maw, Motes, Plate, Tendril, thorn, type BossDraw, type Paint, type Palette } from "./parts";

/**
 * 검은돈 독초 — 탁자 밑으로 오가는 돈에 뿌리를 내린다.
 * 1형 독초(검은 잎·금화) → 2형 금고 독초(금고 문 가슴·금 어깨) → 3형 황금 가면 독룡(목을 세운 뱀, 금 가면, 지폐 날개).
 */
export const bribePal: [Palette, Palette, Palette] = [
  { body: ["#5a6e3c", "#1a2210"], line: "#060a02", glow: "#ffd84a", metal: ["#ffe98a", "#a8780a"] },
  { body: ["#4a5e30", "#121a0a"], line: "#040702", glow: "#ffcf2a", metal: ["#fff0a0", "#a06c00"] },
  { body: ["#34442a", "#0a0f06"], line: "#020400", glow: "#ffc400", metal: ["#fff4b0", "#9a6200"] },
];

function Coin({ x, y, r, paint }: { x: number; y: number; r: number; paint: Paint }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={paint.metal} stroke="#4a3200" strokeWidth="1.8" />
      <circle cx={x} cy={y} r={r * 0.72} fill="none" stroke="#4a3200" strokeWidth="1" opacity=".6" />
      <text x={x} y={y + r * 0.4} textAnchor="middle" fontSize={r * 1.15} fontWeight="900" fill="#4a3200">
        ₩
      </text>
    </g>
  );
}

export const bribe: BossDraw = (form, paint, pal) => {
  const leaf = (d: string, fill: string) => <path key={d} d={d} fill={fill} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />;

  if (form === 1) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={94} cy={140} />,
      back: (
        <>
          {leaf("M114 206Q36 198 26 130Q80 118 112 182Z", pal.body[1])}
          {leaf("M126 206Q204 198 214 130Q160 118 128 182Z", pal.body[1])}
          {leaf("M120 200Q60 140 92 66Q136 104 120 200Z", pal.body[0])}
          {leaf("M120 200Q180 140 148 66Q104 104 120 200Z", pal.body[0])}
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} />
          <ellipse cx="120" cy="146" rx="42" ry="40" fill={paint.body} stroke={pal.line} strokeWidth="3" />
        </>
      ),
      head: (
        <>
          {/* 선글라스 — 눈빛이 유리 너머로 샌다 */}
          <path d="M84 126h30l3 5h6l3-5h30v9q-2 16-17 16t-17-14h-4q-2 14-17 14t-17-16Z" fill="#08080a" stroke="#000" strokeWidth="1.6" />
          <path d="M90 130l12 0-8 10ZM130 130l12 0-8 10Z" fill={pal.glow} opacity=".7" />
          <Maw x={120} y={160} w={38} h={14} teeth={5} />
        </>
      ),
      front: (
        <>
          <Coin x={46} y={112} r={13} paint={paint} />
          <Coin x={194} y={112} r={13} paint={paint} />
          <Coin x={92} y={52} r={12} paint={paint} />
          <Coin x={152} y={48} r={12} paint={paint} />
        </>
      ),
    };
  }

  if (form === 2) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={110} cy={134} rays={12} />,
      back: (
        <>
          {leaf("M112 208Q20 200 8 118Q76 104 110 180Z", pal.body[1])}
          {leaf("M128 208Q220 200 232 118Q164 104 130 180Z", pal.body[1])}
          {leaf("M120 200Q48 134 86 40Q140 90 120 200Z", pal.body[0])}
          {leaf("M120 200Q192 134 154 40Q100 90 120 200Z", pal.body[0])}
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} wide={74} />
          <ellipse cx="120" cy="146" rx="52" ry="52" fill={paint.body} stroke={pal.line} strokeWidth="3" />
        </>
      ),
      armor: (
        <>
          {/* 금고 문 */}
          <circle cx="120" cy="164" r="30" fill={paint.metal} stroke="#3a2600" strokeWidth="2.6" />
          <circle cx="120" cy="164" r="22" fill="none" stroke="#3a2600" strokeWidth="1.6" strokeDasharray="3 5" />
          <g stroke="#3a2600" strokeWidth="4" strokeLinecap="round">
            <path d="M120 148v32M104 164h32M109 153l22 22M131 153l-22 22" />
          </g>
          <circle cx="120" cy="164" r="6" fill="#3a2600" />
          <Plate d="M60 126 92 110 96 142 70 152Z" paint={paint} line="#3a2600" />
          <Plate d="M180 126 148 110 144 142 170 152Z" paint={paint} line="#3a2600" />
        </>
      ),
      head: (
        <>
          <path d="M82 104h32l3 5h6l3-5h32v9q-2 17-18 17t-18-15h-4q-2 15-18 15t-18-17Z" fill="#08080a" stroke={pal.glow} strokeWidth="1.6" />
          <path d="M88 108l14 0-9 12ZM130 108l14 0-9 12Z" fill={pal.glow} />
          <Maw x={120} y={128} w={30} h={10} teeth={5} glow={pal.glow} />
        </>
      ),
      front: (
        <>
          <Coin x={30} y={96} r={14} paint={paint} />
          <Coin x={210} y={96} r={14} paint={paint} />
          <Coin x={86} y={24} r={12} paint={paint} />
          <Coin x={156} y={20} r={12} paint={paint} />
          <Motes at={[[52, 60], [188, 56], [120, 6], [40, 180], [200, 180]]} color={pal.glow} />
        </>
      ),
    };
  }

  // 3형 — 황금 가면 독룡. 똬리 튼 몸에서 목이 솟고, 머리는 금 가면이다.
  const neck = "M120 196C60 190 52 142 96 130C150 116 168 92 132 70C112 58 108 40 120 28";
  const wing = (side: 1 | -1) => {
    const x = (n: number) => 120 + side * n;
    return (
      <g key={side}>
        <path
          d={`M${x(30)} 128L${x(92)} 40L${x(150)} 10L${x(140)} 58L${x(156)} 96L${x(128)} 104L${x(134)} 142L${x(96)} 136L${x(84)} 164Z`}
          fill="#16200e"
          stroke={pal.glow}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d={`M${x(30)} 128L${x(150)} 10M${x(52)} 118L${x(156)} 96M${x(60)} 140L${x(134)} 142`} stroke={pal.glow} strokeWidth="1.4" opacity=".6" fill="none" />
        <text x={x(110)} y={72} textAnchor="middle" fontSize="22" fontWeight="900" fill={pal.glow} opacity=".8">
          ₩
        </text>
      </g>
    );
  };
  return {
    aura: <Aura paint={paint} glow={pal.glow} r={130} cy={112} rays={20} rune />,
    back: (
      <>
        {wing(-1)}
        {wing(1)}
      </>
    ),
    body: (
      <>
        <Ground line={pal.line} wide={88} />
        {/* 똬리 */}
        <ellipse cx="120" cy="190" rx="70" ry="24" fill={paint.body} stroke={pal.line} strokeWidth="3" />
        <ellipse cx="120" cy="174" rx="50" ry="18" fill={pal.body[0]} stroke={pal.line} strokeWidth="3" />
        <Tendril d={neck} width={30} color={pal.body[1]} line={pal.line} light={pal.body[0]} />
      </>
    ),
    armor: (
      <>
        {/* 금화 비늘 */}
        {[[78, 150], [104, 130], [134, 116], [152, 94], [138, 74], [118, 52], [86, 186], [120, 194], [154, 186]].map(([x, y]) => (
          <Coin key={`${x}-${y}`} x={x} y={y} r={9} paint={paint} />
        ))}
      </>
    ),
    head: (
      <g transform="translate(0 -6)">
        <path d={thorn(96, 14, 235, 40, 14)} fill={paint.metal} stroke="#3a2600" strokeWidth="2" strokeLinejoin="round" />
        <path d={thorn(144, 14, -55, 40, 14)} fill={paint.metal} stroke="#3a2600" strokeWidth="2" strokeLinejoin="round" />
        {/* 금 가면 — 각진 용의 얼굴 */}
        <path d="M120 -2L156 12 162 40 144 66 120 78 96 66 78 40 84 12Z" fill={paint.metal} stroke="#3a2600" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M120 -2L156 12 162 40 144 66 120 78Z" fill="#7a5200" opacity=".35" />
        <path d="M120 4v20M104 60l16 8 16-8" stroke="#3a2600" strokeWidth="1.6" fill="none" />
        <Eyes x={120} y={36} gap={36} w={15} h={7} tilt={26} color="#ff5a2a" paint={paint} />
        <path d="M108 58h24" stroke="#3a2600" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    ),
    front: <Motes at={[[30, 190], [210, 190], [20, 60], [220, 60], [60, 226], [180, 226], [120, 232]]} color={pal.glow} r={3} />,
  };
};
