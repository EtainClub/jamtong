import { bookSchema, type Book } from "../schema";
import { bodyOf, loadChapter, minutesOf } from "../body";
import { CHAPTERS } from "./chapters";

/**
 * 『고난을 통해 희망을 만들다』 (청동거울, 2010).
 *
 * 일곱 장을 요약으로 옮겼다. 본문은 `text/`에서 빌드 때 읽어 붙인다.
 *
 * ★ 2010년 성남시장 선거를 앞두고 낸 책이다.
 *   3~7장은 공약이다. 책이 약속한 것과 실제로 된 것은 다르다 — 그 차이는
 *   chapters.ts의 토막마다 적고, 결과가 있는 약속은 업적 페이지로 잇는다.
 *
 * ★ 여기 실린 본문은 저자의 문장이 아니다(bodyKind: "summary").
 *
 * 슬러그와 id는 서지 정보만 있던 때의 것을 그대로 쓴다. 이미 퍼진 주소를
 * 바꾸지 않는다.
 */

const chapters = CHAPTERS.map((meta, index) => {
  const loaded = loadChapter("hope_2010", meta.file, meta.drop);

  return {
    id: `hope-${meta.file.replace(".md", "")}`,
    slug: meta.slug,
    order: index + 1,
    title: loaded.title,
    summary: meta.summary,
    minutes: minutesOf(loaded),
    easy: { lead: meta.lead, points: meta.points },
    body: bodyOf(loaded, meta.cutAt),
    bodyKind: "summary" as const,
    bodySource: `『고난을 통해 희망을 만들다』 ${index + 1}장`,
    truncated: meta.truncated,
    actions: meta.actions,
    shorts: meta.shorts ?? [],
  };
});

export const HOPE_BOOK: Book = bookSchema.parse({
  id: "book-hope",
  slug: "hope-through-hardship",
  title: "고난을 통해 희망을 만들다",
  publisher: "청동거울",
  year: 2010,
  tone: "clay",
  source: {
    title: "이재명 — 저서",
    publisher: "한국어 위키백과",
    url: "https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%9E%AC%EB%AA%85",
    verified: false,
  },
  note: "2010년 성남시장 선거를 앞두고 낸 책입니다. 1장은 삶의 이력, 2장은 2008~2010년 활동 기록, 3~7장은 선거 공약입니다. 여기 실린 글은 저자의 문장이 아니라 우리가 읽고 다시 쓴 요약이며, 공약은 약속이지 실적이 아닙니다.",
  chapters,
});
