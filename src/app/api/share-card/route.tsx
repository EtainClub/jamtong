import { ImageResponse } from "next/og";

import { ASSERTION_LABEL } from "@/content/labels";
import { C, OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";
import { resolveShare } from "@/lib/og/share-state";

/**
 * 공유된 화면의 카드.
 *
 * 업적 페이지의 `opengraph-image.tsx`는 `params`만 받는다(Next 16). 공유
 * 링크가 담고 있는 것은 쿼리이므로, 상태를 비추려면 쿼리를 읽을 수 있는
 * 자리가 따로 있어야 한다. 그 자리가 여기다 — `/s/[slug]`가 이 주소를
 * og:image로 건다.
 *
 * ★ 쿼리에서 받는 것은 id뿐이다. 글자는 전부 저장소에서 온다.
 *   (`resolveShare`가 그것을 지킨다. 우리 도메인에서 아무 말이나 박힌
 *   카드가 만들어지면 안 된다.)
 *
 * 요청마다 그린다. 카드를 읽는 것은 사람이 아니라 크롤러이고, 크롤러는 한
 * 주소를 한 번 가져가 자기 쪽에 캐시한다. 그래도 같은 링크가 여러 번
 * 붙을 수 있으니 오래 캐시하라고 붙여 둔다.
 */
export const dynamic = "force-dynamic";

function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : flat.slice(0, max).trimEnd() + "…";
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const state = resolveShare(query.get("slug") ?? "", query);
  const mark = await dataUri("public/images/jamtong-icon-192.png");

  if (!state) return new Response("없는 업적입니다.", { status: 404 });

  const { achievement, moment, claim, sceneLabel } = state;

  /* 무엇을 보고 있었는지. 근거 > 시점 > 장면 순으로 구체적이다. */
  const focusKind = claim
    ? `근거 · ${ASSERTION_LABEL[claim.assertionType]}`
    : moment
      ? `시점 · ${moment.displayDate ?? moment.date}`
      : sceneLabel
        ? `화면 · ${sceneLabel}`
        : null;
  const focusText = claim
    ? claim.text
    : moment
      ? `${moment.title} — ${moment.summary}`
      : null;

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
              {achievement.kicker}
            </div>
            {focusKind && (
              <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.smoke }}>
                {focusKind}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: achievement.title.length > 14 ? 52 : 64,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: C.ink,
            }}
          >
            {achievement.title}
          </div>

          {focusText ? (
            <div
              style={{
                display: "flex",
                marginTop: 34,
                paddingLeft: 26,
                borderLeft: `3px solid ${claim ? C.burgundy : C.navy}`,
                maxWidth: 1000,
                fontSize: 32,
                fontWeight: 300,
                lineHeight: 1.4,
                color: C.graphite,
              }}
            >
              {clip(focusText, 150)}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                maxWidth: 940,
                fontSize: 30,
                fontWeight: 300,
                lineHeight: 1.35,
                color: C.smoke,
              }}
            >
              {clip(achievement.subtitle, 100)}
            </div>
          )}

          {/* 주장이면 누구의 주장인지. 검증 전이면 그것도 카드에 적는다. */}
          {claim && (claim.assertedBy || !claim.verified) && (
            <div style={{ display: "flex", gap: 16, marginTop: 24, paddingLeft: 29 }}>
              {claim.assertedBy && (
                <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.ash }}>
                  {clip(claim.assertedBy, 40)}
                </div>
              )}
              {!claim.verified && (
                <div
                  style={{
                    display: "flex",
                    padding: "4px 14px",
                    borderRadius: 999,
                    background: C.pendingTint,
                    color: C.pending,
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  검증 전
                </div>
              )}
            </div>
          )}
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
            {/* satori는 next/image를 모른다. 이 트리는 브라우저가 아니라 PNG로 간다. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} alt="" width={56} height={56} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: C.ink }}>잼통</div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.ash }}>
              이재명 업적 위키
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.graphite }}>
            {claim
              ? `자료 ${claim.sourceIds.length}건`
              : `근거 ${achievement.claims.length}건 · 자료 ${achievement.sources.length}건`}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: ogFonts,
      headers: {
        "content-type": OG_CONTENT_TYPE,
        "cache-control": "public, max-age=86400, s-maxage=86400, immutable",
      },
    },
  );
}
