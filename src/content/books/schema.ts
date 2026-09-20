import { z } from "zod";

/**
 * 자서전 — 본인이 쓴 책.
 *
 * 언행과도 업적과도 다른 자료다. 업적은 남이 확인해 준 사실이고, 언행은 짧은
 * 글 한 편이 통째로 원문이다. 책은 둘 다 아니다 — **길고, 저작물이고, 전문을
 * 실을 수 없다.**
 *
 * 그래서 세 가지를 지킨다.
 *
 * ★ 전문을 싣지 않는다.
 *   챕터마다 우리가 옮긴 요약을 두고, 원문은 **인용 범위 안의 발췌**만 싣는다.
 *   발췌가 없으면 그 챕터는 "요약만 있는 챕터"라고 화면이 밝힌다.
 *
 * ★ 옮긴 토막에는 옮긴 자리를 붙인다.
 *   발췌를 실은 챕터에서는 쉽게 보기의 각 토막이 발췌의 어느 대목을 옮긴
 *   것인지 그대로 붙인다. 붙인 문장이 발췌에 없으면 빌드가 깨진다. 언행의
 *   규율을 그대로 가져온다.
 *
 * ★ 읽고 끝나지 않게 한다.
 *   이 섹션의 목적은 독후감이 아니다. 챕터마다 **읽은 사람이 할 수 있는 일**을
 *   적는다. 행동이 하나도 없는 챕터는 공개되지 않는다 — 스키마가 막는다.
 */

/** 표지. 실제 표지 그림은 저작물이라 쓰지 않는다. 색으로만 가른다. */
export const bookToneSchema = z.enum(["ink", "clay", "moss", "dusk", "rust", "slate"]);
export type BookTone = z.infer<typeof bookToneSchema>;

/** 언제 하는 일인지. 목록에서 이 순서로 묶어 보인다. */
export const actionHorizonSchema = z.enum(["today", "week", "always"]);
export type ActionHorizon = z.infer<typeof actionHorizonSchema>;

export const HORIZON_LABEL: Record<ActionHorizon, string> = {
  today: "오늘",
  week: "이번 주",
  always: "늘",
};

/**
 * 행동 지침 — 이 섹션의 핵심.
 *
 * 책을 읽고 "좋은 말이네"로 끝나지 않게 하는 자리다. 그래서 규칙이 둘 있다.
 *
 *   1. 주어가 읽는 사람이어야 한다. "정부가 ~한다"는 행동 지침이 아니다.
 *   2. 오늘 할 수 있는 크기여야 한다. "깨어 있는 시민이 되자"는 지침이 아니다.
 *
 * 둘 다 기계가 검사할 수 없다. 대신 형식으로 좁힌다 — 한 줄 제목은 동사로
 * 끝나고, 왜 하는지는 detail에 따로 적는다.
 */
export const actionItemSchema = z.object({
  id: z.string(),
  /** 무엇을 할지. 동사로 끝나는 한 줄. */
  title: z.string().min(2),
  /** 왜 하는지, 어떻게 하는지. 두세 문장. */
  detail: z.string().min(2),
  horizon: actionHorizonSchema,
  /**
   * 눌러서 갈 곳. 사이트 안(`/achievement/...`, `/wiki/...`)이나 바깥 주소.
   * 행동을 권하면서 갈 곳을 주지 않으면 절반만 한 것이다.
   */
  link: z
    .object({ label: z.string(), href: z.string().min(1) })
    .optional(),
});
export type ActionItem = z.infer<typeof actionItemSchema>;

/** 쉽게 보기의 한 토막. 언행의 것과 같은 모양이되 quote가 선택이다. */
export const bookPointSchema = z.object({
  id: z.string(),
  title: z.string(),
  say: z.string(),
  /**
   * 옮긴 자리의 발췌. 챕터에 excerpt가 있으면 **그 안에 그대로** 있어야 한다.
   * 발췌를 싣지 못한 챕터에서는 비워 둔다 — 없는 원문을 가리키게 할 수는 없다.
   */
  quote: z.string().optional(),
});
export type BookPoint = z.infer<typeof bookPointSchema>;

