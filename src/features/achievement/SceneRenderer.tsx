import type { Claim, Scene } from "@/content/schema";
import { getMapBackground } from "@/lib/geo/land";
import { buildTrack } from "@/lib/geo/route-track";

import { ScrollRouteScene } from "@/features/motion/ScrollRouteScene";
import { RouteComparison } from "@/features/achievement/RouteComparison";
import { CompositionBreakdown } from "@/features/achievement/CompositionBreakdown";
import { MoneyFlow } from "@/features/motion/MoneyFlow";
import { QuantityTrack } from "@/features/motion/QuantityTrack";
import { IndexSeriesChart } from "@/features/series/IndexSeriesChart";
import { ExplainerScene } from "@/features/motion/explainer/ExplainerScene";
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
  scene: Scene;
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

    case "composition":
      return <CompositionBreakdown composition={scene.composition} claims={claims} />;

    case "money-flow":
      return <MoneyFlow flow={scene.flow} claims={claims} />;

    case "quantity-track":
      return <QuantityTrack track={scene.track} claims={claims} />;

    case "index-series":
      return (
        <IndexSeriesChart series={scene.series} timeline={timeline} claims={claims} />
      );

    case "explainer":
      return <ExplainerScene explainer={scene.explainer} claims={claims} />;
  }
}
