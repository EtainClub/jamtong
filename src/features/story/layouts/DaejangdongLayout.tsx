import { findScene, type Story } from "@/content/schema";
import { Counterpoints } from "@/features/story/Counterpoints";
import { KeyNumbers } from "@/features/story/KeyNumbers";
import { SceneRenderer } from "@/features/story/SceneRenderer";
import { SceneWithAside, StorySection } from "@/features/story/StorySection";
import { ShareSection } from "@/features/story/ShareSection";
import { Timeline } from "@/features/timeline/Timeline";

/**
 * 대장동 레이아웃.
 *
 * 순서에 의도가 있다: 연표(무슨 일이 있었나) → 토지(무엇을 가져갔나)
 * → 자금(돈은 어디로) → 쟁점. 구조를 이해하기 전에 반론부터 읽으면
 * 아무것도 판단할 수 없다.
 */
export function DaejangdongLayout({ story }: { story: Story }) {
  const landUse = findScene(story, "land-use");
  const flow = findScene(story, "money-flow");

  return (
    <>
      <StorySection
        scene="timeline"
        heading="어떤 선택지가 있었나"
        lede="시점을 옮기면 그때 무엇이 가능했는지가 나타납니다. 지금 알려진 결과가 아니라, 결정 시점의 조건으로 보십시오."
        first
      >
        <Timeline events={story.timeline} claims={story.claims} />
      </StorySection>

      {landUse && (
        <StorySection scene="land" heading={landUse.heading} lede={landUse.lede}>
          <SceneWithAside
            aside={
              <KeyNumbers
                numbers={story.keyNumbers}
                claims={story.claims}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
              />
            }
          >
            <SceneRenderer scene={landUse} claims={story.claims} timeline={story.timeline} />
          </SceneWithAside>
        </StorySection>
      )}

      {flow && (
        <StorySection scene="flow" heading={flow.heading} lede={flow.lede}>
          <SceneRenderer scene={flow} claims={story.claims} timeline={story.timeline} />
        </StorySection>
      )}

      <StorySection
        scene="counterpoint"
        heading="이런 반론이 있습니다"
        lede="제기되는 쟁점을 그대로 싣고, 각각에 근거로 답합니다."
      >
        <Counterpoints counterpoints={story.counterpoints} claims={story.claims} />
      </StorySection>

      <ShareSection what="보고 있는 시나리오와 열어 둔 시점이 링크에 담깁니다." />
    </>
  );
}
