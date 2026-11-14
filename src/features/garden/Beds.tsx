"use client";

import Link from "next/link";
import { useState } from "react";

import { track } from "@/lib/analytics";

import { GroundDetails, PlantArt } from "./GardenArt";
import { gardenFeedback } from "./feedback";
import { BASKET_WARN_AT } from "./nav";
import { MutationChips, NoteCard } from "./parts";
import { Sheet } from "./Sheet";
import { googleCalendarLink } from "./alarm";
import { ALARM_MIN_LEAD, alarmTime, nextRain, CARE, caresFor, formatClock, fruitIcon, fruitValue, formatLeft, growMinutes, HOUR, kstDay, MINUTE, SHINE_PER_DAY, TIER_LABEL, fertilizerCut, TOOL_ORDER, TOOLS, type ToolId } from "./rules";
import { BASKET_MAX, useGarden, type GardenData } from "./store";
import type { Plant, PlazaLevel, Species } from "./types";
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
  const { plant, harvest, dig, sell, shine, feed, showFruit } = useGarden.getState();
  const [picking, setPicking] = useState<number | null>(null);
  const [harvested, setHarvested] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const ripe = data.beds
    .map((p, i) => (p && p.ripeAt <= now ? i : -1))
    .filter((i) => i >= 0);

  const onHarvest = (i: number) => {
    const p = data.beds[i];
    const species = p && byId.get(p.speciesId);
    if (!species) return;
    // 바구니가 가득 찬 채로 거두면 가장 오래된 열매가 빠진다. 조용히 사라지지 않게 알린다.
    const full = (useGarden.getState().data?.basket.length ?? 0) >= BASKET_MAX;
    const fruit = harvest(i, species, plaza);
    if (fruit && full) say(`🧺 바구니가 가득 차서 가장 오래된 열매 하나가 빠졌어요`);
    if (fruit) {
      gardenFeedback("harvest");
      setHarvested((old) => ({ ...old, [i]: Date.now() }));
      if (!fruit.mutations.length) say(`${fruitIcon(species)} 수확! 바구니에 담았어요`);
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

      <div className="garden-field mt-3">
        <GroundDetails />
        <div className="garden-field-sign" aria-hidden="true">MY GARDEN <span>심고 · 키우고 · 수확해요</span></div>
        <ul className="garden-plots grid grid-cols-3 gap-3">
        {data.beds.map((p, i) => {
          const species = p ? byId.get(p.speciesId) : undefined;
          if (!p || !species) {
            return (
              <li key={i} className="relative">
                <button
                  type="button"
                  onClick={() => { gardenFeedback("tap"); setPicking(i); }}
                  className="garden-soil grid aspect-square w-full place-items-center rounded-2xl text-[13px] font-medium text-[var(--g-soil-ink)]"
                >
                  <span className="garden-empty-plot">
                    <span className="block text-2xl leading-none">＋</span>
                    씨앗 심기
                  </span>
                </button>
                {harvested[i] && <span key={harvested[i]} className="garden-harvest-float" aria-hidden="true">✦ 수확!</span>}
              </li>
            );
          }
          const left = p.ripeAt - now;
          const span = p.ripeAt - p.plantedAt;
          const progress = Math.min(1, Math.max(0, 1 - left / span));
          const isRipe = left <= 0;
          return (
            <li key={i} className="relative">
              <button
                type="button"
                onClick={() => (isRipe ? onHarvest(i) : setSelected(selected === i ? null : i))}
                aria-label={`${species.title} ${isRipe ? "수확하기" : `${formatLeft(left)} 남음`}`}
                className={`garden-soil ${isRipe ? "garden-ripe" : ""} relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl ${
                  selected === i ? "ring-2 ring-[var(--g-leaf)]" : ""
                }`}
              >
                <span key={p.id} className={`garden-crop ${isRipe ? "garden-crop-ripe" : ""}`} style={{ width: `${65 + progress * 35}%` }}>
                  <PlantArt species={species} progress={progress} />
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
              {harvested[i] && <span key={harvested[i]} className="garden-harvest-float" aria-hidden="true">✦ 수확!</span>}
            </li>
          );
        })}
        </ul>
        <p className="garden-field-hint">{ripe.length ? `✦ ${ripe.length}칸이 다 자랐어요! 열매를 눌러 수확하세요` : data.beds.some((bed) => bed === null) ? "빈 흙밭을 눌러 씨앗을 심어 보세요" : "쑥쑥 자라는 중 · 작물을 누르면 자세히 볼 수 있어요"}</p>
      </div>

      <RipeAlarm beds={data.beds} now={now} />
      <RainAlarm now={now} />

      {/*
       * 작물 자세히 보기는 아래쪽 시트로 띄운다. 예전에는 텃밭 아래에 펼쳐졌는데, 휴대폰에서는
       * 그 자리가 화면 밖이라 눌러도 아무 일이 없는 줄 알았다. 씨앗 주머니와 같은 모양이다.
       */}
      {selected !== null && data.beds[selected] && (
        <BedDetail
          onClose={() => setSelected(null)}
          species={byId.get(data.beds[selected]!.speciesId)}
          plant={data.beds[selected]!}
          now={now}
          have={data.tools.have}
          onFeed={(id) => {
            const before = data.beds[selected]!.ripeAt - now;
            if (!feed(selected, id)) return null;
            gardenFeedback("plant");
            const after = (useGarden.getState().data?.beds[selected]?.ripeAt ?? 0) - now;
            const message = `${TOOLS[id].icon} ${TOOLS[id].label}! ${formatLeft(before)} → ${formatLeft(after)}`;
            say(message);
            return message;
          }}
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
            gardenFeedback("plant");
            say("🌱 씨앗을 심었어요. 쑥쑥 자라라!");
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
                gardenFeedback("reward");
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
          잼으로 졸이거나, 방에 전시하거나 — 둘 중 하나예요.
        </p>
        {data.basket.length >= BASKET_WARN_AT && (
          <p role="status" className="garden-basket-warn mt-2 rounded-xl px-3 py-2 text-[12.5px] font-semibold">
            🧺 바구니 {data.basket.length}/{BASKET_MAX}
            {data.basket.length >= BASKET_MAX ? " · 가득 찼어요." : " · 거의 찼어요."} 가득 찬 뒤에 거두면 가장 오래된 열매부터
            빠져요. 잼으로 졸이거나 방에 전시해 두세요.
          </p>
        )}

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
                    <div className="flex shrink-0 flex-col items-stretch gap-1.5">
                      <button
                        type="button"
                        onClick={() => { gardenFeedback("reward"); say(`🍯 잼 +${sell([f.id], byId, bonus)}`); }}
                        className="rounded-full bg-[var(--g-jam)] px-3 py-1.5 text-[12.5px] font-semibold text-white"
                      >
                        잼 {fruitValue(f, species, bonus)}
                      </button>
                      {/* 졸이는 대신 방에 둔다. 열매는 바구니에서 사라지고, 다시 열매로 되돌릴 수 없다(§4.2). */}
                      <button
                        type="button"
                        onClick={() => {
                          const out = showFruit(f.id, byId);
                          if (!out) {
                            say("전시품이 너무 많아요. 방에서 몇 개를 치워 주세요");
                            return;
                          }
                          gardenFeedback("plant");
                          track("room_show", { kind: out.shown.kind, tier: species.tier, mutated: f.mutations.length > 0 });
                          say(out.at ? `🪴 방에 전시했어요` : "🪴 보관함에 넣었어요 · 방 꾸미기에서 놓아요");
                        }}
                        aria-label={`${species.title} 열매를 방에 전시하기`}
                        className="garden-show-btn rounded-full px-3 py-1.5 text-[12px] font-semibold"
                      >
                        🪴 전시하기
                      </button>
                    </div>
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
                      {/*
                        * 언행 열매에서만, 그 말에 한 줄 남기는 길. 잼은 그대로다 — 응원에는
                        * 게임 보상을 붙이지 않는다(docs/garden-game.md §1). 길만 놓는다.
                        */}
                      {species.id.startsWith("w:") && (
                        <Link
                          href={`/words?tab=cheers&topic=${species.id.slice(2)}&from=garden`}
                          className="mt-1.5 inline-block text-[12px] font-semibold text-[var(--g-leaf)] hover:underline"
                        >
                          💬 이 말에 한 줄 남기기 →
                        </Link>
                      )}
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
  plant,
  now,
  have,
  onFeed,
  onDig,
  onClose,
}: {
  species: Species | undefined;
  plant: Plant;
  now: number;
  have: Partial<Record<ToolId, number>>;
  /** 비료를 줬으면 그 소식을, 못 줬으면 null. 토스트는 시트 뒤에 가려지므로 시트 안에도 띄운다. */
  onFeed: (id: ToolId) => string | null;
  onDig: () => void;
  onClose: () => void;
}) {
  const [fedNote, setFedNote] = useState<string | null>(null);

  if (!species) return null;
  const left = plant.ripeAt - now;
  const growing = left > 0;
  const span = plant.ripeAt - plant.plantedAt;
  const progress = Math.min(1, Math.max(0, 1 - left / span));
  const fed = plant.fed === plant.harvests;
  const owned = TOOL_ORDER.filter((id) => (have[id] ?? 0) > 0);
  return (
    <Sheet label={`${species.title} 자세히 보기`} title="내 작물" onClose={onClose}>
    <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
      <span className="garden-seed-packet shrink-0"><PlantArt species={species} progress={progress} /></span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug">{species.title}</p>
        <p className="text-[12px] text-smoke">
          {TIER_LABEL[species.tier]}
          {species.tier === "perennial" ? ` · ${plant.harvests}번 수확함 · 다시 열립니다` : ""}
        </p>
      </div>
    </div>
    <p className="mt-3 text-[12.5px] text-smoke">
      {growing ? `다 익을 때까지 ${formatLeft(left)} 남았어요.` : "다 익었어요! 텃밭에서 눌러 수확하세요."}
    </p>
    {fedNote && (
      <p role="status" className="mt-2 rounded-xl bg-[var(--g-panel)] px-3 py-2 text-[12.5px] font-semibold">
        {fedNote}
      </p>
    )}
    {growing && (
      <div className="mt-2.5 border-t border-stone/60 pt-2.5">
        <p className="text-[12px] text-smoke">
          {fed
            ? "🌿 이번 차례에는 비료를 줬어요. 다 익을 때까지 한 번만 줄 수 있어요."
            : owned.length
              ? `비료 주기 · 남은 ${formatLeft(left)} (한 번 익는 동안 하나만)`
              : "비료는 상점 ‘도구’에서 사요."}
        </p>
        {!fed && owned.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {owned.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFedNote(onFeed(id))}
                className="rounded-full bg-[var(--g-leaf)] px-3 py-1.5 text-[12px] font-semibold text-white"
              >
                {TOOLS[id].icon} {TOOLS[id].label} ×{have[id]} · −{formatLeft(fertilizerCut(id, left))}
              </button>
            ))}
          </div>
        )}
      </div>
    )}
    <div className="mt-4 flex items-center gap-4 border-t border-stone/60 pt-3">
      <Link href={species.href} className="text-[12.5px] font-semibold text-graphite underline underline-offset-2">
        이 업적 원본 보기
      </Link>
      <button type="button" onClick={onDig} className="ml-auto text-[12.5px] text-smoke">
        갈아엎기
      </button>
    </div>
    </Sheet>
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
    <Sheet label="심을 씨앗 고르기" title="씨앗 주머니" onClose={onClose}>
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
                  <span className="garden-seed-packet shrink-0"><PlantArt species={species} /></span>
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
    </Sheet>
  );
}

