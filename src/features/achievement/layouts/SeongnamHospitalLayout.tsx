import type { Achievement } from "@/content/schema";
import { Counterpoints } from "@/features/achievement/Counterpoints";
import { KeyNumbers } from "@/features/achievement/KeyNumbers";
import { Section } from "@/features/achievement/Section";
import { ShareSection } from "@/features/achievement/ShareSection";
import { Timeline } from "@/features/timeline/Timeline";
import { RelationshipBoard } from "@/features/relationship/RelationshipBoard";
import { buildGraphLayout } from "@/lib/graph/layout";

/**
 * 성남시의료원 레이아웃.
 *
 * 전용 모션 씬이 없다. 이 업적을 움직여 볼 만한 개념이 마땅치 않고, 억지로
 * 끼워 넣으면 화면 하나가 낭비된다. 대신 연표가 주인공이다 — 17년이 걸렸다는
 * 것이 이 이야기의 전부이기 때문이다.
 */
export function SeongnamHospitalLayout({ achievement }: { achievement: Achievement }) {
  const graphLayout = achievement.graph ? buildGraphLayout(achievement.graph) : null;

  return (
    <>
      <Section
        scene="timeline"
        heading="17년이 걸렸습니다"
        lede="시점을 옮기면 그때 무엇이 멈춰 있었는지가 나타납니다. 조례가 통과되고도 7년이 비어 있습니다."
        first
      >
        <Timeline events={achievement.timeline} claims={achievement.claims} />
      </Section>

      <Section
        heading="무엇이 지어졌나"
        lede="문을 열었을 때의 규모입니다."
      >
        <KeyNumbers
          numbers={achievement.keyNumbers}
          claims={achievement.claims}
          className="grid gap-4 sm:grid-cols-3"
        />
      </Section>

      {achievement.graph && graphLayout && (
        <Section
          scene="relations"
          heading="누가 만들었나"
          lede="가운데가 성남시민입니다. 발의한 쪽과 통과시킨 쪽, 지은 쪽이 각각 다릅니다. 위 연표에서 시점을 옮기면 그때까지 성립한 관계만 남습니다."
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
