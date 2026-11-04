"use client";

import Link from "next/link";
import { useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "./feedback";
import { fruitIcon, mapCells, REGION_LABEL, REGION_ORDER, TIER_LABEL, TRAIL_PER_DAY, kstDay } from "./rules";
import { useGarden, type GardenData } from "./store";
import type { Species } from "./types";

/**
 * 도감 지도 — A안의 안개 지도를 도감의 옷으로 입힌 것 (docs/garden-game.md §4).
 *
 * ★ 거둔 품종은 밝고, 거기서 이어진 품종은 실루엣, 나머지는 안개다.
 *   이어짐은 콘텐츠에 적힌 연결뿐이다(catalog.ts의 withMap). 링크를 따라가야 새 칸이 열린다.
 *
 * ★ 실루엣을 열려면 원본을 읽는다.
 *   "원본 읽고 씨앗 받기"를 누르면 그 품종의 씨앗을 한 번 주고 원본 페이지로 간다.
 *   게임이 끝나는 곳이 정보다. 하루 몫이 있어, 씨앗을 모으려고 원본을 훑는 놀이가 되지 않게 한다.
 */
const TRAILS_SHOWN = 4;

export function DexMap({
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
  const seen = new Set(Object.keys(data.dex));
  const cells = mapCells(catalog, seen);
  const byId = new Map(catalog.map((s) => [s.id, s]));
  const today = kstDay(now);
  const used = data.trails.day === today ? data.trails.count : 0;
  const [expanded, setExpanded] = useState<string | null>(null);

  /** 이 실루엣은 어느 밝은 칸에서 이어졌나. 처음 만난 하나만 적는다. */
  const fromOf = (id: string) => catalog.find((s) => seen.has(s.id) && s.links.includes(id));

  const regions = REGION_ORDER.map((region) => {
    const list = catalog.filter((s) => s.region === region);
    return {
      region,
      list,
      lit: list.filter((s) => cells.get(s.id) === "seen").length,
      trails: list.filter((s) => cells.get(s.id) === "trail"),
    };
  }).filter((r) => r.list.length > 0);

  const open = (s: Species) => {
    const result = useGarden.getState().trail(s);
    track("dex_trail", { tier: s.tier, given: result === "given" });
    if (result === "given") {
      gardenFeedback("reward");
      say(`🌱 「${s.title}」 씨앗을 받았어요`);
    }
  };

  return (
    <div>
      <p className="rounded-2xl bg-[var(--g-panel)] px-3.5 py-3 text-[12px] leading-relaxed text-smoke">
        거둔 품종에서 <strong className="text-ink">이어진 품종</strong>이 실루엣으로 보여요. 원본을 읽으면 그 씨앗을
        받아요 (품종마다 한 번, 하루 {TRAIL_PER_DAY}번 · 오늘 {used}/{TRAIL_PER_DAY}). 이어짐은 언행의 관련 업적,
        같은 분야의 업적·정책이에요.
      </p>

      <ul className="mt-3 space-y-3">
        {regions.map(({ region, list, lit, trails }) => {
          const shown = expanded === region ? trails : trails.slice(0, TRAILS_SHOWN);
          return (
            <li key={region} className="rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[13.5px] font-bold">{REGION_LABEL[region] ?? region}</h3>
                <p className="text-[11.5px] tabular-nums text-smoke">
                  밝힌 칸 {lit}/{list.length}
                  {trails.length > 0 ? ` · 이어진 칸 ${trails.length}` : ""}
                </p>
              </div>

              <div className="mt-2 flex flex-wrap gap-1" aria-hidden="true">
                {list.map((s) => {
                  const cell = cells.get(s.id);
                  return (
                    <span
                      key={s.id}
                      title={cell === "fog" ? undefined : s.title}
                      className={`grid h-7 w-7 place-items-center rounded-lg text-[15px] ${
                        cell === "seen"
                          ? "bg-white/80"
                          : cell === "trail"
                            ? "bg-white/40 opacity-60 grayscale ring-1 ring-dashed ring-[var(--g-leaf)]"
                            : "bg-black/10"
                      }`}
                    >
                      {cell === "fog" ? "" : fruitIcon(s)}
                    </span>
                  );
                })}
              </div>

              {trails.length > 0 && (
                <ul className="mt-2.5 space-y-1.5">
                  {shown.map((s) => {
                    const from = fromOf(s.id);
                    const taken = data.trails.taken.includes(s.id);
                    return (
                      <li key={s.id} className="flex items-center gap-2 rounded-xl bg-white/50 px-2.5 py-2">
                        <span className="text-[18px] grayscale">{fruitIcon(s)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12.5px] font-semibold">{s.title}</span>
                          <span className="block truncate text-[11px] text-smoke">
                            {TIER_LABEL[s.tier]}
                            {from ? ` · 「${byId.get(from.id)?.title}」에서 이어짐` : ""}
                          </span>
                        </span>
                        <Link
                          href={s.href}
                          onClick={() => open(s)}
                          className="shrink-0 rounded-full bg-[var(--g-leaf)] px-2.5 py-1 text-[11.5px] font-semibold text-white"
                        >
                          {taken ? "원본 읽기" : used >= TRAIL_PER_DAY ? "원본 읽기 (오늘 씨앗 끝)" : "원본 읽고 씨앗 받기"}
                        </Link>
                      </li>
                    );
                  })}
                  {trails.length > TRAILS_SHOWN && (
                    <li>
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === region ? null : region)}
                        className="text-[11.5px] font-semibold text-graphite underline underline-offset-2"
                      >
                        {expanded === region ? "접기" : `이어진 칸 ${trails.length - TRAILS_SHOWN}개 더 보기`}
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
