import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { arcticRoute } from "@/content/stories/arctic-route/story";
import { validateStory } from "@/content/schema";
import { getMapBackground } from "@/lib/geo/land";
import { buildTrack } from "@/lib/geo/route-track";

import { RouteMap } from "@/features/motion/RouteMap";
import { RouteSwitcher } from "@/features/story/RouteSwitcher";
import { KeyNumbers } from "@/features/story/KeyNumbers";
import { Timeline } from "@/features/timeline/Timeline";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";
import { ShareButton } from "@/features/story/ShareButton";
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

  return (
    <>
      <Suspense fallback={null}>
        <UrlSyncBoundary storyId={story.id} />
      </Suspense>

      <header className="sticky top-0 z-40 border-b border-line bg-ink-800/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <Link
            href="/"
            className="text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
          >
            이재명 업적 위키
          </Link>
          <ShareButton />
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-5 pb-24">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="pt-14 pb-12 sm:pt-20">
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
        </section>

        {unverifiedCount > 0 && (
          <aside
            role="note"
            className="mb-12 rounded-xl border border-warm-400/30 bg-warm-400/[0.07] px-5 py-4"
          >
            <p className="text-sm font-semibold text-warm-400">
              이 스토리는 편집 검증 전 골격입니다
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              {unverifiedCount}개 항목의 출처가 아직 확정되지 않았습니다. 수치와 연표는
              1차 자료 대조 전까지 잠정값이며, 근거 패널에도 같은 표식이 표시됩니다.
            </p>
          </aside>
        )}

        {/* ── Scene: 항로 ─────────────────────────────────────── */}
        <section aria-labelledby="scene-route" className="scroll-mt-20 border-t border-line pt-12">
          <h2
            id="scene-route"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            배를 움직여 보세요
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            북극 중심 지도입니다. 중심에서 멀어질수록 실제 거리도 멀어지므로,
            두 항로의 길이를 눈으로 직접 비교할 수 있습니다.
            배를 끌거나, 배에 포커스를 두고 화살표 키를 누르세요.
          </p>

          <div className="mt-8">
            <RouteSwitcher tracks={tracks} />
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <RouteMap tracks={tracks} background={background} />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                핵심 변화
              </h3>
              <KeyNumbers numbers={story.keyNumbers} claims={story.claims} />
            </div>
          </div>
        </section>

        {/* ── Scene: 타임라인 ─────────────────────────────────── */}
        <section
          aria-labelledby="scene-timeline"
          className="mt-20 scroll-mt-20 border-t border-line pt-12"
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

        <section className="mt-20 border-t border-line pt-12">
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
