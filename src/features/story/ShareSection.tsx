import { ShareButton } from "./ShareButton";
import { StorySection } from "./StorySection";

/**
 * 공유 섹션. 레이아웃 셋에서 같은 내용이 반복됐다.
 * 스토리마다 담기는 상태가 다르므로 설명만 받는다.
 */
export function ShareSection({ what }: { what: string }) {
  return (
    <StorySection scene="share" heading="이 화면을 그대로 공유하기" lede={what}>
      <ShareButton />
    </StorySection>
  );
}
