"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Achievement, Milestone, Category, Claim } from "@/content/schema";
import { PART_LABELS, achievementParts } from "@/content/achievements";
import { ScrollArrow, useScroller } from "@/features/app/Scroller";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/content/labels";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 홈 피드.
 *
 * 순서에 의도가 있다: 히어로 → 업적 → 세부 성과.
 * 단위는 업적이므로 업적이 먼저 오고, 한 부처 업무계획에서 뽑은 세부 성과는
 * 그 아래에 소속을 밝혀 둔다. 둘을 같은 층에 늘어놓으면 무엇이 단위인지
 * 보이지 않는다 — 예전 둘러보기가 그랬다.
 *
 * 초안 업적은 히어로에 세우지 않는다. 다만 목록에는 배지를 달아 보인다.
 * 아직 다듬는 중이라는 것과 존재를 감추는 것은 다르다.
 *
 * 모바일 우선이다. 가로 스크롤 캐러셀은 scroll-snap으로 만든다.
 * 직접 만든 스와이프 핸들러보다 관성과 접근성이 브라우저 기본 동작으로 해결된다.
 */

export interface HeroSlide {
  id: string;
  kicker: string;
  tag: string;
  title: string;
  subtitle: string;
  href: string;
  /** 서버에서 미리 그린 배경 비주얼. 없으면 단색 그라디언트. */
  visual?: React.ReactNode;
  note?: string;
}

const TABS: { id: string; label: string; match: (a: Milestone) => boolean }[] = [
  { id: "all", label: "전체", match: () => true },
  { id: "done", label: "주요 업적", match: (a) => a.status === "done" },
  {
    id: "social",
    label: "사회·경제",
    match: (a) =>
      a.categories.some((c) =>
        (["economy", "welfare", "labor", "health", "fisheries"] as Category[]).includes(c),
      ),
  },
  {
    id: "diplomacy",
    label: "외교·안보",
    match: (a) => a.categories.includes("diplomacy"),
  },
  { id: "region", label: "지역발전", match: (a) => a.categories.includes("region") },
];

