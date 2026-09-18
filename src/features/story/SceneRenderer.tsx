import type { Claim, StoryScene } from "@/content/schema";
import { getMapBackground } from "@/lib/geo/land";
import { buildTrack } from "@/lib/geo/route-track";

import { ScrollRouteScene } from "@/features/motion/ScrollRouteScene";
import { RouteComparison } from "@/features/story/RouteComparison";
import { LandUseBreakdown } from "@/features/story/LandUseBreakdown";
import { MoneyFlow } from "@/features/motion/MoneyFlow";
import { IndexSeriesChart } from "@/features/series/IndexSeriesChart";
import type { TimelineEvent } from "@/content/schema";

/**
 * 씬 종류 → 컴포넌트.
 *
 * 새 전용 개념이 생기면 스키마에 한 갈래, 여기에 한 줄을 더한다.
 * 레이아웃은 건드리지 않는다.
 */
export function SceneRenderer({
  scene,
  claims,
  timeline,
}: {
  scene: StoryScene;
  claims: Claim[];
  timeline: TimelineEvent[];
}) {
  switch (scene.kind) {
    case "route-map":
      // 경로 기하와 지도 배경은 서버에서 굽는다. 클라이언트에 d3-geo가 가지 않는다.
      return (
        <ScrollRouteScene
          tracks={scene.routes.map(buildTrack)}
          background={getMapBackground()}
        />
      );

    case "route-compare":
      return (
        <RouteComparison
          comparisons={scene.comparisons}
          claims={claims}
          note={scene.note}
        />
      );

    case "land-use":
      return <LandUseBreakdown landUse={scene.landUse} claims={claims} />;

    case "money-flow":
      return <MoneyFlow flow={scene.flow} claims={claims} />;

    case "index-series":
      return (
        <IndexSeriesChart series={scene.series} timeline={timeline} claims={claims} />
      );
  }
}
