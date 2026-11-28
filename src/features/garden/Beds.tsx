"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

import { PlantArt } from "./GardenArt";
import { parseRareKey, RARE_BY_ID, rareImage } from "./slot/rare";
import { SeedSlot } from "./slot/SeedSlot";
import { SLOT_OPEN_EVENT, takeSlotRequest } from "./slot/pending";
import { IsoYard } from "./IsoYard";
import { YardSheet } from "./YardSheet";
import { normalizeYard } from "./yard";
import { requestSnap } from "./album/ClipLink";
import { gardenFeedback } from "./feedback";
import { BASKET_WARN_AT } from "./nav";
import { MutationChips, NoteCard } from "./parts";
import { JamWorkshop } from "./JamWorkshop";
import { Sheet } from "./Sheet";
import { googleCalendarLink } from "./alarm";
import { ALARM_MIN_LEAD, alarmTime, nextRain, CARE, caresFor, formatClock, fruitIcon, fruitValue, formatLeft, growMinutes, HOUR, josa, kstDay, MINUTE, REGION_LABEL, ROTATION, rotationLabel, rotationOf, SHINE_PER_DAY, TIER_LABEL, fertilizerCut, TOOL_ORDER, TOOLS, type ToolId } from "./rules";
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
  // 잼공 판 끝의 "슬롯 무료 한 번"으로 왔으면 바로 연다(slot/pending.ts).
  const [slotOpen, setSlotOpen] = useState(() => takeSlotRequest("seed"));
  useEffect(() => {
    const on = (e: Event) => {
      if ((e as CustomEvent<string>).detail === "seed" && takeSlotRequest("seed")) setSlotOpen(true);
    };
    window.addEventListener(SLOT_OPEN_EVENT, on);
    return () => window.removeEventListener(SLOT_OPEN_EVENT, on);
  }, []);
  const [harvested, setHarvested] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  /** 마당 꾸미기 중인가, 고른 꾸밈 자리(yard.ts). */
  const [yardEdit, setYardEdit] = useState(false);
  const [yardSlot, setYardSlot] = useState<number | null>(null);
  /** 꼬마가 가 있는 밭 — 거두면 그 밭 앞으로 간다(아이소 마당). */
  const [avatarAt, setAvatarAt] = useState<number | null>(null);

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
      setAvatarAt(i);
      if (!fruit.mutations.length) say(`${fruitIcon(species)} 수확! 바구니에 담았어요`);
      track("garden_harvest", { tier: species.tier, mutations: fruit.mutations.length, rot: fruit.rot ?? 0 });
      if (fruit.mutations.length) say(`${fruitIcon(species)} 변이! ${fruit.mutations.length}개`);
      if (fruit.gift) {
        // 첫 수확 선물 — 텃밭이 방을 꾸민다는 것을 첫 수확에서 보인다(docs/garden-farm-v2.md §3).
        track("garden_first_gift", { placed: fruit.gift.placed });
        say(fruit.gift.placed ? "🎁 첫 수확 선물 — 물뿌리개를 내 방에 놓았어요. 방 탭에서 보세요" : "🎁 첫 수확 선물 — 물뿌리개를 보관함에 넣었어요");
      }
      if (fruit.rare) {
        const n = useGarden.getState().data?.rareDex?.length ?? 0;
        track("rare_harvest", { kind: fruit.rare.kind, count: n });
        say(
          fruit.rare.done
            ? "💎 희귀 씨앗 여섯 가지를 다 모았어요! 칭호 희귀종 수집가 ★★★ · 방 보관함에 「희귀 씨앗 유리병」"
            : `💎 ${RARE_BY_ID.get(fruit.rare.kind)?.label ?? "희귀 씨앗"} 수확 · 희귀종 수집 ${n}/${RARE_BY_ID.size}`,
        );
      }
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

  const rare = Object.entries(data.rareSeeds ?? {})
    .map(([key, n]) => {
      const parsed = parseRareKey(key);
      const species = parsed ? byId.get(parsed.speciesId) : undefined;
      return parsed && species ? { key, n, species, kind: parsed.kind } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const shineUsed = data.shine.day === kstDay(now) ? data.shine.count : 0;
  const total = data.basket.reduce((sum, f) => {
    const s = byId.get(f.speciesId);
    return sum + (s ? fruitValue(f, s, bonus) : 0);
  }, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold">내 텃밭</h2>
        <button
          type="button"
          aria-pressed={yardEdit}
          onClick={() => { gardenFeedback("tap"); setYardEdit(!yardEdit); }}
          className="ml-auto mr-2 rounded-full border border-[var(--g-leaf)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--g-leaf)]"
        >
          {yardEdit ? "✓ 다 꾸몄어요" : "🏡 마당 꾸미기"}
        </button>
        {!yardEdit && (
          <button
            type="button"
            onClick={() => { gardenFeedback("tap"); setSlotOpen(true); }}
            aria-label="씨앗 슬롯머신"
            className="mr-2 rounded-full border border-[var(--g-leaf)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--g-leaf)]"
          >
            🎰
          </button>
        )}
        {!yardEdit && (
          <button
            type="button"
            onClick={() => { gardenFeedback("tap"); requestSnap("yard"); }}
            aria-label="지금 내 텃밭을 찍어 사진첩에 남기기"
            className="mr-2 rounded-full border border-[var(--g-leaf)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--g-leaf)]"
          >
            📸
          </button>
        )}
        {!yardEdit && ripe.length > 1 && (
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
        <IsoYard
          plots={data.beds.map((p) => {
            const species = p ? byId.get(p.speciesId) : undefined;
            if (!p || !species) return { plant: null, progress: 0, ripe: false, left: 0 };
            const left = p.ripeAt - now;
            const span = p.ripeAt - p.plantedAt;
            return { plant: p, species, progress: Math.min(1, Math.max(0, 1 - left / span)), ripe: left <= 0, left };
          })}
          now={now}
          selected={selected}
          avatar={data.room.avatar}
          mood={data.room.mood}
          avatarAt={avatarAt}
          harvested={harvested}
          yard={data.yard}
          editing={yardEdit}
          onSlot={(i) => { gardenFeedback("tap"); setYardSlot(i); }}
          onPlot={(i) => {
            const p = data.beds[i];
            if (!p || !byId.get(p.speciesId)) { gardenFeedback("tap"); setPicking(i); return; }
            if (p.ripeAt <= now) onHarvest(i);
            else setSelected(selected === i ? null : i);
          }}
        />
        <p className="garden-field-hint">{ripe.length ? `✦ ${ripe.length}칸이 다 자랐어요! 열매를 눌러 수확하세요` : data.beds.some((bed) => bed === null) ? "빈 흙밭을 눌러 씨앗을 심어 보세요" : "쑥쑥 자라는 중 · 작물을 누르면 자세히 볼 수 있어요"}</p>
      </div>

      {yardEdit && <p className="mt-2 text-[12.5px] text-smoke">점선 동그라미를 눌러 허수아비·꽃밭 같은 소품을 놓아요. 꾸밈일 뿐 작물에는 효과가 없어요.</p>}
      {yardSlot !== null && (
        <YardSheet slot={yardSlot} yard={normalizeYard(data.yard)} jam={data.jam} say={say} onClose={() => setYardSlot(null)} />
      )}

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
          rare={rare}
          onPickRare={(key, species) => {
            useGarden.getState().plantRare(picking, key, species, plaza);
            gardenFeedback("plant");
            track("garden_plant", { tier: species.tier, rare: parseRareKey(key)?.kind.id ?? "" });
            say(`💎 ${parseRareKey(key)?.kind.label ?? "희귀 씨앗"}을 심었어요 · 「${species.title}」`);
            setPicking(null);
          }}
          onClose={() => setPicking(null)}
          rot={(species) => rotationOf(data.plotLog?.[picking], species)}
          last={data.plotLog?.[picking] ? byId.get(data.plotLog[picking]!.s) : undefined}
          onPick={(species) => {
            const rot = rotationOf(data.plotLog?.[picking], species);
            plant(picking, species, plaza);
            gardenFeedback("plant");
            track("garden_plant", { tier: species.tier, rot });
            say(rot ? `🌱 씨앗을 심었어요 · ${rotationLabel(rot)}` : "🌱 씨앗을 심었어요. 쑥쑥 자라라!");
            setPicking(null);
          }}
          empty={catalog.length === 0}
        />
      )}

      {slotOpen && <SeedSlot catalog={catalog} now={now} onClose={() => setSlotOpen(false)} say={say} />}

      <JamWorkshop data={data} byId={byId} bonus={bonus} say={say} />

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
          잼으로 졸이거나, 방에 전시하거나, 위의 잼 공방에서 분야 잼 병으로 만들어요.
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
                        {f.rot ? <span className={`garden-rot-chip ${f.rot > 0 ? "is-up" : "is-down"}`}>{rotationLabel(f.rot)}</span> : null}
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
        {plant.rot ? <span className={`garden-rot-chip ${plant.rot > 0 ? "is-up" : "is-down"}`}>{rotationLabel(plant.rot)}</span> : null}
        {plant.rare && RARE_BY_ID.get(plant.rare) && (
          <p className="mt-1 text-[12px] font-semibold">💎 {RARE_BY_ID.get(plant.rare)!.label} — {RARE_BY_ID.get(plant.rare)!.hint}</p>
        )}
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
  rot,
  last,
  rare,
  onPickRare,
}: {
  seeds: Array<{ species: Species; n: number }>;
  /** 희귀 씨앗 주머니(slot/rare.ts) — 맨 위에 둔다. */
  rare: Array<{ key: string; n: number; species: Species; kind: { id: string; label: string; hint: string } }>;
  onPickRare: (key: string, species: Species) => void;
  onPick: (species: Species) => void;
  onClose: () => void;
  empty: boolean;
  /** 이 칸에 심으면 붙는 돌려짓기 가감(docs/garden-farm-v2.md §4). */
  rot: (species: Species) => number;
  /** 이 칸에서 마지막으로 거둔 품종. */
  last?: Species;
}) {
  // 돌려짓기가 붙는 씨앗을 위로 — 연작은 아래로. 같으면 원래 차례.
  const sorted = [...seeds].sort((a, b) => rot(b.species) - rot(a.species));
  return (
    <Sheet label="심을 씨앗 고르기" title="씨앗 주머니" onClose={onClose}>
        <p className="mt-1 text-[12px] leading-relaxed text-smoke">
          {last
            ? `이 칸에서 지난번에 「${last.title}」${josa(last.title, "을를").slice(last.title.length)} 거뒀어요. 다른 분야를 심으면 돌려짓기 +${Math.round(ROTATION.other * 100)}%, 같은 품종을 또 심으면 연작 −${Math.round(-ROTATION.same * 100)}%예요.`
            : `같은 칸에 다른 분야를 번갈아 심으면 잼이 +${Math.round(ROTATION.other * 100)}%, 같은 품종을 연달아 심으면 −${Math.round(-ROTATION.same * 100)}%예요.`}
        </p>
        {rare.length > 0 && (
          <ul className="mt-3 space-y-2" aria-label="희귀 씨앗">
            {rare.map((r) => (
              <li key={r.key}>
                <button type="button" onClick={() => onPickRare(r.key, r.species)} className="garden-rare-seed flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rareImage(r.kind.id)} alt="" width={48} height={48} className="shrink-0 rounded-xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold">💎 {r.kind.label} · {r.species.title}</span>
                    <span className="block text-[11.5px] text-smoke">{r.kind.hint}</span>
                  </span>
                  <span className="text-[13px] font-semibold text-smoke">×{r.n}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {(seeds.length === 0 || empty) && rare.length > 0 ? null : seeds.length === 0 || empty ? (
          <p className="mt-4 text-[13px] text-smoke">씨앗이 없어요. 상점에서 사거나 광장 잡초에서 찾아보세요.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {sorted.map(({ species, n }) => (
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
                      {TIER_LABEL[species.tier]} · {REGION_LABEL[species.region] ?? species.region} · 약 {formatLeft(growMinutes(species) * MINUTE)}
                    </span>
                    {rot(species) !== 0 && (
                      <span className={`garden-rot-chip ${rot(species) > 0 ? "is-up" : "is-down"}`}>{rotationLabel(rot(species))}</span>
                    )}
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