/**
 * 익음 알림 — 다음 열매가 익는 때를 내 캘린더에 넣는다(rules.ts의 alarmTime, alarm.ts).
 * 서버가 보내는 알림이 아니다. 하루 두 번 돌아오게 하는 약속을 사람이 직접 잡는다.
 * 곧 익거나 이미 익은 것이 있으면 띄우지 않는다.
 */
function RipeAlarm({ beds, now }: { beds: Array<Plant | null>; now: number }) {
  const [open, setOpen] = useState(false);
  const growing = beds.filter((p): p is Plant => p !== null && p.ripeAt > now);
  if (growing.length === 0 || beds.some((p) => p && p.ripeAt <= now)) return null;
  const first = Math.min(...growing.map((p) => p.ripeAt));
  if (first - now < ALARM_MIN_LEAD) return null;
  const last = Math.max(...growing.map((p) => p.ripeAt));
  // 분 단위로 맞춘다. 같은 시각이면 캘린더가 같은 일정으로 본다.
  const quiet = alarmTime(first) !== first;
  const at = Math.ceil(alarmTime(first) / MINUTE) * MINUTE;
  const go = (via: "ics" | "google") =>
    track("ripe_alarm", { via, hours: Math.round((at - now) / HOUR), quiet });

  return (
    <div className="mt-3 rounded-2xl bg-[var(--g-panel)] px-4 py-3 text-[13px]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => { gardenFeedback("tap"); setOpen(!open); }}
        className="flex w-full items-center justify-between gap-2 text-left font-semibold"
      >
        <span>⏰ 다 익으면 알려 줄까요? · {formatClock(first, now)}</span>
        <span aria-hidden="true" className="text-smoke">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="mt-2">
          <p className="text-graphite">
            첫 열매 {formatClock(first, now)}
            {last !== first && ` · 모두 ${formatClock(last, now)}`}
            {quiet && ` · 밤에는 울리지 않게 ${formatClock(at, now)}에 알려요`}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href={`/api/garden-alarm?at=${at}`}
              onClick={() => go("ics")}
              className="rounded-full bg-ink px-3.5 py-1.5 font-semibold text-eggshell"
            >
              📅 휴대폰 캘린더에 넣기
            </a>
            <a
              href={googleCalendarLink(at, `${window.location.origin}/garden`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => go("google")}
              className="rounded-full bg-white px-3.5 py-1.5 font-semibold text-graphite ring-1 ring-black/10"
            >
              구글 캘린더
            </a>
          </div>
          <p className="mt-2 text-[11.5px] text-smoke">
            내 캘린더가 울려요. 잼통은 알림을 보내지 않아요. 물이나 비료로 당겨지면 그보다 일찍 익어요.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 단비 알림(docs/garden-miniroom.md §8의 6) — 다음 단비를 내 캘린더에. 익음 알림과 같은 길(/api/garden-alarm?k=rain).
 * 단비는 12:30·19:30이라 밤 22시~8시에 걸리지 않는다. 곧 오면(15분 안) 띄우지 않는다.
 */
function RainAlarm({ now }: { now: number }) {
  const rain = nextRain(now);
  if (rain.start - now < ALARM_MIN_LEAD) return null;
  const at = Math.ceil(rain.start / MINUTE) * MINUTE;
  const go = (via: "ics" | "google") => track("ripe_alarm", { via, hours: Math.round((at - now) / HOUR), quiet: false, kind: "rain" });
  return (
    <p className="mt-2 px-1 text-[12.5px] text-graphite">
      🌧 다음 단비 {formatClock(at, now)} — 성장 ×2. 캘린더에:{" "}
      <a href={`/api/garden-alarm?at=${at}&k=rain`} onClick={() => go("ics")} className="inline-block min-h-[32px] py-1 font-semibold underline underline-offset-2">휴대폰</a>
      {" · "}
      <a href={googleCalendarLink(at, `${window.location.origin}/garden`, "rain")} target="_blank" rel="noopener noreferrer" onClick={() => go("google")} className="inline-block min-h-[32px] py-1 font-semibold underline underline-offset-2">
        구글
      </a>
    </p>
  );
}
