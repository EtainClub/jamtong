"use client";

import { useMemo, useState } from "react";
import type {
  Achievement,
  AchievementCategory,
  AchievementStatus,
  Claim,
} from "@/content/schema";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/content/labels";
import { AchievementCard } from "./AchievementCard";

/**
 * 성과 피드.
 *
 * 필터는 "나에게 해당되는 것"을 찾는 장치다. 분야만으로는 부족해서 대상층도
 * 함께 둔다 — 어업인에게 필요한 것과 해운기업에 필요한 것은 다르다.
 *
 * 필터 상태는 아직 URL에 싣지 않는다. 스토리의 VisualState와 달리 공유 요구가
 * 확인되지 않았고, 확인되면 같은 url-sync 어댑터로 올리면 된다.
 */

type StatusFilter = AchievementStatus | "all";
type SortMode = "progress" | "recent";

/**
 * 기본 정렬은 "진행 우선"이다.
 *
 * 날짜만으로 내림차순 정렬하면 2028년 계획이 목록 맨 위에 온다. 아직 하지 않은
 * 일이 가장 최근 성과처럼 보이는 셈이라, 이 레이어가 가장 피해야 할 오해다.
 * 완료 → 추진 중 → 계획 순으로 묶고, 묶음 안에서 최신순으로 둔다.
 */
const STATUS_ORDER: Record<AchievementStatus, number> = {
  done: 0,
  ongoing: 1,
  planned: 2,
};

export function Feed({
  achievements,
  claims,
}: {
  achievements: Achievement[];
  claims: Claim[];
}) {
  const [category, setCategory] = useState<AchievementCategory | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [audience, setAudience] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("progress");

  const categories = useMemo(() => {
    const counts = new Map<AchievementCategory, number>();
    for (const item of achievements) {
      for (const c of item.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [achievements]);

  const audiences = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of achievements) {
      for (const a of item.audiences) counts.set(a, (counts.get(a) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [achievements]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return achievements
      .filter((item) => category === "all" || item.categories.includes(category))
      .filter((item) => status === "all" || item.status === status)
      .filter((item) => audience === "all" || item.audiences.includes(audience))
      .filter(
        (item) =>
          needle === "" ||
          item.title.toLowerCase().includes(needle) ||
          item.summary.toLowerCase().includes(needle),
      )
      .sort((a, b) => {
        if (sort === "progress") {
          const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
          if (byStatus !== 0) return byStatus;
        }
        return b.date.localeCompare(a.date);
      });
  }, [achievements, category, status, audience, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">성과 검색</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="궁금한 주제나 키워드를 검색해보세요"
            className="w-full rounded-xl border border-line bg-ink-700 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-ice-600 focus:outline-none"
          />
        </label>

        <FilterRow label="진행 상태">
          <Chip active={status === "all"} onClick={() => setStatus("all")}>
            전체
          </Chip>
          {(["done", "ongoing", "planned"] as const).map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
              {STATUS_LABEL[s]}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="분야">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            전체 {achievements.length}
          </Chip>
          {categories.map(([c, count]) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {CATEGORY_LABEL[c]} {count}
            </Chip>
          ))}
        </FilterRow>

        {audiences.length > 0 && (
          <FilterRow label="대상">
            <Chip active={audience === "all"} onClick={() => setAudience("all")}>
              전체
            </Chip>
            {audiences.map(([a, count]) => (
              <Chip key={a} active={audience === a} onClick={() => setAudience(a)}>
                {a} {count}
              </Chip>
            ))}
          </FilterRow>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted" aria-live="polite">
          {filtered.length}건
          {filtered.length !== achievements.length && ` (전체 ${achievements.length}건 중)`}
        </p>
        <div
          role="radiogroup"
          aria-label="정렬"
          className="inline-flex rounded-lg border border-line bg-ink-700 p-0.5"
        >
          {(
            [
              ["progress", "진행 우선"],
              ["recent", "날짜순"],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={sort === mode}
              onClick={() => setSort(mode)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                sort === mode
                  ? "bg-ink-500/70 text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-xl border border-line bg-ink-700 px-6 py-10 text-center text-sm text-text-secondary">
          조건에 맞는 항목이 없습니다. 필터를 줄여 보세요.
        </p>
      ) : (
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.id}>
              <AchievementCard item={item} claims={claims} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-ice-500 text-ink-900"
          : "bg-white/[0.05] text-text-secondary hover:bg-white/[0.09] hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}
