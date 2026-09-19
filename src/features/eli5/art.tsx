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
            fill="none" stroke="var(--burgundy)" strokeWidth={4}
            strokeDasharray="9 8" strokeLinecap="round" />
      <circle cx={262} cy={70} r={11} fill="var(--burgundy)" />
      <circle cx={58} cy={96} r={11} fill="var(--navy)" />
      <circle cx={152} cy={203} r={6} fill="var(--burgundy)" opacity={0.55} />
      <text x={262} y={48} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">부산</text>
      <text x={58} y={74} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">유럽</text>
      <text x={152} y={228} textAnchor="middle" fontSize={12} fill="var(--ash)">수에즈 운하</text>
    </svg>
  );
}

function ArcticShort() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="북극을 가로질러 훨씬 짧게 이어지는 뱃길">
      <path d="M20 66 Q160 -6 300 66" fill="none" stroke="var(--navy)"
            strokeWidth={26} strokeLinecap="round" opacity={0.16} />
      <path d="M262 132 C236 74, 190 56, 160 56 C130 56, 84 74, 58 132"
            fill="none" stroke="var(--navy)" strokeWidth={4.5} strokeLinecap="round" />
      <circle cx={262} cy={132} r={11} fill="var(--navy)" />
      <circle cx={58} cy={132} r={11} fill="var(--navy)" />
      <text x={262} y={162} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">부산</text>
      <text x={58} y={162} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">유럽</text>
      <text x={160} y={40} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--navy)">북극 바다</text>
    </svg>
  );
}

function CompareBars() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="두 뱃길 길이 비교. 수에즈 20,400킬로미터, 북극 13,000킬로미터">
      <text x={18} y={58} fontSize={13} fontWeight={600} fill="var(--smoke)">수에즈로 가면</text>
      <rect x={18} y={68} width={284} height={30} rx={15} fill="var(--burgundy)" />
      <text x={292} y={89} textAnchor="end" fontSize={14} fontWeight={700} fill="var(--canvas)"
            style={{ fontVariantNumeric: "tabular-nums" }}>20,400 km</text>

      <text x={18} y={146} fontSize={13} fontWeight={600} fill="var(--smoke)">북극으로 가면</text>
      <rect x={18} y={156} width={181} height={30} rx={15} fill="var(--navy)" />
      <text x={189} y={177} textAnchor="end" fontSize={14} fontWeight={700} fill="var(--canvas)"
            style={{ fontVariantNumeric: "tabular-nums" }}>13,000 km</text>

      <path d="M203 171 H298" stroke="var(--ash)" strokeWidth={2} strokeDasharray="4 4" />
      <text x={160} y={214} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
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
        <rect x={18} y={72} width={60} height={44} rx={10} fill="var(--stone)" />
        <rect x={86} y={72} width={60} height={44} rx={10} fill="var(--stone)" />
        <rect x={222} y={72} width={60} height={44} rx={10} fill="var(--stone)" />
        <text x={48} y={99} fill="var(--ash)">1~3월</text>
        <text x={116} y={99} fill="var(--ash)">4~6월</text>
        <text x={252} y={99} fill="var(--ash)">11~12월</text>
        <rect x={154} y={72} width={60} height={44} rx={10} fill="var(--navy)" />
        <text x={184} y={99} fill="var(--canvas)" fontWeight={700}>7~10월</text>
      </g>
      <text x={160} y={146} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--navy)">
        이때만 지나갈 수 있어요
      </text>
      <g fill="var(--ash)" opacity={0.5}>
        <circle cx={48} cy={182} r={5} /><circle cx={68} cy={194} r={4} />
        <circle cx={104} cy={186} r={6} /><circle cx={252} cy={182} r={5} />
        <circle cx={272} cy={194} r={4} /><circle cx={228} cy={190} r={4} />
      </g>
      <text x={160} y={224} textAnchor="middle" fontSize={12} fill="var(--ash)">
        나머지 달은 바다가 꽁꽁 얼어요
      </text>
    </svg>
  );
}

