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

/* ── 개혁론 ──────────────────────────────────────────────────── */

/** 36년 전과 지금, 같은 목표. */
function SameDream() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="오래 전의 사람과 지금의 사람이 같은 곳을 바라보는 모습">
      <Person x={58} y={126} fill="var(--graphite)" scale={1.2} opacity={0.6} />
      <text x={58} y={168} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">36년 전</text>
      <Person x={162} y={126} fill="var(--navy)" scale={1.2} />
      <text x={162} y={168} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">지금</text>
      <circle cx={272} cy={110} r={22} fill="none" stroke="var(--burgundy)" strokeWidth={3} />
      <circle cx={272} cy={110} r={7} fill="var(--burgundy)" />
      <text x={272} y={168} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">같은 목표</text>
      {[58, 162].map((x) => (
        <path key={x} d={`M${x + 24} 112 H244`} stroke="var(--graphite)" strokeWidth={2}
              strokeDasharray="5 6" strokeLinecap="round" opacity={0.5} />
      ))}
      <text x={160} y={212} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        꿈은 안 바뀌었대요
      </text>
    </svg>
  );
}

/** 빠른 길은 되돌아오고, 느린 길은 닿는다. */
function SlowRoad() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="서둘러 간 길은 되돌아오고 차근히 간 길은 목적지에 닿는 모습">
      <circle cx={30} cy={128} r={9} fill="var(--graphite)" />
      <circle cx={290} cy={128} r={11} fill="var(--burgundy)" />
      <text x={290} y={106} textAnchor="middle" fontSize={11} {...LABEL} fill="var(--burgundy)">목표</text>

      <path d="M42 96 Q140 46 210 78 Q246 94 190 104" fill="none" stroke="var(--burgundy)"
            strokeWidth={3} strokeLinecap="round" />
      <path d="M200 96 L186 105 L200 113" fill="none" stroke="var(--burgundy)"
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <text x={120} y={40} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">
        서두르면 되돌아와요
      </text>

      <path d="M42 150 H276" stroke="var(--navy)" strokeWidth={3}
            strokeLinecap="round" strokeDasharray="14 9" />
      <path d="M268 142 L280 150 L268 158" fill="none" stroke="var(--navy)"
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <text x={150} y={182} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">
        차근히 가면 닿아요
      </text>

      <text x={160} y={220} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        개혁은 혁명보다 어렵대요
      </text>
    </svg>
  );
}

/** 절차와 공감을 밟아 간다. */
function CarefulSteps() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="계단을 한 칸씩 밟아 올라가는 모습">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={30 + i * 62} y={162 - i * 30} width={58} height={{ 0: 30, 1: 60, 2: 90, 3: 120 }[i]}
              rx={5} fill="var(--navy)" opacity={0.35 + i * 0.2} />
      ))}
      {["공감", "절차", "성과", "증명"].map((t, i) => (
        <text key={t} x={59 + i * 62} y={186} textAnchor="middle" fontSize={12}
              {...LABEL} fill="var(--navy)">{t}</text>
      ))}
      <text x={160} y={218} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        한 칸씩 밟아 올라가요
      </text>
    </svg>
  );
}

/** 권한이 커지면 책임도 커진다. */
function PowerWeight() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="권한이 커질수록 책임도 함께 커지는 것을 저울로 나타낸 그림">
      <path d="M160 58 V172" stroke="var(--graphite)" strokeWidth={4} strokeLinecap="round" />
      <path d="M120 186 H200" stroke="var(--graphite)" strokeWidth={4} strokeLinecap="round" />
      <path d="M52 76 H268" stroke="var(--graphite)" strokeWidth={4} strokeLinecap="round" />
      <circle cx={160} cy={76} r={7} fill="var(--graphite)" />

      <path d="M52 76 V112" stroke="var(--graphite)" strokeWidth={2} />
      <rect x={20} y={112} width={64} height={44} rx={6} fill="var(--navy)" />
      <text x={52} y={140} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">권한</text>

      <path d="M268 76 V112" stroke="var(--graphite)" strokeWidth={2} />
      <rect x={236} y={112} width={64} height={44} rx={6} fill="var(--burgundy)" />
      <text x={268} y={140} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">책임</text>

      <text x={160} y={222} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        하나가 커지면 다른 하나도 커져요
      </text>
    </svg>
  );
}

