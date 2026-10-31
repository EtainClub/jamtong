import { z } from "zod";

import {
  DatePrecision,
  MilestoneStatus,
  claimSchema,
  sourceSchema,
  type Claim,
  type Source,
} from "@/content/schema";

/**
 * 이재명 정부 출범일.
 *
 * 카르텔 화면은 이 정부가 한 일만 모은다. 성남시장·경기도지사 시절의 일은
 * 업적에 있다. 같은 표적 아래 섞으면 "이 정부가 무엇을 깼는가"와 "이 사람이
 * 예전에 무엇을 했는가"가 한 막대에 합쳐져, 진행 정도가 부풀려 읽힌다.
 * 조치와 성과 카드의 날짜가 이보다 앞서면 빌드가 멈춘다.
 */
export const GOV_START = "2025-06-04";

/**
 * 카르텔 — 업적을 가로질러 보는 두 번째 축.
 *
 * ★ 분야가 아니다.
 *   `AchievementCategory`의 여섯(외교·제도·복지·지역·경제·재난)은 **분야**이고,
 *   거기에는 "묶는 축은 하나만 고른다"는 규칙이 붙어 있다. 카르텔은 분야가
 *   아니라 **표적**이다 — 정유사는 경제이면서 카르텔이고 전관예우는 제도이면서
 *   카르텔이다. 같은 enum에 넣으면 "분야별 건수"가 무슨 뜻인지 말할 수 없게
 *   된다. 그래서 따로 둔다.
 *
 * ★ 카르텔은 제 주장을 거의 갖지 않는다.
 *   이 자료형이 하는 일은 대부분 **모으는 것**이다. 깊이는 업적에 있고,
 *   진행과 계획은 성과 카드에 있다. 여기서 새로 만드는 문장은 "무엇이
 *   문제인가" 몇 줄뿐이고, 그 몇 줄에도 근거를 단다. 모으는 자리에서 주장이
 *   늘어나기 시작하면 근거 없는 서술이 가장 쉽게 끼어든다.
 *
 * ★ 열둘은 정부의 분류가 아니다.
 *   출발점이 된 지지자 카드뉴스의 묶음이다. 대통령이 담합을 두고 이름을 댄
 *   분야는 설탕·밀가루·육고기·교복·부동산 다섯이고 그 목록과 겹치지 않는다.
 *   그래서 화면이 "이 묶음은 이 위키가 지은 것"이라고 늘 밝힌다.
 *   (docs/achievements/cartel.md)
 *
 * ★ 비어 있는 것은 비어 있다고 적는다.
 *   열두 갈래 중 자료가 선 것은 절반이다. 빈 것을 목록에서 지우면 무엇을 아직
 *   못 했는지가 보이지 않는다. 자서전 여섯 권과 같은 처리를 한다.
 */

/**
 * 무엇이 문제인가. 한 줄마다 근거를 단다.
 *
 * ★ 카드에 크게 세우는 말은 원문에서 그대로 떼어 온다.
 *   `headline`과 `tags`는 화면에서 가장 크게, 가장 먼저 읽히는 자리다. 거기에
 *   편집자가 고쳐 쓴 말이 들어가면 근거가 붙지 않은 문장이 가장 눈에 띄는
 *   자리를 차지하게 된다. 그래서 둘 다 걸린 claim의 원문에 글자 그대로 있어야
 *   하고, `validateCartel`이 빌드에서 그것을 검사한다.
 */
export const cartelProblemSchema = z.object({
  id: z.string(),
  text: z.string(),
  claimId: z.string(),
  /** 카드 머리에 세우는 한 마디. 원문에서 떼어 온 짧은 조각. */
  headline: z.string().optional(),
  /** 이 문장이 이름 댄 것들. 원문에 있는 낱말만. */
  tags: z.array(z.string()).default([]),
  /**
   * 칩을 나열로 볼지 거쳐 가는 단계로 볼지.
   *
   * 좌표가 아니라 뜻이다 — 「설탕·밀가루·육고기」는 나열이고
   * 「도로공사 → 운영업체 → 입점매장」은 단계다. 둘을 같은 모양으로 그리면
   * 순서가 있는 것과 없는 것이 구별되지 않는다.
   */
  tagKind: z.enum(["list", "steps"]).default("list"),
});
export type CartelProblem = z.infer<typeof cartelProblemSchema>;

