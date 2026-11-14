"use client";

import Link from "next/link";
import { useState } from "react";

import { track } from "@/lib/analytics";

import { PlantArt } from "../GardenArt";
import { gardenFeedback } from "../feedback";
import {
  baseJam,
  FINISHER_ORDER,
  FINISHERS,
  formatLeft,
  fruitIcon,
  growMinutes,
  isNewVariety,
  josa,
  kstDay,
  MINUTE,
  monsoonSpecies,
  NEW_VARIETY_BONUS,
  NEW_VARIETY_DAYS,
  PLOT_UPGRADES,
  RAID_USES_PER_PERSON,
  SEED_PRICE,
  SHOP_ODDS,
  SHOP_SLOT,
  shopFor,
  shopSlot,
  TIER_LABEL,
  TOOL_ORDER,
  TOOLS,
  type FinisherId,
  type ToolId,
} from "../rules";
import { useGarden, type GardenData } from "../store";
import type { Species } from "../types";
import { BuySheet, ExpandBanner, priceText, SHOP_CATS, ShopCard, type ShopCat } from "./parts";
import { RoomShop } from "./RoomShop";
import { TrophyShop } from "./TrophyShop";
import { KIT, KIT_ORDER, type KitId } from "../raid/rules";

/**
 * 상점 — 카테고리 상점(docs/garden-miniroom.md §6).
 *
 * 🌱 씨앗은 15분마다 진열이 바뀌고 모두가 같은 진열을 본다. 진열 확률은 "확률 보기"에 그대로 적는다 —
 * 무료여도 청소년이 쓰는 곳이다. 🧪 도구·🛋 가구·🎨 벽·바닥은 늘 같은 값이고 무작위가 없다.
 * 🏆 전리품은 거대 잡초의 뿌리 조각으로 산다(TrophyShop.tsx).
 */
