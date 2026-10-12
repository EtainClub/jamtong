import type { Metadata } from "next";
import Link from "next/link";

import {
  COMMON_FUNDING,
  COMMON_SCHEDULE,
  PLEDGE_SOURCE,
  PLEDGES,
  pledgesAsOf,
  totalCount,
  unitsOf,
  type ResolvedLine,
  type ResolvedPledge,
} from "@/content/pledges";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import {
  PledgeBar,
  PledgeLegend,
  STATUS_CHIP,
  STATUS_LABEL,
} from "@/features/pledges/PledgeProgress";

export const metadata: Metadata = {
  title: "21대 대선 공약",
  description:
    "제21대 대통령선거 이재명 후보 10대 공약을 원문 그대로 옮기고, 항목마다 시행·추진 중·확인 전을 근거와 함께 표시합니다.",
  alternates: { canonical: "/pledges" },
};

/**
 * 21대 대선 공약과 이행 상태.
 *
 * 공약 문장은 원문이고, 이행 상태는 이 사이트의 업적·정책 claim에 기댈 때만
 * 단다. 그래서 "확인 전"이 많다. 그것을 줄이려고 근거 없이 칸을 칠하지 않는다.
 *
 * 펼치고 접는 데 스크립트를 쓰지 않는다(<details>). 열 개 공약이 모두
 * 서버에서 그려지고, 검색엔진과 스크린리더가 접힌 내용까지 읽는다.
 */

function koreanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y) return iso;
  return d ? `${y}년 ${m}월 ${d}일` : m ? `${y}년 ${m}월` : `${y}년`;
}

