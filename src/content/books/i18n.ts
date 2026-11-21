import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { z } from "zod";

import {
  bookFigureSchema,
  bookShortSchema,
  validateBook,
  type Book,
  type Chapter,
} from "./schema";

/**
 * 자서전 번역 (docs/book-i18n.md).
 *
 * 사이트 전체를 옮기지 않는다. 장 하나를 통째로 옮겨 따로 둔다.
 *
 * ★ 원본(한국어)은 건드리지 않는다.
 *   번역은 원본의 장·토막·행동 id에 매달린 별도 파일이다. 원본에서 토막을 지우면
 *   번역에 남은 id가 검사에 걸린다.
 *
 * ★ 반쯤 옮긴 장은 싣지 않는다.
 *   토막 하나라도 빠지면 그 장은 그 언어로 열리지 않는다 — 한 화면에 한국어와
 *   번역이 섞이면 어디까지가 옮긴 것인지 읽는 사람이 가를 수 없다.
 *
 * ★ 낡은 번역을 최신인 척 두지 않는다.
 *   번역할 때 원본 장의 지문(`basedOn`)을 적는다. 원본이 바뀌면 지문이 어긋나고,
 *   검사가 경고하고 화면이 "원문이 바뀐 뒤 아직 갱신하지 않은 번역"이라고 밝힌다.
 *
 * ★ 우리가 옮긴 것은 우리 요약이다.
 *   원본 본문은 저자의 문장이 아니라 편집부가 다시 쓴 요약이다(bodyKind: summary).
 *   번역은 그 요약을 옮긴 것이고, 원서의 번역본이 아니다. 화면이 늘 그렇게 밝힌다.
 *   저자의 문장(excerpt)인 장은 옮기지 않는다 — 검사가 막는다.
 */

export const BOOK_LOCALES = ["ja", "en"] as const;
export type BookLocale = (typeof BOOK_LOCALES)[number];
/** 한국어까지 넣은 화면 언어. 화면 글자(ui.ts)가 이 셋을 안다. */
export type ReadLocale = "ko" | BookLocale;

export function isBookLocale(value: string): value is BookLocale {
  return (BOOK_LOCALES as readonly string[]).includes(value);
}

export const LOCALE_INFO: Record<ReadLocale, { label: string; og: string }> = {
  ko: { label: "한국어", og: "ko_KR" },
  ja: { label: "日本語", og: "ja_JP" },
  en: { label: "English", og: "en_US" },
};

