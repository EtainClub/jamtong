"use client";

import Link from "next/link";
import { useState } from "react";

import { PlantArt } from "./GardenArt";
import { gardenFeedback } from "./feedback";

import type { Bloom } from "@/lib/firebase/blooms";

import {
  BLOOM_CARE,
  bloomBonus,
  bloomStage,
  CARE,
  CARE_PER_DAY,
  caresFor,
  kstDay,
  kstDayNumber,
  NECTAR,
  NICK_MAX,
} from "./rules";
import { useGarden, type GardenData } from "./store";
import type { Species } from "./types";

/**
 * 꽃밭 — 업적을 함께 피우고, 가장 많이 가꾼 사람이 정원지기가 된다.
 *
 * ★ 다 가꿀 필요가 없다.
 *   모두의 가꿈이 30에 닿으면 그 업적은 만개하고, 핀 꽃은 지지 않는다. 그래서
 *   목록은 "아직 안 핀 것, 피기 직전인 것"부터 보여 준다 — 손길이 갈 곳을 고르게.
 *
 * ★ 정원지기는 그 업적을 가장 많이 가꾼 사람이다.
 *   만개한 업적의 정원지기는 날마다 꽃꿀을 받는다. 자리는 고정이 아니다 —
 *   더 많이 가꾼 사람이 나타나면 넘어간다. 그래서 핀 꽃에도 다시 올 이유가 남는다.
 */
