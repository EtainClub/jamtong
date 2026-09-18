import { getPublishedStories } from "@/content/stories";
import { ACHIEVEMENTS, ALL_CLAIMS, ALL_SOURCES } from "@/content/achievements";
import { validateAchievements, type Achievement } from "@/content/schema";
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

function toHeroSlide(item: Achievement, index: number): HeroSlide {
  return {
    id: item.id,
    kicker: item.storySlug ? "주요 정책" : "주요 업적",
    tag: CATEGORY_LABEL[item.categories[0]],
    title: item.title,
    subtitle: item.summary,
    href: item.storySlug ? `/story/${item.storySlug}` : "/explore",
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
  const stories = getPublishedStories();

  const errors = validateAchievements({
    achievements: ACHIEVEMENTS,
    claims: ALL_CLAIMS,
    sources: ALL_SOURCES,
  });
  if (errors.length > 0) {
    throw new Error(`성과 카드 검증 실패:\n${errors.join("\n")}`);
  }

  // 스토리가 먼저다. 직접 움직여볼 수 있는 콘텐츠를 앞에 세운다.
  const storySlides: HeroSlide[] = stories.map((story) => ({
    id: story.id,
    kicker: story.kicker,
    tag: story.title,
    title: story.subtitle,
    subtitle: story.summary.split(". ")[0] + ".",
    href: `/story/${story.slug}`,
    note: "직접 움직여보기",
    visual:
      story.routes.length > 0 ? <ArcticHeroVisual routes={story.routes} /> : undefined,
  }));

  // 숫자가 있는 항목을 앞에 세운다. 카드 하나에 남는 것은 결국 숫자 하나다.
  const highlighted = ACHIEVEMENTS.filter((a) => a.highlight && a.status !== "planned")
    .concat(ACHIEVEMENTS.filter((a) => a.highlight && a.status === "planned"))
    .slice(0, 4);

  const slides = [...storySlides, ...highlighted.map(toHeroSlide)].slice(0, 5);

  const topics = ACHIEVEMENTS.filter((a) => a.status !== "planned");

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
