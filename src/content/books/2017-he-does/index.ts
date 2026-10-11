import { bookSchema, type Book } from "../schema";
import { bodyOf, loadChapter, minutesOf } from "../body";
import { CHAPTERS } from "./chapters";

/**
 * 『이재명은 합니다』 (위즈덤하우스, 2017).
 *
 * 스물한 장을 요약으로 옮겼다. 본문은 `text/`에서 빌드 때 읽어 붙인다.
 * 예전에는 서지 정보만 있던 책(slug `lee-does-it`)이다. 주소가 바뀌지 않게 slug와 id를 그대로 둔다.
 *
 * ★ 서지 정보의 출처는 아직 백과사전이다(verified: false). 출판사나 국립중앙도서관
 *   자료로 대조하면 true로 올린다.
 *
 * ★ 여기 실린 본문은 저자의 문장이 아니다(bodyKind: "summary").
 *
 * 6장 제목은 자료에서 두 줄로 갈려 있어 둘째 줄을 붙인다(chapters.ts의 drop과 짝).
 */

const TITLE_TAIL: Record<string, string> = {
  "06.md": " 가장 낮은 곳으로",
};

const chapters = CHAPTERS.map((meta, index) => {
  const loaded = loadChapter("2017-he-does", meta.file, meta.drop);

  return {
    id: `he-does-${meta.file.replace(".md", "")}`,
    slug: meta.slug,
    order: index + 1,
    title: loaded.title + (TITLE_TAIL[meta.file] ?? ""),
    summary: meta.summary,
    minutes: minutesOf(loaded),
    easy: { lead: meta.lead, points: meta.points },
    body: bodyOf(loaded, meta.cutAt),
    bodyKind: "summary" as const,
    bodySource: `『이재명은 합니다』 ${index + 1}장`,
    truncated: meta.truncated,
    actions: meta.actions,
    shorts: meta.shorts ?? [],
  };
});

export const HE_DOES_BOOK: Book = bookSchema.parse({
  id: "book-does",
  slug: "lee-does-it",
  title: "이재명은 합니다",
  publisher: "위즈덤하우스",
  year: 2017,
  tone: "ink",
  source: {
    title: "이재명 — 저서",
    publisher: "한국어 위키백과",
    url: "https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%9E%AC%EB%AA%85",
    verified: false,
  },
  note: "2017년, 성남시장이던 저자가 낸 책입니다. 1~4장은 소년공 시절과 아버지, 광주를 알게 된 대학 시절, 인권변호사의 길을 고른 이야기이고, 5~13장은 시민운동과 낙선, 성남시장으로서 겪은 일과 성남시립의료원 운동입니다. 14~21장은 부패와 불평등, 외교·안보, 복지에 대한 2017년 무렵의 생각과 구상입니다. 여기 실린 글은 저자의 문장이 아니라 우리가 읽고 다시 쓴 요약입니다. 가족 갈등과 소송처럼 다툼이 있는 대목은 저자의 설명이고, 정책 구상은 2017년 시점의 것이지 결과가 아닙니다.",
  chapters,
});
