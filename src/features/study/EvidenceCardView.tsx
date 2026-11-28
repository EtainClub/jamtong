"use client";

import { useState } from "react";

import type { AssertionKind, StudyItem } from "./types";

export const KIND_LABEL: Record<AssertionKind, string> = {
  FACT: "확인된 사실",
  CLAIM: "주장",
  INTERPRETATION: "해석",
  OPINION: "의견",
};

/**
 * 근거 카드 한 장. 층(사실·주장·해석·의견)을 색과 글로 함께 보인다.
 * 복사하면 원본 페이지 링크가 붙는다 — 공유 링크는 언제나 원본이다(docs/garden-game.md §1). 복사에 보상은 없다.
 */
export function EvidenceCardView({ item, unitTitle, href, copy = false }: { item: StudyItem; unitTitle: string; href?: string; copy?: boolean }) {
  const [copied, setCopied] = useState<"ok" | "fail" | null>(null);
  const card = item.card;
  if (!card) return null;
  const label = card.type === "CLAIM" && card.by ? `${card.by}의 주장` : KIND_LABEL[card.type];

  const doCopy = async () => {
    const url = href ? new URL(href, window.location.origin).toString() : window.location.origin;
    try {
      await navigator.clipboard.writeText(`${card.text}\n근거: ${url}`);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  };

  return (
    <div className={`st-ev t-${card.type}`}>
      <span className="kind">
        {label} · {unitTitle}
      </span>
      <p>{card.text}</p>
      {(copy || href) && (
        <div className="flex flex-wrap items-center gap-3">
          {copy && (
            <button type="button" className="st-btn st-btn-line px-2.5 py-1 text-[12px]" onClick={doCopy}>
              {copied === "ok" ? "복사했어요" : "복사"}
            </button>
          )}
          {href && (
            <a className="st-link" href={href}>
              원문 보기
            </a>
          )}
          {copied === "fail" && <span className="st-small">복사가 막혔어요. 글을 길게 눌러 선택하세요.</span>}
        </div>
      )}
    </div>
  );
}