/** 한 장의 번역이 어떻게 만들어졌는가. 검수 전이면 화면이 그렇게 적는다. */
export const translationReviewSchema = z.object({
  /** machine: 기계 번역(사람이 원문과 대조하지 않음). human: 사람이 옮김. */
  method: z.enum(["machine", "human"]),
  /** 그 언어를 모국어로 쓰는 사람이 원문과 대조했는가. */
  reviewed: z.boolean(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
});
export type TranslationReview = z.infer<typeof translationReviewSchema>;

export const chapterTranslationSchema = z.object({
  /** 원본 장의 id. */
  chapterId: z.string(),
  /** 번역할 때의 원본 장 지문(chapterFingerprint). */
  basedOn: z.string().regex(/^[0-9a-f]{12}$/),
  review: translationReviewSchema,
  title: z.string(),
  summary: z.string(),
  lead: z.string(),
  /** 원본의 토막 id → 옮긴 토막. 원본에 도형이 있으면 옮긴 도형도 있어야 한다. */
  points: z.record(
    z.string(),
    z.object({
      title: z.string(),
      say: z.string(),
      quote: z.string().optional(),
      figure: bookFigureSchema.optional(),
    }),
  ),
  /**
   * 원본의 행동 id → 옮긴 행동. 언제 할 일인지는 원본 것을 쓴다. 링크 주소도 원본 것이 기본이다.
   * 행동은 한국에 사는 사람을 위한 것이라 옮길 수 없는 것은 비워 둔다(docs/book-i18n.md §2.3).
   *
   * href는 그 언어의 독자에게 원본 링크가 쓸모없을 때만 준다 — 상담 전화가 그렇다.
   * 한국의 109는 일본이나 다른 나라에서 걸 수 없다. 이때는 linkLabel도 함께 적는다.
   */
  actions: z
    .record(
      z.string(),
      z.object({
        title: z.string(),
        detail: z.string(),
        linkLabel: z.string().optional(),
        href: z.string().optional(),
      }),
    )
    .default({}),
  /** 이 언어로 만든 영상. 원본 언어의 영상을 그대로 걸지 않는다. */
  shorts: z.array(bookShortSchema).default([]),
  /** 옮긴 요약 본문. 문단은 빈 줄로, 소제목은 `## `로 가른다. */
  body: z.string(),
});
export type ChapterTranslation = z.infer<typeof chapterTranslationSchema>;

export const bookTranslationSchema = z.object({
  locale: z.enum(BOOK_LOCALES),
  bookSlug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  note: z.string(),
  chapters: z.array(chapterTranslationSchema),
});
export type BookTranslation = z.infer<typeof bookTranslationSchema>;

/** 옮긴 본문 파일을 읽는다. `books/<폴더>/i18n/<언어>/<파일>`. */
export function readTranslatedBody(folder: string, locale: BookLocale, file: string): string {
  return readFileSync(join(process.cwd(), "src", "content", "books", folder, "i18n", locale, file), "utf8")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .join("\n\n");
}

/**
 * 원본 장의 지문. 번역에 영향을 주는 것만 넣는다 — 화면에 옮겨지는 글 전부.
 * 숏츠는 넣지 않는다. 언어마다 영상이 따로라 원본 영상이 늘어도 번역이 낡지 않는다.
 */
export function chapterFingerprint(chapter: Chapter): string {
  const material = JSON.stringify({
    title: chapter.title,
    summary: chapter.summary,
    easy: chapter.easy,
    body: chapter.body ?? "",
    actions: chapter.actions.map((a) => [a.id, a.title, a.detail, a.link?.label ?? ""]),
  });
  return createHash("sha256").update(material).digest("hex").slice(0, 12);
}

export interface LocalizedChapterInfo {
  review: TranslationReview;
  /** 원본이 바뀐 뒤 갱신하지 않은 번역. */
  stale: boolean;
  /** 지금 원본 장의 지문. 다시 옮긴 뒤 basedOn에 이 값을 적는다. */
  fingerprint: string;
  /** 원본 장 제목. 화면이 "원문" 링크에 쓴다. */
  originalTitle: string;
}

export interface LocalizedBook {
  locale: BookLocale;
  /** 원본 책. 원문 링크와 서지에 쓴다. */
  original: Book;
  /** 옮긴 책. chapters에는 끝까지 옮긴 장만 있다. 순서(order)는 원본 것이다. */
  book: Book;
  info: Record<string, LocalizedChapterInfo>;
}

/** 원본 장 하나와 번역을 맞대어 옮긴 장을 만든다. 맞지 않으면 이유를 돌려준다. */
function localizeChapter(source: Chapter, tr: ChapterTranslation): { chapter?: Chapter; errors: string[] } {
  const errors: string[] = [];
  const where = `${tr.chapterId}`;

  if (source.bodyKind === "excerpt") errors.push(`${where}: 저자의 문장(excerpt)인 장은 옮기지 않는다`);

  const sourcePoints = new Set(source.easy.points.map((p) => p.id));
  for (const id of Object.keys(tr.points)) {
    if (!sourcePoints.has(id)) errors.push(`${where}: 원본에 없는 토막을 옮겼다 — ${id}`);
  }
  const sourceActions = new Set(source.actions.map((a) => a.id));
  for (const id of Object.keys(tr.actions)) {
    if (!sourceActions.has(id)) errors.push(`${where}: 원본에 없는 행동을 옮겼다 — ${id}`);
  }

  const points = source.easy.points.map((point) => {
    const t = tr.points[point.id];
    if (!t) {
      errors.push(`${where}: 토막을 옮기지 않았다 — ${point.id}`);
      return point;
    }
    if (point.figure && !t.figure) errors.push(`${where}/${point.id}: 원본에 도형이 있는데 옮기지 않았다`);
    if (point.figure && t.figure && point.figure.kind !== t.figure.kind) {
      errors.push(`${where}/${point.id}: 도형 종류가 원본과 다르다 (${point.figure.kind} → ${t.figure.kind})`);
    }
    if (point.quote && !t.quote) errors.push(`${where}/${point.id}: 원본은 옮긴 자리를 붙였는데 번역에는 없다`);
    return { id: point.id, title: t.title, say: t.say, quote: t.quote, figure: t.figure };
  });

  const actions = source.actions.flatMap((action) => {
    const t = tr.actions[action.id];
    if (!t) return [];
    if (t.href && !t.linkLabel) errors.push(`${where}/${action.id}: 링크 주소를 바꿨으면 이름(linkLabel)도 적는다`);
    const link = t.href
      ? { href: t.href, label: t.linkLabel ?? "" }
      : action.link
        ? { href: action.link.href, label: t.linkLabel ?? action.link.label }
        : undefined;
    return [{ ...action, title: t.title, detail: t.detail, link }];
  });

  if (errors.length > 0) return { errors };

  return {
    errors,
    chapter: {
      ...source,
      title: tr.title,
      summary: tr.summary,
      easy: { lead: tr.lead, points },
      body: tr.body,
      actions,
      shorts: tr.shorts,
    },
  };
}

/**
 * 원본 책과 번역을 맞대어 옮긴 책을 만든다.
 * 맞지 않는 장은 빼고 errors에 남긴다 — 빌드(검사)가 그것을 보고 실패한다.
 */
export function localizeBook(original: Book, tr: BookTranslation): { localized: LocalizedBook; errors: string[] } {
  const errors: string[] = [];
  const chapters: Chapter[] = [];
  const info: Record<string, LocalizedChapterInfo> = {};
  const seen = new Set<string>();

  for (const chapterTr of tr.chapters) {
    if (seen.has(chapterTr.chapterId)) errors.push(`${chapterTr.chapterId}: 같은 장을 두 번 옮겼다`);
    seen.add(chapterTr.chapterId);

    const source = original.chapters.find((c) => c.id === chapterTr.chapterId);
    if (!source) {
      errors.push(`${chapterTr.chapterId}: 원본에 없는 장이다`);
      continue;
    }
    const { chapter, errors: chapterErrors } = localizeChapter(source, chapterTr);
    errors.push(...chapterErrors);
    if (!chapter) continue;

    chapters.push(chapter);
    info[chapter.id] = {
      review: chapterTr.review,
      stale: chapterTr.basedOn !== chapterFingerprint(source),
      fingerprint: chapterFingerprint(source),
      originalTitle: source.title,
    };
  }

  chapters.sort((a, b) => a.order - b.order);

  const book: Book = {
    ...original,
    title: tr.title,
    subtitle: tr.subtitle,
    note: tr.note,
    chapters,
  };

  return { localized: { locale: tr.locale, original, book, info }, errors };
}

/**
 * 옮긴 책의 검사. 원본과 같은 규율을 그 언어 안에서 다시 돈다 —
 * 옮긴 토막의 인용이 옮긴 본문에 그대로 있는가, 옮긴 도형 글자가 칸에 드는가.
 *
 * validateBook의 "순서가 1부터 빈틈없이"는 번역에 맞지 않는다(1장과 3장만 옮길 수 있다).
 * 그래서 검사할 때만 순서를 다시 매긴다. 화면은 원본 순서를 쓴다.
 */
export function validateLocalized(localized: LocalizedBook): string[] {
  const renumbered: Book = {
    ...localized.book,
    chapters: localized.book.chapters.map((c, i) => ({ ...c, order: i + 1 })),
  };
  return validateBook(renumbered);
}
