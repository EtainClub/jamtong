import type { Story } from "@/content/schema";
import { arcticRoute } from "./arctic-route/story";
import { daejangdong } from "./daejangdong/story";

/**
 * 스토리 레지스트리.
 *
 * 콘텐츠가 리포지토리에 있으므로 목록도 빌드 타임 상수다.
 * 검색·피드·정적 경로가 전부 이걸 본다.
 */
export const STORIES: Story[] = [arcticRoute, daejangdong];

export function getStory(slug: string): Story | undefined {
  return STORIES.find((story) => story.slug === slug);
}

/** 피드에는 공개 스토리만 올린다. draft는 URL을 아는 사람만 본다. */
export function getPublishedStories(): Story[] {
  return STORIES.filter((story) => story.publishStatus === "published");
}