/** 선거는 전쟁이 아니다. */
function NotWar() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="모두를 대표하는 일과 모두를 차지하는 일이 다르다는 것을 나타낸 그림">
      <rect x={20} y={62} width={116} height={92} rx={8} fill="var(--navy)" opacity={0.15}
            stroke="var(--navy)" strokeWidth={2.5} />
      {[46, 78, 110].map((x) => (
        <Person key={x} x={x} y={122} fill="var(--navy)" scale={0.72} />
      ))}
      <text x={78} y={176} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">대표</text>
      <text x={78} y={196} textAnchor="middle" fontSize={11} fill="var(--ash)">모두를 위해</text>

      <text x={160} y={112} textAnchor="middle" fontSize={24} {...LABEL} fill="var(--ash)">≠</text>

      <g opacity={0.5}>
        <rect x={184} y={62} width={116} height={92} rx={8} fill="none"
              stroke="var(--burgundy)" strokeWidth={2.5} strokeDasharray="7 7" />
        <Person x={242} y={126} fill="var(--burgundy)" scale={1.05} />
        <text x={242} y={176} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">정복</text>
        <text x={242} y={196} textAnchor="middle" fontSize={11} fill="var(--ash)">다 차지</text>
      </g>

      <text x={160} y={224} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        선거는 전쟁이 아니에요
      </text>
    </svg>
  );
}

/* ── 유가 ────────────────────────────────────────────────────── */

/** 주유소 가격판이 잠잠하다. */
function PumpSteady() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="주유소 가격판의 값이 흔들리지 않는 모습">
      <rect x={82} y={56} width={156} height={92} rx={10}
            fill="var(--navy)" />
      <rect x={100} y={78} width={120} height={16} rx={4} fill="var(--eggshell)" opacity={0.85} />
      <rect x={100} y={104} width={120} height={16} rx={4} fill="var(--eggshell)" opacity={0.6} />
      <path d="M120 162 H200" stroke="var(--navy)" strokeWidth={4} strokeLinecap="round" />
      <path d="M160 148 V162" stroke="var(--navy)" strokeWidth={4} strokeLinecap="round" />
      <text x={160} y={198} textAnchor="middle" fontSize={16} {...LABEL} fill="var(--ink)">
        값은 안 오를 거예요
      </text>
      <text x={160} y={220} textAnchor="middle" fontSize={12} fill="var(--ash)">
        걱정 말라고 했어요
      </text>
    </svg>
  );
}

/** 사 오는 곳을 늘렸다. */
function ManySuppliers() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="한 곳에서만 사 오던 기름을 여러 곳에서 사 오게 된 모습">
      <text x={78} y={48} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--ash)">예전</text>
      <g opacity={0.5}>
        <rect x={46} y={62} width={64} height={30} rx={6} fill="var(--burgundy)" />
        <text x={78} y={82} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--eggshell)">중동</text>
        <path d="M78 96 V132" stroke="var(--burgundy)" strokeWidth={5} strokeLinecap="round" />
        <circle cx={78} cy={148} r={14} fill="var(--graphite)" />
      </g>

      <text x={232} y={48} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">지금</text>
      {[
        { x: 170, c: "var(--burgundy)", t: "중동" },
        { x: 232, c: "var(--navy)", t: "미국" },
        { x: 294, c: "var(--navy)", t: "남미" },
      ].map((n) => (
        <g key={n.x}>
          <rect x={n.x - 28} y={62} width={56} height={30} rx={6} fill={n.c} />
          <text x={n.x} y={82} textAnchor="middle" fontSize={11} {...LABEL} fill="var(--eggshell)">{n.t}</text>
          <path d={`M${n.x} 96 Q${n.x} 118 232 132`} fill="none" stroke={n.c}
                strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
        </g>
      ))}
      <circle cx={232} cy={148} r={16} fill="var(--navy)" />
      <text x={232} y={153} textAnchor="middle" fontSize={11} {...LABEL} fill="var(--eggshell)">한국</text>

      <text x={160} y={212} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        사 오는 곳을 늘렸어요
      </text>
    </svg>
  );
}

/** 국제가는 뛰는데 국내가는 눌렸다. */
function CapGap() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="국제 가격은 크게 오르는데 국내 가격은 거의 그대로인 모습">
      <path d="M32 172 L86 148 L140 116 L194 84 L248 58 L292 42"
            fill="none" stroke="var(--burgundy)" strokeWidth={3.5} strokeLinecap="round" />
      <text x={290} y={32} textAnchor="end" fontSize={12} {...LABEL} fill="var(--burgundy)">국제 가격</text>
      <path d="M32 176 L86 174 L140 172 L194 171 L248 170 L292 169"
            fill="none" stroke="var(--navy)" strokeWidth={3.5} strokeLinecap="round" />
      <text x={290} y={196} textAnchor="end" fontSize={12} {...LABEL} fill="var(--navy)">국내 가격</text>
      <path d="M292 46 V165" stroke="var(--graphite)" strokeWidth={2}
            strokeDasharray="5 5" strokeLinecap="round" opacity={0.6} />
      <text x={160} y={224} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        최고가격제로 눌러 뒀대요
      </text>
    </svg>
  );
}

