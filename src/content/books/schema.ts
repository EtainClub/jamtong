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
 * 장 삽화.
 *
 * 업적의 ELI5_ART, 언행의 WORD_ART와 한 통에 담지 않는다. 저쪽은 항로·예산
 * 같은 사실의 모양이고 언행은 사람 사이에 오가는 일인데, 책은 한 사람의
 * 생애에서 되풀이되는 장면이다 — 공장, 밤공부, 갈림길, 저울.
 *
 * 그래서 수를 적게 두고 여러 장에서 다시 쓴다. 장마다 새 그림을 그리면
 * 스물두 장에 예순여섯 장이 필요하고, 그렇게 늘어난 그림은 장면이 아니라
 * 장식이 된다.
 */
export const BookArt = z.enum([
  "factory", // 공장과 다친 손
  "night-study", // 밤에 하는 공부
  "two-roads", // 안에서 바꿀까 밖에서 바꿀까
  "promise", // 약속
  "scale", // 강한 쪽을 누르고 약한 쪽을 든다
  "square", // 광장
  "signatures", // 이름을 모은다
  "ledger", // 빚을 적은 장부
  "open-door", // 문을 열어 둔 방
  "alley", // 골목
  "network", // 흩어진 사람들이 이어진다
  "startline", // 출발선이 다르다
  "hands", // 손을 내민다
  "cut-tape", // 앞뒤가 잘린 녹취
]);
export type BookArt = z.infer<typeof BookArt>;

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
  /** 이 토막의 그림. 없으면 글만 나온다. */
  art: BookArt.optional(),
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
