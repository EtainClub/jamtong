"use client";

import { useCallback, useEffect, useState } from "react";

import { BUILD } from "@/lib/build-info";

/**
 * 새 배포가 있었는지 알린다.
 *
 * 웹앱에는 "업데이트 하세요"가 없다. 대신 오래 열어 둔 탭이 옛 번들을 붙들고
 * 있는 일이 생긴다. 스토리 하나를 30분 읽는 제품이라 실제로 일어난다.
 *
 * 스스로 새로고침하지 않는다. 읽던 자리를 빼앗는 새로고침은 고장과 구별되지
 * 않는다. 알리기만 하고 누를지는 사용자가 정한다.
 */

const POLL_MS = 10 * 60 * 1000;

export function UpdateNotice() {
  const [stale, setStale] = useState(false);

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/version", { cache: "no-store" });
      if (!res.ok) return;
      const server = (await res.json()) as { id?: string };
      if (server.id && server.id !== BUILD.id) setStale(true);
    } catch {
      // 오프라인이거나 배포 중일 수 있다. 조용히 넘어간다 — 다음 주기에 다시 본다.
    }
  }, []);

  useEffect(() => {
    if (stale) return;
    const timer = setInterval(check, POLL_MS);
    // 탭으로 돌아오는 순간이 가장 오래 묵어 있었을 때다.
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [check, stale]);

  if (!stale) return null;

  return (
    <div
      role="status"
      className="sticky top-14 z-30 border-b border-stone bg-navy-tint px-4 py-2.5"
    >
      <div className="mx-auto flex max-w-[560px] items-center justify-between gap-3">
        <span className="text-[13px] text-navy">새 버전이 배포되었습니다.</span>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="shrink-0 rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-eggshell"
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
