import type { BookShort } from "@/content/books/schema";

/**
 * 장으로 만든 숏츠.
 *
 * 영상은 유튜브에 두고 여기서는 틀기만 한다. `youtube-nocookie.com`을 쓰고
 * 즉시 붙이되 lazy로 둔다 — 업적 쪽 ShortsSection과 같은 방식이다.
 *
 * ★ 아직 없는 자리를 비워 두지 않는다.
 *   영상이 붙기 전에도 이 자리가 보인다. 자리가 없으면 만들 사람도, 기다릴
 *   사람도 여기에 무엇이 올지 모른다. 다만 "준비 중"이라고 분명히 적는다 —
 *   빈 액자를 걸어 두고 그림이 있는 척하지 않는다.
 */
export function ChapterShorts({
  shorts,
  chapterTitle,
  order,
}: {
  shorts: BookShort[];
  chapterTitle: string;
  order: number;
}) {
  return (
    <section aria-labelledby="shorts" className="mt-8">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="shorts" className="text-[13px] font-bold text-ink">
          이 장의 숏츠
        </h2>
        <span className="text-[11px] text-ash">{order}장</span>
      </div>

      {shorts.length === 0 ? (
        <div className="mt-3 flex gap-3">
          <div className="relative aspect-[9/16] w-[132px] shrink-0 overflow-hidden rounded-card border border-dashed border-stone bg-taupe/40">
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-ash">
              준비 중
            </span>
          </div>
          <p className="min-w-0 self-center text-[12px] leading-relaxed text-smoke">
            이 장의 본문으로 만든 숏츠가 여기 붙습니다. 아직 만들지 않았습니다 —
            영상이 올라오면 제목과 함께 이 자리에 뜹니다.
          </p>
        </div>
      ) : (
        <ul className="no-scrollbar -mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {shorts.map((short) => (
            <li key={short.id} className="w-[178px] shrink-0 snap-start">
              <div className="relative aspect-[9/16] overflow-hidden rounded-card border border-stone bg-taupe">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${short.youtubeId}?rel=0&modestbranding=1`}
                  title={short.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <p className="mt-2 text-[12.5px] font-bold leading-snug text-ink">{short.title}</p>
              {short.summary && (
                <p className="mt-1 text-[11.5px] leading-relaxed text-smoke">{short.summary}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-ash">
        「{chapterTitle}」의 요약을 옮긴 영상입니다. 짧을수록 맥락이 잘리므로, 영상만
        보고 판단하기 전에 위의 요약 원문을 함께 보시기 바랍니다.
      </p>
    </section>
  );
}
