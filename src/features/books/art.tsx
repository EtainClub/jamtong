import type { BookArt } from "@/content/books/schema";

/**
 * 자서전 삽화.
 *
 * 업적 삽화가 항로·예산처럼 사실의 모양을 그리고 언행 삽화가 사람 사이에
 * 오가는 일을 그린다면, 여기는 **한 생애에서 되풀이되는 장면**을 그린다.
 * 공장, 밤공부, 갈림길, 저울 — 스물두 장에 거듭 나오는 것들이다.
 *
 * 그래서 열넷만 두고 여러 장에서 다시 쓴다. 장마다 새로 그리면 예순여섯 장이
 * 되고, 그만큼 늘어난 그림은 장면이 아니라 장식이 된다.
 *
 * 무대는 업적·언행과 같은 320×240이고 색도 같은 토큰을 쓴다. 얼굴은 그리지
 * 않는다 — 누구인지 찾게 되는 순간 그림이 주장을 하기 시작한다.
 */

const LABEL = { fontFamily: "inherit", fontWeight: 800 } as const;

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
  rotate?: number;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      <circle cx={0} cy={-13} r={10} fill={fill} />
      <path d="M-15 13 A15 15 0 0 1 15 13 Z" fill={fill} />
    </g>
  );
}

function Caption({ children }: { children: string }) {
  return (
    <text x={160} y={214} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
      {children}
    </text>
  );
}

function Stage({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/** 공장. 기계 벨트와 거기 끼인 손. */
function Factory() {
  return (
    <Stage label="공장 기계 옆에서 일하다 손을 다친 모습">
      <rect x={26} y={92} width={132} height={70} rx={6} fill="var(--stone)" />
      <circle cx={62} cy={127} r={20} fill="none" stroke="var(--graphite)" strokeWidth={6} />
      <circle cx={122} cy={127} r={20} fill="none" stroke="var(--graphite)" strokeWidth={6} />
      <path d="M62 107 H122 M62 147 H122" stroke="var(--graphite)" strokeWidth={5} />
      <Person x={214} y={126} fill="var(--navy)" scale={1.15} />
      <path
        d="M196 124 L166 127"
        stroke="var(--burgundy)"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <circle cx={166} cy={127} r={7} fill="var(--burgundy)" />
      <Caption>열두 살에 공장으로</Caption>
    </Stage>
  );
}

/** 밤에 하는 공부. 불 켜진 창 하나. */
function NightStudy() {
  return (
    <Stage label="모두 잠든 밤에 창 하나만 불이 켜져 있는 모습">
      <rect x={38} y={62} width={244} height={112} rx={8} fill="var(--graphite)" opacity={0.18} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={54 + (i % 3) * 78}
          y={78 + Math.floor(i / 3) * 52}
          width={54}
          height={36}
          rx={4}
          fill={i === 4 ? "var(--burgundy)" : "var(--stone)"}
          opacity={i === 4 ? 1 : 0.7}
        />
      ))}
      <Person x={159} y={148} fill="var(--canvas)" scale={0.55} />
      <Caption>불 켜진 창 하나</Caption>
    </Stage>
  );
}

/** 두 갈래 길. 밖에서 바꾸기와 안에서 바꾸기. */
function TwoRoads() {
  return (
    <Stage label="한 자리에서 두 갈래로 갈라지는 길">
      <circle cx={160} cy={176} r={9} fill="var(--ink)" />
      <path d="M160 176 L64 76" stroke="var(--graphite)" strokeWidth={6} strokeLinecap="round" />
      <path d="M160 176 L256 76" stroke="var(--navy)" strokeWidth={6} strokeLinecap="round" />
      <Person x={64} y={64} fill="var(--graphite)" scale={0.9} />
      <Person x={256} y={64} fill="var(--navy)" scale={0.9} />
      <text x={64} y={104} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">
        밖에서
      </text>
      <text x={256} y={104} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">
        안에서
      </text>
      <Caption>같은 곳을 다른 길로</Caption>
    </Stage>
  );
}

/** 약속. 맞잡은 두 손 대신 도장 하나. */
function Promise() {
  return (
    <Stage label="종이 위에 찍힌 도장 하나">
      <rect x={82} y={58} width={156} height={112} rx={8} fill="var(--stone)" />
      {[84, 104, 124].map((y) => (
        <path key={y} d={`M104 ${y} H216`} stroke="var(--graphite)" strokeWidth={4} opacity={0.5} />
      ))}
      <circle cx={196} cy={146} r={20} fill="none" stroke="var(--burgundy)" strokeWidth={5} />
      <circle cx={196} cy={146} r={7} fill="var(--burgundy)" />
      <Caption>말한 대로 한다</Caption>
    </Stage>
  );
}

