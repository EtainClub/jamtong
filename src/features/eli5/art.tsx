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

/* ── 성남시 3대 무상복지 ──────────────────────────────────── */

function UniformFree() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="교복 값을 시가 대신 냈다">
      <g fill="var(--stone)" stroke="var(--ash)" strokeWidth={2}>
        <path d="M108 66 L134 56 L160 66 L160 150 L108 150 Z" />
        <path d="M172 66 L198 56 L224 66 L224 150 L172 150 Z" />
      </g>
      <path d="M134 56 L140 76 L128 76 Z" fill="var(--navy)" />
      <path d="M198 56 L204 76 L192 76 Z" fill="var(--burgundy)" />
      <rect x={90} y={168} width={140} height={38} rx={19} fill="var(--navy)" />
      <text x={160} y={194} textAnchor="middle" fontSize={17} fontWeight={800} fill="var(--canvas)">무상</text>
      <text x={160} y={38} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">중·고 신입생 교복</text>
      <text x={160} y={228} textAnchor="middle" fontSize={12} fill="var(--ash)">1인당 30만 원 상당</text>
    </svg>
  );
}

function PostpartumFree() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="아기를 낳은 뒤 산후조리 비용을 시가 보탰다">
      <rect x={58} y={112} width={204} height={62} rx={18} fill="var(--stone)" />
      <rect x={58} y={104} width={204} height={22} rx={11} fill="var(--navy-tint)" />
      <circle cx={104} cy={96} r={22} fill="var(--taupe)" stroke="var(--ash)" strokeWidth={2} />
      <circle cx={196} cy={132} r={15} fill="var(--navy-tint)" stroke="var(--navy)" strokeWidth={2} />
      <text x={160} y={62} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">산후조리 지원</text>
      <text x={160} y={210} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--navy)">2016년 1월 7일 첫 지원</text>
    </svg>
  );
}

