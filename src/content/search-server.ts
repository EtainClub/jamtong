import { BOOKS_BY_YEAR } from "@/content/books";
import { SEARCH_INDEX, normalize, type SearchEntry } from "@/content/search";
import { allPages, pageSummary, type WikiPage } from "@/lib/wiki/load";

/**
 * 검색 인덱스 — 디스크에서 읽어 오는 몫.
 *
 * 위키는 `wiki/**`의 마크다운이고 자서전 본문은 `text/*.md`다. 둘 다 빌드 때
 * fs로 읽으므로 브라우저에 실리는 `search.ts`에 둘 수 없다. 여기서 붙이고,
 * `/api/search-index`가 정적으로 구워 낸다.
 *
 * ★ 소스 위키 페이지는 본문을 통째로 넣지 않는다.
 *   `wiki/source/*`는 업적과 언행을 우리가 다시 쓴 것이다. 그 본문까지 넣으면
 *   같은 문장 하나가 원본과 위키 두 줄로 잡힌다. 소스 페이지는 제목과 소제목,
 *   첫 문단까지만 넣어 "그 페이지가 있다"를 찾을 수 있게 하고, 본문으로 찾는
 *   일은 원본이 맡는다. 개념·종합·사건 페이지는 반대다 — 그 글은 위키에만
 *   있으므로 통째로 넣는다.
 */

const WIKI_KIND_LABEL: Record<string, string> = {
  source: "소스",
  concept: "개념",
  entity: "인물·기관",
  event: "사건",
  synthesis: "종합",
  meta: "기록",
};

/** 앵커와 위키링크 껍데기를 벗긴다. 안에 든 말은 남긴다 — 찾을 값어치가 있다. */
function plain(text: string): string {
  return text
    .replace(/\^\[[^\]]+\]/g, " ")
    .replace(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g, "$1")
    .replace(/[*`>|#-]/g, " ");
}

/** 소스 페이지가 내주는 것 — 제목과 소제목, 그리고 첫 문단. */
function sourceHaystack(page: WikiPage): string {
  const headings = page.body
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .join(" ");
  return plain(`${headings} ${pageSummary(page)}`);
}

function wikiEntries(): SearchEntry[] {
  const out: SearchEntry[] = [];

  for (const page of allPages()) {
    /* log은 넣지 않는다. ingest 기록이라 온 페이지의 제목이 다 들어 있어 검색을 흐린다. */
    if (page.name === "log") continue;

    const isIndex = page.name === "index";
    const full = !isIndex && page.kind !== "source";

    out.push({
      id: `wiki:${page.name}`,
      kind: "wiki",
      title: isIndex ? "위키 카탈로그" : page.title,
      detail: pageSummary(page, 90),
      context: `위키 · ${WIKI_KIND_LABEL[page.kind] ?? page.kind}`,
      href: isIndex ? "/wiki" : `/wiki/${page.name}`,
      haystack: normalize(
        [page.title, page.name, full ? plain(page.body) : sourceHaystack(page)].join(" "),
      ),
    });
  }

  return out;
}

function bookEntries(): SearchEntry[] {
  const out: SearchEntry[] = [];

  for (const book of BOOKS_BY_YEAR) {
    /*
     * 아직 정리하지 않은 책은 넣지 않는다. 서지 정보뿐인 책이 검색에 잡히면
     * 열어 봤을 때 읽을 것이 없다. 서가에는 투명하게 남아 있다.
     */
    if (book.chapters.length === 0) continue;

    out.push({
      id: `book:${book.slug}`,
      kind: "book",
      title: book.title,
      detail: book.note ?? `${book.publisher} · ${book.year}`,
      context: book.sample ? "자서전 · 샘플" : `자서전 · ${book.chapters.length}장`,
      href: `/books/${book.slug}`,
      haystack: normalize(
        [
          book.title,
          book.subtitle ?? "",
          book.publisher,
          String(book.year),
          book.note ?? "",
        ].join(" "),
      ),
    });

    for (const chapter of book.chapters) {
      const points = chapter.easy.points
        .map((p) => `${p.title} ${p.say} ${p.quote ?? ""}`)
        .join(" ");
      const actions = chapter.actions.map((a) => `${a.title} ${a.detail}`).join(" ");

      out.push({
        id: `book:${book.slug}:${chapter.slug}`,
        kind: "book",
        title: chapter.title,
        detail: chapter.summary,
        context: `${book.title} · ${chapter.order}장`,
        href: `/books/${book.slug}/${chapter.slug}`,
        haystack: normalize(
          [
            chapter.title,
            chapter.summary,
            chapter.easy.lead,
            points,
            actions,
            /* 본문은 이 장에만 있는 글이다. 통째로 넣는다. */
            chapter.body ?? "",
          ].join(" "),
        ),
      });
    }
  }

  return out;
}

let cache: SearchEntry[] | null = null;

/** 저장소 자료 + 위키 + 자서전. 화면에 나가는 인덱스는 이것 하나다. */
export function fullSearchIndex(): SearchEntry[] {
  cache ??= [...SEARCH_INDEX, ...bookEntries(), ...wikiEntries()];
  return cache;
}
