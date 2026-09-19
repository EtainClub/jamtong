import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedStories } from "@/content/stories";
import { ACHIEVEMENTS, ALL_CLAIMS, ALL_SOURCES } from "@/content/achievements";
import { CATEGORY_LABEL, STATUS_LABEL, formatDate } from "@/content/labels";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";

export const metadata: Metadata = { title: "둘러보기" };

/** 둘러보기 — 스토리·쇼츠·성과를 한자리에 모은 목록. */
export default function ExplorePage() {
  const stories = getPublishedStories();
  const done = ACHIEVEMENTS.filter((a) => a.status === "done");
  const rest = ACHIEVEMENTS.filter((a) => a.status !== "done");

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">둘러보기</h1>

        <section aria-labelledby="ex-stories" className="mt-8">
          <h2 id="ex-stories" className="text-[15px] font-bold text-ink">
            직접 움직여보는 스토리
          </h2>
          <ul className="mt-3 space-y-3">
            {stories.map((story) => (
              <li key={story.id}>
                <Link
                  href={`/story/${story.slug}`}
                  className="block rounded-card border border-stone bg-taupe p-4 transition-colors hover:border-graphite"
                >
                  <span className="text-[10px] font-bold text-navy">{story.kicker}</span>
                  <p className="mt-1.5 text-base font-bold text-ink">{story.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-smoke">
                    {story.subtitle}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>


        <section aria-labelledby="ex-done" className="mt-9">
          <h2 id="ex-done" className="text-[15px] font-bold text-ink">
            완료된 성과 {done.length}건
          </h2>
          <ul className="mt-3 space-y-2">
            {[...done, ...rest].map((item) => {
              const claim = ALL_CLAIMS.find((c) => c.id === item.claimIds[0]);
              return (
                <li
                  key={item.id}
                  className="rounded-card border border-stone bg-taupe px-4 py-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-navy">
                      {CATEGORY_LABEL[item.categories[0]]}
                    </span>
                    <span className="text-[10px] text-ash">
                      {STATUS_LABEL[item.status]} · {formatDate(item.date, item.datePrecision)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">
                    {item.title}
                  </p>
                  {item.highlight && (
                    <p className="tabular mt-1 text-sm font-bold text-navy">
                      {item.highlight.value}{" "}
                      <span className="text-[11px] font-normal text-ash">
                        {item.highlight.label}
                      </span>
                    </p>
                  )}
                  {claim && (
                    <div className="mt-2.5">
                      <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <BottomNav />
      <EvidenceDrawer claims={ALL_CLAIMS} sources={ALL_SOURCES} />
    </>
  );
}