export function FlowerBed({
  data,
  catalog,
  blooms,
  uid,
  now,
  say,
}: {
  data: GardenData;
  catalog: Species[];
  blooms: Map<string, Bloom>;
  uid: string | null;
  now: number;
  say: (text: string) => void;
}) {
  const { rename, takeNectar } = useGarden.getState();
  const [draft, setDraft] = useState<string | null>(null);

  const achievements = catalog.filter(caresFor);
  const isMine = (b?: Bloom) => Boolean(b && (b.ownerUid === uid || b.ownerUid === "local"));
  const bloomedList = achievements.filter((s) => blooms.get(s.id)?.bloomedAt);
  const growing = achievements
    .filter((s) => !blooms.get(s.id)?.bloomedAt)
    .sort((a, b) => (blooms.get(b.id)?.care ?? 0) - (blooms.get(a.id)?.care ?? 0));
  const owned = bloomedList.filter((s) => isMine(blooms.get(s.id)));
  const today = kstDay(now);
  const nectarLeft = owned.filter((s) => !(data.nectar.day === today && data.nectar.taken.includes(s.id)));
  const bonus = Math.round(bloomBonus(bloomedList.length) * 100);

  return (
    <div className="garden-flowers">
      <h2 className="text-[15px] font-bold">꽃밭</h2>
      <p className="mt-1 text-[12px] leading-relaxed text-smoke">
        업적 열매를 거두면 가꿈 {CARE.harvest}, 그 쪽지의 근거를 열면 {CARE.shine}. 모두의 가꿈이 {BLOOM_CARE}에 닿으면
        만개하고, 핀 꽃은 지지 않아요. 한 업적에 하루 {CARE_PER_DAY}까지 가꿀 수 있어요.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-2xl bg-[var(--g-panel)] py-3">
          <p className="text-[20px] font-bold tabular-nums">
            🌸 {bloomedList.length}
            <span className="text-[13px] font-normal text-smoke">/{achievements.length}</span>
          </p>
          <p className="text-[11.5px] text-smoke">만개한 업적</p>
        </div>
        <div className="rounded-2xl bg-[var(--g-panel)] py-3">
          <p className="text-[20px] font-bold tabular-nums">+{bonus}%</p>
          <p className="text-[11.5px] text-smoke">모두의 잼 보너스</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
        <label htmlFor="garden-nick" className="text-[12px] font-semibold">
          내 정원 이름
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="garden-nick"
            value={draft ?? data.nick}
            maxLength={NICK_MAX}
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 rounded-full border border-stone bg-canvas px-3.5 py-1.5 text-[13px] focus:border-graphite focus:outline-none"
          />
          <button
            type="button"
            disabled={draft === null || !draft.trim() || draft === data.nick}
            onClick={() => {
              if (draft === null) return;
              rename(draft);
              setDraft(null);
              say("이름을 바꿨어요. 다음에 가꿀 때 명패에 걸려요");
            }}
            className="shrink-0 rounded-full bg-ink px-3.5 py-1.5 text-[12.5px] font-semibold text-eggshell disabled:opacity-35"
          >
            저장
          </button>
        </div>
        <p className="mt-1.5 text-[11px] text-smoke">정원지기가 되면 이 이름이 모두에게 보여요. 실명은 쓰지 마세요.</p>
      </div>

      {owned.length > 0 && (
        <section className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold">👑 내가 정원지기인 꽃 {owned.length}</h3>
            <button
              type="button"
              disabled={nectarLeft.length === 0}
              onClick={() => {
                const jam = takeNectar(nectarLeft.map((s) => s.id));
                if (jam) { gardenFeedback("reward"); say(`🍯 꽃꿀 +${jam}`); }
              }}
              className="rounded-full bg-[var(--g-jam)] px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-35"
            >
              {nectarLeft.length ? `꽃꿀 받기 +${nectarLeft.length * NECTAR}` : "오늘 꽃꿀 받음"}
            </button>
          </div>
        </section>
      )}

      <section className="mt-5">
        <h3 className="text-[13px] font-bold">꽃이 필요한 업적 {growing.length}</h3>
        <ul className="mt-2 space-y-2">
          {growing.map((s) => (
            <FlowerRow key={s.id} species={s} bloom={blooms.get(s.id)} data={data} mine={isMine(blooms.get(s.id))} now={now} />
          ))}
        </ul>
      </section>

      {bloomedList.length > 0 && (
        <section className="mt-6">
          <h3 className="text-[13px] font-bold">만개한 업적 {bloomedList.length}</h3>
          <ul className="mt-2 space-y-2">
            {bloomedList.map((s) => (
              <FlowerRow key={s.id} species={s} bloom={blooms.get(s.id)} data={data} mine={isMine(blooms.get(s.id))} now={now} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function FlowerRow({
  species,
  bloom,
  data,
  mine,
  now,
}: {
  species: Species;
  bloom: Bloom | undefined;
  data: GardenData;
  mine: boolean;
  now: number;
}) {
  const care = bloom?.care ?? 0;
  const bloomed = Boolean(bloom?.bloomedAt);
  const stage = bloomStage(care, bloomed);
  const myCare = data.care[species.id] ?? 0;
  const todayGiven = data.careToday.day === kstDayNumber(now) ? (data.careToday.given[species.id] ?? 0) : 0;
  const seeds = data.seeds[species.id] ?? 0;

  return (
    <li className={`rounded-2xl px-3.5 py-3 ${bloomed ? "garden-bloomed" : "bg-[var(--g-panel)]"}`}>
      <div className="flex items-center gap-3">
        <span className={`garden-flower-display ${stage === "bloom" ? "garden-bob" : ""}`}><PlantArt species={species} flower={stage === "bloom"} progress={Math.min(.95, care / BLOOM_CARE)} /></span>
        <div className="min-w-0 flex-1">
          <Link href={species.href} className="block truncate text-[13.5px] font-semibold hover:underline">
            {species.title}
          </Link>
          {!bloomed && (
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/10">
              <div className="h-full bg-[var(--g-leaf)]" style={{ width: `${Math.min(100, (care / BLOOM_CARE) * 100)}%` }} />
            </div>
          )}
          <p className="mt-1 text-[11.5px] text-smoke">
            {bloomed ? "만개" : `가꿈 ${care}/${BLOOM_CARE}`}
            {bloom?.ownerNick ? ` · 👑 ${bloom.ownerNick} (${bloom.ownerCare})` : bloom?.ownerUid ? " · 👑 이름 숨김" : ""}
          </p>
        </div>
      </div>
      <p className="mt-1.5 text-[11.5px] text-graphite">
        {mine
          ? `내가 정원지기예요 · 내 가꿈 ${myCare}`
          : bloom?.ownerCare
            ? `내 가꿈 ${myCare} · 정원지기까지 ${Math.max(1, bloom.ownerCare - myCare + 1)}`
            : `내 가꿈 ${myCare} · 처음 가꾸면 정원지기가 돼요`}
        {` · 오늘 ${todayGiven}/${CARE_PER_DAY}`}
        {seeds > 0 ? ` · 씨앗 ×${seeds}` : ""}
      </p>
    </li>
  );
}
