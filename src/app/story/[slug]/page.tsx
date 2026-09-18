import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { arcticRoute } from "@/content/stories/arctic-route/story";
import { validateStory } from "@/content/schema";
import { getMapBackground } from "@/lib/geo/land";
import { buildTrack } from "@/lib/geo/route-track";

import { ScrollRouteScene } from "@/features/motion/ScrollRouteScene";
import { KeyNumbers } from "@/features/story/KeyNumbers";
import { Timeline } from "@/features/timeline/Timeline";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";
import { ShareButton } from "@/features/story/ShareButton";
import { SceneNav } from "@/features/story/SceneNav";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { UrlSyncBoundary } from "@/features/story/UrlSyncBoundary";

const STORIES = [arcticRoute];

export function generateStaticParams() {
  return STORIES.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/story/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = STORIES.find((s) => s.slug === slug);
  if (!story) return {};

  return {
    title: story.title,
    description: story.summary,
    openGraph: {
      title: `${story.title} — ${story.subtitle}`,
      description: story.summary,
    },
  };
}

export default async function StoryPage({ params }: PageProps<"/story/[slug]">) {
  const { slug } = await params;
  const story = STORIES.find((s) => s.slug === slug);
  if (!story) notFound();

  // 참조 무결성은 빌드 시점에 깨진다. 잘못된 id가 화면에 도달하지 않는다.
  const errors = validateStory(story);
  if (errors.length > 0) {
    throw new Error(`콘텐츠 검증 실패 (${story.slug}):\n${errors.join("\n")}`);
  }

  const background = getMapBackground();
  // 경로 기하는 서버에서 화면 좌표로 구워 넘긴다. 클라이언트에 d3-geo가 필요 없다.
  const tracks = story.routes.map(buildTrack);
  const unverifiedCount = story.claims.filter((c) => !c.verified).length;

  // 도입부 단정에도 근거를 붙인다. 요약문이야말로 가장 많이 읽히는 주장이다.
  const heroClaims = (
    [
      ["claim-shortest-route", "최단거리 항로"],
      ["claim-trial-voyage", "시범운항 계획"],
    ] as const
  ).flatMap(([id, label]) => {
    const claim = story.claims.find((c) => c.id === id);
    return claim ? [{ claim, label }] : [];
  });

  return (
    <>
      <Suspense fallback={null}>
        <UrlSyncBoundary storyId={story.id} />
      </Suspense>

      <header className="sticky top-0 z-40 h-14 border-b border-line bg-ink-800/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-5">
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
          >
            이재명 업적 위키
          </Link>
          <SceneNav />
          <ShareButton />
        </div>
      </header>

      <main id="main" className="flex-1 pb-24">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section
          data-scene="hero"
          className="mx-auto max-w-5xl scroll-mt-14 px-5 pt-14 pb-12 sm:pt-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ice-400">
            {story.kicker}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.15] tracking-tight text-text-primary sm:text-6xl">
            {story.title}
          </h1>
          <p className="mt-4 text-xl font-medium leading-snug text-text-secondary sm:text-2xl">
            {story.subtitle}
          </p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-text-secondary sm:text-base">
            {story.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {heroClaims.map(({ claim, label }) => (
              <EvidenceButton
                key={claim.id}
                claimId={claim.id}
                count={claim.sourceIds.length}
                label={label}
              />
            ))}
          </div>

          {unverifiedCount > 0 && (
            <aside
              role="note"
              className="mt-10 rounded-xl border border-warm-400/30 bg-warm-400/[0.07] px-5 py-4"
            >
              <p className="text-sm font-semibold text-warm-400">
                일부 항목은 아직 출처 확정 전입니다
              </p>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
                정책·일정·지원 규모는 해양수산부 「2026년도 업무계획」 보도자료로 확인된
                내용입니다. 반면 거리·운항일수 수치 {unverifiedCount}건은 해당 자료가 다루지
                않아 잠정값으로 두었고, 근거 패널에도 같은 표식이 표시됩니다.
              </p>
            </aside>
          )}
        </section>

        {/* ── Scene: 항로 (스크롤 구동) ───────────────────────── */}
        <section
          data-scene="route"
          aria-labelledby="scene-route"
          className="scroll-mt-14 border-t border-line"
        >
          <div className="mx-auto max-w-5xl px-5 pt-12">
            <h2
              id="scene-route"
              className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
            >
              부산에서 로테르담까지
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
              북극 중심 지도입니다. 중심에서 멀어질수록 실제 거리도 멀어지므로,
              두 항로의 길이를 눈으로 직접 비교할 수 있습니다.
              스크롤하면 배가 항로를 따라 나아갑니다.
            </p>
          </div>

          <div className="mx-auto max-w-5xl px-5">
            <ScrollRouteScene tracks={tracks} background={background} />
          </div>
        </section>

        {/* ── 핵심 숫자 ──────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl border-t border-line px-5 pt-12">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            무엇이 준비되고 있나
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            북극항로를 운항하는 선사에 제공되는 지원과 혜택입니다.
          </p>
          <KeyNumbers
            numbers={story.keyNumbers}
            claims={story.claims}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          />
        </section>

        {/* ── Scene: 타임라인 ─────────────────────────────────── */}
        <section
          data-scene="timeline"
          aria-labelledby="scene-timeline"
          className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
        >
          <h2
            id="scene-timeline"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            어떻게 여기까지 왔나
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            시점을 옮기면 그때의 상황이 나타납니다.
          </p>

          <div className="mt-10">
            <Timeline events={story.timeline} claims={story.claims} />
          </div>
        </section>

        {/* ── Scene: 공유 ─────────────────────────────────────── */}
        <section
          data-scene="share"
          className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            이 화면을 그대로 공유하기
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            배의 위치, 선택한 항로, 열어 둔 시점까지 지금 보고 있는 상태가 링크에 담깁니다.
          </p>
          <div className="mt-5">
            <ShareButton />
          </div>
        </section>
      </main>

      <EvidenceDrawer claims={story.claims} sources={story.sources} />
    </>
  );
}
