import Link from "next/link";
import { getPublishedStories } from "@/content/stories";
import { ACHIEVEMENTS, ALL_CLAIMS, ALL_SOURCES } from "@/content/achievements";
import { validateAchievements } from "@/content/schema";
import { Feed } from "@/features/feed/Feed";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";

/**
 * 홈 — 성과 카드 피드 + Visual Story 입구.
 *
 * 두 계층이 한 화면에 있다. 카드는 넓게 덮고, 스토리는 깊이 들어간다.
 * 스토리로 승격된 카드에는 "직접 보기"가 붙는다.
 */

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

  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ice-400">
            Visual Wiki
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            읽는 위키가 아니라
            <br />
            이해하는 위키
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary sm:text-base">
            업적, 사건, 맥락, 근거를 텍스트 더미가 아닌 시각적 경험으로 탐색합니다.
            모든 항목에는 1차 자료가 붙어 있고, 검증 전 항목은 그렇다고 표시됩니다.
          </p>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5 py-14">
        {stories.length > 0 && (
          <section aria-labelledby="home-stories" className="mb-16">
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id="home-stories"
                className="text-xl font-bold tracking-tight text-text-primary"
              >
                직접 움직여보는 스토리
              </h2>
              <span className="text-xs text-text-muted">{stories.length}편</span>
            </div>

            <ul className="mt-5 grid gap-5 sm:grid-cols-2">
              {stories.map((story) => (
                <li key={story.id}>
                  <Link
                    href={`/story/${story.slug}`}
                    className="group block h-full rounded-2xl border border-line bg-ink-700 p-7 transition-colors hover:border-ice-600"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ice-400">
                      {story.kicker}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
                      {story.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-medium leading-snug text-text-secondary">
                      {story.subtitle}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ice-400">
                      직접 보기
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="home-feed">
          <h2 id="home-feed" className="text-xl font-bold tracking-tight text-text-primary">
            성과 아카이브
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
            분야와 대상으로 좁혀 보세요. 계획 단계인 항목은 &ldquo;계획&rdquo;으로 표시되며
            성과와 섞지 않습니다.
          </p>

          <div className="mt-8">
            <Feed achievements={ACHIEVEMENTS} claims={ALL_CLAIMS} />
          </div>
        </section>
      </main>

      <EvidenceDrawer claims={ALL_CLAIMS} sources={ALL_SOURCES} />
    </>
  );
}