export default function PledgesPage() {
  const total = totalCount();
  const asOf = pledgesAsOf();
  const tracked = PLEDGES.flatMap((pledge) =>
    pledge.items.flatMap(unitsOf).flatMap((line) => (line.evidence ? [{ pledge, line }] : [])),
  ).sort((a, b) => Number(a.line.status !== "done") - Number(b.line.status !== "done"));

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <p className="text-[12px] font-bold text-navy">제21대 대통령선거 · 기호 1 이재명</p>
        <h1 className="mt-1 text-2xl font-light tracking-[-0.02em] text-ink">21대 대선 공약</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          선거공약서의 10대 공약을 문장 그대로 옮겼습니다. 공약 하나에 담긴 세부 약속{" "}
          <span className="tabular">{total.total}</span>개마다 지금 어디까지 왔는지를
          표시합니다. 상태는 이 사이트에 실린 근거가 있을 때만 붙입니다.
        </p>
        <a
          href={PLEDGE_SOURCE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[12px] font-medium text-navy underline underline-offset-2"
        >
          선거공약서 원문(PDF) <span aria-hidden="true">↗</span>
        </a>

        {/* 전체 현황. 숫자보다 막대가 먼저 읽히고, 막대 아래에 무엇을 셌는지 적는다. */}
        <section
          aria-labelledby="pledge-overview"
          className="mt-6 rounded-card border border-stone bg-taupe px-4 py-4"
        >
          <h2 id="pledge-overview" className="text-[15px] font-bold text-ink">
            이행 현황
          </h2>
          <p className="mt-1 text-[12px] text-ash">
            세부 약속 <span className="tabular">{total.total}</span>개 기준
            {asOf && <> · 근거 기준일 {koreanDate(asOf)}</>}
          </p>
          <div className="mt-3">
            <PledgeBar count={total} />
          </div>
          <div className="mt-2.5">
            <PledgeLegend count={total} />
          </div>
          <dl className="mt-4 space-y-1.5 border-t border-stone pt-3 text-[12px] leading-relaxed text-smoke">
            <div>
              <dt className="inline font-semibold text-navy">시행</dt>
              <dd className="inline"> — 법이 시행됐거나 제도가 실제로 시작됐습니다.</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-pending">추진 중</dt>
              <dd className="inline">
                {" "}
                — 발표·법 통과·협약까지 왔지만 아직 효력이 없거나, 약속의 일부만 이뤄졌습니다.
              </dd>
            </div>
            <div>
              <dt className="inline font-semibold text-ash">확인 전</dt>
              <dd className="inline">
                {" "}
                — 안 했다는 뜻이 아닙니다. 이 사이트가 아직 근거를 잇지 못했습니다.
              </dd>
            </div>
          </dl>
        </section>

        {/* 근거가 있는 것만 먼저 모아 본다. 열 개를 다 펼쳐야 찾을 수 있으면 안 된다. */}
        {tracked.length > 0 && (
          <section aria-labelledby="pledge-tracked" className="mt-9">
            <h2 id="pledge-tracked" className="text-[17px] font-bold tracking-tight text-ink">
              근거로 확인한 진행 <span className="tabular">{tracked.length}</span>건
            </h2>
            <ul className="mt-3 space-y-2.5">
              {tracked.map(({ pledge, line }) => (
                <li key={`${pledge.rank}-${line.text}`}>
                  <TrackedLine line={line} kicker={`공약 ${pledge.rank} · ${pledge.field}`} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="pledge-list" className="mt-9">
          <h2 id="pledge-list" className="text-[17px] font-bold tracking-tight text-ink">
            10대 공약
          </h2>
          <p className="mt-1 text-[12px] leading-relaxed text-ash">
            눌러서 펼치면 목표와 이행방법이 원문 순서대로 나옵니다.
          </p>
          <ol className="mt-4 space-y-3">
            {PLEDGES.map((pledge) => (
              <li key={pledge.rank}>
                <PledgeCard pledge={pledge} />
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="pledge-common" className="mt-9 border-t border-stone pt-5">
          <h2 id="pledge-common" className="text-[14px] font-bold text-ink">
            이행기간과 재원 (10대 공약 공통)
          </h2>
          <h3 className="mt-3 text-[12px] font-semibold text-smoke">이행기간</h3>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[12px] leading-relaxed text-smoke">
            {COMMON_SCHEDULE.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h3 className="mt-3 text-[12px] font-semibold text-smoke">재원조달방안</h3>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[12px] leading-relaxed text-smoke">
            {COMMON_FUNDING.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-ash">
            출처: {PLEDGE_SOURCE.publisher} 『{PLEDGE_SOURCE.title}』. 공약 문장은 원문 그대로이며,
            줄바꿈으로 끊긴 낱말만 붙였습니다.
          </p>
        </section>
      </main>

      <BottomNav />
    </>
  );
}

function StatusChip({ line }: { line: ResolvedLine }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_CHIP[line.status]}`}
    >
      {STATUS_LABEL[line.status]}
    </span>
  );
}

/** 근거가 붙은 약속 한 줄. 무엇이 됐는지 한 줄, 그 근거 원문, 출처. */
function TrackedLine({ line, kicker }: { line: ResolvedLine; kicker?: string }) {
  const evidence = line.evidence;
  return (
    <div className="rounded-card border border-stone bg-taupe px-4 py-3">
      <div className="flex items-center gap-2">
        <StatusChip line={line} />
        {kicker && <span className="text-[10px] font-bold text-navy">{kicker}</span>}
      </div>
      <p className="mt-1.5 text-[13px] font-semibold leading-snug text-ink">{line.text}</p>
      {line.note && <p className="mt-1 text-[12px] leading-relaxed text-smoke">{line.note}</p>}
      {evidence && (
        <details className="group mt-2">
          <summary className="cursor-pointer list-none text-[11px] font-medium text-navy">
            근거 보기 <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90">›</span>
          </summary>
          <blockquote className="mt-2 border-l-2 border-stone pl-3 text-[12px] leading-relaxed text-smoke">
            {evidence.claim.text}
            {evidence.claim.assertionType === "CLAIM" && evidence.claim.assertedBy && (
              <span className="text-ash"> — {evidence.claim.assertedBy}의 주장</span>
            )}
            {!evidence.claim.verified && (
              <span className="ml-1 rounded bg-pending-tint px-1 text-[10px] font-semibold text-pending">
                미검증
              </span>
            )}
          </blockquote>
          <ul className="mt-2 space-y-0.5 text-[11px] leading-relaxed text-ash">
            {evidence.sources.map((source) => (
              <li key={source.id}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-smoke"
                  >
                    {source.publisher} 『{source.title}』
                  </a>
                ) : (
                  <>
                    {source.publisher} 『{source.title}』
                  </>
                )}
                {source.publishedAt && <span className="tabular"> · {source.publishedAt}</span>}
              </li>
            ))}
          </ul>
          <Link
            href={evidence.href}
            className="mt-2 inline-block text-[11px] font-semibold text-navy"
          >
            {evidence.label}에서 자세히 <span aria-hidden="true">→</span>
          </Link>
        </details>
      )}
    </div>
  );
}

function PledgeCard({ pledge }: { pledge: ResolvedPledge }) {
  const { count } = pledge;
  return (
    <details className="group rounded-card border border-stone bg-taupe open:border-graphite">
      <summary className="cursor-pointer list-none px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
            {pledge.rank}
          </span>
          <span className="text-[10px] font-bold text-navy">{pledge.field}</span>
          <span
            aria-hidden="true"
            className="ml-auto text-[13px] text-ash transition-transform group-open:rotate-90"
          >
            ›
          </span>
        </div>
        <h3 className="mt-2 text-[15px] font-bold leading-snug text-ink">{pledge.title}</h3>
        <div className="mt-3">
          <PledgeBar count={count} size="sm" />
        </div>
        <p className="mt-1.5 text-[11px] text-ash">
          세부 약속 <span className="tabular">{count.total}</span>개 · 시행{" "}
          <span className="tabular">{count.done}</span> · 추진 중{" "}
          <span className="tabular">{count.underway}</span> · 확인 전{" "}
          <span className="tabular">{count.untracked}</span>
        </p>
      </summary>

      <div className="border-t border-stone px-4 pb-4 pt-3">
        <h4 className="text-[12px] font-bold text-smoke">목표</h4>
        <ul className="mt-1 space-y-0.5 text-[13px] leading-relaxed text-ink">
          {pledge.goals.map((goal) => (
            <li key={goal}>· {goal}</li>
          ))}
        </ul>

        <h4 className="mt-4 text-[12px] font-bold text-smoke">이행방법</h4>
        <ol className="mt-2 space-y-3">
          {pledge.items.map((item) => (
            <li key={item.text}>
              {item.self ? (
                <PledgeLineRow line={item.self} strong />
              ) : (
                <>
                  <p className="text-[13px] font-semibold leading-snug text-ink">{item.text}</p>
                  <ul className="mt-1.5 space-y-1.5 border-l border-stone pl-3">
                    {item.subs.map((sub) => (
                      <li key={sub.text}>
                        <PledgeLineRow line={sub} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ol>

        {(pledge.extraSchedule.length > 0 || pledge.extraFunding.length > 0) && (
          <div className="mt-4 rounded-sm bg-canvas px-3 py-2 text-[11px] leading-relaxed text-smoke">
            {pledge.extraSchedule.map((line) => (
              <p key={line}>이행기간 — {line}</p>
            ))}
            {pledge.extraFunding.map((line) => (
              <p key={line}>재원 — {line}</p>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

/** 셈의 단위인 약속 한 줄. 근거가 있으면 그 자리에서 카드로 펼친다. */
function PledgeLineRow({ line, strong = false }: { line: ResolvedLine; strong?: boolean }) {
  if (line.evidence) return <TrackedLine line={line} />;
  return (
    <div className="flex items-start gap-2">
      <StatusChip line={line} />
      <p
        className={`text-[13px] leading-snug ${strong ? "font-semibold text-ink" : "text-smoke"}`}
      >
        {line.text}
      </p>
    </div>
  );
}
