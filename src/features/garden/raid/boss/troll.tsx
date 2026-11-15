import { Aura, Bubble, Eyes, Ground, Maw, Motes, Plate, star, Tendril, thorn, type BossDraw, type Palette } from "./parts";

/**
 * 악플 가시풀 — 익명 뒤에서 가시를 날린다.
 * 1형 가시 덩어리 → 2형 자판 갑주(키캡 갑옷·가시 채찍) → 3형 익명의 가시 군주(얼굴 없는 가면·말풍선 날개·가시관).
 */
export const trollPal: [Palette, Palette, Palette] = [
  { body: ["#e0596b", "#7a1626"], line: "#2e060d", glow: "#ff8a5c", metal: ["#d9dde6", "#5b6170"] },
  { body: ["#d2405a", "#5c0f22"], line: "#24040b", glow: "#ff6a3a", metal: ["#e6e9f0", "#4a5060"] },
  { body: ["#8c1f3c", "#2a0612"], line: "#120206", glow: "#ff3d6e", metal: ["#f1f1f5", "#6a6f80"] },
];

const KEYS = ["#", "@", "!", "ㅋ", "?"];

function Keycaps({ y, size, paint }: { y: number; size: number; paint: Parameters<BossDraw>[1] }) {
  const start = 120 - (KEYS.length * (size + 3) - 3) / 2;
  return (
    <g>
      {KEYS.map((k, i) => {
        const x = start + i * (size + 3);
        const dy = Math.abs(i - 2) * -3;
        return (
          <g key={k}>
            <rect x={x} y={y + dy} width={size} height={size} rx="4" fill={paint.metal} stroke="#1c1f28" strokeWidth="1.8" />
            <rect x={x + 2.5} y={y + dy + 2} width={size - 5} height={size - 7} rx="2.5" fill="#fff" opacity=".28" />
            <text x={x + size / 2} y={y + dy + size * 0.68} textAnchor="middle" fontSize={size * 0.56} fontWeight="900" fill="#1c1f28">
              {k}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export const troll: BossDraw = (form, paint, pal) => {
  const whip = (side: 1 | -1, lift: number) => {
    const x = (n: number) => 120 + side * n;
    const d = `M${x(40)} 168C${x(86)} 176 ${x(112)} ${150 - lift} ${x(98)} ${108 - lift}C${x(92)} ${88 - lift} ${x(112)} ${76 - lift} ${x(118)} ${92 - lift}`;
    return (
      <g key={side}>
        <Tendril d={d} width={8} color={pal.body[1]} line={pal.line} light={pal.body[0]} />
        {[
          [x(78), 170, side > 0 ? 60 : 120],
          [x(101), 146 - lift * 0.5, side > 0 ? 10 : 170],
          [x(99), 116 - lift, side > 0 ? -20 : 200],
          [x(104), 86 - lift, side > 0 ? -110 : -70],
        ].map(([tx, ty, deg]) => (
          <path key={`${tx}-${ty}`} d={thorn(tx, ty, deg, 13, 8)} fill={pal.body[0]} stroke={pal.line} strokeWidth="1.4" strokeLinejoin="round" />
        ))}
      </g>
    );
  };

  if (form === 1) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={92} cy={140} />,
      body: (
        <>
          <Ground line={pal.line} />
          <path d={star(120, 142, 46, 70, 16)} fill={paint.body} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
          <path d={star(120, 142, 34, 50, 16, 11)} fill={pal.body[0]} opacity=".45" />
        </>
      ),
      head: (
        <>
          <Eyes x={120} y={130} gap={36} w={17} h={8} color={pal.glow} paint={paint} />
          <Maw x={120} y={148} w={46} h={20} teeth={6} />
        </>
      ),
      front: (
        <>
          <Bubble x={44} y={66} text="#@!" fill="#fff" color="#7a1626" r={-14} />
          <Bubble x={196} y={58} text="ㅋㅋ" fill="#fff" color="#7a1626" r={12} />
        </>
      ),
    };
  }

  if (form === 2) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={108} cy={132} rays={14} />,
      back: (
        <>
          {whip(-1, 0)}
          {whip(1, 0)}
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} wide={72} />
          <path d={star(120, 134, 52, 80, 18)} fill={paint.body} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
          <path d={star(120, 134, 38, 56, 18, 10)} fill={pal.body[0]} opacity=".4" />
        </>
      ),
      armor: (
        <>
          <Plate d="M62 132 84 112 98 138 80 160Z" paint={paint} />
          <Plate d="M178 132 156 112 142 138 160 160Z" paint={paint} />
          <path d={thorn(66, 124, 215, 20, 10)} fill={paint.metal} stroke="#1c1f28" strokeWidth="1.6" />
          <path d={thorn(174, 124, -35, 20, 10)} fill={paint.metal} stroke="#1c1f28" strokeWidth="1.6" />
          <Keycaps y={164} size={19} paint={paint} />
        </>
      ),
      head: (
        <>
          <path d={thorn(98, 96, 250, 28, 13)} fill={pal.body[1]} stroke={pal.line} strokeWidth="2" strokeLinejoin="round" />
          <path d={thorn(142, 96, -70, 28, 13)} fill={pal.body[1]} stroke={pal.line} strokeWidth="2" strokeLinejoin="round" />
          <Eyes x={120} y={120} gap={40} w={19} h={9} tilt={22} color={pal.glow} paint={paint} />
          <Maw x={120} y={138} w={52} h={22} teeth={7} glow={pal.glow} />
        </>
      ),
      front: (
        <>
          <Bubble x={34} y={50} text="#@!" fill="#1c1f28" color="#ff9a7a" r={-16} />
          <Bubble x={206} y={44} text="ㅋㅋ" fill="#1c1f28" color="#ff9a7a" r={14} />
          <Motes at={[[52, 104], [190, 96], [120, 54], [70, 196], [176, 190]]} color={pal.glow} />
        </>
      ),
    };
  }

  // 3형 — 익명의 가시 군주. 얼굴이 없다: 금 간 가면과 눈빛뿐.
  const wing = (side: 1 | -1) => {
    const x = (n: number) => 120 + side * n;
    return (
      <g key={`wing${side}`}>
        <path
          d={`M${x(34)} 150L${x(70)} 96L${x(62)} 60L${x(104)} 34L${x(150)} 22L${x(138)} 62L${x(160)} 78L${x(132)} 104L${x(146)} 128L${x(108)} 138L${x(112)} 164L${x(72)} 160Z`}
          fill="#16070d"
          stroke={pal.glow}
          strokeWidth="2.4"
          strokeLinejoin="round"
          opacity=".94"
        />
        <text x={x(104)} y={70} textAnchor="middle" fontSize="18" fontWeight="900" fill={pal.glow} opacity=".85">
          {side < 0 ? "#@!" : "ㅋㅋ"}
        </text>
        <text x={x(98)} y={118} textAnchor="middle" fontSize="15" fontWeight="900" fill={pal.glow} opacity=".6">
          {side < 0 ? "ㅉㅉ" : "?!"}
        </text>
      </g>
    );
  };
  return {
    aura: <Aura paint={paint} glow={pal.glow} r={128} cy={118} rays={20} rune />,
    back: (
      <>
        {wing(-1)}
        {wing(1)}
        {whip(-1, 14)}
        {whip(1, 14)}
      </>
    ),
    body: (
      <>
        <Ground line={pal.line} wide={84} />
        <path d={star(120, 140, 54, 86, 22)} fill={paint.body} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
        <path d={star(120, 140, 40, 60, 22, 8)} fill={pal.body[0]} opacity=".35" />
      </>
    ),
    armor: (
      <>
        <Plate d="M52 142 78 110 100 140 84 176Z" paint={paint} />
        <Plate d="M188 142 162 110 140 140 156 176Z" paint={paint} />
        <path d={thorn(58, 128, 220, 30, 12)} fill={paint.metal} stroke="#1c1f28" strokeWidth="1.6" />
        <path d={thorn(182, 128, -40, 30, 12)} fill={paint.metal} stroke="#1c1f28" strokeWidth="1.6" />
        <Keycaps y={172} size={22} paint={paint} />
      </>
    ),
    head: (
      <>
        {/* 가시관 */}
        {[-60, -36, -12, 12, 36, 60].map((a, i) => (
          <path key={a} d={thorn(120 + a * 0.62, 78 + Math.abs(a) * 0.14, -90 + a * 0.7, i % 2 ? 30 : 40, 12)} fill={pal.body[1]} stroke={pal.glow} strokeWidth="1.6" strokeLinejoin="round" />
        ))}
        {/* 가면 */}
        <path d="M120 74C146 74 154 96 152 118C150 142 134 160 120 164C106 160 90 142 88 118C86 96 94 74 120 74Z" fill="#efe9e4" stroke="#12060a" strokeWidth="2.6" />
        <path d="M120 74C146 74 154 96 152 118C150 142 134 160 120 164Z" fill="#b9aeb0" opacity=".55" />
        <path d="M120 76l-4 16 6 8-5 14M140 132l-8 8 3 10" stroke="#12060a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <Eyes x={120} y={114} gap={30} w={15} h={5} tilt={14} color={pal.glow} paint={paint} core="#ffe3ea" />
      </>
    ),
    front: (
      <>
        <Motes at={[[40, 120], [202, 112], [120, 30], [58, 200], [186, 198], [28, 60], [214, 70]]} color={pal.glow} r={2.6} />
      </>
    ),
  };
};
