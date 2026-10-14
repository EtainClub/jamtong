/**
 * 소설 한 편의 숏츠 자리.
 *
 * 자서전 장의 숏츠(ChapterShorts)와 같은 방식이다 — 영상은 유튜브에 두고
 * `youtube-nocookie.com`으로 lazy하게 붙인다. 아직 없는 편도 같은 크기의
 * 자리를 그리고 "준비 중"이라고 적는다. 빈 액자를 그림인 척하지 않는다.
 */
export function ShortsSlot({
  youtubeId,
  title,
  no,
  dark = false,
}: {
  youtubeId?: string;
  title: string;
  no: number;
  /** 시리즈 첫 화면의 검은 바탕 위에 놓일 때. */
  dark?: boolean;
}) {
  if (youtubeId) {
    return (
      <div
        className={`relative aspect-[9/16] overflow-hidden rounded-card border ${
          dark ? "border-white/15 bg-white/5" : "border-stone bg-taupe"
        }`}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[9/16] overflow-hidden rounded-card border border-dashed ${
        dark ? "border-white/20 bg-white/[0.04]" : "border-stone bg-taupe/40"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-3 top-2 text-[40px] font-black leading-none tracking-tighter ${
          dark ? "text-white/15" : "text-stone"
        }`}
      >
        {no}
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center text-[11px] font-semibold ${
          dark ? "text-white/45" : "text-ash"
        }`}
      >
        숏츠 준비 중
      </span>
    </div>
  );
}
