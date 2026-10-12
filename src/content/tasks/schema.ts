import { z } from "zod";

/**
 * 이재명정부 123대 국정과제.
 *
 * `tasks-123.json`은 정부가 낸 국정과제 PDF에서 과제마다 과제목표·주요내용·기대효과를
 * 글꼴(소제목·본문·하위 줄)로 갈라 옮긴 것이다. 문장은 원문 그대로이고, PDF 자간 때문에
 * 낱말 가운데 끼어든 공백만 지웠다. 원문의 *표 주석은 notes에 따로 둔다.
 *
 * 셈의 단위는 주요내용 한 줄(• 소제목)이다. 과제 하나에 서너 개의 일이 들어 있어서,
 * 그중 하나가 됐다고 과제 전체를 이행으로 세면 부풀린 셈이 된다 — 공약과 같은 원칙.
 */

export const taskContentSchema = z.object({
  /** 원문의 굵은 소제목. 이행 표시의 열쇠이기도 하다. */
  label: z.string().min(1),
  text: z.string(),
  subs: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
});
export type TaskContent = z.infer<typeof taskContentSchema>;

export const taskSchema = z.object({
  no: z.number().int().min(1).max(123),
  goal: z.number().int().min(1).max(5),
  strategy: z.number().int().min(1),
  title: z.string().min(1),
  ministry: z.string().min(1),
  objectives: z.array(z.string()).min(1),
  contents: z.array(taskContentSchema).min(1),
  effects: z.array(z.string()).min(1),
});
export type Task = z.infer<typeof taskSchema>;

export const taskGoalSchema = z.object({
  goal: z.number().int(),
  title: z.string(),
  strategies: z.array(z.object({ no: z.number().int(), title: z.string() })).min(1),
});
export type TaskGoal = z.infer<typeof taskGoalSchema>;

export const tasksFileSchema = z
  .object({
    source: z.object({ title: z.string(), publisher: z.string(), url: z.string().url() }),
    goals: z.array(taskGoalSchema).length(5),
    tasks: z.array(taskSchema).length(123),
  })
  .superRefine((file, ctx) => {
    file.tasks.forEach((task, i) => {
      if (task.no !== i + 1) {
        ctx.addIssue({ code: "custom", message: `국정과제 ${i + 1}번 자리에 ${task.no}번이 있다` });
      }
      const goal = file.goals.find((g) => g.goal === task.goal);
      if (!goal?.strategies.some((s) => s.no === task.strategy)) {
        ctx.addIssue({ code: "custom", message: `국정과제 ${task.no}: 없는 추진전략 ${task.goal}-${task.strategy}` });
      }
      const labels = new Set<string>();
      for (const c of task.contents) {
        if (labels.has(c.label)) {
          ctx.addIssue({ code: "custom", message: `국정과제 ${task.no}: 소제목 "${c.label}"이 두 번 나온다` });
        }
        labels.add(c.label);
      }
    });
  });
