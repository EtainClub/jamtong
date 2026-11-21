"use client";

import Link from "next/link";

import { track } from "@/lib/analytics";

import { SOUVENIR_STATUS_LABEL, type MemorialEntry, type MemorialFact } from "./types";

/**
 * 사진첩 한 장 — 업적을 한눈에 알아보게 하는 카드(docs/garden-achievement-strategy.md §3).
 * 사진(설명용 삽화 또는 공유 카드), 한 줄 요약, 핵심 숫자 셋, 반론 한 줄, 원본 링크.
 *
 * ★ 사진이 무엇인지 밝힌다. 삽화는 실제 장면이 아니다 — 사진 아래에 그렇게 적는다.
 * ★ 숫자마다 근거의 층을 단다. 주장(CLAIM)이면 누구의 주장인지, 확인 전이면 그것까지. 반론이 있으면 같은 카드에 둔다.
 */
export function PhotoCard({
  entry,
  from,
  compact = false,
}: {
  entry: MemorialEntry;
  /** 계측 — 어디서 업적 페이지로 갔는지. */
  from: "album" | "memorial" | "room";
  compact?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone bg-white">
      <figure className="relative">
        {/* 정원 앱 안의 작은 사진이다. 공유 카드는 동적 경로라 next/image 설정을 늘리지 않고 그대로 싣는다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={entry.photo.src} alt={entry.photo.alt} loading="lazy" className="aspect-[1200/630] w-full bg-[var(--g-panel)] object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
          {entry.icon} {entry.kicker}
        </span>
        {entry.status && (
          <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-ink">{SOUVENIR_STATUS_LABEL[entry.status]}</span>
        )}
        <figcaption className="px-3 pt-1.5 text-[10.5px] text-smoke">
          {entry.photo.kind === "illustration" ? "설명용 AI 삽화 — 실제 장면이 아니에요" : "이 업적의 공유 카드"}
        </figcaption>
      </figure>
      <div className="px-3 pb-3 pt-1">
        <h3 className="text-[15px] font-bold leading-snug">{entry.title}</h3>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-smoke">{compact ? entry.subtitle : entry.summary}</p>
        <ul className="mt-2 space-y-1.5">
          {entry.facts.slice(0, compact ? 1 : 3).map((f) => (
            <FactLine key={f.anchor + f.label} fact={f} />
          ))}
        </ul>
        {!compact && entry.counter && (
          <p className="mt-2 rounded-xl bg-[var(--g-panel)] px-2.5 py-2 text-[12px] leading-relaxed">
            <b className="mr-1">반론</b>
            {entry.counter.text}{" "}
            <Link href={entry.counter.href} className="underline underline-offset-2">
              보기
            </Link>
          </p>
        )}
        <Link
          href={entry.href}
          onClick={() => track("photo_go", { slug: entry.slug, from })}
          className="mt-2 inline-flex min-h-[44px] items-center text-[13px] font-semibold text-graphite underline underline-offset-2"
        >
          업적 자세히 보기 — 근거와 출처 →
        </Link>
      </div>
    </article>
  );
}

const TYPE_LABEL: Record<MemorialFact["type"], string> = { FACT: "사실", CLAIM: "주장", INTERPRETATION: "해석", OPINION: "의견" };

function FactLine({ fact }: { fact: MemorialFact }) {
  const tag = fact.type === "CLAIM" && fact.by ? `${fact.by}의 주장` : TYPE_LABEL[fact.type];
  return (
    <li className="rounded-xl bg-[var(--g-panel)] px-2.5 py-1.5">
      <p className="flex flex-wrap items-baseline gap-x-1.5 text-[12.5px]">
        <span className="text-smoke">{fact.label}</span>
        <b className="text-[14px] tabular-nums">{fact.value}</b>
        <span className="rounded-full border border-stone px-1.5 text-[10px] text-smoke">{tag}</span>
        {!fact.verified && <span className="rounded-full border border-stone px-1.5 text-[10px] text-smoke">확인 전</span>}
      </p>
      {fact.caption && <p className="mt-0.5 text-[11.5px] leading-snug text-smoke">{fact.caption}</p>}
    </li>
  );
}