/**
 * 업적이 근거를 들고 있는 조치 하나.
 *
 * 성과 카드는 제 상태를 들고 있어 그대로 센다. 업적은 여러 조치를 한데 담고
 * 있어서(사법개혁 3법은 셋이 서로 다른 날 효력이 생긴다) 업적 하나를 한 칸으로
 * 세면 진행 정도가 뭉개진다. 그래서 조치 단위로 꺼내 상태를 따로 단다.
 *
 * `ref`는 위키 앵커와 같은 문법 `<업적slug>#<claimId>`이고, 그 업적은 이
 * 카르텔의 `achievementSlugs`에 있어야 한다.
 */
export const cartelMeasureSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: MilestoneStatus,
  date: z.string(),
  datePrecision: DatePrecision,
  ref: z.string().regex(/^[a-z0-9-]+#[\w-]+$/, "조치 ref는 <업적slug>#<claimId>"),
  /** 무엇이 됐고 무엇이 남았는지. 근거 claim에 있는 내용만 적는다. */
  note: z.string().optional(),
});
export type CartelMeasure = z.infer<typeof cartelMeasureSchema>;

export const cartelSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "카르텔 슬러그는 ascii 소문자와 하이픈만"),
  /** 화면에 적는 이름. "통신". 뒤에 '카르텔'은 화면이 붙인다. */
  name: z.string(),
  /** 목록 카드의 한 줄. 평가하지 않고 무엇을 다루는 자리인지까지만. */
  summary: z.string(),
  problems: z.array(cartelProblemSchema).default([]),
  /** 깊이 다룬 업적. slug로 건다. */
  achievementSlugs: z.array(z.string()).default([]),
  /** 진행 중·계획. 성과 카드 id로 건다. 상태는 카드가 들고 있다. */
  milestoneIds: z.array(z.string()).default([]),
  /** 업적이 근거를 들고 있는 조치. 진행 막대에 성과 카드와 함께 센다. */
  measures: z.array(cartelMeasureSchema).default([]),
  /**
   * 아직 확인하지 못한 것.
   *
   * 빈 칸을 숨기지 않는 이 위키의 방식을 카르텔에서도 그대로 쓴다. 무엇을
   * 못 찾았는지 적어 두면 다음에 여는 사람이 거기서부터 시작한다.
   */
  openQuestions: z.array(z.string()).default([]),
  sourceNote: z.string().optional(),
});
export type Cartel = z.infer<typeof cartelSchema>;
export type CartelInput = z.input<typeof cartelSchema>;

/** 카르텔 하나와 그 근거. 업적처럼 제 근거를 곁에 둔다. */
export interface CartelEntry {
  cartel: Cartel;
  claims: Claim[];
  sources: Source[];
}

/**
 * 열린 카르텔인가.
 *
 * 상태를 필드로 두지 않는다. `status: "open"`이라고 적어 놓고 내용이 비면
 * 그 필드가 거짓말을 한다. 담을 것이 하나라도 있으면 열린 것이다.
 */
export function isOpen(cartel: Cartel): boolean {
  return (
    cartel.problems.length > 0 ||
    cartel.achievementSlugs.length > 0 ||
    cartel.milestoneIds.length > 0 ||
    cartel.measures.length > 0
  );
}

/**
 * 참조 무결성. 빌드에서 깨진다.
 *
 * 업적 slug와 성과 카드 id는 다른 파일에 있으므로 여기서 이름만 받아 견준다 —
 * 이 모듈이 업적 레지스트리를 import하면 카르텔 하나 때문에 업적 스물둘이
 * 통째로 딸려 온다.
 */
