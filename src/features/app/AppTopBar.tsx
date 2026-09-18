import Link from "next/link";

/** 상단 바. 로고와 메뉴만 둔다. 모바일에서 세로 공간은 가장 비싼 자원이다. */
export function AppTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-800/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[560px] items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-full bg-ice-500 text-[13px] font-bold text-ink-900"
          >
            李
          </span>
          <span className="text-[15px] font-bold tracking-tight text-text-primary">
            이재명 업적 위키
          </span>
        </Link>

        <button
          type="button"
          aria-label="메뉴 열기"
          className="grid h-9 w-9 place-items-center rounded-lg text-text-secondary transition-colors hover:bg-white/5"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
