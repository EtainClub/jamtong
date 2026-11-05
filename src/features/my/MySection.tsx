"use client";

import { useState } from "react";

/**
 * MY의 접는 섹션.
 *
 * 브라우저의 <details>를 쓴다. 키보드·스크린리더가 따로 손대지 않아도 열고 닫힌다.
 * 접힌 채로도 요약 한 줄이 보인다 — 열어 보지 않아도 무엇이 있는지 알게.
 *
 * 연 섹션은 이 브라우저에 기억한다. 다음에 와도 보던 대로 열려 있다.
 * 저장소를 못 쓰는 브라우저에서는 처음 모양으로 열릴 뿐이다.
 */
const KEY = "my:open";

function readOpen(fallback: string[]): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : fallback);
  } catch {
    return new Set(fallback);
  }
}

function writeOpen(open: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...open]));
  } catch {
    // 기억하지 못해도 화면은 그대로다.
  }
}

/** 처음 온 사람에게는 정원만 열어 둔다. */
const DEFAULT_OPEN = ["garden"];

export function useOpenSections() {
  // MyPanel은 계정이 준비된 뒤(브라우저)에만 섹션을 그리므로 첫 값을 여기서 읽어도 서버 렌더와 어긋나지 않는다.
  const [open, setOpen] = useState<Set<string>>(() =>
    typeof window === "undefined" ? new Set(DEFAULT_OPEN) : readOpen(DEFAULT_OPEN),
  );
  const toggle = (id: string, next: boolean) => {
    setOpen((prev) => {
      if (prev.has(id) === next) return prev;
      const copy = new Set(prev);
      if (next) copy.add(id);
      else copy.delete(id);
      writeOpen(copy);
      return copy;
    });
  };
  return { open, toggle };
}

export function MySection({
  id,
  icon,
  title,
  summary,
  badge,
  open,
  onToggle,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  /** 접힌 채로 보이는 한 줄. */
  summary: React.ReactNode;
  /** 눈여겨볼 것이 있을 때(새 답변 등). */
  badge?: string | null;
  open: boolean;
  onToggle: (id: string, open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <details
      open={open}
      onToggle={(e) => onToggle(id, (e.currentTarget as HTMLDetailsElement).open)}
      className="group mt-3 rounded-card border border-stone bg-canvas open:border-graphite/40"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="w-6 shrink-0 text-center text-[18px]">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span id={`my-${id}`} className="text-[15px] font-bold text-ink">
              {title}
            </span>
            {badge && (
              <span className="rounded-full bg-navy px-2 py-0.5 text-[10.5px] font-semibold text-eggshell">{badge}</span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-[12px] text-ash">{summary}</span>
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-[12px] text-ash transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-stone px-4 pb-4 pt-3">{children}</div>
    </details>
  );
}