function Icebreaker() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="얼음을 깨며 나아가는 쇄빙선">
      <g fill="var(--navy)" opacity={0.22}>
        <polygon points="18,150 52,134 78,152 44,168" />
        <polygon points="86,166 118,152 140,170 106,184" />
        <polygon points="242,146 276,132 302,152 266,166" />
        <polygon points="196,172 228,160 250,178 216,190" />
      </g>
      <path d="M96 150 H236 L214 190 H118 Z" fill="var(--stone)" />
      <rect x={140} y={118} width={54} height={34} rx={6} fill="var(--navy)" />
      <rect x={152} y={128} width={12} height={12} rx={2} fill="var(--canvas)" />
      <rect x={172} y={128} width={12} height={12} rx={2} fill="var(--canvas)" />
      <rect x={204} y={96} width={5} height={56} rx={2.5} fill="var(--stone)" />
      <path d="M209 100 L238 110 L209 120 Z" fill="var(--burgundy)" />
      <path d="M84 200 q22 -9 44 0 t44 0 t44 0 t44 0" fill="none"
            stroke="var(--navy)" strokeWidth={3} strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function TrialVoyage() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="2026년 하반기 부산에서 로테르담까지 시범운항">
      <path d="M44 150 C96 92, 224 92, 276 150" fill="none" stroke="var(--navy)"
            strokeWidth={4} strokeLinecap="round" strokeDasharray="1 10" />
      <circle cx={44} cy={150} r={10} fill="var(--navy)" />
      <circle cx={276} cy={150} r={10} fill="var(--navy)" />
      <text x={44} y={180} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">부산</text>
      <text x={276} y={180} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">로테르담</text>
      <g transform="translate(160 104)">
        <path d="M-26 8 H26 L18 26 H-18 Z" fill="var(--stone)" />
        <rect x={-9} y={-9} width={20} height={17} rx={3} fill="var(--burgundy)" />
      </g>
      <text x={160} y={224} textAnchor="middle" fontSize={30} fontWeight={900} fill="var(--navy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>2026</text>
    </svg>
  );
}

/* ── 대장동 ───────────────────────────────────────────────── */

function EmptyLand() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="성남 대장동의 빈 땅. 전체 91만 제곱미터">
      <rect x={26} y={44} width={268} height={150} rx={18}
            fill="var(--taupe)" stroke="var(--ash)" strokeWidth={2.5} strokeDasharray="10 8" />
      <g fill="var(--stone)">
        <path d="M74 150 L96 130 L118 150 V172 H74 Z" />
        <path d="M134 150 L156 130 L178 150 V172 H134 Z" />
        <path d="M194 150 L216 130 L238 150 V172 H194 Z" />
      </g>
      <text x={160} y={32} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">성남 대장동</text>
      <text x={160} y={106} textAnchor="middle" fontSize={30} fontWeight={900} fill="var(--navy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>91만 ㎡</text>
      <text x={160} y={218} textAnchor="middle" fontSize={13} fill="var(--ash)">아파트를 지을 수 있는 땅</text>
    </svg>
  );
}

function LhExit() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="나라가 하려던 개발을 그만두고 민간이 맡게 된 상황">
      <rect x={24} y={76} width={112} height={78} rx={16} fill="var(--taupe)"
            stroke="var(--ash)" strokeWidth={2} strokeDasharray="8 7" />
      <text x={80} y={112} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ash)">나라</text>
      <text x={80} y={134} textAnchor="middle" fontSize={12} fill="var(--ash)">(LH)</text>
      <g stroke="var(--burgundy)" strokeWidth={5} strokeLinecap="round">
        <path d="M56 88 L104 142" />
        <path d="M104 88 L56 142" />
      </g>
      <path d="M150 115 H196" stroke="var(--ash)" strokeWidth={3} strokeLinecap="round"
            strokeDasharray="7 7" />
      <path d="M190 106 L202 115 L190 124 Z" fill="var(--ash)" />
      <rect x={210} y={76} width={86} height={78} rx={16} fill="var(--burgundy-tint)" />
      <text x={253} y={122} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--burgundy)">민간</text>
      <text x={160} y={196} textAnchor="middle" fontSize={13} fill="var(--smoke)">2010년, 나라가 손을 뗐어요</text>
    </svg>
  );
}

