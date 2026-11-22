/**
 * 부동산 안정화 대책 — 쉬운 설명 삽화.
 *
 * 막대 길이는 실제 비율대로 그린다. 결과가 엇갈리는 업적이라, 오른 숫자도
 * 내린 숫자와 같은 크기로 그린다.
 */

const LABEL = { fontFamily: "inherit", fontWeight: 800 } as const;
const NUM = { fontVariantNumeric: "tabular-nums" } as const;

/** 대출 상자가 6억 선에서 잘리고, LTV 막대가 70%에서 40%로 짧아진다. */
export function HsLoan() {
  const w = 200;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="주택 구입 대출 최대 6억 원, 무주택자 LTV 70%에서 40%로">
      <text x={40} y={50} fontSize={13} {...LABEL} fill="var(--smoke)">집값 대비 빌릴 수 있는 돈</text>
      <rect x={40} y={62} width={w} height={26} rx={4} fill="none" stroke="var(--stone)" strokeDasharray="3 3" />
      <rect x={40} y={62} width={w * 0.7} height={26} rx={4} fill="var(--graphite)" />
      <text x={40 + w * 0.7 + 8} y={80} fontSize={13} {...LABEL} fill="var(--smoke)" style={NUM}>70%</text>
      <rect x={40} y={100} width={w} height={26} rx={4} fill="none" stroke="var(--stone)" strokeDasharray="3 3" />
      <rect x={40} y={100} width={w * 0.4} height={26} rx={4} fill="var(--navy)" />
      <text x={40 + w * 0.4 + 8} y={118} fontSize={13} {...LABEL} fill="var(--navy)" style={NUM}>40% · 2025.10</text>
      <rect x={60} y={150} width={200} height={44} rx={10} fill="var(--canvas)" stroke="var(--ink)" strokeWidth={2} />
      <text x={160} y={178} textAnchor="middle" fontSize={16} {...LABEL} fill="var(--ink)" style={NUM}>대출 최대 6억 원</text>
      <text x={160} y={222} textAnchor="middle" fontSize={11} fill="var(--ash)">수도권·규제지역 주택 구입 · 2025.6.28부터</text>
    </svg>
  );
}

/** 집 세 채 위로 두 개의 무게 — 만기연장 금지, 양도세 중과. */
export function HsTax() {
  const house = (x: number) => (
    <g key={x}>
      <path d={`M${x} 150 l30 -26 l30 26 v40 h-60 z`} fill="var(--canvas)" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      <rect x={x + 22} y={168} width={16} height={22} fill="var(--stone)" />
    </g>
  );
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="다주택자 대출 만기연장 금지(2026.4.17), 양도세 20~30%포인트 중과(2026.5.10)">
      <rect x={30} y={40} width={124} height={50} rx={8} fill="var(--burgundy)" />
      <text x={92} y={62} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--canvas)">대출 만기연장 ✕</text>
      <text x={92} y={80} textAnchor="middle" fontSize={11} fill="var(--canvas)" style={NUM}>2026.4.17</text>
      <rect x={166} y={40} width={124} height={50} rx={8} fill="var(--navy)" />
      <text x={228} y={62} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--canvas)" style={NUM}>양도세 +20~30%p</text>
      <text x={228} y={80} textAnchor="middle" fontSize={11} fill="var(--canvas)" style={NUM}>2026.5.10</text>
      <path d="M92 94 v22" stroke="var(--ink)" strokeWidth={2} markerEnd="url(#hs-tax-ar)" />
      <path d="M228 94 v22" stroke="var(--ink)" strokeWidth={2} markerEnd="url(#hs-tax-ar)" />
      <defs>
        <marker id="hs-tax-ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ink)" />
        </marker>
      </defs>
      {[60, 130, 200].map(house)}
      <text x={160} y={222} textAnchor="middle" fontSize={11} fill="var(--ash)">다주택자 · 수도권·규제지역</text>
    </svg>
  );
}

/** 최근 3년 평균 15.8만 호 막대 옆에 계획 27만 호 점선 막대. 점선은 아직 계획이라는 뜻. */
export function HsSupply() {
  const k = 4.6;
  const base = 190;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="연평균 착공 최근 3년 15만 8천 호, 계획 27만 호. 계획은 아직 실적이 아님">
      <rect x={70} y={base - 15.8 * k} width={64} height={15.8 * k} rx={4} fill="var(--graphite)" />
      <text x={102} y={base - 15.8 * k - 8} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--smoke)" style={NUM}>15.8만</text>
      <rect x={186} y={base - 27 * k} width={64} height={27 * k} rx={4} fill="var(--pending-tint)" stroke="var(--pending)" strokeWidth={2} strokeDasharray="5 4" />
      <text x={218} y={base - 27 * k - 8} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--pending)" style={NUM}>27만 (계획)</text>
      <line x1={50} x2={270} y1={base} y2={base} stroke="var(--ink)" strokeWidth={2} />
      <text x={102} y={base + 18} textAnchor="middle" fontSize={11} fill="var(--smoke)">최근 3년 평균</text>
      <text x={218} y={base + 18} textAnchor="middle" fontSize={11} fill="var(--smoke)" style={NUM}>2026~2030</text>
      <text x={160} y={232} textAnchor="middle" fontSize={11} fill="var(--ash)">수도권 연평균 착공 · 5년 135만 호</text>
    </svg>
  );
}

/**
 * 87주를 87칸으로 — 칸마다 "그 주에 올랐다"는 위 화살표 하나.
 * 주마다 얼마나 올랐는지는 그리지 않는다(그 값은 자료에 없다).
 */
