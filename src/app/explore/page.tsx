import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedStories } from "@/content/stories";
import { ACHIEVEMENTS, ALL_CLAIMS, ALL_SOURCES } from "@/content/achievements";
import { SHORTS } from "@/content/shorts";
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
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">둘러보기</h1>

        <section aria-labelledby="ex-stories" className="mt-8">
          <h2 id="ex-stories" className="text-[15px] font-bold text-text-primary">
            직접 움직여보는 스토리
          </h2>
          <ul className="mt-3 space-y-3">
            {stories.map((story) => (
              <li key={story.id}>
                <Link
                  href={`/story/${story.slug}`}
                  className="block rounded-xl border border-line bg-ink-700 p-4 transition-colors hover:border-ice-600"
                >
                  <span className="text-[10px] font-bold text-ice-400">{story.kicker}</span>
                  <p className="mt-1.5 text-base font-bold text-text-primary">{story.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-text-secondary">
                    {story.subtitle}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ex-shorts" className="mt-9">
          <h2 id="ex-shorts" className="text-[15px] font-bold text-text-primary">
            쇼츠
          </h2>
          {SHORTS.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-line bg-ink-700/50 px-5 py-7 text-center text-[13px] leading-relaxed text-text-muted">
              아직 등록된 쇼츠가 없습니다.
              <br />
              세로 영상을 <code className="text-text-secondary">public/shorts/</code>에 두고
              <br />
              <code className="text-text-secondary">src/content/shorts</code>에 등록하면 여기 나옵니다.
            </p>
          ) : (
            <ul className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4">
              {SHORTS.map((short) => (
                <li key={short.id} className="w-[150px] shrink-0">
                  <div className="aspect-[9/16] overflow-hidden rounded-xl border border-line bg-ink-900">
                    {short.posterUrl && (
                      // 쇼츠 포스터는 편집자가 올린 고정 자산이라 최적화 파이프라인이 필요 없다.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={short.posterUrl}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-[12px] font-semibold leading-snug text-text-primary">
                    {short.title}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="ex-done" className="mt-9">
          <h2 id="ex-done" className="text-[15px] font-bold text-text-primary">
            완료된 성과 {done.length}건
          </h2>
          <ul className="mt-3 space-y-2">
            {[...done, ...rest].map((item) => {
              const claim = ALL_CLAIMS.find((c) => c.id === item.claimIds[0]);
              return (
                <li
                  key={item.id}
                  className="rounded-xl border border-line bg-ink-700 px-4 py-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-ice-400">
                      {CATEGORY_LABEL[item.categories[0]]}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {STATUS_LABEL[item.status]} · {formatDate(item.date, item.datePrecision)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[14px] font-semibold leading-snug text-text-primary">
                    {item.title}
                  </p>
                  {item.highlight && (
                    <p className="tabular mt-1 text-sm font-bold text-ice-400">
                      {item.highlight.value}{" "}
                      <span className="text-[11px] font-normal text-text-muted">
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
