import Link from "next/link";

import { buildCatalog } from "@/features/garden/catalog";
import { SeedGiftLink } from "@/features/garden/SeedGiftLink";

/**
 * 원본 페이지 끝의 작은 문들 — 씨앗 받기(정원)와 잼공(docs/daily-study.md §8.4). 서버에서 그린다.
 *
 * ★ 페이지 맨 끝, 정정 링크 위에 둔다. 정보 페이지는 게임·공부 레이어가 가리지 않는다(docs/garden-game.md §1).
 * ★ 씨앗은 품종표에 있는 것만 건넨다(없는 품종의 링크는 정원에서 아무것도 주지 않는다).
 */

let titles: Map<string, string> | null = null;

/** 품종 id(a:·p:·w:)가 정원 품종표에 있으면 그 이름. */
export function speciesTitle(id: string): string | null {
  titles ??= new Map(buildCatalog().map((s) => [s.id, s.title]));
  return titles.get(id) ?? null;
}

export function PageDoors({
  seed,
  study,
  className = "",
  inset = true,
}: {
  /** 정원 품종 id. 품종표에 없으면 씨앗 문은 그리지 않는다. */
  seed?: string;
  /** 잼공 단원(업적 slug). 없으면 오늘의 한 판으로. */
  study?: { slug?: string; title?: string };
  className?: string;
  /** 바깥 여백(넓은 페이지용). 이미 여백이 있는 좁은 본문에서는 false. */
  inset?: boolean;
}) {
  const title = seed ? speciesTitle(seed) : null;
  return (
    <div className={`space-y-3 ${className}`}>
      {seed && title && <SeedGiftLink speciesId={seed} title={title} inset={inset} />}
      {study && (
        <div className={inset ? "mx-auto max-w-5xl px-5" : ""}>
          <Link
            href={study.slug ? `/study?unit=${encodeURIComponent(study.slug)}` : "/study"}
            className="flex items-center gap-3 rounded-card border border-stone bg-taupe/60 px-4 py-3 text-[13px] text-graphite transition-colors hover:border-graphite"
          >
            <span className="text-xl" aria-hidden>
              📖
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">{study.title ? `「${study.title}」 내용으로 연습하기` : "잼공 — 하루 5분, 근거로 말하는 연습"}</span>
              <span className="text-[12px] text-smoke">
                {study.slug ? "잼공에서 O/X로 풀어 보고, 근거를 근거노트에 모아요." : "성남시장 시절부터 이재명 정부까지, O/X로 풀며 근거 카드를 모아요. 하루 목표를 채우면 정원에서 잼을 받아요."}
              </span>
            </span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
