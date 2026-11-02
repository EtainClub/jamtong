/**
 * 외국인 관광객 역대 최다 · 출생아 반등 — 쉬운 설명 삽화.
 *
 * 막대 길이는 실제 비율대로 그린다. 쉬운 설명이라고 길이를 과장하면 그림이
 * 숫자보다 큰 말을 하게 된다.
 */

const LABEL = { fontFamily: "inherit", fontWeight: 800 } as const;
const NUM = { fontVariantNumeric: "tabular-nums" } as const;

/* ───────────── 외국인 관광객 ───────────── */

/** 작년 12달 막대와 올해 10달 막대가 같은 높이에 닿는다. */
export function TrRecord() {
  const months = (n: number, y: number, fill: string) =>
    Array.from({ length: 12 }, (_, i) => (
      <rect key={`${y}-${i}`} x={40 + i * 20} y={y} width={16} height={26} rx={3}
            fill={i < n ? fill : "none"} stroke={i < n ? "none" : "var(--stone)"} strokeDasharray="3 3" />
    ));
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="작년 열두 달 동안 온 관광객 수를 올해는 열 달 만에 넘음">
      <text x={40} y={62} fontSize={13} {...LABEL} fill="var(--smoke)">2025년 1년</text>
      {months(12, 70, "var(--graphite)")}
      <text x={40} y={136} fontSize={13} {...LABEL} fill="var(--navy)">2026년 10월 27일까지</text>
      {months(10, 144, "var(--navy)")}
      <line x1={280} x2={280} y1={60} y2={180} stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={160} y={214} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)" style={NUM}>1,894만 명을 넘었어요</text>
    </svg>
  );
}

/** 0선을 가운데 두고 위로 오른 나라, 아래로 내린 나라. */
export function TrNeighbors() {
  const zero = 132;
  const k = 3.4;
  const rows = [
    { label: "한국", v: 21.5, fill: "var(--navy)" },
    { label: "베트남", v: 14.5, fill: "var(--graphite)" },
    { label: "일본", v: -2.9, fill: "var(--burgundy)" },
    { label: "태국", v: -3.8, fill: "var(--burgundy)" },
  ];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="1~9월 방문객 증감률. 한국 21.5% 증가, 베트남 14.5% 증가, 일본 2.9% 감소, 태국 3.8% 감소">
      <line x1={24} x2={296} y1={zero} y2={zero} stroke="var(--stone)" strokeWidth={2} />
      {rows.map((r, i) => {
        const x = 46 + i * 66;
        const h = Math.abs(r.v) * k;
        const y = r.v >= 0 ? zero - h : zero;
        return (
          <g key={r.label}>
            <rect x={x} y={y} width={40} height={h} rx={4} fill={r.fill} />
            <text x={x + 20} y={r.v >= 0 ? y - 7 : y + h + 16} textAnchor="middle" fontSize={12} {...LABEL}
                  fill={r.fill} style={NUM}>{r.v > 0 ? "+" : ""}{r.v}%</text>
            <text x={x + 20} y={208} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">{r.label}</text>
          </g>
        );
      })}
      <text x={160} y={232} textAnchor="middle" fontSize={11} fill="var(--ash)">2026년 1~9월 · 전년 대비</text>
    </svg>
  );
}

/** 카드 지출 10.8조 → 15.9조. */
export function TrSpend() {
  const base = 190;
  const k = 140 / 15.9;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="외국인 카드 소비 1~9월 10.8조 원에서 15.9조 원으로">
      <line x1={50} x2={270} y1={base} y2={base} stroke="var(--stone)" strokeWidth={2} />
      <rect x={80} y={base - 10.8 * k} width={60} height={10.8 * k} rx={6} fill="var(--graphite)" opacity={0.6} />
      <rect x={180} y={base - 140} width={60} height={140} rx={6} fill="var(--burgundy)" />
      <text x={110} y={base - 10.8 * k - 8} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--smoke)" style={NUM}>10.8조</text>
      <text x={210} y={base - 148} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--burgundy)" style={NUM}>15.9조</text>
      <text x={110} y={212} textAnchor="middle" fontSize={12} fill="var(--ash)">2025년 1~9월</text>
      <text x={210} y={212} textAnchor="middle" fontSize={12} fill="var(--ink)">2026년 1~9월</text>
    </svg>
  );
}

