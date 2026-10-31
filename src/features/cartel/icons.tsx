/**
 * 카르텔 표적의 그림.
 *
 * 선 하나 두께로 통일한 작은 그림이다. 사진이나 생성 그림을 쓰지 않는
 * 이유는, 표적마다 특정 기업이나 사람을 떠올리게 하는 그림이 들어가면 그것이
 * 곧 지목이 되기 때문이다. 업종을 가리키는 사물까지만 그린다.
 */

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const CARTEL_ICON: Record<string, () => React.ReactElement> = {
  // 담합 — 맞물린 가격표 둘
  collusion: () => (
    <Svg>
      <path d="M3 9V4h5l7 7-5 5-7-7z" />
      <circle cx="6" cy="7" r="1" />
      <path d="M11 4h2l8 8-5 5-1.5-1.5" />
    </Svg>
  ),
  // 의료 — 십자
  medical: () => (
    <Svg>
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
    </Svg>
  ),
  // 통신 — 휴대폰과 전파
  telecom: () => (
    <Svg>
      <rect x="7" y="6" width="8" height="15" rx="1.5" />
      <path d="M10 18h2" />
      <path d="M17.5 4.5a5 5 0 0 1 0 7" />
      <path d="M19.5 2.5a8 8 0 0 1 0 11" />
    </Svg>
  ),
  // 휴게소 — 포크와 나이프
  "rest-area": () => (
    <Svg>
      <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10" />
      <path d="M17 21V3c-2 1-3 4-3 8h3" />
    </Svg>
  ),
  // 전관예우 — 법봉
  "revolving-door": () => (
    <Svg>
      <rect x="4" y="6.5" width="10" height="5" rx="1" transform="rotate(-45 9 9)" />
      <path d="m11 11 8 8" />
      <path d="M3 21h8" />
    </Svg>
  ),
  // 건설 — 안전모
  construction: () => (
    <Svg>
      <path d="M2 17h20v2H2z" />
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M10 9.5V13M14 9.5V13" />
    </Svg>
  ),
  // 지역 토착 — 지도 핀
  "local-establishment": () => (
    <Svg>
      <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </Svg>
  ),
  // 정유사 — 주유기
  refinery: () => (
    <Svg>
      <path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M3 21h12M7 8h4" />
      <path d="M14 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-3-3" />
    </Svg>
  ),
  // 금융 — 은행 건물
  finance: () => (
    <Svg>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7" />
      <path d="M3 20h18" />
    </Svg>
  ),
  // 관료 — 도장 찍힌 서류
  bureaucracy: () => (
    <Svg>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 11h6M9 14h3" />
      <circle cx="14.5" cy="17" r="1.8" />
    </Svg>
  ),
  // 언론 — 신문
  media: () => (
    <Svg>
      <path d="M4 5h13v14H6a2 2 0 0 1-2-2z" />
      <path d="M17 9h3v8a2 2 0 0 1-2 2" />
      <path d="M7 8h7M7 11h7M7 14h4" />
    </Svg>
  ),
  // 교육 — 학사모
  education: () => (
    <Svg>
      <path d="m2 9 10-5 10 5-10 5z" />
      <path d="M6 11v5c2 2 10 2 12 0v-5" />
      <path d="M22 9v6" />
    </Svg>
  ),
  fallback: () => (
    <Svg>
      <circle cx="12" cy="12" r="7" />
    </Svg>
  ),
};
