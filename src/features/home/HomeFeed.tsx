"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Milestone, Category, Claim } from "@/content/schema";
import { PART_LABELS, type AchievementCardData } from "@/content/achievements";
import { ScrollArrow, useScroller } from "@/features/app/Scroller";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/content/labels";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { KIND_LABEL, search, type SearchEntry } from "@/content/search";
import type { WikiConceptCard } from "@/lib/wiki/load";

/**
 * 홈 피드.
 *
 * 순서에 의도가 있다: 히어로 → 업적 → 위키 → 세부 성과.
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
  totalPublished,
  wikiConcepts,
  claims,
}: {
  slides: HeroSlide[];
  achievements: AchievementCardData[];
  topics: Milestone[];
  /** 위키의 개념 페이지. 업적 하나로는 보이지 않는 이야기가 여기 모인다. */
  wikiConcepts: WikiConceptCard[];
  /** 공개된 업적 전체 수. 히어로가 몇 건 중 몇 건인지 밝히는 데 쓴다. */
  totalPublished: number;

  claims: Claim[];
}) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const q = query.trim();

  /*
   * 검색 인덱스는 첫 화면에 실어 보내지 않는다(41KB). 검색창을 건드릴 때
   * 한 번 받아 두고, 그 뒤로는 브라우저 안에서 즉시 찾는다.
   * 받아 오지 못해도 사이트의 나머지는 그대로 동작한다.
   */
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const loading = useRef(false);

  const ensureIndex = useCallback(async () => {
    if (index || loading.current) return;
    loading.current = true;
    try {
      const res = await fetch("/api/search-index");
      if (res.ok) setIndex((await res.json()) as SearchEntry[]);
    } catch {
      // 검색만 동작하지 않는다. 나머지는 그대로다.
    } finally {
      loading.current = false;
    }
  }, [index]);

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
      <SearchField value={query} onChange={setQuery} onActivate={ensureIndex} />

      {/*
       * 찾는 동안에는 피드를 걷는다. 결과 아래에 히어로와 목록이 그대로 남으면
       * 무엇이 결과인지 알 수 없다.
       */}
      {q ? (
        <SearchResults query={q} index={index} />
      ) : (
        <>

      <HeroCarousel slides={slides} total={totalPublished} />

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

      <section aria-labelledby="home-wiki" className="mt-9">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="home-wiki" className="text-[17px] font-bold tracking-tight text-ink">
            위키
          </h2>
          <Link href="/wiki" className="text-[12px] font-medium text-navy">
            전체 보기
          </Link>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-ash">
          업적 하나, 언행 하나로는 보이지 않는 이야기를 모읍니다. 여기서도 모든
          단정문에 원자료 근거가 붙습니다.
        </p>

        <ul className="mt-4 divide-y divide-stone border-y border-stone">
          {wikiConcepts.map((concept) => (
            <li key={concept.name}>
              <Link
                href={`/wiki/${concept.name}`}
                className="block py-3 transition-colors hover:bg-taupe/40"
              >
                <span className="text-[14px] font-bold text-ink">{concept.title}</span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-smoke">
                  {concept.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
      )}
    </>
  );
}

function SearchField({
  value,
  onChange,
  onActivate,
}: {
  value: string;
  onChange: (next: string) => void;
  /** 검색을 시작하려는 첫 신호. 이때 인덱스를 받아 둔다. */
  onActivate: () => void;
}) {
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
        value={value}
        onFocus={onActivate}
        onChange={(e) => {
          onActivate();
          onChange(e.target.value);
        }}
        placeholder="궁금한 주제나 키워드를 검색해보세요"
        className="w-full rounded-full border border-stone bg-taupe py-3 pl-10 pr-10 text-sm text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="검색어 지우기"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ash transition-colors hover:bg-stone hover:text-smoke"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </form>
  );
}

/**
 * 검색 결과.
 *
 * 찾는 동안에는 피드를 걷는다. 결과 아래에 히어로와 목록이 그대로 남아 있으면
 * 무엇이 결과인지 알 수 없다.
 */
function SearchResults({ query, index }: { query: string; index: SearchEntry[] | null }) {
  // 인덱스가 아직 오지 않았으면 "없다"가 아니라 "불러오는 중"이다.
  const pending = index === null;
  const hits = useMemo(() => (index ? search(index, query) : []), [index, query]);

  if (hits.length === 0) {
  if (pending) {
    return (
      <p className="mt-8 text-[13px] text-ash" aria-live="polite">
        검색 준비 중…
      </p>
    );
  }

    return (
      <section aria-live="polite" className="mt-8">
        <p className="text-[15px] font-semibold text-ink">
          &lsquo;{query}&rsquo;에 대한 결과가 없습니다.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          업적의 근거 문장과 연표, 대통령의 언행 원문까지 찾습니다. 다른 낱말로 해 보시거나{" "}
          <Link href="/explore" className="font-medium text-navy underline underline-offset-2">
            업적 목록
          </Link>
          을 둘러보세요.
        </p>
      </section>
    );
  }

  return (
    <section aria-live="polite" className="mt-6">
      <p className="text-[12px] text-ash">
        <span className="tabular">{hits.length}</span>건 찾았습니다
      </p>
      <ul className="mt-3 space-y-2">
        {hits.map((hit) => (
          <li key={hit.id}>
            <Link
              href={hit.href}
              className="block rounded-card border border-stone bg-taupe px-4 py-3 transition-colors hover:border-graphite"
            >
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[10px] font-bold text-navy">{KIND_LABEL[hit.kind]}</span>
                {hit.context && <span className="text-[10px] text-ash">{hit.context}</span>}
              </div>
              <p className="mt-1 text-[14px] font-semibold leading-snug text-ink">{hit.title}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-smoke">{hit.detail}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HeroCarousel({ slides, total }: { slides: HeroSlide[]; total: number }) {
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
      {/*
       * 무엇을 세웠는지 적는다. 몇 건 중 몇 건인지 밝히지 않으면 전부인 줄 알거나
       * 무언가를 감춘 것으로 읽힌다. 바로 아래 줄에 전체가 있다.
       */}
      <p className="mt-4 flex items-baseline justify-between gap-3 text-[12px] text-ash">
        <span>
          대표 업적 <span className="tabular">{slides.length}</span>건
        </span>
        <Link href="/explore" className="font-medium text-navy">
          전체 <span className="tabular">{total}</span>건 보기
        </Link>
      </p>
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
function AchievementCard({ achievement }: { achievement: AchievementCardData }) {
  const { parts } = achievement;
  const ready = parts.filter(Boolean).length;

  return (
    <Link
      href={`/achievement/${achievement.slug}`}
      className="flex h-full flex-col rounded-card border border-stone bg-taupe p-3.5 transition-colors hover:border-graphite"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-navy">{achievement.kicker}</span>
        {achievement.isDraft && (
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
          <span className="tabular">{achievement.claimCount}</span>건
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
