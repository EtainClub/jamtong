import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BOOKS, getBook } from "@/content/books";
import { BackButton } from "@/features/app/BackButton";
import { BottomNav } from "@/features/app/BottomNav";

export function generateStaticParams() {
  return BOOKS.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  return {
    title: `${book.title} · 자서전`,
    description: `${book.publisher} ${book.year}. 장마다 쉽게 보기와 할 일을 함께 둡니다.`,
  };
}

/**
 * 자서전 한 권 — 장 목록.
 *
 * 책을 통째로 옮기는 화면이 아니다. 장을 골라 들어가는 자리이고, 각 장에서
 * 읽고 나면 할 일이 남는다. 그래서 목록에도 장마다 할 일이 몇 개인지 적는다.
 */
export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const chapters = [...book.chapters].sort((a, b) => a.order - b.order);
  const actions = chapters.reduce((n, c) => n + c.actions.length, 0);

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[560px] items-center gap-1.5 px-4">
          <BackButton />
          <Link
            href="/words"
            className="shrink-0 text-sm font-semibold text-smoke transition-colors hover:text-ink"
          >
            자서전
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-ash">
          <span className="rounded-full bg-taupe px-2 py-0.5 text-navy">자서전</span>
          {book.sample && (
            <span className="rounded-full bg-ink px-2 py-0.5 text-eggshell">샘플</span>
          )}
          <span>{book.year}</span>
        </div>

        <h1 className="mt-2.5 text-2xl font-light tracking-[-0.02em] text-ink">{book.title}</h1>
        {book.subtitle && <p className="mt-1 text-[14px] text-smoke">{book.subtitle}</p>}
        <p className="mt-2 text-[12px] text-ash">{book.publisher}</p>

        {book.sample && (
          <p className="mt-4 rounded-card border-2 border-ink bg-taupe/60 px-4 py-3 text-[13px] leading-relaxed text-ink">
            <strong className="font-bold">이 책은 샘플입니다.</strong> 이재명 대통령이 쓴
            책이 아니라, 장 구성과 할 일이 화면에서 어떻게 보이는지 확인하려고 편집부가
            쓴 것입니다. 실제 저서 여섯 권은 아직 서지 정보만 있습니다.
          </p>
        )}

        {book.note && (
          <p className="mt-4 border-l-2 border-stone pl-3 text-[13px] leading-relaxed text-smoke">
            {book.note}
          </p>
        )}

        {chapters.length === 0 ? (
          <section className="mt-8 rounded-card border border-dashed border-stone bg-taupe/40 px-4 py-5">
            <h2 className="text-[13px] font-bold text-ink">아직 정리하지 않았습니다</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-smoke">
              지금 있는 것은 서지 정보뿐입니다. 책 내용은 실물을 펴 놓고 한 장씩
              넣습니다 — 읽지 않은 책을 요약하지 않습니다. 저작물이라 전문은 싣지
              않고, 장마다 우리가 옮긴 요약과 인용 범위 안의 발췌만 둡니다.
            </p>
          </section>
        ) : (
          <section aria-labelledby="chapters" className="mt-8">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="chapters" className="text-[15px] font-bold text-ink">
                장 {chapters.length}
              </h2>
              <p className="text-[12px] text-ash">할 일 {actions}개</p>
            </div>

            <ol className="mt-3 space-y-2">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <Link
                    href={`/books/${book.slug}/${chapter.slug}`}
                    className="block rounded-card border border-stone px-4 py-3 transition-colors hover:border-graphite"
                  >
                    <span className="text-[11px] font-semibold text-ash">
                      {chapter.order}장 · {chapter.minutes}분
                    </span>
                    <span className="mt-0.5 block text-[14px] font-bold text-ink">
                      {chapter.title}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-smoke">
                      {chapter.summary}
                    </span>
                    <span className="mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="rounded-full bg-taupe px-2 py-0.5 font-semibold text-navy">
                        할 일 {chapter.actions.length}
                      </span>
                      {!chapter.excerpt && (
                        <span className="rounded-full border border-stone px-2 py-0.5 text-ash">
                          발췌 없음
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mt-9 border-t border-stone pt-6">
          <h2 className="text-[13px] font-bold text-ink">서지 정보의 출처</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-smoke">
            {book.source.verified
              ? "출판사 또는 도서관 자료로 대조했습니다."
              : "아직 2차 자료만 보고 적었습니다. 출판사나 도서관 자료로 대조하면 이 문구가 바뀝니다."}
          </p>
          <a
            href={book.source.url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block text-[12px] text-navy hover:underline"
          >
            {book.source.publisher} 『{book.source.title}』 ↗
          </a>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
