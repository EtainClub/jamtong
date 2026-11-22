"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PlantArt } from "../GardenArt";
import { PhotoCard } from "../memorial/PhotoCard";
import { entryOf } from "../memorial/useMemorial";
import type { MemorialEntry } from "../memorial/types";
import { ROOM_BOOKS } from "../room/books";
import { josa, RAID_KINDS } from "../rules";
import type { Species } from "../types";
import { loadClip, type BookClip, type Clip, type PolicyClip, type WordsClip } from "./clips";
import { parseAnchor, type Anchor, type MomentData } from "./rules";

/**
 * 사진의 "사실 칸" — 콘텐츠와 정원 기록에서만 그린다(docs/garden-album-review.md §3).
 * 사람이 쓴 글은 여기에 들어오지 않는다. 말풍선(PhotoView)이 따로 그린다.
 *
 * ★ claim의 층을 그대로 단다 — 주장(CLAIM)이면 누구의 주장인지, 확인 전이면 그것까지.
 * ★ 근거·원문으로 가는 링크를 누르면 onSource — 댓글의 "근거 봤어요"가 열린다.
 */
export function PhotoBody({
  a,
  md,
  entries,
  byId,
  onSource,
}: {
  a: string;
  md?: MomentData;
  entries: readonly MemorialEntry[] | null | undefined;
  byId: ReadonlyMap<string, Species>;
  onSource?: () => void;
}) {
  const anchor = parseAnchor(a);
  return (
    <div
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest("a")) onSource?.();
      }}
    >
      {!anchor ? <Missing /> : <Body anchor={anchor} md={md} entries={entries} byId={byId} />}
    </div>
  );
}

