"use client";

import type { Claim, Eli5 } from "@/content/schema";
import { Eli5Carousel } from "./Eli5Carousel";
import { useOpenFullStory } from "@/features/story/StoryView";

/** 캐러셀과 전환 상태를 잇는 얇은 껍데기. */
export function Eli5Section({ eli5, claims }: { eli5: Eli5; claims: Claim[] }) {
  const setStoryView = useOpenFullStory();
  return (
    <div className="mx-auto max-w-5xl px-5 pb-4">
      <Eli5Carousel eli5={eli5} claims={claims} onOpenFull={() => setStoryView("full")} />
    </div>
  );
}
