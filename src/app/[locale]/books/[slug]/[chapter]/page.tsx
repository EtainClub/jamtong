import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { LOCALE_INFO, isBookLocale, type BookLocale, type TranslationReview } from "@/content/books/i18n";
import {
  chapterLanguages,
  chapterLocales,
  getLocalizedChapter,
  localizedChapterPath,
  translatedChapters,
} from "@/content/books/translations";
import { ShareLinkButton } from "@/features/app/ShareLinkButton";
import { ActionList } from "@/features/books/ActionList";
import { ChapterView } from "@/features/books/ChapterView";
import { LanguageLinks } from "@/features/books/LanguageLinks";
import { BOOK_UI } from "@/features/books/ui";
import { JsonLd, articleLd } from "@/lib/seo/jsonld";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return translatedChapters()
    .filter((c) => c.locale === params.locale)
    .map(({ slug, chapter }) => ({ slug, chapter }));
}

/** 이 화면에만 있는 글자 — 번역이라는 밝힘. */
const COPY: Record<
  BookLocale,
  {
    notice: string;
    review: (r: TranslationReview) => string;
    stale: string;
    original: string;
    book: string;
  }
> = {
  ja: {
    notice:
      "この章は、私たちが本を読んで韓国語で書いた要約を日本語に訳したものです。著者の文章でも、公式の翻訳でもありません。",
    review: (r) =>
      r.reviewed
        ? `ネイティブスピーカーが原文と照らし合わせて確認しました${r.reviewedAt ? `（${r.reviewedAt}）` : ""}。`
        : r.method === "machine"
          ? "機械翻訳で、ネイティブスピーカーによる確認はまだです。"
          : "ネイティブスピーカーによる確認はまだです。",
    stale: "この翻訳のあとで韓国語の原文が更新されました。翻訳はまだ追いついていません。",
    original: "韓国語の原文で読む",
    book: "目次",
  },
  en: {
    notice:
      "This chapter is our English translation of a summary we wrote in Korean after reading the book. It is neither the author's own words nor an official translation.",
    review: (r) =>
      r.reviewed
        ? `Checked against the original by a native speaker${r.reviewedAt ? ` (${r.reviewedAt})` : ""}.`
        : r.method === "machine"
          ? "Machine-translated; not yet checked by a native speaker."
          : "Not yet checked by a native speaker.",
    stale: "The Korean original has changed since this translation was made, and the translation has not caught up yet.",
    original: "Read the Korean original",
    book: "Contents",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; chapter: string }>;
}): Promise<Metadata> {
  const { locale, slug, chapter } = await params;
  if (!isBookLocale(locale)) return {};
  const found = getLocalizedChapter(locale, slug, chapter);
  if (!found) return {};
  const path = localizedChapterPath(locale, slug, chapter);

  return {
    title: { absolute: `${found.chapter.title} · ${found.localized.book.title} · Jamtong` },
    description: found.chapter.summary,
    alternates: { canonical: path, languages: chapterLanguages(slug, chapter) },
    openGraph: {
      type: "article",
      url: path,
      title: found.chapter.title,
      description: found.chapter.summary,
      locale: LOCALE_INFO[locale].og,
    },
  };
}

/**
 * 옮긴 장 하나 (docs/book-i18n.md).
 *
 * 한국어 장(`/books/[slug]/[chapter]`)과 같은 부품(ChapterView·ActionList)을 쓰고, 글자만 그 언어다.
 * 다른 점은 셋이다.
 *   1. 맨 위에 "우리 요약을 옮긴 것이고, 검수했는지/원문이 바뀌었는지"를 밝힌다.
 *   2. 사이트 하단 탭(BottomNav)을 두지 않는다. 탭은 한국어 사이트의 길이라 이 독자에게 막다른 길이다.
 *   3. 할 일을 하나도 옮기지 않은 장이면 할 일 블록을 두지 않는다(한국에 사는 사람을 위한 것이라서).
 */
