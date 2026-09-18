import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { STORIES, getStory } from "@/content/stories";
import { validateStory, type Story } from "@/content/schema";

import { StoryHero } from "@/features/story/StoryHero";
import { DraftBanner } from "@/features/story/DraftBanner";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";
import { ShareButton } from "@/features/story/ShareButton";
import { SceneNav, type SceneNavItem } from "@/features/story/SceneNav";
import { UrlSyncBoundary } from "@/features/story/UrlSyncBoundary";
import { ArcticRouteLayout } from "@/features/story/layouts/ArcticRouteLayout";
import { DaejangdongLayout } from "@/features/story/layouts/DaejangdongLayout";

/**
 * 스토리 페이지 = 공통 골격 + 스토리별 레이아웃 분기.
 *
 * 씬 구성을 데이터로 기술하는 엔진(설계서 10장)은 아직 만들지 않는다.
 * 스토리 2개로는 어떤 축이 데이터이고 어떤 축이 코드인지 알 수 없다.
 * (설계 검토 문서 5.1)
 */

type LayoutConfig = {
  Layout: (props: { story: Story }) => React.ReactNode;
  scenes: SceneNavItem[];
  heroHighlights?: { claimId: string; label: string }[];
};

const LAYOUTS: Record<string, LayoutConfig> = {
  "arctic-route": {
    Layout: ArcticRouteLayout,
    scenes: [
      { id: "hero", label: "개요" },
      { id: "route", label: "항로" },
      { id: "compare", label: "비교" },
      { id: "timeline", label: "경과" },
      { id: "share", label: "공유" },
    ],
    heroHighlights: [
      { claimId: "claim-shortest-route", label: "최단거리 항로" },
      { claimId: "claim-trial-voyage", label: "시범운항 계획" },
    ],
  },
  daejangdong: {
    Layout: DaejangdongLayout,
    scenes: [
      { id: "hero", label: "개요" },
      { id: "timeline", label: "경과" },
      { id: "land", label: "토지이용" },
      { id: "flow", label: "자금 흐름" },
      { id: "counterpoint", label: "쟁점" },
      { id: "share", label: "공유" },
    ],
    heroHighlights: [
      { claimId: "claim-combined-district", label: "결합 개발구역" },
      { claimId: "claim-land-use", label: "토지이용계획" },
    ],
  },
};

export function generateStaticParams() {
  return STORIES.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/story/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};

  const isDraft = story.publishStatus === "draft";

  return {
    title: story.title,
    description: story.summary,
    // 검증 전 골격은 색인되지 않는다.
    robots: isDraft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${story.title} — ${story.subtitle}`,
      description: story.summary,
    },
  };
}

export default async function StoryPage({ params }: PageProps<"/story/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  const config = story ? LAYOUTS[story.slug] : undefined;
  if (!story || !config) notFound();

  // 참조 무결성과 공개 조건은 빌드 시점에 깨진다.
  const errors = validateStory(story);
  if (errors.length > 0) {
    throw new Error(`콘텐츠 검증 실패 (${story.slug}):\n${errors.join("\n")}`);
  }

  const { Layout, scenes, heroHighlights } = config;

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
          <SceneNav scenes={scenes} />
          <ShareButton />
        </div>
      </header>

      <main id="main" className="flex-1 pb-24">
        <StoryHero story={story} highlights={heroHighlights} />
        <DraftBanner story={story} />
        <div className={story.publishStatus === "draft" ? "mt-12" : ""}>
          <Layout story={story} />
        </div>
      </main>

      <EvidenceDrawer claims={story.claims} sources={story.sources} />
    </>
  );
}
