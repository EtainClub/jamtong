import { ImageResponse } from "next/og";

import { C, OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";

export const alt = "잼통 — 읽는 위키가 아니라 이해하는 위키";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const logo = await dataUri("public/images/jamtong-logo-transparent.png");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: C.eggshell,
          fontFamily: "Pretendard",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={420} height={306} />
        <div
          style={{
            marginTop: 28,
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: C.ink,
          }}
        >
          읽는 위키가 아니라 이해하는 위키
        </div>
        {/* 색은 자료에만 쓴다. 여기 두 줄이 이 카드에서 유일한 색이다. */}
        <div style={{ display: "flex", gap: 10, marginTop: 40 }}>
          <div style={{ width: 180, height: 8, borderRadius: 4, background: C.navy }} />
          <div style={{ width: 96, height: 8, borderRadius: 4, background: C.burgundy }} />
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
}