export default async function LocalizedChapterPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; chapter: string }>;
}) {
  const { locale, slug, chapter } = await params;
  if (!isBookLocale(locale)) notFound();
  const found = getLocalizedChapter(locale, slug, chapter);
  if (!found) notFound();

  const { localized, chapter: current, info } = found;
  const { book, original } = localized;
  const t = BOOK_UI[locale];
  const copy = COPY[locale];
  const at = book.chapters.findIndex((c) => c.slug === current.slug);
  const next = book.chapters[at + 1];
  const path = localizedChapterPath(locale, slug, current.slug);
  const koPath = `/books/${original.slug}/${current.slug}`;
  const shareTitle = `${current.title} · ${book.title}`;
  const shareLabel = {
    text: t.share.text,
    aria: t.share.aria,
    copied: t.share.copied,
    done: t.share.done,
    prompt: t.share.ask,
  };

  return (
    <>
      <JsonLd
        data={articleLd({
          path,
          headline: current.title,
          description: current.summary,
          image: `${path}/opengraph-image`,
          inLanguage: locale,
          translationOf: koPath,
          isPartOf: {
            "@type": "Book",
            name: original.title,
            inLanguage: "ko",
            author: { "@type": "Person", name: "이재명" },
            publisher: { "@type": "Organization", name: original.publisher },
            datePublished: String(original.year),
          },
        })}
      />

      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[560px] items-center justify-between gap-2 px-4">
          <Link
            href={`/${locale}/books/${original.slug}`}
            className="min-w-0 truncate text-sm font-semibold text-smoke transition-colors hover:text-ink"
          >
            ← {book.title}
          </Link>
          <ShareLinkButton title={shareTitle} surface="chapter" label={shareLabel} kakao={false} compact />
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-ash">
          <span className="rounded-full bg-taupe px-2 py-0.5 text-navy">
            {t.chapterOf(current.order, original.chapters.length)}
          </span>
          <span>{t.minutes(current.minutes)}</span>
        </div>

        <h1 className="mt-2.5 text-2xl font-light tracking-[-0.02em] text-ink">{current.title}</h1>
        <p className="mt-1 text-[12px] text-ash" lang="ko">
          {info.originalTitle}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">{current.summary}</p>

        <LanguageLinks
          current={locale}
          links={[
            { locale: "ko", href: koPath },
            ...chapterLocales(original.slug, current.slug).map((l) => ({
              locale: l,
              href: localizedChapterPath(l, original.slug, current.slug),
            })),
          ]}
        />

        <aside className="mt-4 rounded-card border border-stone bg-taupe/60 px-4 py-3 text-[12px] leading-relaxed text-smoke">
          <p>
            {copy.notice} {copy.review(info.review)}
          </p>
          {info.stale && <p className="mt-1.5 font-semibold text-burgundy">{copy.stale}</p>}
          <Link href={koPath} hrefLang="ko" className="mt-1.5 inline-block font-medium text-navy hover:underline">
            {copy.original} →
          </Link>
        </aside>

        <ChapterView chapter={current} lang={locale} />

        {current.actions.length > 0 && <ActionList actions={current.actions} lang={locale} />}

        {next && (
          <Link
            href={localizedChapterPath(locale, original.slug, next.slug)}
            className="mt-6 block rounded-card border border-stone px-4 py-3 transition-colors hover:border-graphite"
          >
            <span className="text-[11px] font-semibold text-ash">{t.nextChapter}</span>
            <span className="mt-0.5 block text-[14px] font-bold text-ink">{next.title}</span>
          </Link>
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-stone pt-6">
          <p className="text-[12px] leading-relaxed text-smoke">{t.share.prompt}</p>
          <ShareLinkButton title={shareTitle} surface="chapter" label={shareLabel} kakao={false} />
        </div>
      </main>
    </>
  );
}
