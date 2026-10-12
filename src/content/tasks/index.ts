import {
  countLines,
  resolveEvidence,
  type ResolvedLine,
  type StatusCount,
} from "@/content/pledges";
import { pledgeTrackSchema } from "@/content/pledges/schema";
import { POLICIES } from "@/content/policies";
import type { Source } from "@/content/schema";

import raw from "./tasks-123.json";
import { tasksFileSchema, type Task, type TaskContent, type TaskGoal } from "./schema";
import { TASK_TRACKS } from "./tracks";

export type { Task, TaskGoal };

/**
 * 123대 국정과제와 그 이행 추적.
 *
 * 스키마 검사와 근거 해석은 모듈을 불러올 때 한 번 한다. 원문 데이터가 깨졌거나
 * 이행 표시가 없는 과제·소제목·claim을 가리키면 빌드가 멈춘다.
 */

const file = tasksFileSchema.parse(raw);

export const TASKS_SOURCE: Source = {
  id: "src-tasks-123",
  title: file.source.title,
  url: file.source.url,
  publisher: file.source.publisher,
  type: "official",
  license: "public",
};

export const TASK_GOALS: TaskGoal[] = file.goals;

export interface ResolvedTaskContent extends ResolvedLine {
  label: string;
  subs: string[];
  notes: string[];
}

export interface ResolvedTask extends Omit<Task, "contents"> {
  contents: ResolvedTaskContent[];
  count: StatusCount;
}

const trackKeys = new Set(Object.keys(TASK_TRACKS));

function resolveContent(no: number, c: TaskContent): ResolvedTaskContent {
  const key = `${no}:${c.label}`;
  const base = { label: c.label, text: c.text, subs: c.subs, notes: c.notes };
  const input = TASK_TRACKS[key];
  if (!input) return { ...base, status: "untracked" };
  trackKeys.delete(key);
  const track = pledgeTrackSchema.parse(input);
  return { ...base, status: track.status, note: track.note, evidence: resolveEvidence(track.ref) };
}

export const TASKS: ResolvedTask[] = file.tasks.map((task) => {
  const contents = task.contents.map((c) => resolveContent(task.no, c));
  return { ...task, contents, count: countLines(contents) };
});

if (trackKeys.size > 0) {
  throw new Error(`국정과제 이행 표시가 없는 과제·소제목을 가리킨다: ${[...trackKeys].join(", ")}`);
}

export function getTask(no: number): ResolvedTask | undefined {
  return TASKS[no - 1];
}

export function sumCounts(tasks: { count: StatusCount }[]): StatusCount {
  return tasks.reduce<StatusCount>(
    (acc, t) => ({
      done: acc.done + t.count.done,
      underway: acc.underway + t.count.underway,
      untracked: acc.untracked + t.count.untracked,
      total: acc.total + t.count.total,
    }),
    { done: 0, underway: 0, untracked: 0, total: 0 },
  );
}

export function goalTitle(goal: number): string {
  return TASK_GOALS.find((g) => g.goal === goal)?.title ?? "";
}

export function strategyTitle(goal: number, strategy: number): string {
  return TASK_GOALS.find((g) => g.goal === goal)?.strategies.find((s) => s.no === strategy)?.title ?? "";
}

/** 이행 표시가 기대는 정책 페이지의 기준일 가운데 가장 늦은 날. */
export function tasksAsOf(): string {
  const used = new Set(
    TASKS.flatMap((t) => t.contents)
      .map((c) => c.evidence?.ref.split("#")[0])
      .filter((owner): owner is string => Boolean(owner?.startsWith("policy:"))),
  );
  return (
    POLICIES.filter((p) => used.has(`policy:${p.slug}`))
      .map((p) => p.asOf)
      .sort()
      .at(-1) ?? ""
  );
}
