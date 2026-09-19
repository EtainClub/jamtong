"use client";

import { useVisualState } from "@/lib/visual-state/store";

/**
 * "근거 N개" 칩.
 * 화면 위의 모든 수치·단정 옆에 붙는다. 이 버튼이 없는 주장은 렌더링하지 않는다.
 */
export function EvidenceButton({
  claimId,
  count,
  label,
}: {
  claimId: string;
  count: number;
  /** 한 줄에 칩이 여러 개 놓일 때 무엇의 근거인지 구분해 준다. */
  label?: string;
}) {
  const openEvidence = useVisualState((s) => s.openEvidence);

  return (
    <button
      type="button"
      onClick={() => openEvidence(claimId)}
      className="inline-flex items-center gap-1.5 rounded-full border border-stone bg-transparent px-2.5 py-1 text-[11px] font-medium text-smoke transition-colors hover:border-graphite hover:bg-navy-tint hover:text-navy"
    >
      <span aria-hidden="true">◆</span>
      {label ? `${label} · 근거 ${count}` : `근거 ${count}개`}
    </button>
  );
}
