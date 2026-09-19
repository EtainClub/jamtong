import type { Achievement } from "@/content/schema";
import { Counterpoints } from "@/features/achievement/Counterpoints";
import { KeyNumbers } from "@/features/achievement/KeyNumbers";
import { Section } from "@/features/achievement/Section";
import { ShareSection } from "@/features/achievement/ShareSection";
import { Timeline } from "@/features/timeline/Timeline";
import { RelationshipBoard } from "@/features/relationship/RelationshipBoard";
import { buildGraphLayout } from "@/lib/graph/layout";

/**
 * 전용 모션 씬이 없는 업적의 레이아웃.
 *
 * 연표가 주인공이고, 수치와 관계도가 뒤를 받친다. 성남시의료원과 무상급식이
 * 같은 모양이라 하나로 묶었다 — 세 번째 같은 파일을 만들 이유가 없다.
 *
 * 제목과 리드는 업적마다 달라야 하므로 설정에서 받는다. 레이아웃이 코드에
 * 남아 있는 것은 '무엇을 어떤 순서로 둘지'가 아직 스토리마다 다르기 때문이고,
 * 문구까지 코드에 박아 두면 그 판단이 콘텐츠에서 보이지 않는다.
 */

export interface NarrativeCopy {
  timelineHeading: string;
  timelineLede: string;
  numbersHeading: string;
  numbersLede: string;
  relationsHeading: string;
  relationsLede: string;
  shareWhat: string;
}

export function NarrativeLayout({
  achievement,
  copy,
}: {
  achievement: Achievement;
  copy: NarrativeCopy;
}) {
  const graphLayout = achievement.graph ? buildGraphLayout(achievement.graph) : null;

  return (
    <>
      <Section scene="timeline" heading={copy.timelineHeading} lede={copy.timelineLede} first>
        <Timeline events={achievement.timeline} claims={achievement.claims} />
      </Section>

      {achievement.keyNumbers.length > 0 && (
        <Section heading={copy.numbersHeading} lede={copy.numbersLede}>
          <KeyNumbers
            numbers={achievement.keyNumbers}
            claims={achievement.claims}
            className="grid gap-4 sm:grid-cols-3"
          />
        </Section>
      )}

      {achievement.graph && graphLayout && (
        <Section scene="relations" heading={copy.relationsHeading} lede={copy.relationsLede}>
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

      <ShareSection what={copy.shareWhat} />
    </>
  );
}
