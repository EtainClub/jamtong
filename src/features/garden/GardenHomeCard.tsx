import Link from "next/link";

/**
 * 홈에서 정원으로 가는 문 (docs/garden-game.md §1).
 *
 * 게임은 /garden 레이어에 있고 정보 화면에는 작은 진입로만 둔다. 그래서 히어로나
 * 업적 줄 사이가 아니라 위키 아래, 자매 앱 문 옆에 둔다. 그림은 인라인 SVG다 —
 * 홈 첫 화면 아래쪽이라 이미지 요청을 하나 더 늘릴 이유가 없고, 정원 번들은
 * 여기서 내려받지 않는다.
 *
 * 색은 .garden 상자 안에서만 쓴다(globals.css). 밖으로 새면 그 색이 자료처럼 읽힌다.
 * SVG 속성에는 CSS 변수가 브라우저마다 다르게 먹으므로 같은 값을 숫자로 적는다.
 */
export function GardenHomeCard() {
  return (
    <Link
      href="/garden"
      className="garden mt-9 block overflow-hidden rounded-card border border-stone transition-colors hover:border-graphite"
    >
      <GardenScene />
      <span className="flex items-center justify-between gap-3 px-4 py-3.5">
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold leading-snug text-ink">잼통 정원</span>
          <span className="mt-1 block text-[12px] leading-relaxed text-smoke">
            업적·정책·언행 씨앗을 심어 키우고, 열매로 잼을 만들어요. 열매마다 근거 한 줄이
            들어 있고, 광장 잡초는 다 같이 뽑아요.
          </span>
        </span>
        <span aria-hidden="true" className="shrink-0 text-[13px] text-ash">
          →
        </span>
      </span>
    </Link>
  );
}

/** 텃밭 한 줄: 새싹 → 잎 → 열매, 옆에 잼 병. 꾸밈이라 스크린리더에는 숨긴다. */
function GardenScene() {
  return (
    <svg viewBox="0 0 320 110" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf4d8" />
          <stop offset="1" stopColor="#f4f7ec" />
        </linearGradient>
        <linearGradient id="gh-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b6a4a" />
          <stop offset="1" stopColor="#6f5238" />
        </linearGradient>
      </defs>

      <rect width="320" height="110" fill="url(#gh-sky)" />
      <circle cx="286" cy="24" r="12" fill="#f6d365" />
      <circle cx="286" cy="24" r="18" fill="#f6d365" opacity="0.25" />

      {/* 풀밭과 흙 이랑 */}
      <rect y="74" width="320" height="36" fill="#a9cf7f" />
      <rect x="14" y="80" width="214" height="22" rx="11" fill="url(#gh-soil)" />

      {/* 새싹 */}
      <g transform="translate(50 82)">
        <path d="M0 0 V-12" stroke="#3f8a3a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M0 -10 C -8 -14 -10 -20 -9 -22 C -3 -21 0 -16 0 -10 Z" fill="#3f8a3a" />
        <path d="M0 -12 C 7 -17 11 -19 12 -21 C 8 -14 4 -12 0 -12 Z" fill="#3f8a3a" />
      </g>

      {/* 잎이 무성한 포기 */}
      <g transform="translate(120 82)">
        <path d="M0 0 V-26" stroke="#3f8a3a" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-9" cy="-16" rx="9" ry="5" transform="rotate(-28 -9 -16)" fill="#3f8a3a" />
        <ellipse cx="9" cy="-21" rx="9" ry="5" transform="rotate(28 9 -21)" fill="#3f8a3a" />
        <ellipse cx="-6" cy="-29" rx="7" ry="4" transform="rotate(-40 -6 -29)" fill="#5aa64f" />
      </g>

      {/* 열매가 익은 포기 */}
      <g transform="translate(190 82)">
        <path d="M0 0 V-34" stroke="#3f8a3a" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-10" cy="-22" rx="10" ry="5" transform="rotate(-25 -10 -22)" fill="#3f8a3a" />
        <ellipse cx="10" cy="-28" rx="10" ry="5" transform="rotate(25 10 -28)" fill="#3f8a3a" />
        <circle cx="0" cy="-42" r="10" fill="#d9442b" />
        <circle cx="-3" cy="-45" r="2.5" fill="#fff" opacity="0.55" />
        <path d="M-4 -51 L0 -48 L4 -51" stroke="#3f8a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* 잼 병 */}
      <g transform="translate(258 52)">
        <rect x="-3" y="-4" width="30" height="8" rx="2" fill="#8b6a4a" />
        <path d="M0 4 H24 V40 Q24 46 18 46 H6 Q0 46 0 40 Z" fill="#c2410c" />
        <rect x="4" y="16" width="16" height="12" rx="2" fill="#f6ead9" />
        <path d="M8 22 h8" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 8 V36" stroke="#fff" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
      </g>

      {/* 풀밭의 잡초 둘 */}
      {[244, 304].map((x) => (
        <path
          key={x}
          d={`M${x} 104 q-1 -6 -6 -9 M${x} 104 v-11 M${x} 104 q1 -6 6 -8`}
          stroke="#5b7b2a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