function YouthDividend() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="스물네 살이면 소득을 따지지 않고 연 100만 원을 지역화폐로 받았다">
      <text x={160} y={52} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">만 24세라면 누구나</text>
      <g>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${46 + i * 62} 92)`}>
            <rect width={48} height={32} rx={8} fill="var(--navy)" />
            <text x={24} y={22} textAnchor="middle" fontSize={13} fontWeight={800} fill="var(--canvas)"
                  style={{ fontVariantNumeric: "tabular-nums" }}>25</text>
          </g>
        ))}
      </g>
      <text x={160} y={152} textAnchor="middle" fontSize={12} fill="var(--ash)">분기마다 25만 원씩</text>
      <text x={160} y={196} textAnchor="middle" fontSize={30} fontWeight={900} fill="var(--navy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>100만 원</text>
      <text x={160} y={222} textAnchor="middle" fontSize={12} fill="var(--ash)">지역에서만 쓰는 상품권으로</text>
    </svg>
  );
}

function ThreeTogether() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="세 사업이 한 예산안에 함께 담겼다">
      <rect x={30} y={54} width={260} height={132} rx={20} fill="none"
            stroke="var(--navy)" strokeWidth={2.5} strokeDasharray="9 7" />
      <text x={160} y={38} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">2016년 예산안 하나에</text>
      <g>
        <rect x={50} y={84} width={72} height={72} rx={14} fill="var(--navy)" />
        <text x={86} y={116} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--canvas)">청년</text>
        <text x={86} y={134} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--canvas)">배당</text>
        <rect x={130} y={84} width={60} height={72} rx={14} fill="var(--stone)" />
        <text x={160} y={116} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">산후</text>
        <text x={160} y={134} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">조리</text>
        <rect x={198} y={84} width={52} height={72} rx={14} fill="var(--taupe)" />
        <text x={224} y={116} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">무상</text>
        <text x={224} y={134} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">교복</text>
      </g>
      <text x={160} y={214} textAnchor="middle" fontSize={26} fontWeight={900} fill="var(--navy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>194억 원</text>
    </svg>
  );
}

function GovBlock() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="정부가 협의 절차를 지키지 않았다며 제동을 걸었다">
      <rect x={22} y={90} width={94} height={62} rx={14} fill="var(--navy)" />
      <text x={69} y={118} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--canvas)">성남시</text>
      <text x={69} y={138} textAnchor="middle" fontSize={11} fill="var(--navy-tint)">세 가지 시행</text>
      <path d="M126 121 H176" stroke="var(--ash)" strokeWidth={3.5} strokeLinecap="round" />
      <g stroke="var(--burgundy)" strokeWidth={6} strokeLinecap="round">
        <path d="M140 100 L162 142" />
        <path d="M162 100 L140 142" />
      </g>
      <rect x={196} y={90} width={102} height={62} rx={14} fill="var(--burgundy-tint)"
            stroke="var(--burgundy)" strokeWidth={2} />
      <text x={247} y={116} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">정부</text>
      <text x={247} y={136} textAnchor="middle" fontSize={11} fill="var(--burgundy)">먼저 의논했어야</text>
      <text x={160} y={200} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--burgundy)">2016년 1월, 대법원으로</text>
    </svg>
  );
}

function CaseDropped() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="법원 판단이 나오기 전에 소송이 취하됐다">
      <rect x={96} y={54} width={128} height={86} rx={16} fill="var(--taupe)"
            stroke="var(--stone)" strokeWidth={2} />
      <path d="M116 54 H204 L216 34 H104 Z" fill="var(--stone)" />
      <text x={160} y={106} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--graphite)">대법원</text>
      <g stroke="var(--ash)" strokeWidth={3} strokeLinecap="round" strokeDasharray="8 7">
        <path d="M160 148 V186" />
      </g>
      <text x={160} y={210} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ash)">판단 전에 소를 거둠</text>
      <text x={160} y={232} textAnchor="middle" fontSize={12} fill="var(--ash)">2018년 7월 2일</text>
    </svg>
  );
}

/* ── 성남시 모라토리엄 ────────────────────────────────────── */

function InheritedDebt() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="새 시정이 물려받은 빚 7,285억 원">
      <rect x={44} y={96} width={232} height={72} rx={16} fill="var(--burgundy-tint)"
            stroke="var(--burgundy)" strokeWidth={2} />
      <text x={160} y={70} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">물려받은 빚</text>
      <text x={160} y={144} textAnchor="middle" fontSize={34} fontWeight={900} fill="var(--burgundy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>7,285억</text>
      <text x={160} y={198} textAnchor="middle" fontSize={12} fill="var(--ash)">장부에 제대로 적혀 있지도 않았어요</text>
    </svg>
  );
}

function WrongPocket() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="판교 개발용으로 모아 둔 돈을 다른 사업에 썼다">
      <rect x={20} y={74} width={104} height={96} rx={16} fill="var(--navy-tint)"
            stroke="var(--navy)" strokeWidth={2} strokeDasharray="8 6" />
      <text x={72} y={108} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">판교</text>
      <text x={72} y={126} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">지으라고</text>
      <text x={72} y={146} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">모아 둔 돈</text>
      <path d="M132 104 H176" stroke="var(--burgundy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M170 95 L182 104 L170 113 Z" fill="var(--burgundy)" />
      <path d="M132 142 H176" stroke="var(--burgundy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M170 133 L182 142 L170 151 Z" fill="var(--burgundy)" />
      <rect x={190} y={80} width={106} height={46} rx={12} fill="var(--stone)" />
      <text x={243} y={108} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--graphite)">시청 건물</text>
      <rect x={190} y={120} width={106} height={46} rx={12} fill="var(--stone)" />
      <text x={243} y={148} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--graphite)">길 넓히기</text>
      <text x={160} y={206} textAnchor="middle" fontSize={22} fontWeight={900} fill="var(--burgundy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>5,400억</text>
      <text x={160} y={228} textAnchor="middle" fontSize={12} fill="var(--ash)">나중에 채워 넣어야 하는 돈</text>
    </svg>
  );
}

function DeclareMoratorium() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="못 갚는다고 먼저 알렸다">
      <rect x={58} y={62} width={204} height={96} rx={20} fill="var(--pending-tint)"
            stroke="var(--pending)" strokeWidth={2.5} />
      <path d="M140 158 L156 186 L172 158 Z" fill="var(--pending-tint)" stroke="var(--pending)"
            strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M142 158 H170" stroke="var(--pending-tint)" strokeWidth={4} />
      <text x={160} y={102} textAnchor="middle" fontSize={17} {...LABEL} fill="var(--pending)">지금은 못 갚아요</text>
      <text x={160} y={130} textAnchor="middle" fontSize={14} fill="var(--pending)">미뤄 주세요</text>
      <text x={160} y={216} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">2010년 7월 · 모라토리엄</text>
    </svg>
  );
}

function TightenBelt() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="예산을 깎아 빚을 갚아 나갔다">
      <text x={18} y={52} fontSize={13} fontWeight={600} fill="var(--smoke)">갚아야 할 돈이 줄어드는 동안</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={22 + i * 74} y={172 - i * 0} width={54} height={10} rx={5} fill="var(--stone)" />
          <rect x={22 + i * 74} y={76} width={54} height={96 - i * 26} rx={8} fill="var(--burgundy)"
                opacity={1 - i * 0.18} transform={`translate(0 ${i * 26})`} />
        </g>
      ))}
      <text x={49} y={204} textAnchor="middle" fontSize={12} fill="var(--ash)">2010</text>
      <text x={271} y={204} textAnchor="middle" fontSize={12} fill="var(--ash)">2013</text>
      <text x={160} y={230} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">3년 6개월</text>
    </svg>
  );
}

function PaidOff() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="미뤄 뒀던 빚을 모두 정리했다">
      <circle cx={160} cy={116} r={62} fill="var(--navy-tint)" />
      <path d="M128 118 L150 142 L196 92" fill="none" stroke="var(--navy)" strokeWidth={11}
            strokeLinecap="round" strokeLinejoin="round" />
      <text x={160} y={210} textAnchor="middle" fontSize={22} fontWeight={900} fill="var(--navy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>7,285억 정리</text>
      <text x={160} y={232} textAnchor="middle" fontSize={12} fill="var(--ash)">2014년 1월 27일</text>
    </svg>
  );
}

function DebtZero() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="일반회계 빚을 모두 갚고 9억 원만 남았다">
      <text x={160} y={52} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">일반회계 빚</text>
      <rect x={30} y={70} width={120} height={44} rx={10} fill="var(--stone)" />
      <text x={90} y={99} textAnchor="middle" fontSize={17} fontWeight={800} fill="var(--graphite)"
            style={{ fontVariantNumeric: "tabular-nums" }}>190억</text>
      <path d="M164 92 H196" stroke="var(--ash)" strokeWidth={3} strokeLinecap="round" />
      <path d="M190 83 L202 92 L190 101 Z" fill="var(--ash)" />
      <rect x={212} y={70} width={78} height={44} rx={10} fill="var(--navy)" />
      <text x={251} y={99} textAnchor="middle" fontSize={20} fontWeight={900} fill="var(--canvas)">0</text>
      <text x={160} y={156} textAnchor="middle" fontSize={13} fill="var(--smoke)">다만 이만큼은 남았어요</text>
      <rect x={120} y={168} width={80} height={34} rx={17} fill="var(--pending-tint)" />
      <text x={160} y={191} textAnchor="middle" fontSize={15} fontWeight={800} fill="var(--pending)"
            style={{ fontVariantNumeric: "tabular-nums" }}>9억</text>
      <text x={160} y={224} textAnchor="middle" fontSize={11} fill="var(--ash)">나라 돈으로 자동으로 갚아지는 몫</text>
    </svg>
  );
}

/* ── 성남시의료원 ─────────────────────────────────────────── */

function HospitalClosed() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="동네 병원 두 곳이 문을 닫았다">
      <rect x={52} y={78} width={100} height={98} rx={10} fill="var(--stone)" />
      <rect x={168} y={78} width={100} height={98} rx={10} fill="var(--stone)" />
      <g fill="var(--ash)">
        <rect x={94} y={100} width={16} height={44} rx={3} />
        <rect x={80} y={114} width={44} height={16} rx={3} />
        <rect x={210} y={100} width={16} height={44} rx={3} />
        <rect x={196} y={114} width={44} height={16} rx={3} />
      </g>
      <g stroke="var(--burgundy)" strokeWidth={7} strokeLinecap="round">
        <path d="M66 92 L138 162" />
        <path d="M182 92 L254 162" />
      </g>
      <text x={160} y={56} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">병원 두 곳이 한꺼번에</text>
      <text x={160} y={210} textAnchor="middle" fontSize={13} fill="var(--ash)">아프면 멀리 가야 했어요</text>
    </svg>
  );
}

function CitizensPetition() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="시민들이 이름을 모아 조례를 발의했다">
      <g fill="var(--navy)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={58 + (i % 3) * 38} cy={92 + Math.floor(i / 3) * 40} r={14} />
        ))}
      </g>
      <path d="M168 122 H206" stroke="var(--navy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M200 113 L212 122 L200 131 Z" fill="var(--navy)" />
      <rect x={222} y={78} width={74} height={92} rx={10} fill="var(--canvas)"
            stroke="var(--navy)" strokeWidth={2.5} />
      <g stroke="var(--ash)" strokeWidth={3} strokeLinecap="round">
        <path d="M236 102 H282" />
        <path d="M236 118 H282" />
        <path d="M236 134 H268" />
      </g>
      <text x={259} y={64} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">조례안</text>
      <text x={160} y={210} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">시민이 직접 냈어요</text>
      <text x={160} y={230} textAnchor="middle" fontSize={12} fill="var(--ash)">전국에서 처음</text>
    </svg>
  );
}

function RejectedTwice() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="조례안이 두 번 부결됐다">
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${44 + i * 132} 70)`}>
          <rect width={92} height={100} rx={10} fill="var(--burgundy-tint)"
                stroke="var(--burgundy)" strokeWidth={2} />
          <g stroke="var(--burgundy)" strokeWidth={6} strokeLinecap="round">
            <path d="M30 34 L62 66" />
            <path d="M62 34 L30 66" />
          </g>
          <text x={46} y={92} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">
            {i === 0 ? "2004" : "2005"}
          </text>
        </g>
      ))}
      <text x={160} y={52} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">두 번 퇴짜</text>
      <text x={160} y={210} textAnchor="middle" fontSize={13} fill="var(--ash)">그래도 포기하지 않았어요</text>
    </svg>
  );
}