/** 그래도 아직 위험하다. */
function StillRisk() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="중동 의존이 여전히 절반이고 전쟁이 끝나지 않았다는 것을 나타낸 그림">
      <circle cx={160} cy={108} r={52} fill="var(--stone)" />
      <path d="M160 56 A52 52 0 0 1 160 160 Z" fill="var(--burgundy)" opacity={0.85} />
      <text x={160} y={114} textAnchor="middle" fontSize={20} {...LABEL} fill="var(--ink)">50%</text>
      <text x={160} y={186} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">
        아직 절반은 중동
      </text>
      <text x={160} y={212} textAnchor="middle" fontSize={12} fill="var(--ash)">
        전쟁은 언제 끝날지 몰라요
      </text>
    </svg>
  );
}

/* ── 발달장애인 돌봄 ─────────────────────────────────────────── */

/** 아버지의 마지막 걱정. */
function FatherWorry() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="아버지가 자녀의 앞날을 걱정하는 모습">
      <Person x={112} y={130} fill="var(--graphite)" scale={1.35} opacity={0.55} />
      <Person x={196} y={138} fill="var(--navy)" scale={1.1} />
      <path d="M134 104 Q160 78 184 100" fill="none" stroke="var(--burgundy)"
            strokeWidth={2.5} strokeLinecap="round" strokeDasharray="5 6" />
      <text x={160} y={64} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--burgundy)">
        내가 떠나면
      </text>
      <text x={160} y={88} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--burgundy)">
        이 아이는 어떻게 살까
      </text>
      <text x={112} y={182} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">아버지</text>
      <text x={196} y={182} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">아들</text>
      <text x={160} y={220} textAnchor="middle" fontSize={13} fill="var(--ash)">
        마지막까지 걱정한 것
      </text>
    </svg>
  );
}

/** 혼자 남지 않게. */
function NotAlone() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="혼자 남은 사람 곁을 여러 손길이 둘러싸는 모습">
      <circle cx={160} cy={120} r={62} fill="none" stroke="var(--navy)"
              strokeWidth={2.5} strokeDasharray="8 8" opacity={0.6} />
      <Person x={160} y={130} fill="var(--navy)" scale={1.3} />
      {[
        { x: 160, y: 42 },
        { x: 238, y: 88 },
        { x: 238, y: 172 },
        { x: 82, y: 172 },
        { x: 82, y: 88 },
      ].map((n) => (
        <circle key={`${n.x}-${n.y}`} cx={n.x} cy={n.y} r={11}
                fill="var(--burgundy)" opacity={0.75} />
      ))}
      <text x={160} y={216} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        혼자 두지 않겠대요
      </text>
    </svg>
  );
}

/** 하루 종일 곁을 지킨다. */
function Care24() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="하루 스물네 시간 동안 돌봄이 이어지는 것을 시계로 나타낸 그림">
      <circle cx={160} cy={110} r={58} fill="none" stroke="var(--stone)" strokeWidth={12} />
      <circle cx={160} cy={110} r={58} fill="none" stroke="var(--navy)" strokeWidth={12}
              strokeLinecap="round" />
      <text x={160} y={104} textAnchor="middle" fontSize={30} {...LABEL} fill="var(--navy)">24</text>
      <text x={160} y={128} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">시간</text>
      <text x={160} y={198} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        가장 어려운 분들에게
      </text>
      <text x={160} y={220} textAnchor="middle" fontSize={12} fill="var(--ash)">
        하루 내내 이어지는 돌봄
      </text>
    </svg>
  );
}

/** 한 걸음씩, 멈추지 않고. */
function StepOn() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="발자국이 한 걸음씩 이어지는 모습">
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={44 + i * 58} cy={i % 2 === 0 ? 118 : 142}
                 rx={17} ry={11} transform={`rotate(-12 ${44 + i * 58} ${i % 2 === 0 ? 118 : 142})`}
                 fill="var(--navy)" opacity={0.3 + i * 0.16} />
      ))}
      <text x={160} y={196} textAnchor="middle" fontSize={16} {...LABEL} fill="var(--ink)">
        한 걸음씩
      </text>
      <text x={160} y={220} textAnchor="middle" fontSize={13} fill="var(--ash)">
        그러나 멈추지 않겠다고 했어요
      </text>
    </svg>
  );
}

/* ── 부동산 ──────────────────────────────────────────────────── */

