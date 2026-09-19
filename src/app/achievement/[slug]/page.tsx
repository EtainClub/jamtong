import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { ACHIEVEMENTS, getAchievement } from "@/content/achievements";
import { validateAchievement, type Achievement } from "@/content/schema";

import { AchievementHero } from "@/features/achievement/AchievementHero";
import { Section } from "@/features/achievement/Section";
import { ShortsSection } from "@/features/achievement/ShortsSection";
import { EvidenceStatus } from "@/features/achievement/EvidenceStatus";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";
import { ShareButton } from "@/features/achievement/ShareButton";
import { SceneNav } from "@/features/achievement/SceneNav";
import { BackButton } from "@/features/app/BackButton";
import { BottomNav } from "@/features/app/BottomNav";
import { scenesFor } from "@/features/achievement/scenes";
import { AskGuide } from "@/features/agent/AskGuide";
import { ViewSwitch, ViewToggle } from "@/features/achievement/ViewSwitch";
import { Eli5Section } from "@/features/eli5/Eli5Section";
import { UrlSyncBoundary } from "@/features/achievement/UrlSyncBoundary";
import { ArcticRouteLayout } from "@/features/achievement/layouts/ArcticRouteLayout";
import { DaejangdongLayout } from "@/features/achievement/layouts/DaejangdongLayout";
import { StockMarketLayout } from "@/features/achievement/layouts/StockMarketLayout";
import { SeongnamWelfareLayout } from "@/features/achievement/layouts/SeongnamWelfareLayout";
import { SeongnamDebtLayout } from "@/features/achievement/layouts/SeongnamDebtLayout";
import { NarrativeLayout } from "@/features/achievement/layouts/NarrativeLayout";

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
  "gyeonggi-basic-income": {
    Layout: (props) => (
      <NarrativeLayout
        {...props}
        copy={{
          timelineHeading: "세 차례, 그때마다 대상이 달랐다",
          timelineLede:
            "시점을 옮기면 그때 누가 받았는지가 나타납니다. 1·2차와 3차는 대상이 다릅니다.",
          numbersHeading: "규모로 보면",
          numbersLede: "회차마다 대상과 금액이 다릅니다.",
          relationsHeading: "돈이 어디서 나와 어디에 머물렀나",
          relationsLede:
            "이 정책의 핵심은 금액이 아니라 지급 방식입니다. 기금에서 나온 돈이 지역화폐를 거쳐 어디에 남았는지 봅니다.",
          shareWhat: "보고 있는 시점과 열어 둔 근거가 링크에 담깁니다.",
        }}
      />
    ),
    heroHighlights: [
      { claimId: "claim-first", label: "1차 전 도민" },
      { claimId: "claim-third", label: "3차 대상" },
    ],
    askSuggestions: [
      "얼마를 누구에게 줬나요?",
      "왜 현금이 아니라 지역화폐인가요?",
      "3차는 왜 전 도민이 아닌가요?",
    ],
  },
  "gyeonggi-valley": {
    Layout: (props) => (
      <NarrativeLayout
        {...props}
        copy={{
          timelineHeading: "2년에 걸쳐 걷어냈다",
          timelineLede:
            "경기도가 수치를 밝힌 시점만 짚습니다. 시점을 옮기면 그때까지 성립한 관계만 남습니다.",
          numbersHeading: "숫자로 보면",
          numbersLede: "마지막 발표 시점 기준입니다.",
          relationsHeading: "누가 걷어내고, 누구에게 돌아갔나",
          relationsLede:
            "힘으로 밀어붙인 것이 아니라는 것이 이 정책의 핵심입니다. 자진철거와 행정대집행이 각각 어디에 걸리는지 봅니다.",
          shareWhat: "보고 있는 시점과 열어 둔 근거가 링크에 담깁니다.",
        }}
      />
    ),
    heroHighlights: [
      { claimId: "claim-2021", label: "정비 완료" },
      { claimId: "claim-2020", label: "자진철거 비중" },
    ],
    askSuggestions: [
      "얼마나 걷어냈나요?",
      "강제로 철거한 곳은 얼마나 되나요?",
      "아직 남은 곳이 있나요?",
    ],
  },
  "seongnam-meals": {
    Layout: (props) => (
      <NarrativeLayout
        {...props}
        copy={{
          timelineHeading: "1학년에서 모든 학년까지, 11년",
          timelineLede:
            "시점을 옮기면 그때 누가 포함돼 있었는지가 나타납니다. 시작한 시정과 넓힌 시정과 완성한 시정이 다릅니다.",
          numbersHeading: "얼마나 넓어졌나",
          numbersLede: "고등학교까지 포함한 뒤의 규모입니다.",
          relationsHeading: "어디까지 갔나",
          relationsLede:
            "한 정책이 어디까지 넓어졌는지 봅니다. 위 연표에서 시점을 옮기면 그때까지 포함된 대상만 남습니다.",
          shareWhat: "보고 있는 시점과 열어 둔 근거가 링크에 담깁니다.",
        }}
      />
    ),
    heroHighlights: [
      { claimId: "claim-expand", label: "의무교육 전면" },
      { claimId: "claim-scale", label: "지원 규모" },
    ],
    askSuggestions: [
      "언제부터 공짜였나요?",
      "고등학교는 언제부터인가요?",
      "몇 명이 받나요?",
    ],
  },
  "seongnam-hospital": {
    Layout: (props) => (
      <NarrativeLayout
        {...props}
        copy={{
          timelineHeading: "17년이 걸렸습니다",
          timelineLede:
            "시점을 옮기면 그때 무엇이 멈춰 있었는지가 나타납니다. 조례가 통과되고도 7년이 비어 있습니다.",
          numbersHeading: "무엇이 지어졌나",
          numbersLede: "문을 열었을 때의 규모입니다.",
          relationsHeading: "누가 만들었나",
          relationsLede:
            "가운데가 성남시민입니다. 발의한 쪽과 통과시킨 쪽, 지은 쪽이 각각 다릅니다. 위 연표에서 시점을 옮기면 그때까지 성립한 관계만 남습니다.",
          shareWhat: "보고 있는 시점과 열어 둔 근거가 링크에 담깁니다.",
        }}
      />
    ),
    heroHighlights: [
      { claimId: "claim-first", label: "전국 첫 주민발의" },
      { claimId: "claim-groundbreak", label: "가결 7년 뒤 착공" },
    ],
    askSuggestions: [
      "누가 만들자고 했나요?",
      "왜 17년이나 걸렸나요?",
      "언제 문을 열었나요?",
    ],
  },
  "seongnam-debt": {
    Layout: SeongnamDebtLayout,
    heroHighlights: [
      { claimId: "claim-moratorium", label: "선언한 빚" },
      { claimId: "claim-graduation", label: "3년 6개월" },
    ],
    askSuggestions: [
      "무슨 빚이었나요?",
      "왜 모라토리엄을 선언했나요?",
      "정말 다 갚았나요?",
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
  const scenes = scenesFor(achievement);

  return (
    <>
      <Suspense fallback={null}>
        <UrlSyncBoundary achievementId={achievement.id} />
      </Suspense>

      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-5">
          {/* 뒤로와 로고를 한 덩어리로. 왼쪽 위는 '나가는 길'이 있는 자리다. */}
          <div className="flex min-w-0 items-center gap-1.5">
            <BackButton />
            <Link
              href="/"
              className="shrink-0 text-sm font-semibold text-smoke transition-colors hover:text-ink"
            >
              이재명 업적 위키
            </Link>
          </div>
          <SceneNav scenes={scenes} />
          <ShareButton compact />
        </div>
      </header>

      <main id="main" className="flex-1 pb-8">
        <AchievementHero achievement={achievement} highlights={heroHighlights} />
        <EvidenceStatus achievement={achievement} />

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

      {/* 상세에서도 하단 탭을 둔다. 들어오면 나갈 길이 없던 것이 가장 큰 불편이었다. */}
      <BottomNav />

      <AskGuide
        achievementSlug={achievement.slug}
        achievementTitle={achievement.title}
        claims={achievement.claims}
        suggestions={askSuggestions}
      />
      <EvidenceDrawer claims={achievement.claims} sources={achievement.sources} />
    </>
  );
}
