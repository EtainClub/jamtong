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
 * 성남시 모라토리엄 레이아웃.
 *
 * 연표가 먼저다. 선언 → 상환 → 채무 제로의 순서를 모르면 뒤의 숫자들이
 * 서로 다른 셈이라는 것도 보이지 않는다.
 */
export function SeongnamDebtLayout({ achievement }: { achievement: Achievement }) {
  const motion = findScene(achievement, "quantity-track");
  const flow = findScene(achievement, "money-flow");
  const graphLayout = achievement.graph ? buildGraphLayout(achievement.graph) : null;

  return (
    <>
      {/* 움직임이 먼저 붙잡는다. 막대가 0까지 줄어드는 것을 본 뒤에 연표를 읽는다. */}
      {motion && (
        <Section scene="motion" heading={motion.heading} lede={motion.lede} first>
          <SceneRenderer
            scene={motion}
            claims={achievement.claims}
            timeline={achievement.timeline}
          />
        </Section>
      )}

      <Section
        scene="timeline"
        heading="선언하고, 갚고, 다시 갚았다"
        lede="시점을 옮기면 그때 무엇이 남아 있었는지가 나타납니다. 2014년과 2018년은 서로 다른 셈입니다."
        first={!motion}
      >
        <Timeline events={achievement.timeline} claims={achievement.claims} />
      </Section>

      {flow && (
        <Section scene="flow" heading={flow.heading} lede={flow.lede}>
          <SceneWithAside
            aside={
              <KeyNumbers
                numbers={achievement.keyNumbers}
                claims={achievement.claims}
                className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
              />
            }
          >
            <SceneRenderer
              scene={flow}
              claims={achievement.claims}
              timeline={achievement.timeline}
            />
          </SceneWithAside>
        </Section>
      )}

      {achievement.graph && graphLayout && (
        <Section
          scene="relations"
          heading="돈이 어디서 어디로 갔나"
          lede="판교에 쓰라고 모아 둔 돈이 어디로 갔고 어떻게 채워졌는지 봅니다. 위 연표에서 시점을 옮기면 그때까지 성립한 관계만 남습니다."
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

      <ShareSection what="보고 있는 시점과 열어 둔 근거가 링크에 담깁니다." />
    </>
  );
}
