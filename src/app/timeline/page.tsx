import Link from "next/link";
import type { Metadata } from "next";

import { CHRONOLOGY, CHRONOLOGY_BY_YEAR, CHRONOLOGY_SPAN, UPCOMING } from "@/content/chronology";
import { CATEGORY_LABEL, STATUS_LABEL, formatDate } from "@/content/labels";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";

export const metadata: Metadata = {
  title: "타임라인",
  description: "업적별 연표를 한 줄로 합쳐 같은 때에 무엇과 무엇이 함께 있었는지 봅니다.",
  alternates: { canonical: "/timeline" },
};

/**
 * 전체 타임라인.
 *
 * 업적 안의 연표가 "이 일이 어떻게 진행됐나"라면, 여기는 "같은 때에 무엇과
 * 무엇이 함께 있었나"다. 그래서 항목마다 어느 업적의 시점인지 밝히고,
 * 누르면 그 업적의 바로 그 시점으로 간다.
 */
export default function TimelinePage() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">타임라인</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          업적마다 있는 연표를 한 줄로 합쳤습니다. 같은 때에 무엇과 무엇이 함께
          있었는지 보입니다. 항목을 누르면 그 업적의 바로 그 시점으로 갑니다.
        </p>
        {CHRONOLOGY_SPAN && (
          <p className="mt-3 text-[12px] text-ash">
            <span className="tabular">{CHRONOLOGY_SPAN.from}</span>–
            <span className="tabular">{CHRONOLOGY_SPAN.to}</span> ·{" "}
            <span className="tabular">{CHRONOLOGY.length}</span>개 시점
          </p>
        )}

        <div className="mt-8">
          {CHRONOLOGY_BY_YEAR.map(({ year, entries }) => (
            <section key={year} aria-labelledby={`y-${year}`} className="relative">
              <h2
                id={`y-${year}`}
                className="tabular sticky top-14 z-10 -mx-4 bg-canvas/95 px-4 py-2 text-[13px] font-bold text-navy backdrop-blur"
              >
                {year}
              </h2>

              {/* 세로 실 — 연도 안에서 시점들을 잇는다 */}
              <ol className="ml-[7px] border-l border-stone pb-6 pl-5 pt-1">
                {entries.map((entry) => (
                  <li key={entry.id} className="relative pb-4 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[25px] top-[7px] h-2 w-2 rounded-full bg-navy ring-4 ring-canvas"
                    />
                    <Link
                      href={entry.href}
                      className="block rounded-card border border-stone bg-taupe px-4 py-3 transition-colors hover:border-graphite"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="tabular text-[11px] font-semibold text-smoke">
                          {entry.displayDate}
                        </span>
                        <span className="text-[10px] font-bold text-navy">
                          {entry.achievement.title}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">
                        {entry.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-smoke">{entry.summary}</p>
                      {entry.claimCount > 0 && (
                        <p className="mt-2 text-[11px] text-ash">
                          근거 <span className="tabular">{entry.claimCount}</span>건 · 업적에서 열림
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        {UPCOMING.length > 0 && (
          <section aria-labelledby="upcoming" className="mt-6 border-t border-stone pt-8">
            <h2 id="upcoming" className="text-[15px] font-bold text-ink">
              아직 하지 않은 것 {UPCOMING.length}건
            </h2>
            {/* 한 일과 하겠다는 일이 한 줄에 서면 구별할 방법이 없다. 그래서 여기서 자른다. */}
            <p className="mt-1.5 text-[12px] leading-relaxed text-ash">
              해양수산부 2026년 업무계획에 실린 항목입니다. 위의 연대기는 일어난 일이고,
              여기는 하겠다고 밝힌 일입니다. 같은 줄에 두지 않습니다.
            </p>
            <ul className="mt-3 space-y-2">
              {UPCOMING.map((item) => (
                <li key={item.id} className="rounded-card border border-dashed border-stone px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-ash">
                      {CATEGORY_LABEL[item.categories[0]]}
                    </span>
                    <span className="tabular text-[10px] text-ash">
                      {STATUS_LABEL[item.status]} · {formatDate(item.date, item.datePrecision)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[14px] font-medium leading-snug text-smoke">
                    {item.title}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <BottomNav />
    </>
  );
}