function PassedThird() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="세 번째에 만장일치로 통과됐다">
      <rect x={70} y={62} width={180} height={110} rx={14} fill="var(--navy-tint)"
            stroke="var(--navy)" strokeWidth={2.5} />
      <path d="M116 116 L144 146 L206 84" fill="none" stroke="var(--navy)" strokeWidth={12}
            strokeLinecap="round" strokeLinejoin="round" />
      <text x={160} y={44} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">세 번째, 만장일치</text>
      <text x={160} y={206} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--navy)">2006년 3월 15일</text>
      <text x={160} y={228} textAnchor="middle" fontSize={12} fill="var(--ash)">한 명도 반대하지 않았어요</text>
    </svg>
  );
}

function GroundBroken() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="조례 통과 7년 만에 기공식이 열렸다">
      <rect x={20} y={140} width={280} height={44} rx={8} fill="var(--taupe)" />
      <path d="M40 140 H90" stroke="var(--ash)" strokeWidth={3} strokeDasharray="7 7" />
      <text x={64} y={126} textAnchor="middle" fontSize={12} fill="var(--ash)">2006</text>
      <path d="M100 162 H236" stroke="var(--ash)" strokeWidth={3} strokeLinecap="round"
            strokeDasharray="8 8" />
      <text x={168} y={126} textAnchor="middle" fontSize={22} fontWeight={900} fill="var(--burgundy)">7년</text>
      <text x={168} y={210} textAnchor="middle" fontSize={12} fill="var(--ash)">아무 일도 일어나지 않았어요</text>
      <g transform="translate(252 108)">
        <path d="M0 52 L0 12" stroke="var(--navy)" strokeWidth={6} strokeLinecap="round" />
        <path d="M-14 12 L14 12 L8 -4 L-8 -4 Z" fill="var(--navy)" />
      </g>
      <text x={258} y={126} textAnchor="middle" fontSize={12} fill="var(--navy)">2013</text>
    </svg>
  );
}

