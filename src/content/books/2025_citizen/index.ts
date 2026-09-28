import { bookSchema, type Book } from "../schema";
import { bodyOf, loadChapter, minutesOf } from "../body";
import { CHAPTERS } from "./chapters";

/**
 * 『결국 국민이 합니다』 (오마이북, 2025).
 *
 * 다섯 장을 요약으로 옮겼다. 본문은 `text/`에서 빌드 때 읽어 붙인다.
 *
 * ★ 2025년 대선을 앞두고 낸 책이다.
 *   1~2장은 12·3 비상계엄부터 탄핵소추안 가결까지의 기록, 3장은 삶과
 *   정치철학, 4~5장은 구상이다. 상대 정치세력에 대한 평가는 저자의 시각으로
 *   옮기고, 구상은 결과와 섞지 않는다(chapters.ts).
 *
 * ★ 여기 실린 본문은 저자의 문장이 아니다(bodyKind: "summary").
 *
 * 원문 제목은 "1장 목숨을 내놓다 …"처럼 장 번호로 시작한다. 화면이 장 번호를
 * 따로 붙이므로 여기서 뗀다.
 *
 * 슬러그와 id는 서지 정보만 있던 때의 것을 그대로 쓴다.
 */

const chapters = CHAPTERS.map((meta, index) => {
  const loaded = loadChapter("2025_citizen", meta.file, meta.drop);

  return {
    id: `people-${meta.file.replace(".md", "")}`,
    slug: meta.slug,
    order: index + 1,
    title: loaded.title.replace(/^\d+장\s*/, ""),
    summary: meta.summary,
    minutes: minutesOf(loaded),
    easy: { lead: meta.lead, points: meta.points },
    body: bodyOf(loaded, meta.cutAt),
    bodyKind: "summary" as const,
    bodySource: `『결국 국민이 합니다』 ${index + 1}장`,
    truncated: meta.truncated,
    actions: meta.actions,
    shorts: meta.shorts ?? [],
  };
});

export const CITIZEN_BOOK: Book = bookSchema.parse({
  id: "book-people",
  slug: "people-do-it",
  title: "결국 국민이 합니다",
  publisher: "오마이북",
  year: 2025,
  tone: "slate",
  source: {
    title: "이재명 — 저서",
    publisher: "한국어 위키백과",
    url: "https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%9E%AC%EB%AA%85",
    verified: false,
  },
  note: "2025년 대선을 앞두고 낸 책입니다. 1~2장은 12·3 비상계엄부터 탄핵소추안 가결까지의 기록, 3장은 삶과 정치철학, 4~5장은 앞으로의 구상입니다. 여기 실린 글은 저자의 문장이 아니라 우리가 읽고 다시 쓴 요약이며, 상대 정치세력에 대한 평가는 저자의 시각입니다.",
  chapters,
});
