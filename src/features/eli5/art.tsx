import type { Eli5Art } from "@/content/schema";

/**
 * 쉬운 설명 삽화.
 *
 * 이모지 대신 장면마다 다른 다이어그램을 그린다. 이모지는 무엇에 관한
 * 이야기인지만 알려주지만, 다이어그램은 내용 자체를 설명한다.
 *
 * 전부 앱 토큰으로 칠해 스토리 화면과 같은 세계 안에 있게 한다.
 */

const LABEL = {
  fontFamily: "inherit",
  fontWeight: 800,
} as const;

function SuezLong() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="부산에서 유럽까지 남쪽으로 크게 돌아가는 긴 뱃길">
      <path d="M262 70 C250 150, 190 205, 140 205 C86 205, 62 150, 58 96"
            fill="none" stroke="var(--warm-400)" strokeWidth={4}
            strokeDasharray="9 8" strokeLinecap="round" />
      <circle cx={262} cy={70} r={11} fill="var(--warm-400)" />
      <circle cx={58} cy={96} r={11} fill="var(--ice-500)" />
      <circle cx={152} cy={203} r={6} fill="var(--warm-400)" opacity={0.55} />
      <text x={262} y={48} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--text-primary)">부산</text>
      <text x={58} y={74} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--text-primary)">유럽</text>
      <text x={152} y={228} textAnchor="middle" fontSize={12} fill="var(--text-muted)">수에즈 운하</text>
    </svg>
  );
}

function ArcticShort() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="북극을 가로질러 훨씬 짧게 이어지는 뱃길">
      <path d="M20 66 Q160 -6 300 66" fill="none" stroke="var(--ice-400)"
            strokeWidth={26} strokeLinecap="round" opacity={0.16} />
      <path d="M262 132 C236 74, 190 56, 160 56 C130 56, 84 74, 58 132"
            fill="none" stroke="var(--ice-400)" strokeWidth={4.5} strokeLinecap="round" />
      <circle cx={262} cy={132} r={11} fill="var(--ice-400)" />
      <circle cx={58} cy={132} r={11} fill="var(--ice-500)" />
      <text x={262} y={162} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--text-primary)">부산</text>
      <text x={58} y={162} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--text-primary)">유럽</text>
      <text x={160} y={40} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--ice-400)">북극 바다</text>
    </svg>
  );
}

function CompareBars() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="두 뱃길 길이 비교. 수에즈 20,400킬로미터, 북극 13,000킬로미터">
      <text x={18} y={58} fontSize={13} fontWeight={600} fill="var(--text-secondary)">수에즈로 가면</text>
      <rect x={18} y={68} width={284} height={30} rx={15} fill="var(--warm-500)" />
      <text x={292} y={89} textAnchor="end" fontSize={14} fontWeight={700} fill="var(--ink-900)"
            style={{ fontVariantNumeric: "tabular-nums" }}>20,400 km</text>

      <text x={18} y={146} fontSize={13} fontWeight={600} fill="var(--text-secondary)">북극으로 가면</text>
      <rect x={18} y={156} width={181} height={30} rx={15} fill="var(--ice-400)" />
      <text x={189} y={177} textAnchor="end" fontSize={14} fontWeight={700} fill="var(--ink-900)"
            style={{ fontVariantNumeric: "tabular-nums" }}>13,000 km</text>

      <path d="M203 171 H298" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="4 4" />
      <text x={160} y={214} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--text-primary)">
        7,400 km 짧아요
      </text>
    </svg>
  );
}

function Season() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="일 년 가운데 7월부터 10월까지 넉 달만 지나갈 수 있음">
      <g fontSize={12} textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>
        <rect x={18} y={72} width={60} height={44} rx={10} fill="var(--ink-500)" />
        <rect x={86} y={72} width={60} height={44} rx={10} fill="var(--ink-500)" />
        <rect x={222} y={72} width={60} height={44} rx={10} fill="var(--ink-500)" />
        <text x={48} y={99} fill="var(--text-muted)">1~3월</text>
        <text x={116} y={99} fill="var(--text-muted)">4~6월</text>
        <text x={252} y={99} fill="var(--text-muted)">11~12월</text>
        <rect x={154} y={72} width={60} height={44} rx={10} fill="var(--ice-400)" />
        <text x={184} y={99} fill="var(--ink-900)" fontWeight={700}>7~10월</text>
      </g>
      <text x={160} y={146} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ice-400)">
        이때만 지나갈 수 있어요
      </text>
      <g fill="var(--text-muted)" opacity={0.5}>
        <circle cx={48} cy={182} r={5} /><circle cx={68} cy={194} r={4} />
        <circle cx={104} cy={186} r={6} /><circle cx={252} cy={182} r={5} />
        <circle cx={272} cy={194} r={4} /><circle cx={228} cy={190} r={4} />
      </g>
      <text x={160} y={224} textAnchor="middle" fontSize={12} fill="var(--text-muted)">
        나머지 달은 바다가 꽁꽁 얼어요
      </text>
    </svg>
  );
}

function Icebreaker() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="얼음을 깨며 나아가는 쇄빙선">
      <g fill="var(--ice-400)" opacity={0.22}>
        <polygon points="18,150 52,134 78,152 44,168" />
        <polygon points="86,166 118,152 140,170 106,184" />
        <polygon points="242,146 276,132 302,152 266,166" />
        <polygon points="196,172 228,160 250,178 216,190" />
      </g>
      <path d="M96 150 H236 L214 190 H118 Z" fill="var(--ink-500)" />
      <rect x={140} y={118} width={54} height={34} rx={6} fill="var(--ice-400)" />
      <rect x={152} y={128} width={12} height={12} rx={2} fill="var(--ink-800)" />
      <rect x={172} y={128} width={12} height={12} rx={2} fill="var(--ink-800)" />
      <rect x={204} y={96} width={5} height={56} rx={2.5} fill="var(--ink-500)" />
      <path d="M209 100 L238 110 L209 120 Z" fill="var(--warm-400)" />
      <path d="M84 200 q22 -9 44 0 t44 0 t44 0 t44 0" fill="none"
            stroke="var(--ice-400)" strokeWidth={3} strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function TrialVoyage() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="2026년 하반기 부산에서 로테르담까지 시범운항">
      <path d="M44 150 C96 92, 224 92, 276 150" fill="none" stroke="var(--ice-400)"
            strokeWidth={4} strokeLinecap="round" strokeDasharray="1 10" />
      <circle cx={44} cy={150} r={10} fill="var(--ice-500)" />
      <circle cx={276} cy={150} r={10} fill="var(--ice-400)" />
      <text x={44} y={180} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--text-primary)">부산</text>
      <text x={276} y={180} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--text-primary)">로테르담</text>
      <g transform="translate(160 104)">
        <path d="M-26 8 H26 L18 26 H-18 Z" fill="var(--ink-500)" />
        <rect x={-9} y={-9} width={20} height={17} rx={3} fill="var(--warm-400)" />
      </g>
      <text x={160} y={224} textAnchor="middle" fontSize={30} fontWeight={900} fill="var(--ice-400)"
            style={{ fontVariantNumeric: "tabular-nums" }}>2026</text>
    </svg>
  );
}

export const ELI5_ART: Record<Eli5Art, () => React.ReactNode> = {
  "suez-long": SuezLong,
  "arctic-short": ArcticShort,
  "compare-bars": CompareBars,
  season: Season,
  icebreaker: Icebreaker,
  "trial-voyage": TrialVoyage,
};
