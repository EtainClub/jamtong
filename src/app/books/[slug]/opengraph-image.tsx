import { ImageResponse } from "next/og";

import { BOOKS, getBook } from "@/content/books";
import { C, OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";

export const alt = "잼통 자서전 공유 카드";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * 책 한 권의 공유 카드.
 *
 * 장 카드가 이미 있는데 책 카드를 따로 두는 이유는 하나다. 책 주소를 건네면
 * 지금까지는 사이트 기본 카드가 떴고, 그러면 받은 사람은 무엇을 여는지 모른 채
 * 링크를 누른다. 여기서 밝히는 것은 **무슨 책이고 몇 장이 준비돼 있는가**다.
 *
 * 장 카드와 달리 할 일 하나를 앞에 걸지 않는다. 책에는 고를 장이 스물둘이고,
 * 그중 하나의 할 일을 대표로 세우면 나머지를 가린다. 대신 수를 적는다.
 */
export function generateStaticParams() {
  return BOOKS.map((book) => ({ slug: book.slug }));
}

function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : flat.slice(0, max).trimEnd() + "…";
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug);
  const mark = await dataUri("public/images/jamtong-icon-192.png");

  if (!book) {
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
            fontFamily: "Pretendard",
            fontSize: 48,
            fontWeight: 300,
          }}
        >
          잼통
        </div>
      ),
      { ...size, fonts: ogFonts },
    );
  }

  const actions = book.chapters.reduce((n, c) => n + c.actions.length, 0);

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
          fontFamily: "Pretendard",
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
              자서전
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.smoke }}>
              {book.publisher} · {book.year}
            </div>
            {book.sample && (
              <div
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: C.pendingTint,
                  color: C.pending,
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                샘플
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: book.title.length > 18 ? 52 : 64,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: C.ink,
            }}
          >
            {clip(book.title, 42)}
          </div>
          {book.subtitle && (
            <div
              style={{
                display: "flex",
                marginTop: 20,
                maxWidth: 940,
                fontSize: 28,
                fontWeight: 300,
                lineHeight: 1.4,
                color: C.smoke,
              }}
            >
              {clip(book.subtitle, 100)}
            </div>
          )}
        </div>

        {/*
         * 아직 옮기지 않은 책은 그렇게 적는다. 카드에서 갖춰진 것처럼 보이고
         * 열었더니 서지 정보 한 줄이면, 그 한 번으로 나머지를 의심하게 된다.
         */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "24px 28px",
            borderRadius: 20,
            background: C.taupe,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: C.navy }}>
            {book.chapters.length > 0 ? "옮긴 분량" : "준비 중"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 10,
              fontSize: 34,
              fontWeight: 300,
              lineHeight: 1.3,
              color: C.ink,
            }}
          >
            {book.chapters.length > 0
              ? `${book.chapters.length}장을 쉽게 보기로, 할 일 ${actions}가지와 함께`
              : "서지 정보만 있고 아직 장을 옮기지 않았습니다"}
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
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: C.ink }}>잼통</div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.ash }}>
              자서전
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.graphite }}>
            {book.source.verified ? "서지 정보 대조됨" : "서지 정보 대조 전"}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
}
