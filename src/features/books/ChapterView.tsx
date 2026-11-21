"use client";

import { useState } from "react";

import type { ReadLocale } from "@/content/books/i18n";
import type { Chapter } from "@/content/books/schema";
import { CardCarousel } from "@/features/carousel/CardCarousel";
import { ChapterBody } from "./ChapterBody";
import { ChapterShorts } from "./ChapterShorts";
import { Figure } from "./Figure";
import { BOOK_UI } from "./ui";

/**
 * 장 하나 — 쉽게 보기와 요약 원문.
 *
 * 언행의 StatementView와 같은 약속이다. 쉽게 보기를 먼저 띄우되, 토막마다
 * 본문의 어느 대목을 옮긴 것인지 접어 둔다. 요약을 믿으라고 하지 않고 대볼 수
 * 있게 두는 것이 이 화면의 전부다.
 *
 * ★ 쉽게 보기는 캐러셀이다.
 *   업적의 쉬운 설명, 언행의 쉽게 보기와 같은 CardCarousel을 쓴다. 한 화면에
 *   한 토막만 두고 넘긴다 — 세로로 늘어놓으면 결국 읽는 글이 되고, 그러면
 *   요약 원문을 읽는 것과 다를 바가 없다. 껍데기를 세 벌로 두면 한쪽에서
 *   스냅을 고치고 다른 쪽을 잊는다.
 *
 * 다른 점 하나. 언행은 원문 전체가 있어서 "원문 보기"가 곧 전문이지만, 책은
 * 전문을 실을 수 없다. 그래서 오른쪽 탭은 **요약 원문**이고, 그 글이 저자의
 * 문장인지 우리가 옮긴 요약인지를 탭 아래에 밝힌다. 본문을 싣지 못한 장에서는
 * 탭이 아예 뜨지 않는다 — 없는 것을 있는 것처럼 두지 않는다.
 */
export function ChapterView({ chapter, lang = "ko" }: { chapter: Chapter; lang?: ReadLocale }) {
  const t = BOOK_UI[lang];
  const [view, setView] = useState<"easy" | "body">("easy");
  const hasBody = Boolean(chapter.body);

  return (
    <>
      {hasBody && (
        <div
          role="radiogroup"
          aria-label={t.viewMode}
          className="mt-6 flex gap-1.5 rounded-full border border-stone p-1"
        >
          {(
            [
              ["easy", t.easyTab],
              ["body", t.bodyTab],
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
        <section aria-label={t.easyTab} className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
            {t.easyKicker}
          </p>
          <p className="mt-2.5 text-[16px] font-light leading-relaxed text-ink">
            {chapter.easy.lead}
          </p>

          <div className="mt-5">
            <CardCarousel
              items={chapter.easy.points}
              label={t.scenes(chapter.easy.points.length)}
              itemLabel={t.scene}
              nav={{ prev: t.prevScene, next: t.nextScene, pick: t.pickScene }}
            >
              {(point, i, total) => {
                return (
                  <>
                    {point.figure && (
                      <div className="aspect-[4/3] w-full">
                        <Figure figure={point.figure} />
                      </div>
                    )}

                    <p className="tabular mt-4 font-mono text-[11px] tracking-[0.1em] text-ash">
                      {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1.5 text-[20px] font-light leading-snug tracking-[-0.02em] text-ink">
                      {point.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-[1.7] text-smoke">{point.say}</p>

                    {point.quote && (
                      <details className="group mt-3.5">
                        <summary className="cursor-pointer list-none text-[12px] font-semibold text-navy hover:underline">
                          {t.quoteToggle}
                          <span aria-hidden="true" className="ml-1 inline-block group-open:hidden">
                            ▾
                          </span>
                          <span aria-hidden="true" className="ml-1 hidden group-open:inline-block">
                            ▴
                          </span>
                        </summary>
                        <blockquote className="mt-2.5 border-l-2 border-stone pl-3 text-[13.5px] leading-relaxed text-ash">
                          {point.quote}
                        </blockquote>
                      </details>
                    )}
                  </>
                );
              }}
            </CardCarousel>
          </div>

          <ChapterShorts
            shorts={chapter.shorts}
            chapterTitle={chapter.title}
            order={chapter.order}
            lang={lang}
          />

          {!hasBody && (
            <p className="mt-6 rounded-card border border-stone bg-taupe/50 px-4 py-3 text-[12px] leading-relaxed text-smoke">
              {t.noBody}
            </p>
          )}

          {hasBody && (
            <button
              type="button"
              onClick={() => setView("body")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-card border border-stone bg-taupe px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-graphite"
            >
              {t.readBody}
              <span aria-hidden="true">→</span>
            </button>
          )}
        </section>
      ) : (
        <section aria-label={t.bodyTab} className="mt-6">
          <ChapterBody chapter={chapter} />

          {chapter.truncated && (
            <p className="mt-5 rounded-card border border-stone bg-taupe/50 px-4 py-3 text-[12px] leading-relaxed text-smoke">
              {t.truncated}
            </p>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-ash">
            {chapter.bodyKind === "excerpt" ? t.bodyNote.excerpt : t.bodyNote.summary}
            {chapter.bodySource ? ` — ${chapter.bodySource}` : "."}
          </p>
        </section>
      )}
    </>
  );
}
