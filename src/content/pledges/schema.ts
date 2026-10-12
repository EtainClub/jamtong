import { z } from "zod";

/**
 * 제21대 대통령선거 공약과 그 이행 추적.
 *
 * 공약 문장은 선거공약서 원문을 옮긴 것이다. 고쳐 쓰지 않는다 — 요약하는 순간
 * "무엇을 약속했는가"가 우리 문장이 된다.
 *
 * ★ 이행 상태는 근거가 있을 때만 단다.
 *   `track.ref`는 위키 앵커와 같은 문법이다(`<업적slug>#<claimId>`,
 *   `policy:<slug>#<claimId>`). 그 claim이 실재하지 않으면 빌드가 멈춘다
 *   (evidence.ts). 근거를 잇지 못한 항목은 "확인 전"으로 남는다 —
 *   "하지 않았다"가 아니라 "이 사이트가 아직 확인하지 못했다"는 뜻이다.
 *
 * ★ 시행과 추진을 한 칸에 세지 않는다.
 *   done      효력이 생긴 것 — 법이 시행됐거나 제도가 실제로 시작됐다.
 *   underway  발표·법 통과·협약까지 왔지만 아직 효력이 없거나, 항목의 일부만 효력이
 *             있거나, 단계적으로 가는 중. note에 무엇이 되고 무엇이 남았는지 적는다.
 */

export const PledgeTrackStatus = z.enum(["done", "underway"]);
export type PledgeTrackStatus = z.infer<typeof PledgeTrackStatus>;

export const pledgeTrackSchema = z.object({
  status: PledgeTrackStatus,
  /** 위키 앵커 형식. claim까지 가리켜야 한다. */
  ref: z.string().regex(/#/, "track.ref는 claim까지 가리켜야 한다"),
  /** 공약 문장과 근거 사이를 잇는 한 줄. 근거 claim에 있는 내용만 적는다. */
  note: z.string(),
});
export type PledgeTrack = z.infer<typeof pledgeTrackSchema>;

export const pledgeLineSchema = z.object({
  text: z.string(),
  track: pledgeTrackSchema.optional(),
});
export type PledgeLine = z.infer<typeof pledgeLineSchema>;

/** 원문의 ○ 한 줄. 아래에 - 줄이 있으면 subs, 없으면 그 자체가 하나의 항목이다. */
export const pledgeItemSchema = pledgeLineSchema.extend({
  subs: z.array(pledgeLineSchema).default([]),
});
export type PledgeItem = z.infer<typeof pledgeItemSchema>;

export const pledgeSchema = z
  .object({
    rank: z.number().int().min(1),
    title: z.string(),
    field: z.string(),
    goals: z.array(z.string()).min(1),
    items: z.array(pledgeItemSchema).min(1),
    /** 공통 이행기간·재원 문구 말고 이 공약에만 덧붙은 것. */
    extraSchedule: z.array(z.string()).default([]),
    extraFunding: z.array(z.string()).default([]),
  })
  .superRefine((pledge, ctx) => {
    for (const item of pledge.items) {
      // 아래 줄이 있으면 셈의 단위는 아래 줄이다. 윗줄에 상태를 달면 두 번 센다.
      if (item.track && item.subs.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: `공약 ${pledge.rank} "${item.text}": 아래 줄이 있는 항목에는 track을 달지 않는다`,
        });
      }
    }
  });

export type Pledge = z.infer<typeof pledgeSchema>;
export type PledgeInput = z.input<typeof pledgeSchema>;
