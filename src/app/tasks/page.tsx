import type { Metadata } from "next";
import Link from "next/link";

import {
  TASK_GOALS,
  TASKS,
  TASKS_SOURCE,
  sumCounts,
  tasksAsOf,
  type ResolvedTask,
} from "@/content/tasks";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import {
  PledgeBar,
  PledgeLegend,
  StatusGuide,
  koreanDate,
} from "@/features/pledges/PledgeProgress";
import { TrackedLine } from "@/features/pledges/TrackedLine";

export const metadata: Metadata = {
  title: "123대 국정과제",
  description:
    "이재명정부 123대 국정과제를 5대 국정목표·23개 추진전략별로 정리하고, 주요내용마다 시행·추진 중·확인 전을 근거와 함께 표시합니다.",
  alternates: { canonical: "/tasks" },
};

/**
 * 123대 국정과제 목록.
 *
 * 공약 화면과 같은 틀이다 — 전체 막대, 근거가 붙은 것 먼저, 그다음 원문 순서.
 * 과제가 123개라 본문은 과제별 화면(/tasks/[no])으로 나눈다. 한 화면에 554줄을
 * 다 펼치면 휴대폰에서 원하는 과제에 닿기 어렵다.
 */
export default function TasksPage() {
  const total = sumCounts(TASKS);
  const asOf = tasksAsOf();
  const tracked = TASKS.flatMap((task) =>
    task.contents.flatMap((c) => (c.evidence ? [{ task, c }] : [])),
  ).sort((a, b) => Number(a.c.status !== "done") - Number(b.c.status !== "done"));

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <p className="text-[12px] font-bold text-navy">이재명정부 · 5대 국정목표 · 23개 추진전략</p>
        <h1 className="mt-1 text-2xl font-light tracking-[-0.02em] text-ink">123대 국정과제</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          정부가 임기 동안 추진하겠다고 정한 과제를 원문대로 옮겼습니다. 과제마다 담긴
          주요내용 <span className="tabular">{total.total}</span>개가 지금 어디까지 왔는지
          표시합니다. 상태는 이 사이트에 실린 근거가 있을 때만 붙입니다.
        </p>
        <a
          href={TASKS_SOURCE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[12px] font-medium text-navy underline underline-offset-2"
        >
          국정과제 원문(PDF) <span aria-hidden="true">↗</span>
        </a>

        <section
          aria-labelledby="tasks-overview"
          className="mt-6 rounded-card border border-stone bg-taupe px-4 py-4"
        >
          <h2 id="tasks-overview" className="text-[15px] font-bold text-ink">
            이행 현황
          </h2>
          <p className="mt-1 text-[12px] text-ash">
            주요내용 <span className="tabular">{total.total}</span>개 기준
            {asOf && <> · 근거 기준일 {koreanDate(asOf)}</>}
          </p>
          <div className="mt-3">
            <PledgeBar count={total} />
          </div>
          <div className="mt-2.5">
            <PledgeLegend count={total} />
          </div>

          {/* 목표별 막대. 어느 분야가 비어 있는지가 한눈에 보여야 한다. */}
          <ul className="mt-4 space-y-2.5 border-t border-stone pt-3">
            {TASK_GOALS.map((goal) => {
              const count = sumCounts(TASKS.filter((t) => t.goal === goal.goal));
              return (
                <li key={goal.goal}>
                  <a href={`#goal-${goal.goal}`} className="block">
                    <span className="flex items-baseline justify-between gap-2 text-[12px]">
                      <span className="font-semibold text-ink">
                        {goal.goal}. {goal.title}
                      </span>
                      <span className="tabular shrink-0 text-ash">
                        {count.done + count.underway}/{count.total}
                      </span>
                    </span>
                    <span className="mt-1 block">
                      <PledgeBar count={count} size="sm" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <StatusGuide />
        </section>

        {tracked.length > 0 && (
          <section aria-labelledby="tasks-tracked" className="mt-9">
            <h2 id="tasks-tracked" className="text-[17px] font-bold tracking-tight text-ink">
              근거로 확인한 진행 <span className="tabular">{tracked.length}</span>건
            </h2>
            <ul className="mt-3 space-y-2.5">
              {tracked.map(({ task, c }) => (
                <li key={`${task.no}-${c.label}`}>
                  <TrackedLine
                    line={{ ...c, text: c.label }}
                    kicker={`국정과제 ${task.no} · ${task.title}`}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {TASK_GOALS.map((goal) => (
          <section
            key={goal.goal}
            id={`goal-${goal.goal}`}
            aria-labelledby={`goal-${goal.goal}-title`}
            className="mt-10 scroll-mt-20"
          >
            <p className="text-[11px] font-bold text-navy">국정목표 {goal.goal}</p>
            <h2
              id={`goal-${goal.goal}-title`}
              className="mt-0.5 text-[19px] font-bold tracking-tight text-ink"
            >
              {goal.title}
            </h2>
            {goal.strategies.map((strategy) => {
              const tasks = TASKS.filter(
                (t) => t.goal === goal.goal && t.strategy === strategy.no,
              );
              return (
                <div key={strategy.no} className="mt-5">
                  <h3 className="text-[13px] font-bold text-smoke">
                    추진전략 {strategy.no} · {strategy.title}
                  </h3>
                  <ol className="mt-2 space-y-2">
                    {tasks.map((task) => (
                      <li key={task.no}>
                        <TaskRow task={task} />
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </section>
        ))}

        <p className="mt-10 border-t border-stone pt-4 text-[11px] leading-relaxed text-ash">
          출처: {TASKS_SOURCE.publisher} 『{TASKS_SOURCE.title}』. 과제 문장은 원문 그대로이며,
          PDF 자간 때문에 낱말 가운데 끼어든 공백만 지웠습니다.
        </p>
      </main>

      <BottomNav />
    </>
  );
}

function TaskRow({ task }: { task: ResolvedTask }) {
  const { count } = task;
  return (
    <Link
      href={`/tasks/${task.no}`}
      className="block rounded-card border border-stone bg-taupe px-4 py-3 transition-colors hover:border-graphite"
    >
      <div className="flex items-center gap-2">
        <span className="tabular grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-navy px-1 text-[10px] font-bold text-white">
          {task.no}
        </span>
        <span className="truncate text-[10px] font-bold text-navy">{task.ministry}</span>
        <span aria-hidden="true" className="ml-auto text-[13px] text-ash">
          →
        </span>
      </div>
      <p className="mt-1.5 text-[14px] font-bold leading-snug text-ink">{task.title}</p>
      <div className="mt-2.5">
        <PledgeBar count={count} size="sm" />
      </div>
      <p className="mt-1.5 text-[11px] text-ash">
        주요내용 <span className="tabular">{count.total}</span>개 · 시행{" "}
        <span className="tabular">{count.done}</span> · 추진 중{" "}
        <span className="tabular">{count.underway}</span> · 확인 전{" "}
        <span className="tabular">{count.untracked}</span>
      </p>
    </Link>
  );
}