function HospitalOpen() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="509병상 22개 진료과로 문을 열었다">
      <rect x={72} y={58} width={176} height={118} rx={12} fill="var(--navy)" />
      <g fill="var(--canvas)">
        <rect x={150} y={78} width={20} height={58} rx={4} />
        <rect x={131} y={97} width={58} height={20} rx={4} />
      </g>
      <g fill="var(--navy-tint)">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={88 + i * 12} y={144} width={8} height={18} rx={2} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`r${i}`} x={188 + i * 12} y={144} width={8} height={18} rx={2} />
        ))}
      </g>
      <text x={160} y={206} textAnchor="middle" fontSize={26} fontWeight={900} fill="var(--navy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>509병상</text>
      <text x={160} y={230} textAnchor="middle" fontSize={12} fill="var(--ash)">진료과 22개 · 2020년</text>
    </svg>
  );
}

/* ── 성남시 무상급식 ──────────────────────────────────────── */

function TrayBase({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <rect x={96} y={86} width={128} height={86} rx={12} fill="var(--stone)" />
      <circle cx={132} cy={112} r={16} fill="var(--taupe)" />
      <circle cx={176} cy={112} r={16} fill="var(--taupe)" />
      <rect x={112} y={136} width={96} height={22} rx={8} fill="var(--taupe)" />
      {children}
    </g>
  );
}

function LunchPay() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="예전에는 급식비를 냈다">
      <TrayBase>{null}</TrayBase>
      <circle cx={232} cy={78} r={26} fill="var(--burgundy)" />
      <text x={232} y={86} textAnchor="middle" fontSize={22} fontWeight={900} fill="var(--canvas)">₩</text>
      <text x={160} y={62} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">급식비를 냈어요</text>
      <text x={160} y={204} textAnchor="middle" fontSize={13} fill="var(--ash)">형편이 어려우면 눈치가 보였어요</text>
    </svg>
  );
}

function FirstGradeOnly() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="처음에는 초등학교 1학년만 무상급식이었다">
      <text x={160} y={48} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">초등학교</text>
      {[1, 2, 3, 4, 5, 6].map((g, i) => (
        <g key={g}>
          <rect x={26 + i * 46} y={78} width={38} height={72} rx={8}
                fill={i === 0 ? "var(--navy)" : "var(--stone)"} />
          <text x={45 + i * 46} y={120} textAnchor="middle" fontSize={15} fontWeight={800}
                fill={i === 0 ? "var(--canvas)" : "var(--ash)"}>{g}</text>
        </g>
      ))}
      <text x={45} y={176} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--navy)">무상</text>
      <text x={160} y={210} textAnchor="middle" fontSize={13} fill="var(--ash)">2007년, 아주 작게 시작했어요</text>
    </svg>
  );
}

function StepByStep() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="해마다 조금씩 대상을 넓혔다">
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={26 + i * 56} y={162 - i * 24} width={44} height={24 + i * 24}
              rx={6} fill="var(--navy)" opacity={0.35 + i * 0.16} />
      ))}
      <text x={48} y={204} textAnchor="middle" fontSize={12} fill="var(--ash)">2007</text>
      <text x={272} y={204} textAnchor="middle" fontSize={12} fill="var(--ash)">2013</text>
      <text x={160} y={52} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">한 학년씩, 한 학교씩</text>
      <text x={160} y={230} textAnchor="middle" fontSize={12} fill="var(--ash)">한 번에 다 한 게 아니에요</text>
    </svg>
  );
}

