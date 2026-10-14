"use client";

import { useState } from "react";

import type {
  Claim,
  ReactionCompany,
  ReactionCountry,
  Reactions,
  ReactionStance,
} from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { useReveal } from "@/features/motion/useReveal";

/**
 * 기업 반응 — 세 칸 위의 기업들.
 *
 * ★ 칸은 왼쪽에서 오른쪽으로 다가선다.
 *   거리를 둔다 → 지켜본다 → 뛰어든다. 축 막대가 이 방향을 먼저 그리고,
 *   기업 칩이 제 칸으로 떠오른다.
 *
 * ★ 나라를 고르면 다른 나라는 흐려진다. 지우지 않는다.
 *   지우면 칸의 무게가 달라져 보인다. 한국만 보던 사람도 그 옆에 중국 선사가
 *   몇 곳 서 있는지는 알아야 한다.
 *
 * ★ 옮겨 간 기업은 예전 칸에 흐린 자국을 남긴다.
 *   자국에서 지금 칸으로 가는 방향이 이 기업의 이야기다.
 */

const ORDER: ReactionStance[] = ["out", "watch", "in"];

const COUNTRY: Record<ReactionCountry, string> = {
  KR: "한국",
  JP: "일본",
  CN: "중국",
  US: "미국",
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export function ReactionBoard({ reactions, claims }: { reactions: Reactions; claims: Claim[] }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [country, setCountry] = useState<ReactionCountry | "all">("all");
  const [selectedId, setSelectedId] = useState(reactions.companies[0].id);

  const selected = reactions.companies.find((c) => c.id === selectedId) ?? reactions.companies[0];
  const countries = (Object.keys(COUNTRY) as ReactionCountry[]).filter((k) =>
    reactions.companies.some((c) => c.country === k),
  );
  const dim = (c: ReactionCompany) => country !== "all" && c.country !== country;
  const count = (claimId: string) => claims.find((c) => c.id === claimId)?.sourceIds.length ?? 0;

  /* 칩이 떠오르는 순서. 칸 순서대로, 칸 안에서는 데이터 순서대로. */
  const order = new Map(
    ORDER.flatMap((stance) => reactions.companies.filter((c) => c.stance === stance)).map((c, i) => [
      c.id,
      i,
    ]),
  );

  return (
    <div ref={ref}>
      <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
        <span className="rounded-full bg-ink px-2 py-0.5 text-eggshell">시장의 반응 · 업적 아님</span>
        <span className="text-ash">{formatDate(reactions.asOf)} 기준</span>
      </p>

      {/* 나라 고르기 */}
      <div role="radiogroup" aria-label="나라" className="no-scrollbar mt-5 flex gap-1.5 overflow-x-auto pb-1">
        {(["all", ...countries] as const).map((k) => {
          const active = k === country;
          const n =
            k === "all"
              ? reactions.companies.length
              : reactions.companies.filter((c) => c.country === k).length;
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setCountry(k)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                active
                  ? "border-ink bg-ink text-eggshell"
                  : "border-stone text-smoke hover:border-graphite hover:text-ink"
              }`}
            >
              {k === "all" ? "전체" : COUNTRY[k]}
              <span className="tabular ml-1 opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      {/* 축 */}
      <div className="mt-6" aria-hidden="true">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-taupe">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,var(--burgundy),var(--ash)_50%,var(--navy))]"
            style={{
              width: shown ? "100%" : "0%",
              transition: "width 900ms var(--ease-out-expo)",
            }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] font-semibold text-ash">
          <span>← 멀어진다</span>
          <span>다가선다 →</span>
        </div>
      </div>

      {/* 세 칸 */}
      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        {ORDER.map((stance) => {
          const here = reactions.companies.filter((c) => c.stance === stance);
          const ghosts = reactions.companies.filter((c) => c.was === stance);
          return (
            <section
              key={stance}
              aria-label={reactions.axis[stance]}
              className="min-w-0 rounded-card border border-stone bg-taupe/40 p-1.5 sm:p-2.5"
            >
              <h3
                className={`px-1 pb-2 text-[12px] font-bold sm:text-[13px] ${
                  stance === "in" ? "text-navy" : stance === "out" ? "text-burgundy" : "text-smoke"
                }`}
              >
                {reactions.axis[stance]}
                <span className="tabular ml-1 font-semibold text-ash">{here.length}</span>
              </h3>

              <ul className="space-y-1.5">
                {here.map((company) => {
                  const active = company.id === selected.id;
                  const i = order.get(company.id) ?? 0;
                  return (
                    <li
                      key={company.id}
                      style={{
                        animation: shown
                          ? `outlook-rise 520ms var(--ease-out-expo) ${300 + i * 80}ms both`
                          : undefined,
                        opacity: shown ? undefined : 0,
                      }}
                    >
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedId(company.id)}
                        className={`block w-full rounded-sm border px-2 py-1.5 text-left transition-[opacity,border-color,background-color] duration-300 ${
                          active ? "border-ink bg-eggshell" : "border-stone bg-eggshell hover:border-graphite"
                        } ${dim(company) ? "opacity-30" : "opacity-100"}`}
                      >
                        <span className="flex items-center gap-1">
                          <span className="shrink-0 rounded-sm bg-taupe px-1 text-[9px] font-bold text-smoke">
                            {COUNTRY[company.country]}
                          </span>
                          <span className="truncate text-[9.5px] text-ash">{company.sector}</span>
                        </span>
                        <span className="mt-0.5 block text-[12px] font-bold leading-snug text-ink sm:text-[13px]">
                          {company.name}
                        </span>
                        <span className="mt-0.5 hidden text-[11px] leading-snug text-smoke sm:block">
                          {company.action}
                        </span>
                      </button>
                    </li>
                  );
                })}

                {/* 예전 자리 */}
                {ghosts.map((company) => (
                  <li
                    key={`was-${company.id}`}
                    style={{
                      animation: shown ? "outlook-rise 520ms var(--ease-out-expo) 1100ms both" : undefined,
                      opacity: shown ? undefined : 0,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(company.id)}
                      className={`block w-full rounded-sm border border-dashed border-ash px-2 py-1.5 text-left transition-opacity duration-300 ${
                        dim(company) ? "opacity-20" : "opacity-60"
                      }`}
                    >
                      <span className="block truncate text-[11px] font-semibold text-smoke line-through decoration-ash">
                        {company.name}
                      </span>
                      <span className="block text-[10px] text-ash">
                        예전 자리 → {reactions.axis[company.stance]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* 고른 기업 */}
      <div
        key={selected.id}
        aria-live="polite"
        className="mt-5 rounded-card border border-stone bg-eggshell px-4 py-4"
        style={{ animation: "outlook-rise 360ms var(--ease-out-expo) both" }}
      >
        <p className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-ash">
          <span className="rounded-sm bg-taupe px-1.5 py-0.5 font-bold text-smoke">
            {COUNTRY[selected.country]}
          </span>
          <span>{selected.sector}</span>
          <span aria-hidden="true">·</span>
          {selected.was && (
            <>
              <span className="line-through">{reactions.axis[selected.was]}</span>
              <span aria-hidden="true">→</span>
            </>
          )}
          <span
            className={
              selected.stance === "in"
                ? "text-navy"
                : selected.stance === "out"
                  ? "text-burgundy"
                  : "text-smoke"
            }
          >
            {reactions.axis[selected.stance]}
          </span>
        </p>
        <h3 className="mt-1.5 text-[17px] font-bold text-ink">{selected.name}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-graphite">{selected.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.claimIds.map((id) => (
            <EvidenceButton key={id} claimId={id} count={count(id)} />
          ))}
        </div>
      </div>

      <p className="mt-5 border-l-2 border-ash pl-4 text-[12.5px] leading-relaxed text-ash">
        {reactions.note}
      </p>
    </div>
  );
}
