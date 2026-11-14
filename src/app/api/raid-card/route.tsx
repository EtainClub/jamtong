import { ImageResponse } from "next/og";

import { formatClock, formatLeft } from "@/features/garden/rules";
import { OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";
import { loadRaidCard, raidTitle, type RaidCard } from "@/lib/og/raid-state";

/**
 * 거대 잡초 카드 — /r/[rid]가 og:image로 건다.
 *
 * ★ 쿼리에서 받는 것은 물결 id뿐이다. 글자는 숫자와 정해 둔 말뿐이다.
 * ★ 물결이 없거나 읽지 못해도 404를 내지 않고 "같이 잡아요" 카드를 그린다 — 미리보기가 비면
 *   사이트 기본 카드보다 못하다.
 * 그림은 이모지 없이 도형으로 그린다(api/garden-card와 같은 까닭).
 */
export const dynamic = "force-dynamic";

const R = {
  bg: "#1f3a1c",
  bgLow: "#2d5226",
  blade: "#4f8f3c",
  bladeDark: "#3a6f2d",
  bladeLight: "#7fb85a",
  ink: "#f6f3df",
  muted: "#c9d8b4",
  bar: "#e9d24a",
  track: "#00000055",
  chip: "#ffffff1f",
};

/** 거대 잡초. 잎 일곱 장을 부채꼴로 세운다. */
function Weed() {
  const blades = [
    { x: 30, h: 210, r: -28, c: R.bladeDark },
    { x: 70, h: 260, r: -14, c: R.blade },
    { x: 112, h: 300, r: -4, c: R.bladeLight },
    { x: 150, h: 280, r: 8, c: R.blade },
    { x: 190, h: 240, r: 20, c: R.bladeDark },
    { x: 90, h: 190, r: -22, c: R.bladeLight },
    { x: 170, h: 200, r: 26, c: R.bladeLight },
  ];
  return (
    <div style={{ display: "flex", position: "relative", width: 280, height: 320 }}>
      {blades.map((b, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            position: "absolute",
            left: b.x,
            bottom: 0,
            width: 46,
            height: b.h,
            borderRadius: "50% 50% 12px 12px",
            background: b.c,
            transform: `rotate(${b.r}deg)`,
            transformOrigin: "bottom center",
          }}
        />
      ))}
    </div>
  );
}

function lines(card: RaidCard | null): { big: string; small: string; ratio: number } {
  if (!card) return { big: "혼자서는 못 잡아요", small: "여럿이 모여 쓰러뜨리고 희귀 씨앗을 받아요", ratio: 1 };
  if (card.phase === "defeated") return { big: `${card.fighters}명이 함께 쓰러뜨렸어요`, small: "다음 거대 잡초도 같이 잡아요", ratio: 0 };
  if (card.phase === "escaped") return { big: "놓쳤어요", small: `다음에는 ${card.need}명이 모여 잡아요`, ratio: card.left / card.hp };
  return {
    big: `체력 ${card.left} / ${card.hp}`,
    small: `함께 ${card.fighters}명 · ${card.gapAt !== null ? `빈틈 ${formatClock(card.gapAt, Date.now())}에 ${card.needLeast}명이면` : `${card.need}명이면`} 잡아요 · ${formatLeft(card.escapeIn)} 뒤 도망`,
    ratio: card.left / card.hp,
  };
}

export async function GET(request: Request) {
  const rid = new URL(request.url).searchParams.get("rid") ?? "";
  let card: RaidCard | null = null;
  try {
    card = await loadRaidCard(rid);
  } catch (error) {
    console.error("[raid-card] 거대 잡초를 읽지 못했다", error);
  }
  const mark = await dataUri("public/images/jamtong-icon-192.png");
  const { big, small, ratio } = lines(card);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: card ? `linear-gradient(180deg, ${card.kind.bg[0]}, ${card.kind.bg[1]})` : `linear-gradient(180deg, ${R.bg}, ${R.bgLow})`,
          fontFamily: "Pretendard",
          padding: "56px 64px",
          gap: 40,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} width={44} height={44} alt="" style={{ borderRadius: 12 }} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: R.muted }}>JAMTONG GARDEN · 광장</div>
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 52, fontWeight: 600, color: R.ink, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            {raidTitle(card)}
          </div>
          <div style={{ display: "flex", marginTop: 30, fontSize: 40, fontWeight: 600, color: R.bar }}>{big}</div>
          <div style={{ display: "flex", marginTop: 14, width: "100%", height: 26, borderRadius: 13, background: R.track }}>
            <div style={{ display: "flex", width: `${Math.round(ratio * 100)}%`, height: "100%", borderRadius: 13, background: R.bar }} />
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 28, fontWeight: 300, color: R.muted }}>{small}</div>
          <div style={{ display: "flex", marginTop: "auto" }}>
            <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: R.chip, fontSize: 26, fontWeight: 600, color: R.ink }}>
              쓰러뜨리면 모두에게 희귀 씨앗 상자·뿌리 조각
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <Weed />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: ogFonts,
      // 체력은 금방 바뀐다. 짧게만 둔다.
      headers: { "content-type": OG_CONTENT_TYPE, "cache-control": "public, max-age=60, s-maxage=60" },
    },
  );
}