export function validateCartel(
  entry: CartelEntry,
  known: {
    achievementSlugs: Set<string>;
    milestoneIds: Set<string>;
    /** 성과 카드 id → 날짜. 정부 출범 전 카드를 막는 데 쓴다. */
    milestoneDates: Map<string, string>;
    /** "<업적slug>#<claimId>" 꼴로 실재하는 검증된 claim. */
    achievementClaimRefs: Set<string>;
  },
): string[] {
  const errors: string[] = [];
  const { cartel } = entry;
  const where = `cartel "${cartel.slug}"`;

  const claimById = new Map(entry.claims.map((c) => [c.id, c]));
  const sourceIds = new Set(entry.sources.map((s) => s.id));

  for (const claim of entry.claims) {
    for (const sid of claim.sourceIds) {
      if (!sourceIds.has(sid)) {
        errors.push(`${where} claim "${claim.id}" → 존재하지 않는 source "${sid}"`);
      }
    }
    if (claim.assertionType === "CLAIM" && !claim.assertedBy) {
      errors.push(`${where} claim "${claim.id}" → CLAIM인데 assertedBy가 없다`);
    }
    /* 카르텔은 모으는 자리다. 미검증 주장을 여기서 새로 만들지 않는다. */
    if (!claim.verified) {
      errors.push(`${where} claim "${claim.id}" → 미검증 주장은 카르텔에 둘 수 없다`);
    }
  }

  for (const problem of cartel.problems) {
    const claim = claimById.get(problem.claimId);
    if (!claim) {
      errors.push(`${where} problem "${problem.id}" → 존재하지 않는 claim "${problem.claimId}"`);
      continue;
    }

    /*
     * 카드에 크게 세운 말이 원문에 있는가.
     *
     * 화면에서 가장 먼저 읽히는 자리에 편집자가 고쳐 쓴 말이 들어가면, 근거가
     * 붙지 않은 문장이 가장 눈에 띄는 자리를 차지하게 된다. 띄어쓰기만 고르고
     * 글자는 그대로여야 한다.
     */
    const original = claim.text.replace(/\s+/g, " ");
    const shown = [problem.headline, ...problem.tags].filter(
      (piece): piece is string => Boolean(piece),
    );
    for (const piece of shown) {
      if (!original.includes(piece.replace(/\s+/g, " "))) {
        errors.push(
          `${where} problem "${problem.id}" → 카드에 세운 "${piece}"가 근거 원문에 없다`,
        );
      }
    }
  }

  for (const slug of cartel.achievementSlugs) {
    if (!known.achievementSlugs.has(slug)) {
      errors.push(`${where} → 존재하지 않는 업적 "${slug}"`);
    }
  }

  for (const id of cartel.milestoneIds) {
    if (!known.milestoneIds.has(id)) {
      errors.push(`${where} → 존재하지 않는 성과 카드 "${id}"`);
    }
    const date = known.milestoneDates.get(id);
    if (date && date < GOV_START) {
      errors.push(`${where} → 성과 카드 "${id}"(${date})는 정부 출범(${GOV_START}) 전 일이다`);
    }
  }

  for (const measure of cartel.measures) {
    const owner = measure.ref.split("#")[0];
    if (!cartel.achievementSlugs.includes(owner)) {
      errors.push(`${where} 조치 "${measure.id}" → 업적 "${owner}"가 achievementSlugs에 없다`);
    }
    if (!known.achievementClaimRefs.has(measure.ref)) {
      errors.push(`${where} 조치 "${measure.id}" → 없거나 검증되지 않은 근거 "${measure.ref}"`);
    }
    if (measure.date < GOV_START) {
      errors.push(`${where} 조치 "${measure.id}"(${measure.date})는 정부 출범(${GOV_START}) 전 일이다`);
    }
  }

  /* 쓰이지 않는 근거는 조용히 쌓인다. 어디에도 안 걸린 claim은 실수다. */
  const used = new Set(cartel.problems.map((p) => p.claimId));
  for (const claim of entry.claims) {
    if (!used.has(claim.id)) {
      errors.push(`${where} claim "${claim.id}" → 어느 문장에도 걸리지 않았다`);
    }
  }

  return errors;
}

export { claimSchema, sourceSchema };
