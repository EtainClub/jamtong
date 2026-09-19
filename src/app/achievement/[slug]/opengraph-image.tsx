import { ImageResponse } from "next/og";

import { getAchievement, ACHIEVEMENTS } from "@/content/achievements";
import { C, OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";

export const alt = "잼통 업적 공유 카드";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** 스토리는 빌드 때 다 안다. 카드도 그때 굽는다. */
export function generateStaticParams() {
  return ACHIEVEMENTS.map((achievement) => ({ slug: achievement.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const achievement = getAchievement(slug);
  const mark = await dataUri("public/images/jamtong-icon-192.png");

  if (!achievement) {
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

  const pending = achievement.claims.filter((c) => !c.verified).length;
  const isDraft = achievement.publishStatus === "draft";
  // 스크롤을 멈추게 하는 건 문장이 아니라 숫자다. 대표 수치 하나를 카드에 싣는다.
  const headline =
    achievement.keyNumbers.find((k) => k.id === achievement.headlineKeyNumberId) ?? achievement.keyNumbers[0];

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
            {/* 진행 상태와 분류는 무채색. 알약 모양은 '누를 수 있는 것'이 아니라 태그다. */}
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
            {/* 미검증이 0인데 "검증 전 0건"이라고 쓰면 거짓말이 된다. 초안은 초안이라고 쓴다. */}
            {isDraft && (
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
                {pending > 0 ? `검증 전 ${pending}건` : "초안"}
              </div>
            )}
          </div>

          {/* 굵게 키우지 않는다. 크기로 위계를 만든다. */}
          <div
            style={{
              marginTop: 34,
              fontSize: achievement.title.length > 14 ? 58 : 72,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: C.ink,
            }}
          >
            {achievement.title}
          </div>
          <div
            style={{
              marginTop: 22,
              maxWidth: 900,
              fontSize: 30,
              fontWeight: 300,
              lineHeight: 1.35,
              color: C.smoke,
            }}
          >
            {achievement.subtitle}
          </div>

          {headline && (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 48 }}>
              <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: C.smoke }}>
                {headline.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 10 }}>
                {headline.prefix && (
                  <div style={{ display: "flex", fontSize: 30, fontWeight: 300, color: C.ash }}>
                    {headline.prefix}
                  </div>
                )}
                {/* 수치는 ink다. navy는 그 수치가 지도나 차트의 주인공일 때만 쓴다. */}
                <div
                  style={{
                    display: "flex",
                    fontSize: 96,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    color: C.ink,
                  }}
                >
                  {headline.value}
                </div>
                {headline.unit && (
                  <div style={{ display: "flex", fontSize: 38, fontWeight: 300, color: C.smoke }}>
                    {headline.unit}
                  </div>
                )}
              </div>
              {headline.caption && (
                <div style={{ display: "flex", marginTop: 12, fontSize: 24, fontWeight: 300, color: C.ash }}>
                  {headline.caption}
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
                <img src={mark} alt="" width={56} height={56} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: C.ink }}>
              잼통
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.ash }}>
              이재명 업적 위키
            </div>
          </div>
          {/* 이 제품이 파는 것은 근거다. 카드에서도 그걸 먼저 보인다. */}
          <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.graphite }}>
            근거 {achievement.claims.length}건 · 자료 {achievement.sources.length}건
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
}
