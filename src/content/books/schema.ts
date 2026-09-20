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
 *   장마다 본문이 하나 있는데, 그것이 **책의 문장인지 우리가 옮긴 요약인지**를
 *   bodyKind가 가른다. 지금 들어온 자료는 전부 요약이다 — 책을 읽고 우리가
 *   다시 쓴 글이지 저자의 문장이 아니다. 화면도 그렇게 밝힌다. 저자의 문장을
 *   그대로 실을 때는 인용 범위 안의 발췌만 싣고 어디서 옮겼는지 적는다.
 *
 * ★ 옮긴 토막에는 옮긴 자리를 붙인다.
 *   쉽게 보기의 각 토막이 본문의 어느 대목을 줄인 것인지 그대로 붙인다.
 *   붙인 문장이 본문에 없으면 빌드가 깨진다. 언행의 규율을 그대로 가져온다.
 *
 * ★ 읽고 끝나지 않게 한다.
 *   이 섹션의 목적은 독후감이 아니다. 챕터마다 **읽은 사람이 할 수 있는 일**을
 *   적는다. 행동이 하나도 없는 챕터는 공개되지 않는다 — 스키마가 막는다.
 */

/**
 * 장면 도형.
 *
 * ★ 그림을 낱장으로 그리지 않는다.
 *   스물두 장에 장면이 예순여섯이다. 하나씩 그리면 예순여섯 장의 그림이
 *   생기고, 그 그림들은 서로 말이 달라 결국 장식이 된다. 업적의 쉬운 설명이
 *   힘을 갖는 이유는 그림이 예뻐서가 아니라 **수를 나란히 놓기 때문**이다
 *   (20,400km 옆에 13,000km).
 *
 *   그래서 도형을 일곱으로 정해 두고 장면마다 **데이터만** 넘긴다. 무엇을
 *   보여줄지 고민하는 자리가 "어떤 도형인가"로 좁아지고, 새 장을 넣을 때
 *   그림을 그릴 필요가 없다.
 *
 * 톤은 셋뿐이다. navy는 이야기의 주체, burgundy는 대가나 상처, ash는 배경.
 */
export const figureToneSchema = z.enum(["navy", "burgundy", "ash"]);
export type FigureTone = z.infer<typeof figureToneSchema>;

const cell = z.object({
  label: z.string(),
  value: z.string().optional(),
  tone: figureToneSchema.optional(),
});

export const bookFigureSchema = z.discriminatedUnion("kind", [
  /** 큰 수 하나. 이 장면이 수 하나로 끝날 때. */
  z.object({
    kind: z.literal("number"),
    value: z.string(),
    unit: z.string().optional(),
    note: z.string().optional(),
    caption: z.string(),
    tone: figureToneSchema.optional(),
  }),
  /** 둘을 맞붙인다. "또래가 있던 곳 / 그가 있던 곳". */
  z.object({
    kind: z.literal("versus"),
    left: cell,
    right: cell,
    middle: z.string().optional(),
    caption: z.string(),
  }),
  /** 항목을 쌓고 아래에 합을 둔다. 다친 것 셋과 받은 것 0처럼. */
  z.object({
    kind: z.literal("stack"),
    title: z.string(),
    items: z.array(cell).min(2).max(4),
    footer: cell.optional(),
  }),
  /** 오르내리는 선. 시간이 흐르며 무엇이 달라졌는가. */
  z.object({
    kind: z.literal("line"),
    points: z.array(
      z.object({
        label: z.string(),
        /** 0이 바닥, 100이 꼭대기. */
        y: z.number().min(0).max(100),
        tone: figureToneSchema.optional(),
      }),
    ).min(3).max(5),
    caption: z.string(),
  }),
  /** 단계. 하나가 다음으로 이어질 때. */
  z.object({
    kind: z.literal("steps"),
    steps: z.array(cell).min(2).max(4),
    caption: z.string(),
  }),
  /** 길이를 견주는 막대. 수가 둘 이상일 때. */
  z.object({
    kind: z.literal("bars"),
    bars: z.array(
      z.object({
        label: z.string(),
        /** 막대 길이의 비율(0~100). 값의 크기가 아니라 보이는 길이다. */
        ratio: z.number().min(4).max(100),
        value: z.string(),
        tone: figureToneSchema.optional(),
      }),
    ).min(2).max(3),
    caption: z.string(),
  }),
  /** 여럿 가운데 얼마. 광장의 사람, 서명한 이름. */
  z.object({
    kind: z.literal("grid"),
    total: z.number().int().min(8).max(60),
    filled: z.number().int().min(1),
    label: z.string(),
    caption: z.string(),
  }),
]);
export type BookFigure = z.infer<typeof bookFigureSchema>;

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

