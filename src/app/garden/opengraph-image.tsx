import { ImageResponse } from "next/og";

import { buildCatalog } from "@/features/garden/catalog";
import { OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";
import { GARDEN_FRUIT, GARDEN_OG as G } from "@/lib/og/garden-state";

export const alt = "잼통 정원 — 씨앗을 심고 키워 잼을 만드는 정원";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * 정원 첫 카드 — /garden 링크를 붙였을 때 뜨는 그림.
 *
 * 이 파일이 없으면 사이트 첫 카드(app/opengraph-image)를 물려받아, 정원 링크에
 * 잼통 위키 소개가 붙는다. 친구 정원 링크(/g/<공개id>)는 자랑 카드를 따로 건다.
 * 품종 수는 빌드 때 품종표에서 읽는다 — 손으로 적으면 콘텐츠를 더한 날부터 틀린다.
 */
export default async function Image() {
  const mark = await dataUri("public/images/jamtong-icon-192.png");
  const total = buildCatalog().length;
  const fruits = ["sprout", "common", "flagship", "perennial", "common", "flagship"];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: G.sky, fontFamily: "Pretendard" }}>
        <div style={{ display: "flex", flexDirection: "column", padding: "56px 72px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={mark} width={44} height={44} alt="" style={{ borderRadius: 12 }} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: G.muted }}>JAMTONG GARDEN</div>
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 76, fontWeight: 600, color: G.ink, letterSpacing: "-0.03em" }}>
            잼통 정원
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 32, fontWeight: 300, color: G.muted }}>
            씨앗을 심고, 키우고, 거둬서 잼을 만들어요
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "flex-end", marginTop: 24 }}>
          <div style={{ display: "flex", width: "100%", height: 230, background: G.grass, alignItems: "center", padding: "0 72px", gap: 28 }}>
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
              {fruits.map((tier, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      width: i % 2 ? 44 : 58,
                      height: i % 2 ? 44 : 58,
                      borderRadius: 999,
                      background: GARDEN_FRUIT[tier],
                      border: `4px solid ${G.cream}`,
                    }}
                  />
                  <div style={{ display: "flex", width: 6, height: 26, background: G.leaf }} />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["품종", `${total}`],
                ["열매마다", "근거 쪽지"],
                ["함께", "광장 · 꽃밭"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 24,
                    minWidth: 270,
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
    { ...OG_SIZE, fonts: ogFonts },
  );
}
