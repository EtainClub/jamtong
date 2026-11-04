"use client";

import Link from "next/link";
import { useState } from "react";

import { DexMap } from "./DexMap";
import { PlantArt } from "./GardenArt";
import { MutationChips, NoteCard } from "./parts";
import { MUTATION, MUTATION_ORDER, TIER_LABEL } from "./rules";
import type { GardenData } from "./store";
import type { Species, Tier } from "./types";

/**
 * 도감 — 품종 × 변이, 그리고 모은 쪽지.
 *
 * 못 본 칸은 실루엣으로 둔다. 비어 있는 자리가 보여야 채우고 싶어진다.
 * 품종을 누르면 그 품종에서 모은 쪽지가 나온다 — 도감이 정보로 들어가는 문이다.
 */
const TIERS: Tier[] = ["sprout", "common", "flagship", "perennial"];

export function Dex({
  data,
  catalog,
  now,
  say,
}: {
  data: GardenData;
  catalog: Species[];
  now: number;
  say: (text: string) => void;
}) {
  const [view, setView] = useState<"list" | "map">("list");
  const [tier, setTier] = useState<Tier>("flagship");
  const [open, setOpen] = useState<string | null>(null);
  const grown = Object.keys(data.dex).length;
  const notes = new Set(data.notes);
  const list = catalog.filter((s) => s.tier === tier);

  return (
    <div className="garden-dex">
      <h2 className="text-[15px] font-bold">도감</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-2xl bg-[var(--g-panel)] py-3">
          <p className="text-[20px] font-bold tabular-nums">
            {grown}
            <span className="text-[13px] font-normal text-smoke">/{catalog.length}</span>
          </p>
          <p className="text-[11.5px] text-smoke">거둔 품종</p>
        </div>
        <div className="rounded-2xl bg-[var(--g-panel)] py-3">
          <p className="text-[20px] font-bold tabular-nums">{data.notes.length}</p>
          <p className="text-[11.5px] text-smoke">모은 쪽지</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3 text-[12px] leading-relaxed text-smoke">
        <p className="font-semibold text-ink">변이 (확률 공개)</p>
        <ul className="mt-1 space-y-0.5">
          {MUTATION_ORDER.map((m) => (
            <li key={m} className="flex items-center gap-2">
              <MutationChips mutations={[m]} size="xs" />
              <span>
                ×{MUTATION[m].multiplier} · {MUTATION[m].hint} · {MUTATION[m].odds}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex gap-1.5" role="group" aria-label="도감 보기">
        {(["list", "map"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => setView(v)}
            className={`flex-1 rounded-full py-1.5 text-[12.5px] font-semibold ${
              view === v ? "bg-[var(--g-leaf)] text-white" : "bg-[var(--g-panel)] text-graphite"
            }`}
          >
            {v === "list" ? "📖 목록" : "🗺 이어진 지도"}
          </button>
        ))}
      </div>

      {view === "map" ? (
        <div className="mt-3">
          <DexMap data={data} catalog={catalog} now={now} say={say} />
        </div>
      ) : (
      <>
      <div role="tablist" className="mt-4 flex gap-1.5">
        {TIERS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tier === t}
            type="button"
            onClick={() => setTier(t)}
            className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${
              tier === t ? "bg-ink text-eggshell" : "bg-[var(--g-panel)] text-graphite"
            }`}
          >
            {TIER_LABEL[t]}
          </button>
        ))}
      </div>

      <ul className="mt-3 space-y-2">
        {list.map((s) => {
          const seen = data.dex[s.id];
          const mine = s.notes.filter((n) => notes.has(n.id));
          return (
            <li key={s.id} className="rounded-2xl bg-[var(--g-panel)]">
              <button
                type="button"
                disabled={!seen}
                onClick={() => setOpen(open === s.id ? null : s.id)}
                className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
              >
                <span className={`garden-dex-art ${seen ? "" : "opacity-25 grayscale"}`}><PlantArt species={s} /></span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[13.5px] font-semibold ${seen ? "" : "text-ash"}`}>
                    {seen ? s.title : "???"}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-smoke">
                    {seen ? `쪽지 ${mine.length}/${s.notes.length}` : "아직 거두지 않았어요"}
                    {seen && <MutationChips mutations={seen} size="xs" />}
                  </span>
                </span>
              </button>
              {open === s.id && (
                <div className="space-y-2 px-3.5 pb-3.5">
                  {mine.map((n) => (
                    <NoteCard key={n.id} note={n} pageHref={s.href} />
                  ))}
                  {mine.length < s.notes.length && (
                    <p className="text-[12px] text-smoke">
                      쪽지 {s.notes.length - mine.length}장이 더 있어요. 다시 심어서 거두거나{" "}
                      <Link href={s.href} className="underline underline-offset-2">
                        원본 페이지
                      </Link>
                      에서 바로 읽을 수 있어요.
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      </>
      )}
    </div>
  );
}
