import { bookSchema, type Book } from "../schema";
import { bodyOf, loadChapter, minutesOf } from "../body";
import { CHAPTERS } from "./chapters";

/**
 * 『이재명 자서전 — 그 꿈이 있어 여기까지 왔다』 (아시아, 2025).
 *
 * 여덟 장을 요약으로 옮겼다. 본문은 `text/`에서 빌드 때 읽어 붙인다.
 * 원서는 짧은 꼭지 마흔여섯 개로 되어 있고, 요약은 그것을 여덟 묶음으로 나눴다.
 * 장 제목은 각 묶음의 첫 꼭지 제목이다.
 *
 * ★ 서지 정보는 서점(YES24) 목록에서 옮겼다. 스토리텔링콘텐츠연구소가 기획을
 *   맡았다. 2차 자료라 verified는 false다.
 *
 * ★ 여기 실린 본문은 저자의 문장이 아니다(bodyKind: "summary").
 *
 * 3장 원문 제목 줄 끝에 "요약"이 붙어 있다. 자료를 만들 때 남은 표시라 뗀다.
 */

const chapters = CHAPTERS.map((meta, index) => {
  const loaded = loadChapter("auto_2025", meta.file, meta.drop);

  return {
    id: `autobiography-${meta.file.replace(".md", "")}`,
    slug: meta.slug,
    order: index + 1,
    title: loaded.title.replace(/\s*요약$/, ""),
    summary: meta.summary,
    minutes: minutesOf(loaded),
    easy: { lead: meta.lead, points: meta.points },
    body: bodyOf(loaded, meta.cutAt),
    bodyKind: "summary" as const,
    bodySource: `『이재명 자서전』 ${index + 1}장`,
    truncated: meta.truncated,
    actions: meta.actions,
    shorts: meta.shorts ?? [],
  };
});

export const AUTOBIOGRAPHY_BOOK: Book = bookSchema.parse({
  id: "book-autobiography",
  slug: "autobiography",
  title: "이재명 자서전",
  subtitle: "그 꿈이 있어 여기까지 왔다",
  publisher: "아시아",
  year: 2025,
  tone: "moss",
  source: {
    title: "이재명 자서전 — 그 꿈이 있어 여기까지 왔다",
    publisher: "YES24",
    url: "https://www.yes24.com/product/goods/147275959",
    verified: false,
  },
  note: "2025년에 낸 자서전입니다. 안동 산골의 어린 시절부터 소년공, 법대, 인권변호사, 시민운동을 거쳐 정치에 뛰어들기까지를 다루고, 마지막 장이 그 뒤의 삶을 짧게 되짚습니다. 여기 실린 글은 저자의 문장이 아니라 우리가 읽고 다시 쓴 요약이며, 대장동처럼 평가가 갈리는 일은 저자의 설명입니다.",
  chapters,
});
