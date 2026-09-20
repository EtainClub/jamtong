"use client";

import { useState } from "react";

import type { Chapter } from "@/content/books/schema";

/**
 * 장 하나 — 쉽게 보기와 요약 원문.
 *
 * 언행의 StatementView와 같은 약속이다. 쉽게 보기를 먼저 띄우되, 토막마다
 * 발췌의 어느 대목을 옮긴 것인지 접어 둔다. 요약을 믿으라고 하지 않고 대볼 수
 * 있게 두는 것이 이 화면의 전부다.
 *
 * 다른 점 하나. 언행은 원문 전체가 있어서 "원문 보기"가 곧 전문이지만, 책은
 * 전문을 실을 수 없다. 그래서 오른쪽 탭은 **요약 원문(발췌)**이고, 발췌를
 * 싣지 못한 장에서는 그 탭이 아예 뜨지 않는다 — 없는 것을 있는 것처럼 두지
 * 않는다.
 */
export function ChapterView({ chapter }: { chapter: Chapter }) {
  const [view, setView] = useState<"easy" | "excerpt">("easy");
  const hasExcerpt = Boolean(chapter.excerpt);

  return (
    <>
      {hasExcerpt && (
        <div
          role="radiogroup"
          aria-label="보기 방식"
          className="mt-6 flex gap-1.5 rounded-full border border-stone p-1"
        >
          {(
            [
              ["easy", "쉽게 보기"],
              ["excerpt", "요약 원문"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={view === id}
              onClick={() => setView(id)}
              className={`flex-1 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                view === id ? "bg-ink text-eggshell" : "text-smoke hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {view === "easy" || !hasExcerpt ? (
        <section aria-label="쉽게 보기" className="mt-6">
          <p className="text-[14.5px] leading-relaxed text-ink">{chapter.easy.lead}</p>

          <ol className="mt-5 space-y-4">
            {chapter.easy.points.map((point, index) => (
              <li key={point.id} className="border-l-2 border-stone pl-3.5">
                <span className="text-[11px] font-semibold text-ash">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-0.5 text-[14px] font-bold text-ink">{point.title}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-smoke">{point.say}</p>

                {point.quote && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-[11px] font-semibold text-navy">
                      발췌에서 이 대목
                    </summary>
                    <p className="mt-1.5 border-l border-stone pl-3 text-[12.5px] leading-relaxed text-graphite">
                      {point.quote}
                    </p>
                  </details>
                )}
              </li>
            ))}
          </ol>

          {!hasExcerpt && (
            <p className="mt-6 rounded-card border border-stone bg-taupe/50 px-4 py-3 text-[12px] leading-relaxed text-smoke">
              이 장은 발췌를 싣지 못했습니다. 위의 글은 우리가 옮긴 요약이며, 원문과
              대보려면 책을 직접 보셔야 합니다.
            </p>
          )}
        </section>
      ) : (
        <section aria-label="요약 원문" className="mt-6">
          <p className="whitespace-pre-wrap text-[14.5px] leading-[1.9] text-ink">
            {chapter.excerpt}
          </p>
          <p className="mt-4 text-[11px] leading-relaxed text-ash">
            인용 범위 안의 발췌입니다. 전문이 아닙니다 — {chapter.excerptSource}
          </p>
        </section>
      )}
    </>
  );
}
