"use client";

import type { Claim, Eli5 } from "@/content/schema";
import { Eli5Carousel } from "./Eli5Carousel";
import { useOpenFullStory } from "@/features/achievement/ViewSwitch";

/** 캐러셀과 전환 상태를 잇는 얇은 껍데기. */
export function Eli5Section({
  eli5,
  claims,
  below,
}: {
  eli5: Eli5;
  claims: Claim[];
  /** 쉬운 카드 바로 아래에 둘 것. 쇼츠가 여기로 들어온다. */
  below?: React.ReactNode;
}) {
  const setStoryView = useOpenFullStory();
  return (
    <div className="mx-auto max-w-5xl px-5 pb-4">
      <Eli5Carousel
        eli5={eli5}
        claims={claims}
        onOpenFull={() => setStoryView("full")}
        below={below}
      />
    </div>
  );
}