function AllCompulsory() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="초등학교와 중학교 전체가 무상급식이 됐다">
      <rect x={24} y={76} width={128} height={92} rx={14} fill="var(--navy)" />
      <text x={88} y={116} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--canvas)">초등학교</text>
      <text x={88} y={142} textAnchor="middle" fontSize={13} fill="var(--navy-tint)">전 학년</text>
      <rect x={168} y={76} width={128} height={92} rx={14} fill="var(--navy)" />
      <text x={232} y={116} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--canvas)">중학교</text>
      <text x={232} y={142} textAnchor="middle" fontSize={13} fill="var(--navy-tint)">전 학년</text>
      <text x={160} y={52} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">2013년, 의무교육 전체</text>
      <text x={160} y={206} textAnchor="middle" fontSize={13} fill="var(--ash)">모두 공짜로 먹게 됐어요</text>
    </svg>
  );
}

function HighSchoolToo() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="고등학교까지 확대된 것은 2018년 2학기다">
      <rect x={22} y={92} width={84} height={64} rx={12} fill="var(--navy)" />
      <text x={64} y={130} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--canvas)">초·중</text>
      <path d="M118 124 H166" stroke="var(--ash)" strokeWidth={3} strokeLinecap="round"
            strokeDasharray="8 7" />
      <path d="M160 115 L172 124 L160 133 Z" fill="var(--ash)" />
      <rect x={186} y={92} width={110} height={64} rx={12} fill="var(--pending-tint)"
            stroke="var(--pending)" strokeWidth={2} />
      <text x={241} y={122} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--pending)">고등학교</text>
      <text x={241} y={142} textAnchor="middle" fontSize={11} fill="var(--pending)">2018년 2학기</text>
      <text x={160} y={62} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">고등학교는 나중이에요</text>
      <text x={160} y={200} textAnchor="middle" fontSize={13} fill="var(--ash)">그때는 시장이 바뀐 뒤였어요</text>
    </svg>
  );
}

function LunchCount() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="약 10만 7천 명이 무상급식을 받는다">
      <text x={160} y={62} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">공짜로 점심을 먹는 아이들</text>
      <text x={160} y={132} textAnchor="middle" fontSize={44} fontWeight={900} fill="var(--navy)"
            style={{ fontVariantNumeric: "tabular-nums" }}>107,694</text>
      <text x={160} y={158} textAnchor="middle" fontSize={15} fill="var(--smoke)">명</text>
      <g fill="var(--navy)" opacity={0.28}>
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={40 + i * 18.5} cy={192} r={7} />
        ))}
      </g>
      <text x={160} y={224} textAnchor="middle" fontSize={12} fill="var(--ash)">유치원부터 고등학교까지</text>
    </svg>
  );
}


/* ── 경기도 청정계곡 ─────────────────────────────────────────── */

/** 계곡을 평상이 빼곡히 덮고 있다. 물이 거의 보이지 않는 것이 요지다. */
function ValleyBlocked() {
  // 평상 위치는 고정값이다. 난수를 쓰면 방문할 때마다 그림이 달라진다.
  const decks = [
    [46, 96], [96, 88], [146, 98], [196, 90], [246, 100],
    [62, 130], [112, 124], [162, 134], [212, 126], [258, 136],
    [78, 164], [128, 158], [178, 168], [228, 160],
  ] as const;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="계곡 물길이 평상으로 빼곡히 덮여 물이 거의 보이지 않는 모습">
      <path d="M18 78 C90 66, 230 66, 302 78 L302 196 C230 184, 90 184, 18 196 Z"
            fill="var(--navy)" opacity={0.18} />
      <path d="M18 78 C90 66, 230 66, 302 78" fill="none" stroke="var(--navy)" strokeWidth={3} />
      <path d="M18 196 C90 184, 230 184, 302 196" fill="none" stroke="var(--navy)" strokeWidth={3} />
      {decks.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={42} height={26} rx={3} fill="var(--burgundy)" opacity={0.9} />
          <rect x={x + 3} y={y + 26} width={4} height={7} fill="var(--graphite)" />
          <rect x={x + 35} y={y + 26} width={4} height={7} fill="var(--graphite)" />
        </g>
      ))}
      <text x={160} y={224} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        물에 발 담글 자리가 없다
      </text>
    </svg>
  );
}

