import { notFound } from "next/navigation";

import { BOOK_LOCALES, isBookLocale } from "@/content/books/i18n";

/**
 * 옮긴 자서전의 언어 갈래 — /ja/…, /en/… (docs/book-i18n.md §3).
 *
 * 사이트 전체를 옮기지 않으므로 루트 레이아웃(`<html lang="ko">`)은 그대로 두고,
 * 이 갈래 안의 화면만 그 언어로 표시한다. 글꼴 고르기(globals.css의 :lang)와 화면 낭독기는
 * 요소의 lang으로 충분히 맞는다. `display: contents`라 레이아웃에 상자가 하나 더 생기지 않는다.
 *
 * 정한 언어 밖의 값은 404다. 최상위의 다른 경로(/achievement, /g …)는 정적 세그먼트라
 * 이 동적 세그먼트보다 먼저 잡힌다.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return BOOK_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isBookLocale(locale)) notFound();

  return (
    <div lang={locale} className="contents">
      {children}
    </div>
  );
}
