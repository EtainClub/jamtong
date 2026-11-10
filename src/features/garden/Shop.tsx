"use client";

import { PlantArt } from "./GardenArt";
import { gardenFeedback } from "./feedback";

import {
  FINISHER_ORDER,
  FINISHERS,
  josa,
  RAID_HITS_PER_PERSON,
  fruitIcon,
  formatLeft,
  isNewVariety,
  kstDay,
  monsoonSpecies,
  NEW_VARIETY_BONUS,
  NEW_VARIETY_DAYS,
  PLOT_UPGRADES,
  SEED_PRICE,
  SHOP_ODDS,
  SHOP_SLOT,
  shopFor,
  shopSlot,
  TIER_LABEL,
  TOOL_ORDER,
  TOOLS,
} from "./rules";
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
  const { buy, upgrade, buyTool, buyFinisher } = useGarden.getState();
  const slot = shopSlot(now);
  // 장마 여부는 슬롯 시작 시각으로 본다. 슬롯 안에서 진열이 바뀌지 않게, 모두가 같게.
  const monsoon = monsoonSpecies(slot * SHOP_SLOT, catalog);
  const items = shopFor(slot, catalog, monsoon);
  const bought = data.shop.slot === slot ? data.shop.bought : {};
  const restock = (slot + 1) * SHOP_SLOT - now;
  const nextPlot = PLOT_UPGRADES.find((u) => u.plots > data.beds.length);

  return (
    <div className="garden-shop">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-bold">씨앗 상점</h2>
        <p className="text-[12px] tabular-nums text-smoke">새 진열까지 {formatLeft(restock)}</p>
      </div>

      {monsoon.length > 0 && (
        <p className="garden-monsoon mt-3 rounded-2xl px-3.5 py-2.5 text-[12.5px] font-semibold leading-relaxed text-white">
          🌦 신품종 장마 — 오늘 들어온 {monsoon.length}품종이 앞 칸에 꼭 나와요
        </p>
      )}

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
                <p className="truncate text-[13.5px] font-semibold">
                  {isNewVariety(species, now) && (
                    <span className="garden-chip garden-chip-new mr-1 rounded-full px-1.5 py-0.5 align-[1px] text-[10px]">신품종</span>
                  )}
                  {species.title}
                </p>
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
        {SHOP_ODDS.map((o) => `${TIER_LABEL[o.tier]} ${Math.round(o.p * 100)}%`).join(" · ")}. 신품종 장마(품종이 들어온
        날 19:00–20:00)에는 그날 들어온 품종이 앞 3칸에 먼저 나와요. 신품종 열매는 들어온 날부터 {NEW_VARIETY_DAYS}일
        동안 잼이 {Math.round(NEW_VARIETY_BONUS * 100)}% 더 나와요. 잼은 정원 안에서만
        쓰이고, 돈으로 사거나 다른 사람과 주고받을 수 없습니다.
      </p>

      <section aria-labelledby="garden-tools" className="mt-6">
        <h3 id="garden-tools" className="text-[14px] font-bold">도구</h3>
        <p className="mt-0.5 text-[11.5px] text-smoke">늘 같은 값으로 팔아요. 무작위는 없어요.</p>
        <div className="mt-2 space-y-2">
          {TOOL_ORDER.map((id) => {
            const tool = TOOLS[id];
            const today = kstDay(now);
            const used = data.tools.day === today ? (data.tools.bought[id] ?? 0) : 0;
            const left = tool.perDay - used;
            const have = data.tools.have[id] ?? 0;
            return (
              <div key={id} className="flex items-center gap-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
                <span className="text-[28px] leading-none" aria-hidden="true">{tool.icon}</span>
                <div className="min-w-0 flex-1 text-[13px]">
                  <p className="font-semibold">
                    {tool.label} <span className="font-normal text-smoke">· 가진 것 {have}개</span>
                  </p>
                  <p className="text-[11.5px] leading-relaxed text-smoke">
                    {tool.hint} 텃밭에서 작물을 누르면 쓸 수 있어요. 오늘 {left}개 더 살 수 있어요.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={left <= 0 || data.jam < tool.price}
                  onClick={() => { if (buyTool(id)) { gardenFeedback("reward"); say(`${tool.icon} ${tool.label}를 샀어요`); } }}
                  className="shrink-0 rounded-full bg-[var(--g-jam)] px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-35"
                >
                  {left <= 0 ? "오늘 끝" : `🍯 ${tool.price}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="garden-finishers" className="mt-6">
        <h3 id="garden-finishers" className="text-[14px] font-bold">거대 잡초 필살기</h3>
        <p className="mt-0.5 text-[11.5px] leading-relaxed text-smoke">
          광장에 거대 잡초가 나타났을 때 싸움터 아래 단추로 써요. 여러 방을 한 번에 넣지만, 한 사람이 칠 수 있는{" "}
          {RAID_HITS_PER_PERSON}방 안에서만 들어가요 — 필살기가 있어도 혼자서는 쓰러뜨릴 수 없어요. 늘 같은 값, 무작위 없음.
        </p>
        <div className="mt-2 space-y-2">
          {FINISHER_ORDER.map((id) => {
            const item = FINISHERS[id];
            const today = kstDay(now);
            const used = data.finishers.day === today ? (data.finishers.bought[id] ?? 0) : 0;
            const left = item.perDay - used;
            const have = data.finishers.have[id] ?? 0;
            return (
              <div key={id} className="flex items-center gap-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
                <span className="text-[28px] leading-none" aria-hidden="true">{item.icon}</span>
                <div className="min-w-0 flex-1 text-[13px]">
                  <p className="font-semibold">
                    {item.label} <span className="font-normal text-smoke">· 가진 것 {have}개</span>
                  </p>
                  <p className="text-[11.5px] leading-relaxed text-smoke">
                    내 몫에서 {item.hits}방을 한꺼번에. 오늘 {left}개 더 살 수 있어요.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={left <= 0 || data.jam < item.price}
                  onClick={() => { if (buyFinisher(id)) { gardenFeedback("reward"); say(`${item.icon} ${josa(item.label, "을를")} 샀어요`); } }}
                  className="shrink-0 rounded-full bg-[var(--g-jam)] px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-35"
                >
                  {left <= 0 ? "오늘 끝" : `🍯 ${item.price}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

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
