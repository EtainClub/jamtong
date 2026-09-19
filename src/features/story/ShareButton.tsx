"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useVisualState } from "@/lib/visual-state/store";
import { buildShareUrl } from "@/lib/visual-state/url-sync";

/**
 * 공유 (설계서 36·37장).
 *
 * 저장된 스냅샷 레코드를 만들지 않는다. 현재 VisualState를 그대로 담은
 * URL 하나면 충분하고, 링크를 연 사람은 같은 화면 상태로 도착한다.
 * (검토 문서 5.3)
 */
export function ShareButton() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = buildShareUrl(window.location.origin, pathname, useVisualState.getState());
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("이 링크를 복사하세요", url);
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className="inline-flex items-center gap-2 rounded-full border border-stone bg-taupe px-4 py-2 text-sm font-medium text-smoke transition-colors hover:border-graphite hover:text-navy"
    >
      <span aria-hidden="true">↗</span>
      {copied ? "링크를 복사했습니다" : "지금 이 화면 공유"}
      <span className="sr-only" aria-live="polite">
        {copied ? "현재 화면 상태가 담긴 링크를 클립보드에 복사했습니다." : ""}
      </span>
    </button>
  );
}
