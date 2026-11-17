import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";
import { loadBookCard } from "@/lib/og/book-state";

/**
 * 특별한 책의 장 카드 그림 — /bk/<책>/<장>이 og:image로 건다(lib/og/book-state.ts).
 * 책 색(실제 출판 표지가 아니라 잼통의 색 조합) 위에 장 제목과 쉽게 보기 토막 하나, "○○의 서재에서".
 */
export const runtime = "nodejs";

const clip = (text: string, n: number) => (text.length > n ? `${text.slice(0, n - 1)}…` : text);

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const card = await loadBookCard(q.get("b") ?? "", q.get("c") ?? "", q.get("g")).catch(() => null);
  const mark = await dataUri("public/images/jamtong-icon-192.png");
  const pal = card?.palette ?? { cover: "#264b42", paper: "#f8f0d6", ribbon: "#b75440" };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: pal.cover, fontFamily: "Pretendard", padding: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, borderRadius: 28, background: pal.paper, padding: "44px 52px", position: "relative" }}>
          <div style={{ display: "flex", position: "absolute", right: 60, top: 0, width: 34, height: 110, background: pal.ribbon }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} width={40} height={40} alt="" style={{ borderRadius: 10 }} />
            <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: "#5a4a3a" }}>
              {card ? `『${clip(card.bookTitle, 22)}』 ${card.order}장` : "잼통 · 자서전 요약"}
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 54, fontWeight: 600, color: "#1d1712", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            {card ? clip(card.title, 26) : "특별한 책"}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 28, fontWeight: 300, color: "#4a3f35", lineHeight: 1.45 }}>
            {card ? clip(card.summary, 70) : ""}
          </div>
          {card?.point && (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 26, padding: "18px 24px", borderRadius: 18, background: "#ffffffb0", borderLeft: `8px solid ${pal.ribbon}` }}>
              <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: "#1d1712" }}>{clip(card.point.title, 34)}</div>
              <div style={{ display: "flex", marginTop: 6, fontSize: 24, fontWeight: 300, color: "#4a3f35" }}>{clip(card.point.say, 64)}</div>
            </div>
          )}
          <div style={{ display: "flex", marginTop: "auto", fontSize: 24, fontWeight: 600, color: "#5a4a3a" }}>
            {card?.owner ? `${card.owner}의 서재에서 · 잼통이 장마다 다시 쓴 요약` : "잼통이 장마다 다시 쓴 요약"}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: ogFonts, headers: { "content-type": OG_CONTENT_TYPE, "cache-control": "public, max-age=3600, s-maxage=3600" } },
  );
}