/** 계곡은 국유지라는 것. 한 사람이 울타리를 치려 하지만 땅에는 '모두의 것'이 적혀 있다. */
function ValleyPublic() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="계곡은 나라 땅이어서 누구도 제 것처럼 막을 수 없다는 그림">
      <path d="M16 92 C90 78, 230 78, 304 92 L304 178 C230 164, 90 164, 16 178 Z"
            fill="var(--navy)" opacity={0.2} />
      <rect x={96} y={108} width={128} height={44} rx={6}
            fill="var(--canvas)" stroke="var(--navy)" strokeWidth={2.5} />
      <text x={160} y={136} textAnchor="middle" fontSize={16} {...LABEL} fill="var(--navy)">
        모두의 것
      </text>
      {/* 울타리를 치려다 만 손 */}
      <path d="M52 126 L52 168 M40 140 L64 140" stroke="var(--burgundy)" strokeWidth={4}
            strokeLinecap="round" strokeDasharray="5 6" />
      <path d="M268 126 L268 168 M256 140 L280 140" stroke="var(--burgundy)" strokeWidth={4}
            strokeLinecap="round" strokeDasharray="5 6" />
      <text x={160} y={206} textAnchor="middle" fontSize={12} fill="var(--ash)">
        하천·계곡은 국유지
      </text>
    </svg>
  );
}

/** 곧바로 부수지 않고 먼저 찾아가 알린다. 공문과 두 사람의 대화. */
function ValleyNotice() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="행정이 먼저 찾아가 알리고 설득하는 모습">
      <circle cx={92} cy={96} r={22} fill="var(--navy)" opacity={0.85} />
      <path d="M68 172 C70 140, 114 140, 116 172 Z" fill="var(--navy)" opacity={0.85} />
      <circle cx={226} cy={96} r={22} fill="var(--stone)" />
      <path d="M202 172 C204 140, 248 140, 250 172 Z" fill="var(--stone)" />
      {/* 건네는 공문 */}
      <rect x={134} y={112} width={52} height={38} rx={3}
            fill="var(--canvas)" stroke="var(--graphite)" strokeWidth={2} />
      <path d="M142 124 H178 M142 132 H178 M142 140 H166"
            stroke="var(--ash)" strokeWidth={2} strokeLinecap="round" />
      <path d="M118 131 H130" stroke="var(--graphite)" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M190 131 H200" stroke="var(--graphite)" strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray="3 4" />
      <text x={160} y={206} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        먼저 알리고 설득한다
      </text>
    </svg>
  );
}

/** 영업주가 제 손으로 평상을 걷어낸다. 걷어낸 자리에 물이 드러난다. */
function ValleySelfRemove() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="영업하던 사람이 제 손으로 평상을 걷어내 물이 드러나는 모습">
      <path d="M16 96 C90 84, 230 84, 304 96 L304 176 C230 164, 90 164, 16 176 Z"
            fill="var(--navy)" opacity={0.22} />
      {/* 남은 평상 하나, 그리고 들려 올라가는 평상 */}
      <rect x={40} y={128} width={46} height={26} rx={3} fill="var(--burgundy)" opacity={0.55} />
      <g transform="rotate(-24 196 96)">
        <rect x={172} y={80} width={52} height={28} rx={3} fill="var(--burgundy)" />
      </g>
      {/* 드는 사람 */}
      <circle cx={150} cy={140} r={16} fill="var(--navy)" />
      <path d="M132 190 C134 162, 168 162, 170 190 Z" fill="var(--navy)" />
      <path d="M160 136 L182 106" stroke="var(--navy)" strokeWidth={6} strokeLinecap="round" />
      <text x={160} y={220} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        스스로 걷어냈다
      </text>
    </svg>
  );
}

/** 끝내 응하지 않은 곳. 행정이 직접 집행한다 — 수가 적다는 것이 요지다. */
function ValleyForce() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="끝내 응하지 않은 소수의 시설을 행정이 직접 걷어내는 모습">
      <path d="M16 100 C90 88, 230 88, 304 100 L304 174 C230 162, 90 162, 16 174 Z"
            fill="var(--navy)" opacity={0.18} />
      <rect x={128} y={112} width={58} height={32} rx={3} fill="var(--burgundy)" />
      {/* 집행 표식 */}
      <path d="M118 104 L196 152 M196 104 L118 152"
            stroke="var(--burgundy)" strokeWidth={4} strokeLinecap="round" />
      <rect x={40} y={92} width={50} height={22} rx={4}
            fill="var(--canvas)" stroke="var(--graphite)" strokeWidth={2} />
      <text x={65} y={108} textAnchor="middle" fontSize={11} {...LABEL} fill="var(--graphite)">
        대집행
      </text>
      <text x={160} y={198} textAnchor="middle" fontSize={22} {...LABEL} fill="var(--burgundy)">
        49곳
      </text>
      <text x={160} y={218} textAnchor="middle" fontSize={12} fill="var(--ash)">
        철거된 곳의 3.6%
      </text>
    </svg>
  );
}

