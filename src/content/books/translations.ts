import { getBook } from "./index";
import { AUTOBIOGRAPHY_EN } from "./auto_2025/i18n/en";
import { AUTOBIOGRAPHY_JA } from "./auto_2025/i18n/ja";
import {
  BOOK_LOCALES,
  bookTranslationSchema,
  localizeBook,
  validateLocalized,
  type BookLocale,
  type BookTranslation,
  type LocalizedBook,
} from "./i18n";

/**
 * 옮긴 책 목록 (docs/book-i18n.md).
 *
 * 지금은 『이재명 자서전』 1장의 일본어·영어뿐이다. 새 언어나 새 장은
 * 그 책 폴더의 `i18n/`에 더하고 여기에 등록한다.
 */
const RAW: BookTranslation[] = [AUTOBIOGRAPHY_JA, AUTOBIOGRAPHY_EN];

interface Built {
  localized: LocalizedBook;
  errors: string[];
}

const BUILT: Built[] = RAW.map((raw) => {
  const tr = bookTranslationSchema.parse(raw);
  const original = getBook(tr.bookSlug);
  if (!original) throw new Error(`번역의 원본 책이 없다: ${tr.bookSlug}`);
  const { localized, errors } = localizeBook(original, tr);
  return { localized, errors: [...errors, ...validateLocalized(localized)] };
});

/** 검사용. 맞지 않는 장과 그 이유. scripts/validate-content.ts가 본다. */
export function translationReport(): { locale: BookLocale; slug: string; errors: string[]; localized: LocalizedBook }[] {
  return BUILT.map(({ localized, errors }) => ({
    locale: localized.locale,
    slug: localized.original.slug,
    errors,
    localized,
  }));
}

export function getLocalizedBook(locale: BookLocale, slug: string): LocalizedBook | undefined {
  return BUILT.find((b) => b.localized.locale === locale && b.localized.original.slug === slug)?.localized;
}

export function getLocalizedChapter(locale: BookLocale, slug: string, chapterSlug: string) {
  const localized = getLocalizedBook(locale, slug);
  const chapter = localized?.book.chapters.find((c) => c.slug === chapterSlug);
  if (!localized || !chapter) return undefined;
  return { localized, chapter, info: localized.info[chapter.id] };
}

/** 이 장을 옮긴 언어들. 한국어 장 페이지의 언어 링크와 hreflang이 쓴다. */
export function chapterLocales(slug: string, chapterSlug: string): BookLocale[] {
  return BOOK_LOCALES.filter((locale) => Boolean(getLocalizedChapter(locale, slug, chapterSlug)));
}

/** 옮긴 장 전부. 정적 경로와 사이트맵이 쓴다. */
export function translatedChapters(): { locale: BookLocale; slug: string; chapter: string }[] {
  return BUILT.flatMap(({ localized }) =>
    localized.book.chapters.map((c) => ({
      locale: localized.locale,
      slug: localized.original.slug,
      chapter: c.slug,
    })),
  );
}

/** 한 장이라도 옮긴 책. 옮긴 책 목차의 정적 경로가 쓴다. */
export function translatedBooks(): { locale: BookLocale; slug: string }[] {
  return BUILT.filter(({ localized }) => localized.book.chapters.length > 0).map(({ localized }) => ({
    locale: localized.locale,
    slug: localized.original.slug,
  }));
}

/** 옮긴 장의 주소. */
export function localizedChapterPath(locale: BookLocale, slug: string, chapterSlug: string): string {
  return `/${locale}/books/${slug}/${chapterSlug}`;
}

/**
 * 한 장의 언어별 주소(hreflang). 옮긴 언어가 없으면 비어 있다 — 그때는 hreflang을 내지 않는다.
 * x-default는 원본(한국어)이다.
 */
export function chapterLanguages(slug: string, chapterSlug: string): Record<string, string> {
  const locales = chapterLocales(slug, chapterSlug);
  if (locales.length === 0) return {};
  const ko = `/books/${slug}/${chapterSlug}`;
  return {
    ko,
    ...Object.fromEntries(locales.map((l) => [l, localizedChapterPath(l, slug, chapterSlug)])),
    "x-default": ko,
  };
}
