import { getMapBackground } from "@/lib/geo/land";
import { buildTrack } from "@/lib/geo/route-track";
import type { Route } from "@/content/schema";

/**
 * 히어로 카드 배경.
 *
 * 사진이 없으므로 스토리가 실제로 쓰는 비주얼을 그대로 쓴다. 북극항로 카드의
 * 배경은 그 스토리의 지도다 — 장식용 이미지가 아니라 안에서 만나게 될 화면이다.
 * 전부 서버에서 그리므로 클라이언트 비용이 0이다.
 */

export function ArcticHeroVisual({ routes }: { routes: Route[] }) {
  const background = getMapBackground();
  const tracks = routes.map(buildTrack);
  const active = tracks.find((t) => !t.isBaseline) ?? tracks[0];
  const baseline = tracks.find((t) => t.isBaseline);

  return (
    <div className="h-full w-full overflow-hidden">
      {/*
       * 항로가 지나는 구간만 잘라낸다. 지도 전체를 넣으면 카드 안에서
       * 북극이 점만 해지고, 이 카드가 말하려는 "가까워진다"가 보이지 않는다.
       */}
      <svg
        viewBox="230 200 340 430"
        className="h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="hero-ocean" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#12314e" />
            <stop offset="100%" stopColor="#081426" />
          </radialGradient>
        </defs>
        <circle cx="380" cy="380" r="372" fill="url(#hero-ocean)" />
        <path d={background.graticule} fill="none" stroke="rgba(233,238,246,0.06)" strokeWidth={0.6} />
        <path d={background.land} fill="#1c2c46" stroke="rgba(233,238,246,0.12)" strokeWidth={0.5} />
        <path
          d={background.arcticCircle}
          fill="none"
          stroke="var(--ice-600)"
          strokeWidth={1}
          strokeDasharray="4 5"
          opacity={0.6}
        />
        {baseline && (
          <path
            d={baseline.pathD}
            fill="none"
            stroke="var(--warm-500)"
            strokeWidth={2}
            strokeDasharray="6 6"
            opacity={0.45}
          />
        )}
        <path d={active.pathD} fill="none" stroke="var(--ice-400)" strokeWidth={9} opacity={0.12} />
        <path
          d={active.pathD}
          fill="none"
          stroke="var(--ice-400)"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** 숫자가 주인공인 카드. 큰 수치 하나를 배경으로 깐다. */
export function NumberHeroVisual({
  value,
  tone = "ice",
}: {
  value: string;
  tone?: "ice" | "warm" | "deep";
}) {
  const palette = {
    ice: { from: "#10314c", to: "#07182a", ink: "#5cc8ec" },
    warm: { from: "#33280f", to: "#171008", ink: "#e6b25a" },
    deep: { from: "#1a2148", to: "#090d1e", ink: "#8aa2f0" },
  }[tone];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `linear-gradient(150deg, ${palette.from}, ${palette.to})` }}
    >
      <span
        aria-hidden="true"
        className="absolute -right-3 top-4 select-none text-[86px] font-black leading-none tracking-tighter"
        style={{ color: palette.ink, opacity: 0.16 }}
      >
        {value}
      </span>
      <span
        aria-hidden="true"
        className="absolute -left-16 -top-16 h-56 w-56 rounded-full blur-3xl"
        style={{ background: palette.ink, opacity: 0.14 }}
      />
    </div>
  );
}