/** 지방 공항·항만으로 바로 들어오는 사람. */
export function TrRegion() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="수도권이 아닌 공항과 항만 입국 외국인 374만 명에서 482만 명으로">
      <rect x={40} y={70} width={240} height={34} rx={8} fill="var(--stone)" />
      <rect x={40} y={70} width={240 * (374 / 482)} height={34} rx={8} fill="var(--graphite)" opacity={0.65} />
      <text x={48} y={60} fontSize={13} {...LABEL} fill="var(--smoke)">2025년 1~9월</text>
      <text x={40 + 240 * (374 / 482) - 8} y={92} textAnchor="end" fontSize={13} {...LABEL} fill="var(--canvas)" style={NUM}>374만</text>
      <text x={48} y={142} fontSize={13} {...LABEL} fill="var(--navy)">2026년 1~9월</text>
      <rect x={40} y={152} width={240} height={34} rx={8} fill="var(--navy)" />
      <text x={272} y={174} textAnchor="end" fontSize={14} {...LABEL} fill="var(--canvas)" style={NUM}>482만</text>
      <text x={160} y={218} textAnchor="middle" fontSize={12} fill="var(--ash)">비수도권 공항·항만 입국</text>
    </svg>
  );
}

/** 문 세 개가 차례로 열린다. 마지막 문은 연말 기한. */
export function TrVisa() {
  const doors = [
    { label: "중국 단체", note: "25.9", open: true },
    { label: "동남아 복수", note: "26.3", open: true },
    { label: "인니 단체", note: "26.5", open: true },
  ];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="중국 단체 무비자, 동남아 복수비자 완화, 인도네시아 단체 무비자 시범 세 개의 문이 열림">
      {doors.map((d, i) => {
        const x = 30 + i * 92;
        return (
          <g key={d.label}>
            <rect x={x} y={60} width={76} height={110} rx={6} fill="var(--navy-tint)" stroke="var(--navy)" strokeWidth={2} />
            <path d={`M${x} 60 L${x + 30} 74 V184 L${x} 170 Z`} fill="var(--navy)" />
            <text x={x + 38} y={196} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--ink)">{d.label}</text>
            <text x={x + 38} y={214} textAnchor="middle" fontSize={11} fill="var(--ash)" style={NUM}>{d.note}</text>
          </g>
        );
      })}
      <text x={160} y={40} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">비자 문턱을 낮췄어요</text>
    </svg>
  );
}

/* ───────────── 출생아 ───────────── */

/** 26개의 작은 막대가 모두 기준선 위에 선다. */
export function BrStreak() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="2024년 7월부터 26개월 동안 매달 전년보다 많이 태어남">
      <line x1={20} x2={300} y1={160} y2={160} stroke="var(--ink)" strokeWidth={1.5} />
      <text x={22} y={180} fontSize={11} fill="var(--ash)">작년 같은 달</text>
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={i} x={24 + i * 10.5} y={130} width={7} height={30} rx={2} fill="var(--navy)" opacity={0.45 + (i / 26) * 0.55} />
      ))}
      <text x={24} y={118} fontSize={11} {...LABEL} fill="var(--smoke)">24.7</text>
      <text x={296} y={118} textAnchor="end" fontSize={11} {...LABEL} fill="var(--navy)">26.8</text>
      <text x={160} y={70} textAnchor="middle" fontSize={17} {...LABEL} fill="var(--ink)">26개월 연속 ↑</text>
      <text x={160} y={214} textAnchor="middle" fontSize={11} fill="var(--ash)">막대 하나 = 한 달 · 높이는 도식</text>
    </svg>
  );
}

/** 8월 출생아: 2019년과 2026년. */
export function BrAug() {
  const base = 186;
  const k = 140 / 24371;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="8월 출생아 2019년 2만 4,371명과 2026년 2만 3,703명">
      <line x1={50} x2={270} y1={base} y2={base} stroke="var(--stone)" strokeWidth={2} />
      <rect x={80} y={base - 140} width={60} height={140} rx={6} fill="var(--graphite)" opacity={0.55} />
      <rect x={180} y={base - 23703 * k} width={60} height={23703 * k} rx={6} fill="var(--navy)" />
      <text x={110} y={base - 148} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--smoke)" style={NUM}>24,371</text>
      <text x={210} y={base - 23703 * k - 8} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--navy)" style={NUM}>23,703</text>
      <text x={110} y={208} textAnchor="middle" fontSize={12} fill="var(--ash)">2019년 8월</text>
      <text x={210} y={208} textAnchor="middle" fontSize={12} fill="var(--ink)">2026년 8월</text>
      <text x={160} y={230} textAnchor="middle" fontSize={11} fill="var(--ash)">그 사이 해의 8월은 모두 이보다 적었어요</text>
    </svg>
  );
}

