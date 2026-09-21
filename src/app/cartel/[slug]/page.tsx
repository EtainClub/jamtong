import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CARTELS, getCartelEntry, isOpen } from "@/content/cartels";
import { getAchievement } from "@/content/achievements";
import { MILESTONES, ALL_CLAIMS, ALL_SOURCES } from "@/content/milestones";
import { STATUS_LABEL, formatDate } from "@/content/labels";
import type { Claim, Source, TimelineEvent } from "@/content/schema";
import { BackButton } from "@/features/app/BackButton";
import { BottomNav } from "@/features/app/BottomNav";
import { Section } from "@/features/achievement/Section";
import { Timeline } from "@/features/timeline/Timeline";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";
import { ShareLinkButton } from "@/features/app/ShareLinkButton";

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
 * ★ 경과는 업적들의 연표를 한 축에 합친 것이다.
 *   같은 표적을 여러 시기에 걸쳐 건드렸을 때 그 순서가 보여야 한다. 연표
 *   부품은 업적 쪽 것을 그대로 쓰고, 근거도 업적들의 것을 합쳐 넘긴다.
 *
 * ★ 계획을 성과 칸에 올리지 않는다.
 *   '지금까지'와 '진행 중·계획'을 나눈 자리가 이 페이지에서 가장 중요한 선이다.
 *   성과 카드가 들고 있는 done/ongoing/planned를 그대로 쓴다.
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
  const done = milestones.filter((m) => m.status === "done");
  const upcoming = milestones.filter((m) => m.status !== "done");

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

  return (
    <>
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

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 pb-10">
        <div className="mx-auto max-w-[560px] px-4 pt-6">
          <span className="text-[11px] font-semibold text-ash">카르텔</span>
          <h1 className="mt-1.5 text-2xl font-light tracking-[-0.02em] text-ink sm:text-3xl">
            {cartel.name}
          </h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-smoke">{cartel.summary}</p>
          <p className="mt-4 border-l-2 border-stone pl-3 text-[12px] leading-relaxed text-ash">
            이 표적은 이 위키가 지은 묶음이며 정부의 분류가 아닙니다.
            {cartel.sourceNote ? ` ${cartel.sourceNote}` : ""}
          </p>
        </div>

        {!isOpen(cartel) ? (
          <Section heading="아직 정리하지 않았습니다" first>
            <p className="text-[14px] leading-relaxed text-smoke">
              이름만 세워 두었습니다. 근거를 찾으면 그때 채웁니다 — 찾기 전에 적으면
              그 문장은 누구도 대조하지 않은 말이 됩니다.
            </p>
            <OpenQuestions items={cartel.openQuestions} />
          </Section>
        ) : (
          <>
            {cartel.problems.length > 0 && (
              <Section
                heading="무엇이 문제인가"
                lede="이 표적을 무엇이라고 보는지. 한 줄마다 근거가 붙습니다."
                first
              >
                <ul className="space-y-3">
                  {cartel.problems.map((problem) => {
                    const claim = claims.find((c) => c.id === problem.claimId);
                    return (
                      <li key={problem.id} className="rounded-card border border-stone px-4 py-3.5">
                        <p className="text-[14px] leading-relaxed text-ink">{problem.text}</p>
                        {claim && (
                          <div className="mt-2.5">
                            <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

            {events.length > 0 && (
              <Section
                heading="경과"
                lede="이 표적을 건드린 일들을 한 축에 놓았습니다. 여러 업적의 연표를 합친 것입니다."
                first={cartel.problems.length === 0}
              >
                <Timeline events={events} claims={claims} />
              </Section>
            )}

            {(achievements.length > 0 || done.length > 0) && (
              <Section
                heading="지금까지"
                lede="일어난 일입니다. 앞으로 하겠다는 것은 아래에 따로 있습니다."
              >
                {achievements.length > 0 && (
                  <ul className="space-y-2">
                    {achievements.map((achievement) => (
                      <li key={achievement.slug}>
                        <Link
                          href={`/achievement/${achievement.slug}`}
                          className="block rounded-card border border-stone px-4 py-3.5 transition-colors hover:border-graphite"
                        >
                          <span className="text-[11px] font-semibold text-ash">
                            {achievement.kicker}
                          </span>
                          <span className="mt-0.5 block text-[15px] font-bold text-ink">
                            {achievement.title}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-relaxed text-smoke">
                            {achievement.subtitle}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {done.length > 0 && <MilestoneList items={done} claims={claims} />}
              </Section>
            )}

            {upcoming.length > 0 && (
              <Section
                heading="진행 중 · 계획"
                lede="아직 결과가 아닙니다. 계획을 성과 칸에 올리지 않으려고 자리를 나눴습니다."
              >
                <MilestoneList items={upcoming} claims={claims} />
              </Section>
            )}

            {cartel.openQuestions.length > 0 && (
              <Section
                heading="아직 확인하지 못한 것"
                lede="채우지 못한 칸을 그대로 적습니다. 다음에 여는 사람이 여기서 시작합니다."
              >
                <OpenQuestions items={cartel.openQuestions} />
              </Section>
            )}
          </>
        )}
      </main>

      <BottomNav />
      <EvidenceDrawer claims={claims} sources={sources} />
    </>
  );
}

function OpenQuestions({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-card border border-dashed border-stone bg-taupe/40 px-4 py-3 text-[13px] leading-relaxed text-smoke"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function MilestoneList({
  items,
  claims,
}: {
  items: (typeof MILESTONES)[number][];
  claims: Claim[];
}) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => {
        const claim = claims.find((c) => c.id === item.claimIds[0]);
        return (
          <li key={item.id} className="rounded-card border border-stone bg-taupe px-4 py-3.5">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="font-bold text-navy">{STATUS_LABEL[item.status]}</span>
              <span className="text-ash">{formatDate(item.date, item.datePrecision)}</span>
            </div>
            <p className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">{item.title}</p>
            {item.highlight && (
              <p className="tabular mt-1 text-sm font-bold text-navy">
                {item.highlight.value}{" "}
                <span className="text-[11px] font-normal text-ash">{item.highlight.label}</span>
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
  );
}
