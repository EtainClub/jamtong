import Link from "next/link";
import { getPublishedStories } from "@/content/stories";
import { ACHIEVEMENTS, ALL_CLAIMS, ALL_SOURCES } from "@/content/achievements";
import { validateAchievements, type Achievement } from "@/content/schema";
import { ShortsPlayer } from "@/features/shorts/ShortsPlayer";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";

/**
 * 홈.
 *
 * 목록을 훑게 하지 않는다. 숏츠가 한 장씩 밀어 넣고, 더 알고 싶어진 것만
 * 스토리로 들어간다. 카드 그리드를 늘어놓으면 읽는 위키로 되돌아간다.
 */

const STATUS_ORDER = { done: 0, ongoing: 1, planned: 2 } as const;

/**
 * 숏츠 순서.
 *
 * 실제로 일어난 일을 앞에 두고, 그 안에서는 숫자가 있는 장을 먼저 보낸다.
 * 스크롤을 멈추게 하는 것은 문장이 아니라 숫자이기 때문이다.
 */
function orderForShorts(items: Achievement[]): Achievement[] {
  return [...items].sort((a, b) => {
    const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (byStatus !== 0) return byStatus;

    const byHighlight = Number(Boolean(b.highlight)) - Number(Boolean(a.highlight));
    if (byHighlight !== 0) return byHighlight;

    return b.date.localeCompare(a.date);
  });
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

  const shorts = orderForShorts(ACHIEVEMENTS);

  return (
    <>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ice-400">
              Visual Wiki
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              읽는 위키가 아니라
              <br />
              이해하는 위키
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-text-secondary sm:text-base">
              업적과 사건을 텍스트 더미가 아닌 시각적 경험으로 전합니다.
              옆의 숏츠를 넘기며 훑고, 더 알고 싶은 것은 직접 움직여 보세요.
              모든 장면에는 1차 자료가 붙어 있습니다.
            </p>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              <div>
                <dt className="text-xs text-text-muted">숏츠</dt>
                <dd className="tabular mt-1 text-2xl font-bold text-text-primary">
                  {shorts.length}장
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">스토리</dt>
                <dd className="tabular mt-1 text-2xl font-bold text-text-primary">
                  {stories.length}편
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">근거 자료</dt>
                <dd className="tabular mt-1 text-2xl font-bold text-text-primary">
                  {ALL_SOURCES.length}건
                </dd>
              </div>
            </dl>
          </div>

          <section aria-labelledby="home-shorts">
            <h2 id="home-shorts" className="sr-only">
              성과 숏츠
            </h2>
            <ShortsPlayer items={shorts} claims={ALL_CLAIMS} />
          </section>
        </div>

        {stories.length > 0 && (
          <section aria-labelledby="home-stories" className="mt-20 border-t border-line pt-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id="home-stories"
                className="text-2xl font-bold tracking-tight text-text-primary"
              >
                직접 움직여보는 스토리
              </h2>
              <span className="text-xs text-text-muted">{stories.length}편</span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
              지도를 끌고, 시점을 옮기고, 관계를 눌러 보면서 이해하는 긴 호흡의 콘텐츠입니다.
            </p>

            <ul className="mt-7 grid gap-5 sm:grid-cols-2">
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
      </main>

      <EvidenceDrawer claims={ALL_CLAIMS} sources={ALL_SOURCES} />
    </>
  );
}