/** 평상이 사라진 계곡. 사람이 물가에 그냥 앉아 있다. */
function ValleyOpen() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="평상이 사라지고 사람들이 물가에 그냥 앉아 있는 계곡">
      <path d="M14 88 C90 74, 230 74, 306 88 L306 186 C230 172, 90 172, 14 186 Z"
            fill="var(--navy)" opacity={0.24} />
      <path d="M14 88 C90 74, 230 74, 306 88" fill="none" stroke="var(--navy)" strokeWidth={3} />
      <path d="M40 120 C80 112, 130 128, 176 118" fill="none" stroke="var(--canvas)"
            strokeWidth={3} strokeLinecap="round" opacity={0.8} />
      <path d="M150 150 C190 142, 240 156, 284 146" fill="none" stroke="var(--canvas)"
            strokeWidth={3} strokeLinecap="round" opacity={0.8} />
      {/* 물가에 앉은 두 사람 */}
      <circle cx={96} cy={150} r={13} fill="var(--ink)" />
      <path d="M80 190 C82 166, 112 166, 114 190 Z" fill="var(--ink)" />
      <circle cx={130} cy={156} r={11} fill="var(--graphite)" />
      <path d="M116 190 C118 170, 144 170, 146 190 Z" fill="var(--graphite)" />
      <text x={160} y={218} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        돈 내지 않아도 앉을 수 있다
      </text>
    </svg>
  );
}

/* ── 경기도 재난기본소득 ─────────────────────────────────────── */

/** 소득을 가리지 않는다. 줄 선 사람들 크기가 제각각인데 받는 봉투는 모두 같다. */
function BasicEveryone() {
  const people = [
    { x: 40, r: 13 }, { x: 92, r: 16 }, { x: 144, r: 11 },
    { x: 196, r: 15 }, { x: 248, r: 12 }, { x: 292, r: 14 },
  ] as const;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="키가 제각각인 사람들이 모두 똑같은 크기의 봉투를 받는 모습">
      {people.map((p) => (
        <g key={p.x}>
          <circle cx={p.x} cy={122 - p.r} r={p.r} fill="var(--navy)" opacity={0.85} />
          <path d={`M${p.x - p.r - 3} 186 C${p.x - p.r} ${150 - p.r}, ${p.x + p.r} ${150 - p.r}, ${p.x + p.r + 3} 186 Z`}
                fill="var(--navy)" opacity={0.85} />
          <rect x={p.x - 13} y={150} width={26} height={17} rx={2}
                fill="var(--canvas)" stroke="var(--graphite)" strokeWidth={1.5} />
          <text x={p.x} y={163} textAnchor="middle" fontSize={9} {...LABEL} fill="var(--navy)">10만</text>
        </g>
      ))}
      <text x={160} y={216} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        소득을 가리지 않는다
      </text>
    </svg>
  );
}

/** 현금이 아니라 경기도 안에서만 쓰는 카드. 지폐에 가위표, 카드에 동그라미. */
function BasicLocalCard() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="현금 대신 경기도 안에서만 쓸 수 있는 지역화폐 카드로 지급했다는 그림">
      {/* 현금 — 아니다 */}
      <rect x={30} y={96} width={92} height={54} rx={5}
            fill="var(--stone)" opacity={0.55} />
      <path d="M40 104 L112 142 M112 104 L40 142"
            stroke="var(--burgundy)" strokeWidth={4} strokeLinecap="round" />
      <text x={76} y={172} textAnchor="middle" fontSize={12} fill="var(--ash)">현금</text>
      {/* 카드 — 이것 */}
      <rect x={186} y={92} width={104} height={62} rx={7} fill="var(--navy)" />
      <rect x={196} y={108} width={22} height={16} rx={2} fill="var(--eggshell)" opacity={0.7} />
      <path d="M196 140 H272" stroke="var(--eggshell)" strokeWidth={3} strokeLinecap="round" opacity={0.75} />
      <circle cx={238} cy={123} r={44} fill="none" stroke="var(--navy)" strokeWidth={3} />
      <text x={238} y={182} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">
        경기지역화폐
      </text>
      <text x={160} y={216} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        도 안에서만 쓸 수 있다
      </text>
    </svg>
  );
}

/** 기한. 모래시계가 거의 다 흘렀고 남은 잔액이 사라진다. */
function BasicExpire() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="석 달이 지나면 남은 금액이 사라지는 것을 나타낸 모래시계">
      <path d="M116 56 H204 L168 118 L204 180 H116 L152 118 Z"
            fill="none" stroke="var(--graphite)" strokeWidth={3} strokeLinejoin="round" />
      {/* 위쪽 남은 모래는 적고 아래쪽에 쌓였다 */}
      <path d="M134 68 H186 L168 100 L152 100 Z" fill="var(--burgundy)" opacity={0.75} />
      <path d="M126 170 H194 L168 132 L152 132 Z" fill="var(--navy)" opacity={0.6} />
      <path d="M160 104 V128" stroke="var(--burgundy)" strokeWidth={2.5} strokeDasharray="3 4" />
      <text x={252} y={106} textAnchor="middle" fontSize={26} {...LABEL} fill="var(--burgundy)">3</text>
      <text x={252} y={128} textAnchor="middle" fontSize={13} fill="var(--ash)">개월</text>
      <text x={160} y={214} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        안 쓰면 사라진다
      </text>
    </svg>
  );
}

