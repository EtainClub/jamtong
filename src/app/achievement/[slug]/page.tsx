import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { ACHIEVEMENTS, getAchievement } from "@/content/achievements";
import { validateAchievement, type Achievement } from "@/content/schema";

import { AchievementHero } from "@/features/achievement/AchievementHero";
import { Section } from "@/features/achievement/Section";
import { ShortsSection } from "@/features/achievement/ShortsSection";
import { DraftBanner } from "@/features/achievement/DraftBanner";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";
import { ShareButton } from "@/features/achievement/ShareButton";
import { SceneNav } from "@/features/achievement/SceneNav";
import { SCENES_BY_ACHIEVEMENT } from "@/features/achievement/scenes";
import { AskGuide } from "@/features/agent/AskGuide";
import { ViewSwitch, ViewToggle } from "@/features/achievement/ViewSwitch";
import { Eli5Section } from "@/features/eli5/Eli5Section";
import { UrlSyncBoundary } from "@/features/achievement/UrlSyncBoundary";
import { ArcticRouteLayout } from "@/features/achievement/layouts/ArcticRouteLayout";
import { DaejangdongLayout } from "@/features/achievement/layouts/DaejangdongLayout";
import { StockMarketLayout } from "@/features/achievement/layouts/StockMarketLayout";
import { SeongnamWelfareLayout } from "@/features/achievement/layouts/SeongnamWelfareLayout";

/**
 * 스토리 페이지 = 공통 골격 + 스토리별 레이아웃 분기.
 *
 * 씬 구성을 데이터로 기술하는 엔진(설계서 10장)은 아직 만들지 않는다.
 * 스토리 2개로는 어떤 축이 데이터이고 어떤 축이 코드인지 알 수 없다.
 * (설계 검토 문서 5.1)
 */

type LayoutConfig = {
  Layout: (props: { achievement: Achievement }) => React.ReactNode;
  heroHighlights?: { claimId: string; label: string }[];
  /** AI 안내 패널을 열었을 때 먼저 보여줄 질문. */
  askSuggestions: string[];
};

const LAYOUTS: Record<string, LayoutConfig> = {
  "arctic-route": {
    Layout: ArcticRouteLayout,
    heroHighlights: [
      { claimId: "claim-shortest-route", label: "최단거리 항로" },
      { claimId: "claim-trial-voyage", label: "시범운항 계획" },
    ],
    askSuggestions: [
      "얼마나 짧아지나요?",
      "2026년에 무슨 일이 있나요?",
      "러시아 제재가 왜 변수인가요?",
    ],
  },
  daejangdong: {
    Layout: DaejangdongLayout,
    heroHighlights: [
      { claimId: "claim-combined-district", label: "결합 개발구역" },
      { claimId: "claim-land-use", label: "토지이용계획" },
    ],
    askSuggestions: [
      "공공이 가져간 게 뭔가요?",
      "민간개발이었으면 어떻게 달랐나요?",
      "2014년에 무슨 결정이 있었나요?",
    ],
  },
  "seongnam-welfare": {
    Layout: SeongnamWelfareLayout,
    heroHighlights: [
      { claimId: "claim-three", label: "세 가지를 묶어서" },
      { claimId: "claim-withdraw", label: "결론 없이 취하" },
    ],
    askSuggestions: [
      "무엇을 공짜로 해줬나요?",
      "정부는 왜 막았나요?",
      "소송은 어떻게 끝났나요?",
    ],
  },
  "stock-market": {
    Layout: StockMarketLayout,
    heroHighlights: [
      { claimId: "claim-index-series", label: "지수 추이" },
      { claimId: "claim-reform", label: "체질개선 방안" },
    ],
    askSuggestions: [
      "지수가 왜 다시 내렸나요?",
      "무슨 제도가 바뀌었나요?",
      "2026년 3월에 무슨 발표가 있었나요?",
    ],
  },
};

export function generateStaticParams() {
  return ACHIEVEMENTS.map((achievement) => ({ slug: achievement.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/achievement/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const achievement = getAchievement(slug);
  if (!achievement) return {};

  const isDraft = achievement.publishStatus === "draft";

  return {
    title: achievement.title,
    description: achievement.summary,
    // 검증 전 골격은 색인되지 않는다.
    robots: isDraft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${achievement.title} — ${achievement.subtitle}`,
      description: achievement.summary,
    },
  };
}

export default async function AchievementPage({ params }: PageProps<"/achievement/[slug]">) {
  const { slug } = await params;
  const achievement = getAchievement(slug);
  const config = achievement ? LAYOUTS[achievement.slug] : undefined;
  if (!achievement || !config) notFound();

  // 참조 무결성과 공개 조건은 빌드 시점에 깨진다.
  const errors = validateAchievement(achievement);
  if (errors.length > 0) {
    throw new Error(`콘텐츠 검증 실패 (${achievement.slug}):\n${errors.join("\n")}`);
  }

  const { Layout, heroHighlights, askSuggestions } = config;
  // 쇼츠가 없는 업적에 "쇼츠" 탭이 뜨면 눌러도 갈 곳이 없다.
  const scenes = (SCENES_BY_ACHIEVEMENT[achievement.slug] ?? []).filter(
    (scene) => scene.id !== "shorts" || achievement.shorts.length > 0,
  );

  return (
    <>
      <Suspense fallback={null}>
        <UrlSyncBoundary achievementId={achievement.id} />
      </Suspense>

      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-5">
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold text-smoke transition-colors hover:text-ink"
          >
            이재명 업적 위키
          </Link>
          <SceneNav scenes={scenes} />
          <ShareButton />
        </div>
      </header>

      <main id="main" className="flex-1 pb-24">
        <AchievementHero achievement={achievement} highlights={heroHighlights} />
        <DraftBanner achievement={achievement} />

        {achievement.eli5 && (
          <div className="mx-auto max-w-5xl px-5 pb-8">
            <ViewToggle />
          </div>
        )}

        <div className={achievement.publishStatus === "draft" ? "mt-12" : ""}>
          <ViewSwitch
            easy={
              achievement.eli5 ? (
                <Eli5Section eli5={achievement.eli5} claims={achievement.claims} />
              ) : null
            }
            full={
              <>
                <Layout achievement={achievement} />
                {/* ⑦ 쇼츠. 업적마다 따로 붙이면 빠뜨리는 곳이 생기므로 여기서 한 번에 건다. */}
                {achievement.shorts.length > 0 && (
                  <Section
                    scene="shorts"
                    heading="짧게 보기"
                    lede="이 업적을 1분 안에 전하는 영상입니다. 영상에서 말한 내용의 근거도 함께 있습니다."
                  >
                    <ShortsSection shorts={achievement.shorts} claims={achievement.claims} />
                  </Section>
                )}
              </>
            }
          />
        </div>
      </main>

      <AskGuide
        achievementSlug={achievement.slug}
        claims={achievement.claims}
        suggestions={askSuggestions}
      />
      <EvidenceDrawer claims={achievement.claims} sources={achievement.sources} />
    </>
  );
}
