import { findScene, type Story } from "@/content/schema";
import { Counterpoints } from "@/features/story/Counterpoints";
import { KeyNumbers } from "@/features/story/KeyNumbers";
import { SceneRenderer } from "@/features/story/SceneRenderer";
import { SceneWithAside, StorySection } from "@/features/story/StorySection";
import { ShareSection } from "@/features/story/ShareSection";
import { Timeline } from "@/features/timeline/Timeline";

/**
 * 주식시장 레이아웃.
 *
 * 지수 → 연표 → 쟁점. 연표를 지수 바로 뒤에 두는 이유는 커서가 두 화면을
 * 함께 움직이기 때문이다. 떨어뜨려 놓으면 그 연결이 보이지 않는다.
 */
export function StockMarketLayout({ story }: { story: Story }) {
  const series = findScene(story, "index-series");

  return (
    <>
      {series && (
        <StorySection scene="series" heading={series.heading} lede={series.lede} first>
          <SceneWithAside
            aside={
              <KeyNumbers
                numbers={story.keyNumbers}
                claims={story.claims}
                className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
              />
            }
          >
            <SceneRenderer scene={series} claims={story.claims} timeline={story.timeline} />
          </SceneWithAside>
        </StorySection>
      )}

      <StorySection
        scene="timeline"
        heading="무엇이 바뀌었나"
        lede="지수와 달리 제도는 남습니다. 시점을 옮기며 확인해 보세요."
      >
        <Timeline events={story.timeline} claims={story.claims} />
      </StorySection>

      <StorySection
        scene="counterpoint"
        heading="이런 반론이 있습니다"
        lede="제기되는 쟁점을 그대로 싣고, 각각에 근거로 답합니다."
      >
        <Counterpoints counterpoints={story.counterpoints} claims={story.claims} />
      </StorySection>

      <ShareSection what="열어 둔 시점이 링크에 담깁니다." />
    </>
  );
}
