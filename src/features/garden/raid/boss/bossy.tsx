import { Aura, Crown, Eyes, Ground, Maw, Motes, Plate, star, thorn, type BossDraw, type Palette } from "./parts";

/**
 * 갑질 엉겅퀴 — 높은 자리에서 남을 짓누른다.
 * 1형 엉겅퀴 → 2형 왕관 엉겅퀴(금관·어깨 갑옷·홀) → 3형 옥좌의 폭군(옥좌와 망토, 그림판 위로 솟는 키).
 */
export const bossyPal: [Palette, Palette, Palette] = [
  { body: ["#6aa84a", "#1f4a1c"], line: "#081a08", glow: "#c890ff", metal: ["#ffe58a", "#a87a10"] },
  { body: ["#5a9a40", "#173c16"], line: "#061406", glow: "#d48aff", metal: ["#ffec9a", "#a07000"] },
  { body: ["#3f7a34", "#0c2a10"], line: "#030c04", glow: "#e070ff", metal: ["#fff2b0", "#986400"] },
];

export const bossy: BossDraw = (form, paint, pal) => {
  /** 가시 돋은 팔(잎). side=-1이 왼쪽. */
  const arm = (side: 1 | -1, reach: number, y: number, drop: number) => {
    const x = (n: number) => 120 + side * n;
    return (
      <path
        key={`${side}-${reach}`}
        d={`M${x(8)} ${y + 34}L${x(reach)} ${y + drop}L${x(reach - 18)} ${y + drop - 10}L${x(reach - 6)} ${y + drop - 30}L${x(reach - 28)} ${y + drop - 26}L${x(reach - 22)} ${y + drop - 50}L${x(reach - 46)} ${y + drop - 34}L${x(reach - 50)} ${y - 6}L${x(10)} ${y + 10}Z`}
        fill={paint.body}
        stroke={pal.line}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    );
  };
  const bloom = (cy: number, r: number) => (
    <>
      <path d={star(120, cy, r * 0.78, r * 1.16, 18)} fill={pal.body[1]} stroke={pal.line} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="120" cy={cy} r={r * 0.84} fill={paint.body} stroke={pal.line} strokeWidth="3" />
      <ellipse cx={120 - r * 0.24} cy={cy - r * 0.38} rx={r * 0.36} ry={r * 0.2} fill="#fff" opacity=".14" />
    </>
  );
  const stem = (top: number, w: number) => <path d={`M${120 - w / 2} 212L${120 - w / 3} ${top}H${120 + w / 3}L${120 + w / 2} 212Z`} fill={pal.body[1]} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />;

  if (form === 1) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={96} cy={120} />,
      back: (
        <>
          {arm(-1, 86, 134, 6)}
          {arm(1, 86, 134, 6)}
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} />
          {stem(120, 22)}
          {bloom(104, 42)}
        </>
      ),
      head: (
        <>
          {/* 꽃머리 — 왕관을 닮은 보랏빛 꽃 */}
          <path d="M84 70 90 30 104 56 120 20 136 56 150 30 156 70Z" fill="#9b4fd1" stroke="#2c0c4a" strokeWidth="2.6" strokeLinejoin="round" />
          <Eyes x={120} y={98} gap={34} w={16} h={8} color={pal.glow} paint={paint} />
          <Maw x={120} y={114} w={40} h={16} teeth={6} />
        </>
      ),
    };
  }

  if (form === 2) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={112} cy={112} rays={14} />,
      back: (
        <>
          {arm(-1, 104, 128, 0)}
          {arm(1, 104, 128, 0)}
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} wide={72} />
          {stem(120, 30)}
          {bloom(98, 50)}
        </>
      ),
      armor: (
        <>
          <Plate d="M58 128 96 116 100 150 72 160Z" paint={paint} />
          <Plate d="M182 128 144 116 140 150 168 160Z" paint={paint} />
          <path d={thorn(64, 122, 230, 22, 10)} fill={paint.metal} stroke="#2a1c08" strokeWidth="1.6" />
          <path d={thorn(176, 122, -50, 22, 10)} fill={paint.metal} stroke="#2a1c08" strokeWidth="1.6" />
          {/* 홀 */}
          <path d="M206 210 196 70" stroke="#2a1c08" strokeWidth="9" strokeLinecap="round" />
          <path d="M206 210 196 70" stroke={pal.metal[0]} strokeWidth="5" strokeLinecap="round" />
          <circle cx="195" cy="58" r="13" fill={paint.glow} />
          <circle cx="195" cy="58" r="9" fill={pal.glow} stroke="#2a1c08" strokeWidth="2" />
        </>
      ),
      head: (
        <>
          <Crown x={120} y={62} w={78} h={50} paint={paint} gem={pal.glow} />
          <Eyes x={120} y={92} gap={38} w={18} h={9} tilt={22} color={pal.glow} paint={paint} />
          <Maw x={120} y={110} w={46} h={18} teeth={7} glow={pal.glow} />
        </>
      ),
      front: <Motes at={[[40, 60], [70, 20], [170, 16], [30, 180], [214, 30]]} color={pal.glow} />,
    };
  }

  // 3형 — 옥좌의 폭군. 옥좌 등받이와 왕관이 그림판 위로 솟는다.
  return {
    aura: <Aura paint={paint} glow={pal.glow} r={132} cy={104} rays={20} rune />,
    back: (
      <>
        {/* 옥좌 */}
        <path d="M52 214V12L70 -22 88 12 104 -8 120 -44 136 -8 152 12 170 -22 188 12V214Z" fill="#241432" stroke={pal.glow} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M66 214V30h108v184" fill="none" stroke={pal.glow} strokeWidth="1.6" opacity=".5" />
        <path d={star(120, -14, 5, 11, 4)} fill={pal.glow} />
        {/* 망토 */}
        <path d="M70 110C20 130 4 176 -8 214H248C236 176 220 130 170 110Z" fill="#3a1450" stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
        <path d="M70 110C40 150 30 190 28 214M170 110C200 150 210 190 212 214" stroke="#000" strokeWidth="2" opacity=".35" fill="none" />
        {arm(-1, 122, 112, 28)}
        {arm(1, 122, 112, 28)}
      </>
    ),
    body: (
      <>
        <Ground line={pal.line} wide={96} />
        {stem(110, 46)}
        {bloom(86, 58)}
      </>
    ),
    armor: (
      <>
        <Plate d="M44 116 96 98 102 146 60 160Z" paint={paint} />
        <Plate d="M196 116 144 98 138 146 180 160Z" paint={paint} />
        <path d={thorn(52, 108, 235, 34, 13)} fill={paint.metal} stroke="#2a1c08" strokeWidth="1.8" />
        <path d={thorn(188, 108, -55, 34, 13)} fill={paint.metal} stroke="#2a1c08" strokeWidth="1.8" />
        <Plate d="M92 150 120 140 148 150 142 196 120 208 98 196Z" paint={paint} />
        <path d={star(120, 174, 7, 15, 4)} fill={pal.glow} stroke="#2a1c08" strokeWidth="1.4" />
      </>
    ),
    head: (
      <>
        <Crown x={120} y={46} w={104} h={70} paint={paint} gem={pal.glow} />
        <Eyes x={120} y={80} gap={44} w={21} h={10} tilt={26} color={pal.glow} paint={paint} />
        <Maw x={120} y={100} w={56} h={22} teeth={8} glow={pal.glow} />
      </>
    ),
    front: <Motes at={[[20, 80], [220, 80], [36, 10], [204, 10], [14, 170], [226, 170], [120, 228]]} color={pal.glow} r={2.8} />,
  };
};
