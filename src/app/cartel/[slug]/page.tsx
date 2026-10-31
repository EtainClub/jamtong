import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  CARTELS,
  cartelProgress,
  countProgress,
  getCartelEntry,
  isOpen,
} from "@/content/cartels";
import { getAchievement } from "@/content/achievements";
import { MILESTONES, ALL_CLAIMS, ALL_SOURCES } from "@/content/milestones";
import type { Claim, Source, TimelineEvent } from "@/content/schema";
import { BackButton } from "@/features/app/BackButton";
import { BottomNav } from "@/features/app/BottomNav";
import {
  AchievementCard,
  CartelSection,
  GapCard,
  ProblemCard,
} from "@/features/cartel/CartelCards";
import {
  ProgressBar,
  ProgressGuide,
  ProgressItemCard,
  ProgressLegend,
} from "@/features/cartel/CartelProgress";
import { Timeline } from "@/features/timeline/Timeline";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";
import { ShareLinkButton } from "@/features/app/ShareLinkButton";
import { JsonLd, articleLd, breadcrumbLd } from "@/lib/seo/jsonld";

export function generateStaticParams() {
  return CARTELS.map((cartel) => ({ slug: cartel.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCartelEntry(slug);
  if (!entry) return {};
  const { cartel } = entry;

  return {
    title: `${cartel.name} 카르텔`,
    description: cartel.summary,
    alternates: { canonical: `/cartel/${slug}` },
    /*
     * 비어 있는 표적은 색인하지 않는다. 이름 한 줄뿐인 주소가 검색 결과에
     * 서면 열어 본 사람에게 읽을 것이 없다. 자서전의 빈 책과 같은 처리다.
     */
    robots: isOpen(cartel) ? undefined : { index: false, follow: true },
    openGraph: { type: "article", url: `/cartel/${slug}`, title: `${cartel.name} 카르텔`, description: cartel.summary },
  };
}

/**
 * 카르텔 하나.
 *
 * ★ 이 페이지는 거의 아무것도 주장하지 않는다.
 *   깊이는 업적에 있고 진행과 계획은 성과 카드에 있다. 여기가 하는 일은
 *   흩어진 것을 한 표적 아래 모으고, 무엇을 아직 못 채웠는지 적는 것이다.
 *   모으는 자리에서 문장이 늘기 시작하면 근거 없는 서술이 가장 쉽게 끼어든다.
 *
 * ★ 한 화면에 한 단만 쓴다.
 *   예전에는 머리글이 560 단인데 본문이 업적용 `Section`(max-w-5xl, 2xl 제목,
 *   mt-20)을 써서 한 페이지 안에서 단 폭과 제목 크기가 두 번 바뀌었다. 모으는
 *   화면은 훑는 화면이라, 리듬이 한 번 끊기면 어디까지가 한 덩어리인지 잃는다.
 *
 * ★ 카드가 먼저 말하고 문단이 받친다.
 *   층(사실·주장)과 말한 사람, 원문에서 떼어 온 한 마디를 카드 머리에 세운다.
 *   그 전에는 문단을 끝까지 읽어야 그것이 사실인지 누군가의 규정인지 알 수
 *   있었고, 읽는 동안 규정이 이 위키의 서술처럼 읽혔다.
 *
 * ★ 경과는 업적들의 연표를 한 축에 합친 것이다.
 *   같은 표적을 여러 시기에 걸쳐 건드렸을 때 그 순서가 보여야 한다. 연표
 *   부품은 업적 쪽 것을 그대로 쓰고, 근거도 업적들의 것을 합쳐 넘긴다.
 *
 * ★ 진행 정도를 막대로 먼저 보인다.
 *   카르텔은 한 번에 깨지지 않는다. 걸린 조치(성과 카드와 업적에서 꺼낸 조치)를
 *   하나씩 세어 완료·추진 중·계획으로 나눈다. 공약 이행 현황과 같은 모양이다.
 *   계획을 완료 칸에 올리지 않는 것이 이 페이지에서 가장 중요한 선이다.
 *
 * ★ 출처 각주는 아래로 내린다.
 *   무엇을 어디서 확인했는지는 반드시 있어야 하지만 첫 화면을 차지할 것은
 *   아니다. 위에는 「이 묶음은 이 위키가 지은 것」 한 줄만 남기고 나머지는
 *   맨 아래 각주로 보낸다.
 */
export default async function CartelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCartelEntry(slug);
  if (!entry) notFound();

  const { cartel } = entry;
  const achievements = cartel.achievementSlugs.flatMap((s) => {
    const found = getAchievement(s);
    return found ? [found] : [];
  });

  /* 여러 업적의 연표를 한 축에. id가 겹칠 일은 없다 — 업적마다 접두어가 다르다. */
  const events: TimelineEvent[] = achievements
    .flatMap((a) => a.timeline)
    .sort((a, b) => a.date.localeCompare(b.date));

  const milestones = cartel.milestoneIds.flatMap((id) => {
    const found = MILESTONES.find((m) => m.id === id);
    return found ? [found] : [];
  });
  const progress = cartelProgress(cartel);
  const count = countProgress(progress);
  const groups = [
    {
      id: "ct-done",
      heading: "완료",
      lede: "법이 시행됐거나, 제도가 실제로 시작됐거나, 제재 처분이 내려진 조치입니다.",
      items: progress.filter((p) => p.status === "done"),
    },
    {
      id: "ct-ongoing",
      heading: "추진 중",
      lede: "법 통과·합의·시범까지 왔지만 아직 효력이 없거나 일부만 시작된 조치입니다.",
      items: progress.filter((p) => p.status === "ongoing"),
    },
    {
      id: "ct-planned",
      heading: "계획",
      lede: "발표·의결까지입니다. 아직 결과가 아닙니다.",
      items: progress.filter((p) => p.status === "planned"),
    },
  ].filter((g) => g.items.length > 0);

  /* 서랍은 이 페이지에 실제로 걸린 근거만 안다. */
  const claims: Claim[] = [
    ...entry.claims,
    ...achievements.flatMap((a) => a.claims),
    ...(milestones.length > 0 ? ALL_CLAIMS : []),
  ];
  const sources: Source[] = [
    ...entry.sources,
    ...achievements.flatMap((a) => a.sources),
    ...(milestones.length > 0 ? ALL_SOURCES : []),
  ];

  const open = isOpen(cartel);

  return (
    <>
      {/* 빈 표적은 noindex라 구조화 데이터도 내지 않는다. */}
      {open && (
        <>
          <JsonLd
            data={articleLd({
              path: `/cartel/${cartel.slug}`,
              headline: `${cartel.name} 카르텔`,
              description: cartel.summary,
            })}
          />
          <JsonLd
            data={breadcrumbLd([
              { name: "카르텔", path: "/cartel" },
              { name: `${cartel.name} 카르텔`, path: `/cartel/${cartel.slug}` },
            ])}
          />
        </>
      )}
      <header className="sticky top-0 z-40 h-14 border-b border-stone bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[560px] items-center justify-between gap-2 px-4">
          <div className="flex min-w-0 items-center gap-1.5">
            <BackButton />
            <Link
              href="/cartel"
              className="shrink-0 text-sm font-semibold text-smoke transition-colors hover:text-ink"
            >
              카르텔
            </Link>
          </div>
          <ShareLinkButton
            title={`${cartel.name} 카르텔`}
            surface="words"
            label={{
              text: "공유",
              aria: "이 표적 공유",
              copied: "이 표적의 링크를 클립보드에 복사했습니다.",
            }}
            compact
          />
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-12 pt-6">
        <span className="text-[11px] font-semibold tracking-[0.08em] text-ash">카르텔</span>
        <h1 className="mt-1.5 text-2xl font-light tracking-[-0.02em] text-ink">
          {cartel.name}
        </h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-smoke">{cartel.summary}</p>

        {/*
          * 표적의 현재 모습. 0을 지우지 않는다 — 담합은 성과가 0이고 계획이
          * 셋인데, 0을 감추면 계획만 남아 이미 된 일처럼 읽힌다.
          */}
        {count.total > 0 && (
          <section
            aria-labelledby="ct-progress"
            className="mt-5 rounded-card border border-stone bg-taupe px-4 py-4"
          >
            <h2 id="ct-progress" className="text-[15px] font-bold text-ink">
              진행 현황
            </h2>
            <p className="mt-1 text-[12px] text-ash">
              이 정부가 건 조치 <span className="tabular">{count.total}</span>개 기준 · 확인
              못 한 것 <span className="tabular">{cartel.openQuestions.length}</span>개
            </p>
            <div className="mt-3">
              <ProgressBar count={count} />
            </div>
            <div className="mt-2.5">
              <ProgressLegend count={count} />
            </div>
            <ProgressGuide />
          </section>
        )}

        <p className="mt-4 flex gap-2.5 rounded-card border border-stone bg-taupe/60 px-4 py-3 text-[12px] leading-relaxed text-graphite">
          <span aria-hidden="true" className="shrink-0 text-ash">
            ⚑
          </span>
          <span>
            <strong className="font-bold text-ink">이 표적은 이 위키가 지은 묶음입니다.</strong>{" "}
            정부의 분류가 아닙니다.
          </span>
        </p>

        {!open ? (
          <CartelSection
            id="ct-empty"
            heading="아직 정리하지 않았습니다"
            lede="이름만 세워 두었습니다. 근거를 찾으면 그때 채웁니다 — 찾기 전에 적으면 그 문장은 누구도 대조하지 않은 말이 됩니다."
          >
            <ul className="space-y-2">
              {cartel.openQuestions.map((item, i) => (
                <GapCard key={item} text={item} index={i} />
              ))}
            </ul>
          </CartelSection>
        ) : (
          <>
            {cartel.problems.length > 0 && (
              <CartelSection
                id="ct-problems"
                heading="무엇이 문제인가"
                count={cartel.problems.length}
                lede="이 표적을 무엇이라고 보는지. 카드마다 그것이 사실인지 누구의 말인지 먼저 적고, 근거를 답니다."
              >
                <ul className="space-y-3">
                  {cartel.problems.map((problem) => (
                    <ProblemCard
                      key={problem.id}
                      problem={problem}
                      claim={claims.find((c) => c.id === problem.claimId)}
                    />
                  ))}
                </ul>
              </CartelSection>
            )}

            {events.length > 0 && (
              <CartelSection
                id="ct-timeline"
                heading="경과"
                lede="이 표적을 건드린 일들을 한 축에 놓았습니다. 여러 업적의 연표를 합친 것입니다."
              >
                <Timeline events={events} claims={claims} />
              </CartelSection>
            )}

            {groups.map((group) => (
              <CartelSection
                key={group.id}
                id={group.id}
                heading={group.heading}
                count={group.items.length}
                lede={group.lede}
              >
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <ProgressItemCard key={item.id} item={item} />
                  ))}
                </ul>
              </CartelSection>
            ))}

            {achievements.length > 0 && (
              <CartelSection
                id="ct-achievements"
                heading="깊이 다룬 업적"
                count={achievements.length}
                lede="위 조치들의 배경과 근거를 업적 페이지에서 처음부터 봅니다."
              >
                <ul className="space-y-2">
                  {achievements.map((achievement) => (
                    <AchievementCard key={achievement.slug} achievement={achievement} />
                  ))}
                </ul>
              </CartelSection>
            )}

            {cartel.openQuestions.length > 0 && (
              <CartelSection
                id="ct-gaps"
                heading="아직 확인하지 못한 것"
                count={cartel.openQuestions.length}
                lede="채우지 못한 칸을 그대로 적습니다. 다음에 여는 사람이 여기서 시작합니다."
              >
                <ul className="space-y-2">
                  {cartel.openQuestions.map((item, i) => (
                    <GapCard key={item} text={item} index={i} />
                  ))}
                </ul>
              </CartelSection>
            )}
          </>
        )}

        {cartel.sourceNote && (
          <section aria-labelledby="ct-note" className="mt-10 border-t border-stone pt-5">
            <h2 id="ct-note" className="text-[12px] font-bold text-smoke">
              이 페이지의 자료
            </h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ash">{cartel.sourceNote}</p>
          </section>
        )}
      </main>

      <BottomNav />
      <EvidenceDrawer claims={claims} sources={sources} />
    </>
  );
}
