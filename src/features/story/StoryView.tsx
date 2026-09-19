"use client";

import { useVisualState } from "@/lib/visual-state/store";

/**
 * 쉽게 보기 / 원문 보기 전환.
 *
 * 한쪽만 마운트한다. 둘 다 띄워 놓고 CSS로 감추면, 숨겨진 스크롤 씬이
 * 계속 스크롤 위치를 계산해 배가 엉뚱하게 움직인다.
 */
export function StoryViewSwitch({
  easy,
  full,
}: {
  easy: React.ReactNode;
  full: React.ReactNode;
}) {
  const view = useVisualState((s) => s.storyView);
  if (!easy) return <>{full}</>;
  return <>{view === "easy" ? easy : full}</>;
}

export function StoryViewToggle() {
  const view = useVisualState((s) => s.storyView);
  const setStoryView = useVisualState((s) => s.setStoryView);

  const options = [
    { id: "easy" as const, label: "쉽게 보기" },
    { id: "full" as const, label: "원문 보기" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="보기 방식"
      className="inline-flex rounded-full border border-stone bg-taupe p-1"
    >
      {options.map((option) => {
        const active = option.id === view;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setStoryView(option.id)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              active
                ? "bg-ink text-eggshell"
                : "text-smoke hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** 마지막 장면에서 원문으로 넘어가는 버튼이 쓴다. */
export function useOpenFullStory() {
  return useVisualState((s) => s.setStoryView);
}