export function HomeFeed({
  slides,
  achievements,
  topics,
  claims,
}: {
  slides: HeroSlide[];
  achievements: Achievement[];
  topics: Milestone[];
  claims: Claim[];
}) {
  const [tab, setTab] = useState("all");
  const filtered = useMemo(() => {
    const matcher = TABS.find((t) => t.id === tab) ?? TABS[0];
    return topics.filter(matcher.match).slice(0, 6);
  }, [tab, topics]);

  const {
    ref: achRef,
    canPrev: achCanPrev,
    canNext: achCanNext,
    onScroll: onAchScroll,
    page: pageAch,
  } = useScroller<HTMLUListElement>();

  const {
    ref: topicsRef,
    canPrev: topicsCanPrev,
    canNext: topicsCanNext,
    onScroll: onTopicsScroll,
    page: pageTopics,
  } = useScroller<HTMLUListElement>();

  return (
    <>
      <SearchField />

      <HeroCarousel slides={slides} />

      <section aria-labelledby="home-achievements" className="mt-9">
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="home-achievements"
            className="text-[17px] font-bold tracking-tight text-ink"
          >
            업적 {achievements.length}건
          </h2>
          <Link href="/explore" className="text-[12px] font-medium text-navy">
            전체 보기
          </Link>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-ash">
          업적 하나마다 일곱 가지를 갖춥니다. 채워진 것과 비어 있는 것이 그대로 보입니다.
        </p>

        <div className="relative">
          <ul
            ref={achRef}
            onScroll={onAchScroll}
            className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1"
          >
            {achievements.map((achievement) => (
              <li key={achievement.id} className="w-[210px] shrink-0 snap-start">
                <AchievementCard achievement={achievement} />
              </li>
            ))}
          </ul>
          <ScrollArrow
            dir={-1}
            disabled={!achCanPrev}
            onClick={() => pageAch(-1, 0.8)}
            label="이전 업적"
          />
          <ScrollArrow
            dir={1}
            disabled={!achCanNext}
            onClick={() => pageAch(1, 0.8)}
            label="다음 업적"
          />
        </div>
      </section>

      <section aria-labelledby="home-topics" className="mt-9">
        <h2 id="home-topics" className="text-[17px] font-bold tracking-tight text-ink">
          세부 성과
        </h2>
        <p className="mt-1 text-[12px] leading-relaxed text-ash">
          해양수산부 2026년 업무계획에서 뽑은 항목입니다. 아직 업적으로 묶이지 않았습니다.
        </p>

        {/* 분류 탭은 이 탭이 거르는 목록 바로 위에 둔다. 멀리 두면 무엇이 걸러졌는지 모른다. */}
        <nav aria-label="분야 분류" className="mt-3">
          <ul className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4">
            {TABS.map((item) => {
              const active = item.id === tab;
              return (
                <li key={item.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setTab(item.id)}
                    aria-pressed={active}
                    className={`relative px-3 py-2 text-[13px] font-semibold transition-colors ${
                      active ? "text-ink" : "text-ash hover:text-smoke"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-navy" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {filtered.length === 0 ? (
          <p className="mt-4 rounded-card border border-stone bg-taupe px-5 py-8 text-center text-sm text-smoke">
            이 분류에 해당하는 주제가 아직 없습니다.
          </p>
        ) : (
          <div className="relative">
            <ul
              ref={topicsRef}
              onScroll={onTopicsScroll}
              className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1"
            >
              {filtered.map((item) => (
                <li key={item.id} className="w-[150px] shrink-0 snap-start">
                  <TopicCard item={item} claims={claims} />
                </li>
              ))}
            </ul>
            {/* 카드는 한 화면을 통째로 넘기지 않는다. 다음 카드가 걸쳐 보여야 더 있다는 걸 안다. */}
            <ScrollArrow
              dir={-1}
              disabled={!topicsCanPrev}
              onClick={() => pageTopics(-1, 0.8)}
              label="이전 주제"
            />
            <ScrollArrow
              dir={1}
              disabled={!topicsCanNext}
              onClick={() => pageTopics(1, 0.8)}
              label="다음 주제"
            />
          </div>
        )}
      </section>
    </>
  );
}

function SearchField() {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="relative mt-3"
      aria-label="주제 검색"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ash"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="search"
        placeholder="궁금한 주제나 키워드를 검색해보세요"
        className="w-full rounded-full border border-stone bg-taupe py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
      />
    </form>
  );
}

function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const { ref, index, canPrev, canNext, onScroll, page, toIndex } =
    useScroller<HTMLUListElement>();

  return (
    <section aria-label="주요 콘텐츠" className="relative mt-4">
      <ul
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4"
      >
        {slides.map((slide) => (
          <li key={slide.id} className="w-full shrink-0 snap-center pr-3 last:pr-0">
            <HeroCard slide={slide} />
          </li>
        ))}
      </ul>

      {slides.length > 1 && (
        <>
          <ScrollArrow dir={-1} disabled={!canPrev} onClick={() => page(-1)} label="이전 콘텐츠" />
          <ScrollArrow dir={1} disabled={!canNext} onClick={() => page(1)} label="다음 콘텐츠" />

          {/* 점은 표시가 아니라 조작이다. 눌러서 옮길 수 있어야 한다. */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => toIndex(i)}
                aria-label={`${i + 1}번째 콘텐츠로 이동`}
                aria-current={i === index ? "true" : undefined}
                className="grid h-5 place-items-center px-0.5"
              >
                <span
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-navy" : "w-1.5 bg-stone"
                  }`}
                />
              </button>
            ))}
            <span className="sr-only">
              {index + 1} / {slides.length}
            </span>
          </div>
        </>
      )}
    </section>
  );
}

