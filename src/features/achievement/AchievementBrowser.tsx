"use client";

import { useState } from "react";
import Link from "next/link";

import type { AchievementCardData } from "@/content/achievements";
import type { AchievementCategory } from "@/content/schema";

/**
 * 업적 고르기.
 *
 * 스물둘을 분야별로 한 화면에 쭉 늘어놓으면 결국 스물둘을 한 줄로 늘어놓은
 * 것과 같다 — 묶음 제목만 사이사이 끼어 있을 뿐이다. 그래서 **분야를 먼저
 * 보이고, 고른 분야만 편다.**
 *
 * ★ 한 업적이 여러 분야에 나온다.
 *   분야는 서랍이 아니라 들어가는 문이다. 경제만 열어 보는 사람에게 원유
 *   수급이 안 보이면, 그 사람이 가장 보고 싶어 할 것을 우리가 숨긴 셈이 된다.
 *   그래서 분야별 건수를 더하면 전체 건수보다 크다. 그 둘을 나란히 두지
 *   않는다 — 분야 칸에는 그 분야의 건수를, 전체 건수는 맨 위에 따로 적는다.
 *
 * ★ 고른 뒤에도 막다른 길을 만들지 않는다.
 *   분야를 펴면 위에 다른 분야 단추를 남겨 둔다. 되돌아가야만 다른 분야로
 *   갈 수 있으면, 두 분야를 견줘 보려던 사람이 매번 두 번씩 누르게 된다.
 *
 * 상태는 이 컴포넌트 안에만 둔다. 주소에 싣는 것도 생각했지만, 이 고르기는
 * 공유할 만한 무엇이 아니라 목록을 훑는 손놀림에 가깝다.
 */

export interface BrowserGroup {
  category: AchievementCategory;
  label: string;
  note: string;
  slugs: string[];
}

/** 분야 말고 따로 세우는 칸. 분야가 아니므로 분야 목록에 섞지 않는다. */
type Pick = AchievementCategory | "featured";

export function AchievementBrowser({
  cards,
  groups,
  featuredSlugs,
  partLabels,
}: {
  cards: AchievementCardData[];
  groups: BrowserGroup[];
  featuredSlugs: string[];
  /**
   * 일곱 칸 이름.
   *
   * content/achievements에서 바로 가져오지 않는다. 그 모듈은 업적 스물둘을
   * 전부 끌고 오고, 클라이언트 컴포넌트에서 그걸 import하면 근거·인용문·
   * 관계도가 통째로 번들에 실린다. 예전에 홈이 628KB까지 갔던 이유다.
   */
  partLabels: readonly string[];
}) {
  const [picked, setPicked] = useState<Pick | null>(null);

  const bySlug = new Map(cards.map((card) => [card.slug, card]));
  const take = (slugs: string[]) =>
    slugs.flatMap((slug) => {
      const card = bySlug.get(slug);
      return card ? [card] : [];
    });

  const tiles: { id: Pick; label: string; note: string; count: number }[] = [
    {
      id: "featured",
      label: "주요 업적",
      note: "분야를 가리지 않고 먼저 볼 만한 것을 골랐습니다.",
      count: featuredSlugs.length,
    },
    ...groups.map((group) => ({
      id: group.category as Pick,
      label: group.label,
      note: group.note,
      count: group.slugs.length,
    })),
  ];

  if (picked === null) {
    return (
      <section aria-labelledby="ex-pick" className="mt-7">
        <h2 id="ex-pick" className="sr-only">
          분야 고르기
        </h2>
        <ul className="grid grid-cols-2 gap-2.5">
          {tiles.map((tile) => (
            <li key={tile.id}>
              <button
                type="button"
                onClick={() => setPicked(tile.id)}
                className="flex h-full w-full flex-col rounded-card border border-stone bg-taupe px-4 py-3.5 text-left transition-colors hover:border-graphite"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-bold text-ink">{tile.label}</span>
                  <span className="tabular shrink-0 text-[12px] font-semibold text-navy">
                    {tile.count}
                  </span>
                </span>
                <span className="mt-1.5 text-[11.5px] leading-relaxed text-ash">
                  {tile.note}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11.5px] leading-relaxed text-ash">
          한 업적이 여러 분야에 나옵니다. 원유 수입처 다변화는 외교이면서
          경제입니다. 그래서 분야 건수를 더하면 전체 건수보다 큽니다.
        </p>
      </section>
    );
  }

  const current = tiles.find((tile) => tile.id === picked);
  const slugs =
    picked === "featured"
      ? featuredSlugs
      : (groups.find((group) => group.category === picked)?.slugs ?? []);
  const items = take(slugs);

  return (
    <section aria-labelledby="ex-picked" className="mt-7">
      {/* 다른 분야로 바로 건너뛸 수 있게 단추를 남긴다 */}
      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
        <button
          type="button"
          onClick={() => setPicked(null)}
          className="shrink-0 rounded-full border border-stone px-3 py-1.5 text-[12px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-ink"
        >
          ← 분야
        </button>
        {tiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => setPicked(tile.id)}
            aria-current={tile.id === picked ? "true" : undefined}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
              tile.id === picked
                ? "bg-ink text-eggshell"
                : "border border-stone text-smoke hover:border-graphite hover:text-ink"
            }`}
          >
            {tile.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h2 id="ex-picked" className="text-[17px] font-bold text-ink">
          {current?.label}
        </h2>
        <span className="tabular text-[11px] text-ash">{items.length}건</span>
      </div>
      <p className="mt-1.5 text-[12px] leading-relaxed text-ash">{current?.note}</p>

      <ul className="mt-4 space-y-3">
        {items.map((card) => (
          <li key={card.id}>
            <Card card={card} showCategory={picked === "featured"} partLabels={partLabels} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * 업적 카드.
 *
 * 분야 이름은 분야가 섞이는 '주요 업적'에서만 적는다. 한 분야를 편 화면에서는
 * 바로 위 제목이 이미 그 분야를 말하고 있어, 카드마다 한 번 더 붙이면 같은
 * 말이 두 번 찍힌다.
 */
function Card({
  card,
  showCategory,
  partLabels,
}: {
  card: AchievementCardData;
  showCategory: boolean;
  partLabels: readonly string[];
}) {
  const ready = card.parts.filter(Boolean).length;

  return (
    <Link
      href={`/achievement/${card.slug}`}
      className="block rounded-card border border-stone bg-taupe p-4 transition-colors hover:border-graphite"
    >
      {(showCategory || card.isDraft) && (
        <div className="mb-1.5 flex items-center gap-2">
          {showCategory && (
            <span className="text-[10px] font-bold text-navy">{card.categoryLabels[0]}</span>
          )}
          {card.isDraft && (
            <span className="rounded-full bg-pending-tint px-2 py-0.5 text-[10px] font-semibold text-pending">
              초안
            </span>
          )}
        </div>
      )}

      <p className="text-base font-bold text-ink">{card.title}</p>
      <p className="mt-1 text-[13px] leading-snug text-smoke">{card.subtitle}</p>

      {/* 일곱 칸 중 몇 칸이 찼는지. 채워진 칸은 잉크, 빈 칸은 테두리만. */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
        {card.parts.map((present, i) => (
          <span
            key={partLabels[i]}
            title={partLabels[i]}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              present ? "bg-ink text-eggshell" : "border border-stone text-ash"
            }`}
          >
            {partLabels[i]}
          </span>
        ))}
      </div>

      <p className="mt-2.5 text-[11px] text-ash">
        {ready}/7 구성 · 근거 {card.claimCount}건 · 자료 {card.sourceCount}건
      </p>
    </Link>
  );
}
