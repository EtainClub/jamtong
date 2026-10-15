"use client";

import { ScrollArrow, useScroller } from "@/features/app/Scroller";
import type { NovelEpisode } from "@/content/novels";

import { ShortsSlot } from "./ShortsSlot";

/**
 * 시리즈 첫 화면의 숏츠 줄.
 *
 * 칸 대부분이 유튜브 iframe이라 마우스 드래그는 iframe이 삼킨다 — 데스크탑에서는
 * 끌어서 넘길 수 없다. 그래서 다른 가로 목록처럼 포인터가 정밀할 때만 화살표를 띄운다.
 */
export function ShortsRow({
  novelTitle,
  episodes,
}: {
  novelTitle: string;
  /** 본문은 넘기지 않는다 — 클라이언트 번들에 실릴 이유가 없다. */
  episodes: Pick<NovelEpisode, "no" | "title" | "shortsId">[];
}) {
  const { ref, canPrev, canNext, onScroll, page } = useScroller<HTMLUListElement>();

  return (
    <div className="relative mt-3">
      <ul
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-1"
      >
        {episodes.map((ep) => (
          <li key={ep.no} className="w-[124px] shrink-0 snap-start">
            <ShortsSlot
              dark
              no={ep.no}
              youtubeId={ep.shortsId}
              title={`《${novelTitle}》 ${ep.no}편${ep.title ? ` ${ep.title}` : ""}`}
            />
            <p className="mt-1.5 truncate text-[11.5px] font-semibold text-white/80">
              {ep.no}편{ep.title ? ` · ${ep.title}` : ""}
            </p>
          </li>
        ))}
      </ul>
      <ScrollArrow dir={-1} disabled={!canPrev} onClick={() => page(-1, 0.8)} label="이전 숏츠" />
      <ScrollArrow dir={1} disabled={!canNext} onClick={() => page(1, 0.8)} label="다음 숏츠" />
    </div>
  );
}
