"use client";

import { useState } from "react";

import type { Statement } from "@/content/words/schema";
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

      {view === "easy" && statement.easy ? (
        <EasyView statement={statement} onOpenFull={() => setView("full")} />
      ) : (
        <FullView statement={statement} />
      )}
    </>
  );
}

/**
 * 원문.
 *
 * `whitespace-pre-wrap`으로 줄바꿈과 빈 줄을 그대로 살린다. 문단을 우리가
 * 다시 나누면 글의 호흡이 바뀐다 — 어디서 끊어 썼는지도 이 사람의 말이다.
 */
function FullView({ statement }: { statement: Statement }) {
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
 * 글을 작게 여러 줄 늘어놓으면 원문을 읽는 것과 다를 바가 없다. 그래서
 * 토막마다 **그림 하나와 큰 글씨 한 덩어리**로 간다 — 스크롤하며 그림만
 * 훑어도 줄거리가 잡히는 것이 이 화면의 목표다.
 *
 * 인용은 접어 둔다. 펼치면 원문의 어느 대목을 옮긴 것인지 바로 대볼 수
 * 있다. 요약을 믿으라고 하지 않고 확인할 수 있게 두는 것이 이 자료의 규칙이다.
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
    <article className="mt-7">
      <p className="text-[19px] font-light leading-relaxed tracking-[-0.01em] text-ink">
        {easy.intro}
      </p>

      <ol className="mt-8 space-y-7">
        {easy.points.map((point, index) => {
          const Art = point.art ? WORD_ART[point.art] : null;

          return (
            <li
              key={point.id}
              className="overflow-hidden rounded-card border border-stone bg-taupe/40"
            >
              {Art && (
                /*
                 * 그림 칸. 업적의 쉬운 설명과 같은 4:3 무대를 쓴다.
                 * 두 화면을 오갈 때 그림 크기가 달라지면 같은 세계로 읽히지 않는다.
                 */
                <div className="aspect-[4/3] w-full bg-canvas px-5 py-4">
                  <Art />
                </div>
              )}

              <div className="px-5 pb-5 pt-4">
                <p className="tabular font-mono text-[11px] tracking-[0.1em] text-ash">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(easy.points.length).padStart(2, "0")}
                </p>
                <h2 className="mt-1.5 text-[23px] font-light leading-snug tracking-[-0.02em] text-ink">
                  {point.title}
                </h2>
                <p className="mt-3 text-[17px] leading-[1.7] text-smoke">{point.say}</p>

                <details className="group mt-4">
                  <summary className="cursor-pointer list-none text-[13px] font-semibold text-navy hover:underline">
                    원문에서 이 대목
                    <span aria-hidden="true" className="ml-1 inline-block group-open:hidden">
                      ▾
                    </span>
                    <span aria-hidden="true" className="ml-1 hidden group-open:inline-block">
                      ▴
                    </span>
                  </summary>
                  <blockquote className="mt-2.5 border-l-2 border-stone pl-3 text-[14px] leading-relaxed text-ash">
                    {point.quote}
                  </blockquote>
                </details>
              </div>
            </li>
          );
        })}
      </ol>

      {statement.glossary.length > 0 && <Glossary statement={statement} />}

      <p className="mt-8 text-[12px] leading-relaxed text-ash">
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
    </article>
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
