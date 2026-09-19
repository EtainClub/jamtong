import type { WordArt } from "@/content/words/schema";

/**
 * 언행 삽화.
 *
 * 업적 삽화가 항로·예산·좌석처럼 **사실의 모양**을 그린다면, 여기는 사람
 * 사이에 오가는 일을 그린다. 그래서 더 단순하게 간다 — 사람은 동그라미 하나,
 * 말은 네모 하나다. 얼굴을 그리면 누구인지 찾게 되고, 이 글은 특정 개인을
 * 가리키지 않는 글이다.
 *
 * 무대는 업적 쪽과 같은 320×240이고, 색도 같은 토큰을 쓴다.
 */

const LABEL = {
  fontFamily: "inherit",
  fontWeight: 800,
} as const;

/** 사람 하나. 머리와 어깨만. */
function Person({
  x,
  y,
  fill,
  scale = 1,
  rotate = 0,
  opacity = 1,
}: {
  x: number;
  y: number;
  fill: string;
  scale?: number;
  /** 몸을 기울인다. 숙이는 자세를 표정 없이 그리려면 이것이 필요하다. */
  rotate?: number;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      <circle cx={0} cy={-14} r={11} fill={fill} />
      <path d="M-17 14 A17 17 0 0 1 17 14 Z" fill={fill} />
    </g>
  );
}

/** 남의 글 한 조각을 집어 온다. */
function QuotePick() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="남이 쓴 여러 글 가운데 한 조각을 집어 와 인용한 모습">
      <g opacity={0.45}>
        <rect x={22} y={52} width={104} height={20} rx={5} fill="var(--stone)" />
        <rect x={22} y={110} width={104} height={20} rx={5} fill="var(--stone)" />
        <rect x={22} y={138} width={104} height={20} rx={5} fill="var(--stone)" />
        <rect x={22} y={166} width={104} height={20} rx={5} fill="var(--stone)" />
      </g>
      <rect x={20} y={79} width={108} height={24} rx={5} fill="var(--navy)" />
      <text x={74} y={212} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ash)">
        남이 쓴 글들
      </text>
      <path d="M142 91 H186" stroke="var(--navy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M177 82 L188 91 L177 100" fill="none" stroke="var(--navy)"
            strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={200} y={62} width={98} height={72} rx={8}
            fill="var(--canvas)" stroke="var(--navy)" strokeWidth={3} />
      <rect x={214} y={79} width={70} height={24} rx={5} fill="var(--navy)" />
      <text x={249} y={212} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">
        가져온 한 조각
      </text>
    </svg>
  );
}

/** 조각 하나와 그 사람 전체는 다르다. */
function PartWhole() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="가져온 글 한 조각과 그 사람이 쓴 글 전체가 다르다는 것을 나타낸 그림">
      <rect x={30} y={62} width={96} height={30} rx={6} fill="var(--navy)" />
      <text x={78} y={120} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">
        가져온 글
      </text>
      <text x={160} y={90} textAnchor="middle" fontSize={26} {...LABEL} fill="var(--ash)">≠</text>
      <g opacity={0.5}>
        <rect x={196} y={50} width={96} height={16} rx={4} fill="var(--stone)" />
        <rect x={196} y={72} width={96} height={16} rx={4} fill="var(--stone)" />
        <rect x={196} y={94} width={70} height={16} rx={4} fill="var(--stone)" />
      </g>
      <text x={244} y={134} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ash)">
        그 사람 글 전부
      </text>
      <text x={160} y={186} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        하나를 가져왔다고
      </text>
      <text x={160} y={210} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        다 동의하는 건 아니에요
      </text>
    </svg>
  );
}

/**
 * 마음이 상한 사람에게.
 *
 * 얼굴을 그리지 않는다는 규칙을 여기서도 지킨다. 입꼬리를 그려 넣으면
 * 표정을 읽으려 들고, 그러면 이 동그라미가 누구인지 찾게 된다. 사과는
 * 표정이 아니라 **자세**로 그린다 — 한쪽이 상대 쪽으로 몸을 숙인다.
 */
function Sorry() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="한 사람이 마음이 상한 사람 쪽으로 몸을 숙여 유감을 전하는 모습">
      <Person x={100} y={122} fill="var(--navy)" scale={1.6} rotate={20} />
      <Person x={228} y={122} fill="var(--burgundy)" scale={1.6} opacity={0.7} />
      <path d="M142 74 Q184 54 210 76" fill="none" stroke="var(--graphite)"
            strokeWidth={2.5} strokeLinecap="round" strokeDasharray="6 7" />
      <text x={100} y={168} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">
        대통령
      </text>
      <text x={228} y={168} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">
        상처받은 사람
      </text>
      <text x={160} y={212} textAnchor="middle" fontSize={17} {...LABEL} fill="var(--ink)">
        마음 상했다면 미안해요
      </text>
    </svg>
  );
}

