import Link from "next/link";

import { LOCALE_INFO, type ReadLocale } from "@/content/books/i18n";

/**
 * 이 장을 다른 언어로 — 한국어 장과 옮긴 장이 서로를 잇는다.
 *
 * 브라우저 언어로 저절로 넘기지 않는다. 같은 주소가 사람마다 달리 보이면 안 되고,
 * 링크를 보낸 사람이 본 화면을 받은 사람도 봐야 한다. 그래서 고르는 것은 읽는 사람이다.
 * 각 언어 이름은 그 언어로 적는다 — 한국어를 못 읽는 사람이 찾을 수 있어야 한다.
 */
export function LanguageLinks({
  current,
  links,
}: {
  current: ReadLocale;
  links: { locale: ReadLocale; href: string }[];
}) {
  if (links.length < 2) return null;

  return (
    <nav aria-label="Language" className="mt-3 flex flex-wrap items-center gap-1.5">
      {links.map(({ locale, href }) =>
        locale === current ? (
          <span
            key={locale}
            lang={locale}
            aria-current="page"
            className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-semibold text-eggshell"
          >
            {LOCALE_INFO[locale].label}
          </span>
        ) : (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            lang={locale}
            className="rounded-full border border-stone px-2.5 py-0.5 text-[11px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-ink"
          >
            {LOCALE_INFO[locale].label}
          </Link>
        ),
      )}
    </nav>
  );
}
