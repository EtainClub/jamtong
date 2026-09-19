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
            <stop offset="0%" stopColor="var(--map-sea-top)" />
            <stop offset="100%" stopColor="var(--map-sea)" />
          </radialGradient>
        </defs>
        <circle cx="380" cy="380" r="372" fill="url(#hero-ocean)" />
        <path d={background.graticule} fill="none" stroke="var(--map-grid)" strokeWidth={0.6} />
        <path d={background.land} fill="var(--map-land)" stroke="var(--map-land-edge)" strokeWidth={0.5} />
        <path
          d={background.arcticCircle}
          fill="none"
          stroke="var(--navy-tint)"
          strokeWidth={1}
          strokeDasharray="4 5"
          opacity={0.6}
        />
        {baseline && (
          <path
            d={baseline.pathD}
            fill="none"
            stroke="var(--burgundy)"
            strokeWidth={2}
            strokeDasharray="6 6"
            opacity={0.45}
          />
        )}
        <path d={active.pathD} fill="none" stroke="var(--navy)" strokeWidth={9} opacity={0.12} />
        <path
          d={active.pathD}
          fill="none"
          stroke="var(--navy)"
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
    ice: { from: "var(--navy-tint)", to: "var(--eggshell)", ink: "var(--navy)" },
    warm: { from: "var(--burgundy-tint)", to: "var(--eggshell)", ink: "var(--burgundy)" },
    deep: { from: "var(--stone)", to: "var(--eggshell)", ink: "var(--graphite)" },
  }[tone];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `linear-gradient(150deg, ${palette.from}, ${palette.to})` }}
    >
      <span
        aria-hidden="true"
        className="absolute -right-3 top-4 select-none text-[86px] font-black leading-none tracking-tighter"
        style={{ color: palette.ink, opacity: 0.14 }}
      >
        {value}
      </span>
      <span
        aria-hidden="true"
        className="absolute -left-16 -top-16 h-56 w-56 rounded-full blur-3xl"
        style={{ background: palette.ink, opacity: 0.1 }}
      />
    </div>
  );
}