function HalfShare() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="성남시 공사가 회사 지분의 절반과 한 주를 가진 구조">
      <circle cx={160} cy={112} r={76} fill="var(--burgundy-tint)" />
      {/* 절반보다 아주 조금 더. 그 한 주가 결정권을 가른다. */}
      <path d="M160 36 A76 76 0 0 1 163 188 Z" fill="var(--navy)" />
      <text x={92} y={222} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">성남시 공사</text>
      <text x={238} y={222} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">민간</text>
      <text x={160} y={106} textAnchor="middle" fontSize={26} fontWeight={900} fill="var(--canvas)"
            style={{ fontVariantNumeric: "tabular-nums" }}>절반</text>
      <text x={160} y={132} textAnchor="middle" fontSize={16} fontWeight={800} fill="var(--canvas)">+ 한 주</text>
    </svg>
  );
}

function LandSplit() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="땅의 53.5퍼센트가 공원 도로 학교 같은 모두의 땅이 됐다">
      <text x={18} y={54} fontSize={13} fontWeight={600} fill="var(--smoke)">땅을 나눠 보면</text>
      <g>
        <rect x={18} y={68} width={158} height={54} rx={8} fill="var(--navy)" />
        <rect x={180} y={68} width={122} height={54} rx={8} fill="var(--stone)" />
      </g>
      <text x={97} y={102} textAnchor="middle" fontSize={20} fontWeight={900} fill="var(--canvas)"
            style={{ fontVariantNumeric: "tabular-nums" }}>53.5%</text>
      <text x={241} y={102} textAnchor="middle" fontSize={16} fontWeight={800} fill="var(--graphite)"
            style={{ fontVariantNumeric: "tabular-nums" }}>45.6%</text>
      <text x={97} y={146} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">모두의 땅</text>
      <text x={97} y={166} textAnchor="middle" fontSize={12} fill="var(--smoke)">공원 · 도로 · 학교</text>
      <text x={241} y={146} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--graphite)">집 짓는 땅</text>
      <text x={160} y={212} textAnchor="middle" fontSize={13} fill="var(--ash)">절반이 넘어요</text>
    </svg>
  );
}

function OldFactoryPark() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="옛 공장 자리가 공원으로 바뀌었다">
      <g fill="var(--stone)">
        <rect x={26} y={104} width={84} height={64} rx={6} />
        <rect x={40} y={76} width={16} height={30} rx={4} />
        <rect x={68} y={84} width={16} height={22} rx={4} />
      </g>
      <text x={68} y={192} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ash)">옛 공장</text>
      <path d="M134 136 H186" stroke="var(--navy)" strokeWidth={4} strokeLinecap="round" />
      <path d="M180 126 L194 136 L180 146 Z" fill="var(--navy)" />
      <g fill="var(--navy)">
        <circle cx={232} cy={112} r={26} />
        <rect x={228} y={132} width={8} height={30} rx={3} />
        <circle cx={278} cy={128} r={18} />
        <rect x={275} y={142} width={6} height={22} rx={3} />
      </g>
      <text x={252} y={192} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">공원</text>
      <text x={160} y={222} textAnchor="middle" fontSize={13} fill="var(--ash)">도심 한복판이에요</text>
    </svg>
  );
}

function TwoCounts() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="돌려받은 돈을 어디까지 세느냐에 따라 숫자가 달라진다">
      <text x={18} y={50} fontSize={13} fontWeight={600} fill="var(--smoke)">성남시가 세는 방식</text>
      <rect x={18} y={60} width={284} height={40} rx={10} fill="var(--navy)" />
      <text x={290} y={86} textAnchor="end" fontSize={17} fontWeight={800} fill="var(--canvas)"
            style={{ fontVariantNumeric: "tabular-nums" }}>5,503억</text>

      <text x={18} y={140} fontSize={13} fontWeight={600} fill="var(--smoke)">이 중 현금으로 받은 것</text>
      <rect x={18} y={150} width={94} height={40} rx={10} fill="var(--navy-tint)" />
      <text x={100} y={176} textAnchor="end" fontSize={17} fontWeight={800} fill="var(--navy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>1,822억</text>
      <text x={124} y={176} fontSize={12} fill="var(--ash)">나머지는 공원·길처럼 물건으로</text>

      <text x={160} y={224} textAnchor="middle" fontSize={13} fill="var(--burgundy)">어디까지 세느냐로 말이 갈려요</text>
    </svg>
  );
}