/** 친구를 보면 그 사람을 안다. */
function ByFriends() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="대통령 옆에 선 사람을 사람들이 함께 바라보는 모습">
      <Person x={124} y={78} fill="var(--navy)" scale={1.25} />
      <Person x={196} y={78} fill="var(--burgundy)" scale={1.25} />
      <text x={124} y={124} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">대통령</text>
      <text x={196} y={124} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">친구</text>
      <g opacity={0.55}>
        {[42, 90, 138, 186, 234, 282].map((x) => (
          <Person key={x} x={x} y={190} fill="var(--graphite)" scale={0.7} />
        ))}
      </g>
      {[124, 196].map((x) => (
        <path key={x} d={`M${x} 176 L${x} 140`} stroke="var(--graphite)"
              strokeWidth={2} strokeDasharray="5 6" strokeLinecap="round" opacity={0.6} />
      ))}
      <text x={160} y={228} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ash)">
        사람들은 둘을 같이 봐요
      </text>
    </svg>
  );
}

/** 팻말 붙이고 험하게 굴던 사람. */
function StreetBadge() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="지지자라는 팻말을 붙인 채 험하게 구는 사람 때문에 표가 떨어져 나가는 모습">
      <Person x={88} y={96} fill="var(--burgundy)" scale={1.4} />
      <rect x={58} y={110} width={60} height={22} rx={4} fill="var(--eggshell)"
            stroke="var(--burgundy)" strokeWidth={2} />
      <text x={88} y={126} textAnchor="middle" fontSize={11} {...LABEL} fill="var(--burgundy)">지지자</text>
      <path d="M126 74 L146 66 M128 86 L150 86 M126 98 L146 106"
            stroke="var(--burgundy)" strokeWidth={3} strokeLinecap="round" />
      <g opacity={0.6}>
        {[212, 254, 296].map((x, i) => (
          <Person key={x} x={x} y={100 + i * 6} fill="var(--graphite)" scale={0.85} />
        ))}
      </g>
      <path d="M196 150 Q240 176 292 156" fill="none" stroke="var(--graphite)"
            strokeWidth={2.5} strokeDasharray="6 7" strokeLinecap="round" />
      <text x={160} y={200} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        사람들이 등을 돌렸어요
      </text>
      <text x={160} y={224} textAnchor="middle" fontSize={12} fill="var(--ash)">
        계양구 선거 때 있었던 일
      </text>
    </svg>
  );
}

/** 내 편은 줄고 상대는 는다. */
function FewerMore() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="거친 말 때문에 우리 편은 줄고 상대는 늘어나는 모습">
      <text x={82} y={54} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--navy)">우리 편</text>
      <rect x={34} y={68} width={96} height={54} rx={7} fill="var(--navy)" opacity={0.85} />
      <path d="M82 138 V174" stroke="var(--navy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M72 164 L82 176 L92 164" fill="none" stroke="var(--navy)"
            strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <text x={82} y={206} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--navy)">줄어요</text>

      <text x={238} y={54} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--burgundy)">반대편</text>
      <rect x={190} y={68} width={96} height={54} rx={7} fill="var(--burgundy)" opacity={0.85} />
      <path d="M238 174 V138" stroke="var(--burgundy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M228 148 L238 136 L248 148" fill="none" stroke="var(--burgundy)"
            strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <text x={238} y={206} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--burgundy)">늘어요</text>
    </svg>
  );
}

/** 지지자인 척 지지자를 찌른다. */
function Masked() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="가면을 쓴 사람이 지지자인 척하며 같은 편을 공격하는 모습">
      {/* 본체는 회색. 가면만 남색이라 '쓴 것'과 '그 사람'이 갈린다 */}
      <Person x={104} y={100} fill="var(--graphite)" scale={1.35} />
      <g>
        {/* 얼굴 앞에 덧댄 판. 머리보다 작고 한쪽으로 치우쳐 얹혀 있다 */}
        <ellipse cx={100} cy={78} rx={16} ry={19} fill="var(--navy)"
                 stroke="var(--canvas)" strokeWidth={2.5} />
        <ellipse cx={94} cy={74} rx={3.4} ry={4.6} fill="var(--canvas)" />
        <ellipse cx={107} cy={74} rx={3.4} ry={4.6} fill="var(--canvas)" />
        <path d="M94 88 H107" stroke="var(--canvas)" strokeWidth={2} strokeLinecap="round" />
        {/* 끈. 머리 뒤로 넘어가는 것이 보여야 '쓴 것'으로 읽힌다 */}
        <path d="M116 76 Q126 80 122 90" fill="none" stroke="var(--navy)"
              strokeWidth={2.5} strokeLinecap="round" />
      </g>
      <text x={104} y={152} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">
        지지자인 척
      </text>
      <path d="M146 92 H196" stroke="var(--burgundy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M187 83 L198 92 L187 101" fill="none" stroke="var(--burgundy)"
            strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <Person x={240} y={100} fill="var(--navy)" scale={1.35} />
      <text x={240} y={152} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">
        진짜 지지자
      </text>
      <text x={160} y={204} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        우리끼리 싸우게 만들어요
      </text>
    </svg>
  );
}

