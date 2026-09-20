"use client";

import { useRef, useState } from "react";

/**
 * 언행 탭.
 *
 * ★ 두 탭에 있는 것은 같은 종류의 자료가 아니다.
 *   왼쪽은 본인이 한 말 그 자체이고, 오른쪽은 남들이 만들어 올린 영상이다.
 *   한 목록에 섞으면 "대통령이 그렇게 말했다"와 "누가 대통령을 두고 그렇게
 *   말했다"가 같은 줄에 선다. 탭으로 가르는 이유가 그것이고, 그래서 처음
 *   열리는 쪽은 늘 왼쪽이다.
 *
 * ★ 주소에 담지 않는다.
 *   담으려면 searchParams를 읽어야 하고, 그러면 이 페이지가 통째로 매 요청
 *   렌더링으로 넘어간다. 언행 목록은 빌드 때 굳혀 두는 편이 낫고, 응원 탭은
 *   아직 따로 공유할 주소가 필요한 자리가 아니다. 필요해지면 그때 옮긴다.
 */

const TABS = [
  { id: "words", label: "대통령의 언행" },
  { id: "cheers", label: "지지자 응원" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function WordsTabs({
  words,
  cheers,
}: {
  words: React.ReactNode;
  cheers: React.ReactNode;
}) {
  const [active, setActive] = useState<TabId>("words");
  const listRef = useRef<HTMLDivElement>(null);

  /*
   * 한 번이라도 연 탭.
   *
   * 응원 탭은 열리는 순간 파이어스토어를 구독하고 유튜브 iframe을 붙인다.
   * 처음부터 붙여 두면 언행만 보고 나가는 사람도 그 값을 치른다. 그렇다고
   * 닫을 때 떼면 다시 열 때마다 영상이 처음으로 돌아간다. 그래서 **처음 열
   * 때 붙이고 그 뒤로는 두는** 쪽을 고른다.
   */
  const [opened, setOpened] = useState<Set<TabId>>(() => new Set<TabId>(["words"]));

  const show = (id: TabId) => {
    setActive(id);
    setOpened((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  };

  /* 탭 줄 안에서는 좌우 화살표로 옮겨 다니는 것이 표준 동작이다. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;
    e.preventDefault();
    const at = TABS.findIndex((t) => t.id === active);
    const next = TABS[(at + step + TABS.length) % TABS.length];
    show(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`#tab-${next.id}`)?.focus();
  };

  return (
    <>
      <div
        ref={listRef}
        role="tablist"
        aria-label="언행 보기"
        onKeyDown={onKeyDown}
        className="mt-6 flex gap-1.5"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={tab.id === active}
            aria-controls={`panel-${tab.id}`}
            tabIndex={tab.id === active ? 0 : -1}
            onClick={() => show(tab.id)}
            className={`flex-1 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              tab.id === active
                ? "bg-ink text-eggshell"
                : "border border-stone text-smoke hover:border-graphite hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/*
        * 한 번 연 뒤로는 둘 다 붙여 두고, 안 보는 쪽을 hidden으로 덮는다.
        * 갈아 끼우면 탭을 오갈 때마다 유튜브 iframe이 새로 붙어 보던 자리가
        * 처음으로 돌아간다.
        */}
      <div
        role="tabpanel"
        id="panel-words"
        aria-labelledby="tab-words"
        hidden={active !== "words"}
      >
        {opened.has("words") && words}
      </div>

      <div
        role="tabpanel"
        id="panel-cheers"
        aria-labelledby="tab-cheers"
        hidden={active !== "cheers"}
      >
        {opened.has("cheers") && cheers}
      </div>
    </>
  );
}
