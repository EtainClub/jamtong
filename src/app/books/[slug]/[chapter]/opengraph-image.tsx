import { ImageResponse } from "next/og";

import { BOOKS, getChapter } from "@/content/books";
import { HORIZON_LABEL } from "@/content/books/schema";
import { C, OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";

export const alt = "잼통 자서전 공유 카드";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * 장 하나의 공유 카드.
 *
 * ★ 카드에도 할 일을 싣는다.
 *   이 섹션의 핵심은 "읽고 끝나지 않는 것"이다. 카드에 제목과 요약만 넣으면
 *   링크를 본 사람에게는 독후감으로 보인다. 첫 행동 하나를 함께 걸어, 열기
 *   전에 이미 무엇을 하자는 글인지 알게 한다.
 */
export function generateStaticParams() {
  return BOOKS.flatMap((book) =>
    book.chapters.map((chapter) => ({ slug: book.slug, chapter: chapter.slug })),
  );
}

function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : flat.slice(0, max).trimEnd() + "…";
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = await params;
  const found = getChapter(slug, chapter);
  const mark = await dataUri("public/images/jamtong-icon-192.png");

  if (!found) {
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

  const { book, chapter: ch } = found;
  /* 오늘 할 수 있는 것을 먼저 건다. 없으면 목록의 첫 행동. */
  const action = ch.actions.find((a) => a.horizon === "today") ?? ch.actions[0];

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
              {ch.order}장
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.smoke }}>
              {clip(book.title, 28)}
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
              fontSize: ch.title.length > 18 ? 52 : 64,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: C.ink,
            }}
          >
            {clip(ch.title, 42)}
          </div>
          <div
            style={{
              marginTop: 20,
              maxWidth: 940,
              fontSize: 28,
              fontWeight: 300,
              lineHeight: 1.4,
              color: C.smoke,
            }}
          >
            {clip(ch.summary, 100)}
          </div>
        </div>

        {action && (
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
              {HORIZON_LABEL[action.horizon]} 할 일
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
              {clip(action.title, 46)}
            </div>
          </div>
        )}

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
            할 일 {ch.actions.length}가지 · {ch.minutes}분
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
}
