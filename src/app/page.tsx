import { ACHIEVEMENT_CARDS, getPublishedAchievements } from "@/content/achievements";
import { MILESTONES, ALL_CLAIMS, ALL_SOURCES } from "@/content/milestones";
import { findScene, validateMilestones } from "@/content/schema";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { HomeFeed, type HeroSlide } from "@/features/home/HomeFeed";

import { ArcticHeroVisual, NumberHeroVisual } from "@/features/home/HeroVisuals";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";

/**
 * 홈 — 모바일 앱 화면.
 *
 * 대부분의 방문자가 휴대폰으로 들어온다고 보고 짠다. 데스크탑에서는 같은
 * 화면을 가운데 세운다. 넓은 화면용 레이아웃을 따로 만들면 두 벌을 관리하게 되고,
 * 정작 대다수가 쓰는 쪽이 부실해진다.
 */

const TONES = ["ice", "warm", "deep"] as const;

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

  const achievementSlides: HeroSlide[] = stories.map((achievement, index) => {
    const map = findScene(achievement, "route-map");
    const headline =
      achievement.keyNumbers.find((k) => k.id === achievement.headlineKeyNumberId) ??
      achievement.keyNumbers[0];

    return {
      id: achievement.id,
      kicker: achievement.kicker,
      tag: achievement.title,
      title: achievement.subtitle,
      subtitle: achievement.summary.split(". ")[0] + ".",
      href: `/achievement/${achievement.slug}`,
      note: map ? "직접 움직여보기" : headline?.value,
      /*
       * 지도가 있는 업적은 지도를, 없는 업적은 대표 수치를 배경으로 쓴다.
       * 배경이 비면 카드가 전부 같아 보이고, 캐러셀에서 몇 장을 지났는지
       * 감이 오지 않는다.
       */
      visual: map ? (
        <ArcticHeroVisual routes={map.routes} />
      ) : headline ? (
        <NumberHeroVisual value={headline.value} tone={TONES[index % TONES.length]} />
      ) : undefined,
    };
  });

  /*
   * 히어로는 공개된 업적만 세운다.
   *
   * 예전에는 자리가 빈다고 세부 성과 카드로 채웠다. 그러면 업적과 성과가 같은
   * 층에 놓여 무엇이 단위인지 보이지 않는다. 바로 아래 업적 줄이 전체를 보이고,
   * 세부 성과는 그 아래에 소속을 밝혀 따로 둔다.
   */
  const slides = achievementSlides;

  const topics = MILESTONES.filter((a) => a.status !== "planned");

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-8">
        <HomeFeed
          slides={slides}
          achievements={ACHIEVEMENT_CARDS}
          topics={topics}

          claims={ALL_CLAIMS}
        />
      </main>

      <BottomNav />
      <EvidenceDrawer claims={ALL_CLAIMS} sources={ALL_SOURCES} />
    </>
  );
}
