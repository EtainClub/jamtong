"use client";

import Link from "next/link";
import { useState } from "react";

import { track } from "@/lib/analytics";

import { MutationChips, NoteCard } from "./parts";
import { CARE, caresFor, fruitIcon, fruitValue, formatLeft, growMinutes, kstDay, MINUTE, SHINE_PER_DAY, TIER_LABEL } from "./rules";
import { useGarden, type GardenData } from "./store";
import type { PlazaLevel, Species } from "./types";
import type { CareOutcome } from "./useBlooms";

/**
 * 텃밭과 바구니.
 *
 * 심기 → 기다리기 → 수확 → 바구니 → 잼. 바구니를 두는 이유는 쪽지다 —
 * 거두자마자 잼이 되면 쪽지를 볼 틈이 없고, 근거를 열어 원본 광택을 붙일
 * 자리도 없다. 안 읽고 바로 잼으로 졸여도 손해는 없다.
 */
export function Beds({
  data,
  catalog,
  byId,
  now,
  plaza,
  bonus,
  care,
  say,
}: {
  data: GardenData;
  catalog: Species[];
  byId: Map<string, Species>;
  now: number;
  plaza: PlazaLevel;
  /** 꽃밭 보너스. 만개한 업적 수에서 나온다. */
  bonus: number;
  care: (speciesId: string, delta: number) => Promise<CareOutcome>;
  say: (text: string) => void;
}) {
  const { plant, harvest, dig, sell, shine } = useGarden.getState();
  const [picking, setPicking] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const ripe = data.beds
    .map((p, i) => (p && p.ripeAt <= now ? i : -1))
    .filter((i) => i >= 0);

  const onHarvest = (i: number) => {
    const p = data.beds[i];
    const species = p && byId.get(p.speciesId);
    if (!species) return;
    const fruit = harvest(i, species, plaza);
    if (fruit) {
      track("garden_harvest", { tier: species.tier, mutations: fruit.mutations.length });
      if (fruit.mutations.length) say(`${fruitIcon(species)} 변이! ${fruit.mutations.length}개`);
      if (caresFor(species)) void tend(species, CARE.harvest);
    }
  };

  /** 업적을 가꾼다. 만개나 정원지기 소식이 있으면 그것을, 없으면 조용히 센다. */
  const tend = async (species: Species, delta: number) => {
    const out = await care(species.id, delta);
    if (out.failed) say(`꽃밭에 닿지 못해 「${species.title}」 가꿈이 기록되지 않았어요`);
    else if (out.bloomedNow) say(`🌸 「${species.title}」 만개!`);
    else if (out.becameOwner) say(`👑 「${species.title}」의 정원지기가 되었어요`);
    else if (out.given) say(`🌷 「${species.title}」 가꿈 +${out.given}`);
  };

  const seeds = Object.entries(data.seeds)
    .map(([id, n]) => ({ species: byId.get(id), n }))
    .filter((s): s is { species: Species; n: number } => Boolean(s.species));

  const shineUsed = data.shine.day === kstDay(now) ? data.shine.count : 0;
  const total = data.basket.reduce((sum, f) => {
    const s = byId.get(f.speciesId);
    return sum + (s ? fruitValue(f, s, bonus) : 0);
  }, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold">내 텃밭</h2>
        {ripe.length > 1 && (
          <button
            type="button"
            onClick={() => ripe.forEach(onHarvest)}
            className="rounded-full bg-[var(--g-leaf)] px-3.5 py-1.5 text-[13px] font-semibold text-white"
          >
            모두 수확 ({ripe.length})
          </button>
        )}
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-2.5">
        {data.beds.map((p, i) => {
          const species = p ? byId.get(p.speciesId) : undefined;
          if (!p || !species) {
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setPicking(i)}
                  className="garden-soil grid aspect-square w-full place-items-center rounded-2xl text-[13px] font-medium text-[var(--g-soil-ink)]"
                >
                  <span>
                    <span className="block text-2xl leading-none">＋</span>
                    심기
                  </span>
                </button>
              </li>
            );
          }
          const left = p.ripeAt - now;
          const span = p.ripeAt - p.plantedAt;
          const progress = Math.min(1, Math.max(0, 1 - left / span));
          const isRipe = left <= 0;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => (isRipe ? onHarvest(i) : setSelected(selected === i ? null : i))}
                aria-label={`${species.title} ${isRipe ? "수확하기" : `${formatLeft(left)} 남음`}`}
                className={`garden-soil relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl ${
                  selected === i ? "ring-2 ring-[var(--g-leaf)]" : ""
                }`}
              >
                <span
                  className={isRipe ? "garden-bob text-[34px]" : "text-[26px]"}
                  style={isRipe ? undefined : { transform: `scale(${0.55 + progress * 0.45})` }}
                >
                  {isRipe ? fruitIcon(species) : progress < 0.5 ? "🌱" : "🌿"}
                </span>
                <span className="absolute inset-x-1.5 bottom-1.5 truncate rounded-md bg-black/35 px-1 text-[10.5px] font-semibold text-white">
                  {isRipe ? "수확!" : formatLeft(left)}
                </span>
                {!isRipe && (
                  <span
                    className="absolute left-0 top-0 h-1 bg-[var(--g-leaf)]"
                    style={{ width: `${progress * 100}%` }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {selected !== null && data.beds[selected] && (
        <BedDetail
          species={byId.get(data.beds[selected]!.speciesId)}
          harvests={data.beds[selected]!.harvests}
          onDig={() => {
            if (window.confirm("갈아엎을까요? 심은 씨앗은 돌아오지 않습니다.")) {
              dig(selected);
              setSelected(null);
            }
          }}
        />
      )}

      {picking !== null && (
        <SeedSheet
          seeds={seeds}
          onClose={() => setPicking(null)}
          onPick={(species) => {
            plant(picking, species, plaza);
            setPicking(null);
          }}
          empty={catalog.length === 0}
        />
      )}

      <section aria-labelledby="basket" className="mt-7">
        <div className="flex items-center justify-between">
          <h2 id="basket" className="text-[15px] font-bold">
            바구니 <span className="font-normal text-smoke">{data.basket.length}</span>
          </h2>
          {data.basket.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const jam = sell(
                  data.basket.map((f) => f.id),
                  byId,
                  bonus,
                );
                say(`🍯 잼 +${jam}`);
              }}
              className="rounded-full bg-[var(--g-jam)] px-3.5 py-1.5 text-[13px] font-semibold text-white"
            >
              모두 잼으로 · {total}
            </button>
          )}
        </div>
        <p className="mt-1 text-[12px] text-smoke">
          열매마다 쪽지가 들어 있어요. 근거를 열면 원본 광택이 붙습니다 (오늘 {SHINE_PER_DAY - shineUsed}번 남음).
        </p>

        {data.basket.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-stone px-4 py-6 text-center text-[13px] text-smoke">
            아직 거둔 열매가 없어요.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {data.basket.map((f) => {
              const species = byId.get(f.speciesId);
              if (!species) return null;
              const note = species.notes.find((n) => n.id === f.noteId);
              const shined = f.mutations.includes("shine");
              return (
                <li key={f.id} className="rounded-2xl bg-[var(--g-panel)] p-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[28px] leading-none">{fruitIcon(species)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold">{species.title}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-smoke">{TIER_LABEL[species.tier]}</span>
                        <MutationChips mutations={f.mutations} size="xs" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => say(`🍯 잼 +${sell([f.id], byId, bonus)}`)}
                      className="shrink-0 rounded-full bg-[var(--g-jam)] px-3 py-1.5 text-[12.5px] font-semibold text-white"
                    >
                      잼 {fruitValue(f, species, bonus)}
                    </button>
                  </div>
                  {note && (
                    <div className="mt-2.5">
                      <NoteCard
                        note={note}
                        pageHref={species.href}
                        shined={shined}
                        shineLeft={SHINE_PER_DAY - shineUsed}
                        onSource={() => {
                          track("evidence_open", { source: "garden", note_id: note.id });
                          if (!shine(f.id)) return;
                          say("✨ 원본 광택이 붙었어요");
                          if (caresFor(species)) void tend(species, CARE.shine);
                        }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function BedDetail({
  species,
  harvests,
  onDig,
}: {
  species: Species | undefined;
  harvests: number;
  onDig: () => void;
}) {
  if (!species) return null;
  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3 text-[13px]">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{species.title}</p>
        <p className="text-[12px] text-smoke">
          {TIER_LABEL[species.tier]}
          {species.tier === "perennial" ? ` · ${harvests}번 수확함 · 다시 열립니다` : ""}
        </p>
      </div>
      <Link href={species.href} className="shrink-0 text-[12px] text-graphite underline underline-offset-2">
        원본
      </Link>
      <button type="button" onClick={onDig} className="shrink-0 text-[12px] text-smoke">
        갈아엎기
      </button>
    </div>
  );
}

function SeedSheet({
  seeds,
  onPick,
  onClose,
  empty,
}: {
  seeds: Array<{ species: Species; n: number }>;
  onPick: (species: Species) => void;
  onClose: () => void;
  empty: boolean;
}) {
  return (
    <div role="dialog" aria-label="심을 씨앗 고르기" className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="mx-auto max-h-[70vh] w-full max-w-[560px] overflow-y-auto rounded-t-3xl bg-[var(--g-bg)] p-4 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold">씨앗 주머니</h3>
          <button type="button" onClick={onClose} className="text-[13px] text-smoke">
            닫기
          </button>
        </div>
        {seeds.length === 0 || empty ? (
          <p className="mt-4 text-[13px] text-smoke">씨앗이 없어요. 상점에서 사거나 광장 잡초에서 찾아보세요.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {seeds.map(({ species, n }) => (
              <li key={species.id}>
                <button
                  type="button"
                  onClick={() => onPick(species)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3 text-left"
                >
                  <span className="text-2xl">{fruitIcon(species)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold">{species.title}</span>
                    <span className="text-[11.5px] text-smoke">
                      {TIER_LABEL[species.tier]} · 약 {formatLeft(growMinutes(species) * MINUTE)}
                    </span>
                  </span>
                  <span className="text-[13px] font-semibold text-smoke">×{n}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