/* ── 주식시장 ─────────────────────────────────────────────── */

function UpDown() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="주가지수가 3천에서 9천까지 올랐다가 5천6백대로 내려온 모양">
      <path d="M26 186 L96 150 L168 52 L232 132 L296 168" fill="none"
            stroke="var(--navy)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M168 52 L232 132 L296 168" fill="none"
            stroke="var(--burgundy)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={26} cy={186} r={7} fill="var(--navy)" />
      <circle cx={168} cy={52} r={9} fill="var(--navy)" />
      <circle cx={296} cy={168} r={7} fill="var(--burgundy)" />
      <text x={26} y={212} textAnchor="start" fontSize={13} {...LABEL} fill="var(--smoke)"
            style={{ fontVariantNumeric: "tabular-nums" }}>3,021</text>
      <text x={168} y={36} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--navy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>9,063</text>
      <text x={296} y={196} textAnchor="end" fontSize={13} {...LABEL} fill="var(--burgundy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>5,663</text>
      <text x={160} y={232} textAnchor="middle" fontSize={12} fill="var(--ash)">올랐다가 다시 내려왔어요</text>
    </svg>
  );
}

function ManyOwners() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="회사를 맡은 사람이 회사만이 아니라 주주도 챙기게 됐다">
      <rect x={124} y={30} width={72} height={44} rx={12} fill="var(--ink)" />
      <text x={160} y={58} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--canvas)">이사</text>
      <path d="M144 82 L104 122" stroke="var(--ash)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M176 82 L216 122" stroke="var(--navy)" strokeWidth={4.5} strokeLinecap="round" />
      <rect x={44} y={128} width={116} height={50} rx={12} fill="var(--stone)" />
      <text x={102} y={159} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--graphite)">회사</text>
      <rect x={172} y={128} width={116} height={50} rx={12} fill="var(--navy)" />
      <text x={230} y={159} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--canvas)">주주 모두</text>
      <text x={102} y={200} textAnchor="middle" fontSize={12} fill="var(--ash)">원래도 챙겼어요</text>
      <text x={230} y={200} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--navy)">이제 같이 챙겨요</text>
    </svg>
  );
}

function BurnShare() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="회사가 사들인 자기 주식을 1년 안에 없애야 한다">
      <rect x={22} y={92} width={80} height={56} rx={10} fill="var(--stone)" />
      <text x={62} y={126} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--graphite)">회사</text>
      <path d="M112 120 H156" stroke="var(--ash)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M150 111 L162 120 L150 129 Z" fill="var(--ash)" />
      <rect x={170} y={92} width={66} height={56} rx={10} fill="var(--navy-tint)"
            stroke="var(--navy)" strokeWidth={2} />
      <text x={203} y={118} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">자기</text>
      <text x={203} y={137} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">주식</text>
      <path d="M248 120 H286" stroke="var(--burgundy)" strokeWidth={3.5} strokeLinecap="round" />
      <g stroke="var(--burgundy)" strokeWidth={5} strokeLinecap="round">
        <path d="M280 104 L302 136" />
        <path d="M302 104 L280 136" />
      </g>
      <text x={160} y={62} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">사들이면 없애기</text>
      <text x={160} y={192} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--navy)">1년 안에</text>
      <text x={160} y={216} textAnchor="middle" fontSize={12} fill="var(--ash)">갖고만 있으면 나중에 다시 풀 수 있어요</text>
    </svg>
  );
}