/** 금리를 눈여겨보라. */
function RateWatch() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="금리가 오를 수 있다는 것을 나타낸 그림">
      <path d="M34 164 L92 152 L150 134 L208 112" fill="none" stroke="var(--navy)"
            strokeWidth={3.5} strokeLinecap="round" />
      <path d="M208 112 L268 78" fill="none" stroke="var(--burgundy)"
            strokeWidth={3.5} strokeLinecap="round" strokeDasharray="9 7" />
      <circle cx={208} cy={112} r={7} fill="var(--navy)" />
      <text x={208} y={140} textAnchor="middle" fontSize={11} fill="var(--ash)">지금</text>
      <text x={272} y={62} textAnchor="end" fontSize={16} {...LABEL} fill="var(--burgundy)">3.5%</text>
      <text x={286} y={132} textAnchor="end" fontSize={11} fill="var(--ash)">내년 1분기 전망</text>
      <text x={160} y={200} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        금리를 눈여겨보라고 했어요
      </text>
      <text x={160} y={222} textAnchor="middle" fontSize={11} fill="var(--ash)">
        기사에 실린 전망이지 정부 계획이 아니에요
      </text>
    </svg>
  );
}

/** 연체와 경매가 늘고 있다. */
function AuctionUp() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="경매로 나오는 집이 늘어나는 모습">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <path d={`M${40 + i * 58} ${168 - i * 16} l22 -18 l22 18 Z`}
                fill="var(--burgundy)" opacity={0.35 + i * 0.15} />
          <rect x={44 + i * 58} y={168 - i * 16} width={36} height={26}
                fill="var(--burgundy)" opacity={0.35 + i * 0.15} />
        </g>
      ))}
      <path d="M30 206 H290" stroke="var(--graphite)" strokeWidth={2.5} strokeLinecap="round" />
      <text x={160} y={62} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--burgundy)">
        경매로 나오는 집이
      </text>
      <text x={160} y={86} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--burgundy)">
        늘고 있어요
      </text>
      <text x={160} y={232} textAnchor="middle" fontSize={11} fill="var(--ash)">
        수치는 밝히지 않았어요
      </text>
    </svg>
  );
}

/** 빨리 많이 짓겠다. */
function BuildFast() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="집을 빠르게 많이 짓겠다는 것을 나타낸 그림">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={30 + i * 72} y={96 - i * 14} width={52} height={80 + i * 14}
                rx={4} fill="var(--navy)" opacity={0.4 + i * 0.2} />
          <rect x={42 + i * 72} y={110 - i * 14} width={12} height={12} fill="var(--eggshell)" opacity={0.7} />
          <rect x={60 + i * 72} y={110 - i * 14} width={12} height={12} fill="var(--eggshell)" opacity={0.7} />
        </g>
      ))}
      <path d="M22 180 H298" stroke="var(--graphite)" strokeWidth={3} strokeLinecap="round" />
      <text x={160} y={56} textAnchor="middle" fontSize={16} {...LABEL} fill="var(--ink)">
        빨리, 많이 짓겠대요
      </text>
      <text x={160} y={212} textAnchor="middle" fontSize={12} fill="var(--ash)">
        인허가를 구청장에게도 맡겨서
      </text>
    </svg>
  );
}

/** 공급을 늘리는 돈과 수요를 늘리는 돈. */
function TwoLoans() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="집을 짓는 데 쓰는 돈과 집을 사는 데 쓰는 돈이 다르다는 것을 나타낸 그림">
      <circle cx={80} cy={76} r={22} fill="var(--navy)" />
      <text x={80} y={82} textAnchor="middle" fontSize={16} {...LABEL} fill="var(--eggshell)">₩</text>
      <path d="M80 104 V128" stroke="var(--navy)" strokeWidth={3} strokeLinecap="round" />
      <path d="M72 120 L80 130 L88 120" fill="none" stroke="var(--navy)"
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={54} y={138} width={52} height={44} rx={4} fill="var(--navy)" opacity={0.8} />
      <text x={80} y={202} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">짓는 돈</text>

      <text x={160} y={132} textAnchor="middle" fontSize={22} {...LABEL} fill="var(--ash)">≠</text>

      <circle cx={240} cy={76} r={22} fill="var(--burgundy)" />
      <text x={240} y={82} textAnchor="middle" fontSize={16} {...LABEL} fill="var(--eggshell)">₩</text>
      <path d="M240 104 V128" stroke="var(--burgundy)" strokeWidth={3} strokeLinecap="round" />
      <path d="M232 120 L240 130 L248 120" fill="none" stroke="var(--burgundy)"
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Person x={240} y={172} fill="var(--burgundy)" scale={1.05} opacity={0.85} />
      <text x={240} y={202} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">사는 돈</text>

      <text x={160} y={228} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ink)">
        둘은 다르다고 했어요
      </text>
    </svg>
  );
}

