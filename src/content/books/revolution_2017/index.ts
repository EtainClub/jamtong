import { bookSchema, type Book } from "../schema";
import { bodyOf, loadChapter, minutesOf } from "../body";
import { CHAPTERS } from "./chapters";

/**
 * 『이재명, 대한민국 혁명하라』 (메디치미디어, 2017).
 *
 * 열일곱 장을 요약으로 옮겼다. 본문은 `text/`에서 빌드 때 읽어 붙인다.
 *
 * ★ 2017년 대선을 앞두고 낸 책이다.
 *   1~3장은 문제 진단, 4~16장은 분야별 구상(검찰·지방자치·재벌·노동·농업·
 *   에너지·복지·의료·통일·국방·외교), 17장은 맺음이다. 구상은 결과와 섞지 않고,
 *   상대 정치세력에 대한 평가는 저자의 시각으로 옮긴다(chapters.ts).
 *
 * ★ 여기 실린 본문은 저자의 문장이 아니다(bodyKind: "summary").
 *
 * 장 제목은 chapters.ts가 분야와 제목을 갈라 적는다. 원문 제목 줄과 낱말이
 * 어긋나면 파일과 메타가 엇갈린 것이니 빌드를 멈춘다.
 *
 * 슬러그와 id는 서지 정보만 있던 때의 것을 그대로 쓴다.
 */

/** 띄어쓰기와 가름표를 뺀 낱말만. 제목 대조용. */
const words = (title: string) => title.replace(/[\s—]/g, "");

const chapters = CHAPTERS.map((meta, index) => {
  const loaded = loadChapter("revolution_2017", meta.file, meta.drop);

  if (!words(meta.title).startsWith(words(loaded.title))) {
    throw new Error(`revolution_2017/${meta.file}: 제목이 원문과 다르다 — "${meta.title}" / "${loaded.title}"`);
  }

  return {
    id: `revolution-${meta.file.replace(".md", "")}`,
    slug: meta.slug,
    order: index + 1,
    title: meta.title,
    summary: meta.summary,
    minutes: minutesOf(loaded),
    easy: { lead: meta.lead, points: meta.points },
    body: bodyOf(loaded, meta.cutAt),
    bodyKind: "summary" as const,
    bodySource: `『이재명, 대한민국 혁명하라』 ${index + 1}장`,
    truncated: meta.truncated,
    actions: meta.actions,
    shorts: meta.shorts ?? [],
  };
});

export const REVOLUTION_BOOK: Book = bookSchema.parse({
  id: "book-revolution",
  slug: "revolution",
  title: "이재명, 대한민국 혁명하라",
  publisher: "메디치미디어",
  year: 2017,
  tone: "rust",
  source: {
    title: "이재명 — 저서",
    publisher: "한국어 위키백과",
    url: "https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%9E%AC%EB%AA%85",
    verified: false,
  },
  note: "2017년 대선을 앞두고 낸 책입니다. 촛불 이후 '진짜 민주공화국'을 세우자며 검찰·재벌·노동·복지·통일·국방·외교 분야의 구상을 적었습니다. 구상은 2017년 시점의 약속이지 결과가 아닙니다. 여기 실린 글은 저자의 문장이 아니라 우리가 읽고 다시 쓴 요약이며, 상대 정치세력에 대한 평가는 저자의 시각입니다.",
  chapters,
});