/** 거친 말을 내려놓고. */
function CalmWords() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="거친 말을 내려놓고 차분한 말로 바꾸는 모습">
      <g opacity={0.45}>
        <path d="M30 58 L54 86 L34 94 L58 122 L30 118 L44 142 L18 126 L26 96 L14 78 Z"
              fill="var(--burgundy)" />
        <text x={74} y={170} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">
          거친 말
        </text>
        <path d="M34 150 L114 150" stroke="var(--burgundy)" strokeWidth={2.5}
              strokeLinecap="round" />
      </g>
      <path d="M134 100 H176" stroke="var(--navy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M167 91 L178 100 L167 109" fill="none" stroke="var(--navy)"
            strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={196} y={58} width={100} height={72} rx={22} fill="var(--navy)" />
      <path d="M216 130 L214 152 L238 130 Z" fill="var(--navy)" />
      <rect x={214} y={80} width={64} height={9} rx={4} fill="var(--eggshell)" opacity={0.85} />
      <rect x={214} y={99} width={44} height={9} rx={4} fill="var(--eggshell)" opacity={0.6} />
      <text x={246} y={176} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">
        차분한 말
      </text>
      <text x={160} y={218} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        사실을 가지고 설득해 주세요
      </text>
    </svg>
  );
}


/* ── 청년의 날 ────────────────────────────────────────────────── */

/** 청년들을 만나 이야기를 듣다. */
function YouthMeet() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="여러 사람이 둘러앉아 이야기하고 한 사람이 그것을 받아 적는 모습">
      <Person x={160} y={196} fill="var(--navy)" scale={1.25} />
      {[
        { x: 58, y: 96 },
        { x: 120, y: 66 },
        { x: 200, y: 66 },
        { x: 262, y: 96 },
      ].map((n) => (
        <Person key={n.x} x={n.x} y={n.y} fill="var(--burgundy)" scale={1.05} opacity={0.8} />
      ))}
      {[
        { x: 58, y: 96 },
        { x: 120, y: 66 },
        { x: 200, y: 66 },
        { x: 262, y: 96 },
      ].map((n) => (
        <path key={`l${n.x}`} d={`M${n.x} ${n.y + 20} Q${(n.x + 160) / 2} ${n.y + 80} 160 172`}
              fill="none" stroke="var(--graphite)" strokeWidth={2}
              strokeDasharray="5 6" strokeLinecap="round" opacity={0.55} />
      ))}
      <text x={160} y={228} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        듣는 자리
      </text>
    </svg>
  );
}

/** 오래 공부하고 오래 기다린다. */
function LongestWait() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="공부한 기간도 가장 길고 기다리는 기간도 가장 긴 것을 나타낸 막대">
      <text x={24} y={70} fontSize={13} {...LABEL} fill="var(--navy)">공부한 시간</text>
      <rect x={24} y={80} width={252} height={26} rx={6} fill="var(--navy)" />
      <text x={24} y={148} fontSize={13} {...LABEL} fill="var(--burgundy)">기다리는 시간</text>
      <rect x={24} y={158} width={252} height={26} rx={6} fill="var(--burgundy)" />
      <text x={160} y={222} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        둘 다 가장 길어요
      </text>
    </svg>
  );
}

/** 문이 줄었다. */
function FewerDoors() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="예전에는 여러 개였던 문이 지금은 하나만 남은 모습">
      <text x={82} y={48} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ash)">예전</text>
      <g opacity={0.45}>
        {[24, 68, 112].map((x) => (
          <g key={x}>
            <rect x={x} y={64} width={32} height={62} rx={3}
                  fill="none" stroke="var(--graphite)" strokeWidth={2.5} />
            <circle cx={x + 26} cy={96} r={2.4} fill="var(--graphite)" />
          </g>
        ))}
      </g>
      <text x={238} y={48} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">지금</text>
      <rect x={222} y={64} width={32} height={62} rx={3}
            fill="none" stroke="var(--navy)" strokeWidth={3} />
      <circle cx={248} cy={96} r={2.6} fill="var(--navy)" />
      <g opacity={0.3}>
        {[178, 266].map((x) => (
          <path key={x} d={`M${x} 68 L${x + 28} 122 M${x + 28} 68 L${x} 122`}
                stroke="var(--graphite)" strokeWidth={2.5} strokeLinecap="round" />
        ))}
      </g>
      <text x={160} y={176} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        들어갈 문이 줄었어요
      </text>
      <text x={160} y={202} textAnchor="middle" fontSize={12} fill="var(--ash)">
        열심히 안 해서가 아니에요
      </text>
    </svg>
  );
}