/**
 * 이 장으로 만든 숏츠 한 편.
 *
 * 영상은 유튜브에 두고 여기서는 틀기만 한다. 주소가 아니라 id만 적는다 —
 * youtube.com/shorts/<id>와 youtu.be/<id>가 같은 영상이기 때문이다.
 */
export const bookShortSchema = z.object({
  id: z.string(),
  title: z.string(),
  youtubeId: z.string().regex(/^[\w-]{11}$/, "유튜브 영상 id는 11자다"),
  summary: z.string().optional(),
});
export type BookShort = z.infer<typeof bookShortSchema>;

/** 쉽게 보기의 한 토막. 언행의 것과 같은 모양이되 quote가 선택이다. */
export const bookPointSchema = z.object({
  id: z.string(),
  title: z.string(),
  say: z.string(),
  /** 이 토막의 도형. 없으면 글만 나온다. */
  figure: bookFigureSchema.optional(),
  /**
   * 옮긴 자리의 본문. 챕터에 body가 있으면 **그 안에 그대로** 있어야 한다.
   * 본문을 싣지 못한 장에서는 비워 둔다 — 없는 글을 가리키게 할 수는 없다.
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
   * 요약 원문.
   *
   * 없으면 화면이 그렇게 밝히고 쉽게 보기만 보인다. 있는 척하지 않는다.
   */
  body: z.string().optional(),
  /**
   * 그 본문이 무엇인가.
   *   summary  우리가 읽고 다시 쓴 요약. 저자의 문장이 아니다.
   *   excerpt  저자의 문장 그대로. 인용 범위 안에서만.
   */
  bodyKind: z.enum(["summary", "excerpt"]).default("summary"),
  /** 어디서 온 본문인지. 발췌라면 몇 쪽인지까지. */
  bodySource: z.string().optional(),
  /**
   * 본문이 중간에서 끊겼는가.
   *
   * 자료가 잘린 채 들어오는 일이 실제로 있었다. 조용히 지우면 읽는 사람은
   * 그 장을 다 읽었다고 여긴다. 그래서 끊겼다고 화면에 적는다.
   */
  truncated: z.boolean().optional(),
  actions: z.array(actionItemSchema).min(1, "행동이 없는 챕터는 둘 수 없다"),
  /**
   * 이 장으로 만든 숏츠.
   *
   * 업적 쪽 shortSchema를 쓰지 않는다. 저쪽은 claimId를 반드시 달게 해서
   * "근거 없는 쇼츠는 없다"를 지키는데, 책에는 claim이 없다 — 이 장의 근거는
   * 그 장의 본문이다. 대신 몇 장을 옮긴 것인지가 화면에 늘 붙는다.
   */
  shorts: z.array(bookShortSchema).default([]),
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

    if (chapter.bodyKind === "excerpt" && !chapter.bodySource) {
      errors.push(`${where}: 저자의 문장을 실었으면 어디서 옮겼는지 적어야 한다`);
    }

    for (const point of chapter.easy.points) {
      if (!point.quote) continue;
      if (!chapter.body) {
        errors.push(`${where}/${point.id}: 본문이 없는데 옮긴 자리를 가리킨다`);
        continue;
      }
      /* 언행과 같은 불변식 — 붙인 문장이 본문에 그대로 있어야 한다. */
      if (!chapter.body.includes(point.quote)) {
        errors.push(`${where}/${point.id}: 옮긴 자리가 본문에 없다 — "${point.quote.slice(0, 30)}…"`);
      }
    }

    for (const action of chapter.actions) {
      /* 사이트 안(/), 바깥(http), 그리고 전화. 상담 전화는 실제로 할 수 있는 행동이다. */
      if (action.link && !/^(https?:\/\/|tel:|\/)/.test(action.link.href)) {
        errors.push(`${where}/${action.id}: 갈 곳이 주소가 아니다 — ${action.link.href}`);
      }
    }
  }

  return errors;
}
