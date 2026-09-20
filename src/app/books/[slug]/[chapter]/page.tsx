import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BOOKS, getChapter } from "@/content/books";
import { BackButton } from "@/features/app/BackButton";
import { BottomNav } from "@/features/app/BottomNav";
import { ActionList } from "@/features/books/ActionList";
import { ChapterView } from "@/features/books/ChapterView";

export function generateStaticParams() {
  return BOOKS.flatMap((book) =>
    book.chapters.map((chapter) => ({ slug: book.slug, chapter: chapter.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}): Promise<Metadata> {
  const { slug, chapter } = await params;
  const found = getChapter(slug, chapter);
  if (!found) return {};
  return {
    title: `${found.chapter.title} · ${found.book.title}`,
    description: found.chapter.summary,
  };
}

/**
 * 장 하나.
 *
 * 순서에 의도가 있다: 쉽게 보기(또는 발췌) → **할 일** → 다음 장.
 * 할 일을 맨 아래 부록으로 두면 아무도 보지 않고, 맨 위에 두면 읽지 않은
 * 사람에게 시키는 꼴이 된다. 읽은 직후가 제자리다.
 */
export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = await params;
  const found = getChapter(slug, chapter);
  if (!found) notFound();

  const { book, chapter: current } = found;
  const ordered = [...book.chapters].sort((a, b) => a.order - b.order);
  const at = ordered.findIndex((c) => c.slug === current.slug);
  const next = ordered[at + 1];

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[560px] items-center gap-1.5 px-4">
          <BackButton />
          <Link
            href={`/books/${book.slug}`}
            className="min-w-0 truncate text-sm font-semibold text-smoke transition-colors hover:text-ink"
          >
            {book.title}
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-ash">
          <span className="rounded-full bg-taupe px-2 py-0.5 text-navy">
            {current.order}장 / {ordered.length}
          </span>
          {book.sample && (
            <span className="rounded-full bg-ink px-2 py-0.5 text-eggshell">샘플</span>
          )}
          <span>{current.minutes}분</span>
        </div>

        <h1 className="mt-2.5 text-2xl font-light tracking-[-0.02em] text-ink">
          {current.title}
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">{current.summary}</p>

        <ChapterView chapter={current} />

        <ActionList actions={current.actions} />

        {next && (
          <Link
            href={`/books/${book.slug}/${next.slug}`}
            className="mt-6 block rounded-card border border-stone px-4 py-3 transition-colors hover:border-graphite"
          >
            <span className="text-[11px] font-semibold text-ash">다음 장</span>
            <span className="mt-0.5 block text-[14px] font-bold text-ink">{next.title}</span>
          </Link>
        )}
      </main>

      <BottomNav />
    </>
  );
}
