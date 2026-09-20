"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { useVisualState } from "@/lib/visual-state/store";
import { buildShareUrl } from "@/lib/visual-state/url-sync";

/**
 * 공유 (설계서 36·37장).
 *
 * 저장된 스냅샷 레코드를 만들지 않는다. 현재 VisualState를 그대로 담은
 * URL 하나면 충분하고, 링크를 연 사람은 같은 화면 상태로 도착한다.
 * (검토 문서 5.3)
 */
export function ShareButton({ compact = false }: { compact?: boolean } = {}) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const state = useVisualState.getState();
    const url = buildShareUrl(window.location.origin, pathname, state);
    /* 무엇을 공유했는지가 아니라 어느 장면에서 공유가 나오는지를 센다. */
    track("share_create", { surface: "achievement", scene: state.sceneId });
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
      aria-label="지금 이 화면 공유"
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-stone bg-taupe py-2 text-sm font-medium text-smoke transition-colors hover:border-graphite hover:text-navy ${
        compact ? "px-3 sm:px-4" : "px-4"
      }`}
    >
      <span aria-hidden="true">↗</span>
      {/*
       * 상단 바에서만 좁은 화면에서 글자를 접는다(compact). 공유 섹션에서는
       * 이 버튼이 그 섹션의 전부이므로 글자를 지우면 무엇을 누르는지 알 수 없다.
       */}
      <span className={compact ? "hidden sm:inline" : undefined}>
        {copied ? "링크를 복사했습니다" : "지금 이 화면 공유"}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "현재 화면 상태가 담긴 링크를 클립보드에 복사했습니다." : ""}
      </span>
    </button>
  );
}
