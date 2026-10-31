import { getPublishedAchievements } from "@/content/achievements";
import { POLICIES } from "@/content/policies";
import { STATEMENTS } from "@/content/words";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, abs } from "@/lib/seo/site";

/**
 * /rss.xml — 네이버 서치어드바이저에 제출하는 피드.
 *
 * 네이버는 사이트맵과 함께 RSS로 새 글을 찾는다. 피드 리더와 AI 에이전트도
 * 같은 것을 읽는다.
 *
 * ★ pubDate를 지어내지 않는다.
 *   사이트맵과 같은 원칙이다. 업적에는 이 페이지의 발행일이 없고, 언행의
 *   날짜는 발언일이지 이 페이지의 날짜가 아니다. 정책 팩트만 기준일(asOf)을
 *   갖고 있어 그것을 쓴다. 날짜가 없는 항목은 pubDate를 비운다(RSS에서 선택).
 */
export const dynamic = "force-static";

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function item(input: { title: string; path: string; description: string; category: string; date?: string }) {
  const url = abs(input.path);
  return [
    "<item>",
    `<title>${esc(input.title)}</title>`,
    `<link>${url}</link>`,
    `<guid isPermaLink="true">${url}</guid>`,
    `<description>${esc(input.description)}</description>`,
    `<category>${esc(input.category)}</category>`,
    ...(input.date ? [`<pubDate>${new Date(`${input.date}T00:00:00+09:00`).toUTCString()}</pubDate>`] : []),
    "</item>",
  ].join("");
}

export function GET() {
  const items = [
    ...getPublishedAchievements().map((a) =>
      item({ title: a.title, path: `/achievement/${a.slug}`, description: a.subtitle, category: "업적" }),
    ),
    ...STATEMENTS.map((s) =>
      item({
        title: s.title,
        path: `/words/${s.slug}`,
        description: `${s.displayDate} · ${s.channel}`,
        category: "언행",
      }),
    ),
    ...POLICIES.map((p) =>
      item({
        title: p.title,
        path: `/wiki/policy/${p.slug}`,
        description: p.scope,
        category: "정책 팩트",
        date: p.asOf,
      }),
    ),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${esc(SITE_NAME)}</title>`,
    `<link>${SITE_URL}</link>`,
    `<description>${esc(SITE_DESCRIPTION)}</description>`,
    "<language>ko</language>",
    `<atom:link href="${abs("/rss.xml")}" rel="self" type="application/rss+xml"/>`,
    ...items,
    "</channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