/** 저울. 강한 쪽을 누르고 약한 쪽을 든다. */
function Scale() {
  return (
    <Stage label="한쪽이 눌리고 다른 쪽이 올라간 저울">
      <path d="M160 58 V176" stroke="var(--graphite)" strokeWidth={6} strokeLinecap="round" />
      <path d="M62 92 L258 68" stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" />
      <rect x={34} y={94} width={58} height={16} rx={4} fill="var(--burgundy)" />
      <rect x={228} y={70} width={58} height={16} rx={4} fill="var(--navy)" />
      <path d="M62 176 H258" stroke="var(--stone)" strokeWidth={8} strokeLinecap="round" />
      <text x={63} y={132} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--burgundy)">
        강한 쪽
      </text>
      <text x={257} y={108} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--navy)">
        약한 쪽
      </text>
      <Caption>억강부약</Caption>
    </Stage>
  );
}

/** 광장. 촛불 대신 점 여럿. */
function Square() {
  return (
    <Stage label="광장에 사람들이 가득 모인 모습">
      {Array.from({ length: 24 }).map((_, i) => (
        <Person
          key={i}
          x={46 + (i % 8) * 32}
          y={92 + Math.floor(i / 8) * 34}
          fill={i % 5 === 0 ? "var(--burgundy)" : "var(--graphite)"}
          scale={0.42}
          opacity={i % 5 === 0 ? 1 : 0.55}
        />
      ))}
      <Caption>광장에 모인 사람들</Caption>
    </Stage>
  );
}

/** 서명. 이름이 쌓인다. */
function Signatures() {
  return (
    <Stage label="이름이 줄줄이 적힌 서명 용지">
      <rect x={92} y={48} width={136} height={132} rx={8} fill="var(--stone)" />
      {[70, 92, 114, 136, 158].map((y, i) => (
        <path
          key={y}
          d={`M112 ${y} H${196 - i * 6}`}
          stroke="var(--navy)"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
      <text x={160} y={196} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--burgundy)">
        10만 명
      </text>
      <Caption>이름을 모았다</Caption>
    </Stage>
  );
}

/** 장부. 숨긴 빚과 드러낸 빚. */
function Ledger() {
  return (
    <Stage label="장부에 적힌 빚이 점점 줄어드는 막대">
      <rect x={40} y={52} width={240} height={124} rx={8} fill="var(--stone)" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={64 + i * 56}
          y={148 - (4 - i) * 22}
          width={34}
          height={(4 - i) * 22 + 10}
          rx={4}
          fill={i === 3 ? "var(--navy)" : "var(--burgundy)"}
          opacity={i === 3 ? 1 : 0.85 - i * 0.15}
        />
      ))}
      <Caption>숨기지 않고 갚는다</Caption>
    </Stage>
  );
}

/** 문을 열어 둔 방. */
function OpenDoor() {
  return (
    <Stage label="문이 활짝 열린 방과 그리로 들어오는 사람들">
      <rect x={150} y={48} width={124} height={132} rx={6} fill="var(--stone)" />
      <path d="M150 48 L110 68 V196 L150 180 Z" fill="var(--navy)" opacity={0.85} />
      <circle cx={142} cy={126} r={5} fill="var(--canvas)" />
      <Person x={62} y={150} fill="var(--graphite)" scale={0.8} />
      <Person x={92} y={162} fill="var(--graphite)" scale={0.7} opacity={0.7} />
      <Caption>문을 열어 두었다</Caption>
    </Stage>
  );
}

