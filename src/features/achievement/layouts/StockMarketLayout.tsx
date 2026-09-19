import { findScene, type Achievement } from "@/content/schema";
import { Counterpoints } from "@/features/achievement/Counterpoints";
import { KeyNumbers } from "@/features/achievement/KeyNumbers";
import { SceneRenderer } from "@/features/achievement/SceneRenderer";
import { SceneWithAside, Section } from "@/features/achievement/Section";
import { ShareSection } from "@/features/achievement/ShareSection";
import { Timeline } from "@/features/timeline/Timeline";

/**
 * 주식시장 레이아웃.
 *
 * 지수 → 연표 → 쟁점. 연표를 지수 바로 뒤에 두는 이유는 커서가 두 화면을
 * 함께 움직이기 때문이다. 떨어뜨려 놓으면 그 연결이 보이지 않는다.
 */
export function StockMarketLayout({ achievement }: { achievement: Achievement }) {
  const series = findScene(achievement, "index-series");

  return (
    <>
      {series && (
        <Section scene="series" heading={series.heading} lede={series.lede} first>
          <SceneWithAside
            aside={
              <KeyNumbers
                numbers={achievement.keyNumbers}
                claims={achievement.claims}
                className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
              />
            }
          >
            <SceneRenderer scene={series} claims={achievement.claims} timeline={achievement.timeline} />
          </SceneWithAside>
        </Section>
      )}

      <Section
        scene="timeline"
        heading="무엇이 바뀌었나"
        lede="지수와 달리 제도는 남습니다. 시점을 옮기며 확인해 보세요."
      >
        <Timeline events={achievement.timeline} claims={achievement.claims} />
      </Section>

      <Section
        scene="counterpoint"
        heading="이런 반론이 있습니다"
        lede="제기되는 쟁점을 그대로 싣고, 각각에 근거로 답합니다."
      >
        <Counterpoints counterpoints={achievement.counterpoints} claims={achievement.claims} />
      </Section>

      <ShareSection what="열어 둔 시점이 링크에 담깁니다." />
    </>
  );
}
