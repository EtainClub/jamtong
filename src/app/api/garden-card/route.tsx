import { ImageResponse } from "next/og";
import { renderToStaticMarkup } from "react-dom/server.edge";

import { buildCatalog } from "@/features/garden/catalog";
import { RoomSvg, CELL, HEIGHT } from "@/features/garden/room/RoomSvg";
import { roomWidth } from "@/features/garden/room/rules";
import { OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";
import { GARDEN_OG as G, loadGardenCard } from "@/lib/og/garden-state";

/** The share card uses exactly the same room drawing as the visit view. */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const gid = new URL(request.url).searchParams.get("gid") ?? "";
  const card = await loadGardenCard(gid);
  if (!card) return new Response("없거나 공개를 끈 정원입니다.", { status: 404 });
  const mark = await dataUri("public/images/jamtong-icon-192.png");
  const byId = new Map(buildCatalog().map((s) => [s.id, s]));
  const svg = renderToStaticMarkup(<RoomSvg room={card.room} byId={byId} now={Date.now()} label="친구의 방" />);
  const image = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  const width = roomWidth(card.room.size) * CELL;
  const scale = Math.min(1056 / width, 410 / HEIGHT);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", background: G.cream, fontFamily: "Pretendard", padding: "28px 48px", gap: 18 }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} width={44} height={44} alt="" style={{ borderRadius: 12 }} />
        <div style={{ display: "flex", fontSize: 42, fontWeight: 600, color: G.ink }}>내 방과 정원 구경하세요</div>
      </div>
      <div style={{ display: "flex", flex: 1, width: "100%", alignItems: "center", justifyContent: "center", background: "#e7efdf", borderRadius: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} width={width * scale} height={HEIGHT * scale} alt="친구가 꾸민 방" />
      </div>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", fontSize: 24, color: G.muted }}>
        <span>JAMTONG GARDEN · 내 방 구경하기</span>
        <span>도감 {card.dex}/{card.total}</span>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: ogFonts,
      headers: { "content-type": OG_CONTENT_TYPE, "cache-control": "public, max-age=600, s-maxage=600" },
    },
  );
}