function SharePremium() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="회사를 살 때 큰 주주뿐 아니라 작은 주주의 주식도 사야 한다">
      <rect x={18} y={54} width={92} height={46} rx={12} fill="var(--burgundy-tint)" />
      <text x={64} y={83} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--burgundy)">큰 주주</text>
      <g fill="var(--stone)">
        <circle cx={34} cy={158} r={15} />
        <circle cx={70} cy={158} r={15} />
        <circle cx={106} cy={158} r={15} />
      </g>
      <text x={70} y={196} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--graphite)">작은 주주들</text>
      <rect x={210} y={94} width={92} height={56} rx={14} fill="var(--navy)" />
      <text x={256} y={128} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--canvas)">사는 쪽</text>
      <path d="M118 78 C170 78, 176 112, 206 118" fill="none" stroke="var(--burgundy)"
            strokeWidth={4} strokeLinecap="round" />
      <path d="M124 156 C170 156, 178 138, 206 130" fill="none" stroke="var(--navy)"
            strokeWidth={4} strokeLinecap="round" strokeDasharray="8 7" />
      <text x={160} y={228} textAnchor="middle" fontSize={12} fill="var(--ash)">작은 주주도 같이 팔 수 있게</text>
    </svg>
  );
}

function Penalty() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="값을 속여 올리면 번 돈의 두 배까지 물어내고 최대 5년 거래가 막힌다">
      <text x={92} y={52} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--smoke)">번 돈</text>
      <rect x={58} y={62} width={68} height={38} rx={10} fill="var(--stone)" />
      <text x={92} y={88} textAnchor="middle" fontSize={16} fontWeight={800} fill="var(--graphite)">1</text>
      <text x={92} y={140} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--smoke)">물어낼 돈</text>
      <rect x={24} y={150} width={136} height={38} rx={10} fill="var(--burgundy)" />
      <text x={92} y={176} textAnchor="middle" fontSize={16} fontWeight={800} fill="var(--canvas)">2배까지</text>
      <line x1={188} y1={44} x2={188} y2={196} stroke="var(--stone)" strokeWidth={2} />
      <circle cx={250} cy={110} r={44} fill="none" stroke="var(--burgundy)" strokeWidth={6} />
      <path d="M220 80 L280 140" stroke="var(--burgundy)" strokeWidth={6} strokeLinecap="round" />
      <text x={250} y={180} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--burgundy)">최대 5년</text>
      <text x={250} y={202} textAnchor="middle" fontSize={12} fill="var(--ash)">주식 못 삼</text>
    </svg>
  );
}

function ExitGate() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="속이 빈 회사를 시장에서 더 빨리 내보낸다">
      <rect x={18} y={60} width={150} height={120} rx={16} fill="var(--taupe)"
            stroke="var(--stone)" strokeWidth={2} />
      <text x={93} y={48} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--smoke)">주식시장</text>
      <g fill="var(--navy)">
        <rect x={40} y={104} width={26} height={54} rx={6} />
        <rect x={78} y={90} width={26} height={68} rx={6} />
        <rect x={116} y={116} width={26} height={42} rx={6} />
      </g>
      <path d="M182 120 H244" stroke="var(--burgundy)" strokeWidth={4} strokeLinecap="round" />
      <path d="M238 110 L252 120 L238 130 Z" fill="var(--burgundy)" />
      <rect x={258} y={96} width={26} height={48} rx={6} fill="none"
            stroke="var(--burgundy)" strokeWidth={2.5} strokeDasharray="6 5" />
      <text x={271} y={166} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">속이 빈</text>
      <text x={271} y={184} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">회사</text>
      <text x={160} y={218} textAnchor="middle" fontSize={13} fill="var(--ash)">더 빨리 내보내요</text>
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

  "empty-land": EmptyLand,
  "lh-exit": LhExit,
  "half-share": HalfShare,
  "land-split": LandSplit,
  "old-factory-park": OldFactoryPark,
  "two-counts": TwoCounts,

  "up-down": UpDown,
  "many-owners": ManyOwners,
  "burn-share": BurnShare,
  "share-premium": SharePremium,
  penalty: Penalty,
  "exit-gate": ExitGate,
};
