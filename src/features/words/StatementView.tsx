"use client";

import { useState } from "react";

import type { Statement } from "@/content/words/schema";
import { CardCarousel } from "@/features/carousel/CardCarousel";
import { WORD_ART } from "./art";

/**
 * 원문 / 쉽게 보기 전환.
 *
 * 업적의 ViewSwitch와 모양은 같지만 상태를 공유하지 않는다. 저쪽은 씬·모션
 * 진행도까지 URL에 싣는 큰 살림이고, 여기는 둘 중 하나를 고르는 것이 전부다.
 * 그 스토어에 얹으면 업적에서 원문을 켜 두면 언행도 원문으로 열린다.
 *
 * ★ 기본은 쉽게 보기다. 다만 쉽게 보기가 없는 짧은 글은 원문만 띄운다.
 *   토글도 그릴 필요가 없다 — 고를 것이 없는데 고르라고 두면 안 된다.
 */
export function StatementView({ statement }: { statement: Statement }) {
  const [view, setView] = useState<"easy" | "full">(statement.easy ? "easy" : "full");

  return (
    <>
      {statement.easy && (
        <div
          role="radiogroup"
          aria-label="보기 방식"
          className="mt-6 inline-flex rounded-full border border-stone bg-taupe p-1"
        >
          {(
            [
              { id: "easy", label: "쉽게 보기" },
              { id: "full", label: "원문 보기" },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={option.id === view}
              onClick={() => setView(option.id)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                option.id === view ? "bg-ink text-eggshell" : "text-smoke hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {!statement.body && statement.overview ? (
        <section className="mt-7" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
            영상에서 다룬 주요 내용 · 제공된 요약
          </h2>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.9] text-ink">
            {statement.overview}
          </p>
        </section>
      ) : view === "easy" && statement.easy ? (
        <EasyView statement={statement} onOpenFull={() => setView("full")} />
      ) : (
        <FullView statement={statement} />
      )}
      {statement.media.length > 0 && <MediaList statement={statement} />}
    </>
  );
}

/** Extract IDs from YouTube watch, share, embed, Shorts, and live URLs. */
function youtubeVideoId(value: string): string | null {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.split("/").filter(Boolean);
    const id =
      host === "youtu.be"
        ? path[0]
        : ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)
          ? url.searchParams.get("v") ??
            (["embed", "shorts", "live"].includes(path[0]) ? path[1] : null)
          : null;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function MediaList({ statement }: { statement: Statement }) {
  return (
    <section aria-labelledby="media-heading" className="mt-8">
      <h2 id="media-heading" className="text-[13px] font-bold text-ink">
        영상 자료
      </h2>
      <ul className="mt-3 space-y-5">
        {statement.media.map((media) => {
          const videoId = media.type === "youtube" ? youtubeVideoId(media.url) : null;
          return (
            <li key={media.url}>
              {videoId && (
                <div className="aspect-video overflow-hidden rounded-card border border-stone bg-black">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title={media.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}
              <a
                href={media.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-block text-[13px] font-semibold text-navy hover:underline"
              >
                {media.title} ↗
              </a>
              {media.credit && <p className="mt-1 text-[12px] text-ash">{media.credit}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Display the verbatim transcript when one is available. */
function FullView({ statement }: { statement: Statement }) {
  if (!statement.body) return null;
  return (
    <article className="mt-7">
      <div className="rounded-card border border-stone bg-taupe/50 px-5 py-5">
        <p className="whitespace-pre-wrap text-[15px] leading-[1.9] text-ink">
          {statement.body}
        </p>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-ash">
        원문 그대로입니다. 띄어쓰기와 줄바꿈을 고치지 않았습니다.
      </p>

      {statement.glossary.length > 0 && <Glossary statement={statement} />}
    </article>
  );
}

/**
 * 쉽게 보기.
 *
 * 업적의 쉬운 설명과 같은 캐러셀을 쓴다. 한 화면에 한 토막만 두고 넘긴다 —
 * 세로로 늘어놓으면 결국 읽는 글이 되고, 그러면 원문을 읽는 것과 다를 바가
 * 없다.
 *
 * ★ 카드 안에는 그림과 큰 글씨, 그리고 원문 한 대목이 들어간다.
 *   업적 카드가 그 자리에 근거 단추를 두는 것과 같은 자리다. 저쪽은 "이 말의
 *   근거가 어디 있나"이고 여기는 "원문의 어디를 옮긴 것인가"다. 물음은 다르지만
 *   하는 일은 같다 — 요약을 믿으라고 하지 않는다.
 */
function EasyView({
  statement,
  onOpenFull,
}: {
  statement: Statement;
  onOpenFull: () => void;
}) {
  const easy = statement.easy;
  if (!easy) return null;

  return (
    <section aria-labelledby="easy-heading" className="mt-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
        쉽게 보기 · 큰 그림으로 읽기
      </p>
      <p id="easy-heading" className="mt-2.5 text-[17px] font-light leading-relaxed text-ink">
        {easy.intro}
      </p>

      <div className="mt-5">
        <CardCarousel
          items={easy.points}
          label={`장면 ${easy.points.length}개. 좌우 화살표 키로 넘길 수 있어요.`}
          itemLabel={(i) => `${i + 1}번 장면`}
        >
          {(point, i, total) => {
            const Art = point.art ? WORD_ART[point.art] : null;

            return (
              <>
                {Art && (
                  <div className="aspect-[4/3] w-full">
                    <Art />
                  </div>
                )}

                <p className="tabular mt-4 font-mono text-[11px] tracking-[0.1em] text-ash">
                  {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 text-[21px] font-light leading-snug tracking-[-0.02em] text-ink">
                  {point.title}
                </h3>
                <p className="mt-2.5 text-[15.5px] leading-[1.7] text-smoke">{point.say}</p>

                <details className="group mt-3.5">
                  <summary className="cursor-pointer list-none text-[12px] font-semibold text-navy hover:underline">
                    원문에서 이 대목
                    <span aria-hidden="true" className="ml-1 inline-block group-open:hidden">
                      ▾
                    </span>
                    <span aria-hidden="true" className="ml-1 hidden group-open:inline-block">
                      ▴
                    </span>
                  </summary>
                  <blockquote className="mt-2.5 border-l-2 border-stone pl-3 text-[13.5px] leading-relaxed text-ash">
                    {point.quote}
                  </blockquote>
                </details>
              </>
            );
          }}
        </CardCarousel>
      </div>


      {easy.caveat && (
        <div className="mt-6 rounded-card border border-pending/40 bg-pending-tint/40 px-5 py-4">
          <p className="text-[15px] leading-relaxed text-ink">{easy.caveat.text}</p>
          <details className="group mt-3">
            <summary className="cursor-pointer list-none text-[12px] font-semibold text-navy hover:underline">
              원문에서 이 대목
              <span aria-hidden="true" className="ml-1 inline-block group-open:hidden">
                ▾
              </span>
              <span aria-hidden="true" className="ml-1 hidden group-open:inline-block">
                ▴
              </span>
            </summary>
            <blockquote className="mt-2.5 border-l-2 border-stone pl-3 text-[13.5px] leading-relaxed text-ash">
              {easy.caveat.quote}
            </blockquote>
          </details>
        </div>
      )}
      {statement.glossary.length > 0 && <Glossary statement={statement} />}

      <p className="mt-6 text-[12px] leading-relaxed text-ash">
        쉬운 말로 옮긴 것입니다. 옮기는 과정에서 결이 달라질 수 있으니, 이 말을
        두고 이야기할 때는 원문을 보시기 바랍니다.
      </p>

      <button
        type="button"
        onClick={onOpenFull}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-stone bg-taupe px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-graphite"
      >
        원문 그대로 읽기
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

/** 모르면 안 읽히는 말. 뜻만 적고 평가하지 않는다. */
function Glossary({ statement }: { statement: Statement }) {
  return (
    <section aria-labelledby="glossary" className="mt-8">
      <h2 id="glossary" className="text-[13px] font-bold text-ink">
        이 글에 나오는 말
      </h2>
      <dl className="mt-2.5 space-y-2.5">
        {statement.glossary.map((entry) => (
          <div key={entry.term} className="rounded-card border border-stone px-4 py-3">
            <dt className="text-[13px] font-bold text-navy">{entry.term}</dt>
            <dd className="mt-1 text-[13px] leading-relaxed text-smoke">{entry.explain}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
