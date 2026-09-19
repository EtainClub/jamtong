"use client";

import { useRouter } from "next/navigation";

/**
 * 뒤로 가기.
 *
 * 업적 상세는 목록에서도, 홈에서도, 타임라인에서도, 공유 링크로도 들어온다.
 * 그래서 목적지를 하나로 못 박지 않고 온 길로 되돌린다.
 *
 * 판정에 document.referrer를 쓰지 않는다. App Router의 클라이언트 이동은
 * referrer를 갱신하지 않아서, 목록에서 들어와도 늘 빈 문자열이다. 그걸 믿으면
 * 가장 흔한 경우에 뒤로가 동작하지 않는다.
 *
 * 남은 것은 히스토리 길이뿐이다. 새 탭에 주소를 붙여 넣고 들어온 경우가 1이고,
 * 그때는 되돌아갈 자리가 없으므로 업적 목록으로 보낸다 — 상세에서 올라갈
 * 자리는 목록이다.
 */
export function BackButton({ fallback = "/explore" }: { fallback?: string }) {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallback);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="뒤로 가기"
      className="-ml-1.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1.5 text-sm font-medium text-smoke transition-colors hover:bg-taupe hover:text-ink"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      뒤로
    </button>
  );
}
