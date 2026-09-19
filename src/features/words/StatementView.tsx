"use client";

import { useState } from "react";

import type { Statement } from "@/content/words/schema";

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
 * 토막마다 원문의 어느 대목을 옮긴 것인지 접어 둔다. 펼치면 바로 대볼 수
 * 있다 — 요약을 믿으라고 하지 않고, 확인할 수 있게 둔다.
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
      <p className="text-[15px] leading-relaxed text-smoke">{easy.intro}</p>

      <ol className="mt-6 space-y-4">
        {easy.points.map((point, index) => (
          <li
            key={point.id}
            className="rounded-card border border-stone bg-taupe/40 px-5 py-4"
          >
            <div className="flex items-baseline gap-2.5">
              <span className="text-[12px] font-bold tabular-nums text-ash">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="text-[16px] font-bold text-ink">{point.title}</h2>
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-smoke">{point.say}</p>

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
              <blockquote className="mt-2 border-l-2 border-stone pl-3 text-[13px] leading-relaxed text-ash">
                {point.quote}
              </blockquote>
            </details>
          </li>
        ))}
      </ol>

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
