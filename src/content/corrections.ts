import { z } from "zod";

/**
 * 정정 기록 — 실린 내용을 고친 것을 공개로 남긴다.
 *
 * ★ 기준 자료는 틀린 적이 없는 자료가 아니다.
 *   고친 자리를 숨기지 않는 자료다. 무엇을, 언제, 왜 고쳤는지가 보여야
 *   읽는 사람이 지금 실린 것을 믿을 수 있다.
 *
 * ★ 정정만 적는다.
 *   새 업적을 더하거나 문장을 다듬은 것은 여기에 오지 않는다. 사실이 틀렸거나
 *   출처가 맞지 않았거나 반론을 더 실은 것 — 앞서 실린 것이 달라진 경우만.
 *   모든 수정은 저장소 기록에 이미 있다(`REPO_HISTORY_URL`).
 *
 * ★ 2026-11-01부터 적는다.
 *   그 전의 수정은 이 형식으로 모으지 않았다. 지어서 채우지 않고, 저장소
 *   기록으로 안내한다.
 */

export const CORRECTIONS_SINCE = "2026-11-01";
export const REPO_HISTORY_URL = "https://github.com/EtainClub/jamtong/commits/main/src/content";

export const CorrectionKind = z.enum([
  "fact", //      사실이 틀렸다
  "source", //    출처가 맞지 않았거나 바뀌었다
  "counter", //   반론·한계를 더 실었다
  "status", //    진행 상태를 바로잡았다
  "removed", //   내렸다
]);
export type CorrectionKind = z.infer<typeof CorrectionKind>;

export const CORRECTION_KIND_LABEL: Record<CorrectionKind, string> = {
  fact: "사실 정정",
  source: "출처 정정",
  counter: "반론 추가",
  status: "상태 정정",
  removed: "내림",
};

export const correctionSchema = z.object({
  id: z.string(),
  /** 고친 날 (YYYY-MM-DD). */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** 고친 화면의 경로. `/achievement/…`처럼 사이트 안 주소. */
  page: z.string().startsWith("/"),
  kind: CorrectionKind,
  /** 무엇이었고 무엇으로 바꿨는지. 한두 문장. */
  summary: z.string().min(1),
  /** 왜 고쳤는지. 근거가 있으면 근거를 적는다. */
  reason: z.string().min(1),
  /** 정정·반론 창구로 접수된 것인지. */
  reported: z.boolean().default(false),
  /** 고친 커밋. 있으면 바뀐 줄을 바로 볼 수 있다. */
  commit: z.string().regex(/^[0-9a-f]{7,40}$/).optional(),
});
export type Correction = z.infer<typeof correctionSchema>;

/** 새것이 위로 오게 적지 않아도 된다. 화면이 날짜로 정렬한다. */
const RAW: z.input<typeof correctionSchema>[] = [];

export const CORRECTIONS: Correction[] = z
  .array(correctionSchema)
  .parse(RAW)
  .sort((a, b) => b.date.localeCompare(a.date));

export function correctionsFor(page: string): Correction[] {
  return CORRECTIONS.filter((c) => c.page === page);
}

export function validateCorrections(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const c of CORRECTIONS) {
    if (ids.has(c.id)) errors.push(`정정 ${c.id} — id가 겹친다`);
    ids.add(c.id);
    if (c.date < CORRECTIONS_SINCE) errors.push(`정정 ${c.id} — ${CORRECTIONS_SINCE} 전 날짜다`);
    if (c.date > new Date().toISOString().slice(0, 10)) errors.push(`정정 ${c.id} — 앞날 날짜다`);
  }
  return errors;
}
