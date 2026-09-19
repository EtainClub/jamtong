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
 * 성남시 3대 무상복지 레이아웃.
 *
 * 연표를 맨 앞에 둔다. 이 업적은 "무엇을 줬나"보다 "언제 무엇이 막혔나"가
 * 형태를 만든다. 시작 → 제동 → 소송 → 취하의 순서를 먼저 보여야
 * 나머지 화면이 읽힌다.
 */
export function SeongnamWelfareLayout({ achievement }: { achievement: Achievement }) {
  const flow = findScene(achievement, "money-flow");
  const graphLayout = achievement.graph ? buildGraphLayout(achievement.graph) : null;

  return (
    <>
      <Section
        scene="timeline"
        heading="시작하고, 막히고, 거둬졌다"
        lede="시점을 옮기면 그때 무엇이 걸려 있었는지가 나타납니다. 세 사업은 소송이 도는 동안에도 멈추지 않았습니다."
        first
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
          heading="누가 무엇을 걸었나"
          lede="기관과 제도, 그리고 받는 쪽만 올렸습니다. 위 연표에서 시점을 옮기면 그때까지 성립한 관계만 남습니다."
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
