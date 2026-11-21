import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { LOCALE_INFO, isBookLocale, type BookLocale } from "@/content/books/i18n";
import { getLocalizedBook, localizedChapterPath, translatedBooks } from "@/content/books/translations";
import { BOOK_UI } from "@/features/books/ui";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return translatedBooks()
    .filter((b) => b.locale === params.locale)
    .map((b) => ({ slug: b.slug }));
}

const COPY: Record<BookLocale, { translated: (n: number, total: number) => string; original: string; notice: string }> = {
  ja: {
    translated: (n, total) => `全${total}章のうち${n}章を日本語に訳しました。`,
    original: "韓国語の原文で読む",
    notice: "私たちが本を読んで韓国語で書いた要約を、日本語に訳したものです。著者の文章でも、公式の翻訳でもありません。",
  },
  en: {
    translated: (n, total) => `${n} of ${total} chapters translated into English so far.`,
    original: "Read the Korean original",
    notice: "Our translation of a summary we wrote in Korean after reading the book. Neither the author's own words nor an official translation.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isBookLocale(locale)) return {};
  const localized = getLocalizedBook(locale, slug);
  if (!localized) return {};
  const { book } = localized;
  const path = `/${locale}/books/${slug}`;

  return {
    title: { absolute: `${book.title} · Jamtong` },
    description: book.note,
    /*
     * 한국어 책 목차와는 hreflang으로 잇지 않는다. 저쪽은 여덟 장, 이쪽은 옮긴 장만이라
     * 같은 내용의 다른 언어판이 아니다. 장 단위에서만 서로를 가리킨다.
     */
    alternates: { canonical: path },
    openGraph: { type: "book", url: path, title: book.title, description: book.note, locale: LOCALE_INFO[locale].og },
  };
}

/** 옮긴 책의 목차. 옮긴 장만 늘어놓고, 나머지는 한국어 원문으로 보낸다. */
export default async function LocalizedBookPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isBookLocale(locale)) notFound();
  const localized = getLocalizedBook(locale, slug);
  if (!localized) notFound();

  const { book, original } = localized;
  const t = BOOK_UI[locale];
  const copy = COPY[locale];

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[560px] items-center justify-between gap-2 px-4">
          <Link href="/" lang="ko" className="text-sm font-semibold text-smoke transition-colors hover:text-ink">
            잼통 Jamtong
          </Link>
          <Link
            href={`/books/${original.slug}`}
            hrefLang="ko"
            className="text-[12px] font-medium text-navy hover:underline"
          >
            {copy.original} →
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">{book.title}</h1>
        {book.subtitle && <p className="mt-1 text-[14px] text-smoke">{book.subtitle}</p>}
        <p className="mt-1 text-[12px] text-ash" lang="ko">
          {original.title}
          {original.subtitle ? ` — ${original.subtitle}` : ""} · {original.publisher}, {original.year}
        </p>

        <p className="mt-4 text-[13px] leading-relaxed text-smoke">{book.note}</p>
        <p className="mt-3 rounded-card border border-stone bg-taupe/60 px-4 py-3 text-[12px] leading-relaxed text-smoke">
          {copy.notice} {copy.translated(book.chapters.length, original.chapters.length)}
        </p>

        <ol className="mt-6 space-y-3">
          {book.chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link
                href={localizedChapterPath(locale, original.slug, chapter.slug)}
                className="block rounded-card border border-stone px-4 py-3 transition-colors hover:border-graphite"
              >
                <span className="text-[11px] font-semibold text-ash">
                  {t.chapterN(chapter.order)} · {t.minutes(chapter.minutes)}
                </span>
                <span className="mt-0.5 block text-[15px] font-bold text-ink">{chapter.title}</span>
                <span className="mt-1 block text-[12.5px] leading-relaxed text-smoke">{chapter.summary}</span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