/** 1~8월 누적: 16.9만 → 19.4만. */
export function BrCum() {
  const k = 240 / 193783;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="1~8월 누적 출생아 16만 9,211명에서 19만 3,783명으로 14.5% 증가">
      <text x={40} y={66} fontSize={13} {...LABEL} fill="var(--smoke)">2025년 1~8월</text>
      <rect x={40} y={74} width={169211 * k} height={30} rx={8} fill="var(--graphite)" opacity={0.6} />
      <text x={40 + 169211 * k - 8} y={95} textAnchor="end" fontSize={12} {...LABEL} fill="var(--canvas)" style={NUM}>169,211</text>
      <text x={40} y={140} fontSize={13} {...LABEL} fill="var(--navy)">2026년 1~8월</text>
      <rect x={40} y={148} width={240} height={30} rx={8} fill="var(--navy)" />
      <text x={272} y={169} textAnchor="end" fontSize={13} {...LABEL} fill="var(--canvas)" style={NUM}>193,783</text>
      <text x={160} y={214} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">+14.5% · 역대 최고 증가율</text>
    </svg>
  );
}

/** 저울: 사망 쪽이 더 무겁다. */
export function BrNatural() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="8월 출생 2만 3,703명보다 사망 3만 308명이 많아 저울이 사망 쪽으로 기움">
      <path d="M160 70 V190" stroke="var(--ink)" strokeWidth={3} />
      <path d="M130 196 H190" stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
      <g transform="rotate(-9 160 80)">
        <line x1={60} x2={260} y1={80} y2={80} stroke="var(--ink)" strokeWidth={3} />
        <rect x={34} y={84} width={70} height={36} rx={6} fill="var(--navy)" />
        <text x={69} y={108} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--canvas)" style={NUM}>23,703</text>
        <rect x={216} y={84} width={80} height={46} rx={6} fill="var(--graphite)" />
        <text x={256} y={113} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--canvas)" style={NUM}>30,308</text>
      </g>
      <text x={69} y={150} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">출생</text>
      <text x={256} y={168} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--smoke)">사망</text>
      <text x={160} y={226} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--burgundy)" style={NUM}>6,605명 자연감소 · 2026년 8월</text>
    </svg>
  );
}

/** 물음표 둘레에 거론되는 배경들. 확정된 화살표는 긋지 않는다. */
export function BrWhy() {
  const items = [
    { x: 60, y: 70, t: "혼인 증가" },
    { x: 260, y: 70, t: "30대 인구" },
    { x: 60, y: 180, t: "출산 인식" },
    { x: 260, y: 180, t: "정책?" },
  ];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="출생아 증가 배경으로 거론되는 혼인 증가, 30대 인구, 출산 인식, 정책. 원인은 확정되지 않음">
      <circle cx={160} cy={125} r={38} fill="var(--pending-tint)" stroke="var(--pending)" strokeWidth={2} strokeDasharray="5 4" />
      <text x={160} y={140} textAnchor="middle" fontSize={40} {...LABEL} fill="var(--pending)">?</text>
      {items.map((it) => (
        <g key={it.t}>
          <line x1={160} y1={125} x2={it.x} y2={it.y} stroke="var(--stone)" strokeWidth={1.5} strokeDasharray="3 4" />
          <rect x={it.x - 44} y={it.y - 16} width={88} height={30} rx={15} fill="var(--canvas)" stroke="var(--stone)" strokeWidth={1.5} />
          <text x={it.x} y={it.y + 4} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--ink)">{it.t}</text>
        </g>
      ))}
      <text x={160} y={228} textAnchor="middle" fontSize={11} fill="var(--ash)">거론되는 배경 · 통계는 원인을 밝히지 않아요</text>
    </svg>
  );
}
