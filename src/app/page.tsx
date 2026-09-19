import { getPublishedAchievements } from "@/content/achievements";
import { MILESTONES, ALL_CLAIMS, ALL_SOURCES } from "@/content/milestones";
import { findScene, validateMilestones, type Milestone } from "@/content/schema";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { HomeFeed, type HeroSlide } from "@/features/home/HomeFeed";
import { ArcticHeroVisual, NumberHeroVisual } from "@/features/home/HeroVisuals";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";
import { CATEGORY_LABEL } from "@/content/labels";

/**
 * 홈 — 모바일 앱 화면.
 *
 * 대부분의 방문자가 휴대폰으로 들어온다고 보고 짠다. 데스크탑에서는 같은
 * 화면을 가운데 세운다. 넓은 화면용 레이아웃을 따로 만들면 두 벌을 관리하게 되고,
 * 정작 대다수가 쓰는 쪽이 부실해진다.
 */

const TONES = ["ice", "warm", "deep"] as const;

function toHeroSlide(item: Milestone, index: number): HeroSlide {
  return {
    id: item.id,
    kicker: item.achievementSlug ? "주요 정책" : "주요 업적",
    tag: CATEGORY_LABEL[item.categories[0]],
    title: item.title,
    subtitle: item.summary,
    href: item.achievementSlug ? `/achievement/${item.achievementSlug}` : "/explore",
    note: item.highlight?.value,
    visual: (
      <NumberHeroVisual
        value={item.highlight?.value ?? CATEGORY_LABEL[item.categories[0]]}
        tone={TONES[index % TONES.length]}
      />
    ),
  };
}

export default function Home() {
  const stories = getPublishedAchievements();

  const errors = validateMilestones({
    milestones: MILESTONES,
    claims: ALL_CLAIMS,
    sources: ALL_SOURCES,
  });
  if (errors.length > 0) {
    throw new Error(`성과 카드 검증 실패:\n${errors.join("\n")}`);
  }

  // 스토리가 먼저다. 직접 움직여볼 수 있는 콘텐츠를 앞에 세운다.
  const achievementSlides: HeroSlide[] = stories.map((achievement) => ({
    id: achievement.id,
    kicker: achievement.kicker,
    tag: achievement.title,
    title: achievement.subtitle,
    subtitle: achievement.summary.split(". ")[0] + ".",
    href: `/achievement/${achievement.slug}`,
    note: "직접 움직여보기",
    // 지도 씬을 가진 스토리만 지도를 배경으로 쓴다.
    visual: (() => {
      const map = findScene(achievement, "route-map");
      return map ? <ArcticHeroVisual routes={map.routes} /> : undefined;
    })(),
  }));

  // 숫자가 있는 항목을 앞에 세운다. 카드 하나에 남는 것은 결국 숫자 하나다.
  const highlighted = MILESTONES.filter((a) => a.highlight && a.status !== "planned")
    .concat(MILESTONES.filter((a) => a.highlight && a.status === "planned"))
    .slice(0, 4);

  const slides = [...achievementSlides, ...highlighted.map(toHeroSlide)].slice(0, 5);

  const topics = MILESTONES.filter((a) => a.status !== "planned");

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-8">
        <HomeFeed slides={slides} topics={topics} claims={ALL_CLAIMS} />
      </main>

      <BottomNav />
      <EvidenceDrawer claims={ALL_CLAIMS} sources={ALL_SOURCES} />
    </>
  );
}
