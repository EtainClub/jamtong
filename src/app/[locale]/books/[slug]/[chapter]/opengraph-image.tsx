import { ImageResponse } from "next/og";

import { isBookLocale } from "@/content/books/i18n";
import { getLocalizedChapter, translatedChapters } from "@/content/books/translations";
import { BOOK_UI } from "@/features/books/ui";
import { C, OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts, ogFontsJa } from "@/lib/og/card";

export const alt = "Jamtong";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamicParams = false;

/*
 * 이미지 라우트는 부모 세그먼트([locale] 레이아웃)의 params를 받지 못한다 — 받는다고 여기고 locale로 거르면
 * 빈 목록이 되어 dynamicParams=false 아래서 모든 카드가 404였다(dev 서버에서는 드러나지 않았다).
 * 그래서 locale까지 통째로 낸다. 한국어 카드(books/[slug]/[chapter]/opengraph-image)도 같은 방식이다.
 */
export function generateStaticParams() {
  return translatedChapters().map(({ locale, slug, chapter }) => ({ locale, slug, chapter }));
}

function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : flat.slice(0, max).trimEnd() + "…";
}

/**
 * 옮긴 장의 공유 카드. 한국어 카드(`/books/[slug]/[chapter]/opengraph-image`)와 같은 틀이다.
 *
 * 한국어 카드는 첫 할 일을 건다. 여기서는 걸지 않는다 — 할 일은 한국에 사는 사람을 위한 것이라
 * 이 카드를 받는 사람에게는 맞지 않는다. 대신 번역이라는 밝힘을 바닥줄에 둔다.
 * 일본어는 글자 수당 폭이 넓어 자르는 길이를 줄인다.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string; chapter: string }>;
}) {
  const { locale, slug, chapter } = await params;
  const found = isBookLocale(locale) ? getLocalizedChapter(locale, slug, chapter) : undefined;
  const mark = await dataUri("public/images/jamtong-icon-192.png");
  const ja = locale === "ja";
  const fonts = ja ? await ogFontsJa() : ogFonts;
  const family = ja ? "Noto Sans JP" : "Pretendard";

  if (!found || !isBookLocale(locale)) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: C.eggshell,
            color: C.ink,
            fontFamily: family,
            fontSize: 48,
            fontWeight: 300,
          }}
        >
          Jamtong
        </div>
      ),
      { ...size, fonts },
    );
  }

  const { localized, chapter: ch } = found;
  const t = BOOK_UI[locale];
  const tail = ja ? "韓国語の要約からの翻訳" : "Translated from our Korean summary";
  const titleMax = ja ? 30 : 60;
  const summaryMax = ja ? 70 : 140;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: C.eggshell,
          padding: "64px 72px",
          fontFamily: family,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 999,
                background: C.ink,
                color: C.eggshell,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {t.chapterN(ch.order)}
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.smoke }}>
              {clip(localized.book.title, 40)}
            </div>
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: ch.title.length > (ja ? 16 : 30) ? 52 : 64,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: C.ink,
            }}
          >
            {clip(ch.title, titleMax)}
          </div>
          <div
            style={{
              marginTop: 24,
              maxWidth: 980,
              fontSize: 30,
              fontWeight: 300,
              lineHeight: 1.45,
              color: C.smoke,
            }}
          >
            {clip(ch.summary, summaryMax)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: `1px solid ${C.stone}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={mark} alt="" width={56} height={56} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: C.ink }}>Jamtong</div>
          </div>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 300, color: C.graphite }}>
            {tail} · {t.minutes(ch.minutes)}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
