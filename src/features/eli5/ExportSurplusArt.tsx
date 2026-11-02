/**
 * 경상수지 세계 2위·수출 1조 달러 — 쉬운 설명 삽화.
 *
 * 막대 길이는 실제 비율대로 그린다. 쉬운 설명이라고 길이를 과장하면 그림이
 * 숫자보다 큰 말을 하게 된다.
 */

const LABEL = { fontFamily: "inherit", fontWeight: 800 } as const;
const NUM = { fontVariantNumeric: "tabular-nums" } as const;

/** 1년 전 284억 → 올해 1,166억. 같은 눈금. */
export function EsJump() {
  const base = 196;
  const scale = 140 / 1166;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="2025년 2분기 284억 달러와 2026년 2분기 1,166억 달러 막대 비교">
      <line x1={40} x2={280} y1={base} y2={base} stroke="var(--stone)" strokeWidth={2} />
      <rect x={70} y={base - 284 * scale} width={64} height={284 * scale} rx={6} fill="var(--graphite)" opacity={0.6} />
      <rect x={186} y={base - 140} width={64} height={140} rx={6} fill="var(--navy)" />
      <text x={102} y={base - 284 * scale - 8} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--smoke)" style={NUM}>284억</text>
      <text x={218} y={base - 148} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--navy)" style={NUM}>1,166억</text>
      <text x={102} y={218} textAnchor="middle" fontSize={12} fill="var(--ash)">작년 2분기</text>
      <text x={218} y={218} textAnchor="middle" fontSize={12} fill="var(--ink)">올해 2분기</text>
    </svg>
  );
}

/** 시상대: 중국 1, 한국 2. 3위는 이 자료로 말하지 않으므로 비워 둔다. */
export function EsRank() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="시상대 1등 중국, 2등 한국">
      <rect x={120} y={92} width={80} height={110} rx={6} fill="var(--graphite)" opacity={0.55} />
      <rect x={40} y={132} width={80} height={70} rx={6} fill="var(--navy)" />
      <rect x={200} y={162} width={80} height={40} rx={6} fill="none" stroke="var(--stone)" strokeWidth={2} strokeDasharray="5 4" />
      <text x={160} y={150} textAnchor="middle" fontSize={30} {...LABEL} fill="var(--canvas)">1</text>
      <text x={80} y={176} textAnchor="middle" fontSize={30} {...LABEL} fill="var(--canvas)">2</text>
      <text x={160} y={80} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">중국</text>
      <text x={80} y={120} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--navy)">한국</text>
      <text x={160} y={226} textAnchor="middle" fontSize={12} fill="var(--ash)">36개국 · 2026년 2분기 경상흑자</text>
    </svg>
  );
}

/** 독일+일본을 이어 붙인 막대가 한국 막대에 못 미친다. */
export function EsDeJp() {
  const scale = 240 / 1166;
  const de = 523 * scale;
  const jp = 506 * scale;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="한국 1,166억 달러 막대가 독일 523억과 일본 506억을 이어 붙인 막대보다 길다">
      <text x={40} y={66} fontSize={13} {...LABEL} fill="var(--navy)">한국</text>
      <rect x={40} y={74} width={240} height={30} rx={8} fill="var(--navy)" />
      <text x={40} y={140} fontSize={13} {...LABEL} fill="var(--ink)">독일 + 일본</text>
      <rect x={40} y={148} width={de} height={30} rx={8} fill="var(--graphite)" opacity={0.7} />
      <rect x={40 + de} y={148} width={jp} height={30} rx={8} fill="var(--ash)" opacity={0.7} />
      <line x1={280} x2={280} y1={66} y2={190} stroke="var(--navy)" strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={160} y={214} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">137억 달러 더 커요</text>
    </svg>
  );
}

/** 1조 달러 문턱까지 93%. 남은 칸은 점선. */
export function EsTrillion() {
  const x0 = 30;
  const full = 260;
  const done = full * 0.93;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="1조 달러 막대 가운데 9,300억 달러가 찼고 700억 달러가 남음">
      <rect x={x0} y={100} width={full} height={40} rx={10} fill="none" stroke="var(--pending)" strokeWidth={2} strokeDasharray="6 5" />
      <rect x={x0} y={100} width={done} height={40} rx={10} fill="var(--navy)" />
      <line x1={x0 + full} x2={x0 + full} y1={78} y2={162} stroke="var(--ink)" strokeWidth={2} />
      <text x={x0 + full} y={70} textAnchor="end" fontSize={14} {...LABEL} fill="var(--ink)">1조 달러</text>
      <text x={x0 + 12} y={126} fontSize={15} {...LABEL} fill="var(--canvas)" style={NUM}>9,300억</text>
      <text x={x0 + full} y={184} textAnchor="end" fontSize={13} {...LABEL} fill="var(--pending)" style={NUM}>남은 700억</text>
      <text x={160} y={220} textAnchor="middle" fontSize={12} fill="var(--ash)">1~10월 누적 · 11월 중 달성 예상</text>
    </svg>
  );
}

/** 10월 수출을 반으로 가른 막대. 왼쪽 절반이 반도체. */
export function EsChip() {
  const x0 = 30;
  const full = 260;
  const chip = full * (564.4 / 1152.8);
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="10월 수출 1,153억 달러 가운데 반도체 564억 달러가 절반 가까이">
      <text x={160} y={62} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">10월 수출 1,153억 달러</text>
      <rect x={x0} y={90} width={full} height={52} rx={10} fill="var(--stone)" />
      <rect x={x0} y={90} width={chip} height={52} rx={10} fill="var(--burgundy)" />
      <text x={x0 + chip / 2} y={122} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--canvas)">반도체</text>
      <text x={x0 + chip + (full - chip) / 2} y={122} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">그 밖의 품목</text>
      <text x={x0 + chip / 2} y={170} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--burgundy)" style={NUM}>564억 · 약 49%</text>
      <text x={160} y={214} textAnchor="middle" fontSize={12} fill="var(--ash)">1년 전보다 259.4% 늘었어요</text>
    </svg>
  );
}
