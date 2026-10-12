"use client";

import { useState } from "react";

/**
 * 연설 영상 한 편.
 *
 * ★ 누르기 전에는 썸네일만 둔다.
 *   목록에 iframe을 여러 개 붙이면 영상마다 유튜브 플레이어를 통째로 받는다.
 *   언행 목록만 훑고 나가는 사람이 그 값을 치를 이유가 없다. 누르면 그
 *   자리에서 iframe으로 바꾸고 바로 튼다. 상세 화면도 같은 것을 쓴다.
 */
export function SpeechVideo({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="aspect-video overflow-hidden rounded-card border border-stone bg-black">
      {playing ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`영상 재생: ${title}`}
          className="group relative block h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 유튜브 썸네일은 외부 이미지라 next/image 최적화를 거치지 않는다 */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 pl-1 text-xl text-white transition-transform group-hover:scale-110"
          >
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
