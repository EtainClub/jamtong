import Link from "next/link";
import type { Metadata } from "next";

import { GardenLanding } from "@/features/garden/GardenLanding";
import { PUBLIC_ID } from "@/features/garden/rules";
import { loadBookCard } from "@/lib/og/book-state";

/**
 * 특별한 책의 장 카드 링크 — /bk/<책>/<장>?g=<공개 정원 id>. 방에 책을 놓은 사람이 독서대에서 보낸다.
 *
 * /r/[rid]처럼 크롤러에게는 카드(/api/book-card)를 보이고, 사람은 곧장 그 장의 요약(/books/<책>/<장>)으로 간다.
 * 장이 없으면 책 목록으로 — 링크가 막다른 길이 되지 않게.
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; chapter: string }>; searchParams: Promise<{ g?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ slug, chapter }, { g }] = await Promise.all([params, searchParams]);
  const gid = g && PUBLIC_ID.test(g) ? g : null;
  const card = await loadBookCard(slug, chapter, gid).catch(() => null);
  if (!card) return { title: "잼통 · 자서전 요약", robots: { index: false, follow: true } };
  const title = `${card.title} · 『${card.bookTitle}』 ${card.order}장`;
  const description = `${card.owner ? `${card.owner}의 서재에서 — ` : ""}${card.summary}`;
  const image = `/api/book-card?b=${encodeURIComponent(slug)}&c=${encodeURIComponent(chapter)}${gid ? `&g=${gid}` : ""}`;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: `/books/${slug}/${chapter}` },
    openGraph: { type: "article", title, description, images: [{ url: image, width: 1200, height: 630, alt: `${card.title} 장 카드` }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function BookCardPage({ params }: Props) {
  const { slug, chapter } = await params;
  const card = await loadBookCard(slug, chapter, null).catch(() => null);
  const href = card ? `/books/${slug}/${chapter}` : "/books";
  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center px-4 py-16">
      <GardenLanding href={href} />
      <p className="text-[12px] font-semibold text-ash">잼통 · 자서전 요약</p>
      <h1 className="mt-2 text-2xl font-light tracking-tight text-ink">{card ? card.title : "자서전 요약"}</h1>
      {card && <p className="mt-3 text-[14px] leading-relaxed text-smoke">{card.summary}</p>}
      <Link href={href} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-eggshell">
        이 장 읽으러 가기
      </Link>
    </main>
  );
}
