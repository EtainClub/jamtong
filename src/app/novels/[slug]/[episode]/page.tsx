import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  NOVELS,
  excerpt,
  getNovel,
  paragraphs,
  publishedEpisodes,
  readingMinutes,
} from "@/content/novels";
import { BackButton } from "@/features/app/BackButton";
import { BottomNav } from "@/features/app/BottomNav";
import { ShareLinkButton } from "@/features/app/ShareLinkButton";
import { ShortsSlot } from "@/features/novels/ShortsSlot";

/** 본문이 있는 편만 주소를 연다. 공개 예정인 편은 시리즈 화면에 자리만 있다. */
export function generateStaticParams() {
  return NOVELS.flatMap((novel) =>
    publishedEpisodes(novel).map((ep) => ({ slug: novel.slug, episode: String(ep.no) })),
  );
}

async function load(params: Promise<{ slug: string; episode: string }>) {
  const { slug, episode } = await params;
  const novel = getNovel(slug);
  const ep = novel?.episodes.find((e) => String(e.no) === episode);
  if (!novel || !ep?.body) return undefined;
  return { novel, ep, body: ep.body };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; episode: string }>;
}): Promise<Metadata> {
  const found = await load(params);
  if (!found) return {};
  const { novel, ep, body } = found;
  const title = `《${novel.title}》 ${ep.no}편${ep.title ? `: ${ep.title}` : ""}`;
  const path = `/novels/${novel.slug}/${ep.no}`;
  return {
    title,
    description: excerpt(body, 140),
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, title, description: excerpt(body, 140) },
  };
}

/**
 * 소설 한 편.
 *
 * 글을 먼저, 숏츠를 그다음에 둔다. 숏츠가 아직 없어도 자리는 그린다.
 * 바닥에는 다음 편으로 가는 카드를 둔다 — 연재물을 읽는 사람이 가장 먼저
 * 찾는 버튼이다.
 */
export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string; episode: string }>;
}) {
  const found = await load(params);
  if (!found) notFound();
  const { novel, ep, body } = found;

  const prev = novel.episodes.find((e) => e.no === ep.no - 1);
  const next = novel.episodes.find((e) => e.no === ep.no + 1);
  const shortsTitle = `《${novel.title}》 ${ep.no}편${ep.title ? ` ${ep.title}` : ""}`;

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[560px] items-center justify-between gap-2 px-4">
          <div className="flex min-w-0 items-center gap-1.5">
            <BackButton fallback={`/novels/${novel.slug}`} />
            <Link
              href={`/novels/${novel.slug}`}
              className="shrink-0 text-sm font-semibold text-smoke transition-colors hover:text-ink"
            >
              《{novel.title}》
            </Link>
          </div>
          <ShareLinkButton
            title={`${shortsTitle} · ${novel.genre}`}
            surface="episode"
            label={{
              text: "공유",
              aria: "이 편 공유",
              copied: "이 편의 링크를 클립보드에 복사했습니다.",
            }}
            compact
          />
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-8">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-ash">
          <span className="rounded-full bg-ink px-2 py-0.5 text-eggshell">{novel.genre}</span>
          <span>
            {ep.no} / {novel.total}편
          </span>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes(body)}분</span>
        </div>

        <p className="mt-4 text-[13px] font-semibold text-smoke">《{novel.title}》</p>
        <h1 className="mt-1 text-[28px] font-light tracking-[-0.02em] text-ink">
          {ep.no}편{ep.title ? `: ${ep.title}` : ""}
        </h1>
        <p className="mt-2 text-[12px] text-ash">
          {novel.author}
          {ep.postedAt && <span className="tabular"> · {ep.postedAt.replaceAll("-", ".")}</span>}
        </p>

        <article className="mt-8 space-y-4 text-[16px] leading-[1.85] text-graphite">
          {paragraphs(body).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        {ep.xUrl && (
          <a
            href={ep.xUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-block text-[12px] text-navy hover:underline"
          >
            X에서 원문 보기 ↗
          </a>
        )}

        <section aria-labelledby="episode-shorts" className="mt-10 border-t border-stone pt-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="episode-shorts" className="text-[13px] font-bold text-ink">
              이 편의 숏츠
            </h2>
            <span className="text-[11px] text-ash">{ep.no}편</span>
          </div>
          <div className="mx-auto mt-3 w-full max-w-[300px]">
            <ShortsSlot no={ep.no} youtubeId={ep.shortsId} title={shortsTitle} />
          </div>
          {!ep.shortsId && (
            <p className="mt-3 text-center text-[12px] leading-relaxed text-smoke">
              이 편으로 만든 숏츠가 올라오면 이 자리에 붙습니다.
            </p>
          )}
        </section>

        <nav aria-label="다른 편" className="mt-10 space-y-2">
          {next && (
            <EpisodeCard
              href={next.body ? `/novels/${novel.slug}/${next.no}` : undefined}
              kicker={`다음 이야기 · ${next.no}편`}
              title={next.title ?? "제목 미정"}
              note={next.body ? undefined : "공개 예정"}
            />
          )}
          {prev?.body && (
            <EpisodeCard
              href={`/novels/${novel.slug}/${prev.no}`}
              kicker={`이전 이야기 · ${prev.no}편`}
              title={prev.title ?? "제목 미정"}
            />
          )}
          <Link
            href={`/novels/${novel.slug}`}
            className="block rounded-card border border-stone px-4 py-3 text-center text-[13px] font-semibold text-graphite transition-colors hover:border-graphite"
          >
            전체 {novel.total}편 보기
          </Link>
        </nav>
      </main>

      <BottomNav />
    </>
  );
}

function EpisodeCard({
  href,
  kicker,
  title,
  note,
}: {
  href?: string;
  kicker: string;
  title: string;
  note?: string;
}) {
  const inner = (
    <>
      <span className="text-[11px] font-semibold text-ash">{kicker}</span>
      <span className="mt-0.5 flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-bold text-ink">{title}</span>
        {note && <span className="shrink-0 text-[11px] text-ash">{note}</span>}
      </span>
    </>
  );
  return href ? (
    <Link
      href={href}
      className="block rounded-card border border-stone px-4 py-3 transition-colors hover:border-graphite"
    >
      {inner}
    </Link>
  ) : (
    <div aria-disabled="true" className="rounded-card border border-dashed border-stone px-4 py-3">
      {inner}
    </div>
  );
}