function Body({ anchor, md, entries, byId }: { anchor: Anchor; md?: MomentData; entries: readonly MemorialEntry[] | null | undefined; byId: ReadonlyMap<string, Species> }) {
  if (anchor.kind === "achievement") {
    const entry = entryOf(entries, `a:${anchor.slug}`);
    if (entries === undefined) return <Loading />;
    return entry ? <PhotoCard entry={entry} from="album" /> : <Missing />;
  }
  if (anchor.kind === "cut") {
    if (entries === undefined) return <Loading />;
    const entry = entryOf(entries, `a:${anchor.slug}`);
    const panel = entry?.cartoon?.panels.find((p) => p.id === anchor.scene);
    if (!entry || !panel) return <Missing />;
    return (
      <Frame tag={`${entry.icon} 카툰 한 칸`} title={entry.title}>
        <figure className="relative">
          {/* 정원 안의 작은 그림이다. 빌드된 정적 파일이라 next/image 설정을 늘리지 않는다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={panel.image} alt="" loading="lazy" className="aspect-[3/2] w-full rounded-xl bg-[var(--g-panel)] object-cover" />
          {panel.fact && <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2 py-0.5 text-[12px] font-bold">{panel.fact}</span>}
          <figcaption className="mt-1 text-[10.5px] text-smoke">설명용 AI 삽화 — 실제 장면이 아니에요</figcaption>
        </figure>
        <p className="mt-1.5 text-[13.5px] font-bold leading-snug">{panel.title}</p>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-smoke">{panel.say}</p>
        <Go href={entry.href}>업적 자세히 보기 — 근거와 출처 →</Go>
      </Frame>
    );
  }
  if (anchor.kind === "moment") return <MomentBody t={anchor.moment} md={md} entries={entries} byId={byId} />;
  return <ClipBody anchor={anchor} />;
}

function ClipBody({ anchor }: { anchor: Extract<Anchor, { kind: "words" | "policy" | "book" }> }) {
  const [clip, setClip] = useState<Clip | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    void loadClip(anchor.kind, anchor.slug).then((c) => alive && setClip(c));
    return () => {
      alive = false;
    };
  }, [anchor.kind, anchor.slug]);
  if (clip === undefined) return <Loading />;
  if (!clip) return <Missing />;
  if (anchor.kind === "words" && clip.kind === "words") return <WordsBody clip={clip} point={anchor.point} />;
  if (anchor.kind === "policy" && clip.kind === "policy") return <PolicyBody clip={clip} claim={anchor.claim} />;
  if (anchor.kind === "book" && clip.kind === "book") return <BookBody clip={clip} chapter={anchor.chapter} />;
  return <Missing />;
}

function WordsBody({ clip, point }: { clip: WordsClip; point?: string }) {
  const p = point ? clip.points.find((x) => x.id === point) : undefined;
  if (point && !p) return <Missing />;
  return (
    <Frame tag={`💬 언행 · ${clip.label}`} title={clip.title}>
      <p className="text-[11.5px] text-smoke">
        {clip.channel} · {clip.displayDate}
      </p>
      {p ? (
        <>
          <p className="mt-1.5 text-[13.5px] font-bold leading-snug">{p.title}</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-smoke">{p.say}</p>
          <blockquote className="mt-2 border-l-2 border-stone pl-2.5 text-[12.5px] leading-relaxed">
            <span className="mb-0.5 block text-[10.5px] font-semibold text-smoke">원문에서 이 대목</span>
            {p.quote}
          </blockquote>
          <p className="mt-1 text-[10.5px] text-smoke">쉬운 말은 옮긴 것이에요. 원문과 함께 봐 주세요.</p>
        </>
      ) : (
        clip.intro && <p className="mt-1.5 text-[12.5px] leading-relaxed text-smoke">{clip.intro}</p>
      )}
      <Go href={clip.href}>원문 전체 보기 →</Go>
    </Frame>
  );
}

/** 을/를만 — josa()는 단어까지 붙여 돌려준다. 낫표 뒤에 조사만 붙인다. */
function eul(word: string): string {
  return josa(word, "을를").slice(word.length);
}

const TYPE_LABEL = { FACT: "사실", CLAIM: "주장", INTERPRETATION: "해석", OPINION: "의견" } as const;

function PolicyBody({ clip, claim }: { clip: PolicyClip; claim: string }) {
  const c = clip.claims.find((x) => x.id === claim);
  if (!c) return <Missing />;
  return (
    <Frame tag="🔎 정책 팩트" title={clip.title}>
      {c.rumor && (
        <p className="rounded-xl bg-[var(--g-panel)] px-2.5 py-1.5 text-[12.5px] leading-relaxed">
          <b className="mr-1 text-smoke">도는 주장</b>「{c.rumor}」
        </p>
      )}
      <p className="mt-1.5 text-[13px] leading-relaxed">
        <b className="mr-1">{c.rumor ? "확인한 것" : "확인된 것"}</b>
        {c.text}
      </p>
      <p className="mt-1 flex flex-wrap gap-1 text-[10.5px] text-smoke">
        <span className="rounded-full border border-stone px-1.5">{c.type === "CLAIM" && c.by ? `${c.by}의 주장` : TYPE_LABEL[c.type]}</span>
        {!c.verified && <span className="rounded-full border border-stone px-1.5">확인 전</span>}
        <span>{clip.asOf} 기준</span>
      </p>
      <Go href={clip.href}>근거와 출처 보기 →</Go>
    </Frame>
  );
}

function BookBody({ clip, chapter }: { clip: BookClip; chapter: string }) {
  const c = clip.chapters.find((x) => x.slug === chapter);
  if (!c) return <Missing />;
  return (
    <Frame tag="📖 책 한 장" title={`『${clip.title}』 (${clip.year})`}>
      <p className="text-[13.5px] font-bold leading-snug">
        {c.order}장 · {c.title}
      </p>
      <p className="mt-0.5 text-[12.5px] leading-relaxed text-smoke">{c.summary}</p>
      <p className="mt-1 text-[10.5px] text-smoke">잼통이 읽고 다시 쓴 요약이에요. 저자의 문장이 아니에요.</p>
      <Go href={c.href}>이 장 요약 읽기 →</Go>
    </Frame>
  );
}

/** 내 정원의 순간 — 정원 기록(품종·물결·책)으로만 그린다. 지어낸 글이 들어갈 자리가 없다. */
function MomentBody({ t, md, entries, byId }: { t: string; md?: MomentData; entries: readonly MemorialEntry[] | null | undefined; byId: ReadonlyMap<string, Species> }) {
  const species = md?.s ? byId.get(md.s) : undefined;
  let tag = "🌱 내 정원의 순간";
  let line = "";
  if (t === "species" && species) {
    tag = "🌱 새 품종";
    line = `「${species.title}」${eul(species.title)} 처음 거뒀어요${md?.v ? ` · 도감 ${md.v}번째` : ""}`;
  } else if ((t === "golden" || t === "rainbow") && species) {
    tag = t === "golden" ? "✨ 황금 열매" : "🌈 무지개 열매";
    line = `「${species.title}」 ${t === "golden" ? "황금" : "무지개"} 열매를 거뒀어요`;
  } else if (t === "raid") {
    const kind = RAID_KINDS.find((k) => k.id === md?.s);
    tag = "🌿 거대 잡초";
    line = `${kind?.name ?? "거대 잡초"}${eul(kind?.name ?? "거대 잡초")} 함께 쓰러뜨렸어요`;
  } else if (t === "souvenir" && species) {
    const entry = entryOf(entries, species.id);
    tag = `🏛 기념품${entry ? ` ${entry.icon}` : ""}`;
    line = `「${species.title}」 퀴즈를 맞혀 기념품을 받았어요`;
  } else if (t === "book") {
    const book = ROOM_BOOKS.find((b) => b.slug === md?.s);
    if (!book) return <Missing />;
    tag = "🔖 완독";
    line = `『${book.title}』${eul(book.title)} 모든 장 다 읽었어요`;
  } else return <Missing />;
  const day = t === "raid" && md?.v ? md.v / 10 : null;
  const when = day ? new Date(Math.floor(day) * 86_400_000).toLocaleDateString("ko-KR", { month: "long", day: "numeric", timeZone: "UTC" }) : null;
  return (
    <Frame tag={tag} title={line}>
      <div className="flex items-center gap-3">
        <div className="h-20 w-20 shrink-0 rounded-xl bg-[var(--g-panel)]">
          {t === "raid" ? <span className="flex h-full items-center justify-center text-[40px]" aria-hidden="true">🌿</span> : t === "book" ? <span className="flex h-full items-center justify-center text-[40px]" aria-hidden="true">📚</span> : <PlantArt species={species} />}
        </div>
        <p className="text-[12px] leading-relaxed text-smoke">
          정원 기록으로 그린 사진이에요.{when ? ` ${when}의 물결.` : ""}
          {species && (t === "species" || t === "souvenir") && entryOf(entries, species.id) && (
            <>
              {" "}
              <Link href={entryOf(entries, species.id)!.href} className="underline underline-offset-2">
                이 업적 보기
              </Link>
            </>
          )}
        </p>
      </div>
    </Frame>
  );
}

function Frame({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone bg-white px-3 pb-3 pt-2.5">
      <p className="text-[11px] font-semibold text-smoke">{tag}</p>
      <h3 className="mb-1.5 mt-0.5 text-[15px] font-bold leading-snug">{title}</h3>
      {children}
    </article>
  );
}

function Go({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mt-1.5 inline-flex min-h-[40px] items-center text-[13px] font-semibold text-graphite underline underline-offset-2">
      {children}
    </Link>
  );
}

function Loading() {
  return <p className="rounded-2xl border border-dashed border-stone px-3 py-6 text-center text-[12.5px] text-smoke">사진을 여는 중…</p>;
}

/** 자료가 사라졌거나 모양이 틀렸다. 링크를 만들지 않는다. */
function Missing() {
  return <p className="rounded-2xl border border-dashed border-stone px-3 py-6 text-center text-[12.5px] text-smoke">더 이상 없는 자료예요</p>;
}
