import Link from "next/link";
import { arcticRoute } from "@/content/stories/arctic-route/story";

const STORIES = [arcticRoute];

export default function Home() {
  return (
    <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-5 py-16 sm:py-24">
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
      </p>

      <ul className="mt-14 grid gap-5 sm:grid-cols-2">
        {STORIES.map((story) => (
          <li key={story.id}>
            <Link
              href={`/story/${story.slug}`}
              className="group block h-full rounded-2xl border border-line bg-ink-700 p-7 transition-colors hover:border-ice-600"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ice-400">
                {story.kicker}
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
                {story.title}
              </h2>
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
    </main>
  );
}
