import { bookSchema, type Book } from "../schema";
import { bodyOf, loadChapter, minutesOf } from "./body";
import { CHAPTERS } from "./chapters";

/**
 * 『함께 가는 길은 외롭지 않습니다』 (위즈덤하우스, 2022).
 *
 * 스물두 장을 요약으로 옮겼다. 본문은 `refs/books/together/`에서 빌드 때
 * 읽어 붙이고, 이 파일은 그것을 장으로 묶는다.
 *
 * ★ 여기 실린 본문은 저자의 문장이 아니다.
 *   책을 읽고 우리가 다시 쓴 요약이다(bodyKind: "summary"). 저작물의 전문을
 *   싣지 않으려는 것이기도 하고, 요약은 요약이라고 밝히는 것이 이 사이트의
 *   규칙이기도 하다. 화면이 장마다 그렇게 적는다.
 */

const chapters = CHAPTERS.map((meta, index) => {
  const loaded = loadChapter(meta.file, meta.drop);

  return {
    id: `together-${meta.file.replace(".md", "")}`,
    slug: meta.slug,
    order: index + 1,
    title: loaded.title,
    summary: meta.summary,
    minutes: minutesOf(loaded),
    easy: { lead: meta.lead, points: meta.points },
    body: bodyOf(loaded, meta.cutAt),
    bodyKind: "summary" as const,
    bodySource: `『함께 가는 길은 외롭지 않습니다』 ${index + 1}장`,
    truncated: meta.truncated,
    actions: meta.actions,
    shorts: meta.shorts ?? [],
  };
});

export const TOGETHER_BOOK: Book = bookSchema.parse({
  id: "book-together",
  slug: "not-lonely-together",
  title: "함께 가는 길은 외롭지 않습니다",
  publisher: "위즈덤하우스",
  year: 2022,
  tone: "dusk",
  source: {
    title: "이재명 — 저서",
    publisher: "한국어 위키백과",
    url: "https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%9E%AC%EB%AA%85",
    verified: false,
  },
  note: "스물두 장을 요약으로 옮겼습니다. 여기 실린 글은 저자의 문장이 아니라 우리가 읽고 다시 쓴 요약이며, 장마다 읽은 사람이 할 수 있는 일을 함께 둡니다.",
  chapters,
});
