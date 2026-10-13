"use client";

import { createContext, useContext, useState } from "react";

/**
 * 재판 화면의 쉽게 보기 / 원문 보기 전환.
 *
 * 업적의 ViewSwitch와 달리 두 쪽을 다 그려 두고 `hidden`으로만 가린다.
 * 여기엔 스크롤 씬이 없어서 숨긴 쪽이 계산을 돌리지 않고, 원문이 늘 HTML에
 * 남아 검색엔진과 화면낭독기가 읽을 수 있다.
 */
type Mode = "easy" | "full";

const ModeContext = createContext<{ mode: Mode; setMode: (m: Mode) => void }>({
  mode: "easy",
  setMode: () => {},
});

export function TrialsView({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("easy");
  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}

export function TrialsViewToggle() {
  const { mode, setMode } = useContext(ModeContext);
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
        const active = option.id === mode;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(option.id)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              active ? "bg-ink text-eggshell" : "text-smoke hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ModePane({ mode, children }: { mode: Mode; children: React.ReactNode }) {
  const current = useContext(ModeContext).mode;
  return <div hidden={current !== mode}>{children}</div>;
}

/** 카드에서 원문의 그 사건 자리로 넘어가는 문. */
export function OpenFullButton({ anchor, children }: { anchor: string; children: React.ReactNode }) {
  const { setMode } = useContext(ModeContext);
  return (
    <button
      type="button"
      onClick={() => {
        setMode("full");
        requestAnimationFrame(() =>
          document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
      }}
      className="text-[12px] font-semibold text-navy"
    >
      {children}
    </button>
  );
}