/** 아동과 노인 사이의 빈 자리. */
function BlindSpot() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="아동과 노인 자리는 채워져 있고 그 사이 청년 자리만 비어 있는 모습">
      <rect x={18} y={74} width={84} height={76} rx={8} fill="var(--navy)" opacity={0.85} />
      <text x={60} y={118} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">아동</text>
      <text x={60} y={172} textAnchor="middle" fontSize={12} fill="var(--ash)">돌봄</text>

      <rect x={118} y={74} width={84} height={76} rx={8} fill="none"
            stroke="var(--burgundy)" strokeWidth={3} strokeDasharray="7 7" />
      <text x={160} y={118} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">청년</text>
      <text x={160} y={172} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">비어 있음</text>

      <rect x={218} y={74} width={84} height={76} rx={8} fill="var(--navy)" opacity={0.85} />
      <text x={260} y={118} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">노인</text>
      <text x={260} y={172} textAnchor="middle" fontSize={12} fill="var(--ash)">부양</text>

      <text x={160} y={214} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        늘 뒤로 밀렸어요
      </text>
    </svg>
  );
}

/** 무엇은 분명한데 어떻게가 어렵다. */
function HardHow() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="무엇을 할지는 또렷한데 어떻게 할지는 흐린 것을 나타낸 그림">
      <rect x={26} y={72} width={110} height={78} rx={8} fill="var(--navy)" />
      <text x={81} y={106} textAnchor="middle" fontSize={26} {...LABEL} fill="var(--eggshell)">무엇</text>
      <text x={81} y={132} textAnchor="middle" fontSize={12} fill="var(--eggshell)" opacity={0.85}>
        분명하다
      </text>

      <rect x={184} y={72} width={110} height={78} rx={8} fill="none"
            stroke="var(--burgundy)" strokeWidth={3} strokeDasharray="8 8" />
      <text x={239} y={106} textAnchor="middle" fontSize={26} {...LABEL} fill="var(--burgundy)">
        어떻게
      </text>
      <text x={239} y={132} textAnchor="middle" fontSize={12} fill="var(--burgundy)" opacity={0.8}>
        어렵다
      </text>

      <text x={160} y={196} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        쉬웠다면 진작 했을 거예요
      </text>
    </svg>
  );
}

/** 탁상이 아니라 현장에서. */
function FromField() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="책상에서가 아니라 사람들이 있는 곳에서 답을 찾겠다는 모습">
      <g opacity={0.4}>
        <rect x={22} y={92} width={96} height={10} rx={3} fill="var(--graphite)" />
        <path d="M34 102 V142 M106 102 V142" stroke="var(--graphite)"
              strokeWidth={4} strokeLinecap="round" />
        <text x={70} y={168} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">
          탁상
        </text>
        <path d="M28 84 L112 150 M112 84 L28 150" stroke="var(--graphite)"
              strokeWidth={2.5} strokeLinecap="round" />
      </g>

      <path d="M132 118 H172" stroke="var(--navy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M163 109 L174 118 L163 127" fill="none" stroke="var(--navy)"
            strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />

      {[204, 244, 284].map((x, i) => (
        <Person key={x} x={x} y={122 + (i % 2) * 8} fill="var(--navy)" scale={1.05} />
      ))}
      <text x={244} y={168} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">
        현장
      </text>

      <text x={160} y={212} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        거기서 답을 찾겠대요
      </text>
    </svg>
  );
}
export const WORD_ART: Record<WordArt, () => React.ReactNode> = {
  "quote-pick": QuotePick,
  "part-whole": PartWhole,
  sorry: Sorry,
  "by-friends": ByFriends,
  "street-badge": StreetBadge,
  "fewer-more": FewerMore,
  masked: Masked,
  "calm-words": CalmWords,
  "youth-meet": YouthMeet,
  "longest-wait": LongestWait,
  "fewer-doors": FewerDoors,
  "blind-spot": BlindSpot,
  "hard-how": HardHow,
  "from-field": FromField,
};
