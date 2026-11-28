import Link from "next/link";

/**
 * 원본 페이지에서 잼공으로 가는 작은 문 — "이 내용으로 연습하기"(docs/daily-study.md §8.4).
 *
 * ★ 페이지 맨 끝, 씨앗 받기 옆에 둔다. 정보 페이지는 공부 레이어가 가리지 않는다(docs/garden-game.md §1).
 */
export function StudyPracticeLink({ slug, title }: { slug: string; title: string }) {
  return (
    <div className="mx-auto max-w-5xl px-5">
      <Link
        href={`/study?unit=${encodeURIComponent(slug)}`}
        className="flex items-center gap-3 rounded-card border border-stone bg-taupe/60 px-4 py-3 text-[13px] text-graphite transition-colors hover:border-graphite"
      >
        <span className="text-xl" aria-hidden>
          📖
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-ink">「{title}」 내용으로 연습하기</span>
          <span className="text-[12px] text-smoke">잼공에서 O/X로 풀어 보고, 근거를 근거노트에 모아요.</span>
        </span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
