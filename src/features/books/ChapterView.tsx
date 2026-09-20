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
 * 전문을 실을 수 없다. 그래서 오른쪽 탭은 **요약 원문**이고, 그 글이 저자의
 * 문장인지 우리가 옮긴 요약인지를 탭 아래에 밝힌다. 본문을 싣지 못한 장에서는
 * 탭이 아예 뜨지 않는다 — 없는 것을 있는 것처럼 두지 않는다.
 */
export function ChapterView({ chapter }: { chapter: Chapter }) {
  const [view, setView] = useState<"easy" | "body">("easy");
  const hasBody = Boolean(chapter.body);

  return (
    <>
      {hasBody && (
        <div
          role="radiogroup"
          aria-label="보기 방식"
          className="mt-6 flex gap-1.5 rounded-full border border-stone p-1"
        >
          {(
            [
              ["easy", "쉽게 보기"],
              ["body", "요약 원문"],
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

      {view === "easy" || !hasBody ? (
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
                      요약 원문에서 이 대목
                    </summary>
                    <p className="mt-1.5 border-l border-stone pl-3 text-[12.5px] leading-relaxed text-graphite">
                      {point.quote}
                    </p>
                  </details>
                )}
              </li>
            ))}
          </ol>

          {!hasBody && (
            <p className="mt-6 rounded-card border border-stone bg-taupe/50 px-4 py-3 text-[12px] leading-relaxed text-smoke">
              이 장은 요약 원문을 싣지 못했습니다. 위의 글은 쉽게 보기뿐이며, 자세한
              내용은 책을 직접 보셔야 합니다.
            </p>
          )}
        </section>
      ) : (
        <section aria-label="요약 원문" className="mt-6">
          <div className="space-y-4">
            {(chapter.body ?? "").split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-[14.5px] leading-[1.9] text-ink">
                {paragraph}
              </p>
            ))}
          </div>

          {chapter.truncated && (
            <p className="mt-5 rounded-card border border-stone bg-taupe/50 px-4 py-3 text-[12px] leading-relaxed text-smoke">
              이 장의 요약 자료가 중간에서 끊겼습니다. 마지막 대목이 비어 있습니다.
            </p>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-ash">
            {chapter.bodyKind === "excerpt"
              ? "인용 범위 안의 발췌입니다. 전문이 아닙니다"
              : "책을 읽고 우리가 옮긴 요약입니다. 저자의 문장이 아닙니다"}
            {chapter.bodySource ? ` — ${chapter.bodySource}` : "."}
          </p>
        </section>
      )}
    </>
  );
}