/** 수도권 집중을 흩는다. */
function SpreadOut() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="한곳에 몰려 있던 것을 여러 곳으로 나누는 모습">
      <g opacity={0.5}>
        <circle cx={78} cy={108} r={40} fill="var(--burgundy)" />
        <text x={78} y={114} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">수도권</text>
        <text x={78} y={168} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--ash)">몰려 있음</text>
      </g>
      <path d="M130 108 H170" stroke="var(--navy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M161 99 L172 108 L161 117" fill="none" stroke="var(--navy)"
            strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      {[
        { x: 208, y: 72, r: 17 },
        { x: 268, y: 92, r: 15 },
        { x: 212, y: 138, r: 15 },
        { x: 272, y: 150, r: 17 },
      ].map((n) => (
        <circle key={`${n.x}-${n.y}`} cx={n.x} cy={n.y} r={n.r} fill="var(--navy)" opacity={0.85} />
      ))}
      <text x={240} y={188} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">나눠서</text>
      <text x={160} y={222} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        집값의 뿌리를 건드리겠대요
      </text>
    </svg>
  );
}

/** 값이 무너지면 공공이 받는다. */
function SafetyNet() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="집값이 크게 떨어질 때 공공이 받쳐 주는 그물을 나타낸 그림">
      <path d="M118 44 l22 -18 l22 18 Z" fill="var(--burgundy)" opacity={0.8} />
      <rect x={122} y={44} width={36} height={26} fill="var(--burgundy)" opacity={0.8} />
      <path d="M140 84 V124" stroke="var(--burgundy)" strokeWidth={3}
            strokeLinecap="round" strokeDasharray="7 6" />
      <path d="M130 114 L140 128 L150 114" fill="none" stroke="var(--burgundy)"
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 148 Q160 200 280 148" fill="none" stroke="var(--navy)"
            strokeWidth={4} strokeLinecap="round" />
      {[80, 120, 160, 200, 240].map((x, i) => (
        <path key={x} d={`M${x} ${152 + [8, 15, 18, 15, 8][i]} V${138}`}
              stroke="var(--navy)" strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      ))}
      <text x={160} y={196} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--navy)">
        공공이 사들여 받쳐요
      </text>
      <text x={160} y={220} textAnchor="middle" fontSize={12} fill="var(--ash)">
        폭락에 대비한 준비 지시
      </text>
    </svg>
  );
}

/* ── 노웅래 무죄 ─────────────────────────────────────────────── */

/** 두 번의 무죄. */
function CourtCleared() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="1심과 항소심에서 잇달아 무죄 판결이 난 모습">
      {[
        { x: 84, t: "1심" },
        { x: 236, t: "항소심" },
      ].map((n) => (
        <g key={n.x}>
          <rect x={n.x - 56} y={64} width={112} height={88} rx={8}
                fill="var(--canvas)" stroke="var(--navy)" strokeWidth={3} />
          <path d={`M${n.x - 22} 108 L${n.x - 6} 124 L${n.x + 24} 88`} fill="none"
                stroke="var(--navy)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          <text x={n.x} y={176} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">{n.t}</text>
        </g>
      ))}
      <text x={160} y={216} textAnchor="middle" fontSize={17} {...LABEL} fill="var(--ink)">
        두 번 다 무죄
      </text>
    </svg>
  );
}

/** 증거라고는 소리 하나. */
function ThinEvidence() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="증거로 내세운 것이 소리 하나뿐이었다는 것을 나타낸 그림">
      <rect x={38} y={62} width={244} height={96} rx={10}
            fill="none" stroke="var(--graphite)" strokeWidth={2.5} strokeDasharray="8 8" />
      <text x={160} y={52} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--ash)">증거</text>
      {[-2, -1, 0, 1, 2].map((i) => (
        <path key={i} d={`M${160 + i * 22} ${110 - Math.abs(i) * 6} V${110 + Math.abs(i) * 6}`}
              stroke="var(--burgundy)" strokeWidth={5} strokeLinecap="round"
              opacity={0.9 - Math.abs(i) * 0.18} />
      ))}
      <text x={160} y={144} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">
        부스럭 소리
      </text>
      <text x={160} y={196} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        이게 거의 전부였대요
      </text>
    </svg>
  );
}

