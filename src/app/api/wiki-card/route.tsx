import { ImageResponse } from "next/og";

import { C, OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";
import { getPage, pageSummary } from "@/lib/wiki/load";

/**
 * 위키 한 장의 공유 카드.
 *
 * 위키는 채팅으로 건네지는 일이 많은데 지금까지 사이트 대표 카드가 나갔다.
 * 어느 페이지를 보냈는지가 링크에 보이지 않았다는 뜻이다.
 *
 * ★ 왜 `opengraph-image.tsx`가 아닌가.
 *   위키 주소는 `/wiki/[...slug]`다. Next는 catch-all 아래에 메타데이터
 *   이미지 라우트를 두지 못한다("Catch-all must be the last part of the
 *   URL"). 그래서 공유 카드와 같은 방식으로, 쿼리를 받는 라우트를 둔다.
 *
 * ★ 쿼리로 받는 것은 페이지 이름뿐이다.
 *   그 이름으로 저장소에서 찾은 글만 그린다. 찾지 못하면 404다 — 우리
 *   도메인에서 아무 말이나 박힌 카드가 만들어지면 안 된다.
 *
 * ★ 카드에 "앵커가 붙어 있다"를 적는다.
 *   이 위키를 다른 위키와 가르는 것이 그것이다. 카드를 본 사람이 열기 전에
 *   알아야 할 한 가지가 있다면 그것이다.
 */
export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  source: "소스",
  concept: "개념",
  entity: "인물·기관",
  event: "사건",
  synthesis: "종합",
  meta: "기록",
};

export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get("name") ?? "";
  const page = getPage(name);
  if (!page || page.name === "log") return new Response("없는 페이지입니다.", { status: 404 });

  const mark = await dataUri("public/images/jamtong-icon-192.png");

  const summary = pageSummary(page, 150);

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
              위키 · {KIND_LABEL[page.kind] ?? page.kind}
            </div>
            {page.updated && (
              <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.smoke }}>
                갱신 {page.updated}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: page.title.length > 16 ? 54 : 66,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: C.ink,
            }}
          >
            {page.title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 980,
              fontSize: 29,
              fontWeight: 300,
              lineHeight: 1.45,
              color: C.smoke,
            }}
          >
            {summary}
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
            {/* satori는 next/image를 모른다. 이 트리는 브라우저가 아니라 PNG로 간다. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} alt="" width={56} height={56} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: C.ink }}>잼통</div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.ash }}>
              이재명 업적 위키
            </div>
          </div>
          {/* 이 위키를 다른 위키와 가르는 한 가지. */}
          <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.graphite }}>
            모든 단정문에 원자료 앵커
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
