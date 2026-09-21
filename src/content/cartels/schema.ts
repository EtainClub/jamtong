import { z } from "zod";

import { claimSchema, sourceSchema, type Claim, type Source } from "@/content/schema";

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

/** 무엇이 문제인가. 한 줄마다 근거를 단다. */
export const cartelProblemSchema = z.object({
  id: z.string(),
  text: z.string(),
  claimId: z.string(),
});
export type CartelProblem = z.infer<typeof cartelProblemSchema>;

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
    cartel.milestoneIds.length > 0
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
  known: { achievementSlugs: Set<string>; milestoneIds: Set<string> },
): string[] {
  const errors: string[] = [];
  const { cartel } = entry;
  const where = `cartel "${cartel.slug}"`;

  const claimIds = new Set(entry.claims.map((c) => c.id));
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
    if (!claimIds.has(problem.claimId)) {
      errors.push(`${where} problem "${problem.id}" → 존재하지 않는 claim "${problem.claimId}"`);
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
