import { findScene, type Achievement } from "@/content/schema";
import { KeyNumbers } from "@/features/achievement/KeyNumbers";
import { SceneRenderer } from "@/features/achievement/SceneRenderer";
import { SceneWithAside, Section } from "@/features/achievement/Section";
import { ShareSection } from "@/features/achievement/ShareSection";
import { Timeline } from "@/features/timeline/Timeline";
import { RelationshipBoard } from "@/features/relationship/RelationshipBoard";
import { buildGraphLayout } from "@/lib/graph/layout";

/**
 * 북극항로 레이아웃.
 *
 * 씬 데이터는 이제 achievement.scenes에서 오고, 이 파일은 **어느 씬을 어떤 순서로
 * 어떤 곁다리와 함께 둘지**만 정한다. 그 판단은 스토리마다 다르므로
 * 아직 코드가 갖는다. (설계 검토 문서 5.1)
 */

const DISTANCE_NUMBERS = new Set(["kn-distance", "kn-km", "kn-days"]);

export function ArcticRouteLayout({ achievement }: { achievement: Achievement }) {
  const routeMap = findScene(achievement, "route-map");
  const compare = findScene(achievement, "route-compare");
  const graphLayout = achievement.graph ? buildGraphLayout(achievement.graph) : null;

  const distance = achievement.keyNumbers.filter((n) => DISTANCE_NUMBERS.has(n.id));
  const support = achievement.keyNumbers.filter((n) => !DISTANCE_NUMBERS.has(n.id));

  return (
    <>
      {routeMap && (
        <Section
          scene="route"
          heading={routeMap.heading}
          lede={routeMap.lede}
          first
        >
          <SceneRenderer scene={routeMap} claims={achievement.claims} timeline={achievement.timeline} />
        </Section>
      )}

      {compare && (
        <Section scene="compare" heading={compare.heading} lede={compare.lede}>
          <SceneWithAside
            aside={
              <KeyNumbers
                numbers={distance}
                claims={achievement.claims}
                className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
              />
            }
          >
            <SceneRenderer scene={compare} claims={achievement.claims} timeline={achievement.timeline} />
          </SceneWithAside>
        </Section>
      )}

      <Section
        heading="무엇이 준비되고 있나"
        lede="북극항로를 운항하는 선사에 제공되는 지원과 혜택입니다."
      >
        <KeyNumbers
          numbers={support}
          claims={achievement.claims}
          className="grid gap-4 sm:grid-cols-3"
        />
      </Section>

      <Section
        scene="timeline"
        heading="어떻게 여기까지 왔나"
        lede="시점을 옮기면 그때의 상황이 나타납니다."
      >
        <Timeline events={achievement.timeline} claims={achievement.claims} />
      </Section>

      {achievement.graph && graphLayout && (
        <Section
          scene="relations"
          heading="누가 무엇을 하고 있나"
          lede="기관·사업·항만이 어떻게 연결되는지 봅니다. 위 연표에서 시점을 옮기면 그때까지 성립한 관계만 남습니다. 선 위에 커서를 올리면 무슨 관계이고 근거가 무엇인지 나타납니다."
        >
          <RelationshipBoard
            graph={achievement.graph}
            layout={graphLayout}
            claims={achievement.claims}
            timeline={achievement.timeline}
          />
        </Section>
      )}

      <ShareSection what="배의 위치, 선택한 항로, 열어 둔 시점까지 지금 보고 있는 상태가 링크에 담깁니다." />
    </>
  );
}
