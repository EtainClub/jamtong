import Link from "next/link";

import type { Statement } from "@/content/words/schema";
import { SpeechVideo } from "./SpeechVideo";
import { youtubeVideoId } from "./youtube";

/** 유튜브로 틀 수 있는 연설인지. 언행 목록에서 따로 묶는 기준이다. */
export function speechVideoId(statement: Statement): string | null {
  if (statement.kind !== "speech") return null;
  for (const media of statement.media) {
    const id = media.type === "youtube" ? youtubeVideoId(media.url) : null;
    if (id) return id;
  }
  return null;
}

/**
 * 언행 목록의 연설 영상 카드.
 *
 * 목록에서 바로 틀고, 바로 읽을 수 있게 한다. 영상 아래에 전문이 있으면
 * 전문을, 없으면 요약을 접어 둔다. 둘을 같은 이름으로 부르지 않는다 —
 * 요약을 전문처럼 읽히게 두면 "그렇게 말했다"의 근거가 우리가 쓴 글이 된다.
 *
 * ★ 쉽게 보기와 원문 대조는 상세 화면의 일이다. 여기서는 한 화면에 영상과
 *   글 한 덩어리만 둔다.
 */
export function SpeechCard({ statement, videoId }: { statement: Statement; videoId: string }) {
  const media = statement.media[0];
  const text = statement.body ?? statement.overview ?? "";

  return (
    <article className="rounded-card border border-stone px-5 py-4">
      <SpeechVideo videoId={videoId} title={media?.title ?? statement.title} />

      <div className="mt-3.5 flex items-center gap-2 text-[11px] font-semibold text-ash">
        <span className="rounded-full bg-taupe px-2 py-0.5 text-navy">연설 영상</span>
        <span>{statement.displayDate}</span>
      </div>

      <h3 className="mt-2 text-[17px] font-bold tracking-tight text-ink">
        <Link href={`/words/${statement.slug}`} className="hover:underline">
          {statement.title}
        </Link>
      </h3>
      <p className="mt-1 text-[11px] text-ash">{statement.channel}</p>

      {statement.easy && (
        <p className="mt-2.5 text-[13px] leading-relaxed text-smoke">{statement.easy.intro}</p>
      )}

      <details className="group mt-3">
        <summary className="cursor-pointer list-none text-[12px] font-semibold text-navy hover:underline">
          {statement.body ? "연설 전문 펼치기" : "영상 요약 펼치기 · 전문이 아닙니다"}
          <span aria-hidden="true" className="ml-1 inline-block group-open:hidden">
            ▾
          </span>
          <span aria-hidden="true" className="ml-1 hidden group-open:inline-block">
            ▴
          </span>
        </summary>
        <div className="mt-2.5 max-h-[420px] overflow-y-auto rounded-card border border-stone bg-taupe/50 px-4 py-3.5">
          <p className="whitespace-pre-wrap text-[14px] leading-[1.85] text-ink">{text}</p>
        </div>
      </details>

      <Link
        href={`/words/${statement.slug}`}
        className="mt-3 inline-block text-[12px] font-semibold text-navy hover:underline"
      >
        {statement.easy ? "쉽게 보기 · 원문 대조는 상세에서 →" : "상세 보기 →"}
      </Link>
    </article>
  );
}
