"use client";

import { useId, useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "./feedback";
import { MutationChips } from "./parts";
import { JarArt } from "./room/RoomSvg";
import { fruitIcon, fruitValue, JAR_FRUITS, JAR_STYLE, jarMutations, jarRegion, REGION_LABEL, REGION_ORDER } from "./rules";
import { Sheet } from "./Sheet";
import { useGarden, type GardenData } from "./store";
import type { Fruit, Mutation, Species } from "./types";

/**
 * 잼 공방 — 같은 분야의 서로 다른 품종 열매 셋으로 분야 잼 병을 만든다(docs/garden-farm-v2.md §5).
 *
 * ★ 병은 전시품이라 방에 놓인다(빈자리가 없으면 보관함). 잼으로 팔지 못한다 — 열매 셋을 잼으로 졸이는 대신 병 하나를 갖는다.
 * ★ 재료 열매의 변이가 병으로 옮겨 간다. 고르는 동안 병 모양을 미리 보인다.
 * ★ 처음 만드는 분야 병에는 대표 씨앗 하나(rules.ts의 jarFirstSeed).
 */
export function JamWorkshop({ data, byId, bonus, say }: { data: GardenData; byId: Map<string, Species>; bonus: number; say: (text: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const made = new Set(data.jars ?? []);
  // 분야마다 바구니에 있는 서로 다른 품종 수.
  const kinds = new Map<string, Set<string>>();
  for (const f of data.basket) {
    const region = byId.get(f.speciesId)?.region;
    if (region && JAR_STYLE[region]) kinds.set(region, (kinds.get(region) ?? new Set()).add(f.speciesId));
  }
  const rows = REGION_ORDER.filter((r) => kinds.has(r)).map((r) => ({ region: r, have: kinds.get(r)!.size }));
  if (rows.length === 0) return null;
  return (
    <section aria-labelledby="jam-workshop" className="mt-7">
      <h2 id="jam-workshop" className="text-[15px] font-bold">🫙 잼 공방</h2>
      <p className="mt-1 text-[12px] leading-relaxed text-smoke">
        같은 분야의 서로 다른 열매 {JAR_FRUITS}개로 분야 잼 병을 만들어 방에 진열해요. 열매의 변이는 병에 옮겨 가요. 처음 만드는 분야는 대표 씨앗을 드려요.
      </p>
      <ul className="mt-2.5 flex flex-wrap gap-2">
        {rows.map(({ region, have }) => {
          const ready = have >= JAR_FRUITS;
          return (
            <li key={region}>
              <button
                type="button"
                disabled={!ready}
                onClick={() => { gardenFeedback("tap"); setOpen(region); }}
                className="garden-jar-btn"
                aria-label={`${REGION_LABEL[region]} 잼 — 서로 다른 열매 ${Math.min(have, JAR_FRUITS)}/${JAR_FRUITS}${made.has(region) ? "" : " · 처음 만들면 대표 씨앗"}`}
              >
                <span aria-hidden="true">{JAR_STYLE[region].icon}</span> {REGION_LABEL[region]} 잼
                <span className="garden-jar-count">{Math.min(have, JAR_FRUITS)}/{JAR_FRUITS}</span>
                {!made.has(region) && ready && <span className="garden-jar-first">첫 병 🎁</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {open && (
        <JarSheet
          region={open}
          fruits={data.basket.filter((f) => byId.get(f.speciesId)?.region === open)}
          byId={byId}
          bonus={bonus}
          first={!made.has(open)}
          onClose={() => setOpen(null)}
          onMade={(text) => { say(text); setOpen(null); }}
        />
      )}
    </section>
  );
}

function JarSheet({
  region,
  fruits,
  byId,
  bonus,
  first,
  onClose,
  onMade,
}: {
  region: string;
  fruits: Fruit[];
  byId: Map<string, Species>;
  bonus: number;
  first: boolean;
  onClose: () => void;
  onMade: (text: string) => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const chosen = picked.map((id) => fruits.find((f) => f.id === id)).filter((f): f is Fruit => Boolean(f));
  const ok = jarRegion(chosen, byId) === region;
  const mut = jarMutations(chosen);
  const giveUp = chosen.reduce((sum, f) => sum + fruitValue(f, byId.get(f.speciesId)!, bonus), 0);
  // 품종마다 열매를 모은다. 한 품종에서 하나만 고른다.
  const groups = [...new Set(fruits.map((f) => f.speciesId))].map((id) => ({ species: byId.get(id)!, list: fruits.filter((f) => f.speciesId === id) }));
  const toggle = (f: Fruit) => {
    gardenFeedback("tap");
    setPicked((cur) => {
      if (cur.includes(f.id)) return cur.filter((x) => x !== f.id);
      const sameKind = cur.filter((id) => fruits.find((x) => x.id === id)?.speciesId !== f.speciesId);
      return [...sameKind, f.id].slice(-JAR_FRUITS);
    });
  };
  const make = () => {
    const out = useGarden.getState().makeJar(picked, byId);
    if (!out) {
      onMade("잼 병을 만들지 못했어요. 전시품이 너무 많으면 방에서 몇 개를 치워 주세요");
      return;
    }
    gardenFeedback("reward");
    track("garden_jar", { region, mutations: mut.length, first });
    const where = out.placed ? "방에 진열했어요" : "보관함에 넣었어요 · 방 꾸미기에서 놓아요";
    onMade(`🫙 ${REGION_LABEL[region]} 잼 완성 — ${where}${out.seed ? ` · 🎁 대표 씨앗 「${out.seed.title}」` : ""}`);
  };
  return (
    <Sheet label={`${REGION_LABEL[region]} 잼 만들기`} title={`${JAR_STYLE[region].icon} ${REGION_LABEL[region]} 잼`} onClose={onClose}>
      <div className="mt-2 flex items-center gap-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
        <JarPreview region={region} mut={mut} />
        <div className="min-w-0 flex-1 text-[12.5px] leading-relaxed">
          <p className="font-semibold">서로 다른 열매 {chosen.length}/{JAR_FRUITS}</p>
          {mut.length > 0 ? <MutationChips mutations={mut} size="xs" /> : <p className="text-smoke">변이 열매를 넣으면 병 모양이 달라져요.</p>}
          {chosen.length > 0 && <p className="text-smoke">잼으로 졸이면 {giveUp}잼 — 그 대신 병 하나를 가져요.</p>}
          {first && <p className="font-semibold text-[var(--g-leaf)]">처음 만드는 {REGION_LABEL[region]} 잼 — 대표 씨앗 선물</p>}
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {groups.map(({ species, list }) => (
          <li key={species.id} className="rounded-2xl bg-[var(--g-panel)] px-3 py-2.5">
            <p className="truncate text-[13px] font-semibold">{fruitIcon(species)} {species.title}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {list.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={picked.includes(f.id)}
                  onClick={() => toggle(f)}
                  className="garden-jar-fruit"
                  aria-label={`${species.title} 열매${f.mutations.length ? ` · 변이 ${f.mutations.length}` : ""} · 잼 ${fruitValue(f, species, bonus)}`}
                >
                  {fruitIcon(species)}
                  {f.mutations.length > 0 && <MutationChips mutations={f.mutations as Mutation[]} size="xs" />}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <button type="button" disabled={!ok} onClick={make} className="garden-diary-btn mt-3 w-full disabled:opacity-40">
        🫙 잼 병 만들기
      </button>
    </Sheet>
  );
}

function JarPreview({ region, mut }: { region: string; mut: Mutation[] }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 40 46" width={56} height={64} aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id={`${uid}-rb`} x1="0" x2="1">
          {["#d9574a", "#f47b20", "#ffd85c", "#86c46d", "#2f9bd8", "#9b86d1"].map((c, i) => <stop key={c} offset={i / 5} stopColor={c} />)}
        </linearGradient>
      </defs>
      <JarArt region={region} mut={mut} w={40} h={46} rainbow={`url(#${uid}-rb)`} />
    </svg>
  );
}
