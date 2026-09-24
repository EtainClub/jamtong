import { ImageResponse } from "next/og";

import { STATEMENTS, getStatement } from "@/content/words";
import { KIND_LABEL } from "@/content/words/schema";
import { C, OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";

export const alt = "잼통 언행 공유 카드";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * 언행 공유 카드.
 *
 * 지금까지 언행은 카드가 없어 사이트 대표 카드가 대신 나갔다. 어느 글을
 * 보냈는지가 링크에 보이지 않았다는 뜻이다.
 *
 * ★ 카드에 싣는 한 대목은 **원문 그대로**여야 한다.
 *   요약문을 크게 걸면 카드를 본 사람은 그것을 본인의 말로 읽는다. 쉽게
 *   보기의 첫 토막이 옮겨 온 자리(`quote`)를 쓴다 — 그 문자열은 본문에
 *   그대로 있다는 것이 콘텐츠 검증에서 이미 보장된다. 쉽게 보기가 없는
 *   짧은 글은 본문 첫머리를 그대로 쓴다.
 */
export function generateStaticParams() {
  return STATEMENTS.map((statement) => ({ slug: statement.slug }));
}

/** 카드에 들어갈 만큼만. 문장 중간에서 끊기면 …를 붙인다. */
function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const stop = Math.max(cut.lastIndexOf("다."), cut.lastIndexOf("요."), cut.lastIndexOf("."));
  return stop > max * 0.5 ? cut.slice(0, stop + 1) : cut.trimEnd() + "…";
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const statement = getStatement(slug);
  const mark = await dataUri("public/images/jamtong-icon-192.png");

  if (!statement) {
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

  const excerpt = clip(
    statement.easy?.points[0]?.quote ??
      statement.body ??
      "영상 기반 항목입니다. 연설 전문은 영상 자료에서 확인할 수 있습니다.",
    120,
  );

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
              {KIND_LABEL[statement.kind]}
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.smoke }}>
              {statement.displayDate}
            </div>
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: statement.title.length > 18 ? 52 : 64,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: C.ink,
            }}
          >
            {clip(statement.title, 42)}
          </div>

          {/*
           * 왼쪽 선 하나로 인용임을 보인다. 따옴표를 쓰면 satori에서 글자
           * 크기에 따라 자리가 흔들린다.
           */}
          <div
            style={{
              display: "flex",
              marginTop: 36,
              paddingLeft: 26,
              borderLeft: `3px solid ${C.stone}`,
              maxWidth: 1000,
              fontSize: 30,
              fontWeight: 300,
              lineHeight: 1.45,
              color: C.graphite,
            }}
          >
            {excerpt}
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
            <img src={mark} alt="" width={56} height={56} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: C.ink }}>잼통</div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.ash }}>
              대통령의 언행
            </div>
          </div>
          {/* 어디서 나온 말인지. 카드에서도 출처가 먼저다. */}
          <div style={{ display: "flex", fontSize: 24, fontWeight: 300, color: C.graphite }}>
            {clip(statement.channel, 30)}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
}