/** 명단에서 지워졌다. */
function CutOff() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="후보 명단에서 한 사람의 이름이 지워진 모습">
      <rect x={70} y={44} width={180} height={140} rx={8}
            fill="var(--canvas)" stroke="var(--graphite)" strokeWidth={2.5} />
      {[74, 106, 138].map((y, i) => (
        <rect key={y} x={92} y={y} width={{ 0: 120, 1: 96, 2: 110 }[i]} height={12}
              rx={3} fill="var(--stone)" />
      ))}
      <rect x={92} y={106} width={96} height={12} rx={3} fill="var(--burgundy)" opacity={0.35} />
      <path d="M86 112 H200" stroke="var(--burgundy)" strokeWidth={3.5} strokeLinecap="round" />
      <text x={160} y={212} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        후보 명단에서 빼야 했대요
      </text>
    </svg>
  );
}

/** 뒤늦은 사죄. */
function ApologyLate() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="시간이 한참 지난 뒤에야 고개를 숙이는 모습">
      <path d="M30 172 H290" stroke="var(--stone)" strokeWidth={3} strokeLinecap="round" />
      <circle cx={64} cy={172} r={8} fill="var(--burgundy)" />
      <text x={64} y={200} textAnchor="middle" fontSize={11} fill="var(--ash)">공천 배제</text>
      <circle cx={256} cy={172} r={8} fill="var(--navy)" />
      <text x={256} y={200} textAnchor="middle" fontSize={11} fill="var(--ash)">무죄</text>
      <path d="M78 172 H242" stroke="var(--graphite)" strokeWidth={3}
            strokeDasharray="7 7" strokeLinecap="round" opacity={0.6} />
      <Person x={256} y={126} fill="var(--navy)" scale={1.25} rotate={18} />
      <text x={160} y={66} textAnchor="middle" fontSize={16} {...LABEL} fill="var(--ink)">
        뒤늦게 사과했어요
      </text>
      <text x={160} y={92} textAnchor="middle" fontSize={12} fill="var(--ash)">
        그 사이 잃은 것은 돌아오지 않아요
      </text>
    </svg>
  );
}

/* ── 개헌 ────────────────────────────────────────────────────── */

/** 40년 된 헌법. */
function CharterAge() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="40년 된 헌법 책">
      <rect x={104} y={52} width={112} height={140} rx={6} fill="var(--navy)" />
      <rect x={116} y={52} width={6} height={140} fill="var(--eggshell)" opacity={0.3} />
      <text x={166} y={112} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--eggshell)">헌법</text>
      <text x={166} y={144} textAnchor="middle" fontSize={26} {...LABEL} fill="var(--eggshell)">40년</text>
      <text x={160} y={222} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        지금 시대와 안 맞는대요
      </text>
    </svg>
  );
}

/** 대통령 권한 일부를 국회로. */
function PowerSplit() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="대통령이 가진 권한 가운데 일부를 국회로 옮기는 모습">
      <circle cx={72} cy={104} r={44} fill="var(--navy)" />
      <text x={72} y={110} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">대통령</text>
      <circle cx={250} cy={104} r={36} fill="var(--burgundy)" opacity={0.85} />
      <text x={250} y={110} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">국회</text>
      {[84, 104, 124].map((y) => (
        <g key={y}>
          <path d={`M124 ${y} H204`} stroke="var(--graphite)" strokeWidth={2.5} strokeLinecap="round" />
          <path d={`M196 ${y - 6} L206 ${y} L196 ${y + 6}`} fill="none" stroke="var(--graphite)"
                strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <text x={164} y={168} textAnchor="middle" fontSize={11} fill="var(--ash)">
        감사원 · 총리추천 · 인사권 일부
      </text>
      <text x={160} y={210} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        권한을 나누자는 거예요
      </text>
    </svg>
  );
}

/** 임기를 바꾸자. */
function TermFour() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="5년 한 번에서 4년씩 두 번으로 임기를 바꾸자는 것을 나타낸 그림">
      <text x={160} y={56} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--ash)">지금</text>
      <rect x={60} y={68} width={200} height={26} rx={6} fill="var(--stone)" />
      <text x={160} y={87} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--graphite)">5년 한 번</text>

      <path d="M160 106 V126" stroke="var(--navy)" strokeWidth={3} strokeLinecap="round" />
      <path d="M152 118 L160 128 L168 118" fill="none" stroke="var(--navy)"
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

      <rect x={60} y={140} width={94} height={26} rx={6} fill="var(--navy)" />
      <text x={107} y={159} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">4년</text>
      <rect x={166} y={140} width={94} height={26} rx={6} fill="var(--navy)" opacity={0.6} />
      <text x={213} y={159} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">4년</text>
      <text x={160} y={192} textAnchor="middle" fontSize={12} fill="var(--ash)">
        가운데서 한 번 평가받게
      </text>
      <text x={160} y={220} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        책임정치가 되게요
      </text>
    </svg>
  );
}