export const chapterSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "챕터 슬러그는 ascii 소문자와 하이픈만"),
  /** 책 안에서의 순서. 1부터 빈틈없이. */
  order: z.number().int().positive(),
  title: z.string(),
  /** 목록에 적는 한 줄. */
  summary: z.string(),
  /** 읽는 데 걸리는 시간(분). 목록에 적는다. */
  minutes: z.number().int().positive(),
  easy: z.object({
    lead: z.string(),
    points: z.array(bookPointSchema).min(1),
  }),
  /**
   * 요약 원문 — 인용 범위 안의 발췌.
   *
   * 없으면 화면이 "발췌를 싣지 못했다"고 밝히고 요약만 보인다. 있는 척하지
   * 않는다.
   */
  excerpt: z.string().optional(),
  /** 발췌의 출처. 몇 쪽인지까지. excerpt가 있으면 반드시 있어야 한다. */
  excerptSource: z.string().optional(),
  actions: z.array(actionItemSchema).min(1, "행동이 없는 챕터는 둘 수 없다"),
});
export type Chapter = z.infer<typeof chapterSchema>;

export const bookSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "책 슬러그는 ascii 소문자와 하이픈만"),
  title: z.string(),
  subtitle: z.string().optional(),
  publisher: z.string(),
  year: z.number().int(),
  tone: bookToneSchema,
  /** 이 책이 있다는 근거. 서지 정보의 출처다. */
  source: z.object({
    title: z.string(),
    publisher: z.string(),
    url: z.string().url(),
    /**
     * 출판사나 도서관 자료로 대조했는지. false면 화면이 그렇게 밝힌다.
     * 2차 자료(백과사전·서점)만 보고 적은 것을 확인된 것처럼 두지 않는다.
     */
    verified: z.boolean(),
  }),
  /** 편집자가 적는 한 줄. 이 책이 무엇인지까지만. 평가하지 않는다. */
  note: z.string().optional(),
  /**
   * 화면을 보이려고 만든 샘플인가.
   *
   * true면 표지·책 페이지·장 페이지가 모두 "샘플"이라고 밝힌다. 실제 저서에
   * 지어낸 요약을 붙이는 대신 편집부가 쓴 책을 따로 세우는 쪽을 골랐다 —
   * 이 자리에서 한 번 흐려지면 나머지 전부가 의심받는다.
   */
  sample: z.boolean().optional(),
  chapters: z.array(chapterSchema),
});
export type Book = z.infer<typeof bookSchema>;

/**
 * 스키마가 잡지 못하는 것.
 *
 * zod는 한 레코드 안을 보고, 여기서는 레코드 사이의 약속을 본다.
 */
export function validateBook(book: Book): string[] {
  const errors: string[] = [];

  const slugs = new Set<string>();
  for (const chapter of book.chapters) {
    if (slugs.has(chapter.slug)) errors.push(`챕터 슬러그가 겹친다: ${chapter.slug}`);
    slugs.add(chapter.slug);
  }

  /* 순서는 1부터 빈틈없이. 빠진 번호가 있으면 목록에서 티가 난다. */
  const orders = book.chapters.map((c) => c.order).sort((a, b) => a - b);
  orders.forEach((order, index) => {
    if (order !== index + 1) {
      errors.push(`챕터 순서가 이어지지 않는다: ${orders.join(", ")}`);
    }
  });

  for (const chapter of book.chapters) {
    const where = `${chapter.slug}`;

    if (chapter.excerpt && !chapter.excerptSource) {
      errors.push(`${where}: 발췌를 실었으면 어디서 옮겼는지 적어야 한다`);
    }

    for (const point of chapter.easy.points) {
      if (!point.quote) continue;
      if (!chapter.excerpt) {
        errors.push(`${where}/${point.id}: 발췌가 없는데 옮긴 자리를 가리킨다`);
        continue;
      }
      /* 언행과 같은 불변식 — 붙인 문장이 발췌에 그대로 있어야 한다. */
      if (!chapter.excerpt.includes(point.quote)) {
        errors.push(`${where}/${point.id}: 옮긴 자리가 발췌에 없다 — "${point.quote.slice(0, 30)}…"`);
      }
    }

    for (const action of chapter.actions) {
      if (action.link && !/^(https?:\/\/|\/)/.test(action.link.href)) {
        errors.push(`${where}/${action.id}: 갈 곳이 주소가 아니다 — ${action.link.href}`);
      }
    }
  }

  return errors;
}