export function Shop({
  data,
  catalog,
  byId,
  now,
  say,
}: {
  data: GardenData;
  catalog: Species[];
  byId: Map<string, Species>;
  now: number;
  say: (text: string) => void;
}) {
  const [cat, setCat] = useState<ShopCat>("seeds");

  return (
    <div className="garden-shop2">
      <div className="garden-chips garden-shop-chips" role="group" aria-label="상점 칸">
        {SHOP_CATS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={cat === c.id}
            onClick={() => { gardenFeedback("tap"); setCat(c.id); }}
            className="garden-chip-btn"
          >
            <span aria-hidden="true">{c.icon}</span> {c.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        {cat === "seeds" && <SeedShop data={data} catalog={catalog} byId={byId} now={now} say={say} />}
        {cat === "tools" && <ToolShop data={data} now={now} say={say} />}
        {(cat === "furniture" || cat === "walls") && <RoomShop cat={cat} data={data} byId={byId} now={now} say={say} />}
        {cat === "trophy" && <TrophyShop data={data} say={say} />}
      </div>

      <p className="mt-5 text-[11.5px] leading-relaxed text-smoke">
        잼은 정원 안에서만 쓰이고, 돈으로 사거나 다른 사람과 주고받을 수 없어요. 무작위로 물건이 나오는 뽑기는 없어요.
      </p>
    </div>
  );
}

// ── 🌱 씨앗 ──────────────────────────────────────────────────────────

function SeedShop({
  data,
  catalog,
  byId,
  now,
  say,
}: {
  data: GardenData;
  catalog: Species[];
  byId: Map<string, Species>;
  now: number;
  say: (text: string) => void;
}) {
  const { buy, upgrade } = useGarden.getState();
  const [open, setOpen] = useState<string | null>(null);
  const slot = shopSlot(now);
  // 장마 여부는 슬롯 시작 시각으로 본다. 슬롯 안에서 진열이 바뀌지 않게, 모두가 같게.
  const monsoon = monsoonSpecies(slot * SHOP_SLOT, catalog);
  const items = shopFor(slot, catalog, monsoon);
  const bought = data.shop.slot === slot ? data.shop.bought : {};
  const restock = (slot + 1) * SHOP_SLOT - now;
  const nextPlot = PLOT_UPGRADES.find((u) => u.plots > data.beds.length);

  const buySeed = (species: Species, stock: number) => {
    if (!buy(species, slot, stock)) return;
    gardenFeedback("reward");
    track("shop_buy", { cat: "seeds" });
    say(`${fruitIcon(species)} 씨앗을 샀어요`);
  };

  const openItem = items.find((i) => i.speciesId === open);
  const openSpecies = openItem && byId.get(openItem.speciesId);

  return (
    <section aria-label="씨앗">
      {nextPlot && (
        <ExpandBanner
          icon="🪴"
          title="텃밭 넓히기"
          sub={`${data.beds.length}칸 → ${nextPlot.plots}칸`}
          price={nextPlot.price}
          wallet={data.jam}
          onBuy={() => {
            if (!upgrade()) return;
            gardenFeedback("reward");
            track("shop_buy", { cat: "seeds" });
            say("🪴 텃밭이 넓어졌어요");
          }}
        />
      )}

      <p className={`garden-shop-notice ${monsoon.length ? "garden-monsoon text-white" : ""}`}>
        {monsoon.length ? `🌦 신품종 장마 · 오늘 들어온 ${monsoon.length}품종이 앞 칸에 · ` : "🕒 "}
        새 진열까지 <span className="tabular-nums">{formatLeft(restock)}</span>
      </p>

      <ul className="garden-shop-grid">
        {items.map((item) => {
          const species = byId.get(item.speciesId);
          if (!species) return null;
          const left = item.stock - (bought[item.speciesId] ?? 0);
          const price = SEED_PRICE[species.tier];
          const short = Math.max(0, price - data.jam);
          return (
            <ShopCard
              key={item.speciesId}
              art={<span className="garden-seed-packet"><PlantArt species={species} /></span>}
              title={species.title}
              sub={`${TIER_LABEL[species.tier]} · 남은 ${left}개`}
              badge={isNewVariety(species, now) ? "신품종" : undefined}
              rare={species.tier === "flagship" || species.tier === "perennial"}
              buyLabel={left <= 0 ? "품절" : priceText(price)}
              buyDisabled={left <= 0 || short > 0}
              onOpen={() => { gardenFeedback("tap"); setOpen(species.id); }}
              onBuy={() => buySeed(species, item.stock)}
            />
          );
        })}
      </ul>

      <details className="garden-odds mt-3">
        <summary>확률 보기</summary>
        <p className="mt-1.5">
          진열 확률 (칸마다): {SHOP_ODDS.map((o) => `${TIER_LABEL[o.tier]} ${Math.round(o.p * 100)}%`).join(" · ")}. 신품종 장마(품종이 들어온
          날 19:00–20:00)에는 그날 들어온 품종이 앞 3칸에 먼저 나와요. 신품종 열매는 들어온 날부터 {NEW_VARIETY_DAYS}일 동안 잼이{" "}
          {Math.round(NEW_VARIETY_BONUS * 100)}% 더 나와요.
        </p>
      </details>

      {openItem && openSpecies && (
        <BuySheet
          title={openSpecies.title}
          art={<span className="garden-seed-packet is-big"><PlantArt species={openSpecies} /></span>}
          facts={[
            ["등급", TIER_LABEL[openSpecies.tier]],
            ["익는 데", `약 ${formatLeft(growMinutes(openSpecies) * MINUTE)}`],
            ["열매 잼", `약 ${baseJam(openSpecies)}`],
            ["가진 씨앗", `${data.seeds[openSpecies.id] ?? 0}개`],
            ["이 진열에 남은 것", `${openItem.stock - (bought[openSpecies.id] ?? 0)}개`],
            ["새 진열까지", formatLeft(restock)],
          ]}
          price={SEED_PRICE[openSpecies.tier]}
          wallet={data.jam}
          blocked={openItem.stock - (bought[openSpecies.id] ?? 0) <= 0 ? "이 진열에서는 품절이에요" : undefined}
          onBuy={() => buySeed(openSpecies, openItem.stock)}
          onClose={() => setOpen(null)}
        >
          {openSpecies.tier === "perennial" && <p>다년생은 거둔 뒤에도 다시 열려요.</p>}
          <Link href={openSpecies.href} className="font-semibold text-graphite underline underline-offset-2">
            이 씨앗의 원본 페이지 보기 →
          </Link>
        </BuySheet>
      )}
    </section>
  );
}

// ── 🧪 도구 ──────────────────────────────────────────────────────────

type ToolKey = { group: "tool"; id: ToolId } | { group: "finisher"; id: FinisherId } | { group: "kit"; id: KitId };

function ToolShop({ data, now, say }: { data: GardenData; now: number; say: (text: string) => void }) {
  const { buyTool, buyFinisher, buyKit } = useGarden.getState();
  const [open, setOpen] = useState<ToolKey | null>(null);
  const today = kstDay(now);

  const info = (k: ToolKey) => {
    const item = k.group === "tool" ? TOOLS[k.id] : k.group === "kit" ? KIT[k.id] : FINISHERS[k.id];
    const ledger = k.group === "tool" ? data.tools : k.group === "kit" ? data.kit : data.finishers;
    const used = ledger.day === today ? ((ledger.bought as Record<string, number>)[k.id] ?? 0) : 0;
    const have = (ledger.have as Record<string, number>)[k.id] ?? 0;
    const hint =
      k.group === "tool"
        ? `${TOOLS[k.id].hint} 텃밭에서 작물을 누르면 쓸 수 있어요.`
        : k.group === "kit"
          ? `${KIT[k.id].hint} 거대 잡초 싸움터의 도구 줄에서 써요.`
          : `거대 잡초 싸움터 아래 단추로 써요. 기력 ${FINISHERS[k.id].hits}번을 한꺼번에(빈틈이면 두 배로 세요) — 한 사람의 기력 ${RAID_USES_PER_PERSON}번 안에서만 들어가요.`;
    return { item, left: item.perDay - used, have, hint };
  };

  const buyOne = (k: ToolKey) => {
    const { item } = info(k);
    const ok = k.group === "tool" ? buyTool(k.id) : k.group === "kit" ? buyKit(k.id) : buyFinisher(k.id);
    if (!ok) return;
    gardenFeedback("reward");
    track("shop_buy", { cat: "tools" });
    say(`${item.icon} ${josa(item.label, "을를")} 샀어요`);
  };

  const groups: Array<{ title: string; note: string; keys: ToolKey[] }> = [
    { title: "텃밭", note: "비료 — 자라는 작물을 빨리 익혀요.", keys: TOOL_ORDER.map((id) => ({ group: "tool" as const, id })) },
    {
      title: "싸움",
      note: "거대 잡초 도구 — 필살기(기력을 한 번에), 지원 기다림 줄이기, 버티기. 기력을 더 주는 도구는 없어서 혼자서는 쓰러뜨릴 수 없어요.",
      keys: [...FINISHER_ORDER.map((id) => ({ group: "finisher" as const, id })), ...KIT_ORDER.map((id) => ({ group: "kit" as const, id }))],
    },
  ];
  const opened = open && info(open);

  return (
    <section aria-label="도구">
      <p className="text-[12px] text-smoke">늘 같은 값으로 팔아요. 무작위는 없어요. 하루에 살 수 있는 수가 정해져 있어요.</p>
      {groups.map((g) => (
        <div key={g.title} className="mt-3">
          <h3 className="garden-diary-title">{g.title}</h3>
          <p className="text-[12px] text-smoke">{g.note}</p>
          <ul className="garden-shop-grid">
            {g.keys.map((k) => {
              const { item, left, have } = info(k);
              const short = Math.max(0, item.price - data.jam);
              return (
                <ShopCard
                  key={k.id}
                  art={<span className="text-[36px] leading-none">{item.icon}</span>}
                  title={item.label}
                  sub={`가진 것 ${have} · 오늘 ${left}개 더`}
                  buyLabel={left <= 0 ? "오늘 끝" : priceText(item.price)}
                  buyDisabled={left <= 0 || short > 0}
                  onOpen={() => { gardenFeedback("tap"); setOpen(k); }}
                  onBuy={() => buyOne(k)}
                />
              );
            })}
          </ul>
        </div>
      ))}

      {open && opened && (
        <BuySheet
          title={opened.item.label}
          art={<span className="text-[64px] leading-none">{opened.item.icon}</span>}
          facts={[
            ["가진 것", `${opened.have}개`],
            ["오늘 더 살 수 있는 것", `${Math.max(0, opened.left)}개`],
          ]}
          price={opened.item.price}
          wallet={data.jam}
          blocked={opened.left <= 0 ? "오늘은 다 샀어요" : undefined}
          onBuy={() => buyOne(open)}
          onClose={() => setOpen(null)}
        >
          <p>{opened.hint}</p>
        </BuySheet>
      )}
    </section>
  );
}