/** 큰 매장은 막히고 동네 가게로 흘러든다. */
function BasicShops() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="대형마트에서는 쓸 수 없고 동네 가게와 시장으로 돈이 흘러가는 모습">
      {/* 큰 매장 — 막힘 */}
      <rect x={28} y={72} width={88} height={86} rx={4} fill="var(--stone)" opacity={0.6} />
      <path d="M38 80 L106 150 M106 80 L38 150"
            stroke="var(--burgundy)" strokeWidth={4} strokeLinecap="round" />
      <text x={72} y={176} textAnchor="middle" fontSize={11} fill="var(--ash)">대형마트</text>
      {/* 화살표가 동네 쪽으로 */}
      <path d="M126 116 H176" stroke="var(--navy)" strokeWidth={3} strokeLinecap="round" />
      <path d="M168 108 L178 116 L168 124" fill="none" stroke="var(--navy)"
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {/* 동네 가게 셋 */}
      {[196, 238, 280].map((x, i) => (
        <g key={x}>
          <rect x={x - 17} y={100 + i * 4} width={34} height={44} rx={3} fill="var(--navy)" opacity={0.85} />
          <path d={`M${x - 21} ${100 + i * 4} H${x + 21} L${x} ${86 + i * 4} Z`} fill="var(--navy)" />
        </g>
      ))}
      <text x={238} y={176} textAnchor="middle" fontSize={11} fill="var(--navy)">동네 가게</text>
      <text x={160} y={214} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        돈이 동네에 남는다
      </text>
    </svg>
  );
}

/** 세 번. 회차마다 봉투 크기와 사람 수가 다르다. */
function BasicRounds() {
  const rounds = [
    { x: 58, label: "1차", w: 54, note: "전 도민" },
    { x: 160, label: "2차", w: 54, note: "외국인까지" },
    { x: 262, label: "3차", w: 28, note: "상위 12%" },
  ] as const;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="세 차례에 걸쳐 지급했고 세 번째는 대상이 훨씬 적었다는 그림">
      {rounds.map((r, i) => (
        <g key={r.label}>
          <rect x={r.x - r.w / 2} y={96} width={r.w} height={58} rx={4}
                fill={i === 2 ? "var(--burgundy)" : "var(--navy)"} opacity={0.85} />
          <text x={r.x} y={84} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
            {r.label}
          </text>
          <text x={r.x} y={174} textAnchor="middle" fontSize={11} fill="var(--ash)">
            {r.note}
          </text>
        </g>
      ))}
      <text x={160} y={214} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        세 번째는 대상이 달랐다
      </text>
    </svg>
  );
}

/** 정부가 88%, 경기도가 나머지 12%. 한 줄 막대가 둘로 갈린다. */
function BasicTop12() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="정부가 소득 하위 88퍼센트를, 경기도가 나머지 12퍼센트를 맡은 모습">
      <rect x={24} y={104} width={236} height={40} rx={6} fill="var(--stone)" />
      <rect x={260} y={104} width={36} height={40} rx={6} fill="var(--burgundy)" />
      <text x={142} y={131} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--graphite)">
        정부 88%
      </text>
      <text x={278} y={92} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">
        12%
      </text>
      <path d="M278 96 V102" stroke="var(--burgundy)" strokeWidth={2} strokeLinecap="round" />
      <text x={278} y={166} textAnchor="middle" fontSize={11} fill="var(--burgundy)">경기도</text>
      <text x={160} y={206} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        빠지는 사람이 없도록
      </text>
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

  "uniform-free": UniformFree,
  "postpartum-free": PostpartumFree,
  "youth-dividend": YouthDividend,
  "three-together": ThreeTogether,
  "gov-block": GovBlock,
  "case-dropped": CaseDropped,

  "inherited-debt": InheritedDebt,
  "wrong-pocket": WrongPocket,
  "declare-moratorium": DeclareMoratorium,
  "tighten-belt": TightenBelt,
  "paid-off": PaidOff,
  "debt-zero": DebtZero,

  "hospital-closed": HospitalClosed,
  "citizens-petition": CitizensPetition,
  "rejected-twice": RejectedTwice,
  "passed-third": PassedThird,
  "ground-broken": GroundBroken,
  "hospital-open": HospitalOpen,

  "lunch-pay": LunchPay,
  "first-grade-only": FirstGradeOnly,
  "step-by-step": StepByStep,
  "all-compulsory": AllCompulsory,
  "high-school-too": HighSchoolToo,
  "lunch-count": LunchCount,

  "valley-blocked": ValleyBlocked,
  "valley-public": ValleyPublic,
  "valley-notice": ValleyNotice,
  "valley-selfremove": ValleySelfRemove,
  "valley-force": ValleyForce,
  "valley-open": ValleyOpen,

  "basic-everyone": BasicEveryone,
  "basic-localcard": BasicLocalCard,
  "basic-expire": BasicExpire,
  "basic-shops": BasicShops,
  "basic-rounds": BasicRounds,
  "basic-top12": BasicTop12,
};
