import { findScene, type Achievement } from "@/content/schema";
import { Counterpoints } from "@/features/achievement/Counterpoints";
import { KeyNumbers } from "@/features/achievement/KeyNumbers";
import { SceneRenderer } from "@/features/achievement/SceneRenderer";
import { SceneWithAside, Section } from "@/features/achievement/Section";
import { ShareSection } from "@/features/achievement/ShareSection";
import { Timeline } from "@/features/timeline/Timeline";
import { RelationshipBoard } from "@/features/relationship/RelationshipBoard";
import { buildGraphLayout } from "@/lib/graph/layout";

/**
 * 대장동 레이아웃.
 *
 * 순서에 의도가 있다: 연표(무슨 일이 있었나) → 토지(무엇을 가져갔나)
 * → 자금(돈은 어디로) → 쟁점. 구조를 이해하기 전에 반론부터 읽으면
 * 아무것도 판단할 수 없다.
 */
export function DaejangdongLayout({ achievement }: { achievement: Achievement }) {
  const composition = findScene(achievement, "composition");
  const flow = findScene(achievement, "money-flow");
  const graphLayout = achievement.graph ? buildGraphLayout(achievement.graph) : null;

  return (
    <>
      <Section
        scene="timeline"
        heading="어떤 선택지가 있었나"
        lede="시점을 옮기면 그때 무엇이 가능했는지가 나타납니다. 지금 알려진 결과가 아니라, 결정 시점의 조건으로 보십시오."
        first
      >
        <Timeline events={achievement.timeline} claims={achievement.claims} />
      </Section>

      {composition && (
        <Section scene="land" heading={composition.heading} lede={composition.lede}>
          <SceneWithAside
            aside={
              <KeyNumbers
                numbers={achievement.keyNumbers}
                claims={achievement.claims}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
              />
            }
          >
            <SceneRenderer scene={composition} claims={achievement.claims} timeline={achievement.timeline} />
          </SceneWithAside>
        </Section>
      )}

      {flow && (
        <Section scene="flow" heading={flow.heading} lede={flow.lede}>
          <SceneRenderer scene={flow} claims={achievement.claims} timeline={achievement.timeline} />
        </Section>
      )}

      {achievement.graph && graphLayout && (
        <Section
          scene="relations"
          heading="누가 무엇을 맡았나"
          lede="기관과 사업만 올렸습니다. 위 연표에서 시점을 옮기면 그때까지 성립한 관계만 남습니다. 선 위에 커서를 올리면 무슨 관계이고 근거가 무엇인지 나타납니다."
        >
          <RelationshipBoard
            graph={achievement.graph}
            layout={graphLayout}
            claims={achievement.claims}
            timeline={achievement.timeline}
          />
        </Section>
      )}

      <Section
        scene="counterpoint"
        heading="이런 반론이 있습니다"
        lede="제기되는 쟁점을 그대로 싣고, 각각에 근거로 답합니다."
      >
        <Counterpoints counterpoints={achievement.counterpoints} claims={achievement.claims} />
      </Section>

      <ShareSection what="보고 있는 시나리오와 열어 둔 시점이 링크에 담깁니다." />
    </>
  );
}
