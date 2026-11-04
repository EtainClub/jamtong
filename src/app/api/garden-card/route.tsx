import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";
import { loadGardenCard } from "@/lib/og/garden-state";

/**
 * 정원 자랑 카드 — /g/[gid]가 og:image로 건다 (docs/garden-game.md §3.10).
 *
 * ★ 쿼리에서 받는 것은 공개 id뿐이다. 글자는 품종표와 숫자에서만 온다.
 *   정원 이름(사람이 지은 글)은 싣지 않는다(lib/og/garden-state.ts).
 *
 * 그림은 이모지 없이 도형으로 그린다. satori가 이모지를 그리려면 바깥에서 글꼴을
 * 받아 와야 하는데, 카드 한 장을 위해 바깥에 기대지 않는다.
 */
export const dynamic = "force-dynamic";

const G = {
  sky: "#d9eedf",
  grass: "#a9cf7f",
  soil: "#8b6a4a",
  soilDark: "#6f5238",
  leaf: "#3f8a3a",
  ink: "#21401f",
  muted: "#4f6b4a",
  jam: "#c2410c",
  cream: "#fdf8ea",
};

/** 등급마다 열매 색. 정원 화면의 열매 모양과 같은 계열. */
const FRUIT: Record<string, string> = {
  sprout: "#6d5bd0",
  common: "#e0573a",
  flagship: "#e9a23b",
  perennial: "#3f8a3a",
};

function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : flat.slice(0, max).trimEnd() + "…";
}

export async function GET(request: Request) {
  const gid = new URL(request.url).searchParams.get("gid") ?? "";
  const card = await loadGardenCard(gid);
  if (!card) return new Response("없거나 공개를 끈 정원입니다.", { status: 404 });
  const mark = await dataUri("public/images/jamtong-icon-192.png");

  const beds = card.growing.slice(0, 6);
  const names = [...new Set(beds.map((b) => b.species.title))].slice(0, 2);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: G.sky,
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", padding: "56px 72px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} width={44} height={44} alt="" style={{ borderRadius: 12 }} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: G.muted }}>JAMTONG GARDEN</div>
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 64, fontWeight: 600, color: G.ink, letterSpacing: "-0.03em" }}>
            친구가 정원에 초대했어요
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 30, fontWeight: 300, color: G.muted }}>
            {names.length ? clip(`지금 키우는 것 · ${names.join(" · ")}`, 48) : "물을 주면 친구 정원도, 내 정원도 빨리 자라요"}
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "flex-end", marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 230,
              background: G.grass,
              alignItems: "center",
              padding: "0 72px",
              gap: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                height: 120,
                borderRadius: 60,
                background: `linear-gradient(180deg, ${G.soil}, ${G.soilDark})`,
                alignItems: "center",
                justifyContent: "space-around",
                padding: "0 24px",
              }}
            >
              {(beds.length ? beds : [null, null, null]).map((b, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      width: b?.ripe ? 58 : 40,
                      height: b?.ripe ? 58 : 40,
                      borderRadius: 999,
                      background: b ? FRUIT[b.species.tier] ?? G.jam : "#00000022",
                      border: `4px solid ${G.cream}`,
                    }}
                  />
                  <div style={{ display: "flex", width: 6, height: 26, background: G.leaf }} />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                [`도감`, `${card.dex}/${card.total}`],
                [`황금 변이`, `${card.golden}`],
                [`무지개 변이`, `${card.rainbow}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 24,
                    minWidth: 250,
                    padding: "8px 18px",
                    borderRadius: 16,
                    background: G.cream,
                    fontSize: 24,
                    color: G.ink,
                  }}
                >
                  <span style={{ fontWeight: 300 }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: ogFonts,
      // 정원은 자라므로 오래 두지 않는다. 같은 링크가 여러 번 붙는 동안만 버틴다.
      headers: { "content-type": OG_CONTENT_TYPE, "cache-control": "public, max-age=600, s-maxage=600" },
    },
  );
}