/** 분권형은 내각제가 아니다. */
function NotParliamentary() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="권한을 나누는 것과 내각제는 다르다는 것을 나타낸 그림">
      <rect x={20} y={66} width={124} height={92} rx={8}
            fill="var(--navy)" opacity={0.16} stroke="var(--navy)" strokeWidth={2.5} />
      <text x={82} y={102} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">권한을</text>
      <text x={82} y={124} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--navy)">나누기</text>
      <text x={82} y={180} textAnchor="middle" fontSize={11} fill="var(--ash)">이걸 하자는 것</text>

      <text x={160} y={118} textAnchor="middle" fontSize={24} {...LABEL} fill="var(--ash)">≠</text>

      <g opacity={0.45}>
        <rect x={176} y={66} width={124} height={92} rx={8}
              fill="none" stroke="var(--burgundy)" strokeWidth={2.5} strokeDasharray="7 7" />
        <text x={238} y={102} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">내각제</text>
        <text x={238} y={124} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">이원집정제</text>
        <text x={238} y={180} textAnchor="middle" fontSize={11} fill="var(--ash)">이건 아니라는 것</text>
      </g>

      <text x={160} y={222} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        둘은 다른 이야기래요
      </text>
    </svg>
  );
}

/* ── 책임과 권력 ─────────────────────────────────────────────── */

/** 국민은 속일 수 없다. */
function CannotFool() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="아무리 감춰도 많은 사람의 눈을 속일 수 없다는 것을 나타낸 그림">
      <rect x={122} y={62} width={76} height={54} rx={6} fill="var(--graphite)" opacity={0.5} />
      <text x={160} y={94} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--eggshell)">감춤</text>
      {[
        { x: 44, y: 166 },
        { x: 96, y: 178 },
        { x: 148, y: 184 },
        { x: 200, y: 178 },
        { x: 252, y: 166 },
      ].map((n) => (
        <g key={n.x}>
          <Person x={n.x} y={n.y} fill="var(--navy)" scale={0.78} />
          <path d={`M${n.x} ${n.y - 26} L${160 + (n.x - 148) * 0.18} 122`}
                stroke="var(--navy)" strokeWidth={1.8} strokeDasharray="4 5"
                strokeLinecap="round" opacity={0.55} />
        </g>
      ))}
      <text x={160} y={38} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        다 보고 있대요
      </text>
    </svg>
  );
}

/* ── 분당집 ──────────────────────────────────────────────────── */

/** 1998년에 산 한 채. */
function OneHouse() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="오래 살아온 집 한 채">
      <path d="M92 104 l68 -48 l68 48 Z" fill="var(--navy)" />
      <rect x={104} y={104} width={112} height={82} fill="var(--navy)" opacity={0.85} />
      <rect x={144} y={132} width={32} height={54} rx={3} fill="var(--eggshell)" opacity={0.75} />
      <text x={160} y={62} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--ash)">1998년</text>
      <text x={160} y={214} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        처음이자 마지막으로 산 집
      </text>
    </svg>
  );
}

/** 이익이 아니라 책임 때문에. */
function SoldWhy() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="돈 때문이 아니라 공직자의 책임 때문에 팔았다는 것을 나타낸 그림">
      <g opacity={0.4}>
        <circle cx={86} cy={106} r={34} fill="var(--graphite)" />
        <text x={86} y={114} textAnchor="middle" fontSize={22} {...LABEL} fill="var(--eggshell)">₩</text>
        <path d="M58 78 L114 134 M114 78 L58 134" stroke="var(--graphite)"
              strokeWidth={3} strokeLinecap="round" />
        <text x={86} y={166} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">
          돈 때문이 아니라
        </text>
      </g>
      <path d="M140 106 H176" stroke="var(--navy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M167 97 L178 106 L167 115" fill="none" stroke="var(--navy)"
            strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={244} cy={106} r={38} fill="var(--navy)" />
      <text x={244} y={100} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">공직자</text>
      <text x={244} y={120} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--eggshell)">책임</text>
      <text x={160} y={206} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        모범이 되려고 팔았대요
      </text>
    </svg>
  );
}

/** 제목이 씌운 틀. */
function HeadlineFrame() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="기사 제목이 한쪽 인상만 남기는 모습">
      <rect x={34} y={58} width={252} height={74} rx={8}
            fill="var(--burgundy)" opacity={0.12} stroke="var(--burgundy)" strokeWidth={2.5} />
      <text x={160} y={88} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--burgundy)">
        “시세차익만 25억”
      </text>
      <text x={160} y={114} textAnchor="middle" fontSize={11} fill="var(--ash)">기사 제목</text>
      <path d="M160 142 V166" stroke="var(--graphite)" strokeWidth={3} strokeLinecap="round" />
      <path d="M152 158 L160 168 L168 158" fill="none" stroke="var(--graphite)"
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <text x={160} y={196} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        투기꾼처럼 보이게 한대요
      </text>
      <text x={160} y={220} textAnchor="middle" fontSize={12} fill="var(--ash)">
        그게 과하다고 했어요
      </text>
    </svg>
  );
}

