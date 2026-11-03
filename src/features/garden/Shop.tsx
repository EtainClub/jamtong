"use client";

import { PlantArt } from "./GardenArt";
import { gardenFeedback } from "./feedback";

import { fruitIcon, formatLeft, PLOT_UPGRADES, SEED_PRICE, SHOP_ODDS, SHOP_SLOT, shopFor, shopSlot, TIER_LABEL } from "./rules";
import { useGarden, type GardenData } from "./store";
import type { Species } from "./types";

/**
 * 씨앗 상점. 15분마다 진열이 바뀌고, 모두가 같은 진열을 본다.
 * 진열 확률은 화면에 그대로 적는다 — 무료여도 청소년이 쓰는 곳이다.
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
  const { buy, upgrade } = useGarden.getState();
  const slot = shopSlot(now);
  const items = shopFor(slot, catalog);
  const bought = data.shop.slot === slot ? data.shop.bought : {};
  const restock = (slot + 1) * SHOP_SLOT - now;
  const nextPlot = PLOT_UPGRADES.find((u) => u.plots > data.beds.length);

  return (
    <div className="garden-shop">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-bold">씨앗 상점</h2>
        <p className="text-[12px] tabular-nums text-smoke">새 진열까지 {formatLeft(restock)}</p>
      </div>

      <ul className="mt-3 space-y-2">
        {items.map((item) => {
          const species = byId.get(item.speciesId);
          if (!species) return null;
          const left = item.stock - (bought[item.speciesId] ?? 0);
          const price = SEED_PRICE[species.tier];
          const rare = species.tier === "flagship" || species.tier === "perennial";
          return (
            <li
              key={item.speciesId}
              className={`flex items-center gap-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3 ${
                rare ? "ring-2 ring-[var(--g-jam)]" : ""
              }`}
            >
              <span className="garden-seed-packet"><PlantArt species={species} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold">{species.title}</p>
                <p className="text-[11.5px] text-smoke">
                  {TIER_LABEL[species.tier]} · 남은 {left}개
                </p>
              </div>
              <button
                type="button"
                disabled={left <= 0 || data.jam < price}
                onClick={() => { if (buy(species, slot, item.stock)) { gardenFeedback("reward"); say(`${fruitIcon(species)} 씨앗을 샀어요`); } }}
                className="shrink-0 rounded-full bg-[var(--g-jam)] px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-35"
              >
                {left <= 0 ? "품절" : `🍯 ${price}`}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[11.5px] leading-relaxed text-smoke">
        진열 확률 (칸마다):{" "}
        {SHOP_ODDS.map((o) => `${TIER_LABEL[o.tier]} ${Math.round(o.p * 100)}%`).join(" · ")}. 잼은 정원 안에서만
        쓰이고, 돈으로 사거나 다른 사람과 주고받을 수 없습니다.
      </p>

      {nextPlot && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
          <span className="text-2xl">🪴</span>
          <div className="min-w-0 flex-1 text-[13px]">
            <p className="font-semibold">텃밭 넓히기</p>
            <p className="text-[11.5px] text-smoke">
              {data.beds.length}칸 → {nextPlot.plots}칸
            </p>
          </div>
          <button
            type="button"
            disabled={data.jam < nextPlot.price}
            onClick={() => { if (upgrade()) { gardenFeedback("reward"); say("🪴 텃밭이 넓어졌어요"); } }}
            className="shrink-0 rounded-full bg-[var(--g-jam)] px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-35"
          >
            🍯 {nextPlot.price}
          </button>
        </div>
      )}
    </div>
  );
}