/** 골목. 좁은 길과 오간 발자국. */
function Alley() {
  return (
    <Stage label="좁은 골목을 여러 번 오간 자국">
      <path d="M96 190 L136 56" stroke="var(--stone)" strokeWidth={10} strokeLinecap="round" />
      <path d="M226 190 L186 56" stroke="var(--stone)" strokeWidth={10} strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M120 ${176 - i * 40} C150 ${160 - i * 40}, 172 ${160 - i * 40}, 202 ${176 - i * 40}`}
          stroke="var(--navy)"
          strokeWidth={3.5}
          strokeDasharray="6 7"
          fill="none"
          opacity={0.9 - i * 0.2}
        />
      ))}
      <Person x={161} y={196} fill="var(--navy)" scale={0.7} />
      <Caption>골목을 세 바퀴</Caption>
    </Stage>
  );
}

/** 연결망. 흩어진 사람이 이어진다. */
function Network() {
  const nodes = [
    [70, 78],
    [160, 58],
    [250, 84],
    [58, 156],
    [160, 132],
    [258, 156],
  ] as const;

  return (
    <Stage label="흩어져 있던 사람들이 서로 이어진 그물">
      {nodes.map(([x, y], i) =>
        nodes.slice(i + 1).map(([x2, y2], j) => (
          <path
            key={`${i}-${j}`}
            d={`M${x} ${y} L${x2} ${y2}`}
            stroke="var(--stone)"
            strokeWidth={2.5}
          />
        )),
      )}
      {nodes.map(([x, y], i) => (
        <Person key={i} x={x} y={y} fill={i === 4 ? "var(--navy)" : "var(--graphite)"} scale={0.6} />
      ))}
      <Caption>이제는 서로 잇는다</Caption>
    </Stage>
  );
}

/** 출발선. 같은 결승선, 다른 시작. */
function StartLine() {
  return (
    <Stage label="같은 결승선을 두고 출발선이 다르게 그어진 트랙">
      <path d="M270 46 V196" stroke="var(--burgundy)" strokeWidth={6} strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path
            d={`M${62 + i * 44} ${76 + i * 40} H262`}
            stroke="var(--stone)"
            strokeWidth={9}
            strokeLinecap="round"
          />
          <Person
            x={62 + i * 44}
            y={76 + i * 40}
            fill={i === 0 ? "var(--navy)" : "var(--graphite)"}
            scale={0.55}
          />
        </g>
      ))}
      <Caption>출발선이 다르다</Caption>
    </Stage>
  );
}

/** 손을 내민다. */
function Hands() {
  return (
    <Stage label="한 사람이 다른 사람에게 손을 내미는 모습">
      <Person x={92} y={130} fill="var(--navy)" scale={1.1} />
      <Person x={228} y={146} fill="var(--graphite)" scale={1.1} rotate={12} />
      <path
        d="M116 124 C150 108, 178 118, 204 136"
        stroke="var(--burgundy)"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <Caption>먼저 손을 내민다</Caption>
    </Stage>
  );
}

/** 앞뒤가 잘린 녹취. */
function CutTape() {
  return (
    <Stage label="긴 말에서 가운데 한 토막만 잘려 나온 모습">
      <rect x={30} y={78} width={260} height={34} rx={6} fill="var(--stone)" />
      <rect x={128} y={78} width={64} height={34} rx={6} fill="var(--burgundy)" />
      <path
        d="M128 68 V122 M192 68 V122"
        stroke="var(--ink)"
        strokeWidth={3}
        strokeDasharray="5 5"
      />
      <rect x={128} y={140} width={64} height={34} rx={6} fill="var(--burgundy)" />
      <text x={160} y={196} textAnchor="middle" fontSize={12} {...LABEL} fill="var(--graphite)">
        앞뒤를 잘라내면
      </text>
      <Caption>다른 말이 된다</Caption>
    </Stage>
  );
}

/* ────────────────────────────────────────────────────────────────
 * 1장 「희망은 희망밖에 없는 자의 편이다」
 *
 * 앞의 열넷이 장면을 그린다면 여기 셋은 **수를 그린다.** 업적의 쉬운 설명이
 * 20,400km와 13,000km를 나란히 놓아 7,400km를 보이게 하는 것과 같은 자리다.
 * 열두 살, 공장 셋, 손가락 세 개, 산재보험 0 — 이 장이 가진 수는 그 자체로
 * 이야기라서 아이콘보다 수가 먼저 와야 한다.
 * ──────────────────────────────────────────────────────────────── */

/** 열두 살에 남의 이름으로. 또래가 학교에 있을 나이를 나란히 놓는다. */
function AgeTwelve() {
  return (
    <Stage label="또래가 학교에 있을 열두 살에 남의 이름을 빌려 공장에 들어간 것을 견준 그림">
      <text x={18} y={48} fontSize={12} fontWeight={600} fill="var(--smoke)">
        또래가 있던 곳
      </text>
      <rect x={18} y={58} width={122} height={44} rx={10} fill="var(--stone)" />
      <text x={79} y={86} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--ash)">
        학교
      </text>

      <text x={180} y={48} fontSize={12} fontWeight={600} fill="var(--smoke)">
        그가 있던 곳
      </text>
      <rect x={180} y={58} width={122} height={44} rx={10} fill="var(--navy)" />
      <text x={241} y={86} textAnchor="middle" fontSize={15} {...LABEL} fill="var(--canvas)">
        공장
      </text>

      <text
        x={160}
        y={158}
        textAnchor="middle"
        fontSize={54}
        {...LABEL}
        fill="var(--burgundy)"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        12살
      </text>
      <text x={160} y={182} textAnchor="middle" fontSize={13} fill="var(--ash)">
        남의 이름을 빌려서
      </text>
      <Caption>초등학교를 마치자마자</Caption>
    </Stage>
  );
}

/** 다쳐도 받는 것이 없었다. 다친 수와 받은 수를 맞붙인다. */
function NoSafetyNet() {
  return (
    <Stage label="공장에서 다친 곳은 셋인데 받은 치료와 보상은 없었음을 견준 그림">
      <text x={18} y={44} fontSize={12} fontWeight={600} fill="var(--smoke)">
        다친 것
      </text>
      {[
        ["손가락 3개", "고무 공장"],
        ["왼쪽 팔뚝", "글러브 공장"],
        ["후각", "시계 공장"],
      ].map(([what, where], i) => (
        <g key={what}>
          <rect x={18} y={54 + i * 38} width={140} height={30} rx={8} fill="var(--burgundy)" />
          <text x={30} y={74 + i * 38} fontSize={13} {...LABEL} fill="var(--canvas)">
            {what}
          </text>
          <text x={166} y={74 + i * 38} fontSize={11} fill="var(--ash)">
            {where}
          </text>
        </g>
      ))}

      <path d="M18 182 H302" stroke="var(--stone)" strokeWidth={2} />
      <text x={18} y={206} fontSize={12} fontWeight={600} fill="var(--smoke)">
        받은 것
      </text>
      <text
        x={124}
        y={212}
        fontSize={34}
        {...LABEL}
        fill="var(--ink)"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        0
      </text>
      <text x={150} y={208} fontSize={12} fill="var(--ash)">
        산재보험도, 치료도
      </text>
    </Stage>
  );
}

/** 바닥에서 올라온 선. 두 번 내려갔다가 합격까지. */
function BottomToTop() {
  /** [x, y, 이름, 아래로 붙일지] */
  const points = [
    [26, 92, "공장", false],
    [86, 150, "첫 번째", true],
    [146, 170, "두 번째", true],
    [216, 118, "검정고시", false],
    [292, 52, "합격", false],
  ] as const;

  return (
    <Stage label="두 번 바닥을 친 뒤 검정고시를 거쳐 대학 합격까지 올라간 선">
      <path d="M18 196 H302" stroke="var(--stone)" strokeWidth={2} />
      <path
        d="M26 92 L86 150 L146 170 L216 118 L292 52"
        fill="none"
        stroke="var(--navy)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map(([x, y, label, below], i) => {
        const low = i === 1 || i === 2;
        return (
          <g key={label}>
            <circle cx={x} cy={y} r={i === 4 ? 10 : 6} fill={low ? "var(--burgundy)" : "var(--navy)"} />
            <text
              x={x}
              y={below ? y + 20 : y - 16}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill={low ? "var(--burgundy)" : "var(--graphite)"}
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* 오르는 선 위는 비워 둔다. 설명은 선 아래 빈 자리에 눕힌다. */}
      <text x={110} y={216} textAnchor="middle" fontSize={12.5} fill="var(--burgundy)">
        두 번 살아남고
      </text>
      <text x={244} y={216} textAnchor="middle" fontSize={14} {...LABEL} fill="var(--ink)">
        전액 장학금으로
      </text>
    </Stage>
  );
}

export const BOOK_ART: Record<BookArt, () => React.ReactNode> = {
  factory: Factory,
  "night-study": NightStudy,
  "two-roads": TwoRoads,
  promise: Promise,
  scale: Scale,
  square: Square,
  signatures: Signatures,
  ledger: Ledger,
  "open-door": OpenDoor,
  alley: Alley,
  network: Network,
  startline: StartLine,
  hands: Hands,
  "cut-tape": CutTape,
  "age-twelve": AgeTwelve,
  "no-safety-net": NoSafetyNet,
  "bottom-to-top": BottomToTop,
};