export function HsSeoul() {
  const n = 87;
  const cols = 15;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="서울 아파트값 87주 연속 상승, 10·15 대책 뒤 1년 10.42% 상승">
      {Array.from({ length: n }, (_, i) => {
        const x = 40 + (i % cols) * 16;
        const y = 40 + Math.floor(i / cols) * 22;
        return <path key={i} d={`M${x} ${y + 12} l6 -10 l6 10 z`} fill="var(--burgundy)" opacity={0.55 + 0.45 * (i / n)} />;
      })}
      <text x={160} y={196} textAnchor="middle" fontSize={16} {...LABEL} fill="var(--burgundy)" style={NUM}>87주 연속 상승 · 2026.10.5</text>
      <text x={160} y={218} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)" style={NUM}>10·15 대책 뒤 1년 +10.42%</text>
      <text x={160} y={234} textAnchor="middle" fontSize={10} fill="var(--ash)">한국부동산원 주간 통계 인용 보도</text>
    </svg>
  );
}

/** 구별 1년 상승률 막대 — 실제 비율대로. */
export function HsDistrict() {
  const rows = [
    { label: "강남구", v: 1.4, fill: "var(--navy)" },
    { label: "서초구", v: 3.35, fill: "var(--navy)" },
    { label: "서울 전체", v: 10.42, fill: "var(--graphite)" },
    { label: "서대문구", v: 14.4, fill: "var(--burgundy)" },
    { label: "성북구", v: 16.52, fill: "var(--burgundy)" },
  ];
  const k = 10.5;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="1년 상승률 강남구 1.40%, 서초구 3.35%, 서울 전체 10.42%, 서대문구 14.40%, 성북구 16.52%">
      {rows.map((r, i) => {
        const y = 36 + i * 34;
        return (
          <g key={r.label}>
            <text x={78} y={y + 16} textAnchor="end" fontSize={12} {...LABEL} fill="var(--ink)">{r.label}</text>
            <rect x={86} y={y} width={r.v * k} height={22} rx={3} fill={r.fill} />
            <text x={86 + r.v * k + 6} y={y + 16} fontSize={12} {...LABEL} fill="var(--smoke)" style={NUM}>{r.v.toFixed(2)}%</text>
          </g>
        );
      })}
      <text x={160} y={226} textAnchor="middle" fontSize={11} fill="var(--ash)">10·15 대책 뒤 1년 아파트값 상승률</text>
    </svg>
  );
}

/** 100칸 중 색칠된 칸 — 15.76%에서 7.80%로. */
export function HsGap() {
  const grid = (ox: number, filled: number, fill: string) =>
    Array.from({ length: 100 }, (_, i) => (
      <rect key={`${ox}-${i}`} x={ox + (i % 10) * 11} y={60 + Math.floor(i / 10) * 11} width={9} height={9} rx={1.5}
            fill={i < filled ? fill : "var(--stone)"} opacity={i < filled ? 1 : 0.35} />
    ));
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="서울 아파트 매수 자금 중 갭투자 비중 15.76%에서 7.80%로 감소">
      <text x={84} y={46} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--smoke)">지정 전</text>
      {grid(30, 16, "var(--graphite)")}
      <text x={84} y={190} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--smoke)" style={NUM}>15.76%</text>
      <text x={236} y={46} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">지정 후</text>
      {grid(182, 8, "var(--navy)")}
      <text x={236} y={190} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--navy)" style={NUM}>7.80%</text>
      <text x={160} y={222} textAnchor="middle" fontSize={11} fill="var(--ash)">보증금 안고 산 비중 · 토지거래허가구역 전후</text>
    </svg>
  );
}

/** 전셋값 상승률 두 막대와 줄어든 매물. */
export function HsJeonse() {
  const k = 11;
  const base = 170;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="서울 아파트 전셋값 1년 상승률 직전 2.41%, 이후 9.92%. 전월세 매물 12.5% 감소">
      <rect x={40} y={base - 2.41 * k} width={52} height={2.41 * k} rx={4} fill="var(--graphite)" />
      <text x={66} y={base - 2.41 * k - 8} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--smoke)" style={NUM}>2.41%</text>
      <rect x={110} y={base - 9.92 * k} width={52} height={9.92 * k} rx={4} fill="var(--burgundy)" />
      <text x={136} y={base - 9.92 * k - 8} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)" style={NUM}>9.92%</text>
      <line x1={30} x2={172} y1={base} y2={base} stroke="var(--ink)" strokeWidth={2} />
      <text x={66} y={base + 18} textAnchor="middle" fontSize={11} fill="var(--smoke)">그 전 1년</text>
      <text x={136} y={base + 18} textAnchor="middle" fontSize={11} fill="var(--smoke)">지정 뒤 1년</text>
      <rect x={196} y={70} width={100} height={100} rx={8} fill="var(--canvas)" stroke="var(--stone)" strokeWidth={1.5} />
      <text x={246} y={98} textAnchor="middle" fontSize={11} fill="var(--smoke)">전월세 매물</text>
      <text x={246} y={130} textAnchor="middle" fontSize={20} {...LABEL} fill="var(--burgundy)" style={NUM}>−12.5%</text>
      <text x={246} y={154} textAnchor="middle" fontSize={10} fill="var(--smoke)" style={NUM}>43,281 → 37,896</text>
      <text x={160} y={224} textAnchor="middle" fontSize={11} fill="var(--ash)">서울 아파트 전세가격지수 · 2025.10~2026.9</text>
    </svg>
  );
}
