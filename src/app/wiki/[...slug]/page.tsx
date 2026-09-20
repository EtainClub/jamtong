import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BackButton } from "@/features/app/BackButton";
import { BottomNav } from "@/features/app/BottomNav";
import { WikiNotes } from "@/features/wiki/WikiNotes";
import { allPages, contentPages, getPage, pageSummary } from "@/lib/wiki/load";
import { JsonLd, articleLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { renderWiki } from "@/lib/wiki/markdown";

const KIND_LABEL: Record<string, string> = {
  source: "소스",
  concept: "개념",
  entity: "인물·기관",
  event: "사건",
  synthesis: "종합",
  meta: "기록",
};

export function generateStaticParams() {
  return contentPages().map((page) => ({ slug: page.name.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug.join("/"));
  if (!page) return {};

  const summary = pageSummary(page);
  const path = `/wiki/${page.name}`;
  /* 위키 주소가 catch-all이라 opengraph-image 파일을 둘 수 없다. 카드는 라우트가 그린다. */
  const card = `/api/wiki-card?name=${encodeURIComponent(page.name)}`;

  return {
    title: `${page.title} · 위키`,
    description: summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: `${page.title} — ${KIND_LABEL[page.kind] ?? page.kind}`,
      description: summary,
      modifiedTime: page.updated,
      images: [{ url: card, width: 1200, height: 630, alt: `${page.title} 위키 카드` }],
    },
    twitter: { card: "summary_large_image", images: [card] },
  };
}

/**
 * 위키 페이지 한 장.
 *
 * 사람이 고치는 화면이 아니다. 내용은 `wiki/**`에 있고 에이전트가 ingest와
 * query를 하며 갱신한다. 여기서는 그것을 읽을 수 있게만 한다.
 */
export default async function WikiPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = getPage(slug.join("/"));
  if (!page) notFound();

  const titles = new Map(allPages().map((p) => [p.name, p.title]));
  const { nodes, notes } = renderWiki(page.body, titles);

  return (
    <>
      <JsonLd
        data={articleLd({
          path: `/wiki/${page.name}`,
          headline: page.title,
          description: pageSummary(page),
          dateModified: page.updated,
          image: `/api/wiki-card?name=${encodeURIComponent(page.name)}`,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "위키", path: "/wiki" },
          { name: page.title, path: `/wiki/${page.name}` },
        ])}
      />

      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[560px] items-center gap-1.5 px-4">
          <BackButton />
          <Link
            href="/wiki"
            className="shrink-0 text-sm font-semibold text-smoke transition-colors hover:text-ink"
          >
            위키
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-ash">
          <span className="rounded-full bg-taupe px-2 py-0.5 text-navy">
            {KIND_LABEL[page.kind] ?? page.kind}
          </span>
          {page.updated && <span>갱신 {page.updated}</span>}
          <span className="font-mono text-[10px] tracking-tight">{page.name}</span>
        </div>

        {nodes}
        <WikiNotes notes={notes} />
      </main>

      <BottomNav />
    </>
  );
}
