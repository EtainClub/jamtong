import { Aura, Eyes, Ground, Maw, Motes, Plate, thorn, type BossDraw, type Palette } from "./parts";

/**
 * 혐오 쐐기풀 — 닿기만 해도 따끔, 편을 갈라 번진다.
 * 1형 불꽃 잎 → 2형 불씨 쐐기풀(타는 갈기·그을린 갑옷) → 3형 갈라치는 쌍두 쐐기(몸이 둘로 갈라져 서로 다른 쪽을 본다).
 * 두 머리의 색은 불(주황)과 재(잿빛)다 — 어느 편의 색도 아니다.
 */
export const hatePal: [Palette, Palette, Palette] = [
  { body: ["#f08a3c", "#8a2a0c"], line: "#2c0c02", glow: "#ffc24a", metal: ["#5a4a44", "#1c1412"] },
  { body: ["#ff7a2a", "#7a1c06"], line: "#240802", glow: "#ffd23a", metal: ["#4a3a36", "#140c0a"] },
  { body: ["#ff5a1a", "#4a0e04"], line: "#160400", glow: "#ffe45a", metal: ["#3a2c2a", "#0c0606"] },
];

/** 불꽃 한 장. 아래 가운데가 (0, 0), 높이 h, 너비 w. */
function flame(w: number, h: number): string {
  return `M0 0C${-w * 0.7} ${-h * 0.12} ${-w * 0.62} ${-h * 0.5} ${-w * 0.3} ${-h * 0.74}L${-w * 0.2} ${-h * 0.56}L0 ${-h}L${w * 0.2} ${-h * 0.56}L${w * 0.3} ${-h * 0.74}C${w * 0.62} ${-h * 0.5} ${w * 0.7} ${-h * 0.12} 0 0Z`;
}

export const hate: BossDraw = (form, paint, pal) => {
  const leaf = (x: number, y: number, w: number, h: number, rot: number, fill: string, key: string) => (
    <path key={key} transform={`translate(${x} ${y}) rotate(${rot})`} d={flame(w, h)} fill={fill} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
  );
  const hairs = (list: Array<[number, number, number]>) =>
    list.map(([x, y, deg]) => <path key={`${x}-${y}`} d={thorn(x, y, deg, 12, 4)} fill={pal.glow} stroke={pal.line} strokeWidth=".8" />);

  if (form === 1) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={96} cy={132} />,
      back: (
        <>
          {leaf(104, 210, 70, 150, -32, pal.body[1], "l")}
          {leaf(136, 210, 70, 150, 32, pal.body[1], "r")}
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} />
          {leaf(120, 212, 96, 188, 0, paint.body, "c")}
          <path transform="translate(120 206)" d={flame(52, 120)} fill={pal.glow} opacity=".28" />
          {hairs([[70, 150, 200], [78, 118, 215], [170, 150, -20], [162, 118, -35], [120, 30, -90]])}
        </>
      ),
      head: (
        <>
          <Eyes x={120} y={128} gap={34} w={16} h={8} tilt={24} color={pal.glow} paint={paint} />
          <Maw x={120} y={148} w={44} h={20} teeth={6} />
        </>
      ),
    };
  }

  if (form === 2) {
    return {
      aura: <Aura paint={paint} glow={pal.glow} r={112} cy={124} rays={12} />,
      back: (
        <>
          {leaf(88, 214, 80, 176, -44, pal.body[1], "l2")}
          {leaf(152, 214, 80, 176, 44, pal.body[1], "r2")}
          {leaf(102, 212, 74, 196, -20, pal.body[0], "l")}
          {leaf(138, 212, 74, 196, 20, pal.body[0], "r")}
        </>
      ),
      body: (
        <>
          <Ground line={pal.line} wide={74} />
          {leaf(120, 214, 108, 214, 0, paint.body, "c")}
          <path transform="translate(120 208)" d={flame(60, 150)} fill={pal.glow} opacity=".3" />
          {hairs([[62, 150, 195], [70, 110, 215], [178, 150, -15], [170, 110, -35], [96, 60, 235], [144, 60, -55], [120, 6, -90]])}
        </>
      ),
      armor: (
        <>
          <Plate d="M84 150 120 138 156 150 148 190 120 202 92 190Z" paint={paint} line="#000" shine={false} />
          {/* 그을린 판의 금 — 안에서 불이 비친다 */}
          <path d="M100 152l10 16-6 12 12 14M140 154l-8 14 8 10-10 16M120 140v20" stroke={pal.glow} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      ),
      head: (
        <>
          <Eyes x={120} y={108} gap={38} w={18} h={9} tilt={26} color={pal.glow} paint={paint} />
          <Maw x={120} y={122} w={40} h={16} teeth={6} glow={pal.glow} />
        </>
      ),
      front: <Motes at={[[48, 90], [196, 84], [72, 40], [170, 34], [36, 150], [206, 146], [120, 228]]} color={pal.glow} r={2.6} />,
    };
  }

  // 3형 — 쌍두. 줄기가 가운데서 갈라지고 두 머리가 등을 돌린다.
  const head = (side: 1 | -1) => {
    const ash = side > 0;
    const fill = ash ? "#b8b0ac" : paint.body;
    const eye = ash ? "#e8f4ff" : pal.glow;
    return (
      <g key={side} transform={`translate(${120 + side * 44} 118) rotate(${side * 24})`}>
        <path d={flame(84, 124)} fill={fill} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
        <path transform="translate(0 -6)" d={flame(44, 74)} fill={ash ? "#fff" : pal.glow} opacity=".28" />
        <g transform="translate(-120 -176)">
          <Eyes x={120} y={112} gap={30} w={15} h={8} tilt={26} color={eye} paint={paint} />
          <Maw x={120} y={126} w={36} h={16} teeth={5} glow={ash ? undefined : pal.glow} />
        </g>
      </g>
    );
  };
  return {
    aura: <Aura paint={paint} glow={pal.glow} r={130} cy={116} rays={18} rune />,
    back: (
      <>
        {leaf(70, 216, 90, 190, -58, pal.body[1], "l3")}
        {leaf(170, 216, 90, 190, 58, "#3a3432", "r3")}
        {leaf(92, 214, 84, 214, -34, pal.body[0], "l2")}
        {leaf(148, 214, 84, 214, 34, "#6a625e", "r2")}
      </>
    ),
    body: (
      <>
        <Ground line={pal.line} wide={86} />
        <path d="M120 214C70 204 60 160 84 118L120 140 156 118C180 160 170 204 120 214Z" fill={paint.body} stroke={pal.line} strokeWidth="3" strokeLinejoin="round" />
        <path d="M120 214C170 204 180 160 156 118L120 140Z" fill="#4a4442" opacity=".8" />
      </>
    ),
    armor: (
      <>
        {/* 갈라진 금 — 가운데를 타고 빛이 샌다 */}
        <path d="M120 100l-8 22 12 14-10 22 10 18-6 28" stroke={pal.line} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M120 100l-8 22 12 14-10 22 10 18-6 28" stroke={pal.glow} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    head: (
      <>
        {head(-1)}
        {head(1)}
      </>
    ),
    front: <Motes at={[[30, 80], [212, 76], [60, 20], [182, 16], [20, 150], [222, 150], [120, 60], [100, 232], [150, 230]]} color={pal.glow} r={2.8} />,
  };
};