/* ── 체육행정 ────────────────────────────────────────────────── */

/** 능력보다 내 편. */
function WrongPick() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="능력이 아니라 가까운 사이를 보고 사람을 고른 모습">
      <Person x={92} y={110} fill="var(--navy)" scale={1.25} />
      <text x={92} y={152} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">잘하는 사람</text>
      <g opacity={0.35}>
        <path d="M64 78 L120 134 M120 78 L64 134" stroke="var(--graphite)"
              strokeWidth={3} strokeLinecap="round" />
      </g>
      <Person x={228} y={110} fill="var(--burgundy)" scale={1.25} />
      <text x={228} y={152} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">가까운 사람</text>
      <circle cx={228} cy={110} r={40} fill="none" stroke="var(--burgundy)"
              strokeWidth={3} strokeDasharray="7 7" />
      <text x={160} y={200} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        이렇게 고르면 결과는 뻔하대요
      </text>
    </svg>
  );
}

/** 소수 대의원에서 모두의 직선제로. */
function DirectVote() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="소수만 뽑던 방식에서 모두가 직접 뽑는 방식으로 바뀌는 모습">
      <g opacity={0.45}>
        {[44, 76, 108].map((x) => (
          <Person key={x} x={x} y={106} fill="var(--graphite)" scale={0.8} />
        ))}
        <text x={76} y={144} textAnchor="middle" fontSize={11} {...LABEL} fill="var(--graphite)">
          소수 대의원
        </text>
      </g>
      <path d="M136 100 H172" stroke="var(--navy)" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M163 91 L174 100 L163 109" fill="none" stroke="var(--navy)"
            strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      {[194, 222, 250, 278, 208, 236, 264].map((x, i) => (
        <Person key={x} x={x} y={i < 4 ? 92 : 128} fill="var(--navy)" scale={0.72} />
      ))}
      <text x={236} y={166} textAnchor="middle" fontSize={11} {...LABEL} fill="var(--navy)">
        관련된 모두
      </text>
      <text x={160} y={212} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ink)">
        다 같이 뽑게 바꾸래요
      </text>
    </svg>
  );
}

/** 감시와 책임. */
function CheckSystem() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img"
         aria-label="권한을 준 뒤 감시하고 결과에 책임을 지우는 고리">
      <circle cx={160} cy={116} r={62} fill="none" stroke="var(--navy)"
              strokeWidth={3} strokeDasharray="10 8" />
      {[
        { x: 160, y: 54, t: "권한" },
        { x: 222, y: 116, t: "감시" },
        { x: 160, y: 178, t: "책임" },
        { x: 98, y: 116, t: "결과" },
      ].map((n) => (
        <g key={n.t}>
          <circle cx={n.x} cy={n.y} r={24} fill="var(--navy)" />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--eggshell)">
            {n.t}
          </text>
        </g>
      ))}
      <text x={160} y={226} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        고리가 이어져야 한대요
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
  "same-dream": SameDream,
  "slow-road": SlowRoad,
  "careful-steps": CarefulSteps,
  "power-weight": PowerWeight,
  "not-war": NotWar,
  "pump-steady": PumpSteady,
  "many-suppliers": ManySuppliers,
  "cap-gap": CapGap,
  "still-risk": StillRisk,
  "father-worry": FatherWorry,
  "not-alone": NotAlone,
  "care-24": Care24,
  "step-on": StepOn,
  "rate-watch": RateWatch,
  "auction-up": AuctionUp,
  "build-fast": BuildFast,
  "two-loans": TwoLoans,
  "spread-out": SpreadOut,
  "safety-net": SafetyNet,
  "court-cleared": CourtCleared,
  "thin-evidence": ThinEvidence,
  "cut-off": CutOff,
  "apology-late": ApologyLate,
  "charter-age": CharterAge,
  "power-split": PowerSplit,
  "term-four": TermFour,
  "not-parliamentary": NotParliamentary,
  "cannot-fool": CannotFool,
  "one-house": OneHouse,
  "sold-why": SoldWhy,
  "headline-frame": HeadlineFrame,
  "wrong-pick": WrongPick,
  "direct-vote": DirectVote,
  "check-system": CheckSystem,
};