function HeroCard({ slide }: { slide: HeroSlide }) {
  return (
    <Link
      href={slide.href}
      className="group relative block aspect-[4/5] overflow-hidden rounded-card-lg border border-stone bg-taupe sm:aspect-[16/10]"
    >
      <div className="absolute inset-0">{slide.visual}</div>
      {/* 글자를 읽히게 하는 최소한의 빛. 비주얼을 다 덮지는 않는다. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-eggshell via-eggshell/85 to-eggshell/10"
      />

      <div className="relative flex h-full flex-col justify-end p-5">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded bg-ink px-2 py-0.5 text-[10px] font-bold text-eggshell">
            {slide.kicker}
          </span>
          <span className="rounded bg-stone px-2 py-0.5 text-[10px] font-semibold text-graphite">
            {slide.tag}
          </span>
        </div>

        <h3 className="mt-3 text-[26px] font-light leading-[1.25] tracking-[-0.02em] text-ink">
          {slide.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-graphite">{slide.subtitle}</p>

        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-eggshell transition-colors group-hover:bg-graphite">
          자세히 보기
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>

        {slide.note && (
          <span className="absolute right-5 top-5 rounded-full bg-eggshell/90 px-2.5 py-1 text-[10px] font-semibold text-graphite ring-1 ring-stone backdrop-blur">
            {slide.note}
          </span>
        )}
      </div>
    </Link>
  );
}

/**
 * 업적 카드. 일곱 칸 중 몇 칸이 찼는지 함께 보인다.
 *
 * 둘러보기의 카드와 같은 판단을 쓰되, 홈은 가로로 흐르므로 더 좁다.
 * 칸 이름을 다 적을 자리가 없어 점으로만 표시하고 개수를 따로 적는다.
 */
function AchievementCard({ achievement }: { achievement: Achievement }) {
  const parts = achievementParts(achievement);
  const ready = parts.filter(Boolean).length;

  return (
    <Link
      href={`/achievement/${achievement.slug}`}
      className="flex h-full flex-col rounded-card border border-stone bg-taupe p-3.5 transition-colors hover:border-graphite"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-navy">{achievement.kicker}</span>
        {achievement.publishStatus === "draft" && (
          <span className="rounded-full bg-pending-tint px-1.5 py-0.5 text-[9px] font-semibold text-pending">
            초안
          </span>
        )}
      </div>

      <h3 className="mt-1.5 text-[14px] font-bold leading-snug text-ink">
        {achievement.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-smoke">
        {achievement.subtitle}
      </p>

      <div className="mt-auto pt-3">
        <div className="flex items-center gap-1" aria-hidden="true">
          {parts.map((present, i) => (
            <span
              key={PART_LABELS[i]}
              title={PART_LABELS[i]}
              className={`h-1.5 w-1.5 rounded-full ${present ? "bg-ink" : "bg-stone"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-ash">
          <span className="tabular">{ready}</span>/7 구성 · 근거{" "}
          <span className="tabular">{achievement.claims.length}</span>건
        </p>
      </div>
    </Link>
  );
}

function TopicCard({ item, claims }: { item: Milestone; claims: Claim[] }) {
  const claim = claims.find((c) => c.id === item.claimIds[0]);
  const href = item.achievementSlug ? `/achievement/${item.achievementSlug}` : "/explore";

  return (
    <div className="flex h-full flex-col rounded-card border border-stone bg-taupe p-3.5">
      <span className="text-[10px] font-bold text-navy">
        {CATEGORY_LABEL[item.categories[0]]}
      </span>
      <Link href={href} className="mt-1.5 block">
        <h3 className="text-[13px] font-bold leading-snug text-ink">{item.title}</h3>
      </Link>

      {item.highlight ? (
        <p className="tabular mt-2.5 text-lg font-bold leading-none text-ink">
          {item.highlight.value}
        </p>
      ) : (
        <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-ash">
          {item.summary}
        </p>
      )}

      <div className="mt-auto pt-3">
        <span className="text-[10px] text-ash">{STATUS_LABEL[item.status]}</span>
        {claim && (
          <div className="mt-2">
            <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
          </div>
        )}
      </div>
    </div>
  );
}
