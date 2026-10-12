import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  TASKS,
  TASKS_SOURCE,
  getTask,
  goalTitle,
  strategyTitle,
  type ResolvedTaskContent,
} from "@/content/tasks";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { PledgeBar, PledgeLegend } from "@/features/pledges/PledgeProgress";
import { EvidenceDetails, StatusChip } from "@/features/pledges/TrackedLine";

export function generateStaticParams() {
  return TASKS.map((task) => ({ no: String(task.no) }));
}

/** "007"이나 "7.0" 같은 주소로 같은 과제가 여러 번 열리지 않게 정확한 숫자만 받는다. */
function parseNo(raw: string): number | undefined {
  return /^[1-9]\d{0,2}$/.test(raw) ? Number(raw) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  const task = getTask(parseNo(no) ?? 0);
  if (!task) return {};
  return {
    title: `국정과제 ${task.no}. ${task.title}`,
    description: `${task.ministry} 주관 · ${task.objectives.join(" ")}`.slice(0, 160),
    alternates: { canonical: `/tasks/${task.no}` },
  };
}

/**
 * 국정과제 하나.
 *
 * 원문 순서(과제목표 → 주요내용 → 기대효과)를 그대로 두고, 주요내용마다 상태를 붙인다.
 * 근거가 있는 줄만 근거를 펼칠 수 있다.
 */
export default async function TaskPage({ params }: { params: Promise<{ no: string }> }) {
  const { no } = await params;
  const task = getTask(parseNo(no) ?? 0);
  if (!task) notFound();

  const prev = getTask(task.no - 1);
  const next = getTask(task.no + 1);

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <Link href="/tasks" className="text-[12px] font-medium text-navy">
          <span aria-hidden="true">←</span> 123대 국정과제
        </Link>

        <p className="mt-4 text-[11px] font-bold text-navy">
          국정목표 {task.goal} {goalTitle(task.goal)} · 추진전략 {task.strategy}{" "}
          {strategyTitle(task.goal, task.strategy)}
        </p>
        <div className="mt-2 flex items-start gap-2.5">
          <span className="tabular mt-0.5 grid h-8 min-w-8 shrink-0 place-items-center rounded-full bg-navy px-1.5 text-[13px] font-bold text-white">
            {task.no}
          </span>
          <h1 className="text-[22px] font-semibold leading-snug tracking-[-0.02em] text-ink">
            {task.title}
          </h1>
        </div>
        <p className="mt-2 text-[12px] text-ash">주관 {task.ministry}</p>

        <div className="mt-4 rounded-card border border-stone bg-taupe px-4 py-3">
          <PledgeBar count={task.count} />
          <div className="mt-2">
            <PledgeLegend count={task.count} />
          </div>
        </div>

        <section aria-labelledby="task-objectives" className="mt-7">
          <h2 id="task-objectives" className="text-[14px] font-bold text-ink">
            과제목표
          </h2>
          <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-ink">
            {task.objectives.map((o) => (
              <li key={o}>· {o}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="task-contents" className="mt-7">
          <h2 id="task-contents" className="text-[14px] font-bold text-ink">
            주요내용
          </h2>
          <ol className="mt-3 space-y-3">
            {task.contents.map((c) => (
              <li key={c.label}>
                <ContentRow c={c} />
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="task-effects" className="mt-7">
          <h2 id="task-effects" className="text-[14px] font-bold text-ink">
            기대효과
          </h2>
          <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-smoke">
            {task.effects.map((e) => (
              <li key={e}>· {e}</li>
            ))}
          </ul>
        </section>

        <nav aria-label="다른 국정과제" className="mt-10 grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/tasks/${prev.no}`}
              className="rounded-card border border-stone bg-taupe px-3 py-2.5 text-[12px] text-smoke hover:border-graphite"
            >
              <span aria-hidden="true">←</span> {prev.no}. {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/tasks/${next.no}`}
              className="rounded-card border border-stone bg-taupe px-3 py-2.5 text-right text-[12px] text-smoke hover:border-graphite"
            >
              {next.no}. {next.title} <span aria-hidden="true">→</span>
            </Link>
          )}
        </nav>

        <p className="mt-6 text-[11px] leading-relaxed text-ash">
          출처:{" "}
          <a
            href={TASKS_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {TASKS_SOURCE.publisher} 『{TASKS_SOURCE.title}』
          </a>
        </p>
      </main>

      <BottomNav />
    </>
  );
}

/** 주요내용 한 줄. 소제목 → 본문 → 하위 줄 → 주석, 그리고 근거가 있으면 상태 설명. */
function ContentRow({ c }: { c: ResolvedTaskContent }) {
  const tracked = Boolean(c.evidence);
  return (
    <div
      className={`rounded-card border px-4 py-3 ${
        tracked ? "border-stone bg-taupe" : "border-transparent bg-transparent px-0 py-0"
      }`}
    >
      <div className="flex items-start gap-2">
        <StatusChip line={c} />
        <p className="text-[13px] leading-snug">
          <strong className="font-semibold text-ink">{c.label}</strong>{" "}
          <span className="text-smoke">{c.text}</span>
        </p>
      </div>
      {c.subs.length > 0 && (
        <ul className="mt-1.5 space-y-1 border-l border-stone pl-3 text-[12px] leading-relaxed text-smoke">
          {c.subs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
      {c.notes.length > 0 && (
        <ul className="mt-1.5 space-y-0.5 text-[11px] leading-relaxed text-ash">
          {c.notes.map((n) => (
            <li key={n}>※ {n}</li>
          ))}
        </ul>
      )}
      {c.note && (
        <p className="mt-2 border-t border-stone pt-2 text-[12px] leading-relaxed text-ink">
          {c.note}
        </p>
      )}
      {c.evidence && <EvidenceDetails evidence={c.evidence} />}
    </div>
  );
}
