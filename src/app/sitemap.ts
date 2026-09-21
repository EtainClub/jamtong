import type { MetadataRoute } from "next";

import { getPublishedAchievements } from "@/content/achievements";
import { BOOKS_BY_YEAR } from "@/content/books";
import { STATEMENTS } from "@/content/words";
import { OPEN_CARTELS } from "@/content/cartels";
import { contentPages } from "@/lib/wiki/load";
import { abs } from "@/lib/seo/site";

/**
 * sitemap.xml.
 *
 * lastModified는 이 웹페이지의 마지막 실질적인 수정일이다.
 * 사건일, 발언일, 빌드 시각을 편집일 대신 넣지 않는다.
 * 실제 편집일을 추적하는 곳에만 적고, 모르는 곳은 생략한다.
 *
 *     위키   frontmatter의 `updated`
 *     업적   생략. 연표의 사건 날짜는 이 페이지의 수정일이 아니다.
 *     언행   생략. `postedAt`은 발언일이지 이 페이지의 수정일이 아니다.
 *     자서전 생략. 책의 발행 연도는 이 페이지의 수정일이 아니다.
 *     카르텔 생략. 업적을 모으기만 하고 제 날짜를 갖지 않는다.
 *
 * ★ 빈 껍데기는 싣지 않는다.
 *   초안 업적(`publishStatus: draft`), 장이 없는 책, 화면을 보이려고 만든
 *   샘플 책, 아직 근거가 없는 카르텔(`EMPTY_CARTELS`), ingest 기록(`wiki/log`)은
 *   뺀다. 열었을 때 읽을 것이 없는 주소를 색인에 넣으면 사이트 전체의 품질
 *   신호가 내려간다.
 *
 * `/my`와 `/s/...`는 페이지 메타데이터로 noindex를 지정하므로 여기에도 없다.
 */

/** YYYY / YYYY-MM / YYYY-MM-DD를 Date로. 정밀도가 낮으면 그달·그해 1일로 본다. */
function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value.trim());
  if (!match) return undefined;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m ?? "01") - 1, Number(d ?? "01")));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  /*
   * 고정 화면.
   *
   * priority는 이 사이트 안에서의 상대적 무게일 뿐이다. 홈과 업적 목록이
   * 들어오는 문이고, 피드백·정정은 있어야 하지만 찾아 들어오는 곳이 아니다.
   */
  const fixed: [string, number][] = [
    ["/", 1],
    ["/explore", 0.9],
    ["/words", 0.9],
    ["/wiki", 0.8],
    ["/timeline", 0.7],
    ["/about", 0.5],
    ["/links", 0.4],
    ["/feedback", 0.3],
    ["/correction", 0.3],
  ];
  for (const [path, priority] of fixed) {
    out.push({ url: abs(path), priority });
  }

  for (const achievement of getPublishedAchievements()) {
    out.push({
      url: abs(`/achievement/${achievement.slug}`),
      priority: 0.9,
    });
  }

  for (const statement of STATEMENTS) {
    out.push({
      url: abs(`/words/${statement.slug}`),
      priority: 0.7,
    });
  }

  for (const page of contentPages()) {
    if (page.name === "log") continue;
    out.push({
      url: abs(`/wiki/${page.name}`),
      lastModified: toDate(page.updated),
      /* 개념·종합은 이 위키에만 있는 글이다. 소스 페이지는 원본이 따로 있다. */
      priority: page.kind === "source" ? 0.5 : 0.7,
    });
  }

  for (const book of BOOKS_BY_YEAR) {
    if (book.chapters.length === 0 || book.sample) continue;
    out.push({ url: abs(`/books/${book.slug}`), priority: 0.6 });
    for (const chapter of book.chapters) {
      out.push({ url: abs(`/books/${book.slug}/${chapter.slug}`), priority: 0.6 });
    }
  }

  /*
   * 카르텔. 비어 있는 표적은 싣지 않는다 — 이름 한 줄뿐인 주소를 색인에
   * 넣으면 사이트 전체의 품질 신호가 내려간다. 장이 없는 책과 같은 처리다.
   * lastModified는 비운다. 이 페이지는 제 날짜를 갖지 않고 모으기만 한다.
   */
  for (const cartel of OPEN_CARTELS) {
    out.push({ url: abs(`/cartel/${cartel.slug}`), priority: 0.6 });
  }

  return out;
}
