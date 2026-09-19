import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { STATEMENTS, getStatement } from "@/content/words";
import { KIND_LABEL } from "@/content/words/schema";
import { getAchievement } from "@/content/achievements";
import { BackButton } from "@/features/app/BackButton";
import { BottomNav } from "@/features/app/BottomNav";
import { StatementView } from "@/features/words/StatementView";

export function generateStaticParams() {
  return STATEMENTS.map((statement) => ({ slug: statement.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const statement = getStatement(slug);
  if (!statement) return {};

  return {
    title: `${statement.title} · 언행`,
    description: `${statement.displayDate} ${statement.channel}`,
  };
}

/**
 * 언행 상세.
 *
 * 쉽게 보기를 기본으로 띄우되, 토막마다 원문의 어느 대목을 옮긴 것인지
 * 접어 둔다. 요약을 믿으라고 하지 않고 대볼 수 있게 두는 것이 이 화면의 전부다.
 */
export default async function StatementPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const statement = getStatement(slug);
  if (!statement) notFound();

  /*
   * 맞물리는 업적. flatMap으로 거른다 — filter는 타입을 좁히지 못해서
   * 뒤에 non-null 단언을 달게 되고, 그건 "없을 리 없다"는 약속을 사람이
   * 지키는 것이 된다. 여기서는 slug가 오타면 조용히 빠지는 편이 낫다.
   */
  const related = statement.relatedAchievements.flatMap((s) => {
    const found = getAchievement(s);
    return found && found.publishStatus === "published" ? [found] : [];
  });

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[560px] items-center gap-1.5 px-4">
          <BackButton />
          <Link
            href="/words"
            className="shrink-0 text-sm font-semibold text-smoke transition-colors hover:text-ink"
          >
            언행
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-ash">
          <span className="rounded-full bg-taupe px-2 py-0.5 text-navy">
            {KIND_LABEL[statement.kind]}
          </span>
          <span>{statement.displayDate}</span>
        </div>

        <h1 className="mt-2.5 text-2xl font-light tracking-[-0.02em] text-ink">
          {statement.title}
        </h1>

        <p className="mt-2 text-[12px] text-ash">
          {statement.channel}
          {statement.url && (
            <>
              {" · "}
              <a
                href={statement.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-navy hover:underline"
              >
                원글 보기 ↗
              </a>
            </>
          )}
        </p>

        {/*
          * 이 글이 놓인 자리. 무엇 때문에 나온 말인지까지만 적는다.
          * 배경을 지우면 읽는 사람이 앞뒤를 지어내고, 더 적으면 우리가
          * 남의 일을 재단하게 된다.
          */}
        {statement.context && (
          <p className="mt-4 border-l-2 border-stone pl-3 text-[13px] leading-relaxed text-smoke">
            {statement.context}
          </p>
        )}

        <StatementView statement={statement} />

        {statement.topics.length > 0 && (
          <ul className="mt-7 flex flex-wrap gap-1.5">
            {statement.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-stone px-2.5 py-1 text-[11px] text-ash"
              >
                {topic}
              </li>
            ))}
          </ul>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-9 border-t border-stone pt-7">
            <h2 id="related" className="text-[13px] font-bold text-ink">
              이 말과 맞물리는 업적
            </h2>
            <ul className="mt-3 space-y-2">
              {related.map((achievement) => (
                <li key={achievement.id}>
                  <Link
                    href={`/achievement/${achievement.slug}`}
                    className="block rounded-card border border-stone px-4 py-3 transition-colors hover:border-graphite"
                  >
                    <span className="text-[14px] font-bold text-ink">
                      {achievement.title}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-smoke">
                      {achievement.subtitle}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <BottomNav />
    </>
  );
}
