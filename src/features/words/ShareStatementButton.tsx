"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { track } from "@/lib/analytics";

/**
 * 언행 한 편을 공유한다.
 *
 * 업적 쪽 ShareButton과 다른 점 하나. 저기는 VisualState를 URL에 실어
 * "지금 이 화면"을 보내지만, 여기에는 담을 화면 상태가 없다. 쉽게 보기와
 * 원문 사이의 전환은 URL에 없고, 링크를 연 사람은 이 글의 처음을 본다.
 * 그래서 보내는 것은 글 하나의 주소다.
 *
 * 공유 시트가 있으면 그것을 먼저 쓴다. 이 화면은 손에 들고 보는 쪽에
 * 맞춰져 있고, 거기서는 링크를 복사해 붙이는 것보다 시트가 짧다. 없으면
 * 클립보드, 그것도 막히면 prompt로 내려간다.
 */
export function ShareStatementButton({
  title,
  compact = false,
}: {
  title: string;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = `${window.location.origin}${pathname}`;
    track("share_create", { surface: "words" });

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /*
         * 시트를 닫아도 여기로 온다. 취소와 실패를 가릴 방법이 마땅치
         * 않으므로 복사로 넘어간다 — 취소한 사람에게 링크가 복사되는 편이
         * 링크를 잃는 것보다 낫다.
         */
      }
    }

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
      aria-label="이 언행 공유"
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-stone bg-taupe py-2 text-sm font-medium text-smoke transition-colors hover:border-graphite hover:text-navy ${
        compact ? "px-3 sm:px-4" : "px-4"
      }`}
    >
      <span aria-hidden="true">↗</span>
      {/*
       * 좁은 화면에서는 화살표만 남긴다 — 상단 바에 글자가 들어갈 자리가 좁다.
       * 다만 복사한 뒤에는 접지 않는다. 시트가 없는 환경에서 조용히 복사만
       * 되면 눌린 것인지 알 수 없고, 그 환경이 바로 이 좁은 화면이다.
       */}
      <span className={compact && !copied ? "hidden sm:inline" : undefined}>
        {copied ? "링크를 복사했습니다" : "공유"}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "이 언행의 링크를 클립보드에 복사했습니다." : ""}
      </span>
    </button>
  );
}
