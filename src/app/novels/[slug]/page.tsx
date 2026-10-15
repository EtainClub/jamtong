import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  NOVELS,
  excerpt,
  getNovel,
  publishedEpisodes,
  readingMinutes,
} from "@/content/novels";
import { BackButton } from "@/features/app/BackButton";
import { BottomNav } from "@/features/app/BottomNav";
import { ShareLinkButton } from "@/features/app/ShareLinkButton";
import { ShortsRow } from "@/features/novels/ShortsRow";

export function generateStaticParams() {
  return NOVELS.map((novel) => ({ slug: novel.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const novel = getNovel(slug);
  if (!novel) return {};
  const description = `${novel.genre} 《${novel.title}》 전 ${novel.total}편. ${novel.logline}`;
  return {
    title: `《${novel.title}》 · 소설`,
    description,
    alternates: { canonical: `/novels/${slug}` },
    openGraph: {
      type: "website",
      url: `/novels/${slug}`,
      title: `《${novel.title}》`,
      description,
    },
  };
}

/**
 * 소설 시리즈 소개.
 *
 * 스트리밍 서비스의 시리즈 화면처럼 짰다 — 검은 첫 화면에 제목과 줄거리,
 * "1편 보기"가 있고, 아래로 숏츠 줄과 편 목록이 이어진다. 검은 바탕도
 * 무채색이므로 "UI는 무채색" 규칙 안에 있다.
 *
 * 열다섯 편의 자리를 모두 그린다. 아직 오지 않은 편은 누를 수 없고
 * "공개 예정"이라고 적는다.
 */
export default async function NovelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const novel = getNovel(slug);
  if (!novel) notFound();

  const published = publishedEpisodes(novel);
  const shorts = novel.episodes.filter((e) => e.shortsId).length;
  const first = published[0];
  const latest = published.at(-1);

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[560px] items-center justify-between gap-2 px-4 text-white [&_button]:text-white/80">
          <div className="flex min-w-0 items-center gap-1.5">
            <BackButton fallback="/" />
            <span className="shrink-0 text-sm font-semibold text-white/80">소설</span>
          </div>
          <ShareLinkButton
            title={`《${novel.title}》 · ${novel.genre}`}
            surface="novel"
            label={{
              text: "공유",
              aria: "이 소설 공유",
              copied: "이 소설의 링크를 클립보드에 복사했습니다.",
            }}
            compact
          />
        </div>
      </header>

      <main id="main" className="w-full flex-1 bg-neutral-950 text-white">
        {/* 첫 화면 */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_0%,rgba(255,255,255,0.14),transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 top-6 select-none text-[180px] font-black leading-none tracking-tighter text-white/[0.04]"
          >
            免疫
          </div>

          <div className="relative mx-auto max-w-[560px] px-4 pb-8 pt-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
              연재 {novel.genre}
            </p>
            <h1 className="mt-3 text-[56px] font-black leading-none tracking-[-0.04em]">
              {novel.title}
            </h1>
            <p className="mt-4 text-[15px] font-medium leading-snug text-white/90">
              {novel.logline}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-white/60">
              <span className="font-semibold text-white">전 {novel.total}편</span>
              <span aria-hidden="true">·</span>
              <span>
                {published.length}편 공개
                {published.length < novel.total && " · 연재 중"}
              </span>
              <span aria-hidden="true">·</span>
              <span>숏츠 {shorts}편</span>
              {latest?.postedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular">최근 {latest.postedAt.replaceAll("-", ".")}</span>
                </>
              )}
            </div>

            {first && (
              <Link
                href={`/novels/${novel.slug}/${first.no}`}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-bold text-neutral-950 transition-colors hover:bg-white/85"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
                </svg>
                1편 보기
              </Link>
            )}
            {latest && latest !== first && (
              <Link
                href={`/novels/${novel.slug}/${latest.no}`}
                className="mt-2 flex h-11 w-full items-center justify-center rounded-full border border-white/25 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                최신 {latest.no}편 이어 보기
              </Link>
            )}

            <p className="mt-6 text-[13.5px] leading-relaxed text-white/75">{novel.synopsis}</p>
            <p className="mt-3 text-[12px] text-white/50">
              글 ·{" "}
              <a
                href={novel.authorUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/80 hover:underline"
              >
                {novel.author}
              </a>
            </p>
          </div>
        </section>

        {/* 숏츠 줄 */}
        <section aria-labelledby="novel-shorts" className="mx-auto max-w-[560px] pb-2 pt-2">
          <div className="flex items-baseline justify-between gap-3 px-4">
            <h2 id="novel-shorts" className="text-[16px] font-bold">
              숏츠로 보기
            </h2>
            <span className="text-[11px] text-white/50">
              {shorts}/{novel.total}
            </span>
          </div>
          <ShortsRow
            novelTitle={novel.title}
            episodes={novel.episodes.map(({ no, title, shortsId }) => ({ no, title, shortsId }))}
          />
        </section>

        {/* 편 목록 */}
        <section aria-labelledby="episodes" className="mx-auto max-w-[560px] px-4 pb-12 pt-8">
          <div className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-3">
            <h2 id="episodes" className="text-[16px] font-bold">
              회차
            </h2>
            <span className="text-[12px] text-white/50">시즌 1 · {novel.total}편</span>
          </div>

          <ol className="divide-y divide-white/10">
            {novel.episodes.map((ep) => {
              const open = Boolean(ep.body);
              const inner = (
                <div className="flex gap-4 py-4">
                  <span
                    className={`w-8 shrink-0 pt-0.5 text-right text-[26px] font-black leading-none tracking-tighter ${
                      open ? "text-white" : "text-white/20"
                    }`}
                  >
                    {ep.no}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span
                        className={`truncate text-[15px] font-bold ${
                          open ? "text-white" : "text-white/40"
                        }`}
                      >
                        {ep.title ?? "제목 미정"}
                      </span>
                      <span className="tabular shrink-0 text-[11px] text-white/45">
                        {open && ep.body
                          ? `${readingMinutes(ep.body)}분`
                          : "공개 예정"}
                      </span>
                    </div>
                    {open && ep.body ? (
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-white/60">
                        {excerpt(ep.body)}
                      </p>
                    ) : (
                      <p className="mt-1 text-[12px] text-white/30">아직 올라오지 않았습니다.</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          open ? "bg-white/15 text-white" : "border border-white/15 text-white/35"
                        }`}
                      >
                        글 {open ? "공개" : "준비 중"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          ep.shortsId
                            ? "bg-white/15 text-white"
                            : "border border-white/15 text-white/35"
                        }`}
                      >
                        숏츠 {ep.shortsId ? "공개" : "준비 중"}
                      </span>
                      {ep.postedAt && (
                        <span className="tabular px-1 py-0.5 font-normal text-white/40">
                          {ep.postedAt.replaceAll("-", ".")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
              return (
                <li key={ep.no}>
                  {open ? (
                    <Link
                      href={`/novels/${novel.slug}/${ep.no}`}
                      className="-mx-2 block rounded-card px-2 transition-colors hover:bg-white/[0.06]"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div aria-disabled="true">{inner}</div>
                  )}
                </li>
              );
            })}
          </ol>

          <p className="mt-8 border-l-2 border-white/15 pl-3 text-[12px] leading-relaxed text-white/50">
            이 작품은 소설입니다. 이 사이트의 업적·언행·정책 자료와 달리 사실 확인을 거친
            기록이 아니며, 위키의 근거로 쓰지 않습니다.
          </p>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
