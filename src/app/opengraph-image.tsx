import { ImageResponse } from "next/og";

import { ACHIEVEMENTS } from "@/content/achievements";
import { BOOKS } from "@/content/books";
import { CARTELS } from "@/content/cartels";
import { PLEDGES, totalCount } from "@/content/pledges";
import { POLICIES } from "@/content/policies";
import { STATEMENTS } from "@/content/words";
import { C, OG_CONTENT_TYPE, OG_SIZE, dataUri, ogFonts } from "@/lib/og/card";

export const alt = "이재명 업적 위키 잼통 — 업적·언행·저서·공약·카르텔·정책을 한곳에, 모든 문장에 출처";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * 사이트 첫 공유 카드.
 *
 * 로고와 한 줄만 있던 카드는 링크를 받은 사람에게 "무엇이 있는 곳인지"를
 * 말하지 못했다. 이 사이트에 실제로 있는 칸을 늘어놓고, 칸마다 지금 실린
 * 수를 적는다. 수는 빌드 때 콘텐츠에서 읽는다 — 손으로 적으면 다음 업적을
 * 더하는 날부터 카드가 거짓말을 한다.
 */
export default async function Image() {
  const logo = await dataUri("public/images/jamtong-logo-transparent.png");
  const pledgeLines = totalCount().total;

  const tiles: { label: string; value: string; note: string }[] = [
    { label: "업적", value: `${ACHIEVEMENTS.length}건`, note: "무엇이 됐고 무엇이 아직인지" },
    { label: "언행", value: `${STATEMENTS.length}편`, note: "본인의 말, 원문 그대로" },
    { label: "저서", value: `${BOOKS.length}권`, note: "자서전과 책을 장면으로" },
    { label: "대선 공약", value: `${PLEDGES.length}대`, note: `세부 약속 ${pledgeLines}개 이행 추적` },
    { label: "카르텔", value: `${CARTELS.length}표적`, note: "조치마다 진행 정도" },
    { label: "정책 팩트", value: `${POLICIES.length}건`, note: "도는 주장과 사실관계" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.eggshell,
          fontFamily: "Pretendard",
          padding: "56px 60px",
        }}
      >
        {/* 왼쪽 — 무엇인 곳인지 */}
        <div
          style={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <img src={logo} alt="" width={220} height={160} />
            <div
              style={{
                marginTop: 28,
                fontSize: 54,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: C.ink,
              }}
            >
              이재명 업적 위키
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 27,
                fontWeight: 300,
                lineHeight: 1.45,
                letterSpacing: "-0.02em",
                color: C.graphite,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>이재명에 관한 기록을 한곳에.</span>
              <span>모든 문장에 출처를 답니다.</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* 색은 자료에만 쓴다. 두 줄이 이 카드의 표지다. */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 120, height: 7, borderRadius: 4, background: C.navy }} />
              <div style={{ width: 64, height: 7, borderRadius: 4, background: C.burgundy }} />
            </div>
            <div style={{ marginTop: 16, fontSize: 26, fontWeight: 600, color: C.smoke }}>
              jamtong.kr
            </div>
          </div>
        </div>

        {/* 오른쪽 — 실제로 있는 칸과 지금 실린 수 */}
        <div
          style={{
            flex: 1,
            marginLeft: 44,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {[0, 2, 4].map((row) => (
            <div key={row} style={{ display: "flex", gap: 16 }}>
              {tiles.slice(row, row + 2).map((tile) => (
                <div
                  key={tile.label}
                  style={{
                    flex: 1,
                    height: 152,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    borderRadius: 22,
                    background: C.taupe,
                    border: `2px solid ${C.stone}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{tile.label}</span>
                    <span style={{ fontSize: 36, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em" }}>
                      {tile.value}
                    </span>
                  </div>
                  <span style={{ fontSize: 21, fontWeight: 300, color: C.smoke, letterSpacing: "-0.01em" }}>
                    {tile.note}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
}
